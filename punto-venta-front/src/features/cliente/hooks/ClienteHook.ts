import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  listarCliente,
  obtenerClienteId,
} from "../services/ClienteService"
import type { ClienteType } from "../types/ClienteType"
import {
  useCreateClienteMutation,
  useUpdateClienteMutation,
  useDeleteClienteMutation,
} from "./useClienteMutations"
import { useDebounce } from "@/hooks/useDebounce"

export const useClienteHook = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<ClienteType | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const { data, isLoading } = useQuery({
    queryKey: ["clientes", page, debouncedSearchTerm],
    queryFn: () => listarCliente(page, debouncedSearchTerm),
  })

  const clientes: ClienteType[] = data?.data ?? []
  const totalPages: number = data?.last_page ?? 1
  const total: number = data?.total ?? 0

  const { mutateAsync: crear } = useCreateClienteMutation()
  const { mutateAsync: actualizar } = useUpdateClienteMutation()

  const { mutate: eliminar } = useDeleteClienteMutation({
    onSuccess: () => {
      if (clientes.length === 1 && page > 1) {
        setPage((p) => p - 1)
      }
    }
  })

  const abrirCrear = () => {
    setSelected(null)
    setModalOpen(true)
  }

  const abrirEditar = async (id: number) => {
    try {
      const cliente = await queryClient.fetchQuery({
        queryKey: ["cliente", id],
        queryFn: () => obtenerClienteId(id),
      })
      setSelected(cliente)
      setModalOpen(true)
    } catch {
      toast.error("Error al obtener el cliente")
    }
  }

  const cerrarModal = () => setModalOpen(false)

  const onModalSubmit = async (data: any) => {
    if (selected) {
      await actualizar({ id: selected.id, data })
    } else {
      await crear(data)
    }
    cerrarModal()
  }

  return {
    data: { clientes, isLoading, total },
    pagination: { page, totalPages, setPage },
    searchTerm,
    setSearchTerm,
    modal: {
      modalOpen,
      selected,
      abrirCrear,
      abrirEditar,
      cerrarModal,
      onModalSubmit,
    },
    eliminar,
  }
}
