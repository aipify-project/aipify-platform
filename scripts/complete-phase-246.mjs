#!/usr/bin/env node
/** ABOS Phase 246 — Skills & Internal Talent Marketplace Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "talent_marketplace_dashboard",
  "skill_profiles_hub",
  "skill_categories_engine",
  "talent_matching_engine",
  "internal_opportunities_engine",
  "talent_analytics_engine",
  "talent_governance_dashboard",
  "talent_mobility_engine",
  "talent_integration_center",
];

const P = {
  phase: 246,
  migration: "20261408000000_aipify_skills_internal_talent_marketplace_engine_phase246.sql",
  slug: "aipify-skills-internal-talent-marketplace-engine",
  base: "AipifySkillsInternalTalentMarketplace",
  camel: "aipifySkillsInternalTalentMarketplaceEngine",
  snake: "aipify_skills_internal_talent_marketplace",
  permPrefix: "aipify_skills_internal_talent_marketplace",
  helper: "asitme",
  bp: "asitmebp246",
  decisionType: "aipify_skills_internal_talent_marketplace_engine",
  title: "Skills & Internal Talent Marketplace",
  centerTitle: "Skills & Talent Marketplace",
  companion: "Talent Marketplace Companion",
  scoreKey: "aipify_skills_internal_talent_marketplace_score",
  modeKey: "skills_talent_marketplace_mode",
  levelKey: "skills_talent_marketplace_maturity_level",
  thirdEntity: "skills_talent_marketplace_notes",
  era: "Organizational Continuity Era (244–248)",
  eraRange: "244–248",
  docSlug: "AIPIFY_SKILLS_INTERNAL_TALENT_MARKETPLACE_ENGINE",
  ilmFile: "implementation-blueprint-phase246-aipify-skills-internal-talent-marketplace.txt",
  navLabel: "Talent Marketplace",
  crossLinkNote:
    "Cross-links only: Employee Growth Engine Phase 219, Learning Center, Mentorship & Knowledge Transfer Engine Phase 243, Succession Planning & Organizational Continuity Engine Phase 244, Enterprise Analytics Engine Phase 235, Enterprise Notification Engine Phase 233, and Aipify Translate Phase 238 — never bypass talent marketplace RBAC, expose career aspirations without employee consent, or expose employee data beyond authorized profile visibility.",
  companionLimitations: [
    "bypassing_talent_marketplace_rbac",
    "exposing_career_aspirations_without_consent",
    "exposing_employee_data_beyond_rbac",
    "unlogged_talent_policy_changes",
    "replacing_human_hiring_judgment",
    "modifying_talent_audit_trail",
    "ignoring_profile_visibility_settings",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom245(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyOrganizationalHealthWorkforceInsights", P.base],
    ["aipify-organizational-health-workforce-insights-engine", P.slug],
    ["aipify_organizational_health_workforce_insights", P.snake],
    ["aipifyOrganizationalHealthWorkforceInsightsEngine", P.camel],
    ["aohwiebp245", P.bp],
    ["_aohwie_", `_${P.helper}_`],
    ["aipify_organizational_health_workforce_insights_score", P.scoreKey],
    ["organizational_health_workforce_insights_mode", P.modeKey],
    ["organizational_health_workforce_insights_maturity_level", P.levelKey],
    ["organizational_health_workforce_insights_notes", P.thirdEntity],
    ["OrganizationalHealthWorkforceInsightsNote", thirdPascal],
    ["organizational_health_workforce_insights_notes_count", `${P.thirdEntity}_count`],
    ["Health Insights Phase 245", "__HEALTH_PHASE_245__"],
    ["Health Insights Companion", "__TALENT_COMPANION__"],
    ["Organizational Health & Workforce Insights", P.title],
    ["__TALENT_COMPANION__", P.companion],
    ["Health & Workforce Insights", "__TALENT_CENTER__"],
    ["__HEALTH_PHASE_245__", "Health Insights Phase 245"],
    ["Phase 245", `Phase ${P.phase}`],
    ["aipify_organizational_health_workforce_insights.view", `${P.permPrefix}.view`],
    ["aipify_organizational_health_workforce_insights.manage", `${P.permPrefix}.manage`],
    ["aipify_organizational_health_workforce_insights.steward", `${P.permPrefix}.steward`],
    ["aipify_organizational_health_workforce_insights_engine", P.decisionType],
    ["20261407000000_aipify_organizational_health_workforce_insights_engine_phase245.sql", P.migration],
    ["Repo Phase 245", `Repo Phase ${P.phase}`],
    ["Phase 245 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE245_AIPIFY_ORGANIZATIONAL_HEALTH_WORKFORCE_INSIGHTS_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase245", `implementation-blueprint-phase${P.phase}`],
    ["organizational_health_dashboard", SCAFFOLDS[0]],
    ["pulse_survey_hub", SCAFFOLDS[1]],
    ["insight_categories_engine", SCAFFOLDS[2]],
    ["workforce_sentiment_engine", SCAFFOLDS[3]],
    ["survey_programs_engine", SCAFFOLDS[4]],
    ["workforce_analytics_engine", SCAFFOLDS[5]],
    ["health_governance_dashboard", SCAFFOLDS[6]],
    ["leadership_health_engine", SCAFFOLDS[7]],
    ["health_integration_center", SCAFFOLDS[8]],
    ["health_insights_companion", "talent_marketplace_companion"],
    ["_seed_organizational_health_workforce_insights_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["workforce health insights stewardship", "internal talent marketplace stewardship"],
    ["health-informed decision support", "talent-informed decision support"],
    ["wellbeing-first organizational culture", "growth-first talent culture"],
    ["active health insight programs", "active talent marketplace programs"],
    ["health indicators requiring attention", "skill gaps requiring attention"],
    ["Pulse Survey Hub", "Skill Profiles Hub"],
    ["Insight Categories Engine", "Skill Categories Engine"],
    ["Workforce Sentiment Engine", "Talent Matching Engine"],
    ["Survey Programs Engine", "Internal Opportunities Engine"],
    ["Workforce Analytics Engine", "Talent Analytics Engine"],
    ["Health Governance Dashboard", "Talent Governance Dashboard"],
    ["organizational health indicators", "talent marketplace indicators"],
    ["health governance prompts", "talent governance prompts"],
    ["health insights assistant prompts", "talent marketplace assistant prompts"],
    ["leadership health summaries", "internal mobility support"],
    ["participation analytics signals", "talent utilization signals"],
    ["RBAC-protected health insights policies", "RBAC-protected talent marketplace policies"],
    ["Ethics before exposure", "Visibility before external hiring"],
    ["Aggregation before identification", "Growth before stagnation"],
    ["Wellbeing before metrics pressure", "Privacy before exposure"],
    ["no_bypassing_health_insights_rbac", "no_bypassing_talent_marketplace_rbac"],
    ["AIPIFY_ORGANIZATIONAL_HEALTH_WORKFORCE_INSIGHTS_ENGINE", P.docSlug],
    ["organizational health and workforce insights", "skills and internal talent marketplace"],
    ["Workforce health insights audit logs", "Talent marketplace audit logs"],
    ["health insights RBAC", "talent marketplace RBAC"],
    ["workforce health scaffolds", "talent marketplace scaffolds"],
    ["organization health insights policies", "organization talent marketplace policies"],
    ["Organizational health score", "Talent marketplace score"],
    ["Workforce insights maturity level", "Talent marketplace maturity level"],
    ["Leadership health summary entries", "High-potential talent entries"],
    ["workforce health insights", "internal talent marketplace"],
    ["individual response confidentiality stewardship", "career aspiration privacy stewardship"],
    ["workforce data beyond RBAC", "employee data beyond RBAC"],
    ["cross-department health insights assistance", "cross-department talent discovery assistance"],
    ["leadership health reviews", "manager skill validation reviews"],
    [
      "Employee Growth Engine Phase 219, Employee Recognition & Celebration Engine Phase 242, Enterprise Analytics Engine Phase 235, Executive Cockpit Phase 200, Enterprise Notification Engine Phase 233, Learning Center, and Aipify Translate Phase 238",
      "Employee Growth Engine Phase 219, Learning Center, Mentorship & Knowledge Transfer Engine Phase 243, Succession Planning & Organizational Continuity Engine Phase 244, Enterprise Analytics Engine Phase 235, Enterprise Notification Engine Phase 233, and Aipify Translate Phase 238",
    ],
    [
      "Never bypass health insights RBAC or expose individual survey responses without authorization",
      "Never bypass talent marketplace RBAC or expose career aspirations without employee consent",
    ],
    ["health insight programs", "talent marketplace programs"],
    ["Health insight programs", "Talent marketplace programs"],
    ["confidential individual response routing", "confidential career aspiration routing"],
    ["exposes workforce data without RBAC approval", "exposes employee data without RBAC approval"],
    ["Unauthorized health insights access without RBAC approval", "Unauthorized talent marketplace access without RBAC approval"],
    ["Modifying health insights audit trails", "Modifying talent marketplace audit trails"],
    ["Pressure before wellbeing", "Exposure before consent"],
    ["user leadership judgment control", "user hiring judgment control"],
    ["User leadership judgment control", "User hiring judgment control"],
    ["health insights decisions and survey policy", "talent marketplace decisions and profile visibility policy"],
    ["workforce health visibility", "talent profile visibility"],
    ["workforce health governance", "talent marketplace governance"],
    [
      "enable organizations to monitor workforce wellbeing, engagement and organizational health through ethical, aggregated and actionable insights — maintaining individual response confidentiality, aggregated workforce insights RBAC, sensitive health data protections, and complete audit history",
      "enable organizations to discover, develop and utilize internal talent through skill profiles, endorsements, internal opportunity matching, and talent analytics — maintaining employee data RBAC, career aspiration privacy, organization-controlled profile visibility, and complete audit history",
    ],
    [
      "employee engagement increases, workforce wellbeing improves, organizational challenges are detected earlier, leadership responsiveness improves, participation rates increase, and organizational resilience strengthens with ethics before exposure",
      "internal mobility increases, talent utilization improves, external recruitment costs reduce, project staffing accelerates, employee engagement increases, and organizational resilience strengthens with visibility before external hiring",
    ],
    ["continues Organizational Continuity Era", "continues Organizational Continuity Era"],
    ["__TALENT_CENTER__", P.centerTitle],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports internal talent discovery and matching — NOT bypassing talent marketplace RBAC, exposing career aspirations without employee consent, or exposing employee data beyond authorized profile visibility. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Enable organizations to discover, develop and utilize internal talent by creating visibility into employee skills, interests and growth opportunities — ${P.companion} informs, humans decide.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Organizational Continuity Era (${P.eraRange}). Human-stewarded talent marketplace governance; RBAC-protected skill scaffolds; talent policy changes logged; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations increase internal mobility, improve talent utilization, reduce external recruitment costs, accelerate project staffing, increase employee engagement, and strengthen organizational resilience with visibility before external hiring.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Ten talent marketplace modules with governance'),
    jsonb_build_object('key', 'skill_profiles_hub', 'label', 'Skill profiles hub', 'emoji', '📋', 'description', 'Profiles, self-assessments, manager validation, endorsements'),
    jsonb_build_object('key', 'skill_categories_engine', 'label', 'Skill categories engine', 'emoji', '🏆', 'description', 'Technical, leadership, communication, operational, custom'),
    jsonb_build_object('key', 'talent_matching_engine', 'label', 'Talent matching engine', 'emoji', '🔗', 'description', 'Project matching, rare expertise, hidden talent'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not replace human hiring judgment'),
    jsonb_build_object('key', 'talent_analytics_engine', 'label', 'Talent analytics engine', 'emoji', '📊', 'description', 'Skill gaps, utilization, mobility trends'),
    jsonb_build_object('key', 'talent_governance_dashboard', 'label', 'Talent governance dashboard', 'emoji', '🛡️', 'description', 'RBAC and profile visibility controls'),
    jsonb_build_object('key', 'internal_opportunities', 'label', 'Internal opportunities engine', 'emoji', '🔔', 'description', 'Marketplace, cross-department discovery, internal recruitment')
  ); ${D};
create or replace function public._${bp}_talent_marketplace_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — ten capabilities. Visibility before external hiring.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'talent_marketplace_dashboard', 'label', 'Talent Marketplace Dashboard'),
    jsonb_build_object('key', 'skill_profiles', 'label', 'Employee Skill Profiles'),
    jsonb_build_object('key', 'skill_assessments', 'label', 'Skill Self-Assessments & Manager Validation'),
    jsonb_build_object('key', 'skill_endorsements', 'label', 'Skill Endorsements'),
    jsonb_build_object('key', 'internal_marketplace', 'label', 'Internal Opportunity Marketplace'),
    jsonb_build_object('key', 'project_matching', 'label', 'Project-Based Talent Matching'),
    jsonb_build_object('key', 'cross_department_discovery', 'label', 'Cross-Department Talent Discovery'),
    jsonb_build_object('key', 'hidden_talent', 'label', 'Hidden Talent Identification'),
    jsonb_build_object('key', 'career_aspirations', 'label', 'Career Aspiration Tracking'),
    jsonb_build_object('key', 'skill_gap_analysis', 'label', 'Skill Gap Analysis & Internal Mobility Support')
  )); ${D};
create or replace function public._${bp}_skill_profiles_hub() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Skill profiles — privacy before exposure.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'talent_rbac', 'label', 'Does employee talent data follow RBAC policies?'),
    jsonb_build_object('key', 'aspiration_privacy', 'label', 'Are career aspirations private unless shared?'),
    jsonb_build_object('key', 'profile_visibility', 'label', 'Do organizations control profile visibility settings?'),
    jsonb_build_object('key', 'manager_validation', 'label', 'Is manager skill validation supported ethically?'),
    jsonb_build_object('key', 'governance', 'label', 'How does governance support growth without pressure?')
  )); ${D};
create or replace function public._${bp}_skill_categories_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Skill categories — growth before stagnation.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'technical_skills', 'label', 'Technical skills'),
    jsonb_build_object('key', 'leadership_skills', 'label', 'Leadership skills'),
    jsonb_build_object('key', 'communication_skills', 'label', 'Communication skills'),
    jsonb_build_object('key', 'creative_skills', 'label', 'Creative skills'),
    jsonb_build_object('key', 'language_skills', 'label', 'Language skills'),
    jsonb_build_object('key', 'operational_skills', 'label', 'Operational skills'),
    jsonb_build_object('key', 'industry_expertise', 'label', 'Industry expertise'),
    jsonb_build_object('key', 'custom_skills', 'label', 'Custom organizational skills')
  )); ${D};
create or replace function public._${bp}_talent_mobility_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Internal mobility — develop talent before external hiring.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'internal_mobility', 'label', 'Internal mobility support'),
    jsonb_build_object('key', 'career_aspirations', 'label', 'Career aspiration tracking'),
    jsonb_build_object('key', 'skill_gaps', 'label', 'Skill gap analysis'),
    jsonb_build_object('key', 'high_potential', 'label', 'High-potential employee surfacing'),
    jsonb_build_object('key', 'underutilized_talent', 'label', 'Underutilized talent highlights'),
    jsonb_build_object('key', 'internal_recruitment', 'label', 'Internal recruitment support')
  )); ${D};
create or replace function public._${bp}_talent_marketplace_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports talent discovery and never bypasses talent marketplace RBAC or exposes career aspirations without consent.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'identify_skill_gaps', 'label', 'Identify emerging skill gaps'),
    jsonb_build_object('key', 'recommend_learning', 'label', 'Recommend learning paths'),
    jsonb_build_object('key', 'highlight_underutilized', 'label', 'Highlight underutilized talent'),
    jsonb_build_object('key', 'suggest_mentorship', 'label', 'Suggest mentorship opportunities'),
    jsonb_build_object('key', 'recommend_internal_candidates', 'label', 'Recommend internal candidates before external hiring'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Talent marketplace RBAC — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_talent_matching_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Talent matching — connect skills with opportunities.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'project_matching', 'label', 'Match employees with projects'),
    jsonb_build_object('key', 'internal_opportunities', 'label', 'Suggest internal opportunities'),
    jsonb_build_object('key', 'rare_expertise', 'label', 'Surface employees with rare expertise'),
    jsonb_build_object('key', 'cross_functional', 'label', 'Promote cross-functional collaboration'),
    jsonb_build_object('key', 'career_growth', 'label', 'Encourage career growth'),
    jsonb_build_object('key', 'hidden_talent', 'label', 'Hidden talent identification')
  )); ${D};
create or replace function public._${bp}_internal_opportunities_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Internal opportunities — marketplace without pressure.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'opportunity_marketplace', 'label', 'Internal opportunity marketplace'),
    jsonb_build_object('key', 'project_staffing', 'label', 'Project-based talent matching'),
    jsonb_build_object('key', 'cross_department', 'label', 'Cross-department talent discovery'),
    jsonb_build_object('key', 'internal_recruitment', 'label', 'Support internal recruitment'),
    jsonb_build_object('key', 'employee_interests', 'label', 'Employee interests and aspirations'),
    jsonb_build_object('key', 'notification_integration', 'label', 'Notification Engine integration — cross-link only')
  )); ${D};
create or replace function public._${bp}_talent_analytics_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Talent analytics — organization-wide visibility with RBAC.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'skill_gap_trends', 'label', 'Emerging skill gap signals'),
    jsonb_build_object('key', 'talent_utilization', 'label', 'Talent utilization analytics'),
    jsonb_build_object('key', 'mobility_trends', 'label', 'Internal mobility trends'),
    jsonb_build_object('key', 'project_staffing', 'label', 'Project staffing velocity'),
    jsonb_build_object('key', 'engagement_signals', 'label', 'Employee engagement through growth'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Talent audit visibility respects role permissions')
  )); ${D};
create or replace function public._${bp}_talent_governance_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Talent governance — organizations control profile visibility.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'talent_rbac', 'label', 'Employee data follows RBAC policies'),
    jsonb_build_object('key', 'aspiration_privacy', 'label', 'Career aspirations remain private unless shared'),
    jsonb_build_object('key', 'profile_visibility', 'label', 'Organizations control profile visibility settings'),
    jsonb_build_object('key', 'manager_oversight', 'label', 'Manager department talent visibility'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Manager, Employee, HR tiers'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for talent policy changes')
  )); ${D};
create or replace function public._${bp}_talent_integration_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Talent integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'employee_growth', 'label', 'Employee Growth Engine Phase 219', 'cross_link', '/app/aipify-employee-growth-career-development-engine'),
    jsonb_build_object('key', 'learning_center', 'label', 'Learning Center', 'cross_link', '/app/aipify-enterprise-training-certification-engine'),
    jsonb_build_object('key', 'mentorship_engine', 'label', 'Mentorship & Knowledge Transfer Engine Phase 243', 'cross_link', '/app/aipify-mentorship-knowledge-transfer-engine'),
    jsonb_build_object('key', 'succession_engine', 'label', 'Succession Planning Engine Phase 244', 'cross_link', '/app/aipify-succession-planning-organizational-continuity-engine'),
    jsonb_build_object('key', 'enterprise_analytics', 'label', 'Enterprise Analytics Engine Phase 235', 'cross_link', '/app/aipify-enterprise-analytics-operational-intelligence-engine'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'aipify_translate', 'label', 'Aipify Translate Phase 238', 'cross_link', '/app/aipify-translate-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for talent integration actions')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing talent marketplace RBAC',
      'Exposing career aspirations without employee consent',
      'Exposing employee data beyond authorized profile visibility',
      'Replacing human hiring judgment',
      'Modifying talent marketplace audit trails',
      'Unlogged talent policy changes',
      'Ignoring profile visibility settings',
      'Override human judgment'), 'principle', '${P.companion} supports — users retain hiring judgment control and career aspirations stay protected unless shared.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm talent growth support without performance pressure.', 'values', jsonb_build_array('visibility_before_external_hiring','growth_before_stagnation','privacy_before_exposure','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Talent marketplace audit logs via aipify_skills_internal_talent_marketplace_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_skills_internal_talent_marketplace permissions — talent marketplace RBAC'),
    jsonb_build_object('key', 'talent_rbac', 'label', 'Employee data follows RBAC policies'),
    jsonb_build_object('key', 'aspiration_privacy', 'label', 'Career aspirations must remain private unless shared'),
    jsonb_build_object('key', 'profile_visibility', 'label', 'Organizations control profile visibility settings'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 245, 'key', 'organizational_health_workforce_insights', 'label', 'Health Insights Phase 245', 'route', '/app/aipify-organizational-health-workforce-insights-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 246, 'key', 'skills_internal_talent_marketplace', 'label', 'Talent Marketplace Phase 246', 'route', '/app/${P.slug}', 'description', 'Human-stewarded skills and internal talent marketplace')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'employee_growth', 'label', 'Employee Growth Engine Phase 219', 'route', '/app/aipify-employee-growth-career-development-engine', 'relationship', 'Employee Growth integration — cross-link only'),
    jsonb_build_object('key', 'succession_engine', 'label', 'Succession Engine Phase 244', 'route', '/app/aipify-succession-planning-organizational-continuity-engine', 'relationship', 'Succession integration — cross-link only'),
    jsonb_build_object('key', 'mentorship_engine', 'label', 'Mentorship Engine Phase 243', 'route', '/app/aipify-mentorship-knowledge-transfer-engine', 'relationship', 'Mentorship integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Growth before stagnation — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with RBAC-protected skill scaffolds and career aspiration privacy protections. Growth Partner terminology. ${P.companion} supports — never bypasses talent marketplace RBAC or exposes employee data beyond authorized profile visibility.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — users retain hiring judgment control.', '${P.companion} informs and supports.', 'Visibility before external hiring — growth before stagnation.', 'Growth Partner — never Affiliate.', 'Organizational Continuity Era — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — talent signals max ~500 chars. No employee content beyond RBAC or PII in audit logs.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_organizational_health_workforce_insights_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._aohwiebp245_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_skill_profiles_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Skill profiles hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_skill_profiles_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_pulse_survey_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Skill profiles hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_skill_profiles_hub()->'reflection_questions') = 5,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_talent_marketplace_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Skills & Talent Marketplace — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_talent_marketplace_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_organizational_health_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Skills & Talent Marketplace — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_talent_marketplace_dashboard()->'capabilities') = 10,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  for (const fn of [...SCAFFOLDS, "talent_marketplace_companion"]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${P.bp}_${fn}()`);
  }

  sql = sql.replace(
    /select 'aipify-organizational-health-workforce-insights-engine'[^;]+;/g,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected organizational health and workforce insights guidance within Organizational Continuity Era;",
    "RBAC-protected skills and internal talent marketplace guidance within Organizational Continuity Era;",
  );
  sql = sql.replace(
    /Phase 246 Skills & Internal Talent Marketplace Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 245 Organizational Health & Workforce Insights Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );

  sql = sql.replace(
    /'authenticated', 245\nwhere not exists \(select 1 from public\.aipify_knowledge_categories where slug = 'aipify-organizational-health-workforce-insights-engine'/,
    `'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-organizational-health-workforce-insights-engine'`,
  );

  return sql;
}

function genMigration() {
  const src245 = path.join(ROOT, "supabase/migrations/20261407000000_aipify_organizational_health_workforce_insights_engine_phase245.sql");
  if (!fs.existsSync(src245)) throw new Error("Phase 245 migration required");
  let m = transformFrom245(fs.readFileSync(src245, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-organizational-health-workforce-insights-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(path.join(ROOT, `lib/core/${P.slug}.ts`), transformFrom245(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")));
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom245(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")));
  }
  const panel = path.join(ROOT, `components/app/${srcSlug}/AipifyOrganizationalHealthWorkforceInsightsEngineDashboardPanel.tsx`);
  write(
    path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`),
    transformFrom245(fs.readFileSync(panel, "utf8")),
  );
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`);
  write(path.join(ROOT, `app/app/${P.slug}/page.tsx`), transformFrom245(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")));
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom245(fs.readFileSync(path.join(ROOT, `app/api/aipify/${srcSlug}/${route}/route.ts`), "utf8")),
    );
  }
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports employee skill profiles, self-assessments, manager validation, endorsements, internal opportunity marketplace, project matching, cross-department discovery, hidden talent identification, career aspirations, skill gap analysis, internal mobility, and talent analytics — does NOT bypass talent marketplace RBAC, expose career aspirations without employee consent, or expose employee data beyond authorized profile visibility.

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

## What is the Skills & Internal Talent Marketplace Engine?

The Skills & Internal Talent Marketplace Engine helps organizations discover, develop and utilize internal talent at \`/app/${P.slug}\`.

## What talent features are included?

Employee skill profiles, skill self-assessments, manager skill validation, skill endorsements, internal opportunity marketplace, project-based talent matching, cross-department talent discovery, hidden talent identification, career aspiration tracking, skill gap analysis, internal mobility support, and talent analytics.

## What skill categories are supported?

Technical skills, leadership skills, communication skills, creative skills, language skills, operational skills, industry expertise, and custom organizational skills.

## What marketplace capabilities are included?

Match employees with projects, suggest internal opportunities, surface employees with rare expertise, promote cross-functional collaboration, encourage career growth, and support internal recruitment.

## What intelligence features are included?

Identify emerging skill gaps, recommend learning paths, highlight underutilized talent, suggest mentorship opportunities, recommend internal candidates before external hiring, and surface high-potential employees.

## Who can access the talent marketplace?

Super Admin (full access), Tenant Admin (organization talent settings), Managers (department talent visibility), Employees (manage own profiles and interests), HR (organization-wide talent insights) — enterprise RBAC.

## Are career aspirations protected?

**Yes.** Career aspirations remain private unless shared. Employee data follows RBAC policies. Organizations control profile visibility settings.

## How does this integrate with other Aipify surfaces?

${P.crossLinkNote}

## Does the Talent Marketplace Companion replace human judgment?

**No.** ${P.companion} supports talent discovery — it does **NOT** bypass talent marketplace RBAC, expose career aspirations without employee consent, or expose employee data beyond authorized profile visibility.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Talent: skill profiles, self-assessments, manager validation, endorsements, internal marketplace, project matching, cross-department discovery, hidden talent, career aspirations, skill gaps, internal mobility, analytics.
Categories: technical, leadership, communication, creative, language, operational, industry expertise, custom.
Marketplace: project matching, internal opportunities, rare expertise, cross-functional collaboration, career growth, internal recruitment.
Intelligence: skill gaps, learning paths, underutilized talent, mentorship, internal candidates, high-potential employees.
Security: talent RBAC, aspiration privacy, profile visibility controls, audit logging, enterprise permissions, 2FA.
Design principles: Visibility before external hiring, growth before stagnation, privacy before exposure.
Companion limitations: no bypassing talent RBAC, no exposing aspirations without consent, no exposing data beyond profile visibility.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never bypasses talent marketplace RBAC, exposes career aspirations without employee consent, or exposes employee data beyond authorized profile visibility.";
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
    c = c.replace('| "aipifyOrganizationalHealthWorkforceInsightsEngine"', `| "aipifyOrganizationalHealthWorkforceInsightsEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    const anchor = /id: "aipifyOrganizationalHealthWorkforceInsightsEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyOrganizationalHealthWorkforceInsightsEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-organizational-health-workforce-insights-engine")) {\n    return "aipifyOrganizationalHealthWorkforceInsightsEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-organizational-health-workforce-insights-engine")) {\n    return "aipifyOrganizationalHealthWorkforceInsightsEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_organizational_health_workforce_insights.steward",', `"aipify_organizational_health_workforce_insights.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-organizational-health-workforce-insights-engine";',
      `export * from "./aipify-organizational-health-workforce-insights-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports skill profiles, endorsements, internal opportunity matching, cross-department discovery, skill gap analysis, and internal mobility. Supports talent utilization — does NOT bypass talent marketplace RBAC. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Talent marketplace score",
    modeLabel: "Mode",
    readinessLabel: "Talent marketplace maturity level",
    executiveReviews: "Internal mobility support",
    activeReflections: "Active talent marketplace scaffolds",
    humanOversightRequired: `Human oversight required — users retain hiring judgment control; ${P.companion} supports only`,
    eraOpenerSummary: `Organizational Continuity Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate Employee Growth, Learning Center, Mentorship Engine, Succession Engine, Analytics Engine, Notification Engine, or Aipify Translate RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Skill profiles hub — governance prompts",
    frameworkLabel: "Skill categories engine",
    reviewsLabel: "Talent governance dashboard",
    companionLabel: `${P.companion} — supports talent discovery, never replaces human hiring judgment`,
    subEngineLabel: "Talent matching engine",
    reflections: "Talent marketplace scaffolds",
    executiveReviewEntries: "High-potential talent entries",
    scaffoldNotes: "RBAC-protected talent marketplace scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT bypass talent marketplace RBAC, expose career aspirations without employee consent, or expose employee data beyond authorized profile visibility`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports internal talent discovery — users retain hiring judgment control and career aspirations stay protected unless shared.`,
      philosophy: "People First. RBAC-protected talent marketplace scaffolds. Growth Partner terminology — never Affiliate.",
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
        ? "Talentmarked"
        : locale === "sv"
          ? "Talangmarknad"
          : locale === "da"
            ? "Talentmarked"
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
      'export * from "./implementation-blueprint-phase245-vocabulary";',
      `export * from "./implementation-blueprint-phase245-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE245_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase245-aipify-organizational-health-workforce-insights.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE245_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase245-aipify-organizational-health-workforce-insights.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_organizational_health_workforce_insights.view`, `aipify_organizational_health_workforce_insights.manage`, `aipify_organizational_health_workforce_insights.steward`.";
  const entry = `\n**Skills & Internal Talent Marketplace Engine (Phase 246):** See [AIPIFY_SKILLS_INTERNAL_TALENT_MARKETPLACE_ENGINE_PHASE246.md](./AIPIFY_SKILLS_INTERNAL_TALENT_MARKETPLACE_ENGINE_PHASE246.md) — Skill profiles, self-assessments, manager validation, endorsements, internal opportunity marketplace, project matching, cross-department discovery, hidden talent, career aspirations, skill gap analysis, internal mobility, and talent analytics. Continues Organizational Continuity Era (244–248). \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** bypassing talent marketplace RBAC, exposing career aspirations without employee consent, or exposing employee data beyond authorized profile visibility. Cross-links only: Employee Growth Engine Phase 219, Learning Center, Mentorship & Knowledge Transfer Engine Phase 243, Succession Planning Engine Phase 244, Enterprise Analytics Engine Phase 235, Enterprise Notification Engine Phase 233, Aipify Translate Phase 238. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 246")) {
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
  console.error(`Phase ${P.phase} docs generated; stack requires Phase 245 artifacts: ${err.message}`);
  process.exitCode = 1;
}
