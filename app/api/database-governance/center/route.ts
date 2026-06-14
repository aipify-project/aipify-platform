import { NextResponse } from "next/server";
import { parseDatabaseGovernanceCenter } from "@/lib/database-governance-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_database_governance_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseDatabaseGovernanceCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load Database Governance Center" }, { status: 500 });
  }
}
