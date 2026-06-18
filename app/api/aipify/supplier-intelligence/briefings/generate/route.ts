import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseSupplierIntelligenceBriefingResult } from "@/lib/aipify/supplier-intelligence/parse";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("generate_supplier_intelligence_briefing");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseSupplierIntelligenceBriefingResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to generate supplier intelligence briefing" }, { status: 500 });
  }
}
