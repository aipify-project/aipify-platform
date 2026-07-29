import { NextResponse } from "next/server";
import {
  mapLicenseProvisioningRpcError,
  parseCreateLicenseInput,
  parsePlatformPortalCustomerLicenseResult,
  parsePlatformPortalCustomerLicensesPayload,
} from "@/lib/platform-portal/license-provisioning";
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

    const { data, error } = await supabase.rpc("get_platform_portal_customer_licenses", {
      p_customer_id: customerId,
    });

    if (error) {
      const message = (error.message ?? "").toLowerCase();
      if (message.includes("access denied")) {
        return jsonError("Forbidden", 403, "forbidden");
      }
      return jsonError("Unable to load licenses.", 500, "unknown");
    }

    if (data == null) {
      return jsonError("Customer not found.", 404, "customer_not_found");
    }

    const payload = parsePlatformPortalCustomerLicensesPayload(data);
    return NextResponse.json(payload, { headers: NO_STORE });
  } catch {
    return jsonError("Unable to load licenses.", 500, "unknown");
  }
}

export async function POST(
  request: Request,
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

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("Invalid JSON body.", 400, "unknown");
    }

    const parsedInput = parseCreateLicenseInput(customerId, body);
    if (!parsedInput.ok) {
      return jsonError("Invalid license input.", 400, parsedInput.code);
    }

    const { value } = parsedInput;
    const { data, error } = await supabase.rpc("create_platform_portal_customer_license", {
      p_customer_id: value.customerId,
      p_product_code: value.productId,
      p_internal_reason: value.internalReason,
      p_idempotency_key: value.idempotencyKey,
    });

    if (error) {
      const mapped = mapLicenseProvisioningRpcError(error.message);
      return jsonError("Unable to create license.", mapped.status, mapped.code);
    }

    const parsed = parsePlatformPortalCustomerLicenseResult(data);
    if (!parsed) {
      return jsonError("Unable to create license.", 500, "unknown");
    }

    const status = parsed.idempotentReplay || !parsed.created ? 200 : 201;
    return NextResponse.json(parsed, { status, headers: NO_STORE });
  } catch {
    return jsonError("Unable to create license.", 500, "unknown");
  }
}
