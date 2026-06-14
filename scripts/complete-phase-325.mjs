#!/usr/bin/env node
/** ABOS Phase 325 — Aipify Organizational Legacy Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 325,
  migration: "20261425300000_aipify_organizational_legacy_center_engine_phase325.sql",
  slug: "aipify-organizational-legacy-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_LEGACY_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase325-aipify-organizational-legacy-center.txt",
  route: "/app/executive/organizational-legacy",
  permKeys: ["org_legacy.view", "org_legacy.manage", "org_legacy.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Legacy",
    subtitle:
      "Preserve values, culture, principles, stories, milestones, and long-term contributions so future generations understand not only what the organization achieved, but who it chose to become.",
    loading: "Loading Legacy Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Legacy philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalWisdomLink: "Organizational Wisdom →",
    organizationalMemoryLink: "Organizational Memory →",
    organizationalLearningLink: "Organizational Learning →",
    purposeValuesLink: "Purpose & Values →",
    dashboardTitle: "Legacy dashboard",
    projectsTitle: "Legacy projects in progress",
    milestonesTitle: "Milestones documented",
    valuesTitle: "Values preserved",
    archiveTitle: "Legacy archive",
    reflectionsTitle: "Reflection engine",
    timelineTitle: "Legacy timeline",
    snapshotsTitle: "Legacy snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive legacy view",
    sessionsTitle: "Legacy sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeSession: "Complete session",
    scheduleSession: "Schedule reflection session",
    generateReport: "Generate legacy report",
    printTimeline: "Print organizational timeline",
    exportReflection: "Export reflection summary",
    archiveRecord: "Archive historical record",
    createCollection: "Create milestone collection",
    humansDecide: "Aipify supports preservation and reflection — leadership owns storytelling, values, and historical judgment.",
    privacyNote: "Privacy",
    legacyScore: "Legacy score",
    domains: {
      founding: "Founding legacy",
      cultural: "Cultural legacy",
      community: "Community legacy",
      customer: "Customer legacy",
      employee: "Employee legacy",
      leadership: "Leadership legacy",
    },
    healthLabels: {
      exceptional: "Exceptional",
      strong: "Strong",
      maturing: "Maturing",
      developing: "Developing",
      emerging: "Emerging",
    },
    timelineTypes: {
      founding_event: "Founding event",
      growth_milestone: "Growth milestone",
      major_achievement: "Major achievement",
      organizational_transition: "Organizational transition",
      significant_lesson: "Significant lesson",
      cultural_moment: "Cultural moment",
    },
    sessionTypes: {
      leadership_reflection: "Leadership reflection",
      quarterly_stewardship: "Quarterly stewardship",
      annual_legacy_review: "Annual legacy review",
      values_preservation: "Values preservation",
    },
    metrics: {
      projects: "Projects in progress",
      milestones: "Milestones documented",
      values: "Values preserved",
      archives: "Archives maintained",
      reflection: "Reflection participation",
      continuity: "Institutional continuity",
      awareness: "Values awareness",
      confidence: "Leadership confidence",
    },
    executiveFields: {
      milestones: "Historical milestones",
      continuity: "Values continuity",
      reflection: "Reflection trends",
      stewardship: "Stewardship opportunities",
    },
    settingsLink: "Organizational Legacy",
    organizationalLegacyLink: "Organizational Legacy",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisasjonsarv", settingsLink: "Organisasjonsarv" }],
    ["sv", { ...i18nBlock(), title: "Organisationsarv", settingsLink: "Organisationsarv" }],
    ["da", { ...i18nBlock(), title: "Organisationsarv", settingsLink: "Organisationsarv" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalLegacyCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalLegacyCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalLegacyLink = block.organizationalLegacyLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_wisdom.view",', `"org_wisdom.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalLegacyCenterEngine")) {
    c = c.replace(
      '| "organizationalWisdomCenterEngine"',
      '| "organizationalLegacyCenterEngine"\n  | "organizationalWisdomCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalWisdomCenterEngine", href: "/app/executive/organizational-wisdom", labelKey: "customerApp.nav.organizationalWisdomCenterEngine" },',
      `{ id: "organizationalLegacyCenterEngine", href: "/app/executive/organizational-legacy", labelKey: "customerApp.nav.organizationalLegacyCenterEngine" },
  { id: "organizationalWisdomCenterEngine", href: "/app/executive/organizational-wisdom", labelKey: "customerApp.nav.organizationalWisdomCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-wisdom")) return "organizationalWisdomCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-legacy")) return "organizationalLegacyCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-wisdom")) return "organizationalWisdomCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-legacy-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalLegacyLink")) {
    c = c.replace(
      "organizationalWisdomLink: string;",
      "organizationalWisdomLink: string;\n    organizationalLegacyLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-wisdom" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalWisdomLink}
        </Link>`,
      `<Link href="/app/executive/organizational-wisdom" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalWisdomLink}
        </Link>
        <Link href="/app/executive/organizational-legacy" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalLegacyLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalLegacyLink")) {
    p = p.replace(
      'organizationalWisdomLink: t("customerApp.executive.organizationalWisdomLink"),',
      'organizationalWisdomLink: t("customerApp.executive.organizationalWisdomLink"),\n        organizationalLegacyLink: t("customerApp.executive.organizationalLegacyLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Legacy Center\nRoute: ${P.route}\nCore: Organizations leave behind more than products and profits — they leave behind impact, values, relationships, and stories.\nHelpers: _olc_* · _olcbp325_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Organizations leave behind more than products and profits — they leave behind impact, values, relationships, and stories.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase324-vocabulary";',
      `export * from "./implementation-blueprint-phase324-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE324_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase324-aipify-organizational-wisdom-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE324_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase324-aipify-organizational-wisdom-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Legacy Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_LEGACY_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_LEGACY_CENTER_ENGINE_PHASE${P.phase}.md) — Organizational Legacy Center at Executive Center → Organizational Legacy. Legacy dashboard, timeline, reflection engine, values preservation, and executive legacy view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_olc_*\`, \`_olcbp325_*\`. APIs at \`/api/organizational-legacy/*\`. Cross-links wisdom, memory, purpose, and learning centers — does not modify their RPCs.`;
  if (!c.includes("Organizational Legacy Center Engine (Phase 325)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_LEGACY_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Legacy Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
