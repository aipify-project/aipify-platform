#!/usr/bin/env node
/** ABOS Phase 343 — Aipify Organizational Steadfastness Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 343,
  migration: "20261427100000_aipify_organizational_steadfastness_center_engine_phase343.sql",
  slug: "aipify-organizational-steadfastness-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_STEADFASTNESS_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase343-aipify-organizational-steadfastness-center.txt",
  route: "/app/executive/organizational-steadfastness",
  permKeys: ["org_steadfastness.view", "org_steadfastness.manage", "org_steadfastness.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Steadfastness",
    subtitle:
      "Remain resilient, disciplined, and committed to values and strategic priorities during uncertainty, adversity, disruption, and prolonged pressure.",
    loading: "Loading Steadfastness Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Steadfastness philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalCompoundingLink: "Organizational Compounding →",
    dashboardTitle: "Steadfastness dashboard",
    signalsTitle: "Steadfastness engine",
    persistenceTitle: "Balanced persistence engine",
    initiativesTitle: "Resilience initiatives",
    reviewsTitle: "Steadfastness reviews",
    timelineTitle: "Steadfastness timeline",
    milestonesTitle: "Steadfastness milestones",
    snapshotsTitle: "Resilience snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive steadfastness view",
    sessionsTitle: "Steadfastness sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleReflection: "Schedule reflection session",
    completeInitiative: "Complete initiative",
    generateReport: "Generate steadfastness report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export resilience snapshot",
    coordinateReview: "Coordinate leadership discussion",
    archiveMilestone: "Archive steadfastness milestone",
    humansDecide:
      "Aipify supports grounded leadership — leaders retain judgment; steadfastness balances perseverance with responsible adaptation, never rigidity or denial of reality.",
    privacyNote: "Privacy",
    steadfastnessScore: "Organizational steadfastness score",
    resilienceIndicators: "Resilience indicators",
    domains: {
      strategic: "Strategic steadfastness",
      leadership: "Leadership steadfastness",
      workforce: "Workforce steadfastness",
      customer: "Customer steadfastness",
      operational: "Operational steadfastness",
      cultural: "Cultural steadfastness",
    },
    signalTypes: {
      consistent_pressure_behavior: "Consistent behavior under pressure",
      positive_recovery: "Positive recovery pattern",
      leadership_reliability: "Leadership reliability",
      cultural_resilience: "Cultural resilience",
      commitment_fulfillment: "Commitment fulfillment",
    },
    signalTones: {
      positive: "Positive indicator",
      neutral: "Neutral indicator",
      attention: "Needs attention",
    },
    persistenceTypes: {
      essential_commitment: "Essential commitment",
      adaptation_point: "Adaptation point",
      unchanged_values: "Unchanged values",
      renewed_priority: "Renewed priority",
      responsible_resilience: "Responsible resilience",
    },
    initiativeStatuses: {
      planned: "Planned",
      in_progress: "In progress",
      completed: "Completed",
    },
    healthLabels: {
      exceptional: "Exceptional",
      strong: "Strong",
      stable: "Stable",
      developing: "Developing",
      support_recommended: "Support recommended",
    },
    timelineTypes: {
      recovery_milestone: "Recovery milestone",
      leadership_reflection: "Leadership reflection",
      cultural_reaffirmation: "Cultural reaffirmation",
      strategic_perseverance: "Strategic perseverance",
      customer_trust_achievement: "Customer trust achievement",
    },
    reviewTypes: {
      quarterly_resilience: "Quarterly resilience review",
      leadership_reflection: "Leadership reflection session",
      strategic_commitment: "Strategic commitment discussion",
      annual_stewardship: "Annual stewardship assessment",
    },
    sessionTypes: {
      reflection_session: "Reflection session",
      leadership_discussion: "Leadership discussion",
      stewardship_assessment: "Stewardship assessment",
    },
    metrics: {
      values: "Values consistency",
      leadershipReliability: "Leadership reliability",
      recovery: "Recovery effectiveness",
      strategic: "Strategic persistence",
      resilience: "Organizational resilience",
      commitment: "Commitment consistency",
      initiatives: "Initiatives in progress",
      reviews: "Reviews completed",
    },
    executiveFields: {
      leadershipConsistency: "Leadership consistency indicators",
      strategicResilience: "Strategic resilience measures",
      valuesContinuity: "Values continuity trends",
      confidence: "Organizational confidence opportunities",
    },
    settingsLink: "Organizational Steadfastness",
    organizationalSteadfastnessLink: "Organizational Steadfastness",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisatorisk standhaftighet", settingsLink: "Organisatorisk standhaftighet" }],
    ["sv", { ...i18nBlock(), title: "Organisatorisk standfasthet", settingsLink: "Organisatorisk standfasthet" }],
    ["da", { ...i18nBlock(), title: "Organisatorisk standhaftighed", settingsLink: "Organisatorisk standhaftighed" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalSteadfastnessCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalSteadfastnessCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalSteadfastnessLink = block.organizationalSteadfastnessLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_compounding.view",', `"org_compounding.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalSteadfastnessCenterEngine")) {
    c = c.replace(
      '| "organizationalCompoundingCenterEngine"',
      '| "organizationalSteadfastnessCenterEngine"\n  | "organizationalCompoundingCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalCompoundingCenterEngine", href: "/app/executive/organizational-compounding", labelKey: "customerApp.nav.organizationalCompoundingCenterEngine" },',
      `{ id: "organizationalSteadfastnessCenterEngine", href: "/app/executive/organizational-steadfastness", labelKey: "customerApp.nav.organizationalSteadfastnessCenterEngine" },
  { id: "organizationalCompoundingCenterEngine", href: "/app/executive/organizational-compounding", labelKey: "customerApp.nav.organizationalCompoundingCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-compounding")) return "organizationalCompoundingCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-steadfastness")) return "organizationalSteadfastnessCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-compounding")) return "organizationalCompoundingCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-steadfastness-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalSteadfastnessLink")) {
    c = c.replace(
      "organizationalCompoundingLink: string;",
      "organizationalCompoundingLink: string;\n    organizationalSteadfastnessLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-compounding" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalCompoundingLink}
        </Link>`,
      `<Link href="/app/executive/organizational-compounding" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalCompoundingLink}
        </Link>
        <Link href="/app/executive/organizational-steadfastness" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalSteadfastnessLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalSteadfastnessLink")) {
    p = p.replace(
      'organizationalCompoundingLink: t("customerApp.executive.organizationalCompoundingLink"),',
      'organizationalCompoundingLink: t("customerApp.executive.organizationalCompoundingLink"),\n        organizationalSteadfastnessLink: t("customerApp.executive.organizationalSteadfastnessLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Steadfastness Center\nRoute: ${P.route}\nCore: Organizations are defined by how they respond when circumstances become difficult.\nHelpers: _osfc_* · _osfcbp343_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Organizations are defined by how they respond when circumstances become difficult.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase342-vocabulary";',
      `export * from "./implementation-blueprint-phase342-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE342_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase342-aipify-organizational-compounding-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE342_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase342-aipify-organizational-compounding-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Steadfastness Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_STEADFASTNESS_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_STEADFASTNESS_CENTER_ENGINE_PHASE${P.phase}.md) — Steadfastness Center at Executive Center → Organizational Steadfastness. Steadfastness dashboard, steadfastness engine, balanced persistence engine, reviews, and executive steadfastness view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_osfc_*\`, \`_osfcbp343_*\`. APIs at \`/api/organizational-steadfastness/*\`. Cross-links compounding and transformation centers.`;
  if (!c.includes("Organizational Steadfastness Center Engine (Phase 343)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_STEADFASTNESS_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Steadfastness Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
