export interface DashboardResponse {
  summary: MonthlySummary;
  projections: MonthProjection[];
  categoryBreakdown: CategoryBreakdownItem[];
  paymentMethodBreakdown: PaymentMethodBreakdownItem[];
  ledgerPreview: LedgerEntry[];
}

export interface MonthlySummary {
  referenceMonth: string;
  totalIncomeCents: number;
  totalExpenseCents: number;
  netBalanceCents: number;
  savingsRate: number;
}

export interface MonthProjection {
  month: string;
  projectedIncomeCents: number;
  projectedExpenseCents: number;
  projectedBalanceCents: number;
  isActual: boolean;
}

export interface CategoryBreakdownItem {
  categoryId: string;
  categoryName: string;
  totalCents: number;
  percentage: number;
  transactionCount: number;
}

export interface PaymentMethodBreakdownItem {
  paymentMethodId: string;
  paymentMethodName: string;
  type: string;
  totalCents: number;
  transactionCount: number;
}

export interface LedgerEntry {
  id: string;
  description: string;
  amountCents: number;
  type: "EXPENSE" | "INCOME";
  transactionDate: string;
  categoryName: string | null;
  paymentMethodName: string | null;
  origin: string;
}
