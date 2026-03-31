import { NextRequest, NextResponse } from "next/server";

const N8N_BASE = "http://localhost:5678";

// Allow this route up to 6 minutes on serverless hosts (Vercel etc.)
export const maxDuration = 360;

async function proxy(req: NextRequest, path: string[]) {
  const targetUrl = `${N8N_BASE}/webhook/${path.join("/")}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const sig = req.headers.get("x-webhook-signature");
  if (sig) headers["x-webhook-signature"] = sig;

  const body = req.method !== "GET" ? await req.text() : undefined;

  // 6-minute timeout on the server → n8n leg (banner generation takes 2-3 min)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6 * 60 * 1000);

  try {
    const res = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      signal: controller.signal,
    });

    const text = await res.text();

    return new NextResponse(text || "{}", {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return new NextResponse(
        JSON.stringify({ error: true, message: "Request timed out after 6 minutes" }),
        { status: 504, headers: { "Content-Type": "application/json" } }
      );
    }
    return new NextResponse(
      JSON.stringify({ error: true, message: String(err) }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxy(req, path);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxy(req, path);
}
