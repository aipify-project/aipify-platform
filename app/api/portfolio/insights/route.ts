import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseMultiStoreOrchestrationDashboard } from "@/lib/aipify/multi-store-orchestration";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_multi_store_orchestration_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const dashboard = parseMultiStoreOrchestrationDashboard(data);
    return NextResponse.json({
      cross_store_insights: dashboard.cross_store_insights,
      product_sync_guidance: dashboard.product_sync_guidance,
    });
  } catch {
    return NextResponse.json({ error: "Failed to load portfolio insights" }, { status: 500 });
  }
}
