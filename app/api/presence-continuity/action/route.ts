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
      action?: "update_settings" | "resume" | "event";
      presence_state?: string;
      greeting_style?: string;
      briefing_frequency?: string;
      presence_level?: string;
      focus_mode_behavior?: string;
      since_last_session_detail?: string;
      event_type?: string;
      summary?: string;
      insight_key?: string;
    };

    if (body.action === "resume") {
      const { data, error } = await supabase.rpc("resume_companion_session");
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "update_settings") {
      const { data, error } = await supabase.rpc("update_presence_continuity_settings", {
        p_payload: {
          presence_state: body.presence_state,
          greeting_style: body.greeting_style,
          briefing_frequency: body.briefing_frequency,
          presence_level: body.presence_level,
          focus_mode_behavior: body.focus_mode_behavior,
          since_last_session_detail: body.since_last_session_detail,
        },
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    const { data, error } = await supabase.rpc("record_presence_continuity_event", {
      p_payload: {
        event_type: body.event_type ?? "session_resumed",
        summary: body.summary,
        insight_key: body.insight_key,
      },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process presence action" }, { status: 500 });
  }
}
