import { NextResponse } from "next/server";
import { getPartnerSettlements } from "@/lib/core/partner-settlements";
import { parsePartnerSettlementsOverview } from "@/lib/partner-settlements";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getPartnerSettlements(supabase);
    const parsed = parsePartnerSettlementsOverview(data);
    if (!parsed) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load settlements" }, { status: 500 });
  }
}
