import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      plan_id?: string;
      findings_metadata?: Record<string, unknown>;
      review_date?: string;
      capture_memory?: boolean;
      title?: string;
      severity?: string;
      linked_plan_id?: string;
      metadata?: Record<string, unknown>;
      vulnerability_id?: string;
      status?: string;
    };

    if (body.action === "complete_review") {
      if (!body.plan_id) return NextResponse.json({ error: "plan_id required" }, { status: 400 });
      const { data, error } = await supabase.rpc("complete_resilience_review", {
        p_plan_id: body.plan_id,
        p_findings_metadata: body.findings_metadata ?? {},
        p_review_date: body.review_date ?? null,
        p_capture_memory: body.capture_memory ?? false,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "record_vulnerability") {
      if (!body.title) return NextResponse.json({ error: "title required" }, { status: 400 });
      const { data, error } = await supabase.rpc("record_resilience_vulnerability", {
        p_title: body.title,
        p_severity: body.severity ?? "medium",
        p_linked_plan_id: body.linked_plan_id ?? null,
        p_metadata: body.metadata ?? {},
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "resolve_vulnerability") {
      if (!body.vulnerability_id) {
        return NextResponse.json({ error: "vulnerability_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("resolve_resilience_vulnerability", {
        p_vulnerability_id: body.vulnerability_id,
        p_status: body.status ?? "resolved",
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to process review action" }, { status: 500 });
  }
}
