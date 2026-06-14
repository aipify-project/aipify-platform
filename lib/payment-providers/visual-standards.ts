import type { PaymentProviderKey } from "./constants";

/** Aipify Payment Provider Visual Standards — presentation layer only. */
export const PROVIDER_CARD_CLASS =
  "flex h-full min-h-[420px] flex-col rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md";

export const PROVIDER_LOGO_CONTAINER_CLASS =
  "flex min-h-[72px] items-center border-b border-neutral-100 pb-6";

export const PROVIDER_LOGO_IMAGE_CLASS =
  "h-8 w-auto max-w-[160px] object-contain object-left";

export const PROVIDER_LOGO_PATHS: Record<PaymentProviderKey, string> = {
  stripe: "/branding/payment-providers/stripe.svg",
  klarna: "/branding/payment-providers/klarna.svg",
  vipps: "/branding/payment-providers/vipps.svg",
  dnb: "/branding/payment-providers/dnb.svg",
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
    labelKey: "pendingSetup",
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
};
