#!/usr/bin/env node
/** ABOS Phase 336 — Aipify Organizational Decision Quality Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 336,
  migration: "20261426400000_aipify_organizational_decision_quality_center_engine_phase336.sql",
  slug: "aipify-organizational-decision-quality-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_DECISION_QUALITY_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase336-aipify-organizational-decision-quality-center.txt",
  route: "/app/executive/organizational-decision-quality",
  permKeys: ["org_decision_quality.view", "org_decision_quality.manage", "org_decision_quality.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Decision Quality",
    subtitle:
      "Continuously improve the quality, consistency, transparency, and effectiveness of decision-making across leadership, teams, and governance.",
    loading: "Loading Decision Quality Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Decision quality philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalImpactLink: "Organizational Impact →",
    organizationalWisdomLink: "Organizational Wisdom →",
    organizationalLearningLink: "Organizational Learning →",
    executiveDecisionSupportLink: "Decision Support →",
    dashboardTitle: "Decision dashboard",
    reflectionsTitle: "Decision reflection engine",
    decisionsTitle: "Major decisions under review",
    workflowTitle: "Decision review workflow",
    biasTitle: "Bias awareness support",
    reviewsTitle: "Decision reviews",
    timelineTitle: "Decision timeline",
    milestonesTitle: "Decision milestones",
    snapshotsTitle: "Decision snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive decision view",
    sessionsTitle: "Decision sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleReflection: "Schedule reflection session",
    markReflection: "Mark as reflected",
    advanceDecision: "Advance decision workflow",
    generateReport: "Generate decision report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export decision snapshot",
    coordinateDiscussion: "Coordinate review discussion",
    archiveMilestone: "Archive decision milestone",
    humansDecide: "Aipify supports decision quality — executives retain authority; reflection encourages learning, not blame.",
    privacyNote: "Privacy",
    decisionQualityScore: "Decision quality score",
    reflectionParticipation: "Reflection participation",
    domains: {
      strategic: "Strategic decisions",
      operational: "Operational decisions",
      customer: "Customer decisions",
      leadership: "Leadership decisions",
      innovation: "Innovation decisions",
    },
    workflowStatuses: {
      recorded: "Decision recorded",
      context_documented: "Context documented",
      stakeholder_input: "Stakeholder input captured",
      implemented: "Decision implemented",
      outcomes_observed: "Outcomes observed",
      lessons_reflected: "Lessons reflected upon",
      learning_integrated: "Learning integrated",
    },
    biasTypes: {
      confirmation_bias: "Confirmation bias",
      short_term_thinking: "Short-term thinking",
      groupthink_risk: "Groupthink risk",
      overconfidence: "Overconfidence tendency",
      historical_assumptions: "Historical assumptions",
    },
    reflectionStatuses: {
      open: "Open",
      reflected: "Reflected",
    },
    healthLabels: {
      exceptional: "Exceptional",
      strong: "Strong",
      healthy: "Healthy",
      developing: "Developing",
      review_recommended: "Review recommended",
    },
    timelineTypes: {
      significant_decision: "Significant decision",
      reflection_milestone: "Reflection milestone",
      learning_integration: "Learning integration",
      strategic_turning_point: "Strategic turning point",
      governance_discussion: "Governance discussion",
    },
    reviewTypes: {
      decision_review: "Decision review",
      reflection_session: "Reflection session",
      governance_discussion: "Governance discussion",
      learning_integration: "Learning integration review",
    },
    sessionTypes: {
      reflection_session: "Reflection session",
      review_discussion: "Review discussion",
      learning_workshop: "Learning workshop",
    },
    metrics: {
      context: "Context consideration",
      stakeholders: "Stakeholder involvement",
      learning: "Learning utilization",
      governance: "Governance alignment",
      underReview: "Decisions under review",
      documented: "Decisions documented",
      reviews: "Reviews completed",
      confidence: "Executive confidence",
    },
    executiveFields: {
      strategic: "Strategic decision trends",
      reflection: "Reflection participation",
      learning: "Learning integration",
      opportunities: "Decision quality opportunities",
    },
    settingsLink: "Decision Quality",
    organizationalDecisionQualityLink: "Decision Quality",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Beslutningskvalitet", settingsLink: "Beslutningskvalitet" }],
    ["sv", { ...i18nBlock(), title: "Beslutskvalitet", settingsLink: "Beslutskvalitet" }],
    ["da", { ...i18nBlock(), title: "Beslutningskvalitet", settingsLink: "Beslutningskvalitet" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalDecisionQualityCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalDecisionQualityCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalDecisionQualityLink = block.organizationalDecisionQualityLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_impact.view",', `"org_impact.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalDecisionQualityCenterEngine")) {
    c = c.replace(
      '| "organizationalImpactCenterEngine"',
      '| "organizationalDecisionQualityCenterEngine"\n  | "organizationalImpactCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalImpactCenterEngine", href: "/app/executive/organizational-impact", labelKey: "customerApp.nav.organizationalImpactCenterEngine" },',
      `{ id: "organizationalDecisionQualityCenterEngine", href: "/app/executive/organizational-decision-quality", labelKey: "customerApp.nav.organizationalDecisionQualityCenterEngine" },
  { id: "organizationalImpactCenterEngine", href: "/app/executive/organizational-impact", labelKey: "customerApp.nav.organizationalImpactCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-impact")) return "organizationalImpactCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-decision-quality")) return "organizationalDecisionQualityCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-impact")) return "organizationalImpactCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-decision-quality-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalDecisionQualityLink")) {
    c = c.replace(
      "organizationalImpactLink: string;",
      "organizationalImpactLink: string;\n    organizationalDecisionQualityLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-impact" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalImpactLink}
        </Link>`,
      `<Link href="/app/executive/organizational-impact" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalImpactLink}
        </Link>
        <Link href="/app/executive/organizational-decision-quality" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalDecisionQualityLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalDecisionQualityLink")) {
    p = p.replace(
      'organizationalImpactLink: t("customerApp.executive.organizationalImpactLink"),',
      'organizationalImpactLink: t("customerApp.executive.organizationalImpactLink"),\n        organizationalDecisionQualityLink: t("customerApp.executive.organizationalDecisionQualityLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Decision Quality Center\nRoute: ${P.route}\nCore: The future of an organization is shaped by the quality of its decisions.\nHelpers: _odqc_* · _odqcbp336_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "The future of an organization is shaped by the quality of its decisions.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase335-vocabulary";',
      `export * from "./implementation-blueprint-phase335-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE335_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase335-aipify-organizational-impact-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE335_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase335-aipify-organizational-impact-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Decision Quality Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_DECISION_QUALITY_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_DECISION_QUALITY_CENTER_ENGINE_PHASE${P.phase}.md) — Decision Quality Center at Executive Center → Decision Quality. Decision dashboard, reflection engine, review workflow, bias awareness, and executive decision view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_odqc_*\`, \`_odqcbp336_*\`. APIs at \`/api/organizational-decision-quality/*\`. Cross-links impact, wisdom, learning, and decision support.`;
  if (!c.includes("Organizational Decision Quality Center Engine (Phase 336)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_DECISION_QUALITY_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Decision Quality Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
