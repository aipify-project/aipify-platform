#!/usr/bin/env node
/** ABOS Phase 242 — Employee Recognition & Celebration Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "recognition_celebration_dashboard",
  "recognition_feed_hub",
  "recognition_types_engine",
  "celebration_events_engine",
  "celebration_reminders_engine",
  "recognition_analytics_engine",
  "recognition_governance_dashboard",
  "executive_recognition_engine",
  "recognition_integration_center",
];

const P = {
  phase: 242,
  migration: "20261404000000_aipify_employee_recognition_celebration_engine_phase242.sql",
  slug: "aipify-employee-recognition-celebration-engine",
  base: "AipifyEmployeeRecognitionCelebration",
  camel: "aipifyEmployeeRecognitionCelebrationEngine",
  snake: "aipify_employee_recognition_celebration",
  permPrefix: "aipify_employee_recognition_celebration",
  helper: "aerce",
  bp: "aercebp242",
  decisionType: "aipify_employee_recognition_celebration_engine",
  title: "Employee Recognition & Celebration",
  centerTitle: "Recognition & Celebration",
  companion: "Recognition Companion",
  scoreKey: "aipify_employee_recognition_celebration_score",
  modeKey: "recognition_celebration_mode",
  levelKey: "recognition_celebration_maturity_level",
  thirdEntity: "recognition_celebration_notes",
  era: "Guided Adoption Era (239–243)",
  eraRange: "239–243",
  docSlug: "AIPIFY_EMPLOYEE_RECOGNITION_CELEBRATION_ENGINE",
  ilmFile: "implementation-blueprint-phase242-aipify-employee-recognition-celebration.txt",
  navLabel: "Recognition",
  crossLinkNote:
    "Cross-links only: Enterprise Notification Engine Phase 233, Calendar Assistant Engine Phase 237, Employee Growth Engine Phase 219, Learning Center, Enterprise Analytics Engine Phase 235, and Aipify Translate Phase 238 — never bypass recognition RBAC, expose recognition without authorization, or ignore personal celebration preferences.",
  companionLimitations: [
    "bypassing_recognition_rbac",
    "exposing_recognition_without_rbac",
    "ignoring_celebration_preferences",
    "unlogged_recognition_policy_changes",
    "replacing_human_recognition_judgment",
    "modifying_recognition_audit_trail",
    "forced_recognition_without_consent",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom240(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyEnterpriseMeetingIntelligenceCollaboration", P.base],
    ["aipify-enterprise-meeting-intelligence-collaboration-engine", P.slug],
    ["aipify_enterprise_meeting_intelligence_collaboration", P.snake],
    ["aipifyEnterpriseMeetingIntelligenceCollaborationEngine", P.camel],
    ["aemicebp240", P.bp],
    ["_aemice_", `_${P.helper}_`],
    ["aipify_enterprise_meeting_intelligence_collaboration_score", P.scoreKey],
    ["meeting_intelligence_mode", P.modeKey],
    ["meeting_intelligence_maturity_level", P.levelKey],
    ["meeting_intelligence_collaboration_notes", P.thirdEntity],
    ["MeetingIntelligenceCollaborationNote", thirdPascal],
    ["meeting_intelligence_collaboration_notes_count", `${P.thirdEntity}_count`],
    ["Meetings Phase 240", "__MEETING_PHASE_240__"],
    ["Meeting Companion", "__RECOGNITION_COMPANION__"],
    ["Enterprise Meeting Intelligence & Collaboration", P.title],
    ["__RECOGNITION_COMPANION__", P.companion],
    ["Meeting Intelligence", "__RECOGNITION_CENTER__"],
    ["__MEETING_PHASE_240__", "Meetings Phase 240"],
    ["Phase 240", `Phase ${P.phase}`],
    ["aipify_enterprise_meeting_intelligence_collaboration.view", `${P.permPrefix}.view`],
    ["aipify_enterprise_meeting_intelligence_collaboration.manage", `${P.permPrefix}.manage`],
    ["aipify_enterprise_meeting_intelligence_collaboration.steward", `${P.permPrefix}.steward`],
    ["aipify_enterprise_meeting_intelligence_collaboration_engine", P.decisionType],
    ["20261402000000_aipify_enterprise_meeting_intelligence_collaboration_engine_phase240.sql", P.migration],
    ["Repo Phase 240", `Repo Phase ${P.phase}`],
    ["Phase 240 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE240_AIPIFY_ENTERPRISE_MEETING_INTELLIGENCE_COLLABORATION_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase240", `implementation-blueprint-phase${P.phase}`],
    ["meeting_intelligence_dashboard", SCAFFOLDS[0]],
    ["meeting_preparation_hub", SCAFFOLDS[1]],
    ["pre_meeting_engine", SCAFFOLDS[2]],
    ["in_meeting_engine", SCAFFOLDS[3]],
    ["post_meeting_engine", SCAFFOLDS[4]],
    ["action_management_engine", SCAFFOLDS[5]],
    ["meeting_governance_dashboard", SCAFFOLDS[6]],
    ["executive_meeting_engine", SCAFFOLDS[7]],
    ["meeting_integration_center", SCAFFOLDS[8]],
    ["meeting_companion", "recognition_companion"],
    ["_seed_meeting_intelligence_collaboration_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["meeting intelligence stewardship", "recognition celebration stewardship"],
    ["meeting-informed decision support", "recognition-informed decision support"],
    ["preparation-first meeting culture", "appreciation-first recognition culture"],
    ["active meeting workflows", "active recognition programs"],
    ["meetings requiring attention", "recognition opportunities requiring attention"],
    ["Meeting Preparation Hub", "Recognition Feed Hub"],
    ["Pre-Meeting Engine", "Recognition Types Engine"],
    ["In-Meeting Engine", "Celebration Events Engine"],
    ["Post-Meeting Engine", "Celebration Reminders Engine"],
    ["Action Management Engine", "Recognition Analytics Engine"],
    ["Meeting Governance Dashboard", "Recognition Governance Dashboard"],
    ["meeting intelligence indicators", "recognition celebration indicators"],
    ["meeting governance prompts", "recognition governance prompts"],
    ["meeting assistant prompts", "recognition assistant prompts"],
    ["executive meeting briefings", "executive recognition programs"],
    ["follow-up completion signals", "celebration completion signals"],
    ["RBAC-protected meeting policies", "RBAC-protected recognition policies"],
    ["Preparation before meetings", "Appreciation before anonymity"],
    ["Accountability before ambiguity", "Culture before ceremony"],
    ["Visibility before volume", "Recognition before retention risk"],
    ["no_bypassing_meeting_rbac", "no_bypassing_recognition_rbac"],
    ["AIPIFY_ENTERPRISE_MEETING_INTELLIGENCE_COLLABORATION_ENGINE", P.docSlug],
    ["enterprise meeting intelligence and collaboration", "employee recognition and celebration"],
    ["Meeting intelligence audit logs", "Recognition celebration audit logs"],
    ["meeting visibility RBAC", "recognition visibility RBAC"],
    ["meeting intelligence scaffolds", "recognition celebration scaffolds"],
    ["organization meeting policies", "organization recognition policies"],
    ["Meeting intelligence score", "Recognition celebration score"],
    ["Meeting intelligence maturity level", "Recognition celebration maturity level"],
    ["Executive meeting briefing entries", "Executive recognition entries"],
    ["meeting intelligence", "recognition celebration"],
    ["sensitive meeting content stewardship", "personal celebration preference stewardship"],
    ["sensitive meeting content beyond RBAC", "recognition content beyond RBAC"],
    ["cross-meeting action assistance", "cross-team recognition assistance"],
    ["executive meeting briefing reviews", "executive recognition reviews"],
    [
      "Calendar Assistant Engine Phase 237, Action Center, Enterprise Notification Engine Phase 233, Enterprise Search Engine Phase 234, Document Intelligence Engine Phase 230, Executive Cockpit Phase 200, Knowledge Center, and Aipify Translate Phase 238",
      "Enterprise Notification Engine Phase 233, Calendar Assistant Engine Phase 237, Employee Growth Engine Phase 219, Learning Center, Enterprise Analytics Engine Phase 235, and Aipify Translate Phase 238",
    ],
    [
      "Never bypass meeting RBAC or expose sensitive meeting content without authorization",
      "Never bypass recognition RBAC or expose recognition without authorization",
    ],
    ["meeting workflows", "recognition programs"],
    ["Meeting workflows", "Recognition programs"],
    ["confidential meeting content routing", "confidential recognition visibility routing"],
    ["exposes sensitive meeting content without RBAC approval", "exposes recognition without RBAC approval"],
    ["Unauthorized meeting content access without RBAC approval", "Unauthorized recognition access without RBAC approval"],
    ["Modifying meeting audit trails", "Modifying recognition audit trails"],
    ["Ambiguity before accountability", "Anonymity before appreciation"],
    ["user meeting judgment control", "user recognition judgment control"],
    ["User meeting judgment control", "User recognition judgment control"],
    ["meeting decisions and accountability policy", "recognition decisions and celebration policy"],
    ["meeting intelligence visibility", "recognition celebration visibility"],
    ["meeting intelligence governance", "recognition celebration governance"],
    [
      "enable Aipify to help employees and leaders before, during and after meetings by improving preparation, capturing outcomes and ensuring accountability — maintaining meeting visibility RBAC, sensitive meeting protections, recording consent, retention policies, and complete audit history",
      "enable organizations to strengthen culture, engagement and appreciation through structured recognition and milestone celebrations — maintaining recognition visibility RBAC, personal celebration preferences, balanced recognition encouragement, and complete audit history",
    ],
    [
      "meeting preparedness improves, missed commitments decrease, follow-up completion accelerates, decision visibility increases, administrative burden reduces, and productivity increases with preparation before meetings",
      "employee engagement increases, workplace satisfaction improves, recognition participation rises, organizational culture strengthens, retention indicators improve, and collaboration increases with appreciation before anonymity",
    ],
    ["continues Guided Adoption Era", "continues Guided Adoption Era"],
    ["Onboarding Phase 239", "Onboarding Phase 239"],
    ["Onboarding Era (221–230)", `Guided Adoption Era (${P.eraRange})`],
    ["__RECOGNITION_CENTER__", P.centerTitle],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports recognition and celebration capabilities — NOT bypassing recognition RBAC, exposing recognition without authorization, or ignoring personal celebration preferences. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Enable organizations to strengthen culture, engagement and appreciation through structured recognition and milestone celebrations — ${P.companion} encourages, humans decide.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Guided Adoption Era (${P.eraRange}). Human-stewarded recognition governance; RBAC-protected celebration scaffolds; recognition policy changes logged; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations increase employee engagement, improve workplace satisfaction, raise recognition participation, strengthen culture, improve retention indicators, and increase collaboration with appreciation before anonymity.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Ten recognition modules with governance'),
    jsonb_build_object('key', 'recognition_feed_hub', 'label', 'Recognition feed hub', 'emoji', '📋', 'description', 'Peer, manager, and executive recognition feed'),
    jsonb_build_object('key', 'recognition_types_engine', 'label', 'Recognition types engine', 'emoji', '🏆', 'description', 'Great teamwork, innovation, leadership, values'),
    jsonb_build_object('key', 'celebration_events_engine', 'label', 'Celebration events engine', 'emoji', '🎉', 'description', 'Birthdays, anniversaries, team successes'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not replace human recognition judgment'),
    jsonb_build_object('key', 'recognition_analytics_engine', 'label', 'Recognition analytics engine', 'emoji', '📊', 'description', 'Participation, balance, culture signals'),
    jsonb_build_object('key', 'recognition_governance_dashboard', 'label', 'Recognition governance dashboard', 'emoji', '🛡️', 'description', 'RBAC visibility and celebration preferences'),
    jsonb_build_object('key', 'celebration_reminders', 'label', 'Celebration reminders catalog', 'emoji', '🔔', 'description', 'Milestones, birthdays, anniversaries')
  ); ${D};
create or replace function public._${bp}_recognition_celebration_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — ten capabilities. Appreciation before anonymity.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'recognition_celebration_dashboard', 'label', 'Recognition Dashboard — opportunities requiring attention'),
    jsonb_build_object('key', 'peer_recognition', 'label', 'Peer-to-Peer Recognition'),
    jsonb_build_object('key', 'manager_executive_recognition', 'label', 'Manager & Executive Recognition'),
    jsonb_build_object('key', 'service_anniversary', 'label', 'Service Anniversary Tracking'),
    jsonb_build_object('key', 'birthday_celebrations', 'label', 'Birthday Celebrations'),
    jsonb_build_object('key', 'team_achievements', 'label', 'Team Achievement Celebrations'),
    jsonb_build_object('key', 'project_completion', 'label', 'Project Completion Recognition'),
    jsonb_build_object('key', 'company_milestones', 'label', 'Company Milestone Celebrations'),
    jsonb_build_object('key', 'recognition_feed', 'label', 'Recognition Feed & Custom Categories'),
    jsonb_build_object('key', 'recognition_analytics', 'label', 'Recognition Analytics & Celebration Reminders')
  )); ${D};
create or replace function public._${bp}_recognition_feed_hub() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Recognition feed — culture before ceremony.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'recognition_rbac', 'label', 'Does recognition visibility follow RBAC policies?'),
    jsonb_build_object('key', 'celebration_preferences', 'label', 'Are personal celebration preferences respected?'),
    jsonb_build_object('key', 'balanced_recognition', 'label', 'Is recognition balanced across teams and roles?'),
    jsonb_build_object('key', 'unrecognized_contributions', 'label', 'Are unrecognized contributions surfaced gently?'),
    jsonb_build_object('key', 'governance', 'label', 'How does governance support positive culture without pressure?')
  )); ${D};
create or replace function public._${bp}_recognition_types_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Recognition types — appreciation before anonymity.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'great_teamwork', 'label', 'Great teamwork'),
    jsonb_build_object('key', 'innovation', 'label', 'Innovation'),
    jsonb_build_object('key', 'leadership', 'label', 'Leadership'),
    jsonb_build_object('key', 'customer_excellence', 'label', 'Customer excellence'),
    jsonb_build_object('key', 'knowledge_sharing', 'label', 'Knowledge sharing'),
    jsonb_build_object('key', 'extra_mile', 'label', 'Going the extra mile'),
    jsonb_build_object('key', 'company_values', 'label', 'Company values'),
    jsonb_build_object('key', 'custom_categories', 'label', 'Custom recognition categories')
  )); ${D};
create or replace function public._${bp}_executive_recognition_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive recognition — strategic culture stewardship.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'executive_recognition', 'label', 'Executive recognition programs'),
    jsonb_build_object('key', 'organizational_achievements', 'label', 'Organizational achievement celebrations'),
    jsonb_build_object('key', 'culture_signals', 'label', 'Workplace culture signals'),
    jsonb_build_object('key', 'retention_indicators', 'label', 'Retention indicator trends'),
    jsonb_build_object('key', 'participation_balance', 'label', 'Recognition participation balance'),
    jsonb_build_object('key', 'milestone_leadership', 'label', 'Company milestone leadership recognition')
  )); ${D};
create or replace function public._${bp}_recognition_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports recognition clarity and never bypasses recognition RBAC or ignores celebration preferences.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'suggest_opportunities', 'label', 'Suggest recognition opportunities'),
    jsonb_build_object('key', 'detect_unrecognized', 'label', 'Detect unrecognized contributions'),
    jsonb_build_object('key', 'surface_milestones', 'label', 'Surface upcoming milestones'),
    jsonb_build_object('key', 'balanced_encouragement', 'label', 'Encourage balanced recognition'),
    jsonb_build_object('key', 'recognition_prompts', 'label', 'Recognition assistant prompts'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Recognition visibility RBAC — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_celebration_events_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Celebration events — positive workplace culture.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'birthdays', 'label', 'Birthday celebrations'),
    jsonb_build_object('key', 'work_anniversaries', 'label', 'Work anniversaries'),
    jsonb_build_object('key', 'promotions', 'label', 'Promotion celebrations'),
    jsonb_build_object('key', 'certifications', 'label', 'Certifications completed'),
    jsonb_build_object('key', 'team_successes', 'label', 'Team successes'),
    jsonb_build_object('key', 'organizational_achievements', 'label', 'Organizational achievements')
  )); ${D};
create or replace function public._${bp}_celebration_reminders_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Celebration reminders — recognition before retention risk.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'upcoming_milestones', 'label', 'Upcoming milestone reminders'),
    jsonb_build_object('key', 'birthday_reminders', 'label', 'Birthday celebration reminders'),
    jsonb_build_object('key', 'anniversary_reminders', 'label', 'Service anniversary reminders'),
    jsonb_build_object('key', 'team_celebrations', 'label', 'Team achievement celebration reminders'),
    jsonb_build_object('key', 'preference_respect', 'label', 'Respect personal celebration preferences'),
    jsonb_build_object('key', 'notification_integration', 'label', 'Notification Engine integration — cross-link only')
  )); ${D};
create or replace function public._${bp}_recognition_analytics_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Recognition analytics — balanced participation visibility.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'engagement_signals', 'label', 'Employee engagement signals'),
    jsonb_build_object('key', 'participation_rates', 'label', 'Recognition participation rates'),
    jsonb_build_object('key', 'culture_indicators', 'label', 'Organizational culture indicators'),
    jsonb_build_object('key', 'retention_indicators', 'label', 'Retention indicator trends'),
    jsonb_build_object('key', 'collaboration_signals', 'label', 'Collaboration improvement signals'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Recognition audit visibility respects role permissions')
  )); ${D};
create or replace function public._${bp}_recognition_governance_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Recognition governance — organizations control recognition policies.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'recognition_rbac', 'label', 'Recognition visibility follows RBAC policies'),
    jsonb_build_object('key', 'celebration_preferences', 'label', 'Personal celebration preferences must be respected'),
    jsonb_build_object('key', 'custom_categories', 'label', 'Custom recognition categories governance'),
    jsonb_build_object('key', 'manager_recognition', 'label', 'Manager team recognition management'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Manager, Employee tiers'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for recognition policy changes')
  )); ${D};
create or replace function public._${bp}_recognition_integration_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Recognition integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'calendar_assistant', 'label', 'Calendar Assistant Engine Phase 237', 'cross_link', '/app/aipify-enterprise-calendar-personal-assistant-engine'),
    jsonb_build_object('key', 'employee_growth', 'label', 'Employee Growth Engine Phase 219', 'cross_link', '/app/aipify-employee-growth-career-development-engine'),
    jsonb_build_object('key', 'learning_center', 'label', 'Learning Center', 'cross_link', '/app/aipify-enterprise-training-certification-engine'),
    jsonb_build_object('key', 'enterprise_analytics', 'label', 'Enterprise Analytics Engine Phase 235', 'cross_link', '/app/aipify-enterprise-analytics-operational-intelligence-engine'),
    jsonb_build_object('key', 'aipify_translate', 'label', 'Aipify Translate Phase 238', 'cross_link', '/app/aipify-translate-multilingual-workforce-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for recognition integration actions')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing recognition RBAC',
      'Exposing recognition without authorization',
      'Ignoring personal celebration preferences',
      'Replacing human recognition judgment',
      'Modifying recognition audit trails',
      'Unlogged recognition policy changes',
      'Forced recognition without consent',
      'Override human judgment'), 'principle', '${P.companion} supports — users retain recognition judgment control and celebration preferences stay protected.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm recognition support without performance pressure.', 'values', jsonb_build_array('appreciation_before_anonymity','culture_before_ceremony','recognition_before_retention_risk','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Recognition celebration audit logs via aipify_employee_recognition_celebration_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_employee_recognition_celebration permissions — recognition visibility RBAC'),
    jsonb_build_object('key', 'recognition_rbac', 'label', 'Recognition visibility follows RBAC policies'),
    jsonb_build_object('key', 'celebration_preferences', 'label', 'Personal celebration preferences must be respected'),
    jsonb_build_object('key', 'org_policies', 'label', 'Organizations control recognition and celebration policies'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 240, 'key', 'enterprise_meeting_intelligence_collaboration', 'label', 'Meetings Phase 240', 'route', '/app/aipify-enterprise-meeting-intelligence-collaboration-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 242, 'key', 'employee_recognition_celebration', 'label', 'Recognition Phase 242', 'route', '/app/${P.slug}', 'description', 'Human-stewarded employee recognition and celebration')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'route', '/app/aipify-enterprise-notification-attention-management-engine', 'relationship', 'Notification Engine integration — cross-link only'),
    jsonb_build_object('key', 'calendar_assistant', 'label', 'Calendar Assistant Engine Phase 237', 'route', '/app/aipify-enterprise-calendar-personal-assistant-engine', 'relationship', 'Calendar Assistant integration — cross-link only'),
    jsonb_build_object('key', 'employee_growth', 'label', 'Employee Growth Engine Phase 219', 'route', '/app/aipify-employee-growth-career-development-engine', 'relationship', 'Employee Growth integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Appreciation before anonymity — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with RBAC-protected recognition scaffolds and celebration preference protections. Growth Partner terminology. ${P.companion} supports — never bypasses recognition RBAC or ignores personal celebration preferences.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — users retain recognition judgment control.', '${P.companion} informs and supports.', 'Appreciation before anonymity — culture before ceremony.', 'Growth Partner — never Affiliate.', 'Guided Adoption Era — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — recognition signals max ~500 chars. No recognition content beyond RBAC or PII in audit logs.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_enterprise_meeting_intelligence_collaboration_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._aemicebp240_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_recognition_feed_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Recognition feed hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_recognition_feed_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_meeting_preparation_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Recognition feed hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_recognition_feed_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_onboarding_journey_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Recognition feed hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_recognition_feed_hub()->'reflection_questions') = 5,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_recognition_celebration_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Recognition & Celebration — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_recognition_celebration_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_meeting_intelligence_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Recognition & Celebration — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_recognition_celebration_dashboard()->'capabilities') = 10,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  for (const fn of [...SCAFFOLDS, "recognition_companion"]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${P.bp}_${fn}()`);
  }

  sql = sql.replace(
    /select 'aipify-enterprise-meeting-intelligence-collaboration-engine'[^;]+;/g,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected enterprise meeting intelligence and collaboration guidance within Guided Adoption Era;",
    "RBAC-protected employee recognition and celebration guidance within Guided Adoption Era;",
  );
  sql = sql.replace(
    /Phase 242 Employee Recognition & Celebration Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 240 Enterprise Meeting Intelligence & Collaboration Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );

  sql = sql.replace(
    /'authenticated', 240\nwhere not exists \(select 1 from public\.aipify_knowledge_categories where slug = 'aipify-enterprise-meeting-intelligence-collaboration-engine'/,
    `'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-employee-recognition-celebration-engine'`,
  );

  return sql;
}

function genMigration() {
  const src240 = path.join(ROOT, "supabase/migrations/20261402000000_aipify_enterprise_meeting_intelligence_collaboration_engine_phase240.sql");
  if (!fs.existsSync(src240)) throw new Error("Phase 240 migration required");
  let m = transformFrom240(fs.readFileSync(src240, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-enterprise-meeting-intelligence-collaboration-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(path.join(ROOT, `lib/core/${P.slug}.ts`), transformFrom240(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")));
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom240(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")));
  }
  const panel = path.join(ROOT, `components/app/${srcSlug}/AipifyEnterpriseMeetingIntelligenceCollaborationEngineDashboardPanel.tsx`);
  write(
    path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`),
    transformFrom240(fs.readFileSync(panel, "utf8")),
  );
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`);
  write(path.join(ROOT, `app/app/${P.slug}/page.tsx`), transformFrom240(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")));
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom240(fs.readFileSync(path.join(ROOT, `app/api/aipify/${srcSlug}/${route}/route.ts`), "utf8")),
    );
  }
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports peer, manager, and executive recognition, milestone celebrations, recognition feed, analytics, and celebration reminders — does NOT bypass recognition RBAC, expose recognition without authorization, or ignore personal celebration preferences.

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
Era: ${P.era} (continuing phase)
${P.crossLinkNote}
`,
  );
  write(
    path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
    `# ${P.title} Engine — FAQ (Phase ${P.phase})

## What is the Employee Recognition & Celebration Engine?

The Employee Recognition & Celebration Engine helps organizations strengthen culture, engagement, and appreciation at \`/app/${P.slug}\`.

## What recognition features are included?

Peer-to-peer recognition, manager recognition, executive recognition, service anniversary tracking, birthday celebrations, team achievement celebrations, project completion recognition, company milestone celebrations, recognition feed, recognition analytics, celebration reminders, and custom recognition categories.

## What recognition types are supported?

Great teamwork, innovation, leadership, customer excellence, knowledge sharing, going the extra mile, company values, and custom categories.

## What celebrations are included?

Birthdays, work anniversaries, promotions, certifications completed, team successes, and organizational achievements.

## What intelligence features are included?

Suggest recognition opportunities, detect unrecognized contributions, surface upcoming milestones, encourage balanced recognition, and promote positive workplace culture.

## Who can access recognition and celebration?

Super Admin (full access), Tenant Admin (organization settings), Managers (team recognition management), Employees (peer recognition participation) — enterprise RBAC.

## Are recognition workflows audited?

**Yes.** Recognition visibility follows RBAC. Personal celebration preferences must be respected. Organizations control recognition policies.

## How does this integrate with other Aipify surfaces?

${P.crossLinkNote}

## Does the Recognition Companion replace human judgment?

**No.** ${P.companion} supports recognition clarity — it does **NOT** bypass recognition RBAC, expose recognition without authorization, or ignore personal celebration preferences.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Recognition: peer, manager, executive, service anniversaries, birthdays, team achievements, project completion, company milestones, feed, analytics, reminders, custom categories.
Types: great teamwork, innovation, leadership, customer excellence, knowledge sharing, extra mile, company values, custom categories.
Celebrations: birthdays, work anniversaries, promotions, certifications, team successes, organizational achievements.
Intelligence: suggest opportunities, detect unrecognized contributions, surface milestones, balanced recognition, positive culture.
Security: recognition visibility RBAC, personal celebration preferences, audit logging, enterprise permissions, 2FA.
Design principles: Appreciation before anonymity, culture before ceremony, recognition before retention risk.
Companion limitations: no bypassing recognition RBAC, no exposing recognition without authorization, no ignoring celebration preferences.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never bypasses recognition RBAC, exposes recognition without authorization, or ignores personal celebration preferences.";
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
    c = c.replace('| "aipifyEnterpriseMeetingIntelligenceCollaborationEngine"', `| "aipifyEnterpriseMeetingIntelligenceCollaborationEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    const anchor = /id: "aipifyEnterpriseMeetingIntelligenceCollaborationEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyEnterpriseMeetingIntelligenceCollaborationEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-enterprise-meeting-intelligence-collaboration-engine")) {\n    return "aipifyEnterpriseMeetingIntelligenceCollaborationEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-enterprise-meeting-intelligence-collaboration-engine")) {\n    return "aipifyEnterpriseMeetingIntelligenceCollaborationEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_enterprise_meeting_intelligence_collaboration.steward",', `"aipify_enterprise_meeting_intelligence_collaboration.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-enterprise-meeting-intelligence-collaboration-engine";',
      `export * from "./aipify-enterprise-meeting-intelligence-collaboration-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports peer and executive recognition, milestone celebrations, recognition feed, analytics, and celebration reminders. Supports positive culture — does NOT bypass recognition RBAC. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Recognition celebration score",
    modeLabel: "Mode",
    readinessLabel: "Recognition celebration maturity level",
    executiveReviews: "Executive recognition programs",
    activeReflections: "Active recognition celebration scaffolds",
    humanOversightRequired: `Human oversight required — users retain recognition judgment control; ${P.companion} supports only`,
    eraOpenerSummary: `Guided Adoption Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate Notification Engine, Calendar Assistant, Employee Growth, Learning Center, Analytics Engine, or Aipify Translate RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Recognition feed hub — governance prompts",
    frameworkLabel: "Recognition types engine",
    reviewsLabel: "Recognition governance dashboard",
    companionLabel: `${P.companion} — supports recognition clarity, never replaces human recognition judgment`,
    subEngineLabel: "Celebration events engine",
    reflections: "Recognition celebration scaffolds",
    executiveReviewEntries: "Executive recognition entries",
    scaffoldNotes: "RBAC-protected recognition celebration scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT bypass recognition RBAC, expose recognition without authorization, or ignore personal celebration preferences`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports recognition celebration — users retain recognition judgment control and celebration preferences stay protected.`,
      philosophy: "People First. RBAC-protected recognition celebration scaffolds. Growth Partner terminology — never Affiliate.",
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
        ? "Anerkjennelse"
        : locale === "sv"
          ? "Erkännande"
          : locale === "da"
            ? "Anerkendelse"
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
      'export * from "./implementation-blueprint-phase240-vocabulary";',
      `export * from "./implementation-blueprint-phase240-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE240_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase240-aipify-enterprise-meeting-intelligence-collaboration.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE240_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase240-aipify-enterprise-meeting-intelligence-collaboration.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_enterprise_meeting_intelligence_collaboration.view`, `aipify_enterprise_meeting_intelligence_collaboration.manage`, `aipify_enterprise_meeting_intelligence_collaboration.steward`.";
  const entry = `\n**Employee Recognition & Celebration Engine (Phase 242):** See [AIPIFY_EMPLOYEE_RECOGNITION_CELEBRATION_ENGINE_PHASE242.md](./AIPIFY_EMPLOYEE_RECOGNITION_CELEBRATION_ENGINE_PHASE242.md) — Recognition and celebration for peer/manager/executive recognition, milestone celebrations, recognition feed, analytics, governance, and integration center. Continues Guided Adoption Era (239–243). \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** bypassing recognition RBAC, exposing recognition without authorization, or ignoring personal celebration preferences. Cross-links only: Enterprise Notification Engine Phase 233, Calendar Assistant Engine Phase 237, Employee Growth Engine Phase 219, Learning Center, Enterprise Analytics Engine Phase 235, Aipify Translate Phase 238. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 242")) {
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
  console.error(`Phase ${P.phase} docs generated; stack requires Phase 240 artifacts: ${err.message}`);
  process.exitCode = 1;
}
