import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseAppInstallResult } from "@/lib/aipify/app-ecosystem";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as { install_id?: string };
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("uninstall_ecosystem_app", {
      p_install_id: body.install_id ?? "",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseAppInstallResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to uninstall app" }, { status: 500 });
  }
}
