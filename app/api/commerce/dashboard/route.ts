import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseCommerceIntelligenceDashboard } from "@/lib/aipify/commerce-intelligence/parse";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_commerce_intelligence_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCommerceIntelligenceDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load commerce dashboard" }, { status: 500 });
  }
}
