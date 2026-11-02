import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ReporteTooltip } from "./ReporteTooltip";

interface Props {
  datos: { etiqueta: string; valor: number }[];
  nombreSerie: string;
  formatear: (valor: number) => string;
  formatearEje?: (valor: number) => string;
  color?: string;
}

const ALTO_POR_BARRA = 34;
const EJE = { fontSize: 12, fill: "var(--muted-foreground)" };

const recortar = (texto: string) => (texto.length > 22 ? `${texto.slice(0, 21)}…` : texto);

export function ReporteGraficoBarrasHorizontal({ datos, nombreSerie, formatear, formatearEje = formatear, color = "var(--serie-1)" }: Props) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(160, datos.length * ALTO_POR_BARRA + 40)}>
      <BarChart data={datos} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }} barCategoryGap={6}>
        <CartesianGrid horizontal={false} stroke="var(--border)" />
        <XAxis type="number" tick={EJE} tickLine={false} axisLine={false} tickFormatter={formatearEje} />
        <YAxis type="category" dataKey="etiqueta" tick={EJE} tickLine={false} axisLine={false} width={150} tickFormatter={recortar} />
        <Tooltip cursor={{ fill: "var(--muted)", opacity: 0.6 }} content={(props) => <ReporteTooltip {...props} formatear={formatear} />} />
        <Bar dataKey="valor" name={nombreSerie} fill={color} radius={[0, 4, 4, 0]} maxBarSize={22} />
      </BarChart>
    </ResponsiveContainer>
  );
}
