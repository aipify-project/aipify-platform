#!/usr/bin/env node
/** ABOS Phase 304 — Aipify Organizational Memory Center (user Phase 303) */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 304,
  migration: "20261423200000_aipify_organizational_memory_center_engine_phase304.sql",
  slug: "aipify-organizational-memory-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_MEMORY_CENTER",
  ilmFile: "implementation-blueprint-phase304-aipify-organizational-memory-center.txt",
  route: "/app/knowledge-center/organizational-memory",
  permKeys: ["org_memory_center.view", "org_memory_center.manage", "org_memory_center.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Memory Center",
    subtitle:
      "Capture, preserve, and continuously improve institutional knowledge — expertise becomes an organizational asset, not a departure risk.",
    loading: "Loading Organizational Memory Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Memory philosophy",
    visionTitle: "Vision",
    knowledgeCenterLink: "Knowledge Center →",
    orgMemoryEngineLink: "Organizational Memory Engine →",
    enterpriseMemoryLink: "Enterprise memory →",
    employeeKnowledgeLink: "Employee knowledge →",
    dashboardTitle: "Memory dashboard",
    recentKnowledgeTitle: "Recently added knowledge",
    knowledgeItemsTitle: "Organizational knowledge",
    gapsTitle: "Knowledge gaps detected",
    retentionRisksTitle: "Knowledge retention risks",
    insightsTitle: "Aipify insights",
    contributionsTitle: "Memory contributions",
    validationTitle: "Validation workflow",
    emptySection: "No items in this section yet.",
    category: "Category",
    health: "Health",
    validation: "Validation",
    usage: "Usage",
    owner: "Owner",
    dismiss: "Dismiss",
    approve: "Approve",
    markReviewed: "Mark reviewed",
    submitContribution: "Submit contribution",
    contributionTitle: "Contribution title",
    contributionContent: "Describe the knowledge, lesson, or process improvement",
    humansDecide: "People create knowledge — Aipify helps preserve it. Expertise is never replaced; it is shared.",
    privacyNote: "Privacy",
    organizationalMemoryLink: "Organizational Memory",
    categories: {
      operational: "Operational memory",
      customer: "Customer memory",
      executive: "Executive memory",
      technical: "Technical memory",
      cultural: "Cultural memory",
    },
    healthLevels: {
      excellent: "Excellent",
      healthy: "Healthy",
      needs_attention: "Needs attention",
      critical: "Critical",
    },
    validationStatuses: {
      draft: "Draft",
      review: "Review",
      approved: "Approved",
      published: "Published",
      periodic_review: "Periodic review",
    },
    metrics: {
      healthScore: "Knowledge health score",
      healthLabel: "Health level",
      recentAdded: "Recently added",
      gapsOpen: "Open gaps",
      usageTotal: "Total usage",
      criticalRisks: "Critical knowledge risks",
      retentionRisks: "Retention risks",
      reuseRate: "Knowledge reuse rate",
    },
    settingsLink: "Organizational Memory",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisasjonsminnesenter", settingsLink: "Organisasjonsminne" }],
    ["sv", { ...i18nBlock(), title: "Organisationsminnescenter", settingsLink: "Organisationsminne" }],
    ["da", { ...i18nBlock(), title: "Organisationsmindecenter", settingsLink: "Organisationsminde" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalMemoryCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalMemoryCenterEngine = block.settingsLink;
    data.knowledge = data.knowledge ?? {};
    data.knowledge.organizationalMemoryLink = block.organizationalMemoryLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"strategic_intelligence.view",', `"strategic_intelligence.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalMemoryCenterEngine")) {
    c = c.replace('| "knowledgeCenter"', '| "organizationalMemoryCenterEngine"\n  | "knowledgeCenter"');
    c = c.replace(
      '{ id: "knowledgeCenter", href: "/app/knowledge-center", labelKey: "customerApp.nav.knowledgeCenter" },',
      `{ id: "organizationalMemoryCenterEngine", href: "/app/knowledge-center/organizational-memory", labelKey: "customerApp.nav.organizationalMemoryCenterEngine" },
  { id: "knowledgeCenter", href: "/app/knowledge-center", labelKey: "customerApp.nav.knowledgeCenter" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/knowledge-center")) {\n    return "knowledgeCenter";\n  }',
      'if (pathname.startsWith("/app/knowledge-center/organizational-memory")) return "organizationalMemoryCenterEngine";\n  if (pathname.startsWith("/app/knowledge-center")) {\n    return "knowledgeCenter";\n  }',
    );
    fs.writeFileSync(file, c);
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-memory-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchKnowledgePanel() {
  const panel = path.join(ROOT, "components/app/knowledge/KnowledgeCenterPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalMemoryLink")) {
    c = c.replace(
      "links: { gaps: string; settings: string };",
      "links: { gaps: string; settings: string; organizationalMemory?: string };",
    );
    c = c.replace(
      '<Link href="/app/settings/knowledge" className="rounded-lg border px-3 py-1.5 text-sm">{labels.links.settings}</Link>',
      `<Link href="/app/knowledge-center/organizational-memory" className="rounded-lg border px-3 py-1.5 text-sm">{labels.links.organizationalMemory ?? "Organizational Memory"}</Link>
          <Link href="/app/settings/knowledge" className="rounded-lg border px-3 py-1.5 text-sm">{labels.links.settings}</Link>`,
    );
    fs.writeFileSync(panel, c);
  }

  const page = path.join(ROOT, "app/app/knowledge-center/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalMemoryLink")) {
    p = p.replace(
      'settings: t("customerApp.knowledge.links.settings"),',
      'settings: t("customerApp.knowledge.links.settings"),\n          organizationalMemory: t("customerApp.knowledge.organizationalMemoryLink"),',
    );
    fs.writeFileSync(page, p);
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Memory Center\nRoute: ${P.route}\nCore: Organizations should not lose critical knowledge when employees leave.\nHelpers: _omc_* · _omcbp304_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Organizations should not lose critical knowledge when employees leave.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase303-vocabulary";',
      `export * from "./implementation-blueprint-phase303-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE303_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase303-aipify-executive-strategic-intelligence.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE303_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase303-aipify-executive-strategic-intelligence.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Memory Center (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_MEMORY_CENTER_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_MEMORY_CENTER_PHASE${P.phase}.md) — Organizational Memory Center at Knowledge Center → Organizational Memory. Knowledge health, gaps, retention risks, contributions, validation workflow, and institutional insights. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_omc_*\`, \`_omcbp304_*\`. APIs at \`/api/organizational-memory/*\`. Cross-links Knowledge Center, OME, enterprise memory, and employee knowledge — does not modify their RPCs.`;
  if (!c.includes("Organizational Memory Center")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_MEMORY_CENTER_PHASE${P.phase}.md`),
  `# Aipify Organizational Memory Center — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
