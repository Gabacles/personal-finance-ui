"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SheetClose } from "@/components/ui/sheet";
import { useExpenseCategories } from "../../hooks/use-categories";
import { toast } from "sonner";
import {
  useUpdateRecurringTransaction,
  useDeleteRecurringTransaction,
} from "../../hooks/use-credit-cards";
import {
  editRecurringSchema,
  type EditRecurringFormValues,
} from "../../schemas/credit-cards.schemas";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { CREDIT_CARD_TOASTS } from "../../utils/toasts";
import type { StatementEntry } from "../../types/credit-cards.types";

interface RecurringEditFormProps {
  entry: StatementEntry;
  cardId: string;
  selectedMonth: string;
  onSuccess: () => void;
}

export function RecurringEditForm({
  entry,
  cardId,
  selectedMonth,
  onSuccess,
}: RecurringEditFormProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { data: categories = [] } = useExpenseCategories();
  const updateMutation = useUpdateRecurringTransaction(cardId, selectedMonth);
  const deleteMutation = useDeleteRecurringTransaction(cardId, selectedMonth);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditRecurringFormValues>({
    resolver: standardSchemaResolver(editRecurringSchema),
    defaultValues: {
      description: entry.description,
      amountBRL: entry.amountCents / 100,
      categoryId: entry.category?.id ?? "",
      notes: "",
    },
  });

  function onSubmit(data: EditRecurringFormValues) {
    if (!entry.recurringId) return;
    updateMutation.mutate(
      {
        id: entry.recurringId,
        data: {
          description: data.description,
          amountCents: Math.round(data.amountBRL * 100),
          notes: data.notes || undefined,
          categoryId: data.categoryId || undefined,
        },
      },
      {
        onSuccess: () => { toast.success(CREDIT_CARD_TOASTS.recurring.updated); onSuccess(); },
        onError: () => toast.error(CREDIT_CARD_TOASTS.recurring.updateError),
      },
    );
  }

  function handleDelete() {
    if (!entry.recurringId) return;
    deleteMutation.mutate(
      { id: entry.recurringId },
      {
        onSuccess: () => { toast.success(CREDIT_CARD_TOASTS.recurring.deleted); onSuccess(); },
        onError: () => toast.error(CREDIT_CARD_TOASTS.recurring.deleteError),
      },
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-3 py-2">
        <p className="text-xs text-amber-700 dark:text-amber-400">
          Alterações afetam todas as ocorrências futuras desta assinatura.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="er-description">Descrição</Label>
        <Input
          id="er-description"
          aria-invalid={!!errors.description}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="er-amount">Valor mensal</Label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            R$
          </span>
          <Input
            id="er-amount"
            type="number"
            step="0.01"
            min="0.01"
            className="pl-8"
            aria-invalid={!!errors.amountBRL}
            {...register("amountBRL", { valueAsNumber: true })}
          />
        </div>
        {errors.amountBRL && (
          <p className="text-xs text-destructive">{errors.amountBRL.message}</p>
        )}
      </div>

      <Controller
        control={control}
        name="categoryId"
        render={({ field }) => (
          <div className="space-y-1.5">
            <Label htmlFor="er-category">
              Categoria{" "}
              <span className="text-xs text-muted-foreground">(opcional)</span>
            </Label>
            <Select value={field.value ?? ""} onValueChange={field.onChange}>
              <SelectTrigger id="er-category" className="w-full data-[size=default]:h-9">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      />

      <div className="space-y-1.5">
        <Label htmlFor="er-notes">
          Notas{" "}
          <span className="text-xs text-muted-foreground">(opcional)</span>
        </Label>
        <Input id="er-notes" placeholder="Observações" {...register("notes")} />
      </div>

      {confirmDelete ? (
        <DeleteConfirmation
          label="Excluir esta assinatura?"
          description="O template recorrente será removido e não gerará mais cobranças futuras."
          isPending={deleteMutation.isPending}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      ) : (
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => setConfirmDelete(true)}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="mr-1.5 size-4" />
            Excluir
          </Button>
          <SheetClose asChild>
            <Button type="button" variant="outline" className="flex-1">
              Cancelar
            </Button>
          </SheetClose>
          <Button
            type="submit"
            className="flex-1"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            Salvar
          </Button>
        </div>
      )}
    </form>
  );
}
