import type { Metadata } from "next";
import { Montserrat, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { RootProvider } from "@/providers/RootProvider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finanças Pessoais",
  description:
    "Gerencie suas finanças pessoais: acompanhe gastos, receitas, orçamentos e métodos de pagamento em um só lugar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${montserrat.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
