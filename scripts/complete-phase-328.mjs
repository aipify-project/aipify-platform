#!/usr/bin/env node
/** ABOS Phase 328 — Aipify Organizational Simplicity Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 328,
  migration: "20261425600000_aipify_organizational_simplicity_center_engine_phase328.sql",
  slug: "aipify-organizational-simplicity-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_SIMPLICITY_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase328-aipify-organizational-simplicity-center.txt",
  route: "/app/executive/organizational-simplicity",
  permKeys: ["org_simplicity.view", "org_simplicity.manage", "org_simplicity.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Simplicity",
    subtitle:
      "Identify unnecessary complexity and help leaders simplify systems, processes, communications, governance structures, and experiences without sacrificing effectiveness.",
    loading: "Loading Simplicity Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Simplicity philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalFocusLink: "Organizational Focus →",
    organizationalAlignmentLink: "Organizational Alignment →",
    executionExcellenceLink: "Execution Excellence →",
    continuousImprovementLink: "Continuous Improvement →",
    dashboardTitle: "Simplicity dashboard",
    complexityTitle: "Complexity detection",
    opportunitiesTitle: "Simplification opportunities",
    reviewsTitle: "Simplicity reviews",
    timelineTitle: "Simplicity timeline",
    milestonesTitle: "Simplification milestones",
    snapshotsTitle: "Complexity snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive simplicity view",
    sessionsTitle: "Simplicity sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleReview: "Schedule workflow review",
    generateReport: "Generate simplification report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export complexity snapshot",
    coordinateDiscussion: "Coordinate cross-functional discussion",
    archiveMilestone: "Archive simplification milestone",
    humansDecide: "Aipify supports clarity and simplification — leadership owns judgment and necessary controls.",
    privacyNote: "Privacy",
    simplicityScore: "Simplicity score",
    domains: {
      process: "Process simplicity",
      communication: "Communication simplicity",
      technology: "Technology simplicity",
      governance: "Governance simplicity",
      customer: "Customer simplicity",
      leadership: "Leadership simplicity",
    },
    detectionTypes: {
      duplicate_process: "Duplicate process",
      unnecessary_approval: "Unnecessary approval",
      excessive_handoff: "Excessive handoff",
      documentation_overload: "Documentation overload",
      tool_fragmentation: "Tool fragmentation",
      initiative_congestion: "Initiative congestion",
    },
    healthLabels: {
      exceptional: "Exceptional",
      simple: "Simple",
      manageable: "Manageable",
      complex: "Complex",
      overcomplicated: "Overcomplicated",
    },
    timelineTypes: {
      process_improvement: "Process improvement",
      approval_reduction: "Approval reduction",
      tool_consolidation: "Tool consolidation",
      communication_enhancement: "Communication enhancement",
      strategic_simplification: "Strategic simplification",
    },
    reviewTypes: {
      quarterly_simplicity: "Quarterly simplicity review",
      executive_clarity: "Executive clarity session",
      workflow_optimization: "Workflow optimization workshop",
      annual_simplification: "Annual simplification initiative",
    },
    sessionTypes: {
      workflow_review: "Workflow review",
      cross_functional_discussion: "Cross-functional discussion",
      executive_clarity: "Executive clarity session",
    },
    severityLabels: {
      low: "Low",
      medium: "Medium",
      high: "High",
    },
    metrics: {
      complexity: "Complexity indicators",
      opportunities: "Simplification opportunities",
      momentum: "Improvement momentum",
      workflow: "Workflow efficiency",
      clarity: "Organizational clarity",
      focus: "Executive focus",
      approvals: "Avg. approval layers",
      confidence: "Leadership confidence",
    },
    executiveFields: {
      complexity: "Complexity trends",
      focus: "Executive focus",
      governance: "Governance efficiency",
      opportunities: "Simplification opportunities",
    },
    settingsLink: "Organizational Simplicity",
    organizationalSimplicityLink: "Organizational Simplicity",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisasjonsenkelhet", settingsLink: "Organisasjonsenkelhet" }],
    ["sv", { ...i18nBlock(), title: "Organisationsenkelhet", settingsLink: "Organisationsenkelhet" }],
    ["da", { ...i18nBlock(), title: "Organisationsenkelhed", settingsLink: "Organisationsenkelhed" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalSimplicityCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalSimplicityCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalSimplicityLink = block.organizationalSimplicityLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_stewardship.view",', `"org_stewardship.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalSimplicityCenterEngine")) {
    c = c.replace(
      '| "organizationalStewardshipCenterEngine"',
      '| "organizationalSimplicityCenterEngine"\n  | "organizationalStewardshipCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalStewardshipCenterEngine", href: "/app/executive/organizational-stewardship", labelKey: "customerApp.nav.organizationalStewardshipCenterEngine" },',
      `{ id: "organizationalSimplicityCenterEngine", href: "/app/executive/organizational-simplicity", labelKey: "customerApp.nav.organizationalSimplicityCenterEngine" },
  { id: "organizationalStewardshipCenterEngine", href: "/app/executive/organizational-stewardship", labelKey: "customerApp.nav.organizationalStewardshipCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-stewardship")) return "organizationalStewardshipCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-simplicity")) return "organizationalSimplicityCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-stewardship")) return "organizationalStewardshipCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-simplicity-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalSimplicityLink")) {
    c = c.replace(
      "organizationalStewardshipLink: string;",
      "organizationalStewardshipLink: string;\n    organizationalSimplicityLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-stewardship" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalStewardshipLink}
        </Link>`,
      `<Link href="/app/executive/organizational-stewardship" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalStewardshipLink}
        </Link>
        <Link href="/app/executive/organizational-simplicity" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalSimplicityLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalSimplicityLink")) {
    p = p.replace(
      'organizationalStewardshipLink: t("customerApp.executive.organizationalStewardshipLink"),',
      'organizationalStewardshipLink: t("customerApp.executive.organizationalStewardshipLink"),\n        organizationalSimplicityLink: t("customerApp.executive.organizationalSimplicityLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Simplicity Center\nRoute: ${P.route}\nCore: Complexity increases naturally — simplicity must be designed intentionally.\nHelpers: _osim_* · _osimbp328_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Complexity increases naturally — simplicity must be designed intentionally.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase327-vocabulary";',
      `export * from "./implementation-blueprint-phase327-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE327_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase327-aipify-organizational-stewardship-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE327_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase327-aipify-organizational-stewardship-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Simplicity Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_SIMPLICITY_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_SIMPLICITY_CENTER_ENGINE_PHASE${P.phase}.md) — Simplicity Center at Executive Center → Organizational Simplicity. Complexity detection, simplification opportunities, reviews, and executive simplicity view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_osim_*\`, \`_osimbp328_*\`. APIs at \`/api/organizational-simplicity/*\`. Cross-links focus, alignment, execution excellence, and continuous improvement — does not modify their RPCs.`;
  if (!c.includes("Organizational Simplicity Center Engine (Phase 328)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_SIMPLICITY_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Simplicity Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
