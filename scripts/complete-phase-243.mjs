#!/usr/bin/env node
/** ABOS Phase 243 — Mentorship & Knowledge Transfer Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "mentorship_transfer_dashboard",
  "mentor_mentee_matching_hub",
  "mentorship_types_engine",
  "knowledge_transfer_engine",
  "session_scheduling_engine",
  "mentorship_analytics_engine",
  "mentorship_governance_dashboard",
  "leadership_mentoring_engine",
  "mentorship_integration_center",
];

const P = {
  phase: 243,
  migration: "20261405000000_aipify_mentorship_knowledge_transfer_engine_phase243.sql",
  slug: "aipify-mentorship-knowledge-transfer-engine",
  base: "AipifyMentorshipKnowledgeTransfer",
  camel: "aipifyMentorshipKnowledgeTransferEngine",
  snake: "aipify_mentorship_knowledge_transfer",
  permPrefix: "aipify_mentorship_knowledge_transfer",
  helper: "amkte",
  bp: "amktebp243",
  decisionType: "aipify_mentorship_knowledge_transfer_engine",
  title: "Mentorship & Knowledge Transfer",
  centerTitle: "Mentorship & Knowledge Transfer",
  companion: "Mentorship Companion",
  scoreKey: "aipify_mentorship_knowledge_transfer_score",
  modeKey: "mentorship_knowledge_transfer_mode",
  levelKey: "mentorship_knowledge_transfer_maturity_level",
  thirdEntity: "mentorship_knowledge_transfer_notes",
  era: "Guided Adoption Era (239–243)",
  eraRange: "239–243",
  docSlug: "AIPIFY_MENTORSHIP_KNOWLEDGE_TRANSFER_ENGINE",
  ilmFile: "implementation-blueprint-phase243-aipify-mentorship-knowledge-transfer.txt",
  navLabel: "Mentorship",
  crossLinkNote:
    "Cross-links only: Employee Growth Engine Phase 219, Learning Center, Calendar Assistant Engine Phase 237, Enterprise Notification Engine Phase 233, Enterprise Analytics Engine Phase 235, Knowledge Center, and Aipify Translate Phase 238 — never bypass mentorship RBAC, expose personal development information without authorization, or ignore mentorship privacy preferences.",
  companionLimitations: [
    "bypassing_mentorship_rbac",
    "exposing_development_info_without_rbac",
    "ignoring_mentorship_privacy_preferences",
    "unlogged_mentorship_policy_changes",
    "replacing_human_mentorship_judgment",
    "modifying_mentorship_audit_trail",
    "forced_mentorship_matching_without_consent",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom242(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyEmployeeRecognitionCelebration", P.base],
    ["aipify-employee-recognition-celebration-engine", P.slug],
    ["aipify_employee_recognition_celebration", P.snake],
    ["aipifyEmployeeRecognitionCelebrationEngine", P.camel],
    ["aercebp242", P.bp],
    ["_aerce_", `_${P.helper}_`],
    ["aipify_employee_recognition_celebration_score", P.scoreKey],
    ["recognition_celebration_mode", P.modeKey],
    ["recognition_celebration_maturity_level", P.levelKey],
    ["recognition_celebration_notes", P.thirdEntity],
    ["RecognitionCelebrationNote", thirdPascal],
    ["recognition_celebration_notes_count", `${P.thirdEntity}_count`],
    ["Recognition Phase 242", "__RECOGNITION_PHASE_242__"],
    ["Recognition Companion", "__MENTORSHIP_COMPANION__"],
    ["Employee Recognition & Celebration", P.title],
    ["__MENTORSHIP_COMPANION__", P.companion],
    ["Recognition & Celebration", "__MENTORSHIP_CENTER__"],
    ["__RECOGNITION_PHASE_242__", "Recognition Phase 242"],
    ["Phase 242", `Phase ${P.phase}`],
    ["aipify_employee_recognition_celebration.view", `${P.permPrefix}.view`],
    ["aipify_employee_recognition_celebration.manage", `${P.permPrefix}.manage`],
    ["aipify_employee_recognition_celebration.steward", `${P.permPrefix}.steward`],
    ["aipify_employee_recognition_celebration_engine", P.decisionType],
    ["20261404000000_aipify_employee_recognition_celebration_engine_phase242.sql", P.migration],
    ["Repo Phase 242", `Repo Phase ${P.phase}`],
    ["Phase 242 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE242_AIPIFY_EMPLOYEE_RECOGNITION_CELEBRATION_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase242", `implementation-blueprint-phase${P.phase}`],
    ["recognition_celebration_dashboard", SCAFFOLDS[0]],
    ["recognition_feed_hub", SCAFFOLDS[1]],
    ["recognition_types_engine", SCAFFOLDS[2]],
    ["celebration_events_engine", SCAFFOLDS[3]],
    ["celebration_reminders_engine", SCAFFOLDS[4]],
    ["recognition_analytics_engine", SCAFFOLDS[5]],
    ["recognition_governance_dashboard", SCAFFOLDS[6]],
    ["executive_recognition_engine", SCAFFOLDS[7]],
    ["recognition_integration_center", SCAFFOLDS[8]],
    ["recognition_companion", "mentorship_companion"],
    ["_seed_recognition_celebration_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["recognition celebration stewardship", "mentorship knowledge transfer stewardship"],
    ["recognition-informed decision support", "mentorship-informed decision support"],
    ["appreciation-first recognition culture", "growth-first mentorship culture"],
    ["active recognition programs", "active mentorship programs"],
    ["recognition opportunities requiring attention", "mentorship gaps requiring attention"],
    ["Recognition Feed Hub", "Mentor-Mentee Matching Hub"],
    ["Recognition Types Engine", "Mentorship Types Engine"],
    ["Celebration Events Engine", "Knowledge Transfer Engine"],
    ["Celebration Reminders Engine", "Session Scheduling Engine"],
    ["Recognition Analytics Engine", "Mentorship Analytics Engine"],
    ["Recognition Governance Dashboard", "Mentorship Governance Dashboard"],
    ["recognition celebration indicators", "mentorship transfer indicators"],
    ["recognition governance prompts", "mentorship governance prompts"],
    ["recognition assistant prompts", "mentorship assistant prompts"],
    ["executive recognition programs", "leadership mentoring programs"],
    ["celebration completion signals", "mentorship progress signals"],
    ["RBAC-protected recognition policies", "RBAC-protected mentorship policies"],
    ["Appreciation before anonymity", "Growth before isolation"],
    ["Culture before ceremony", "Knowledge before loss"],
    ["Recognition before retention risk", "Consent before matching"],
    ["no_bypassing_recognition_rbac", "no_bypassing_mentorship_rbac"],
    ["AIPIFY_EMPLOYEE_RECOGNITION_CELEBRATION_ENGINE", P.docSlug],
    ["employee recognition and celebration", "mentorship and knowledge transfer"],
    ["Recognition celebration audit logs", "Mentorship knowledge transfer audit logs"],
    ["recognition visibility RBAC", "mentorship RBAC"],
    ["recognition celebration scaffolds", "mentorship transfer scaffolds"],
    ["organization recognition policies", "organization mentorship policies"],
    ["Recognition celebration score", "Mentorship transfer score"],
    ["Recognition celebration maturity level", "Mentorship transfer maturity level"],
    ["Executive recognition entries", "Leadership mentoring entries"],
    ["recognition celebration", "mentorship knowledge transfer"],
    ["personal celebration preference stewardship", "mentorship privacy preference stewardship"],
    ["recognition content beyond RBAC", "development information beyond RBAC"],
    ["cross-team recognition assistance", "cross-functional mentoring assistance"],
    ["executive recognition reviews", "leadership mentoring reviews"],
    [
      "Enterprise Notification Engine Phase 233, Calendar Assistant Engine Phase 237, Employee Growth Engine Phase 219, Learning Center, Enterprise Analytics Engine Phase 235, and Aipify Translate Phase 238",
      "Employee Growth Engine Phase 219, Learning Center, Calendar Assistant Engine Phase 237, Enterprise Notification Engine Phase 233, Enterprise Analytics Engine Phase 235, Knowledge Center, and Aipify Translate Phase 238",
    ],
    [
      "Never bypass recognition RBAC or expose recognition without authorization",
      "Never bypass mentorship RBAC or expose personal development information without authorization",
    ],
    ["recognition programs", "mentorship programs"],
    ["Recognition programs", "Mentorship programs"],
    ["confidential recognition visibility routing", "confidential development information routing"],
    ["exposes recognition without RBAC approval", "exposes development information without RBAC approval"],
    ["Unauthorized recognition access without RBAC approval", "Unauthorized mentorship access without RBAC approval"],
    ["Modifying recognition audit trails", "Modifying mentorship audit trails"],
    ["Anonymity before appreciation", "Isolation before growth"],
    ["user recognition judgment control", "user mentorship judgment control"],
    ["User recognition judgment control", "User mentorship judgment control"],
    ["recognition decisions and celebration policy", "mentorship decisions and privacy policy"],
    ["recognition celebration visibility", "mentorship program visibility"],
    ["recognition celebration governance", "mentorship knowledge transfer governance"],
    [
      "enable organizations to strengthen culture, engagement and appreciation through structured recognition and milestone celebrations — maintaining recognition visibility RBAC, personal celebration preferences, balanced recognition encouragement, and complete audit history",
      "enable organizations to preserve institutional knowledge, accelerate employee growth and strengthen collaboration through structured mentorship programs — maintaining mentorship RBAC, personal development information protection, mentorship privacy preferences, and complete audit history",
    ],
    [
      "employee engagement increases, workplace satisfaction improves, recognition participation rises, organizational culture strengthens, retention indicators improve, and collaboration increases with appreciation before anonymity",
      "mentorship participation increases, employee development accelerates, knowledge retention improves, onboarding time reduces, succession readiness improves, and employee satisfaction increases with growth before isolation",
    ],
    ["continues Guided Adoption Era", "closes Guided Adoption Era"],
    ["__MENTORSHIP_CENTER__", P.centerTitle],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports mentorship and knowledge transfer — NOT bypassing mentorship RBAC, exposing personal development information without authorization, or ignoring mentorship privacy preferences. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Enable organizations to preserve institutional knowledge, accelerate employee growth and strengthen collaboration through structured mentorship programs — ${P.companion} informs, humans decide.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Guided Adoption Era (${P.eraRange}). Human-stewarded mentorship governance; RBAC-protected transfer scaffolds; mentorship policy changes logged; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations increase mentorship participation, accelerate employee development, improve knowledge retention, reduce onboarding time, improve succession readiness, and increase employee satisfaction with growth before isolation.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Ten mentorship modules with governance'),
    jsonb_build_object('key', 'mentor_mentee_matching_hub', 'label', 'Mentor-mentee matching hub', 'emoji', '📋', 'description', 'Registration, matching, department programs'),
    jsonb_build_object('key', 'mentorship_types_engine', 'label', 'Mentorship types engine', 'emoji', '🏆', 'description', 'Peer, leadership, executive, technical, onboarding'),
    jsonb_build_object('key', 'knowledge_transfer_engine', 'label', 'Knowledge transfer engine', 'emoji', '🔗', 'description', 'Expertise capture, best practices, role knowledge'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not replace human mentorship judgment'),
    jsonb_build_object('key', 'mentorship_analytics_engine', 'label', 'Mentorship analytics engine', 'emoji', '📊', 'description', 'Progress, participation, feedback'),
    jsonb_build_object('key', 'mentorship_governance_dashboard', 'label', 'Mentorship governance dashboard', 'emoji', '🛡️', 'description', 'RBAC and privacy preferences'),
    jsonb_build_object('key', 'session_scheduling', 'label', 'Session scheduling engine', 'emoji', '🔔', 'description', 'Sessions, goals, feedback collection')
  ); ${D};
create or replace function public._${bp}_mentorship_transfer_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — ten capabilities. Growth before isolation.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'mentorship_transfer_dashboard', 'label', 'Mentorship Dashboard'),
    jsonb_build_object('key', 'mentor_registration', 'label', 'Mentor Registration'),
    jsonb_build_object('key', 'mentee_registration', 'label', 'Mentee Registration'),
    jsonb_build_object('key', 'mentor_mentee_matching', 'label', 'Mentor-Mentee Matching'),
    jsonb_build_object('key', 'department_programs', 'label', 'Department Mentorship Programs'),
    jsonb_build_object('key', 'leadership_programs', 'label', 'Leadership Mentoring Programs'),
    jsonb_build_object('key', 'cross_functional_mentoring', 'label', 'Cross-Functional Mentoring'),
    jsonb_build_object('key', 'goal_setting', 'label', 'Mentorship Goal Setting & Progress Tracking'),
    jsonb_build_object('key', 'session_scheduling', 'label', 'Session Scheduling & Knowledge Transfer Planning'),
    jsonb_build_object('key', 'mentorship_analytics', 'label', 'Mentorship Analytics & Feedback Collection')
  )); ${D};
create or replace function public._${bp}_mentor_mentee_matching_hub() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Mentor-mentee matching — consent before matching.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'mentorship_rbac', 'label', 'Do mentorship conversations follow RBAC policies?'),
    jsonb_build_object('key', 'development_privacy', 'label', 'Is personal development information protected?'),
    jsonb_build_object('key', 'privacy_preferences', 'label', 'Are mentorship privacy preferences respected?'),
    jsonb_build_object('key', 'consent_matching', 'label', 'Is mentor-mentee matching consent-based?'),
    jsonb_build_object('key', 'governance', 'label', 'How does governance support growth without pressure?')
  )); ${D};
create or replace function public._${bp}_mentorship_types_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Mentorship types — knowledge before loss.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'peer_mentoring', 'label', 'Peer mentoring'),
    jsonb_build_object('key', 'leadership_mentoring', 'label', 'Leadership mentoring'),
    jsonb_build_object('key', 'executive_mentoring', 'label', 'Executive mentoring'),
    jsonb_build_object('key', 'technical_mentoring', 'label', 'Technical mentoring'),
    jsonb_build_object('key', 'career_development', 'label', 'Career development mentoring'),
    jsonb_build_object('key', 'onboarding_mentoring', 'label', 'Onboarding mentoring'),
    jsonb_build_object('key', 'cross_department', 'label', 'Cross-department mentoring'),
    jsonb_build_object('key', 'custom_programs', 'label', 'Custom organizational programs')
  )); ${D};
create or replace function public._${bp}_leadership_mentoring_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Leadership mentoring — strategic growth stewardship.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'leadership_programs', 'label', 'Leadership mentoring programs'),
    jsonb_build_object('key', 'executive_mentoring', 'label', 'Executive mentoring oversight'),
    jsonb_build_object('key', 'department_oversight', 'label', 'Department mentorship oversight'),
    jsonb_build_object('key', 'progress_tracking', 'label', 'Mentorship progress tracking'),
    jsonb_build_object('key', 'feedback_collection', 'label', 'Mentorship feedback collection'),
    jsonb_build_object('key', 'succession_support', 'label', 'Succession planning support')
  )); ${D};
create or replace function public._${bp}_mentorship_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports mentorship clarity and never bypasses mentorship RBAC or ignores privacy preferences.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'recommend_matches', 'label', 'Recommend mentor matches'),
    jsonb_build_object('key', 'suggest_topics', 'label', 'Suggest mentorship topics'),
    jsonb_build_object('key', 'surface_isolation_risk', 'label', 'Surface employees at risk of knowledge isolation'),
    jsonb_build_object('key', 'identify_knowledge_holders', 'label', 'Identify critical knowledge holders'),
    jsonb_build_object('key', 'encourage_engagement', 'label', 'Encourage regular mentorship engagement'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Mentorship RBAC — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_knowledge_transfer_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Knowledge transfer — preserve institutional knowledge.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'capture_expertise', 'label', 'Capture critical expertise'),
    jsonb_build_object('key', 'document_practices', 'label', 'Document best practices'),
    jsonb_build_object('key', 'role_knowledge', 'label', 'Transfer role-specific knowledge'),
    jsonb_build_object('key', 'identify_gaps', 'label', 'Identify knowledge gaps'),
    jsonb_build_object('key', 'preserve_knowledge', 'label', 'Preserve institutional knowledge'),
    jsonb_build_object('key', 'succession_support', 'label', 'Support succession planning')
  )); ${D};
create or replace function public._${bp}_session_scheduling_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Session scheduling — regular engagement without pressure.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'session_scheduling', 'label', 'Mentorship session scheduling'),
    jsonb_build_object('key', 'goal_setting', 'label', 'Mentorship goal setting'),
    jsonb_build_object('key', 'progress_tracking', 'label', 'Progress tracking follow-ups'),
    jsonb_build_object('key', 'transfer_planning', 'label', 'Knowledge transfer planning'),
    jsonb_build_object('key', 'feedback_collection', 'label', 'Mentorship feedback collection'),
    jsonb_build_object('key', 'calendar_integration', 'label', 'Calendar Assistant integration — cross-link only')
  )); ${D};
create or replace function public._${bp}_mentorship_analytics_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Mentorship analytics — participation and retention visibility.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'participation_rates', 'label', 'Mentorship participation rates'),
    jsonb_build_object('key', 'development_speed', 'label', 'Employee development acceleration'),
    jsonb_build_object('key', 'knowledge_retention', 'label', 'Knowledge retention signals'),
    jsonb_build_object('key', 'onboarding_time', 'label', 'Onboarding time reduction'),
    jsonb_build_object('key', 'succession_readiness', 'label', 'Succession readiness improvement'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Mentorship audit visibility respects role permissions')
  )); ${D};
create or replace function public._${bp}_mentorship_governance_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Mentorship governance — organizations control mentorship policies.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'mentorship_rbac', 'label', 'Mentorship conversations follow RBAC policies'),
    jsonb_build_object('key', 'development_privacy', 'label', 'Personal development information remains protected'),
    jsonb_build_object('key', 'privacy_preferences', 'label', 'Mentorship privacy preferences respected'),
    jsonb_build_object('key', 'manager_oversight', 'label', 'Manager department mentorship oversight'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Manager, Mentor, Employee tiers'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for mentorship policy changes')
  )); ${D};
create or replace function public._${bp}_mentorship_integration_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Mentorship integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'employee_growth', 'label', 'Employee Growth Engine Phase 219', 'cross_link', '/app/aipify-employee-growth-career-development-engine'),
    jsonb_build_object('key', 'learning_center', 'label', 'Learning Center', 'cross_link', '/app/aipify-enterprise-training-certification-engine'),
    jsonb_build_object('key', 'calendar_assistant', 'label', 'Calendar Assistant Engine Phase 237', 'cross_link', '/app/aipify-enterprise-calendar-personal-assistant-engine'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'enterprise_analytics', 'label', 'Enterprise Analytics Engine Phase 235', 'cross_link', '/app/aipify-enterprise-analytics-operational-intelligence-engine'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'cross_link', '/app/aipify-enterprise-knowledge-center-engine'),
    jsonb_build_object('key', 'aipify_translate', 'label', 'Aipify Translate Phase 238', 'cross_link', '/app/aipify-translate-multilingual-workforce-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for mentorship integration actions')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing mentorship RBAC',
      'Exposing personal development information without authorization',
      'Ignoring mentorship privacy preferences',
      'Replacing human mentorship judgment',
      'Modifying mentorship audit trails',
      'Unlogged mentorship policy changes',
      'Forced mentorship matching without consent',
      'Override human judgment'), 'principle', '${P.companion} supports — users retain mentorship judgment control and development information stays protected.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm mentorship support without performance pressure.', 'values', jsonb_build_array('growth_before_isolation','knowledge_before_loss','consent_before_matching','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Mentorship knowledge transfer audit logs via aipify_mentorship_knowledge_transfer_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_mentorship_knowledge_transfer permissions — mentorship RBAC'),
    jsonb_build_object('key', 'mentorship_rbac', 'label', 'Mentorship conversations follow RBAC policies'),
    jsonb_build_object('key', 'development_privacy', 'label', 'Personal development information must remain protected'),
    jsonb_build_object('key', 'privacy_preferences', 'label', 'Mentorship privacy preferences must be respected'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 242, 'key', 'employee_recognition_celebration', 'label', 'Recognition Phase 242', 'route', '/app/aipify-employee-recognition-celebration-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 243, 'key', 'mentorship_knowledge_transfer', 'label', 'Mentorship Phase 243', 'route', '/app/${P.slug}', 'description', 'Human-stewarded mentorship and knowledge transfer — closes Guided Adoption Era')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'employee_growth', 'label', 'Employee Growth Engine Phase 219', 'route', '/app/aipify-employee-growth-career-development-engine', 'relationship', 'Employee Growth integration — cross-link only'),
    jsonb_build_object('key', 'learning_center', 'label', 'Learning Center', 'route', '/app/aipify-enterprise-training-certification-engine', 'relationship', 'Learning Center integration — cross-link only'),
    jsonb_build_object('key', 'calendar_assistant', 'label', 'Calendar Assistant Phase 237', 'route', '/app/aipify-enterprise-calendar-personal-assistant-engine', 'relationship', 'Calendar integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Growth before isolation — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with RBAC-protected mentorship scaffolds and development information privacy protections. Growth Partner terminology. ${P.companion} supports — never bypasses mentorship RBAC or ignores privacy preferences.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — users retain mentorship judgment control.', '${P.companion} informs and supports.', 'Growth before isolation — knowledge before loss.', 'Growth Partner — never Affiliate.', 'Guided Adoption Era — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — mentorship signals max ~500 chars. No development content beyond RBAC or PII in audit logs.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_employee_recognition_celebration_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._aercebp242_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_mentor_mentee_matching_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Mentor-mentee matching hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_mentor_mentee_matching_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_recognition_feed_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Mentor-mentee matching hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_mentor_mentee_matching_hub()->'reflection_questions') = 5,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_mentorship_transfer_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Mentorship & Knowledge Transfer — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_mentorship_transfer_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_recognition_celebration_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Mentorship & Knowledge Transfer — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_mentorship_transfer_dashboard()->'capabilities') = 10,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  for (const fn of [...SCAFFOLDS, "mentorship_companion"]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${P.bp}_${fn}()`);
  }

  sql = sql.replace(
    /select 'aipify-employee-recognition-celebration-engine'[^;]+;/g,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected employee recognition and celebration guidance within Guided Adoption Era;",
    "RBAC-protected mentorship and knowledge transfer guidance within Guided Adoption Era;",
  );
  sql = sql.replace(
    /Phase 243 Mentorship & Knowledge Transfer Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 242 Employee Recognition & Celebration Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );

  sql = sql.replace(
    /'authenticated', 242\nwhere not exists \(select 1 from public\.aipify_knowledge_categories where slug = 'aipify-employee-recognition-celebration-engine'/,
    `'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-employee-recognition-celebration-engine'`,
  );

  return sql;
}

function genMigration() {
  const src242 = path.join(ROOT, "supabase/migrations/20261404000000_aipify_employee_recognition_celebration_engine_phase242.sql");
  if (!fs.existsSync(src242)) throw new Error("Phase 242 migration required");
  let m = transformFrom242(fs.readFileSync(src242, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-employee-recognition-celebration-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(path.join(ROOT, `lib/core/${P.slug}.ts`), transformFrom242(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")));
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom242(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")));
  }
  const panel = path.join(ROOT, `components/app/${srcSlug}/AipifyEmployeeRecognitionCelebrationEngineDashboardPanel.tsx`);
  write(
    path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`),
    transformFrom242(fs.readFileSync(panel, "utf8")),
  );
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`);
  write(path.join(ROOT, `app/app/${P.slug}/page.tsx`), transformFrom242(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")));
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom242(fs.readFileSync(path.join(ROOT, `app/api/aipify/${srcSlug}/${route}/route.ts`), "utf8")),
    );
  }
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports mentor registration, mentee registration, matching, department and leadership programs, cross-functional mentoring, goal setting, progress tracking, session scheduling, knowledge transfer planning, analytics, and feedback — does NOT bypass mentorship RBAC, expose personal development information without authorization, or ignore mentorship privacy preferences.

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

## What is the Mentorship & Knowledge Transfer Engine?

The Mentorship & Knowledge Transfer Engine helps organizations preserve institutional knowledge and accelerate employee growth at \`/app/${P.slug}\`.

## What mentorship features are included?

Mentor registration, mentee registration, mentor-mentee matching, department mentorship programs, leadership mentoring programs, cross-functional mentoring, mentorship goal setting, progress tracking, session scheduling, knowledge transfer planning, mentorship analytics, and feedback collection.

## What mentorship types are supported?

Peer mentoring, leadership mentoring, executive mentoring, technical mentoring, career development mentoring, onboarding mentoring, and cross-department mentoring.

## What knowledge transfer capabilities are included?

Capture critical expertise, document best practices, transfer role-specific knowledge, identify knowledge gaps, preserve institutional knowledge, and support succession planning.

## What intelligence features are included?

Recommend mentor matches, suggest mentorship topics, surface employees at risk of knowledge isolation, identify critical knowledge holders, and encourage regular mentorship engagement.

## Who can access mentorship programs?

Super Admin (full access), Tenant Admin (organization mentorship settings), Managers (department oversight), Mentors (assigned activities), Employees (participation) — enterprise RBAC.

## Is personal development information protected?

**Yes.** Mentorship conversations follow RBAC policies. Personal development information remains protected. Mentorship privacy preferences are respected.

## How does this integrate with other Aipify surfaces?

${P.crossLinkNote}

## Does the Mentorship Companion replace human judgment?

**No.** ${P.companion} supports mentorship clarity — it does **NOT** bypass mentorship RBAC, expose personal development information without authorization, or ignore mentorship privacy preferences.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Mentorship: mentor/mentee registration, matching, department programs, leadership programs, cross-functional mentoring, goals, progress, sessions, knowledge transfer, analytics, feedback.
Types: peer, leadership, executive, technical, career development, onboarding, cross-department.
Knowledge transfer: capture expertise, best practices, role knowledge, gap identification, institutional knowledge, succession support.
Intelligence: recommend matches, suggest topics, isolation risk, knowledge holders, engagement encouragement.
Security: mentorship RBAC, development privacy, privacy preferences, audit logging, enterprise permissions, 2FA.
Design principles: Growth before isolation, knowledge before loss, consent before matching.
Companion limitations: no bypassing mentorship RBAC, no exposing development info, no forced matching without consent.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never bypasses mentorship RBAC, exposes personal development information without authorization, or ignores mentorship privacy preferences.";
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
    c = c.replace('| "aipifyEmployeeRecognitionCelebrationEngine"', `| "aipifyEmployeeRecognitionCelebrationEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    const anchor = /id: "aipifyEmployeeRecognitionCelebrationEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyEmployeeRecognitionCelebrationEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-employee-recognition-celebration-engine")) {\n    return "aipifyEmployeeRecognitionCelebrationEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-employee-recognition-celebration-engine")) {\n    return "aipifyEmployeeRecognitionCelebrationEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_employee_recognition_celebration.steward",', `"aipify_employee_recognition_celebration.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-employee-recognition-celebration-engine";',
      `export * from "./aipify-employee-recognition-celebration-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports mentor registration, matching, department and leadership programs, goal setting, session scheduling, knowledge transfer, and analytics. Closes Guided Adoption Era — does NOT bypass mentorship RBAC. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Mentorship transfer score",
    modeLabel: "Mode",
    readinessLabel: "Mentorship transfer maturity level",
    executiveReviews: "Leadership mentoring programs",
    activeReflections: "Active mentorship transfer scaffolds",
    humanOversightRequired: `Human oversight required — users retain mentorship judgment control; ${P.companion} supports only`,
    eraOpenerSummary: `Guided Adoption Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate Employee Growth, Learning Center, Calendar Assistant, Notification Engine, Analytics Engine, Knowledge Center, or Aipify Translate RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Mentor-mentee matching hub — governance prompts",
    frameworkLabel: "Mentorship types engine",
    reviewsLabel: "Mentorship governance dashboard",
    companionLabel: `${P.companion} — supports mentorship clarity, never replaces human mentorship judgment`,
    subEngineLabel: "Knowledge transfer engine",
    reflections: "Mentorship transfer scaffolds",
    executiveReviewEntries: "Leadership mentoring entries",
    scaffoldNotes: "RBAC-protected mentorship transfer scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT bypass mentorship RBAC, expose personal development information without authorization, or ignore mentorship privacy preferences`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports mentorship and knowledge transfer — users retain mentorship judgment control and development information stays protected.`,
      philosophy: "People First. RBAC-protected mentorship transfer scaffolds. Growth Partner terminology — never Affiliate.",
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
        ? "Mentorskap"
        : locale === "sv"
          ? "Mentorskap"
          : locale === "da"
            ? "Mentorskab"
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
      'export * from "./implementation-blueprint-phase242-vocabulary";',
      `export * from "./implementation-blueprint-phase242-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE242_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase242-aipify-employee-recognition-celebration.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE242_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase242-aipify-employee-recognition-celebration.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_employee_recognition_celebration.view`, `aipify_employee_recognition_celebration.manage`, `aipify_employee_recognition_celebration.steward`.";
  const entry = `\n**Mentorship & Knowledge Transfer Engine (Phase 243):** See [AIPIFY_MENTORSHIP_KNOWLEDGE_TRANSFER_ENGINE_PHASE243.md](./AIPIFY_MENTORSHIP_KNOWLEDGE_TRANSFER_ENGINE_PHASE243.md) — Mentor/mentee registration, matching, department and leadership programs, cross-functional mentoring, goal setting, progress tracking, session scheduling, knowledge transfer planning, analytics, and feedback. Closes Guided Adoption Era (239–243). \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** bypassing mentorship RBAC, exposing personal development information without authorization, or ignoring mentorship privacy preferences. Cross-links only: Employee Growth Engine Phase 219, Learning Center, Calendar Assistant Engine Phase 237, Enterprise Notification Engine Phase 233, Enterprise Analytics Engine Phase 235, Knowledge Center, Aipify Translate Phase 238. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 243")) {
    const idx = c.lastIndexOf(marker);
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
  console.error(`Phase ${P.phase} docs generated; stack requires Phase 242 artifacts: ${err.message}`);
  process.exitCode = 1;
}
