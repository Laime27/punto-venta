import { useState, useEffect } from "react";
import { toast } from "sonner";
import { esNumeroDecimalValido } from "@/lib/utils";
import type { ProductoCarritoType } from "../../types/PosType";

export function usePOSCartDecimalQuantity( item: ProductoCarritoType, actualizarCantidad: (id: number, cantidad: number) => void) {
    const [val, setVal] = useState(item.cantidad.toString());

    useEffect(() => {
        setVal(item.cantidad.toString());
    }, [item.cantidad]);

    const handleBlur = () => {
        let cantidadActual = parseFloat(val);
        if (isNaN(cantidadActual) || cantidadActual <= 0) {
            setVal(item.cantidad.toString());
        } else {
            if (cantidadActual > item.stock) {
                cantidadActual = item.stock;
                toast.error(`Cantidad de ${item.nombre} no puede ser mayor a la del stock ${item.stock}`);
            }
            setVal(cantidadActual.toString());
            actualizarCantidad(item.id, cantidadActual);
        }
    };

    const handleChange = (valor: string) => {
        if (esNumeroDecimalValido(valor)) {
            setVal(valor);
        }
    };

    return {
        val,
        handleBlur,
        handleChange
    };
}
