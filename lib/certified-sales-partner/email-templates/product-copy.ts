import { listPublishedSalesCopyForLocale } from "@/lib/certified-sales-partner/sales-materials-catalog";

/**
 * Product lines for live template preview and marketing send.
 * Prefer approved short copy for the marketing locale; never invent claims.
 * Missing locale returns empty — callers must not fall back to English silently.
 */
export function cspMarketingProductDescription(productKey: string, locale = "en"): string {
  const localized = listPublishedSalesCopyForLocale({ productKey, locale });
  const short = localized.find((item) => item.tone === "short");
  if (short?.text.trim()) return short.text.trim();
  const informative = localized.find((item) => item.tone === "informative");
  if (informative?.text.trim()) return informative.text.trim();
  return "";
}
