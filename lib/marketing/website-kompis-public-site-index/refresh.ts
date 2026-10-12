import {
  isPublicSiteIndexAutoRefreshEnabled,
  type PublicSiteIndexEnv,
} from "./write-gate";

/** Default stale window aligned with Core document stale_after default (7 days). */
export const WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_STALE_AFTER_MS = 7 * 24 * 60 * 60 * 1000;

/** Suggested refresh interval once auto-refresh is owner-enabled (not registered here). */
export const WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_REFRESH_INTERVAL_MS =
  24 * 60 * 60 * 1000;

export type IndexedDocumentRefreshView = {
  canonicalUrl: string;
  contentHash: string;
  status: "active" | "stale" | "rejected" | "archived";
  crawledAt: string;
};

export type PublicSiteRefreshPlan = {
  mode: "initial" | "periodic";
  /** URLs discovered this cycle that should be (re)fetched in remaining batches. */
  urlsToProcess: string[];
  /** Active docs whose URL disappeared from a *complete* discovery — mark stale only then. */
  urlsToMarkStale: string[];
  /** Docs still within freshness window and unchanged — skip fetch when hash known. */
  urlsFreshSkip: string[];
  completeDiscoveryRequiredForStale: boolean;
  autoRefreshEnabled: boolean;
};

/**
 * Plan a refresh cycle from discovery + existing index rows.
 * Never marks stale unless discoveryIncomplete=false (full site discovery finished).
 * Partial/transient failures must not delete or stale the whole index.
 */
export function planPublicSiteIndexRefresh(input: {
  discoveredUrls: string[];
  existingDocuments: IndexedDocumentRefreshView[];
  discoveryIncomplete: boolean;
  /**
   * seed_only must never be treated as a complete site discovery — unvisited
   * neighbor documents must not be marked stale.
   */
  discoveryMode?: "standard" | "seed_only";
  nowMs?: number;
  env?: PublicSiteIndexEnv;
}): PublicSiteRefreshPlan {
  const now = input.nowMs ?? Date.now();
  const discovered = new Set(input.discoveredUrls);
  const existingByUrl = new Map(
    input.existingDocuments.map((d) => [d.canonicalUrl, d]),
  );
  // Explicit seed-only scope is never a full-site inventory.
  const discoveryIncomplete =
    input.discoveryMode === "seed_only" ? true : input.discoveryIncomplete;

  const urlsToProcess: string[] = [];
  const urlsFreshSkip: string[] = [];

  for (const url of input.discoveredUrls) {
    const existing = existingByUrl.get(url);
    if (!existing || existing.status !== "active") {
      urlsToProcess.push(url);
      continue;
    }
    const crawledAt = Date.parse(existing.crawledAt);
    const age = Number.isFinite(crawledAt) ? now - crawledAt : Number.POSITIVE_INFINITY;
    if (age >= WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_STALE_AFTER_MS) {
      urlsToProcess.push(url);
      continue;
    }
    urlsFreshSkip.push(url);
  }

  const urlsToMarkStale: string[] = [];
  if (!discoveryIncomplete) {
    for (const doc of input.existingDocuments) {
      if (doc.status !== "active") continue;
      if (!discovered.has(doc.canonicalUrl)) {
        urlsToMarkStale.push(doc.canonicalUrl);
      }
    }
  }

  return {
    mode: input.existingDocuments.length === 0 ? "initial" : "periodic",
    urlsToProcess,
    urlsToMarkStale,
    urlsFreshSkip,
    completeDiscoveryRequiredForStale: true,
    autoRefreshEnabled: isPublicSiteIndexAutoRefreshEnabled(input.env),
  };
}

/**
 * Scheduler registration stub — ALWAYS no-op unless explicitly enabled.
 * This task does NOT create a Production cron route.
 */
export function registerPublicSiteIndexAutoRefreshScheduler(input?: {
  env?: PublicSiteIndexEnv;
}): { registered: false; reason: string } {
  if (!isPublicSiteIndexAutoRefreshEnabled(input?.env)) {
    return {
      registered: false,
      reason: "auto_refresh_disabled",
    };
  }
  // Even when env is true, this module never self-registers a cron in-process.
  // A future approved worker must import a dedicated cron route separately.
  return {
    registered: false,
    reason: "scheduler_route_not_shipped",
  };
}

export type RetryBackoffDecision = {
  shouldRetry: boolean;
  delayMs: number;
  attempt: number;
};

/** Exponential backoff for transient fetch failures (bounded). */
export function nextPublicSiteIndexRetryBackoff(
  attempt: number,
  baseMs = 1_000,
  maxMs = 60_000,
): RetryBackoffDecision {
  const safeAttempt = Math.max(0, Math.min(attempt, 8));
  if (safeAttempt >= 5) {
    return { shouldRetry: false, delayMs: 0, attempt: safeAttempt };
  }
  const delayMs = Math.min(maxMs, baseMs * 2 ** safeAttempt);
  return { shouldRetry: true, delayMs, attempt: safeAttempt };
}
