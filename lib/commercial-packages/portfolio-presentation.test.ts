import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildBillingViewModel } from "./billing-view-model";
import {
  assignedWebPlan,
  bedriftProductTone,
  isLegacyCommercialPackage,
  renewalPresentation,
  subscriptionShowsDistinctLicense,
  webProductTone,
} from "./portfolio-presentation";

const root = process.cwd();

assert.equal(isLegacyCommercialPackage("starter"), true);
assert.equal(isLegacyCommercialPackage("insights"), true);
assert.equal(isLegacyCommercialPackage("website_kompis"), false);

assert.equal(
  renewalPresentation({ statusKey: "lifetime", licenseStatus: null, renewalDate: null }),
  "lifetime",
);
assert.equal(
  renewalPresentation({ statusKey: "active", licenseStatus: "active", renewalDate: null }),
  "unknown",
);
assert.equal(
  renewalPresentation({
    statusKey: "active",
    licenseStatus: null,
    renewalDate: "2026-11-01",
  }),
  "date",
);

assert.equal(
  subscriptionShowsDistinctLicense("Aipify Starter", {
    planName: "Workspace Lifetime",
    licenseStatus: "lifetime",
  }),
  true,
);
assert.equal(
  subscriptionShowsDistinctLicense("Aipify Starter", {
    planName: "Aipify Starter",
    licenseStatus: "active",
  }),
  false,
);

assert.equal(webProductTone({ webKind: "unknown_plan", webPlan: null, bedrift: "unknown" }), "unassigned");
assert.equal(assignedWebPlan({ webKind: "unknown_plan", webPlan: null, bedrift: "not_licensed" }), null);
assert.equal(bedriftProductTone({ webKind: "unknown_plan", webPlan: null, bedrift: "not_licensed" }), "not_licensed");
assert.notEqual(
  bedriftProductTone({ webKind: "no_module", webPlan: null, bedrift: "not_licensed" }),
  "licensed",
);

const vm = buildBillingViewModel({
  has_customer: true,
  current_package: { package_key: "starter", package_name: "Aipify Starter", features: [] },
  usage: {},
  tenant_limits: { used_users: 5, max_users: 25, used_domains: 2 },
  billing_history: [{ plan_name: "Workspace Lifetime", status: "lifetime" }],
});
assert.equal(vm.usageItems.every((item) => item.value === null), true);
assert.equal(vm.limits.find((limit) => limit.key === "users")?.state, "meter");
assert.equal(vm.limits.find((limit) => limit.key === "domains")?.state, "unknown");
assert.equal(vm.limits.find((limit) => limit.key === "installations")?.state, "unknown");
assert.equal(vm.history[0]?.planName, "Workspace Lifetime");
assert.equal(vm.packageName, "Aipify Starter");

const panel = readFileSync(join(root, "components/app/settings/BillingAdminPanel.tsx"), "utf8");
assert.doesNotMatch(panel, /Aipify Insights/);
assert.doesNotMatch(panel, /instantAccess/);
const packages = readFileSync(join(root, "app/app/settings/billing/packages/page.tsx"), "utf8");
assert.doesNotMatch(packages, /goldNugget|Package comparison|Locked features/);
assert.doesNotMatch(packages, /unonight/i);

const portfolio = readFileSync(
  join(root, "components/app/settings/billing/KompisProductPortfolio.tsx"),
  "utf8",
);
assert.match(portfolio, /plannedPlansTitle/);
assert.match(portfolio, /kompisWebDashboard/);
assert.match(portfolio, /kompis-web-product-visual\.png/);
assert.match(portfolio, /kompis-bedrift-product-visual\.png/);
assert.doesNotMatch(portfolio, /checkout|Kjøp|Buy now/i);

const noPortfolio = JSON.parse(
  readFileSync(join(root, "locales/no/customer-app/settings.json"), "utf8"),
).commercialPackages.portfolio;
assert.equal(noPortfolio.seeWeb, "Åpne Kompis Web");
assert.equal(noPortfolio.seeBedrift, "Se Kompis Bedrift");
assert.equal(noPortfolio.plannedPlansTitle, "Kompis Web-planer");
assert.equal(noPortfolio.noChange, "Produktene og tilgangen som gjelder for arbeidsområdet ditt.");
assert.doesNotMatch(noPortfolio.noChange, /Ingen endring er gjort/);

console.log("portfolio-presentation.test.ts: ok");
