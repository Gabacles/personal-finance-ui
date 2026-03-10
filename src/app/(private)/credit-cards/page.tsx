import type { Metadata } from "next";
import { CreditCardsView } from "@/modules/credit-cards";

export const metadata: Metadata = {
  title: "Cartões de Crédito | Personal Finance",
  description: "Gerencie seus cartões de crédito e acompanhe compras, parcelamentos e assinaturas",
};

export default function CreditCardsPage() {
  return (
    <div className="mx-18 px-4 py-8 sm:px-6 lg:px-8">
      <CreditCardsView />
    </div>
  );
}
