import { NextRequest, NextResponse } from "next/server";
import {
  assertPublicFormSubmission,
  logSuspiciousSubmission,
} from "@/lib/public-forms/bot-protection";
import {
  getSupportIntakeGateState,
  httpStatusForIntakeDenial,
  sanitizeSupportIntakePayload,
  submitSupportIntake,
} from "@/lib/support-intake";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { randomUUID } from "node:crypto";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/**
 * Public website support intake — fail-closed until Core apply + feature gate.
 * Bot protection at app layer; RPC is service_role-only (never anon EXECUTE).
 * Never accepts tenant/partner IDs from the client.
 */
export async function POST(request: NextRequest) {
  try {
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
          error: "Klientstyrte tenant-ID-er er ikke tillatt.",
          code: "forbidden",
          ...getSupportIntakeGateState(),
        },
        { status: 403, headers: NO_STORE },
      );
    }

    const guard = assertPublicFormSubmission(
      request,
      { ...body, email: typeof body.contactEmail === "string" ? body.contactEmail : body.email },
      "support_intake_web",
    );
    if (!guard.ok) {
      if (guard.log) {
        logSuspiciousSubmission(
          "support_intake_web",
          guard.log,
          request.headers.get("x-forwarded-for") ?? "unknown",
        );
      }
      return NextResponse.json(
        {
          error: "Forespørselen ble avvist.",
          code: guard.code === "rate_limited" ? "rate_limited" : "spam_rejected",
          ...getSupportIntakeGateState(),
        },
        {
          status: guard.status,
          headers: NO_STORE,
        },
      );
    }

    const sanitized = sanitizeSupportIntakePayload(body, "web");
    if (!sanitized.ok) {
      return NextResponse.json(
        { error: sanitized.message, code: "validation", ...getSupportIntakeGateState() },
        { status: 400, headers: NO_STORE },
      );
    }

    const gate = getSupportIntakeGateState();
    if (!gate.live) {
      const denied = await submitSupportIntake({
        payload: sanitized.value,
        actor: { kind: "guest" },
      });
      if (!denied.ok) {
        return NextResponse.json(
        {
          error: denied.message,
          code: denied.code,
          ...gate,
          live: false,
        },
          { status: httpStatusForIntakeDenial(denied.code), headers: NO_STORE },
        );
      }
    }

    let rpc;
    try {
      rpc = createServiceRoleClient();
    } catch {
      return NextResponse.json(
        {
          error: "Supportinntak er midlertidig utilgjengelig.",
          code: "unknown",
          ...gate,
          live: false,
        },
        { status: 503, headers: NO_STORE },
      );
    }

    const idempotencyKey =
      typeof body.idempotencyKey === "string" && body.idempotencyKey.trim().length >= 8
        ? body.idempotencyKey.trim().slice(0, 120)
        : randomUUID();

    const result = await submitSupportIntake({
      payload: sanitized.value,
      actor: { kind: "guest" },
      rpc,
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
      { error: "Kunne ikke sende henvendelsen.", code: "unknown" },
      { status: 500, headers: NO_STORE },
    );
  }
}
