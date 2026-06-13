#!/usr/bin/env node
/** ABOS Phase 267 — Enterprise Executive Copilot Engine (Opportunity Discovery Era 264–268) */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "executive_copilot_dashboard",
  "executive_briefing_engine",
  "priority_intelligence_engine",
  "executive_attention_management_engine",
  "decision_support_workspace",
  "executive_follow_through_tracking",
  "executive_insight_timeline",
  "cross_functional_executive_view",
  "executive_copilot_integration_center",
];

const P = {
  phase: 267,
  migration: "20261419500000_aipify_enterprise_executive_copilot_engine_phase267.sql",
  slug: "aipify-enterprise-executive-copilot-engine",
  base: "AipifyEnterpriseExecutiveCopilot",
  camel: "aipifyEnterpriseExecutiveCopilotEngine",
  snake: "aipify_enterprise_executive_copilot",
  permPrefix: "aipify_enterprise_executive_copilot",
  helper: "aeecpe",
  bp: "aeecpebp267",
  decisionType: "aipify_enterprise_executive_copilot_engine",
  title: "Enterprise Executive Copilot",
  centerTitle: "Executive Copilot Center",
  companion: "Executive Copilot Companion",
  scoreKey: "aipify_enterprise_executive_copilot_score",
  modeKey: "enterprise_executive_copilot_mode",
  levelKey: "enterprise_executive_copilot_effectiveness_level",
  thirdEntity: "enterprise_executive_copilot_notes",
  era: "Opportunity Discovery Era (264–268)",
  eraRange: "264–268",
  docSlug: "AIPIFY_ENTERPRISE_EXECUTIVE_COPILOT",
  ilmFile: "implementation-blueprint-phase267-aipify-enterprise-executive-copilot.txt",
  navLabel: "Executive Copilot",
  crossLinkNote: "Cross-links only: Autonomous Coordination Engine Phase 266, Organizational Insights & Executive Intelligence Engine Phase 223, Strategic Execution Engine Phase 263, Decision Support Engine, and Executive Cockpit Phase 200 — never replace executive judgment, make decisions for executives, or omit executive copilot audit history.",
  companionLimitations: [
    "replacing_executive_judgment",
    "making_decisions_for_executives",
    "hiding_material_risks",
    "overwhelming_with_noise",
    "bypassing_executive_preferences",
    "modifying_executive_copilot_audit_trail",
    "unlogged_executive_recommendations",
    "override_executive_judgment"
  ]
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom266(content) {
  const pairs = [
    ["AipifyEnterpriseAutonomousCoordination", "AipifyEnterpriseExecutiveCopilot"],
    ["aipify-enterprise-autonomous-coordination-engine", "aipify-enterprise-executive-copilot-engine"],
    ["aipify_enterprise_autonomous_coordination", "aipify_enterprise_executive_copilot"],
    ["aipifyEnterpriseAutonomousCoordinationEngine", "aipifyEnterpriseExecutiveCopilotEngine"],
    ["aeacebp266", "aeecpebp267"],
    ["_aeace_", "_aeecpe_"],
    ["aipify_enterprise_autonomous_coordination_score", "aipify_enterprise_executive_copilot_score"],
    ["enterprise_autonomous_coordination_mode", "enterprise_executive_copilot_mode"],
    ["enterprise_autonomous_coordination_effectiveness_level", "enterprise_executive_copilot_effectiveness_level"],
    ["enterprise_autonomous_coordination_notes", "enterprise_executive_copilot_notes"],
    ["EnterpriseAutonomousCoordinationNotes", "EnterpriseExecutiveCopilotNotes"],
    ["enterprise_autonomous_coordination_notes_count", "enterprise_executive_copilot_notes_count"],
    ["Autonomous Coordination Phase 266", "__COPILOT_PHASE_266__"],
    ["Coordination Companion", "__COPILOT_COMPANION__"],
    ["Enterprise Autonomous Coordination", "Enterprise Executive Copilot"],
    ["__COPILOT_COMPANION__", "Executive Copilot Companion"],
    ["Coordination Center", "__COPILOT_CENTER__"],
    ["__COPILOT_PHASE_266__", "Autonomous Coordination Phase 266"],
    ["Phase 266", "Phase 267"],
    ["aipify_enterprise_autonomous_coordination.view", "aipify_enterprise_executive_copilot.view"],
    ["aipify_enterprise_autonomous_coordination.manage", "aipify_enterprise_executive_copilot.manage"],
    ["aipify_enterprise_autonomous_coordination.steward", "aipify_enterprise_executive_copilot.steward"],
    ["aipify_enterprise_autonomous_coordination_engine", "aipify_enterprise_executive_copilot_engine"],
    ["20261419400000_aipify_enterprise_autonomous_coordination_engine_phase266.sql", "20261419500000_aipify_enterprise_executive_copilot_engine_phase267.sql"],
    ["Repo Phase 266", "Repo Phase 267"],
    ["Phase 266 —", "Phase 267 —"],
    ["IMPLEMENTATION_BLUEPRINT_PHASE266_AIPIFY_ENTERPRISE_AUTONOMOUS_COORDINATION", "IMPLEMENTATION_BLUEPRINT_PHASE267_AIPIFY_ENTERPRISE_EXECUTIVE_COPILOT"],
    ["implementation-blueprint-phase266", "implementation-blueprint-phase267"],
    ["executive_coordination_dashboard", "executive_insight_timeline"],
    ["coordination_dashboard", "executive_copilot_dashboard"],
    ["coordination_registry_hub", "executive_briefing_engine"],
    ["coordination_plans_engine", "priority_intelligence_engine"],
    ["human_digital_workforce_orchestration_engine", "executive_attention_management_engine"],
    ["policy_driven_autonomy_engine", "decision_support_workspace"],
    ["dependency_management_engine", "executive_follow_through_tracking"],
    ["execution_synchronization_engine", "cross_functional_executive_view"],
    ["coordination_integration_center", "executive_copilot_integration_center"],
    ["coordination_companion", "executive_copilot_companion"],
    ["_seed_enterprise_autonomous_coordination_notes", "_seed_enterprise_executive_copilot_notes"],
    ["coordination initiative stewardship", "executive briefing stewardship"],
    ["policy-driven coordination support", "priority-informed executive support"],
    ["coordination-first execution culture", "executive-focus leadership culture"],
    ["active coordination initiatives", "active executive priorities"],
    ["initiatives requiring executive attention", "decisions requiring executive attention"],
    ["Coordination Registry", "Executive Briefing Engine"],
    ["Coordination Plans", "Priority Intelligence"],
    ["Human + Digital Workforce Orchestration", "Executive Attention Management"],
    ["Policy-Driven Autonomy", "Decision Support Workspace"],
    ["Dependency Management", "Executive Follow-Through Tracking"],
    ["Executive Coordination Dashboard", "Executive Insight Timeline"],
    ["execution synchronization indicators", "executive insight timeline indicators"],
    ["coordination registry prompts", "executive briefing prompts"],
    ["autonomous coordination prompts", "executive copilot prompts"],
    ["execution synchronization", "cross-functional executive view"],
    ["coordination alert triggers", "executive attention triggers"],
    ["RBAC-protected autonomous coordination governance", "RBAC-protected executive copilot governance"],
    ["Coordinate with policy boundaries", "Aipify advises — executives decide"],
    ["Humans remain accountable", "Executives decide"],
    ["Evaluate policies before acting", "Support decisions without replacing judgment"],
    ["no_bypassing_coordination_governance", "no_bypassing_executive_copilot_governance"],
    ["AIPIFY_ENTERPRISE_AUTONOMOUS_COORDINATION", "AIPIFY_ENTERPRISE_EXECUTIVE_COPILOT"],
    ["enterprise autonomous coordination", "enterprise executive copilot"],
    ["Autonomous coordination audit logs", "Executive copilot audit logs"],
    ["autonomous coordination governance RBAC", "executive copilot governance RBAC"],
    ["autonomous coordination scaffolds", "executive copilot scaffolds"],
    ["organization coordination policies", "organization executive briefing policies"],
    ["Coordination effectiveness index", "Executive effectiveness index"],
    ["Coordination effectiveness level", "Executive effectiveness level"],
    ["Synchronization entries", "Insight timeline entries"],
    ["initiative owner stewardship", "executive commitment stewardship"],
    ["coordination records beyond RBAC", "executive copilot records beyond RBAC"],
    ["coordination recommendation assistance", "executive recommendation assistance"],
    ["manager department coordination visibility", "executive cross-functional visibility"],
    ["Organizational Adaptability Engine Phase 265, Action Orchestration Engine Phase 256, Strategic Execution Engine Phase 263, Enterprise Workflow Automation Engine, and Companion Workforce", "Autonomous Coordination Engine Phase 266, Organizational Insights & Executive Intelligence Engine Phase 223, Strategic Execution Engine Phase 263, Decision Support Engine, and Executive Cockpit Phase 200"],
    ["Never replace human accountability or auto-execute coordination without policy approval", "Never replace executive judgment or make decisions on behalf of executives"],
    ["coordination initiatives", "executive priorities"],
    ["Coordination initiatives", "Executive priorities"],
    ["high-priority coordination routing", "executive attention routing"],
    ["coordinates without human accountability", "decides without executive judgment"],
    ["Unauthorized coordination action without policy approval", "Unauthorized executive action without executive approval"],
    ["Modifying coordination audit trails", "Modifying executive copilot audit trails"],
    ["Act before policy evaluation", "Decide before executive review"],
    ["user initiative owner control", "user executive control"],
    ["User initiative owner control", "User executive control"],
    ["coordination outcomes and autonomy policies", "briefing outcomes and executive preference policies"],
    ["execution synchronization visibility", "executive insight visibility"],
    ["autonomous coordination", "executive copilot"],
    ["enable organizations to coordinate people, digital employees, workflows, and systems toward shared objectives through policy-driven autonomy — maintaining coordination governance, humans remain accountable with Aipify facilitation, full audit logging, role-based permissions, and execution alignment that compounds over time", "enable executives to maintain awareness, prioritize effectively, identify emerging risks and opportunities, and support high-quality decision-making — maintaining executive copilot governance, executives decide with Aipify advisory support, full audit logging, role-based permissions, and leadership effectiveness that compounds over time"],
    ["cross-functional execution improves, dependency delays reduce, escalation rates lower, milestone completion rises, digital workforce contribution increases, and coordination effectiveness scores strengthen with policy-driven coordination", "executive decision delays reduce, strategic focus improves, follow-through rates increase, executive engagement rises, emerging issues are identified faster, and executive effectiveness scores strengthen with Aipify advises — executives decide"],
    ["Continues the era.", "Continues the era."],
    ["continues the era", "continues the era"],
    ["Opportunity Discovery Era continues", "Opportunity Discovery Era continues"],
    ["__COPILOT_CENTER__", "Executive Copilot Center"],
  ];
  let out = content;
  for (const [from, to] of pairs) out = out.split(from).join(to);
  return out;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 267 — Executive Copilot Center. Executive Copilot Companion supports enterprise executive copilot — NOT replacing executive judgment, making decisions for executives, or omitting executive copilot audit history. Helpers _${bp}_*.'; $$;
create or replace function public._${bp}_mission() returns text language sql immutable as $$ select 'Help leaders maintain awareness, prioritize effectively, identify risks and opportunities, and support high-quality decision-making — Executive Copilot Companion advises; executives decide.'; $$;
create or replace function public._${bp}_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._${bp}_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Executive Copilot Center within Opportunity Discovery Era (264–268). Aipify advises; executives decide; executive-governed briefings; full audit logging; Executive Copilot Companion informs and recommends. Continues the era.'; $$;
create or replace function public._${bp}_vision() returns text language sql immutable as $$ select 'Executives reduce decision delays, improve strategic focus, increase follow-through rates, engage more consistently, identify emerging issues faster, and strengthen executive effectiveness scores with Aipify advises — executives decide.'; $$;
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Executive Copilot Center programs', 'emoji', '✅', 'description', 'Ten executive copilot modules'),
    jsonb_build_object('key', 'executive_briefing_engine', 'label', 'Executive briefing engine', 'emoji', '📋', 'description', 'Concise high-value leader summaries'),
    jsonb_build_object('key', 'priority_intelligence_engine', 'label', 'Priority intelligence', 'emoji', '🔍', 'description', 'Focus on what matters most'),
    jsonb_build_object('key', 'executive_attention_management_engine', 'label', 'Executive attention management', 'emoji', '📊', 'description', 'Reduce noise and decision fatigue'),
    jsonb_build_object('key', 'companion', 'label', 'Executive Copilot Companion', 'emoji', '✨', 'description', 'Advises — executives decide'),
    jsonb_build_object('key', 'decision_support_workspace', 'label', 'Decision support workspace', 'emoji', '🧪', 'description', 'Support executive decision-making'),
    jsonb_build_object('key', 'executive_insight_timeline', 'label', 'Executive insight timeline', 'emoji', '🛡️', 'description', 'Chronological leadership view'),
    jsonb_build_object('key', 'executive_follow_through_tracking', 'label', 'Executive follow-through tracking', 'emoji', '🔔', 'description', 'Keep commitments visible')
  ); $$;
create or replace function public._${bp}_executive_copilot_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive Copilot Center — ten capabilities. Aipify advises — executives decide.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'executive_briefing', 'label', 'Executive Briefing Engine'),
    jsonb_build_object('key', 'priority_intelligence', 'label', 'Priority Intelligence'),
    jsonb_build_object('key', 'attention_management', 'label', 'Executive Attention Management'),
    jsonb_build_object('key', 'decision_support', 'label', 'Decision Support Workspace'),
    jsonb_build_object('key', 'follow_through', 'label', 'Executive Follow-Through Tracking'),
    jsonb_build_object('key', 'insight_timeline', 'label', 'Executive Insight Timeline'),
    jsonb_build_object('key', 'cross_functional_view', 'label', 'Cross-Functional Executive View'),
    jsonb_build_object('key', 'recommendation_engine', 'label', 'Executive Recommendation Engine'),
    jsonb_build_object('key', 'executive_dashboard', 'label', 'Executive Dashboard'),
    jsonb_build_object('key', 'executive_effectiveness_index', 'label', 'Executive Effectiveness Index')
  )); $$;
create or replace function public._${bp}_executive_briefing_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive briefing engine — concise high-value summaries for leaders.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'critical_developments', 'label', 'Are critical operational developments summarized?'),
    jsonb_build_object('key', 'strategic_updates', 'label', 'Are strategic initiative updates included?'),
    jsonb_build_object('key', 'risks_opportunities', 'label', 'Are emerging risks and key opportunities highlighted?'),
    jsonb_build_object('key', 'decisions_required', 'label', 'Are required decisions and upcoming commitments listed?'),
    jsonb_build_object('key', 'executive_judgment', 'label', 'How does briefing support executives decide — not replace judgment?')
  )); $$;
create or replace function public._${bp}_priority_intelligence_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Priority intelligence — help executives focus on what matters most.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'strategic_importance', 'label', 'Strategic importance factor'),
    jsonb_build_object('key', 'time_sensitivity', 'label', 'Time sensitivity factor'),
    jsonb_build_object('key', 'monitor', 'label', 'Monitor priority level'),
    jsonb_build_object('key', 'important', 'label', 'Important priority level'),
    jsonb_build_object('key', 'urgent', 'label', 'Urgent priority level'),
    jsonb_build_object('key', 'executive_attention', 'label', 'Executive Attention Required level')
  )); $$;
create or replace function public._${bp}_cross_functional_executive_view() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Cross-functional executive view — unified perspective across Aipify modules.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'operational_performance', 'label', 'Operational performance indicators'),
    jsonb_build_object('key', 'workforce_health', 'label', 'Workforce health indicators'),
    jsonb_build_object('key', 'customer_trust', 'label', 'Customer trust indicators'),
    jsonb_build_object('key', 'strategic_execution', 'label', 'Strategic execution indicators'),
    jsonb_build_object('key', 'governance', 'label', 'Governance indicators')
  )); $$;
create or replace function public._${bp}_executive_copilot_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive Copilot Companion — advises and recommends; never replaces executive judgment or makes decisions for executives.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'schedule_review', 'label', 'Schedule review recommendations'),
    jsonb_build_object('key', 'escalate_issue', 'label', 'Escalate issue suggestions'),
    jsonb_build_object('key', 'approve_initiative', 'label', 'Approve initiative guidance'),
    jsonb_build_object('key', 'reallocate_resources', 'label', 'Reallocate resource suggestions'),
    jsonb_build_object('key', 'investigate_trends', 'label', 'Investigate emerging trend recommendations'),
    jsonb_build_object('key', 'executive_guardrails', 'label', 'Executive copilot governance — Trust Architecture enforced')
  )); $$;
create or replace function public._${bp}_executive_attention_management_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive attention management — reduce noise and decision fatigue.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'material_only', 'label', 'Surface only material developments'),
    jsonb_build_object('key', 'group_updates', 'label', 'Group related updates'),
    jsonb_build_object('key', 'suppress_noise', 'label', 'Suppress low-value notifications'),
    jsonb_build_object('key', 'escalate_critical', 'label', 'Escalate unresolved critical items'),
    jsonb_build_object('key', 'personalization', 'label', 'Personalize by executive responsibilities')
  )); $$;
create or replace function public._${bp}_decision_support_workspace() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Decision support workspace — Aipify advises; executives decide.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'situation_overview', 'label', 'Situation overview'),
    jsonb_build_object('key', 'risks_opportunities', 'label', 'Risks and opportunities identified'),
    jsonb_build_object('key', 'stakeholder_considerations', 'label', 'Stakeholder considerations'),
    jsonb_build_object('key', 'recommended_next_steps', 'label', 'Recommended next steps'),
    jsonb_build_object('key', 'historical_context', 'label', 'Related historical context')
  )); $$;
create or replace function public._${bp}_executive_follow_through_tracking() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive follow-through tracking — keep important commitments visible.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'executive_actions', 'label', 'Executive actions assigned'),
    jsonb_build_object('key', 'strategic_commitments', 'label', 'Strategic commitments made'),
    jsonb_build_object('key', 'outstanding_approvals', 'label', 'Outstanding approvals'),
    jsonb_build_object('key', 'on_track', 'label', 'On Track status'),
    jsonb_build_object('key', 'overdue', 'label', 'Overdue status')
  )); $$;
create or replace function public._${bp}_executive_insight_timeline() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive insight timeline — chronological view of significant leadership events.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'decisions_made', 'label', 'Decisions made'),
    jsonb_build_object('key', 'risks_escalated', 'label', 'Risks escalated'),
    jsonb_build_object('key', 'opportunities_surfaced', 'label', 'Opportunities surfaced'),
    jsonb_build_object('key', 'milestones_reached', 'label', 'Strategic milestones reached'),
    jsonb_build_object('key', 'executives_decide', 'label', 'Aipify advises — executives decide'),
    jsonb_build_object('key', 'index_levels', 'label', 'Reactive, Developing, Structured, Strategic, Exceptional')
  )); $$;
create or replace function public._${bp}_executive_copilot_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive copilot integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'autonomous_coordination', 'label', 'Autonomous Coordination Phase 266', 'cross_link', '/app/aipify-enterprise-autonomous-coordination-engine'),
    jsonb_build_object('key', 'organizational_insights', 'label', 'Organizational Insights Phase 223', 'cross_link', '/app/aipify-enterprise-organizational-insights-executive-intelligence-engine'),
    jsonb_build_object('key', 'strategic_execution', 'label', 'Strategic Execution Phase 263', 'cross_link', '/app/aipify-enterprise-strategic-execution-engine'),
    jsonb_build_object('key', 'decision_support', 'label', 'Decision Support Engine', 'cross_link', '/app/assistant/decisions'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/executive'),
    jsonb_build_object('key', 'executive_gates', 'label', 'Executive gates — Aipify advises only')
  )); $$;
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Replacing executive judgment',
      'Making decisions for executives',
      'Hiding material risks',
      'Overwhelming with noise',
      'Modifying executive copilot audit trails',
      'Unlogged executive recommendations',
      'Bypassing executive preferences',
      'Override executive judgment'), 'principle', 'Executive Copilot Companion advises — executives decide and leadership history stays auditable.'); $$;
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm executive support without pressure.', 'values', jsonb_build_array('aipify_advises','executives_decide','low_cognitive_load','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Executive copilot audit logs via aipify_enterprise_executive_copilot_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_executive_copilot permissions — executive copilot governance RBAC'),
    jsonb_build_object('key', 'executive_gates', 'label', 'Executives decide — Aipify advises only'),
    jsonb_build_object('key', 'briefing_policies', 'label', 'Organization-defined executive briefing and preference policies'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Executive copilot metadata only — no raw operational records'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 264, 'key', 'enterprise_opportunity_discovery', 'label', 'Opportunity Discovery Phase 264', 'route', '/app/aipify-enterprise-opportunity-discovery-engine', 'description', 'Proactive growth discovery — cross-link only'),
    jsonb_build_object('phase', 265, 'key', 'enterprise_organizational_adaptability', 'label', 'Organizational Adaptability Phase 265', 'route', '/app/aipify-enterprise-organizational-adaptability-engine', 'description', 'Change readiness — cross-link only'),
    jsonb_build_object('phase', 266, 'key', 'enterprise_autonomous_coordination', 'label', 'Autonomous Coordination Phase 266', 'route', '/app/aipify-enterprise-autonomous-coordination-engine', 'description', 'Policy-driven coordination — cross-link only'),
    jsonb_build_object('phase', 267, 'key', 'enterprise_executive_copilot', 'label', 'Executive Copilot Phase 267', 'route', '/app/aipify-enterprise-executive-copilot-engine', 'description', 'Executive advisory support — continues era')
  ); $$;
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'autonomous_coordination', 'label', 'Autonomous Coordination Phase 266', 'route', '/app/aipify-enterprise-autonomous-coordination-engine', 'relationship', 'Coordination signals — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/executive', 'relationship', 'Executive landing — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Executives decide — cross-link only')
  ); $$;
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as $$ select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); $$;
create or replace function public._${bp}_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Executive Copilot Center internally with executive-governed briefings and full audit logging. Growth Partner terminology. Executive Copilot Companion advises — never replaces executive judgment or makes decisions for executives.'; $$;
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — executives decide.', 'Executive Copilot Companion advises and recommends.', 'Aipify advises — executives decide.', 'Growth Partner — never Affiliate.', 'Opportunity Discovery Era continues — 264–268.'); $$;
create or replace function public._${bp}_privacy_note() returns text language sql immutable as $$
  select 'Executive Copilot Center metadata only — briefing summaries max ~500 chars. No raw operational records beyond RBAC or PII in audit logs.'; $$;
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_enterprise_autonomous_coordination_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._aeacebp266_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_strategic_objective_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Executive briefing engine — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_executive_briefing_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_relationship_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Executive briefing engine — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_executive_briefing_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_critical_function_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Executive briefing engine — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_executive_briefing_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_memory_capture_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Executive briefing engine — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_executive_briefing_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_improvement_opportunity_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Executive briefing engine — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_executive_briefing_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_decision_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Executive briefing engine — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_executive_briefing_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_action_queue_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Executive briefing engine — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_executive_briefing_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_trend_monitoring_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Executive briefing engine — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_executive_briefing_engine()->'reflection_questions') = 5,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_strategic_execution_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Executive Copilot Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_executive_copilot_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_relationship_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Executive Copilot Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_executive_copilot_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_resilience_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Executive Copilot Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_executive_copilot_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_memory_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Executive Copilot Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_executive_copilot_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_improvement_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Executive Copilot Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_executive_copilot_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_decision_governance_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Executive Copilot Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_executive_copilot_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_orchestration_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Executive Copilot Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_executive_copilot_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_intelligence_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Executive Copilot Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_executive_copilot_dashboard()->'capabilities') = 10,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 4,`,
  );

  const replaceRpcRef = (sqlText, fn) => {
    if (fn === "executive_copilot_dashboard") {
      return sqlText.replace(/public\._(\w+)_executive_copilot_dashboard\(\)/g, (full, prefix) =>
        prefix.includes("insight") ? full : `public._${P.bp}_executive_copilot_dashboard()`,
      );
    }
    return sqlText.replace(
      new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"),
      `public._${P.bp}_${fn}()`,
    );
  };

  for (const fn of [...SCAFFOLDS, "executive_copilot_companion"].sort((a, b) => b.length - a.length)) {
    sql = replaceRpcRef(sql, fn);
  }

  sql = sql.replace(
    new RegExp(`select '${P.slug}'[^;]+;`, "g"),
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    /select 'aipify-enterprise-autonomous-coordination-engine'[^;]+;/g,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected enterprise executive copilot guidance within Opportunity Discovery Era;",
    "RBAC-protected enterprise executive copilot guidance within Opportunity Discovery Era;",
  );
  sql = sql.replaceAll(
    "RBAC-protected enterprise executive copilot guidance within Opportunity Discovery Era;",
    "RBAC-protected enterprise executive copilot guidance within Opportunity Discovery Era;",
  );
  sql = sql.replaceAll(
    "RBAC-protected enterprise continuous improvement guidance within Continuous Optimization Era;",
    "RBAC-protected enterprise executive copilot guidance within Opportunity Discovery Era;",
  );
  sql = sql.replace(
    /Phase 267 Enterprise Executive Copilot Engine —/,
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
    `'executive_insight_timeline', public._${P.bp}_executive_insight_timeline()`,
  );
  sql = sql.replace(
    /'improvement_improvement_dashboard', public\._\w+_improvement_improvement_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_executive_insight_timeline()`,
  );
  sql = sql.replace(
    /'decision_decision_governance_dashboard', public\._\w+_decision_decision_governance_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_executive_insight_timeline()`,
  );
  sql = sql.replace(
    /'orchestration_orchestration_dashboard', public\._\w+_orchestration_orchestration_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_executive_insight_timeline()`,
  );
  sql = sql.replace(
    /'governance_rules_dashboard', public\._\w+_governance_rules_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_executive_insight_timeline()`,
  );
  sql = sql.replace(
    /'improvement_controls_dashboard', public\._\w+_improvement_controls_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_executive_insight_timeline()`,
  );
  sql = sql.replace(
    /'policy_controls_dashboard', public\._\w+_policy_controls_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_executive_insight_timeline()`,
  );
  sql = sql.replace(
    /'intelligence_controls_dashboard', public\._\w+_intelligence_controls_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_executive_insight_timeline()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_resilience_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_insight_timeline()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_memory_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_insight_timeline()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_improvement_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_insight_timeline()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_decision_governance_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_insight_timeline()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_orchestration_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_insight_timeline()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_intelligence_controls_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_insight_timeline()`,
  );

  sql = sql.replace(
    /'memory_controls_dashboard', public\._\w+_memory_controls_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_executive_insight_timeline()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_memory_controls_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_insight_timeline()`,
  );

  return sql;
}

function genMigration() {
  const src266 = path.join(
    ROOT,
    "supabase/migrations/20261419400000_aipify_enterprise_autonomous_coordination_engine_phase266.sql",
  );
  if (!fs.existsSync(src266)) throw new Error("Phase 266 migration required");
  let m = transformFrom266(fs.readFileSync(src266, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-enterprise-autonomous-coordination-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(
    path.join(ROOT, `lib/core/${P.slug}.ts`),
    transformFrom266(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")),
  );
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(
      path.join(dst, f),
      transformFrom266(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")),
    );
  }
  const panel = path.join(
    ROOT,
    `components/app/${srcSlug}/AipifyEnterpriseAutonomousCoordinationEngineDashboardPanel.tsx`,
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`),
    transformFrom266(fs.readFileSync(panel, "utf8")),
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/index.ts`),
    `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`,
  );
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom266(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom266(
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

${P.centerTitle} within ${P.era}. **Continues the era.** ${P.companion} supports executive briefing engine, priority intelligence, executive attention management, decision support workspace, executive follow-through tracking, executive insight timeline, cross-functional executive view, executive recommendation engine, executive dashboard, and executive effectiveness index — does NOT replace executive judgment, make decisions for executives, or omit executive copilot audit history.

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

## What is the Enterprise Executive Copilot Engine?

The Enterprise Executive Copilot Engine helps leaders maintain awareness, prioritize effectively, and support high-quality decision-making at \`/app/${P.slug}\`.

## What executive copilot features are included?

Executive briefing engine, priority intelligence, executive attention management, decision support workspace, executive follow-through tracking, executive insight timeline, cross-functional executive view, executive recommendation engine, executive dashboard, and executive effectiveness index.

## What priority levels apply?

Monitor, important, urgent, and executive attention required — with follow-through statuses on track, upcoming, due soon, and overdue.

## What briefing modes apply?

Morning briefing, weekly executive summary, monthly strategic review, and on-demand briefing.

## What does the executive copilot flow look like?

Organizational signals collected → insights prioritized → executive briefing generated → decision support provided → recommendations surfaced → executive actions tracked → progress reviewed → leadership effectiveness strengthened → executive focus continuously refined.

## Who can access executive copilot?

Super Admin (full access), Tenant Admin (executive copilot policies), Executives (executive dashboard and briefings), Leadership team (decision support workspace), Chiefs of staff (follow-through tracking) — enterprise RBAC.

## Is full audit logging enforced?

**Yes.** Every executive copilot lifecycle event is logged. Briefing metadata and recommendation history are recorded.

## How does this integrate with other Aipify surfaces?

${P.crossLinkNote}

## Does the Executive Copilot Companion replace executive judgment?

**No.** Aipify advises — **executives decide.** ${P.companion} does **NOT** replace executive judgment, make decisions for executives, or omit executive copilot audit history.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Executive Copilot: briefing engine, priority intelligence, attention management, decision support, follow-through tracking, insight timeline, cross-functional view, recommendation engine, executive dashboard, effectiveness index.
Priority levels: monitor, important, urgent, executive attention required.
Briefing modes: morning, weekly summary, monthly strategic review, on-demand.
Follow-through statuses: on track, upcoming, due soon, overdue.
Recommendation states: informational, recommended, strongly recommended.
Index levels: reactive, developing, structured, strategic, exceptional.
Flow: signals → prioritize → brief → decision support → recommend → track → review → strengthen → refine.
Security: executive copilot governance RBAC, executive gates, audit logging, metadata only, enterprise permissions, 2FA.
Design principles: Aipify advises — executives decide, low cognitive load, material developments only.
Companion limitations: no replacing executive judgment, no deciding for executives, no hiding material risks, no overwhelming with noise.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate. Era continues 264–268.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} advises; never replaces executive judgment, makes decisions for executives, or omits executive copilot audit history.";
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
      '| "aipifyEnterpriseAutonomousCoordinationEngine"',
      `| "aipifyEnterpriseAutonomousCoordinationEngine"\n  | "${id}"`,
    );
  }
  if (!c.includes(href)) {
    const anchor =
      /id: "aipifyEnterpriseAutonomousCoordinationEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyEnterpriseAutonomousCoordinationEngine",\n  },/;
    c = c.replace(
      anchor,
      (m) =>
        `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-enterprise-autonomous-coordination-engine")) {\n    return "aipifyEnterpriseAutonomousCoordinationEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-enterprise-autonomous-coordination-engine")) {\n    return "aipifyEnterpriseAutonomousCoordinationEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace(
        '"aipify_enterprise_autonomous_coordination.steward",',
        `"aipify_enterprise_autonomous_coordination.steward",\n    "${perm}",`,
      );
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-enterprise-autonomous-coordination-engine";',
      `export * from "./aipify-enterprise-autonomous-coordination-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era} continues. ${P.companion} supports executive briefing engine, priority intelligence, executive attention management, decision support workspace, executive follow-through tracking, executive insight timeline, and cross-functional executive view. Aipify advises — executives decide. Does NOT replace executive judgment or make decisions for executives. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Executive effectiveness index",
    modeLabel: "Mode",
    readinessLabel: "Executive effectiveness level",
    executiveReviews: "Executive insight timeline",
    activeReflections: "Active executive copilot scaffolds",
    humanOversightRequired: `Executives decide — users retain executive control; ${P.companion} advises only`,
    eraOpenerSummary: `Opportunity Discovery Era — Phases ${P.eraRange} (continues)`,
    eraOpenerNote:
      "Cross-link only — do not duplicate Autonomous Coordination Engine, Organizational Insights Engine, Strategic Execution Engine, Decision Support Engine, or Executive Cockpit RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Executive briefing engine — briefing prompts",
    frameworkLabel: "Priority intelligence engine",
    reviewsLabel: "Executive insight timeline",
    companionLabel: `${P.companion} — advises leaders, executives decide`,
    subEngineLabel: "Decision support workspace",
    reflections: "Executive copilot scaffolds",
    executiveReviewEntries: "Insight timeline entries",
    scaffoldNotes: "Executive-governed copilot scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT replace executive judgment, make decisions for executives, or omit executive copilot audit history`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports enterprise executive copilot — executives decide and leadership history stays auditable.`,
      philosophy:
        "People First. Aipify advises — executives decide. Growth Partner terminology — never Affiliate.",
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
        ? "Executive Copilot"
        : locale === "sv"
          ? "Executive Copilot"
          : locale === "da"
            ? "Executive Copilot"
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
      'export * from "./implementation-blueprint-phase266-vocabulary";',
      `export * from "./implementation-blueprint-phase266-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE266_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase266-aipify-enterprise-autonomous-coordination.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE266_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase266-aipify-enterprise-autonomous-coordination.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_enterprise_autonomous_coordination.view`, `aipify_enterprise_autonomous_coordination.manage`, `aipify_enterprise_autonomous_coordination.steward`.";
  const entry = `\n**Enterprise Executive Copilot Engine (Phase 267):** See [AIPIFY_ENTERPRISE_EXECUTIVE_COPILOT_PHASE267.md](./AIPIFY_ENTERPRISE_EXECUTIVE_COPILOT_PHASE267.md) — Executive briefing engine, priority intelligence, executive attention management, decision support workspace, executive follow-through tracking, executive insight timeline, cross-functional executive view, executive recommendation engine, executive dashboard, and executive effectiveness index. **Continues** Opportunity Discovery Era (264–268). \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} advises — **NOT** replacing executive judgment, making decisions for executives, or omitting executive copilot audit history. Cross-links only: Autonomous Coordination Engine Phase 266, Organizational Insights & Executive Intelligence Engine Phase 223, Strategic Execution Engine Phase 263, Decision Support Engine, Executive Cockpit Phase 200. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 267")) {
    const idx = c.indexOf(marker);
    c = idx === -1 ? `${c}\n${entry}\n` : `${c.slice(0, idx + marker.length)}${entry}${c.slice(idx + marker.length)}`;
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
  console.error(`Phase ${P.phase} docs generated; stack requires Phase 266 artifacts: ${err.message}`);
  process.exitCode = 1;
}
