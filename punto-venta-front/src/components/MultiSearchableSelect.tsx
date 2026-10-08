import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Loader2, Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Option {
  id: number;
  nombre: string;
}

interface MultiSearchableSelectProps {
  value: number[];
  onChange: (value: number[]) => void;
  queryKey: string;
  fetchFn: (search: string) => Promise<Option[]>;
  placeholder?: string;
  searchPlaceholder?: string;
  initialOptions?: Option[];
}

export function MultiSearchableSelect({
  value = [],
  onChange,
  queryKey,
  fetchFn,
  placeholder = "Seleccionar opciones...",
  searchPlaceholder = "Buscar...",
  initialOptions = [],
}: MultiSearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: options = [], isLoading } = useQuery({
    queryKey: [queryKey, debouncedSearch],
    queryFn: () => fetchFn(debouncedSearch),
  });

  // const selectedOptions = options.filter((opt) => value.includes(opt.id));

  // Opciones que faltan cargar (si estaban seleccionadas pero la búsqueda actual no las incluye)
  const [cachedOptions, setCachedOptions] = useState<Option[]>([]);

  useEffect(() => {
    setCachedOptions((prev) => {
      const newMap = new Map(prev.map((opt) => [opt.id, opt]));
      if (initialOptions && initialOptions.length > 0) {
        initialOptions.forEach((opt) => newMap.set(opt.id, opt));
      }
      options.forEach((opt) => newMap.set(opt.id, opt));
      return Array.from(newMap.values());
    });
  }, [options, initialOptions]);

  const displaySelected = cachedOptions.filter((opt) => value.includes(opt.id));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (id: number) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const removeOption = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== id));
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        onClick={() => setOpen(!open)}
        className="flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-text"
      >
        {displaySelected.length > 0 ? (
          displaySelected.map((opt) => (
            <span
              key={opt.id}
              className="flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
            >
              {opt.nombre}
              <button
                type="button"
                className="rounded-full outline-none hover:bg-secondary-foreground/20 p-0.5"
                onClick={(e) => removeOption(opt.id, e)}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))
        ) : (
          <span className="text-muted-foreground py-0.5">{placeholder}</span>
        )}

        {/* Espacio para hacer click en el resto del contenedor */}
        <div className="flex-1 min-w-[2px]" />

        <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
      </div>

      {open && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto p-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cargando...
              </div>
            ) : options.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No se encontraron resultados.
              </div>
            ) : (
              options.map((option) => {
                const isSelected = value.includes(option.id);
                return (
                  <div
                    key={option.id}
                    onClick={() => toggleOption(option.id)}
                    className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${isSelected ? "bg-accent text-accent-foreground font-medium" : ""
                      }`}
                  >
                    {isSelected && (
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                    {option.nombre}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
