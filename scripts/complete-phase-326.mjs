#!/usr/bin/env node
/** ABOS Phase 326 — Aipify Organizational Purpose Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 326,
  migration: "20261425400000_aipify_organizational_purpose_center_engine_phase326.sql",
  slug: "aipify-organizational-purpose-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_PURPOSE_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase326-aipify-organizational-purpose-center.txt",
  route: "/app/executive/organizational-purpose",
  permKeys: ["org_purpose.view", "org_purpose.manage", "org_purpose.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Purpose",
    subtitle:
      "Reconnect daily activities, strategic initiatives, leadership decisions, and cultural practices with the deeper purpose that defines why the organization exists.",
    loading: "Loading Purpose Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Purpose philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalLegacyLink: "Organizational Legacy →",
    organizationalWisdomLink: "Organizational Wisdom →",
    organizationalAlignmentLink: "Organizational Alignment →",
    purposeValuesLink: "Purpose & Values →",
    dashboardTitle: "Purpose dashboard",
    alignmentTitle: "Purpose alignment",
    reflectionsTitle: "Reflection engine",
    reviewsTitle: "Purpose reviews",
    timelineTitle: "Purpose timeline",
    milestonesTitle: "Purpose milestones",
    snapshotsTitle: "Alignment snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive purpose view",
    sessionsTitle: "Purpose sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleDiscussion: "Schedule leadership discussion",
    generateReport: "Generate purpose report",
    printReflection: "Print reflection summary",
    exportSnapshot: "Export alignment snapshot",
    archiveMilestone: "Archive purpose milestone",
    coordinateReflection: "Coordinate organizational reflection",
    humansDecide: "Aipify supports reflection and alignment — leadership owns purpose, values, and authentic meaning.",
    privacyNote: "Privacy",
    purposeScore: "Purpose score",
    domains: {
      mission_clarity: "Mission clarity",
      values_alignment: "Values alignment",
      customer_purpose: "Customer purpose",
      employee_purpose: "Employee purpose",
      community_purpose: "Community purpose",
    },
    alignmentAreas: {
      strategy: "Strategy",
      culture: "Culture",
      customer_promises: "Customer promises",
      leadership_decisions: "Leadership decisions",
      organizational_behaviors: "Organizational behaviors",
    },
    healthLabels: {
      exceptional: "Exceptional",
      strong: "Strong",
      maturing: "Maturing",
      developing: "Developing",
      emerging: "Emerging",
    },
    timelineTypes: {
      mission_update: "Mission update",
      cultural_milestone: "Cultural milestone",
      leadership_reflection: "Leadership reflection",
      community_contribution: "Community contribution",
      strategic_reaffirmation: "Strategic reaffirmation",
    },
    reviewTypes: {
      annual_purpose: "Annual purpose review",
      executive_reflection: "Executive reflection session",
      strategic_planning: "Strategic planning discussion",
      cultural_alignment: "Cultural alignment review",
    },
    sessionTypes: {
      leadership_discussion: "Leadership discussion",
      organizational_reflection: "Organizational reflection",
      purpose_planning: "Purpose planning",
    },
    metrics: {
      clarity: "Purpose clarity",
      valuesAlignment: "Values alignment trend",
      leadership: "Leadership participation",
      reflections: "Reflections completed",
      strategic: "Strategic alignment",
      employee: "Employee understanding",
      confidence: "Leadership confidence",
    },
    executiveFields: {
      mission: "Mission alignment",
      values: "Values consistency",
      reflection: "Reflection participation",
      impact: "Long-term impact",
    },
    settingsLink: "Organizational Purpose",
    organizationalPurposeLink: "Organizational Purpose",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisasjonsformål", settingsLink: "Organisasjonsformål" }],
    ["sv", { ...i18nBlock(), title: "Organisationsändamål", settingsLink: "Organisationsändamål" }],
    ["da", { ...i18nBlock(), title: "Organisationsformål", settingsLink: "Organisationsformål" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalPurposeCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalPurposeCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalPurposeLink = block.organizationalPurposeLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_legacy.view",', `"org_legacy.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalPurposeCenterEngine")) {
    c = c.replace(
      '| "organizationalLegacyCenterEngine"',
      '| "organizationalPurposeCenterEngine"\n  | "organizationalLegacyCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalLegacyCenterEngine", href: "/app/executive/organizational-legacy", labelKey: "customerApp.nav.organizationalLegacyCenterEngine" },',
      `{ id: "organizationalPurposeCenterEngine", href: "/app/executive/organizational-purpose", labelKey: "customerApp.nav.organizationalPurposeCenterEngine" },
  { id: "organizationalLegacyCenterEngine", href: "/app/executive/organizational-legacy", labelKey: "customerApp.nav.organizationalLegacyCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-legacy")) return "organizationalLegacyCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-purpose")) return "organizationalPurposeCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-legacy")) return "organizationalLegacyCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-purpose-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalPurposeLink")) {
    c = c.replace(
      "organizationalLegacyLink: string;",
      "organizationalLegacyLink: string;\n    organizationalPurposeLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-legacy" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalLegacyLink}
        </Link>`,
      `<Link href="/app/executive/organizational-legacy" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalLegacyLink}
        </Link>
        <Link href="/app/executive/organizational-purpose" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalPurposeLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalPurposeLink")) {
    p = p.replace(
      'organizationalLegacyLink: t("customerApp.executive.organizationalLegacyLink"),',
      'organizationalLegacyLink: t("customerApp.executive.organizationalLegacyLink"),\n        organizationalPurposeLink: t("customerApp.executive.organizationalPurposeLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Purpose Center\nRoute: ${P.route}\nCore: Organizations thrive when people understand not only what they do, but why it matters.\nHelpers: _opc_* · _opcbp326_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Organizations thrive when people understand not only what they do, but why it matters.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase325-vocabulary";',
      `export * from "./implementation-blueprint-phase325-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE325_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase325-aipify-organizational-legacy-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE325_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase325-aipify-organizational-legacy-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Purpose Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_PURPOSE_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_PURPOSE_CENTER_ENGINE_PHASE${P.phase}.md) — Purpose Center at Executive Center → Organizational Purpose. Purpose dashboard, alignment engine, reflection engine, and executive purpose view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_opc_*\`, \`_opcbp326_*\`. APIs at \`/api/organizational-purpose/*\`. Cross-links legacy, wisdom, alignment, and purpose values — does not modify their RPCs.`;
  if (!c.includes("Organizational Purpose Center Engine (Phase 326)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_PURPOSE_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Purpose Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
