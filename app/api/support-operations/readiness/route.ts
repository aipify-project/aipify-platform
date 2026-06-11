import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: center, error } = await supabase.rpc("get_customer_support_operations_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const bundle = center as { readiness?: unknown; performance?: unknown };
    return NextResponse.json({
      readiness: bundle.readiness ?? null,
      performance: bundle.performance ?? null,
    });
  } catch {
    return NextResponse.json({ error: "Readiness request failed" }, { status: 500 });
  }
}
