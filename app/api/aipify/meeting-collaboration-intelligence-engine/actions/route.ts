import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      action_id?: string;
      assigned_user_id?: string;
      due_date?: string;
      status?: string;
    };

    if (body.action === "mark_overdue") {
      const { data, error } = await supabase.rpc("mark_action_overdue", {
        p_action_id: body.action_id ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "update_status") {
      if (!body.action_id || !body.status) {
        return NextResponse.json({ error: "action_id and status required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("update_action_item_status", {
        p_action_id: body.action_id,
        p_status: body.status,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (!body.action_id || !body.assigned_user_id) {
      return NextResponse.json({ error: "action_id and assigned_user_id required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("assign_meeting_action", {
      p_action_id: body.action_id,
      p_assigned_user_id: body.assigned_user_id,
      p_due_date: body.due_date ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process action item" }, { status: 500 });
  }
}
