import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ReporteTooltip } from "./ReporteTooltip";
import type { SegmentoColoreado } from "../../hooks/useSegmentosGrafico";

interface Props {
  segmentos: SegmentoColoreado[];
  formatear: (valor: number) => string;
}

export function ReporteGraficoDona({ segmentos, formatear }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="h-52 w-52 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={segmentos}
              dataKey="valor"
              nameKey="nombre"
              innerRadius="58%"
              outerRadius="95%"
              paddingAngle={segmentos.length > 1 ? 2 : 0}
              stroke="var(--card)"
              strokeWidth={2}
              isAnimationActive={false}
            >
              {segmentos.map((segmento) => (
                <Cell key={segmento.clave} fill={segmento.color} />
              ))}
            </Pie>
            <Tooltip content={(props) => <ReporteTooltip {...props} formatear={formatear} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="w-full space-y-2 text-sm">
        {segmentos.map((segmento) => (
          <li key={segmento.clave} className="flex items-center gap-2">
            <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: segmento.color }} />
            <span className="truncate text-foreground">{segmento.nombre}</span>
            <span className="ml-auto whitespace-nowrap tabular-nums font-medium text-foreground">{formatear(segmento.valor)}</span>
            <span className="w-12 text-right tabular-nums text-xs text-muted-foreground">{segmento.porcentaje.toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
