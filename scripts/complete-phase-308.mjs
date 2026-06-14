#!/usr/bin/env node
/** ABOS Phase 308 — Aipify Organizational Health Center */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 308,
  migration: "20261423600000_aipify_organizational_health_center_engine_phase308.sql",
  slug: "aipify-organizational-health-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_HEALTH_CENTER",
  ilmFile: "implementation-blueprint-phase308-aipify-organizational-health-center.txt",
  route: "/app/executive/organizational-health",
  permKeys: ["health_center.view", "health_center.manage", "health_center.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Health Center",
    subtitle:
      "Unified executive health across customer, workforce, operational, governance, strategic, and financial indicators — balanced insight for leadership reflection.",
    loading: "Loading Organizational Health Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Health philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    decisionSupportLink: "Decision Support →",
    strategicIntelligenceLink: "Strategic Intelligence →",
    continuousImprovementLink: "Continuous Improvement →",
    organizationalResilienceLink: "Organizational Resilience →",
    opportunityDiscoveryLink: "Opportunity Discovery →",
    earlyWarningLink: "Early Warning →",
    workforceInsightsLink: "Workforce Insights →",
    organizationalHealthEngineLink: "Organizational Health Engine →",
    dashboardTitle: "Health dashboard",
    domainScoresTitle: "Health domain scores",
    indicatorsTitle: "Trend indicators",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    earlyWarningsTitle: "Early warnings",
    healthReviewsTitle: "Health reviews",
    timelineTitle: "Executive health timeline",
    emptySection: "No items in this section yet.",
    overallScore: "Overall health score",
    trend: "Trend",
    dismiss: "Dismiss",
    accept: "Accept",
    acknowledge: "Acknowledge",
    completeReview: "Mark review complete",
    generateReport: "Generate executive report",
    archiveSnapshot: "Archive health snapshot",
    humansDecide: "Health scores support discussion — leaders decide what action, if any, is appropriate.",
    privacyNote: "Privacy",
    organizationalHealthLink: "Organizational Health",
    domains: {
      customer: "Customer health",
      workforce: "Workforce health",
      operational: "Operational health",
      governance: "Governance health",
      strategic: "Strategic health",
      financial: "Financial health",
    },
    healthBands: {
      thriving: "Thriving",
      healthy: "Healthy",
      stable: "Stable",
      needs_attention: "Needs attention",
      critical_review: "Critical review recommended",
    },
    trendDirections: {
      improving: "Improving",
      stable: "Stable",
      declining: "Declining",
      seasonal: "Seasonal variation",
      recovering: "Recovering",
    },
    reviewTypes: {
      monthly: "Monthly health review",
      quarterly: "Quarterly health review",
      annual: "Annual health assessment",
      leadership_reflection: "Leadership reflection session",
    },
    metrics: {
      improving: "Domains improving",
      needsAttention: "Domains needing attention",
      openWarnings: "Open early warnings",
      reviewsPending: "Reviews pending",
      confidence: "Executive confidence",
      reviewCompletion: "Review completion",
      usefulness: "Recommendation usefulness",
      satisfaction: "Leadership satisfaction",
    },
    settingsLink: "Organizational Health",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisasjonshelsesenter", settingsLink: "Organisasjonshelse" }],
    ["sv", { ...i18nBlock(), title: "Organisationshälsocenter", settingsLink: "Organisationshälsa" }],
    ["da", { ...i18nBlock(), title: "Organisationshelbredscenter", settingsLink: "Organisationshelbred" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalHealthCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalHealthCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalHealthLink = block.organizationalHealthLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"opportunity_center.view",', `"opportunity_center.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalHealthCenterEngine")) {
    c = c.replace(
      '| "opportunityDiscoveryCenterEngine"',
      '| "organizationalHealthCenterEngine"\n  | "opportunityDiscoveryCenterEngine"',
    );
    c = c.replace(
      '{ id: "opportunityDiscoveryCenterEngine", href: "/app/executive/opportunity-discovery", labelKey: "customerApp.nav.opportunityDiscoveryCenterEngine" },',
      `{ id: "organizationalHealthCenterEngine", href: "/app/executive/organizational-health", labelKey: "customerApp.nav.organizationalHealthCenterEngine" },
  { id: "opportunityDiscoveryCenterEngine", href: "/app/executive/opportunity-discovery", labelKey: "customerApp.nav.opportunityDiscoveryCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/opportunity-discovery")) return "opportunityDiscoveryCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-health")) return "organizationalHealthCenterEngine";\n  if (pathname.startsWith("/app/executive/opportunity-discovery")) return "opportunityDiscoveryCenterEngine";',
    );
    fs.writeFileSync(file, c);
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-health-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalHealthLink")) {
    c = c.replace(
      "opportunityDiscoveryLink: string;",
      "opportunityDiscoveryLink: string;\n    organizationalHealthLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/opportunity-discovery" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.opportunityDiscoveryLink}
        </Link>`,
      `<Link href="/app/executive/opportunity-discovery" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.opportunityDiscoveryLink}
        </Link>
        <Link href="/app/executive/organizational-health" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalHealthLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalHealthLink")) {
    p = p.replace(
      'opportunityDiscoveryLink: t("customerApp.executive.opportunityDiscoveryLink"),',
      'opportunityDiscoveryLink: t("customerApp.executive.opportunityDiscoveryLink"),\n        organizationalHealthLink: t("customerApp.executive.organizationalHealthLink"),',
    );
    fs.writeFileSync(page, p);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Health Center\nRoute: ${P.route}\nCore: Organizations rarely fail because of one major issue — Aipify helps leaders notice trends early.\nHelpers: _ohc_* · _ohcbp308_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Organizations rarely fail because of one major issue. They struggle when small problems remain unnoticed for too long.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase307-vocabulary";',
      `export * from "./implementation-blueprint-phase307-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE307_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase307-aipify-opportunity-discovery-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE307_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase307-aipify-opportunity-discovery-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Health Center (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_HEALTH_CENTER_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_HEALTH_CENTER_PHASE${P.phase}.md) — Organizational Health Center at Executive Center → Organizational Health. Unified health scores, domain trends, early warnings, reviews, and executive timeline. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_ohc_*\`, \`_ohcbp308_*\`. APIs at \`/api/organizational-health/*\`. Cross-links existing organizational health engines — does not modify their RPCs.`;
  if (!c.includes("Organizational Health Center (Phase")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_HEALTH_CENTER_PHASE${P.phase}.md`),
  `# Aipify Organizational Health Center — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
