import { usePermisos } from "@/features/auth/hooks/usePermisos";
import { DashboardAccesos } from "./components/DashboardAccesos";
import { DashboardAdministrador } from "./components/DashboardAdministrador";

export default function Dashboard() {
  const { esAdministrador } = usePermisos();

  return esAdministrador ? <DashboardAdministrador /> : <DashboardAccesos />;
}
