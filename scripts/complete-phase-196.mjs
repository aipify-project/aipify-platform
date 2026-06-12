#!/usr/bin/env node
/** ABOS Phase 196 — Aipify Principles Enforcement Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const P = {
  phase: 196,
  migration: "20261356000000_aipify_principles_enforcement_engine_phase196.sql",
  slug: "aipify-principles-enforcement-engine",
  base: "AipifyPrinciplesEnforcement",
  camel: "aipifyPrinciplesEnforcementEngine",
  snake: "aipify_principles_enforcement",
  permPrefix: "aipify_principles_enforcement",
  helper: "apee",
  bp: "apeebp196",
  decisionType: "aipify_principles_enforcement_engine",
  prevDecision: "aipify_values_transmission_cultural_continuity_engine",
  title: "Aipify Principles Enforcement Engine",
  centerTitle: "Principles Dashboard",
  companion: "Principles Companion",
  scoreKey: "aipify_principles_enforcement_score",
  modeKey: "principles_enforcement_mode",
  levelKey: "alignment_readiness_level",
  thirdEntity: "principles_notes",
  era: "Perpetual Stewardship & Constitutional Governance Era (191–200)",
  eraRange: "191–200",
  docSlug: "AIPIFY_PRINCIPLES_ENFORCEMENT_ENGINE",
  ilmFile: "implementation-blueprint-phase196-aipify-principles-enforcement.txt",
  navLabel: "Principles Enforcement",
  crossLinkNote:
    "Cross-links only: Phase 195 values transmission, purpose_values_engine, self_love_engine — never duplicate RPCs or define organizational values.",
  ilmExtra: `
Principles Dashboard: seven Aipify principles, leadership reflection tools, examples of principles in action, participation tracking, recognition highlights, review scheduling, alignment summaries, principles knowledge libraries.
Reflection engine prompts: Do our actions reflect stated values? Where does leadership demonstrate principle-based decisions? How consistent is our culture? What recognition examples reinforce values? How do we strengthen stewardship behaviors?
Alignment framework: values vs actions, leadership consistency, cultural reinforcement, recognition culture, review participation, Growth Partner alignment, organizational identity.
Executive principles reviews, Principles Companion, Recognition Engine, Principle Review Scheduler.
Companion limitations: no rewriting organizational values, no overriding leadership, no suppressing diversity, no replacing authentic relationships, no enforcing conformity, no determining what organizations value.`,
  companionLimitations: [
    "rewrite_organizational_values",
    "override_leadership",
    "suppress_diversity",
    "replace_authentic_relationships",
    "enforce_conformity",
    "determine_organizational_values",
  ],
};

const FAQ_BODY = `## What is Principles Enforcement?

Principles Enforcement ensures Aipify's core principles remain visible and actionable across the platform — not just documentation — at \`/app/aipify-principles-enforcement-engine\`.

## Can Aipify define our values?

**No.** Aipify supports reflection and alignment with your stated principles. Principles Companion does not rewrite organizational values.

## Why principle reviews?

Because healthy cultures require intentional reinforcement — quarterly and annual values reviews with audit trails strengthen consistency.

## Can organizations evolve while preserving principles?

Yes. Organizations may adapt responsibly while remaining recognizable — principles guide, humans decide.

## Why include Self Love?

Because self-awareness and authenticity strengthen culture — compassion, humility, and intrinsic worth support shared growth.`;

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom193(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
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
    ["Guardianship & Succession", "Principles Enforcement"],
    ["Phase 193", `Phase ${P.phase}`],
    ["aipify_guardianship_succession_engine", P.decisionType],
    ["aipify_guardianship_succession.view", `${P.permPrefix}.view`],
    ["aipify_guardianship_succession.manage", `${P.permPrefix}.manage`],
    ["aipify_guardianship_succession.steward", `${P.permPrefix}.steward`],
    ["20261353000000_aipify_guardianship_succession_engine_phase193.sql", P.migration],
    ["Repo Phase 193", `Repo Phase ${P.phase}`],
    ["Phase 193 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE193_AIPIFY_GUARDIANSHIP_SUCCESSION_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase193", `implementation-blueprint-phase${P.phase}`],
    ["succession_center", "principles_dashboard"],
    ["guardianship_engine", "reflection_engine"],
    ["succession_framework", "alignment_framework"],
    ["executive_succession_reviews", "executive_principles_reviews"],
    ["guardianship_companion", "principles_companion"],
    ["mentorship_engine", "recognition_engine"],
    ["institutional_memory_engine", "principles_alignment_engine"],
    ["Executive Succession Reviews", "Executive Principles Reviews"],
    ["Guardianship", "Principles enforcement"],
    ["guardianship and succession within", "principles enforcement within"],
    ["_seed_stewardship_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["Guardianship engine", "Reflection engine"],
    ["Succession framework", "Alignment framework"],
    ["Mentorship engine", "Recognition engine"],
    ["Institutional memory engine", "Principles alignment engine"],
    ["preparing_leaders", "values_actions_alignment"],
    ["knowledge_preservation", "leadership_consistency"],
    ["mentorship", "cultural_reinforcement"],
    ["values_continuity", "recognition_culture"],
    ["transfer_stewardship", "review_participation"],
    ["leadership_development", "values_vs_actions"],
    ["knowledge_accessibility", "leadership_consistency"],
    ["mentorship_participation", "cultural_reinforcement"],
    ["growth_partner_preparedness", "recognition_culture"],
    ["institutional_memory", "review_participation"],
    ["governance_readiness", "growth_partner_alignment"],
    ["future_leadership", "organizational_identity"],
    ["future_leaders_prepared", "embody_stated_values"],
    ["undocumented_wisdom", "principle_based_decisions"],
    ["strengthen_mentorship", "cultural_consistency"],
    ["responsibilities_influence", "recognition_examples"],
    ["preserve_principles", "stewardship_behaviors"],
    ["preparedness_summaries", "principle_summaries"],
    ["knowledge_recommendations", "recognition_insights"],
    ["mentorship_opportunities", "review_reminders"],
    ["stewardship_insights", "alignment_insights"],
    ["leadership_coaching", "peer_recognition"],
    ["knowledge_transfer", "growth_partner_examples"],
    ["growth_partner_enablement", "positive_behaviors"],
    ["cross_generational_learning", "review_participation"],
    ["recognition_programs", "principle_highlights"],
    ["institutional_storytelling", "values_in_action"],
    ["lessons_learned", "people_first"],
    ["leadership_wisdom", "technology_second"],
    ["decision_histories", "self_love"],
    ["cultural_narratives", "wisdom_before_speed"],
    ["strategic_principles", "companionship_before_replacement"],
    ["operational_knowledge", "growth_through_support"],
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
 * ${P.title} helpers (Phase ${P.phase}).
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
  write(
    path.join(ROOT, `components/app/${P.slug}/index.ts`),
    `export { ${engine}DashboardPanel } from "./${engine}DashboardPanel";\n`,
  );
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom193(fs.readFileSync(path.join(ROOT, "app/app/aipify-guardianship-succession-engine/page.tsx"), "utf8")),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom193(
        fs.readFileSync(path.join(ROOT, `app/api/aipify/aipify-guardianship-succession-engine/${route}/route.ts`), "utf8"),
      ),
    );
  }
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports alignment — NOT rewrite organizational values or override leadership. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Ensure Aipify core principles remain visible and actionable — strengthening values-actions alignment, principle-based leadership, and organizational consistency without enforcing conformity.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Perpetual Stewardship Era (${P.eraRange}). Principles guide; humans decide; ${P.companion} informs and prepares.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where stated values match daily actions — leadership reinforces culture through recognition, reflection, and stewardship.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '🎯', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'reflection_engine', 'label', 'Reflection engine', 'emoji', '🪞', 'description', 'Alignment reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Alignment framework', 'emoji', '🛡️', 'description', 'Values alignment evaluation domains'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive principles reviews', 'emoji', '👥', 'description', 'Leadership stewardship reviews'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not define values'),
    jsonb_build_object('key', 'recognition_engine', 'label', 'Recognition engine', 'emoji', '⚙️', 'description', 'Peer recognition scaffolds'),
    jsonb_build_object('key', 'principles_alignment', 'label', 'Principles alignment', 'emoji', '📖', 'description', 'Seven Aipify principles'),
    jsonb_build_object('key', 'review_scheduler', 'label', 'Principle review scheduler', 'emoji', '🌱', 'description', 'Quarterly and annual reviews')
  ); ${D};
create or replace function public._${bp}_principles_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'seven_principles', 'label', 'Seven Aipify principles display'),
    jsonb_build_object('key', 'leadership_reflection', 'label', 'Leadership reflection tools'),
    jsonb_build_object('key', 'principles_in_action', 'label', 'Examples of principles in action'),
    jsonb_build_object('key', 'participation_tracking', 'label', 'Participation tracking'),
    jsonb_build_object('key', 'recognition_highlights', 'label', 'Recognition highlights'),
    jsonb_build_object('key', 'review_scheduling', 'label', 'Principle review scheduling'),
    jsonb_build_object('key', 'alignment_summaries', 'label', 'Alignment summaries'),
    jsonb_build_object('key', 'principles_libraries', 'label', 'Principles knowledge libraries')
  )); ${D};
create or replace function public._${bp}_reflection_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Reflection engine — alignment between values and actions.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'values_actions', 'label', 'Do our actions reflect stated values?'),
    jsonb_build_object('key', 'leadership_decisions', 'label', 'Where does leadership demonstrate principle-based decisions?'),
    jsonb_build_object('key', 'cultural_consistency', 'label', 'How consistent is our culture?'),
    jsonb_build_object('key', 'recognition_examples', 'label', 'What recognition examples reinforce values?'),
    jsonb_build_object('key', 'stewardship_behaviors', 'label', 'How do we strengthen stewardship behaviors?')
  )); ${D};
create or replace function public._${bp}_alignment_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Alignment framework — periodic evaluation.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'values_vs_actions', 'label', 'Values vs actions'),
    jsonb_build_object('key', 'leadership_consistency', 'label', 'Leadership consistency'),
    jsonb_build_object('key', 'cultural_reinforcement', 'label', 'Cultural reinforcement'),
    jsonb_build_object('key', 'recognition_culture', 'label', 'Recognition culture'),
    jsonb_build_object('key', 'review_participation', 'label', 'Review participation'),
    jsonb_build_object('key', 'growth_partner_alignment', 'label', 'Growth Partner alignment'),
    jsonb_build_object('key', 'organizational_identity', 'label', 'Organizational identity')
  )); ${D};
create or replace function public._${bp}_executive_principles_reviews() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive principles reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'embody_values', 'label', 'Do we embody stated values?'),
    jsonb_build_object('key', 'principle_decisions', 'label', 'Are decisions principle-based?'),
    jsonb_build_object('key', 'cultural_consistency', 'label', 'Is our culture consistent?'),
    jsonb_build_object('key', 'recognition_examples', 'label', 'What recognition examples exist?'),
    jsonb_build_object('key', 'stewardship_behaviors', 'label', 'What stewardship behaviors are visible?')
  )); ${D};
create or replace function public._${bp}_principles_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports alignment, does not define organizational values.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts'),
    jsonb_build_object('key', 'leadership_briefings', 'label', 'Leadership briefings'),
    jsonb_build_object('key', 'recognition_insights', 'label', 'Recognition insights'),
    jsonb_build_object('key', 'principle_summaries', 'label', 'Principle summaries'),
    jsonb_build_object('key', 'review_reminders', 'label', 'Review reminders'),
    jsonb_build_object('key', 'alignment_insights', 'label', 'Alignment insights')
  )); ${D};
create or replace function public._${bp}_recognition_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Recognition engine — metadata only.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'peer_recognition', 'label', 'Peer recognition'),
    jsonb_build_object('key', 'growth_partner_examples', 'label', 'Growth Partner examples'),
    jsonb_build_object('key', 'positive_behaviors', 'label', 'Positive behaviors'),
    jsonb_build_object('key', 'review_participation', 'label', 'Review participation'),
    jsonb_build_object('key', 'principle_highlights', 'label', 'Principle highlights'),
    jsonb_build_object('key', 'values_in_action', 'label', 'Values in action')
  )); ${D};
create or replace function public._${bp}_principles_alignment_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Seven Aipify principles — alignment reference.', 'principles', jsonb_build_array(
    jsonb_build_object('key', 'people_first', 'label', 'People First'),
    jsonb_build_object('key', 'technology_second', 'label', 'Technology Second'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love'),
    jsonb_build_object('key', 'wisdom_before_speed', 'label', 'Wisdom before speed'),
    jsonb_build_object('key', 'companionship_before_replacement', 'label', 'Companionship before replacement'),
    jsonb_build_object('key', 'growth_through_support', 'label', 'Growth through support'),
    jsonb_build_object('key', 'stewardship_through_responsibility', 'label', 'Stewardship through responsibility')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Rewrite organizational values',
      'Override leadership',
      'Suppress diversity',
      'Replace authentic relationships',
      'Enforce conformity',
      'Determine what organizations value'), 'principle', '${P.companion} supports — humans decide.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — self-awareness, compassion, humility, confidence, intrinsic worth, shared growth.', 'values', jsonb_build_array('self_awareness','compassion','humility','confidence','intrinsic_worth','shared_growth'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Principle audit logs via aipify_principles_enforcement_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_principles_enforcement permissions'),
    jsonb_build_object('key', 'participation_histories', 'label', 'Participation histories — metadata only'),
    jsonb_build_object('key', 'documentation_controls', 'label', 'Documentation controls'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 195, 'key', 'values_transmission', 'label', 'Values Transmission Phase 195', 'route', '/app/aipify-values-transmission-cultural-continuity-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 196, 'key', 'principles_enforcement', 'label', 'Principles Enforcement Phase 196', 'route', '/app/${P.slug}', 'description', 'Values-actions alignment')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'purpose_values', 'label', 'Purpose & Values Engine', 'route', '/app/purpose-values-engine', 'relationship', 'Organizational values — cross-link only'),
    jsonb_build_object('key', 'values_transmission', 'label', 'Values Transmission Phase 195', 'route', '/app/aipify-values-transmission-cultural-continuity-engine', 'relationship', 'Prior phase — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Self-awareness and authenticity — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with metadata-only principle reviews and recognition scaffolds. Growth Partner terminology. ${P.companion} supports — never rewrites organizational values.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans decide.', '${P.companion} informs and prepares.', 'Principles guide; culture strengthens.', 'Growth Partner — never Affiliate.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — executive review summaries max ~500 chars, reflection aggregates. No surveillance, ranking, or PII content.'; ${D};
`.trim();
}

function patchMigration(sql) {
  sql = sql.replace(
    /-- Phase \d+ —[^\n]+\n-- [^\n]+\n-- Helpers:[^\n]+/,
    `-- Phase ${P.phase} — ${P.title}\n-- ${P.era}.\n-- Helpers: _${P.helper}_* (engine), _${P.bp}_* (blueprint)`,
  );

  if (!sql.includes(`'${P.prevDecision}'`)) {
    sql = sql.replace(
      `'aipify_guardianship_succession_engine'`,
      `'aipify_guardianship_succession_engine',\n    '${P.prevDecision}'`,
    );
  }
  if (!sql.includes(`'${P.decisionType}'`)) {
    sql = sql.replace(`'${P.prevDecision}'`, `'${P.prevDecision}',\n    '${P.decisionType}'`);
  }

  const start = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const end = sql.indexOf(`create or replace function public._${P.helper}_refresh_metrics`);
  if (start !== -1 && end !== -1) sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);

  const bp = P.bp;
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_\w+\(\)->'capabilities'\) = 8,/,
    `jsonb_build_object('key', 'center', 'label', '${P.centerTitle} — eight capabilities', 'met', jsonb_array_length(public._${bp}_principles_dashboard()->'capabilities') = 8,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_\w+\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Reflection engine — five questions', 'met', jsonb_array_length(public._${bp}_reflection_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'companion', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_\w+\(\)->'capabilities'\) = 6,/,
    `jsonb_build_object('key', 'companion', 'label', '${P.companion} capabilities', 'met', jsonb_array_length(public._${bp}_principles_companion()->'capabilities') = 6,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases documented', 'met', jsonb_array_length(public._${bp}_era_opener_summary()) = 2,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'baseline', 'label', 'Repo Phase \d+ baseline tables'/,
    `jsonb_build_object('key', 'baseline', 'label', 'Repo Phase ${P.phase} baseline tables'`,
  );

  for (const fn of [
    "principles_dashboard",
    "reflection_engine",
    "alignment_framework",
    "executive_principles_reviews",
    "principles_companion",
    "recognition_engine",
    "principles_alignment_engine",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${bp}_${fn}()`);
  }

  if (!sql.includes("principles_alignment_engine_meta")) {
    sql = sql.replace(
      `'sub_engine_meta', public._${bp}_recognition_engine(),`,
      `'sub_engine_meta', public._${bp}_recognition_engine(), 'principles_alignment_engine_meta', public._${bp}_principles_alignment_engine(),`,
    );
  }

  sql = sql.replace(
    /select 'aipify-principles-enforcement-engine'[^;]+;/,
    `select '${P.slug}', '${P.title}', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', 198
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`Phase ${P.phase} Aipify[^']+`, "g"),
    `Phase ${P.phase} ${P.title} — principles enforcement within Perpetual Stewardship era; cross-link only for related engines.`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title}', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replace(
    /'implementation_blueprint', jsonb_build_object\('title', '[^']+'/,
    `'implementation_blueprint', jsonb_build_object('title', '${P.title}'`,
  );

  return sql;
}

function genMigration() {
  let m = transformFrom193(
    fs.readFileSync(
      path.join(ROOT, "supabase/migrations/20261353000000_aipify_guardianship_succession_engine_phase193.sql"),
      "utf8",
    ),
  );
  m = m.replace(/_apee_seed_principles_notes/g, `_apee_seed_${P.thirdEntity.replace("_notes", "")}_notes`);
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports alignment — does NOT rewrite organizational values or override leadership.

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
    `# ${P.title} — FAQ (Phase ${P.phase})\n\n${FAQ_BODY}\n`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}\nRoute: /app/${P.slug}\n${P.ilmExtra}\n${P.crossLinkNote}\nPeople First. Growth Partner — never Affiliate.\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; humans define values.";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/${P.slug}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_COMPANION_LIMITATIONS = [\n${P.companionLimitations.map((l) => `  "${l}",`).join("\n")}\n] as const;\n`,
  );
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports principles alignment and metadata scaffolds. Supports humans — does NOT rewrite organizational values. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} (Phase ${P.phase})`,
    scoreLabel: "Alignment score",
    modeLabel: "Mode",
    readinessLabel: "Alignment level",
    executiveReviews: "Executive principles reviews",
    activeReflections: "Active reflections",
    humanOversightRequired: `Human oversight required — humans decide; ${P.companion} supports only`,
    eraOpenerSummary: `Perpetual Stewardship Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate era engine RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Reflection engine — alignment prompts",
    frameworkLabel: "Alignment framework",
    reviewsLabel: "Executive principles reviews",
    companionLabel: `${P.companion} — supports, does not define values`,
    subEngineLabel: "Recognition engine",
    reflections: "Principles reflection scaffolds",
    executiveReviewEntries: "Principles review entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT rewrite organizational values`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports principles alignment and recognition reflection — humans retain value definitions.`,
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
        ? "Prinsipp håndhevelse"
        : locale === "sv"
          ? "Principgenomförande"
          : locale === "da"
            ? "Princip håndhævelse"
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
  const entry = `\n**Aipify Principles Enforcement Engine (Phase 196):** See [AIPIFY_PRINCIPLES_ENFORCEMENT_ENGINE_PHASE196.md](./AIPIFY_PRINCIPLES_ENFORCEMENT_ENGINE_PHASE196.md) — ${P.centerTitle} for seven Aipify principles, leadership reflection tools, recognition engine, principle review scheduler, alignment framework, and executive principles reviews. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports alignment — **NOT** rewrite organizational values or override leadership. Cross-links only: Phase 195 values transmission, purpose_values_engine, self_love_engine. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 196")) {
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
console.log("Phase 196 complete");
