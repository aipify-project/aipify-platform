#!/usr/bin/env node
/** ABOS Phase 362 — Aipify Organizational Simplicity Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 362,
  migration: "20261429000000_aipify_organizational_simplicity_engine_phase362.sql",
  slug: "aipify-organizational-simplicity-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_SIMPLICITY_ENGINE",
  ilmFile: "implementation-blueprint-phase362-aipify-organizational-simplicity.txt",
  route: "/app/executive/organizational-simplicity",
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Simplicity Center",
    subtitle:
      "Reduce unnecessary complexity, simplify workflows, improve usability and create environments where people can focus on meaningful work without excessive friction.",
    loading: "Loading Simplicity Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Simplicity philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalFocusLink: "Organizational Focus →",
    organizationalEnergyLink: "Organizational Energy →",
    organizationalClarityLink: "Organizational Clarity →",
    dashboardTitle: "Simplicity dashboard",
    signalsTitle: "Simplicity engine",
    frictionTitle: "Friction reduction engine",
    initiativesTitle: "Simplicity actions",
    reviewsTitle: "Simplicity reviews",
    timelineTitle: "Simplicity timeline",
    milestonesTitle: "Simplification milestones",
    snapshotsTitle: "Simplicity snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive simplicity view",
    sessionsTitle: "Simplicity sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleWorkshop: "Schedule simplification workshop",
    completeInitiative: "Complete initiative",
    generateReport: "Generate simplicity report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export simplicity snapshot",
    coordinateDiscussion: "Coordinate leadership discussion",
    archiveMilestone: "Archive simplification milestone",
    archiveMilestoneDefaultTitle: "Organizational simplification milestone",
    archiveMilestoneDefaultSummary: "Simplification milestone archived via Simplicity Center.",
    humansDecide:
      "Aipify supports thoughtful simplification — leaders retain judgment; simplicity strengthens capacity without removing necessary safeguards.",
    privacyNote: "Privacy",
    simplicityScore: "Organizational simplicity score",
    complexityReduction: "Complexity reduction indicators",
    domains: {
      strategic: "Strategic simplicity",
      operational: "Operational simplicity",
      technical: "Technical simplicity",
      leadership: "Leadership simplicity",
      customer: "Customer simplicity",
      organizational: "Organizational simplicity",
    },
    signalTypes: {
      unnecessary_complexity: "Unnecessary complexity",
      duplicate_workflows: "Duplicate workflows",
      excessive_approval_layers: "Excessive approval layers",
      communication_overload: "Communication overload",
      usability_barriers: "Usability barriers",
    },
    signalTones: {
      positive: "Positive indicator",
      neutral: "Neutral indicator",
      attention: "Needs attention",
    },
    frictionTypes: {
      what_complicates_work: "What unnecessarily complicates work",
      easier_to_understand: "What can be made easier to understand",
      approvals_little_value: "Approvals that add little value",
      avoidable_frustration: "Avoidable frustration",
      improve_usability: "How to improve usability responsibly",
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
      simplification_recommended: "Simplification recommended",
    },
    timelineTypes: {
      workflow_improvement: "Workflow improvement",
      bureaucracy_reduction: "Bureaucracy reduction",
      communication_refinement: "Communication refinement",
      system_consolidation: "System consolidation",
      organizational_breakthrough: "Organizational breakthrough",
    },
    reviewTypes: {
      quarterly_simplicity: "Quarterly simplicity review",
      workflow_assessment: "Workflow assessment",
      leadership_reflection: "Leadership reflection session",
      annual_evaluation: "Annual organizational evaluation",
    },
    sessionTypes: {
      simplification_workshop: "Simplification workshop",
      leadership_discussion: "Leadership discussion",
      workflow_session: "Workflow session",
    },
    metrics: {
      complexityReduction: "Complexity reduction",
      workflowEfficiency: "Workflow efficiency",
      processClarity: "Process clarity",
      navigationSimplicity: "Navigation simplicity",
      communicationEffectiveness: "Communication effectiveness",
      bureaucraticBurden: "Bureaucratic burden",
      accessibility: "Accessibility measures",
      initiatives: "Initiatives in progress",
      reviews: "Reviews completed",
    },
    executiveFields: {
      complexityReduction: "Complexity reduction indicators",
      workflowEfficiency: "Workflow efficiency measures",
      leadershipCommunication: "Leadership communication trends",
      simplificationOpportunities: "Organizational simplification opportunities",
    },
    settingsLink: "Organizational Simplicity",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Enkelhetssenter", settingsLink: "Organisatorisk enkelhet" }],
    ["sv", { ...i18nBlock(), title: "Enkelhetscenter", settingsLink: "Organisatorisk enkelhet" }],
    ["da", { ...i18nBlock(), title: "Enkelhedscenter", settingsLink: "Organisatorisk enkelhed" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalSimplicityCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalSimplicityCenterEngine = block.settingsLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Simplicity Engine\nRoute: ${P.route}\nCore: Complexity consumes attention. Simplicity creates capacity.\nHelpers: _osim_* · _osimbp362_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Complexity consumes attention. Simplicity creates capacity.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase361-vocabulary";',
      `export * from "./implementation-blueprint-phase361-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE361_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase361-aipify-organizational-focus.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE361_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase361-aipify-organizational-focus.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Simplicity Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_SIMPLICITY_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_SIMPLICITY_ENGINE_PHASE${P.phase}.md) — Simplicity Center at Executive Center → Organizational Simplicity. Simplicity dashboard, friction reduction engine, reviews, and executive view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_osim_*\`, \`_osimbp362_*\`. APIs at \`/api/organizational-simplicity/*\`. Cross-links focus, energy, and clarity centers.`;
  if (!c.includes("Organizational Simplicity Engine (Phase 362)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_SIMPLICITY_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Simplicity Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
patchIlm();
patchArchitecture();
console.log(`Phase ${P.phase} complete`);
