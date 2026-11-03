import { usePermisos } from "@/features/auth/hooks/usePermisos";
import { configItems, dashboardItem, menuGroups, puntoVentaItem, type MenuItemsProps } from "../sidebarItems";

export const useSidebarMenu = () => {
  const { puede, esAdministrador } = usePermisos();
  const permitido = (item: MenuItemsProps) => puede(item.permiso) && (!item.soloAdministrador || esAdministrador);

  return {
    puntoVenta: permitido(puntoVentaItem) ? puntoVentaItem : null,
    dashboard: esAdministrador ? dashboardItem : { ...dashboardItem, label: "Inicio" },
    grupos: menuGroups
      .map((grupo) => ({ ...grupo, items: grupo.items.filter(permitido) }))
      .filter((grupo) => grupo.items.length > 0),
    configuracion: configItems.filter(permitido),
  };
};
