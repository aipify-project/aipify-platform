#!/usr/bin/env node
/** ABOS Phase 294 — Aipify Companion Action Memory Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 294,
  migration: "20261422200000_aipify_companion_action_memory_engine_phase294.sql",
  slug: "aipify-companion-action-memory-engine",
  docSlug: "AIPIFY_COMPANION_ACTION_MEMORY_ENGINE",
  ilmFile: "implementation-blueprint-phase294-aipify-companion-action-memory-engine.txt",
  route: "/app/companion/action-memory",
  permKeys: [
    "companion_action_memory.view",
    "companion_action_memory.manage",
    "companion_action_memory.record",
    "companion_action_memory.delete",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Action Memory",
    subtitle:
      "Remember approved action preferences and recurring choices — reduce friction without reducing control.",
    loading: "Loading Action Memory Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Memory philosophy",
    visionTitle: "Vision",
    preferencesTitle: "Remembered preferences",
    recentTitle: "Recently used patterns",
    suggestionsTitle: "Aipify suggestions",
    validationsTitle: "Memory validation",
    settingsTitle: "Memory settings",
    memoryEnabled: "Enable action memory",
    accept: "Yes, remember this",
    reject: "Not this time",
    confirm: "Confirm preference",
    delete: "Delete preference",
    dismiss: "Dismiss",
    resetMemory: "Reset companion action memory",
    saveSettings: "Save settings",
    confidence: "Confidence",
    lastUsed: "Last used",
    privacyNote: "Granular control — explain what is remembered, support complete deletion.",
    actionMarketplaceLink: "Companion Actions →",
    assistantMemoryLink: "Assistant Memory (PAME) →",
    approvalsLink: "Approval Center →",
    categories: {
      transportation: "Transportation",
      flowers_gifts: "Flowers & gifts",
      food_catering: "Food & catering",
      travel: "Travel",
      business_actions: "Business actions",
    },
    confidenceLevels: {
      learned_once: "Learned once",
      emerging: "Emerging preference",
      established: "Established preference",
      strong: "Strong preference",
    },
    settingsLink: "Action Memory",
  };
}

function patchI18n() {
  const noBlock = { ...i18nBlock(), title: "Handlingsminne", settingsLink: "Handlingsminne" };
  const svBlock = { ...i18nBlock(), title: "Åtgärdsminne", settingsLink: "Åtgärdsminne" };
  const daBlock = { ...i18nBlock(), title: "Handlingshukommelse", settingsLink: "Handlingshukommelse" };

  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", noBlock],
    ["sv", svBlock],
    ["da", daBlock],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.companionActionMemory = block;
    data.nav = data.nav ?? {};
    data.nav.companionActionMemoryEngine = block.settingsLink;
    data.settings = data.settings ?? {};
    data.settings.links = data.settings.links ?? {};
    data.settings.links.companionActionMemory = block.settingsLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"companion_action_marketplace.view",', `"companion_action_marketplace.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("companionActionMemoryEngine")) {
    c = c.replace(
      '| "presenceContinuityEngine"',
      '| "companionActionMemoryEngine"\n  | "presenceContinuityEngine"',
    );
    c = c.replace(
      `{
    id: "presenceContinuityEngine",
    href: "/app/companion/presence-continuity",
    labelKey: "customerApp.nav.presenceContinuityEngine",
  },`,
      `{
    id: "companionActionMemoryEngine",
    href: "/app/companion/action-memory",
    labelKey: "customerApp.nav.companionActionMemoryEngine",
  },
  {
    id: "presenceContinuityEngine",
    href: "/app/companion/presence-continuity",
    labelKey: "customerApp.nav.presenceContinuityEngine",
  },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/companion/presence-continuity"))',
      'if (pathname.startsWith("/app/companion/action-memory")) return "companionActionMemoryEngine";\n  if (pathname.startsWith("/app/companion/presence-continuity"))',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  let c = fs.readFileSync(file, "utf8");
  const line = 'export * from "./aipify-companion-action-memory-engine";';
  if (!c.includes(line)) {
    c = `${c.trim()}\n${line}\n`;
    fs.writeFileSync(file, c);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Aipify Companion Action Memory Engine
Route: ${P.route}
Module: Action Memory Center
Location: Companion Center → Action Memory

Core principle: Learn from approved experiences — never repeat the same teaching.
Philosophy: First time ask how to handle; later ask if same as last time.
Categories: Transportation · Flowers & gifts · Food & catering · Travel · Business actions
Confidence: Learned once · Emerging · Established · Strong
User control: view, edit, delete, disable categories, reset memory.
Memory validation: inactivity, rejections, context changes — never assume intent.
Distinct from PAME assistant memory — action preferences only.
Helpers: _came_* · _camebp294_*
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";
export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE =
  "Learn from approved action experiences — people should not repeatedly teach the same preferences.";
`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`implementation-blueprint-phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase293-vocabulary";',
      `export * from "./implementation-blueprint-phase293-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE293_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase293-aipify-companion-action-marketplace-engine.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE293_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase293-aipify-companion-action-marketplace-engine.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Companion Action Memory Engine (Phase 294):** See [AIPIFY_COMPANION_ACTION_MEMORY_ENGINE_PHASE294.md](./AIPIFY_COMPANION_ACTION_MEMORY_ENGINE_PHASE294.md) — Action Memory Center at Companion Center → Action Memory. Remembered action preferences, confidence levels, suggestions, memory validation, user control. Distinct from PAME. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_came_*\`, \`_camebp294_*\`. APIs at \`/api/companion-action-memory/*\`. Permissions \`companion_action_memory.view\`, \`.manage\`, \`.record\`, \`.delete\`.`;
  if (!c.includes("Phase 294")) {
    c = `${c}\n${entry}\n`;
    fs.writeFileSync(file, c);
  }
}

write(
  path.join(ROOT, `AIPIFY_COMPANION_ACTION_MEMORY_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Companion Action Memory Engine — Phase ${P.phase}

## Purpose

Remember user preferences, recurring choices, and approved action patterns to reduce friction and improve future recommendations.

## Route

\`${P.route}\` (Companion Center → Action Memory)

## Core principle

People should not have to repeatedly teach Aipify the same preferences.

## Helpers

\`_came_*\` · \`_camebp294_*\`
`,
);

write(
  path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
  `# Implementation Blueprint — Phase ${P.phase} Companion Action Memory Engine

Route: \`${P.route}\`
Migration: \`${P.migration}\`
`,
);

write(
  path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
  `# Companion Action Memory — FAQ (Phase ${P.phase})

## What is Action Memory?

Remembers approved action preferences (transportation, gifts, catering, travel, business) — distinct from PAME assistant memory.

## Where is it?

Companion Center → Action Memory at \`${P.route}\`.

## Does Aipify assume intent from memory?

No. Suggestions remain supportive — users always confirm or reject.
`,
);

patchI18n();
patchPermissions();
patchNav();
patchTenant();
patchIlm();
patchArchitecture();
console.log(`Phase ${P.phase} complete`);
