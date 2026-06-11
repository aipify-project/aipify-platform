import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseCommercePerformanceDashboard } from "@/lib/aipify/commerce-performance";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_commerce_performance_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const dashboard = parseCommercePerformanceDashboard(data);
    return NextResponse.json({ insights: dashboard.customer_value_signals });
  } catch {
    return NextResponse.json({ error: "Failed to load customer value insights" }, { status: 500 });
  }
}
