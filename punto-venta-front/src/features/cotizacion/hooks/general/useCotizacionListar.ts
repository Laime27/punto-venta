import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listarCotizaciones } from "../../services/CotizacionService";
import type { CotizacionType } from "../../types/CotizacionType";

export const useCotizacionListar = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["cotizaciones", page],
    queryFn: () => listarCotizaciones(page),
  });

  const cotizaciones: CotizacionType[] = data?.data ?? [];
  const totalPages: number = data?.last_page ?? 1;
  const total: number = data?.total ?? 0;

  return {
    data: { cotizaciones, isLoading, total },
    pagination: { page, totalPages, setPage },
  };
};
