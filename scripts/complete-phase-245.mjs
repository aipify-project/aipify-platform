#!/usr/bin/env node
/** ABOS Phase 245 — Organizational Health & Workforce Insights Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "organizational_health_dashboard",
  "pulse_survey_hub",
  "insight_categories_engine",
  "workforce_sentiment_engine",
  "survey_programs_engine",
  "workforce_analytics_engine",
  "health_governance_dashboard",
  "leadership_health_engine",
  "health_integration_center",
];

const P = {
  phase: 245,
  migration: "20261407000000_aipify_organizational_health_workforce_insights_engine_phase245.sql",
  slug: "aipify-organizational-health-workforce-insights-engine",
  base: "AipifyOrganizationalHealthWorkforceInsights",
  camel: "aipifyOrganizationalHealthWorkforceInsightsEngine",
  snake: "aipify_organizational_health_workforce_insights",
  permPrefix: "aipify_organizational_health_workforce_insights",
  helper: "aohwie",
  bp: "aohwiebp245",
  decisionType: "aipify_organizational_health_workforce_insights_engine",
  title: "Organizational Health & Workforce Insights",
  centerTitle: "Health & Workforce Insights",
  companion: "Health Insights Companion",
  scoreKey: "aipify_organizational_health_workforce_insights_score",
  modeKey: "organizational_health_workforce_insights_mode",
  levelKey: "organizational_health_workforce_insights_maturity_level",
  thirdEntity: "organizational_health_workforce_insights_notes",
  era: "Organizational Continuity Era (244–248)",
  eraRange: "244–248",
  docSlug: "AIPIFY_ORGANIZATIONAL_HEALTH_WORKFORCE_INSIGHTS_ENGINE",
  ilmFile: "implementation-blueprint-phase245-aipify-organizational-health-workforce-insights.txt",
  navLabel: "Workforce Health",
  crossLinkNote:
    "Cross-links only: Employee Growth Engine Phase 219, Employee Recognition & Celebration Engine Phase 242, Enterprise Analytics Engine Phase 235, Executive Cockpit Phase 200, Enterprise Notification Engine Phase 233, Learning Center, and Aipify Translate Phase 238 — never bypass health insights RBAC, expose individual survey responses without authorization, or expose non-aggregated sensitive workforce data.",
  companionLimitations: [
    "bypassing_health_insights_rbac",
    "exposing_individual_responses",
    "exposing_non_aggregated_workforce_data",
    "unlogged_health_policy_changes",
    "replacing_human_leadership_judgment",
    "modifying_health_insights_audit_trail",
    "ignoring_confidentiality_gates",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom244(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifySuccessionPlanningOrganizationalContinuity", P.base],
    ["aipify-succession-planning-organizational-continuity-engine", P.slug],
    ["aipify_succession_planning_organizational_continuity", P.snake],
    ["aipifySuccessionPlanningOrganizationalContinuityEngine", P.camel],
    ["aspocbp244", P.bp],
    ["_aspoc_", `_${P.helper}_`],
    ["aipify_succession_planning_organizational_continuity_score", P.scoreKey],
    ["succession_continuity_mode", P.modeKey],
    ["succession_continuity_maturity_level", P.levelKey],
    ["succession_continuity_notes", P.thirdEntity],
    ["SuccessionContinuityNote", thirdPascal],
    ["succession_continuity_notes_count", `${P.thirdEntity}_count`],
    ["Succession Phase 244", "__SUCCESSION_PHASE_244__"],
    ["Succession Companion", "__HEALTH_COMPANION__"],
    ["Succession Planning & Organizational Continuity", P.title],
    ["__HEALTH_COMPANION__", P.companion],
    ["Succession & Continuity", "__HEALTH_CENTER__"],
    ["__SUCCESSION_PHASE_244__", "Succession Phase 244"],
    ["Phase 244", `Phase ${P.phase}`],
    ["aipify_succession_planning_organizational_continuity.view", `${P.permPrefix}.view`],
    ["aipify_succession_planning_organizational_continuity.manage", `${P.permPrefix}.manage`],
    ["aipify_succession_planning_organizational_continuity.steward", `${P.permPrefix}.steward`],
    ["aipify_succession_planning_organizational_continuity_engine", P.decisionType],
    ["20261406000000_aipify_succession_planning_organizational_continuity_engine_phase244.sql", P.migration],
    ["Repo Phase 244", `Repo Phase ${P.phase}`],
    ["Phase 244 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE244_AIPIFY_SUCCESSION_PLANNING_ORGANIZATIONAL_CONTINUITY_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase244", `implementation-blueprint-phase${P.phase}`],
    ["succession_continuity_dashboard", SCAFFOLDS[0]],
    ["successor_identification_hub", SCAFFOLDS[1]],
    ["succession_types_engine", SCAFFOLDS[2]],
    ["continuity_capabilities_engine", SCAFFOLDS[3]],
    ["development_plan_tracking_engine", SCAFFOLDS[4]],
    ["succession_analytics_engine", SCAFFOLDS[5]],
    ["succession_governance_dashboard", SCAFFOLDS[6]],
    ["executive_succession_engine", SCAFFOLDS[7]],
    ["succession_integration_center", SCAFFOLDS[8]],
    ["succession_companion", "health_insights_companion"],
    ["_seed_succession_continuity_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["succession continuity stewardship", "workforce health insights stewardship"],
    ["succession-informed decision support", "health-informed decision support"],
    ["planning-first succession culture", "wellbeing-first organizational culture"],
    ["active succession programs", "active health insight programs"],
    ["succession risks requiring attention", "health indicators requiring attention"],
    ["Successor Identification Hub", "Pulse Survey Hub"],
    ["Succession Types Engine", "Insight Categories Engine"],
    ["Continuity Capabilities Engine", "Workforce Sentiment Engine"],
    ["Development Plan Tracking Engine", "Survey Programs Engine"],
    ["Succession Analytics Engine", "Workforce Analytics Engine"],
    ["Succession Governance Dashboard", "Health Governance Dashboard"],
    ["succession continuity indicators", "organizational health indicators"],
    ["succession governance prompts", "health governance prompts"],
    ["succession assistant prompts", "health insights assistant prompts"],
    ["executive succession dashboards", "leadership health summaries"],
    ["development progress signals", "participation analytics signals"],
    ["RBAC-protected succession policies", "RBAC-protected health insights policies"],
    ["Planning before disruption", "Ethics before exposure"],
    ["Continuity before dependency", "Aggregation before identification"],
    ["Readiness before transition risk", "Wellbeing before metrics pressure"],
    ["no_bypassing_succession_rbac", "no_bypassing_health_insights_rbac"],
    ["AIPIFY_SUCCESSION_PLANNING_ORGANIZATIONAL_CONTINUITY_ENGINE", P.docSlug],
    ["succession planning and organizational continuity", "organizational health and workforce insights"],
    ["Succession continuity audit logs", "Workforce health insights audit logs"],
    ["succession data RBAC", "health insights RBAC"],
    ["succession continuity scaffolds", "workforce health scaffolds"],
    ["organization succession policies", "organization health insights policies"],
    ["Succession continuity score", "Organizational health score"],
    ["Succession continuity maturity level", "Workforce insights maturity level"],
    ["Executive succession entries", "Leadership health summary entries"],
    ["succession continuity", "workforce health insights"],
    ["executive succession confidentiality stewardship", "individual response confidentiality stewardship"],
    ["succession data beyond RBAC", "workforce data beyond RBAC"],
    ["cross-functional succession assistance", "cross-department health insights assistance"],
    ["executive succession reviews", "leadership health reviews"],
    [
      "Employee Growth Engine Phase 219, Mentorship & Knowledge Transfer Engine Phase 243, Learning Center, Enterprise Analytics Engine Phase 235, Executive Cockpit Phase 200, Knowledge Center, and Enterprise Notification Engine Phase 233",
      "Employee Growth Engine Phase 219, Employee Recognition & Celebration Engine Phase 242, Enterprise Analytics Engine Phase 235, Executive Cockpit Phase 200, Enterprise Notification Engine Phase 233, Learning Center, and Aipify Translate Phase 238",
    ],
    [
      "Never bypass succession RBAC or expose executive succession plans without authorization",
      "Never bypass health insights RBAC or expose individual survey responses without authorization",
    ],
    ["succession programs", "health insight programs"],
    ["Succession programs", "Health insight programs"],
    ["confidential executive succession routing", "confidential individual response routing"],
    ["exposes succession data without RBAC approval", "exposes workforce data without RBAC approval"],
    ["Unauthorized succession access without RBAC approval", "Unauthorized health insights access without RBAC approval"],
    ["Modifying succession audit trails", "Modifying health insights audit trails"],
    ["Dependency before continuity", "Pressure before wellbeing"],
    ["user succession judgment control", "user leadership judgment control"],
    ["User succession judgment control", "User leadership judgment control"],
    ["succession decisions and continuity policy", "health insights decisions and survey policy"],
    ["succession continuity visibility", "workforce health visibility"],
    ["succession continuity governance", "workforce health governance"],
    [
      "enable organizations to proactively prepare for leadership transitions, critical role changes and knowledge continuity — maintaining succession data RBAC, executive succession confidentiality, sensitive workforce planning protections, and complete audit history",
      "enable organizations to monitor workforce wellbeing, engagement and organizational health through ethical, aggregated and actionable insights — maintaining individual response confidentiality, aggregated workforce insights RBAC, sensitive health data protections, and complete audit history",
    ],
    [
      "succession readiness increases, leadership transition risk reduces, organizational continuity improves, leadership pipelines strengthen, dependency on single individuals reduces, and executive confidence increases with planning before disruption",
      "employee engagement increases, workforce wellbeing improves, organizational challenges are detected earlier, leadership responsiveness improves, participation rates increase, and organizational resilience strengthens with ethics before exposure",
    ],
    ["opens Organizational Continuity Era", "continues Organizational Continuity Era"],
    ["__HEALTH_CENTER__", P.centerTitle],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports workforce health and engagement insights — NOT bypassing health insights RBAC, exposing individual survey responses without authorization, or exposing non-aggregated sensitive workforce data. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Enable organizations to monitor workforce wellbeing, engagement and organizational health through ethical, aggregated and actionable insights — ${P.companion} informs, humans decide.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Organizational Continuity Era (${P.eraRange}). Human-stewarded health insights governance; RBAC-protected workforce scaffolds; health policy changes logged; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations increase employee engagement, improve workforce wellbeing, detect organizational challenges earlier, improve leadership responsiveness, increase participation rates, and strengthen organizational resilience with ethics before exposure.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Ten health insight modules with governance'),
    jsonb_build_object('key', 'pulse_survey_hub', 'label', 'Pulse survey hub', 'emoji', '📋', 'description', 'Pulse, quarterly, team check-ins, leadership feedback'),
    jsonb_build_object('key', 'insight_categories_engine', 'label', 'Insight categories engine', 'emoji', '🏆', 'description', 'Engagement, collaboration, workload, recognition, trust'),
    jsonb_build_object('key', 'workforce_sentiment_engine', 'label', 'Workforce sentiment engine', 'emoji', '🔗', 'description', 'Sentiment tracking, burnout risk, morale'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not replace human leadership judgment'),
    jsonb_build_object('key', 'workforce_analytics_engine', 'label', 'Workforce analytics engine', 'emoji', '📊', 'description', 'Trends, participation, department health'),
    jsonb_build_object('key', 'health_governance_dashboard', 'label', 'Health governance dashboard', 'emoji', '🛡️', 'description', 'RBAC and individual response confidentiality'),
    jsonb_build_object('key', 'survey_programs', 'label', 'Survey programs engine', 'emoji', '🔔', 'description', 'Custom surveys, anonymous feedback, initiatives')
  ); ${D};
create or replace function public._${bp}_organizational_health_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — ten capabilities. Ethics before exposure.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'organizational_health_dashboard', 'label', 'Organizational Health Dashboard'),
    jsonb_build_object('key', 'pulse_surveys', 'label', 'Employee Engagement Pulse Surveys'),
    jsonb_build_object('key', 'team_wellbeing', 'label', 'Team Wellbeing Indicators'),
    jsonb_build_object('key', 'department_trends', 'label', 'Department Health Trends'),
    jsonb_build_object('key', 'workforce_sentiment', 'label', 'Workforce Sentiment Tracking'),
    jsonb_build_object('key', 'burnout_risk', 'label', 'Burnout Risk Indicators'),
    jsonb_build_object('key', 'workload_visibility', 'label', 'Workload Visibility'),
    jsonb_build_object('key', 'participation_analytics', 'label', 'Participation Analytics'),
    jsonb_build_object('key', 'trend_reporting', 'label', 'Organizational Trend Reporting'),
    jsonb_build_object('key', 'leadership_summaries', 'label', 'Leadership Health Summaries & Anonymous Feedback')
  )); ${D};
create or replace function public._${bp}_pulse_survey_hub() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Pulse surveys — aggregation before identification.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'health_rbac', 'label', 'Do workforce insights follow RBAC policies?'),
    jsonb_build_object('key', 'response_confidentiality', 'label', 'Are individual survey responses kept confidential?'),
    jsonb_build_object('key', 'participation_rates', 'label', 'Are participation rates tracked ethically?'),
    jsonb_build_object('key', 'aggregated_insights', 'label', 'Are insights aggregated where appropriate?'),
    jsonb_build_object('key', 'governance', 'label', 'How does governance support wellbeing without pressure?')
  )); ${D};
create or replace function public._${bp}_insight_categories_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Insight categories — wellbeing before metrics pressure.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'engagement', 'label', 'Engagement'),
    jsonb_build_object('key', 'collaboration', 'label', 'Collaboration'),
    jsonb_build_object('key', 'workload_balance', 'label', 'Workload balance'),
    jsonb_build_object('key', 'recognition_levels', 'label', 'Recognition levels'),
    jsonb_build_object('key', 'learning_participation', 'label', 'Learning participation'),
    jsonb_build_object('key', 'leadership_effectiveness', 'label', 'Leadership effectiveness'),
    jsonb_build_object('key', 'team_morale', 'label', 'Team morale'),
    jsonb_build_object('key', 'organizational_trust', 'label', 'Organizational trust')
  )); ${D};
create or replace function public._${bp}_leadership_health_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Leadership health — proactive stewardship without pressure.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'leadership_summaries', 'label', 'Leadership health summaries'),
    jsonb_build_object('key', 'department_support', 'label', 'Departments requiring support'),
    jsonb_build_object('key', 'engagement_trends', 'label', 'Declining engagement trend detection'),
    jsonb_build_object('key', 'recognition_gaps', 'label', 'Recognition gap highlights'),
    jsonb_build_object('key', 'workload_concerns', 'label', 'Workload concern signals'),
    jsonb_build_object('key', 'improvement_initiatives', 'label', 'Improvement initiative tracking')
  )); ${D};
create or replace function public._${bp}_health_insights_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports workforce health clarity and never bypasses health insights RBAC or exposes individual responses without authorization.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'detect_declining_engagement', 'label', 'Detect declining engagement trends'),
    jsonb_build_object('key', 'identify_departments', 'label', 'Identify departments requiring support'),
    jsonb_build_object('key', 'highlight_recognition_gaps', 'label', 'Highlight recognition gaps'),
    jsonb_build_object('key', 'surface_workload_concerns', 'label', 'Surface workload concerns'),
    jsonb_build_object('key', 'recommend_initiatives', 'label', 'Recommend improvement initiatives'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Health insights RBAC — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_workforce_sentiment_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Workforce sentiment — ethical aggregated signals.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'sentiment_tracking', 'label', 'Workforce sentiment tracking'),
    jsonb_build_object('key', 'burnout_risk', 'label', 'Burnout risk indicators'),
    jsonb_build_object('key', 'team_morale', 'label', 'Team morale signals'),
    jsonb_build_object('key', 'organizational_trust', 'label', 'Organizational trust trends'),
    jsonb_build_object('key', 'anonymous_feedback', 'label', 'Anonymous feedback channels'),
    jsonb_build_object('key', 'wellbeing_resources', 'label', 'Personal wellbeing resources for employees')
  )); ${D};
create or replace function public._${bp}_survey_programs_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Survey programs — participation without pressure.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'pulse_surveys', 'label', 'Pulse surveys'),
    jsonb_build_object('key', 'quarterly_engagement', 'label', 'Quarterly engagement surveys'),
    jsonb_build_object('key', 'team_checkins', 'label', 'Team health check-ins'),
    jsonb_build_object('key', 'leadership_feedback', 'label', 'Leadership feedback surveys'),
    jsonb_build_object('key', 'custom_surveys', 'label', 'Custom surveys'),
    jsonb_build_object('key', 'notification_integration', 'label', 'Notification Engine integration — cross-link only')
  )); ${D};
create or replace function public._${bp}_workforce_analytics_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Workforce analytics — aggregated organizational visibility.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'engagement_trends', 'label', 'Engagement trend signals'),
    jsonb_build_object('key', 'department_health', 'label', 'Department health trends'),
    jsonb_build_object('key', 'participation_rates', 'label', 'Participation analytics'),
    jsonb_build_object('key', 'workload_balance', 'label', 'Workload visibility trends'),
    jsonb_build_object('key', 'improvement_tracking', 'label', 'Improvement initiative progress'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Health insights audit visibility respects role permissions')
  )); ${D};
create or replace function public._${bp}_health_governance_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Health governance — organizations control workforce insight policies.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'health_rbac', 'label', 'Workforce insights follow RBAC policies'),
    jsonb_build_object('key', 'response_confidentiality', 'label', 'Individual survey responses remain confidential'),
    jsonb_build_object('key', 'aggregated_data', 'label', 'Sensitive workforce data aggregated where appropriate'),
    jsonb_build_object('key', 'manager_oversight', 'label', 'Manager department insights oversight'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Executive, Manager, Employee tiers'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for health policy changes')
  )); ${D};
create or replace function public._${bp}_health_integration_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Health integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'employee_growth', 'label', 'Employee Growth Engine Phase 219', 'cross_link', '/app/aipify-employee-growth-career-development-engine'),
    jsonb_build_object('key', 'recognition_engine', 'label', 'Employee Recognition & Celebration Engine Phase 242', 'cross_link', '/app/aipify-employee-recognition-celebration-engine'),
    jsonb_build_object('key', 'learning_center', 'label', 'Learning Center', 'cross_link', '/app/aipify-enterprise-training-certification-engine'),
    jsonb_build_object('key', 'enterprise_analytics', 'label', 'Enterprise Analytics Engine Phase 235', 'cross_link', '/app/aipify-enterprise-analytics-operational-intelligence-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-cockpit-engine'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'aipify_translate', 'label', 'Aipify Translate Phase 238', 'cross_link', '/app/aipify-translate-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for health integration actions')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing health insights RBAC',
      'Exposing individual survey responses without authorization',
      'Exposing non-aggregated sensitive workforce data',
      'Replacing human leadership judgment',
      'Modifying health insights audit trails',
      'Unlogged health policy changes',
      'Ignoring confidentiality gates',
      'Override human judgment'), 'principle', '${P.companion} supports — users retain leadership judgment control and individual responses stay protected.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm workforce health support without performance pressure.', 'values', jsonb_build_array('ethics_before_exposure','aggregation_before_identification','wellbeing_before_metrics_pressure','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Workforce health insights audit logs via aipify_organizational_health_workforce_insights_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_organizational_health_workforce_insights permissions — health insights RBAC'),
    jsonb_build_object('key', 'health_rbac', 'label', 'Workforce insights follow RBAC policies'),
    jsonb_build_object('key', 'response_confidentiality', 'label', 'Individual survey responses must remain confidential'),
    jsonb_build_object('key', 'aggregated_data', 'label', 'Sensitive workforce data must be aggregated where appropriate'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 244, 'key', 'succession_planning_organizational_continuity', 'label', 'Succession Phase 244', 'route', '/app/aipify-succession-planning-organizational-continuity-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 245, 'key', 'organizational_health_workforce_insights', 'label', 'Health Insights Phase 245', 'route', '/app/${P.slug}', 'description', 'Human-stewarded organizational health and workforce insights')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'employee_growth', 'label', 'Employee Growth Engine Phase 219', 'route', '/app/aipify-employee-growth-career-development-engine', 'relationship', 'Employee Growth integration — cross-link only'),
    jsonb_build_object('key', 'recognition_engine', 'label', 'Recognition Engine Phase 242', 'route', '/app/aipify-employee-recognition-celebration-engine', 'relationship', 'Recognition integration — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-cockpit-engine', 'relationship', 'Executive Cockpit integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Ethics before exposure — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with RBAC-protected workforce health scaffolds and individual response confidentiality protections. Growth Partner terminology. ${P.companion} supports — never bypasses health insights RBAC or exposes non-aggregated sensitive workforce data.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — users retain leadership judgment control.', '${P.companion} informs and supports.', 'Ethics before exposure — aggregation before identification.', 'Growth Partner — never Affiliate.', 'Organizational Continuity Era — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — health insight signals max ~500 chars. No workforce content beyond RBAC or PII in audit logs.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_succession_planning_organizational_continuity_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._aspocbp244_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_pulse_survey_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Pulse survey hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_pulse_survey_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_successor_identification_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Pulse survey hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_pulse_survey_hub()->'reflection_questions') = 5,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_organizational_health_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Health & Workforce Insights — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_organizational_health_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_succession_continuity_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Health & Workforce Insights — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_organizational_health_dashboard()->'capabilities') = 10,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  for (const fn of [...SCAFFOLDS, "health_insights_companion"]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${P.bp}_${fn}()`);
  }

  sql = sql.replace(
    /select 'aipify-succession-planning-organizational-continuity-engine'[^;]+;/g,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected succession planning and organizational continuity guidance within Organizational Continuity Era;",
    "RBAC-protected organizational health and workforce insights guidance within Organizational Continuity Era;",
  );
  sql = sql.replace(
    /Phase 245 Organizational Health & Workforce Insights Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 244 Succession Planning & Organizational Continuity Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );

  sql = sql.replace(
    /'authenticated', 244\nwhere not exists \(select 1 from public\.aipify_knowledge_categories where slug = 'aipify-succession-planning-organizational-continuity-engine'/,
    `'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-succession-planning-organizational-continuity-engine'`,
  );

  return sql;
}

function genMigration() {
  const src244 = path.join(ROOT, "supabase/migrations/20261406000000_aipify_succession_planning_organizational_continuity_engine_phase244.sql");
  if (!fs.existsSync(src244)) throw new Error("Phase 244 migration required");
  let m = transformFrom244(fs.readFileSync(src244, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-succession-planning-organizational-continuity-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(path.join(ROOT, `lib/core/${P.slug}.ts`), transformFrom244(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")));
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom244(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")));
  }
  const panel = path.join(ROOT, `components/app/${srcSlug}/AipifySuccessionPlanningOrganizationalContinuityEngineDashboardPanel.tsx`);
  write(
    path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`),
    transformFrom244(fs.readFileSync(panel, "utf8")),
  );
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`);
  write(path.join(ROOT, `app/app/${P.slug}/page.tsx`), transformFrom244(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")));
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom244(fs.readFileSync(path.join(ROOT, `app/api/aipify/${srcSlug}/${route}/route.ts`), "utf8")),
    );
  }
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports organizational health dashboards, pulse surveys, team wellbeing indicators, department health trends, workforce sentiment, burnout risk, workload visibility, participation analytics, trend reporting, leadership summaries, anonymous feedback, and improvement initiatives — does NOT bypass health insights RBAC, expose individual survey responses without authorization, or expose non-aggregated sensitive workforce data.

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

## What is the Organizational Health & Workforce Insights Engine?

The Organizational Health & Workforce Insights Engine helps organizations monitor workforce wellbeing, engagement and organizational health at \`/app/${P.slug}\`.

## What health features are included?

Organizational health dashboard, employee engagement pulse surveys, team wellbeing indicators, department health trends, workforce sentiment tracking, burnout risk indicators, workload visibility, participation analytics, organizational trend reporting, leadership health summaries, anonymous feedback channels, and improvement initiative tracking.

## What insight categories are tracked?

Engagement, collaboration, workload balance, recognition levels, learning participation, leadership effectiveness, team morale, and organizational trust.

## What survey types are supported?

Pulse surveys, quarterly engagement surveys, team health check-ins, leadership feedback surveys, and custom surveys.

## What intelligence features are included?

Detect declining engagement trends, identify departments requiring support, highlight recognition gaps, surface workload concerns, recommend improvement initiatives, and encourage proactive leadership actions.

## Who can access workforce health insights?

Super Admin (full access), Tenant Admin (organization settings), Executives (organization-level insights), Managers (department insights), Employees (survey participation and personal wellbeing resources) — enterprise RBAC.

## Are individual survey responses protected?

**Yes.** Individual responses remain confidential. Workforce insights use aggregated data where appropriate. Health insights follow RBAC policies.

## How does this integrate with other Aipify surfaces?

${P.crossLinkNote}

## Does the Health Insights Companion replace human judgment?

**No.** ${P.companion} supports workforce health clarity — it does **NOT** bypass health insights RBAC, expose individual survey responses without authorization, or expose non-aggregated sensitive workforce data.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Health: organizational dashboard, pulse surveys, team wellbeing, department trends, sentiment, burnout risk, workload, participation, trend reporting, leadership summaries, anonymous feedback, improvement initiatives.
Categories: engagement, collaboration, workload balance, recognition, learning participation, leadership effectiveness, team morale, organizational trust.
Surveys: pulse, quarterly engagement, team check-ins, leadership feedback, custom.
Intelligence: declining engagement, departments needing support, recognition gaps, workload concerns, improvement initiatives, proactive leadership.
Security: health insights RBAC, individual response confidentiality, aggregated data, audit logging, enterprise permissions, 2FA.
Design principles: Ethics before exposure, aggregation before identification, wellbeing before metrics pressure.
Companion limitations: no bypassing health RBAC, no exposing individual responses, no exposing non-aggregated workforce data.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never bypasses health insights RBAC, exposes individual survey responses without authorization, or exposes non-aggregated sensitive workforce data.";
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
    c = c.replace('| "aipifySuccessionPlanningOrganizationalContinuityEngine"', `| "aipifySuccessionPlanningOrganizationalContinuityEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    const anchor = /id: "aipifySuccessionPlanningOrganizationalContinuityEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifySuccessionPlanningOrganizationalContinuityEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-succession-planning-organizational-continuity-engine")) {\n    return "aipifySuccessionPlanningOrganizationalContinuityEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-succession-planning-organizational-continuity-engine")) {\n    return "aipifySuccessionPlanningOrganizationalContinuityEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_succession_planning_organizational_continuity.steward",', `"aipify_succession_planning_organizational_continuity.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-succession-planning-organizational-continuity-engine";',
      `export * from "./aipify-succession-planning-organizational-continuity-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports organizational health dashboards, pulse surveys, team wellbeing, department trends, sentiment tracking, and improvement initiatives. Supports organizational resilience — does NOT bypass health insights RBAC. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Organizational health score",
    modeLabel: "Mode",
    readinessLabel: "Workforce insights maturity level",
    executiveReviews: "Leadership health summaries",
    activeReflections: "Active workforce health scaffolds",
    humanOversightRequired: `Human oversight required — users retain leadership judgment control; ${P.companion} supports only`,
    eraOpenerSummary: `Organizational Continuity Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate Employee Growth, Recognition Engine, Learning Center, Analytics Engine, Executive Cockpit, Notification Engine, or Aipify Translate RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Pulse survey hub — governance prompts",
    frameworkLabel: "Insight categories engine",
    reviewsLabel: "Health governance dashboard",
    companionLabel: `${P.companion} — supports workforce health clarity, never replaces human leadership judgment`,
    subEngineLabel: "Workforce sentiment engine",
    reflections: "Workforce health scaffolds",
    executiveReviewEntries: "Leadership health summary entries",
    scaffoldNotes: "RBAC-protected workforce health scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT bypass health insights RBAC, expose individual survey responses without authorization, or expose non-aggregated sensitive workforce data`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports workforce health insights — users retain leadership judgment control and individual responses stay protected.`,
      philosophy: "People First. RBAC-protected workforce health scaffolds. Growth Partner terminology — never Affiliate.",
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
        ? "Arbeidshelse"
        : locale === "sv"
          ? "Arbetsmiljö"
          : locale === "da"
            ? "Arbejdshelbred"
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
      'export * from "./implementation-blueprint-phase244-vocabulary";',
      `export * from "./implementation-blueprint-phase244-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE244_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase244-aipify-succession-planning-organizational-continuity.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE244_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase244-aipify-succession-planning-organizational-continuity.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_succession_planning_organizational_continuity.view`, `aipify_succession_planning_organizational_continuity.manage`, `aipify_succession_planning_organizational_continuity.steward`.";
  const entry = `\n**Organizational Health & Workforce Insights Engine (Phase 245):** See [AIPIFY_ORGANIZATIONAL_HEALTH_WORKFORCE_INSIGHTS_ENGINE_PHASE245.md](./AIPIFY_ORGANIZATIONAL_HEALTH_WORKFORCE_INSIGHTS_ENGINE_PHASE245.md) — Workforce wellbeing, engagement pulse surveys, team wellbeing indicators, department health trends, sentiment tracking, burnout risk, workload visibility, participation analytics, leadership summaries, anonymous feedback, and improvement initiatives. Continues Organizational Continuity Era (244–248). \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** bypassing health insights RBAC, exposing individual survey responses without authorization, or exposing non-aggregated sensitive workforce data. Cross-links only: Employee Growth Engine Phase 219, Employee Recognition & Celebration Engine Phase 242, Enterprise Analytics Engine Phase 235, Executive Cockpit Phase 200, Enterprise Notification Engine Phase 233, Learning Center, Aipify Translate Phase 238. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 245")) {
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
  console.error(`Phase ${P.phase} docs generated; stack requires Phase 244 artifacts: ${err.message}`);
  process.exitCode = 1;
}
