/**
 * Fail-closed send gate. A lead, a click, or a reply is never a sale.
 * Marketing send stays closed until the owner has authorized transport,
 * a single allowlisted recipient, and a recorded lawful basis outside this UI.
 */
import { CSP_LINK_ELIGIBLE_PARTNER_STATUSES } from "../partner-overview";
import { AIPIFY_INTERNAL_SALES_TENANT } from "./catalog";

export const SALES_EMAIL_DELIVERY_STATUSES = [
  "draft",
  "queued",
  "accepted_by_provider",
  "delivered",
  "bounced",
  "failed",
] as const;
export type SalesEmailDeliveryStatus = (typeof SALES_EMAIL_DELIVERY_STATUSES)[number];

export type SalesEmailSendBlock =
  | "template_locale_unavailable"
  | "partner_not_eligible"
  | "product_not_certified"
  | "referral_link_missing"
  | "seller_company_missing"
  | "seller_contact_missing"
  | "recipient_invalid"
  | "recipient_suppressed"
  | "multiple_recipients"
  | "lawful_basis_not_verified"
  | "outbound_not_owner_approved"
  | "recipient_not_allowlisted"
  | "transport_not_configured"
  | "reply_domain_not_configured"
  | "token_secret_missing"
  | "persistence_not_ready"
  | "rate_limited"
  | "idempotency_key_required"
  | "tenant_not_enabled";

export type SalesEmailSendContext = {
  tenantId: string;
  partnerStatus: string | null;
  productCertified: boolean;
  referralUrl: string | null;
  sellerCompany: string | null;
  sellerContact: string | null;
  templatePublished: boolean;
  recipients: string[];
  suppressed: boolean;
  lawfulBasisRecorded: boolean;
  outboundOwnerApproved: boolean;
  recipientAllowlisted: boolean;
  transportConfigured: boolean;
  replyDomainConfigured: boolean;
  tokenSecretConfigured: boolean;
  persistenceReady: boolean;
  rateLimited: boolean;
  idempotencyKey: string | null;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmailAddress(value: string): string {
  const wrapped = value.match(/<([^>]+)>/);
  return (wrapped?.[1] ?? value).trim().toLowerCase();
}

export function isSingleEmailAddress(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || /[,;\s]/.test(trimmed)) return false;
  return EMAIL_RE.test(trimmed) && trimmed.length <= 254;
}

export function evaluateSalesEmailSend(ctx: SalesEmailSendContext): { ok: true } | { ok: false; code: SalesEmailSendBlock } {
  if (ctx.tenantId !== AIPIFY_INTERNAL_SALES_TENANT) return { ok: false, code: "tenant_not_enabled" };
  if (!ctx.templatePublished) return { ok: false, code: "template_locale_unavailable" };
  if (!ctx.partnerStatus || !(CSP_LINK_ELIGIBLE_PARTNER_STATUSES as readonly string[]).includes(ctx.partnerStatus)) {
    return { ok: false, code: "partner_not_eligible" };
  }
  if (!ctx.productCertified) return { ok: false, code: "product_not_certified" };
  if (!ctx.referralUrl) return { ok: false, code: "referral_link_missing" };
  if (!ctx.sellerCompany?.trim()) return { ok: false, code: "seller_company_missing" };
  if (!ctx.sellerContact || !isSingleEmailAddress(ctx.sellerContact)) return { ok: false, code: "seller_contact_missing" };
  if (ctx.recipients.length !== 1) return { ok: false, code: "multiple_recipients" };
  if (!isSingleEmailAddress(ctx.recipients[0] ?? "")) return { ok: false, code: "recipient_invalid" };
  if (ctx.suppressed) return { ok: false, code: "recipient_suppressed" };
  if (!ctx.idempotencyKey || ctx.idempotencyKey.trim().length < 8) return { ok: false, code: "idempotency_key_required" };
  if (ctx.rateLimited) return { ok: false, code: "rate_limited" };
  if (!ctx.lawfulBasisRecorded) return { ok: false, code: "lawful_basis_not_verified" };
  if (!ctx.outboundOwnerApproved) return { ok: false, code: "outbound_not_owner_approved" };
  if (!ctx.recipientAllowlisted) return { ok: false, code: "recipient_not_allowlisted" };
  if (!ctx.transportConfigured) return { ok: false, code: "transport_not_configured" };
  if (!ctx.replyDomainConfigured) return { ok: false, code: "reply_domain_not_configured" };
  if (!ctx.tokenSecretConfigured) return { ok: false, code: "token_secret_missing" };
  if (!ctx.persistenceReady) return { ok: false, code: "persistence_not_ready" };
  return { ok: true };
}

/** A sales email event never creates a sale or a commission entry. */
export function salesEffectOfEmailEvent(): { createsSale: false; createsCommission: false } {
  return { createsSale: false, createsCommission: false };
}

export function readOutboundOwnerGate(env: NodeJS.ProcessEnv = process.env): {
  outboundOwnerApproved: boolean;
  lawfulBasisRecorded: boolean;
  allowlist: string[];
  transportConfigured: boolean;
  replyDomainConfigured: boolean;
  tokenSecretConfigured: boolean;
} {
  const allowlist = (env.CSP_SALES_EMAIL_ALLOWLIST ?? "")
    .split(",")
    .map((item) => normalizeEmailAddress(item))
    .filter((item) => isSingleEmailAddress(item));
  return {
    outboundOwnerApproved: env.CSP_SALES_EMAIL_OUTBOUND === "owner_approved",
    lawfulBasisRecorded: env.CSP_SALES_EMAIL_LAWFUL_BASIS === "owner_recorded",
    allowlist,
    transportConfigured: Boolean(env.RESEND_API_KEY?.trim()),
    replyDomainConfigured: Boolean(env.CSP_SALES_EMAIL_REPLY_DOMAIN?.trim()),
    tokenSecretConfigured: (env.CSP_SALES_EMAIL_TOKEN_SECRET?.trim().length ?? 0) >= 16,
  };
}
