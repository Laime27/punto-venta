import { LayoutDashboard, Tags, Package, Settings, Truck, Users, CreditCard, Activity, ShoppingCart, Receipt, Vault, Building2, Printer, type LucideIcon } from "lucide-react";

export interface MenuItemsProps {
  label: string;
  icon: LucideIcon;
  url: string;
}

export interface MenuGroup {
  label: string;
  items: MenuItemsProps[];
}

export const menuGroups: MenuGroup[] = [
  {
    label: "General",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        url: "/dashboard",
      },
    ],
  },
  {
    label: "Inventario",
    items: [
      {
        label: "Categorias",
        icon: Tags,
        url: "/categoria",
      },
      {
        label: "Productos",
        icon: Package,
        url: "/producto",
      },
    ],
  },
  {
    label: "Contactos",
    items: [
      {
        label: "Clientes",
        icon: Users,
        url: "/cliente",
      },
      {
        label: "Proveedores",
        icon: Truck,
        url: "/proveedor",
      },
    ],
  },
  {
    label: "Administración",
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
        label: "Órdenes de Compra",
        icon: ShoppingCart,
        url: "/orden-compra",
      },
      {
        label: "Cotizaciones",
        icon: ShoppingCart,
        url: "/cotizacion",
      },
      {
        label: "Historial Movimientos",
        icon: Activity,
        url: "/historial-movimiento",
      },
      {
        label: "Métodos de Pago",
        icon: CreditCard,
        url: "/metodos-pago",
      },
      {
        label: "Empresa",
        icon: Building2,
        url: "/empresa",
      },
      {
        label: "Impresora",
        icon: Printer,
        url: "/impresora",
      },
    ],
  },
];

export const puntoVentaItem: MenuItemsProps[] = [
  {
    label: "Punto de Venta",
    icon: Settings,
    url: "/punto-venta",
  },
];
