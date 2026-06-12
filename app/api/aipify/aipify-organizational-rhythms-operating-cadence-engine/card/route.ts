import { NextResponse } from "next/server";
import { parseAipifyOrganizationalRhythmsOperatingCadenceEngineCard } from "@/lib/aipify/aipify-organizational-rhythms-operating-cadence-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_aipify_organizational_rhythms_operating_cadence_engine_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseAipifyOrganizationalRhythmsOperatingCadenceEngineCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load card" }, { status: 500 });
  }
}
