import { NextResponse } from "next/server";
import { parseSuperAdminControlCenter } from "@/lib/super-admin/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_super_admin_control_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });

    const parsed = parseSuperAdminControlCenter(data);
    if (!parsed) {
      return NextResponse.json({ error: "Super Admin access required" }, { status: 403 });
    }

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load Super Admin Control Center" }, { status: 500 });
  }
}
