#!/usr/bin/env node
/** ABOS Phase 338 — Aipify Organizational Flourishing Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 338,
  migration: "20261426600000_aipify_organizational_flourishing_center_engine_phase338.sql",
  slug: "aipify-organizational-flourishing-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_FLOURISHING_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase338-aipify-organizational-flourishing-center.txt",
  route: "/app/executive/organizational-flourishing",
  permKeys: ["org_flourishing.view", "org_flourishing.manage", "org_flourishing.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Flourishing",
    subtitle:
      "Create the conditions in which people, teams, customers, and the organization can sustainably thrive — human-centered leadership, meaningful contribution, and long-term wellbeing.",
    loading: "Loading Flourishing Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Flourishing philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalPurposeLink: "Organizational Purpose →",
    organizationalConfidenceLink: "Organizational Confidence →",
    organizationalLearningLink: "Organizational Learning →",
    organizationalEnergyLink: "Organizational Energy →",
    dashboardTitle: "Flourishing dashboard",
    conditionsTitle: "Flourishing engine",
    meaningTitle: "Meaning engine",
    initiativesTitle: "Flourishing initiatives",
    reviewsTitle: "Flourishing reviews",
    timelineTitle: "Flourishing timeline",
    milestonesTitle: "Flourishing milestones",
    snapshotsTitle: "Flourishing snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive flourishing view",
    sessionsTitle: "Flourishing sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleReflection: "Schedule reflection session",
    completeInitiative: "Complete initiative",
    generateReport: "Generate flourishing report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export flourishing snapshot",
    coordinateDiscussion: "Coordinate leadership discussion",
    archiveMilestone: "Archive flourishing milestone",
    humansDecide: "Aipify supports flourishing awareness — leaders retain responsibility; success should not come at the expense of the people who create it.",
    privacyNote: "Privacy",
    flourishingScore: "Organizational flourishing score",
    positiveMomentum: "Positive momentum",
    domains: {
      individual: "Individual flourishing",
      team: "Team flourishing",
      leadership: "Leadership flourishing",
      customer: "Customer flourishing",
      organizational: "Organizational flourishing",
    },
    conditionTypes: {
      sustainable_success: "Sustainable success",
      long_term_engagement: "Long-term engagement",
      meaningful_contribution: "Meaningful contribution",
      organizational_resilience: "Organizational resilience",
      shared_progress: "Shared progress",
    },
    conditionTones: {
      positive: "Positive condition",
      neutral: "Neutral condition",
      attention: "Needs attention",
    },
    meaningTypes: {
      work_contribution: "Work contribution",
      purpose_understanding: "Purpose understanding",
      success_celebration: "Celebrating successes",
      growth_opportunity: "Growth and contribution",
    },
    initiativeStatuses: {
      planned: "Planned",
      in_progress: "In progress",
      completed: "Completed",
    },
    healthLabels: {
      thriving: "Thriving",
      healthy: "Healthy",
      developing: "Developing",
      strained: "Strained",
      support_recommended: "Support recommended",
    },
    timelineTypes: {
      growth_milestone: "Growth milestone",
      learning_achievement: "Learning achievement",
      cultural_development: "Cultural development",
      leadership_reflection: "Leadership reflection",
      organizational_breakthrough: "Organizational breakthrough",
    },
    reviewTypes: {
      quarterly_flourishing: "Quarterly flourishing review",
      leadership_reflection: "Leadership reflection session",
      annual_assessment: "Annual organizational assessment",
      purpose_discussion: "Purpose discussion",
    },
    sessionTypes: {
      reflection_session: "Reflection session",
      purpose_workshop: "Purpose workshop",
    },
    metrics: {
      learning: "Learning participation",
      collaboration: "Collaboration effectiveness",
      leadership: "Leadership consistency",
      resilience: "Organizational resilience",
      purpose: "Purpose alignment",
      sustainability: "Sustainability measures",
      initiatives: "Initiatives in progress",
      reviews: "Reviews completed",
    },
    executiveFields: {
      sustainability: "Sustainability indicators",
      resilience: "Organizational resilience measures",
      leadership: "Leadership participation trends",
      opportunities: "Flourishing opportunities",
    },
    settingsLink: "Organizational Flourishing",
    organizationalFlourishingLink: "Organizational Flourishing",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisatorisk blomstring", settingsLink: "Organisatorisk blomstring" }],
    ["sv", { ...i18nBlock(), title: "Organisatorisk blomstring", settingsLink: "Organisatorisk blomstring" }],
    ["da", { ...i18nBlock(), title: "Organisatorisk blomstring", settingsLink: "Organisatorisk blomstring" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalFlourishingCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalFlourishingCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalFlourishingLink = block.organizationalFlourishingLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_confidence.view",', `"org_confidence.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalFlourishingCenterEngine")) {
    c = c.replace(
      '| "organizationalConfidenceCenterEngine"',
      '| "organizationalFlourishingCenterEngine"\n  | "organizationalConfidenceCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalConfidenceCenterEngine", href: "/app/executive/organizational-confidence", labelKey: "customerApp.nav.organizationalConfidenceCenterEngine" },',
      `{ id: "organizationalFlourishingCenterEngine", href: "/app/executive/organizational-flourishing", labelKey: "customerApp.nav.organizationalFlourishingCenterEngine" },
  { id: "organizationalConfidenceCenterEngine", href: "/app/executive/organizational-confidence", labelKey: "customerApp.nav.organizationalConfidenceCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-confidence")) return "organizationalConfidenceCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-flourishing")) return "organizationalFlourishingCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-confidence")) return "organizationalConfidenceCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-flourishing-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalFlourishingLink")) {
    c = c.replace(
      "organizationalConfidenceLink: string;",
      "organizationalConfidenceLink: string;\n    organizationalFlourishingLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-confidence" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalConfidenceLink}
        </Link>`,
      `<Link href="/app/executive/organizational-confidence" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalConfidenceLink}
        </Link>
        <Link href="/app/executive/organizational-flourishing" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalFlourishingLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalFlourishingLink")) {
    p = p.replace(
      'organizationalConfidenceLink: t("customerApp.executive.organizationalConfidenceLink"),',
      'organizationalConfidenceLink: t("customerApp.executive.organizationalConfidenceLink"),\n        organizationalFlourishingLink: t("customerApp.executive.organizationalFlourishingLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Flourishing Center\nRoute: ${P.route}\nCore: Organizations flourish when people flourish.\nHelpers: _oflc_* · _oflcbp338_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Organizations flourish when people flourish.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase337-vocabulary";',
      `export * from "./implementation-blueprint-phase337-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE337_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase337-aipify-organizational-confidence-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE337_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase337-aipify-organizational-confidence-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Flourishing Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_FLOURISHING_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_FLOURISHING_CENTER_ENGINE_PHASE${P.phase}.md) — Flourishing Center at Executive Center → Organizational Flourishing. Flourishing dashboard, flourishing engine, meaning engine, reviews, and executive flourishing view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_oflc_*\`, \`_oflcbp338_*\`. APIs at \`/api/organizational-flourishing/*\`. Cross-links purpose, confidence, learning, and energy centers.`;
  if (!c.includes("Organizational Flourishing Center Engine (Phase 338)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_FLOURISHING_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Flourishing Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
