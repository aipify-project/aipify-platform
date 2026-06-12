import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseCompanionWorkforceDashboard } from "@/lib/aipify/companion-workforce-engine";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_companion_workforce_engine_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCompanionWorkforceDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load companion workforce dashboard" }, { status: 500 });
  }
}
