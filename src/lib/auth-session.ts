/**
 * Thin client-side helpers for managing the HttpOnly auth session cookie.
 *
 * The cookie cannot be read or written by JavaScript — all mutations go through
 * the Next.js Route Handlers which have server-side cookie access.
 *
 * These functions are intentionally framework-agnostic (plain fetch) so they
 * can be called from anywhere: React components, hooks, or the Axios interceptor.
 */

/** Persists a JWT token in the HttpOnly cookie via the session route. */
export async function persistSession(token: string): Promise<void> {
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;
    throw new Error(payload?.message ?? "Failed to persist auth session");
  }
}

/**
 * Clears the HttpOnly session cookie via the logout route.
 * Safe to call even if the session no longer exists — errors are silenced.
 */
export async function clearSession(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
}
