import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { shouldUseSecureCookies } from "@/lib/cookie-security";

/**
 * Clears the HttpOnly token cookie, effectively logging the user out.
 */
export async function POST(request: NextRequest) {
  const response = NextResponse.json({ ok: true });
  const secure = shouldUseSecureCookies(request);

  response.cookies.set("token", "", {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
