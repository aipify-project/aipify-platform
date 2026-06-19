import { NextResponse } from "next/server";
import { getRolePermissionMatrixCenter, parseRolePermissionMatrixCenter } from "@/lib/role-permission-matrix";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getRolePermissionMatrixCenter(supabase);
    return NextResponse.json(parseRolePermissionMatrixCenter(data) ?? { found: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load matrix";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
