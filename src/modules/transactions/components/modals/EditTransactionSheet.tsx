"use client";

import { useCallback, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { AlertTriangle, Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/ui/currency-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { formatCentsToBRL, formatShortDate } from "@/modules/dashboard/utils/formatters";
import { editTransactionSchema, type EditTransactionFormValues } from "../../schemas/transactions.schemas";
import { useDeleteTransaction, useExpenseCategories, useUpdateTransaction } from "../../hooks/use-transactions";
import type { Transaction } from "../../types/transactions.types";
import { ORIGIN_LABELS } from "../../types/transactions.types";

interface EditTransactionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  selectedMonth: string;
}

export function EditTransactionSheet({
  open,
  onOpenChange,
  transaction,
  selectedMonth,
}: EditTransactionSheetProps) {
  const isMobile = useIsMobile();
  const isEditable = transaction?.origin === "ONE_TIME" && transaction?.type === "EXPENSE";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={cn(
          "overflow-y-auto",
          isMobile && "max-h-[92dvh] rounded-t-2xl",
        )}
      >
        <SheetHeader className="mb-6">
          <SheetTitle>
            {isEditable ? "Editar despesa" : "Detalhes da transação"}
          </SheetTitle>
        </SheetHeader>

        {transaction && isEditable ? (
          <EditForm
            transaction={transaction}
            selectedMonth={selectedMonth}
            onClose={() => onOpenChange(false)}
          />
        ) : transaction ? (
          <ReadOnlyPanel transaction={transaction} onClose={() => onOpenChange(false)} />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

// ─── Editable form (ONE_TIME EXPENSE) ────────────────────────────────────────

interface EditFormProps {
  transaction: Transaction;
  selectedMonth: string;
  onClose: () => void;
}

function EditForm({ transaction, selectedMonth, onClose }: EditFormProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const updateTransaction = useUpdateTransaction(selectedMonth);
  const deleteTransaction = useDeleteTransaction(selectedMonth);
  const { data: categories } = useExpenseCategories();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditTransactionFormValues>({
    resolver: standardSchemaResolver(editTransactionSchema),
    defaultValues: {
      description: transaction.description,
      amountBRL: transaction.amountCents / 100,
      categoryId: transaction.category?.id ?? undefined,
      notes: transaction.notes ?? undefined,
    },
  });

  const onSubmit = useCallback(
    (values: EditTransactionFormValues) => {
      updateTransaction.mutate(
        {
          id: transaction.id,
          data: {
            description: values.description,
            amountCents: Math.round(values.amountBRL * 100),
            categoryId: values.categoryId || undefined,
            notes: values.notes || undefined,
          },
        },
        {
          onSuccess: () => {
            toast.success("Despesa atualizada.");
            onClose();
          },
          onError: () => toast.error("Não foi possível atualizar a despesa."),
        },
      );
    },
    [updateTransaction, transaction.id, onClose],
  );

  const handleDelete = useCallback(() => {
    deleteTransaction.mutate(
      { id: transaction.id },
      {
        onSuccess: () => {
          toast.success("Despesa removida.");
          onClose();
        },
        onError: () => toast.error("Não foi possível remover a despesa."),
      },
    );
  }, [deleteTransaction, transaction.id, onClose]);

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="edit-desc">Descrição</Label>
          <Input id="edit-desc" {...register("description")} />
          {errors.description && (
            <p className="text-xs text-destructive">{errors.description.message}</p>
          )}
        </div>

        {/* Amount */}
        <div className="space-y-1.5">
          <Label htmlFor="edit-amount">Valor</Label>
          <Controller
            name="amountBRL"
            control={control}
            render={({ field }) => (
              <CurrencyInput id="edit-amount" value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.amountBRL && (
            <p className="text-xs text-destructive">{errors.amountBRL.message}</p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <Label htmlFor="edit-cat">
            Categoria <span className="text-xs text-muted-foreground">(opcional)</span>
          </Label>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value ?? ""}
                onValueChange={(v) => field.onChange(v === "__none__" ? undefined : v)}
              >
                <SelectTrigger id="edit-cat" className="w-full">
                  <SelectValue placeholder="Selecione…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Sem categoria</SelectItem>
                  {(categories ?? []).map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <Label htmlFor="edit-notes">
            Observações <span className="text-xs text-muted-foreground">(opcional)</span>
          </Label>
          <Input id="edit-notes" {...register("notes")} />
        </div>

        {/* Submit / Cancel */}
        <div className="flex gap-2 pt-1">
          <SheetClose asChild>
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
          </SheetClose>
          <Button
            type="submit"
            className="flex-1"
            disabled={updateTransaction.isPending}
          >
            {updateTransaction.isPending && (
              <Loader2 className="mr-1.5 size-4 animate-spin" />
            )}
            Salvar
          </Button>
        </div>
      </form>

      {/* Delete section */}
      {!confirmDelete ? (
        <div className="border-t border-border/60 pt-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setConfirmDelete(true)}
          >
            Excluir despesa
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 space-y-3">
          <div className="flex items-start gap-2 text-destructive">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <p className="text-sm font-medium">Confirmar exclusão?</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Esta ação não pode ser desfeita.
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => setConfirmDelete(false)}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="flex-1"
              onClick={handleDelete}
              disabled={deleteTransaction.isPending}
            >
              {deleteTransaction.isPending && (
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
              )}
              Excluir
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Read-only panel (non-editable origins) ───────────────────────────────────

interface ReadOnlyPanelProps {
  transaction: Transaction;
  onClose: () => void;
}

function ReadOnlyPanel({ transaction, onClose }: ReadOnlyPanelProps) {
  const originLabel = ORIGIN_LABELS[transaction.origin];

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-3">
        <div className="flex items-start gap-2 text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0" />
          <p className="text-sm">
            Transações do tipo <strong>{originLabel}</strong> são gerenciadas em seu fluxo
            de origem e não podem ser editadas diretamente aqui.
          </p>
        </div>
      </div>

      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Descrição</dt>
          <dd className="font-medium text-right">{transaction.description}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Valor</dt>
          <dd className="font-semibold text-right">
            {formatCentsToBRL(transaction.amountCents)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Data</dt>
          <dd className="font-medium text-right">
            {formatShortDate(transaction.transactionDate)}
          </dd>
        </div>
        {transaction.category && (
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Categoria</dt>
            <dd className="font-medium text-right">{transaction.category.name}</dd>
          </div>
        )}
        {transaction.paymentMethod && (
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Método</dt>
            <dd className="font-medium text-right">{transaction.paymentMethod.name}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Tipo</dt>
          <dd className="font-medium text-right">{originLabel}</dd>
        </div>
        {transaction.notes && (
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground">Observações</dt>
            <dd className="rounded-lg bg-muted/40 p-3 text-sm">{transaction.notes}</dd>
          </div>
        )}
      </dl>

      <SheetClose asChild>
        <Button variant="outline" className="w-full" onClick={onClose}>
          Fechar
        </Button>
      </SheetClose>
    </div>
  );
}
