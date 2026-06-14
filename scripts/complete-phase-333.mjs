#!/usr/bin/env node
/** ABOS Phase 333 — Aipify Organizational Continuity Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 333,
  migration: "20261426100000_aipify_organizational_continuity_center_engine_phase333.sql",
  slug: "aipify-organizational-continuity-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_CONTINUITY_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase333-aipify-organizational-continuity-center.txt",
  route: "/app/executive/organizational-continuity",
  permKeys: ["org_continuity.view", "org_continuity.manage", "org_continuity.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Continuity",
    subtitle:
      "Preserve continuity across leadership transitions, workforce changes, operational disruptions, strategic pivots, and periods of accelerated growth.",
    loading: "Loading Continuity Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Continuity philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalCoherenceLink: "Organizational Coherence →",
    organizationalFuturesLink: "Organizational Futures →",
    organizationalMomentumLink: "Organizational Momentum →",
    organizationalTrustLink: "Organizational Trust →",
    organizationalLegacyLink: "Organizational Legacy →",
    dashboardTitle: "Continuity dashboard",
    dependencyTitle: "Key person dependency",
    successionTitle: "Succession support",
    reviewsTitle: "Continuity reviews",
    timelineTitle: "Continuity timeline",
    milestonesTitle: "Continuity milestones",
    snapshotsTitle: "Continuity snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive continuity view",
    sessionsTitle: "Continuity sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleDiscussion: "Schedule succession discussion",
    addressDependency: "Mark dependency addressed",
    advanceSuccession: "Advance succession item",
    generateReport: "Generate continuity report",
    printSummary: "Print preparedness summary",
    exportSnapshot: "Export continuity snapshot",
    coordinateTransfer: "Coordinate knowledge transfer",
    archiveMilestone: "Archive continuity milestone",
    humansDecide: "Aipify supports continuity planning — leadership owns succession, knowledge preservation, and institutional stewardship.",
    privacyNote: "Privacy",
    continuityScore: "Organizational continuity score",
    domains: {
      leadership: "Leadership continuity",
      knowledge: "Knowledge continuity",
      operational: "Operational continuity",
      customer: "Customer continuity",
      strategic: "Strategic continuity",
      cultural: "Cultural continuity",
    },
    signalTypes: {
      critical_knowledge_concentration: "Critical knowledge concentration",
      leadership_dependency: "Leadership dependency risk",
      process_ownership_vulnerability: "Process ownership vulnerability",
      operational_bottleneck: "Operational bottleneck",
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
    successionTypes: {
      leadership_transition: "Leadership transition",
      knowledge_handover: "Knowledge handover",
      responsibility_mapping: "Responsibility mapping",
      executive_onboarding: "Executive onboarding",
    },
    successionStatuses: {
      pending: "Pending",
      in_progress: "In progress",
      completed: "Completed",
    },
    healthLabels: {
      exceptional: "Exceptional",
      strong: "Strong",
      stable: "Stable",
      developing: "Developing",
      vulnerable: "Vulnerable",
    },
    timelineTypes: {
      leadership_transition: "Leadership transition",
      knowledge_preservation: "Knowledge preservation",
      operational_milestone: "Operational milestone",
      strategic_reaffirmation: "Strategic reaffirmation",
      cultural_continuity: "Cultural continuity",
    },
    reviewTypes: {
      quarterly_continuity: "Quarterly continuity review",
      annual_succession: "Annual succession discussion",
      knowledge_preservation: "Knowledge preservation session",
      executive_preparedness: "Executive preparedness assessment",
    },
    sessionTypes: {
      succession_discussion: "Succession discussion",
      knowledge_transfer: "Knowledge transfer",
      preparedness_assessment: "Preparedness assessment",
    },
    metrics: {
      leadership: "Leadership preparedness",
      knowledge: "Knowledge continuity",
      operational: "Operational resilience",
      strategic: "Strategic stability",
      succession: "Succession readiness",
      documentation: "Documentation maturity",
      dependencies: "Dependency risks",
      confidence: "Executive confidence",
    },
    executiveFields: {
      leadership: "Leadership continuity",
      consistency: "Strategic consistency",
      knowledge: "Knowledge preservation",
      opportunities: "Resilience opportunities",
    },
    settingsLink: "Organizational Continuity",
    organizationalContinuityLink: "Organizational Continuity",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisatorisk kontinuitet", settingsLink: "Organisatorisk kontinuitet" }],
    ["sv", { ...i18nBlock(), title: "Organisatorisk kontinuitet", settingsLink: "Organisatorisk kontinuitet" }],
    ["da", { ...i18nBlock(), title: "Organisatorisk kontinuitet", settingsLink: "Organisatorisk kontinuitet" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalContinuityCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalContinuityCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalContinuityLink = block.organizationalContinuityLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_coherence.view",', `"org_coherence.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalContinuityCenterEngine")) {
    c = c.replace(
      '| "organizationalCoherenceCenterEngine"',
      '| "organizationalContinuityCenterEngine"\n  | "organizationalCoherenceCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalCoherenceCenterEngine", href: "/app/executive/organizational-coherence", labelKey: "customerApp.nav.organizationalCoherenceCenterEngine" },',
      `{ id: "organizationalContinuityCenterEngine", href: "/app/executive/organizational-continuity", labelKey: "customerApp.nav.organizationalContinuityCenterEngine" },
  { id: "organizationalCoherenceCenterEngine", href: "/app/executive/organizational-coherence", labelKey: "customerApp.nav.organizationalCoherenceCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-coherence")) return "organizationalCoherenceCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-continuity")) return "organizationalContinuityCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-coherence")) return "organizationalCoherenceCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-continuity-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalContinuityLink")) {
    c = c.replace(
      "organizationalCoherenceLink: string;",
      "organizationalCoherenceLink: string;\n    organizationalContinuityLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-coherence" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalCoherenceLink}
        </Link>`,
      `<Link href="/app/executive/organizational-coherence" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalCoherenceLink}
        </Link>
        <Link href="/app/executive/organizational-continuity" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalContinuityLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalContinuityLink")) {
    p = p.replace(
      'organizationalCoherenceLink: t("customerApp.executive.organizationalCoherenceLink"),',
      'organizationalCoherenceLink: t("customerApp.executive.organizationalCoherenceLink"),\n        organizationalContinuityLink: t("customerApp.executive.organizationalContinuityLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Continuity Center\nRoute: ${P.route}\nCore: Organizations should remain stable even when people, systems, markets, and circumstances change.\nHelpers: _ocnc_* · _ocncbp333_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Organizations should remain stable even when people, systems, markets, and circumstances change.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase332-vocabulary";',
      `export * from "./implementation-blueprint-phase332-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE332_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase332-aipify-organizational-coherence-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE332_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase332-aipify-organizational-coherence-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Continuity Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_CONTINUITY_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_CONTINUITY_CENTER_ENGINE_PHASE${P.phase}.md) — Continuity Center at Executive Center → Organizational Continuity. Key person dependency detection, succession support, reviews, and executive continuity view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_ocnc_*\`, \`_ocncbp333_*\`. APIs at \`/api/organizational-continuity/*\`. Cross-links coherence, futures, momentum, trust, and legacy centers.`;
  if (!c.includes("Organizational Continuity Center Engine (Phase 333)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_CONTINUITY_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Continuity Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
