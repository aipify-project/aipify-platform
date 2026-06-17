import { NextResponse } from "next/server";
import { getPartnerComplianceAgreements } from "@/lib/core/partner-compliance";
import { parsePartnerComplianceAgreements } from "@/lib/partner-compliance";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getPartnerComplianceAgreements(supabase);
    const parsed = parsePartnerComplianceAgreements(data);
    if (!parsed) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load agreements" }, { status: 500 });
  }
}
