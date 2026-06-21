import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Platform admin only — no browser-triggered sync from APP. */
export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("platform_run_unonight_pilot_discovery");
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 403 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to run pilot discovery" }, { status: 500 });
  }
}
