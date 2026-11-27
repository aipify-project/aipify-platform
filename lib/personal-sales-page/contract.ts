/**
 * Personal sales page contract.
 * Reuses the existing CSP link code (`csp-` + 12) and Growth Partner slug.
 * Does not invent a seller id, cookie, price, or commission.
 */
import { isCspLinkCode, resolveCspProductDestination } from "@/lib/certified-sales-partner/attribution-policy";

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,78}[a-z0-9])?$/;

export type PersonalSalesCodeKind = "csp" | "growth_partner" | "invalid";

export function classifyPersonalSalesCode(value: string | null | undefined): PersonalSalesCodeKind {
  const code = String(value ?? "").trim().toLowerCase();
  if (!code || code.includes("@") || code.includes(".") || code.includes("/")) return "invalid";
  if (isCspLinkCode(code)) return "csp";
  if (SLUG_RE.test(code) && !/^[0-9a-f]{8}-/.test(code)) return "growth_partner";
  return "invalid";
}

/** Public advisor label. Emails, markup, and empty values stay unpublished. */
export function publicAdvisorName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const name = value.trim().replace(/\s+/g, " ");
  if (name.length < 2 || name.length > 80) return null;
  if (/[@<>]|https?:|javascript:/i.test(name)) return null;
  return name;
}

export type PersonalSalesPublication =
  | { state: "closed"; reason: "invalid" | "unavailable" }
  | {
      state: "published";
      code: string;
      advisorName: string | null;
    };

/**
 * A Growth Partner slug is published only when the existing public resolve says the link is active.
 * A CSP code has no public profile read, so the named page stays closed. The existing `/p/` route
 * remains the attribution gate.
 */
export function publicationFromPublicResolve(input: {
  code: string;
  resolved: unknown;
}): PersonalSalesPublication {
  const code = input.code.trim().toLowerCase();
  const kind = classifyPersonalSalesCode(code);
  if (kind !== "growth_partner") return { state: "closed", reason: kind === "invalid" ? "invalid" : "unavailable" };
  const row = input.resolved && typeof input.resolved === "object" ? (input.resolved as Record<string, unknown>) : {};
  if (row.found !== true) return { state: "closed", reason: "unavailable" };
  return {
    state: "published",
    code,
    advisorName: publicAdvisorName(row.partner_name),
  };
}

/** Only the product whose existing public destination is the live sales page. */
export function personalSalesProductPath(code: string, locale: string): string | null {
  if (classifyPersonalSalesCode(code) === "invalid") return null;
  if (resolveCspProductDestination("kompis_web") !== "/") return null;
  const lang = encodeURIComponent(locale);
  return `/p/${encodeURIComponent(code.trim().toLowerCase())}/kompis_web?channel=referral_link&lang=${lang}`;
}
