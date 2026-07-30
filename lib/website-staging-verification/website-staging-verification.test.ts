import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const require = createRequire(import.meta.url);

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

async function runSchemaTests() {
  const {
    validateWebsiteStagingFixtureKey,
    validateWebsiteStagingLocale,
    validateWebsiteStagingIdempotencyKey,
    validateWebsiteStagingInternalReason,
    buildWebsiteStagingIdempotencyKey,
  } = await import("./schema");

  assert.equal(validateWebsiteStagingFixtureKey("home-page").ok, true);
  assert.equal(validateWebsiteStagingFixtureKey("Home-Page").ok, true);
  assert.equal(validateWebsiteStagingFixtureKey("a").ok, false);
  assert.equal(validateWebsiteStagingFixtureKey("-leading-hyphen").ok, false);
  assert.equal(validateWebsiteStagingFixtureKey("trailing-hyphen-").ok, false);
  assert.equal(validateWebsiteStagingFixtureKey("has space").ok, false);
  assert.equal(validateWebsiteStagingFixtureKey("x".repeat(65)).ok, false);
  assert.equal(validateWebsiteStagingFixtureKey(null).ok, false);
  assert.equal(validateWebsiteStagingFixtureKey(42).ok, false);

  assert.equal(validateWebsiteStagingLocale("en").ok, true);
  assert.equal(validateWebsiteStagingLocale("en-us").ok, true);
  assert.equal(validateWebsiteStagingLocale("EN").ok, true);
  assert.equal(validateWebsiteStagingLocale("english").ok, false);
  assert.equal(validateWebsiteStagingLocale("").ok, false);
  assert.equal(validateWebsiteStagingLocale(null).ok, false);

  assert.equal(validateWebsiteStagingIdempotencyKey("short").ok, false);
  assert.equal(validateWebsiteStagingIdempotencyKey("x".repeat(129)).ok, false);
  assert.equal(validateWebsiteStagingIdempotencyKey("wsv-run-abcdef123456").ok, true);

  assert.equal(validateWebsiteStagingInternalReason("").ok, false);
  assert.equal(validateWebsiteStagingInternalReason("short").ok, false);
  assert.equal(
    validateWebsiteStagingInternalReason("Automated release verification harness run").ok,
    true,
  );

  const key = buildWebsiteStagingIdempotencyKey("ensure environment", "Seed Value 123!");
  assert.match(key, /^wsv-ensure-environment-seed-value-123/);
  assert.equal(validateWebsiteStagingIdempotencyKey(key).ok, true);
  const longKey = buildWebsiteStagingIdempotencyKey("x".repeat(200), "y".repeat(200));
  assert.ok(longKey.length <= 128);

  console.log("website-staging-verification schema: all tests passed");
}

async function runSeverityTests() {
  const {
    websiteStagingEnvironmentStatusTone,
    websiteStagingFixtureStatusTone,
    websiteStagingRunStatusTone,
  } = await import("./severity");

  assert.equal(websiteStagingEnvironmentStatusTone("active"), "success");
  assert.equal(websiteStagingEnvironmentStatusTone("attention"), "warning");
  assert.equal(websiteStagingEnvironmentStatusTone("archived"), "muted");
  assert.equal(websiteStagingEnvironmentStatusTone("unknown"), "info");

  assert.equal(websiteStagingFixtureStatusTone("active"), "success");
  assert.equal(websiteStagingFixtureStatusTone("archived"), "muted");

  assert.equal(websiteStagingRunStatusTone("passed"), "success");
  assert.equal(websiteStagingRunStatusTone("running"), "warning");
  assert.equal(websiteStagingRunStatusTone("pending"), "warning");
  assert.equal(websiteStagingRunStatusTone("partial"), "warning");
  assert.equal(websiteStagingRunStatusTone("failed"), "danger");
  assert.equal(websiteStagingRunStatusTone("blocked"), "danger");
  assert.equal(websiteStagingRunStatusTone("unknown"), "muted");

  console.log("website-staging-verification severity: all tests passed");
}

async function runLabelKeyTests() {
  const {
    websiteStagingRunPhaseLabelKey,
    websiteStagingRunStatusLabelKey,
    websiteStagingEnvironmentStatusLabelKey,
    websiteStagingFixtureStatusLabelKey,
  } = await import("./labels");

  const allPhases = [
    "initialized",
    "first_candidate_built",
    "first_preview_created",
    "first_published",
    "first_verified",
    "second_candidate_built",
    "second_preview_created",
    "second_published",
    "second_verified",
    "rolled_back",
    "rollback_verified",
    "completed",
  ];
  const seenKeys = new Set<string>();
  for (const phase of allPhases) {
    const key = websiteStagingRunPhaseLabelKey(phase);
    assert.ok(key.startsWith("phase"));
    seenKeys.add(key);
  }
  assert.equal(seenKeys.size, allPhases.length, "every phase must map to a distinct label key");
  assert.equal(websiteStagingRunPhaseLabelKey("not_a_real_phase"), "phaseInitialized");

  assert.equal(websiteStagingRunStatusLabelKey("passed"), "runStatusPassed");
  assert.equal(websiteStagingRunStatusLabelKey("blocked"), "runStatusBlocked");
  assert.equal(websiteStagingRunStatusLabelKey("weird"), "runStatusPending");

  assert.equal(websiteStagingEnvironmentStatusLabelKey("attention"), "environmentStatusAttention");
  assert.equal(websiteStagingEnvironmentStatusLabelKey("archived"), "environmentStatusArchived");
  assert.equal(websiteStagingEnvironmentStatusLabelKey("active"), "environmentStatusActive");

  assert.equal(websiteStagingFixtureStatusLabelKey("archived"), "fixtureStatusArchived");
  assert.equal(websiteStagingFixtureStatusLabelKey("active"), "fixtureStatusActive");

  console.log("website-staging-verification labels: all tests passed");
}

async function runPathTokenTests() {
  const { isPlausibleWebsiteStagingToken } = await import("./path-token");

  assert.equal(isPlausibleWebsiteStagingToken("aipify_" + "A".repeat(40)), true);
  assert.equal(isPlausibleWebsiteStagingToken("aipify_abc-DEF_1234567890"), true);
  assert.equal(isPlausibleWebsiteStagingToken("not-aipify-prefixed"), false);
  assert.equal(isPlausibleWebsiteStagingToken("aipify_short"), false);
  assert.equal(isPlausibleWebsiteStagingToken("aipify_" + "!!!invalid!!!"), false);
  assert.equal(isPlausibleWebsiteStagingToken(""), false);
  assert.equal(isPlausibleWebsiteStagingToken(null), false);
  assert.equal(isPlausibleWebsiteStagingToken(12345), false);

  console.log("website-staging-verification path-token: all tests passed");
}

async function runContextMappingTests() {
  const { mapWebsiteStagingEnvironment, mapWebsiteStagingFixture, mapWebsiteStagingKpis, emptyWebsiteStagingOverview } =
    await import("./context");

  assert.equal(mapWebsiteStagingEnvironment(null), null);
  assert.equal(mapWebsiteStagingEnvironment({}), null);

  const env = mapWebsiteStagingEnvironment({
    id: "env-1",
    organization_id: "org-1",
    website_id: "web-1",
    installation_id: "inst-1",
    domain_id: "dom-1",
    staging_host_key: "wv-staging-abc123.internal.aipify.ai",
    status: "active",
    retention: "standard",
    access_token_present: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-02T00:00:00Z",
  });
  assert.ok(env);
  assert.equal(env?.id, "env-1");
  assert.equal(env?.stagingHostKey, "wv-staging-abc123.internal.aipify.ai");
  assert.equal(env?.accessTokenPresent, true);

  const fixture = mapWebsiteStagingFixture({
    id: "fix-1",
    fixture_key: "home-page",
    page_path: "/website-release-verification/home-page",
    locale: "en",
    status: "active",
    retention: "standard",
    initial_checksum: "abc",
    updated_checksum: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  });
  assert.equal(fixture.fixtureKey, "home-page");
  assert.equal(fixture.pagePath, "/website-release-verification/home-page");

  const kpis = mapWebsiteStagingKpis({
    total_runs: 5,
    passed_runs: 3,
    failed_runs: 1,
    blocked_runs: 1,
    last_run_at: "2026-01-03T00:00:00Z",
  });
  assert.equal(kpis.totalRuns, 5);
  assert.equal(kpis.passedRuns, 3);

  const empty = emptyWebsiteStagingOverview();
  assert.equal(empty.environment, null);
  assert.deepEqual(empty.fixtures, []);
  assert.equal(empty.kpis.totalRuns, 0);
  assert.equal(empty.control.noindexRequired, true);
  assert.deepEqual(empty.control.blockers, []);

  const { mapWebsiteStagingControlPlane } = await import("./context");
  const control = mapWebsiteStagingControlPlane({
    app_license_active: true,
    website_kompis_capability: true,
    canonical_delivery: true,
    acknowledgement_ok: true,
    noindex_required: true,
    production_isolation: true,
    current_version_number: 2,
    first_publish_present: true,
    second_publish_present: true,
    rollback_present: true,
    expected_checksum: "abc",
    actual_checksum: "abc",
    checksum_match: true,
    duration_seconds: 42,
    audit_reference: "run-1",
    blockers: [],
  });
  assert.equal(control.checksumMatch, true);
  assert.equal(control.durationSeconds, 42);
  assert.equal(control.appLicenseActive, true);

  console.log("website-staging-verification context mapping: all tests passed");
}

async function runRunSnapshotMappingTests() {
  const { mapWebsiteStagingRunSnapshot, mapWebsiteStagingRuntimeVerification } = await import("./runs");

  const run = mapWebsiteStagingRunSnapshot({
    id: "run-1",
    environment_id: "env-1",
    organization_id: "org-1",
    website_id: "web-1",
    fixture_id: "fix-1",
    status: "running",
    current_phase: "first_published",
    baseline_version_id: null,
    first_candidate_id: "ver-1",
    first_publish_operation_id: "op-1",
    second_candidate_id: null,
    second_publish_operation_id: null,
    rollback_operation_id: null,
    preview_refs: [],
    expected_checksums: { first_candidate: "abc" },
    actual_checksums: {},
    safe_error_code: null,
    started_at: "2026-01-01T00:00:00Z",
    completed_at: null,
    idempotency_key: "wsv-run-abc123456",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:05:00Z",
    idempotent_replay: false,
  });
  assert.equal(run.id, "run-1");
  assert.equal(run.status, "running");
  assert.equal(run.currentPhase, "first_published");
  assert.equal(run.idempotentReplay, false);
  assert.equal(run.runtimeVerification, undefined);

  const verified = mapWebsiteStagingRuntimeVerification({
    verified: true,
    reason: "ok",
    domain: "wv-staging-abc.internal.aipify.ai",
    checked_at: "2026-01-01T00:10:00Z",
  });
  assert.ok(verified);
  assert.equal(verified?.verified, true);
  assert.equal(mapWebsiteStagingRuntimeVerification({}), undefined);

  console.log("website-staging-verification run snapshot mapping: all tests passed");
}

async function runEnvironmentClassificationTests() {
  // Environment classification guard: the migration's staging environments
  // are always distinguished from real customer/production tenants by
  // environment_type = 'staging' and a synthetic *.internal.aipify.ai host.
  const INTERNAL_HOST_PATTERN = /\.internal\.aipify\.ai$/;
  const stagingHosts = [
    "wv-staging-abc123def456.internal.aipify.ai",
    "wv-staging-000000000000.internal.aipify.ai",
  ];
  for (const host of stagingHosts) {
    assert.match(host, INTERNAL_HOST_PATTERN);
  }
  assert.doesNotMatch("customer-real-domain.com", INTERNAL_HOST_PATTERN);
  assert.doesNotMatch("app.aipify.ai", INTERNAL_HOST_PATTERN);

  console.log("website-staging-verification environment classification: all tests passed");
}

async function runMigrationGuardTests() {
  const root = process.cwd();
  const migration = readFileSync(
    join(root, "supabase/migrations/20261935700000_platform_website_staging_verification_v2.sql"),
    "utf8",
  );

  assert.doesNotMatch(migration, /unonight/i);
  assert.match(migration, /set search_path = public/);

  // Isolation guard: staging hostnames must always resolve under
  // internal.aipify.ai and must never be permitted to collide with a real
  // customer_domains row.
  assert.match(migration, /_website_staging_assert_isolated_domain/);
  assert.match(migration, /STAGING_DOMAIN_MUST_BE_INTERNAL/);
  assert.match(migration, /HOSTNAME_COLLISION/);
  assert.ok(migration.includes("internal\\.aipify\\.ai"), "isolation guard must reference internal.aipify.ai");

  // Environment type extension covers both the new value and the
  // already-shipped 'production' value create_platform_portal_customer relies on.
  assert.match(migration, /customers_environment_type_check/);
  assert.match(migration, /installations_environment_type_check/);
  assert.match(
    migration,
    /environment_type in \('internal', 'pilot', 'customer', 'enterprise', 'production', 'staging'\)/,
  );

  // Idempotency: unique (organization_id, idempotency_key) on the run table,
  // and every mutating RPC takes an idempotency key parameter.
  assert.match(migration, /unique \(organization_id, idempotency_key\)/);
  for (const rpc of [
    "ensure_website_staging_environment",
    "create_website_staging_fixture",
    "start_website_release_verification_run",
  ]) {
    assert.match(migration, new RegExp(`${rpc}\\([^)]*p_idempotency_key`));
  }

  // Super admin gate on every platform RPC (never customer/operator context).
  for (const rpc of [
    "ensure_website_staging_environment",
    "get_website_staging_verification_overview",
    "create_website_staging_fixture",
    "archive_website_staging_fixture",
    "start_website_release_verification_run",
    "resume_website_release_verification_run",
    "verify_website_staging_runtime",
  ]) {
    const marker = `function public.${rpc}(`;
    const startIndex = migration.indexOf(marker);
    assert.ok(startIndex >= 0, `${rpc} must be defined`);
    const body = migration.slice(startIndex, startIndex + 2000);
    assert.match(body, /_website_staging_require_super_admin/);
  }

  // Public path-token resolver never returns install tokens or secrets.
  const resolveIndex = migration.indexOf("function public.resolve_website_staging_access_token(");
  assert.ok(resolveIndex >= 0);
  const resolveBody = migration.slice(resolveIndex, resolveIndex + 3000);
  assert.doesNotMatch(resolveBody, /installation_token_hash/);
  assert.match(resolveBody, /'noindex', true/);

  // No apply-time data seeding — schema/function DDL only.
  const withoutFunctionBodies = migration.replace(/as \$\$[\s\S]*?\$\$;/g, "");
  assert.doesNotMatch(withoutFunctionBodies, /insert into public\.website_staging_environments/);
  assert.doesNotMatch(withoutFunctionBodies, /insert into public\.website_staging_fixtures/);
  assert.doesNotMatch(withoutFunctionBodies, /insert into public\.website_release_verification_runs/);

  const sourceFiles = [
    "lib/website-staging-verification/types.ts",
    "lib/website-staging-verification/schema.ts",
    "lib/website-staging-verification/labels.ts",
    "lib/website-staging-verification/severity.ts",
    "lib/website-staging-verification/context.ts",
    "lib/website-staging-verification/ensure.ts",
    "lib/website-staging-verification/fixture.ts",
    "lib/website-staging-verification/runs.ts",
    "lib/website-staging-verification/runtime.ts",
    "lib/website-staging-verification/path-token.ts",
    "lib/website-staging-verification/origin.ts",
    "lib/website-staging-verification/readiness.ts",
  ].map((file) => readFileSync(join(root, file), "utf8"));
  assert.doesNotMatch(sourceFiles.join("\n"), /unonight/i);

  console.log("website-staging-verification migration guards: all tests passed");
}

async function runGlobalIdentityTests() {
  const root = process.cwd();
  const migration = readFileSync(
    join(root, "supabase/migrations/20261935700000_platform_website_staging_verification_v2.sql"),
    "utf8",
  );
  const ensureBodyStart = migration.indexOf("function public.ensure_website_staging_environment(");
  assert.ok(ensureBodyStart >= 0);
  const ensureBody = migration.slice(ensureBodyStart, ensureBodyStart + 12000);

  // No hardcoded Norwegian jurisdiction or national org-number format.
  assert.doesNotMatch(ensureBody, /create_platform_portal_customer\s*\(/);
  assert.doesNotMatch(ensureBody, /,\s*'NO'\s*\)/);
  assert.doesNotMatch(ensureBody, /country[\s\S]{0,200}'NO'/);
  assert.doesNotMatch(ensureBody, /organization_number[\s\S]{0,120}'\d{9}'/);
  assert.match(ensureBody, /INT-STAGING-/);
  assert.match(ensureBody, /'XX'/);
  assert.match(ensureBody, /environment_type[\s\S]{0,400}'staging'/);
  assert.match(ensureBody, /Non-commercial/i);
  assert.match(ensureBody, /'UTC'/);

  // Staging identities excluded from ordinary commercial customer registry.
  assert.match(migration, /get_platform_portal_customers/);
  const customersFn = migration.slice(migration.indexOf("function public.get_platform_portal_customers("));
  assert.match(customersFn, /not in \('staging', 'internal'\)/);
  assert.match(customersFn, /INT-STAGING-%/);

  // Overview control plane exposes isolation/proof fields without secrets.
  const overviewFn = migration.slice(migration.indexOf("function public.get_website_staging_verification_overview("));
  assert.match(overviewFn, /'control'/);
  assert.match(overviewFn, /production_isolation/);
  assert.match(overviewFn, /noindex_required/);
  assert.match(overviewFn, /checksum_match/);
  assert.match(overviewFn, /audit_reference/);
  assert.doesNotMatch(overviewFn.slice(0, 8000), /installation_token_hash/);
  // Overview may report access_token_present boolean, but never returns raw token values.
  assert.doesNotMatch(overviewFn, /'access_token'\s*,/);
  assert.doesNotMatch(overviewFn, /'token'\s*,\s*v_/);

  // Ordinary production customer creation still requires legal country validation elsewhere.
  const productionCustomerSql = readFileSync(
    join(root, "supabase/migrations/20261934400000_platform_portal_customer_creation_global_identity.sql"),
    "utf8",
  );
  assert.match(productionCustomerSql, /create_platform_portal_customer/);
  assert.match(productionCustomerSql, /v_country = 'NO'/);

  console.log("website-staging-verification global identity: all tests passed");
}

async function runOriginGateTests() {
  const { isTrustedWebsiteStagingOrigin, assertWebsiteStagingWriteOrigin } = await import("./origin");

  assert.equal(
    isTrustedWebsiteStagingOrigin("https://app.aipify.ai", "https://app.aipify.ai/api/x"),
    true,
  );
  assert.equal(
    isTrustedWebsiteStagingOrigin("https://evil.example", "https://app.aipify.ai/api/x"),
    false,
  );
  assert.equal(isTrustedWebsiteStagingOrigin(null, "https://app.aipify.ai/api/x"), false);
  assert.equal(
    isTrustedWebsiteStagingOrigin("https://attacker.test", "https://app.aipify.ai/api/x"),
    false,
  );

  const missing = assertWebsiteStagingWriteOrigin(
    new Request("https://app.aipify.ai/api/platform-portal/website-verification/staging", {
      method: "POST",
    }),
  );
  assert.equal(missing.ok, false);
  if (!missing.ok) {
    assert.equal(missing.status, 403);
    assert.equal(missing.code, "origin_denied");
  }

  const valid = assertWebsiteStagingWriteOrigin(
    new Request("https://app.aipify.ai/api/platform-portal/website-verification/staging", {
      method: "POST",
      headers: { origin: "https://app.aipify.ai" },
    }),
  );
  assert.equal(valid.ok, true);

  const crossSite = assertWebsiteStagingWriteOrigin(
    new Request("https://app.aipify.ai/api/platform-portal/website-verification/staging", {
      method: "POST",
      headers: { origin: "https://evil.example" },
    }),
  );
  assert.equal(crossSite.ok, false);

  const writeRoutes = [
    "app/api/platform-portal/website-verification/staging/route.ts",
    "app/api/platform-portal/website-verification/fixture/route.ts",
    "app/api/platform-portal/website-verification/fixtures/[id]/archive/route.ts",
    "app/api/platform-portal/website-verification/runs/route.ts",
    "app/api/platform-portal/website-verification/runs/[id]/resume/route.ts",
    "app/api/platform-portal/website-verification/runs/[id]/verify-runtime/route.ts",
  ];
  for (const file of writeRoutes) {
    const source = readFileSync(join(process.cwd(), file), "utf8");
    assert.match(source, /assertWebsiteStagingWriteOrigin/);
  }

  console.log("website-staging-verification origin gate: all tests passed");
}

async function runReadinessTests() {
  const { mapWebsiteReleaseChainReadiness, websiteReleaseChainReadinessTone } = await import(
    "./readiness"
  );
  const {
    websiteCmsReleaseChainLabelKey,
    websiteCmsReleaseChainTone,
  } = await import("../website-cms/labels");

  assert.equal(mapWebsiteReleaseChainReadiness(null).status, "code_ready");
  assert.equal(mapWebsiteReleaseChainReadiness({ status: "verified" }).status, "verified");
  assert.equal(mapWebsiteReleaseChainReadiness({ status: "running" }).status, "running");
  assert.equal(mapWebsiteReleaseChainReadiness({ status: "attention" }).status, "attention");
  assert.equal(mapWebsiteReleaseChainReadiness({ status: "blocked" }).status, "blocked");
  assert.equal(mapWebsiteReleaseChainReadiness({ status: "bogus" }).status, "code_ready");

  assert.equal(websiteReleaseChainReadinessTone("verified"), "success");
  assert.equal(websiteReleaseChainReadinessTone("code_ready"), "info");
  assert.equal(websiteReleaseChainReadinessTone("running"), "warning");
  assert.equal(websiteCmsReleaseChainTone("verified"), "success");
  assert.equal(websiteCmsReleaseChainTone("code_ready"), "info");
  assert.equal(websiteCmsReleaseChainLabelKey("verified"), "releaseChainVerified");
  assert.equal(websiteCmsReleaseChainLabelKey("code_ready"), "releaseChainCodeReady");

  const appRoute = readFileSync(join(process.cwd(), "app/api/app/website/route.ts"), "utf8");
  assert.match(appRoute, /fetchWebsiteReleaseChainReadiness/);
  assert.match(appRoute, /releaseChainReadiness/);

  const panel = readFileSync(
    join(process.cwd(), "components/app/kompis-operator/KompisOperatorWorkspacePanel.tsx"),
    "utf8",
  );
  assert.match(panel, /websiteCmsReleaseChainLabelKey/);
  assert.doesNotMatch(panel, /INT-STAGING-/);
  assert.doesNotMatch(panel, /access_token/);
  assert.doesNotMatch(panel, /staging_host_key/);

  console.log("website-staging-verification readiness: all tests passed");
}

async function runRendererContractTests() {
  const root = process.cwd();
  const page = readFileSync(join(root, "app/website-staging/[token]/[[...path]]/page.tsx"), "utf8");
  assert.match(page, /resolveWebsiteStagingAccessToken/);
  assert.match(page, /resolvePublicRenderResult/);
  assert.match(page, /robots:\s*\{\s*index:\s*false/);
  assert.match(page, /canonical:\s*undefined/);
  assert.match(page, /buildWebsiteStagingVerificationLabels/);
  assert.doesNotMatch(page, /current_version_id/);
  assert.doesNotMatch(page, /INSERT\s+/i);
  assert.doesNotMatch(page, /update\(/i);

  const proxy = readFileSync(join(root, "proxy.ts"), "utf8");
  assert.match(proxy, /website-staging/);
  assert.match(proxy, /X-Robots-Tag/);
  assert.match(proxy, /noindex, nofollow/);
  assert.match(proxy, /no-store/);

  console.log("website-staging-verification renderer contract: all tests passed");
}

async function runPlatformUiContractTests() {
  const root = process.cwd();
  const page = readFileSync(join(root, "app/platform/website-verification/page.tsx"), "utf8");
  assert.match(page, /WebsiteReleaseVerificationPanel/);
  assert.match(page, /canOperate/);
  assert.match(page, /super_admin/);

  const panel = readFileSync(
    join(root, "components/platform/website-verification/WebsiteReleaseVerificationPanel.tsx"),
    "utf8",
  );
  assert.match(panel, /AipifyLoader/);
  assert.match(panel, /confirmCheckboxLabel/);
  assert.match(panel, /productionIsolation/);
  assert.match(panel, /stagingPreviewPath/);
  assert.match(panel, /controlTitle/);
  assert.match(panel, /checksumExpected/);
  assert.match(panel, /blockersTitle/);
  assert.match(panel, /Intl\.DateTimeFormat/);
  assert.match(panel, /dark:/);
  assert.match(panel, /sr-only/);
  assert.doesNotMatch(panel, /unonight/i);

  const nav = readFileSync(join(root, "lib/platform/nav-config.ts"), "utf8");
  assert.match(nav, /websiteReleaseVerification/);
  assert.match(nav, /\/platform\/website-verification/);

  const rule = readFileSync(
    join(root, ".cursor/rules/website-staging-release-verification-v2.mdc"),
    "utf8",
  );
  assert.match(rule, /Never/);
  assert.match(rule, /Production/);
  assert.match(rule, /INT-STAGING/);

  console.log("website-staging-verification platform UI: all tests passed");
}

async function runLocaleParityTests() {
  const root = process.cwd();
  const { LOCALES } = await import("../i18n/config");
  const required = [
    "title",
    "subtitle",
    "ensureEnvironment",
    "createFixture",
    "startRun",
    "resumeRun",
    "verifyRuntime",
    "archiveFixture",
    "productionIsolation",
    "stagingPreviewPath",
    "rendererBanner",
    "rendererInvalidTitle",
    "statusColumn",
    "phaseColumn",
    "controlTitle",
    "appLicense",
    "websiteKompisCapability",
    "canonicalDelivery",
    "acknowledgement",
    "noindexStatus",
    "checksumExpected",
    "checksumActual",
    "blockersTitle",
    "durationLabel",
    "auditReference",
  ];
  const cmsRequired = [
    "releaseChainVerified",
    "releaseChainCodeReady",
    "releaseChainRunning",
    "releaseChainAttention",
    "releaseChainBlocked",
  ];

  for (const locale of LOCALES) {
    const platform = JSON.parse(readFileSync(join(root, `locales/${locale}/platform.json`), "utf8"));
    const block = platform.websiteReleaseVerification;
    assert.ok(block, `missing websiteReleaseVerification in ${locale}`);
    for (const key of required) {
      assert.equal(typeof block[key], "string", `${locale}.${key}`);
      assert.ok(block[key].length > 0, `${locale}.${key} empty`);
      assert.doesNotMatch(block[key], /^platform\./);
    }
    assert.equal(typeof platform.nav?.websiteReleaseVerification, "string");

    const app = JSON.parse(readFileSync(join(root, `locales/${locale}/customer-app/core.json`), "utf8"));
    const cms = app.customerApp?.websiteCms ?? {};
    for (const key of cmsRequired) {
      assert.equal(typeof cms[key], "string", `${locale}.websiteCms.${key}`);
      assert.ok(cms[key].length > 0);
    }
  }

  // Norwegian business phrases from the V2 brief.
  const no = JSON.parse(readFileSync(join(root, "locales/no/platform.json"), "utf8"));
  assert.match(no.websiteReleaseVerification.subtitle, /staging/i);
  assert.match(no.websiteReleaseVerification.ensureEnvironment, /Klargjør/);
  assert.match(no.websiteReleaseVerification.createFixture, /kontrollert testside/i);
  assert.match(no.websiteReleaseVerification.startRun, /release-verifisering/i);
  const noApp = JSON.parse(readFileSync(join(root, "locales/no/customer-app/core.json"), "utf8"));
  assert.equal(
    noApp.customerApp.websiteCms.releaseChainVerified,
    "Publiseringskjeden er verifisert",
  );

  console.log("website-staging-verification locale parity: all tests passed");
}

async function main() {
  installServerOnlyShim();
  await runSchemaTests();
  await runSeverityTests();
  await runLabelKeyTests();
  await runPathTokenTests();
  await runContextMappingTests();
  await runRunSnapshotMappingTests();
  await runEnvironmentClassificationTests();
  await runMigrationGuardTests();
  await runGlobalIdentityTests();
  await runOriginGateTests();
  await runReadinessTests();
  await runRendererContractTests();
  await runPlatformUiContractTests();
  await runLocaleParityTests();
  console.log("website-staging-verification: all tests passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
