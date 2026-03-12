"use client";

import { useAuth } from "@/providers/AuthProvider";

/**
 * Convenience hook for register forms.
 * Delegates to AuthProvider so auth state stays in a single place.
 */
export function useRegister() {
  const { register, isPending, error } = useAuth();
  return { register, isPending, error };
}
