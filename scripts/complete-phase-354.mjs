#!/usr/bin/env node
/** ABOS Phase 354 — Aipify Organizational Presence Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 354,
  migration: "20261428300000_aipify_organizational_presence_center_engine_phase354.sql",
  slug: "aipify-organizational-presence-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_PRESENCE_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase354-aipify-organizational-presence-center.txt",
  route: "/app/executive/organizational-presence",
  permKeys: ["org_presence.view", "org_presence.manage", "org_presence.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Presence",
    subtitle:
      "Cultivate intentional presence by improving attentiveness, engagement, responsiveness, and the quality of interactions between leaders, teams, customers, and stakeholders.",
    loading: "Loading Presence Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Presence philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalBalanceLink: "Organizational Balance →",
    dashboardTitle: "Presence dashboard",
    signalsTitle: "Presence engine",
    attentivenessTitle: "Attentiveness engine",
    initiativesTitle: "Presence initiatives",
    reviewsTitle: "Presence reviews",
    timelineTitle: "Presence timeline",
    milestonesTitle: "Presence milestones",
    snapshotsTitle: "Presence snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive presence view",
    sessionsTitle: "Presence sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleReflection: "Schedule reflection session",
    completeInitiative: "Complete initiative",
    generateReport: "Generate presence report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export presence snapshot",
    coordinateDiscussion: "Coordinate leadership discussion",
    archiveMilestone: "Archive presence milestone",
    humansDecide:
      "Aipify supports authentic engagement — leaders retain judgment; presence strengthens connection without constant availability, surveillance, or performative engagement.",
    privacyNote: "Privacy",
    presenceScore: "Organizational presence score",
    engagementIndicators: "Engagement indicators",
    domains: {
      leadership: "Leadership presence",
      team: "Team presence",
      customer: "Customer presence",
      strategic: "Strategic presence",
      cultural: "Cultural presence",
      community: "Community presence",
    },
    signalTypes: {
      strong_engagement_practices: "Strong engagement practices",
      meaningful_interactions: "Meaningful interactions",
      deeper_connection_opportunities: "Deeper connection opportunities",
      responsiveness_improvements: "Responsiveness improvements",
      reflection_participation: "Reflection participation",
    },
    signalTones: {
      positive: "Positive indicator",
      neutral: "Neutral indicator",
      attention: "Needs attention",
    },
    attentivenessTypes: {
      truly_listening: "Truly listening",
      customers_supported: "Customers supported",
      people_valued: "People valued",
      conversation_attention: "Conversation attention",
      engaging_intentionally: "Engaging intentionally",
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
      presence_reinforcement_recommended: "Presence reinforcement recommended",
    },
    timelineTypes: {
      recognition_milestone: "Recognition milestone",
      leadership_reflection: "Leadership reflection",
      customer_relationship_achievement: "Customer relationship achievement",
      communication_development: "Communication development",
      cultural_celebration: "Cultural celebration",
    },
    reviewTypes: {
      quarterly_presence: "Quarterly presence review",
      leadership_reflection: "Leadership reflection session",
      communication_assessment: "Communication assessment",
      annual_organizational_evaluation: "Annual organizational evaluation",
    },
    sessionTypes: {
      reflection_session: "Reflection session",
      communication_assessment: "Communication assessment",
      leadership_discussion: "Leadership discussion",
    },
    metrics: {
      engagementIndicators: "Engagement indicators",
      leadershipAttentiveness: "Leadership attentiveness",
      customerResponsiveness: "Customer responsiveness",
      communicationQuality: "Communication quality",
      leadershipParticipation: "Leadership participation",
      initiatives: "Initiatives in progress",
      reviews: "Reviews completed",
    },
    executiveFields: {
      leadershipEngagement: "Leadership engagement indicators",
      communicationEffectiveness: "Communication effectiveness trends",
      relationshipQuality: "Relationship quality measures",
      connectionOpportunities: "Organizational connection opportunities",
    },
    settingsLink: "Organizational Presence",
    organizationalPresenceLink: "Organizational Presence",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisatorisk tilstedeværelse", settingsLink: "Organisatorisk tilstedeværelse" }],
    ["sv", { ...i18nBlock(), title: "Organisatorisk närvaro", settingsLink: "Organisatorisk närvaro" }],
    ["da", { ...i18nBlock(), title: "Organisatorisk tilstedeværelse", settingsLink: "Organisatorisk tilstedeværelse" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalPresenceCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalPresenceCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalPresenceLink = block.organizationalPresenceLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_balance.view",', `"org_balance.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalPresenceCenterEngine")) {
    c = c.replace(
      '| "organizationalBalanceCenterEngine"',
      '| "organizationalPresenceCenterEngine"\n  | "organizationalBalanceCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalBalanceCenterEngine", href: "/app/executive/organizational-balance", labelKey: "customerApp.nav.organizationalBalanceCenterEngine" },',
      `{ id: "organizationalPresenceCenterEngine", href: "/app/executive/organizational-presence", labelKey: "customerApp.nav.organizationalPresenceCenterEngine" },
  { id: "organizationalBalanceCenterEngine", href: "/app/executive/organizational-balance", labelKey: "customerApp.nav.organizationalBalanceCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-balance")) return "organizationalBalanceCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-presence")) return "organizationalPresenceCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-balance")) return "organizationalBalanceCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-presence-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalPresenceLink")) {
    c = c.replace(
      "organizationalBalanceLink: string;",
      "organizationalBalanceLink: string;\n    organizationalPresenceLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-balance" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalBalanceLink}
        </Link>`,
      `<Link href="/app/executive/organizational-balance" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalBalanceLink}
        </Link>
        <Link href="/app/executive/organizational-presence" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalPresenceLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalPresenceLink")) {
    p = p.replace(
      'organizationalBalanceLink: t("customerApp.executive.organizationalBalanceLink"),',
      'organizationalBalanceLink: t("customerApp.executive.organizationalBalanceLink"),\n        organizationalPresenceLink: t("customerApp.executive.organizationalPresenceLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Presence Center\nRoute: ${P.route}\nCore: People remember how organizations made them feel.\nHelpers: _ocp_* · _ocpbp354_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "People remember how organizations made them feel.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase353-vocabulary";',
      `export * from "./implementation-blueprint-phase353-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE353_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase353-aipify-organizational-balance-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE353_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase353-aipify-organizational-balance-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Presence Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_PRESENCE_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_PRESENCE_CENTER_ENGINE_PHASE${P.phase}.md) — Presence Center at Executive Center → Organizational Presence. Presence dashboard, attentiveness engine, reviews, and executive view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_ocp_*\`, \`_ocpbp354_*\`. APIs at \`/api/organizational-presence/*\`. Cross-links balance center.`;
  if (!c.includes("Organizational Presence Center Engine (Phase 354)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

function patchPendingMigrations() {
  const file = "/tmp/aipify-pending-migrations.json";
  const list = JSON.parse(fs.readFileSync(file, "utf8"));
  const entry = {
    file: P.migration,
    version: "20261428300000",
    name: "aipify_organizational_presence_center_engine_phase354",
  };
  if (!list.some((item) => item.file === P.migration || item === P.migration)) {
    list.push(entry);
    fs.writeFileSync(file, `${JSON.stringify(list, null, 2)}\n`);
    console.log("appended pending migration");
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_PRESENCE_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Presence Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
