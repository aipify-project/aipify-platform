import assert from "node:assert/strict";
import { createRequire } from "node:module";
import {
  isWebsiteKompisAllowedDevOriginHostname,
  parseWebsiteKompisRequestOriginHostname,
  websiteKompisOriginHostnamesMatch,
} from "@/lib/marketing/website-kompis-embed-origin";
import {
  parseWebsiteKompisEmbedSessionMessage,
  WEBSITE_KOMPIS_EMBED_SESSION_MESSAGE_TYPE,
} from "@/lib/marketing/website-kompis-embed";

const require = createRequire(import.meta.url);
const NEUTRAL_INSTALL_ID = "11111111-1111-4111-8111-111111111111";
const NEUTRAL_DOMAIN = "example-a.test";
const NEUTRAL_TENANT_ID = "tenant-neutral-001";
const TEST_SECRET = "website-kompis-test-secret-value";

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

function requestWithIp(ip: string): Request {
  return new Request("https://aipify.ai/api/marketing/companion/ask", {
    method: "POST",
    headers: { "x-forwarded-for": ip },
  });
}

function withTestSecret<T>(run: () => T): T {
  const previous = process.env.WEBSITE_KOMPIS_EMBED_SESSION_SECRET;
  process.env.WEBSITE_KOMPIS_EMBED_SESSION_SECRET = TEST_SECRET;
  try {
    return run();
  } finally {
    if (previous === undefined) {
      delete process.env.WEBSITE_KOMPIS_EMBED_SESSION_SECRET;
    } else {
      process.env.WEBSITE_KOMPIS_EMBED_SESSION_SECRET = previous;
    }
  }
}

function assertNoPilotRuntimeStrings(source: string): void {
  const forbidden = ["aipify.tech", "unonight.com"];
  for (const value of forbidden) {
    assert.equal(
      source.includes(`"${value}"`) || source.includes(`'${value}'`),
      false,
      `forbidden pilot-specific runtime string: ${value}`,
    );
  }
}

async function runWebsiteKompisPublicSecurityGateTests() {
  installServerOnlyShim();
  const {
    embedSessionMatchesInstallContext,
    issueWebsiteKompisEmbedSession,
    verifyWebsiteKompisEmbedSession,
    WEBSITE_KOMPIS_EMBED_SESSION_TTL_SECONDS,
  } = await import("@/lib/marketing/website-kompis-embed-session");
  const {
    assertWebsiteKompisPublicRateLimit,
    clearWebsiteKompisPublicRateLimitsForTests,
    configureWebsiteKompisPublicRateLimitsForTests,
    WEBSITE_KOMPIS_PUBLIC_RATE_LIMIT_POLICY,
  } = await import("@/lib/marketing/website-kompis-public-rate-limit");

  clearWebsiteKompisPublicRateLimitsForTests();
  configureWebsiteKompisPublicRateLimitsForTests({});

  const previousEmbedSecret = process.env.WEBSITE_KOMPIS_EMBED_SESSION_SECRET;
  process.env.WEBSITE_KOMPIS_EMBED_SESSION_SECRET = TEST_SECRET;

  assert.equal(parseWebsiteKompisRequestOriginHostname("https://example-a.test"), NEUTRAL_DOMAIN);
  assert.equal(parseWebsiteKompisRequestOriginHostname("null"), null);
  assert.equal(parseWebsiteKompisRequestOriginHostname(null), null);
  assert.equal(parseWebsiteKompisRequestOriginHostname("file:///tmp"), null);

  assert.equal(websiteKompisOriginHostnamesMatch("example-a.test", "EXAMPLE-A.TEST"), true);
  assert.equal(websiteKompisOriginHostnamesMatch("www.example-a.test", "example-a.test"), false);

  withTestSecret(() => {
    const issued = issueWebsiteKompisEmbedSession({
      installId: NEUTRAL_INSTALL_ID,
      domain: NEUTRAL_DOMAIN,
      tenantId: NEUTRAL_TENANT_ID,
      nowSeconds: 1_700_000_000,
    });
    assert.equal(issued.ok, true);
    if (!issued.ok) return;

    const verified = verifyWebsiteKompisEmbedSession(issued.token, 1_700_000_100);
    assert.equal(verified.ok, true);
    if (!verified.ok) return;

    assert.equal(
      embedSessionMatchesInstallContext({
        claims: verified.claims,
        installId: NEUTRAL_INSTALL_ID,
        domain: NEUTRAL_DOMAIN,
        tenantId: NEUTRAL_TENANT_ID,
      }),
      true,
    );

    assert.equal(
      embedSessionMatchesInstallContext({
        claims: verified.claims,
        installId: NEUTRAL_INSTALL_ID,
        domain: "attacker.example",
        tenantId: NEUTRAL_TENANT_ID,
      }),
      false,
    );

    const expired = verifyWebsiteKompisEmbedSession(
      issued.token,
      1_700_000_000 + WEBSITE_KOMPIS_EMBED_SESSION_TTL_SECONDS + 1,
    );
    assert.equal(expired.ok, false);
    if (expired.ok) return;
    assert.equal(expired.reason, "expired");
  });

  const parsedSessionMessage = parseWebsiteKompisEmbedSessionMessage({
    type: WEBSITE_KOMPIS_EMBED_SESSION_MESSAGE_TYPE,
    embedSession: "token-value",
    expiresAt: 1_700_000_600,
  });
  assert.deepEqual(parsedSessionMessage, {
    embedSession: "token-value",
    expiresAt: 1_700_000_600,
  });
  assert.equal(parseWebsiteKompisEmbedSessionMessage({ type: "other" }), undefined);

  const request = requestWithIp("203.0.113.10");
  const installA = NEUTRAL_INSTALL_ID;
  const installB = "22222222-2222-4222-8222-222222222222";
  const tenantA = NEUTRAL_TENANT_ID;
  const tenantB = "tenant-neutral-002";
  const now = 1_700_000_000_000;

  for (let index = 0; index < WEBSITE_KOMPIS_PUBLIC_RATE_LIMIT_POLICY.ask.installMax; index += 1) {
    const allowed = await assertWebsiteKompisPublicRateLimit({
      category: "ask",
      request,
      installId: installA,
      tenantId: tenantA,
      nowMs: now,
    });
    assert.equal(allowed.allowed, true);
  }

  const askLimited = await assertWebsiteKompisPublicRateLimit({
    category: "ask",
    request,
    installId: installA,
    tenantId: tenantA,
    nowMs: now,
  });
  assert.equal(askLimited.allowed, false);
  if (askLimited.allowed) return;
  assert.equal(askLimited.status, 429);
  assert.equal(askLimited.retryAfterSeconds >= 1, true);

  const tenantBStillAllowed = await assertWebsiteKompisPublicRateLimit({
    category: "ask",
    request,
    installId: installB,
    tenantId: tenantB,
    nowMs: now,
  });
  assert.equal(tenantBStillAllowed.allowed, true);

  clearWebsiteKompisPublicRateLimitsForTests();
  configureWebsiteKompisPublicRateLimitsForTests({});
  for (let index = 0; index < WEBSITE_KOMPIS_PUBLIC_RATE_LIMIT_POLICY.bootstrap.installMax; index += 1) {
    assert.equal(
      (
        await assertWebsiteKompisPublicRateLimit({
          category: "bootstrap",
          request,
          installId: installA,
          scopes: ["install"],
          nowMs: now,
        })
      ).allowed,
      true,
    );
  }
  const bootstrapLimited = await assertWebsiteKompisPublicRateLimit({
    category: "bootstrap",
    request,
    installId: installA,
    scopes: ["install"],
    nowMs: now,
  });
  assert.equal(bootstrapLimited.allowed, false);

  const gateSource = await import("@/lib/marketing/website-kompis-public-security-gate");
  assertNoPilotRuntimeStrings(String(gateSource.issueWebsiteKompisEmbedSessionForRequest));
  assertNoPilotRuntimeStrings(String(gateSource.assertWebsiteKompisEmbedProtectedRequest));

  assert.equal(isWebsiteKompisAllowedDevOriginHostname("localhost"), process.env.NODE_ENV !== "production");

  if (previousEmbedSecret === undefined) {
    delete process.env.WEBSITE_KOMPIS_EMBED_SESSION_SECRET;
  } else {
    process.env.WEBSITE_KOMPIS_EMBED_SESSION_SECRET = previousEmbedSecret;
  }
}

void runWebsiteKompisPublicSecurityGateTests()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("website-kompis-public-security-gate.test.ts passed");
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exitCode = 1;
  });
