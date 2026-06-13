#!/usr/bin/env node
/** ABOS Phase 297 — Aipify Companion Orchestration Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 297,
  migration: "20261422500000_aipify_companion_orchestration_engine_phase297.sql",
  slug: "aipify-companion-orchestration-engine",
  docSlug: "AIPIFY_COMPANION_ORCHESTRATION_ENGINE",
  ilmFile: "implementation-blueprint-phase297-aipify-companion-orchestration-engine.txt",
  route: "/app/companion/orchestration",
  permKeys: [
    "companion_orchestration.view",
    "companion_orchestration.manage",
    "companion_orchestration.record",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Orchestration",
    subtitle:
      "Aipify coordinates installed Companion capabilities so you experience one unified Companion — not dozens of disconnected assistants.",
    loading: "Loading Orchestration Center…",
    corePrinciple: "Core principle",
    visionTitle: "Vision",
    responsePrincipleTitle: "Response principle",
    healthTitle: "Companion health",
    registryTitle: "Companion registry",
    eventsTitle: "Orchestration events",
    conflictsTitle: "Conflicts resolved",
    settingsTitle: "Orchestration settings",
    testTitle: "Try orchestration",
    testPlaceholder: "Describe what you need help with…",
    testSubmit: "Orchestrate",
    testResponseLabel: "Aipify",
    orchestrationEnabled: "Enable companion orchestration",
    sensitivity: "Orchestration sensitivity",
    notificationLevel: "Notification level",
    saveSettings: "Save settings",
    activeCompanions: "Active companions",
    events30d: "Orchestration events (30d)",
    conflictsResolved: "Conflicts resolved",
    avgEffectiveness: "Avg. effectiveness",
    avgAcceptance: "Recommendation acceptance",
    multiCompanionEvents: "Multi-companion events",
    priority: "Priority",
    status: "Status",
    usage: "Usage",
    effectiveness: "Effectiveness",
    acceptance: "Acceptance",
    enabled: "Enabled",
    disabled: "Disabled",
    capabilitiesActivated: "Capabilities coordinated",
    conflictDetected: "Conflict balanced",
    privacyNote: "Privacy",
    actionMemoryLink: "Action Memory →",
    lifeEventsLink: "Life Events →",
    companionActionsLink: "Companion Actions →",
    sensitivityLevels: {
      conservative: "Conservative",
      balanced: "Balanced",
      proactive: "Proactive",
    },
    notificationLevels: {
      minimal: "Minimal",
      important: "Important only",
      all: "All orchestration signals",
    },
    priorityLevels: {
      "1": "Safety & critical",
      "2": "Time-sensitive",
      "3": "Family & relationships",
      "4": "Professional",
      "5": "Lifestyle",
    },
    settingsLink: "Orchestration",
  };
}

function patchI18n() {
  const noBlock = { ...i18nBlock(), title: "Orkestrering", settingsLink: "Orkestrering" };
  const svBlock = { ...i18nBlock(), title: "Orkestrering", settingsLink: "Orkestrering" };
  const daBlock = { ...i18nBlock(), title: "Orkestrering", settingsLink: "Orkestrering" };

  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", noBlock],
    ["sv", svBlock],
    ["da", daBlock],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.companionOrchestration = block;
    data.nav = data.nav ?? {};
    data.nav.companionOrchestrationEngine = block.settingsLink;
    data.settings = data.settings ?? {};
    data.settings.links = data.settings.links ?? {};
    data.settings.links.companionOrchestration = block.settingsLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace(
        '"companion_action_memory.view",',
        `"companion_action_memory.view",\n    "${perm}",`,
      );
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("companionOrchestrationEngine")) {
    c = c.replace(
      '| "companionActionMemoryEngine"',
      '| "companionOrchestrationEngine"\n  | "companionActionMemoryEngine"',
    );
    c = c.replace(
      `{
    id: "companionActionMemoryEngine",
    href: "/app/companion/action-memory",
    labelKey: "customerApp.nav.companionActionMemoryEngine",
  },`,
      `{
    id: "companionOrchestrationEngine",
    href: "/app/companion/orchestration",
    labelKey: "customerApp.nav.companionOrchestrationEngine",
  },
  {
    id: "companionActionMemoryEngine",
    href: "/app/companion/action-memory",
    labelKey: "customerApp.nav.companionActionMemoryEngine",
  },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/companion/action-memory")) return "companionActionMemoryEngine";',
      'if (pathname.startsWith("/app/companion/orchestration")) return "companionOrchestrationEngine";\n  if (pathname.startsWith("/app/companion/action-memory")) return "companionActionMemoryEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  let c = fs.readFileSync(file, "utf8");
  const line = 'export * from "./aipify-companion-orchestration-engine";';
  if (!c.includes(line)) {
    c = `${c.trim()}\n${line}\n`;
    fs.writeFileSync(file, c);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Aipify Companion Orchestration Engine
Route: ${P.route}
Module: Companion Orchestration Engine
Location: Companion Center → Orchestration

Core principle: Users interact with Aipify — companions are capabilities, not separate assistants.
Orchestration: context analyzed → companions identified → permissions verified → recommendations coordinated → audit logged.
Priority: Safety · Time-sensitive · Family · Professional · Lifestyle
Conflict resolution: competing priorities surfaced calmly — user decides.
Response principle: user sees Aipify — never internal module names in coordinated responses.
Helpers: _coe_* · _coebp297_*
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";
export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE =
  "Users should interact with Aipify — companions are capabilities. Aipify is the relationship.";
`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`implementation-blueprint-phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase296-vocabulary";',
      `export * from "./implementation-blueprint-phase296-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE296_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase296-aipify-companion-financial-guardrails-engine.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE296_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase296-aipify-companion-financial-guardrails-engine.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Companion Orchestration Engine (Phase ${P.phase}):** See [AIPIFY_COMPANION_ORCHESTRATION_ENGINE_PHASE${P.phase}.md](./AIPIFY_COMPANION_ORCHESTRATION_ENGINE_PHASE${P.phase}.md) — Orchestration Center at Companion Center → Orchestration. Companion registry, priority coordination, conflict resolution, unified Aipify responses, health dashboard, user and enterprise control. Bridge between Aipify Core and the Companion ecosystem. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_coe_*\`, \`_coebp297_*\`. APIs at \`/api/companion-orchestration/*\`. Permissions \`companion_orchestration.view\`, \`.manage\`, \`.record\`.`;
  if (!c.includes("Companion Orchestration Engine")) {
    c = `${c}\n${entry}\n`;
    fs.writeFileSync(file, c);
  }
}

write(
  path.join(ROOT, `AIPIFY_COMPANION_ORCHESTRATION_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Companion Orchestration Engine — Phase ${P.phase}

## Purpose

Enable Aipify Core to intelligently coordinate installed Companion Modules so users experience one unified Companion rather than multiple disconnected assistants.

## Route

\`${P.route}\` (Companion Center → Orchestration)

## Core principle

Users should interact with Aipify. Companions are capabilities. Aipify is the relationship.

## Helpers

\`_coe_*\` · \`_coebp297_*\`
`,
);

write(
  path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
  `# Implementation Blueprint — Phase ${P.phase} Companion Orchestration Engine

Route: \`${P.route}\`
Migration: \`${P.migration}\`
`,
);

write(
  path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
  `# Companion Orchestration — FAQ (Phase ${P.phase})

## What is Companion Orchestration?

Aipify coordinates installed Companion capabilities behind one unified experience — you interact with Aipify, not separate module assistants.

## Where is it?

Companion Center → Orchestration at \`${P.route}\`.

## Does Aipify expose internal module names to users?

No. Coordinated responses come from Aipify. The registry dashboard shows capability labels for transparency and control only.
`,
);

patchI18n();
patchPermissions();
patchNav();
patchTenant();
patchIlm();
patchArchitecture();
console.log(`Phase ${P.phase} complete`);
