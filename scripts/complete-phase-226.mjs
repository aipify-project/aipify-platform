#!/usr/bin/env node
/** ABOS Phase 226 — Aipify Enterprise Risk & Resilience Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "enterprise_risk_dashboard",
  "risk_register",
  "risk_assessment_engine",
  "mitigation_action_center",
  "business_continuity_framework",
  "executive_risk_briefings",
  "resilience_insights_dashboard",
  "trust_cockpit_operations_integration",
  "risk_knowledge_libraries",
];

const P = {
  phase: 226,
  migration: "20261387000000_aipify_enterprise_risk_resilience_engine_phase226.sql",
  slug: "aipify-enterprise-risk-resilience-engine",
  base: "AipifyEnterpriseRiskResilience",
  camel: "aipifyEnterpriseRiskResilienceEngine",
  snake: "aipify_enterprise_risk_resilience",
  permPrefix: "aipify_enterprise_risk_resilience",
  helper: "aerre",
  bp: "aerrebp226",
  decisionType: "aipify_enterprise_risk_resilience_engine",
  title: "Aipify Enterprise Risk & Resilience",
  centerTitle: "Risk Center",
  companion: "Risk Companion",
  scoreKey: "aipify_enterprise_risk_resilience_score",
  modeKey: "risk_resilience_mode",
  levelKey: "resilience_maturity_level",
  thirdEntity: "risk_resilience_notes",
  era: "Enterprise Resilience Era (226–230)",
  eraRange: "226–230",
  docSlug: "AIPIFY_ENTERPRISE_RISK_RESILIENCE_ENGINE",
  ilmFile: "implementation-blueprint-phase226-aipify-enterprise-risk-resilience.txt",
  navLabel: "Risk & Resilience",
  crossLinkNote:
    "Cross-links only: Trust Center, Executive Cockpit Phase 200, and Operations Center — never expose confidential executive risk briefings beyond RBAC or replace human risk stewardship.",
  companionLimitations: [
    "exposing_confidential_risk_briefings_beyond_rbac",
    "bypassing_business_continuity_security_controls",
    "replacing_human_risk_stewardship",
    "automated_mitigation_without_human_approval",
    "modifying_risk_audit_trail",
    "panic_before_preparedness",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom225(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyEnterprisePolicyComplianceManagement", P.base],
    ["aipify-enterprise-policy-compliance-management-engine", P.slug],
    ["aipify_enterprise_policy_compliance_management", P.snake],
    ["aipifyEnterprisePolicyComplianceManagement", P.camel.replace(/Engine$/, "")],
    ["aipifyEnterprisePolicyComplianceManagementEngine", P.camel],
    ["aepcmebp225", P.bp],
    ["_aepcme_", `_${P.helper}_`],
    ["aipify_enterprise_policy_compliance_management_score", P.scoreKey],
    ["policy_compliance_mode", P.modeKey],
    ["compliance_maturity_level", P.levelKey],
    ["policy_compliance_notes", P.thirdEntity],
    ["PolicyComplianceNote", thirdPascal],
    ["policy_compliance_notes_count", `${P.thirdEntity}_count`],
    ["Policy Center", P.centerTitle],
    ["Policy Companion", P.companion],
    ["Aipify Enterprise Policy & Compliance Management", P.title],
    ["Policy & Compliance", P.navLabel],
    ["Phase 225", `Phase ${P.phase}`],
    ["aipify_enterprise_policy_compliance_management.view", `${P.permPrefix}.view`],
    ["aipify_enterprise_policy_compliance_management.manage", `${P.permPrefix}.manage`],
    ["aipify_enterprise_policy_compliance_management.steward", `${P.permPrefix}.steward`],
    ["aipify_enterprise_policy_compliance_management_engine", P.decisionType],
    ["20261386000000_aipify_enterprise_policy_compliance_management_engine_phase225.sql", P.migration],
    ["Repo Phase 225", `Repo Phase ${P.phase}`],
    ["Phase 225 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE225_AIPIFY_ENTERPRISE_POLICY_COMPLIANCE_MANAGEMENT_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase225", `implementation-blueprint-phase${P.phase}`],
    ["policy_dashboard", SCAFFOLDS[0]],
    ["policy_library", SCAFFOLDS[1]],
    ["acknowledgement_center", SCAFFOLDS[2]],
    ["compliance_calendar", SCAFFOLDS[3]],
    ["executive_compliance_dashboard", SCAFFOLDS[6]],
    ["policy_lifecycle_manager", SCAFFOLDS[5]],
    ["trust_communication_integration", SCAFFOLDS[7]],
    ["policy_knowledge_libraries", SCAFFOLDS[8]],
    ["policy_companion", "risk_companion"],
    ["_seed_policy_compliance_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["policy compliance stewardship", "enterprise risk stewardship"],
    ["compliance decision support", "risk-informed decision support"],
    ["accountability-first policy culture", "preparedness-first resilience culture"],
    ["active organizational policies", "active organizational risks"],
    ["policies requiring acknowledgement", "critical risk areas"],
    ["Policy Library", "Risk Register"],
    ["Acknowledgement Center", "Risk Assessment Engine"],
    ["Compliance Calendar", "Mitigation Action Center"],
    ["Executive Compliance Dashboard", "Resilience Insights Dashboard"],
    ["Policy Lifecycle Manager", "Executive Risk Briefings"],
    ["compliance risk indicators", "operational risk indicators"],
    ["executive compliance briefing prompts", "executive risk briefing prompts"],
    ["policy review summary prompts", "risk summary prompts"],
    ["policy compliance summaries", "enterprise risk summaries"],
    ["overdue acknowledgement signals", "emerging risk signals"],
    ["protected compliance records", "confidential risk records"],
    ["Clarity before bureaucracy", "Preparedness before panic"],
    ["Accountability before assumptions", "Resilience before reaction"],
    ["Stewardship before obligation", "Stewardship before short-term thinking"],
    ["no_compliance_records_beyond_rbac", "no_confidential_risk_briefings_beyond_rbac"],
    ["AIPIFY_ENTERPRISE_POLICY_COMPLIANCE_MANAGEMENT_ENGINE", P.docSlug],
    ["Compliance Stewardship Era", "Enterprise Resilience Era"],
    ["Compliance Stewardship Era (225–230)", P.era],
    ["enterprise policy and compliance management", "enterprise risk and resilience"],
    ["Policy compliance audit logs", "Enterprise risk audit logs"],
    ["policy compliance RBAC", "enterprise risk RBAC"],
    ["policy compliance scaffolds", "enterprise risk scaffolds"],
    ["compliance record controls", "business continuity security controls"],
    ["Policy compliance score", "Enterprise risk score"],
    ["Compliance maturity level", "Resilience maturity level"],
    ["Policy compliance scaffolds", "Enterprise risk scaffolds"],
    ["Policy acknowledgement entries", "Risk mitigation entries"],
    ["Policy compliance", "Enterprise risk"],
    ["policy compliance", "enterprise risk"],
    ["policy lifecycle stewardship", "mitigation action stewardship"],
    ["compliance records beyond RBAC", "confidential risk briefings beyond RBAC"],
    ["policy administration actions", "mitigation actions"],
    ["executive compliance briefings", "executive risk briefings"],
    ["Communication Center Phase 217", "Operations Center"],
    ["/app/aipify-organizational-communication-announcements-engine", "/app/operations-center-foundation-engine"],
    ["communication_center", "operations_center"],
    ["Communication center integration", "Operations center integration"],
    ["Trust Center and Communication Center", "Trust Center, Executive Cockpit, and Operations Center"],
    ["Trust Center and Communication Center Phase 217", "Trust Center, Executive Cockpit Phase 200, and Operations Center"],
    ["/platform/trust", "/platform/trust"],
    ["Trust Center", "Trust Center"],
    ["trust_center", "trust_center"],
    ["Executive Cockpit Phase 200", "Executive Cockpit Phase 200"],
    ["/app/aipify-executive-operating-system-founders-cockpit-engine", "/app/aipify-executive-operating-system-founders-cockpit-engine"],
    ["executive_cockpit", "executive_cockpit"],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports enterprise risk and resilience — NOT exposing confidential executive risk briefings beyond RBAC, bypassing business continuity security controls, or replacing human risk stewardship. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Enable organizations to identify, assess and manage operational, strategic and organizational risks while strengthening resilience across the enterprise — ${P.companion} prepares, humans decide.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Enterprise Resilience Era (${P.eraRange}). Human-stewarded risk governance; RBAC-protected enterprise risk scaffolds; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where risk visibility strengthens, resilience improves, and leadership prepares proactively before disruptions escalate.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Nine capability scaffolds'),
    jsonb_build_object('key', 'risk_register', 'label', 'Risk register', 'emoji', '📋', 'description', 'Structured risk records with ownership and status'),
    jsonb_build_object('key', 'risk_assessment_engine', 'label', 'Risk assessment engine', 'emoji', '🧭', 'description', 'Likelihood and impact evaluations'),
    jsonb_build_object('key', 'mitigation_action_center', 'label', 'Mitigation action center', 'emoji', '🎯', 'description', 'Planned mitigation tracking and accountability'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not replace human risk stewardship or automate mitigation'),
    jsonb_build_object('key', 'business_continuity_framework', 'label', 'Business continuity framework', 'emoji', '🛡️', 'description', 'Continuity planning and critical dependencies'),
    jsonb_build_object('key', 'executive_risk_briefings', 'label', 'Executive risk briefings', 'emoji', '📈', 'description', 'Concise leadership summaries and emerging threats'),
    jsonb_build_object('key', 'resilience_insights_dashboard', 'label', 'Resilience insights dashboard', 'emoji', '📊', 'description', 'Organizational resilience indicators and capability improvements')
  ); ${D};
create or replace function public._${bp}_enterprise_risk_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — nine capabilities. Preparedness before panic.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'enterprise_risk_dashboard', 'label', 'Enterprise Risk Dashboard — active risks and critical risk areas'),
    jsonb_build_object('key', 'risk_register', 'label', 'Risk Register — structured records, categorization, ownership, and status'),
    jsonb_build_object('key', 'risk_assessment_engine', 'label', 'Risk Assessment Engine — likelihood and impact evaluations'),
    jsonb_build_object('key', 'mitigation_action_center', 'label', 'Mitigation Action Center — planned activities, ownership, and progress'),
    jsonb_build_object('key', 'business_continuity_framework', 'label', 'Business Continuity Framework — continuity planning and resilience exercises'),
    jsonb_build_object('key', 'executive_risk_briefings', 'label', 'Executive Risk Briefings — concise leadership summaries'),
    jsonb_build_object('key', 'resilience_insights_dashboard', 'label', 'Resilience Insights Dashboard — resilience indicators and capability improvements'),
    jsonb_build_object('key', 'trust_cockpit_operations_integration', 'label', 'Trust Center, Executive Cockpit, and Operations Center integration — cross-links only'),
    jsonb_build_object('key', 'risk_knowledge_libraries', 'label', 'Risk knowledge libraries — approved resources')
  )); ${D};
create or replace function public._${bp}_risk_register() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Risk register — resilience before reaction.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'active_risks', 'label', 'Which active organizational risks require executive visibility?'),
    jsonb_build_object('key', 'categorization', 'label', 'How does risk categorization improve governance maturity?'),
    jsonb_build_object('key', 'ownership', 'label', 'Who owns each identified risk in the register?'),
    jsonb_build_object('key', 'rbac_controls', 'label', 'How are risk records kept RBAC-protected?'),
    jsonb_build_object('key', 'emerging_risks', 'label', 'Which emerging risks should leadership review this cycle?')
  )); ${D};
create or replace function public._${bp}_risk_assessment_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Risk assessment engine — preparedness before panic with human stewardship.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'likelihood_impact', 'label', 'Likelihood and impact evaluations'),
    jsonb_build_object('key', 'consistent_practices', 'label', 'Consistent assessment practices'),
    jsonb_build_object('key', 'decision_support', 'label', 'Decision-making support'),
    jsonb_build_object('key', 'preparedness', 'label', 'Preparedness strengthening'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'RBAC-protected executive risk briefing metadata'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); ${D};
create or replace function public._${bp}_executive_risk_briefings() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive risk briefings — stewardship before short-term thinking.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'leadership_summaries', 'label', 'Concise leadership summaries'),
    jsonb_build_object('key', 'emerging_threats', 'label', 'Emerging threat highlights'),
    jsonb_build_object('key', 'informed_decisions', 'label', 'Informed decision-making support'),
    jsonb_build_object('key', 'confidentiality', 'label', 'Confidential executive briefing controls'),
    jsonb_build_object('key', 'proactive_stewardship', 'label', 'Proactive stewardship prompts')
  )); ${D};
create or replace function public._${bp}_risk_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports risk visibility and never exposes confidential executive briefings beyond RBAC or automates mitigation without human approval.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'enterprise_risk_summaries', 'label', 'Enterprise risk summaries'),
    jsonb_build_object('key', 'assessment_insights', 'label', 'Risk assessment insights'),
    jsonb_build_object('key', 'mitigation_recommendations', 'label', 'Mitigation recommendations'),
    jsonb_build_object('key', 'risk_summary_prompts', 'label', 'Risk summary prompts'),
    jsonb_build_object('key', 'resilience_highlights', 'label', 'Resilience highlights'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'RBAC-protected enterprise risk — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_mitigation_action_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Mitigation action center — resilience before reaction.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'planned_mitigation', 'label', 'Planned mitigation activities'),
    jsonb_build_object('key', 'ownership_assignment', 'label', 'Ownership assignment scaffolds'),
    jsonb_build_object('key', 'completion_tracking', 'label', 'Completion progress monitoring'),
    jsonb_build_object('key', 'accountability', 'label', 'Accountability encouragement'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no raw operational PII'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for mitigation actions')
  )); ${D};
create or replace function public._${bp}_business_continuity_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Business continuity framework — preparedness before panic.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'continuity_planning', 'label', 'Continuity planning initiatives'),
    jsonb_build_object('key', 'critical_dependencies', 'label', 'Critical operational dependency identification'),
    jsonb_build_object('key', 'resilience_exercises', 'label', 'Resilience exercise encouragement'),
    jsonb_build_object('key', 'organizational_readiness', 'label', 'Organizational readiness improvement'),
    jsonb_build_object('key', 'enhanced_security', 'label', 'Enhanced security protections for continuity plans'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for continuity actions')
  )); ${D};
create or replace function public._${bp}_resilience_insights_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Resilience insights dashboard — stewardship before short-term thinking.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'resilience_indicators', 'label', 'Organizational resilience indicators'),
    jsonb_build_object('key', 'capability_improvements', 'label', 'Capability improvement highlights'),
    jsonb_build_object('key', 'continuous_strengthening', 'label', 'Continuous strengthening encouragement'),
    jsonb_build_object('key', 'long_term_sustainability', 'label', 'Long-term sustainability support'),
    jsonb_build_object('key', 'no_auto_mitigation', 'label', 'Never automate mitigation without human approval'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'Executive briefing confidentiality — RBAC enforced')
  )); ${D};
create or replace function public._${bp}_trust_cockpit_operations_integration() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Trust Center, Executive Cockpit, and Operations Center integration — cross-links only.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'trust_center', 'label', 'Trust Center cross-link', 'cross_link', '/platform/trust'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200 cross-link', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'operations_center', 'label', 'Operations Center cross-link', 'cross_link', '/app/operations-center-foundation-engine'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive risk visibility — RBAC protected'),
    jsonb_build_object('key', 'no_briefing_exposure', 'label', 'Never expose confidential executive risk briefings beyond RBAC')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Exposing confidential executive risk briefings beyond RBAC',
      'Bypassing business continuity security controls',
      'Replacing human risk stewardship',
      'Automated mitigation without human approval',
      'Modifying risk audit trails',
      'Panic before preparedness',
      'Override human judgment'), 'principle', '${P.companion} supports — humans steward risk decisions and resilience accountability.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm risk stewardship without panic pressure or fear-based motivation.', 'values', jsonb_build_array('preparedness_before_panic','resilience_before_reaction','stewardship_before_short_term_thinking','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Enterprise risk audit logs via aipify_enterprise_risk_resilience_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_risk_resilience permissions — enterprise risk RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'RBAC-protected enterprise risk scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'confidential_briefings', 'label', 'Confidential executive risk briefings — RBAC enforced'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 225, 'key', 'enterprise_policy_compliance_management', 'label', 'Policy & Compliance Phase 225', 'route', '/app/aipify-enterprise-policy-compliance-management-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 226, 'key', 'enterprise_risk_resilience', 'label', 'Risk & Resilience Phase 226', 'route', '/app/${P.slug}', 'description', 'Human-stewarded enterprise risk and resilience')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'trust_center', 'label', 'Trust Center', 'route', '/platform/trust', 'relationship', 'Trust center integration — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive cockpit integration — cross-link only'),
    jsonb_build_object('key', 'operations_center', 'label', 'Operations Center', 'route', '/app/operations-center-foundation-engine', 'relationship', 'Operations center integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Preparedness before panic — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with RBAC-protected enterprise risk scaffolds and human stewardship gates. Growth Partner terminology. ${P.companion} supports — never exposes confidential executive briefings beyond RBAC or automates mitigation without approval.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans steward risk decisions and resilience accountability.', '${P.companion} informs and supports.', 'Preparedness before panic — resilience before reaction.', 'Growth Partner — never Affiliate.', 'Enterprise Resilience Era — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — enterprise risk signals max ~500 chars. No raw operational PII, confidential executive briefing content, or protected continuity plan details beyond RBAC.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_enterprise_policy_compliance_management_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._aepcmebp225_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_risk_register\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Risk register — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_risk_register()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_enterprise_risk_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Risk Center — nine capabilities', 'met', jsonb_array_length(public._${P.bp}_enterprise_risk_dashboard()->'capabilities') = 9,`,
  );

  for (const fn of [
    "enterprise_risk_dashboard",
    "risk_register",
    "risk_assessment_engine",
    "executive_risk_briefings",
    "risk_companion",
    "mitigation_action_center",
    "business_continuity_framework",
    "resilience_insights_dashboard",
    "trust_cockpit_operations_integration",
    "risk_knowledge_libraries",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${P.bp}_${fn}()`);
  }

  sql = sql.replace(
    /select 'aipify-enterprise-policy-compliance-management-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected enterprise policy and compliance guidance within Compliance Stewardship Era; cross-link only for Trust Center and Communication Center Phase 217.",
    "RBAC-protected enterprise risk and resilience guidance within Enterprise Resilience Era; cross-link only for Trust Center, Executive Cockpit Phase 200, and Operations Center.",
  );

  return sql;
}

function genMigration() {
  const src225 = path.join(ROOT, "supabase/migrations/20261386000000_aipify_enterprise_policy_compliance_management_engine_phase225.sql");
  if (!fs.existsSync(src225)) throw new Error("Phase 225 migration required");
  let m = transformFrom225(fs.readFileSync(src225, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-enterprise-policy-compliance-management-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(path.join(ROOT, `lib/core/${P.slug}.ts`), transformFrom225(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")));
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom225(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")));
  }
  const panel = path.join(ROOT, `components/app/${srcSlug}/AipifyEnterprisePolicyComplianceManagementEngineDashboardPanel.tsx`);
  write(path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`), transformFrom225(fs.readFileSync(panel, "utf8")));
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`);
  write(path.join(ROOT, `app/app/${P.slug}/page.tsx`), transformFrom225(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")));
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom225(fs.readFileSync(path.join(ROOT, `app/api/aipify/${srcSlug}/${route}/route.ts`), "utf8")),
    );
  }
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports enterprise risk and resilience — does NOT expose confidential executive risk briefings beyond RBAC or bypass business continuity security controls.

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

## What is the Enterprise Risk & Resilience Engine?

Enterprise Risk & Resilience provides centralized risk visibility, risk registers, mitigation tracking, and business continuity planning at \`/app/${P.slug}\`.

## Does the Risk Companion replace human risk stewardship?

**No.** ${P.companion} prepares risk visibility and resilience summaries — it does **NOT** expose confidential executive risk briefings beyond RBAC, bypass business continuity security controls, or automate mitigation without human approval.

## What does the Risk Center include?

Enterprise risk dashboard, risk register, risk assessment engine, mitigation action center, business continuity framework, executive risk briefings, resilience insights dashboard, and Trust Center/Executive Cockpit/Operations Center integration — RBAC-protected metadata only.

## How does this relate to Trust Center, Executive Cockpit, and Operations Center?

Cross-link only: Trust Center (\`/platform/trust\`), Executive Cockpit Phase 200 (\`/app/aipify-executive-operating-system-founders-cockpit-engine\`), and Operations Center (\`/app/operations-center-foundation-engine\`). Never duplicate their RPCs.

## Why are RBAC and confidential briefing controls required?

Humans retain risk stewardship authority. Aipify tracks risk and mitigation metadata — it does not expose confidential executive risk briefings beyond role-based access or bypass business continuity security controls.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Risk Center: enterprise risk dashboard, risk register, risk assessment engine, mitigation action center, business continuity framework, executive risk briefings, resilience insights dashboard, trust/cockpit/operations integration (cross-links), risk knowledge libraries.
Risk Register: categorization, ownership, status tracking, and organizational risk transparency.
Risk Assessment Engine: likelihood and impact evaluations with consistent assessment practices.
Mitigation Action Center: planned mitigation activities, ownership assignment, and completion progress.
Business Continuity Framework: continuity planning, critical dependencies, and resilience exercises.
Executive Risk Briefings: concise leadership summaries and emerging threat highlights.
Resilience Insights Dashboard: organizational resilience indicators and capability improvements.
Design principles: Preparedness before panic, resilience before reaction, stewardship before short-term thinking.
Companion limitations: no confidential executive risk briefings beyond RBAC, no bypassing business continuity security controls.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never exposes confidential executive risk briefings beyond RBAC or bypasses business continuity security controls.";
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
    c = c.replace('| "aipifyEnterprisePolicyComplianceManagementEngine"', `| "aipifyEnterprisePolicyComplianceManagementEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    const anchor = /id: "aipifyEnterprisePolicyComplianceManagementEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyEnterprisePolicyComplianceManagementEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-enterprise-policy-compliance-management-engine")) {\n    return "aipifyEnterprisePolicyComplianceManagementEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-enterprise-policy-compliance-management-engine")) {\n    return "aipifyEnterprisePolicyComplianceManagementEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_enterprise_policy_compliance_management.steward",', `"aipify_enterprise_policy_compliance_management.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-enterprise-policy-compliance-management-engine";',
      `export * from "./aipify-enterprise-policy-compliance-management-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports enterprise risk visibility, mitigation tracking, and business continuity planning. Supports administrators — does NOT expose confidential executive risk briefings beyond RBAC. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Enterprise risk score",
    modeLabel: "Mode",
    readinessLabel: "Resilience maturity level",
    executiveReviews: "Executive risk briefings",
    activeReflections: "Active enterprise risk scaffolds",
    humanOversightRequired: `Human oversight required — humans steward risk decisions; ${P.companion} supports only`,
    eraOpenerSummary: `Enterprise Resilience Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate Trust Center, Executive Cockpit, or Operations Center RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Risk register — governance prompts",
    frameworkLabel: "Risk assessment engine",
    reviewsLabel: "Executive risk briefings",
    companionLabel: `${P.companion} — supports preparedness, never replaces human risk stewardship`,
    subEngineLabel: "Mitigation action center",
    reflections: "Enterprise risk scaffolds",
    executiveReviewEntries: "Risk mitigation entries",
    scaffoldNotes: "RBAC-protected enterprise risk scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT expose confidential executive risk briefings beyond RBAC or bypass business continuity security controls`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports enterprise risk visibility — humans retain risk stewardship authority.`,
      philosophy: "People First. RBAC-protected enterprise risk scaffolds. Growth Partner terminology — never Affiliate.",
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
        ? "Risiko og motstandskraft"
        : locale === "sv"
          ? "Risk och motståndskraft"
          : locale === "da"
            ? "Risiko og modstandskraft"
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
      'export * from "./implementation-blueprint-phase225-vocabulary";',
      `export * from "./implementation-blueprint-phase225-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE225_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase225-aipify-enterprise-policy-compliance-management.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE225_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase225-aipify-enterprise-policy-compliance-management.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_enterprise_policy_compliance_management.view`, `aipify_enterprise_policy_compliance_management.manage`, `aipify_enterprise_policy_compliance_management.steward`.";
  const entry = `\n**Aipify Enterprise Risk & Resilience Engine (Phase 226):** See [AIPIFY_ENTERPRISE_RISK_RESILIENCE_ENGINE_PHASE226.md](./AIPIFY_ENTERPRISE_RISK_RESILIENCE_ENGINE_PHASE226.md) — Risk Center for enterprise risk dashboard, risk register, risk assessment engine, mitigation action center, business continuity framework, executive risk briefings, resilience insights dashboard, and Trust Center/Executive Cockpit/Operations Center integration. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** exposing confidential executive risk briefings beyond RBAC or bypassing business continuity security controls. Cross-links only: Trust Center, Executive Cockpit Phase 200, Operations Center. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 226")) {
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
