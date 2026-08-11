import { useState } from "react";
import { usePosHook } from "./PosHook";
import { usePaymentMethods } from "./usePaymentMethods";
import { useTotals } from "./useTotals";
import { usePosContext } from "../../context/PosContext";
import { useCuotas } from "./useCuotas";
import { toast } from "sonner";

export function usePOSSummary() {
  const { listaMetodoPago } = usePosHook();
  const { estado: { clienteSeleccionado, carrito } } = usePosContext();
  const cuotasHook = useCuotas();
  const paymentMethodsHook = usePaymentMethods();

  const [tipoVenta, setTipoVenta] = useState("contado");

  const totalsHook = useTotals(
    tipoVenta === "contado" ? paymentMethodsHook.estado.pagosAgregados : []
  );

  const completarVenta = () => {
    
    if (carrito.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }

    if (tipoVenta === "contado") {
      const { porPagar } = totalsHook.estado;
      if (porPagar > 0) {
        toast.error(`Falta pagar S/ ${porPagar.toFixed(2)}`);
        return;
      }
    } else {
      const { totalCobrar } = totalsHook.estado;
      const totalCuotas = cuotasHook.cuotas.reduce(
        (sum, cuota) => sum + (Number(cuota.monto) || 0),
        0
      );

      if (cuotasHook.cuotas.length === 0) {
        toast.error("Debe agregar al menos una cuota");
        return;
      }

      if (Math.abs(totalCuotas - totalCobrar) > 0.01) {
        toast.error(
          `La suma de las cuotas (S/ ${totalCuotas.toFixed(
            2
          )}) debe ser igual al total a cobrar (S/ ${totalCobrar.toFixed(2)})`
        );
        return;
      }
    }

    // Si pasa las validaciones, mostramos los datos
    console.log("=== VENTA VALIDADA Y COMPLETADA ===");
    console.log("Cliente Seleccionado:", clienteSeleccionado);
    console.log("Productos en Carrito:", carrito);
    console.log("Tipo de Venta:", tipoVenta);
    if (tipoVenta === "contado") {
      console.log("Pagos Agregados:", paymentMethodsHook.estado.pagosAgregados);
    } else {
      console.log("Cuotas Programadas:", cuotasHook.cuotas);
    }
    console.log("Resumen de Totales:", totalsHook.estado);
    console.log("===================================");
    toast.success("Venta completada con éxito (ver consola)");
  };

  return {
    estado: {
      tipoVenta,
      listaMetodoPago,
      clienteSeleccionado,
      carrito,
    },
    modificadores: {
      setTipoVenta,
    },
    hooks: {
      cuotasHook,
      paymentMethodsHook,
      totalsHook,
    },
    funciones: {
      completarVenta,
    },
  };
}
