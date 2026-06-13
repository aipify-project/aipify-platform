#!/usr/bin/env node
/** ABOS Phase 253 — Enterprise Governance & Policy Automation Engine (Era Capstone 249–253) */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "governance_dashboard",
  "policy_lifecycle_hub",
  "policy_types_engine",
  "approval_workflows_engine",
  "compliance_tracking_engine",
  "policy_analytics_engine",
  "governance_governance_dashboard",
  "exception_workflows_engine",
  "governance_integration_center",
];

const P = {
  phase: 253,
  migration: "20261415000000_aipify_enterprise_governance_policy_automation_engine_phase253.sql",
  slug: "aipify-enterprise-governance-policy-automation-engine",
  base: "AipifyEnterpriseGovernancePolicyAutomation",
  camel: "aipifyEnterpriseGovernancePolicyAutomationEngine",
  snake: "aipify_enterprise_governance_policy_automation",
  permPrefix: "aipify_enterprise_governance_policy_automation",
  helper: "aegpae",
  bp: "aegpaebp253",
  decisionType: "aipify_enterprise_governance_policy_automation_engine",
  title: "Enterprise Governance & Policy Automation",
  centerTitle: "Governance & Policy",
  companion: "Governance Companion",
  scoreKey: "aipify_enterprise_governance_policy_automation_score",
  modeKey: "enterprise_governance_policy_automation_mode",
  levelKey: "enterprise_governance_policy_automation_maturity_level",
  thirdEntity: "enterprise_governance_policy_automation_notes",
  era: "Workforce Planning Era (249–253)",
  eraRange: "249–253",
  docSlug: "AIPIFY_ENTERPRISE_GOVERNANCE_POLICY_AUTOMATION_ENGINE",
  ilmFile: "implementation-blueprint-phase253-aipify-enterprise-governance-policy-automation.txt",
  navLabel: "Governance & Policy",
  crossLinkNote:
    "Cross-links only: Trust Center, Compliance Engine Phase 225, Enterprise Notification Engine Phase 233, Enterprise Analytics Engine Phase 235, Executive Cockpit Phase 200, Action Center Phase 205, Document Intelligence Engine Phase 230, Enterprise Search Engine, and Aipify Translate Phase 238 — never bypass governance RBAC, expose sensitive governance records without authorization, or modify immutable policy acknowledgements.",
  companionLimitations: [
    "bypassing_governance_rbac",
    "exposing_sensitive_governance_records_without_rbac",
    "modifying_immutable_policy_acknowledgements",
    "unlogged_governance_policy_changes",
    "replacing_human_compliance_judgment",
    "modifying_governance_audit_trail",
    "ignoring_retention_policies",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom252(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyEnterpriseActionPrioritizationFocus", P.base],
    ["aipify-enterprise-action-prioritization-focus-engine", P.slug],
    ["aipify_enterprise_action_prioritization_focus", P.snake],
    ["aipifyEnterpriseActionPrioritizationFocusEngine", P.camel],
    ["eaapfebp252", P.bp],
    ["_eaapfe_", `_${P.helper}_`],
    ["aipify_enterprise_action_prioritization_focus_score", P.scoreKey],
    ["enterprise_action_prioritization_focus_mode", P.modeKey],
    ["enterprise_action_prioritization_focus_maturity_level", P.levelKey],
    ["enterprise_action_prioritization_focus_notes", P.thirdEntity],
    ["EnterpriseActionPrioritizationFocusNote", thirdPascal],
    ["enterprise_action_prioritization_focus_notes_count", `${P.thirdEntity}_count`],
    ["Priority & Focus Phase 252", "__FOCUS_PHASE_252__"],
    ["Focus Companion", "__GOVERNANCE_COMPANION__"],
    ["Enterprise Action Prioritization & Focus", P.title],
    ["__GOVERNANCE_COMPANION__", P.companion],
    ["Priority & Focus", "__GOVERNANCE_CENTER__"],
    ["__FOCUS_PHASE_252__", "Priority & Focus Phase 252"],
    ["Phase 252", `Phase ${P.phase}`],
    ["aipify_enterprise_action_prioritization_focus.view", `${P.permPrefix}.view`],
    ["aipify_enterprise_action_prioritization_focus.manage", `${P.permPrefix}.manage`],
    ["aipify_enterprise_action_prioritization_focus.steward", `${P.permPrefix}.steward`],
    ["aipify_enterprise_action_prioritization_focus_engine", P.decisionType],
    [
      "20261414000000_aipify_enterprise_action_prioritization_focus_engine_phase252.sql",
      P.migration,
    ],
    ["Repo Phase 252", `Repo Phase ${P.phase}`],
    ["Phase 252 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE252_AIPIFY_ENTERPRISE_ACTION_PRIORITIZATION_FOCUS_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase252", `implementation-blueprint-phase${P.phase}`],
    ["priority_dashboard", SCAFFOLDS[0]],
    ["focus_views_hub", SCAFFOLDS[1]],
    ["priority_levels_engine", SCAFFOLDS[2]],
    ["action_scoring_engine", SCAFFOLDS[3]],
    ["escalation_tracking_engine", SCAFFOLDS[4]],
    ["priority_analytics_engine", SCAFFOLDS[5]],
    ["focus_governance_dashboard", SCAFFOLDS[6]],
    ["focus_planning_engine", SCAFFOLDS[7]],
    ["focus_integration_center", SCAFFOLDS[8]],
    ["focus_companion", "governance_companion"],
    [
      "_seed_enterprise_action_prioritization_focus_notes",
      `_seed_${P.thirdEntity.replace("_notes", "")}_notes`,
    ],
    ["action prioritization focus stewardship", "governance policy automation stewardship"],
    ["focus-informed prioritization support", "automation-informed governance support"],
    ["focus-first prioritization culture", "accountability-first governance culture"],
    ["active priority programs", "active governance programs"],
    ["actions requiring executive attention", "policies requiring executive attention"],
    ["Focus Views Hub", "Policy Lifecycle Hub"],
    ["Priority Levels Engine", "Policy Types Engine"],
    ["Action Scoring Engine", "Approval Workflows Engine"],
    ["Escalation Tracking Engine", "Compliance Tracking Engine"],
    ["Priority Analytics Engine", "Policy Analytics Engine"],
    ["Focus Governance Dashboard", "Governance Governance Dashboard"],
    ["priority completion indicators", "acknowledgement completion indicators"],
    ["focus governance prompts", "governance automation prompts"],
    ["focus assistant prompts", "governance assistant prompts"],
    ["daily focus recommendations", "automated policy acknowledgements"],
    ["escalation tracking signals", "governance notification signals"],
    ["RBAC-protected priority policies", "RBAC-protected governance policies"],
    ["Focus before noise", "Transparency before automation"],
    ["Impact before activity", "Accountability before convenience"],
    ["Clarity before clutter", "Control before complexity"],
    ["no_bypassing_priority_rbac", "no_bypassing_governance_rbac"],
    ["AIPIFY_ENTERPRISE_ACTION_PRIORITIZATION_FOCUS_ENGINE", P.docSlug],
    ["enterprise action prioritization and focus", "enterprise governance and policy automation"],
    ["Action prioritization focus audit logs", "Governance policy automation audit logs"],
    ["priority RBAC", "governance RBAC"],
    ["action prioritization focus scaffolds", "governance policy automation scaffolds"],
    ["organization prioritization policies", "organization retention policies"],
    ["Priority focus score", "Governance automation score"],
    ["Priority focus maturity level", "Governance automation maturity level"],
    ["Priority action entries", "Policy acknowledgement entries"],
    ["enterprise action prioritization focus", "enterprise governance policy automation"],
    ["prioritization policy stewardship", "retention policy stewardship"],
    ["priority data beyond RBAC", "governance records beyond RBAC"],
    ["action dependency visualization assistance", "exception request workflow assistance"],
    ["manager department prioritization oversight", "manager department policy visibility"],
    [
      "Action Center Phase 205, Decision Intelligence & Recommendation Engine Phase 251, Executive Cockpit Phase 200, Organizational Goals & Alignment Engine Phase 248, Project Portfolio & Strategic Execution Engine Phase 250, Enterprise Analytics Engine Phase 235, Enterprise Notification Engine Phase 233, Calendar Assistant Engine, and Aipify Translate Phase 238",
      "Trust Center, Compliance Engine Phase 225, Enterprise Notification Engine Phase 233, Enterprise Analytics Engine Phase 235, Executive Cockpit Phase 200, Action Center Phase 205, Document Intelligence Engine Phase 230, Enterprise Search Engine, and Aipify Translate Phase 238",
    ],
    [
      "Never bypass priority RBAC or expose sensitive actions without authorization",
      "Never bypass governance RBAC or expose sensitive governance records without authorization",
    ],
    ["priority programs", "governance programs"],
    ["Priority programs", "Governance programs"],
    ["sensitive action visibility routing", "sensitive governance record routing"],
    ["exposes priority data without RBAC approval", "exposes governance records without RBAC approval"],
    [
      "Unauthorized focus access without RBAC approval",
      "Unauthorized governance access without RBAC approval",
    ],
    ["Modifying focus audit trails", "Modifying governance audit trails"],
    ["Noise before focus", "Automation before transparency"],
    ["user focus judgment control", "user compliance judgment control"],
    ["User focus judgment control", "User compliance judgment control"],
    ["prioritization decisions and prioritization policies", "governance decisions and retention policies"],
    ["action visibility", "policy visibility"],
    ["focus governance", "governance automation"],
    [
      "enable organizations to identify, prioritize and execute the most important actions by reducing noise and improving organizational focus — maintaining priority RBAC, sensitive action protection, organization-controlled prioritization policies, and complete audit history",
      "enable organizations to automate governance processes, policy enforcement and compliance activities — maintaining governance RBAC, immutable acknowledgements, organization-controlled retention policies, and complete audit history",
    ],
    [
      "high-priority work completion increases, organizational noise reduces, employee focus improves, strategic initiative execution accelerates, missed deadlines reduce, and productivity increases with focus before noise",
      "policy acknowledgement rates increase, compliance readiness improves, governance administration effort reduces, audit preparation accelerates, policy review completion improves, and organizational accountability increases with transparency before automation",
    ],
    ["Continues the era.", "Era capstone."],
    ["continues the era", "closes the era"],
    ["Workforce Planning Era continues", "Workforce Planning Era capstone"],
    ["__GOVERNANCE_CENTER__", P.centerTitle],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports enterprise governance and policy automation — NOT bypassing governance RBAC, exposing sensitive governance records without authorization, or modifying immutable policy acknowledgements. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Enable organizations to automate governance processes, policy enforcement and compliance activities while maintaining transparency, accountability and enterprise control — ${P.companion} informs, humans decide.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Workforce Planning Era (${P.eraRange}). Human-stewarded governance automation; RBAC-protected policy scaffolds; governance policy changes logged; ${P.companion} informs and supports. Era capstone.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations increase policy acknowledgement rates, improve compliance readiness, reduce governance administration effort, accelerate audit preparation, improve policy review completion, and increase organizational accountability with transparency before automation.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Ten governance modules with automation'),
    jsonb_build_object('key', 'policy_lifecycle_hub', 'label', 'Policy lifecycle hub', 'emoji', '📋', 'description', 'Lifecycle, versions, reviews'),
    jsonb_build_object('key', 'policy_types_engine', 'label', 'Policy types engine', 'emoji', '🏆', 'description', 'Security, HR, privacy, custom'),
    jsonb_build_object('key', 'approval_workflows_engine', 'label', 'Approval workflows engine', 'emoji', '🔗', 'description', 'Approvals, acknowledgements, exceptions'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not replace human compliance judgment'),
    jsonb_build_object('key', 'policy_analytics_engine', 'label', 'Policy analytics engine', 'emoji', '📊', 'description', 'Acknowledgements, compliance, audit prep'),
    jsonb_build_object('key', 'governance_governance_dashboard', 'label', 'Governance governance dashboard', 'emoji', '🛡️', 'description', 'RBAC and retention controls'),
    jsonb_build_object('key', 'compliance_tracking_engine', 'label', 'Compliance tracking engine', 'emoji', '🔔', 'description', 'Obligations, notifications, escalations')
  ); ${D};
create or replace function public._${bp}_governance_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — ten capabilities. Transparency before automation.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'governance_dashboard', 'label', 'Governance Dashboards'),
    jsonb_build_object('key', 'policy_lifecycle', 'label', 'Policy Lifecycle Management'),
    jsonb_build_object('key', 'approval_workflows', 'label', 'Policy Approval Workflows'),
    jsonb_build_object('key', 'automated_acknowledgements', 'label', 'Automated Policy Acknowledgements'),
    jsonb_build_object('key', 'review_scheduling', 'label', 'Policy Review Scheduling'),
    jsonb_build_object('key', 'compliance_tracking', 'label', 'Compliance Obligation Tracking'),
    jsonb_build_object('key', 'governance_notifications', 'label', 'Governance Notifications'),
    jsonb_build_object('key', 'exception_workflows', 'label', 'Exception Request Workflows'),
    jsonb_build_object('key', 'policy_analytics', 'label', 'Policy Analytics'),
    jsonb_build_object('key', 'executive_summaries', 'label', 'Executive Summaries & Version Management')
  )); ${D};
create or replace function public._${bp}_policy_lifecycle_hub() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Policy lifecycle — accountability before convenience.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'governance_rbac', 'label', 'Do governance records follow RBAC policies?'),
    jsonb_build_object('key', 'immutable_acknowledgements', 'label', 'Are policy acknowledgements immutable?'),
    jsonb_build_object('key', 'retention_policies', 'label', 'Do organizations control retention policies?'),
    jsonb_build_object('key', 'transparency', 'label', 'Is governance automation transparent to employees?'),
    jsonb_build_object('key', 'control', 'label', 'How does automation support control before complexity?')
  )); ${D};
create or replace function public._${bp}_policy_types_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Policy types — control before complexity.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'information_security', 'label', 'Information security policies'),
    jsonb_build_object('key', 'hr_policies', 'label', 'HR policies'),
    jsonb_build_object('key', 'data_privacy', 'label', 'Data privacy policies'),
    jsonb_build_object('key', 'acceptable_use', 'label', 'Acceptable use policies'),
    jsonb_build_object('key', 'code_of_conduct', 'label', 'Code of conduct policies'),
    jsonb_build_object('key', 'operational_procedures', 'label', 'Operational procedures'),
    jsonb_build_object('key', 'compliance_requirements', 'label', 'Compliance requirements'),
    jsonb_build_object('key', 'custom', 'label', 'Custom organizational policies')
  )); ${D};
create or replace function public._${bp}_exception_workflows_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Exception workflows — governed flexibility.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'draft', 'label', 'Draft'),
    jsonb_build_object('key', 'pending_approval', 'label', 'Pending approval'),
    jsonb_build_object('key', 'active', 'label', 'Active'),
    jsonb_build_object('key', 'review_due', 'label', 'Review due'),
    jsonb_build_object('key', 'acknowledgement_pending', 'label', 'Acknowledgement pending'),
    jsonb_build_object('key', 'exception_requested', 'label', 'Exception requested'),
    jsonb_build_object('key', 'archived', 'label', 'Archived')
  )); ${D};
create or replace function public._${bp}_governance_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports governance clarity and never bypasses governance RBAC or modifies immutable policy acknowledgements.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'detect_outdated', 'label', 'Detect outdated policies'),
    jsonb_build_object('key', 'compliance_gaps', 'label', 'Surface compliance gaps'),
    jsonb_build_object('key', 'review_priorities', 'label', 'Recommend review priorities'),
    jsonb_build_object('key', 'policy_exceptions', 'label', 'Highlight policy exceptions requiring attention'),
    jsonb_build_object('key', 'low_acknowledgement', 'label', 'Identify departments with low acknowledgement rates'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Governance RBAC — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_approval_workflows_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Approval workflows — structured governance.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'policy_approvals', 'label', 'Policy approval workflows'),
    jsonb_build_object('key', 'automated_acknowledgements', 'label', 'Automated policy acknowledgements'),
    jsonb_build_object('key', 'exception_requests', 'label', 'Exception request workflows'),
    jsonb_build_object('key', 'version_management', 'label', 'Policy version management'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Governance audit trails'),
    jsonb_build_object('key', 'acceptance_tracking', 'label', 'Track policy acceptance status')
  )); ${D};
create or replace function public._${bp}_compliance_tracking_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Compliance tracking — proactive governance.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'review_scheduling', 'label', 'Schedule policy reviews'),
    jsonb_build_object('key', 'acknowledgement_notifications', 'label', 'Notify employees of required acknowledgements'),
    jsonb_build_object('key', 'escalate_overdue', 'label', 'Escalate overdue acknowledgements'),
    jsonb_build_object('key', 'governance_workflows', 'label', 'Trigger governance workflows'),
    jsonb_build_object('key', 'archive_obsolete', 'label', 'Archive obsolete policies'),
    jsonb_build_object('key', 'audit_preparation', 'label', 'Support audit preparation')
  )); ${D};
create or replace function public._${bp}_policy_analytics_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Policy analytics — accountability visibility.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'acknowledgement_rates', 'label', 'Policy acknowledgement rates'),
    jsonb_build_object('key', 'compliance_readiness', 'label', 'Compliance readiness signals'),
    jsonb_build_object('key', 'administration_effort', 'label', 'Governance administration effort reduction'),
    jsonb_build_object('key', 'audit_preparation', 'label', 'Audit preparation speed'),
    jsonb_build_object('key', 'review_completion', 'label', 'Policy review completion'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Governance audit visibility respects role permissions')
  )); ${D};
create or replace function public._${bp}_governance_governance_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Governance governance — organizations control retention policies.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'governance_rbac', 'label', 'Governance records follow RBAC policies'),
    jsonb_build_object('key', 'immutable_acknowledgements', 'label', 'Policy acknowledgements are immutable'),
    jsonb_build_object('key', 'retention_policies', 'label', 'Organizations control retention policies'),
    jsonb_build_object('key', 'manager_visibility', 'label', 'Manager department policy visibility'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Executive, Manager, Employee, Compliance Team tiers'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for governance policy changes')
  )); ${D};
create or replace function public._${bp}_governance_integration_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Governance integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'trust_center', 'label', 'Trust Center', 'cross_link', '/platform/trust'),
    jsonb_build_object('key', 'compliance_engine', 'label', 'Compliance Engine Phase 225', 'cross_link', '/app/aipify-enterprise-policy-compliance-management-engine'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'enterprise_analytics', 'label', 'Enterprise Analytics Engine Phase 235', 'cross_link', '/app/aipify-enterprise-analytics-operational-intelligence-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-cockpit-engine'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center Phase 205', 'cross_link', '/app/aipify-action-center-execution-engine'),
    jsonb_build_object('key', 'document_intelligence', 'label', 'Document Intelligence Engine Phase 230', 'cross_link', '/app/aipify-document-intelligence-enterprise-document-engine'),
    jsonb_build_object('key', 'aipify_translate', 'label', 'Aipify Translate Phase 238', 'cross_link', '/app/aipify-translate-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for governance integration actions')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing governance RBAC',
      'Exposing sensitive governance records without authorization',
      'Modifying immutable policy acknowledgements',
      'Replacing human compliance judgment',
      'Modifying governance audit trails',
      'Unlogged governance policy changes',
      'Ignoring retention policies',
      'Override human judgment'), 'principle', '${P.companion} supports — users retain compliance judgment control and acknowledgements stay immutable.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm governance support without pressure.', 'values', jsonb_build_array('transparency_before_automation','accountability_before_convenience','control_before_complexity','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Governance policy automation audit logs via aipify_enterprise_governance_policy_automation_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_governance_policy_automation permissions — governance RBAC'),
    jsonb_build_object('key', 'governance_rbac', 'label', 'Governance records follow RBAC policies'),
    jsonb_build_object('key', 'immutable_acknowledgements', 'label', 'Policy acknowledgements are immutable'),
    jsonb_build_object('key', 'retention_policies', 'label', 'Organizations control retention policies'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 252, 'key', 'enterprise_action_prioritization_focus', 'label', 'Priority & Focus Phase 252', 'route', '/app/aipify-enterprise-action-prioritization-focus-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 253, 'key', 'enterprise_governance_policy_automation', 'label', 'Governance & Policy Phase 253', 'route', '/app/${P.slug}', 'description', 'Human-stewarded governance automation — era capstone')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'trust_center', 'label', 'Trust Center', 'route', '/platform/trust', 'relationship', 'Trust Center integration — cross-link only'),
    jsonb_build_object('key', 'compliance_engine', 'label', 'Compliance Engine Phase 225', 'route', '/app/aipify-enterprise-policy-compliance-management-engine', 'relationship', 'Compliance integration — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-cockpit-engine', 'relationship', 'Executive Cockpit integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Accountability before convenience — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with RBAC-protected policy scaffolds and immutable acknowledgement protections. Growth Partner terminology. ${P.companion} supports — never bypasses governance RBAC or modifies immutable policy acknowledgements.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — users retain compliance judgment control.', '${P.companion} informs and supports.', 'Transparency before automation — accountability before convenience.', 'Growth Partner — never Affiliate.', 'Workforce Planning Era capstone — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — governance signals max ~500 chars. No policy content beyond RBAC or PII in audit logs.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_enterprise_action_prioritization_focus_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._eaapfebp252_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_policy_lifecycle_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Policy lifecycle hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_policy_lifecycle_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_focus_views_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Policy lifecycle hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_policy_lifecycle_hub()->'reflection_questions') = 5,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_governance_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Governance & Policy — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_governance_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_priority_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Governance & Policy — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_governance_dashboard()->'capabilities') = 10,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  const replaceRpcRef = (sqlText, fn) => {
    if (fn === "governance_dashboard") {
      return sqlText.replace(/public\._(\w+)_governance_dashboard\(\)/g, (full, prefix) =>
        prefix.endsWith("governance") ? full : `public._${P.bp}_governance_dashboard()`,
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
    /select 'aipify-enterprise-action-prioritization-focus-engine'[^;]+;/g,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected enterprise action prioritization and focus guidance within Workforce Planning Era;",
    "RBAC-protected enterprise governance and policy automation guidance within Workforce Planning Era;",
  );
  sql = sql.replace(
    /Phase 253 Enterprise Governance & Policy Automation Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 252 Enterprise Action Prioritization & Focus Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );

  sql = sql.replace(
    /'authenticated', 252\nwhere not exists \(select 1 from public\.aipify_knowledge_categories where slug = 'aipify-enterprise-action-prioritization-focus-engine'/,
    `'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-enterprise-action-prioritization-focus-engine'`,
  );

  return sql;
}

function genMigration() {
  const src252 = path.join(
    ROOT,
    "supabase/migrations/20261414000000_aipify_enterprise_action_prioritization_focus_engine_phase252.sql",
  );
  if (!fs.existsSync(src252)) throw new Error("Phase 252 migration required");
  let m = transformFrom252(fs.readFileSync(src252, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-enterprise-action-prioritization-focus-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(
    path.join(ROOT, `lib/core/${P.slug}.ts`),
    transformFrom252(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")),
  );
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(
      path.join(dst, f),
      transformFrom252(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")),
    );
  }
  const panel = path.join(
    ROOT,
    `components/app/${srcSlug}/AipifyEnterpriseActionPrioritizationFocusEngineDashboardPanel.tsx`,
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`),
    transformFrom252(fs.readFileSync(panel, "utf8")),
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/index.ts`),
    `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`,
  );
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom252(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom252(
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

${P.centerTitle} within ${P.era}. **Era capstone.** ${P.companion} supports policy lifecycle management, approval workflows, automated acknowledgements, review scheduling, compliance tracking, governance dashboards, notifications, exception workflows, analytics, audit trails, executive summaries, and version management — does NOT bypass governance RBAC, expose sensitive governance records without authorization, or modify immutable policy acknowledgements.

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

## What is the Enterprise Governance & Policy Automation Engine?

The Enterprise Governance & Policy Automation Engine helps organizations automate governance processes, policy enforcement and compliance activities at \`/app/${P.slug}\`.

## What governance features are included?

Policy lifecycle management, approval workflows, automated acknowledgements, review scheduling, compliance obligation tracking, governance dashboards, governance notifications, exception request workflows, policy analytics, audit trails, executive summaries, and version management.

## What policy types are supported?

Information security, HR, data privacy, acceptable use, code of conduct, operational procedures, compliance requirements, and custom organizational policies.

## What automation capabilities are included?

Schedule policy reviews, notify employees of required acknowledgements, escalate overdue acknowledgements, trigger governance workflows, archive obsolete policies, generate governance reports, support audit preparation, and track policy acceptance status.

## What intelligence features are included?

Detect outdated policies, surface compliance gaps, recommend review priorities, highlight policy exceptions, identify departments with low acknowledgement rates, and encourage proactive governance practices.

## Who can access governance automation?

Super Admin (full access), Tenant Admin (organization governance settings), Executives (governance oversight), Managers (department policy visibility), Employees (participation and acknowledgements), Compliance Teams (governance administration) — enterprise RBAC.

## Are policy acknowledgements protected?

**Yes.** Governance records follow RBAC policies. Policy acknowledgements are immutable. Organizations control retention policies.

## How does this integrate with other Aipify surfaces?

${P.crossLinkNote}

## Does the Governance Companion replace human judgment?

**No.** ${P.companion} supports governance clarity — it does **NOT** bypass governance RBAC, expose sensitive governance records without authorization, or modify immutable policy acknowledgements.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Governance: lifecycle, approvals, acknowledgements, reviews, compliance, dashboards, notifications, exceptions, analytics, audit trails, executive summaries, versions.
Types: information security, HR, data privacy, acceptable use, code of conduct, operational, compliance, custom.
Automation: schedule reviews, notify acknowledgements, escalate overdue, trigger workflows, archive obsolete, reports, audit prep, acceptance tracking.
Intelligence: outdated policies, compliance gaps, review priorities, exceptions, low acknowledgement departments, proactive governance.
Security: governance RBAC, immutable acknowledgements, retention policies, audit logging, enterprise permissions, 2FA.
Design principles: Transparency before automation, accountability before convenience, control before complexity.
Companion limitations: no bypassing governance RBAC, no exposing sensitive records, no modifying immutable acknowledgements.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate. Era capstone 249–253.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never bypasses governance RBAC, exposes sensitive governance records without authorization, or modifies immutable policy acknowledgements.";
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
      '| "aipifyEnterpriseActionPrioritizationFocusEngine"',
      `| "aipifyEnterpriseActionPrioritizationFocusEngine"\n  | "${id}"`,
    );
  }
  if (!c.includes(href)) {
    const anchor =
      /id: "aipifyEnterpriseActionPrioritizationFocusEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyEnterpriseActionPrioritizationFocusEngine",\n  },/;
    c = c.replace(
      anchor,
      (m) =>
        `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-enterprise-action-prioritization-focus-engine")) {\n    return "aipifyEnterpriseActionPrioritizationFocusEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-enterprise-action-prioritization-focus-engine")) {\n    return "aipifyEnterpriseActionPrioritizationFocusEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace(
        '"aipify_enterprise_action_prioritization_focus.steward",',
        `"aipify_enterprise_action_prioritization_focus.steward",\n    "${perm}",`,
      );
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-enterprise-action-prioritization-focus-engine";',
      `export * from "./aipify-enterprise-action-prioritization-focus-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era} capstone. ${P.companion} supports policy lifecycle management, approval workflows, automated acknowledgements, compliance tracking, governance dashboards, exception workflows, analytics, and audit trails. Supports transparent governance — does NOT bypass governance RBAC or modify immutable acknowledgements. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Governance automation score",
    modeLabel: "Mode",
    readinessLabel: "Governance automation maturity level",
    executiveReviews: "Executive governance summaries",
    activeReflections: "Active governance policy scaffolds",
    humanOversightRequired: `Human oversight required — users retain compliance judgment control; ${P.companion} supports only`,
    eraOpenerSummary: `Workforce Planning Era — Phases ${P.eraRange} (capstone)`,
    eraOpenerNote:
      "Cross-link only — do not duplicate Trust Center, Compliance Engine, Notification Engine, Analytics Engine, Executive Cockpit, Action Center, Document Intelligence, Enterprise Search, or Aipify Translate RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Policy lifecycle hub — governance prompts",
    frameworkLabel: "Policy types engine",
    reviewsLabel: "Governance governance dashboard",
    companionLabel: `${P.companion} — supports governance clarity, never replaces human compliance judgment`,
    subEngineLabel: "Approval workflows engine",
    reflections: "Governance policy scaffolds",
    executiveReviewEntries: "Policy acknowledgement entries",
    scaffoldNotes: "RBAC-protected governance policy scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT bypass governance RBAC, expose sensitive governance records without authorization, or modify immutable policy acknowledgements`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports enterprise governance and policy automation — users retain compliance judgment control and acknowledgements stay immutable.`,
      philosophy:
        "People First. RBAC-protected governance scaffolds. Growth Partner terminology — never Affiliate.",
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
        ? "Styring og retningslinjer"
        : locale === "sv"
          ? "Styrning och policy"
          : locale === "da"
            ? "Governance og politik"
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
      'export * from "./implementation-blueprint-phase252-vocabulary";',
      `export * from "./implementation-blueprint-phase252-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE252_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase252-aipify-enterprise-action-prioritization-focus.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE252_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase252-aipify-enterprise-action-prioritization-focus.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_enterprise_action_prioritization_focus.view`, `aipify_enterprise_action_prioritization_focus.manage`, `aipify_enterprise_action_prioritization_focus.steward`.";
  const entry = `\n**Enterprise Governance & Policy Automation Engine (Phase 253):** See [AIPIFY_ENTERPRISE_GOVERNANCE_POLICY_AUTOMATION_ENGINE_PHASE253.md](./AIPIFY_ENTERPRISE_GOVERNANCE_POLICY_AUTOMATION_ENGINE_PHASE253.md) — Policy lifecycle management, approval workflows, automated acknowledgements, review scheduling, compliance tracking, governance dashboards, notifications, exception workflows, analytics, audit trails, executive summaries, and version management. **Era capstone** for Workforce Planning Era (249–253). \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** bypassing governance RBAC, exposing sensitive governance records without authorization, or modifying immutable policy acknowledgements. Cross-links only: Trust Center, Compliance Engine Phase 225, Enterprise Notification Engine Phase 233, Enterprise Analytics Engine Phase 235, Executive Cockpit Phase 200, Action Center Phase 205, Document Intelligence Engine Phase 230, Enterprise Search Engine, Aipify Translate Phase 238. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 253")) {
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
  console.error(`Phase ${P.phase} docs generated; stack requires Phase 252 artifacts: ${err.message}`);
  process.exitCode = 1;
}
