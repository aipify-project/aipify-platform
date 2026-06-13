#!/usr/bin/env node
/** ABOS Phase 284 — Enterprise Packaging, Upgrade & Instant Access Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 284,
  migration: "20261421200000_aipify_enterprise_packaging_upgrade_instant_access_engine_phase284.sql",
  slug: "aipify-enterprise-packaging-upgrade-instant-access-engine",
  docSlug: "AIPIFY_ENTERPRISE_PACKAGING_UPGRADE_INSTANT_ACCESS_ENGINE",
  ilmFile:
    "implementation-blueprint-phase284-aipify-enterprise-packaging-upgrade-instant-access-engine.txt",
  route: "/app/settings/billing/packages",
  permKeys: [
    "package_access.view",
    "package_access.manage",
    "package_access.upgrade",
    "package_access.billing",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Packages & Access",
    subtitle:
      "Choose the right package, upgrade when higher-value features are needed, and receive access instantly after payment.",
    loading: "Loading Package & Access Center…",
    back: "Settings",
    billingLink: "Billing Center →",
    currentPackage: "Current package",
    subscriptionStatus: "Status",
    renewal: "Renewal",
    seats: "Seats",
    recommendationTitle: "Aipify recommendation",
    packagesTitle: "Package comparison",
    lockedTitle: "Locked features",
    noLocked: "All features in your package tier are unlocked.",
    auditTitle: "Package & billing events",
    noAudit: "No package events recorded yet.",
    upgrade: "Upgrade now",
    upgrading: "Activating…",
    upgradeComplete: "Upgrade complete. Business features are now active.",
    goldNugget: "Gold nugget",
    whoFor: "Who this is for",
    instantAccess: "Paid = access now — no logout, no waiting.",
    privacyNote: "Package metadata only — operational records stay with your organization.",
    tiers: {
      starter: "Starter",
      professional: "Professional",
      business: "Business",
      enterprise: "Enterprise",
    },
    settingsLink: "Packages & Access",
  };
}

function patchI18n() {
  const noBlock = {
    ...i18nBlock(),
    title: "Pakker og tilgang",
    subtitle:
      "Velg riktig pakke, oppgrader når du trenger høyere verdi, og få tilgang umiddelbart etter betaling.",
    loading: "Laster pakke- og tilgangssenter…",
    billingLink: "Faktureringssenter →",
    recommendationTitle: "Aipify-anbefaling",
    upgrade: "Oppgrader nå",
    upgrading: "Aktiverer…",
    upgradeComplete: "Oppgradering fullført. Business-funksjoner er nå aktive.",
    goldNugget: "Gullklump",
    instantAccess: "Betalt = tilgang nå — ingen utlogging, ingen venting.",
    settingsLink: "Pakker og tilgang",
  };
  const svBlock = {
    ...i18nBlock(),
    title: "Paket och åtkomst",
    billingLink: "Faktureringscenter →",
    settingsLink: "Paket och åtkomst",
  };
  const daBlock = {
    ...i18nBlock(),
    title: "Pakker og adgang",
    billingLink: "Faktureringscenter →",
    settingsLink: "Pakker og adgang",
  };

  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", noBlock],
    ["sv", svBlock],
    ["da", daBlock],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.packageAccess = block;
    data.commercialPackages = data.commercialPackages ?? {};
    data.commercialPackages.billing = data.commercialPackages.billing ?? {};
    data.commercialPackages.billing.viewPackages = block.settingsLink;
    data.settings = data.settings ?? {};
    data.settings.links = data.settings.links ?? {};
    data.settings.links.packagesAccess = block.settingsLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"uaaf.view",', `"uaaf.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchBillingPanel() {
  const panel = path.join(ROOT, "components/app/settings/BillingAdminPanel.tsx");
  let p = fs.readFileSync(panel, "utf8");
  if (!p.includes("viewPackages")) {
    p = p.replace(
      "viewCommercial: string;",
      "viewCommercial: string;\n    viewPackages: string;",
    );
    p = p.replace(
      '<Link href="/app/commercial"',
      '<Link href="/app/settings/billing/packages" className="text-indigo-600 hover:underline">\n            {labels.viewPackages}\n          </Link>\n          <Link href="/app/commercial"',
    );
    fs.writeFileSync(panel, p);
  }

  const page = path.join(ROOT, "app/app/settings/billing/page.tsx");
  let pg = fs.readFileSync(page, "utf8");
  if (!pg.includes("viewPackages")) {
    pg = pg.replace(
      'viewCommercial: t("customerApp.commercialPackages.billing.viewCommercial"),',
      'viewCommercial: t("customerApp.commercialPackages.billing.viewCommercial"),\n        viewPackages: t("customerApp.commercialPackages.billing.viewPackages"),',
    );
    fs.writeFileSync(page, pg);
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  let c = fs.readFileSync(file, "utf8");
  const line =
    'export * from "./aipify-enterprise-packaging-upgrade-instant-access-engine";';
  if (!c.includes(line)) {
    c = `${c.trim()}\n${line}\n`;
    fs.writeFileSync(file, c);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Enterprise Packaging, Upgrade & Instant Access Engine
Route: ${P.route}

Core principles:
1. Customers should buy the right package — do not force early upsell.
2. Gold nugget features strategically placed (taxi, flowers, food → Business; travel → Enterprise).
3. Paid = access now — instant activation after payment.

Package tiers: Starter · Professional · Business · Enterprise
Upgrade flow: locked feature → explain → select upgrade → payment → instant unlock
Confirmation: "Upgrade complete. Business features are now active."
Permissions: package_access.view · manage · upgrade · billing
Helpers: _apuiae_* · _apuiaebp284_*
Extends Commercial Packages Phase 42 — does not replace get_customer_billing_center.
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";
export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_UPGRADE_CONFIRMATION =
  "Upgrade complete. Business features are now active.";
export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_PAID_ACCESS_NOW = "Paid = access now.";
`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`implementation-blueprint-phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase283-vocabulary";',
      `export * from "./implementation-blueprint-phase283-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE283_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase283-universal-action-access-framework.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE283_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase283-universal-action-access-framework.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Enterprise Packaging, Upgrade & Instant Access Engine (Phase 284):** See [AIPIFY_ENTERPRISE_PACKAGING_UPGRADE_INSTANT_ACCESS_ENGINE_PHASE284.md](./AIPIFY_ENTERPRISE_PACKAGING_UPGRADE_INSTANT_ACCESS_ENGINE_PHASE284.md) — Package & Access Center at Billing Center → Packages & Access. Extends Commercial Packages Phase 42 with feature gating, gold nugget placement, instant activation after payment, upgrade events, and billing access audit. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_apuiae_*\`, \`_apuiaebp284_*\`. APIs at \`/api/package-access/*\`. Permissions \`package_access.view\`, \`package_access.manage\`, \`package_access.upgrade\`, \`package_access.billing\`.`;
  if (!c.includes("Phase 284")) {
    c = `${c}\n${entry}\n`;
    fs.writeFileSync(file, c);
  }
}

write(
  path.join(ROOT, `AIPIFY_ENTERPRISE_PACKAGING_UPGRADE_INSTANT_ACCESS_ENGINE_PHASE${P.phase}.md`),
  `# Enterprise Packaging, Upgrade & Instant Access Engine — Phase ${P.phase}

## Purpose

Help customers choose the right package, upgrade naturally when higher-value features are required, and receive access instantly after payment.

## Route

\`${P.route}\` (Billing Center → Packages & Access)

## Core principles

1. **Buy the right package** — no forced early upsell
2. **Gold nugget placement** — taxi, flowers, food → Business; travel → Enterprise
3. **Paid = access now** — instant activation, no logout

## Permissions

\`package_access.view\` · \`package_access.manage\` · \`package_access.upgrade\` · \`package_access.billing\`

## Helpers

\`_apuiae_*\` · \`_apuiaebp284_*\`

Extends Commercial Packages Phase 42.
`,
);

write(
  path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
  `# Implementation Blueprint — Phase ${P.phase} Enterprise Packaging, Upgrade & Instant Access Engine

Route: \`${P.route}\`
Migration: \`${P.migration}\`
`,
);

write(
  path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
  `# Enterprise Packaging, Upgrade & Instant Access — FAQ (Phase ${P.phase})

## Where is Package & Access Center?

Billing Center → Packages & Access at \`${P.route}\`.

## What happens after I upgrade?

Payment completes → subscription updates → permissions refresh → features unlock instantly. No logout required.

## What are gold nugget features?

High-value companion actions (taxi, flowers, food ordering) reserved for Business and above.

## Does downgrading delete data?

No. Access is disabled; historical records remain safe.
`,
);

patchI18n();
patchPermissions();
patchBillingPanel();
patchTenant();
patchIlm();
patchArchitecture();
console.log(`Phase ${P.phase} complete`);
