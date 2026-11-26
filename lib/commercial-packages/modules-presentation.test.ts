import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), "utf8");

const panel = read("components/app/settings/ModulesAdminPanel.tsx");
const page = read("app/app/settings/modules/page.tsx");
const rpc = read("supabase/migrations/20261862240000_modules_readonly_get_phase620.sql");
const registry = read("app/api/super-admin/module-registry/route.ts");
const workspace = read("components/app/settings/billing/SubscriptionWorkspace.tsx");

assert.doesNotMatch(panel, /center\.packages/);
assert.doesNotMatch(panel, /method:\s*"PATCH"/);
assert.doesNotMatch(panel, /update_tenant_module/);
assert.match(page, /redirect/);
assert.match(page, /addons/);
assert.match(workspace, /ModulesAdminPanel/);
assert.match(
  read("components/app/settings/billing/KompisProductPortfolio.tsx"),
  /showCatalog = false/,
);
const software = read("app/app/software/page.tsx");
assert.match(software, /SoftwareProductShowcase/);
assert.match(software, /embedded/);
assert.doesNotMatch(software, /SoftwareCatalogPanel|WebsiteKompisPlansPanel/);
assert.match(rpc, /from public\.subscription_packages sp where sp\.active/);
assert.match(registry, /get_super_admin_module_registry_center/);
assert.doesNotMatch(page, /unonight/i);
assert.doesNotMatch(panel, /unnamedModule\)/);

const no = JSON.parse(read("locales/no/customer-app/settings.json")).commercialPackages;
assert.equal(no.modules.title, "Tilleggsmoduler");
assert.equal(no.modules.notForPurchase, "Ikke tilgjengelig for kjøp ennå");
assert.equal(typeof no.softwareShowcase.heroTitle, "string");
assert.ok(no.softwareShowcase.heroTitle.length > 0);
assert.equal(no.modules.manageSubscription, "Administrer abonnement");

console.log("modules-presentation.test.ts: ok");
