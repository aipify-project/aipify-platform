import { NextResponse } from "next/server";
import { acceptPartnerSelfBillingAgreement } from "@/lib/core/partner-settlements";
import { parsePartnerSettlementsOverview } from "@/lib/partner-settlements";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json().catch(() => ({}))) as { statement?: string };
    const data = await acceptPartnerSelfBillingAgreement(supabase, body.statement);
    const parsed = parsePartnerSettlementsOverview(data);
    if (!parsed) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to accept agreement";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
