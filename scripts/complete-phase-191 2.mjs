#!/usr/bin/env node
/**
 * Complete ABOS Phase 191 — Aipify Constitution & Perpetual Principles Engine (era opener 191–200).
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const P = {
  phase: 191,
  migration: "20261351000000_aipify_constitution_perpetual_principles_engine_phase191.sql",
  slug: "aipify-constitution-perpetual-principles-engine",
  base: "AipifyConstitutionPerpetualPrinciples",
  camel: "aipifyConstitutionPerpetualPrinciplesEngine",
  snake: "aipify_constitution_perpetual_principles",
  permPrefix: "aipify_constitution_principles",
  helper: "acpp",
  bp: "acppbp191",
  decisionType: "aipify_constitution_perpetual_principles_engine",
  prevDecision: "humanity_shared_legacy_flourishing_engine",
  title: "Aipify Constitution & Perpetual Principles",
  centerTitle: "Constitutional Governance Center",
  companion: "Constitution Companion",
  scoreKey: "aipify_constitution_perpetual_principles_score",
  modeKey: "constitutional_mode",
  levelKey: "principles_readiness_level",
  thirdEntity: "principles_notes",
  era: "Perpetual Stewardship & Constitutional Governance Era (191–200)",
  eraRange: "191–200",
  docSlug: "AIPIFY_CONSTITUTION_PERPETUAL_PRINCIPLES_ENGINE",
  ilmFile: "implementation-blueprint-phase191-aipify-constitution-perpetual-principles.txt",
  navLabel: "Constitution & Principles",
  crossLinkNote:
    "Cross-links only: /app/constitution Phase 98, Phase 190 shared legacy flourishing, governance_policy_engine — never duplicate RPCs.",
  ilmExtra: `
Constitutional Governance Center: principle reflection sessions, leadership reviews, governance summaries, preparedness assessments, cultural alignment insights, stewardship recommendations.
Ten Articles: Humanity First, Technology in Service, Companionship Before Replacement, Wisdom Before Speed, Stewardship Through Responsibility, Self Love, Human Oversight, Continuous Learning, Universal Respect, Future Generations.
Constitutional Review Council: principles visibility, leadership alignment, technology supports people, stewardship active, culture reflects values.
Constitution Companion supports accountability — NOT replace leadership or rewrite values.
Companion limitations: no rewriting values, no overriding governance, no enforcing ideological conformity, no suppressing constructive disagreement.`,
  faqBody: `## What is the Aipify Constitution?

The Aipify Constitution defines the enduring principles that guide how Aipify evolves over time — at \`/app/aipify-constitution-perpetual-principles-engine\`.

## Can these principles change?

Implementation may evolve. Core values should remain stable.

## Why create a Constitution?

Because organizations benefit from clarity regarding what they stand for.

## Can technology remain innovative while guided by principles?

Yes. Strong principles often strengthen sustainable innovation.

## Why include Self Love?

Because compassion, balance, and self-awareness strengthen people, organizations, and communities.`,
  companionLimitations: [
    "rewrite_organizational_values",
    "override_governance_structures",
    "replace_leadership_responsibility",
    "enforce_ideological_conformity",
    "suppress_constructive_disagreement",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom190(content) {
  const engine = `${P.base}Engine`;
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["SharedLegacyFlourishing", P.base],
    ["shared-legacy-flourishing-engine", P.slug],
    ["humanity_shared_legacy_flourishing", P.snake],
    ["sharedLegacyFlourishing", P.camel.replace(/Engine$/, "")],
    ["sharedLegacyFlourishingEngine", P.camel],
    ["hslfbp190", P.bp],
    ["_hslf_", `_${P.helper}_`],
    ["humanity_shared_legacy_flourishing_score", P.scoreKey],
    ["flourishing_mode", P.modeKey],
    ["legacy_readiness_level", P.levelKey],
    ["legacy_notes", P.thirdEntity],
    ["LegacyNote", thirdPascal.slice(0, -1) === "Note" ? thirdPascal : thirdPascal],
    ["legacy_notes_count", `${P.thirdEntity}_count`],
    ["Flourishing Center", P.centerTitle],
    ["Flourishing", "Constitutional"],
    ["Legacy Companion", P.companion],
    ["Humanity's Shared Legacy & Flourishing", P.title],
    ["Shared Legacy & Flourishing", "Constitution & Perpetual Principles"],
    ["Phase 190", `Phase ${P.phase}`],
    ["181–190", P.eraRange],
    ["Universal Stewardship & Shared Futures Era (181–190)", P.era],
    ["Universal Stewardship Era", "Perpetual Stewardship Era"],
    ["aipify_constitution_perpetual_principles_engine", P.decisionType],
    ["shared_legacy_flourishing.view", `${P.permPrefix}.view`],
    ["shared_legacy_flourishing.manage", `${P.permPrefix}.manage`],
    ["shared_legacy_flourishing.steward", `${P.permPrefix}.steward`],
    [
      "20261350000000_humanity_shared_legacy_flourishing_engine_phase190.sql",
      P.migration,
    ],
    ["Repo Phase 190", `Repo Phase ${P.phase}`],
    ["Phase 190 —", `Phase ${P.phase} —`],
    ["humanity_shared_legacy_flourishing_engine", P.decisionType],
    ["humanity_shared_humility_continuous_renewal_engine", P.prevDecision],
    ["IMPLEMENTATION_BLUEPRINT_PHASE190_HUMANITY_SHARED_LEGACY_FLOURISHING_ENGINE", `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`],
    ["implementation-blueprint-phase190", `implementation-blueprint-phase${P.phase}`],
    ["flourishing_center", "constitutional_center"],
    ["flourishing_engine", "principles_engine"],
    ["shared_legacy_framework", "perpetual_principles_framework"],
    ["executive_legacy_reviews", "constitutional_review_council"],
    ["legacy_companion", "constitution_companion"],
    ["flourishing_culture_engine", "humanity_engine"],
    ["flourishing", "constitutional"],
    ["Flourishing", "Constitutional"],
    ["legacy", "principles"],
    ["Legacy", "Constitution"],
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
  const srcDir = path.join(ROOT, "lib/aipify/shared-legacy-flourishing-engine");
  const dstDir = path.join(ROOT, `lib/aipify/${P.slug}`);
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dstDir, f), transformFrom190(fs.readFileSync(path.join(srcDir, f), "utf8")));
  }

  const panelSrc = path.join(
    ROOT,
    `components/app/shared-legacy-flourishing-engine/SharedLegacyFlourishingEngineDashboardPanel.tsx`,
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/${engine}DashboardPanel.tsx`),
    transformFrom190(fs.readFileSync(panelSrc, "utf8")),
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/index.ts`),
    `export { ${engine}DashboardPanel } from "./${engine}DashboardPanel";\n`,
  );

  const pageSrc = fs.readFileSync(
    path.join(ROOT, "app/app/shared-legacy-flourishing-engine/page.tsx"),
    "utf8",
  );
  write(path.join(ROOT, `app/app/${P.slug}/page.tsx`), transformFrom190(pageSrc));

  for (const route of ["dashboard", "card"]) {
    const apiSrc = fs.readFileSync(
      path.join(ROOT, `app/api/aipify/shared-legacy-flourishing-engine/${route}/route.ts`),
      "utf8",
    );
    write(path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`), transformFrom190(apiSrc));
  }
}

function patchMigrationBlueprint(sql) {
  const dq = "$$";

  sql = sql.replace(
    /-- Phase \d+ —[^\n]+\n-- [^\n]+\n-- [^\n]+\n-- Helpers:[^\n]+/,
    `-- Phase ${P.phase} — ${P.title} Engine\n-- ${P.era} — ${P.centerTitle} (era opener).\n-- Helpers: _${P.helper}_* (engine), _${P.bp}_* (blueprint)`,
  );

  if (!sql.includes(P.decisionType)) {
    sql = sql.replace(
      `'${P.prevDecision}'`,
      `'${P.prevDecision}',\n    '${P.decisionType}'`,
    );
  }

  const eraLinks = `create or replace function public._${P.bp}_era_opener_summary() returns jsonb language sql immutable as ${dq} select jsonb_build_array(
    jsonb_build_object('phase', 190, 'key', 'shared_legacy_flourishing', 'label', 'Shared Legacy & Flourishing Phase 190', 'route', '/app/shared-legacy-flourishing-engine', 'description', 'Universal Stewardship era capstone — cross-link only'),
    jsonb_build_object('phase', 98, 'key', 'aipify_constitution', 'label', 'Aipify Constitution Phase 98', 'route', '/app/constitution', 'description', 'Core principles foundation — cross-link only'),
    jsonb_build_object('phase', 191, 'key', 'perpetual_principles', 'label', 'Perpetual Principles Phase 191', 'route', '/app/${P.slug}', 'description', 'Constitutional governance era opener')
  ); ${dq};`;

  sql = sql.replace(
    new RegExp(`create or replace function public\\._${P.bp}_era_opener_summary\\(\\)[\\s\\S]*?\\$\\$;`),
    eraLinks,
  );

  const replacements = [
    [
      `create or replace function public._${P.bp}_distinction_note() returns text language sql immutable as ${dq} select 'ABOS Phase ${P.phase} — ${P.centerTitle} era opener. ${P.companion} supports accountability — NOT replace leadership or rewrite values. Cross-link /app/constitution Phase 98, Phase 190 shared legacy. Helpers _${P.bp}_*.'; ${dq};`,
      /create or replace function public\._acppbp191_distinction_note\(\)[\s\S]*?\$\$;/,
    ],
    [
      `create or replace function public._${P.bp}_mission() returns text language sql immutable as ${dq} select 'Ensure growth never causes Aipify to lose sight of its purpose — enduring constitutional commitments regarding people, leadership, technology, companionship, stewardship, human flourishing, and future generations.'; ${dq};`,
      /create or replace function public\._acppbp191_mission\(\)[\s\S]*?\$\$;/,
    ],
    [
      `create or replace function public._${P.bp}_philosophy() returns text language sql immutable as ${dq} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${dq};`,
      /create or replace function public\._acppbp191_philosophy\(\)[\s\S]*?\$\$;/,
    ],
    [
      `create or replace function public._${P.bp}_abos_principle() returns text language sql immutable as ${dq}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} opens Perpetual Stewardship Era (${P.eraRange}). The Constitution becomes the compass; humans decide; ${P.companion} informs and prepares.'; ${dq};`,
      /create or replace function public\._acppbp191_abos_principle\(\)[\s\S]*?\$\$;/,
    ],
    [
      `create or replace function public._${P.bp}_vision() returns text language sql immutable as ${dq} select 'Principles worthy of trust endure — organizations guided by a constitutional foundation that protects identity regardless of future growth.'; ${dq};`,
      /create or replace function public\._acppbp191_vision\(\)[\s\S]*?\$\$;/,
    ],
    [
      `create or replace function public._${P.bp}_constitutional_center() returns jsonb language sql immutable as ${dq}
  select jsonb_build_object('principle', '${P.centerTitle} — constitutional review capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'principle_reflection', 'label', 'Principle reflection sessions'),
    jsonb_build_object('key', 'leadership_reviews', 'label', 'Leadership reviews'),
    jsonb_build_object('key', 'governance_summaries', 'label', 'Governance summaries'),
    jsonb_build_object('key', 'preparedness_assessments', 'label', 'Preparedness assessments'),
    jsonb_build_object('key', 'cultural_alignment', 'label', 'Cultural alignment insights'),
    jsonb_build_object('key', 'stewardship_recommendations', 'label', 'Stewardship recommendations')
  )); ${dq};`,
      /create or replace function public\._acppbp191_constitutional_center\(\)[\s\S]*?\$\$;/,
    ],
    [
      `create or replace function public._${P.bp}_principles_engine() returns jsonb language sql immutable as ${dq}
  select jsonb_build_object('principle', 'Ten Articles — enduring commitments.', 'articles', jsonb_build_array(
    jsonb_build_object('key', 'article_i', 'label', 'Article I — Humanity First'),
    jsonb_build_object('key', 'article_ii', 'label', 'Article II — Technology in Service of People'),
    jsonb_build_object('key', 'article_iii', 'label', 'Article III — Companionship Before Replacement'),
    jsonb_build_object('key', 'article_iv', 'label', 'Article IV — Wisdom Before Speed'),
    jsonb_build_object('key', 'article_v', 'label', 'Article V — Stewardship Through Responsibility'),
    jsonb_build_object('key', 'article_vi', 'label', 'Article VI — Self Love'),
    jsonb_build_object('key', 'article_vii', 'label', 'Article VII — Human Oversight'),
    jsonb_build_object('key', 'article_viii', 'label', 'Article VIII — Continuous Learning'),
    jsonb_build_object('key', 'article_ix', 'label', 'Article IX — Universal Respect'),
    jsonb_build_object('key', 'article_x', 'label', 'Article X — Future Generations')
  )); ${dq};`,
      /create or replace function public\._acppbp191_principles_engine\(\)[\s\S]*?\$\$;/,
    ],
    [
      `create or replace function public._${P.bp}_perpetual_principles_framework() returns jsonb language sql immutable as ${dq}
  select jsonb_build_object('principle', 'Perpetual principles framework.', 'commitments', jsonb_build_array(
    jsonb_build_object('key', 'people', 'label', 'People'),
    jsonb_build_object('key', 'leadership', 'label', 'Leadership'),
    jsonb_build_object('key', 'technology', 'label', 'Technology'),
    jsonb_build_object('key', 'companionship', 'label', 'Companionship'),
    jsonb_build_object('key', 'stewardship', 'label', 'Stewardship'),
    jsonb_build_object('key', 'human_flourishing', 'label', 'Human flourishing'),
    jsonb_build_object('key', 'future_generations', 'label', 'Future generations')
  )); ${dq};`,
      /create or replace function public\._acppbp191_perpetual_principles_framework\(\)[\s\S]*?\$\$;/,
    ],
    [
      `create or replace function public._${P.bp}_constitutional_review_council() returns jsonb language sql immutable as ${dq}
  select jsonb_build_object('principle', 'Constitutional Review Council — periodic evaluation.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'principles_visible', 'label', 'Whether principles remain visible'),
    jsonb_build_object('key', 'leadership_alignment', 'label', 'Whether leadership behaviors align'),
    jsonb_build_object('key', 'technology_supports', 'label', 'Whether technology supports people'),
    jsonb_build_object('key', 'stewardship_active', 'label', 'Whether stewardship remains active'),
    jsonb_build_object('key', 'culture_values', 'label', 'Whether culture reflects stated values')
  )); ${dq};`,
      /create or replace function public\._acppbp191_constitutional_review_council\(\)[\s\S]*?\$\$;/,
    ],
    [
      `create or replace function public._${P.bp}_constitution_companion() returns jsonb language sql immutable as ${dq}
  select jsonb_build_object('principle', '${P.companion} — supports accountability, does not replace leadership.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'principle_reflection', 'label', 'Principle reflection sessions'),
    jsonb_build_object('key', 'leadership_reviews', 'label', 'Leadership reviews'),
    jsonb_build_object('key', 'governance_summaries', 'label', 'Governance summaries'),
    jsonb_build_object('key', 'preparedness_assessments', 'label', 'Preparedness assessments'),
    jsonb_build_object('key', 'cultural_alignment', 'label', 'Cultural alignment insights'),
    jsonb_build_object('key', 'stewardship_recommendations', 'label', 'Stewardship recommendations')
  )); ${dq};`,
      /create or replace function public\._acppbp191_constitution_companion\(\)[\s\S]*?\$\$;/,
    ],
    [
      `create or replace function public._${P.bp}_humanity_engine() returns jsonb language sql immutable as ${dq}
  select jsonb_build_object('principle', 'Humanity engine — hope, belonging, compassion, curiosity, agency, dignity, purpose.', 'characteristics', jsonb_build_array(
    jsonb_build_object('key', 'hope', 'label', 'Hope'),
    jsonb_build_object('key', 'belonging', 'label', 'Belonging'),
    jsonb_build_object('key', 'compassion', 'label', 'Compassion'),
    jsonb_build_object('key', 'curiosity', 'label', 'Curiosity'),
    jsonb_build_object('key', 'agency', 'label', 'Agency'),
    jsonb_build_object('key', 'dignity', 'label', 'Dignity'),
    jsonb_build_object('key', 'purpose', 'label', 'Purpose')
  )); ${dq};`,
      /create or replace function public\._acppbp191_humanity_engine\(\)[\s\S]*?\$\$;/,
    ],
    [
      `create or replace function public._${P.bp}_companion_limitations() returns jsonb language sql immutable as ${dq}
  select jsonb_build_object('must_avoid', jsonb_build_array('Rewrite organizational values',
      'Override governance structures',
      'Replace leadership responsibility',
      'Enforce ideological conformity',
      'Suppress constructive disagreement'), 'principle', '${P.companion} supports — humans decide.'); ${dq};`,
      /create or replace function public\._acppbp191_companion_limitations\(\)[\s\S]*?\$\$;/,
    ],
    [
      `create or replace function public._${P.bp}_extended_cross_links() returns jsonb language sql immutable as ${dq} select jsonb_build_array(
    jsonb_build_object('key', 'constitution_phase98', 'label', 'Aipify Constitution Phase 98', 'route', '/app/constitution', 'relationship', 'Core principles — cross-link only'),
    jsonb_build_object('key', 'shared_legacy', 'label', 'Shared Legacy Phase 190', 'route', '/app/shared-legacy-flourishing-engine', 'relationship', 'Prior era capstone — cross-link only'),
    jsonb_build_object('key', 'governance_policy', 'label', 'Governance Policy Engine', 'route', '/app/governance-policy-engine', 'relationship', 'Policy alignment — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Article VI — cross-link only')
  ); ${dq};`,
      /create or replace function public\._acppbp191_extended_cross_links\(\)[\s\S]*?\$\$;/,
    ],
  ];

  for (const [replacement, pattern] of replacements) {
    sql = sql.replace(pattern, replacement);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._acppbp191_constitutional_center\(\)->'capabilities'\) = 8,/,
    `jsonb_build_object('key', 'center', 'label', 'Constitutional Governance Center — six capabilities', 'met', jsonb_array_length(public._${P.bp}_constitutional_center()->'capabilities') = 6,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', 'Reflection engine — five questions', 'met', jsonb_array_length\(public\._acppbp191_principles_engine\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Ten Articles documented', 'met', jsonb_array_length(public._${P.bp}_principles_engine()->'articles') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', 'Era phases documented', 'met', jsonb_array_length\(public\._acppbp191_era_opener_summary\(\)\) = 9,/,
    `jsonb_build_object('key', 'era', 'label', 'Era opener documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 3,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'baseline', 'label', 'Repo Phase 190 baseline tables'/,
    `jsonb_build_object('key', 'baseline', 'label', 'Repo Phase ${P.phase} baseline tables'`,
  );

  sql = sql.replace(
    /select 'shared-legacy-flourishing-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', 196
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    /'phase', 'Phase 191 —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase 191', 'route', '[^']+'/g,
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replace(
    /Phase 191 Human Hope[^']+/g,
    `Phase ${P.phase} ${P.title} Engine — Perpetual Stewardship era opener; cross-link only for related engines.`,
  );

  return sql;
}

function genMigration() {
  let m = transformFrom190(
    fs.readFileSync(
      path.join(
        ROOT,
        "supabase/migrations/20261350000000_humanity_shared_legacy_flourishing_engine_phase190.sql",
      ),
      "utf8",
    ),
  );
  m = patchMigrationBlueprint(m);
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), m);
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} — era opener for ${P.era}. Ten Articles establish enduring commitments. ${P.companion} supports accountability — does NOT rewrite values or replace leadership.

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
Era: ${P.era} (opener)
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
Era: ${P.era} (opener)
${P.centerTitle}: Ten Articles, Constitutional Review Council, principle reflection.
${P.companion} supports accountability — NOT replace leadership.
${P.crossLinkNote}
People First. Technology Second. Self Love. Wisdom before speed. Growth Partner — never Affiliate.
${P.ilmExtra}`,
  );

  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION =
  "${P.centerTitle} — ${P.companion} supports; humans retain governance.";

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
    subtitle: `${P.era} — era opener. ${P.companion} supports constitutional accountability and metadata scaffolds. Supports humans — does NOT rewrite values or replace leadership. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Engagement score",
    modeLabel: "Mode",
    readinessLabel: "Readiness level",
    executiveReviews: "Constitutional reviews",
    activeReflections: "Active reflections",
    humanOversightRequired: `Human oversight required — humans decide; ${P.companion} supports only`,
    eraOpenerSummary: `Perpetual Stewardship Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate era engine RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Ten Articles — perpetual principles",
    frameworkLabel: "Perpetual principles framework",
    reviewsLabel: "Constitutional Review Council",
    companionLabel: `${P.companion} — supports, does not replace leadership`,
    subEngineLabel: "Humanity engine",
    reflections: "Principle reflection scaffolds",
    executiveReviewEntries: "Constitutional review entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT rewrite organizational values`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports constitutional accountability — humans retain governance responsibility.`,
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
      '| "sharedLegacyFlourishingEngine"',
      `| "sharedLegacyFlourishingEngine"\n  | "${id}"`,
    );
  }
  if (!c.includes(href)) {
    c = c.replace(
      /id: "sharedLegacyFlourishingEngine",[\s\S]*?labelKey: "customerApp\.nav\.sharedLegacyFlourishingEngine",\n  },/,
      (m) =>
        `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/shared-legacy-flourishing-engine")) {\n    return "sharedLegacyFlourishingEngine";\n  }',
      `if (pathname.startsWith("/app/shared-legacy-flourishing-engine")) {\n    return "sharedLegacyFlourishingEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(file, c);
  console.log("patched nav-config");
}

function patchPermissions() {
  const file = path.join(ROOT, "lib/core/permissions.ts");
  let c = fs.readFileSync(file, "utf8");
  const perms = [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`];
  for (const perm of perms) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace(
        '"shared_legacy_flourishing.steward",',
        `"shared_legacy_flourishing.steward",\n    "${perm}",`,
      );
    }
  }
  fs.writeFileSync(file, c);
  console.log("patched permissions");
}

function patchTenant() {
  const file = path.join(ROOT, "lib/core/tenant.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./shared-legacy-flourishing-engine";',
      `export * from "./shared-legacy-flourishing-engine";\nexport * from "./${P.slug}";`,
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
        ? "Grunnlov og prinsipper"
        : locale === "sv"
          ? "Konstitution och principer"
          : locale === "da"
            ? "Forfatning og principper"
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
      'export * from "./implementation-blueprint-phase190-vocabulary";',
      `export * from "./implementation-blueprint-phase190-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  const corpusPath = `aipify-core/knowledge/internal-language-model/${P.ilmFile}`;
  if (!c.includes(corpusPath)) {
    c = c.replace(
      '"aipify-core/knowledge/internal-language-model/implementation-blueprint-phase190-shared-legacy-flourishing.txt";',
      `"aipify-core/knowledge/internal-language-model/implementation-blueprint-phase190-shared-legacy-flourishing.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "${corpusPath}";`,
    );
  }
  fs.writeFileSync(file, c);
  console.log("patched ilm index");
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Aipify Constitution & Perpetual Principles Engine (Phase 191):** See [AIPIFY_CONSTITUTION_PERPETUAL_PRINCIPLES_ENGINE_PHASE191.md](./AIPIFY_CONSTITUTION_PERPETUAL_PRINCIPLES_ENGINE_PHASE191.md) — ${P.centerTitle} era opener for Ten Articles (Humanity First through Future Generations), Constitutional Review Council, principle reflection sessions, leadership reviews, governance summaries, and stewardship recommendations. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports accountability — **NOT** rewrite values or replace leadership. Cross-links only: /app/constitution Phase 98, Phase 190 shared legacy, governance_policy_engine. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 191")) {
    const marker = "Permissions `shared_legacy_flourishing.steward`.";
    const idx = c.indexOf(marker);
    if (idx !== -1) {
      c = c.slice(0, idx + marker.length) + entry + c.slice(idx + marker.length);
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
console.log("Phase 191 complete");
