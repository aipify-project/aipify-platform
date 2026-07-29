import { NextResponse } from "next/server";
import { parsePlatformPortalCustomerDetail } from "@/lib/platform-portal/parse";
import { createClient } from "@/lib/supabase/server";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const NO_STORE = { "Cache-Control": "no-store" } as const;

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: NO_STORE });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const customerId = (id ?? "").trim();

    if (!UUID_REGEX.test(customerId)) {
      return jsonError("Invalid customer id.", 400);
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const { data, error } = await supabase.rpc("get_platform_portal_customer_detail", {
      p_customer_id: customerId,
    });

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

      return jsonError("Unable to load customer detail.", 500);
    }

    if (data == null) {
      return jsonError("Customer not found.", 404);
    }

    const parsed = parsePlatformPortalCustomerDetail(data);
    if (!parsed) {
      return jsonError("Unable to load customer detail.", 500);
    }

    return NextResponse.json(parsed, { headers: NO_STORE });
  } catch {
    return jsonError("Unable to load customer detail.", 500);
  }
}
