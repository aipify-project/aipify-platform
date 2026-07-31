import { NextResponse } from "next/server";
import {
  mapCustomerIdentityRpcError,
  parsePlatformCustomerIdentityPayload,
  parseUpdateCustomerContactEmailInput,
  parseUpdateCustomerContactEmailResult,
} from "@/lib/platform-portal/customer-identity";
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

    const { data, error } = await supabase.rpc("get_platform_portal_customer_identity", {
      p_customer_id: customerId,
    });

    if (error) {
      const mapped = mapCustomerIdentityRpcError(error.message);
      return jsonError("Unable to load customer identity.", mapped.status, mapped.code);
    }

    const parsed = parsePlatformCustomerIdentityPayload(data);
    if (!parsed) {
      return jsonError("Unable to load customer identity.", 500, "unknown");
    }

    return NextResponse.json(parsed, { headers: NO_STORE });
  } catch {
    return jsonError("Unable to load customer identity.", 500, "unknown");
  }
}

export async function PATCH(
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

    const parsedInput = parseUpdateCustomerContactEmailInput(customerId, body);
    if (!parsedInput.ok) {
      return jsonError("Invalid customer identity input.", 400, parsedInput.code);
    }

    const { value } = parsedInput;
    const { data, error } = await supabase.rpc("update_platform_portal_customer_contact_email", {
      p_customer_id: value.customerId,
      p_email: value.email,
      p_expected_current_email: value.expectedCurrentEmail,
      p_confirmation: value.confirmation,
      p_internal_reason: value.reason,
      p_idempotency_key: value.idempotencyKey,
    });

    if (error) {
      const mapped = mapCustomerIdentityRpcError(error.message);
      return jsonError("Unable to update customer identity.", mapped.status, mapped.code);
    }

    const parsed = parseUpdateCustomerContactEmailResult(data);
    if (!parsed) {
      return jsonError("Unable to update customer identity.", 500, "unknown");
    }

    return NextResponse.json(parsed, { headers: NO_STORE });
  } catch {
    return jsonError("Unable to update customer identity.", 500, "unknown");
  }
}
