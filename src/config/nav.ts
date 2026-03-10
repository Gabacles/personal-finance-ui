import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  Wallet,
  Tag,
  CreditCard,
  Repeat,
  BarChart3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
};

export type NavSection = {
  title?: string;
  items: NavItem[];
};

export const navSections: NavSection[] = [
  {
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Finanças",
    items: [
      {
        label: "Transações",
        href: "/transactions",
        icon: ArrowLeftRight,
        disabled: true,
      },
      {
        label: "Receitas",
        href: "/income",
        icon: TrendingUp,
        disabled: true,
      },
      {
        label: "Orçamentos",
        href: "/budgets",
        icon: Wallet,
        disabled: true,
      },
      {
        label: "Recorrentes",
        href: "/recurring-transactions",
        icon: Repeat,
        disabled: true,
      },
    ],
  },
  {
    title: "Configurações",
    items: [
      {
        label: "Categorias",
        href: "/categories",
        icon: Tag,
        disabled: true,
      },
      {
        label: "Cartões de Crédito",
        href: "/credit-cards",
        icon: CreditCard,
      },
      {
        label: "Relatórios",
        href: "/reports",
        icon: BarChart3,
        disabled: true,
      },
    ],
  },
];
