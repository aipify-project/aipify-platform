#!/usr/bin/env node
/** ABOS Phase 249 — Enterprise Resource Planning & Capacity Intelligence Engine (Era Opener 249–253) */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "capacity_dashboard",
  "team_capacity_hub",
  "resource_categories_engine",
  "allocation_planning_engine",
  "capacity_forecasting_engine",
  "utilization_analytics_engine",
  "capacity_governance_dashboard",
  "workforce_balancing_engine",
  "capacity_integration_center",
];

const P = {
  phase: 249,
  migration:
    "20261411000000_aipify_enterprise_resource_planning_capacity_intelligence_engine_phase249.sql",
  slug: "aipify-enterprise-resource-planning-capacity-intelligence-engine",
  base: "AipifyEnterpriseResourcePlanningCapacityIntelligence",
  camel: "aipifyEnterpriseResourcePlanningCapacityIntelligenceEngine",
  snake: "aipify_enterprise_resource_planning_capacity_intelligence",
  permPrefix: "aipify_enterprise_resource_planning_capacity_intelligence",
  helper: "aerpce",
  bp: "aerpcebp249",
  decisionType: "aipify_enterprise_resource_planning_capacity_intelligence_engine",
  title: "Enterprise Resource Planning & Capacity Intelligence",
  centerTitle: "Resource & Capacity",
  companion: "Capacity Intelligence Companion",
  scoreKey: "aipify_enterprise_resource_planning_capacity_intelligence_score",
  modeKey: "enterprise_resource_planning_capacity_intelligence_mode",
  levelKey: "enterprise_resource_planning_capacity_intelligence_maturity_level",
  thirdEntity: "enterprise_resource_planning_capacity_intelligence_notes",
  era: "Workforce Planning Era (249–253)",
  eraRange: "249–253",
  docSlug: "AIPIFY_ENTERPRISE_RESOURCE_PLANNING_CAPACITY_INTELLIGENCE_ENGINE",
  ilmFile:
    "implementation-blueprint-phase249-aipify-enterprise-resource-planning-capacity-intelligence.txt",
  navLabel: "Capacity Intelligence",
  crossLinkNote:
    "Cross-links only: Organizational Health & Workforce Insights Engine Phase 245, Skills & Internal Talent Marketplace Engine Phase 246, Enterprise Analytics Engine Phase 235, Action Center Phase 205, Executive Cockpit Phase 200, Calendar Assistant Engine, Enterprise Notification Engine Phase 233, and Aipify Translate Phase 238 — never bypass resource RBAC, expose personal workload details without authorization, or expose protected resource data beyond visibility rules.",
  companionLimitations: [
    "bypassing_resource_rbac",
    "exposing_personal_workload_without_rbac",
    "exposing_protected_resource_data_beyond_rbac",
    "unlogged_resource_policy_changes",
    "replacing_human_planning_judgment",
    "modifying_capacity_audit_trail",
    "ignoring_visibility_rules",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom248(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyOrganizationalGoalsAlignment", P.base],
    ["aipify-organizational-goals-alignment-engine", P.slug],
    ["aipify_organizational_goals_alignment", P.snake],
    ["aipifyOrganizationalGoalsAlignmentEngine", P.camel],
    ["aogaebp248", P.bp],
    ["_aogae_", `_${P.helper}_`],
    ["aipify_organizational_goals_alignment_score", P.scoreKey],
    ["organizational_goals_alignment_mode", P.modeKey],
    ["organizational_goals_alignment_maturity_level", P.levelKey],
    ["organizational_goals_alignment_notes", P.thirdEntity],
    ["OrganizationalGoalsAlignmentNote", thirdPascal],
    ["organizational_goals_alignment_notes_count", `${P.thirdEntity}_count`],
    ["Goals & Alignment Phase 248", "__GOALS_PHASE_248__"],
    ["Goals & Alignment Companion", "__CAPACITY_COMPANION__"],
    ["Organizational Goals & Alignment", P.title],
    ["__CAPACITY_COMPANION__", P.companion],
    ["Goals & Alignment", "__CAPACITY_CENTER__"],
    ["__GOALS_PHASE_248__", "Goals & Alignment Phase 248"],
    ["Phase 248", `Phase ${P.phase}`],
    ["aipify_organizational_goals_alignment.view", `${P.permPrefix}.view`],
    ["aipify_organizational_goals_alignment.manage", `${P.permPrefix}.manage`],
    ["aipify_organizational_goals_alignment.steward", `${P.permPrefix}.steward`],
    ["aipify_organizational_goals_alignment_engine", P.decisionType],
    [
      "20261410000000_aipify_organizational_goals_alignment_engine_phase248.sql",
      P.migration,
    ],
    ["Repo Phase 248", `Repo Phase ${P.phase}`],
    ["Phase 248 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE248_AIPIFY_ORGANIZATIONAL_GOALS_ALIGNMENT_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase248", `implementation-blueprint-phase${P.phase}`],
    ["goals_dashboard", SCAFFOLDS[0]],
    ["company_goals_hub", SCAFFOLDS[1]],
    ["goal_types_engine", SCAFFOLDS[2]],
    ["okr_support_engine", SCAFFOLDS[3]],
    ["goal_cascade_engine", SCAFFOLDS[4]],
    ["goal_analytics_engine", SCAFFOLDS[5]],
    ["goal_governance_dashboard", SCAFFOLDS[6]],
    ["goal_review_cycles_engine", SCAFFOLDS[7]],
    ["goals_integration_center", SCAFFOLDS[8]],
    ["goals_alignment_companion", "capacity_intelligence_companion"],
    [
      "_seed_organizational_goals_alignment_notes",
      `_seed_${P.thirdEntity.replace("_notes", "")}_notes`,
    ],
    ["organizational goals alignment stewardship", "capacity intelligence stewardship"],
    ["alignment-informed decision support", "capacity-informed decision support"],
    ["accountability-first alignment culture", "planning-first capacity culture"],
    ["active goal programs", "active capacity programs"],
    ["goals requiring executive attention", "resources requiring executive attention"],
    ["Company Goals Hub", "Team Capacity Hub"],
    ["Goal Types Engine", "Resource Categories Engine"],
    ["OKR Support Engine", "Allocation Planning Engine"],
    ["Goal Cascade Engine", "Capacity Forecasting Engine"],
    ["Goal Analytics Engine", "Utilization Analytics Engine"],
    ["Goal Governance Dashboard", "Capacity Governance Dashboard"],
    ["goal review cycle indicators", "workforce balancing indicators"],
    ["goal governance prompts", "capacity governance prompts"],
    ["goals alignment assistant prompts", "capacity intelligence assistant prompts"],
    ["goal review cycles", "workload balancing suggestions"],
    ["goal progress tracking signals", "utilization tracking signals"],
    ["RBAC-protected goal policies", "RBAC-protected resource policies"],
    ["Alignment before activity", "Visibility before overload"],
    ["Focus before noise", "Capacity before burnout"],
    ["Accountability before output", "Planning before crisis"],
    ["no_bypassing_goal_rbac", "no_bypassing_resource_rbac"],
    ["AIPIFY_ORGANIZATIONAL_GOALS_ALIGNMENT_ENGINE", P.docSlug],
    ["organizational goals and alignment", "enterprise resource planning and capacity intelligence"],
    ["Organizational goals alignment audit logs", "Capacity intelligence audit logs"],
    ["goal RBAC", "resource RBAC"],
    ["goals alignment scaffolds", "capacity intelligence scaffolds"],
    ["organization goal-sharing policies", "organization visibility rules"],
    ["Goals alignment score", "Capacity intelligence score"],
    ["Goals alignment maturity level", "Capacity intelligence maturity level"],
    ["Goal ownership entries", "Resource allocation entries"],
    ["organizational goals alignment", "enterprise resource planning capacity intelligence"],
    ["goal-sharing policy stewardship", "visibility rules stewardship"],
    ["goal data beyond RBAC", "resource data beyond RBAC"],
    ["cross-level goal cascade assistance", "skills-based resource matching assistance"],
    ["manager goal reviews", "manager capacity oversight"],
    [
      "Executive Cockpit Phase 200, Action Center Phase 205, Enterprise Analytics Engine Phase 235, Employee Growth Engine Phase 219, Employee Recognition & Celebration Engine Phase 242, Enterprise Notification Engine Phase 233, Calendar Assistant Engine, Knowledge Center, and Aipify Translate Phase 238",
      "Organizational Health & Workforce Insights Engine Phase 245, Skills & Internal Talent Marketplace Engine Phase 246, Enterprise Analytics Engine Phase 235, Action Center Phase 205, Executive Cockpit Phase 200, Calendar Assistant Engine, Enterprise Notification Engine Phase 233, and Aipify Translate Phase 238",
    ],
    [
      "Never bypass goal RBAC or expose sensitive objectives without authorization",
      "Never bypass resource RBAC or expose personal workload details without authorization",
    ],
    ["goal programs", "capacity programs"],
    ["Goal programs", "Capacity programs"],
    ["sensitive objective visibility routing", "personal workload visibility routing"],
    ["exposes goal data without RBAC approval", "exposes resource data without RBAC approval"],
    [
      "Unauthorized goals access without RBAC approval",
      "Unauthorized capacity access without RBAC approval",
    ],
    ["Modifying goal audit trails", "Modifying capacity audit trails"],
    ["Output before accountability", "Overload before visibility"],
    ["user leadership judgment control", "user planning judgment control"],
    ["User leadership judgment control", "User planning judgment control"],
    ["alignment decisions and goal-sharing policy", "planning decisions and visibility rules"],
    ["goal visibility", "resource visibility"],
    ["goal governance", "capacity governance"],
    [
      "enable organizations to define, align and track strategic goals across all levels — maintaining goal RBAC, sensitive objective protection, organization-controlled goal-sharing policies, and complete audit history",
      "enable organizations to understand workload distribution, team capacity and resource utilization — maintaining resource RBAC, personal workload protection, organization-controlled visibility rules, and complete audit history",
    ],
    [
      "goal completion rates increase, organizational alignment improves, execution risks are identified faster, employee engagement with objectives increases, accountability strengthens, and strategic execution improves with alignment before activity",
      "resource utilization improves, employee overload reduces, project staffing decisions improve, organizational efficiency increases, capacity risks are detected earlier, and workforce satisfaction improves with visibility before overload",
    ],
    ["Organizational Continuity Era (244–248)", P.era],
    ["Organizational Continuity Era capstone — 244–248", `Workforce Planning Era opener — ${P.eraRange}`],
    ["Era capstone.", "Era opener."],
    ["closes the era", "opens the era"],
    ["__CAPACITY_CENTER__", P.centerTitle],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports enterprise resource planning and capacity intelligence — NOT bypassing resource RBAC, exposing personal workload details without authorization, or exposing protected resource data beyond visibility rules. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Enable organizations to understand workload distribution, team capacity and resource utilization to improve planning, reduce burnout and optimize execution — ${P.companion} informs, humans decide.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Workforce Planning Era (${P.eraRange}). Human-stewarded capacity governance; RBAC-protected resource scaffolds; resource policy changes logged; ${P.companion} informs and supports. Era opener.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations improve resource utilization, reduce employee overload, make better project staffing decisions, increase efficiency, detect capacity risks earlier, and improve workforce satisfaction with visibility before overload.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Ten capacity modules with governance'),
    jsonb_build_object('key', 'team_capacity_hub', 'label', 'Team capacity hub', 'emoji', '📋', 'description', 'Dashboards, workload, availability'),
    jsonb_build_object('key', 'resource_categories_engine', 'label', 'Resource categories engine', 'emoji', '🏆', 'description', 'Employees, contractors, teams, custom'),
    jsonb_build_object('key', 'allocation_planning_engine', 'label', 'Allocation planning engine', 'emoji', '🔗', 'description', 'Staffing, matching, forecasting'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not replace human planning judgment'),
    jsonb_build_object('key', 'utilization_analytics_engine', 'label', 'Utilization analytics engine', 'emoji', '📊', 'description', 'Utilization, department insights, executive reporting'),
    jsonb_build_object('key', 'capacity_governance_dashboard', 'label', 'Capacity governance dashboard', 'emoji', '🛡️', 'description', 'RBAC and visibility controls'),
    jsonb_build_object('key', 'capacity_forecasting_engine', 'label', 'Capacity forecasting engine', 'emoji', '🔔', 'description', 'Forecast, balance, risk alerts')
  ); ${D};
create or replace function public._${bp}_capacity_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — ten capabilities. Visibility before overload.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'capacity_dashboard', 'label', 'Team Capacity Dashboards'),
    jsonb_build_object('key', 'workload_visibility', 'label', 'Employee Workload Visibility'),
    jsonb_build_object('key', 'allocation_planning', 'label', 'Resource Allocation Planning'),
    jsonb_build_object('key', 'staffing_recommendations', 'label', 'Project Staffing Recommendations'),
    jsonb_build_object('key', 'availability_tracking', 'label', 'Availability Tracking'),
    jsonb_build_object('key', 'capacity_forecasting', 'label', 'Capacity Forecasting'),
    jsonb_build_object('key', 'skills_matching', 'label', 'Skills-Based Resource Matching'),
    jsonb_build_object('key', 'utilization_analytics', 'label', 'Utilization Analytics'),
    jsonb_build_object('key', 'workload_balancing', 'label', 'Workload Balancing Suggestions'),
    jsonb_build_object('key', 'executive_reporting', 'label', 'Executive Capacity Reporting & Risk Alerts')
  )); ${D};
create or replace function public._${bp}_team_capacity_hub() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Team capacity — capacity before burnout.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'resource_rbac', 'label', 'Does resource data follow RBAC policies?'),
    jsonb_build_object('key', 'workload_protection', 'label', 'Are personal workload details protected?'),
    jsonb_build_object('key', 'visibility_rules', 'label', 'Do organizations control visibility rules?'),
    jsonb_build_object('key', 'utilization', 'label', 'Is current utilization visible to authorized roles?'),
    jsonb_build_object('key', 'planning', 'label', 'How does forecasting support planning before crisis?')
  )); ${D};
create or replace function public._${bp}_resource_categories_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Resource categories — planning before crisis.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'employees', 'label', 'Employees'),
    jsonb_build_object('key', 'contractors', 'label', 'Contractors'),
    jsonb_build_object('key', 'consultants', 'label', 'Consultants'),
    jsonb_build_object('key', 'growth_partners', 'label', 'Growth Partners'),
    jsonb_build_object('key', 'project_teams', 'label', 'Project Teams'),
    jsonb_build_object('key', 'specialized_experts', 'label', 'Specialized Experts'),
    jsonb_build_object('key', 'temporary_staff', 'label', 'Temporary Staff'),
    jsonb_build_object('key', 'custom', 'label', 'Custom Resource Types')
  )); ${D};
create or replace function public._${bp}_workforce_balancing_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Workforce balancing — sustainable execution.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'available', 'label', 'Available'),
    jsonb_build_object('key', 'allocated', 'label', 'Allocated'),
    jsonb_build_object('key', 'near_capacity', 'label', 'Near capacity'),
    jsonb_build_object('key', 'overallocated', 'label', 'Overallocated'),
    jsonb_build_object('key', 'underutilized', 'label', 'Underutilized'),
    jsonb_build_object('key', 'burnout_risk', 'label', 'Burnout risk'),
    jsonb_build_object('key', 'shortage_forecast', 'label', 'Upcoming shortage forecast')
  )); ${D};
create or replace function public._${bp}_capacity_intelligence_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports capacity clarity and never bypasses resource RBAC or exposes personal workload details without authorization.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'detect_burnout_risk', 'label', 'Detect burnout risk through sustained overload'),
    jsonb_build_object('key', 'recommend_redistribution', 'label', 'Recommend resource redistribution'),
    jsonb_build_object('key', 'suggest_staffing', 'label', 'Suggest alternative staffing options'),
    jsonb_build_object('key', 'highlight_shortages', 'label', 'Highlight upcoming capacity shortages'),
    jsonb_build_object('key', 'surface_bottlenecks', 'label', 'Surface hidden organizational bottlenecks'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Resource RBAC — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_allocation_planning_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Allocation planning — informed staffing.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'allocation_planning', 'label', 'Resource allocation planning'),
    jsonb_build_object('key', 'staffing_recommendations', 'label', 'Project staffing recommendations'),
    jsonb_build_object('key', 'skills_matching', 'label', 'Skills-based resource matching'),
    jsonb_build_object('key', 'availability', 'label', 'Availability tracking'),
    jsonb_build_object('key', 'overallocation', 'label', 'Identify overallocated resources'),
    jsonb_build_object('key', 'underutilization', 'label', 'Identify underutilized resources')
  )); ${D};
create or replace function public._${bp}_capacity_forecasting_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Capacity forecasting — proactive workforce planning.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'current_utilization', 'label', 'View current utilization'),
    jsonb_build_object('key', 'future_capacity', 'label', 'Forecast future capacity'),
    jsonb_build_object('key', 'hiring_decisions', 'label', 'Support hiring decisions'),
    jsonb_build_object('key', 'project_planning', 'label', 'Support project planning'),
    jsonb_build_object('key', 'department_insights', 'label', 'Department capacity insights'),
    jsonb_build_object('key', 'resource_risk_alerts', 'label', 'Resource risk alerts')
  )); ${D};
create or replace function public._${bp}_utilization_analytics_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Utilization analytics — organizational efficiency visibility.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'utilization_rates', 'label', 'Resource utilization rates'),
    jsonb_build_object('key', 'overload_reduction', 'label', 'Employee overload reduction signals'),
    jsonb_build_object('key', 'staffing_quality', 'label', 'Project staffing decision quality'),
    jsonb_build_object('key', 'efficiency', 'label', 'Organizational efficiency indicators'),
    jsonb_build_object('key', 'capacity_risks', 'label', 'Early capacity risk detection'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Capacity audit visibility respects role permissions')
  )); ${D};
create or replace function public._${bp}_capacity_governance_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Capacity governance — organizations control visibility rules.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'resource_rbac', 'label', 'Resource data follows RBAC policies'),
    jsonb_build_object('key', 'workload_protection', 'label', 'Personal workload details remain protected'),
    jsonb_build_object('key', 'visibility_rules', 'label', 'Organizations control visibility rules'),
    jsonb_build_object('key', 'manager_oversight', 'label', 'Manager department capacity oversight'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Executive, Manager, Employee tiers'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for resource policy changes')
  )); ${D};
create or replace function public._${bp}_capacity_integration_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Capacity integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'organizational_health', 'label', 'Organizational Health Engine Phase 245', 'cross_link', '/app/aipify-organizational-health-workforce-insights-engine'),
    jsonb_build_object('key', 'skills_marketplace', 'label', 'Skills Marketplace Engine Phase 246', 'cross_link', '/app/aipify-skills-internal-talent-marketplace-engine'),
    jsonb_build_object('key', 'enterprise_analytics', 'label', 'Enterprise Analytics Engine Phase 235', 'cross_link', '/app/aipify-enterprise-analytics-operational-intelligence-engine'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center Phase 205', 'cross_link', '/app/aipify-action-center-execution-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-cockpit-engine'),
    jsonb_build_object('key', 'calendar_assistant', 'label', 'Calendar Assistant Engine', 'cross_link', '/app/assistant/calendars'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'aipify_translate', 'label', 'Aipify Translate Phase 238', 'cross_link', '/app/aipify-translate-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for capacity integration actions')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing resource RBAC',
      'Exposing personal workload details without authorization',
      'Exposing protected resource data beyond visibility rules',
      'Replacing human planning judgment',
      'Modifying capacity audit trails',
      'Unlogged resource policy changes',
      'Ignoring visibility rules',
      'Override human judgment'), 'principle', '${P.companion} supports — users retain planning judgment control and personal workload details stay protected.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm capacity support without surveillance pressure.', 'values', jsonb_build_array('visibility_before_overload','capacity_before_burnout','planning_before_crisis','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Capacity intelligence audit logs via aipify_enterprise_resource_planning_capacity_intelligence_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_resource_planning_capacity_intelligence permissions — resource RBAC'),
    jsonb_build_object('key', 'resource_rbac', 'label', 'Resource data follows RBAC policies'),
    jsonb_build_object('key', 'workload_protection', 'label', 'Personal workload details remain protected'),
    jsonb_build_object('key', 'visibility_rules', 'label', 'Organizations control visibility rules'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 248, 'key', 'organizational_goals_alignment', 'label', 'Goals & Alignment Phase 248', 'route', '/app/aipify-organizational-goals-alignment-engine', 'description', 'Cross-link only — prior era capstone'),
    jsonb_build_object('phase', 249, 'key', 'enterprise_resource_planning_capacity_intelligence', 'label', 'Capacity Intelligence Phase 249', 'route', '/app/${P.slug}', 'description', 'Human-stewarded resource planning — era opener')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'organizational_health', 'label', 'Organizational Health Phase 245', 'route', '/app/aipify-organizational-health-workforce-insights-engine', 'relationship', 'Health integration — cross-link only'),
    jsonb_build_object('key', 'skills_marketplace', 'label', 'Skills Marketplace Phase 246', 'route', '/app/aipify-skills-internal-talent-marketplace-engine', 'relationship', 'Skills matching integration — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-cockpit-engine', 'relationship', 'Executive Cockpit integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Capacity before burnout — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with RBAC-protected resource scaffolds and visibility rule protections. Growth Partner terminology. ${P.companion} supports — never bypasses resource RBAC or exposes personal workload details without authorization.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — users retain planning judgment control.', '${P.companion} informs and supports.', 'Visibility before overload — capacity before burnout.', 'Growth Partner — never Affiliate.', 'Workforce Planning Era opener — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — capacity signals max ~500 chars. No workload content beyond RBAC or PII in audit logs.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_organizational_goals_alignment_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._aogaebp248_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_team_capacity_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Team capacity hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_team_capacity_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_company_goals_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Team capacity hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_team_capacity_hub()->'reflection_questions') = 5,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_capacity_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Resource & Capacity — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_capacity_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_goals_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Resource & Capacity — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_capacity_dashboard()->'capabilities') = 10,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  for (const fn of [...SCAFFOLDS, "capacity_intelligence_companion"]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${P.bp}_${fn}()`);
  }

  sql = sql.replace(
    new RegExp(`select '${P.slug}'[^;]+;`, "g"),
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    /select 'aipify-organizational-goals-alignment-engine'[^;]+;/g,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected organizational goals and alignment guidance within Organizational Continuity Era;",
    "RBAC-protected enterprise resource planning and capacity intelligence guidance within Workforce Planning Era;",
  );
  sql = sql.replaceAll(
    "within Organizational Continuity Era (244–248);",
    "within Workforce Planning Era (249–253);",
  );
  sql = sql.replace(
    /Phase 249 Enterprise Resource Planning & Capacity Intelligence Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 248 Organizational Goals & Alignment Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );

  sql = sql.replace(
    /'authenticated', 248\nwhere not exists \(select 1 from public\.aipify_knowledge_categories where slug = 'aipify-organizational-goals-alignment-engine'/,
    `'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-organizational-goals-alignment-engine'`,
  );

  return sql;
}

function genMigration() {
  const src248 = path.join(
    ROOT,
    "supabase/migrations/20261410000000_aipify_organizational_goals_alignment_engine_phase248.sql",
  );
  if (!fs.existsSync(src248)) throw new Error("Phase 248 migration required");
  let m = transformFrom248(fs.readFileSync(src248, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-organizational-goals-alignment-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(
    path.join(ROOT, `lib/core/${P.slug}.ts`),
    transformFrom248(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")),
  );
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(
      path.join(dst, f),
      transformFrom248(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")),
    );
  }
  const panel = path.join(
    ROOT,
    `components/app/${srcSlug}/AipifyOrganizationalGoalsAlignmentEngineDashboardPanel.tsx`,
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`),
    transformFrom248(fs.readFileSync(panel, "utf8")),
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/index.ts`),
    `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`,
  );
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom248(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom248(
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

${P.centerTitle} within ${P.era}. **Era opener.** ${P.companion} supports team capacity dashboards, workload visibility, allocation planning, staffing recommendations, availability tracking, forecasting, skills-based matching, utilization analytics, balancing suggestions, department insights, executive reporting, and resource risk alerts — does NOT bypass resource RBAC, expose personal workload details without authorization, or expose protected resource data beyond visibility rules.

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
Era: ${P.era} (opener)
${P.crossLinkNote}
`,
  );
  write(
    path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
    `# ${P.title} Engine — FAQ (Phase ${P.phase})

## What is the Enterprise Resource Planning & Capacity Intelligence Engine?

The Enterprise Resource Planning & Capacity Intelligence Engine helps organizations understand workload distribution, team capacity and resource utilization at \`/app/${P.slug}\`.

## What capacity features are included?

Team capacity dashboards, employee workload visibility, resource allocation planning, project staffing recommendations, availability tracking, capacity forecasting, skills-based resource matching, utilization analytics, workload balancing suggestions, department capacity insights, executive capacity reporting, and resource risk alerts.

## What resource categories are supported?

Employees, contractors, consultants, Growth Partners, project teams, specialized experts, temporary staff, and custom resource types.

## What capacity capabilities are included?

View current utilization, forecast future capacity, identify overallocated resources, identify underutilized resources, support hiring decisions, and support project planning.

## What intelligence features are included?

Detect burnout risk through sustained overload, recommend resource redistribution, suggest alternative staffing options, highlight upcoming capacity shortages, surface hidden organizational bottlenecks, and encourage proactive workforce planning.

## Who can access capacity intelligence?

Super Admin (full access), Tenant Admin (organization resource settings), Executives (organization-wide visibility), Managers (department capacity oversight), Employees (personal workload visibility) — enterprise RBAC.

## Are personal workload details protected?

**Yes.** Resource data follows RBAC policies. Personal workload details remain protected. Organizations control visibility rules.

## How does this integrate with other Aipify surfaces?

${P.crossLinkNote}

## Does the Capacity Intelligence Companion replace human judgment?

**No.** ${P.companion} supports capacity clarity — it does **NOT** bypass resource RBAC, expose personal workload details without authorization, or expose protected resource data beyond visibility rules.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Capacity: team dashboards, workload visibility, allocation planning, staffing recommendations, availability, forecasting, skills matching, utilization analytics, balancing, department insights, executive reporting, risk alerts.
Categories: employees, contractors, consultants, growth partners, project teams, specialized experts, temporary staff, custom.
Capabilities: current utilization, future forecast, overallocated, underutilized, hiring support, project planning.
Intelligence: burnout risk, redistribution, alternative staffing, capacity shortages, bottlenecks, proactive planning.
Security: resource RBAC, workload protection, visibility rules, audit logging, enterprise permissions, 2FA.
Design principles: Visibility before overload, capacity before burnout, planning before crisis.
Companion limitations: no bypassing resource RBAC, no exposing personal workload, no exposing data beyond visibility rules.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate. Era opener 249–253.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never bypasses resource RBAC, exposes personal workload details without authorization, or exposes protected resource data beyond visibility rules.";
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
      '| "aipifyOrganizationalGoalsAlignmentEngine"',
      `| "aipifyOrganizationalGoalsAlignmentEngine"\n  | "${id}"`,
    );
  }
  if (!c.includes(href)) {
    const anchor =
      /id: "aipifyOrganizationalGoalsAlignmentEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyOrganizationalGoalsAlignmentEngine",\n  },/;
    c = c.replace(
      anchor,
      (m) =>
        `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-organizational-goals-alignment-engine")) {\n    return "aipifyOrganizationalGoalsAlignmentEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-organizational-goals-alignment-engine")) {\n    return "aipifyOrganizationalGoalsAlignmentEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace(
        '"aipify_organizational_goals_alignment.steward",',
        `"aipify_organizational_goals_alignment.steward",\n    "${perm}",`,
      );
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-organizational-goals-alignment-engine";',
      `export * from "./aipify-organizational-goals-alignment-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era} opener. ${P.companion} supports team capacity dashboards, workload visibility, allocation planning, forecasting, skills matching, utilization analytics, and resource risk alerts. Supports workforce planning — does NOT bypass resource RBAC. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Capacity intelligence score",
    modeLabel: "Mode",
    readinessLabel: "Capacity intelligence maturity level",
    executiveReviews: "Executive capacity reporting",
    activeReflections: "Active capacity intelligence scaffolds",
    humanOversightRequired: `Human oversight required — users retain planning judgment control; ${P.companion} supports only`,
    eraOpenerSummary: `Workforce Planning Era — Phases ${P.eraRange} (opener)`,
    eraOpenerNote:
      "Cross-link only — do not duplicate Organizational Health, Skills Marketplace, Analytics Engine, Action Center, Executive Cockpit, Calendar Assistant, Notification Engine, or Aipify Translate RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Team capacity hub — governance prompts",
    frameworkLabel: "Resource categories engine",
    reviewsLabel: "Capacity governance dashboard",
    companionLabel: `${P.companion} — supports capacity clarity, never replaces human planning judgment`,
    subEngineLabel: "Allocation planning engine",
    reflections: "Capacity intelligence scaffolds",
    executiveReviewEntries: "Resource allocation entries",
    scaffoldNotes: "RBAC-protected capacity intelligence scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT bypass resource RBAC, expose personal workload details without authorization, or expose protected resource data beyond visibility rules`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports enterprise resource planning and capacity intelligence — users retain planning judgment control and personal workload details stay protected.`,
      philosophy:
        "People First. RBAC-protected resource scaffolds. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
      growthEra: `${P.era} — Phase ${P.phase} opens the era.`,
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
        ? "Kapasitetsinnsikt"
        : locale === "sv"
          ? "Kapacitetsintelligens"
          : locale === "da"
            ? "Kapacitetsintelligens"
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
      'export * from "./implementation-blueprint-phase248-vocabulary";',
      `export * from "./implementation-blueprint-phase248-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE248_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase248-aipify-organizational-goals-alignment.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE248_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase248-aipify-organizational-goals-alignment.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_organizational_goals_alignment.view`, `aipify_organizational_goals_alignment.manage`, `aipify_organizational_goals_alignment.steward`.";
  const entry = `\n**Enterprise Resource Planning & Capacity Intelligence Engine (Phase 249):** See [AIPIFY_ENTERPRISE_RESOURCE_PLANNING_CAPACITY_INTELLIGENCE_ENGINE_PHASE249.md](./AIPIFY_ENTERPRISE_RESOURCE_PLANNING_CAPACITY_INTELLIGENCE_ENGINE_PHASE249.md) — Team capacity dashboards, workload visibility, allocation planning, staffing recommendations, availability tracking, forecasting, skills-based matching, utilization analytics, balancing suggestions, department insights, executive reporting, and resource risk alerts. **Era opener** for Workforce Planning Era (249–253). \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** bypassing resource RBAC, exposing personal workload details without authorization, or exposing protected resource data beyond visibility rules. Cross-links only: Organizational Health Engine Phase 245, Skills Marketplace Engine Phase 246, Enterprise Analytics Engine Phase 235, Action Center Phase 205, Executive Cockpit Phase 200, Calendar Assistant Engine, Enterprise Notification Engine Phase 233, Aipify Translate Phase 238. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 249")) {
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
  console.error(`Phase ${P.phase} docs generated; stack requires Phase 248 artifacts: ${err.message}`);
  process.exitCode = 1;
}
