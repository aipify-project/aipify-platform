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

const APEX = "customer.example";
const WWW = "www.customer.example";
const INSTALL = "11111111-1111-4111-8111-111111111111";
const OTHER_INSTALL = "22222222-2222-4222-8222-222222222222";
const ROBOTS = "User-agent: *\nAllow: /\n";

function response(status: number, body = "", headers: Record<string, string> = {}): Response {
  return new Response(body, { status, headers });
}

function scripted(steps: Array<(url: string) => Response>) {
  const calls: string[] = [];
  const impl: typeof fetch = async (input) => {
    const url = String(input);
    calls.push(url);
    const next = steps.shift();
    if (!next) throw new Error(`unexpected fetch ${url}`);
    return next(url);
  };
  return { impl, calls };
}

const dnsOk = async () => ({ ok: true as const });

async function main() {
  const {
    evaluateRobotsDocumentUrl,
    evaluateRobotsRedirect,
    fetchRobotsTxtWithinVerifiedAliases,
    isExactApexWwwPair,
    selectVerifiedRobotsHosts,
  } = await import("./robots-alias-redirect");
  const { discoverPublicSiteIndexUrls, loadRobotsPolicyFailClosed } = await import("./discovery");
  const { ingestTenantPublicSiteIndex } = await import("./ingest");
  const { evaluatePublicSiteIndexUrl, isPathDisallowedByRobots } = await import("./url-policy");

  assert.equal(isExactApexWwwPair(APEX, WWW), true);
  assert.equal(isExactApexWwwPair(WWW, APEX), true);
  assert.equal(isExactApexWwwPair(APEX, "www.other.example"), false);
  assert.equal(isExactApexWwwPair(APEX, "blog.customer.example"), false);
  assert.equal(isExactApexWwwPair("www.www.customer.example", WWW), false);
  assert.equal(isExactApexWwwPair(APEX, APEX), false);

  const both = selectVerifiedRobotsHosts({
    primaryHost: APEX,
    installId: INSTALL,
    records: [
      { hostname: APEX, verificationStatus: "verified", status: "active", installId: INSTALL },
      { hostname: WWW, verificationStatus: "verified", status: "active", installId: INSTALL },
      { hostname: "www.other.example", verificationStatus: "verified", status: "active", installId: INSTALL },
      { hostname: WWW, verificationStatus: "pending", status: "active", installId: INSTALL },
      { hostname: "www.foreign.example", verificationStatus: "verified", status: "active", installId: OTHER_INSTALL },
    ],
  });
  assert.deepEqual(both.sort(), [APEX, WWW].sort());

  const unverifiedWww = selectVerifiedRobotsHosts({
    primaryHost: APEX,
    installId: INSTALL,
    records: [
      { hostname: WWW, verificationStatus: "verified", status: "pending", installId: INSTALL },
    ],
  });
  assert.deepEqual(unverifiedWww, [APEX]);

  const allowed = new Set([APEX, WWW]);
  const apexToWww = evaluateRobotsRedirect({
    currentUrl: `https://${APEX}/robots.txt`,
    location: `https://${WWW}/robots.txt`,
    allowedHosts: allowed,
  });
  assert.equal(apexToWww.ok, true);
  const wwwToApex = evaluateRobotsRedirect({
    currentUrl: `https://${WWW}/robots.txt`,
    location: `https://${APEX}/robots.txt`,
    allowedHosts: allowed,
  });
  assert.equal(wwwToApex.ok, true);

  const httpHop = evaluateRobotsRedirect({
    currentUrl: `https://${APEX}/robots.txt`,
    location: `http://${WWW}/robots.txt`,
    allowedHosts: allowed,
  });
  assert.equal(httpHop.ok, false);
  if (!httpHop.ok) assert.equal(httpHop.reason, "protocol_blocked");

  const credentials = evaluateRobotsRedirect({
    currentUrl: `https://${APEX}/robots.txt`,
    location: `https://user:secret@${WWW}/robots.txt`,
    allowedHosts: allowed,
  });
  assert.equal(credentials.ok, false);
  if (!credentials.ok) assert.equal(credentials.reason, "credentials_present");

  const query = evaluateRobotsDocumentUrl(`https://${WWW}/robots.txt?next=/admin`, allowed);
  assert.equal(query.ok, false);
  const wrongPath = evaluateRobotsDocumentUrl(`https://${WWW}/private/robots.txt`, allowed);
  assert.equal(wrongPath.ok, false);

  const foreign = evaluateRobotsRedirect({
    currentUrl: `https://${APEX}/robots.txt`,
    location: "https://www.other.example/robots.txt",
    allowedHosts: allowed,
  });
  assert.equal(foreign.ok, false);

  const onlyApex = new Set([APEX]);
  const missingAlias = evaluateRobotsRedirect({
    currentUrl: `https://${APEX}/robots.txt`,
    location: `https://${WWW}/robots.txt`,
    allowedHosts: onlyApex,
  });
  assert.equal(missingAlias.ok, false);
  if (!missingAlias.ok) assert.equal(missingAlias.reason, "unverified_host");

  const apexWww = scripted([
    () => response(308, "", { location: `https://${WWW}/robots.txt` }),
    () => response(200, ROBOTS, { "content-type": "text/plain" }),
  ]);
  const followed = await fetchRobotsTxtWithinVerifiedAliases({
    verifiedHost: APEX,
    verifiedAliasHosts: [APEX, WWW],
    fetchImpl: apexWww.impl,
    dnsAssert: dnsOk,
  });
  assert.equal(followed.ok, true);
  if (followed.ok) {
    assert.equal(followed.finalHost, WWW);
    assert.match(followed.body, /User-agent/);
  }
  assert.deepEqual(apexWww.calls, [
    `https://${APEX}/robots.txt`,
    `https://${WWW}/robots.txt`,
  ]);

  const wwwApex = scripted([
    () => response(308, "", { location: `https://${APEX}/robots.txt` }),
    () => response(200, ROBOTS),
  ]);
  const reverse = await fetchRobotsTxtWithinVerifiedAliases({
    verifiedHost: WWW,
    verifiedAliasHosts: [WWW, APEX],
    fetchImpl: wwwApex.impl,
    dnsAssert: dnsOk,
  });
  assert.equal(reverse.ok, true);
  if (reverse.ok) assert.equal(reverse.finalHost, APEX);

  const multi = scripted([
    () => response(308, "", { location: `https://${WWW}/robots.txt` }),
    () => response(308, "", { location: `https://${APEX}/robots.txt` }),
    () => response(200, ROBOTS),
  ]);
  const multiHop = await fetchRobotsTxtWithinVerifiedAliases({
    verifiedHost: APEX,
    verifiedAliasHosts: [APEX, WWW],
    fetchImpl: multi.impl,
    dnsAssert: dnsOk,
  });
  assert.equal(multiHop.ok, true);
  if (multiHop.ok) assert.equal(multiHop.finalHost, APEX);

  const sameHost = scripted([
    () => response(302, "", { location: `https://${APEX}/robots.txt` }),
    () => response(200, ROBOTS),
  ]);
  const same = await fetchRobotsTxtWithinVerifiedAliases({
    verifiedHost: APEX,
    verifiedAliasHosts: [APEX],
    fetchImpl: sameHost.impl,
    dnsAssert: dnsOk,
  });
  assert.equal(same.ok, true);
  if (same.ok) assert.equal(same.finalHost, APEX);

  const looped = scripted([
    () => response(308, "", { location: `https://${WWW}/robots.txt` }),
    () => response(308, "", { location: `https://${APEX}/robots.txt` }),
    () => response(308, "", { location: `https://${WWW}/robots.txt` }),
    () => response(200, ROBOTS),
  ]);
  const loop = await fetchRobotsTxtWithinVerifiedAliases({
    verifiedHost: APEX,
    verifiedAliasHosts: [APEX, WWW],
    fetchImpl: looped.impl,
    dnsAssert: dnsOk,
  });
  assert.equal(loop.ok, false);
  if (!loop.ok) assert.equal(loop.reason, "redirect_loop");
  assert.equal(looped.calls.length, 3);

  const capped = scripted([
    () => response(308, "", { location: `https://${WWW}/robots.txt` }),
    () => response(200, ROBOTS),
  ]);
  const maxed = await fetchRobotsTxtWithinVerifiedAliases({
    verifiedHost: APEX,
    verifiedAliasHosts: [APEX, WWW],
    fetchImpl: capped.impl,
    dnsAssert: dnsOk,
    maxRedirects: 0,
  });
  assert.equal(maxed.ok, false);
  if (!maxed.ok) assert.equal(maxed.detail, "max_redirects");
  assert.equal(capped.calls.length, 1);

  const privateDns = scripted([
    () => response(200, ROBOTS),
  ]);
  const privateHit = await fetchRobotsTxtWithinVerifiedAliases({
    verifiedHost: APEX,
    verifiedAliasHosts: [APEX],
    fetchImpl: privateDns.impl,
    dnsAssert: async () => ({ ok: false, detail: "private_ip_blocked" }),
  });
  assert.equal(privateHit.ok, false);
  if (!privateHit.ok) assert.equal(privateHit.reason, "ssrf_blocked");
  assert.equal(privateDns.calls.length, 0);

  const down = scripted([
    () => {
      throw new Error("socket");
    },
  ]);
  const failed = await fetchRobotsTxtWithinVerifiedAliases({
    verifiedHost: APEX,
    verifiedAliasHosts: [APEX],
    fetchImpl: down.impl,
    dnsAssert: dnsOk,
  });
  assert.equal(failed.ok, false);
  if (!failed.ok) assert.equal(failed.reason, "network_error");

  const hidden = scripted([
    () => response(200, ROBOTS, { "x-robots-tag": "noindex" }),
  ]);
  const noindex = await fetchRobotsTxtWithinVerifiedAliases({
    verifiedHost: APEX,
    verifiedAliasHosts: [APEX],
    fetchImpl: hidden.impl,
    dnsAssert: dnsOk,
  });
  assert.equal(noindex.ok, false);
  if (!noindex.ok) assert.equal(noindex.reason, "noindex");

  const policy = await loadRobotsPolicyFailClosed(APEX, undefined, {
    verifiedAliasHosts: [APEX, WWW],
    dnsAssert: dnsOk,
    fetchImpl: scripted([
      () => response(308, "", { location: `https://${WWW}/robots.txt` }),
      () => response(200, "User-agent: *\nDisallow: /private\n"),
    ]).impl,
  });
  assert.equal(policy.ok, true);
  if (policy.ok) {
    assert.equal(policy.finalHost, WWW);
    assert.equal(isPathDisallowedByRobots("/private/page", policy.disallow), true);
    assert.equal(isPathDisallowedByRobots("/about", policy.disallow), false);
  }

  let pageFetches = 0;
  const blocked = await discoverPublicSiteIndexUrls({
    verifiedHost: APEX,
    discoveryMode: "seed_only",
    seedUrls: [`https://${WWW}/about`],
    verifiedAliasHosts: [APEX, WWW],
    robotsDnsAssert: dnsOk,
    robotsFetchImpl: async () => {
      throw new Error("robots down");
    },
    fetchImpl: async () => {
      pageFetches += 1;
      return { ok: false, reason: "network_error" };
    },
  });
  assert.equal(blocked.robotsStatus, "fail_closed");
  assert.equal(blocked.urls.length, 0);
  assert.equal(pageFetches, 0);

  const cleared = await discoverPublicSiteIndexUrls({
    verifiedHost: APEX,
    discoveryMode: "seed_only",
    seedUrls: [`https://${WWW}/about`, `https://${APEX}/about`],
    verifiedAliasHosts: [APEX, WWW],
    robotsDnsAssert: dnsOk,
    robotsFetchImpl: scripted([
      () => response(308, "", { location: `https://${WWW}/robots.txt` }),
      () => response(200, ROBOTS),
    ]).impl,
    fetchImpl: async () => {
      pageFetches += 1;
      return { ok: false, reason: "network_error" };
    },
  });
  assert.equal(cleared.robotsStatus, "ok");
  assert.equal(cleared.robotsFinalHost, WWW);
  assert.equal(pageFetches, 0);
  assert.deepEqual(cleared.urls, [`https://${APEX}/about`]);
  assert.equal(
    cleared.seedRejectReasons?.some((item) => item.reason === "host_mismatch"),
    true,
  );
  const wwwSeed = evaluatePublicSiteIndexUrl(`https://${WWW}/about`, APEX);
  assert.equal(wwwSeed.ok, false);

  let ingestPages = 0;
  const ingestBlocked = await ingestTenantPublicSiteIndex({
    tenantId: "33333333-3333-4333-8333-333333333333",
    installId: INSTALL,
    verifiedHost: APEX,
    verifiedAliasHosts: [APEX],
    discoveryMode: "seed_only",
    seedUrls: [`https://${APEX}/about`],
    dryRun: true,
    robotsDnsAssert: dnsOk,
    robotsFetchImpl: async () => {
      throw new Error("robots down");
    },
    fetchImpl: async () => {
      ingestPages += 1;
      return { ok: false, reason: "network_error" };
    },
  });
  assert.equal(ingestBlocked.robotsStatus, "fail_closed");
  assert.equal(ingestBlocked.runStatus, "fail_closed");
  assert.equal(ingestPages, 0);
  assert.equal(ingestBlocked.persistAttempted, false);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
