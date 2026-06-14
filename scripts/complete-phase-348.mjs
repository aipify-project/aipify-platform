#!/usr/bin/env node
/** ABOS Phase 348 — Aipify Organizational Curiosity Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 348,
  migration: "20261427700000_aipify_organizational_curiosity_center_engine_phase348.sql",
  slug: "aipify-organizational-curiosity-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_CURIOSITY_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase348-aipify-organizational-curiosity-center.txt",
  route: "/app/executive/organizational-curiosity",
  permKeys: ["org_curiosity.view", "org_curiosity.manage", "org_curiosity.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Curiosity",
    subtitle:
      "Cultivate healthy curiosity, encourage exploration, strengthen learning cultures, and continuously ask better questions that lead to deeper understanding and meaningful innovation.",
    loading: "Loading Curiosity Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Curiosity philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalHarmonyLink: "Organizational Harmony →",
    dashboardTitle: "Curiosity dashboard",
    signalsTitle: "Curiosity engine",
    questionTitle: "Question engine",
    discoveryTitle: "Discovery engine",
    initiativesTitle: "Curiosity initiatives",
    reviewsTitle: "Curiosity reviews",
    timelineTitle: "Curiosity timeline",
    milestonesTitle: "Curiosity milestones",
    snapshotsTitle: "Learning snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive curiosity view",
    sessionsTitle: "Curiosity sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleReflection: "Schedule reflection session",
    completeInitiative: "Complete initiative",
    generateReport: "Generate curiosity report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export learning snapshot",
    coordinateReview: "Coordinate exploration workshop",
    archiveMilestone: "Archive curiosity milestone",
    humansDecide:
      "Aipify supports inquiry — leaders retain strategic focus; curiosity encourages learning without reckless experimentation, novelty for its own sake, or endless analysis.",
    privacyNote: "Privacy",
    curiosityScore: "Organizational curiosity score",
    learningEngagement: "Learning engagement",
    domains: {
      strategic: "Strategic curiosity",
      customer: "Customer curiosity",
      leadership: "Leadership curiosity",
      operational: "Operational curiosity",
      workforce: "Workforce curiosity",
      innovation: "Innovation curiosity",
    },
    signalTypes: {
      valuable_question: "Valuable question",
      learning_breakthrough: "Learning breakthrough",
      unexpected_opportunity: "Unexpected opportunity",
      cross_functional_insight: "Cross-functional insight",
      innovation_theme: "Innovation theme",
    },
    signalTones: {
      positive: "Positive indicator",
      neutral: "Neutral indicator",
      attention: "Needs attention",
    },
    questionTypes: {
      assumptions_check: "Assumptions check",
      overlooked_factors: "Overlooked factors",
      learn_from_others: "Learn from others",
      unexplored_opportunities: "Unexplored opportunities",
      improvement_paths: "Improvement paths",
    },
    discoveryTypes: {
      valuable_question: "Valuable question emerging",
      learning_breakthrough: "Learning breakthrough",
      unexpected_opportunity: "Unexpected opportunity",
      cross_functional_insight: "Cross-functional insight",
      innovation_theme: "Innovation theme",
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
      curiosity_encouraged: "Curiosity encouraged",
    },
    timelineTypes: {
      learning_milestone: "Learning milestone",
      reflection_development: "Reflection development",
      innovation_discovery: "Innovation discovery",
      cross_functional_insight: "Cross-functional insight",
      strategic_exploration: "Strategic exploration",
    },
    reviewTypes: {
      quarterly_learning: "Quarterly learning review",
      leadership_reflection: "Leadership reflection session",
      innovation_discussion: "Innovation discussion",
      annual_exploration_assessment: "Annual exploration assessment",
    },
    sessionTypes: {
      reflection_session: "Reflection session",
      innovation_discussion: "Innovation discussion",
      exploration_workshop: "Exploration workshop",
    },
    metrics: {
      learningParticipation: "Learning participation",
      reflectionEngagement: "Reflection engagement",
      crossFunctionalExploration: "Cross-functional exploration",
      knowledgeSharing: "Knowledge sharing effectiveness",
      innovationDiscipline: "Innovation discipline",
      explorationInitiatives: "Exploration initiatives",
      initiatives: "Initiatives in progress",
      reviews: "Reviews completed",
    },
    executiveFields: {
      leadershipLearning: "Leadership learning indicators",
      explorationTrends: "Exploration trends",
      innovationOpportunities: "Innovation opportunities",
      organizationalInquiry: "Organizational inquiry measures",
    },
    settingsLink: "Organizational Curiosity",
    organizationalCuriosityLink: "Organizational Curiosity",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisatorisk nysgjerrighet", settingsLink: "Organisatorisk nysgjerrighet" }],
    ["sv", { ...i18nBlock(), title: "Organisatorisk nyfikenhet", settingsLink: "Organisatorisk nyfikenhet" }],
    ["da", { ...i18nBlock(), title: "Organisatorisk nysgerrighed", settingsLink: "Organisatorisk nysgerrighed" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalCuriosityCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalCuriosityCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalCuriosityLink = block.organizationalCuriosityLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_harmony.view",', `"org_harmony.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalCuriosityCenterEngine")) {
    c = c.replace(
      '| "organizationalHarmonyCenterEngine"',
      '| "organizationalCuriosityCenterEngine"\n  | "organizationalHarmonyCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalHarmonyCenterEngine", href: "/app/executive/organizational-harmony", labelKey: "customerApp.nav.organizationalHarmonyCenterEngine" },',
      `{ id: "organizationalCuriosityCenterEngine", href: "/app/executive/organizational-curiosity", labelKey: "customerApp.nav.organizationalCuriosityCenterEngine" },
  { id: "organizationalHarmonyCenterEngine", href: "/app/executive/organizational-harmony", labelKey: "customerApp.nav.organizationalHarmonyCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-harmony")) return "organizationalHarmonyCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-curiosity")) return "organizationalCuriosityCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-harmony")) return "organizationalHarmonyCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-curiosity-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalCuriosityLink")) {
    c = c.replace(
      "organizationalHarmonyLink: string;",
      "organizationalHarmonyLink: string;\n    organizationalCuriosityLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-harmony" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalHarmonyLink}
        </Link>`,
      `<Link href="/app/executive/organizational-harmony" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalHarmonyLink}
        </Link>
        <Link href="/app/executive/organizational-curiosity" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalCuriosityLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalCuriosityLink")) {
    p = p.replace(
      'organizationalHarmonyLink: t("customerApp.executive.organizationalHarmonyLink"),',
      'organizationalHarmonyLink: t("customerApp.executive.organizationalHarmonyLink"),\n        organizationalCuriosityLink: t("customerApp.executive.organizationalCuriosityLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Curiosity Center\nRoute: ${P.route}\nCore: Organizations stop growing when they stop asking questions.\nHelpers: _occ_* · _occbp348_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Organizations stop growing when they stop asking questions.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase347-vocabulary";',
      `export * from "./implementation-blueprint-phase347-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE347_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase347-aipify-organizational-harmony-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE347_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase347-aipify-organizational-harmony-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Curiosity Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_CURIOSITY_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_CURIOSITY_CENTER_ENGINE_PHASE${P.phase}.md) — Curiosity Center at Executive Center → Organizational Curiosity. Curiosity dashboard, question engine, discovery engine, reviews, and executive curiosity view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_occ_*\`, \`_occbp348_*\`. APIs at \`/api/organizational-curiosity/*\`. Cross-links harmony and awareness centers.`;
  if (!c.includes("Organizational Curiosity Center Engine (Phase 348)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

function patchPendingMigrations() {
  const file = "/tmp/aipify-pending-migrations.json";
  const list = JSON.parse(fs.readFileSync(file, "utf8"));
  const entry = {
    file: P.migration,
    version: "20261427700000",
    name: "aipify_organizational_curiosity_center_engine_phase348",
  };
  if (!list.some((item) => item.file === P.migration || item === P.migration)) {
    list.push(entry);
    fs.writeFileSync(file, `${JSON.stringify(list, null, 2)}\n`);
    console.log("appended pending migration");
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_CURIOSITY_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Curiosity Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
patchPendingMigrations();
console.log(`Phase ${P.phase} complete`);
