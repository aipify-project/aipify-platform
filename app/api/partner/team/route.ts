import { NextResponse } from "next/server";
import { getPartnerPortalTeam } from "@/lib/core/partner-portal";
import { parsePartnerPortalTeam } from "@/lib/partner-portal";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getPartnerPortalTeam(supabase);
    const parsed = parsePartnerPortalTeam(data);
    if (!parsed) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load partner team" }, { status: 500 });
  }
}
