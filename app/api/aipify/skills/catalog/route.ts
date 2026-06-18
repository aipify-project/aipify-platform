import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseSkillCatalog } from "@/lib/aipify/skills/parse";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const category = request.nextUrl.searchParams.get("category");
    const { data, error } = await supabase.rpc("get_skill_catalog", { p_category: category });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseSkillCatalog(data));
  } catch {
    return NextResponse.json({ error: "Failed to load catalog" }, { status: 500 });
  }
}
