import { ShieldX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function SinAcceso() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <ShieldX className="h-8 w-8 text-destructive" />
      </div>
      <div className="space-y-1">
        <h1 className="text-xl font-bold">No tienes acceso a esta sección</h1>
        <p className="text-sm text-muted-foreground">Solicita al administrador que te asigne el permiso correspondiente.</p>
      </div>
      <Button variant="outline" onClick={() => navigate("/dashboard")}>
        Ir al inicio
      </Button>
    </div>
  );
}
