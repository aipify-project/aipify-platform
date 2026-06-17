import { NextResponse } from "next/server";
import { getPartnerSettlement } from "@/lib/core/partner-settlements";
import { parsePartnerSettlementDetail } from "@/lib/partner-settlements";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getPartnerSettlement(supabase, id);
    const parsed = parsePartnerSettlementDetail(data);
    if (!parsed) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load settlement" }, { status: 500 });
  }
}
