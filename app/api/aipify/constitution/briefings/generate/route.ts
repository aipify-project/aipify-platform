import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseConstitutionBriefingResult } from "@/lib/aipify/constitution";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("generate_aipify_constitution_briefing");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseConstitutionBriefingResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to generate constitution briefing" }, { status: 500 });
  }
}
