import { NextResponse } from "next/server";
import { parsePlatformCustomerAgreementsOverview } from "@/lib/platform-portal/customer-agreements";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" } as const;

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: NO_STORE });
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const { data, error } = await supabase.rpc(
      "get_platform_portal_customer_agreements_overview",
    );

    if (error) {
      const message = (error.message ?? "").toLowerCase();
      if (
        message.includes("platform portal access denied") ||
        message.includes("access denied") ||
        message.includes("not authorized") ||
        message.includes("permission") ||
        message.includes("forbidden")
      ) {
        return jsonError("Forbidden", 403);
      }

      return jsonError("Unable to load customer agreements overview.", 500);
    }

    return NextResponse.json(parsePlatformCustomerAgreementsOverview(data), {
      headers: NO_STORE,
    });
  } catch {
    return jsonError("Unable to load customer agreements overview.", 500);
  }
}
