import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_customer_decisions_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Decisions center request failed" }, { status: 500 });
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

    const { data, error } = await supabase.rpc("update_dse_settings", {
      p_recommendations_enabled: body.recommendations_enabled ?? null,
      p_proactivity_level: body.proactivity_level ?? null,
      p_business_domains_enabled: body.business_domains_enabled ?? null,
      p_personal_decisions_enabled: body.personal_decisions_enabled ?? null,
      p_use_historical_data: body.use_historical_data ?? null,
      p_presentation_style: body.presentation_style ?? null,
      p_privacy_settings: body.privacy_settings ?? null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Decision settings update failed" }, { status: 500 });
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
      recommendation_id?: string;
      response?: string;
      notes?: string;
    };

    if (body.action === "analyze") {
      const { data, error } = await supabase.rpc("analyze_decisions");
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "respond" && body.recommendation_id && body.response) {
      const { data, error } = await supabase.rpc("respond_to_decision", {
        p_recommendation_id: body.recommendation_id,
        p_response: body.response,
        p_notes: body.notes ?? "",
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Decision action failed" }, { status: 500 });
  }
}
