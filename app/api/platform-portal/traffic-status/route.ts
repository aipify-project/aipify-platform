import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPlatformProfile } from "@/lib/tenant/get-platform-profile";
import { loadPlatformTrafficStatus } from "@/lib/platform-portal/load-traffic-status";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/**
 * Platform Admin only — global live status snapshot.
 * Fail closed for anon / APP / seller / non-admin. No service-role on the client.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", code: "unauthorized" },
        { status: 401, headers: NO_STORE },
      );
    }

    const profile = await getPlatformProfile(supabase);
    if (!profile) {
      return NextResponse.json(
        { error: "Forbidden", code: "forbidden" },
        { status: 403, headers: NO_STORE },
      );
    }

    const status = await loadPlatformTrafficStatus();
    return NextResponse.json(status, { headers: NO_STORE });
  } catch {
    return NextResponse.json(
      { error: "Unable to load platform traffic status.", code: "unavailable" },
      { status: 500, headers: NO_STORE },
    );
  }
}
