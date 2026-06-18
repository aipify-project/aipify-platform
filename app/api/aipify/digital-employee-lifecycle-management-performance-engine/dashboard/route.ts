import { NextResponse } from "next/server";
import { parseDigitalEmployeeLifecycleManagementCenter } from "@/lib/aipify/digital-employee-lifecycle-management-performance-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_digital_employee_lifecycle_management_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseDigitalEmployeeLifecycleManagementCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load digital employee center" }, { status: 500 });
  }
}
