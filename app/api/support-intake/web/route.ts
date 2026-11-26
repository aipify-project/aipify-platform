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

const NO_STORE = { "Cache-Control": "no-store" } as const;

/**
 * Public website support intake — fail-closed until Core write RPCs apply.
 * Uses the same bot-protection stack as book-demo / early-access.
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

    const result = await submitSupportIntake({
      payload: sanitized.value,
      actor: { kind: "guest" },
    });

    if (!result.ok) {
      return NextResponse.json(
        {
          error: result.message,
          code: result.code,
          ...getSupportIntakeGateState(),
        },
        { status: httpStatusForIntakeDenial(result.code), headers: NO_STORE },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        ticketId: result.ticketId,
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
