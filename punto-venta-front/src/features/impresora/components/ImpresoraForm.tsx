import { Controller, useWatch, type UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { ImpresoraSelect } from "./ImpresoraSelect";
import { ImpresoraAnchoInput } from "./ImpresoraAnchoInput";
import type { ImpresoraFormValues } from "../validations/ImpresoraValidation";
import type { ImpresoraOpcion } from "../types/ImpresoraType";

interface ImpresoraFormProps {
  form: UseFormReturn<ImpresoraFormValues>;
  opciones: ImpresoraOpcion[];
  refrescando: boolean;
  onRefrescar: () => void;
  onSeleccionarAncho: (ancho: number) => void;
}

export function ImpresoraForm({ form, opciones, refrescando, onRefrescar, onSeleccionarAncho }: ImpresoraFormProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;
  const anchoActual = useWatch({ control, name: "ancho" });

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="nombre" isRequired>Impresora</Label>
        <Controller
          control={control}
          name="nombre"
          render={({ field }) => (
            <ImpresoraSelect
              id="nombre"
              valor={field.value}
              onChange={field.onChange}
              opciones={opciones}
              refrescando={refrescando}
              onRefrescar={onRefrescar}
            />
          )}
        />
        {errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ancho" isRequired>Ancho del papel (mm)</Label>
        <ImpresoraAnchoInput
          id="ancho"
          registro={register("ancho", { valueAsNumber: true })}
          anchoActual={anchoActual}
          error={errors.ancho?.message}
          onSeleccionarAncho={onSeleccionarAncho}
        />
      </div>
    </div>
  );
}
