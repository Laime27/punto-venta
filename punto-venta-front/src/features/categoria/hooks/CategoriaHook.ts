import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  listarCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  obtenerCategoriaId,
} from "../services/CategoriaService";
import type { CategoriaType } from "../types/CategoriaType";
import { getErrorMessage } from "@/lib/errorHandler";
import { useDebounce } from "@/hooks/useDebounce";

export const useCategoriaHook = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<CategoriaType | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isLoading } = useQuery({
    queryKey: ["categorias", page, debouncedSearchTerm],
    queryFn: () => listarCategoria(page, debouncedSearchTerm),
  });

  const categorias: CategoriaType[] = data?.data ?? [];
  const totalPages: number = data?.last_page ?? 1;
  const total: number = data?.total ?? 0;

  const { mutateAsync: crear } = useMutation({
    mutationFn: (nombre: string) => crearCategoria(nombre),
    onSuccess: () => {
      toast.success("Categoria creada correctamente");
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Error al crear la categoría")),
  });

  const { mutateAsync: actualizar } = useMutation({
    mutationFn: ({ id, nombre }: { id: number; nombre: string }) => actualizarCategoria(id, nombre),
    onSuccess: () => {
      toast.success("Categoria actualizada correctamente");
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Error al actualizar la categoría")),
  });

  const { mutate: eliminar } = useMutation({
    mutationFn: (id: number) => eliminarCategoria(id),
    onSuccess: () => {
      toast.success("Categoria eliminada correctamente");
      if (categorias.length === 1 && page > 1) setPage((p) => p - 1);
      else queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Error al eliminar la categoría")),
  });

  const abrirCrear = () => {
    setSelected(null);
    setModalOpen(true);
  };

  const abrirEditar = async (id: number) => {
    try {
      const categoria = await queryClient.fetchQuery({
        queryKey: ["categoria", id],
        queryFn: () => obtenerCategoriaId(id),
      });
      setSelected(categoria);
      setModalOpen(true);
    } catch {
      toast.error("Error al obtener la categoria");
    }
  };

  const cerrarModal = () => setModalOpen(false);

  const onModalSubmit = async (nombre: string) => {
    if (selected) {
      await actualizar({ id: selected.id, nombre });
    } else {
      await crear(nombre);
    }
    cerrarModal();
  };

  return {
    data: { categorias, isLoading, total },
    pagination: { page, totalPages, setPage },
    searchTerm,
    setSearchTerm,
    modal: { modalOpen, selected, abrirCrear, abrirEditar, cerrarModal, onModalSubmit },
    eliminar,
  };
};