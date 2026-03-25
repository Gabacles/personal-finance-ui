"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  useTransactionsControllerFindAll,
  useTransactionsControllerCreate,
  useTransactionsControllerUpdate,
  useTransactionsControllerRemove,
  getTransactionsControllerFindAllQueryKey,
} from "@/generated/api/transactions/transactions";
import {
  usePaymentMethodsControllerFindAll,
  usePaymentMethodsControllerCreate,
  getPaymentMethodsControllerFindAllQueryKey,
} from "@/generated/api/payment-methods/payment-methods";
import { useCategoriesControllerFindAll } from "@/generated/api/categories/categories";
import {
  useReportingControllerGetMonthSummary,
  getReportingControllerGetMonthSummaryQueryKey,
} from "@/generated/api/reporting/reporting";
import type { Transaction, PaymentMethod, Category, TransactionsSummary } from "../types/transactions.types";

// ─── Internal shapes ─────────────────────────────────────────────────────────

interface TransactionsEnvelope {
  data: { items: Record<string, unknown>[] };
}

interface PaymentMethodsEnvelope {
  data: PaymentMethod[];
}

interface SummaryEnvelope {
  data: Record<string, unknown>;
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapTransaction(item: Record<string, unknown>): Transaction {
  return {
    id: item.id as string,
    description: item.description as string,
    amountCents: item.amountCents as number,
    type: item.type as Transaction["type"],
    origin: item.origin as Transaction["origin"],
    referenceMonth: item.referenceMonth as string,
    transactionDate: item.transactionDate as string,
    notes: (item.notes as string | null) ?? null,
    category: (item.category as Transaction["category"]) ?? null,
    paymentMethod: (item.paymentMethod as Transaction["paymentMethod"]) ?? null,
  };
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useTransactions(month: string) {
  return useTransactionsControllerFindAll<Transaction[]>(
    { reference_month: month, page: 1, limit: 100 },
    {
      query: {
        select: (raw) => {
          const envelope = raw as unknown as TransactionsEnvelope;
          return (envelope.data.items ?? []).map(mapTransaction);
        },
      },
    },
  );
}

export function useTransactionsSummary(month: string) {
  return useReportingControllerGetMonthSummary<TransactionsSummary>(month, {
    query: {
      staleTime: 5 * 60 * 1000,
      select: (raw) => {
        const d = (raw as unknown as SummaryEnvelope).data;
        return {
          totalExpenseCents: (d.totalExpenseCents as number) ?? 0,
          oneTimeCents: (d.oneTimeCents as number) ?? 0,
          installmentCents: (d.installmentCents as number) ?? 0,
          recurringExpenseCents: (d.recurringExpenseCents as number) ?? 0,
          balanceCents: (d.balanceCents as number) ?? 0,
          byCategory:
            (d.byCategory as TransactionsSummary["byCategory"]) ?? [],
          byPaymentMethod:
            (d.byPaymentMethod as TransactionsSummary["byPaymentMethod"]) ?? [],
        };
      },
    },
  });
}

export function usePaymentMethods() {
  return usePaymentMethodsControllerFindAll<PaymentMethod[]>(undefined, {
    query: {
      select: (raw) => (raw as unknown as PaymentMethodsEnvelope).data ?? [],
    },
  });
}

export function useNonCCPaymentMethods() {
  return usePaymentMethodsControllerFindAll<PaymentMethod[]>(undefined, {
    query: {
      select: (raw) =>
        ((raw as unknown as PaymentMethodsEnvelope).data ?? []).filter(
          (pm) => pm.type !== "CREDIT_CARD",
        ),
    },
  });
}

export function useExpenseCategories() {
  return useCategoriesControllerFindAll<Category[]>(
    { type: "EXPENSE" },
    {
      query: {
        select: (raw) => {
          const data = (raw as unknown as { data: unknown }).data;
          if (Array.isArray(data)) return data as Category[];
          const paginated = data as { items?: Category[] };
          return paginated.items ?? [];
        },
      },
    },
  );
}

export function useCreateExpense(month: string) {
  const queryClient = useQueryClient();
  return useTransactionsControllerCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getTransactionsControllerFindAllQueryKey({ reference_month: month }),
        });
        queryClient.invalidateQueries({
          queryKey: getReportingControllerGetMonthSummaryQueryKey(month),
        });
      },
    },
  });
}

export function useUpdateTransaction(month: string) {
  const queryClient = useQueryClient();
  return useTransactionsControllerUpdate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getTransactionsControllerFindAllQueryKey({ reference_month: month }),
        });
        queryClient.invalidateQueries({
          queryKey: getReportingControllerGetMonthSummaryQueryKey(month),
        });
      },
    },
  });
}

export function useDeleteTransaction(month: string) {
  const queryClient = useQueryClient();
  return useTransactionsControllerRemove({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getTransactionsControllerFindAllQueryKey({ reference_month: month }),
        });
        queryClient.invalidateQueries({
          queryKey: getReportingControllerGetMonthSummaryQueryKey(month),
        });
      },
    },
  });
}

export function useCreatePaymentMethod() {
  const queryClient = useQueryClient();
  return usePaymentMethodsControllerCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getPaymentMethodsControllerFindAllQueryKey(),
        });
      },
    },
  });
}
