#!/usr/bin/env node
/** ABOS Phase 193 — Aipify Guardianship & Succession Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const P = {
  phase: 193,
  migration: "20261353000000_aipify_guardianship_succession_engine_phase193.sql",
  slug: "aipify-guardianship-succession-engine",
  base: "AipifyGuardianshipSuccession",
  camel: "aipifyGuardianshipSuccessionEngine",
  snake: "aipify_guardianship_succession",
  permPrefix: "aipify_guardianship_succession",
  helper: "agse",
  bp: "agsebp193",
  decisionType: "aipify_guardianship_succession_engine",
  prevDecision: "aipify_ethical_evolution_responsible_innovation_engine",
  title: "Aipify Guardianship & Succession",
  centerTitle: "Succession Center",
  companion: "Guardianship Companion",
  scoreKey: "aipify_guardianship_succession_score",
  modeKey: "guardianship_mode",
  levelKey: "succession_readiness_level",
  thirdEntity: "stewardship_notes",
  era: "Perpetual Stewardship & Constitutional Governance Era (191–200)",
  eraRange: "191–200",
  docSlug: "AIPIFY_GUARDIANSHIP_SUCCESSION_ENGINE",
  ilmFile: "implementation-blueprint-phase193-aipify-guardianship-succession.txt",
  navLabel: "Guardianship & Succession",
  crossLinkNote:
    "Cross-links only: Phase 192 ethical evolution, organizational_memory_engine — never duplicate RPCs or appoint leaders.",
  ilmExtra: `
Succession Center: leadership preparedness programs, succession planning reviews, companion reflection, mentorship frameworks, institutional wisdom preservation, Growth Partner development, leadership pipeline dashboards, succession knowledge libraries.
Guardianship Engine prompts: Who are we preparing to lead? What knowledge deserves preservation? How do we strengthen mentorship? What values require continuity? How do we transfer stewardship responsibly?
Succession Framework: leadership development, knowledge accessibility, mentorship participation, Growth Partner preparedness, institutional memory, governance readiness, future leadership opportunities.
Executive Succession Reviews, Guardianship Companion, Mentorship Engine, Institutional Memory Engine.
Companion limitations: no selecting successors, no overriding governance, no replacing leadership judgment, no suppressing diverse viewpoints.`,
  faqBody: `## What is Guardianship?

Guardianship refers to leadership practiced as stewardship rather than ownership — at \`/app/aipify-guardianship-succession-engine\`.

## Can Aipify choose future leaders?

**No.** Aipify supports preparedness, reflection, and mentorship. Leadership decisions remain human responsibilities.

## Why focus on succession?

Because institutional resilience often depends upon continuity of wisdom and preparedness.

## Can organizations prepare successors without rigid hierarchies?

Yes. Healthy succession expands opportunities while preserving flexibility.

## Why include Self Love?

Because humility, generosity, and service strengthen people's willingness to invest in future generations.`,
  companionLimitations: [
    "select_successors",
    "override_governance_structures",
    "replace_leadership_judgment",
    "suppress_diverse_viewpoints",
    "determine_organizational_priorities",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom192(content) {
  const thirdPascal = P.thirdEntity.split("_").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
  const pairs = [
    ["AipifyEthicalEvolutionResponsibleInnovation", P.base],
    ["aipify-ethical-evolution-responsible-innovation-engine", P.slug],
    ["aipify_ethical_evolution_responsible_innovation", P.snake],
    ["aipifyEthicalEvolutionResponsibleInnovation", P.camel.replace(/Engine$/, "")],
    ["aipifyEthicalEvolutionResponsibleInnovationEngine", P.camel],
    ["aeeribp192", P.bp],
    ["_aeeri_", `_${P.helper}_`],
    ["aipify_ethical_evolution_responsible_innovation_score", P.scoreKey],
    ["ethical_evolution_mode", P.modeKey],
    ["innovation_readiness_level", P.levelKey],
    ["governance_notes", P.thirdEntity],
    ["GovernanceNote", thirdPascal.endsWith("Note") ? thirdPascal : thirdPascal],
    ["governance_notes_count", `${P.thirdEntity}_count`],
    ["Responsible Innovation Center", P.centerTitle],
    ["Ethics Companion", P.companion],
    ["Aipify Ethical Evolution & Responsible Innovation", P.title],
    ["Ethical Evolution & Responsible Innovation", "Guardianship & Succession"],
    ["Phase 192", `Phase ${P.phase}`],
    ["aipify_ethical_evolution_responsible_innovation_engine", P.decisionType],
    ["aipify_ethical_evolution_innovation.view", `${P.permPrefix}.view`],
    ["aipify_ethical_evolution_innovation.manage", `${P.permPrefix}.manage`],
    ["aipify_ethical_evolution_innovation.steward", `${P.permPrefix}.steward`],
    ["20261352000000_aipify_ethical_evolution_responsible_innovation_engine_phase192.sql", P.migration],
    ["Repo Phase 192", `Repo Phase ${P.phase}`],
    ["Phase 192 —", `Phase ${P.phase} —`],
    ["IMPLEMENTATION_BLUEPRINT_PHASE192_AIPIFY_ETHICAL_EVOLUTION_RESPONSIBLE_INNOVATION_ENGINE", `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`],
    ["implementation-blueprint-phase192", `implementation-blueprint-phase${P.phase}`],
    ["responsible_innovation_center", "succession_center"],
    ["ethical_evolution_engine", "guardianship_engine"],
    ["responsible_innovation_framework", "succession_framework"],
    ["executive_ethics_reviews", "executive_succession_reviews"],
    ["ethics_companion", "guardianship_companion"],
    ["innovation_governance_engine", "mentorship_engine"],
    ["transparency_engine", "institutional_memory_engine"],
    ["Executive Ethics Reviews", "Executive Succession Reviews"],
    ["Ethical evolution", "Guardianship"],
    ["responsible innovation within", "guardianship and succession within"],
    ["_seed_governance_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
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
  const src = path.join(ROOT, "lib/aipify/aipify-ethical-evolution-responsible-innovation-engine");
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom192(fs.readFileSync(path.join(src, f), "utf8")));
  }
  const panel = path.join(ROOT, "components/app/aipify-ethical-evolution-responsible-innovation-engine/AipifyEthicalEvolutionResponsibleInnovationEngineDashboardPanel.tsx");
  write(path.join(ROOT, `components/app/${P.slug}/${engine}DashboardPanel.tsx`), transformFrom192(fs.readFileSync(panel, "utf8")));
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${engine}DashboardPanel } from "./${engine}DashboardPanel";\n`);
  write(path.join(ROOT, `app/app/${P.slug}/page.tsx`), transformFrom192(fs.readFileSync(path.join(ROOT, "app/app/aipify-ethical-evolution-responsible-innovation-engine/page.tsx"), "utf8")));
  for (const route of ["dashboard", "card"]) {
    write(path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`), transformFrom192(fs.readFileSync(path.join(ROOT, `app/api/aipify/aipify-ethical-evolution-responsible-innovation-engine/${route}/route.ts`), "utf8")));
  }
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports continuity — NOT select successors or override governance. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Help organizations cultivate responsible succession — preparation, mentorship, and stewardship of future leadership without fear of change or attachment to personalities.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Perpetual Stewardship Era (${P.eraRange}). Succession becomes stewardship; humans decide; ${P.companion} informs and prepares.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Institutions where wisdom outlives individuals and principles survive transitions — leadership strengthens those who follow.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '🎯', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'guardianship_engine', 'label', 'Guardianship engine', 'emoji', '🪞', 'description', 'Succession reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Succession framework', 'emoji', '🛡️', 'description', 'Continuity evaluation themes'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive succession reviews', 'emoji', '👥', 'description', 'Leadership preparedness'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not appoint'),
    jsonb_build_object('key', 'mentorship_engine', 'label', 'Mentorship engine', 'emoji', '⚙️', 'description', 'Metadata scaffolds'),
    jsonb_build_object('key', 'memory_engine', 'label', 'Institutional memory engine', 'emoji', '📖', 'description', 'Wisdom preservation'),
    jsonb_build_object('key', 'knowledge_libraries', 'label', 'Succession knowledge libraries', 'emoji', '🌱', 'description', 'Approved resources')
  ); ${D};
create or replace function public._${bp}_succession_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'preparedness_programs', 'label', 'Leadership preparedness programs'),
    jsonb_build_object('key', 'succession_reviews', 'label', 'Succession planning reviews'),
    jsonb_build_object('key', 'companion_reflection', 'label', 'Companion reflection experiences'),
    jsonb_build_object('key', 'mentorship_frameworks', 'label', 'Mentorship frameworks'),
    jsonb_build_object('key', 'wisdom_preservation', 'label', 'Institutional wisdom preservation'),
    jsonb_build_object('key', 'growth_partner_development', 'label', 'Growth Partner development initiatives'),
    jsonb_build_object('key', 'pipeline_dashboards', 'label', 'Leadership pipeline dashboards'),
    jsonb_build_object('key', 'succession_libraries', 'label', 'Succession knowledge libraries')
  )); ${D};
create or replace function public._${bp}_guardianship_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Guardianship reflection prompts — humans decide.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'preparing_leaders', 'label', 'Who are we preparing to lead?'),
    jsonb_build_object('key', 'knowledge_preservation', 'label', 'What knowledge deserves preservation?'),
    jsonb_build_object('key', 'mentorship', 'label', 'How do we strengthen mentorship?'),
    jsonb_build_object('key', 'values_continuity', 'label', 'What values require continuity?'),
    jsonb_build_object('key', 'transfer_stewardship', 'label', 'How do we transfer stewardship responsibly?')
  )); ${D};
create or replace function public._${bp}_succession_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Succession framework — periodic evaluation.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'leadership_development', 'label', 'Leadership development'),
    jsonb_build_object('key', 'knowledge_accessibility', 'label', 'Knowledge accessibility'),
    jsonb_build_object('key', 'mentorship_participation', 'label', 'Mentorship participation'),
    jsonb_build_object('key', 'growth_partner_preparedness', 'label', 'Growth Partner preparedness'),
    jsonb_build_object('key', 'institutional_memory', 'label', 'Institutional memory'),
    jsonb_build_object('key', 'governance_readiness', 'label', 'Governance readiness'),
    jsonb_build_object('key', 'future_leadership', 'label', 'Future leadership opportunities')
  )); ${D};
create or replace function public._${bp}_executive_succession_reviews() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive succession reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'future_leaders_prepared', 'label', 'How prepared are future leaders?'),
    jsonb_build_object('key', 'undocumented_wisdom', 'label', 'What wisdom remains undocumented?'),
    jsonb_build_object('key', 'strengthen_mentorship', 'label', 'How do we strengthen mentorship?'),
    jsonb_build_object('key', 'responsibilities_influence', 'label', 'What responsibilities accompany influence?'),
    jsonb_build_object('key', 'preserve_principles', 'label', 'How do we preserve our principles?')
  )); ${D};
create or replace function public._${bp}_guardianship_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports continuity, does not appoint leaders.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts'),
    jsonb_build_object('key', 'preparedness_summaries', 'label', 'Preparedness summaries'),
    jsonb_build_object('key', 'leadership_briefings', 'label', 'Leadership briefings'),
    jsonb_build_object('key', 'knowledge_recommendations', 'label', 'Knowledge recommendations'),
    jsonb_build_object('key', 'mentorship_opportunities', 'label', 'Mentorship opportunities'),
    jsonb_build_object('key', 'stewardship_insights', 'label', 'Stewardship insights')
  )); ${D};
create or replace function public._${bp}_mentorship_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Mentorship engine — metadata only.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'leadership_coaching', 'label', 'Leadership coaching'),
    jsonb_build_object('key', 'knowledge_transfer', 'label', 'Knowledge transfer'),
    jsonb_build_object('key', 'growth_partner_enablement', 'label', 'Growth Partner enablement'),
    jsonb_build_object('key', 'cross_generational_learning', 'label', 'Cross-generational learning'),
    jsonb_build_object('key', 'recognition_programs', 'label', 'Recognition programs'),
    jsonb_build_object('key', 'institutional_storytelling', 'label', 'Institutional storytelling')
  )); ${D};
create or replace function public._${bp}_institutional_memory_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Institutional memory — preserve wisdom and identity.', 'preserves', jsonb_build_array(
    jsonb_build_object('key', 'lessons_learned', 'label', 'Lessons learned'),
    jsonb_build_object('key', 'leadership_wisdom', 'label', 'Leadership wisdom'),
    jsonb_build_object('key', 'decision_histories', 'label', 'Decision histories'),
    jsonb_build_object('key', 'cultural_narratives', 'label', 'Cultural narratives'),
    jsonb_build_object('key', 'strategic_principles', 'label', 'Strategic principles'),
    jsonb_build_object('key', 'operational_knowledge', 'label', 'Operational knowledge')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Select successors',
      'Override governance structures',
      'Replace leadership judgment',
      'Suppress diverse viewpoints',
      'Determine organizational priorities'), 'principle', '${P.companion} supports — humans decide.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — humility, generosity, patience, service, confidence without attachment.', 'values', jsonb_build_array('humility','generosity','patience','service','recognition_of_others','confidence_without_attachment'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Leadership audit logs via aipify_guardianship_succession_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_guardianship_succession permissions'),
    jsonb_build_object('key', 'mentorship_histories', 'label', 'Mentorship participation histories — metadata only'),
    jsonb_build_object('key', 'knowledge_preservation', 'label', 'Knowledge preservation controls'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 192, 'key', 'ethical_evolution', 'label', 'Ethical Evolution Phase 192', 'route', '/app/aipify-ethical-evolution-responsible-innovation-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 193, 'key', 'guardianship_succession', 'label', 'Guardianship & Succession Phase 193', 'route', '/app/${P.slug}', 'description', 'Leadership continuity')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'organizational_memory', 'label', 'Organizational Memory Engine', 'route', '/app/organizational-memory-engine', 'relationship', 'Institutional memory — cross-link only'),
    jsonb_build_object('key', 'ethical_evolution', 'label', 'Ethical Evolution Phase 192', 'route', '/app/aipify-ethical-evolution-responsible-innovation-engine', 'relationship', 'Prior phase — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Humility and service — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with metadata-only succession reviews and mentorship scaffolds. Growth Partner terminology. ${P.companion} supports — never appoints leaders.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans decide.', '${P.companion} informs and prepares.', 'Preparation strengthens resilience.', 'Growth Partner — never Affiliate.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — executive review summaries max ~500 chars, reflection aggregates. No surveillance, ranking, or PII content.'; ${D};
`.trim();
}

function patchMigration(sql) {
  sql = sql.replace(
    /-- Phase \d+ —[^\n]+\n-- [^\n]+\n-- Helpers:[^\n]+/,
    `-- Phase ${P.phase} — ${P.title} Engine\n-- ${P.era}.\n-- Helpers: _${P.helper}_* (engine), _${P.bp}_* (blueprint)`,
  );
  if (!sql.includes(`'${P.decisionType}'`)) {
    sql = sql.replace(`'${P.prevDecision}'`, `'${P.prevDecision}',\n    '${P.decisionType}'`);
  }
  const start = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const end = sql.indexOf(`create or replace function public._${P.helper}_refresh_metrics`);
  if (start !== -1 && end !== -1) sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_succession_center\(\)->'capabilities'\) = 8,/,
    `jsonb_build_object('key', 'center', 'label', '${P.centerTitle} — eight capabilities', 'met', jsonb_array_length(public._${P.bp}_succession_center()->'capabilities') = 8,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_guardianship_engine\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Guardianship engine — five questions', 'met', jsonb_array_length(public._${P.bp}_guardianship_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'companion', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_guardianship_companion\(\)->'capabilities'\) = 6,/,
    `jsonb_build_object('key', 'companion', 'label', '${P.companion} capabilities', 'met', jsonb_array_length(public._${P.bp}_guardianship_companion()->'capabilities') = 6,`,
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
  for (const [oldName, newName] of [
    ["succession_center", "succession_center"],
    ["guardianship_engine", "guardianship_engine"],
    ["succession_framework", "succession_framework"],
    ["executive_succession_reviews", "executive_succession_reviews"],
    ["guardianship_companion", "guardianship_companion"],
    ["mentorship_engine", "mentorship_engine"],
    ["institutional_memory_engine", "institutional_memory_engine"],
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${oldName}\\(\\)`, "g"), `public._${bp}_${newName}()`);
  }

  if (!sql.includes("transparency_engine_meta")) {
    sql = sql.replace(
      `'sub_engine_meta', public._${bp}_mentorship_engine(),`,
      `'sub_engine_meta', public._${bp}_mentorship_engine(), 'institutional_memory_engine_meta', public._${bp}_institutional_memory_engine(),`,
    );
  }

  sql = sql.replace(
    /select 'aipify-guardianship-succession-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', 198
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`Phase ${P.phase} Aipify[^']+`, "g"),
    `Phase ${P.phase} ${P.title} Engine — guardianship and succession within Perpetual Stewardship era; cross-link only for related engines.`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  return sql;
}

function genMigration() {
  let m = transformFrom192(fs.readFileSync(path.join(ROOT, "supabase/migrations/20261352000000_aipify_ethical_evolution_responsible_innovation_engine_phase192.sql"), "utf8"));
  m = m.replace(/_agse_seed_stewardship_notes/g, `_agse_seed_${P.thirdEntity.replace("_notes", "")}_notes`);
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genDocs() {
  write(path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`), `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports continuity — does NOT select successors or override governance.

## Permissions

- \`${P.permPrefix}.view\` · \`${P.permPrefix}.manage\` · \`${P.permPrefix}.steward\`

## Helpers

- Engine: \`_${P.helper}_*\` · Blueprint: \`_${P.bp}_*\`

${P.crossLinkNote}
`);
  write(path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`), `# Implementation Blueprint — Phase ${P.phase} ${P.title}\n\nRoute: \`/app/${P.slug}\`\nEra: ${P.era}\n${P.crossLinkNote}\n`);
  write(path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`), `# ${P.title} Engine — FAQ (Phase ${P.phase})\n\n${P.faqBody}\n`);
  write(path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`), `ABOS Phase ${P.phase} — ${P.title}\nRoute: /app/${P.slug}\n${P.ilmExtra}\n${P.crossLinkNote}\nPeople First. Growth Partner — never Affiliate.\n`);
  write(path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`), `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; humans appoint leaders.";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/${P.slug}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_COMPANION_LIMITATIONS = [\n${P.companionLimitations.map((l) => `  "${l}",`).join("\n")}\n] as const;\n`);
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports succession preparedness and metadata scaffolds. Supports humans — does NOT select successors. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Engagement score",
    modeLabel: "Mode",
    readinessLabel: "Readiness level",
    executiveReviews: "Executive succession reviews",
    activeReflections: "Active reflections",
    humanOversightRequired: `Human oversight required — humans decide; ${P.companion} supports only`,
    eraOpenerSummary: `Perpetual Stewardship Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate era engine RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Guardianship engine — reflection prompts",
    frameworkLabel: "Succession framework",
    reviewsLabel: "Executive succession reviews",
    companionLabel: `${P.companion} — supports, does not appoint leaders`,
    subEngineLabel: "Mentorship engine",
    reflections: "Guardianship reflection scaffolds",
    executiveReviewEntries: "Succession review entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT select successors`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports continuity and mentorship reflection — humans retain succession decisions.`,
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
    c = c.replace('| "aipifyEthicalEvolutionResponsibleInnovationEngine"', `| "aipifyEthicalEvolutionResponsibleInnovationEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    c = c.replace(
      /id: "aipifyEthicalEvolutionResponsibleInnovationEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyEthicalEvolutionResponsibleInnovationEngine",\n  },/,
      (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-ethical-evolution-responsible-innovation-engine")) {\n    return "aipifyEthicalEvolutionResponsibleInnovationEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-ethical-evolution-responsible-innovation-engine")) {\n    return "aipifyEthicalEvolutionResponsibleInnovationEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
  console.log("patched nav-config");
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) c = c.replace('"aipify_ethical_evolution_innovation.steward",', `"aipify_ethical_evolution_innovation.steward",\n    "${perm}",`);
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
  console.log("patched permissions");
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace('export * from "./aipify-ethical-evolution-responsible-innovation-engine";', `export * from "./aipify-ethical-evolution-responsible-innovation-engine";\nexport * from "./${P.slug}";`);
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
    data.nav[P.camel] = locale === "no" ? "Forvalterskap og arv" : locale === "sv" ? "Förvaltarskap och succession" : locale === "da" ? "Forvaltning og succession" : P.navLabel;
    data[P.camel] = block;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchIlm() {
  let c = fs.readFileSync(path.join(ROOT, "lib/internal-language-model/index.ts"), "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace('export * from "./implementation-blueprint-phase192-vocabulary";', `export * from "./implementation-blueprint-phase192-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`);
  }
  const corpus = `aipify-core/knowledge/internal-language-model/${P.ilmFile}`;
  if (!c.includes(corpus)) {
    c = c.replace('"aipify-core/knowledge/internal-language-model/implementation-blueprint-phase192-aipify-ethical-evolution-responsible-innovation.txt";', `"aipify-core/knowledge/internal-language-model/implementation-blueprint-phase192-aipify-ethical-evolution-responsible-innovation.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "${corpus}";`);
  }
  fs.writeFileSync(path.join(ROOT, "lib/internal-language-model/index.ts"), c);
  console.log("patched ilm index");
}

function patchArchitecture() {
  let c = fs.readFileSync(path.join(ROOT, "ARCHITECTURE.md"), "utf8");
  const entry = `\n**Aipify Guardianship & Succession Engine (Phase 193):** See [AIPIFY_GUARDIANSHIP_SUCCESSION_ENGINE_PHASE193.md](./AIPIFY_GUARDIANSHIP_SUCCESSION_ENGINE_PHASE193.md) — ${P.centerTitle} for leadership preparedness programs, succession planning reviews, companion reflection, mentorship frameworks, institutional wisdom preservation, Growth Partner development, leadership pipeline dashboards, and succession knowledge libraries. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports continuity — **NOT** select successors or override governance. Cross-links only: Phase 192 ethical evolution, organizational_memory_engine. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 193")) {
    const marker = "Permissions `aipify_ethical_evolution_innovation.steward`.";
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
console.log("Phase 193 complete");
