import { useNavigate } from "react-router-dom";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorHandler";
import { crearAjusteInventario } from "../../services/AjusteInventarioService";
import {
  ajusteInventarioSchema,
  TIPO_RECUENTO,
  TIPOS_AJUSTE,
  type AjusteInventarioFormValues,
} from "../../validations/AjusteInventarioValidation";
import type { AjusteInventarioCreatePayload, ProductoAjusteResultado, TipoAjusteId } from "../../types/AjusteInventarioType";

export interface ResumenAjuste {
  productos: number;
  unidadesIngresan: number;
  unidadesSalen: number;
  valorPerdido: number;
}

export const calcularStockNuevo = (tipo: TipoAjusteId, stock: number, cantidad: number) =>
  tipo === TIPO_RECUENTO ? cantidad : stock - cantidad;

export const useAjusteInventarioCrear = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<AjusteInventarioFormValues>({
    resolver: zodResolver(ajusteInventarioSchema),
    defaultValues: {
      tipo_movimiento_id: TIPO_RECUENTO,
      motivo: "",
      detalles: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "detalles" });
  const tipo = useWatch({ control: form.control, name: "tipo_movimiento_id" });
  const detalles = useWatch({ control: form.control, name: "detalles" }) ?? [];
  const tipoSeleccionado = TIPOS_AJUSTE.find((t) => t.id === tipo) ?? TIPOS_AJUSTE[0];

  const resumen = detalles.reduce<ResumenAjuste>(
    (acc, d) => {
      const diferencia = calcularStockNuevo(tipo, d.stock, Number(d.cantidad) || 0) - d.stock;
      if (diferencia > 0) acc.unidadesIngresan += diferencia;
      if (diferencia < 0) {
        acc.unidadesSalen += Math.abs(diferencia);
        acc.valorPerdido += Math.abs(diferencia) * d.precio_compra;
      }
      return acc;
    },
    { productos: detalles.length, unidadesIngresan: 0, unidadesSalen: 0, valorPerdido: 0 }
  );

  const agregarProducto = (producto: ProductoAjusteResultado) => {
    if (detalles.some((d) => d.producto_id === producto.id)) {
      toast.info(`${producto.nombre} ya está en la lista`);
      return;
    }

    const stock = Number(producto.stock) || 0;
    append({
      producto_id: producto.id,
      nombre: producto.nombre,
      codigo_barras: producto.codigo_barras ?? null,
      stock,
      precio_compra: Number(producto.precio_compra) || 0,
      permite_decimales: Boolean(producto.unidad?.permite_decimales),
      cantidad: form.getValues("tipo_movimiento_id") === TIPO_RECUENTO ? stock : 1,
    });
  };

  const { mutateAsync, isPending: enviando } = useMutation({
    mutationFn: crearAjusteInventario,
    onSuccess: (ajuste) => {
      toast.success(`Ajuste ${ajuste.serie}-${ajuste.correlativo} registrado correctamente`);
      queryClient.invalidateQueries({ queryKey: ["ajustesInventario"] });
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      navigate(`/ajuste-inventario`);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error al registrar el ajuste de inventario"));
    },
  });

  const onSubmit = form.handleSubmit(
    async (valores) => {
      const payload: AjusteInventarioCreatePayload = {
        tipo_movimiento_id: valores.tipo_movimiento_id,
        motivo: valores.motivo?.trim() || null,
        detalles: valores.detalles.map((d) => ({ producto_id: d.producto_id, cantidad: d.cantidad })),
      };
      await mutateAsync(payload);
    },
    (errores) => {
      if (errores.detalles?.root || errores.detalles?.message) {
        toast.error(errores.detalles.root?.message ?? errores.detalles.message);
      }
    }
  );

  return {
    form,
    fields,
    tipo,
    tipoSeleccionado,
    resumen,
    enviando,
    funciones: {
      agregarProducto,
      eliminarDetalle: remove,
      cancelar: () => navigate("/ajuste-inventario"),
      onSubmit,
    },
  };
};
