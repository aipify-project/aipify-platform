#!/usr/bin/env node
/** ABOS Phase 337 — Aipify Organizational Confidence Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 337,
  migration: "20261426500000_aipify_organizational_confidence_center_engine_phase337.sql",
  slug: "aipify-organizational-confidence-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_CONFIDENCE_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase337-aipify-organizational-confidence-center.txt",
  route: "/app/executive/organizational-confidence",
  permKeys: ["org_confidence.view", "org_confidence.manage", "org_confidence.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Confidence",
    subtitle:
      "Build, sustain, and strengthen collective confidence through preparedness, capability development, reliable execution, transparent leadership, and meaningful progress.",
    loading: "Loading Confidence Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Confidence philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalTrustLink: "Organizational Trust →",
    organizationalResilienceLink: "Organizational Resilience →",
    organizationalDecisionQualityLink: "Decision Quality →",
    organizationalMomentumLink: "Organizational Momentum →",
    dashboardTitle: "Confidence dashboard",
    factorsTitle: "Confidence building engine",
    uncertaintyTitle: "Uncertainty awareness",
    initiativesTitle: "Confidence-building initiatives",
    reviewsTitle: "Confidence reviews",
    timelineTitle: "Confidence timeline",
    milestonesTitle: "Confidence milestones",
    snapshotsTitle: "Confidence snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive confidence view",
    sessionsTitle: "Confidence sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleReflection: "Schedule reflection session",
    completeInitiative: "Complete initiative",
    generateReport: "Generate confidence report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export confidence snapshot",
    coordinateReview: "Coordinate preparedness review",
    archiveMilestone: "Archive confidence milestone",
    humansDecide: "Aipify supports grounded confidence — leaders retain judgment; confidence comes from preparation, not false certainty.",
    privacyNote: "Privacy",
    confidenceScore: "Organizational confidence score",
    confidenceTrend: "Confidence trend",
    domains: {
      leadership: "Leadership confidence",
      workforce: "Workforce confidence",
      operational: "Operational confidence",
      customer: "Customer confidence",
      strategic: "Strategic confidence",
    },
    factorTypes: {
      increased_confidence: "Increased confidence",
      reduced_uncertainty: "Reduced uncertainty",
      improved_resilience: "Improved resilience",
      stronger_collaboration: "Stronger collaboration",
      greater_preparedness: "Greater preparedness",
    },
    factorTones: {
      positive: "Positive factor",
      neutral: "Neutral factor",
      attention: "Needs attention",
    },
    uncertaintyTypes: {
      known_challenge: "Known challenge",
      emerging_risk: "Emerging risk",
      development_area: "Area requiring development",
      assumption_validation: "Assumption requiring validation",
      capacity_limitation: "Capacity limitation",
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
      fragile: "Fragile",
    },
    timelineTypes: {
      major_achievement: "Major achievement",
      recovery_milestone: "Recovery milestone",
      capability_improvement: "Capability improvement",
      strategic_breakthrough: "Strategic breakthrough",
      learning_development: "Learning development",
    },
    reviewTypes: {
      quarterly_confidence: "Quarterly confidence review",
      leadership_reflection: "Leadership reflection session",
      workforce_preparedness: "Workforce preparedness discussion",
      annual_assessment: "Annual organizational assessment",
    },
    sessionTypes: {
      reflection_session: "Reflection session",
      preparedness_review: "Preparedness review",
      workforce_discussion: "Workforce discussion",
    },
    metrics: {
      preparedness: "Preparedness effectiveness",
      capability: "Capability maturity",
      leadership: "Leadership consistency",
      learning: "Learning participation",
      recovery: "Recovery readiness",
      initiatives: "Initiatives in progress",
      indicators: "Preparedness indicators",
      confidence: "Executive confidence",
    },
    executiveFields: {
      leadership: "Leadership confidence indicators",
      preparedness: "Organizational preparedness",
      resilience: "Strategic resilience trends",
      opportunities: "Confidence-building opportunities",
    },
    settingsLink: "Organizational Confidence",
    organizationalConfidenceLink: "Organizational Confidence",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisatorisk tillit og selvtillit", settingsLink: "Organisatorisk selvtillit" }],
    ["sv", { ...i18nBlock(), title: "Organisatoriskt självförtroende", settingsLink: "Organisatoriskt självförtroende" }],
    ["da", { ...i18nBlock(), title: "Organisatorisk selvtillid", settingsLink: "Organisatorisk selvtillid" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalConfidenceCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalConfidenceCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalConfidenceLink = block.organizationalConfidenceLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_decision_quality.view",', `"org_decision_quality.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalConfidenceCenterEngine")) {
    c = c.replace(
      '| "organizationalDecisionQualityCenterEngine"',
      '| "organizationalConfidenceCenterEngine"\n  | "organizationalDecisionQualityCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalDecisionQualityCenterEngine", href: "/app/executive/organizational-decision-quality", labelKey: "customerApp.nav.organizationalDecisionQualityCenterEngine" },',
      `{ id: "organizationalConfidenceCenterEngine", href: "/app/executive/organizational-confidence", labelKey: "customerApp.nav.organizationalConfidenceCenterEngine" },
  { id: "organizationalDecisionQualityCenterEngine", href: "/app/executive/organizational-decision-quality", labelKey: "customerApp.nav.organizationalDecisionQualityCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-decision-quality")) return "organizationalDecisionQualityCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-confidence")) return "organizationalConfidenceCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-decision-quality")) return "organizationalDecisionQualityCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-confidence-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalConfidenceLink")) {
    c = c.replace(
      "organizationalDecisionQualityLink: string;",
      "organizationalDecisionQualityLink: string;\n    organizationalConfidenceLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-decision-quality" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalDecisionQualityLink}
        </Link>`,
      `<Link href="/app/executive/organizational-decision-quality" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalDecisionQualityLink}
        </Link>
        <Link href="/app/executive/organizational-confidence" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalConfidenceLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalConfidenceLink")) {
    p = p.replace(
      'organizationalDecisionQualityLink: t("customerApp.executive.organizationalDecisionQualityLink"),',
      'organizationalDecisionQualityLink: t("customerApp.executive.organizationalDecisionQualityLink"),\n        organizationalConfidenceLink: t("customerApp.executive.organizationalConfidenceLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Confidence Center\nRoute: ${P.route}\nCore: Confidence is not certainty.\nHelpers: _oicc_* · _oiccbp337_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Confidence is not certainty.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase336-vocabulary";',
      `export * from "./implementation-blueprint-phase336-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE336_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase336-aipify-organizational-decision-quality-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE336_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase336-aipify-organizational-decision-quality-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Confidence Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_CONFIDENCE_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_CONFIDENCE_CENTER_ENGINE_PHASE${P.phase}.md) — Confidence Center at Executive Center → Organizational Confidence. Confidence dashboard, building engine, uncertainty awareness, reviews, and executive confidence view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_oicc_*\`, \`_oiccbp337_*\`. APIs at \`/api/organizational-confidence/*\`. Cross-links trust, resilience, decision quality, and momentum centers.`;
  if (!c.includes("Organizational Confidence Center Engine (Phase 337)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_CONFIDENCE_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Confidence Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
