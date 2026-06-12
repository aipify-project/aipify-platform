import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseLivingEnterpriseDashboard } from "@/lib/aipify/living-enterprise-engine";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_living_enterprise_engine_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseLivingEnterpriseDashboard(data));
  } catch {
    return NextResponse.json(
      { error: "Failed to load Living Enterprise dashboard" },
      { status: 500 },
    );
  }
}
