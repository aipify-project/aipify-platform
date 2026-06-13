#!/usr/bin/env node
/** ABOS Phase 293 — Aipify Companion Action Marketplace Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 293,
  migration: "20261422100000_aipify_companion_action_marketplace_engine_phase293.sql",
  slug: "aipify-companion-action-marketplace-engine",
  docSlug: "AIPIFY_COMPANION_ACTION_MARKETPLACE_ENGINE",
  ilmFile: "implementation-blueprint-phase293-aipify-companion-action-marketplace-engine.txt",
  route: "/app/marketplace/companion-actions",
  permKeys: [
    "companion_action_marketplace.view",
    "companion_action_marketplace.manage",
    "companion_action_marketplace.activate",
    "companion_action_marketplace.record",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Companion Actions",
    subtitle:
      "Expand real-world capabilities through a secure marketplace of approved action providers — transportation, deliveries, bookings, gifting, and more.",
    loading: "Loading Action Marketplace…",
    corePrinciple: "Core principle",
    visionTitle: "Vision",
    installedTitle: "Installed providers",
    recommendedTitle: "Recommended providers",
    catalogTitle: "Available providers",
    historyTitle: "Action history",
    governanceTitle: "Governance warnings",
    usageTitle: "Action usage trends",
    executionFlowTitle: "Action execution flow",
    install: "Install provider",
    requestAction: "Request action",
    usageContext: "Business vs personal usage",
    savePreferences: "Save preferences",
    privacyNote: "Convenience without encouraging unnecessary spending.",
    marketplaceLink: "Marketplace Center →",
    companionMarketplaceLink: "Companion Marketplace →",
    approvalsLink: "Approval Center →",
    lifeEventsLink: "Life Events →",
    categories: {
      transportation: "Transportation",
      food_delivery: "Food & delivery",
      flowers_gifts: "Flowers & gifts",
      travel: "Travel",
      business_services: "Business services",
      lifestyle_services: "Lifestyle services",
    },
    settingsLink: "Companion Actions",
  };
}

function patchI18n() {
  const noBlock = { ...i18nBlock(), title: "Companion-handlinger", settingsLink: "Companion-handlinger" };
  const svBlock = { ...i18nBlock(), title: "Companion-åtgärder", settingsLink: "Companion-åtgärder" };
  const daBlock = { ...i18nBlock(), title: "Companion-handlinger", settingsLink: "Companion-handlinger" };

  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", noBlock],
    ["sv", svBlock],
    ["da", daBlock],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.companionActionMarketplace = block;
    data.nav = data.nav ?? {};
    data.nav.companionActionMarketplaceEngine = block.settingsLink;
    data.marketplace = data.marketplace ?? {};
    data.marketplace.companionActionsLink = block.settingsLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"presence_continuity.view",', `"presence_continuity.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("companionActionMarketplaceEngine")) {
    c = c.replace('| "marketplace"', '| "companionActionMarketplaceEngine"\n  | "marketplace"');
    c = c.replace(
      `{ id: "marketplace", href: "/app/marketplace", labelKey: "customerApp.nav.marketplace" },`,
      `{
    id: "companionActionMarketplaceEngine",
    href: "/app/marketplace/companion-actions",
    labelKey: "customerApp.nav.companionActionMarketplaceEngine",
  },
  { id: "marketplace", href: "/app/marketplace", labelKey: "customerApp.nav.marketplace" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/marketplace")) return "marketplace";',
      'if (pathname.startsWith("/app/marketplace/companion-actions")) return "companionActionMarketplaceEngine";\n  if (pathname.startsWith("/app/marketplace")) return "marketplace";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  let c = fs.readFileSync(file, "utf8");
  const line = 'export * from "./aipify-companion-action-marketplace-engine";';
  if (!c.includes(line)) {
    c = `${c.trim()}\n${line}\n`;
    fs.writeFileSync(file, c);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Aipify Companion Action Marketplace Engine
Route: ${P.route}
Module: Action Marketplace Center
Location: Marketplace Center → Companion Actions

Core principle: Connect what people genuinely need — not everything.
Categories: Transportation · Food & delivery · Flowers & gifts · Travel · Business services · Lifestyle services
Governance: L1 Information · L2 Quotation · L3 Booking prep+confirm · L4 Direct execution after approval
Execution flow: request → providers → pricing → recommendation → approval → execute → confirm → audit
No unnecessary spending upsell — convenience with governance.
Extends Phase 289 action ecosystem conceptually — separate provider registry.
Helpers: _cam_* · _cambp293_*
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";
export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE =
  "Connect what people genuinely need through trusted action provider integrations.";
`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`implementation-blueprint-phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase292-vocabulary";',
      `export * from "./implementation-blueprint-phase292-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE292_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase292-aipify-companion-presence-continuity-engine.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE292_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase292-aipify-companion-presence-continuity-engine.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Companion Action Marketplace Engine (Phase 293):** See [AIPIFY_COMPANION_ACTION_MARKETPLACE_ENGINE_PHASE293.md](./AIPIFY_COMPANION_ACTION_MARKETPLACE_ENGINE_PHASE293.md) — Action Marketplace Center at Marketplace Center → Companion Actions. Provider registry, action execution flow, user preferences, org controls, action history. Extends Phase 289 conceptually without modifying \`get_companion_marketplace_action_ecosystem_center\`. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_cam_*\`, \`_cambp293_*\`. APIs at \`/api/companion-action-marketplace/*\`. Permissions \`companion_action_marketplace.view\`, \`.manage\`, \`.activate\`, \`.record\`.`;
  if (!c.includes("Phase 293")) {
    c = `${c}\n${entry}\n`;
    fs.writeFileSync(file, c);
  }
}

write(
  path.join(ROOT, `AIPIFY_COMPANION_ACTION_MARKETPLACE_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Companion Action Marketplace Engine — Phase ${P.phase}

## Purpose

Expand real-world companion capabilities through a secure marketplace of approved action providers.

## Route

\`${P.route}\` (Marketplace Center → Companion Actions)

## Core principle

Connect what people genuinely need — not everything.

## Helpers

\`_cam_*\` · \`_cambp293_*\`
`,
);

write(
  path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
  `# Implementation Blueprint — Phase ${P.phase} Companion Action Marketplace Engine

Route: \`${P.route}\`
Migration: \`${P.migration}\`
`,
);

write(
  path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
  `# Companion Action Marketplace — FAQ (Phase ${P.phase})

## What is the Action Marketplace Center?

A governed marketplace for real-world companion actions — transportation, deliveries, bookings, gifting, and business services.

## Where is it?

Marketplace Center → Companion Actions at \`${P.route}\`.

## Does Aipify encourage unnecessary spending?

No. Recommendations support convenience with governance — never unnecessary spending upsell.
`,
);

patchI18n();
patchPermissions();
patchNav();
patchTenant();
patchIlm();
patchArchitecture();
console.log(`Phase ${P.phase} complete`);
