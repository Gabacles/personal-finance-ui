import type { Metadata } from "next";
import { IncomeView } from "@/modules/income";

export const metadata: Metadata = {
  title: "Receitas | Personal Finance",
  description: "Gerencie suas receitas mensais e recorrentes",
};

export default function IncomePage() {
  return (
    <section className="finance-page-shell">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <IncomeView />
      </div>
    </section>
  );
}
