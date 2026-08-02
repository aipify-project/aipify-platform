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
    enabled_modules: [{ module_key: "support" }, { module_key: "analytics" }],
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
        plan_name: "Aipify Business",
        status: "active",
        next_billing_date: "2026-09-01",
        updated_at: "2026-08-01T10:00:00Z",
      },
    ],
    privacy_note: "English backend note must not leak as customer truth.",
    positioning: "English positioning must not be shown.",
    ...overrides,
  };
}

function run() {
  const vm = buildBillingViewModel(samplePayload());

  assert.equal(vm.hasCustomer, true);
  assert.equal(vm.packageName, "Aipify Business");
  assert.equal(vm.statusKey, "active");
  assert.equal(vm.modulesCount, 2);
  assert.equal(vm.nextBillingDate, "2026-09-01");
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

  const domains = vm.limits.find((l) => l.key === "domains");
  assert.ok(domains);
  assert.equal(domains.max, null);
  assert.equal(domains.percent, null);

  assert.equal(vm.usageItems.find((u) => u.key === "support_cases_handled")?.value, 12);
  assert.equal(vm.history.length, 1);
  assert.equal(vm.history[0]?.planName, "Aipify Business");

  assert.ok(vm.lockedCapabilities.some((c) => c.name === "Aipify Enterprise"));
  assert.ok(vm.lockedCapabilities.some((c) => c.name === "Hosts operations"));
  assert.ok(vm.lockedCapabilities.some((c) => c.name === "Consider Enterprise governance"));
  assert.ok(
    !vm.lockedCapabilities.some((c) => c.name.includes(".")),
    "internal keys must not appear as locked capability names"
  );

  assert.equal(vm.nextStep.kind, "view_packages");

  const empty = buildBillingViewModel({ has_customer: false });
  assert.equal(empty.packageName, null);
  assert.equal(empty.history.length, 0);
  assert.equal(empty.lockedCapabilities.length, 0);
  assert.equal(empty.nextStep.kind, "none");

  const partial = buildBillingViewModel({
    has_customer: true,
    current_package: {
      package_key: "starter",
      package_name: "Aipify Starter",
      description: "",
      features: [],
    },
    usage: { support_cases_handled: 2 },
    tenant_limits: { used_users: 1, max_users: "∞" },
  });
  assert.equal(partial.packageName, "Aipify Starter");
  assert.equal(partial.limits[0]?.max, null);
  assert.equal(partial.nextStep.kind, "review_usage");
  assert.equal(partial.history.length, 0);

  console.log("billing-view-model.test.ts: ok");
}

run();
