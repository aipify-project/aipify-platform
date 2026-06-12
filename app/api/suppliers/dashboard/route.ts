import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseSupplierIntelligenceDashboard } from "@/lib/aipify/supplier-intelligence";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_supplier_intelligence_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const dashboard = parseSupplierIntelligenceDashboard(data);
    return NextResponse.json(dashboard);
  } catch {
    return NextResponse.json({ error: "Failed to load supplier dashboard" }, { status: 500 });
  }
}
