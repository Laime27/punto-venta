import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { obtenerComprobante, abonarCredito } from "../services/ComprobanteService";
import { usePosHook } from "@/features/pos/hooks/detallecarrito/PosHook";
import type {
  ComprobanteType,
  ComprobanteCreditoType,
  AbonarCreditoPayload,
} from "../types/ComprobanteType";
import type { MetodoPagoType } from "@/features/metodopago/types/MetodopagoType";

export interface PagoAgregadoAbono {
  id: string;
  metodo_pago_id: number;
  metodo_nombre: string;
  monto: number;
}

export function useComprobanteAbonar() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [cuotaSeleccionadaId, setCuotaSeleccionadaId] = useState<number | null>(null);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState<MetodoPagoType | null>(null);
  const [monto, setMonto] = useState<string>("");
  const [pagosAgregados, setPagosAgregados] = useState<PagoAgregadoAbono[]>([]);
  const [estaEnviando, setEstaEnviando] = useState(false);

  const comprobanteIdNumero = Number(id);

  const {
    data: comprobante,
    isLoading: cargandoComprobante,
    error: errorComprobante,
  } = useQuery<ComprobanteType>({
    queryKey: ["comprobante", comprobanteIdNumero],
    queryFn: () => obtenerComprobante(comprobanteIdNumero),
    enabled: Boolean(comprobanteIdNumero && !isNaN(comprobanteIdNumero)),
  });

  const { listaMetodoPago: metodosPago, isLoading: cargandoMetodos } = usePosHook();

  const cuotas = comprobante?.creditos ?? [];

  useEffect(() => {
    if (cuotas.length > 0 && cuotaSeleccionadaId === null) {
      const primeraPendiente = cuotas.find(
        (c) => Number(c.saldo_pendiente) > 0 && c.estado !== "pagado"
      );
      if (primeraPendiente) {
        setCuotaSeleccionadaId(primeraPendiente.id);
      } else if (cuotas[0]) {
        setCuotaSeleccionadaId(cuotas[0].id);
      }
    }
  }, [cuotas, cuotaSeleccionadaId]);

  const cuotaSeleccionada = cuotas.find((c) => c.id === cuotaSeleccionadaId) ?? null;
  const saldoPendienteCuota = Number(cuotaSeleccionada?.saldo_pendiente || 0);

  const totalAbonado = Number(
    pagosAgregados.reduce((acc, p) => acc + p.monto, 0).toFixed(2)
  );

  const saldoRestante = Math.max(0, Number((saldoPendienteCuota - totalAbonado).toFixed(2)));

  const saldoTotalComprobante = Number(
    cuotas.reduce((acc, c) => acc + Number(c.saldo_pendiente || 0), 0).toFixed(2)
  );

  const seleccionarCuota = (cuota: ComprobanteCreditoType) => {
    if (cuota.id === cuotaSeleccionadaId) return;
    setCuotaSeleccionadaId(cuota.id);
    setPagosAgregados([]);
    setMetodoSeleccionado(null);
    setMonto("");
  };

  const seleccionarMetodo = (metodo: MetodoPagoType) => {
    setMetodoSeleccionado(metodo);
    if (!monto || Number(monto) === 0) {
      setMonto(saldoRestante > 0 ? String(saldoRestante) : "");
    }
  };

  const cambiarMonto = (valor: string) => {
    if (valor === "" || /^\d*\.?\d{0,2}$/.test(valor)) {
      setMonto(valor);
    }
  };

  const agregarPago = () => {
    if (!metodoSeleccionado) {
      toast.error("Seleccione un método de pago.");
      return;
    }

    const montoNumero = Number(monto);
    if (isNaN(montoNumero) || montoNumero <= 0) {
      toast.error("Ingrese un monto válido mayor a 0.");
      return;
    }

    if (montoNumero > saldoRestante) {
      toast.error(`El monto no puede superar el saldo restante de ${saldoRestante.toFixed(2)}.`);
      return;
    }

    const nuevoPago: PagoAgregadoAbono = {
      id: Math.random().toString(36).substring(2, 9),
      metodo_pago_id: metodoSeleccionado.id,
      metodo_nombre: metodoSeleccionado.nombre,
      monto: Number(montoNumero.toFixed(2)),
    };

    const nuevosPagos = [...pagosAgregados, nuevoPago];
    setPagosAgregados(nuevosPagos);

    const nuevoTotalAbonado = Number(
      nuevosPagos.reduce((acc, p) => acc + p.monto, 0).toFixed(2)
    );
    const nuevoRestante = Math.max(0, Number((saldoPendienteCuota - nuevoTotalAbonado).toFixed(2)));

    setMetodoSeleccionado(null);
    setMonto(nuevoRestante > 0 ? String(nuevoRestante) : "");
  };

  const eliminarPago = (idPago: string) => {
    const pagosFiltrados = pagosAgregados.filter((p) => p.id !== idPago);
    setPagosAgregados(pagosFiltrados);

    const nuevoTotalAbonado = Number(
      pagosFiltrados.reduce((acc, p) => acc + p.monto, 0).toFixed(2)
    );
    const nuevoRestante = Math.max(0, Number((saldoPendienteCuota - nuevoTotalAbonado).toFixed(2)));
    if (metodoSeleccionado) {
      setMonto(nuevoRestante > 0 ? String(nuevoRestante) : "");
    }
  };

  const registrarAbono = async () => {
    if (!cuotaSeleccionada) {
      toast.error("Seleccione una cuota para abonar.");
      return;
    }

    if (pagosAgregados.length === 0) {
      toast.error("Debe agregar al menos un pago.");
      return;
    }

    if (totalAbonado <= 0) {
      toast.error("El monto total del abono debe ser mayor a 0.");
      return;
    }

    if (totalAbonado > saldoPendienteCuota) {
      toast.error("El monto total ingresado supera el saldo pendiente de la cuota.");
      return;
    }

    try {
      setEstaEnviando(true);
      const payload: AbonarCreditoPayload = {
        pagos: pagosAgregados.map((p) => ({
          metodo_pago_id: p.metodo_pago_id,
          monto: p.monto,
        })),
      };

      const res = await abonarCredito(cuotaSeleccionada.id, payload);
      toast.success(res?.message || "Abono registrado exitosamente.");

      queryClient.invalidateQueries({ queryKey: ["comprobantes"] });
      queryClient.invalidateQueries({ queryKey: ["caja"] });

      navigate("/comprobante");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Ocurrió un error al registrar el abono."
      );
    } finally {
      setEstaEnviando(false);
    }
  };

  const volver = () => {
    navigate("/comprobante");
  };

  const puedeAgregarPago =
    Boolean(metodoSeleccionado) && Boolean(monto) && Number(monto) > 0 && Number(monto) <= saldoRestante;

  const puedeRegistrarAbono =
    Boolean(cuotaSeleccionada) && pagosAgregados.length > 0 && totalAbonado > 0 && !estaEnviando;

  return {
    estado: {
      comprobante,
      cuotas,
      cuotaSeleccionada,
      metodosPago,
      metodoSeleccionado,
      monto,
      pagosAgregados,
      estaCargando: cargandoComprobante || cargandoMetodos,
      estaEnviando,
      errorComprobante,
      saldoPendienteCuota,
      totalAbonado,
      saldoRestante,
      saldoTotalComprobante,
      puedeAgregarPago,
      puedeRegistrarAbono,
    },
    funciones: {
      volver,
      seleccionarCuota,
      seleccionarMetodo,
      cambiarMonto,
      agregarPago,
      eliminarPago,
      registrarAbono,
    },
  };
}
