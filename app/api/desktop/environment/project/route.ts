import { NextResponse } from "next/server";
import { parseProjectLocationHealth } from "@/lib/companion-device-environment";
import { getCompanionDeviceProjectLocationHealth } from "@/lib/core/companion-device-environment";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getCompanionDeviceProjectLocationHealth(supabase);
    const project = parseProjectLocationHealth(data);
    return NextResponse.json({ has_access: true, project });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load project location health";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
