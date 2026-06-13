#!/usr/bin/env node
/** ABOS Phase 230 — Document Intelligence & Enterprise Document Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "document_dashboard",
  "document_generation_center",
  "document_transformation_center",
  "presentation_generator",
  "action_item_extractor",
  "executive_summary_engine",
  "knowledge_center_converter",
  "document_governance_dashboard",
  "document_integration_center",
];

const P = {
  phase: 230,
  migration: "20261391000000_aipify_document_intelligence_enterprise_document_engine_phase230.sql",
  slug: "aipify-document-intelligence-enterprise-document-engine",
  base: "AipifyDocumentIntelligenceEnterpriseDocument",
  camel: "aipifyDocumentIntelligenceEnterpriseDocumentEngine",
  snake: "aipify_document_intelligence_enterprise_document",
  permPrefix: "aipify_document_intelligence_enterprise_document",
  helper: "adiede",
  bp: "adiedebp230",
  decisionType: "aipify_document_intelligence_enterprise_document_engine",
  title: "Document Intelligence & Enterprise Document",
  centerTitle: "Document Center",
  companion: "Document Companion",
  scoreKey: "aipify_document_intelligence_enterprise_document_score",
  modeKey: "document_intelligence_mode",
  levelKey: "document_governance_level",
  thirdEntity: "document_intelligence_notes",
  era: "Creative Intelligence Era (229–233)",
  eraRange: "229–233",
  docSlug: "AIPIFY_DOCUMENT_INTELLIGENCE_ENTERPRISE_DOCUMENT_ENGINE",
  ilmFile: "implementation-blueprint-phase230-aipify-document-intelligence-enterprise-document.txt",
  navLabel: "Documents",
  crossLinkNote:
    "Cross-links only: Knowledge Center, Action Center, Executive Cockpit Phase 200, and Language Center — never bypass document RBAC, skip approval workflows, or replace human document stewardship.",
  companionLimitations: [
    "bypassing_document_rbac",
    "skipping_approval_workflows",
    "replacing_human_document_stewardship",
    "storing_document_content_beyond_retention",
    "modifying_document_audit_trail",
    "executing_actions_without_approval",
    "complexity_before_clarity",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom229(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyStudioCreativeIntelligence", P.base],
    ["aipify-studio-creative-intelligence-engine", P.slug],
    ["aipify_studio_creative_intelligence", P.snake],
    ["aipifyStudioCreativeIntelligence", P.camel.replace(/Engine$/, "")],
    ["aipifyStudioCreativeIntelligenceEngine", P.camel],
    ["asciebp229", P.bp],
    ["_ascie_", `_${P.helper}_`],
    ["aipify_studio_creative_intelligence_score", P.scoreKey],
    ["creative_intelligence_mode", P.modeKey],
    ["creative_maturity_level", P.levelKey],
    ["creative_intelligence_notes", P.thirdEntity],
    ["CreativeIntelligenceNote", thirdPascal],
    ["creative_intelligence_notes_count", `${P.thirdEntity}_count`],
    ["Studio & Creative Phase 229", "__STUDIO_CREATIVE_PHASE_229__"],
    ["Studio Center", P.centerTitle],
    ["Studio Companion", P.companion],
    ["__STUDIO_CREATIVE_PHASE_229__", "Studio & Creative Phase 229"],
    ["Aipify Studio & Creative Intelligence", P.title],
    ["Studio & Creative", P.navLabel],
    ["Phase 229", `Phase ${P.phase}`],
    ["aipify_studio_creative_intelligence.view", `${P.permPrefix}.view`],
    ["aipify_studio_creative_intelligence.manage", `${P.permPrefix}.manage`],
    ["aipify_studio_creative_intelligence.steward", `${P.permPrefix}.steward`],
    ["aipify_studio_creative_intelligence_engine", P.decisionType],
    ["20261390000000_aipify_studio_creative_intelligence_engine_phase229.sql", P.migration],
    ["Repo Phase 229", `Repo Phase ${P.phase}`],
    ["Phase 229 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE229_AIPIFY_STUDIO_CREATIVE_INTELLIGENCE_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase229", `implementation-blueprint-phase${P.phase}`],
    ["creative_dashboard", SCAFFOLDS[0]],
    ["image_generation_center", SCAFFOLDS[1]],
    ["image_editing_center", SCAFFOLDS[2]],
    ["icon_studio", SCAFFOLDS[3]],
    ["presentation_asset_generator", SCAFFOLDS[4]],
    ["background_removal_engine", SCAFFOLDS[5]],
    ["image_enhancement_engine", SCAFFOLDS[6]],
    ["creative_governance_dashboard", SCAFFOLDS[7]],
    ["byol_integration_center", SCAFFOLDS[8]],
    ["studio_companion", "document_companion"],
    ["_seed_creative_intelligence_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["creative intelligence stewardship", "document intelligence stewardship"],
    ["creative-informed decision support", "document-informed decision support"],
    ["creativity-first studio culture", "clarity-first document culture"],
    ["active creative workflows", "active document workflows"],
    ["creative requests requiring attention", "documents requiring attention"],
    ["Image Generation Center", "Document Generation Center"],
    ["Image Editing Center", "Document Transformation Center"],
    ["Icon Studio", "Presentation Generator"],
    ["Presentation Asset Generator", "Action Item Extractor"],
    ["Background Removal Engine", "Executive Summary Engine"],
    ["Creative Governance Dashboard", "Knowledge Center Converter"],
    ["creative usage indicators", "document productivity indicators"],
    ["creative governance prompts", "document governance prompts"],
    ["creative request prompts", "document workflow prompts"],
    ["creative workflow summaries", "document workflow summaries"],
    ["usage limit signals", "approval workflow signals"],
    ["protected creative assets", "protected document assets"],
    ["Creativity before complexity", "Clarity before complexity"],
    ["Stewardship before excess", "Governance before convenience"],
    ["Professionalism before novelty", "Stewardship before speed"],
    ["no_bypassing_usage_limits", "no_bypassing_document_rbac"],
    ["AIPIFY_STUDIO_CREATIVE_INTELLIGENCE_ENGINE", P.docSlug],
    ["studio and creative intelligence", "document intelligence and enterprise document management"],
    ["Creative intelligence audit logs", "Document intelligence audit logs"],
    ["creative access RBAC", "document access RBAC"],
    ["creative intelligence scaffolds", "document intelligence scaffolds"],
    ["encrypted provider credential controls", "configurable retention policy controls"],
    ["Creative intelligence score", "Document intelligence score"],
    ["Creative maturity level", "Document governance level"],
    ["Creative history entries", "Document version history entries"],
    ["Creative intelligence", "Document intelligence"],
    ["creative intelligence", "document intelligence"],
    ["usage governance stewardship", "document approval stewardship"],
    ["encrypted provider credentials exposure", "document content beyond RBAC"],
    ["premium provider requests", "action center executions"],
    ["creative governance reviews", "executive summary reviews"],
    ["Trust Center and Executive Cockpit Phase 200", "Knowledge Center, Action Center, Executive Cockpit Phase 200, and Language Center"],
    ["Trust Center and Executive Cockpit", "Knowledge Center, Action Center, Executive Cockpit, and Language Center"],
    ["Never bypass usage limits or expose encrypted provider credentials", "Never bypass document RBAC or skip approval workflows"],
    ["creative assets", "document assets"],
    ["Creative assets", "Document assets"],
    ["confidential creative approval", "confidential document approval"],
    ["automates premium provider requests without human approval", "executes document actions without human approval"],
    ["Automated premium provider requests without human approval", "Automated document actions without human approval"],
    ["Modifying creative audit trails", "Modifying document audit trails"],
    ["Excess before stewardship", "Complexity before clarity"],
    ["human creative approval stewardship", "human document stewardship"],
    ["Human creative approval stewardship", "Human document stewardship"],
    ["creative decisions and usage accountability", "document decisions and governance accountability"],
    ["creative workflow visibility", "document workflow visibility"],
    ["creative governance", "document governance"],
    ["create, enhance and manage visual assets directly within Aipify while maintaining enterprise-grade governance, cost control and flexibility — empowering employees to solve everyday creative tasks without specialized design tools for every request", "create, summarize, transform and govern documents within Aipify — empowering employees with standard document tools while maintaining enterprise-grade RBAC, retention policies, and approval workflows"],
    ["employees solve everyday creative needs without complexity, included models are prioritized first, and organizations orchestrate providers with wisdom before speed", "document administration decreases, report creation accelerates, knowledge reuse improves, and employees work with clarity before complexity"],
    ["Studio & Creative Phase 230", "Studio & Creative Phase 229"],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports document intelligence — NOT bypassing document RBAC, skipping approval workflows, or replacing human document stewardship. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Enable employees to create, summarize, transform and govern documents within Aipify — ${P.companion} prepares, humans decide.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Creative Intelligence Era (${P.eraRange}). Human-stewarded document governance; RBAC-protected document intelligence scaffolds; configurable retention policies; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations reduce document administration, accelerate report creation, and improve knowledge reuse — employees work with clarity before complexity.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Ten document modules with governance'),
    jsonb_build_object('key', 'document_generation_center', 'label', 'Document generation center', 'emoji', '📄', 'description', 'Generate documents from templates and prompts'),
    jsonb_build_object('key', 'document_transformation_center', 'label', 'Document transformation center', 'emoji', '✏️', 'description', 'Summarize, rewrite, and translate documents'),
    jsonb_build_object('key', 'presentation_generator', 'label', 'Presentation generator', 'emoji', '📊', 'description', 'Generate presentations from text'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not replace human document stewardship'),
    jsonb_build_object('key', 'knowledge_center_converter', 'label', 'Knowledge Center converter', 'emoji', '📚', 'description', 'Convert documents into Knowledge Center articles'),
    jsonb_build_object('key', 'document_governance_dashboard', 'label', 'Document governance dashboard', 'emoji', '🛡️', 'description', 'Templates, version history, approvals, and retention'),
    jsonb_build_object('key', 'supported_formats', 'label', 'Supported file formats', 'emoji', '📁', 'description', 'DOCX, PDF, PPTX, XLSX, TXT, MD')
  ); ${D};
create or replace function public._${bp}_document_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — ten capabilities. Clarity before complexity.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'document_dashboard', 'label', 'Document Dashboard — active workflows and documents requiring attention'),
    jsonb_build_object('key', 'document_generation_center', 'label', 'Document Generation Center — generate documents from templates'),
    jsonb_build_object('key', 'document_transformation_center', 'label', 'Document Transformation Center — summarize, rewrite, translate'),
    jsonb_build_object('key', 'presentation_generator', 'label', 'Presentation Generator — generate PPTX from text'),
    jsonb_build_object('key', 'action_item_extractor', 'label', 'Action Item Extractor — extract action items from documents'),
    jsonb_build_object('key', 'executive_summary_engine', 'label', 'Executive Summary Engine — generate executive summaries'),
    jsonb_build_object('key', 'knowledge_center_converter', 'label', 'Knowledge Center Converter — convert documents to KC articles'),
    jsonb_build_object('key', 'document_templates', 'label', 'Document Templates — organizational template library'),
    jsonb_build_object('key', 'version_history_approvals', 'label', 'Version History & Approval Workflows — document lifecycle governance'),
    jsonb_build_object('key', 'document_governance_dashboard', 'label', 'Document Governance Dashboard — retention policies and audit visibility')
  )); ${D};
create or replace function public._${bp}_document_generation_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Document generation center — templates and RBAC first.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'template_fit', 'label', 'Does an approved template best serve this document request?'),
    jsonb_build_object('key', 'rbac_access', 'label', 'Does document access follow role-based permissions?'),
    jsonb_build_object('key', 'output_format', 'label', 'Which format — DOCX, PDF, PPTX, XLSX, TXT, or MD — is appropriate?'),
    jsonb_build_object('key', 'approval_required', 'label', 'Does this generation require approval before distribution?'),
    jsonb_build_object('key', 'retention_policy', 'label', 'How does retention policy apply to this document?')
  )); ${D};
create or replace function public._${bp}_document_transformation_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Document transformation center — governance before convenience with human approval.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'summarize', 'label', 'Summarize documents'),
    jsonb_build_object('key', 'rewrite', 'label', 'Rewrite documents'),
    jsonb_build_object('key', 'translate', 'label', 'Translate documents'),
    jsonb_build_object('key', 'supported_formats', 'label', 'DOCX, PDF, PPTX, XLSX, TXT, MD support'),
    jsonb_build_object('key', 'document_rbac', 'label', 'Document access — RBAC enforced'),
    jsonb_build_object('key', 'retention_policies', 'label', 'Configurable retention policies'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for sensitive transformations')
  )); ${D};
create or replace function public._${bp}_executive_summary_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive summary engine — stewardship before speed.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'executive_summaries', 'label', 'Generate executive summaries'),
    jsonb_build_object('key', 'reporting_capabilities', 'label', 'Executive reporting capabilities — RBAC protected'),
    jsonb_build_object('key', 'cockpit_integration', 'label', 'Executive Cockpit Phase 200 cross-link'),
    jsonb_build_object('key', 'retention', 'label', 'Organization-controlled retention policies'),
    jsonb_build_object('key', 'stewardship', 'label', 'Stewardship before speed prompts')
  )); ${D};
create or replace function public._${bp}_document_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports document workflows and never bypasses document RBAC or skips approval workflows.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'document_workflow_summaries', 'label', 'Document workflow summaries'),
    jsonb_build_object('key', 'generation_guidance', 'label', 'Document generation guidance — templates and formats'),
    jsonb_build_object('key', 'transformation_guidance', 'label', 'Summarize, rewrite, and translate guidance'),
    jsonb_build_object('key', 'document_workflow_prompts', 'label', 'Document workflow prompts'),
    jsonb_build_object('key', 'action_item_highlights', 'label', 'Action item extraction highlights'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Document access RBAC and retention — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_presentation_generator() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Presentation generator — generate PPTX from text.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'pptx_generation', 'label', 'Generate presentations from text'),
    jsonb_build_object('key', 'template_support', 'label', 'Presentation template support'),
    jsonb_build_object('key', 'department_capabilities', 'label', 'Manager and department permission tiers'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only audit — no raw document content in logs'),
    jsonb_build_object('key', 'approval_workflows', 'label', 'Approval workflows before distribution'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for executive presentations')
  )); ${D};
create or replace function public._${bp}_action_item_extractor() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Action item extractor — prepare for Action Center integration.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'action_extraction', 'label', 'Extract action items from documents'),
    jsonb_build_object('key', 'action_center_link', 'label', 'Action Center cross-link — approval required'),
    jsonb_build_object('key', 'human_review', 'label', 'Human review before action execution'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Action items extracted — audit event logging'),
    jsonb_build_object('key', 'document_rbac', 'label', 'Source document RBAC enforced'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for action creation')
  )); ${D};
create or replace function public._${bp}_knowledge_center_converter() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Knowledge Center converter — improve knowledge reuse.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'kc_conversion', 'label', 'Convert documents into Knowledge Center articles'),
    jsonb_build_object('key', 'knowledge_center_link', 'label', 'Knowledge Center cross-link'),
    jsonb_build_object('key', 'approval_required', 'label', 'Approval before publishing to Knowledge Center'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only conversion tracking'),
    jsonb_build_object('key', 'retention_alignment', 'label', 'Retention policies aligned with KC governance'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for KC publication')
  )); ${D};
create or replace function public._${bp}_document_governance_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Document governance — stewardship through responsibility.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'document_templates', 'label', 'Document template library'),
    jsonb_build_object('key', 'version_history', 'label', 'Version history tracking'),
    jsonb_build_object('key', 'approval_workflows', 'label', 'Approval workflow configuration'),
    jsonb_build_object('key', 'retention_policies', 'label', 'Configurable retention policies'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Executive, Manager, Employee tiers'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Document audit visibility respects role permissions')
  )); ${D};
create or replace function public._${bp}_document_integration_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Document integration center — cross-links only; Aipify orchestrates.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'cross_link', '/app/knowledge-center'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center', 'cross_link', '/app/action-center'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'language_center', 'label', 'Language Center', 'cross_link', '/platform/language-center'),
    jsonb_build_object('key', 'cross_link_only', 'label', 'Cross-links only — never duplicate integration RPCs'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Integration events logged in document audit trail'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for cross-surface actions')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing document RBAC',
      'Skipping approval workflows',
      'Replacing human document stewardship',
      'Storing document content beyond retention policy',
      'Modifying document audit trails',
      'Executing actions without approval',
      'Complexity before clarity',
      'Override human judgment'), 'principle', '${P.companion} supports — humans steward document decisions and governance accountability.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm document support without administrative pressure.', 'values', jsonb_build_array('clarity_before_complexity','governance_before_convenience','stewardship_before_speed','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Document intelligence audit logs via aipify_document_intelligence_enterprise_document_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_document_intelligence_enterprise_document permissions — document access RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'RBAC-protected document intelligence scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'retention_policies', 'label', 'Configurable retention policies — organization controlled'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 229, 'key', 'studio_creative_intelligence', 'label', 'Studio & Creative Phase 229', 'route', '/app/aipify-studio-creative-intelligence-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 230, 'key', 'document_intelligence_enterprise_document', 'label', 'Documents Phase 230', 'route', '/app/${P.slug}', 'description', 'Human-stewarded document intelligence and enterprise document management')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'route', '/app/knowledge-center', 'relationship', 'Knowledge Center integration — cross-link only'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center', 'route', '/app/action-center', 'relationship', 'Action Center integration — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive Cockpit integration — cross-link only'),
    jsonb_build_object('key', 'language_center', 'label', 'Language Center', 'route', '/platform/language-center', 'relationship', 'Language Center integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Clarity before complexity — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with RBAC-protected document intelligence scaffolds and human approval gates. Growth Partner terminology. ${P.companion} supports — never bypasses document RBAC or skips approval workflows.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans steward document decisions and governance accountability.', '${P.companion} informs and supports.', 'Clarity before complexity — governance before convenience.', 'Growth Partner — never Affiliate.', 'Creative Intelligence Era — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — document workflow signals max ~500 chars. No raw document content beyond RBAC, retention policy, or PII in audit logs.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_studio_creative_intelligence_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._asciebp229_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_document_generation_center\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Document generation center — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_document_generation_center()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_vendor_registry\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Document generation center — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_document_generation_center()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_document_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Document Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_document_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_creative_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Document Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_document_dashboard()->'capabilities') = 10,`,
  );

  for (const fn of [
    "document_dashboard",
    "document_generation_center",
    "document_transformation_center",
    "executive_summary_engine",
    "document_companion",
    "presentation_generator",
    "action_item_extractor",
    "knowledge_center_converter",
    "document_governance_dashboard",
    "document_integration_center",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${P.bp}_${fn}()`);
  }

  sql = sql.replace(
    /select 'aipify-studio-creative-intelligence-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );
  sql = sql.replace(
    /select 'aipify-vendor-third-party-relationship-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );
  sql = sql.replace(
    /select 'aipify-business-continuity-crisis-management-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected studio and creative intelligence guidance within Creative Intelligence Era; cross-link only for Trust Center and Executive Cockpit Phase 200.",
    "RBAC-protected document intelligence and enterprise document guidance within Creative Intelligence Era; cross-link only for Knowledge Center, Action Center, Executive Cockpit Phase 200, and Language Center.",
  );

  return sql;
}

function genMigration() {
  const src229 = path.join(ROOT, "supabase/migrations/20261390000000_aipify_studio_creative_intelligence_engine_phase229.sql");
  if (!fs.existsSync(src229)) throw new Error("Phase 229 migration required");
  let m = transformFrom229(fs.readFileSync(src229, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-studio-creative-intelligence-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(path.join(ROOT, `lib/core/${P.slug}.ts`), transformFrom229(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")));
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom229(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")));
  }
  const panel = path.join(ROOT, `components/app/${srcSlug}/AipifyStudioCreativeIntelligenceEngineDashboardPanel.tsx`);
  write(path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`), transformFrom229(fs.readFileSync(panel, "utf8")));
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`);
  write(path.join(ROOT, `app/app/${P.slug}/page.tsx`), transformFrom229(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")));
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom229(fs.readFileSync(path.join(ROOT, `app/api/aipify/${srcSlug}/${route}/route.ts`), "utf8")),
    );
  }
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports document intelligence — does NOT bypass document RBAC, skip approval workflows, or replace human document stewardship.

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

## What is the Document Intelligence Engine?

The Document Intelligence & Enterprise Document Engine enables employees to create, summarize, transform, and govern documents within Aipify at \`/app/${P.slug}\`.

## What document formats are supported?

**DOCX, PDF, PPTX, XLSX, TXT, and MD** — subject to role-based permissions and retention policies.

## What can employees do with documents?

Generate documents, summarize, rewrite, translate, generate presentations from text, extract action items, generate executive summaries, and convert documents into Knowledge Center articles.

## Are document templates and version history supported?

**Yes.** Organizations can maintain document templates, track version history, and configure approval workflows.

## Who can access document tools?

Super Admin (full access), Tenant Admin (organization settings), Executives (reporting), Managers (department), and Employees (standard tools) — all governed by RBAC.

## Can administrators configure retention policies?

**Yes.** Retention policies are configurable and document access follows enterprise RBAC standards.

## How does this integrate with other Aipify surfaces?

Cross-link only: Knowledge Center, Action Center, Executive Cockpit Phase 200, and Language Center — never duplicate their RPCs.

## Does the Document Companion replace human review?

**No.** ${P.companion} prepares document workflows — it does **NOT** bypass document RBAC, skip approval workflows, or replace human document stewardship.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Document Center: document dashboard, document generation center, document transformation center, presentation generator, action item extractor, executive summary engine, knowledge center converter, document governance dashboard, document integration center.
Supported formats: DOCX, PDF, PPTX, XLSX, TXT, MD.
Features: generate, summarize, rewrite, translate, presentations from text, action items, executive summaries, KC article conversion, templates, version history, approval workflows.
Design principles: Clarity before complexity, governance before convenience, stewardship before speed.
Companion limitations: no bypassing document RBAC, no skipping approval workflows, no replacing human document stewardship.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never bypasses document RBAC, skips approval workflows, or replaces human document stewardship.";
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
    c = c.replace('| "aipifyStudioCreativeIntelligenceEngine"', `| "aipifyStudioCreativeIntelligenceEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    const anchor = /id: "aipifyStudioCreativeIntelligenceEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyStudioCreativeIntelligenceEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-studio-creative-intelligence-engine")) {\n    return "aipifyStudioCreativeIntelligenceEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-studio-creative-intelligence-engine")) {\n    return "aipifyStudioCreativeIntelligenceEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_studio_creative_intelligence.steward",', `"aipify_studio_creative_intelligence.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-studio-creative-intelligence-engine";',
      `export * from "./aipify-studio-creative-intelligence-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports document generation, transformation, and governance. Supports employees — does NOT bypass document RBAC or skip approval workflows. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Document intelligence score",
    modeLabel: "Mode",
    readinessLabel: "Document governance level",
    executiveReviews: "Executive summary reviews",
    activeReflections: "Active document intelligence scaffolds",
    humanOversightRequired: `Human oversight required — humans steward document decisions; ${P.companion} supports only`,
    eraOpenerSummary: `Creative Intelligence Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate Knowledge Center, Action Center, Executive Cockpit, or Language Center RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Document generation center — governance prompts",
    frameworkLabel: "Document transformation center",
    reviewsLabel: "Document governance dashboard",
    companionLabel: `${P.companion} — supports workflows, never replaces human document stewardship`,
    subEngineLabel: "Presentation generator",
    reflections: "Document intelligence scaffolds",
    executiveReviewEntries: "Document version history entries",
    scaffoldNotes: "RBAC-protected document intelligence scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT bypass document RBAC, skip approval workflows, or replace human document stewardship`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports document workflow visibility — humans retain document stewardship authority.`,
      philosophy: "People First. RBAC-protected document intelligence scaffolds. Growth Partner terminology — never Affiliate.",
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
        ? "Dokumenter"
        : locale === "sv"
          ? "Dokument"
          : locale === "da"
            ? "Dokumenter"
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
      'export * from "./implementation-blueprint-phase229-vocabulary";',
      `export * from "./implementation-blueprint-phase229-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
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
    "Permissions `aipify_studio_creative_intelligence.view`, `aipify_studio_creative_intelligence.manage`, `aipify_studio_creative_intelligence.steward`.";
  const entry = `\n**Document Intelligence & Enterprise Document Engine (Phase 230):** See [AIPIFY_DOCUMENT_INTELLIGENCE_ENTERPRISE_DOCUMENT_ENGINE_PHASE230.md](./AIPIFY_DOCUMENT_INTELLIGENCE_ENTERPRISE_DOCUMENT_ENGINE_PHASE230.md) — Document Center for generation, transformation, presentations, action items, executive summaries, Knowledge Center conversion, templates, version history, approval workflows, and integration center. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** bypassing document RBAC, skipping approval workflows, or replacing human document stewardship. Cross-links only: Knowledge Center, Action Center, Executive Cockpit Phase 200, Language Center. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 230")) {
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
