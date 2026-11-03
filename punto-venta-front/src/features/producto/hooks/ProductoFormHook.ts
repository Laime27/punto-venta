import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, useParams } from "react-router-dom"
import { useQuery, useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  crearProductoSchema,
  type ProductoFormValues,
} from "../validations/ProductoValidation"
import {
  obtenerProducto,
  crearProducto,
  generarCodigoBarras,
  actualizarProducto,
} from "../services/ProductoService"
import { listarUnidades } from "@/features/unidad/services/UnidadService"
import { getErrorMessage } from "@/lib/errorHandler"
import { useSubirImagen } from "@/hooks/useImageUpload"
import { listarSelectCategoria } from "@/features/categoria/services/CategoriaService"
import { listarSelectProveedor } from "@/features/proveedor/services/ProveedorService"

export const useProductoFormHook = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const Edicion = !!id
  const idProducto = id ? Number(id) : null

  const {
    archivo,
    vistaPrevia,
    manejarCambioImagen,
    setVistaPrevia,
    eliminarImagen,
  } = useSubirImagen()

  const { data: unidades = [] } = useQuery({
    queryKey: ["unidades"],
    queryFn: listarUnidades,
  })

  const form = useForm<ProductoFormValues>({
    resolver: zodResolver(crearProductoSchema(unidades)) as any,
    defaultValues: {
      nombre: "",
      descripcion: "",
      precio_compra: 0,
      precio_venta: 0,
      precio_mayoreo: 0,
      stock: 0,
      stock_minimo: 5,
      codigo_barras: "",
      categoria_id: 0,
      unidad_id: 0,
      proveedores: [],
      disponible_venta: true,
    },
  })

  const { data: productoData, isLoading: cargandoProducto } = useQuery({
    queryKey: ["producto", idProducto],
    queryFn: () => obtenerProducto(idProducto!),
    enabled: Edicion && idProducto !== null && unidades.length > 0,
  })

  useEffect(() => {
    if (!productoData) return
    form.reset({
      nombre: productoData.nombre,
      descripcion: productoData.descripcion ?? "",
      precio_compra: Number(productoData.precio_compra),
      precio_venta: Number(productoData.precio_venta),
      precio_mayoreo: Number(productoData.precio_mayoreo),
      stock: Number(productoData.stock),
      stock_minimo: Number(productoData.stock_minimo),
      codigo_barras: productoData.codigo_barras ?? "",
      categoria_id: productoData.categoria_id ? Number(productoData.categoria_id) : 0,
      unidad_id: productoData.unidad_id ? Number(productoData.unidad_id) : 0,
      proveedores: productoData.proveedores?.map((p: any) => Number(p.id)) ?? [],
      disponible_venta: Boolean(productoData.disponible_venta),
    })
    if (productoData.imagen) setVistaPrevia(productoData.imagen)
  }, [productoData, form])

  const { mutateAsync: guardar, isPending: guardando } = useMutation({
    mutationFn: (valores: ProductoFormValues) => {
      const formData = construirFormData(valores, archivo)
      return Edicion ? actualizarProducto(idProducto!, formData) : crearProducto(formData)
    },
    onSuccess: () => {
      toast.success(Edicion ? "Producto actualizado correctamente" : "Producto creado correctamente")
      navigate("/producto");
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Error al guardar el producto")),
  })

  const { mutate: generarCodigo, isPending: generandoCodigo } = useMutation({
    mutationFn: generarCodigoBarras,
    onSuccess: ({ codigo_barras }) =>
      form.setValue("codigo_barras", codigo_barras, { shouldDirty: true }),
    onError: (error) =>
      toast.error(getErrorMessage(error, "No se pudo generar el código")),
  })

  const onSubmit = form.handleSubmit((valores) => guardar(valores))

  return {
    form,
    onSubmit,
    guardando,
    cargandoProducto,
    Edicion,
    codigo: { generar: () => generarCodigo(), generando: generandoCodigo },
    imagen: { vistaPrevia, manejarCambioImagen, eliminarImagen },
    selects: {
      unidades,
      listarSelectCategoria,
      listarSelectProveedor,
      initialCategoria: productoData?.categoria ?? null,
      initialProveedores: productoData?.proveedores ?? [],
    },
  }
}

function construirFormData(
  valores: ProductoFormValues,
  imagen: File | null
): FormData {
  const fd = new FormData()

  fd.append("nombre", valores.nombre)
  if (valores.descripcion) fd.append("descripcion", valores.descripcion)
  fd.append("precio_compra", String(valores.precio_compra))
  fd.append("precio_venta", String(valores.precio_venta))
  fd.append("precio_mayoreo", String(valores.precio_mayoreo))
  fd.append("stock", String(valores.stock))
  fd.append("stock_minimo", String(valores.stock_minimo))
  if (valores.codigo_barras) fd.append("codigo_barras", valores.codigo_barras)
  if (valores.categoria_id)
    fd.append("categoria_id", String(valores.categoria_id))
  if (valores.unidad_id) fd.append("unidad_id", String(valores.unidad_id))
  if (valores.proveedores && valores.proveedores.length > 0) {
    valores.proveedores.forEach((id, index) => {
      fd.append(`proveedores[${index}]`, String(id))
    })
  }
  fd.append("disponible_venta", valores.disponible_venta ? "1" : "0")
  if (imagen) fd.append("imagen", imagen)

  return fd
}
