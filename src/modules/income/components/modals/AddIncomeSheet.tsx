"use client";

import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  useCreateIncomeEntry,
  useCreateRecurringIncome,
  useIncomeCategories,
} from "../../hooks/use-income";
import {
  addIncomeEntrySchema,
  addRecurringIncomeSchema,
  type AddIncomeEntryFormValues,
  type AddRecurringIncomeFormValues,
} from "../../schemas/income.schemas";

type TabKey = "manual" | "recurring";

const TABS: { key: TabKey; label: string }[] = [
  { key: "manual", label: "Receita do mês" },
  { key: "recurring", label: "Recorrente" },
];

interface AddIncomeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMonth: string;
}

function ManualIncomeForm({
  selectedMonth,
  onSuccess,
}: {
  selectedMonth: string;
  onSuccess: () => void;
}) {
  const { data: categories = [] } = useIncomeCategories();
  const mutation = useCreateIncomeEntry(selectedMonth);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AddIncomeEntryFormValues>({
    resolver: standardSchemaResolver(addIncomeEntrySchema),
    defaultValues: {
      referenceMonth: selectedMonth,
      applyTaxDeductions: true,
      dependents: 0,
      customDeductions: [],
    },
  });

  const deductionFields = useFieldArray({
    control,
    name: "customDeductions",
  });

  const applyTaxDeductions = watch("applyTaxDeductions");

  function onSubmit(values: AddIncomeEntryFormValues) {
    mutation.mutate(
      {
        data: {
          referenceMonth: values.referenceMonth,
          grossCents: Math.round(values.grossAmountBRL * 100),
          description: values.description,
          categoryId: values.categoryId || undefined,
          applyTaxDeductions: values.applyTaxDeductions,
          dependents: values.applyTaxDeductions ? values.dependents ?? 0 : 0,
          notes: values.notes || undefined,
          customDeductions: values.customDeductions?.length
            ? values.customDeductions.map((deduction) => ({
              description: deduction.description,
              amountCents: Math.round(deduction.amountBRL * 100),
            }))
            : undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Receita registrada com sucesso.");
          onSuccess();
        },
        onError: () => {
          toast.error("Não foi possível registrar a receita.");
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Controller
        control={control}
        name="referenceMonth"
        render={({ field }) => (
          <MonthPickerField
            id="income-reference-month"
            label="Mês de referência"
            value={field.value}
            onChange={field.onChange}
            error={errors.referenceMonth?.message}
          />
        )}
      />

      <div className="space-y-1.5">
        <Label htmlFor="income-description">Descrição</Label>
        <Input
          id="income-description"
          placeholder="Ex: Salário CLT"
          aria-invalid={!!errors.description}
          {...register("description")}
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="income-gross">Valor bruto</Label>
        <Controller
          control={control}
          name="grossAmountBRL"
          render={({ field }) => (
            <CurrencyInput
              id="income-gross"
              value={field.value}
              onChange={field.onChange}
              aria-invalid={!!errors.grossAmountBRL}
            />
          )}
        />
        {errors.grossAmountBRL && <p className="text-xs text-destructive">{errors.grossAmountBRL.message}</p>}
      </div>

      <Controller
        control={control}
        name="categoryId"
        render={({ field }) => (
          <div className="space-y-1.5">
            <Label htmlFor="income-category">
              Categoria <span className="text-xs text-muted-foreground">(opcional)</span>
            </Label>
            <Select value={field.value ?? ""} onValueChange={field.onChange}>
              <SelectTrigger id="income-category" className="w-full data-[size=default]:h-9">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      />

      <div className="space-y-1.5">
        <Label className="inline-flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            className="size-4 rounded border-input"
            {...register("applyTaxDeductions")}
          />
          Aplicar descontos automáticos (INSS/IRRF)
        </Label>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="income-dependents">
          Dependentes <span className="text-xs text-muted-foreground">(IRRF)</span>
        </Label>
        <Input
          id="income-dependents"
          type="number"
          min="0"
          max="20"
          step="1"
          disabled={!applyTaxDeductions}
          aria-invalid={!!errors.dependents}
          {...register("dependents", { valueAsNumber: true })}
        />
        {errors.dependents && <p className="text-xs text-destructive">{errors.dependents.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="income-notes">
          Notas <span className="text-xs text-muted-foreground">(opcional)</span>
        </Label>
        <Input id="income-notes" placeholder="Observações" {...register("notes")} />
      </div>

      <div className="space-y-3 rounded-lg border border-border/70 bg-background/60 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Deduções personalizadas</p>
            <p className="text-xs text-muted-foreground">
              Ex: plano de saúde, previdência privada, sindicato.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => deductionFields.append({ description: "", amountBRL: 0 })}
          >
            <Plus className="mr-1 size-4" />
            Adicionar
          </Button>
        </div>

        {deductionFields.fields.length === 0 ? (
          <p className="text-xs text-muted-foreground">Nenhuma dedução personalizada adicionada.</p>
        ) : (
          <div className="space-y-3">
            {deductionFields.fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 gap-3 rounded-md border border-border/70 p-3">
                <div className="space-y-1.5">
                  <Label htmlFor={`income-deduction-description-${index}`}>Descrição</Label>
                  <Input
                    id={`income-deduction-description-${index}`}
                    placeholder="Ex: Plano de saúde"
                    aria-invalid={!!errors.customDeductions?.[index]?.description}
                    {...register(`customDeductions.${index}.description`)}
                  />
                  {errors.customDeductions?.[index]?.description && (
                    <p className="text-xs text-destructive">
                      {errors.customDeductions[index]?.description?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={`income-deduction-amount-${index}`}>Valor</Label>
                  <Controller
                    control={control}
                    name={`customDeductions.${index}.amountBRL`}
                    render={({ field: deductionAmountField }) => (
                      <CurrencyInput
                        id={`income-deduction-amount-${index}`}
                        value={deductionAmountField.value}
                        onChange={deductionAmountField.onChange}
                        aria-invalid={!!errors.customDeductions?.[index]?.amountBRL}
                      />
                    )}
                  />
                  {errors.customDeductions?.[index]?.amountBRL && (
                    <p className="text-xs text-destructive">
                      {errors.customDeductions[index]?.amountBRL?.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => deductionFields.remove(index)}
                  >
                    <Trash2 className="mr-1 size-4" />
                    Remover dedução
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <SheetClose asChild>
          <Button type="button" variant="outline" className="flex-1">
            Cancelar
          </Button>
        </SheetClose>
        <Button type="submit" className="flex-1" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          Registrar
        </Button>
      </div>
    </form>
  );
}

function RecurringIncomeForm({
  selectedMonth,
  onSuccess,
}: {
  selectedMonth: string;
  onSuccess: () => void;
}) {
  const { data: categories = [] } = useIncomeCategories();
  const mutation = useCreateRecurringIncome(selectedMonth);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AddRecurringIncomeFormValues>({
    resolver: standardSchemaResolver(addRecurringIncomeSchema),
    defaultValues: {
      startMonth: selectedMonth,
      applyTaxDeductions: false,
      dependents: 0,
    },
  });

  const applyTaxDeductions = watch("applyTaxDeductions");

  function onSubmit(values: AddRecurringIncomeFormValues) {
    mutation.mutate(
      {
        data: {
          type: "INCOME",
          description: values.description,
          amountCents: Math.round(values.amountBRL * 100),
          startMonth: values.startMonth,
          endMonth: values.endMonth || undefined,
          dayOfMonth: values.dayOfMonth,
          categoryId: values.categoryId || undefined,
          applyTaxDeductions: values.applyTaxDeductions,
          dependents: values.applyTaxDeductions ? values.dependents ?? 0 : 0,
          notes: values.notes || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Receita recorrente criada com sucesso.");
          onSuccess();
        },
        onError: () => {
          toast.error("Não foi possível criar a receita recorrente.");
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="rec-description">Descrição</Label>
        <Input
          id="rec-description"
          placeholder="Ex: Aluguel recebido"
          aria-invalid={!!errors.description}
          {...register("description")}
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="rec-amount">Valor</Label>
        <Controller
          control={control}
          name="amountBRL"
          render={({ field }) => (
            <CurrencyInput
              id="rec-amount"
              value={field.value}
              onChange={field.onChange}
              aria-invalid={!!errors.amountBRL}
            />
          )}
        />
        {errors.amountBRL && <p className="text-xs text-destructive">{errors.amountBRL.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          control={control}
          name="startMonth"
          render={({ field }) => (
            <MonthPickerField
              id="rec-start"
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
              id="rec-end"
              label="Mês de término"
              optional
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="rec-day">
          Dia do recebimento <span className="text-xs text-muted-foreground">(opcional)</span>
        </Label>
        <Input
          id="rec-day"
          type="number"
          min="1"
          max="31"
          step="1"
          aria-invalid={!!errors.dayOfMonth}
          {...register("dayOfMonth", { valueAsNumber: true })}
        />
        {errors.dayOfMonth && <p className="text-xs text-destructive">{errors.dayOfMonth.message}</p>}
      </div>

      <Controller
        control={control}
        name="categoryId"
        render={({ field }) => (
          <div className="space-y-1.5">
            <Label htmlFor="rec-category">
              Categoria <span className="text-xs text-muted-foreground">(opcional)</span>
            </Label>
            <Select value={field.value ?? ""} onValueChange={field.onChange}>
              <SelectTrigger id="rec-category" className="w-full data-[size=default]:h-9">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      />

      <div className="space-y-1.5">
        <Label className="inline-flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            className="size-4 rounded border-input"
            {...register("applyTaxDeductions")}
          />
          Aplicar descontos automáticos (INSS/IRRF)
        </Label>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="rec-dependents">
          Dependentes <span className="text-xs text-muted-foreground">(IRRF)</span>
        </Label>
        <Input
          id="rec-dependents"
          type="number"
          min="0"
          max="20"
          step="1"
          disabled={!applyTaxDeductions}
          aria-invalid={!!errors.dependents}
          {...register("dependents", { valueAsNumber: true })}
        />
        {errors.dependents && <p className="text-xs text-destructive">{errors.dependents.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="rec-notes">
          Notas <span className="text-xs text-muted-foreground">(opcional)</span>
        </Label>
        <Input id="rec-notes" placeholder="Observações" {...register("notes")} />
      </div>

      <div className="rounded-lg border border-border/70 bg-muted/30 p-3 text-xs text-muted-foreground">
        Deduções personalizadas ainda não são aceitas no endpoint de recorrência. Para esse caso, use
        receita do mês.
      </div>

      <div className="flex gap-3 pt-2">
        <SheetClose asChild>
          <Button type="button" variant="outline" className="flex-1">
            Cancelar
          </Button>
        </SheetClose>
        <Button type="submit" className="flex-1" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          Registrar
        </Button>
      </div>
    </form>
  );
}

export function AddIncomeSheet({ open, onOpenChange, selectedMonth }: AddIncomeSheetProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("manual");
  const isMobile = useIsMobile();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={cn(
          "overflow-y-auto p-4",
          isMobile ? "max-h-[92dvh] rounded-t-xl" : "w-full sm:max-w-md",
        )}
      >
        <SheetHeader>
          <SheetTitle>Nova receita</SheetTitle>
        </SheetHeader>

        <div role="tablist" aria-label="Tipo de receita" className="mt-4 flex rounded-lg bg-muted p-1">
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
          {activeTab === "manual" && (
            <ManualIncomeForm
              key="manual"
              selectedMonth={selectedMonth}
              onSuccess={() => onOpenChange(false)}
            />
          )}
          {activeTab === "recurring" && (
            <RecurringIncomeForm
              key="recurring"
              selectedMonth={selectedMonth}
              onSuccess={() => onOpenChange(false)}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
