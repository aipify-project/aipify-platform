import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), "utf8");

const panel = read("components/app/settings/ModulesAdminPanel.tsx");
const page = read("app/app/settings/modules/page.tsx");
const rpc = read("supabase/migrations/20261862240000_modules_readonly_get_phase620.sql");
const registry = read("app/api/super-admin/module-registry/route.ts");

assert.doesNotMatch(panel, /center\.packages/);
assert.doesNotMatch(panel, /method:\s*"PATCH"/);
assert.doesNotMatch(panel, /update_tenant_module/);
assert.doesNotMatch(panel, /\/app\/account\/subscription/);
assert.doesNotMatch(page, /checkout|Kjøp|Buy now/i);
assert.match(page, /KompisProductPortfolio/);
assert.doesNotMatch(page, /showCatalog/);
assert.match(
  read("components/app/settings/billing/KompisProductPortfolio.tsx"),
  /showCatalog = false/,
);
assert.match(page, /accountSubscription/);
assert.match(page, /billing\/packages/);
assert.match(rpc, /from public\.subscription_packages sp where sp\.active/);
assert.match(registry, /get_super_admin_module_registry_center/);
assert.doesNotMatch(page, /unonight/i);

const no = JSON.parse(read("locales/no/customer-app/settings.json")).commercialPackages.modules;
assert.equal(no.title, "Moduler");
assert.equal(no.productsIntro, "Produktene og modulene for arbeidsområdet ditt.");
assert.equal(no.manageSubscription, "Administrer abonnement");

console.log("modules-presentation.test.ts: ok");
