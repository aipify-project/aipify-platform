#!/usr/bin/env node
/** ABOS Phase 254 — Enterprise Knowledge Validation & Quality Assurance Engine (Era Opener 254–258) */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "quality_dashboard",
  "knowledge_review_hub",
  "knowledge_types_engine",
  "approval_processes_engine",
  "expiration_monitoring_engine",
  "usage_analytics_engine",
  "quality_controls_dashboard",
  "feedback_collection_engine",
  "quality_integration_center",
];

const P = {
  phase: 254,
  migration:
    "20261416000000_aipify_enterprise_knowledge_validation_quality_assurance_engine_phase254.sql",
  slug: "aipify-enterprise-knowledge-validation-quality-assurance-engine",
  base: "AipifyEnterpriseKnowledgeValidationQualityAssurance",
  camel: "aipifyEnterpriseKnowledgeValidationQualityAssuranceEngine",
  snake: "aipify_enterprise_knowledge_validation_quality_assurance",
  permPrefix: "aipify_enterprise_knowledge_validation_quality_assurance",
  helper: "aekvqae",
  bp: "aekvqaebp254",
  decisionType: "aipify_enterprise_knowledge_validation_quality_assurance_engine",
  title: "Enterprise Knowledge Validation & Quality Assurance",
  centerTitle: "Knowledge Validation & Quality",
  companion: "Quality Companion",
  scoreKey: "aipify_enterprise_knowledge_validation_quality_assurance_score",
  modeKey: "enterprise_knowledge_validation_quality_assurance_mode",
  levelKey: "enterprise_knowledge_validation_quality_assurance_maturity_level",
  thirdEntity: "enterprise_knowledge_validation_quality_assurance_notes",
  era: "Knowledge Quality Era (254–258)",
  eraRange: "254–258",
  docSlug: "AIPIFY_ENTERPRISE_KNOWLEDGE_VALIDATION_QUALITY_ASSURANCE_ENGINE",
  ilmFile:
    "implementation-blueprint-phase254-aipify-enterprise-knowledge-validation-quality-assurance.txt",
  navLabel: "Knowledge Quality",
  crossLinkNote:
    "Cross-links only: Knowledge Center, Learning Center, Document Intelligence Engine Phase 230, Enterprise Analytics Engine Phase 235, Enterprise Search Engine, Enterprise Notification Engine Phase 233, Trust Center, Executive Cockpit Phase 200, and Aipify Translate Phase 238 — never bypass knowledge RBAC, expose sensitive knowledge records without authorization, or modify immutable version history.",
  companionLimitations: [
    "bypassing_knowledge_rbac",
    "exposing_sensitive_knowledge_records_without_rbac",
    "modifying_immutable_version_history",
    "unlogged_knowledge_quality_changes",
    "replacing_human_stewardship_judgment",
    "modifying_quality_audit_trail",
    "ignoring_retention_policies",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom253(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyEnterpriseGovernancePolicyAutomation", P.base],
    ["aipify-enterprise-governance-policy-automation-engine", P.slug],
    ["aipify_enterprise_governance_policy_automation", P.snake],
    ["aipifyEnterpriseGovernancePolicyAutomationEngine", P.camel],
    ["aegpaebp253", P.bp],
    ["_aegpae_", `_${P.helper}_`],
    ["aipify_enterprise_governance_policy_automation_score", P.scoreKey],
    ["enterprise_governance_policy_automation_mode", P.modeKey],
    ["enterprise_governance_policy_automation_maturity_level", P.levelKey],
    ["enterprise_governance_policy_automation_notes", P.thirdEntity],
    ["EnterpriseGovernancePolicyAutomationNote", thirdPascal],
    ["enterprise_governance_policy_automation_notes_count", `${P.thirdEntity}_count`],
    ["Governance & Policy Phase 253", "__GOVERNANCE_PHASE_253__"],
    ["Governance Companion", "__QUALITY_COMPANION__"],
    ["Enterprise Governance & Policy Automation", P.title],
    ["__QUALITY_COMPANION__", P.companion],
    ["Governance & Policy", "__QUALITY_CENTER__"],
    ["__GOVERNANCE_PHASE_253__", "Governance & Policy Phase 253"],
    ["Phase 253", `Phase ${P.phase}`],
    ["aipify_enterprise_governance_policy_automation.view", `${P.permPrefix}.view`],
    ["aipify_enterprise_governance_policy_automation.manage", `${P.permPrefix}.manage`],
    ["aipify_enterprise_governance_policy_automation.steward", `${P.permPrefix}.steward`],
    ["aipify_enterprise_governance_policy_automation_engine", P.decisionType],
    [
      "20261415000000_aipify_enterprise_governance_policy_automation_engine_phase253.sql",
      P.migration,
    ],
    ["Repo Phase 253", `Repo Phase ${P.phase}`],
    ["Phase 253 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE253_AIPIFY_ENTERPRISE_GOVERNANCE_POLICY_AUTOMATION_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase253", `implementation-blueprint-phase${P.phase}`],
    ["governance_governance_dashboard", SCAFFOLDS[6]],
    ["governance_dashboard", SCAFFOLDS[0]],
    ["policy_lifecycle_hub", SCAFFOLDS[1]],
    ["policy_types_engine", SCAFFOLDS[2]],
    ["approval_workflows_engine", SCAFFOLDS[3]],
    ["compliance_tracking_engine", SCAFFOLDS[4]],
    ["policy_analytics_engine", SCAFFOLDS[5]],
    ["exception_workflows_engine", SCAFFOLDS[7]],
    ["governance_integration_center", SCAFFOLDS[8]],
    ["governance_companion", "quality_companion"],
    [
      "_seed_enterprise_governance_policy_automation_notes",
      `_seed_${P.thirdEntity.replace("_notes", "")}_notes`,
    ],
    ["governance policy automation stewardship", "knowledge quality assurance stewardship"],
    ["automation-informed governance support", "validation-informed quality support"],
    ["accountability-first governance culture", "stewardship-first knowledge culture"],
    ["active governance programs", "active quality programs"],
    ["policies requiring executive attention", "knowledge requiring executive attention"],
    ["Policy Lifecycle Hub", "Knowledge Review Hub"],
    ["Policy Types Engine", "Knowledge Types Engine"],
    ["Approval Workflows Engine", "Approval Processes Engine"],
    ["Compliance Tracking Engine", "Expiration Monitoring Engine"],
    ["Policy Analytics Engine", "Usage Analytics Engine"],
    ["Governance Governance Dashboard", "Quality Controls Dashboard"],
    ["acknowledgement completion indicators", "review completion indicators"],
    ["governance automation prompts", "knowledge quality prompts"],
    ["governance assistant prompts", "quality assistant prompts"],
    ["automated policy acknowledgements", "knowledge feedback collection"],
    ["governance notification signals", "expiration monitoring signals"],
    ["RBAC-protected governance policies", "RBAC-protected knowledge policies"],
    ["Transparency before automation", "Accuracy before volume"],
    ["Accountability before convenience", "Stewardship before neglect"],
    ["Control before complexity", "Trust before assumption"],
    ["no_bypassing_governance_rbac", "no_bypassing_knowledge_rbac"],
    ["AIPIFY_ENTERPRISE_GOVERNANCE_POLICY_AUTOMATION_ENGINE", P.docSlug],
    ["enterprise governance and policy automation", "enterprise knowledge validation and quality assurance"],
    ["Governance policy automation audit logs", "Knowledge quality assurance audit logs"],
    ["governance RBAC", "knowledge RBAC"],
    ["governance policy automation scaffolds", "knowledge quality assurance scaffolds"],
    ["organization retention policies", "organization retention policies"],
    ["Governance automation score", "Knowledge quality score"],
    ["Governance automation maturity level", "Knowledge quality maturity level"],
    ["Policy acknowledgement entries", "Knowledge review entries"],
    ["enterprise governance policy automation", "enterprise knowledge validation quality assurance"],
    ["retention policy stewardship", "retention policy stewardship"],
    ["governance records beyond RBAC", "knowledge records beyond RBAC"],
    ["exception request workflow assistance", "feedback collection assistance"],
    ["manager department policy visibility", "manager department knowledge oversight"],
    [
      "Trust Center, Compliance Engine Phase 225, Enterprise Notification Engine Phase 233, Enterprise Analytics Engine Phase 235, Executive Cockpit Phase 200, Action Center Phase 205, Document Intelligence Engine Phase 230, Enterprise Search Engine, and Aipify Translate Phase 238",
      "Knowledge Center, Learning Center, Document Intelligence Engine Phase 230, Enterprise Analytics Engine Phase 235, Enterprise Search Engine, Enterprise Notification Engine Phase 233, Trust Center, Executive Cockpit Phase 200, and Aipify Translate Phase 238",
    ],
    [
      "Never bypass governance RBAC or expose sensitive governance records without authorization",
      "Never bypass knowledge RBAC or expose sensitive knowledge records without authorization",
    ],
    ["governance programs", "quality programs"],
    ["Governance programs", "Quality programs"],
    ["sensitive governance record routing", "sensitive knowledge record routing"],
    ["exposes governance records without RBAC approval", "exposes knowledge records without RBAC approval"],
    [
      "Unauthorized governance access without RBAC approval",
      "Unauthorized knowledge access without RBAC approval",
    ],
    ["Modifying governance audit trails", "Modifying quality audit trails"],
    ["Automation before transparency", "Volume before accuracy"],
    ["user compliance judgment control", "user stewardship judgment control"],
    ["User compliance judgment control", "User stewardship judgment control"],
    ["governance decisions and retention policies", "quality decisions and retention policies"],
    ["policy visibility", "knowledge visibility"],
    ["governance automation", "knowledge validation"],
    [
      "enable organizations to automate governance processes, policy enforcement and compliance activities — maintaining governance RBAC, immutable acknowledgements, organization-controlled retention policies, and complete audit history",
      "enable organizations to ensure that knowledge, documentation and guidance remain accurate, relevant and trustworthy — maintaining knowledge RBAC, immutable version history, organization-controlled retention policies, and complete audit history",
    ],
    [
      "policy acknowledgement rates increase, compliance readiness improves, governance administration effort reduces, audit preparation accelerates, policy review completion improves, and organizational accountability increases with transparency before automation",
      "knowledge accuracy increases, outdated content reduces, employee trust in knowledge resources improves, review completion rates accelerate, Knowledge Center utilization increases, and organizational learning strengthens with accuracy before volume",
    ],
    ["Workforce Planning Era (249–253)", P.era],
    ["Workforce Planning Era capstone — 249–253", `Knowledge Quality Era opener — ${P.eraRange}`],
    ["Era capstone.", "Era opener."],
    ["closes the era", "opens the era"],
    ["Workforce Planning Era capstone", "Knowledge Quality Era opener"],
    ["__QUALITY_CENTER__", P.centerTitle],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports enterprise knowledge validation and quality assurance — NOT bypassing knowledge RBAC, exposing sensitive knowledge records without authorization, or modifying immutable version history. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Enable organizations to ensure that knowledge, documentation and guidance within Aipify remain accurate, relevant and trustworthy over time — ${P.companion} informs, humans decide.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Knowledge Quality Era (${P.eraRange}). Human-stewarded knowledge validation; RBAC-protected quality scaffolds; knowledge quality changes logged; ${P.companion} informs and supports. Era opener.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations increase knowledge accuracy, reduce outdated content, improve employee trust in knowledge resources, accelerate review completion rates, increase Knowledge Center utilization, and strengthen organizational learning with accuracy before volume.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Ten quality modules with validation'),
    jsonb_build_object('key', 'knowledge_review_hub', 'label', 'Knowledge review hub', 'emoji', '📋', 'description', 'Reviews, ownership, scheduling'),
    jsonb_build_object('key', 'knowledge_types_engine', 'label', 'Knowledge types engine', 'emoji', '🏆', 'description', 'Articles, FAQs, procedures, custom'),
    jsonb_build_object('key', 'approval_processes_engine', 'label', 'Approval processes engine', 'emoji', '🔗', 'description', 'Approvals, certification, versions'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not replace human stewardship judgment'),
    jsonb_build_object('key', 'usage_analytics_engine', 'label', 'Usage analytics engine', 'emoji', '📊', 'description', 'Usage, effectiveness, quality scoring'),
    jsonb_build_object('key', 'quality_controls_dashboard', 'label', 'Quality controls dashboard', 'emoji', '🛡️', 'description', 'RBAC and retention controls'),
    jsonb_build_object('key', 'expiration_monitoring_engine', 'label', 'Expiration monitoring engine', 'emoji', '🔔', 'description', 'Expiration, notifications, escalations')
  ); ${D};
create or replace function public._${bp}_quality_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — ten capabilities. Accuracy before volume.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'quality_dashboard', 'label', 'Executive Quality Dashboards'),
    jsonb_build_object('key', 'review_workflows', 'label', 'Knowledge Review Workflows'),
    jsonb_build_object('key', 'approval_processes', 'label', 'Knowledge Approval Processes'),
    jsonb_build_object('key', 'ownership_assignment', 'label', 'Knowledge Ownership Assignment'),
    jsonb_build_object('key', 'expiration_monitoring', 'label', 'Content Expiration Monitoring'),
    jsonb_build_object('key', 'review_scheduling', 'label', 'Review Scheduling'),
    jsonb_build_object('key', 'quality_scoring', 'label', 'Quality Scoring'),
    jsonb_build_object('key', 'feedback_collection', 'label', 'Knowledge Feedback Collection'),
    jsonb_build_object('key', 'usage_analytics', 'label', 'Knowledge Usage Analytics'),
    jsonb_build_object('key', 'version_management', 'label', 'Content Version Management & Certification')
  )); ${D};
create or replace function public._${bp}_knowledge_review_hub() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Knowledge review — stewardship before neglect.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'knowledge_rbac', 'label', 'Do knowledge records follow RBAC policies?'),
    jsonb_build_object('key', 'immutable_versions', 'label', 'Does version history remain immutable?'),
    jsonb_build_object('key', 'retention_policies', 'label', 'Do organizations control retention policies?'),
    jsonb_build_object('key', 'accuracy', 'label', 'Is knowledge validation transparent to employees?'),
    jsonb_build_object('key', 'trust', 'label', 'How does validation support trust before assumption?')
  )); ${D};
create or replace function public._${bp}_knowledge_types_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Knowledge types — trust before assumption.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'knowledge_center_articles', 'label', 'Knowledge Center articles'),
    jsonb_build_object('key', 'faqs', 'label', 'FAQs'),
    jsonb_build_object('key', 'policies', 'label', 'Policies'),
    jsonb_build_object('key', 'procedures', 'label', 'Procedures'),
    jsonb_build_object('key', 'onboarding_materials', 'label', 'Onboarding materials'),
    jsonb_build_object('key', 'training_resources', 'label', 'Training resources'),
    jsonb_build_object('key', 'meeting_playbooks', 'label', 'Meeting playbooks'),
    jsonb_build_object('key', 'operational_guidelines', 'label', 'Operational guidelines'),
    jsonb_build_object('key', 'strategic_documents', 'label', 'Strategic documents'),
    jsonb_build_object('key', 'custom', 'label', 'Custom knowledge assets')
  )); ${D};
create or replace function public._${bp}_feedback_collection_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Feedback collection — continuous improvement.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'draft', 'label', 'Draft'),
    jsonb_build_object('key', 'pending_approval', 'label', 'Pending approval'),
    jsonb_build_object('key', 'published', 'label', 'Published'),
    jsonb_build_object('key', 'review_due', 'label', 'Review due'),
    jsonb_build_object('key', 'feedback_pending', 'label', 'Feedback pending'),
    jsonb_build_object('key', 'update_requested', 'label', 'Update requested'),
    jsonb_build_object('key', 'certified', 'label', 'Certified'),
    jsonb_build_object('key', 'archived', 'label', 'Archived')
  )); ${D};
create or replace function public._${bp}_quality_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports knowledge quality clarity and never bypasses knowledge RBAC or modifies immutable version history.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'detect_outdated', 'label', 'Detect outdated knowledge'),
    jsonb_build_object('key', 'low_confidence', 'label', 'Identify low-confidence content'),
    jsonb_build_object('key', 'high_usage_review', 'label', 'Surface highly used articles requiring review'),
    jsonb_build_object('key', 'duplicate_knowledge', 'label', 'Highlight duplicate knowledge'),
    jsonb_build_object('key', 'review_priorities', 'label', 'Recommend review priorities'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Knowledge RBAC — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_approval_processes_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Approval processes — structured stewardship.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'knowledge_approvals', 'label', 'Knowledge approval processes'),
    jsonb_build_object('key', 'ownership_assignment', 'label', 'Knowledge ownership assignment'),
    jsonb_build_object('key', 'certification_status', 'label', 'Knowledge certification status'),
    jsonb_build_object('key', 'version_management', 'label', 'Content version management'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Quality audit trails'),
    jsonb_build_object('key', 'quality_scoring', 'label', 'Quality scoring')
  )); ${D};
create or replace function public._${bp}_expiration_monitoring_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Expiration monitoring — proactive quality.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'review_intervals', 'label', 'Define review intervals'),
    jsonb_build_object('key', 'review_scheduling', 'label', 'Schedule knowledge reviews'),
    jsonb_build_object('key', 'escalate_overdue', 'label', 'Escalate overdue reviews'),
    jsonb_build_object('key', 'archive_outdated', 'label', 'Archive outdated content'),
    jsonb_build_object('key', 'request_updates', 'label', 'Request content updates'),
    jsonb_build_object('key', 'track_completion', 'label', 'Track review completion')
  )); ${D};
create or replace function public._${bp}_usage_analytics_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Usage analytics — effectiveness visibility.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'knowledge_accuracy', 'label', 'Knowledge accuracy signals'),
    jsonb_build_object('key', 'outdated_reduction', 'label', 'Outdated content reduction'),
    jsonb_build_object('key', 'employee_trust', 'label', 'Employee trust in knowledge resources'),
    jsonb_build_object('key', 'review_completion', 'label', 'Review completion rates'),
    jsonb_build_object('key', 'kc_utilization', 'label', 'Knowledge Center utilization'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Quality audit visibility respects role permissions')
  )); ${D};
create or replace function public._${bp}_quality_controls_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Quality governance — organizations control retention policies.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'knowledge_rbac', 'label', 'Knowledge records follow RBAC policies'),
    jsonb_build_object('key', 'immutable_versions', 'label', 'Version history remains immutable'),
    jsonb_build_object('key', 'retention_policies', 'label', 'Organizations control retention policies'),
    jsonb_build_object('key', 'owner_responsibilities', 'label', 'Knowledge owners assigned content responsibilities'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Knowledge Owner, Manager, Employee tiers'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for knowledge quality changes')
  )); ${D};
create or replace function public._${bp}_quality_integration_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Quality integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'cross_link', '/app/knowledge'),
    jsonb_build_object('key', 'learning_center', 'label', 'Learning Center', 'cross_link', '/app/learning'),
    jsonb_build_object('key', 'document_intelligence', 'label', 'Document Intelligence Engine Phase 230', 'cross_link', '/app/aipify-document-intelligence-enterprise-document-engine'),
    jsonb_build_object('key', 'enterprise_analytics', 'label', 'Enterprise Analytics Engine Phase 235', 'cross_link', '/app/aipify-enterprise-analytics-operational-intelligence-engine'),
    jsonb_build_object('key', 'enterprise_search', 'label', 'Enterprise Search Engine Phase 234', 'cross_link', '/app/aipify-enterprise-search-universal-knowledge-access-engine'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'trust_center', 'label', 'Trust Center', 'cross_link', '/platform/trust'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-cockpit-engine'),
    jsonb_build_object('key', 'aipify_translate', 'label', 'Aipify Translate Phase 238', 'cross_link', '/app/aipify-translate-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for knowledge quality integration actions')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing knowledge RBAC',
      'Exposing sensitive knowledge records without authorization',
      'Modifying immutable version history',
      'Replacing human stewardship judgment',
      'Modifying quality audit trails',
      'Unlogged knowledge quality changes',
      'Ignoring retention policies',
      'Override human judgment'), 'principle', '${P.companion} supports — users retain stewardship judgment control and version history stays immutable.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm knowledge support without pressure.', 'values', jsonb_build_array('accuracy_before_volume','stewardship_before_neglect','trust_before_assumption','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Knowledge quality assurance audit logs via aipify_enterprise_knowledge_validation_quality_assurance_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_knowledge_validation_quality_assurance permissions — knowledge RBAC'),
    jsonb_build_object('key', 'knowledge_rbac', 'label', 'Knowledge records follow RBAC policies'),
    jsonb_build_object('key', 'immutable_versions', 'label', 'Version history remains immutable'),
    jsonb_build_object('key', 'retention_policies', 'label', 'Organizations control retention policies'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 253, 'key', 'enterprise_governance_policy_automation', 'label', 'Governance & Policy Phase 253', 'route', '/app/aipify-enterprise-governance-policy-automation-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 254, 'key', 'enterprise_knowledge_validation_quality_assurance', 'label', 'Knowledge Validation & Quality Phase 254', 'route', '/app/${P.slug}', 'description', 'Human-stewarded knowledge validation — era opener')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'route', '/app/knowledge', 'relationship', 'Knowledge Center integration — cross-link only'),
    jsonb_build_object('key', 'learning_center', 'label', 'Learning Center', 'route', '/app/learning', 'relationship', 'Learning Center integration — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-cockpit-engine', 'relationship', 'Executive Cockpit integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Stewardship before neglect — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with RBAC-protected quality scaffolds and immutable version history protections. Growth Partner terminology. ${P.companion} supports — never bypasses knowledge RBAC or modifies immutable version history.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — users retain stewardship judgment control.', '${P.companion} informs and supports.', 'Accuracy before volume — stewardship before neglect.', 'Growth Partner — never Affiliate.', 'Knowledge Quality Era opener — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — quality signals max ~500 chars. No knowledge content beyond RBAC or PII in audit logs.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_enterprise_governance_policy_automation_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._aegpaebp253_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_knowledge_review_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Knowledge review hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_knowledge_review_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_policy_lifecycle_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Knowledge review hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_knowledge_review_hub()->'reflection_questions') = 5,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_quality_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Knowledge Validation & Quality — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_quality_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_governance_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Knowledge Validation & Quality — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_quality_dashboard()->'capabilities') = 10,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  const replaceRpcRef = (sqlText, fn) => {
    if (fn === "quality_dashboard") {
      return sqlText.replace(/public\._(\w+)_quality_dashboard\(\)/g, (full, prefix) =>
        prefix.endsWith("quality") ? full : `public._${P.bp}_quality_dashboard()`,
      );
    }
    return sqlText.replace(
      new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"),
      `public._${P.bp}_${fn}()`,
    );
  };

  for (const fn of [...SCAFFOLDS, "quality_companion"].sort((a, b) => b.length - a.length)) {
    sql = replaceRpcRef(sql, fn);
  }

  sql = sql.replace(
    new RegExp(`select '${P.slug}'[^;]+;`, "g"),
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    /select 'aipify-enterprise-governance-policy-automation-engine'[^;]+;/g,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected enterprise governance and policy automation guidance within Workforce Planning Era;",
    "RBAC-protected enterprise knowledge validation and quality assurance guidance within Knowledge Quality Era;",
  );
  sql = sql.replace(
    /Phase 254 Enterprise Knowledge Validation & Quality Assurance Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 253 Enterprise Governance & Policy Automation Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );

  sql = sql.replace(
    /'authenticated', 253\nwhere not exists \(select 1 from public\.aipify_knowledge_categories where slug = 'aipify-enterprise-governance-policy-automation-engine'/,
    `'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-enterprise-governance-policy-automation-engine'`,
  );

  sql = sql.replaceAll("__TRANSLATE_CENTER__", P.centerTitle);

  sql = sql.replace(
    /'quality_quality_dashboard', public\._\w+_quality_quality_dashboard\(\)/,
    `'quality_controls_dashboard', public._${P.bp}_quality_controls_dashboard()`,
  );
  sql = sql.replace(
    /'governance_quality_dashboard', public\._\w+_quality_dashboard\(\)/,
    `'quality_controls_dashboard', public._${P.bp}_quality_controls_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_quality_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_quality_controls_dashboard()`,
  );

  return sql;
}

function genMigration() {
  const src253 = path.join(
    ROOT,
    "supabase/migrations/20261415000000_aipify_enterprise_governance_policy_automation_engine_phase253.sql",
  );
  if (!fs.existsSync(src253)) throw new Error("Phase 253 migration required");
  let m = transformFrom253(fs.readFileSync(src253, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-enterprise-governance-policy-automation-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(
    path.join(ROOT, `lib/core/${P.slug}.ts`),
    transformFrom253(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")),
  );
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(
      path.join(dst, f),
      transformFrom253(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")),
    );
  }
  const panel = path.join(
    ROOT,
    `components/app/${srcSlug}/AipifyEnterpriseGovernancePolicyAutomationEngineDashboardPanel.tsx`,
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`),
    transformFrom253(fs.readFileSync(panel, "utf8")),
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/index.ts`),
    `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`,
  );
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom253(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom253(
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

${P.centerTitle} within ${P.era}. **Era opener.** ${P.companion} supports knowledge review workflows, approval processes, ownership assignment, expiration monitoring, review scheduling, quality scoring, feedback collection, usage analytics, version management, executive quality dashboards, audit trails, and certification status — does NOT bypass knowledge RBAC, expose sensitive knowledge records without authorization, or modify immutable version history.

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

## What is the Enterprise Knowledge Validation & Quality Assurance Engine?

The Enterprise Knowledge Validation & Quality Assurance Engine helps organizations ensure knowledge, documentation and guidance remain accurate, relevant and trustworthy at \`/app/${P.slug}\`.

## What quality features are included?

Knowledge review workflows, approval processes, ownership assignment, expiration monitoring, review scheduling, quality scoring, feedback collection, usage analytics, version management, executive quality dashboards, audit trails, and certification status.

## What knowledge types are supported?

Knowledge Center articles, FAQs, policies, procedures, onboarding materials, training resources, meeting playbooks, operational guidelines, strategic documents, and custom knowledge assets.

## What quality capabilities are included?

Assign content owners, define review intervals, track review completion, archive outdated content, request updates, escalate overdue reviews, measure content effectiveness, and support continuous improvement.

## What intelligence features are included?

Detect outdated knowledge, identify low-confidence content, surface highly used articles requiring review, highlight duplicate knowledge, recommend review priorities, and encourage knowledge stewardship.

## Who can access knowledge quality assurance?

Super Admin (full access), Tenant Admin (organization knowledge settings), Knowledge Owners (assigned content responsibilities), Managers (department knowledge oversight), Employees (consumption and feedback) — enterprise RBAC.

## Is version history protected?

**Yes.** Knowledge records follow RBAC policies. Version history remains immutable. Organizations control retention policies.

## How does this integrate with other Aipify surfaces?

${P.crossLinkNote}

## Does the Quality Companion replace human judgment?

**No.** ${P.companion} supports knowledge stewardship — it does **NOT** bypass knowledge RBAC, expose sensitive knowledge records without authorization, or modify immutable version history.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Quality: review workflows, approvals, ownership, expiration, scheduling, scoring, feedback, analytics, versions, executive dashboards, audit trails, certification.
Types: Knowledge Center articles, FAQs, policies, procedures, onboarding, training, playbooks, guidelines, strategic documents, custom.
Capabilities: assign owners, review intervals, track completion, archive outdated, request updates, escalate overdue, measure effectiveness, continuous improvement.
Intelligence: outdated knowledge, low-confidence content, high-usage review needs, duplicates, review priorities, stewardship encouragement.
Security: knowledge RBAC, immutable version history, retention policies, audit logging, enterprise permissions, 2FA.
Design principles: Accuracy before volume, stewardship before neglect, trust before assumption.
Companion limitations: no bypassing knowledge RBAC, no exposing sensitive records, no modifying immutable version history.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate. Era opener 254–258.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never bypasses knowledge RBAC, exposes sensitive knowledge records without authorization, or modifies immutable version history.";
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
      '| "aipifyEnterpriseGovernancePolicyAutomationEngine"',
      `| "aipifyEnterpriseGovernancePolicyAutomationEngine"\n  | "${id}"`,
    );
  }
  if (!c.includes(href)) {
    const anchor =
      /id: "aipifyEnterpriseGovernancePolicyAutomationEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyEnterpriseGovernancePolicyAutomationEngine",\n  },/;
    c = c.replace(
      anchor,
      (m) =>
        `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-enterprise-governance-policy-automation-engine")) {\n    return "aipifyEnterpriseGovernancePolicyAutomationEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-enterprise-governance-policy-automation-engine")) {\n    return "aipifyEnterpriseGovernancePolicyAutomationEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace(
        '"aipify_enterprise_governance_policy_automation.steward",',
        `"aipify_enterprise_governance_policy_automation.steward",\n    "${perm}",`,
      );
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-enterprise-governance-policy-automation-engine";',
      `export * from "./aipify-enterprise-governance-policy-automation-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era} opener. ${P.companion} supports knowledge review workflows, approval processes, ownership assignment, expiration monitoring, quality scoring, feedback collection, usage analytics, and audit trails. Supports trustworthy knowledge — does NOT bypass knowledge RBAC or modify immutable version history. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Knowledge quality score",
    modeLabel: "Mode",
    readinessLabel: "Knowledge quality maturity level",
    executiveReviews: "Executive quality dashboards",
    activeReflections: "Active knowledge quality scaffolds",
    humanOversightRequired: `Human oversight required — users retain stewardship judgment control; ${P.companion} supports only`,
    eraOpenerSummary: `Knowledge Quality Era — Phases ${P.eraRange} (opener)`,
    eraOpenerNote:
      "Cross-link only — do not duplicate Knowledge Center, Learning Center, Document Intelligence, Analytics Engine, Enterprise Search, Notification Engine, Trust Center, Executive Cockpit, or Aipify Translate RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Knowledge review hub — quality prompts",
    frameworkLabel: "Knowledge types engine",
    reviewsLabel: "Quality controls dashboard",
    companionLabel: `${P.companion} — supports knowledge stewardship, never replaces human judgment`,
    subEngineLabel: "Approval processes engine",
    reflections: "Knowledge quality scaffolds",
    executiveReviewEntries: "Knowledge review entries",
    scaffoldNotes: "RBAC-protected knowledge quality scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT bypass knowledge RBAC, expose sensitive knowledge records without authorization, or modify immutable version history`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports enterprise knowledge validation and quality assurance — users retain stewardship judgment control and version history stays immutable.`,
      philosophy:
        "People First. RBAC-protected quality scaffolds. Growth Partner terminology — never Affiliate.",
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
        ? "Kunnskapskvalitet"
        : locale === "sv"
          ? "Kunskapskvalitet"
          : locale === "da"
            ? "Videnkvalitet"
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
      'export * from "./implementation-blueprint-phase253-vocabulary";',
      `export * from "./implementation-blueprint-phase253-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE253_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase253-aipify-enterprise-governance-policy-automation.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE253_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase253-aipify-enterprise-governance-policy-automation.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_enterprise_governance_policy_automation.view`, `aipify_enterprise_governance_policy_automation.manage`, `aipify_enterprise_governance_policy_automation.steward`.";
  const entry = `\n**Enterprise Knowledge Validation & Quality Assurance Engine (Phase 254):** See [AIPIFY_ENTERPRISE_KNOWLEDGE_VALIDATION_QUALITY_ASSURANCE_ENGINE_PHASE254.md](./AIPIFY_ENTERPRISE_KNOWLEDGE_VALIDATION_QUALITY_ASSURANCE_ENGINE_PHASE254.md) — Knowledge review workflows, approval processes, ownership assignment, expiration monitoring, review scheduling, quality scoring, feedback collection, usage analytics, version management, executive quality dashboards, audit trails, and certification status. **Era opener** for Knowledge Quality Era (254–258). \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** bypassing knowledge RBAC, exposing sensitive knowledge records without authorization, or modifying immutable version history. Cross-links only: Knowledge Center, Learning Center, Document Intelligence Engine Phase 230, Enterprise Analytics Engine Phase 235, Enterprise Search Engine, Enterprise Notification Engine Phase 233, Trust Center, Executive Cockpit Phase 200, Aipify Translate Phase 238. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 254")) {
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
  console.error(`Phase ${P.phase} docs generated; stack requires Phase 253 artifacts: ${err.message}`);
  process.exitCode = 1;
}
