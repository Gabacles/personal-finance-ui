import { type NextRequest, NextResponse } from "next/server";
import { shouldUseSecureCookies } from "@/lib/cookie-security";

// ---------------------------------------------------------------------------
// Route classification
// ---------------------------------------------------------------------------

const PUBLIC_ROUTES = ["/login", "/register"];
const PROTECTED_PREFIX = ["/dashboard"];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIX.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isPublicAuth(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

// ---------------------------------------------------------------------------
// Token validation
//
// We only decode the payload to check the `exp` claim.
// Cryptographic signature verification is always done by the external API —
// every real API call still passes through the authenticated proxy.
//
// NOTE: middleware runs in the Edge Runtime — Node.js `Buffer` is NOT available.
// Use the Web API `atob` for Base64URL decoding.
// ---------------------------------------------------------------------------

function isTokenValid(token: string): boolean {
  try {
    // A JWT is three Base64URL segments separated by dots.
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    // Base64URL → standard Base64 (pad to a multiple of 4) → JSON
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const payload = JSON.parse(atob(padded)) as Record<string, unknown>;

    const exp = payload.exp;
    if (typeof exp !== "number") return true; // no expiry claim → treat as valid

    return Date.now() / 1000 < exp;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const secure = shouldUseSecureCookies(request);

  const token = request.cookies.get("token")?.value ?? null;
  const authenticated = token !== null && isTokenValid(token);

  // Expired token — clear the cookie and redirect to login
  if (token && !authenticated) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set("token", "", {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return response;
  }

  // Unauthenticated user trying to access a protected page → /login
  if (!authenticated && isProtected(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user visiting login/register → /dashboard
  if (authenticated && isPublicAuth(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// ---------------------------------------------------------------------------
// Matcher — exclude static files, images, and the internal API routes so the
// middleware only runs on page navigation requests.
// ---------------------------------------------------------------------------

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
