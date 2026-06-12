#!/usr/bin/env node
/** ABOS Phase 197 — Aipify Decision Transparency Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const P = {
  phase: 197,
  migration: "20261357000000_aipify_decision_transparency_engine_phase197.sql",
  slug: "aipify-decision-transparency-engine",
  base: "AipifyDecisionTransparency",
  camel: "aipifyDecisionTransparencyEngine",
  snake: "aipify_decision_transparency",
  permPrefix: "aipify_decision_transparency",
  helper: "adte",
  bp: "adtebp197",
  decisionType: "aipify_decision_transparency_engine",
  prevDecision: "aipify_principles_enforcement_engine",
  title: "Aipify Decision Transparency",
  centerTitle: "Decision Explanation Center",
  companion: "Transparency Companion",
  scoreKey: "aipify_decision_transparency_score",
  modeKey: "decision_transparency_mode",
  levelKey: "oversight_confidence_level",
  thirdEntity: "transparency_notes",
  era: "Perpetual Stewardship & Constitutional Governance Era (191–200)",
  eraRange: "191–200",
  docSlug: "AIPIFY_DECISION_TRANSPARENCY_ENGINE",
  ilmFile: "implementation-blueprint-phase197-aipify-decision-transparency.txt",
  navLabel: "Decision Transparency",
  crossLinkNote:
    "Cross-links only: Phase 196 principles enforcement, Phase 195 values transmission, trust_action_engine, approvals — never duplicate RPCs or override human oversight.",
  ilmExtra: `
Decision Explanation Center: decision explanations, recommendation timeline, action audit viewer, human oversight dashboard, data source attribution, suggestion differentiation, enterprise compliance, explanation knowledge libraries.
Transparency Reflection Engine prompts: Do we trust our recommendations? Are explanations understandable? Is human oversight effective? Does governance support transparency? How do we strengthen adoption confidence?
Transparency Framework: recommendation explainability, data source transparency, action audit trails, human oversight, governance compliance, historical review, adoption confidence.
Executive Transparency Reviews, Transparency Companion, Practices Engine, Governance Alignment Engine.
Companion limitations: no making decisions, no overriding approvals, no hiding audit trails, no exposing unauthorized data, no replacing human oversight.`,
  faqBody: `## What is Decision Transparency?

Decision Transparency means making important Aipify actions understandable and reviewable by authorized users — at \`/app/aipify-decision-transparency-engine\`.

## Can Aipify hide how decisions are made?

**No.** Explanations are required for authorized users. Transparency Companion supports clarity — it does not conceal system reasoning.

## Why audit timelines?

Governance and trust require reviewable history. Recommendation timelines and action audit records preserve accountability.

## Suggestions vs actions?

The system differentiates suggestions, recommendations, and completed actions so humans understand what was proposed versus what was executed.

## Why human oversight?

Humans remain responsible for important decisions. Transparency supports oversight — it does not replace it.`,
  companionLimitations: [
    "make_decisions",
    "override_approvals",
    "hide_audit_trails",
    "expose_unauthorized_data",
    "replace_human_oversight",
    "determine_organizational_priorities",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom195(content) {
  const thirdPascal = P.thirdEntity.split("_").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
  const pairs = [
    ["AipifyValuesTransmissionCulturalContinuity", P.base],
    ["aipify-values-transmission-cultural-continuity-engine", P.slug],
    ["aipify_values_transmission_cultural_continuity", P.snake],
    ["aipifyValuesTransmissionCulturalContinuity", P.camel.replace(/Engine$/, "")],
    ["aipifyValuesTransmissionCulturalContinuityEngine", P.camel],
    ["avtccebp195", P.bp],
    ["_avtcce_", `_${P.helper}_`],
    ["aipify_values_transmission_cultural_continuity_score", P.scoreKey],
    ["cultural_continuity_mode", P.modeKey],
    ["values_alignment_level", P.levelKey],
    ["culture_notes", P.thirdEntity],
    ["CultureNote", thirdPascal.endsWith("Note") ? thirdPascal : thirdPascal],
    ["culture_notes_count", `${P.thirdEntity}_count`],
    ["Cultural Continuity Center", P.centerTitle],
    ["Culture Companion", P.companion],
    ["Aipify Values Transmission & Cultural Continuity", P.title],
    ["Values Transmission & Cultural Continuity", "Decision Transparency"],
    ["Values & Culture", P.navLabel],
    ["Phase 195", `Phase ${P.phase}`],
    ["aipify_values_transmission_cultural_continuity_engine", P.decisionType],
    ["aipify_values_transmission_cultural_continuity.view", `${P.permPrefix}.view`],
    ["aipify_values_transmission_cultural_continuity.manage", `${P.permPrefix}.manage`],
    ["aipify_values_transmission_cultural_continuity.steward", `${P.permPrefix}.steward`],
    ["20261355000000_aipify_values_transmission_cultural_continuity_engine_phase195.sql", P.migration],
    ["Repo Phase 195", `Repo Phase ${P.phase}`],
    ["Phase 195 —", `Phase ${P.phase} —`],
    ["IMPLEMENTATION_BLUEPRINT_PHASE195_AIPIFY_VALUES_TRANSMISSION_CULTURAL_CONTINUITY_ENGINE", `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`],
    ["implementation-blueprint-phase195", `implementation-blueprint-phase${P.phase}`],
    ["cultural_continuity_center", "decision_explanation_center"],
    ["values_transmission_engine", "transparency_reflection_engine"],
    ["cultural_continuity_framework", "transparency_framework"],
    ["executive_culture_reviews", "executive_transparency_reviews"],
    ["culture_companion", "transparency_companion"],
    ["storytelling_engine", "practices_engine"],
    ["values_alignment_engine", "governance_alignment_engine"],
    ["Executive Culture Reviews", "Executive Transparency Reviews"],
    ["Values Transmission", "Decision Transparency"],
    ["values transmission and cultural continuity within", "decision transparency within"],
    ["_seed_culture_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["rewrite organizational values", "make decisions"],
    ["define organizational values", "override approvals"],
    ["cultural continuity", "decision transparency"],
    ["Culture Companion supports", "Transparency Companion supports"],
    ["never defines organizational values", "never makes decisions or overrides approvals"],
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
  const src = path.join(ROOT, "lib/aipify/aipify-values-transmission-cultural-continuity-engine");
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom195(fs.readFileSync(path.join(src, f), "utf8")));
  }
  const panel = path.join(ROOT, "components/app/aipify-values-transmission-cultural-continuity-engine/AipifyValuesTransmissionCulturalContinuityEngineDashboardPanel.tsx");
  write(path.join(ROOT, `components/app/${P.slug}/${engine}DashboardPanel.tsx`), transformFrom195(fs.readFileSync(panel, "utf8")));
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${engine}DashboardPanel } from "./${engine}DashboardPanel";\n`);
  write(path.join(ROOT, `app/app/${P.slug}/page.tsx`), transformFrom195(fs.readFileSync(path.join(ROOT, "app/app/aipify-values-transmission-cultural-continuity-engine/page.tsx"), "utf8")));
  for (const route of ["dashboard", "card"]) {
    write(path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`), transformFrom195(fs.readFileSync(path.join(ROOT, `app/api/aipify/aipify-values-transmission-cultural-continuity-engine/${route}/route.ts`), "utf8")));
  }
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports explainability — NOT make decisions or override approvals. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Increase trust, accountability, and confidence — important actions, recommendations, and automated decisions understandable and reviewable by authorized users.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Perpetual Stewardship Era (${P.eraRange}). Transparency strengthens trust; humans decide; ${P.companion} informs and explains.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where recommendations are trusted, automation is understood, and governance is supported by reviewable explanations and immutable audit trails.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '🎯', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'transparency_reflection_engine', 'label', 'Transparency reflection engine', 'emoji', '🪞', 'description', 'Trust and explainability prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Transparency framework', 'emoji', '🛡️', 'description', 'Seven transparency domains'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive transparency reviews', 'emoji', '👥', 'description', 'Leadership trust reflection'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Explains — does not decide'),
    jsonb_build_object('key', 'practices_engine', 'label', 'Practices engine', 'emoji', '⚙️', 'description', 'Audit and oversight scaffolds'),
    jsonb_build_object('key', 'governance_alignment_engine', 'label', 'Governance alignment engine', 'emoji', '📖', 'description', 'Seven Aipify principles'),
    jsonb_build_object('key', 'knowledge_libraries', 'label', 'Explanation knowledge libraries', 'emoji', '🌱', 'description', 'Non-technical explanation resources')
  ); ${D};
create or replace function public._${bp}_decision_explanation_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'decision_explanations', 'label', 'Decision Explanation Center — factors and business-friendly language'),
    jsonb_build_object('key', 'recommendation_timeline', 'label', 'Recommendation Timeline — accepted/rejected history with filters'),
    jsonb_build_object('key', 'action_audit_viewer', 'label', 'Action Audit Viewer — completed actions and immutable audit records'),
    jsonb_build_object('key', 'human_oversight_dashboard', 'label', 'Human Oversight Dashboard — awaiting approval and escalation workflows'),
    jsonb_build_object('key', 'data_source_attribution', 'label', 'Data source attribution — transparent provenance'),
    jsonb_build_object('key', 'suggestion_differentiation', 'label', 'Suggestion differentiation — suggestions vs recommendations vs completed actions'),
    jsonb_build_object('key', 'enterprise_compliance', 'label', 'Enterprise compliance — governance and audit support'),
    jsonb_build_object('key', 'explanation_knowledge_libraries', 'label', 'Explanation knowledge libraries — non-technical explanations')
  )); ${D};
create or replace function public._${bp}_transparency_reflection_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Transparency reflection prompts — humans decide.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'trust_recommendations', 'label', 'Do we trust our recommendations?'),
    jsonb_build_object('key', 'explainability', 'label', 'Are explanations understandable to authorized users?'),
    jsonb_build_object('key', 'oversight_effectiveness', 'label', 'Is human oversight effective?'),
    jsonb_build_object('key', 'governance_support', 'label', 'Does governance support transparency?'),
    jsonb_build_object('key', 'adoption_confidence', 'label', 'How do we strengthen adoption confidence?')
  )); ${D};
create or replace function public._${bp}_transparency_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Transparency framework — periodic evaluation.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'recommendation_explainability', 'label', 'Recommendation explainability'),
    jsonb_build_object('key', 'data_source_transparency', 'label', 'Data source transparency'),
    jsonb_build_object('key', 'action_audit_trails', 'label', 'Action audit trails'),
    jsonb_build_object('key', 'human_oversight', 'label', 'Human oversight'),
    jsonb_build_object('key', 'governance_compliance', 'label', 'Governance compliance'),
    jsonb_build_object('key', 'historical_review', 'label', 'Historical review'),
    jsonb_build_object('key', 'adoption_confidence', 'label', 'Adoption confidence')
  )); ${D};
create or replace function public._${bp}_executive_transparency_reviews() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive transparency reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'trust_recommendations', 'label', 'Trust in recommendations'),
    jsonb_build_object('key', 'automation_confidence', 'label', 'Automation confidence'),
    jsonb_build_object('key', 'governance_compliance', 'label', 'Governance compliance'),
    jsonb_build_object('key', 'oversight_effectiveness', 'label', 'Oversight effectiveness'),
    jsonb_build_object('key', 'transparency_culture', 'label', 'Transparency culture')
  )); ${D};
create or replace function public._${bp}_transparency_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — explains and summarizes, does not make decisions.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'explanation_summaries', 'label', 'Explanation summaries'),
    jsonb_build_object('key', 'timeline_briefings', 'label', 'Timeline briefings'),
    jsonb_build_object('key', 'audit_insights', 'label', 'Audit insights'),
    jsonb_build_object('key', 'oversight_reminders', 'label', 'Oversight reminders'),
    jsonb_build_object('key', 'governance_recommendations', 'label', 'Governance recommendations'),
    jsonb_build_object('key', 'trust_insights', 'label', 'Trust insights')
  )); ${D};
create or replace function public._${bp}_practices_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Practices engine — metadata only, no PII.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'audit_logging', 'label', 'Audit logging'),
    jsonb_build_object('key', 'approval_tracking', 'label', 'Approval tracking'),
    jsonb_build_object('key', 'escalation_workflows', 'label', 'Escalation workflows'),
    jsonb_build_object('key', 'metadata_only_records', 'label', 'Metadata-only records'),
    jsonb_build_object('key', 'immutable_audit_records', 'label', 'Immutable audit records'),
    jsonb_build_object('key', 'rbac_controls', 'label', 'RBAC controls on decision records')
  )); ${D};
create or replace function public._${bp}_governance_alignment_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Governance alignment — seven Aipify principles.', 'principles', jsonb_build_array(
    jsonb_build_object('key', 'people_first', 'label', 'People First'),
    jsonb_build_object('key', 'technology_second', 'label', 'Technology Second'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love'),
    jsonb_build_object('key', 'wisdom_before_speed', 'label', 'Wisdom before speed'),
    jsonb_build_object('key', 'companionship_before_replacement', 'label', 'Companionship before replacement'),
    jsonb_build_object('key', 'growth_through_support', 'label', 'Growth through support'),
    jsonb_build_object('key', 'stewardship_through_responsibility', 'label', 'Stewardship through responsibility')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Make decisions',
      'Override approvals',
      'Hide audit trails',
      'Expose unauthorized data',
      'Replace human oversight',
      'Determine organizational priorities'), 'principle', '${P.companion} explains — humans decide.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — confidence through transparency, humility in uncertainty, service through clarity.', 'values', jsonb_build_array('confidence_through_transparency','humility_in_uncertainty','service_through_clarity','trust_without_attachment','clarity_over_complexity'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Decision audit logs via aipify_decision_transparency_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_decision_transparency permissions'),
    jsonb_build_object('key', 'decision_records', 'label', 'Sensitive decision records — authorized users only'),
    jsonb_build_object('key', 'immutable_audit', 'label', 'Immutable audit records'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 192, 'key', 'ethical_evolution', 'label', 'Ethical Evolution Phase 192', 'route', '/app/aipify-ethical-evolution-responsible-innovation-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 193, 'key', 'guardianship_succession', 'label', 'Guardianship & Succession Phase 193', 'route', '/app/aipify-guardianship-succession-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 194, 'key', 'legacy_preservation', 'label', 'Legacy Preservation Phase 194', 'route', '/app/aipify-legacy-preservation-knowledge-continuity-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 195, 'key', 'values_transmission', 'label', 'Values Transmission Phase 195', 'route', '/app/aipify-values-transmission-cultural-continuity-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 196, 'key', 'principles_enforcement', 'label', 'Principles Enforcement Phase 196', 'route', '/app/aipify-principles-enforcement-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 197, 'key', 'decision_transparency', 'label', 'Decision Transparency Phase 197', 'route', '/app/${P.slug}', 'description', 'Explainability and audit transparency')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'principles_enforcement', 'label', 'Principles Enforcement Phase 196', 'route', '/app/aipify-principles-enforcement-engine', 'relationship', 'Prior phase — cross-link only'),
    jsonb_build_object('key', 'trust_actions', 'label', 'Trust & Action Engine', 'route', '/app/approvals', 'relationship', 'Human oversight and approvals — cross-link only'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center', 'route', '/app/action-center', 'relationship', 'Completed actions audit — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Confidence through transparency — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with metadata-only decision explanations and audit scaffolds. Growth Partner terminology. ${P.companion} explains — never makes decisions or overrides approvals.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans decide.', '${P.companion} informs and explains.', 'Transparency strengthens trust.', 'Growth Partner — never Affiliate.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — executive review summaries max ~500 chars, explanation aggregates. No PII, surveillance, or unauthorized data exposure.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`) && sql.includes(`'${P.prevDecision}'`)) return sql;
  const additions = [];
  if (!sql.includes("'aipify_guardianship_succession_engine'")) {
    additions.push("'aipify_guardianship_succession_engine'");
  }
  if (!sql.includes("'aipify_legacy_preservation_knowledge_continuity_engine'")) {
    additions.push("'aipify_legacy_preservation_knowledge_continuity_engine'");
  }
  if (!sql.includes("'aipify_values_transmission_cultural_continuity_engine'")) {
    additions.push("'aipify_values_transmission_cultural_continuity_engine'");
  }
  if (!sql.includes(`'${P.prevDecision}'`)) {
    additions.push(`'${P.prevDecision}'`);
  }
  if (!sql.includes(`'${P.decisionType}'`)) {
    additions.push(`'${P.decisionType}'`);
  }
  const missing = additions.filter((entry) => !sql.includes(entry));
  if (missing.length === 0) return sql;
  return sql.replace(
    "'aipify_ethical_evolution_responsible_innovation_engine'",
    `'aipify_ethical_evolution_responsible_innovation_engine',\n    ${missing.join(",\n    ")}`,
  );
}

function patchMigration(sql) {
  sql = sql.replace(
    /-- Phase \d+ —[^\n]+\n-- [^\n]+\n-- Helpers:[^\n]+/,
    `-- Phase ${P.phase} — ${P.title} Engine\n-- ${P.era}.\n-- Helpers: _${P.helper}_* (engine), _${P.bp}_* (blueprint)`,
  );
  sql = patchDecisionTypeChain(sql);
  const start = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const end = sql.indexOf(`create or replace function public._${P.helper}_refresh_metrics`);
  if (start !== -1 && end !== -1) sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);

  const bp = P.bp;
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_decision_explanation_center\(\)->'capabilities'\) = 8,/,
    `jsonb_build_object('key', 'center', 'label', '${P.centerTitle} — eight capabilities', 'met', jsonb_array_length(public._${bp}_decision_explanation_center()->'capabilities') = 8,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_transparency_reflection_engine\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Transparency reflection engine — five questions', 'met', jsonb_array_length(public._${bp}_transparency_reflection_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'companion', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_transparency_companion\(\)->'capabilities'\) = 6,/,
    `jsonb_build_object('key', 'companion', 'label', '${P.companion} capabilities', 'met', jsonb_array_length(public._${bp}_transparency_companion()->'capabilities') = 6,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases documented', 'met', jsonb_array_length(public._${bp}_era_opener_summary()) = 6,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'baseline', 'label', 'Repo Phase \d+ baseline tables'/,
    `jsonb_build_object('key', 'baseline', 'label', 'Repo Phase ${P.phase} baseline tables'`,
  );

  for (const fn of [
    "decision_explanation_center",
    "transparency_reflection_engine",
    "transparency_framework",
    "executive_transparency_reviews",
    "transparency_companion",
    "practices_engine",
    "governance_alignment_engine",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${bp}_${fn}()`);
  }

  if (!sql.includes("governance_alignment_engine_meta")) {
    sql = sql.replace(
      `'sub_engine_meta', public._${bp}_practices_engine(),`,
      `'sub_engine_meta', public._${bp}_practices_engine(), 'governance_alignment_engine_meta', public._${bp}_governance_alignment_engine(),`,
    );
  }

  sql = sql.replace(
    /select 'aipify-decision-transparency-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', 198
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`Phase ${P.phase} Aipify[^']+`, "g"),
    `Phase ${P.phase} ${P.title} Engine — decision transparency within Perpetual Stewardship era; cross-link only for related engines.`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  return sql;
}

function genMigration() {
  let m = transformFrom195(fs.readFileSync(path.join(ROOT, "supabase/migrations/20261355000000_aipify_values_transmission_cultural_continuity_engine_phase195.sql"), "utf8"));
  m = m.replace(/_adte_seed_transparency_notes/g, `_adte_seed_${P.thirdEntity.replace("_notes", "")}_notes`);
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genDocs() {
  write(path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`), `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports explainability — does NOT make decisions or override approvals.

## Permissions

- \`${P.permPrefix}.view\` · \`${P.permPrefix}.manage\` · \`${P.permPrefix}.steward\`

## Helpers

- Engine: \`_${P.helper}_*\` · Blueprint: \`_${P.bp}_*\`

${P.crossLinkNote}
`);
  write(path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`), `# Implementation Blueprint — Phase ${P.phase} Aipify Decision Transparency Engine\n\nRoute: \`/app/${P.slug}\`\nEra: ${P.era}\n${P.crossLinkNote}\n`);
  write(path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`), `# ${P.title} Engine — FAQ (Phase ${P.phase})\n\n${P.faqBody}\n`);
  write(path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`), `ABOS Phase ${P.phase} — ${P.title}\nRoute: /app/${P.slug}\n${P.ilmExtra}\n${P.crossLinkNote}\nPeople First. Growth Partner — never Affiliate.\n`);
  write(path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`), `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} explains; humans decide.";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/${P.slug}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_COMPANION_LIMITATIONS = [\n${P.companionLimitations.map((l) => `  "${l}",`).join("\n")}\n] as const;\n`);
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports decision explanations, audit timelines, and oversight scaffolds. Supports humans — does NOT make decisions or override approvals. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Engagement score",
    modeLabel: "Mode",
    readinessLabel: "Oversight confidence level",
    executiveReviews: "Executive transparency reviews",
    activeReflections: "Active reflections",
    humanOversightRequired: `Human oversight required — humans decide; ${P.companion} explains only`,
    eraOpenerSummary: `Perpetual Stewardship Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate era engine RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Transparency reflection engine — reflection prompts",
    frameworkLabel: "Transparency framework",
    reviewsLabel: "Executive transparency reviews",
    companionLabel: `${P.companion} — explains, does not decide`,
    subEngineLabel: "Practices engine",
    reflections: "Transparency reflection scaffolds",
    executiveReviewEntries: "Transparency review entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT make decisions or override approvals`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports decision explanations and audit transparency — humans retain decision authority.`,
      philosophy: "People First. Confidence through transparency. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
    },
  };
}

function patchNav() {
  let c = fs.readFileSync(path.join(ROOT, "lib/app/nav-config.ts"), "utf8");
  const id = P.camel;
  const href = `/app/${P.slug}`;
  if (!c.includes(`"${id}"`)) {
    c = c.replace('| "aipifyValuesTransmissionCulturalContinuityEngine"', `| "aipifyValuesTransmissionCulturalContinuityEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    c = c.replace(
      /id: "aipifyValuesTransmissionCulturalContinuityEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyValuesTransmissionCulturalContinuityEngine",\n  },/,
      (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-values-transmission-cultural-continuity-engine")) {\n    return "aipifyValuesTransmissionCulturalContinuityEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-values-transmission-cultural-continuity-engine")) {\n    return "aipifyValuesTransmissionCulturalContinuityEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
  console.log("patched nav-config");
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_values_transmission_cultural_continuity.steward",', `"aipify_values_transmission_cultural_continuity.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
  console.log("patched permissions");
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-values-transmission-cultural-continuity-engine";',
      `export * from "./aipify-values-transmission-cultural-continuity-engine";\nexport * from "./${P.slug}";`,
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
        ? "Beslutningstransparens"
        : locale === "sv"
          ? "Beslutstransparens"
          : locale === "da"
            ? "Beslutningstransparens"
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
      'export * from "./implementation-blueprint-phase195-vocabulary";',
      `export * from "./implementation-blueprint-phase195-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  const corpus = `aipify-core/knowledge/internal-language-model/${P.ilmFile}`;
  if (!c.includes(corpus)) {
    c = c.replace(
      '"aipify-core/knowledge/internal-language-model/implementation-blueprint-phase195-aipify-values-transmission-cultural-continuity.txt";',
      `"aipify-core/knowledge/internal-language-model/implementation-blueprint-phase195-aipify-values-transmission-cultural-continuity.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "${corpus}";`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/internal-language-model/index.ts"), c);
  console.log("patched ilm index");
}

function patchArchitecture() {
  let c = fs.readFileSync(path.join(ROOT, "ARCHITECTURE.md"), "utf8");
  const entry = `\n**Aipify Decision Transparency Engine (Phase 197):** See [AIPIFY_DECISION_TRANSPARENCY_ENGINE_PHASE197.md](./AIPIFY_DECISION_TRANSPARENCY_ENGINE_PHASE197.md) — ${P.centerTitle} for decision explanations, recommendation timeline, action audit viewer, human oversight dashboard, data source attribution, suggestion differentiation, enterprise compliance, and explanation knowledge libraries. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} explains — **NOT** make decisions or override approvals. Cross-links only: Phase 196 principles enforcement, trust_action_engine, action_center. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 197")) {
    const marker = "Permissions `aipify_values_transmission_cultural_continuity.steward`.";
    const idx = c.indexOf(marker);
    if (idx !== -1) {
      c = c.slice(0, idx + marker.length) + entry + c.slice(idx + marker.length);
    } else {
      c += entry;
    }
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
console.log("Phase 197 complete");
