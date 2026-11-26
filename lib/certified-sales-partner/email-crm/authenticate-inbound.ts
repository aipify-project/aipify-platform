import { verifyCspInboundWebhookSignature } from "../email-inbound/webhook-contract";
import { verifyResendSvixSignature } from "./svix";

export function authenticateInboundRequest(input: {
  rawBody: string;
  headers: Headers;
  now?: number;
}): { ok: true } | { ok: false; status: number; body: Record<string, unknown> } {
  const svixSecret = process.env.RESEND_WEBHOOK_SECRET?.trim() ?? "";
  const hmacSecret = process.env.CSP_SALES_EMAIL_INBOUND_SECRET?.trim() ?? "";
  if (!svixSecret && !hmacSecret) {
    return {
      ok: false,
      status: 503,
      body: {
        accepted: false,
        reason: "inbound_not_configured",
        real_inbound_e2e: "REAL_INBOUND_E2E_BLOCKED",
      },
    };
  }
  const svixOk = svixSecret
    ? verifyResendSvixSignature({
        secret: svixSecret,
        body: input.rawBody,
        id: input.headers.get("svix-id"),
        timestamp: input.headers.get("svix-timestamp"),
        signature: input.headers.get("svix-signature"),
        now: input.now,
      })
    : false;
  const hmacOk = hmacSecret
    ? verifyCspInboundWebhookSignature({
        rawBody: input.rawBody,
        signatureHeader: input.headers.get("x-aipify-sales-email-signature"),
        secret: hmacSecret,
      })
    : false;
  if (!svixOk && !hmacOk) {
    return { ok: false, status: 401, body: { accepted: false, reason: "invalid_signature" } };
  }
  return { ok: true };
}
