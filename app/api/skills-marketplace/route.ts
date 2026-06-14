import { NextResponse } from "next/server";
import { parseSkillsMarketplaceExperience } from "@/lib/skills-marketplace";
import type { SkillsMarketplaceScope } from "@/lib/skills-marketplace/types";
import { createClient } from "@/lib/supabase/server";

const SCOPES = new Set<SkillsMarketplaceScope>(["customer", "platform"]);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = (searchParams.get("scope") ?? "customer") as SkillsMarketplaceScope;

    if (!SCOPES.has(scope)) {
      return NextResponse.json({ error: "Invalid scope" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_skills_marketplace_experience", {
      p_scope: scope,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 403 });

    const parsed = parseSkillsMarketplaceExperience(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load skills marketplace" }, { status: 500 });
  }
}
