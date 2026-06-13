#!/usr/bin/env node
/** ABOS Phase 239 — Enterprise Onboarding & Guided Adoption Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "onboarding_adoption_dashboard",
  "onboarding_journey_hub",
  "role_based_experience_engine",
  "department_path_engine",
  "guided_tour_engine",
  "milestone_celebration_engine",
  "adoption_governance_dashboard",
  "adoption_analytics_engine",
  "onboarding_integration_center",
];

const P = {
  phase: 239,
  migration: "20261400000000_aipify_enterprise_onboarding_guided_adoption_engine_phase239.sql",
  slug: "aipify-enterprise-onboarding-guided-adoption-engine",
  base: "AipifyEnterpriseOnboardingGuidedAdoption",
  camel: "aipifyEnterpriseOnboardingGuidedAdoptionEngine",
  snake: "aipify_enterprise_onboarding_guided_adoption",
  permPrefix: "aipify_enterprise_onboarding_guided_adoption",
  helper: "aeogae",
  bp: "aeogaebp239",
  decisionType: "aipify_enterprise_onboarding_guided_adoption_engine",
  title: "Enterprise Onboarding & Guided Adoption",
  centerTitle: "Onboarding",
  companion: "Adoption Companion",
  scoreKey: "aipify_enterprise_onboarding_guided_adoption_score",
  modeKey: "guided_adoption_mode",
  levelKey: "onboarding_maturity_level",
  thirdEntity: "guided_adoption_notes",
  era: "Guided Adoption Era (239–243)",
  eraRange: "239–243",
  docSlug: "AIPIFY_ENTERPRISE_ONBOARDING_GUIDED_ADOPTION_ENGINE",
  ilmFile: "implementation-blueprint-phase239-aipify-enterprise-onboarding-guided-adoption.txt",
  navLabel: "Onboarding",
  crossLinkNote:
    "Cross-links only: Learning Center, Knowledge Center, Enterprise Notification Engine Phase 233, Executive Cockpit Phase 200, Communication Center, Enterprise Analytics Engine Phase 235, and Aipify Translate Phase 238 — never bypass onboarding RBAC, expose organization onboarding content without authorization, or override adoption policies.",
  companionLimitations: [
    "bypassing_onboarding_rbac",
    "exposing_org_onboarding_content_without_rbac",
    "unlogged_onboarding_policy_changes",
    "replacing_manager_onboarding_judgment",
    "modifying_onboarding_audit_trail",
    "forcing_onboarding_without_consent",
    "overriding_org_adoption_policies",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom238(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyTranslateMultilingualWorkforce", P.base],
    ["aipify-translate-multilingual-workforce-engine", P.slug],
    ["aipify_translate_multilingual_workforce", P.snake],
    ["aipifyTranslateMultilingualWorkforceEngine", P.camel],
    ["atmwfebp238", P.bp],
    ["_atmwfe_", `_${P.helper}_`],
    ["aipify_translate_multilingual_workforce_score", P.scoreKey],
    ["multilingual_workforce_mode", P.modeKey],
    ["translate_maturity_level", P.levelKey],
    ["multilingual_workforce_notes", P.thirdEntity],
    ["MultilingualWorkforceNote", thirdPascal],
    ["multilingual_workforce_notes_count", `${P.thirdEntity}_count`],
    ["Translate Phase 238", "__TRANSLATE_PHASE_238__"],
    ["Translation Companion", "__ADOPTION_COMPANION__"],
    ["Translate & Multilingual Workforce", P.title],
    ["__ADOPTION_COMPANION__", P.companion],
    ["__TRANSLATE_CENTER__", P.centerTitle],
    ["Translate", "__TRANSLATE_CENTER__"],
    ["__TRANSLATE_PHASE_238__", "Translate Phase 238"],
    ["Translate & Multilingual Workforce", P.title],
    ["Phase 238", `Phase ${P.phase}`],
    ["aipify_translate_multilingual_workforce.view", `${P.permPrefix}.view`],
    ["aipify_translate_multilingual_workforce.manage", `${P.permPrefix}.manage`],
    ["aipify_translate_multilingual_workforce.steward", `${P.permPrefix}.steward`],
    ["aipify_translate_multilingual_workforce_engine", P.decisionType],
    ["20261399000000_aipify_translate_multilingual_workforce_engine_phase238.sql", P.migration],
    ["Repo Phase 238", `Repo Phase ${P.phase}`],
    ["Phase 238 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE238_AIPIFY_TRANSLATE_MULTILINGUAL_WORKFORCE_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase238", `implementation-blueprint-phase${P.phase}`],
    ["translate_workforce_dashboard", SCAFFOLDS[0]],
    ["language_settings_hub", SCAFFOLDS[1]],
    ["realtime_translation_engine", SCAFFOLDS[2]],
    ["document_translation_engine", SCAFFOLDS[3]],
    ["knowledge_translation_engine", SCAFFOLDS[4]],
    ["workforce_translation_engine", SCAFFOLDS[5]],
    ["language_governance_dashboard", SCAFFOLDS[6]],
    ["broadcast_translation_engine", SCAFFOLDS[7]],
    ["translate_integration_center", SCAFFOLDS[8]],
    ["translation_companion", "adoption_companion"],
    ["_seed_multilingual_workforce_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["multilingual workforce stewardship", "guided adoption stewardship"],
    ["language-aware decision support", "adoption-informed decision support"],
    ["inclusion-first multilingual culture", "guidance-first adoption culture"],
    ["active language packs", "active onboarding journeys"],
    ["translations requiring review", "onboarding steps requiring attention"],
    ["Language Settings Hub", "Onboarding Journey Hub"],
    ["Real-Time Translation Engine", "Role-Based Experience Engine"],
    ["Document Translation Engine", "Department Path Engine"],
    ["Knowledge Translation Engine", "Guided Tour Engine"],
    ["Workforce Translation Engine", "Milestone Celebration Engine"],
    ["Language Governance Dashboard", "Adoption Governance Dashboard"],
    ["translation workforce indicators", "guided adoption indicators"],
    ["language governance prompts", "adoption governance prompts"],
    ["translation assistant prompts", "onboarding assistant prompts"],
    ["executive summary translations", "manager onboarding summaries"],
    ["translation completeness signals", "adoption completion signals"],
    ["RBAC-protected language policies", "RBAC-protected onboarding policies"],
    ["Understanding before automation", "Adoption before abandonment"],
    ["Inclusion before exclusion", "Guidance before overwhelm"],
    ["Presentation before storage", "Progress before pressure"],
    ["no_bypassing_translation_rbac", "no_bypassing_onboarding_rbac"],
    ["AIPIFY_TRANSLATE_MULTILINGUAL_WORKFORCE_ENGINE", P.docSlug],
    ["translate and multilingual workforce", "enterprise onboarding and guided adoption"],
    ["Multilingual workforce audit logs", "Guided adoption audit logs"],
    ["translation history RBAC", "onboarding progress RBAC"],
    ["translate workforce scaffolds", "onboarding adoption scaffolds"],
    ["organization language policies", "organization onboarding policies"],
    ["Translate workforce score", "Onboarding adoption score"],
    ["Translate maturity level", "Onboarding maturity level"],
    ["Language pack review entries", "Milestone celebration entries"],
    ["translate workforce", "guided adoption"],
    ["sensitive content protection stewardship", "onboarding content protection stewardship"],
    ["sensitive content beyond RBAC", "org onboarding content beyond RBAC"],
    ["cross-language broadcast assistance", "cross-role onboarding assistance"],
    ["translation quality reviews", "manager onboarding dashboard reviews"],
    [
      "Knowledge Center, Communication Center, Enterprise Notification Engine Phase 233, Document Intelligence Engine Phase 230, Meeting Intelligence Engine, Enterprise Search Engine Phase 234, Executive Cockpit Phase 200, and Desktop Companion Phase 236",
      "Learning Center, Knowledge Center, Enterprise Notification Engine Phase 233, Executive Cockpit Phase 200, Communication Center, Enterprise Analytics Engine Phase 235, and Aipify Translate Phase 238",
    ],
    [
      "Knowledge Center, Communication Center, Enterprise Notification Engine Phase 233, Document Intelligence Engine, Meeting Intelligence Engine, Enterprise Search Engine Phase 234, Executive Cockpit Phase 200, and Desktop Companion Phase 236",
      "Learning Center, Knowledge Center, Enterprise Notification Engine Phase 233, Executive Cockpit Phase 200, Communication Center, Enterprise Analytics Engine Phase 235, and Aipify Translate Phase 238",
    ],
    [
      "Never bypass translation RBAC or expose sensitive content in translation workflows",
      "Never bypass onboarding RBAC or expose organization onboarding content without authorization",
    ],
    ["translation workflows", "onboarding journeys"],
    ["Translation workflows", "Onboarding journeys"],
    ["confidential translation history routing", "confidential onboarding progress routing"],
    ["translates sensitive content without RBAC approval", "exposes onboarding content without RBAC approval"],
    ["Unauthorized translation history access without RBAC approval", "Unauthorized onboarding progress access without RBAC approval"],
    ["Modifying translation audit trails", "Modifying onboarding audit trails"],
    ["Exclusion before inclusion", "Abandonment before adoption"],
    ["user language preference control", "user onboarding pace control"],
    ["User language preference control", "User onboarding pace control"],
    ["translation decisions and language policy accountability", "adoption decisions and onboarding policy accountability"],
    ["multilingual workforce visibility", "guided adoption visibility"],
    ["multilingual workforce governance", "guided adoption governance"],
    [
      "enable Aipify to remove language barriers within organizations by providing intelligent translation capabilities across the entire Aipify ecosystem — maintaining presentation-level translation, English fallback, organization language policies, RBAC-protected translation history, and complete audit history",
      "enable organizations to rapidly onboard employees, departments and new customers while maximizing Aipify adoption and long-term success — maintaining interactive journeys, role-based experiences, RBAC-protected onboarding progress, organization onboarding content protection, and complete audit history",
    ],
    [
      "multilingual adoption increases, communication barriers decrease, employee engagement improves, Knowledge Center accessibility increases, and international employees onboard faster with understanding before automation",
      "time-to-value decreases, Aipify adoption increases, onboarding completion improves, support requests decrease, employee confidence increases, and customer satisfaction improves with adoption before abandonment",
    ],
    ["Universal Knowledge Era (234–238)", P.era],
    ["234–238", P.eraRange],
    ["Translate Phase 239", "Translate Phase 238"],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports guided adoption capabilities — NOT bypassing onboarding RBAC, exposing organization onboarding content without authorization, or overriding adoption policies. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Enable organizations to rapidly onboard employees, departments and new customers while maximizing Aipify adoption and long-term success — ${P.companion} guides, humans decide.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Guided Adoption Era (${P.eraRange}). Human-stewarded adoption governance; RBAC-protected onboarding scaffolds; onboarding policy changes logged; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations achieve faster time-to-value, increased Aipify adoption, improved onboarding completion, reduced support requests, and higher employee confidence with adoption before abandonment.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Ten onboarding modules with governance'),
    jsonb_build_object('key', 'onboarding_journey_hub', 'label', 'Onboarding journey hub', 'emoji', '🚀', 'description', 'Interactive journeys and first-login experiences'),
    jsonb_build_object('key', 'role_based_experience_engine', 'label', 'Role-based experience engine', 'emoji', '👤', 'description', 'Executive, manager, employee, admin paths'),
    jsonb_build_object('key', 'department_path_engine', 'label', 'Department path engine', 'emoji', '🏢', 'description', 'Department-specific onboarding paths'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not replace user onboarding pace control'),
    jsonb_build_object('key', 'milestone_celebration_engine', 'label', 'Milestone celebration engine', 'emoji', '🎉', 'description', 'Success milestones and celebrations'),
    jsonb_build_object('key', 'adoption_governance_dashboard', 'label', 'Adoption governance dashboard', 'emoji', '🛡️', 'description', 'Organization onboarding content protection'),
    jsonb_build_object('key', 'onboarding_types', 'label', 'Onboarding types catalog', 'emoji', '📋', 'description', 'Employee, manager, executive, customer, and rollout types')
  ); ${D};
create or replace function public._${bp}_onboarding_adoption_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — ten capabilities. Adoption before abandonment.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'onboarding_adoption_dashboard', 'label', 'Onboarding Adoption Dashboard — steps requiring attention'),
    jsonb_build_object('key', 'interactive_journeys', 'label', 'Interactive Onboarding Journeys'),
    jsonb_build_object('key', 'role_based_experiences', 'label', 'Role-Based Onboarding Experiences'),
    jsonb_build_object('key', 'department_paths', 'label', 'Department-Specific Onboarding Paths'),
    jsonb_build_object('key', 'progress_tracking', 'label', 'Progress Tracking & Task Completion Tracker'),
    jsonb_build_object('key', 'guided_tours', 'label', 'Guided Product Tours & Walkthroughs'),
    jsonb_build_object('key', 'first_login', 'label', 'First-Login Experiences & Welcome Center'),
    jsonb_build_object('key', 'checklists_learning', 'label', 'Onboarding Checklists & Learning Recommendations'),
    jsonb_build_object('key', 'milestones', 'label', 'Milestone Celebrations & Success Milestones'),
    jsonb_build_object('key', 'manager_adoption', 'label', 'Manager Dashboards, Customer Programs & Adoption Analytics')
  )); ${D};
create or replace function public._${bp}_onboarding_journey_hub() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Onboarding journeys — guidance before overwhelm.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'journey_defined', 'label', 'Is an interactive onboarding journey defined for this role?'),
    jsonb_build_object('key', 'progress_rbac', 'label', 'Does onboarding progress data follow RBAC policies?'),
    jsonb_build_object('key', 'org_content', 'label', 'Is organization-specific onboarding content protected?'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Are onboarding policy changes logged in the audit trail?'),
    jsonb_build_object('key', 'governance', 'label', 'How does governance support adoption without pressure?')
  )); ${D};
create or replace function public._${bp}_role_based_experience_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Role-based experiences — progress before pressure.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'executives', 'label', 'Executives — Cockpit introduction and strategic intelligence'),
    jsonb_build_object('key', 'managers', 'label', 'Managers — team management and communication guidance'),
    jsonb_build_object('key', 'employees', 'label', 'Employees — daily assistant and Knowledge Center intro'),
    jsonb_build_object('key', 'tenant_admins', 'label', 'Tenant Admins — configuration, security, permissions'),
    jsonb_build_object('key', 'super_admins', 'label', 'Super Admins — global governance and platform admin'),
    jsonb_build_object('key', 'growth_partners', 'label', 'Growth Partner onboarding'),
    jsonb_build_object('key', 'customers', 'label', 'Customer onboarding programs'),
    jsonb_build_object('key', 'enterprise_rollout', 'label', 'Enterprise rollout onboarding'),
    jsonb_build_object('key', 'setup_assistant', 'label', 'Setup Assistant and Welcome Center')
  )); ${D};
create or replace function public._${bp}_adoption_analytics_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Adoption analytics — identify barriers, encourage exploration.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'incomplete_onboarding', 'label', 'Detect incomplete onboarding'),
    jsonb_build_object('key', 'next_best_actions', 'label', 'Recommend next best actions'),
    jsonb_build_object('key', 'learning_content', 'label', 'Surface relevant learning content'),
    jsonb_build_object('key', 'adoption_barriers', 'label', 'Identify adoption barriers'),
    jsonb_build_object('key', 'platform_exploration', 'label', 'Encourage platform exploration'),
    jsonb_build_object('key', 'personalized_journeys', 'label', 'Personalize onboarding journeys')
  )); ${D};
create or replace function public._${bp}_adoption_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports adoption clarity and never bypasses onboarding RBAC or exposes organization onboarding content.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'welcome_center', 'label', 'Welcome Center guidance'),
    jsonb_build_object('key', 'setup_assistant', 'label', 'Setup Assistant walkthroughs'),
    jsonb_build_object('key', 'learning_suggestions', 'label', 'Learning suggestions and recommendations'),
    jsonb_build_object('key', 'onboarding_prompts', 'label', 'Onboarding assistant prompts'),
    jsonb_build_object('key', 'feedback_collection', 'label', 'Feedback collection support'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Onboarding progress RBAC — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_department_path_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Department paths — tailored adoption for every team.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'department_paths', 'label', 'Department-specific onboarding paths'),
    jsonb_build_object('key', 'employee_onboarding', 'label', 'Employee onboarding'),
    jsonb_build_object('key', 'manager_onboarding', 'label', 'Manager onboarding'),
    jsonb_build_object('key', 'executive_onboarding', 'label', 'Executive onboarding'),
    jsonb_build_object('key', 'administrator_onboarding', 'label', 'Administrator onboarding'),
    jsonb_build_object('key', 'customer_onboarding', 'label', 'Customer onboarding programs')
  )); ${D};
create or replace function public._${bp}_guided_tour_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Guided tours — explore without overwhelm.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'product_tours', 'label', 'Guided product tours'),
    jsonb_build_object('key', 'walkthroughs', 'label', 'Guided walkthroughs'),
    jsonb_build_object('key', 'first_login', 'label', 'First-login experiences'),
    jsonb_build_object('key', 'checklists', 'label', 'Onboarding checklists'),
    jsonb_build_object('key', 'task_tracker', 'label', 'Task completion tracker'),
    jsonb_build_object('key', 'feedback', 'label', 'Feedback collection')
  )); ${D};
create or replace function public._${bp}_milestone_celebration_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Milestone celebrations — success without pressure.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'success_milestones', 'label', 'Success milestones'),
    jsonb_build_object('key', 'celebrations', 'label', 'Milestone celebrations'),
    jsonb_build_object('key', 'manager_dashboards', 'label', 'Manager onboarding dashboards'),
    jsonb_build_object('key', 'team_visibility', 'label', 'Manager team onboarding visibility'),
    jsonb_build_object('key', 'completion_rates', 'label', 'Onboarding completion tracking'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Onboarding audit visibility respects role permissions')
  )); ${D};
create or replace function public._${bp}_adoption_governance_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Adoption governance — organizations control onboarding content.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'progress_rbac', 'label', 'Onboarding progress data follows RBAC policies'),
    jsonb_build_object('key', 'org_content', 'label', 'Organization-specific onboarding content protected'),
    jsonb_build_object('key', 'tenant_admin', 'label', 'Tenant Admin — organization onboarding'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Onboarding audit history — immutable log'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Manager, Employee tiers'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for onboarding policy changes')
  )); ${D};
create or replace function public._${bp}_onboarding_integration_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Onboarding integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'learning_center', 'label', 'Learning Center', 'cross_link', '/app/aipify-enterprise-training-certification-engine'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'cross_link', '/app/knowledge-center-engine'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'communication_center', 'label', 'Communication Center', 'cross_link', '/app/aipify-organizational-communication-announcements-engine'),
    jsonb_build_object('key', 'enterprise_analytics', 'label', 'Enterprise Analytics Engine Phase 235', 'cross_link', '/app/aipify-enterprise-analytics-operational-intelligence-engine'),
    jsonb_build_object('key', 'aipify_translate', 'label', 'Aipify Translate Phase 238', 'cross_link', '/app/aipify-translate-multilingual-workforce-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for onboarding integration actions')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing onboarding RBAC',
      'Exposing organization onboarding content without authorization',
      'Overriding adoption policies',
      'Replacing manager onboarding judgment',
      'Modifying onboarding audit trails',
      'Unlogged onboarding policy changes',
      'Forcing onboarding without consent',
      'Override human judgment'), 'principle', '${P.companion} supports — users retain onboarding pace control and organization content stays protected.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm onboarding support without adoption pressure.', 'values', jsonb_build_array('adoption_before_abandonment','guidance_before_overwhelm','progress_before_pressure','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Guided adoption audit logs via aipify_enterprise_onboarding_guided_adoption_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_onboarding_guided_adoption permissions — onboarding progress RBAC'),
    jsonb_build_object('key', 'progress_rbac', 'label', 'Onboarding progress data follows RBAC policies'),
    jsonb_build_object('key', 'org_content', 'label', 'Organization-specific onboarding content remains protected'),
    jsonb_build_object('key', 'org_policies', 'label', 'Organizations control onboarding and adoption policies'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 238, 'key', 'translate_multilingual_workforce', 'label', 'Translate Phase 238', 'route', '/app/aipify-translate-multilingual-workforce-engine', 'description', 'Cross-link only — closes Universal Knowledge Era'),
    jsonb_build_object('phase', 239, 'key', 'enterprise_onboarding_guided_adoption', 'label', 'Onboarding Phase 239', 'route', '/app/${P.slug}', 'description', 'Human-stewarded guided adoption — opens Guided Adoption Era')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'learning_center', 'label', 'Learning Center', 'route', '/app/aipify-enterprise-training-certification-engine', 'relationship', 'Learning Center integration — cross-link only'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'route', '/app/knowledge-center-engine', 'relationship', 'Knowledge Center integration — cross-link only'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'route', '/app/aipify-enterprise-notification-attention-management-engine', 'relationship', 'Notification Engine integration — cross-link only'),
    jsonb_build_object('key', 'enterprise_analytics', 'label', 'Enterprise Analytics Engine Phase 235', 'route', '/app/aipify-enterprise-analytics-operational-intelligence-engine', 'relationship', 'Enterprise Analytics integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Adoption before abandonment — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with RBAC-protected onboarding scaffolds and protected organization content. Growth Partner terminology. ${P.companion} supports — never bypasses onboarding RBAC or exposes organization onboarding content without authorization.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — users retain onboarding pace control.', '${P.companion} informs and supports.', 'Adoption before abandonment — guidance before overwhelm.', 'Growth Partner — never Affiliate.', 'Guided Adoption Era — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — onboarding signals max ~500 chars. No organization onboarding content beyond RBAC or PII in audit logs.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_translate_multilingual_workforce_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._atmwfebp238_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_onboarding_journey_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Onboarding journey hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_onboarding_journey_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_language_settings_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Onboarding journey hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_onboarding_journey_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_onboarding_adoption_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Onboarding — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_onboarding_adoption_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_translate_workforce_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Onboarding — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_onboarding_adoption_dashboard()->'capabilities') = 10,`,
  );

  for (const fn of [
    "onboarding_adoption_dashboard",
    "onboarding_journey_hub",
    "role_based_experience_engine",
    "adoption_analytics_engine",
    "adoption_companion",
    "department_path_engine",
    "guided_tour_engine",
    "milestone_celebration_engine",
    "adoption_governance_dashboard",
    "onboarding_integration_center",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${P.bp}_${fn}()`);
  }

  sql = sql.replace(
    /select 'aipify-translate-multilingual-workforce-engine'[^;]+;/g,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected translate and multilingual workforce guidance within Universal Knowledge Era;",
    "RBAC-protected enterprise onboarding and guided adoption guidance within Guided Adoption Era;",
  );
  sql = sql.replace(
    /Phase 239 Onboarding & Multilingual Workforce Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 238 Translate & Multilingual Workforce Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replaceAll(
    "guidance within Universal Knowledge Era;",
    "guidance within Guided Adoption Era;",
  );
  sql = sql.replace(
    /select 'aipify-enterprise-onboarding-guided-adoption-engine', '[^']+', 'Onboarding — Guided Adoption Era \(239–243\)\. People First\.', 'authenticated', 238/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}`,
  );

  return sql;
}

function genMigration() {
  const src238 = path.join(ROOT, "supabase/migrations/20261399000000_aipify_translate_multilingual_workforce_engine_phase238.sql");
  if (!fs.existsSync(src238)) throw new Error("Phase 238 migration required");
  let m = transformFrom238(fs.readFileSync(src238, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-translate-multilingual-workforce-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(path.join(ROOT, `lib/core/${P.slug}.ts`), transformFrom238(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")));
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom238(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")));
  }
  const panel = path.join(ROOT, `components/app/${srcSlug}/AipifyTranslateMultilingualWorkforceEngineDashboardPanel.tsx`);
  write(
    path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`),
    transformFrom238(fs.readFileSync(panel, "utf8")),
  );
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`);
  write(path.join(ROOT, `app/app/${P.slug}/page.tsx`), transformFrom238(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")));
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom238(fs.readFileSync(path.join(ROOT, `app/api/aipify/${srcSlug}/${route}/route.ts`), "utf8")),
    );
  }
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports guided adoption — does NOT bypass onboarding RBAC, expose organization onboarding content, or override adoption policies.

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

## What is the Enterprise Onboarding & Guided Adoption Engine?

The Enterprise Onboarding & Guided Adoption Engine helps organizations rapidly onboard employees, departments, and customers at \`/app/${P.slug}\`.

## What onboarding features are included?

Interactive journeys, role-based experiences, department paths, progress tracking, guided tours, first-login experiences, checklists, learning recommendations, milestone celebrations, manager dashboards, customer programs, and adoption analytics.

## What onboarding types are supported?

Employee, manager, executive, administrator, Growth Partner, customer, and enterprise rollout onboarding.

## What role-based experiences are included?

Executives (Cockpit intro), managers (team guidance), employees (assistant and Knowledge Center), tenant admins (configuration), and super admins (global governance).

## What onboarding components are included?

Welcome Center, Setup Assistant, guided walkthroughs, task completion tracker, learning suggestions, success milestones, and feedback collection.

## What intelligence features are included?

Detect incomplete onboarding, recommend next best actions, surface learning content, identify adoption barriers, encourage exploration, and personalize journeys.

## Who can manage onboarding?

Super Admin (full access), Tenant Admin (organization onboarding), Managers (team visibility), Employees (personal experience) — enterprise RBAC.

## Are onboarding workflows audited?

**Yes.** Onboarding progress follows RBAC. Organization-specific onboarding content remains protected.

## How does this integrate with other Aipify surfaces?

Cross-link only: Learning Center, Knowledge Center, Enterprise Notification Engine Phase 233, Executive Cockpit Phase 200, Communication Center, Enterprise Analytics Engine Phase 235, Aipify Translate Phase 238.

## Does the Adoption Companion replace user judgment?

**No.** ${P.companion} guides adoption — it does **NOT** bypass onboarding RBAC or force onboarding without consent.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Onboarding: journey hub, role-based experiences, department paths, guided tours, milestones, governance, analytics, integration center.
Types: employee, manager, executive, administrator, Growth Partner, customer, enterprise rollout.
Components: Welcome Center, Setup Assistant, walkthroughs, task tracker, learning suggestions, milestones, feedback.
Intelligence: incomplete onboarding detection, next best actions, learning content, adoption barriers, exploration, personalization.
Security: onboarding progress RBAC, org content protected, audit logging.
Design principles: Adoption before abandonment, guidance before overwhelm, progress before pressure.
Companion limitations: no bypassing onboarding RBAC, no exposing org content, no overriding adoption policies.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never bypasses onboarding RBAC, exposes organization onboarding content without authorization, or overrides adoption policies.";
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
    c = c.replace('| "aipifyTranslateMultilingualWorkforceEngine"', `| "aipifyTranslateMultilingualWorkforceEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    const anchor = /id: "aipifyTranslateMultilingualWorkforceEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyTranslateMultilingualWorkforceEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-translate-multilingual-workforce-engine")) {\n    return "aipifyTranslateMultilingualWorkforceEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-translate-multilingual-workforce-engine")) {\n    return "aipifyTranslateMultilingualWorkforceEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_translate_multilingual_workforce.steward",', `"aipify_translate_multilingual_workforce.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-translate-multilingual-workforce-engine";',
      `export * from "./aipify-translate-multilingual-workforce-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports interactive journeys, role-based paths, guided tours, checklists, milestones, manager dashboards, and adoption analytics. Supports adoption — does NOT bypass onboarding RBAC. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Onboarding adoption score",
    modeLabel: "Mode",
    readinessLabel: "Onboarding maturity level",
    executiveReviews: "Manager onboarding dashboard reviews",
    activeReflections: "Active guided adoption scaffolds",
    humanOversightRequired: `Human oversight required — users retain onboarding pace control; ${P.companion} supports only`,
    eraOpenerSummary: `Guided Adoption Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate Learning Center, Knowledge Center, Notification Engine, Executive Cockpit, Communication Center, Enterprise Analytics, or Aipify Translate RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Onboarding journey hub — governance prompts",
    frameworkLabel: "Role-based experience engine",
    reviewsLabel: "Adoption governance dashboard",
    companionLabel: `${P.companion} — supports adoption clarity, never replaces user onboarding pace`,
    subEngineLabel: "Department path engine",
    reflections: "Guided adoption scaffolds",
    executiveReviewEntries: "Milestone celebration entries",
    scaffoldNotes: "RBAC-protected onboarding adoption scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT bypass onboarding RBAC, expose organization onboarding content, or override adoption policies`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports guided adoption — users retain onboarding pace control and organization content stays protected.`,
      philosophy: "People First. RBAC-protected onboarding adoption scaffolds. Growth Partner terminology — never Affiliate.",
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
        ? "Onboarding"
        : locale === "sv"
          ? "Onboarding"
          : locale === "da"
            ? "Onboarding"
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
      'export * from "./implementation-blueprint-phase238-vocabulary";',
      `export * from "./implementation-blueprint-phase238-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE238_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase238-aipify-translate-multilingual-workforce.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE238_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase238-aipify-translate-multilingual-workforce.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_translate_multilingual_workforce.view`, `aipify_translate_multilingual_workforce.manage`, `aipify_translate_multilingual_workforce.steward`.";
  const entry = `\n**Enterprise Onboarding & Guided Adoption Engine (Phase 239):** See [AIPIFY_ENTERPRISE_ONBOARDING_GUIDED_ADOPTION_ENGINE_PHASE239.md](./AIPIFY_ENTERPRISE_ONBOARDING_GUIDED_ADOPTION_ENGINE_PHASE239.md) — Onboarding for journey hub, role-based experiences, department paths, guided tours, milestones, adoption analytics, governance, and integration center. Opens Guided Adoption Era (239–243). \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** bypassing onboarding RBAC, exposing organization onboarding content, or overriding adoption policies. Cross-links only: Learning Center, Knowledge Center, Enterprise Notification Engine Phase 233, Executive Cockpit Phase 200, Communication Center, Enterprise Analytics Engine Phase 235, Aipify Translate Phase 238. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 239")) {
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
