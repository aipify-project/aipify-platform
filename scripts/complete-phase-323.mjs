#!/usr/bin/env node
/** ABOS Phase 323 — Aipify Organizational Adaptability Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 323,
  migration: "20261425100000_aipify_organizational_adaptability_center_engine_phase323.sql",
  slug: "aipify-organizational-adaptability-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_ADAPTABILITY_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase323-aipify-organizational-adaptability-center.txt",
  route: "/app/executive/organizational-adaptability",
  permKeys: ["org_adaptability.view", "org_adaptability.manage", "org_adaptability.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Adaptability Center",
    subtitle:
      "Recognize change early, adjust priorities effectively, and strengthen adaptability without sacrificing stability or purpose.",
    loading: "Loading Adaptability Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Adaptability philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalResilienceLink: "Organizational Resilience →",
    changeManagementLink: "Change Management →",
    organizationalLearningLink: "Organizational Learning →",
    organizationalEnergyLink: "Organizational Energy →",
    dashboardTitle: "Adaptability dashboard",
    signalsTitle: "Emerging changes detected",
    opportunitiesTitle: "Adaptation opportunities",
    responsivenessTitle: "Strategic responsiveness indicators",
    prioritiesTitle: "Executive priorities",
    historyTitle: "Adaptation history",
    snapshotsTitle: "Trend snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive adaptability view",
    reviewsTitle: "Adaptability reviews",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    discussSignal: "Mark for discussion",
    scheduleReflection: "Schedule reflection session",
    generateSummary: "Generate executive summary",
    generateReport: "Generate adaptability report",
    exportSnapshot: "Export trend snapshot",
    humansDecide: "Aipify supports awareness and responsiveness — leadership owns adaptation decisions.",
    privacyNote: "Privacy",
    owner: "Owner",
    adaptabilityScore: "Adaptability score",
    domains: {
      strategic: "Strategic adaptability",
      operational: "Operational adaptability",
      workforce: "Workforce adaptability",
      technology: "Technology adaptability",
      customer: "Customer adaptability",
      leadership: "Leadership adaptability",
    },
    healthLabels: {
      exceptional: "Exceptional",
      strong: "Strong",
      stable: "Stable",
      developing: "Developing",
      rigid: "Rigid",
    },
    signalTypes: {
      emerging_trend: "Emerging trend",
      customer_shift: "Customer expectation shift",
      operational_pressure: "Operational pressure",
      technology_development: "Technology development",
      workforce_change: "Workforce change",
      strategic_disruption: "Strategic disruption",
    },
    historyTypes: {
      org_adjustment: "Organizational adjustment",
      strategic_shift: "Strategic shift",
      initiative_recalibration: "Initiative recalibration",
      recovery_response: "Recovery response",
      learning_application: "Learning application",
    },
    reviewTypes: {
      monthly: "Monthly adaptability review",
      quarterly: "Quarterly strategic recalibration",
      annual: "Annual resilience reflection",
      executive_learning: "Executive learning discussion",
    },
    metrics: {
      opportunities: "Adaptation opportunities",
      emergingChanges: "Emerging changes",
      responsiveness: "Responsiveness",
      learning: "Learning integration",
      readiness: "Change readiness",
      recovery: "Recovery flexibility",
      confidence: "Leadership confidence",
    },
    executiveFields: {
      flexibility: "Strategic flexibility",
      responsiveness: "Responsiveness trends",
      learning: "Learning integration",
      opportunities: "Adaptation opportunities",
    },
    settingsLink: "Organizational Adaptability",
    organizationalAdaptabilityLink: "Organizational Adaptability",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Tilpasningssenter", settingsLink: "Organisasjonstilpasning" }],
    ["sv", { ...i18nBlock(), title: "Anpassningscenter", settingsLink: "Organisationsanpassning" }],
    ["da", { ...i18nBlock(), title: "Tilpasningscenter", settingsLink: "Organisationstilpasning" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalAdaptabilityCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalAdaptabilityCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalAdaptabilityLink = block.organizationalAdaptabilityLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_energy.view",', `"org_energy.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalAdaptabilityCenterEngine")) {
    c = c.replace(
      '| "organizationalEnergyCenterEngine"',
      '| "organizationalAdaptabilityCenterEngine"\n  | "organizationalEnergyCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalEnergyCenterEngine", href: "/app/executive/organizational-energy", labelKey: "customerApp.nav.organizationalEnergyCenterEngine" },',
      `{ id: "organizationalAdaptabilityCenterEngine", href: "/app/executive/organizational-adaptability", labelKey: "customerApp.nav.organizationalAdaptabilityCenterEngine" },
  { id: "organizationalEnergyCenterEngine", href: "/app/executive/organizational-energy", labelKey: "customerApp.nav.organizationalEnergyCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-energy")) return "organizationalEnergyCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-adaptability")) return "organizationalAdaptabilityCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-energy")) return "organizationalEnergyCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-adaptability-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalAdaptabilityLink")) {
    c = c.replace(
      "organizationalEnergyLink: string;",
      "organizationalEnergyLink: string;\n    organizationalAdaptabilityLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-energy" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalEnergyLink}
        </Link>`,
      `<Link href="/app/executive/organizational-energy" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalEnergyLink}
        </Link>
        <Link href="/app/executive/organizational-adaptability" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalAdaptabilityLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalAdaptabilityLink")) {
    p = p.replace(
      'organizationalEnergyLink: t("customerApp.executive.organizationalEnergyLink"),',
      'organizationalEnergyLink: t("customerApp.executive.organizationalEnergyLink"),\n        organizationalAdaptabilityLink: t("customerApp.executive.organizationalAdaptabilityLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Adaptability Center\nRoute: ${P.route}\nCore: The future rarely unfolds exactly as planned.\nHelpers: _oad_* · _oadbp323_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "The future rarely unfolds exactly as planned. Organizations that adapt thoughtfully are often the ones that endure and thrive.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase322-vocabulary";',
      `export * from "./implementation-blueprint-phase322-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE322_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase322-aipify-organizational-energy-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE322_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase322-aipify-organizational-energy-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Adaptability Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_ADAPTABILITY_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_ADAPTABILITY_CENTER_ENGINE_PHASE${P.phase}.md) — Adaptability Center at Executive Center → Organizational Adaptability. Change signals, adaptation opportunities, responsiveness indicators, and executive adaptability view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_oad_*\`, \`_oadbp323_*\`. APIs at \`/api/organizational-adaptability/*\`. Cross-links executive centers — does not modify their RPCs.`;
  if (!c.includes("Organizational Adaptability Center Engine (Phase 323)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_ADAPTABILITY_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Adaptability Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
