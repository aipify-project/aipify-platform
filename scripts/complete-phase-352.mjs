#!/usr/bin/env node
/** ABOS Phase 352 — Aipify Organizational Adaptive Intelligence Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 352,
  migration: "20261428100000_aipify_organizational_adaptive_intelligence_center_engine_phase352.sql",
  slug: "aipify-organizational-adaptive-intelligence-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_ADAPTIVE_INTELLIGENCE_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase352-aipify-organizational-adaptive-intelligence-center.txt",
  route: "/app/executive/organizational-adaptive-intelligence",
  permKeys: ["org_adaptive_intelligence.view", "org_adaptive_intelligence.manage", "org_adaptive_intelligence.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Adaptive Intelligence",
    subtitle:
      "Help your organization sense, interpret, learn from, and respond intelligently to changing conditions while preserving strategic coherence and identity.",
    loading: "Loading Adaptive Intelligence Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Adaptive intelligence philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalWisdomTransferLink: "Organizational Wisdom Transfer →",
    dashboardTitle: "Adaptive intelligence dashboard",
    signalsTitle: "Adaptive intelligence engine",
    learningApplicationTitle: "Learning application engine",
    initiativesTitle: "Adaptive intelligence initiatives",
    reviewsTitle: "Adaptive intelligence reviews",
    timelineTitle: "Adaptive intelligence timeline",
    milestonesTitle: "Adaptive intelligence milestones",
    snapshotsTitle: "Adaptive intelligence snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive adaptive intelligence view",
    sessionsTitle: "Adaptive intelligence sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleReflection: "Schedule reflection session",
    completeInitiative: "Complete initiative",
    generateReport: "Generate adaptive intelligence report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export adaptive intelligence snapshot",
    coordinateDiscussion: "Coordinate leadership discussion",
    archiveMilestone: "Archive adaptive intelligence milestone",
    humansDecide:
      "Aipify supports intelligent evolution — leaders retain judgment; adaptation is intentional growth, never reactive change or abandonment of identity.",
    privacyNote: "Privacy",
    adaptiveIntelligenceScore: "Organizational adaptive intelligence score",
    capabilityEvolutionMetric: "Capability evolution",
    domains: {
      strategic: "Strategic adaptive intelligence",
      leadership: "Leadership adaptive intelligence",
      operational: "Operational adaptive intelligence",
      customer: "Customer adaptive intelligence",
      workforce: "Workforce adaptive intelligence",
      organizational: "Organizational adaptive intelligence",
    },
    signalTypes: {
      emerging_capabilities: "Emerging capabilities",
      learning_applications: "Learning applications",
      positive_adaptation: "Positive adaptation",
      strategic_responsiveness: "Strategic responsiveness",
      high_value_adjustments: "High-value adjustments",
    },
    signalTones: {
      positive: "Positive indicator",
      neutral: "Neutral indicator",
      attention: "Needs attention",
    },
    learningApplicationTypes: {
      recent_learning: "Recent learning",
      applying_lessons: "Applying lessons",
      capability_development: "Capability development",
      strengthening_adaptations: "Strengthening adaptations",
      unchanged_practices: "Unchanged practices",
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
      adaptation_opportunities_identified: "Adaptation opportunities identified",
    },
    timelineTypes: {
      learning_breakthrough: "Learning breakthrough",
      strategic_adaptation: "Strategic adaptation",
      capability_development: "Capability development",
      leadership_reflection: "Leadership reflection",
      organizational_milestone: "Organizational milestone",
    },
    reviewTypes: {
      quarterly_adaptive_intelligence: "Quarterly adaptive intelligence review",
      leadership_reflection: "Leadership reflection session",
      strategic_learning_discussion: "Strategic learning discussion",
      annual_organizational_assessment: "Annual organizational assessment",
    },
    sessionTypes: {
      reflection_session: "Reflection session",
      strategic_learning_discussion: "Strategic learning discussion",
      leadership_discussion: "Leadership discussion",
    },
    metrics: {
      learningEffectiveness: "Learning effectiveness",
      reflectionParticipation: "Reflection participation",
      strategicResponsivenessMetric: "Strategic responsiveness",
      capabilityEvolutionMetric: "Capability evolution",
      decisionAdaptability: "Decision adaptability",
      responsivenessTrends: "Responsiveness trends",
      initiatives: "Initiatives in progress",
      reviews: "Reviews completed",
    },
    executiveFields: {
      leadershipLearning: "Leadership learning indicators",
      strategicResponsiveness: "Strategic responsiveness measures",
      capabilityEvolution: "Capability evolution trends",
      futureReadiness: "Future readiness opportunities",
    },
    settingsLink: "Organizational Adaptive Intelligence",
    organizationalAdaptiveIntelligenceLink: "Organizational Adaptive Intelligence",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisatorisk adaptiv intelligens", settingsLink: "Organisatorisk adaptiv intelligens" }],
    ["sv", { ...i18nBlock(), title: "Organisatorisk adaptiv intelligens", settingsLink: "Organisatorisk adaptiv intelligens" }],
    ["da", { ...i18nBlock(), title: "Organisatorisk adaptiv intelligens", settingsLink: "Organisatorisk adaptiv intelligens" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalAdaptiveIntelligenceCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalAdaptiveIntelligenceCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalAdaptiveIntelligenceLink = block.organizationalAdaptiveIntelligenceLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_wisdom_transfer.view",', `"org_wisdom_transfer.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalAdaptiveIntelligenceCenterEngine")) {
    c = c.replace(
      '| "organizationalWisdomTransferCenterEngine"',
      '| "organizationalAdaptiveIntelligenceCenterEngine"\n  | "organizationalWisdomTransferCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalWisdomTransferCenterEngine", href: "/app/executive/organizational-wisdom-transfer", labelKey: "customerApp.nav.organizationalWisdomTransferCenterEngine" },',
      `{ id: "organizationalAdaptiveIntelligenceCenterEngine", href: "/app/executive/organizational-adaptive-intelligence", labelKey: "customerApp.nav.organizationalAdaptiveIntelligenceCenterEngine" },
  { id: "organizationalWisdomTransferCenterEngine", href: "/app/executive/organizational-wisdom-transfer", labelKey: "customerApp.nav.organizationalWisdomTransferCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-wisdom-transfer")) return "organizationalWisdomTransferCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-adaptive-intelligence")) return "organizationalAdaptiveIntelligenceCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-wisdom-transfer")) return "organizationalWisdomTransferCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-adaptive-intelligence-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalAdaptiveIntelligenceLink")) {
    c = c.replace(
      "organizationalWisdomTransferLink: string;",
      "organizationalWisdomTransferLink: string;\n    organizationalAdaptiveIntelligenceLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-wisdom-transfer" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalWisdomTransferLink}
        </Link>`,
      `<Link href="/app/executive/organizational-wisdom-transfer" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalWisdomTransferLink}
        </Link>
        <Link href="/app/executive/organizational-adaptive-intelligence" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalAdaptiveIntelligenceLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalAdaptiveIntelligenceLink")) {
    p = p.replace(
      'organizationalWisdomTransferLink: t("customerApp.executive.organizationalWisdomTransferLink"),',
      'organizationalWisdomTransferLink: t("customerApp.executive.organizationalWisdomTransferLink"),\n        organizationalAdaptiveIntelligenceLink: t("customerApp.executive.organizationalAdaptiveIntelligenceLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Adaptive Intelligence Center\nRoute: ${P.route}\nCore: Intelligence is demonstrated by how effectively an organization learns, adapts, and responds over time.\nHelpers: _ocai_* · _ocaibp352_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Intelligence is demonstrated by how effectively an organization learns, adapts, and responds over time.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase351-vocabulary";',
      `export * from "./implementation-blueprint-phase351-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE351_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase351-aipify-organizational-wisdom-transfer-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE351_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase351-aipify-organizational-wisdom-transfer-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Adaptive Intelligence Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_ADAPTIVE_INTELLIGENCE_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_ADAPTIVE_INTELLIGENCE_CENTER_ENGINE_PHASE${P.phase}.md) — Adaptive Intelligence Center at Executive Center → Organizational Adaptive Intelligence. Adaptive intelligence dashboard, learning application engine, reviews, and executive view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_ocai_*\`, \`_ocaibp352_*\`. APIs at \`/api/organizational-adaptive-intelligence/*\`. Cross-links wisdom transfer center.`;
  if (!c.includes("Organizational Adaptive Intelligence Center Engine (Phase 352)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

function patchPendingMigrations() {
  const file = "/tmp/aipify-pending-migrations.json";
  const list = JSON.parse(fs.readFileSync(file, "utf8"));
  const entry = {
    file: P.migration,
    version: "20261428100000",
    name: "aipify_organizational_adaptive_intelligence_center_engine_phase352",
  };
  if (!list.some((item) => item.file === P.migration || item === P.migration)) {
    list.push(entry);
    fs.writeFileSync(file, `${JSON.stringify(list, null, 2)}\n`);
    console.log("appended pending migration");
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_ADAPTIVE_INTELLIGENCE_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Adaptive Intelligence Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
