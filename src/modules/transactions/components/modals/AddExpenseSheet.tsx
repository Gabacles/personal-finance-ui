"use client";

import { useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Loader2 } from "lucide-react";
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
import { DatePickerField } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { addExpenseSchema, type AddExpenseFormValues } from "../../schemas/transactions.schemas";
import {
  useCreateExpense,
  useExpenseCategories,
  useNonCCPaymentMethods,
} from "../../hooks/use-transactions";

interface AddExpenseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMonth: string;
}

function todayString() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

export function AddExpenseSheet({ open, onOpenChange, selectedMonth }: AddExpenseSheetProps) {
  const isMobile = useIsMobile();
  const createExpense = useCreateExpense(selectedMonth);
  const { data: categories } = useExpenseCategories();
  const { data: paymentMethods } = useNonCCPaymentMethods();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddExpenseFormValues>({
    resolver: standardSchemaResolver(addExpenseSchema),
    defaultValues: {
      description: "",
      transactionDate: todayString(),
    },
  });

  const onClose = useCallback(() => {
    reset();
    onOpenChange(false);
  }, [reset, onOpenChange]);

  const onSubmit = useCallback(
    (values: AddExpenseFormValues) => {
      createExpense.mutate(
        {
          data: {
            description: values.description,
            amountCents: Math.round(values.amountBRL * 100),
            transactionDate: values.transactionDate,
            categoryId: values.categoryId || undefined,
            paymentMethodId: values.paymentMethodId || undefined,
            notes: values.notes || undefined,
          },
        },
        {
          onSuccess: () => {
            toast.success("Despesa registrada com sucesso.");
            onClose();
          },
          onError: () => toast.error("Não foi possível registrar a despesa."),
        },
      );
    },
    [createExpense, onClose],
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={cn(
          "overflow-y-auto p-4",
          isMobile && "max-h-[92dvh] rounded-t-2xl",
        )}
      >
        <SheetHeader className="mb-6">
          <SheetTitle>Nova despesa avulsa</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="exp-desc">Descrição</Label>
            <Input
              id="exp-desc"
              placeholder="Ex.: Almoço, Farmácia…"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label htmlFor="exp-amount">Valor</Label>
            <Controller
              name="amountBRL"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  id="exp-amount"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.amountBRL && (
              <p className="text-xs text-destructive">{errors.amountBRL.message}</p>
            )}
          </div>

          {/* Date */}
          <Controller
            name="transactionDate"
            control={control}
            render={({ field }) => (
              <DatePickerField
                id="exp-date"
                label="Data"
                value={field.value}
                onChange={field.onChange}
                error={errors.transactionDate?.message}
              />
            )}
          />

          {/* Payment Method */}
          <div className="space-y-1.5">
            <Label htmlFor="exp-pm">
              Método de pagamento{" "}
              <span className="text-xs text-muted-foreground">(opcional)</span>
            </Label>
            <Controller
              name="paymentMethodId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={(v) => field.onChange(v === "__none__" ? undefined : v)}
                >
                  <SelectTrigger id="exp-pm" className="w-full">
                    <SelectValue placeholder="Selecione…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Sem método</SelectItem>
                    {(paymentMethods ?? []).map((pm) => (
                      <SelectItem key={pm.id} value={pm.id}>
                        {pm.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label htmlFor="exp-cat">
              Categoria{" "}
              <span className="text-xs text-muted-foreground">(opcional)</span>
            </Label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={(v) => field.onChange(v === "__none__" ? undefined : v)}
                >
                  <SelectTrigger id="exp-cat" className="w-full">
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
            <Label htmlFor="exp-notes">
              Observações <span className="text-xs text-muted-foreground">(opcional)</span>
            </Label>
            <Input id="exp-notes" placeholder="Anotações livres…" {...register("notes")} />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <SheetClose asChild>
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancelar
              </Button>
            </SheetClose>
            <Button type="submit" className="flex-1" disabled={isSubmitting || createExpense.isPending}>
              {createExpense.isPending && <Loader2 className="mr-1.5 size-4 animate-spin" />}
              Salvar
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
