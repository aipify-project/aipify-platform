#!/usr/bin/env node
/** ABOS Phase 340 — Aipify Organizational Sustainability Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 340,
  migration: "20261426800000_aipify_organizational_sustainability_center_engine_phase340.sql",
  slug: "aipify-organizational-sustainability-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_SUSTAINABILITY_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase340-aipify-organizational-sustainability-center.txt",
  route: "/app/executive/organizational-sustainability",
  permKeys: ["org_sustainability.view", "org_sustainability.manage", "org_sustainability.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Sustainability",
    subtitle:
      "Sustain performance, resilience, capability growth, customer trust, and long-term viability through balanced decision-making and responsible stewardship.",
    loading: "Loading Sustainability Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Sustainability philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalRenewalLink: "Organizational Renewal →",
    organizationalFlourishingLink: "Organizational Flourishing →",
    organizationalResilienceLink: "Organizational Resilience →",
    dashboardTitle: "Sustainability dashboard",
    concernsTitle: "Sustainability engine",
    growthTitle: "Balanced growth engine",
    initiativesTitle: "Sustainability initiatives",
    reviewsTitle: "Sustainability reviews",
    timelineTitle: "Sustainability timeline",
    milestonesTitle: "Sustainability milestones",
    snapshotsTitle: "Sustainability snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive sustainability view",
    sessionsTitle: "Sustainability sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleReflection: "Schedule reflection session",
    completeInitiative: "Complete initiative",
    generateReport: "Generate sustainability report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export sustainability snapshot",
    coordinateReview: "Coordinate leadership review",
    archiveMilestone: "Archive sustainability milestone",
    humansDecide: "Aipify supports long-term stewardship — leaders retain judgment; sustainability means creating value that can be maintained over time.",
    privacyNote: "Privacy",
    sustainabilityScore: "Organizational sustainability score",
    sustainabilityTrend: "Sustainability trend",
    domains: {
      workforce: "Workforce sustainability",
      customer: "Customer sustainability",
      operational: "Operational sustainability",
      financial: "Financial sustainability",
      leadership: "Leadership sustainability",
      strategic: "Strategic sustainability",
    },
    concernTypes: {
      overextension_risk: "Overextension risk",
      resource_imbalance: "Resource imbalance",
      recovery_limitation: "Recovery limitation",
      growth_sustainability: "Growth sustainability",
      long_term_opportunity: "Long-term opportunity",
    },
    concernTones: {
      positive: "Positive indicator",
      neutral: "Neutral indicator",
      attention: "Needs attention",
    },
    growthTypes: {
      maintainable_growth: "Maintainable growth",
      resource_alignment: "Resource alignment",
      people_support: "People support",
      system_preparedness: "System preparedness",
      responsible_success: "Responsible success",
    },
    initiativeStatuses: {
      planned: "Planned",
      in_progress: "In progress",
      completed: "Completed",
    },
    healthLabels: {
      thriving: "Thriving",
      healthy: "Healthy",
      stable: "Stable",
      attention_recommended: "Attention recommended",
      unsustainable_risk: "Unsustainable risk",
    },
    timelineTypes: {
      resilience_milestone: "Resilience milestone",
      leadership_development: "Leadership development",
      operational_improvement: "Operational improvement",
      strategic_reassessment: "Strategic reassessment",
      sustainability_initiative: "Sustainability initiative",
    },
    reviewTypes: {
      quarterly_sustainability: "Quarterly sustainability review",
      annual_viability: "Annual viability discussion",
      leadership_reflection: "Leadership reflection session",
      strategic_sustainability: "Strategic sustainability workshop",
    },
    sessionTypes: {
      reflection_session: "Reflection session",
      viability_discussion: "Viability discussion",
      sustainability_workshop: "Sustainability workshop",
    },
    metrics: {
      workforce: "Workforce resilience",
      operational: "Operational maintainability",
      strategic: "Strategic consistency",
      leadership: "Leadership preparedness",
      financial: "Financial stability",
      resilience: "Resilience measures",
      initiatives: "Initiatives in progress",
      reviews: "Reviews completed",
    },
    executiveFields: {
      viability: "Long-term viability indicators",
      leadership: "Leadership preparedness measures",
      resilience: "Organizational resilience trends",
      opportunities: "Sustainability opportunities",
    },
    settingsLink: "Organizational Sustainability",
    organizationalSustainabilityLink: "Organizational Sustainability",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisatorisk bærekraft", settingsLink: "Organisatorisk bærekraft" }],
    ["sv", { ...i18nBlock(), title: "Organisatorisk hållbarhet", settingsLink: "Organisatorisk hållbarhet" }],
    ["da", { ...i18nBlock(), title: "Organisatorisk bæredygtighed", settingsLink: "Organisatorisk bæredygtighed" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalSustainabilityCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalSustainabilityCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalSustainabilityLink = block.organizationalSustainabilityLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_renewal.view",', `"org_renewal.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalSustainabilityCenterEngine")) {
    c = c.replace(
      '| "organizationalRenewalCenterEngine"',
      '| "organizationalSustainabilityCenterEngine"\n  | "organizationalRenewalCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalRenewalCenterEngine", href: "/app/executive/organizational-renewal", labelKey: "customerApp.nav.organizationalRenewalCenterEngine" },',
      `{ id: "organizationalSustainabilityCenterEngine", href: "/app/executive/organizational-sustainability", labelKey: "customerApp.nav.organizationalSustainabilityCenterEngine" },
  { id: "organizationalRenewalCenterEngine", href: "/app/executive/organizational-renewal", labelKey: "customerApp.nav.organizationalRenewalCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-renewal")) return "organizationalRenewalCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-sustainability")) return "organizationalSustainabilityCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-renewal")) return "organizationalRenewalCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-sustainability-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalSustainabilityLink")) {
    c = c.replace(
      "organizationalRenewalLink: string;",
      "organizationalRenewalLink: string;\n    organizationalSustainabilityLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-renewal" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalRenewalLink}
        </Link>`,
      `<Link href="/app/executive/organizational-renewal" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalRenewalLink}
        </Link>
        <Link href="/app/executive/organizational-sustainability" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalSustainabilityLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalSustainabilityLink")) {
    p = p.replace(
      'organizationalRenewalLink: t("customerApp.executive.organizationalRenewalLink"),',
      'organizationalRenewalLink: t("customerApp.executive.organizationalRenewalLink"),\n        organizationalSustainabilityLink: t("customerApp.executive.organizationalSustainabilityLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Sustainability Center\nRoute: ${P.route}\nCore: Success that cannot be sustained eventually becomes failure.\nHelpers: _oslc_* · _oslcbp340_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Success that cannot be sustained eventually becomes failure.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase339-vocabulary";',
      `export * from "./implementation-blueprint-phase339-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE339_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase339-aipify-organizational-renewal-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE339_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase339-aipify-organizational-renewal-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Sustainability Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_SUSTAINABILITY_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_SUSTAINABILITY_CENTER_ENGINE_PHASE${P.phase}.md) — Sustainability Center at Executive Center → Organizational Sustainability. Sustainability dashboard, sustainability engine, balanced growth engine, reviews, and executive sustainability view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_oslc_*\`, \`_oslcbp340_*\`. APIs at \`/api/organizational-sustainability/*\`. Cross-links renewal, flourishing, resilience, and stewardship centers.`;
  if (!c.includes("Organizational Sustainability Center Engine (Phase 340)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_SUSTAINABILITY_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Sustainability Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
