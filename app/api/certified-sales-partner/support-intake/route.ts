import { NextRequest, NextResponse } from "next/server";
import {
  getSupportIntakeGateState,
  httpStatusForIntakeDenial,
  sanitizeSupportIntakePayload,
  submitSupportIntake,
} from "@/lib/support-intake";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/**
 * CSP support intake — fail-closed until Core write RPCs apply.
 * Partner identity must come from the signed session, never the body.
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

    // Reject client-supplied partner/tenant IDs explicitly.
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

    const sanitized = sanitizeSupportIntakePayload(body, "partner");
    if (!sanitized.ok) {
      return NextResponse.json(
        { error: sanitized.message, code: "validation", ...getSupportIntakeGateState() },
        { status: 400, headers: NO_STORE },
      );
    }

    // Partner profile resolution is deferred to Core apply; until then fail-closed.
    // We still require an authenticated user so the route is not anonymously probeable.
    const partnerId = "session_pending_core";

    const result = await submitSupportIntake({
      payload: sanitized.value,
      actor: { kind: "partner", userId: user.id, partnerId },
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
      { error: "Kunne ikke opprette supportsak.", code: "unknown" },
      { status: 500, headers: NO_STORE },
    );
  }
}
