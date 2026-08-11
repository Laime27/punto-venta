import { useState, useEffect, useRef, type KeyboardEvent } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useDebounce } from "@/hooks/useDebounce"
import { 
  listarSelectCliente, 
  obtenerClienteId 
} from "@/features/cliente/services/ClienteService"
import type { ClienteType } from "@/features/cliente/types/ClienteType"
import type { ClienteFormData } from "@/features/cliente/validations/ClienteValidation"
import { usePosContext } from "../../context/PosContext"
import { toast } from "sonner"
import { useCreateClienteMutation, useUpdateClienteMutation } from "@/features/cliente/hooks/useClienteMutations"

export function useCustomerSearch() {
  const queryClient = useQueryClient()
  const { 
    estado: { clienteSeleccionado }, 
    funciones: { setClienteSeleccionado } 
  } = usePosContext()

  const [busqueda, setBusqueda] = useState("")
  const busquedaDebounce = useDebounce(busqueda, 300)
  const [estaAbierto, setEstaAbierto] = useState(false)
  const [indiceSeleccionado, setIndiceSeleccionado] = useState(0)

  const [modalOpen, setModalOpen] = useState(false)
  const [clienteParaModal, setClienteParaModal] = useState<ClienteType | null>(null)

  const contenedorRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { data: resultadosRaw = [], isLoading: estaCargando } = useQuery({
    queryKey: ["clientes-select", busquedaDebounce],
    queryFn: () => listarSelectCliente(busquedaDebounce),
    enabled: busquedaDebounce.trim().length > 0 && !(clienteSeleccionado && busquedaDebounce === clienteSeleccionado.nombre),
  })

  const resultados = Array.isArray(resultadosRaw) ? resultadosRaw : (resultadosRaw as any).data || []

  useEffect(() => {
    if (resultados.length > 0) {
      setEstaAbierto(true)
    } else {
      setEstaAbierto(false)
    }
  }, [resultados])

  const { mutateAsync: crear } = useCreateClienteMutation({
    onSuccess: (nuevoCliente) => {
      setClienteSeleccionado(nuevoCliente)
      setBusqueda(nuevoCliente.nombre)
    }
  })

  const { mutateAsync: actualizar } = useUpdateClienteMutation({
    onSuccess: (clienteActualizado) => {
      setClienteSeleccionado(clienteActualizado)
      setBusqueda(clienteActualizado.nombre)
    }
  })

  useEffect(() => {
    if (clienteSeleccionado) {
      setBusqueda(clienteSeleccionado.nombre)
    } else {
      setBusqueda("")
    }
  }, [clienteSeleccionado])

  useEffect(() => {
    const manejarClickAfuera = (event: MouseEvent) => {
      if (contenedorRef.current && !contenedorRef.current.contains(event.target as Node)) {
        setEstaAbierto(false)
        setBusqueda(clienteSeleccionado ? clienteSeleccionado.nombre : "")
      }
    }
    document.addEventListener("mousedown", manejarClickAfuera)
    return () => document.removeEventListener("mousedown", manejarClickAfuera)
  }, [clienteSeleccionado])

  const seleccionarCliente = (cliente: ClienteType) => {
    setClienteSeleccionado(cliente)
    setBusqueda(cliente.nombre)
    setEstaAbierto(false)
    inputRef.current?.blur()
  }

  const limpiarSeleccion = () => {
    setClienteSeleccionado(null)
    setBusqueda("")
    setEstaAbierto(false)
  }

  const manejarTeclado = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!estaAbierto || resultados.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setIndiceSeleccionado((prev) => prev < resultados.length - 1 ? prev + 1 : prev)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setIndiceSeleccionado((prev) => (prev > 0 ? prev - 1 : prev))
    } else if (e.key === "Enter") {
      e.preventDefault()
      seleccionarCliente(resultados[indiceSeleccionado])
    } else if (e.key === "Escape") {
      setEstaAbierto(false)
      setBusqueda(clienteSeleccionado ? clienteSeleccionado.nombre : "")
    }
  }

  const abrirCrear = () => {
    setClienteParaModal(null)
    setModalOpen(true)
  }

  const abrirEditar = async () => {
    if (!clienteSeleccionado) return
    try {
      const clienteCompleto = await queryClient.fetchQuery({
        queryKey: ["cliente", clienteSeleccionado.id],
        queryFn: () => obtenerClienteId(clienteSeleccionado.id),
      })
      setClienteParaModal(clienteCompleto)
      setModalOpen(true)
    } catch {
      toast.error("Error al obtener los datos del cliente")
    }
  }

  const cerrarModal = () => {
    setModalOpen(false)
    setClienteParaModal(null)
  }

  const handleModalSubmit = async (values: ClienteFormData) => {
    if (clienteParaModal) {
      await actualizar({ id: clienteParaModal.id, data: values })
    } else {
      await crear(values)
    }
    cerrarModal()
  }

  return {
    estado: {
      busqueda,
      resultados,
      estaAbierto,
      estaCargando,
      indiceSeleccionado,
      clienteSeleccionado,
      modalOpen,
      clienteParaModal,
    },
    modificadores: {
      setBusqueda,
      setEstaAbierto,
      setIndiceSeleccionado,
    },
    referencias: {
      contenedorRef,
      inputRef,
    },
    funciones: {
      seleccionarCliente,
      limpiarSeleccion,
      manejarTeclado,
      abrirCrear,
      abrirEditar,
      cerrarModal,
      handleModalSubmit,
    },
  }
}
