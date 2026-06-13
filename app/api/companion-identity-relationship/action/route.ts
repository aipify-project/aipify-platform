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
      action?: "update_preferences" | "answer_review" | "event";
      companion_display_name?: string;
      relationship_mode?: string;
      tone_preference?: string;
      proactivity_level?: string;
      humor_preference?: string;
      notification_style?: string;
      encouragement_preference?: string;
      briefing_style?: string;
      personalization_enabled?: boolean;
      review_key?: string;
      user_response?: string;
      event_type?: string;
      summary?: string;
    };

    if (body.action === "update_preferences") {
      const { data, error } = await supabase.rpc("update_companion_identity_preferences", {
        p_payload: {
          companion_display_name: body.companion_display_name,
          relationship_mode: body.relationship_mode,
          tone_preference: body.tone_preference,
          proactivity_level: body.proactivity_level,
          humor_preference: body.humor_preference,
          notification_style: body.notification_style,
          encouragement_preference: body.encouragement_preference,
          briefing_style: body.briefing_style,
          personalization_enabled: body.personalization_enabled,
        },
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "answer_review") {
      const { data, error } = await supabase.rpc("record_companion_relationship_review", {
        p_payload: {
          review_key: body.review_key,
          user_response: body.user_response,
        },
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    const { data, error } = await supabase.rpc("record_companion_identity_event", {
      p_payload: {
        event_type: body.event_type ?? "preference_changed",
        summary: body.summary,
      },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to process companion identity action" },
      { status: 500 },
    );
  }
}
