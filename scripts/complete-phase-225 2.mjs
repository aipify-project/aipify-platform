#!/usr/bin/env node
/** ABOS Phase 225 — Aipify Enterprise Policy & Compliance Management Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "policy_dashboard",
  "policy_library",
  "acknowledgement_center",
  "compliance_calendar",
  "executive_compliance_dashboard",
  "policy_lifecycle_manager",
  "trust_communication_integration",
  "policy_knowledge_libraries",
];

const P = {
  phase: 225,
  migration: "20261386000000_aipify_enterprise_policy_compliance_management_engine_phase225.sql",
  slug: "aipify-enterprise-policy-compliance-management-engine",
  base: "AipifyEnterprisePolicyComplianceManagement",
  camel: "aipifyEnterprisePolicyComplianceManagementEngine",
  snake: "aipify_enterprise_policy_compliance_management",
  permPrefix: "aipify_enterprise_policy_compliance_management",
  helper: "aepcme",
  bp: "aepcmebp225",
  decisionType: "aipify_enterprise_policy_compliance_management_engine",
  title: "Aipify Enterprise Policy & Compliance Management",
  centerTitle: "Policy Center",
  companion: "Policy Companion",
  scoreKey: "aipify_enterprise_policy_compliance_management_score",
  modeKey: "policy_compliance_mode",
  levelKey: "compliance_maturity_level",
  thirdEntity: "policy_compliance_notes",
  era: "Compliance Stewardship Era (225–230)",
  eraRange: "225–230",
  docSlug: "AIPIFY_ENTERPRISE_POLICY_COMPLIANCE_MANAGEMENT_ENGINE",
  ilmFile: "implementation-blueprint-phase225-aipify-enterprise-policy-compliance-management.txt",
  navLabel: "Policy & Compliance",
  crossLinkNote:
    "Cross-links only: Trust Center and Communication Center Phase 217 — never expose compliance records beyond RBAC, modify immutable acknowledgements, or replace human policy stewardship.",
  companionLimitations: [
    "exposing_compliance_records_beyond_rbac",
    "bypassing_immutable_acknowledgement_records",
    "replacing_human_policy_stewardship",
    "automated_policy_publication_without_approval",
    "modifying_acknowledgement_audit_trail",
    "bureaucracy_before_clarity",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom224(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyCustomerFeedbackVoiceOfTheCustomer", P.base],
    ["aipify-customer-feedback-voice-of-the-customer-engine", P.slug],
    ["aipify_customer_feedback_voice_of_the_customer", P.snake],
    ["aipifyCustomerFeedbackVoiceOfTheCustomer", P.camel.replace(/Engine$/, "")],
    ["aipifyCustomerFeedbackVoiceOfTheCustomerEngine", P.camel],
    ["acfvotcebp224", P.bp],
    ["_acfvotce_", `_${P.helper}_`],
    ["aipify_customer_feedback_voice_of_the_customer_score", P.scoreKey],
    ["voice_of_customer_mode", P.modeKey],
    ["feedback_maturity_level", P.levelKey],
    ["voice_of_customer_notes", P.thirdEntity],
    ["VoiceOfCustomerNote", thirdPascal],
    ["voice_of_customer_notes_count", `${P.thirdEntity}_count`],
    ["Voice of the Customer Center", P.centerTitle],
    ["Voice of the Customer Companion", P.companion],
    ["Aipify Customer Feedback & Voice of the Customer", P.title],
    ["Voice of the Customer", P.navLabel],
    ["Phase 224", `Phase ${P.phase}`],
    ["aipify_customer_feedback_voice_of_the_customer.view", `${P.permPrefix}.view`],
    ["aipify_customer_feedback_voice_of_the_customer.manage", `${P.permPrefix}.manage`],
    ["aipify_customer_feedback_voice_of_the_customer.steward", `${P.permPrefix}.steward`],
    ["20261385000000_aipify_customer_feedback_voice_of_the_customer_engine_phase224.sql", P.migration],
    ["Repo Phase 224", `Repo Phase ${P.phase}`],
    ["Phase 224 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE224_AIPIFY_CUSTOMER_FEEDBACK_VOICE_OF_THE_CUSTOMER_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase224", `implementation-blueprint-phase${P.phase}`],
    ["voice_of_the_customer_dashboard", SCAFFOLDS[0]],
    ["feedback_intake_framework", SCAFFOLDS[1]],
    ["sentiment_theme_engine", SCAFFOLDS[2]],
    ["actionable_feedback_center", SCAFFOLDS[3]],
    ["customer_improvement_tracker", SCAFFOLDS[4]],
    ["executive_customer_insights_briefing", SCAFFOLDS[5]],
    ["success_innovation_action_integration", SCAFFOLDS[6]],
    ["voice_of_customer_knowledge_libraries", SCAFFOLDS[7]],
    ["voice_of_customer_companion", "policy_companion"],
    ["_seed_voice_of_customer_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["customer feedback stewardship", "policy compliance stewardship"],
    ["customer-centric decision support", "compliance decision support"],
    ["listening-first customer culture", "accountability-first policy culture"],
    ["overall customer sentiment trends", "active organizational policies"],
    ["important feedback themes", "policies requiring acknowledgement"],
    ["Feedback Intake Framework", "Policy Library"],
    ["Sentiment & Theme Engine", "Acknowledgement Center"],
    ["Actionable Feedback Center", "Compliance Calendar"],
    ["Customer Improvement Tracker", "Executive Compliance Dashboard"],
    ["Executive Customer Insights Briefing", "Policy Lifecycle Manager"],
    ["customer experience risk indicators", "compliance risk indicators"],
    ["customer insight briefing prompts", "executive compliance briefing prompts"],
    ["customer experience summary prompts", "policy review summary prompts"],
    ["voice of customer summaries", "policy compliance summaries"],
    ["recurring theme signals", "overdue acknowledgement signals"],
    ["personal customer information", "protected compliance records"],
    ["Listening before assumptions", "Clarity before bureaucracy"],
    ["Action before complacency", "Accountability before assumptions"],
    ["Relationships before transactions", "Stewardship before obligation"],
    ["no_personal_customer_information_beyond_rbac", "no_compliance_records_beyond_rbac"],
    ["AIPIFY_CUSTOMER_FEEDBACK_VOICE_OF_THE_CUSTOMER_ENGINE", P.docSlug],
    ["Customer Voice Era", "Compliance Stewardship Era"],
    ["Customer Voice Era (224–230)", P.era],
    ["customer feedback and voice of the customer", "enterprise policy and compliance management"],
    ["Customer feedback audit logs", "Policy compliance audit logs"],
    ["customer feedback RBAC", "policy compliance RBAC"],
    ["voice of customer scaffolds", "policy compliance scaffolds"],
    ["customer privacy controls", "compliance record controls"],
    ["Voice of customer score", "Policy compliance score"],
    ["Feedback maturity level", "Compliance maturity level"],
    ["Voice of customer scaffolds", "Policy compliance scaffolds"],
    ["Customer feedback entries", "Policy acknowledgement entries"],
    ["Voice of the customer", "Policy compliance"],
    ["voice of the customer", "policy compliance"],
    ["actionable feedback routing", "policy lifecycle stewardship"],
    ["personal customer information beyond RBAC", "compliance records beyond RBAC"],
    ["customer follow-up actions", "policy administration actions"],
    ["customer feedback stewardship", "policy compliance stewardship"],
    ["customer insights briefings", "executive compliance briefings"],
    ["/app/action-center", "/platform/trust"],
    ["Action Center", "Trust Center"],
    ["action_center", "trust_center"],
    ["Innovation Center Phase 212", "Communication Center Phase 217"],
    ["/app/aipify-innovation-opportunity-discovery-engine", "/app/aipify-organizational-communication-announcements-engine"],
    ["innovation_center", "communication_center"],
    ["Innovation center integration", "Communication center integration"],
    ["Customer Success Center Phase 213", "Trust Center"],
    ["/app/aipify-customer-success-value-realization-engine", "/platform/trust"],
    ["customer_success_center", "trust_center"],
    ["Customer success center integration", "Trust center integration"],
    [
      "Customer Success Center, Innovation Center, and Action Center",
      "Trust Center and Communication Center",
    ],
    [
      "Customer Success Center Phase 213, Innovation Center Phase 212, and Action Center",
      "Trust Center and Communication Center Phase 217",
    ],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports enterprise policy and compliance management — NOT exposing compliance records beyond RBAC, modifying immutable acknowledgements, or replacing human policy stewardship. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Provide organizations with a centralized framework for managing policies, acknowledgements, compliance obligations and governance requirements across the entire enterprise — ${P.companion} prepares, humans decide.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Compliance Stewardship Era (${P.eraRange}). Human-stewarded policy governance; RBAC-protected policy compliance scaffolds; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where policy awareness strengthens, compliance gaps reduce, and executive oversight supports accountable governance at enterprise scale.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'policy_library', 'label', 'Policy library', 'emoji', '📚', 'description', 'Categorization, search, and version history'),
    jsonb_build_object('key', 'acknowledgement_center', 'label', 'Acknowledgement center', 'emoji', '✔️', 'description', 'Mandatory acceptance and overdue tracking'),
    jsonb_build_object('key', 'compliance_calendar', 'label', 'Compliance calendar', 'emoji', '📅', 'description', 'Upcoming reviews and scheduled reassessments'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not replace human policy stewardship or modify acknowledgements'),
    jsonb_build_object('key', 'executive_compliance_dashboard', 'label', 'Executive compliance dashboard', 'emoji', '📈', 'description', 'Leadership compliance insights and attention areas'),
    jsonb_build_object('key', 'policy_lifecycle_manager', 'label', 'Policy lifecycle manager', 'emoji', '🗂️', 'description', 'Drafting, review, approval, and retirement with audit trails'),
    jsonb_build_object('key', 'policy_knowledge_libraries', 'label', 'Policy knowledge libraries', 'emoji', '📖', 'description', 'Approved policy and compliance guidance resources')
  ); ${D};
create or replace function public._${bp}_policy_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities. Clarity before bureaucracy.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'policy_dashboard', 'label', 'Policy Dashboard — active policies and recently updated policies'),
    jsonb_build_object('key', 'policy_library', 'label', 'Policy Library — categorization, search, and version history'),
    jsonb_build_object('key', 'acknowledgement_center', 'label', 'Acknowledgement Center — employee confirmations and mandatory workflows'),
    jsonb_build_object('key', 'compliance_calendar', 'label', 'Compliance Calendar — upcoming reviews and reassessments'),
    jsonb_build_object('key', 'executive_compliance_dashboard', 'label', 'Executive Compliance Dashboard — leadership compliance insights'),
    jsonb_build_object('key', 'policy_lifecycle_manager', 'label', 'Policy Lifecycle Manager — draft, review, approve, retire with audit trails'),
    jsonb_build_object('key', 'trust_communication_integration', 'label', 'Trust Center and Communication Center integration — cross-links only'),
    jsonb_build_object('key', 'policy_knowledge_libraries', 'label', 'Policy knowledge libraries — approved resources')
  )); ${D};
create or replace function public._${bp}_policy_library() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Policy library — accountability before assumptions.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'active_policies', 'label', 'Which active policies require executive visibility this cycle?'),
    jsonb_build_object('key', 'version_history', 'label', 'Where is policy version history preserved transparently?'),
    jsonb_build_object('key', 'categorization', 'label', 'How does categorization improve policy discoverability?'),
    jsonb_build_object('key', 'rbac_controls', 'label', 'How is policy administration kept RBAC-protected?'),
    jsonb_build_object('key', 'mandatory_policies', 'label', 'Which mandatory organizational policies need acknowledgement tracking?')
  )); ${D};
create or replace function public._${bp}_acknowledgement_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Acknowledgement center — stewardship before obligation with human stewardship.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'employee_confirmations', 'label', 'Employee acknowledgement confirmations'),
    jsonb_build_object('key', 'mandatory_workflows', 'label', 'Mandatory acceptance workflows'),
    jsonb_build_object('key', 'overdue_acknowledgements', 'label', 'Overdue acknowledgement highlights'),
    jsonb_build_object('key', 'immutable_records', 'label', 'Immutable acknowledgement records'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates'),
    jsonb_build_object('key', 'compliance_controls', 'label', 'RBAC-protected compliance record metadata'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); ${D};
create or replace function public._${bp}_policy_lifecycle_manager() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Policy lifecycle manager — stewardship before obligation.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'draft_review_approve', 'label', 'Drafting, review, approval, and retirement workflows'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Preserved audit trails'),
    jsonb_build_object('key', 'governance_maturity', 'label', 'Governance maturity improvement'),
    jsonb_build_object('key', 'responsible_ownership', 'label', 'Responsible ownership encouragement'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive compliance visibility')
  )); ${D};
create or replace function public._${bp}_policy_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports policy clarity and never exposes compliance records beyond RBAC or modifies immutable acknowledgements.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'policy_compliance_summaries', 'label', 'Policy compliance summaries'),
    jsonb_build_object('key', 'acknowledgement_insights', 'label', 'Acknowledgement insights'),
    jsonb_build_object('key', 'review_recommendations', 'label', 'Policy review recommendations'),
    jsonb_build_object('key', 'policy_review_summary_prompts', 'label', 'Policy review summary prompts'),
    jsonb_build_object('key', 'compliance_highlights', 'label', 'Compliance highlights'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'RBAC-protected policy compliance — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_compliance_calendar() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Compliance calendar — accountability before assumptions.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'upcoming_reviews', 'label', 'Upcoming policy reviews'),
    jsonb_build_object('key', 'scheduled_reassessments', 'label', 'Scheduled reassessments'),
    jsonb_build_object('key', 'proactive_governance', 'label', 'Proactive governance encouragement'),
    jsonb_build_object('key', 'preparedness', 'label', 'Compliance preparedness improvement'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no raw compliance PII'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for policy changes')
  )); ${D};
create or replace function public._${bp}_executive_compliance_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive compliance dashboard — clarity before bureaucracy.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'compliance_insights', 'label', 'Leadership compliance insights'),
    jsonb_build_object('key', 'attention_areas', 'label', 'Areas requiring attention'),
    jsonb_build_object('key', 'informed_decisions', 'label', 'Informed decision-making support'),
    jsonb_build_object('key', 'stewardship', 'label', 'Stewardship strengthening'),
    jsonb_build_object('key', 'no_auto_publication', 'label', 'Never auto-publish policies without human approval'),
    jsonb_build_object('key', 'compliance_controls', 'label', 'Compliance record controls — RBAC enforced')
  )); ${D};
create or replace function public._${bp}_trust_communication_integration() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Trust Center and Communication Center integration — cross-links only.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'trust_center', 'label', 'Trust Center cross-link', 'cross_link', '/platform/trust'),
    jsonb_build_object('key', 'communication_center', 'label', 'Communication Center Phase 217 cross-link', 'cross_link', '/app/aipify-organizational-communication-announcements-engine'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive compliance visibility — RBAC protected'),
    jsonb_build_object('key', 'no_record_exposure', 'label', 'Never expose compliance records beyond RBAC')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Exposing compliance records beyond RBAC',
      'Modifying immutable acknowledgement records',
      'Replacing human policy stewardship',
      'Automated policy publication without human approval',
      'Bypassing acknowledgement audit trails',
      'Bureaucracy before clarity',
      'Override human judgment'), 'principle', '${P.companion} supports — humans steward policy decisions and compliance accountability.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm policy stewardship without obligation pressure or guilt-based compliance.', 'values', jsonb_build_array('clarity_before_bureaucracy','accountability_before_assumptions','stewardship_before_obligation','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Policy compliance audit logs via aipify_enterprise_policy_compliance_management_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_policy_compliance_management permissions — policy compliance RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'RBAC-protected policy compliance scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'immutable_acknowledgements', 'label', 'Immutable policy acknowledgement records — RBAC enforced'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 224, 'key', 'customer_feedback_voice_of_the_customer', 'label', 'Voice of the Customer Phase 224', 'route', '/app/aipify-customer-feedback-voice-of-the-customer-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 225, 'key', 'enterprise_policy_compliance_management', 'label', 'Policy & Compliance Phase 225', 'route', '/app/${P.slug}', 'description', 'Human-stewarded enterprise policy and compliance management')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'trust_center', 'label', 'Trust Center', 'route', '/platform/trust', 'relationship', 'Trust center integration — cross-link only'),
    jsonb_build_object('key', 'communication_center', 'label', 'Communication Center Phase 217', 'route', '/app/aipify-organizational-communication-announcements-engine', 'relationship', 'Communication center integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Stewardship before obligation — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with RBAC-protected policy compliance scaffolds and human stewardship gates. Growth Partner terminology. ${P.companion} supports — never exposes compliance records beyond RBAC or modifies immutable acknowledgements.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans steward policy decisions and compliance accountability.', '${P.companion} informs and supports.', 'Clarity before bureaucracy — accountability before assumptions.', 'Growth Partner — never Affiliate.', 'Compliance Stewardship Era — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — policy compliance signals max ~500 chars. No raw compliance PII, protected employee records, or confidential policy content beyond RBAC.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_customer_feedback_voice_of_the_customer_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._acfvotcebp224_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_policy_library\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Policy library — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_policy_library()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  for (const fn of [
    "policy_dashboard",
    "policy_library",
    "acknowledgement_center",
    "policy_lifecycle_manager",
    "policy_companion",
    "compliance_calendar",
    "executive_compliance_dashboard",
    "trust_communication_integration",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${P.bp}_${fn}()`);
  }

  sql = sql.replace(
    /select 'aipify-customer-feedback-voice-of-the-customer-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected customer feedback and voice of customer guidance within Customer Voice Era; cross-link only for Customer Success Center, Innovation Center, and Action Center.",
    "RBAC-protected enterprise policy and compliance guidance within Compliance Stewardship Era; cross-link only for Trust Center and Communication Center Phase 217.",
  );

  return sql;
}

function genMigration() {
  const src224 = path.join(ROOT, "supabase/migrations/20261385000000_aipify_customer_feedback_voice_of_the_customer_engine_phase224.sql");
  if (!fs.existsSync(src224)) throw new Error("Phase 224 migration required");
  let m = transformFrom224(fs.readFileSync(src224, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-customer-feedback-voice-of-the-customer-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(path.join(ROOT, `lib/core/${P.slug}.ts`), transformFrom224(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")));
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom224(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")));
  }
  const panel = path.join(ROOT, `components/app/${srcSlug}/AipifyCustomerFeedbackVoiceOfTheCustomerEngineDashboardPanel.tsx`);
  write(path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`), transformFrom224(fs.readFileSync(panel, "utf8")));
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`);
  write(path.join(ROOT, `app/app/${P.slug}/page.tsx`), transformFrom224(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")));
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom224(fs.readFileSync(path.join(ROOT, `app/api/aipify/${srcSlug}/${route}/route.ts`), "utf8")),
    );
  }
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports enterprise policy and compliance management — does NOT expose compliance records beyond RBAC or modify immutable acknowledgements.

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

## What is the Enterprise Policy & Compliance Management Engine?

Enterprise Policy & Compliance Management provides centralized policy publishing, acknowledgement tracking, and compliance governance at \`/app/${P.slug}\`.

## Does the Policy Companion replace human policy stewardship?

**No.** ${P.companion} prepares policy clarity and compliance summaries — it does **NOT** expose compliance records beyond RBAC, modify immutable acknowledgements, or auto-publish policies without human approval.

## What does the Policy Center include?

Policy dashboard, policy library, acknowledgement center, compliance calendar, executive compliance dashboard, and policy lifecycle manager — RBAC-protected metadata only.

## How does this relate to Trust Center and Communication Center?

Cross-link only: Trust Center (\`/platform/trust\`) and Communication Center Phase 217 (\`/app/aipify-organizational-communication-announcements-engine\`). Never duplicate their RPCs.

## Why are RBAC and immutable acknowledgements required?

Humans retain policy administration authority. Aipify tracks acknowledgement metadata — it does not expose compliance records beyond role-based access or modify immutable acknowledgement audit trails.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Policy Center: policy dashboard, policy library, acknowledgement center, compliance calendar, executive compliance dashboard, policy lifecycle manager, trust/communication integration (cross-links), policy knowledge libraries.
Policy Library: categorization, search, version history, and organizational policy transparency.
Acknowledgement Center: employee confirmations, mandatory workflows, and overdue acknowledgement tracking.
Compliance Calendar: upcoming reviews, scheduled reassessments, and proactive governance preparedness.
Executive Compliance Dashboard: leadership compliance insights and areas requiring attention.
Policy Lifecycle Manager: drafting, review, approval, retirement, and preserved audit trails.
Design principles: Clarity before bureaucracy, accountability before assumptions, stewardship before obligation.
Companion limitations: no compliance records beyond RBAC, no modification of immutable acknowledgements.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never exposes compliance records beyond RBAC or modifies immutable acknowledgements.";
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
    c = c.replace('| "aipifyCustomerFeedbackVoiceOfTheCustomerEngine"', `| "aipifyCustomerFeedbackVoiceOfTheCustomerEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    const anchor = /id: "aipifyCustomerFeedbackVoiceOfTheCustomerEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyCustomerFeedbackVoiceOfTheCustomerEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-customer-feedback-voice-of-the-customer-engine")) {\n    return "aipifyCustomerFeedbackVoiceOfTheCustomerEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-customer-feedback-voice-of-the-customer-engine")) {\n    return "aipifyCustomerFeedbackVoiceOfTheCustomerEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_customer_feedback_voice_of_the_customer.steward",', `"aipify_customer_feedback_voice_of_the_customer.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-customer-feedback-voice-of-the-customer-engine";',
      `export * from "./aipify-customer-feedback-voice-of-the-customer-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports policy publishing, acknowledgement tracking, and compliance governance. Supports administrators — does NOT expose compliance records beyond RBAC. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Policy compliance score",
    modeLabel: "Mode",
    readinessLabel: "Compliance maturity level",
    executiveReviews: "Executive compliance dashboard",
    activeReflections: "Active policy compliance scaffolds",
    humanOversightRequired: `Human oversight required — humans steward policy administration; ${P.companion} supports only`,
    eraOpenerSummary: `Compliance Stewardship Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate Trust Center or Communication Center RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Policy library — governance prompts",
    frameworkLabel: "Acknowledgement center",
    reviewsLabel: "Executive compliance dashboard",
    companionLabel: `${P.companion} — supports clarity, never replaces human policy stewardship`,
    subEngineLabel: "Compliance calendar",
    reflections: "Policy compliance scaffolds",
    executiveReviewEntries: "Policy acknowledgement entries",
    scaffoldNotes: "RBAC-protected policy compliance scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT expose compliance records beyond RBAC or modify immutable acknowledgements`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports policy compliance visibility — humans retain policy administration authority.`,
      philosophy: "People First. RBAC-protected policy compliance scaffolds. Growth Partner terminology — never Affiliate.",
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
        ? "Retningslinjer og compliance"
        : locale === "sv"
          ? "Policy och regelefterlevnad"
          : locale === "da"
            ? "Politik og compliance"
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
      'export * from "./implementation-blueprint-phase224-vocabulary";',
      `export * from "./implementation-blueprint-phase224-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE224_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase224-aipify-customer-feedback-voice-of-the-customer.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE224_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase224-aipify-customer-feedback-voice-of-the-customer.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_customer_feedback_voice_of_the_customer.view`, `aipify_customer_feedback_voice_of_the_customer.manage`, `aipify_customer_feedback_voice_of_the_customer.steward`.";
  const entry = `\n**Aipify Enterprise Policy & Compliance Management Engine (Phase 225):** See [${P.docSlug}_PHASE225.md](./${P.docSlug}_PHASE225.md) — Policy Center for policy dashboard, policy library, acknowledgement center, compliance calendar, executive compliance dashboard, policy lifecycle manager, and Trust Center/Communication Center integration. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** exposing compliance records beyond RBAC or modifying immutable acknowledgements. Cross-links only: Trust Center, Communication Center Phase 217. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 225")) {
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
