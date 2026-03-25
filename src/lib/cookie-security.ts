import type { NextRequest } from "next/server";

/**
 * Controls whether auth cookies should use the Secure flag.
 *
 * Behavior:
 * - `COOKIE_SECURE=true|false` explicitly forces the behavior.
 * - Otherwise, we infer from request protocol/forwarded proto.
 */
export function shouldUseSecureCookies(request: NextRequest): boolean {
  const forced = process.env.COOKIE_SECURE;

  if (forced === "true") return true;
  if (forced === "false") return false;

  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (forwardedProto) {
    const proto = forwardedProto.split(",")[0]?.trim().toLowerCase();
    return proto === "https";
  }

  return request.nextUrl.protocol === "https:";
}
