import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { usePosContextoo } from "../../context/PosContexto";
import { obtenerCotizacionParaVenta } from "../../services/PosService";
import { getErrorMessage } from "@/lib/errorHandler";

type CotizacionParaVenta = Awaited<ReturnType<typeof obtenerCotizacionParaVenta>>;

function avisarStockInsuficiente(items: CotizacionParaVenta["items"]) {
  const sinStock = items.filter((item) => item.cantidad > Number(item.producto.stock));
  if (sinStock.length === 0) return;

  toast.warning("Stock insuficiente", {
    description: sinStock
      .map((item) => `${item.producto.nombre}: disponible ${Number(item.producto.stock)}, cotizado ${item.cantidad}`)
      .join(" · "),
  });
}

export function useCargarCotizacionPOS(establecerDescuento: (monto: number) => void) {
  const [searchParams, setSearchParams] = useSearchParams();
  const cotizacionId = Number(searchParams.get("cotizacion")) || null;
  const { funciones: { cargarDesdeCotizacion } } = usePosContextoo();

  useEffect(() => {
    if (!cotizacionId) return;
    let cancelado = false;

    const cargar = async () => {
      try {
        const data = await obtenerCotizacionParaVenta(cotizacionId);
        if (cancelado) return;

        cargarDesdeCotizacion(data);
        establecerDescuento(data.descuento);
        avisarStockInsuficiente(data.items);
        toast.success(`Cotización ${data.cotizacion.serie}-${data.cotizacion.correlativo} cargada en el carrito`);
      } catch (error) {
        if (!cancelado) toast.error(getErrorMessage(error, "No se pudo cargar la cotización"));
      } finally {
        if (!cancelado) setSearchParams({}, { replace: true });
      }
    };

    cargar();

    return () => {
      cancelado = true;
    };
  }, [cotizacionId]);
}
