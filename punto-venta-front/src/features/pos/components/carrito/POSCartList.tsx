import { ShoppingCart, Trash2, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePosContext } from "@/features/pos/context/PosContext"
import { POSCartDecimalQuantity } from "./POSCartDecimalQuantity"
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Kbd} from "@/components/ui/kbd"

export function POSCartList() {
  const {
    estado: { carrito },
    funciones: {
      actualizarCantidad,
      eliminarProductoDelCarrito,
      actualizarPrecio,
    },
  } = usePosContext()

  if (carrito.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-muted-foreground">
        <div className="mb-4 opacity-30">
          <ShoppingCart className="h-16 w-16" />
        </div>
        <p className="text-sm text-center">Busca o escanea productos para agregarlos, <br />
         presiona la tecla 
         <Kbd className="text-primary text-md font-semibold">F3</Kbd> para buscar productos.</p>
      </div>
    )
  }

  return (
    <div className="custom-scrollbar flex-1 overflow-y-auto">
      {carrito.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-12 items-center gap-2 border-b p-3 transition-colors hover:bg-muted/30"
        >
          <div className="col-span-1 flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive/70 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => eliminarProductoDelCarrito(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="col-span-5">
            <div className="line-clamp-1 flex items-center gap-2 text-base font-semibold text-foreground/90">
              {item.nombre}
              {item.es_mayoreo && (
                 <Badge  className="text-amber-700 bg-amber-100 text-[9px] pointer-events-none ">MAYOREO</Badge>
              )}
            </div>
            <div className="mt-0.5 text-base text-muted-foreground flex items-center gap-2">
              <span>{item.codigo_barras || ""}</span>
              <span className="opacity-50">•</span>
              <span className={`${item.stock <= 0 ? 'text-destructive font-semibold' : ''}`}>
                Stock: {item.stock} {item.unidad?.nombre}
              </span>
            </div>
          </div>

          <div className="col-span-2 flex items-center justify-center text-sm font-medium">
            {item.precio_mayoreo != null ? (
              <Select
                value={item.es_mayoreo ? "mayoreo" : "venta"}
                onValueChange={(value) => {
                  if (value === "mayoreo") {
                    actualizarPrecio(item.id, Number(item.precio_mayoreo), true)
                  } else {
                    actualizarPrecio(item.id, Number(item.precio_venta), false)
                  }
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem key="venta" value="venta">
                      S/ {Number(item.precio_venta).toFixed(2)}
                    </SelectItem>
                    <SelectItem key="mayoreo" value="mayoreo">
                      S/ {Number(item.precio_mayoreo).toFixed(2)} (May.)
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : (
              <span>
                S/ {Number(item.precio_usado || item.precio_venta).toFixed(2)}
              </span>
            )}
          </div>

          <div className="col-span-2 flex items-center justify-center gap-1.5">
            {item.unidad?.permite_decimales === true ? (
              <POSCartDecimalQuantity
                item={item}
                actualizarCantidad={actualizarCantidad}
              />
            ) : (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6 shrink-0 rounded-full"
                  onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-5 text-center text-sm font-bold">
                  {item.cantidad}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6 shrink-0 rounded-full"
                  onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>

          <div className="col-span-2 flex items-center justify-end pr-2">
            <span className="font-bold ">
              S/ {item.subtotal.toFixed(2)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
