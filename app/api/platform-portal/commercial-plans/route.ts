import { NextResponse } from "next/server";
import { parsePlatformPortalCommercialPlansPayload } from "@/lib/platform-portal/commercial-plan";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" } as const;

function jsonError(message: string, status: number, code?: string) {
  return NextResponse.json(
    code ? { error: message, code } : { error: message },
    { status, headers: NO_STORE },
  );
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

    const { data, error } = await supabase.rpc("get_platform_portal_commercial_plans");

    if (error) {
      const message = (error.message ?? "").toLowerCase();
      if (
        message.includes("platform portal access denied") ||
        message.includes("access denied") ||
        message.includes("forbidden")
      ) {
        return jsonError("Forbidden", 403, "forbidden");
      }
      return jsonError("Unable to load commercial plans.", 500, "unknown");
    }

    return NextResponse.json(parsePlatformPortalCommercialPlansPayload(data), {
      headers: NO_STORE,
    });
  } catch {
    return jsonError("Unable to load commercial plans.", 500, "unknown");
  }
}
