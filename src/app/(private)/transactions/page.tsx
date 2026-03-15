import type { Metadata } from "next";
import { TransactionsView } from "@/modules/transactions";

export const metadata: Metadata = {
  title: "Transações | Personal Finance",
  description: "Visualize e gerencie seus gastos avulsos e métodos de pagamento do mês",
};

export default function TransactionsPage() {
  return (
    <section className="finance-page-shell">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <TransactionsView />
      </div>
    </section>
  );
}
