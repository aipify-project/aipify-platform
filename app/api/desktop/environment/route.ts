import { NextResponse } from "next/server";
import { parseEnvironmentCenter } from "@/lib/companion-device-environment";
import {
  getCompanionDeviceEnvironmentCenter,
  updateCompanionDeviceEnvironmentSettings,
} from "@/lib/core/companion-device-environment";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getCompanionDeviceEnvironmentCenter(supabase);
    const parsed = parseEnvironmentCenter(data);
    if (!parsed?.has_access) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load device environment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;
    const data = await updateCompanionDeviceEnvironmentSettings(supabase, body);
    return NextResponse.json(parseEnvironmentCenter(data));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update environment settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
