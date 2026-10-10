import { createHash } from "node:crypto";
import { fetchVerifiedPublicSiteUrl } from "./fetch-safe";
import {
  evaluatePublicSiteIndexUrl,
  normalizePublicSiteIndexCanonicalUrl,
  parseRobotsTxtDisallowPaths,
} from "./url-policy";
export type RobotsPolicyResult =
  | { ok: true; disallow: string[]; body?: string }
  | { ok: false; reason: "robots_fetch_failed" | "robots_empty_ambiguous" };

/** Hard ceiling on discovered URL set size (multi-batch covers the set). */
export const WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_DISCOVERED = 5_000;

/** Nested sitemap-index depth (sitemapindex → child sitemaps → urls). */
export const WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_SITEMAP_DEPTH = 3;

export type PublicSiteDiscoveryResult = {
  robotsStatus: "ok" | "fail_closed";
  robotsReason?: "robots_fetch_failed" | "robots_empty_ambiguous";
  disallow: string[];
  /** Deterministically sorted canonical HTTPS page URLs (not sitemap files). */
  urls: string[];
  /** SHA-256 of joined urls — binds continuation cursors to this discovery set. */
  discoveryFingerprint: string;
  sitemapFetches: number;
  truncated: boolean;
  rejectedPrivateSample: string[];
};

function uniquePreserve(urls: string[]): string[] {
  return [...new Set(urls.map((u) => u.trim()).filter(Boolean))];
}

export function sortDiscoveredUrlsDeterministically(urls: string[]): string[] {
  return [...urls].sort((a, b) => a.localeCompare(b, "en"));
}

export function fingerprintDiscoveredUrls(urls: string[]): string {
  const sorted = sortDiscoveredUrlsDeterministically(urls);
  return createHash("sha256").update(sorted.join("\n")).digest("hex");
}

export function isSitemapPathname(pathname: string): boolean {
  const p = pathname.toLowerCase();
  return p.endsWith(".xml") || p.includes("sitemap");
}

function extractLocs(body: string): string[] {
  return [...body.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map((m) => m[1].trim());
}

function isSitemapIndexDocument(body: string): boolean {
  return /<sitemapindex\b/i.test(body);
}

function parseRobotsSitemapDirectives(robotsTxt: string): string[] {
  const out: string[] = [];
  for (const line of robotsTxt.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const colon = trimmed.indexOf(":");
    if (colon <= 0) continue;
    const key = trimmed.slice(0, colon).trim().toLowerCase();
    const value = trimmed.slice(colon + 1).trim();
    if (key === "sitemap" && value) out.push(value);
  }
  return out;
}

export async function loadRobotsPolicyFailClosed(
  verifiedHost: string,
  fetchImpl: typeof fetchVerifiedPublicSiteUrl = fetchVerifiedPublicSiteUrl,
): Promise<RobotsPolicyResult & { body?: string }> {
  const fetched = await fetchImpl({
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
  return { ok: true, disallow: parseRobotsTxtDisallowPaths(body), body };
}

async function collectFromSitemapDocument(input: {
  verifiedHost: string;
  sitemapUrl: string;
  depth: number;
  pageUrls: Set<string>;
  visitedSitemaps: Set<string>;
  rejectedPrivateSample: string[];
  fetchImpl: typeof fetchVerifiedPublicSiteUrl;
  counters: { sitemapFetches: number; truncated: boolean };
}): Promise<void> {
  const {
    verifiedHost,
    sitemapUrl,
    depth,
    pageUrls,
    visitedSitemaps,
    rejectedPrivateSample,
    fetchImpl,
    counters,
  } = input;

  if (counters.truncated) return;
  if (pageUrls.size >= WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_DISCOVERED) {
    counters.truncated = true;
    return;
  }
  if (depth > WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_SITEMAP_DEPTH) return;

  const canonicalSitemap = (() => {
    const decision = evaluatePublicSiteIndexUrl(sitemapUrl, verifiedHost);
    if (!decision.ok) return null;
    return normalizePublicSiteIndexCanonicalUrl(decision.url);
  })();
  if (!canonicalSitemap) return;
  if (visitedSitemaps.has(canonicalSitemap)) return;
  visitedSitemaps.add(canonicalSitemap);

  const fetched = await fetchImpl({
    url: canonicalSitemap,
    verifiedHost,
  });
  counters.sitemapFetches += 1;
  if (!fetched.ok) return;

  const locs = extractLocs(fetched.body);
  const nestedIndex = isSitemapIndexDocument(fetched.body);

  for (const loc of locs) {
    if (pageUrls.size >= WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_DISCOVERED) {
      counters.truncated = true;
      return;
    }
    const decision = evaluatePublicSiteIndexUrl(loc, verifiedHost);
    if (!decision.ok) {
      if (
        decision.reason === "private_path" &&
        rejectedPrivateSample.length < 12
      ) {
        rejectedPrivateSample.push(loc.split("?")[0] ?? loc);
      }
      continue;
    }
    const canonical = normalizePublicSiteIndexCanonicalUrl(decision.url);
    if (nestedIndex || isSitemapPathname(decision.pathname)) {
      await collectFromSitemapDocument({
        verifiedHost,
        sitemapUrl: canonical,
        depth: depth + 1,
        pageUrls,
        visitedSitemaps,
        rejectedPrivateSample,
        fetchImpl,
        counters,
      });
      continue;
    }
    pageUrls.add(canonical);
  }
}

/**
 * Universal public URL discovery for a verified host.
 * robots.txt (fail-closed) + Sitemap: directives + nested sitemap indexes + root.
 */
export async function discoverPublicSiteIndexUrls(input: {
  verifiedHost: string;
  seedUrls?: string[];
  fetchImpl?: typeof fetchVerifiedPublicSiteUrl;
}): Promise<PublicSiteDiscoveryResult> {
  const host = input.verifiedHost.trim().toLowerCase();
  const fetchImpl = input.fetchImpl ?? fetchVerifiedPublicSiteUrl;
  const rejectedPrivateSample: string[] = [];

  const robots = await loadRobotsPolicyFailClosed(host, fetchImpl);
  if (!robots.ok) {
    return {
      robotsStatus: "fail_closed",
      robotsReason: robots.reason,
      disallow: [],
      urls: [],
      discoveryFingerprint: fingerprintDiscoveredUrls([]),
      sitemapFetches: 0,
      truncated: false,
      rejectedPrivateSample: [],
    };
  }

  const pageUrls = new Set<string>();
  const visitedSitemaps = new Set<string>();
  const counters = { sitemapFetches: 0, truncated: false };

  const robotsSitemaps = robots.body
    ? parseRobotsSitemapDirectives(robots.body)
    : [];
  const seeds = uniquePreserve([
    ...(input.seedUrls ?? []),
    ...robotsSitemaps,
    `https://${host}/sitemap.xml`,
    `https://${host}/`,
  ]);

  for (const seed of seeds) {
    const decision = evaluatePublicSiteIndexUrl(seed, host);
    if (!decision.ok) {
      if (
        decision.reason === "private_path" &&
        rejectedPrivateSample.length < 12
      ) {
        rejectedPrivateSample.push(seed.split("?")[0] ?? seed);
      }
      continue;
    }
    const canonical = normalizePublicSiteIndexCanonicalUrl(decision.url);
    if (isSitemapPathname(decision.pathname)) {
      await collectFromSitemapDocument({
        verifiedHost: host,
        sitemapUrl: canonical,
        depth: 0,
        pageUrls,
        visitedSitemaps,
        rejectedPrivateSample,
        fetchImpl,
        counters,
      });
      continue;
    }
    pageUrls.add(canonical);
  }

  const urls = sortDiscoveredUrlsDeterministically([...pageUrls]).slice(
    0,
    WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_DISCOVERED,
  );

  return {
    robotsStatus: "ok",
    disallow: robots.disallow,
    urls,
    discoveryFingerprint: fingerprintDiscoveredUrls(urls),
    sitemapFetches: counters.sitemapFetches,
    truncated:
      counters.truncated || pageUrls.size > WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_DISCOVERED,
    rejectedPrivateSample,
  };
}
