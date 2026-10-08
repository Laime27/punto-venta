import { LayoutDashboard, Tags, Package, Settings, Truck, Users, CreditCard, Activity, ShoppingCart } from "lucide-react";

export interface MenuItemsProps {
  label: string;
  icon: any;
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
