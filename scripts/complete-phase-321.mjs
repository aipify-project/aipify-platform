#!/usr/bin/env node
/** ABOS Phase 321 — Aipify Organizational Focus Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 321,
  migration: "20261424900000_aipify_organizational_focus_center_engine_phase321.sql",
  slug: "aipify-organizational-focus-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_FOCUS_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase321-aipify-organizational-focus-center.txt",
  route: "/app/executive/organizational-focus",
  permKeys: ["org_focus.view", "org_focus.manage", "org_focus.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Focus Center",
    subtitle:
      "Protect attention, prioritize effectively, reduce initiative overload, and maintain focus on activities that generate the greatest long-term value.",
    loading: "Loading Focus Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Focus philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalAlignmentLink: "Organizational Alignment →",
    executionExcellenceLink: "Execution Excellence →",
    organizationalHealthLink: "Organizational Health →",
    attentionGuardianLink: "Attention Guardian →",
    dashboardTitle: "Focus dashboard",
    initiativesTitle: "Active strategic initiatives",
    priorityDistributionTitle: "Priority distribution",
    overloadsTitle: "Focus risks identified",
    prioritizationTitle: "Prioritization support",
    timelineTitle: "Focus timeline",
    snapshotsTitle: "Initiative snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive focus view",
    reviewsTitle: "Focus reviews",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    discussOverload: "Mark for discussion",
    scheduleWorkshop: "Schedule prioritization workshop",
    generateSummary: "Generate focus summary",
    generateReport: "Generate executive report",
    exportSnapshot: "Export initiative snapshot",
    humansDecide: "Aipify supports clarity and prioritization — leadership owns decisions and focus.",
    privacyNote: "Privacy",
    owner: "Owner",
    focusScore: "Focus score",
    domains: {
      strategic: "Strategic focus",
      operational: "Operational focus",
      team: "Team focus",
      customer: "Customer focus",
      leadership: "Leadership focus",
    },
    healthLabels: {
      exceptional: "Exceptional",
      strong: "Strong",
      stable: "Stable",
      attention_required: "Attention required",
      fragmented: "Fragmented",
    },
    overloadTypes: {
      excessive_initiatives: "Excessive concurrent initiatives",
      competing_priorities: "Competing priorities",
      resource_fragmentation: "Resource fragmentation",
      meeting_overload: "Meeting overload",
      review_fatigue: "Review fatigue",
    },
    timelineTypes: {
      priority_shift: "Priority shift",
      initiative_added: "Initiative added",
      initiative_completed: "Initiative completed",
      focus_improvement: "Focus improvement",
      executive_intervention: "Executive intervention",
    },
    reviewTypes: {
      weekly: "Weekly leadership review",
      monthly: "Monthly focus assessment",
      quarterly: "Quarterly strategic review",
      annual: "Annual reflection session",
    },
    metrics: {
      activeInitiatives: "Active initiatives",
      strongFocus: "Strong focus areas",
      focusRisks: "Focus risks",
      concentration: "Initiative concentration",
      priorityClarity: "Priority clarity",
      reviewDiscipline: "Review discipline",
      confidence: "Leadership confidence",
    },
    executiveFields: {
      attention: "Leadership attention trends",
      concentration: "Strategic concentration",
      overload: "Initiative overload risks",
      alignment: "Priority alignment",
    },
    settingsLink: "Organizational Focus",
    organizationalFocusLink: "Organizational Focus",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Fokussenter", settingsLink: "Organisasjonsfokus" }],
    ["sv", { ...i18nBlock(), title: "Fokuscenter", settingsLink: "Organisationsfokus" }],
    ["da", { ...i18nBlock(), title: "Fokuscenter", settingsLink: "Organisationsfokus" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalFocusCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalFocusCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalFocusLink = block.organizationalFocusLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_alignment.view",', `"org_alignment.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalFocusCenterEngine")) {
    c = c.replace(
      '| "organizationalAlignmentCenterEngine"',
      '| "organizationalFocusCenterEngine"\n  | "organizationalAlignmentCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalAlignmentCenterEngine", href: "/app/executive/organizational-alignment", labelKey: "customerApp.nav.organizationalAlignmentCenterEngine" },',
      `{ id: "organizationalFocusCenterEngine", href: "/app/executive/organizational-focus", labelKey: "customerApp.nav.organizationalFocusCenterEngine" },
  { id: "organizationalAlignmentCenterEngine", href: "/app/executive/organizational-alignment", labelKey: "customerApp.nav.organizationalAlignmentCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-alignment")) return "organizationalAlignmentCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-focus")) return "organizationalFocusCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-alignment")) return "organizationalAlignmentCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-focus-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalFocusLink")) {
    c = c.replace(
      "organizationalAlignmentLink: string;",
      "organizationalAlignmentLink: string;\n    organizationalFocusLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-alignment" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalAlignmentLink}
        </Link>`,
      `<Link href="/app/executive/organizational-alignment" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalAlignmentLink}
        </Link>
        <Link href="/app/executive/organizational-focus" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalFocusLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalFocusLink")) {
    p = p.replace(
      'organizationalAlignmentLink: t("customerApp.executive.organizationalAlignmentLink"),',
      'organizationalAlignmentLink: t("customerApp.executive.organizationalAlignmentLink"),\n        organizationalFocusLink: t("customerApp.executive.organizationalFocusLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Focus Center\nRoute: ${P.route}\nCore: Organizations struggle because they pursue too many initiatives at the same time.\nHelpers: _ofc_* · _ofcbp321_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Organizations struggle because they pursue too many initiatives at the same time. Aipify should help organizations focus on what matters most.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase320-vocabulary";',
      `export * from "./implementation-blueprint-phase320-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE320_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase320-aipify-organizational-alignment-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE320_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase320-aipify-organizational-alignment-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Focus Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_FOCUS_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_FOCUS_CENTER_ENGINE_PHASE${P.phase}.md) — Focus Center at Executive Center → Organizational Focus. Initiative concentration, focus overload detection, prioritization support, and executive focus view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_ofc_*\`, \`_ofcbp321_*\`. APIs at \`/api/organizational-focus/*\`. Cross-links executive centers — does not modify their RPCs.`;
  if (!c.includes("Organizational Focus Center Engine (Phase 321)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_FOCUS_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Focus Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
