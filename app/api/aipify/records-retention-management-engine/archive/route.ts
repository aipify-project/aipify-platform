import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("search_archived_records", {
      p_source_entity_type: searchParams.get("source_entity_type"),
      p_query: searchParams.get("query"),
      p_limit: Number(searchParams.get("limit") ?? 50),
      p_offset: Number(searchParams.get("offset") ?? 0),
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to search archived records" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      source_entity_type?: string;
      source_entity_id?: string;
      policy_id?: string;
      metadata?: Record<string, unknown>;
      capture_memory?: boolean;
    };

    if (!body.source_entity_type || !body.source_entity_id) {
      return NextResponse.json(
        { error: "source_entity_type and source_entity_id required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc("archive_record", {
      p_source_entity_type: body.source_entity_type,
      p_source_entity_id: body.source_entity_id,
      p_policy_id: body.policy_id ?? null,
      p_metadata: body.metadata ?? {},
      p_capture_memory: body.capture_memory ?? false,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to archive record" }, { status: 500 });
  }
}
