import { NextResponse } from "next/server";
import { recalculatePartnerCommissions } from "@/lib/core/partner-commissions";
import { parsePartnerCommissionsDashboard } from "@/lib/partner-commissions";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await recalculatePartnerCommissions(supabase);
    const parsed = parsePartnerCommissionsDashboard(data);
    if (!parsed) return NextResponse.json({ has_access: false }, { status: 403 });
    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to recalculate commissions";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
