import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json().catch(() => ({}))) as {
      action_type?: string;
      target_type?: string;
      target_id?: string;
      metadata?: Record<string, unknown>;
    };

    const actionType = body.action_type?.trim();
    if (!actionType) {
      return NextResponse.json({ error: "action_type required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("record_super_admin_audit_event", {
      p_action_type: actionType,
      p_target_type: body.target_type ?? null,
      p_target_id: body.target_id ?? null,
      p_metadata: body.metadata ?? {},
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ id: data });
  } catch {
    return NextResponse.json({ error: "Failed to record audit event" }, { status: 500 });
  }
}
