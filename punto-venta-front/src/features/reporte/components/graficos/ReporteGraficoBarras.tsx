import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ReporteTooltip } from "./ReporteTooltip";

interface Props {
  datos: { etiqueta: string; valor: number }[];
  nombreSerie: string;
  formatear: (valor: number) => string;
  formatearEje?: (valor: number) => string;
  color?: string;
}

const EJE = { fontSize: 12, fill: "var(--muted-foreground)" };

export function ReporteGraficoBarras({ datos, nombreSerie, formatear, formatearEje = formatear, color = "var(--serie-1)" }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={datos} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis dataKey="etiqueta" tick={EJE} tickLine={false} axisLine={{ stroke: "var(--border)" }} minTickGap={12} />
        <YAxis tick={EJE} tickLine={false} axisLine={false} tickFormatter={formatearEje} width={80} />
        <Tooltip cursor={{ fill: "var(--muted)", opacity: 0.6 }} content={(props) => <ReporteTooltip {...props} formatear={formatear} />} />
        <Bar dataKey="valor" name={nombreSerie} fill={color} radius={[4, 4, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ResponsiveContainer>
  );
}
