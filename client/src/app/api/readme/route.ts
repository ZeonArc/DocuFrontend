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

  const url = `${supabaseUrl}/rest/v1/readme_versions?session_id=eq.${encodeURIComponent(sessionId)}&select=content,version&order=created_at.desc&limit=1`;

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
  const version: number = rows[0]?.version ?? 1;

  if (!content) {
    console.warn(`[/api/readme] No content found for session_id=${sessionId}. Row count: ${rows.length}`);
  }

  return NextResponse.json({ content, version });
}

// PATCH /api/readme
// Overwrites the content of the latest readme_versions row for the session.
// Uses service role key (bypasses RLS) so anon-key UPDATE restrictions don't block the write.
// 2-step: GET the latest row's id, then PATCH by id — avoids version-mismatch silent failures.
export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const { session_id, content } = body ?? {};

  if (!session_id || content === undefined) {
    return NextResponse.json({ error: "session_id and content required" }, { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  // Service role key bypasses RLS — required for UPDATE if anon users don't have write access.
  // Falls back to anon key if not configured (will still fail if RLS blocks updates).
  const writeKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

  if (!supabaseUrl || !supabaseAnonKey || supabaseAnonKey === "your_supabase_anon_key_here") {
    return NextResponse.json({ error: "Supabase env vars not configured" }, { status: 500 });
  }

  if (!writeKey) {
    return NextResponse.json({ error: "No Supabase write key configured" }, { status: 500 });
  }

  // Step 1: GET the latest row's id for this session (read with anon key is fine)
  const getUrl = `${supabaseUrl}/rest/v1/readme_versions?session_id=eq.${encodeURIComponent(session_id)}&select=id&order=created_at.desc&limit=1`;
  const getRes = await fetch(getUrl, {
    cache: "no-store",
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json",
    },
  });

  if (!getRes.ok) {
    const detail = await getRes.text().catch(() => "");
    console.error(`[PATCH /api/readme] GET step failed ${getRes.status}: ${detail}`);
    return NextResponse.json({ error: "Supabase GET failed", detail }, { status: 502 });
  }

  const rows = await getRes.json();
  const rowId = rows[0]?.id;

  if (!rowId) {
    console.warn(`[PATCH /api/readme] No row found for session_id=${session_id}`);
    return NextResponse.json({ error: "No row found for session" }, { status: 404 });
  }

  // Step 2: PATCH by id using write key (service role bypasses RLS)
  const patchUrl = `${supabaseUrl}/rest/v1/readme_versions?id=eq.${rowId}`;
  const res = await fetch(patchUrl, {
    method: "PATCH",
    cache: "no-store",
    headers: {
      apikey: writeKey,
      Authorization: `Bearer ${writeKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error(`[PATCH /api/readme] Supabase returned ${res.status}: ${detail}`);
    return NextResponse.json({ error: "Supabase patch failed", detail }, { status: 502 });
  }

  const updated = await res.json().catch(() => []);
  if (!Array.isArray(updated) || updated.length === 0) {
    console.error(`[PATCH /api/readme] PATCH matched 0 rows for id=${rowId}`);
    return NextResponse.json({ error: "Row not updated — check RLS policies" }, { status: 422 });
  }

  return new NextResponse(null, { status: 204 });
}
