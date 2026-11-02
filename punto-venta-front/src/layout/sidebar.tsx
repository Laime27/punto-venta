import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

import { Link, useLocation } from "react-router-dom"
import { type MenuItemsProps } from "./sidebarItems"
import { useSidebarMenu } from "./hooks/useSidebarMenu"

const itemClass =
  "relative h-9 rounded-lg text-sidebar-foreground transition-colors focus-visible:ring-sidebar-ring/40 " +
  "data-active:bg-sidebar-primary/12 data-active:text-sidebar-primary " +
  "data-active:before:absolute data-active:before:left-0 data-active:before:inset-y-2 data-active:before:w-[3px] data-active:before:rounded-r-full data-active:before:bg-sidebar-primary"

const groupLabelClass = "text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/45"

function DashboardSidebar() {
  const location = useLocation()
  const { puntoVenta, dashboard, grupos, configuracion } = useSidebarMenu()

  const isActive = (url: string) =>
    location.pathname === url || location.pathname.startsWith(`${url}/`)

  const renderItem = (item: MenuItemsProps) => (
    <SidebarMenuItem key={item.url}>
      <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.label} className={itemClass}>
        <Link to={item.url}>
          <item.icon />
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader>
        <div className="flex h-12 items-center justify-center gap-3 px-1">
            <span className="truncate text-lg font-semibold text-center text-sidebar-accent-foreground">Punto de Venta</span>
        </div>

        {puntoVenta && (
        <SidebarMenu className="mt-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={puntoVenta.label}
              className="h-10 justify-center rounded-lg bg-sidebar-primary font-semibold text-sidebar-primary-foreground shadow-md shadow-sidebar-primary/20 hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground active:bg-sidebar-primary/80 active:text-sidebar-primary-foreground"
            >
              <Link to={puntoVenta.url}>
                <puntoVenta.icon />
                <span>{puntoVenta.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{renderItem(dashboard)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {grupos.map((group) => (
          <SidebarGroup key={group.label} className="py-1">
            <SidebarGroupLabel className={groupLabelClass}>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{group.items.map(renderItem)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {configuracion.length > 0 && (
        <>
          <SidebarSeparator className="mx-0" />
          <SidebarFooter>
            <SidebarGroupLabel className={groupLabelClass}>Configuración</SidebarGroupLabel>
            <SidebarMenu>{configuracion.map(renderItem)}</SidebarMenu>
          </SidebarFooter>
        </>
      )}

      <SidebarRail />
    </Sidebar>
  )
}

export default DashboardSidebar
