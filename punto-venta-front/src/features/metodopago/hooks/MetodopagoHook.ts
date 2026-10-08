import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { listarMetodoPago, crearMetodoPago, actualizarMetodoPago, cambiarEstadoMetodoPago, obtenerMetodoPagoId } from "../services/MetodopagoService";
import type { MetodoPagoType } from "../types/MetodopagoType";

import { getErrorMessage } from "@/lib/errorHandler";

export const useMetodoPagoHook = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<MetodoPagoType | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["metodosPago", page],
    queryFn: () => listarMetodoPago(page),
  });

  const metodosPago: MetodoPagoType[] = data?.data ?? [];
  const totalPages: number = data?.last_page ?? 1;
  const total: number = data?.total ?? 0;

  const { mutateAsync: crear } = useMutation({
    mutationFn: (payload: { nombre: string; tipo: string }) => crearMetodoPago(payload),
    onSuccess: () => {
      toast.success("Método de pago creado correctamente");
      queryClient.invalidateQueries({ queryKey: ["metodosPago"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Error al crear el método de pago")),
  });

  const { mutateAsync: actualizar } = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { nombre: string; tipo: string } }) => actualizarMetodoPago(id, payload),
    onSuccess: () => {
      toast.success("Método de pago actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ["metodosPago"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Error al actualizar el método de pago")),
  });

  const { mutate: cambiarEstado } = useMutation({
    mutationFn: (id: number) => cambiarEstadoMetodoPago(id),
    onSuccess: (data) => {
      toast.success(data?.mensaje || "Estado actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ["metodosPago"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Error al actualizar el estado")),
  });

  const abrirCrear = () => {
    setSelected(null);
    setModalOpen(true);
  };

  const abrirEditar = async (id: number) => {
    try {
      const metodoPago = await queryClient.fetchQuery({
        queryKey: ["metodoPago", id],
        queryFn: () => obtenerMetodoPagoId(id),
      });
      setSelected(metodoPago);
      setModalOpen(true);
    } catch {
      toast.error("Error al obtener el método de pago");
    }
  };

  const cerrarModal = () => setModalOpen(false);

  const onModalSubmit = async (payload: { nombre: string; tipo: string }) => {
    if (selected) {
      await actualizar({ id: selected.id, payload });
    } else {
      await crear(payload);
    }
    cerrarModal();
  };

  return {
    data: { metodosPago, isLoading, total },
    pagination: { page, totalPages, setPage },
    modal: { modalOpen, selected, abrirCrear, abrirEditar, cerrarModal, onModalSubmit },
    cambiarEstado,
  };
};
