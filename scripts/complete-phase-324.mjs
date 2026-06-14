#!/usr/bin/env node
/** ABOS Phase 324 — Aipify Organizational Wisdom Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 324,
  migration: "20261425200000_aipify_organizational_wisdom_center_engine_phase324.sql",
  slug: "aipify-organizational-wisdom-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_WISDOM_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase324-aipify-organizational-wisdom-center.txt",
  route: "/app/executive/organizational-wisdom",
  permKeys: ["org_wisdom.view", "org_wisdom.manage", "org_wisdom.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Wisdom Center",
    subtitle:
      "Transform accumulated experience, knowledge, learning, decisions, and values into practical wisdom that supports better leadership and long-term sustainability.",
    loading: "Loading Wisdom Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Wisdom philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalMemoryLink: "Organizational Memory →",
    organizationalLearningLink: "Organizational Learning →",
    knowledgeEvolutionLink: "Knowledge Evolution →",
    strategicIntelligenceLink: "Strategic Intelligence →",
    decisionSupportLink: "Decision Support →",
    purposeValuesLink: "Purpose & Values →",
    dashboardTitle: "Wisdom dashboard",
    lessonsTitle: "Lessons integrated",
    reflectionsTitle: "Reflection engine",
    valuesTitle: "Values alignment",
    patternsTitle: "Historical patterns",
    synthesisTitle: "Wisdom synthesis sources",
    timelineTitle: "Wisdom timeline",
    snapshotsTitle: "Wisdom snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive wisdom view",
    reviewsTitle: "Wisdom reviews",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    scheduleReview: "Schedule wisdom review",
    generateReflection: "Generate reflection report",
    generateSummary: "Generate executive summary",
    exportInsights: "Export historical insights",
    humansDecide: "Aipify supports perspective and reflection — leadership owns judgment and decisions.",
    privacyNote: "Privacy",
    wisdomScore: "Wisdom score",
    domains: {
      strategic: "Strategic wisdom",
      operational: "Operational wisdom",
      leadership: "Leadership wisdom",
      customer: "Customer wisdom",
      organizational: "Organizational wisdom",
    },
    healthLabels: {
      exceptional: "Exceptional",
      strong: "Strong",
      maturing: "Maturing",
      developing: "Developing",
      emerging: "Emerging",
    },
    timelineTypes: {
      major_lesson: "Major lesson learned",
      significant_decision: "Significant decision",
      cultural_milestone: "Cultural milestone",
      strategic_turning_point: "Strategic turning point",
      leadership_reflection: "Leadership reflection",
    },
    reviewTypes: {
      monthly: "Monthly leadership reflection",
      quarterly: "Quarterly wisdom session",
      annual: "Annual organizational reflection",
      executive_learning: "Executive learning discussion",
    },
    metrics: {
      insights: "Wisdom insights",
      lessons: "Lessons integrated",
      reflection: "Reflection participation",
      patterns: "Historical patterns",
      learning: "Executive learning trend",
      quality: "Decision quality satisfaction",
      confidence: "Leadership confidence",
    },
    executiveFields: {
      themes: "Emerging themes",
      learning: "Leadership learning patterns",
      lessons: "Historical lessons revisited",
      indicators: "Wisdom indicators",
    },
    settingsLink: "Organizational Wisdom",
    organizationalWisdomLink: "Organizational Wisdom",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Visdomssenter", settingsLink: "Organisasjonsvisdom" }],
    ["sv", { ...i18nBlock(), title: "Visdomscenter", settingsLink: "Organisationsvisdom" }],
    ["da", { ...i18nBlock(), title: "Visdomscenter", settingsLink: "Organisationsvisdom" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalWisdomCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalWisdomCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalWisdomLink = block.organizationalWisdomLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_adaptability.view",', `"org_adaptability.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalWisdomCenterEngine")) {
    c = c.replace(
      '| "organizationalAdaptabilityCenterEngine"',
      '| "organizationalWisdomCenterEngine"\n  | "organizationalAdaptabilityCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalAdaptabilityCenterEngine", href: "/app/executive/organizational-adaptability", labelKey: "customerApp.nav.organizationalAdaptabilityCenterEngine" },',
      `{ id: "organizationalWisdomCenterEngine", href: "/app/executive/organizational-wisdom", labelKey: "customerApp.nav.organizationalWisdomCenterEngine" },
  { id: "organizationalAdaptabilityCenterEngine", href: "/app/executive/organizational-adaptability", labelKey: "customerApp.nav.organizationalAdaptabilityCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-adaptability")) return "organizationalAdaptabilityCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-wisdom")) return "organizationalWisdomCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-adaptability")) return "organizationalAdaptabilityCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-wisdom-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalWisdomLink")) {
    c = c.replace(
      "organizationalAdaptabilityLink: string;",
      "organizationalAdaptabilityLink: string;\n    organizationalWisdomLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-adaptability" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalAdaptabilityLink}
        </Link>`,
      `<Link href="/app/executive/organizational-adaptability" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalAdaptabilityLink}
        </Link>
        <Link href="/app/executive/organizational-wisdom" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalWisdomLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalWisdomLink")) {
    p = p.replace(
      'organizationalAdaptabilityLink: t("customerApp.executive.organizationalAdaptabilityLink"),',
      'organizationalAdaptabilityLink: t("customerApp.executive.organizationalAdaptabilityLink"),\n        organizationalWisdomLink: t("customerApp.executive.organizationalWisdomLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Wisdom Center\nRoute: ${P.route}\nCore: Knowledge explains what happened. Wisdom helps determine what should be considered next.\nHelpers: _owc_* · _owcbp324_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Knowledge explains what happened. Wisdom helps determine what should be considered next.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase323-vocabulary";',
      `export * from "./implementation-blueprint-phase323-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE323_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase323-aipify-organizational-adaptability-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE323_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase323-aipify-organizational-adaptability-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Wisdom Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_WISDOM_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_WISDOM_CENTER_ENGINE_PHASE${P.phase}.md) — Wisdom Center at Executive Center → Organizational Wisdom. Reflection engine, values alignment, wisdom synthesis, and executive wisdom view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_owc_*\`, \`_owcbp324_*\`. APIs at \`/api/organizational-wisdom/*\`. Cross-links executive and knowledge centers — does not modify their RPCs.`;
  if (!c.includes("Organizational Wisdom Center Engine (Phase 324)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_WISDOM_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Wisdom Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
