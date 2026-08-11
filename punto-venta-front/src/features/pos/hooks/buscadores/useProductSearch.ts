import { useState, useEffect, useRef, type KeyboardEvent } from "react"
import { useQuery } from "@tanstack/react-query"
import { useDebounce } from "@/hooks/useDebounce"
import { listarSelectProductos } from "@/features/producto/services/ProductoService"
import { type ProductoBuscadoType } from "../../types/PosType"
import { toast } from "sonner"
import { usePosContext } from "../../context/PosContext"

export function useProductSearch() {
  const { funciones: { agregarProductoAlCarrito } } = usePosContext()

  const [busqueda, setBusqueda] = useState("")
  const busquedaDebounce = useDebounce(busqueda, 300)
  const [estaAbierto, setEstaAbierto] = useState(false)
  const [indiceSeleccionado, setIndiceSeleccionado] = useState(0)
  const [productoAConfigurar, setProductoAConfigurar] = useState<ProductoBuscadoType | null>(null)

  const contenedorRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { data: resultadosRaw = [], isLoading: estaCargando } = useQuery({
    queryKey: ["productos-select", busquedaDebounce],
    queryFn: () => listarSelectProductos(busquedaDebounce),
    enabled: busquedaDebounce.trim().length > 0,
  })

  const resultados = Array.isArray(resultadosRaw) ? resultadosRaw : (resultadosRaw as any).data || []

  useEffect(() => {
    const manejarAtajoGlobal = (e: globalThis.KeyboardEvent) => {
      if (e.key === "F3") {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", manejarAtajoGlobal)
    return () => window.removeEventListener("keydown", manejarAtajoGlobal)
  }, [])

  useEffect(() => {
    const manejarClickAfuera = (event: MouseEvent) => {
      if (
        contenedorRef.current &&
        !contenedorRef.current.contains(event.target as Node)
      ) {
        setEstaAbierto(false)
      }
    }
    document.addEventListener("mousedown", manejarClickAfuera)
    return () => document.removeEventListener("mousedown", manejarClickAfuera)
  }, [])

  useEffect(() => {
    if (resultados.length > 0) {
      setEstaAbierto(true)
      setIndiceSeleccionado(0)
    } else {
      setEstaAbierto(false)
    }
  }, [resultados])

  const limpiarBusqueda = () => {
    setBusqueda("")
    setEstaAbierto(false)
    inputRef.current?.blur()
  }

  const agregarAlCarrito = (producto: ProductoBuscadoType) => {
    if (producto.stock <= 0) {
      toast.error("Producto sin stock")
      return
    }
    if (producto.precio_venta == null || producto.precio_venta === 0) {
      toast.error("Producto sin precio de venta")
      return
    }

    const permiteDecimales = producto.unidad?.permite_decimales;
    if (permiteDecimales === true ) {
      setProductoAConfigurar(producto);
      setEstaAbierto(false);
      return;
    }

    agregarProductoAlCarrito(producto)
    limpiarBusqueda()
  }

  const manejarTeclado = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!estaAbierto || resultados.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setIndiceSeleccionado((prev) =>
        prev < resultados.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setIndiceSeleccionado((prev) => (prev > 0 ? prev - 1 : prev))
    } else if (e.key === "Enter") {
      e.preventDefault()
      agregarAlCarrito(resultados[indiceSeleccionado])
    } else if (e.key === "Escape") {
      setEstaAbierto(false)
    }
  }

  return {
    estado: {
      busqueda,
      resultados,
      estaAbierto,
      estaCargando,
      indiceSeleccionado,
      productoAConfigurar,
    },
    modificadores: {
      setBusqueda,
      setEstaAbierto,
      setIndiceSeleccionado,
      setProductoAConfigurar,
    },
    referencias: {
      contenedorRef,
      inputRef,
    },
    funciones: {
      agregarAlCarrito,
      manejarTeclado,
      limpiarBusqueda,
    },
  }
}
