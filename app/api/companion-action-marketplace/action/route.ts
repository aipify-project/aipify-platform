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
      action?: "install" | "request" | "update_preferences" | "event";
      provider_key?: string;
      action_category?: string;
      message?: string;
      usage_context?: string;
      event_type?: string;
      summary?: string;
    };

    if (body.action === "install") {
      if (!body.provider_key) {
        return NextResponse.json({ error: "provider_key required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("install_companion_action_provider", {
        p_provider_key: body.provider_key,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "request") {
      const { data, error } = await supabase.rpc("request_companion_action", {
        p_payload: {
          provider_key: body.provider_key,
          action_category: body.action_category,
          message: body.message,
        },
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "update_preferences") {
      const { data, error } = await supabase.rpc("update_companion_action_preferences", {
        p_payload: { usage_context: body.usage_context },
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    const { data, error } = await supabase.rpc("record_companion_action_event", {
      p_payload: {
        event_type: body.event_type ?? "request_initiated",
        provider_key: body.provider_key,
        summary: body.summary,
      },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process marketplace action" }, { status: 500 });
  }
}
