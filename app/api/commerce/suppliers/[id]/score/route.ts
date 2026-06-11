import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseCommerceIntelligenceDashboard } from "@/lib/aipify/commerce-intelligence";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_commerce_intelligence_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const dashboard = parseCommerceIntelligenceDashboard(data);
    const supplier = dashboard.supplier_watchlist.find((s) => s.id === id);
    if (!supplier) return NextResponse.json({ error: "Supplier not found" }, { status: 404 });

    return NextResponse.json(supplier);
  } catch {
    return NextResponse.json({ error: "Failed to load supplier score" }, { status: 500 });
  }
}
