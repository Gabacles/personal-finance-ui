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

function currentYearMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function DashboardView() {
  const [selectedMonth, setSelectedMonth] = useState(currentYearMonth);
  const { data, isLoading, isError, refetch } = useDashboardData({ month: selectedMonth });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <AlertCircle className="size-10 text-destructive" />
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar o dashboard.
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="mr-2 size-4" />
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardHeader
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
      />

      <SummarySection summary={data.currentMonth} />

      <ProjectionsSection projections={data.projections} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryBreakdownSection categories={data.currentMonth.byCategory} />
        <PaymentMethodSection paymentMethods={data.currentMonth.byPaymentMethod} />
      </div>

      <LedgerPreviewSection entries={data.currentMonth.transactions} />
    </div>
  );
}
