export interface CreditCardDetails {
  closingDay: number;
  dueDay: number;
  creditLimitCents: number | null;
}

export interface CreditCard {
  id: string;
  name: string;
  type: "CREDIT_CARD";
  creditCard: CreditCardDetails | null;
  createdAt?: string;
}

export type StatementEntryType = "ONE_TIME" | "INSTALLMENT" | "RECURRING";

export interface StatementEntry {
  id: string;
  type: StatementEntryType;
  description: string;
  amountCents: number;
  referenceDate: string;
  category: { id: string; name: string } | null;
  // installment-specific
  installmentNumber?: number;
  totalInstallments?: number;
}

export interface CardStatement {
  entries: StatementEntry[];
  totalSpentCents: number;
  creditLimitCents: number | null;
}
