/**
 * Core locale + media path contracts — Feature owner: PLATFORM ADMIN / CUSTOMER APP.
 * Authoring for AIPIFY_PRODUCT_CENTER_CORE_CONTENT_MEDIA_FOUNDATION_V1.
 * Fail closed when RPCs missing. Never invent copy or media URLs.
 */

import { callCspRpc, type CspRpcClient } from "@/lib/certified-sales-partner/core-rpc";

export const PRODUCT_CONTENT_LOCALES = ["en", "no", "sv", "da", "pl", "uk", "es"] as const;
export type ProductContentLocale = (typeof PRODUCT_CONTENT_LOCALES)[number];

export type ProductContentChannel = "app" | "sale";

export type ProductLocaleCopy = {
  locale: ProductContentLocale;
  title: string;
  tagline: string | null;
  description: string;
  benefits: string[];
  approved: boolean;
  updatedAt: string | null;
};

export type ApprovedProductContent = {
  productKey: string;
  channel: ProductContentChannel;
  contentMissing: boolean;
  requestedLocale: string;
  locale: ProductContentLocale | null;
  title: string | null;
  tagline: string | null;
  description: string | null;
  benefits: string[];
  logoPath: string | null;
  heroPath: string | null;
  fallback: "registry" | null;
};

export const PRODUCT_LOCALE_MEDIA_RPCS = {
  upsertLocale: "csp_upsert_product_locale_copy",
  listLocale: "csp_list_product_locale_copy",
  getApproved: "csp_get_approved_product_content",
  listApproved: "csp_list_approved_product_content",
  setMediaPaths: "csp_set_product_media_paths",
} as const;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function asBool(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function asBenefits(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const item of value) {
    if (typeof item !== "string") continue;
    const text = item.trim();
    if (!text || text.length > 240) continue;
    out.push(text);
    if (out.length >= 12) break;
  }
  return out;
}

export function isProductContentLocale(value: string): value is ProductContentLocale {
  return (PRODUCT_CONTENT_LOCALES as readonly string[]).includes(value);
}

export function parseApprovedProductContent(raw: unknown): ApprovedProductContent | null {
  const root = asRecord(raw);
  if (root.found === false) return null;
  const productKey = asString(root.product_key ?? root.productKey)?.toLowerCase();
  const channelRaw = asString(root.channel)?.toLowerCase();
  if (!productKey || (channelRaw !== "app" && channelRaw !== "sale")) return null;
  const localeRaw = asString(root.locale);
  return {
    productKey,
    channel: channelRaw,
    contentMissing: asBool(root.content_missing ?? root.contentMissing) === true,
    requestedLocale: asString(root.requested_locale ?? root.requestedLocale) ?? "en",
    locale: localeRaw && isProductContentLocale(localeRaw) ? localeRaw : null,
    title: asString(root.title),
    tagline: asString(root.tagline),
    description: asString(root.description),
    benefits: asBenefits(root.benefits),
    logoPath: asString(root.logo_path ?? root.logoPath),
    heroPath: asString(root.hero_path ?? root.heroPath),
    fallback: root.fallback === "registry" ? "registry" : null,
  };
}

/**
 * Merge Core approved content onto catalog presentation without inventing copy.
 * Storage paths stay in logoPath/heroPath — never place private bucket paths in img src.
 * Display logoSrc/heroImagePath keep public registry assets until a signed URL is attached.
 */
export function applyApprovedContentToPresentation(input: {
  title: string;
  tagline: string;
  description: string;
  logoSrc: string | null;
  heroImagePath: string | null;
  content: ApprovedProductContent | null;
}): {
  title: string;
  tagline: string;
  description: string;
  logoSrc: string | null;
  heroImagePath: string | null;
  logoPath: string | null;
  heroPath: string | null;
  benefits: string[];
  contentSource: "core" | "registry_fallback";
} {
  const content = input.content;
  if (!content || content.contentMissing) {
    return {
      title: input.title,
      tagline: input.tagline,
      description: input.description,
      logoSrc: input.logoSrc,
      heroImagePath: input.heroImagePath,
      logoPath: null,
      heroPath: null,
      benefits: [],
      contentSource: "registry_fallback",
    };
  }
  return {
    title: content.title || input.title,
    tagline: content.tagline || input.tagline,
    description: content.description || input.description,
    logoSrc: input.logoSrc,
    heroImagePath: input.heroImagePath,
    logoPath: content.logoPath,
    heroPath: content.heroPath,
    benefits: content.benefits,
    contentSource: "core",
  };
}

export async function loadApprovedProductContent(
  supabase: CspRpcClient,
  input: {
    productKey: string;
    locale: string;
    channel: ProductContentChannel;
  },
): Promise<
  | { ok: true; content: ApprovedProductContent }
  | { ok: false; reason: "missing" | "forbidden" | "error" | "not_listed"; detail?: string }
> {
  const result = await callCspRpc(supabase, PRODUCT_LOCALE_MEDIA_RPCS.getApproved, {
    p_product_key: input.productKey,
    p_locale: input.locale,
    p_channel: input.channel,
  });
  if (!result.ready) {
    if (result.error === "rpc_missing" || result.error === "csp_backend_not_applied") {
      return { ok: false, reason: "missing", detail: result.detail };
    }
    if (result.error === "forbidden" || result.error === "unauthorized") {
      return { ok: false, reason: "forbidden", detail: result.detail };
    }
    return { ok: false, reason: "error", detail: result.detail };
  }
  const root = asRecord(result.data);
  if (root.error === "not_listed") {
    return { ok: false, reason: "not_listed", detail: String(root.channel ?? input.channel) };
  }
  const parsed = parseApprovedProductContent(result.data);
  if (!parsed) {
    return { ok: false, reason: "error", detail: "parse_failed" };
  }
  return { ok: true, content: parsed };
}

export const PARTNER_CONTENT_REUSE_NOTES = {
  sharedCard: "components/shared/product-catalog/PremiumProductCatalogCard.tsx",
  contentRpc: PRODUCT_LOCALE_MEDIA_RPCS.getApproved,
  appChannel: "app",
  saleChannel: "sale",
  appStripsCommission: true,
  saleNoBuyButton: true,
  checkoutFailClosed: true,
  storageExecutable:
    "docs/platform/sql-candidates/csp_product_media_storage_executable_v1.sql",
  storageStubDoNotApply:
    "docs/platform/sql-candidates/NOT_APPLIED_csp_product_media_storage_v1.sql",
} as const;
