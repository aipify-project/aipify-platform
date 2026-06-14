#!/usr/bin/env node
/** ABOS Phase 332 — Aipify Organizational Coherence Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 332,
  migration: "20261426000000_aipify_organizational_coherence_center_engine_phase332.sql",
  slug: "aipify-organizational-coherence-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_COHERENCE_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase332-aipify-organizational-coherence-center.txt",
  route: "/app/executive/organizational-coherence",
  permKeys: ["org_coherence.view", "org_coherence.manage", "org_coherence.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Coherence",
    subtitle:
      "Maintain coherence between vision, values, strategy, culture, governance, execution, and everyday behaviors as the organization grows and evolves.",
    loading: "Loading Coherence Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Coherence philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalFuturesLink: "Organizational Futures →",
    organizationalMomentumLink: "Organizational Momentum →",
    organizationalTrustLink: "Organizational Trust →",
    organizationalPurposeLink: "Organizational Purpose →",
    organizationalStewardshipLink: "Organizational Stewardship →",
    dashboardTitle: "Coherence dashboard",
    fragmentationTitle: "Fragmentation detection",
    alignmentTitle: "Alignment indicators",
    reviewsTitle: "Coherence reviews",
    timelineTitle: "Coherence timeline",
    milestonesTitle: "Coherence milestones",
    snapshotsTitle: "Coherence snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive coherence view",
    sessionsTitle: "Coherence sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleWorkshop: "Schedule leadership workshop",
    addressSignal: "Mark signal addressed",
    generateReport: "Generate coherence report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export coherence snapshot",
    coordinateDiscussion: "Coordinate cross-functional discussion",
    archiveMilestone: "Archive coherence milestone",
    humansDecide: "Aipify supports alignment awareness — leadership owns coherence, integrity, and authentic organizational evolution.",
    privacyNote: "Privacy",
    coherenceScore: "Organizational coherence score",
    domains: {
      vision: "Vision coherence",
      values: "Values coherence",
      execution: "Execution coherence",
      governance: "Governance coherence",
      customer: "Customer coherence",
      leadership: "Leadership coherence",
    },
    signalTypes: {
      conflicting_priorities: "Conflicting priorities",
      mixed_leadership_signals: "Mixed leadership signals",
      competing_initiatives: "Competing initiatives",
      policy_inconsistencies: "Policy inconsistencies",
      customer_promise_gaps: "Customer promise gaps",
    },
    signalTones: {
      positive: "Positive signal",
      neutral: "Neutral signal",
      attention: "Needs attention",
    },
    signalStatuses: {
      open: "Open",
      addressed: "Addressed",
    },
    alignmentStatuses: {
      aligned: "Aligned",
      developing: "Developing",
      review: "Under review",
    },
    healthLabels: {
      exceptional: "Exceptional",
      strong: "Strong",
      stable: "Stable",
      developing: "Developing",
      fragmented: "Fragmented",
    },
    timelineTypes: {
      strategic_transition: "Strategic transition",
      cultural_milestone: "Cultural milestone",
      governance_improvement: "Governance improvement",
      leadership_reflection: "Leadership reflection",
      alignment_achievement: "Alignment achievement",
    },
    reviewTypes: {
      quarterly_coherence: "Quarterly coherence review",
      executive_reflection: "Executive reflection session",
      strategic_alignment: "Strategic alignment discussion",
      annual_assessment: "Annual organizational assessment",
    },
    sessionTypes: {
      leadership_workshop: "Leadership workshop",
      executive_reflection: "Executive reflection",
      cross_functional_discussion: "Cross-functional discussion",
    },
    metrics: {
      consistency: "Strategic consistency",
      alignment: "Alignment trend",
      vision: "Vision alignment",
      values: "Values consistency",
      governance: "Governance integrity",
      initiatives: "Initiative coordination",
      fragmentation: "Fragmentation risks",
      confidence: "Leadership confidence",
    },
    executiveFields: {
      leadership: "Leadership alignment",
      consistency: "Strategic consistency",
      integrity: "Organizational integrity",
      opportunities: "Coherence opportunities",
    },
    settingsLink: "Organizational Coherence",
    organizationalCoherenceLink: "Organizational Coherence",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisatorisk koherens", settingsLink: "Organisatorisk koherens" }],
    ["sv", { ...i18nBlock(), title: "Organisatorisk koherens", settingsLink: "Organisatorisk koherens" }],
    ["da", { ...i18nBlock(), title: "Organisatorisk sammenhæng", settingsLink: "Organisatorisk sammenhæng" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalCoherenceCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalCoherenceCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalCoherenceLink = block.organizationalCoherenceLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_futures.view",', `"org_futures.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalCoherenceCenterEngine")) {
    c = c.replace(
      '| "organizationalFuturesCenterEngine"',
      '| "organizationalCoherenceCenterEngine"\n  | "organizationalFuturesCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalFuturesCenterEngine", href: "/app/executive/organizational-futures", labelKey: "customerApp.nav.organizationalFuturesCenterEngine" },',
      `{ id: "organizationalCoherenceCenterEngine", href: "/app/executive/organizational-coherence", labelKey: "customerApp.nav.organizationalCoherenceCenterEngine" },
  { id: "organizationalFuturesCenterEngine", href: "/app/executive/organizational-futures", labelKey: "customerApp.nav.organizationalFuturesCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-futures")) return "organizationalFuturesCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-coherence")) return "organizationalCoherenceCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-futures")) return "organizationalFuturesCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-coherence-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalCoherenceLink")) {
    c = c.replace(
      "organizationalFuturesLink: string;",
      "organizationalFuturesLink: string;\n    organizationalCoherenceLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-futures" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalFuturesLink}
        </Link>`,
      `<Link href="/app/executive/organizational-futures" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalFuturesLink}
        </Link>
        <Link href="/app/executive/organizational-coherence" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalCoherenceLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalCoherenceLink")) {
    p = p.replace(
      'organizationalFuturesLink: t("customerApp.executive.organizationalFuturesLink"),',
      'organizationalFuturesLink: t("customerApp.executive.organizationalFuturesLink"),\n        organizationalCoherenceLink: t("customerApp.executive.organizationalCoherenceLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Coherence Center\nRoute: ${P.route}\nCore: Growth often increases complexity — complexity often creates fragmentation.\nHelpers: _occ_* · _occbp332_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Growth often increases complexity — complexity often creates fragmentation.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase331-vocabulary";',
      `export * from "./implementation-blueprint-phase331-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE331_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase331-aipify-organizational-futures-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE331_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase331-aipify-organizational-futures-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Coherence Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_COHERENCE_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_COHERENCE_CENTER_ENGINE_PHASE${P.phase}.md) — Coherence Center at Executive Center → Organizational Coherence. Fragmentation detection, alignment indicators, reviews, and executive coherence view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_occ_*\`, \`_occbp332_*\`. APIs at \`/api/organizational-coherence/*\`. Cross-links futures, momentum, trust, purpose, and stewardship centers.`;
  if (!c.includes("Organizational Coherence Center Engine (Phase 332)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_COHERENCE_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Coherence Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
