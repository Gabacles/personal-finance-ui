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
import {
  useUpdatePurchaseTransaction,
  useDeletePurchaseTransaction,
} from "../../hooks/use-credit-cards";
import {
  editPurchaseSchema,
  type EditPurchaseFormValues,
} from "../../schemas/credit-cards.schemas";
import { DeleteConfirmation } from "./DeleteConfirmation";
import type { StatementEntry } from "../../types/credit-cards.types";

interface PurchaseEditFormProps {
  entry: StatementEntry;
  cardId: string;
  selectedMonth: string;
  onSuccess: () => void;
}

export function PurchaseEditForm({
  entry,
  cardId,
  selectedMonth,
  onSuccess,
}: PurchaseEditFormProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { data: categories = [] } = useExpenseCategories();
  const updateMutation = useUpdatePurchaseTransaction(cardId, selectedMonth);
  const deleteMutation = useDeletePurchaseTransaction(cardId, selectedMonth);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditPurchaseFormValues>({
    resolver: standardSchemaResolver(editPurchaseSchema),
    defaultValues: {
      description: entry.description,
      amountBRL: entry.amountCents / 100,
      categoryId: entry.category?.id ?? "",
      notes: "",
    },
  });

  function onSubmit(data: EditPurchaseFormValues) {
    updateMutation.mutate(
      {
        id: entry.id,
        data: {
          description: data.description,
          amountCents: Math.round(data.amountBRL * 100),
          notes: data.notes || undefined,
          categoryId: data.categoryId || undefined,
        },
      },
      { onSuccess },
    );
  }

  function handleDelete() {
    deleteMutation.mutate({ id: entry.id }, { onSuccess });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="ep-description">Descrição</Label>
        <Input
          id="ep-description"
          aria-invalid={!!errors.description}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="ep-amount">Valor</Label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            R$
          </span>
          <Input
            id="ep-amount"
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
            <Label htmlFor="ep-category">
              Categoria{" "}
              <span className="text-xs text-muted-foreground">(opcional)</span>
            </Label>
            <Select value={field.value ?? ""} onValueChange={field.onChange}>
              <SelectTrigger id="ep-category" className="w-full data-[size=default]:h-9">
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
        <Label htmlFor="ep-notes">
          Notas{" "}
          <span className="text-xs text-muted-foreground">(opcional)</span>
        </Label>
        <Input id="ep-notes" placeholder="Observações" {...register("notes")} />
      </div>

      {confirmDelete ? (
        <DeleteConfirmation
          label="Excluir esta compra?"
          description="A transação será removida permanentemente do extrato."
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
