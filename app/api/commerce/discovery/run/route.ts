import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseCommerceActionResult } from "@/lib/aipify/commerce-intelligence/parse";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const mode = (body.mode as string) ?? "balanced";

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("run_product_discovery", { p_mode: mode });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCommerceActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to run discovery" }, { status: 500 });
  }
}
