import { NextResponse } from "next/server";
import { parsePermissionAccessGovernanceCenter } from "@/lib/permission-access-governance";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_permission_access_governance_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parsePermissionAccessGovernanceCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load Permission Center" }, { status: 500 });
  }
}
