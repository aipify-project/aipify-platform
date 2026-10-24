import "server-only";

import { createServiceRoleClient } from "@/lib/supabase/service-role";
import {
  encodePublicSiteIndexCursor,
  validatePublicSiteIndexCursor,
} from "./cursor";
import {
  discoverPublicSiteIndexUrls,
  loadRobotsPolicyFailClosed,
  normalizePublicSiteIndexDiscoveryMode,
  type PublicSiteIndexDiscoveryMode,
} from "./discovery";
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
} from "./url-policy";
import { resolvePublicSiteIndexPersistGate } from "./write-gate";

export type { RobotsPolicyResult } from "./discovery";
export { loadRobotsPolicyFailClosed } from "./discovery";

export type PublicSiteIndexIngestInput = {
  tenantId: string;
  installId: string;
  verifiedHost: string;
  /** Explicit seed URLs and/or sitemap discovery starting points. */
  seedUrls?: string[];
  /**
   * standard (default): robots + sitemap expansion.
   * seed_only: only validated page seeds — no sitemap/root expansion.
   * Must be re-supplied on every cursor resume (bound into discovery fingerprint).
   */
  discoveryMode?: PublicSiteIndexDiscoveryMode;
  localeHint?: string;
  /** Per-batch page ceiling (hard-capped by MAX_PAGES). */
  maxPages?: number;
  /** Opaque continuation from a prior incomplete batch. */
  cursor?: string | null;
  /** When true, discover/fetch/extract but do not persist. */
  dryRun?: boolean;
  /** Required with dryRun=false; still blocked unless persist env gate is on. */
  confirmation?: boolean;
  fetchImpl?: typeof fetchVerifiedPublicSiteUrl;
  /** Server-resolved verified hosts for this tenant and installation. */
  verifiedAliasHosts?: readonly string[];
  /** Test seam. Production ingest leaves this unset and uses the platform fetch. */
  robotsFetchImpl?: typeof fetch;
  robotsDnsAssert?: (hostname: string) => Promise<{ ok: true } | { ok: false; detail: string }>;
};

export type PublicSiteIndexIngestResult = {
  discovered: number;
  indexed: number;
  rejected: number;
  remaining: number;
  processedInBatch: number;
  batchOffset: number;
  batchSize: number;
  complete: boolean;
  runStatus: "in_progress" | "complete" | "failed" | "fail_closed";
  nextCursor: string | null;
  discoveryFingerprint: string;
  discoveryTruncated: boolean;
  dryRun: boolean;
  persistAttempted: boolean;
  robotsStatus: "ok" | "fail_closed";
  robotsFinalHost?: string | null;
  robotsDetail?: string | null;
  discoveryMode: PublicSiteIndexDiscoveryMode;
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

function emptyResult(
  partial: Partial<PublicSiteIndexIngestResult> &
    Pick<PublicSiteIndexIngestResult, "dryRun" | "robotsStatus" | "runStatus">,
): PublicSiteIndexIngestResult {
  return {
    discovered: 0,
    indexed: 0,
    rejected: 0,
    remaining: 0,
    processedInBatch: 0,
    batchOffset: 0,
    batchSize: 0,
    complete: false,
    nextCursor: null,
    discoveryFingerprint: "",
    discoveryTruncated: false,
    persistAttempted: false,
    robotsFinalHost: null,
    robotsDetail: null,
    discoveryMode: "standard",
    errors: [],
    indexedUrls: [],
    rejectedPrivateSample: [],
    pageOutcomes: [],
    ...partial,
  };
}

/**
 * Bounded SSRF-safe public site ingest batch into Core.
 * Multi-batch: one call processes at most maxPages; resume via nextCursor.
 * Must be invoked only by approved operator/service paths — never from visitor ask.
 * Caller must resolve tenantId/installId/verifiedHost from Core trust.
 */
export async function ingestTenantPublicSiteIndex(
  input: PublicSiteIndexIngestInput,
): Promise<PublicSiteIndexIngestResult> {
  const host = input.verifiedHost.trim().toLowerCase();
  const installId = input.installId?.trim();
  const dryRunRequested = input.dryRun !== false; // default true
  const confirmation = input.confirmation === true;
  const persistGate = resolvePublicSiteIndexPersistGate({
    dryRun: dryRunRequested,
    confirmation,
  });
  const allowPersist = persistGate.allowPersist;
  const dryRun = !allowPersist;

  if (!installId) {
    return emptyResult({
      dryRun,
      robotsStatus: "fail_closed",
      runStatus: "fail_closed",
      errors: [{ url: host, reason: "install_required" }],
    });
  }

  const batchSize = Math.min(
    Math.max(1, input.maxPages ?? 30),
    WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_PAGES,
  );
  const discoveryMode = normalizePublicSiteIndexDiscoveryMode(input.discoveryMode);

  const discovery = await discoverPublicSiteIndexUrls({
    verifiedHost: host,
    seedUrls: input.seedUrls ?? [],
    discoveryMode,
    fetchImpl: input.fetchImpl,
    verifiedAliasHosts: input.verifiedAliasHosts,
    robotsFetchImpl: input.robotsFetchImpl,
    robotsDnsAssert: input.robotsDnsAssert,
  });

  if (discovery.robotsStatus !== "ok") {
    return emptyResult({
      dryRun,
      robotsStatus: "fail_closed",
      robotsFinalHost: discovery.robotsFinalHost ?? null,
      robotsDetail: discovery.robotsDetail ?? null,
      runStatus: "fail_closed",
      discoveryMode,
      discoveryFingerprint: discovery.discoveryFingerprint,
      rejectedPrivateSample: discovery.rejectedPrivateSample,
      errors: [
        {
          url: `https://${host}/robots.txt`,
          reason: discovery.robotsDetail ?? discovery.robotsReason ?? "robots_fetch_failed",
        },
      ],
    });
  }

  if (
    discoveryMode === "seed_only" &&
    discovery.urls.length === 0
  ) {
    const seedErrors =
      discovery.seedRejectReasons?.length
        ? discovery.seedRejectReasons
        : [{ url: host, reason: "seed_urls_required" }];
    return emptyResult({
      dryRun,
      robotsStatus: "ok",
      runStatus: "failed",
      discoveryMode: "seed_only",
      discoveryFingerprint: discovery.discoveryFingerprint,
      rejectedPrivateSample: discovery.rejectedPrivateSample,
      rejected: seedErrors.length,
      errors: seedErrors.slice(0, 40),
    });
  }

  let offset = 0;
  if (input.cursor) {
    const validated = validatePublicSiteIndexCursor({
      rawCursor: input.cursor,
      tenantId: input.tenantId,
      installId,
      verifiedHost: host,
      discoveryFingerprint: discovery.discoveryFingerprint,
      discoveredCount: discovery.urls.length,
    });
    if (!validated.ok) {
      return emptyResult({
        dryRun,
        robotsStatus: "ok",
        runStatus: "failed",
        discoveryMode,
        discovered: discovery.urls.length,
        discoveryFingerprint: discovery.discoveryFingerprint,
        discoveryTruncated: discovery.truncated,
        rejectedPrivateSample: discovery.rejectedPrivateSample,
        errors: [{ url: host, reason: validated.reason }],
      });
    }
    offset = validated.cursor.offset;
  }

  const batchUrls = discovery.urls.slice(offset, offset + batchSize);
  const seedScope = new Set(discovery.urls);
  const disallow = discovery.disallow;
  const fetchImpl = input.fetchImpl ?? fetchVerifiedPublicSiteUrl;
  const supabase = allowPersist ? createServiceRoleClient() : null;
  const errors: Array<{ url: string; reason: string }> = [];
  const indexedUrls: string[] = [];
  const pageOutcomes: PublicSiteIndexIngestResult["pageOutcomes"] = [];
  const rejectedPrivateSample = [...discovery.rejectedPrivateSample];
  let rejected = 0;
  let persistAttempted = false;

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

  for (const url of batchUrls) {
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

    const fetched = await fetchImpl({ url, verifiedHost: host });
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
    if (discoveryMode === "seed_only" && !seedScope.has(canonical)) {
      rejected += 1;
      errors.push({ url, reason: "seed_scope_mismatch" });
      pushOutcome(url, "seed_scope_mismatch", {
        decodedBytes: fetched.decodedBytes,
      });
      continue;
    }

    if (!allowPersist || !supabase) {
      indexedUrls.push(canonical);
      pushOutcome(canonical, "eligible", {
        decodedBytes: fetched.decodedBytes,
        locale: extracted.locale,
        title: extracted.title,
        excerptSample: extracted.excerpt || extracted.bodyText.slice(0, 160),
      });
      continue;
    }

    persistAttempted = true;
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

  const nextOffset = offset + batchUrls.length;
  const remaining = Math.max(0, discovery.urls.length - nextOffset);
  const complete = remaining === 0 && !discovery.truncated;
  const nextCursor =
    remaining > 0
      ? encodePublicSiteIndexCursor({
          tenantId: input.tenantId,
          installId,
          verifiedHost: host,
          discoveryFingerprint: discovery.discoveryFingerprint,
          offset: nextOffset,
          batchSize,
          issuedAt: Date.now(),
        })
      : null;

  return {
    discovered: discovery.urls.length,
    indexed: indexedUrls.length,
    rejected,
    remaining,
    processedInBatch: batchUrls.length,
    batchOffset: offset,
    batchSize,
    complete,
    runStatus: complete ? "complete" : "in_progress",
    nextCursor,
    discoveryFingerprint: discovery.discoveryFingerprint,
    discoveryTruncated: discovery.truncated,
    dryRun,
    persistAttempted,
    robotsStatus: "ok",
    robotsFinalHost: discovery.robotsFinalHost ?? host,
    discoveryMode,
    errors: errors.slice(0, 40),
    indexedUrls,
    rejectedPrivateSample,
    pageOutcomes,
  };
}
