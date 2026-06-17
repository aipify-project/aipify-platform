import { NextResponse } from "next/server";
import { parseReadinessActionResult } from "@/lib/app-portal/enterprise-readiness";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      assessment_id?: string;
      review_notes?: string;
      new_score?: number;
    };

    const { data, error } = await supabase.rpc("review_app_portal_enterprise_readiness", {
      p_assessment_id: body.assessment_id ?? null,
      p_action:        body.action        ?? null,
      p_review_notes:  body.review_notes  ?? null,
      p_new_score:     body.new_score     ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseReadinessActionResult(data));
  } catch {
    return NextResponse.json({ error: "Readiness review failed" }, { status: 500 });
  }
}
