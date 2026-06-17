import { NextResponse } from "next/server";
import { parseStorageHealth } from "@/lib/companion-device-environment";
import { getCompanionDeviceStorageHealth } from "@/lib/core/companion-device-environment";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getCompanionDeviceStorageHealth(supabase);
    const storage = parseStorageHealth(data);
    return NextResponse.json({ has_access: true, storage });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load storage health";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
