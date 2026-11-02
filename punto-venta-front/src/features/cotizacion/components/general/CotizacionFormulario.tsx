import { Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { PackageOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SearchableSelect } from "@/components/SearchableSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CotizacionBuscadorProducto } from "./CotizacionBuscadorProducto";
import { listarSelectCliente } from "@/features/cliente/services/ClienteService";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import type { CotizacionFormData } from "../../validations/CotizacionValidation";
import type { CotizacionDetalleType } from "../../types/CotizacionType";
import type { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<CotizacionFormData>;
  detalles: CotizacionDetalleType[];
  enviando: boolean;
  isEditMode?: boolean;
  funciones: {
    agregarProducto: (producto: { id: number; nombre: string; precio_venta?: number }) => void;
    actualizarCantidad: (index: number, valor: number) => void;
    actualizarPrecio: (index: number, valor: number) => void;
    actualizarDescuento: (index: number, valor: number) => void;
    eliminarDetalle: (index: number) => void;
    calcularSubtotal: () => number;
    calcularTotalDescuento: () => number;
    calcularTotal: () => number;
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  };
}

export function CotizacionFormulario({
  form,
  detalles,
  enviando,
  isEditMode = false,
  funciones,
}: Props) {
  const { simbolo } = useMonedaHook();
  const { register, control, formState: { errors } } = form;
  const navigate = useNavigate();
  const descuentoGlobal = form.watch("descuento_global") || 0;

  return (
    <form onSubmit={funciones.onSubmit}>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6 items-start">
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Productos de la Cotización</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CotizacionBuscadorProducto onAgregar={funciones.agregarProducto} />

            <div className="rounded-lg border overflow-hidden">
              <div className="grid grid-cols-[1fr_100px_120px_120px_100px_40px] gap-2 px-4 py-2 bg-muted/50 text-xs font-semibold uppercase text-muted-foreground border-b">
                <div>Producto</div>
                <div className="text-center">Cantidad</div>
                <div className="text-center">Precio U.</div>
                <div className="text-center">Desc. U.</div>
                <div className="text-right">Subtotal</div>
                <div />
              </div>

              {detalles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
                  <PackageOpen className="h-12 w-12 opacity-30" />
                  <p className="text-sm">
                    Busca un producto arriba para agregarlo
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {detalles.map((detalle, index) => {
                    const subtotalItem = (detalle.cantidad * detalle.precio_unitario) - (detalle.cantidad * (detalle.descuento_unitario ?? 0));
                    return (
                      <div
                        key={detalle.producto_id}
                        className="grid grid-cols-[1fr_100px_120px_120px_100px_40px] gap-2 items-center px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{detalle.producto?.nombre}</p>
                        </div>

                        <Input
                          type="number"
                          min={1}
                          value={detalle.cantidad}
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
                        
                        <Input
                          type="number"
                          min={0}
                          value={detalle.descuento_unitario ?? 0}
                          onChange={(e) => funciones.actualizarDescuento(index, Number(e.target.value))}
                          onFocus={(e) => e.target.select()}
                          className="h-9"
                        />

                        <div className="text-right text-sm font-medium">
                          {simbolo} {subtotalItem.toFixed(2)}
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
                    );
                  })}
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
              <Label>Cliente</Label>
              <Controller
                control={control}
                name="cliente_id"
                render={({ field }) => (
                  <SearchableSelect
                    value={field.value ?? null}
                    onChange={field.onChange}
                    queryKey="selectClientes"
                    fetchFn={listarSelectCliente}
                    placeholder="Seleccionar cliente..."
                    searchPlaceholder="Buscar cliente..."
                    allowClear
                    clearText="Sin cliente"
                  />
                )}
              />
              {errors.cliente_id && (
                <p className="text-sm text-red-500">{errors.cliente_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Fecha de Emisión</Label>
              <Input type="date" {...register("fecha_emision")} />
            </div>

            <div className="space-y-2">
              <Label>Fecha de Vencimiento</Label>
              <Input type="date" {...register("fecha_vencimiento")} />
            </div>

            <div className="space-y-2">
              <Label>Descuento Global</Label>
              <Input type="number" step="0.01" min={0} {...register("descuento_global", { valueAsNumber: true })} />
            </div>

            <div className="space-y-2">
              <Label>Observaciones</Label>
              <Textarea
                {...register("observaciones")}
                placeholder="Notas adicionales (opcional)"
                className="resize-none"
                rows={3}
              />
            </div>

            {detalles.length > 0 && (
              <div className="pt-4 border-t space-y-1">
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Subtotal</span>
                  <span>{simbolo} {funciones.calcularSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Descuentos Item</span>
                  <span>{simbolo} {funciones.calcularTotalDescuento().toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total Estimado</span>
                  <span className="text-lg text-primary">{simbolo} {Math.max(0, funciones.calcularTotal() - descuentoGlobal).toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <Button type="submit" disabled={enviando} className="w-full">
                {enviando ? "Guardando..." : isEditMode ? "Actualizar Cotización" : "Crear Cotización"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/cotizacion")}
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
