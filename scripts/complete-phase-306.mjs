#!/usr/bin/env node
/** ABOS Phase 306 — Aipify Organizational Resilience Center (user Phase 305) */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 306,
  migration: "20261423400000_aipify_organizational_resilience_center_engine_phase306.sql",
  slug: "aipify-organizational-resilience-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_RESILIENCE_CENTER",
  ilmFile: "implementation-blueprint-phase306-aipify-organizational-resilience-center.txt",
  route: "/app/executive/organizational-resilience",
  permKeys: ["resilience_center.view", "resilience_center.manage", "resilience_center.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Resilience Center",
    subtitle:
      "Anticipate disruptions, strengthen preparedness, and maintain operational continuity — calm readiness, not fear.",
    loading: "Loading Resilience Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Resilience philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    decisionSupportLink: "Decision Support →",
    strategicIntelligenceLink: "Strategic Intelligence →",
    continuousImprovementLink: "Continuous Improvement →",
    resilienceEngineLink: "Organizational Resilience Engine →",
    continuityLink: "Continuity →",
    dashboardTitle: "Resilience dashboard",
    scoreDimensionsTitle: "Resilience score dimensions",
    dependenciesTitle: "Critical dependencies",
    reviewsTitle: "Preparedness reviews",
    scenariosTitle: "Scenario readiness",
    insightsTitle: "Executive resilience insights",
    recommendationsTitle: "Aipify recommendations",
    executiveReviewsTitle: "Executive resilience reviews",
    emptySection: "No items in this section yet.",
    domain: "Domain",
    severity: "Severity",
    reviewState: "Review state",
    readiness: "Readiness",
    dismiss: "Dismiss",
    accept: "Accept",
    acknowledge: "Acknowledge",
    completeReview: "Mark review complete",
    humansDecide: "Preparedness strengthens continuity — Aipify improves readiness without creating fear.",
    privacyNote: "Privacy",
    organizationalResilienceLink: "Organizational Resilience",
    domains: {
      operational: "Operational resilience",
      technical: "Technical resilience",
      workforce: "Workforce resilience",
      customer: "Customer resilience",
      executive: "Executive resilience",
    },
    scoreLevels: {
      excellent: "Excellent",
      strong: "Strong",
      moderate: "Moderate",
      needs_improvement: "Needs improvement",
    },
    reviewStates: {
      current: "Current",
      review_recommended: "Review recommended",
      attention_needed: "Attention needed",
      critical: "Critical",
    },
    readinessLevels: {
      prepared: "Prepared",
      moderate: "Moderate",
      needs_planning: "Needs planning",
    },
    reviewTypes: {
      quarterly: "Quarterly review",
      annual: "Annual resilience assessment",
      leadership_continuity: "Leadership continuity discussion",
      recovery_capability: "Recovery capability evaluation",
    },
    metrics: {
      resilienceScore: "Organizational resilience score",
      resilienceLabel: "Resilience level",
      criticalDependencies: "Critical dependencies",
      reviewsCompleted: "Reviews completed",
      reviewsPending: "Reviews pending",
      recoveryCapability: "Recovery capability",
      executiveConfidence: "Executive confidence",
      companionUsefulness: "Companion usefulness",
    },
    dimensions: {
      knowledge: "Knowledge resilience",
      operational: "Operational resilience",
      workforce: "Workforce resilience",
      technical: "Technical resilience",
      governance: "Governance resilience",
    },
    settingsLink: "Organizational Resilience",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Motstandssenter", settingsLink: "Organisasjonsmotstand" }],
    ["sv", { ...i18nBlock(), title: "Motståndscenter", settingsLink: "Organisationsmotstånd" }],
    ["da", { ...i18nBlock(), title: "Modstandscenter", settingsLink: "Organisationsmodstand" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalResilienceCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalResilienceCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalResilienceLink = block.organizationalResilienceLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"improvement_center.view",', `"improvement_center.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalResilienceCenterEngine")) {
    c = c.replace(
      '| "continuousImprovementCenterEngine"',
      '| "organizationalResilienceCenterEngine"\n  | "continuousImprovementCenterEngine"',
    );
    c = c.replace(
      '{ id: "continuousImprovementCenterEngine", href: "/app/executive/continuous-improvement", labelKey: "customerApp.nav.continuousImprovementCenterEngine" },',
      `{ id: "organizationalResilienceCenterEngine", href: "/app/executive/organizational-resilience", labelKey: "customerApp.nav.organizationalResilienceCenterEngine" },
  { id: "continuousImprovementCenterEngine", href: "/app/executive/continuous-improvement", labelKey: "customerApp.nav.continuousImprovementCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/continuous-improvement")) return "continuousImprovementCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-resilience")) return "organizationalResilienceCenterEngine";\n  if (pathname.startsWith("/app/executive/continuous-improvement")) return "continuousImprovementCenterEngine";',
    );
    fs.writeFileSync(file, c);
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-resilience-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalResilienceLink")) {
    c = c.replace(
      "continuousImprovementLink: string;",
      "continuousImprovementLink: string;\n    organizationalResilienceLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/continuous-improvement" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.continuousImprovementLink}
        </Link>`,
      `<Link href="/app/executive/continuous-improvement" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.continuousImprovementLink}
        </Link>
        <Link href="/app/executive/organizational-resilience" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalResilienceLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalResilienceLink")) {
    p = p.replace(
      'continuousImprovementLink: t("customerApp.executive.continuousImprovementLink"),',
      'continuousImprovementLink: t("customerApp.executive.continuousImprovementLink"),\n        organizationalResilienceLink: t("customerApp.executive.organizationalResilienceLink"),',
    );
    fs.writeFileSync(page, p);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Resilience Center\nRoute: ${P.route}\nCore: Resilient organizations prepare for disruption.\nHelpers: _orc_* · _orcbp306_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Resilient organizations do not avoid disruption — they prepare for it.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase305-vocabulary";',
      `export * from "./implementation-blueprint-phase305-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE305_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase305-aipify-continuous-improvement-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE305_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase305-aipify-continuous-improvement-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Resilience Center (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_RESILIENCE_CENTER_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_RESILIENCE_CENTER_PHASE${P.phase}.md) — Resilience Center at Executive Center → Organizational Resilience. Resilience score, dependency engine, preparedness reviews, scenario readiness, and executive reviews. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_orc_*\`, \`_orcbp306_*\`. APIs at \`/api/organizational-resilience/*\`. Cross-links ORE and continuity — does not modify their RPCs.`;
  if (!c.includes("Organizational Resilience Center (Phase")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_RESILIENCE_CENTER_PHASE${P.phase}.md`),
  `# Aipify Organizational Resilience Center — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
