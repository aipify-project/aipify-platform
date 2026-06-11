import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseTrustDashboard } from "@/lib/aipify/trust-engine";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_trust_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseTrustDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load trust dashboard" }, { status: 500 });
  }
}
