#!/usr/bin/env node
/** ABOS Phase 357 — Aipify Organizational Legacy Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 357,
  migration: "20261428500000_aipify_organizational_legacy_engine_phase357.sql",
  slug: "aipify-organizational-legacy-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_LEGACY_ENGINE",
  ilmFile: "implementation-blueprint-phase357-aipify-organizational-legacy.txt",
  route: "/app/executive/organizational-legacy",
  permKeys: ["org_legacy.view", "org_legacy.manage", "org_legacy.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Legacy Center",
    subtitle:
      "Intentionally shape, preserve and strengthen the positive legacy your organization leaves through decisions, relationships, contributions and long-term impact.",
    loading: "Loading Legacy Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Legacy philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalIdentityLink: "Organizational Identity →",
    organizationalStewardshipLink: "Organizational Stewardship →",
    organizationalWisdomLink: "Organizational Wisdom →",
    dashboardTitle: "Legacy dashboard",
    signalsTitle: "Legacy engine",
    legacyQuestionsTitle: "Legacy questions engine",
    initiativesTitle: "Legacy actions",
    reviewsTitle: "Legacy reviews",
    timelineTitle: "Legacy timeline",
    milestonesTitle: "Legacy milestones",
    snapshotsTitle: "Legacy snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive legacy view",
    sessionsTitle: "Stewardship sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleReflection: "Schedule reflection session",
    completeInitiative: "Complete initiative",
    generateReport: "Generate legacy report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export legacy snapshot",
    coordinateDiscussion: "Coordinate leadership discussion",
    archiveMilestone: "Archive legacy milestone",
    archiveMilestoneDefaultTitle: "Stewardship milestone",
    archiveMilestoneDefaultSummary: "Stewardship milestone archived via Legacy Center.",
    humansDecide:
      "Aipify supports legacy awareness — leaders retain ethical responsibility; legacy strengthens stewardship without vanity metrics or reputation management.",
    privacyNote: "Privacy",
    legacyScore: "Organizational legacy score",
    positiveImpact: "Positive impact indicators",
    domains: {
      customer: "Customer legacy",
      employee: "Employee legacy",
      leadership: "Leadership legacy",
      cultural: "Cultural legacy",
      community: "Community legacy",
      organizational: "Organizational legacy",
      founding: "Foundational legacy",
    },
    signalTypes: {
      positive_long_term_patterns: "Positive long-term patterns",
      stewardship_strengths: "Stewardship strengths",
      knowledge_preservation_opportunities: "Knowledge preservation opportunities",
      legacy_risks: "Emerging legacy risks",
      high_impact_contributions: "High-impact contributions",
    },
    signalTones: {
      positive: "Positive indicator",
      neutral: "Neutral indicator",
      attention: "Needs attention",
    },
    legacyQuestionTypes: {
      beyond_immediate_results: "Beyond immediate results",
      customer_remember: "Customer remembrance",
      knowledge_preserve: "Knowledge preservation",
      traditions_continue: "Traditions worth continuing",
      impact_leave_behind: "Impact we hope to leave",
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
      legacy_reinforcement_recommended: "Legacy reinforcement recommended",
      maturing: "Maturing",
      emerging: "Emerging",
    },
    timelineTypes: {
      foundational_milestone: "Foundational milestone",
      leadership_transition: "Leadership transition",
      significant_achievement: "Significant achievement",
      cultural_development: "Cultural development",
      community_contribution: "Community contribution",
      founding_event: "Foundational milestone",
      growth_milestone: "Growth milestone",
      major_achievement: "Significant achievement",
      org_transition: "Leadership transition",
      significant_lesson: "Significant lesson",
      cultural_moment: "Cultural development",
    },
    reviewTypes: {
      annual_legacy: "Annual legacy review",
      leadership_reflection: "Leadership reflection session",
      succession_planning: "Succession planning discussion",
      purpose_stewardship: "Purpose and stewardship assessment",
    },
    sessionTypes: {
      reflection_session: "Reflection session",
      stewardship_session: "Stewardship session",
      leadership_discussion: "Leadership discussion",
      succession_discussion: "Succession discussion",
      leadership_reflection: "Leadership reflection",
      stewardship_review: "Stewardship review",
      legacy_planning: "Legacy planning",
    },
    metrics: {
      stewardshipQuality: "Stewardship quality",
      knowledgePreservation: "Knowledge preservation",
      leadershipSuccession: "Leadership succession readiness",
      customerTrust: "Customer trust",
      culturalResilience: "Cultural resilience",
      valuesConsistency: "Values consistency",
      initiatives: "Initiatives in progress",
      reviews: "Reviews completed",
    },
    executiveFields: {
      stewardshipIndicators: "Stewardship indicators",
      leadershipContinuity: "Leadership continuity measures",
      knowledgePreservation: "Knowledge preservation trends",
      contributionOpportunities: "Long-term contribution opportunities",
    },
    settingsLink: "Organizational Legacy",
    organizationalLegacyLink: "Organizational Legacy",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Arvsenter", settingsLink: "Organisatorisk arv" }],
    ["sv", { ...i18nBlock(), title: "Arvscenter", settingsLink: "Organisatoriskt arv" }],
    ["da", { ...i18nBlock(), title: "Arvscenter", settingsLink: "Organisatorisk arv" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalLegacyCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalLegacyCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalLegacyLink = block.organizationalLegacyLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Legacy Engine\nRoute: ${P.route}\nCore: Organizations are remembered not only for what they achieve, but for how they achieve it.\nHelpers: _olc_* · _olcbp357_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Organizations are remembered not only for what they achieve, but for how they achieve it and what they leave behind.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase356-vocabulary";',
      `export * from "./implementation-blueprint-phase356-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE356_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase356-aipify-organizational-identity-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE356_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase356-aipify-organizational-identity-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Legacy Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_LEGACY_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_LEGACY_ENGINE_PHASE${P.phase}.md) — Legacy Center at Executive Center → Organizational Legacy. Legacy dashboard, questions engine, reviews, and executive view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_olc_*\`, \`_olcbp357_*\`. APIs at \`/api/organizational-legacy/*\`. Cross-links identity and stewardship centers.`;
  if (!c.includes("Organizational Legacy Engine (Phase 357)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

function patchPendingMigrations() {
  const file = "/tmp/aipify-pending-migrations.json";
  if (!fs.existsSync(file)) return;
  const list = JSON.parse(fs.readFileSync(file, "utf8"));
  const entry = {
    file: P.migration,
    version: "20261428500000",
    name: "aipify_organizational_legacy_engine_phase357",
  };
  if (!list.some((item) => item.file === P.migration || item === P.migration)) {
    list.push(entry);
    fs.writeFileSync(file, `${JSON.stringify(list, null, 2)}\n`);
    console.log("appended pending migration");
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_LEGACY_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Legacy Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
patchPendingMigrations();
console.log(`Phase ${P.phase} complete`);
