import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseBlueprintDetail } from "@/lib/aipify/industry-blueprints";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_industry_blueprint", { p_blueprint_key: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const detail = parseBlueprintDetail(data);
    if (!detail) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(detail);
  } catch {
    return NextResponse.json({ error: "Failed to load industry blueprint" }, { status: 500 });
  }
}
