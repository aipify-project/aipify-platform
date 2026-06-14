#!/usr/bin/env node
/** ABOS Phase 345 — Aipify Organizational Intentionality Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = {
  phase: 345,
  migration: "20261427400000_aipify_organizational_intentionality_center_engine_phase345.sql",
  slug: "aipify-organizational-intentionality-center-engine",
  docSlug: "AIPIFY_ORGANIZATIONAL_INTENTIONALITY_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase345-aipify-organizational-intentionality-center.txt",
  route: "/app/executive/organizational-intentionality",
  permKeys: ["org_intentionality.view", "org_intentionality.manage", "org_intentionality.contribute"],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function i18nBlock() {
  return {
    title: "Organizational Intentionality",
    subtitle:
      "Operate with greater intentionality by ensuring decisions, initiatives, behaviors, investments, and priorities align with purpose, strategy, and long-term aspirations.",
    loading: "Loading Intentionality Center…",
    corePrinciple: "Core principle",
    philosophyTitle: "Intentionality philosophy",
    visionTitle: "Vision",
    executiveLink: "Executive Center →",
    organizationalClarityLink: "Organizational Clarity →",
    dashboardTitle: "Intentionality dashboard",
    signalsTitle: "Intentionality engine",
    purposeTitle: "Purpose check engine",
    initiativesTitle: "Intentionality initiatives",
    reviewsTitle: "Intentionality reviews",
    timelineTitle: "Intentionality timeline",
    milestonesTitle: "Intentionality milestones",
    snapshotsTitle: "Alignment snapshots",
    insightsTitle: "Aipify insights",
    recommendationsTitle: "Aipify recommendations",
    executiveTitle: "Executive intentionality view",
    sessionsTitle: "Intentionality sessions",
    emptySection: "No items in this section yet.",
    dismiss: "Dismiss",
    accept: "Accept",
    completeReview: "Complete review",
    completeSession: "Complete session",
    scheduleReflection: "Schedule reflection session",
    completeInitiative: "Complete initiative",
    generateReport: "Generate intentionality report",
    printSummary: "Print executive summary",
    exportSnapshot: "Export alignment snapshot",
    coordinateReview: "Coordinate leadership discussion",
    archiveMilestone: "Archive intentionality milestone",
    humansDecide:
      "Aipify supports conscious leadership — leaders retain judgment; intentionality encourages awareness without over-planning, perfectionism, or decision paralysis.",
    privacyNote: "Privacy",
    intentionalityScore: "Organizational intentionality score",
    priorityAlignment: "Priority alignment",
    domains: {
      strategic: "Strategic intentionality",
      leadership: "Leadership intentionality",
      operational: "Operational intentionality",
      customer: "Customer intentionality",
      cultural: "Cultural intentionality",
      innovation: "Innovation intentionality",
    },
    signalTypes: {
      misaligned_initiative: "Misaligned initiative",
      reactive_decision: "Reactive decision pattern",
      resource_fragmentation: "Resource fragmentation",
      opportunity_dilution: "Opportunity dilution",
      priority_inconsistency: "Priority inconsistency",
    },
    signalTones: {
      positive: "Positive indicator",
      neutral: "Neutral indicator",
      attention: "Needs attention",
    },
    purposeTypes: {
      why_initiative: "Why this initiative",
      mission_alignment: "Mission alignment",
      investment_priority: "Investment priority",
      trade_off_acceptance: "Trade-off acceptance",
      intentional_vs_reactive: "Intentional vs reactive",
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
      reactive: "Reactive",
    },
    timelineTypes: {
      strategic_decision: "Strategic decision",
      reflection_milestone: "Reflection milestone",
      priority_shift: "Priority shift",
      resource_allocation_change: "Resource allocation change",
      leadership_initiative: "Leadership initiative",
    },
    reviewTypes: {
      quarterly_intentionality: "Quarterly intentionality review",
      annual_strategic_reflection: "Annual strategic reflection",
      leadership_stewardship: "Leadership stewardship discussion",
      resource_allocation_assessment: "Resource allocation assessment",
    },
    sessionTypes: {
      reflection_session: "Reflection session",
      leadership_discussion: "Leadership discussion",
      stewardship_assessment: "Stewardship assessment",
    },
    metrics: {
      strategicConsistency: "Strategic consistency",
      valuesAlignment: "Values alignment",
      leadershipReflection: "Leadership reflection participation",
      resourceAllocation: "Resource allocation effectiveness",
      purposeIntegration: "Purpose integration",
      strategicDiscipline: "Strategic discipline",
      initiatives: "Initiatives in progress",
      reviews: "Reviews completed",
    },
    executiveFields: {
      strategicDiscipline: "Strategic discipline indicators",
      purposeAlignment: "Purpose alignment measures",
      leadershipReflection: "Leadership reflection trends",
      opportunityPrioritization: "Opportunity prioritization insights",
    },
    settingsLink: "Organizational Intentionality",
    organizationalIntentionalityLink: "Organizational Intentionality",
  };
}

function patchI18n() {
  for (const [locale, block] of [
    ["en", i18nBlock()],
    ["no", { ...i18nBlock(), title: "Organisatorisk intensjon", settingsLink: "Organisatorisk intensjon" }],
    ["sv", { ...i18nBlock(), title: "Organisatorisk intention", settingsLink: "Organisatorisk intention" }],
    ["da", { ...i18nBlock(), title: "Organisatorisk intention", settingsLink: "Organisatorisk intention" }],
  ]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.organizationalIntentionalityCenter = block;
    data.nav = data.nav ?? {};
    data.nav.organizationalIntentionalityCenterEngine = block.settingsLink;
    data.executive = data.executive ?? {};
    data.executive.organizationalIntentionalityLink = block.organizationalIntentionalityLink;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of P.permKeys) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"org_clarity.view",', `"org_clarity.view",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchNav() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("organizationalIntentionalityCenterEngine")) {
    c = c.replace(
      '| "organizationalClarityCenterEngine"',
      '| "organizationalIntentionalityCenterEngine"\n  | "organizationalClarityCenterEngine"',
    );
    c = c.replace(
      '{ id: "organizationalClarityCenterEngine", href: "/app/executive/organizational-clarity", labelKey: "customerApp.nav.organizationalClarityCenterEngine" },',
      `{ id: "organizationalIntentionalityCenterEngine", href: "/app/executive/organizational-intentionality", labelKey: "customerApp.nav.organizationalIntentionalityCenterEngine" },
  { id: "organizationalClarityCenterEngine", href: "/app/executive/organizational-clarity", labelKey: "customerApp.nav.organizationalClarityCenterEngine" },`,
    );
    c = c.replace(
      'if (pathname.startsWith("/app/executive/organizational-clarity")) return "organizationalClarityCenterEngine";',
      'if (pathname.startsWith("/app/executive/organizational-intentionality")) return "organizationalIntentionalityCenterEngine";\n  if (pathname.startsWith("/app/executive/organizational-clarity")) return "organizationalClarityCenterEngine";',
    );
    fs.writeFileSync(file, c);
    console.log("patched nav");
  }
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  const line = 'export * from "./aipify-organizational-intentionality-center-engine";';
  if (!fs.readFileSync(file, "utf8").includes(line)) {
    fs.writeFileSync(file, `${fs.readFileSync(file, "utf8").trim()}\n${line}\n`);
  }
}

function patchExecutiveDashboard() {
  const panel = path.join(ROOT, "components/app/executive/ExecutiveDashboardPanel.tsx");
  let c = fs.readFileSync(panel, "utf8");
  if (!c.includes("organizationalIntentionalityLink")) {
    c = c.replace(
      "organizationalClarityLink: string;",
      "organizationalClarityLink: string;\n    organizationalIntentionalityLink: string;",
    );
    c = c.replace(
      `<Link href="/app/executive/organizational-clarity" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalClarityLink}
        </Link>`,
      `<Link href="/app/executive/organizational-clarity" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalClarityLink}
        </Link>
        <Link href="/app/executive/organizational-intentionality" className="ml-4 mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.organizationalIntentionalityLink}
        </Link>`,
    );
    fs.writeFileSync(panel, c);
    console.log("patched executive dashboard panel");
  }

  const page = path.join(ROOT, "app/app/executive/page.tsx");
  let p = fs.readFileSync(page, "utf8");
  if (!p.includes("organizationalIntentionalityLink")) {
    p = p.replace(
      'organizationalClarityLink: t("customerApp.executive.organizationalClarityLink"),',
      'organizationalClarityLink: t("customerApp.executive.organizationalClarityLink"),\n        organizationalIntentionalityLink: t("customerApp.executive.organizationalIntentionalityLink"),',
    );
    fs.writeFileSync(page, p);
    console.log("patched executive page");
  }
}

function patchIlm() {
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Organizational Intentionality Center\nRoute: ${P.route}\nCore: Organizations drift when they stop acting intentionally.\nHelpers: _oic_* · _oicbp345_*\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "${P.route}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORE_PRINCIPLE = "Organizations drift when they stop acting intentionally.";\n`,
  );
  const index = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(index, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase344-vocabulary";',
      `export * from "./implementation-blueprint-phase344-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE344_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase344-aipify-organizational-clarity-center.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE344_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase344-aipify-organizational-clarity-center.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(index, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Organizational Intentionality Center Engine (Phase ${P.phase}):** See [AIPIFY_ORGANIZATIONAL_INTENTIONALITY_CENTER_ENGINE_PHASE${P.phase}.md](./AIPIFY_ORGANIZATIONAL_INTENTIONALITY_CENTER_ENGINE_PHASE${P.phase}.md) — Intentionality Center at Executive Center → Organizational Intentionality. Intentionality dashboard, intentionality engine, purpose check engine, reviews, and executive intentionality view. \`${P.route}\`, migration \`${P.migration}\`. Helpers \`_oic_*\`, \`_oicbp345_*\`. APIs at \`/api/organizational-intentionality/*\`. Cross-links clarity and steadfastness centers.`;
  if (!c.includes("Organizational Intentionality Center Engine (Phase 345)")) {
    fs.writeFileSync(file, `${c}\n${entry}\n`);
  }
}

function patchPendingMigrations() {
  const file = "/tmp/aipify-pending-migrations.json";
  const list = JSON.parse(fs.readFileSync(file, "utf8"));
  const entry = {
    file: P.migration,
    version: "20261427400000",
    name: "aipify_organizational_intentionality_center_engine_phase345",
  };
  if (!list.some((item) => item.file === P.migration || item === P.migration)) {
    list.push(entry);
    fs.writeFileSync(file, `${JSON.stringify(list, null, 2)}\n`);
    console.log("appended pending migration");
  }
}

write(
  path.join(ROOT, `AIPIFY_ORGANIZATIONAL_INTENTIONALITY_CENTER_ENGINE_PHASE${P.phase}.md`),
  `# Aipify Organizational Intentionality Center Engine — Phase ${P.phase}\n\nRoute: \`${P.route}\`\n`,
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
