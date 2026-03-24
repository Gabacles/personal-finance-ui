import type { PropsWithChildren } from "react";

import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function PublicLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-20 mx-auto flex w-full max-w-7xl justify-end px-4 py-4 sm:px-6">
        <div className="pointer-events-auto">
          <ThemeToggle />
        </div>
      </div>
      {children}
    </div>
  );
}