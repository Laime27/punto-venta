import { useState } from "react"
import type { ProductoCarritoType, ProductoBuscadoType, CotizacionOrigenType, CotizacionParaVentaType } from "../../types/PosType"
import type { ClienteType } from "@/features/cliente/types/ClienteType"
import { toast } from "sonner"

export function useCarritoProducto() {
    const [carrito, setCarrito] = useState<ProductoCarritoType[]>([])
    const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteType | null>(null)
    const [cotizacionOrigen, setCotizacionOrigen] = useState<CotizacionOrigenType | null>(null)

    // Reemplaza el carrito con los productos cotizados; el stock lo valida el backend al cobrar
    const cargarDesdeCotizacion = ({ cotizacion, cliente, items }: CotizacionParaVentaType) => {
        setCarrito(items.map(({ producto, cantidad, precio }) => ({
            ...producto,
            cantidad,
            precio_usado: precio,
            es_mayoreo: false,
            es_cotizado: true,
            subtotal: precio * cantidad,
        })))
        setClienteSeleccionado(cliente)
        setCotizacionOrigen(cotizacion)
    }

    const agregarProductoAlCarrito = (
        producto: ProductoBuscadoType, 
        cantidadAgregada: number = 1, 
        precio_usado?: number, 
        es_mayoreo: boolean = false
    ) => {
        const precioActivo = precio_usado !== undefined ? precio_usado : Number(producto.precio_venta);

        const productoExistente = carrito.find(p => p.id === producto.id)
        if(productoExistente){
            const nuevaCantidad = productoExistente.cantidad + cantidadAgregada;
            if (nuevaCantidad > producto.stock) {
                toast.error("No hay suficiente stock disponible")
                return
            }
            setCarrito(carrito.map(p => {
                if (p.id === producto.id) {
                    // Un producto cotizado mantiene su precio aunque se vuelva a agregar desde el buscador
                    const precio = p.es_cotizado ? p.precio_usado : precioActivo
                    return {
                        ...p,
                        cantidad: nuevaCantidad,
                        precio_usado: precio,
                        es_mayoreo: p.es_cotizado ? false : es_mayoreo,
                        subtotal: precio * nuevaCantidad
                    }
                }
                return p;
            }))
            toast.success("Cantidad actualizada en el carrito")
        }else{
            if (cantidadAgregada > producto.stock) {
                toast.error("No hay suficiente stock disponible")
                return
            }
            setCarrito([...carrito, {
                ...producto, 
                cantidad: cantidadAgregada, 
                precio_usado: precioActivo,
                es_mayoreo: es_mayoreo,
                subtotal: precioActivo * cantidadAgregada
            }])
            toast.success("Producto agregado al carrito")
        }
    }

    const eliminarProductoDelCarrito = (id: number) => {
        setCarrito(carrito.filter(p => p.id !== id))
        toast.info("Producto eliminado del carrito")
    }

    const actualizarCantidad = (id: number, cantidad: number) => {
        const producto = carrito.find(p => p.id === id)
        if (!producto) return

        if (cantidad > producto.stock) {
            toast.error("No hay suficiente stock disponible")
            return
        }

        if (cantidad <= 0) {
            eliminarProductoDelCarrito(id)
            return
        }

        setCarrito(carrito.map(p => {
            if (p.id === id) {
                const precioBase = p.precio_usado !== undefined ? p.precio_usado : Number(p.precio_venta);
                return {
                    ...p, 
                    cantidad, 
                    subtotal: precioBase * cantidad
                }
            }
            return p;
        }))
    }

    const actualizarPrecio = (id: number, precio_usado: number, es_mayoreo: boolean) => {
        setCarrito(carrito.map(p => {
            if (p.id === id) {
                return {
                    ...p, 
                    precio_usado, 
                    es_mayoreo,
                    subtotal: precio_usado * p.cantidad
                }
            }
            return p;
        }))
    }

    const limpiarCarrito = () => {
        setCarrito([])
    }

    const reiniciarCarrito = () => {
        setCarrito([])
        setClienteSeleccionado(null)
        setCotizacionOrigen(null)
    }

    const total = carrito.reduce((acc: number, item: ProductoCarritoType) => acc + item.subtotal, 0)
    const totalArticulos = carrito.reduce((acc: number, item: ProductoCarritoType) => acc + item.cantidad, 0)

    return {
        estado: {
            carrito,
            total,
            totalArticulos,
            clienteSeleccionado,
            cotizacionOrigen
        },
        funciones: {
            agregarProductoAlCarrito,
            eliminarProductoDelCarrito,
            actualizarCantidad,
            actualizarPrecio,
            limpiarCarrito,
            reiniciarCarrito,
            setClienteSeleccionado,
            cargarDesdeCotizacion
        }
    }
}
