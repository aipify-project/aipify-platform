import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseBlueprintApplyResult } from "@/lib/aipify/industry-blueprints/parse";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json().catch(() => ({}))) as {
      approve?: boolean;
      recommendation_ids?: string[];
    };
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("apply_industry_blueprint", {
      p_blueprint_key: id,
      p_approve: Boolean(body.approve),
      p_recommendation_ids: body.recommendation_ids?.length ? body.recommendation_ids : null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseBlueprintApplyResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to apply industry blueprint" }, { status: 500 });
  }
}
