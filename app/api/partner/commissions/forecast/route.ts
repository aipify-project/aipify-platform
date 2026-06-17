import { NextResponse } from "next/server";
import { getPartnerCommissionsForecast } from "@/lib/core/partner-commissions";
import { parsePartnerCommissionsForecast } from "@/lib/partner-commissions";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getPartnerCommissionsForecast(supabase);
    const parsed = parsePartnerCommissionsForecast(data);
    if (!parsed) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load commission forecast" }, { status: 500 });
  }
}
