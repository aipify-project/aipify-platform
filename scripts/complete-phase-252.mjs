#!/usr/bin/env node
/** ABOS Phase 252 — Enterprise Action Prioritization & Focus Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "priority_dashboard",
  "focus_views_hub",
  "priority_levels_engine",
  "action_scoring_engine",
  "escalation_tracking_engine",
  "priority_analytics_engine",
  "focus_governance_dashboard",
  "focus_planning_engine",
  "focus_integration_center",
];

const P = {
  phase: 252,
  migration: "20261414000000_aipify_enterprise_action_prioritization_focus_engine_phase252.sql",
  slug: "aipify-enterprise-action-prioritization-focus-engine",
  base: "AipifyEnterpriseActionPrioritizationFocus",
  camel: "aipifyEnterpriseActionPrioritizationFocusEngine",
  snake: "aipify_enterprise_action_prioritization_focus",
  permPrefix: "aipify_enterprise_action_prioritization_focus",
  helper: "eaapfe",
  bp: "eaapfebp252",
  decisionType: "aipify_enterprise_action_prioritization_focus_engine",
  title: "Enterprise Action Prioritization & Focus",
  centerTitle: "Priority & Focus",
  companion: "Focus Companion",
  scoreKey: "aipify_enterprise_action_prioritization_focus_score",
  modeKey: "enterprise_action_prioritization_focus_mode",
  levelKey: "enterprise_action_prioritization_focus_maturity_level",
  thirdEntity: "enterprise_action_prioritization_focus_notes",
  era: "Workforce Planning Era (249–253)",
  eraRange: "249–253",
  docSlug: "AIPIFY_ENTERPRISE_ACTION_PRIORITIZATION_FOCUS_ENGINE",
  ilmFile: "implementation-blueprint-phase252-aipify-enterprise-action-prioritization-focus.txt",
  navLabel: "Priority & Focus",
  crossLinkNote:
    "Cross-links only: Action Center Phase 205, Decision Intelligence & Recommendation Engine Phase 251, Executive Cockpit Phase 200, Organizational Goals & Alignment Engine Phase 248, Project Portfolio & Strategic Execution Engine Phase 250, Enterprise Analytics Engine Phase 235, Enterprise Notification Engine Phase 233, Calendar Assistant Engine, and Aipify Translate Phase 238 — never bypass priority RBAC, expose sensitive actions without authorization, or expose protected priority data beyond prioritization policies.",
  companionLimitations: [
    "bypassing_priority_rbac",
    "exposing_sensitive_actions_without_rbac",
    "exposing_protected_priority_data_beyond_rbac",
    "unlogged_prioritization_policy_changes",
    "replacing_human_focus_judgment",
    "modifying_focus_audit_trail",
    "ignoring_prioritization_policies",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom251(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyDecisionIntelligenceRecommendation", P.base],
    ["aipify-decision-intelligence-recommendation-engine", P.slug],
    ["aipify_decision_intelligence_recommendation", P.snake],
    ["aipifyDecisionIntelligenceRecommendationEngine", P.camel],
    ["adirebp251", P.bp],
    ["_adire_", `_${P.helper}_`],
    ["aipify_decision_intelligence_recommendation_score", P.scoreKey],
    ["decision_intelligence_recommendation_mode", P.modeKey],
    ["decision_intelligence_recommendation_maturity_level", P.levelKey],
    ["decision_intelligence_recommendation_notes", P.thirdEntity],
    ["DecisionIntelligenceRecommendationNote", thirdPascal],
    ["decision_intelligence_recommendation_notes_count", `${P.thirdEntity}_count`],
    ["Decision Intelligence Phase 251", "__DECISION_PHASE_251__"],
    ["Decision Intelligence Companion", "__FOCUS_COMPANION__"],
    ["Decision Intelligence & Recommendation", P.title],
    ["__FOCUS_COMPANION__", P.companion],
    ["Decision Intelligence", "__FOCUS_CENTER__"],
    ["__DECISION_PHASE_251__", "Decision Intelligence Phase 251"],
    ["Phase 251", `Phase ${P.phase}`],
    ["aipify_decision_intelligence_recommendation.view", `${P.permPrefix}.view`],
    ["aipify_decision_intelligence_recommendation.manage", `${P.permPrefix}.manage`],
    ["aipify_decision_intelligence_recommendation.steward", `${P.permPrefix}.steward`],
    ["aipify_decision_intelligence_recommendation_engine", P.decisionType],
    [
      "20261413000000_aipify_decision_intelligence_recommendation_engine_phase251.sql",
      P.migration,
    ],
    ["Repo Phase 251", `Repo Phase ${P.phase}`],
    ["Phase 251 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE251_AIPIFY_DECISION_INTELLIGENCE_RECOMMENDATION_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase251", `implementation-blueprint-phase${P.phase}`],
    ["decision_dashboard", SCAFFOLDS[0]],
    ["decision_request_hub", SCAFFOLDS[1]],
    ["decision_types_engine", SCAFFOLDS[2]],
    ["recommendation_workflows_engine", SCAFFOLDS[3]],
    ["decision_history_engine", SCAFFOLDS[4]],
    ["decision_analytics_engine", SCAFFOLDS[5]],
    ["decision_governance_dashboard", SCAFFOLDS[6]],
    ["decision_knowledge_archive_engine", SCAFFOLDS[7]],
    ["decision_integration_center", SCAFFOLDS[8]],
    ["decision_intelligence_companion", "focus_companion"],
    [
      "_seed_decision_intelligence_recommendation_notes",
      `_seed_${P.thirdEntity.replace("_notes", "")}_notes`,
    ],
    ["decision intelligence stewardship", "action prioritization focus stewardship"],
    ["recommendation-informed decision support", "focus-informed prioritization support"],
    ["evidence-first decision culture", "focus-first prioritization culture"],
    ["active decision programs", "active priority programs"],
    ["decisions requiring executive attention", "actions requiring executive attention"],
    ["Decision Request Hub", "Focus Views Hub"],
    ["Decision Types Engine", "Priority Levels Engine"],
    ["Recommendation Workflows Engine", "Action Scoring Engine"],
    ["Decision History Engine", "Escalation Tracking Engine"],
    ["Decision Analytics Engine", "Priority Analytics Engine"],
    ["Decision Governance Dashboard", "Focus Governance Dashboard"],
    ["decision impact indicators", "priority completion indicators"],
    ["decision governance prompts", "focus governance prompts"],
    ["decision intelligence assistant prompts", "focus assistant prompts"],
    ["decision approval processes", "daily focus recommendations"],
    ["decision follow-up tracking signals", "escalation tracking signals"],
    ["RBAC-protected decision policies", "RBAC-protected priority policies"],
    ["Evidence before impulse", "Focus before noise"],
    ["Context before conclusion", "Impact before activity"],
    ["Learning before repetition", "Clarity before clutter"],
    ["no_bypassing_decision_rbac", "no_bypassing_priority_rbac"],
    ["AIPIFY_DECISION_INTELLIGENCE_RECOMMENDATION_ENGINE", P.docSlug],
    ["decision intelligence and recommendation", "enterprise action prioritization and focus"],
    ["Decision intelligence recommendation audit logs", "Action prioritization focus audit logs"],
    ["decision RBAC", "priority RBAC"],
    ["decision intelligence scaffolds", "action prioritization focus scaffolds"],
    ["organization decision retention policies", "organization prioritization policies"],
    ["Decision intelligence score", "Priority focus score"],
    ["Decision intelligence maturity level", "Priority focus maturity level"],
    ["Decision ownership entries", "Priority action entries"],
    ["decision intelligence recommendation", "enterprise action prioritization focus"],
    ["decision retention policy stewardship", "prioritization policy stewardship"],
    ["decision records beyond RBAC", "priority data beyond RBAC"],
    ["multi-stakeholder review assistance", "action dependency visualization assistance"],
    ["manager department decision management", "manager department prioritization oversight"],
    [
      "Executive Cockpit Phase 200, Enterprise Analytics Engine Phase 235, Meeting Intelligence & Follow-Up Engine Phase 206, Action Center Phase 205, Project Portfolio & Strategic Execution Engine Phase 250, Organizational Goals & Alignment Engine Phase 248, Enterprise Search Engine, Knowledge Center, Enterprise Notification Engine Phase 233, and Aipify Translate Phase 238",
      "Action Center Phase 205, Decision Intelligence & Recommendation Engine Phase 251, Executive Cockpit Phase 200, Organizational Goals & Alignment Engine Phase 248, Project Portfolio & Strategic Execution Engine Phase 250, Enterprise Analytics Engine Phase 235, Enterprise Notification Engine Phase 233, Calendar Assistant Engine, and Aipify Translate Phase 238",
    ],
    [
      "Never bypass decision RBAC or expose sensitive decisions without authorization",
      "Never bypass priority RBAC or expose sensitive actions without authorization",
    ],
    ["decision programs", "priority programs"],
    ["Decision programs", "Priority programs"],
    ["sensitive decision visibility routing", "sensitive action visibility routing"],
    ["exposes decision records without RBAC approval", "exposes priority data without RBAC approval"],
    [
      "Unauthorized decision access without RBAC approval",
      "Unauthorized focus access without RBAC approval",
    ],
    ["Modifying decision audit trails", "Modifying focus audit trails"],
    ["Impulse before evidence", "Noise before focus"],
    ["user decision judgment control", "user focus judgment control"],
    ["User decision judgment control", "User focus judgment control"],
    ["recommendation decisions and decision retention policies", "prioritization decisions and prioritization policies"],
    ["decision visibility", "action visibility"],
    ["decision governance", "focus governance"],
    [
      "enable organizations to make better decisions through structured recommendations, relevant context and decision support — maintaining decision RBAC, sensitive decision protection, organization-controlled retention policies, and complete audit history",
      "enable organizations to identify, prioritize and execute the most important actions by reducing noise and improving organizational focus — maintaining priority RBAC, sensitive action protection, organization-controlled prioritization policies, and complete audit history",
    ],
    [
      "decision quality improves, decision cycles accelerate, transparency increases, stakeholder alignment strengthens, repeated mistakes reduce, and organizational learning increases with evidence before impulse",
      "high-priority work completion increases, organizational noise reduces, employee focus improves, strategic initiative execution accelerates, missed deadlines reduce, and productivity increases with focus before noise",
    ],
    ["__FOCUS_CENTER__", P.centerTitle],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports enterprise action prioritization and focus — NOT bypassing priority RBAC, exposing sensitive actions without authorization, or exposing protected priority data beyond prioritization policies. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Enable organizations to identify, prioritize and execute the most important actions by reducing noise and improving organizational focus — ${P.companion} informs, humans decide.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Workforce Planning Era (${P.eraRange}). Human-stewarded focus governance; RBAC-protected priority scaffolds; prioritization policy changes logged; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations increase completion of high-priority work, reduce organizational noise, improve employee focus, accelerate strategic initiative execution, reduce missed deadlines, and increase productivity with focus before noise.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Ten focus modules with governance'),
    jsonb_build_object('key', 'focus_views_hub', 'label', 'Focus views hub', 'emoji', '📋', 'description', 'Personal, team, executive views'),
    jsonb_build_object('key', 'priority_levels_engine', 'label', 'Priority levels engine', 'emoji', '🏆', 'description', 'Critical, high, medium, low, informational'),
    jsonb_build_object('key', 'action_scoring_engine', 'label', 'Action scoring engine', 'emoji', '🔗', 'description', 'Impact, urgency, dependencies'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not replace human focus judgment'),
    jsonb_build_object('key', 'priority_analytics_engine', 'label', 'Priority analytics engine', 'emoji', '📊', 'description', 'Completion, noise reduction, productivity'),
    jsonb_build_object('key', 'focus_governance_dashboard', 'label', 'Focus governance dashboard', 'emoji', '🛡️', 'description', 'RBAC and prioritization controls'),
    jsonb_build_object('key', 'escalation_tracking_engine', 'label', 'Escalation tracking engine', 'emoji', '🔔', 'description', 'Escalations, blocked work, overdue')
  ); ${D};
create or replace function public._${bp}_priority_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — ten capabilities. Focus before noise.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'priority_dashboard', 'label', 'Priority Dashboards'),
    jsonb_build_object('key', 'action_scoring', 'label', 'Action Prioritization Scoring'),
    jsonb_build_object('key', 'personal_focus', 'label', 'Personal Focus Views'),
    jsonb_build_object('key', 'team_priority', 'label', 'Team Priority Views'),
    jsonb_build_object('key', 'executive_priority', 'label', 'Executive Priority Dashboards'),
    jsonb_build_object('key', 'initiative_prioritization', 'label', 'Strategic Initiative Prioritization'),
    jsonb_build_object('key', 'daily_recommendations', 'label', 'Daily Focus Recommendations'),
    jsonb_build_object('key', 'weekly_planning', 'label', 'Weekly Planning Assistance'),
    jsonb_build_object('key', 'dependency_visualization', 'label', 'Action Dependency Visualization'),
    jsonb_build_object('key', 'focus_mode', 'label', 'Focus Mode Support & Analytics')
  )); ${D};
create or replace function public._${bp}_focus_views_hub() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Focus views — impact before activity.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'priority_rbac', 'label', 'Does priority data follow RBAC policies?'),
    jsonb_build_object('key', 'sensitive_actions', 'label', 'Are sensitive actions restricted when required?'),
    jsonb_build_object('key', 'prioritization_policies', 'label', 'Do organizations control prioritization policies?'),
    jsonb_build_object('key', 'focus', 'label', 'Is personal focus protected for employees?'),
    jsonb_build_object('key', 'clarity', 'label', 'How does scoring support clarity before clutter?')
  )); ${D};
create or replace function public._${bp}_priority_levels_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Priority levels — clarity before clutter.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'critical', 'label', 'Critical'),
    jsonb_build_object('key', 'high', 'label', 'High'),
    jsonb_build_object('key', 'medium', 'label', 'Medium'),
    jsonb_build_object('key', 'low', 'label', 'Low'),
    jsonb_build_object('key', 'informational', 'label', 'Informational')
  )); ${D};
create or replace function public._${bp}_focus_planning_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Focus planning — proactive execution.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'daily_lists', 'label', 'Daily priority lists'),
    jsonb_build_object('key', 'weekly_summaries', 'label', 'Weekly focus summaries'),
    jsonb_build_object('key', 'executive_briefings', 'label', 'Executive action briefings'),
    jsonb_build_object('key', 'department_overviews', 'label', 'Department action overviews'),
    jsonb_build_object('key', 'productivity_insights', 'label', 'Personal productivity insights'),
    jsonb_build_object('key', 'since_last_login', 'label', 'Since Last Login summaries'),
    jsonb_build_object('key', 'focus_mode', 'label', 'Focus mode support')
  )); ${D};
create or replace function public._${bp}_focus_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports focus clarity and never bypasses priority RBAC or exposes sensitive actions without authorization.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'next_best_actions', 'label', 'Recommend next best actions'),
    jsonb_build_object('key', 'priority_conflicts', 'label', 'Detect priority conflicts'),
    jsonb_build_object('key', 'work_overload', 'label', 'Identify work overload'),
    jsonb_build_object('key', 'neglected_activities', 'label', 'Surface neglected high-impact activities'),
    jsonb_build_object('key', 'dependencies', 'label', 'Highlight dependencies affecting delivery'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Priority RBAC — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_action_scoring_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Action scoring — rank by impact and urgency.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'impact_ranking', 'label', 'Rank actions by impact'),
    jsonb_build_object('key', 'urgency_ranking', 'label', 'Rank actions by urgency'),
    jsonb_build_object('key', 'group_actions', 'label', 'Group related actions'),
    jsonb_build_object('key', 'blocked_work', 'label', 'Surface blocked work'),
    jsonb_build_object('key', 'overdue', 'label', 'Highlight overdue priorities'),
    jsonb_build_object('key', 'reduce_duplicates', 'label', 'Reduce duplicate efforts')
  )); ${D};
create or replace function public._${bp}_escalation_tracking_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Escalation tracking — proactive planning.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'escalation_tracking', 'label', 'Escalation tracking'),
    jsonb_build_object('key', 'completion_progress', 'label', 'Track completion progress'),
    jsonb_build_object('key', 'proactive_planning', 'label', 'Support proactive planning'),
    jsonb_build_object('key', 'strategic_initiatives', 'label', 'Strategic initiative prioritization'),
    jsonb_build_object('key', 'weekly_planning', 'label', 'Weekly planning assistance'),
    jsonb_build_object('key', 'daily_recommendations', 'label', 'Daily focus recommendations')
  )); ${D};
create or replace function public._${bp}_priority_analytics_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Priority analytics — productivity visibility.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'high_priority_completion', 'label', 'High-priority work completion'),
    jsonb_build_object('key', 'noise_reduction', 'label', 'Organizational noise reduction'),
    jsonb_build_object('key', 'employee_focus', 'label', 'Employee focus improvement'),
    jsonb_build_object('key', 'strategic_execution', 'label', 'Strategic initiative execution speed'),
    jsonb_build_object('key', 'deadline_compliance', 'label', 'Missed deadline reduction'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Focus audit visibility respects role permissions')
  )); ${D};
create or replace function public._${bp}_focus_governance_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Focus governance — organizations control prioritization policies.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'priority_rbac', 'label', 'Priority data follows RBAC policies'),
    jsonb_build_object('key', 'sensitive_actions', 'label', 'Sensitive actions may require restricted visibility'),
    jsonb_build_object('key', 'prioritization_policies', 'label', 'Organizations control prioritization policies'),
    jsonb_build_object('key', 'manager_oversight', 'label', 'Manager department prioritization oversight'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Executive, Manager, Employee tiers'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for prioritization policy changes')
  )); ${D};
create or replace function public._${bp}_focus_integration_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Focus integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'action_center', 'label', 'Action Center Phase 205', 'cross_link', '/app/aipify-action-center-execution-engine'),
    jsonb_build_object('key', 'decision_intelligence', 'label', 'Decision Intelligence Engine Phase 251', 'cross_link', '/app/aipify-decision-intelligence-recommendation-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-cockpit-engine'),
    jsonb_build_object('key', 'goals_alignment', 'label', 'Organizational Goals Engine Phase 248', 'cross_link', '/app/aipify-organizational-goals-alignment-engine'),
    jsonb_build_object('key', 'project_portfolio', 'label', 'Project Portfolio Engine Phase 250', 'cross_link', '/app/aipify-project-portfolio-strategic-execution-engine'),
    jsonb_build_object('key', 'enterprise_analytics', 'label', 'Enterprise Analytics Engine Phase 235', 'cross_link', '/app/aipify-enterprise-analytics-operational-intelligence-engine'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'calendar_assistant', 'label', 'Calendar Assistant Engine', 'cross_link', '/app/assistant/calendars'),
    jsonb_build_object('key', 'aipify_translate', 'label', 'Aipify Translate Phase 238', 'cross_link', '/app/aipify-translate-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for focus integration actions')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing priority RBAC',
      'Exposing sensitive actions without authorization',
      'Exposing protected priority data beyond prioritization policies',
      'Replacing human focus judgment',
      'Modifying focus audit trails',
      'Unlogged prioritization policy changes',
      'Ignoring prioritization policies',
      'Override human judgment'), 'principle', '${P.companion} supports — users retain focus judgment control and sensitive actions stay protected.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm focus support without pressure.', 'values', jsonb_build_array('focus_before_noise','impact_before_activity','clarity_before_clutter','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Action prioritization focus audit logs via aipify_enterprise_action_prioritization_focus_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_action_prioritization_focus permissions — priority RBAC'),
    jsonb_build_object('key', 'priority_rbac', 'label', 'Priority data follows RBAC policies'),
    jsonb_build_object('key', 'sensitive_actions', 'label', 'Sensitive actions may require restricted visibility'),
    jsonb_build_object('key', 'prioritization_policies', 'label', 'Organizations control prioritization policies'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 251, 'key', 'decision_intelligence_recommendation', 'label', 'Decision Intelligence Phase 251', 'route', '/app/aipify-decision-intelligence-recommendation-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 252, 'key', 'enterprise_action_prioritization_focus', 'label', 'Priority & Focus Phase 252', 'route', '/app/${P.slug}', 'description', 'Human-stewarded action prioritization and focus')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'action_center', 'label', 'Action Center Phase 205', 'route', '/app/aipify-action-center-execution-engine', 'relationship', 'Action Center integration — cross-link only'),
    jsonb_build_object('key', 'decision_intelligence', 'label', 'Decision Intelligence Phase 251', 'route', '/app/aipify-decision-intelligence-recommendation-engine', 'relationship', 'Decision integration — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-cockpit-engine', 'relationship', 'Executive Cockpit integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Focus before noise — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with RBAC-protected priority scaffolds and prioritization policy protections. Growth Partner terminology. ${P.companion} supports — never bypasses priority RBAC or exposes sensitive actions without authorization.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — users retain focus judgment control.', '${P.companion} informs and supports.', 'Focus before noise — impact before activity.', 'Growth Partner — never Affiliate.', 'Workforce Planning Era continues — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — priority signals max ~500 chars. No action content beyond RBAC or PII in audit logs.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_decision_intelligence_recommendation_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._adirebp251_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_focus_views_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Focus views hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_focus_views_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_decision_request_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Focus views hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_focus_views_hub()->'reflection_questions') = 5,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_priority_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Priority & Focus — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_priority_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_decision_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Priority & Focus — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_priority_dashboard()->'capabilities') = 10,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  for (const fn of [...SCAFFOLDS, "focus_companion"]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${P.bp}_${fn}()`);
  }

  sql = sql.replace(
    new RegExp(`select '${P.slug}'[^;]+;`, "g"),
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    /select 'aipify-decision-intelligence-recommendation-engine'[^;]+;/g,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected decision intelligence and recommendation guidance within Workforce Planning Era;",
    "RBAC-protected enterprise action prioritization and focus guidance within Workforce Planning Era;",
  );
  sql = sql.replace(
    /Phase 252 Enterprise Action Prioritization & Focus Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 251 Decision Intelligence & Recommendation Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );

  sql = sql.replace(
    /'authenticated', 251\nwhere not exists \(select 1 from public\.aipify_knowledge_categories where slug = 'aipify-decision-intelligence-recommendation-engine'/,
    `'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-decision-intelligence-recommendation-engine'`,
  );

  return sql;
}

function genMigration() {
  const src251 = path.join(
    ROOT,
    "supabase/migrations/20261413000000_aipify_decision_intelligence_recommendation_engine_phase251.sql",
  );
  if (!fs.existsSync(src251)) throw new Error("Phase 251 migration required");
  let m = transformFrom251(fs.readFileSync(src251, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-decision-intelligence-recommendation-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(
    path.join(ROOT, `lib/core/${P.slug}.ts`),
    transformFrom251(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")),
  );
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(
      path.join(dst, f),
      transformFrom251(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")),
    );
  }
  const panel = path.join(
    ROOT,
    `components/app/${srcSlug}/AipifyDecisionIntelligenceRecommendationEngineDashboardPanel.tsx`,
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`),
    transformFrom251(fs.readFileSync(panel, "utf8")),
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/index.ts`),
    `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`,
  );
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom251(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom251(
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

${P.centerTitle} within ${P.era}. ${P.companion} supports priority dashboards, action scoring, personal and team focus views, executive dashboards, initiative prioritization, daily recommendations, weekly planning, escalation tracking, dependency visualization, analytics, and focus mode — does NOT bypass priority RBAC, expose sensitive actions without authorization, or expose protected priority data beyond prioritization policies.

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
Era: ${P.era}
${P.crossLinkNote}
`,
  );
  write(
    path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
    `# ${P.title} Engine — FAQ (Phase ${P.phase})

## What is the Enterprise Action Prioritization & Focus Engine?

The Enterprise Action Prioritization & Focus Engine helps organizations identify, prioritize and execute the most important actions at \`/app/${P.slug}\`.

## What focus features are included?

Priority dashboards, action prioritization scoring, personal focus views, team priority views, executive priority dashboards, strategic initiative prioritization, daily focus recommendations, weekly planning assistance, escalation tracking, action dependency visualization, priority analytics, and focus mode support.

## What priority levels are supported?

Critical, high, medium, low, and informational.

## What action capabilities are included?

Rank actions by impact and urgency, group related actions, surface blocked work, highlight overdue priorities, support proactive planning, track completion progress, and reduce duplicate efforts.

## What intelligence features are included?

Recommend next best actions, detect priority conflicts, identify work overload, surface neglected high-impact activities, highlight dependencies affecting delivery, and encourage strategic focus.

## Who can access prioritization and focus?

Super Admin (full access), Tenant Admin (organization focus settings), Executives (strategic priority visibility), Managers (department prioritization oversight), Employees (personal focus management) — enterprise RBAC.

## Are sensitive actions protected?

**Yes.** Priority data follows RBAC policies. Sensitive actions may require restricted visibility. Organizations control prioritization policies.

## How does this integrate with other Aipify surfaces?

${P.crossLinkNote}

## Does the Focus Companion replace human judgment?

**No.** ${P.companion} supports focus clarity — it does **NOT** bypass priority RBAC, expose sensitive actions without authorization, or expose protected priority data beyond prioritization policies.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Focus: priority dashboards, scoring, personal/team/executive views, initiative prioritization, daily/weekly planning, escalation, dependencies, analytics, focus mode.
Levels: critical, high, medium, low, informational.
Actions: impact/urgency ranking, grouping, blocked work, overdue, planning, completion, deduplication.
Intelligence: next best actions, conflicts, overload, neglected activities, dependencies, strategic focus.
Focus capabilities: daily lists, weekly summaries, executive briefings, department overviews, productivity insights, since last login.
Security: priority RBAC, sensitive action protection, prioritization policies, audit logging, enterprise permissions, 2FA.
Design principles: Focus before noise, impact before activity, clarity before clutter.
Companion limitations: no bypassing priority RBAC, no exposing sensitive actions, no exposing data beyond prioritization policies.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate. Workforce Planning Era 249–253.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never bypasses priority RBAC, exposes sensitive actions without authorization, or exposes protected priority data beyond prioritization policies.";
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
      '| "aipifyDecisionIntelligenceRecommendationEngine"',
      `| "aipifyDecisionIntelligenceRecommendationEngine"\n  | "${id}"`,
    );
  }
  if (!c.includes(href)) {
    const anchor =
      /id: "aipifyDecisionIntelligenceRecommendationEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyDecisionIntelligenceRecommendationEngine",\n  },/;
    c = c.replace(
      anchor,
      (m) =>
        `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-decision-intelligence-recommendation-engine")) {\n    return "aipifyDecisionIntelligenceRecommendationEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-decision-intelligence-recommendation-engine")) {\n    return "aipifyDecisionIntelligenceRecommendationEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace(
        '"aipify_decision_intelligence_recommendation.steward",',
        `"aipify_decision_intelligence_recommendation.steward",\n    "${perm}",`,
      );
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-decision-intelligence-recommendation-engine";',
      `export * from "./aipify-decision-intelligence-recommendation-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports priority dashboards, action scoring, personal and team focus views, executive dashboards, daily recommendations, weekly planning, escalation tracking, and focus mode. Supports organizational focus — does NOT bypass priority RBAC. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Priority focus score",
    modeLabel: "Mode",
    readinessLabel: "Priority focus maturity level",
    executiveReviews: "Executive action briefings",
    activeReflections: "Active prioritization focus scaffolds",
    humanOversightRequired: `Human oversight required — users retain focus judgment control; ${P.companion} supports only`,
    eraOpenerSummary: `Workforce Planning Era — Phases ${P.eraRange}`,
    eraOpenerNote:
      "Cross-link only — do not duplicate Action Center, Decision Intelligence, Executive Cockpit, Goals & Alignment, Project Portfolio, Analytics Engine, Notification Engine, Calendar Assistant, or Aipify Translate RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Focus views hub — governance prompts",
    frameworkLabel: "Priority levels engine",
    reviewsLabel: "Focus governance dashboard",
    companionLabel: `${P.companion} — supports focus clarity, never replaces human focus judgment`,
    subEngineLabel: "Action scoring engine",
    reflections: "Prioritization focus scaffolds",
    executiveReviewEntries: "Priority action entries",
    scaffoldNotes: "RBAC-protected prioritization focus scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT bypass priority RBAC, expose sensitive actions without authorization, or expose protected priority data beyond prioritization policies`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports enterprise action prioritization and focus — users retain focus judgment control and sensitive actions stay protected.`,
      philosophy:
        "People First. RBAC-protected priority scaffolds. Growth Partner terminology — never Affiliate.",
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
        ? "Prioritet og fokus"
        : locale === "sv"
          ? "Prioritet och fokus"
          : locale === "da"
            ? "Prioritet og fokus"
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
      'export * from "./implementation-blueprint-phase251-vocabulary";',
      `export * from "./implementation-blueprint-phase251-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE251_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase251-aipify-decision-intelligence-recommendation.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE251_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase251-aipify-decision-intelligence-recommendation.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_decision_intelligence_recommendation.view`, `aipify_decision_intelligence_recommendation.manage`, `aipify_decision_intelligence_recommendation.steward`.";
  const entry = `\n**Enterprise Action Prioritization & Focus Engine (Phase 252):** See [AIPIFY_ENTERPRISE_ACTION_PRIORITIZATION_FOCUS_ENGINE_PHASE252.md](./AIPIFY_ENTERPRISE_ACTION_PRIORITIZATION_FOCUS_ENGINE_PHASE252.md) — Priority dashboards, action scoring, personal and team focus views, executive dashboards, initiative prioritization, daily recommendations, weekly planning, escalation tracking, dependency visualization, analytics, and focus mode. Continues Workforce Planning Era (249–253). \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** bypassing priority RBAC, exposing sensitive actions without authorization, or exposing protected priority data beyond prioritization policies. Cross-links only: Action Center Phase 205, Decision Intelligence Engine Phase 251, Executive Cockpit Phase 200, Organizational Goals Engine Phase 248, Project Portfolio Engine Phase 250, Enterprise Analytics Engine Phase 235, Enterprise Notification Engine Phase 233, Calendar Assistant Engine, Aipify Translate Phase 238. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 252")) {
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
  console.error(`Phase ${P.phase} docs generated; stack requires Phase 251 artifacts: ${err.message}`);
  process.exitCode = 1;
}
