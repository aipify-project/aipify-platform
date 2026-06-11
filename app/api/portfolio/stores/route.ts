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
    return NextResponse.json({ stores: dashboard.store_summaries });
  } catch {
    return NextResponse.json({ error: "Failed to load stores" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const storeKey = body.store_key as string;
    const storeName = body.store_name as string;
    if (!storeKey || !storeName) {
      return NextResponse.json({ error: "store_key and store_name are required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("register_portfolio_store", {
      p_store_key: storeKey,
      p_store_name: storeName,
      p_platform_type: (body.platform_type as string) ?? "shopify",
      p_brand_group: (body.brand_group as string) ?? null,
      p_region: (body.region as string) ?? "Nordic",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to register store" }, { status: 500 });
  }
}
