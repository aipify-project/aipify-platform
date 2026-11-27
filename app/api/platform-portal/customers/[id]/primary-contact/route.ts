import { NextResponse } from "next/server";
import {
  parsePlatformPrimaryContactWriteInput,
  writePlatformCustomerPrimaryContact,
} from "@/lib/platform-portal/customer-primary-contact-write";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" } as const;

function fail(error: string, status: number, code: string) {
  return NextResponse.json({ error, code }, { status, headers: NO_STORE });
}

/**
 * PATCH ordinary primary contact (person name + phone).
 * Email / legal identity remain on /identity (high-risk gate).
 * Fail-closed until Core RPC update_platform_portal_customer_primary_contact exists.
 */
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return fail("Unauthorized", 401, "unauthorized");

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return fail("Invalid JSON body.", 400, "unknown");
    }

    const parsed = parsePlatformPrimaryContactWriteInput(id ?? "", body);
    if (!parsed.ok) {
      return fail("Invalid primary contact input.", 400, parsed.code);
    }

    const result = await writePlatformCustomerPrimaryContact(
      { userClient: supabase },
      parsed.value,
    );

    if (!result.ok) {
      const status =
        result.code === "forbidden"
          ? 403
          : result.code === "unauthorized"
            ? 401
            : result.code === "customer_not_found"
              ? 404
              : result.code === "core_gate_pending"
                ? 501
                : result.code === "update_failed"
                  ? 503
                  : 400;
      return fail("Unable to update primary contact.", status, result.code);
    }

    return NextResponse.json(result, { headers: NO_STORE });
  } catch {
    return fail("Unable to update primary contact.", 500, "unknown");
  }
}
