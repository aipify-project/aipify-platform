#!/usr/bin/env node
/** ABOS Phase 356 — Aipify Organizational Identity Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 356,
  migration: "20261428400000_aipify_organizational_identity_center_engine_phase356.sql",
  slug: "aipify-organizational-identity-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_IDENTITY_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase356-aipify-organizational-identity-center.txt",
  route: "/app/executive/organizational-identity",
  permKeys: ["org_identity.view", "org_identity.manage", "org_identity.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Identity Center",
    subtitle:
      "Understand, preserve, strengthen and evolve organizational identity — values, purpose, culture, legacy and principled leadership through change.",
    loading: "Loading Identity Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Identity philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalBalanceLink: "Organizational Balance →",
    organizationalPresenceLink: "Organizational Presence →",
    dashboardTitle: "Identity dashboard",
    signalsTitle: "Identity engine",
    purposeAlignmentTitle: "Purpose alignment engine",
    initiativesTitle: "Identity actions",
    reviewsTitle: "Identity reviews",
    timelineTitle: "Identity timeline",
    milestonesTitle: "Identity milestones",
    snapshotsTitle: "Identity snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive identity view",
    sessionsTitle: "Stewardship sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleReflection: "Schedule reflection session",
    completeInitiative: "Complete initiative",
    generateReport: "Generate identity report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export identity snapshot",
    coordinateDiscussion: "Coordinate leadership discussion",
    archiveMilestone: "Archive identity milestone",
    humansDecide:
      "Aipify supports identity awareness — leaders retain responsibility; identity strengthens continuity without rigid branding exercises or autonomous redefinition.",
    privacyNote: "Privacy",
    identityScore: "Organizational identity health score",
    valuesAlignment: "Values alignment indicators",
    domains: {
      purpose: "Purpose identity",
      values: "Values identity",
      cultural: "Cultural identity",
      customer: "Customer identity",
      leadership: "Leadership identity",
      legacy: "Legacy identity",
    },
    signalTypes: {
      strengthening_identity_signals: "Strengthening identity signals",
      cultural_consistency: "Cultural consistency",
      clarification_opportunities: "Clarification opportunities",
      identity_tensions: "Identity tensions",
      legacy_preservation_needs: "Legacy preservation needs",
    },
    signalTones: {
      positive: "Positive indicator",
      neutral: "Neutral indicator",
      attention: "Needs attention",
    },
    purposeAlignmentTypes: {
      why_exist: "Why we exist",
      values_guide_decisions: "Values guide decisions",
      never_change: "What should never change",
      should_evolve: "What should evolve",
      actions_consistent: "Actions consistent with identity",
    },
    initiativeStatuses: {
      planned: "Planned",
      in_progress: "In progress",
      completed: "Completed",
    },
    healthLabels: {
      exceptional: "Exceptional",
      strong: "Strong",
      healthy: "Healthy",
      developing: "Developing",
      identity_reinforcement_recommended: "Identity reinforcement recommended",
    },
    timelineTypes: {
      founding_milestone: "Founding milestone",
      strategic_evolution: "Strategic evolution",
      cultural_development: "Cultural development",
      leadership_reflection: "Leadership reflection",
      legacy_achievement: "Legacy achievement",
    },
    reviewTypes: {
      quarterly_identity: "Quarterly identity review",
      annual_purpose_reflection: "Annual purpose reflection",
      leadership_stewardship: "Leadership stewardship session",
      legacy_preservation: "Legacy preservation discussion",
    },
    sessionTypes: {
      reflection_session: "Reflection session",
      stewardship_session: "Stewardship session",
      leadership_discussion: "Leadership discussion",
    },
    metrics: {
      valuesAlignment: "Values alignment",
      culturalConsistency: "Cultural consistency",
      leadershipParticipation: "Leadership participation",
      legacyPreservation: "Legacy preservation",
      purposeClarity: "Purpose clarity",
      initiatives: "Initiatives in progress",
      reviews: "Reviews completed",
    },
    executiveFields: {
      purposeAlignment: "Purpose alignment indicators",
      leadershipConsistency: "Leadership consistency trends",
      valuesReinforcement: "Values reinforcement measures",
      stewardshipOpportunities: "Identity stewardship opportunities",
    },
    settingsLink: "Organizational Identity",
    organizationalIdentityLink: "Organizational Identity",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Identitetssenter", settingsLink: "Organisatorisk identitet" }],
    ["sv", { ...i18nBlock(), title: "Identitetscenter", settingsLink: "Organisatorisk identitet" }],
    ["da", { ...i18nBlock(), title: "Identitetscenter", settingsLink: "Organisatorisk identitet" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalIdentityCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalIdentityCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalIdentityLink = block.organizationalIdentityLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_presence.view",', `"org_presence.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalIdentityCenterEngine")) {
    c = c.replace(
      '| "organizationalPresenceCenterEngine"',
      '| "organizationalIdentityCenterEngine"\n  | "organizationalPresenceCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalPresenceCenterEngine", href: "/app/executive/organizational-presence", labelKey: "customerApp.nav.organizationalPresenceCenterEngine" },',
      `{ id: "organizationalIdentityCenterEngine", href: "/app/executive/organizational-identity", labelKey: "customerApp.nav.organizationalIdentityCenterEngine" },
  { id: "organizationalPresenceCenterEngine", href: "/app/executive/organizational-presence", labelKey: "customerApp.nav.organizationalPresenceCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-presence")) return "organizationalPresenceCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-identity")) return "organizationalIdentityCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-presence")) return "organizationalPresenceCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-identity-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalIdentityLink")) {
    c = c.replace(
      "organizationalPresenceLink: string;",
      "organizationalPresenceLink: string;\n    organizationalIdentityLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-presence" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalPresenceLink}
        </Link>`,
      `<Link href="/app/executive/organizational-presence" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalPresenceLink}
        </Link>
        <Link href="/app/executive/organizational-identity" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalIdentityLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalIdentityLink")) {
    p = p.replace(
      'organizationalPresenceLink: t("customerApp.executive.organizationalPresenceLink"),',
      'organizationalPresenceLink: t("customerApp.executive.organizationalPresenceLink"),\n        organizationalIdentityLink: t("customerApp.executive.organizationalIdentityLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Identity Center\nRoute: ${P.route}\nCore: Organizations become stronger when they know who they are.\nHelpers: _oci_* · _ocibp356_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Organizations become stronger when they know who they are.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase354-vocabulary";',
      `export * from "./implementation-blueprint-phase354-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE354_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase354-aipify-organizational-presence-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE354_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase354-aipify-organizational-presence-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Identity Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_IDENTITY_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_IDENTITY_CENTER_ENGINE_PHASE${P.phase}.md) — Identity Center at Executive Center → Organizational Identity. Identity dashboard, purpose alignment engine, reviews, and executive view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_oci_*\`, \`_ocibp356_*\`. APIs at \`/api/organizational-identity/*\`. Cross-links presence and balance centers.`;
  if (!c.includes("Organizational Identity Center Engine (Phase 356)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

function patchPendingMigrations() {
  const file = "/tmp/aipify-pending-migrations.json";
  if (!fs.existsSync(file)) return;
  const list = JSON.parse(fs.readFileSync(file, "utf8"));
  const entry = {
    file: P.migration,
    version: "20261428400000",
    name: "aipify_organizational_identity_center_engine_phase356",
  };
  if (!list.some((item) => item.file === P.migration || item === P.migration)) {
    list.push(entry);
    fs.writeFileSync(file, `${JSON.stringify(list, null, 2)}\n`);
    console.log("appended pending migration");
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_IDENTITY_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Identity Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
patchPendingMigrations();
console.log(`Phase ${P.phase} complete`);
