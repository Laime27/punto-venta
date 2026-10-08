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
import HistorialMovimiento from "@/features/historial-movimiento";
import OrdenCompra from "@/features/ordencompra";
import { OrdenCompraCrearPage } from "@/features/ordencompra/pages/OrdenCompraCrearPage";
import { OrdenCompraActualizarPage } from "@/features/ordencompra/pages/OrdenCompraActualizarPage";
import { OrdenCompraRecibirPage } from "@/features/ordencompra/pages/OrdenCompraRecibirPage";
import { OrdenCompraVerPage } from "@/features/ordencompra/pages/OrdenCompraVerPage";
import Cotizacion from "@/features/cotizacion";
import { CotizacionCrearPage } from "@/features/cotizacion/pages/CotizacionCrearPage";
import { CotizacionActualizarPage } from "@/features/cotizacion/pages/CotizacionActualizarPage";
import { CotizacionVerPage } from "@/features/cotizacion/pages/CotizacionVerPage";

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
      { path: "/historial-movimiento", element: <HistorialMovimiento /> },
      { path: "/orden-compra", element: <OrdenCompra /> },
      { path: "/orden-compra/crear", element: <OrdenCompraCrearPage /> },
      { path: "/orden-compra/:id/editar", element: <OrdenCompraActualizarPage /> },
      { path: "/orden-compra/:id/ver", element: <OrdenCompraVerPage /> },
      { path: "/orden-compra/:id/recibir", element: <OrdenCompraRecibirPage /> },
      { path: "/cotizacion", element: <Cotizacion /> },
      { path: "/cotizacion/crear", element: <CotizacionCrearPage /> },
      { path: "/cotizacion/:id/editar", element: <CotizacionActualizarPage /> },
      { path: "/cotizacion/:id/ver", element: <CotizacionVerPage /> },
    ]
  }
];