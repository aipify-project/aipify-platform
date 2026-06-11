import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: center, error } = await supabase.rpc("get_customer_business_dna_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const bundle = center as {
      health?: unknown;
      automation_readiness?: unknown;
    };

    return NextResponse.json({
      health: bundle.health ?? null,
      automation_readiness: bundle.automation_readiness ?? null,
    });
  } catch {
    return NextResponse.json({ error: "Health score request failed" }, { status: 500 });
  }
}
