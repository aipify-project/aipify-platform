#!/usr/bin/env node
/** ABOS Phase 351 — Aipify Organizational Wisdom Transfer Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 351,
  migration: "20261428000000_aipify_organizational_wisdom_transfer_center_engine_phase351.sql",
  slug: "aipify-organizational-wisdom-transfer-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_WISDOM_TRANSFER_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase351-aipify-organizational-wisdom-transfer-center.txt",
  route: "/app/executive/organizational-wisdom-transfer",
  permKeys: ["org_wisdom_transfer.view", "org_wisdom_transfer.manage", "org_wisdom_transfer.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Wisdom Transfer",
    subtitle:
      "Preserve, share, and transfer valuable experience, lessons, judgment, and institutional wisdom across generations of leadership and teams.",
    loading: "Loading Wisdom Transfer Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Wisdom transfer philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalHopeLink: "Organizational Hope →",
    dashboardTitle: "Wisdom transfer dashboard",
    signalsTitle: "Wisdom transfer engine",
    transferTitle: "Progress recognition engine",
    initiativesTitle: "Wisdom transfer initiatives",
    reviewsTitle: "Wisdom transfer reviews",
    timelineTitle: "Wisdom transfer timeline",
    milestonesTitle: "Wisdom transfer milestones",
    snapshotsTitle: "Wisdom transfer snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive wisdom transfer view",
    sessionsTitle: "Wisdom transfer sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleReflection: "Schedule reflection session",
    completeInitiative: "Complete initiative",
    generateReport: "Generate wisdom transfer report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export wisdom transfer snapshot",
    coordinateDiscussion: "Coordinate leadership discussion",
    archiveMilestone: "Archive wisdom transfer milestone",
    humansDecide:
      "Aipify supports stewardship — leaders retain judgment over what is shared; wisdom transfer respects consent, context, and human mentorship without hoarding knowledge or replacing relationships.",
    privacyNote: "Privacy",
    wisdomTransferScore: "Organizational wisdom transfer score",
    knowledgePreservation: "Knowledge preservation",
    domains: {
      leadership: "Leadership wisdom",
      workforce: "Workforce wisdom",
      operational: "Operational wisdom",
      strategic: "Strategic wisdom",
      customer: "Customer wisdom",
      institutional: "Institutional wisdom",
    },
    signalTypes: {
      knowledge_flow: "Knowledge flow",
      mentorship_strength: "Mentorship strength",
      institutional_memory: "Institutional memory",
      lessons_integrated: "Lessons integrated",
      judgment_preserved: "Judgment preserved",
    },
    signalTones: {
      positive: "Positive indicator",
      neutral: "Neutral indicator",
      attention: "Needs attention",
    },
    transferTypes: {
      lessons_learned: "Lessons learned",
      experience_shared: "Experience shared",
      judgment_documented: "Judgment documented",
      wisdom_preserved: "Wisdom preserved",
      knowledge_carried_forward: "Knowledge carried forward",
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
      wisdom_transfer_recommended: "Wisdom transfer recommended",
    },
    timelineTypes: {
      leadership_succession: "Leadership succession",
      knowledge_archive: "Knowledge archive",
      mentorship_practice: "Mentorship practice",
      strategic_lesson: "Strategic lesson",
      cultural_wisdom: "Cultural wisdom",
    },
    reviewTypes: {
      quarterly_wisdom_transfer: "Quarterly wisdom transfer review",
      leadership_reflection: "Leadership reflection session",
      knowledge_transfer_discussion: "Knowledge transfer discussion",
      annual_organizational_assessment: "Annual organizational assessment",
    },
    sessionTypes: {
      reflection_session: "Reflection session",
      knowledge_transfer_discussion: "Knowledge transfer discussion",
      mentorship_session: "Mentorship session",
    },
    metrics: {
      experienceSharing: "Experience sharing",
      judgmentTransfer: "Judgment transfer",
      institutionalMemory: "Institutional memory",
      learningIntegration: "Learning integration",
      wisdomStewardship: "Wisdom stewardship",
      mentorshipParticipation: "Mentorship participation",
      initiatives: "Initiatives in progress",
      reviews: "Reviews completed",
    },
    executiveFields: {
      leadershipStewardship: "Leadership stewardship indicators",
      institutionalMemoryStrength: "Institutional memory measures",
      knowledgeTransferTrends: "Knowledge transfer trends",
      successionReadiness: "Succession readiness perspectives",
    },
    settingsLink: "Organizational Wisdom Transfer",
    organizationalWisdomTransferLink: "Organizational Wisdom Transfer",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisatorisk visdomsoverføring", settingsLink: "Organisatorisk visdomsoverføring" }],
    ["sv", { ...i18nBlock(), title: "Organisatorisk visdomsöverföring", settingsLink: "Organisatorisk visdomsöverföring" }],
    ["da", { ...i18nBlock(), title: "Organisatorisk visdomsoverførsel", settingsLink: "Organisatorisk visdomsoverførsel" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalWisdomTransferCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalWisdomTransferCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalWisdomTransferLink = block.organizationalWisdomTransferLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_hope.view",', `"org_hope.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalWisdomTransferCenterEngine")) {
    c = c.replace(
      '| "organizationalHopeCenterEngine"',
      '| "organizationalWisdomTransferCenterEngine"\n  | "organizationalHopeCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalHopeCenterEngine", href: "/app/executive/organizational-hope", labelKey: "customerApp.nav.organizationalHopeCenterEngine" },',
      `{ id: "organizationalWisdomTransferCenterEngine", href: "/app/executive/organizational-wisdom-transfer", labelKey: "customerApp.nav.organizationalWisdomTransferCenterEngine" },
  { id: "organizationalHopeCenterEngine", href: "/app/executive/organizational-hope", labelKey: "customerApp.nav.organizationalHopeCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-hope")) return "organizationalHopeCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-wisdom-transfer")) return "organizationalWisdomTransferCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-hope")) return "organizationalHopeCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-wisdom-transfer-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalWisdomTransferLink")) {
    c = c.replace(
      "organizationalHopeLink: string;",
      "organizationalHopeLink: string;\n    organizationalWisdomTransferLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-hope" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalHopeLink}
        </Link>`,
      `<Link href="/app/executive/organizational-hope" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalHopeLink}
        </Link>
        <Link href="/app/executive/organizational-wisdom-transfer" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalWisdomTransferLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalWisdomTransferLink")) {
    p = p.replace(
      'organizationalHopeLink: t("customerApp.executive.organizationalHopeLink"),',
      'organizationalHopeLink: t("customerApp.executive.organizationalHopeLink"),\n        organizationalWisdomTransferLink: t("customerApp.executive.organizationalWisdomTransferLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Wisdom Transfer Center\nRoute: ${P.route}\nCore: Wisdom is lost when experience is not shared.\nHelpers: _ocwt_* · _ocwtbp351_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Wisdom is lost when experience is not shared.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase350-vocabulary";',
      `export * from "./implementation-blueprint-phase350-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE350_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase350-aipify-organizational-hope-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE350_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase350-aipify-organizational-hope-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Wisdom Transfer Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_WISDOM_TRANSFER_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_WISDOM_TRANSFER_CENTER_ENGINE_PHASE${P.phase}.md) — Wisdom Transfer Center at Executive Center → Organizational Wisdom Transfer. Wisdom transfer dashboard, progress recognition engine, reviews, and executive stewardship view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_ocwt_*\`, \`_ocwtbp351_*\`. APIs at \`/api/organizational-wisdom-transfer/*\`. Cross-links hope center.`;
  if (!c.includes("Organizational Wisdom Transfer Center Engine (Phase 351)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

function patchPendingMigrations() {
  const file = "/tmp/aipify-pending-migrations.json";
  const list = JSON.parse(fs.readFileSync(file, "utf8"));
  const entry = {
    file: P.migration,
    version: "20261428000000",
    name: "aipify_organizational_wisdom_transfer_center_engine_phase351",
  };
  if (!list.some((item) => item.file === P.migration || item === P.migration)) {
    list.push(entry);
    fs.writeFileSync(file, `${JSON.stringify(list, null, 2)}\n`);
    console.log("appended pending migration");
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_WISDOM_TRANSFER_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Wisdom Transfer Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
