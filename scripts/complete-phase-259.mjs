#!/usr/bin/env node
/** ABOS Phase 259 — Enterprise Continuous Improvement Engine (Continuous Optimization Era 259–263) */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "improvement_dashboard",
  "improvement_opportunity_hub",
  "improvement_backlog_engine",
  "impact_estimation_engine",
  "implementation_tracking_engine",
  "before_after_analysis_engine",
  "improvement_controls_dashboard",
  "employee_submissions_engine",
  "improvement_integration_center",
];

const P = {
  phase: 259,
  migration: "20261418600000_aipify_enterprise_continuous_improvement_engine_phase259.sql",
  slug: "aipify-enterprise-continuous-improvement-engine",
  base: "AipifyEnterpriseContinuousImprovement",
  camel: "aipifyEnterpriseContinuousImprovementEngine",
  snake: "aipify_enterprise_continuous_improvement",
  permPrefix: "aipify_enterprise_continuous_improvement",
  helper: "aecie",
  bp: "aeciebp259",
  decisionType: "aipify_enterprise_continuous_improvement_engine",
  title: "Enterprise Continuous Improvement",
  centerTitle: "Continuous Improvement Center",
  companion: "Improvement Companion",
  scoreKey: "aipify_enterprise_continuous_improvement_score",
  modeKey: "enterprise_continuous_improvement_mode",
  levelKey: "enterprise_continuous_improvement_maturity_level",
  thirdEntity: "enterprise_continuous_improvement_notes",
  era: "Continuous Optimization Era (259–263)",
  eraRange: "259–263",
  docSlug: "AIPIFY_ENTERPRISE_CONTINUOUS_IMPROVEMENT_ENGINE",
  ilmFile: "implementation-blueprint-phase259-aipify-enterprise-continuous-improvement.txt",
  navLabel: "Continuous Improvement",
  crossLinkNote:
    "Cross-links only: Decision Escalation & Governance Engine Phase 258, Action Orchestration Engine Phase 256, Enterprise Analytics Engine Phase 235, Enterprise Notification Engine Phase 233, Employee Knowledge Engine, Executive Cockpit Phase 200, Resource Capacity Engine Phase 209, and Aipify Translate Phase 238 — never bypass improvement approval workflows, implement changes without human approval, or omit improvement audit history.",
  companionLimitations: [
    "implementing_changes_without_approval",
    "bypassing_improvement_prioritization",
    "hiding_impact_estimates",
    "unlogged_improvement_changes",
    "replacing_owner_judgment",
    "modifying_improvement_audit_trail",
    "ignoring_before_after_evidence",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom258(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyEnterpriseDecisionEscalationGovernance", P.base],
    ["aipify-enterprise-decision-escalation-governance-engine", P.slug],
    ["aipify_enterprise_decision_escalation_governance", P.snake],
    ["aipifyEnterpriseDecisionEscalationGovernanceEngine", P.camel],
    ["aedegbebp258", P.bp],
    ["_aedegbe_", `_${P.helper}_`],
    ["aipify_enterprise_decision_escalation_governance_score", P.scoreKey],
    ["enterprise_decision_escalation_governance_mode", P.modeKey],
    ["enterprise_decision_escalation_governance_maturity_level", P.levelKey],
    ["enterprise_decision_escalation_governance_notes", P.thirdEntity],
    ["EnterpriseDecisionEscalationGovernanceNote", thirdPascal],
    ["enterprise_decision_escalation_governance_notes_count", `${P.thirdEntity}_count`],
    ["Decision Escalation Phase 258", "__CI_PHASE_258__"],
    ["Governance Companion", "__CI_COMPANION__"],
    ["Enterprise Decision Escalation & Governance", P.title],
    ["__CI_COMPANION__", P.companion],
    ["Decision Escalation", "__CI_CENTER__"],
    ["__CI_PHASE_258__", "Decision Escalation Phase 258"],
    ["Phase 258", `Phase ${P.phase}`],
    ["aipify_enterprise_decision_escalation_governance.view", `${P.permPrefix}.view`],
    ["aipify_enterprise_decision_escalation_governance.manage", `${P.permPrefix}.manage`],
    ["aipify_enterprise_decision_escalation_governance.steward", `${P.permPrefix}.steward`],
    ["aipify_enterprise_decision_escalation_governance_engine", P.decisionType],
    [
      "20261418500000_aipify_enterprise_decision_escalation_governance_engine_phase258.sql",
      P.migration,
    ],
    ["Repo Phase 258", `Repo Phase ${P.phase}`],
    ["Phase 258 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE258_AIPIFY_ENTERPRISE_DECISION_ESCALATION_GOVERNANCE_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase258", `implementation-blueprint-phase${P.phase}`],
    ["governance_rules_dashboard", SCAFFOLDS[6]],
    ["decision_governance_dashboard", SCAFFOLDS[0]],
    ["decision_registry_hub", SCAFFOLDS[1]],
    ["decision_escalation_engine", SCAFFOLDS[2]],
    ["decision_briefing_packs_engine", SCAFFOLDS[3]],
    ["multi_option_analysis_engine", SCAFFOLDS[4]],
    ["decision_deadlines_engine", SCAFFOLDS[5]],
    ["stakeholder_alignment_engine", SCAFFOLDS[7]],
    ["decision_integration_center", SCAFFOLDS[8]],
    ["governance_companion", "improvement_companion"],
    [
      "_seed_enterprise_decision_escalation_governance_notes",
      `_seed_${P.thirdEntity.replace("_notes", "")}_notes`,
    ],
    ["decision governance stewardship", "continuous improvement stewardship"],
    ["governance-informed decision support", "data-informed improvement support"],
    ["accountability-first governance culture", "evidence-first improvement culture"],
    ["active decision governance programs", "active improvement programs"],
    ["decisions requiring executive attention", "improvements requiring executive attention"],
    ["Decision Registry", "Improvement Opportunity Detection"],
    ["Decision Escalation Engine", "Improvement Backlog Engine"],
    ["Decision Briefing Packs Engine", "Impact Estimation Engine"],
    ["Multi-Option Analysis Engine", "Implementation Tracking Engine"],
    ["Decision Deadlines Engine", "Before vs After Analysis Engine"],
    ["Governance Rules Dashboard", "Improvement Controls Dashboard"],
    ["decision completion indicators", "improvement completion indicators"],
    ["decision escalation prompts", "improvement opportunity prompts"],
    ["governance assistant prompts", "improvement assistant prompts"],
    ["stakeholder alignment", "employee improvement submissions"],
    ["escalation alert signals", "improvement alert signals"],
    ["RBAC-protected governance rules", "RBAC-protected improvement policies"],
    ["Recommend before deciding", "Detect before optimizing"],
    ["Human authority before finalization", "Human approval before implementation"],
    ["Context before escalation", "Measure before claiming success"],
    ["no_bypassing_governance_rules", "no_bypassing_improvement_approval"],
    ["AIPIFY_ENTERPRISE_DECISION_ESCALATION_GOVERNANCE_ENGINE", P.docSlug],
    ["enterprise decision escalation and governance", "enterprise continuous improvement"],
    ["Decision governance audit logs", "Continuous improvement audit logs"],
    ["governance rule RBAC", "improvement policy RBAC"],
    ["decision governance scaffolds", "continuous improvement scaffolds"],
    ["organization governance rules", "organization improvement policies"],
    ["Governance readiness score", "Continuous improvement score"],
    ["Governance maturity level", "Improvement maturity level"],
    ["Decision registry entries", "Improvement backlog entries"],
    ["governance rule stewardship", "improvement initiative stewardship"],
    ["decision records beyond RBAC", "improvement records beyond RBAC"],
    ["deadline tracking assistance", "implementation tracking assistance"],
    ["manager department decision visibility", "manager department improvement visibility"],
    [
      "Decision Support Engine, Decision Intelligence & Recommendation Engine Phase 251, Enterprise Governance & Policy Automation Engine Phase 253, Action Orchestration Engine Phase 256, Enterprise Notification Engine Phase 233, Executive Cockpit Phase 200, Enterprise Analytics Engine Phase 235, Trust & Action Engine, and Aipify Translate Phase 238",
      "Decision Escalation & Governance Engine Phase 258, Action Orchestration Engine Phase 256, Enterprise Analytics Engine Phase 235, Enterprise Notification Engine Phase 233, Employee Knowledge Engine, Executive Cockpit Phase 200, Resource Capacity Engine Phase 209, and Aipify Translate Phase 238",
    ],
    [
      "Never bypass governance rules or finalize decisions without human authority",
      "Never bypass improvement approval workflows or implement changes without human approval",
    ],
    ["governance programs", "improvement programs"],
    ["Governance programs", "Improvement programs"],
    ["high-risk decision routing", "high-impact improvement routing"],
    ["finalizes decisions without governance approval", "implements changes without improvement approval"],
    ["Unauthorized decision finalization without authority", "Unauthorized improvement implementation without approval"],
    ["Modifying decision audit trails", "Modifying improvement audit trails"],
    ["Haste before context", "Claims before measurement"],
    ["user decision judgment control", "user improvement judgment control"],
    ["User decision judgment control", "User improvement judgment control"],
    ["decision outcomes and governance rules", "improvement outcomes and prioritization policies"],
    ["decision registry visibility", "improvement backlog visibility"],
    ["decision escalation and governance", "continuous improvement"],
    [
      "enable organizations to elevate important decisions to the correct stakeholders with complete context, structured recommendations, and clear accountability — maintaining governance rules, human authority for finalization, full audit logging, role-based permissions, and institutional decision history",
      "enable organizations to continuously identify inefficiencies, monitor improvement opportunities, track implemented changes, and evolve through measurable optimization — maintaining improvement approval workflows, human approval for implementation, full audit logging, role-based permissions, and institutional knowledge retention",
    ],
    [
      "decision delays decrease, governance compliance improves, executive response times accelerate, transparency increases, escalation confusion reduces, and institutional knowledge improves with recommend before deciding",
      "completed improvements increase, value generated grows, participation rates rise, recurring inefficiencies decrease, automation utilization increases, and improvement maturity progresses with detect before optimizing",
    ],
    ["Completes the era.", "Starts the era."],
    ["completes the era", "starts the era"],
    ["Knowledge Quality Era completes", "Continuous Optimization Era starts"],
    ["Knowledge Quality Era (254–258)", P.era],
    ["254–258", P.eraRange],
    ["__GOV_CENTER__", P.centerTitle],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._aeciebp259_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 259 — Continuous Improvement Center. Improvement Companion supports enterprise continuous improvement — NOT implementing changes without human approval, bypassing improvement prioritization, or omitting improvement audit history. Helpers _aeciebp259_*.'; $$;
create or replace function public._aeciebp259_mission() returns text language sql immutable as $$ select 'Enable organizations to continuously identify inefficiencies, monitor improvement opportunities, track implemented changes, and evolve through measurable optimization — Improvement Companion detects and recommends, humans approve and decide.'; $$;
create or replace function public._aeciebp259_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._aeciebp259_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Continuous Improvement Center within Continuous Optimization Era (259–263). Human approval for implementation; improvement-governed backlog; full audit logging; Improvement Companion informs and prepares. Starts the era.'; $$;
create or replace function public._aeciebp259_vision() returns text language sql immutable as $$ select 'Organizations increase completed improvements, generate measurable value, raise participation rates, reduce recurring inefficiencies, increase automation utilization, and progress improvement maturity with detect before optimizing.'; $$;
create or replace function public._aeciebp259_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Continuous Improvement Center programs', 'emoji', '✅', 'description', 'Ten continuous improvement modules'),
    jsonb_build_object('key', 'improvement_opportunity_hub', 'label', 'Improvement opportunity detection', 'emoji', '📋', 'description', 'Workflow analytics, feedback, bottlenecks'),
    jsonb_build_object('key', 'improvement_backlog_engine', 'label', 'Improvement backlog', 'emoji', '🏆', 'description', 'Structured optimization initiative queue'),
    jsonb_build_object('key', 'impact_estimation_engine', 'label', 'Impact estimation engine', 'emoji', '🔗', 'description', 'Time, cost, productivity, quality estimates'),
    jsonb_build_object('key', 'companion', 'label', 'Improvement Companion', 'emoji', '✨', 'description', 'Supports — does not replace human improvement judgment'),
    jsonb_build_object('key', 'before_after_analysis_engine', 'label', 'Before vs after analysis', 'emoji', '📊', 'description', 'Measurable outcome comparison'),
    jsonb_build_object('key', 'improvement_controls_dashboard', 'label', 'Improvement controls dashboard', 'emoji', '🛡️', 'description', 'Prioritization and approval policies'),
    jsonb_build_object('key', 'implementation_tracking_engine', 'label', 'Implementation tracking engine', 'emoji', '🔔', 'description', 'Milestones, blockers, completion percentage')
  ); $$;
create or replace function public._aeciebp259_improvement_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Continuous Improvement Center — ten capabilities. Detect before optimizing.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'improvement_dashboard', 'label', 'Executive Improvement Dashboard'),
    jsonb_build_object('key', 'opportunity_detection', 'label', 'Improvement Opportunity Detection'),
    jsonb_build_object('key', 'improvement_backlog', 'label', 'Improvement Backlog'),
    jsonb_build_object('key', 'impact_estimation', 'label', 'Impact Estimation Engine'),
    jsonb_build_object('key', 'implementation_tracking', 'label', 'Implementation Tracking'),
    jsonb_build_object('key', 'before_after_analysis', 'label', 'Before vs After Analysis'),
    jsonb_build_object('key', 'employee_submissions', 'label', 'Employee Improvement Submissions'),
    jsonb_build_object('key', 'improvement_recommendations', 'label', 'Aipify Improvement Recommendations'),
    jsonb_build_object('key', 'knowledge_retention', 'label', 'Knowledge Retention'),
    jsonb_build_object('key', 'improvement_score', 'label', 'Continuous Improvement Score')
  )); $$;
create or replace function public._aeciebp259_improvement_opportunity_hub() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Improvement opportunity detection — identify optimization areas.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'workflow_analytics', 'label', 'Are workflow inefficiencies being detected?'),
    jsonb_build_object('key', 'bottlenecks', 'label', 'Are operational bottlenecks surfacing opportunities?'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Is every improvement change fully audited?'),
    jsonb_build_object('key', 'impact_visibility', 'label', 'Is expected impact transparent to stakeholders?'),
    jsonb_build_object('key', 'human_approval', 'label', 'How does detection support human approval before implementation?')
  )); $$;
create or replace function public._aeciebp259_improvement_backlog_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Improvement backlog — structured optimization queue.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'efficiency', 'label', 'Efficiency'),
    jsonb_build_object('key', 'cost_reduction', 'label', 'Cost Reduction'),
    jsonb_build_object('key', 'customer_experience', 'label', 'Customer Experience'),
    jsonb_build_object('key', 'quality', 'label', 'Quality Improvement'),
    jsonb_build_object('key', 'risk_reduction', 'label', 'Risk Reduction'),
    jsonb_build_object('key', 'employee_experience', 'label', 'Employee Experience'),
    jsonb_build_object('key', 'automation', 'label', 'Automation Potential'),
    jsonb_build_object('key', 'identified', 'label', 'Identified status'),
    jsonb_build_object('key', 'in_progress', 'label', 'In Progress status'),
    jsonb_build_object('key', 'completed', 'label', 'Completed status')
  )); $$;
create or replace function public._aeciebp259_employee_submissions_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Employee submissions — encourage organization-wide participation.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'submit_ideas', 'label', 'Submit improvement ideas'),
    jsonb_build_object('key', 'vote', 'label', 'Vote on initiatives'),
    jsonb_build_object('key', 'track_outcomes', 'label', 'Track submission outcomes'),
    jsonb_build_object('key', 'recognize', 'label', 'Recognize contributors'),
    jsonb_build_object('key', 'visibility', 'label', 'Configurable organization visibility'),
    jsonb_build_object('key', 'participation', 'label', 'Improvement participation rate')
  )); $$;
create or replace function public._aeciebp259_improvement_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Improvement Companion — supports improvement preparation and never implements changes without human approval or bypasses improvement prioritization.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'quick_wins', 'label', 'Surface quick win opportunities'),
    jsonb_build_object('key', 'strategic', 'label', 'Strategic improvement recommendations'),
    jsonb_build_object('key', 'long_term', 'label', 'Long-term initiative suggestions'),
    jsonb_build_object('key', 'repeated_inefficiencies', 'label', 'Detect repeated inefficiencies'),
    jsonb_build_object('key', 'historical_success', 'label', 'Leverage historical improvement success'),
    jsonb_build_object('key', 'improvement_guardrails', 'label', 'Improvement policies — Trust Architecture enforced')
  )); $$;
create or replace function public._aeciebp259_impact_estimation_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Impact estimation — prioritize improvements.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'time_savings', 'label', 'Time savings'),
    jsonb_build_object('key', 'cost_savings', 'label', 'Cost savings'),
    jsonb_build_object('key', 'productivity', 'label', 'Productivity gains'),
    jsonb_build_object('key', 'quality', 'label', 'Quality improvements'),
    jsonb_build_object('key', 'customer_impact', 'label', 'Customer impact'),
    jsonb_build_object('key', 'confidence', 'label', 'Confidence levels — low, medium, high')
  )); $$;
create or replace function public._aeciebp259_implementation_tracking_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Implementation tracking — monitor initiative progress.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'start_date', 'label', 'Start date'),
    jsonb_build_object('key', 'milestones', 'label', 'Milestones'),
    jsonb_build_object('key', 'responsible_teams', 'label', 'Responsible teams'),
    jsonb_build_object('key', 'dependencies', 'label', 'Dependencies'),
    jsonb_build_object('key', 'completion_pct', 'label', 'Completion percentage'),
    jsonb_build_object('key', 'blockers', 'label', 'Blockers')
  )); $$;
create or replace function public._aeciebp259_before_after_analysis_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Before vs after analysis — demonstrate measurable outcomes.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'cycle_times', 'label', 'Cycle times'),
    jsonb_build_object('key', 'operational_costs', 'label', 'Operational costs'),
    jsonb_build_object('key', 'support_volumes', 'label', 'Support volumes'),
    jsonb_build_object('key', 'productivity', 'label', 'Productivity indicators'),
    jsonb_build_object('key', 'satisfaction', 'label', 'Customer satisfaction metrics'),
    jsonb_build_object('key', 'error_rates', 'label', 'Error rates'),
    jsonb_build_object('key', 'improvement_pct', 'label', 'Improvement percentage')
  )); $$;
create or replace function public._aeciebp259_improvement_controls_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Improvement controls — organizations define prioritization and approval.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'organization_scope', 'label', 'Organization policy scope'),
    jsonb_build_object('key', 'department_scope', 'label', 'Department policy scope'),
    jsonb_build_object('key', 'team_scope', 'label', 'Team policy scope'),
    jsonb_build_object('key', 'approval_required', 'label', 'Mandatory approval for implementation'),
    jsonb_build_object('key', 'impact_threshold', 'label', 'Impact threshold for executive review'),
    jsonb_build_object('key', 'maturity_levels', 'label', 'Score levels — emerging through transformational')
  )); $$;
create or replace function public._aeciebp259_improvement_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Improvement integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'decision_escalation', 'label', 'Decision Escalation Phase 258', 'cross_link', '/app/aipify-enterprise-decision-escalation-governance-engine'),
    jsonb_build_object('key', 'action_orchestration', 'label', 'Action Orchestration Phase 256', 'cross_link', '/app/aipify-enterprise-action-orchestration-engine'),
    jsonb_build_object('key', 'enterprise_analytics', 'label', 'Enterprise Analytics Engine Phase 235', 'cross_link', '/app/aipify-enterprise-analytics-operational-intelligence-engine'),
    jsonb_build_object('key', 'employee_knowledge', 'label', 'Employee Knowledge Engine', 'cross_link', '/app/settings/employee-knowledge'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-cockpit-engine'),
    jsonb_build_object('key', 'resource_capacity', 'label', 'Resource Capacity Engine Phase 209', 'cross_link', '/app/aipify-resource-capacity-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for improvement implementation')
  )); $$;
create or replace function public._aeciebp259_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Implementing changes without approval',
      'Bypassing improvement prioritization',
      'Hiding impact estimates',
      'Replacing owner judgment',
      'Modifying improvement audit trails',
      'Unlogged improvement changes',
      'Ignoring before/after evidence',
      'Override human judgment'), 'principle', 'Improvement Companion supports — users retain improvement judgment control and improvement history stays auditable.'); $$;
create or replace function public._aeciebp259_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm improvement support without pressure.', 'values', jsonb_build_array('detect_before_optimizing','human_approval_before_implementation','measure_before_claiming','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._aeciebp259_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Continuous improvement audit logs via aipify_enterprise_continuous_improvement_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_continuous_improvement permissions — improvement policy RBAC'),
    jsonb_build_object('key', 'approval_gates', 'label', 'Human approval for improvement implementation'),
    jsonb_build_object('key', 'improvement_policies', 'label', 'Organization-defined prioritization boundaries'),
    jsonb_build_object('key', 'knowledge_retention', 'label', 'Lessons learned and outcomes logged'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._aeciebp259_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 259, 'key', 'enterprise_continuous_improvement', 'label', 'Continuous Improvement Phase 259', 'route', '/app/aipify-enterprise-continuous-improvement-engine', 'description', 'Measurable optimization — starts era')
  ); $$;
create or replace function public._aeciebp259_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'decision_escalation', 'label', 'Decision Escalation Phase 258', 'route', '/app/aipify-enterprise-decision-escalation-governance-engine', 'relationship', 'Governance integration — cross-link only'),
    jsonb_build_object('key', 'enterprise_analytics', 'label', 'Enterprise Analytics Engine Phase 235', 'route', '/app/aipify-enterprise-analytics-operational-intelligence-engine', 'relationship', 'Workflow analytics integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Human approval before implementation — cross-link only')
  ); $$;
create or replace function public._aeciebp259_integration_links() returns jsonb language sql stable as $$ select public._aeciebp259_era_opener_summary() || public._aeciebp259_extended_cross_links(); $$;
create or replace function public._aeciebp259_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Continuous Improvement Center internally with improvement-governed backlog and full audit logging. Growth Partner terminology. Improvement Companion supports — never implements changes without human approval or bypasses improvement prioritization.'; $$;
create or replace function public._aeciebp259_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — users retain improvement judgment control.', 'Improvement Companion informs and prepares.', 'Detect before optimizing — human approval before implementation.', 'Growth Partner — never Affiliate.', 'Continuous Optimization Era starts — 259–263.'); $$;
create or replace function public._aeciebp259_privacy_note() returns text language sql immutable as $$
  select 'Continuous Improvement Center metadata only — improvement summaries max ~500 chars. No operational record content beyond RBAC or PII in audit logs.'; $$;
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_enterprise_decision_escalation_governance_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._aedegbebp258_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_improvement_opportunity_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Improvement opportunity — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_improvement_opportunity_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_decision_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Improvement opportunity — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_improvement_opportunity_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_action_queue_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Improvement opportunity — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_improvement_opportunity_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_trend_monitoring_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Improvement opportunity — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_improvement_opportunity_hub()->'reflection_questions') = 5,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_improvement_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Continuous Improvement Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_improvement_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_decision_governance_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Continuous Improvement Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_improvement_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_orchestration_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Continuous Improvement Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_improvement_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_intelligence_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Continuous Improvement Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_improvement_dashboard()->'capabilities') = 10,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 1,`,
  );

  const replaceRpcRef = (sqlText, fn) => {
    if (fn === "improvement_dashboard") {
      return sqlText.replace(/public\._(\w+)_improvement_dashboard\(\)/g, (full, prefix) =>
        prefix.endsWith("improvement") ? full : `public._${P.bp}_improvement_dashboard()`,
      );
    }
    return sqlText.replace(
      new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"),
      `public._${P.bp}_${fn}()`,
    );
  };

  for (const fn of [...SCAFFOLDS, "improvement_companion"].sort((a, b) => b.length - a.length)) {
    sql = replaceRpcRef(sql, fn);
  }

  sql = sql.replace(
    new RegExp(`select '${P.slug}'[^;]+;`, "g"),
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    /select 'aipify-enterprise-decision-escalation-governance-engine'[^;]+;/g,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected enterprise decision escalation and governance guidance within Knowledge Quality Era;",
    "RBAC-protected enterprise continuous improvement guidance within Continuous Optimization Era;",
  );
  sql = sql.replaceAll(
    "RBAC-protected enterprise action orchestration guidance within Knowledge Quality Era;",
    "RBAC-protected enterprise continuous improvement guidance within Continuous Optimization Era;",
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
    /'improvement_improvement_dashboard', public\._\w+_improvement_improvement_dashboard\(\)/,
    `'improvement_controls_dashboard', public._${P.bp}_improvement_controls_dashboard()`,
  );
  sql = sql.replace(
    /'decision_decision_governance_dashboard', public\._\w+_decision_decision_governance_dashboard\(\)/,
    `'improvement_controls_dashboard', public._${P.bp}_improvement_controls_dashboard()`,
  );
  sql = sql.replace(
    /'orchestration_orchestration_dashboard', public\._\w+_orchestration_orchestration_dashboard\(\)/,
    `'improvement_controls_dashboard', public._${P.bp}_improvement_controls_dashboard()`,
  );
  sql = sql.replace(
    /'governance_rules_dashboard', public\._\w+_governance_rules_dashboard\(\)/,
    `'improvement_controls_dashboard', public._${P.bp}_improvement_controls_dashboard()`,
  );
  sql = sql.replace(
    /'policy_controls_dashboard', public\._\w+_policy_controls_dashboard\(\)/,
    `'improvement_controls_dashboard', public._${P.bp}_improvement_controls_dashboard()`,
  );
  sql = sql.replace(
    /'intelligence_controls_dashboard', public\._\w+_intelligence_controls_dashboard\(\)/,
    `'improvement_controls_dashboard', public._${P.bp}_improvement_controls_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_improvement_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_improvement_controls_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_decision_governance_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_improvement_controls_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_orchestration_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_improvement_controls_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_intelligence_controls_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_improvement_controls_dashboard()`,
  );

  return sql;
}

function genMigration() {
  const src258 = path.join(
    ROOT,
    "supabase/migrations/20261418500000_aipify_enterprise_decision_escalation_governance_engine_phase258.sql",
  );
  if (!fs.existsSync(src258)) throw new Error("Phase 258 migration required");
  let m = transformFrom258(fs.readFileSync(src258, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-enterprise-decision-escalation-governance-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(
    path.join(ROOT, `lib/core/${P.slug}.ts`),
    transformFrom258(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")),
  );
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(
      path.join(dst, f),
      transformFrom258(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")),
    );
  }
  const panel = path.join(
    ROOT,
    `components/app/${srcSlug}/AipifyEnterpriseDecisionEscalationGovernanceEngineDashboardPanel.tsx`,
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`),
    transformFrom258(fs.readFileSync(panel, "utf8")),
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/index.ts`),
    `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`,
  );
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom258(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom258(
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

${P.centerTitle} within ${P.era}. **Starts the era.** ${P.companion} supports improvement opportunity detection, improvement backlog, impact estimation, implementation tracking, before vs after analysis, employee submissions, improvement recommendations, knowledge retention, continuous improvement score, and executive improvement dashboard — does NOT implement changes without human approval, bypass improvement prioritization, or omit improvement audit history.

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
Era: ${P.era} (starts)
${P.crossLinkNote}
`,
  );
  write(
    path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
    `# ${P.title} Engine — FAQ (Phase ${P.phase})

## What is the Enterprise Continuous Improvement Engine?

The Enterprise Continuous Improvement Engine helps organizations continuously identify inefficiencies and track optimization initiatives at \`/app/${P.slug}\`.

## What continuous improvement features are included?

Improvement opportunity detection, improvement backlog, impact estimation, implementation tracking, before vs after analysis, employee submissions, Aipify improvement recommendations, knowledge retention, continuous improvement score, and executive improvement dashboard.

## What opportunity categories are supported?

Efficiency, cost reduction, customer experience, quality improvement, risk reduction, employee experience, and automation potential.

## What backlog statuses apply?

Identified, under review, approved, in progress, completed, and archived — with priority levels and suggested owners.

## What does the continuous improvement flow look like?

Aipify detects opportunities → ideas enter backlog → impact estimated → prioritization completed → initiatives approved → implementation tracked → results measured → lessons documented → new opportunities identified.

## Who can access continuous improvement?

Super Admin (full access), Tenant Admin (organization policies), Executives (oversight dashboard), Managers (department initiatives), Staff (submissions and assigned work) — enterprise RBAC.

## Is full audit logging enforced?

**Yes.** Every improvement lifecycle event is logged. Before/after outcomes and lessons learned are recorded.

## How does this integrate with other Aipify surfaces?

${P.crossLinkNote}

## Does the Improvement Companion replace human judgment?

**No.** ${P.companion} detects and recommends — it does **NOT** implement changes without human approval, bypass improvement prioritization, or omit improvement audit history.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Improvement: opportunity detection, backlog, impact estimation, implementation tracking, before/after analysis, employee submissions, recommendations, knowledge retention, improvement score, executive dashboard.
Categories: efficiency, cost reduction, customer experience, quality, risk reduction, employee experience, automation potential.
Backlog statuses: identified, under review, approved, in progress, completed, archived.
Impact confidence: low, medium, high.
Score levels: emerging, developing, mature, advanced, transformational.
Flow: detect → backlog → estimate → prioritize → approve → implement → measure → document → repeat.
Security: improvement policy RBAC, approval gates, audit logging, knowledge retention, enterprise permissions, 2FA.
Design principles: Detect before optimizing, human approval before implementation, measure before claiming success.
Companion limitations: no implementing without approval, no bypassing prioritization, no hiding impact estimates.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate. Era starts 259–263.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never implements changes without human approval, bypasses improvement prioritization, or omits improvement audit history.";
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
      '| "aipifyEnterpriseDecisionEscalationGovernanceEngine"',
      `| "aipifyEnterpriseDecisionEscalationGovernanceEngine"\n  | "${id}"`,
    );
  }
  if (!c.includes(href)) {
    const anchor =
      /id: "aipifyEnterpriseDecisionEscalationGovernanceEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyEnterpriseDecisionEscalationGovernanceEngine",\n  },/;
    c = c.replace(
      anchor,
      (m) =>
        `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-enterprise-decision-escalation-governance-engine")) {\n    return "aipifyEnterpriseDecisionEscalationGovernanceEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-enterprise-decision-escalation-governance-engine")) {\n    return "aipifyEnterpriseDecisionEscalationGovernanceEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace(
        '"aipify_enterprise_decision_escalation_governance.steward",',
        `"aipify_enterprise_decision_escalation_governance.steward",\n    "${perm}",`,
      );
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-enterprise-decision-escalation-governance-engine";',
      `export * from "./aipify-enterprise-decision-escalation-governance-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era} starts. ${P.companion} supports improvement opportunity detection, improvement backlog, impact estimation, implementation tracking, before vs after analysis, employee submissions, improvement recommendations, and knowledge retention. Detect before optimizing — does NOT implement changes without human approval or bypass improvement prioritization. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Continuous improvement score",
    modeLabel: "Mode",
    readinessLabel: "Improvement maturity level",
    executiveReviews: "Executive improvement dashboard",
    activeReflections: "Active continuous improvement scaffolds",
    humanOversightRequired: `Human approval required — users retain improvement judgment control; ${P.companion} supports only`,
    eraOpenerSummary: `Continuous Optimization Era — Phases ${P.eraRange} (starts)`,
    eraOpenerNote:
      "Cross-link only — do not duplicate Decision Escalation Engine, Action Orchestration Engine, Enterprise Analytics, Employee Knowledge Engine, Notification Engine, Executive Cockpit, or Resource Capacity RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Improvement opportunity — detection prompts",
    frameworkLabel: "Improvement backlog engine",
    reviewsLabel: "Improvement controls dashboard",
    companionLabel: `${P.companion} — supports improvement preparation, never replaces human improvement judgment`,
    subEngineLabel: "Impact estimation engine",
    reflections: "Continuous improvement scaffolds",
    executiveReviewEntries: "Improvement backlog entries",
    scaffoldNotes: "Improvement-governed optimization scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT implement changes without human approval, bypass improvement prioritization, or omit improvement audit history`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports enterprise continuous improvement — users retain improvement judgment control and improvement history stays auditable.`,
      philosophy:
        "People First. Improvement-governed backlog. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
      growthEra: `${P.era} — Phase ${P.phase} starts the era.`,
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
        ? "Kontinuerlig forbedring"
        : locale === "sv"
          ? "Kontinuerlig förbättring"
          : locale === "da"
            ? "Løbende forbedring"
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
      'export * from "./implementation-blueprint-phase258-vocabulary";',
      `export * from "./implementation-blueprint-phase258-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE258_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase258-aipify-enterprise-decision-escalation-governance.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE258_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase258-aipify-enterprise-decision-escalation-governance.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_enterprise_decision_escalation_governance.view`, `aipify_enterprise_decision_escalation_governance.manage`, `aipify_enterprise_decision_escalation_governance.steward`.";
  const entry = `\n**Enterprise Continuous Improvement Engine (Phase 259):** See [AIPIFY_ENTERPRISE_CONTINUOUS_IMPROVEMENT_ENGINE_PHASE259.md](./AIPIFY_ENTERPRISE_CONTINUOUS_IMPROVEMENT_ENGINE_PHASE259.md) — Improvement opportunity detection, improvement backlog, impact estimation, implementation tracking, before vs after analysis, employee submissions, Aipify improvement recommendations, knowledge retention, continuous improvement score, and executive improvement dashboard. **Starts** Continuous Optimization Era (259–263). \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** implementing changes without human approval, bypassing improvement prioritization, or omitting improvement audit history. Cross-links only: Decision Escalation & Governance Engine Phase 258, Action Orchestration Engine Phase 256, Enterprise Analytics Engine Phase 235, Enterprise Notification Engine Phase 233, Employee Knowledge Engine, Executive Cockpit Phase 200, Resource Capacity Engine Phase 209, Aipify Translate Phase 238. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 259")) {
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
  console.error(`Phase ${P.phase} docs generated; stack requires Phase 258 artifacts: ${err.message}`);
  process.exitCode = 1;
}
