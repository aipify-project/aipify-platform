#!/usr/bin/env node
/** ABOS Phase 289 — Aipify Companion Marketplace & Action Ecosystem Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 289,
  migration: "20261421700000_aipify_companion_marketplace_action_ecosystem_engine_phase289.sql",
  slug: "aipify-companion-marketplace-action-ecosystem-engine",
  docSlug: "AIPIFY_COMPANION_MARKETPLACE_ACTION_ECOSYSTEM_ENGINE",
  ilmFile: "implementation-blueprint-phase289-aipify-companion-marketplace-action-ecosystem-engine.txt",
  route: "/app/companion-marketplace",
  permKeys: ["marketplace_action.view", "marketplace_action.manage", "marketplace_action.activate"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Action Ecosystem",
    subtitle:
      "Extend companion capabilities through approved action providers, integrations, and specialized companion skills — a trusted ecosystem, not everything built in-house.",
    loading: "Loading Action Ecosystem…",
    corePrinciple: "Core principle",
    philosophyTitle: "Marketplace philosophy",
    expansionPrinciple: "Companion expansion",
    installedTitle: "Installed capabilities",
    recommendedTitle: "Recommended capabilities",
    catalogTitle: "Capability catalog",
    governanceTitle: "Governance warnings",
    usageTitle: "Usage insights",
    installationFlowTitle: "Installation flow",
    activate: "Activate capability",
    deactivate: "Remove capability",
    activated: "Capability activated — companion updated.",
    packageRequired: "Upgrade package required to activate this capability.",
    governanceLevel: "Governance level",
    provider: "Provider",
    rating: "Rating",
    pricing: "Pricing",
    permissions: "Permissions required",
    noRecommendations: "No recommendations yet — suggestions appear when observed value supports them.",
    noInstalled: "No capabilities installed yet. Start with one low-risk capability.",
    privacyNote: "Recommendations based on observed value — never aggressive upselling.",
    trustAdoptionLink: "Trust & Adoption →",
    approvalsLink: "Approval Center →",
    billingLink: "Packages & Access →",
    categories: {
      personal_actions: "Personal actions",
      business_actions: "Business actions",
      commerce_actions: "Commerce actions",
      companion_skills: "Companion skills",
    },
    governanceLevels: {
      "1": "Information only",
      "2": "Recommendation capability",
      "3": "Action requiring approval",
      "4": "Autonomous within policies",
    },
    settingsLink: "Action Ecosystem",
  };
}

function patchI18n() {
  const noBlock = { ...i18nBlock(), title: "Handlingsøkosystem", loading: "Laster handlingsøkosystem…", settingsLink: "Handlingsøkosystem" };
  const svBlock = { ...i18nBlock(), title: "Åtgärdsekosystem", settingsLink: "Åtgärdsekosystem" };
  const daBlock = { ...i18nBlock(), title: "Handlingsøkosystem", settingsLink: "Handlingsøkosystem" };

  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", noBlock],
    ["sv", svBlock],
    ["da", daBlock],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.companionMarketplaceAction = block;
    data.companionMarketplace = data.companionMarketplace ?? {};
    data.companionMarketplace.actionEcosystemTitle = block.title;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"trust_adoption.view",', `"trust_adoption.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  let c = fs.readFileSync(file, "utf8");
  const line = 'export * from "./aipify-companion-marketplace-action-ecosystem-engine";';
  if (!c.includes(line)) {
    c = `${c.trim()}\n${line}\n`;
    fs.writeFileSync(file, c);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Aipify Companion Marketplace & Action Ecosystem Engine
Route: ${P.route}
Module: Companion Marketplace
Location: Marketplace Center → Companion Marketplace

Core principle: Aipify should not attempt to build every capability itself.
Philosophy: "I can help with that. Would you like to activate this capability?"
Categories: Personal actions · Business actions · Commerce actions · Companion skills
Governance: L1 Information · L2 Recommendation · L3 Action+approval · L4 Autonomous within policies
Companion expansion: grow with organizations — not overwhelm on day one.
No aggressive upselling — recommendations from observed value only.
Helpers: _cmae_* · _cmaebp289_*
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";
export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE =
  "Aipify should not attempt to build every capability itself — provide a trusted ecosystem.";
`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`implementation-blueprint-phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase288-vocabulary";',
      `export * from "./implementation-blueprint-phase288-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE288_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase288-aipify-trust-acceleration-adoption-engine.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE288_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase288-aipify-trust-acceleration-adoption-engine.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Companion Marketplace & Action Ecosystem Engine (Phase 289):** See [AIPIFY_COMPANION_MARKETPLACE_ACTION_ECOSYSTEM_ENGINE_PHASE289.md](./AIPIFY_COMPANION_MARKETPLACE_ACTION_ECOSYSTEM_ENGINE_PHASE289.md) — Marketplace Center → Companion Marketplace action ecosystem. Approved action providers, integrations, companion skills, governance levels 1–4, installation flow, audit. Extends Phase 113 without breaking \`get_companion_marketplace_dashboard\`. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_cmae_*\`, \`_cmaebp289_*\`. APIs at \`/api/companion-marketplace/action-ecosystem/*\`. Permissions \`marketplace_action.view\`, \`marketplace_action.manage\`, \`marketplace_action.activate\`.`;
  if (!c.includes("Phase 289")) {
    c = `${c}\n${entry}\n`;
    fs.writeFileSync(file, c);
  }
}

write(
  path.join(ROOT, `AIPIFY_COMPANION_MARKETPLACE_ACTION_ECOSYSTEM_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Companion Marketplace & Action Ecosystem Engine — Phase ${P.phase}

## Purpose

Enable organizations to safely extend companion capabilities through approved action providers, integrations, and specialized companion skills.

## Route

\`${P.route}\` (Marketplace Center → Companion Marketplace)

## Core principle

Aipify should not attempt to build every capability itself — provide a trusted ecosystem where approved capabilities can be added when needed.

## Helpers

\`_cmae_*\` · \`_cmaebp289_*\`
`,
);

write(
  path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
  `# Implementation Blueprint — Phase ${P.phase} Companion Marketplace & Action Ecosystem Engine

Route: \`${P.route}\`
Migration: \`${P.migration}\`
`,
);

write(
  path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
  `# Companion Marketplace Action Ecosystem — FAQ (Phase ${P.phase})

## What is the Action Ecosystem?

A trusted marketplace where approved capabilities — personal actions, business integrations, commerce services, and companion skills — can be activated with transparent permissions and governance.

## Where is it?

Marketplace Center → Companion Marketplace at \`${P.route}\`.

## Does Aipify aggressively upsell capabilities?

No. Recommendations are based on observed value — never aggressive upselling.
`,
);

patchI18n();
patchPermissions();
patchTenant();
patchIlm();
patchArchitecture();
console.log(`Phase ${P.phase} complete`);
