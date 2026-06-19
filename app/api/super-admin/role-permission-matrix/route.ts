import { NextResponse } from "next/server";
import { getSuperAdminRolePermissionMatrixOverview, parseSuperAdminRolePermissionOverview } from "@/lib/role-permission-matrix";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getSuperAdminRolePermissionMatrixOverview(supabase);
    return NextResponse.json(parseSuperAdminRolePermissionOverview(data) ?? { found: false });
  } catch {
    return NextResponse.json({ error: "Failed to load overview" }, { status: 500 });
  }
}
