/** Envelope returned by the API for all responses */
export interface DashboardApiResponse {
  data: DashboardData;
}

export interface DashboardData {
  currentMonth: CurrentMonthSummary;
  projections: MonthProjection[];
}

export interface CurrentMonthSummary {
  month: string;
  recurringGenerated: number;
  recurringSkipped: number;
  totalGrossCents: number;
  totalNetIncomeCents: number;
  totalDeductionCents: number;
  totalExpenseCents: number;
  oneTimeCents: number;
  installmentCents: number;
  recurringExpenseCents: number;
  balanceCents: number;
  byCategory: CategoryBreakdownItem[];
  byPaymentMethod: PaymentMethodBreakdownItem[];
  transactions: Transaction[];
  incomeEntry: unknown | null;
}

export interface MonthProjection {
  month: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  projectedIncomeCents: number;
  projectedExpenseCents: number;
  projectedBalanceCents: number;
  breakdown: {
    installmentCents: number;
    recurringExpenseCents: number;
    recurringIncomeCents: number;
  };
}

export interface CategoryBreakdownItem {
  categoryId: string;
  categoryName: string;
  totalCents: number;
}

export interface PaymentMethodBreakdownItem {
  paymentMethodId: string;
  paymentMethodName: string;
  totalCents: number;
}

export interface Transaction {
  id: string;
  description: string;
  amountCents: number;
  type: "EXPENSE" | "INCOME";
  origin: string;
  referenceMonth: string;
  transactionDate: string;
  notes: string | null;
  category: { id: string; name: string } | null;
  paymentMethod: { id: string; name: string } | null;
}
