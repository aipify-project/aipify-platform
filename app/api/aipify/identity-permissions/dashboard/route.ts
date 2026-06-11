import { NextResponse } from "next/server";
import { parseIdentityPermissionsDashboard } from "@/lib/aipify/identity-permissions";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_identity_permissions_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseIdentityPermissionsDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load identity dashboard" }, { status: 500 });
  }
}
