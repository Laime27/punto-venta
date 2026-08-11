import type { ProductoCarritoType } from "../../types/PosType";
import { usePOSCartDecimalQuantity } from "../../hooks/carrito/usePOSCartDecimalQuantity";

interface POSCartDecimalQuantityProps {
  item: ProductoCarritoType;
  actualizarCantidad: (id: number, cantidad: number) => void;
}

export function POSCartDecimalQuantity({ item, actualizarCantidad }: POSCartDecimalQuantityProps) {
  const { val, handleBlur, handleChange } = usePOSCartDecimalQuantity(item, actualizarCantidad);

  return (
    <input 
       type="text" 
       className="w-18 text-center text-sm font-bold bg-muted/50 border rounded-md outline-none h-7 px-1 focus:ring-1 focus:ring-primary"
       value={val}
       onChange={(e) => handleChange(e.target.value)}
       onFocus={(e) => {
         e.target.select();
       }}
       onBlur={handleBlur}
       onKeyDown={(e) => { if (e.key === 'Enter') handleBlur() }}
    />
  );
}
