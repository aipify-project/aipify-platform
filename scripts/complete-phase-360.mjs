#!/usr/bin/env node
/** ABOS Phase 360 — Aipify Organizational Energy Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 360,
  migration: "20261428800000_aipify_organizational_energy_engine_phase360.sql",
  slug: "aipify-organizational-energy-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_ENERGY_ENGINE",
  ilmFile: "implementation-blueprint-phase360-aipify-organizational-energy.txt",
  route: "/app/executive/organizational-energy",
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Energy Center",
    subtitle:
      "Understand, protect and strengthen organizational energy by identifying what creates momentum, what drains capacity and how teams can sustain healthy performance over time.",
    loading: "Loading Energy Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Energy philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalFocusLink: "Organizational Focus →",
    organizationalHealthLink: "Organizational Health →",
    organizationalResilienceLink: "Organizational Resilience →",
    dashboardTitle: "Energy dashboard",
    signalsTitle: "Energy engine",
    balanceTitle: "Energy balance engine",
    initiativesTitle: "Energy actions",
    reviewsTitle: "Energy reviews",
    timelineTitle: "Energy timeline",
    milestonesTitle: "Energy milestones",
    snapshotsTitle: "Energy snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive energy view",
    sessionsTitle: "Reflection sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleReflection: "Schedule reflection session",
    completeInitiative: "Complete initiative",
    generateReport: "Generate energy report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export energy snapshot",
    coordinateDiscussion: "Coordinate leadership discussion",
    archiveMilestone: "Archive energy milestone",
    archiveMilestoneDefaultTitle: "Recovery milestone",
    archiveMilestoneDefaultSummary: "Energy milestone archived via Energy Center.",
    humansDecide:
      "Aipify supports energy awareness — leaders retain responsibility; energy insights strengthen sustainability without burnout culture or individual surveillance.",
    privacyNote: "Privacy",
    energyScore: "Organizational energy score",
    momentumIndicators: "Momentum indicators",
    domains: {
      individual: "Individual energy",
      team: "Team energy",
      leadership: "Leadership energy",
      customer: "Customer energy",
      operational: "Operational energy",
      organizational: "Organizational energy",
    },
    signalTypes: {
      energy_sources: "Sources of organizational energy",
      energy_drains: "Common energy drains",
      sustainable_momentum_patterns: "Sustainable momentum patterns",
      friction_points: "Friction points",
      recovery_opportunities: "Recovery opportunities",
    },
    signalTones: {
      positive: "Positive indicator",
      neutral: "Neutral indicator",
      attention: "Needs attention",
    },
    balanceTypes: {
      current_energizers: "What energizes the organization",
      unnecessary_drains: "Unnecessary drains",
      sustainable_pacing: "Sustainable pacing",
      systems_supporting_people: "Systems supporting people",
      strengthen_momentum: "Strengthen momentum",
    },
    initiativeStatuses: {
      planned: "Planned",
      in_progress: "In progress",
      completed: "Completed",
    },
    healthLabels: {
      thriving: "Thriving",
      healthy: "Healthy",
      balanced: "Balanced",
      strained: "Strained",
      energy_reinforcement_recommended: "Energy reinforcement recommended",
    },
    timelineTypes: {
      recovery_milestone: "Recovery milestone",
      momentum_breakthrough: "Momentum breakthrough",
      leadership_reflection: "Leadership reflection",
      collaboration_achievement: "Collaboration achievement",
      sustainability_initiative: "Sustainability initiative",
    },
    reviewTypes: {
      monthly_energy: "Monthly energy review",
      quarterly_leadership_reflection: "Quarterly leadership reflection",
      team_sustainability: "Team sustainability discussion",
      annual_assessment: "Annual organizational assessment",
    },
    sessionTypes: {
      reflection_session: "Reflection session",
      stewardship_session: "Stewardship session",
      leadership_discussion: "Leadership discussion",
    },
    metrics: {
      momentumIndicators: "Momentum indicators",
      recoveryAwareness: "Recovery awareness",
      engagementTrends: "Engagement trends",
      sustainablePacing: "Sustainable pacing",
      collaborationQuality: "Collaboration quality",
      leadershipConsistency: "Leadership consistency",
      operationalFriction: "Operational friction",
      recoveryEffectiveness: "Recovery effectiveness",
      initiatives: "Initiatives in progress",
      reviews: "Reviews completed",
    },
    executiveFields: {
      organizationalMomentum: "Organizational momentum indicators",
      leadershipSustainability: "Leadership sustainability measures",
      collaborationEffectiveness: "Collaboration effectiveness trends",
      capacityPreservationOpportunities: "Capacity preservation opportunities",
    },
    settingsLink: "Organizational Energy",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Energisenter", settingsLink: "Organisatorisk energi" }],
    ["sv", { ...i18nBlock(), title: "Energicenter", settingsLink: "Organisatorisk energi" }],
    ["da", { ...i18nBlock(), title: "Energicenter", settingsLink: "Organisatorisk energi" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalEnergyCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalEnergyCenterEngine = block.settingsLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Energy Engine\nRoute: ${P.route}\nCore: Organizations do not run on strategy alone. They run on human energy.\nHelpers: _oec_* · _oecbp360_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Organizations do not run on strategy alone. They run on human energy.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase359-vocabulary";',
      `export * from "./implementation-blueprint-phase359-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE359_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase359-aipify-organizational-purposeful-execution.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE359_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase359-aipify-organizational-purposeful-execution.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Energy Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_ENERGY_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_ENERGY_ENGINE_PHASE${P.phase}.md) — Energy Center at Executive Center → Organizational Energy. Energy dashboard, balance engine, reviews, and executive view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_oec_*\`, \`_oecbp360_*\`. APIs at \`/api/organizational-energy/*\`. Cross-links focus, health, and resilience centers.`;
  if (!c.includes("Organizational Energy Engine (Phase 360)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_ENERGY_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Energy Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
