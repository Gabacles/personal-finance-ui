"use client";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PurchaseEditForm } from "./PurchaseEditForm";
import { InstallmentCancelPanel } from "./InstallmentCancelPanel";
import { RecurringEditForm } from "./RecurringEditForm";
import type { StatementEntry } from "../../types/credit-cards.types";

const SHEET_TITLE: Record<string, string> = {
  ONE_TIME: "Editar compra",
  INSTALLMENT: "Detalhes do parcelamento",
  RECURRING: "Editar assinatura",
};

interface EditTransactionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: StatementEntry | null;
  cardId: string;
  selectedMonth: string;
}

export function EditTransactionSheet({
  open,
  onOpenChange,
  entry,
  cardId,
  selectedMonth,
}: EditTransactionSheetProps) {
  const isMobile = useIsMobile();

  function handleSuccess() {
    onOpenChange(false);
  }

  const sharedProps = { cardId, selectedMonth, onSuccess: handleSuccess };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={cn("overflow-y-auto p-4", isMobile && "max-h-[90dvh]")}
      >
        <SheetHeader className="mb-6">
          <SheetTitle>
            {entry ? SHEET_TITLE[entry.type] : "Editar transação"}
          </SheetTitle>
        </SheetHeader>

        {entry?.type === "ONE_TIME" && (
          <PurchaseEditForm key={entry.id} entry={entry} {...sharedProps} />
        )}
        {entry?.type === "INSTALLMENT" && (
          <InstallmentCancelPanel key={entry.id} entry={entry} {...sharedProps} />
        )}
        {entry?.type === "RECURRING" && (
          <RecurringEditForm key={entry.id} entry={entry} {...sharedProps} />
        )}
      </SheetContent>
    </Sheet>
  );
}
