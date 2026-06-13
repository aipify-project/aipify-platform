#!/usr/bin/env node
/** ABOS Phase 237 — Enterprise Calendar & Personal Assistant Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "calendar_assistant_dashboard",
  "calendar_integration_hub",
  "scheduling_assistance_engine",
  "reminder_management_engine",
  "personal_assistant_engine",
  "executive_calendar_engine",
  "calendar_governance_dashboard",
  "briefing_summary_engine",
  "calendar_integration_center",
];

const P = {
  phase: 237,
  migration: "20261398000000_aipify_enterprise_calendar_personal_assistant_engine_phase237.sql",
  slug: "aipify-enterprise-calendar-personal-assistant-engine",
  base: "AipifyEnterpriseCalendarPersonalAssistant",
  camel: "aipifyEnterpriseCalendarPersonalAssistantEngine",
  snake: "aipify_enterprise_calendar_personal_assistant",
  permPrefix: "aipify_enterprise_calendar_personal_assistant",
  helper: "aecpae",
  bp: "aecpaebp237",
  decisionType: "aipify_enterprise_calendar_personal_assistant_engine",
  title: "Enterprise Calendar & Personal Assistant",
  centerTitle: "Calendar Assistant",
  companion: "Calendar Companion",
  scoreKey: "aipify_enterprise_calendar_personal_assistant_score",
  modeKey: "calendar_personal_assistant_mode",
  levelKey: "calendar_assistant_maturity_level",
  thirdEntity: "calendar_personal_assistant_notes",
  era: "Universal Knowledge Era (234–238)",
  eraRange: "234–238",
  docSlug: "AIPIFY_ENTERPRISE_CALENDAR_PERSONAL_ASSISTANT_ENGINE",
  ilmFile: "implementation-blueprint-phase237-aipify-enterprise-calendar-personal-assistant.txt",
  navLabel: "Calendar",
  crossLinkNote:
    "Cross-links only: Executive Cockpit Phase 200, Action Center, Meeting Intelligence Engine, Enterprise Notification Engine Phase 233, Customer Success Center, Enterprise Search Engine Phase 234, and Desktop Companion Phase 236 — never access calendars without authorization, expose private reminders, or bypass calendar RBAC.",
  companionLimitations: [
    "accessing_calendars_without_authorization",
    "exposing_private_reminders",
    "bypassing_calendar_rbac",
    "unlogged_calendar_policy_changes",
    "replacing_user_scheduling_judgment",
    "modifying_calendar_audit_trail",
    "scheduling_without_consent",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom236(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyDesktopCompanionCreativeBridge", P.base],
    ["aipify-desktop-companion-creative-bridge-engine", P.slug],
    ["aipify_desktop_companion_creative_bridge", P.snake],
    ["aipifyDesktopCompanionCreativeBridgeEngine", P.camel],
    ["adccbebp236", P.bp],
    ["_adccbe_", `_${P.helper}_`],
    ["aipify_desktop_companion_creative_bridge_score", P.scoreKey],
    ["desktop_companion_mode", P.modeKey],
    ["desktop_companion_maturity_level", P.levelKey],
    ["desktop_companion_creative_bridge_notes", P.thirdEntity],
    ["DesktopCompanionCreativeBridgeNote", thirdPascal],
    ["desktop_companion_creative_bridge_notes_count", `${P.thirdEntity}_count`],
    ["Desktop Phase 236", "__DESKTOP_PHASE_236__"],
    ["Desktop Companion", P.centerTitle],
    ["Bridge Companion", P.companion],
    ["__DESKTOP_PHASE_236__", "Desktop Phase 236"],
    ["Desktop Companion & Creative Bridge", P.title],
    ["Desktop", P.navLabel],
    ["Phase 236", `Phase ${P.phase}`],
    ["aipify_desktop_companion_creative_bridge.view", `${P.permPrefix}.view`],
    ["aipify_desktop_companion_creative_bridge.manage", `${P.permPrefix}.manage`],
    ["aipify_desktop_companion_creative_bridge.steward", `${P.permPrefix}.steward`],
    ["aipify_desktop_companion_creative_bridge_engine", P.decisionType],
    ["20261397000000_aipify_desktop_companion_creative_bridge_engine_phase236.sql", P.migration],
    ["Repo Phase 236", `Repo Phase ${P.phase}`],
    ["Phase 236 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE236_AIPIFY_DESKTOP_COMPANION_CREATIVE_BRIDGE_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase236", `implementation-blueprint-phase${P.phase}`],
    ["desktop_companion_dashboard", SCAFFOLDS[0]],
    ["application_detection_hub", SCAFFOLDS[1]],
    ["consent_session_engine", SCAFFOLDS[2]],
    ["guided_actions_engine", SCAFFOLDS[3]],
    ["creative_apps_bridge_engine", SCAFFOLDS[4]],
    ["business_apps_bridge_engine", SCAFFOLDS[5]],
    ["desktop_governance_dashboard", SCAFFOLDS[6]],
    ["session_audit_engine", SCAFFOLDS[7]],
    ["desktop_integration_center", SCAFFOLDS[8]],
    ["bridge_companion", "calendar_companion"],
    ["_seed_desktop_companion_creative_bridge_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["desktop companion stewardship", "calendar assistant stewardship"],
    ["application-bridge decision support", "scheduling-informed decision support"],
    ["consent-first desktop culture", "preparation-first calendar culture"],
    ["active application sessions", "active calendar integrations"],
    ["sessions requiring attention", "commitments requiring attention"],
    ["Application Detection Hub", "Calendar Integration Hub"],
    ["Consent & Session Engine", "Scheduling Assistance Engine"],
    ["Guided Actions Engine", "Reminder Management Engine"],
    ["Creative Apps Bridge Engine", "Personal Assistant Engine"],
    ["Business Apps Bridge Engine", "Executive Calendar Engine"],
    ["Desktop Governance Dashboard", "Calendar Governance Dashboard"],
    ["application bridge indicators", "calendar assistant indicators"],
    ["desktop governance prompts", "calendar governance prompts"],
    ["desktop companion prompts", "calendar assistant prompts"],
    ["application session summaries", "executive schedule summaries"],
    ["session expiration signals", "scheduling conflict signals"],
    ["RBAC-protected application policies", "RBAC-protected calendar policies"],
    ["Consent before access", "Preparation before improvisation"],
    ["Transparency before automation", "Privacy before exposure"],
    ["Control before convenience", "Stewardship before speed"],
    ["no_bypassing_desktop_companion_rbac", "no_bypassing_calendar_rbac"],
    ["AIPIFY_DESKTOP_COMPANION_CREATIVE_BRIDGE_ENGINE", P.docSlug],
    ["desktop companion and creative bridge", "enterprise calendar and personal assistant"],
    ["Desktop companion audit logs", "Calendar personal assistant audit logs"],
    ["application access RBAC", "calendar access RBAC"],
    ["desktop companion scaffolds", "calendar assistant scaffolds"],
    ["organization application policies", "organization calendar policies"],
    ["Desktop companion score", "Calendar assistant score"],
    ["Desktop companion maturity level", "Calendar assistant maturity level"],
    ["Application session audit entries", "Since Last Login summary entries"],
    ["Desktop companion", "Calendar assistant"],
    ["desktop companion", "calendar assistant"],
    ["user action control stewardship", "personal reminder privacy stewardship"],
    ["application access beyond consent", "private reminders beyond RBAC"],
    ["cross-application guided actions", "cross-calendar scheduling assistance"],
    ["session audit reviews", "executive briefing reviews"],
    [
      "Aipify Studio Phase 229, Document Intelligence Phase 230, Executive Cockpit Phase 200, Knowledge Center, Enterprise Notification Engine Phase 233, and Trust Center",
      "Executive Cockpit Phase 200, Action Center, Meeting Intelligence Engine, Enterprise Notification Engine Phase 233, Customer Success Center, Enterprise Search Engine Phase 234, and Desktop Companion Phase 236",
    ],
    [
      "Aipify Studio, Document Intelligence, Executive Cockpit, Knowledge Center, Enterprise Notification Engine Phase 233, and Trust Center",
      "Executive Cockpit, Action Center, Meeting Intelligence Engine, Enterprise Notification Engine Phase 233, Customer Success Center, Enterprise Search Engine Phase 234, and Desktop Companion Phase 236",
    ],
    [
      "Never access applications without permission or bypass session consent",
      "Never access calendars without authorization or expose private reminders",
    ],
    ["application sessions", "calendar commitments"],
    ["Application sessions", "Calendar commitments"],
    ["confidential application session routing", "confidential personal reminder routing"],
    ["accesses applications without user consent", "accesses calendars without explicit authorization"],
    ["Unauthorized application access without explicit approval", "Unauthorized calendar access without explicit authorization"],
    ["Modifying session audit trails", "Modifying calendar audit trails"],
    ["Automation before transparency", "Exposure before privacy"],
    ["user control over actions", "user scheduling judgment"],
    ["User control over actions", "User scheduling judgment"],
    ["application access decisions and user control accountability", "scheduling decisions and commitment accountability"],
    ["application session visibility", "calendar assistant visibility"],
    ["desktop companion governance", "calendar assistant governance"],
    [
      "enable Aipify to securely collaborate with approved desktop applications already installed on the user device, transforming Aipify into a true business companion — maintaining explicit consent, session expiration, organization policies, and complete audit history",
      "enable Aipify to function as a true business companion by helping employees and leaders manage schedules, commitments, reminders and important life events through intelligent calendar assistance — maintaining explicit calendar authorization, private personal reminders, organization policies, and complete audit history",
    ],
    [
      "time in professional software decreases, employee productivity increases, Aipify adoption grows, creative professionals benefit, and friction between Aipify and existing tools reduces with consent before access",
      "missed commitments decrease, meeting preparedness improves, follow-up completion increases, executive organization improves, and employees adopt Companion calendar features with preparation before improvisation",
    ],
    ["Desktop Phase 237", "Desktop Phase 236"],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports calendar and personal assistant capabilities — NOT accessing calendars without authorization, exposing private reminders, or bypassing calendar RBAC. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Enable Aipify to function as a true business companion by helping employees and leaders manage schedules, commitments, reminders and important life events through intelligent calendar assistance — ${P.companion} prepares, humans decide.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Universal Knowledge Era (${P.eraRange}). Human-stewarded calendar governance; RBAC-protected calendar scaffolds; calendar policy changes logged; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations reduce missed commitments, improve meeting preparedness, increase follow-up completion, and adopt Companion calendar features with preparation before improvisation.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Ten calendar modules with governance'),
    jsonb_build_object('key', 'calendar_integration_hub', 'label', 'Calendar integration hub', 'emoji', '📅', 'description', 'Outlook, Google Calendar, Apple Calendar, ICS'),
    jsonb_build_object('key', 'scheduling_assistance_engine', 'label', 'Scheduling assistance engine', 'emoji', '🗓️', 'description', 'Smart scheduling and conflict detection'),
    jsonb_build_object('key', 'reminder_management_engine', 'label', 'Reminder management engine', 'emoji', '⏰', 'description', 'Personal and business reminders'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not replace user scheduling judgment'),
    jsonb_build_object('key', 'executive_calendar_engine', 'label', 'Executive calendar engine', 'emoji', '👔', 'description', 'Daily briefings and executive summaries'),
    jsonb_build_object('key', 'calendar_governance_dashboard', 'label', 'Calendar governance dashboard', 'emoji', '🛡️', 'description', 'Organization calendar policies and privacy'),
    jsonb_build_object('key', 'reminder_types', 'label', 'Reminder types catalog', 'emoji', '📋', 'description', 'Birthdays, anniversaries, follow-ups, and more')
  ); ${D};
create or replace function public._${bp}_calendar_assistant_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — ten capabilities. Preparation before improvisation.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'calendar_assistant_dashboard', 'label', 'Calendar Assistant Dashboard — commitments and reminders requiring attention'),
    jsonb_build_object('key', 'calendar_integration_hub', 'label', 'Calendar Integration — Outlook, M365, Google, Apple, ICS'),
    jsonb_build_object('key', 'meeting_preparation', 'label', 'Meeting Preparation Reminders'),
    jsonb_build_object('key', 'smart_scheduling', 'label', 'Smart Scheduling Assistance & Conflict Detection'),
    jsonb_build_object('key', 'follow_up_reminders', 'label', 'Follow-Up Reminders & Unresolved Commitments'),
    jsonb_build_object('key', 'personal_business_reminders', 'label', 'Personal & Business Reminder Management'),
    jsonb_build_object('key', 'birthday_anniversary', 'label', 'Birthday & Anniversary Reminders'),
    jsonb_build_object('key', 'executive_summaries', 'label', 'Executive Schedule Summaries & Daily Briefings'),
    jsonb_build_object('key', 'weekly_planning', 'label', 'Weekly Planning & Since Last Login Summaries'),
    jsonb_build_object('key', 'focus_periods', 'label', 'Focus Period Suggestions & Healthy Scheduling Habits')
  )); ${D};
create or replace function public._${bp}_calendar_integration_hub() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Calendar integration — privacy before exposure.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'authorization', 'label', 'Has the user explicitly authorized calendar access?'),
    jsonb_build_object('key', 'private_reminders', 'label', 'Are personal reminders kept private?'),
    jsonb_build_object('key', 'org_policy', 'label', 'Does calendar access follow organization policies?'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Are calendar policy changes logged in the audit trail?'),
    jsonb_build_object('key', 'governance', 'label', 'How does governance support preparation without exposing private data?')
  )); ${D};
create or replace function public._${bp}_scheduling_assistance_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Scheduling assistance — stewardship before speed.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'outlook', 'label', 'Microsoft Outlook integration'),
    jsonb_build_object('key', 'microsoft_365', 'label', 'Microsoft 365 Calendar'),
    jsonb_build_object('key', 'google_calendar', 'label', 'Google Calendar integration'),
    jsonb_build_object('key', 'apple_calendar', 'label', 'Apple Calendar integration'),
    jsonb_build_object('key', 'ics_support', 'label', 'ICS calendar support'),
    jsonb_build_object('key', 'conflict_detection', 'label', 'Detect scheduling conflicts'),
    jsonb_build_object('key', 'time_blocking', 'label', 'Support time blocking'),
    jsonb_build_object('key', 'focus_periods', 'label', 'Suggest focus periods'),
    jsonb_build_object('key', 'healthy_habits', 'label', 'Encourage healthy scheduling habits')
  )); ${D};
create or replace function public._${bp}_briefing_summary_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Briefings and summaries — proactive leadership support.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'daily_briefings', 'label', 'Daily executive briefings'),
    jsonb_build_object('key', 'since_last_login', 'label', 'Since Last Login summaries'),
    jsonb_build_object('key', 'weekly_planning', 'label', 'Weekly planning assistance'),
    jsonb_build_object('key', 'strategic_meetings', 'label', 'Strategic meeting summaries'),
    jsonb_build_object('key', 'travel_prep', 'label', 'Travel preparation reminders'),
    jsonb_build_object('key', 'board_prep', 'label', 'Board meeting preparation support')
  )); ${D};
create or replace function public._${bp}_calendar_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports calendar clarity and never accesses calendars without authorization or exposes private reminders.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'executive_schedule_summaries', 'label', 'Executive schedule summaries'),
    jsonb_build_object('key', 'meeting_prep_guidance', 'label', 'Meeting preparation guidance'),
    jsonb_build_object('key', 'follow_up_guidance', 'label', 'Follow-up and commitment reminders'),
    jsonb_build_object('key', 'calendar_assistant_prompts', 'label', 'Calendar assistant prompts'),
    jsonb_build_object('key', 'preparation_materials', 'label', 'Suggest preparation materials before meetings'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Calendar access RBAC — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_reminder_management_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Reminder management — personal privacy protected.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'personal_reminders', 'label', 'Personal reminders — private'),
    jsonb_build_object('key', 'business_reminders', 'label', 'Business reminders'),
    jsonb_build_object('key', 'customer_followups', 'label', 'Customer follow-up reminders'),
    jsonb_build_object('key', 'birthdays_anniversaries', 'label', 'Birthday and anniversary reminders'),
    jsonb_build_object('key', 'compliance_deadlines', 'label', 'Compliance and learning deadlines'),
    jsonb_build_object('key', 'missed_followups', 'label', 'Identify missed follow-ups')
  )); ${D};
create or replace function public._${bp}_personal_assistant_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Personal assistant — preparation before important conversations.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'upcoming_meetings', 'label', 'Remind users of upcoming meetings'),
    jsonb_build_object('key', 'promised_followups', 'label', 'Remind users of promised follow-ups'),
    jsonb_build_object('key', 'unresolved_commitments', 'label', 'Surface unresolved commitments'),
    jsonb_build_object('key', 'conversation_prep', 'label', 'Prepare users for important conversations'),
    jsonb_build_object('key', 'relationship_reminders', 'label', 'Important relationship reminders'),
    jsonb_build_object('key', 'proactive_leadership', 'label', 'Encourage proactive leadership')
  )); ${D};
create or replace function public._${bp}_executive_calendar_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive calendar — decision and travel preparation.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'executive_briefings', 'label', 'Daily executive briefings'),
    jsonb_build_object('key', 'decision_prep', 'label', 'Decision preparation reminders'),
    jsonb_build_object('key', 'executive_actions', 'label', 'Executive action reminders'),
    jsonb_build_object('key', 'contract_renewals', 'label', 'Contract renewal reminders'),
    jsonb_build_object('key', 'team_commitments', 'label', 'Team commitment tracking'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Calendar audit visibility respects role permissions')
  )); ${D};
create or replace function public._${bp}_calendar_governance_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Calendar governance — organizations control calendar policies.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'calendar_authorization', 'label', 'Calendar access requires explicit authorization'),
    jsonb_build_object('key', 'private_reminders', 'label', 'Personal reminders remain private'),
    jsonb_build_object('key', 'org_policies', 'label', 'Organizations control calendar policies'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Calendar audit history — immutable log'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Manager, Employee tiers'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for calendar policy changes')
  )); ${D};
create or replace function public._${bp}_calendar_integration_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Calendar integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center', 'cross_link', '/app/action-center'),
    jsonb_build_object('key', 'meeting_intelligence', 'label', 'Meeting Intelligence Engine', 'cross_link', '/app/aipify-meeting-intelligence-follow-up-engine'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'customer_success', 'label', 'Customer Success Center', 'cross_link', '/app/aipify-customer-success-value-realization-engine'),
    jsonb_build_object('key', 'enterprise_search', 'label', 'Enterprise Search Engine Phase 234', 'cross_link', '/app/aipify-enterprise-search-universal-knowledge-access-engine'),
    jsonb_build_object('key', 'desktop_companion', 'label', 'Desktop Companion Phase 236', 'cross_link', '/app/aipify-desktop-companion-creative-bridge-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for calendar integration actions')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Accessing calendars without authorization',
      'Exposing private reminders',
      'Bypassing calendar RBAC',
      'Replacing user scheduling judgment',
      'Modifying calendar audit trails',
      'Unlogged calendar policy changes',
      'Scheduling without consent',
      'Override human judgment'), 'principle', '${P.companion} supports — users retain scheduling judgment and personal reminder privacy.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm calendar support without scheduling pressure.', 'values', jsonb_build_array('preparation_before_improvisation','privacy_before_exposure','stewardship_before_speed','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Calendar personal assistant audit logs via aipify_enterprise_calendar_personal_assistant_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_calendar_personal_assistant permissions — calendar access RBAC'),
    jsonb_build_object('key', 'calendar_authorization', 'label', 'Calendar access requires explicit authorization'),
    jsonb_build_object('key', 'private_reminders', 'label', 'Personal reminders remain private'),
    jsonb_build_object('key', 'org_policies', 'label', 'Organizations control calendar policies'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 236, 'key', 'desktop_companion_creative_bridge', 'label', 'Desktop Phase 236', 'route', '/app/aipify-desktop-companion-creative-bridge-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 237, 'key', 'enterprise_calendar_personal_assistant', 'label', 'Calendar Phase 237', 'route', '/app/${P.slug}', 'description', 'Human-stewarded calendar and personal assistant')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive Cockpit integration — cross-link only'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center', 'route', '/app/action-center', 'relationship', 'Action Center integration — cross-link only'),
    jsonb_build_object('key', 'meeting_intelligence', 'label', 'Meeting Intelligence Engine', 'route', '/app/aipify-meeting-intelligence-follow-up-engine', 'relationship', 'Meeting Intelligence integration — cross-link only'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'route', '/app/aipify-enterprise-notification-attention-management-engine', 'relationship', 'Notification Engine integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Preparation before improvisation — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with RBAC-protected calendar scaffolds and private personal reminders. Growth Partner terminology. ${P.companion} supports — never accesses calendars without authorization or exposes private reminders.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — users retain scheduling judgment and personal reminder privacy.', '${P.companion} informs and supports.', 'Preparation before improvisation — privacy before exposure.', 'Growth Partner — never Affiliate.', 'Universal Knowledge Era — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — calendar signals max ~500 chars. No private reminder content beyond RBAC or PII in audit logs.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_desktop_companion_creative_bridge_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._adccbebp236_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_calendar_integration_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Calendar integration hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_calendar_integration_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_application_detection_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Calendar integration hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_calendar_integration_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_calendar_assistant_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Calendar Assistant — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_calendar_assistant_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_desktop_companion_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Calendar Assistant — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_calendar_assistant_dashboard()->'capabilities') = 10,`,
  );

  for (const fn of [
    "calendar_assistant_dashboard",
    "calendar_integration_hub",
    "scheduling_assistance_engine",
    "briefing_summary_engine",
    "calendar_companion",
    "reminder_management_engine",
    "personal_assistant_engine",
    "executive_calendar_engine",
    "calendar_governance_dashboard",
    "calendar_integration_center",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${P.bp}_${fn}()`);
  }

  sql = sql.replace(
    /select 'aipify-desktop-companion-creative-bridge-engine'[^;]+;/g,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected desktop companion and creative bridge guidance within Universal Knowledge Era;",
    "RBAC-protected enterprise calendar and personal assistant guidance within Universal Knowledge Era;",
  );
  sql = sql.replace(
    /Phase 237 Calendar Assistant & Creative Bridge Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );

  return sql;
}

function genMigration() {
  const src236 = path.join(ROOT, "supabase/migrations/20261397000000_aipify_desktop_companion_creative_bridge_engine_phase236.sql");
  if (!fs.existsSync(src236)) throw new Error("Phase 236 migration required");
  let m = transformFrom236(fs.readFileSync(src236, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-desktop-companion-creative-bridge-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(path.join(ROOT, `lib/core/${P.slug}.ts`), transformFrom236(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")));
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom236(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")));
  }
  const panel = path.join(ROOT, `components/app/${srcSlug}/AipifyDesktopCompanionCreativeBridgeEngineDashboardPanel.tsx`);
  write(
    path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`),
    transformFrom236(fs.readFileSync(panel, "utf8")),
  );
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`);
  write(path.join(ROOT, `app/app/${P.slug}/page.tsx`), transformFrom236(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")));
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom236(fs.readFileSync(path.join(ROOT, `app/api/aipify/${srcSlug}/${route}/route.ts`), "utf8")),
    );
  }
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports calendar and personal assistant capabilities — does NOT access calendars without authorization, expose private reminders, or bypass calendar RBAC.

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

## What is the Enterprise Calendar & Personal Assistant Engine?

The Enterprise Calendar & Personal Assistant Engine helps employees and leaders manage schedules, commitments, reminders and life events at \`/app/${P.slug}\`.

## What calendar features are included?

Calendar integration, meeting preparation reminders, smart scheduling, follow-up reminders, personal and business reminder management, birthday and anniversary reminders, executive schedule summaries, daily briefings, weekly planning, and Since Last Login summaries.

## What calendar integrations are supported?

Microsoft Outlook, Microsoft 365, Google Calendar, Apple Calendar, ICS support, and future enterprise calendars — all require explicit authorization.

## What personal assistant capabilities are included?

Remind users of upcoming meetings and promised follow-ups, surface unresolved commitments, prepare for important conversations, suggest preparation materials, support time blocking, and encourage healthy scheduling habits.

## What executive capabilities are included?

Daily executive briefings, strategic meeting summaries, relationship reminders, decision preparation, travel preparation, and board meeting preparation support.

## What reminder types are supported?

Personal, business, customer follow-ups, team commitments, contract renewals, birthdays, anniversaries, executive actions, learning deadlines, and compliance deadlines.

## What intelligence features are included?

Detect scheduling conflicts, suggest focus periods, recommend preparation actions, surface context before meetings, identify missed follow-ups, and encourage proactive leadership.

## Who can use calendar assistant features?

Super Admin (organization settings), Tenant Admin (organization policies), Managers (team scheduling), and Employees (personal assistant features) — all governed by enterprise RBAC.

## Are calendar changes audited?

**Yes.** Calendar access requires explicit authorization. Personal reminders remain private and organizations control calendar policies.

## How does this integrate with other Aipify surfaces?

Cross-link only: Executive Cockpit Phase 200, Action Center, Meeting Intelligence Engine, Enterprise Notification Engine Phase 233, Customer Success Center, Enterprise Search Engine Phase 234, Desktop Companion Phase 236 — never duplicate their RPCs.

## Does the Calendar Companion replace user judgment?

**No.** ${P.companion} prepares scheduling visibility — it does **NOT** access calendars without authorization or expose private reminders.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Calendar Assistant: calendar integration hub, scheduling assistance, reminder management, personal assistant, executive calendar, governance, briefing summaries, integration center.
Integrations: Outlook, Microsoft 365, Google Calendar, Apple Calendar, ICS.
Reminders: personal, business, follow-ups, birthdays, anniversaries, executive actions, learning and compliance deadlines.
Executive: daily briefings, strategic summaries, Since Last Login, weekly planning, travel and board prep.
Intelligence: conflict detection, focus periods, preparation actions, missed follow-ups, proactive leadership.
Security: explicit calendar authorization, private personal reminders, org calendar policies, audit logging.
Design principles: Preparation before improvisation, privacy before exposure, stewardship before speed.
Companion limitations: no calendar access without authorization, no exposing private reminders, no bypassing calendar RBAC.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never accesses calendars without authorization, exposes private reminders, or bypasses calendar RBAC.";
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
    c = c.replace('| "aipifyDesktopCompanionCreativeBridgeEngine"', `| "aipifyDesktopCompanionCreativeBridgeEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    const anchor = /id: "aipifyDesktopCompanionCreativeBridgeEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyDesktopCompanionCreativeBridgeEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-desktop-companion-creative-bridge-engine")) {\n    return "aipifyDesktopCompanionCreativeBridgeEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-desktop-companion-creative-bridge-engine")) {\n    return "aipifyDesktopCompanionCreativeBridgeEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_desktop_companion_creative_bridge.steward",', `"aipify_desktop_companion_creative_bridge.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-desktop-companion-creative-bridge-engine";',
      `export * from "./aipify-desktop-companion-creative-bridge-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports calendar integration, meeting prep, smart scheduling, reminders, executive briefings, and weekly planning. Supports employees — does NOT access calendars without authorization. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Calendar assistant score",
    modeLabel: "Mode",
    readinessLabel: "Calendar assistant maturity level",
    executiveReviews: "Executive briefing reviews",
    activeReflections: "Active calendar assistant scaffolds",
    humanOversightRequired: `Human oversight required — users retain scheduling judgment; ${P.companion} supports only`,
    eraOpenerSummary: `Universal Knowledge Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate Executive Cockpit, Action Center, Meeting Intelligence, Notification Engine, Customer Success Center, Enterprise Search, or Desktop Companion RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Calendar integration hub — governance prompts",
    frameworkLabel: "Scheduling assistance engine",
    reviewsLabel: "Calendar governance dashboard",
    companionLabel: `${P.companion} — supports scheduling clarity, never replaces user judgment`,
    subEngineLabel: "Reminder management engine",
    reflections: "Calendar assistant scaffolds",
    executiveReviewEntries: "Since Last Login summary entries",
    scaffoldNotes: "RBAC-protected calendar assistant scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT access calendars without authorization, expose private reminders, or bypass calendar RBAC`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports calendar visibility — users retain scheduling judgment and personal reminder privacy.`,
      philosophy: "People First. RBAC-protected calendar assistant scaffolds. Growth Partner terminology — never Affiliate.",
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
        ? "Kalender"
        : locale === "sv"
          ? "Kalender"
          : locale === "da"
            ? "Kalender"
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
      'export * from "./implementation-blueprint-phase236-vocabulary";',
      `export * from "./implementation-blueprint-phase236-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE236_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase236-aipify-desktop-companion-creative-bridge.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE236_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase236-aipify-desktop-companion-creative-bridge.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_desktop_companion_creative_bridge.view`, `aipify_desktop_companion_creative_bridge.manage`, `aipify_desktop_companion_creative_bridge.steward`.";
  const entry = `\n**Enterprise Calendar & Personal Assistant Engine (Phase 237):** See [AIPIFY_ENTERPRISE_CALENDAR_PERSONAL_ASSISTANT_ENGINE_PHASE237.md](./AIPIFY_ENTERPRISE_CALENDAR_PERSONAL_ASSISTANT_ENGINE_PHASE237.md) — Calendar Assistant for integration hub, scheduling assistance, reminders, personal and executive assistant, briefings, Since Last Login, weekly planning, governance, and integration center. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** accessing calendars without authorization, exposing private reminders, or bypassing calendar RBAC. Cross-links only: Executive Cockpit Phase 200, Action Center, Meeting Intelligence Engine, Enterprise Notification Engine Phase 233, Customer Success Center, Enterprise Search Engine Phase 234, Desktop Companion Phase 236. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 237")) {
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
