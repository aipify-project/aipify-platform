/**
 * Authoritative Aipify Group AS domain ownership policy.
 *
 * Aipify Group AS does not own `aipify.com`. That string must never be used for
 * active identities, fixtures, migration defaults, or customer-facing examples.
 * Primary email/product domain: `aipify.ai`.
 *
 * Ordinary external customers may use their own email domains.
 * Internal Aipify identities must use an owned Aipify email domain.
 * `aipify.com` is always rejected.
 */

export const AIPIFY_PRIMARY_EMAIL_DOMAIN = "aipify.ai" as const;

/** Domains Aipify Group AS may use for product / identity (extend only when owned). */
export const AIPIFY_OWNED_EMAIL_DOMAINS = [AIPIFY_PRIMARY_EMAIL_DOMAIN] as const;

/** Explicitly not owned — forbidden for identities and generative defaults. */
export const AIPIFY_FORBIDDEN_EMAIL_DOMAINS = ["aipify.com"] as const;

/** Reserved example hosts for docs/fixtures (not Aipify customer data). */
export const AIPIFY_RESERVED_EXAMPLE_DOMAINS = [
  "example.com",
  "customer.example",
  "example.org",
  "example.net",
] as const;

/** Slugs that identify internal Aipify Group customer records. */
export const AIPIFY_INTERNAL_CUSTOMER_SLUGS = [
  "aipify-group",
  "aipify-internal",
  "aipify",
] as const;

export const AIPIFY_INTERNAL_PROVISION_EMAIL = "admin@aipify.ai" as const;

const FORBIDDEN_COM_BOUNDARY = /aipify\.com(?![a-zA-Z])/i;
const EMAIL_FORMAT =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

export type AipifyDomainOwnershipDecision =
  | { ok: true; kind: "owned_email_domain" | "reserved_example" | "external_customer_domain" }
  | { ok: false; kind: "forbidden_unowned"; domain: string; reason: "aipify_com_not_owned" }
  | { ok: false; kind: "internal_requires_owned"; domain: string; reason: "internal_aipify_requires_owned_domain" }
  | { ok: false; kind: "invalid_email"; reason: "invalid_email" }
  | { ok: false; kind: "unknown"; domain: string };

export type CustomerContactEmailDecision = AipifyDomainOwnershipDecision & {
  normalizedEmail?: string;
  domain?: string;
};

function normalizeDomain(input: string): string {
  return input.trim().toLowerCase().replace(/^\.+/, "").replace(/\.$/, "");
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmailFormat(email: string): boolean {
  const normalized = normalizeEmail(email);
  if (normalized.length < 5 || normalized.length > 254) return false;
  return EMAIL_FORMAT.test(normalized);
}

export function extractEmailDomain(email: string): string | null {
  const trimmed = normalizeEmail(email);
  const at = trimmed.lastIndexOf("@");
  if (at <= 0 || at === trimmed.length - 1) return null;
  return normalizeDomain(trimmed.slice(at + 1));
}

/** True when text contains a real `aipify.com` token (not `aipify.companion` / `aipify.command`). */
export function containsForbiddenAipifyCom(text: string): boolean {
  return FORBIDDEN_COM_BOUNDARY.test(text);
}

export function isOwnedAipifyEmailDomain(domain: string): boolean {
  const d = normalizeDomain(domain);
  return (AIPIFY_OWNED_EMAIL_DOMAINS as readonly string[]).includes(d);
}

export function isReservedExampleDomain(domain: string): boolean {
  const d = normalizeDomain(domain);
  return (AIPIFY_RESERVED_EXAMPLE_DOMAINS as readonly string[]).includes(d);
}

export function isForbiddenUnownedAipifyDomain(domain: string): boolean {
  const d = normalizeDomain(domain);
  return (AIPIFY_FORBIDDEN_EMAIL_DOMAINS as readonly string[]).includes(d);
}

export function isInternalAipifyCustomerSlug(slug: string | null | undefined): boolean {
  if (!slug) return false;
  return (AIPIFY_INTERNAL_CUSTOMER_SLUGS as readonly string[]).includes(slug.trim().toLowerCase());
}

export function evaluateAipifyEmailDomain(domain: string): AipifyDomainOwnershipDecision {
  const d = normalizeDomain(domain);
  if (isForbiddenUnownedAipifyDomain(d)) {
    return { ok: false, kind: "forbidden_unowned", domain: d, reason: "aipify_com_not_owned" };
  }
  if (isOwnedAipifyEmailDomain(d)) {
    return { ok: true, kind: "owned_email_domain" };
  }
  if (isReservedExampleDomain(d)) {
    return { ok: true, kind: "reserved_example" };
  }
  return { ok: false, kind: "unknown", domain: d };
}

/**
 * Validate a customer contact email.
 * - Always rejects `aipify.com`
 * - Internal Aipify identities must use an owned Aipify domain
 * - Ordinary external customers may use any other valid domain
 */
export function evaluateCustomerContactEmail(
  email: string,
  options: { isInternalAipifyIdentity: boolean },
): CustomerContactEmailDecision {
  if (!isValidEmailFormat(email)) {
    return { ok: false, kind: "invalid_email", reason: "invalid_email" };
  }
  const normalizedEmail = normalizeEmail(email);
  const domain = extractEmailDomain(normalizedEmail);
  if (!domain) {
    return { ok: false, kind: "invalid_email", reason: "invalid_email" };
  }
  if (isForbiddenUnownedAipifyDomain(domain)) {
    return {
      ok: false,
      kind: "forbidden_unowned",
      domain,
      reason: "aipify_com_not_owned",
      normalizedEmail,
    };
  }
  if (options.isInternalAipifyIdentity) {
    if (!isOwnedAipifyEmailDomain(domain)) {
      return {
        ok: false,
        kind: "internal_requires_owned",
        domain,
        reason: "internal_aipify_requires_owned_domain",
        normalizedEmail,
      };
    }
    return { ok: true, kind: "owned_email_domain", normalizedEmail, domain };
  }
  if (isOwnedAipifyEmailDomain(domain)) {
    return { ok: true, kind: "owned_email_domain", normalizedEmail, domain };
  }
  return { ok: true, kind: "external_customer_domain", normalizedEmail, domain };
}

export function assertAuthorizedAipifyEmail(email: string): void {
  const decision = evaluateCustomerContactEmail(email, { isInternalAipifyIdentity: true });
  if (!decision.ok) {
    const reason =
      "reason" in decision && typeof decision.reason === "string"
        ? decision.reason
        : "email_domain_not_authorized";
    throw new Error(reason);
  }
}

/** Scan workspace-relative text for release-blocking `aipify.com` hits. */
export function findForbiddenAipifyComHits(text: string): string[] {
  const hits: string[] = [];
  const re = /aipify\.com(?![a-zA-Z])/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    hits.push(m[0]);
  }
  return hits;
}
