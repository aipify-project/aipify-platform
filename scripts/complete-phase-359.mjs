#!/usr/bin/env node
/** ABOS Phase 359 — Aipify Organizational Purposeful Execution Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 359,
  migration: "20261428700000_aipify_organizational_purposeful_execution_engine_phase359.sql",
  slug: "aipify-organizational-purposeful-execution-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_PURPOSEFUL_EXECUTION_ENGINE",
  ilmFile: "implementation-blueprint-phase359-aipify-organizational-purposeful-execution.txt",
  route: "/app/executive/purposeful-execution",
  permKeys: ["org_purposeful_execution.view", "org_purposeful_execution.manage", "org_purposeful_execution.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Purposeful Execution Center",
    subtitle:
      "Transform strategy, values and intentions into meaningful action through disciplined, aligned and sustainable execution.",
    loading: "Loading Purposeful Execution Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Purposeful execution philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalIdentityLink: "Organizational Identity →",
    organizationalStewardshipLink: "Organizational Stewardship →",
    dashboardTitle: "Purposeful execution dashboard",
    signalsTitle: "Execution engine",
    alignmentTitle: "Alignment engine",
    initiativesTitle: "Purposeful execution actions",
    reviewsTitle: "Purposeful execution reviews",
    timelineTitle: "Purposeful execution timeline",
    milestonesTitle: "Execution milestones",
    snapshotsTitle: "Execution snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive purposeful execution view",
    sessionsTitle: "Reflection sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleReflection: "Schedule reflection session",
    completeInitiative: "Complete initiative",
    generateReport: "Generate execution report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export execution snapshot",
    coordinateDiscussion: "Coordinate leadership discussion",
    archiveMilestone: "Archive execution milestone",
    archiveMilestoneDefaultTitle: "Strategic delivery milestone",
    archiveMilestoneDefaultSummary: "Execution milestone archived via Purposeful Execution Center.",
    humansDecide:
      "Aipify supports execution awareness — leaders retain responsibility; purposeful execution strengthens alignment without hustle culture or activity-based success metrics.",
    privacyNote: "Privacy",
    executionScore: "Organizational execution score",
    strategicDelivery: "Strategic delivery indicators",
    domains: {
      strategic: "Strategic execution",
      leadership: "Leadership execution",
      team: "Team execution",
      customer: "Customer execution",
      operational: "Operational execution",
      cultural: "Cultural execution",
    },
    signalTypes: {
      strong_execution_practices: "Strong execution practices",
      delivery_bottlenecks: "Delivery bottlenecks",
      accountability_strengths: "Accountability strengths",
      alignment_opportunities: "Alignment opportunities",
      sustainable_improvement_areas: "Sustainable improvement areas",
    },
    signalTones: {
      positive: "Positive indicator",
      neutral: "Neutral indicator",
      attention: "Needs attention",
    },
    alignmentTypes: {
      executing_right_priorities: "Executing the right priorities",
      teams_understand_why: "Teams understand why work matters",
      responsibilities_defined: "Responsibilities clearly defined",
      delivering_sustainably: "Delivering sustainably",
      execution_barriers: "Barriers to effective execution",
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
      execution_reinforcement_recommended: "Execution reinforcement recommended",
    },
    timelineTypes: {
      initiative_milestone: "Initiative milestone",
      delivery_achievement: "Delivery achievement",
      leadership_reflection: "Leadership reflection",
      accountability_improvement: "Accountability improvement",
      organizational_breakthrough: "Organizational breakthrough",
    },
    reviewTypes: {
      monthly_execution: "Monthly execution review",
      quarterly_strategic: "Quarterly strategic discussion",
      leadership_reflection: "Leadership reflection session",
      annual_delivery: "Annual delivery assessment",
    },
    sessionTypes: {
      reflection_session: "Reflection session",
      stewardship_session: "Stewardship session",
      leadership_discussion: "Leadership discussion",
    },
    metrics: {
      initiativeProgression: "Initiative progression",
      strategicDelivery: "Strategic delivery",
      accountabilityEffectiveness: "Accountability effectiveness",
      sustainablePacing: "Sustainable pacing",
      deliveryConsistency: "Delivery consistency",
      strategicAlignment: "Strategic alignment",
      leadershipParticipation: "Leadership participation",
      initiatives: "Initiatives in progress",
      reviews: "Reviews completed",
    },
    executiveFields: {
      strategicDelivery: "Strategic delivery indicators",
      leadershipAccountability: "Leadership accountability trends",
      initiativeMomentum: "Initiative momentum measures",
      executionImprovementOpportunities: "Execution improvement opportunities",
    },
    settingsLink: "Purposeful Execution",
    organizationalPurposefulExecutionLink: "Purposeful Execution",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Målrettet gjennomføringssenter", settingsLink: "Målrettet gjennomføring" }],
    ["sv", { ...i18nBlock(), title: "Målmedvetet genomförandecenter", settingsLink: "Målmedvetet genomförande" }],
    ["da", { ...i18nBlock(), title: "Målrettet gennemførelscenter", settingsLink: "Målrettet gennemførelse" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalPurposefulExecutionCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalPurposefulExecutionCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalPurposefulExecutionLink = block.organizationalPurposefulExecutionLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_presence.view",', `"org_presence.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalPurposefulExecutionCenterEngine")) {
    c = c.replace(
      '| "executionExcellenceCenterEngine"',
      '| "organizationalPurposefulExecutionCenterEngine"\n  | "executionExcellenceCenterEngine"',
    );
    c = c.replace(
      '{ id: "executionExcellenceCenterEngine", href: "/app/executive/execution-excellence", labelKey: "customerApp.nav.executionExcellenceCenterEngine" },',
      `{ id: "organizationalPurposefulExecutionCenterEngine", href: "/app/executive/purposeful-execution", labelKey: "customerApp.nav.organizationalPurposefulExecutionCenterEngine" },
  { id: "executionExcellenceCenterEngine", href: "/app/executive/execution-excellence", labelKey: "customerApp.nav.executionExcellenceCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/execution-excellence")) return "executionExcellenceCenterEngine";',
      'if (pathname.startsWith("/app/executive/purposeful-execution")) return "organizationalPurposefulExecutionCenterEngine";\n  if (pathname.startsWith("/app/executive/execution-excellence")) return "executionExcellenceCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-purposeful-execution-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
    console.log("patched tenant");
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalPurposefulExecutionLink")) {
    c = c.replace(
      "organizationalIdentityLink: string;",
      "organizationalIdentityLink: string;\n    organizationalPurposefulExecutionLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-identity" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalIdentityLink}
        </Link>`,
      `<Link href="/app/executive/organizational-identity" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalIdentityLink}
        </Link>
        <Link href="/app/executive/purposeful-execution" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalPurposefulExecutionLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalPurposefulExecutionLink")) {
    p = p.replace(
      'organizationalIdentityLink: t("customerApp.executive.organizationalIdentityLink"),',
      'organizationalIdentityLink: t("customerApp.executive.organizationalIdentityLink"),\n        organizationalPurposefulExecutionLink: t("customerApp.executive.organizationalPurposefulExecutionLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Purposeful Execution Engine\nRoute: ${P.route}\nCore: Vision without execution remains aspiration. Execution without purpose becomes activity without meaning.\nHelpers: _ope_* · _opebp359_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Vision without execution remains aspiration. Execution without purpose becomes activity without meaning.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase358-vocabulary";',
      `export * from "./implementation-blueprint-phase358-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE358_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase358-aipify-organizational-stewardship.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE358_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase358-aipify-organizational-stewardship.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Purposeful Execution Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_PURPOSEFUL_EXECUTION_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_PURPOSEFUL_EXECUTION_ENGINE_PHASE${P.phase}.md) — Purposeful Execution Center at Executive Center → Purposeful Execution. Execution dashboard, alignment engine, reviews, and executive view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_ope_*\`, \`_opebp359_*\`. APIs at \`/api/organizational-purposeful-execution/*\`. Cross-links identity and stewardship centers.`;
  if (!c.includes("Organizational Purposeful Execution Engine (Phase 359)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_PURPOSEFUL_EXECUTION_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Purposeful Execution Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
