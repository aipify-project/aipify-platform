import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseBlueprintPrecheck } from "@/lib/aipify/industry-blueprints/parse";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("precheck_blueprint_apply", { p_blueprint_key: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseBlueprintPrecheck(data));
  } catch {
    return NextResponse.json({ error: "Failed to precheck blueprint apply" }, { status: 500 });
  }
}
