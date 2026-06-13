#!/usr/bin/env node
/** ABOS Phase 307 — Aipify Opportunity Discovery Center (user Phase 306) */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 307,
  migration: "20261423500000_aipify_opportunity_discovery_center_engine_phase307.sql",
  slug: "aipify-opportunity-discovery-center-engine",
  docSlug: "AIPIFY_OPPORTUNITY_DISCOVERY_CENTER",
  ilmFile: "implementation-blueprint-phase307-aipify-opportunity-discovery-center.txt",
  route: "/app/executive/opportunity-discovery",
  permKeys: ["opportunity_center.view", "opportunity_center.manage", "opportunity_center.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Opportunity Center",
    subtitle:
      "Proactively identify growth, innovation, and value creation opportunities — aligned with priorities, never hype-driven.",
    loading: "Loading Opportunity Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Opportunity philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    decisionSupportLink: "Decision Support →",
    strategicIntelligenceLink: "Strategic Intelligence →",
    continuousImprovementLink: "Continuous Improvement →",
    organizationalResilienceLink: "Organizational Resilience →",
    innovationLabLink: "Innovation Lab →",
    recommendationsLink: "Recommendations →",
    dashboardTitle: "Opportunity dashboard",
    opportunitiesTitle: "Discovered opportunities",
    signalsTitle: "Discovery signals",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveReviewsTitle: "Executive review support",
    learningSectionTitle: "Opportunity learning",
    workflowTitle: "Opportunity workflow",
    emptySection: "No items in this section yet.",
    domain: "Domain",
    alignment: "Strategic alignment",
    impact: "Potential impact",
    effort: "Required effort",
    workflowStatus: "Workflow status",
    dismiss: "Dismiss",
    accept: "Accept",
    advance: "Advance review",
    decline: "Decline",
    archive: "Archive",
    completeReview: "Mark review complete",
    captureLearning: "Capture learning",
    learningFormTitle: "Learning title",
    learningContent: "What was pursued, declined, or learned",
    humansDecide: "Executive teams evaluate every opportunity — Aipify surfaces possibilities, not promises.",
    privacyNote: "Privacy",
    opportunityDiscoveryLink: "Opportunity Discovery",
    domains: {
      revenue: "Revenue opportunities",
      customer: "Customer opportunities",
      operational: "Operational opportunities",
      workforce: "Workforce opportunities",
      market: "Market opportunities",
      innovation: "Innovation opportunities",
    },
    scoreLevels: {
      exceptional: "Exceptional opportunity",
      strong: "Strong opportunity",
      monitor: "Monitor",
      low_priority: "Low priority",
    },
    workflowStatuses: {
      identified: "Opportunity identified",
      strategic_review: "Strategic review",
      impact_assessment: "Impact assessment",
      resource_evaluation: "Resource evaluation",
      executive_decision: "Executive decision",
      implementation_planning: "Implementation planning",
      outcome_measurement: "Outcome measurement",
      declined: "Declined",
      archived: "Archived",
    },
    reviewTypes: {
      monthly: "Monthly opportunity review",
      quarterly_growth: "Quarterly growth review",
      innovation_workshop: "Innovation workshop",
      strategic_prioritization: "Strategic prioritization session",
    },
    metrics: {
      identified: "Opportunities identified",
      underReview: "Under review",
      highValue: "High-value opportunities",
      alignment: "Strategic alignment",
      satisfaction: "Executive satisfaction",
      usefulness: "Companion usefulness",
    },
    settingsLink: "Opportunity Discovery",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Mulighetssenter", settingsLink: "Mulighetsoppdagelse" }],
    ["sv", { ...i18nBlock(), title: "Möjlighetscenter", settingsLink: "Möjlighetsupptäckt" }],
    ["da", { ...i18nBlock(), title: "Mulighedscenter", settingsLink: "Mulighedsopdagelse" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.opportunityDiscoveryCenter = block;
    data.nav = data.nav ?? {};
    data.nav.opportunityDiscoveryCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.opportunityDiscoveryLink = block.opportunityDiscoveryLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"resilience_center.view",', `"resilience_center.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("opportunityDiscoveryCenterEngine")) {
    c = c.replace(
      '| "organizationalResilienceCenterEngine"',
      '| "opportunityDiscoveryCenterEngine"\n  | "organizationalResilienceCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalResilienceCenterEngine", href: "/app/executive/organizational-resilience", labelKey: "customerApp.nav.organizationalResilienceCenterEngine" },',
      `{ id: "opportunityDiscoveryCenterEngine", href: "/app/executive/opportunity-discovery", labelKey: "customerApp.nav.opportunityDiscoveryCenterEngine" },
  { id: "organizationalResilienceCenterEngine", href: "/app/executive/organizational-resilience", labelKey: "customerApp.nav.organizationalResilienceCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-resilience")) return "organizationalResilienceCenterEngine";',
      'if (pathname.startsWith("/app/executive/opportunity-discovery")) return "opportunityDiscoveryCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-resilience")) return "organizationalResilienceCenterEngine";',
    );
    fs.writeFileSync(file, c);
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-opportunity-discovery-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("opportunityDiscoveryLink")) {
    c = c.replace(
      "organizationalResilienceLink: string;",
      "organizationalResilienceLink: string;\n    opportunityDiscoveryLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-resilience" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalResilienceLink}
        </Link>`,
      `<Link href="/app/executive/organizational-resilience" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalResilienceLink}
        </Link>
        <Link href="/app/executive/opportunity-discovery" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.opportunityDiscoveryLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("opportunityDiscoveryLink")) {
    p = p.replace(
      'organizationalResilienceLink: t("customerApp.executive.organizationalResilienceLink"),',
      'organizationalResilienceLink: t("customerApp.executive.organizationalResilienceLink"),\n        opportunityDiscoveryLink: t("customerApp.executive.opportunityDiscoveryLink"),',
    );
    fs.writeFileSync(page, p);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Opportunity Discovery Center\nRoute: ${P.route}\nCore: Organizations should discover opportunities, not only solve problems.\nHelpers: _odc_* · _odcbp307_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Organizations often spend most of their time solving problems. Aipify should also help them discover opportunities.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase306-vocabulary";',
      `export * from "./implementation-blueprint-phase306-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE306_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase306-aipify-organizational-resilience-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE306_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase306-aipify-organizational-resilience-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Opportunity Discovery Center (Phase ${P.phase}):** See [AIPIFY_OPPORTUNITY_DISCOVERY_CENTER_PHASE${P.phase}.md](./AIPIFY_OPPORTUNITY_DISCOVERY_CENTER_PHASE${P.phase}.md) — Opportunity Center at Executive Center → Opportunity Discovery. Opportunity scoring, discovery signals, workflow, executive reviews, and learning engine. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_odc_*\`, \`_odcbp307_*\`. APIs at \`/api/opportunity-discovery/*\`. Cross-links strategic intelligence and innovation lab — does not modify their RPCs.`;
  if (!c.includes("Opportunity Discovery Center (Phase")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_OPPORTUNITY_DISCOVERY_CENTER_PHASE${P.phase}.md`),
  `# Aipify Opportunity Discovery Center — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
