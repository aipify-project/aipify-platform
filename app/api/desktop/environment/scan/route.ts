import { NextResponse } from "next/server";
import { parseEnvironmentCenter } from "@/lib/companion-device-environment";
import { runCompanionDeviceEnvironmentScan } from "@/lib/core/companion-device-environment";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const data = await runCompanionDeviceEnvironmentScan(supabase, body);
    return NextResponse.json(parseEnvironmentCenter(data));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to run environment scan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
