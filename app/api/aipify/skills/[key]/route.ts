import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseSkillDetail } from "@/lib/aipify/skills/parse";

type RouteContext = { params: Promise<{ key: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { key } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_skill_detail", { p_skill_key: key });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseSkillDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load skill detail" }, { status: 500 });
  }
}
