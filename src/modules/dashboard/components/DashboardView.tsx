"use client";

import { useState } from "react";
import { useDashboardData } from "../hooks/use-dashboard-data";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSkeleton } from "./skeletons/DashboardSkeleton";
import { SummarySection } from "./summary/SummarySection";
import { ProjectionsSection } from "./projections/ProjectionsSection";
import { CategoryBreakdownSection } from "./categories/CategoryBreakdownSection";
import { PaymentMethodSection } from "./payment-methods/PaymentMethodSection";
import { LedgerPreviewSection } from "./ledger/LedgerPreviewSection";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentYearMonth } from "@/lib/month";

export function DashboardView() {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentYearMonth);
  const { data, isLoading, isError, refetch } = useDashboardData({ month: selectedMonth });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="finance-surface flex flex-col items-center justify-center gap-4 py-24">
        <AlertCircle className="size-10 text-destructive" />
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar o dashboard.
        </p>
        <Button variant="outline" size="sm" className="border-border/70 bg-background/90" onClick={() => refetch()}>
          <RefreshCw className="mr-2 size-4" />
          Tentar novamente
        </Button>
      </div>
    );
  }

  const monthData = data.currentMonth;

  return (
    <div className="space-y-6 lg:space-y-8">
      <DashboardHeader
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
      />

      <SummarySection summary={monthData} />

      <ProjectionsSection projections={data.projections} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryBreakdownSection categories={monthData.byCategory} />
        <PaymentMethodSection paymentMethods={monthData.byPaymentMethod} />
      </div>

      <LedgerPreviewSection entries={monthData.transactions} />
    </div>
  );
}
