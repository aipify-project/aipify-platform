#!/usr/bin/env node
/**
 * Generate ABOS Phases 174–177 full-stack files from Phase 174 migration patterns.
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const PHASES = [
  {
    phase: 174,
    migration: "20261334000000_human_creativity_imagination_amplification_engine_phase174.sql",
    slug: "human-creativity-imagination-engine",
    camel: "humanCreativityImaginationEngine",
    snake: "human_creativity_imagination",
    permPrefix: "human_creativity_imagination",
    helper: "hcia",
    bp: "hciabp174",
    decisionType: "human_creativity_imagination_engine",
    title: "Human Creativity & Imagination Amplification",
    centerTitle: "Creativity & Imagination Center",
    companion: "Creativity Companion",
    scoreKey: "human_creativity_imagination_score",
    modeKey: "imagination_mode",
    levelKey: "creative_safety_level",
    modeLabel: "imaginationMode",
    levelLabel: "creativeSafetyLevel",
    thirdEntity: "experiments",
    thirdEntitySingular: "Experiment",
    reflectionsKey: "imagination_reflections",
    reflectionsLabel: "imaginationReflections",
    reviewsMeta: "executive_creativity_reviews_meta",
    centerMeta: "creativity_center_meta",
    engineMeta: "imagination_engine_meta",
    frameworkMeta: "creative_safety_framework_meta",
    companionMeta: "creativity_companion_meta",
    engine2Meta: "experimentation_engine_meta",
    engine3Meta: "collective_creativity_engine_meta",
    centerLabel: "creativityCenter",
    engineLabel: "imaginationEngine",
    frameworkLabel: "creativeSafetyFramework",
    reviewsLabel: "executiveCreativityReviews",
    companionLabel: "creativityCompanion",
    engine2Label: "experimentationEngine",
    engine3Label: "collectiveCreativityEngine",
    thirdLabel: "experiments",
    eraCount: 4,
    kcSort: 184,
    skipMigration: true,
  },
  {
    phase: 175,
    migration: "20261335000000_human_wisdom_augmented_judgment_engine_phase175.sql",
    slug: "human-wisdom-augmented-judgment-engine",
    camel: "humanWisdomAugmentedJudgmentEngine",
    snake: "human_wisdom_augmented_judgment",
    permPrefix: "human_wisdom_judgment",
    helper: "hwaj",
    bp: "hwajbp175",
    decisionType: "human_wisdom_augmented_judgment_engine",
    title: "Human Wisdom & Augmented Judgment",
    centerTitle: "Wisdom & Judgment Center",
    companion: "Wisdom Companion",
    scoreKey: "human_wisdom_judgment_score",
    modeKey: "judgment_mode",
    levelKey: "wisdom_readiness_level",
    modeLabel: "judgmentMode",
    levelLabel: "wisdomReadinessLevel",
    thirdEntity: "judgment_notes",
    thirdEntitySingular: "JudgmentNote",
    reflectionsKey: "wisdom_reflections",
    reflectionsLabel: "wisdomReflections",
    reviewsMeta: "executive_wisdom_reviews_meta",
    centerMeta: "wisdom_center_meta",
    engineMeta: "judgment_engine_meta",
    frameworkMeta: "wisdom_framework_meta",
    companionMeta: "wisdom_companion_meta",
    engine2Meta: "discernment_engine_meta",
    engine3Meta: "ethical_reflection_engine_meta",
    centerLabel: "wisdomCenter",
    engineLabel: "judgmentEngine",
    frameworkLabel: "wisdomFramework",
    reviewsLabel: "executiveWisdomReviews",
    companionLabel: "wisdomCompanion",
    engine2Label: "discernmentEngine",
    engine3Label: "ethicalReflectionEngine",
    thirdLabel: "judgmentNotes",
    eraCount: 5,
    kcSort: 185,
  },
  {
    phase: 176,
    migration: "20261336000000_human_agency_responsible_autonomy_engine_phase176.sql",
    slug: "human-agency-autonomy-engine",
    camel: "humanAgencyAutonomyEngine",
    snake: "human_agency_responsible_autonomy",
    permPrefix: "human_agency_autonomy",
    helper: "haar",
    bp: "haarbp176",
    decisionType: "human_agency_responsible_autonomy_engine",
    title: "Human Agency & Responsible Autonomy",
    centerTitle: "Agency & Autonomy Center",
    companion: "Agency Companion",
    scoreKey: "human_agency_autonomy_score",
    modeKey: "autonomy_mode",
    levelKey: "agency_readiness_level",
    modeLabel: "autonomyMode",
    levelLabel: "agencyReadinessLevel",
    thirdEntity: "autonomy_notes",
    thirdEntitySingular: "AutonomyNote",
    reflectionsKey: "agency_reflections",
    reflectionsLabel: "agencyReflections",
    reviewsMeta: "executive_agency_reviews_meta",
    centerMeta: "agency_center_meta",
    engineMeta: "autonomy_engine_meta",
    frameworkMeta: "responsible_autonomy_framework_meta",
    companionMeta: "agency_companion_meta",
    engine2Meta: "accountability_engine_meta",
    engine3Meta: "consent_engine_meta",
    centerLabel: "agencyCenter",
    engineLabel: "autonomyEngine",
    frameworkLabel: "responsibleAutonomyFramework",
    reviewsLabel: "executiveAgencyReviews",
    companionLabel: "agencyCompanion",
    engine2Label: "accountabilityEngine",
    engine3Label: "consentEngine",
    thirdLabel: "autonomyNotes",
    eraCount: 6,
    kcSort: 186,
  },
  {
    phase: 177,
    migration: "20261337000000_human_dignity_technological_humility_engine_phase177.sql",
    slug: "human-dignity-humility-engine",
    camel: "humanDignityHumilityEngine",
    snake: "human_dignity_technological_humility",
    permPrefix: "human_dignity_humility",
    helper: "hdth",
    bp: "hdthbp177",
    decisionType: "human_dignity_technological_humility_engine",
    title: "Human Dignity & Technological Humility",
    centerTitle: "Dignity Center",
    companion: "Dignity Companion",
    scoreKey: "human_dignity_humility_score",
    modeKey: "humility_mode",
    levelKey: "dignity_readiness_level",
    modeLabel: "humilityMode",
    levelLabel: "dignityReadinessLevel",
    thirdEntity: "compassion_notes",
    thirdEntitySingular: "CompassionNote",
    reflectionsKey: "dignity_reflections",
    reflectionsLabel: "dignityReflections",
    reviewsMeta: "executive_humility_reviews_meta",
    centerMeta: "dignity_center_meta",
    engineMeta: "human_dignity_engine_meta",
    frameworkMeta: "technological_humility_framework_meta",
    companionMeta: "dignity_companion_meta",
    engine2Meta: "compassion_engine_meta",
    engine3Meta: "human_value_framework_meta",
    centerLabel: "dignityCenter",
    engineLabel: "humanDignityEngine",
    frameworkLabel: "technologicalHumilityFramework",
    reviewsLabel: "executiveHumilityReviews",
    companionLabel: "dignityCompanion",
    engine2Label: "compassionEngine",
    engine3Label: "humanValueFramework",
    thirdLabel: "compassionNotes",
    eraCount: 7,
    kcSort: 187,
  },
];

function pascal(slug) {
  return slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function genCore(p) {
  const types =
    p.phase === 174
      ? `export const EXECUTIVE_CREATIVITY_REVIEW_TYPES = [
  "innovation_culture", "psychological_safety", "experimentation_support",
  "diverse_perspectives", "leadership_accessibility",
] as const;
export type ExecutiveCreativityReviewType = (typeof EXECUTIVE_CREATIVITY_REVIEW_TYPES)[number];

export const IMAGINATION_REFLECTION_TYPES = [
  "possibilities_overlooked", "assumptions_to_question", "ideas_to_explore",
  "diverse_perspectives", "build_together", "cross_functional_exchange",
  "learning_review", "opportunity_exploration",
] as const;
export type ImaginationReflectionType = (typeof IMAGINATION_REFLECTION_TYPES)[number];

export const EXPERIMENT_TYPES = [
  "innovation_pilot", "innovation_lab", "rapid_learning",
  "growth_partner_collaboration", "idea_validation", "experimentation_framework",
  "knowledge_library", "collective_creativity",
] as const;
export type ExperimentType = (typeof EXPERIMENT_TYPES)[number];`
      : p.phase === 175
        ? `export const EXECUTIVE_WISDOM_REVIEW_TYPES = [
  "discernment_culture", "ethical_reflection", "judgment_support",
  "wisdom_stewardship", "leadership_humility",
] as const;
export type ExecutiveWisdomReviewType = (typeof EXECUTIVE_WISDOM_REVIEW_TYPES)[number];

export const WISDOM_REFLECTION_TYPES = [
  "tradeoff_exploration", "stakeholder_perspectives", "long_term_consequences",
  "values_alignment", "uncertainty_acknowledgment", "lesson_synthesis",
  "ethical_considerations", "wisdom_continuity",
] as const;
export type WisdomReflectionType = (typeof WISDOM_REFLECTION_TYPES)[number];

export const JUDGMENT_NOTE_TYPES = [
  "discernment_scaffold", "ethical_context", "stakeholder_awareness",
  "uncertainty_transparency", "decision_preparation", "wisdom_heritage",
  "leadership_accountability", "cross_link_dse",
] as const;
export type JudgmentNoteType = (typeof JUDGMENT_NOTE_TYPES)[number];`
        : p.phase === 176
          ? `export const EXECUTIVE_AGENCY_REVIEW_TYPES = [
  "autonomy_culture", "consent_practices", "accountability_balance",
  "responsible_autonomy", "leadership_delegation",
] as const;
export type ExecutiveAgencyReviewType = (typeof EXECUTIVE_AGENCY_REVIEW_TYPES)[number];

export const AGENCY_REFLECTION_TYPES = [
  "choice_awareness", "consent_reflection", "responsibility_honoring",
  "delegation_clarity", "override_prevention", "autonomy_boundaries",
  "accountability_themes", "action_center_alignment",
] as const;
export type AgencyReflectionType = (typeof AGENCY_REFLECTION_TYPES)[number];

export const AUTONOMY_NOTE_TYPES = [
  "consent_scaffold", "approval_pathway", "delegation_metadata",
  "override_prevention", "accountability_theme", "autonomy_boundary",
  "action_center_link", "trust_action_link",
] as const;
export type AutonomyNoteType = (typeof AUTONOMY_NOTE_TYPES)[number];`
          : `export const EXECUTIVE_HUMILITY_REVIEW_TYPES = [
  "dignity_preservation", "technological_humility", "compassion_culture",
  "human_value_awareness", "leadership_humility",
] as const;
export type ExecutiveHumilityReviewType = (typeof EXECUTIVE_HUMILITY_REVIEW_TYPES)[number];

export const DIGNITY_REFLECTION_TYPES = [
  "intrinsic_worth", "compassion_practice", "self_respect",
  "individuality_honoring", "performance_balance", "technological_limits",
  "leadership_dignity", "cross_generational_respect",
] as const;
export type DignityReflectionType = (typeof DIGNITY_REFLECTION_TYPES)[number];

export const COMPASSION_NOTE_TYPES = [
  "compassion_scaffold", "dignity_awareness", "intrinsic_worth",
  "individuality_protection", "self_love_connection", "humility_practice",
  "human_value_theme", "metrics_boundary",
] as const;
export type CompassionNoteType = (typeof COMPASSION_NOTE_TYPES)[number];`;

  const modes =
    p.phase === 174
      ? `export const HUMAN_CREATIVITY_IMAGINATION_MODES = ["exploratory", "collaborative", "executive_sponsored"] as const;
export type HumanCreativityImaginationMode = (typeof HUMAN_CREATIVITY_IMAGINATION_MODES)[number];`
      : p.phase === 175
        ? `export const HUMAN_WISDOM_JUDGMENT_MODES = ["reflective", "council_led", "executive_sponsored"] as const;
export type HumanWisdomJudgmentMode = (typeof HUMAN_WISDOM_JUDGMENT_MODES)[number];`
        : p.phase === 176
          ? `export const HUMAN_AGENCY_AUTONOMY_MODES = ["guided", "delegated", "executive_sponsored"] as const;
export type HumanAgencyAutonomyMode = (typeof HUMAN_AGENCY_AUTONOMY_MODES)[number];`
          : `export const HUMAN_DIGNITY_HUMILITY_MODES = ["reflective", "compassion_led", "executive_sponsored"] as const;
export type HumanDignityHumilityMode = (typeof HUMAN_DIGNITY_HUMILITY_MODES)[number];`;

  write(
    path.join(ROOT, `lib/core/${p.slug}.ts`),
    `/**
 * ${p.title} Engine helpers (Phase ${p.phase}).
 * Authoritative enforcement lives in Supabase RPCs (_${p.helper}_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

${modes}

${types}

export async function get${pascal(p.slug)}Dashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_${p.snake}_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function get${pascal(p.slug)}Card(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_${p.snake}_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function create${pascal(p.slug)}AuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
`,
  );
}

// Generate TS lib files by transforming phase 174 creativity template
function transform174Ts(content, p, isPanel = false) {
  let c = content;
  const pairs = [
    ["HumanCreativityImagination", pascal(p.slug)],
    ["human-creativity-imagination-engine", p.slug],
    ["human_creativity_imagination", p.snake],
    ["humanCreativityImagination", p.camel.replace(/Engine$/, "").replace(/^human/, "human")],
    ["humanCreativityImaginationEngine", p.camel],
    ["hciabp174", p.bp],
    ["hcia", p.helper],
    ["human_creativity_imagination_score", p.scoreKey],
    ["imagination_mode", p.modeKey],
    ["creative_safety_level", p.levelKey],
    ["imaginationMode", p.modeLabel],
    ["creativeSafetyLevel", p.levelLabel],
    ["imagination_reflections", p.reflectionsKey],
    ["imaginationReflections", p.reflectionsLabel],
    ["experiments", p.thirdEntity],
    ["Experiment", p.thirdEntitySingular],
    ["experiments_count", `${p.thirdEntity}_count`.replace("judgment_notes", "judgment_notes").replace("autonomy_notes", "autonomy_notes").replace("compassion_notes", "compassion_notes")],
    ["active_experiments_count", `active_${p.thirdEntity.replace(/s$/, "")}_count`],
    ["creativity_center_meta", p.centerMeta],
    ["imagination_engine_meta", p.engineMeta],
    ["creative_safety_framework_meta", p.frameworkMeta],
    ["executive_creativity_reviews_meta", p.reviewsMeta],
    ["creativity_companion_meta", p.companionMeta],
    ["experimentation_engine_meta", p.engine2Meta],
    ["collective_creativity_engine_meta", p.engine3Meta],
    ["creativityCenter", p.centerLabel],
    ["imaginationEngine", p.engineLabel],
    ["creativeSafetyFramework", p.frameworkLabel],
    ["executiveCreativityReviews", p.reviewsLabel],
    ["creativityCompanion", p.companionLabel],
    ["experimentationEngine", p.engine2Label],
    ["collectiveCreativityEngine", p.engine3Label],
    ["Human Creativity & Imagination", p.title],
    ["Creativity & Imagination Center", p.centerTitle],
    ["Creativity Companion", p.companion],
    ["Phase 174", `Phase ${p.phase}`],
    ["not_artistic_judgment", p.phase === 175 ? "not_moral_judgment" : p.phase === 176 ? "not_replace_responsibility" : p.phase === 177 ? "not_worth_scoring" : "not_artistic_judgment"],
  ];
  for (const [from, to] of pairs) {
    c = c.split(from).join(to);
  }
  if (isPanel) {
    c = c.replace(/ExperimentRow/g, `${p.thirdEntitySingular}Row`);
    c = c.replace(/function ExperimentRow/g, `function ${p.thirdEntitySingular}Row`);
  }
  return c;
}

function genTsStack(p) {
  const srcDir = path.join(ROOT, "lib/aipify/human-creativity-imagination-engine");
  const dstDir = path.join(ROOT, `lib/aipify/${p.slug}`);
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    let content = fs.readFileSync(path.join(srcDir, f), "utf8");
    if (f !== "index.ts") content = transform174Ts(content, p);
    write(path.join(dstDir, f), content);
  }

  const panelSrc = path.join(
    ROOT,
    "components/app/human-identity-meaning-engine/HumanIdentityMeaningEngineDashboardPanel.tsx",
  );
  let panel = fs.readFileSync(panelSrc, "utf8");
  panel = panel
    .split("human-identity-meaning-engine")
    .join(p.slug)
    .split("HumanIdentityMeaning")
    .join(pascal(p.slug))
    .split("human_identity_meaning")
    .join(p.snake)
    .split("humanIdentityMeaning")
    .join(p.camel.replace(/Engine$/, "").replace(/^human/, "human"))
    .split("himpbp173")
    .join(p.bp)
    .split("meaning_readiness_level")
    .join(p.levelKey)
    .split("discovery_mode")
    .join(p.modeKey)
    .split("meaningReadinessLevel")
    .join(p.levelLabel)
    .split("discoveryMode")
    .join(p.modeLabel)
    .split("meaning_reflections")
    .join(p.reflectionsKey)
    .split("meaningReflections")
    .join(p.reflectionsLabel)
    .split("agency_notes")
    .join(p.thirdEntity)
    .split("AgencyNote")
    .join(p.thirdEntitySingular)
    .split("AgencyRow")
    .join(`${p.thirdEntitySingular}Row`)
    .split("agencyNotes")
    .join(p.thirdLabel)
    .split("agency_notes_count")
    .join(`${p.thirdEntity}_count`)
    .split("meaning_identity_center_meta")
    .join(p.centerMeta)
    .split("human_identity_engine_meta")
    .join(p.engineMeta)
    .split("meaning_preservation_framework_meta")
    .join(p.frameworkMeta)
    .split("executive_humanity_reviews_meta")
    .join(p.reviewsMeta)
    .split("meaning_companion_meta")
    .join(p.companionMeta)
    .split("belonging_engine_meta")
    .join(p.engine2Meta)
    .split("agency_preservation_engine_meta")
    .join(p.engine3Meta)
    .split("meaningIdentityCenter")
    .join(p.centerLabel)
    .split("humanIdentityEngine")
    .join(p.engineLabel)
    .split("meaningPreservationFramework")
    .join(p.frameworkLabel)
    .split("executiveHumanityReviews")
    .join(p.reviewsLabel)
    .split("meaningCompanion")
    .join(p.companionLabel)
    .split("belongingEngine")
    .join(p.engine2Label)
    .split("agencyPreservationEngine")
    .join(p.engine3Label)
    .split("Meaning & Identity Center")
    .join(p.centerTitle)
    .split("Meaning Companion")
    .join(p.companion)
    .split("Human Identity & Meaning")
    .join(p.title);

  write(
    path.join(ROOT, `components/app/${p.slug}/${pascal(p.slug)}DashboardPanel.tsx`),
    panel,
  );
  write(
    path.join(ROOT, `components/app/${p.slug}/index.ts`),
    `export { ${pascal(p.slug)}DashboardPanel } from "./${pascal(p.slug)}DashboardPanel";\n`,
  );

  const pageSrc = fs.readFileSync(
    path.join(ROOT, "app/app/human-identity-meaning-engine/page.tsx"),
    "utf8",
  );
  let page = pageSrc
    .split("human-identity-meaning-engine")
    .join(p.slug)
    .split("HumanIdentityMeaning")
    .join(pascal(p.slug))
    .split("humanIdentityMeaningEngine")
    .join(p.camel)
    .split("humanIdentityMeaning")
    .join(p.camel.replace(/Engine$/, ""))
    .split("meaningReadinessLevel")
    .join(p.levelLabel)
    .split("discoveryMode")
    .join(p.modeLabel)
    .split("meaningIdentityCenter")
    .join(p.centerLabel)
    .split("humanIdentityEngine")
    .join(p.engineLabel)
    .split("meaningPreservationFramework")
    .join(p.frameworkLabel)
    .split("executiveHumanityReviews")
    .join(p.reviewsLabel)
    .split("meaningCompanion")
    .join(p.companionLabel)
    .split("belongingEngine")
    .join(p.engine2Label)
    .split("agencyPreservationEngine")
    .join(p.engine3Label)
    .split("meaningReflections")
    .join(p.reflectionsLabel)
    .split("agencyNotes")
    .join(p.thirdLabel);

  write(path.join(ROOT, `app/app/${p.slug}/page.tsx`), page);

  for (const route of ["dashboard", "card"]) {
    const apiSrc = fs.readFileSync(
      path.join(ROOT, `app/api/aipify/human-identity-meaning-engine/${route}/route.ts`),
      "utf8",
    );
    const api = apiSrc
      .split("human-identity-meaning-engine")
      .join(p.slug)
      .split("HumanIdentityMeaning")
      .join(pascal(p.slug))
      .split("human_identity_meaning")
      .join(p.snake);
    write(path.join(ROOT, `app/api/aipify/${p.slug}/${route}/route.ts`), api);
  }
}

function genDocs(p) {
  const phaseDoc = `# ${p.title} Engine — Phase ${p.phase}

## Vision

${p.centerTitle} within the Cosmic Stewardship & Multi-Generational Futures Era (171–180). ${p.companion} supports — does NOT replace human judgment, responsibility, or dignity.

## What was built

| Layer | Location |
|-------|----------|
| Migration | \`supabase/migrations/${p.migration}\` |
| Lib | \`lib/aipify/${p.slug}/\` |
| Core helpers | \`lib/core/${p.slug}.ts\` |
| API | \`/api/aipify/${p.slug}/dashboard\`, \`/card\` |
| UI | \`/app/${p.slug}\` |
| KC FAQ | \`content/knowledge/aipify/${p.slug}/faq/implementation-blueprint-phase${p.phase}-faq.md\` |
| Blueprint | \`IMPLEMENTATION_BLUEPRINT_PHASE${p.phase}_${p.title.toUpperCase().replace(/ /g, "_").replace(/&/g, "AND")}.md\` |

## Principle

People First. Wisdom before speed. Growth Partner terminology — never Affiliate. Metadata only — not surveillance or worth scoring.

## Permissions

- \`${p.permPrefix}.view\` — view ${p.centerTitle}
- \`${p.permPrefix}.manage\` — update settings
- \`${p.permPrefix}.steward\` — conduct executive reviews and record metadata scaffolds

## Helpers

- Engine: \`_${p.helper}_*\`
- Blueprint: \`_${p.bp}_*\`
`;
  write(
    path.join(ROOT, `${p.title.toUpperCase().replace(/ /g, "_").replace(/&/g, "AND")}_ENGINE_PHASE${p.phase}.md`),
    phaseDoc,
  );

  const bpDoc = `# Implementation Blueprint — Phase ${p.phase} ${p.title}

## Route

\`/app/${p.slug}\`

## Era

Cosmic Stewardship & Multi-Generational Futures (171–180)

## RPCs

- \`get_${p.snake}_engine_dashboard(p_org_id)\`
- \`get_${p.snake}_engine_card(p_org_id)\`

## Privacy

Metadata scaffolds only. ${p.companion} supports awareness — humans decide.
`;
  write(
    path.join(
      ROOT,
      `IMPLEMENTATION_BLUEPRINT_PHASE${p.phase}_${p.title.toUpperCase().replace(/ /g, "_").replace(/&/g, "AND")}.md`,
    ),
    bpDoc,
  );

  const faq = `# ${p.title} Engine — FAQ (Phase ${p.phase})

## What is the ${p.centerTitle}?

The ${p.centerTitle} at \`/app/${p.slug}\` is part of the **Cosmic Stewardship & Multi-Generational Futures Era (171–180)**. ${p.companion} supports reflection and metadata scaffolds — **not** replacement of human judgment, responsibility, or dignity.

## Does ${p.companion} decide for humans?

**No.** ${p.companion} provides informational support only. Humans retain final accountability.

## What are the permissions?

| Permission | Purpose |
|------------|---------|
| \`${p.permPrefix}.view\` | View center and scaffolds |
| \`${p.permPrefix}.manage\` | Update settings |
| \`${p.permPrefix}.steward\` | Record executive reviews and metadata |

## Is Growth Partner terminology used?

**Yes.** Growth Partner — never Affiliate.
`;
  write(
    path.join(
      ROOT,
      `content/knowledge/aipify/${p.slug}/faq/implementation-blueprint-phase${p.phase}-faq.md`,
    ),
    faq,
  );

  const ilmTxt = `ABOS Phase ${p.phase} — ${p.title}
Route: /app/${p.slug}
Era: Cosmic Stewardship & Multi-Generational Futures (171–180)
Companion: ${p.companion} — supports, does not replace human judgment.
People First. Wisdom before speed. Growth Partner — never Affiliate.
`;
  write(
    path.join(
      ROOT,
      `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase${p.phase}-${p.slug}.txt`,
    ),
    ilmTxt,
  );

  const vocab = `export const IMPLEMENTATION_BLUEPRINT_PHASE${p.phase}_MISSION =
  "${p.centerTitle} — ${p.companion} supports; humans decide.";

export const IMPLEMENTATION_BLUEPRINT_PHASE${p.phase}_PHILOSOPHY =
  "People First. Wisdom before speed. Growth Partner terminology — never Affiliate.";

export const IMPLEMENTATION_BLUEPRINT_PHASE${p.phase}_ROUTE = "/app/${p.slug}";

export const IMPLEMENTATION_BLUEPRINT_PHASE${p.phase}_COMPANION_LIMITATIONS = [
  "replace_human_judgment",
  "assign_worth_or_rank",
  "suppress_individuality",
  "override_leadership_ethics",
  "claim_authorship_or_moral_authority",
] as const;
`;
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${p.phase}-vocabulary.ts`),
    vocab,
  );
}

function genMigration(p, prevDecisionType) {
  const src = fs.readFileSync(
    path.join(ROOT, "supabase/migrations/20261334000000_human_creativity_imagination_amplification_engine_phase174.sql"),
    "utf8",
  );
  let m = src
    .split("Phase 174")
    .join(`Phase ${p.phase}`)
    .split("human_creativity_imagination")
    .join(p.snake)
    .split("Human Creativity & Imagination")
    .join(p.title)
    .split("Creativity & Imagination")
    .join(p.centerTitle.replace(" Center", ""))
    .split("Creativity Center")
    .join(p.centerTitle)
    .split("Creativity Companion")
    .join(p.companion)
    .split("_hcia_")
    .join(`_${p.helper}_`)
    .split("_hciabp174_")
    .join(`_${p.bp}_`)
    .split("hciabp174")
    .join(p.bp)
    .split("human_creativity_imagination_engine")
    .join(p.decisionType)
    .split("human_creativity_imagination.view")
    .join(`${p.permPrefix}.view`)
    .split("human_creativity_imagination.manage")
    .join(`${p.permPrefix}.manage`)
    .split("human_creativity_imagination.steward")
    .join(`${p.permPrefix}.steward`)
    .split("human-creativity-imagination-engine")
    .join(p.slug)
    .split("20261334000000_human_creativity_imagination_amplification_engine_phase174.sql")
    .join(p.migration)
    .split("IMPLEMENTATION_BLUEPRINT_PHASE174_HUMAN_CREATIVITY_IMAGINATION_AMPLIFICATION.md")
    .join(
      `IMPLEMENTATION_BLUEPRINT_PHASE${p.phase}_${p.title.toUpperCase().replace(/ /g, "_").replace(/&/g, "AND")}.md`,
    );

  // Add decision type after previous
  m = m.replace(
    `'${prevDecisionType}'`,
    `'${prevDecisionType}',\n    '${p.decisionType}'`,
  );

  if (p.phase === 175) {
    m = customize175(m, p);
  } else if (p.phase === 176) {
    m = customize176(m, p);
  } else if (p.phase === 177) {
    m = customize177(m, p);
  }

  write(path.join(ROOT, `supabase/migrations/${p.migration}`), m);
}

function customize175(m, p) {
  return m
    .replace(/creativity_readiness_level|creative_safety_level/g, "wisdom_readiness_level")
    .replace(/imagination_mode/g, "judgment_mode")
    .replace(/exploratory', 'collaborative/g, "reflective', 'council_led")
    .replace(/exploration_programs_enabled/g, "discernment_programs_enabled")
    .replace(/innovation_reflection_enabled/g, "ethical_reflection_enabled")
    .replace(/companion_brainstorming_enabled/g, "wisdom_companion_enabled")
    .replace(/experimentation_enabled/g, "judgment_support_enabled")
    .replace(/collective_creativity_enabled/g, "stakeholder_awareness_enabled")
    .replace(/human_creativity_imagination_experiments/g, "human_wisdom_augmented_judgment_notes")
    .replace(/experiment_key/g, "note_key")
    .replace(/experiment_type/g, "note_type")
    .replace(/_seed_experiments/g, "_seed_judgment_notes")
    .replace(/experiments_count/g, "judgment_notes_count")
    .replace(/active_experiments_count/g, "active_judgment_notes_count")
    .replace(/record_imagination_reflection/g, "record_wisdom_reflection")
    .replace(/record_executive_creativity_review/g, "record_executive_wisdom_review")
    .replace(/not_artistic_judgment/g, "not_moral_judgment")
    .replace(/not_replace_imagination/g, "not_replace_judgment")
    .replace(/not_authorship_claims/g, "not_moral_authority")
    .replace(
      /innovation_culture', 'psychological_safety', 'experimentation_support',\s*'diverse_perspectives', 'leadership_accessibility/g,
      "discernment_culture', 'ethical_reflection', 'judgment_support', 'wisdom_stewardship', 'leadership_humility",
    )
    .replace(
      /possibilities_overlooked', 'assumptions_to_question', 'ideas_to_explore',\s*'diverse_perspectives', 'build_together', 'cross_functional_exchange',\s*'learning_review', 'opportunity_exploration/g,
      "tradeoff_exploration', 'stakeholder_perspectives', 'long_term_consequences', 'values_alignment', 'uncertainty_acknowledgment', 'lesson_synthesis', 'ethical_considerations', 'wisdom_continuity",
    )
    .replace(/human_creativity_imagination_score/g, "human_wisdom_judgment_score")
    .replace(/_hciabp174_creativity_center/g, `_${p.bp}_wisdom_center`)
    .replace(/_hciabp174_imagination_engine/g, `_${p.bp}_judgment_engine`)
    .replace(/_hciabp174_creative_safety_framework/g, `_${p.bp}_wisdom_framework`)
    .replace(/_hciabp174_executive_creativity_reviews/g, `_${p.bp}_executive_wisdom_reviews`)
    .replace(/_hciabp174_creativity_companion/g, `_${p.bp}_wisdom_companion`)
    .replace(/_hciabp174_experimentation_engine/g, `_${p.bp}_discernment_engine`)
    .replace(/_hciabp174_collective_creativity_engine/g, `_${p.bp}_ethical_reflection_engine`)
    .replace(/creativity_center_meta/g, "wisdom_center_meta")
    .replace(/imagination_engine_meta/g, "judgment_engine_meta")
    .replace(/creative_safety_framework_meta/g, "wisdom_framework_meta")
    .replace(/executive_creativity_reviews_meta/g, "executive_wisdom_reviews_meta")
    .replace(/creativity_companion_meta/g, "wisdom_companion_meta")
    .replace(/experimentation_engine_meta/g, "discernment_engine_meta")
    .replace(/collective_creativity_engine_meta/g, "ethical_reflection_engine_meta")
    .replace(/imagination_reflections/g, "wisdom_reflections")
    .replace(/'experiments'/g, "'judgment_notes'")
    .replace(/amplify human creativity/g, "augment human wisdom and judgment")
    .replace(/Cross-link Phase 173/g, "Cross-link DSE /app/assistant/decisions and Phase 173")
    .replace(/Curiosity Discovery/g, "Decision Support Engine DSE")
    .replace(/curiosity-discovery-engine/g, "assistant/decisions")
    .replace(/human_creativity_imagination/g, "human_wisdom_augmented_judgment")
    .replace(/Era 171–174/g, "Era 171–175")
    .replace(/phase', 174/g, "phase', 175")
    .replace(/Human Creativity & Imagination Phase 174/g, "Human Wisdom & Augmented Judgment Phase 175");
}

function customize176(m, p) {
  let r = customize175(m, p);
  return r
    .replace(/human_wisdom_augmented_judgment/g, "human_agency_responsible_autonomy")
    .replace(/human_wisdom_judgment/g, "human_agency_autonomy")
    .replace(/wisdom_readiness_level/g, "agency_readiness_level")
    .replace(/judgment_mode/g, "autonomy_mode")
    .replace(/reflective', 'council_led/g, "guided', 'delegated")
    .replace(/discernment_programs_enabled/g, "autonomy_programs_enabled")
    .replace(/ethical_reflection_enabled/g, "consent_practices_enabled")
    .replace(/wisdom_companion_enabled/g, "agency_companion_enabled")
    .replace(/judgment_support_enabled/g, "accountability_enabled")
    .replace(/stakeholder_awareness_enabled/g, "override_prevention_enabled")
    .replace(/human_wisdom_augmented_judgment_notes/g, "human_agency_responsible_autonomy_notes")
    .replace(/_seed_judgment_notes/g, "_seed_autonomy_notes")
    .replace(/judgment_notes_count/g, "autonomy_notes_count")
    .replace(/active_judgment_notes_count/g, "active_autonomy_notes_count")
    .replace(/record_wisdom_reflection/g, "record_agency_reflection")
    .replace(/record_executive_wisdom_review/g, "record_executive_agency_review")
    .replace(/not_moral_judgment/g, "not_replace_responsibility")
    .replace(/not_replace_judgment/g, "not_override_consent")
    .replace(/not_moral_authority/g, "not_autonomous_execution")
    .replace(
      /discernment_culture', 'ethical_reflection', 'judgment_support', 'wisdom_stewardship', 'leadership_humility/g,
      "autonomy_culture', 'consent_practices', 'accountability_balance', 'responsible_autonomy', 'leadership_delegation",
    )
    .replace(
      /tradeoff_exploration', 'stakeholder_perspectives', 'long_term_consequences', 'values_alignment', 'uncertainty_acknowledgment', 'lesson_synthesis', 'ethical_considerations', 'wisdom_continuity/g,
      "choice_awareness', 'consent_reflection', 'responsibility_honoring', 'delegation_clarity', 'override_prevention', 'autonomy_boundaries', 'accountability_themes', 'action_center_alignment",
    )
    .replace(/_hwajbp175_wisdom_center/g, `_${p.bp}_agency_center`)
    .replace(/_hwajbp175_judgment_engine/g, `_${p.bp}_autonomy_engine`)
    .replace(/_hwajbp175_wisdom_framework/g, `_${p.bp}_responsible_autonomy_framework`)
    .replace(/_hwajbp175_executive_wisdom_reviews/g, `_${p.bp}_executive_agency_reviews`)
    .replace(/_hwajbp175_wisdom_companion/g, `_${p.bp}_agency_companion`)
    .replace(/_hwajbp175_discernment_engine/g, `_${p.bp}_accountability_engine`)
    .replace(/_hwajbp175_ethical_reflection_engine/g, `_${p.bp}_consent_engine`)
    .replace(/wisdom_center_meta/g, "agency_center_meta")
    .replace(/judgment_engine_meta/g, "autonomy_engine_meta")
    .replace(/wisdom_framework_meta/g, "responsible_autonomy_framework_meta")
    .replace(/executive_wisdom_reviews_meta/g, "executive_agency_reviews_meta")
    .replace(/wisdom_companion_meta/g, "agency_companion_meta")
    .replace(/discernment_engine_meta/g, "accountability_engine_meta")
    .replace(/ethical_reflection_engine_meta/g, "consent_engine_meta")
    .replace(/wisdom_reflections/g, "agency_reflections")
    .replace(/'judgment_notes'/g, "'autonomy_notes'")
    .replace(/augment human wisdom and judgment/g, "support human agency and responsible autonomy")
    .replace(/assistant\/decisions/g, "approvals")
    .replace(/Decision Support Engine DSE/g, "Trust & Action approvals and Action Center")
    .replace(/Era 171–175/g, "Era 171–176")
    .replace(/phase', 175/g, "phase', 176")
    .replace(/Human Wisdom & Augmented Judgment Phase 175/g, "Human Agency & Responsible Autonomy Phase 176")
    .replace(/_hwaj_/g, `_${p.helper}_`)
    .replace(/hwajbp175/g, p.bp);
}

function customize177(m, p) {
  let r = customize176(m, p);
  return r
    .replace(/human_agency_responsible_autonomy/g, "human_dignity_technological_humility")
    .replace(/human_agency_autonomy/g, "human_dignity_humility")
    .replace(/agency_readiness_level/g, "dignity_readiness_level")
    .replace(/autonomy_mode/g, "humility_mode")
    .replace(/guided', 'delegated/g, "reflective', 'compassion_led")
    .replace(/autonomy_programs_enabled/g, "dignity_programs_enabled")
    .replace(/consent_practices_enabled/g, "compassion_enabled")
    .replace(/agency_companion_enabled/g, "dignity_companion_enabled")
    .replace(/accountability_enabled/g, "humility_practices_enabled")
    .replace(/override_prevention_enabled/g, "intrinsic_worth_enabled")
    .replace(/human_agency_responsible_autonomy_notes/g, "human_dignity_technological_humility_compassion_notes")
    .replace(/_seed_autonomy_notes/g, "_seed_compassion_notes")
    .replace(/autonomy_notes_count/g, "compassion_notes_count")
    .replace(/active_autonomy_notes_count/g, "active_compassion_notes_count")
    .replace(/record_agency_reflection/g, "record_dignity_reflection")
    .replace(/record_executive_agency_review/g, "record_executive_humility_review")
    .replace(/not_replace_responsibility/g, "not_worth_scoring")
    .replace(/not_override_consent/g, "not_assign_human_value")
    .replace(/not_autonomous_execution/g, "not_replace_leadership")
    .replace(
      /autonomy_culture', 'consent_practices', 'accountability_balance', 'responsible_autonomy', 'leadership_delegation/g,
      "dignity_preservation', 'technological_humility', 'compassion_culture', 'human_value_awareness', 'leadership_humility",
    )
    .replace(
      /choice_awareness', 'consent_reflection', 'responsibility_honoring', 'delegation_clarity', 'override_prevention', 'autonomy_boundaries', 'accountability_themes', 'action_center_alignment/g,
      "intrinsic_worth', 'compassion_practice', 'self_respect', 'individuality_honoring', 'performance_balance', 'technological_limits', 'leadership_dignity', 'cross_generational_respect",
    )
    .replace(/_haarbp176_agency_center/g, `_${p.bp}_dignity_center`)
    .replace(/_haarbp176_autonomy_engine/g, `_${p.bp}_human_dignity_engine`)
    .replace(/_haarbp176_responsible_autonomy_framework/g, `_${p.bp}_technological_humility_framework`)
    .replace(/_haarbp176_executive_agency_reviews/g, `_${p.bp}_executive_humility_reviews`)
    .replace(/_haarbp176_agency_companion/g, `_${p.bp}_dignity_companion`)
    .replace(/_haarbp176_accountability_engine/g, `_${p.bp}_compassion_engine`)
    .replace(/_haarbp176_consent_engine/g, `_${p.bp}_human_value_framework`)
    .replace(/agency_center_meta/g, "dignity_center_meta")
    .replace(/autonomy_engine_meta/g, "human_dignity_engine_meta")
    .replace(/responsible_autonomy_framework_meta/g, "technological_humility_framework_meta")
    .replace(/executive_agency_reviews_meta/g, "executive_humility_reviews_meta")
    .replace(/agency_companion_meta/g, "dignity_companion_meta")
    .replace(/accountability_engine_meta/g, "compassion_engine_meta")
    .replace(/consent_engine_meta/g, "human_value_framework_meta")
    .replace(/agency_reflections/g, "dignity_reflections")
    .replace(/'autonomy_notes'/g, "'compassion_notes'")
    .replace(/support human agency and responsible autonomy/g, "preserve human dignity with technological humility")
    .replace(/approvals/g, "human-identity-meaning-engine")
    .replace(/Trust & Action approvals and Action Center/g, "Human Flourishing Phase 170 and Inclusion & Humanity")
    .replace(/human-flourishing-engine/g, "human-flourishing-engine")
    .replace(/Era 171–176/g, "Era 171–177")
    .replace(/phase', 176/g, "phase', 177")
    .replace(/Human Agency & Responsible Autonomy Phase 176/g, "Human Dignity & Technological Humility Phase 177")
    .replace(/_haar_/g, `_${p.helper}_`)
    .replace(/haarbp176/g, p.bp)
    .replace(
      /Define personal identity',\s*'Impose purpose or meaning',\s*'Assign worth by productivity',\s*'Replace human relationships',\s*'Suppress individuality or cultural identity',\s*'Override leadership judgment on humanity matters/g,
      "Assign human worth or rank',\n      'Replace leadership judgment',\n      'Reduce people to metrics',\n      'Suppress individuality',\n      'Override ethics',\n      'Claim moral authority over dignity",
    );
}

// First create human-creativity-imagination-engine lib from human-identity-meaning adapted
function ensure174Lib() {
  const src = path.join(ROOT, "lib/aipify/human-identity-meaning-engine");
  const dst = path.join(ROOT, "lib/aipify/human-creativity-imagination-engine");
  if (!fs.existsSync(dst)) {
    fs.mkdirSync(dst, { recursive: true });
    for (const f of ["types.ts", "parse.ts", "index.ts"]) {
      let c = fs.readFileSync(path.join(src, f), "utf8");
      const p = PHASES[0];
      c = c
        .split("human_identity_meaning")
        .join("human_creativity_imagination")
        .split("HumanIdentityMeaning")
        .join("HumanCreativityImagination")
        .split("himpbp173")
        .join("hciabp174")
        .split("meaning_readiness_level")
        .join("creative_safety_level")
        .split("discovery_mode")
        .join("imagination_mode")
        .split("meaning_reflections")
        .join("imagination_reflections")
        .split("MeaningReflection")
        .join("ImaginationReflection")
        .split("agency_notes")
        .join("experiments")
        .split("AgencyNote")
        .join("Experiment")
        .split("meaning_identity_center_meta")
        .join("creativity_center_meta")
        .split("human_identity_engine_meta")
        .join("imagination_engine_meta")
        .split("meaning_preservation_framework_meta")
        .join("creative_safety_framework_meta")
        .split("executive_humanity_reviews_meta")
        .join("executive_creativity_reviews_meta")
        .split("meaning_companion_meta")
        .join("creativity_companion_meta")
        .split("belonging_engine_meta")
        .join("experimentation_engine_meta")
        .split("agency_preservation_engine_meta")
        .join("collective_creativity_engine_meta");
      fs.writeFileSync(path.join(dst, f), c);
    }
  }
  const panelDst = path.join(
    ROOT,
    "components/app/human-creativity-imagination-engine/HumanCreativityImaginationEngineDashboardPanel.tsx",
  );
  if (!fs.existsSync(panelDst)) {
    const panelSrc = path.join(
      ROOT,
      "components/app/human-identity-meaning-engine/HumanIdentityMeaningEngineDashboardPanel.tsx",
    );
    let panel = fs.readFileSync(panelSrc, "utf8");
    panel = panel
      .split("human-identity-meaning-engine")
      .join("human-creativity-imagination-engine")
      .split("HumanIdentityMeaning")
      .join("HumanCreativityImagination")
      .split("human_identity_meaning")
      .join("human_creativity_imagination")
      .split("himpbp173")
      .join("hciabp174")
      .split("meaning_readiness_level")
      .join("creative_safety_level")
      .split("discovery_mode")
      .join("imagination_mode")
      .split("meaningReadinessLevel")
      .join("creativeSafetyLevel")
      .split("discoveryMode")
      .join("imaginationMode")
      .split("meaning_reflections")
      .join("imagination_reflections")
      .split("meaningReflections")
      .join("imaginationReflections")
      .split("agency_notes")
      .join("experiments")
      .split("AgencyNote")
      .join("Experiment")
      .split("AgencyRow")
      .join("ExperimentRow")
      .split("agencyNotes")
      .join("experiments")
      .split("meaning_identity_center_meta")
      .join("creativity_center_meta")
      .split("human_identity_engine_meta")
      .join("imagination_engine_meta")
      .split("meaning_preservation_framework_meta")
      .join("creative_safety_framework_meta")
      .split("executive_humanity_reviews_meta")
      .join("executive_creativity_reviews_meta")
      .split("meaning_companion_meta")
      .join("creativity_companion_meta")
      .split("belonging_engine_meta")
      .join("experimentation_engine_meta")
      .split("agency_preservation_engine_meta")
      .join("collective_creativity_engine_meta")
      .split("meaningIdentityCenter")
      .join("creativityCenter")
      .split("humanIdentityEngine")
      .join("imaginationEngine")
      .split("meaningPreservationFramework")
      .join("creativeSafetyFramework")
      .split("executiveHumanityReviews")
      .join("executiveCreativityReviews")
      .split("meaningCompanion")
      .join("creativityCompanion")
      .split("belongingEngine")
      .join("experimentationEngine")
      .split("agencyPreservationEngine")
      .join("collectiveCreativityEngine");
    fs.mkdirSync(path.dirname(panelDst), { recursive: true });
    fs.writeFileSync(panelDst, panel);
  }
}

ensure174Lib();

let prevDecision = "human_identity_meaning_engine";
for (const p of PHASES) {
  genCore(p);
  genTsStack(p);
  genDocs(p);
  if (!p.skipMigration) {
    genMigration(p, prevDecision);
    prevDecision = p.decisionType;
  }
}

console.log("Done generating phases 174-177");
