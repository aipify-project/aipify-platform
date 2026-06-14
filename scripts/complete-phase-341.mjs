#!/usr/bin/env node
/** ABOS Phase 341 — Aipify Organizational Transformation Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 341,
  migration: "20261426900000_aipify_organizational_transformation_center_engine_phase341.sql",
  slug: "aipify-organizational-transformation-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_TRANSFORMATION_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase341-aipify-organizational-transformation-center.txt",
  route: "/app/executive/organizational-transformation",
  permKeys: ["org_transformation.view", "org_transformation.manage", "org_transformation.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Transformation",
    subtitle:
      "Navigate large-scale transformation initiatives with clarity, discipline, adaptability, and human-centered leadership while preserving trust and operational continuity.",
    loading: "Loading Transformation Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Transformation philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalSustainabilityLink: "Organizational Sustainability →",
    organizationalRenewalLink: "Organizational Renewal →",
    dashboardTitle: "Transformation dashboard",
    signalsTitle: "Transformation engine",
    adoptionTitle: "Adoption engine",
    initiativesTitle: "Transformation initiatives",
    reviewsTitle: "Transformation reviews",
    workflowTitle: "Transformation workflow",
    timelineTitle: "Transformation timeline",
    milestonesTitle: "Transformation milestones",
    snapshotsTitle: "Transformation snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive transformation view",
    sessionsTitle: "Transformation sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleReflection: "Schedule reflection session",
    scheduleWorkshop: "Schedule leadership workshop",
    completeInitiative: "Complete initiative",
    generateReport: "Generate transformation report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export transformation snapshot",
    coordinateReview: "Coordinate stakeholder review",
    archiveMilestone: "Archive transformation milestone",
    humansDecide:
      "Aipify supports responsible transformation — leaders retain ownership; transformation is intentional evolution toward a stronger future, never change for its own sake.",
    privacyNote: "Privacy",
    readinessScore: "Transformation readiness score",
    adoptionMomentum: "Adoption momentum",
    domains: {
      strategic: "Strategic transformation",
      digital: "Digital transformation",
      cultural: "Cultural transformation",
      leadership: "Leadership transformation",
      operational: "Operational transformation",
    },
    signalTypes: {
      initiative_momentum: "Initiative momentum",
      adoption_effectiveness: "Adoption effectiveness",
      capability_development: "Capability development",
      leadership_participation: "Leadership participation",
      risk_indicator: "Risk indicator",
    },
    signalTones: {
      positive: "Positive indicator",
      neutral: "Neutral indicator",
      attention: "Needs attention",
    },
    adoptionTypes: {
      behavioral_adoption: "Behavioral adoption",
      workflow_integration: "Workflow integration",
      capability_utilization: "Capability utilization",
      leadership_reinforcement: "Leadership reinforcement",
      long_term_sustainability: "Long-term sustainability",
    },
    initiativeStatuses: {
      planned: "Planned",
      in_progress: "In progress",
      completed: "Completed",
    },
    readinessLabels: {
      highly_ready: "Highly ready",
      prepared: "Prepared",
      developing: "Developing",
      limited_readiness: "Limited readiness",
      transformation_risk: "Transformation risk",
    },
    timelineTypes: {
      transformation_milestone: "Transformation milestone",
      leadership_initiative: "Leadership initiative",
      adoption_breakthrough: "Adoption breakthrough",
      capability_development: "Capability development",
      organizational_achievement: "Organizational achievement",
    },
    reviewTypes: {
      monthly_transformation: "Monthly transformation review",
      quarterly_executive_reflection: "Quarterly executive reflection",
      adoption_discussion: "Adoption discussion",
      annual_transformation_assessment: "Annual transformation assessment",
    },
    sessionTypes: {
      reflection_session: "Reflection session",
      leadership_workshop: "Leadership workshop",
      stakeholder_review: "Stakeholder review",
    },
    metrics: {
      leadership: "Leadership commitment",
      workforce: "Workforce preparedness",
      capability: "Capability maturity",
      communication: "Communication effectiveness",
      governance: "Governance readiness",
      risks: "Risks identified",
      initiatives: "Initiatives in progress",
      reviews: "Reviews completed",
    },
    executiveFields: {
      strategic: "Strategic progress indicators",
      leadership: "Leadership participation measures",
      adoption: "Adoption confidence trends",
      opportunities: "Transformation opportunities",
    },
    settingsLink: "Organizational Transformation",
    organizationalTransformationLink: "Organizational Transformation",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisatorisk transformasjon", settingsLink: "Organisatorisk transformasjon" }],
    ["sv", { ...i18nBlock(), title: "Organisatorisk transformation", settingsLink: "Organisatorisk transformation" }],
    ["da", { ...i18nBlock(), title: "Organisatorisk transformation", settingsLink: "Organisatorisk transformation" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalTransformationCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalTransformationCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalTransformationLink = block.organizationalTransformationLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_sustainability.view",', `"org_sustainability.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalTransformationCenterEngine")) {
    c = c.replace(
      '| "organizationalSustainabilityCenterEngine"',
      '| "organizationalTransformationCenterEngine"\n  | "organizationalSustainabilityCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalSustainabilityCenterEngine", href: "/app/executive/organizational-sustainability", labelKey: "customerApp.nav.organizationalSustainabilityCenterEngine" },',
      `{ id: "organizationalTransformationCenterEngine", href: "/app/executive/organizational-transformation", labelKey: "customerApp.nav.organizationalTransformationCenterEngine" },
  { id: "organizationalSustainabilityCenterEngine", href: "/app/executive/organizational-sustainability", labelKey: "customerApp.nav.organizationalSustainabilityCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-sustainability")) return "organizationalSustainabilityCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-transformation")) return "organizationalTransformationCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-sustainability")) return "organizationalSustainabilityCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-transformation-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalTransformationLink")) {
    c = c.replace(
      "organizationalSustainabilityLink: string;",
      "organizationalSustainabilityLink: string;\n    organizationalTransformationLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-sustainability" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalSustainabilityLink}
        </Link>`,
      `<Link href="/app/executive/organizational-sustainability" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalSustainabilityLink}
        </Link>
        <Link href="/app/executive/organizational-transformation" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalTransformationLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalTransformationLink")) {
    p = p.replace(
      'organizationalSustainabilityLink: t("customerApp.executive.organizationalSustainabilityLink"),',
      'organizationalSustainabilityLink: t("customerApp.executive.organizationalSustainabilityLink"),\n        organizationalTransformationLink: t("customerApp.executive.organizationalTransformationLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Transformation Center\nRoute: ${P.route}\nCore: Transformation is intentional evolution toward a stronger future.\nHelpers: _otrc_* · _otrcbp341_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Transformation is intentional evolution toward a stronger future.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase340-vocabulary";',
      `export * from "./implementation-blueprint-phase340-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE340_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase340-aipify-organizational-sustainability-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE340_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase340-aipify-organizational-sustainability-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Transformation Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_TRANSFORMATION_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_TRANSFORMATION_CENTER_ENGINE_PHASE${P.phase}.md) — Transformation Center at Executive Center → Organizational Transformation. Transformation dashboard, transformation engine, adoption engine, workflow, reviews, and executive transformation view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_otrc_*\`, \`_otrcbp341_*\`. APIs at \`/api/organizational-transformation/*\`. Cross-links sustainability, renewal, and adaptability centers.`;
  if (!c.includes("Organizational Transformation Center Engine (Phase 341)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_TRANSFORMATION_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Transformation Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
