import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { resolveCustomerFacingModuleName } from "../app-portal/software-catalog/module-presentation";
import { buildModulesAdminPanelLabels } from "../commercial-packages/modules-panel-labels";

const ROOT = process.cwd();
const LOCALES = ["en", "no", "sv", "da", "pl", "uk", "es"] as const;

function read(path: string): string {
  return readFileSync(join(ROOT, path), "utf8");
}

function readJson<T>(path: string): T {
  return JSON.parse(read(path)) as T;
}

function collectLeafKeys(value: unknown, prefix = ""): string[] {
  if (value == null || typeof value !== "object") return prefix ? [prefix] : [];
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectLeafKeys(item, `${prefix}[${index}]`));
  }
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    collectLeafKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

function getByPath(root: unknown, path: string): unknown {
  const parts = path.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
  let cur: unknown = root;
  for (const part of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return cur;
}

function run() {
  const licensePage = read("app/app/license/page.tsx");
  const licensePanel = read("components/app/license/TrustLicenseCenterPanel.tsx");
  const integrationsPanel = read("components/app/app-portal/AppPortalIntegrationsHubPanel.tsx");
  const modulesPanel = read("components/app/settings/ModulesAdminPanel.tsx");

  assert.match(licensePage, /AppLayoutClasses/);
  assert.match(licensePage, /companion/);
  assert.match(licensePanel, /\/app\/command-center/);
  assert.match(licensePanel, /\/app\/account\/subscription/);
  assert.doesNotMatch(licensePanel, /resolveAppHref\("\/app"\)/);
  assert.doesNotMatch(licensePanel, /resolveAppHref\("\/app\/billing"\)/);
  assert.doesNotMatch(licensePanel, /max-w-3xl/);
  assert.doesNotMatch(integrationsPanel, /max-w-4xl/);
  assert.match(integrationsPanel, /w-full/);
  assert.match(modulesPanel, /AppLayoutClasses/);
  assert.match(modulesPanel, /unnamedModule/);
  assert.match(modulesPanel, /labels\.retry/);
  assert.match(modulesPanel, /labels\.loadError/);

  const enLicense = readJson<Record<string, unknown>>("locales/en/license.json");
  const enKeys = collectLeafKeys(enLicense).sort();
  assert.ok(enKeys.includes("center.backToApp"));
  assert.ok(enKeys.includes("center.sections.software_ownership.title"));

  for (const locale of LOCALES) {
    const license = readJson<Record<string, unknown>>(`locales/${locale}/license.json`);
    const keys = collectLeafKeys(license).sort();
    assert.deepEqual(keys, enKeys, `license.json key parity failed for ${locale}`);

    const title = getByPath(license, "center.title");
    const back = getByPath(license, "center.backToApp");
    const ownership = getByPath(license, "center.sections.software_ownership.title");
    assert.equal(typeof title, "string");
    assert.equal(typeof back, "string");
    assert.equal(typeof ownership, "string");

    if (locale !== "en") {
      assert.notEqual(title, getByPath(enLicense, "center.title"), `${locale} license title still English`);
      assert.notEqual(
        ownership,
        getByPath(enLicense, "center.sections.software_ownership.title"),
        `${locale} software ownership title still English`,
      );
      assert.notEqual(
        getByPath(license, "center.subscription.currentPlan"),
        getByPath(enLicense, "center.subscription.currentPlan"),
        `${locale} currentPlan still English`,
      );
    }

    const shell = readJson<{ licenseSidebar: { workspace: string } }>(`locales/${locale}/shell.json`);
    assert.equal(typeof shell.licenseSidebar.workspace, "string");
    if (locale !== "en") {
      assert.notEqual(shell.licenseSidebar.workspace, "Workspace:");
    }

    const settings = readJson<{
      commercialPackages?: { modules?: Record<string, unknown> };
    }>(`locales/${locale}/customer-app/settings.json`);
    const modules = settings.commercialPackages?.modules;
    assert.ok(modules, `${locale} missing commercialPackages.modules`);
    assert.equal(typeof modules.retry, "string");
    assert.equal(typeof modules.unnamedModule, "string");
    assert.equal(typeof modules.loadError, "string");
    if (locale !== "en") {
      assert.notEqual(modules.retry, "Try again");
      assert.notEqual(modules.title, "Module management");
    }

    const companion = readJson<{ companionBriefing?: { companionBriefing?: string } }>(
      `locales/${locale}/customer-app/companion.json`,
    );
    assert.equal(typeof companion.companionBriefing?.companionBriefing, "string");
  }

  const labels = buildModulesAdminPanelLabels((key) => {
    if (key.endsWith(".retry")) return "Prøv igjen";
    if (key.endsWith(".unnamedModule")) return "Lisensiert modul";
    if (key.endsWith(".loadError")) return "Moduler kunne ikke lastes";
    return key.split(".").pop() ?? key;
  });
  assert.equal(labels.retry, "Prøv igjen");
  assert.equal(labels.unnamedModule, "Lisensiert modul");
  assert.equal(labels.loadError, "Moduler kunne ikke lastes");

  assert.equal(
    resolveCustomerFacingModuleName({ moduleKey: "additional_automation" }),
    null,
  );
  assert.equal(
    resolveCustomerFacingModuleName({
      moduleKey: "admin_assistant_engine",
      moduleName: "admin_assistant_engine",
    }),
    null,
  );

  console.log("shared-panels-i18n-links-width-polish.test.ts: ok");
}

run();
