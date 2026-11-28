import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import {
  assertPublicFormHumanChecks,
  logSuspiciousSubmission,
} from "@/lib/public-forms/bot-protection";
import {
  consumeSharedRateLimit,
  PUBLIC_SUPPORT_INTAKE_RATE,
} from "@/lib/public-forms/shared-rate-limit";
import {
  getSupportIntakeGateState,
  httpStatusForIntakeDenial,
  sanitizeSupportIntakePayload,
  submitSupportIntake,
} from "@/lib/support-intake";
import { readSupportIntakeIdempotencyKey } from "@/lib/support-intake/idempotency";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

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

    const guard = assertPublicFormHumanChecks({
      ...body,
      email: typeof body.contactEmail === "string" ? body.contactEmail : body.email,
    });
    if (!guard.ok && guard.log === "honeypot") {
      logSuspiciousSubmission(
        "support_intake_web",
        guard.log,
        request.headers.get("x-forwarded-for") ?? "unknown",
      );
      return NextResponse.json(
        {
          error: "Forespørselen ble avvist.",
          code: "spam_rejected",
          ...getSupportIntakeGateState(),
          live: false,
        },
        { status: guard.status, headers: NO_STORE },
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const rateKey = `aipify:public-support:v1:${createHash("sha256").update(ip).digest("hex")}`;
    const rate = await consumeSharedRateLimit({
      key: rateKey,
      limit: PUBLIC_SUPPORT_INTAKE_RATE.limit,
      windowSeconds: PUBLIC_SUPPORT_INTAKE_RATE.windowSeconds,
    });
    if (!rate.ok) {
      if (rate.status === 429) {
        logSuspiciousSubmission("support_intake_web", "rate_limit", ip);
      }
      return NextResponse.json(
        {
          error:
            rate.status === 429
              ? "Forespørselen ble avvist."
              : "Supportinntak er midlertidig utilgjengelig.",
          code: rate.status === 429 ? "rate_limited" : "rate_limit_unavailable",
          ...getSupportIntakeGateState(),
          live: false,
        },
        { status: rate.status, headers: NO_STORE },
      );
    }

    if (!guard.ok) {
      if (guard.log) {
        logSuspiciousSubmission("support_intake_web", guard.log, ip);
      }
      return NextResponse.json(
        {
          error: "Forespørselen ble avvist.",
          code: "spam_rejected",
          ...getSupportIntakeGateState(),
          live: false,
        },
        { status: guard.status, headers: NO_STORE },
      );
    }

    const sanitized = sanitizeSupportIntakePayload(body, "web");
    if (!sanitized.ok) {
      return NextResponse.json(
        {
          error: sanitized.message,
          code: "validation",
          field: sanitized.field,
          ...getSupportIntakeGateState(),
        },
        { status: 400, headers: NO_STORE },
      );
    }

    const gate = getSupportIntakeGateState();
    const idempotencyKey = readSupportIntakeIdempotencyKey(body);
    if (!idempotencyKey) {
      return NextResponse.json(
        {
          error: "Forespørselen mangler en gyldig referanse for dette forsøket.",
          code: "validation",
          field: "request",
          ...gate,
          live: false,
        },
        { status: 400, headers: NO_STORE },
      );
    }

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
