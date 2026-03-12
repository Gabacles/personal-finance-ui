import type { Metadata } from "next";
import { Landmark } from "lucide-react";
import { RegisterForm } from "@/modules/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "Create account | Personal Finance",
  description: "Create your Personal Finance account",
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted/40 px-4 py-12">
      <div className="flex items-center gap-2 text-foreground">
        <Landmark className="size-5" aria-hidden />
        <span className="text-base font-semibold tracking-tight">Personal Finance</span>
      </div>
      <RegisterForm />
    </main>
  );
}
