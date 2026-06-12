import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseSupplierIntelligenceCard } from "@/lib/aipify/supplier-intelligence";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_supplier_intelligence_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseSupplierIntelligenceCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load supplier intelligence card" }, { status: 500 });
  }
}
