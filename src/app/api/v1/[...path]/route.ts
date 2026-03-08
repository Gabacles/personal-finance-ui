import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL;

async function proxyHandler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  if (!EXTERNAL_API_URL) {
    return NextResponse.json(
      { message: "EXTERNAL_API_URL is not configured" },
      { status: 500 },
    );
  }

  const { path } = await params;
  const externalUrl = new URL(`/api/v1/${path.join("/")}`, EXTERNAL_API_URL);

  request.nextUrl.searchParams.forEach((value, key) => {
    externalUrl.searchParams.append(key, value);
  });

  const headers = new Headers();

  const authorization = request.headers.get("authorization");
  if (authorization) {
    headers.set("authorization", authorization);
  }

  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("content-type", contentType);
  }

  const init: RequestInit = {
    method: request.method,
    headers,
  };

  if (["POST", "PUT", "PATCH"].includes(request.method)) {
    init.body = await request.text();
  }

  try {
    const response = await fetch(externalUrl, init);

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const responseContentType = response.headers.get("content-type");

    if (responseContentType?.includes("application/json")) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: { "content-type": responseContentType || "text/plain" },
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to reach external API" },
      { status: 502 },
    );
  }
}

export const GET = proxyHandler;
export const POST = proxyHandler;
export const PUT = proxyHandler;
export const PATCH = proxyHandler;
export const DELETE = proxyHandler;
