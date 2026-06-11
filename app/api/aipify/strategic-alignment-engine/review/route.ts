import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      objective_id?: string;
      findings?: string;
      review_date?: string;
      participants_metadata?: Record<string, unknown>;
      capture_memory?: boolean;
    };

    if (body.action === "detect_misalignment") {
      const { data, error } = await supabase.rpc("detect_misaligned_initiatives", {
        p_objective_id: body.objective_id ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (!body.objective_id || !body.findings) {
      return NextResponse.json({ error: "objective_id and findings required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("record_strategic_review", {
      p_objective_id: body.objective_id,
      p_findings: body.findings,
      p_review_date: body.review_date ?? null,
      p_participants_metadata: body.participants_metadata ?? {},
      p_capture_memory: body.capture_memory ?? false,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process review action" }, { status: 500 });
  }
}
