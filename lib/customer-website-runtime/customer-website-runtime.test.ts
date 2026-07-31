import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";
import {
  CUSTOMER_WEBSITE_RUNTIME_LABEL_KEYS,
  runtimeAckStatusLabelKey,
  runtimeAckStatusTone,
  runtimeFullyVerifiedTone,
} from "./labels";
import {
  isPathMounted,
  normalizePath,
  buildRuntimeProofHeaders,
  fetchRuntimePage,
  CUSTOMER_WEBSITE_RUNTIME_CONTRACT,
} from "./adapter";
import {
  isBlockedHostname,
  isPrivateOrReservedIp,
  isSameHostRedirect,
} from "./ssrf";
import {
  parseRuntimeContextRpc,
  parseRuntimeManifestRpc,
  parseRuntimePageRpc,
  parseRuntimeStatusRpc,
} from "./parse";
import { CUSTOMER_WEBSITE_RUNTIME_CONTRACT as CONTRACT, RUNTIME_PROOF_HEADERS } from "./types";
import {
  assertAuthorizedAipifyEmail,
  containsForbiddenAipifyCom,
  evaluateAipifyEmailDomain,
  findForbiddenAipifyComHits,
  isOwnedAipifyEmailDomain,
  isReservedExampleDomain,
} from "@/lib/aipify-domain-ownership";

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

function discoverLocales(): string[] {
  return readdirSync("locales").filter((name) => {
    try {
      return statSync(join("locales", name)).isDirectory();
    } catch {
      return false;
    }
  });
}

function runAdapterTests() {
  assert.equal(normalizePath(""), "/");
  assert.equal(normalizePath("/"), "/");
  assert.equal(normalizePath("about"), "/about");
  assert.equal(normalizePath("/about/"), "/about");
  assert.equal(normalizePath("/pricing"), "/pricing");

  assert.equal(isPathMounted("/", [], false), false);
  assert.equal(isPathMounted("/", [], true), true);
  assert.equal(isPathMounted("/about", ["/about"], false), true);
  assert.equal(isPathMounted("/about/", ["/about"], false), true);
  assert.equal(isPathMounted("/secret", ["/about"], false), false);
  assert.equal(isPathMounted("/about", [], false), false);

  const headers = buildRuntimeProofHeaders({
    versionRef: "v1",
    manifestChecksum: "abc",
    pageChecksum: "def",
    installationRef: "inst",
  });
  assert.equal(headers[RUNTIME_PROOF_HEADERS.version], "v1");
  assert.equal(headers[RUNTIME_PROOF_HEADERS.manifestChecksum], "abc");
  assert.equal(headers[RUNTIME_PROOF_HEADERS.pageChecksum], "def");
  assert.equal(headers[RUNTIME_PROOF_HEADERS.installation], "inst");
  assert.equal(headers["X-Aipify-Runtime-Contract"], CUSTOMER_WEBSITE_RUNTIME_CONTRACT);

  console.log("customer-website-runtime adapter: all tests passed");
}

async function runAdapterFetchFallbackTests() {
  const denied = await fetchRuntimePage(
    {
      apiBaseUrl: "https://app.example",
      installationToken: "tok",
      mountedPaths: ["/about"],
      homepageEnabled: false,
      fetchImpl: async () => {
        throw new Error("should not fetch when not mounted");
      },
    },
    "/",
  );
  assert.equal(denied.ok, false);
  if (!denied.ok) {
    assert.equal(denied.reason, "route_not_mounted");
    assert.equal(denied.fallback, true);
  }

  const timeout = await fetchRuntimePage(
    {
      apiBaseUrl: "https://app.example",
      installationToken: "tok",
      mountedPaths: ["/about"],
      timeoutMs: 10,
      fetchImpl: async (_url, init) => {
        await new Promise((_, reject) => {
          init?.signal?.addEventListener("abort", () => {
            const err = new Error("Aborted");
            err.name = "AbortError";
            reject(err);
          });
        });
        throw new Error("unreachable");
      },
    },
    "/about",
  );
  assert.equal(timeout.ok, false);
  if (!timeout.ok) {
    assert.equal(timeout.reason, "timeout");
    assert.equal(timeout.fallback, true);
  }

  const network = await fetchRuntimePage(
    {
      apiBaseUrl: "https://app.example",
      installationToken: "tok",
      mountedPaths: ["/about"],
      fetchImpl: async () => {
        throw new Error("network");
      },
    },
    "/about",
  );
  assert.equal(network.ok, false);
  if (!network.ok) {
    assert.equal(network.reason, "network_failure");
    assert.equal(network.fallback, true);
  }

  console.log("customer-website-runtime adapter fetch: all tests passed");
}

function runSsrfTests() {
  assert.equal(isBlockedHostname("localhost"), true);
  assert.equal(isBlockedHostname("metadata.google.internal"), true);
  assert.equal(isBlockedHostname("foo.local"), true);
  assert.equal(isBlockedHostname("customer.example"), false);

  assert.equal(isPrivateOrReservedIp("127.0.0.1"), true);
  assert.equal(isPrivateOrReservedIp("10.0.0.1"), true);
  assert.equal(isPrivateOrReservedIp("192.168.1.1"), true);
  assert.equal(isPrivateOrReservedIp("169.254.169.254"), true);
  assert.equal(isPrivateOrReservedIp("172.16.0.1"), true);
  assert.equal(isPrivateOrReservedIp("8.8.8.8"), false);

  assert.equal(isSameHostRedirect("customer.example", "/ok"), true);
  assert.equal(isSameHostRedirect("customer.example", "https://customer.example/ok"), true);
  assert.equal(isSameHostRedirect("customer.example", "https://evil.example/ok"), false);
  assert.equal(isSameHostRedirect("customer.example", null), false);

  console.log("customer-website-runtime ssrf: all tests passed");
}

function runParseTests() {
  const ctxFail = parseRuntimeContextRpc({ ok: false, reason: "invalid_token" });
  assert.equal(ctxFail.ok, false);
  if (!ctxFail.ok) assert.equal(ctxFail.reason, "invalid_token");

  const ctx = parseRuntimeContextRpc({
    ok: true,
    contract_version: CONTRACT,
    published: true,
    installation_ref: "i1",
    organization_ref: "o1",
    website_ref: "w1",
    domain: "customer.example",
    environment: "production",
    default_locale: "en",
    active_locales: ["en", "no"],
    published_routes: [{ path: "/about", locale: "en" }],
    mounted_paths: ["/about"],
    homepage_enabled: false,
    fallback_mode: "customer_runtime",
    acknowledgement_required: true,
    cache_token: "c1",
    config_version: 2,
    version_ref: "vref",
    version_number: 3,
    manifest_checksum: "m1",
  });
  assert.equal(ctx.ok, true);
  if (ctx.ok) {
    assert.equal(ctx.domain, "customer.example");
    assert.equal(ctx.homepageEnabled, false);
    assert.deepEqual(ctx.mountedPaths, ["/about"]);
    assert.equal(ctx.manifestChecksum, "m1");
  }

  const page = parseRuntimePageRpc({
    ok: true,
    path: "/about",
    locale: "en",
    version_ref: "v",
    version_number: 1,
    manifest_checksum: "m",
    page_checksum: "p",
    title: "About",
    content: { blocks: [] },
    seo: {},
    robots: "index, follow",
    cache_token: "c",
  });
  assert.equal(page.ok, true);
  if (page.ok) {
    assert.equal(page.pageChecksum, "p");
    assert.equal(page.title, "About");
  }

  const manifest = parseRuntimeManifestRpc({
    ok: true,
    version_ref: "v",
    version_number: 1,
    manifest_checksum: "m",
    default_locale: "en",
    locales: ["en"],
    pages: [{ path: "/about", locale: "en", title: "About", content_checksum: "p", revision_number: 1 }],
    cache_token: "c",
  });
  assert.equal(manifest.ok, true);
  if (manifest.ok) assert.equal(manifest.pages.length, 1);

  const status = parseRuntimeStatusRpc({
    available: true,
    website_provisioned: true,
    runtime_enabled: true,
    homepage_enabled: false,
    mounted_paths: ["/about"],
    acknowledgement_status: "verified",
    http_status: "pending",
    fully_verified: false,
    db_published: true,
  });
  assert.equal(status.available, true);
  assert.equal(status.acknowledgementStatus, "verified");
  assert.equal(status.httpStatus, "pending");
  assert.equal(status.fullyVerified, false);

  console.log("customer-website-runtime parse: all tests passed");
}

async function runAuthContractTests() {
  const { isValidRuntimeIdempotencyKey } = await import("./auth");
  assert.equal(isValidRuntimeIdempotencyKey("short"), false);
  assert.equal(isValidRuntimeIdempotencyKey("x".repeat(129)), false);
  assert.equal(isValidRuntimeIdempotencyKey("cwr-ack-12345678"), true);
  assert.equal(isValidRuntimeIdempotencyKey(null), false);

  const authSrc = readFileSync("lib/customer-website-runtime/auth.ts", "utf8");
  assert.match(authSrc, /Never log the value/);
  assert.doesNotMatch(authSrc, /console\.(log|info|debug).*token/i);

  console.log("customer-website-runtime auth: all tests passed");
}

function runLabelToneTests() {
  assert.equal(runtimeAckStatusLabelKey("verified"), "statusVerified");
  assert.equal(runtimeAckStatusLabelKey("mismatch"), "statusMismatch");
  assert.equal(runtimeAckStatusLabelKey("blocked"), "statusBlocked");
  assert.equal(runtimeAckStatusLabelKey(null), "statusNotConfigured");
  assert.equal(runtimeAckStatusTone("verified"), "success");
  assert.equal(runtimeAckStatusTone("pending"), "warning");
  assert.equal(runtimeAckStatusTone("mismatch"), "danger");
  assert.equal(runtimeFullyVerifiedTone(true), "success");
  assert.equal(runtimeFullyVerifiedTone(false), "warning");
  console.log("customer-website-runtime labels: all tests passed");
}

function runLocaleParityTests() {
  const locales = discoverLocales();
  assert.ok(locales.includes("en"));
  assert.ok(locales.includes("no"));
  assert.ok(locales.includes("es"));

  for (const locale of locales) {
    const platform = JSON.parse(readFileSync(join("locales", locale, "platform.json"), "utf8"));
    const section = platform.customerWebsiteRuntime;
    assert.ok(section, `${locale}: missing platform.customerWebsiteRuntime`);
    for (const key of CUSTOMER_WEBSITE_RUNTIME_LABEL_KEYS) {
      assert.equal(typeof section[key], "string", `${locale}: missing platform key ${key}`);
      assert.ok(section[key].trim().length > 0, `${locale}: empty platform key ${key}`);
    }
    assert.doesNotMatch(
      JSON.stringify(section),
      /unonight/i,
      `${locale}: platform runtime labels must not hardcode customer names`,
    );

    const core = JSON.parse(readFileSync(join("locales", locale, "customer-app", "core.json"), "utf8"));
    const appSection = core.websiteRuntime;
    assert.ok(appSection, `${locale}: missing customerApp.websiteRuntime`);
    for (const key of CUSTOMER_WEBSITE_RUNTIME_LABEL_KEYS) {
      assert.equal(typeof appSection[key], "string", `${locale}: missing app key ${key}`);
    }
    assert.equal(
      typeof core.websiteCms?.operationStatusPendingRuntime,
      "string",
      `${locale}: missing websiteCms.operationStatusPendingRuntime`,
    );
    assert.doesNotMatch(JSON.stringify(appSection), /unonight/i);
  }

  console.log(`customer-website-runtime locale parity (${locales.length}): all tests passed`);
}

function runSourceGuardTests() {
  const migration = readFileSync(
    "supabase/migrations/20261935800000_customer_website_runtime_delivery_v1.sql",
    "utf8",
  );
  assert.match(migration, /customer_website_runtime_v1/);
  assert.match(migration, /pending_runtime/);
  assert.match(migration, /set search_path = public/);
  assert.match(migration, /revoke all on table public\.customer_website_runtime_delivery/);
  assert.match(migration, /acknowledge_customer_website_runtime/);
  assert.match(migration, /platform_record_customer_website_runtime_http_check/);
  assert.doesNotMatch(migration, /unonight/i);
  assert.doesNotMatch(migration, /insert into public\.organizations/i);
  assert.doesNotMatch(migration, /insert into public\.customer_websites/i);
  assert.doesNotMatch(migration, /http[s]?:\/\/[^\s']+/i);
  assert.equal(
    findForbiddenAipifyComHits(migration).length,
    0,
    "runtime migration must not contain aipify.com",
  );

  const routes = [
    "app/api/runtime/v1/website/context/route.ts",
    "app/api/runtime/v1/website/page/route.ts",
    "app/api/runtime/v1/website/manifest/route.ts",
    "app/api/runtime/v1/website/acknowledge/route.ts",
  ];
  for (const route of routes) {
    const src = readFileSync(route, "utf8");
    assert.match(src, /extractInstallationToken/);
    assert.doesNotMatch(src, /p_organization_id|p_website_id|p_version_id/, `${route}: client selectors`);
    assert.doesNotMatch(src, /searchParams\.get\([\"']organization/i, `${route}: org query`);
    assert.doesNotMatch(src, /unonight/i);
  }

  const ack = readFileSync("app/api/runtime/v1/website/acknowledge/route.ts", "utf8");
  assert.match(ack, /client_status_forbidden/);
  assert.match(ack, /MAX_BODY_BYTES/);

  const http = readFileSync("lib/customer-website-runtime/http-verify.ts", "utf8");
  assert.match(http, /assertPublicHostnameAllowed/);
  assert.match(http, /missing_proof_headers/);
  assert.match(http, /redirect: \"manual\"/);
  assert.doesNotMatch(http, /unonight/i);

  const rule = readFileSync(".cursor/rules/customer-website-runtime-delivery-v1.mdc", "utf8");
  assert.match(rule, /homepage off by default|Homepage is disabled by default|homepage_enabled/i);
  assert.match(rule, /SSRF|ssrf/);
  assert.doesNotMatch(rule, /unonight\.com/i);
  assert.match(rule, /does \*\*not\*\* own `aipify\.com`|does not own aipify\.com/i);
  assert.match(rule, /aipify\.ai/);
  assert.match(rule, /forbidden|Production release \*\*stops\*\*/i);

  // Active feature code/routes must not mint or default to aipify.com.
  // Negative tests, ownership policy, and forbid-language docs may mention it.
  const featureCodePaths = [
    "lib/customer-website-runtime/adapter.ts",
    "lib/customer-website-runtime/auth.ts",
    "lib/customer-website-runtime/http-verify.ts",
    "lib/customer-website-runtime/parse.ts",
    "lib/customer-website-runtime/ssrf.ts",
    "lib/customer-website-runtime/types.ts",
    "lib/customer-website-runtime/labels.ts",
    "lib/customer-website-runtime/index.ts",
    "app/api/runtime/v1/website",
    "app/api/app/website/runtime",
    "components/platform/platform-portal/CustomerWebsiteRuntimeDeliveryPanel.tsx",
    "components/app/website/CustomerWebsiteRuntimeReadinessCard.tsx",
  ];
  for (const path of featureCodePaths) {
    walkFiles(path, (file, text) => {
      if (file.endsWith(".test.ts")) return;
      const hits = findForbiddenAipifyComHits(text);
      assert.equal(hits.length, 0, `${file}: forbidden aipify.com hit`);
    });
  }

  console.log("customer-website-runtime source guards: all tests passed");
}

function walkFiles(root: string, visit: (file: string, text: string) => void): void {
  let st;
  try {
    st = statSync(root);
  } catch {
    return;
  }
  if (st.isFile()) {
    visit(root, readFileSync(root, "utf8"));
    return;
  }
  if (!st.isDirectory()) return;
  for (const name of readdirSync(root)) {
    walkFiles(join(root, name), visit);
  }
}

function runDomainOwnershipGateTests() {
  assert.equal(containsForbiddenAipifyCom("team@aipify.com"), true);
  assert.equal(containsForbiddenAipifyCom("https://aipify.com/path"), true);
  assert.equal(containsForbiddenAipifyCom("AIPIFY.COM"), true);
  // Substring lookalikes must not false-positive
  assert.equal(containsForbiddenAipifyCom("aipify.companion.ui.v1"), false);
  assert.equal(containsForbiddenAipifyCom("com.aipify.command-center"), false);

  assert.equal(isOwnedAipifyEmailDomain("aipify.ai"), true);
  assert.equal(isReservedExampleDomain("example.com"), true);
  assert.equal(isReservedExampleDomain("customer.example"), true);

  assert.equal(evaluateAipifyEmailDomain("aipify.com").ok, false);
  assert.equal(evaluateAipifyEmailDomain("aipify.ai").ok, true);
  assert.equal(evaluateAipifyEmailDomain("example.com").ok, true);

  assert.doesNotThrow(() => assertAuthorizedAipifyEmail("ops@aipify.ai"));
  assert.throws(() => assertAuthorizedAipifyEmail("team@aipify.com"), /aipify_com_not_owned/);

  // Negative: historical seed strings in older migrations are out of this feature,
  // but active generators must not mint @aipify.com (portal create uses noreply.aipify.internal).
  const createCustomerSql = readFileSync(
    "supabase/migrations/20261934400000_platform_portal_customer_creation_global_identity.sql",
    "utf8",
  );
  assert.match(createCustomerSql, /noreply\.aipify\.internal/);
  assert.equal(findForbiddenAipifyComHits(createCustomerSql).length, 0);

  console.log("customer-website-runtime domain ownership gate: all tests passed");
}

function runUiContractTests() {
  const platformPanel = readFileSync(
    "components/platform/platform-portal/CustomerWebsiteRuntimeDeliveryPanel.tsx",
    "utf8",
  );
  assert.match(platformPanel, /verify-http/);
  assert.match(platformPanel, /internalReason/);
  assert.match(platformPanel, /confirmation/);
  assert.doesNotMatch(platformPanel, /unonight/i);
  assert.doesNotMatch(platformPanel, /Installation Token|install token/i);

  const appCard = readFileSync("components/app/website/CustomerWebsiteRuntimeReadinessCard.tsx", "utf8");
  assert.match(appCard, /\/api\/app\/website\/runtime/);
  assert.doesNotMatch(appCard, /unonight/i);

  console.log("customer-website-runtime UI contracts: all tests passed");
}

async function main() {
  runAdapterTests();
  await runAdapterFetchFallbackTests();
  runSsrfTests();
  runParseTests();
  await runAuthContractTests();
  runLabelToneTests();
  runLocaleParityTests();
  runSourceGuardTests();
  runDomainOwnershipGateTests();
  runUiContractTests();
  console.log("customer-website-runtime: ALL TESTS PASSED");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
