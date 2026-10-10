import assert from "node:assert/strict";
import { createRequire } from "node:module";
import {
  createWebsiteKompisMemoryRateLimitStore,
  createWebsiteKompisUnavailableRateLimitStore,
} from "@/lib/marketing/website-kompis-rate-limit-store";

const require = createRequire(import.meta.url);
const NEUTRAL_INSTALL_ID = "11111111-1111-4111-8111-111111111111";
const NEUTRAL_TENANT_ID = "tenant-neutral-001";
const TEST_SECRET = "website-kompis-rate-limit-test-secret";

function installServerOnlyShim(): void {
  const moduleApi = require("node:module") as {
    Module: {
      _load: (request: string, parent: unknown, isMain: boolean) => unknown;
    };
  };
  const originalLoad = moduleApi.Module._load;
  moduleApi.Module._load = function (request, parent, isMain) {
    if (request === "server-only") {
      return {};
    }
    return originalLoad.call(this, request, parent, isMain);
  };
}

function requestWithIp(ip: string | null): Request {
  const headers = new Headers();
  if (ip) {
    headers.set("x-forwarded-for", ip);
  }
  return new Request("https://aipify.ai/api/marketing/companion/ask", {
    method: "POST",
    headers,
  });
}

function withRateLimitSecrets<T>(run: () => T | Promise<T>): Promise<T> {
  const previousEmbed = process.env.WEBSITE_KOMPIS_EMBED_SESSION_SECRET;
  const previousEnv = process.env.VERCEL_ENV;
  process.env.WEBSITE_KOMPIS_EMBED_SESSION_SECRET = TEST_SECRET;
  delete process.env.VERCEL_ENV;
  return Promise.resolve()
    .then(run)
    .finally(() => {
      if (previousEmbed === undefined) {
        delete process.env.WEBSITE_KOMPIS_EMBED_SESSION_SECRET;
      } else {
        process.env.WEBSITE_KOMPIS_EMBED_SESSION_SECRET = previousEmbed;
      }
      if (previousEnv === undefined) {
        delete process.env.VERCEL_ENV;
      } else {
        process.env.VERCEL_ENV = previousEnv;
      }
    });
}

function assertNoPilotRuntimeStrings(source: string): void {
  for (const value of ["aipify.tech", "unonight.com"]) {
    assert.equal(
      source.includes(`"${value}"`) || source.includes(`'${value}'`),
      false,
      `forbidden pilot-specific runtime string: ${value}`,
    );
  }
}

async function runWebsiteKompisPublicRateLimitTests() {
  installServerOnlyShim();
  const {
    assertWebsiteKompisPublicRateLimit,
    buildWebsiteKompisRateLimitRedisKey,
    clearWebsiteKompisPublicRateLimitsForTests,
    configureWebsiteKompisPublicRateLimitsForTests,
    hashWebsiteKompisRateLimitIpIdentifier,
    resolveWebsiteKompisRateLimitEnvironmentNamespace,
    WEBSITE_KOMPIS_PUBLIC_RATE_LIMIT_POLICY,
    websiteKompisPublicClientIp,
  } = await import("@/lib/marketing/website-kompis-public-rate-limit");
  const {
    isWebsiteKompisProductionLikeRateLimitRuntime,
    resetWebsiteKompisRateLimitStoreForTests,
  } = await import("@/lib/marketing/website-kompis-upstash-rate-limit-store");

  clearWebsiteKompisPublicRateLimitsForTests();

  await withRateLimitSecrets(async () => {
    assert.equal(websiteKompisPublicClientIp(requestWithIp("203.0.113.10")), "203.0.113.10");
    assert.equal(
      websiteKompisPublicClientIp(requestWithIp("203.0.113.10, 198.51.100.20")),
      "203.0.113.10",
    );
    assert.equal(websiteKompisPublicClientIp(requestWithIp(null)), null);

    const ipHashA = hashWebsiteKompisRateLimitIpIdentifier("203.0.113.10");
    const ipHashB = hashWebsiteKompisRateLimitIpIdentifier("198.51.100.20");
    assert.ok(ipHashA);
    assert.ok(ipHashB);
    assert.notEqual(ipHashA, ipHashB);
    assert.equal(ipHashA?.includes("203.0.113.10"), false);

    const sharedState = new Map<string, { count: number; expiresAt: number }>();
    const storeA = configureWebsiteKompisPublicRateLimitsForTests({ sharedState });
    const storeB = createWebsiteKompisMemoryRateLimitStore(sharedState);
    const request = requestWithIp("203.0.113.10");
    const now = 1_700_000_000_000;

    for (let index = 0; index < WEBSITE_KOMPIS_PUBLIC_RATE_LIMIT_POLICY.ask.installMax; index += 1) {
      const allowed = await assertWebsiteKompisPublicRateLimit({
        category: "ask",
        request,
        installId: NEUTRAL_INSTALL_ID,
        tenantId: NEUTRAL_TENANT_ID,
        nowMs: now,
        store: storeA,
      });
      assert.equal(allowed.allowed, true);
    }

    const limitedViaSecondInstance = await assertWebsiteKompisPublicRateLimit({
      category: "ask",
      request,
      installId: NEUTRAL_INSTALL_ID,
      tenantId: NEUTRAL_TENANT_ID,
      nowMs: now,
      store: storeB,
    });
    assert.equal(limitedViaSecondInstance.allowed, false);
    if (limitedViaSecondInstance.allowed) return;
    assert.equal(limitedViaSecondInstance.status, 429);
    assert.equal(limitedViaSecondInstance.retryAfterSeconds >= 1, true);

    clearWebsiteKompisPublicRateLimitsForTests();
    const coldStartStore = configureWebsiteKompisPublicRateLimitsForTests({ sharedState });
    await assertWebsiteKompisPublicRateLimit({
      category: "ask",
      request,
      installId: NEUTRAL_INSTALL_ID,
      tenantId: NEUTRAL_TENANT_ID,
      nowMs: now,
      store: coldStartStore,
    });
    const afterColdStart = await assertWebsiteKompisPublicRateLimit({
      category: "ask",
      request,
      installId: NEUTRAL_INSTALL_ID,
      tenantId: NEUTRAL_TENANT_ID,
      nowMs: now,
      store: storeB,
    });
    assert.equal(afterColdStart.allowed, false);

    clearWebsiteKompisPublicRateLimitsForTests();
    const concurrentStore = configureWebsiteKompisPublicRateLimitsForTests({});
    const concurrentRequest = requestWithIp("203.0.113.55");
    const concurrentResults = await Promise.all(
      Array.from({ length: WEBSITE_KOMPIS_PUBLIC_RATE_LIMIT_POLICY.ask.ipMax + 5 }, () =>
        assertWebsiteKompisPublicRateLimit({
          category: "ask",
          request: concurrentRequest,
          installId: NEUTRAL_INSTALL_ID,
          tenantId: NEUTRAL_TENANT_ID,
          nowMs: now,
          store: concurrentStore,
          scopes: ["ip"],
        }),
      ),
    );
    const allowedCount = concurrentResults.filter((result) => result.allowed).length;
    assert.equal(allowedCount, WEBSITE_KOMPIS_PUBLIC_RATE_LIMIT_POLICY.ask.ipMax);

    clearWebsiteKompisPublicRateLimitsForTests();
    const ttlStore = configureWebsiteKompisPublicRateLimitsForTests({});
    const ttlRequest = requestWithIp("203.0.113.77");
    const ttlKey = buildWebsiteKompisRateLimitRedisKey({
      category: "bootstrap",
      scope: "ip",
      identifier: hashWebsiteKompisRateLimitIpIdentifier("203.0.113.77") ?? "missing",
    });
    assert.match(ttlKey, /^website-kompis:/);

    const first = await assertWebsiteKompisPublicRateLimit({
      category: "bootstrap",
      request: ttlRequest,
      scopes: ["ip"],
      nowMs: now,
      store: ttlStore,
    });
    assert.equal(first.allowed, true);

    const second = await assertWebsiteKompisPublicRateLimit({
      category: "bootstrap",
      request: ttlRequest,
      scopes: ["ip"],
      nowMs: now + WEBSITE_KOMPIS_PUBLIC_RATE_LIMIT_POLICY.bootstrap.windowMs + 1_000,
      store: ttlStore,
    });
    assert.equal(second.allowed, true);

    clearWebsiteKompisPublicRateLimitsForTests();
    const previewEnv = process.env.VERCEL_ENV;
    process.env.VERCEL_ENV = "preview";
    const previewKey = buildWebsiteKompisRateLimitRedisKey({
      category: "ask",
      scope: "install",
      identifier: NEUTRAL_INSTALL_ID,
    });
    process.env.VERCEL_ENV = "production";
    const productionKey = buildWebsiteKompisRateLimitRedisKey({
      category: "ask",
      scope: "install",
      identifier: NEUTRAL_INSTALL_ID,
    });
    if (previewEnv === undefined) {
      delete process.env.VERCEL_ENV;
    } else {
      process.env.VERCEL_ENV = previewEnv;
    }
    assert.notEqual(previewKey, productionKey);

    clearWebsiteKompisPublicRateLimitsForTests();
    const missingIpStore = configureWebsiteKompisPublicRateLimitsForTests({});
    for (let index = 0; index < WEBSITE_KOMPIS_PUBLIC_RATE_LIMIT_POLICY.ask.ipMax; index += 1) {
      const allowed = await assertWebsiteKompisPublicRateLimit({
        category: "ask",
        request: requestWithIp(null),
        scopes: ["ip"],
        nowMs: now,
        store: missingIpStore,
      });
      assert.equal(allowed.allowed, true);
    }
    const missingIpLimited = await assertWebsiteKompisPublicRateLimit({
      category: "ask",
      request: requestWithIp(null),
      scopes: ["ip"],
      nowMs: now,
      store: missingIpStore,
    });
    assert.equal(missingIpLimited.allowed, false);

    clearWebsiteKompisPublicRateLimitsForTests();
    const tenantAStore = configureWebsiteKompisPublicRateLimitsForTests({});
    for (let index = 0; index < WEBSITE_KOMPIS_PUBLIC_RATE_LIMIT_POLICY.ask.tenantMax; index += 1) {
      await assertWebsiteKompisPublicRateLimit({
        category: "ask",
        request: requestWithIp(`203.0.113.${index + 1}`),
        installId: NEUTRAL_INSTALL_ID,
        tenantId: NEUTRAL_TENANT_ID,
        nowMs: now,
        store: tenantAStore,
        scopes: ["tenant"],
      });
    }
    const tenantLimited = await assertWebsiteKompisPublicRateLimit({
      category: "ask",
      request: requestWithIp("203.0.113.250"),
      installId: "22222222-2222-4222-8222-222222222222",
      tenantId: NEUTRAL_TENANT_ID,
      nowMs: now,
      store: tenantAStore,
      scopes: ["tenant"],
    });
    assert.equal(tenantLimited.allowed, false);

    const tenantBAllowed = await assertWebsiteKompisPublicRateLimit({
      category: "ask",
      request: requestWithIp("203.0.113.251"),
      installId: "33333333-3333-4333-8333-333333333333",
      tenantId: "tenant-neutral-002",
      nowMs: now,
      store: tenantAStore,
      scopes: ["tenant"],
    });
    assert.equal(tenantBAllowed.allowed, true);

    clearWebsiteKompisPublicRateLimitsForTests();
    configureWebsiteKompisPublicRateLimitsForTests({
      store: createWebsiteKompisUnavailableRateLimitStore(),
    });
    const unavailable = await assertWebsiteKompisPublicRateLimit({
      category: "ask",
      request,
      installId: NEUTRAL_INSTALL_ID,
      tenantId: NEUTRAL_TENANT_ID,
      nowMs: now,
    });
    assert.equal(unavailable.allowed, false);
    if (unavailable.allowed) return;
    assert.equal(unavailable.status, 503);
    assert.equal("backendUnavailable" in unavailable && unavailable.backendUnavailable, true);

    const previousCron = process.env.CRON_SECRET;
    delete process.env.WEBSITE_KOMPIS_EMBED_SESSION_SECRET;
    delete process.env.CRON_SECRET;
    const missingSecret = await assertWebsiteKompisPublicRateLimit({
      category: "ask",
      request,
      installId: NEUTRAL_INSTALL_ID,
      tenantId: NEUTRAL_TENANT_ID,
      store: createWebsiteKompisMemoryRateLimitStore(),
    });
    if (previousCron === undefined) {
      delete process.env.CRON_SECRET;
    } else {
      process.env.CRON_SECRET = previousCron;
    }
    process.env.WEBSITE_KOMPIS_EMBED_SESSION_SECRET = TEST_SECRET;
    assert.equal(missingSecret.allowed, false);
    if (missingSecret.allowed) return;
    assert.equal(missingSecret.status, 503);

    assert.equal(resolveWebsiteKompisRateLimitEnvironmentNamespace(), "development");
    assert.equal(isWebsiteKompisProductionLikeRateLimitRuntime(), process.env.NODE_ENV === "production");

    const gateSource = await import("@/lib/marketing/website-kompis-public-security-gate");
    assertNoPilotRuntimeStrings(String(gateSource.issueWebsiteKompisEmbedSessionForRequest));
    assertNoPilotRuntimeStrings(String(gateSource.assertWebsiteKompisEmbedProtectedRequest));
  });

  resetWebsiteKompisRateLimitStoreForTests();
}

void runWebsiteKompisPublicRateLimitTests()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("website-kompis-public-rate-limit.test.ts passed");
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exitCode = 1;
  });
