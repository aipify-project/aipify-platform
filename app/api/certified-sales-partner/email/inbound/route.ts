import { NextResponse } from "next/server";
import {
  CSP_EMAIL_INBOUND_BLOCKERS,
  decideCspInboundDisposition,
  isCspEmailInboundConfigured,
  isLikelyNonHumanInbound,
  verifyCspInboundWebhookSignature,
} from "@/lib/certified-sales-partner/email-inbound/webhook-contract";

export const runtime = "nodejs";

/**
 * Inbound marketing reply webhook — fail-closed until secrets + SQL exist.
 * Does not create leads until Core CRM RPCs are applied.
 */
export async function POST(request: Request) {
  if (!isCspEmailInboundConfigured()) {
    return NextResponse.json(
      {
        accepted: false,
        reason: "inbound_not_configured",
        blockers: CSP_EMAIL_INBOUND_BLOCKERS,
        real_inbound_e2e: "REAL_INBOUND_E2E_BLOCKED",
      },
      { status: 503 },
    );
  }

  const rawBody = await request.text();
  const signature =
    request.headers.get("x-resend-signature") ||
    request.headers.get("svix-signature") ||
    request.headers.get("x-aipify-inbound-signature");

  const signatureOk = verifyCspInboundWebhookSignature({
    rawBody,
    signatureHeader: signature,
  });

  const payload = (() => {
    try {
      return JSON.parse(rawBody) as Record<string, unknown>;
    } catch {
      return null;
    }
  })();

  if (!payload) {
    return NextResponse.json({ accepted: false, reason: "invalid_payload" }, { status: 400 });
  }

  const headers: Record<string, string> = {};
  for (const [k, v] of request.headers.entries()) headers[k] = v;
  const nonHuman = isLikelyNonHumanInbound(headers);
  const disposition = decideCspInboundDisposition({
    signatureOk,
    correlationFound: false, // Core correlation RPC not applied yet
    partnerActive: false,
    nonHuman,
    duplicateEvent: false,
  });

  return NextResponse.json({
    accepted: signatureOk,
    disposition,
    real_inbound_e2e: "REAL_INBOUND_E2E_BLOCKED",
    note: "Signature checked; lead creation awaits PREPARED_ONLY SQL + correlation token store.",
  });
}
