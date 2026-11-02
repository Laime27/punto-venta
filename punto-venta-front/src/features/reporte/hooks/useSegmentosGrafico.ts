import type { SegmentoGrafico } from "../types/ReporteType";

export type SegmentoColoreado = SegmentoGrafico & {
  color: string;
  porcentaje: number;
};

const TOTAL_SERIES = 8;
const COLOR_OTROS = "var(--muted-foreground)";

const indiceBase = (clave: string) =>
  [...clave].reduce((acc, caracter) => (acc * 31 + caracter.charCodeAt(0)) % 997, 7) % TOTAL_SERIES;

const asignarColores = (segmentos: SegmentoGrafico[]) => {
  const ocupados = new Set<number>();

  return new Map(
    [...segmentos]
      .sort((a, b) => a.clave.localeCompare(b.clave))
      .map((segmento) => {
        let indice = indiceBase(segmento.clave);
        while (ocupados.has(indice)) indice = (indice + 1) % TOTAL_SERIES;
        ocupados.add(indice);
        return [segmento.clave, `var(--serie-${indice + 1})`];
      })
  );
};

export const useSegmentosGrafico = (segmentos: SegmentoGrafico[], maximo = 5): SegmentoColoreado[] => {
  const positivos = segmentos.filter((segmento) => segmento.valor > 0).sort((a, b) => b.valor - a.valor);
  const principales = positivos.slice(0, maximo);
  const restantes = positivos.slice(maximo);
  const total = positivos.reduce((acc, segmento) => acc + segmento.valor, 0);
  const colores = asignarColores(principales);

  const coloreados = principales.map((segmento) => ({
    ...segmento,
    color: colores.get(segmento.clave) ?? COLOR_OTROS,
    porcentaje: total > 0 ? (segmento.valor / total) * 100 : 0,
  }));

  if (restantes.length === 0) return coloreados;

  const valorOtros = restantes.reduce((acc, segmento) => acc + segmento.valor, 0);

  return [
    ...coloreados,
    { clave: "otros", nombre: `Otros (${restantes.length})`, valor: valorOtros, color: COLOR_OTROS, porcentaje: (valorOtros / total) * 100 },
  ];
};
