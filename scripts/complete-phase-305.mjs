#!/usr/bin/env node
/** ABOS Phase 305 — Aipify Continuous Improvement Center (user Phase 304) */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 305,
  migration: "20261423300000_aipify_continuous_improvement_center_engine_phase305.sql",
  slug: "aipify-continuous-improvement-center-engine",
  docSlug: "AIPIFY_CONTINUOUS_IMPROVEMENT_CENTER",
  ilmFile: "implementation-blueprint-phase305-aipify-continuous-improvement-center.txt",
  route: "/app/executive/continuous-improvement",
  permKeys: ["improvement_center.view", "improvement_center.manage", "improvement_center.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Continuous Improvement Center",
    subtitle:
      "Identify improvement opportunities across workflows, support, automations, and executive processes — collaborative, never punitive.",
    loading: "Loading Continuous Improvement Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Improvement philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    decisionSupportLink: "Decision Support →",
    strategicIntelligenceLink: "Strategic Intelligence →",
    ciEngineLink: "Continuous Improvement Engine →",
    enterpriseImprovementLink: "Enterprise improvement →",
    dashboardTitle: "Improvement dashboard",
    opportunitiesTitle: "Improvement opportunities",
    initiativesTitle: "Improvement initiatives",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    lessonsTitle: "Lessons learned",
    workflowTitle: "Improvement workflow",
    emptySection: "No items in this section yet.",
    domain: "Domain",
    impact: "Impact",
    effort: "Effort",
    frequency: "Frequency",
    priorityMatrix: "Priority",
    owner: "Owner",
    teams: "Teams",
    status: "Status",
    dismiss: "Dismiss",
    accept: "Accept",
    approve: "Approve",
    complete: "Mark complete",
    archive: "Archive",
    submitOpportunity: "Submit opportunity",
    opportunityTitle: "Opportunity title",
    opportunitySummary: "Describe the improvement opportunity",
    captureLesson: "Capture lesson",
    lessonTitle: "Lesson title",
    lessonContent: "What improved, failed, or was unexpected",
    humansDecide: "Humans approve every improvement — Aipify surfaces opportunities, not mandates.",
    privacyNote: "Privacy",
    continuousImprovementLink: "Continuous Improvement",
    domains: {
      operational: "Operational improvements",
      customer_experience: "Customer experience improvements",
      workforce: "Workforce improvements",
      automation: "Automation improvements",
      executive: "Executive improvements",
    },
    priorityMatrixLabels: {
      quick_wins: "Quick wins",
      strategic_improvements: "Strategic improvements",
      monitor: "Monitor",
      future_consideration: "Future consideration",
    },
    statuses: {
      proposed: "Proposed",
      under_review: "Under review",
      approved: "Approved",
      in_progress: "In progress",
      completed: "Completed",
      archived: "Archived",
    },
    outcomeTypes: {
      improved: "What improved",
      failed: "What failed",
      unexpected: "Unexpected outcome",
    },
    metrics: {
      opportunities: "Opportunities identified",
      implemented: "Improvements implemented",
      impactHours: "Estimated impact (hours)",
      participation: "Department participation",
      activeInitiatives: "Active initiatives",
      recommendations: "Open recommendations",
      satisfaction: "Employee satisfaction",
      trust: "Executive trust",
    },
    settingsLink: "Continuous Improvement",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Kontinuerlig forbedringssenter", settingsLink: "Kontinuerlig forbedring" }],
    ["sv", { ...i18nBlock(), title: "Center för kontinuerlig förbättring", settingsLink: "Kontinuerlig förbättring" }],
    ["da", { ...i18nBlock(), title: "Center for løbende forbedring", settingsLink: "Løbende forbedring" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.continuousImprovementCenter = block;
    data.nav = data.nav ?? {};
    data.nav.continuousImprovementCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.continuousImprovementLink = block.continuousImprovementLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_memory_center.view",', `"org_memory_center.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("continuousImprovementCenterEngine")) {
    c = c.replace(
      '| "executiveStrategicIntelligenceEngine"',
      '| "continuousImprovementCenterEngine"\n  | "executiveStrategicIntelligenceEngine"',
    );
    c = c.replace(
      '{ id: "executiveStrategicIntelligenceEngine", href: "/app/executive/strategic-intelligence", labelKey: "customerApp.nav.executiveStrategicIntelligenceEngine" },',
      `{ id: "continuousImprovementCenterEngine", href: "/app/executive/continuous-improvement", labelKey: "customerApp.nav.continuousImprovementCenterEngine" },
  { id: "executiveStrategicIntelligenceEngine", href: "/app/executive/strategic-intelligence", labelKey: "customerApp.nav.executiveStrategicIntelligenceEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/strategic-intelligence")) return "executiveStrategicIntelligenceEngine";',
      'if (pathname.startsWith("/app/executive/continuous-improvement")) return "continuousImprovementCenterEngine";\n  if (pathname.startsWith("/app/executive/strategic-intelligence")) return "executiveStrategicIntelligenceEngine";',
    );
    fs.writeFileSync(file, c);
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-continuous-improvement-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("continuousImprovementLink")) {
    c = c.replace(
      "strategicIntelligenceLink: string;",
      "strategicIntelligenceLink: string;\n    continuousImprovementLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/strategic-intelligence" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.strategicIntelligenceLink}
        </Link>`,
      `<Link href="/app/executive/strategic-intelligence" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.strategicIntelligenceLink}
        </Link>
        <Link href="/app/executive/continuous-improvement" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.continuousImprovementLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("continuousImprovementLink")) {
    p = p.replace(
      'strategicIntelligenceLink: t("customerApp.executive.strategicIntelligenceLink"),',
      'strategicIntelligenceLink: t("customerApp.executive.strategicIntelligenceLink"),\n        continuousImprovementLink: t("customerApp.executive.continuousImprovementLink"),',
    );
    fs.writeFileSync(page, p);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Continuous Improvement Center\nRoute: ${P.route}\nCore: Organizations should become better over time.\nHelpers: _cic_* · _cicbp305_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Organizations should become better over time.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase304-vocabulary";',
      `export * from "./implementation-blueprint-phase304-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE304_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase304-aipify-organizational-memory-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE304_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase304-aipify-organizational-memory-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Continuous Improvement Center (Phase ${P.phase}):** See [AIPIFY_CONTINUOUS_IMPROVEMENT_CENTER_PHASE${P.phase}.md](./AIPIFY_CONTINUOUS_IMPROVEMENT_CENTER_PHASE${P.phase}.md) — Continuous Improvement Center at Executive Center → Continuous Improvement. Opportunity detection, prioritization matrix, initiatives, lessons learned, and collaborative recommendations. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_cic_*\`, \`_cicbp305_*\`. APIs at \`/api/continuous-improvement/*\`. Cross-links CIE and enterprise improvement — does not modify their RPCs.`;
  if (!c.includes("Continuous Improvement Center (Phase")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_CONTINUOUS_IMPROVEMENT_CENTER_PHASE${P.phase}.md`),
  `# Aipify Continuous Improvement Center — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
);
write(
  path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
  `# Blueprint Phase ${P.phase}\n`,
);
write(
  path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
  `# FAQ Phase ${P.phase}\n`,
);

patchI18n();
patchPermissions();
patchNav();
patchTenant();
patchExecutiveDashboard();
patchIlm();
patchArchitecture();
console.log(`Phase ${P.phase} complete`);
