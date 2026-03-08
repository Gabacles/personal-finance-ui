import { formatMonth } from "@/modules/dashboard/utils/formatters";

interface DashboardHeaderProps {
  referenceMonth: string;
}

export function DashboardHeader({ referenceMonth }: DashboardHeaderProps) {
  const formattedMonth = formatMonth(referenceMonth);

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground capitalize">{formattedMonth}</p>
    </div>
  );
}
