/**
 * Visitor widget appearance — typed contract for APP configuration.
 * Feature owner: CUSTOMER APP (presentation) · Core writer requires owner YES.
 * Does not mutate Website Kompis public-chain runtime.
 */

export const WEBSITE_KOMPIS_APPEARANCE_CONTRACT_VERSION = "v1_candidate" as const;

/** Allowed accent tokens only — no raw CSS. */
export const WEBSITE_KOMPIS_APPEARANCE_ACCENT_TOKENS = [
  "companion_purple",
  "soft_indigo",
  "slate",
] as const;

export type WebsiteKompisAppearanceAccentToken =
  (typeof WEBSITE_KOMPIS_APPEARANCE_ACCENT_TOKENS)[number];

export type WebsiteKompisAppearanceSettings = {
  organizationId: string;
  accentToken: WebsiteKompisAppearanceAccentToken;
  welcomeMessage: string | null;
  showBranding: boolean;
  updatedAt: string | null;
};

export type WebsiteKompisAppearanceReadResult =
  | { kind: "available"; settings: WebsiteKompisAppearanceSettings }
  | { kind: "writer_unavailable"; reason: "core_rpc_missing" | "not_activated" }
  | { kind: "unauthorized" }
  | { kind: "unavailable" };

export type WebsiteKompisAppearanceWriteResult =
  | { ok: true; settings: WebsiteKompisAppearanceSettings }
  | {
      ok: false;
      reason:
        | "writer_unavailable"
        | "unauthorized"
        | "validation_failed"
        | "unavailable";
      messageKey: string;
    };

export const WEBSITE_KOMPIS_APPEARANCE_LIMITS = {
  welcomeMessageMaxChars: 160,
  allowRawCss: false,
  publicChainMutation: false,
} as const;
