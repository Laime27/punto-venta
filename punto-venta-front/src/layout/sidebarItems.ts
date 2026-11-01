import { LayoutDashboard, Tags, Package, Truck, Users, CreditCard, ArrowLeftRight, ShoppingCart, Receipt, Vault, Building2, Printer, FileText, ScanBarcode, ClipboardCheck, type LucideIcon } from "lucide-react";

export interface MenuItemsProps {
  label: string;
  icon: LucideIcon;
  url: string;
}

export interface MenuGroup {
  label: string;
  items: MenuItemsProps[];
}

// Acción principal: abrir la pantalla de venta
export const puntoVentaItem: MenuItemsProps = {
  label: "Nueva venta",
  icon: ScanBarcode,
  url: "/punto-venta",
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
      {
        label: "Caja",
        icon: Vault,
        url: "/caja",
      },
      {
        label: "Comprobantes",
        icon: Receipt,
        url: "/comprobante",
      },
      {
        label: "Cotizaciones",
        icon: FileText,
        url: "/cotizacion",
      },
      {
        label: "Clientes",
        icon: Users,
        url: "/cliente",
      },
    ],
  },
  {
    label: "Inventario",
    items: [
      {
        label: "Productos",
        icon: Package,
        url: "/producto",
      },
      {
        label: "Categorías",
        icon: Tags,
        url: "/categoria",
      },
      {
        label: "Ajustes de Inventario",
        icon: ClipboardCheck,
        url: "/ajuste-inventario",
      },
      {
        label: "Movimientos",
        icon: ArrowLeftRight,
        url: "/historial-movimiento",
      },
    ],
  },
  {
    label: "Compras",
    items: [
      {
        label: "Órdenes de Compra",
        icon: ShoppingCart,
        url: "/orden-compra",
      },
      {
        label: "Proveedores",
        icon: Truck,
        url: "/proveedor",
      },
    ],
  },
];

export const configItems: MenuItemsProps[] = [
  {
    label: "Empresa",
    icon: Building2,
    url: "/empresa",
  },
  {
    label: "Métodos de Pago",
    icon: CreditCard,
    url: "/metodos-pago",
  },
  {
    label: "Impresora",
    icon: Printer,
    url: "/impresora",
  },
];
