import { Loader2, Pencil, Plus } from "lucide-react";
import { AppPagination } from "@/components/AppPagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Puede } from "@/features/auth/components/Puede";
import { usePermisos } from "@/features/auth/hooks/usePermisos";
import { useUsuarioListar } from "../hooks/useUsuarioListar";
import { UsuarioFilters } from "./UsuarioFilters";
import { UsuarioModal } from "./UsuarioModal";

export function UsuarioTable() {
  const { datos, paginacion, filtros, modal, estado } = useUsuarioListar();
  const { usuario: usuarioActual, puede } = usePermisos();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Usuarios
            <Badge>{datos.total}</Badge>
          </h2>
          <p className="text-sm text-muted-foreground">Personas que pueden ingresar al sistema y el rol que cumplen.</p>
        </div>
        <Puede permiso="usuario.crear">
          <Button onClick={modal.abrirNuevo} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo usuario
          </Button>
        </Puede>
      </div>

      <UsuarioFilters roles={datos.roles} filtros={filtros} />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Registrado</TableHead>
                <TableHead className="text-center">Activo</TableHead>
                <TableHead className="w-20 text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datos.isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              )}

              {!datos.isLoading && datos.usuarios.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No se encontraron usuarios.
                  </TableCell>
                </TableRow>
              )}

              {!datos.isLoading && datos.usuarios.map((usuario) => (
                <TableRow key={usuario.id} className={usuario.activo ? "" : "opacity-60"}>
                  <TableCell>
                    <p className="flex items-center gap-2 font-medium">
                      {usuario.name}
                      {usuario.es_dueno && <Badge variant="outline">Dueño</Badge>}
                    </p>
                    <p className="text-xs text-muted-foreground">{usuario.email}</p>
                  </TableCell>
                  <TableCell>
                    {usuario.rol ? <Badge variant="secondary">{usuario.rol.nombre}</Badge> : <span className="text-muted-foreground">Sin rol</span>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{usuario.created_at?.slice(0, 10)}</TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={Boolean(usuario.activo)}
                      onCheckedChange={() => estado.cambiar(usuario.id)}
                      disabled={!puede("usuario.desactivar") || usuario.es_dueno || usuario.id === usuarioActual?.id || estado.cambiando}
                      title={usuario.es_dueno ? "El dueño del sistema no se puede desactivar" : undefined}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Puede permiso="usuario.editar">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600"
                        onClick={() => modal.abrirEdicion(usuario)}
                        disabled={usuario.es_dueno && usuario.id !== usuarioActual?.id}
                        title={usuario.es_dueno && usuario.id !== usuarioActual?.id ? "Solo el dueño puede modificar su cuenta" : "Editar"}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Puede>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="p-6">
            <AppPagination
              page={paginacion.pagina}
              totalPages={paginacion.totalPaginas}
              onPageChange={paginacion.setPagina}
              disabled={datos.isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {modal.abierto && (
        <UsuarioModal key={modal.usuario?.id ?? "nuevo"} usuario={modal.usuario} roles={datos.roles} onClose={modal.cerrar} />
      )}
    </div>
  );
}
