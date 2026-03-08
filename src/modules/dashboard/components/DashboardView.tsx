"use client";

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

export function DashboardView() {
  const { data, isLoading, isError, refetch } = useDashboardData();

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
      <DashboardHeader referenceMonth={data.summary.referenceMonth} />

      <SummarySection summary={data.summary} />

      <ProjectionsSection projections={data.projections} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryBreakdownSection categories={data.categoryBreakdown} />
        <PaymentMethodSection paymentMethods={data.paymentMethodBreakdown} />
      </div>

      <LedgerPreviewSection entries={data.ledgerPreview} />
    </div>
  );
}
