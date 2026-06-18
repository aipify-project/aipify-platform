import { NextResponse } from "next/server";
import { parseCompanionMemoryDashboard, parseCompanionMemoryAction } from "@/lib/aipify/companion-memory-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("get_companion_memory_dashboard", {
      p_memory_type: searchParams.get("memory_type") || null,
      p_source:      searchParams.get("source")      || null,
      p_department:  searchParams.get("department")  || null,
      p_status:      searchParams.get("status")      || null,
      p_confidence:  searchParams.get("confidence")  || null,
      p_date_from:   searchParams.get("date_from")   || null,
      p_search:      searchParams.get("search")      || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseCompanionMemoryDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load companion memory" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      title?: string;
      summary?: string;
      content?: string;
      category?: string;
      memory_type?: string;
      memory_scope?: string;
      source_key?: string;
      department?: string;
      confidence?: string;
      reason?: string;
    };

    const { data, error } = await supabase.rpc("create_companion_memory", {
      p_title:        body.title        ?? "",
      p_summary:      body.summary      ?? "",
      p_content:      body.content      ?? "",
      p_category:     body.category     ?? null,
      p_memory_type:  body.memory_type  ?? null,
      p_memory_scope: body.memory_scope ?? null,
      p_source_key:   body.source_key   ?? null,
      p_department:   body.department   ?? null,
      p_confidence:   body.confidence   ?? null,
      p_reason:       body.reason       ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    const result = parseCompanionMemoryAction(data);
    if (!result.ok) return NextResponse.json({ error: result.error ?? "Failed" }, { status: 403 });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to create memory" }, { status: 500 });
  }
}
