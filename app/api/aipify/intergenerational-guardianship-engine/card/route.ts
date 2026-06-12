import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseIntergenerationalGuardianshipCard } from "@/lib/aipify/intergenerational-guardianship-engine";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_intergenerational_guardianship_engine_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseIntergenerationalGuardianshipCard(data));
  } catch {
    return NextResponse.json(
      { error: "Failed to load Intergenerational Guardianship card" },
      { status: 500 },
    );
  }
}
