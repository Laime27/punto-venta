import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorHandler";
import { descargarArchivo } from "@/lib/utils";
import { exportarKardex, obtenerKardex } from "../services/KardexService";
import { filtrosKardexSchema } from "../validations/KardexValidation";
import type { FiltrosKardexType } from "../types/KardexType";

const FILTROS_INICIALES: FiltrosKardexType = { fecha_inicio: "", fecha_fin: "" };

export const useKardexHook = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const productoId = Number(id);

  const [pagina, setPagina] = useState(1);
  const [filtros, setFiltros] = useState<FiltrosKardexType>(FILTROS_INICIALES);

  const validacion = filtrosKardexSchema.safeParse(filtros);
  const errorFechas = validacion.success ? null : validacion.error.issues[0]?.message ?? null;

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["kardex", productoId, pagina, filtros],
    queryFn: () => obtenerKardex(productoId, pagina, filtros),
    enabled: !!productoId && !errorFechas,
    placeholderData: keepPreviousData,
  });

  const { mutate: exportar, isPending: exportando } = useMutation({
    mutationFn: () => exportarKardex(productoId, filtros),
    onSuccess: (archivo) => descargarArchivo(archivo, `kardex_${data?.producto.nombre ?? productoId}.xlsx`),
    onError: (error) => toast.error(getErrorMessage(error, "No se pudo exportar el kardex")),
  });

  const cambiarFiltros = (nuevos: Partial<FiltrosKardexType>) => {
    setFiltros((prev) => ({ ...prev, ...nuevos }));
    setPagina(1);
  };

  const limpiarFiltros = () => {
    setFiltros(FILTROS_INICIALES);
    setPagina(1);
  };

  return {
    estado: {
      producto: data?.producto,
      resumen: data?.resumen,
      movimientos: data?.movimientos.data ?? [],
      isLoading,
      isFetching,
      isError,
      exportando,
    },
    paginacion: {
      pagina,
      totalPaginas: data?.movimientos.last_page ?? 1,
      setPagina,
    },
    filtros: {
      valores: filtros,
      errorFechas,
      tieneFiltrosActivos: Boolean(filtros.fecha_inicio || filtros.fecha_fin),
      cambiarFiltros,
      limpiarFiltros,
    },
    funciones: {
      exportar: () => exportar(),
      volver: () => navigate("/producto"),
    },
  };
};
