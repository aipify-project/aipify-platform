import { NextResponse } from "next/server";
import {
  parseOpportunityDetail,
  parseOpportunityActionResult,
} from "@/lib/app-portal/strategic-opportunities";
import { createClient } from "@/lib/supabase/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_strategic_opportunity", {
      p_opportunity_id: id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseOpportunityDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load opportunity" }, { status: 500 });
  }
}

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      status?: string;
      review_notes?: string;
      strategic_priority?: string;
      leadership_owner?: string;
    };

    const { data, error } = await supabase.rpc("upsert_app_portal_strategic_opportunity", {
      p_opportunity_id:    id,
      p_title:             null,
      p_description:       null,
      p_category:          null,
      p_status:            body.status            ?? null,
      p_strategic_priority:body.strategic_priority ?? null,
      p_leadership_owner:  body.leadership_owner  ?? null,
      p_time_horizon:      null,
      p_review_notes:      body.review_notes      ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseOpportunityActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to update opportunity" }, { status: 500 });
  }
}
