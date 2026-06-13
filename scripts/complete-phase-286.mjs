#!/usr/bin/env node
/** ABOS Phase 286 — Aipify Install & Business Discovery Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 286,
  migration: "20261421400000_aipify_install_business_discovery_engine_phase286.sql",
  slug: "aipify-install-business-discovery-engine",
  docSlug: "AIPIFY_INSTALL_BUSINESS_DISCOVERY_ENGINE",
  ilmFile: "implementation-blueprint-phase286-aipify-install-business-discovery-engine.txt",
  route: "/app/onboarding/aipify-install",
  permKeys: ["business_discovery.view", "business_discovery.manage", "business_discovery.run"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Aipify Install",
    subtitle:
      "Allow Aipify to understand your business through guided, permission-based discovery — not manual configuration.",
    loading: "Loading Aipify Install…",
    corePrinciple: "Core principle",
    philosophy: "Install philosophy",
    currentPhase: "Discovery phase",
    runPhase: "Run phase",
    running: "Discovering…",
    introductionTitle: "Aipify introduction",
    systemsTitle: "Systems discovered",
    knowledgeTitle: "Knowledge sources",
    workflowsTitle: "Workflows mapped",
    actionsTitle: "Actions available",
    peopleTitle: "Teams identified",
    readinessTitle: "Readiness assessment",
    recommendationsTitle: "Install recommendations",
    auditTitle: "Discovery audit trail",
    noAudit: "No discovery events recorded yet.",
    overallReadiness: "Overall readiness",
    confidence: "Confidence",
    installEngineLink: "Install Engine →",
    modernInstallLink: "Modern Install →",
    onboardingLink: "Onboarding Center →",
    privacyNote: "Metadata only — discovery respects explicit permissions and data minimization.",
    phases: {
      organizationProfile: "Organization Profile",
      systemDiscovery: "System Discovery",
      knowledgeDiscovery: "Knowledge Discovery",
      workflowDiscovery: "Workflow Discovery",
      actionDiscovery: "Action Discovery",
      peopleDiscovery: "People Discovery",
      readinessAssessment: "Readiness Assessment",
    },
    readinessStates: {
      notReady: "Not Ready",
      learning: "Learning",
      partiallyReady: "Partially Ready",
      readyToAssist: "Ready to Assist",
      readyToExecute: "Ready to Execute",
    },
    settingsLink: "Aipify Install",
  };
}

function patchI18n() {
  const noBlock = {
    ...i18nBlock(),
    title: "Aipify Install",
    subtitle:
      "La Aipify forstå virksomheten din gjennom veiledet, tillatelsesbasert oppdagelse — ikke manuell konfigurasjon.",
    loading: "Laster Aipify Install…",
    onboardingLink: "Onboarding-senter →",
    runPhase: "Kjør fase",
    settingsLink: "Aipify Install",
  };
  const svBlock = { ...i18nBlock(), onboardingLink: "Onboarding-center →", settingsLink: "Aipify Install" };
  const daBlock = { ...i18nBlock(), onboardingLink: "Onboarding-center →", settingsLink: "Aipify Install" };

  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", noBlock],
    ["sv", svBlock],
    ["da", daBlock],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.aipifyInstallDiscovery = block;
    data.customerOnboardingEngine = data.customerOnboardingEngine ?? {};
    data.customerOnboardingEngine.aipifyInstall = block.settingsLink;
    data.settings = data.settings ?? {};
    data.settings.links = data.settings.links ?? {};
    data.settings.links.aipifyInstall = block.settingsLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"package_access.view",', `"package_access.view",\n    "${perm}",`);
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
  if (!p.includes("/app/onboarding/aipify-install")) {
    p = p.replace(
      '<Link href="/app/aipify-install-engine"',
      '<Link href="/app/onboarding/aipify-install" className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm text-indigo-800">\n          {labels.aipifyInstall ?? "Aipify Install"}\n        </Link>\n        <Link href="/app/aipify-install-engine"',
    );
    p = p.replace("installEngine: string;", "installEngine: string;\n  aipifyInstall?: string;");
    fs.writeFileSync(panel, p);
  }

  const page = path.join(ROOT, "app/app/customer-onboarding-engine/page.tsx");
  let pg = fs.readFileSync(page, "utf8");
  if (!pg.includes("aipifyInstall")) {
    pg = pg.replace(
      'installEngine: t(`${p}.installEngine`),',
      'installEngine: t(`${p}.installEngine`),\n          aipifyInstall: t(`${p}.aipifyInstall`),',
    );
    fs.writeFileSync(page, pg);
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  let c = fs.readFileSync(file, "utf8");
  const line = 'export * from "./aipify-install-business-discovery-engine";';
  if (!c.includes(line)) {
    c = `${c.trim()}\n${line}\n`;
    fs.writeFileSync(file, c);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Aipify Install & Business Discovery Engine
Route: ${P.route}
Module: Aipify Install
Location: Onboarding Center → Aipify Install

Core principle: Do not force organizations to teach Aipify everything manually.
Philosophy: "I will understand how your business works."
Discovery phases: 1 Profile · 2 Systems · 3 Knowledge · 4 Workflows · 5 Actions · 6 People · 7 Readiness
Readiness: Not Ready · Learning · Partially Ready · Ready to Assist · Ready to Execute
Continuous learning: Discovery is not one-time — it continues after installation.
Governance: Explicit permissions, data minimization, audit logging.
Helpers: _abde_* · _abdebp286_*
Extends Install Engine A.22 and Phase 29 AI Install & Discovery.
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";
export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_INSTALL_PHILOSOPHY =
  "I will understand how your business works.";
export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE =
  "Do not force organizations to teach Aipify everything manually.";
`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`implementation-blueprint-phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase285-vocabulary";',
      `export * from "./implementation-blueprint-phase285-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE285_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase285-pilot-learning-customer-zero-engine.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE285_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase285-pilot-learning-customer-zero-engine.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Install & Business Discovery Engine (Phase 286):** See [AIPIFY_INSTALL_BUSINESS_DISCOVERY_ENGINE_PHASE286.md](./AIPIFY_INSTALL_BUSINESS_DISCOVERY_ENGINE_PHASE286.md) — Guided permission-based onboarding discovery across 7 phases (profile, systems, knowledge, workflows, actions, people, readiness). Onboarding Center → Aipify Install at \`${P.route}\`. Confidence engine, continuous learning, audit trail. Migration \`${P.migration}\`. Helpers \`_abde_*\`, \`_abdebp286_*\`. APIs at \`/api/business-discovery/*\`. Permissions \`business_discovery.view\`, \`business_discovery.manage\`, \`business_discovery.run\`. Extends Install Engine A.22 and Phase 29 AI Install & Discovery.`;
  if (!c.includes("Phase 286")) {
    c = `${c}\n${entry}\n`;
    fs.writeFileSync(file, c);
  }
}

write(
  path.join(ROOT, `AIPIFY_INSTALL_BUSINESS_DISCOVERY_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Install & Business Discovery Engine — Phase ${P.phase}

## Purpose

Enable Aipify to automatically understand a new organization within minutes through guided, permission-based discovery.

## Route

\`${P.route}\` (Onboarding Center → Aipify Install)

## Core principle

Do not force organizations to teach Aipify everything manually. Aipify learns through approved access.

## Discovery phases

1. Organization Profile · 2. System Discovery · 3. Knowledge Discovery · 4. Workflow Discovery · 5. Action Discovery · 6. People Discovery · 7. Readiness Assessment

## Helpers

\`_abde_*\` · \`_abdebp286_*\`

Extends Install Engine A.22 and Phase 29.
`,
);

write(
  path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
  `# Implementation Blueprint — Phase ${P.phase} Aipify Install & Business Discovery Engine

Route: \`${P.route}\`
Migration: \`${P.migration}\`
`,
);

write(
  path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
  `# Aipify Install & Business Discovery — FAQ (Phase ${P.phase})

## What is Aipify Install?

Guided business discovery that helps Aipify understand your organization automatically — not manual configuration.

## Where is it?

Onboarding Center → Aipify Install at \`${P.route}\`.

## What does discovery cover?

Systems, knowledge, workflows, actions, teams, and readiness for Support, Admin, and Executive Companions.

## Is discovery one-time?

No. Discovery is continuous — Aipify keeps learning after installation with explicit permissions.
`,
);

patchI18n();
patchPermissions();
patchOnboarding();
patchTenant();
patchIlm();
patchArchitecture();
console.log(`Phase ${P.phase} complete`);
