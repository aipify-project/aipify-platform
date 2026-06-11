import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseCommerceActionResult } from "@/lib/aipify/commerce-intelligence";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const action = (body.action as string) ?? "test_product";

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("record_commerce_recommendation_action", {
      p_product_id: id,
      p_action: action,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCommerceActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to record action" }, { status: 500 });
  }
}
