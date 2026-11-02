import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useSidebar } from "@/components/ui/sidebar";
import { useTheme } from "@/components/theme-provider";
import { removeToken } from "@/lib/cookie";
import { logoutAuth } from "@/features/auth/services/AuthService";
import { usePermisos } from "@/features/auth/hooks/usePermisos";
import { toast } from "sonner";

const obtenerIniciales = (nombre: string) =>
  nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join("");

export const useDashboardHeader = () => {
  const { toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();
  const { usuario, rol } = usePermisos();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const cambiarTema = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const cerrarSesion = async () => {
    await logoutAuth().then(
      () => toast.success("Sesión cerrada correctamente"),
      () => null
    );
    removeToken();
    queryClient.clear();
    navigate("/");
  };

  return {
    theme,
    usuario: {
      nombre: usuario?.name ?? "",
      rol: rol ?? "",
      iniciales: obtenerIniciales(usuario?.name ?? ""),
    },
    toggleSidebar,
    cambiarTema,
    cerrarSesion,
  };
};
