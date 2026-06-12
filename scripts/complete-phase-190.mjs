#!/usr/bin/env node
/**
 * Complete ABOS Phase 190 — Humanity's Shared Legacy & Flourishing Engine (era capstone 181–190).
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const P = {
  phase: 190,
  migration: "20261350000000_humanity_shared_legacy_flourishing_engine_phase190.sql",
  slug: "shared-legacy-flourishing-engine",
  base: "SharedLegacyFlourishing",
  camel: "sharedLegacyFlourishingEngine",
  snake: "humanity_shared_legacy_flourishing",
  permPrefix: "shared_legacy_flourishing",
  helper: "hslf",
  bp: "hslfbp190",
  decisionType: "humanity_shared_legacy_flourishing_engine",
  prevDecision: "humanity_shared_humility_continuous_renewal_engine",
  title: "Humanity's Shared Legacy & Flourishing",
  centerTitle: "Flourishing Center",
  companion: "Legacy Companion",
  scoreKey: "humanity_shared_legacy_flourishing_score",
  modeKey: "flourishing_mode",
  levelKey: "legacy_readiness_level",
  thirdEntity: "legacy_notes",
  era: "Universal Stewardship & Shared Futures Era (181–190)",
  eraRange: "181–190",
  docSlug: "HUMANITY_SHARED_LEGACY_FLOURISHING_ENGINE",
  ilmFile: "implementation-blueprint-phase190-shared-legacy-flourishing.txt",
  navLabel: "Shared Legacy",
  crossLinkNote:
    "Cross-links only: human_flourishing_engine, legacy_engine, Phase 189 humility renewal, Phase 188 gratitude — never duplicate RPCs.",
  ilmExtra: `
Flourishing Center: human flourishing reviews, leadership legacy sessions, companion reflection, Growth Partner development programs, belonging assessments, knowledge stewardship frameworks, intergenerational opportunity dashboards, legacy knowledge libraries.
Flourishing Engine prompts: How are people growing? How do we strengthen belonging? How are opportunities expanding? How do we preserve dignity? What legacy are we creating together?
Shared Legacy Framework: people development, leadership stewardship, Growth Partner success, community contributions, knowledge preservation, recognition practices, future preparedness.
Executive Legacy Reviews, Legacy Companion, Flourishing Culture Engine, Humanity Engine.
Companion limitations: no defining human worth, no replacing relationships, no overriding leadership, no determining personal purpose, no suppressing individuality.
Self Love in flourishing: self-awareness, compassion, gratitude, confidence, humility, intrinsic worth recognition.`,
  faqBody: `## What is Shared Legacy?

Shared Legacy refers to the opportunities, wisdom, and human flourishing that organizations help create for future generations — at \`/app/shared-legacy-flourishing-engine\`.

## Can Aipify determine what a meaningful life looks like?

**No.** Meaning remains deeply personal. Aipify supports reflection, growth, and stewardship.

## Why focus on flourishing?

Because sustainable success depends upon the wellbeing, development, and dignity of people.

## Can organizations strengthen both performance and humanity?

Yes. The healthiest institutions recognize that long-term excellence depends upon helping people thrive.

## Why include Self Love in flourishing?

Because self-awareness, gratitude, and compassion strengthen people's ability to contribute positively to others.`,
  companionLimitations: [
    "define_human_worth",
    "replace_relationships",
    "override_leadership",
    "determine_personal_purpose",
    "suppress_individuality",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom188(content) {
  const engine = `${P.base}Engine`;
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["SharedGratitudeAppreciativeStewardship", P.base],
    ["shared-gratitude-appreciative-stewardship-engine", P.slug],
    ["humanity_shared_gratitude_appreciative_stewardship", P.snake],
    ["sharedGratitudeAppreciativeStewardship", P.camel.replace(/Engine$/, "")],
    ["sharedGratitudeAppreciativeStewardshipEngine", P.camel],
    ["hsgasbp188", P.bp],
    ["_hsgas_", `_${P.helper}_`],
    ["humanity_shared_gratitude_appreciative_stewardship_score", P.scoreKey],
    ["gratitude_mode", P.modeKey],
    ["appreciation_readiness_level", P.levelKey],
    ["recognition_notes", P.thirdEntity],
    ["RecognitionNote", thirdPascal.slice(0, -1) === "Note" ? thirdPascal : thirdPascal],
    ["recognition_notes_count", `${P.thirdEntity}_count`],
    ["Appreciative Stewardship Center", P.centerTitle],
    ["Appreciative Stewardship", "Flourishing"],
    ["Gratitude Companion", P.companion],
    ["Humanity's Shared Gratitude & Appreciative Stewardship", P.title],
    ["Shared Gratitude & Appreciative Stewardship", "Shared Legacy & Flourishing"],
    ["Phase 188", `Phase ${P.phase}`],
    ["181–188", `181–${P.phase}`],
    ["Era 181–188", `Era 181–${P.phase}`],
    ["humanity_shared_gratitude_appreciative_stewardship_engine", P.decisionType],
    ["shared_gratitude_stewardship.view", `${P.permPrefix}.view`],
    ["shared_gratitude_stewardship.manage", `${P.permPrefix}.manage`],
    ["shared_gratitude_stewardship.steward", `${P.permPrefix}.steward`],
    [
      "20261348000000_humanity_shared_gratitude_appreciative_stewardship_engine_phase188.sql",
      P.migration,
    ],
    ["Repo Phase 188", `Repo Phase ${P.phase}`],
    ["Phase 188 —", `Phase ${P.phase} —`],
    ["Human Agency & Autonomy Phase 188", `${P.title} Phase ${P.phase}`],
    ["Human Hope & Appreciative Stewardship", `${P.title}`],
    ["shared-gratitude-appreciative-stewardship-engine", P.slug],
    ["sharedGratitudeAppreciativeStewardshipEngine", P.camel],
    ["gratitude", "flourishing"],
    ["Gratitude", "Legacy"],
    ["appreciation", "legacy"],
    ["Appreciation", "Legacy"],
    ["recognition", "legacy"],
    ["Recognition", "Legacy"],
    ["IMPLEMENTATION_BLUEPRINT_PHASE188", `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}`],
    ["HUMANITY_SHARED_GRATITUDE_APPRECIATIVE_STEWARDSHIP", P.docSlug],
    ["implementation-blueprint-phase188", `implementation-blueprint-phase${P.phase}`],
    ["Phase 186 compassion", P.prevDecision],
    ["Phase 183 shared purpose", "Phase 189 humility renewal"],
    ["humanity_shared_courage_responsible_action_engine", P.prevDecision],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function genCore() {
  const engine = `${P.base}Engine`;
  write(
    path.join(ROOT, `lib/core/${P.slug}.ts`),
    `/**
 * ${P.title} Engine helpers (Phase ${P.phase}).
 * Authoritative enforcement lives in Supabase RPCs (_${P.helper}_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function get${engine}Dashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_${P.snake}_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function get${engine}Card(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_${P.snake}_engine_card");
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

function genTsStack() {
  const engine = `${P.base}Engine`;
  const srcDir = path.join(ROOT, "lib/aipify/shared-gratitude-appreciative-stewardship-engine");
  const dstDir = path.join(ROOT, `lib/aipify/${P.slug}`);
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dstDir, f), transformFrom188(fs.readFileSync(path.join(srcDir, f), "utf8")));
  }

  const panelSrc = path.join(
    ROOT,
    `components/app/shared-gratitude-appreciative-stewardship-engine/SharedGratitudeAppreciativeStewardshipEngineDashboardPanel.tsx`,
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/${engine}DashboardPanel.tsx`),
    transformFrom188(fs.readFileSync(panelSrc, "utf8")),
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/index.ts`),
    `export { ${engine}DashboardPanel } from "./${engine}DashboardPanel";\n`,
  );

  const pageSrc = fs.readFileSync(
    path.join(ROOT, "app/app/shared-gratitude-appreciative-stewardship-engine/page.tsx"),
    "utf8",
  );
  write(path.join(ROOT, `app/app/${P.slug}/page.tsx`), transformFrom188(pageSrc));

  for (const route of ["dashboard", "card"]) {
    const apiSrc = fs.readFileSync(
      path.join(ROOT, `app/api/aipify/shared-gratitude-appreciative-stewardship-engine/${route}/route.ts`),
      "utf8",
    );
    write(path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`), transformFrom188(apiSrc));
  }
}

function patchMigrationBlueprint(sql) {
  const eraLinks = `create or replace function public._${P.bp}_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 181, 'key', 'universal_stewardship', 'label', 'Universal Stewardship Phase 181', 'route', '/app/universal-stewardship-shared-futures-engine', 'description', 'Era opener'),
    jsonb_build_object('phase', 182, 'key', 'collective_wisdom', 'label', 'Collective Wisdom Phase 182', 'route', '/app/collective-wisdom-shared-learning-engine', 'description', 'Shared learning'),
    jsonb_build_object('phase', 183, 'key', 'shared_purpose', 'label', 'Shared Purpose Phase 183', 'route', '/app/shared-purpose-contribution-engine', 'description', 'Purpose & contribution'),
    jsonb_build_object('phase', 184, 'key', 'shared_resilience', 'label', 'Shared Resilience Phase 184', 'route', '/app/shared-resilience-adaptive-capacity-engine', 'description', 'Adaptive capacity'),
    jsonb_build_object('phase', 185, 'key', 'shared_trust', 'label', 'Shared Trust Phase 185', 'route', '/app/shared-trust-cooperative-intelligence-engine', 'description', 'Cooperative intelligence'),
    jsonb_build_object('phase', 186, 'key', 'shared_compassion', 'label', 'Shared Compassion Phase 186', 'route', '/app/shared-compassion-reciprocal-care-engine', 'description', 'Reciprocal care'),
    jsonb_build_object('phase', 187, 'key', 'shared_courage', 'label', 'Shared Courage Phase 187', 'route', '/app/shared-courage-responsible-action-engine', 'description', 'Responsible action'),
    jsonb_build_object('phase', 188, 'key', 'shared_gratitude', 'label', 'Shared Gratitude Phase 188', 'route', '/app/shared-gratitude-appreciative-stewardship-engine', 'description', 'Appreciative stewardship'),
    jsonb_build_object('phase', 189, 'key', 'shared_humility', 'label', 'Shared Humility Phase 189', 'route', '/app/shared-humility-continuous-renewal-engine', 'description', 'Continuous renewal — cross-link only')
  ); $$;`;

  sql = sql.replace(
    /create or replace function public\._hslfbp190_era_opener_summary\(\)[\s\S]*?\$\$;/,
    eraLinks,
  );

  sql = sql.replace(
    /create or replace function public\._hslfbp190_mission\(\) returns text language sql immutable as \$\$ select '[^']*'; \$\$;/,
    `create or replace function public._${P.bp}_mission() returns text language sql immutable as $$ select 'Help organizations pursue flourishing as the measure of success — stewardship, service, and commitment to helping people thrive — without defining personal meaning.'; $$;`,
  );

  sql = sql.replace(
    /create or replace function public\._hslfbp190_philosophy\(\) returns text language sql immutable as \$\$ select '[^']*'; \$\$;/,
    `create or replace function public._${P.bp}_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;`,
  );

  sql = sql.replace(
    /create or replace function public\._hslfbp190_abos_principle\(\) returns text language sql immutable as \$\$[\s\S]*?\$\$;/,
    `create or replace function public._${P.bp}_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} capstone aggregates visibility across Universal Stewardship Era (${P.eraRange}). Humans decide; ${P.companion} informs and prepares.'; $$;`,
  );

  sql = sql.replace(
    /create or replace function public\._hslfbp190_vision\(\) returns text language sql immutable as \$\$ select '[^']*'; \$\$;/,
    `create or replace function public._${P.bp}_vision() returns text language sql immutable as $$ select 'Organizations where flourishing becomes the measure of success — people leave stronger than they were found.'; $$;`,
  );

  sql = sql.replace(
    /create or replace function public\._hslfbp190_agency_center\(\) returns jsonb[\s\S]*?\$\$;/,
    `create or replace function public._${P.bp}_flourishing_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'flourishing_reviews', 'label', 'Human flourishing reviews'),
    jsonb_build_object('key', 'legacy_sessions', 'label', 'Leadership legacy sessions'),
    jsonb_build_object('key', 'companion_reflection', 'label', 'Companion reflection experiences'),
    jsonb_build_object('key', 'growth_partner_programs', 'label', 'Growth Partner development programs'),
    jsonb_build_object('key', 'belonging_assessments', 'label', 'Belonging assessments'),
    jsonb_build_object('key', 'knowledge_stewardship', 'label', 'Knowledge stewardship frameworks'),
    jsonb_build_object('key', 'intergenerational_dashboards', 'label', 'Intergenerational opportunity dashboards'),
    jsonb_build_object('key', 'legacy_libraries', 'label', 'Legacy knowledge libraries')
  )); $$;`,
  );

  sql = sql.replace(
    /create or replace function public\._hslfbp190_human_agency_engine\(\) returns jsonb[\s\S]*?\$\$;/,
    `create or replace function public._${P.bp}_flourishing_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Flourishing reflection prompts — humans decide.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'people_growing', 'label', 'How are people growing here?'),
    jsonb_build_object('key', 'belonging', 'label', 'How do we strengthen belonging?'),
    jsonb_build_object('key', 'opportunities', 'label', 'How are opportunities expanding?'),
    jsonb_build_object('key', 'dignity', 'label', 'How do we preserve dignity?'),
    jsonb_build_object('key', 'legacy_together', 'label', 'What legacy are we creating together?')
  )); $$;`,
  );

  sql = sql.replace(
    /create or replace function public\._hslfbp190_responsible_autonomy_framework\(\) returns jsonb[\s\S]*?\$\$;/,
    `create or replace function public._${P.bp}_shared_legacy_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Shared legacy framework — periodic reflection.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'people_development', 'label', 'People development'),
    jsonb_build_object('key', 'leadership_stewardship', 'label', 'Leadership stewardship'),
    jsonb_build_object('key', 'growth_partner_success', 'label', 'Growth Partner success'),
    jsonb_build_object('key', 'community_contributions', 'label', 'Community contributions'),
    jsonb_build_object('key', 'knowledge_preservation', 'label', 'Knowledge preservation'),
    jsonb_build_object('key', 'legacy_practices', 'label', 'Legacy practices'),
    jsonb_build_object('key', 'future_preparedness', 'label', 'Future preparedness')
  )); $$;`,
  );

  sql = sql.replace(
    /create or replace function public\._hslfbp190_executive_agency_reviews\(\) returns jsonb[\s\S]*?\$\$;/,
    `create or replace function public._${P.bp}_executive_legacy_reviews() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive legacy reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'remembered_actions', 'label', 'How will our actions be remembered?'),
    jsonb_build_object('key', 'opportunities_created', 'label', 'What opportunities are we creating?'),
    jsonb_build_object('key', 'strengthening_others', 'label', 'How are we strengthening others?'),
    jsonb_build_object('key', 'preserve_values', 'label', 'How do we preserve our values?'),
    jsonb_build_object('key', 'future_generations', 'label', 'How do we support future generations?')
  )); $$;`,
  );

  sql = sql.replace(
    /create or replace function public\._hslfbp190_agency_companion\(\) returns jsonb[\s\S]*?\$\$;/,
    `create or replace function public._${P.bp}_legacy_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', '${P.companion} — supports, does not define meaning.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts'),
    jsonb_build_object('key', 'leadership_briefings', 'label', 'Leadership briefings'),
    jsonb_build_object('key', 'preparedness_summaries', 'label', 'Preparedness summaries'),
    jsonb_build_object('key', 'knowledge_recommendations', 'label', 'Knowledge recommendations'),
    jsonb_build_object('key', 'legacy_insights', 'label', 'Legacy insights'),
    jsonb_build_object('key', 'intergenerational_learning', 'label', 'Intergenerational learning resources')
  )); $$;`,
  );

  sql = sql.replace(
    /create or replace function public\._hslfbp190_human_oversight_engine\(\) returns jsonb[\s\S]*?\$\$;/,
    `create or replace function public._${P.bp}_flourishing_culture_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Flourishing culture engine — metadata only.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'mentorship', 'label', 'Mentorship programs'),
    jsonb_build_object('key', 'leadership_development', 'label', 'Leadership development'),
    jsonb_build_object('key', 'growth_partner_enablement', 'label', 'Growth Partner enablement'),
    jsonb_build_object('key', 'legacy_systems', 'label', 'Legacy systems'),
    jsonb_build_object('key', 'learning_communities', 'label', 'Learning communities'),
    jsonb_build_object('key', 'cross_generational', 'label', 'Cross-generational collaboration')
  )); $$;`,
  );

  sql = sql.replace(
    /create or replace function public\._hslfbp190_companion_limitations\(\) returns jsonb[\s\S]*?\$\$;/,
    `create or replace function public._${P.bp}_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Define human worth',
      'Replace authentic relationships',
      'Override leadership responsibilities',
      'Determine personal purpose',
      'Suppress individuality'), 'principle', '${P.companion} supports — humans decide.'); $$;`,
  );

  sql = sql.replace(
    /create or replace function public\._hslfbp190_extended_cross_links\(\) returns jsonb[\s\S]*?\$\$;/,
    `create or replace function public._${P.bp}_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'human_flourishing', 'label', 'Human Flourishing Engine', 'route', '/app/human-flourishing-engine', 'relationship', 'Flourishing — cross-link only'),
    jsonb_build_object('key', 'legacy_engine', 'label', 'Legacy Engine', 'route', '/app/legacy-engine', 'relationship', 'Legacy stewardship — cross-link only'),
    jsonb_build_object('key', 'shared_gratitude', 'label', 'Shared Gratitude Phase 188', 'route', '/app/shared-gratitude-appreciative-stewardship-engine', 'relationship', 'Gratitude — cross-link only'),
    jsonb_build_object('key', 'shared_humility', 'label', 'Shared Humility Phase 189', 'route', '/app/shared-humility-continuous-renewal-engine', 'relationship', 'Renewal — cross-link only')
  ); $$;`,
  );

  sql = sql.replace(/agency_center/g, "flourishing_center");
  sql = sql.replace(/human_agency_engine/g, "flourishing_engine");
  sql = sql.replace(/responsible_autonomy_framework/g, "shared_legacy_framework");
  sql = sql.replace(/executive_agency_reviews/g, "executive_legacy_reviews");
  sql = sql.replace(/agency_companion/g, "legacy_companion");
  sql = sql.replace(/human_oversight_engine/g, "flourishing_culture_engine");

  sql = sql.replace(
    /select 'shared-gratitude-appreciative-stewardship-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', 195
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  if (!sql.includes(P.decisionType)) {
    sql = sql.replace(
      `'${P.prevDecision}'`,
      `'${P.prevDecision}',\n    '${P.decisionType}'`,
    );
  }

  return sql;
}

function genMigration() {
  let m = transformFrom188(
    fs.readFileSync(
      path.join(
        ROOT,
        "supabase/migrations/20261348000000_humanity_shared_gratitude_appreciative_stewardship_engine_phase188.sql",
      ),
      "utf8",
    ),
  );
  m = m.replace(
    /-- Phase \d+ —[^\n]+\n-- Universal Stewardship[^\n]+\n-- [^\n]+\n-- Helpers:[^\n]+/,
    `-- Phase ${P.phase} — ${P.title} Engine\n-- ${P.era} — ${P.centerTitle} (era capstone).\n-- Helpers: _${P.helper}_* (engine), _${P.bp}_* (blueprint)`,
  );
  if (!m.includes(P.prevDecision)) {
    m = m.replace(
      "'humanity_shared_gratitude_appreciative_stewardship_engine'",
      `'humanity_shared_gratitude_appreciative_stewardship_engine',\n    '${P.prevDecision}',\n    '${P.decisionType}'`,
    );
  } else {
    m = m.replace(
      `'${P.prevDecision}'`,
      `'${P.prevDecision}',\n    '${P.decisionType}'`,
    );
  }
  m = patchMigrationBlueprint(m);
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), m);
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} — era capstone for ${P.era}. ${P.companion} supports stewardship — does NOT define meaning, replace relationships, or override leadership.

## Permissions

- \`${P.permPrefix}.view\` · \`${P.permPrefix}.manage\` · \`${P.permPrefix}.steward\`

## Helpers

- Engine: \`_${P.helper}_*\` · Blueprint: \`_${P.bp}_*\`

${P.crossLinkNote}
`,
  );

  write(
    path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
    `# Implementation Blueprint — Phase ${P.phase} ${P.title}

Route: \`/app/${P.slug}\`
Era: ${P.era} (capstone)
${P.crossLinkNote}
`,
  );

  write(
    path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
    `# ${P.title} Engine — FAQ (Phase ${P.phase})\n\n${P.faqBody}\n`,
  );

  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}
Era: ${P.era} (capstone)
${P.centerTitle}: metadata scaffolds for flourishing reviews, legacy sessions, companion reflection.
${P.companion} supports — NOT define meaning or replace relationships.
${P.crossLinkNote}
People First. Technology Second. Self Love. Wisdom before speed. Growth Partner — never Affiliate.
${P.ilmExtra}`,
  );

  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION =
  "${P.centerTitle} — ${P.companion} supports; humans decide meaning.";

export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_PHILOSOPHY =
  "People First. Technology Second. Self Love. Wisdom before speed. Growth Partner terminology — never Affiliate.";

export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/${P.slug}";

export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_COMPANION_LIMITATIONS = [
${P.companionLimitations.map((l) => `  "${l}",`).join("\n")}
] as const;
`,
  );
}

function hopeI18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era} — era capstone. ${P.companion} supports reflection and metadata scaffolds. Supports humans — does NOT define meaning or replace leadership. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Engagement score",
    modeLabel: "Mode",
    readinessLabel: "Readiness level",
    executiveReviews: "Executive legacy reviews",
    activeReflections: "Active reflections",
    humanOversightRequired: `Human oversight required — humans decide; ${P.companion} supports only`,
    eraOpenerSummary: `Universal Stewardship Era capstone — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate era engine RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Flourishing engine — reflection prompts",
    frameworkLabel: "Shared legacy framework",
    reviewsLabel: "Executive legacy reviews",
    companionLabel: `${P.companion} — supports, does not define meaning`,
    subEngineLabel: "Flourishing culture engine",
    reflections: "Reflection scaffolds",
    executiveReviewEntries: "Executive review entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT define human worth`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports stewardship and flourishing reflection — humans retain accountability for meaning.`,
      philosophy: "People First. Technology Second. Self Love. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
    },
  };
}

function patchNavConfig() {
  const file = path.join(ROOT, "lib/app/nav-config.ts");
  let c = fs.readFileSync(file, "utf8");
  const id = P.camel;
  const href = `/app/${P.slug}`;
  if (!c.includes(`"${id}"`)) {
    c = c.replace(
      '| "sharedGratitudeAppreciativeStewardshipEngine"',
      `| "sharedGratitudeAppreciativeStewardshipEngine"\n  | "${id}"`,
    );
  }
  if (!c.includes(href)) {
    c = c.replace(
      /id: "sharedGratitudeAppreciativeStewardshipEngine",[\s\S]*?labelKey: "customerApp\.nav\.sharedGratitudeAppreciativeStewardshipEngine",\n  },/,
      (m) =>
        `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/shared-gratitude-appreciative-stewardship-engine")) {\n    return "sharedGratitudeAppreciativeStewardshipEngine";\n  }',
      `if (pathname.startsWith("/app/shared-gratitude-appreciative-stewardship-engine")) {\n    return "sharedGratitudeAppreciativeStewardshipEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(file, c);
  console.log("patched nav-config");
}

function patchPermissions() {
  const file = path.join(ROOT, "lib/core/permissions.ts");
  let c = fs.readFileSync(file, "utf8");
  const perms = [
    `${P.permPrefix}.view`,
    `${P.permPrefix}.manage`,
    `${P.permPrefix}.steward`,
  ];
  for (const perm of perms) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace(
        '"shared_gratitude_stewardship.steward",',
        `"shared_gratitude_stewardship.steward",\n    "${perm}",`,
      );
    }
  }
  if (!c.includes(`${P.permPrefix}.view`)) {
    c = c.replace(
      /"shared_gratitude_stewardship\.view",/,
      `"shared_gratitude_stewardship.view",\n  "${P.permPrefix}.view",\n  "${P.permPrefix}.manage",\n  "${P.permPrefix}.steward",`,
    );
  }
  fs.writeFileSync(file, c);
  console.log("patched permissions");
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  let c = fs.readFileSync(file, "utf8");
  const route = `/app/${P.slug}`;
  if (!c.includes(route)) {
    c = c.replace(
      '"/app/shared-gratitude-appreciative-stewardship-engine",',
      `"/app/shared-gratitude-appreciative-stewardship-engine",\n    "${route}",`,
    );
  }
  fs.writeFileSync(file, c);
  console.log("patched tenant");
}

function patchI18n() {
  const block = hopeI18nBlock();
  for (const locale of ["en", "no", "sv", "da"]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.nav = data.nav ?? {};
    data.nav[P.camel] =
      locale === "no"
        ? "Delt arv"
        : locale === "sv"
          ? "Delat arv"
          : locale === "da"
            ? "Delt arv"
            : P.navLabel;
    data[P.camel] = block;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchIlmIndex() {
  const file = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase188-vocabulary";',
      `export * from "./implementation-blueprint-phase188-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  const corpusPath = `aipify-core/knowledge/internal-language-model/${P.ilmFile}`;
  if (!c.includes(corpusPath)) {
    c = c.replace(
      '"aipify-core/knowledge/internal-language-model/implementation-blueprint-phase188-shared-gratitude-appreciative-stewardship.txt";',
      `"aipify-core/knowledge/internal-language-model/implementation-blueprint-phase188-shared-gratitude-appreciative-stewardship.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "${corpusPath}";`,
    );
  }
  fs.writeFileSync(file, c);
  console.log("patched ilm index");
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Humanity's Shared Legacy & Flourishing Engine (Phase 190):** See [HUMANITY_SHARED_LEGACY_FLOURISHING_ENGINE_PHASE190.md](./HUMANITY_SHARED_LEGACY_FLOURISHING_ENGINE_PHASE190.md) — ${P.centerTitle} capstone for human flourishing reviews, leadership legacy sessions, companion reflection, Growth Partner development programs, belonging assessments, knowledge stewardship frameworks, intergenerational opportunity dashboards, and legacy knowledge libraries. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports stewardship — **NOT** define meaning or replace authentic relationships. Cross-links only: human_flourishing_engine, legacy_engine, Phase 189 humility renewal, Phase 188 gratitude. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 190")) {
    const marker = "Permissions `shared_gratitude_stewardship.view`";
    const idx = c.indexOf(marker);
    if (idx !== -1) {
      const end = c.indexOf("`.", idx) + 2;
      c = c.slice(0, end) + entry + c.slice(end);
    }
  }
  fs.writeFileSync(file, c);
  console.log("patched ARCHITECTURE.md");
}

genCore();
genTsStack();
genMigration();
genDocs();
patchNavConfig();
patchPermissions();
patchTenant();
patchI18n();
patchIlmIndex();
patchArchitecture();
console.log("Phase 190 complete");
