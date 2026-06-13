#!/usr/bin/env node
/** ABOS Phase 287 — Aipify First Day Experience Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 287,
  migration: "20261421500000_aipify_first_day_experience_engine_phase287.sql",
  slug: "aipify-first-day-experience-engine",
  docSlug: "AIPIFY_FIRST_DAY_EXPERIENCE_ENGINE",
  ilmFile: "implementation-blueprint-phase287-aipify-first-day-experience-engine.txt",
  route: "/app/onboarding/first-day-experience",
  permKeys: ["first_day.view", "first_day.manage", "first_day.complete"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "First Day Experience",
    subtitle:
      "An exceptional first-day journey that demonstrates value, builds trust, and guides successful adoption in the first 15 minutes.",
    loading: "Loading First Day Experience…",
    corePrinciple: "Core principle",
    currentStep: "Journey step",
    advanceStep: "Go to step",
    advancing: "Advancing…",
    welcomeTitle: "Welcome",
    discoveryTitle: "Discovery summary",
    valueMomentsTitle: "Immediate value moments",
    capabilityTitle: "Capability tour",
    permissionTitle: "Permission review",
    personalizationTitle: "Personalization",
    firstSuccessTitle: "First success",
    readinessTitle: "Readiness report",
    recommendationsTitle: "First day recommendations",
    confidenceTitle: "Confidence messaging",
    auditTitle: "First day audit trail",
    noAudit: "No first-day events recorded yet.",
    completeTask: "Complete first approved task",
    completing: "Completing…",
    savePersonalization: "Save preferences",
    trustScore: "Trust score",
    onboardingLink: "Onboarding Center →",
    aipifyInstallLink: "Aipify Install →",
    privacyNote: "Warm, transparent onboarding — never overstate capability.",
    steps: {
      welcome: "Welcome",
      discoverySummary: "Discovery Summary",
      valueMoments: "Value Moments",
      capabilityTour: "Capability Tour",
      permissionReview: "Permission Review",
      personalization: "Personalization",
      firstSuccess: "First Success",
      readinessReport: "Readiness Report",
    },
    adoptionStages: {
      observer: "Observer",
      assistant: "Assistant",
      coordinator: "Coordinator",
      actionCompanion: "Action Companion",
      trustedCompanion: "Trusted Companion",
    },
    settingsLink: "First Day Experience",
  };
}

function patchI18n() {
  const noBlock = {
    ...i18nBlock(),
    title: "Første dag-opplevelse",
    loading: "Laster første dag-opplevelse…",
    onboardingLink: "Onboarding-senter →",
    settingsLink: "Første dag-opplevelse",
  };
  const svBlock = { ...i18nBlock(), title: "Första dagen-upplevelse", settingsLink: "Första dagen-upplevelse" };
  const daBlock = { ...i18nBlock(), title: "Første dag-oplevelse", settingsLink: "Første dag-oplevelse" };

  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", noBlock],
    ["sv", svBlock],
    ["da", daBlock],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.firstDayExperience = block;
    data.customerOnboardingEngine = data.customerOnboardingEngine ?? {};
    data.customerOnboardingEngine.firstDayExperience = block.settingsLink;
    data.settings = data.settings ?? {};
    data.settings.links = data.settings.links ?? {};
    data.settings.links.firstDayExperience = block.settingsLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"business_discovery.view",', `"business_discovery.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchOnboarding() {
  const panel = path.join(
    ROOT,
    "components/app/customer-onboarding-engine/CustomerOnboardingEngineDashboardPanel.tsx"
  );
  let p = fs.readFileSync(panel, "utf8");
  if (!p.includes("/app/onboarding/first-day-experience")) {
    p = p.replace(
      '<Link href="/app/onboarding/aipify-install"',
      '<Link href="/app/onboarding/first-day-experience" className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm text-amber-900">\n          {labels.firstDayExperience ?? "First Day Experience"}\n        </Link>\n        <Link href="/app/onboarding/aipify-install"',
    );
    p = p.replace("aipifyInstall?: string;", "aipifyInstall?: string;\n  firstDayExperience?: string;");
    fs.writeFileSync(panel, p);
  }

  const page = path.join(ROOT, "app/app/customer-onboarding-engine/page.tsx");
  let pg = fs.readFileSync(page, "utf8");
  if (!pg.includes("firstDayExperience")) {
    pg = pg.replace(
      'aipifyInstall: t(`${p}.aipifyInstall`),',
      'aipifyInstall: t(`${p}.aipifyInstall`),\n          firstDayExperience: t(`${p}.firstDayExperience`),',
    );
    fs.writeFileSync(page, pg);
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  let c = fs.readFileSync(file, "utf8");
  const line = 'export * from "./aipify-first-day-experience-engine";';
  if (!c.includes(line)) {
    c = `${c.trim()}\n${line}\n`;
    fs.writeFileSync(file, c);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Aipify First Day Experience Engine
Route: ${P.route}
Module: First Day Experience Center
Location: Onboarding Center → First Day Experience

Core principle: The first 15 minutes determine whether Aipify becomes essential.
Journey: 8 steps — Welcome · Discovery · Value · Capability · Permission · Personalization · First Success · Readiness
Adoption stages: Observer · Assistant · Coordinator · Action Companion · Trusted Companion
Confidence: Never overstate capability.
Helpers: _afde_* · _afdebp287_*
Extends business discovery Phase 286 and customer onboarding.
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";
export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE =
  "The first 15 minutes determine whether Aipify becomes essential.";
`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`implementation-blueprint-phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase286-vocabulary";',
      `export * from "./implementation-blueprint-phase286-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE286_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase286-aipify-install-business-discovery-engine.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE286_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase286-aipify-install-business-discovery-engine.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify First Day Experience Engine (Phase 287):** See [AIPIFY_FIRST_DAY_EXPERIENCE_ENGINE_PHASE287.md](./AIPIFY_FIRST_DAY_EXPERIENCE_ENGINE_PHASE287.md) — First Day Experience Center at Onboarding Center → First Day Experience. 8-step journey, immediate value moments, confidence messaging, personalization, first success task, readiness report, adoption stages. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_afde_*\`, \`_afdebp287_*\`. APIs at \`/api/first-day-experience/*\`. Permissions \`first_day.view\`, \`first_day.manage\`, \`first_day.complete\`. Extends business discovery Phase 286.`;
  if (!c.includes("Phase 287")) {
    c = `${c}\n${entry}\n`;
    fs.writeFileSync(file, c);
  }
}

write(
  path.join(ROOT, `AIPIFY_FIRST_DAY_EXPERIENCE_ENGINE_PHASE${P.phase}.md`),
  `# Aipify First Day Experience Engine — Phase ${P.phase}

## Purpose

Deliver an exceptional first-day experience that demonstrates value, builds trust, and guides adoption.

## Route

\`${P.route}\` (Onboarding Center → First Day Experience)

## Core principle

The first 15 minutes determine whether Aipify becomes essential.

## Journey steps

Welcome · Discovery Summary · Value Moments · Capability Tour · Permission Review · Personalization · First Success · Readiness Report

## Helpers

\`_afde_*\` · \`_afdebp287_*\`
`,
);

write(
  path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
  `# Implementation Blueprint — Phase ${P.phase} Aipify First Day Experience Engine

Route: \`${P.route}\`
Migration: \`${P.migration}\`
`,
);

write(
  path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
  `# Aipify First Day Experience — FAQ (Phase ${P.phase})

## What is the First Day Experience?

A guided 8-step onboarding journey that proves Aipify's value in the first 15 minutes.

## Where is it?

Onboarding Center → First Day Experience at \`${P.route}\`.

## What happens on day one?

Welcome, discovery summary, immediate insights, capability tour, permission review, personalization, first approved task, and readiness report.

## Does Aipify overstate capabilities?

No. Confidence messaging is honest — never overstate capability.
`,
);

patchI18n();
patchPermissions();
patchOnboarding();
patchTenant();
patchIlm();
patchArchitecture();
console.log(`Phase ${P.phase} complete`);
