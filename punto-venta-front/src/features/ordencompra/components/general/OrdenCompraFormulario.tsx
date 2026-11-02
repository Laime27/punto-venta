import { Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { PackageOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SearchableSelect } from "@/components/SearchableSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrdenCompraBuscadorProducto } from "./OrdenCompraBuscadorProducto";
import { listarSelectProveedor } from "@/features/proveedor/services/ProveedorService";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import type { HeaderFormData } from "../../hooks/general/useOrdenCompraCrear";
import type { OrdenCompraDetalleType } from "../../types/OrdenCompraType";
import type { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<HeaderFormData>;
  detalles: OrdenCompraDetalleType[];
  enviando: boolean;
  isEditMode?: boolean;
  funciones: {
    agregarProducto: (producto: { id: number; nombre: string; precio_compra?: number }) => void;
    actualizarCantidad: (index: number, valor: number) => void;
    actualizarPrecio: (index: number, valor: number) => void;
    eliminarDetalle: (index: number) => void;
    calcularTotal: () => number;
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  };
}

export function OrdenCompraFormulario({
  form,
  detalles,
  enviando,
  isEditMode = false,
  funciones,
}: Props) {
  const { simbolo } = useMonedaHook();
  const { register, control, formState: { errors } } = form;
  const navigate = useNavigate();

  return (
    <form onSubmit={funciones.onSubmit}>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6 items-start">
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Productos de la Orden</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <OrdenCompraBuscadorProducto onAgregar={funciones.agregarProducto} />

            <div className="rounded-lg border overflow-hidden">
              <div className="grid grid-cols-[1fr_120px_140px_100px_40px] gap-2 px-4 py-2 bg-muted/50 text-xs font-semibold uppercase text-muted-foreground border-b">
                <div>Producto</div>
                <div className="text-center">Cantidad</div>
                <div className="text-center">Precio Unitario</div>
                <div className="text-right">Subtotal</div>
                <div />
              </div>

              {detalles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
                  <PackageOpen className="h-12 w-12 opacity-30" />
                  <p className="text-sm">
                    Busca un producto arriba para agregarlo a la orden
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {detalles.map((detalle, index) => (
                    <div
                      key={detalle.producto_id}
                      className="grid grid-cols-[1fr_120px_140px_100px_40px] gap-2 items-center px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{detalle.producto?.nombre}</p>
                      </div>

                      <Input
                        type="number"
                        min={1}
                        value={detalle.cantidad_pedida}
                        onChange={(e) => funciones.actualizarCantidad(index, Number(e.target.value))}
                        onFocus={(e) => e.target.select()}
                        className="h-9 text-center"
                      />

                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={detalle.precio_unitario}
                        onChange={(e) => funciones.actualizarPrecio(index, Number(e.target.value))}
                        onFocus={(e) => e.target.select()}
                        className="h-9"
                      />

                      <div className="text-right text-sm font-medium">
                        {simbolo} {(detalle.cantidad_pedida * detalle.precio_unitario).toFixed(2)}
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => funciones.eliminarDetalle(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {detalles.length > 0 && (
                <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/30">
                  <span className="text-sm text-muted-foreground">
                    {detalles.length} producto{detalles.length !== 1 ? "s" : ""}
                  </span>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">Total estimado</span>
                    <p className="text-lg font-bold">{simbolo} {funciones.calcularTotal().toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="sticky top-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Datos Generales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
              <Label>Proveedor</Label>
              <Controller
                control={control}
                name="proveedor_id"
                render={({ field }) => (
                  <SearchableSelect
                    value={field.value ?? null}
                    onChange={field.onChange}
                    queryKey="selectProveedores"
                    fetchFn={listarSelectProveedor}
                    placeholder="Seleccionar proveedor..."
                    searchPlaceholder="Buscar proveedor..."
                    allowClear
                    clearText="Sin proveedor"
                  />
                )}
              />
              {errors.proveedor_id && (
                <p className="text-sm text-red-500">{errors.proveedor_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Fecha de Emisión</Label>
              <Input type="date" {...register("fecha_emision")} />
            </div>

            <div className="space-y-2">
              <Label>Fecha de Recepción Esperada</Label>
              <Input type="date" {...register("fecha_recepcion")} />
            </div>

            <div className="space-y-2">
              <Label>Observaciones</Label>
              <Textarea
                {...register("observaciones")}
                placeholder="Notas adicionales (opcional)"
                className="resize-none"
                rows={4}
              />
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button type="submit" disabled={enviando} className="w-full">
                {enviando ? "Guardando..." : isEditMode ? "Actualizar Orden de Compra" : "Crear Orden de Compra"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/orden-compra")}
              >
                Cancelar
              </Button>
            </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
