"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

import DashboardSidebar from "@/layout/sidebar";
import DashboardHeader from "@/layout/header";

import { Outlet } from "react-router-dom";

export default function CategoriaPageDashboard() {
  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider className=" bg-background">
        <DashboardSidebar />

        <div className="flex flex-1 flex-col min-w-0 h-full">
          <DashboardHeader />

          <main className="flex-1 overflow-y-auto px-2 sm:px-4 lg:px-6">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
