import { NextResponse } from "next/server";
import {
  CUSTOMER_CREATE_EXECUTE_ENABLED,
  buildCustomerCreatePreparePlan,
  mapCustomerCreatePrepareError,
  parseCustomerCreatePrepareInput,
} from "@/lib/platform-portal/create-customer-prepare";
import { parsePlatformPortalCustomersPayload } from "@/lib/platform-portal/parse";
import { createClient } from "@/lib/supabase/server";

const headers = { "Cache-Control": "no-store" };
const fail = (error: string, status: number, code: string) =>
  NextResponse.json({ error, code }, { status, headers });

/**
 * D1 PREPARE — read-only dry-run for new customer identity.
 * Never calls create_platform_portal_customer.
 * mode=execute is always fail-closed in this job.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return fail("Unauthorized", 401, "unauthorized");

    const parsed = parseCustomerCreatePrepareInput(
      await request.json().catch(() => null),
    );
    if (!parsed.ok) {
      const mapped = mapCustomerCreatePrepareError(parsed.code);
      return fail(
        "Invalid customer creation prepare input.",
        mapped.status,
        mapped.code,
      );
    }

    if (parsed.value.mode === "execute") {
      if (!CUSTOMER_CREATE_EXECUTE_ENABLED) {
        return fail(
          "D1 customer create execute is not enabled. Prepare-only.",
          403,
          "create_execute_not_enabled",
        );
      }
      return fail(
        "Customer create execute requires a named owner authorization.",
        403,
        "owner_create_authorization_required",
      );
    }

    const { data, error } = await supabase.rpc("get_platform_portal_customers");
    if (error) {
      const message = (error.message ?? "").toUpperCase();
      if (message.includes("ACCESS DENIED") || message.includes("PLATFORM")) {
        return fail("Forbidden", 403, "forbidden");
      }
      return fail(
        "Unable to prepare customer creation.",
        500,
        "unknown",
      );
    }

    const registry = parsePlatformPortalCustomersPayload(data);
    const plan = buildCustomerCreatePreparePlan({
      creation: parsed.value.input,
      registryRows: registry.customers.map((customer) => ({
        customerId: customer.customerId,
        organizationNumber: customer.organizationNumber,
        organizationSlug: customer.organizationSlug,
      })),
      internalReason: parsed.value.internalReason,
      idempotencyKey: parsed.value.idempotencyKey,
    });

    return NextResponse.json(plan, { headers });
  } catch {
    return fail("Unable to prepare customer creation.", 500, "unknown");
  }
}
