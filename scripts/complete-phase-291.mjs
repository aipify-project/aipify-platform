#!/usr/bin/env node
/** ABOS Phase 291 — Aipify Companion Identity & Relationship Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 291,
  migration: "20261421900000_aipify_companion_identity_relationship_engine_phase291.sql",
  slug: "aipify-companion-identity-relationship-engine",
  docSlug: "AIPIFY_COMPANION_IDENTITY_RELATIONSHIP_ENGINE",
  ilmFile: "implementation-blueprint-phase291-aipify-companion-identity-relationship-engine.txt",
  route: "/app/companion/identity-relationship",
  permKeys: [
    "companion_identity_relationship.view",
    "companion_identity_relationship.manage",
    "companion_identity_relationship.record",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Identity & Relationship",
    subtitle:
      "Build a trusted, professional, human-centered companion identity — consistent, familiar, and recognizably Aipify while adapting to your preferences.",
    loading: "Loading Companion Identity Center…",
    corePrinciple: "Core principle",
    visionTitle: "Vision",
    identitySettingsTitle: "Identity settings",
    displayName: "How you address your Companion",
    officialNameNote: "Official identity remains",
    relationshipMode: "Relationship mode",
    communicationPrefsTitle: "Communication preferences",
    tonePreference: "Tone",
    proactivityLevel: "Proactivity",
    humorPreference: "Humor",
    notificationStyle: "Notification style",
    encouragementPreference: "Encouragement",
    briefingStyle: "Briefing style",
    personalization: "Personalization enabled",
    saveSettings: "Save preferences",
    trustIndicatorsTitle: "Trust indicators",
    milestonesTitle: "Relationship milestones",
    reviewsTitle: "Relationship review",
    personalizationTitle: "Personalization status",
    introductionTitle: "Aipify introduction",
    submitReview: "Submit response",
    achieved: "Achieved",
    pending: "Pending",
    privacyNote: "Familiarity, not unhealthy attachment — you remain in control.",
    trustAdoptionLink: "Trust & Adoption →",
    lifeEventsLink: "Life Events →",
    legacyIdentityLink: "Companion Identity Engine →",
    assistantIdentityLink: "Assistant Identity →",
    modes: {
      business: "Business mode",
      companion: "Companion mode",
      hybrid: "Hybrid mode",
    },
    settingsLink: "Identity & Relationship",
  };
}

function patchI18n() {
  const noBlock = {
    ...i18nBlock(),
    title: "Identitet og relasjon",
    loading: "Laster identitetssenter…",
    settingsLink: "Identitet og relasjon",
  };
  const svBlock = { ...i18nBlock(), title: "Identitet och relation", settingsLink: "Identitet och relation" };
  const daBlock = { ...i18nBlock(), title: "Identitet og relation", settingsLink: "Identitet og relation" };

  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", noBlock],
    ["sv", svBlock],
    ["da", daBlock],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.companionIdentityRelationship = block;
    data.nav = data.nav ?? {};
    data.nav.companionIdentityRelationshipEngine = block.settingsLink;
    data.settings = data.settings ?? {};
    data.settings.links = data.settings.links ?? {};
    data.settings.links.companionIdentityRelationship = block.settingsLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"life_events.view",', `"life_events.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("companionIdentityRelationshipEngine")) {
    c = c.replace(
      '| "lifeEventsEngine"',
      '| "companionIdentityRelationshipEngine"\n  | "lifeEventsEngine"',
    );
    c = c.replace(
      `{
    id: "lifeEventsEngine",
    href: "/app/companion/life-events",
    labelKey: "customerApp.nav.lifeEventsEngine",
  },`,
      `{
    id: "companionIdentityRelationshipEngine",
    href: "/app/companion/identity-relationship",
    labelKey: "customerApp.nav.companionIdentityRelationshipEngine",
  },
  {
    id: "lifeEventsEngine",
    href: "/app/companion/life-events",
    labelKey: "customerApp.nav.lifeEventsEngine",
  },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/companion/life-events"))',
      'if (pathname.startsWith("/app/companion/identity-relationship")) return "companionIdentityRelationshipEngine";\n  if (pathname.startsWith("/app/companion/life-events"))',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  let c = fs.readFileSync(file, "utf8");
  const line = 'export * from "./aipify-companion-identity-relationship-engine";';
  if (!c.includes(line)) {
    c = `${c.trim()}\n${line}\n`;
    fs.writeFileSync(file, c);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Aipify Companion Identity & Relationship Engine
Route: ${P.route}
Module: Companion Identity Center
Location: Companion Center → Identity & Relationship

Core principle: People trust consistency — familiar, reliable, recognizably Aipify.
Official name: Aipify — users may personalize address (Aipi, nicknames).
Modes: Business · Companion · Hybrid
Never manipulative, deceptive, overconfident, or designed for unhealthy attachment.
Humor: respectful, optional, never unprofessional in business contexts.
Introduction framework: transparent role, user control, bounded assistance.
Relationship review: "Am I helping in the way you prefer?"
Extends Phase 6 Companion Identity Engine — does not replace it.
Helpers: _cire_* · _cirebp291_*
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";
export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE =
  "People trust consistency — Aipify should feel familiar, reliable, and recognizably Aipify.";
`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`implementation-blueprint-phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase290-vocabulary";',
      `export * from "./implementation-blueprint-phase290-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE290_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase290-aipify-life-events-proactive-care-engine.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE290_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase290-aipify-life-events-proactive-care-engine.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Companion Identity & Relationship Engine (Phase 291):** See [AIPIFY_COMPANION_IDENTITY_RELATIONSHIP_ENGINE_PHASE291.md](./AIPIFY_COMPANION_IDENTITY_RELATIONSHIP_ENGINE_PHASE291.md) — Companion Identity Center at Companion Center → Identity & Relationship. Relationship modes, communication preferences, trust indicators, milestones, relationship review. Extends Phase 6 Companion Identity Engine without breaking \`get_companion_identity_engine_dashboard\`. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_cire_*\`, \`_cirebp291_*\`. APIs at \`/api/companion-identity-relationship/*\`. Permissions \`companion_identity_relationship.view\`, \`.manage\`, \`.record\`.`;
  if (!c.includes("Phase 291")) {
    c = `${c}\n${entry}\n`;
    fs.writeFileSync(file, c);
  }
}

write(
  path.join(ROOT, `AIPIFY_COMPANION_IDENTITY_RELATIONSHIP_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Companion Identity & Relationship Engine — Phase ${P.phase}

## Purpose

Build trusted, professional, human-centered relationships through consistent companion identity adapted to individual preferences and organizational culture.

## Route

\`${P.route}\` (Companion Center → Identity & Relationship)

## Core principle

People trust consistency. Aipify should feel familiar, reliable, and recognizably Aipify.

## Helpers

\`_cire_*\` · \`_cirebp291_*\`
`,
);

write(
  path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
  `# Implementation Blueprint — Phase ${P.phase} Companion Identity & Relationship Engine

Route: \`${P.route}\`
Migration: \`${P.migration}\`
`,
);

write(
  path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
  `# Companion Identity & Relationship — FAQ (Phase ${P.phase})

## What is the Companion Identity Center?

Configures how Aipify presents itself — relationship mode, communication preferences, trust indicators, and relationship milestones.

## Where is it?

Companion Center → Identity & Relationship at \`${P.route}\`.

## Can I rename Aipify?

You may personalize how you address Aipify (e.g. Aipi). The official identity always remains Aipify.
`,
);

patchI18n();
patchPermissions();
patchNav();
patchTenant();
patchIlm();
patchArchitecture();
console.log(`Phase ${P.phase} complete`);
