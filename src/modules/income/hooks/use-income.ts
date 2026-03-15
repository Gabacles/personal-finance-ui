import { useQueryClient } from "@tanstack/react-query";
import {
  getCategoriesControllerFindAllQueryKey,
  useCategoriesControllerFindAll,
} from "@/generated/api/categories/categories";
import {
  getIncomeControllerFindAllQueryKey,
  useIncomeControllerFindAll,
  useIncomeControllerRegister,
  useIncomeControllerRemove,
} from "@/generated/api/income/income";
import {
  getRecurringControllerFindAllQueryKey,
  useRecurringControllerActivate,
  useRecurringControllerCreate,
  useRecurringControllerDeactivate,
  useRecurringControllerFindAll,
  useRecurringControllerRemove,
} from "@/generated/api/recurring-transactions/recurring-transactions";
import {
  getReportingControllerGetMonthSummaryQueryKey,
  useReportingControllerGetMonthSummary,
} from "@/generated/api/reporting/reporting";
import {
  getTransactionsControllerFindAllQueryKey,
  useTransactionsControllerFindAll,
} from "@/generated/api/transactions/transactions";
import type {
  IncomeControllerFindAll200,
  IncomeControllerFindAll200DataItemsItem,
  RecurringControllerFindAll200,
  RecurringControllerFindAll200DataItemsItem,
  TransactionsControllerFindAll200,
} from "@/generated/api/personalFinanceAPI.schemas";
import type {
  IncomeCategory,
  IncomeEntry,
  IncomeSummary,
  IncomeTransaction,
  RecurringIncomeTemplate,
} from "../types/income.types";

function toNumber(value: unknown): number {
  return typeof value === "number" ? value : 0;
}

function toString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toIncomeCategories(raw: unknown): IncomeCategory[] {
  if (!isRecord(raw)) return [];

  const data = raw.data;

  if (Array.isArray(data)) {
    return data.filter((item): item is IncomeCategory => (
      isRecord(item) && typeof item.id === "string" && typeof item.name === "string"
    ));
  }

  if (isRecord(data) && Array.isArray(data.items)) {
    return data.items.filter((item): item is IncomeCategory => (
      isRecord(item) && typeof item.id === "string" && typeof item.name === "string"
    ));
  }

  return [];
}

export function useIncomeSummary(month: string) {
  return useReportingControllerGetMonthSummary<IncomeSummary>(month, {
    query: {
      staleTime: 60 * 1000,
      select: (raw) => {
        const rawUnknown = raw as unknown;
        const source = (
          isRecord(rawUnknown) && isRecord(rawUnknown.data)
            ? rawUnknown.data
            : rawUnknown
        ) as Record<string, unknown>;
        const entries = Array.isArray(source.incomeEntries)
          ? (source.incomeEntries.filter(isRecord) as Array<Record<string, unknown>>)
          : [];

        return {
          month: toString(source.month) || month,
          totalNetIncomeCents: toNumber(source.totalNetIncomeCents),
          totalGrossCents: toNumber(source.totalGrossCents),
          totalDeductionCents: toNumber(source.totalDeductionCents),
          recurringIncomeCents: toNumber(source.recurringIncomeCents),
          incomeEntries: entries,
        };
      },
    },
  });
}

export function useIncomeTransactions(month: string) {
  return useTransactionsControllerFindAll<IncomeTransaction[]>(
    {
      type: "INCOME",
      reference_month: month,
      page: 1,
      limit: 100,
    },
    {
      query: {
        select: (raw) => {
          const envelope = raw as TransactionsControllerFindAll200;
          const items = envelope.data?.items ?? [];

          return items.map((item, index) => {
            const origin = item.origin === "INCOME" || item.origin === "RECURRING"
              ? item.origin
              : "OTHER";

            return {
              id: item.id ?? `income-tx-${index}`,
              description: item.description ?? "Sem descrição",
              amountCents: item.amountCents ?? 0,
              transactionDate: item.transactionDate ?? "",
              referenceMonth: item.referenceMonth ?? month,
              origin,
              categoryName: item.category?.name ?? null,
            };
          });
        },
      },
    },
  );
}

export function useIncomeEntries(month: string) {
  return useIncomeControllerFindAll<IncomeEntry[]>(
    {
      referenceMonth: month,
      page: 1,
      limit: 100,
    },
    {
      query: {
        select: (raw) => {
          const envelope = raw as IncomeControllerFindAll200;
          const items: IncomeControllerFindAll200DataItemsItem[] = envelope.data?.items ?? [];

          return items
            .filter((item) => item.referenceMonth === month)
            .map((item, index) => {
              const deductionCents = (item.deductions ?? []).reduce(
                (sum, deduction) => sum + (deduction.amountCents ?? 0),
                0,
              );

              return {
                id: item.id ?? `income-entry-${index}`,
                description: item.description ?? "Receita",
                referenceMonth: item.referenceMonth ?? month,
                grossCents: item.grossCents ?? 0,
                netCents: item.netCents ?? 0,
                deductionCents,
                createdAt: item.createdAt ?? "",
              };
            })
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        },
      },
    },
  );
}

export function useRecurringIncomeTemplates() {
  return useRecurringControllerFindAll<RecurringIncomeTemplate[]>(
    {
      type: "INCOME",
      page: 1,
      limit: 100,
    },
    {
      query: {
        select: (raw) => {
          const envelope = raw as RecurringControllerFindAll200;
          const items: RecurringControllerFindAll200DataItemsItem[] = envelope.data?.items ?? [];

          return items.map((item, index) => ({
            id: item.id ?? `rec-income-${index}`,
            description: item.description ?? "Receita recorrente",
            amountCents: item.amountCents ?? 0,
            grossCents: item.grossAmountCents ?? item.amountCents ?? 0,
            deductionCents: item.deductionCents ?? 0,
            netCents: item.netAmountCents ?? item.amountCents ?? 0,
            startMonth: item.startMonth ?? "",
            endMonth: item.endMonth ?? null,
            isActive: item.isActive ?? true,
            applyTaxDeductions: item.applyTaxDeductions ?? false,
          }));
        },
      },
    },
  );
}

export function useIncomeCategories() {
  return useCategoriesControllerFindAll<IncomeCategory[]>(
    { type: "INCOME" },
    {
      query: {
        select: (raw) => toIncomeCategories(raw as unknown),
      },
    },
  );
}

export function useCreateIncomeEntry(month: string) {
  const queryClient = useQueryClient();

  return useIncomeControllerRegister({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getIncomeControllerFindAllQueryKey() });
        queryClient.invalidateQueries({
          queryKey: getTransactionsControllerFindAllQueryKey({
            type: "INCOME",
            reference_month: month,
            page: 1,
            limit: 100,
          }),
        });
        queryClient.invalidateQueries({ queryKey: getReportingControllerGetMonthSummaryQueryKey(month) });
      },
    },
  });
}

export function useDeleteIncomeEntry(month: string) {
  const queryClient = useQueryClient();

  return useIncomeControllerRemove({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getIncomeControllerFindAllQueryKey() });
        queryClient.invalidateQueries({
          queryKey: getTransactionsControllerFindAllQueryKey({
            type: "INCOME",
            reference_month: month,
            page: 1,
            limit: 100,
          }),
        });
        queryClient.invalidateQueries({ queryKey: getReportingControllerGetMonthSummaryQueryKey(month) });
      },
    },
  });
}

export function useCreateRecurringIncome(month: string) {
  const queryClient = useQueryClient();

  return useRecurringControllerCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getRecurringControllerFindAllQueryKey({ type: "INCOME" }) });
        queryClient.invalidateQueries({
          queryKey: getTransactionsControllerFindAllQueryKey({
            type: "INCOME",
            reference_month: month,
            page: 1,
            limit: 100,
          }),
        });
        queryClient.invalidateQueries({ queryKey: getReportingControllerGetMonthSummaryQueryKey(month) });
      },
    },
  });
}

export function useActivateRecurringIncome(month: string) {
  const queryClient = useQueryClient();

  return useRecurringControllerActivate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getRecurringControllerFindAllQueryKey({ type: "INCOME" }) });
        queryClient.invalidateQueries({ queryKey: getReportingControllerGetMonthSummaryQueryKey(month) });
      },
    },
  });
}

export function useDeactivateRecurringIncome(month: string) {
  const queryClient = useQueryClient();

  return useRecurringControllerDeactivate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getRecurringControllerFindAllQueryKey({ type: "INCOME" }) });
        queryClient.invalidateQueries({ queryKey: getReportingControllerGetMonthSummaryQueryKey(month) });
      },
    },
  });
}

export function useDeleteRecurringIncome(month: string) {
  const queryClient = useQueryClient();

  return useRecurringControllerRemove({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getRecurringControllerFindAllQueryKey({ type: "INCOME" }) });
        queryClient.invalidateQueries({
          queryKey: getTransactionsControllerFindAllQueryKey({
            type: "INCOME",
            reference_month: month,
            page: 1,
            limit: 100,
          }),
        });
        queryClient.invalidateQueries({ queryKey: getReportingControllerGetMonthSummaryQueryKey(month) });
      },
    },
  });
}
