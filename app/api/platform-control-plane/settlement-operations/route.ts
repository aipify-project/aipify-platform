import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parsePartnerSettlementOperations } from "@/lib/platform-control-plane";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_platform_partner_settlement_operations");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json({
      data: parsePartnerSettlementOperations(data),
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to load partner settlement operations." },
      { status: 500 },
    );
  }
}
