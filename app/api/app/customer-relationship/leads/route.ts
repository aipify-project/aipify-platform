import { NextResponse } from "next/server";
import { getLeadManagementCenter, parseLeadManagementCenter } from "@/lib/customer-relationship";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const data = await getLeadManagementCenter(supabase);
    return NextResponse.json(parseLeadManagementCenter(data) ?? { found: false });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to load leads" }, { status: 500 });
  }
}
