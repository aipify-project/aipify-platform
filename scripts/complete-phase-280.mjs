#!/usr/bin/env node
/** ABOS Phase 280 — Enterprise Legacy & Stewardship Engine (Organizational Wisdom Era 279–283) */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const SCAFFOLDS = [
  "stewardship_center_dashboard",
  "stewardship_registry",
  "legacy_impact_assessment",
  "stewardship_principles_framework",
  "long_term_decision_reflection",
  "stewardship_initiative_tracking",
  "executive_stewardship_dashboard",
  "stewardship_integration_center",
];

const P = {
  phase: 280,
  migration: "20261420800000_aipify_enterprise_legacy_stewardship_engine_phase280.sql",
  slug: "aipify-enterprise-legacy-stewardship-engine",
  base: "AipifyEnterpriseLegacyStewardship",
  camel: "aipifyEnterpriseLegacyStewardshipEngine",
  snake: "aipify_enterprise_legacy_stewardship",
  permPrefix: "aipify_enterprise_legacy_stewardship",
  helper: "aelse",
  bp: "aelsebp280",
  decisionType: "aipify_enterprise_legacy_stewardship_engine",
  title: "Enterprise Legacy & Stewardship",
  centerTitle: "Stewardship Center",
  companion: "Stewardship Companion",
  scoreKey: "aipify_enterprise_legacy_stewardship_score",
  modeKey: "enterprise_legacy_stewardship_mode",
  levelKey: "enterprise_stewardship_index_level",
  thirdEntity: "enterprise_legacy_stewardship_notes",
  era: "Organizational Wisdom Era (279–283)",
  eraRange: "279–283",
  docSlug: "AIPIFY_ENTERPRISE_LEGACY_STEWARDSHIP",
  ilmFile: "implementation-blueprint-phase280-aipify-enterprise-legacy-stewardship.txt",
  navLabel: "Legacy & Stewardship",
  crossLinkNote: "Cross-links only: Organizational Wisdom Engine Phase 279, Future Readiness Engine Phase 271, Employee Knowledge Engine, Resilience & Business Continuity Engine Phase 261, and Organizational Trust Engine Phase 278 — Aipify encourages stewardship; leaders shape legacy; never omit legacy stewardship audit history.",
  companionLimitations: [
    "replacing_leadership_legacy_judgment",
    "dictating_long_term_decisions",
    "short_term_bias_without_review",
    "bypassing_stewardship_review",
    "modifying_legacy_stewardship_audit_trail",
    "unlogged_stewardship_recommendations",
    "hiding_continuity_risks",
    "override_leaders_shape_legacy"
  ]
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom267(content) {
  const pairs = [
    ["AipifyEnterpriseExecutiveCopilot", "AipifyEnterpriseLegacyStewardship"],
    ["aipify-enterprise-executive-copilot-engine", "aipify-enterprise-legacy-stewardship-engine"],
    ["aipify_enterprise_executive_copilot", "aipify_enterprise_legacy_stewardship"],
    ["aipifyEnterpriseExecutiveCopilotEngine", "aipifyEnterpriseLegacyStewardshipEngine"],
    ["aeecpebp267", "aelsebp280"],
    ["_aeecpe_", "_aelse_"],
    ["aipify_enterprise_executive_copilot_score", "aipify_enterprise_legacy_stewardship_score"],
    ["enterprise_executive_copilot_mode", "enterprise_legacy_stewardship_mode"],
    ["enterprise_executive_copilot_effectiveness_level", "enterprise_stewardship_index_level"],
    ["enterprise_executive_copilot_notes", "enterprise_legacy_stewardship_notes"],
    ["EnterpriseExecutiveCopilotNotes", "EnterpriseLegacyStewardshipNotes"],
    ["enterprise_executive_copilot_notes_count", "enterprise_legacy_stewardship_notes_count"],
    ["Executive Copilot Phase 267", "__WISDOM_PHASE_267__"],
    ["Executive Copilot Companion", "__WISDOM_COMPANION__"],
    ["Enterprise Executive Copilot", "Enterprise Legacy & Stewardship"],
    ["__WISDOM_COMPANION__", "Stewardship Companion"],
    ["Executive Copilot Center", "__WISDOM_CENTER__"],
    ["__WISDOM_PHASE_267__", "Executive Copilot Phase 267"],
    ["Phase 267", "Phase 280"],
    ["aipify_enterprise_executive_copilot.view", "aipify_enterprise_legacy_stewardship.view"],
    ["aipify_enterprise_executive_copilot.manage", "aipify_enterprise_legacy_stewardship.manage"],
    ["aipify_enterprise_executive_copilot.steward", "aipify_enterprise_legacy_stewardship.steward"],
    ["aipify_enterprise_executive_copilot_engine", "aipify_enterprise_legacy_stewardship_engine"],
    ["20261419500000_aipify_enterprise_executive_copilot_engine_phase267.sql", "20261420800000_aipify_enterprise_legacy_stewardship_engine_phase280.sql"],
    ["Repo Phase 267", "Repo Phase 280"],
    ["Phase 267 —", "Phase 280 —"],
    ["IMPLEMENTATION_BLUEPRINT_PHASE267_AIPIFY_ENTERPRISE_EXECUTIVE_COPILOT", "IMPLEMENTATION_BLUEPRINT_PHASE280_AIPIFY_ENTERPRISE_LEGACY_STEWARDSHIP"],
    ["implementation-blueprint-phase267", "implementation-blueprint-phase280"],
    ["executive_insight_timeline", "stewardship_history"],
    ["executive_copilot_dashboard", "stewardship_center_dashboard"],
    ["executive_briefing_engine", "stewardship_registry"],
    ["priority_intelligence_engine", "legacy_impact_assessment"],
    ["executive_attention_management_engine", "stewardship_principles_framework"],
    ["decision_support_workspace", "long_term_decision_reflection"],
    ["executive_follow_through_tracking", "stewardship_initiative_tracking"],
    ["cross_functional_executive_view", "executive_stewardship_dashboard"],
    ["executive_copilot_integration_center", "stewardship_integration_center"],
    ["executive_copilot_companion", "stewardship_companion"],
    ["_seed_enterprise_executive_copilot_notes", "_seed_enterprise_legacy_stewardship_notes"],
    ["executive briefing stewardship", "stewardship registry stewardship"],
    ["priority-informed executive support", "wisdom-informed support"],
    ["executive-focus leadership culture", "wisdom-driven culture"],
    ["active executive priorities", "active stewardship registry entries"],
    ["decisions requiring executive attention", "wisdom entries requiring leadership attention"],
    ["Executive Briefing Engine", "Stewardship Registry"],
    ["Priority Intelligence", "Legacy Impact Assessment"],
    ["Executive Attention Management", "Long-Term Decision Reflection"],
    ["Decision Support Workspace", "Stewardship Initiative Tracking"],
    ["Executive Follow-Through Tracking", "Stewardship Principles Framework"],
    ["Executive Insight Timeline", "Executive Stewardship Dashboard"],
    ["executive insight timeline indicators", "stewardship history indicators"],
    ["executive briefing prompts", "stewardship registry prompts"],
    ["executive copilot prompts", "legacy stewardship prompts"],
    ["cross-functional executive view", "executive stewardship dashboard"],
    ["executive attention triggers", "experience synthesis triggers"],
    ["RBAC-protected executive copilot governance", "RBAC-protected legacy stewardship governance"],
    ["Aipify advises — executives decide", "Aipify encourages stewardship — leaders shape legacy"],
    ["Executives decide", "Leaders shape legacy"],
    ["Support decisions without replacing judgment", "Support judgment without replacing human decision-making"],
    ["no_bypassing_executive_copilot_governance", "no_bypassing_organizational_wisdom_governance"],
    ["AIPIFY_ENTERPRISE_EXECUTIVE_COPILOT", "AIPIFY_ENTERPRISE_LEGACY_STEWARDSHIP"],
    ["enterprise executive copilot", "enterprise legacy stewardship"],
    ["Executive copilot audit logs", "Legacy stewardship audit logs"],
    ["executive copilot governance RBAC", "legacy stewardship governance RBAC"],
    ["executive copilot scaffolds", "legacy stewardship scaffolds"],
    ["organization executive briefing policies", "organization wisdom and reflection policies"],
    ["Executive effectiveness index", "Legacy stewardship index"],
    ["Executive effectiveness level", "Legacy stewardship index level"],
    ["Insight timeline entries", "Stewardship history entries"],
    ["executive commitment stewardship", "wisdom application stewardship"],
    ["executive copilot records beyond RBAC", "legacy stewardship records beyond RBAC"],
    ["executive recommendation assistance", "wisdom recommendation assistance"],
    ["executive cross-functional visibility", "institutional perspective visibility"],
    ["Autonomous Coordination Engine Phase 266, Organizational Insights & Executive Intelligence Engine Phase 223, Strategic Execution Engine Phase 263, Decision Support Engine, and Executive Cockpit Phase 200", "Organizational Wisdom Engine Phase 279, Future Readiness Engine Phase 271, Decision Support Engine, Employee Knowledge Engine, Resilience & Business Continuity Engine Phase 261, and Organizational Trust Engine Phase 278"],
    ["Never replace executive judgment or make decisions on behalf of executives", "Never replace leadership legacy judgment or conflate knowledge with wisdom"],
    ["executive priorities", "wisdom priorities"],
    ["Executive priorities", "Wisdom priorities"],
    ["executive attention routing", "wisdom recommendation routing"],
    ["decides without executive judgment", "decides without leadership legacy judgment"],
    ["Unauthorized executive action without executive approval", "Unauthorized wisdom application without leadership review"],
    ["Modifying executive copilot audit trails", "Modifying legacy stewardship audit trails"],
    ["Decide before executive review", "Apply wisdom before leadership review"],
    ["user executive control", "user judgment control"],
    ["User executive control", "User judgment control"],
    ["briefing outcomes and executive preference policies", "wisdom outcomes and reflection policies"],
    ["executive insight visibility", "executive wisdom visibility"],
    ["executive copilot", "legacy stewardship"],
    ["enable executives to maintain awareness, prioritize effectively, identify emerging risks and opportunities, and support high-quality decision-making — maintaining executive copilot governance, executives decide with Aipify advisory support, full audit logging, role-based permissions, and leadership effectiveness that compounds over time", "enable organizations to transform accumulated knowledge, experience, outcomes, and reflections into practical wisdom that improves future judgment, leadership maturity, and long-term decision quality — maintaining legacy stewardship governance, leaders shape legacy with Aipify wisdom support, full audit logging, role-based permissions, and institutional maturity that compounds over time"],
    ["executive decision delays reduce, strategic focus improves, follow-through rates increase, executive engagement rises, emerging issues are identified faster, and executive effectiveness scores strengthen with Aipify advises — executives decide", "reflection participation increases, decision quality improves, historical insight reuse grows, leadership maturity indicators rise, long-term outcomes strengthen, and legacy stewardship index performance improves with wisdom encourages stewardship — leaders shape legacy"],
    ["__WISDOM_CENTER__", "Stewardship Center"],
  ];
  let out = content;
  for (const [from, to] of pairs) out = out.split(from).join(to);
  return out;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 280 — Stewardship Center. Stewardship Companion supports enterprise legacy stewardship — NOT replacing leadership legacy judgment, dictating decisions, or omitting legacy stewardship audit history. Helpers _${bp}_*.'; $$;
create or replace function public._${bp}_mission() returns text language sql immutable as $$ select 'Transform accumulated knowledge, experience, outcomes, and reflections into practical wisdom that improves future judgment, leadership maturity, and long-term decision quality — Stewardship Companion encourages stewardship; leaders shape legacy.'; $$;
create or replace function public._${bp}_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._${bp}_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Stewardship Center within Legacy & Stewardship Era (279–283). Wisdom encourages stewardship; leaders shape legacy; governance-governed institutional learning; full audit logging; Stewardship Companion informs and recommends. Continues the era.'; $$;
create or replace function public._${bp}_vision() returns text language sql immutable as $$ select 'Organizations increase reflection participation, improve decision quality, reuse historical insights, strengthen leadership maturity indicators, improve long-term outcomes, and legacy stewardship index performance with wisdom encourages stewardship — leaders shape legacy.'; $$;
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Stewardship Center programs', 'emoji', '✅', 'description', 'Ten legacy stewardship modules'),
    jsonb_build_object('key', 'stewardship_registry', 'label', 'Stewardship registry', 'emoji', '📋', 'description', 'Structured repository of institutional wisdom'),
    jsonb_build_object('key', 'legacy_impact_assessment', 'label', 'Legacy impact assessment', 'emoji', '🔍', 'description', 'Transform experiences into reusable guidance'),
    jsonb_build_object('key', 'stewardship_principles_framework', 'label', 'Long-term decision reflection', 'emoji', '📊', 'description', 'Encourage organizational learning'),
    jsonb_build_object('key', 'companion', 'label', 'Stewardship Companion', 'emoji', '✨', 'description', 'Encourages stewardship — leaders shape legacy'),
    jsonb_build_object('key', 'long_term_decision_reflection', 'label', 'Stewardship initiative tracking', 'emoji', '🧪', 'description', 'Context-aware guidance'),
    jsonb_build_object('key', 'stewardship_initiative_tracking', 'label', 'Stewardship principles framework', 'emoji', '🛡️', 'description', 'Support leadership development'),
    jsonb_build_object('key', 'stewardship_history', 'label', 'Stewardship history', 'emoji', '🔔', 'description', 'Organizational maturity preserved')
  ); $$;
create or replace function public._${bp}_stewardship_center_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Stewardship Center — ten capabilities. Aipify encourages stewardship — leaders shape legacy.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'stewardship_registry', 'label', 'Stewardship Registry'),
    jsonb_build_object('key', 'legacy_impact_assessment', 'label', 'Legacy Impact Assessment'),
    jsonb_build_object('key', 'stewardship_principles_framework', 'label', 'Long-Term Decision Reflection'),
    jsonb_build_object('key', 'long_term_decision_reflection', 'label', 'Stewardship Initiative Tracking'),
    jsonb_build_object('key', 'stewardship_initiative_tracking', 'label', 'Stewardship Principles Framework'),
    jsonb_build_object('key', 'executive_stewardship_dashboard', 'label', 'Executive Stewardship Dashboard'),
    jsonb_build_object('key', 'wisdom_application_tracking', 'label', 'Institutional Continuity Tracking'),
    jsonb_build_object('key', 'stewardship_history', 'label', 'Wisdom History'),
    jsonb_build_object('key', 'wisdom_review_cadence', 'label', 'Stewardship Index'),
    jsonb_build_object('key', 'organizational_wisdom_index', 'label', 'Legacy & Stewardship Index')
  )); $$;
create or replace function public._${bp}_stewardship_registry() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Stewardship registry — structured repository of institutional wisdom.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'wisdom_title', 'label', 'Is wisdom title and origin source recorded?'),
    jsonb_build_object('key', 'contributors', 'label', 'Are contributors, related initiatives, and related decisions captured?'),
    jsonb_build_object('key', 'application_guidance', 'label', 'Are date captured and practical application guidance documented?'),
    jsonb_build_object('key', 'categories', 'label', 'Are wisdom categories documented — leadership, operational, customer, governance, strategic, workforce?'),
    jsonb_build_object('key', 'human_judgment', 'label', 'How does registry support leaders shape legacy — not replace judgment?')
  )); $$;
create or replace function public._${bp}_legacy_impact_assessment() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Legacy impact assessment — transform repeated experiences into reusable guidance.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'lessons_learned', 'label', 'Lessons learned input synthesis'),
    jsonb_build_object('key', 'valuable', 'label', 'Valuable importance level'),
    jsonb_build_object('key', 'significant', 'label', 'Significant importance level'),
    jsonb_build_object('key', 'critical', 'label', 'Critical importance level'),
    jsonb_build_object('key', 'foundational', 'label', 'Foundational importance level'),
    jsonb_build_object('key', 'principles_derived', 'label', 'Principles derived output')
  )); $$;
create or replace function public._${bp}_executive_stewardship_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive stewardship dashboard — institutional perspective for leaders.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'recent_wisdom', 'label', 'Recently captured wisdom widget'),
    jsonb_build_object('key', 'referenced_guidance', 'label', 'Most referenced guidance'),
    jsonb_build_object('key', 'emerging_principles', 'label', 'Emerging principles'),
    jsonb_build_object('key', 'reflection_rates', 'label', 'Reflection completion rates'),
    jsonb_build_object('key', 'wisdom_index', 'label', 'Wisdom index')
  )); $$;
create or replace function public._${bp}_stewardship_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Stewardship Companion — provides context-aware guidance; never replaces leadership legacy judgment or conflates knowledge with wisdom.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'historically_effective', 'label', 'Historically effective recommendation label'),
    jsonb_build_object('key', 'proceed_carefully', 'label', 'Proceed carefully recommendation label'),
    jsonb_build_object('key', 'leadership_review', 'label', 'Leadership review recommended label'),
    jsonb_build_object('key', 'similar_situations', 'label', 'Similar historical situation guidance'),
    jsonb_build_object('key', 'proven_approaches', 'label', 'Proven approach suggestions'),
    jsonb_build_object('key', 'wisdom_guardrails', 'label', 'Legacy stewardship governance — Trust Architecture enforced')
  )); $$;
create or replace function public._${bp}_stewardship_principles_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Long-term decision reflection — encourage organizational learning.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'what_decision', 'label', 'What decision was made captured'),
    jsonb_build_object('key', 'pending_reflection', 'label', 'Pending reflection review state'),
    jsonb_build_object('key', 'reviewed', 'label', 'Reviewed review state'),
    jsonb_build_object('key', 'institutionalized', 'label', 'Institutionalized review state'),
    jsonb_build_object('key', 'what_would_change', 'label', 'What would we change captured')
  )); $$;
create or replace function public._${bp}_long_term_decision_reflection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Stewardship initiative tracking — context-aware guidance from historical insight.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'similar_situations', 'label', 'Similar historical situations'),
    jsonb_build_object('key', 'lessons_learned', 'label', 'Relevant lessons learned'),
    jsonb_build_object('key', 'organizational_principles', 'label', 'Established organizational principles'),
    jsonb_build_object('key', 'proven_approaches', 'label', 'Proven approaches recommended'),
    jsonb_build_object('key', 'human_judgment', 'label', 'Aipify encourages stewardship — leaders shape legacy')
  )); $$;
create or replace function public._${bp}_stewardship_initiative_tracking() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Stewardship principles framework — support leadership development.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'leadership_themes', 'label', 'Recurring leadership theme analysis'),
    jsonb_build_object('key', 'decision_quality', 'label', 'Decision quality trend analysis'),
    jsonb_build_object('key', 'reflection_participation', 'label', 'Reflection participation tracking'),
    jsonb_build_object('key', 'learning_behaviors', 'label', 'Strategic learning behavior analysis'),
    jsonb_build_object('key', 'maturity_indicators', 'label', 'Leadership maturity indicators output')
  )); $$;
create or replace function public._${bp}_stewardship_history() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Stewardship history — preserve organizational maturity over time.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'wisdom_created', 'label', 'Wisdom entries created captured'),
    jsonb_build_object('key', 'principles_refined', 'label', 'Principles refined recorded'),
    jsonb_build_object('key', 'lessons_learned', 'label', 'Reflection outcomes logged'),
    jsonb_build_object('key', 'human_judgment', 'label', 'Aipify encourages stewardship — leaders shape legacy'),
    jsonb_build_object('key', 'index_levels', 'label', 'Reactive, Learning, Reflective, Wise, Institutionally Mature')
  )); $$;
create or replace function public._${bp}_stewardship_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Wisdom integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'organizational_trust', 'label', 'Organizational Trust Phase 278', 'cross_link', '/app/aipify-enterprise-organizational-wisdom-engine'),
    jsonb_build_object('key', 'executive_copilot', 'label', 'Executive Copilot Phase 267', 'cross_link', '/app/aipify-enterprise-executive-copilot-engine'),
    jsonb_build_object('key', 'decision_support', 'label', 'Decision Support Engine', 'cross_link', '/app/assistant/decisions'),
    jsonb_build_object('key', 'learning_engine', 'label', 'Learning Engine', 'cross_link', '/app/learning'),
    jsonb_build_object('key', 'collective_intelligence', 'label', 'Collective Intelligence Phase 270', 'cross_link', '/app/aipify-enterprise-collective-intelligence-engine'),
    jsonb_build_object('key', 'legacy_gates', 'label', 'Legacy gates — wisdom encourages stewardship only')
  )); $$;
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Replacing leadership legacy judgment',
      'Dictating decisions',
      'Conflating knowledge with wisdom',
      'Bypassing leadership review',
      'Modifying legacy stewardship audit trails',
      'Unlogged wisdom recommendations',
      'Hiding reflection gaps',
      'Override leaders shape legacy'), 'principle', 'Stewardship Companion encourages stewardship — leaders shape legacy and stewardship history stays auditable.'); $$;
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — thoughtful wisdom support without pressure.', 'values', jsonb_build_array('wisdom_informs_judgment','humans_exercise_judgment','thoughtful_language','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Legacy stewardship audit logs via aipify_enterprise_legacy_stewardship_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_legacy_stewardship permissions — legacy stewardship governance RBAC'),
    jsonb_build_object('key', 'legacy_gates', 'label', 'Leaders shape legacy — wisdom encourages stewardship only'),
    jsonb_build_object('key', 'wisdom_policies', 'label', 'Organization-defined wisdom and reflection policies'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Legacy stewardship metadata only — no raw operational records'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 279, 'key', 'enterprise_organizational_wisdom', 'label', 'Organizational Wisdom Phase 279', 'route', '/app/aipify-enterprise-organizational-wisdom-engine', 'description', 'Organizational wisdom — cross-link only'),
    jsonb_build_object('phase', 280, 'key', 'enterprise_legacy_stewardship', 'label', 'Legacy & Stewardship Phase 280', 'route', '/app/aipify-enterprise-legacy-stewardship-engine', 'description', 'Enterprise legacy stewardship — continues era')
  ); $$;
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'executive_copilot', 'label', 'Executive Copilot Phase 267', 'route', '/app/aipify-enterprise-executive-copilot-engine', 'relationship', 'Executive awareness — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/executive', 'relationship', 'Executive landing — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Leaders shape legacy — cross-link only')
  ); $$;
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as $$ select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); $$;
create or replace function public._${bp}_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Stewardship Center internally with governance-governed institutional learning and full audit logging. Growth Partner terminology. Stewardship Companion encourages stewardship — never replaces leadership legacy judgment or conflates knowledge with wisdom.'; $$;
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — leaders shape legacy.', 'Stewardship Companion transforms experience into practical guidance.', 'Aipify encourages stewardship — leaders shape legacy.', 'Growth Partner — never Affiliate.', 'Legacy & Stewardship Era continues — 279–283.'); $$;
create or replace function public._${bp}_privacy_note() returns text language sql immutable as $$
  select 'Stewardship Center metadata only — wisdom summaries max ~500 chars. No raw operational records beyond RBAC or PII in audit logs. Clear distinction between knowledge and wisdom.'; $$;
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

  const engineCriterion = `jsonb_build_object('key', 'engine', 'label', 'Stewardship registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_stewardship_registry()->'reflection_questions') = 5,`;
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_\w+\(\)->'reflection_questions'\) = 5,/g,
    engineCriterion,
  );

  const centerCriterion = `jsonb_build_object('key', 'center', 'label', 'Stewardship Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_stewardship_center_dashboard()->'capabilities') = 10,`;
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_\w+\(\)->'capabilities'\) = \d+,/g,
    centerCriterion,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  const replaceRpcRef = (sqlText, fn) => {
    if (fn === "stewardship_center_dashboard") {
      return sqlText.replace(/public\._(\w+)_stewardship_center_dashboard\(\)/g, (full, prefix) =>
        prefix.includes("executive") ? full : `public._${P.bp}_stewardship_center_dashboard()`,
      );
    }
    return sqlText.replace(
      new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"),
      `public._${P.bp}_${fn}()`,
    );
  };

  for (const fn of [...SCAFFOLDS, "stewardship_companion"].sort((a, b) => b.length - a.length)) {
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
    "RBAC-protected enterprise legacy stewardship guidance within Legacy & Stewardship Era;",
  );
  sql = sql.replaceAll(
    "RBAC-protected enterprise organizational simplicity guidance within Commitment & Accountability Era;",
    "RBAC-protected enterprise legacy stewardship guidance within Legacy & Stewardship Era;",
  );
  sql = sql.replaceAll(
    "RBAC-protected enterprise execution confidence guidance within Commitment & Accountability Era;",
    "RBAC-protected enterprise legacy stewardship guidance within Legacy & Stewardship Era;",
  );
  sql = sql.replaceAll(
    "RBAC-protected enterprise continuous improvement guidance within Continuous Optimization Era;",
    "RBAC-protected enterprise legacy stewardship guidance within Legacy & Stewardship Era;",
  );
  sql = sql.replace(
    /Phase 280 Enterprise Legacy & Stewardship Engine —/,
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
    `'executive_insight_timeline', public._${P.bp}_stewardship_history()`,
  );
  sql = sql.replace(
    /'improvement_improvement_dashboard', public\._\w+_improvement_improvement_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_stewardship_history()`,
  );
  sql = sql.replace(
    /'decision_decision_governance_dashboard', public\._\w+_decision_decision_governance_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_stewardship_history()`,
  );
  sql = sql.replace(
    /'orchestration_orchestration_dashboard', public\._\w+_orchestration_orchestration_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_stewardship_history()`,
  );
  sql = sql.replace(
    /'governance_rules_dashboard', public\._\w+_governance_rules_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_stewardship_history()`,
  );
  sql = sql.replace(
    /'improvement_controls_dashboard', public\._\w+_improvement_controls_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_stewardship_history()`,
  );
  sql = sql.replace(
    /'policy_controls_dashboard', public\._\w+_policy_controls_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_stewardship_history()`,
  );
  sql = sql.replace(
    /'intelligence_controls_dashboard', public\._\w+_intelligence_controls_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_stewardship_history()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_resilience_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_stewardship_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_memory_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_stewardship_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_improvement_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_stewardship_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_decision_governance_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_stewardship_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_orchestration_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_stewardship_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_intelligence_controls_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_stewardship_dashboard()`,
  );
  sql = sql.replace(
    /'memory_controls_dashboard', public\._\w+_memory_controls_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_stewardship_history()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_memory_controls_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_stewardship_dashboard()`,
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

${P.centerTitle} within ${P.era}. **Continues the era.** ${P.companion} supports stewardship registry, legacy impact assessment, long-term decision reflection, stewardship initiative tracking, stewardship principles framework, executive stewardship dashboard, institutional continuity tracking, stewardship history, stewardship index, and legacy stewardship index — does NOT replace leadership legacy judgment, dictate decisions, or omit legacy stewardship audit history.

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
Era: ${P.era} (continues)
${P.crossLinkNote}
`,
  );
  write(
    path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
    `# ${P.title} Engine — FAQ (Phase ${P.phase})

## What is the Enterprise Legacy & Stewardship Engine?

The Enterprise Legacy & Stewardship Engine helps organizations transform accumulated knowledge, experience, outcomes, and reflections into practical wisdom that improves future judgment, leadership maturity, and long-term decision quality at \`/app/${P.slug}\`.

## What legacy stewardship features are included?

Stewardship registry, legacy impact assessment, long-term decision reflection, stewardship initiative tracking, stewardship principles framework, executive stewardship dashboard, institutional continuity tracking, stewardship history, stewardship index, and legacy stewardship index.

## What wisdom categories apply?

Leadership wisdom, operational wisdom, customer wisdom, governance wisdom, strategic wisdom, and workforce wisdom — with importance levels valuable, significant, critical, and foundational.

## What recommendation labels apply?

Historically effective, proceed carefully, and leadership review recommended — with review states pending reflection, reviewed, and institutionalized.

## What does the legacy stewardship flow look like?

Experiences accumulated → patterns identified → reflections completed → principles synthesized → recommendations generated → guidance applied → outcomes evaluated → insights refined → legacy stewardship strengthened.

## Who can access legacy stewardship?

Super Admin (full access), Tenant Admin (wisdom policies), Executives (executive stewardship dashboard), Wisdom stewards (stewardship registry), Teams (long-term decision reflection) — enterprise RBAC.

## Is full audit logging enforced?

**Yes.** Every legacy stewardship lifecycle event is logged. Wisdom metadata and recommendation history are recorded.

## How does this integrate with other Aipify surfaces?

${P.crossLinkNote}

## Does the Stewardship Companion replace leadership legacy judgment?

**No.** Wisdom encourages stewardship — **leaders shape legacy.** ${P.companion} does **NOT** replace leadership legacy judgment, dictate decisions, or omit legacy stewardship audit history.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Legacy stewardship: stewardship registry, legacy impact assessment, long-term decision reflection, stewardship initiative tracking, stewardship principles framework, executive stewardship dashboard, institutional continuity tracking, stewardship history, stewardship index, legacy stewardship index.
Wisdom categories: leadership, operational, customer, governance, strategic, workforce.
Importance levels: valuable, significant, critical, foundational.
Index levels: reactive, learning, reflective, wise, institutionally mature.
Flow: experiences accumulated → patterns identified → reflections completed → principles synthesized → recommendations generated → guidance applied → outcomes evaluated → insights refined → wisdom strengthened.
Security: legacy stewardship governance RBAC, judgment gates, audit logging, metadata only, enterprise permissions, 2FA.
Design principles: wisdom encourages stewardship — leaders shape legacy, executive-grade experience, clear knowledge vs wisdom distinction.
Companion limitations: no replacing judgment, no dictating decisions, no conflating knowledge with wisdom.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate. Era continues 279–283.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} encourages stewardship; never replaces leadership legacy judgment, dictates decisions, or omits legacy stewardship audit history.";
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
      '| "aipifyEnterpriseOrganizationalWisdomEngine"',
      `| "aipifyEnterpriseOrganizationalWisdomEngine"\n  | "${id}"`,
    );
  }
  if (!c.includes(href)) {
    const anchor =
      /id: "aipifyEnterpriseOrganizationalWisdomEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyEnterpriseOrganizationalWisdomEngine",\n  },/;
    c = c.replace(
      anchor,
      (m) =>
        `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-enterprise-organizational-wisdom-engine")) {\n    return "aipifyEnterpriseOrganizationalWisdomEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-enterprise-organizational-wisdom-engine")) {\n    return "aipifyEnterpriseOrganizationalWisdomEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace(
        '"aipify_enterprise_organizational_wisdom.view",',
        `"aipify_enterprise_organizational_wisdom.view",\n    "${perm}",`,
      );
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-enterprise-organizational-wisdom-engine";',
      `export * from "./aipify-enterprise-organizational-wisdom-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era} continues the era. ${P.companion} supports stewardship registry, legacy impact assessment, long-term decision reflection, stewardship initiative tracking, stewardship principles framework, and executive stewardship dashboard. Aipify encourages stewardship — leaders shape legacy. Does NOT replace leadership legacy judgment or dictate decisions. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Legacy stewardship index",
    modeLabel: "Mode",
    readinessLabel: "Legacy stewardship index level",
    executiveReviews: "Executive stewardship dashboard",
    activeReflections: "Active legacy stewardship scaffolds",
    humanOversightRequired: `Leaders shape legacy — users retain decision control; ${P.companion} encourages stewardship only`,
    eraOpenerSummary: `Legacy & Stewardship Era — Phases ${P.eraRange} (continues)`,
    eraOpenerNote:
      "Cross-link only — do not duplicate Organizational Wisdom Engine Phase 279, Future Readiness Engine Phase 271, Decision Support Engine, Learning Engine, or Collective Intelligence Engine Phase 270 RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Stewardship registry — registry prompts",
    frameworkLabel: "Legacy impact assessment",
    reviewsLabel: "Executive stewardship dashboard",
    companionLabel: `${P.companion} — encourages stewardship, leaders shape legacy`,
    subEngineLabel: "Long-term decision reflection",
    reflections: "Legacy stewardship scaffolds",
    executiveReviewEntries: "Stewardship history entries",
    scaffoldNotes: "Leadership-governed wisdom scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT replace leadership legacy judgment, dictate decisions, or omit legacy stewardship audit history`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports enterprise legacy stewardship — leaders shape legacy and stewardship history stays auditable.`,
      philosophy:
        "People First. Aipify encourages stewardship — leaders shape legacy. Growth Partner terminology — never Affiliate.",
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
        ? "Arv og forvaltning"
        : locale === "sv"
          ? "Arv og forvaltning"
          : locale === "da"
            ? "Arv og forvaltning"
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
      'export * from "./implementation-blueprint-phase279-vocabulary";',
      `export * from "./implementation-blueprint-phase279-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE279_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase279-aipify-enterprise-organizational-wisdom.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE279_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase279-aipify-enterprise-organizational-wisdom.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Enterprise Legacy & Stewardship Engine (Phase 280):** See [AIPIFY_ENTERPRISE_LEGACY_STEWARDSHIP_PHASE280.md](./AIPIFY_ENTERPRISE_LEGACY_STEWARDSHIP_PHASE280.md) — Stewardship registry, legacy impact assessment, stewardship principles framework, long-term decision reflection, stewardship initiative tracking, executive stewardship dashboard, Aipify stewardship recommendations, institutional continuity tracking, stewardship history, and stewardship index. **Continues** Organizational Wisdom Era (279–283). \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} encourages stewardship — **NOT** replacing leadership legacy judgment, dictating long-term decisions, or omitting legacy stewardship audit history. Cross-links only: Organizational Wisdom Engine Phase 279, Future Readiness Engine Phase 271, Employee Knowledge Engine, Resilience & Business Continuity Engine Phase 261, Organizational Trust Engine Phase 278. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 280")) {
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
