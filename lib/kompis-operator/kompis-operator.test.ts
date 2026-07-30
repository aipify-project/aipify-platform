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

runKompisLiveAiGovernanceV3Tests().catch((error) => {
  console.error(error);
  process.exit(1);
});
