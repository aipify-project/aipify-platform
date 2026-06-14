#!/usr/bin/env node
/** ABOS Phase 330 — Aipify Organizational Momentum Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 330,
  migration: "20261425800000_aipify_organizational_momentum_center_engine_phase330.sql",
  slug: "aipify-organizational-momentum-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_MOMENTUM_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase330-aipify-organizational-momentum-center.txt",
  route: "/app/executive/organizational-momentum",
  permKeys: ["org_momentum.view", "org_momentum.manage", "org_momentum.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Momentum",
    subtitle:
      "Recognize, maintain, and strengthen healthy momentum by balancing progress, sustainability, focus, and adaptability across strategic initiatives and day-to-day operations.",
    loading: "Loading Momentum Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Momentum philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalTrustLink: "Organizational Trust →",
    organizationalStewardshipLink: "Organizational Stewardship →",
    organizationalSimplicityLink: "Organizational Simplicity →",
    organizationalPurposeLink: "Organizational Purpose →",
    dashboardTitle: "Momentum dashboard",
    signalsTitle: "Momentum engine",
    recognitionTitle: "Milestone recognition",
    reviewsTitle: "Momentum reviews",
    timelineTitle: "Momentum timeline",
    achievementsTitle: "Archived achievements",
    snapshotsTitle: "Progress snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive momentum view",
    sessionsTitle: "Momentum sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleSession: "Schedule reflection session",
    recognizeMilestone: "Recognize milestone",
    generateSummary: "Generate momentum summary",
    printReport: "Print executive report",
    exportSnapshot: "Export progress snapshot",
    coordinateCelebration: "Coordinate milestone celebration",
    archiveAchievement: "Archive achievement timeline",
    humansDecide: "Aipify supports progress awareness — leadership owns sustainable momentum and meaningful direction.",
    privacyNote: "Privacy",
    momentumScore: "Organizational momentum score",
    domains: {
      strategic: "Strategic momentum",
      operational: "Operational momentum",
      customer: "Customer momentum",
      learning: "Learning momentum",
      leadership: "Leadership momentum",
    },
    signalTypes: {
      sustained_progress: "Sustained progress",
      emerging_stagnation: "Emerging stagnation",
      breakthrough_period: "Breakthrough period",
      recovery_period: "Recovery period",
      momentum_practice: "Momentum-building practice",
    },
    signalTones: {
      positive: "Positive signal",
      neutral: "Neutral signal",
      attention: "Needs attention",
    },
    recognitionStatuses: {
      pending: "Pending recognition",
      recognized: "Recognized",
    },
    recognitionTypes: {
      strategic_breakthrough: "Strategic breakthrough",
      customer_success: "Customer success milestone",
      learning_achievement: "Learning achievement",
      improvement_completed: "Improvement completed",
      growth_moment: "Growth moment",
    },
    healthLabels: {
      accelerating: "Accelerating",
      strong: "Strong",
      steady: "Steady",
      slowing: "Slowing",
      stalled: "Stalled",
    },
    timelineTypes: {
      major_achievement: "Major achievement",
      recovery_period: "Recovery period",
      initiative_breakthrough: "Initiative breakthrough",
      strategic_milestone: "Strategic milestone",
      growth_moment: "Growth moment",
    },
    reviewTypes: {
      monthly_momentum: "Monthly momentum review",
      quarterly_progress: "Quarterly progress reflection",
      annual_achievement: "Annual achievement assessment",
      executive_momentum: "Executive momentum discussion",
    },
    sessionTypes: {
      momentum_reflection: "Momentum reflection",
      progress_review: "Progress review",
      milestone_celebration: "Milestone celebration",
    },
    metrics: {
      trend: "Progress trend",
      positive: "Positive momentum",
      initiative: "Initiative progression",
      reviews: "Review participation",
      consistency: "Strategic consistency",
      learning: "Learning integration",
      pendingRecognitions: "Pending recognitions",
      confidence: "Leadership confidence",
    },
    executiveFields: {
      strategic: "Strategic progress",
      consistency: "Leadership consistency",
      confidence: "Organizational confidence",
      opportunities: "Long-term opportunities",
    },
    settingsLink: "Organizational Momentum",
    organizationalMomentumLink: "Organizational Momentum",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisatorisk momentum", settingsLink: "Organisatorisk momentum" }],
    ["sv", { ...i18nBlock(), title: "Organisatoriskt momentum", settingsLink: "Organisatoriskt momentum" }],
    ["da", { ...i18nBlock(), title: "Organisatorisk momentum", settingsLink: "Organisatorisk momentum" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalMomentumCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalMomentumCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalMomentumLink = block.organizationalMomentumLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_trust.view",', `"org_trust.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalMomentumCenterEngine")) {
    c = c.replace(
      '| "organizationalTrustCenterEngine"',
      '| "organizationalMomentumCenterEngine"\n  | "organizationalTrustCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalTrustCenterEngine", href: "/app/executive/organizational-trust", labelKey: "customerApp.nav.organizationalTrustCenterEngine" },',
      `{ id: "organizationalMomentumCenterEngine", href: "/app/executive/organizational-momentum", labelKey: "customerApp.nav.organizationalMomentumCenterEngine" },
  { id: "organizationalTrustCenterEngine", href: "/app/executive/organizational-trust", labelKey: "customerApp.nav.organizationalTrustCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-trust")) return "organizationalTrustCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-momentum")) return "organizationalMomentumCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-trust")) return "organizationalTrustCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-momentum-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalMomentumLink")) {
    c = c.replace(
      "organizationalTrustLink: string;",
      "organizationalTrustLink: string;\n    organizationalMomentumLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-trust" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalTrustLink}
        </Link>`,
      `<Link href="/app/executive/organizational-trust" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalTrustLink}
        </Link>
        <Link href="/app/executive/organizational-momentum" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalMomentumLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalMomentumLink")) {
    p = p.replace(
      'organizationalTrustLink: t("customerApp.executive.organizationalTrustLink"),',
      'organizationalTrustLink: t("customerApp.executive.organizationalTrustLink"),\n        organizationalMomentumLink: t("customerApp.executive.organizationalMomentumLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Momentum Center\nRoute: ${P.route}\nCore: Organizations succeed because they continue moving in meaningful directions over time.\nHelpers: _ommc_* · _ommcbp330_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Organizations succeed because they continue moving in meaningful directions over time.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase329-vocabulary";',
      `export * from "./implementation-blueprint-phase329-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE329_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase329-aipify-organizational-trust-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE329_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase329-aipify-organizational-trust-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Momentum Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_MOMENTUM_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_MOMENTUM_CENTER_ENGINE_PHASE${P.phase}.md) — Momentum Center at Executive Center → Organizational Momentum. Momentum engine, milestone recognition, reviews, and executive momentum view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_ommc_*\`, \`_ommcbp330_*\`. APIs at \`/api/organizational-momentum/*\`. Cross-links trust, stewardship, simplicity, and purpose centers.`;
  if (!c.includes("Organizational Momentum Center Engine (Phase 330)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_MOMENTUM_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Momentum Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
