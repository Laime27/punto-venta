import { useState } from "react";
import type { OrdenCompraDetalleType } from "../../types/OrdenCompraType";
import type { ProductoType } from "@/features/producto/types/ProductoType";

export const useOrdenCompraDetalles = (initialDetalles: OrdenCompraDetalleType[] = []) => {
  const [detalles, setDetalles] = useState<OrdenCompraDetalleType[]>(initialDetalles);

  const agregarProducto = (producto: { id: number; nombre: string; precio_compra?: number }) => {
    const existe = detalles.find((d) => d.producto_id === producto.id);
    if (existe) {
      setDetalles((prev) =>
        prev.map((d) =>
          d.producto_id === producto.id
            ? { ...d, cantidad_pedida: d.cantidad_pedida + 1 }
            : d
        )
      );
    } else {
      setDetalles((prev) => [
        ...prev,
        {
          producto_id: producto.id,
          producto: { id: producto.id, nombre: producto.nombre } as ProductoType,
          cantidad_pedida: 1,
          precio_unitario: producto.precio_compra ?? 0,
        },
      ]);
    }
  };

  const actualizarCantidad = (index: number, valor: number) => {
    setDetalles((prev) =>
      prev.map((d, i) => (i === index ? { ...d, cantidad_pedida: valor } : d))
    );
  };

  const actualizarPrecio = (index: number, valor: number) => {
    setDetalles((prev) =>
      prev.map((d, i) => (i === index ? { ...d, precio_unitario: valor } : d))
    );
  };

  const eliminarDetalle = (index: number) => {
    setDetalles((prev) => prev.filter((_, i) => i !== index));
  };

  const calcularTotal = () =>
    detalles.reduce((acc, d) => acc + d.cantidad_pedida * d.precio_unitario, 0);

  return {
    detalles,
    setDetalles,
    agregarProducto,
    actualizarCantidad,
    actualizarPrecio,
    eliminarDetalle,
    calcularTotal,
  };
};
