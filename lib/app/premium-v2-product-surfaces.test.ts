import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { customerFacingPlanLabel, webHomeCardState } from "@/lib/app/foundation-product-card";
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

assert.equal(webHomeCardState(null), "unknown");
assert.equal(webHomeCardState(false), "unavailable");
assert.equal(webHomeCardState(true), "open");
assert.equal(customerFacingPlanLabel("active"), null);
assert.equal(customerFacingPlanLabel("Buddy Web"), "Buddy Web");
assert.equal(integrationCategoryLabel("CRM", labels), "Customer relationships");
assert.equal(integrationCategoryLabel(" general ", labels), "General");
assert.equal(integrationCategoryLabel("unonight_special", labels), "Other");
assert.notEqual(integrationCategoryLabel("CUSTOM_CODE", labels), "CUSTOM_CODE");
assert.equal(integrationCategoryLabel("", labels), "Other");

assert.equal(WEBSITE_KOMPIS_SITE_PROVISION_LIVE, false);

const root = process.cwd();
const read = (rel: string) => readFileSync(join(root, rel), "utf8");

const home = read("components/app/foundation/AppFoundationDashboard.tsx");
assert.match(home, /webHomeCardState\(websiteKompisAvailable\)/);
assert.match(home, /webCard === "open" \? \([\s\S]*kompisWebDashboard/);
assert.match(home, /webCard === "unknown" \? labels\.webDataUnavailable : labels\.webUnavailable/);
assert.match(home, /bedriftHomeCardState\(kompisBedriftAvailable\)/);
assert.match(home, /bedriftCard === "open"/);
assert.match(home, /bedriftCard === "unknown"/);
assert.match(home, /labels\.bedriftDataUnavailable/);
assert.match(home, /labels\.bedriftUnavailable/);
assert.match(home, /CUSTOMER_CATALOG_ROUTE/);
assert.match(home, /FOUNDATION_NAV_BINDINGS\.kompisWebConnection/);
assert.match(home, /FOUNDATION_NAV_BINDINGS\.accountIntegrations/);
assert.match(home, /md:grid-cols-3/);
assert.match(home, /variant="compact"/);
assert.doesNotMatch(home, /websiteKompisAvailable === false \? \([\s\S]*kompisWebDashboard/);

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
assert.match(invoices, /subscriptionTabHref\("invoices"\)|EnterpriseInvoiceDetailsPanel/);

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
  assert.equal(typeof portal.portalStructure.foundationDashboard.webDataUnavailable, "string");
  assert.equal(typeof portal.portalStructure.foundationDashboard.bedriftDataUnavailable, "string");
  assert.equal(typeof portal.portalStructure.foundationDashboard.dataUnavailable, "string");
  assert.equal(typeof portal.portalStructure.foundationDashboard.exploreTitle, "string");
  assert.equal(typeof portal.portalStructure.foundationDashboard.attentionEmptyTitle, "string");
  assert.equal(typeof portal.portalStructure.workspaceDashboard.modulesEmptyTitle, "string");
  assert.equal(typeof portal.portalStructure.workspaceDashboard.ticketsCountsPartial, "string");
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
