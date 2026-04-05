import { NextRequest, NextResponse } from "next/server";

// Prevent Next.js from caching this route — content changes after each generation
export const dynamic = "force-dynamic";

// GET /api/readme?session_id=<id>
// Fetches the latest README content from Supabase for the given session.
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "session_id required" }, { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseKey === "your_supabase_anon_key_here") {
    console.error("[/api/readme] Supabase env vars missing — set SUPABASE_URL and SUPABASE_ANON_KEY in .env.local");
    return NextResponse.json({ error: "Supabase env vars not configured" }, { status: 500 });
  }

  const url = `${supabaseUrl}/rest/v1/readme_versions?session_id=eq.${encodeURIComponent(sessionId)}&select=content&order=created_at.desc&limit=1`;

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`[/api/readme] Supabase returned ${res.status}: ${body}`);
    return NextResponse.json({ error: "Supabase fetch failed", detail: body }, { status: 502 });
  }

  const rows = await res.json();
  const content: string = rows[0]?.content ?? "";

  if (!content) {
    console.warn(`[/api/readme] No content found for session_id=${sessionId}. Row count: ${rows.length}`);
  }

  return NextResponse.json({ content });
}
