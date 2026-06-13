#!/usr/bin/env node
/** ABOS Phase 288 — Aipify Trust Acceleration & Adoption Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 288,
  migration: "20261421600000_aipify_trust_acceleration_adoption_engine_phase288.sql",
  slug: "aipify-trust-acceleration-adoption-engine",
  docSlug: "AIPIFY_TRUST_ACCELERATION_ADOPTION_ENGINE",
  ilmFile: "implementation-blueprint-phase288-aipify-trust-acceleration-adoption-engine.txt",
  route: "/app/companion/trust-adoption",
  permKeys: ["trust_adoption.view", "trust_adoption.manage", "trust_adoption.record"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Trust & Adoption",
    subtitle:
      "Systematically increase trust and accelerate adoption — transforming occasional use into daily reliance through competence, transparency, and value.",
    loading: "Loading Adoption Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Adoption philosophy",
    adoptionStage: "Adoption stage",
    adoptionState: "Adoption state",
    reliabilityScore: "Companion reliability score",
    reliabilityLevel: "Reliability level",
    trustTrend: "Trust trend",
    valueMomentsTitle: "Value moments delivered",
    signalsTitle: "Adoption signals",
    recommendationsTitle: "Adoption recommendations",
    widgetsTitle: "Executive adoption dashboard",
    auditTitle: "Trust & adoption audit",
    noAudit: "No trust events recorded yet.",
    companionLink: "Companion Center →",
    firstDayLink: "First Day Experience →",
    privacyNote: "Adoption through value — never manipulate users into dependence.",
    stages: {
      curiosity: "Curiosity",
      confidence: "Confidence",
      dependence: "Dependence",
      companionship: "Companionship",
    },
    states: {
      exploring: "Exploring",
      learning: "Learning",
      integrating: "Integrating",
      relying: "Relying",
      advocating: "Advocating",
    },
    reliabilityLevels: {
      buildingTrust: "Building Trust",
      reliable: "Reliable",
      highlyReliable: "Highly Reliable",
      essentialCompanion: "Essential Companion",
    },
    settingsLink: "Trust & Adoption",
  };
}

function patchI18n() {
  const noBlock = { ...i18nBlock(), title: "Tillit og adopsjon", loading: "Laster adopsjonssenter…", settingsLink: "Tillit og adopsjon" };
  const svBlock = { ...i18nBlock(), title: "Förtroende och adoption", settingsLink: "Förtroende och adoption" };
  const daBlock = { ...i18nBlock(), title: "Tillid og adoption", settingsLink: "Tillid og adoption" };

  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", noBlock],
    ["sv", svBlock],
    ["da", daBlock],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.trustAdoption = block;
    data.nav = data.nav ?? {};
    data.nav.trustAdoptionEngine = block.settingsLink;
    data.settings = data.settings ?? {};
    data.settings.links = data.settings.links ?? {};
    data.settings.links.trustAdoption = block.settingsLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"first_day.view",', `"first_day.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("trustAdoptionEngine")) {
    c = c.replace(
      '| "proactiveCompanionEngine"',
      '| "trustAdoptionEngine"\n  | "proactiveCompanionEngine"',
    );
    c = c.replace(
      `{
    id: "proactiveCompanionEngine",
    href: "/app/proactive-companion-engine",
    labelKey: "customerApp.nav.proactiveCompanionEngine",
  },`,
      `{
    id: "trustAdoptionEngine",
    href: "/app/companion/trust-adoption",
    labelKey: "customerApp.nav.trustAdoptionEngine",
  },
  {
    id: "proactiveCompanionEngine",
    href: "/app/proactive-companion-engine",
    labelKey: "customerApp.nav.proactiveCompanionEngine",
  },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/proactive-companion-engine"))',
      'if (pathname.startsWith("/app/companion/trust-adoption")) return "trustAdoptionEngine";\n  if (pathname.startsWith("/app/proactive-companion-engine"))',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  let c = fs.readFileSync(file, "utf8");
  const line = 'export * from "./aipify-trust-acceleration-adoption-engine";';
  if (!c.includes(line)) {
    c = `${c.trim()}\n${line}\n`;
    fs.writeFileSync(file, c);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Aipify Trust Acceleration & Adoption Engine
Route: ${P.route}
Module: Adoption Center
Location: Companion Center → Trust & Adoption

Core principle: Trust is earned through repeated positive experiences. Goal is reliance, not usage.
Stages: Curiosity · Confidence · Dependence · Companionship
States: Exploring · Learning · Integrating · Relying · Advocating
Reliability: Building Trust · Reliable · Highly Reliable · Essential Companion
Never manipulate users into dependence.
Helpers: _atae_* · _ataebp288_*
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";
export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE =
  "Trust is earned through repeated positive experiences. The goal is reliance.";
`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`implementation-blueprint-phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase287-vocabulary";',
      `export * from "./implementation-blueprint-phase287-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE287_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase287-aipify-first-day-experience-engine.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE287_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase287-aipify-first-day-experience-engine.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Trust Acceleration & Adoption Engine (Phase 288):** See [AIPIFY_TRUST_ACCELERATION_ADOPTION_ENGINE_PHASE288.md](./AIPIFY_TRUST_ACCELERATION_ADOPTION_ENGINE_PHASE288.md) — Adoption Center at Companion Center → Trust & Adoption. Value moment engine, adoption signals, companion reliability score, executive widgets, natural adoption recommendations. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_atae_*\`, \`_ataebp288_*\`. APIs at \`/api/trust-adoption/*\`. Permissions \`trust_adoption.view\`, \`trust_adoption.manage\`, \`trust_adoption.record\`.`;
  if (!c.includes("Phase 288")) {
    c = `${c}\n${entry}\n`;
    fs.writeFileSync(file, c);
  }
}

write(
  path.join(ROOT, `AIPIFY_TRUST_ACCELERATION_ADOPTION_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Trust Acceleration & Adoption Engine — Phase ${P.phase}

## Purpose

Increase user trust, accelerate adoption, and transform occasional use into daily reliance.

## Route

\`${P.route}\` (Companion Center → Trust & Adoption)

## Core principle

Trust is earned through repeated positive experiences. The goal is reliance, not usage.

## Helpers

\`_atae_*\` · \`_ataebp288_*\`
`,
);

write(
  path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
  `# Implementation Blueprint — Phase ${P.phase} Trust Acceleration & Adoption Engine

Route: \`${P.route}\`
Migration: \`${P.migration}\`
`,
);

write(
  path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
  `# Trust Acceleration & Adoption — FAQ (Phase ${P.phase})

## What is the Adoption Center?

Tracks trust building, value moments, and adoption progression toward daily reliance.

## Where is it?

Companion Center → Trust & Adoption at \`${P.route}\`.

## Does Aipify manipulate users into dependence?

No. Adoption occurs naturally through demonstrated value — never manipulation.
`,
);

patchI18n();
patchPermissions();
patchNav();
patchTenant();
patchIlm();
patchArchitecture();
console.log(`Phase ${P.phase} complete`);
