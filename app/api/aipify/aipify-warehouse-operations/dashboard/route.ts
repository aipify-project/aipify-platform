import { NextResponse } from "next/server";
import { parseAipifyWarehouseOperationsDashboard } from "@/lib/aipify/aipify-warehouse-operations";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_aipify_warehouse_operations_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseAipifyWarehouseOperationsDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load warehouse dashboard" }, { status: 500 });
  }
}
