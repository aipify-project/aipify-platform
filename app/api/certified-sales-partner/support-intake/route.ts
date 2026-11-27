import { NextRequest, NextResponse } from "next/server";
import { resolveCspPartnerScope } from "@/lib/certified-sales-partner/partner-scoped-read";
import {
  getSupportIntakeGateState,
  httpStatusForIntakeDenial,
  sanitizeSupportIntakePayload,
  submitSupportIntake,
} from "@/lib/support-intake";
import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "node:crypto";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/**
 * CSP support intake — fail-closed until Core write RPCs apply + feature gate ON.
 * Partner identity comes from the signed session via Core profile lookup.
 * Does not touch csp_sales_email_* CRM tables.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", code: "unauthorized", ...getSupportIntakeGateState() },
        { status: 401, headers: NO_STORE },
      );
    }

    const body = (await request.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;
    if (!body) {
      return NextResponse.json(
        { error: "Ugyldig forespørsel.", code: "validation" },
        { status: 400, headers: NO_STORE },
      );
    }

    if (
      body.partner_id != null ||
      body.partnerId != null ||
      body.tenant_id != null ||
      body.company_id != null
    ) {
      return NextResponse.json(
        {
          error: "Klientstyrte partner-/tenant-ID-er er ikke tillatt.",
          code: "forbidden",
          ...getSupportIntakeGateState(),
        },
        { status: 403, headers: NO_STORE },
      );
    }

    const scope = await resolveCspPartnerScope(user.id);
    if (!scope.ok) {
      return NextResponse.json(
        {
          error: "Partnerkontoen har ikke tilgang.",
          code: "forbidden",
          ...getSupportIntakeGateState(),
        },
        { status: 403, headers: NO_STORE },
      );
    }

    const sanitized = sanitizeSupportIntakePayload(body, "partner");
    if (!sanitized.ok) {
      return NextResponse.json(
        { error: sanitized.message, code: "validation", ...getSupportIntakeGateState() },
        { status: 400, headers: NO_STORE },
      );
    }

    const idempotencyKey =
      typeof body.idempotencyKey === "string" && body.idempotencyKey.trim().length >= 8
        ? body.idempotencyKey.trim().slice(0, 120)
        : randomUUID();

    const result = await submitSupportIntake({
      payload: sanitized.value,
      actor: { kind: "partner", userId: user.id, partnerId: scope.partnerId },
      rpc: supabase,
      idempotencyKey,
    });

    if (!result.ok) {
      return NextResponse.json(
        {
          error: result.message,
          code: result.code,
          ...getSupportIntakeGateState(),
          live: false,
        },
        { status: httpStatusForIntakeDenial(result.code), headers: NO_STORE },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        live: true,
        ticket_id: result.ticketId,
        ticketId: result.ticketId,
        ticket_number: result.ticketNumber,
        ticketNumber: result.ticketNumber,
        source: result.source,
      },
      { headers: NO_STORE },
    );
  } catch {
    return NextResponse.json(
      { error: "Kunne ikke opprette supportsak.", code: "unknown" },
      { status: 500, headers: NO_STORE },
    );
  }
}
