"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Loader2 } from "lucide-react";
import { DatePickerField } from "@/components/ui/date-picker";
import { MonthPickerField } from "@/components/ui/month-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { usePurchasesControllerCreate } from "@/generated/api/purchases/purchases";
import { useInstallmentsControllerCreate } from "@/generated/api/installment-plans/installment-plans";
import { useRecurringControllerCreate } from "@/generated/api/recurring-transactions/recurring-transactions";
import { getPaymentMethodsControllerGetStatementQueryKey } from "@/generated/api/payment-methods/payment-methods";
import { useCategoriesControllerFindAll } from "@/generated/api/categories/categories";
import {
  addPurchaseSchema,
  addInstallmentSchema,
  addRecurringSchema,
  type AddPurchaseFormValues,
  type AddInstallmentFormValues,
  type AddRecurringFormValues,
} from "../../schemas/credit-cards.schemas";

type Category = { id: string; name: string };
interface CategoryListResponse { data: Category[] }

function useExpenseCategories() {
  return useCategoriesControllerFindAll<Category[]>(
    { type: "EXPENSE" },
    { query: { select: (raw) => (raw as unknown as CategoryListResponse).data } },
  );
}

type TabKey = "purchase" | "installment" | "recurring";

const TABS: { key: TabKey; label: string }[] = [
  { key: "purchase", label: "À Vista" },
  { key: "installment", label: "Parcelada" },
  { key: "recurring", label: "Assinatura" },
];

interface AddTransactionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cardId: string;
  selectedMonth: string;
  defaultTab?: TabKey;
}

// ─── Purchase form ────────────────────────────────────────────
function PurchaseForm({
  cardId,
  selectedMonth,
  onSuccess,
}: {
  cardId: string;
  selectedMonth: string;
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();
  const { data: categories = [] } = useExpenseCategories();
  const mutation = usePurchasesControllerCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getPaymentMethodsControllerGetStatementQueryKey(cardId, {
            month: selectedMonth,
          }),
        });
        onSuccess();
      },
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddPurchaseFormValues>({
    resolver: standardSchemaResolver(addPurchaseSchema),
  });

  function onSubmit(data: AddPurchaseFormValues) {
    mutation.mutate({
      data: {
        paymentMethodId: cardId,
        description: data.description,
        amountCents: Math.round(data.amountBRL * 100),
        purchaseDate: data.purchaseDate,
        notes: data.notes || undefined,
        categoryId: data.categoryId || undefined,
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="p-description">Descrição</Label>
        <Input
          id="p-description"
          placeholder="Ex: Compra no supermercado"
          aria-invalid={!!errors.description}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="p-amount">Valor</Label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            R$
          </span>
          <Input
            id="p-amount"
            type="number"
            step="0.01"
            min="0.01"
            className="pl-8"
            placeholder="0,00"
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
        name="purchaseDate"
        render={({ field }) => (
          <DatePickerField
            id="p-date"
            label="Data da compra"
            value={field.value ?? ""}
            onChange={field.onChange}
            error={errors.purchaseDate?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="categoryId"
        render={({ field }) => (
          <div className="space-y-1.5">
            <Label htmlFor="p-category">
              Categoria{" "}
              <span className="text-xs text-muted-foreground">(opcional)</span>
            </Label>
            <Select value={field.value ?? ""} onValueChange={field.onChange}>
              <SelectTrigger id="p-category" className="w-full data-[size=default]:h-9">
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
        <Label htmlFor="p-notes">
          Notas{" "}
          <span className="text-xs text-muted-foreground">(opcional)</span>
        </Label>
        <Input
          id="p-notes"
          placeholder="Observações"
          {...register("notes")}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <SheetClose asChild>
          <Button type="button" variant="outline" className="flex-1">
            Cancelar
          </Button>
        </SheetClose>
        <Button type="submit" className="flex-1" disabled={mutation.isPending}>
          {mutation.isPending && (
            <Loader2 className="mr-2 size-4 animate-spin" />
          )}
          Registrar
        </Button>
      </div>
    </form>
  );
}

// ─── Installment form ─────────────────────────────────────────
function InstallmentForm({
  cardId,
  selectedMonth,
  onSuccess,
}: {
  cardId: string;
  selectedMonth: string;
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();
  const { data: categories = [] } = useExpenseCategories();
  const mutation = useInstallmentsControllerCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getPaymentMethodsControllerGetStatementQueryKey(cardId, {
            month: selectedMonth,
          }),
        });
        onSuccess();
      },
    },
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AddInstallmentFormValues>({
    resolver: standardSchemaResolver(addInstallmentSchema),
  });

  const totalAmountBRL = watch("totalAmountBRL");
  const installmentCount = watch("installmentCount");
  const installmentValueBRL =
    totalAmountBRL > 0 && installmentCount >= 2
      ? totalAmountBRL / installmentCount
      : null;

  function onSubmit(data: AddInstallmentFormValues) {
    mutation.mutate({
      data: {
        paymentMethodId: cardId,
        description: data.description,
        totalAmountCents: Math.round(data.totalAmountBRL * 100),
        installmentCount: data.installmentCount,
        purchaseDate: data.purchaseDate,
        notes: data.notes || undefined,
        categoryId: data.categoryId || undefined,
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="i-description">Descrição</Label>
        <Input
          id="i-description"
          placeholder="Ex: iPhone 16 Pro"
          aria-invalid={!!errors.description}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="i-total">Valor total</Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              R$
            </span>
            <Input
              id="i-total"
              type="number"
              step="0.01"
              min="0.01"
              className="pl-8"
              placeholder="0,00"
              aria-invalid={!!errors.totalAmountBRL}
              {...register("totalAmountBRL", { valueAsNumber: true })}
            />
          </div>
          {errors.totalAmountBRL && (
            <p className="text-xs text-destructive">
              {errors.totalAmountBRL.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="i-count">Parcelas</Label>
          <Input
            id="i-count"
            type="number"
            min="2"
            max="48"
            step="1"
            placeholder="Ex: 12"
            aria-invalid={!!errors.installmentCount}
            {...register("installmentCount", { valueAsNumber: true })}
          />
          {errors.installmentCount && (
            <p className="text-xs text-destructive">
              {errors.installmentCount.message}
            </p>
          )}
        </div>
      </div>

      {installmentValueBRL !== null && (
        <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
          Cada parcela:{" "}
          <span className="font-semibold text-foreground">
            R${" "}
            {installmentValueBRL.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </p>
      )}

      <Controller
        control={control}
        name="purchaseDate"
        render={({ field }) => (
          <DatePickerField
            id="i-date"
            label="Data da compra"
            value={field.value ?? ""}
            onChange={field.onChange}
            error={errors.purchaseDate?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="categoryId"
        render={({ field }) => (
          <div className="space-y-1.5">
            <Label htmlFor="i-category">
              Categoria{" "}
              <span className="text-xs text-muted-foreground">(opcional)</span>
            </Label>
            <Select value={field.value ?? ""} onValueChange={field.onChange}>
              <SelectTrigger id="i-category" className="w-full data-[size=default]:h-9">
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
        <Label htmlFor="i-notes">
          Notas{" "}
          <span className="text-xs text-muted-foreground">(opcional)</span>
        </Label>
        <Input id="i-notes" placeholder="Observações" {...register("notes")} />
      </div>

      <div className="flex gap-3 pt-2">
        <SheetClose asChild>
          <Button type="button" variant="outline" className="flex-1">
            Cancelar
          </Button>
        </SheetClose>
        <Button type="submit" className="flex-1" disabled={mutation.isPending}>
          {mutation.isPending && (
            <Loader2 className="mr-2 size-4 animate-spin" />
          )}
          Registrar
        </Button>
      </div>
    </form>
  );
}

// ─── Recurring / subscription form ────────────────────────────
function RecurringForm({
  cardId,
  selectedMonth,
  onSuccess,
}: {
  cardId: string;
  selectedMonth: string;
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();
  const { data: allCategories = [] } = useExpenseCategories();
  const mutation = useRecurringControllerCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getPaymentMethodsControllerGetStatementQueryKey(cardId, {
            month: selectedMonth,
          }),
        });
        onSuccess();
      },
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddRecurringFormValues>({
    resolver: standardSchemaResolver(addRecurringSchema),
    defaultValues: { startMonth: selectedMonth },
  });

  function onSubmit(data: AddRecurringFormValues) {
    const subscriptionCategory = allCategories.find(
      (c) => c.name.toLowerCase() === "assinaturas",
    );
    mutation.mutate({
      data: {
        description: data.description,
        amountCents: Math.round(data.amountBRL * 100),
        type: "EXPENSE",
        startMonth: data.startMonth,
        endMonth: data.endMonth || undefined,
        dayOfMonth: data.dayOfMonth ? parseInt(data.dayOfMonth) : undefined,
        paymentMethodId: cardId,
        notes: data.notes || undefined,
        categoryId: subscriptionCategory?.id || undefined,
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="r-description">Descrição</Label>
        <Input
          id="r-description"
          placeholder="Ex: Netflix"
          aria-invalid={!!errors.description}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="r-amount">Valor mensal</Label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            R$
          </span>
          <Input
            id="r-amount"
            type="number"
            step="0.01"
            min="0.01"
            className="pl-8"
            placeholder="0,00"
            aria-invalid={!!errors.amountBRL}
            {...register("amountBRL", { valueAsNumber: true })}
          />
        </div>
        {errors.amountBRL && (
          <p className="text-xs text-destructive">{errors.amountBRL.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Controller
          control={control}
          name="startMonth"
          render={({ field }) => (
            <MonthPickerField
              id="r-start"
              label="Mês de início"
              value={field.value}
              onChange={field.onChange}
              error={errors.startMonth?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="endMonth"
          render={({ field }) => (
            <MonthPickerField
              id="r-end"
              label="Mês de término"
              optional
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="r-day">
          Dia da cobrança{" "}
          <span className="text-xs text-muted-foreground">(opcional)</span>
        </Label>
        <Input
          id="r-day"
          type="number"
          min="1"
          max="31"
          step="1"
          placeholder="Ex: 15"
          {...register("dayOfMonth")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="r-notes">
          Notas{" "}
          <span className="text-xs text-muted-foreground">(opcional)</span>
        </Label>
        <Input id="r-notes" placeholder="Observações" {...register("notes")} />
      </div>

      <div className="flex gap-3 pt-2">
        <SheetClose asChild>
          <Button type="button" variant="outline" className="flex-1">
            Cancelar
          </Button>
        </SheetClose>
        <Button type="submit" className="flex-1" disabled={mutation.isPending}>
          {mutation.isPending && (
            <Loader2 className="mr-2 size-4 animate-spin" />
          )}
          Registrar
        </Button>
      </div>
    </form>
  );
}

// ─── Main sheet ───────────────────────────────────────────────
export function AddTransactionSheet({
  open,
  onOpenChange,
  cardId,
  selectedMonth,
  defaultTab = "purchase",
}: AddTransactionSheetProps) {
  const [activeTab, setActiveTab] = useState<TabKey>(defaultTab);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Nova transação</SheetTitle>
        </SheetHeader>

        {/* Tab bar */}
        <div role="tablist" aria-label="Tipo de transação" className="mt-4 flex rounded-lg bg-muted p-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex-1 cursor-pointer rounded-md py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                activeTab === tab.key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div role="tabpanel" className="mt-6 px-1">
          {activeTab === "purchase" && (
            <PurchaseForm
              key="purchase"
              cardId={cardId}
              selectedMonth={selectedMonth}
              onSuccess={() => onOpenChange(false)}
            />
          )}
          {activeTab === "installment" && (
            <InstallmentForm
              key="installment"
              cardId={cardId}
              selectedMonth={selectedMonth}
              onSuccess={() => onOpenChange(false)}
            />
          )}
          {activeTab === "recurring" && (
            <RecurringForm
              key="recurring"
              cardId={cardId}
              selectedMonth={selectedMonth}
              onSuccess={() => onOpenChange(false)}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
