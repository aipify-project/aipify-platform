import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseCommerceActionResult } from "@/lib/aipify/commerce-intelligence/parse";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("add_commerce_watchlist", { p_product_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCommerceActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to add to watchlist" }, { status: 500 });
  }
}
