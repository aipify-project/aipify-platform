import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_customer_organizational_memory_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Organizational memory request failed" }, { status: 500 });
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

    if (body.entry_type === "decision") {
      const { data, error } = await supabase.rpc("create_decision_record", {
        p_decision_title: body.decision_title ?? body.title,
        p_decision_summary: body.decision_summary ?? body.summary ?? "",
        p_rationale: body.rationale ?? "",
        p_alternatives_considered: body.alternatives_considered ?? "",
        p_expected_outcome: body.expected_outcome ?? "",
        p_actual_outcome: body.actual_outcome ?? "",
        p_decision_owner: body.decision_owner ?? null,
        p_decision_date: body.decision_date ?? undefined,
        p_visibility_level: body.visibility_level ?? "tenant",
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.entry_type === "lesson") {
      const { data, error } = await supabase.rpc("create_lesson_learned", {
        p_related_project: body.related_project ?? "",
        p_what_worked: body.what_worked ?? "",
        p_what_did_not_work: body.what_did_not_work ?? "",
        p_future_recommendations: body.future_recommendations ?? "",
        p_lesson_date: body.lesson_date ?? undefined,
        p_visibility_level: body.visibility_level ?? "tenant",
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    const { data, error } = await supabase.rpc("create_memory_entry", {
      p_title: body.title,
      p_summary: body.summary ?? "",
      p_detailed_notes: body.detailed_notes ?? "",
      p_category: body.category ?? "operational",
      p_memory_date: body.memory_date ?? undefined,
      p_tags_json: body.tags_json ?? [],
      p_visibility_level: body.visibility_level ?? "personal",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Create memory failed" }, { status: 500 });
  }
}
