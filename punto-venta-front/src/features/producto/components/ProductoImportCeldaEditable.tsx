import type { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";

interface ProductoImportCeldaEditableProps {
  registro: UseFormRegisterReturn;
  error?: string;
}

export function ProductoImportCeldaEditable({ registro, error }: ProductoImportCeldaEditableProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <Input
        {...registro}
        aria-invalid={Boolean(error)}
        title={error}
        className="h-8 px-2 text-xs md:text-xs"
      />
      {error && <span className="text-[10px] leading-tight text-destructive">{error}</span>}
    </div>
  );
}
