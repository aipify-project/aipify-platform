import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseProductAutomationActionResult } from "@/lib/aipify/product-automation/parse";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const productKey = body.product_key as string;
    const title = body.title as string;
    if (!productKey || !title) {
      return NextResponse.json({ error: "product_key and title are required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("import_product", {
      p_product_key: productKey,
      p_title: title,
      p_description: (body.description as string) ?? null,
      p_source_type: (body.source_type as string) ?? "supplier_feed",
      p_price: body.price != null ? Number(body.price) : null,
      p_category: (body.category as string) ?? "General",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseProductAutomationActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to import product" }, { status: 500 });
  }
}
