#!/usr/bin/env node
/** ABOS Phase 292 — Aipify Companion Presence & Continuity Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 292,
  migration: "20261422000000_aipify_companion_presence_continuity_engine_phase292.sql",
  slug: "aipify-companion-presence-continuity-engine",
  docSlug: "AIPIFY_COMPANION_PRESENCE_CONTINUITY_ENGINE",
  ilmFile: "implementation-blueprint-phase292-aipify-companion-presence-continuity-engine.txt",
  route: "/app/companion/presence-continuity",
  permKeys: ["presence_continuity.view", "presence_continuity.manage", "presence_continuity.record"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Presence & Continuity",
    subtitle:
      "Maintain a continuous, reassuring companion presence — resume conversations, tasks, and workflows without losing momentum.",
    loading: "Loading Presence Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Presence philosophy",
    visionTitle: "Vision",
    presenceStatus: "Companion presence status",
    resumeTitle: "Welcome back",
    continueSession: "Continue where we left off",
    sinceLastSessionTitle: "Since last session",
    contextTitle: "Working context preserved",
    prioritiesTitle: "Pending priorities",
    initiativesTitle: "Active initiatives",
    insightsTitle: "Presence insights",
    executiveTitle: "Executive continuity",
    settingsTitle: "Presence settings",
    presenceState: "Presence state",
    greetingStyle: "Greeting style",
    briefingFrequency: "Briefing frequency",
    sinceLastSessionDetail: "Since-last-session detail",
    focusBehavior: "Focus mode behavior",
    saveSettings: "Save preferences",
    dismiss: "Dismiss",
    privacyNote: "Calm presence — supportive observations, never intrusive.",
    commandCenterLink: "Command Center →",
    trustAdoptionLink: "Trust & Adoption →",
    identityLink: "Identity & Relationship →",
    attentionLink: "Attention Guardian →",
    states: {
      offline: "Offline",
      available: "Available",
      focused: "Focused",
      active_companion: "Active Companion",
    },
    settingsLink: "Presence & Continuity",
  };
}

function patchI18n() {
  const noBlock = { ...i18nBlock(), title: "Tilstedeværelse og kontinuitet", loading: "Laster tilstedeværelsessenter…", settingsLink: "Tilstedeværelse og kontinuitet" };
  const svBlock = { ...i18nBlock(), title: "Närvaro och kontinuitet", settingsLink: "Närvaro och kontinuitet" };
  const daBlock = { ...i18nBlock(), title: "Tilstedeværelse og kontinuitet", settingsLink: "Tilstedeværelse og kontinuitet" };

  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", noBlock],
    ["sv", svBlock],
    ["da", daBlock],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.presenceContinuity = block;
    data.nav = data.nav ?? {};
    data.nav.presenceContinuityEngine = block.settingsLink;
    data.settings = data.settings ?? {};
    data.settings.links = data.settings.links ?? {};
    data.settings.links.presenceContinuity = block.settingsLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"companion_identity_relationship.view",', `"companion_identity_relationship.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("presenceContinuityEngine")) {
    c = c.replace(
      '| "companionIdentityRelationshipEngine"',
      '| "presenceContinuityEngine"\n  | "companionIdentityRelationshipEngine"',
    );
    c = c.replace(
      `{
    id: "companionIdentityRelationshipEngine",
    href: "/app/companion/identity-relationship",
    labelKey: "customerApp.nav.companionIdentityRelationshipEngine",
  },`,
      `{
    id: "presenceContinuityEngine",
    href: "/app/companion/presence-continuity",
    labelKey: "customerApp.nav.presenceContinuityEngine",
  },
  {
    id: "companionIdentityRelationshipEngine",
    href: "/app/companion/identity-relationship",
    labelKey: "customerApp.nav.companionIdentityRelationshipEngine",
  },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/companion/identity-relationship"))',
      'if (pathname.startsWith("/app/companion/presence-continuity")) return "presenceContinuityEngine";\n  if (pathname.startsWith("/app/companion/identity-relationship"))',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  let c = fs.readFileSync(file, "utf8");
  const line = 'export * from "./aipify-companion-presence-continuity-engine";';
  if (!c.includes(line)) {
    c = `${c.trim()}\n${line}\n`;
    fs.writeFileSync(file, c);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Aipify Companion Presence & Continuity Engine
Route: ${P.route}
Module: Presence Center
Location: Companion Center → Presence & Continuity

Core principle: Aipify should feel consistently available — not an app users repeatedly reopen.
Philosophy: We continue where we left off.
States: Offline · Available · Focused · Active Companion
Continuity: conversations, approvals, commitments, initiatives, workflows, drafts — metadata only.
Since-last-session: brief · standard · executive display modes.
Focus protection: respect working hours, focus periods, notification preferences.
Multi-device: desktop, web, mobile — context follows user appropriately.
Helpers: _cpce_* · _cpcebp292_*
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";
export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE =
  "Aipify should feel like a companion consistently available — we continue where we left off.";
`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`implementation-blueprint-phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase291-vocabulary";',
      `export * from "./implementation-blueprint-phase291-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE291_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase291-aipify-companion-identity-relationship-engine.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE291_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase291-aipify-companion-identity-relationship-engine.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Companion Presence & Continuity Engine (Phase 292):** See [AIPIFY_COMPANION_PRESENCE_CONTINUITY_ENGINE_PHASE292.md](./AIPIFY_COMPANION_PRESENCE_CONTINUITY_ENGINE_PHASE292.md) — Presence Center at Companion Center → Presence & Continuity. Presence states, continuity context, resume experience, since-last-session summaries, focus protection. Does not modify \`get_command_center_bundle\` or \`get_companion_presence_bundle\`. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_cpce_*\`, \`_cpcebp292_*\`. APIs at \`/api/presence-continuity/*\`. Permissions \`presence_continuity.view\`, \`.manage\`, \`.record\`.`;
  if (!c.includes("Phase 292")) {
    c = `${c}\n${entry}\n`;
    fs.writeFileSync(file, c);
  }
}

write(
  path.join(ROOT, `AIPIFY_COMPANION_PRESENCE_CONTINUITY_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Companion Presence & Continuity Engine — Phase ${P.phase}

## Purpose

Maintain continuous companion presence across devices and contexts — resume without losing momentum.

## Route

\`${P.route}\` (Companion Center → Presence & Continuity)

## Core principle

Aipify should feel like a companion consistently available when needed — not software users repeatedly reopen.

## Helpers

\`_cpce_*\` · \`_cpcebp292_*\`
`,
);

write(
  path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
  `# Implementation Blueprint — Phase ${P.phase} Companion Presence & Continuity Engine

Route: \`${P.route}\`
Migration: \`${P.migration}\`
`,
);

write(
  path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
  `# Companion Presence & Continuity — FAQ (Phase ${P.phase})

## What is the Presence Center?

Maintains working context and a reassuring companion presence — resume conversations, approvals, and workflows where you left off.

## Where is it?

Companion Center → Presence & Continuity at \`${P.route}\`.

## Does Aipify interrupt during focus time?

No. Focus protection respects focus periods and notification preferences — high-priority only when focused.
`,
);

patchI18n();
patchPermissions();
patchNav();
patchTenant();
patchIlm();
patchArchitecture();
console.log(`Phase ${P.phase} complete`);
