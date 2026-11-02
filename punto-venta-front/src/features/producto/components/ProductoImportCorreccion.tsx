import { CheckCircle2, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProductoImportCorreccionHook } from "../hooks/ProductoImportCorreccionHook";
import { ProductoImportCeldaEditable } from "./ProductoImportCeldaEditable";
import type { ColumnaImportacionType, ErrorFilaExcelType, FilaExcelType } from "../types/ProductoType";

const COLUMNAS: ColumnaImportacionType[] = [
  { campo: "nombre", etiqueta: "Nombre", ancho: "min-w-48" },
  { campo: "descripcion", etiqueta: "Descripción", ancho: "min-w-44" },
  { campo: "precio_compra", etiqueta: "P. compra", ancho: "min-w-24" },
  { campo: "precio_venta", etiqueta: "P. venta", ancho: "min-w-24" },
  { campo: "precio_mayoreo", etiqueta: "P. mayoreo", ancho: "min-w-24" },
  { campo: "stock", etiqueta: "Stock", ancho: "min-w-20" },
  { campo: "stock_minimo", etiqueta: "Stock mín.", ancho: "min-w-20" },
  { campo: "codigo_barras", etiqueta: "Código barras", ancho: "min-w-36" },
  { campo: "categoria", etiqueta: "Categoría", ancho: "min-w-32" },
  { campo: "unidad", etiqueta: "Unidad", ancho: "min-w-28" },
  { campo: "disponible_venta", etiqueta: "Disponible", ancho: "min-w-20" },
];

interface ProductoImportCorreccionProps {
  filasExcel: FilaExcelType[];
  erroresIniciales: ErrorFilaExcelType[];
  onImportado: () => void;
  onCancelar: () => void;
}

export function ProductoImportCorreccion({
  filasExcel,
  erroresIniciales,
  onImportado,
  onCancelar,
}: ProductoImportCorreccionProps) {
  const {
    estado: { filasVisibles, totalFilas, totalFilasConError, soloConErrores, estaImportando },
    funciones: { enviar, registrarCelda, obtenerError, eliminarFila, setSoloConErrores },
  } = useProductoImportCorreccionHook({ filasExcel, erroresIniciales, onImportado });

  return (
    <div className="flex flex-col gap-3 min-h-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {totalFilas} {totalFilas === 1 ? "producto" : "productos"} en el archivo
          {totalFilasConError > 0 && (
            <>
              {" · "}
              <span className="font-medium text-destructive">
                {totalFilasConError} {totalFilasConError === 1 ? "fila con errores" : "filas con errores"}
              </span>
            </>
          )}
        </p>
        <div className="flex items-center gap-2">
          <Switch id="solo-errores" checked={soloConErrores} onCheckedChange={setSoloConErrores} />
          <Label htmlFor="solo-errores" className="text-xs cursor-pointer">
            Solo filas con errores
          </Label>
        </div>
      </div>

      <div className="max-h-[50vh] overflow-auto rounded-md border">
        <table className="w-full caption-bottom text-sm">
          <TableHeader className="sticky top-0 z-10">
            <TableRow>
              <TableHead className="w-16 text-xs">Fila</TableHead>
              {COLUMNAS.map((columna) => (
                <TableHead key={columna.campo} className={`${columna.ancho} text-xs`}>
                  {columna.etiqueta}
                </TableHead>
              ))}
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filasVisibles.map(({ campo, indice, tieneError }) => {
              return (
                <TableRow key={campo.id} className={tieneError ? "bg-destructive/5" : undefined}>
                  <TableCell className="align-top py-2">
                    <Badge
                      variant={tieneError ? "destructive" : "secondary"}
                      className="h-5 px-1.5 text-[10px] font-mono"
                    >
                      {campo.fila}
                    </Badge>
                  </TableCell>
                  {COLUMNAS.map((columna) => (
                    <TableCell key={columna.campo} className="align-top p-1.5">
                      <ProductoImportCeldaEditable
                        registro={registrarCelda(indice, campo.fila, columna.campo)}
                        error={obtenerError(indice, campo.fila, columna.campo)}
                      />
                    </TableCell>
                  ))}
                  <TableCell className="align-top p-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      title="Quitar fila de la importación"
                      onClick={() => eliminarFila(indice)}
                      disabled={estaImportando}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </table>

        {filasVisibles.length === 0 && (
          <div className="flex flex-col items-center gap-2 p-8 text-sm text-muted-foreground">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
            {totalFilas === 0 ? "No hay productos para importar." : "No quedan filas con errores. Ya puedes importar."}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancelar} disabled={estaImportando}>
          Cancelar
        </Button>
        <Button onClick={enviar} disabled={estaImportando || totalFilas === 0} className="gap-2">
          {estaImportando && <Loader2 className="h-4 w-4 animate-spin" />}
          {estaImportando ? "Importando..." : `Importar ${totalFilas} ${totalFilas === 1 ? "producto" : "productos"}`}
        </Button>
      </div>
    </div>
  );
}
