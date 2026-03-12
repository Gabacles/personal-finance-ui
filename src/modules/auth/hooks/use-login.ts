"use client";

import { useAuth } from "@/providers/AuthProvider";

/**
 * Convenience hook for login forms.
 * Delegates to AuthProvider so auth state stays in a single place.
 */
export function useLogin() {
  const { login, isPending, error } = useAuth();
  return { login, isPending, error };
}
