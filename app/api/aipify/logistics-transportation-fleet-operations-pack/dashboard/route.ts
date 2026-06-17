import { NextResponse } from "next/server";
import { parseLogisticsTransportationFleetOperationsCenter } from "@/lib/aipify/logistics-transportation-fleet-operations-pack";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_logistics_transportation_fleet_operations_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseLogisticsTransportationFleetOperationsCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load logistics center" }, { status: 500 });
  }
}
