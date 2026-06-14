#!/usr/bin/env node
/** ABOS Phase 363 — Aipify Organizational Signal Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 363,
  migration: "20261429100000_aipify_organizational_signal_engine_phase363.sql",
  slug: "aipify-organizational-signal-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_SIGNAL_ENGINE",
  ilmFile: "implementation-blueprint-phase363-aipify-organizational-signal.txt",
  route: "/app/executive/organizational-signals",
  permKeys: ["org_signal.view", "org_signal.manage", "org_signal.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Signal Center",
    subtitle:
      "Detect, interpret and respond to meaningful organizational signals before they become significant opportunities or major problems.",
    loading: "Loading Signal Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Signal philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalFocusLink: "Organizational Focus →",
    organizationalSimplicityLink: "Organizational Simplicity →",
    organizationalClarityLink: "Organizational Clarity →",
    dashboardTitle: "Signal dashboard",
    signalsTitle: "Signal engine",
    interpretationTitle: "Signal interpretation engine",
    initiativesTitle: "Signal actions",
    reviewsTitle: "Signal reviews",
    timelineTitle: "Signal timeline",
    milestonesTitle: "Signal milestones",
    snapshotsTitle: "Signal snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive signal view",
    sessionsTitle: "Signal sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleReflection: "Schedule reflection session",
    completeInitiative: "Complete initiative",
    generateReport: "Generate signal report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export signal snapshot",
    coordinateDiscussion: "Coordinate leadership discussion",
    archiveMilestone: "Archive signal milestone",
    archiveMilestoneDefaultTitle: "Organizational signal milestone",
    archiveMilestoneDefaultSummary: "Signal milestone archived via Signal Center.",
    humansDecide:
      "Aipify supports signal awareness — leaders retain judgment; signals are indicators, not certainties.",
    privacyNote: "Privacy",
    signalScore: "Organizational signal health score",
    emergingThemes: "Emerging themes detected",
    domains: {
      customer: "Customer signals",
      workforce: "Workforce signals",
      leadership: "Leadership signals",
      strategic: "Strategic signals",
      operational: "Operational signals",
      external: "External signals",
    },
    signalTypes: {
      weak_signals: "Weak signals",
      emerging_trends: "Emerging trends",
      repeating_patterns: "Repeating patterns",
      discussion_areas: "Areas requiring discussion",
      proactive_opportunities: "Proactive action opportunities",
    },
    signalTones: {
      positive: "Positive indicator",
      neutral: "Neutral indicator",
      attention: "Warrants attention",
    },
    interpretationTypes: {
      what_patterns_emerging: "What patterns are emerging",
      observations_deserve_attention: "Observations deserving attention",
      additional_context_needed: "Additional context needed",
      signals_as_opportunities: "Signals as opportunities",
      responding_proportionately: "Responding proportionately",
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
      signal_awareness_recommended: "Signal awareness recommended",
    },
    timelineTypes: {
      emerging_trend: "Emerging trend",
      leadership_reflection: "Leadership reflection",
      strategic_observation: "Strategic observation",
      organizational_response: "Organizational response",
      learning_development: "Learning development",
    },
    reviewTypes: {
      monthly_signal: "Monthly signal review",
      quarterly_strategic: "Quarterly strategic discussion",
      leadership_reflection: "Leadership reflection session",
      annual_assessment: "Annual organizational assessment",
    },
    sessionTypes: {
      reflection_session: "Reflection session",
      strategic_discussion: "Strategic discussion",
      leadership_session: "Leadership session",
    },
    metrics: {
      significantTrends: "Significant trends observed",
      executiveAttention: "Executive attention recommendations",
      observationEffectiveness: "Observation effectiveness",
      reflectionParticipation: "Reflection participation",
      responseReadiness: "Response readiness",
      patternAwareness: "Pattern awareness",
      learningIntegration: "Learning integration",
      initiatives: "Initiatives in progress",
      reviews: "Reviews completed",
    },
    executiveFields: {
      emergingThemes: "Emerging organizational themes",
      strategicObservation: "Strategic observation indicators",
      responseReadiness: "Response readiness measures",
      opportunityAwareness: "Opportunity awareness trends",
    },
    settingsLink: "Organizational Signals",
    organizationalSignalLink: "Organizational Signals",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Signalsenter", settingsLink: "Organisatoriske signaler" }],
    ["sv", { ...i18nBlock(), title: "Signalcenter", settingsLink: "Organisatoriska signaler" }],
    ["da", { ...i18nBlock(), title: "Signalcenter", settingsLink: "Organisatoriske signaler" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalSignalCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalSignalCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalSignalLink = block.organizationalSignalLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_simplicity.view",', `"org_simplicity.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalSignalCenterEngine")) {
    c = c.replace(
      '| "organizationalSimplicityCenterEngine"',
      '| "organizationalSignalCenterEngine"\n  | "organizationalSimplicityCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalSimplicityCenterEngine", href: "/app/executive/organizational-simplicity", labelKey: "customerApp.nav.organizationalSimplicityCenterEngine" },',
      `{ id: "organizationalSignalCenterEngine", href: "/app/executive/organizational-signals", labelKey: "customerApp.nav.organizationalSignalCenterEngine" },
  { id: "organizationalSimplicityCenterEngine", href: "/app/executive/organizational-simplicity", labelKey: "customerApp.nav.organizationalSimplicityCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-simplicity")) return "organizationalSimplicityCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-signals")) return "organizationalSignalCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-simplicity")) return "organizationalSimplicityCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-signal-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalSignalLink")) {
    c = c.replace(
      "organizationalSimplicityLink: string;",
      "organizationalSimplicityLink: string;\n    organizationalSignalLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-simplicity" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalSimplicityLink}
        </Link>`,
      `<Link href="/app/executive/organizational-simplicity" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalSimplicityLink}
        </Link>
        <Link href="/app/executive/organizational-signals" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalSignalLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalSignalLink")) {
    p = p.replace(
      'organizationalSimplicityLink: t("customerApp.executive.organizationalSimplicityLink"),',
      'organizationalSimplicityLink: t("customerApp.executive.organizationalSimplicityLink"),\n        organizationalSignalLink: t("customerApp.executive.organizationalSignalLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Signal Engine\nRoute: ${P.route}\nCore: Organizations rarely fail without warning. Signals appear long before outcomes become visible.\nHelpers: _osig_* · _osigbp363_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Organizations rarely fail without warning. Signals appear long before outcomes become visible.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase362-vocabulary";',
      `export * from "./implementation-blueprint-phase362-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE362_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase362-aipify-organizational-simplicity.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE362_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase362-aipify-organizational-simplicity.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Signal Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_SIGNAL_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_SIGNAL_ENGINE_PHASE${P.phase}.md) — Signal Center at Executive Center → Organizational Signals. Signal dashboard, interpretation engine, reviews, and executive view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_osig_*\`, \`_osigbp363_*\`. APIs at \`/api/organizational-signal/*\`. Cross-links focus, simplicity, and clarity centers.`;
  if (!c.includes("Organizational Signal Engine (Phase 363)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_SIGNAL_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Signal Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
console.log(`Phase ${P.phase} complete`);
