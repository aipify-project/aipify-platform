#!/usr/bin/env node
/** ABOS Phase 319 — Aipify Execution Excellence Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 319,
  migration: "20261424700000_aipify_execution_excellence_center_engine_phase319.sql",
  slug: "aipify-execution-excellence-center-engine",
  docSlug: "AIPIFY_EXECUTION_EXCELLENCE_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase319-aipify-execution-excellence-center.txt",
  route: "/app/executive/execution-excellence",
  permKeys: ["execution_excellence.view", "execution_excellence.manage", "execution_excellence.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Execution Excellence Center",
    subtitle:
      "Bridge strategy and execution — translate priorities, initiatives, and commitments into measurable progress and sustainable outcomes.",
    loading: "Loading Execution Excellence Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Execution philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    capabilityMaturityLink: "Capability Maturity →",
    changeManagementLink: "Change Management →",
    organizationalHealthLink: "Organizational Health →",
    continuousImprovementLink: "Continuous Improvement →",
    goalsLink: "Goals & OKRs →",
    dashboardTitle: "Execution dashboard",
    initiativesTitle: "Strategic initiatives",
    dependenciesTitle: "Dependencies",
    milestonesTitle: "Milestones",
    risksTitle: "Execution risks",
    workflowTitle: "Execution workflow",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive execution view",
    reviewsTitle: "Execution rhythm reviews",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    achieveMilestone: "Mark achieved",
    generateSummary: "Generate execution summary",
    generateReport: "Generate initiative report",
    humansDecide: "Aipify supports execution clarity — leadership owns priorities and outcomes.",
    privacyNote: "Privacy",
    owner: "Owner",
    sponsor: "Sponsor",
    progress: "Progress",
    domains: {
      strategic: "Strategic execution",
      operational: "Operational execution",
      customer: "Customer execution",
      workforce: "Workforce execution",
      governance: "Governance execution",
    },
    healthLabels: {
      exceptional: "Exceptional",
      strong: "Strong",
      stable: "Stable",
      needs_attention: "Needs attention",
      critical: "Critical",
    },
    riskStatuses: {
      on_track: "On track",
      stable: "Stable",
      at_risk: "At risk",
      stalled: "Stalled",
      critical: "Critical",
    },
    workflowStages: {
      objective_defined: "Objective defined",
      ownership_assigned: "Ownership assigned",
      dependencies_identified: "Dependencies identified",
      progress_monitored: "Progress monitored",
      risks_managed: "Risks managed",
      milestones_achieved: "Milestones achieved",
      outcomes_evaluated: "Outcomes evaluated",
      lessons_captured: "Lessons captured",
    },
    dependencyTypes: {
      cross_functional: "Cross-functional",
      resource: "Resource constraint",
      approval: "Approval dependency",
      external: "External blocker",
    },
    milestoneStatuses: {
      planned: "Planned",
      achieved: "Achieved",
      delayed: "Delayed",
      escalated: "Escalated",
    },
    riskTypes: {
      stalled_initiative: "Stalled initiative",
      dependency_overload: "Dependency overload",
      review_avoidance: "Review avoidance",
      resource_shortage: "Resource shortage",
      escalation_pattern: "Escalation pattern",
    },
    reviewTypes: {
      weekly: "Weekly review",
      monthly: "Monthly review",
      quarterly: "Quarterly business review",
      annual: "Annual assessment",
    },
    metrics: {
      inProgress: "Initiatives in progress",
      atRisk: "Objectives at risk",
      momentum: "Execution momentum",
      milestones: "Milestones achieved",
      dependencies: "Open dependencies",
      completion: "Completion trend",
      reviews: "Review consistency",
      confidence: "Leadership confidence",
    },
    executiveFields: {
      capacity: "Execution capacity",
      progress: "Strategic progress",
      confidence: "Initiative confidence",
      focus: "Leadership focus",
    },
    settingsLink: "Execution Excellence",
    executionExcellenceLink: "Execution Excellence",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Gjennomføringsexcellensessenter", settingsLink: "Gjennomføringsexcellence" }],
    ["sv", { ...i18nBlock(), title: "Genomförandeexcellenscenter", settingsLink: "Genomföringsexcellence" }],
    ["da", { ...i18nBlock(), title: "Gennemførelsesexcellenscenter", settingsLink: "Gennemførelsesexcellence" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.executionExcellenceCenter = block;
    data.nav = data.nav ?? {};
    data.nav.executionExcellenceCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.executionExcellenceLink = block.executionExcellenceLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"capability_maturity.view",', `"capability_maturity.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("executionExcellenceCenterEngine")) {
    c = c.replace(
      '| "capabilityMaturityCenterEngine"',
      '| "executionExcellenceCenterEngine"\n  | "capabilityMaturityCenterEngine"',
    );
    c = c.replace(
      '{ id: "capabilityMaturityCenterEngine", href: "/app/executive/capability-maturity", labelKey: "customerApp.nav.capabilityMaturityCenterEngine" },',
      `{ id: "executionExcellenceCenterEngine", href: "/app/executive/execution-excellence", labelKey: "customerApp.nav.executionExcellenceCenterEngine" },
  { id: "capabilityMaturityCenterEngine", href: "/app/executive/capability-maturity", labelKey: "customerApp.nav.capabilityMaturityCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/capability-maturity")) return "capabilityMaturityCenterEngine";',
      'if (pathname.startsWith("/app/executive/execution-excellence")) return "executionExcellenceCenterEngine";\n  if (pathname.startsWith("/app/executive/capability-maturity")) return "capabilityMaturityCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-execution-excellence-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("executionExcellenceLink")) {
    c = c.replace(
      "capabilityMaturityLink: string;",
      "capabilityMaturityLink: string;\n    executionExcellenceLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/capability-maturity" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.capabilityMaturityLink}
        </Link>`,
      `<Link href="/app/executive/capability-maturity" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.capabilityMaturityLink}
        </Link>
        <Link href="/app/executive/execution-excellence" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.executionExcellenceLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("executionExcellenceLink")) {
    p = p.replace(
      'capabilityMaturityLink: t("customerApp.executive.capabilityMaturityLink"),',
      'capabilityMaturityLink: t("customerApp.executive.capabilityMaturityLink"),\n        executionExcellenceLink: t("customerApp.executive.executionExcellenceLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Execution Excellence Center\nRoute: ${P.route}\nCore: Most organizations struggle because execution is inconsistent.\nHelpers: _eec_* · _eecbp319_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Most organizations do not struggle because of poor ideas. They struggle because execution is inconsistent.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase318-vocabulary";',
      `export * from "./implementation-blueprint-phase318-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE318_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase318-aipify-capability-maturity-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE318_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase318-aipify-capability-maturity-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Execution Excellence Center Engine (Phase ${P.phase}):** See [AIPIFY_EXECUTION_EXCELLENCE_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_EXECUTION_EXCELLENCE_CENTER_ENGINE_PHASE${P.phase}.md) — Execution Excellence Center at Executive Center → Execution Excellence. Initiative tracking, dependency management, milestones, execution risks, and executive execution view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_eec_*\`, \`_eecbp319_*\`. APIs at \`/api/execution-excellence/*\`. Cross-links executive centers — does not modify their RPCs.`;
  if (!c.includes("Execution Excellence Center Engine (Phase 319)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_EXECUTION_EXCELLENCE_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Execution Excellence Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
