#!/usr/bin/env node
/** ABOS Phase 240 — Enterprise Meeting Intelligence & Collaboration Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "meeting_intelligence_dashboard",
  "meeting_preparation_hub",
  "pre_meeting_engine",
  "in_meeting_engine",
  "post_meeting_engine",
  "action_management_engine",
  "meeting_governance_dashboard",
  "executive_meeting_engine",
  "meeting_integration_center",
];

const P = {
  phase: 240,
  migration: "20261402000000_aipify_enterprise_meeting_intelligence_collaboration_engine_phase240.sql",
  slug: "aipify-enterprise-meeting-intelligence-collaboration-engine",
  base: "AipifyEnterpriseMeetingIntelligenceCollaboration",
  camel: "aipifyEnterpriseMeetingIntelligenceCollaborationEngine",
  snake: "aipify_enterprise_meeting_intelligence_collaboration",
  permPrefix: "aipify_enterprise_meeting_intelligence_collaboration",
  helper: "aemice",
  bp: "aemicebp240",
  decisionType: "aipify_enterprise_meeting_intelligence_collaboration_engine",
  title: "Enterprise Meeting Intelligence & Collaboration",
  centerTitle: "Meeting Intelligence",
  companion: "Meeting Companion",
  scoreKey: "aipify_enterprise_meeting_intelligence_collaboration_score",
  modeKey: "meeting_intelligence_mode",
  levelKey: "meeting_intelligence_maturity_level",
  thirdEntity: "meeting_intelligence_collaboration_notes",
  era: "Guided Adoption Era (239–243)",
  eraRange: "239–243",
  docSlug: "AIPIFY_ENTERPRISE_MEETING_INTELLIGENCE_COLLABORATION_ENGINE",
  ilmFile: "implementation-blueprint-phase240-aipify-enterprise-meeting-intelligence-collaboration.txt",
  navLabel: "Meetings",
  crossLinkNote:
    "Cross-links only: Calendar Assistant Engine Phase 237, Action Center, Enterprise Notification Engine Phase 233, Enterprise Search Engine Phase 234, Document Intelligence Engine Phase 230, Executive Cockpit Phase 200, Knowledge Center, and Aipify Translate Phase 238 — never bypass meeting RBAC, expose sensitive meeting content, or process recordings without explicit consent.",
  companionLimitations: [
    "bypassing_meeting_rbac",
    "exposing_sensitive_meeting_content",
    "unlogged_meeting_policy_changes",
    "processing_recordings_without_consent",
    "replacing_human_meeting_judgment",
    "modifying_meeting_audit_trail",
    "assigning_actions_without_approval",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom239(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyEnterpriseOnboardingGuidedAdoption", P.base],
    ["aipify-enterprise-onboarding-guided-adoption-engine", P.slug],
    ["aipify_enterprise_onboarding_guided_adoption", P.snake],
    ["aipifyEnterpriseOnboardingGuidedAdoptionEngine", P.camel],
    ["aeogaebp239", P.bp],
    ["_aeogae_", `_${P.helper}_`],
    ["aipify_enterprise_onboarding_guided_adoption_score", P.scoreKey],
    ["guided_adoption_mode", P.modeKey],
    ["onboarding_maturity_level", P.levelKey],
    ["guided_adoption_notes", P.thirdEntity],
    ["GuidedAdoptionNote", thirdPascal],
    ["guided_adoption_notes_count", `${P.thirdEntity}_count`],
    ["Onboarding Phase 239", "__ONBOARDING_PHASE_239__"],
    ["Adoption Companion", "__MEETING_COMPANION__"],
    ["Enterprise Onboarding & Guided Adoption", P.title],
    ["__MEETING_COMPANION__", P.companion],
    ["Onboarding", "__MEETING_CENTER__"],
    ["__ONBOARDING_PHASE_239__", "Onboarding Phase 239"],
    ["Phase 239", `Phase ${P.phase}`],
    ["aipify_enterprise_onboarding_guided_adoption.view", `${P.permPrefix}.view`],
    ["aipify_enterprise_onboarding_guided_adoption.manage", `${P.permPrefix}.manage`],
    ["aipify_enterprise_onboarding_guided_adoption.steward", `${P.permPrefix}.steward`],
    ["aipify_enterprise_onboarding_guided_adoption_engine", P.decisionType],
    ["20261400000000_aipify_enterprise_onboarding_guided_adoption_engine_phase239.sql", P.migration],
    ["Repo Phase 239", `Repo Phase ${P.phase}`],
    ["Phase 239 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE239_AIPIFY_ENTERPRISE_ONBOARDING_GUIDED_ADOPTION_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase239", `implementation-blueprint-phase${P.phase}`],
    ["onboarding_adoption_dashboard", SCAFFOLDS[0]],
    ["onboarding_journey_hub", SCAFFOLDS[1]],
    ["role_based_experience_engine", SCAFFOLDS[2]],
    ["department_path_engine", SCAFFOLDS[3]],
    ["guided_tour_engine", SCAFFOLDS[4]],
    ["milestone_celebration_engine", SCAFFOLDS[5]],
    ["adoption_governance_dashboard", SCAFFOLDS[6]],
    ["adoption_analytics_engine", SCAFFOLDS[7]],
    ["onboarding_integration_center", SCAFFOLDS[8]],
    ["adoption_companion", "meeting_companion"],
    ["_seed_guided_adoption_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["guided adoption stewardship", "meeting intelligence stewardship"],
    ["adoption-informed decision support", "meeting-informed decision support"],
    ["guidance-first adoption culture", "preparation-first meeting culture"],
    ["active onboarding journeys", "active meeting workflows"],
    ["onboarding steps requiring attention", "meetings requiring attention"],
    ["Onboarding Journey Hub", "Meeting Preparation Hub"],
    ["Role-Based Experience Engine", "Pre-Meeting Engine"],
    ["Department Path Engine", "In-Meeting Engine"],
    ["Guided Tour Engine", "Post-Meeting Engine"],
    ["Milestone Celebration Engine", "Action Management Engine"],
    ["Adoption Governance Dashboard", "Meeting Governance Dashboard"],
    ["guided adoption indicators", "meeting intelligence indicators"],
    ["adoption governance prompts", "meeting governance prompts"],
    ["onboarding assistant prompts", "meeting assistant prompts"],
    ["manager onboarding summaries", "executive meeting briefings"],
    ["adoption completion signals", "follow-up completion signals"],
    ["RBAC-protected onboarding policies", "RBAC-protected meeting policies"],
    ["Adoption before abandonment", "Preparation before meetings"],
    ["Guidance before overwhelm", "Accountability before ambiguity"],
    ["Progress before pressure", "Visibility before volume"],
    ["no_bypassing_onboarding_rbac", "no_bypassing_meeting_rbac"],
    ["AIPIFY_ENTERPRISE_ONBOARDING_GUIDED_ADOPTION_ENGINE", P.docSlug],
    ["enterprise onboarding and guided adoption", "enterprise meeting intelligence and collaboration"],
    ["Guided adoption audit logs", "Meeting intelligence audit logs"],
    ["onboarding progress RBAC", "meeting visibility RBAC"],
    ["onboarding adoption scaffolds", "meeting intelligence scaffolds"],
    ["organization onboarding policies", "organization meeting policies"],
    ["Onboarding adoption score", "Meeting intelligence score"],
    ["Onboarding maturity level", "Meeting intelligence maturity level"],
    ["Milestone celebration entries", "Executive meeting briefing entries"],
    ["guided adoption", "meeting intelligence"],
    ["onboarding content protection stewardship", "sensitive meeting content stewardship"],
    ["org onboarding content beyond RBAC", "sensitive meeting content beyond RBAC"],
    ["cross-role onboarding assistance", "cross-meeting action assistance"],
    ["manager onboarding dashboard reviews", "executive meeting briefing reviews"],
    [
      "Learning Center, Knowledge Center, Enterprise Notification Engine Phase 233, Executive Cockpit Phase 200, Communication Center, Enterprise Analytics Engine Phase 235, and Aipify Translate Phase 238",
      "Calendar Assistant Engine Phase 237, Action Center, Enterprise Notification Engine Phase 233, Enterprise Search Engine Phase 234, Document Intelligence Engine Phase 230, Executive Cockpit Phase 200, Knowledge Center, and Aipify Translate Phase 238",
    ],
    [
      "Learning Center, Knowledge Center, Enterprise Notification Engine Phase 233, Executive Cockpit Phase 200, Communication Center, Enterprise Analytics Engine Phase 235, and Aipify Translate Phase 238",
      "Calendar Assistant Engine Phase 237, Action Center, Enterprise Notification Engine Phase 233, Enterprise Search Engine Phase 234, Document Intelligence Engine, Executive Cockpit Phase 200, Knowledge Center, and Aipify Translate Phase 238",
    ],
    [
      "Never bypass onboarding RBAC or expose organization onboarding content without authorization",
      "Never bypass meeting RBAC or expose sensitive meeting content without authorization",
    ],
    ["onboarding journeys", "meeting workflows"],
    ["Onboarding journeys", "Meeting workflows"],
    ["confidential onboarding progress routing", "confidential meeting content routing"],
    ["exposes onboarding content without RBAC approval", "exposes sensitive meeting content without RBAC approval"],
    ["Unauthorized onboarding progress access without RBAC approval", "Unauthorized meeting content access without RBAC approval"],
    ["Modifying onboarding audit trails", "Modifying meeting audit trails"],
    ["Abandonment before adoption", "Ambiguity before accountability"],
    ["user onboarding pace control", "user meeting judgment control"],
    ["User onboarding pace control", "User meeting judgment control"],
    ["adoption decisions and onboarding policy accountability", "meeting decisions and accountability policy"],
    ["guided adoption visibility", "meeting intelligence visibility"],
    ["guided adoption governance", "meeting intelligence governance"],
    [
      "enable organizations to rapidly onboard employees, departments and new customers while maximizing Aipify adoption and long-term success — maintaining interactive journeys, role-based experiences, RBAC-protected onboarding progress, organization onboarding content protection, and complete audit history",
      "enable Aipify to help employees and leaders before, during and after meetings by improving preparation, capturing outcomes and ensuring accountability — maintaining meeting visibility RBAC, sensitive meeting protections, recording consent, retention policies, and complete audit history",
    ],
    [
      "time-to-value decreases, Aipify adoption increases, onboarding completion improves, support requests decrease, employee confidence increases, and customer satisfaction improves with adoption before abandonment",
      "meeting preparedness improves, missed commitments decrease, follow-up completion accelerates, decision visibility increases, administrative burden reduces, and productivity increases with preparation before meetings",
    ],
    ["opens Guided Adoption Era", "continues Guided Adoption Era"],
    ["Onboarding Phase 240", "Onboarding Phase 239"],
    ["Onboarding Era (221–230)", `Guided Adoption Era (${P.eraRange})`],
    ["__MEETING_CENTER__", P.centerTitle],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports meeting intelligence capabilities — NOT bypassing meeting RBAC, exposing sensitive meeting content, or processing recordings without explicit consent. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Enable Aipify to help employees and leaders before, during and after meetings by improving preparation, capturing outcomes and ensuring accountability — ${P.companion} prepares, humans decide.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Guided Adoption Era (${P.eraRange}). Human-stewarded meeting governance; RBAC-protected meeting scaffolds; meeting policy changes logged; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations improve meeting preparedness, reduce missed commitments, accelerate follow-up completion, increase decision visibility, and reduce administrative burden with preparation before meetings.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Ten meeting modules with governance'),
    jsonb_build_object('key', 'meeting_preparation_hub', 'label', 'Meeting preparation hub', 'emoji', '📋', 'description', 'Agendas, objectives, and prep materials'),
    jsonb_build_object('key', 'pre_meeting_engine', 'label', 'Pre-meeting engine', 'emoji', '⏱️', 'description', 'Documents, summaries, unresolved actions'),
    jsonb_build_object('key', 'post_meeting_engine', 'label', 'Post-meeting engine', 'emoji', '📝', 'description', 'Summaries, action items, follow-ups'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not replace user meeting judgment'),
    jsonb_build_object('key', 'action_management_engine', 'label', 'Action management engine', 'emoji', '✅', 'description', 'Action Center tasks and accountability'),
    jsonb_build_object('key', 'meeting_governance_dashboard', 'label', 'Meeting governance dashboard', 'emoji', '🛡️', 'description', 'RBAC visibility and retention policies'),
    jsonb_build_object('key', 'meeting_search', 'label', 'Meeting search catalog', 'emoji', '🔍', 'description', 'Search summaries, decisions, actions, topics')
  ); ${D};
create or replace function public._${bp}_meeting_intelligence_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — ten capabilities. Preparation before meetings.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'meeting_intelligence_dashboard', 'label', 'Meeting Intelligence Dashboard — meetings requiring attention'),
    jsonb_build_object('key', 'meeting_preparation', 'label', 'Meeting Preparation Assistance'),
    jsonb_build_object('key', 'agenda_generation', 'label', 'Meeting Agenda Generation & Objective Recommendations'),
    jsonb_build_object('key', 'note_capture', 'label', 'Meeting Note Capture & Discussion Organization'),
    jsonb_build_object('key', 'meeting_summaries', 'label', 'Meeting Summary Generation'),
    jsonb_build_object('key', 'action_extraction', 'label', 'Action Item Extraction & Decision Tracking'),
    jsonb_build_object('key', 'follow_up_reminders', 'label', 'Follow-Up Reminders & Accountability Workflows'),
    jsonb_build_object('key', 'executive_briefings', 'label', 'Executive Meeting Briefings & Participant Context'),
    jsonb_build_object('key', 'meeting_search', 'label', 'Meeting Search — Summaries, Decisions, Actions, Topics'),
    jsonb_build_object('key', 'meeting_history', 'label', 'Meeting History & Archive Approved Summaries')
  )); ${D};
create or replace function public._${bp}_meeting_preparation_hub() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Meeting preparation — accountability before ambiguity.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'agenda_defined', 'label', 'Is a meeting agenda defined with clear objectives?'),
    jsonb_build_object('key', 'meeting_rbac', 'label', 'Does meeting visibility follow RBAC policies?'),
    jsonb_build_object('key', 'sensitive_meeting', 'label', 'Are sensitive meetings restricted from AI processing when required?'),
    jsonb_build_object('key', 'recording_consent', 'label', 'Does meeting recording require explicit consent?'),
    jsonb_build_object('key', 'governance', 'label', 'How does governance support accountability without pressure?')
  )); ${D};
create or replace function public._${bp}_pre_meeting_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Pre-meeting — visibility before volume.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'agendas', 'label', 'Generate meeting agendas'),
    jsonb_build_object('key', 'documents', 'label', 'Surface relevant documents'),
    jsonb_build_object('key', 'previous_summaries', 'label', 'Display previous meeting summaries'),
    jsonb_build_object('key', 'unresolved_actions', 'label', 'Highlight unresolved action items'),
    jsonb_build_object('key', 'participant_context', 'label', 'Present participant context summaries'),
    jsonb_build_object('key', 'prep_materials', 'label', 'Recommend preparation materials'),
    jsonb_build_object('key', 'objectives', 'label', 'Meeting objective recommendations'),
    jsonb_build_object('key', 'executives', 'label', 'Executive meeting briefings'),
    jsonb_build_object('key', 'board_prep', 'label', 'Board preparation assistance')
  )); ${D};
create or replace function public._${bp}_executive_meeting_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive meeting intelligence — strategic accountability.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'executive_briefings', 'label', 'Executive meeting briefings'),
    jsonb_build_object('key', 'strategic_decisions', 'label', 'Strategic decision summaries'),
    jsonb_build_object('key', 'cross_meeting_trends', 'label', 'Cross-meeting trend analysis'),
    jsonb_build_object('key', 'commitment_tracking', 'label', 'Commitment tracking'),
    jsonb_build_object('key', 'board_prep', 'label', 'Board preparation assistance'),
    jsonb_build_object('key', 'search_executive', 'label', 'Search executive meeting history')
  )); ${D};
create or replace function public._${bp}_meeting_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports meeting clarity and never bypasses meeting RBAC or exposes sensitive meeting content.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'prep_guidance', 'label', 'Meeting preparation guidance'),
    jsonb_build_object('key', 'agenda_guidance', 'label', 'Agenda and objective guidance'),
    jsonb_build_object('key', 'note_guidance', 'label', 'Note capture and summary guidance'),
    jsonb_build_object('key', 'action_guidance', 'label', 'Action item and follow-up guidance'),
    jsonb_build_object('key', 'meeting_prompts', 'label', 'Meeting assistant prompts'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Meeting visibility RBAC — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_in_meeting_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'In-meeting — capture outcomes during discussion.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'capture_notes', 'label', 'Capture meeting notes'),
    jsonb_build_object('key', 'organize_topics', 'label', 'Organize discussion topics'),
    jsonb_build_object('key', 'identify_decisions', 'label', 'Identify decisions made'),
    jsonb_build_object('key', 'identify_commitments', 'label', 'Identify commitments'),
    jsonb_build_object('key', 'follow_up_requirements', 'label', 'Highlight follow-up requirements'),
    jsonb_build_object('key', 'sensitive_restrictions', 'label', 'Respect sensitive meeting AI processing restrictions')
  )); ${D};
create or replace function public._${bp}_post_meeting_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Post-meeting — ensure accountability after meetings.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'generate_summaries', 'label', 'Generate meeting summaries'),
    jsonb_build_object('key', 'assign_actions', 'label', 'Assign action items'),
    jsonb_build_object('key', 'notify_responsible', 'label', 'Notify responsible individuals'),
    jsonb_build_object('key', 'schedule_followups', 'label', 'Schedule follow-ups'),
    jsonb_build_object('key', 'archive_summaries', 'label', 'Archive approved summaries'),
    jsonb_build_object('key', 'update_projects', 'label', 'Update related projects')
  )); ${D};
create or replace function public._${bp}_action_management_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Action management — Action Center integration.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'action_center_tasks', 'label', 'Create Action Center tasks'),
    jsonb_build_object('key', 'completion_status', 'label', 'Track completion status'),
    jsonb_build_object('key', 'escalate_overdue', 'label', 'Escalate overdue commitments'),
    jsonb_build_object('key', 'accountability', 'label', 'Support accountability workflows'),
    jsonb_build_object('key', 'approval_gates', 'label', 'Human approval gates for action assignment'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Meeting audit visibility respects role permissions')
  )); ${D};
create or replace function public._${bp}_meeting_governance_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Meeting governance — organizations control meeting policies.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'meeting_rbac', 'label', 'Meeting visibility follows RBAC policies'),
    jsonb_build_object('key', 'sensitive_meetings', 'label', 'Sensitive meetings may restrict AI processing'),
    jsonb_build_object('key', 'retention_policies', 'label', 'Organizations control retention policies'),
    jsonb_build_object('key', 'recording_consent', 'label', 'Meeting recordings require explicit consent'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Manager, Employee, Executive tiers'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for meeting policy changes')
  )); ${D};
create or replace function public._${bp}_meeting_integration_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Meeting integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'calendar_assistant', 'label', 'Calendar Assistant Engine Phase 237', 'cross_link', '/app/aipify-enterprise-calendar-personal-assistant-engine'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center', 'cross_link', '/app/action-center'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'enterprise_search', 'label', 'Enterprise Search Engine Phase 234', 'cross_link', '/app/aipify-enterprise-search-universal-knowledge-access-engine'),
    jsonb_build_object('key', 'document_intelligence', 'label', 'Document Intelligence Engine Phase 230', 'cross_link', '/app/aipify-document-intelligence-enterprise-document-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'cross_link', '/app/knowledge-center-engine'),
    jsonb_build_object('key', 'aipify_translate', 'label', 'Aipify Translate Phase 238', 'cross_link', '/app/aipify-translate-multilingual-workforce-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for meeting integration actions')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing meeting RBAC',
      'Exposing sensitive meeting content',
      'Processing recordings without explicit consent',
      'Replacing human meeting judgment',
      'Modifying meeting audit trails',
      'Unlogged meeting policy changes',
      'Assigning actions without approval',
      'Override human judgment'), 'principle', '${P.companion} supports — users retain meeting judgment control and sensitive meetings stay protected.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm meeting support without meeting pressure.', 'values', jsonb_build_array('preparation_before_meetings','accountability_before_ambiguity','visibility_before_volume','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Meeting intelligence audit logs via aipify_enterprise_meeting_intelligence_collaboration_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_meeting_intelligence_collaboration permissions — meeting visibility RBAC'),
    jsonb_build_object('key', 'meeting_rbac', 'label', 'Meeting visibility follows RBAC policies'),
    jsonb_build_object('key', 'sensitive_meetings', 'label', 'Sensitive meetings may restrict AI processing'),
    jsonb_build_object('key', 'retention_policies', 'label', 'Organizations control retention policies'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 239, 'key', 'enterprise_onboarding_guided_adoption', 'label', 'Onboarding Phase 239', 'route', '/app/aipify-enterprise-onboarding-guided-adoption-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 240, 'key', 'enterprise_meeting_intelligence_collaboration', 'label', 'Meetings Phase 240', 'route', '/app/${P.slug}', 'description', 'Human-stewarded meeting intelligence and collaboration')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'calendar_assistant', 'label', 'Calendar Assistant Engine Phase 237', 'route', '/app/aipify-enterprise-calendar-personal-assistant-engine', 'relationship', 'Calendar Assistant integration — cross-link only'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center', 'route', '/app/action-center', 'relationship', 'Action Center integration — cross-link only'),
    jsonb_build_object('key', 'enterprise_search', 'label', 'Enterprise Search Engine Phase 234', 'route', '/app/aipify-enterprise-search-universal-knowledge-access-engine', 'relationship', 'Enterprise Search integration — cross-link only'),
    jsonb_build_object('key', 'document_intelligence', 'label', 'Document Intelligence Engine Phase 230', 'route', '/app/aipify-document-intelligence-enterprise-document-engine', 'relationship', 'Document Intelligence integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Preparation before meetings — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with RBAC-protected meeting scaffolds and sensitive meeting protections. Growth Partner terminology. ${P.companion} supports — never bypasses meeting RBAC or processes recordings without explicit consent.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — users retain meeting judgment control.', '${P.companion} informs and supports.', 'Preparation before meetings — accountability before ambiguity.', 'Growth Partner — never Affiliate.', 'Guided Adoption Era — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — meeting signals max ~500 chars. No sensitive meeting content beyond RBAC or PII in audit logs.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_enterprise_onboarding_guided_adoption_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._aeogaebp239_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_meeting_preparation_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Meeting preparation hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_meeting_preparation_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_onboarding_journey_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Meeting preparation hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_meeting_preparation_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_meeting_intelligence_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Meeting Intelligence — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_meeting_intelligence_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_onboarding_adoption_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Meeting Intelligence — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_meeting_intelligence_dashboard()->'capabilities') = 10,`,
  );

  for (const fn of [...SCAFFOLDS, "meeting_companion"]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${P.bp}_${fn}()`);
  }

  sql = sql.replace(
    /select 'aipify-enterprise-onboarding-guided-adoption-engine'[^;]+;/g,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected enterprise onboarding and guided adoption guidance within Guided Adoption Era;",
    "RBAC-protected enterprise meeting intelligence and collaboration guidance within Guided Adoption Era;",
  );
  sql = sql.replace(
    /Phase 240 Meeting Intelligence & Collaboration Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 239 Enterprise Onboarding & Guided Adoption Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );

  sql = sql.replaceAll(
    "meeting intelligence and collaboration meeting intelligence guidance",
    "meeting intelligence and collaboration guidance",
  );

  sql = sql.replace(
    /'authenticated', 239\nwhere not exists \(select 1 from public\.aipify_knowledge_categories where slug = 'aipify-enterprise-meeting-intelligence-collaboration-engine'/,
    `'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-enterprise-meeting-intelligence-collaboration-engine'`,
  );

  return sql;
}

function genMigration() {
  const src239 = path.join(ROOT, "supabase/migrations/20261400000000_aipify_enterprise_onboarding_guided_adoption_engine_phase239.sql");
  if (!fs.existsSync(src239)) throw new Error("Phase 239 migration required");
  let m = transformFrom239(fs.readFileSync(src239, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-enterprise-onboarding-guided-adoption-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(path.join(ROOT, `lib/core/${P.slug}.ts`), transformFrom239(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")));
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom239(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")));
  }
  const panel = path.join(ROOT, `components/app/${srcSlug}/AipifyEnterpriseOnboardingGuidedAdoptionEngineDashboardPanel.tsx`);
  write(
    path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`),
    transformFrom239(fs.readFileSync(panel, "utf8")),
  );
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`);
  write(path.join(ROOT, `app/app/${P.slug}/page.tsx`), transformFrom239(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")));
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom239(fs.readFileSync(path.join(ROOT, `app/api/aipify/${srcSlug}/${route}/route.ts`), "utf8")),
    );
  }
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports meeting preparation, note capture, summaries, action items, and accountability — does NOT bypass meeting RBAC, expose sensitive meeting content, or process recordings without explicit consent.

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
Era: ${P.era} (opening phase)
${P.crossLinkNote}
`,
  );
  write(
    path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
    `# ${P.title} Engine — FAQ (Phase ${P.phase})

## What is the Enterprise Meeting Intelligence & Collaboration Engine?

The Enterprise Meeting Intelligence & Collaboration Engine helps employees and leaders before, during, and after meetings at \`/app/${P.slug}\`.

## What meeting features are included?

Meeting preparation assistance, agenda generation, objective recommendations, note capture, summary generation, action item extraction, decision tracking, follow-up reminders, executive briefings, participant context, meeting search, and meeting history.

## What pre-meeting capabilities are included?

Generate agendas, surface relevant documents, display previous summaries, highlight unresolved action items, present participant context, and recommend preparation materials.

## What in-meeting capabilities are included?

Capture notes, organize discussion topics, identify decisions and commitments, and highlight follow-up requirements.

## What post-meeting capabilities are included?

Generate summaries, assign action items, notify responsible individuals, schedule follow-ups, archive approved summaries, and update related projects.

## What action management is included?

Create Action Center tasks, track completion status, escalate overdue commitments, and support accountability workflows.

## Who can access meeting intelligence?

Super Admin (full access), Tenant Admin (organization settings), Managers (department meetings), Employees (own and authorized meetings), Executives (executive meeting intelligence) — enterprise RBAC.

## Are meeting workflows audited?

**Yes.** Meeting visibility follows RBAC. Sensitive meetings may restrict AI processing. Organizations control retention policies.

## How does this integrate with other Aipify surfaces?

${P.crossLinkNote}

## Does the Meeting Companion replace user judgment?

**No.** ${P.companion} supports meeting clarity — it does **NOT** bypass meeting RBAC, expose sensitive meeting content, or process recordings without explicit consent.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Pre-meeting: agendas, documents, previous summaries, unresolved actions, participant context, prep materials.
In-meeting: note capture, discussion topics, decisions, commitments, follow-up requirements.
Post-meeting: summaries, action items, notifications, follow-ups, archive, project updates.
Action management: Action Center tasks, completion tracking, overdue escalation, accountability workflows.
Executive: briefings, strategic decisions, cross-meeting trends, commitment tracking, board prep.
Search: summaries, decisions, action items, participants, meeting topics.
Security: meeting visibility RBAC, sensitive meeting AI restrictions, retention policies, recording consent, audit logging.
Design principles: Preparation before meetings, accountability before ambiguity, visibility before volume.
Companion limitations: no bypassing meeting RBAC, no exposing sensitive content, no processing recordings without consent.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never bypasses meeting RBAC, exposes sensitive meeting content without authorization, or processes recordings without explicit consent.";
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
    c = c.replace('| "aipifyEnterpriseOnboardingGuidedAdoptionEngine"', `| "aipifyEnterpriseOnboardingGuidedAdoptionEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    const anchor = /id: "aipifyEnterpriseOnboardingGuidedAdoptionEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyEnterpriseOnboardingGuidedAdoptionEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-enterprise-onboarding-guided-adoption-engine")) {\n    return "aipifyEnterpriseOnboardingGuidedAdoptionEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-enterprise-onboarding-guided-adoption-engine")) {\n    return "aipifyEnterpriseOnboardingGuidedAdoptionEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_enterprise_onboarding_guided_adoption.steward",', `"aipify_enterprise_onboarding_guided_adoption.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-enterprise-onboarding-guided-adoption-engine";',
      `export * from "./aipify-enterprise-onboarding-guided-adoption-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports meeting preparation, note capture, summaries, action items, executive briefings, and meeting search. Supports accountability — does NOT bypass meeting RBAC. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Meeting intelligence score",
    modeLabel: "Mode",
    readinessLabel: "Meeting intelligence maturity level",
    executiveReviews: "Executive meeting briefings",
    activeReflections: "Active meeting intelligence scaffolds",
    humanOversightRequired: `Human oversight required — users retain meeting judgment control; ${P.companion} supports only`,
    eraOpenerSummary: `Guided Adoption Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate Calendar Assistant, Action Center, Notification Engine, Enterprise Search, Document Intelligence, Executive Cockpit, Knowledge Center, or Aipify Translate RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Meeting preparation hub — governance prompts",
    frameworkLabel: "Pre-meeting engine",
    reviewsLabel: "Meeting governance dashboard",
    companionLabel: `${P.companion} — supports meeting clarity, never replaces user meeting judgment`,
    subEngineLabel: "In-meeting engine",
    reflections: "Meeting intelligence scaffolds",
    executiveReviewEntries: "Executive meeting briefing entries",
    scaffoldNotes: "RBAC-protected meeting intelligence scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT bypass meeting RBAC, expose sensitive meeting content, or process recordings without explicit consent`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports meeting intelligence — users retain meeting judgment control and sensitive meetings stay protected.`,
      philosophy: "People First. RBAC-protected meeting intelligence scaffolds. Growth Partner terminology — never Affiliate.",
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
        ? "Møter"
        : locale === "sv"
          ? "Möten"
          : locale === "da"
            ? "Møder"
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
      'export * from "./implementation-blueprint-phase239-vocabulary";',
      `export * from "./implementation-blueprint-phase239-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE239_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase239-aipify-enterprise-onboarding-guided-adoption.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE239_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase239-aipify-enterprise-onboarding-guided-adoption.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_enterprise_onboarding_guided_adoption.view`, `aipify_enterprise_onboarding_guided_adoption.manage`, `aipify_enterprise_onboarding_guided_adoption.steward`.";
  const entry = `\n**Enterprise Meeting Intelligence & Collaboration Engine (Phase 240):** See [AIPIFY_ENTERPRISE_MEETING_INTELLIGENCE_COLLABORATION_ENGINE_PHASE240.md](./AIPIFY_ENTERPRISE_MEETING_INTELLIGENCE_COLLABORATION_ENGINE_PHASE240.md) — Meeting intelligence for preparation hub, pre/in/post-meeting engines, action management, executive briefings, governance, search, and integration center. Continues Guided Adoption Era (239–243). \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** bypassing meeting RBAC, exposing sensitive meeting content, or processing recordings without explicit consent. Cross-links only: Calendar Assistant Engine Phase 237, Action Center, Enterprise Notification Engine Phase 233, Enterprise Search Engine Phase 234, Document Intelligence Engine Phase 230, Executive Cockpit Phase 200, Knowledge Center, Aipify Translate Phase 238. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 240")) {
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
  console.error(`Phase ${P.phase} docs generated; stack requires Phase 239 artifacts: ${err.message}`);
  process.exitCode = 1;
}
