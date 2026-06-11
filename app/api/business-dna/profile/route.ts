import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_customer_business_dna_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Business DNA profile request failed" }, { status: 500 });
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

    const { error: profileError } = await supabase.rpc("update_business_dna_profile", {
      p_company_name: body.company_name ?? null,
      p_industry: body.industry ?? null,
      p_business_description: body.business_description ?? null,
      p_primary_language: body.primary_language ?? null,
      p_supported_languages: body.supported_languages ?? null,
      p_tone_of_voice: body.tone_of_voice ?? null,
      p_support_style: body.support_style ?? null,
      p_risk_level: body.risk_level ?? null,
      p_profile_status: body.profile_status ?? null,
    });

    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });

    if (body.settings && typeof body.settings === "object") {
      const s = body.settings as Record<string, unknown>;
      const { error: settingsError } = await supabase.rpc("update_bde_settings", {
        p_human_review_mode: s.human_review_mode ?? null,
        p_automation_enabled: s.automation_enabled ?? null,
        p_high_confidence_auto_draft: s.high_confidence_auto_draft ?? null,
        p_learn_from_approved_replies: s.learn_from_approved_replies ?? null,
        p_import_support_history: s.import_support_history ?? null,
        p_connected_systems: s.connected_systems ?? null,
        p_email_channel_provider: s.email_channel_provider ?? null,
        p_email_channel_status: s.email_channel_status ?? null,
        p_fallback_language: s.fallback_language ?? null,
        p_privacy_settings: s.privacy_settings ?? null,
      });
      if (settingsError) return NextResponse.json({ error: settingsError.message }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("get_customer_business_dna_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Business DNA profile update failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { action?: string };
    if (body.action === "seed_from_install") {
      const { data, error } = await supabase.rpc("seed_business_dna_from_install");
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Business DNA action failed" }, { status: 500 });
  }
}
