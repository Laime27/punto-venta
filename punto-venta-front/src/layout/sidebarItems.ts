import { LayoutDashboard, Tags, Package, Truck, Users, CreditCard, ArrowLeftRight, ShoppingCart, Receipt, Vault, Building2, Printer, FileText, ScanBarcode, ClipboardCheck, BarChart3, PackageSearch, HandCoins, Warehouse, TriangleAlert, UserCog, ShieldCheck, DatabaseBackup, type LucideIcon } from "lucide-react";
import type { RequisitoPermiso } from "@/features/auth/hooks/usePermisos";

export interface MenuItemsProps {
  label: string;
  icon: LucideIcon;
  url: string;
  permiso?: RequisitoPermiso;
  soloAdministrador?: boolean;
}

export interface MenuGroup {
  label: string;
  items: MenuItemsProps[];
}

export const puntoVentaItem: MenuItemsProps = {
  label: "Nueva venta",
  icon: ScanBarcode,
  url: "/punto-venta",
  permiso: "venta.registrar",
};

export const dashboardItem: MenuItemsProps = {
  label: "Dashboard",
  icon: LayoutDashboard,
  url: "/dashboard",
};

export const menuGroups: MenuGroup[] = [
  {
    label: "Ventas",
    items: [
      { label: "Caja", icon: Vault, url: "/caja", permiso: "caja.ver" },
      { label: "Comprobantes", icon: Receipt, url: "/comprobante", permiso: "comprobante.ver" },
      { label: "Cotizaciones", icon: FileText, url: "/cotizacion", permiso: "cotizacion.ver" },
      { label: "Clientes", icon: Users, url: "/cliente", permiso: "cliente.ver" },
    ],
  },
  {
    label: "Inventario",
    items: [
      { label: "Productos", icon: Package, url: "/producto", permiso: "producto.ver" },
      { label: "Categorías", icon: Tags, url: "/categoria", permiso: "categoria.ver" },
      { label: "Ajustes de Inventario", icon: ClipboardCheck, url: "/ajuste-inventario", permiso: "ajuste.ver" },
      { label: "Movimientos", icon: ArrowLeftRight, url: "/historial-movimiento", permiso: "inventario.movimientos" },
    ],
  },
  {
    label: "Reportes",
    items: [
      { label: "Ventas", icon: BarChart3, url: "/reportes/ventas", permiso: "reporte.ventas" },
      { label: "Productos", icon: PackageSearch, url: "/reportes/productos", permiso: "reporte.productos" },
      { label: "Cuentas por cobrar", icon: HandCoins, url: "/reportes/cuentas-por-cobrar", permiso: "reporte.cuentas_por_cobrar" },
      { label: "Inventario", icon: Warehouse, url: "/reportes/inventario", permiso: "reporte.inventario" },
      { label: "Pérdidas", icon: TriangleAlert, url: "/reportes/perdidas", permiso: "reporte.perdidas" },
    ],
  },
  {
    label: "Compras",
    items: [
      { label: "Órdenes de Compra", icon: ShoppingCart, url: "/orden-compra", permiso: "orden_compra.ver" },
      { label: "Proveedores", icon: Truck, url: "/proveedor", permiso: "proveedor.ver" },
    ],
  },
];

export const configItems: MenuItemsProps[] = [
  { label: "Empresa", icon: Building2, url: "/empresa", permiso: "configuracion.empresa" },
  { label: "Métodos de Pago", icon: CreditCard, url: "/metodos-pago", permiso: "configuracion.metodos_pago" },
  { label: "Impresora", icon: Printer, url: "/impresora", permiso: "configuracion.impresora" },
  { label: "Usuarios", icon: UserCog, url: "/usuarios", permiso: "usuario.ver" },
  { label: "Roles y permisos", icon: ShieldCheck, url: "/roles", permiso: "rol.gestionar" },
  { label: "Copia de seguridad", icon: DatabaseBackup, url: "/respaldo", soloAdministrador: true },
];
