"use client";

import { BarChart } from "@tremor/react";
import { SectionHeader } from "@/components/ui/section-header";
import type { PaymentMethodBreakdownItem } from "@/modules/dashboard/types/dashboard.types";

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
        colors={["blue"]}
        valueFormatter={(v) =>
          v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        }
        yAxisWidth={80}
        showAnimation
      />
    </div>
  );
}
