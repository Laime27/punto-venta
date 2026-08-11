import { User, Plus, Edit2, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCustomerSearch } from "../../hooks/buscadores/useCustomerSearch";
import { ClienteModal } from "@/features/cliente/components/ClienteModal";
import type { ClienteType } from "@/features/cliente/types/ClienteType";

export function POSCustomerSearch() {
  const {
    estado,
    referencias,
    funciones,
    modificadores,
  } = useCustomerSearch();

  const renderDropdownContenido = () => {
    if (estado.estaCargando) {
      return (
        <div className="p-4 flex items-center justify-center text-sm text-muted-foreground gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Buscando...
        </div>
      );
    }

    if (estado.resultados.length === 0) {
      return (
        <div className="p-4 text-center text-sm text-muted-foreground">
          No se encontraron clientes para "{estado.busqueda}"
        </div>
      );
    }

    return (
      <ul className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
        {estado.resultados.map((cliente: ClienteType, index: number) => (
          <li
            key={cliente.id}
            className={`px-4 py-2.5 flex flex-col cursor-pointer transition-colors border-l-2 ${
              index === estado.indiceSeleccionado
                ? "bg-primary/5 border-l-primary"
                : "border-l-transparent hover:bg-muted/30"
            }`}
            onClick={() => funciones.seleccionarCliente(cliente)}
            onMouseEnter={() => modificadores.setIndiceSeleccionado(index)}
          >
            <span className="font-semibold text-sm text-foreground">
              {cliente.nombre}
            </span>
            {cliente.correo && (
              <span className="text-xs text-muted-foreground">
                {cliente.correo}
              </span>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <div className="flex items-center gap-2 w-full relative" ref={referencias.contenedorRef}>
        <div className="relative flex-1 flex items-center">
          <User className="absolute left-3 h-4 w-4 text-primary" />
          <Input
            ref={referencias.inputRef}
            value={estado.busqueda}
            onChange={(e) => modificadores.setBusqueda(e.target.value)}
            onKeyDown={funciones.manejarTeclado}
            onFocus={() => {
              if (estado.resultados.length > 0) modificadores.setEstaAbierto(true);
            }}
            placeholder="Buscar cliente (Público General)..."
            className="pl-9 pr-10 h-11 bg-card border-border rounded-2xl shadow-sm text-sm font-medium"
          />
          {estado.clienteSeleccionado && (
            <button
              onClick={funciones.limpiarSeleccion}
              className="absolute right-3 p-1 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {estado.estaAbierto && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-lg shadow-xl z-50 overflow-hidden flex flex-col">
              {renderDropdownContenido()}
            </div>
          )}
        </div>

        <Button
          onClick={funciones.abrirCrear}
          variant="outline"
          size="icon"
          className="h-11 w-11 text-muted-foreground border-border bg-card rounded-2xl shadow-sm hover:text-foreground shrink-0"
        >
          <Plus className="h-5 w-5" />
        </Button>

        <Button
          onClick={funciones.abrirEditar}
          disabled={!estado.clienteSeleccionado}
          variant="outline"
          size="icon"
          className="h-11 w-11 text-muted-foreground border-border bg-card rounded-2xl shadow-sm hover:text-foreground disabled:opacity-50 shrink-0"
        >
          <Edit2 className="h-5 w-5" />
        </Button>
      </div>

      <ClienteModal
        open={estado.modalOpen}
        onClose={funciones.cerrarModal}
        onSubmit={funciones.handleModalSubmit}
        cliente={estado.clienteParaModal}
      />
    </>
  );
}
