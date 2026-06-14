#!/usr/bin/env node
/** ABOS Phase 361 — Aipify Organizational Focus Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 361,
  migration: "20261428900000_aipify_organizational_focus_engine_phase361.sql",
  slug: "aipify-organizational-focus-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_FOCUS_ENGINE",
  ilmFile: "implementation-blueprint-phase361-aipify-organizational-focus.txt",
  route: "/app/executive/organizational-focus",
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Focus Center",
    subtitle:
      "Strengthen focus by identifying what matters most, reducing distractions, aligning attention with priorities and protecting meaningful execution.",
    loading: "Loading Focus Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Focus philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalEnergyLink: "Organizational Energy →",
    organizationalClarityLink: "Organizational Clarity →",
    organizationalSimplicityLink: "Organizational Simplicity →",
    dashboardTitle: "Focus dashboard",
    signalsTitle: "Focus engine",
    priorityTitle: "Priority engine",
    initiativesTitle: "Focus actions",
    reviewsTitle: "Focus reviews",
    timelineTitle: "Focus timeline",
    milestonesTitle: "Focus milestones",
    snapshotsTitle: "Focus snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive focus view",
    sessionsTitle: "Reflection sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleReflection: "Schedule prioritization session",
    completeInitiative: "Complete initiative",
    generateReport: "Generate focus report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export focus snapshot",
    coordinateDiscussion: "Coordinate leadership discussion",
    archiveMilestone: "Archive focus milestone",
    archiveMilestoneDefaultTitle: "Strategic focus milestone",
    archiveMilestoneDefaultSummary: "Focus milestone archived via Focus Center.",
    humansDecide:
      "Aipify supports focus awareness — leaders retain judgment; focus strengthens clarity without tunnel vision or rigid thinking.",
    privacyNote: "Privacy",
    focusScore: "Organizational focus score",
    priorityAlignment: "Priority alignment indicators",
    domains: {
      strategic: "Strategic focus",
      leadership: "Leadership focus",
      team: "Team focus",
      customer: "Customer focus",
      operational: "Operational focus",
      organizational: "Organizational focus",
    },
    signalTypes: {
      competing_priorities: "Competing priorities",
      attention_fragmentation: "Attention fragmentation",
      initiative_overload: "Initiative overload",
      concentration_opportunities: "High-value concentration opportunities",
      execution_distractions: "Execution distractions",
    },
    signalTones: {
      positive: "Positive indicator",
      neutral: "Neutral indicator",
      attention: "Needs attention",
    },
    priorityTypes: {
      what_matters_most: "What matters most right now",
      initiatives_deserve_attention: "Initiatives deserving full attention",
      what_to_stop: "What to stop doing",
      attention_diluted: "Where attention is diluted",
      simplify_execution: "How to simplify execution",
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
      focus_reinforcement_recommended: "Focus reinforcement recommended",
    },
    timelineTypes: {
      strategic_priorities_established: "Strategic priorities established",
      initiative_consolidation: "Initiative consolidation",
      leadership_reflection: "Leadership reflection",
      execution_breakthrough: "Execution breakthrough",
      organizational_simplification: "Organizational simplification",
    },
    reviewTypes: {
      monthly_focus: "Monthly focus review",
      quarterly_prioritization: "Quarterly prioritization discussion",
      leadership_reflection: "Leadership reflection session",
      annual_strategic_assessment: "Annual strategic assessment",
    },
    sessionTypes: {
      reflection_session: "Reflection session",
      prioritization_session: "Prioritization session",
      leadership_discussion: "Leadership discussion",
    },
    metrics: {
      priorityAlignment: "Priority alignment",
      initiativeConcentration: "Initiative concentration",
      executionClarity: "Execution clarity",
      priorityClarity: "Priority clarity",
      initiativeOverloadRisk: "Initiative overload risk",
      leadershipConsistency: "Leadership consistency",
      resourceConcentration: "Resource concentration",
      strategicDiscipline: "Strategic discipline",
      initiatives: "Initiatives in progress",
      reviews: "Reviews completed",
    },
    executiveFields: {
      priorityAlignment: "Priority alignment indicators",
      strategicConcentration: "Strategic concentration trends",
      leadershipReinforcement: "Leadership reinforcement measures",
      focusOpportunities: "Organizational focus opportunities",
    },
    settingsLink: "Organizational Focus",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Fokussenter", settingsLink: "Organisatorisk fokus" }],
    ["sv", { ...i18nBlock(), title: "Fokuscenter", settingsLink: "Organisatoriskt fokus" }],
    ["da", { ...i18nBlock(), title: "Fokuscenter", settingsLink: "Organisatorisk fokus" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalFocusCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalFocusCenterEngine = block.settingsLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Focus Engine\nRoute: ${P.route}\nCore: Organizations rarely fail because they care about too little. Focus creates clarity.\nHelpers: _ofc_* · _ofcbp361_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Organizations rarely fail because they care about too little. Focus creates clarity.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase360-vocabulary";',
      `export * from "./implementation-blueprint-phase360-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE360_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase360-aipify-organizational-energy.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE360_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase360-aipify-organizational-energy.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Focus Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_FOCUS_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_FOCUS_ENGINE_PHASE${P.phase}.md) — Focus Center at Executive Center → Organizational Focus. Focus dashboard, priority engine, reviews, and executive view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_ofc_*\`, \`_ofcbp361_*\`. APIs at \`/api/organizational-focus/*\`. Cross-links energy, clarity, and simplicity centers.`;
  if (!c.includes("Organizational Focus Engine (Phase 361)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_FOCUS_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Focus Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
