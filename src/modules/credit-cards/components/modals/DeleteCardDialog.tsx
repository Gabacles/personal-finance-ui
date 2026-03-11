"use client";

import { Dialog as DialogPrimitive } from "radix-ui";
import { AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useDeleteCreditCard } from "../../hooks/use-credit-cards";
import { toast } from "sonner";
import { CREDIT_CARD_TOASTS } from "../../utils/toasts";
import type { CreditCard } from "../../types/credit-cards.types";

interface DeleteCardDialogProps {
  card: CreditCard | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}

export function DeleteCardDialog({
  card,
  open,
  onOpenChange,
  onDeleted,
}: DeleteCardDialogProps) {
  const deleteCard = useDeleteCreditCard();

  async function handleDelete() {
    if (!card) return;
    try {
      await deleteCard.mutateAsync({ id: card.id });
      toast.success(CREDIT_CARD_TOASTS.card.deleted);
      onDeleted();
      onOpenChange(false);
    } catch {
      toast.error(CREDIT_CARD_TOASTS.card.deleteError);
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/40",
            "data-open:animate-in data-open:fade-in-0",
            "data-closed:animate-out data-closed:fade-out-0",
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-background p-6 shadow-xl",
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
            "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          )}
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="size-7 text-destructive" />
            </div>

            <div>
              <DialogPrimitive.Title className="text-lg font-semibold">
                Remover cartão
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="mt-1 text-sm text-muted-foreground">
                Tem certeza que deseja remover{" "}
                <span className="font-medium text-foreground">
                  {card?.name ?? "este cartão"}
                </span>
                ? Esta ação não pode ser desfeita.
                <br />
                <span className="text-xs">
                  Cartões com parcelamentos futuros não podem ser removidos.
                </span>
              </DialogPrimitive.Description>
            </div>

            <div className="flex w-full gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                disabled={deleteCard.isPending}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleDelete}
                disabled={deleteCard.isPending}
              >
                {deleteCard.isPending && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Remover
              </Button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
