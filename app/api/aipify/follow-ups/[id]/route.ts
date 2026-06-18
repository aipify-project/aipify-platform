import { NextResponse } from "next/server";
import { parseFollowUpAction } from "@/lib/aipify/companion-follow-up/parse";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      status?: string;
      priority?: string;
      assigned_to?: string;
      due_date?: string;
      recommended_action?: string;
      action?: string;
      reminder_type?: string;
      reminder_date?: string;
    };

    const { data, error } = await supabase.rpc("update_companion_follow_up", {
      p_follow_up_id:       id,
      p_status:             body.status ?? null,
      p_priority:           body.priority ?? null,
      p_assigned_to:        body.assigned_to ?? null,
      p_due_date:           body.due_date ?? null,
      p_recommended_action: body.recommended_action ?? null,
      p_action:             body.action ?? null,
      p_reminder_type:      body.reminder_type ?? null,
      p_reminder_date:      body.reminder_date ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    const result = parseFollowUpAction(data);
    if (!result.ok) return NextResponse.json({ error: result.error ?? "Failed" }, { status: 403 });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to update follow-up" }, { status: 500 });
  }
}
