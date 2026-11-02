import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listarOrdenesCompra } from "../../services/OrdenCompraService";
import type { OrdenCompraType } from "../../types/OrdenCompraType";

export const useOrdenCompraListar = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["ordenesCompra", page],
    queryFn: () => listarOrdenesCompra(page),
  });

  const ordenesCompra: OrdenCompraType[] = data?.data ?? [];
  const totalPages: number = data?.last_page ?? 1;
  const total: number = data?.total ?? 0;

  return {
    data: { ordenesCompra, isLoading, total },
    pagination: { page, totalPages, setPage },
  };
};
