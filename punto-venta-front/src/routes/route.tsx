import DashboardLayout from "@/layout/dashboard";
import Auth from "@/features/auth";
import Dashboard from "@/features/admin/dashboard";
import Categoria from "@/features/categoria";
import Producto from "@/features/producto";
import Proveedor from "@/features/proveedor";
import Cliente from "@/features/cliente";
import { ProductoFormPage } from "@/features/producto/pages/ProductoFormPage";
import POS from "@/features/pos";
import MetodoPago from "@/features/metodopago";

export const routes = [
  {
    children: [
      {
        path: "/",
        element: <Auth />
      },
    ]
  },
  {
    element: <DashboardLayout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/categoria", element: <Categoria /> },
      { path: "/producto", element: <Producto /> },
      { path: "/proveedor", element: <Proveedor /> },
      { path: "/cliente", element: <Cliente /> },
      { path: "/producto/crear", element: <ProductoFormPage /> },
      { path: "/producto/:id/editar", element: <ProductoFormPage /> },
      { path: "/punto-venta", element: <POS /> },
      { path: "/metodos-pago", element: <MetodoPago /> },
    ]
  }
];