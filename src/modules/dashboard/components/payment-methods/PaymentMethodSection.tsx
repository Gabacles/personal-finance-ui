"use client";

import { BarChart } from "@tremor/react";
import { SectionHeader } from "@/components/ui/section-header";
import { ChartTooltip } from "@/components/ui/chart-tooltip";
import type { PaymentMethodBreakdownItem } from "@/modules/dashboard/types/dashboard.types";

const brlFormatter = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const PaymentMethodTooltip = (props: any) => (
  <ChartTooltip {...props} valueFormatter={brlFormatter} />
);

interface PaymentMethodSectionProps {
  paymentMethods: PaymentMethodBreakdownItem[];
}

export function PaymentMethodSection({
  paymentMethods,
}: PaymentMethodSectionProps) {
  const chartData = paymentMethods.map((pm) => ({
    name: pm.paymentMethodName,
    Total: pm.totalCents / 100,
  }));

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <SectionHeader
        title="Meio de pagamento"
        description="Volume por método de pagamento"
      />
      <BarChart
        className="mt-4 h-60"
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
    </div>
  );
}
