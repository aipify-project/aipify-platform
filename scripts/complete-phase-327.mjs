#!/usr/bin/env node
/** ABOS Phase 327 — Aipify Organizational Stewardship Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 327,
  migration: "20261425500000_aipify_organizational_stewardship_center_engine_phase327.sql",
  slug: "aipify-organizational-stewardship-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_STEWARDSHIP_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase327-aipify-organizational-stewardship-center.txt",
  route: "/app/executive/organizational-stewardship",
  permKeys: ["org_stewardship.view", "org_stewardship.manage", "org_stewardship.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Stewardship",
    subtitle:
      "Practice responsible stewardship of people, resources, relationships, knowledge, technology, and opportunities entrusted to the organization.",
    loading: "Loading Stewardship Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Stewardship philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalLegacyLink: "Organizational Legacy →",
    organizationalMemoryLink: "Organizational Memory →",
    knowledgeEvolutionLink: "Knowledge Evolution →",
    organizationalWisdomLink: "Organizational Wisdom →",
    capabilityMaturityLink: "Capability Maturity →",
    dashboardTitle: "Stewardship dashboard",
    indicatorsTitle: "Stewardship indicators",
    reflectionsTitle: "Reflection engine",
    reviewsTitle: "Stewardship reviews",
    highlightsTitle: "Organizational impact highlights",
    milestonesTitle: "Stewardship milestones",
    snapshotsTitle: "Stewardship snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive stewardship view",
    sessionsTitle: "Stewardship sessions",
    successionTitle: "Succession integration",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleReflection: "Schedule leadership reflection",
    generateReport: "Generate stewardship report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export stewardship snapshot",
    coordinateSuccession: "Coordinate succession discussion",
    archiveMilestone: "Archive stewardship milestone",
    humansDecide: "Aipify supports awareness and reflection — leadership owns judgment, responsibility, and long-term stewardship.",
    privacyNote: "Privacy",
    stewardshipScore: "Stewardship health score",
    domains: {
      people: "People stewardship",
      customer: "Customer stewardship",
      resource: "Resource stewardship",
      knowledge: "Knowledge stewardship",
      technology: "Technology stewardship",
      community: "Community stewardship",
    },
    healthLabels: {
      exceptional: "Exceptional",
      strong: "Strong",
      developing: "Developing",
      needs_attention: "Needs attention",
      reactive: "Reactive",
    },
    reviewTypes: {
      quarterly_stewardship: "Quarterly stewardship review",
      annual_leadership: "Annual leadership reflection",
      succession_preparedness: "Succession preparedness discussion",
      long_term_planning: "Long-term planning session",
    },
    sessionTypes: {
      leadership_reflection: "Leadership reflection",
      succession_discussion: "Succession discussion",
      long_term_planning: "Long-term planning",
    },
    metrics: {
      leadership: "Leadership participation",
      resources: "Resource stewardship",
      knowledge: "Knowledge continuity",
      governance: "Governance participation",
      reflection: "Reflection frequency",
      sustainable: "Sustainable decisions",
      succession: "Succession preparedness",
      confidence: "Leadership confidence",
    },
    executiveFields: {
      continuity: "Leadership continuity",
      readiness: "Long-term readiness",
      responsibility: "Responsibility measures",
      opportunities: "Stewardship opportunities",
    },
    settingsLink: "Organizational Stewardship",
    organizationalStewardshipLink: "Organizational Stewardship",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisasjonsforvaltning", settingsLink: "Organisasjonsforvaltning" }],
    ["sv", { ...i18nBlock(), title: "Organisationsförvaltning", settingsLink: "Organisationsförvaltning" }],
    ["da", { ...i18nBlock(), title: "Organisationsforvaltning", settingsLink: "Organisationsforvaltning" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalStewardshipCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalStewardshipCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalStewardshipLink = block.organizationalStewardshipLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_purpose.view",', `"org_purpose.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalStewardshipCenterEngine")) {
    c = c.replace(
      '| "organizationalPurposeCenterEngine"',
      '| "organizationalStewardshipCenterEngine"\n  | "organizationalPurposeCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalPurposeCenterEngine", href: "/app/executive/organizational-purpose", labelKey: "customerApp.nav.organizationalPurposeCenterEngine" },',
      `{ id: "organizationalStewardshipCenterEngine", href: "/app/executive/organizational-stewardship", labelKey: "customerApp.nav.organizationalStewardshipCenterEngine" },
  { id: "organizationalPurposeCenterEngine", href: "/app/executive/organizational-purpose", labelKey: "customerApp.nav.organizationalPurposeCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-purpose")) return "organizationalPurposeCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-stewardship")) return "organizationalStewardshipCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-purpose")) return "organizationalPurposeCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-stewardship-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalStewardshipLink")) {
    c = c.replace(
      "organizationalPurposeLink: string;",
      "organizationalPurposeLink: string;\n    organizationalStewardshipLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-purpose" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalPurposeLink}
        </Link>`,
      `<Link href="/app/executive/organizational-purpose" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalPurposeLink}
        </Link>
        <Link href="/app/executive/organizational-stewardship" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalStewardshipLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalStewardshipLink")) {
    p = p.replace(
      'organizationalPurposeLink: t("customerApp.executive.organizationalPurposeLink"),',
      'organizationalPurposeLink: t("customerApp.executive.organizationalPurposeLink"),\n        organizationalStewardshipLink: t("customerApp.executive.organizationalStewardshipLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Stewardship Center\nRoute: ${P.route}\nCore: Leadership is not ownership — leadership is stewardship.\nHelpers: _osc_* · _oscbp327_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Leadership is not ownership — leadership is stewardship.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase326-vocabulary";',
      `export * from "./implementation-blueprint-phase326-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE326_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase326-aipify-organizational-purpose-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE326_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase326-aipify-organizational-purpose-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Stewardship Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_STEWARDSHIP_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_STEWARDSHIP_CENTER_ENGINE_PHASE${P.phase}.md) — Stewardship Center at Executive Center → Organizational Stewardship. Stewardship health score, reflection engine, reviews, and succession integration. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_osc_*\`, \`_oscbp327_*\`. APIs at \`/api/organizational-stewardship/*\`. Cross-links legacy, memory, knowledge evolution, wisdom, and capability maturity — does not modify their RPCs.`;
  if (!c.includes("Organizational Stewardship Center Engine (Phase 327)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_STEWARDSHIP_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Stewardship Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
