#!/usr/bin/env node
/**
 * Regenerate migrations 183–185 (fix hcwsl template), implement Phases 186–187, patch nav/i18n/ARCHITECTURE.
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

const ERA = "Universal Stewardship & Shared Futures Era (181–190)";
const ERA_RANGE = "181–190";

const PHASES = [
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
    prevDecision: "humanity_collective_wisdom_shared_learning_engine",
    docSlug: "HUMANITY_SHARED_PURPOSE_CONTRIBUTION_ENGINE",
    ilmFile: "implementation-blueprint-phase183-shared-purpose-contribution.txt",
    navLabel: "Shared Purpose",
    crossLinkNote:
      "Cross-links only: purpose_values_engine, Phase 182 collective wisdom, social_impact — never duplicate RPCs.",
    faqExtra:
      "Contribution Companion supports purpose reflection — does NOT assign worth, dictate contribution, or replace leadership accountability.",
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
    prevDecision: "humanity_shared_purpose_contribution_engine",
    docSlug: "HUMANITY_SHARED_RESILIENCE_ADAPTIVE_CAPACITY_ENGINE",
    ilmFile: "implementation-blueprint-phase184-shared-resilience-adaptive-capacity.txt",
    navLabel: "Shared Resilience",
    crossLinkNote:
      "Cross-links only: organizational_resilience_engine, Phase 183 shared purpose, continuity_engine — never duplicate RPCs.",
    faqExtra:
      "Resilience Companion supports adaptive reflection — does NOT predict crises, force optimism, or override human agency.",
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
    prevDecision: "humanity_shared_resilience_adaptive_capacity_engine",
    docSlug: "HUMANITY_SHARED_TRUST_COOPERATIVE_INTELLIGENCE_ENGINE",
    ilmFile: "implementation-blueprint-phase185-shared-trust-cooperative-intelligence.txt",
    navLabel: "Cooperative Trust",
    crossLinkNote:
      "Cross-links only: trust_reputation_engine, Phase 184 shared resilience, social_cohesion_engine — never duplicate RPCs.",
    crossLinkReplace: [/civilizational_learning_engine/g, "trust_reputation_engine"],
    faqBody: `## What is the Cooperative Intelligence Center?

The Cooperative Intelligence Center at \`/app/shared-trust-cooperative-intelligence-engine\` supports trust reflection programs, cross-org learning networks, companion facilitation, leadership collaboration workshops, Growth Partner development, collective insight dashboards, knowledge exchange frameworks, and trust knowledge libraries.

## Does the Cooperation Companion replace relationships?

**No.** The Cooperation Companion supports cooperation — it does NOT force consensus, override autonomy, determine priorities, suppress disagreement, or replace relationships.

## What is the Trust Framework?

Leadership integrity, knowledge sharing, Growth Partner relationships, cross-functional collaboration, recognition, community engagement, and transparency — metadata scaffolds only.

## How does Self Love connect to cooperation?

Compassion, humility, patience, respect, recognition, and generosity — cooperation as stewardship, not surveillance or forced alignment.

## What surfaces cross-link only?

trust_reputation_engine, Phase 184 shared resilience, social_cohesion_engine — never duplicate RPCs.`,
    ilmExtra: `
Cooperative Intelligence Center: trust reflection programs, cross-org learning networks, companion facilitation, leadership collaboration workshops, Growth Partner development, collective insight dashboards, knowledge exchange frameworks, trust knowledge libraries.
Cooperative Intelligence Engine prompts: collaborate effectively?, trust barriers?, transparency?, partnerships?, balance autonomy/cooperation?
Trust Framework: leadership integrity, knowledge sharing, Growth Partner relationships, cross-functional collaboration, recognition, community engagement, transparency.
Executive Cooperation Reviews, Cooperation Companion, Trust Development Engine, Collective Problem-Solving Engine.
Companion limitations: no forcing consensus, no overriding autonomy, no determining priorities, no suppressing disagreement, no replacing relationships.
Self Love in cooperation: compassion, humility, patience, respect, recognition, generosity.`,
  },
  {
    phase: 186,
    migration: "20261346000000_humanity_shared_compassion_reciprocal_care_engine_phase186.sql",
    slug: "shared-compassion-reciprocal-care-engine",
    base: "SharedCompassionReciprocalCare",
    camel: "sharedCompassionReciprocalCareEngine",
    snake: "humanity_shared_compassion_reciprocal_care",
    permPrefix: "shared_compassion_care",
    helper: "hscrc",
    bp: "hscrcbp186",
    decisionType: "humanity_shared_compassion_reciprocal_care_engine",
    title: "Humanity's Shared Compassion & Reciprocal Care",
    centerTitle: "Reciprocal Care Center",
    companion: "Care Companion",
    scoreKey: "shared_compassion_care_score",
    modeKey: "compassion_mode",
    levelKey: "care_readiness_level",
    thirdEntity: "care_notes",
    reflectionsKey: "compassion_reflections",
    prevDecision: "humanity_shared_trust_cooperative_intelligence_engine",
    docSlug: "HUMANITY_SHARED_COMPASSION_RECIPROCAL_CARE_ENGINE",
    ilmFile: "implementation-blueprint-phase186-shared-compassion-reciprocal-care.txt",
    navLabel: "Reciprocal Care",
    crossLinkNote:
      "Cross-links only: inclusion_humanity_engine, gratitude_recognition_engine, Phase 184 shared resilience — never duplicate RPCs.",
    crossLinkReplace: [/civilizational_learning_engine/g, "inclusion_humanity_engine"],
    faqBody: `## What is the Reciprocal Care Center?

The Reciprocal Care Center at \`/app/shared-compassion-reciprocal-care-engine\` supports compassion reflection programs, reciprocal care frameworks, companion-supported empathy practices, executive compassion reviews, wellbeing scaffolds, relationship health metadata, and care knowledge libraries.

## Does the Care Companion replace relationships?

**No.** The Care Companion supports compassion — it does NOT replace relationships, provide clinical treatment, diagnose conditions, or substitute human care networks.

## How does empathy relate to compassion here?

Empathy scaffolds observe connection themes; compassion reflection supports dignified care — metadata only, not surveillance or performance scoring of kindness.

## Can excellence and care coexist?

**Yes.** ABOS treats operational excellence and reciprocal care as complementary — stewardship scaffolds honor both rigor and humanity. Growth Partner terminology — never Affiliate.

## How does Self Love connect to compassion?

Self Love in compassion: patience, forgiveness, healthy boundaries, and dignified self-care — care that strengthens people without guilt or pressure.`,
    ilmExtra: `
Reciprocal Care Center: compassion reflection programs, reciprocal care frameworks, companion empathy practices, executive compassion reviews, wellbeing scaffolds, relationship health metadata, care knowledge libraries.
Compassion Engine prompts: show care with boundaries?, empathy without burnout?, reciprocal support?, dignity in difficulty?
Reciprocal Care Framework: inclusion, gratitude, recognition, relationship health, wellbeing reflection, executive compassion reviews.
Care Companion supports compassion — NOT replace relationships, NOT clinical treatment.
Wellbeing Engine, Relationship Health Engine, companion limitations, Self Love in compassion, audit/RBAC metadata.
Cross-links only: inclusion_humanity_engine, gratitude_recognition_engine, Phase 184 shared resilience — never duplicate RPCs.`,
  },
  {
    phase: 187,
    migration: "20261347000000_humanity_shared_courage_responsible_action_engine_phase187.sql",
    slug: "shared-courage-responsible-action-engine",
    base: "SharedCourageResponsibleAction",
    camel: "sharedCourageResponsibleActionEngine",
    snake: "humanity_shared_courage_responsible_action",
    permPrefix: "shared_courage_action",
    helper: "hscra",
    bp: "hscrabp187",
    decisionType: "humanity_shared_courage_responsible_action_engine",
    title: "Humanity's Shared Courage & Responsible Action",
    centerTitle: "Courage Center",
    companion: "Courage Companion",
    scoreKey: "shared_courage_action_score",
    modeKey: "courage_mode",
    levelKey: "action_readiness_level",
    thirdEntity: "action_notes",
    reflectionsKey: "courage_reflections",
    prevDecision: "humanity_shared_compassion_reciprocal_care_engine",
    docSlug: "HUMANITY_SHARED_COURAGE_RESPONSIBLE_ACTION_ENGINE",
    ilmFile: "implementation-blueprint-phase187-shared-courage-responsible-action.txt",
    navLabel: "Responsible Courage",
    crossLinkNote:
      "Cross-links only: trust-action /app/approvals, Phase 186 compassion, Phase 184 shared resilience — never duplicate RPCs.",
    crossLinkReplace: [/civilizational_learning_engine/g, "secure_ai_action"],
    faqBody: `## What is the Courage Center?

The Courage Center at \`/app/shared-courage-responsible-action-engine\` supports courage reflection programs, responsible action frameworks, companion-supported confidence practices, executive courage reviews, initiative scaffolds, and responsible risk metadata.

## Does the Courage Companion replace judgment?

**No.** The Courage Companion supports confidence — it does NOT replace human judgment, encourage recklessness, bypass approvals, or remove accountability.

## What is responsible action?

Responsible action means courage with oversight: prepare, explain, approve when required, and act within approved limits — cross-link Trust & Action at \`/app/approvals\`.

## How does courage relate to risk?

The Responsible Risk Engine scaffolds proportionate initiative — metadata only, not gambling or unapproved high-risk execution.

## How does Self Love connect to courage?

Self Love in courage: self-respect, healthy confidence, patience with growth, and courage without self-harm — initiative that honors dignity.`,
    ilmExtra: `
Courage Center: courage reflection programs, responsible action frameworks, companion confidence practices, executive courage reviews, initiative scaffolds, responsible risk metadata.
Responsible Action Engine prompts: act with courage and care?, prepare before initiative?, seek approval when needed?, balance confidence and humility?
Courage Framework: initiative, responsible risk, executive courage reviews, Trust & Action cross-link /app/approvals.
Courage Companion supports confidence — NOT replace judgment, NOT recklessness.
Initiative Engine, Responsible Risk Engine, companion limitations, Self Love in courage, audit/RBAC metadata.
Cross-links only: trust-action /app/approvals, Phase 186 compassion, Phase 184 shared resilience — never duplicate RPCs.`,
  },
];

function transformHope(content, p) {
  const thirdPascal = p.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
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
    ["PossibilityNote", thirdPascal],
    ["possibility_notes_count", `${p.thirdEntity}_count`],
    ["Collective Possibility Center", p.centerTitle],
    ["Collective Possibility", p.centerTitle.replace(" Center", "")],
    ["Hope Companion", p.companion],
    ["Human Hope & Collective Possibility", p.title],
    ["Phase 178", `Phase ${p.phase}`],
    ["171–178", `181–${p.phase}`],
    ["Era 171–178", "Era 181–190"],
    ["human_hope_possibility_engine", p.decisionType],
    ["human_hope_possibility.view", `${p.permPrefix}.view`],
    ["human_hope_possibility.manage", `${p.permPrefix}.manage`],
    ["human_hope_possibility.steward", `${p.permPrefix}.steward`],
    ["20261338000000_human_hope_collective_possibility_engine_phase178.sql", p.migration],
    ["Cosmic Stewardship & Multi-Generational Futures Era (171–180)", ERA],
    ["Human Hope & Collective Possibility Phase 178", `${p.title} Phase ${p.phase}`],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function transformCollectiveWisdom(content, p) {
  const thirdPascal = p.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const permSnake = p.permPrefix.replace(/_/g, "_");
  const pairs = [
    ["Humanity's Collective Wisdom & Shared Learning", p.title],
    ["Humanity Collective Wisdom & Shared Learning", p.title.replace("Humanity's ", "")],
    ["Collective Wisdom Center", p.centerTitle],
    ["Collective Wisdom", p.centerTitle.replace(" Center", "")],
    ["Learning Companion", p.companion],
    ["humanity_collective_wisdom_shared_learning", p.snake],
    ["humanity_collective_wisdom_shared_learning_engine", p.decisionType],
    ["collective_wisdom_learning", p.permPrefix],
    ["_hcwslbp182_", `_${p.bp}_`],
    ["_hcwsl_", `_${p.helper}_`],
    ["wisdom_readiness_level", p.levelKey],
    ["learning_mode", p.modeKey],
    ["learning_notes", p.thirdEntity],
    ["LearningNote", thirdPascal],
    ["learning_notes_count", `${p.thirdEntity}_count`],
    ["humanity_collective_wisdom_shared_learning_score", `${p.snake}_score`],
    ["Phase 182", `Phase ${p.phase}`],
    ["20261342000000_humanity_collective_wisdom_shared_learning_engine_phase182.sql", p.migration],
    ["Cross-link civilizational_learning_engine, Phase 181 universal stewardship, organizational_memory, Learning Engine /app/learning", p.crossLinkNote],
    ["Cross-link civilizational_learning_engine, Phase 181 universal stewardship", p.crossLinkNote],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  if (p.crossLinkReplace) {
    for (const [re, rep] of [p.crossLinkReplace]) c = c.replace(re, rep);
  }
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
  write(path.join(ROOT, `components/app/${p.slug}/index.ts`), `export { ${engine}DashboardPanel } from "./${engine}DashboardPanel";\n`);

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
  let m = transformCollectiveWisdom(
    fs.readFileSync(
      path.join(ROOT, "supabase/migrations/20261342000000_humanity_collective_wisdom_shared_learning_engine_phase182.sql"),
      "utf8",
    ),
    p,
  );
  m = m.replace(`'${p.prevDecision}'`, `'${p.prevDecision}',\n    '${p.decisionType}'`);
  write(path.join(ROOT, `supabase/migrations/${p.migration}`), m);
}

function genDocs(p) {
  write(
    path.join(ROOT, `${p.docSlug}_PHASE${p.phase}.md`),
    `# ${p.title} Engine — Phase ${p.phase}

## Vision

${p.centerTitle} within the ${ERA}. ${p.companion} supports — does NOT replace human judgment, responsibility, or dignity.

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
Era: ${ERA}
${p.crossLinkNote}
`,
  );

  const faqBody =
    p.faqBody ??
    `## What is the ${p.centerTitle}?

The ${p.centerTitle} at \`/app/${p.slug}\` is part of the **${ERA}**. ${p.companion} supports reflection and metadata scaffolds.

## Does ${p.companion} decide for humans?

**No.** Humans retain final accountability.

## Permissions

\`${p.permPrefix}.view\` · \`${p.permPrefix}.manage\` · \`${p.permPrefix}.steward\`

## Growth Partner terminology?

**Yes.** Growth Partner — never Affiliate.

## Companion limitations?

${p.faqExtra}`;

  write(
    path.join(ROOT, `content/knowledge/aipify/${p.slug}/faq/implementation-blueprint-phase${p.phase}-faq.md`),
    `# ${p.title} Engine — FAQ (Phase ${p.phase})\n\n${faqBody}\n`,
  );

  const ilmBody = `ABOS Phase ${p.phase} — ${p.title}
Route: /app/${p.slug}
Era: ${ERA}
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

function hopeI18nBlock(p) {
  return {
    title: p.centerTitle,
    subtitle: `${ERA} — ${p.companion.toLowerCase()} supports reflection and metadata scaffolds. Supports humans — does NOT replace judgment or leadership accountability. Growth Partner — never Affiliate.`,
    loading: `Loading ${p.title} dashboard…`,
    engineTitle: `${p.title} Engine (Phase ${p.phase})`,
    scoreLabel: "Engagement score",
    modeLabel: "Mode",
    readinessLabel: "Readiness level",
    executiveReviews: "Executive reviews",
    activeReflections: "Active reflections",
    humanOversightRequired: `Human oversight required — humans decide; ${p.companion} supports only`,
    eraOpenerSummary: `Universal Stewardship Era — Phases ${ERA_RANGE}`,
    eraOpenerNote: "Cross-link only — do not duplicate era engine RPCs.",
    centerLabel: `${p.centerTitle} capabilities`,
    engineLabel: `${p.companion.replace(" Companion", "")} engine — reflection prompts`,
    frameworkLabel: "Stewardship framework",
    reviewsLabel: "Executive reviews",
    companionLabel: `${p.companion} — supports, does not replace`,
    subEngineLabel: "Supporting engine",
    reflections: "Reflection scaffolds",
    executiveReviewEntries: "Executive review entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${p.phase})`,
    companionLimitations: `${p.companion} limitations — does NOT replace human judgment`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${p.phase}`]: {
      mission: `${p.companion} supports stewardship and reflection — humans retain accountability.`,
      philosophy: "People First. Wisdom before speed. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
    },
  };
}

function patchNavConfig() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");

  const navIds = [
    "sharedCompassionReciprocalCareEngine",
    "sharedCourageResponsibleActionEngine",
    "sharedTrustCooperativeIntelligenceEngine",
    "sharedResilienceAdaptiveCapacityEngine",
    "sharedPurposeContributionEngine",
  ];

  for (const id of navIds) {
    if (!c.includes(`"${id}"`)) {
      c = c.replace(
        '| "collectiveWisdomSharedLearningEngine"',
        `| "collectiveWisdomSharedLearningEngine"\n  | "${id}"`,
      );
    }
  }

  const eraNavBlock = `  {
    id: "sharedPurposeContributionEngine",
    href: "/app/shared-purpose-contribution-engine",
    labelKey: "customerApp.nav.sharedPurposeContributionEngine",
  },
  {
    id: "sharedResilienceAdaptiveCapacityEngine",
    href: "/app/shared-resilience-adaptive-capacity-engine",
    labelKey: "customerApp.nav.sharedResilienceAdaptiveCapacityEngine",
  },
  {
    id: "sharedTrustCooperativeIntelligenceEngine",
    href: "/app/shared-trust-cooperative-intelligence-engine",
    labelKey: "customerApp.nav.sharedTrustCooperativeIntelligenceEngine",
  },
  {
    id: "sharedCompassionReciprocalCareEngine",
    href: "/app/shared-compassion-reciprocal-care-engine",
    labelKey: "customerApp.nav.sharedCompassionReciprocalCareEngine",
  },
  {
    id: "sharedCourageResponsibleActionEngine",
    href: "/app/shared-courage-responsible-action-engine",
    labelKey: "customerApp.nav.sharedCourageResponsibleActionEngine",
  },`;

  if (!c.includes("shared-purpose-contribution-engine")) {
    c = c.replace(
      /id: "collectiveWisdomSharedLearningEngine",[\s\S]*?labelKey: "customerApp\.nav\.collectiveWisdomSharedLearningEngine",\n  },/,
      (m) => `${m}\n${eraNavBlock}`,
    );
  } else if (!c.includes("shared-compassion-reciprocal-care-engine")) {
    c = c.replace(
      /id: "sharedTrustCooperativeIntelligenceEngine",[\s\S]*?labelKey: "customerApp\.nav\.sharedTrustCooperativeIntelligenceEngine",\n  },/,
      (m) =>
        `${m}\n  {\n    id: "sharedCompassionReciprocalCareEngine",\n    href: "/app/shared-compassion-reciprocal-care-engine",\n    labelKey: "customerApp.nav.sharedCompassionReciprocalCareEngine",\n  },\n  {\n    id: "sharedCourageResponsibleActionEngine",\n    href: "/app/shared-courage-responsible-action-engine",\n    labelKey: "customerApp.nav.sharedCourageResponsibleActionEngine",\n  },`,
    );
  }

  const pathResolvers = [
    ["shared-purpose-contribution-engine", "sharedPurposeContributionEngine"],
    ["shared-resilience-adaptive-capacity-engine", "sharedResilienceAdaptiveCapacityEngine"],
    ["shared-trust-cooperative-intelligence-engine", "sharedTrustCooperativeIntelligenceEngine"],
    ["shared-compassion-reciprocal-care-engine", "sharedCompassionReciprocalCareEngine"],
    ["shared-courage-responsible-action-engine", "sharedCourageResponsibleActionEngine"],
  ];

  for (const [route, id] of pathResolvers) {
    if (!c.includes(`/app/${route}`)) {
      c = c.replace(
        'if (pathname.startsWith("/app/collective-wisdom-shared-learning-engine")) {\n    return "collectiveWisdomSharedLearningEngine";\n  }',
        `if (pathname.startsWith("/app/collective-wisdom-shared-learning-engine")) {\n    return "collectiveWisdomSharedLearningEngine";\n  }\n  if (pathname.startsWith("/app/${route}")) {\n    return "${id}";\n  }`,
      );
    }
  }

  fs.writeFileSync(file, c);
  console.log("patched nav-config");
}

function patchPermissions() {
  const file = path.join(ROOT, "lib/core/permissions.ts");
  let c = fs.readFileSync(file, "utf8");

  for (const p of PHASES.filter((x) => x.phase >= 186)) {
    const block = `"${p.permPrefix}.view",\n  "${p.permPrefix}.manage",\n  "${p.permPrefix}.steward",`;
    if (!c.includes(`${p.permPrefix}.view`)) {
      c = c.replace('"collective_wisdom_learning.steward",', `"collective_wisdom_learning.steward",\n  ${block}`);
    }
    const viewOnly = `"${p.permPrefix}.view",`;
    const first = c.indexOf(viewOnly);
    const last = c.lastIndexOf(viewOnly);
    if (first === -1 || first === last) {
      c = c.replace('"collective_wisdom_learning.view",', `"collective_wisdom_learning.view",\n    ${viewOnly}`);
    }
  }

  fs.writeFileSync(file, c);
  console.log("patched permissions");
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  let c = fs.readFileSync(file, "utf8");
  for (const p of PHASES.filter((x) => x.phase >= 186)) {
    const line = `export * from "./${p.slug}";`;
    if (!c.includes(line)) c += `\n${line}`;
  }
  fs.writeFileSync(file, c.endsWith("\n") ? c : `${c}\n`);
  console.log("patched tenant");
}

function patchI18n() {
  const newPhases = PHASES.filter((x) => x.phase >= 186);
  for (const locale of ["en", "no", "sv", "da"]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const json = JSON.parse(fs.readFileSync(file, "utf8"));
    for (const p of newPhases) {
      const block = hopeI18nBlock(p);
      if (locale !== "en") {
        const navLabels = {
          no: { 186: "Gjensidig omsorg", 187: "Ansvarlig mot" },
          sv: { 186: "Ömsesidig omsorg", 187: "Ansvarsfullt mod" },
          da: { 186: "Gensidig omsorg", 187: "Ansvarligt mod" },
        };
        block.title = navLabels[locale]?.[p.phase] ?? block.title;
      }
      json[p.camel] = block;
      if (json.nav) json.nav[p.camel] = locale === "en" ? p.navLabel : json.nav[p.camel] ?? p.navLabel;
      if (json.organizationalMemoryEngine) json.organizationalMemoryEngine[p.camel] = json.nav?.[p.camel] ?? p.navLabel;
    }
    fs.writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`);
    console.log("patched locale", locale);
  }
}

function patchIlmIndex() {
  const file = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(file, "utf8");

  for (const phase of [186, 187]) {
    const exp = `export * from "./implementation-blueprint-phase${phase}-vocabulary";`;
    if (!c.includes(exp)) {
      c = c.replace(
        'export * from "./implementation-blueprint-phase185-vocabulary";',
        `export * from "./implementation-blueprint-phase185-vocabulary";\n${exp}`,
      );
    }
    const ilm = PHASES.find((p) => p.phase === phase).ilmFile;
    const constName = `IMPLEMENTATION_BLUEPRINT_PHASE${phase}_PATH`;
    const line = `export const ${constName} =\n  "aipify-core/knowledge/internal-language-model/${ilm}";`;
    if (!c.includes(constName)) {
      c = c.replace(
        "export const IMPLEMENTATION_BLUEPRINT_PHASE185_PATH =",
        `${line}\n\nexport const IMPLEMENTATION_BLUEPRINT_PHASE185_PATH =`,
      );
    }
  }

  fs.writeFileSync(file, c);
  console.log("patched ilm index");
}

function patchArchitecture() {
  const file = path.join(ROOT, "lib/../ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");

  const entries = [
    {
      phase: 183,
      doc: "HUMANITY_SHARED_PURPOSE_CONTRIBUTION_ENGINE_PHASE183.md",
      route: "shared-purpose-contribution-engine",
      nav: "sharedPurposeContributionEngine",
      migration: "20261343000000_humanity_shared_purpose_contribution_engine_phase183.sql",
      helpers: "_hspc_*, _hspcbp183_*",
      perms: "shared_purpose_contribution.view/manage/steward",
      title: "Humanity's Shared Purpose & Contribution Engine",
    },
    {
      phase: 184,
      doc: "HUMANITY_SHARED_RESILIENCE_ADAPTIVE_CAPACITY_ENGINE_PHASE184.md",
      route: "shared-resilience-adaptive-capacity-engine",
      nav: "sharedResilienceAdaptiveCapacityEngine",
      migration: "20261344000000_humanity_shared_resilience_adaptive_capacity_engine_phase184.sql",
      helpers: "_hsrac_*, _hsracbp184_*",
      perms: "shared_resilience_adaptive.view/manage/steward",
      title: "Humanity's Shared Resilience & Adaptive Capacity Engine",
    },
    {
      phase: 185,
      doc: "HUMANITY_SHARED_TRUST_COOPERATIVE_INTELLIGENCE_ENGINE_PHASE185.md",
      route: "shared-trust-cooperative-intelligence-engine",
      nav: "sharedTrustCooperativeIntelligenceEngine",
      migration: "20261345000000_humanity_shared_trust_cooperative_intelligence_engine_phase185.sql",
      helpers: "_hstci_*, _hstcibp185_*",
      perms: "shared_trust_cooperative.view/manage/steward",
      title: "Humanity's Shared Trust & Cooperative Intelligence Engine",
    },
    {
      phase: 186,
      doc: "HUMANITY_SHARED_COMPASSION_RECIPROCAL_CARE_ENGINE_PHASE186.md",
      route: "shared-compassion-reciprocal-care-engine",
      nav: "sharedCompassionReciprocalCareEngine",
      migration: "20261346000000_humanity_shared_compassion_reciprocal_care_engine_phase186.sql",
      helpers: "_hscrc_*, _hscrcbp186_*",
      perms: "shared_compassion_care.view/manage/steward",
      title: "Humanity's Shared Compassion & Reciprocal Care Engine",
    },
    {
      phase: 187,
      doc: "HUMANITY_SHARED_COURAGE_RESPONSIBLE_ACTION_ENGINE_PHASE187.md",
      route: "shared-courage-responsible-action-engine",
      nav: "sharedCourageResponsibleActionEngine",
      migration: "20261347000000_humanity_shared_courage_responsible_action_engine_phase187.sql",
      helpers: "_hscra_*, _hscrabp187_*",
      perms: "shared_courage_action.view/manage/steward",
      title: "Humanity's Shared Courage & Responsible Action Engine",
    },
  ];

  const anchor =
    "**Humanity's Collective Wisdom & Shared Learning Engine (Phase 182):**";
  let insert = "";
  for (const e of entries) {
    const line = `**${e.title} (Phase ${e.phase}):** See [${e.doc.replace(".md", "")}](./${e.doc}) — \`/app/${e.route}\`, nav id \`${e.nav}\`, migration \`${e.migration}\`. Helpers \`${e.helpers}\`. Permissions \`${e.perms}\`. KC FAQ \`content/knowledge/aipify/${e.route}/faq/implementation-blueprint-phase${e.phase}-faq.md\`.\n\n`;
    if (!c.includes(`Phase ${e.phase}):** See [${e.doc.replace(".md", "")}`)) insert += line;
  }

  if (insert) {
    c = c.replace(anchor, `${anchor}`).replace(
      /(\*\*Humanity's Collective Wisdom & Shared Learning Engine \(Phase 182\):\*\*[\s\S]*?collective_wisdom_learning\.steward\`\.)\n\n/,
      `$1\n\n${insert}`,
    );
    fs.writeFileSync(file, c);
    console.log("patched ARCHITECTURE.md");
  }
}

for (const p of PHASES) {
  if (p.phase >= 186) {
    genCore(p);
    genTsStack(p);
    genDocs(p);
  }
  genMigration(p);
  if (p.phase < 186) genDocs(p);
}

patchNavConfig();
patchPermissions();
patchTenant();
patchI18n();
patchIlmIndex();
patchArchitecture();

console.log("Complete phases 183-187 done");
