import { NextResponse } from "next/server";
import { fetchWebsiteStagingVerificationOverview } from "@/lib/website-staging-verification/context";
import { getPlatformProfile } from "@/lib/tenant/get-platform-profile";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" } as const;

function jsonError(message: string, status: number, code: string) {
  return NextResponse.json({ error: message, code }, { status, headers: NO_STORE });
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return jsonError("Unauthorized", 401, "unauthorized");
    }

    const profile = await getPlatformProfile(supabase);
    if (!profile || profile.role !== "super_admin") {
      return jsonError("Forbidden", 403, "forbidden");
    }

    const overview = await fetchWebsiteStagingVerificationOverview(supabase);
    return NextResponse.json(overview, { headers: NO_STORE });
  } catch {
    return jsonError("Unable to load the release verification overview.", 500, "unknown");
  }
}
