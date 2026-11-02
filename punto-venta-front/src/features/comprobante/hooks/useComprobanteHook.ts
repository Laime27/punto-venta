import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { listarComprobantes } from "../services/ComprobanteService";
import type {
  FiltrosComprobanteType,
  ComprobanteType,
  ComprobanteMetricasType,
} from "../types/ComprobanteType";

const FILTROS_INICIALES: FiltrosComprobanteType = {
  search: "",
  estado: "todos",
  forma_pago: "todos",
  fecha_inicio: "",
  fecha_fin: "",
  cliente_id: null,
  per_page: 10,
};

const METRICAS_INICIALES: ComprobanteMetricasType = {
  total_ventas: 0,
  total_comprobantes: 0,
  total_contado: 0,
  total_credito: 0,
  total_pendiente_cobro: 0,
  total_anulados: 0,
  monto_anulado: 0,
};

export const useComprobanteHook = () => {
  const [pagina, setPagina] = useState(1);
  const [search, setSearch] = useState("");
  const [filtros, setFiltros] = useState<FiltrosComprobanteType>(FILTROS_INICIALES);

  const [detalleId, setDetalleId] = useState<number | null>(null);
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);

  const [comprobanteAnular, setComprobanteAnular] = useState<ComprobanteType | null>(null);
  const [modalAnularOpen, setModalAnularOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: [
      "comprobantes",
      pagina,
      debouncedSearch,
      filtros.estado,
      filtros.forma_pago,
      filtros.fecha_inicio,
      filtros.fecha_fin,
      filtros.cliente_id,
      filtros.per_page,
    ],
    queryFn: () =>
      listarComprobantes(pagina, {
        ...filtros,
        search: debouncedSearch,
      }),
  });

  const comprobantes: ComprobanteType[] = data?.comprobantes?.data ?? [];
  const totalPaginas: number = data?.comprobantes?.last_page ?? 1;
  const total: number = data?.comprobantes?.total ?? 0;
  const metricas: ComprobanteMetricasType = data?.metricas ?? METRICAS_INICIALES;

  const handleFiltrosChange = (nuevosFiltros: Partial<FiltrosComprobanteType>) => {
    setFiltros((prev) => ({ ...prev, ...nuevosFiltros }));
    setPagina(1);
  };

  const limpiarFiltros = () => {
    setSearch("");
    setFiltros(FILTROS_INICIALES);
    setPagina(1);
  };

  const abrirDetalle = (id: number) => {
    setDetalleId(id);
    setModalDetalleOpen(true);
  };

  const cerrarDetalle = () => {
    setModalDetalleOpen(false);
    setDetalleId(null);
  };

  const abrirAnular = (comprobante: ComprobanteType) => {
    setComprobanteAnular(comprobante);
    setModalAnularOpen(true);
  };

  const cerrarAnular = () => {
    setModalAnularOpen(false);
    setComprobanteAnular(null);
  };

  return {
    datos: {
      comprobantes,
      metricas,
      total,
      isLoading,
      isFetching,
      refetch,
    },
    paginacion: {
      pagina,
      totalPaginas,
      setPagina,
    },
    filtrosState: {
      search,
      debouncedSearch,
      setSearch: (term: string) => {
        setSearch(term);
        setPagina(1);
      },
      filtros,
      setFiltros: handleFiltrosChange,
      limpiarFiltros,
    },
    modales: {
      detalleId,
      modalDetalleOpen,
      abrirDetalle,
      cerrarDetalle,
      comprobanteAnular,
      modalAnularOpen,
      abrirAnular,
      cerrarAnular,
    },
  };
};
