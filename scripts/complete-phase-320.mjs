#!/usr/bin/env node
/** ABOS Phase 320 — Aipify Organizational Alignment Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 320,
  migration: "20261424800000_aipify_organizational_alignment_center_engine_phase320.sql",
  slug: "aipify-organizational-alignment-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_ALIGNMENT_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase320-aipify-organizational-alignment-center.txt",
  route: "/app/executive/organizational-alignment",
  permKeys: ["org_alignment.view", "org_alignment.manage", "org_alignment.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Alignment Center",
    subtitle:
      "Strengthen alignment between vision, strategy, departments, teams, and day-to-day activities so everyone moves in the same direction.",
    loading: "Loading Alignment Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Alignment philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    executionExcellenceLink: "Execution Excellence →",
    capabilityMaturityLink: "Capability Maturity →",
    changeManagementLink: "Change Management →",
    organizationalHealthLink: "Organizational Health →",
    purposeValuesLink: "Purpose & Values →",
    dashboardTitle: "Alignment dashboard",
    indicatorsTitle: "Strategic alignment indicators",
    prioritiesTitle: "Organizational priorities",
    misalignmentsTitle: "Alignment opportunities",
    timelineTitle: "Alignment timeline",
    snapshotsTitle: "Department snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive alignment view",
    reviewsTitle: "Alignment reviews",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    discussMisalignment: "Mark for discussion",
    scheduleWorkshop: "Schedule workshop",
    generateSummary: "Generate alignment summary",
    generateReport: "Generate executive report",
    exportSnapshot: "Export department snapshot",
    humansDecide: "Aipify supports clarity and collaboration — leadership owns direction and decisions.",
    privacyNote: "Privacy",
    owner: "Owner",
    alignmentScore: "Alignment score",
    domains: {
      vision: "Vision alignment",
      strategic: "Strategic alignment",
      team: "Team alignment",
      customer: "Customer alignment",
      governance: "Governance alignment",
    },
    healthLabels: {
      exceptional: "Exceptional",
      strong: "Strong",
      stable: "Stable",
      needs_attention: "Needs attention",
      misaligned: "Misaligned",
    },
    misalignmentTypes: {
      conflicting_priorities: "Conflicting priorities",
      duplicate_initiatives: "Duplicate initiatives",
      resource_competition: "Resource competition",
      strategic_disconnect: "Strategic disconnect",
      communication_inconsistency: "Communication inconsistency",
    },
    timelineTypes: {
      alignment_improvement: "Alignment improvement",
      strategic_shift: "Strategic shift",
      org_change: "Organizational change",
      collaboration_milestone: "Collaboration milestone",
      executive_intervention: "Executive intervention",
    },
    reviewTypes: {
      monthly: "Monthly alignment review",
      quarterly: "Quarterly strategic review",
      annual: "Annual organizational review",
      executive_reflection: "Executive reflection session",
    },
    metrics: {
      strongAlignment: "Strong alignment areas",
      opportunities: "Alignment opportunities",
      misalignments: "Open misalignments",
      crossFunctional: "Cross-functional trend",
      goalConsistency: "Goal consistency",
      initiativeOverlap: "Initiative overlap",
      confidence: "Leadership confidence",
    },
    executiveFields: {
      vision: "Vision clarity",
      strategic: "Strategic consistency",
      collaboration: "Collaboration trends",
      focus: "Executive focus areas",
    },
    settingsLink: "Organizational Alignment",
    organizationalAlignmentLink: "Organizational Alignment",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Alignmentssenter", settingsLink: "Organisasjonsalignment" }],
    ["sv", { ...i18nBlock(), title: "Alignmentcenter", settingsLink: "Organisationsalignment" }],
    ["da", { ...i18nBlock(), title: "Alignmentcenter", settingsLink: "Organisationsalignment" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalAlignmentCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalAlignmentCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalAlignmentLink = block.organizationalAlignmentLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"execution_excellence.view",', `"execution_excellence.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalAlignmentCenterEngine")) {
    c = c.replace(
      '| "executionExcellenceCenterEngine"',
      '| "organizationalAlignmentCenterEngine"\n  | "executionExcellenceCenterEngine"',
    );
    c = c.replace(
      '{ id: "executionExcellenceCenterEngine", href: "/app/executive/execution-excellence", labelKey: "customerApp.nav.executionExcellenceCenterEngine" },',
      `{ id: "organizationalAlignmentCenterEngine", href: "/app/executive/organizational-alignment", labelKey: "customerApp.nav.organizationalAlignmentCenterEngine" },
  { id: "executionExcellenceCenterEngine", href: "/app/executive/execution-excellence", labelKey: "customerApp.nav.executionExcellenceCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/execution-excellence")) return "executionExcellenceCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-alignment")) return "organizationalAlignmentCenterEngine";\n  if (pathname.startsWith("/app/executive/execution-excellence")) return "executionExcellenceCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-alignment-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalAlignmentLink")) {
    c = c.replace(
      "executionExcellenceLink: string;",
      "executionExcellenceLink: string;\n    organizationalAlignmentLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/execution-excellence" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.executionExcellenceLink}
        </Link>`,
      `<Link href="/app/executive/execution-excellence" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.executionExcellenceLink}
        </Link>
        <Link href="/app/executive/organizational-alignment" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalAlignmentLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalAlignmentLink")) {
    p = p.replace(
      'executionExcellenceLink: t("customerApp.executive.executionExcellenceLink"),',
      'executionExcellenceLink: t("customerApp.executive.executionExcellenceLink"),\n        organizationalAlignmentLink: t("customerApp.executive.organizationalAlignmentLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Alignment Center\nRoute: ${P.route}\nCore: Organizations struggle when people work hard toward different objectives.\nHelpers: _oac_* · _oacbp320_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Organizations struggle when people work hard toward different objectives. Aipify should help create clarity and shared direction.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase319-vocabulary";',
      `export * from "./implementation-blueprint-phase319-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE319_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase319-aipify-execution-excellence-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE319_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase319-aipify-execution-excellence-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Alignment Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_ALIGNMENT_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_ALIGNMENT_CENTER_ENGINE_PHASE${P.phase}.md) — Alignment Center at Executive Center → Organizational Alignment. Vision, strategic, team, customer, and governance alignment with misalignment detection and executive alignment view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_oac_*\`, \`_oacbp320_*\`. APIs at \`/api/organizational-alignment/*\`. Cross-links executive centers — does not modify their RPCs.`;
  if (!c.includes("Organizational Alignment Center Engine (Phase 320)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_ALIGNMENT_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Alignment Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
