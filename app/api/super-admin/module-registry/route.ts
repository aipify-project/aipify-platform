import { NextResponse } from "next/server";
import { parseSuperAdminModuleRegistryCenter } from "@/lib/module-registry";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_super_admin_module_registry_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseSuperAdminModuleRegistryCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load module registry" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { action_type?: string; payload?: Record<string, unknown> };
    const { data, error } = await supabase.rpc("perform_super_admin_module_registry_action", {
      p_action_type: body.action_type,
      p_payload: body.payload ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
