#!/usr/bin/env node
/** ABOS Phase 247 — Innovation & Idea Management Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "innovation_dashboard",
  "idea_submission_hub",
  "idea_categories_engine",
  "idea_voting_engine",
  "innovation_campaigns_engine",
  "innovation_analytics_engine",
  "innovation_governance_dashboard",
  "innovation_pipeline_engine",
  "innovation_integration_center",
];

const P = {
  phase: 247,
  migration: "20261409000000_aipify_innovation_idea_management_engine_phase247.sql",
  slug: "aipify-innovation-idea-management-engine",
  base: "AipifyInnovationIdeaManagement",
  camel: "aipifyInnovationIdeaManagementEngine",
  snake: "aipify_innovation_idea_management",
  permPrefix: "aipify_innovation_idea_management",
  helper: "aiime",
  bp: "aiimebp247",
  decisionType: "aipify_innovation_idea_management_engine",
  title: "Innovation & Idea Management",
  centerTitle: "Innovation & Ideas",
  companion: "Innovation Companion",
  scoreKey: "aipify_innovation_idea_management_score",
  modeKey: "innovation_idea_management_mode",
  levelKey: "innovation_idea_management_maturity_level",
  thirdEntity: "innovation_idea_management_notes",
  era: "Organizational Continuity Era (244–248)",
  eraRange: "244–248",
  docSlug: "AIPIFY_INNOVATION_IDEA_MANAGEMENT_ENGINE",
  ilmFile: "implementation-blueprint-phase247-aipify-innovation-idea-management.txt",
  navLabel: "Innovation",
  crossLinkNote:
    "Cross-links only: Employee Recognition & Celebration Engine Phase 242, Enterprise Analytics Engine Phase 235, Enterprise Workflow Automation Engine Phase 231, Enterprise Notification Engine Phase 233, Executive Cockpit Phase 200, Knowledge Center, and Aipify Translate Phase 238 — never bypass innovation RBAC, expose restricted initiatives without authorization, or expose sensitive idea data beyond idea ownership policies.",
  companionLimitations: [
    "bypassing_innovation_rbac",
    "exposing_restricted_initiatives_without_rbac",
    "exposing_sensitive_idea_data_beyond_rbac",
    "unlogged_innovation_policy_changes",
    "replacing_human_review_judgment",
    "modifying_innovation_audit_trail",
    "ignoring_idea_ownership_policies",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom246(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifySkillsInternalTalentMarketplace", P.base],
    ["aipify-skills-internal-talent-marketplace-engine", P.slug],
    ["aipify_skills_internal_talent_marketplace", P.snake],
    ["aipifySkillsInternalTalentMarketplaceEngine", P.camel],
    ["asitmebp246", P.bp],
    ["_asitme_", `_${P.helper}_`],
    ["aipify_skills_internal_talent_marketplace_score", P.scoreKey],
    ["skills_talent_marketplace_mode", P.modeKey],
    ["skills_talent_marketplace_maturity_level", P.levelKey],
    ["skills_talent_marketplace_notes", P.thirdEntity],
    ["SkillsTalentMarketplaceNote", thirdPascal],
    ["skills_talent_marketplace_notes_count", `${P.thirdEntity}_count`],
    ["Talent Marketplace Phase 246", "__TALENT_PHASE_246__"],
    ["Talent Marketplace Companion", "__INNOVATION_COMPANION__"],
    ["Skills & Internal Talent Marketplace", P.title],
    ["__INNOVATION_COMPANION__", P.companion],
    ["Skills & Talent Marketplace", "__INNOVATION_CENTER__"],
    ["__TALENT_PHASE_246__", "Talent Marketplace Phase 246"],
    ["Phase 246", `Phase ${P.phase}`],
    ["aipify_skills_internal_talent_marketplace.view", `${P.permPrefix}.view`],
    ["aipify_skills_internal_talent_marketplace.manage", `${P.permPrefix}.manage`],
    ["aipify_skills_internal_talent_marketplace.steward", `${P.permPrefix}.steward`],
    ["aipify_skills_internal_talent_marketplace_engine", P.decisionType],
    ["20261408000000_aipify_skills_internal_talent_marketplace_engine_phase246.sql", P.migration],
    ["Repo Phase 246", `Repo Phase ${P.phase}`],
    ["Phase 246 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE246_AIPIFY_SKILLS_INTERNAL_TALENT_MARKETPLACE_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase246", `implementation-blueprint-phase${P.phase}`],
    ["talent_marketplace_dashboard", SCAFFOLDS[0]],
    ["skill_profiles_hub", SCAFFOLDS[1]],
    ["skill_categories_engine", SCAFFOLDS[2]],
    ["talent_matching_engine", SCAFFOLDS[3]],
    ["internal_opportunities_engine", SCAFFOLDS[4]],
    ["talent_analytics_engine", SCAFFOLDS[5]],
    ["talent_governance_dashboard", SCAFFOLDS[6]],
    ["talent_mobility_engine", SCAFFOLDS[7]],
    ["talent_integration_center", SCAFFOLDS[8]],
    ["talent_marketplace_companion", "innovation_companion"],
    ["_seed_skills_talent_marketplace_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["internal talent marketplace stewardship", "innovation idea management stewardship"],
    ["talent-informed decision support", "innovation-informed decision support"],
    ["growth-first talent culture", "participation-first innovation culture"],
    ["active talent marketplace programs", "active innovation programs"],
    ["skill gaps requiring attention", "ideas requiring executive attention"],
    ["Skill Profiles Hub", "Idea Submission Hub"],
    ["Skill Categories Engine", "Idea Categories Engine"],
    ["Talent Matching Engine", "Idea Voting Engine"],
    ["Internal Opportunities Engine", "Innovation Campaigns Engine"],
    ["Talent Analytics Engine", "Innovation Analytics Engine"],
    ["Talent Governance Dashboard", "Innovation Governance Dashboard"],
    ["talent marketplace indicators", "innovation pipeline indicators"],
    ["talent governance prompts", "innovation governance prompts"],
    ["talent marketplace assistant prompts", "innovation assistant prompts"],
    ["internal mobility support", "executive review workflows"],
    ["talent utilization signals", "idea status tracking signals"],
    ["RBAC-protected talent marketplace policies", "RBAC-protected innovation policies"],
    ["Visibility before external hiring", "Participation before hierarchy"],
    ["Growth before stagnation", "Ideas before ego"],
    ["Privacy before exposure", "Impact before volume"],
    ["no_bypassing_talent_marketplace_rbac", "no_bypassing_innovation_rbac"],
    ["AIPIFY_SKILLS_INTERNAL_TALENT_MARKETPLACE_ENGINE", P.docSlug],
    ["skills and internal talent marketplace", "innovation and idea management"],
    ["Talent marketplace audit logs", "Innovation idea management audit logs"],
    ["talent marketplace RBAC", "innovation RBAC"],
    ["talent marketplace scaffolds", "innovation idea scaffolds"],
    ["organization talent marketplace policies", "organization innovation policies"],
    ["Talent marketplace score", "Innovation score"],
    ["Talent marketplace maturity level", "Innovation maturity level"],
    ["High-potential talent entries", "Innovation champion entries"],
    ["internal talent marketplace", "innovation idea management"],
    ["career aspiration privacy stewardship", "idea ownership policy stewardship"],
    ["employee data beyond RBAC", "idea data beyond RBAC"],
    ["cross-department talent discovery assistance", "cross-functional idea collaboration assistance"],
    ["manager skill validation reviews", "manager idea reviews"],
    [
      "Employee Growth Engine Phase 219, Learning Center, Mentorship & Knowledge Transfer Engine Phase 243, Succession Planning & Organizational Continuity Engine Phase 244, Enterprise Analytics Engine Phase 235, Enterprise Notification Engine Phase 233, and Aipify Translate Phase 238",
      "Employee Recognition & Celebration Engine Phase 242, Enterprise Analytics Engine Phase 235, Enterprise Workflow Automation Engine Phase 231, Enterprise Notification Engine Phase 233, Executive Cockpit Phase 200, Knowledge Center, and Aipify Translate Phase 238",
    ],
    [
      "Never bypass talent marketplace RBAC or expose career aspirations without employee consent",
      "Never bypass innovation RBAC or expose restricted initiatives without authorization",
    ],
    ["talent marketplace programs", "innovation programs"],
    ["Talent marketplace programs", "Innovation programs"],
    ["confidential career aspiration routing", "restricted initiative visibility routing"],
    ["exposes employee data without RBAC approval", "exposes idea data without RBAC approval"],
    ["Unauthorized talent marketplace access without RBAC approval", "Unauthorized innovation access without RBAC approval"],
    ["Modifying talent marketplace audit trails", "Modifying innovation audit trails"],
    ["Exposure before consent", "Volume before impact"],
    ["user hiring judgment control", "user review judgment control"],
    ["User hiring judgment control", "User review judgment control"],
    ["talent marketplace decisions and profile visibility policy", "innovation decisions and idea ownership policy"],
    ["talent profile visibility", "idea visibility"],
    ["talent marketplace governance", "innovation governance"],
    [
      "enable organizations to discover, develop and utilize internal talent through skill profiles, endorsements, internal opportunity matching, and talent analytics — maintaining employee data RBAC, career aspiration privacy, organization-controlled profile visibility, and complete audit history",
      "enable organizations to capture, evaluate and develop ideas from employees, teams and leaders — maintaining innovation RBAC, restricted initiative visibility, organization-controlled idea ownership policies, and complete audit history",
    ],
    [
      "internal mobility increases, talent utilization improves, external recruitment costs reduce, project staffing accelerates, employee engagement increases, and organizational resilience strengthens with visibility before external hiring",
      "employee participation increases, implemented ideas increase, innovation culture improves, idea evaluation cycles accelerate, cross-functional collaboration increases, and measurable business impact from innovations strengthens with participation before hierarchy",
    ],
    ["__INNOVATION_CENTER__", P.centerTitle],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports innovation and idea management — NOT bypassing innovation RBAC, exposing restricted initiatives without authorization, or exposing sensitive idea data beyond idea ownership policies. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Enable organizations to capture, evaluate and develop ideas from employees, teams and leaders to foster continuous innovation and improvement — ${P.companion} informs, humans decide.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Organizational Continuity Era (${P.eraRange}). Human-stewarded innovation governance; RBAC-protected idea scaffolds; innovation policy changes logged; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations increase employee participation, implemented ideas, innovation culture strength, evaluation cycle speed, cross-functional collaboration, and measurable business impact from innovations with participation before hierarchy.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Ten innovation modules with governance'),
    jsonb_build_object('key', 'idea_submission_hub', 'label', 'Idea submission hub', 'emoji', '📋', 'description', 'Portal, department boards, campaigns'),
    jsonb_build_object('key', 'idea_categories_engine', 'label', 'Idea categories engine', 'emoji', '🏆', 'description', 'Process, product, sustainability, custom'),
    jsonb_build_object('key', 'idea_voting_engine', 'label', 'Idea voting engine', 'emoji', '🔗', 'description', 'Voting, manager reviews, participation'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not replace human review judgment'),
    jsonb_build_object('key', 'innovation_analytics_engine', 'label', 'Innovation analytics engine', 'emoji', '📊', 'description', 'Pipelines, status, impact metrics'),
    jsonb_build_object('key', 'innovation_governance_dashboard', 'label', 'Innovation governance dashboard', 'emoji', '🛡️', 'description', 'RBAC and idea ownership controls'),
    jsonb_build_object('key', 'innovation_campaigns', 'label', 'Innovation campaigns engine', 'emoji', '🔔', 'description', 'Challenges, rewards, recognition support')
  ); ${D};
create or replace function public._${bp}_innovation_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — ten capabilities. Participation before hierarchy.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'innovation_dashboard', 'label', 'Innovation Dashboard'),
    jsonb_build_object('key', 'idea_submission_portal', 'label', 'Idea Submission Portal'),
    jsonb_build_object('key', 'department_boards', 'label', 'Department Idea Boards'),
    jsonb_build_object('key', 'innovation_campaigns', 'label', 'Organization-Wide Innovation Campaigns'),
    jsonb_build_object('key', 'idea_categorization', 'label', 'Idea Categorization & Voting'),
    jsonb_build_object('key', 'manager_reviews', 'label', 'Manager Reviews & Executive Workflows'),
    jsonb_build_object('key', 'innovation_pipelines', 'label', 'Innovation Pipelines'),
    jsonb_build_object('key', 'idea_status_tracking', 'label', 'Idea Status Tracking'),
    jsonb_build_object('key', 'innovation_analytics', 'label', 'Innovation Analytics'),
    jsonb_build_object('key', 'rewards_challenges', 'label', 'Reward Support & Innovation Challenge Programs')
  )); ${D};
create or replace function public._${bp}_idea_submission_hub() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Idea submission — ideas before ego.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'innovation_rbac', 'label', 'Does innovation data follow RBAC policies?'),
    jsonb_build_object('key', 'restricted_visibility', 'label', 'Are sensitive initiatives visibility-restricted?'),
    jsonb_build_object('key', 'idea_ownership', 'label', 'Do organizations control idea ownership policies?'),
    jsonb_build_object('key', 'participation', 'label', 'Is participation encouraged without pressure?'),
    jsonb_build_object('key', 'governance', 'label', 'How does governance support impact before volume?')
  )); ${D};
create or replace function public._${bp}_idea_categories_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Idea categories — impact before volume.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'process_improvements', 'label', 'Process improvements'),
    jsonb_build_object('key', 'customer_experience', 'label', 'Customer experience improvements'),
    jsonb_build_object('key', 'product_innovations', 'label', 'Product innovations'),
    jsonb_build_object('key', 'cost_saving', 'label', 'Cost-saving initiatives'),
    jsonb_build_object('key', 'employee_experience', 'label', 'Employee experience ideas'),
    jsonb_build_object('key', 'sustainability', 'label', 'Sustainability initiatives'),
    jsonb_build_object('key', 'technology', 'label', 'Technology opportunities'),
    jsonb_build_object('key', 'custom_categories', 'label', 'Custom categories')
  )); ${D};
create or replace function public._${bp}_innovation_pipeline_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Innovation pipeline — lifecycle stewardship.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'submitted', 'label', 'Submitted'),
    jsonb_build_object('key', 'under_review', 'label', 'Under review'),
    jsonb_build_object('key', 'approved', 'label', 'Approved'),
    jsonb_build_object('key', 'in_development', 'label', 'In development'),
    jsonb_build_object('key', 'implemented', 'label', 'Implemented'),
    jsonb_build_object('key', 'declined_archived', 'label', 'Declined & archived')
  )); ${D};
create or replace function public._${bp}_innovation_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports innovation clarity and never bypasses innovation RBAC or exposes restricted initiatives without authorization.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'detect_duplicates', 'label', 'Detect duplicate ideas'),
    jsonb_build_object('key', 'recommend_initiatives', 'label', 'Recommend related initiatives'),
    jsonb_build_object('key', 'highlight_high_impact', 'label', 'Highlight high-impact ideas'),
    jsonb_build_object('key', 'identify_champions', 'label', 'Identify innovation champions'),
    jsonb_build_object('key', 'surface_executive_attention', 'label', 'Surface ideas requiring executive attention'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Innovation RBAC — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_idea_voting_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Idea voting — participation without pressure.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'idea_voting', 'label', 'Idea voting'),
    jsonb_build_object('key', 'manager_reviews', 'label', 'Manager reviews'),
    jsonb_build_object('key', 'executive_workflows', 'label', 'Executive review workflows'),
    jsonb_build_object('key', 'department_boards', 'label', 'Department idea boards'),
    jsonb_build_object('key', 'underrepresented_groups', 'label', 'Encourage participation from underrepresented groups'),
    jsonb_build_object('key', 'cross_functional', 'label', 'Cross-functional collaboration')
  )); ${D};
create or replace function public._${bp}_innovation_campaigns_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Innovation campaigns — organization-wide improvement.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'innovation_campaigns', 'label', 'Organization-wide innovation campaigns'),
    jsonb_build_object('key', 'challenge_programs', 'label', 'Innovation challenge programs'),
    jsonb_build_object('key', 'reward_recognition', 'label', 'Reward and recognition support'),
    jsonb_build_object('key', 'idea_submission_portal', 'label', 'Idea submission portal'),
    jsonb_build_object('key', 'campaign_analytics', 'label', 'Campaign participation analytics'),
    jsonb_build_object('key', 'notification_integration', 'label', 'Notification Engine integration — cross-link only')
  )); ${D};
create or replace function public._${bp}_innovation_analytics_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Innovation analytics — measurable business impact.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'participation_rates', 'label', 'Employee participation rates'),
    jsonb_build_object('key', 'implemented_ideas', 'label', 'Implemented ideas count'),
    jsonb_build_object('key', 'evaluation_cycles', 'label', 'Idea evaluation cycle speed'),
    jsonb_build_object('key', 'pipeline_health', 'label', 'Innovation pipeline health'),
    jsonb_build_object('key', 'business_impact', 'label', 'Measurable business impact signals'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Innovation audit visibility respects role permissions')
  )); ${D};
create or replace function public._${bp}_innovation_governance_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Innovation governance — organizations control idea policies.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'innovation_rbac', 'label', 'Innovation data follows RBAC policies'),
    jsonb_build_object('key', 'restricted_visibility', 'label', 'Sensitive initiatives may require restricted visibility'),
    jsonb_build_object('key', 'idea_ownership', 'label', 'Organizations control idea ownership policies'),
    jsonb_build_object('key', 'manager_oversight', 'label', 'Manager department innovation management'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Executive, Manager, Employee tiers'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for innovation policy changes')
  )); ${D};
create or replace function public._${bp}_innovation_integration_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Innovation integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'recognition_engine', 'label', 'Employee Recognition & Celebration Engine Phase 242', 'cross_link', '/app/aipify-employee-recognition-celebration-engine'),
    jsonb_build_object('key', 'enterprise_analytics', 'label', 'Enterprise Analytics Engine Phase 235', 'cross_link', '/app/aipify-enterprise-analytics-operational-intelligence-engine'),
    jsonb_build_object('key', 'workflow_automation', 'label', 'Enterprise Workflow Automation Engine Phase 231', 'cross_link', '/app/aipify-enterprise-workflow-automation-engine'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-cockpit-engine'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'cross_link', '/app/aipify-enterprise-knowledge-center-engine'),
    jsonb_build_object('key', 'aipify_translate', 'label', 'Aipify Translate Phase 238', 'cross_link', '/app/aipify-translate-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for innovation integration actions')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing innovation RBAC',
      'Exposing restricted initiatives without authorization',
      'Exposing sensitive idea data beyond ownership policies',
      'Replacing human review judgment',
      'Modifying innovation audit trails',
      'Unlogged innovation policy changes',
      'Ignoring idea ownership policies',
      'Override human judgment'), 'principle', '${P.companion} supports — users retain review judgment control and restricted initiatives stay protected.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm innovation support without performance pressure.', 'values', jsonb_build_array('participation_before_hierarchy','ideas_before_ego','impact_before_volume','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Innovation idea management audit logs via aipify_innovation_idea_management_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_innovation_idea_management permissions — innovation RBAC'),
    jsonb_build_object('key', 'innovation_rbac', 'label', 'Innovation data follows RBAC policies'),
    jsonb_build_object('key', 'restricted_visibility', 'label', 'Sensitive initiatives may require restricted visibility'),
    jsonb_build_object('key', 'idea_ownership', 'label', 'Organizations control idea ownership policies'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 246, 'key', 'skills_internal_talent_marketplace', 'label', 'Talent Marketplace Phase 246', 'route', '/app/aipify-skills-internal-talent-marketplace-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 247, 'key', 'innovation_idea_management', 'label', 'Innovation Phase 247', 'route', '/app/${P.slug}', 'description', 'Human-stewarded innovation and idea management')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'recognition_engine', 'label', 'Recognition Engine Phase 242', 'route', '/app/aipify-employee-recognition-celebration-engine', 'relationship', 'Recognition integration — cross-link only'),
    jsonb_build_object('key', 'workflow_automation', 'label', 'Workflow Automation Phase 231', 'route', '/app/aipify-enterprise-workflow-automation-engine', 'relationship', 'Workflow integration — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-cockpit-engine', 'relationship', 'Executive Cockpit integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Ideas before ego — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with RBAC-protected innovation scaffolds and idea ownership policy protections. Growth Partner terminology. ${P.companion} supports — never bypasses innovation RBAC or exposes restricted initiatives without authorization.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — users retain review judgment control.', '${P.companion} informs and supports.', 'Participation before hierarchy — ideas before ego.', 'Growth Partner — never Affiliate.', 'Organizational Continuity Era — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — innovation signals max ~500 chars. No idea content beyond RBAC or PII in audit logs.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_skills_internal_talent_marketplace_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._asitmebp246_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_idea_submission_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Idea submission hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_idea_submission_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_skill_profiles_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Idea submission hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_idea_submission_hub()->'reflection_questions') = 5,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_innovation_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Innovation & Ideas — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_innovation_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_talent_marketplace_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Innovation & Ideas — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_innovation_dashboard()->'capabilities') = 10,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  for (const fn of [...SCAFFOLDS, "innovation_companion"]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${P.bp}_${fn}()`);
  }

  sql = sql.replace(
    /select 'aipify-skills-internal-talent-marketplace-engine'[^;]+;/g,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected skills and internal talent marketplace guidance within Organizational Continuity Era;",
    "RBAC-protected innovation and idea management guidance within Organizational Continuity Era;",
  );
  sql = sql.replace(
    /Phase 247 Innovation & Idea Management Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 246 Skills & Internal Talent Marketplace Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );

  sql = sql.replace(
    /'authenticated', 246\nwhere not exists \(select 1 from public\.aipify_knowledge_categories where slug = 'aipify-skills-internal-talent-marketplace-engine'/,
    `'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-skills-internal-talent-marketplace-engine'`,
  );

  return sql;
}

function genMigration() {
  const src246 = path.join(ROOT, "supabase/migrations/20261408000000_aipify_skills_internal_talent_marketplace_engine_phase246.sql");
  if (!fs.existsSync(src246)) throw new Error("Phase 246 migration required");
  let m = transformFrom246(fs.readFileSync(src246, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-skills-internal-talent-marketplace-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(path.join(ROOT, `lib/core/${P.slug}.ts`), transformFrom246(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")));
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom246(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")));
  }
  const panel = path.join(ROOT, `components/app/${srcSlug}/AipifySkillsInternalTalentMarketplaceEngineDashboardPanel.tsx`);
  write(
    path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`),
    transformFrom246(fs.readFileSync(panel, "utf8")),
  );
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`);
  write(path.join(ROOT, `app/app/${P.slug}/page.tsx`), transformFrom246(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")));
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom246(fs.readFileSync(path.join(ROOT, `app/api/aipify/${srcSlug}/${route}/route.ts`), "utf8")),
    );
  }
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports idea submission, department boards, innovation campaigns, categorization, voting, manager reviews, executive workflows, pipelines, status tracking, analytics, rewards, and challenge programs — does NOT bypass innovation RBAC, expose restricted initiatives without authorization, or expose sensitive idea data beyond idea ownership policies.

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

## What is the Innovation & Idea Management Engine?

The Innovation & Idea Management Engine helps organizations capture, evaluate and develop ideas at \`/app/${P.slug}\`.

## What innovation features are included?

Idea submission portal, department idea boards, organization-wide innovation campaigns, idea categorization, idea voting, manager reviews, executive review workflows, innovation pipelines, idea status tracking, innovation analytics, reward and recognition support, and innovation challenge programs.

## What idea categories are supported?

Process improvements, customer experience improvements, product innovations, cost-saving initiatives, employee experience ideas, sustainability initiatives, technology opportunities, and custom categories.

## What is the idea lifecycle?

Submitted, under review, approved, in development, implemented, declined, and archived.

## What intelligence features are included?

Detect duplicate ideas, recommend related initiatives, highlight high-impact ideas, identify innovation champions, surface ideas requiring executive attention, and encourage participation from underrepresented groups.

## Who can access innovation management?

Super Admin (full access), Tenant Admin (organization innovation settings), Executives (strategic innovation oversight), Managers (department innovation management), Employees (idea submission and participation) — enterprise RBAC.

## Are sensitive initiatives protected?

**Yes.** Innovation data follows RBAC policies. Sensitive initiatives may require restricted visibility. Organizations control idea ownership policies.

## How does this integrate with other Aipify surfaces?

${P.crossLinkNote}

## Does the Innovation Companion replace human judgment?

**No.** ${P.companion} supports innovation clarity — it does **NOT** bypass innovation RBAC, expose restricted initiatives without authorization, or expose sensitive idea data beyond idea ownership policies.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Innovation: submission portal, department boards, campaigns, categorization, voting, manager reviews, executive workflows, pipelines, status tracking, analytics, rewards, challenges.
Categories: process, customer experience, product, cost-saving, employee experience, sustainability, technology, custom.
Lifecycle: submitted, under review, approved, in development, implemented, declined, archived.
Intelligence: duplicate detection, related initiatives, high-impact ideas, innovation champions, executive attention, underrepresented participation.
Security: innovation RBAC, restricted visibility, idea ownership policies, audit logging, enterprise permissions, 2FA.
Design principles: Participation before hierarchy, ideas before ego, impact before volume.
Companion limitations: no bypassing innovation RBAC, no exposing restricted initiatives, no exposing data beyond ownership policies.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never bypasses innovation RBAC, exposes restricted initiatives without authorization, or exposes sensitive idea data beyond idea ownership policies.";
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
    c = c.replace('| "aipifySkillsInternalTalentMarketplaceEngine"', `| "aipifySkillsInternalTalentMarketplaceEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    const anchor = /id: "aipifySkillsInternalTalentMarketplaceEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifySkillsInternalTalentMarketplaceEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-skills-internal-talent-marketplace-engine")) {\n    return "aipifySkillsInternalTalentMarketplaceEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-skills-internal-talent-marketplace-engine")) {\n    return "aipifySkillsInternalTalentMarketplaceEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_skills_internal_talent_marketplace.steward",', `"aipify_skills_internal_talent_marketplace.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-skills-internal-talent-marketplace-engine";',
      `export * from "./aipify-skills-internal-talent-marketplace-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports idea submission, department boards, innovation campaigns, voting, manager reviews, executive workflows, pipelines, and analytics. Supports innovation culture — does NOT bypass innovation RBAC. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Innovation score",
    modeLabel: "Mode",
    readinessLabel: "Innovation maturity level",
    executiveReviews: "Executive review workflows",
    activeReflections: "Active innovation scaffolds",
    humanOversightRequired: `Human oversight required — users retain review judgment control; ${P.companion} supports only`,
    eraOpenerSummary: `Organizational Continuity Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate Recognition Engine, Analytics Engine, Workflow Automation, Notification Engine, Executive Cockpit, Knowledge Center, or Aipify Translate RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Idea submission hub — governance prompts",
    frameworkLabel: "Idea categories engine",
    reviewsLabel: "Innovation governance dashboard",
    companionLabel: `${P.companion} — supports innovation clarity, never replaces human review judgment`,
    subEngineLabel: "Idea voting engine",
    reflections: "Innovation scaffolds",
    executiveReviewEntries: "Innovation champion entries",
    scaffoldNotes: "RBAC-protected innovation scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT bypass innovation RBAC, expose restricted initiatives without authorization, or expose sensitive idea data beyond idea ownership policies`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports innovation and idea management — users retain review judgment control and restricted initiatives stay protected.`,
      philosophy: "People First. RBAC-protected innovation scaffolds. Growth Partner terminology — never Affiliate.",
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
        ? "Innovasjon"
        : locale === "sv"
          ? "Innovation"
          : locale === "da"
            ? "Innovation"
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
      'export * from "./implementation-blueprint-phase246-vocabulary";',
      `export * from "./implementation-blueprint-phase246-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE246_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase246-aipify-skills-internal-talent-marketplace.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE246_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase246-aipify-skills-internal-talent-marketplace.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_skills_internal_talent_marketplace.view`, `aipify_skills_internal_talent_marketplace.manage`, `aipify_skills_internal_talent_marketplace.steward`.";
  const entry = `\n**Innovation & Idea Management Engine (Phase 247):** See [AIPIFY_INNOVATION_IDEA_MANAGEMENT_ENGINE_PHASE247.md](./AIPIFY_INNOVATION_IDEA_MANAGEMENT_ENGINE_PHASE247.md) — Idea submission, department boards, innovation campaigns, categorization, voting, manager reviews, executive workflows, pipelines, status tracking, analytics, rewards, and challenge programs. Continues Organizational Continuity Era (244–248). \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** bypassing innovation RBAC, exposing restricted initiatives without authorization, or exposing sensitive idea data beyond idea ownership policies. Cross-links only: Employee Recognition & Celebration Engine Phase 242, Enterprise Analytics Engine Phase 235, Enterprise Workflow Automation Engine Phase 231, Enterprise Notification Engine Phase 233, Executive Cockpit Phase 200, Knowledge Center, Aipify Translate Phase 238. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 247")) {
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
  console.error(`Phase ${P.phase} docs generated; stack requires Phase 246 artifacts: ${err.message}`);
  process.exitCode = 1;
}
