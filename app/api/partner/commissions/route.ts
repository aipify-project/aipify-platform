import { NextResponse } from "next/server";
import { getPartnerCommissions } from "@/lib/core/partner-commissions";
import { parsePartnerCommissionsDashboard } from "@/lib/partner-commissions";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const tierParam = url.searchParams.get("tier");
    const amountMin = url.searchParams.get("amount_min");

    const data = await getPartnerCommissions(supabase, {
      customer: url.searchParams.get("customer") ?? undefined,
      package: url.searchParams.get("package") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      tier: tierParam ? Number(tierParam) : undefined,
      date_from: url.searchParams.get("date_from") ?? undefined,
      date_to: url.searchParams.get("date_to") ?? undefined,
      amount_min: amountMin ? Number(amountMin) : undefined,
      search: url.searchParams.get("search") ?? undefined,
    });

    const parsed = parsePartnerCommissionsDashboard(data);
    if (!parsed) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load commissions" }, { status: 500 });
  }
}
