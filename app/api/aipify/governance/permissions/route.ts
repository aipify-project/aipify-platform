import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("list_governance_permissions");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ permissions: data });
  } catch {
    return NextResponse.json({ error: "Permissions request failed" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { data, error } = await supabase.rpc("update_governance_permission", {
      p_action_key: body.action_key,
      p_permission_level: body.permission_level,
      p_enabled: body.enabled ?? true,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ permissions: data });
  } catch {
    return NextResponse.json({ error: "Permission update failed" }, { status: 500 });
  }
}
