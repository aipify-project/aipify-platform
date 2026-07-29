import { NextResponse } from "next/server";
import {
  mapDomainInstallationRpcError,
  parseCreateDomainInstallationInput,
  parsePlatformPortalCustomerDomainInstallationResult,
} from "@/lib/platform-portal/domain-installation";
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

    const parsedInput = parseCreateDomainInstallationInput(customerId, body);
    if (!parsedInput.ok) {
      return jsonError("Invalid domain installation input.", 400, parsedInput.code);
    }

    const { value } = parsedInput;
    const { data, error } = await supabase.rpc(
      "create_platform_portal_customer_domain_installation",
      {
        p_customer_id: value.customerId,
        p_license_id: value.licenseId,
        p_hostname: value.hostname,
        p_internal_reason: value.internalReason,
        p_idempotency_key: value.idempotencyKey,
      },
    );

    if (error) {
      const mapped = mapDomainInstallationRpcError(error.message);
      return jsonError(
        "Unable to create domain and installation.",
        mapped.status,
        mapped.code,
      );
    }

    const parsed = parsePlatformPortalCustomerDomainInstallationResult(data);
    if (!parsed) {
      return jsonError("Unable to create domain and installation.", 500, "unknown");
    }

    const created = parsed.created.domain || parsed.created.installation;
    const status = parsed.idempotentReplay || !created ? 200 : 201;
    return NextResponse.json(parsed, { status, headers: NO_STORE });
  } catch {
    return jsonError("Unable to create domain and installation.", 500, "unknown");
  }
}
