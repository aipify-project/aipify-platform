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

async function runKompisLiveAiGovernanceV3Tests() {
  installServerOnlyShim();

  const {
    assertNoClientModelOverride,
    buildKompisAiReadiness,
    getKompisAiRuntimeStatus,
    getKompisAiSecretPresence,
    hasKompisAiProviderSecretConfigured,
    isKompisAiBaseUrlAllowlisted,
    redactForModel,
    KOMPIS_AI_SYSTEM_PROMPT_VERSION,
  } = await import("./ai-runtime");
  const { isCircuitEligibleError } = await import("./circuit");
  const { resolveKompisPlannerProfile, KOMPIS_MODEL_PROFILES } = await import("./model-profiles");
  const { buildKompisSystemPromptV3 } = await import("./prompt");
  const { planKompisOperatorRequestSync } = await import("./planner");
  const { providerReadinessTone } = await import("./severity");
  const { discoverOperatorLocales } = await import("./locales");

  assert.equal(hasKompisAiProviderSecretConfigured(), Boolean(
    process.env.AIPIFY_KOMPIS_AI_API_KEY?.trim() || process.env.OPENAI_API_KEY?.trim(),
  ));
  const presence = getKompisAiSecretPresence();
  assert.equal(presence.authoritativeEnvName, "AIPIFY_KOMPIS_AI_API_KEY");
  assert.equal(typeof presence.configured, "boolean");
  assert.doesNotMatch(JSON.stringify(presence), /sk-|Bearer /);

  assert.equal(isKompisAiBaseUrlAllowlisted("https://api.openai.com/v1"), true);
  assert.equal(isKompisAiBaseUrlAllowlisted("https://evil.example/v1"), false);

  const runtime = getKompisAiRuntimeStatus();
  assert.equal(runtime.deterministicFallbackActive, true);
  assert.equal(runtime.systemPromptVersion, "kompis_operator_system_v3");
  assert.equal(KOMPIS_AI_SYSTEM_PROMPT_VERSION, "kompis_operator_system_v3");
  if (!runtime.providerConfigured) {
    assert.equal(runtime.readiness, "not_configured");
    assert.equal(runtime.liveAiActive, false);
    assert.equal(runtime.code, "AI_PROVIDER_NOT_CONFIGURED");
  }

  const readinessMissing = buildKompisAiReadiness({
    status: "cooldown",
    cooldown_until: new Date(Date.now() + 60_000).toISOString(),
    circuit_open: true,
  });
  if (!hasKompisAiProviderSecretConfigured()) {
    assert.equal(readinessMissing.status, "not_configured");
  }
  assert.equal(readinessMissing.fallbackAvailable, true);
  assert.doesNotMatch(JSON.stringify(readinessMissing), /sk-|Bearer |prompt/);

  const { isCircuitOpenFromState } = await import("./circuit");
  assert.equal(
    isCircuitOpenFromState({
      circuit_open: true,
      cooldown_until: new Date(Date.now() + 60_000).toISOString(),
    }),
    true,
  );

  assert.equal(providerReadinessTone("ready"), "success");
  assert.equal(providerReadinessTone("degraded"), "warning");
  assert.equal(providerReadinessTone("cooldown"), "warning");
  assert.equal(providerReadinessTone("unavailable"), "danger");
  assert.equal(providerReadinessTone("not_configured"), "info");
  assert.equal(providerReadinessTone("disabled"), "muted");

  assert.equal(isCircuitEligibleError("provider_timeout"), true);
  assert.equal(isCircuitEligibleError("provider_rate_limited"), true);
  assert.equal(isCircuitEligibleError("critical_blocked"), false);

  const profile = resolveKompisPlannerProfile();
  assert.equal(profile.id, "kompis_planner_balanced_v1");
  assert.ok(KOMPIS_MODEL_PROFILES.every((item) => item.providerFamily === "openai_compatible"));

  const prompt = buildKompisSystemPromptV3({
    locale: "no",
    allowlistedToolKeys: ["customer_profile_read", "knowledge_search"],
  });
  assert.match(prompt, /kompis_operator_system_v3/);
  assert.match(prompt, /customer_profile_read/);
  assert.doesNotMatch(prompt, /chain-of-thought must be shown/i);

  assert.equal(assertNoClientModelOverride({ requestText: "hello" }), true);
  assert.equal(assertNoClientModelOverride({ model: "gpt" }), false);
  assert.equal(assertNoClientModelOverride({ provider: "openai" }), false);

  const critical = planKompisOperatorRequestSync("Slett DNS og betalinger");
  assert.equal(critical.riskClass, 3);
  assert.equal(critical.steps.length, 0);

  const readPlan = planKompisOperatorRequestSync("Kontroller APP og Website Kompis status");
  assert.equal(readPlan.riskClass, 0);
  assert.ok(readPlan.steps.length >= 1);

  assert.match(redactForModel("token sk-abcdefghijklmnopqrstuvwxyz"), /\[redacted\]/);

  const root = process.cwd();
  for (const locale of discoverOperatorLocales()) {
    const platform = JSON.parse(
      readFileSync(join(root, "locales", locale, "platform.json"), "utf8"),
    );
    assert.ok(platform.kompisAi?.title);
    assert.ok(platform.kompisAi?.liveAiNotEnabled);
    assert.ok(platform.nav?.kompisAi);
    assert.doesNotMatch(JSON.stringify(platform.kompisAi), /unonight|sk-/i);

    const core = JSON.parse(
      readFileSync(join(root, "locales", locale, "customer-app", "core.json"), "utf8"),
    );
    assert.ok(core.kompisOperator?.liveAiActive);
    assert.ok(core.kompisOperator?.continuesWithSafeFallback);
  }

  const migration = readFileSync(
    join(root, "supabase/migrations/20261935300000_app_kompis_live_ai_governance_v3.sql"),
    "utf8",
  );
  assert.doesNotMatch(migration, /unonight|openai\.com\/v1\/chat|AIPIFY_KOMPIS_AI_API_KEY\s*=/i);
  assert.match(migration, /kompis_ai_provider_state/);
  assert.match(migration, /kompis_ai_usage_events/);
  assert.match(migration, /search_path = public/);
  assert.match(migration, /revoke all on function public.get_platform_kompis_ai_status/);

  const source = [
    readFileSync(join(root, "lib/kompis-operator/ai-runtime.ts"), "utf8"),
    readFileSync(join(root, "lib/kompis-operator/prompt.ts"), "utf8"),
    readFileSync(join(root, "components/platform/kompis-ai/KompisAiGovernancePanel.tsx"), "utf8"),
    readFileSync(join(root, "app/api/platform-portal/kompis-ai-status/check/route.ts"), "utf8"),
  ].join("\n");
  assert.doesNotMatch(source, /unonight/i);
  assert.match(source, /kompis_operator_system_v3/);
  assert.match(source, /circuit|cooldown|readiness/);

  console.log("kompis-live-ai-governance-v3: all tests passed");
}

async function runKompisWebsiteOperationsV4Tests() {
  installServerOnlyShim();

  const { planKompisOperatorRequestSync, PLANNER_VERSION } = await import("./planner");
  const {
    getKompisOperatorTool,
    listAvailableKompisOperatorTools,
    KOMPIS_OPERATOR_TOOL_REGISTRY,
  } = await import("./tools-registry");
  const {
    isWebsiteDraftKind,
    validateWebsiteDraftInput,
    buildWebsiteSeoAudit,
    buildWebsiteLocaleCoverage,
  } = await import("./website-ops");
  const { discoverOperatorLocales } = await import("./locales");
  const { riskClassTone } = await import("./severity");

  assert.equal(PLANNER_VERSION, "planner_v4");
  assert.ok(getKompisOperatorTool("website_overview_read")?.available);
  // Website CMS publish/rollback v1: the static registry entries are now
  // available; the Website CMS context gates the actual publish/rollback at
  // runtime via `publishCapability` / `rollbackCapability` (see
  // lib/website-cms/v4-adapter.ts and lib/kompis-operator/executor.ts).
  assert.equal(getKompisOperatorTool("website_publish_approved_draft")?.available, true);
  assert.equal(getKompisOperatorTool("website_publish_rollback")?.available, true);

  const seo = planKompisOperatorRequestSync("Kontroller SEO på nettsiden");
  assert.equal(seo.riskClass, 0);
  assert.ok(seo.steps.some((step) => step.toolKey === "website_seo_audit"));

  const pageDraft = planKompisOperatorRequestSync("Lag et utkast til en ny Om oss-side");
  assert.equal(pageDraft.riskClass, 1);
  assert.ok(pageDraft.steps.some((step) => step.toolKey === "website_page_draft_create"));

  const publish = planKompisOperatorRequestSync("Publiser det godkjente utkastet");
  assert.equal(publish.riskClass, 2);
  assert.equal(publish.steps.length, 1);
  assert.equal(publish.steps[0]?.toolKey, "website_publish_approved_draft");
  assert.equal(publish.unavailableReason, undefined);

  const rollback = planKompisOperatorRequestSync("Rull tilbake nettsiden til forrige versjon");
  assert.equal(rollback.riskClass, 2);
  assert.equal(rollback.steps.length, 1);
  assert.equal(rollback.steps[0]?.toolKey, "website_publish_rollback");

  const criticalSite = planKompisOperatorRequestSync("Slett hele nettsiden");
  assert.equal(criticalSite.riskClass, 3);
  assert.equal(criticalSite.steps.length, 0);

  const criticalDomain = planKompisOperatorRequestSync("Bytt domenet for nettsiden");
  assert.equal(criticalDomain.riskClass, 3);

  const criticalScript = planKompisOperatorRequestSync("Legg dette JavaScriptet på alle sider");
  assert.equal(criticalScript.riskClass, 3);

  assert.equal(isWebsiteDraftKind("website_page"), true);
  assert.equal(isWebsiteDraftKind("content"), false);

  const locales = discoverOperatorLocales();
  const valid = validateWebsiteDraftInput({
    kind: "website_page",
    title: "About",
    locale: "en",
    path: "/about",
    text: "Hello",
    activeLocales: locales,
  });
  assert.equal(valid.ok, true);

  const blockedScript = validateWebsiteDraftInput({
    kind: "website_page",
    title: "Bad",
    locale: "en",
    path: "/about",
    text: '<script>alert(1)</script>',
    activeLocales: locales,
  });
  assert.equal(blockedScript.ok, false);

  const inactiveLocale = validateWebsiteDraftInput({
    kind: "website_translation",
    title: "X",
    locale: "zz",
    text: "Hello",
    activeLocales: locales,
  });
  assert.equal(inactiveLocale.ok, false);

  const audit = buildWebsiteSeoAudit({
    context: {
      organizationId: "org",
      organizationName: null,
      appLicenseActive: true,
      websiteKompisCapability: true,
      deliveryActive: true,
      acknowledgementOk: true,
      primaryDomain: "example.com",
      runtimeDomain: "example.com",
      installationId: "install",
      installTrustOk: true,
      siteEnvironment: "production",
      supportedLocales: locales,
      defaultLocale: "en",
      draftCapability: true,
      previewCapability: true,
      publishCapability: false,
      rollbackCapability: false,
      authoritativePageModel: false,
      currentVersion: null,
      draftCount: 0,
      lastPublishAt: null,
      conflicts: [],
      publishUnavailableReason: "no_authoritative_website_cms_publish_path_v4",
      rollbackUnavailableReason: "no_authoritative_website_version_rollback_path_v4",
    },
    pages: [{ id: "d1", title: "", body: {} }],
  });
  assert.equal(audit.crawlAvailable, false);
  assert.ok(audit.findings.some((item) => item.code === "missing_title"));

  const coverage = buildWebsiteLocaleCoverage([{ locale: "en" }]);
  assert.ok(coverage.activeLocales.includes("en" as never));
  assert.ok(coverage.localeGaps >= 0);

  assert.equal(riskClassTone(0, "idle"), "info");
  assert.equal(riskClassTone(1, "pending"), "warning");
  assert.equal(riskClassTone(2, "pending"), "warning");
  assert.equal(riskClassTone(3, "pending"), "danger");

  assert.ok(listAvailableKompisOperatorTools().some((tool) => tool.key === "website_overview_read"));
  assert.ok(KOMPIS_OPERATOR_TOOL_REGISTRY.some((tool) => tool.key === "website_publish_approved_draft" && tool.available));
  assert.ok(KOMPIS_OPERATOR_TOOL_REGISTRY.some((tool) => tool.key === "website_publish_rollback" && tool.available));

  const root = process.cwd();
  for (const locale of locales) {
    const core = JSON.parse(
      readFileSync(join(root, "locales", locale, "customer-app", "core.json"), "utf8"),
    );
    assert.ok(core.kompisOperator?.websiteTab);
    assert.ok(core.kompisOperator?.publishUnavailable);
    assert.ok(core.kompisOperator?.draftsOnlyReady);
    assert.doesNotMatch(JSON.stringify(core.kompisOperator), /unonight/i);
  }

  const migration = readFileSync(
    join(root, "supabase/migrations/20261935400000_app_kompis_website_operations_v4.sql"),
    "utf8",
  );
  assert.doesNotMatch(migration, /unonight/i);
  assert.match(migration, /kompis_website_ops_previews/);
  assert.match(migration, /website_page/);
  assert.match(migration, /search_path = public/);
  assert.match(migration, /no_authoritative_website_cms_publish_path_v4/);

  const source = [
    readFileSync(join(root, "lib/kompis-operator/tools-registry.ts"), "utf8"),
    readFileSync(join(root, "lib/kompis-operator/planner.ts"), "utf8"),
    readFileSync(join(root, "lib/kompis-operator/executor.ts"), "utf8"),
    readFileSync(join(root, "components/app/kompis-operator/KompisOperatorWorkspacePanel.tsx"), "utf8"),
    readFileSync(join(root, "app/api/app/kompis/website/route.ts"), "utf8"),
  ].join("\n");
  assert.doesNotMatch(source, /unonight/i);
  assert.match(source, /website_overview_read/);
  // Website CMS publish/rollback v1 replaced the static V4 "no publish path"
  // placeholder with runtime capability gating via the CMS context.
  assert.match(source, /publishCapability|website_publish_capability_not_ready/);
  assert.match(source, /planner_v4/);

  console.log("kompis-website-operations-v4: all tests passed");
}

async function main() {
  await runKompisLiveAiGovernanceV3Tests();
  await runKompisWebsiteOperationsV4Tests();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
