"use client";

import { type ComponentProps, useMemo } from "react";
import { BarChart } from "@tremor/react";
import { SectionHeader } from "@/components/ui/section-header";
import { ChartTooltip } from "@/components/ui/chart-tooltip";
import type { PaymentMethodBreakdownItem } from "@/modules/dashboard/types/dashboard.types";

const brlFormatter = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type DashboardTooltipProps = ComponentProps<typeof ChartTooltip>;

const PaymentMethodTooltip = (props: DashboardTooltipProps) => (
  <ChartTooltip {...props} valueFormatter={brlFormatter} />
);

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
