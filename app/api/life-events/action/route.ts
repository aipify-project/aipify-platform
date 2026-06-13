import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: "update_preferences" | "record_action" | "create_event";
      enabled_categories?: string[];
      proactivity_level?: string;
      suggest_actions_allowed?: boolean;
      execute_actions_allowed?: boolean;
      reminder_timing_default?: string;
      opt_out_all?: boolean;
      action_key?: string;
      event_key?: string;
      insight_key?: string;
      reminder_key?: string;
      decision?: "approve" | "decline" | "complete" | "dismiss" | "snooze";
      title?: string;
      category?: string;
      event_date?: string;
      importance_level?: string;
    };

    if (body.action === "update_preferences") {
      const { data, error } = await supabase.rpc("update_life_events_preferences", {
        p_payload: {
          enabled_categories: body.enabled_categories,
          proactivity_level: body.proactivity_level,
          suggest_actions_allowed: body.suggest_actions_allowed,
          execute_actions_allowed: body.execute_actions_allowed,
          reminder_timing_default: body.reminder_timing_default,
          opt_out_all: body.opt_out_all,
        },
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "create_event") {
      const { data, error } = await supabase.rpc("create_life_event", {
        p_payload: {
          title: body.title,
          category: body.category,
          event_date: body.event_date,
          importance_level: body.importance_level,
        },
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    const { data, error } = await supabase.rpc("record_life_event_action", {
      p_payload: {
        action_key: body.action_key,
        event_key: body.event_key,
        insight_key: body.insight_key,
        reminder_key: body.reminder_key,
        decision: body.decision,
      },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process life events action" }, { status: 500 });
  }
}
