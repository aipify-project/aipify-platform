import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { data, error } = await supabase.rpc("record_workflow_event", {
      p_workflow_key: body.workflow_key,
      p_source_type: body.source_type ?? "api",
      p_source_id: body.source_id ?? null,
      p_event_type: body.event_type ?? "created",
      p_payload: body.payload ?? {},
      p_actor_user_id: body.actor_user_id ?? null,
      p_related_customer_id: body.related_customer_id ?? null,
      p_related_case_id: body.related_case_id ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Workflow event recording failed" }, { status: 500 });
  }
}
