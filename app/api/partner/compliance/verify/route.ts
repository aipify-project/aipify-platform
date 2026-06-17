import { NextResponse } from "next/server";
import { submitPartnerComplianceVerification } from "@/lib/core/partner-compliance";
import { parsePartnerComplianceOverview } from "@/lib/partner-compliance";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json().catch(() => ({}))) as { verification_type?: string };
    const data = await submitPartnerComplianceVerification(
      supabase,
      body.verification_type ?? "business",
    );
    const parsed = parsePartnerComplianceOverview(data);
    if (!parsed) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit verification";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
