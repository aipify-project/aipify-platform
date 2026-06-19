const BILLING_ADVISOR_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\b(subscription|plan|abonnement|prenumeration)\b/i, key: "subscription" },
  { pattern: /\b(invoice|faktura|overdue|forfalt|forfaldne)\b/i, key: "invoice" },
  { pattern: /\b(vat|mva|moms|tax|skatt|reverse charge)\b/i, key: "vat" },
  { pattern: /\b(license|lisens|licence|capacity|kapasitet)\b/i, key: "license" },
  { pattern: /\b(business pack|domene|domain license)\b/i, key: "business_pack" },
  { pattern: /\b(partner|commission|provisjon|attribusjon)\b/i, key: "partner" },
  { pattern: /\b(billing profile|faktureringsprofil)\b/i, key: "profile" },
  { pattern: /\b(refund|credit note|tilbakebetaling)\b/i, key: "refund" },
];

export function detectUnifiedBillingIntent(message: string): string | null {
  const text = message.trim();
  if (!text) return null;
  for (const { pattern, key } of BILLING_ADVISOR_PATTERNS) {
    if (pattern.test(text)) return key;
  }
  return null;
}

export function getUnifiedBillingAdvisorRoute(intent: string | null): string {
  switch (intent) {
    case "profile":
      return "/app/billing/profile";
    case "invoice":
      return "/app/billing/invoices";
    case "license":
    case "business_pack":
      return "/app/license";
    case "vat":
      return "/app/settings/billing/checkout-vat";
    case "partner":
      return "/app/billing";
    default:
      return "/app/billing";
  }
}
