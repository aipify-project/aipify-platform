import { NextResponse } from "next/server";
import {
  mapInterestRpcError,
  validatePersonalPageInterest,
} from "@/lib/personal-sales-page/interest";
import { personalSalesLeadEnabled, rejectClientSellerIdentity } from "@/lib/personal-sales-page/lead-gate";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/**
 * Public interest registration.
 * Seller identity comes only from the public page code resolved in Core.
 * The browser never supplies a seller id, and visitors never get table access.
 * The form gate is ON; Core still resolves the seller from the public code only.
 */
export async function POST(request: Request) {
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  if (rejectClientSellerIdentity(body)) {
    return NextResponse.json(
      { ok: false, stored: false, duplicate: false, error: "rejected_identity" },
      { status: 400, headers: NO_STORE },
    );
  }

  if (!personalSalesLeadEnabled()) {
    return NextResponse.json(
      { ok: false, stored: false, duplicate: false, error: "core_pending" },
      { status: 503, headers: NO_STORE },
    );
  }

  const validated = validatePersonalPageInterest(body);
  if (!validated.ok) {
    const status =
      validated.error === "rejected_identity"
        ? 400
        : validated.error === "acknowledgement_required" || validated.error === "invalid_email" || validated.error === "invalid_name"
          ? 400
          : validated.error === "rate_limited"
            ? 429
            : 400;
    return NextResponse.json(
      { ok: false, stored: false, duplicate: false, error: validated.error },
      { status, headers: NO_STORE },
    );
  }

  try {
    const admin = createServiceRoleClient();
    const { data, error } = await admin.rpc("register_personal_sales_page_interest", {
      p_code: validated.value.code,
      p_email: validated.value.email,
      p_display_name: validated.value.displayName,
      p_product_key: validated.value.productKey,
      p_locale: validated.value.locale,
      p_idempotency_key: validated.value.idempotencyKey,
      p_follow_up_acknowledged: true,
      p_company_website: validated.value.companyWebsite,
    });

    if (error) {
      return NextResponse.json(
        { ok: false, stored: false, duplicate: false, error: "closed" },
        { status: 503, headers: NO_STORE },
      );
    }

    const payload = data && typeof data === "object" ? (data as Record<string, unknown>) : null;
    if (!payload) {
      return NextResponse.json(
        { ok: false, stored: false, duplicate: false, error: "closed" },
        { status: 503, headers: NO_STORE },
      );
    }

    if (payload.ok === true) {
      return NextResponse.json(
        {
          ok: true,
          stored: payload.stored === true,
          duplicate: payload.duplicate === true,
        },
        { headers: NO_STORE },
      );
    }

    const mapped = mapInterestRpcError(payload);
    return NextResponse.json(
      { ok: false, stored: false, duplicate: false, error: mapped },
      {
        status: mapped === "rate_limited" ? 429 : mapped === "closed" ? 403 : 400,
        headers: NO_STORE,
      },
    );
  } catch {
    return NextResponse.json(
      { ok: false, stored: false, duplicate: false, error: "closed" },
      { status: 503, headers: NO_STORE },
    );
  }
}
