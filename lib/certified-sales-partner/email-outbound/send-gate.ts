/**
 * Outbound marketing send gate for CSP sellers.
 * Transport stays fail-closed until Resend is configured AND owner unlocks marketing sends.
 */

import { sendCspOnboardingEmail, isCspOnboardingEmailConfigured } from "../onboarding-email";
import type { CspEmailOutboundStatus } from "../email-templates/types";

export type CspMarketingSendGateReason =
  | "ok"
  | "transport_not_configured"
  | "marketing_send_locked"
  | "lawful_basis_missing"
  | "recipient_not_allowlisted"
  | "reply_domain_missing"
  | "token_secret_missing"
  | "consent_not_verified"
  | "invalid_recipient"
  | "rate_limited"
  | "duplicate_idempotency"
  | "suspended_partner"
  | "certification_required"
  | "template_unavailable";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Owner unlock. The retired flag CSP_MARKETING_EMAIL_SEND_ENABLED does not unlock sending.
 * Required value: CSP_SALES_EMAIL_OUTBOUND=owner_approved
 */
export function isCspMarketingEmailSendUnlocked(): boolean {
  return process.env.CSP_SALES_EMAIL_OUTBOUND?.trim() === "owner_approved";
}

export function salesEmailAllowlist(): string[] {
  return (process.env.CSP_SALES_EMAIL_ALLOWLIST ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function salesEmailReplyDomain(): string {
  const domain = process.env.CSP_SALES_EMAIL_REPLY_DOMAIN?.trim().toLowerCase() ?? "";
  if (!domain || domain.includes("/") || domain.includes("@") || !domain.includes(".")) return "";
  return domain;
}

export function validateCspMarketingRecipient(email: string): boolean {
  const trimmed = email.trim().toLowerCase();
  if (trimmed.length < 5 || trimmed.length > 254) return false;
  if (!EMAIL_RE.test(trimmed)) return false;
  // Never hardcode the owner test address into app logic.
  return true;
}

export function evaluateCspMarketingSendGate(input: {
  partnerActive: boolean;
  productCertified: boolean;
  templateOk: boolean;
  recipient: string;
  consentVerified: boolean;
  idempotencySeen?: boolean;
  rateLimited?: boolean;
}): { allowed: boolean; reason: CspMarketingSendGateReason } {
  if (!input.partnerActive) return { allowed: false, reason: "suspended_partner" };
  if (!input.productCertified) return { allowed: false, reason: "certification_required" };
  if (!input.templateOk) return { allowed: false, reason: "template_unavailable" };
  if (!validateCspMarketingRecipient(input.recipient)) {
    return { allowed: false, reason: "invalid_recipient" };
  }
  if (!input.consentVerified) return { allowed: false, reason: "consent_not_verified" };
  if (input.rateLimited) return { allowed: false, reason: "rate_limited" };
  if (input.idempotencySeen) return { allowed: false, reason: "duplicate_idempotency" };
  if (!isCspOnboardingEmailConfigured()) return { allowed: false, reason: "transport_not_configured" };
  if (!isCspMarketingEmailSendUnlocked()) return { allowed: false, reason: "marketing_send_locked" };
  if (process.env.CSP_SALES_EMAIL_LAWFUL_BASIS?.trim() !== "owner_recorded") {
    return { allowed: false, reason: "lawful_basis_missing" };
  }
  if (!salesEmailAllowlist().includes(input.recipient.trim().toLowerCase())) {
    return { allowed: false, reason: "recipient_not_allowlisted" };
  }
  if (!salesEmailReplyDomain()) return { allowed: false, reason: "reply_domain_missing" };
  if ((process.env.CSP_SALES_EMAIL_TOKEN_SECRET?.trim().length ?? 0) < 16) {
    return { allowed: false, reason: "token_secret_missing" };
  }
  return { allowed: true, reason: "ok" };
}

export type CspMarketingSendResult = {
  status: CspEmailOutboundStatus;
  providerId?: string;
  error?: string;
  gateReason?: CspMarketingSendGateReason;
};

/**
 * Attempts outbound send only when the gate allows.
 * `accepted_by_provider` is NOT `delivered`.
 */
export async function sendCspMarketingEmail(input: {
  to: string;
  subject: string;
  html: string;
  text: string;
  idempotencyKey: string;
  replyTo?: string;
  gate: ReturnType<typeof evaluateCspMarketingSendGate>;
}): Promise<CspMarketingSendResult> {
  if (!input.gate.allowed) {
    return { status: "draft", gateReason: input.gate.reason };
  }
  if (!input.replyTo?.includes("@")) {
    return { status: "draft", gateReason: "reply_domain_missing" };
  }
  const result = await sendCspOnboardingEmail({
    to: input.to.trim().toLowerCase(),
    subject: input.subject,
    html: input.html,
    text: input.text,
    idempotencyKey: input.idempotencyKey,
    replyTo: input.replyTo,
  });
  if (result.status === "not_configured") {
    return { status: "failed", gateReason: "transport_not_configured", error: "not_configured" };
  }
  if (result.status === "failed") {
    return { status: "failed", error: result.error };
  }
  return {
    status: "accepted_by_provider",
    ...(result.providerId ? { providerId: result.providerId } : {}),
  };
}
