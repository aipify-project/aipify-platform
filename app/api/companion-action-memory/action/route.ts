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
      action?: "update_settings" | "record" | "confirm" | "reset";
      memory_enabled?: boolean;
      enabled_categories?: string[];
      disabled_categories?: string[];
      event_type?: string;
      memory_key?: string;
      suggestion_key?: string;
      validation_key?: string;
      decision?: "accept" | "reject" | "dismiss" | "delete" | "disable_category";
      description?: string;
      category?: string;
      confirmed?: boolean;
    };

    if (body.action === "update_settings") {
      const { data, error } = await supabase.rpc("update_companion_action_memory_settings", {
        p_payload: {
          memory_enabled: body.memory_enabled,
          enabled_categories: body.enabled_categories,
          disabled_categories: body.disabled_categories,
        },
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "confirm" && body.memory_key) {
      const { data, error } = await supabase.rpc("confirm_action_memory_preference", {
        p_memory_key: body.memory_key,
        p_confirmed: body.confirmed ?? true,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "reset") {
      const { data, error } = await supabase.rpc("record_companion_action_memory_event", {
        p_payload: { event_type: "memory_reset" },
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    const { data, error } = await supabase.rpc("record_companion_action_memory_event", {
      p_payload: {
        event_type: body.event_type ?? body.decision ?? "preference_updated",
        memory_key: body.memory_key,
        suggestion_key: body.suggestion_key,
        validation_key: body.validation_key,
        decision: body.decision,
        description: body.description,
        category: body.category,
      },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process action memory event" }, { status: 500 });
  }
}
