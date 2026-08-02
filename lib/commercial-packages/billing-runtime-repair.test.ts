import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildBillingViewModel } from "./billing-view-model";

const ROOT = process.cwd();

function read(path: string): string {
  return readFileSync(join(ROOT, path), "utf8");
}

function run() {
  // Anonymized Production-shaped sparse payload (optional sections missing).
  const sparse = buildBillingViewModel({
    has_customer: true,
    current_package: {
      package_key: "business",
      package_name: "Aipify Business",
      description: null,
      features: [],
    },
    usage: null,
    tenant_limits: { has_subscription: true, used_users: 2, max_users: 10 },
    billing_history: null,
    upgrade_options: null,
    addon_marketplace: null,
    upgrade_recommendations: null,
  });
  assert.equal(sparse.packageName, "Aipify Business");
  assert.equal(sparse.sections.package, true);
  assert.equal(sparse.sections.limits, true);
  assert.equal(sparse.sections.history, false);
  assert.equal(sparse.sections.locked, false);
  assert.equal(sparse.history.length, 0);

  const billingPage = read("app/app/billing/page.tsx");
  assert.match(billingPage, /redirect\("\/app\/settings\/billing"\)/);
  assert.doesNotMatch(billingPage, /from "@\/components\/app\/unified-billing"/);

  const unifiedRoute = read("app/api/unified-billing/center/route.ts");
  assert.match(unifiedRoute, /loadUnifiedBillingCenter/);
  assert.match(unifiedRoute, /billing_center_unavailable/);

  const panel = read("components/app/settings/BillingAdminPanel.tsx");
  assert.match(panel, /buildBillingViewModel/);
  assert.doesNotMatch(panel, /max-w-4xl/);

  const ubePanel = read("components/app/unified-billing/UnifiedBillingCenterPanel.tsx");
  assert.doesNotMatch(
    ubePanel,
    /return <p className="p-6 text-sm text-red-600">/,
    "must not collapse to a single red line"
  );
  assert.match(ubePanel, /labels\.retry|retry/);

  console.log("billing-runtime-repair.test.ts: ok");
}

run();
