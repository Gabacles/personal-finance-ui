export type PaymentMethodType =
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "PIX"
  | "CASH"
  | "OTHER";

export type NonCCPaymentMethodType = Exclude<PaymentMethodType, "CREDIT_CARD">;

export type TransactionOrigin = "ONE_TIME" | "INSTALLMENT" | "RECURRING" | "INCOME";

export type TransactionType = "EXPENSE" | "INCOME";

export interface Transaction {
  id: string;
  description: string;
  amountCents: number;
  type: TransactionType;
  origin: TransactionOrigin;
  referenceMonth: string;
  transactionDate: string;
  notes: string | null;
  category: { id: string; name: string } | null;
  paymentMethod: { id: string; name: string } | null;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: PaymentMethodType;
}

export interface Category {
  id: string;
  name: string;
}

export interface TransactionsSummary {
  totalExpenseCents: number;
  oneTimeCents: number;
  installmentCents: number;
  recurringExpenseCents: number;
  balanceCents: number;
  byCategory: Array<{ categoryId: string; categoryName: string; totalCents: number }>;
  byPaymentMethod: Array<{
    paymentMethodId: string;
    paymentMethodName: string;
    totalCents: number;
  }>;
}

export const PM_TYPE_LABELS: Record<NonCCPaymentMethodType, string> = {
  DEBIT_CARD: "Cartão de Débito",
  PIX: "PIX",
  CASH: "Dinheiro",
  OTHER: "Outro",
};

export const PM_ALL_TYPE_LABELS: Record<PaymentMethodType, string> = {
  CREDIT_CARD: "Cartão de Crédito",
  DEBIT_CARD: "Cartão de Débito",
  PIX: "PIX",
  CASH: "Dinheiro",
  OTHER: "Outro",
};

export const PM_TYPE_OPTIONS: Array<{ value: NonCCPaymentMethodType; label: string }> = [
  { value: "DEBIT_CARD", label: "Cartão de Débito" },
  { value: "PIX", label: "PIX" },
  { value: "CASH", label: "Dinheiro" },
  { value: "OTHER", label: "Outro" },
];

export const ORIGIN_LABELS: Record<TransactionOrigin, string> = {
  ONE_TIME: "Avulso",
  INSTALLMENT: "Parcelado",
  RECURRING: "Recorrente",
  INCOME: "Receita",
};
