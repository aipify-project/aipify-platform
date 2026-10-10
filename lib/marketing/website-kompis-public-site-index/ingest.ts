import "server-only";

import { createServiceRoleClient } from "@/lib/supabase/service-role";
import {
  extractPublicPageFromHtml,
  isIndexableExtractedPage,
} from "./extract";
import { fetchVerifiedPublicSiteUrl } from "./fetch-safe";
import {
  WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_PAGES,
  evaluatePublicSiteIndexUrl,
  isPathDisallowedByRobots,
  normalizePublicSiteIndexCanonicalUrl,
  parseRobotsTxtDisallowPaths,
} from "./url-policy";

export type PublicSiteIndexIngestInput = {
  tenantId: string;
  installId: string | null;
  verifiedHost: string;
  /** Explicit seed URLs and/or sitemap discovery starting points. */
  seedUrls: string[];
  localeHint?: string;
  maxPages?: number;
};

export type PublicSiteIndexIngestResult = {
  discovered: number;
  indexed: number;
  rejected: number;
  errors: Array<{ url: string; reason: string }>;
  indexedUrls: string[];
};

function uniqueUrls(urls: string[]): string[] {
  return [...new Set(urls.map((u) => u.trim()).filter(Boolean))];
}

async function discoverFromSitemap(
  verifiedHost: string,
  sitemapUrl: string,
): Promise<string[]> {
  const fetched = await fetchVerifiedPublicSiteUrl({
    url: sitemapUrl,
    verifiedHost,
  });
  if (!fetched.ok) return [];

  const locs = [...fetched.body.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map((m) =>
    m[1].trim(),
  );
  const out: string[] = [];
  for (const loc of locs) {
    const decision = evaluatePublicSiteIndexUrl(loc, verifiedHost);
    if (decision.ok) {
      out.push(normalizePublicSiteIndexCanonicalUrl(decision.url));
    }
  }
  return out;
}

async function loadRobotsDisallows(verifiedHost: string): Promise<string[]> {
  const fetched = await fetchVerifiedPublicSiteUrl({
    url: `https://${verifiedHost}/robots.txt`,
    verifiedHost,
  });
  if (!fetched.ok) return [];
  return parseRobotsTxtDisallowPaths(fetched.body);
}

/**
 * Bounded SSRF-safe public site ingest into Core.
 * Must be invoked only by approved operator/service paths — never from visitor ask.
 */
export async function ingestTenantPublicSiteIndex(
  input: PublicSiteIndexIngestInput,
): Promise<PublicSiteIndexIngestResult> {
  const host = input.verifiedHost.trim().toLowerCase();
  const maxPages = Math.min(
    input.maxPages ?? WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_PAGES,
    WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_PAGES,
  );

  const disallow = await loadRobotsDisallows(host);
  const seeds = uniqueUrls([
    ...input.seedUrls,
    `https://${host}/sitemap.xml`,
    `https://${host}/`,
  ]);

  const discovered = new Set<string>();
  for (const seed of seeds) {
    const decision = evaluatePublicSiteIndexUrl(seed, host);
    if (!decision.ok) continue;

    if (decision.pathname.endsWith(".xml") || decision.pathname.includes("sitemap")) {
      const fromSitemap = await discoverFromSitemap(host, decision.url.toString());
      for (const url of fromSitemap) discovered.add(url);
      continue;
    }

    discovered.add(normalizePublicSiteIndexCanonicalUrl(decision.url));
  }

  const candidates = [...discovered].slice(0, maxPages);
  const supabase = createServiceRoleClient();
  const errors: Array<{ url: string; reason: string }> = [];
  const indexedUrls: string[] = [];
  let rejected = 0;

  for (const url of candidates) {
    const decision = evaluatePublicSiteIndexUrl(url, host);
    if (!decision.ok) {
      rejected += 1;
      errors.push({ url, reason: decision.reason });
      continue;
    }
    if (isPathDisallowedByRobots(decision.pathname, disallow)) {
      rejected += 1;
      errors.push({ url, reason: "robots_disallow" });
      continue;
    }

    const fetched = await fetchVerifiedPublicSiteUrl({ url, verifiedHost: host });
    if (!fetched.ok) {
      rejected += 1;
      errors.push({ url, reason: fetched.reason });
      continue;
    }

    if (!fetched.contentType.includes("html") && !fetched.contentType.includes("xml")) {
      // Allow text/html missing content-type on some hosts
      if (fetched.contentType && !fetched.body.includes("<html")) {
        rejected += 1;
        errors.push({ url, reason: "not_html" });
        continue;
      }
    }

    const extracted = extractPublicPageFromHtml(fetched.body, input.localeHint);
    if (!isIndexableExtractedPage(extracted)) {
      rejected += 1;
      errors.push({ url, reason: "not_indexable" });
      continue;
    }

    const finalDecision = evaluatePublicSiteIndexUrl(fetched.finalUrl, host);
    if (!finalDecision.ok) {
      rejected += 1;
      errors.push({ url, reason: finalDecision.reason });
      continue;
    }

    const { error } = await supabase.rpc("replace_tenant_public_site_index_document", {
      p_tenant_id: input.tenantId,
      p_install_id: input.installId,
      p_verified_host: host,
      p_canonical_url: normalizePublicSiteIndexCanonicalUrl(finalDecision.url),
      p_pathname: finalDecision.pathname,
      p_locale: extracted.locale || input.localeHint || "no",
      p_title: extracted.title,
      p_meta_description: extracted.metaDescription,
      p_excerpt: extracted.excerpt,
      p_body_text: extracted.bodyText,
      p_content_hash: extracted.contentHash,
      p_chunks: extracted.chunks,
      p_http_status: fetched.status,
    });

    if (error) {
      rejected += 1;
      errors.push({ url, reason: "persist_failed" });
      continue;
    }

    indexedUrls.push(normalizePublicSiteIndexCanonicalUrl(finalDecision.url));
  }

  return {
    discovered: discovered.size,
    indexed: indexedUrls.length,
    rejected,
    errors: errors.slice(0, 40),
    indexedUrls,
  };
}
