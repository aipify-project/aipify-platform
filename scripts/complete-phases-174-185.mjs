#!/usr/bin/env node
/**
 * Complete ABOS Phases 174–185: fix 179–182 naming, generate 183–185, patch nav/permissions/i18n.
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function fixDoubleEngine(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) fixDoubleEngine(p);
    else if (/\.(tsx?|md)$/.test(entry.name)) {
      const c = fs.readFileSync(p, "utf8");
      if (c.includes("EngineEngine")) {
        fs.writeFileSync(p, c.split("EngineEngine").join("Engine"));
        console.log("fixed EngineEngine in", path.relative(ROOT, p));
      }
    }
  }
}

const PHASES_183_185 = [
  {
    phase: 183,
    migration: "20261343000000_humanity_shared_purpose_contribution_engine_phase183.sql",
    slug: "shared-purpose-contribution-engine",
    base: "SharedPurposeContribution",
    camel: "sharedPurposeContributionEngine",
    snake: "humanity_shared_purpose_contribution",
    permPrefix: "shared_purpose_contribution",
    helper: "hspc",
    bp: "hspcbp183",
    decisionType: "humanity_shared_purpose_contribution_engine",
    title: "Humanity's Shared Purpose & Contribution",
    centerTitle: "Shared Purpose & Contribution Center",
    companion: "Contribution Companion",
    scoreKey: "shared_purpose_contribution_score",
    modeKey: "contribution_mode",
    levelKey: "purpose_readiness_level",
    thirdEntity: "contribution_notes",
    reflectionsKey: "purpose_reflections",
    era: "Universal Stewardship & Shared Futures Era (181–190)",
    eraRange: "181–190",
    prevDecision: "humanity_collective_wisdom_shared_learning_engine",
    docSlug: "HUMANITY_SHARED_PURPOSE_CONTRIBUTION_ENGINE",
    ilmFile: "implementation-blueprint-phase183-shared-purpose-contribution.txt",
    navLabel: "Shared Purpose",
    faqExtra:
      "Contribution Companion supports purpose reflection — does NOT assign worth, dictate contribution, or replace leadership accountability.",
    crossLinkNote:
      "Cross-links only: purpose_values_engine, Phase 182 collective wisdom, social_impact — never duplicate RPCs.",
  },
  {
    phase: 184,
    migration: "20261344000000_humanity_shared_resilience_adaptive_capacity_engine_phase184.sql",
    slug: "shared-resilience-adaptive-capacity-engine",
    base: "SharedResilienceAdaptiveCapacity",
    camel: "sharedResilienceAdaptiveCapacityEngine",
    snake: "humanity_shared_resilience_adaptive_capacity",
    permPrefix: "shared_resilience_adaptive",
    helper: "hsrac",
    bp: "hsracbp184",
    decisionType: "humanity_shared_resilience_adaptive_capacity_engine",
    title: "Humanity's Shared Resilience & Adaptive Capacity",
    centerTitle: "Shared Resilience & Adaptive Capacity Center",
    companion: "Resilience Companion",
    scoreKey: "shared_resilience_adaptive_score",
    modeKey: "resilience_mode",
    levelKey: "adaptive_readiness_level",
    thirdEntity: "resilience_notes",
    reflectionsKey: "resilience_reflections",
    era: "Universal Stewardship & Shared Futures Era (181–190)",
    eraRange: "181–190",
    prevDecision: "humanity_shared_purpose_contribution_engine",
    docSlug: "HUMANITY_SHARED_RESILIENCE_ADAPTIVE_CAPACITY_ENGINE",
    ilmFile: "implementation-blueprint-phase184-shared-resilience-adaptive-capacity.txt",
    navLabel: "Shared Resilience",
    faqExtra:
      "Resilience Companion supports adaptive reflection — does NOT predict crises, force optimism, or override human agency.",
    crossLinkNote:
      "Cross-links only: organizational_resilience_engine, Phase 183 shared purpose, continuity_engine — never duplicate RPCs.",
  },
  {
    phase: 185,
    migration: "20261345000000_humanity_shared_trust_cooperative_intelligence_engine_phase185.sql",
    slug: "shared-trust-cooperative-intelligence-engine",
    base: "SharedTrustCooperativeIntelligence",
    camel: "sharedTrustCooperativeIntelligenceEngine",
    snake: "humanity_shared_trust_cooperative_intelligence",
    permPrefix: "shared_trust_cooperative",
    helper: "hstci",
    bp: "hstcibp185",
    decisionType: "humanity_shared_trust_cooperative_intelligence_engine",
    title: "Humanity's Shared Trust & Cooperative Intelligence",
    centerTitle: "Cooperative Intelligence Center",
    companion: "Cooperation Companion",
    scoreKey: "shared_trust_cooperative_score",
    modeKey: "cooperation_mode",
    levelKey: "trust_readiness_level",
    thirdEntity: "cooperation_notes",
    reflectionsKey: "trust_reflections",
    era: "Universal Stewardship & Shared Futures Era (181–190)",
    eraRange: "181–190",
    prevDecision: "humanity_shared_resilience_adaptive_capacity_engine",
    docSlug: "HUMANITY_SHARED_TRUST_COOPERATIVE_INTELLIGENCE_ENGINE",
    ilmFile: "implementation-blueprint-phase185-shared-trust-cooperative-intelligence.txt",
    navLabel: "Cooperative Trust",
    faqExtra:
      "Cooperation Companion supports cooperation — does NOT force consensus, override autonomy, or replace relationships.",
    crossLinkNote:
      "Cross-links only: trust_reputation_engine, Phase 184 shared resilience, social_cohesion_engine, civilizational trust surfaces — never duplicate RPCs.",
    ilmExtra: `
Cooperative Intelligence Center: trust reflection programs, cross-org learning networks, companion facilitation, leadership collaboration workshops, Growth Partner development, collective insight dashboards, knowledge exchange frameworks, trust knowledge libraries.
Cooperative Intelligence Engine prompts: collaborate effectively?, trust barriers?, transparency?, partnerships?, balance autonomy/cooperation?
Trust Framework: leadership integrity, knowledge sharing, Growth Partner relationships, cross-functional collaboration, recognition, community engagement, transparency.
Executive Cooperation Reviews, Cooperation Companion, Trust Development Engine, Collective Problem-Solving Engine.
Companion limitations: no forcing consensus, no overriding autonomy, no determining priorities, no suppressing disagreement, no replacing relationships.
Self Love in cooperation: compassion, humility, patience, respect, recognition, generosity.`,
    faq185: `## What is the Cooperative Intelligence Center?

The Cooperative Intelligence Center at \`/app/shared-trust-cooperative-intelligence-engine\` supports trust reflection programs, cross-org learning networks, companion facilitation, leadership collaboration workshops, Growth Partner development, collective insight dashboards, knowledge exchange frameworks, and trust knowledge libraries.

## Does the Cooperation Companion replace relationships?

**No.** The Cooperation Companion supports cooperation — it does NOT force consensus, override autonomy, determine priorities, suppress disagreement, or replace relationships.

## What is the Trust Framework?

Leadership integrity, knowledge sharing, Growth Partner relationships, cross-functional collaboration, recognition, community engagement, and transparency — metadata scaffolds only.

## How does Self Love connect to cooperation?

Compassion, humility, patience, respect, recognition, and generosity — cooperation as stewardship, not surveillance or forced alignment.

## What surfaces cross-link only?

trust_reputation_engine, Phase 184 shared resilience, social_cohesion_engine, and civilizational trust surfaces — never duplicate RPCs.`,
  },
];

function transformHope(content, p) {
  const engine = `${p.base}Engine`;
  const pairs = [
    ["HumanHopePossibility", p.base],
    ["human-hope-possibility-engine", p.slug],
    ["human_hope_possibility", p.snake],
    ["humanHopePossibility", p.camel.replace(/Engine$/, "")],
    ["humanHopePossibilityEngine", p.camel],
    ["hhcpbp178", p.bp],
    ["_hhcp_", `_${p.helper}_`],
    ["human_hope_possibility_score", p.scoreKey],
    ["hope_mode", p.modeKey],
    ["hope_readiness_level", p.levelKey],
    ["hope_reflections", p.reflectionsKey],
    ["possibility_notes", p.thirdEntity],
    ["PossibilityNote", p.thirdEntity.split("_").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("")],
    ["possibility_notes_count", `${p.thirdEntity}_count`],
    ["Collective Possibility Center", p.centerTitle],
    ["Collective Possibility", p.centerTitle.replace(" Center", "")],
    ["Hope Companion", p.companion],
    ["Human Hope & Collective Possibility", p.title],
    ["Phase 178", `Phase ${p.phase}`],
    ["171–178", p.eraRange.includes("181") ? `181–${p.phase}` : `171–${p.phase}`],
    ["Era 171–178", p.eraRange.includes("181") ? "Era 181–190" : `Era 171–${p.phase}`],
    ["human_hope_possibility_engine", p.decisionType],
    ["human_hope_possibility.view", `${p.permPrefix}.view`],
    ["human_hope_possibility.manage", `${p.permPrefix}.manage`],
    ["human_hope_possibility.steward", `${p.permPrefix}.steward`],
    ["20261338000000_human_hope_collective_possibility_engine_phase178.sql", p.migration],
    ["Cosmic Stewardship & Multi-Generational Futures Era (171–180)", p.era],
    ["Human Hope & Collective Possibility Phase 178", `${p.title} Phase ${p.phase}`],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function genCore(p) {
  const engine = `${p.base}Engine`;
  write(
    path.join(ROOT, `lib/core/${p.slug}.ts`),
    `/**
 * ${p.title} Engine helpers (Phase ${p.phase}).
 * Authoritative enforcement lives in Supabase RPCs (_${p.helper}_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function get${engine}Dashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_${p.snake}_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function get${engine}Card(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_${p.snake}_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function create${engine}AuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
`,
  );
}

function genTsStack(p) {
  const engine = `${p.base}Engine`;
  const srcDir = path.join(ROOT, "lib/aipify/human-hope-possibility-engine");
  const dstDir = path.join(ROOT, `lib/aipify/${p.slug}`);
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dstDir, f), transformHope(fs.readFileSync(path.join(srcDir, f), "utf8"), p));
  }

  const panelSrc = path.join(
    ROOT,
    "components/app/human-hope-possibility-engine/HumanHopePossibilityEngineDashboardPanel.tsx",
  );
  write(
    path.join(ROOT, `components/app/${p.slug}/${engine}DashboardPanel.tsx`),
    transformHope(fs.readFileSync(panelSrc, "utf8"), p),
  );
  write(
    path.join(ROOT, `components/app/${p.slug}/index.ts`),
    `export { ${engine}DashboardPanel } from "./${engine}DashboardPanel";\n`,
  );

  const pageSrc = fs.readFileSync(path.join(ROOT, "app/app/human-hope-possibility-engine/page.tsx"), "utf8");
  write(path.join(ROOT, `app/app/${p.slug}/page.tsx`), transformHope(pageSrc, p));

  for (const route of ["dashboard", "card"]) {
    const apiSrc = fs.readFileSync(
      path.join(ROOT, `app/api/aipify/human-hope-possibility-engine/${route}/route.ts`),
      "utf8",
    );
    write(path.join(ROOT, `app/api/aipify/${p.slug}/${route}/route.ts`), transformHope(apiSrc, p));
  }
}

function genMigration(p) {
  let m = transformHope(
    fs.readFileSync(
      path.join(ROOT, "supabase/migrations/20261342000000_humanity_collective_wisdom_shared_learning_engine_phase182.sql"),
      "utf8",
    ),
    p,
  );
  m = m.replace(`'${p.prevDecision}'`, `'${p.prevDecision}',\n    '${p.decisionType}'`);
  m = m.replace(/Cross-link civilizational_learning_engine, Phase 181 universal stewardship/g, p.crossLinkNote);
  if (p.phase === 185) {
    m = m.replace(/civilizational_learning_engine/g, "trust_reputation_engine");
  }
  write(path.join(ROOT, `supabase/migrations/${p.migration}`), m);
}

function genDocs(p) {
  write(
    path.join(ROOT, `${p.docSlug}_PHASE${p.phase}.md`),
    `# ${p.title} Engine — Phase ${p.phase}

## Vision

${p.centerTitle} within the ${p.era}. ${p.companion} supports — does NOT replace human judgment, responsibility, or dignity.

## Permissions

- \`${p.permPrefix}.view\` · \`${p.permPrefix}.manage\` · \`${p.permPrefix}.steward\`

## Helpers

- Engine: \`_${p.helper}_*\` · Blueprint: \`_${p.bp}_*\`
`,
  );

  write(
    path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${p.phase}_${p.docSlug}.md`),
    `# Implementation Blueprint — Phase ${p.phase} ${p.title}

Route: \`/app/${p.slug}\`
Era: ${p.era}
${p.crossLinkNote}
`,
  );

  const faqBody =
    p.faq185 ??
    `## What is the ${p.centerTitle}?

The ${p.centerTitle} at \`/app/${p.slug}\` is part of the **${p.era}**. ${p.companion} supports reflection and metadata scaffolds.

## Does ${p.companion} decide for humans?

**No.** Humans retain final accountability.

## Permissions

\`${p.permPrefix}.view\` · \`${p.permPrefix}.manage\` · \`${p.permPrefix}.steward\`

## Growth Partner terminology?

**Yes.** Growth Partner — never Affiliate.

## ${p.faqExtra.split("—")[0]}?

${p.faqExtra}`;

  write(
    path.join(ROOT, `content/knowledge/aipify/${p.slug}/faq/implementation-blueprint-phase${p.phase}-faq.md`),
    `# ${p.title} Engine — FAQ (Phase ${p.phase})\n\n${faqBody}\n`,
  );

  const ilmBody = `ABOS Phase ${p.phase} — ${p.title}
Route: /app/${p.slug}
Era: ${p.era}
${p.centerTitle}: metadata scaffolds for stewardship programs, companion-supported reflection, executive reviews.
${p.companion} supports — NOT replace human judgment.
${p.crossLinkNote}
People First. Wisdom before speed. Growth Partner — never Affiliate.
${p.ilmExtra ?? ""}`;

  write(path.join(ROOT, `aipify-core/knowledge/internal-language-model/${p.ilmFile}`), ilmBody);

  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${p.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${p.phase}_MISSION =
  "${p.centerTitle} — ${p.companion} supports; humans decide.";

export const IMPLEMENTATION_BLUEPRINT_PHASE${p.phase}_PHILOSOPHY =
  "People First. Wisdom before speed. Growth Partner terminology — never Affiliate.";

export const IMPLEMENTATION_BLUEPRINT_PHASE${p.phase}_ROUTE = "/app/${p.slug}";

export const IMPLEMENTATION_BLUEPRINT_PHASE${p.phase}_COMPANION_LIMITATIONS = [
  "replace_human_judgment",
  "force_consensus",
  "override_autonomy",
  "suppress_disagreement",
  "replace_relationships",
] as const;
`,
  );
}

function hopeI18nBlock(e) {
  return {
    title: e.centerTitle,
    subtitle: `${e.era} — ${e.companion.toLowerCase()} supports reflection and metadata scaffolds. Supports humans — does NOT replace judgment or leadership accountability. Growth Partner — never Affiliate.`,
    loading: `Loading ${e.title} dashboard…`,
    engineTitle: `${e.title} Engine (Phase ${e.phase})`,
    scoreLabel: "Engagement score",
    modeLabel: "Mode",
    readinessLabel: "Readiness level",
    executiveReviews: "Executive reviews",
    activeReflections: "Active reflections",
    humanOversightRequired: `Human oversight required — humans decide; ${e.companion} supports only`,
    eraOpenerSummary: `Universal Stewardship Era — Phases ${e.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate era engine RPCs.",
    centerLabel: `${e.centerTitle} capabilities`,
    engineLabel: `${e.companion.replace(" Companion", "")} engine — reflection prompts`,
    frameworkLabel: "Stewardship framework",
    reviewsLabel: "Executive reviews",
    companionLabel: `${e.companion} — supports, does not replace`,
    subEngineLabel: "Supporting engine",
    reflections: "Reflection scaffolds",
    executiveReviewEntries: "Executive review entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${e.phase})`,
    companionLimitations: `${e.companion} limitations — does NOT replace human judgment`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${e.phase}`]: {
      mission: `${e.companion} supports stewardship and reflection — humans retain accountability.`,
      philosophy: "People First. Wisdom before speed. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
    },
  };
}

function creativityI18nBlock() {
  return {
    title: "Creativity & Imagination Center",
    subtitle:
      "Cosmic Stewardship & Multi-Generational Futures Era (171–180) — creativity companion supports imagination. Humans decide — Companion does not replace judgment. Growth Partner — never Affiliate.",
    loading: "Loading Human Creativity & Imagination dashboard…",
    engineTitle: "Human Creativity & Imagination Amplification Engine (Phase 174)",
    humanCreativityImaginationScore: "Engagement score",
    distinctionNote: "Support only — not replacement of human creativity or responsibility.",
    discoveryMode: "Imagination mode",
    meaningReadinessLevel: "Creative safety level",
    executiveReviews: "Executive reviews",
    activeReflections: "Active reflections",
    humanOversightRequired: "Human oversight required — Creativity Companion supports only",
    eraOpenerSummary: "Cosmic Stewardship Era — Phases 171–174",
    eraOpenerNote: "Cross-link only — do not duplicate era engine RPCs.",
    centerCapabilities: "Creativity & Imagination Center capabilities",
    reflectionEngine: "Imagination engine",
    responsibleFramework: "Creative safety framework",
    executive_reviews: "Executive reviews",
    companionCapabilities: "Creativity Companion capabilities",
    supportingEngine: "Experimentation engine",
    oversightEngine: "Collective creativity engine",
    reflectionScaffolds: "Imagination reflections",
    executiveReviewEntries: "Executive review entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only",
    blueprintObjectives: "Blueprint objectives (Phase 174)",
    companionLimitations: "Creativity Companion limitations",
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    phase174: {
      mission: "Creativity Companion supports — humans decide.",
      philosophy: "People First. Wisdom before speed.",
      growthPartnerNotAffiliate: "Growth Partner — never Affiliate.",
    },
  };
}

function patchNavConfig() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");

  const navIds = [
    "humanWonderExplorationEngine",
    "humanLegacyEternalStewardshipEngine",
    "universalStewardshipSharedFuturesEngine",
    "collectiveWisdomSharedLearningEngine",
    "sharedPurposeContributionEngine",
    "sharedResilienceAdaptiveCapacityEngine",
    "sharedTrustCooperativeIntelligenceEngine",
  ];

  for (const id of navIds) {
    if (!c.includes(`"${id}"`)) {
      c = c.replace(
        '| "humanHopePossibilityEngine"',
        `| "humanHopePossibilityEngine"\n  | "${id}"`,
      );
    }
  }

  const navItems = [
    { id: "humanWonderExplorationEngine", href: "/app/human-wonder-exploration-engine", label: "Wonder & Exploration" },
    { id: "humanLegacyEternalStewardshipEngine", href: "/app/human-legacy-eternal-stewardship-engine", label: "Legacy Stewardship" },
    { id: "universalStewardshipSharedFuturesEngine", href: "/app/universal-stewardship-shared-futures-engine", label: "Universal Stewardship" },
    { id: "collectiveWisdomSharedLearningEngine", href: "/app/collective-wisdom-shared-learning-engine", label: "Collective Wisdom" },
    { id: "sharedPurposeContributionEngine", href: "/app/shared-purpose-contribution-engine", label: "Shared Purpose" },
    { id: "sharedResilienceAdaptiveCapacityEngine", href: "/app/shared-resilience-adaptive-capacity-engine", label: "Shared Resilience" },
    { id: "sharedTrustCooperativeIntelligenceEngine", href: "/app/shared-trust-cooperative-intelligence-engine", label: "Cooperative Trust" },
  ];

  if (!c.includes("human-wonder-exploration-engine")) {
    const insert = navItems
      .map(
        (n) =>
          `  {\n    id: "${n.id}",\n    href: "${n.href}",\n    labelKey: "customerApp.nav.${n.id}",\n  },`,
      )
      .join("\n");
    c = c.replace(
      /id: "humanHopePossibilityEngine",[\s\S]*?labelKey: "customerApp\.nav\.humanHopePossibilityEngine",\n  },/,
      (m) => `${m}\n${insert}`,
    );
  }

  const pathResolvers = [
    ["human-wonder-exploration-engine", "humanWonderExplorationEngine"],
    ["human-legacy-eternal-stewardship-engine", "humanLegacyEternalStewardshipEngine"],
    ["universal-stewardship-shared-futures-engine", "universalStewardshipSharedFuturesEngine"],
    ["collective-wisdom-shared-learning-engine", "collectiveWisdomSharedLearningEngine"],
    ["shared-purpose-contribution-engine", "sharedPurposeContributionEngine"],
    ["shared-resilience-adaptive-capacity-engine", "sharedResilienceAdaptiveCapacityEngine"],
    ["shared-trust-cooperative-intelligence-engine", "sharedTrustCooperativeIntelligenceEngine"],
  ];

  for (const [route, id] of pathResolvers) {
    if (!c.includes(`/app/${route}`)) {
      c = c.replace(
        'if (pathname.startsWith("/app/human-hope-possibility-engine")) {\n    return "humanHopePossibilityEngine";\n  }',
        `if (pathname.startsWith("/app/human-hope-possibility-engine")) {\n    return "humanHopePossibilityEngine";\n  }\n  if (pathname.startsWith("/app/${route}")) {\n    return "${id}";\n  }`,
      );
    }
  }

  fs.writeFileSync(file, c);
  console.log("patched nav-config");
}

function patchPermissions() {
  const file = path.join(ROOT, "lib/core/permissions.ts");
  let c = fs.readFileSync(file, "utf8");

  const perms = [
    ["human_wonder_exploration", 179],
    ["human_legacy_stewardship", 180],
    ["universal_stewardship_futures", 181],
    ["collective_wisdom_learning", 182],
    ["shared_purpose_contribution", 183],
    ["shared_resilience_adaptive", 184],
    ["shared_trust_cooperative", 185],
  ];

  for (const [prefix] of perms) {
    const block = `"${prefix}.view",\n  "${prefix}.manage",\n  "${prefix}.steward",`;
    if (!c.includes(`${prefix}.view`)) {
      c = c.replace('"human_hope_possibility.steward",', `"human_hope_possibility.steward",\n  ${block}`);
    }
    const viewOnly = `"${prefix}.view",`;
    if (!c.includes(viewOnly) || c.indexOf(viewOnly) === c.lastIndexOf(viewOnly)) {
      c = c.replace('"human_hope_possibility.view",', `"human_hope_possibility.view",\n    ${viewOnly}`);
    }
  }

  fs.writeFileSync(file, c);
  console.log("patched permissions");
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  let c = fs.readFileSync(file, "utf8");
  const exports = [
    "human-dignity-humility-engine",
    "human-hope-possibility-engine",
    "human-wonder-exploration-engine",
    "human-legacy-eternal-stewardship-engine",
    "universal-stewardship-shared-futures-engine",
    "collective-wisdom-shared-learning-engine",
    "shared-purpose-contribution-engine",
    "shared-resilience-adaptive-capacity-engine",
    "shared-trust-cooperative-intelligence-engine",
  ];
  for (const slug of exports) {
    const line = `export * from "./${slug}";`;
    if (!c.includes(line)) c += `\n${line}`;
  }
  fs.writeFileSync(file, c.endsWith("\n") ? c : `${c}\n`);
  console.log("patched tenant");
}

function patchI18n() {
  const allEngines = [
    { i18nKey: "humanCreativityImaginationEngine", navId: "humanCreativityImaginationEngine", navLabel: "Creativity & Imagination", block: creativityI18nBlock() },
    ...PHASES_183_185.map((p) => ({
      i18nKey: p.camel,
      navId: p.camel,
      navLabel: p.navLabel,
      block: hopeI18nBlock({
        centerTitle: p.centerTitle,
        era: p.era,
        companion: p.companion,
        title: p.title,
        phase: p.phase,
        eraRange: p.eraRange,
      }),
    })),
  ];

  for (const locale of ["en", "no", "sv", "da"]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const json = JSON.parse(fs.readFileSync(file, "utf8"));
    for (const e of allEngines) {
      json[e.i18nKey] = e.block;
      if (json.nav) json.nav[e.navId] = e.navLabel;
      if (json.organizationalMemoryEngine) json.organizationalMemoryEngine[e.navId] = e.navLabel;
    }
    fs.writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`);
    console.log("patched locale", locale);
  }
}

function patchIlmIndex() {
  const file = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(file, "utf8");

  for (const phase of [179, 180, 181, 182, 183, 184, 185]) {
    const exp = `export * from "./implementation-blueprint-phase${phase}-vocabulary";`;
    if (!c.includes(exp)) {
      c = c.replace(
        "export * from \"./implementation-blueprint-phase178-vocabulary\";",
        `export * from "./implementation-blueprint-phase178-vocabulary";\n${exp}`,
      );
    }
  }

  const paths = {
    179: "implementation-blueprint-phase179-human-wonder-exploration.txt",
    180: "implementation-blueprint-phase180-human-legacy-eternal-stewardship.txt",
    181: "implementation-blueprint-phase181-universal-stewardship-shared-futures.txt",
    182: "implementation-blueprint-phase182-collective-wisdom-shared-learning.txt",
    183: "implementation-blueprint-phase183-shared-purpose-contribution.txt",
    184: "implementation-blueprint-phase184-shared-resilience-adaptive-capacity.txt",
    185: "implementation-blueprint-phase185-shared-trust-cooperative-intelligence.txt",
  };

  for (const [phase, ilm] of Object.entries(paths)) {
    const constName = `IMPLEMENTATION_BLUEPRINT_PHASE${phase}_PATH`;
    const line = `export const ${constName} =\n  "aipify-core/knowledge/internal-language-model/${ilm}";`;
    if (!c.includes(constName)) {
      c = c.replace(
        "export const IMPLEMENTATION_BLUEPRINT_PHASE178_PATH =",
        `${line}\n\nexport const IMPLEMENTATION_BLUEPRINT_PHASE178_PATH =`,
      );
    }
  }

  fs.writeFileSync(file, c);
  console.log("patched ilm index");
}

// Fix double Engine in 179-182
for (const slug of [
  "human-wonder-exploration-engine",
  "human-legacy-eternal-stewardship-engine",
  "universal-stewardship-shared-futures-engine",
  "collective-wisdom-shared-learning-engine",
]) {
  fixDoubleEngine(path.join(ROOT, `lib/aipify/${slug}`));
  fixDoubleEngine(path.join(ROOT, `components/app/${slug}`));
  fixDoubleEngine(path.join(ROOT, `app/app/${slug}`));
  fixDoubleEngine(path.join(ROOT, `app/api/aipify/${slug}`));
}

for (const p of PHASES_183_185) {
  genCore(p);
  genTsStack(p);
  genMigration(p);
  genDocs(p);
}

patchNavConfig();
patchPermissions();
patchTenant();
patchI18n();
patchIlmIndex();

console.log("Complete phases 174-185 done");
