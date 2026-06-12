#!/usr/bin/env node
/** ABOS Phase 195 — Aipify Values Transmission & Cultural Continuity Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const P = {
  phase: 195,
  migration: "20261355000000_aipify_values_transmission_cultural_continuity_engine_phase195.sql",
  slug: "aipify-values-transmission-cultural-continuity-engine",
  base: "AipifyValuesTransmissionCulturalContinuity",
  camel: "aipifyValuesTransmissionCulturalContinuityEngine",
  snake: "aipify_values_transmission_cultural_continuity",
  permPrefix: "aipify_values_transmission_cultural_continuity",
  helper: "avtcce",
  bp: "avtccebp195",
  decisionType: "aipify_values_transmission_cultural_continuity_engine",
  prevDecision: "aipify_legacy_preservation_knowledge_continuity_engine",
  title: "Aipify Values Transmission & Cultural Continuity",
  centerTitle: "Cultural Continuity Center",
  companion: "Culture Companion",
  scoreKey: "aipify_values_transmission_cultural_continuity_score",
  modeKey: "cultural_continuity_mode",
  levelKey: "values_alignment_level",
  thirdEntity: "culture_notes",
  era: "Perpetual Stewardship & Constitutional Governance Era (191–200)",
  eraRange: "191–200",
  docSlug: "AIPIFY_VALUES_TRANSMISSION_CULTURAL_CONTINUITY_ENGINE",
  ilmFile: "implementation-blueprint-phase195-aipify-values-transmission-cultural-continuity.txt",
  navLabel: "Values & Culture",
  crossLinkNote:
    "Cross-links only: Phase 194 legacy preservation, Phase 193 guardianship succession, Phase 192 ethical evolution — never duplicate RPCs or define organizational values.",
  ilmExtra: `
Cultural Continuity Center: values reflection programs, leadership alignment reviews, companion cultural experiences, Growth Partner integration frameworks, belonging assessments, storytelling initiatives, culture dashboards, values knowledge libraries.
Values Transmission Engine prompts: What values define us? How are these values experienced daily? How do new members inherit our culture? What behaviors deserve recognition? How do we preserve authenticity?
Cultural Continuity Framework: leadership behaviors, recognition practices, Growth Partner alignment, employee experiences, decision consistency, belonging indicators, institutional narratives.
Executive Culture Reviews, Culture Companion, Storytelling Engine, Values Alignment Engine.
Companion limitations: no rewriting organizational values, no overriding leadership authority, no suppressing diversity of thought, no replacing authentic relationships, no enforcing ideological conformity.`,
  faqBody: `## What is Values Transmission?

Values Transmission refers to how organizations reflect upon, share, and sustain cultural identity across generations — at \`/app/aipify-values-transmission-cultural-continuity-engine\`.

## Can Aipify define our organizational values?

**No.** Aipify supports reflection, storytelling, and continuity scaffolds. Leadership defines organizational values.

## Why focus on cultural continuity?

Because institutions thrive when shared values are lived daily and passed forward authentically.

## Can organizations preserve culture without enforcing conformity?

Yes. Healthy continuity celebrates diversity of thought while reinforcing shared principles.

## Why include Self Love?

Because self-awareness, compassion, and humility strengthen authentic cultural expression and belonging.`,
  companionLimitations: [
    "rewrite_organizational_values",
    "override_leadership_authority",
    "suppress_diversity_of_thought",
    "replace_authentic_relationships",
    "enforce_ideological_conformity",
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
    ["Guardianship & Succession", "Values Transmission & Cultural Continuity"],
    ["Phase 193", `Phase ${P.phase}`],
    ["aipify_guardianship_succession.view", `${P.permPrefix}.view`],
    ["aipify_guardianship_succession.manage", `${P.permPrefix}.manage`],
    ["aipify_guardianship_succession.steward", `${P.permPrefix}.steward`],
    ["20261353000000_aipify_guardianship_succession_engine_phase193.sql", P.migration],
    ["Repo Phase 193", `Repo Phase ${P.phase}`],
    ["Phase 193 —", `Phase ${P.phase} —`],
    ["IMPLEMENTATION_BLUEPRINT_PHASE193_AIPIFY_GUARDIANSHIP_SUCCESSION_ENGINE", `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`],
    ["implementation-blueprint-phase193", `implementation-blueprint-phase${P.phase}`],
    ["succession_center", "cultural_continuity_center"],
    ["guardianship_engine", "values_transmission_engine"],
    ["succession_framework", "cultural_continuity_framework"],
    ["executive_succession_reviews", "executive_culture_reviews"],
    ["guardianship_companion", "culture_companion"],
    ["mentorship_engine", "storytelling_engine"],
    ["institutional_memory_engine", "values_alignment_engine"],
    ["Executive Succession Reviews", "Executive Culture Reviews"],
    ["Guardianship", "Values Transmission"],
    ["guardianship and succession within", "values transmission and cultural continuity within"],
    ["_seed_stewardship_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["aipify_ethical_evolution_responsible_innovation_engine", "aipify_ethical_evolution_responsible_innovation_engine"],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function genCore() {
  const engine = `${P.base}Engine`;
  write(path.join(ROOT, `lib/core/${P.slug}.ts`), `/**
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
`);
}

function genTsStack() {
  const engine = `${P.base}Engine`;
  const src = path.join(ROOT, "lib/aipify/aipify-guardianship-succession-engine");
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom193(fs.readFileSync(path.join(src, f), "utf8")));
  }
  const panel = path.join(ROOT, "components/app/aipify-guardianship-succession-engine/AipifyGuardianshipSuccessionEngineDashboardPanel.tsx");
  write(path.join(ROOT, `components/app/${P.slug}/${engine}DashboardPanel.tsx`), transformFrom193(fs.readFileSync(panel, "utf8")));
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${engine}DashboardPanel } from "./${engine}DashboardPanel";\n`);
  write(path.join(ROOT, `app/app/${P.slug}/page.tsx`), transformFrom193(fs.readFileSync(path.join(ROOT, "app/app/aipify-guardianship-succession-engine/page.tsx"), "utf8")));
  for (const route of ["dashboard", "card"]) {
    write(path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`), transformFrom193(fs.readFileSync(path.join(ROOT, `app/api/aipify/aipify-guardianship-succession-engine/${route}/route.ts`), "utf8")));
  }
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports continuity — NOT rewrite organizational values or override leadership. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Help organizations reflect upon, transmit, and sustain cultural identity — values lived daily and passed forward authentically without enforcing conformity.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Perpetual Stewardship Era (${P.eraRange}). Cultural continuity becomes stewardship; humans decide; ${P.companion} informs and prepares.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Institutions where values are visible, belonging is strengthened, and culture survives transitions — authenticity preserved across generations.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '🎯', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'values_transmission_engine', 'label', 'Values transmission engine', 'emoji', '🪞', 'description', 'Cultural reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Cultural continuity framework', 'emoji', '🛡️', 'description', 'Continuity evaluation domains'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive culture reviews', 'emoji', '👥', 'description', 'Leadership culture reflection'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not define values'),
    jsonb_build_object('key', 'storytelling_engine', 'label', 'Storytelling engine', 'emoji', '⚙️', 'description', 'Narrative scaffolds'),
    jsonb_build_object('key', 'values_alignment_engine', 'label', 'Values alignment engine', 'emoji', '📖', 'description', 'Strive categories'),
    jsonb_build_object('key', 'knowledge_libraries', 'label', 'Values knowledge libraries', 'emoji', '🌱', 'description', 'Approved resources')
  ); ${D};
create or replace function public._${bp}_cultural_continuity_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'values_reflection_programs', 'label', 'Values reflection programs'),
    jsonb_build_object('key', 'leadership_alignment_reviews', 'label', 'Leadership alignment reviews'),
    jsonb_build_object('key', 'companion_cultural_experiences', 'label', 'Companion cultural experiences'),
    jsonb_build_object('key', 'growth_partner_integration', 'label', 'Growth Partner integration frameworks'),
    jsonb_build_object('key', 'belonging_assessments', 'label', 'Belonging assessments'),
    jsonb_build_object('key', 'storytelling_initiatives', 'label', 'Storytelling initiatives'),
    jsonb_build_object('key', 'culture_dashboards', 'label', 'Culture dashboards'),
    jsonb_build_object('key', 'values_knowledge_libraries', 'label', 'Values knowledge libraries')
  )); ${D};
create or replace function public._${bp}_values_transmission_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Values transmission reflection prompts — humans decide.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'values_define_us', 'label', 'What values define us?'),
    jsonb_build_object('key', 'daily_experience', 'label', 'How are these values experienced daily?'),
    jsonb_build_object('key', 'inherit_culture', 'label', 'How do new members inherit our culture?'),
    jsonb_build_object('key', 'recognition_behaviors', 'label', 'What behaviors deserve recognition?'),
    jsonb_build_object('key', 'preserve_authenticity', 'label', 'How do we preserve authenticity?')
  )); ${D};
create or replace function public._${bp}_cultural_continuity_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Cultural continuity framework — periodic evaluation.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'leadership_behaviors', 'label', 'Leadership behaviors'),
    jsonb_build_object('key', 'recognition_practices', 'label', 'Recognition practices'),
    jsonb_build_object('key', 'growth_partner_alignment', 'label', 'Growth Partner alignment'),
    jsonb_build_object('key', 'employee_experiences', 'label', 'Employee experiences'),
    jsonb_build_object('key', 'decision_consistency', 'label', 'Decision consistency'),
    jsonb_build_object('key', 'belonging_indicators', 'label', 'Belonging indicators'),
    jsonb_build_object('key', 'institutional_narratives', 'label', 'Institutional narratives')
  )); ${D};
create or replace function public._${bp}_executive_culture_reviews() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive culture reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'values_visible', 'label', 'Are our values visible?'),
    jsonb_build_object('key', 'culture_experience', 'label', 'How do people experience our culture?'),
    jsonb_build_object('key', 'traditions_preservation', 'label', 'What traditions deserve preservation?'),
    jsonb_build_object('key', 'behaviors_reinforcement', 'label', 'What behaviors deserve reinforcement?'),
    jsonb_build_object('key', 'strengthen_belonging', 'label', 'How do we strengthen belonging?')
  )); ${D};
create or replace function public._${bp}_culture_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports continuity, does not define organizational values.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts'),
    jsonb_build_object('key', 'leadership_briefings', 'label', 'Leadership briefings'),
    jsonb_build_object('key', 'recognition_insights', 'label', 'Recognition insights'),
    jsonb_build_object('key', 'culture_summaries', 'label', 'Culture summaries'),
    jsonb_build_object('key', 'knowledge_recommendations', 'label', 'Knowledge recommendations'),
    jsonb_build_object('key', 'belonging_reviews', 'label', 'Belonging reviews')
  )); ${D};
create or replace function public._${bp}_storytelling_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Storytelling engine — metadata only.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'leadership_narratives', 'label', 'Leadership narratives'),
    jsonb_build_object('key', 'growth_partner_stories', 'label', 'Growth Partner stories'),
    jsonb_build_object('key', 'institutional_milestones', 'label', 'Institutional milestones'),
    jsonb_build_object('key', 'lessons_learned_programs', 'label', 'Lessons learned programs'),
    jsonb_build_object('key', 'recognition_initiatives', 'label', 'Recognition initiatives'),
    jsonb_build_object('key', 'cross_generational_dialogue', 'label', 'Cross-generational dialogue')
  )); ${D};
create or replace function public._${bp}_values_alignment_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Values alignment — strive categories for reflection.', 'strive_categories', jsonb_build_array(
    jsonb_build_object('key', 'integrity', 'label', 'Integrity'),
    jsonb_build_object('key', 'compassion', 'label', 'Compassion'),
    jsonb_build_object('key', 'curiosity', 'label', 'Curiosity'),
    jsonb_build_object('key', 'accountability', 'label', 'Accountability'),
    jsonb_build_object('key', 'respect', 'label', 'Respect'),
    jsonb_build_object('key', 'service', 'label', 'Service'),
    jsonb_build_object('key', 'stewardship', 'label', 'Stewardship')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Rewrite organizational values',
      'Override leadership authority',
      'Suppress diversity of thought',
      'Replace authentic relationships',
      'Enforce ideological conformity'), 'principle', '${P.companion} supports — humans decide.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — self-awareness, compassion, humility, confidence, intrinsic worth, shared growth.', 'values', jsonb_build_array('self_awareness','compassion','humility','confidence','recognition_of_intrinsic_worth','commitment_to_shared_growth'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Culture audit logs via aipify_values_transmission_cultural_continuity_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_values_transmission_cultural_continuity permissions'),
    jsonb_build_object('key', 'leadership_participation', 'label', 'Leadership participation histories — metadata only'),
    jsonb_build_object('key', 'values_documentation', 'label', 'Values documentation controls'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 192, 'key', 'ethical_evolution', 'label', 'Ethical Evolution Phase 192', 'route', '/app/aipify-ethical-evolution-responsible-innovation-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 193, 'key', 'guardianship_succession', 'label', 'Guardianship & Succession Phase 193', 'route', '/app/aipify-guardianship-succession-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 194, 'key', 'legacy_preservation', 'label', 'Legacy Preservation Phase 194', 'route', '/app/aipify-legacy-preservation-knowledge-continuity-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 195, 'key', 'values_transmission', 'label', 'Values Transmission Phase 195', 'route', '/app/${P.slug}', 'description', 'Cultural continuity')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'legacy_preservation', 'label', 'Legacy Preservation Phase 194', 'route', '/app/aipify-legacy-preservation-knowledge-continuity-engine', 'relationship', 'Prior phase — cross-link only'),
    jsonb_build_object('key', 'guardianship_succession', 'label', 'Guardianship & Succession Phase 193', 'route', '/app/aipify-guardianship-succession-engine', 'relationship', 'Prior phase — cross-link only'),
    jsonb_build_object('key', 'ethical_evolution', 'label', 'Ethical Evolution Phase 192', 'route', '/app/aipify-ethical-evolution-responsible-innovation-engine', 'relationship', 'Prior phase — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Self-awareness and compassion — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with metadata-only culture reviews and values scaffolds. Growth Partner terminology. ${P.companion} supports — never defines organizational values.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans decide.', '${P.companion} informs and prepares.', 'Authenticity strengthens belonging.', 'Growth Partner — never Affiliate.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — executive review summaries max ~500 chars, reflection aggregates. No surveillance, ranking, or PII content.'; ${D};
`.trim();
}

function patchMigration(sql) {
  sql = sql.replace(
    /-- Phase \d+ —[^\n]+\n-- [^\n]+\n-- Helpers:[^\n]+/,
    `-- Phase ${P.phase} — ${P.title} Engine\n-- ${P.era}.\n-- Helpers: _${P.helper}_* (engine), _${P.bp}_* (blueprint)`,
  );
  if (!sql.includes(`'${P.prevDecision}'`)) {
    sql = sql.replace(
      `'aipify_guardianship_succession_engine'\n  )`,
      `'aipify_guardianship_succession_engine',\n    '${P.prevDecision}',\n    '${P.decisionType}'\n  )`,
    );
  } else if (!sql.includes(`'${P.decisionType}'`)) {
    sql = sql.replace(`'${P.prevDecision}'`, `'${P.prevDecision}',\n    '${P.decisionType}'`);
  }
  const start = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const end = sql.indexOf(`create or replace function public._${P.helper}_refresh_metrics`);
  if (start !== -1 && end !== -1) sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);

  const bp = P.bp;
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_cultural_continuity_center\(\)->'capabilities'\) = 8,/,
    `jsonb_build_object('key', 'center', 'label', '${P.centerTitle} — eight capabilities', 'met', jsonb_array_length(public._${bp}_cultural_continuity_center()->'capabilities') = 8,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_values_transmission_engine\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Values transmission engine — five questions', 'met', jsonb_array_length(public._${bp}_values_transmission_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'companion', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_culture_companion\(\)->'capabilities'\) = 6,/,
    `jsonb_build_object('key', 'companion', 'label', '${P.companion} capabilities', 'met', jsonb_array_length(public._${bp}_culture_companion()->'capabilities') = 6,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases documented', 'met', jsonb_array_length(public._${bp}_era_opener_summary()) = 4,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'baseline', 'label', 'Repo Phase \d+ baseline tables'/,
    `jsonb_build_object('key', 'baseline', 'label', 'Repo Phase ${P.phase} baseline tables'`,
  );

  for (const fn of [
    "cultural_continuity_center",
    "values_transmission_engine",
    "cultural_continuity_framework",
    "executive_culture_reviews",
    "culture_companion",
    "storytelling_engine",
    "values_alignment_engine",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${bp}_${fn}()`);
  }

  if (!sql.includes("values_alignment_engine_meta")) {
    sql = sql.replace(
      `'sub_engine_meta', public._${bp}_storytelling_engine(),`,
      `'sub_engine_meta', public._${bp}_storytelling_engine(), 'values_alignment_engine_meta', public._${bp}_values_alignment_engine(),`,
    );
  }

  sql = sql.replace(
    /select 'aipify-values-transmission-cultural-continuity-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', 198
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`Phase ${P.phase} Aipify[^']+`, "g"),
    `Phase ${P.phase} ${P.title} Engine — values transmission and cultural continuity within Perpetual Stewardship era; cross-link only for related engines.`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  return sql;
}

function genMigration() {
  let m = transformFrom193(fs.readFileSync(path.join(ROOT, "supabase/migrations/20261353000000_aipify_guardianship_succession_engine_phase193.sql"), "utf8"));
  m = m.replace(/_avtcce_seed_culture_notes/g, `_avtcce_seed_${P.thirdEntity.replace("_notes", "")}_notes`);
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genDocs() {
  write(path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`), `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports continuity — does NOT rewrite organizational values or override leadership.

## Permissions

- \`${P.permPrefix}.view\` · \`${P.permPrefix}.manage\` · \`${P.permPrefix}.steward\`

## Helpers

- Engine: \`_${P.helper}_*\` · Blueprint: \`_${P.bp}_*\`

${P.crossLinkNote}
`);
  write(path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`), `# Implementation Blueprint — Phase ${P.phase} ${P.title}\n\nRoute: \`/app/${P.slug}\`\nEra: ${P.era}\n${P.crossLinkNote}\n`);
  write(path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`), `# ${P.title} Engine — FAQ (Phase ${P.phase})\n\n${P.faqBody}\n`);
  write(path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`), `ABOS Phase ${P.phase} — ${P.title}\nRoute: /app/${P.slug}\n${P.ilmExtra}\n${P.crossLinkNote}\nPeople First. Growth Partner — never Affiliate.\n`);
  write(path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`), `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; humans define values.";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/${P.slug}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_COMPANION_LIMITATIONS = [\n${P.companionLimitations.map((l) => `  "${l}",`).join("\n")}\n] as const;\n`);
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports values reflection and cultural continuity scaffolds. Supports humans — does NOT define organizational values. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Engagement score",
    modeLabel: "Mode",
    readinessLabel: "Alignment level",
    executiveReviews: "Executive culture reviews",
    activeReflections: "Active reflections",
    humanOversightRequired: `Human oversight required — humans decide; ${P.companion} supports only`,
    eraOpenerSummary: `Perpetual Stewardship Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate era engine RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Values transmission engine — reflection prompts",
    frameworkLabel: "Cultural continuity framework",
    reviewsLabel: "Executive culture reviews",
    companionLabel: `${P.companion} — supports, does not define values`,
    subEngineLabel: "Storytelling engine",
    reflections: "Values transmission reflection scaffolds",
    executiveReviewEntries: "Culture review entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT rewrite organizational values`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports cultural continuity and values reflection — humans retain value definitions.`,
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
    if (!c.includes(`"${perm}"`)) c = c.replace('"aipify_guardianship_succession.steward",', `"aipify_guardianship_succession.steward",\n    "${perm}",`);
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
  console.log("patched permissions");
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace('export * from "./aipify-guardianship-succession-engine";', `export * from "./aipify-guardianship-succession-engine";\nexport * from "./${P.slug}";`);
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
    data.nav[P.camel] = locale === "no" ? "Verdier og kultur" : locale === "sv" ? "Värderingar och kultur" : locale === "da" ? "Værdier og kultur" : P.navLabel;
    data[P.camel] = block;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchIlm() {
  let c = fs.readFileSync(path.join(ROOT, "lib/internal-language-model/index.ts"), "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace('export * from "./implementation-blueprint-phase193-vocabulary";', `export * from "./implementation-blueprint-phase193-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`);
  }
  const corpus = `aipify-core/knowledge/internal-language-model/${P.ilmFile}`;
  if (!c.includes(corpus)) {
    c = c.replace('"aipify-core/knowledge/internal-language-model/implementation-blueprint-phase193-aipify-guardianship-succession.txt";', `"aipify-core/knowledge/internal-language-model/implementation-blueprint-phase193-aipify-guardianship-succession.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "${corpus}";`);
  }
  fs.writeFileSync(path.join(ROOT, "lib/internal-language-model/index.ts"), c);
  console.log("patched ilm index");
}

function patchArchitecture() {
  let c = fs.readFileSync(path.join(ROOT, "ARCHITECTURE.md"), "utf8");
  const entry = `\n**Aipify Values Transmission & Cultural Continuity Engine (Phase 195):** See [AIPIFY_VALUES_TRANSMISSION_CULTURAL_CONTINUITY_ENGINE_PHASE195.md](./AIPIFY_VALUES_TRANSMISSION_CULTURAL_CONTINUITY_ENGINE_PHASE195.md) — ${P.centerTitle} for values reflection programs, leadership alignment reviews, companion cultural experiences, Growth Partner integration frameworks, belonging assessments, storytelling initiatives, culture dashboards, and values knowledge libraries. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports continuity — **NOT** rewrite organizational values or override leadership. Cross-links only: Phase 194 legacy preservation, Phase 193 guardianship succession, Phase 192 ethical evolution. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 195")) {
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
console.log("Phase 195 complete");
