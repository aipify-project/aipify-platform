#!/usr/bin/env node
/** ABOS Phase 231 — Enterprise Workflow Automation Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "workflow_dashboard",
  "workflow_builder_center",
  "trigger_automation_center",
  "approval_workflow_engine",
  "conditional_logic_engine",
  "execution_analytics_engine",
  "cross_module_automation_center",
  "workflow_governance_dashboard",
  "workflow_integration_center",
];

const P = {
  phase: 231,
  migration: "20261392000000_aipify_enterprise_workflow_automation_engine_phase231.sql",
  slug: "aipify-enterprise-workflow-automation-engine",
  base: "AipifyEnterpriseWorkflowAutomation",
  camel: "aipifyEnterpriseWorkflowAutomationEngine",
  snake: "aipify_enterprise_workflow_automation",
  permPrefix: "aipify_enterprise_workflow_automation",
  helper: "aewae",
  bp: "aewaebp231",
  decisionType: "aipify_enterprise_workflow_automation_engine",
  title: "Enterprise Workflow Automation",
  centerTitle: "Workflow Center",
  companion: "Workflow Companion",
  scoreKey: "aipify_enterprise_workflow_automation_score",
  modeKey: "workflow_automation_mode",
  levelKey: "workflow_maturity_level",
  thirdEntity: "workflow_automation_notes",
  era: "Creative Intelligence Era (229–233)",
  eraRange: "229–233",
  docSlug: "AIPIFY_ENTERPRISE_WORKFLOW_AUTOMATION_ENGINE",
  ilmFile: "implementation-blueprint-phase231-aipify-enterprise-workflow-automation.txt",
  navLabel: "Workflows",
  crossLinkNote:
    "Cross-links only: Action Center, Decision Center, Executive Cockpit Phase 200, Document Intelligence, Communication Center, Customer Success Center, and Knowledge Center — never bypass workflow RBAC, skip approval controls, or execute sensitive workflows without governance.",
  companionLimitations: [
    "bypassing_workflow_rbac",
    "skipping_approval_controls",
    "executing_sensitive_workflows_without_governance",
    "replacing_human_workflow_stewardship",
    "modifying_workflow_audit_trail",
    "unlogged_workflow_changes",
    "improvisation_before_process",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom230(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyDocumentIntelligenceEnterpriseDocument", P.base],
    ["aipify-document-intelligence-enterprise-document-engine", P.slug],
    ["aipify_document_intelligence_enterprise_document", P.snake],
    ["aipifyDocumentIntelligenceEnterpriseDocument", P.camel.replace(/Engine$/, "")],
    ["aipifyDocumentIntelligenceEnterpriseDocumentEngine", P.camel],
    ["adiedebp230", P.bp],
    ["_adiede_", `_${P.helper}_`],
    ["aipify_document_intelligence_enterprise_document_score", P.scoreKey],
    ["document_intelligence_mode", P.modeKey],
    ["document_governance_level", P.levelKey],
    ["document_intelligence_notes", P.thirdEntity],
    ["DocumentIntelligenceNote", thirdPascal],
    ["document_intelligence_notes_count", `${P.thirdEntity}_count`],
    ["Documents Phase 230", "__DOCUMENTS_PHASE_230__"],
    ["Document Center", P.centerTitle],
    ["Document Companion", P.companion],
    ["__DOCUMENTS_PHASE_230__", "Documents Phase 230"],
    ["Document Intelligence & Enterprise Document", P.title],
    ["Documents", P.navLabel],
    ["Phase 230", `Phase ${P.phase}`],
    ["aipify_document_intelligence_enterprise_document.view", `${P.permPrefix}.view`],
    ["aipify_document_intelligence_enterprise_document.manage", `${P.permPrefix}.manage`],
    ["aipify_document_intelligence_enterprise_document.steward", `${P.permPrefix}.steward`],
    ["aipify_document_intelligence_enterprise_document_engine", P.decisionType],
    ["20261391000000_aipify_document_intelligence_enterprise_document_engine_phase230.sql", P.migration],
    ["Repo Phase 230", `Repo Phase ${P.phase}`],
    ["Phase 230 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE230_AIPIFY_DOCUMENT_INTELLIGENCE_ENTERPRISE_DOCUMENT_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase230", `implementation-blueprint-phase${P.phase}`],
    ["document_dashboard", SCAFFOLDS[0]],
    ["document_generation_center", SCAFFOLDS[1]],
    ["document_transformation_center", SCAFFOLDS[2]],
    ["presentation_generator", SCAFFOLDS[3]],
    ["action_item_extractor", SCAFFOLDS[4]],
    ["executive_summary_engine", SCAFFOLDS[5]],
    ["knowledge_center_converter", SCAFFOLDS[6]],
    ["document_governance_dashboard", SCAFFOLDS[7]],
    ["document_integration_center", SCAFFOLDS[8]],
    ["document_companion", "workflow_companion"],
    ["_seed_document_intelligence_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["document intelligence stewardship", "workflow automation stewardship"],
    ["document-informed decision support", "workflow-informed decision support"],
    ["clarity-first document culture", "process-first workflow culture"],
    ["active document workflows", "active workflow automations"],
    ["documents requiring attention", "workflows requiring attention"],
    ["Document Generation Center", "Visual Workflow Builder"],
    ["Document Transformation Center", "Trigger Automation Center"],
    ["Presentation Generator", "Approval Workflow Engine"],
    ["Action Item Extractor", "Conditional Logic Engine"],
    ["Executive Summary Engine", "Execution Analytics Engine"],
    ["Knowledge Center Converter", "Cross-Module Automation Center"],
    ["document productivity indicators", "workflow performance indicators"],
    ["document governance prompts", "workflow governance prompts"],
    ["document workflow prompts", "workflow automation prompts"],
    ["document workflow summaries", "workflow execution summaries"],
    ["approval workflow signals", "escalation automation signals"],
    ["protected document assets", "protected workflow definitions"],
    ["Clarity before complexity", "Process before improvisation"],
    ["Governance before convenience", "Governance before speed"],
    ["Stewardship before speed", "Consistency before complexity"],
    ["no_bypassing_document_rbac", "no_bypassing_workflow_rbac"],
    ["AIPIFY_DOCUMENT_INTELLIGENCE_ENTERPRISE_DOCUMENT_ENGINE", P.docSlug],
    ["document intelligence and enterprise document management", "enterprise workflow automation"],
    ["Document intelligence audit logs", "Workflow automation audit logs"],
    ["document access RBAC", "workflow execution RBAC"],
    ["document intelligence scaffolds", "workflow automation scaffolds"],
    ["configurable retention policy controls", "sensitive workflow approval controls"],
    ["Document intelligence score", "Workflow automation score"],
    ["Document governance level", "Workflow maturity level"],
    ["Document version history entries", "Workflow execution history entries"],
    ["Document intelligence", "Workflow automation"],
    ["document intelligence", "workflow automation"],
    ["document approval stewardship", "workflow approval stewardship"],
    ["document content beyond RBAC", "sensitive workflow execution beyond RBAC"],
    ["action center executions", "cross-module workflow actions"],
    ["executive summary reviews", "workflow performance reviews"],
    ["Knowledge Center, Action Center, Executive Cockpit Phase 200, and Language Center", "Action Center, Decision Center, Executive Cockpit Phase 200, Document Intelligence, Communication Center, Customer Success Center, and Knowledge Center"],
    ["Knowledge Center, Action Center, Executive Cockpit, and Language Center", "Action Center, Decision Center, Executive Cockpit, Document Intelligence, Communication Center, Customer Success Center, and Knowledge Center"],
    ["Never bypass document RBAC or skip approval workflows", "Never bypass workflow RBAC or skip approval controls"],
    ["document assets", "workflow definitions"],
    ["Document assets", "Workflow definitions"],
    ["confidential document approval", "confidential workflow approval"],
    ["executes document actions without human approval", "executes sensitive workflows without human approval"],
    ["Automated document actions without human approval", "Automated sensitive workflow execution without human approval"],
    ["Modifying document audit trails", "Modifying workflow audit trails"],
    ["Complexity before clarity", "Improvisation before process"],
    ["human document stewardship", "human workflow stewardship"],
    ["Human document stewardship", "Human workflow stewardship"],
    ["document decisions and governance accountability", "workflow decisions and operational accountability"],
    ["document workflow visibility", "workflow execution visibility"],
    ["document governance", "workflow governance"],
    ["create, summarize, transform and govern documents within Aipify — empowering employees with standard document tools while maintaining enterprise-grade RBAC, retention policies, and approval workflows", "automate repetitive business processes through secure, governed and enterprise-ready workflows — reducing manual work while maintaining RBAC, approval controls, and full audit logging"],
    ["document administration decreases, report creation accelerates, knowledge reuse improves, and employees work with clarity before complexity", "manual work decreases, process consistency improves, response times accelerate, and organizations adopt automation with governance before speed"],
    ["Documents Phase 231", "Documents Phase 230"],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports workflow automation — NOT bypassing workflow RBAC, skipping approval controls, or executing sensitive workflows without governance. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Enable organizations to automate repetitive business processes through secure, governed and enterprise-ready workflows — ${P.companion} prepares, humans decide.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Creative Intelligence Era (${P.eraRange}). Human-stewarded workflow governance; RBAC-protected workflow automation scaffolds; workflow changes logged; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations reduce manual work, increase process consistency, accelerate response times, and adopt automation with governance before speed.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Ten workflow modules with governance'),
    jsonb_build_object('key', 'workflow_builder_center', 'label', 'Visual workflow builder', 'emoji', '🔧', 'description', 'Design multi-step enterprise workflows'),
    jsonb_build_object('key', 'trigger_automation_center', 'label', 'Trigger automation center', 'emoji', '⚡', 'description', 'Trigger-based and scheduled automations'),
    jsonb_build_object('key', 'approval_workflow_engine', 'label', 'Approval workflow engine', 'emoji', '✅', 'description', 'Approval workflows with human gates'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not replace human workflow stewardship'),
    jsonb_build_object('key', 'execution_analytics_engine', 'label', 'Execution analytics engine', 'emoji', '📊', 'description', 'Execution history and performance analytics'),
    jsonb_build_object('key', 'workflow_governance_dashboard', 'label', 'Workflow governance dashboard', 'emoji', '🛡️', 'description', 'Templates, RBAC, and sensitive workflow controls'),
    jsonb_build_object('key', 'triggers_actions', 'label', 'Triggers and actions', 'emoji', '🔗', 'description', 'Enterprise triggers and governed actions catalog')
  ); ${D};
create or replace function public._${bp}_workflow_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — ten capabilities. Process before improvisation.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'workflow_dashboard', 'label', 'Workflow Dashboard — active automations and workflows requiring attention'),
    jsonb_build_object('key', 'workflow_builder_center', 'label', 'Visual Workflow Builder — design multi-step workflows'),
    jsonb_build_object('key', 'trigger_automation_center', 'label', 'Trigger & Scheduled Automations — event and schedule triggers'),
    jsonb_build_object('key', 'approval_workflow_engine', 'label', 'Approval Workflows — human approval gates'),
    jsonb_build_object('key', 'conditional_logic_engine', 'label', 'Conditional Logic Engine — branching and conditions'),
    jsonb_build_object('key', 'multi_step_execution', 'label', 'Multi-Step Execution — governed workflow runs'),
    jsonb_build_object('key', 'notification_escalation_engine', 'label', 'Notification & Escalation Automations'),
    jsonb_build_object('key', 'cross_module_automation_center', 'label', 'Cross-Module Automation — Action Center, Document Intelligence, and more'),
    jsonb_build_object('key', 'workflow_templates_history', 'label', 'Workflow Templates & Execution History'),
    jsonb_build_object('key', 'workflow_governance_dashboard', 'label', 'Workflow Governance & Performance Analytics')
  )); ${D};
create or replace function public._${bp}_workflow_builder_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Visual workflow builder — process before improvisation.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'template_fit', 'label', 'Does an approved workflow template best serve this process?'),
    jsonb_build_object('key', 'rbac_access', 'label', 'Does workflow execution follow role-based permissions?'),
    jsonb_build_object('key', 'approval_controls', 'label', 'Do sensitive steps require approval controls?'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Are workflow changes logged in the audit trail?'),
    jsonb_build_object('key', 'governance', 'label', 'How does governance encourage responsible automation adoption?')
  )); ${D};
create or replace function public._${bp}_trigger_automation_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Trigger automation center — governed triggers and schedules.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'employee_onboarding', 'label', 'New employee onboarding trigger'),
    jsonb_build_object('key', 'support_request', 'label', 'New support request trigger'),
    jsonb_build_object('key', 'document_approval', 'label', 'Document approval required trigger'),
    jsonb_build_object('key', 'meeting_completed', 'label', 'Meeting completed trigger'),
    jsonb_build_object('key', 'customer_risk', 'label', 'Customer risk detected trigger'),
    jsonb_build_object('key', 'contract_expiration', 'label', 'Contract nearing expiration trigger'),
    jsonb_build_object('key', 'task_overdue', 'label', 'Task overdue trigger'),
    jsonb_build_object('key', 'scheduled', 'label', 'Scheduled automations'),
    jsonb_build_object('key', 'custom_triggers', 'label', 'Custom triggers — RBAC and approval enforced')
  )); ${D};
create or replace function public._${bp}_execution_analytics_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Execution analytics — consistency before complexity.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'execution_history', 'label', 'Workflow execution history'),
    jsonb_build_object('key', 'performance_analytics', 'label', 'Workflow performance analytics'),
    jsonb_build_object('key', 'response_times', 'label', 'Faster response time tracking'),
    jsonb_build_object('key', 'adoption_metrics', 'label', 'Automation adoption metrics'),
    jsonb_build_object('key', 'stewardship', 'label', 'Governance before speed prompts')
  )); ${D};
create or replace function public._${bp}_workflow_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports workflow design and never bypasses workflow RBAC or skips approval controls.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'workflow_execution_summaries', 'label', 'Workflow execution summaries'),
    jsonb_build_object('key', 'builder_guidance', 'label', 'Visual workflow builder guidance'),
    jsonb_build_object('key', 'trigger_guidance', 'label', 'Trigger and schedule automation guidance'),
    jsonb_build_object('key', 'workflow_automation_prompts', 'label', 'Workflow automation prompts'),
    jsonb_build_object('key', 'action_catalog_highlights', 'label', 'Governed actions catalog highlights'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Workflow execution RBAC — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_approval_workflow_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Approval workflow engine — sensitive workflows require approval controls.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'approval_workflows', 'label', 'Multi-step approval workflows'),
    jsonb_build_object('key', 'request_approvals', 'label', 'Request approvals action'),
    jsonb_build_object('key', 'sensitive_controls', 'label', 'Sensitive workflow approval controls'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Approval granted — audit event logging'),
    jsonb_build_object('key', 'workflow_rbac', 'label', 'Workflow execution RBAC enforced'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates before execution')
  )); ${D};
create or replace function public._${bp}_conditional_logic_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Conditional logic engine — branching with governance.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'conditional_logic', 'label', 'Conditional logic support'),
    jsonb_build_object('key', 'multi_step', 'label', 'Multi-step workflow execution'),
    jsonb_build_object('key', 'create_tasks', 'label', 'Create tasks action'),
    jsonb_build_object('key', 'send_notifications', 'label', 'Send notifications action'),
    jsonb_build_object('key', 'assign_ownership', 'label', 'Assign ownership action'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for sensitive branches')
  )); ${D};
create or replace function public._${bp}_cross_module_automation_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Cross-module automation — orchestrate without duplication.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'generate_documents', 'label', 'Generate documents — Document Intelligence cross-link'),
    jsonb_build_object('key', 'create_briefings', 'label', 'Create executive briefings — Executive Cockpit cross-link'),
    jsonb_build_object('key', 'launch_workflows', 'label', 'Launch predefined workflows'),
    jsonb_build_object('key', 'external_integrations', 'label', 'Trigger external integrations — future approved'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only cross-module audit'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for cross-module actions')
  )); ${D};
create or replace function public._${bp}_workflow_governance_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Workflow governance — stewardship through responsibility.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'workflow_templates', 'label', 'Workflow template library'),
    jsonb_build_object('key', 'change_logging', 'label', 'Workflow changes logged — audit required'),
    jsonb_build_object('key', 'sensitive_approval', 'label', 'Sensitive workflows require approval controls'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Manager, Employee tiers'),
    jsonb_build_object('key', 'performance_analytics', 'label', 'Workflow performance analytics'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Workflow audit visibility respects role permissions')
  )); ${D};
create or replace function public._${bp}_workflow_integration_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Workflow integration center — cross-links only; Aipify orchestrates.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'action_center', 'label', 'Action Center', 'cross_link', '/app/action-center'),
    jsonb_build_object('key', 'decision_center', 'label', 'Decision Center', 'cross_link', '/app/aipify-decision-center-governance-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'document_intelligence', 'label', 'Document Intelligence Phase 230', 'cross_link', '/app/aipify-document-intelligence-enterprise-document-engine'),
    jsonb_build_object('key', 'communication_center', 'label', 'Communication Center', 'cross_link', '/app/aipify-organizational-communication-announcements-engine'),
    jsonb_build_object('key', 'customer_success_center', 'label', 'Customer Success Center', 'cross_link', '/app/aipify-customer-success-value-realization-engine'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'cross_link', '/app/knowledge-center'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for integration actions')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing workflow RBAC',
      'Skipping approval controls',
      'Executing sensitive workflows without governance',
      'Replacing human workflow stewardship',
      'Modifying workflow audit trails',
      'Unlogged workflow changes',
      'Improvisation before process',
      'Override human judgment'), 'principle', '${P.companion} supports — humans steward workflow decisions and operational accountability.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm automation support without operational pressure.', 'values', jsonb_build_array('process_before_improvisation','governance_before_speed','consistency_before_complexity','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Workflow automation audit logs via aipify_enterprise_workflow_automation_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_workflow_automation permissions — workflow execution RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'RBAC-protected workflow automation scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'change_logging', 'label', 'Workflow changes must be logged — organization controlled'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 230, 'key', 'document_intelligence_enterprise_document', 'label', 'Documents Phase 230', 'route', '/app/aipify-document-intelligence-enterprise-document-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 231, 'key', 'enterprise_workflow_automation', 'label', 'Workflows Phase 231', 'route', '/app/${P.slug}', 'description', 'Human-stewarded enterprise workflow automation')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'action_center', 'label', 'Action Center', 'route', '/app/action-center', 'relationship', 'Action Center integration — cross-link only'),
    jsonb_build_object('key', 'decision_center', 'label', 'Decision Center', 'route', '/app/aipify-decision-center-governance-engine', 'relationship', 'Decision Center integration — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive Cockpit integration — cross-link only'),
    jsonb_build_object('key', 'document_intelligence', 'label', 'Document Intelligence Phase 230', 'route', '/app/aipify-document-intelligence-enterprise-document-engine', 'relationship', 'Document Intelligence integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Process before improvisation — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with RBAC-protected workflow automation scaffolds and human approval gates. Growth Partner terminology. ${P.companion} supports — never bypasses workflow RBAC or skips approval controls.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans steward workflow decisions and operational accountability.', '${P.companion} informs and supports.', 'Process before improvisation — governance before speed.', 'Growth Partner — never Affiliate.', 'Creative Intelligence Era — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — workflow execution signals max ~500 chars. No sensitive workflow content beyond RBAC or PII in audit logs.'; ${D};
`.trim();
}


function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_document_intelligence_enterprise_document_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._adiedebp230_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_workflow_builder_center\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Visual workflow builder — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_workflow_builder_center()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_document_generation_center\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Visual workflow builder — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_workflow_builder_center()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_workflow_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Workflow Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_workflow_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_document_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Workflow Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_workflow_dashboard()->'capabilities') = 10,`,
  );

  for (const fn of [
    "workflow_dashboard",
    "workflow_builder_center",
    "trigger_automation_center",
    "execution_analytics_engine",
    "workflow_companion",
    "approval_workflow_engine",
    "conditional_logic_engine",
    "cross_module_automation_center",
    "workflow_governance_dashboard",
    "workflow_integration_center",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${P.bp}_${fn}()`);
  }

  sql = sql.replace(
    /select 'aipify-document-intelligence-enterprise-document-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );
  sql = sql.replace(
    /select 'aipify-document-intelligence-enterprise-document-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected document intelligence and enterprise document guidance within Creative Intelligence Era; cross-link only for Knowledge Center, Action Center, Executive Cockpit Phase 200, and Language Center.",
    "RBAC-protected enterprise workflow automation guidance within Creative Intelligence Era; cross-link only for Action Center, Decision Center, Executive Cockpit Phase 200, Document Intelligence, Communication Center, Customer Success Center, and Knowledge Center.",
  );

  return sql;
}


function genMigration() {
  const src230 = path.join(ROOT, "supabase/migrations/20261391000000_aipify_document_intelligence_enterprise_document_engine_phase230.sql");
  if (!fs.existsSync(src230)) throw new Error("Phase 230 migration required");
  let m = transformFrom230(fs.readFileSync(src230, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-document-intelligence-enterprise-document-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(path.join(ROOT, `lib/core/${P.slug}.ts`), transformFrom230(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")));
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom230(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")));
  }
  const panel = path.join(ROOT, `components/app/${srcSlug}/AipifyDocumentIntelligenceEnterpriseDocumentEngineDashboardPanel.tsx`);
  write(path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`), transformFrom230(fs.readFileSync(panel, "utf8")));
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`);
  write(path.join(ROOT, `app/app/${P.slug}/page.tsx`), transformFrom230(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")));
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom230(fs.readFileSync(path.join(ROOT, `app/api/aipify/${srcSlug}/${route}/route.ts`), "utf8")),
    );
  }
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports workflow automation — does NOT bypass workflow RBAC, skip approval controls, or execute sensitive workflows without governance.

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

## What is the Enterprise Workflow Automation Engine?

The Enterprise Workflow Automation Engine enables organizations to automate repetitive business processes through secure, governed workflows at \`/app/${P.slug}\`.

## What workflow features are included?

Visual workflow builder, trigger-based automations, scheduled automations, approval workflows, conditional logic, multi-step execution, notification automations, escalation automations, cross-module automation, workflow templates, execution history, and performance analytics.

## What triggers are supported?

New employee onboarding, new support request, document approval required, meeting completed, customer risk detected, contract nearing expiration, task overdue, customer milestone achieved, executive review required, and custom triggers — all governed by RBAC.

## What actions can workflows perform?

Create tasks, send notifications, request approvals, generate documents, update records, assign ownership, schedule follow-ups, create executive briefings, launch predefined workflows, and trigger external integrations — with approval controls where required.

## Who can manage workflows?

Super Admin (full access), Tenant Admin (organization workflows), Managers (department workflows), and Employees (authorized participation) — all governed by enterprise RBAC.

## Are workflow changes audited?

**Yes.** Workflow changes must be logged. Sensitive workflows require approval controls and all execution follows RBAC policies.

## How does this integrate with other Aipify surfaces?

Cross-link only: Action Center, Decision Center, Executive Cockpit Phase 200, Document Intelligence, Communication Center, Customer Success Center, and Knowledge Center — never duplicate their RPCs.

## Does the Workflow Companion replace human oversight?

**No.** ${P.companion} prepares workflow design and execution visibility — it does **NOT** bypass workflow RBAC, skip approval controls, or execute sensitive workflows without governance.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Workflow Center: workflow dashboard, visual workflow builder, trigger automation center, approval workflow engine, conditional logic engine, execution analytics engine, cross-module automation center, workflow governance dashboard, workflow integration center.
Triggers: employee onboarding, support request, document approval, meeting completed, customer risk, contract expiration, task overdue, milestones, executive review, custom triggers.
Actions: create tasks, send notifications, request approvals, generate documents, update records, assign ownership, schedule follow-ups, executive briefings, launch workflows, external integrations.
Design principles: Process before improvisation, governance before speed, consistency before complexity.
Companion limitations: no bypassing workflow RBAC, no skipping approval controls, no executing sensitive workflows without governance.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never bypasses workflow RBAC, skips approval controls, or executes sensitive workflows without governance.";
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
    c = c.replace('| "aipifyDocumentIntelligenceEnterpriseDocumentEngine"', `| "aipifyDocumentIntelligenceEnterpriseDocumentEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    const anchor = /id: "aipifyDocumentIntelligenceEnterpriseDocumentEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyDocumentIntelligenceEnterpriseDocumentEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-document-intelligence-enterprise-document-engine")) {\n    return "aipifyDocumentIntelligenceEnterpriseDocumentEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-document-intelligence-enterprise-document-engine")) {\n    return "aipifyDocumentIntelligenceEnterpriseDocumentEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_document_intelligence_enterprise_document.steward",', `"aipify_document_intelligence_enterprise_document.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-document-intelligence-enterprise-document-engine";',
      `export * from "./aipify-document-intelligence-enterprise-document-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports visual workflow building, triggers, and governed automation. Supports employees — does NOT bypass workflow RBAC or skip approval controls. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Workflow automation score",
    modeLabel: "Mode",
    readinessLabel: "Workflow maturity level",
    executiveReviews: "Workflow performance reviews",
    activeReflections: "Active workflow automation scaffolds",
    humanOversightRequired: `Human oversight required — humans steward workflow decisions; ${P.companion} supports only`,
    eraOpenerSummary: `Creative Intelligence Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate Action Center, Decision Center, Executive Cockpit, Document Intelligence, Communication Center, Customer Success Center, or Knowledge Center RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Visual workflow builder — governance prompts",
    frameworkLabel: "Trigger automation center",
    reviewsLabel: "Workflow governance dashboard",
    companionLabel: `${P.companion} — supports automation, never replaces human workflow stewardship`,
    subEngineLabel: "Approval workflow engine",
    reflections: "Workflow automation scaffolds",
    executiveReviewEntries: "Workflow execution history entries",
    scaffoldNotes: "RBAC-protected workflow automation scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT bypass workflow RBAC, skip approval controls, or execute sensitive workflows without governance`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports workflow execution visibility — humans retain workflow stewardship authority.`,
      philosophy: "People First. RBAC-protected workflow automation scaffolds. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
      growthEra: `${P.era} — Phase ${P.phase}.`,
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
        ? "Arbeidsflyter"
        : locale === "sv"
          ? "Arbetsflöden"
          : locale === "da"
            ? "Arbejdsgange"
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
      'export * from "./implementation-blueprint-phase230-vocabulary";',
      `export * from "./implementation-blueprint-phase230-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE229_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase229-aipify-studio-creative-intelligence.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE229_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase229-aipify-studio-creative-intelligence.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_studio_creative_intelligence.view`, `aipify_studio_creative_intelligence.manage`, `aipify_document_intelligence_enterprise_document.steward`.";
  const entry = `\n**Enterprise Workflow Automation Engine (Phase 231):** See [AIPIFY_ENTERPRISE_WORKFLOW_AUTOMATION_ENGINE_PHASE231.md](./AIPIFY_ENTERPRISE_WORKFLOW_AUTOMATION_ENGINE_PHASE231.md) — Workflow Center for visual builder, triggers, schedules, approvals, conditional logic, multi-step execution, notifications, escalations, cross-module automation, templates, execution history, performance analytics, and integration center. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** bypassing workflow RBAC, skipping approval controls, or executing sensitive workflows without governance. Cross-links only: Action Center, Decision Center, Executive Cockpit Phase 200, Document Intelligence, Communication Center, Customer Success Center, Knowledge Center. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 231")) {
    const idx = c.indexOf(marker);
    c = idx === -1 ? `${c}\n${entry}\n` : `${c.slice(0, idx + marker.length)}${entry}${c.slice(idx + marker.length)}`;
    fs.writeFileSync(file, c);
  }
}

genStack();
genMigration();
genDocs();
patchNav();
patchPermissions();
patchTenant();
patchI18n();
patchIlmIndex();
patchArchitecture();
console.log(`Phase ${P.phase} complete`);
