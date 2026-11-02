interface ElementoTooltip {
  value?: number | string | (number | string)[];
  name?: number | string;
  color?: string;
}

interface Props {
  active?: boolean;
  payload?: readonly ElementoTooltip[];
  label?: number | string;
  formatear: (valor: number) => string;
}

export function ReporteTooltip({ active, payload, label, formatear }: Props) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
      {label !== undefined && <p className="mb-1 font-semibold text-foreground">{label}</p>}
      {payload.map((elemento) => (
        <div key={String(elemento.name)} className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: elemento.color }} />
          <span className="text-muted-foreground">{elemento.name}</span>
          <span className="ml-auto font-medium tabular-nums text-foreground">{formatear(Number(elemento.value))}</span>
        </div>
      ))}
    </div>
  );
}
