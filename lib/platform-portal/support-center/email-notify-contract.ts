/**
 * Support transactional email notify contract.
 * Fail-closed: EMAIL_DELIVERY_LIVE stays false until provider + domain + owner YES.
 * Do not reuse #383 sales/marketing sender for support case mail.
 */

export const SUPPORT_EMAIL_DELIVERY_LIVE = false as const;

export const SUPPORT_EMAIL_TEMPLATE_KEYS = [
  "case-created-to-customer",
  "new-case-to-support",
  "new-customer-reply-to-support",
  "public-reply-to-customer",
  "public-reply-to-partner",
  "case-closed",
  "case-reopened",
] as const;

export type SupportEmailTemplateKey = (typeof SUPPORT_EMAIL_TEMPLATE_KEYS)[number];

export const SUPPORT_EMAIL_PLACEHOLDERS = [
  "name",
  "ticket_number",
  "ticket_title",
  "secure_link",
  "brand",
] as const;

/** Official sender identity once activated — never invent live delivery. */
export const SUPPORT_EMAIL_SENDER_IDENTITY = {
  fromName: "Aipify Support",
  fromDomain: "aipify.ai",
  legalEntity: "Aipify Group AS",
} as const;

export function getSupportEmailNotifyGateState() {
  return {
    deliveryLive: SUPPORT_EMAIL_DELIVERY_LIVE,
    templateKeys: SUPPORT_EMAIL_TEMPLATE_KEYS,
    placeholders: SUPPORT_EMAIL_PLACEHOLDERS,
    sender: SUPPORT_EMAIL_SENDER_IDENTITY,
    note: "In-app inbox is the source of truth while email delivery stays off.",
  } as const;
}
