import {
  usePaymentMethodsControllerFindAll,
  usePaymentMethodsControllerCreate,
  usePaymentMethodsControllerUpdate,
  usePaymentMethodsControllerRemove,
  usePaymentMethodsControllerGetStatement,
  getPaymentMethodsControllerFindAllQueryKey,
  getPaymentMethodsControllerGetStatementQueryKey,
} from "@/generated/api/payment-methods/payment-methods";
import { useQueryClient } from "@tanstack/react-query";
import { useTransactionsControllerUpdate, useTransactionsControllerRemove } from "@/generated/api/transactions/transactions";
import { useInstallmentsControllerCancel } from "@/generated/api/installment-plans/installment-plans";
import { useRecurringControllerUpdate, useRecurringControllerRemove } from "@/generated/api/recurring-transactions/recurring-transactions";
import type { CreditCard, CardStatement } from "../types/credit-cards.types";

interface PaymentMethodListResponse {
  data: CreditCard[];
}

export function useCreditCards() {
  return usePaymentMethodsControllerFindAll<CreditCard[]>(
    { type: "CREDIT_CARD" },
    {
      query: {
        select: (raw) => (raw as unknown as PaymentMethodListResponse).data,
      },
    },
  );
}

interface ApiTransaction {
  id: string;
  description: string;
  amountCents: number;
  origin: "ONE_TIME" | "INSTALLMENT" | "RECURRING";
  transactionDate: string;
  referenceMonth: string;
  category: { id: string; name: string } | null;
  installmentPlanId: string | null;
  installmentPlan: {
    installmentCount: number;
    firstReferenceMonth: string;
  } | null;
  recurringTransactionId: string | null;
}

interface ApiStatementResponse {
  data: {
    paymentMethod: {
      creditCard: { creditLimitCents: number } | null;
    };
    totalCents: number;
    transactions: ApiTransaction[];
  };
}

function selectStatement(raw: unknown): CardStatement {
  const { data: d } = raw as ApiStatementResponse;
  const entries = d.transactions.map((t) => {
    let installmentNumber: number | undefined;
    let totalInstallments: number | undefined;
    if (t.origin === "INSTALLMENT" && t.installmentPlan) {
      totalInstallments = t.installmentPlan.installmentCount;
      const [fy, fm] = t.installmentPlan.firstReferenceMonth.split("-").map(Number);
      const [ry, rm] = t.referenceMonth.split("-").map(Number);
      installmentNumber = (ry - fy) * 12 + (rm - fm) + 1;
    }
    return {
      id: t.id,
      type: t.origin,
      description: t.description,
      amountCents: t.amountCents,
      referenceDate: t.transactionDate,
      category: t.category,
      installmentNumber,
      totalInstallments,
      installmentPlanId: t.installmentPlanId ?? undefined,
      recurringId: t.recurringTransactionId ?? undefined,
    };
  });
  return {
    entries,
    totalSpentCents: d.totalCents,
    creditLimitCents: d.paymentMethod?.creditCard?.creditLimitCents ?? null,
  };
}

export function useCardStatement(cardId: string | null, month: string) {
  return usePaymentMethodsControllerGetStatement<CardStatement>(
    cardId ?? "",
    { month },
    {
      query: {
        enabled: !!cardId,
        select: selectStatement,
      },
    },
  );
}

export function useCreateCreditCard() {
  const queryClient = useQueryClient();
  return usePaymentMethodsControllerCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getPaymentMethodsControllerFindAllQueryKey({
            type: "CREDIT_CARD",
          }),
        });
      },
    },
  });
}

export function useUpdateCreditCard() {
  const queryClient = useQueryClient();
  return usePaymentMethodsControllerUpdate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getPaymentMethodsControllerFindAllQueryKey({
            type: "CREDIT_CARD",
          }),
        });
      },
    },
  });
}

export function useDeleteCreditCard() {
  const queryClient = useQueryClient();
  return usePaymentMethodsControllerRemove({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getPaymentMethodsControllerFindAllQueryKey({
            type: "CREDIT_CARD",
          }),
        });
      },
    },
  });
}

export function useUpdatePurchaseTransaction(cardId: string, selectedMonth: string) {
  const queryClient = useQueryClient();
  return useTransactionsControllerUpdate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getPaymentMethodsControllerGetStatementQueryKey(cardId, { month: selectedMonth }),
        });
      },
    },
  });
}

export function useDeletePurchaseTransaction(cardId: string, selectedMonth: string) {
  const queryClient = useQueryClient();
  return useTransactionsControllerRemove({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getPaymentMethodsControllerGetStatementQueryKey(cardId, { month: selectedMonth }),
        });
      },
    },
  });
}

export function useCancelInstallmentPlan(cardId: string, selectedMonth: string) {
  const queryClient = useQueryClient();
  return useInstallmentsControllerCancel({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getPaymentMethodsControllerGetStatementQueryKey(cardId, { month: selectedMonth }),
        });
      },
    },
  });
}

export function useUpdateRecurringTransaction(cardId: string, selectedMonth: string) {
  const queryClient = useQueryClient();
  return useRecurringControllerUpdate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getPaymentMethodsControllerGetStatementQueryKey(cardId, { month: selectedMonth }),
        });
      },
    },
  });
}

export function useDeleteRecurringTransaction(cardId: string, selectedMonth: string) {
  const queryClient = useQueryClient();
  return useRecurringControllerRemove({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getPaymentMethodsControllerGetStatementQueryKey(cardId, { month: selectedMonth }),
        });
      },
    },
  });
}
