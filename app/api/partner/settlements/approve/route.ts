import { NextResponse } from "next/server";
import { approvePartnerSettlement } from "@/lib/core/partner-settlements";
import { parsePartnerSettlementDetail } from "@/lib/partner-settlements";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      settlement_id?: string;
      approval_statement?: string;
    };
    if (!body.settlement_id || !body.approval_statement?.trim()) {
      return NextResponse.json({ error: "Settlement ID and approval statement required" }, { status: 400 });
    }

    const data = await approvePartnerSettlement(
      supabase,
      body.settlement_id,
      body.approval_statement.trim(),
    );
    const parsed = parsePartnerSettlementDetail(data);
    if (!parsed?.has_access) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to approve settlement";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
