import { NextResponse } from "next/server";
import { getAipifyHostsTrustComplianceDashboard } from "@/lib/core/aipify-hosts-trust-compliance";
import { parseAipifyHostsTrustComplianceDashboard } from "@/lib/aipify/aipify-hosts-trust-compliance";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getAipifyHostsTrustComplianceDashboard(supabase);
    const parsed = parseAipifyHostsTrustComplianceDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load trust & compliance dashboard" }, { status: 500 });
  }
}
