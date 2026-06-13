#!/usr/bin/env node
/** ABOS Phase 279 — Enterprise Organizational Wisdom Engine (Organizational Wisdom Era 279–283) */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const SCAFFOLDS = [
  "wisdom_center_dashboard",
  "wisdom_registry",
  "experience_synthesis_engine",
  "decision_reflection_framework",
  "wisdom_recommendation_engine",
  "leadership_wisdom_insights",
  "executive_wisdom_dashboard",
  "wisdom_integration_center",
];

const P = {
  phase: 279,
  migration: "20261420700000_aipify_enterprise_organizational_wisdom_engine_phase279.sql",
  slug: "aipify-enterprise-organizational-wisdom-engine",
  base: "AipifyEnterpriseOrganizationalWisdom",
  camel: "aipifyEnterpriseOrganizationalWisdomEngine",
  snake: "aipify_enterprise_organizational_wisdom",
  permPrefix: "aipify_enterprise_organizational_wisdom",
  helper: "aeowe",
  bp: "aeowebp279",
  decisionType: "aipify_enterprise_organizational_wisdom_engine",
  title: "Enterprise Organizational Wisdom",
  centerTitle: "Wisdom Center",
  companion: "Wisdom Companion",
  scoreKey: "aipify_enterprise_organizational_wisdom_score",
  modeKey: "enterprise_organizational_wisdom_mode",
  levelKey: "enterprise_wisdom_index_level",
  thirdEntity: "enterprise_organizational_wisdom_notes",
  era: "Organizational Wisdom Era (279–283)",
  eraRange: "279–283",
  docSlug: "AIPIFY_ENTERPRISE_ORGANIZATIONAL_WISDOM",
  ilmFile: "implementation-blueprint-phase279-aipify-enterprise-organizational-wisdom.txt",
  navLabel: "Organizational Wisdom",
  crossLinkNote: "Cross-links only: Organizational Trust Engine Phase 278, Executive Copilot Engine Phase 267, Decision Support Engine, Learning Engine, and Collective Intelligence Engine Phase 270 — wisdom informs judgment; humans exercise judgment; never omit organizational wisdom audit history.",
  companionLimitations: [
    "replacing_human_judgment",
    "dictating_decisions",
    "conflating_knowledge_with_wisdom",
    "bypassing_leadership_review",
    "modifying_organizational_wisdom_audit_trail",
    "unlogged_wisdom_recommendations",
    "hiding_reflection_gaps",
    "override_humans_exercise_judgment"
  ]
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom267(content) {
  const pairs = [
    ["AipifyEnterpriseExecutiveCopilot", "AipifyEnterpriseOrganizationalWisdom"],
    ["aipify-enterprise-executive-copilot-engine", "aipify-enterprise-organizational-wisdom-engine"],
    ["aipify_enterprise_executive_copilot", "aipify_enterprise_organizational_wisdom"],
    ["aipifyEnterpriseExecutiveCopilotEngine", "aipifyEnterpriseOrganizationalWisdomEngine"],
    ["aeecpebp267", "aeowebp279"],
    ["_aeecpe_", "_aeowe_"],
    ["aipify_enterprise_executive_copilot_score", "aipify_enterprise_organizational_wisdom_score"],
    ["enterprise_executive_copilot_mode", "enterprise_organizational_wisdom_mode"],
    ["enterprise_executive_copilot_effectiveness_level", "enterprise_wisdom_index_level"],
    ["enterprise_executive_copilot_notes", "enterprise_organizational_wisdom_notes"],
    ["EnterpriseExecutiveCopilotNotes", "EnterpriseOrganizationalWisdomNotes"],
    ["enterprise_executive_copilot_notes_count", "enterprise_organizational_wisdom_notes_count"],
    ["Executive Copilot Phase 267", "__WISDOM_PHASE_267__"],
    ["Executive Copilot Companion", "__WISDOM_COMPANION__"],
    ["Enterprise Executive Copilot", "Enterprise Organizational Wisdom"],
    ["__WISDOM_COMPANION__", "Wisdom Companion"],
    ["Executive Copilot Center", "__WISDOM_CENTER__"],
    ["__WISDOM_PHASE_267__", "Executive Copilot Phase 267"],
    ["Phase 267", "Phase 279"],
    ["aipify_enterprise_executive_copilot.view", "aipify_enterprise_organizational_wisdom.view"],
    ["aipify_enterprise_executive_copilot.manage", "aipify_enterprise_organizational_wisdom.manage"],
    ["aipify_enterprise_executive_copilot.steward", "aipify_enterprise_organizational_wisdom.steward"],
    ["aipify_enterprise_executive_copilot_engine", "aipify_enterprise_organizational_wisdom_engine"],
    ["20261419500000_aipify_enterprise_executive_copilot_engine_phase267.sql", "20261420700000_aipify_enterprise_organizational_wisdom_engine_phase279.sql"],
    ["Repo Phase 267", "Repo Phase 279"],
    ["Phase 267 —", "Phase 279 —"],
    ["IMPLEMENTATION_BLUEPRINT_PHASE267_AIPIFY_ENTERPRISE_EXECUTIVE_COPILOT", "IMPLEMENTATION_BLUEPRINT_PHASE279_AIPIFY_ENTERPRISE_ORGANIZATIONAL_WISDOM"],
    ["implementation-blueprint-phase267", "implementation-blueprint-phase279"],
    ["executive_insight_timeline", "wisdom_history"],
    ["executive_copilot_dashboard", "wisdom_center_dashboard"],
    ["executive_briefing_engine", "wisdom_registry"],
    ["priority_intelligence_engine", "experience_synthesis_engine"],
    ["executive_attention_management_engine", "decision_reflection_framework"],
    ["decision_support_workspace", "wisdom_recommendation_engine"],
    ["executive_follow_through_tracking", "leadership_wisdom_insights"],
    ["cross_functional_executive_view", "executive_wisdom_dashboard"],
    ["executive_copilot_integration_center", "wisdom_integration_center"],
    ["executive_copilot_companion", "wisdom_companion"],
    ["_seed_enterprise_executive_copilot_notes", "_seed_enterprise_organizational_wisdom_notes"],
    ["executive briefing stewardship", "wisdom registry stewardship"],
    ["priority-informed executive support", "wisdom-informed support"],
    ["executive-focus leadership culture", "wisdom-driven culture"],
    ["active executive priorities", "active wisdom registry entries"],
    ["decisions requiring executive attention", "wisdom entries requiring leadership attention"],
    ["Executive Briefing Engine", "Wisdom Registry"],
    ["Priority Intelligence", "Experience Synthesis Engine"],
    ["Executive Attention Management", "Decision Reflection Framework"],
    ["Decision Support Workspace", "Wisdom Recommendation Engine"],
    ["Executive Follow-Through Tracking", "Leadership Wisdom Insights"],
    ["Executive Insight Timeline", "Executive Wisdom Dashboard"],
    ["executive insight timeline indicators", "wisdom history indicators"],
    ["executive briefing prompts", "wisdom registry prompts"],
    ["executive copilot prompts", "organizational wisdom prompts"],
    ["cross-functional executive view", "executive wisdom dashboard"],
    ["executive attention triggers", "experience synthesis triggers"],
    ["RBAC-protected executive copilot governance", "RBAC-protected organizational wisdom governance"],
    ["Aipify advises — executives decide", "Wisdom informs judgment — humans exercise judgment"],
    ["Executives decide", "Humans exercise judgment"],
    ["Support decisions without replacing judgment", "Support judgment without replacing human decision-making"],
    ["no_bypassing_executive_copilot_governance", "no_bypassing_organizational_wisdom_governance"],
    ["AIPIFY_ENTERPRISE_EXECUTIVE_COPILOT", "AIPIFY_ENTERPRISE_ORGANIZATIONAL_WISDOM"],
    ["enterprise executive copilot", "enterprise organizational wisdom"],
    ["Executive copilot audit logs", "Organizational wisdom audit logs"],
    ["executive copilot governance RBAC", "organizational wisdom governance RBAC"],
    ["executive copilot scaffolds", "organizational wisdom scaffolds"],
    ["organization executive briefing policies", "organization wisdom and reflection policies"],
    ["Executive effectiveness index", "Organizational wisdom index"],
    ["Executive effectiveness level", "Organizational wisdom index level"],
    ["Insight timeline entries", "Wisdom history entries"],
    ["executive commitment stewardship", "wisdom application stewardship"],
    ["executive copilot records beyond RBAC", "organizational wisdom records beyond RBAC"],
    ["executive recommendation assistance", "wisdom recommendation assistance"],
    ["executive cross-functional visibility", "institutional perspective visibility"],
    ["Autonomous Coordination Engine Phase 266, Organizational Insights & Executive Intelligence Engine Phase 223, Strategic Execution Engine Phase 263, Decision Support Engine, and Executive Cockpit Phase 200", "Organizational Trust Engine Phase 278, Executive Copilot Engine Phase 267, Decision Support Engine, Learning Engine, and Collective Intelligence Engine Phase 270"],
    ["Never replace executive judgment or make decisions on behalf of executives", "Never replace human judgment or conflate knowledge with wisdom"],
    ["executive priorities", "wisdom priorities"],
    ["Executive priorities", "Wisdom priorities"],
    ["executive attention routing", "wisdom recommendation routing"],
    ["decides without executive judgment", "decides without human judgment"],
    ["Unauthorized executive action without executive approval", "Unauthorized wisdom application without leadership review"],
    ["Modifying executive copilot audit trails", "Modifying organizational wisdom audit trails"],
    ["Decide before executive review", "Apply wisdom before leadership review"],
    ["user executive control", "user judgment control"],
    ["User executive control", "User judgment control"],
    ["briefing outcomes and executive preference policies", "wisdom outcomes and reflection policies"],
    ["executive insight visibility", "executive wisdom visibility"],
    ["executive copilot", "organizational wisdom"],
    ["enable executives to maintain awareness, prioritize effectively, identify emerging risks and opportunities, and support high-quality decision-making — maintaining executive copilot governance, executives decide with Aipify advisory support, full audit logging, role-based permissions, and leadership effectiveness that compounds over time", "enable organizations to transform accumulated knowledge, experience, outcomes, and reflections into practical wisdom that improves future judgment, leadership maturity, and long-term decision quality — maintaining organizational wisdom governance, humans exercise judgment with Aipify wisdom support, full audit logging, role-based permissions, and institutional maturity that compounds over time"],
    ["executive decision delays reduce, strategic focus improves, follow-through rates increase, executive engagement rises, emerging issues are identified faster, and executive effectiveness scores strengthen with Aipify advises — executives decide", "reflection participation increases, decision quality improves, historical insight reuse grows, leadership maturity indicators rise, long-term outcomes strengthen, and organizational wisdom index performance improves with wisdom informs judgment — humans exercise judgment"],
    ["__WISDOM_CENTER__", "Wisdom Center"],
  ];
  let out = content;
  for (const [from, to] of pairs) out = out.split(from).join(to);
  return out;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 279 — Wisdom Center. Wisdom Companion supports enterprise organizational wisdom — NOT replacing human judgment, dictating decisions, or omitting organizational wisdom audit history. Helpers _${bp}_*.'; $$;
create or replace function public._${bp}_mission() returns text language sql immutable as $$ select 'Transform accumulated knowledge, experience, outcomes, and reflections into practical wisdom that improves future judgment, leadership maturity, and long-term decision quality — Wisdom Companion informs judgment; humans exercise judgment.'; $$;
create or replace function public._${bp}_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._${bp}_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Wisdom Center within Organizational Wisdom Era (279–283). Wisdom informs judgment; humans exercise judgment; governance-governed institutional learning; full audit logging; Wisdom Companion informs and recommends. Opens the era.'; $$;
create or replace function public._${bp}_vision() returns text language sql immutable as $$ select 'Organizations increase reflection participation, improve decision quality, reuse historical insights, strengthen leadership maturity indicators, improve long-term outcomes, and organizational wisdom index performance with wisdom informs judgment — humans exercise judgment.'; $$;
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Wisdom Center programs', 'emoji', '✅', 'description', 'Ten organizational wisdom modules'),
    jsonb_build_object('key', 'wisdom_registry', 'label', 'Wisdom registry', 'emoji', '📋', 'description', 'Structured repository of institutional wisdom'),
    jsonb_build_object('key', 'experience_synthesis_engine', 'label', 'Experience synthesis engine', 'emoji', '🔍', 'description', 'Transform experiences into reusable guidance'),
    jsonb_build_object('key', 'decision_reflection_framework', 'label', 'Decision reflection framework', 'emoji', '📊', 'description', 'Encourage organizational learning'),
    jsonb_build_object('key', 'companion', 'label', 'Wisdom Companion', 'emoji', '✨', 'description', 'Informs judgment — humans exercise judgment'),
    jsonb_build_object('key', 'wisdom_recommendation_engine', 'label', 'Wisdom recommendation engine', 'emoji', '🧪', 'description', 'Context-aware guidance'),
    jsonb_build_object('key', 'leadership_wisdom_insights', 'label', 'Leadership wisdom insights', 'emoji', '🛡️', 'description', 'Support leadership development'),
    jsonb_build_object('key', 'wisdom_history', 'label', 'Wisdom history', 'emoji', '🔔', 'description', 'Organizational maturity preserved')
  ); $$;
create or replace function public._${bp}_wisdom_center_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Wisdom Center — ten capabilities. Wisdom informs judgment — humans exercise judgment.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'wisdom_registry', 'label', 'Wisdom Registry'),
    jsonb_build_object('key', 'experience_synthesis_engine', 'label', 'Experience Synthesis Engine'),
    jsonb_build_object('key', 'decision_reflection_framework', 'label', 'Decision Reflection Framework'),
    jsonb_build_object('key', 'wisdom_recommendation_engine', 'label', 'Wisdom Recommendation Engine'),
    jsonb_build_object('key', 'leadership_wisdom_insights', 'label', 'Leadership Wisdom Insights'),
    jsonb_build_object('key', 'executive_wisdom_dashboard', 'label', 'Executive Wisdom Dashboard'),
    jsonb_build_object('key', 'wisdom_application_tracking', 'label', 'Wisdom Application Tracking'),
    jsonb_build_object('key', 'wisdom_history', 'label', 'Wisdom History'),
    jsonb_build_object('key', 'wisdom_review_cadence', 'label', 'Wisdom Review Cadence'),
    jsonb_build_object('key', 'organizational_wisdom_index', 'label', 'Organizational Wisdom Index')
  )); $$;
create or replace function public._${bp}_wisdom_registry() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Wisdom registry — structured repository of institutional wisdom.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'wisdom_title', 'label', 'Is wisdom title and origin source recorded?'),
    jsonb_build_object('key', 'contributors', 'label', 'Are contributors, related initiatives, and related decisions captured?'),
    jsonb_build_object('key', 'application_guidance', 'label', 'Are date captured and practical application guidance documented?'),
    jsonb_build_object('key', 'categories', 'label', 'Are wisdom categories documented — leadership, operational, customer, governance, strategic, workforce?'),
    jsonb_build_object('key', 'human_judgment', 'label', 'How does registry support humans exercise judgment — not replace judgment?')
  )); $$;
create or replace function public._${bp}_experience_synthesis_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Experience synthesis engine — transform repeated experiences into reusable guidance.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'lessons_learned', 'label', 'Lessons learned input synthesis'),
    jsonb_build_object('key', 'valuable', 'label', 'Valuable importance level'),
    jsonb_build_object('key', 'significant', 'label', 'Significant importance level'),
    jsonb_build_object('key', 'critical', 'label', 'Critical importance level'),
    jsonb_build_object('key', 'foundational', 'label', 'Foundational importance level'),
    jsonb_build_object('key', 'principles_derived', 'label', 'Principles derived output')
  )); $$;
create or replace function public._${bp}_executive_wisdom_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive wisdom dashboard — institutional perspective for leaders.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'recent_wisdom', 'label', 'Recently captured wisdom widget'),
    jsonb_build_object('key', 'referenced_guidance', 'label', 'Most referenced guidance'),
    jsonb_build_object('key', 'emerging_principles', 'label', 'Emerging principles'),
    jsonb_build_object('key', 'reflection_rates', 'label', 'Reflection completion rates'),
    jsonb_build_object('key', 'wisdom_index', 'label', 'Wisdom index')
  )); $$;
create or replace function public._${bp}_wisdom_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Wisdom Companion — provides context-aware guidance; never replaces human judgment or conflates knowledge with wisdom.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'historically_effective', 'label', 'Historically effective recommendation label'),
    jsonb_build_object('key', 'proceed_carefully', 'label', 'Proceed carefully recommendation label'),
    jsonb_build_object('key', 'leadership_review', 'label', 'Leadership review recommended label'),
    jsonb_build_object('key', 'similar_situations', 'label', 'Similar historical situation guidance'),
    jsonb_build_object('key', 'proven_approaches', 'label', 'Proven approach suggestions'),
    jsonb_build_object('key', 'wisdom_guardrails', 'label', 'Organizational wisdom governance — Trust Architecture enforced')
  )); $$;
create or replace function public._${bp}_decision_reflection_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Decision reflection framework — encourage organizational learning.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'what_decision', 'label', 'What decision was made captured'),
    jsonb_build_object('key', 'pending_reflection', 'label', 'Pending reflection review state'),
    jsonb_build_object('key', 'reviewed', 'label', 'Reviewed review state'),
    jsonb_build_object('key', 'institutionalized', 'label', 'Institutionalized review state'),
    jsonb_build_object('key', 'what_would_change', 'label', 'What would we change captured')
  )); $$;
create or replace function public._${bp}_wisdom_recommendation_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Wisdom recommendation engine — context-aware guidance from historical insight.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'similar_situations', 'label', 'Similar historical situations'),
    jsonb_build_object('key', 'lessons_learned', 'label', 'Relevant lessons learned'),
    jsonb_build_object('key', 'organizational_principles', 'label', 'Established organizational principles'),
    jsonb_build_object('key', 'proven_approaches', 'label', 'Proven approaches recommended'),
    jsonb_build_object('key', 'human_judgment', 'label', 'Wisdom informs judgment — humans exercise judgment')
  )); $$;
create or replace function public._${bp}_leadership_wisdom_insights() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Leadership wisdom insights — support leadership development.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'leadership_themes', 'label', 'Recurring leadership theme analysis'),
    jsonb_build_object('key', 'decision_quality', 'label', 'Decision quality trend analysis'),
    jsonb_build_object('key', 'reflection_participation', 'label', 'Reflection participation tracking'),
    jsonb_build_object('key', 'learning_behaviors', 'label', 'Strategic learning behavior analysis'),
    jsonb_build_object('key', 'maturity_indicators', 'label', 'Leadership maturity indicators output')
  )); $$;
create or replace function public._${bp}_wisdom_history() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Wisdom history — preserve organizational maturity over time.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'wisdom_created', 'label', 'Wisdom entries created captured'),
    jsonb_build_object('key', 'principles_refined', 'label', 'Principles refined recorded'),
    jsonb_build_object('key', 'lessons_learned', 'label', 'Reflection outcomes logged'),
    jsonb_build_object('key', 'human_judgment', 'label', 'Wisdom informs judgment — humans exercise judgment'),
    jsonb_build_object('key', 'index_levels', 'label', 'Reactive, Learning, Reflective, Wise, Institutionally Mature')
  )); $$;
create or replace function public._${bp}_wisdom_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Wisdom integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'organizational_trust', 'label', 'Organizational Trust Phase 278', 'cross_link', '/app/aipify-enterprise-organizational-trust-engine'),
    jsonb_build_object('key', 'executive_copilot', 'label', 'Executive Copilot Phase 267', 'cross_link', '/app/aipify-enterprise-executive-copilot-engine'),
    jsonb_build_object('key', 'decision_support', 'label', 'Decision Support Engine', 'cross_link', '/app/assistant/decisions'),
    jsonb_build_object('key', 'learning_engine', 'label', 'Learning Engine', 'cross_link', '/app/learning'),
    jsonb_build_object('key', 'collective_intelligence', 'label', 'Collective Intelligence Phase 270', 'cross_link', '/app/aipify-enterprise-collective-intelligence-engine'),
    jsonb_build_object('key', 'judgment_gates', 'label', 'Judgment gates — wisdom informs judgment only')
  )); $$;
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Replacing human judgment',
      'Dictating decisions',
      'Conflating knowledge with wisdom',
      'Bypassing leadership review',
      'Modifying organizational wisdom audit trails',
      'Unlogged wisdom recommendations',
      'Hiding reflection gaps',
      'Override humans exercise judgment'), 'principle', 'Wisdom Companion informs judgment — humans exercise judgment and wisdom history stays auditable.'); $$;
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — thoughtful wisdom support without pressure.', 'values', jsonb_build_array('wisdom_informs_judgment','humans_exercise_judgment','thoughtful_language','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Organizational wisdom audit logs via aipify_enterprise_organizational_wisdom_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_organizational_wisdom permissions — organizational wisdom governance RBAC'),
    jsonb_build_object('key', 'judgment_gates', 'label', 'Humans exercise judgment — wisdom informs judgment only'),
    jsonb_build_object('key', 'wisdom_policies', 'label', 'Organization-defined wisdom and reflection policies'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Organizational wisdom metadata only — no raw operational records'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 278, 'key', 'enterprise_organizational_trust', 'label', 'Organizational Trust Phase 278', 'route', '/app/aipify-enterprise-organizational-trust-engine', 'description', 'Organizational trust — cross-link only'),
    jsonb_build_object('phase', 279, 'key', 'enterprise_organizational_wisdom', 'label', 'Organizational Wisdom Phase 279', 'route', '/app/aipify-enterprise-organizational-wisdom-engine', 'description', 'Enterprise organizational wisdom — opens era')
  ); $$;
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'executive_copilot', 'label', 'Executive Copilot Phase 267', 'route', '/app/aipify-enterprise-executive-copilot-engine', 'relationship', 'Executive awareness — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/executive', 'relationship', 'Executive landing — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Humans exercise judgment — cross-link only')
  ); $$;
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as $$ select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); $$;
create or replace function public._${bp}_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Wisdom Center internally with governance-governed institutional learning and full audit logging. Growth Partner terminology. Wisdom Companion informs judgment — never replaces human judgment or conflates knowledge with wisdom.'; $$;
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans exercise judgment.', 'Wisdom Companion transforms experience into practical guidance.', 'Wisdom informs judgment — humans exercise judgment.', 'Growth Partner — never Affiliate.', 'Organizational Wisdom Era opens — 279–283.'); $$;
create or replace function public._${bp}_privacy_note() returns text language sql immutable as $$
  select 'Wisdom Center metadata only — wisdom summaries max ~500 chars. No raw operational records beyond RBAC or PII in audit logs. Clear distinction between knowledge and wisdom.'; $$;
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_enterprise_executive_copilot_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._aeecpebp267_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  const engineCriterion = `jsonb_build_object('key', 'engine', 'label', 'Wisdom registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_wisdom_registry()->'reflection_questions') = 5,`;
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_\w+\(\)->'reflection_questions'\) = 5,/g,
    engineCriterion,
  );

  const centerCriterion = `jsonb_build_object('key', 'center', 'label', 'Wisdom Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_wisdom_center_dashboard()->'capabilities') = 10,`;
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_\w+\(\)->'capabilities'\) = \d+,/g,
    centerCriterion,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  const replaceRpcRef = (sqlText, fn) => {
    if (fn === "wisdom_center_dashboard") {
      return sqlText.replace(/public\._(\w+)_wisdom_center_dashboard\(\)/g, (full, prefix) =>
        prefix.includes("executive") ? full : `public._${P.bp}_wisdom_center_dashboard()`,
      );
    }
    return sqlText.replace(
      new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"),
      `public._${P.bp}_${fn}()`,
    );
  };

  for (const fn of [...SCAFFOLDS, "wisdom_companion"].sort((a, b) => b.length - a.length)) {
    sql = replaceRpcRef(sql, fn);
  }

  sql = sql.replace(
    new RegExp(`select '${P.slug}'[^;]+;`, "g"),
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    /select 'aipify-enterprise-executive-copilot-engine'[^;]+;/g,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected enterprise organizational trust guidance within Commitment & Accountability Era;",
    "RBAC-protected enterprise organizational wisdom guidance within Organizational Wisdom Era;",
  );
  sql = sql.replaceAll(
    "RBAC-protected enterprise organizational simplicity guidance within Commitment & Accountability Era;",
    "RBAC-protected enterprise organizational wisdom guidance within Organizational Wisdom Era;",
  );
  sql = sql.replaceAll(
    "RBAC-protected enterprise execution confidence guidance within Commitment & Accountability Era;",
    "RBAC-protected enterprise organizational wisdom guidance within Organizational Wisdom Era;",
  );
  sql = sql.replaceAll(
    "RBAC-protected enterprise continuous improvement guidance within Continuous Optimization Era;",
    "RBAC-protected enterprise organizational wisdom guidance within Organizational Wisdom Era;",
  );
  sql = sql.replace(
    /Phase 279 Enterprise Organizational Wisdom Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 264 Enterprise Opportunity Discovery Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 263 Enterprise Strategic Execution Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 262 Enterprise Trust & Relationship Intelligence Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );

  sql = sql.replaceAll("__TRANSLATE_CENTER__", P.centerTitle);

  sql = sql.replace(
    /'memory_memory_dashboard', public\._\w+_memory_memory_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_wisdom_history()`,
  );
  sql = sql.replace(
    /'improvement_improvement_dashboard', public\._\w+_improvement_improvement_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_wisdom_history()`,
  );
  sql = sql.replace(
    /'decision_decision_governance_dashboard', public\._\w+_decision_decision_governance_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_wisdom_history()`,
  );
  sql = sql.replace(
    /'orchestration_orchestration_dashboard', public\._\w+_orchestration_orchestration_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_wisdom_history()`,
  );
  sql = sql.replace(
    /'governance_rules_dashboard', public\._\w+_governance_rules_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_wisdom_history()`,
  );
  sql = sql.replace(
    /'improvement_controls_dashboard', public\._\w+_improvement_controls_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_wisdom_history()`,
  );
  sql = sql.replace(
    /'policy_controls_dashboard', public\._\w+_policy_controls_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_wisdom_history()`,
  );
  sql = sql.replace(
    /'intelligence_controls_dashboard', public\._\w+_intelligence_controls_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_wisdom_history()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_resilience_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_wisdom_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_memory_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_wisdom_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_improvement_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_wisdom_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_decision_governance_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_wisdom_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_orchestration_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_wisdom_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_intelligence_controls_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_wisdom_dashboard()`,
  );
  sql = sql.replace(
    /'memory_controls_dashboard', public\._\w+_memory_controls_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_wisdom_history()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_memory_controls_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_wisdom_dashboard()`,
  );

  return sql;
}

function genMigration() {
  const src267 = path.join(
    ROOT,
    "supabase/migrations/20261419500000_aipify_enterprise_executive_copilot_engine_phase267.sql",
  );
  if (!fs.existsSync(src267)) throw new Error("Phase 267 migration required");
  let m = transformFrom267(fs.readFileSync(src267, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-enterprise-executive-copilot-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(
    path.join(ROOT, `lib/core/${P.slug}.ts`),
    transformFrom267(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")),
  );
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(
      path.join(dst, f),
      transformFrom267(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")),
    );
  }
  const panel = path.join(
    ROOT,
    `components/app/${srcSlug}/AipifyEnterpriseExecutiveCopilotEngineDashboardPanel.tsx`,
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`),
    transformFrom267(fs.readFileSync(panel, "utf8")),
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/index.ts`),
    `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`,
  );
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom267(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom267(
        fs.readFileSync(path.join(ROOT, `app/api/aipify/${srcSlug}/${route}/route.ts`), "utf8"),
      ),
    );
  }
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. **Opens the era.** ${P.companion} supports wisdom registry, experience synthesis engine, decision reflection framework, wisdom recommendation engine, leadership wisdom insights, executive wisdom dashboard, wisdom application tracking, wisdom history, wisdom review cadence, and organizational wisdom index — does NOT replace human judgment, dictate decisions, or omit organizational wisdom audit history.

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
Era: ${P.era} (opens)
${P.crossLinkNote}
`,
  );
  write(
    path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
    `# ${P.title} Engine — FAQ (Phase ${P.phase})

## What is the Enterprise Organizational Wisdom Engine?

The Enterprise Organizational Wisdom Engine helps organizations transform accumulated knowledge, experience, outcomes, and reflections into practical wisdom that improves future judgment, leadership maturity, and long-term decision quality at \`/app/${P.slug}\`.

## What organizational wisdom features are included?

Wisdom registry, experience synthesis engine, decision reflection framework, wisdom recommendation engine, leadership wisdom insights, executive wisdom dashboard, wisdom application tracking, wisdom history, wisdom review cadence, and organizational wisdom index.

## What wisdom categories apply?

Leadership wisdom, operational wisdom, customer wisdom, governance wisdom, strategic wisdom, and workforce wisdom — with importance levels valuable, significant, critical, and foundational.

## What recommendation labels apply?

Historically effective, proceed carefully, and leadership review recommended — with review states pending reflection, reviewed, and institutionalized.

## What does the organizational wisdom flow look like?

Experiences accumulated → patterns identified → reflections completed → principles synthesized → recommendations generated → guidance applied → outcomes evaluated → insights refined → organizational wisdom strengthened.

## Who can access organizational wisdom?

Super Admin (full access), Tenant Admin (wisdom policies), Executives (executive wisdom dashboard), Wisdom stewards (wisdom registry), Teams (decision reflection framework) — enterprise RBAC.

## Is full audit logging enforced?

**Yes.** Every organizational wisdom lifecycle event is logged. Wisdom metadata and recommendation history are recorded.

## How does this integrate with other Aipify surfaces?

${P.crossLinkNote}

## Does the Wisdom Companion replace human judgment?

**No.** Wisdom informs judgment — **humans exercise judgment.** ${P.companion} does **NOT** replace human judgment, dictate decisions, or omit organizational wisdom audit history.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Organizational wisdom: wisdom registry, experience synthesis engine, decision reflection framework, wisdom recommendation engine, leadership wisdom insights, executive wisdom dashboard, wisdom application tracking, wisdom history, wisdom review cadence, organizational wisdom index.
Wisdom categories: leadership, operational, customer, governance, strategic, workforce.
Importance levels: valuable, significant, critical, foundational.
Index levels: reactive, learning, reflective, wise, institutionally mature.
Flow: experiences accumulated → patterns identified → reflections completed → principles synthesized → recommendations generated → guidance applied → outcomes evaluated → insights refined → wisdom strengthened.
Security: organizational wisdom governance RBAC, judgment gates, audit logging, metadata only, enterprise permissions, 2FA.
Design principles: wisdom informs judgment — humans exercise judgment, executive-grade experience, clear knowledge vs wisdom distinction.
Companion limitations: no replacing judgment, no dictating decisions, no conflating knowledge with wisdom.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate. Era opens 279–283.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} informs judgment; never replaces human judgment, dictates decisions, or omits organizational wisdom audit history.";
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
    c = c.replace(
      '| "aipifyEnterpriseExecutionConfidenceEngine"',
      `| "aipifyEnterpriseExecutionConfidenceEngine"\n  | "${id}"`,
    );
  }
  if (!c.includes(href)) {
    const anchor =
      /id: "aipifyEnterpriseExecutionConfidenceEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyEnterpriseExecutionConfidenceEngine",\n  },/;
    c = c.replace(
      anchor,
      (m) =>
        `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-enterprise-execution-confidence-engine")) {\n    return "aipifyEnterpriseExecutionConfidenceEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-enterprise-execution-confidence-engine")) {\n    return "aipifyEnterpriseExecutionConfidenceEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace(
        '"aipify_enterprise_organizational_trust.view",',
        `"aipify_enterprise_organizational_trust.view",\n    "${perm}",`,
      );
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-enterprise-organizational-trust-engine";',
      `export * from "./aipify-enterprise-organizational-trust-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era} opens the era. ${P.companion} supports wisdom registry, experience synthesis engine, decision reflection framework, wisdom recommendation engine, leadership wisdom insights, and executive wisdom dashboard. Wisdom informs judgment — humans exercise judgment. Does NOT replace human judgment or dictate decisions. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Organizational wisdom index",
    modeLabel: "Mode",
    readinessLabel: "Organizational wisdom index level",
    executiveReviews: "Executive wisdom dashboard",
    activeReflections: "Active organizational wisdom scaffolds",
    humanOversightRequired: `Humans exercise judgment — users retain decision control; ${P.companion} informs judgment only`,
    eraOpenerSummary: `Organizational Wisdom Era — Phases ${P.eraRange} (opens)`,
    eraOpenerNote:
      "Cross-link only — do not duplicate Organizational Trust Engine Phase 278, Executive Copilot Engine Phase 267, Decision Support Engine, Learning Engine, or Collective Intelligence Engine Phase 270 RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Wisdom registry — registry prompts",
    frameworkLabel: "Experience synthesis engine",
    reviewsLabel: "Executive wisdom dashboard",
    companionLabel: `${P.companion} — informs judgment, humans exercise judgment`,
    subEngineLabel: "Decision reflection framework",
    reflections: "Organizational wisdom scaffolds",
    executiveReviewEntries: "Wisdom history entries",
    scaffoldNotes: "Leadership-governed wisdom scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT replace human judgment, dictate decisions, or omit organizational wisdom audit history`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports enterprise organizational wisdom — humans exercise judgment and wisdom history stays auditable.`,
      philosophy:
        "People First. Wisdom informs judgment — humans exercise judgment. Growth Partner terminology — never Affiliate.",
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
        ? "Organisatorisk visdom"
        : locale === "sv"
          ? "Organisatorisk visdom"
          : locale === "da"
            ? "Organisatorisk visdom"
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
      'export * from "./implementation-blueprint-phase278-vocabulary";',
      `export * from "./implementation-blueprint-phase278-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE278_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase278-aipify-enterprise-organizational-trust.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE278_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase278-aipify-enterprise-organizational-trust.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Enterprise Organizational Wisdom Engine (Phase 279):** See [AIPIFY_ENTERPRISE_ORGANIZATIONAL_WISDOM_PHASE279.md](./AIPIFY_ENTERPRISE_ORGANIZATIONAL_WISDOM_PHASE279.md) — Wisdom registry, experience synthesis engine, decision reflection framework, wisdom recommendation engine, leadership wisdom insights, executive wisdom dashboard, wisdom application tracking, wisdom history, wisdom review cadence, and organizational wisdom index. **Opens** Organizational Wisdom Era (279–283). \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} informs judgment — **NOT** replacing human judgment, dictating decisions, or omitting organizational wisdom audit history. Cross-links only: Organizational Trust Engine Phase 278, Executive Copilot Engine Phase 267, Decision Support Engine, Learning Engine, Collective Intelligence Engine Phase 270. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 279")) {
    c = `${c}\n${entry}\n`;
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
  console.error(`Phase ${P.phase} docs generated; stack requires Phase 267 artifacts: ${err.message}`);
  process.exitCode = 1;
}
