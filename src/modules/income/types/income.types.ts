export interface IncomeSummary {
  month: string;
  totalNetIncomeCents: number;
  totalGrossCents: number;
  totalDeductionCents: number;
  recurringIncomeCents: number;
  incomeEntries: Array<Record<string, unknown>>;
}

export type IncomeTransactionOrigin = "INCOME" | "RECURRING" | "OTHER";

export interface IncomeTransaction {
  id: string;
  description: string;
  amountCents: number;
  transactionDate: string;
  referenceMonth: string;
  origin: IncomeTransactionOrigin;
  categoryName: string | null;
}

export interface IncomeEntry {
  id: string;
  description: string;
  referenceMonth: string;
  grossCents: number;
  netCents: number;
  deductionCents: number;
  createdAt: string;
}

export interface RecurringIncomeTemplate {
  id: string;
  description: string;
  amountCents: number;
  grossCents: number;
  deductionCents: number;
  netCents: number;
  startMonth: string;
  endMonth: string | null;
  isActive: boolean;
  applyTaxDeductions: boolean;
}

export interface IncomeCategory {
  id: string;
  name: string;
}
