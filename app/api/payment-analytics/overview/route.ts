import { NextRequest, NextResponse } from "next/server";
import { parsePaymentAnalyticsCenter } from "@/lib/payment-analytics";
import { createClient } from "@/lib/supabase/server";

function buildFilters(searchParams: URLSearchParams) {
  return {
    date_from: searchParams.get("date_from") ?? undefined,
    date_to: searchParams.get("date_to") ?? undefined,
    provider: searchParams.get("provider") ?? undefined,
    customer_type: searchParams.get("customer_type") ?? undefined,
    country: searchParams.get("country") ?? undefined,
    currency: searchParams.get("currency") ?? undefined,
    subscription_plan: searchParams.get("subscription_plan") ?? undefined,
    growth_partner: searchParams.get("growth_partner") ?? undefined,
    customer_segment: searchParams.get("customer_segment") ?? undefined,
  };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const filters = buildFilters(request.nextUrl.searchParams);

    const { data, error } = await supabase.rpc("get_payment_analytics_center", {
      p_filters: filters,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parsePaymentAnalyticsCenter(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load payment analytics center" }, { status: 500 });
  }
}
