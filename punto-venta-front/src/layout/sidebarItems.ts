import { LayoutDashboard, Tags, Package, Settings, Truck, Users, CreditCard } from "lucide-react";

export interface MenuItemsProps {
  label: string;
  icon: any;
  url: string;
}

export const menuItems: MenuItemsProps[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    url: "/dashboard",
  },
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
  {
    label: "Proveedores",
    icon: Truck,
    url: "/proveedor",
  },
  {
    label: "Clientes",
    icon: Users,
    url: "/cliente",
  },
  {
    label: "Métodos de Pago",
    icon: CreditCard,
    url: "/metodos-pago",
  },
];

export const puntoVentaItem: MenuItemsProps[] = [
  {
    label: "Punto de Venta",
    icon: Settings,
    url: "/punto-venta",
  },
];
