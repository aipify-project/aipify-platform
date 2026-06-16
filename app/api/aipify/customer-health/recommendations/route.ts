import { NextResponse } from "next/server";
import { parseCustomerHealthRecommendations } from "@/lib/app-portal/customer-health";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_customer_health_recommendations", {
      p_priority: searchParams.get("priority") || null,
      p_category: searchParams.get("category") || null,
      p_recommendation_status: searchParams.get("recommendation_status") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ found: true, recommendations: parseCustomerHealthRecommendations(data) });
  } catch {
    return NextResponse.json({ error: "Failed to load recommendations" }, { status: 500 });
  }
}
