import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseProductAutomationActionResult } from "@/lib/aipify/product-automation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const actionType = body.action_type as string;
    if (!actionType) return NextResponse.json({ error: "action_type is required" }, { status: 400 });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("run_bulk_automation", {
      p_action_type: actionType,
      p_product_ids: (body.product_ids as string[]) ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseProductAutomationActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to run bulk automation" }, { status: 500 });
  }
}
