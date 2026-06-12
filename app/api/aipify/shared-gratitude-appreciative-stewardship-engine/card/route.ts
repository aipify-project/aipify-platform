import { NextResponse } from "next/server";
import { parseSharedGratitudeAppreciativeStewardshipEngineCard } from "@/lib/aipify/shared-gratitude-appreciative-stewardship-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_humanity_shared_gratitude_appreciative_stewardship_engine_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseSharedGratitudeAppreciativeStewardshipEngineCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load card" }, { status: 500 });
  }
}
