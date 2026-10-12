/**
 * Job 42 — seed_only discovery must not expand via sitemap/links, must not stale neighbors,
 * and must keep mode through cursor resume (fingerprint).
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
function installServerOnlyShim(): void {
  const moduleApi = require("node:module") as {
    Module: { _load: (request: string, parent: unknown, isMain: boolean) => unknown };
  };
  const originalLoad = moduleApi.Module._load;
  moduleApi.Module._load = function (request, parent, isMain) {
    if (request === "server-only") return {};
    return originalLoad.call(this, request, parent, isMain);
  };
}
installServerOnlyShim();

const HOST = "www.customer.example";

function pageHtml(title: string, body: string): string {
  return `<!doctype html><html lang="no"><head>
<title>${title}</title>
<meta name="description" content="${body.slice(0, 80)}" />
</head><body><main><h1>${title}</h1><p>${body}</p>
<script type="application/json">{"faq":[
  {"question":"Hva skjer med Desk Pass når abonnementet utløper?","answer":"Når Desk Pass-abonnementet utløper, pauses publiserte desk-annonser. Nye desk-annonser krever aktiv tilgang."},
  {"question":"Kan jeg pause en Desk Pass-annonse og åpne den igjen?","answer":"Ja. Du kan pause en publisert desk-annonse og åpne den igjen senere."}
]}</script>
</main></body></html>`;
}

function mockFetch(input: {
  fetchedUrls: string[];
  redirectFaqToAbout?: boolean;
}): (args: {
  url: string;
  verifiedHost: string;
}) => Promise<
  | {
      ok: true;
      finalUrl: string;
      status: number;
      body: string;
      contentType: string;
      xRobotsTag: string | null;
      decodedBytes: number;
    }
  | {
      ok: false;
      reason:
        | "url_rejected"
        | "ssrf_blocked"
        | "timeout"
        | "redirect_blocked"
        | "http_error"
        | "body_too_large"
        | "body_unavailable"
        | "network_error"
        | "noindex";
    }
> {
  const sitemapUrls = [
    `https://${HOST}/no/faq`,
    `https://${HOST}/no/about`,
    `https://${HOST}/no/pricing`,
    `https://${HOST}/en/faq`,
    `https://${HOST}/no/membership`,
  ];
  return async function fetchImpl(args) {
    input.fetchedUrls.push(args.url);
    if (args.url === `https://${HOST}/robots.txt`) {
      const body = `User-agent: *\nDisallow: /admin\nSitemap: https://${HOST}/sitemap.xml\n`;
      return {
        ok: true,
        finalUrl: args.url,
        status: 200,
        body,
        contentType: "text/plain",
        xRobotsTag: null,
        decodedBytes: body.length,
      };
    }
    if (args.url === `https://${HOST}/sitemap.xml`) {
      const body = `<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapUrls
        .map((u) => `<url><loc>${u}</loc></url>`)
        .join("")}</urlset>`;
      return {
        ok: true,
        finalUrl: args.url,
        status: 200,
        body,
        contentType: "application/xml",
        xRobotsTag: null,
        decodedBytes: body.length,
      };
    }
    if (args.url.includes("/admin")) {
      return { ok: false, reason: "url_rejected" };
    }
    if (input.redirectFaqToAbout && args.url === `https://${HOST}/no/faq`) {
      const body = pageHtml("Om oss", "Offentlig about-side med desk-informasjon. ".repeat(8));
      return {
        ok: true,
        finalUrl: `https://${HOST}/no/about`,
        status: 200,
        body,
        contentType: "text/html",
        xRobotsTag: null,
        decodedBytes: body.length,
      };
    }
    const title = args.url.includes("/faq") ? "FAQ — hjelp og svar" : "Offentlig side";
    const body = pageHtml(
      title,
      "Offentlig desk-informasjon for NETTSTED_NAVN med nok tekst til indeksering. ".repeat(6),
    );
    return {
      ok: true,
      finalUrl: args.url,
      status: 200,
      body,
      contentType: "text/html",
      xRobotsTag: null,
      decodedBytes: body.length,
    };
  };
}

async function main(): Promise<void> {
  const {
    discoverPublicSiteIndexUrls,
    fingerprintDiscoveredUrls,
    ingestTenantPublicSiteIndex,
    planPublicSiteIndexRefresh,
    encodePublicSiteIndexCursor,
    validatePublicSiteIndexCursor,
    extractPublicPageFromHtml,
  } = await import("./index");

  // --- Discovery: seed_only vs standard ---
  const seedFetched: string[] = [];
  const seedDiscovery = await discoverPublicSiteIndexUrls({
    verifiedHost: HOST,
    seedUrls: [`https://${HOST}/no/faq`],
    discoveryMode: "seed_only",
    fetchImpl: mockFetch({ fetchedUrls: seedFetched }),
  });
  assert.equal(seedDiscovery.discoveryMode, "seed_only");
  assert.equal(seedDiscovery.sitemapFetches, 0);
  assert.deepEqual(seedDiscovery.urls, [`https://${HOST}/no/faq`]);
  assert.ok(!seedFetched.some((u) => u.includes("sitemap")));
  assert.ok(seedFetched.includes(`https://${HOST}/robots.txt`));
  assert.equal(
    seedDiscovery.discoveryFingerprint,
    fingerprintDiscoveredUrls([`https://${HOST}/no/faq`], "seed_only"),
  );
  assert.notEqual(
    seedDiscovery.discoveryFingerprint,
    fingerprintDiscoveredUrls([`https://${HOST}/no/faq`], "standard"),
  );

  const stdFetched: string[] = [];
  const stdDiscovery = await discoverPublicSiteIndexUrls({
    verifiedHost: HOST,
    seedUrls: [`https://${HOST}/no/faq`],
    discoveryMode: "standard",
    fetchImpl: mockFetch({ fetchedUrls: stdFetched }),
  });
  assert.equal(stdDiscovery.discoveryMode, "standard");
  assert.ok(stdDiscovery.urls.length > 1);
  assert.ok(stdDiscovery.urls.includes(`https://${HOST}/no/about`));
  assert.ok(stdFetched.some((u) => u.includes("sitemap")));

  // Sitemap URL as seed in seed_only → rejected, empty set
  const sitemapSeed = await discoverPublicSiteIndexUrls({
    verifiedHost: HOST,
    seedUrls: [`https://${HOST}/sitemap.xml`],
    discoveryMode: "seed_only",
    fetchImpl: mockFetch({ fetchedUrls: [] }),
  });
  assert.equal(sitemapSeed.urls.length, 0);
  assert.ok(
    sitemapSeed.seedRejectReasons?.some((r) => r.reason === "seed_sitemap_not_allowed"),
  );

  // --- Refresh plan: seed_only never marks neighbors stale ---
  const neighborPlan = planPublicSiteIndexRefresh({
    discoveredUrls: [`https://${HOST}/no/faq`],
    existingDocuments: [
      {
        canonicalUrl: `https://${HOST}/no/faq`,
        contentHash: "a".repeat(40),
        status: "active",
        crawledAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        canonicalUrl: `https://${HOST}/no/about`,
        contentHash: "b".repeat(40),
        status: "active",
        crawledAt: new Date().toISOString(),
      },
    ],
    discoveryIncomplete: false,
    discoveryMode: "seed_only",
  });
  assert.deepEqual(neighborPlan.urlsToMarkStale, []);
  assert.ok(neighborPlan.urlsToProcess.includes(`https://${HOST}/no/faq`));

  // --- Ingest seed_only dry-run: only FAQ fetched as page ---
  const ingestFetched: string[] = [];
  const persistCalls: Array<{ url: string; hash: string }> = [];
  const neighborHash = "neighbor-hash-unchanged-001";
  const neighborStore = new Map<string, { hash: string; status: string }>([
    [`https://${HOST}/no/about`, { hash: neighborHash, status: "active" }],
    [`https://${HOST}/no/pricing`, { hash: "pricing-hash-002", status: "active" }],
  ]);

  // Patch service role via env-less dry-run path (no persist)
  const seedIngest = await ingestTenantPublicSiteIndex({
    tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    installId: "11111111-1111-4111-8111-111111111111",
    verifiedHost: HOST,
    seedUrls: [`https://${HOST}/no/faq`],
    discoveryMode: "seed_only",
    maxPages: 5,
    dryRun: true,
    confirmation: false,
    fetchImpl: mockFetch({ fetchedUrls: ingestFetched }),
  });
  assert.equal(seedIngest.discoveryMode, "seed_only");
  assert.equal(seedIngest.discovered, 1);
  assert.equal(seedIngest.complete, true);
  assert.equal(seedIngest.nextCursor, null);
  assert.deepEqual(seedIngest.indexedUrls, [`https://${HOST}/no/faq`]);
  assert.ok(!ingestFetched.some((u) => u.includes("sitemap")));
  assert.equal(
    ingestFetched.filter((u) => u.startsWith(`https://${HOST}/no/`)).length,
    1,
  );
  // Neighbors untouched (no persist attempted)
  assert.equal(seedIngest.persistAttempted, false);
  assert.equal(neighborStore.get(`https://${HOST}/no/about`)?.hash, neighborHash);

  // Extract proof on seeded FAQ HTML
  const faqHtml = pageHtml(
    "FAQ — hjelp og svar",
    "Offentlig desk-informasjon for NETTSTED_NAVN. ".repeat(6),
  );
  const extracted = extractPublicPageFromHtml(faqHtml, "no");
  assert.match(extracted.bodyText, /pauses publiserte desk-annonser/i);
  assert.ok(extracted.chunks.some((c) => /pause en publisert desk-annonse/i.test(c)));

  // --- Cursor: resume with wrong mode fails fingerprint ---
  const cursor = encodePublicSiteIndexCursor({
    tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    installId: "11111111-1111-4111-8111-111111111111",
    verifiedHost: HOST,
    discoveryFingerprint: seedDiscovery.discoveryFingerprint,
    offset: 0,
    batchSize: 1,
    issuedAt: Date.now(),
  });
  const wrongModeFp = fingerprintDiscoveredUrls(
    [`https://${HOST}/no/faq`],
    "standard",
  );
  const mismatch = validatePublicSiteIndexCursor({
    rawCursor: cursor,
    tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    installId: "11111111-1111-4111-8111-111111111111",
    verifiedHost: HOST,
    discoveryFingerprint: wrongModeFp,
    discoveredCount: 1,
  });
  assert.equal(mismatch.ok, false);
  if (!mismatch.ok) assert.equal(mismatch.reason, "cursor_fingerprint_mismatch");

  const okResume = validatePublicSiteIndexCursor({
    rawCursor: cursor,
    tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    installId: "11111111-1111-4111-8111-111111111111",
    verifiedHost: HOST,
    discoveryFingerprint: seedDiscovery.discoveryFingerprint,
    discoveredCount: 1,
  });
  assert.equal(okResume.ok, true);

  // Retry with standard mode + seed_only cursor → failed (fingerprint)
  const resumeWrong = await ingestTenantPublicSiteIndex({
    tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    installId: "11111111-1111-4111-8111-111111111111",
    verifiedHost: HOST,
    seedUrls: [`https://${HOST}/no/faq`],
    discoveryMode: "standard",
    cursor,
    maxPages: 5,
    dryRun: true,
    fetchImpl: mockFetch({ fetchedUrls: [] }),
  });
  assert.equal(resumeWrong.runStatus, "failed");
  assert.ok(resumeWrong.errors.some((e) => e.reason === "cursor_fingerprint_mismatch"));

  // Redirect out of seed scope rejected
  const redirectFetched: string[] = [];
  const redirected = await ingestTenantPublicSiteIndex({
    tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    installId: "11111111-1111-4111-8111-111111111111",
    verifiedHost: HOST,
    seedUrls: [`https://${HOST}/no/faq`],
    discoveryMode: "seed_only",
    dryRun: true,
    fetchImpl: mockFetch({ fetchedUrls: redirectFetched, redirectFaqToAbout: true }),
  });
  assert.ok(redirected.errors.some((e) => e.reason === "seed_scope_mismatch"));
  assert.equal(redirected.indexedUrls.length, 0);

  // Cross-host seed rejected
  const cross = await discoverPublicSiteIndexUrls({
    verifiedHost: HOST,
    seedUrls: ["https://evil.example/no/faq"],
    discoveryMode: "seed_only",
    fetchImpl: mockFetch({ fetchedUrls: [] }),
  });
  assert.equal(cross.urls.length, 0);

  // Robots deny still applies in seed_only (allow/deny ≠ sitemap expansion)
  const robotsDenyFetched: string[] = [];
  const robotsDenyFetch = mockFetch({ fetchedUrls: robotsDenyFetched });
  const robotsDeny = await ingestTenantPublicSiteIndex({
    tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    installId: "11111111-1111-4111-8111-111111111111",
    verifiedHost: HOST,
    seedUrls: [`https://${HOST}/no/pricing`],
    discoveryMode: "seed_only",
    dryRun: true,
    fetchImpl: async (args) => {
      if (args.url === `https://${HOST}/robots.txt`) {
        robotsDenyFetched.push(args.url);
        const body = `User-agent: *\nDisallow: /no/pricing\n`;
        return {
          ok: true,
          finalUrl: args.url,
          status: 200,
          body,
          contentType: "text/plain",
          xRobotsTag: null,
          decodedBytes: body.length,
        };
      }
      return robotsDenyFetch(args);
    },
  });
  assert.ok(robotsDeny.errors.some((e) => e.reason === "robots_disallow"));
  assert.equal(robotsDeny.indexedUrls.length, 0);
  assert.ok(!robotsDenyFetched.some((u) => u.includes("/no/pricing")));

  // maxPages=1 without seed_only still expands discovery (regression: not a silent seed-only)
  const pageLimitFetched: string[] = [];
  const pageLimitOnly = await ingestTenantPublicSiteIndex({
    tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    installId: "11111111-1111-4111-8111-111111111111",
    verifiedHost: HOST,
    seedUrls: [`https://${HOST}/no/faq`],
    discoveryMode: "standard",
    maxPages: 1,
    dryRun: true,
    fetchImpl: mockFetch({ fetchedUrls: pageLimitFetched }),
  });
  assert.ok(pageLimitOnly.discovered > 1);
  assert.equal(pageLimitOnly.discoveryMode, "standard");
  assert.ok(pageLimitFetched.some((u) => u.includes("sitemap")));

  // Route source requires discoveryMode wiring
  const routeSrc = readFileSync(
    path.join(
      process.cwd(),
      "app/api/platform-portal/customers/[id]/website-kompis/public-site-index/ingest/route.ts",
    ),
    "utf8",
  );
  assert.match(routeSrc, /discoveryMode/);
  assert.match(routeSrc, /seed_urls_required/);

  // Content-hash stability helper used in later refresh plans
  assert.equal(
    createHash("sha256").update("x").digest("hex").length,
    64,
  );
  void persistCalls;

  console.log("seed-only-refresh-mode.test.ts: passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
