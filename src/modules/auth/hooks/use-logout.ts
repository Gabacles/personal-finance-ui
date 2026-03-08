"use client";

import { useAuth } from "@/providers/AuthProvider";

/**
 * Convenience hook for logout triggers (header button, user menu, etc.).
 * Returns a `logout` function that clears the session cookie, wipes the
 * query cache, and redirects to /login.
 *
 * Usage:
 *   const { logout } = useLogout();
 *   <button onClick={logout}>Sign out</button>
 */
export function useLogout() {
  const { logout } = useAuth();
  return { logout };
}
