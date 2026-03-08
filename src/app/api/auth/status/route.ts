import { NextRequest, NextResponse } from "next/server";

/**
 * Lightweight session check — reads the HttpOnly token cookie without
 * exposing its value to the client. Used by AuthProvider on mount to
 * restore authentication state after a page refresh.
 */
export async function GET(request: NextRequest) {
  const hasToken = !!request.cookies.get("token")?.value;
  return NextResponse.json({ authenticated: hasToken });
}
