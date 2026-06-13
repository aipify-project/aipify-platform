#!/usr/bin/env node
/** ABOS Phase 248 — Organizational Goals & Alignment Engine (Era Capstone 244–248) */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "goals_dashboard",
  "company_goals_hub",
  "goal_types_engine",
  "okr_support_engine",
  "goal_cascade_engine",
  "goal_analytics_engine",
  "goal_governance_dashboard",
  "goal_review_cycles_engine",
  "goals_integration_center",
];

const P = {
  phase: 248,
  migration: "20261410000000_aipify_organizational_goals_alignment_engine_phase248.sql",
  slug: "aipify-organizational-goals-alignment-engine",
  base: "AipifyOrganizationalGoalsAlignment",
  camel: "aipifyOrganizationalGoalsAlignmentEngine",
  snake: "aipify_organizational_goals_alignment",
  permPrefix: "aipify_organizational_goals_alignment",
  helper: "aogae",
  bp: "aogaebp248",
  decisionType: "aipify_organizational_goals_alignment_engine",
  title: "Organizational Goals & Alignment",
  centerTitle: "Goals & Alignment",
  companion: "Goals & Alignment Companion",
  scoreKey: "aipify_organizational_goals_alignment_score",
  modeKey: "organizational_goals_alignment_mode",
  levelKey: "organizational_goals_alignment_maturity_level",
  thirdEntity: "organizational_goals_alignment_notes",
  era: "Organizational Continuity Era (244–248)",
  eraRange: "244–248",
  docSlug: "AIPIFY_ORGANIZATIONAL_GOALS_ALIGNMENT_ENGINE",
  ilmFile: "implementation-blueprint-phase248-aipify-organizational-goals-alignment.txt",
  navLabel: "Goals & Alignment",
  crossLinkNote:
    "Cross-links only: Executive Cockpit Phase 200, Action Center Phase 205, Enterprise Analytics Engine Phase 235, Employee Growth Engine Phase 219, Employee Recognition & Celebration Engine Phase 242, Enterprise Notification Engine Phase 233, Calendar Assistant Engine, Knowledge Center, and Aipify Translate Phase 238 — never bypass goal RBAC, expose sensitive objectives without authorization, or expose protected goal data beyond goal-sharing policies.",
  companionLimitations: [
    "bypassing_goal_rbac",
    "exposing_sensitive_objectives_without_rbac",
    "exposing_protected_goal_data_beyond_rbac",
    "unlogged_goal_policy_changes",
    "replacing_human_leadership_judgment",
    "modifying_goal_audit_trail",
    "ignoring_goal_sharing_policies",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom247(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyInnovationIdeaManagement", P.base],
    ["aipify-innovation-idea-management-engine", P.slug],
    ["aipify_innovation_idea_management", P.snake],
    ["aipifyInnovationIdeaManagementEngine", P.camel],
    ["aiimebp247", P.bp],
    ["_aiime_", `_${P.helper}_`],
    ["aipify_innovation_idea_management_score", P.scoreKey],
    ["innovation_idea_management_mode", P.modeKey],
    ["innovation_idea_management_maturity_level", P.levelKey],
    ["innovation_idea_management_notes", P.thirdEntity],
    ["InnovationIdeaManagementNote", thirdPascal],
    ["innovation_idea_management_notes_count", `${P.thirdEntity}_count`],
    ["Innovation Phase 247", "__INNOVATION_PHASE_247__"],
    ["Innovation Companion", "__GOALS_COMPANION__"],
    ["Innovation & Idea Management", P.title],
    ["__GOALS_COMPANION__", P.companion],
    ["Innovation & Ideas", "__GOALS_CENTER__"],
    ["__INNOVATION_PHASE_247__", "Innovation Phase 247"],
    ["Phase 247", `Phase ${P.phase}`],
    ["aipify_innovation_idea_management.view", `${P.permPrefix}.view`],
    ["aipify_innovation_idea_management.manage", `${P.permPrefix}.manage`],
    ["aipify_innovation_idea_management.steward", `${P.permPrefix}.steward`],
    ["aipify_innovation_idea_management_engine", P.decisionType],
    ["20261409000000_aipify_innovation_idea_management_engine_phase247.sql", P.migration],
    ["Repo Phase 247", `Repo Phase ${P.phase}`],
    ["Phase 247 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE247_AIPIFY_INNOVATION_IDEA_MANAGEMENT_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase247", `implementation-blueprint-phase${P.phase}`],
    ["innovation_dashboard", SCAFFOLDS[0]],
    ["idea_submission_hub", SCAFFOLDS[1]],
    ["idea_categories_engine", SCAFFOLDS[2]],
    ["idea_voting_engine", SCAFFOLDS[3]],
    ["innovation_campaigns_engine", SCAFFOLDS[4]],
    ["innovation_analytics_engine", SCAFFOLDS[5]],
    ["innovation_governance_dashboard", SCAFFOLDS[6]],
    ["innovation_pipeline_engine", SCAFFOLDS[7]],
    ["innovation_integration_center", SCAFFOLDS[8]],
    ["innovation_companion", "goals_alignment_companion"],
    ["_seed_innovation_idea_management_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["innovation idea management stewardship", "organizational goals alignment stewardship"],
    ["innovation-informed decision support", "alignment-informed decision support"],
    ["participation-first innovation culture", "accountability-first alignment culture"],
    ["active innovation programs", "active goal programs"],
    ["ideas requiring executive attention", "goals requiring executive attention"],
    ["Idea Submission Hub", "Company Goals Hub"],
    ["Idea Categories Engine", "Goal Types Engine"],
    ["Idea Voting Engine", "OKR Support Engine"],
    ["Innovation Campaigns Engine", "Goal Cascade Engine"],
    ["Innovation Analytics Engine", "Goal Analytics Engine"],
    ["Innovation Governance Dashboard", "Goal Governance Dashboard"],
    ["innovation pipeline indicators", "goal review cycle indicators"],
    ["innovation governance prompts", "goal governance prompts"],
    ["innovation assistant prompts", "goals alignment assistant prompts"],
    ["executive review workflows", "goal review cycles"],
    ["idea status tracking signals", "goal progress tracking signals"],
    ["RBAC-protected innovation policies", "RBAC-protected goal policies"],
    ["Participation before hierarchy", "Alignment before activity"],
    ["Ideas before ego", "Focus before noise"],
    ["Impact before volume", "Accountability before output"],
    ["no_bypassing_innovation_rbac", "no_bypassing_goal_rbac"],
    ["AIPIFY_INNOVATION_IDEA_MANAGEMENT_ENGINE", P.docSlug],
    ["innovation and idea management", "organizational goals and alignment"],
    ["Innovation idea management audit logs", "Organizational goals alignment audit logs"],
    ["innovation RBAC", "goal RBAC"],
    ["innovation idea scaffolds", "goals alignment scaffolds"],
    ["organization innovation policies", "organization goal-sharing policies"],
    ["Innovation score", "Goals alignment score"],
    ["Innovation maturity level", "Goals alignment maturity level"],
    ["Innovation champion entries", "Goal ownership entries"],
    ["innovation idea management", "organizational goals alignment"],
    ["idea ownership policy stewardship", "goal-sharing policy stewardship"],
    ["idea data beyond RBAC", "goal data beyond RBAC"],
    ["cross-functional idea collaboration assistance", "cross-level goal cascade assistance"],
    ["manager idea reviews", "manager goal reviews"],
    [
      "Employee Recognition & Celebration Engine Phase 242, Enterprise Analytics Engine Phase 235, Enterprise Workflow Automation Engine Phase 231, Enterprise Notification Engine Phase 233, Executive Cockpit Phase 200, Knowledge Center, and Aipify Translate Phase 238",
      "Executive Cockpit Phase 200, Action Center Phase 205, Enterprise Analytics Engine Phase 235, Employee Growth Engine Phase 219, Employee Recognition & Celebration Engine Phase 242, Enterprise Notification Engine Phase 233, Calendar Assistant Engine, Knowledge Center, and Aipify Translate Phase 238",
    ],
    [
      "Never bypass innovation RBAC or expose restricted initiatives without authorization",
      "Never bypass goal RBAC or expose sensitive objectives without authorization",
    ],
    ["innovation programs", "goal programs"],
    ["Innovation programs", "Goal programs"],
    ["restricted initiative visibility routing", "sensitive objective visibility routing"],
    ["exposes idea data without RBAC approval", "exposes goal data without RBAC approval"],
    ["Unauthorized innovation access without RBAC approval", "Unauthorized goals access without RBAC approval"],
    ["Modifying innovation audit trails", "Modifying goal audit trails"],
    ["Volume before impact", "Output before accountability"],
    ["user review judgment control", "user leadership judgment control"],
    ["User review judgment control", "User leadership judgment control"],
    ["innovation decisions and idea ownership policy", "alignment decisions and goal-sharing policy"],
    ["idea visibility", "goal visibility"],
    ["innovation governance", "goal governance"],
    [
      "enable organizations to capture, evaluate and develop ideas from employees, teams and leaders — maintaining innovation RBAC, restricted initiative visibility, organization-controlled idea ownership policies, and complete audit history",
      "enable organizations to define, align and track strategic goals across all levels — maintaining goal RBAC, sensitive objective protection, organization-controlled goal-sharing policies, and complete audit history",
    ],
    [
      "employee participation increases, implemented ideas increase, innovation culture improves, idea evaluation cycles accelerate, cross-functional collaboration increases, and measurable business impact from innovations strengthens with participation before hierarchy",
      "goal completion rates increase, organizational alignment improves, execution risks are identified faster, employee engagement with objectives increases, accountability strengthens, and strategic execution improves with alignment before activity",
    ],
    ["__GOALS_CENTER__", P.centerTitle],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports organizational goals and alignment — NOT bypassing goal RBAC, exposing sensitive objectives without authorization, or exposing protected goal data beyond goal-sharing policies. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Enable organizations to define, align and track strategic goals across all levels of the business to improve focus, accountability and execution — ${P.companion} informs, humans decide.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Organizational Continuity Era (${P.eraRange}). Human-stewarded goals governance; RBAC-protected goal scaffolds; goal policy changes logged; ${P.companion} informs and supports. Era capstone.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations increase goal completion rates, improve alignment, identify execution risks faster, increase employee engagement with objectives, strengthen accountability, and improve strategic execution with alignment before activity.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Ten goals modules with governance'),
    jsonb_build_object('key', 'company_goals_hub', 'label', 'Company goals hub', 'emoji', '📋', 'description', 'Company, department, team, individual goals'),
    jsonb_build_object('key', 'goal_types_engine', 'label', 'Goal types engine', 'emoji', '🏆', 'description', 'Strategic, operational, financial, custom'),
    jsonb_build_object('key', 'okr_support_engine', 'label', 'OKR support engine', 'emoji', '🔗', 'description', 'OKRs, milestones, dependencies'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not replace human leadership judgment'),
    jsonb_build_object('key', 'goal_analytics_engine', 'label', 'Goal analytics engine', 'emoji', '📊', 'description', 'Progress, alignment, risk signals'),
    jsonb_build_object('key', 'goal_governance_dashboard', 'label', 'Goal governance dashboard', 'emoji', '🛡️', 'description', 'RBAC and goal-sharing controls'),
    jsonb_build_object('key', 'goal_cascade_engine', 'label', 'Goal cascade engine', 'emoji', '🔔', 'description', 'Cascade, align, visualize relationships')
  ); ${D};
create or replace function public._${bp}_goals_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — ten capabilities. Alignment before activity.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'goals_dashboard', 'label', 'Goals Dashboard'),
    jsonb_build_object('key', 'company_goals', 'label', 'Company Goals Management'),
    jsonb_build_object('key', 'department_goals', 'label', 'Department Goal Management'),
    jsonb_build_object('key', 'team_goals', 'label', 'Team Goals'),
    jsonb_build_object('key', 'individual_goals', 'label', 'Individual Goals'),
    jsonb_build_object('key', 'okr_support', 'label', 'OKR Support'),
    jsonb_build_object('key', 'progress_tracking', 'label', 'Goal Progress Tracking'),
    jsonb_build_object('key', 'milestone_management', 'label', 'Milestone Management'),
    jsonb_build_object('key', 'goal_dependencies', 'label', 'Goal Dependencies'),
    jsonb_build_object('key', 'goal_analytics', 'label', 'Goal Analytics & Review Cycles')
  )); ${D};
create or replace function public._${bp}_company_goals_hub() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Company goals — focus before noise.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'goal_rbac', 'label', 'Does goal data follow RBAC policies?'),
    jsonb_build_object('key', 'sensitive_objectives', 'label', 'Are sensitive objectives protected?'),
    jsonb_build_object('key', 'goal_sharing', 'label', 'Do organizations control goal-sharing policies?'),
    jsonb_build_object('key', 'ownership', 'label', 'Is goal ownership clearly assigned?'),
    jsonb_build_object('key', 'alignment', 'label', 'How does cascade support alignment before activity?')
  )); ${D};
create or replace function public._${bp}_goal_types_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Goal types — accountability before output.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'strategic', 'label', 'Strategic goals'),
    jsonb_build_object('key', 'operational', 'label', 'Operational goals'),
    jsonb_build_object('key', 'financial', 'label', 'Financial goals'),
    jsonb_build_object('key', 'customer', 'label', 'Customer goals'),
    jsonb_build_object('key', 'employee', 'label', 'Employee goals'),
    jsonb_build_object('key', 'learning', 'label', 'Learning goals'),
    jsonb_build_object('key', 'innovation', 'label', 'Innovation goals'),
    jsonb_build_object('key', 'sustainability', 'label', 'Sustainability goals'),
    jsonb_build_object('key', 'custom', 'label', 'Custom goals')
  )); ${D};
create or replace function public._${bp}_goal_review_cycles_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Goal review cycles — execution stewardship.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'draft', 'label', 'Draft'),
    jsonb_build_object('key', 'active', 'label', 'Active'),
    jsonb_build_object('key', 'on_track', 'label', 'On track'),
    jsonb_build_object('key', 'at_risk', 'label', 'At risk'),
    jsonb_build_object('key', 'stalled', 'label', 'Stalled'),
    jsonb_build_object('key', 'completed', 'label', 'Completed'),
    jsonb_build_object('key', 'archived', 'label', 'Archived')
  )); ${D};
create or replace function public._${bp}_goals_alignment_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports goals clarity and never bypasses goal RBAC or exposes sensitive objectives without authorization.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'identify_stalled', 'label', 'Identify stalled goals'),
    jsonb_build_object('key', 'recommend_reviews', 'label', 'Recommend goal reviews'),
    jsonb_build_object('key', 'detect_misalignment', 'label', 'Detect misaligned objectives'),
    jsonb_build_object('key', 'surface_high_risk', 'label', 'Surface high-risk goals'),
    jsonb_build_object('key', 'highlight_progress', 'label', 'Highlight exceptional progress'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Goal RBAC — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_okr_support_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'OKR support — measurable alignment.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'okr_framework', 'label', 'OKR support'),
    jsonb_build_object('key', 'milestones', 'label', 'Milestone management'),
    jsonb_build_object('key', 'dependencies', 'label', 'Goal dependencies'),
    jsonb_build_object('key', 'ownership', 'label', 'Goal ownership assignment'),
    jsonb_build_object('key', 'progress_tracking', 'label', 'Goal progress tracking'),
    jsonb_build_object('key', 'conflict_prevention', 'label', 'Prevent conflicting objectives')
  )); ${D};
create or replace function public._${bp}_goal_cascade_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Goal cascade — alignment across levels.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'cascade_company', 'label', 'Cascade company goals to departments'),
    jsonb_build_object('key', 'align_team', 'label', 'Align team goals with strategic objectives'),
    jsonb_build_object('key', 'connect_individual', 'label', 'Connect individual goals to business priorities'),
    jsonb_build_object('key', 'visualize_relationships', 'label', 'Visualize goal relationships'),
    jsonb_build_object('key', 'track_contribution', 'label', 'Track contribution across the organization'),
    jsonb_build_object('key', 'prevent_conflicts', 'label', 'Prevent conflicting objectives')
  )); ${D};
create or replace function public._${bp}_goal_analytics_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Goal analytics — strategic execution visibility.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'completion_rates', 'label', 'Goal completion rates'),
    jsonb_build_object('key', 'alignment', 'label', 'Organizational alignment signals'),
    jsonb_build_object('key', 'execution_risks', 'label', 'Execution risk identification'),
    jsonb_build_object('key', 'engagement', 'label', 'Employee engagement with objectives'),
    jsonb_build_object('key', 'accountability', 'label', 'Accountability indicators'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Goal audit visibility respects role permissions')
  )); ${D};
create or replace function public._${bp}_goal_governance_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Goal governance — organizations control goal-sharing policies.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'goal_rbac', 'label', 'Goal visibility follows RBAC policies'),
    jsonb_build_object('key', 'sensitive_objectives', 'label', 'Sensitive objectives remain protected'),
    jsonb_build_object('key', 'goal_sharing', 'label', 'Organizations control goal-sharing policies'),
    jsonb_build_object('key', 'manager_oversight', 'label', 'Manager department and team goals'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Executive, Manager, Employee tiers'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for goal policy changes')
  )); ${D};
create or replace function public._${bp}_goals_integration_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Goals integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-cockpit-engine'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center Phase 205', 'cross_link', '/app/aipify-action-center-execution-engine'),
    jsonb_build_object('key', 'enterprise_analytics', 'label', 'Enterprise Analytics Engine Phase 235', 'cross_link', '/app/aipify-enterprise-analytics-operational-intelligence-engine'),
    jsonb_build_object('key', 'employee_growth', 'label', 'Employee Growth Engine Phase 219', 'cross_link', '/app/aipify-employee-growth-career-development-engine'),
    jsonb_build_object('key', 'recognition_engine', 'label', 'Employee Recognition & Celebration Engine Phase 242', 'cross_link', '/app/aipify-employee-recognition-celebration-engine'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'calendar_assistant', 'label', 'Calendar Assistant Engine', 'cross_link', '/app/assistant/calendars'),
    jsonb_build_object('key', 'aipify_translate', 'label', 'Aipify Translate Phase 238', 'cross_link', '/app/aipify-translate-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for goals integration actions')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing goal RBAC',
      'Exposing sensitive objectives without authorization',
      'Exposing protected goal data beyond sharing policies',
      'Replacing human leadership judgment',
      'Modifying goal audit trails',
      'Unlogged goal policy changes',
      'Ignoring goal-sharing policies',
      'Override human judgment'), 'principle', '${P.companion} supports — users retain leadership judgment control and sensitive objectives stay protected.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm goals support without performance pressure.', 'values', jsonb_build_array('alignment_before_activity','focus_before_noise','accountability_before_output','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Organizational goals alignment audit logs via aipify_organizational_goals_alignment_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_organizational_goals_alignment permissions — goal RBAC'),
    jsonb_build_object('key', 'goal_rbac', 'label', 'Goal visibility follows RBAC policies'),
    jsonb_build_object('key', 'sensitive_objectives', 'label', 'Sensitive objectives remain protected'),
    jsonb_build_object('key', 'goal_sharing', 'label', 'Organizations control goal-sharing policies'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 247, 'key', 'innovation_idea_management', 'label', 'Innovation Phase 247', 'route', '/app/aipify-innovation-idea-management-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 248, 'key', 'organizational_goals_alignment', 'label', 'Goals & Alignment Phase 248', 'route', '/app/${P.slug}', 'description', 'Human-stewarded goals and alignment — era capstone')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-cockpit-engine', 'relationship', 'Executive Cockpit integration — cross-link only'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center Phase 205', 'route', '/app/aipify-action-center-execution-engine', 'relationship', 'Action Center integration — cross-link only'),
    jsonb_build_object('key', 'employee_growth', 'label', 'Employee Growth Phase 219', 'route', '/app/aipify-employee-growth-career-development-engine', 'relationship', 'Employee Growth integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Focus before noise — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with RBAC-protected goal scaffolds and goal-sharing policy protections. Growth Partner terminology. ${P.companion} supports — never bypasses goal RBAC or exposes sensitive objectives without authorization.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — users retain leadership judgment control.', '${P.companion} informs and supports.', 'Alignment before activity — focus before noise.', 'Growth Partner — never Affiliate.', 'Organizational Continuity Era capstone — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — goal signals max ~500 chars. No goal content beyond RBAC or PII in audit logs.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_innovation_idea_management_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._aiimebp247_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_company_goals_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Company goals hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_company_goals_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_idea_submission_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Company goals hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_company_goals_hub()->'reflection_questions') = 5,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_goals_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Goals & Alignment — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_goals_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_innovation_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Goals & Alignment — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_goals_dashboard()->'capabilities') = 10,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  for (const fn of [...SCAFFOLDS, "goals_alignment_companion"]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${P.bp}_${fn}()`);
  }

  sql = sql.replace(
    /select 'aipify-innovation-idea-management-engine'[^;]+;/g,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected innovation and idea management guidance within Organizational Continuity Era;",
    "RBAC-protected organizational goals and alignment guidance within Organizational Continuity Era;",
  );
  sql = sql.replaceAll("within Guided Adoption Era;", "within Organizational Continuity Era (244–248);");
  sql = sql.replace(
    /Phase 248 Organizational Goals & Alignment Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 247 Innovation & Idea Management Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );

  sql = sql.replace(
    /'authenticated', 247\nwhere not exists \(select 1 from public\.aipify_knowledge_categories where slug = 'aipify-innovation-idea-management-engine'/,
    `'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-innovation-idea-management-engine'`,
  );

  return sql;
}

function genMigration() {
  const src247 = path.join(ROOT, "supabase/migrations/20261409000000_aipify_innovation_idea_management_engine_phase247.sql");
  if (!fs.existsSync(src247)) throw new Error("Phase 247 migration required");
  let m = transformFrom247(fs.readFileSync(src247, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-innovation-idea-management-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(path.join(ROOT, `lib/core/${P.slug}.ts`), transformFrom247(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")));
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom247(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")));
  }
  const panel = path.join(ROOT, `components/app/${srcSlug}/AipifyInnovationIdeaManagementEngineDashboardPanel.tsx`);
  write(
    path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`),
    transformFrom247(fs.readFileSync(panel, "utf8")),
  );
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`);
  write(path.join(ROOT, `app/app/${P.slug}/page.tsx`), transformFrom247(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")));
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom247(fs.readFileSync(path.join(ROOT, `app/api/aipify/${srcSlug}/${route}/route.ts`), "utf8")),
    );
  }
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. **Era capstone.** ${P.companion} supports company, department, team, and individual goals, OKRs, progress tracking, milestones, dependencies, ownership, dashboards, analytics, and review cycles — does NOT bypass goal RBAC, expose sensitive objectives without authorization, or expose protected goal data beyond goal-sharing policies.

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
Era: ${P.era} (capstone)
${P.crossLinkNote}
`,
  );
  write(
    path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
    `# ${P.title} Engine — FAQ (Phase ${P.phase})

## What is the Organizational Goals & Alignment Engine?

The Organizational Goals & Alignment Engine helps organizations define, align and track strategic goals at \`/app/${P.slug}\`.

## What goal features are included?

Company goals management, department goal management, team goals, individual goals, OKR support, goal progress tracking, milestone management, goal dependencies, goal ownership assignment, goal dashboards, goal analytics, and goal review cycles.

## What goal types are supported?

Strategic, operational, financial, customer, employee, learning, innovation, sustainability, and custom goals.

## What alignment capabilities are included?

Cascade company goals to departments, align team goals with strategic objectives, connect individual goals to business priorities, visualize goal relationships, track contribution across the organization, and prevent conflicting objectives.

## What intelligence features are included?

Identify stalled goals, recommend goal reviews, detect misaligned objectives, surface high-risk goals, highlight exceptional progress, and encourage proactive leadership actions.

## Who can access goals management?

Super Admin (full access), Tenant Admin (organization goal settings), Executives (strategic goal oversight), Managers (department and team goals), Employees (personal goal participation) — enterprise RBAC.

## Are sensitive objectives protected?

**Yes.** Goal visibility follows RBAC policies. Sensitive objectives remain protected. Organizations control goal-sharing policies.

## How does this integrate with other Aipify surfaces?

${P.crossLinkNote}

## Does the Goals & Alignment Companion replace human judgment?

**No.** ${P.companion} supports goals clarity — it does **NOT** bypass goal RBAC, expose sensitive objectives without authorization, or expose protected goal data beyond goal-sharing policies.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Goals: company, department, team, individual, OKRs, progress tracking, milestones, dependencies, ownership, dashboards, analytics, review cycles.
Types: strategic, operational, financial, customer, employee, learning, innovation, sustainability, custom.
Alignment: cascade, team alignment, individual connection, visualize relationships, track contribution, prevent conflicts.
Intelligence: stalled goals, review recommendations, misalignment detection, high-risk goals, exceptional progress, leadership actions.
Security: goal RBAC, sensitive objective protection, goal-sharing policies, audit logging, enterprise permissions, 2FA.
Design principles: Alignment before activity, focus before noise, accountability before output.
Companion limitations: no bypassing goal RBAC, no exposing sensitive objectives, no exposing data beyond sharing policies.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate. Era capstone 244–248.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never bypasses goal RBAC, exposes sensitive objectives without authorization, or exposes protected goal data beyond goal-sharing policies.";
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
    c = c.replace('| "aipifyInnovationIdeaManagementEngine"', `| "aipifyInnovationIdeaManagementEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    const anchor = /id: "aipifyInnovationIdeaManagementEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyInnovationIdeaManagementEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-innovation-idea-management-engine")) {\n    return "aipifyInnovationIdeaManagementEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-innovation-idea-management-engine")) {\n    return "aipifyInnovationIdeaManagementEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_innovation_idea_management.steward",', `"aipify_innovation_idea_management.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-innovation-idea-management-engine";',
      `export * from "./aipify-innovation-idea-management-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era} capstone. ${P.companion} supports company, department, team, and individual goals, OKRs, progress tracking, milestones, dependencies, and review cycles. Supports strategic execution — does NOT bypass goal RBAC. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Goals alignment score",
    modeLabel: "Mode",
    readinessLabel: "Goals alignment maturity level",
    executiveReviews: "Goal review cycles",
    activeReflections: "Active goals alignment scaffolds",
    humanOversightRequired: `Human oversight required — users retain leadership judgment control; ${P.companion} supports only`,
    eraOpenerSummary: `Organizational Continuity Era — Phases ${P.eraRange} (capstone)`,
    eraOpenerNote: "Cross-link only — do not duplicate Executive Cockpit, Action Center, Analytics Engine, Employee Growth, Recognition Engine, Notification Engine, Calendar Assistant, or Aipify Translate RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Company goals hub — governance prompts",
    frameworkLabel: "Goal types engine",
    reviewsLabel: "Goal governance dashboard",
    companionLabel: `${P.companion} — supports goals clarity, never replaces human leadership judgment`,
    subEngineLabel: "OKR support engine",
    reflections: "Goals alignment scaffolds",
    executiveReviewEntries: "Goal ownership entries",
    scaffoldNotes: "RBAC-protected goals alignment scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT bypass goal RBAC, expose sensitive objectives without authorization, or expose protected goal data beyond goal-sharing policies`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports organizational goals and alignment — users retain leadership judgment control and sensitive objectives stay protected.`,
      philosophy: "People First. RBAC-protected goals scaffolds. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
      growthEra: `${P.era} — Phase ${P.phase} closes the era.`,
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
        ? "Mål og justering"
        : locale === "sv"
          ? "Mål och inriktning"
          : locale === "da"
            ? "Mål og justering"
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
      'export * from "./implementation-blueprint-phase247-vocabulary";',
      `export * from "./implementation-blueprint-phase247-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE247_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase247-aipify-innovation-idea-management.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE247_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase247-aipify-innovation-idea-management.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_innovation_idea_management.view`, `aipify_innovation_idea_management.manage`, `aipify_innovation_idea_management.steward`.";
  const entry = `\n**Organizational Goals & Alignment Engine (Phase 248):** See [AIPIFY_ORGANIZATIONAL_GOALS_ALIGNMENT_ENGINE_PHASE248.md](./AIPIFY_ORGANIZATIONAL_GOALS_ALIGNMENT_ENGINE_PHASE248.md) — Company, department, team, and individual goals, OKRs, progress tracking, milestones, dependencies, ownership, dashboards, analytics, and review cycles. **Era capstone** for Organizational Continuity Era (244–248). \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** bypassing goal RBAC, exposing sensitive objectives without authorization, or exposing protected goal data beyond goal-sharing policies. Cross-links only: Executive Cockpit Phase 200, Action Center Phase 205, Enterprise Analytics Engine Phase 235, Employee Growth Engine Phase 219, Employee Recognition & Celebration Engine Phase 242, Enterprise Notification Engine Phase 233, Calendar Assistant Engine, Aipify Translate Phase 238. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 248")) {
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
  console.error(`Phase ${P.phase} docs generated; stack requires Phase 247 artifacts: ${err.message}`);
  process.exitCode = 1;
}
