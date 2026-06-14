#!/usr/bin/env node
/** ABOS Phase 334 — Aipify Organizational Excellence Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 334,
  migration: "20261426200000_aipify_organizational_excellence_center_engine_phase334.sql",
  slug: "aipify-organizational-excellence-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_EXCELLENCE_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase334-aipify-organizational-excellence-center.txt",
  route: "/app/executive/organizational-excellence",
  permKeys: ["org_excellence.view", "org_excellence.manage", "org_excellence.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Excellence",
    subtitle:
      "Pursue excellence through intentional improvement, disciplined execution, strong leadership, customer focus, and sustainable operational practices.",
    loading: "Loading Excellence Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Excellence philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalContinuityLink: "Organizational Continuity →",
    organizationalCoherenceLink: "Organizational Coherence →",
    organizationalFuturesLink: "Organizational Futures →",
    organizationalMomentumLink: "Organizational Momentum →",
    organizationalTrustLink: "Organizational Trust →",
    dashboardTitle: "Excellence dashboard",
    signalsTitle: "Excellence engine",
    bestPracticesTitle: "Best practice engine",
    initiativesTitle: "Excellence initiatives",
    reviewsTitle: "Excellence reviews",
    timelineTitle: "Excellence timeline",
    milestonesTitle: "Excellence milestones",
    snapshotsTitle: "Excellence snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive excellence view",
    sessionsTitle: "Excellence sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleWorkshop: "Schedule improvement workshop",
    scalePractice: "Scale best practice",
    completeInitiative: "Complete initiative",
    generateReport: "Generate excellence report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export excellence snapshot",
    coordinateReview: "Coordinate cross-functional review",
    archiveMilestone: "Archive excellence milestone",
    humansDecide: "Aipify supports organizational excellence — leaders own improvement decisions, stewardship, and sustainable performance.",
    privacyNote: "Privacy",
    excellenceScore: "Organizational excellence score",
    improvementMomentum: "Improvement momentum",
    domains: {
      customer: "Customer excellence",
      operational: "Operational excellence",
      leadership: "Leadership excellence",
      workforce: "Workforce excellence",
      governance: "Governance excellence",
      innovation: "Innovation excellence",
    },
    signalTypes: {
      high_performing_practice: "High-performing practice",
      improvement_opportunity: "Improvement opportunity",
      excellence_trend: "Excellence trend",
      sustainable_success: "Sustainable success pattern",
      cross_functional_strength: "Cross-functional strength",
    },
    signalTones: {
      positive: "Positive signal",
      neutral: "Neutral signal",
      attention: "Needs attention",
    },
    practiceTypes: {
      successful_initiative: "Successful initiative",
      leadership_approach: "Leadership approach",
      customer_practice: "Customer practice",
      cross_functional_achievement: "Cross-functional achievement",
      sustainable_performance: "Sustainable performance pattern",
    },
    practiceStatuses: {
      highlighted: "Highlighted",
      scaling: "Scaling",
      archived: "Archived",
    },
    initiativeStatuses: {
      planned: "Planned",
      in_progress: "In progress",
      completed: "Completed",
    },
    healthLabels: {
      exceptional: "Exceptional",
      strong: "Strong",
      healthy: "Healthy",
      developing: "Developing",
      improvement_recommended: "Improvement recommended",
    },
    timelineTypes: {
      major_achievement: "Major achievement",
      capability_milestone: "Capability milestone",
      improvement_breakthrough: "Improvement breakthrough",
      leadership_initiative: "Leadership initiative",
      customer_success: "Customer success moment",
    },
    reviewTypes: {
      monthly_improvement: "Monthly improvement review",
      quarterly_excellence: "Quarterly excellence discussion",
      annual_assessment: "Annual organizational assessment",
      executive_reflection: "Executive reflection session",
    },
    sessionTypes: {
      improvement_workshop: "Improvement workshop",
      executive_reflection: "Executive reflection",
      cross_functional_review: "Cross-functional review",
    },
    metrics: {
      continuousImprovement: "Continuous improvement",
      execution: "Execution consistency",
      leadership: "Leadership maturity",
      customer: "Customer satisfaction trend",
      learning: "Learning integration",
      initiatives: "Initiatives in progress",
      strengths: "Capability strengths",
      confidence: "Executive confidence",
    },
    executiveFields: {
      strengths: "Organizational strengths",
      momentum: "Improvement momentum",
      leadership: "Leadership maturity",
      opportunities: "Strategic opportunities",
    },
    settingsLink: "Organizational Excellence",
    organizationalExcellenceLink: "Organizational Excellence",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisatorisk excellens", settingsLink: "Organisatorisk excellens" }],
    ["sv", { ...i18nBlock(), title: "Organisatorisk excellens", settingsLink: "Organisatorisk excellens" }],
    ["da", { ...i18nBlock(), title: "Organisatorisk excellens", settingsLink: "Organisatorisk excellens" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalExcellenceCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalExcellenceCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalExcellenceLink = block.organizationalExcellenceLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_continuity.view",', `"org_continuity.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalExcellenceCenterEngine")) {
    c = c.replace(
      '| "organizationalContinuityCenterEngine"',
      '| "organizationalExcellenceCenterEngine"\n  | "organizationalContinuityCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalContinuityCenterEngine", href: "/app/executive/organizational-continuity", labelKey: "customerApp.nav.organizationalContinuityCenterEngine" },',
      `{ id: "organizationalExcellenceCenterEngine", href: "/app/executive/organizational-excellence", labelKey: "customerApp.nav.organizationalExcellenceCenterEngine" },
  { id: "organizationalContinuityCenterEngine", href: "/app/executive/organizational-continuity", labelKey: "customerApp.nav.organizationalContinuityCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-continuity")) return "organizationalContinuityCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-excellence")) return "organizationalExcellenceCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-continuity")) return "organizationalContinuityCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-excellence-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalExcellenceLink")) {
    c = c.replace(
      "organizationalContinuityLink: string;",
      "organizationalContinuityLink: string;\n    organizationalExcellenceLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-continuity" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalContinuityLink}
        </Link>`,
      `<Link href="/app/executive/organizational-continuity" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalContinuityLink}
        </Link>
        <Link href="/app/executive/organizational-excellence" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalExcellenceLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalExcellenceLink")) {
    p = p.replace(
      'organizationalContinuityLink: t("customerApp.executive.organizationalContinuityLink"),',
      'organizationalContinuityLink: t("customerApp.executive.organizationalContinuityLink"),\n        organizationalExcellenceLink: t("customerApp.executive.organizationalExcellenceLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Excellence Center\nRoute: ${P.route}\nCore: Excellence is not an event — it is the result of thousands of intentional decisions made consistently over time.\nHelpers: _oexc_* · _oexcbp334_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Excellence is not an event — it is the result of thousands of intentional decisions made consistently over time.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase333-vocabulary";',
      `export * from "./implementation-blueprint-phase333-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE333_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase333-aipify-organizational-continuity-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE333_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase333-aipify-organizational-continuity-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Excellence Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_EXCELLENCE_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_EXCELLENCE_CENTER_ENGINE_PHASE${P.phase}.md) — Excellence Center at Executive Center → Organizational Excellence. Excellence dashboard, best practice engine, reviews, timeline, and executive excellence view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_oexc_*\`, \`_oexcbp334_*\`. APIs at \`/api/organizational-excellence/*\`. Cross-links continuity, coherence, momentum, trust, and continuous improvement centers.`;
  if (!c.includes("Organizational Excellence Center Engine (Phase 334)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_EXCELLENCE_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Excellence Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
