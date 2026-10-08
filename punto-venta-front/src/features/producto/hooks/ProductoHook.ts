import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { listarProductos, eliminarProducto } from "../services/ProductoService";
import { getErrorMessage } from "@/lib/errorHandler";
import type { ProductoType, StatsType, FiltrosProductosType  } from "../types/ProductoType";
import { listarSelectCategoria } from "@/features/categoria/services/CategoriaService";
import { useDebounce } from "@/hooks/useDebounce";


export const useProductoHook = () => {
  const queryClient = useQueryClient();
  const [pagina, setPagina] = useState(1);
  const [filtros, setFiltros] = useState<FiltrosProductosType>({
    categoria_id: null as number | null,
    disponibilidad: undefined,
    stock: "todos",
    search: "",
  });

  const [searchTerm, setSearchTerm] = useState(filtros.search || "");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    setFiltros((prev) =>
      prev.search === debouncedSearchTerm
        ? prev
        : { ...prev, search: debouncedSearchTerm }
    );
  }, [debouncedSearchTerm]);

  useEffect(() => {
    setSearchTerm(filtros.search || "");
  }, [filtros.search]);

  const { data, isLoading } = useQuery({
    queryKey: ["productos", pagina, filtros],
    queryFn: () => listarProductos(pagina, filtros),
  });

  const productos: ProductoType[] = data?.productos?.data ?? [];
  const totalPaginas: number = data?.productos?.last_page ?? 1;
  const total: number = data?.productos?.total ?? 0;
  const stats: StatsType = data?.stats;

  const { mutateAsync: eliminar } = useMutation({
    mutationFn: (id: number) => eliminarProducto(id),
    onSuccess: () => {
      toast.success("Producto eliminado correctamente");
      if (productos.length === 1 && pagina > 1) setPagina((p) => p - 1);
      else queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Error al eliminar el producto")),
  });

  return {
    datos: { productos, isLoading, total, stats },
    paginacion: { pagina, totalPaginas, setPagina },
    filtrosState: { filtros, setFiltros, searchTerm, setSearchTerm },
    eliminar,
    listarSelectCategoria
  };
};

