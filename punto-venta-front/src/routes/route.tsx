import type { ReactNode } from "react";
import DashboardLayout from "@/layout/dashboard";
import { PaginaNoEncontrada } from "@/components/PaginaNoEncontrada";
import Auth from "@/features/auth";
import { ProtectedRoute, PublicRoute } from "./ProtectedRoute";
import { AdministradorRoute, PermisoRoute } from "./PermisoRoute";
import type { RequisitoPermiso } from "@/features/auth/hooks/usePermisos";
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
import Comprobante from "@/features/comprobante";
import { ComprobanteAbonarPage } from "@/features/comprobante/pages/ComprobanteAbonarPage";
import Caja from "@/features/caja";
import { CajaVerPage } from "@/features/caja/pages/CajaVerPage";
import Empresa from "@/features/empresa";
import Impresora from "@/features/impresora";
import AjusteInventario from "@/features/ajuste-inventario";
import { AjusteInventarioCrearPage } from "@/features/ajuste-inventario/pages/AjusteInventarioCrearPage";
import { AjusteInventarioVerPage } from "@/features/ajuste-inventario/pages/AjusteInventarioVerPage";
import Kardex from "@/features/kardex";
import ReporteVentas from "@/features/reporte";
import { ReporteProductosPage } from "@/features/reporte/pages/ReporteProductosPage";
import { ReporteCuentasPorCobrarPage } from "@/features/reporte/pages/ReporteCuentasPorCobrarPage";
import { ReporteInventarioPage } from "@/features/reporte/pages/ReporteInventarioPage";
import { ReportePerdidasPage } from "@/features/reporte/pages/ReportePerdidasPage";
import Usuario from "@/features/usuario";
import Rol from "@/features/rol";
import { RolFormPage } from "@/features/rol/pages/RolFormPage";
import Respaldo from "@/features/respaldo";

const ruta = (path: string, permiso: RequisitoPermiso, element: ReactNode) => ({
  path,
  element: <PermisoRoute permiso={permiso}>{element}</PermisoRoute>,
});

export const routes = [
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/",
        element: <Auth />
      },
    ]
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          ruta("/punto-venta", "venta.registrar", <POS />),
          ruta("/caja", "caja.ver", <Caja />),
          ruta("/caja/:id/ver", "caja.ver", <CajaVerPage />),
          ruta("/comprobante", "comprobante.ver", <Comprobante />),
          ruta("/comprobante/:id/abonar", "comprobante.abonar", <ComprobanteAbonarPage />),
          ruta("/cotizacion", "cotizacion.ver", <Cotizacion />),
          ruta("/cotizacion/crear", "cotizacion.crear", <CotizacionCrearPage />),
          ruta("/cotizacion/:id/editar", "cotizacion.editar", <CotizacionActualizarPage />),
          ruta("/cotizacion/:id/ver", "cotizacion.ver", <CotizacionVerPage />),
          ruta("/cliente", "cliente.ver", <Cliente />),
          ruta("/producto", "producto.ver", <Producto />),
          ruta("/producto/crear", "producto.crear", <ProductoFormPage />),
          ruta("/producto/:id/editar", "producto.editar", <ProductoFormPage />),
          ruta("/producto/:id/kardex", "inventario.movimientos", <Kardex />),
          ruta("/categoria", "categoria.ver", <Categoria />),
          ruta("/ajuste-inventario", "ajuste.ver", <AjusteInventario />),
          ruta("/ajuste-inventario/crear", "ajuste.crear", <AjusteInventarioCrearPage />),
          ruta("/ajuste-inventario/:id/ver", ["ajuste.ver", "ajuste.crear"], <AjusteInventarioVerPage />),
          ruta("/historial-movimiento", "inventario.movimientos", <HistorialMovimiento />),
          ruta("/orden-compra", "orden_compra.ver", <OrdenCompra />),
          ruta("/orden-compra/crear", "orden_compra.crear", <OrdenCompraCrearPage />),
          ruta("/orden-compra/:id/editar", "orden_compra.editar", <OrdenCompraActualizarPage />),
          ruta("/orden-compra/:id/ver", "orden_compra.ver", <OrdenCompraVerPage />),
          ruta("/orden-compra/:id/recibir", "orden_compra.recibir", <OrdenCompraRecibirPage />),
          ruta("/proveedor", "proveedor.ver", <Proveedor />),
          ruta("/reportes/ventas", "reporte.ventas", <ReporteVentas />),
          ruta("/reportes/productos", "reporte.productos", <ReporteProductosPage />),
          ruta("/reportes/cuentas-por-cobrar", "reporte.cuentas_por_cobrar", <ReporteCuentasPorCobrarPage />),
          ruta("/reportes/inventario", "reporte.inventario", <ReporteInventarioPage />),
          ruta("/reportes/perdidas", "reporte.perdidas", <ReportePerdidasPage />),
          ruta("/empresa", "configuracion.empresa", <Empresa />),
          ruta("/metodos-pago", "configuracion.metodos_pago", <MetodoPago />),
          ruta("/impresora", "configuracion.impresora", <Impresora />),
          ruta("/usuarios", "usuario.ver", <Usuario />),
          ruta("/roles", "rol.gestionar", <Rol />),
          ruta("/roles/crear", "rol.gestionar", <RolFormPage />),
          ruta("/roles/:id/editar", "rol.gestionar", <RolFormPage />),
          { path: "/respaldo", element: <AdministradorRoute><Respaldo /></AdministradorRoute> },
          { path: "*", element: <PaginaNoEncontrada /> },
        ]
      }
    ]
  }
];
