import { NextResponse } from "next/server";
import {
  AGREEMENT_APPROVAL_EXECUTE_ENABLED,
  buildAgreementApprovalPreparePlan,
  mapAgreementApprovalPrepareError,
  parseAgreementApprovalPrepareInput,
} from "@/lib/platform-portal/agreement-approval-prepare";
import { ADMIN_PROVISION_OWNER_ALLOWLIST } from "@/lib/platform-portal/admin-provisioning";
import { parsePlatformPortalCommercialPlansPayload } from "@/lib/platform-portal/commercial-plan";
import { KOMPIS_BEDRIFT_ACTIVATE_OWNER_ALLOWLIST } from "@/lib/platform-portal/kompis-bedrift-activation";
import { parsePlatformPortalCustomersPayload } from "@/lib/platform-portal/parse";
import { createClient } from "@/lib/supabase/server";

const headers = { "Cache-Control": "no-store" };
const fail = (error: string, status: number, code: string) =>
  NextResponse.json({ error, code }, { status, headers });

/**
 * D2 PREPARE — read-only agreement & owner-approval readiness for a NEW
 * customer candidate. Never creates customers, never sets commercial plans,
 * never writes legal acceptance. mode=execute is always fail-closed here.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return fail("Unauthorized", 401, "unauthorized");

    const parsed = parseAgreementApprovalPrepareInput(
      await request.json().catch(() => null),
    );
    if (!parsed.ok) {
      const mapped = mapAgreementApprovalPrepareError(parsed.code);
      return fail(
        "Invalid agreement approval prepare input.",
        mapped.status,
        mapped.code,
      );
    }

    if (parsed.value.mode === "execute") {
      if (!AGREEMENT_APPROVAL_EXECUTE_ENABLED) {
        return fail(
          "D2 agreement approval execute is not enabled. Prepare-only.",
          403,
          "agreement_execute_not_enabled",
        );
      }
      return fail(
        "Agreement approval execute requires a named owner authorization.",
        403,
        "owner_agreement_authorization_required",
      );
    }

    const [customersResult, plansResult] = await Promise.all([
      supabase.rpc("get_platform_portal_customers"),
      supabase.rpc("get_platform_portal_commercial_plans"),
    ]);

    if (customersResult.error) {
      const message = (customersResult.error.message ?? "").toUpperCase();
      if (message.includes("ACCESS DENIED") || message.includes("PLATFORM")) {
        return fail("Forbidden", 403, "forbidden");
      }
      return fail(
        "Unable to prepare agreement approval.",
        500,
        "unknown",
      );
    }

    if (plansResult.error) {
      const message = (plansResult.error.message ?? "").toUpperCase();
      if (message.includes("ACCESS DENIED") || message.includes("PLATFORM")) {
        return fail("Forbidden", 403, "forbidden");
      }
      return fail(
        "Unable to prepare agreement approval.",
        500,
        "unknown",
      );
    }

    const registry = parsePlatformPortalCustomersPayload(customersResult.data);
    const catalog = parsePlatformPortalCommercialPlansPayload(plansResult.data);

    const plan = buildAgreementApprovalPreparePlan({
      creation: parsed.value.input,
      registryRows: registry.customers.map((customer) => ({
        customerId: customer.customerId,
        organizationNumber: customer.organizationNumber,
        organizationSlug: customer.organizationSlug,
      })),
      commercialPlans: catalog.plans,
      internalReason: parsed.value.internalReason,
      idempotencyKey: parsed.value.idempotencyKey,
      proposedPlanKey: parsed.value.proposedPlanKey,
      adminProvisionAllowlistEmpty: ADMIN_PROVISION_OWNER_ALLOWLIST.size === 0,
      bedriftActivateAllowlistEmpty:
        KOMPIS_BEDRIFT_ACTIVATE_OWNER_ALLOWLIST.size === 0,
    });

    return NextResponse.json(plan, { headers });
  } catch {
    return fail("Unable to prepare agreement approval.", 500, "unknown");
  }
}
