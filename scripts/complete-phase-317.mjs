#!/usr/bin/env node
/** ABOS Phase 317 — Aipify Knowledge Evolution Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 317,
  migration: "20261424500000_aipify_knowledge_evolution_center_engine_phase317.sql",
  slug: "aipify-knowledge-evolution-center-engine",
  docSlug: "AIPIFY_KNOWLEDGE_EVOLUTION_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase317-aipify-knowledge-evolution-center.txt",
  route: "/app/knowledge-center/knowledge-evolution",
  permKeys: ["knowledge_evolution.view", "knowledge_evolution.manage", "knowledge_evolution.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Knowledge Evolution Center",
    subtitle:
      "Continuously improve, refine, and evolve organizational knowledge — accurate, relevant, discoverable, and useful over time.",
    loading: "Loading Knowledge Evolution Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Evolution philosophy",
    visionTitle: "Vision",
    knowledgeCenterLink: "Knowledge Center →",
    organizationalLearningLink: "Organizational Learning →",
    organizationalMemoryLink: "Organizational Memory →",
    knowledgeEngineLink: "Knowledge Center Engine →",
    employeeKnowledgeLink: "Employee Knowledge →",
    dashboardTitle: "Knowledge dashboard",
    domainsTitle: "Knowledge domains",
    assetsTitle: "Knowledge assets",
    reviewQueueTitle: "Review queue",
    versionHistoryTitle: "Version history",
    smeTitle: "SME validation",
    lifecycleTitle: "Knowledge lifecycle",
    searchTitle: "Search optimization",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive knowledge view",
    reviewsTitle: "Governance reviews",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    scheduleReview: "Schedule review",
    completeReview: "Complete review",
    markImproved: "Mark improved",
    generateReport: "Generate knowledge report",
    exportSnapshot: "Export health snapshot",
    humansDecide: "Aipify identifies evolution opportunities — SMEs and leaders approve all knowledge changes.",
    privacyNote: "Privacy",
    usage: "Usage",
    daysSinceReview: "Days since review",
    domains: {
      support: "Support knowledge",
      operational: "Operational knowledge",
      technical: "Technical knowledge",
      executive: "Executive knowledge",
      learning: "Learning knowledge",
    },
    healthLabels: {
      excellent: "Excellent",
      healthy: "Healthy",
      needs_review: "Needs review",
      critical: "Critical",
    },
    lifecycleStages: {
      created: "Knowledge created",
      validated: "Knowledge validated",
      published: "Knowledge published",
      utilized: "Knowledge utilized",
      reviewed: "Knowledge reviewed",
      improved: "Knowledge improved",
      archived: "Knowledge archived",
    },
    reviewTypes: {
      aging: "Aging article",
      low_confidence: "Low confidence",
      frequently_questioned: "Frequently questioned",
      contradictory: "Contradictory information",
      underutilized: "Underutilized resource",
    },
    validationTypes: {
      subject_matter: "Subject matter expert",
      technical: "Technical approval",
      leadership: "Leadership validation",
      cross_functional: "Cross-functional contribution",
    },
    metrics: {
      totalAssets: "Total knowledge assets",
      requiringReview: "Requiring review",
      outdated: "Outdated indicators",
      recentlyImproved: "Recently improved",
      reviewCompletion: "Review completion",
      searchEffectiveness: "Search effectiveness",
      utilization: "Utilization rate",
      trust: "Executive trust",
    },
    executiveFields: {
      maturity: "Knowledge maturity",
      risks: "Risk indicators",
      validation: "Validation participation",
      momentum: "Improvement momentum",
    },
    settingsLink: "Knowledge Evolution",
    knowledgeEvolutionLink: "Knowledge Evolution",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Kunnskapsevolusjonssenter", settingsLink: "Kunnskapsevolusjon" }],
    ["sv", { ...i18nBlock(), title: "Kunskapsevolutionscenter", settingsLink: "Kunskapsevolution" }],
    ["da", { ...i18nBlock(), title: "Vidensudviklingscenter", settingsLink: "Vidensudvikling" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.knowledgeEvolutionCenter = block;
    data.nav = data.nav ?? {};
    data.nav.knowledgeEvolutionCenterEngine = block.settingsLink;
    data.knowledge = data.knowledge ?? {};
    data.knowledge.knowledgeEvolutionLink = block.knowledgeEvolutionLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_learning.view",', `"org_learning.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("knowledgeEvolutionCenterEngine")) {
    c = c.replace(
      '| "organizationalLearningCenterEngine"',
      '| "knowledgeEvolutionCenterEngine"\n  | "organizationalLearningCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalLearningCenterEngine", href: "/app/knowledge-center/organizational-learning", labelKey: "customerApp.nav.organizationalLearningCenterEngine" },',
      `{ id: "knowledgeEvolutionCenterEngine", href: "/app/knowledge-center/knowledge-evolution", labelKey: "customerApp.nav.knowledgeEvolutionCenterEngine" },
  { id: "organizationalLearningCenterEngine", href: "/app/knowledge-center/organizational-learning", labelKey: "customerApp.nav.organizationalLearningCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/knowledge-center/organizational-learning")) return "organizationalLearningCenterEngine";',
      'if (pathname.startsWith("/app/knowledge-center/knowledge-evolution")) return "knowledgeEvolutionCenterEngine";\n  if (pathname.startsWith("/app/knowledge-center/organizational-learning")) return "organizationalLearningCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-knowledge-evolution-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchKnowledgePanel() {
  const panel = path.join(ROOT, "components/app/knowledge/KnowledgeCenterPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("knowledgeEvolution")) {
    c = c.replace(
      "links: { gaps: string; settings: string; organizationalMemory?: string; organizationalLearning?: string };",
      "links: { gaps: string; settings: string; organizationalMemory?: string; organizationalLearning?: string; knowledgeEvolution?: string };",
    );
    c = c.replace(
      `<Link href="/app/knowledge-center/organizational-learning" className="rounded-lg border px-3 py-1.5 text-sm">{labels.links.organizationalLearning ?? "Organizational Learning"}</Link>`,
      `<Link href="/app/knowledge-center/knowledge-evolution" className="rounded-lg border px-3 py-1.5 text-sm">{labels.links.knowledgeEvolution ?? "Knowledge Evolution"}</Link>
          <Link href="/app/knowledge-center/organizational-learning" className="rounded-lg border px-3 py-1.5 text-sm">{labels.links.organizationalLearning ?? "Organizational Learning"}</Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched knowledge panel");
  }

  const page = path.join(ROOT, "app/app/knowledge-center/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("knowledgeEvolutionLink")) {
    p = p.replace(
      'organizationalLearning: t("customerApp.knowledge.organizationalLearningLink"),',
      'organizationalLearning: t("customerApp.knowledge.organizationalLearningLink"),\n          knowledgeEvolution: t("customerApp.knowledge.knowledgeEvolutionLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched knowledge page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Knowledge Evolution Center\nRoute: ${P.route}\nCore: Knowledge loses value when it becomes outdated.\nHelpers: _kec_* · _kecbp317_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Knowledge loses value when it becomes outdated. Organizations should treat knowledge as a living asset.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase316-vocabulary";',
      `export * from "./implementation-blueprint-phase316-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE316_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase316-aipify-organizational-learning-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE316_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase316-aipify-organizational-learning-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Knowledge Evolution Center Engine (Phase ${P.phase}):** See [AIPIFY_KNOWLEDGE_EVOLUTION_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_KNOWLEDGE_EVOLUTION_CENTER_ENGINE_PHASE${P.phase}.md) — Knowledge Evolution Center at Knowledge Center → Knowledge Evolution. Knowledge health, review queue, lifecycle, SME validation, version history, and search optimization. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_kec_*\`, \`_kecbp317_*\`. APIs at \`/api/knowledge-evolution/*\`. Cross-links Knowledge Center, OLC, OMC — does not modify their RPCs.`;
  if (!c.includes("Knowledge Evolution Center Engine (Phase 317)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_KNOWLEDGE_EVOLUTION_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Knowledge Evolution Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
patchKnowledgePanel();
patchIlm();
patchArchitecture();
console.log(`Phase ${P.phase} complete`);
