/**
 * Public site-index locale contract for Website Kompis retrieval.
 *
 * Ask surfaces send Aipify page locales (e.g. `no`). HTML ingest may store
 * BCP-47 primary tags from `lang`/`og:locale` (e.g. `nb`). Search must treat
 * Bokmål aliases as one family without widening to Nynorsk (`nn`), other
 * languages, or cross-tenant results.
 *
 * Scope: public site-index search only — not global APP i18n.
 */

/** Bokmål aliases that may appear as ask locale or stored document locale. */
export const PUBLIC_SITE_INDEX_BOKMAL_LOCALES = ["no", "nb"] as const;

/** Host route codes that store the same language under a different primary tag. */
const PUBLIC_SITE_INDEX_HOST_LOCALE_FAMILIES = [
  ["sv", "se"],
  ["da", "dk"],
] as const;

export type PublicSiteIndexBokmalLocale =
  (typeof PUBLIC_SITE_INDEX_BOKMAL_LOCALES)[number];

export function normalizePublicSiteIndexLocaleTag(
  locale: string | null | undefined,
): string {
  const raw = (locale ?? "").trim().toLowerCase();
  if (!raw) return "no";
  const primary = raw.split(/[-_]/)[0] || raw;
  if (primary.length > 16) return "no";
  return primary;
}

export function isPublicSiteIndexBokmalLocale(
  locale: string | null | undefined,
): locale is PublicSiteIndexBokmalLocale {
  const tag = normalizePublicSiteIndexLocaleTag(locale);
  return (PUBLIC_SITE_INDEX_BOKMAL_LOCALES as readonly string[]).includes(tag);
}

/**
 * Locales to pass to `search_tenant_public_site_index` for one ask.
 * Requested locale first. `nn` and unknown tags stay singleton (no all-language widen).
 * Existing RPC `en` fallback is unchanged and still applied per call.
 */
export function expandPublicSiteIndexSearchLocales(
  locale: string | null | undefined,
): string[] {
  const tag = normalizePublicSiteIndexLocaleTag(locale);
  if (isPublicSiteIndexBokmalLocale(tag)) {
    const rest = PUBLIC_SITE_INDEX_BOKMAL_LOCALES.filter((entry) => entry !== tag);
    return [tag, ...rest];
  }
  const family = PUBLIC_SITE_INDEX_HOST_LOCALE_FAMILIES.find((entry) =>
    (entry as readonly string[]).includes(tag),
  );
  if (!family) return [tag];
  return [tag, ...family.filter((entry) => entry !== tag)];
}

/** Merge RPC windows from compatible locales; keep highest score per chunk. */
export function mergePublicSiteIndexHitsByChunkId<
  T extends { chunkId: string; score: number },
>(windows: readonly T[][]): T[] {
  const byChunk = new Map<string, T>();
  for (const window of windows) {
    for (const hit of window) {
      const existing = byChunk.get(hit.chunkId);
      if (!existing || hit.score > existing.score) {
        byChunk.set(hit.chunkId, hit);
      }
    }
  }
  return [...byChunk.values()].sort((a, b) => b.score - a.score);
}
