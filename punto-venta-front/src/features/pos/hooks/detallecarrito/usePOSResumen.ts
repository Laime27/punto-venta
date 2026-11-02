import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePosHook } from "./PosHook";
import { useMetodosPago } from "./useMetodosPago";
import { useTotales } from "./useTotales";
import { usePosContextoo } from "../../context/PosContexto";
import { fechaHoy, useCuotas } from "./useCuotas";
import { toast } from "sonner";
import { registrarVenta } from "../../services/PosService";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import { getErrorMessage } from "@/lib/errorHandler";
import { useImprimirComprobanteHook } from "@/features/comprobante/hooks/useImprimirComprobanteHook";
import { useCargarCotizacionPOS } from "./useCargarCotizacionPOS";

export function usePOSResumen() {
  const { simbolo } = useMonedaHook();
  const { listaMetodoPago, cajaActiva } = usePosHook();
  const queryClient = useQueryClient();
  const { imprimirComprobante } = useImprimirComprobanteHook();
  const {
    estado: { clienteSeleccionado, carrito, cotizacionOrigen },
    funciones: { reiniciarCarrito },
  } = usePosContextoo();
  const cuotasHook = useCuotas();
  const paymentMethodsHook = useMetodosPago();
  const adelantoMethodsHook = useMetodosPago();

  const [tipoVenta, setTipoVenta] = useState("contado");
  const [confirmarCancelarAbierto, setConfirmarCancelarAbierto] = useState(false);
  const idempotencyKey = useRef(crypto.randomUUID());

  const totalsHook = useTotales(
    tipoVenta === "contado"
      ? paymentMethodsHook.estado.pagosAgregados
      : adelantoMethodsHook.estado.pagosAgregados
  );

  const mutationVenta = useMutation({
    mutationFn: registrarVenta,
  });

  // El carrito y el cliente los carga el contexto; aquí se limpian pagos y cuotas previos y se aplica el descuento
  useCargarCotizacionPOS((descuento) => {
    paymentMethodsHook.acciones.reiniciar();
    adelantoMethodsHook.acciones.reiniciar();
    cuotasHook.reiniciar();
    setTipoVenta("contado");
    totalsHook.acciones.establecerDescuento(descuento);
  });

  const hayVentaEnCurso =
    carrito.length > 0 ||
    clienteSeleccionado !== null ||
    paymentMethodsHook.estado.pagosAgregados.length > 0 ||
    adelantoMethodsHook.estado.pagosAgregados.length > 0 ||
    cuotasHook.cuotas.length > 0 ||
    totalsHook.estado.descuento > 0;

  const reiniciarVenta = () => {
    reiniciarCarrito();
    paymentMethodsHook.acciones.reiniciar();
    adelantoMethodsHook.acciones.reiniciar();
    cuotasHook.reiniciar();
    totalsHook.acciones.reiniciar();
    setTipoVenta("contado");
  };

  const abrirConfirmarCancelar = () => setConfirmarCancelarAbierto(true);
  const cerrarConfirmarCancelar = () => setConfirmarCancelarAbierto(false);

  const cancelarVenta = () => {
    reiniciarVenta();
    toast.info("Venta cancelada");
  };

  const validarVenta = (): boolean => {
    if (!cajaActiva) {
      toast.error("Debe abrir una caja antes de registrar ventas.");
      return false;
    }

    if (carrito.length === 0) {
      toast.error("El carrito está vacío");
      return false;
    }

    if (tipoVenta === "contado") {
      const { porPagar } = totalsHook.estado;
      if (porPagar > 0) {
        toast.error(`Falta pagar ${simbolo} ${porPagar.toFixed(2)}`);
        return false;
      }
      if (paymentMethodsHook.estado.pagosAgregados.length === 0) {
        toast.error("Debe agregar al menos un método de pago");
        return false;
      }
    } else {
      const { porPagar } = totalsHook.estado;
      const totalCuotas = cuotasHook.cuotas.reduce(
        (sum, cuota) => sum + (Number(cuota.monto) || 0),
        0
      );

      if (cuotasHook.cuotas.length === 0) {
        toast.error("Debe agregar al menos una cuota");
        return false;
      }

      if (cuotasHook.cuotas.some((cuota) => !(Number(cuota.monto) > 0))) {
        toast.error("Todas las cuotas deben tener un monto mayor a 0");
        return false;
      }

      // Las fechas YYYY-MM-DD se pueden comparar como texto
      if (cuotasHook.cuotas.some((cuota) => !cuota.fecha || cuota.fecha < fechaHoy())) {
        toast.error("La fecha de las cuotas no puede ser anterior a hoy");
        return false;
      }

      if (Math.abs(totalCuotas - porPagar) > 0.01) {
        toast.error(
          `La suma de las cuotas (${simbolo} ${totalCuotas.toFixed(
            2
          )}) debe ser igual al monto por pagar (${simbolo} ${porPagar.toFixed(2)})`
        );
        return false;
      }
    }

    if(totalsHook.estado.totalCobrar <= 0) {
      toast.error("El total a cobrar debe ser mayor a 0");
      return false;
    }

    return true;
  };

  const completarVenta = async () => {
    if (!validarVenta()) return;

    const pagosSeleccionados = tipoVenta === "contado"
      ? paymentMethodsHook.estado.pagosAgregados
      : adelantoMethodsHook.estado.pagosAgregados;

    const ventaData = {
      codigo_unico: idempotencyKey.current,
      cliente_id: clienteSeleccionado ? clienteSeleccionado.id : null,
      cotizacion_id: cotizacionOrigen?.id ?? null,
      carrito: carrito.map(item => ({
        producto_id: item.id,
        cantidad: item.cantidad,
        precio: item.precio_usado,
        subtotal: item.subtotal
      })),
      tipoVenta,
      pagos: pagosSeleccionados.map(p => ({
        metodo_pago_id: p.metodo.id,
        monto: p.monto
      })),
      ...(tipoVenta !== "contado" && {
        cuotas: cuotasHook.cuotas.map((c) => ({
          fecha: c.fecha,
          monto: Number(c.monto),
        })),
      }),
      totales: {
        subtotal: totalsHook.estado.subtotal,
        descuento: totalsHook.estado.descuento,
        total: totalsHook.estado.totalCobrar,
      },
    };

    try {
      const respuesta = await mutationVenta.mutateAsync(ventaData);
      idempotencyKey.current = crypto.randomUUID();
      queryClient.invalidateQueries({ queryKey: ["caja"] });
      queryClient.invalidateQueries({ queryKey: ["productos-select"] });
      if (cotizacionOrigen) {
        queryClient.invalidateQueries({ queryKey: ["cotizaciones"] });
        queryClient.invalidateQueries({ queryKey: ["cotizacion", cotizacionOrigen.id] });
      }
      reiniciarVenta();
      toast.success("Venta registrada con éxito");

      // La venta ya quedó registrada: si la impresión falla solo se avisa, se puede reimprimir desde comprobantes
      if (respuesta?.data?.id) void imprimirComprobante(respuesta.data.id);
    } catch (error) {
      // Si falló por stock, el buscador vuelve a traer el stock actualizado
      queryClient.invalidateQueries({ queryKey: ["productos-select"] });
      toast.error(getErrorMessage(error, "Error al registrar la venta"));
    }
  };

  return {
    estado: {
      tipoVenta,
      listaMetodoPago,
      clienteSeleccionado,
      carrito,
      estaCargandoVenta: mutationVenta.isPending,
      cajaActiva,
      hayVentaEnCurso,
      cotizacionOrigen,
      confirmarCancelarAbierto,
    },
    modificadores: {
      setTipoVenta,
      abrirConfirmarCancelar,
      cerrarConfirmarCancelar,
    },
    hooks: {
      cuotasHook,
      paymentMethodsHook,
      adelantoMethodsHook,
      totalsHook,
    },
    funciones: {
      completarVenta,
      cancelarVenta,
    },
  };
}
