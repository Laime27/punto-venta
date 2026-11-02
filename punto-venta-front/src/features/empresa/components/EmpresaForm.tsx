import { Controller, type UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmpresaZonaHorariaSelect } from "./EmpresaZonaHorariaSelect";
import type { EmpresaFormValues } from "../validations/EmpresaValidation";
import type { ZonaHorariaOpcion } from "../types/EmpresaType";

interface EmpresaFormProps {
  form: UseFormReturn<EmpresaFormValues>;
  zonasHorarias: ZonaHorariaOpcion[];
  cargandoZonas: boolean;
}

export function EmpresaForm({ form, zonasHorarias, cargandoZonas }: EmpresaFormProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="nombre" isRequired>Nombre</Label>
        <Input id="nombre" placeholder="Nombre o razón social" {...register("nombre")} />
        {errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ruc">RUC</Label>
        <Input id="ruc" inputMode="numeric" maxLength={11} placeholder="20123456789" {...register("ruc")} />
        {errors.ruc && <p className="text-xs text-destructive">{errors.ruc.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefono">Teléfono</Label>
        <Input id="telefono" placeholder="999 999 999" {...register("telefono")} />
        {errors.telefono && <p className="text-xs text-destructive">{errors.telefono.message}</p>}
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="contacto@empresa.com" {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="direccion">Dirección</Label>
        <Textarea id="direccion" placeholder="Dirección fiscal" {...register("direccion")} />
        {errors.direccion && <p className="text-xs text-destructive">{errors.direccion.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="moneda_simbolo" isRequired>Símbolo de moneda</Label>
        <Input id="moneda_simbolo" maxLength={5} placeholder="S/" {...register("moneda_simbolo")} />
        {errors.moneda_simbolo && <p className="text-xs text-destructive">{errors.moneda_simbolo.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="timezone">Zona horaria</Label>
        <Controller
          control={control}
          name="timezone"
          render={({ field }) => (
            <EmpresaZonaHorariaSelect
              id="timezone"
              valor={field.value}
              onChange={(valor) => field.onChange(valor)}
              opciones={zonasHorarias}
              cargando={cargandoZonas}
            />
          )}
        />
        {errors.timezone ? (
          <p className="text-xs text-destructive">{errors.timezone.message}</p>
        ) : (
          <p className="text-xs text-muted-foreground">Cambiar la zona horaria no ajusta las fechas ya registradas.</p>
        )}
      </div>
    </div>
  );
}
