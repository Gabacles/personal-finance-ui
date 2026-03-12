import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Receives the JWT token from the client after a successful login/register,
 * and stores it in an HttpOnly cookie so it is never accessible to JavaScript.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const token =
    typeof body === "string"
      ? body
      : ((body as Record<string, unknown>)?.token ??
          (body as Record<string, unknown>)?.accessToken);

  if (!token || typeof token !== "string") {
    return NextResponse.json({ message: "Missing token" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  return response;
}
