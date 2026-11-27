import { NextResponse } from "next/server";
import {
  parsePlatformCompanyAddressWriteInput,
  writePlatformCustomerCompanyAddress,
} from "@/lib/platform-portal/customer-company-address-write";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" } as const;

function fail(error: string, status: number, code: string) {
  return NextResponse.json({ error, code }, { status, headers: NO_STORE });
}

/**
 * PATCH ordinary company + invoice address fields for Platform Admin.
 * Legal name / organization number remain locked (high-risk identity).
 * Fail-closed until Core RPC update_platform_portal_customer_company_address exists
 * and COMPANY_ADDRESS_WRITE_CORE_LIVE is flipped after owner YES.
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

    const parsed = parsePlatformCompanyAddressWriteInput(id ?? "", body);
    if (!parsed.ok) {
      return fail("Invalid company address input.", 400, parsed.code);
    }

    const result = await writePlatformCustomerCompanyAddress(
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
      return fail("Unable to update company address.", status, result.code);
    }

    return NextResponse.json(result, { headers: NO_STORE });
  } catch {
    return fail("Unable to update company address.", 500, "unknown");
  }
}
