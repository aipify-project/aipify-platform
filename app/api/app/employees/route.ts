import { NextResponse } from "next/server";
import { getEmployeeManagementCenter, parseEmployeeManagementCenter } from "@/lib/employee-management";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getEmployeeManagementCenter(supabase);
    return NextResponse.json(parseEmployeeManagementCenter(data) ?? { found: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load employee center";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
