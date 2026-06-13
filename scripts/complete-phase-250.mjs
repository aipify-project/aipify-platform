#!/usr/bin/env node
/** ABOS Phase 250 — Project Portfolio & Strategic Execution Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "portfolio_dashboard",
  "project_management_hub",
  "project_types_engine",
  "portfolio_management_engine",
  "initiative_tracking_engine",
  "cross_project_analytics_engine",
  "portfolio_governance_dashboard",
  "project_archive_engine",
  "portfolio_integration_center",
];

const P = {
  phase: 250,
  migration: "20261412000000_aipify_project_portfolio_strategic_execution_engine_phase250.sql",
  slug: "aipify-project-portfolio-strategic-execution-engine",
  base: "AipifyProjectPortfolioStrategicExecution",
  camel: "aipifyProjectPortfolioStrategicExecutionEngine",
  snake: "aipify_project_portfolio_strategic_execution",
  permPrefix: "aipify_project_portfolio_strategic_execution",
  helper: "appsee",
  bp: "appseebp250",
  decisionType: "aipify_project_portfolio_strategic_execution_engine",
  title: "Project Portfolio & Strategic Execution",
  centerTitle: "Portfolio & Execution",
  companion: "Portfolio Execution Companion",
  scoreKey: "aipify_project_portfolio_strategic_execution_score",
  modeKey: "project_portfolio_strategic_execution_mode",
  levelKey: "project_portfolio_strategic_execution_maturity_level",
  thirdEntity: "project_portfolio_strategic_execution_notes",
  era: "Workforce Planning Era (249–253)",
  eraRange: "249–253",
  docSlug: "AIPIFY_PROJECT_PORTFOLIO_STRATEGIC_EXECUTION_ENGINE",
  ilmFile: "implementation-blueprint-phase250-aipify-project-portfolio-strategic-execution.txt",
  navLabel: "Portfolio & Execution",
  crossLinkNote:
    "Cross-links only: Organizational Goals & Alignment Engine Phase 248, Action Center Phase 205, Enterprise Resource Planning & Capacity Intelligence Engine Phase 249, Enterprise Analytics Engine Phase 235, Executive Cockpit Phase 200, Enterprise Notification Engine Phase 233, Calendar Assistant Engine, and Aipify Translate Phase 238 — never bypass project RBAC, expose sensitive initiatives without authorization, or expose protected project data beyond visibility settings.",
  companionLimitations: [
    "bypassing_project_rbac",
    "exposing_sensitive_initiatives_without_rbac",
    "exposing_protected_project_data_beyond_rbac",
    "unlogged_project_policy_changes",
    "replacing_human_executive_judgment",
    "modifying_portfolio_audit_trail",
    "ignoring_project_visibility_settings",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom249(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyEnterpriseResourcePlanningCapacityIntelligence", P.base],
    ["aipify-enterprise-resource-planning-capacity-intelligence-engine", P.slug],
    ["aipify_enterprise_resource_planning_capacity_intelligence", P.snake],
    ["aipifyEnterpriseResourcePlanningCapacityIntelligenceEngine", P.camel],
    ["aerpcebp249", P.bp],
    ["_aerpce_", `_${P.helper}_`],
    ["aipify_enterprise_resource_planning_capacity_intelligence_score", P.scoreKey],
    ["enterprise_resource_planning_capacity_intelligence_mode", P.modeKey],
    ["enterprise_resource_planning_capacity_intelligence_maturity_level", P.levelKey],
    ["enterprise_resource_planning_capacity_intelligence_notes", P.thirdEntity],
    ["EnterpriseResourcePlanningCapacityIntelligenceNote", thirdPascal],
    ["enterprise_resource_planning_capacity_intelligence_notes_count", `${P.thirdEntity}_count`],
    ["Capacity Intelligence Phase 249", "__CAPACITY_PHASE_249__"],
    ["Capacity Intelligence Companion", "__PORTFOLIO_COMPANION__"],
    ["Enterprise Resource Planning & Capacity Intelligence", P.title],
    ["__PORTFOLIO_COMPANION__", P.companion],
    ["Resource & Capacity", "__PORTFOLIO_CENTER__"],
    ["__CAPACITY_PHASE_249__", "Capacity Intelligence Phase 249"],
    ["Phase 249", `Phase ${P.phase}`],
    ["aipify_enterprise_resource_planning_capacity_intelligence.view", `${P.permPrefix}.view`],
    ["aipify_enterprise_resource_planning_capacity_intelligence.manage", `${P.permPrefix}.manage`],
    ["aipify_enterprise_resource_planning_capacity_intelligence.steward", `${P.permPrefix}.steward`],
    ["aipify_enterprise_resource_planning_capacity_intelligence_engine", P.decisionType],
    [
      "20261411000000_aipify_enterprise_resource_planning_capacity_intelligence_engine_phase249.sql",
      P.migration,
    ],
    ["Repo Phase 249", `Repo Phase ${P.phase}`],
    ["Phase 249 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE249_AIPIFY_ENTERPRISE_RESOURCE_PLANNING_CAPACITY_INTELLIGENCE_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase249", `implementation-blueprint-phase${P.phase}`],
    ["capacity_dashboard", SCAFFOLDS[0]],
    ["team_capacity_hub", SCAFFOLDS[1]],
    ["resource_categories_engine", SCAFFOLDS[2]],
    ["allocation_planning_engine", SCAFFOLDS[3]],
    ["capacity_forecasting_engine", SCAFFOLDS[4]],
    ["utilization_analytics_engine", SCAFFOLDS[5]],
    ["capacity_governance_dashboard", SCAFFOLDS[6]],
    ["workforce_balancing_engine", SCAFFOLDS[7]],
    ["capacity_integration_center", SCAFFOLDS[8]],
    ["capacity_intelligence_companion", "portfolio_execution_companion"],
    [
      "_seed_enterprise_resource_planning_capacity_intelligence_notes",
      `_seed_${P.thirdEntity.replace("_notes", "")}_notes`,
    ],
    ["capacity intelligence stewardship", "portfolio execution stewardship"],
    ["capacity-informed decision support", "execution-informed decision support"],
    ["planning-first capacity culture", "priority-first portfolio culture"],
    ["active capacity programs", "active portfolio programs"],
    ["resources requiring executive attention", "projects requiring executive attention"],
    ["Team Capacity Hub", "Project Management Hub"],
    ["Resource Categories Engine", "Project Types Engine"],
    ["Allocation Planning Engine", "Portfolio Management Engine"],
    ["Capacity Forecasting Engine", "Initiative Tracking Engine"],
    ["Utilization Analytics Engine", "Cross-Project Analytics Engine"],
    ["Capacity Governance Dashboard", "Portfolio Governance Dashboard"],
    ["workforce balancing indicators", "project health indicators"],
    ["capacity governance prompts", "portfolio governance prompts"],
    ["capacity intelligence assistant prompts", "portfolio execution assistant prompts"],
    ["workload balancing suggestions", "project prioritization workflows"],
    ["utilization tracking signals", "project status reporting signals"],
    ["RBAC-protected resource policies", "RBAC-protected project policies"],
    ["Visibility before overload", "Visibility before surprise"],
    ["Capacity before burnout", "Priority before proliferation"],
    ["Planning before crisis", "Execution before expansion"],
    ["no_bypassing_resource_rbac", "no_bypassing_project_rbac"],
    ["AIPIFY_ENTERPRISE_RESOURCE_PLANNING_CAPACITY_INTELLIGENCE_ENGINE", P.docSlug],
    ["enterprise resource planning and capacity intelligence", "project portfolio and strategic execution"],
    ["Capacity intelligence audit logs", "Project portfolio strategic execution audit logs"],
    ["resource RBAC", "project RBAC"],
    ["capacity intelligence scaffolds", "portfolio execution scaffolds"],
    ["organization visibility rules", "organization project visibility settings"],
    ["Capacity intelligence score", "Portfolio execution score"],
    ["Capacity intelligence maturity level", "Portfolio execution maturity level"],
    ["Resource allocation entries", "Project owner entries"],
    ["enterprise resource planning capacity intelligence", "project portfolio strategic execution"],
    ["visibility rules stewardship", "project visibility settings stewardship"],
    ["resource data beyond RBAC", "project data beyond RBAC"],
    ["skills-based resource matching assistance", "dependency tracking assistance"],
    ["manager capacity oversight", "manager department project management"],
    [
      "Organizational Health & Workforce Insights Engine Phase 245, Skills & Internal Talent Marketplace Engine Phase 246, Enterprise Analytics Engine Phase 235, Action Center Phase 205, Executive Cockpit Phase 200, Calendar Assistant Engine, Enterprise Notification Engine Phase 233, and Aipify Translate Phase 238",
      "Organizational Goals & Alignment Engine Phase 248, Action Center Phase 205, Enterprise Resource Planning & Capacity Intelligence Engine Phase 249, Enterprise Analytics Engine Phase 235, Executive Cockpit Phase 200, Enterprise Notification Engine Phase 233, Calendar Assistant Engine, and Aipify Translate Phase 238",
    ],
    [
      "Never bypass resource RBAC or expose personal workload details without authorization",
      "Never bypass project RBAC or expose sensitive initiatives without authorization",
    ],
    ["capacity programs", "portfolio programs"],
    ["Capacity programs", "Portfolio programs"],
    ["personal workload visibility routing", "sensitive initiative visibility routing"],
    ["exposes resource data without RBAC approval", "exposes project data without RBAC approval"],
    [
      "Unauthorized capacity access without RBAC approval",
      "Unauthorized portfolio access without RBAC approval",
    ],
    ["Modifying capacity audit trails", "Modifying portfolio audit trails"],
    ["Overload before visibility", "Delay before visibility"],
    ["user planning judgment control", "user executive judgment control"],
    ["User planning judgment control", "User executive judgment control"],
    ["planning decisions and visibility rules", "execution decisions and project visibility settings"],
    ["resource visibility", "project visibility"],
    ["capacity governance", "portfolio governance"],
    [
      "enable organizations to understand workload distribution, team capacity and resource utilization — maintaining resource RBAC, personal workload protection, organization-controlled visibility rules, and complete audit history",
      "enable organizations to manage projects, portfolios and strategic initiatives through a unified framework — maintaining project RBAC, sensitive initiative protection, organization-controlled project visibility settings, and complete audit history",
    ],
    [
      "resource utilization improves, employee overload reduces, project staffing decisions improve, organizational efficiency increases, capacity risks are detected earlier, and workforce satisfaction improves with visibility before overload",
      "project completion rates increase, strategic execution improves, project delays reduce, portfolio visibility improves, executive decision-making accelerates, and cross-functional collaboration strengthens with visibility before surprise",
    ],
    ["Era opener.", "Continues the era."],
    ["opens the era", "continues the era"],
    ["Workforce Planning Era opener", "Workforce Planning Era continues"],
    ["__PORTFOLIO_CENTER__", P.centerTitle],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports project portfolio and strategic execution — NOT bypassing project RBAC, exposing sensitive initiatives without authorization, or exposing protected project data beyond visibility settings. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Enable organizations to manage projects, portfolios and strategic initiatives through a unified framework that improves visibility, prioritization and execution — ${P.companion} informs, humans decide.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Workforce Planning Era (${P.eraRange}). Human-stewarded portfolio governance; RBAC-protected project scaffolds; project policy changes logged; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations increase project completion rates, improve strategic execution, reduce project delays, improve portfolio visibility, accelerate executive decision-making, and strengthen cross-functional collaboration with visibility before surprise.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Ten portfolio modules with governance'),
    jsonb_build_object('key', 'project_management_hub', 'label', 'Project management hub', 'emoji', '📋', 'description', 'Dashboards, status, milestones'),
    jsonb_build_object('key', 'project_types_engine', 'label', 'Project types engine', 'emoji', '🏆', 'description', 'Strategic, IT, HR, custom'),
    jsonb_build_object('key', 'portfolio_management_engine', 'label', 'Portfolio management engine', 'emoji', '🔗', 'description', 'Grouping, alignment, priorities'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not replace human executive judgment'),
    jsonb_build_object('key', 'cross_project_analytics_engine', 'label', 'Cross-project analytics engine', 'emoji', '📊', 'description', 'Health, risks, portfolio performance'),
    jsonb_build_object('key', 'portfolio_governance_dashboard', 'label', 'Portfolio governance dashboard', 'emoji', '🛡️', 'description', 'RBAC and visibility controls'),
    jsonb_build_object('key', 'initiative_tracking_engine', 'label', 'Initiative tracking engine', 'emoji', '🔔', 'description', 'Strategic initiatives, dependencies, archive')
  ); ${D};
create or replace function public._${bp}_portfolio_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — ten capabilities. Visibility before surprise.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'portfolio_dashboard', 'label', 'Project Management Dashboards'),
    jsonb_build_object('key', 'portfolio_management', 'label', 'Portfolio Management'),
    jsonb_build_object('key', 'initiative_tracking', 'label', 'Strategic Initiative Tracking'),
    jsonb_build_object('key', 'project_prioritization', 'label', 'Project Prioritization'),
    jsonb_build_object('key', 'status_reporting', 'label', 'Project Status Reporting'),
    jsonb_build_object('key', 'milestone_management', 'label', 'Milestone Management'),
    jsonb_build_object('key', 'dependency_tracking', 'label', 'Dependency Tracking'),
    jsonb_build_object('key', 'risk_identification', 'label', 'Risk Identification'),
    jsonb_build_object('key', 'executive_portfolio', 'label', 'Executive Portfolio Dashboards'),
    jsonb_build_object('key', 'cross_project_analytics', 'label', 'Cross-Project Analytics & Archive')
  )); ${D};
create or replace function public._${bp}_project_management_hub() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Project management — priority before proliferation.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'project_rbac', 'label', 'Does project data follow RBAC policies?'),
    jsonb_build_object('key', 'sensitive_initiatives', 'label', 'Are sensitive initiatives restricted when required?'),
    jsonb_build_object('key', 'visibility_settings', 'label', 'Do organizations control project visibility settings?'),
    jsonb_build_object('key', 'ownership', 'label', 'Are project owners clearly assigned?'),
    jsonb_build_object('key', 'execution', 'label', 'How does tracking support execution before expansion?')
  )); ${D};
create or replace function public._${bp}_project_types_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Project types — execution before expansion.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'strategic_initiatives', 'label', 'Strategic initiatives'),
    jsonb_build_object('key', 'operational_projects', 'label', 'Operational projects'),
    jsonb_build_object('key', 'it_projects', 'label', 'IT projects'),
    jsonb_build_object('key', 'hr_initiatives', 'label', 'HR initiatives'),
    jsonb_build_object('key', 'customer_projects', 'label', 'Customer projects'),
    jsonb_build_object('key', 'innovation_programs', 'label', 'Innovation programs'),
    jsonb_build_object('key', 'transformation', 'label', 'Transformation initiatives'),
    jsonb_build_object('key', 'custom', 'label', 'Custom project types')
  )); ${D};
create or replace function public._${bp}_project_archive_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Project archive — organizational memory.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'planning', 'label', 'Planning'),
    jsonb_build_object('key', 'active', 'label', 'Active'),
    jsonb_build_object('key', 'on_track', 'label', 'On track'),
    jsonb_build_object('key', 'at_risk', 'label', 'At risk'),
    jsonb_build_object('key', 'blocked', 'label', 'Blocked'),
    jsonb_build_object('key', 'completed', 'label', 'Completed'),
    jsonb_build_object('key', 'archived', 'label', 'Archived')
  )); ${D};
create or replace function public._${bp}_portfolio_execution_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports portfolio clarity and never bypasses project RBAC or exposes sensitive initiatives without authorization.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'detect_at_risk', 'label', 'Detect at-risk projects'),
    jsonb_build_object('key', 'highlight_blocked', 'label', 'Highlight blocked initiatives'),
    jsonb_build_object('key', 'recommend_reprioritization', 'label', 'Recommend reprioritization opportunities'),
    jsonb_build_object('key', 'surface_conflicts', 'label', 'Surface resource conflicts'),
    jsonb_build_object('key', 'executive_attention', 'label', 'Identify projects requiring executive attention'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Project RBAC — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_portfolio_management_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Portfolio management — strategic alignment.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'group_projects', 'label', 'Group related projects'),
    jsonb_build_object('key', 'strategic_alignment', 'label', 'Monitor strategic alignment'),
    jsonb_build_object('key', 'compare_performance', 'label', 'Compare portfolio performance'),
    jsonb_build_object('key', 'investment_priorities', 'label', 'Track investment priorities'),
    jsonb_build_object('key', 'executive_decisions', 'label', 'Support executive decision-making'),
    jsonb_build_object('key', 'organizational_focus', 'label', 'Improve organizational focus')
  )); ${D};
create or replace function public._${bp}_initiative_tracking_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Initiative tracking — deliverable stewardship.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'create_manage', 'label', 'Create and manage projects'),
    jsonb_build_object('key', 'assign_owners', 'label', 'Assign project owners'),
    jsonb_build_object('key', 'milestones', 'label', 'Define milestones'),
    jsonb_build_object('key', 'deliverables', 'label', 'Track deliverables'),
    jsonb_build_object('key', 'project_health', 'label', 'Monitor project health'),
    jsonb_build_object('key', 'escalate_risks', 'label', 'Escalate project risks')
  )); ${D};
create or replace function public._${bp}_cross_project_analytics_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Cross-project analytics — portfolio visibility.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'completion_rates', 'label', 'Project completion rates'),
    jsonb_build_object('key', 'strategic_execution', 'label', 'Strategic execution signals'),
    jsonb_build_object('key', 'delay_reduction', 'label', 'Project delay reduction'),
    jsonb_build_object('key', 'portfolio_visibility', 'label', 'Portfolio visibility indicators'),
    jsonb_build_object('key', 'executive_decisions', 'label', 'Executive decision-making speed'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Portfolio audit visibility respects role permissions')
  )); ${D};
create or replace function public._${bp}_portfolio_governance_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Portfolio governance — organizations control project visibility.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'project_rbac', 'label', 'Project data follows RBAC policies'),
    jsonb_build_object('key', 'sensitive_initiatives', 'label', 'Sensitive initiatives may require restricted access'),
    jsonb_build_object('key', 'visibility_settings', 'label', 'Organizations control project visibility settings'),
    jsonb_build_object('key', 'manager_oversight', 'label', 'Manager department project management'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Executive, Manager, Project Owner, Employee tiers'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for project policy changes')
  )); ${D};
create or replace function public._${bp}_portfolio_integration_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Portfolio integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'goals_alignment', 'label', 'Organizational Goals & Alignment Engine Phase 248', 'cross_link', '/app/aipify-organizational-goals-alignment-engine'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center Phase 205', 'cross_link', '/app/aipify-action-center-execution-engine'),
    jsonb_build_object('key', 'capacity_intelligence', 'label', 'Capacity Intelligence Engine Phase 249', 'cross_link', '/app/aipify-enterprise-resource-planning-capacity-intelligence-engine'),
    jsonb_build_object('key', 'enterprise_analytics', 'label', 'Enterprise Analytics Engine Phase 235', 'cross_link', '/app/aipify-enterprise-analytics-operational-intelligence-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-cockpit-engine'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'calendar_assistant', 'label', 'Calendar Assistant Engine', 'cross_link', '/app/assistant/calendars'),
    jsonb_build_object('key', 'aipify_translate', 'label', 'Aipify Translate Phase 238', 'cross_link', '/app/aipify-translate-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for portfolio integration actions')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing project RBAC',
      'Exposing sensitive initiatives without authorization',
      'Exposing protected project data beyond visibility settings',
      'Replacing human executive judgment',
      'Modifying portfolio audit trails',
      'Unlogged project policy changes',
      'Ignoring project visibility settings',
      'Override human judgment'), 'principle', '${P.companion} supports — users retain executive judgment control and sensitive initiatives stay protected.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm portfolio support without pressure.', 'values', jsonb_build_array('visibility_before_surprise','priority_before_proliferation','execution_before_expansion','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Project portfolio strategic execution audit logs via aipify_project_portfolio_strategic_execution_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_project_portfolio_strategic_execution permissions — project RBAC'),
    jsonb_build_object('key', 'project_rbac', 'label', 'Project data follows RBAC policies'),
    jsonb_build_object('key', 'sensitive_initiatives', 'label', 'Sensitive initiatives may require restricted access'),
    jsonb_build_object('key', 'visibility_settings', 'label', 'Organizations control project visibility settings'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 249, 'key', 'enterprise_resource_planning_capacity_intelligence', 'label', 'Capacity Intelligence Phase 249', 'route', '/app/aipify-enterprise-resource-planning-capacity-intelligence-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 250, 'key', 'project_portfolio_strategic_execution', 'label', 'Portfolio & Execution Phase 250', 'route', '/app/${P.slug}', 'description', 'Human-stewarded project portfolio and strategic execution')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'goals_alignment', 'label', 'Goals & Alignment Phase 248', 'route', '/app/aipify-organizational-goals-alignment-engine', 'relationship', 'Goals alignment integration — cross-link only'),
    jsonb_build_object('key', 'capacity_intelligence', 'label', 'Capacity Intelligence Phase 249', 'route', '/app/aipify-enterprise-resource-planning-capacity-intelligence-engine', 'relationship', 'Capacity integration — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-cockpit-engine', 'relationship', 'Executive Cockpit integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Priority before proliferation — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with RBAC-protected project scaffolds and visibility setting protections. Growth Partner terminology. ${P.companion} supports — never bypasses project RBAC or exposes sensitive initiatives without authorization.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — users retain executive judgment control.', '${P.companion} informs and supports.', 'Visibility before surprise — priority before proliferation.', 'Growth Partner — never Affiliate.', 'Workforce Planning Era continues — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — portfolio signals max ~500 chars. No project content beyond RBAC or PII in audit logs.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_enterprise_resource_planning_capacity_intelligence_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._aerpcebp249_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_project_management_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Project management hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_project_management_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_team_capacity_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Project management hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_project_management_hub()->'reflection_questions') = 5,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_portfolio_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Portfolio & Execution — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_portfolio_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_capacity_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Portfolio & Execution — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_portfolio_dashboard()->'capabilities') = 10,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  for (const fn of [...SCAFFOLDS, "portfolio_execution_companion"]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${P.bp}_${fn}()`);
  }

  sql = sql.replace(
    new RegExp(`select '${P.slug}'[^;]+;`, "g"),
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    /select 'aipify-enterprise-resource-planning-capacity-intelligence-engine'[^;]+;/g,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected enterprise resource planning and capacity intelligence guidance within Workforce Planning Era;",
    "RBAC-protected project portfolio and strategic execution guidance within Workforce Planning Era;",
  );
  sql = sql.replace(
    /Phase 250 Project Portfolio & Strategic Execution Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 249 Enterprise Resource Planning & Capacity Intelligence Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );

  sql = sql.replace(
    /'authenticated', 249\nwhere not exists \(select 1 from public\.aipify_knowledge_categories where slug = 'aipify-enterprise-resource-planning-capacity-intelligence-engine'/,
    `'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-enterprise-resource-planning-capacity-intelligence-engine'`,
  );

  return sql;
}

function genMigration() {
  const src249 = path.join(
    ROOT,
    "supabase/migrations/20261411000000_aipify_enterprise_resource_planning_capacity_intelligence_engine_phase249.sql",
  );
  if (!fs.existsSync(src249)) throw new Error("Phase 249 migration required");
  let m = transformFrom249(fs.readFileSync(src249, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-enterprise-resource-planning-capacity-intelligence-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(
    path.join(ROOT, `lib/core/${P.slug}.ts`),
    transformFrom249(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")),
  );
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(
      path.join(dst, f),
      transformFrom249(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")),
    );
  }
  const panel = path.join(
    ROOT,
    `components/app/${srcSlug}/AipifyEnterpriseResourcePlanningCapacityIntelligenceEngineDashboardPanel.tsx`,
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`),
    transformFrom249(fs.readFileSync(panel, "utf8")),
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/index.ts`),
    `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`,
  );
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom249(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom249(
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

${P.centerTitle} within ${P.era}. ${P.companion} supports project management dashboards, portfolio management, strategic initiative tracking, prioritization, status reporting, milestones, dependencies, risk identification, executive portfolio dashboards, health indicators, cross-project analytics, and archive management — does NOT bypass project RBAC, expose sensitive initiatives without authorization, or expose protected project data beyond visibility settings.

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

## What is the Project Portfolio & Strategic Execution Engine?

The Project Portfolio & Strategic Execution Engine helps organizations manage projects, portfolios and strategic initiatives at \`/app/${P.slug}\`.

## What project features are included?

Project management dashboards, portfolio management, strategic initiative tracking, project prioritization, project status reporting, milestone management, dependency tracking, risk identification, executive portfolio dashboards, project health indicators, cross-project analytics, and project archive management.

## What project types are supported?

Strategic initiatives, operational projects, IT projects, HR initiatives, customer projects, innovation programs, transformation initiatives, and custom project types.

## What portfolio capabilities are included?

Group related projects, monitor strategic alignment, compare portfolio performance, track investment priorities, support executive decision-making, and improve organizational focus.

## What intelligence features are included?

Detect at-risk projects, highlight blocked initiatives, recommend reprioritization opportunities, surface resource conflicts, identify projects requiring executive attention, and encourage proactive intervention.

## Who can access portfolio management?

Super Admin (full access), Tenant Admin (organization project settings), Executives (portfolio oversight), Managers (department project management), Project Owners (assigned responsibilities), Employees (project participation) — enterprise RBAC.

## Are sensitive initiatives protected?

**Yes.** Project data follows RBAC policies. Sensitive initiatives may require restricted access. Organizations control project visibility settings.

## How does this integrate with other Aipify surfaces?

${P.crossLinkNote}

## Does the Portfolio Execution Companion replace human judgment?

**No.** ${P.companion} supports portfolio clarity — it does **NOT** bypass project RBAC, expose sensitive initiatives without authorization, or expose protected project data beyond visibility settings.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Projects: dashboards, portfolio, initiative tracking, prioritization, status, milestones, dependencies, risks, executive portfolio, health, analytics, archive.
Types: strategic, operational, IT, HR, customer, innovation, transformation, custom.
Portfolio: group projects, strategic alignment, performance comparison, investment priorities, executive decisions, organizational focus.
Intelligence: at-risk projects, blocked initiatives, reprioritization, resource conflicts, executive attention, proactive intervention.
Security: project RBAC, sensitive initiative protection, visibility settings, audit logging, enterprise permissions, 2FA.
Design principles: Visibility before surprise, priority before proliferation, execution before expansion.
Companion limitations: no bypassing project RBAC, no exposing sensitive initiatives, no exposing data beyond visibility settings.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate. Workforce Planning Era 249–253.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never bypasses project RBAC, exposes sensitive initiatives without authorization, or exposes protected project data beyond visibility settings.";
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
      '| "aipifyEnterpriseResourcePlanningCapacityIntelligenceEngine"',
      `| "aipifyEnterpriseResourcePlanningCapacityIntelligenceEngine"\n  | "${id}"`,
    );
  }
  if (!c.includes(href)) {
    const anchor =
      /id: "aipifyEnterpriseResourcePlanningCapacityIntelligenceEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyEnterpriseResourcePlanningCapacityIntelligenceEngine",\n  },/;
    c = c.replace(
      anchor,
      (m) =>
        `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-enterprise-resource-planning-capacity-intelligence-engine")) {\n    return "aipifyEnterpriseResourcePlanningCapacityIntelligenceEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-enterprise-resource-planning-capacity-intelligence-engine")) {\n    return "aipifyEnterpriseResourcePlanningCapacityIntelligenceEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace(
        '"aipify_enterprise_resource_planning_capacity_intelligence.steward",',
        `"aipify_enterprise_resource_planning_capacity_intelligence.steward",\n    "${perm}",`,
      );
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-enterprise-resource-planning-capacity-intelligence-engine";',
      `export * from "./aipify-enterprise-resource-planning-capacity-intelligence-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports project dashboards, portfolio management, initiative tracking, prioritization, milestones, dependencies, risk identification, and executive portfolio views. Supports strategic execution — does NOT bypass project RBAC. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Portfolio execution score",
    modeLabel: "Mode",
    readinessLabel: "Portfolio execution maturity level",
    executiveReviews: "Executive portfolio dashboards",
    activeReflections: "Active portfolio execution scaffolds",
    humanOversightRequired: `Human oversight required — users retain executive judgment control; ${P.companion} supports only`,
    eraOpenerSummary: `Workforce Planning Era — Phases ${P.eraRange}`,
    eraOpenerNote:
      "Cross-link only — do not duplicate Goals & Alignment, Capacity Intelligence, Action Center, Analytics Engine, Executive Cockpit, Calendar Assistant, Notification Engine, or Aipify Translate RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Project management hub — governance prompts",
    frameworkLabel: "Project types engine",
    reviewsLabel: "Portfolio governance dashboard",
    companionLabel: `${P.companion} — supports portfolio clarity, never replaces human executive judgment`,
    subEngineLabel: "Portfolio management engine",
    reflections: "Portfolio execution scaffolds",
    executiveReviewEntries: "Project owner entries",
    scaffoldNotes: "RBAC-protected portfolio execution scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT bypass project RBAC, expose sensitive initiatives without authorization, or expose protected project data beyond visibility settings`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports project portfolio and strategic execution — users retain executive judgment control and sensitive initiatives stay protected.`,
      philosophy:
        "People First. RBAC-protected project scaffolds. Growth Partner terminology — never Affiliate.",
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
        ? "Portefølje og gjennomføring"
        : locale === "sv"
          ? "Portfölj och genomförande"
          : locale === "da"
            ? "Portefølje og eksekvering"
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
      'export * from "./implementation-blueprint-phase249-vocabulary";',
      `export * from "./implementation-blueprint-phase249-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE249_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase249-aipify-enterprise-resource-planning-capacity-intelligence.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE249_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase249-aipify-enterprise-resource-planning-capacity-intelligence.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_enterprise_resource_planning_capacity_intelligence.view`, `aipify_enterprise_resource_planning_capacity_intelligence.manage`, `aipify_enterprise_resource_planning_capacity_intelligence.steward`.";
  const entry = `\n**Project Portfolio & Strategic Execution Engine (Phase 250):** See [AIPIFY_PROJECT_PORTFOLIO_STRATEGIC_EXECUTION_ENGINE_PHASE250.md](./AIPIFY_PROJECT_PORTFOLIO_STRATEGIC_EXECUTION_ENGINE_PHASE250.md) — Project management dashboards, portfolio management, strategic initiative tracking, prioritization, status reporting, milestones, dependencies, risk identification, executive portfolio dashboards, health indicators, cross-project analytics, and archive management. Continues Workforce Planning Era (249–253). \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** bypassing project RBAC, exposing sensitive initiatives without authorization, or exposing protected project data beyond visibility settings. Cross-links only: Organizational Goals & Alignment Engine Phase 248, Action Center Phase 205, Capacity Intelligence Engine Phase 249, Enterprise Analytics Engine Phase 235, Executive Cockpit Phase 200, Enterprise Notification Engine Phase 233, Calendar Assistant Engine, Aipify Translate Phase 238. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 250")) {
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
  console.error(`Phase ${P.phase} docs generated; stack requires Phase 249 artifacts: ${err.message}`);
  process.exitCode = 1;
}
