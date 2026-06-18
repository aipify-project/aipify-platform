import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseProductAutomationActionResult } from "@/lib/aipify/product-automation/parse";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const productId = body.product_id as string;
    if (!productId) return NextResponse.json({ error: "product_id is required" }, { status: 400 });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("translate_product", {
      p_product_id: productId,
      p_target_language: (body.target_language as string) ?? "no",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseProductAutomationActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to translate product" }, { status: 500 });
  }
}
