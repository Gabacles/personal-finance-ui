import type { Metadata } from "next";
import { IncomeView } from "@/modules/income";

export const metadata: Metadata = {
  title: "Receitas | Personal Finance",
  description: "Gerencie suas receitas mensais e recorrentes",
};

export default function IncomePage() {
  return (
    <div className="mx-6 md:mx-18 px-4 py-8 sm:px-6 lg:px-8">
      <IncomeView />
    </div>
  );
}
