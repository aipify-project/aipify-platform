/**
 * Inbound reply webhook contract — fail-closed until provider secrets + domain exist.
 * Never trust From / Reply-To / Subject / client partner_id as authorization.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

export const CSP_EMAIL_INBOUND_EVENT_TYPES = [
  "email.replied",
  "email.bounced",
  "email.delivered",
  "email.failed",
  "email.complained",
] as const;
export type CspEmailInboundEventType = (typeof CSP_EMAIL_INBOUND_EVENT_TYPES)[number];

export type CspInboundCorrelation = {
  /** Opaque server-issued token embedded in Reply-To / headers at send time. */
  conversationToken: string;
  outboundMessageId: string;
  partnerId: string;
  productKey: string;
  tenantScope: "aipify_internal";
};

export type CspInboundVerifyResult =
  | { ok: true; eventId: string; eventType: CspEmailInboundEventType }
  | {
      ok: false;
      reason:
        | "inbound_not_configured"
        | "invalid_signature"
        | "invalid_payload"
        | "unknown_event"
        | "duplicate_event";
    };

export function isCspEmailInboundConfigured(): boolean {
  return Boolean(process.env.CSP_EMAIL_INBOUND_WEBHOOK_SECRET?.trim());
}

export function verifyCspInboundWebhookSignature(input: {
  rawBody: string;
  signatureHeader: string | null;
  secret?: string;
}): boolean {
  const secret = (input.secret ?? process.env.CSP_EMAIL_INBOUND_WEBHOOK_SECRET ?? "").trim();
  if (!secret || !input.signatureHeader) return false;
  const expected = createHmac("sha256", secret).update(input.rawBody, "utf8").digest("hex");
  const provided = input.signatureHeader.replace(/^sha256=/i, "").trim();
  try {
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(provided, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/** Autoreply / bounce / OOO must not create leads. */
export function isLikelyNonHumanInbound(headers: Record<string, string>): boolean {
  const auto = (headers["auto-submitted"] || headers["Auto-Submitted"] || "").toLowerCase();
  if (auto && auto !== "no") return true;
  const precedence = (headers.precedence || headers.Precedence || "").toLowerCase();
  if (precedence === "bulk" || precedence === "junk" || precedence === "list") return true;
  const xAuto = (headers["x-autoreply"] || headers["X-Autoreply"] || "").toLowerCase();
  if (xAuto === "yes" || xAuto === "true") return true;
  return false;
}

export type CspInboundDisposition =
  | "create_or_attach_lead"
  | "transport_event_only"
  | "quarantine_manual_review"
  | "ignore_duplicate";

export function decideCspInboundDisposition(input: {
  signatureOk: boolean;
  correlationFound: boolean;
  partnerActive: boolean;
  nonHuman: boolean;
  duplicateEvent: boolean;
}): CspInboundDisposition {
  if (input.duplicateEvent) return "ignore_duplicate";
  if (!input.signatureOk || !input.correlationFound) return "quarantine_manual_review";
  if (!input.partnerActive) return "quarantine_manual_review";
  if (input.nonHuman) return "transport_event_only";
  return "create_or_attach_lead";
}

export const CSP_EMAIL_INBOUND_BLOCKERS = [
  "Set CSP_EMAIL_INBOUND_WEBHOOK_SECRET on the Vercel project",
  "Configure Resend (or chosen provider) inbound domain on a verified Aipify-owned domain",
  "Point inbound webhook to /api/certified-sales-partner/email/inbound",
  "Apply PREPARED_ONLY SQL csp_sales_email_crm_v1 on Staging before Production",
  "Owner-approve a single test send and reply before claiming REAL_INBOUND_E2E_VERIFIED",
] as const;
