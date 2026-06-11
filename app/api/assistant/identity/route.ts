import { NextResponse } from "next/server";
import { IDENTITY_MODE_PRESETS } from "@/lib/identity-engine/dimensions";
import type { IdentityMode } from "@/lib/identity-engine/dimensions";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_customer_identity_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Identity center request failed" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;

    if (body.identity_mode && body.identity_mode !== "custom") {
      const preset = IDENTITY_MODE_PRESETS[body.identity_mode as Exclude<IdentityMode, "custom">];
      if (preset) {
        body.communication_style = body.communication_style ?? preset.communication_style;
        body.proactivity_level = body.proactivity_level ?? preset.proactivity_level;
        body.tone = body.tone ?? preset.tone;
        body.response_length = body.response_length ?? preset.response_length;
        body.social_interaction_style =
          body.social_interaction_style ?? preset.social_interaction_style;
      }
    }

    const { data, error } = await supabase.rpc("update_identity_profile", {
      p_communication_style: body.communication_style ?? null,
      p_proactivity_level: body.proactivity_level ?? null,
      p_tone: body.tone ?? null,
      p_name_usage: body.name_usage ?? null,
      p_notification_style: body.notification_style ?? null,
      p_identity_mode: body.identity_mode ?? null,
      p_social_interaction_style: body.social_interaction_style ?? null,
      p_response_length: body.response_length ?? null,
      p_notification_preferences: body.notification_preferences ?? null,
      p_boundaries: body.boundaries ?? null,
      p_onboarding_completed: body.onboarding_completed ?? null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Identity update failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      observation_id?: string;
      response?: "yes" | "no" | "later";
    };

    if (body.action === "respond_observation" && body.observation_id && body.response) {
      const { data, error } = await supabase.rpc("respond_to_identity_observation", {
        p_observation_id: body.observation_id,
        p_response: body.response === "no" ? "no" : body.response,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Identity action failed" }, { status: 500 });
  }
}
