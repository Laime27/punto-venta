import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  listarProveedor,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor,
  obtenerProveedorId,
} from "../services/ProveedorService";
import type { ProveedorType } from "../types/ProveedorType";
import { getErrorMessage } from "@/lib/errorHandler";
import { useDebounce } from "@/hooks/useDebounce";

export const useProveedorHook = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<ProveedorType | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isLoading } = useQuery({
    queryKey: ["proveedores", page, debouncedSearchTerm],
    queryFn: () => listarProveedor(page, debouncedSearchTerm),
  });

  const proveedores: ProveedorType[] = data?.data ?? [];
  const totalPages: number = data?.last_page ?? 1;
  const total: number = data?.total ?? 0;

  const { mutateAsync: crear } = useMutation({
    mutationFn: (data: ProveedorType) => crearProveedor(data),
    onSuccess: () => {
      toast.success("Proveedor creado correctamente");
      queryClient.invalidateQueries({ queryKey: ["proveedores"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Error al crear el proveedor")),
  });

  const { mutateAsync: actualizar } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProveedorType }) => actualizarProveedor(id, data),
    onSuccess: () => {
      toast.success("Proveedor actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ["proveedores"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Error al actualizar el proveedor")),
  });

  const { mutate: eliminar } = useMutation({
    mutationFn: (id: number) => eliminarProveedor(id),
    onSuccess: () => {
      toast.success("Proveedor eliminado correctamente");
      if (proveedores.length === 1 && page > 1) setPage((p) => p - 1);
      else queryClient.invalidateQueries({ queryKey: ["proveedores"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Error al eliminar el proveedor")),
  });

  const abrirCrear = () => {
    setSelected(null);
    setModalOpen(true);
  };

  const abrirEditar = async (id: number) => {
    try {
      const proveedor = await queryClient.fetchQuery({
        queryKey: ["proveedor", id],
        queryFn: () => obtenerProveedorId(id),
      });
      setSelected(proveedor);
      setModalOpen(true);
    } catch {
      toast.error("Error al obtener el proveedor");
    }
  };

  const cerrarModal = () => setModalOpen(false);

  const onModalSubmit = async (data: any) => {
    if (selected) {
      await actualizar({ id: selected.id, data });
    } else {
      await crear(data);
    }
    cerrarModal();
  };

  return {
    data: { proveedores, isLoading, total },
    pagination: { page, totalPages, setPage },
    searchTerm,
    setSearchTerm,
    modal: { modalOpen, selected, abrirCrear, abrirEditar, cerrarModal, onModalSubmit },
    eliminar,
  };
};
