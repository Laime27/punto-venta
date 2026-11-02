import { Controller, type UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import { TIPOS_AJUSTE, type AjusteInventarioFormValues } from "../../validations/AjusteInventarioValidation";
import type { ResumenAjuste } from "../../hooks/crear/useAjusteInventarioCrear";
import type { TipoAjusteId } from "../../types/AjusteInventarioType";

interface Props {
  form: UseFormReturn<AjusteInventarioFormValues>;
  resumen: ResumenAjuste;
  enviando: boolean;
  onCancelar: () => void;
}

export function AjusteInventarioDatosGenerales({ form, resumen, enviando, onCancelar }: Props) {
  const { simbolo } = useMonedaHook();
  const { register, control, formState: { errors } } = form;

  return (
    <Card className="sticky top-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Datos del ajuste</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label isRequired>Tipo de ajuste</Label>
          <Controller
            control={control}
            name="tipo_movimiento_id"
            render={({ field }) => (
              <Select
                value={String(field.value)}
                onValueChange={(val) => field.onChange(Number(val) as TipoAjusteId)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_AJUSTE.map((tipo) => (
                    <SelectItem key={tipo.id} value={String(tipo.id)}>
                      {tipo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.tipo_movimiento_id && (
            <p className="text-xs text-destructive">{errors.tipo_movimiento_id.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Motivo / observación</Label>
          <Textarea
            {...register("motivo")}
            placeholder="Ej. Conteo mensual, productos vencidos, rotura en almacén..."
            className="resize-none"
            rows={4}
          />
          {errors.motivo && <p className="text-xs text-destructive">{errors.motivo.message}</p>}
        </div>

        <div className="pt-4 border-t space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Productos</span>
            <span className="font-medium text-foreground">{resumen.productos}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Unidades que ingresan</span>
            <span className="font-medium text-emerald-600">+{Number(resumen.unidadesIngresan.toFixed(2))}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Unidades que salen</span>
            <span className="font-medium text-red-600">-{Number(resumen.unidadesSalen.toFixed(2))}</span>
          </div>
          <div className="flex justify-between font-semibold text-base pt-2">
            <span>Valor perdido (costo)</span>
            <span>{simbolo} {resumen.valorPerdido.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button type="submit" disabled={enviando} className="w-full">
            {enviando ? "Registrando..." : "Registrar ajuste"}
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={onCancelar}>
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
