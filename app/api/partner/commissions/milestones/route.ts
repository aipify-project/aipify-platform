import { NextResponse } from "next/server";
import { getPartnerCommissionsMilestones } from "@/lib/core/partner-commissions";
import { parsePartnerCommissionsMilestones } from "@/lib/partner-commissions";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getPartnerCommissionsMilestones(supabase);
    const parsed = parsePartnerCommissionsMilestones(data);
    if (!parsed) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load commission milestones" }, { status: 500 });
  }
}
