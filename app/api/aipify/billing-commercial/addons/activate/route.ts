import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseCommercialModelActionResult } from "@/lib/aipify/billing-commercial/parse";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = (await request.json()) as { addon_key?: string };
    if (!body.addon_key) {
      return NextResponse.json({ error: "addon_key is required" }, { status: 400 });
    }
    const { data, error } = await supabase.rpc("activate_commercial_addon", { p_addon_key: body.addon_key });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCommercialModelActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to activate add-on" }, { status: 500 });
  }
}
