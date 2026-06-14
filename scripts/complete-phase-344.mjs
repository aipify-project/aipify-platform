#!/usr/bin/env node
/** ABOS Phase 344 — Aipify Organizational Clarity Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 344,
  migration: "20261427300000_aipify_organizational_clarity_center_engine_phase344.sql",
  slug: "aipify-organizational-clarity-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_CLARITY_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase344-aipify-organizational-clarity-center.txt",
  route: "/app/executive/organizational-clarity",
  permKeys: ["org_clarity.view", "org_clarity.manage", "org_clarity.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Clarity",
    subtitle:
      "Strengthen clarity in communication, priorities, responsibilities, expectations, and decision-making so people can work with greater confidence, alignment, and effectiveness.",
    loading: "Loading Clarity Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Clarity philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalSteadfastnessLink: "Organizational Steadfastness →",
    dashboardTitle: "Clarity dashboard",
    signalsTitle: "Clarity engine",
    alignmentTitle: "Expectation alignment engine",
    initiativesTitle: "Clarity initiatives",
    reviewsTitle: "Clarity reviews",
    timelineTitle: "Clarity timeline",
    milestonesTitle: "Clarity milestones",
    snapshotsTitle: "Clarity snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive clarity view",
    sessionsTitle: "Clarity sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleCommunicationReview: "Schedule communication review",
    completeInitiative: "Complete initiative",
    generateReport: "Generate clarity report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export clarity snapshot",
    coordinateReview: "Coordinate leadership discussion",
    archiveMilestone: "Archive clarity milestone",
    humansDecide:
      "Aipify supports understanding — leaders retain judgment; clarity makes complexity understandable without eliminating necessary nuance or replacing leadership conversations.",
    privacyNote: "Privacy",
    clarityScore: "Organizational clarity score",
    communicationIndicators: "Communication effectiveness",
    domains: {
      strategic: "Strategic clarity",
      role: "Role clarity",
      operational: "Operational clarity",
      communication: "Communication clarity",
      governance: "Governance clarity",
      customer: "Customer clarity",
    },
    signalTypes: {
      ambiguous_responsibility: "Ambiguous responsibility",
      conflicting_priority: "Conflicting priority",
      communication_gap: "Communication gap",
      unclear_process: "Unclear process",
      decision_confusion: "Decision confusion",
    },
    signalTones: {
      positive: "Positive indicator",
      neutral: "Neutral indicator",
      attention: "Needs attention",
    },
    alignmentTypes: {
      responsibility_clarity: "Responsibility clarity",
      priority_communication: "Priority communication",
      realistic_expectations: "Realistic expectations",
      decision_transparency: "Decision transparency",
      additional_clarification: "Additional clarification",
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
      clarity_improvement_recommended: "Clarity improvement recommended",
    },
    timelineTypes: {
      communication_milestone: "Communication milestone",
      governance_improvement: "Governance improvement",
      priority_clarification: "Priority clarification",
      leadership_reflection: "Leadership reflection",
      role_definition_update: "Role definition update",
    },
    reviewTypes: {
      monthly_clarity: "Monthly clarity review",
      quarterly_leadership: "Quarterly leadership discussion",
      communication_assessment: "Communication assessment",
      annual_organizational_reflection: "Annual organizational reflection",
    },
    sessionTypes: {
      communication_review: "Communication review",
      leadership_discussion: "Leadership discussion",
      organizational_reflection: "Organizational reflection",
    },
    metrics: {
      communicationConsistency: "Communication consistency",
      responsibilityAwareness: "Responsibility awareness",
      priorityUnderstanding: "Priority understanding",
      governanceTransparency: "Governance transparency",
      expectationAlignment: "Expectation alignment",
      roleUnderstanding: "Role understanding",
      initiatives: "Initiatives in progress",
      reviews: "Reviews completed",
    },
    executiveFields: {
      communicationEffectiveness: "Communication effectiveness indicators",
      strategicUnderstanding: "Strategic understanding trends",
      responsibilityTransparency: "Responsibility transparency measures",
      clarityOpportunities: "Clarity improvement opportunities",
    },
    settingsLink: "Organizational Clarity",
    organizationalClarityLink: "Organizational Clarity",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisatorisk klarhet", settingsLink: "Organisatorisk klarhet" }],
    ["sv", { ...i18nBlock(), title: "Organisatorisk tydlighet", settingsLink: "Organisatorisk tydlighet" }],
    ["da", { ...i18nBlock(), title: "Organisatorisk klarhed", settingsLink: "Organisatorisk klarhed" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalClarityCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalClarityCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalClarityLink = block.organizationalClarityLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_steadfastness.view",', `"org_steadfastness.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalClarityCenterEngine")) {
    c = c.replace(
      '| "organizationalSteadfastnessCenterEngine"',
      '| "organizationalClarityCenterEngine"\n  | "organizationalSteadfastnessCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalSteadfastnessCenterEngine", href: "/app/executive/organizational-steadfastness", labelKey: "customerApp.nav.organizationalSteadfastnessCenterEngine" },',
      `{ id: "organizationalClarityCenterEngine", href: "/app/executive/organizational-clarity", labelKey: "customerApp.nav.organizationalClarityCenterEngine" },
  { id: "organizationalSteadfastnessCenterEngine", href: "/app/executive/organizational-steadfastness", labelKey: "customerApp.nav.organizationalSteadfastnessCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-steadfastness")) return "organizationalSteadfastnessCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-clarity")) return "organizationalClarityCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-steadfastness")) return "organizationalSteadfastnessCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-clarity-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalClarityLink")) {
    c = c.replace(
      "organizationalSteadfastnessLink: string;",
      "organizationalSteadfastnessLink: string;\n    organizationalClarityLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-steadfastness" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalSteadfastnessLink}
        </Link>`,
      `<Link href="/app/executive/organizational-steadfastness" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalSteadfastnessLink}
        </Link>
        <Link href="/app/executive/organizational-clarity" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalClarityLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalClarityLink")) {
    p = p.replace(
      'organizationalSteadfastnessLink: t("customerApp.executive.organizationalSteadfastnessLink"),',
      'organizationalSteadfastnessLink: t("customerApp.executive.organizationalSteadfastnessLink"),\n        organizationalClarityLink: t("customerApp.executive.organizationalClarityLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Clarity Center\nRoute: ${P.route}\nCore: Confusion creates friction. Clarity creates momentum.\nHelpers: _oclc_* · _oclcbp344_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Confusion creates friction. Clarity creates momentum.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase343-vocabulary";',
      `export * from "./implementation-blueprint-phase343-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE343_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase343-aipify-organizational-steadfastness-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE343_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase343-aipify-organizational-steadfastness-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Clarity Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_CLARITY_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_CLARITY_CENTER_ENGINE_PHASE${P.phase}.md) — Clarity Center at Executive Center → Organizational Clarity. Clarity dashboard, clarity engine, expectation alignment engine, reviews, and executive clarity view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_oclc_*\`, \`_oclcbp344_*\`. APIs at \`/api/organizational-clarity/*\`. Cross-links steadfastness and compounding centers.`;
  if (!c.includes("Organizational Clarity Center Engine (Phase 344)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

function patchPendingMigrations() {
  const file = "/tmp/aipify-pending-migrations.json";
  const list = JSON.parse(fs.readFileSync(file, "utf8"));
  const entry = {
    file: P.migration,
    version: "20261427300000",
    name: "aipify_organizational_clarity_center_engine_phase344",
  };
  if (!list.some((item) => item.file === P.migration || item === P.migration)) {
    list.push(entry);
    fs.writeFileSync(file, `${JSON.stringify(list, null, 2)}\n`);
    console.log("appended pending migration");
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_CLARITY_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Clarity Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
