import { NextResponse } from "next/server";
import { parsePlatformPortalCustomerDomainsPayload } from "@/lib/platform-portal/domain-installation";
import { createClient } from "@/lib/supabase/server";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const NO_STORE = { "Cache-Control": "no-store" } as const;

function jsonError(message: string, status: number, code?: string) {
  return NextResponse.json(
    code ? { error: message, code } : { error: message },
    { status, headers: NO_STORE },
  );
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const customerId = (id ?? "").trim();
    if (!UUID_REGEX.test(customerId)) {
      return jsonError("Invalid customer id.", 400, "invalid_customer");
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return jsonError("Unauthorized", 401, "unauthorized");
    }

    const { data, error } = await supabase.rpc("get_platform_portal_customer_domains", {
      p_customer_id: customerId,
    });

    if (error) {
      const message = (error.message ?? "").toLowerCase();
      if (message.includes("access denied")) {
        return jsonError("Forbidden", 403, "forbidden");
      }
      return jsonError("Unable to load domains.", 500, "unknown");
    }

    if (data == null) {
      return jsonError("Customer not found.", 404, "customer_not_found");
    }

    return NextResponse.json(parsePlatformPortalCustomerDomainsPayload(data), {
      headers: NO_STORE,
    });
  } catch {
    return jsonError("Unable to load domains.", 500, "unknown");
  }
}
