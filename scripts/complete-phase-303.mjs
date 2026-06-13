#!/usr/bin/env node
/** ABOS Phase 303 — Aipify Executive Strategic Intelligence Center */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 303,
  migration: "20261423100000_aipify_executive_strategic_intelligence_engine_phase303.sql",
  slug: "aipify-executive-strategic-intelligence-engine",
  docSlug: "AIPIFY_EXECUTIVE_STRATEGIC_INTELLIGENCE",
  ilmFile: "implementation-blueprint-phase303-aipify-executive-strategic-intelligence.txt",
  route: "/app/executive/strategic-intelligence",
  permKeys: ["strategic_intelligence.view", "strategic_intelligence.manage", "strategic_intelligence.record"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Strategic Intelligence Center",
    subtitle:
      "Identify opportunities, emerging risks, and strategic priorities — factors worth considering, not directives.",
    loading: "Loading Strategic Intelligence Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Strategic philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    decisionSupportLink: "Decision Support →",
    strategicFoundationLink: "Strategic foundation →",
    executiveIntelligenceLink: "Executive intelligence →",
    dashboardTitle: "Strategic dashboard",
    opportunitiesTitle: "Opportunities identified",
    risksTitle: "Emerging risks",
    trendsTitle: "Trend indicators",
    prioritiesTitle: "Strategic priorities",
    insightsTitle: "Executive insights",
    recommendationsTitle: "Recommended reviews",
    reviewsTitle: "Strategic review engine",
    scenariosTitle: "Scenario support",
    emptySection: "No signals in this section yet.",
    domain: "Domain",
    impact: "Impact",
    urgency: "Urgency",
    priorityMatrix: "Priority",
    trend: "Trend",
    escalate: "Escalate",
    prioritize: "Prioritize",
    evaluate: "Evaluate",
    monitor: "Monitor",
    accept: "Accept",
    dismiss: "Dismiss",
    completeReview: "Mark review complete",
    leadershipDecides: "Leadership remains responsible for every strategic decision — Aipify surfaces signals, not certainty.",
    domains: {
      business_performance: "Business performance",
      customer_intelligence: "Customer intelligence",
      workforce_intelligence: "Workforce intelligence",
      market_intelligence: "Market intelligence",
      executive_intelligence: "Executive intelligence",
    },
    reviewTypes: {
      monthly: "Monthly review",
      quarterly: "Quarterly review",
      annual: "Annual strategic review",
    },
    metrics: {
      opportunities: "Opportunities",
      risks: "Emerging risks",
      trends: "Trends",
      escalations: "Escalations",
      reviewsPending: "Reviews pending",
      satisfaction: "Executive satisfaction",
      trust: "Leadership trust",
    },
    privacyNote: "Privacy",
    settingsLink: "Strategic Intelligence",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Strategisk intelligenssenter", settingsLink: "Strategisk intelligens" }],
    ["sv", { ...i18nBlock(), title: "Strategiskt intelligenscenter", settingsLink: "Strategisk intelligens" }],
    ["da", { ...i18nBlock(), title: "Strategisk intelligenscenter", settingsLink: "Strategisk intelligens" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.executiveStrategicIntelligence = block;
    data.nav = data.nav ?? {};
    data.nav.executiveStrategicIntelligenceEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.strategicIntelligenceLink = block.settingsLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"executive_decision.view",', `"executive_decision.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("executiveStrategicIntelligenceEngine")) {
    c = c.replace(
      '| "executiveDecisionSupportEngine"',
      '| "executiveStrategicIntelligenceEngine"\n  | "executiveDecisionSupportEngine"',
    );
    c = c.replace(
      `{ id: "executiveDecisionSupportEngine", href: "/app/executive/decision-support", labelKey: "customerApp.nav.executiveDecisionSupportEngine" },`,
      `{ id: "executiveStrategicIntelligenceEngine", href: "/app/executive/strategic-intelligence", labelKey: "customerApp.nav.executiveStrategicIntelligenceEngine" },
  { id: "executiveDecisionSupportEngine", href: "/app/executive/decision-support", labelKey: "customerApp.nav.executiveDecisionSupportEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/decision-support")) return "executiveDecisionSupportEngine";',
      'if (pathname.startsWith("/app/executive/strategic-intelligence")) return "executiveStrategicIntelligenceEngine";\n  if (pathname.startsWith("/app/executive/decision-support")) return "executiveDecisionSupportEngine";',
    );
    fs.writeFileSync(file, c);
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-executive-strategic-intelligence-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Executive Strategic Intelligence Center\nRoute: ${P.route}\nCore: Help leaders see what they might otherwise miss.\nHelpers: _sic_* · _sicbp303_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Organizations are often too busy operating to recognize what is changing around them.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase302-vocabulary";',
      `export * from "./implementation-blueprint-phase302-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE302_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase302-aipify-executive-decision-support.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE302_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase302-aipify-executive-decision-support.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Executive Strategic Intelligence Center (Phase ${P.phase}):** See [AIPIFY_EXECUTIVE_STRATEGIC_INTELLIGENCE_PHASE${P.phase}.md](./AIPIFY_EXECUTIVE_STRATEGIC_INTELLIGENCE_PHASE${P.phase}.md) — Strategic Intelligence Center at Executive Center → Strategic Intelligence. Opportunities, risks, trends, priority matrix, executive insights, scenario support, and strategic reviews. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_sic_*\`, \`_sicbp303_*\`. APIs at \`/api/executive-strategic-intelligence/*\`. Cross-links strategic foundation and executive intelligence — does not modify their RPCs.`;
  if (!c.includes("Executive Strategic Intelligence Center")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_EXECUTIVE_STRATEGIC_INTELLIGENCE_PHASE${P.phase}.md`),
  `# Aipify Executive Strategic Intelligence Center — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
patchIlm();
patchArchitecture();
console.log(`Phase ${P.phase} complete`);
