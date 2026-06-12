import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseHumanPotentialCard } from "@/lib/aipify/human-potential-augmented-work-engine";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_human_potential_augmented_work_engine_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseHumanPotentialCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load human potential card" }, { status: 500 });
  }
}
