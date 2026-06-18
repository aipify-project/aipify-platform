import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseValidationActionResult } from "@/lib/aipify/outcomes/parse";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json().catch(() => ({}));
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("validate_outcome_hypothesis", {
      p_hypothesis_id: id,
      p_validation_status: body.validation_status ?? "in_review",
      p_findings: body.findings ?? "Validation review recorded.",
      p_lessons_learned: body.lessons_learned ?? null,
      p_what_happened: body.what_happened ?? null,
      p_why_it_happened: body.why_it_happened ?? null,
      p_what_should_change: body.what_should_change ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseValidationActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to validate hypothesis" }, { status: 500 });
  }
}
