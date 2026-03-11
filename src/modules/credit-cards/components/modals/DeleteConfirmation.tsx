import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationProps {
  label: string;
  description: string;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmation({
  label,
  description,
  isPending,
  onConfirm,
  onCancel,
}: DeleteConfirmationProps) {
  return (
    <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 space-y-3">
      <div className="flex gap-2 items-start">
        <AlertTriangle className="size-4 text-destructive mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-destructive">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="flex-1"
          onClick={onConfirm}
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
          Confirmar
        </Button>
      </div>
    </div>
  );
}
