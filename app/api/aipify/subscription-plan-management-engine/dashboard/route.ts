import { NextResponse } from "next/server";
import { parseSubscriptionPlanManagementDashboard } from "@/lib/aipify/subscription-plan-management-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_subscription_plan_management_engine_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseSubscriptionPlanManagementDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load subscription dashboard" }, { status: 500 });
  }
}
