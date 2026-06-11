import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseDropshippingActionResult, parseDropshippingOperationsDashboard } from "@/lib/aipify/dropshipping-operations";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_dropshipping_operations_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const dashboard = parseDropshippingOperationsDashboard(data);
    return NextResponse.json({ watchlists: dashboard.product_watchlists });
  } catch {
    return NextResponse.json({ error: "Failed to load watchlists" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const productKey = body.product_key as string;
    if (!productKey) return NextResponse.json({ error: "product_key is required" }, { status: 400 });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("add_dropshipping_watchlist", {
      p_product_key: productKey,
      p_product_name: (body.product_name as string) ?? null,
      p_category: (body.category as string) ?? "General",
      p_watch_reason: (body.watch_reason as string) ?? "Monitoring",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseDropshippingActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to add watchlist" }, { status: 500 });
  }
}
