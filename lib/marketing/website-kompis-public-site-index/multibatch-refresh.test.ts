import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
function installServerOnlyShim(): void {
  const moduleApi = require("node:module") as {
    Module: {
      _load: (request: string, parent: unknown, isMain: boolean) => unknown;
    };
  };
  const originalLoad = moduleApi.Module._load;
  moduleApi.Module._load = function (request, parent, isMain) {
    if (request === "server-only") return {};
    return originalLoad.call(this, request, parent, isMain);
  };
}
installServerOnlyShim();

const LOCALES = ["no", "en", "se", "dk", "de", "fi"] as const;
const PATHS = [
  "",
  "/about",
  "/how-it-works",
  "/membership",
  "/pricing",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
  "/safety",
  "/community",
  "/features",
  "/blog",
  "/help",
  "/guide",
  "/partners",
  "/press",
  "/careers",
  "/cookies",
  "/accessibility",
  "/status",
  "/changelog",
  "/security",
  "/support",
  "/resources",
  "/stories",
  "/events",
  "/newsletter",
  "/brand",
  "/trust",
  "/compare",
  "/start",
  "/welcome",
  "/discover-public",
  "/public-guide",
] as const;

function buildPageUrls(host: string): string[] {
  const urls: string[] = [];
  for (const locale of LOCALES) {
    for (const p of PATHS) {
      urls.push(`https://${host}/${locale}${p}`);
    }
  }
  // 6 * 35 = 210; add 3 public extras under /no for exactly 213 sitemap URLs
  urls.push(`https://${host}/no/extra-a`);
  urls.push(`https://${host}/no/extra-b`);
  urls.push(`https://${host}/no/extra-c`);
  assert.equal(urls.length, 213);
  return urls;
}

function pageHtml(title: string, lang: string, body: string): string {
  return `<!doctype html><html lang="${lang}"><head>
<title>${title}</title>
<meta name="description" content="${body.slice(0, 120)}" />
<script>self.__next_f.push([1,"pad"]);</script>
</head><body><main><h1>${title}</h1><p>${body}</p>
<p>Public membership information for WEBSITE_NAME with clear next steps for visitors.</p>
</main></body></html>`;
}

function mockFetchForHost(host: string, pageUrls: string[]) {
  const localeSitemaps = LOCALES.map(
    (locale) => `https://${host}/sitemap-${locale}.xml`,
  );
  const indexBody = `<?xml version="1.0"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${localeSitemaps
    .map((u) => `<sitemap><loc>${u}</loc></sitemap>`)
    .join("")}</sitemapindex>`;

  const byLocale = new Map<string, string[]>();
  for (const locale of LOCALES) byLocale.set(locale, []);
  for (const url of pageUrls) {
    const m = url.match(new RegExp(`https://${host.replace(/\./g, "\\.")}/(no|en|se|dk|de|fi)(/|$)`));
    if (m) byLocale.get(m[1])!.push(url);
  }

  return async function fetchImpl(input: {
    url: string;
    verifiedHost: string;
  }): Promise<
    | {
        ok: true;
        finalUrl: string;
        status: number;
        body: string;
        contentType: string;
        xRobotsTag: string | null;
        decodedBytes: number;
      }
    | { ok: false; reason: string }
  > {
    const url = input.url;
    if (url === `https://${host}/robots.txt`) {
      const body = `User-agent: *\nDisallow: /admin\nDisallow: /member\nSitemap: https://${host}/sitemap.xml\n`;
      return {
        ok: true,
        finalUrl: url,
        status: 200,
        body,
        contentType: "text/plain",
        xRobotsTag: null,
        decodedBytes: Buffer.byteLength(body),
      };
    }
    if (url === `https://${host}/sitemap.xml`) {
      return {
        ok: true,
        finalUrl: url,
        status: 200,
        body: indexBody,
        contentType: "application/xml",
        xRobotsTag: null,
        decodedBytes: Buffer.byteLength(indexBody),
      };
    }
    for (const locale of LOCALES) {
      if (url === `https://${host}/sitemap-${locale}.xml`) {
        const locs = byLocale.get(locale) ?? [];
        const body = `<?xml version="1.0"?><urlset>${locs
          .map((u) => `<url><loc>${u}</loc></url>`)
          .join("")}</urlset>`;
        return {
          ok: true,
          finalUrl: url,
          status: 200,
          body,
          contentType: "application/xml",
          xRobotsTag: null,
          decodedBytes: Buffer.byteLength(body),
        };
      }
    }
    if (url.includes("/member") || url.includes("/admin")) {
      return { ok: false, reason: "url_rejected" };
    }
    if (pageUrls.includes(url) || url === `https://${host}/`) {
      const lang = url.includes("/en")
        ? "en"
        : url.includes("/se")
          ? "sv"
          : url.includes("/no")
            ? "nb"
            : "en";
      const body = pageHtml(
        "Public page",
        lang,
        "WEBSITE_NAME explains public membership benefits for verified visitors on this page.",
      );
      // Oversize rejection fixture for one URL path
      if (url.endsWith("/changelog")) {
        const huge = "x".repeat(2 * 1024 * 1024 + 100);
        return { ok: false, reason: "body_too_large" };
      }
      return {
        ok: true,
        finalUrl: url,
        status: 200,
        body,
        contentType: "text/html",
        xRobotsTag: null,
        decodedBytes: Buffer.byteLength(body),
      };
    }
    // noindex sample
    if (url.includes("noindex-test")) {
      return {
        ok: true,
        finalUrl: url,
        status: 200,
        body: pageHtml("x", "en", "y").replace(
          "<head>",
          '<head><meta name="robots" content="noindex" />',
        ),
        contentType: "text/html",
        xRobotsTag: null,
        decodedBytes: 200,
      };
    }
    return { ok: false, reason: "http_error" };
  };
}

async function main() {
  const {
    ingestTenantPublicSiteIndex,
  } = await import("./ingest");
  const {
    discoverPublicSiteIndexUrls,
  } = await import("./discovery");
  const {
    encodePublicSiteIndexCursor,
    validatePublicSiteIndexCursor,
  } = await import("./cursor");
  const {
    planPublicSiteIndexRefresh,
    registerPublicSiteIndexAutoRefreshScheduler,
    nextPublicSiteIndexRetryBackoff,
    WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_STALE_AFTER_MS,
  } = await import("./refresh");
  const {
    resolvePublicSiteIndexPersistGate,
    isPublicSiteIndexPersistEnabled,
    isPublicSiteIndexAutoRefreshEnabled,
  } = await import("./write-gate");

  // --- Write gates default off ---
  assert.equal(isPublicSiteIndexPersistEnabled({}), false);
  assert.equal(isPublicSiteIndexAutoRefreshEnabled({}), false);
  assert.equal(
    resolvePublicSiteIndexPersistGate({ dryRun: false, confirmation: true, env: {} })
      .allowPersist,
    false,
  );
  assert.equal(
    resolvePublicSiteIndexPersistGate({
      dryRun: false,
      confirmation: true,
      env: { AIPIFY_PUBLIC_SITE_INDEX_WRITES_ENABLED: "true" },
    }).allowPersist,
    true,
  );
  assert.equal(
    registerPublicSiteIndexAutoRefreshScheduler({ env: {} }).registered,
    false,
  );

  // --- Tenant A: 213 URLs nested sitemap, batches of 30 ---
  const hostA = "www.customer-a.example";
  const urlsA = buildPageUrls(hostA);
  const fetchA = mockFetchForHost(hostA, urlsA);

  const discoveryA = await discoverPublicSiteIndexUrls({
    verifiedHost: hostA,
    fetchImpl: fetchA as never,
  });
  assert.equal(discoveryA.robotsStatus, "ok");
  // Nested sitemaps yield 213 page locs; root seed may add `/` → 213 or 214
  assert.ok(discoveryA.urls.length >= 213);
  assert.ok(discoveryA.urls.length <= 214);
  // private member area paths are not discovered (membership ≠ /member/)
  assert.equal(
    discoveryA.urls.some((u) => /\/member(\/|$)/.test(new URL(u).pathname)),
    false,
  );
  const discoveredCount = discoveryA.urls.length;

  const tenantA = "11111111-1111-4111-8111-111111111111";
  const installA = "22222222-2222-4222-8222-222222222222";
  const seen = new Set<string>();
  let cursor: string | null = null;
  let batches = 0;
  let lastComplete = false;
  let totalEligible = 0;
  let totalRejected = 0;
  let totalProcessed = 0;

  while (batches < 20) {
    const result = await ingestTenantPublicSiteIndex({
      tenantId: tenantA,
      installId: installA,
      verifiedHost: hostA,
      maxPages: 30,
      cursor,
      dryRun: true,
      confirmation: false,
      fetchImpl: fetchA as never,
    });
    batches += 1;
    assert.equal(result.dryRun, true);
    assert.equal(result.persistAttempted, false);
    assert.equal(result.robotsStatus, "ok");
    assert.equal(result.discovered, discoveredCount);
    totalProcessed += result.processedInBatch;
    for (const u of result.indexedUrls) {
      assert.equal(seen.has(u), false, `duplicate eligible ${u}`);
      seen.add(u);
    }
    totalEligible += result.indexed;
    totalRejected += result.rejected;
    lastComplete = result.complete;
    if (result.complete) {
      assert.equal(result.nextCursor, null);
      assert.equal(result.remaining, 0);
      assert.equal(result.runStatus, "complete");
      break;
    }
    assert.equal(result.runStatus, "in_progress");
    assert.ok(result.nextCursor);
    assert.ok(result.remaining > 0);
    // misleading complete must not happen mid-run
    assert.equal(result.complete, false);
    cursor = result.nextCursor;
  }

  assert.equal(lastComplete, true);
  assert.equal(batches, Math.ceil(discoveredCount / 30));
  assert.equal(totalProcessed, discoveredCount);
  assert.equal(seen.size + totalRejected, discoveredCount);
  assert.ok(totalEligible > 150);

  // Invalid / cross-tenant cursor
  const badCursor = encodePublicSiteIndexCursor({
    tenantId: "99999999-9999-4999-8999-999999999999",
    installId: installA,
    verifiedHost: hostA,
    discoveryFingerprint: discoveryA.discoveryFingerprint,
    offset: 30,
    batchSize: 30,
    issuedAt: Date.now(),
  });
  const cross = await ingestTenantPublicSiteIndex({
    tenantId: tenantA,
    installId: installA,
    verifiedHost: hostA,
    cursor: badCursor,
    dryRun: true,
    maxPages: 30,
    fetchImpl: fetchA as never,
  });
  assert.equal(cross.runStatus, "failed");
  assert.equal(cross.errors[0]?.reason, "cursor_trust_mismatch");

  const tampered = badCursor.replace(/[A-Za-z]/, "x");
  const tamperResult = validatePublicSiteIndexCursor({
    rawCursor: tampered,
    tenantId: tenantA,
    installId: installA,
    verifiedHost: hostA,
    discoveryFingerprint: discoveryA.discoveryFingerprint,
    discoveredCount: discoveryA.urls.length,
  });
  assert.equal(tamperResult.ok, false);

  // Persist path blocked without env even with confirmation
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.AIPIFY_PUBLIC_SITE_INDEX_WRITES_ENABLED;
  const blockedWrite = await ingestTenantPublicSiteIndex({
    tenantId: tenantA,
    installId: installA,
    verifiedHost: hostA,
    maxPages: 5,
    dryRun: false,
    confirmation: true,
    fetchImpl: fetchA as never,
  });
  assert.equal(blockedWrite.dryRun, true);
  assert.equal(blockedWrite.persistAttempted, false);

  // --- Tenant B isolation ---
  const hostB = "www.customer-b.example";
  const urlsB = buildPageUrls(hostB).slice(0, 40);
  const fetchB = mockFetchForHost(hostB, urlsB);
  const resultB = await ingestTenantPublicSiteIndex({
    tenantId: "33333333-3333-4333-8333-333333333333",
    installId: "44444444-4444-4444-8444-444444444444",
    verifiedHost: hostB,
    maxPages: 30,
    dryRun: true,
    fetchImpl: fetchB as never,
  });
  assert.ok(resultB.discovered >= 40);
  assert.equal(resultB.indexedUrls.every((u) => u.includes(hostB)), true);
  assert.equal(resultB.indexedUrls.some((u) => u.includes(hostA)), false);

  // --- Refresh plan: no stale on incomplete discovery ---
  const existing = [
    {
      canonicalUrl: `https://${hostA}/no/about`,
      contentHash: "abc",
      status: "active" as const,
      crawledAt: new Date().toISOString(),
    },
    {
      canonicalUrl: `https://${hostA}/removed-page`,
      contentHash: "old",
      status: "active" as const,
      crawledAt: new Date(Date.now() - 1000).toISOString(),
    },
  ];
  const incompletePlan = planPublicSiteIndexRefresh({
    discoveredUrls: discoveryA.urls.slice(0, 50),
    existingDocuments: existing,
    discoveryIncomplete: true,
    env: {},
  });
  assert.equal(incompletePlan.urlsToMarkStale.length, 0);
  assert.equal(incompletePlan.autoRefreshEnabled, false);

  const completePlan = planPublicSiteIndexRefresh({
    discoveredUrls: discoveryA.urls,
    existingDocuments: existing,
    discoveryIncomplete: false,
    env: {},
  });
  assert.ok(completePlan.urlsToMarkStale.includes(`https://${hostA}/removed-page`));
  assert.ok(completePlan.urlsFreshSkip.includes(`https://${hostA}/no/about`));

  const stalePlan = planPublicSiteIndexRefresh({
    discoveredUrls: [`https://${hostA}/no/about`],
    existingDocuments: [
      {
        canonicalUrl: `https://${hostA}/no/about`,
        contentHash: "abc",
        status: "active",
        crawledAt: new Date(
          Date.now() - WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_STALE_AFTER_MS - 1000,
        ).toISOString(),
      },
    ],
    discoveryIncomplete: false,
  });
  assert.ok(stalePlan.urlsToProcess.includes(`https://${hostA}/no/about`));

  const backoff = nextPublicSiteIndexRetryBackoff(2);
  assert.equal(backoff.shouldRetry, true);
  assert.ok(backoff.delayMs >= 4000);
  assert.equal(nextPublicSiteIndexRetryBackoff(5).shouldRetry, false);

  // Route source contains writes_disabled gate
  const routePath = path.join(
    process.cwd(),
    "app/api/platform-portal/customers/[id]/website-kompis/public-site-index/ingest/route.ts",
  );
  const routeSrc = readFileSync(routePath, "utf8");
  assert.match(routeSrc, /writes_disabled/);
  assert.match(routeSrc, /AIPIFY_PUBLIC_SITE_INDEX_WRITES_ENABLED|isPublicSiteIndexPersistEnabled/);
  assert.match(routeSrc, /cursor/);

  // No Production cron registration file for public site index
  assert.equal(
    registerPublicSiteIndexAutoRefreshScheduler({
      env: { AIPIFY_PUBLIC_SITE_INDEX_AUTO_REFRESH_ENABLED: "true", AIPIFY_PUBLIC_SITE_INDEX_WRITES_ENABLED: "true" },
    }).reason,
    "scheduler_route_not_shipped",
  );

  console.log(
    JSON.stringify({
      ok: true,
      hostA_discovered: discoveredCount,
      batches,
      eligibleUnique: seen.size,
      totalRejected,
      tenantB_discovered: resultB.discovered,
    }),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
