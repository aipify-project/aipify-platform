#!/usr/bin/env node
/** ABOS Phase 339 — Aipify Organizational Renewal Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 339,
  migration: "20261426700000_aipify_organizational_renewal_center_engine_phase339.sql",
  slug: "aipify-organizational-renewal-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_RENEWAL_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase339-aipify-organizational-renewal-center.txt",
  route: "/app/executive/organizational-renewal",
  permKeys: ["org_renewal.view", "org_renewal.manage", "org_renewal.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Renewal",
    subtitle:
      "Intentionally renew strategies, capabilities, leadership practices, knowledge, and ways of working — evolve while preserving what matters most.",
    loading: "Loading Renewal Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Renewal philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalFlourishingLink: "Organizational Flourishing →",
    organizationalLearningLink: "Organizational Learning →",
    organizationalAdaptabilityLink: "Organizational Adaptability →",
    dashboardTitle: "Renewal dashboard",
    opportunitiesTitle: "Renewal engine",
    balanceTitle: "Balance engine",
    initiativesTitle: "Renewal initiatives",
    reviewsTitle: "Renewal reviews",
    timelineTitle: "Renewal timeline",
    milestonesTitle: "Renewal milestones",
    snapshotsTitle: "Renewal snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive renewal view",
    sessionsTitle: "Renewal sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleReflection: "Schedule reflection session",
    completeInitiative: "Complete initiative",
    generateReport: "Generate renewal report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export renewal snapshot",
    coordinateDiscussion: "Coordinate reassessment discussion",
    archiveMilestone: "Archive renewal milestone",
    humansDecide: "Aipify supports purposeful renewal — leaders retain judgment; renewal balances continuity with thoughtful evolution.",
    privacyNote: "Privacy",
    renewalScore: "Organizational renewal score",
    strategicReassessment: "Strategic reassessment",
    domains: {
      strategic: "Strategic renewal",
      leadership: "Leadership renewal",
      capability: "Capability renewal",
      knowledge: "Knowledge renewal",
      cultural: "Cultural renewal",
      operational: "Operational renewal",
    },
    opportunityTypes: {
      outdated_assumption: "Outdated assumption",
      emerging_capability: "Emerging capability",
      leadership_development: "Leadership development",
      process_modernization: "Process modernization",
      strategic_evolution: "Strategic evolution",
    },
    opportunityTones: {
      positive: "Positive opportunity",
      neutral: "Neutral opportunity",
      attention: "Needs attention",
    },
    balanceTypes: {
      preserve: "What to preserve",
      evolve: "What to evolve",
      retire: "What to retire",
      capability_investment: "Capability investment",
      timeless_values: "Timeless values",
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
      renewal_recommended: "Renewal recommended",
      stagnation_risk: "Stagnation risk",
    },
    timelineTypes: {
      strategic_update: "Strategic update",
      capability_improvement: "Capability improvement",
      leadership_milestone: "Leadership milestone",
      cultural_development: "Cultural development",
      knowledge_modernization: "Knowledge modernization",
    },
    reviewTypes: {
      quarterly_renewal: "Quarterly renewal review",
      leadership_reflection: "Leadership learning discussion",
      annual_strategic_reflection: "Annual strategic reflection session",
      capability_reassessment: "Capability reassessment workshop",
    },
    sessionTypes: {
      reflection_session: "Reflection session",
      leadership_learning: "Leadership learning discussion",
      capability_workshop: "Capability reassessment workshop",
    },
    metrics: {
      adaptability: "Strategic adaptability",
      learning: "Learning participation",
      leadership: "Leadership reflection",
      capability: "Capability development",
      momentum: "Improvement momentum",
      integration: "Learning integration",
      initiatives: "Initiatives in progress",
      reviews: "Reviews completed",
    },
    executiveFields: {
      strategic: "Strategic evolution indicators",
      leadership: "Leadership development trends",
      capability: "Capability readiness measures",
      opportunities: "Renewal opportunities",
    },
    settingsLink: "Organizational Renewal",
    organizationalRenewalLink: "Organizational Renewal",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisatorisk fornyelse", settingsLink: "Organisatorisk fornyelse" }],
    ["sv", { ...i18nBlock(), title: "Organisatorisk förnyelse", settingsLink: "Organisatorisk förnyelse" }],
    ["da", { ...i18nBlock(), title: "Organisatorisk fornyelse", settingsLink: "Organisatorisk fornyelse" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalRenewalCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalRenewalCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalRenewalLink = block.organizationalRenewalLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_flourishing.view",', `"org_flourishing.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalRenewalCenterEngine")) {
    c = c.replace(
      '| "organizationalFlourishingCenterEngine"',
      '| "organizationalRenewalCenterEngine"\n  | "organizationalFlourishingCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalFlourishingCenterEngine", href: "/app/executive/organizational-flourishing", labelKey: "customerApp.nav.organizationalFlourishingCenterEngine" },',
      `{ id: "organizationalRenewalCenterEngine", href: "/app/executive/organizational-renewal", labelKey: "customerApp.nav.organizationalRenewalCenterEngine" },
  { id: "organizationalFlourishingCenterEngine", href: "/app/executive/organizational-flourishing", labelKey: "customerApp.nav.organizationalFlourishingCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-flourishing")) return "organizationalFlourishingCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-renewal")) return "organizationalRenewalCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-flourishing")) return "organizationalFlourishingCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-renewal-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalRenewalLink")) {
    c = c.replace(
      "organizationalFlourishingLink: string;",
      "organizationalFlourishingLink: string;\n    organizationalRenewalLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-flourishing" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalFlourishingLink}
        </Link>`,
      `<Link href="/app/executive/organizational-flourishing" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalFlourishingLink}
        </Link>
        <Link href="/app/executive/organizational-renewal" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalRenewalLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalRenewalLink")) {
    p = p.replace(
      'organizationalFlourishingLink: t("customerApp.executive.organizationalFlourishingLink"),',
      'organizationalFlourishingLink: t("customerApp.executive.organizationalFlourishingLink"),\n        organizationalRenewalLink: t("customerApp.executive.organizationalRenewalLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Renewal Center\nRoute: ${P.route}\nCore: Renewal is the disciplined practice of evolving while preserving what matters most.\nHelpers: _orlc_* · _orlcbp339_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Renewal is the disciplined practice of evolving while preserving what matters most.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase338-vocabulary";',
      `export * from "./implementation-blueprint-phase338-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE338_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase338-aipify-organizational-flourishing-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE338_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase338-aipify-organizational-flourishing-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Renewal Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_RENEWAL_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_RENEWAL_CENTER_ENGINE_PHASE${P.phase}.md) — Renewal Center at Executive Center → Organizational Renewal. Renewal dashboard, renewal engine, balance engine, reviews, and executive renewal view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_orlc_*\`, \`_orlcbp339_*\`. APIs at \`/api/organizational-renewal/*\`. Cross-links flourishing, learning, and adaptability centers.`;
  if (!c.includes("Organizational Renewal Center Engine (Phase 339)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_RENEWAL_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Renewal Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
