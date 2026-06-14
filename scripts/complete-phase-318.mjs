#!/usr/bin/env node
/** ABOS Phase 318 — Aipify Capability Maturity Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 318,
  migration: "20261424600000_aipify_capability_maturity_center_engine_phase318.sql",
  slug: "aipify-capability-maturity-center-engine",
  docSlug: "AIPIFY_CAPABILITY_MATURITY_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase318-aipify-capability-maturity-center.txt",
  route: "/app/executive/capability-maturity",
  permKeys: ["capability_maturity.view", "capability_maturity.manage", "capability_maturity.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Capability Maturity Center",
    subtitle:
      "Assess, benchmark, and improve organizational capabilities across operations, governance, knowledge, technology, leadership, and workforce development.",
    loading: "Loading Capability Maturity Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Maturity philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalHealthLink: "Organizational Health →",
    continuousImprovementLink: "Continuous Improvement →",
    organizationalLearningLink: "Organizational Learning →",
    knowledgeEvolutionLink: "Knowledge Evolution →",
    maturityEngineLink: "Capability Maturity Engine →",
    dashboardTitle: "Maturity dashboard",
    capabilitiesTitle: "Capability profile",
    milestonesTitle: "Capability milestones",
    roadmapTitle: "Improvement roadmap",
    snapshotsTitle: "Maturity snapshots",
    maturityLevelsTitle: "Maturity levels",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive maturity view",
    reviewsTitle: "Capability reviews",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    captureSnapshot: "Capture snapshot",
    completeReview: "Complete review",
    launchInitiative: "Launch initiative",
    generateReport: "Generate maturity report",
    generateSummary: "Generate executive summary",
    humansDecide: "Aipify supports awareness — leadership sets priorities and decides what to improve.",
    privacyNote: "Privacy",
    currentLevel: "Current level",
    previousLevel: "Previous level",
    score: "Score",
    domains: {
      customer_experience: "Customer experience",
      operational: "Operational",
      governance: "Governance",
      knowledge: "Knowledge",
      technology: "Technology",
      leadership: "Leadership",
      workforce: "Workforce",
    },
    maturityLevels: {
      emerging: "Emerging",
      developing: "Developing",
      established: "Established",
      advanced: "Advanced",
      transformational: "Transformational",
    },
    priorityTypes: {
      quick_win: "Quick win",
      strategic_initiative: "Strategic initiative",
      long_term_investment: "Long-term investment",
      capability_building: "Capability building",
    },
    momentumLabels: {
      up: "Improving",
      stable: "Stable",
      down: "Needs attention",
    },
    metrics: {
      assessed: "Capabilities assessed",
      strongest: "Strongest capabilities",
      developing: "Developing capabilities",
      improving: "Improving capabilities",
      opportunities: "Improvement opportunities",
      confidence: "Executive confidence",
      participation: "Participation satisfaction",
    },
    executiveFields: {
      strengths: "Organizational strengths",
      gaps: "Capability gaps",
      momentum: "Improvement momentum",
      readiness: "Strategic readiness",
    },
    settingsLink: "Capability Maturity",
    capabilityMaturityLink: "Capability Maturity",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Kapabilitetsmodenhetssenter", settingsLink: "Kapabilitetsmodenhet" }],
    ["sv", { ...i18nBlock(), title: "Kapabilitetsmognadscenter", settingsLink: "Kapabilitetsmognad" }],
    ["da", { ...i18nBlock(), title: "Kapabilitetsmodenhedscenter", settingsLink: "Kapabilitetsmodenhed" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.capabilityMaturityCenter = block;
    data.nav = data.nav ?? {};
    data.nav.capabilityMaturityCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.capabilityMaturityLink = block.capabilityMaturityLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"knowledge_evolution.view",', `"knowledge_evolution.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("capabilityMaturityCenterEngine")) {
    c = c.replace(
      '| "organizationalDigitalTwinCenterEngine"',
      '| "capabilityMaturityCenterEngine"\n  | "organizationalDigitalTwinCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalDigitalTwinCenterEngine", href: "/app/executive/organizational-digital-twin", labelKey: "customerApp.nav.organizationalDigitalTwinCenterEngine" },',
      `{ id: "capabilityMaturityCenterEngine", href: "/app/executive/capability-maturity", labelKey: "customerApp.nav.capabilityMaturityCenterEngine" },
  { id: "organizationalDigitalTwinCenterEngine", href: "/app/executive/organizational-digital-twin", labelKey: "customerApp.nav.organizationalDigitalTwinCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-digital-twin")) return "organizationalDigitalTwinCenterEngine";',
      'if (pathname.startsWith("/app/executive/capability-maturity")) return "capabilityMaturityCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-digital-twin")) return "organizationalDigitalTwinCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-capability-maturity-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("capabilityMaturityLink")) {
    c = c.replace(
      "organizationalDigitalTwinLink: string;",
      "organizationalDigitalTwinLink: string;\n    capabilityMaturityLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-digital-twin" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalDigitalTwinLink}
        </Link>`,
      `<Link href="/app/executive/organizational-digital-twin" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalDigitalTwinLink}
        </Link>
        <Link href="/app/executive/capability-maturity" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.capabilityMaturityLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("capabilityMaturityLink")) {
    p = p.replace(
      'organizationalDigitalTwinLink: t("customerApp.executive.organizationalDigitalTwinLink"),',
      'organizationalDigitalTwinLink: t("customerApp.executive.organizationalDigitalTwinLink"),\n        capabilityMaturityLink: t("customerApp.executive.capabilityMaturityLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Capability Maturity Center\nRoute: ${P.route}\nCore: Organizations do not become world-class overnight.\nHelpers: _cmc_* · _cmcbp318_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Organizations do not become world-class overnight. Excellence is developed capability by capability over time.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase317-vocabulary";',
      `export * from "./implementation-blueprint-phase317-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE317_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase317-aipify-knowledge-evolution-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE317_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase317-aipify-knowledge-evolution-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Capability Maturity Center Engine (Phase ${P.phase}):** See [AIPIFY_CAPABILITY_MATURITY_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_CAPABILITY_MATURITY_CENTER_ENGINE_PHASE${P.phase}.md) — Capability Maturity Center at Executive Center → Capability Maturity. Maturity levels, capability profiles, evolution view, improvement roadmap, and executive maturity view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_cmc_*\`, \`_cmcbp318_*\`. APIs at \`/api/capability-maturity/*\`. Cross-links legacy capability maturity engine — does not modify its RPCs.`;
  if (!c.includes("Capability Maturity Center Engine (Phase 318)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_CAPABILITY_MATURITY_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Capability Maturity Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
