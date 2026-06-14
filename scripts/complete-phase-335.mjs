#!/usr/bin/env node
/** ABOS Phase 335 — Aipify Organizational Impact Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 335,
  migration: "20261426300000_aipify_organizational_impact_center_engine_phase335.sql",
  slug: "aipify-organizational-impact-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_IMPACT_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase335-aipify-organizational-impact-center.txt",
  route: "/app/executive/organizational-impact",
  permKeys: ["org_impact.view", "org_impact.manage", "org_impact.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Impact",
    subtitle:
      "Understand, measure, strengthen, and communicate the positive impact your organization creates for customers, employees, partners, communities, and society.",
    loading: "Loading Impact Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Impact philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalExcellenceLink: "Organizational Excellence →",
    organizationalPurposeLink: "Organizational Purpose →",
    organizationalLegacyLink: "Organizational Legacy →",
    organizationalStewardshipLink: "Organizational Stewardship →",
    dashboardTitle: "Impact dashboard",
    reflectionsTitle: "Impact reflection engine",
    indicatorsTitle: "Impact engine",
    initiativesTitle: "Impact initiatives",
    reviewsTitle: "Impact reviews",
    timelineTitle: "Impact timeline",
    milestonesTitle: "Impact milestones",
    snapshotsTitle: "Impact snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive impact view",
    sessionsTitle: "Impact sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleReflection: "Schedule reflection session",
    markReflection: "Mark as reflected",
    documentInitiative: "Document initiative",
    completeInitiative: "Complete initiative",
    generateReport: "Generate impact report",
    printSummary: "Print stakeholder summary",
    exportSnapshot: "Export impact snapshot",
    coordinateDiscussion: "Coordinate leadership discussion",
    archiveMilestone: "Archive impact milestone",
    humansDecide: "Aipify supports impact awareness — leaders own authentic stewardship and meaningful contribution.",
    privacyNote: "Privacy",
    impactProfile: "Organizational impact profile",
    positiveTrend: "Positive outcome trend",
    domains: {
      customer: "Customer impact",
      employee: "Employee impact",
      community: "Community impact",
      industry: "Industry impact",
      economic: "Economic impact",
      organizational: "Organizational impact",
    },
    indicatorTypes: {
      customer_outcome: "Customer outcome",
      employee_experience: "Employee experience",
      community_engagement: "Community engagement",
      strategic_contribution: "Strategic contribution",
      long_term_influence: "Long-term influence",
    },
    indicatorTones: {
      positive: "Positive indicator",
      neutral: "Neutral indicator",
      attention: "Needs attention",
    },
    initiativeStatuses: {
      planned: "Planned",
      in_progress: "In progress",
      completed: "Completed",
      documented: "Documented",
    },
    reflectionStatuses: {
      open: "Open",
      reflected: "Reflected",
    },
    healthLabels: {
      exceptional: "Exceptional",
      strong: "Strong",
      meaningful: "Meaningful",
      developing: "Developing",
      reflection_recommended: "Reflection recommended",
    },
    timelineTypes: {
      customer_milestone: "Customer milestone",
      community_initiative: "Community initiative",
      employee_development: "Employee development achievement",
      industry_contribution: "Industry contribution",
      organizational_breakthrough: "Organizational breakthrough",
    },
    reviewTypes: {
      quarterly_impact: "Quarterly impact review",
      annual_reflection: "Annual reflection session",
      executive_stewardship: "Executive stewardship discussion",
      legacy_planning: "Legacy planning workshop",
    },
    sessionTypes: {
      reflection_session: "Reflection session",
      stewardship_discussion: "Stewardship discussion",
      legacy_workshop: "Legacy workshop",
    },
    metrics: {
      customer: "Customer outcomes",
      employee: "Employee development",
      community: "Community engagement",
      purpose: "Purpose alignment",
      mission: "Mission fulfillment",
      initiatives: "Initiatives in progress",
      stakeholders: "Stakeholder summaries",
      confidence: "Executive confidence",
    },
    executiveFields: {
      stakeholders: "Stakeholder impact indicators",
      mission: "Mission fulfillment trends",
      opportunities: "Long-term contribution opportunities",
      influence: "Organizational influence",
    },
    settingsLink: "Organizational Impact",
    organizationalImpactLink: "Organizational Impact",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisatorisk påvirkning", settingsLink: "Organisatorisk påvirkning" }],
    ["sv", { ...i18nBlock(), title: "Organisatorisk påverkan", settingsLink: "Organisatorisk påverkan" }],
    ["da", { ...i18nBlock(), title: "Organisatorisk påvirkning", settingsLink: "Organisatorisk påvirkning" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalImpactCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalImpactCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalImpactLink = block.organizationalImpactLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_excellence.view",', `"org_excellence.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalImpactCenterEngine")) {
    c = c.replace(
      '| "organizationalExcellenceCenterEngine"',
      '| "organizationalImpactCenterEngine"\n  | "organizationalExcellenceCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalExcellenceCenterEngine", href: "/app/executive/organizational-excellence", labelKey: "customerApp.nav.organizationalExcellenceCenterEngine" },',
      `{ id: "organizationalImpactCenterEngine", href: "/app/executive/organizational-impact", labelKey: "customerApp.nav.organizationalImpactCenterEngine" },
  { id: "organizationalExcellenceCenterEngine", href: "/app/executive/organizational-excellence", labelKey: "customerApp.nav.organizationalExcellenceCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-excellence")) return "organizationalExcellenceCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-impact")) return "organizationalImpactCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-excellence")) return "organizationalExcellenceCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-impact-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalImpactLink")) {
    c = c.replace(
      "organizationalExcellenceLink: string;",
      "organizationalExcellenceLink: string;\n    organizationalImpactLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-excellence" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalExcellenceLink}
        </Link>`,
      `<Link href="/app/executive/organizational-excellence" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalExcellenceLink}
        </Link>
        <Link href="/app/executive/organizational-impact" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalImpactLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalImpactLink")) {
    p = p.replace(
      'organizationalExcellenceLink: t("customerApp.executive.organizationalExcellenceLink"),',
      'organizationalExcellenceLink: t("customerApp.executive.organizationalExcellenceLink"),\n        organizationalImpactLink: t("customerApp.executive.organizationalImpactLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Impact Center\nRoute: ${P.route}\nCore: Success should not be measured only by financial outcomes.\nHelpers: _oimc_* · _oimcbp335_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Success should not be measured only by financial outcomes.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase334-vocabulary";',
      `export * from "./implementation-blueprint-phase334-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE334_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase334-aipify-organizational-excellence-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE334_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase334-aipify-organizational-excellence-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Impact Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_IMPACT_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_IMPACT_CENTER_ENGINE_PHASE${P.phase}.md) — Impact Center at Executive Center → Organizational Impact. Impact dashboard, reflection engine, reviews, timeline, and executive impact view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_oimc_*\`, \`_oimcbp335_*\`. APIs at \`/api/organizational-impact/*\`. Cross-links excellence, purpose, legacy, and stewardship centers.`;
  if (!c.includes("Organizational Impact Center Engine (Phase 335)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_IMPACT_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Impact Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
