#!/usr/bin/env node
/** ABOS Phase 272 — Enterprise Purpose & Values Alignment Engine (Purpose Alignment Era 269–273) */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "purpose_alignment_dashboard",
  "purpose_registry",
  "values_framework",
  "alignment_assessment_engine",
  "decision_alignment_checks",
  "values_in_action_recognition",
  "cultural_signal_monitoring",
  "executive_purpose_dashboard",
  "purpose_recommendations",
  "purpose_alignment_integration_center",
];

const P = {
  phase: 272,
  migration: "20261420000000_aipify_enterprise_purpose_values_alignment_engine_phase272.sql",
  slug: "aipify-enterprise-purpose-values-alignment-engine",
  base: "AipifyEnterprisePurposeValuesAlignment",
  camel: "aipifyEnterprisePurposeValuesAlignmentEngine",
  snake: "aipify_enterprise_purpose_values_alignment",
  permPrefix: "aipify_enterprise_purpose_values_alignment",
  helper: "aepvae",
  bp: "aepvaebp272",
  decisionType: "aipify_enterprise_purpose_values_alignment_engine",
  title: "Enterprise Purpose & Values Alignment",
  centerTitle: "Purpose Alignment Center",
  companion: "Purpose Alignment Companion",
  scoreKey: "aipify_enterprise_purpose_values_alignment_score",
  modeKey: "enterprise_purpose_values_alignment_mode",
  levelKey: "enterprise_purpose_values_alignment_index_level",
  thirdEntity: "enterprise_purpose_values_alignment_notes",
  era: "Purpose Alignment Era (269–273)",
  eraRange: "269–273",
  docSlug: "AIPIFY_ENTERPRISE_PURPOSE_VALUES_ALIGNMENT",
  ilmFile: "implementation-blueprint-phase272-aipify-enterprise-purpose-values-alignment.txt",
  navLabel: "Purpose & Values",
  crossLinkNote: "Cross-links only: Enterprise Policy Compliance Management Engine, Organizational Memory Engine Phase 260, Employee Knowledge Engine, Trust & Relationship Intelligence Engine Phase 262, and Executive Copilot Engine Phase 267 — Aipify encourages reflection; leaders define culture; never omit purpose alignment audit history.",
  companionLimitations: [
    "replacing_leadership_culture",
    "making_cultural_decisions_for_leadership",
    "hiding_misalignment_signals",
    "judging_individuals_without_context",
    "bypassing_governance_review",
    "modifying_purpose_alignment_audit_trail",
    "unlogged_purpose_recommendations",
    "override_leaders_define_culture"
  ]
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom267(content) {
  const pairs = [
    ["AipifyEnterpriseExecutiveCopilot", "AipifyEnterprisePurposeValuesAlignment"],
    ["aipify-enterprise-executive-copilot-engine", "aipify-enterprise-purpose-values-alignment-engine"],
    ["aipify_enterprise_executive_copilot", "aipify_enterprise_purpose_values_alignment"],
    ["aipifyEnterpriseExecutiveCopilotEngine", "aipifyEnterprisePurposeValuesAlignmentEngine"],
    ["aeecpebp267", "aepvaebp272"],
    ["_aeecpe_", "_aepvae_"],
    ["aipify_enterprise_executive_copilot_score", "aipify_enterprise_purpose_values_alignment_score"],
    ["enterprise_executive_copilot_mode", "enterprise_purpose_values_alignment_mode"],
    ["enterprise_executive_copilot_effectiveness_level", "enterprise_purpose_values_alignment_index_level"],
    ["enterprise_executive_copilot_notes", "enterprise_purpose_values_alignment_notes"],
    ["EnterpriseExecutiveCopilotNotes", "EnterprisePurposeValuesAlignmentNotes"],
    ["enterprise_executive_copilot_notes_count", "enterprise_purpose_values_alignment_notes_count"],
    ["Executive Copilot Phase 267", "__PURPOSE_PHASE_267__"],
    ["Executive Copilot Companion", "__PURPOSE_COMPANION__"],
    ["Enterprise Executive Copilot", "Enterprise Purpose & Values Alignment"],
    ["__PURPOSE_COMPANION__", "Purpose Alignment Companion"],
    ["Executive Copilot Center", "__PURPOSE_CENTER__"],
    ["__PURPOSE_PHASE_267__", "Executive Copilot Phase 267"],
    ["Phase 267", "Phase 272"],
    ["aipify_enterprise_executive_copilot.view", "aipify_enterprise_purpose_values_alignment.view"],
    ["aipify_enterprise_executive_copilot.manage", "aipify_enterprise_purpose_values_alignment.manage"],
    ["aipify_enterprise_executive_copilot.steward", "aipify_enterprise_purpose_values_alignment.steward"],
    ["aipify_enterprise_executive_copilot_engine", "aipify_enterprise_purpose_values_alignment_engine"],
    ["20261419500000_aipify_enterprise_executive_copilot_engine_phase267.sql", "20261420000000_aipify_enterprise_purpose_values_alignment_engine_phase272.sql"],
    ["Repo Phase 267", "Repo Phase 272"],
    ["Phase 267 —", "Phase 272 —"],
    ["IMPLEMENTATION_BLUEPRINT_PHASE267_AIPIFY_ENTERPRISE_EXECUTIVE_COPILOT", "IMPLEMENTATION_BLUEPRINT_PHASE272_AIPIFY_ENTERPRISE_PURPOSE_VALUES_ALIGNMENT"],
    ["implementation-blueprint-phase267", "implementation-blueprint-phase272"],
    ["executive_insight_timeline", "alignment_history"],
    ["executive_copilot_dashboard", "purpose_alignment_dashboard"],
    ["executive_briefing_engine", "purpose_registry"],
    ["priority_intelligence_engine", "values_framework"],
    ["executive_attention_management_engine", "alignment_assessment_engine"],
    ["decision_support_workspace", "decision_alignment_checks"],
    ["executive_follow_through_tracking", "values_in_action_recognition"],
    ["cross_functional_executive_view", "executive_purpose_dashboard"],
    ["executive_copilot_integration_center", "purpose_alignment_integration_center"],
    ["executive_copilot_companion", "purpose_alignment_companion"],
    ["_seed_enterprise_executive_copilot_notes", "_seed_enterprise_purpose_values_alignment_notes"],
    ["executive briefing stewardship", "purpose registry stewardship"],
    ["priority-informed executive support", "values-informed alignment support"],
    ["executive-focus leadership culture", "purpose-driven culture"],
    ["active executive priorities", "active purpose registry entries"],
    ["decisions requiring executive attention", "initiatives requiring leadership attention"],
    ["Executive Briefing Engine", "Purpose Registry"],
    ["Priority Intelligence", "Values Framework"],
    ["Executive Attention Management", "Alignment Assessment Engine"],
    ["Decision Support Workspace", "Decision Alignment Checks"],
    ["Executive Follow-Through Tracking", "Values in Action Recognition"],
    ["Executive Insight Timeline", "Executive Purpose Dashboard"],
    ["executive insight timeline indicators", "alignment history indicators"],
    ["executive briefing prompts", "purpose registry prompts"],
    ["executive copilot prompts", "purpose alignment prompts"],
    ["cross-functional executive view", "executive purpose dashboard"],
    ["executive attention triggers", "cultural signal triggers"],
    ["RBAC-protected executive copilot governance", "RBAC-protected purpose alignment governance"],
    ["Aipify advises — executives decide", "Aipify encourages reflection — leaders define culture"],
    ["Executives decide", "Leaders define culture"],
    ["Support decisions without replacing judgment", "Support reflection without replacing culture"],
    ["no_bypassing_executive_copilot_governance", "no_bypassing_purpose_alignment_governance"],
    ["AIPIFY_ENTERPRISE_EXECUTIVE_COPILOT", "AIPIFY_ENTERPRISE_PURPOSE_VALUES_ALIGNMENT"],
    ["enterprise executive copilot", "enterprise purpose values alignment"],
    ["Executive copilot audit logs", "Purpose alignment audit logs"],
    ["executive copilot governance RBAC", "purpose alignment governance RBAC"],
    ["executive copilot scaffolds", "purpose alignment scaffolds"],
    ["organization executive briefing policies", "organization purpose and values policies"],
    ["Executive effectiveness index", "Purpose alignment index"],
    ["Executive effectiveness level", "Purpose alignment index level"],
    ["Insight timeline entries", "Alignment history entries"],
    ["executive commitment stewardship", "values recognition stewardship"],
    ["executive copilot records beyond RBAC", "purpose alignment records beyond RBAC"],
    ["executive recommendation assistance", "purpose recommendation assistance"],
    ["executive cross-functional visibility", "cultural alignment visibility"],
    ["Autonomous Coordination Engine Phase 266, Organizational Insights & Executive Intelligence Engine Phase 223, Strategic Execution Engine Phase 263, Decision Support Engine, and Executive Cockpit Phase 200", "Enterprise Policy Compliance Management Engine, Organizational Memory Engine Phase 260, Employee Knowledge Engine, Trust & Relationship Intelligence Engine Phase 262, and Executive Copilot Engine Phase 267"],
    ["Never replace executive judgment or make decisions on behalf of executives", "Never replace leadership culture or make cultural decisions on behalf of leadership"],
    ["executive priorities", "alignment priorities"],
    ["Executive priorities", "Alignment priorities"],
    ["executive attention routing", "misalignment routing"],
    ["decides without executive judgment", "defines culture without leadership approval"],
    ["Unauthorized executive action without executive approval", "Unauthorized cultural action without leadership approval"],
    ["Modifying executive copilot audit trails", "Modifying purpose alignment audit trails"],
    ["Decide before executive review", "Act before leadership review"],
    ["user executive control", "user leadership control"],
    ["User executive control", "User leadership control"],
    ["briefing outcomes and executive preference policies", "alignment outcomes and values policies"],
    ["executive insight visibility", "recognition activity visibility"],
    ["executive copilot", "purpose values alignment"],
    ["enable executives to maintain awareness, prioritize effectively, identify emerging risks and opportunities, and support high-quality decision-making — maintaining executive copilot governance, executives decide with Aipify advisory support, full audit logging, role-based permissions, and leadership effectiveness that compounds over time", "enable organizations to ensure decisions, initiatives, behaviors, communications, and operational practices remain aligned with purpose, mission, values, and leadership principles — maintaining purpose alignment governance, leaders define culture with Aipify reflection support, full audit logging, role-based permissions, and institutional understanding that compounds over time"],
    ["executive decision delays reduce, strategic focus improves, follow-through rates increase, executive engagement rises, emerging issues are identified faster, and executive effectiveness scores strengthen with Aipify advises — executives decide", "alignment scores improve, recognition participation increases, leadership engagement strengthens, cultural friction reduces, initiative alignment rates rise, and purpose alignment index performance improves with Aipify encourages reflection — leaders define culture"],
    ["Continues the era.", "Continues the era."],
    ["continues the era", "continues the era"],
    ["Opportunity Discovery Era continues", "Purpose Alignment Era continues"],
    ["Opportunity Discovery Era (264–268)", "Purpose Alignment Era (269–273)"],
    ["264–268", "269–273"],
    ["__PURPOSE_CENTER__", "Purpose Alignment Center"],
  ];
  let out = content;
  for (const [from, to] of pairs) out = out.split(from).join(to);
  return out;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 272 — Purpose Alignment Center. Purpose Alignment Companion supports enterprise purpose and values alignment — NOT replacing leadership culture, making cultural decisions for leadership, or omitting purpose alignment audit history. Helpers _${bp}_*.'; $$;
create or replace function public._${bp}_mission() returns text language sql immutable as $$ select 'Ensure decisions, initiatives, behaviors, communications, and operational practices remain aligned with purpose, mission, values, and leadership principles — Purpose Alignment Companion encourages reflection; leaders define culture.'; $$;
create or replace function public._${bp}_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._${bp}_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Purpose Alignment Center within Purpose Alignment Era (269–273). Aipify encourages reflection; leaders define culture; governance-governed alignment; full audit logging; Purpose Alignment Companion informs and recommends. Continues the era.'; $$;
create or replace function public._${bp}_vision() returns text language sql immutable as $$ select 'Organizations improve alignment scores, increase recognition participation, strengthen leadership engagement, reduce cultural friction, raise initiative alignment rates, and improve purpose alignment index performance with Aipify encourages reflection — leaders define culture.'; $$;
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Purpose Alignment Center programs', 'emoji', '✅', 'description', 'Ten purpose alignment modules'),
    jsonb_build_object('key', 'purpose_registry', 'label', 'Purpose registry', 'emoji', '📋', 'description', 'Single source of truth for organizational identity'),
    jsonb_build_object('key', 'values_framework', 'label', 'Values framework', 'emoji', '🔍', 'description', 'Practical values guidance'),
    jsonb_build_object('key', 'alignment_assessment_engine', 'label', 'Alignment assessment engine', 'emoji', '📊', 'description', 'Initiative alignment evaluation'),
    jsonb_build_object('key', 'companion', 'label', 'Purpose Alignment Companion', 'emoji', '✨', 'description', 'Encourages reflection — leaders define culture'),
    jsonb_build_object('key', 'decision_alignment_checks', 'label', 'Decision alignment checks', 'emoji', '🧪', 'description', 'Principle-based leadership encouragement'),
    jsonb_build_object('key', 'cultural_signal_monitoring', 'label', 'Cultural signal monitoring', 'emoji', '🛡️', 'description', 'Alignment trend identification'),
    jsonb_build_object('key', 'alignment_history', 'label', 'Alignment history', 'emoji', '🔔', 'description', 'Institutional understanding preserved')
  ); $$;
create or replace function public._${bp}_purpose_alignment_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Purpose Alignment Center — ten capabilities. Aipify encourages reflection — leaders define culture.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'purpose_registry', 'label', 'Purpose Registry'),
    jsonb_build_object('key', 'values_framework', 'label', 'Values Framework'),
    jsonb_build_object('key', 'alignment_assessment_engine', 'label', 'Alignment Assessment Engine'),
    jsonb_build_object('key', 'decision_alignment_checks', 'label', 'Decision Alignment Checks'),
    jsonb_build_object('key', 'values_in_action_recognition', 'label', 'Values in Action Recognition'),
    jsonb_build_object('key', 'cultural_signal_monitoring', 'label', 'Cultural Signal Monitoring'),
    jsonb_build_object('key', 'executive_purpose_dashboard', 'label', 'Executive Purpose Dashboard'),
    jsonb_build_object('key', 'purpose_recommendations', 'label', 'Aipify Purpose Recommendations'),
    jsonb_build_object('key', 'alignment_history', 'label', 'Alignment History'),
    jsonb_build_object('key', 'purpose_alignment_index', 'label', 'Purpose Alignment Index')
  )); $$;
create or replace function public._${bp}_purpose_registry() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Purpose registry — single source of truth for organizational identity.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'company_purpose', 'label', 'Is company purpose recorded?'),
    jsonb_build_object('key', 'mission_vision', 'label', 'Are mission and vision statements captured?'),
    jsonb_build_object('key', 'core_values', 'label', 'Are core values and leadership principles documented?'),
    jsonb_build_object('key', 'behavioral_expectations', 'label', 'Are behavioral expectations defined?'),
    jsonb_build_object('key', 'leaders_define_culture', 'label', 'How does registry support leaders define culture — not replace culture?')
  )); $$;
create or replace function public._${bp}_values_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Values framework — translate abstract values into practical guidance.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'value_definition', 'label', 'Value definition captured'),
    jsonb_build_object('key', 'observable_behaviors', 'label', 'Observable behaviors documented'),
    jsonb_build_object('key', 'draft', 'label', 'Draft registry status'),
    jsonb_build_object('key', 'approved', 'label', 'Approved registry status'),
    jsonb_build_object('key', 'active', 'label', 'Active registry status'),
    jsonb_build_object('key', 'historical', 'label', 'Historical registry status')
  )); $$;
create or replace function public._${bp}_executive_purpose_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive purpose dashboard — cultural awareness for leadership.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'alignment_trends', 'label', 'Alignment trends widget'),
    jsonb_build_object('key', 'purpose_reinforcement', 'label', 'Purpose reinforcement indicators'),
    jsonb_build_object('key', 'recognition_activity', 'label', 'Values recognition activity'),
    jsonb_build_object('key', 'leadership_attention', 'label', 'Areas requiring leadership attention'),
    jsonb_build_object('key', 'purpose_alignment_score', 'label', 'Purpose alignment score')
  )); $$;
create or replace function public._${bp}_purpose_alignment_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Purpose Alignment Companion — encourages reflection and recommends; never replaces leadership culture or makes cultural decisions for leadership.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'communication_efforts', 'label', 'Increase communication effort recommendations'),
    jsonb_build_object('key', 'reinforce_values', 'label', 'Reinforce specific values suggestions'),
    jsonb_build_object('key', 'recognize_examples', 'label', 'Recognize positive example guidance'),
    jsonb_build_object('key', 'review_misaligned', 'label', 'Review potentially misaligned initiative suggestions'),
    jsonb_build_object('key', 'leadership_discussions', 'label', 'Facilitate leadership discussion recommendations'),
    jsonb_build_object('key', 'alignment_guardrails', 'label', 'Purpose alignment governance — Trust Architecture enforced')
  )); $$;
create or replace function public._${bp}_alignment_assessment_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Alignment assessment engine — evaluate whether initiatives reflect organizational principles.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'strategic_initiatives', 'label', 'Strategic initiative assessment'),
    jsonb_build_object('key', 'strongly_aligned', 'label', 'Strongly aligned state'),
    jsonb_build_object('key', 'generally_aligned', 'label', 'Generally aligned state'),
    jsonb_build_object('key', 'needs_review', 'label', 'Needs review state'),
    jsonb_build_object('key', 'misaligned', 'label', 'Misaligned state')
  )); $$;
create or replace function public._${bp}_decision_alignment_checks() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Decision alignment checks — encourage principle-based leadership; advisory only.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'supports_purpose', 'label', 'Does this support our purpose?'),
    jsonb_build_object('key', 'consistent_values', 'label', 'Is it consistent with our values?'),
    jsonb_build_object('key', 'reinforces_trust', 'label', 'Does it reinforce trust?'),
    jsonb_build_object('key', 'human_judgment', 'label', 'Human judgment remains essential'),
    jsonb_build_object('key', 'advisory_only', 'label', 'Advisory only — not prescriptive')
  )); $$;
create or replace function public._${bp}_cultural_signal_monitoring() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Cultural signal monitoring — identify trends that may affect alignment.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'recognition_patterns', 'label', 'Recognition pattern monitoring'),
    jsonb_build_object('key', 'reinforcing_values', 'label', 'Reinforcing values signal state'),
    jsonb_build_object('key', 'neutral', 'label', 'Neutral signal state'),
    jsonb_build_object('key', 'needs_attention', 'label', 'Needs attention signal state'),
    jsonb_build_object('key', 'potential_misalignment', 'label', 'Potential misalignment signal state')
  )); $$;
create or replace function public._${bp}_alignment_history() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Alignment history — preserve institutional understanding over time.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'purpose_updates', 'label', 'Purpose updates tracked'),
    jsonb_build_object('key', 'values_evolution', 'label', 'Values framework evolution recorded'),
    jsonb_build_object('key', 'alignment_reviews', 'label', 'Alignment reviews completed logged'),
    jsonb_build_object('key', 'leaders_define_culture', 'label', 'Aipify encourages reflection — leaders define culture'),
    jsonb_build_object('key', 'index_levels', 'label', 'Unclear, Emerging, Consistent, Purpose-Driven, Deeply Aligned')
  )); $$;
create or replace function public._${bp}_purpose_alignment_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Purpose alignment integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'policy_compliance', 'label', 'Enterprise Policy Compliance Management Engine', 'cross_link', '/app/aipify-enterprise-policy-compliance-management-engine'),
    jsonb_build_object('key', 'organizational_memory', 'label', 'Organizational Memory Phase 260', 'cross_link', '/app/aipify-enterprise-organizational-memory-engine'),
    jsonb_build_object('key', 'employee_knowledge', 'label', 'Employee Knowledge Engine', 'cross_link', '/app/settings/employee-knowledge'),
    jsonb_build_object('key', 'trust_relationship', 'label', 'Trust & Relationship Intelligence Phase 262', 'cross_link', '/app/aipify-enterprise-trust-relationship-intelligence-engine'),
    jsonb_build_object('key', 'executive_copilot', 'label', 'Executive Copilot Phase 267', 'cross_link', '/app/aipify-enterprise-executive-copilot-engine'),
    jsonb_build_object('key', 'leadership_gates', 'label', 'Leadership gates — Aipify encourages reflection only')
  )); $$;
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Replacing leadership culture',
      'Making cultural decisions for leadership',
      'Hiding misalignment signals',
      'Judging individuals without context',
      'Modifying purpose alignment audit trails',
      'Unlogged purpose recommendations',
      'Bypassing governance review',
      'Override leaders define culture'), 'principle', 'Purpose Alignment Companion encourages reflection — leaders define culture and alignment history stays auditable.'); $$;
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm purpose alignment support without pressure.', 'values', jsonb_build_array('aipify_encourages_reflection','leaders_define_culture','low_administrative_burden','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Purpose alignment audit logs via aipify_enterprise_purpose_values_alignment_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_purpose_values_alignment permissions — purpose alignment governance RBAC'),
    jsonb_build_object('key', 'leadership_gates', 'label', 'Leaders define culture — Aipify encourages reflection only'),
    jsonb_build_object('key', 'values_policies', 'label', 'Organization-defined purpose and values policies'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Purpose alignment metadata only — no raw operational records'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 270, 'key', 'enterprise_collective_intelligence', 'label', 'Collective Intelligence Phase 270', 'route', '/app/aipify-enterprise-collective-intelligence-engine', 'description', 'Collective intelligence — cross-link only'),
    jsonb_build_object('phase', 271, 'key', 'enterprise_future_readiness', 'label', 'Future Readiness Phase 271', 'route', '/app/aipify-enterprise-future-readiness-engine', 'description', 'Future readiness — cross-link only'),
    jsonb_build_object('phase', 272, 'key', 'enterprise_purpose_values_alignment', 'label', 'Purpose & Values Phase 272', 'route', '/app/aipify-enterprise-purpose-values-alignment-engine', 'description', 'Enterprise purpose alignment — continues era')
  ); $$;
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'executive_copilot', 'label', 'Executive Copilot Phase 267', 'route', '/app/aipify-enterprise-executive-copilot-engine', 'relationship', 'Executive awareness — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/executive', 'relationship', 'Executive landing — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Leaders define culture — cross-link only')
  ); $$;
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as $$ select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); $$;
create or replace function public._${bp}_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Purpose Alignment Center internally with governance-governed alignment reviews and full audit logging. Growth Partner terminology. Purpose Alignment Companion encourages reflection — never replaces leadership culture or makes cultural decisions for leadership.'; $$;
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — leaders define culture.', 'Purpose Alignment Companion encourages reflection and recommends.', 'Aipify encourages reflection — leaders define culture.', 'Growth Partner — never Affiliate.', 'Purpose Alignment Era continues — 269–273.'); $$;
create or replace function public._${bp}_privacy_note() returns text language sql immutable as $$
  select 'Purpose Alignment Center metadata only — alignment summaries max ~500 chars. No raw operational records beyond RBAC or PII in audit logs.'; $$;
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_enterprise_executive_copilot_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._aeecpebp267_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_strategic_objective_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Purpose registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_purpose_registry()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_relationship_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Purpose registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_purpose_registry()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_critical_function_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Purpose registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_purpose_registry()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_memory_capture_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Purpose registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_purpose_registry()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_improvement_opportunity_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Purpose registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_purpose_registry()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_decision_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Purpose registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_purpose_registry()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_action_queue_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Purpose registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_purpose_registry()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_trend_monitoring_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Purpose registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_purpose_registry()->'reflection_questions') = 5,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_strategic_execution_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Purpose Alignment Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_purpose_alignment_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_relationship_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Purpose Alignment Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_purpose_alignment_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_resilience_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Purpose Alignment Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_purpose_alignment_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_memory_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Purpose Alignment Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_purpose_alignment_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_improvement_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Purpose Alignment Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_purpose_alignment_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_decision_governance_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Purpose Alignment Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_purpose_alignment_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_orchestration_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Purpose Alignment Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_purpose_alignment_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_intelligence_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Purpose Alignment Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_purpose_alignment_dashboard()->'capabilities') = 10,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 3,`,
  );

  const replaceRpcRef = (sqlText, fn) => {
    if (fn === "purpose_alignment_dashboard") {
      return sqlText.replace(/public\._(\w+)_purpose_alignment_dashboard\(\)/g, (full, prefix) =>
        prefix.includes("executive") ? full : `public._${P.bp}_purpose_alignment_dashboard()`,
      );
    }
    return sqlText.replace(
      new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"),
      `public._${P.bp}_${fn}()`,
    );
  };

  for (const fn of [...SCAFFOLDS, "purpose_alignment_companion"].sort((a, b) => b.length - a.length)) {
    sql = replaceRpcRef(sql, fn);
  }

  sql = sql.replace(
    new RegExp(`select '${P.slug}'[^;]+;`, "g"),
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    /select 'aipify-enterprise-executive-copilot-engine'[^;]+;/g,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected enterprise purpose alignment guidance within Purpose Alignment Era;",
    "RBAC-protected enterprise purpose alignment guidance within Purpose Alignment Era;",
  );
  sql = sql.replaceAll(
    "RBAC-protected enterprise purpose alignment guidance within Purpose Alignment Era;",
    "RBAC-protected enterprise purpose alignment guidance within Purpose Alignment Era;",
  );
  sql = sql.replaceAll(
    "RBAC-protected enterprise continuous improvement guidance within Continuous Optimization Era;",
    "RBAC-protected enterprise purpose alignment guidance within Purpose Alignment Era;",
  );
  sql = sql.replace(
    /Phase 272 Enterprise Purpose & Values Alignment Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 264 Enterprise Opportunity Discovery Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 263 Enterprise Strategic Execution Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 262 Enterprise Trust & Relationship Intelligence Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 261 Enterprise Resilience & Business Continuity Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 259 Enterprise Continuous Improvement Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 258 Enterprise Decision Escalation & Governance Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 256 Enterprise Action Orchestration Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 255 Enterprise External Intelligence & Market Awareness Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );

  sql = sql.replaceAll("__TRANSLATE_CENTER__", P.centerTitle);

  sql = sql.replace(
    /'memory_memory_dashboard', public\._\w+_memory_memory_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_alignment_history()`,
  );
  sql = sql.replace(
    /'improvement_improvement_dashboard', public\._\w+_improvement_improvement_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_alignment_history()`,
  );
  sql = sql.replace(
    /'decision_decision_governance_dashboard', public\._\w+_decision_decision_governance_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_alignment_history()`,
  );
  sql = sql.replace(
    /'orchestration_orchestration_dashboard', public\._\w+_orchestration_orchestration_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_alignment_history()`,
  );
  sql = sql.replace(
    /'governance_rules_dashboard', public\._\w+_governance_rules_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_alignment_history()`,
  );
  sql = sql.replace(
    /'improvement_controls_dashboard', public\._\w+_improvement_controls_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_alignment_history()`,
  );
  sql = sql.replace(
    /'policy_controls_dashboard', public\._\w+_policy_controls_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_alignment_history()`,
  );
  sql = sql.replace(
    /'intelligence_controls_dashboard', public\._\w+_intelligence_controls_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_alignment_history()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_resilience_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_purpose_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_memory_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_purpose_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_improvement_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_purpose_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_decision_governance_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_purpose_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_orchestration_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_purpose_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_intelligence_controls_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_purpose_dashboard()`,
  );

  sql = sql.replace(
    /'memory_controls_dashboard', public\._\w+_memory_controls_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_alignment_history()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_memory_controls_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_purpose_dashboard()`,
  );

  return sql;
}

function genMigration() {
  const src267 = path.join(
    ROOT,
    "supabase/migrations/20261419500000_aipify_enterprise_executive_copilot_engine_phase267.sql",
  );
  if (!fs.existsSync(src267)) throw new Error("Phase 267 migration required");
  let m = transformFrom267(fs.readFileSync(src267, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-enterprise-executive-copilot-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(
    path.join(ROOT, `lib/core/${P.slug}.ts`),
    transformFrom267(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")),
  );
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(
      path.join(dst, f),
      transformFrom267(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")),
    );
  }
  const panel = path.join(
    ROOT,
    `components/app/${srcSlug}/AipifyEnterpriseExecutiveCopilotEngineDashboardPanel.tsx`,
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`),
    transformFrom267(fs.readFileSync(panel, "utf8")),
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/index.ts`),
    `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`,
  );
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom267(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom267(
        fs.readFileSync(path.join(ROOT, `app/api/aipify/${srcSlug}/${route}/route.ts`), "utf8"),
      ),
    );
  }
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. **Continues the era.** ${P.companion} supports purpose registry, values framework, alignment assessment engine, decision alignment checks, values in action recognition, cultural signal monitoring, executive purpose dashboard, Aipify purpose recommendations, alignment history, and purpose alignment index — does NOT replace leadership culture, make cultural decisions for leadership, or omit purpose alignment audit history.

## Permissions

- \`${P.permPrefix}.view\` · \`${P.permPrefix}.manage\` · \`${P.permPrefix}.steward\`

## Helpers

- Engine: \`_${P.helper}_*\` · Blueprint: \`_${P.bp}_*\`

${P.crossLinkNote}
`,
  );
  write(
    path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
    `# Implementation Blueprint — Phase ${P.phase} ${P.title} Engine

Route: \`/app/${P.slug}\`
Era: ${P.era} (continues)
${P.crossLinkNote}
`,
  );
  write(
    path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
    `# ${P.title} Engine — FAQ (Phase ${P.phase})

## What is the Enterprise Purpose & Values Alignment Engine?

The Enterprise Purpose & Values Alignment Engine helps organizations ensure decisions, initiatives, behaviors, communications, and operational practices remain aligned with purpose, mission, values, and leadership principles at \`/app/${P.slug}\`.

## What purpose alignment features are included?

Purpose registry, values framework, alignment assessment engine, decision alignment checks, values in action recognition, cultural signal monitoring, executive purpose dashboard, Aipify purpose recommendations, alignment history, and purpose alignment index.

## What alignment states apply?

Strongly aligned, generally aligned, needs review, and misaligned — with registry statuses draft, approved, active, and historical.

## What signal states apply?

Reinforcing values, neutral, needs attention, and potential misalignment.

## What does the purpose alignment flow look like?

Purpose established → values defined → behaviors clarified → initiatives reviewed → alignment signals monitored → recognition encouraged → recommendations generated → leadership actions taken → purpose alignment strengthened.

## Who can access purpose alignment?

Super Admin (full access), Tenant Admin (values policies), Executives (executive purpose dashboard), Theme owners (values framework), Contributors (recognition) — enterprise RBAC.

## Is full audit logging enforced?

**Yes.** Every purpose alignment lifecycle event is logged. Alignment metadata and recommendation history are recorded.

## How does this integrate with other Aipify surfaces?

${P.crossLinkNote}

## Does the Purpose Alignment Companion replace leadership culture?

**No.** Aipify encourages reflection — **leaders define culture.** ${P.companion} does **NOT** replace leadership culture, make cultural decisions for leadership, or omit purpose alignment audit history.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Purpose Alignment: purpose registry, values framework, alignment assessment, decision alignment checks, values in action recognition, cultural signal monitoring, executive purpose dashboard, purpose recommendations, alignment history, purpose alignment index.
Alignment states: strongly aligned, generally aligned, needs review, misaligned.
Registry statuses: draft, approved, active, historical.
Signal states: reinforcing values, neutral, needs attention, potential misalignment.
Index levels: unclear, emerging, consistent, purpose-driven, deeply aligned.
Flow: purpose established → values defined → behaviors clarified → initiatives reviewed → signals monitored → recognition encouraged → recommendations generated → leadership actions → alignment strengthened.
Security: purpose alignment governance RBAC, leadership gates, audit logging, metadata only, enterprise permissions, 2FA.
Design principles: Aipify encourages reflection — leaders define culture, human-centered language, low administrative complexity.
Companion limitations: no replacing leadership culture, no cultural decisions for leadership, no hiding misalignment signals, no judging individuals without context.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate. Era continues 269–273.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} encourages reflection; never replaces leadership culture, makes cultural decisions for leadership, or omits purpose alignment audit history.";
export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/${P.slug}";
export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_COMPANION_LIMITATIONS = [
${P.companionLimitations.map((l) => `  "${l}",`).join("\n")}
] as const;
`,
  );
}

function patchNav() {
  let c = fs.readFileSync(path.join(ROOT, "lib/app/nav-config.ts"), "utf8");
  const id = P.camel;
  const href = `/app/${P.slug}`;
  if (!c.includes(`"${id}"`)) {
    c = c.replace(
      '| "aipifyEnterpriseFutureReadinessEngine"',
      `| "aipifyEnterpriseFutureReadinessEngine"\n  | "${id}"`,
    );
  }
  if (!c.includes(href)) {
    const anchor =
      /id: "aipifyEnterpriseFutureReadinessEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyEnterpriseFutureReadinessEngine",\n  },/;
    c = c.replace(
      anchor,
      (m) =>
        `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-enterprise-future-readiness-engine")) {\n    return "aipifyEnterpriseFutureReadinessEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-enterprise-future-readiness-engine")) {\n    return "aipifyEnterpriseFutureReadinessEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace(
        '"aipify_enterprise_future_readiness.view",',
        `"aipify_enterprise_future_readiness.view",\n    "${perm}",`,
      );
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-enterprise-future-readiness-engine";',
      `export * from "./aipify-enterprise-future-readiness-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era} continues. ${P.companion} supports purpose registry, values framework, alignment assessment engine, decision alignment checks, values in action recognition, and executive purpose dashboard. Aipify encourages reflection — leaders define culture. Does NOT replace leadership culture or make cultural decisions for leadership. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Purpose alignment index",
    modeLabel: "Mode",
    readinessLabel: "Purpose alignment index level",
    executiveReviews: "Executive purpose dashboard",
    activeReflections: "Active purpose alignment scaffolds",
    humanOversightRequired: `Leaders define culture — users retain alignment control; ${P.companion} encourages reflection only`,
    eraOpenerSummary: `Purpose Alignment Era — Phases ${P.eraRange} (continues)`,
    eraOpenerNote:
      "Cross-link only — do not duplicate Enterprise Policy Compliance Management Engine, Organizational Memory Engine, Employee Knowledge Engine, Trust & Relationship Intelligence Engine, or Executive Copilot Engine RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Purpose registry — registry prompts",
    frameworkLabel: "Values framework",
    reviewsLabel: "Executive purpose dashboard",
    companionLabel: `${P.companion} — encourages reflection, leaders define culture`,
    subEngineLabel: "Cultural signal monitoring",
    reflections: "Purpose alignment scaffolds",
    executiveReviewEntries: "Alignment history entries",
    scaffoldNotes: "Leadership-governed alignment scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT replace leadership culture, make cultural decisions for leadership, or omit purpose alignment audit history`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports enterprise purpose and values alignment — leaders define culture and alignment history stays auditable.`,
      philosophy:
        "People First. Aipify encourages reflection — leaders define culture. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
      growthEra: `${P.era} — Phase ${P.phase} continues the era.`,
    },
  };
}

function patchI18n() {
  for (const locale of ["en", "no", "sv", "da"]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.nav = data.nav ?? {};
    data.nav[P.camel] =
      locale === "no"
        ? "Formål og verdier"
        : locale === "sv"
          ? "Syfte och värderingar"
          : locale === "da"
            ? "Formål og værdier"
            : P.navLabel;
    data[P.camel] = i18nBlock();
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  }
}

function patchIlmIndex() {
  const file = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes(`implementation-blueprint-phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase271-vocabulary";',
      `export * from "./implementation-blueprint-phase271-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE271_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase271-aipify-enterprise-future-readiness.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE271_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase271-aipify-enterprise-future-readiness.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Enterprise Purpose & Values Alignment Engine (Phase 272):** See [AIPIFY_ENTERPRISE_PURPOSE_VALUES_ALIGNMENT_PHASE272.md](./AIPIFY_ENTERPRISE_PURPOSE_VALUES_ALIGNMENT_PHASE272.md) — Purpose registry, values framework, alignment assessment engine, decision alignment checks, values in action recognition, cultural signal monitoring, executive purpose dashboard, Aipify purpose recommendations, alignment history, and purpose alignment index. **Continues** Purpose Alignment Era (269–273). \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} encourages reflection — **NOT** replacing leadership culture, making cultural decisions for leadership, or omitting purpose alignment audit history. Cross-links only: Enterprise Policy Compliance Management Engine, Organizational Memory Engine Phase 260, Employee Knowledge Engine, Trust & Relationship Intelligence Engine Phase 262, Executive Copilot Engine Phase 267. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 272")) {
    c = `${c}\n${entry}\n`;
    fs.writeFileSync(file, c);
  }
}

genDocs();
try {
  genMigration();
  genStack();
  patchNav();
  patchPermissions();
  patchTenant();
  patchI18n();
  patchIlmIndex();
  patchArchitecture();
  console.log(`Phase ${P.phase} complete`);
} catch (err) {
  console.error(`Phase ${P.phase} docs generated; stack requires Phase 267 artifacts: ${err.message}`);
  process.exitCode = 1;
}
