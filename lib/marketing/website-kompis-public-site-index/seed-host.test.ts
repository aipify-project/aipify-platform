import assert from "node:assert/strict";
import { createRequire } from "node:module";

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

const TENANT = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const OTHER_TENANT = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const INSTALL = "11111111-1111-4111-8111-111111111111";
const OTHER_INSTALL = "22222222-2222-4222-8222-222222222222";
const APEX = "customer.example";
const WWW = "www.customer.example";
const ROBOTS = "User-agent: *\nAllow: /\n";
const PAGE = "<html><head><title>Public page title</title></head><body><p>Public page body with enough words to remain indexable for the seed host check and to clear the minimum text length used by the extractor.</p></body></html>";

function response(status: number, body = "", headers: Record<string, string> = {}): Response {
  return new Response(body, { status, headers });
}

async function main() {
  const { selectInstallBoundCustomerDomains } = await import("./verified-domain-trust");
  const { selectVerifiedRobotsHosts } = await import("./robots-alias-redirect");
  const { evaluateSeedUrlOnTrustedHosts } = await import("./seed-host");
  const { discoverPublicSiteIndexUrls } = await import("./discovery");
  const { ingestTenantPublicSiteIndex } = await import("./ingest");
  const { normalizePublicSiteIndexCanonicalUrl } = await import("./url-policy");

  const bound = selectInstallBoundCustomerDomains({
    customerId: TENANT,
    installId: INSTALL,
    rows: [
      { customerId: TENANT, hostname: WWW, verificationStatus: "verified", status: "active", installId: INSTALL },
      { customerId: TENANT, hostname: WWW, verificationStatus: "verified", status: "active", installId: OTHER_INSTALL },
      { customerId: OTHER_TENANT, hostname: WWW, verificationStatus: "verified", status: "active", installId: INSTALL },
      { customerId: TENANT, hostname: WWW, verificationStatus: "verified", status: "pending", installId: INSTALL },
      { customerId: TENANT, hostname: WWW, verificationStatus: "unverified", status: "active", installId: INSTALL },
      { customerId: TENANT, hostname: WWW, verificationStatus: "verified", status: "disabled", installId: INSTALL },
      { customerId: TENANT, hostname: WWW, verificationStatus: "verified", status: "removed", installId: INSTALL },
      { customerId: TENANT, hostname: WWW, verificationStatus: "verified", status: "active", installId: null },
    ],
  });
  const hosts = selectVerifiedRobotsHosts({
    primaryHost: APEX,
    installId: INSTALL,
    records: bound,
  });
  assert.deepEqual(hosts.sort(), [APEX, WWW].sort());

  const seeds = Array.from({ length: 212 }, (_, index) => `https://${WWW}/page-${index}`);
  const accepted = seeds.map((seed) => evaluateSeedUrlOnTrustedHosts(seed, hosts));
  assert.equal(accepted.every((decision) => decision.ok), true);
  if (accepted[0]?.ok) {
    assert.equal(accepted[0].url.hostname, WWW);
    assert.equal(
      normalizePublicSiteIndexCanonicalUrl(accepted[0].url),
      `https://${WWW}/page-0`,
    );
  }

  const apexSeed = evaluateSeedUrlOnTrustedHosts(`https://${APEX}/about`, hosts);
  assert.equal(apexSeed.ok, true);
  if (apexSeed.ok) assert.equal(apexSeed.url.hostname, APEX);

  const deniedRows = [
    { customerId: TENANT, hostname: WWW, verificationStatus: "verified", status: "active", installId: OTHER_INSTALL },
    { customerId: OTHER_TENANT, hostname: WWW, verificationStatus: "verified", status: "active", installId: INSTALL },
    { customerId: TENANT, hostname: WWW, verificationStatus: "pending", status: "active", installId: INSTALL },
    { customerId: TENANT, hostname: WWW, verificationStatus: "verified", status: "disabled", installId: INSTALL },
    { customerId: TENANT, hostname: WWW, verificationStatus: "verified", status: "active", installId: null },
  ];
  for (const row of deniedRows) {
    const deniedHosts = selectVerifiedRobotsHosts({
      primaryHost: APEX,
      installId: INSTALL,
      records: selectInstallBoundCustomerDomains({
        customerId: TENANT,
        installId: INSTALL,
        rows: [row],
      }),
    });
    const decision = evaluateSeedUrlOnTrustedHosts(`https://${WWW}/about`, deniedHosts);
    assert.equal(decision.ok, false);
    if (!decision.ok) assert.equal(decision.reason, "host_mismatch");
  }

  const foreign = evaluateSeedUrlOnTrustedHosts("https://evil.example/about", hosts);
  assert.equal(foreign.ok, false);
  if (!foreign.ok) assert.equal(foreign.reason, "host_mismatch");
  const insecure = evaluateSeedUrlOnTrustedHosts(`http://${WWW}/about`, hosts);
  assert.equal(insecure.ok, false);
  if (!insecure.ok) assert.equal(insecure.reason, "protocol_blocked");
  const privatePath = evaluateSeedUrlOnTrustedHosts(`https://${WWW}/account`, hosts);
  assert.equal(privatePath.ok, false);
  if (!privatePath.ok) assert.equal(privatePath.reason, "private_path");

  const discovered = await discoverPublicSiteIndexUrls({
    verifiedHost: APEX,
    discoveryMode: "seed_only",
    seedUrls: [`https://${WWW}/about`, `https://${APEX}/pricing`, "https://evil.example/x"],
    verifiedAliasHosts: hosts,
    robotsDnsAssert: async () => ({ ok: true }),
    robotsFetchImpl: async (input) => {
      const url = String(input);
      if (url === `https://${APEX}/robots.txt`) {
        return response(308, "", { location: `https://${WWW}/robots.txt` });
      }
      return response(200, ROBOTS, { "content-type": "text/plain" });
    },
  });
  assert.equal(discovered.robotsStatus, "ok");
  assert.equal(discovered.robotsFinalHost, WWW);
  assert.deepEqual(
    discovered.urls.sort(),
    [`https://${APEX}/pricing`, `https://${WWW}/about`].sort(),
  );
  assert.equal(
    discovered.seedRejectReasons?.some((item) => item.reason === "host_mismatch"),
    true,
  );

  let fetchedHost = "";
  const ingested = await ingestTenantPublicSiteIndex({
    tenantId: TENANT,
    installId: INSTALL,
    verifiedHost: APEX,
    verifiedAliasHosts: hosts,
    discoveryMode: "seed_only",
    seedUrls: [`https://${WWW}/about`],
    dryRun: true,
    confirmation: false,
    maxPages: 1,
    robotsDnsAssert: async () => ({ ok: true }),
    robotsFetchImpl: async () => response(200, "User-agent: *\nDisallow: /secret\n"),
    fetchImpl: async (input) => {
      fetchedHost = input.verifiedHost;
      return {
        ok: true,
        finalUrl: input.url,
        status: 200,
        body: PAGE,
        contentType: "text/html",
        xRobotsTag: null,
        decodedBytes: PAGE.length,
      };
    },
  });
  assert.equal(ingested.robotsStatus, "ok");
  assert.equal(ingested.runStatus, "complete");
  assert.equal(ingested.discovered, 1);
  assert.equal(ingested.indexed, 1);
  assert.equal(ingested.persistAttempted, false);
  assert.equal(ingested.indexedUrls[0], `https://${WWW}/about`);
  assert.equal(fetchedHost, WWW);

  const moved = await ingestTenantPublicSiteIndex({
    tenantId: TENANT,
    installId: INSTALL,
    verifiedHost: APEX,
    verifiedAliasHosts: hosts,
    discoveryMode: "seed_only",
    seedUrls: [`https://${WWW}/about`],
    dryRun: true,
    maxPages: 1,
    robotsDnsAssert: async () => ({ ok: true }),
    robotsFetchImpl: async () => response(200, ROBOTS),
    fetchImpl: async () => ({
      ok: true,
      finalUrl: `https://${APEX}/about`,
      status: 200,
      body: PAGE,
      contentType: "text/html",
      xRobotsTag: null,
      decodedBytes: PAGE.length,
    }),
  });
  assert.equal(moved.indexed, 0);
  assert.equal(moved.errors[0]?.reason, "host_mismatch");

  const noindex = await ingestTenantPublicSiteIndex({
    tenantId: TENANT,
    installId: INSTALL,
    verifiedHost: APEX,
    verifiedAliasHosts: hosts,
    discoveryMode: "seed_only",
    seedUrls: [`https://${WWW}/about`],
    dryRun: true,
    maxPages: 1,
    robotsDnsAssert: async () => ({ ok: true }),
    robotsFetchImpl: async () => response(200, ROBOTS),
    fetchImpl: async (input) => ({
      ok: true,
      finalUrl: input.url,
      status: 200,
      body: `<html><head><meta name="robots" content="noindex"><title>Hidden</title></head><body><p>${PAGE}</p></body></html>`,
      contentType: "text/html",
      xRobotsTag: null,
      decodedBytes: 200,
    }),
  });
  assert.equal(noindex.indexed, 0);
  assert.equal(noindex.errors[0]?.reason, "noindex");

  const disallowed = await ingestTenantPublicSiteIndex({
    tenantId: TENANT,
    installId: INSTALL,
    verifiedHost: APEX,
    verifiedAliasHosts: hosts,
    discoveryMode: "seed_only",
    seedUrls: [`https://${WWW}/secret`],
    dryRun: true,
    maxPages: 1,
    robotsDnsAssert: async () => ({ ok: true }),
    robotsFetchImpl: async () => response(200, "User-agent: *\nDisallow: /secret\n"),
    fetchImpl: async () => {
      throw new Error("page fetch must not run");
    },
  });
  assert.equal(disallowed.indexed, 0);
  assert.equal(disallowed.errors[0]?.reason, "robots_disallow");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
