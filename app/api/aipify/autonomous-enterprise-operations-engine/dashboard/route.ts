import { NextResponse } from "next/server";
import { parseAutonomousEnterpriseOperationsCenter } from "@/lib/aipify/autonomous-enterprise-operations-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_autonomous_enterprise_operations_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseAutonomousEnterpriseOperationsCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load autonomous operations center" }, { status: 500 });
  }
}
