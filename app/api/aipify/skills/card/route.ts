import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseSkillStoreCard } from "@/lib/aipify/skills";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_skill_store_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseSkillStoreCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load skill store card" }, { status: 500 });
  }
}
