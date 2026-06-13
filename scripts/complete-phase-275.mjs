#!/usr/bin/env node
/** ABOS Phase 275 — Enterprise Organizational Focus Engine (Commitment & Accountability Era 274–278) */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "focus_center_dashboard",
  "priority_registry",
  "priority_overload_detection",
  "attention_allocation_insights",
  "distraction_identification",
  "focus_protection_framework",
  "executive_focus_dashboard",
  "focus_recommendations",
  "focus_integration_center",
];

const P = {
  phase: 275,
  migration: "20261420300000_aipify_enterprise_organizational_focus_engine_phase275.sql",
  slug: "aipify-enterprise-organizational-focus-engine",
  base: "AipifyEnterpriseOrganizationalFocus",
  camel: "aipifyEnterpriseOrganizationalFocusEngine",
  snake: "aipify_enterprise_organizational_focus",
  permPrefix: "aipify_enterprise_organizational_focus",
  helper: "aeofe",
  bp: "aeofebp275",
  decisionType: "aipify_enterprise_organizational_focus_engine",
  title: "Enterprise Organizational Focus",
  centerTitle: "Focus Center",
  companion: "Focus Companion",
  scoreKey: "aipify_enterprise_organizational_focus_score",
  modeKey: "enterprise_organizational_focus_mode",
  levelKey: "enterprise_focus_index_level",
  thirdEntity: "enterprise_organizational_focus_notes",
  era: "Commitment & Accountability Era (274–278)",
  eraRange: "274–278",
  docSlug: "AIPIFY_ENTERPRISE_ORGANIZATIONAL_FOCUS",
  ilmFile: "implementation-blueprint-phase275-aipify-enterprise-organizational-focus.txt",
  navLabel: "Organizational Focus",
  crossLinkNote: "Cross-links only: Commitment & Accountability Engine Phase 274, Organizational Clarity Engine Phase 273, Time & Attention Guardian, Executive Copilot Engine Phase 267, and Decision Support Engine — Aipify promotes focus; leadership establishes priorities; never omit organizational focus audit history.",
  companionLimitations: [
    "overriding_leadership_priorities",
    "assigning_priorities_without_executive_sponsor",
    "hiding_overload_patterns",
    "creating_surveillance_pressure",
    "bypassing_governance_review",
    "modifying_organizational_focus_audit_trail",
    "unlogged_focus_recommendations",
    "forcing_initiative_cancellation"
  ]
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom267(content) {
  const pairs = [
    ["AipifyEnterpriseExecutiveCopilot", "AipifyEnterpriseOrganizationalFocus"],
    ["aipify-enterprise-executive-copilot-engine", "aipify-enterprise-organizational-focus-engine"],
    ["aipify_enterprise_executive_copilot", "aipify_enterprise_organizational_focus"],
    ["aipifyEnterpriseExecutiveCopilotEngine", "aipifyEnterpriseOrganizationalFocusEngine"],
    ["aeecpebp267", "aeofebp275"],
    ["_aeecpe_", "_aeofe_"],
    ["aipify_enterprise_executive_copilot_score", "aipify_enterprise_organizational_focus_score"],
    ["enterprise_executive_copilot_mode", "enterprise_organizational_focus_mode"],
    ["enterprise_executive_copilot_effectiveness_level", "enterprise_focus_index_level"],
    ["enterprise_executive_copilot_notes", "enterprise_organizational_focus_notes"],
    ["EnterpriseExecutiveCopilotNotes", "EnterpriseOrganizationalFocusNotes"],
    ["enterprise_executive_copilot_notes_count", "enterprise_organizational_focus_notes_count"],
    ["Executive Copilot Phase 267", "__FOCUS_PHASE_267__"],
    ["Executive Copilot Companion", "__FOCUS_COMPANION__"],
    ["Enterprise Executive Copilot", "Enterprise Organizational Focus"],
    ["__FOCUS_COMPANION__", "Focus Companion"],
    ["Executive Copilot Center", "__FOCUS_CENTER__"],
    ["__FOCUS_PHASE_267__", "Executive Copilot Phase 267"],
    ["Phase 267", "Phase 275"],
    ["aipify_enterprise_executive_copilot.view", "aipify_enterprise_organizational_focus.view"],
    ["aipify_enterprise_executive_copilot.manage", "aipify_enterprise_organizational_focus.manage"],
    ["aipify_enterprise_executive_copilot.steward", "aipify_enterprise_organizational_focus.steward"],
    ["aipify_enterprise_executive_copilot_engine", "aipify_enterprise_organizational_focus_engine"],
    ["20261419500000_aipify_enterprise_executive_copilot_engine_phase267.sql", "20261420300000_aipify_enterprise_organizational_focus_engine_phase275.sql"],
    ["Repo Phase 267", "Repo Phase 275"],
    ["Phase 267 —", "Phase 275 —"],
    ["IMPLEMENTATION_BLUEPRINT_PHASE267_AIPIFY_ENTERPRISE_EXECUTIVE_COPILOT", "IMPLEMENTATION_BLUEPRINT_PHASE275_AIPIFY_ENTERPRISE_ORGANIZATIONAL_FOCUS"],
    ["implementation-blueprint-phase267", "implementation-blueprint-phase275"],
    ["executive_insight_timeline", "focus_history"],
    ["executive_copilot_dashboard", "focus_center_dashboard"],
    ["executive_briefing_engine", "priority_registry"],
    ["priority_intelligence_engine", "priority_overload_detection"],
    ["executive_attention_management_engine", "attention_allocation_insights"],
    ["decision_support_workspace", "distraction_identification"],
    ["executive_follow_through_tracking", "focus_protection_framework"],
    ["cross_functional_executive_view", "executive_focus_dashboard"],
    ["executive_copilot_integration_center", "focus_integration_center"],
    ["executive_copilot_companion", "focus_companion"],
    ["_seed_enterprise_executive_copilot_notes", "_seed_enterprise_organizational_focus_notes"],
    ["executive briefing stewardship", "priority registry stewardship"],
    ["priority-informed executive support", "focus-informed priority support"],
    ["executive-focus leadership culture", "disciplined focus culture"],
    ["active executive priorities", "active priority registry entries"],
    ["decisions requiring executive attention", "priorities requiring leadership attention"],
    ["Executive Briefing Engine", "Priority Registry"],
    ["Priority Intelligence", "Priority Overload Detection"],
    ["Executive Attention Management", "Attention Allocation Insights"],
    ["Decision Support Workspace", "Distraction Identification"],
    ["Executive Follow-Through Tracking", "Focus Protection Framework"],
    ["Executive Insight Timeline", "Executive Focus Dashboard"],
    ["executive insight timeline indicators", "focus history indicators"],
    ["executive briefing prompts", "priority registry prompts"],
    ["executive copilot prompts", "organizational focus prompts"],
    ["cross-functional executive view", "executive focus dashboard"],
    ["executive attention triggers", "distraction identification triggers"],
    ["RBAC-protected executive copilot governance", "RBAC-protected organizational focus governance"],
    ["Aipify advises — executives decide", "Aipify promotes focus — leadership establishes priorities"],
    ["Executives decide", "Leadership establishes priorities"],
    ["Support decisions without replacing judgment", "Support focus without replacing priority decisions"],
    ["no_bypassing_executive_copilot_governance", "no_bypassing_organizational_focus_governance"],
    ["AIPIFY_ENTERPRISE_EXECUTIVE_COPILOT", "AIPIFY_ENTERPRISE_ORGANIZATIONAL_FOCUS"],
    ["enterprise executive copilot", "enterprise organizational focus"],
    ["Executive copilot audit logs", "Organizational focus audit logs"],
    ["executive copilot governance RBAC", "organizational focus governance RBAC"],
    ["executive copilot scaffolds", "organizational focus scaffolds"],
    ["organization executive briefing policies", "organization focus and priority policies"],
    ["Executive effectiveness index", "Organizational focus index"],
    ["Executive effectiveness level", "Organizational focus index level"],
    ["Insight timeline entries", "Focus history entries"],
    ["executive commitment stewardship", "focus protection stewardship"],
    ["executive copilot records beyond RBAC", "organizational focus records beyond RBAC"],
    ["executive recommendation assistance", "focus recommendation assistance"],
    ["executive cross-functional visibility", "attention allocation visibility"],
    ["Autonomous Coordination Engine Phase 266, Organizational Insights & Executive Intelligence Engine Phase 223, Strategic Execution Engine Phase 263, Decision Support Engine, and Executive Cockpit Phase 200", "Commitment & Accountability Engine Phase 274, Organizational Clarity Engine Phase 273, Time & Attention Guardian, Executive Copilot Engine Phase 267, and Decision Support Engine"],
    ["Never replace executive judgment or make decisions on behalf of executives", "Never override leadership priorities or cancel initiatives without leadership approval"],
    ["executive priorities", "organizational priorities"],
    ["Executive priorities", "Organizational priorities"],
    ["executive attention routing", "attention allocation routing"],
    ["decides without executive judgment", "establishes priorities without leadership approval"],
    ["Unauthorized executive action without executive approval", "Unauthorized priority assignment without executive sponsor"],
    ["Modifying executive copilot audit trails", "Modifying organizational focus audit trails"],
    ["Decide before executive review", "Prioritize before leadership review"],
    ["user executive control", "user priority control"],
    ["User executive control", "User priority control"],
    ["briefing outcomes and executive preference policies", "focus outcomes and priority policies"],
    ["executive insight visibility", "executive focus visibility"],
    ["executive copilot", "organizational focus"],
    ["enable executives to maintain awareness, prioritize effectively, identify emerging risks and opportunities, and support high-quality decision-making — maintaining executive copilot governance, executives decide with Aipify advisory support, full audit logging, role-based permissions, and leadership effectiveness that compounds over time", "enable organizations to protect attention, reduce unnecessary complexity, minimize distractions, and maintain focus on initiatives and outcomes that create the greatest value — maintaining organizational focus governance, leadership establishes priorities with Aipify focus support, full audit logging, role-based permissions, and strategic discipline that compounds over time"],
    ["executive decision delays reduce, strategic focus improves, follow-through rates increase, executive engagement rises, emerging issues are identified faster, and executive effectiveness scores strengthen with Aipify advises — executives decide", "priority overload reduces, initiative completion rates increase, strategic consistency improves, distraction indicators lower, attention allocation improves, and organizational focus index performance strengthens with Aipify promotes focus — leadership establishes priorities"],
    ["Opens the era.", "Continues the era."],
    ["opens the era", "continues the era"],
    ["Commitment & Accountability Era opens", "Commitment & Accountability Era continues"],
    ["__FOCUS_CENTER__", "Focus Center"],
  ];
  let out = content;
  for (const [from, to] of pairs) out = out.split(from).join(to);
  return out;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 275 — Focus Center. Focus Companion supports enterprise organizational focus — NOT overriding leadership priorities, assigning priorities without executive sponsor, or omitting organizational focus audit history. Helpers _${bp}_*.'; $$;
create or replace function public._${bp}_mission() returns text language sql immutable as $$ select 'Protect attention, reduce unnecessary complexity, minimize distractions, and maintain focus on initiatives and outcomes that create the greatest value — Focus Companion promotes focus; leadership establishes priorities.'; $$;
create or replace function public._${bp}_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._${bp}_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Focus Center within Commitment & Accountability Era (274–278). Aipify promotes focus; leadership establishes priorities; governance-governed attention; full audit logging; Focus Companion informs and recommends. Continues the era.'; $$;
create or replace function public._${bp}_vision() returns text language sql immutable as $$ select 'Organizations reduce priority overload, increase initiative completion rates, improve strategic consistency, lower distraction indicators, improve attention allocation, and strengthen organizational focus index performance with Aipify promotes focus — leadership establishes priorities.'; $$;
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Focus Center programs', 'emoji', '✅', 'description', 'Ten organizational focus modules'),
    jsonb_build_object('key', 'priority_registry', 'label', 'Priority registry', 'emoji', '📋', 'description', 'Centralized priority overview'),
    jsonb_build_object('key', 'priority_overload_detection', 'label', 'Priority overload detection', 'emoji', '🔍', 'description', 'Identify competing priorities'),
    jsonb_build_object('key', 'attention_allocation_insights', 'label', 'Attention allocation insights', 'emoji', '📊', 'description', 'Understand organizational energy'),
    jsonb_build_object('key', 'companion', 'label', 'Focus Companion', 'emoji', '✨', 'description', 'Promotes focus — leadership establishes priorities'),
    jsonb_build_object('key', 'distraction_identification', 'label', 'Distraction identification', 'emoji', '🧪', 'description', 'Recognize effectiveness reducers'),
    jsonb_build_object('key', 'focus_protection_framework', 'label', 'Focus protection framework', 'emoji', '🛡️', 'description', 'Preserve capacity for meaningful work'),
    jsonb_build_object('key', 'focus_history', 'label', 'Focus history', 'emoji', '🔔', 'description', 'Attention evolution preserved')
  ); $$;
create or replace function public._${bp}_focus_center_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Focus Center — ten capabilities. Aipify promotes focus — leadership establishes priorities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'priority_registry', 'label', 'Priority Registry'),
    jsonb_build_object('key', 'priority_overload_detection', 'label', 'Priority Overload Detection'),
    jsonb_build_object('key', 'attention_allocation_insights', 'label', 'Attention Allocation Insights'),
    jsonb_build_object('key', 'distraction_identification', 'label', 'Distraction Identification'),
    jsonb_build_object('key', 'focus_protection_framework', 'label', 'Focus Protection Framework'),
    jsonb_build_object('key', 'executive_focus_dashboard', 'label', 'Executive Focus Dashboard'),
    jsonb_build_object('key', 'focus_recommendations', 'label', 'Aipify Focus Recommendations'),
    jsonb_build_object('key', 'focus_history', 'label', 'Focus History'),
    jsonb_build_object('key', 'strategic_focus_reviews', 'label', 'Strategic Focus Reviews'),
    jsonb_build_object('key', 'organizational_focus_index', 'label', 'Organizational Focus Index')
  )); $$;
create or replace function public._${bp}_priority_registry() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Priority registry — centralized overview of active organizational priorities.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'priority_title', 'label', 'Is priority title and strategic objective recorded?'),
    jsonb_build_object('key', 'sponsor_owner', 'label', 'Are executive sponsor and priority owner assigned?'),
    jsonb_build_object('key', 'outcomes_dates', 'label', 'Are expected outcomes, start date, and target completion captured?'),
    jsonb_build_object('key', 'priority_level', 'label', 'Is priority level documented — supporting, important, strategic, mission critical?'),
    jsonb_build_object('key', 'leadership_priorities', 'label', 'How does registry support leadership establishes priorities — not override priorities?')
  )); $$;
create or replace function public._${bp}_priority_overload_detection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Priority overload detection — identify when too many priorities compete for attention.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'active_initiatives', 'label', 'Active initiative count monitoring'),
    jsonb_build_object('key', 'healthy', 'label', 'Healthy risk level'),
    jsonb_build_object('key', 'elevated', 'label', 'Elevated risk level'),
    jsonb_build_object('key', 'overloaded', 'label', 'Overloaded risk level'),
    jsonb_build_object('key', 'unsustainable', 'label', 'Unsustainable risk level'),
    jsonb_build_object('key', 'resource_conflicts', 'label', 'Resource conflict monitoring')
  )); $$;
create or replace function public._${bp}_executive_focus_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive focus dashboard — leadership clarity on organizational focus.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'top_priorities', 'label', 'Top organizational priorities widget'),
    jsonb_build_object('key', 'overload_indicators', 'label', 'Priority overload indicators'),
    jsonb_build_object('key', 'attention_trends', 'label', 'Attention allocation trends'),
    jsonb_build_object('key', 'distraction_hotspots', 'label', 'Distraction hotspots'),
    jsonb_build_object('key', 'focus_score', 'label', 'Strategic focus score')
  )); $$;
create or replace function public._${bp}_focus_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Focus Companion — promotes focus and recommends; never overrides leadership priorities or assigns priorities without executive sponsor.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'reduce_priorities', 'label', 'Reduce active priority recommendations'),
    jsonb_build_object('key', 'delay_initiatives', 'label', 'Delay lower-value initiative suggestions'),
    jsonb_build_object('key', 'consolidate_efforts', 'label', 'Consolidate effort guidance'),
    jsonb_build_object('key', 'clarify_direction', 'label', 'Clarify strategic direction recommendations'),
    jsonb_build_object('key', 'protect_capacity', 'label', 'Protect decision-making capacity suggestions'),
    jsonb_build_object('key', 'focus_guardrails', 'label', 'Organizational focus governance — Trust Architecture enforced')
  )); $$;
create or replace function public._${bp}_attention_allocation_insights() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Attention allocation insights — understand where organizational energy is spent.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'executive_attention', 'label', 'Executive attention distribution'),
    jsonb_build_object('key', 'team_effort', 'label', 'Team effort concentration'),
    jsonb_build_object('key', 'operational_vs_strategic', 'label', 'Operational vs strategic focus'),
    jsonb_build_object('key', 'meeting_consumption', 'label', 'Meeting-related consumption'),
    jsonb_build_object('key', 'escalation_interruptions', 'label', 'Escalation-driven interruptions')
  )); $$;
create or replace function public._${bp}_distraction_identification() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Distraction identification — recognize activities that reduce effectiveness.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'excessive_meetings', 'label', 'Excessive meeting indicators'),
    jsonb_build_object('key', 'minimal', 'label', 'Minimal distraction state'),
    jsonb_build_object('key', 'moderate', 'label', 'Moderate distraction state'),
    jsonb_build_object('key', 'significant', 'label', 'Significant distraction state'),
    jsonb_build_object('key', 'critical', 'label', 'Critical distraction state')
  )); $$;
create or replace function public._${bp}_focus_protection_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Focus protection framework — preserve capacity for meaningful work.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'focus_periods', 'label', 'Recommend focus periods'),
    jsonb_build_object('key', 'conflicting_priorities', 'label', 'Highlight conflicting priorities'),
    jsonb_build_object('key', 'initiative_consolidation', 'label', 'Suggest initiative consolidation'),
    jsonb_build_object('key', 'review_windows', 'label', 'Protect strategic review windows'),
    jsonb_build_object('key', 'advisory_only', 'label', 'Advisory only — leadership establishes priorities')
  )); $$;
create or replace function public._${bp}_focus_history() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Focus history — understand how attention evolves over time.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'priority_additions', 'label', 'Priority additions captured'),
    jsonb_build_object('key', 'priority_retirements', 'label', 'Priority retirements recorded'),
    jsonb_build_object('key', 'focus_interventions', 'label', 'Focus interventions logged'),
    jsonb_build_object('key', 'leadership_priorities', 'label', 'Aipify promotes focus — leadership establishes priorities'),
    jsonb_build_object('key', 'index_levels', 'label', 'Fragmented, Reactive, Structured, Focused, Exceptionally Disciplined')
  )); $$;
create or replace function public._${bp}_focus_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Focus integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'commitment_accountability', 'label', 'Commitment & Accountability Phase 274', 'cross_link', '/app/aipify-enterprise-commitment-accountability-engine'),
    jsonb_build_object('key', 'organizational_clarity', 'label', 'Organizational Clarity Phase 273', 'cross_link', '/app/aipify-enterprise-organizational-clarity-engine'),
    jsonb_build_object('key', 'attention_guardian', 'label', 'Time & Attention Guardian', 'cross_link', '/app/assistant/attention'),
    jsonb_build_object('key', 'executive_copilot', 'label', 'Executive Copilot Phase 267', 'cross_link', '/app/aipify-enterprise-executive-copilot-engine'),
    jsonb_build_object('key', 'decision_support', 'label', 'Decision Support Engine', 'cross_link', '/app/assistant/decisions'),
    jsonb_build_object('key', 'priority_gates', 'label', 'Priority gates — Aipify promotes focus only')
  )); $$;
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Overriding leadership priorities',
      'Assigning priorities without executive sponsor',
      'Hiding overload patterns',
      'Creating surveillance pressure',
      'Modifying organizational focus audit trails',
      'Unlogged focus recommendations',
      'Bypassing governance review',
      'Forcing initiative cancellation'), 'principle', 'Focus Companion promotes focus — leadership establishes priorities and focus history stays auditable.'); $$;
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm focus support without pressure.', 'values', jsonb_build_array('aipify_promotes_focus','leadership_establishes_priorities','minimal_reporting_burden','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Organizational focus audit logs via aipify_enterprise_organizational_focus_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_organizational_focus permissions — organizational focus governance RBAC'),
    jsonb_build_object('key', 'priority_gates', 'label', 'Leadership establishes priorities — Aipify promotes focus only'),
    jsonb_build_object('key', 'focus_policies', 'label', 'Organization-defined focus and priority policies'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Organizational focus metadata only — no raw operational records'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 274, 'key', 'enterprise_commitment_accountability', 'label', 'Commitment & Accountability Phase 274', 'route', '/app/aipify-enterprise-commitment-accountability-engine', 'description', 'Commitment accountability — cross-link only'),
    jsonb_build_object('phase', 275, 'key', 'enterprise_organizational_focus', 'label', 'Organizational Focus Phase 275', 'route', '/app/aipify-enterprise-organizational-focus-engine', 'description', 'Enterprise organizational focus — continues era')
  ); $$;
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'executive_copilot', 'label', 'Executive Copilot Phase 267', 'route', '/app/aipify-enterprise-executive-copilot-engine', 'relationship', 'Executive awareness — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/executive', 'relationship', 'Executive landing — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Leadership establishes priorities — cross-link only')
  ); $$;
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as $$ select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); $$;
create or replace function public._${bp}_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Focus Center internally with governance-governed priority clarity and full audit logging. Growth Partner terminology. Focus Companion promotes focus — never overrides leadership priorities or assigns priorities without executive sponsor.'; $$;
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — leadership establishes priorities.', 'Focus Companion promotes focus and recommends.', 'Aipify promotes focus — leadership establishes priorities.', 'Growth Partner — never Affiliate.', 'Commitment & Accountability Era continues — 274–278.'); $$;
create or replace function public._${bp}_privacy_note() returns text language sql immutable as $$
  select 'Focus Center metadata only — focus summaries max ~500 chars. No raw operational records beyond RBAC or PII in audit logs.'; $$;
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
    `jsonb_build_object('key', 'engine', 'label', 'Priority registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_priority_registry()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_relationship_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Priority registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_priority_registry()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_critical_function_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Priority registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_priority_registry()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_memory_capture_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Priority registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_priority_registry()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_improvement_opportunity_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Priority registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_priority_registry()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_decision_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Priority registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_priority_registry()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_action_queue_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Priority registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_priority_registry()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_trend_monitoring_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Priority registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_priority_registry()->'reflection_questions') = 5,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_strategic_execution_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Focus Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_focus_center_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_relationship_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Focus Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_focus_center_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_resilience_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Focus Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_focus_center_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_memory_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Focus Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_focus_center_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_improvement_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Focus Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_focus_center_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_decision_governance_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Focus Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_focus_center_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_orchestration_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Focus Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_focus_center_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_intelligence_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Focus Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_focus_center_dashboard()->'capabilities') = 10,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  const replaceRpcRef = (sqlText, fn) => {
    if (fn === "focus_center_dashboard") {
      return sqlText.replace(/public\._(\w+)_focus_center_dashboard\(\)/g, (full, prefix) =>
        prefix.includes("executive") ? full : `public._${P.bp}_focus_center_dashboard()`,
      );
    }
    return sqlText.replace(
      new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"),
      `public._${P.bp}_${fn}()`,
    );
  };

  for (const fn of [...SCAFFOLDS, "focus_companion"].sort((a, b) => b.length - a.length)) {
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
    "RBAC-protected enterprise organizational focus guidance within Commitment & Accountability Era;",
    "RBAC-protected enterprise organizational focus guidance within Commitment & Accountability Era;",
  );
  sql = sql.replaceAll(
    "RBAC-protected enterprise organizational clarity guidance within Organizational Clarity Era;",
    "RBAC-protected enterprise organizational focus guidance within Commitment & Accountability Era;",
  );
  sql = sql.replaceAll(
    "RBAC-protected enterprise commitment accountability guidance within Commitment & Accountability Era;",
    "RBAC-protected enterprise organizational focus guidance within Commitment & Accountability Era;",
  );
  sql = sql.replaceAll(
    "RBAC-protected enterprise continuous improvement guidance within Continuous Optimization Era;",
    "RBAC-protected enterprise organizational focus guidance within Commitment & Accountability Era;",
  );
  sql = sql.replace(
    /Phase 275 Enterprise Organizational Focus Engine —/,
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
    `'executive_insight_timeline', public._${P.bp}_focus_history()`,
  );
  sql = sql.replace(
    /'improvement_improvement_dashboard', public\._\w+_improvement_improvement_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_focus_history()`,
  );
  sql = sql.replace(
    /'decision_decision_governance_dashboard', public\._\w+_decision_decision_governance_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_focus_history()`,
  );
  sql = sql.replace(
    /'orchestration_orchestration_dashboard', public\._\w+_orchestration_orchestration_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_focus_history()`,
  );
  sql = sql.replace(
    /'governance_rules_dashboard', public\._\w+_governance_rules_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_focus_history()`,
  );
  sql = sql.replace(
    /'improvement_controls_dashboard', public\._\w+_improvement_controls_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_focus_history()`,
  );
  sql = sql.replace(
    /'policy_controls_dashboard', public\._\w+_policy_controls_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_focus_history()`,
  );
  sql = sql.replace(
    /'intelligence_controls_dashboard', public\._\w+_intelligence_controls_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_focus_history()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_resilience_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_focus_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_memory_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_focus_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_improvement_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_focus_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_decision_governance_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_focus_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_orchestration_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_focus_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_intelligence_controls_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_focus_dashboard()`,
  );

  sql = sql.replace(
    /'memory_controls_dashboard', public\._\w+_memory_controls_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_focus_history()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_memory_controls_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_focus_dashboard()`,
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

${P.centerTitle} within ${P.era}. **Continues the era.** ${P.companion} supports priority registry, priority overload detection, attention allocation insights, distraction identification, focus protection framework, executive focus dashboard, Aipify focus recommendations, focus history, strategic focus reviews, and organizational focus index — does NOT override leadership priorities, assign priorities without executive sponsor, or omit organizational focus audit history.

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

## What is the Enterprise Organizational Focus Engine?

The Enterprise Organizational Focus Engine helps organizations protect attention, reduce unnecessary complexity, minimize distractions, and maintain focus on initiatives and outcomes that create the greatest value at \`/app/${P.slug}\`.

## What organizational focus features are included?

Priority registry, priority overload detection, attention allocation insights, distraction identification, focus protection framework, executive focus dashboard, Aipify focus recommendations, focus history, strategic focus reviews, and organizational focus index.

## What risk levels apply?

Healthy, elevated, overloaded, and unsustainable — with distraction states minimal, moderate, significant, and critical.

## What review cadences apply?

Monthly, quarterly, and annual strategic focus reviews.

## What does the organizational focus flow look like?

Priorities established → attention patterns monitored → overload identified → distractions detected → recommendations generated → leadership reviews focus areas → priorities adjusted → complexity reduced → organizational focus strengthened.

## Who can access organizational focus?

Super Admin (full access), Tenant Admin (focus policies), Executives (executive focus dashboard), Priority owners (priority registry), Teams (focus protection) — enterprise RBAC.

## Is full audit logging enforced?

**Yes.** Every organizational focus lifecycle event is logged. Focus metadata and recommendation history are recorded.

## How does this integrate with other Aipify surfaces?

${P.crossLinkNote}

## Does the Focus Companion override leadership priorities?

**No.** Aipify promotes focus — **leadership establishes priorities.** ${P.companion} does **NOT** override leadership priorities, assign priorities without executive sponsor, or omit organizational focus audit history.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Organizational focus: priority registry, priority overload detection, attention allocation insights, distraction identification, focus protection framework, executive focus dashboard, focus recommendations, focus history, strategic focus reviews, organizational focus index.
Risk levels: healthy, elevated, overloaded, unsustainable.
Distraction states: minimal, moderate, significant, critical.
Index levels: fragmented, reactive, structured, focused, exceptionally disciplined.
Flow: priorities established → attention monitored → overload identified → distractions detected → recommendations generated → leadership reviews → priorities adjusted → complexity reduced → focus strengthened.
Security: organizational focus governance RBAC, priority gates, audit logging, metadata only, enterprise permissions, 2FA.
Design principles: Aipify promotes focus — leadership establishes priorities, executive-grade simplicity, minimal reporting burden.
Companion limitations: no overriding leadership priorities, no priorities without executive sponsor, no hiding overload patterns, no surveillance pressure.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate. Era continues 274–278.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} promotes focus; never overrides leadership priorities, assigns priorities without executive sponsor, or omits organizational focus audit history.";
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
      '| "aipifyEnterpriseExecutiveCopilotEngine"',
      `| "aipifyEnterpriseExecutiveCopilotEngine"\n  | "${id}"`,
    );
  }
  if (!c.includes(href)) {
    const anchor =
      /id: "aipifyEnterpriseExecutiveCopilotEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyEnterpriseExecutiveCopilotEngine",\n  },/;
    c = c.replace(
      anchor,
      (m) =>
        `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-enterprise-executive-copilot-engine")) {\n    return "aipifyEnterpriseExecutiveCopilotEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-enterprise-executive-copilot-engine")) {\n    return "aipifyEnterpriseExecutiveCopilotEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace(
        '"aipify_enterprise_commitment_accountability.view",',
        `"aipify_enterprise_commitment_accountability.view",\n    "${perm}",`,
      );
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-enterprise-commitment-accountability-engine";',
      `export * from "./aipify-enterprise-commitment-accountability-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era} continues the era. ${P.companion} supports priority registry, priority overload detection, attention allocation insights, distraction identification, focus protection framework, and executive focus dashboard. Aipify promotes focus — leadership establishes priorities. Does NOT override leadership priorities or assign priorities without executive sponsor. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Organizational focus index",
    modeLabel: "Mode",
    readinessLabel: "Organizational focus index level",
    executiveReviews: "Executive focus dashboard",
    activeReflections: "Active organizational focus scaffolds",
    humanOversightRequired: `Leadership establishes priorities — users retain focus control; ${P.companion} promotes focus only`,
    eraOpenerSummary: `Commitment & Accountability Era — Phases ${P.eraRange} (continues)`,
    eraOpenerNote:
      "Cross-link only — do not duplicate Commitment & Accountability Engine Phase 274, Organizational Clarity Engine Phase 273, Time & Attention Guardian, Executive Copilot Engine Phase 267, or Decision Support Engine RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Priority registry — registry prompts",
    frameworkLabel: "Priority overload detection",
    reviewsLabel: "Executive focus dashboard",
    companionLabel: `${P.companion} — promotes focus, leadership establishes priorities`,
    subEngineLabel: "Distraction identification",
    reflections: "Organizational focus scaffolds",
    executiveReviewEntries: "Focus history entries",
    scaffoldNotes: "Leadership-governed focus scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT override leadership priorities, assign priorities without executive sponsor, or omit organizational focus audit history`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports enterprise organizational focus — leadership establishes priorities and focus history stays auditable.`,
      philosophy:
        "People First. Aipify promotes focus — leadership establishes priorities. Growth Partner terminology — never Affiliate.",
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
        ? "Organisasjonsfokus"
        : locale === "sv"
          ? "Organisationsfokus"
          : locale === "da"
            ? "Organisationsfokus"
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
      'export * from "./implementation-blueprint-phase274-vocabulary";',
      `export * from "./implementation-blueprint-phase274-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE274_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase274-aipify-enterprise-commitment-accountability.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE274_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase274-aipify-enterprise-commitment-accountability.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Enterprise Organizational Focus Engine (Phase 275):** See [AIPIFY_ENTERPRISE_ORGANIZATIONAL_FOCUS_PHASE275.md](./AIPIFY_ENTERPRISE_ORGANIZATIONAL_FOCUS_PHASE275.md) — Priority registry, priority overload detection, attention allocation insights, distraction identification, focus protection framework, executive focus dashboard, Aipify focus recommendations, focus history, strategic focus reviews, and organizational focus index. **Continues** Commitment & Accountability Era (274–278). \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} promotes focus — **NOT** overriding leadership priorities, assigning priorities without executive sponsor, or omitting organizational focus audit history. Cross-links only: Commitment & Accountability Engine Phase 274, Organizational Clarity Engine Phase 273, Time & Attention Guardian, Executive Copilot Engine Phase 267, Decision Support Engine. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 275")) {
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
