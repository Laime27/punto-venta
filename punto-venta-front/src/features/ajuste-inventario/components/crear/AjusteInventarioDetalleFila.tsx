import { Controller, type UseFormReturn } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { calcularStockNuevo } from "../../hooks/crear/useAjusteInventarioCrear";
import type { AjusteInventarioFormValues, AjusteInventarioDetalleFormValues } from "../../validations/AjusteInventarioValidation";
import type { TipoAjusteId } from "../../types/AjusteInventarioType";

interface Props {
  form: UseFormReturn<AjusteInventarioFormValues>;
  index: number;
  detalle: AjusteInventarioDetalleFormValues;
  tipo: TipoAjusteId;
  onEliminar: () => void;
}

export function AjusteInventarioDetalleFila({ form, index, detalle, tipo, onEliminar }: Props) {
  const error = form.formState.errors.detalles?.[index]?.cantidad;
  const cantidad = Number(detalle.cantidad) || 0;
  const stockNuevo = calcularStockNuevo(tipo, detalle.stock, cantidad);
  const diferencia = stockNuevo - detalle.stock;

  const colorDiferencia =
    diferencia > 0 ? "text-emerald-600" : diferencia < 0 ? "text-red-600" : "text-muted-foreground";

  return (
    <div className="grid grid-cols-[1fr_90px_130px_90px_90px_40px] gap-2 items-start px-4 py-3">
      <div className="min-w-0 pt-2">
        <p className="font-medium text-sm truncate">{detalle.nombre}</p>
        {detalle.codigo_barras && (
          <p className="text-xs text-muted-foreground">{detalle.codigo_barras}</p>
        )}
      </div>

      <div className="text-center text-sm pt-2">{detalle.stock}</div>

      <div className="space-y-1">
        <Controller
          control={form.control}
          name={`detalles.${index}.cantidad`}
          render={({ field }) => (
            <Input
              type="number"
              min={0}
              step={detalle.permite_decimales ? "0.01" : "1"}
              value={Number.isNaN(field.value) ? "" : field.value}
              onChange={(e) => field.onChange(e.target.value === "" ? Number.NaN : Number(e.target.value))}
              onFocus={(e) => e.target.select()}
              className={`h-9 text-center ${error ? "border-destructive" : ""}`}
            />
          )}
        />
        {error && <p className="text-xs text-destructive text-center">{error.message}</p>}
      </div>

      <div className="text-center text-sm font-medium pt-2">{Number(stockNuevo.toFixed(2))}</div>

      <div className={`text-center text-sm font-semibold pt-2 ${colorDiferencia}`}>
        {diferencia > 0 ? "+" : ""}{Number(diferencia.toFixed(2))}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50"
        onClick={onEliminar}
        title="Quitar"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
