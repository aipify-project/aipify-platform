import { NextResponse } from "next/server";
import { parseCustomerHealthDashboard } from "@/lib/customer-health-early-warning";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const filters = {
      health_category: searchParams.get("health_category") ?? "",
      trend: searchParams.get("trend") ?? "",
    };

    const { data, error } = await supabase.rpc("get_customer_health_dashboard", {
      p_filters: filters,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parseCustomerHealthDashboard(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load customer health dashboard" }, { status: 500 });
  }
}
