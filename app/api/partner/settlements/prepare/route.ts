import { NextResponse } from "next/server";
import { processPartnerCommunicationOutbox } from "@/lib/core/partner-communications-email";
import { preparePartnerMonthlySettlement } from "@/lib/core/partner-settlements";
import { parsePartnerSettlementDetail } from "@/lib/partner-settlements";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json().catch(() => ({}))) as { period?: string };
    const data = await preparePartnerMonthlySettlement(supabase, body.period);
    await processPartnerCommunicationOutbox(supabase, 5).catch(() => undefined);
    const parsed = parsePartnerSettlementDetail(data);
    if (!parsed?.has_access) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to prepare settlement";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
