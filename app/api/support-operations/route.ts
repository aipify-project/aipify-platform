import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_customer_support_operations_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Support operations request failed" }, { status: 500 });
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

    const { error } = await supabase.rpc("update_aso_settings", {
      p_autonomy_level: body.autonomy_level ?? null,
      p_proactive_support_enabled: body.proactive_support_enabled ?? null,
      p_knowledge_gap_detection_enabled: body.knowledge_gap_detection_enabled ?? null,
      p_self_healing_enabled: body.self_healing_enabled ?? null,
      p_human_collaboration_mode: body.human_collaboration_mode ?? null,
      p_channels_enabled: body.channels_enabled ?? null,
      p_confidence_auto_reply_threshold: body.confidence_auto_reply_threshold ?? null,
      p_confidence_draft_threshold: body.confidence_draft_threshold ?? null,
      p_privacy_settings: body.privacy_settings ?? null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const { data: center, error: centerError } = await supabase.rpc(
      "get_customer_support_operations_center"
    );
    if (centerError) return NextResponse.json({ error: centerError.message }, { status: 400 });

    return NextResponse.json(center);
  } catch {
    return NextResponse.json({ error: "Support operations update failed" }, { status: 500 });
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

    if (body.action === "proactive_check") {
      const { data, error } = await supabase.rpc("run_proactive_support_check");
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Support operations action failed" }, { status: 500 });
  }
}
