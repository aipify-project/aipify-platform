import { NextResponse } from "next/server";
import {
  ADMIN_PROVISION_INVITE_DELIVERY_CONNECTED,
  buildAdminProvisionPlan,
  buildAdminProvisionReadiness,
  isAdminProvisionOwnerAuthorized,
  mapAdminProvisionError,
  mapAdminProvisionRpcError,
  parseAdminProvisionPrepareInput,
  parseCustomerStatusFromDetail,
  parseMemberCountFromDetail,
} from "@/lib/platform-portal/admin-provisioning";
import { parsePlatformCustomerIdentityPayload } from "@/lib/platform-portal/customer-identity";
import { createClient } from "@/lib/supabase/server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const headers = { "Cache-Control": "no-store" };
const fail = (error: string, status: number, code: string) =>
  NextResponse.json({ error, code }, { status, headers });

async function loadReadiness(customerId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { kind: "unauthorized" as const };

  const [identityResult, detailResult] = await Promise.all([
    supabase.rpc("get_platform_portal_customer_identity", {
      p_customer_id: customerId,
    }),
    supabase.rpc("get_platform_portal_customer_detail", {
      p_customer_id: customerId,
    }),
  ]);

  if (identityResult.error) {
    const mapped = mapAdminProvisionRpcError(identityResult.error.message);
    return { kind: "rpc_error" as const, mapped };
  }
  if (detailResult.error) {
    const mapped = mapAdminProvisionRpcError(detailResult.error.message);
    return { kind: "rpc_error" as const, mapped };
  }

  const identity = parsePlatformCustomerIdentityPayload(identityResult.data);
  if (!identity) {
    if (identityResult.data == null && detailResult.data == null) {
      return { kind: "not_found" as const };
    }
    return { kind: "unknown" as const };
  }

  const readiness = buildAdminProvisionReadiness({
    customerId: identity.customerId,
    organizationId: identity.organizationId,
    slug: identity.slug,
    companyName: identity.companyName,
    contactEmail: identity.contactEmail,
    memberCount: parseMemberCountFromDetail(detailResult.data),
    customerStatus: parseCustomerStatusFromDetail(detailResult.data),
  });

  return { kind: "ok" as const, readiness };
}

/** READ — identity + member count readiness (no auth probe, no writes). */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    if (!UUID.test(id ?? "")) {
      return fail("Invalid customer id.", 400, "invalid_customer");
    }

    const loaded = await loadReadiness(id);
    if (loaded.kind === "unauthorized") {
      return fail("Unauthorized", 401, "unauthorized");
    }
    if (loaded.kind === "not_found") {
      return fail("Customer not found.", 404, "customer_not_found");
    }
    if (loaded.kind === "rpc_error") {
      return fail(
        "Unable to load administrator provisioning readiness.",
        loaded.mapped.status,
        loaded.mapped.code,
      );
    }
    if (loaded.kind === "unknown") {
      return fail(
        "Unable to load administrator provisioning readiness.",
        500,
        "unknown",
      );
    }

    return NextResponse.json(loaded.readiness, { headers });
  } catch {
    return fail(
      "Unable to load administrator provisioning readiness.",
      500,
      "unknown",
    );
  }
}

/**
 * PREPARE (default) — dry-run plan only.
 * EXECUTE — always fail-closed until owner allowlist + invite delivery contract.
 * Never calls Supabase Auth admin APIs, invite RPCs, or membership writes.
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

    const input = parseAdminProvisionPrepareInput(
      id ?? "",
      await request.json().catch(() => null),
    );
    if (!input.ok) {
      const mapped = mapAdminProvisionError(input.code);
      return fail(
        "Invalid administrator provisioning input.",
        mapped.status,
        mapped.code,
      );
    }

    if (input.value.mode === "execute") {
      if (!isAdminProvisionOwnerAuthorized(input.value.customerId)) {
        return fail(
          "Administrator provisioning execute requires a named owner authorization for this customer.",
          403,
          "owner_provision_authorization_required",
        );
      }
      if (!ADMIN_PROVISION_INVITE_DELIVERY_CONNECTED) {
        return fail(
          "Administrator invite/attach delivery is not connected. Execute remains blocked.",
          403,
          "invite_delivery_not_connected",
        );
      }
      // Defense in depth — even if both gates are opened incorrectly, refuse writes here.
      return fail(
        "Administrator provisioning execute is not available in this build.",
        403,
        "invite_delivery_not_connected",
      );
    }

    const loaded = await loadReadiness(input.value.customerId);
    if (loaded.kind === "unauthorized") {
      return fail("Unauthorized", 401, "unauthorized");
    }
    if (loaded.kind === "not_found") {
      return fail("Customer not found.", 404, "customer_not_found");
    }
    if (loaded.kind === "rpc_error") {
      return fail(
        "Unable to prepare administrator provisioning.",
        loaded.mapped.status,
        loaded.mapped.code,
      );
    }
    if (loaded.kind === "unknown") {
      return fail(
        "Unable to prepare administrator provisioning.",
        500,
        "unknown",
      );
    }

    if (!loaded.readiness.readyForAdminPrepare) {
      return fail(
        "Customer is not eligible for administrator prepare.",
        422,
        "tenant_inactive",
      );
    }

    const plan = buildAdminProvisionPlan({
      readiness: loaded.readiness,
      adminEmail: input.value.adminEmail,
      role: input.value.role,
      internalReason: input.value.internalReason,
      idempotencyKey: input.value.idempotencyKey,
    });

    return NextResponse.json(plan, { headers });
  } catch {
    return fail(
      "Unable to prepare administrator provisioning.",
      500,
      "unknown",
    );
  }
}
