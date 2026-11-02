import type { ProductoCarritoType } from "../../types/PosType";
import { usePOSCarritoCantidadDecimal } from "../../hooks/carrito/usePOSCarritoCantidadDecimal";

interface POSCarritoCantidadDecimalProps {
  item: ProductoCarritoType;
  actualizarCantidad: (id: number, cantidad: number) => void;
}

export function POSCarritoCantidadDecimal({ item, actualizarCantidad }: POSCarritoCantidadDecimalProps) {
  const { val, handleBlur, handleChange } = usePOSCarritoCantidadDecimal(item, actualizarCantidad);

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
