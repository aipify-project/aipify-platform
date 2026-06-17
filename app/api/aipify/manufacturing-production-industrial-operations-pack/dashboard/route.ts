import { NextResponse } from "next/server";
import { parseManufacturingProductionIndustrialOperationsCenter } from "@/lib/aipify/manufacturing-production-industrial-operations-pack";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_manufacturing_production_industrial_operations_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseManufacturingProductionIndustrialOperationsCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load manufacturing center" }, { status: 500 });
  }
}
