import assert from "node:assert/strict";
import { buildBillingViewModel } from "./billing-view-model";

function samplePayload(overrides: Record<string, unknown> = {}) {
  return {
    has_customer: true,
    current_package: {
      package_key: "business",
      package_name: "Aipify Business",
      description: "Operations package for growing teams.",
      features: ["Support workflows", "internal.feature_key", "Domain management"],
    },
    enabled_modules: Array.from({ length: 142 }, (_, i) => ({
      module_key: `technical_module_${i}`,
      licensed: true,
    })),
    usage: {
      period_month: "2026-08",
      support_cases_handled: 12,
      autonomous_resolutions: 0,
      knowledge_searches: 4,
      employee_interactions: 0,
      insight_reports_generated: 1,
      api_calls: 0,
      ai_usage_volume: 0,
    },
    tenant_limits: {
      used_users: 3,
      max_users: 10,
      used_installations: 1,
      max_installations: 5,
      used_domains: 2,
      max_domains: null,
    },
    upgrade_options: [
      {
        package_key: "insights",
        package_name: "Aipify Insights",
        description: "English insights upgrade copy.",
      },
      {
        package_key: "enterprise",
        package_name: "Aipify Enterprise",
        description: "Advanced governance and scale.",
      },
      {
        package_key: "hidden",
        package_name: "enterprise.only_flag",
        description: "secret.path",
      },
    ],
    addon_marketplace: [
      {
        addon_key: "insights",
        name: "Aipify Insights",
        description: "English insights addon copy.",
      },
      {
        addon_key: "hosts",
        name: "Hosts operations",
        description: "Additional operational capacity.",
      },
    ],
    upgrade_recommendations: [
      {
        title: "Consider Enterprise governance",
        reason: "Usage patterns suggest stronger approval controls.",
      },
    ],
    billing_history: [
      {
        plan_name: "Unonight Lifetime",
        status: "lifetime",
        next_billing_date: null,
        updated_at: "2026-08-01T10:00:00Z",
      },
    ],
    privacy_note: "English backend note must not leak as customer truth.",
    positioning: "English positioning must not be shown.",
    ...overrides,
  };
}

function run() {
  const vm = buildBillingViewModel(samplePayload(), {
    localizePackage: (key) => {
      if (key === "business") {
        return {
          name: "Aipify Business",
          description: "For organisasjoner med ansatte og interne prosesser.",
        };
      }
      if (key === "insights") {
        return {
          name: "Aipify Insights",
          description: "Valgfri operasjonell innsikt.",
        };
      }
      return null;
    },
    localizeFeature: (feature) => {
      if (feature === "Install Engine") return "Veiledet installasjon";
      return null;
    },
  });

  assert.equal(vm.hasCustomer, true);
  assert.equal(vm.packageName, "Aipify Business");
  assert.equal(
    vm.packageDescription,
    "For organisasjoner med ansatte og interne prosesser."
  );
  assert.equal(vm.statusKey, "lifetime");
  assert.equal(vm.modulesCount, null, "raw licensed tenant_modules must not become a customer count");
  assert.equal(vm.renewalDate, null, "lifetime must not invent a renewal/invoice date");
  assert.deepEqual(
    vm.packageFeatures,
    ["Support workflows", "Domain management"],
    "snake_case / dotted feature keys must be filtered"
  );

  const users = vm.limits.find((l) => l.key === "users");
  assert.ok(users);
  assert.equal(users.used, 3);
  assert.equal(users.max, 10);
  assert.equal(users.percent, 30);

  assert.equal(vm.history.length, 1);
  assert.equal(vm.history[0]?.planName, "Unonight Lifetime");
  assert.equal(vm.history[0]?.renewalDate, null);
  assert.equal(vm.history[0]?.statusKey, "lifetime");

  const insightCards = vm.lockedCapabilities.filter((c) => c.name === "Aipify Insights");
  assert.equal(insightCards.length, 1, "Aipify Insights must appear once");
  assert.equal(insightCards[0]?.kind, "addon", "addon priority wins over upgrade");
  assert.equal(insightCards[0]?.description, "Valgfri operasjonell innsikt.");

  assert.ok(vm.lockedCapabilities.some((c) => c.name === "Hosts operations"));
  assert.ok(vm.lockedCapabilities.some((c) => c.name === "Consider Enterprise governance"));
  assert.ok(
    !vm.lockedCapabilities.some((c) => c.name.includes(".")),
    "internal keys must not appear as locked capability names"
  );

  const starter = buildBillingViewModel({
    has_customer: true,
    current_package: {
      package_key: "starter",
      package_name: "Aipify Starter",
      description: "For businesses beginning with Aipify — support assistance and FAQ knowledge.",
      features: [
        "Aipify Core",
        "Install Engine",
        "Support Assistant",
        "FAQ Knowledge",
        "Human Approval",
        "Basic Analytics",
        "internal.module_key",
      ],
    },
    enabled_modules: [{ module_key: "support" }],
    billing_history: [
      {
        plan_name: "Aipify Starter",
        status: "active",
        next_billing_date: "2026-09-01",
      },
    ],
  }, {
    localizePackage: (key) =>
      key === "starter"
        ? {
            name: "Aipify Starter",
            description: "For virksomheter som starter med Aipify — supportassistanse og FAQ-kunnskap.",
          }
        : null,
    localizeFeature: (feature) => {
      const map: Record<string, string> = {
        "Aipify Core": "Aipify-kjerne",
        "Install Engine": "Veiledet installasjon",
        "Support Assistant": "Supportassistent",
        "FAQ Knowledge": "FAQ-kunnskap",
        "Human Approval": "Menneskelig godkjenning",
        "Basic Analytics": "Grunnleggende analyse",
      };
      return map[feature] ?? null;
    },
  });
  assert.equal(
    starter.packageDescription,
    "For virksomheter som starter med Aipify — supportassistanse og FAQ-kunnskap."
  );
  assert.deepEqual(starter.packageFeatures, [
    "Aipify-kjerne",
    "Veiledet installasjon",
    "Supportassistent",
    "FAQ-kunnskap",
    "Menneskelig godkjenning",
    "Grunnleggende analyse",
  ]);
  assert.equal(starter.modulesCount, null);
  assert.equal(starter.renewalDate, "2026-09-01");

  const unknownFeatures = buildBillingViewModel({
    has_customer: true,
    current_package: {
      package_key: "starter",
      package_name: "Aipify Starter",
      features: ["Install Engine", "plain language feature"],
    },
  });
  assert.deepEqual(
    unknownFeatures.packageFeatures,
    ["plain language feature"],
    "known technical labels without locale must be hidden"
  );

  const empty = buildBillingViewModel({ has_customer: false });
  assert.equal(empty.packageName, null);
  assert.equal(empty.history.length, 0);
  assert.equal(empty.lockedCapabilities.length, 0);
  assert.equal(empty.nextStep.kind, "none");
  assert.equal(empty.sections.package, false);

  console.log("billing-view-model.test.ts: ok");
}

run();
