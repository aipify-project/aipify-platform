#!/usr/bin/env node
/** ABOS Phase 349 — Aipify Organizational Courage Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 349,
  migration: "20261427800000_aipify_organizational_courage_center_engine_phase349.sql",
  slug: "aipify-organizational-courage-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_COURAGE_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase349-aipify-organizational-courage-center.txt",
  route: "/app/executive/organizational-courage",
  permKeys: ["org_courage.view", "org_courage.manage", "org_courage.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Courage",
    subtitle:
      "Cultivate responsible courage by supporting difficult conversations, principled decision-making, ethical leadership, innovation under uncertainty, and the willingness to act despite discomfort when circumstances require it.",
    loading: "Loading Courage Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Courage philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalCuriosityLink: "Organizational Curiosity →",
    dashboardTitle: "Courage dashboard",
    signalsTitle: "Courage engine",
    conversationTitle: "Difficult conversation engine",
    initiativesTitle: "Courage initiatives",
    reviewsTitle: "Courage reviews",
    timelineTitle: "Courage timeline",
    milestonesTitle: "Courage milestones",
    snapshotsTitle: "Courage snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive courage view",
    sessionsTitle: "Courage sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleReflection: "Schedule reflection session",
    completeInitiative: "Complete initiative",
    generateReport: "Generate courage report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export courage snapshot",
    coordinateDiscussion: "Coordinate leadership discussion",
    archiveMilestone: "Archive courage milestone",
    humansDecide:
      "Aipify supports principled action — leaders retain judgment; courage encourages honesty and wisdom without recklessness, hero narratives, or conflict for its own sake.",
    privacyNote: "Privacy",
    courageScore: "Organizational courage score",
    valuesAlignedDecisions: "Values-aligned decisions",
    domains: {
      leadership: "Leadership courage",
      ethical: "Ethical courage",
      strategic: "Strategic courage",
      workforce: "Workforce courage",
      customer: "Customer courage",
      innovation: "Innovation courage",
    },
    signalTypes: {
      values_based_leadership: "Values-based leadership",
      healthy_challenge: "Healthy challenge",
      responsible_innovation: "Responsible innovation",
      ethical_consistency: "Ethical consistency",
      learning_from_setbacks: "Learning from setbacks",
    },
    signalTones: {
      positive: "Positive indicator",
      neutral: "Neutral indicator",
      attention: "Needs attention",
    },
    conversationTypes: {
      avoiding_conversation: "Avoided conversation",
      values_guidance: "Values guidance",
      truth_communication: "Truth communication",
      thoughtful_risks: "Thoughtful risks",
      honesty_compassion: "Honesty and compassion",
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
      courage_development_recommended: "Courage development recommended",
    },
    timelineTypes: {
      leadership_decision: "Leadership decision",
      ethical_milestone: "Ethical milestone",
      innovation_breakthrough: "Innovation breakthrough",
      reflection_development: "Reflection development",
      organizational_learning: "Organizational learning",
    },
    reviewTypes: {
      quarterly_courage: "Quarterly courage review",
      leadership_reflection: "Leadership reflection session",
      ethical_decision_discussion: "Ethical decision discussion",
      annual_organizational_assessment: "Annual organizational assessment",
    },
    sessionTypes: {
      reflection_session: "Reflection session",
      ethical_decision_discussion: "Ethical decision discussion",
      leadership_discussion: "Leadership discussion",
    },
    metrics: {
      leadershipTransparency: "Leadership transparency",
      reflectionParticipation: "Reflection participation",
      ethicalConsistencyMetric: "Ethical consistency",
      learningIntegration: "Learning integration",
      responsibleInnovation: "Responsible innovation practices",
      leadershipReflection: "Leadership reflection trends",
      initiatives: "Initiatives in progress",
      reviews: "Reviews completed",
    },
    executiveFields: {
      leadershipIntegrity: "Leadership integrity indicators",
      innovationConfidence: "Innovation confidence measures",
      ethicalConsistency: "Ethical consistency trends",
      valuesBasedDecisions: "Values-based decision opportunities",
    },
    settingsLink: "Organizational Courage",
    organizationalCourageLink: "Organizational Courage",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisatorisk mot", settingsLink: "Organisatorisk mot" }],
    ["sv", { ...i18nBlock(), title: "Organisatoriskt mod", settingsLink: "Organisatoriskt mod" }],
    ["da", { ...i18nBlock(), title: "Organisatorisk mod", settingsLink: "Organisatorisk mod" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalCourageCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalCourageCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalCourageLink = block.organizationalCourageLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_curiosity.view",', `"org_curiosity.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalCourageCenterEngine")) {
    c = c.replace(
      '| "organizationalCuriosityCenterEngine"',
      '| "organizationalCourageCenterEngine"\n  | "organizationalCuriosityCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalCuriosityCenterEngine", href: "/app/executive/organizational-curiosity", labelKey: "customerApp.nav.organizationalCuriosityCenterEngine" },',
      `{ id: "organizationalCourageCenterEngine", href: "/app/executive/organizational-courage", labelKey: "customerApp.nav.organizationalCourageCenterEngine" },
  { id: "organizationalCuriosityCenterEngine", href: "/app/executive/organizational-curiosity", labelKey: "customerApp.nav.organizationalCuriosityCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-curiosity")) return "organizationalCuriosityCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-courage")) return "organizationalCourageCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-curiosity")) return "organizationalCuriosityCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-courage-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalCourageLink")) {
    c = c.replace(
      "organizationalCuriosityLink: string;",
      "organizationalCuriosityLink: string;\n    organizationalCourageLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-curiosity" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalCuriosityLink}
        </Link>`,
      `<Link href="/app/executive/organizational-curiosity" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalCuriosityLink}
        </Link>
        <Link href="/app/executive/organizational-courage" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalCourageLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalCourageLink")) {
    p = p.replace(
      'organizationalCuriosityLink: t("customerApp.executive.organizationalCuriosityLink"),',
      'organizationalCuriosityLink: t("customerApp.executive.organizationalCuriosityLink"),\n        organizationalCourageLink: t("customerApp.executive.organizationalCourageLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Courage Center\nRoute: ${P.route}\nCore: Courage is not the absence of fear.\nHelpers: _occe_* · _occebp349_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Courage is not the absence of fear.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase348-vocabulary";',
      `export * from "./implementation-blueprint-phase348-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE348_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase348-aipify-organizational-curiosity-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE348_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase348-aipify-organizational-curiosity-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Courage Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_COURAGE_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_COURAGE_CENTER_ENGINE_PHASE${P.phase}.md) — Courage Center at Executive Center → Organizational Courage. Courage dashboard, difficult conversation engine, reviews, and executive courage view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_occe_*\`, \`_occebp349_*\`. APIs at \`/api/organizational-courage/*\`. Cross-links curiosity center.`;
  if (!c.includes("Organizational Courage Center Engine (Phase 349)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

function patchPendingMigrations() {
  const file = "/tmp/aipify-pending-migrations.json";
  const list = JSON.parse(fs.readFileSync(file, "utf8"));
  const entry = {
    file: P.migration,
    version: "20261427800000",
    name: "aipify_organizational_courage_center_engine_phase349",
  };
  if (!list.some((item) => item.file === P.migration || item === P.migration)) {
    list.push(entry);
    fs.writeFileSync(file, `${JSON.stringify(list, null, 2)}\n`);
    console.log("appended pending migration");
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_COURAGE_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Courage Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
