#!/usr/bin/env node
/** ABOS Phase 258 — Enterprise Decision Escalation & Governance Engine (Knowledge Quality Era 254–258) */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "decision_governance_dashboard",
  "decision_registry_hub",
  "decision_escalation_engine",
  "decision_briefing_packs_engine",
  "multi_option_analysis_engine",
  "decision_deadlines_engine",
  "governance_rules_dashboard",
  "stakeholder_alignment_engine",
  "decision_integration_center",
];

const P = {
  phase: 258,
  migration: "20261418500000_aipify_enterprise_decision_escalation_governance_engine_phase258.sql",
  slug: "aipify-enterprise-decision-escalation-governance-engine",
  base: "AipifyEnterpriseDecisionEscalationGovernance",
  camel: "aipifyEnterpriseDecisionEscalationGovernanceEngine",
  snake: "aipify_enterprise_decision_escalation_governance",
  permPrefix: "aipify_enterprise_decision_escalation_governance",
  helper: "aedegbe",
  bp: "aedegbebp258",
  decisionType: "aipify_enterprise_decision_escalation_governance_engine",
  title: "Enterprise Decision Escalation & Governance",
  centerTitle: "Decision Governance Center",
  companion: "Governance Companion",
  scoreKey: "aipify_enterprise_decision_escalation_governance_score",
  modeKey: "enterprise_decision_escalation_governance_mode",
  levelKey: "enterprise_decision_escalation_governance_maturity_level",
  thirdEntity: "enterprise_decision_escalation_governance_notes",
  era: "Knowledge Quality Era (254–258)",
  eraRange: "254–258",
  docSlug: "AIPIFY_ENTERPRISE_DECISION_ESCALATION_GOVERNANCE_ENGINE",
  ilmFile: "implementation-blueprint-phase258-aipify-enterprise-decision-escalation-governance.txt",
  navLabel: "Decision Escalation",
  crossLinkNote:
    "Cross-links only: Decision Support Engine, Decision Intelligence & Recommendation Engine Phase 251, Enterprise Governance & Policy Automation Engine Phase 253, Action Orchestration Engine Phase 256, Enterprise Notification Engine Phase 233, Executive Cockpit Phase 200, Enterprise Analytics Engine Phase 235, Trust & Action Engine, and Aipify Translate Phase 238 — never bypass governance rules, finalize decisions without human authority, or omit decision audit history.",
  companionLimitations: [
    "finalizing_decisions_without_human_authority",
    "bypassing_governance_rules",
    "hiding_escalation_context",
    "unlogged_decision_changes",
    "replacing_leader_judgment",
    "modifying_decision_audit_trail",
    "ignoring_escalation_deadlines",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom256(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyEnterpriseActionOrchestration", P.base],
    ["aipify-enterprise-action-orchestration-engine", P.slug],
    ["aipify_enterprise_action_orchestration", P.snake],
    ["aipifyEnterpriseActionOrchestrationEngine", P.camel],
    ["aeaoaebp256", P.bp],
    ["_aeaoae_", `_${P.helper}_`],
    ["aipify_enterprise_action_orchestration_score", P.scoreKey],
    ["enterprise_action_orchestration_mode", P.modeKey],
    ["enterprise_action_orchestration_maturity_level", P.levelKey],
    ["enterprise_action_orchestration_notes", P.thirdEntity],
    ["EnterpriseActionOrchestrationNote", thirdPascal],
    ["enterprise_action_orchestration_notes_count", `${P.thirdEntity}_count`],
    ["Action Orchestration Phase 256", "__GOV_PHASE_256__"],
    ["Orchestration Companion", "__GOV_COMPANION__"],
    ["Enterprise Action Orchestration", P.title],
    ["__GOV_COMPANION__", P.companion],
    ["Action Orchestration", "__GOV_CENTER__"],
    ["__GOV_PHASE_256__", "Action Orchestration Phase 256"],
    ["Phase 256", `Phase ${P.phase}`],
    ["aipify_enterprise_action_orchestration.view", `${P.permPrefix}.view`],
    ["aipify_enterprise_action_orchestration.manage", `${P.permPrefix}.manage`],
    ["aipify_enterprise_action_orchestration.steward", `${P.permPrefix}.steward`],
    ["aipify_enterprise_action_orchestration_engine", P.decisionType],
    [
      "20261418300000_aipify_enterprise_action_orchestration_engine_phase256.sql",
      P.migration,
    ],
    ["Repo Phase 256", `Repo Phase ${P.phase}`],
    ["Phase 256 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE256_AIPIFY_ENTERPRISE_ACTION_ORCHESTRATION_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase256", `implementation-blueprint-phase${P.phase}`],
    ["policy_controls_dashboard", SCAFFOLDS[6]],
    ["orchestration_dashboard", SCAFFOLDS[0]],
    ["action_queue_hub", SCAFFOLDS[1]],
    ["action_plans_engine", SCAFFOLDS[2]],
    ["approval_engine", SCAFFOLDS[3]],
    ["execution_tracking_engine", SCAFFOLDS[4]],
    ["rollback_framework_engine", SCAFFOLDS[5]],
    ["cross_system_orchestration_engine", SCAFFOLDS[7]],
    ["orchestration_integration_center", SCAFFOLDS[8]],
    ["orchestration_companion", "governance_companion"],
    [
      "_seed_enterprise_action_orchestration_notes",
      `_seed_${P.thirdEntity.replace("_notes", "")}_notes`,
    ],
    ["action orchestration stewardship", "decision governance stewardship"],
    ["policy-informed orchestration support", "governance-informed decision support"],
    ["approval-first orchestration culture", "accountability-first governance culture"],
    ["active orchestration programs", "active decision governance programs"],
    ["actions requiring executive attention", "decisions requiring executive attention"],
    ["Action Queue", "Decision Registry"],
    ["Action Plans Engine", "Decision Escalation Engine"],
    ["Approval Engine", "Decision Briefing Packs Engine"],
    ["Execution Tracking Engine", "Multi-Option Analysis Engine"],
    ["Rollback Framework Engine", "Decision Deadlines Engine"],
    ["Action Policies Dashboard", "Governance Rules Dashboard"],
    ["execution completion indicators", "decision completion indicators"],
    ["action orchestration prompts", "decision escalation prompts"],
    ["orchestration assistant prompts", "governance assistant prompts"],
    ["cross-system orchestration", "stakeholder alignment"],
    ["stakeholder notification signals", "escalation alert signals"],
    ["RBAC-protected action policies", "RBAC-protected governance rules"],
    ["Suggest before acting", "Recommend before deciding"],
    ["Human approval before risk", "Human authority before finalization"],
    ["Audit before automation", "Context before escalation"],
    ["no_bypassing_action_policies", "no_bypassing_governance_rules"],
    ["AIPIFY_ENTERPRISE_ACTION_ORCHESTRATION_ENGINE", P.docSlug],
    ["enterprise action orchestration", "enterprise decision escalation and governance"],
    ["Action orchestration audit logs", "Decision governance audit logs"],
    ["action policy RBAC", "governance rule RBAC"],
    ["action orchestration scaffolds", "decision governance scaffolds"],
    ["organization action policies", "organization governance rules"],
    ["Orchestration readiness score", "Governance readiness score"],
    ["Orchestration maturity level", "Governance maturity level"],
    ["Action queue entries", "Decision registry entries"],
    ["action policy stewardship", "governance rule stewardship"],
    ["action records beyond RBAC", "decision records beyond RBAC"],
    ["execution tracking assistance", "deadline tracking assistance"],
    ["manager department action visibility", "manager department decision visibility"],
    [
      "Trust & Action Engine, Action Center Phase 205, Decision Intelligence & Recommendation Engine Phase 251, Enterprise Governance & Policy Automation Engine Phase 253, Enterprise Notification Engine Phase 233, Autonomous Execution Framework, Executive Cockpit Phase 200, Enterprise Analytics Engine Phase 235, and Aipify Translate Phase 238",
      "Decision Support Engine, Decision Intelligence & Recommendation Engine Phase 251, Enterprise Governance & Policy Automation Engine Phase 253, Action Orchestration Engine Phase 256, Enterprise Notification Engine Phase 233, Executive Cockpit Phase 200, Enterprise Analytics Engine Phase 235, Trust & Action Engine, and Aipify Translate Phase 238",
    ],
    [
      "Never bypass action policies or execute medium/high-risk actions without approval",
      "Never bypass governance rules or finalize decisions without human authority",
    ],
    ["orchestration programs", "governance programs"],
    ["Orchestration programs", "Governance programs"],
    ["high-risk action routing", "high-risk decision routing"],
    ["executes actions without policy approval", "finalizes decisions without governance approval"],
    ["Unauthorized action execution without approval", "Unauthorized decision finalization without authority"],
    ["Modifying action audit trails", "Modifying decision audit trails"],
    ["Speed before safety", "Haste before context"],
    ["user approval judgment control", "user decision judgment control"],
    ["User approval judgment control", "User decision judgment control"],
    ["action decisions and automation policies", "decision outcomes and governance rules"],
    ["action queue visibility", "decision registry visibility"],
    [
      "enable organizations to safely transform recommendations into approved actions across connected systems — maintaining action policies, human approval for medium/high-risk actions, full audit logging, role-based permissions, and reversible actions where possible",
      "enable organizations to elevate important decisions to the correct stakeholders with complete context, structured recommendations, and clear accountability — maintaining governance rules, human authority for finalization, full audit logging, role-based permissions, and institutional decision history",
    ],
    [
      "approval turnaround time decreases, execution completion rates improve, automation adoption increases, manual coordination effort reduces, rollback confidence improves, and organizational trust in orchestration increases with suggest before acting",
      "decision delays decrease, governance compliance improves, executive response times accelerate, transparency increases, escalation confusion reduces, and institutional knowledge improves with recommend before deciding",
    ],
    ["Continues the era.", "Completes the era."],
    ["continues the era", "completes the era"],
    ["Knowledge Quality Era continues", "Knowledge Quality Era completes"],
    ["__GOV_CENTER__", P.centerTitle],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports enterprise decision escalation and governance — NOT finalizing decisions without human authority, bypassing governance rules, or omitting decision audit history. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Ensure important decisions are elevated to the correct stakeholders with complete context, structured recommendations, and clear accountability — ${P.companion} recommends, humans decide.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Knowledge Quality Era (${P.eraRange}). Human authority for finalization; governance-governed escalation; full audit logging; ${P.companion} informs and prepares. Completes the era.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations reduce decision delays, improve governance compliance, accelerate executive response times, increase transparency, reduce escalation confusion, and strengthen institutional knowledge with recommend before deciding.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Ten decision governance modules'),
    jsonb_build_object('key', 'decision_registry_hub', 'label', 'Decision registry', 'emoji', '📋', 'description', 'Centralized significant decision records'),
    jsonb_build_object('key', 'decision_escalation_engine', 'label', 'Decision escalation engine', 'emoji', '🏆', 'description', 'Route decisions to appropriate authority'),
    jsonb_build_object('key', 'decision_briefing_packs_engine', 'label', 'Decision briefing packs', 'emoji', '🔗', 'description', 'Context, metrics, risks, and recommendations'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not replace human decision judgment'),
    jsonb_build_object('key', 'decision_deadlines_engine', 'label', 'Decision deadlines engine', 'emoji', '📊', 'description', 'On track, due soon, overdue, escalated'),
    jsonb_build_object('key', 'governance_rules_dashboard', 'label', 'Governance rules dashboard', 'emoji', '🛡️', 'description', 'Escalation thresholds and policy scope'),
    jsonb_build_object('key', 'multi_option_analysis_engine', 'label', 'Multi-option analysis engine', 'emoji', '🔔', 'description', 'Benefits, drawbacks, effort, cost, risks')
  ); ${D};
create or replace function public._${bp}_decision_governance_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — ten capabilities. Recommend before deciding.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'decision_governance_dashboard', 'label', 'Executive Decision Dashboard'),
    jsonb_build_object('key', 'decision_registry', 'label', 'Decision Registry'),
    jsonb_build_object('key', 'decision_escalation', 'label', 'Decision Escalation Engine'),
    jsonb_build_object('key', 'decision_briefing_packs', 'label', 'Decision Briefing Packs'),
    jsonb_build_object('key', 'multi_option_analysis', 'label', 'Multi-Option Analysis'),
    jsonb_build_object('key', 'decision_deadlines', 'label', 'Decision Deadlines'),
    jsonb_build_object('key', 'governance_rules', 'label', 'Governance Rules Engine'),
    jsonb_build_object('key', 'stakeholder_alignment', 'label', 'Stakeholder Alignment View'),
    jsonb_build_object('key', 'decision_recommendations', 'label', 'Aipify Decision Recommendations'),
    jsonb_build_object('key', 'decision_history', 'label', 'Decision History & Analytics')
  )); ${D};
create or replace function public._${bp}_decision_registry_hub() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Decision registry — centralized significant decision records.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'governance_rules', 'label', 'Do decisions follow organization governance rules?'),
    jsonb_build_object('key', 'escalation_paths', 'label', 'Are high-impact decisions routed to correct authority?'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Is every decision change fully audited?'),
    jsonb_build_object('key', 'context_visibility', 'label', 'Is decision context transparent to stakeholders?'),
    jsonb_build_object('key', 'human_authority', 'label', 'How does the registry support human authority before finalization?')
  )); ${D};
create or replace function public._${bp}_decision_escalation_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Decision escalation — route to appropriate authority.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'financial_impact', 'label', 'Financial impact'),
    jsonb_build_object('key', 'risk_level', 'label', 'Risk level'),
    jsonb_build_object('key', 'regulatory', 'label', 'Regulatory implications'),
    jsonb_build_object('key', 'customer_impact', 'label', 'Customer impact'),
    jsonb_build_object('key', 'cross_department', 'label', 'Cross-department involvement'),
    jsonb_build_object('key', 'strategic_significance', 'label', 'Strategic significance'),
    jsonb_build_object('key', 'team_lead', 'label', 'Team Lead escalation'),
    jsonb_build_object('key', 'department_head', 'label', 'Department Head escalation'),
    jsonb_build_object('key', 'executive', 'label', 'Executive Leadership escalation'),
    jsonb_build_object('key', 'board', 'label', 'Board / Governance Committee escalation')
  )); ${D};
create or replace function public._${bp}_stakeholder_alignment_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Stakeholder alignment — decision ownership visibility.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'decision_owner', 'label', 'Decision owner'),
    jsonb_build_object('key', 'required_approvers', 'label', 'Required approvers'),
    jsonb_build_object('key', 'consulted_parties', 'label', 'Consulted parties'),
    jsonb_build_object('key', 'informed_parties', 'label', 'Informed parties'),
    jsonb_build_object('key', 'outstanding_responses', 'label', 'Outstanding responses'),
    jsonb_build_object('key', 'accountability', 'label', 'Clear accountability indicators'),
    jsonb_build_object('key', 'alignment_view', 'label', 'Stakeholder alignment view')
  )); ${D};
create or replace function public._${bp}_governance_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports decision preparation and never finalizes decisions without human authority or bypasses governance rules.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'trade_offs', 'label', 'Highlight trade-offs'),
    jsonb_build_object('key', 'historical_decisions', 'label', 'Surface relevant historical decisions'),
    jsonb_build_object('key', 'overlooked_risks', 'label', 'Identify overlooked risks'),
    jsonb_build_object('key', 'stakeholder_suggestions', 'label', 'Suggest additional stakeholders'),
    jsonb_build_object('key', 'escalation_paths', 'label', 'Recommend escalation paths'),
    jsonb_build_object('key', 'governance_guardrails', 'label', 'Governance rules — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_decision_briefing_packs_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Decision briefing packs — everything leaders need.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'situation_summary', 'label', 'Situation summary'),
    jsonb_build_object('key', 'background_context', 'label', 'Background context'),
    jsonb_build_object('key', 'relevant_metrics', 'label', 'Relevant metrics'),
    jsonb_build_object('key', 'risks_identified', 'label', 'Risks identified'),
    jsonb_build_object('key', 'alternative_options', 'label', 'Alternative options'),
    jsonb_build_object('key', 'aipify_recommendation', 'label', 'Aipify recommendation — humans decide')
  )); ${D};
create or replace function public._${bp}_multi_option_analysis_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Multi-option analysis — structured alternatives.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'benefits', 'label', 'Benefits'),
    jsonb_build_object('key', 'drawbacks', 'label', 'Drawbacks'),
    jsonb_build_object('key', 'estimated_effort', 'label', 'Estimated effort'),
    jsonb_build_object('key', 'estimated_cost', 'label', 'Estimated cost'),
    jsonb_build_object('key', 'dependencies', 'label', 'Dependencies'),
    jsonb_build_object('key', 'risk_profile', 'label', 'Risk profile'),
    jsonb_build_object('key', 'long_term', 'label', 'Long-term implications')
  )); ${D};
create or replace function public._${bp}_decision_deadlines_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Decision deadlines — prevent decision paralysis.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'on_track', 'label', 'On Track'),
    jsonb_build_object('key', 'due_soon', 'label', 'Due Soon'),
    jsonb_build_object('key', 'overdue', 'label', 'Overdue'),
    jsonb_build_object('key', 'escalated', 'label', 'Escalated'),
    jsonb_build_object('key', 'required_date', 'label', 'Required decision date'),
    jsonb_build_object('key', 'reminder_intervals', 'label', 'Reminder intervals'),
    jsonb_build_object('key', 'missed_alerts', 'label', 'Missed decision alerts')
  )); ${D};
create or replace function public._${bp}_governance_rules_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Governance rules — organizations define escalation requirements.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'organization_scope', 'label', 'Organization policy scope'),
    jsonb_build_object('key', 'department_scope', 'label', 'Department policy scope'),
    jsonb_build_object('key', 'region_scope', 'label', 'Region policy scope'),
    jsonb_build_object('key', 'expenditure_threshold', 'label', 'Expenditure above threshold requires executive approval'),
    jsonb_build_object('key', 'security_incidents', 'label', 'Security incidents escalate immediately'),
    jsonb_build_object('key', 'vendor_contracts', 'label', 'Vendor contracts require procurement oversight')
  )); ${D};
create or replace function public._${bp}_decision_integration_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Decision integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'decision_support', 'label', 'Decision Support Engine', 'cross_link', '/app/assistant/decisions'),
    jsonb_build_object('key', 'decision_intelligence', 'label', 'Decision Intelligence Engine Phase 251', 'cross_link', '/app/aipify-decision-intelligence-recommendation-engine'),
    jsonb_build_object('key', 'governance_policy', 'label', 'Governance & Policy Automation Phase 253', 'cross_link', '/app/aipify-enterprise-governance-policy-automation-engine'),
    jsonb_build_object('key', 'action_orchestration', 'label', 'Action Orchestration Phase 256', 'cross_link', '/app/aipify-enterprise-action-orchestration-engine'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-cockpit-engine'),
    jsonb_build_object('key', 'approvals', 'label', 'Trust & Action Approvals', 'cross_link', '/app/approvals'),
    jsonb_build_object('key', 'human_authority_gates', 'label', 'Human authority gates for decision finalization')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Finalizing decisions without human authority',
      'Bypassing governance rules',
      'Hiding escalation context',
      'Replacing leader judgment',
      'Modifying decision audit trails',
      'Unlogged decision changes',
      'Ignoring escalation deadlines',
      'Override human judgment'), 'principle', '${P.companion} supports — users retain decision judgment control and decision history stays auditable.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm governance support without pressure.', 'values', jsonb_build_array('recommend_before_deciding','human_authority_before_finalization','context_before_escalation','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Decision governance audit logs via aipify_enterprise_decision_escalation_governance_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_decision_escalation_governance permissions — governance rule RBAC'),
    jsonb_build_object('key', 'authority_gates', 'label', 'Human authority for decision finalization'),
    jsonb_build_object('key', 'governance_rules', 'label', 'Organization-defined escalation requirements'),
    jsonb_build_object('key', 'decision_history', 'label', 'Decision outcome and history logged'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 254, 'key', 'enterprise_knowledge_validation_quality_assurance', 'label', 'Knowledge Validation & Quality Phase 254', 'route', '/app/aipify-enterprise-knowledge-validation-quality-assurance-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 255, 'key', 'enterprise_external_intelligence_market_awareness', 'label', 'External Intelligence Phase 255', 'route', '/app/aipify-enterprise-external-intelligence-market-awareness-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 256, 'key', 'enterprise_action_orchestration', 'label', 'Action Orchestration Phase 256', 'route', '/app/aipify-enterprise-action-orchestration-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 257, 'key', 'enterprise_capacity_workload_balancing', 'label', 'Capacity & Workload Phase 257', 'route', '/app/aipify-enterprise-capacity-workload-balancing-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 258, 'key', 'enterprise_decision_escalation_governance', 'label', 'Decision Escalation Phase 258', 'route', '/app/${P.slug}', 'description', 'Human-authority decision governance — completes era')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'decision_support', 'label', 'Decision Support Engine', 'route', '/app/assistant/decisions', 'relationship', 'Decision support integration — cross-link only'),
    jsonb_build_object('key', 'decision_intelligence', 'label', 'Decision Intelligence Engine Phase 251', 'route', '/app/aipify-decision-intelligence-recommendation-engine', 'relationship', 'Recommendation flow integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Human authority before finalization — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with governance-governed decision registry and full audit logging. Growth Partner terminology. ${P.companion} supports — never finalizes decisions without human authority or bypasses governance rules.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — users retain decision judgment control.', '${P.companion} informs and prepares.', 'Recommend before deciding — human authority before finalization.', 'Growth Partner — never Affiliate.', 'Knowledge Quality Era completes — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — decision summaries max ~500 chars. No operational record content beyond RBAC or PII in audit logs.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_enterprise_action_orchestration_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._aeaoaebp256_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_decision_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Decision registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_decision_registry_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_action_queue_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Decision registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_decision_registry_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_trend_monitoring_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Decision registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_decision_registry_hub()->'reflection_questions') = 5,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_decision_governance_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Decision Governance Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_decision_governance_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_orchestration_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Decision Governance Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_decision_governance_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_intelligence_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Decision Governance Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_decision_governance_dashboard()->'capabilities') = 10,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 5,`,
  );

  const replaceRpcRef = (sqlText, fn) => {
    if (fn === "decision_governance_dashboard") {
      return sqlText.replace(/public\._(\w+)_decision_governance_dashboard\(\)/g, (full, prefix) =>
        prefix.endsWith("decision") ? full : `public._${P.bp}_decision_governance_dashboard()`,
      );
    }
    return sqlText.replace(
      new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"),
      `public._${P.bp}_${fn}()`,
    );
  };

  for (const fn of [...SCAFFOLDS, "governance_companion"].sort((a, b) => b.length - a.length)) {
    sql = replaceRpcRef(sql, fn);
  }

  sql = sql.replace(
    new RegExp(`select '${P.slug}'[^;]+;`, "g"),
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    /select 'aipify-enterprise-action-orchestration-engine'[^;]+;/g,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected enterprise action orchestration guidance within Knowledge Quality Era;",
    "RBAC-protected enterprise decision escalation and governance guidance within Knowledge Quality Era;",
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
    /'decision_decision_governance_dashboard', public\._\w+_decision_decision_governance_dashboard\(\)/,
    `'governance_rules_dashboard', public._${P.bp}_governance_rules_dashboard()`,
  );
  sql = sql.replace(
    /'orchestration_orchestration_dashboard', public\._\w+_orchestration_orchestration_dashboard\(\)/,
    `'governance_rules_dashboard', public._${P.bp}_governance_rules_dashboard()`,
  );
  sql = sql.replace(
    /'policy_controls_dashboard', public\._\w+_policy_controls_dashboard\(\)/,
    `'governance_rules_dashboard', public._${P.bp}_governance_rules_dashboard()`,
  );
  sql = sql.replace(
    /'intelligence_controls_dashboard', public\._\w+_intelligence_controls_dashboard\(\)/,
    `'governance_rules_dashboard', public._${P.bp}_governance_rules_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_decision_governance_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_governance_rules_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_orchestration_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_governance_rules_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_intelligence_controls_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_governance_rules_dashboard()`,
  );

  return sql;
}

function genMigration() {
  const src256 = path.join(
    ROOT,
    "supabase/migrations/20261418300000_aipify_enterprise_action_orchestration_engine_phase256.sql",
  );
  if (!fs.existsSync(src256)) throw new Error("Phase 256 migration required");
  let m = transformFrom256(fs.readFileSync(src256, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-enterprise-action-orchestration-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(
    path.join(ROOT, `lib/core/${P.slug}.ts`),
    transformFrom256(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")),
  );
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(
      path.join(dst, f),
      transformFrom256(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")),
    );
  }
  const panel = path.join(
    ROOT,
    `components/app/${srcSlug}/AipifyEnterpriseActionOrchestrationEngineDashboardPanel.tsx`,
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`),
    transformFrom256(fs.readFileSync(panel, "utf8")),
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/index.ts`),
    `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`,
  );
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom256(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom256(
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

${P.centerTitle} within ${P.era}. **Completes the era.** ${P.companion} supports decision registry, decision escalation, decision briefing packs, multi-option analysis, decision deadlines, governance rules, stakeholder alignment, decision recommendations, decision history, and executive decision dashboard — does NOT finalize decisions without human authority, bypass governance rules, or omit decision audit history.

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
Era: ${P.era} (completes)
${P.crossLinkNote}
`,
  );
  write(
    path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
    `# ${P.title} Engine — FAQ (Phase ${P.phase})

## What is the Enterprise Decision Escalation & Governance Engine?

The Enterprise Decision Escalation & Governance Engine helps organizations elevate important decisions to the correct stakeholders at \`/app/${P.slug}\`.

## What decision governance features are included?

Decision registry, decision escalation engine, decision briefing packs, multi-option analysis, decision deadlines, governance rules engine, stakeholder alignment view, Aipify decision recommendations, decision history, and executive decision dashboard.

## What decision categories are supported?

Operational, financial, strategic, compliance, technology, customer experience, human resources, and security.

## What escalation levels apply?

Team Lead, Department Head, Executive Leadership, and Board / Governance Committee — based on financial impact, risk level, regulatory implications, customer impact, cross-department involvement, and strategic significance.

## What does the decision escalation flow look like?

Issue identified → decision need recognized → governance rules evaluated → stakeholders assigned → decision briefing generated → review and discussion → decision finalized → outcome documented → lessons captured.

## Who can access decision governance?

Super Admin (full access), Tenant Admin (organization governance rules), Executives (oversight dashboard), Managers (department escalations), Staff (assigned decisions) — enterprise RBAC.

## Is full audit logging enforced?

**Yes.** Every decision lifecycle event is logged. Outcomes and alternatives are recorded. Governance rules define escalation requirements.

## How does this integrate with other Aipify surfaces?

${P.crossLinkNote}

## Does the Governance Companion replace human judgment?

**No.** ${P.companion} recommends and prepares — it does **NOT** finalize decisions without human authority, bypass governance rules, or omit decision audit history.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Governance: decision registry, decision escalation, decision briefing packs, multi-option analysis, decision deadlines, governance rules, stakeholder alignment, decision recommendations, decision history, executive dashboard.
Categories: operational, financial, strategic, compliance, technology, customer experience, human resources, security.
Escalation: team lead, department head, executive leadership, board/governance committee.
Deadline states: on track, due soon, overdue, escalated.
Rules: organization, department, region scope; expenditure threshold; security incidents; vendor contracts.
Flow: issue → recognize need → evaluate rules → assign stakeholders → briefing → review → finalize → document → lessons.
Security: governance rule RBAC, authority gates, audit logging, decision history, enterprise permissions, 2FA.
Design principles: Recommend before deciding, human authority before finalization, context before escalation.
Companion limitations: no finalizing without authority, no bypassing rules, no hiding context.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate. Era completes 254–258.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never finalizes decisions without human authority, bypasses governance rules, or omits decision audit history.";
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
      '| "aipifyEnterpriseActionOrchestrationEngine"',
      `| "aipifyEnterpriseActionOrchestrationEngine"\n  | "${id}"`,
    );
  }
  if (!c.includes(href)) {
    const anchor =
      /id: "aipifyEnterpriseActionOrchestrationEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyEnterpriseActionOrchestrationEngine",\n  },/;
    c = c.replace(
      anchor,
      (m) =>
        `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-enterprise-action-orchestration-engine")) {\n    return "aipifyEnterpriseActionOrchestrationEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-enterprise-action-orchestration-engine")) {\n    return "aipifyEnterpriseActionOrchestrationEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace(
        '"aipify_enterprise_action_orchestration.steward",',
        `"aipify_enterprise_action_orchestration.steward",\n    "${perm}",`,
      );
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-enterprise-action-orchestration-engine";',
      `export * from "./aipify-enterprise-action-orchestration-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era} completes. ${P.companion} supports decision registry, decision escalation, decision briefing packs, multi-option analysis, decision deadlines, governance rules, stakeholder alignment, decision recommendations, and decision history. Recommend before deciding — does NOT finalize decisions without human authority or bypass governance rules. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Governance readiness score",
    modeLabel: "Mode",
    readinessLabel: "Governance maturity level",
    executiveReviews: "Executive decision dashboard",
    activeReflections: "Active decision governance scaffolds",
    humanOversightRequired: `Human authority required — users retain decision judgment control; ${P.companion} supports only`,
    eraOpenerSummary: `Knowledge Quality Era — Phases ${P.eraRange} (completes)`,
    eraOpenerNote:
      "Cross-link only — do not duplicate Decision Support Engine, Decision Intelligence Engine, Governance Engine, Action Orchestration Engine, Notification Engine, Executive Cockpit, or Trust & Action RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Decision registry — escalation prompts",
    frameworkLabel: "Decision escalation engine",
    reviewsLabel: "Governance rules dashboard",
    companionLabel: `${P.companion} — supports decision preparation, never replaces human decision judgment`,
    subEngineLabel: "Decision briefing packs engine",
    reflections: "Decision governance scaffolds",
    executiveReviewEntries: "Decision registry entries",
    scaffoldNotes: "Governance-governed decision escalation scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT finalize decisions without human authority, bypass governance rules, or omit decision audit history`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports enterprise decision escalation and governance — users retain decision judgment control and decision history stays auditable.`,
      philosophy:
        "People First. Governance-governed decision registry. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
      growthEra: `${P.era} — Phase ${P.phase} completes the era.`,
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
        ? "Beslutningseskalering"
        : locale === "sv"
          ? "Beslutseskalering"
          : locale === "da"
            ? "Beslutningseskalering"
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
      'export * from "./implementation-blueprint-phase256-vocabulary";',
      `export * from "./implementation-blueprint-phase256-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE256_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase256-aipify-enterprise-action-orchestration.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE256_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase256-aipify-enterprise-action-orchestration.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_enterprise_action_orchestration.view`, `aipify_enterprise_action_orchestration.manage`, `aipify_enterprise_action_orchestration.steward`.";
  const entry = `\n**Enterprise Decision Escalation & Governance Engine (Phase 258):** See [AIPIFY_ENTERPRISE_DECISION_ESCALATION_GOVERNANCE_ENGINE_PHASE258.md](./AIPIFY_ENTERPRISE_DECISION_ESCALATION_GOVERNANCE_ENGINE_PHASE258.md) — Decision registry, decision escalation engine, decision briefing packs, multi-option analysis, decision deadlines, governance rules engine, stakeholder alignment view, Aipify decision recommendations, decision history, and executive decision dashboard. **Completes** Knowledge Quality Era (254–258). \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** finalizing decisions without human authority, bypassing governance rules, or omitting decision audit history. Cross-links only: Decision Support Engine, Decision Intelligence & Recommendation Engine Phase 251, Enterprise Governance & Policy Automation Engine Phase 253, Action Orchestration Engine Phase 256, Enterprise Notification Engine Phase 233, Executive Cockpit Phase 200, Enterprise Analytics Engine Phase 235, Trust & Action Engine, Aipify Translate Phase 238. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 258")) {
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
  console.error(`Phase ${P.phase} docs generated; stack requires Phase 256 artifacts: ${err.message}`);
  process.exitCode = 1;
}
