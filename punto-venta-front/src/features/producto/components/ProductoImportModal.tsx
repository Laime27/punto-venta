import { UploadCloud, FileType, X, Loader2, Download, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductoImportCorreccion } from "./ProductoImportCorreccion";

interface ProductoImportModalProps {
  importHook: ReturnType<typeof import("../hooks/ProductoImportHook").useProductoImportHook>;
}

export function ProductoImportModal({ importHook }: ProductoImportModalProps) {
  const {
    estado: { modalAbierto, archivo, estaImportando, errorImportacion },
    refs: { inputRef },
    funciones: {
      cerrarModal,
      importar,
      manejarArrastrarSobre,
      manejarSoltar,
      manejarCambioInput,
      removerArchivo,
      descargarPlantilla,
    },
  } = importHook;

  const tieneErroresFilas = Boolean(errorImportacion?.errores && errorImportacion.errores.length > 0);
  const modoCorreccion = Boolean(errorImportacion?.filas && errorImportacion.filas.length > 0);

const anchoModal = modoCorreccion || tieneErroresFilas
  ? "w-[98vw] max-w-none max-h-[95vh] overflow-y-auto" 
  : "sm:max-w-md";

  return (
    <Dialog open={modalAbierto} onOpenChange={cerrarModal}>
      <DialogContent className={`transition-all duration-200 ${anchoModal}`}>
        <DialogHeader>
          <DialogTitle>Importar Productos</DialogTitle>
          <DialogDescription>
            {modoCorreccion
              ? "Corrige los datos marcados en rojo directamente en la tabla y vuelve a importar."
              : "Sube un archivo Excel o CSV con la información de los productos."}
          </DialogDescription>
        </DialogHeader>

        {modoCorreccion && archivo ? (
          <div className="flex items-center gap-3 rounded-md border bg-muted/30 p-2.5">
            <FileType className="h-6 w-6 text-blue-500 shrink-0" />
            <p className="flex-1 min-w-0 text-sm font-medium truncate" title={archivo.name}>
              {archivo.name}
            </p>
            <Button variant="outline" size="sm" onClick={removerArchivo}>
              Cambiar archivo
            </Button>
          </div>
        ) : (
          <>
            <div
              className={`mt-4 border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors cursor-pointer ${
                archivo ? "border-primary/50 bg-primary/5 cursor-default" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
              }`}
              onDragOver={manejarArrastrarSobre}
              onDrop={manejarSoltar}
              onClick={() => !archivo && inputRef.current?.click()}
            >
              <input
                type="file"
                ref={inputRef}
                onChange={manejarCambioInput}
                accept=".xlsx, .xls, .csv"
                className="hidden"
              />

              {!archivo ? (
                <>
                  <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-sm font-medium text-center">
                    Haz clic o arrastra un archivo aquí
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Soporta .xlsx, .xls, .csv
                  </p>
                </>
              ) : (
                <div className="flex flex-col items-center w-full">
                  <div className="flex items-center gap-3 w-full bg-background p-3 rounded-md border shadow-sm">
                    <FileType className="h-8 w-8 text-blue-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" title={archivo.name}>
                        {archivo.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(archivo.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        removerArchivo();
                      }}
                      disabled={estaImportando}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={descargarPlantilla}
              className="w-full cursor-pointer text-primary hover:text-primary/80 text-sm font-medium underline-offset-4 hover:underline flex items-center justify-center gap-2 mt-4"
            >
              <Download className="h-4 w-4" />
              Descargar plantilla de ejemplo
            </button>
          </>
        )}

        {errorImportacion && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3.5 text-sm space-y-2.5 animate-in fade-in-50">
            <div className="flex items-start gap-2.5 text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs sm:text-sm">
                <p className="font-semibold leading-snug">
                  {errorImportacion.mensaje}
                </p>
                {tieneErroresFilas && !modoCorreccion && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Se encontraron {errorImportacion.errores!.length}{" "}
                    {errorImportacion.errores!.length === 1 ? "error" : "errores"} de validación en las siguientes filas:
                  </p>
                )}
              </div>
            </div>

            {tieneErroresFilas && !modoCorreccion && (
              <div className="max-h-52 overflow-y-auto space-y-2 pr-1 rounded-md border border-destructive/20 bg-background/90 p-2 text-xs">
                {errorImportacion.errores!.map((err, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-muted/40 border border-border/50 flex flex-col gap-1 text-foreground"
                  >
                    <div className="flex items-center gap-2">
                      <Badge className="h-5 px-1.5 text-[10px] font-mono bg-red-500 hover:bg-red-500">
                        Fila {err.fila}
                      </Badge>
                      <span className="font-medium text-xs text-destructive">
                        Campo: {err.campo}
                      </span>
                    </div>
                    <ul className="list-disc list-inside text-muted-foreground space-y-0.5 pl-1">
                      {err.errores.map((msg, msgIdx) => (
                        <li key={msgIdx} className="text-xs">
                          {msg}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {modoCorreccion ? (
          <ProductoImportCorreccion
            filasExcel={errorImportacion!.filas!}
            erroresIniciales={errorImportacion!.errores ?? []}
            onImportado={cerrarModal}
            onCancelar={cerrarModal}
          />
        ) : (
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button variant="outline" onClick={cerrarModal} disabled={estaImportando}>
              Cancelar
            </Button>
            <Button onClick={() => importar()} disabled={!archivo || estaImportando} className="gap-2">
              {estaImportando && <Loader2 className="h-4 w-4 animate-spin" />}
              {estaImportando ? "Importando..." : "Importar"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
