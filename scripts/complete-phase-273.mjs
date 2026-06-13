#!/usr/bin/env node
/** ABOS Phase 273 — Enterprise Organizational Clarity Engine (Organizational Clarity Era 269–273) */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "organizational_clarity_dashboard",
  "responsibility_registry",
  "decision_rights_mapping",
  "role_clarity_framework",
  "priority_alignment_engine",
  "escalation_path_visibility",
  "communication_clarity_insights",
  "executive_clarity_dashboard",
  "clarity_recommendations",
  "organizational_clarity_integration_center",
];

const P = {
  phase: 273,
  migration: "20261420100000_aipify_enterprise_organizational_clarity_engine_phase273.sql",
  slug: "aipify-enterprise-organizational-clarity-engine",
  base: "AipifyEnterpriseOrganizationalClarity",
  camel: "aipifyEnterpriseOrganizationalClarityEngine",
  snake: "aipify_enterprise_organizational_clarity",
  permPrefix: "aipify_enterprise_organizational_clarity",
  helper: "aeocle",
  bp: "aeoclebp273",
  decisionType: "aipify_enterprise_organizational_clarity_engine",
  title: "Enterprise Organizational Clarity",
  centerTitle: "Organizational Clarity Center",
  companion: "Organizational Clarity Companion",
  scoreKey: "aipify_enterprise_organizational_clarity_score",
  modeKey: "enterprise_organizational_clarity_mode",
  levelKey: "enterprise_organizational_clarity_index_level",
  thirdEntity: "enterprise_organizational_clarity_notes",
  era: "Organizational Clarity Era (269–273)",
  eraRange: "269–273",
  docSlug: "AIPIFY_ENTERPRISE_ORGANIZATIONAL_CLARITY",
  ilmFile: "implementation-blueprint-phase273-aipify-enterprise-organizational-clarity.txt",
  navLabel: "Organizational Clarity",
  crossLinkNote: "Cross-links only: Purpose & Values Alignment Engine Phase 272, Enterprise Policy Compliance Management Engine, Decision Escalation & Governance Engine Phase 258, Operating Rhythm Engine, and Executive Copilot Engine Phase 267 — Aipify improves clarity; leadership establishes accountability; never omit organizational clarity audit history.",
  companionLimitations: [
    "replacing_leadership_accountability",
    "assigning_ownership_without_stewardship",
    "hiding_decision_right_gaps",
    "creating_surveillance_pressure",
    "bypassing_governance_review",
    "modifying_organizational_clarity_audit_trail",
    "unlogged_clarity_recommendations",
    "override_leadership_accountability"
  ]
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom267(content) {
  const pairs = [
    ["AipifyEnterpriseExecutiveCopilot", "AipifyEnterpriseOrganizationalClarity"],
    ["aipify-enterprise-executive-copilot-engine", "aipify-enterprise-organizational-clarity-engine"],
    ["aipify_enterprise_executive_copilot", "aipify_enterprise_organizational_clarity"],
    ["aipifyEnterpriseExecutiveCopilotEngine", "aipifyEnterpriseOrganizationalClarityEngine"],
    ["aeecpebp267", "aeoclebp273"],
    ["_aeecpe_", "_aeocle_"],
    ["aipify_enterprise_executive_copilot_score", "aipify_enterprise_organizational_clarity_score"],
    ["enterprise_executive_copilot_mode", "enterprise_organizational_clarity_mode"],
    ["enterprise_executive_copilot_effectiveness_level", "enterprise_organizational_clarity_index_level"],
    ["enterprise_executive_copilot_notes", "enterprise_organizational_clarity_notes"],
    ["EnterpriseExecutiveCopilotNotes", "EnterpriseOrganizationalClarityNotes"],
    ["enterprise_executive_copilot_notes_count", "enterprise_organizational_clarity_notes_count"],
    ["Executive Copilot Phase 267", "__CLARITY_PHASE_267__"],
    ["Executive Copilot Companion", "__CLARITY_COMPANION__"],
    ["Enterprise Executive Copilot", "Enterprise Organizational Clarity"],
    ["__CLARITY_COMPANION__", "Organizational Clarity Companion"],
    ["Executive Copilot Center", "__CLARITY_CENTER__"],
    ["__CLARITY_PHASE_267__", "Executive Copilot Phase 267"],
    ["Phase 267", "Phase 273"],
    ["aipify_enterprise_executive_copilot.view", "aipify_enterprise_organizational_clarity.view"],
    ["aipify_enterprise_executive_copilot.manage", "aipify_enterprise_organizational_clarity.manage"],
    ["aipify_enterprise_executive_copilot.steward", "aipify_enterprise_organizational_clarity.steward"],
    ["aipify_enterprise_executive_copilot_engine", "aipify_enterprise_organizational_clarity_engine"],
    ["20261419500000_aipify_enterprise_executive_copilot_engine_phase267.sql", "20261420100000_aipify_enterprise_organizational_clarity_engine_phase273.sql"],
    ["Repo Phase 267", "Repo Phase 273"],
    ["Phase 267 —", "Phase 273 —"],
    ["IMPLEMENTATION_BLUEPRINT_PHASE267_AIPIFY_ENTERPRISE_EXECUTIVE_COPILOT", "IMPLEMENTATION_BLUEPRINT_PHASE273_AIPIFY_ENTERPRISE_ORGANIZATIONAL_CLARITY"],
    ["implementation-blueprint-phase267", "implementation-blueprint-phase273"],
    ["executive_insight_timeline", "clarity_knowledge_retention"],
    ["executive_copilot_dashboard", "organizational_clarity_dashboard"],
    ["executive_briefing_engine", "responsibility_registry"],
    ["priority_intelligence_engine", "decision_rights_mapping"],
    ["executive_attention_management_engine", "role_clarity_framework"],
    ["decision_support_workspace", "priority_alignment_engine"],
    ["executive_follow_through_tracking", "escalation_path_visibility"],
    ["cross_functional_executive_view", "executive_clarity_dashboard"],
    ["executive_copilot_integration_center", "organizational_clarity_integration_center"],
    ["executive_copilot_companion", "organizational_clarity_companion"],
    ["_seed_enterprise_executive_copilot_notes", "_seed_enterprise_organizational_clarity_notes"],
    ["executive briefing stewardship", "responsibility registry stewardship"],
    ["priority-informed executive support", "ownership-informed clarity support"],
    ["executive-focus leadership culture", "accountability-driven clarity culture"],
    ["active executive priorities", "active responsibility registry entries"],
    ["decisions requiring executive attention", "areas requiring leadership attention"],
    ["Executive Briefing Engine", "Responsibility Registry"],
    ["Priority Intelligence", "Decision Rights Mapping"],
    ["Executive Attention Management", "Role Clarity Framework"],
    ["Decision Support Workspace", "Priority Alignment Engine"],
    ["Executive Follow-Through Tracking", "Escalation Path Visibility"],
    ["Executive Insight Timeline", "Executive Clarity Dashboard"],
    ["executive insight timeline indicators", "clarity knowledge retention indicators"],
    ["executive briefing prompts", "responsibility registry prompts"],
    ["executive copilot prompts", "organizational clarity prompts"],
    ["cross-functional executive view", "executive clarity dashboard"],
    ["executive attention triggers", "communication friction triggers"],
    ["RBAC-protected executive copilot governance", "RBAC-protected organizational clarity governance"],
    ["Aipify advises — executives decide", "Aipify improves clarity — leadership establishes accountability"],
    ["Executives decide", "Leadership establishes accountability"],
    ["Support decisions without replacing judgment", "Support understanding without replacing accountability"],
    ["no_bypassing_executive_copilot_governance", "no_bypassing_organizational_clarity_governance"],
    ["AIPIFY_ENTERPRISE_EXECUTIVE_COPILOT", "AIPIFY_ENTERPRISE_ORGANIZATIONAL_CLARITY"],
    ["enterprise executive copilot", "enterprise organizational clarity"],
    ["Executive copilot audit logs", "Organizational clarity audit logs"],
    ["executive copilot governance RBAC", "organizational clarity governance RBAC"],
    ["executive copilot scaffolds", "organizational clarity scaffolds"],
    ["organization executive briefing policies", "organization clarity and ownership policies"],
    ["Executive effectiveness index", "Organizational clarity index"],
    ["Executive effectiveness level", "Organizational clarity index level"],
    ["Insight timeline entries", "Clarity knowledge retention entries"],
    ["executive commitment stewardship", "escalation path stewardship"],
    ["executive copilot records beyond RBAC", "organizational clarity records beyond RBAC"],
    ["executive recommendation assistance", "clarity recommendation assistance"],
    ["executive cross-functional visibility", "ownership transparency visibility"],
    ["Autonomous Coordination Engine Phase 266, Organizational Insights & Executive Intelligence Engine Phase 223, Strategic Execution Engine Phase 263, Decision Support Engine, and Executive Cockpit Phase 200", "Purpose & Values Alignment Engine Phase 272, Enterprise Policy Compliance Management Engine, Decision Escalation & Governance Engine Phase 258, Operating Rhythm Engine, and Executive Copilot Engine Phase 267"],
    ["Never replace executive judgment or make decisions on behalf of executives", "Never replace leadership accountability or assign ownership without stewardship"],
    ["executive priorities", "clarity priorities"],
    ["Executive priorities", "Clarity priorities"],
    ["executive attention routing", "priority conflict routing"],
    ["decides without executive judgment", "establishes accountability without leadership approval"],
    ["Unauthorized executive action without executive approval", "Unauthorized ownership assignment without leadership approval"],
    ["Modifying executive copilot audit trails", "Modifying organizational clarity audit trails"],
    ["Decide before executive review", "Assign before leadership review"],
    ["user executive control", "user leadership control"],
    ["User executive control", "User leadership control"],
    ["briefing outcomes and executive preference policies", "clarity outcomes and ownership policies"],
    ["executive insight visibility", "escalation path visibility"],
    ["executive copilot", "organizational clarity"],
    ["enable executives to maintain awareness, prioritize effectively, identify emerging risks and opportunities, and support high-quality decision-making — maintaining executive copilot governance, executives decide with Aipify advisory support, full audit logging, role-based permissions, and leadership effectiveness that compounds over time", "enable organizations to continuously improve clarity by reducing ambiguity, strengthening ownership, simplifying responsibilities, and ensuring people understand priorities, expectations, and decision rights — maintaining organizational clarity governance, leadership establishes accountability with Aipify clarity support, full audit logging, role-based permissions, and operational understanding that compounds over time"],
    ["executive decision delays reduce, strategic focus improves, follow-through rates increase, executive engagement rises, emerging issues are identified faster, and executive effectiveness scores strengthen with Aipify advises — executives decide", "ownership confusion reduces, decision-making accelerates, escalation delays lower, priority alignment improves, communication friction reduces, and organizational clarity index performance strengthens with Aipify improves clarity — leadership establishes accountability"],
    ["Continues the era.", "Caps the era."],
    ["continues the era", "caps the era"],
    ["Opportunity Discovery Era continues", "Organizational Clarity Era caps"],
    ["Opportunity Discovery Era (264–268)", "Organizational Clarity Era (269–273)"],
    ["264–268", "269–273"],
    ["__CLARITY_CENTER__", "Organizational Clarity Center"],
  ];
  let out = content;
  for (const [from, to] of pairs) out = out.split(from).join(to);
  return out;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 273 — Organizational Clarity Center. Organizational Clarity Companion supports enterprise organizational clarity — NOT replacing leadership accountability, assigning ownership without stewardship, or omitting organizational clarity audit history. Helpers _${bp}_*.'; $$;
create or replace function public._${bp}_mission() returns text language sql immutable as $$ select 'Continuously improve clarity by reducing ambiguity, strengthening ownership, simplifying responsibilities, and ensuring people understand priorities, expectations, and decision rights — Organizational Clarity Companion improves clarity; leadership establishes accountability.'; $$;
create or replace function public._${bp}_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._${bp}_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Organizational Clarity Center within Organizational Clarity Era (269–273). Aipify improves clarity; leadership establishes accountability; governance-governed ownership; full audit logging; Organizational Clarity Companion informs and recommends. Caps the era.'; $$;
create or replace function public._${bp}_vision() returns text language sql immutable as $$ select 'Organizations reduce ownership confusion, accelerate decision-making, lower escalation delays, improve priority alignment, reduce communication friction, and strengthen organizational clarity index performance with Aipify improves clarity — leadership establishes accountability.'; $$;
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Organizational Clarity Center programs', 'emoji', '✅', 'description', 'Ten organizational clarity modules'),
    jsonb_build_object('key', 'responsibility_registry', 'label', 'Responsibility registry', 'emoji', '📋', 'description', 'Transparent ownership overview'),
    jsonb_build_object('key', 'decision_rights_mapping', 'label', 'Decision rights mapping', 'emoji', '🔍', 'description', 'Authority and decision clarity'),
    jsonb_build_object('key', 'role_clarity_framework', 'label', 'Role clarity framework', 'emoji', '📊', 'description', 'Expectation documentation'),
    jsonb_build_object('key', 'companion', 'label', 'Organizational Clarity Companion', 'emoji', '✨', 'description', 'Improves clarity — leadership establishes accountability'),
    jsonb_build_object('key', 'priority_alignment_engine', 'label', 'Priority alignment engine', 'emoji', '🧪', 'description', 'Priority conflict monitoring'),
    jsonb_build_object('key', 'escalation_path_visibility', 'label', 'Escalation path visibility', 'emoji', '🛡️', 'description', 'Confidence and response speed'),
    jsonb_build_object('key', 'clarity_knowledge_retention', 'label', 'Clarity knowledge retention', 'emoji', '🔔', 'description', 'Organizational understanding preserved')
  ); $$;
create or replace function public._${bp}_organizational_clarity_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Organizational Clarity Center — ten capabilities. Aipify improves clarity — leadership establishes accountability.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'responsibility_registry', 'label', 'Responsibility Registry'),
    jsonb_build_object('key', 'decision_rights_mapping', 'label', 'Decision Rights Mapping'),
    jsonb_build_object('key', 'role_clarity_framework', 'label', 'Role Clarity Framework'),
    jsonb_build_object('key', 'priority_alignment_engine', 'label', 'Priority Alignment Engine'),
    jsonb_build_object('key', 'escalation_path_visibility', 'label', 'Escalation Path Visibility'),
    jsonb_build_object('key', 'communication_clarity_insights', 'label', 'Communication Clarity Insights'),
    jsonb_build_object('key', 'executive_clarity_dashboard', 'label', 'Executive Clarity Dashboard'),
    jsonb_build_object('key', 'clarity_recommendations', 'label', 'Aipify Clarity Recommendations'),
    jsonb_build_object('key', 'clarity_knowledge_retention', 'label', 'Clarity Knowledge Retention'),
    jsonb_build_object('key', 'organizational_clarity_index', 'label', 'Organizational Clarity Index')
  )); $$;
create or replace function public._${bp}_responsibility_registry() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Responsibility registry — transparent overview of ownership.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'responsibility_title', 'label', 'Is responsibility title recorded?'),
    jsonb_build_object('key', 'owner_assigned', 'label', 'Is owner assigned with supporting roles?'),
    jsonb_build_object('key', 'department_objectives', 'label', 'Are department and related objectives captured?'),
    jsonb_build_object('key', 'escalation_contacts', 'label', 'Are escalation contacts documented?'),
    jsonb_build_object('key', 'leadership_accountability', 'label', 'How does registry support leadership establishes accountability — not replace accountability?')
  )); $$;
create or replace function public._${bp}_decision_rights_mapping() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Decision rights mapping — clarify who has authority to make decisions.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'who_decides', 'label', 'Who decides documented'),
    jsonb_build_object('key', 'who_recommends', 'label', 'Who recommends documented'),
    jsonb_build_object('key', 'assigned', 'label', 'Assigned ownership state'),
    jsonb_build_object('key', 'shared', 'label', 'Shared ownership state'),
    jsonb_build_object('key', 'vacant', 'label', 'Vacant ownership state'),
    jsonb_build_object('key', 'under_review', 'label', 'Under review ownership state')
  )); $$;
create or replace function public._${bp}_executive_clarity_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive clarity dashboard — organizational alignment visibility for leadership.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'ownership_gaps', 'label', 'Areas lacking ownership widget'),
    jsonb_build_object('key', 'priority_conflicts', 'label', 'Priority conflict indicators'),
    jsonb_build_object('key', 'decision_right_gaps', 'label', 'Decision-right gaps'),
    jsonb_build_object('key', 'escalation_bottlenecks', 'label', 'Escalation bottlenecks'),
    jsonb_build_object('key', 'clarity_score_trends', 'label', 'Clarity score trends')
  )); $$;
create or replace function public._${bp}_organizational_clarity_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Organizational Clarity Companion — improves clarity and recommends; never replaces leadership accountability or assigns ownership without stewardship.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'clarify_ownership', 'label', 'Clarify ownership recommendations'),
    jsonb_build_object('key', 'simplify_responsibilities', 'label', 'Simplify responsibilities suggestions'),
    jsonb_build_object('key', 'resolve_conflicts', 'label', 'Resolve priority conflict guidance'),
    jsonb_build_object('key', 'define_escalation', 'label', 'Define escalation route suggestions'),
    jsonb_build_object('key', 'review_authorities', 'label', 'Review decision authority recommendations'),
    jsonb_build_object('key', 'clarity_guardrails', 'label', 'Organizational clarity governance — Trust Architecture enforced')
  )); $$;
create or replace function public._${bp}_role_clarity_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Role clarity framework — reduce confusion around expectations.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'role_purpose', 'label', 'Role purpose documented'),
    jsonb_build_object('key', 'key_responsibilities', 'label', 'Key responsibilities captured'),
    jsonb_build_object('key', 'current', 'label', 'Current review state'),
    jsonb_build_object('key', 'needs_review', 'label', 'Needs review state'),
    jsonb_build_object('key', 'archived', 'label', 'Archived review state')
  )); $$;
create or replace function public._${bp}_priority_alignment_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Priority alignment engine — ensure teams understand what matters most.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'priority_conflicts', 'label', 'Priority conflict monitoring'),
    jsonb_build_object('key', 'informational', 'label', 'Informational recommendation level'),
    jsonb_build_object('key', 'attention_needed', 'label', 'Attention needed recommendation level'),
    jsonb_build_object('key', 'executive_review', 'label', 'Executive review recommended level'),
    jsonb_build_object('key', 'advisory_only', 'label', 'Advisory only — human judgment essential')
  )); $$;
create or replace function public._${bp}_communication_clarity_insights() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Communication clarity insights — identify sources of organizational confusion.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'clarification_requests', 'label', 'Repeated clarification request indicators'),
    jsonb_build_object('key', 'clear', 'label', 'Clear signal state'),
    jsonb_build_object('key', 'minor_friction', 'label', 'Minor friction signal state'),
    jsonb_build_object('key', 'significant_friction', 'label', 'Significant friction signal state'),
    jsonb_build_object('key', 'critical_confusion', 'label', 'Critical confusion signal state')
  )); $$;
create or replace function public._${bp}_clarity_knowledge_retention() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Clarity knowledge retention — preserve organizational understanding over time.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'role_changes', 'label', 'Role changes captured'),
    jsonb_build_object('key', 'responsibility_updates', 'label', 'Responsibility updates recorded'),
    jsonb_build_object('key', 'escalation_revisions', 'label', 'Escalation revisions logged'),
    jsonb_build_object('key', 'leadership_accountability', 'label', 'Aipify improves clarity — leadership establishes accountability'),
    jsonb_build_object('key', 'index_levels', 'label', 'Ambiguous, Emerging, Structured, Clear, Exceptionally Aligned')
  )); $$;
create or replace function public._${bp}_organizational_clarity_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Organizational clarity integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'purpose_values', 'label', 'Purpose & Values Alignment Phase 272', 'cross_link', '/app/aipify-enterprise-purpose-values-alignment-engine'),
    jsonb_build_object('key', 'policy_compliance', 'label', 'Enterprise Policy Compliance Management Engine', 'cross_link', '/app/aipify-enterprise-policy-compliance-management-engine'),
    jsonb_build_object('key', 'decision_escalation', 'label', 'Decision Escalation & Governance Phase 258', 'cross_link', '/app/aipify-enterprise-decision-escalation-governance-engine'),
    jsonb_build_object('key', 'operating_rhythm', 'label', 'Operating Rhythm Engine', 'cross_link', '/app/aipify-enterprise-operating-rhythm-engine'),
    jsonb_build_object('key', 'executive_copilot', 'label', 'Executive Copilot Phase 267', 'cross_link', '/app/aipify-enterprise-executive-copilot-engine'),
    jsonb_build_object('key', 'leadership_gates', 'label', 'Leadership gates — Aipify improves clarity only')
  )); $$;
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Replacing leadership accountability',
      'Assigning ownership without stewardship',
      'Hiding decision-right gaps',
      'Creating surveillance pressure',
      'Modifying organizational clarity audit trails',
      'Unlogged clarity recommendations',
      'Bypassing governance review',
      'Override leadership accountability'), 'principle', 'Organizational Clarity Companion improves clarity — leadership establishes accountability and clarity history stays auditable.'); $$;
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm organizational clarity support without pressure.', 'values', jsonb_build_array('aipify_improves_clarity','leadership_establishes_accountability','low_administrative_burden','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Organizational clarity audit logs via aipify_enterprise_organizational_clarity_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_organizational_clarity permissions — organizational clarity governance RBAC'),
    jsonb_build_object('key', 'leadership_gates', 'label', 'Leadership establishes accountability — Aipify improves clarity only'),
    jsonb_build_object('key', 'clarity_policies', 'label', 'Organization-defined clarity and ownership policies'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Organizational clarity metadata only — no raw operational records'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 271, 'key', 'enterprise_future_readiness', 'label', 'Future Readiness Phase 271', 'route', '/app/aipify-enterprise-future-readiness-engine', 'description', 'Future readiness — cross-link only'),
    jsonb_build_object('phase', 272, 'key', 'enterprise_purpose_values_alignment', 'label', 'Purpose & Values Phase 272', 'route', '/app/aipify-enterprise-purpose-values-alignment-engine', 'description', 'Purpose alignment — cross-link only'),
    jsonb_build_object('phase', 273, 'key', 'enterprise_organizational_clarity', 'label', 'Organizational Clarity Phase 273', 'route', '/app/aipify-enterprise-organizational-clarity-engine', 'description', 'Enterprise organizational clarity — caps era')
  ); $$;
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'executive_copilot', 'label', 'Executive Copilot Phase 267', 'route', '/app/aipify-enterprise-executive-copilot-engine', 'relationship', 'Executive awareness — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/executive', 'relationship', 'Executive landing — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Leadership establishes accountability — cross-link only')
  ); $$;
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as $$ select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); $$;
create or replace function public._${bp}_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Organizational Clarity Center internally with governance-governed ownership clarity and full audit logging. Growth Partner terminology. Organizational Clarity Companion improves clarity — never replaces leadership accountability or assigns ownership without stewardship.'; $$;
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — leadership establishes accountability.', 'Organizational Clarity Companion improves clarity and recommends.', 'Aipify improves clarity — leadership establishes accountability.', 'Growth Partner — never Affiliate.', 'Organizational Clarity Era caps — 269–273.'); $$;
create or replace function public._${bp}_privacy_note() returns text language sql immutable as $$
  select 'Organizational Clarity Center metadata only — clarity summaries max ~500 chars. No raw operational records beyond RBAC or PII in audit logs.'; $$;
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
    `jsonb_build_object('key', 'engine', 'label', 'Responsibility registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_responsibility_registry()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_relationship_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Responsibility registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_responsibility_registry()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_critical_function_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Responsibility registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_responsibility_registry()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_memory_capture_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Responsibility registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_responsibility_registry()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_improvement_opportunity_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Responsibility registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_responsibility_registry()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_decision_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Responsibility registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_responsibility_registry()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_action_queue_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Responsibility registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_responsibility_registry()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_trend_monitoring_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Responsibility registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_responsibility_registry()->'reflection_questions') = 5,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_strategic_execution_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Organizational Clarity Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_organizational_clarity_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_relationship_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Organizational Clarity Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_organizational_clarity_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_resilience_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Organizational Clarity Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_organizational_clarity_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_memory_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Organizational Clarity Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_organizational_clarity_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_improvement_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Organizational Clarity Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_organizational_clarity_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_decision_governance_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Organizational Clarity Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_organizational_clarity_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_orchestration_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Organizational Clarity Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_organizational_clarity_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_intelligence_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Organizational Clarity Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_organizational_clarity_dashboard()->'capabilities') = 10,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 3,`,
  );

  const replaceRpcRef = (sqlText, fn) => {
    if (fn === "organizational_clarity_dashboard") {
      return sqlText.replace(/public\._(\w+)_organizational_clarity_dashboard\(\)/g, (full, prefix) =>
        prefix.includes("executive") ? full : `public._${P.bp}_organizational_clarity_dashboard()`,
      );
    }
    return sqlText.replace(
      new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"),
      `public._${P.bp}_${fn}()`,
    );
  };

  for (const fn of [...SCAFFOLDS, "organizational_clarity_companion"].sort((a, b) => b.length - a.length)) {
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
    "RBAC-protected enterprise organizational clarity guidance within Organizational Clarity Era;",
    "RBAC-protected enterprise organizational clarity guidance within Organizational Clarity Era;",
  );
  sql = sql.replaceAll(
    "RBAC-protected enterprise organizational clarity guidance within Organizational Clarity Era;",
    "RBAC-protected enterprise organizational clarity guidance within Organizational Clarity Era;",
  );
  sql = sql.replaceAll(
    "RBAC-protected enterprise continuous improvement guidance within Continuous Optimization Era;",
    "RBAC-protected enterprise organizational clarity guidance within Organizational Clarity Era;",
  );
  sql = sql.replace(
    /Phase 273 Enterprise Organizational Clarity Engine —/,
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
    `'executive_insight_timeline', public._${P.bp}_clarity_knowledge_retention()`,
  );
  sql = sql.replace(
    /'improvement_improvement_dashboard', public\._\w+_improvement_improvement_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_clarity_knowledge_retention()`,
  );
  sql = sql.replace(
    /'decision_decision_governance_dashboard', public\._\w+_decision_decision_governance_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_clarity_knowledge_retention()`,
  );
  sql = sql.replace(
    /'orchestration_orchestration_dashboard', public\._\w+_orchestration_orchestration_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_clarity_knowledge_retention()`,
  );
  sql = sql.replace(
    /'governance_rules_dashboard', public\._\w+_governance_rules_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_clarity_knowledge_retention()`,
  );
  sql = sql.replace(
    /'improvement_controls_dashboard', public\._\w+_improvement_controls_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_clarity_knowledge_retention()`,
  );
  sql = sql.replace(
    /'policy_controls_dashboard', public\._\w+_policy_controls_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_clarity_knowledge_retention()`,
  );
  sql = sql.replace(
    /'intelligence_controls_dashboard', public\._\w+_intelligence_controls_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_clarity_knowledge_retention()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_resilience_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_clarity_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_memory_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_clarity_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_improvement_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_clarity_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_decision_governance_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_clarity_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_orchestration_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_clarity_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_intelligence_controls_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_clarity_dashboard()`,
  );

  sql = sql.replace(
    /'memory_controls_dashboard', public\._\w+_memory_controls_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_clarity_knowledge_retention()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_memory_controls_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_clarity_dashboard()`,
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

${P.centerTitle} within ${P.era}. **Caps the era.** ${P.companion} supports responsibility registry, decision rights mapping, role clarity framework, priority alignment engine, escalation path visibility, communication clarity insights, executive clarity dashboard, Aipify clarity recommendations, clarity knowledge retention, and organizational clarity index — does NOT replace leadership accountability, assign ownership without stewardship, or omit organizational clarity audit history.

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
Era: ${P.era} (caps)
${P.crossLinkNote}
`,
  );
  write(
    path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
    `# ${P.title} Engine — FAQ (Phase ${P.phase})

## What is the Enterprise Organizational Clarity Engine?

The Enterprise Organizational Clarity Engine helps organizations continuously improve clarity by reducing ambiguity, strengthening ownership, and ensuring people understand priorities, expectations, and decision rights at \`/app/${P.slug}\`.

## What organizational clarity features are included?

Responsibility registry, decision rights mapping, role clarity framework, priority alignment engine, escalation path visibility, communication clarity insights, executive clarity dashboard, Aipify clarity recommendations, clarity knowledge retention, and organizational clarity index.

## What ownership states apply?

Assigned, shared, vacant, and under review — with review states current, needs review, and archived.

## What signal states apply?

Clear, minor friction, significant friction, and critical confusion.

## What does the organizational clarity flow look like?

Responsibilities defined → decision rights documented → priorities aligned → escalation paths clarified → communication friction monitored → recommendations generated → leadership actions implemented → understanding reinforced → organizational clarity strengthened.

## Who can access organizational clarity?

Super Admin (full access), Tenant Admin (clarity policies), Executives (executive clarity dashboard), Role owners (responsibility registry), Teams (escalation visibility) — enterprise RBAC.

## Is full audit logging enforced?

**Yes.** Every organizational clarity lifecycle event is logged. Clarity metadata and recommendation history are recorded.

## How does this integrate with other Aipify surfaces?

${P.crossLinkNote}

## Does the Organizational Clarity Companion replace leadership accountability?

**No.** Aipify improves clarity — **leadership establishes accountability.** ${P.companion} does **NOT** replace leadership accountability, assign ownership without stewardship, or omit organizational clarity audit history.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Organizational Clarity: responsibility registry, decision rights mapping, role clarity framework, priority alignment engine, escalation path visibility, communication clarity insights, executive clarity dashboard, clarity recommendations, knowledge retention, organizational clarity index.
Ownership states: assigned, shared, vacant, under review.
Review states: current, needs review, archived.
Signal states: clear, minor friction, significant friction, critical confusion.
Index levels: ambiguous, emerging, structured, clear, exceptionally aligned.
Flow: responsibilities defined → decision rights documented → priorities aligned → escalation clarified → friction monitored → recommendations generated → leadership actions → understanding reinforced → clarity strengthened.
Security: organizational clarity governance RBAC, leadership gates, audit logging, metadata only, enterprise permissions, 2FA.
Design principles: Aipify improves clarity — leadership establishes accountability, executive-grade simplicity, low administrative burden.
Companion limitations: no replacing leadership accountability, no ownership without stewardship, no hiding decision-right gaps, no surveillance pressure.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate. Era caps 269–273.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} improves clarity; never replaces leadership accountability, assigns ownership without stewardship, or omits organizational clarity audit history.";
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
      '| "aipifyEnterprisePurposeValuesAlignmentEngine"',
      `| "aipifyEnterprisePurposeValuesAlignmentEngine"\n  | "${id}"`,
    );
  }
  if (!c.includes(href)) {
    const anchor =
      /id: "aipifyEnterprisePurposeValuesAlignmentEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyEnterprisePurposeValuesAlignmentEngine",\n  },/;
    c = c.replace(
      anchor,
      (m) =>
        `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-enterprise-purpose-values-alignment-engine")) {\n    return "aipifyEnterprisePurposeValuesAlignmentEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-enterprise-purpose-values-alignment-engine")) {\n    return "aipifyEnterprisePurposeValuesAlignmentEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace(
        '"aipify_enterprise_purpose_values_alignment.view",',
        `"aipify_enterprise_purpose_values_alignment.view",\n    "${perm}",`,
      );
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-enterprise-purpose-values-alignment-engine";',
      `export * from "./aipify-enterprise-purpose-values-alignment-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era} caps the era. ${P.companion} supports responsibility registry, decision rights mapping, role clarity framework, priority alignment engine, escalation path visibility, and executive clarity dashboard. Aipify improves clarity — leadership establishes accountability. Does NOT replace leadership accountability or assign ownership without stewardship. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Organizational clarity index",
    modeLabel: "Mode",
    readinessLabel: "Organizational clarity index level",
    executiveReviews: "Executive clarity dashboard",
    activeReflections: "Active organizational clarity scaffolds",
    humanOversightRequired: `Leadership establishes accountability — users retain clarity control; ${P.companion} improves clarity only`,
    eraOpenerSummary: `Organizational Clarity Era — Phases ${P.eraRange} (caps)`,
    eraOpenerNote:
      "Cross-link only — do not duplicate Purpose & Values Alignment Engine, Enterprise Policy Compliance Management Engine, Decision Escalation & Governance Engine, Operating Rhythm Engine, or Executive Copilot Engine RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Responsibility registry — registry prompts",
    frameworkLabel: "Decision rights mapping",
    reviewsLabel: "Executive clarity dashboard",
    companionLabel: `${P.companion} — improves clarity, leadership establishes accountability`,
    subEngineLabel: "Communication clarity insights",
    reflections: "Organizational clarity scaffolds",
    executiveReviewEntries: "Clarity knowledge retention entries",
    scaffoldNotes: "Leadership-governed clarity scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT replace leadership accountability, assign ownership without stewardship, or omit organizational clarity audit history`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports enterprise organizational clarity — leadership establishes accountability and clarity history stays auditable.`,
      philosophy:
        "People First. Aipify improves clarity — leadership establishes accountability. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
      growthEra: `${P.era} — Phase ${P.phase} caps the era.`,
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
        ? "Organisasjonsklarhet"
        : locale === "sv"
          ? "Organisationsklarhet"
          : locale === "da"
            ? "Organisationsklarhed"
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
      'export * from "./implementation-blueprint-phase272-vocabulary";',
      `export * from "./implementation-blueprint-phase272-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE272_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase272-aipify-enterprise-purpose-values-alignment.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE272_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase272-aipify-enterprise-purpose-values-alignment.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Enterprise Organizational Clarity Engine (Phase 273):** See [AIPIFY_ENTERPRISE_ORGANIZATIONAL_CLARITY_PHASE273.md](./AIPIFY_ENTERPRISE_ORGANIZATIONAL_CLARITY_PHASE273.md) — Responsibility registry, decision rights mapping, role clarity framework, priority alignment engine, escalation path visibility, communication clarity insights, executive clarity dashboard, Aipify clarity recommendations, clarity knowledge retention, and organizational clarity index. **Caps** Organizational Clarity Era (269–273). \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} improves clarity — **NOT** replacing leadership accountability, assigning ownership without stewardship, or omitting organizational clarity audit history. Cross-links only: Purpose & Values Alignment Engine Phase 272, Enterprise Policy Compliance Management Engine, Decision Escalation & Governance Engine Phase 258, Operating Rhythm Engine, Executive Copilot Engine Phase 267. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 273")) {
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
