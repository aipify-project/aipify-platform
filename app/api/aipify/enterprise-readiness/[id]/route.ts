import { NextResponse } from "next/server";
import { parseReadinessDetail } from "@/lib/app-portal/enterprise-readiness";
import { createClient } from "@/lib/supabase/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_enterprise_readiness_assessment", {
      p_assessment_id: id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseReadinessDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load readiness assessment" }, { status: 500 });
  }
}
