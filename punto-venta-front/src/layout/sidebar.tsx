import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

import { Layers } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { menuItems, puntoVentaItem, type MenuItemsProps } from "./sidebarItems"

function DashboardSidebar() {
  const location = useLocation()

  const renderMenuItems = (items: MenuItemsProps[]) => (
    <SidebarMenu>
      {items.map((item) => {
        const isActive = location.pathname === item.url
        return (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton
              asChild
              className={`transition-colors ${
                isActive
                  ? "bg-blue-700 text-white hover:bg-blue-800 hover:text-white"
                  : ""
              }`}
            >
              <Link to={item.url}>
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b">
        <div className="flex h-14 items-center px-4">
          <Layers className="mr-2 h-6 w-6" />
          <span className="text-lg font-semibold">Dashboard</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Punto de Venta</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(puntoVentaItem)}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(menuItems)}
          </SidebarGroupContent>
        </SidebarGroup>
        
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}

export default DashboardSidebar
