import { NextResponse } from "next/server";
import { parseCustomerHealthOverview } from "@/lib/app-portal/customer-health";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_customer_health", {
      p_category: searchParams.get("category") || null,
      p_period_from: searchParams.get("period_from") || null,
      p_department: searchParams.get("department") || null,
      p_priority: searchParams.get("priority") || null,
      p_trend: searchParams.get("trend") || null,
      p_recommendation_status: searchParams.get("recommendation_status") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseCustomerHealthOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to load customer health" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("begin_app_portal_customer_health_review");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCustomerHealthOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to start health review" }, { status: 500 });
  }
}
