#!/usr/bin/env node
/** ABOS Phase 238 — Aipify Translate & Multilingual Workforce Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "translate_workforce_dashboard",
  "language_settings_hub",
  "realtime_translation_engine",
  "document_translation_engine",
  "knowledge_translation_engine",
  "workforce_translation_engine",
  "language_governance_dashboard",
  "broadcast_translation_engine",
  "translate_integration_center",
];

const P = {
  phase: 238,
  migration: "20261399000000_aipify_translate_multilingual_workforce_engine_phase238.sql",
  slug: "aipify-translate-multilingual-workforce-engine",
  base: "AipifyTranslateMultilingualWorkforce",
  camel: "aipifyTranslateMultilingualWorkforceEngine",
  snake: "aipify_translate_multilingual_workforce",
  permPrefix: "aipify_translate_multilingual_workforce",
  helper: "atmwfe",
  bp: "atmwfebp238",
  decisionType: "aipify_translate_multilingual_workforce_engine",
  title: "Translate & Multilingual Workforce",
  centerTitle: "Translate",
  companion: "Translation Companion",
  scoreKey: "aipify_translate_multilingual_workforce_score",
  modeKey: "multilingual_workforce_mode",
  levelKey: "translate_maturity_level",
  thirdEntity: "multilingual_workforce_notes",
  era: "Universal Knowledge Era (234–238)",
  eraRange: "234–238",
  docSlug: "AIPIFY_TRANSLATE_MULTILINGUAL_WORKFORCE_ENGINE",
  ilmFile: "implementation-blueprint-phase238-aipify-translate-multilingual-workforce.txt",
  navLabel: "Translate",
  crossLinkNote:
    "Cross-links only: Knowledge Center, Communication Center, Enterprise Notification Engine Phase 233, Document Intelligence Engine Phase 230, Meeting Intelligence Engine, Enterprise Search Engine Phase 234, Executive Cockpit Phase 200, and Desktop Companion Phase 236 — never bypass translation RBAC, expose sensitive content in translation workflows, or override organization language policies.",
  companionLimitations: [
    "bypassing_translation_rbac",
    "exposing_sensitive_content_in_translation",
    "unlogged_language_policy_changes",
    "replacing_human_judgment_on_restricted_languages",
    "modifying_translation_audit_trail",
    "translating_without_consent",
    "overriding_org_language_policies",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom237(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyEnterpriseCalendarPersonalAssistant", P.base],
    ["aipify-enterprise-calendar-personal-assistant-engine", P.slug],
    ["aipify_enterprise_calendar_personal_assistant", P.snake],
    ["aipifyEnterpriseCalendarPersonalAssistantEngine", P.camel],
    ["aecpaebp237", P.bp],
    ["_aecpae_", `_${P.helper}_`],
    ["aipify_enterprise_calendar_personal_assistant_score", P.scoreKey],
    ["calendar_personal_assistant_mode", P.modeKey],
    ["calendar_assistant_maturity_level", P.levelKey],
    ["calendar_personal_assistant_notes", P.thirdEntity],
    ["CalendarPersonalAssistantNote", thirdPascal],
    ["calendar_personal_assistant_notes_count", `${P.thirdEntity}_count`],
    ["Calendar Phase 237", "__CALENDAR_PHASE_237__"],
    ["Calendar Assistant", P.centerTitle],
    ["Calendar Companion", P.companion],
    ["__CALENDAR_PHASE_237__", "Calendar Phase 237"],
    ["Enterprise Calendar & Personal Assistant", P.title],
    ["Calendar", P.navLabel],
    ["Phase 237", `Phase ${P.phase}`],
    ["aipify_enterprise_calendar_personal_assistant.view", `${P.permPrefix}.view`],
    ["aipify_enterprise_calendar_personal_assistant.manage", `${P.permPrefix}.manage`],
    ["aipify_enterprise_calendar_personal_assistant.steward", `${P.permPrefix}.steward`],
    ["aipify_enterprise_calendar_personal_assistant_engine", P.decisionType],
    ["20261398000000_aipify_enterprise_calendar_personal_assistant_engine_phase237.sql", P.migration],
    ["Repo Phase 237", `Repo Phase ${P.phase}`],
    ["Phase 237 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE237_AIPIFY_ENTERPRISE_CALENDAR_PERSONAL_ASSISTANT_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase237", `implementation-blueprint-phase${P.phase}`],
    ["calendar_assistant_dashboard", SCAFFOLDS[0]],
    ["calendar_integration_hub", SCAFFOLDS[1]],
    ["scheduling_assistance_engine", SCAFFOLDS[2]],
    ["reminder_management_engine", SCAFFOLDS[3]],
    ["personal_assistant_engine", SCAFFOLDS[4]],
    ["executive_calendar_engine", SCAFFOLDS[5]],
    ["calendar_governance_dashboard", SCAFFOLDS[6]],
    ["briefing_summary_engine", SCAFFOLDS[7]],
    ["calendar_integration_center", SCAFFOLDS[8]],
    ["calendar_companion", "translation_companion"],
    ["_seed_calendar_personal_assistant_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["calendar assistant stewardship", "multilingual workforce stewardship"],
    ["scheduling-informed decision support", "language-aware decision support"],
    ["preparation-first calendar culture", "inclusion-first multilingual culture"],
    ["active calendar integrations", "active language packs"],
    ["commitments requiring attention", "translations requiring review"],
    ["Calendar Integration Hub", "Language Settings Hub"],
    ["Scheduling Assistance Engine", "Real-Time Translation Engine"],
    ["Reminder Management Engine", "Document Translation Engine"],
    ["Personal Assistant Engine", "Knowledge Translation Engine"],
    ["Executive Calendar Engine", "Workforce Translation Engine"],
    ["Calendar Governance Dashboard", "Language Governance Dashboard"],
    ["calendar assistant indicators", "translation workforce indicators"],
    ["calendar governance prompts", "language governance prompts"],
    ["calendar assistant prompts", "translation assistant prompts"],
    ["executive schedule summaries", "executive summary translations"],
    ["scheduling conflict signals", "translation completeness signals"],
    ["RBAC-protected calendar policies", "RBAC-protected language policies"],
    ["Preparation before improvisation", "Understanding before automation"],
    ["Privacy before exposure", "Inclusion before exclusion"],
    ["Stewardship before speed", "Presentation before storage"],
    ["no_bypassing_calendar_rbac", "no_bypassing_translation_rbac"],
    ["AIPIFY_ENTERPRISE_CALENDAR_PERSONAL_ASSISTANT_ENGINE", P.docSlug],
    ["enterprise calendar and personal assistant", "translate and multilingual workforce"],
    ["Calendar personal assistant audit logs", "Multilingual workforce audit logs"],
    ["calendar access RBAC", "translation history RBAC"],
    ["calendar assistant scaffolds", "translate workforce scaffolds"],
    ["organization calendar policies", "organization language policies"],
    ["Calendar assistant score", "Translate workforce score"],
    ["Calendar assistant maturity level", "Translate maturity level"],
    ["Since Last Login summary entries", "Language pack review entries"],
    ["Calendar assistant", P.centerTitle],
    ["calendar assistant", "translate workforce"],
    ["personal reminder privacy stewardship", "sensitive content protection stewardship"],
    ["private reminders beyond RBAC", "sensitive content beyond RBAC"],
    ["cross-calendar scheduling assistance", "cross-language broadcast assistance"],
    ["executive briefing reviews", "translation quality reviews"],
    [
      "Executive Cockpit Phase 200, Action Center, Meeting Intelligence Engine, Enterprise Notification Engine Phase 233, Customer Success Center, Enterprise Search Engine Phase 234, and Desktop Companion Phase 236",
      "Knowledge Center, Communication Center, Enterprise Notification Engine Phase 233, Document Intelligence Engine Phase 230, Meeting Intelligence Engine, Enterprise Search Engine Phase 234, Executive Cockpit Phase 200, and Desktop Companion Phase 236",
    ],
    [
      "Executive Cockpit, Action Center, Meeting Intelligence Engine, Enterprise Notification Engine Phase 233, Customer Success Center, Enterprise Search Engine Phase 234, and Desktop Companion Phase 236",
      "Knowledge Center, Communication Center, Enterprise Notification Engine Phase 233, Document Intelligence Engine, Meeting Intelligence Engine, Enterprise Search Engine Phase 234, Executive Cockpit Phase 200, and Desktop Companion Phase 236",
    ],
    [
      "Never access calendars without authorization or expose private reminders",
      "Never bypass translation RBAC or expose sensitive content in translation workflows",
    ],
    ["calendar commitments", "translation workflows"],
    ["Calendar commitments", "Translation workflows"],
    ["confidential personal reminder routing", "confidential translation history routing"],
    ["accesses calendars without explicit authorization", "translates sensitive content without RBAC approval"],
    ["Unauthorized calendar access without explicit authorization", "Unauthorized translation history access without RBAC approval"],
    ["Modifying calendar audit trails", "Modifying translation audit trails"],
    ["Exposure before privacy", "Exclusion before inclusion"],
    ["user scheduling judgment", "user language preference control"],
    ["User scheduling judgment", "User language preference control"],
    ["scheduling decisions and commitment accountability", "translation decisions and language policy accountability"],
    ["calendar assistant visibility", "multilingual workforce visibility"],
    ["calendar assistant governance", "multilingual workforce governance"],
    [
      "enable Aipify to function as a true business companion by helping employees and leaders manage schedules, commitments, reminders and important life events through intelligent calendar assistance — maintaining explicit calendar authorization, private personal reminders, organization policies, and complete audit history",
      "enable Aipify to remove language barriers within organizations by providing intelligent translation capabilities across the entire Aipify ecosystem — maintaining presentation-level translation, English fallback, organization language policies, RBAC-protected translation history, and complete audit history",
    ],
    [
      "missed commitments decrease, meeting preparedness improves, follow-up completion increases, executive organization improves, and employees adopt Companion calendar features with preparation before improvisation",
      "multilingual adoption increases, communication barriers decrease, employee engagement improves, Knowledge Center accessibility increases, and international employees onboard faster with understanding before automation",
    ],
    ["Calendar Phase 238", "Calendar Phase 237"],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports multilingual workforce capabilities — NOT bypassing translation RBAC, exposing sensitive content in translation workflows, or overriding organization language policies. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Enable Aipify to remove language barriers within organizations by providing intelligent translation capabilities across the entire Aipify ecosystem — ${P.companion} supports understanding, humans decide.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Universal Knowledge Era (${P.eraRange}). Human-stewarded language governance; RBAC-protected translation scaffolds; language policy changes logged; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Aipify helps people understand one another — language never becomes a barrier to collaboration, learning or belonging. Aipify works for everyone.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Ten translation modules with governance'),
    jsonb_build_object('key', 'language_settings_hub', 'label', 'Language settings hub', 'emoji', '🌐', 'description', 'Preferred, secondary, and org language settings'),
    jsonb_build_object('key', 'realtime_translation_engine', 'label', 'Real-time translation engine', 'emoji', '💬', 'description', 'Message and notification translation'),
    jsonb_build_object('key', 'document_translation_engine', 'label', 'Document translation engine', 'emoji', '📄', 'description', 'Documents, presentations, and policies'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not replace user language preference control'),
    jsonb_build_object('key', 'workforce_translation_engine', 'label', 'Workforce translation engine', 'emoji', '👥', 'description', 'Employee communications and onboarding'),
    jsonb_build_object('key', 'language_governance_dashboard', 'label', 'Language governance dashboard', 'emoji', '🛡️', 'description', 'Approved languages and translation quality'),
    jsonb_build_object('key', 'language_tiers', 'label', 'Language tiers catalog', 'emoji', '📋', 'description', 'Tier 1–3 supported languages with English fallback')
  ); ${D};
create or replace function public._${bp}_translate_workforce_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — ten capabilities. Understanding before automation.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'translate_workforce_dashboard', 'label', 'Translate Workforce Dashboard — translations requiring review'),
    jsonb_build_object('key', 'language_settings', 'label', 'User Preferred Language Settings & Interface Localization'),
    jsonb_build_object('key', 'realtime_messages', 'label', 'Real-Time Message Translation'),
    jsonb_build_object('key', 'document_translation', 'label', 'Document Translation'),
    jsonb_build_object('key', 'meeting_summary_translation', 'label', 'Meeting Summary Translation'),
    jsonb_build_object('key', 'knowledge_center_translation', 'label', 'Knowledge Center Translation'),
    jsonb_build_object('key', 'notification_translation', 'label', 'Notification Translation'),
    jsonb_build_object('key', 'multilingual_broadcasts', 'label', 'Multi-Language Broadcasts'),
    jsonb_build_object('key', 'presentation_task_policy', 'label', 'Presentation, Task & Policy Translation'),
    jsonb_build_object('key', 'language_aware_search', 'label', 'Language-Aware Search Support')
  )); ${D};
create or replace function public._${bp}_language_settings_hub() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Language settings — inclusion before exclusion.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'preferred_language', 'label', 'Has the user selected a preferred language?'),
    jsonb_build_object('key', 'org_languages', 'label', 'Are organization approved languages enforced?'),
    jsonb_build_object('key', 'presentation_level', 'label', 'Does translation occur at presentation level only?'),
    jsonb_build_object('key', 'english_fallback', 'label', 'Do missing translations fall back to English?'),
    jsonb_build_object('key', 'governance', 'label', 'How does governance protect sensitive information during translation?')
  )); ${D};
create or replace function public._${bp}_realtime_translation_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Real-time translation — presentation before storage.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'tier1_en', 'label', 'Tier 1 — English (EN)'),
    jsonb_build_object('key', 'tier1_no', 'label', 'Tier 1 — Norwegian (NO)'),
    jsonb_build_object('key', 'tier1_sv', 'label', 'Tier 1 — Swedish (SV)'),
    jsonb_build_object('key', 'tier1_da', 'label', 'Tier 1 — Danish (DA)'),
    jsonb_build_object('key', 'tier1_pl', 'label', 'Tier 1 — Polish (PL)'),
    jsonb_build_object('key', 'tier1_uk', 'label', 'Tier 1 — Ukrainian (UK)'),
    jsonb_build_object('key', 'tier1_es', 'label', 'Tier 1 — Spanish (ES)'),
    jsonb_build_object('key', 'tier2_de', 'label', 'Tier 2 — German, Dutch, Finnish, French, Italian'),
    jsonb_build_object('key', 'tier3', 'label', 'Tier 3 — Portuguese, Arabic, Japanese, Korean, Chinese, Hindi')
  )); ${D};
create or replace function public._${bp}_broadcast_translation_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Broadcast translation — distribute in preferred languages.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'announcements', 'label', 'Translate announcements'),
    jsonb_build_object('key', 'multilingual_broadcasts', 'label', 'Multi-language broadcasts to teams'),
    jsonb_build_object('key', 'department_comms', 'label', 'Department communications for managers'),
    jsonb_build_object('key', 'support_responses', 'label', 'Translate support responses'),
    jsonb_build_object('key', 'reminders_notifications', 'label', 'Translate reminders and notifications'),
    jsonb_build_object('key', 'quality_reviews', 'label', 'Translation quality reviews supported')
  )); ${D};
create or replace function public._${bp}_translation_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports multilingual clarity and never bypasses translation RBAC or exposes sensitive content.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'respond_in_preferred_language', 'label', 'Respond in user preferred language'),
    jsonb_build_object('key', 'workforce_scenarios', 'label', 'Polish, Ukrainian, Norwegian workforce scenarios'),
    jsonb_build_object('key', 'broadcast_guidance', 'label', 'Distribute updates in preferred languages'),
    jsonb_build_object('key', 'translation_assistant_prompts', 'label', 'Translation assistant prompts'),
    jsonb_build_object('key', 'preparation_materials', 'label', 'Translate onboarding and HR materials'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Translation history RBAC — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_document_translation_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Document translation — internal keys remain language-independent.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'documents', 'label', 'Document translation'),
    jsonb_build_object('key', 'presentations', 'label', 'Presentation translation'),
    jsonb_build_object('key', 'policies', 'label', 'Policy translation'),
    jsonb_build_object('key', 'tasks', 'label', 'Task translation'),
    jsonb_build_object('key', 'hr_documentation', 'label', 'Translate HR documentation'),
    jsonb_build_object('key', 'meeting_notes', 'label', 'Translate meeting notes')
  )); ${D};
create or replace function public._${bp}_knowledge_translation_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Knowledge translation — accessibility before barriers.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'knowledge_articles', 'label', 'Translate knowledge articles'),
    jsonb_build_object('key', 'onboarding_materials', 'label', 'Translate onboarding materials'),
    jsonb_build_object('key', 'executive_summaries', 'label', 'Translate executive summaries'),
    jsonb_build_object('key', 'language_aware_search', 'label', 'Language-aware search support'),
    jsonb_build_object('key', 'missing_fallback', 'label', 'Missing translations fall back to English'),
    jsonb_build_object('key', 'quality_reviews', 'label', 'Translation quality reviews supported')
  )); ${D};
create or replace function public._${bp}_workforce_translation_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Workforce translation — help people understand one another.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'employee_comms', 'label', 'Translate employee communications'),
    jsonb_build_object('key', 'secondary_language', 'label', 'Secondary language support'),
    jsonb_build_object('key', 'assistance_level', 'label', 'Translation assistance level settings'),
    jsonb_build_object('key', 'restricted_languages', 'label', 'Organization restricted languages'),
    jsonb_build_object('key', 'super_admin', 'label', 'Super Admin — enable, disable, publish language packs'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Translation audit visibility respects role permissions')
  )); ${D};
create or replace function public._${bp}_language_governance_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Language governance — organizations control approved languages.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'default_org_language', 'label', 'Default organization language'),
    jsonb_build_object('key', 'approved_languages', 'label', 'Approved languages list'),
    jsonb_build_object('key', 'restricted_languages', 'label', 'Restricted languages enforcement'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Translation audit history — immutable log'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Manager, Employee tiers'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for language policy changes')
  )); ${D};
create or replace function public._${bp}_translate_integration_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Translate integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'cross_link', '/app/knowledge-center-engine'),
    jsonb_build_object('key', 'communication_center', 'label', 'Communication Center', 'cross_link', '/app/aipify-organizational-communication-announcements-engine'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'document_intelligence', 'label', 'Document Intelligence Engine Phase 230', 'cross_link', '/app/aipify-document-intelligence-enterprise-document-engine'),
    jsonb_build_object('key', 'meeting_intelligence', 'label', 'Meeting Intelligence Engine', 'cross_link', '/app/aipify-meeting-intelligence-follow-up-engine'),
    jsonb_build_object('key', 'enterprise_search', 'label', 'Enterprise Search Engine Phase 234', 'cross_link', '/app/aipify-enterprise-search-universal-knowledge-access-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'desktop_companion', 'label', 'Desktop Companion Phase 236', 'cross_link', '/app/aipify-desktop-companion-creative-bridge-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for translation integration actions')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing translation RBAC',
      'Exposing sensitive content in translation workflows',
      'Overriding organization language policies',
      'Replacing human judgment on restricted languages',
      'Modifying translation audit trails',
      'Unlogged language policy changes',
      'Translating without consent',
      'Override human judgment'), 'principle', '${P.companion} supports — users retain language preference control and sensitive information stays protected.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm multilingual support without exclusion pressure.', 'values', jsonb_build_array('understanding_before_automation','inclusion_before_exclusion','presentation_before_storage','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Multilingual workforce audit logs via aipify_translate_multilingual_workforce_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_translate_multilingual_workforce permissions — translation history RBAC'),
    jsonb_build_object('key', 'sensitive_protection', 'label', 'Sensitive information protected during translation workflows'),
    jsonb_build_object('key', 'translation_history', 'label', 'Translation history follows RBAC policies'),
    jsonb_build_object('key', 'org_policies', 'label', 'Organizations control approved and restricted languages'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 237, 'key', 'enterprise_calendar_personal_assistant', 'label', 'Calendar Phase 237', 'route', '/app/aipify-enterprise-calendar-personal-assistant-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 238, 'key', 'translate_multilingual_workforce', 'label', 'Translate Phase 238', 'route', '/app/${P.slug}', 'description', 'Human-stewarded multilingual workforce — closes Universal Knowledge Era')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'route', '/app/knowledge-center-engine', 'relationship', 'Knowledge Center integration — cross-link only'),
    jsonb_build_object('key', 'communication_center', 'label', 'Communication Center', 'route', '/app/aipify-organizational-communication-announcements-engine', 'relationship', 'Communication Center integration — cross-link only'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'route', '/app/aipify-enterprise-notification-attention-management-engine', 'relationship', 'Notification Engine integration — cross-link only'),
    jsonb_build_object('key', 'document_intelligence', 'label', 'Document Intelligence Engine Phase 230', 'route', '/app/aipify-document-intelligence-enterprise-document-engine', 'relationship', 'Document Intelligence integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Understanding before automation — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with RBAC-protected translation scaffolds and presentation-level localization. Growth Partner terminology. ${P.companion} supports — never bypasses translation RBAC or exposes sensitive content in translation workflows.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — users retain language preference control.', '${P.companion} informs and supports.', 'Understanding before automation — inclusion before exclusion.', 'Growth Partner — never Affiliate.', 'Universal Knowledge Era — ${P.eraRange} — Aipify works for everyone.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — translation signals max ~500 chars. No sensitive content beyond RBAC or PII in audit logs. Internal system keys remain language-independent.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_enterprise_calendar_personal_assistant_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._aecpaebp237_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_language_settings_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Language settings hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_language_settings_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_calendar_integration_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Language settings hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_language_settings_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_translate_workforce_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Translate — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_translate_workforce_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_calendar_assistant_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Translate — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_translate_workforce_dashboard()->'capabilities') = 10,`,
  );

  for (const fn of [
    "translate_workforce_dashboard",
    "language_settings_hub",
    "realtime_translation_engine",
    "broadcast_translation_engine",
    "translation_companion",
    "document_translation_engine",
    "knowledge_translation_engine",
    "workforce_translation_engine",
    "language_governance_dashboard",
    "translate_integration_center",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${P.bp}_${fn}()`);
  }

  sql = sql.replace(
    /select 'aipify-enterprise-calendar-personal-assistant-engine'[^;]+;/g,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected enterprise calendar and personal assistant guidance within Universal Knowledge Era;",
    "RBAC-protected translate and multilingual workforce guidance within Universal Knowledge Era;",
  );
  sql = sql.replace(
    /Phase 237 Enterprise Calendar & Personal Assistant Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /select 'aipify-translate-multilingual-workforce-engine', '[^']+', 'Translate — Universal Knowledge Era \(234–238\)\. People First\.', 'authenticated', 237/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}`,
  );

  return sql;
}

function genMigration() {
  const src237 = path.join(ROOT, "supabase/migrations/20261398000000_aipify_enterprise_calendar_personal_assistant_engine_phase237.sql");
  if (!fs.existsSync(src237)) throw new Error("Phase 237 migration required");
  let m = transformFrom237(fs.readFileSync(src237, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-enterprise-calendar-personal-assistant-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(path.join(ROOT, `lib/core/${P.slug}.ts`), transformFrom237(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")));
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom237(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")));
  }
  const panel = path.join(ROOT, `components/app/${srcSlug}/AipifyEnterpriseCalendarPersonalAssistantEngineDashboardPanel.tsx`);
  write(
    path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`),
    transformFrom237(fs.readFileSync(panel, "utf8")),
  );
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`);
  write(path.join(ROOT, `app/app/${P.slug}/page.tsx`), transformFrom237(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")));
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom237(fs.readFileSync(path.join(ROOT, `app/api/aipify/${srcSlug}/${route}/route.ts`), "utf8")),
    );
  }
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. Aipify helps people understand one another — language never becomes a barrier to collaboration, learning or belonging. ${P.companion} supports multilingual workforce capabilities — does NOT bypass translation RBAC, expose sensitive content, or override organization language policies.

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
Era: ${P.era} (closing phase)
${P.crossLinkNote}
`,
  );
  write(
    path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
    `# ${P.title} Engine — FAQ (Phase ${P.phase})

## What is the Translate & Multilingual Workforce Engine?

The Translate & Multilingual Workforce Engine removes language barriers across Aipify at \`/app/${P.slug}\`.

## What translation features are included?

User preferred language settings, automatic interface localization, real-time message translation, document translation, meeting summary translation, Knowledge Center translation, notification translation, multi-language broadcasts, presentation/task/policy translation, and language-aware search.

## What languages are supported?

**Tier 1:** EN, NO, SV, DA, PL, UK, ES. **Tier 2:** DE, NL, FI, FR, IT. **Tier 3:** PT, AR, JA, KO, ZH, HI. Missing translations fall back to English.

## What translation capabilities are included?

Translate employee communications, announcements, meeting notes, executive summaries, knowledge articles, onboarding materials, HR documentation, presentations, support responses, and reminders/notifications.

## What workforce scenarios are supported?

Employees interact in their preferred language (e.g. Polish, Ukrainian, Norwegian). Managers can distribute updates in each recipient preferred language.

## What language settings are available?

Users: preferred language, secondary language, translation assistance level. Organizations: default language, approved languages, restricted languages.

## What Super Admin capabilities are included?

Enable/disable languages, review translation completeness, publish language packs, monitor quality, and roll back language versions.

## What translation rules apply?

Internal system keys remain language-independent. Translation occurs at presentation level. Missing translations fall back to English. Quality reviews are supported.

## Who can manage translation features?

Super Admin (global language management), Tenant Admin (organization settings), Managers (department communications), Employees (personal preferences) — enterprise RBAC.

## Are translation workflows audited?

**Yes.** Translation history follows RBAC. Sensitive information stays protected during translation workflows.

## How does this integrate with other Aipify surfaces?

Cross-link only: Knowledge Center, Communication Center, Enterprise Notification Engine Phase 233, Document Intelligence Engine Phase 230, Meeting Intelligence Engine, Enterprise Search Engine Phase 234, Executive Cockpit Phase 200, Desktop Companion Phase 236.

## Does the Translation Companion replace user judgment?

**No.** ${P.companion} supports multilingual clarity — it does **NOT** bypass translation RBAC or override organization language policies.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Translate: language settings hub, real-time translation, document translation, knowledge translation, workforce translation, governance, broadcasts, integration center.
Languages Tier 1: EN, NO, SV, DA, PL, UK, ES. Tier 2: DE, NL, FI, FR, IT. Tier 3: PT, AR, JA, KO, ZH, HI.
Capabilities: interface localization, messages, documents, meetings, Knowledge Center, notifications, broadcasts, presentations, tasks, policies, language-aware search.
Workforce: Polish, Ukrainian, Norwegian scenarios — respond in preferred language; distribute updates in preferred languages.
Settings: preferred/secondary language, assistance level; org default, approved, restricted languages.
Super Admin: enable/disable languages, completeness reviews, language packs, quality monitoring, rollbacks.
Rules: keys language-independent, presentation-level translation, English fallback, quality reviews.
Security: translation history RBAC, sensitive content protected, audit logging.
Design principles: Understanding before automation, inclusion before exclusion, presentation before storage.
Companion limitations: no bypassing translation RBAC, no exposing sensitive content, no overriding org language policies.
${P.crossLinkNote}
Vision: Aipify helps people understand one another. Aipify works for everyone.
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never bypasses translation RBAC, exposes sensitive content in translation workflows, or overrides organization language policies.";
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
    c = c.replace('| "aipifyEnterpriseCalendarPersonalAssistantEngine"', `| "aipifyEnterpriseCalendarPersonalAssistantEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    const anchor = /id: "aipifyEnterpriseCalendarPersonalAssistantEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyEnterpriseCalendarPersonalAssistantEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-enterprise-calendar-personal-assistant-engine")) {\n    return "aipifyEnterpriseCalendarPersonalAssistantEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-enterprise-calendar-personal-assistant-engine")) {\n    return "aipifyEnterpriseCalendarPersonalAssistantEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_enterprise_calendar_personal_assistant.steward",', `"aipify_enterprise_calendar_personal_assistant.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-enterprise-calendar-personal-assistant-engine";',
      `export * from "./aipify-enterprise-calendar-personal-assistant-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports preferred language settings, real-time translation, documents, Knowledge Center, notifications, broadcasts, and language-aware search. Supports inclusion — does NOT bypass translation RBAC. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Translate workforce score",
    modeLabel: "Mode",
    readinessLabel: "Translate maturity level",
    executiveReviews: "Translation quality reviews",
    activeReflections: "Active translate workforce scaffolds",
    humanOversightRequired: `Human oversight required — users retain language preference control; ${P.companion} supports only`,
    eraOpenerSummary: `Universal Knowledge Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate Knowledge Center, Communication Center, Notification Engine, Document Intelligence, Meeting Intelligence, Enterprise Search, Executive Cockpit, or Desktop Companion RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Language settings hub — governance prompts",
    frameworkLabel: "Real-time translation engine",
    reviewsLabel: "Language governance dashboard",
    companionLabel: `${P.companion} — supports multilingual clarity, never replaces user language control`,
    subEngineLabel: "Document translation engine",
    reflections: "Translate workforce scaffolds",
    executiveReviewEntries: "Language pack review entries",
    scaffoldNotes: "RBAC-protected translate workforce scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT bypass translation RBAC, expose sensitive content, or override organization language policies`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports multilingual understanding — users retain language preference control and sensitive information stays protected.`,
      philosophy: "People First. RBAC-protected translate workforce scaffolds. Growth Partner terminology — never Affiliate.",
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
        ? "Oversett"
        : locale === "sv"
          ? "Översätt"
          : locale === "da"
            ? "Oversæt"
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
      'export * from "./implementation-blueprint-phase237-vocabulary";',
      `export * from "./implementation-blueprint-phase237-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE237_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase237-aipify-enterprise-calendar-personal-assistant.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE237_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase237-aipify-enterprise-calendar-personal-assistant.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_enterprise_calendar_personal_assistant.view`, `aipify_enterprise_calendar_personal_assistant.manage`, `aipify_enterprise_calendar_personal_assistant.steward`.";
  const entry = `\n**Translate & Multilingual Workforce Engine (Phase 238):** See [AIPIFY_TRANSLATE_MULTILINGUAL_WORKFORCE_ENGINE_PHASE238.md](./AIPIFY_TRANSLATE_MULTILINGUAL_WORKFORCE_ENGINE_PHASE238.md) — Translate for language settings, real-time and document translation, Knowledge Center and notification translation, multilingual broadcasts, workforce scenarios, language governance, and integration center. Closes Universal Knowledge Era (234–238). \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** bypassing translation RBAC, exposing sensitive content, or overriding organization language policies. Cross-links only: Knowledge Center, Communication Center, Enterprise Notification Engine Phase 233, Document Intelligence Engine Phase 230, Meeting Intelligence Engine, Enterprise Search Engine Phase 234, Executive Cockpit Phase 200, Desktop Companion Phase 236. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 238")) {
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
