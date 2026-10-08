import { useState, useRef, useEffect, useMemo } from "react";
import { Check, ChevronDown, Loader2, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Option {
  id: number;
  nombre: string;
}

interface SearchableSelectProps {
  value: number | null;
  onChange: (value: number | null) => void;
  queryKey: string;
  fetchFn: (search: string) => Promise<Option[]>;
  placeholder?: string;
  searchPlaceholder?: string;
  initialOption?: Option | null;
  allowClear?: boolean;
  clearText?: string;
}

export function SearchableSelect({
  value,
  onChange,
  queryKey,
  fetchFn,
  placeholder = "Seleccionar...",
  searchPlaceholder = "Buscar...",
  initialOption,
  allowClear = false,
  clearText = "Todos",
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: optionsRaw, isLoading } = useQuery({
    queryKey: [queryKey, debouncedSearch],
    queryFn: () => fetchFn(debouncedSearch),
  });

  // Estabilizamos la referencia del array para evitar loops infinitos en el useEffect de caché
  const options = useMemo<Option[]>(
    () => (Array.isArray(optionsRaw) ? optionsRaw : []),
    [optionsRaw]
  );

  // Opciones en caché (recuerda todas las opciones vistas para no perder el nombre si se limpia la búsqueda)
  const [cachedOptions, setCachedOptions] = useState<Option[]>([]);

  useEffect(() => {
    setCachedOptions((prev) => {
      const newMap = new Map(prev.map((opt) => [opt.id, opt]));
      if (initialOption) {
        newMap.set(initialOption.id, initialOption);
      }
      options.forEach((opt) => newMap.set(opt.id, opt));
      return Array.from(newMap.values());
    });
  }, [options, initialOption]);

  const selectedOption = cachedOptions.find((opt) => opt.id === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={selectedOption ? "" : "text-muted-foreground"}>
          {selectedOption ? selectedOption.nombre : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>

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
            ) : options.length === 0 && !allowClear ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No se encontraron resultados.
              </div>
            ) : (
              <>
                {allowClear && (
                  <div
                    onClick={() => {
                      onChange(null);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${!value ? "bg-accent text-accent-foreground" : ""
                      }`}
                  >
                    {!value && (
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                    {clearText}
                  </div>
                )}
                {options.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => {
                      onChange(option.id);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${value === option.id ? "bg-accent text-accent-foreground" : ""
                      }`}
                  >
                    {value === option.id && (
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                    {option.nombre}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
