import { AppPagination } from "@/components/AppPagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PaginacionTabla } from "../types/ReporteType";

interface Props {
  paginacion: PaginacionTabla;
  deshabilitado: boolean;
}

export function ReportePaginacion({ paginacion, deshabilitado }: Props) {
  const { pagina, porPagina, totalPaginas, total, opcionesPorPagina, cambiarPagina, cambiarPorPagina } = paginacion;
  const desde = total === 0 ? 0 : (pagina - 1) * porPagina + 1;
  const hasta = Math.min(pagina * porPagina, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Mostrar</span>
        <Select value={String(porPagina)} onValueChange={(valor) => cambiarPorPagina(Number(valor))}>
          <SelectTrigger className="h-8 w-[72px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {opcionesPorPagina.map((opcion) => (
              <SelectItem key={opcion} value={String(opcion)}>
                {opcion}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="tabular-nums">
          {desde}–{hasta} de {total}
        </span>
      </div>
      <AppPagination page={pagina} totalPages={totalPaginas} onPageChange={cambiarPagina} disabled={deshabilitado} />
    </div>
  );
}
