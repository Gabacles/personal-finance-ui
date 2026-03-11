"use client";
import type { Metadata } from "next";
import { CreditCardsView } from "@/modules/credit-cards";
import { toast } from "sonner";
import { useEffect } from "react";

// export const metadata: Metadata = {
//   title: "Cartões de Crédito | Personal Finance",
//   description: "Gerencie seus cartões de crédito e acompanhe compras, parcelamentos e assinaturas",
// };

export default function CreditCardsPage() {
  useEffect(() => {
    toast.error("Bem-vindo à página de cartões de crédito!");
  }, []);

  return (
    <div className="mx-6 md:mx-18 px-4 py-8 sm:px-6 lg:px-8">
      <CreditCardsView />
    </div>
  );
}
