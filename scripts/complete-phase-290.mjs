#!/usr/bin/env node
/** ABOS Phase 290 — Aipify Life Events & Proactive Care Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 290,
  migration: "20261421800000_aipify_life_events_proactive_care_engine_phase290.sql",
  slug: "aipify-life-events-proactive-care-engine",
  docSlug: "AIPIFY_LIFE_EVENTS_PROACTIVE_CARE_ENGINE",
  ilmFile: "implementation-blueprint-phase290-aipify-life-events-proactive-care-engine.txt",
  route: "/app/companion/life-events",
  permKeys: ["life_events.view", "life_events.manage", "life_events.record"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Life Events",
    subtitle:
      "Remember, prepare for, and act upon important personal and professional moments — proactive care that strengthens relationships, never replaces them.",
    loading: "Loading Life Events Center…",
    corePrinciple: "Core principle",
    visionTitle: "Vision",
    userControlTitle: "Your control",
    upcomingTitle: "Upcoming events",
    remindersTitle: "Proactive reminders",
    suggestedActionsTitle: "Suggested actions",
    preparationTitle: "Events requiring preparation",
    careInsightsTitle: "Companion care insights",
    completedTitle: "Recently completed actions",
    settingsTitle: "Reminder & care settings",
    proactivityLevel: "How proactive should Aipify be?",
    suggestActions: "Allow Aipify to suggest actions",
    executeActions: "Allow Aipify to execute approved actions",
    optOut: "Pause all proactive life event care",
    saveSettings: "Save preferences",
    approve: "Approve action",
    decline: "Handle personally",
    complete: "Mark completed",
    dismiss: "Dismiss",
    snooze: "Remind me closer to the event",
    daysUntil: "Days until",
    importance: "Importance",
    noUpcoming: "No upcoming events registered yet.",
    noReminders: "No active reminders.",
    noActions: "No suggested actions pending.",
    privacyNote: "Supportive, never intrusive — you always decide.",
    trustAdoptionLink: "Trust & Adoption →",
    approvalsLink: "Approval Center →",
    marketplaceLink: "Companion Marketplace →",
    categories: {
      personal_events: "Personal events",
      professional_events: "Professional events",
      health_wellbeing_events: "Health & wellbeing",
    },
    importanceLevels: {
      optional: "Optional",
      important: "Important",
      very_important: "Very important",
      never_forget: "Never forget",
    },
    settingsLink: "Life Events",
  };
}

function patchI18n() {
  const noBlock = { ...i18nBlock(), title: "Livshendelser", loading: "Laster livshendelsessenter…", settingsLink: "Livshendelser" };
  const svBlock = { ...i18nBlock(), title: "Livshändelser", settingsLink: "Livshändelser" };
  const daBlock = { ...i18nBlock(), title: "Livsbegivenheder", settingsLink: "Livsbegivenheder" };

  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", noBlock],
    ["sv", svBlock],
    ["da", daBlock],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.lifeEvents = block;
    data.nav = data.nav ?? {};
    data.nav.lifeEventsEngine = block.settingsLink;
    data.settings = data.settings ?? {};
    data.settings.links = data.settings.links ?? {};
    data.settings.links.lifeEvents = block.settingsLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"marketplace_action.view",', `"marketplace_action.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("lifeEventsEngine")) {
    c = c.replace(
      '| "trustAdoptionEngine"',
      '| "lifeEventsEngine"\n  | "trustAdoptionEngine"',
    );
    c = c.replace(
      `{
    id: "trustAdoptionEngine",
    href: "/app/companion/trust-adoption",
    labelKey: "customerApp.nav.trustAdoptionEngine",
  },`,
      `{
    id: "lifeEventsEngine",
    href: "/app/companion/life-events",
    labelKey: "customerApp.nav.lifeEventsEngine",
  },
  {
    id: "trustAdoptionEngine",
    href: "/app/companion/trust-adoption",
    labelKey: "customerApp.nav.trustAdoptionEngine",
  },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/companion/trust-adoption"))',
      'if (pathname.startsWith("/app/companion/life-events")) return "lifeEventsEngine";\n  if (pathname.startsWith("/app/companion/trust-adoption"))',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  let c = fs.readFileSync(file, "utf8");
  const line = 'export * from "./aipify-life-events-proactive-care-engine";';
  if (!c.includes(line)) {
    c = `${c.trim()}\n${line}\n`;
    fs.writeFileSync(file, c);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Aipify Life Events & Proactive Care Engine
Route: ${P.route}
Module: Life Events Center
Location: Companion Center → Life Events

Core principle: People remember how technology helped them care about what matters.
Categories: Personal · Professional · Health & wellbeing
Importance: Optional · Important · Very Important · Never Forget
User control: categories, proactivity, suggested actions, executed actions — always human choice.
Reminders: supportive, never intrusive — "Would you prefer to handle this personally?"
Actions require permissions and approvals.
Vision: Help people show up for the moments that matter.
Helpers: _lepc_* · _lepcbp290_*
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";
export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE =
  "People remember how technology helped them care about what matters.";
`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`implementation-blueprint-phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase289-vocabulary";',
      `export * from "./implementation-blueprint-phase289-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE289_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase289-aipify-companion-marketplace-action-ecosystem-engine.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE289_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase289-aipify-companion-marketplace-action-ecosystem-engine.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Life Events & Proactive Care Engine (Phase 290):** See [AIPIFY_LIFE_EVENTS_PROACTIVE_CARE_ENGINE_PHASE290.md](./AIPIFY_LIFE_EVENTS_PROACTIVE_CARE_ENGINE_PHASE290.md) — Life Events Center at Companion Center → Life Events. Event registry, proactive reminders, suggested actions with approval, care insights, user control settings. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_lepc_*\`, \`_lepcbp290_*\`. APIs at \`/api/life-events/*\`. Permissions \`life_events.view\`, \`life_events.manage\`, \`life_events.record\`.`;
  if (!c.includes("Phase 290")) {
    c = `${c}\n${entry}\n`;
    fs.writeFileSync(file, c);
  }
}

write(
  path.join(ROOT, `AIPIFY_LIFE_EVENTS_PROACTIVE_CARE_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Life Events & Proactive Care Engine — Phase ${P.phase}

## Purpose

Help users remember, prepare for, and act upon important personal and professional life events through proactive reminders, thoughtful recommendations, and approved actions.

## Route

\`${P.route}\` (Companion Center → Life Events)

## Core principle

People rarely remember technology. People remember how technology helped them care about what matters.

## Helpers

\`_lepc_*\` · \`_lepcbp290_*\`
`,
);

write(
  path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
  `# Implementation Blueprint — Phase ${P.phase} Life Events & Proactive Care Engine

Route: \`${P.route}\`
Migration: \`${P.migration}\`
`,
);

write(
  path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
  `# Life Events & Proactive Care — FAQ (Phase ${P.phase})

## What is the Life Events Center?

Proactive care for personal, professional, and wellbeing events — reminders, preparation, and approved actions that strengthen relationships.

## Where is it?

Companion Center → Life Events at \`${P.route}\`.

## Does Aipify assume emotional intent?

No. Aipify suggests supportively — users always choose whether to act, approve, or handle personally.
`,
);

patchI18n();
patchPermissions();
patchNav();
patchTenant();
patchIlm();
patchArchitecture();
console.log(`Phase ${P.phase} complete`);
