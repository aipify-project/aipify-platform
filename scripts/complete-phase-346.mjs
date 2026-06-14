#!/usr/bin/env node
/** ABOS Phase 346 — Aipify Organizational Awareness Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 346,
  migration: "20261427500000_aipify_organizational_awareness_center_engine_phase346.sql",
  slug: "aipify-organizational-awareness-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_AWARENESS_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase346-aipify-organizational-awareness-center.txt",
  route: "/app/executive/organizational-awareness",
  permKeys: ["org_awareness.view", "org_awareness.manage", "org_awareness.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Awareness",
    subtitle:
      "Strengthen awareness of internal conditions, external environments, emerging opportunities, evolving risks, and organizational realities so leaders can respond with clarity and wisdom.",
    loading: "Loading Awareness Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Awareness philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalIntentionalityLink: "Organizational Intentionality →",
    dashboardTitle: "Awareness dashboard",
    signalsTitle: "Awareness engine",
    observationTitle: "Observation engine",
    initiativesTitle: "Awareness initiatives",
    reviewsTitle: "Awareness reviews",
    timelineTitle: "Awareness timeline",
    milestonesTitle: "Awareness milestones",
    snapshotsTitle: "Awareness snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive awareness view",
    sessionsTitle: "Awareness sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleReflection: "Schedule reflection session",
    completeInitiative: "Complete initiative",
    generateReport: "Generate awareness report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export awareness snapshot",
    coordinateReview: "Coordinate strategic discussion",
    archiveMilestone: "Archive awareness milestone",
    humansDecide:
      "Aipify supports attentive leadership — leaders retain judgment; awareness encourages observation without surveillance, hyper-vigilance, or fear-based oversight.",
    privacyNote: "Privacy",
    awarenessScore: "Organizational awareness score",
    emergingThemes: "Emerging themes identified",
    domains: {
      organizational: "Organizational awareness",
      strategic: "Strategic awareness",
      leadership: "Leadership awareness",
      customer: "Customer awareness",
      workforce: "Workforce awareness",
      risk: "Risk awareness",
    },
    signalTypes: {
      emerging_pattern: "Emerging pattern",
      significant_observation: "Significant observation",
      shifting_condition: "Shifting condition",
      hidden_dependency: "Hidden dependency",
      executive_attention: "Executive attention area",
    },
    signalTones: {
      positive: "Positive indicator",
      neutral: "Neutral indicator",
      attention: "Needs attention",
    },
    observationTypes: {
      what_noticing: "What are we noticing",
      what_overlooking: "What might we overlook",
      patterns_attention: "Patterns deserving attention",
      assumptions_revisit: "Assumptions to revisit",
      emerging_developments: "Emerging developments",
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
      awareness_improvement_recommended: "Awareness improvement recommended",
    },
    timelineTypes: {
      emerging_theme: "Emerging theme identified",
      leadership_reflection: "Leadership reflection",
      strategic_observation: "Strategic observation",
      organizational_insight: "Organizational insight",
      learning_development: "Learning development",
    },
    reviewTypes: {
      monthly_awareness: "Monthly awareness review",
      quarterly_strategic: "Quarterly strategic discussion",
      leadership_reflection: "Leadership reflection session",
      annual_organizational_assessment: "Annual organizational assessment",
    },
    sessionTypes: {
      reflection_session: "Reflection session",
      strategic_discussion: "Strategic discussion",
      organizational_assessment: "Organizational assessment",
    },
    metrics: {
      reflectionParticipation: "Reflection participation",
      reviewDiscipline: "Review discipline",
      environmentalScanning: "Environmental scanning effectiveness",
      insightUtilization: "Organizational insight utilization",
      leadershipResponsiveness: "Leadership responsiveness",
      strategicObservations: "Strategic observations",
      initiatives: "Initiatives in progress",
      reviews: "Reviews completed",
    },
    executiveFields: {
      leadershipAttentiveness: "Leadership attentiveness indicators",
      strategicObservation: "Strategic observation trends",
      environmentalAwareness: "Environmental awareness measures",
      insightOpportunities: "Organizational insight opportunities",
    },
    settingsLink: "Organizational Awareness",
    organizationalAwarenessLink: "Organizational Awareness",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisatorisk bevissthet", settingsLink: "Organisatorisk bevissthet" }],
    ["sv", { ...i18nBlock(), title: "Organisatorisk medvetenhet", settingsLink: "Organisatorisk medvetenhet" }],
    ["da", { ...i18nBlock(), title: "Organisatorisk bevidsthed", settingsLink: "Organisatorisk bevidsthed" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalAwarenessCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalAwarenessCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalAwarenessLink = block.organizationalAwarenessLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_intentionality.view",', `"org_intentionality.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalAwarenessCenterEngine")) {
    c = c.replace(
      '| "organizationalIntentionalityCenterEngine"',
      '| "organizationalAwarenessCenterEngine"\n  | "organizationalIntentionalityCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalIntentionalityCenterEngine", href: "/app/executive/organizational-intentionality", labelKey: "customerApp.nav.organizationalIntentionalityCenterEngine" },',
      `{ id: "organizationalAwarenessCenterEngine", href: "/app/executive/organizational-awareness", labelKey: "customerApp.nav.organizationalAwarenessCenterEngine" },
  { id: "organizationalIntentionalityCenterEngine", href: "/app/executive/organizational-intentionality", labelKey: "customerApp.nav.organizationalIntentionalityCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-intentionality")) return "organizationalIntentionalityCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-awareness")) return "organizationalAwarenessCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-intentionality")) return "organizationalIntentionalityCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-awareness-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalAwarenessLink")) {
    c = c.replace(
      "organizationalIntentionalityLink: string;",
      "organizationalIntentionalityLink: string;\n    organizationalAwarenessLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-intentionality" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalIntentionalityLink}
        </Link>`,
      `<Link href="/app/executive/organizational-intentionality" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalIntentionalityLink}
        </Link>
        <Link href="/app/executive/organizational-awareness" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalAwarenessLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalAwarenessLink")) {
    p = p.replace(
      'organizationalIntentionalityLink: t("customerApp.executive.organizationalIntentionalityLink"),',
      'organizationalIntentionalityLink: t("customerApp.executive.organizationalIntentionalityLink"),\n        organizationalAwarenessLink: t("customerApp.executive.organizationalAwarenessLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Awareness Center\nRoute: ${P.route}\nCore: Organizations cannot respond effectively to what they fail to notice.\nHelpers: _oac_* · _oacbp346_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Organizations cannot respond effectively to what they fail to notice.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase345-vocabulary";',
      `export * from "./implementation-blueprint-phase345-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE345_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase345-aipify-organizational-intentionality-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE345_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase345-aipify-organizational-intentionality-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Awareness Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_AWARENESS_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_AWARENESS_CENTER_ENGINE_PHASE${P.phase}.md) — Awareness Center at Executive Center → Organizational Awareness. Awareness dashboard, awareness engine, observation engine, reviews, and executive awareness view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_oac_*\`, \`_oacbp346_*\`. APIs at \`/api/organizational-awareness/*\`. Cross-links intentionality and clarity centers.`;
  if (!c.includes("Organizational Awareness Center Engine (Phase 346)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

function patchPendingMigrations() {
  const file = "/tmp/aipify-pending-migrations.json";
  const list = JSON.parse(fs.readFileSync(file, "utf8"));
  const entry = {
    file: P.migration,
    version: "20261427500000",
    name: "aipify_organizational_awareness_center_engine_phase346",
  };
  if (!list.some((item) => item.file === P.migration || item === P.migration)) {
    list.push(entry);
    fs.writeFileSync(file, `${JSON.stringify(list, null, 2)}\n`);
    console.log("appended pending migration");
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_AWARENESS_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Awareness Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
