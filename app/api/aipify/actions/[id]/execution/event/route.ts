import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

type EventBody = {
  event_type?: string;
  description?: string;
  metadata?: Record<string, unknown>;
};

const NOTIFY_EVENTS: Record<string, { title: string; priority: string }> = {
  execution_update: { title: "Execution update posted", priority: "medium" },
  execution_blocker: { title: "Action blocked", priority: "high" },
  ownership_assigned: { title: "Ownership changed", priority: "medium" },
  dependency_resolved: { title: "Dependency resolved", priority: "medium" },
  execution_learning: { title: "Execution completed — learning captured", priority: "low" },
  assistance_requested: { title: "Assistance requested", priority: "medium" },
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as EventBody;
    if (!body.event_type) return NextResponse.json({ error: "event_type required" }, { status: 400 });

    const { data, error } = await supabase.rpc("record_action_center_execution_event", {
      p_action_id: id,
      p_event_type: body.event_type,
      p_description: body.description ?? "",
      p_metadata: body.metadata ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const notify = NOTIFY_EVENTS[body.event_type];
    if (notify) {
      await supabase.rpc("send_notification", {
        p_user_id: null,
        p_category: "action_required",
        p_priority: notify.priority,
        p_title: notify.title,
        p_message: body.description ?? null,
        p_action_url: "/app/action-center",
        p_recommended_action: "Review in Execution Coordination Center",
        p_delivery_channels: ["in_app", "dashboard"],
        p_metadata: { action_id: id, event_type: body.event_type },
      });
    }

    return NextResponse.json(data ?? { recorded: true });
  } catch {
    return NextResponse.json({ error: "Failed to record execution event" }, { status: 500 });
  }
}
