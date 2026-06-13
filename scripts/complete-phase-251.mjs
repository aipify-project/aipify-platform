#!/usr/bin/env node
/** ABOS Phase 251 — Decision Intelligence & Recommendation Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "decision_dashboard",
  "decision_request_hub",
  "decision_types_engine",
  "recommendation_workflows_engine",
  "decision_history_engine",
  "decision_analytics_engine",
  "decision_governance_dashboard",
  "decision_knowledge_archive_engine",
  "decision_integration_center",
];

const P = {
  phase: 251,
  migration: "20261413000000_aipify_decision_intelligence_recommendation_engine_phase251.sql",
  slug: "aipify-decision-intelligence-recommendation-engine",
  base: "AipifyDecisionIntelligenceRecommendation",
  camel: "aipifyDecisionIntelligenceRecommendationEngine",
  snake: "aipify_decision_intelligence_recommendation",
  permPrefix: "aipify_decision_intelligence_recommendation",
  helper: "adire",
  bp: "adirebp251",
  decisionType: "aipify_decision_intelligence_recommendation_engine",
  title: "Decision Intelligence & Recommendation",
  centerTitle: "Decision Intelligence",
  companion: "Decision Intelligence Companion",
  scoreKey: "aipify_decision_intelligence_recommendation_score",
  modeKey: "decision_intelligence_recommendation_mode",
  levelKey: "decision_intelligence_recommendation_maturity_level",
  thirdEntity: "decision_intelligence_recommendation_notes",
  era: "Workforce Planning Era (249–253)",
  eraRange: "249–253",
  docSlug: "AIPIFY_DECISION_INTELLIGENCE_RECOMMENDATION_ENGINE",
  ilmFile: "implementation-blueprint-phase251-aipify-decision-intelligence-recommendation.txt",
  navLabel: "Decision Intelligence",
  crossLinkNote:
    "Cross-links only: Executive Cockpit Phase 200, Enterprise Analytics Engine Phase 235, Meeting Intelligence & Follow-Up Engine Phase 206, Action Center Phase 205, Project Portfolio & Strategic Execution Engine Phase 250, Organizational Goals & Alignment Engine Phase 248, Enterprise Search Engine, Knowledge Center, Enterprise Notification Engine Phase 233, and Aipify Translate Phase 238 — never bypass decision RBAC, expose sensitive decisions without authorization, or expose protected decision records beyond retention policies.",
  companionLimitations: [
    "bypassing_decision_rbac",
    "exposing_sensitive_decisions_without_rbac",
    "exposing_protected_decision_records_beyond_rbac",
    "unlogged_decision_policy_changes",
    "replacing_human_decision_judgment",
    "modifying_decision_audit_trail",
    "ignoring_decision_retention_policies",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom250(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyProjectPortfolioStrategicExecution", P.base],
    ["aipify-project-portfolio-strategic-execution-engine", P.slug],
    ["aipify_project_portfolio_strategic_execution", P.snake],
    ["aipifyProjectPortfolioStrategicExecutionEngine", P.camel],
    ["appseebp250", P.bp],
    ["_appsee_", `_${P.helper}_`],
    ["aipify_project_portfolio_strategic_execution_score", P.scoreKey],
    ["project_portfolio_strategic_execution_mode", P.modeKey],
    ["project_portfolio_strategic_execution_maturity_level", P.levelKey],
    ["project_portfolio_strategic_execution_notes", P.thirdEntity],
    ["ProjectPortfolioStrategicExecutionNote", thirdPascal],
    ["project_portfolio_strategic_execution_notes_count", `${P.thirdEntity}_count`],
    ["Portfolio & Execution Phase 250", "__PORTFOLIO_PHASE_250__"],
    ["Portfolio Execution Companion", "__DECISION_COMPANION__"],
    ["Project Portfolio & Strategic Execution", P.title],
    ["__DECISION_COMPANION__", P.companion],
    ["Portfolio & Execution", "__DECISION_CENTER__"],
    ["__PORTFOLIO_PHASE_250__", "Portfolio & Execution Phase 250"],
    ["Phase 250", `Phase ${P.phase}`],
    ["aipify_project_portfolio_strategic_execution.view", `${P.permPrefix}.view`],
    ["aipify_project_portfolio_strategic_execution.manage", `${P.permPrefix}.manage`],
    ["aipify_project_portfolio_strategic_execution.steward", `${P.permPrefix}.steward`],
    ["aipify_project_portfolio_strategic_execution_engine", P.decisionType],
    [
      "20261412000000_aipify_project_portfolio_strategic_execution_engine_phase250.sql",
      P.migration,
    ],
    ["Repo Phase 250", `Repo Phase ${P.phase}`],
    ["Phase 250 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE250_AIPIFY_PROJECT_PORTFOLIO_STRATEGIC_EXECUTION_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase250", `implementation-blueprint-phase${P.phase}`],
    ["portfolio_dashboard", SCAFFOLDS[0]],
    ["project_management_hub", SCAFFOLDS[1]],
    ["project_types_engine", SCAFFOLDS[2]],
    ["portfolio_management_engine", SCAFFOLDS[3]],
    ["initiative_tracking_engine", SCAFFOLDS[4]],
    ["cross_project_analytics_engine", SCAFFOLDS[5]],
    ["portfolio_governance_dashboard", SCAFFOLDS[6]],
    ["project_archive_engine", SCAFFOLDS[7]],
    ["portfolio_integration_center", SCAFFOLDS[8]],
    ["portfolio_execution_companion", "decision_intelligence_companion"],
    [
      "_seed_project_portfolio_strategic_execution_notes",
      `_seed_${P.thirdEntity.replace("_notes", "")}_notes`,
    ],
    ["portfolio execution stewardship", "decision intelligence stewardship"],
    ["execution-informed decision support", "recommendation-informed decision support"],
    ["priority-first portfolio culture", "evidence-first decision culture"],
    ["active portfolio programs", "active decision programs"],
    ["projects requiring executive attention", "decisions requiring executive attention"],
    ["Project Management Hub", "Decision Request Hub"],
    ["Project Types Engine", "Decision Types Engine"],
    ["Portfolio Management Engine", "Recommendation Workflows Engine"],
    ["Initiative Tracking Engine", "Decision History Engine"],
    ["Cross-Project Analytics Engine", "Decision Analytics Engine"],
    ["Portfolio Governance Dashboard", "Decision Governance Dashboard"],
    ["project health indicators", "decision impact indicators"],
    ["portfolio governance prompts", "decision governance prompts"],
    ["portfolio execution assistant prompts", "decision intelligence assistant prompts"],
    ["project prioritization workflows", "decision approval processes"],
    ["project status reporting signals", "decision follow-up tracking signals"],
    ["RBAC-protected project policies", "RBAC-protected decision policies"],
    ["Visibility before surprise", "Evidence before impulse"],
    ["Priority before proliferation", "Context before conclusion"],
    ["Execution before expansion", "Learning before repetition"],
    ["no_bypassing_project_rbac", "no_bypassing_decision_rbac"],
    ["AIPIFY_PROJECT_PORTFOLIO_STRATEGIC_EXECUTION_ENGINE", P.docSlug],
    ["project portfolio and strategic execution", "decision intelligence and recommendation"],
    ["Project portfolio strategic execution audit logs", "Decision intelligence recommendation audit logs"],
    ["project RBAC", "decision RBAC"],
    ["portfolio execution scaffolds", "decision intelligence scaffolds"],
    ["organization project visibility settings", "organization decision retention policies"],
    ["Portfolio execution score", "Decision intelligence score"],
    ["Portfolio execution maturity level", "Decision intelligence maturity level"],
    ["Project owner entries", "Decision ownership entries"],
    ["project portfolio strategic execution", "decision intelligence recommendation"],
    ["project visibility settings stewardship", "decision retention policy stewardship"],
    ["project data beyond RBAC", "decision records beyond RBAC"],
    ["dependency tracking assistance", "multi-stakeholder review assistance"],
    ["manager department project management", "manager department decision management"],
    [
      "Organizational Goals & Alignment Engine Phase 248, Action Center Phase 205, Enterprise Resource Planning & Capacity Intelligence Engine Phase 249, Enterprise Analytics Engine Phase 235, Executive Cockpit Phase 200, Enterprise Notification Engine Phase 233, Calendar Assistant Engine, and Aipify Translate Phase 238",
      "Executive Cockpit Phase 200, Enterprise Analytics Engine Phase 235, Meeting Intelligence & Follow-Up Engine Phase 206, Action Center Phase 205, Project Portfolio & Strategic Execution Engine Phase 250, Organizational Goals & Alignment Engine Phase 248, Enterprise Search Engine, Knowledge Center, Enterprise Notification Engine Phase 233, and Aipify Translate Phase 238",
    ],
    [
      "Never bypass project RBAC or expose sensitive initiatives without authorization",
      "Never bypass decision RBAC or expose sensitive decisions without authorization",
    ],
    ["portfolio programs", "decision programs"],
    ["Portfolio programs", "Decision programs"],
    ["sensitive initiative visibility routing", "sensitive decision visibility routing"],
    ["exposes project data without RBAC approval", "exposes decision records without RBAC approval"],
    [
      "Unauthorized portfolio access without RBAC approval",
      "Unauthorized decision access without RBAC approval",
    ],
    ["Modifying portfolio audit trails", "Modifying decision audit trails"],
    ["Delay before visibility", "Impulse before evidence"],
    ["user executive judgment control", "user decision judgment control"],
    ["User executive judgment control", "User decision judgment control"],
    ["execution decisions and project visibility settings", "recommendation decisions and decision retention policies"],
    ["project visibility", "decision visibility"],
    ["portfolio governance", "decision governance"],
    [
      "enable organizations to manage projects, portfolios and strategic initiatives through a unified framework — maintaining project RBAC, sensitive initiative protection, organization-controlled project visibility settings, and complete audit history",
      "enable organizations to make better decisions through structured recommendations, relevant context and decision support — maintaining decision RBAC, sensitive decision protection, organization-controlled retention policies, and complete audit history",
    ],
    [
      "project completion rates increase, strategic execution improves, project delays reduce, portfolio visibility improves, executive decision-making accelerates, and cross-functional collaboration strengthens with visibility before surprise",
      "decision quality improves, decision cycles accelerate, transparency increases, stakeholder alignment strengthens, repeated mistakes reduce, and organizational learning increases with evidence before impulse",
    ],
    ["__DECISION_CENTER__", P.centerTitle],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports decision intelligence and recommendation — NOT bypassing decision RBAC, exposing sensitive decisions without authorization, or exposing protected decision records beyond retention policies. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Enable organizations to make better decisions by providing structured recommendations, relevant context and decision support across the Aipify ecosystem — ${P.companion} informs, humans decide.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Workforce Planning Era (${P.eraRange}). Human-stewarded decision governance; RBAC-protected decision scaffolds; decision policy changes logged; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations improve decision quality, accelerate decision cycles, increase transparency, strengthen stakeholder alignment, reduce repeated mistakes, and increase organizational learning with evidence before impulse.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Ten decision modules with governance'),
    jsonb_build_object('key', 'decision_request_hub', 'label', 'Decision request hub', 'emoji', '📋', 'description', 'Requests, context, alternatives'),
    jsonb_build_object('key', 'decision_types_engine', 'label', 'Decision types engine', 'emoji', '🏆', 'description', 'Strategic, operational, financial, custom'),
    jsonb_build_object('key', 'recommendation_workflows_engine', 'label', 'Recommendation workflows engine', 'emoji', '🔗', 'description', 'Recommendations, reviews, approvals'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not replace human decision judgment'),
    jsonb_build_object('key', 'decision_analytics_engine', 'label', 'Decision analytics engine', 'emoji', '📊', 'description', 'History, impact, executive briefings'),
    jsonb_build_object('key', 'decision_governance_dashboard', 'label', 'Decision governance dashboard', 'emoji', '🛡️', 'description', 'RBAC and retention controls'),
    jsonb_build_object('key', 'decision_history_engine', 'label', 'Decision history engine', 'emoji', '🔔', 'description', 'Rationale, outcomes, follow-up')
  ); ${D};
create or replace function public._${bp}_decision_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — ten capabilities. Evidence before impulse.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'decision_dashboard', 'label', 'Decision Dashboards'),
    jsonb_build_object('key', 'recommendation_workflows', 'label', 'Decision Recommendation Workflows'),
    jsonb_build_object('key', 'decision_requests', 'label', 'Decision Request Creation'),
    jsonb_build_object('key', 'decision_history', 'label', 'Decision History Tracking'),
    jsonb_build_object('key', 'rationale_documentation', 'label', 'Decision Rationale Documentation'),
    jsonb_build_object('key', 'impact_assessments', 'label', 'Decision Impact Assessments'),
    jsonb_build_object('key', 'stakeholder_reviews', 'label', 'Multi-Stakeholder Reviews'),
    jsonb_build_object('key', 'approval_processes', 'label', 'Decision Approval Processes'),
    jsonb_build_object('key', 'decision_analytics', 'label', 'Decision Analytics'),
    jsonb_build_object('key', 'executive_briefings', 'label', 'Executive Briefings & Knowledge Archive')
  )); ${D};
create or replace function public._${bp}_decision_request_hub() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Decision requests — context before conclusion.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'decision_rbac', 'label', 'Do decision records follow RBAC policies?'),
    jsonb_build_object('key', 'sensitive_decisions', 'label', 'Are sensitive decisions restricted when required?'),
    jsonb_build_object('key', 'retention_policies', 'label', 'Do organizations control decision retention policies?'),
    jsonb_build_object('key', 'ownership', 'label', 'Is decision ownership clearly assigned?'),
    jsonb_build_object('key', 'evidence', 'label', 'How does context support evidence before impulse?')
  )); ${D};
create or replace function public._${bp}_decision_types_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Decision types — learning before repetition.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'strategic', 'label', 'Strategic decisions'),
    jsonb_build_object('key', 'operational', 'label', 'Operational decisions'),
    jsonb_build_object('key', 'financial', 'label', 'Financial decisions'),
    jsonb_build_object('key', 'hiring', 'label', 'Hiring decisions'),
    jsonb_build_object('key', 'project', 'label', 'Project decisions'),
    jsonb_build_object('key', 'risk', 'label', 'Risk-related decisions'),
    jsonb_build_object('key', 'customer', 'label', 'Customer decisions'),
    jsonb_build_object('key', 'custom', 'label', 'Custom decision types')
  )); ${D};
create or replace function public._${bp}_decision_knowledge_archive_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Decision knowledge archive — organizational learning.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'draft', 'label', 'Draft'),
    jsonb_build_object('key', 'under_review', 'label', 'Under review'),
    jsonb_build_object('key', 'pending_approval', 'label', 'Pending approval'),
    jsonb_build_object('key', 'approved', 'label', 'Approved'),
    jsonb_build_object('key', 'implemented', 'label', 'Implemented'),
    jsonb_build_object('key', 'follow_up', 'label', 'Follow-up tracking'),
    jsonb_build_object('key', 'archived', 'label', 'Archived')
  )); ${D};
create or replace function public._${bp}_decision_intelligence_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports decision clarity and never bypasses decision RBAC or exposes sensitive decisions without authorization.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'recommend_information', 'label', 'Recommend relevant information'),
    jsonb_build_object('key', 'historical_decisions', 'label', 'Surface similar historical decisions'),
    jsonb_build_object('key', 'highlight_risks', 'label', 'Highlight potential risks'),
    jsonb_build_object('key', 'missing_stakeholders', 'label', 'Identify missing stakeholders'),
    jsonb_build_object('key', 'follow_up_actions', 'label', 'Suggest follow-up actions'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Decision RBAC — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_recommendation_workflows_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Recommendation workflows — structured support.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'capture_context', 'label', 'Capture decision context'),
    jsonb_build_object('key', 'identify_alternatives', 'label', 'Identify alternatives'),
    jsonb_build_object('key', 'pros_cons', 'label', 'Document pros and cons'),
    jsonb_build_object('key', 'record_outcomes', 'label', 'Record decision outcomes'),
    jsonb_build_object('key', 'collaborative', 'label', 'Support collaborative decision-making'),
    jsonb_build_object('key', 'preserve_learning', 'label', 'Preserve organizational learning')
  )); ${D};
create or replace function public._${bp}_decision_history_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Decision history — implementation stewardship.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'history_tracking', 'label', 'Decision history tracking'),
    jsonb_build_object('key', 'rationale', 'label', 'Decision rationale documentation'),
    jsonb_build_object('key', 'impact_assessment', 'label', 'Decision impact assessments'),
    jsonb_build_object('key', 'implementation', 'label', 'Track implementation progress'),
    jsonb_build_object('key', 'follow_up', 'label', 'Decision follow-up tracking'),
    jsonb_build_object('key', 'executive_briefings', 'label', 'Executive decision briefings')
  )); ${D};
create or replace function public._${bp}_decision_analytics_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Decision analytics — transparency and learning.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'decision_quality', 'label', 'Decision quality signals'),
    jsonb_build_object('key', 'cycle_speed', 'label', 'Decision cycle speed'),
    jsonb_build_object('key', 'transparency', 'label', 'Transparency indicators'),
    jsonb_build_object('key', 'stakeholder_alignment', 'label', 'Stakeholder alignment'),
    jsonb_build_object('key', 'learning', 'label', 'Organizational learning indicators'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Decision audit visibility respects role permissions')
  )); ${D};
create or replace function public._${bp}_decision_governance_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Decision governance — organizations control retention policies.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'decision_rbac', 'label', 'Decision records follow RBAC policies'),
    jsonb_build_object('key', 'sensitive_decisions', 'label', 'Sensitive decisions may require restricted access'),
    jsonb_build_object('key', 'retention_policies', 'label', 'Organizations control decision retention policies'),
    jsonb_build_object('key', 'manager_oversight', 'label', 'Manager department decision management'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Executive, Manager, Employee tiers'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for decision policy changes')
  )); ${D};
create or replace function public._${bp}_decision_integration_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Decision integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-cockpit-engine'),
    jsonb_build_object('key', 'enterprise_analytics', 'label', 'Enterprise Analytics Engine Phase 235', 'cross_link', '/app/aipify-enterprise-analytics-operational-intelligence-engine'),
    jsonb_build_object('key', 'meeting_intelligence', 'label', 'Meeting Intelligence Engine Phase 206', 'cross_link', '/app/aipify-meeting-intelligence-follow-up-engine'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center Phase 205', 'cross_link', '/app/aipify-action-center-execution-engine'),
    jsonb_build_object('key', 'project_portfolio', 'label', 'Project Portfolio Engine Phase 250', 'cross_link', '/app/aipify-project-portfolio-strategic-execution-engine'),
    jsonb_build_object('key', 'goals_alignment', 'label', 'Organizational Goals Engine Phase 248', 'cross_link', '/app/aipify-organizational-goals-alignment-engine'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'cross_link', '/app/aipify-enterprise-knowledge-center-engine'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'aipify_translate', 'label', 'Aipify Translate Phase 238', 'cross_link', '/app/aipify-translate-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for decision integration actions')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing decision RBAC',
      'Exposing sensitive decisions without authorization',
      'Exposing protected decision records beyond retention policies',
      'Replacing human decision judgment',
      'Modifying decision audit trails',
      'Unlogged decision policy changes',
      'Ignoring decision retention policies',
      'Override human judgment'), 'principle', '${P.companion} supports — users retain decision judgment control and sensitive decisions stay protected.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm decision support without pressure.', 'values', jsonb_build_array('evidence_before_impulse','context_before_conclusion','learning_before_repetition','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Decision intelligence recommendation audit logs via aipify_decision_intelligence_recommendation_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_decision_intelligence_recommendation permissions — decision RBAC'),
    jsonb_build_object('key', 'decision_rbac', 'label', 'Decision records follow RBAC policies'),
    jsonb_build_object('key', 'sensitive_decisions', 'label', 'Sensitive decisions may require restricted access'),
    jsonb_build_object('key', 'retention_policies', 'label', 'Organizations control decision retention policies'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 250, 'key', 'project_portfolio_strategic_execution', 'label', 'Portfolio & Execution Phase 250', 'route', '/app/aipify-project-portfolio-strategic-execution-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 251, 'key', 'decision_intelligence_recommendation', 'label', 'Decision Intelligence Phase 251', 'route', '/app/${P.slug}', 'description', 'Human-stewarded decision intelligence and recommendation')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-cockpit-engine', 'relationship', 'Executive Cockpit integration — cross-link only'),
    jsonb_build_object('key', 'meeting_intelligence', 'label', 'Meeting Intelligence Phase 206', 'route', '/app/aipify-meeting-intelligence-follow-up-engine', 'relationship', 'Meeting integration — cross-link only'),
    jsonb_build_object('key', 'project_portfolio', 'label', 'Project Portfolio Phase 250', 'route', '/app/aipify-project-portfolio-strategic-execution-engine', 'relationship', 'Portfolio integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Context before conclusion — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with RBAC-protected decision scaffolds and retention policy protections. Growth Partner terminology. ${P.companion} supports — never bypasses decision RBAC or exposes sensitive decisions without authorization.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — users retain decision judgment control.', '${P.companion} informs and supports.', 'Evidence before impulse — context before conclusion.', 'Growth Partner — never Affiliate.', 'Workforce Planning Era continues — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — decision signals max ~500 chars. No decision content beyond RBAC or PII in audit logs.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_project_portfolio_strategic_execution_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._appseebp250_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_decision_request_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Decision request hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_decision_request_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_project_management_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Decision request hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_decision_request_hub()->'reflection_questions') = 5,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_decision_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Decision Intelligence — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_decision_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_portfolio_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Decision Intelligence — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_decision_dashboard()->'capabilities') = 10,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  for (const fn of [...SCAFFOLDS, "decision_intelligence_companion"]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${P.bp}_${fn}()`);
  }

  sql = sql.replace(
    new RegExp(`select '${P.slug}'[^;]+;`, "g"),
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    /select 'aipify-project-portfolio-strategic-execution-engine'[^;]+;/g,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected project portfolio and strategic execution guidance within Workforce Planning Era;",
    "RBAC-protected decision intelligence and recommendation guidance within Workforce Planning Era;",
  );
  sql = sql.replace(
    /Phase 251 Decision Intelligence & Recommendation Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 250 Project Portfolio & Strategic Execution Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );

  sql = sql.replace(
    /'authenticated', 250\nwhere not exists \(select 1 from public\.aipify_knowledge_categories where slug = 'aipify-project-portfolio-strategic-execution-engine'/,
    `'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-project-portfolio-strategic-execution-engine'`,
  );

  return sql;
}

function genMigration() {
  const src250 = path.join(
    ROOT,
    "supabase/migrations/20261412000000_aipify_project_portfolio_strategic_execution_engine_phase250.sql",
  );
  if (!fs.existsSync(src250)) throw new Error("Phase 250 migration required");
  let m = transformFrom250(fs.readFileSync(src250, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-project-portfolio-strategic-execution-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(
    path.join(ROOT, `lib/core/${P.slug}.ts`),
    transformFrom250(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")),
  );
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(
      path.join(dst, f),
      transformFrom250(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")),
    );
  }
  const panel = path.join(
    ROOT,
    `components/app/${srcSlug}/AipifyProjectPortfolioStrategicExecutionEngineDashboardPanel.tsx`,
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`),
    transformFrom250(fs.readFileSync(panel, "utf8")),
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/index.ts`),
    `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`,
  );
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom250(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom250(
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

${P.centerTitle} within ${P.era}. ${P.companion} supports decision dashboards, recommendation workflows, request creation, history tracking, rationale documentation, impact assessments, multi-stakeholder reviews, approval processes, analytics, executive briefings, knowledge archive, and follow-up tracking — does NOT bypass decision RBAC, expose sensitive decisions without authorization, or expose protected decision records beyond retention policies.

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

## What is the Decision Intelligence & Recommendation Engine?

The Decision Intelligence & Recommendation Engine helps organizations make better decisions with structured recommendations and context at \`/app/${P.slug}\`.

## What decision features are included?

Decision dashboards, recommendation workflows, decision request creation, history tracking, rationale documentation, impact assessments, multi-stakeholder reviews, approval processes, decision analytics, executive briefings, knowledge archive, and follow-up tracking.

## What decision types are supported?

Strategic, operational, financial, hiring, project, risk-related, customer, and custom decision types.

## What decision capabilities are included?

Capture decision context, identify alternatives, document pros and cons, record outcomes, assign ownership, track implementation progress, support collaborative decision-making, and preserve organizational learning.

## What intelligence features are included?

Recommend relevant information, surface similar historical decisions, highlight potential risks, identify missing stakeholders, suggest follow-up actions, and encourage evidence-based decision-making.

## Who can access decision intelligence?

Super Admin (full access), Tenant Admin (organization decision settings), Executives (strategic decision oversight), Managers (department decision management), Employees (participate in assigned workflows) — enterprise RBAC.

## Are sensitive decisions protected?

**Yes.** Decision records follow RBAC policies. Sensitive decisions may require restricted access. Organizations control decision retention policies.

## How does this integrate with other Aipify surfaces?

${P.crossLinkNote}

## Does the Decision Intelligence Companion replace human judgment?

**No.** ${P.companion} supports decision clarity — it does **NOT** bypass decision RBAC, expose sensitive decisions without authorization, or expose protected decision records beyond retention policies.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Decisions: dashboards, recommendation workflows, requests, history, rationale, impact, reviews, approvals, analytics, briefings, archive, follow-up.
Types: strategic, operational, financial, hiring, project, risk, customer, custom.
Capabilities: context, alternatives, pros/cons, outcomes, ownership, implementation, collaboration, learning.
Intelligence: relevant information, historical decisions, risks, stakeholders, follow-up, evidence-based.
Security: decision RBAC, sensitive decision protection, retention policies, audit logging, enterprise permissions, 2FA.
Design principles: Evidence before impulse, context before conclusion, learning before repetition.
Companion limitations: no bypassing decision RBAC, no exposing sensitive decisions, no exposing records beyond retention policies.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate. Workforce Planning Era 249–253.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never bypasses decision RBAC, exposes sensitive decisions without authorization, or exposes protected decision records beyond retention policies.";
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
      '| "aipifyProjectPortfolioStrategicExecutionEngine"',
      `| "aipifyProjectPortfolioStrategicExecutionEngine"\n  | "${id}"`,
    );
  }
  if (!c.includes(href)) {
    const anchor =
      /id: "aipifyProjectPortfolioStrategicExecutionEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyProjectPortfolioStrategicExecutionEngine",\n  },/;
    c = c.replace(
      anchor,
      (m) =>
        `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-project-portfolio-strategic-execution-engine")) {\n    return "aipifyProjectPortfolioStrategicExecutionEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-project-portfolio-strategic-execution-engine")) {\n    return "aipifyProjectPortfolioStrategicExecutionEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace(
        '"aipify_project_portfolio_strategic_execution.steward",',
        `"aipify_project_portfolio_strategic_execution.steward",\n    "${perm}",`,
      );
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-project-portfolio-strategic-execution-engine";',
      `export * from "./aipify-project-portfolio-strategic-execution-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports decision dashboards, recommendation workflows, history tracking, rationale documentation, impact assessments, reviews, approvals, analytics, and follow-up. Supports evidence-based decisions — does NOT bypass decision RBAC. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Decision intelligence score",
    modeLabel: "Mode",
    readinessLabel: "Decision intelligence maturity level",
    executiveReviews: "Executive decision briefings",
    activeReflections: "Active decision intelligence scaffolds",
    humanOversightRequired: `Human oversight required — users retain decision judgment control; ${P.companion} supports only`,
    eraOpenerSummary: `Workforce Planning Era — Phases ${P.eraRange}`,
    eraOpenerNote:
      "Cross-link only — do not duplicate Executive Cockpit, Analytics, Meeting Intelligence, Action Center, Project Portfolio, Goals & Alignment, Enterprise Search, Knowledge Center, Notification Engine, or Aipify Translate RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Decision request hub — governance prompts",
    frameworkLabel: "Decision types engine",
    reviewsLabel: "Decision governance dashboard",
    companionLabel: `${P.companion} — supports decision clarity, never replaces human decision judgment`,
    subEngineLabel: "Recommendation workflows engine",
    reflections: "Decision intelligence scaffolds",
    executiveReviewEntries: "Decision ownership entries",
    scaffoldNotes: "RBAC-protected decision intelligence scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT bypass decision RBAC, expose sensitive decisions without authorization, or expose protected decision records beyond retention policies`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports decision intelligence and recommendation — users retain decision judgment control and sensitive decisions stay protected.`,
      philosophy:
        "People First. RBAC-protected decision scaffolds. Growth Partner terminology — never Affiliate.",
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
        ? "Beslutningsinnsikt"
        : locale === "sv"
          ? "Beslutsintelligens"
          : locale === "da"
            ? "Beslutningsintelligens"
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
      'export * from "./implementation-blueprint-phase250-vocabulary";',
      `export * from "./implementation-blueprint-phase250-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE250_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase250-aipify-project-portfolio-strategic-execution.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE250_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase250-aipify-project-portfolio-strategic-execution.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_project_portfolio_strategic_execution.view`, `aipify_project_portfolio_strategic_execution.manage`, `aipify_project_portfolio_strategic_execution.steward`.";
  const entry = `\n**Decision Intelligence & Recommendation Engine (Phase 251):** See [AIPIFY_DECISION_INTELLIGENCE_RECOMMENDATION_ENGINE_PHASE251.md](./AIPIFY_DECISION_INTELLIGENCE_RECOMMENDATION_ENGINE_PHASE251.md) — Decision dashboards, recommendation workflows, request creation, history tracking, rationale documentation, impact assessments, multi-stakeholder reviews, approval processes, analytics, executive briefings, knowledge archive, and follow-up tracking. Continues Workforce Planning Era (249–253). \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** bypassing decision RBAC, exposing sensitive decisions without authorization, or exposing protected decision records beyond retention policies. Cross-links only: Executive Cockpit Phase 200, Enterprise Analytics Engine Phase 235, Meeting Intelligence Engine Phase 206, Action Center Phase 205, Project Portfolio Engine Phase 250, Organizational Goals Engine Phase 248, Enterprise Search Engine, Knowledge Center, Enterprise Notification Engine Phase 233, Aipify Translate Phase 238. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 251")) {
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
  console.error(`Phase ${P.phase} docs generated; stack requires Phase 250 artifacts: ${err.message}`);
  process.exitCode = 1;
}
