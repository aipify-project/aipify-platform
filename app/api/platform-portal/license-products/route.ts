import { NextResponse } from "next/server";
import { parsePlatformPortalLicenseProductsPayload } from "@/lib/platform-portal/license-provisioning";
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

    const { data, error } = await supabase.rpc("get_platform_portal_license_products");
    if (error) {
      const message = (error.message ?? "").toLowerCase();
      if (message.includes("access denied")) {
        return jsonError("Forbidden", 403, "forbidden");
      }
      return jsonError("Unable to load license products.", 500, "unknown");
    }

    const payload = parsePlatformPortalLicenseProductsPayload(data);
    return NextResponse.json(payload, { headers: NO_STORE });
  } catch {
    return jsonError("Unable to load license products.", 500, "unknown");
  }
}
