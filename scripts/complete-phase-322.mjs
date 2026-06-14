#!/usr/bin/env node
/** ABOS Phase 322 — Aipify Organizational Energy Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 322,
  migration: "20261425000000_aipify_organizational_energy_center_engine_phase322.sql",
  slug: "aipify-organizational-energy-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_ENERGY_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase322-aipify-organizational-energy-center.txt",
  route: "/app/executive/organizational-energy",
  permKeys: ["org_energy.view", "org_energy.manage", "org_energy.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Energy Center",
    subtitle:
      "Understand, protect, and optimize the sustainable use of organizational energy by balancing ambition, capacity, recovery, and execution effectiveness.",
    loading: "Loading Organizational Energy Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Energy philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalFocusLink: "Organizational Focus →",
    organizationalHealthLink: "Organizational Health →",
    organizationalResilienceLink: "Organizational Resilience →",
    changeManagementLink: "Change Management →",
    dashboardTitle: "Energy dashboard",
    capacityTitle: "Capacity indicators",
    patternsTitle: "Energy patterns",
    recoveryTitle: "Recovery opportunities",
    loadTrendsTitle: "Initiative load trends",
    timelineTitle: "Energy timeline",
    snapshotsTitle: "Energy snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive energy view",
    reviewsTitle: "Energy reviews",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    discussPattern: "Mark for discussion",
    scheduleRecovery: "Schedule recovery",
    generateSummary: "Generate executive summary",
    generateReport: "Generate sustainability report",
    exportSnapshot: "Export energy snapshot",
    humansDecide: "Aipify supports awareness and balance — leadership owns pacing and sustainability decisions.",
    privacyNote: "Privacy",
    energyScore: "Energy score",
    domains: {
      leadership: "Leadership energy",
      team: "Team energy",
      organizational: "Organizational energy",
      customer: "Customer energy",
      change: "Change energy",
    },
    healthLabels: {
      thriving: "Thriving",
      healthy: "Healthy",
      balanced: "Balanced",
      strained: "Strained",
      exhausted: "Exhausted",
    },
    patternTypes: {
      sustained_overload: "Sustained overload period",
      healthy_momentum: "Healthy momentum cycle",
      recovery_opportunity: "Recovery opportunity",
      seasonal_intensity: "Seasonal intensity pattern",
      change_fatigue: "Change fatigue indicator",
    },
    timelineTypes: {
      intensity_period: "Intensity period",
      recovery_period: "Recovery period",
      initiative_peak: "Initiative peak",
      strategic_pause: "Strategic pause",
      org_transition: "Organizational transition",
    },
    reviewTypes: {
      monthly: "Monthly energy review",
      quarterly: "Quarterly sustainability assessment",
      annual: "Annual reflection session",
      executive_wellbeing: "Executive wellbeing discussion",
    },
    metrics: {
      recovery: "Recovery opportunities",
      focusAlerts: "Executive focus alerts",
      initiativeLoad: "Initiative load",
      reviewIntensity: "Review intensity",
      changeSaturation: "Change saturation",
      recoveryHeadroom: "Recovery headroom",
      confidence: "Leadership confidence",
    },
    executiveFields: {
      leadership: "Leadership demand",
      pacing: "Strategic pacing",
      recovery: "Recovery opportunities",
      execution: "Sustainable execution",
    },
    settingsLink: "Organizational Energy",
    organizationalEnergyLink: "Organizational Energy",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisasjonsenergisenter", settingsLink: "Organisasjonsenergi" }],
    ["sv", { ...i18nBlock(), title: "Organisationsenergicenter", settingsLink: "Organisationsenergi" }],
    ["da", { ...i18nBlock(), title: "Organisationsenergicenter", settingsLink: "Organisationsenergi" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalEnergyCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalEnergyCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalEnergyLink = block.organizationalEnergyLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_focus.view",', `"org_focus.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalEnergyCenterEngine")) {
    c = c.replace(
      '| "organizationalFocusCenterEngine"',
      '| "organizationalEnergyCenterEngine"\n  | "organizationalFocusCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalFocusCenterEngine", href: "/app/executive/organizational-focus", labelKey: "customerApp.nav.organizationalFocusCenterEngine" },',
      `{ id: "organizationalEnergyCenterEngine", href: "/app/executive/organizational-energy", labelKey: "customerApp.nav.organizationalEnergyCenterEngine" },
  { id: "organizationalFocusCenterEngine", href: "/app/executive/organizational-focus", labelKey: "customerApp.nav.organizationalFocusCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-focus")) return "organizationalFocusCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-energy")) return "organizationalEnergyCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-focus")) return "organizationalFocusCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-energy-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalEnergyLink")) {
    c = c.replace(
      "organizationalFocusLink: string;",
      "organizationalFocusLink: string;\n    organizationalEnergyLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-focus" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalFocusLink}
        </Link>`,
      `<Link href="/app/executive/organizational-focus" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalFocusLink}
        </Link>
        <Link href="/app/executive/organizational-energy" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalEnergyLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalEnergyLink")) {
    p = p.replace(
      'organizationalFocusLink: t("customerApp.executive.organizationalFocusLink"),',
      'organizationalFocusLink: t("customerApp.executive.organizationalFocusLink"),\n        organizationalEnergyLink: t("customerApp.executive.organizationalEnergyLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Energy Center\nRoute: ${P.route}\nCore: Organizations do not run on time alone — they run on human energy.\nHelpers: _oec_* · _oecbp322_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Organizations do not run on time alone — they run on human energy.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase321-vocabulary";',
      `export * from "./implementation-blueprint-phase321-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE321_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase321-aipify-organizational-focus-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE321_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase321-aipify-organizational-focus-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Energy Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_ENERGY_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_ENERGY_CENTER_ENGINE_PHASE${P.phase}.md) — Organizational Energy Center at Executive Center → Organizational Energy. Capacity indicators, energy patterns, recovery support, and executive energy view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_oec_*\`, \`_oecbp322_*\`. APIs at \`/api/organizational-energy/*\`. Cross-links executive centers — does not modify their RPCs.`;
  if (!c.includes("Organizational Energy Center Engine (Phase 322)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_ENERGY_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Energy Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
