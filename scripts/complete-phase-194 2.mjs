#!/usr/bin/env node
/** ABOS Phase 194 — Aipify Legacy Preservation & Knowledge Continuity Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const P = {
  phase: 194,
  migration: "20261354000000_aipify_legacy_preservation_knowledge_continuity_engine_phase194.sql",
  slug: "aipify-legacy-preservation-knowledge-continuity-engine",
  base: "AipifyLegacyPreservationKnowledgeContinuity",
  camel: "aipifyLegacyPreservationKnowledgeContinuityEngine",
  snake: "aipify_legacy_preservation_knowledge_continuity",
  permPrefix: "aipify_legacy_preservation_knowledge_continuity",
  helper: "alpkce",
  bp: "alpkcebp194",
  decisionType: "aipify_legacy_preservation_knowledge_continuity_engine",
  prevDecision: "aipify_guardianship_succession_engine",
  title: "Aipify Legacy Preservation & Knowledge Continuity",
  centerTitle: "Knowledge Continuity Center",
  companion: "Knowledge Continuity Companion",
  scoreKey: "aipify_legacy_preservation_knowledge_continuity_score",
  modeKey: "knowledge_continuity_mode",
  levelKey: "continuity_readiness_level",
  thirdEntity: "continuity_notes",
  era: "Perpetual Stewardship & Constitutional Governance Era (191–200)",
  eraRange: "191–200",
  docSlug: "AIPIFY_LEGACY_PRESERVATION_KNOWLEDGE_CONTINUITY_ENGINE",
  ilmFile: "implementation-blueprint-phase194-aipify-legacy-preservation-knowledge-continuity.txt",
  navLabel: "Legacy & Knowledge Continuity",
  crossLinkNote:
    "Cross-links only: Phase 193 guardianship succession, organizational_memory_engine — never duplicate RPCs or determine organizational values.",
  ilmExtra: `
Knowledge Continuity Center: institutional memory programs, knowledge preservation reviews, companion reflection, leadership documentation frameworks, Growth Partner learning initiatives, historical decision archives, continuity dashboards, legacy knowledge libraries.
Legacy Preservation Engine prompts: What knowledge deserves preservation? Which lessons should future leaders inherit? How do we prevent institutional amnesia? What experiences strengthen preparedness? How do we transfer wisdom responsibly?
Knowledge Continuity Framework: leadership documentation, knowledge accessibility, cross-generational learning, Growth Partner knowledge sharing, decision histories, process maturity, preparedness readiness.
Executive Continuity Reviews, Knowledge Continuity Companion, Institutional Memory Engine, Wisdom Transfer Engine.
Companion limitations: no determining organizational values, no overriding leadership, no replacing mentorship, no suppressing diverse perspectives, no defining historical meaning.`,
  faqBody: `## What is Knowledge Continuity?

Knowledge Continuity refers to preserving institutional wisdom so future generations may benefit from past learning — at \`/app/aipify-legacy-preservation-knowledge-continuity-engine\`.

## Can Aipify decide what knowledge matters most?

**No.** Organizations determine what they value. Aipify supports preservation and accessibility.

## Why focus on institutional memory?

Because organizations often repeat avoidable mistakes when valuable lessons disappear.

## Can organizations remain innovative while preserving history?

Yes. Healthy institutions balance renewal with continuity.

## Why include Self Love?

Because generosity, humility, and service strengthen people's willingness to invest in future generations.`,
  companionLimitations: [
    "determine_organizational_values",
    "override_leadership_authority",
    "replace_mentorship_relationships",
    "suppress_diverse_perspectives",
    "define_historical_meaning",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom193(content) {
  const thirdPascal = P.thirdEntity.split("_").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
  const pairs = [
    ["AipifyGuardianshipSuccession", P.base],
    ["aipify-guardianship-succession-engine", P.slug],
    ["aipify_guardianship_succession", P.snake],
    ["aipifyGuardianshipSuccession", P.camel.replace(/Engine$/, "")],
    ["aipifyGuardianshipSuccessionEngine", P.camel],
    ["agsebp193", P.bp],
    ["_agse_", `_${P.helper}_`],
    ["aipify_guardianship_succession_score", P.scoreKey],
    ["guardianship_mode", P.modeKey],
    ["succession_readiness_level", P.levelKey],
    ["stewardship_notes", P.thirdEntity],
    ["StewardshipNote", thirdPascal.endsWith("Note") ? thirdPascal : thirdPascal],
    ["stewardship_notes_count", `${P.thirdEntity}_count`],
    ["Succession Center", P.centerTitle],
    ["Guardianship Companion", P.companion],
    ["Aipify Guardianship & Succession", P.title],
    ["Guardianship & Succession", "Legacy & Knowledge Continuity"],
    ["Phase 193", `Phase ${P.phase}`],
    ["aipify_guardianship_succession_engine", P.decisionType],
    ["aipify_guardianship_succession.view", `${P.permPrefix}.view`],
    ["aipify_guardianship_succession.manage", `${P.permPrefix}.manage`],
    ["aipify_guardianship_succession.steward", `${P.permPrefix}.steward`],
    ["20261353000000_aipify_guardianship_succession_engine_phase193.sql", P.migration],
    ["Repo Phase 193", `Repo Phase ${P.phase}`],
    ["Phase 193 —", `Phase ${P.phase} —`],
    ["IMPLEMENTATION_BLUEPRINT_PHASE193_AIPIFY_GUARDIANSHIP_SUCCESSION_ENGINE", `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`],
    ["implementation-blueprint-phase193", `implementation-blueprint-phase${P.phase}`],
    ["succession_center", "knowledge_continuity_center"],
    ["guardianship_engine", "legacy_preservation_engine"],
    ["succession_framework", "knowledge_continuity_framework"],
    ["executive_succession_reviews", "executive_continuity_reviews"],
    ["guardianship_companion", "knowledge_continuity_companion"],
    ["mentorship_engine_meta", "institutional_memory_engine_meta"],
    ["Executive Succession Reviews", "Executive Continuity Reviews"],
    ["Executive succession reviews", "Executive continuity reviews"],
    ["guardianship and succession within", "legacy preservation and knowledge continuity within"],
    ["_seed_stewardship_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["select successors", "determine organizational values"],
    ["appoint leaders", "determine what organizations value"],
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

export async function get${engine}Dashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_${P.snake}_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function get${engine}Card(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_${P.snake}_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function create${engine}AuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
`,
  );
}

function genTsStack() {
  const engine = `${P.base}Engine`;
  const src = path.join(ROOT, "lib/aipify/aipify-guardianship-succession-engine");
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom193(fs.readFileSync(path.join(src, f), "utf8")));
  }
  const panel = path.join(
    ROOT,
    "components/app/aipify-guardianship-succession-engine/AipifyGuardianshipSuccessionEngineDashboardPanel.tsx",
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/${engine}DashboardPanel.tsx`),
    transformFrom193(fs.readFileSync(panel, "utf8")),
  );
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${engine}DashboardPanel } from "./${engine}DashboardPanel";\n`);
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom193(fs.readFileSync(path.join(ROOT, "app/app/aipify-guardianship-succession-engine/page.tsx"), "utf8")),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom193(fs.readFileSync(path.join(ROOT, `app/api/aipify/aipify-guardianship-succession-engine/${route}/route.ts`), "utf8")),
    );
  }
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports preservation — NOT determine organizational values or override leadership. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Ensure valuable organizational wisdom survives leadership transitions and periods of transformation — intentional stewardship of knowledge worth carrying forward.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Perpetual Stewardship Era (${P.eraRange}). Wisdom deserves preservation; humans decide values; ${P.companion} informs and prepares.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where knowledge outlives individuals — wisdom remains accessible and continuity becomes intentional.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '🎯', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'legacy_preservation_engine', 'label', 'Legacy preservation engine', 'emoji', '🪞', 'description', 'Knowledge continuity reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Knowledge continuity framework', 'emoji', '🛡️', 'description', 'Continuity evaluation themes'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive continuity reviews', 'emoji', '👥', 'description', 'Leadership documentation'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not determine values'),
    jsonb_build_object('key', 'institutional_memory_engine', 'label', 'Institutional memory engine', 'emoji', '⚙️', 'description', 'Memory practices'),
    jsonb_build_object('key', 'wisdom_transfer_engine', 'label', 'Wisdom transfer engine', 'emoji', '📖', 'description', 'Wisdom preservation categories'),
    jsonb_build_object('key', 'legacy_libraries', 'label', 'Legacy knowledge libraries', 'emoji', '🌱', 'description', 'Approved resources')
  ); ${D};
create or replace function public._${bp}_knowledge_continuity_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'memory_programs', 'label', 'Institutional memory programs'),
    jsonb_build_object('key', 'preservation_reviews', 'label', 'Knowledge preservation reviews'),
    jsonb_build_object('key', 'companion_reflection', 'label', 'Companion reflection experiences'),
    jsonb_build_object('key', 'documentation_frameworks', 'label', 'Leadership documentation frameworks'),
    jsonb_build_object('key', 'growth_partner_learning', 'label', 'Growth Partner learning initiatives'),
    jsonb_build_object('key', 'decision_archives', 'label', 'Historical decision archives'),
    jsonb_build_object('key', 'continuity_dashboards', 'label', 'Continuity dashboards'),
    jsonb_build_object('key', 'legacy_libraries', 'label', 'Legacy knowledge libraries')
  )); ${D};
create or replace function public._${bp}_legacy_preservation_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Legacy preservation reflection prompts — humans decide.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'knowledge_preservation', 'label', 'What knowledge deserves preservation?'),
    jsonb_build_object('key', 'lessons_inherit', 'label', 'Which lessons should future leaders inherit?'),
    jsonb_build_object('key', 'prevent_amnesia', 'label', 'How do we prevent institutional amnesia?'),
    jsonb_build_object('key', 'preparedness_experiences', 'label', 'What experiences strengthen preparedness?'),
    jsonb_build_object('key', 'transfer_wisdom', 'label', 'How do we transfer wisdom responsibly?')
  )); ${D};
create or replace function public._${bp}_knowledge_continuity_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Knowledge continuity framework — periodic evaluation.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'leadership_documentation', 'label', 'Leadership documentation'),
    jsonb_build_object('key', 'knowledge_accessibility', 'label', 'Knowledge accessibility'),
    jsonb_build_object('key', 'cross_generational_learning', 'label', 'Cross-generational learning'),
    jsonb_build_object('key', 'growth_partner_sharing', 'label', 'Growth Partner knowledge sharing'),
    jsonb_build_object('key', 'decision_histories', 'label', 'Decision histories'),
    jsonb_build_object('key', 'process_maturity', 'label', 'Process maturity'),
    jsonb_build_object('key', 'preparedness_readiness', 'label', 'Preparedness readiness')
  )); ${D};
create or replace function public._${bp}_executive_continuity_reviews() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive continuity reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'undocumented_wisdom', 'label', 'What wisdom remains undocumented?'),
    jsonb_build_object('key', 'future_leader_experiences', 'label', 'Which experiences should future leaders understand?'),
    jsonb_build_object('key', 'cultural_identity', 'label', 'How do we preserve cultural identity?'),
    jsonb_build_object('key', 'lessons_shape_decisions', 'label', 'What lessons continue to shape decisions?'),
    jsonb_build_object('key', 'institutional_continuity', 'label', 'How do we strengthen institutional continuity?')
  )); ${D};
create or replace function public._${bp}_knowledge_continuity_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports preservation, does not determine what organizations value.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts'),
    jsonb_build_object('key', 'leadership_briefings', 'label', 'Leadership briefings'),
    jsonb_build_object('key', 'historical_summaries', 'label', 'Historical summaries'),
    jsonb_build_object('key', 'knowledge_recommendations', 'label', 'Knowledge recommendations'),
    jsonb_build_object('key', 'preparedness_reviews', 'label', 'Preparedness reviews'),
    jsonb_build_object('key', 'continuity_insights', 'label', 'Continuity insights')
  )); ${D};
create or replace function public._${bp}_institutional_memory_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Institutional memory engine — metadata only.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'leadership_storytelling', 'label', 'Leadership storytelling'),
    jsonb_build_object('key', 'lessons_learned_programs', 'label', 'Lessons learned programs'),
    jsonb_build_object('key', 'growth_partner_exchanges', 'label', 'Growth Partner knowledge exchanges'),
    jsonb_build_object('key', 'cross_generational_mentorship', 'label', 'Cross-generational mentorship'),
    jsonb_build_object('key', 'documentation_reviews', 'label', 'Documentation reviews'),
    jsonb_build_object('key', 'strategic_reflection_sessions', 'label', 'Strategic reflection sessions')
  )); ${D};
create or replace function public._${bp}_wisdom_transfer_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Wisdom transfer — preserve what strengthens futures.', 'preserves', jsonb_build_array(
    jsonb_build_object('key', 'leadership_experiences', 'label', 'Leadership experiences'),
    jsonb_build_object('key', 'decision_context', 'label', 'Decision context'),
    jsonb_build_object('key', 'operational_insights', 'label', 'Operational insights'),
    jsonb_build_object('key', 'cultural_narratives', 'label', 'Cultural narratives'),
    jsonb_build_object('key', 'growth_stories', 'label', 'Growth stories'),
    jsonb_build_object('key', 'strategic_principles', 'label', 'Strategic principles'),
    jsonb_build_object('key', 'learning_histories', 'label', 'Learning histories')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Determine organizational values',
      'Override leadership authority',
      'Replace mentorship relationships',
      'Suppress diverse perspectives',
      'Define historical meaning'), 'principle', '${P.companion} supports — humans decide.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — humility, generosity, curiosity, patience, recognition of shared learning, service toward future generations.', 'values', jsonb_build_array('humility','generosity','curiosity','patience','recognition_of_shared_learning','service_toward_future_generations'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Knowledge audit logs via aipify_legacy_preservation_knowledge_continuity_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_legacy_preservation_knowledge_continuity permissions'),
    jsonb_build_object('key', 'participation_histories', 'label', 'Leadership participation histories — metadata only'),
    jsonb_build_object('key', 'documentation_access', 'label', 'Documentation access controls'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 193, 'key', 'guardianship_succession', 'label', 'Guardianship & Succession Phase 193', 'route', '/app/aipify-guardianship-succession-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 194, 'key', 'legacy_preservation', 'label', 'Legacy Preservation Phase 194', 'route', '/app/${P.slug}', 'description', 'Knowledge continuity')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'organizational_memory', 'label', 'Organizational Memory Engine', 'route', '/app/organizational-memory-engine', 'relationship', 'Institutional memory — cross-link only'),
    jsonb_build_object('key', 'guardianship_succession', 'label', 'Guardianship & Succession Phase 193', 'route', '/app/aipify-guardianship-succession-engine', 'relationship', 'Prior phase — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Humility and service — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with metadata-only continuity reviews and documentation scaffolds. Growth Partner terminology. ${P.companion} supports — never determines organizational values.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans decide values.', '${P.companion} informs and prepares.', 'Preservation strengthens resilience.', 'Growth Partner — never Affiliate.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — executive review summaries max ~500 chars, reflection aggregates. No surveillance, ranking, or PII content.'; ${D};
`.trim();
}

function patchMigration(sql) {
  sql = sql.replace(
    /-- Phase \d+ —[^\n]+\n-- [^\n]+\n-- Helpers:[^\n]+/,
    `-- Phase ${P.phase} — ${P.title} Engine\n-- ${P.era}.\n-- Helpers: _${P.helper}_* (engine), _${P.bp}_* (blueprint)`,
  );

  const phase193Sql = fs.readFileSync(
    path.join(ROOT, "supabase/migrations/20261353000000_aipify_guardianship_succession_engine_phase193.sql"),
    "utf8",
  );
  const decisionMatch = phase193Sql.match(
    /alter table public\.decision_explanations drop constraint[\s\S]*?\n\);/,
  );
  if (decisionMatch) {
    const decisionBlock = decisionMatch[0].replace(
      `'aipify_guardianship_succession_engine'`,
      `'aipify_guardianship_succession_engine',\n    '${P.decisionType}'`,
    );
    sql = sql.replace(/alter table public\.decision_explanations drop constraint[\s\S]*?\n\);/, decisionBlock);
  }

  const start = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const end = sql.indexOf(`create or replace function public._${P.helper}_refresh_metrics`);
  if (start !== -1 && end !== -1) sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_knowledge_continuity_center\(\)->'capabilities'\) = 8,/,
    `jsonb_build_object('key', 'center', 'label', '${P.centerTitle} — eight capabilities', 'met', jsonb_array_length(public._${P.bp}_knowledge_continuity_center()->'capabilities') = 8,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_legacy_preservation_engine\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Legacy preservation engine — five questions', 'met', jsonb_array_length(public._${P.bp}_legacy_preservation_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'companion', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_knowledge_continuity_companion\(\)->'capabilities'\) = 6,/,
    `jsonb_build_object('key', 'companion', 'label', '${P.companion} capabilities', 'met', jsonb_array_length(public._${P.bp}_knowledge_continuity_companion()->'capabilities') = 6,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'framework', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_knowledge_continuity_framework\(\)->'domains'\) >= 6,/,
    `jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._${P.bp}_knowledge_continuity_framework()->'domains') >= 7,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'baseline', 'label', 'Repo Phase \d+ baseline tables'/,
    `jsonb_build_object('key', 'baseline', 'label', 'Repo Phase ${P.phase} baseline tables'`,
  );

  const bp = P.bp;
  for (const fn of [
    "knowledge_continuity_center",
    "legacy_preservation_engine",
    "knowledge_continuity_framework",
    "executive_continuity_reviews",
    "knowledge_continuity_companion",
    "institutional_memory_engine",
    "wisdom_transfer_engine",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${bp}_${fn}()`);
  }

  sql = sql.replace(
    /'sub_engine_meta', public\._\w+_wisdom_transfer_engine\(\), 'wisdom_transfer_engine_meta', public\._\w+_wisdom_transfer_engine\(\),/,
    `'sub_engine_meta', public._${bp}_institutional_memory_engine(), 'wisdom_transfer_engine_meta', public._${bp}_wisdom_transfer_engine(),`,
  );

  if (!sql.includes("'institutional_memory_engine', public._")) {
    sql = sql.replace(
      `'knowledge_continuity_companion', public._${bp}_knowledge_continuity_companion(), 'wisdom_transfer_engine', public._${bp}_wisdom_transfer_engine(),`,
      `'knowledge_continuity_companion', public._${bp}_knowledge_continuity_companion(), 'institutional_memory_engine', public._${bp}_institutional_memory_engine(), 'wisdom_transfer_engine', public._${bp}_wisdom_transfer_engine(),`,
    );
  }

  sql = sql.replace(
    /select 'aipify-legacy-preservation-knowledge-continuity-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', 199
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  const blueprintTitle = `Phase ${P.phase} — ${P.title} Engine`;
  sql = sql.replace(
    /'implementation_blueprint', jsonb_build_object\('phase', 'Phase \d+ —[^']+', 'doc', '[^']+', 'route', '[^']+'\)/g,
    `'implementation_blueprint', jsonb_build_object('phase', '${blueprintTitle}', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'route', '/app/${P.slug}')`,
  );

  sql = sql.replace(
    new RegExp(`Phase ${P.phase} Aipify[^']+`, "g"),
    `Phase ${P.phase} ${P.title} Engine — legacy preservation and knowledge continuity within Perpetual Stewardship era; cross-link only for related engines.`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', '${blueprintTitle}', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  return sql;
}

function genMigration() {
  let m = transformFrom193(
    fs.readFileSync(path.join(ROOT, "supabase/migrations/20261353000000_aipify_guardianship_succession_engine_phase193.sql"), "utf8"),
  );
  m = m.replace(/_alpkce_seed_continuity_notes/g, `_alpkce_seed_${P.thirdEntity.replace("_notes", "")}_notes`);
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports preservation — does NOT determine organizational values or override leadership.

## Permissions

- \`${P.permPrefix}.view\` · \`${P.permPrefix}.manage\` · \`${P.permPrefix}.steward\`

## Helpers

- Engine: \`_${P.helper}_*\` · Blueprint: \`_${P.bp}_*\`

${P.crossLinkNote}
`,
  );
  write(
    path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
    `# Implementation Blueprint — Phase ${P.phase} ${P.title}\n\nRoute: \`/app/${P.slug}\`\nEra: ${P.era}\n${P.crossLinkNote}\n`,
  );
  write(
    path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
    `# ${P.title} Engine — FAQ (Phase ${P.phase})\n\n${P.faqBody}\n`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}\nRoute: /app/${P.slug}\n${P.ilmExtra}\n${P.crossLinkNote}\nPeople First. Growth Partner — never Affiliate.\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; humans decide values.";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/${P.slug}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_COMPANION_LIMITATIONS = [\n${P.companionLimitations.map((l) => `  "${l}",`).join("\n")}\n] as const;\n`,
  );
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports knowledge preservation and metadata scaffolds. Supports humans — does NOT determine organizational values. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Engagement score",
    modeLabel: "Mode",
    readinessLabel: "Readiness level",
    executiveReviews: "Executive continuity reviews",
    activeReflections: "Active reflections",
    humanOversightRequired: `Human oversight required — humans decide values; ${P.companion} supports only`,
    eraOpenerSummary: `Perpetual Stewardship Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate era engine RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Legacy preservation engine — reflection prompts",
    frameworkLabel: "Knowledge continuity framework",
    reviewsLabel: "Executive continuity reviews",
    companionLabel: `${P.companion} — supports, does not determine values`,
    subEngineLabel: "Institutional memory engine",
    wisdomTransferLabel: "Wisdom transfer engine",
    reflections: "Legacy preservation reflection scaffolds",
    executiveReviewEntries: "Continuity review entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT determine organizational values`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports preservation and continuity reflection — humans retain value decisions.`,
      philosophy: "People First. Growth through support. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
    },
  };
}

function patchNav() {
  let c = fs.readFileSync(path.join(ROOT, "lib/app/nav-config.ts"), "utf8");
  const id = P.camel;
  const href = `/app/${P.slug}`;
  if (!c.includes(`"${id}"`)) {
    c = c.replace('| "aipifyGuardianshipSuccessionEngine"', `| "aipifyGuardianshipSuccessionEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    c = c.replace(
      /id: "aipifyGuardianshipSuccessionEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyGuardianshipSuccessionEngine",\n  },/,
      (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-guardianship-succession-engine")) {\n    return "aipifyGuardianshipSuccessionEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-guardianship-succession-engine")) {\n    return "aipifyGuardianshipSuccessionEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
  console.log("patched nav-config");
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_guardianship_succession.steward",', `"aipify_guardianship_succession.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
  console.log("patched permissions");
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-guardianship-succession-engine";',
      `export * from "./aipify-guardianship-succession-engine";\nexport * from "./${P.slug}";`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  console.log("patched tenant");
}

function patchI18n() {
  const block = i18nBlock();
  for (const locale of ["en", "no", "sv", "da"]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.nav = data.nav ?? {};
    data.nav[P.camel] =
      locale === "no"
        ? "Arv og kunnskapskontinuitet"
        : locale === "sv"
          ? "Arv och kunskapskontinuitet"
          : locale === "da"
            ? "Arv og videns kontinuitet"
            : P.navLabel;
    data[P.camel] = block;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchIlm() {
  let c = fs.readFileSync(path.join(ROOT, "lib/internal-language-model/index.ts"), "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase193-vocabulary";',
      `export * from "./implementation-blueprint-phase193-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  const corpus = `aipify-core/knowledge/internal-language-model/${P.ilmFile}`;
  if (!c.includes(corpus)) {
    c = c.replace(
      '"aipify-core/knowledge/internal-language-model/implementation-blueprint-phase193-aipify-guardianship-succession.txt";',
      `"aipify-core/knowledge/internal-language-model/implementation-blueprint-phase193-aipify-guardianship-succession.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "${corpus}";`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/internal-language-model/index.ts"), c);
  console.log("patched ilm index");
}

function patchArchitecture() {
  let c = fs.readFileSync(path.join(ROOT, "ARCHITECTURE.md"), "utf8");
  const entry = `\n**Aipify Legacy Preservation & Knowledge Continuity Engine (Phase 194):** See [AIPIFY_LEGACY_PRESERVATION_KNOWLEDGE_CONTINUITY_ENGINE_PHASE194.md](./AIPIFY_LEGACY_PRESERVATION_KNOWLEDGE_CONTINUITY_ENGINE_PHASE194.md) — ${P.centerTitle} for institutional memory programs, knowledge preservation reviews, companion reflection, leadership documentation frameworks, Growth Partner learning initiatives, historical decision archives, continuity dashboards, and legacy knowledge libraries. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports preservation — **NOT** determine organizational values or override leadership. Cross-links only: Phase 193 guardianship succession, organizational_memory_engine. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 194")) {
    const marker = "Permissions `aipify_guardianship_succession.steward`.";
    const idx = c.indexOf(marker);
    if (idx !== -1) c = c.slice(0, idx + marker.length) + entry + c.slice(idx + marker.length);
  }
  fs.writeFileSync(path.join(ROOT, "ARCHITECTURE.md"), c);
  console.log("patched ARCHITECTURE.md");
}

genCore();
genTsStack();
genMigration();
genDocs();
patchNav();
patchPermissions();
patchTenant();
patchI18n();
patchIlm();
patchArchitecture();
console.log("Phase 194 complete");
