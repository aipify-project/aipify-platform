#!/usr/bin/env node
/** ABOS Phase 331 — Aipify Organizational Futures Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 331,
  migration: "20261425900000_aipify_organizational_futures_center_engine_phase331.sql",
  slug: "aipify-organizational-futures-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_FUTURES_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase331-aipify-organizational-futures-center.txt",
  route: "/app/executive/organizational-futures",
  permKeys: ["org_futures.view", "org_futures.manage", "org_futures.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Futures",
    subtitle:
      "Explore possible futures, strengthen preparedness, improve long-term thinking, and make more informed strategic decisions in the face of uncertainty.",
    loading: "Loading Futures Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Futures philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalMomentumLink: "Organizational Momentum →",
    organizationalTrustLink: "Organizational Trust →",
    organizationalStewardshipLink: "Organizational Stewardship →",
    organizationalSimplicityLink: "Organizational Simplicity →",
    organizationalPurposeLink: "Organizational Purpose →",
    dashboardTitle: "Futures dashboard",
    scenariosTitle: "Scenario exploration",
    signalsTitle: "Signal detection",
    readinessTitle: "Readiness engine",
    reviewsTitle: "Futures reviews",
    timelineTitle: "Futures timeline",
    archivesTitle: "Archived scenarios",
    snapshotsTitle: "Foresight snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive futures view",
    sessionsTitle: "Futures sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleWorkshop: "Schedule executive workshop",
    exploreScenario: "Mark scenario explored",
    generateReport: "Generate futures report",
    printSummary: "Print scenario summary",
    exportSnapshot: "Export foresight snapshot",
    coordinateReflection: "Coordinate leadership reflection",
    archiveHistory: "Archive scenario history",
    humansDecide: "Aipify supports thoughtful exploration — leadership owns strategic judgment and preparedness decisions.",
    privacyNote: "Privacy",
    readinessScore: "Future readiness score",
    domains: {
      market: "Market futures",
      technology: "Technology futures",
      workforce: "Workforce futures",
      customer: "Customer futures",
      organizational: "Organizational futures",
    },
    scenarioTypes: {
      best_case: "Best case scenario",
      expected: "Expected scenario",
      challenging: "Challenging scenario",
      transformational: "Transformational scenario",
    },
    scenarioStatuses: {
      draft: "Draft",
      explored: "Explored",
    },
    signalTypes: {
      emerging_opportunity: "Emerging opportunity",
      environmental_shift: "Environmental shift",
      customer_change: "Customer change",
      technology_development: "Technology development",
      workforce_transition: "Workforce transition",
    },
    signalTones: {
      positive: "Positive signal",
      neutral: "Neutral signal",
      attention: "Needs attention",
    },
    readinessLevels: {
      highly_prepared: "Highly prepared",
      prepared: "Prepared",
      developing: "Developing",
      limited_readiness: "Limited readiness",
      review_recommended: "Review recommended",
    },
    readinessDimensions: {
      capabilities: "Capabilities",
      governance: "Governance",
      technology: "Technology",
      leadership: "Leadership",
      knowledge: "Knowledge",
      strategic_flexibility: "Strategic flexibility",
    },
    healthLabels: {
      highly_prepared: "Highly prepared",
      prepared: "Prepared",
      developing: "Developing",
      limited_readiness: "Limited readiness",
      review_recommended: "Review recommended",
    },
    timelineTypes: {
      scenario_explored: "Scenario explored",
      signal_detected: "Signal detected",
      strategic_adjustment: "Strategic adjustment",
      preparedness_initiative: "Preparedness initiative",
      executive_reflection: "Executive reflection",
    },
    reviewTypes: {
      quarterly_futures: "Quarterly futures discussion",
      annual_scenario_planning: "Annual scenario planning",
      strategic_foresight: "Strategic foresight workshop",
      executive_reflection: "Executive reflection meeting",
    },
    sessionTypes: {
      executive_workshop: "Executive workshop",
      leadership_reflection: "Leadership reflection",
      scenario_planning: "Scenario planning",
    },
    metrics: {
      scenariosExplored: "Scenarios explored",
      signals: "Signals identified",
      preparedness: "Preparedness initiatives",
      reviews: "Review participation",
      capabilities: "Capabilities readiness",
      technology: "Technology readiness",
      flexibility: "Strategic flexibility",
      confidence: "Executive confidence",
    },
    executiveFields: {
      scenarioReadiness: "Scenario readiness",
      resilience: "Strategic resilience",
      signals: "Emerging signals",
      opportunities: "Long-term opportunities",
    },
    settingsLink: "Organizational Futures",
    organizationalFuturesLink: "Organizational Futures",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisatorisk fremtid", settingsLink: "Organisatorisk fremtid" }],
    ["sv", { ...i18nBlock(), title: "Organisatorisk framtid", settingsLink: "Organisatorisk framtid" }],
    ["da", { ...i18nBlock(), title: "Organisatorisk fremtid", settingsLink: "Organisatorisk fremtid" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalFuturesCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalFuturesCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalFuturesLink = block.organizationalFuturesLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_momentum.view",', `"org_momentum.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalFuturesCenterEngine")) {
    c = c.replace(
      '| "organizationalMomentumCenterEngine"',
      '| "organizationalFuturesCenterEngine"\n  | "organizationalMomentumCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalMomentumCenterEngine", href: "/app/executive/organizational-momentum", labelKey: "customerApp.nav.organizationalMomentumCenterEngine" },',
      `{ id: "organizationalFuturesCenterEngine", href: "/app/executive/organizational-futures", labelKey: "customerApp.nav.organizationalFuturesCenterEngine" },
  { id: "organizationalMomentumCenterEngine", href: "/app/executive/organizational-momentum", labelKey: "customerApp.nav.organizationalMomentumCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-momentum")) return "organizationalMomentumCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-futures")) return "organizationalFuturesCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-momentum")) return "organizationalMomentumCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-futures-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalFuturesLink")) {
    c = c.replace(
      "organizationalMomentumLink: string;",
      "organizationalMomentumLink: string;\n    organizationalFuturesLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-momentum" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalMomentumLink}
        </Link>`,
      `<Link href="/app/executive/organizational-momentum" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalMomentumLink}
        </Link>
        <Link href="/app/executive/organizational-futures" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalFuturesLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalFuturesLink")) {
    p = p.replace(
      'organizationalMomentumLink: t("customerApp.executive.organizationalMomentumLink"),',
      'organizationalMomentumLink: t("customerApp.executive.organizationalMomentumLink"),\n        organizationalFuturesLink: t("customerApp.executive.organizationalFuturesLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Futures Center\nRoute: ${P.route}\nCore: The future cannot be predicted with certainty — it can be explored thoughtfully.\nHelpers: _ofc_* · _ofcbp331_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "The future cannot be predicted with certainty — it can be explored thoughtfully.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase330-vocabulary";',
      `export * from "./implementation-blueprint-phase330-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE330_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase330-aipify-organizational-momentum-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE330_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase330-aipify-organizational-momentum-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Futures Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_FUTURES_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_FUTURES_CENTER_ENGINE_PHASE${P.phase}.md) — Futures Center at Executive Center → Organizational Futures. Scenario exploration, signal detection, readiness engine, and executive futures view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_ofc_*\`, \`_ofcbp331_*\`. APIs at \`/api/organizational-futures/*\`. Cross-links momentum, trust, stewardship, simplicity, and purpose centers.`;
  if (!c.includes("Organizational Futures Center Engine (Phase 331)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_FUTURES_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Futures Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
