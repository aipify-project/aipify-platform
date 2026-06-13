#!/usr/bin/env node
/** ABOS Phase 296 — Aipify Companion Financial Guardrails Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 296,
  migration: "20261422400000_aipify_companion_financial_guardrails_engine_phase296.sql",
  slug: "aipify-companion-financial-guardrails-engine",
  docSlug: "AIPIFY_COMPANION_FINANCIAL_GUARDRAILS_ENGINE",
  ilmFile: "implementation-blueprint-phase296-aipify-companion-financial-guardrails-engine.txt",
  route: "/app/governance/financial-guardrails",
  permKeys: [
    "financial_guardrail.view",
    "financial_guardrail.manage",
    "financial_guardrail.record",
    "financial_guardrail.delete",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Financial Guardrails",
    subtitle:
      "Enforce budgets, spending limits, and approval thresholds so Aipify participates responsibly in purchasing and financial coordination.",
    loading: "Loading Financial Guardrails Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Financial philosophy",
    visionTitle: "Vision",
    activeTitle: "Spending profiles",
    recommendationsTitle: "Spending recommendations",
    alertsTitle: "Budget alerts",
    expendituresTitle: "Recent expenditures",
    trendsTitle: "Spending activity trends",
    utilizationTitle: "Budget utilization",
    highValueTitle: "High-value transactions",
    exceptionsTitle: "Policy exceptions",
    effectivenessTitle: "Guardrail effectiveness",
    accept: "Apply recommendation",
    dismiss: "Dismiss",
    suspend: "Suspend profile",
    delete: "Delete profile",
    privacyNote: "Spending metadata only — no payment instruments or raw transaction records stored.",
    approvalsLink: "Approval Center →",
    approvalProfilesLink: "Approval Profiles →",
    governanceLink: "Governance Center →",
    spendingCategories: {
      personal: "Personal spending",
      business: "Business spending",
      enterprise: "Enterprise spending",
    },
    limitTypes: {
      per_transaction: "Per transaction",
      monthly: "Monthly limit",
      team: "Team limit",
    },
    approvalThresholds: {
      level_1: "Level 1 — No approval required",
      level_2: "Level 2 — User confirmation",
      level_3: "Level 3 — Manager approval",
      level_4: "Level 4 — Executive approval",
    },
    settingsLink: "Financial Guardrails",
  };
}

function patchI18n() {
  const noBlock = { ...i18nBlock(), title: "Finansielle sperrer", settingsLink: "Finansielle sperrer" };
  const svBlock = { ...i18nBlock(), title: "Finansiella skyddsräcken", settingsLink: "Finansiella skyddsräcken" };
  const daBlock = { ...i18nBlock(), title: "Finansielle sikkerhedsgrænser", settingsLink: "Finansielle sikkerhedsgrænser" };

  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", noBlock],
    ["sv", svBlock],
    ["da", daBlock],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.financialGuardrails = block;
    data.nav = data.nav ?? {};
    data.nav.financialGuardrailsEngine = block.settingsLink;
    data.governance = data.governance ?? {};
    data.governance.financialGuardrailsLink = block.settingsLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"approval_profile.view",', `"approval_profile.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("financialGuardrailsEngine")) {
    c = c.replace(
      '| "approvalProfilesEngine"',
      '| "financialGuardrailsEngine"\n  | "approvalProfilesEngine"',
    );
    c = c.replace(
      `{
    id: "approvalProfilesEngine",
    href: "/app/governance/approval-profiles",
    labelKey: "customerApp.nav.approvalProfilesEngine",
  },`,
      `{
    id: "financialGuardrailsEngine",
    href: "/app/governance/financial-guardrails",
    labelKey: "customerApp.nav.financialGuardrailsEngine",
  },
  {
    id: "approvalProfilesEngine",
    href: "/app/governance/approval-profiles",
    labelKey: "customerApp.nav.approvalProfilesEngine",
  },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/governance/approval-profiles")) return "approvalProfilesEngine";',
      'if (pathname.startsWith("/app/governance/financial-guardrails")) return "financialGuardrailsEngine";\n  if (pathname.startsWith("/app/governance/approval-profiles")) return "approvalProfilesEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  let c = fs.readFileSync(file, "utf8");
  const line = 'export * from "./aipify-companion-financial-guardrails-engine";';
  if (!c.includes(line)) {
    c = `${c.trim()}\n${line}\n`;
    fs.writeFileSync(file, c);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Aipify Companion Financial Guardrails Engine
Route: ${P.route}
Module: Financial Guardrails Center
Location: Governance Center → Financial Guardrails

Core principle: Help people spend wisely, never recklessly.
Philosophy: Permission within established boundaries — not open-ended spending.
Categories: Personal · Business · Enterprise
Limits: Per transaction · Monthly · Team
Thresholds: Level 1–4 approval pathways
RBAC, real-time validation, revocation, audit.
Helpers: _cfg_* · _cfgbp296_*
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";
export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE =
  "Help people spend wisely, never recklessly — convenience must never compromise financial control.";
`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`implementation-blueprint-phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase295-vocabulary";',
      `export * from "./implementation-blueprint-phase295-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE295_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase295-aipify-companion-approval-profiles-engine.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE295_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase295-aipify-companion-approval-profiles-engine.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Companion Financial Guardrails Engine (Phase 296):** See [AIPIFY_COMPANION_FINANCIAL_GUARDRAILS_ENGINE_PHASE296.md](./AIPIFY_COMPANION_FINANCIAL_GUARDRAILS_ENGINE_PHASE296.md) — Financial Guardrails Center at Governance Center → Financial Guardrails. Budgets, spending limits, approval thresholds, budget alerts, and guardrail effectiveness. Integrates conceptually with Trust & Action and Approval Profiles — does not modify core approval RPCs. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_cfg_*\`, \`_cfgbp296_*\`. APIs at \`/api/financial-guardrails/*\`. Permissions \`financial_guardrail.view\`, \`.manage\`, \`.record\`, \`.delete\`.`;
  if (!c.includes("Phase 296")) {
    c = `${c}\n${entry}\n`;
    fs.writeFileSync(file, c);
  }
}

write(
  path.join(ROOT, `AIPIFY_COMPANION_FINANCIAL_GUARDRAILS_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Companion Financial Guardrails Engine — Phase ${P.phase}

## Purpose

Enforce budgets, spending limits, and approval thresholds for responsible purchasing and financial coordination.

## Route

\`${P.route}\` (Governance Center → Financial Guardrails)

## Core principle

Help people spend wisely, never recklessly.

## Helpers

\`_cfg_*\` · \`_cfgbp296_*\`
`,
);

write(
  path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
  `# Implementation Blueprint — Phase ${P.phase} Companion Financial Guardrails Engine

Route: \`${P.route}\`
Migration: \`${P.migration}\`
`,
);

write(
  path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
  `# Companion Financial Guardrails — FAQ (Phase ${P.phase})

## What are Financial Guardrails?

Predefined budgets, spending limits, and approval thresholds that govern how Aipify participates in purchasing and booking.

## Where is it?

Governance Center → Financial Guardrails at \`${P.route}\`.

## Does Aipify store payment data?

No. Guardrails store spending metadata and policy boundaries only.
`,
);

patchI18n();
patchPermissions();
patchNav();
patchTenant();
patchIlm();
patchArchitecture();
console.log(`Phase ${P.phase} complete`);
