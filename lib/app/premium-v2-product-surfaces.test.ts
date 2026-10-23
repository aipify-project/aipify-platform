import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { integrationCategoryLabel } from "@/lib/app-portal/integrations/category-label";
import { WEBSITE_KOMPIS_SITE_PROVISION_LIVE } from "@/lib/website-kompis-connection/provision-gate";

const labels = {
  categoryFallback: "Other",
  categories: {
    productivity: "Productivity",
    commerce: "Commerce",
    finance: "Finance",
    crm: "Customer relationships",
    support: "Support",
    marketing: "Marketing",
    storage: "Storage",
    communication: "Communication",
    analytics: "Analytics",
    development: "Development",
    custom: "Custom",
    general: "General",
  },
};

assert.equal(integrationCategoryLabel("CRM", labels), "Customer relationships");
assert.equal(integrationCategoryLabel(" general ", labels), "General");
assert.equal(integrationCategoryLabel("unonight_special", labels), "Other");
assert.notEqual(integrationCategoryLabel("CUSTOM_CODE", labels), "CUSTOM_CODE");
assert.equal(integrationCategoryLabel("", labels), "Other");

assert.equal(WEBSITE_KOMPIS_SITE_PROVISION_LIVE, false);

const root = process.cwd();
const read = (rel: string) => readFileSync(join(root, rel), "utf8");

const home = read("components/app/foundation/AppFoundationDashboard.tsx");
assert.match(home, /websiteKompisAvailable === false \? \([\s\S]*AppIconStatusCard/);
assert.match(home, /bedriftHomeCardState\(kompisBedriftAvailable\) === "open"/);
assert.match(home, /AppIconStatusCard[\s\S]*labels\.bedriftUnavailable/);
const connectionStart = home.lastIndexOf("websiteKompisAvailable === false");
const connectionFalse = home.slice(connectionStart, home.indexOf(") : (", connectionStart));
assert.match(connectionFalse, /AppIconStatusCard/);
assert.doesNotMatch(connectionFalse, /kompisWebConnection/);
assert.match(home, /FOUNDATION_NAV_BINDINGS\.kompisWebConnection/);
assert.match(home, /FOUNDATION_NAV_BINDINGS\.accountIntegrations/);

const hub = read("components/app/app-portal/AppPortalIntegrationsHubPanel.tsx");
assert.match(hub, /AppLoadingState/);
assert.match(hub, /AppErrorState/);
assert.match(hub, /integrationCategoryLabel\(provider\.category, labels\.hub\)/);
assert.doesNotMatch(hub, /uppercase tracking-wide text-slate-500">\{provider\.category\}/);
assert.match(hub, /aria-expanded=\{isOpen\}/);

const operator = read("components/app/kompis-operator/KompisOperatorWorkspacePanel.tsx");
assert.match(operator, /labels\.boundaryNote/);
assert.match(operator, /labels\.tasksTab/);
assert.match(operator, /labels\.websiteTab/);

const knowledge = read("app/app/kompis-bedrift/knowledge/page.tsx");
assert.match(knowledge, /bedrift\.knowledgeBoundaryStatus/);
assert.match(knowledge, /bedrift\.knowledgePublicSeparation/);
assert.match(knowledge, /multilingualGapTitle/);
assert.match(knowledge, /\/app\/settings\/employee-knowledge/);

const invoices = read("app/app/account/invoices/page.tsx");
assert.doesNotMatch(invoices, /createInvoice|issueInvoice|paymentButton|create_invoice/i);
assert.match(invoices, /EnterpriseInvoiceDetailsPanel/);

const shell = read("components/app/hubs/AppHubShell.tsx");
assert.match(shell, /aria-label=\{breadcrumbLabel\}/);
assert.doesNotMatch(shell, /aria-label="Breadcrumb"/);

for (const locale of ["en", "no", "sv", "da", "es", "pl", "uk"]) {
  const portal = JSON.parse(read(`locales/${locale}/customer-app/portalStructure.json`));
  const core = JSON.parse(read(`locales/${locale}/customer-app/core.json`));
  const hubLabels = portal.portalStructure.integrations.hub;
  assert.equal(typeof hubLabels.categoryFallback, "string");
  assert.equal(typeof hubLabels.categories.crm, "string");
  assert.equal(typeof portal.portalStructure.productHubs.common.breadcrumb, "string");
  assert.equal(typeof portal.portalStructure.foundationDashboard.webUnavailable, "string");
  assert.equal(typeof portal.portalStructure.productHubs.bedrift.knowledgeBoundaryStatus, "string");
  assert.equal(typeof core.kompisOperator.boundaryNote, "string");
  assert.ok(core.kompisOperator.boundaryNote.length > 40);
}

const enWeb = JSON.parse(read("locales/en/customer-app/portalStructure.json")).portalStructure
  .foundationDashboard.webUnavailable;
const svWeb = JSON.parse(read("locales/sv/customer-app/portalStructure.json")).portalStructure
  .foundationDashboard.webUnavailable;
const ukWeb = JSON.parse(read("locales/uk/customer-app/portalStructure.json")).portalStructure
  .foundationDashboard.webUnavailable;
assert.notEqual(svWeb, enWeb);
assert.notEqual(ukWeb, enWeb);

console.log("premium-v2-product-surfaces.test.ts: OK");
