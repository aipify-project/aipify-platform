import { NextResponse } from "next/server";
import { parseSuperGlobalAuditCenter } from "@/lib/super-portal";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_super_global_audit_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });

    return NextResponse.json({ audit_logs: parseSuperGlobalAuditCenter(data) });
  } catch {
    return NextResponse.json({ error: "Failed to load global audit center" }, { status: 500 });
  }
}
