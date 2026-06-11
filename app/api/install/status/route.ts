import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseInstallStatus } from "@/lib/aipify/platform-install";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_install_status");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseInstallStatus(data));
  } catch {
    return NextResponse.json({ error: "Failed to load install status" }, { status: 500 });
  }
}
