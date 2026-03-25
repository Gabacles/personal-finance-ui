function parseYearMonth(value: string) {
  const [yearRaw, monthRaw] = value.split("-");
  const year = Number(yearRaw);
  const month = Number(monthRaw);

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return null;
  }

  return { year, month };
}

export function toIsoMonth(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

export function getCurrentYearMonth(now: Date = new Date()): string {
  return toIsoMonth(now);
}

export function getMonthRangeFromNow(monthsBack = 12, monthsForward = 12, now: Date = new Date()) {
  return {
    minMonth: toIsoMonth(new Date(now.getFullYear(), now.getMonth() - monthsBack, 1)),
    maxMonth: toIsoMonth(new Date(now.getFullYear(), now.getMonth() + monthsForward, 1)),
  };
}

export function formatMonthLabel(value: string, locale = "pt-BR"): string {
  const parsed = parseYearMonth(value);

  if (!parsed) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(new Date(parsed.year, parsed.month - 1, 1));
}
