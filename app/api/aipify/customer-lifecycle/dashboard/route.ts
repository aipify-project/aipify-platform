import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseCustomerLifecycleDashboard } from "@/lib/aipify/customer-lifecycle";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_customer_lifecycle_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCustomerLifecycleDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load customer lifecycle dashboard" }, { status: 500 });
  }
}
