import { NextResponse } from "next/server";
import { parseOrganizationDecisionEntries } from "@/lib/aipify/organizational-memory-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_organization_memory_decisions", {
      p_status: searchParams.get("status"),
      p_limit: Number(searchParams.get("limit") ?? 20),
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseOrganizationDecisionEntries(data));
  } catch {
    return NextResponse.json({ error: "Failed to list decisions" }, { status: 500 });
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
    const { data, error } = await supabase.rpc("create_organization_decision_register_entry", {
      p_decision_title: body.decision_title ?? body.title,
      p_rationale: body.rationale ?? "",
      p_alternatives: body.alternatives ?? "",
      p_expected_outcomes: body.expected_outcomes ?? "",
      p_review_date: body.review_date ?? null,
      p_memory_record_id: body.memory_record_id ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to create decision entry" }, { status: 500 });
  }
}
