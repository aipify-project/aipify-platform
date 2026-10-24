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

function response(status: number, body = "", headers: Record<string, string> = {}): Response {
  return new Response(body, { status, headers });
}

async function main() {
  const { selectInstallBoundCustomerDomains } = await import("./verified-domain-trust");
  const { fetchRobotsTxtWithinVerifiedAliases, selectVerifiedRobotsHosts } = await import(
    "./robots-alias-redirect"
  );

  const rows = [
    {
      customerId: TENANT,
      hostname: WWW,
      verificationStatus: "verified",
      status: "active",
      installId: INSTALL,
    },
    {
      customerId: TENANT,
      hostname: WWW,
      verificationStatus: "verified",
      status: "active",
      installId: OTHER_INSTALL,
    },
    {
      customerId: OTHER_TENANT,
      hostname: WWW,
      verificationStatus: "verified",
      status: "active",
      installId: INSTALL,
    },
    {
      customerId: TENANT,
      hostname: WWW,
      verificationStatus: "verified",
      status: "pending",
      installId: INSTALL,
    },
    {
      customerId: TENANT,
      hostname: WWW,
      verificationStatus: "unverified",
      status: "active",
      installId: INSTALL,
    },
    {
      customerId: TENANT,
      hostname: WWW,
      verificationStatus: "failed",
      status: "active",
      installId: INSTALL,
    },
    {
      customerId: TENANT,
      hostname: WWW,
      verificationStatus: "verified",
      status: "disabled",
      installId: INSTALL,
    },
    {
      customerId: TENANT,
      hostname: WWW,
      verificationStatus: "verified",
      status: "removed",
      installId: INSTALL,
    },
    {
      customerId: TENANT,
      hostname: "unknown.customer.example",
      verificationStatus: "unknown",
      status: "active",
      installId: INSTALL,
    },
    {
      customerId: TENANT,
      hostname: WWW,
      verificationStatus: "verified",
      status: "active",
      installId: null,
    },
    {
      customerId: TENANT,
      hostname: "blog.customer.example",
      verificationStatus: "verified",
      status: "active",
      installId: INSTALL,
    },
  ];

  const bound = selectInstallBoundCustomerDomains({
    customerId: TENANT,
    installId: INSTALL,
    rows,
  });
  assert.deepEqual(
    bound.map((row) => row.hostname).sort(),
    [WWW, "blog.customer.example"].sort(),
  );
  assert.ok(bound.every((row) => row.installId === INSTALL));
  assert.ok(bound.every((row) => row.verificationStatus === "verified" && row.status === "active"));

  const hosts = selectVerifiedRobotsHosts({
    primaryHost: APEX,
    installId: INSTALL,
    records: bound,
  });
  assert.deepEqual(hosts.sort(), [APEX, WWW].sort());

  const fetched = await fetchRobotsTxtWithinVerifiedAliases({
    verifiedHost: APEX,
    verifiedAliasHosts: hosts,
    dnsAssert: async () => ({ ok: true }),
    fetchImpl: async (input) => {
      const url = String(input);
      if (url === `https://${APEX}/robots.txt`) {
        return response(308, "", { location: `https://${WWW}/robots.txt` });
      }
      if (url === `https://${WWW}/robots.txt`) {
        return response(200, "User-agent: *\nAllow: /\n", { "content-type": "text/plain" });
      }
      return response(404, "no");
    },
  });
  assert.equal(fetched.ok, true);
  if (fetched.ok) assert.equal(fetched.finalHost, WWW);

  const challengeOnly = selectInstallBoundCustomerDomains({
    customerId: TENANT,
    installId: INSTALL,
    rows: [
      {
        customerId: TENANT,
        hostname: WWW,
        verificationStatus: "verified",
        status: "active",
        installId: null,
      },
      {
        customerId: TENANT,
        hostname: WWW,
        verificationStatus: "verified",
        status: "pending",
        installId: null,
      },
    ],
  });
  assert.deepEqual(challengeOnly, []);
  const refusedHosts = selectVerifiedRobotsHosts({
    primaryHost: APEX,
    installId: INSTALL,
    records: challengeOnly,
  });
  assert.deepEqual(refusedHosts, [APEX]);
  const blocked = await fetchRobotsTxtWithinVerifiedAliases({
    verifiedHost: APEX,
    verifiedAliasHosts: refusedHosts,
    dnsAssert: async () => ({ ok: true }),
    fetchImpl: async () => response(308, "", { location: `https://${WWW}/robots.txt` }),
  });
  assert.equal(blocked.ok, false);
  if (!blocked.ok) assert.equal(blocked.reason, "unverified_host");

  const privateHop = await fetchRobotsTxtWithinVerifiedAliases({
    verifiedHost: APEX,
    verifiedAliasHosts: hosts,
    dnsAssert: async (hostname) =>
      hostname === WWW ? { ok: false, detail: "private_ip" } : { ok: true },
    fetchImpl: async () => response(308, "", { location: `https://${WWW}/robots.txt` }),
  });
  assert.equal(privateHop.ok, false);
  if (!privateHop.ok) assert.equal(privateHop.reason, "ssrf_blocked");

  const httpHop = await fetchRobotsTxtWithinVerifiedAliases({
    verifiedHost: APEX,
    verifiedAliasHosts: hosts,
    dnsAssert: async () => ({ ok: true }),
    fetchImpl: async () => response(308, "", { location: `http://${WWW}/robots.txt` }),
  });
  assert.equal(httpHop.ok, false);

  const loop = await fetchRobotsTxtWithinVerifiedAliases({
    verifiedHost: APEX,
    verifiedAliasHosts: hosts,
    dnsAssert: async () => ({ ok: true }),
    fetchImpl: async (input) => {
      const url = String(input);
      const location = url.includes(WWW) ? `https://${APEX}/robots.txt` : `https://${WWW}/robots.txt`;
      return response(308, "", { location });
    },
  });
  assert.equal(loop.ok, false);
  if (!loop.ok) assert.equal(loop.reason, "redirect_loop");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
