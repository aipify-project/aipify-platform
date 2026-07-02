/** Public marketing URLs surfaced in the Website Companion composer when enabled. */
export const COMPANION_PUBLIC_LINK_BUSINESS_PACKS_URL =
  "https://aipify.ai/pricing#business-packs" as const;

export const COMPANION_PUBLIC_LINK_BECOME_PARTNER_URL =
  "https://aipify.ai/growth-partners" as const;

export const COMPANION_PUBLIC_LINKS = [
  {
    id: "businessPacks",
    href: COMPANION_PUBLIC_LINK_BUSINESS_PACKS_URL,
  },
  {
    id: "becomePartner",
    href: COMPANION_PUBLIC_LINK_BECOME_PARTNER_URL,
  },
] as const;

export type CompanionPublicLinkId = (typeof COMPANION_PUBLIC_LINKS)[number]["id"];

/** Shared feature flag key — opt-in via env; default off. */
export const COMPANION_PUBLIC_LINKS_ENABLED_FLAG = "companionPublicLinksEnabled" as const;

export type CompanionPublicLinksEnabledFlag = typeof COMPANION_PUBLIC_LINKS_ENABLED_FLAG;

/** Env gate — set NEXT_PUBLIC_COMPANION_PUBLIC_LINKS_ENABLED=true to enable globally. */
export const COMPANION_PUBLIC_LINKS_ENV_KEY = "NEXT_PUBLIC_COMPANION_PUBLIC_LINKS_ENABLED" as const;

export type CompanionPublicLinksFeatureOverrides = Partial<
  Record<CompanionPublicLinksEnabledFlag, boolean>
>;

/** Returns true when composer public links should render. Default: false. */
export function isCompanionPublicLinksEnabled(
  overrides?: CompanionPublicLinksFeatureOverrides,
): boolean {
  if (overrides && COMPANION_PUBLIC_LINKS_ENABLED_FLAG in overrides) {
    return Boolean(overrides[COMPANION_PUBLIC_LINKS_ENABLED_FLAG]);
  }
  return process.env[COMPANION_PUBLIC_LINKS_ENV_KEY] === "true";
}
