import { NextResponse } from "next/server";
import { getEmployeeDashboard, parseEmployeeDashboard } from "@/lib/employee-management";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getEmployeeDashboard(supabase);
    return NextResponse.json(parseEmployeeDashboard(data) ?? { found: false });
  } catch {
    return NextResponse.json({ error: "Failed to load employee dashboard" }, { status: 500 });
  }
}
