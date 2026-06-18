import { NextResponse } from "next/server";
import { parseOrganizationMemoryRecords } from "@/lib/aipify/organizational-memory-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("search_organization_memory_records", {
      p_query: searchParams.get("q") ?? "",
      p_category: searchParams.get("category"),
      p_status: searchParams.get("status") ?? "active",
      p_limit: Number(searchParams.get("limit") ?? 20),
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseOrganizationMemoryRecords(data));
  } catch {
    return NextResponse.json({ error: "Failed to list memory records" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { data, error } = await supabase.rpc("create_organization_memory_record", {
      p_category: body.category ?? "operational_decisions",
      p_title: body.title,
      p_summary: body.summary ?? "",
      p_detailed_context: body.detailed_context ?? {},
      p_source_reference: body.source_reference ?? null,
      p_visibility: body.visibility ?? "internal",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to create memory record" }, { status: 500 });
  }
}
