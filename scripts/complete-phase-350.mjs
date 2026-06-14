#!/usr/bin/env node
/** ABOS Phase 350 — Aipify Organizational Hope Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 350,
  migration: "20261427900000_aipify_organizational_hope_center_engine_phase350.sql",
  slug: "aipify-organizational-hope-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_HOPE_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase350-aipify-organizational-hope-center.txt",
  route: "/app/executive/organizational-hope",
  permKeys: ["org_hope.view", "org_hope.manage", "org_hope.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Hope",
    subtitle:
      "Cultivate realistic hope by strengthening confidence in the future through purpose, progress, resilience, learning, and collective belief in the organization's ability to overcome challenges and achieve meaningful outcomes.",
    loading: "Loading Hope Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Hope philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalCourageLink: "Organizational Courage →",
    dashboardTitle: "Hope dashboard",
    signalsTitle: "Hope engine",
    progressTitle: "Progress recognition engine",
    initiativesTitle: "Hope initiatives",
    reviewsTitle: "Hope reviews",
    timelineTitle: "Hope timeline",
    milestonesTitle: "Hope milestones",
    snapshotsTitle: "Hope snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive hope view",
    sessionsTitle: "Hope sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleReflection: "Schedule reflection session",
    completeInitiative: "Complete initiative",
    generateReport: "Generate hope report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export hope snapshot",
    coordinateDiscussion: "Coordinate leadership discussion",
    archiveMilestone: "Archive hope milestone",
    humansDecide:
      "Aipify supports grounded optimism — leaders retain honest communication; hope encourages realistic confidence without false promises, toxic positivity, or minimizing real challenges.",
    privacyNote: "Privacy",
    hopeScore: "Organizational hope score",
    progressIndicators: "Progress indicators",
    domains: {
      leadership: "Leadership hope",
      workforce: "Workforce hope",
      customer: "Customer hope",
      strategic: "Strategic hope",
      organizational: "Organizational hope",
      community: "Community hope",
    },
    signalTypes: {
      positive_momentum: "Positive momentum",
      future_confidence: "Future confidence",
      leadership_encouragement: "Leadership encouragement",
      resilience_development: "Resilience development",
      meaningful_progress: "Meaningful progress",
    },
    signalTones: {
      positive: "Positive indicator",
      neutral: "Neutral indicator",
      attention: "Needs attention",
    },
    progressTypes: {
      progress_made: "Progress made",
      strengths_emerged: "Strengths emerged",
      opportunities_available: "Opportunities available",
      confidence_forward: "Confidence forward",
      reinforce_resilience: "Reinforce resilience",
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
      hope_reinforcement_recommended: "Hope reinforcement recommended",
    },
    timelineTypes: {
      organizational_breakthrough: "Organizational breakthrough",
      recovery_milestone: "Recovery milestone",
      leadership_reflection: "Leadership reflection",
      strategic_achievement: "Strategic achievement",
      cultural_development: "Cultural development",
    },
    reviewTypes: {
      quarterly_hope: "Quarterly hope review",
      leadership_reflection: "Leadership reflection session",
      purpose_discussion: "Purpose discussion",
      annual_organizational_assessment: "Annual organizational assessment",
    },
    sessionTypes: {
      reflection_session: "Reflection session",
      purpose_discussion: "Purpose discussion",
      leadership_discussion: "Leadership discussion",
    },
    metrics: {
      progressRecognitionMetric: "Progress recognition",
      leadershipCommunication: "Leadership communication consistency",
      purposeAlignment: "Purpose alignment",
      learningParticipation: "Learning participation",
      organizationalResilienceMetric: "Organizational resilience",
      futureConfidence: "Future confidence trends",
      initiatives: "Initiatives in progress",
      reviews: "Reviews completed",
    },
    executiveFields: {
      leadershipConfidence: "Leadership confidence indicators",
      organizationalResilience: "Organizational resilience measures",
      progressRecognition: "Progress recognition trends",
      futureOpportunity: "Future opportunity perspectives",
    },
    settingsLink: "Organizational Hope",
    organizationalHopeLink: "Organizational Hope",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisatorisk håp", settingsLink: "Organisatorisk håp" }],
    ["sv", { ...i18nBlock(), title: "Organisatoriskt hopp", settingsLink: "Organisatoriskt hopp" }],
    ["da", { ...i18nBlock(), title: "Organisatorisk håb", settingsLink: "Organisatorisk håb" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalHopeCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalHopeCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalHopeLink = block.organizationalHopeLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_courage.view",', `"org_courage.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalHopeCenterEngine")) {
    c = c.replace(
      '| "organizationalCourageCenterEngine"',
      '| "organizationalHopeCenterEngine"\n  | "organizationalCourageCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalCourageCenterEngine", href: "/app/executive/organizational-courage", labelKey: "customerApp.nav.organizationalCourageCenterEngine" },',
      `{ id: "organizationalHopeCenterEngine", href: "/app/executive/organizational-hope", labelKey: "customerApp.nav.organizationalHopeCenterEngine" },
  { id: "organizationalCourageCenterEngine", href: "/app/executive/organizational-courage", labelKey: "customerApp.nav.organizationalCourageCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-courage")) return "organizationalCourageCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-hope")) return "organizationalHopeCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-courage")) return "organizationalCourageCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-hope-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalHopeLink")) {
    c = c.replace(
      "organizationalCourageLink: string;",
      "organizationalCourageLink: string;\n    organizationalHopeLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-courage" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalCourageLink}
        </Link>`,
      `<Link href="/app/executive/organizational-courage" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalCourageLink}
        </Link>
        <Link href="/app/executive/organizational-hope" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalHopeLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalHopeLink")) {
    p = p.replace(
      'organizationalCourageLink: t("customerApp.executive.organizationalCourageLink"),',
      'organizationalCourageLink: t("customerApp.executive.organizationalCourageLink"),\n        organizationalHopeLink: t("customerApp.executive.organizationalHopeLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Hope Center\nRoute: ${P.route}\nCore: Hope is not wishful thinking.\nHelpers: _oceh_* · _ocehbp350_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Hope is not wishful thinking.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase349-vocabulary";',
      `export * from "./implementation-blueprint-phase349-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE349_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase349-aipify-organizational-courage-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE349_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase349-aipify-organizational-courage-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Hope Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_HOPE_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_HOPE_CENTER_ENGINE_PHASE${P.phase}.md) — Hope Center at Executive Center → Organizational Hope. Hope dashboard, progress recognition engine, reviews, and executive hope view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_oceh_*\`, \`_ocehbp350_*\`. APIs at \`/api/organizational-hope/*\`. Cross-links courage center.`;
  if (!c.includes("Organizational Hope Center Engine (Phase 350)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

function patchPendingMigrations() {
  const file = "/tmp/aipify-pending-migrations.json";
  const list = JSON.parse(fs.readFileSync(file, "utf8"));
  const entry = {
    file: P.migration,
    version: "20261427900000",
    name: "aipify_organizational_hope_center_engine_phase350",
  };
  if (!list.some((item) => item.file === P.migration || item === P.migration)) {
    list.push(entry);
    fs.writeFileSync(file, `${JSON.stringify(list, null, 2)}\n`);
    console.log("appended pending migration");
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_HOPE_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Hope Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
