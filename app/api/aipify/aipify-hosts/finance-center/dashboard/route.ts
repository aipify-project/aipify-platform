import { NextResponse } from "next/server";
import { getAipifyHostsFinanceCenterDashboard } from "@/lib/core/aipify-hosts-finance-center";
import { parseAipifyHostsFinanceCenterDashboard } from "@/lib/aipify/aipify-hosts-finance-center/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section") ?? "overview";
    const filter = searchParams.get("filter") ?? "all_properties";
    const propertyId = searchParams.get("property_id");
    const revenueStatus = searchParams.get("revenue_status");
    const expenseCategory = searchParams.get("expense_category");

    const data = await getAipifyHostsFinanceCenterDashboard(
      supabase,
      section,
      filter,
      propertyId,
      revenueStatus,
      expenseCategory,
    );
    const parsed = parseAipifyHostsFinanceCenterDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load finance center" }, { status: 500 });
  }
}
