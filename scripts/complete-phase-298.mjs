#!/usr/bin/env node
/** ABOS Phase 298 — Aipify Automation Control Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 298,
  migration: "20261422600000_aipify_automation_control_center_engine_phase298.sql",
  slug: "aipify-automation-control-center-engine",
  docSlug: "AIPIFY_AUTOMATION_CONTROL_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase298-aipify-automation-control-center-engine.txt",
  route: "/app/operations/automation-control",
  permKeys: [
    "automation_control.view",
    "automation_control.manage",
    "automation_control.record",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Automation Control Center",
    subtitle:
      "Understand what Aipify is doing, why it is doing it, and how automations contribute to business outcomes.",
    loading: "Loading Automation Control Center…",
    corePrinciple: "Core principle",
    operationsLink: "Operations Center →",
    adaptiveAutomationLink: "Adaptive Automation →",
    sections: {
      executiveOverview: "Executive overview",
      aipifyInsights: "Aipify Insights",
      businessAutomations: "Business automations",
      selfHealingCenter: "Self-healing center",
      activityFeed: "Automation activity feed",
      recommendations: "Recommendations",
      analytics: "Automation analytics",
    },
    metrics: {
      activeAutomations: "Active automations",
      needsAttention: "Needs attention",
      timeSaved: "Estimated time saved (month)",
      selfHealingSaved: "Self-healing time saved",
      avgHealth: "Average health score",
      reviewsOverdue: "Reviews overdue",
    },
    classifications: {
      customer: "Customer automations",
      operations: "Operations automations",
      financial: "Financial automations",
      executive: "Executive automations",
      self_healing: "Self-healing automations",
    },
    healthBands: {
      excellent: "Excellent",
      good: "Good",
      attention_needed: "Attention needed",
      critical: "Critical",
    },
    reviewStates: {
      recently_reviewed: "Recently reviewed",
      review_recommended: "Review recommended",
      review_overdue: "Review overdue",
    },
    activityLevels: {
      informational: "Informational",
      success: "Success",
      warning: "Warning",
      critical: "Critical",
    },
    detail: {
      overview: "Overview",
      performance: "Performance",
      businessValue: "Business value",
      explanation: "Aipify explanation",
      ownership: "Ownership",
      timeline: "Execution timeline",
      successRate: "Success rate",
      executions: "Executions",
      avgRuntime: "Avg. runtime",
      failures: "Failures",
      owner: "Owner",
      department: "Department",
      escalation: "Escalation",
      approvalStatus: "Approval status",
      markReviewed: "Mark as reviewed",
      close: "Close",
      whatDoesThisDo: "What does this do?",
    },
    dismiss: "Dismiss",
    emptyRecommendations: "No open recommendations right now.",
    privacyNote: "Privacy",
    timeSavedEstimate: "Estimated time saved this month",
    selfHealingEstimate: "Self-healing disruption prevented",
    settingsLink: "Automation Control Center",
  };
}

function patchI18n() {
  const noBlock = {
    ...i18nBlock(),
    title: "Automatiseringskontrollsenter",
    settingsLink: "Automatiseringskontrollsenter",
  };
  const svBlock = {
    ...i18nBlock(),
    title: "Automationskontrollcenter",
    settingsLink: "Automationskontrollcenter",
  };
  const daBlock = {
    ...i18nBlock(),
    title: "Automationskontrolcenter",
    settingsLink: "Automationskontrolcenter",
  };

  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", noBlock],
    ["sv", svBlock],
    ["da", daBlock],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.automationControlCenter = block;
    data.nav = data.nav ?? {};
    data.nav.automationControlCenterEngine = block.settingsLink;
    data.operationsCenter = data.operationsCenter ?? {};
    data.operationsCenter.automationControlLink = block.settingsLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace(
        '"companion_orchestration.view",',
        `"companion_orchestration.view",\n    "${perm}",`,
      );
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("automationControlCenterEngine")) {
    c = c.replace('| "adaptiveAutomation"', '| "automationControlCenterEngine"\n  | "adaptiveAutomation"');
    c = c.replace(
      '{ id: "adaptiveAutomation", href: "/app/automations", labelKey: "customerApp.nav.adaptiveAutomation" },',
      `{
    id: "automationControlCenterEngine",
    href: "/app/operations/automation-control",
    labelKey: "customerApp.nav.automationControlCenterEngine",
  },
  { id: "adaptiveAutomation", href: "/app/automations", labelKey: "customerApp.nav.adaptiveAutomation" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/automations") ||',
      'if (pathname.startsWith("/app/operations/automation-control")) return "automationControlCenterEngine";\n  if (pathname.startsWith("/app/automations") ||',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  let c = fs.readFileSync(file, "utf8");
  const line = 'export * from "./aipify-automation-control-center-engine";';
  if (!c.includes(line)) {
    c = `${c.trim()}\n${line}\n`;
    fs.writeFileSync(file, c);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Aipify Automation Control Center Engine
Route: ${P.route}
Module: Automation Control Center
Location: Operations Center → Automation Control Center

Core principle: Automation should feel trustworthy, understandable, and valuable — not invisible.
Sections: Executive Overview · Aipify Insights · Business Automations · Self-Healing · Activity Feed · Recommendations · Analytics
Language: Always Aipify — never AI or AI Assistant in customer-facing automation copy.
Helpers: _acc_* · _accbp298_*
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";
export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE =
  "Automation should not feel invisible — it should feel trustworthy, understandable, and valuable.";
`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`implementation-blueprint-phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase297-vocabulary";',
      `export * from "./implementation-blueprint-phase297-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE297_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase297-aipify-companion-orchestration-engine.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE297_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase297-aipify-companion-orchestration-engine.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Automation Control Center Engine (Phase ${P.phase}):** See [AIPIFY_AUTOMATION_CONTROL_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_AUTOMATION_CONTROL_CENTER_ENGINE_PHASE${P.phase}.md) — Automation Control Center at Operations Center → Automation Control Center. Executive overview, Aipify Insights, classified automations, self-healing visibility, activity feed, recommendations, analytics, detail panel with business value and review cycles. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_acc_*\`, \`_accbp298_*\`. APIs at \`/api/automation-control/*\`. Permissions \`automation_control.view\`, \`.manage\`, \`.record\`. Extends Adaptive Automation (Phase 53) — does not modify core AAL execution RPCs.`;
  if (!c.includes("Automation Control Center Engine")) {
    c = `${c}\n${entry}\n`;
    fs.writeFileSync(file, c);
  }
}

write(
  path.join(ROOT, `AIPIFY_AUTOMATION_CONTROL_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Automation Control Center Engine — Phase ${P.phase}

## Purpose

Transform automations from passive background jobs into an interactive control center where administrators understand what Aipify is doing, why, and how it contributes to business outcomes.

## Route

\`${P.route}\` (Operations Center → Automation Control Center)

## Core principle

Automation should not feel invisible. Automation should feel trustworthy, understandable, and valuable.

## Helpers

\`_acc_*\` · \`_accbp298_*\`
`,
);

write(
  path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
  `# Implementation Blueprint — Phase ${P.phase} Automation Control Center Engine

Route: \`${P.route}\`
Migration: \`${P.migration}\`
`,
);

write(
  path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
  `# Automation Control Center — FAQ (Phase ${P.phase})

## What is the Automation Control Center?

An interactive workspace to understand automation health, business impact, self-healing activity, and Aipify recommendations — not just technical schedules.

## Where is it?

Operations Center → Automation Control Center at \`${P.route}\`.

## Does it use AI branding?

No. Customer-facing copy uses Aipify — never AI or AI Assistant.
`,
);

patchI18n();
patchPermissions();
patchNav();
patchTenant();
patchIlm();
patchArchitecture();
console.log(`Phase ${P.phase} complete`);
