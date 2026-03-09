import type { Metadata } from "next";
import { Landmark } from "lucide-react";
import { LoginForm } from "@/modules/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Sign in | Personal Finance",
  description: "Sign in to your Personal Finance account",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted/40 px-4 py-12">
      <div className="flex items-center gap-2 text-foreground">
        <Landmark className="size-5" aria-hidden />
        <span className="text-base font-semibold tracking-tight">Personal Finance</span>
      </div>
      <LoginForm />
    </main>
  );
}
