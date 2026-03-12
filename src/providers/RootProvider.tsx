import { PropsWithChildren } from "react";
import { QueryProvider } from "./QueryProvider";
import { AuthProvider } from "./AuthProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner"

export const RootProvider = ({ children }: PropsWithChildren) => {
  return (
    <QueryProvider>
      <AuthProvider>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </AuthProvider>
    </QueryProvider>
  );
};
