import { NextResponse } from "next/server";
import { evaluateModerationImage } from "@/lib/aipify/moderation/evaluate";
import { parseModerationSubmitResponse } from "@/lib/aipify/moderation/parse";
import type { ModerationImageInput, ModerationSourceType } from "@/lib/aipify/moderation/types";
import { createClient } from "@/lib/supabase/server";

const SOURCE_TYPES: ModerationSourceType[] = [
  "profile_image",
  "album_image",
  "chat_attachment",
  "marketplace_image",
  "verification_image",
  "support_attachment",
  "product_image",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const imageUrl = typeof body.image_url === "string" ? body.image_url.trim() : "";
    const sourceType = typeof body.source_type === "string" ? body.source_type : "profile_image";

    if (!imageUrl) {
      return NextResponse.json({ error: "image_url is required" }, { status: 400 });
    }
    if (!SOURCE_TYPES.includes(sourceType as ModerationSourceType)) {
      return NextResponse.json({ error: "Invalid source_type" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const input: ModerationImageInput = {
      image_url: imageUrl,
      source_type: sourceType as ModerationSourceType,
      source_id: typeof body.source_id === "string" ? body.source_id : undefined,
      user_id: typeof body.user_id === "string" ? body.user_id : undefined,
      source_system: typeof body.source_system === "string" ? body.source_system : "aipify",
      policy_context:
        body.policy_context && typeof body.policy_context === "object"
          ? body.policy_context
          : undefined,
      analysis_signals:
        body.analysis_signals && typeof body.analysis_signals === "object"
          ? body.analysis_signals
          : undefined,
      is_reported: body.is_reported === true,
    };

    const evaluation = evaluateModerationImage(input);

    const { data, error } = await supabase.rpc("submit_moderation_image", {
      p_payload: {
        image_url: imageUrl,
        source_type: sourceType,
        source_id: input.source_id,
        user_id: input.user_id,
        source_system: input.source_system,
        is_reported: input.is_reported,
        decision: evaluation.decision,
        confidence: evaluation.confidence,
        categories: evaluation.categories,
        risk_flags: evaluation.risk_flags,
        reason_summary: evaluation.reason_summary,
        suggested_action: evaluation.suggested_action,
        is_high_risk: evaluation.is_high_risk,
        priority: evaluation.priority,
        metadata: { policy_context: input.policy_context ?? {} },
      },
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parseModerationSubmitResponse(data);
    return NextResponse.json({
      ...parsed,
      decision: evaluation.decision,
      confidence: evaluation.confidence,
      categories: evaluation.categories,
      risk_flags: evaluation.risk_flags,
      reason_summary: evaluation.reason_summary,
      suggested_action: evaluation.suggested_action,
      moderation_result_id: parsed.moderation_result_id,
    });
  } catch {
    return NextResponse.json({ error: "Failed to moderate image" }, { status: 500 });
  }
}
