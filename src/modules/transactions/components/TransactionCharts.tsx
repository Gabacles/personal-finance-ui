"use client";

import { useMemo } from "react";
import { BarList, SparkLineChart } from "@tremor/react";
import { SectionHeader } from "@/components/ui/section-header";
import { SkeletonChart } from "@/components/ui/skeleton-chart";
import { ORIGIN_LABELS, type Transaction } from "../types/transactions.types";

const brlFormatter = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const pctFormatter = (v: number) => `${v > 0 ? "+" : ""}${(v * 100).toFixed(1)}%`;

interface TransactionChartsProps {
  transactions: Transaction[] | undefined;
  isLoading: boolean;
}

export function TransactionCharts({ transactions, isLoading }: TransactionChartsProps) {
  if (isLoading) {
    return (
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SkeletonChart />
        <SkeletonChart />
      </div>
    );
  }

  const expenses = (transactions ?? []).filter((tx) => tx.type === "EXPENSE");

  if (expenses.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <CategoryRankingChart transactions={expenses} />
      <OriginSparklines transactions={expenses} />
    </div>
  );
}

interface CategoryRankingChartProps {
  transactions: Transaction[];
}

function CategoryRankingChart({ transactions }: CategoryRankingChartProps) {
  const chartData = useMemo(
    () => {
      const totalsByCategory = new Map<string, number>();

      for (const tx of transactions) {
        const categoryName = tx.category?.name?.trim() || "Sem categoria";
        totalsByCategory.set(
          categoryName,
          (totalsByCategory.get(categoryName) ?? 0) + tx.amountCents / 100,
        );
      }

      return [...totalsByCategory.entries()]
        .map(([name, value], idx) => ({
          key: `${name}-${idx}`,
          name,
          value: Number(value.toFixed(2)),
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);
    },
    [transactions],
  );

  const total = useMemo(
    () => chartData.reduce((acc, item) => acc + item.value, 0),
    [chartData],
  );

  const topCategory = chartData[0];

  if (chartData.length === 0) {
    return (
      <section className="finance-surface flex items-center justify-center p-5 sm:p-6">
        <p className="text-sm text-muted-foreground">Sem dados para ranking por categoria</p>
      </section>
    );
  }

  return (
    <section className="finance-surface overflow-hidden motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500">
      <div className="border-b border-border/60 bg-linear-to-r from-amber-100/60 via-orange-100/35 to-transparent px-5 py-4 sm:px-6">
        <SectionHeader
          title="Ranking por categoria"
          description="Top categorias com maior peso no mês"
        />
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-border/60 bg-background/70 px-3 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-300/70 hover:shadow-sm">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Maior categoria</p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {topCategory.name} <span className="font-medium text-muted-foreground">({brlFormatter(topCategory.value)})</span>
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/70 px-3 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-300/70 hover:shadow-sm">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total nas categorias</p>
            <p className="mt-1 text-sm font-semibold tabular-nums text-foreground">{brlFormatter(total)}</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <BarList
          className="mt-1"
          data={chartData}
          valueFormatter={brlFormatter}
          color="amber"
          showAnimation
        />
      </div>
    </section>
  );
}

interface OriginSparklinesProps {
  transactions: Transaction[];
}

const ORIGIN_COLORS: Record<string, "rose" | "blue" | "emerald"> = {
  ONE_TIME: "rose",
  INSTALLMENT: "blue",
  RECURRING: "emerald",
};

function OriginSparklines({ transactions }: OriginSparklinesProps) {
  const cards = useMemo(() => {
    const origins: Array<"ONE_TIME" | "INSTALLMENT" | "RECURRING"> = [
      "ONE_TIME",
      "INSTALLMENT",
      "RECURRING",
    ];

    return origins
      .map((origin) => {
        const totalsByWeek = [0, 0, 0, 0, 0];

        for (const tx of transactions) {
          if (tx.origin !== origin) continue;
          const day = new Date(tx.transactionDate).getDate();
          if (!Number.isFinite(day)) continue;
          const weekIndex = Math.min(4, Math.max(0, Math.floor((day - 1) / 7)));
          totalsByWeek[weekIndex] += tx.amountCents / 100;
        }

        const total = totalsByWeek.reduce((sum, value) => sum + value, 0);
        const peakValue = Math.max(...totalsByWeek);
        const peakIndex = totalsByWeek.findIndex((v) => v === peakValue);
        const week4 = totalsByWeek[3] ?? 0;
        const week5 = totalsByWeek[4] ?? 0;
        const momentum = week4 > 0 ? (week5 - week4) / week4 : week5 > 0 ? 1 : 0;
        const sparkData = totalsByWeek.map((value, index) => ({
          semana: `S${index + 1}`,
          Valor: Number(value.toFixed(2)),
        }));

        return {
          origin,
          label: ORIGIN_LABELS[origin],
          color: ORIGIN_COLORS[origin],
          total,
          peakLabel: `S${peakIndex + 1}`,
          peakValue,
          momentum,
          sparkData,
        };
      })
      .filter((item) => item.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [transactions]);

  if (cards.length === 0) {
    return (
      <section className="finance-surface flex items-center justify-center p-5 sm:p-6">
        <p className="text-sm text-muted-foreground">Sem dados para tendência semanal por origem</p>
      </section>
    );
  }

  return (
    <section className="finance-surface overflow-hidden motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 motion-safe:[animation-delay:120ms]">
      <div className="border-b border-border/60 bg-linear-to-r from-sky-100/60 via-cyan-100/35 to-transparent px-5 py-4 sm:px-6">
        <SectionHeader
          title="Ritmo semanal por origem"
          description="Sparklines para comparar o comportamento no mês"
        />
      </div>

      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
        {cards.map((card, index) => (
          <article
            key={card.origin}
            className="rounded-xl border border-border/60 bg-linear-to-br from-background/95 via-background to-muted/25 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/70 hover:shadow-md motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2"
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{card.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Pico em {card.peakLabel}: <span className="font-medium text-foreground/90">{brlFormatter(card.peakValue)}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold tabular-nums text-foreground">{brlFormatter(card.total)}</p>
                <p
                  className={`mt-1 text-xs font-medium ${
                    card.momentum >= 0 ? "text-emerald-700" : "text-rose-700"
                  }`}
                >
                  {pctFormatter(card.momentum)} vs S4
                </p>
              </div>
            </div>
            <SparkLineChart
              className="mt-3 h-14 w-full"
              data={card.sparkData}
              index="semana"
              categories={["Valor"]}
              colors={[card.color]}
              autoMinValue
            />
          </article>
        ))}
        </div>
      </div>
    </section>
  );
}
