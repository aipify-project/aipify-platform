import { NextResponse } from "next/server";
import { getPartnerCompliance } from "@/lib/core/partner-compliance";
import { parsePartnerComplianceOverview } from "@/lib/partner-compliance";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const data = await getPartnerCompliance(supabase, {
      compliance_status: url.searchParams.get("compliance_status") ?? undefined,
      country: url.searchParams.get("country") ?? undefined,
      verification_status: url.searchParams.get("verification_status") ?? undefined,
      agreement_status: url.searchParams.get("agreement_status") ?? undefined,
      tax_status: url.searchParams.get("tax_status") ?? undefined,
      date_from: url.searchParams.get("date_from") ?? undefined,
      search: url.searchParams.get("search") ?? undefined,
    });

    const parsed = parsePartnerComplianceOverview(data);
    if (!parsed) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load compliance center" }, { status: 500 });
  }
}
