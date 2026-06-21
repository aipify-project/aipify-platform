import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Platform admin / cron only — never exposed to APP users. */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json().catch(() => ({}))) as { source_key?: string | null };
    const { data, error } = await supabase.rpc("platform_run_unonight_pilot_sync", {
      p_source_key: body.source_key ?? null,
    });
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 403 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to run pilot sync" }, { status: 500 });
  }
}
