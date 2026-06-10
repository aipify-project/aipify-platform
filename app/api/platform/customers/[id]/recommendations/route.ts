import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseIntelligenceFoundation } from "@/lib/platform/intelligence-foundation";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase.rpc("get_customer_intelligence_foundation", {
      p_tenant_id: id,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const foundation = parseIntelligenceFoundation(data);
    return NextResponse.json({ recommendations: foundation.ai_recommendations });
  } catch {
    return NextResponse.json({ error: "Failed to load recommendations" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: _id } = await context.params;
    const body = await request.json();
    const recommendationId = body.recommendationId as string;

    if (!recommendationId) {
      return NextResponse.json({ error: "recommendationId required" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase.rpc("dismiss_ai_recommendation", {
      p_recommendation_id: recommendationId,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to dismiss recommendation" }, { status: 500 });
  }
}
