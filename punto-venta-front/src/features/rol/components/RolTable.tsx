import { Loader2, Lock, Pencil, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRolListar } from "../hooks/useRolListar";

export function RolTable() {
  const { roles, isLoading, confirmacion, funciones } = useRolListar();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Roles y permisos
            <Badge>{roles.length}</Badge>
          </h2>
          <p className="text-sm text-muted-foreground">Define qué puede hacer cada tipo de usuario en el sistema.</p>
        </div>
        <Button onClick={funciones.crear} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo rol
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rol</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-center">Usuarios</TableHead>
                <TableHead className="text-center">Permisos</TableHead>
                <TableHead className="w-28 text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && roles.map((rol) => (
                <TableRow key={rol.id}>
                  <TableCell className="font-medium">
                    <span className="flex items-center gap-2">
                      {rol.es_administrador && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                      {rol.name}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{rol.descripcion ?? "-"}</TableCell>
                  <TableCell className="text-center">{rol.usuarios}</TableCell>
                  <TableCell className="text-center">
                    {rol.es_administrador ? <Badge variant="secondary">Todos</Badge> : rol.permisos}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600"
                        disabled={rol.es_administrador}
                        onClick={() => funciones.editar(rol.id)}
                        title={rol.es_administrador ? "El rol Administrador no se puede modificar" : "Editar"}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        disabled={rol.es_administrador || rol.usuarios > 0}
                        onClick={() => confirmacion.abrir(rol.id)}
                        title={rol.usuarios > 0 ? "Tiene usuarios asignados" : "Eliminar"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmacion.abierto}
        onClose={confirmacion.cerrar}
        onConfirm={funciones.confirmarEliminacion}
        title="¿Eliminar este rol?"
      />
    </div>
  );
}
