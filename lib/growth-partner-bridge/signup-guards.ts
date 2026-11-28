/**
 * Dual-registration guards for Unified Seller Bridge V1.
 * Pure helpers — no I/O. CSP remains the authoritative seller identity.
 */
import {
  CSP_SELLER_EXISTS_CODE,
  GROWTH_PARTNER_EXISTS_CODE,
  PARTNERS_PORTAL_REDIRECT,
} from "./constants";

export type DualSignupBlock =
  | {
      blocked: true;
      code: typeof CSP_SELLER_EXISTS_CODE;
      redirectPath: typeof PARTNERS_PORTAL_REDIRECT;
    }
  | {
      blocked: true;
      code: typeof GROWTH_PARTNER_EXISTS_CODE;
      redirectPath: typeof PARTNERS_PORTAL_REDIRECT;
    }
  | { blocked: false };

/** Growth Partner public signup must not create a second identity when CSP exists. */
export function guardGrowthPartnerSignupAgainstCsp(input: {
  cspPartnerId: string | null | undefined;
}): DualSignupBlock {
  const id = typeof input.cspPartnerId === "string" ? input.cspPartnerId.trim() : "";
  if (!id) return { blocked: false };
  return {
    blocked: true,
    code: CSP_SELLER_EXISTS_CODE,
    redirectPath: PARTNERS_PORTAL_REDIRECT,
  };
}

/**
 * CSP registration may proceed when a GP App profile already exists for the same auth user —
 * that creates the authoritative CSP row for the existing capability profile (unification).
 * Blocking here would strand GP-only accounts without CSP commission identity.
 *
 * Returns a soft notice code only when callers want to surface "already a GP App profile".
 */
export function noticeCspRegisterWithExistingGrowthPartner(input: {
  growthPartnerProfileId: string | null | undefined;
}): DualSignupBlock {
  const id =
    typeof input.growthPartnerProfileId === "string" ? input.growthPartnerProfileId.trim() : "";
  if (!id) return { blocked: false };
  return {
    blocked: true,
    code: GROWTH_PARTNER_EXISTS_CODE,
    redirectPath: PARTNERS_PORTAL_REDIRECT,
  };
}

export function isCspSellerExistsPayload(data: unknown): boolean {
  if (!data || typeof data !== "object" || Array.isArray(data)) return false;
  const row = data as Record<string, unknown>;
  const code = typeof row.code === "string" ? row.code : typeof row.error === "string" ? row.error : "";
  return code.trim().toLowerCase() === CSP_SELLER_EXISTS_CODE;
}

/** Prefer GP personal slug path; never treat a CSP attribution code as `/s/{code}`. */
export function resolvePersonalSalesPath(input: {
  growthPartnerSlug: string | null | undefined;
  linkStatus: string | null | undefined;
  locale: string;
}): string | null {
  const slug = typeof input.growthPartnerSlug === "string" ? input.growthPartnerSlug.trim().toLowerCase() : "";
  if (!slug) return null;
  if ((input.linkStatus ?? "").trim().toLowerCase() !== "active") return null;
  if (slug.startsWith("csp-")) return null;
  const lang = encodeURIComponent(input.locale);
  return `/s/${encodeURIComponent(slug)}?lang=${lang}`;
}