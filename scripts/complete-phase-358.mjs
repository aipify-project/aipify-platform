#!/usr/bin/env node
/** ABOS Phase 358 — Aipify Organizational Stewardship Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 358,
  migration: "20261428600000_aipify_organizational_stewardship_engine_phase358.sql",
  slug: "aipify-organizational-stewardship-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_STEWARDSHIP_ENGINE",
  ilmFile: "implementation-blueprint-phase358-aipify-organizational-stewardship.txt",
  route: "/app/executive/organizational-stewardship",
  permKeys: ["org_stewardship.view", "org_stewardship.manage", "org_stewardship.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Stewardship Center",
    subtitle:
      "Strengthen stewardship by caring responsibly for people, resources, knowledge, trust, culture, and opportunities entrusted to your organization.",
    loading: "Loading Stewardship Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Stewardship philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalLegacyLink: "Organizational Legacy →",
    organizationalIdentityLink: "Organizational Identity →",
    organizationalWisdomLink: "Organizational Wisdom →",
    dashboardTitle: "Stewardship dashboard",
    signalsTitle: "Stewardship engine",
    responsibilityTitle: "Responsibility engine",
    initiativesTitle: "Stewardship actions",
    reviewsTitle: "Stewardship reviews",
    timelineTitle: "Stewardship timeline",
    milestonesTitle: "Stewardship milestones",
    snapshotsTitle: "Stewardship snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive stewardship view",
    sessionsTitle: "Stewardship sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleReflection: "Schedule reflection session",
    completeInitiative: "Complete initiative",
    generateReport: "Generate stewardship report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export stewardship snapshot",
    coordinateDiscussion: "Coordinate leadership discussion",
    archiveMilestone: "Archive stewardship milestone",
    archiveMilestoneDefaultTitle: "People stewardship milestone",
    archiveMilestoneDefaultSummary: "People stewardship milestone archived via Stewardship Center.",
    humansDecide:
      "Aipify supports stewardship awareness — leaders retain accountability; stewardship strengthens responsible care without prestige narratives or short-term exploitation.",
    privacyNote: "Privacy",
    stewardshipScore: "Organizational stewardship score",
    leadershipStewardship: "Leadership stewardship indicators",
    domains: {
      people: "People stewardship",
      knowledge: "Knowledge stewardship",
      resource: "Resource stewardship",
      customer: "Customer stewardship",
      cultural: "Cultural stewardship",
      strategic: "Strategic stewardship",
      technology: "Technology stewardship",
      community: "Community stewardship",
    },
    signalTypes: {
      positive_stewardship_behaviors: "Positive stewardship behaviors",
      long_term_investment_patterns: "Long-term investment patterns",
      knowledge_preservation_opportunities: "Knowledge preservation opportunities",
      trust_strengthening_initiatives: "Trust strengthening initiatives",
      resource_sustainability_improvements: "Resource sustainability improvements",
    },
    signalTones: {
      positive: "Positive indicator",
      neutral: "Neutral indicator",
      attention: "Needs attention",
    },
    responsibilityTypes: {
      entrusted_to_us: "What has been entrusted to us",
      protecting_future_opportunities: "Protecting future opportunities",
      investing_in_people: "Investing in people",
      preserving_knowledge: "Preserving knowledge",
      strengthening_trust: "Strengthening trust",
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
      stewardship_reinforcement_recommended: "Stewardship reinforcement recommended",
      needs_attention: "Needs attention",
      reactive: "Reactive",
    },
    timelineTypes: {
      leadership_initiative: "Leadership initiative",
      knowledge_preservation_milestone: "Knowledge preservation milestone",
      customer_trust_achievement: "Customer trust achievement",
      cultural_development: "Cultural development",
      strategic_investment: "Strategic investment",
    },
    reviewTypes: {
      quarterly_stewardship: "Quarterly stewardship review",
      leadership_reflection: "Leadership reflection session",
      knowledge_continuity: "Knowledge continuity discussion",
      annual_assessment: "Annual organizational assessment",
      annual_leadership: "Annual leadership reflection",
      succession_preparedness: "Succession planning discussion",
      long_term_planning: "Long-term planning session",
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
      trustPreservation: "Trust preservation",
      knowledgeContinuity: "Knowledge continuity",
      resourceSustainability: "Resource sustainability",
      strategicConsistency: "Strategic consistency",
      leadershipResponsibility: "Leadership responsibility",
      customerTrust: "Customer trust",
      initiatives: "Initiatives in progress",
      reviews: "Reviews completed",
    },
    executiveFields: {
      leadershipResponsibility: "Leadership responsibility indicators",
      trustPreservation: "Trust preservation trends",
      knowledgeContinuity: "Knowledge continuity measures",
      futureInvestmentOpportunities: "Future investment opportunities",
    },
    settingsLink: "Organizational Stewardship",
    organizationalStewardshipLink: "Organizational Stewardship",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Forvaltningssenter", settingsLink: "Organisatorisk forvaltning" }],
    ["sv", { ...i18nBlock(), title: "Förvaltningscenter", settingsLink: "Organisatorisk förvaltning" }],
    ["da", { ...i18nBlock(), title: "Forvaltningscenter", settingsLink: "Organisatorisk forvaltning" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalStewardshipCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalStewardshipCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalStewardshipLink = block.organizationalStewardshipLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Stewardship Engine\nRoute: ${P.route}\nCore: Leadership is not ownership. Leadership is stewardship.\nHelpers: _osc_* · _oscbp358_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Leadership is not ownership. Leadership is stewardship.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase357-vocabulary";',
      `export * from "./implementation-blueprint-phase357-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE357_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase357-aipify-organizational-legacy.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE357_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase357-aipify-organizational-legacy.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Stewardship Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_STEWARDSHIP_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_STEWARDSHIP_ENGINE_PHASE${P.phase}.md) — Stewardship Center at Executive Center → Organizational Stewardship. Stewardship dashboard, responsibility engine, reviews, and executive view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_osc_*\`, \`_oscbp358_*\`. APIs at \`/api/organizational-stewardship/*\`. Cross-links legacy and identity centers.`;
  if (!c.includes("Organizational Stewardship Engine (Phase 358)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

function patchPendingMigrations() {
  const file = "/tmp/aipify-pending-migrations.json";
  if (!fs.existsSync(file)) return;
  const list = JSON.parse(fs.readFileSync(file, "utf8"));
  const entry = {
    file: P.migration,
    version: "20261428600000",
    name: "aipify_organizational_stewardship_engine_phase358",
  };
  if (!list.some((item) => item.file === P.migration || item === P.migration)) {
    list.push(entry);
    fs.writeFileSync(file, `${JSON.stringify(list, null, 2)}\n`);
    console.log("appended pending migration");
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_STEWARDSHIP_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Stewardship Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
