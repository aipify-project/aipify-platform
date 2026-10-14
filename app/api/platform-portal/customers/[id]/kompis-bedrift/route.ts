import { NextResponse } from "next/server";
import {
  isKompisBedriftActivateOwnerAuthorized,
  mapKompisBedriftActivationRpcError,
  parseActivateKompisBedriftInput,
  parsePlatformPortalKompisBedriftStatus,
} from "@/lib/platform-portal/kompis-bedrift-activation";
import { createClient } from "@/lib/supabase/server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const headers = { "Cache-Control": "no-store" };
const fail = (error: string, status: number, code: string) =>
  NextResponse.json({ error, code }, { status, headers });

/** READ — Core `get_platform_portal_customer_kompis_bedrift_status`. */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    if (!UUID.test(id ?? "")) return fail("Invalid customer id.", 400, "invalid_customer");
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return fail("Unauthorized", 401, "unauthorized");

    const { data, error } = await supabase.rpc(
      "get_platform_portal_customer_kompis_bedrift_status",
      { p_customer_id: id },
    );
    if (error) {
      const mapped = mapKompisBedriftActivationRpcError(error.message);
      return fail("Unable to load Kompis Bedrift status.", mapped.status, mapped.code);
    }
    if (data == null) return fail("Customer not found.", 404, "customer_not_found");

    const parsed = parsePlatformPortalKompisBedriftStatus(data);
    return parsed
      ? NextResponse.json(parsed, { headers })
      : fail("Unable to load Kompis Bedrift status.", 500, "unknown");
  } catch {
    return fail("Unable to load Kompis Bedrift status.", 500, "unknown");
  }
}

/**
 * ACTIVATE — validated + owner-allowlisted only.
 * With empty allowlist the Core RPC is never called (Production write gate OFF).
 */
export async function POST(
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

    const input = parseActivateKompisBedriftInput(
      id ?? "",
      await request.json().catch(() => null),
    );
    if (!input.ok) {
      return fail("Invalid Kompis Bedrift activation input.", 400, input.code);
    }

    if (!isKompisBedriftActivateOwnerAuthorized(input.value.customerId)) {
      return fail(
        "Kompis Bedrift activation requires a named owner authorization for this customer.",
        403,
        "owner_activation_authorization_required",
      );
    }

    const { data, error } = await supabase.rpc(
      "activate_platform_portal_customer_kompis_bedrift",
      {
        p_customer_id: input.value.customerId,
        p_internal_reason: input.value.internalReason,
        p_confirmation: input.value.confirmation,
        p_idempotency_key: input.value.idempotencyKey,
      },
    );
    if (error) {
      const mapped = mapKompisBedriftActivationRpcError(error.message);
      return fail("Unable to activate Kompis Bedrift.", mapped.status, mapped.code);
    }

    const parsed = parsePlatformPortalKompisBedriftStatus(data);
    if (!parsed) {
      // Activate RPC returns a grant result shape; re-fetch status for stable UI contract.
      const statusResult = await supabase.rpc(
        "get_platform_portal_customer_kompis_bedrift_status",
        { p_customer_id: input.value.customerId },
      );
      const statusParsed = parsePlatformPortalKompisBedriftStatus(statusResult.data);
      if (!statusParsed) {
        return fail("Unable to activate Kompis Bedrift.", 500, "unknown");
      }
      return NextResponse.json(statusParsed, { status: 201, headers });
    }
    return NextResponse.json(parsed, { status: 201, headers });
  } catch {
    return fail("Unable to activate Kompis Bedrift.", 500, "unknown");
  }
}
