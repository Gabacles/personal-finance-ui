const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const percentFormatter = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function formatCentsToBRL(cents: number): string {
  return currencyFormatter.format(cents / 100);
}

export function formatPercent(value: number): string {
  return percentFormatter.format(value / 100);
}

export function formatMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split("-").map(Number);
  return monthFormatter.format(new Date(year, month - 1));
}

export function formatShortDate(dateStr: string): string {
  const dateOnly = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  const date = new Date(dateOnly + "T00:00:00");
  return shortDateFormatter.format(date);
}
