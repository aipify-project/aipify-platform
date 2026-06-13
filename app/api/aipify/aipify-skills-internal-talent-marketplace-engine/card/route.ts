import { NextResponse } from "next/server";
import { parseAipifySkillsInternalTalentMarketplaceEngineCard } from "@/lib/aipify/aipify-skills-internal-talent-marketplace-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_aipify_skills_internal_talent_marketplace_engine_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseAipifySkillsInternalTalentMarketplaceEngineCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load card" }, { status: 500 });
  }
}
