"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { useCancelInstallmentPlan } from "../../hooks/use-credit-cards";
import { formatCentsToBRL } from "@/modules/dashboard/utils/formatters";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { CREDIT_CARD_TOASTS } from "../../utils/toasts";
import type { StatementEntry } from "../../types/credit-cards.types";

interface InstallmentCancelPanelProps {
  entry: StatementEntry;
  cardId: string;
  selectedMonth: string;
  onSuccess: () => void;
}

export function InstallmentCancelPanel({
  entry,
  cardId,
  selectedMonth,
  onSuccess,
}: InstallmentCancelPanelProps) {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const cancelMutation = useCancelInstallmentPlan(cardId, selectedMonth);

  function handleCancel() {
    if (!entry.installmentPlanId) return;
    cancelMutation.mutate(
      { id: entry.installmentPlanId },
      {
        onSuccess: () => { toast.success(CREDIT_CARD_TOASTS.installment.cancelled); onSuccess(); },
        onError: () => toast.error(CREDIT_CARD_TOASTS.installment.cancelError),
      },
    );
  }

  return (
    <div className="space-y-4">
      <dl className="rounded-lg bg-muted p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Descrição</dt>
          <dd className="font-medium">{entry.description}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Parcela</dt>
          <dd className="font-medium">
            {entry.installmentNumber}/{entry.totalInstallments}x
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Valor da parcela</dt>
          <dd className="font-medium">{formatCentsToBRL(entry.amountCents)}</dd>
        </div>
        {entry.category && (
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Categoria</dt>
            <dd className="font-medium">{entry.category.name}</dd>
          </div>
        )}
      </dl>

      <p className="text-xs text-muted-foreground">
        Parcelamentos não podem ser editados individualmente. Você pode cancelar
        o plano para remover as parcelas futuras.
      </p>

      {confirmCancel ? (
        <DeleteConfirmation
          label="Cancelar o parcelamento?"
          description="As parcelas futuras serão removidas. As já pagas permanecem no histórico."
          isPending={cancelMutation.isPending}
          onConfirm={handleCancel}
          onCancel={() => setConfirmCancel(false)}
        />
      ) : (
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => setConfirmCancel(true)}
            disabled={cancelMutation.isPending}
          >
            <Trash2 className="mr-1.5 size-4" />
            Cancelar plano
          </Button>
          <SheetClose asChild>
            <Button type="button" variant="outline" className="flex-1">
              Fechar
            </Button>
          </SheetClose>
        </div>
      )}
    </div>
  );
}
