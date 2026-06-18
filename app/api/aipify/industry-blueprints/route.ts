import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseIndustryBlueprints } from "@/lib/aipify/industry-blueprints/parse";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const industry = request.nextUrl.searchParams.get("industry");
    const size = request.nextUrl.searchParams.get("size");
    const { data, error } = await supabase.rpc("list_industry_blueprints", {
      p_industry: industry,
      p_size: size,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ blueprints: parseIndustryBlueprints(data) });
  } catch {
    return NextResponse.json({ error: "Failed to list industry blueprints" }, { status: 500 });
  }
}
