import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SearchableSelect } from "@/components/SearchableSelect"
import type { FiltrosProductosType } from "../types/ProductoType"

interface ProductoFiltersProps {
  filtrosState: {
    filtros: FiltrosProductosType
    setFiltros: (filtros: FiltrosProductosType) => void
    searchTerm: string
    setSearchTerm: (term: string) => void
  }
  listarSelectCategoria: any
}

export function ProductoFilters({ filtrosState, listarSelectCategoria }: ProductoFiltersProps) {
  const { filtros, setFiltros, searchTerm, setSearchTerm } = filtrosState

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
        <div className="w-full sm:w-[240px]">
          <SearchableSelect
            value={filtros.categoria_id || null}
            onChange={(val) =>
              setFiltros({ ...filtros, categoria_id: val ? Number(val) : null })
            }
            queryKey="categorias-select-search-filters"
            fetchFn={listarSelectCategoria}
            placeholder="Todas las Categorías"
            searchPlaceholder="Buscar categoría..."
            allowClear={true}
            clearText="Todas las Categorías"
          />
        </div>

        <div className="w-full sm:w-[160px]">
          <Select
            value={filtros.disponibilidad !== undefined ? filtros.disponibilidad.toString() : "todos"}
            onValueChange={(val) =>
              setFiltros({
                ...filtros,
                disponibilidad:
                  val === "todos" ? undefined : val === "1" ? 1 : 0,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Disponibilidad" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="1">Disponible</SelectItem>
              <SelectItem value="0">No Disponible</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-[160px]">
          <Select
            value={filtros.stock || "todos"}
            onValueChange={(val) =>
              setFiltros({
                ...filtros,
                stock:
                  val === "todos"
                    ? undefined
                    : (val as FiltrosProductosType["stock"]),
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Stock: Todos</SelectItem>
              <SelectItem value="bajo_stock">Stock Bajo</SelectItem>
              <SelectItem value="sin_stock">Stock Normal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="relative w-full sm:w-[300px]">
        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar producto..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  )
}
