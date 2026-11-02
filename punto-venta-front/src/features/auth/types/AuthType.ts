export interface AuthType {
  email: string;
  password: string;
}

export type Permiso =
  | "venta.registrar"
  | "venta.desde_cotizacion"
  | "caja.ver"
  | "caja.abrir"
  | "caja.cerrar"
  | "caja.movimientos"
  | "comprobante.ver"
  | "comprobante.imprimir"
  | "comprobante.anular"
  | "comprobante.abonar"
  | "cotizacion.ver"
  | "cotizacion.crear"
  | "cotizacion.editar"
  | "cotizacion.eliminar"
  | "cotizacion.cambiar_estado"
  | "cotizacion.pdf"
  | "cliente.ver"
  | "cliente.crear"
  | "cliente.editar"
  | "cliente.eliminar"
  | "producto.ver"
  | "producto.crear"
  | "producto.editar"
  | "producto.eliminar"
  | "producto.importar"
  | "producto.exportar"
  | "producto.ver_costo"
  | "categoria.ver"
  | "categoria.crear"
  | "categoria.editar"
  | "categoria.eliminar"
  | "inventario.movimientos"
  | "ajuste.ver"
  | "ajuste.crear"
  | "orden_compra.ver"
  | "orden_compra.crear"
  | "orden_compra.editar"
  | "orden_compra.recibir"
  | "proveedor.ver"
  | "proveedor.crear"
  | "proveedor.editar"
  | "proveedor.eliminar"
  | "reporte.ventas"
  | "reporte.productos"
  | "reporte.cuentas_por_cobrar"
  | "reporte.inventario"
  | "reporte.perdidas"
  | "configuracion.empresa"
  | "configuracion.metodos_pago"
  | "configuracion.impresora"
  | "usuario.ver"
  | "usuario.crear"
  | "usuario.editar"
  | "usuario.desactivar"
  | "rol.gestionar";

export interface UsuarioSesionType {
  id: number;
  name: string;
  email: string;
}

export interface SesionType {
  user: UsuarioSesionType;
  rol: string | null;
  permisos: Permiso[];
}

export interface LoginRespuestaType extends SesionType {
  message: string;
  token: string;
}
