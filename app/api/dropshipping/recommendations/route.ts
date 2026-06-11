import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseDropshippingOperationsDashboard } from "@/lib/aipify/dropshipping-operations";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_dropshipping_operations_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const dashboard = parseDropshippingOperationsDashboard(data);
    return NextResponse.json({ recommendations: dashboard.operations_recommendations });
  } catch {
    return NextResponse.json({ error: "Failed to load recommendations" }, { status: 500 });
  }
}
