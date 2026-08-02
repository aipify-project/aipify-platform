import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildBillingReferenceLabels } from "./billing-labels";
import { buildBillingViewModel } from "./billing-view-model";

const ROOT = process.cwd();

function read(path: string): string {
  return readFileSync(join(ROOT, path), "utf8");
}

function run() {
  const page = read("app/app/settings/billing/page.tsx");
  const panel = read("components/app/settings/BillingAdminPanel.tsx");
  const api = read("app/api/commercial-packages/billing/route.ts");
  const layout = read("lib/design/app-layout.ts");

  assert.match(page, /BillingAdminPanel/);
  assert.match(page, /buildBillingReferenceLabels/);
  assert.doesNotMatch(page, /AipifyCompanionBriefingBanner/);
  assert.doesNotMatch(page, /Companion/);

  assert.match(panel, /buildBillingViewModel/);
  assert.match(panel, /\/api\/commercial-packages\/billing/);
  assert.match(panel, /AppLayoutClasses/);
  assert.match(panel, /max-w-\[1560px\]|AppLayoutClasses\.page/);
  assert.doesNotMatch(panel, /max-w-4xl/);
  assert.doesNotMatch(panel, /Users:/);
  assert.doesNotMatch(panel, /Installations:/);
  assert.doesNotMatch(panel, /Domains:/);
  assert.doesNotMatch(panel, />Retry</);
  assert.doesNotMatch(panel, /positioning/);
  assert.doesNotMatch(panel, /privacy_note/);
  assert.doesNotMatch(panel, /sample|fixture|mockInvoice/i);

  assert.match(api, /getCustomerBillingCenter/);
  assert.match(layout, /1560/);

  const labels = buildBillingReferenceLabels((key) => {
    if (key.endsWith(".retry")) return "Prøv igjen";
    if (key.endsWith(".limits.users")) return "Brukere";
    if (key.endsWith(".title")) return "Fakturering og pakker";
    return key.split(".").pop() ?? key;
  });
  assert.equal(labels.retry, "Prøv igjen");
  assert.equal(labels.limits.users, "Brukere");
  assert.equal(labels.title, "Fakturering og pakker");

  const vm = buildBillingViewModel({
    has_customer: true,
    current_package: {
      package_key: "growth",
      package_name: "Aipify Growth",
      description: "Growth package",
      features: ["Installations"],
    },
    tenant_limits: { used_users: 2, max_users: 8 },
    billing_history: [{ plan_name: "Aipify Growth", status: "active" }],
  });
  assert.equal(vm.packageName, "Aipify Growth");
  assert.equal(vm.statusKey, "active");

  const locales = ["en", "no", "sv", "da", "pl", "uk"] as const;
  for (const locale of locales) {
    const settings = JSON.parse(read(`locales/${locale}/customer-app/settings.json`)) as {
      commercialPackages: { billing: Record<string, unknown> };
    };
    const billing = settings.commercialPackages.billing;
    assert.equal(typeof billing.title, "string");
    assert.equal(typeof billing.retry, "string");
    assert.equal(typeof (billing.limits as { users: string }).users, "string");
    assert.notEqual(billing.retry, "Retry");
    assert.doesNotMatch(String(billing.title), /customerApp\./);
  }

  console.log("billing-reference-route.test.ts: ok");
}

run();
