import { NextResponse } from "next/server";
import { getAipifyHostsReferralDashboard } from "@/lib/core/aipify-hosts-referral";
import { parseAipifyHostsReferralDashboard } from "@/lib/aipify/aipify-hosts-referral";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getAipifyHostsReferralDashboard(supabase);
    const parsed = parseAipifyHostsReferralDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load referral dashboard" }, { status: 500 });
  }
}
