#!/usr/bin/env node
/** ABOS Phase 329 — Aipify Organizational Trust Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 329,
  migration: "20261425700000_aipify_organizational_trust_center_engine_phase329.sql",
  slug: "aipify-organizational-trust-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_TRUST_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase329-aipify-organizational-trust-center.txt",
  route: "/app/executive/organizational-trust",
  permKeys: ["org_trust.view", "org_trust.manage", "org_trust.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Trust",
    subtitle:
      "Strengthen trust across leadership, teams, customers, partners, and stakeholders through transparency, consistency, accountability, and reliability.",
    loading: "Loading Trust Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Trust philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalStewardshipLink: "Organizational Stewardship →",
    organizationalSimplicityLink: "Organizational Simplicity →",
    organizationalPurposeLink: "Organizational Purpose →",
    trustTransparencyLink: "Trust & Transparency →",
    dashboardTitle: "Trust dashboard",
    signalsTitle: "Trust signal engine",
    accountabilityTitle: "Accountability engine",
    reviewsTitle: "Trust reviews",
    timelineTitle: "Trust timeline",
    milestonesTitle: "Trust milestones",
    snapshotsTitle: "Trust snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive trust view",
    sessionsTitle: "Trust sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleSession: "Schedule reflection session",
    fulfillCommitment: "Mark commitment fulfilled",
    generateSummary: "Generate trust summary",
    printReport: "Print executive report",
    exportSnapshot: "Export trust snapshot",
    coordinateReview: "Coordinate leadership review",
    archiveMilestone: "Archive trust milestone",
    humansDecide: "Aipify supports reflection and accountability — leadership owns authentic trust-building and relationships.",
    privacyNote: "Privacy",
    trustScore: "Organizational trust score",
    domains: {
      leadership: "Leadership trust",
      team: "Team trust",
      customer: "Customer trust",
      partner: "Partner trust",
      organizational: "Organizational trust",
    },
    signalTypes: {
      follow_through: "Consistent follow-through",
      communication_gap: "Communication gap",
      governance_reliability: "Governance reliability",
      service_consistency: "Service consistency",
      accountability_pattern: "Accountability pattern",
    },
    signalTones: {
      positive: "Positive signal",
      neutral: "Neutral signal",
      attention: "Needs attention",
    },
    commitmentStatuses: {
      open: "Open",
      fulfilled: "Fulfilled",
      review: "Under review",
    },
    healthLabels: {
      exceptional: "Exceptional",
      strong: "Strong",
      developing: "Developing",
      needs_attention: "Needs attention",
      fragile: "Fragile",
    },
    timelineTypes: {
      commitment_fulfilled: "Commitment fulfilled",
      recovery_effort: "Recovery effort",
      governance_improvement: "Governance improvement",
      customer_trust_milestone: "Customer trust milestone",
      leadership_reflection: "Leadership reflection",
    },
    reviewTypes: {
      quarterly_trust: "Quarterly trust review",
      leadership_reflection: "Leadership reflection session",
      customer_trust: "Customer trust discussion",
      governance_transparency: "Governance transparency review",
    },
    sessionTypes: {
      leadership_reflection: "Leadership reflection",
      leadership_review: "Leadership review",
      customer_trust_discussion: "Customer trust discussion",
    },
    metrics: {
      trend: "Trust-building trend",
      reliability: "Reliability",
      accountability: "Accountability participation",
      fulfillment: "Commitment fulfillment",
      communication: "Communication consistency",
      transparency: "Transparency practices",
      openCommitments: "Open commitments",
      confidence: "Leadership confidence",
    },
    executiveFields: {
      consistency: "Leadership consistency",
      reliability: "Reliability trends",
      governance: "Governance confidence",
      stakeholders: "Stakeholder opportunities",
    },
    settingsLink: "Organizational Trust",
    organizationalTrustLink: "Organizational Trust",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisatorisk tillit", settingsLink: "Organisatorisk tillit" }],
    ["sv", { ...i18nBlock(), title: "Organisatoriskt förtroende", settingsLink: "Organisatoriskt förtroende" }],
    ["da", { ...i18nBlock(), title: "Organisatorisk tillid", settingsLink: "Organisatorisk tillid" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalTrustCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalTrustCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalTrustLink = block.organizationalTrustLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_simplicity.view",', `"org_simplicity.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalTrustCenterEngine")) {
    c = c.replace(
      '| "organizationalSimplicityCenterEngine"',
      '| "organizationalTrustCenterEngine"\n  | "organizationalSimplicityCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalSimplicityCenterEngine", href: "/app/executive/organizational-simplicity", labelKey: "customerApp.nav.organizationalSimplicityCenterEngine" },',
      `{ id: "organizationalTrustCenterEngine", href: "/app/executive/organizational-trust", labelKey: "customerApp.nav.organizationalTrustCenterEngine" },
  { id: "organizationalSimplicityCenterEngine", href: "/app/executive/organizational-simplicity", labelKey: "customerApp.nav.organizationalSimplicityCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-simplicity")) return "organizationalSimplicityCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-trust")) return "organizationalTrustCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-simplicity")) return "organizationalSimplicityCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-trust-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalTrustLink")) {
    c = c.replace(
      "organizationalSimplicityLink: string;",
      "organizationalSimplicityLink: string;\n    organizationalTrustLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-simplicity" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalSimplicityLink}
        </Link>`,
      `<Link href="/app/executive/organizational-simplicity" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalSimplicityLink}
        </Link>
        <Link href="/app/executive/organizational-trust" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalTrustLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalTrustLink")) {
    p = p.replace(
      'organizationalSimplicityLink: t("customerApp.executive.organizationalSimplicityLink"),',
      'organizationalSimplicityLink: t("customerApp.executive.organizationalSimplicityLink"),\n        organizationalTrustLink: t("customerApp.executive.organizationalTrustLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Trust Center\nRoute: ${P.route}\nCore: Trust is one of the most valuable assets an organization possesses.\nHelpers: _otrc_* · _otrcbp329_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Trust is one of the most valuable assets an organization possesses.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase328-vocabulary";',
      `export * from "./implementation-blueprint-phase328-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE328_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase328-aipify-organizational-simplicity-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE328_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase328-aipify-organizational-simplicity-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Trust Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_TRUST_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_TRUST_CENTER_ENGINE_PHASE${P.phase}.md) — Trust Center at Executive Center → Organizational Trust. Trust signals, accountability engine, reviews, and executive trust view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_otrc_*\`, \`_otrcbp329_*\`. APIs at \`/api/organizational-trust/*\`. Cross-links stewardship, simplicity, purpose, and trust transparency — does not modify Phase 278 enterprise trust RPCs.`;
  if (!c.includes("Organizational Trust Center Engine (Phase 329)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_TRUST_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Trust Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
