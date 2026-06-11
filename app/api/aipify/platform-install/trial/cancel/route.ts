import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parsePlatformInstallActionResult } from "@/lib/aipify/platform-install";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const reason = (body.reason as string) ?? null;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("cancel_install_trial", { p_reason: reason });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parsePlatformInstallActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to cancel trial" }, { status: 500 });
  }
}
