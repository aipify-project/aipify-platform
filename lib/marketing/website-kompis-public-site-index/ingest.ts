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
  installId: string;
  verifiedHost: string;
  /** Explicit seed URLs and/or sitemap discovery starting points. */
  seedUrls: string[];
  localeHint?: string;
  maxPages?: number;
  /** When true, discover/fetch/extract but do not persist. */
  dryRun?: boolean;
};

export type PublicSiteIndexIngestResult = {
  discovered: number;
  indexed: number;
  rejected: number;
  dryRun: boolean;
  robotsStatus: "ok" | "fail_closed";
  errors: Array<{ url: string; reason: string }>;
  indexedUrls: string[];
  rejectedPrivateSample: string[];
  /** Bounded outcome samples for operator dry-run reports (no HTML body). */
  pageOutcomes: Array<{
    url: string;
    outcome: "eligible" | string;
    decodedBytes?: number;
    locale?: string | null;
    title?: string;
    /** Short sanitized public excerpt for dry-run quality checks only. */
    excerptSample?: string;
  }>;
};

export type RobotsPolicyResult =
  | { ok: true; disallow: string[] }
  | { ok: false; reason: "robots_fetch_failed" | "robots_empty_ambiguous" };

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

/** Fail closed: robots fetch errors or empty ambiguous bodies block ingest. */
export async function loadRobotsPolicyFailClosed(
  verifiedHost: string,
): Promise<RobotsPolicyResult> {
  const fetched = await fetchVerifiedPublicSiteUrl({
    url: `https://${verifiedHost}/robots.txt`,
    verifiedHost,
  });
  if (!fetched.ok) {
    return { ok: false, reason: "robots_fetch_failed" };
  }
  const body = fetched.body.trim();
  if (!body || body.length < 8) {
    return { ok: false, reason: "robots_empty_ambiguous" };
  }
  return { ok: true, disallow: parseRobotsTxtDisallowPaths(body) };
}

/**
 * Bounded SSRF-safe public site ingest into Core.
 * Must be invoked only by approved operator/service paths — never from visitor ask.
 * Caller must resolve tenantId/installId/verifiedHost from Core trust (not client-supplied alone).
 */
export async function ingestTenantPublicSiteIndex(
  input: PublicSiteIndexIngestInput,
): Promise<PublicSiteIndexIngestResult> {
  const host = input.verifiedHost.trim().toLowerCase();
  const installId = input.installId?.trim();
  if (!installId) {
    return {
      discovered: 0,
      indexed: 0,
      rejected: 0,
      dryRun: Boolean(input.dryRun),
      robotsStatus: "fail_closed",
      errors: [{ url: host, reason: "install_required" }],
      indexedUrls: [],
      rejectedPrivateSample: [],
      pageOutcomes: [],
    };
  }

  const maxPages = Math.min(
    input.maxPages ?? WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_PAGES,
    WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_PAGES,
  );
  const dryRun = Boolean(input.dryRun);

  const robots = await loadRobotsPolicyFailClosed(host);
  if (!robots.ok) {
    return {
      discovered: 0,
      indexed: 0,
      rejected: 0,
      dryRun,
      robotsStatus: "fail_closed",
      errors: [{ url: `https://${host}/robots.txt`, reason: robots.reason }],
      indexedUrls: [],
      rejectedPrivateSample: [],
      pageOutcomes: [],
    };
  }

  const disallow = robots.disallow;
  const seeds = uniqueUrls([
    ...input.seedUrls,
    `https://${host}/sitemap.xml`,
    `https://${host}/`,
  ]);

  const discovered = new Set<string>();
  const rejectedPrivateSample: string[] = [];
  for (const seed of seeds) {
    const decision = evaluatePublicSiteIndexUrl(seed, host);
    if (!decision.ok) {
      if (decision.reason === "private_path" && rejectedPrivateSample.length < 12) {
        rejectedPrivateSample.push(seed);
      }
      continue;
    }

    if (decision.pathname.endsWith(".xml") || decision.pathname.includes("sitemap")) {
      const fromSitemap = await discoverFromSitemap(host, decision.url.toString());
      for (const url of fromSitemap) discovered.add(url);
      continue;
    }

    discovered.add(normalizePublicSiteIndexCanonicalUrl(decision.url));
  }

  const candidates = [...discovered].slice(0, maxPages);
  const supabase = dryRun ? null : createServiceRoleClient();
  const errors: Array<{ url: string; reason: string }> = [];
  const indexedUrls: string[] = [];
  const pageOutcomes: PublicSiteIndexIngestResult["pageOutcomes"] = [];
  let rejected = 0;

  const pushOutcome = (
    url: string,
    outcome: "eligible" | string,
    extra?: {
      decodedBytes?: number;
      locale?: string | null;
      title?: string;
      excerptSample?: string;
    },
  ) => {
    if (pageOutcomes.length >= 40) return;
    pageOutcomes.push({
      url,
      outcome,
      decodedBytes: extra?.decodedBytes,
      locale: extra?.locale,
      title: extra?.title ? extra.title.slice(0, 120) : undefined,
      excerptSample: extra?.excerptSample
        ? extra.excerptSample.slice(0, 160)
        : undefined,
    });
  };

  for (const url of candidates) {
    const decision = evaluatePublicSiteIndexUrl(url, host);
    if (!decision.ok) {
      rejected += 1;
      errors.push({ url, reason: decision.reason });
      pushOutcome(url, decision.reason);
      if (decision.reason === "private_path" && rejectedPrivateSample.length < 12) {
        rejectedPrivateSample.push(url);
      }
      continue;
    }
    if (isPathDisallowedByRobots(decision.pathname, disallow)) {
      rejected += 1;
      errors.push({ url, reason: "robots_disallow" });
      pushOutcome(url, "robots_disallow");
      continue;
    }

    const fetched = await fetchVerifiedPublicSiteUrl({ url, verifiedHost: host });
    if (!fetched.ok) {
      rejected += 1;
      errors.push({ url, reason: fetched.reason });
      pushOutcome(url, fetched.reason);
      continue;
    }

    if (!fetched.contentType.includes("html") && !fetched.contentType.includes("xml")) {
      if (fetched.contentType && !fetched.body.includes("<html")) {
        rejected += 1;
        errors.push({ url, reason: "not_html" });
        pushOutcome(url, "not_html", { decodedBytes: fetched.decodedBytes });
        continue;
      }
    }

    const extracted = extractPublicPageFromHtml(fetched.body, input.localeHint);
    if (!isIndexableExtractedPage(extracted)) {
      const reason = extracted.noindex ? "noindex" : "not_indexable";
      rejected += 1;
      errors.push({ url, reason });
      pushOutcome(url, reason, {
        decodedBytes: fetched.decodedBytes,
        locale: extracted.locale,
        title: extracted.title,
      });
      continue;
    }

    const finalDecision = evaluatePublicSiteIndexUrl(fetched.finalUrl, host);
    if (!finalDecision.ok) {
      rejected += 1;
      errors.push({ url, reason: finalDecision.reason });
      pushOutcome(url, finalDecision.reason, { decodedBytes: fetched.decodedBytes });
      continue;
    }

    const canonical = normalizePublicSiteIndexCanonicalUrl(finalDecision.url);

    if (dryRun || !supabase) {
      indexedUrls.push(canonical);
      pushOutcome(canonical, "eligible", {
        decodedBytes: fetched.decodedBytes,
        locale: extracted.locale,
        title: extracted.title,
        excerptSample: extracted.excerpt || extracted.bodyText.slice(0, 160),
      });
      continue;
    }

    const { error } = await supabase.rpc("replace_tenant_public_site_index_document", {
      p_tenant_id: input.tenantId,
      p_install_id: installId,
      p_verified_host: host,
      p_canonical_url: canonical,
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
      pushOutcome(url, "persist_failed", { decodedBytes: fetched.decodedBytes });
      continue;
    }

    indexedUrls.push(canonical);
    pushOutcome(canonical, "eligible", {
      decodedBytes: fetched.decodedBytes,
      locale: extracted.locale,
      title: extracted.title,
    });
  }

  return {
    discovered: discovered.size,
    indexed: indexedUrls.length,
    rejected,
    dryRun,
    robotsStatus: "ok",
    errors: errors.slice(0, 40),
    indexedUrls,
    rejectedPrivateSample,
    pageOutcomes,
  };
}
