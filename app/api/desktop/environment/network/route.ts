import { NextResponse } from "next/server";
import { parseLocalServices, parseNetworkStatus } from "@/lib/companion-device-environment";
import { getCompanionDeviceNetworkStatus } from "@/lib/core/companion-device-environment";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getCompanionDeviceNetworkStatus(supabase);
    return NextResponse.json({
      has_access: true,
      network: parseNetworkStatus(data),
      local_services: parseLocalServices(data),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load network status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
