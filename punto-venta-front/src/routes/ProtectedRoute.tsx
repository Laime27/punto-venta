import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useVerificarSesion } from "@/features/auth/hooks/useVerificarSesion";

export const ProtectedRoute = () => {
  const { estaVerificando, estaAutenticado } = useVerificarSesion();

  if (estaVerificando) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!estaAutenticado) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  const { estaVerificando, estaAutenticado } = useVerificarSesion();

  if (estaVerificando) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (estaAutenticado) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
