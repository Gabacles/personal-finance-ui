"use client";

import { useMemo } from "react";
import { BarChart } from "@tremor/react";
import { SectionHeader } from "@/components/ui/section-header";
import type { PaymentMethodBreakdownItem } from "@/modules/dashboard/types/dashboard.types";

const brlFormatter = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const PaymentMethodTooltip = (props: any) => {
  const { active, payload, label } = props;

  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-card px-3 py-2.5 shadow-lg text-sm text-card-foreground">
      {label && <p className="mb-2 font-semibold capitalize">{label}</p>}
      <div className="space-y-1">
        {payload.map((item: any) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted-foreground">{item.name}:</span>
            <span className="ml-auto pl-6 font-medium tabular-nums">
              {brlFormatter(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface PaymentMethodSectionProps {
  paymentMethods: PaymentMethodBreakdownItem[];
}

export function PaymentMethodSection({
  paymentMethods,
}: PaymentMethodSectionProps) {
  const chartData = useMemo(
    () =>
      paymentMethods.map((paymentMethod) => ({
        name: paymentMethod.paymentMethodName,
        Total: paymentMethod.totalCents / 100,
      })),
    [paymentMethods],
  );

  return (
    <section className="finance-surface overflow-hidden p-5 sm:p-6">
      <SectionHeader
        title="Meio de pagamento"
        description="Volume por método de pagamento"
      />
      <BarChart
        className="finance-chart-themed mt-4 h-60"
        data={chartData}
        index="name"
        categories={["Total"]}
        colors={["violet"]}
        valueFormatter={(v) =>
          v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        }
        yAxisWidth={96}
        customTooltip={PaymentMethodTooltip}
        showAnimation
      />
    </section>
  );
}
