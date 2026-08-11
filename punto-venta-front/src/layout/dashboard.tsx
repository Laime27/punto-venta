"use client";

import { SidebarProvider } from "@/components/ui/sidebar";

import DashboardSidebar from "@/layout/sidebar";
import DashboardHeader from "@/layout/header";

import { Outlet } from "react-router-dom";

export default function CategoriaPageDashboard() {
  return (
      <SidebarProvider className="">
        <DashboardSidebar />

        <div className="flex flex-1 flex-col min-w-0 h-full bg-background">
          <DashboardHeader />

          <main className="flex-1 overflow-y-auto px-2 sm:px-4 lg:px-6">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
  );
}
