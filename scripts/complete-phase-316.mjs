#!/usr/bin/env node
/** ABOS Phase 316 — Aipify Organizational Learning Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 316,
  migration: "20261424400000_aipify_organizational_learning_center_engine_phase316.sql",
  slug: "aipify-organizational-learning-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_LEARNING_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase316-aipify-organizational-learning-center.txt",
  route: "/app/knowledge-center/organizational-learning",
  permKeys: ["org_learning.view", "org_learning.manage", "org_learning.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Learning Center",
    subtitle:
      "Transform everyday experiences into organizational learning — capture, validate, and apply lessons constructively without blame.",
    loading: "Loading Organizational Learning Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Learning philosophy",
    visionTitle: "Vision",
    knowledgeCenterLink: "Knowledge Center →",
    organizationalMemoryLink: "Organizational Memory →",
    learningReviewLink: "Learning Review →",
    knowledgeEngineLink: "Knowledge Center Engine →",
    continuousImprovementLink: "Continuous Improvement →",
    dashboardTitle: "Learning dashboard",
    domainsTitle: "Learning domains",
    lessonsTitle: "Lessons learned",
    patternsTitle: "Recurring patterns",
    bestPracticesTitle: "Best practice library",
    validationTitle: "Validation workflow",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive learning view",
    reviewsTitle: "Learning reviews",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    publishLesson: "Publish lesson",
    completeReview: "Complete review",
    generateSummary: "Generate learning summary",
    generateReport: "Generate lessons report",
    humansDecide: "Aipify supports reflection — humans validate lessons and decide what to apply.",
    privacyNote: "Privacy",
    whatHappened: "What happened?",
    whatWorked: "What worked well?",
    whatDidNotWork: "What did not work?",
    whatShouldChange: "What should change?",
    whatShouldRemain: "What should remain the same?",
    validationStage: "Validation stage",
    domains: {
      support: "Support learning",
      operational: "Operational learning",
      incident: "Incident learning",
      executive: "Executive learning",
      workforce: "Workforce learning",
      customer: "Customer learning",
    },
    patternTypes: {
      recurring_issue: "Recurring issue",
      operational_failure: "Operational failure",
      successful_intervention: "Successful intervention",
      emerging_opportunity: "Emerging opportunity",
    },
    practiceTypes: {
      workflow: "Proven workflow",
      communication: "Communication template",
      operational: "Operational guidance",
      leadership: "Leadership recommendation",
      customer_success: "Customer success example",
    },
    healthLabels: {
      excellent: "Excellent",
      healthy: "Healthy",
      developing: "Developing",
      needs_attention: "Needs attention",
    },
    validationStages: {
      captured: "Insight captured",
      review: "Review conducted",
      confirmed: "Lesson confirmed",
      published: "Knowledge published",
      informed: "Organization informed",
      monitored: "Impact monitored",
    },
    metrics: {
      lessonsCaptured: "Lessons captured",
      lessonsPublished: "Lessons published",
      validation: "Validation completion",
      utilization: "Knowledge utilization",
      adoption: "Improvement adoption",
      participation: "Participation satisfaction",
      trust: "Executive trust",
    },
    executiveFields: {
      strategic: "Strategic lessons",
      maturity: "Maturity trends",
      opportunities: "High-value opportunities",
      momentum: "Improvement momentum",
    },
    settingsLink: "Organizational Learning",
    organizationalLearningLink: "Organizational Learning",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisasjonslæringssenter", settingsLink: "Organisasjonslæring" }],
    ["sv", { ...i18nBlock(), title: "Organisationslärningscenter", settingsLink: "Organisationslärning" }],
    ["da", { ...i18nBlock(), title: "Organisationslæringscenter", settingsLink: "Organisationslæring" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalLearningCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalLearningCenterEngine = block.settingsLink;
    data.knowledge = data.knowledge ?? {};
    data.knowledge.organizationalLearningLink = block.organizationalLearningLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_digital_twin.view",', `"org_digital_twin.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalLearningCenterEngine")) {
    c = c.replace(
      '| "organizationalMemoryCenterEngine"',
      '| "organizationalLearningCenterEngine"\n  | "organizationalMemoryCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalMemoryCenterEngine", href: "/app/knowledge-center/organizational-memory", labelKey: "customerApp.nav.organizationalMemoryCenterEngine" },',
      `{ id: "organizationalLearningCenterEngine", href: "/app/knowledge-center/organizational-learning", labelKey: "customerApp.nav.organizationalLearningCenterEngine" },
  { id: "organizationalMemoryCenterEngine", href: "/app/knowledge-center/organizational-memory", labelKey: "customerApp.nav.organizationalMemoryCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/knowledge-center/organizational-memory")) return "organizationalMemoryCenterEngine";',
      'if (pathname.startsWith("/app/knowledge-center/organizational-learning")) return "organizationalLearningCenterEngine";\n  if (pathname.startsWith("/app/knowledge-center/organizational-memory")) return "organizationalMemoryCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-learning-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchKnowledgePanel() {
  const panel = path.join(ROOT, "components/app/knowledge/KnowledgeCenterPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalLearning")) {
    c = c.replace(
      "links: { gaps: string; settings: string; organizationalMemory?: string };",
      "links: { gaps: string; settings: string; organizationalMemory?: string; organizationalLearning?: string };",
    );
    c = c.replace(
      `<Link href="/app/knowledge-center/organizational-memory" className="rounded-lg border px-3 py-1.5 text-sm">{labels.links.organizationalMemory ?? "Organizational Memory"}</Link>`,
      `<Link href="/app/knowledge-center/organizational-learning" className="rounded-lg border px-3 py-1.5 text-sm">{labels.links.organizationalLearning ?? "Organizational Learning"}</Link>
          <Link href="/app/knowledge-center/organizational-memory" className="rounded-lg border px-3 py-1.5 text-sm">{labels.links.organizationalMemory ?? "Organizational Memory"}</Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched knowledge panel");
  }

  const page = path.join(ROOT, "app/app/knowledge-center/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalLearningLink")) {
    p = p.replace(
      'organizationalMemory: t("customerApp.knowledge.organizationalMemoryLink"),',
      'organizationalMemory: t("customerApp.knowledge.organizationalMemoryLink"),\n          organizationalLearning: t("customerApp.knowledge.organizationalLearningLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched knowledge page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Learning Center\nRoute: ${P.route}\nCore: Experience has little value if nothing is learned from it.\nHelpers: _olc_* · _olcbp316_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Experience has little value if nothing is learned from it. Organizations should improve through reflection.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase315-vocabulary";',
      `export * from "./implementation-blueprint-phase315-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE315_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase315-aipify-organizational-digital-twin-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE315_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase315-aipify-organizational-digital-twin-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Learning Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_LEARNING_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_LEARNING_CENTER_ENGINE_PHASE${P.phase}.md) — Organizational Learning Center at Knowledge Center → Organizational Learning. Lessons learned, validation workflow, pattern detection, best practices, and executive learning view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_olc_*\`, \`_olcbp316_*\`. APIs at \`/api/organizational-learning/*\`. Cross-links Knowledge Center, OMC, Learning Review — does not modify their RPCs.`;
  if (!c.includes("Organizational Learning Center Engine (Phase 316)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_LEARNING_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Learning Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
