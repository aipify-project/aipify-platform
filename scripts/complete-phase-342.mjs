#!/usr/bin/env node
/** ABOS Phase 342 — Aipify Organizational Compounding Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 342,
  migration: "20261427000000_aipify_organizational_compounding_center_engine_phase342.sql",
  slug: "aipify-organizational-compounding-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_COMPOUNDING_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase342-aipify-organizational-compounding-center.txt",
  route: "/app/executive/organizational-compounding",
  permKeys: ["org_compounding.view", "org_compounding.manage", "org_compounding.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Compounding",
    subtitle:
      "Recognize, accelerate, and benefit from the compounding effects of small improvements, disciplined execution, learning, trust, and strategic consistency over time.",
    loading: "Loading Compounding Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Compounding philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalTransformationLink: "Organizational Transformation →",
    dashboardTitle: "Compounding dashboard",
    signalsTitle: "Compounding engine",
    leverageTitle: "High-leverage activity engine",
    initiativesTitle: "Improvement initiatives",
    reviewsTitle: "Compounding reviews",
    timelineTitle: "Compounding timeline",
    milestonesTitle: "Compounding milestones",
    snapshotsTitle: "Progress snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive compounding view",
    sessionsTitle: "Compounding sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleReflection: "Schedule reflection session",
    completeInitiative: "Complete initiative",
    generateReport: "Generate compounding report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export progress snapshot",
    coordinateReview: "Coordinate leadership review",
    archiveMilestone: "Archive compounding milestone",
    humansDecide:
      "Aipify supports patient leadership — leaders retain judgment; compounding rewards consistency and perseverance, never instant gratification.",
    privacyNote: "Privacy",
    compoundingScore: "Organizational compounding score",
    positiveMomentum: "Positive momentum",
    domains: {
      learning: "Learning compounding",
      trust: "Trust compounding",
      execution: "Execution compounding",
      leadership: "Leadership compounding",
      customer: "Customer compounding",
      organizational: "Organizational compounding",
    },
    signalTypes: {
      repeated_positive_behavior: "Repeated positive behavior",
      improvement_trajectory: "Improvement trajectory",
      sustainable_progress: "Sustainable progress",
      high_leverage_activity: "High-leverage activity",
      long_term_value: "Long-term value",
    },
    signalTones: {
      positive: "Positive indicator",
      neutral: "Neutral indicator",
      attention: "Needs attention",
    },
    leverageTypes: {
      disproportionate_value: "Disproportionate value",
      resilience_habit: "Resilience habit",
      continuing_benefit: "Continuing benefit",
      relationship_investment: "Relationship investment",
      practice_reinforcement: "Practice reinforcement",
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
      interrupted: "Interrupted",
    },
    timelineTypes: {
      improvement_milestone: "Improvement milestone",
      trust_development: "Trust development",
      learning_integration: "Learning integration",
      capability_breakthrough: "Capability breakthrough",
      strategic_achievement: "Strategic achievement",
    },
    reviewTypes: {
      quarterly_compounding: "Quarterly compounding review",
      annual_reflection: "Annual reflection session",
      leadership_discussion: "Leadership discussion",
      long_term_planning: "Long-term planning workshop",
    },
    sessionTypes: {
      reflection_session: "Reflection session",
      leadership_review: "Leadership review",
      planning_workshop: "Planning workshop",
    },
    metrics: {
      consistency: "Consistency of execution",
      learning: "Learning integration",
      leadership: "Leadership participation",
      relationships: "Relationship stability",
      sustainability: "Improvement sustainability",
      improvement: "Long-term improvement",
      initiatives: "Initiatives in progress",
      reviews: "Reviews completed",
    },
    executiveFields: {
      value: "Long-term value indicators",
      consistency: "Leadership consistency measures",
      growth: "Organizational growth trends",
      patience: "Strategic patience opportunities",
    },
    settingsLink: "Organizational Compounding",
    organizationalCompoundingLink: "Organizational Compounding",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisatorisk sammensetning", settingsLink: "Organisatorisk sammensetning" }],
    ["sv", { ...i18nBlock(), title: "Organisatorisk sammansattning", settingsLink: "Organisatorisk sammansattning" }],
    ["da", { ...i18nBlock(), title: "Organisatorisk sammensætning", settingsLink: "Organisatorisk sammensætning" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalCompoundingCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalCompoundingCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalCompoundingLink = block.organizationalCompoundingLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_transformation.view",', `"org_transformation.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalCompoundingCenterEngine")) {
    c = c.replace(
      '| "organizationalTransformationCenterEngine"',
      '| "organizationalCompoundingCenterEngine"\n  | "organizationalTransformationCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalTransformationCenterEngine", href: "/app/executive/organizational-transformation", labelKey: "customerApp.nav.organizationalTransformationCenterEngine" },',
      `{ id: "organizationalCompoundingCenterEngine", href: "/app/executive/organizational-compounding", labelKey: "customerApp.nav.organizationalCompoundingCenterEngine" },
  { id: "organizationalTransformationCenterEngine", href: "/app/executive/organizational-transformation", labelKey: "customerApp.nav.organizationalTransformationCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-transformation")) return "organizationalTransformationCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-compounding")) return "organizationalCompoundingCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-transformation")) return "organizationalTransformationCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-compounding-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalCompoundingLink")) {
    c = c.replace(
      "organizationalTransformationLink: string;",
      "organizationalTransformationLink: string;\n    organizationalCompoundingLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-transformation" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalTransformationLink}
        </Link>`,
      `<Link href="/app/executive/organizational-transformation" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalTransformationLink}
        </Link>
        <Link href="/app/executive/organizational-compounding" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalCompoundingLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalCompoundingLink")) {
    p = p.replace(
      'organizationalTransformationLink: t("customerApp.executive.organizationalTransformationLink"),',
      'organizationalTransformationLink: t("customerApp.executive.organizationalTransformationLink"),\n        organizationalCompoundingLink: t("customerApp.executive.organizationalCompoundingLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Compounding Center\nRoute: ${P.route}\nCore: Small improvements repeated consistently over time build extraordinary organizations.\nHelpers: _occc_* · _occcbp342_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Small improvements repeated consistently over time build extraordinary organizations.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase341-vocabulary";',
      `export * from "./implementation-blueprint-phase341-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE341_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase341-aipify-organizational-transformation-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE341_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase341-aipify-organizational-transformation-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Compounding Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_COMPOUNDING_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_COMPOUNDING_CENTER_ENGINE_PHASE${P.phase}.md) — Compounding Center at Executive Center → Organizational Compounding. Compounding dashboard, compounding engine, high-leverage activity engine, reviews, and executive compounding view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_occc_*\`, \`_occcbp342_*\`. APIs at \`/api/organizational-compounding/*\`. Cross-links transformation and sustainability centers.`;
  if (!c.includes("Organizational Compounding Center Engine (Phase 342)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_COMPOUNDING_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Compounding Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
