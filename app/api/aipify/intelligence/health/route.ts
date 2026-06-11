import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: center, error } = await supabase.rpc("get_customer_intelligence_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const c = center as Record<string, unknown> | null;
    return NextResponse.json({
      health_score: c?.health_score ?? null,
      health_band: c?.health_band ?? null,
      snapshot: c?.snapshot ?? null,
    });
  } catch {
    return NextResponse.json({ error: "Health request failed" }, { status: 500 });
  }
}
