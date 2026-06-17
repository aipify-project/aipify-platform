import { NextResponse } from "next/server";
import { getPartnerOpportunitiesForecast } from "@/lib/core/partner-opportunities";
import { parsePartnerOpportunitiesForecast } from "@/lib/partner-opportunities";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getPartnerOpportunitiesForecast(supabase);
    const parsed = parsePartnerOpportunitiesForecast(data);
    if (!parsed) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load forecast" }, { status: 500 });
  }
}
