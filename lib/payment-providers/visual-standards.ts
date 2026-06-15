import type { PaymentProviderKey } from "./constants";

/** Aipify Payment Provider Visual Standards — presentation layer only. */
export const PROVIDER_CARD_CLASS =
  "flex h-full min-h-[540px] flex-col rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md";

/** Fixed 60px logo slot — equal alignment and visual weight across all providers. */
export const PROVIDER_LOGO_CONTAINER_CLASS =
  "flex h-[60px] w-full items-center justify-start rounded-xl bg-white px-5 ring-1 ring-neutral-100";

export const PROVIDER_LOGO_MAX_HEIGHT_PX = 36;

export const PROVIDER_LOGO_IMAGE_CLASS =
  "max-h-[36px] h-auto w-auto max-w-full object-contain object-left";

/** Official brand assets supplied by Aipify Group AS — do not modify or recolor. */
export const PROVIDER_LOGO_PATHS: Record<PaymentProviderKey, string> = {
  stripe: "/brand/payment-providers/STRIPE.png",
  klarna: "/brand/payment-providers/KLARNA.png",
  vipps: "/brand/payment-providers/vipps.png",
  dnb: "/brand/payment-providers/DNB.png",
};

export const PROVIDER_SUPPORTED_CURRENCIES: Record<PaymentProviderKey, string[]> = {
  stripe: ["NOK", "EUR", "USD", "GBP", "SEK", "DKK"],
  klarna: ["NOK", "SEK", "EUR", "DKK", "GBP", "USD"],
  vipps: ["NOK", "DKK", "EUR", "SEK"],
  dnb: ["NOK", "EUR"],
};

export const PROVIDER_SUPPORTED_COUNTRIES: Record<PaymentProviderKey, string[]> = {
  stripe: ["NO", "SE", "DK", "FI", "DE", "GB", "US", "EU"],
  klarna: ["NO", "SE", "DK", "FI", "DE", "AT", "NL", "GB", "US"],
  vipps: ["NO", "DK", "FI", "SE"],
  dnb: ["NO", "SE", "DK", "FI"],
};

export const PROVIDER_DOCUMENTATION_URLS: Record<PaymentProviderKey, string> = {
  stripe: "https://stripe.com/docs",
  klarna: "https://docs.klarna.com/",
  vipps: "https://developer.vippsmobilepay.com/docs/",
  dnb: "https://dnb.no/bedrift",
};

export type ProviderVisualProfile = {
  taglineKey: string;
  positioningKey: string;
  logoAltKey: string;
  logoMaxWidth: string;
};

export const PROVIDER_VISUAL_PROFILES: Record<PaymentProviderKey, ProviderVisualProfile> = {
  stripe: {
    taglineKey: "globalPayments",
    positioningKey: "stripePositioning",
    logoAltKey: "stripe",
    logoMaxWidth: "max-w-[96px]",
  },
  klarna: {
    taglineKey: "nordicPayments",
    positioningKey: "klarnaPositioning",
    logoAltKey: "klarna",
    logoMaxWidth: "max-w-[120px]",
  },
  vipps: {
    taglineKey: "scandinavianPayments",
    positioningKey: "vippsPositioning",
    logoAltKey: "vipps",
    logoMaxWidth: "max-w-[180px]",
  },
  dnb: {
    taglineKey: "enterpriseBilling",
    positioningKey: "dnbPositioning",
    logoAltKey: "dnb",
    logoMaxWidth: "max-w-[88px]",
  },
};

export const STATUS_VISUAL: Record<
  string,
  { dot: string; badge: string; labelKey: string }
> = {
  operational: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-900 ring-emerald-200",
    labelKey: "operational",
  },
  pending_setup: {
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-900 ring-amber-200",
    labelKey: "setupRequired",
  },
  requires_attention: {
    dot: "bg-orange-500",
    badge: "bg-orange-50 text-orange-950 ring-orange-200",
    labelKey: "requiresAttention",
  },
  disabled: {
    dot: "bg-neutral-400",
    badge: "bg-neutral-100 text-neutral-700 ring-neutral-200",
    labelKey: "disabled",
  },
  disconnected: {
    dot: "bg-neutral-400",
    badge: "bg-neutral-100 text-neutral-700 ring-neutral-200",
    labelKey: "disconnected",
  },
  failed: {
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-900 ring-red-200",
    labelKey: "failed",
  },
};
