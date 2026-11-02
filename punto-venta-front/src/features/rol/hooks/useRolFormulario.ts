import { useNavigate, useParams } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorHandler";
import { actualizarRol, crearRol, listarGruposPermisos, obtenerRol } from "../services/RolService";
import { rolSchema, type RolFormValues } from "../validations/RolValidation";
import type { GrupoPermisosType } from "../types/RolType";

export type EstadoGrupo = boolean | "indeterminate";

const VALORES_INICIALES: RolFormValues = { name: "", descripcion: "", permisos: [] };

export const useRolFormulario = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const rolId = id ? Number(id) : null;

  const { data: grupos = [], isLoading: cargandoGrupos } = useQuery({
    queryKey: ["permisos-agrupados"],
    queryFn: listarGruposPermisos,
    staleTime: Infinity,
  });

  const { data: rol, isLoading: cargandoRol } = useQuery({
    queryKey: ["rol", rolId],
    queryFn: () => obtenerRol(rolId!),
    enabled: rolId !== null,
  });

  const form = useForm<RolFormValues>({
    resolver: zodResolver(rolSchema),
    defaultValues: VALORES_INICIALES,
    values: rol ? { name: rol.name, descripcion: rol.descripcion ?? "", permisos: rol.permisos } : undefined,
  });

  const seleccionados = new Set(useWatch({ control: form.control, name: "permisos" }));
  const totalPermisos = grupos.reduce((acc, grupo) => acc + grupo.permisos.length, 0);

  const asignarPermisos = (permisos: Set<number>) =>
    form.setValue("permisos", [...permisos], { shouldValidate: form.formState.isSubmitted, shouldDirty: true });

  const alternarPermiso = (permisoId: number) => {
    const nuevos = new Set(seleccionados);
    if (nuevos.has(permisoId)) nuevos.delete(permisoId);
    else nuevos.add(permisoId);
    asignarPermisos(nuevos);
  };

  const estadoGrupo = (grupo: GrupoPermisosType): EstadoGrupo => {
    const marcados = grupo.permisos.filter((permiso) => seleccionados.has(permiso.id)).length;
    if (marcados === 0) return false;
    return marcados === grupo.permisos.length ? true : "indeterminate";
  };

  const alternarGrupo = (grupo: GrupoPermisosType) => {
    const nuevos = new Set(seleccionados);
    const marcarTodos = estadoGrupo(grupo) !== true;
    grupo.permisos.forEach((permiso) => (marcarTodos ? nuevos.add(permiso.id) : nuevos.delete(permiso.id)));
    asignarPermisos(nuevos);
  };

  const alternarTodos = () =>
    asignarPermisos(
      seleccionados.size === totalPermisos ? new Set() : new Set(grupos.flatMap((grupo) => grupo.permisos.map((permiso) => permiso.id)))
    );

  const { mutateAsync: guardar, isPending: guardando } = useMutation({
    mutationFn: (valores: RolFormValues) => {
      const payload = { ...valores, descripcion: valores.descripcion.trim() || null };
      return rolId ? actualizarRol(rolId, payload) : crearRol(payload);
    },
    onSuccess: () => {
      toast.success(rolId ? "Rol actualizado correctamente" : "Rol creado correctamente");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["rol", rolId] });
      navigate("/roles");
    },
    onError: (error) => toast.error(getErrorMessage(error, "No se pudo guardar el rol")),
  });

  return {
    form,
    grupos,
    esEdicion: rolId !== null,
    esAdministrador: Boolean(rol?.es_administrador),
    cargando: cargandoGrupos || (rolId !== null && cargandoRol),
    guardando,
    seleccion: {
      seleccionados,
      totalSeleccionados: seleccionados.size,
      totalPermisos,
      estadoGrupo,
      alternarPermiso,
      alternarGrupo,
      alternarTodos,
    },
    funciones: {
      onSubmit: form.handleSubmit((valores) => guardar(valores)),
      cancelar: () => navigate("/roles"),
    },
  };
};
