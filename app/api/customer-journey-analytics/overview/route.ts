import { NextRequest, NextResponse } from "next/server";
import { parseCustomerJourneyAnalytics } from "@/lib/customer-journey-analytics";
import { createClient } from "@/lib/supabase/server";

function buildFilters(searchParams: URLSearchParams) {
  return {
    country: searchParams.get("country") ?? undefined,
    industry: searchParams.get("industry") ?? undefined,
    company_size: searchParams.get("company_size") ?? undefined,
    plan: searchParams.get("plan") ?? undefined,
    customer_segment: searchParams.get("customer_segment") ?? undefined,
    customer_id: searchParams.get("customer_id") ?? undefined,
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
    const { data, error } = await supabase.rpc("get_customer_journey_analytics", {
      p_filters: filters,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parseCustomerJourneyAnalytics(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      { error: "Failed to load customer journey analytics" },
      { status: 500 }
    );
  }
}
