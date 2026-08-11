import { useState } from "react";
import { Loader2, Trash2Icon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
}: ConfirmDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && !isLoading && onClose()}>
      <AlertDialogContent className="max-w-xs">
        <AlertDialogHeader className="items-center text-center">
          <div
            className={cn(
              "mb-1 flex h-12 w-12 items-center justify-center rounded-full",
              "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive"
            )}
          >
            <Trash2Icon className="h-5 w-5" />
          </div>

          <AlertDialogTitle className="text-center">{title}</AlertDialogTitle>

          <p className="text-sm text-muted-foreground">
            Esta acción no se puede deshacer.
          </p>
        </AlertDialogHeader>

        <AlertDialogFooter className="sm:justify-center gap-2">
          <AlertDialogCancel onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-destructive/10 text-destructive hover:bg-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
