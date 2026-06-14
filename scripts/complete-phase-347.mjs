#!/usr/bin/env node
/** ABOS Phase 347 — Aipify Organizational Harmony Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 347,
  migration: "20261427600000_aipify_organizational_harmony_center_engine_phase347.sql",
  slug: "aipify-organizational-harmony-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_HARMONY_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase347-aipify-organizational-harmony-center.txt",
  route: "/app/executive/organizational-harmony",
  permKeys: ["org_harmony.view", "org_harmony.manage", "org_harmony.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Harmony",
    subtitle:
      "Strengthen harmony between people, teams, leadership, systems, priorities, and ways of working so progress occurs through cooperation rather than friction.",
    loading: "Loading Harmony Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Harmony philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalAwarenessLink: "Organizational Awareness →",
    dashboardTitle: "Harmony dashboard",
    signalsTitle: "Harmony engine",
    dialogueTitle: "Constructive dialogue engine",
    initiativesTitle: "Harmony initiatives",
    reviewsTitle: "Harmony reviews",
    timelineTitle: "Harmony timeline",
    milestonesTitle: "Harmony milestones",
    snapshotsTitle: "Harmony snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive harmony view",
    sessionsTitle: "Harmony sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleWorkshop: "Schedule collaboration workshop",
    completeInitiative: "Complete initiative",
    generateReport: "Generate harmony report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export harmony snapshot",
    coordinateReview: "Coordinate leadership discussion",
    archiveMilestone: "Archive harmony milestone",
    humansDecide:
      "Aipify supports healthy collaboration — leaders retain responsibility; harmony welcomes disagreement without artificial consensus, conflict avoidance, or suppressing diverse perspectives.",
    privacyNote: "Privacy",
    harmonyScore: "Organizational harmony score",
    collaborationIndicators: "Collaboration indicators",
    domains: {
      team: "Team harmony",
      leadership: "Leadership harmony",
      cross_functional: "Cross-functional harmony",
      customer: "Customer harmony",
      cultural: "Cultural harmony",
      operational: "Operational harmony",
    },
    signalTypes: {
      collaboration_strength: "Collaboration strength",
      cross_functional_friction: "Cross-functional friction",
      communication_breakdown: "Communication breakdown",
      shared_success_opportunity: "Shared success opportunity",
      relationship_development: "Relationship development",
    },
    signalTones: {
      positive: "Positive indicator",
      neutral: "Neutral indicator",
      attention: "Needs attention",
    },
    dialogueTypes: {
      diverse_perspectives: "Diverse perspectives",
      respectful_disagreement: "Respectful disagreement",
      shared_goals_alignment: "Shared goals alignment",
      communication_effectiveness: "Communication effectiveness",
      relationship_support: "Relationship support",
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
      harmony_improvement_recommended: "Harmony improvement recommended",
    },
    timelineTypes: {
      collaboration_milestone: "Collaboration milestone",
      leadership_reflection: "Leadership reflection",
      cross_functional_achievement: "Cross-functional achievement",
      cultural_development: "Cultural development",
      organizational_breakthrough: "Organizational breakthrough",
    },
    reviewTypes: {
      quarterly_harmony: "Quarterly harmony review",
      leadership_reflection: "Leadership reflection session",
      cross_functional_discussion: "Cross-functional discussion",
      annual_organizational_assessment: "Annual organizational assessment",
    },
    sessionTypes: {
      collaboration_workshop: "Collaboration workshop",
      leadership_discussion: "Leadership discussion",
      organizational_assessment: "Organizational assessment",
    },
    metrics: {
      collaborationEffectiveness: "Collaboration effectiveness",
      leadershipConsistency: "Leadership consistency",
      crossFunctionalCooperation: "Cross-functional cooperation",
      communicationQuality: "Communication quality",
      sharedOwnership: "Shared ownership participation",
      crossFunctionalAlignment: "Cross-functional alignment",
      initiatives: "Initiatives in progress",
      reviews: "Reviews completed",
    },
    executiveFields: {
      leadershipAlignment: "Leadership alignment indicators",
      collaborationEffectiveness: "Collaboration effectiveness measures",
      crossFunctionalRelationships: "Cross-functional relationship trends",
      cohesionOpportunities: "Organizational cohesion opportunities",
    },
    settingsLink: "Organizational Harmony",
    organizationalHarmonyLink: "Organizational Harmony",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisatorisk harmoni", settingsLink: "Organisatorisk harmoni" }],
    ["sv", { ...i18nBlock(), title: "Organisatorisk harmoni", settingsLink: "Organisatorisk harmoni" }],
    ["da", { ...i18nBlock(), title: "Organisatorisk harmoni", settingsLink: "Organisatorisk harmoni" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalHarmonyCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalHarmonyCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalHarmonyLink = block.organizationalHarmonyLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_awareness.view",', `"org_awareness.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalHarmonyCenterEngine")) {
    c = c.replace(
      '| "organizationalAwarenessCenterEngine"',
      '| "organizationalHarmonyCenterEngine"\n  | "organizationalAwarenessCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalAwarenessCenterEngine", href: "/app/executive/organizational-awareness", labelKey: "customerApp.nav.organizationalAwarenessCenterEngine" },',
      `{ id: "organizationalHarmonyCenterEngine", href: "/app/executive/organizational-harmony", labelKey: "customerApp.nav.organizationalHarmonyCenterEngine" },
  { id: "organizationalAwarenessCenterEngine", href: "/app/executive/organizational-awareness", labelKey: "customerApp.nav.organizationalAwarenessCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-awareness")) return "organizationalAwarenessCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-harmony")) return "organizationalHarmonyCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-awareness")) return "organizationalAwarenessCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-harmony-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalHarmonyLink")) {
    c = c.replace(
      "organizationalAwarenessLink: string;",
      "organizationalAwarenessLink: string;\n    organizationalHarmonyLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-awareness" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalAwarenessLink}
        </Link>`,
      `<Link href="/app/executive/organizational-awareness" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalAwarenessLink}
        </Link>
        <Link href="/app/executive/organizational-harmony" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalHarmonyLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalHarmonyLink")) {
    p = p.replace(
      'organizationalAwarenessLink: t("customerApp.executive.organizationalAwarenessLink"),',
      'organizationalAwarenessLink: t("customerApp.executive.organizationalAwarenessLink"),\n        organizationalHarmonyLink: t("customerApp.executive.organizationalHarmonyLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Harmony Center\nRoute: ${P.route}\nCore: High-performing organizations work through differences while preserving trust and shared purpose.\nHelpers: _ohc_* · _ohcbp347_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "High-performing organizations work through differences while preserving trust and shared purpose.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase346-vocabulary";',
      `export * from "./implementation-blueprint-phase346-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE346_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase346-aipify-organizational-awareness-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE346_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase346-aipify-organizational-awareness-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Harmony Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_HARMONY_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_HARMONY_CENTER_ENGINE_PHASE${P.phase}.md) — Harmony Center at Executive Center → Organizational Harmony. Harmony dashboard, harmony engine, constructive dialogue engine, reviews, and executive harmony view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_ohc_*\`, \`_ohcbp347_*\`. APIs at \`/api/organizational-harmony/*\`. Cross-links awareness and intentionality centers.`;
  if (!c.includes("Organizational Harmony Center Engine (Phase 347)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

function patchPendingMigrations() {
  const file = "/tmp/aipify-pending-migrations.json";
  const list = JSON.parse(fs.readFileSync(file, "utf8"));
  const entry = {
    file: P.migration,
    version: "20261427600000",
    name: "aipify_organizational_harmony_center_engine_phase347",
  };
  if (!list.some((item) => item.file === P.migration || item === P.migration)) {
    list.push(entry);
    fs.writeFileSync(file, `${JSON.stringify(list, null, 2)}\n`);
    console.log("appended pending migration");
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_HARMONY_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Harmony Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
