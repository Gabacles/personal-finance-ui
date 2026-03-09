import type { Metadata } from "next";
import { DashboardView } from "@/modules/dashboard/components/DashboardView";

export const metadata: Metadata = {
  title: "Dashboard | Personal Finance",
  description: "Visão geral das suas finanças pessoais",
};

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <DashboardView />
    </main>
  );
}
