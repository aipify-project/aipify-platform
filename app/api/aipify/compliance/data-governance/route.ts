import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseDataGovernanceOverview } from "@/lib/aipify/security-compliance";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_data_governance_overview");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseDataGovernanceOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to load data governance" }, { status: 500 });
  }
}
