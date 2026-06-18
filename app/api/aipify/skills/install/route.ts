import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseSkillInstallResult } from "@/lib/aipify/skills/parse";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { skill_key?: string; approve?: boolean };
    if (!body.skill_key) {
      return NextResponse.json({ error: "skill_key required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("install_tenant_skill", {
      p_skill_key: body.skill_key,
      p_approve: Boolean(body.approve),
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseSkillInstallResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to install skill" }, { status: 500 });
  }
}
