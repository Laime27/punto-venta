import { useState } from "react";
import type { CotizacionDetalleType } from "../../types/CotizacionType";

export const useCotizacionDetalles = (detallesIniciales: CotizacionDetalleType[] = []) => {
  const [detalles, setDetalles] = useState<CotizacionDetalleType[]>(detallesIniciales);

  const agregarProducto = (producto: { id: number; nombre: string; precio_venta?: number }) => {
    const existe = detalles.find((d) => d.producto_id === producto.id);
    if (existe) {
      setDetalles(
        detalles.map((d) =>
          d.producto_id === producto.id ? { ...d, cantidad: d.cantidad + 1 } : d
        )
      );
      return;
    }

    setDetalles([
      ...detalles,
      {
        producto_id: producto.id,
        producto: producto as any,
        cantidad: 1,
        precio_unitario: Number(producto.precio_venta ?? 0),
        descuento_unitario: 0,
      },
    ]);
  };

  const actualizarCantidad = (index: number, valor: number) => {
    const nuevosDetalles = [...detalles];
    nuevosDetalles[index].cantidad = valor;
    setDetalles(nuevosDetalles);
  };

  const actualizarPrecio = (index: number, valor: number) => {
    const nuevosDetalles = [...detalles];
    nuevosDetalles[index].precio_unitario = valor;
    setDetalles(nuevosDetalles);
  };

  const actualizarDescuento = (index: number, valor: number) => {
    const nuevosDetalles = [...detalles];
    nuevosDetalles[index].descuento_unitario = valor;
    setDetalles(nuevosDetalles);
  };

  const eliminarDetalle = (index: number) => {
    const nuevosDetalles = [...detalles];
    nuevosDetalles.splice(index, 1);
    setDetalles(nuevosDetalles);
  };

  const calcularSubtotal = () => {
    return detalles.reduce((acc, d) => acc + (d.cantidad * d.precio_unitario), 0);
  };
  
  const calcularTotalDescuento = () => {
    return detalles.reduce((acc, d) => acc + (d.cantidad * (d.descuento_unitario ?? 0)), 0);
  };

  const calcularTotal = () => {
    return calcularSubtotal() - calcularTotalDescuento();
  };

  return {
    detalles,
    setDetalles,
    agregarProducto,
    actualizarCantidad,
    actualizarPrecio,
    actualizarDescuento,
    eliminarDetalle,
    calcularSubtotal,
    calcularTotalDescuento,
    calcularTotal,
  };
};
