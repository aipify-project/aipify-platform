#!/usr/bin/env node
/** ABOS Phase 270 — Enterprise Collective Intelligence Engine (Collective Intelligence Era 269–273) */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "collective_intelligence_dashboard",
  "intelligence_contribution_engine",
  "collective_signal_detection",
  "intelligence_clustering",
  "organizational_consensus_mapping",
  "intelligence_prioritization",
  "executive_collective_intelligence_dashboard",
  "collective_recommendations",
  "intelligence_timeline",
  "collective_intelligence_integration_center",
];

const P = {
  phase: 270,
  migration: "20261419800000_aipify_enterprise_collective_intelligence_engine_phase270.sql",
  slug: "aipify-enterprise-collective-intelligence-engine",
  base: "AipifyEnterpriseCollectiveIntelligence",
  camel: "aipifyEnterpriseCollectiveIntelligenceEngine",
  snake: "aipify_enterprise_collective_intelligence",
  permPrefix: "aipify_enterprise_collective_intelligence",
  helper: "aecie",
  bp: "aeciebp270",
  decisionType: "aipify_enterprise_collective_intelligence_engine",
  title: "Enterprise Collective Intelligence",
  centerTitle: "Collective Intelligence Center",
  companion: "Collective Intelligence Companion",
  scoreKey: "aipify_enterprise_collective_intelligence_score",
  modeKey: "enterprise_collective_intelligence_mode",
  levelKey: "enterprise_collective_intelligence_index_level",
  thirdEntity: "enterprise_collective_intelligence_notes",
  era: "Collective Intelligence Era (269–273)",
  eraRange: "269–273",
  docSlug: "AIPIFY_ENTERPRISE_COLLECTIVE_INTELLIGENCE",
  ilmFile: "implementation-blueprint-phase270-aipify-enterprise-collective-intelligence.txt",
  navLabel: "Collective Intelligence",
  crossLinkNote: "Cross-links only: Organizational Memory Engine Phase 260, Organizational Insights & Executive Intelligence Engine Phase 223, Employee Knowledge Engine, External Intelligence Engine Phase 255, and Organizational Energy Engine Phase 269 — Aipify synthesizes intelligence; leadership determines direction; never omit collective intelligence audit history.",
  companionLimitations: [
    "replacing_leadership_direction",
    "making_strategic_decisions_for_leadership",
    "hiding_diverging_perspectives",
    "overwhelming_with_unfiltered_signals",
    "bypassing_privacy_settings",
    "modifying_collective_intelligence_audit_trail",
    "unlogged_collective_recommendations",
    "override_leadership_direction"
  ]
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom267(content) {
  const pairs = [
    ["AipifyEnterpriseExecutiveCopilot", "AipifyEnterpriseCollectiveIntelligence"],
    ["aipify-enterprise-executive-copilot-engine", "aipify-enterprise-collective-intelligence-engine"],
    ["aipify_enterprise_executive_copilot", "aipify_enterprise_collective_intelligence"],
    ["aipifyEnterpriseExecutiveCopilotEngine", "aipifyEnterpriseCollectiveIntelligenceEngine"],
    ["aeecpebp267", "aeciebp270"],
    ["_aeecpe_", "_aecie_"],
    ["aipify_enterprise_executive_copilot_score", "aipify_enterprise_collective_intelligence_score"],
    ["enterprise_executive_copilot_mode", "enterprise_collective_intelligence_mode"],
    ["enterprise_executive_copilot_effectiveness_level", "enterprise_collective_intelligence_index_level"],
    ["enterprise_executive_copilot_notes", "enterprise_collective_intelligence_notes"],
    ["EnterpriseExecutiveCopilotNotes", "EnterpriseCollectiveIntelligenceNotes"],
    ["enterprise_executive_copilot_notes_count", "enterprise_collective_intelligence_notes_count"],
    ["Executive Copilot Phase 267", "__CI_PHASE_267__"],
    ["Executive Copilot Companion", "__CI_COMPANION__"],
    ["Enterprise Executive Copilot", "Enterprise Collective Intelligence"],
    ["__CI_COMPANION__", "Collective Intelligence Companion"],
    ["Executive Copilot Center", "__CI_CENTER__"],
    ["__CI_PHASE_267__", "Executive Copilot Phase 267"],
    ["Phase 267", "Phase 270"],
    ["aipify_enterprise_executive_copilot.view", "aipify_enterprise_collective_intelligence.view"],
    ["aipify_enterprise_executive_copilot.manage", "aipify_enterprise_collective_intelligence.manage"],
    ["aipify_enterprise_executive_copilot.steward", "aipify_enterprise_collective_intelligence.steward"],
    ["aipify_enterprise_executive_copilot_engine", "aipify_enterprise_collective_intelligence_engine"],
    ["20261419500000_aipify_enterprise_executive_copilot_engine_phase267.sql", "20261419800000_aipify_enterprise_collective_intelligence_engine_phase270.sql"],
    ["Repo Phase 267", "Repo Phase 270"],
    ["Phase 267 —", "Phase 270 —"],
    ["IMPLEMENTATION_BLUEPRINT_PHASE267_AIPIFY_ENTERPRISE_EXECUTIVE_COPILOT", "IMPLEMENTATION_BLUEPRINT_PHASE270_AIPIFY_ENTERPRISE_COLLECTIVE_INTELLIGENCE"],
    ["implementation-blueprint-phase267", "implementation-blueprint-phase270"],
    ["executive_insight_timeline", "intelligence_timeline"],
    ["executive_copilot_dashboard", "collective_intelligence_dashboard"],
    ["executive_briefing_engine", "intelligence_contribution_engine"],
    ["priority_intelligence_engine", "collective_signal_detection"],
    ["executive_attention_management_engine", "intelligence_clustering"],
    ["decision_support_workspace", "organizational_consensus_mapping"],
    ["executive_follow_through_tracking", "intelligence_prioritization"],
    ["cross_functional_executive_view", "executive_collective_intelligence_dashboard"],
    ["executive_copilot_integration_center", "collective_intelligence_integration_center"],
    ["executive_copilot_companion", "collective_intelligence_companion"],
    ["_seed_enterprise_executive_copilot_notes", "_seed_enterprise_collective_intelligence_notes"],
    ["executive briefing stewardship", "intelligence contribution stewardship"],
    ["priority-informed executive support", "signal-informed collective support"],
    ["executive-focus leadership culture", "knowledge-sharing culture"],
    ["active executive priorities", "active intelligence contributions"],
    ["decisions requiring executive attention", "themes requiring leadership attention"],
    ["Executive Briefing Engine", "Intelligence Contribution Engine"],
    ["Priority Intelligence", "Collective Signal Detection"],
    ["Executive Attention Management", "Intelligence Clustering"],
    ["Decision Support Workspace", "Organizational Consensus Mapping"],
    ["Executive Follow-Through Tracking", "Intelligence Prioritization"],
    ["Executive Insight Timeline", "Executive Collective Intelligence Dashboard"],
    ["executive insight timeline indicators", "intelligence evolution indicators"],
    ["executive briefing prompts", "contribution prompts"],
    ["executive copilot prompts", "collective intelligence prompts"],
    ["cross-functional executive view", "executive collective intelligence dashboard"],
    ["executive attention triggers", "emerging signal triggers"],
    ["RBAC-protected executive copilot governance", "RBAC-protected collective intelligence governance"],
    ["Aipify advises — executives decide", "Aipify synthesizes — leadership determines direction"],
    ["Executives decide", "Leadership determines direction"],
    ["Support decisions without replacing judgment", "Support awareness without replacing direction"],
    ["no_bypassing_executive_copilot_governance", "no_bypassing_collective_intelligence_governance"],
    ["AIPIFY_ENTERPRISE_EXECUTIVE_COPILOT", "AIPIFY_ENTERPRISE_COLLECTIVE_INTELLIGENCE"],
    ["enterprise executive copilot", "enterprise collective intelligence"],
    ["Executive copilot audit logs", "Collective intelligence audit logs"],
    ["executive copilot governance RBAC", "collective intelligence governance RBAC"],
    ["executive copilot scaffolds", "collective intelligence scaffolds"],
    ["organization executive briefing policies", "organization collective intelligence policies"],
    ["Executive effectiveness index", "Collective intelligence index"],
    ["Executive effectiveness level", "Collective intelligence index level"],
    ["Insight timeline entries", "Intelligence timeline entries"],
    ["executive commitment stewardship", "intelligence action stewardship"],
    ["executive copilot records beyond RBAC", "collective intelligence records beyond RBAC"],
    ["executive recommendation assistance", "collective recommendation assistance"],
    ["executive cross-functional visibility", "organizational intelligence visibility"],
    ["Autonomous Coordination Engine Phase 266, Organizational Insights & Executive Intelligence Engine Phase 223, Strategic Execution Engine Phase 263, Decision Support Engine, and Executive Cockpit Phase 200", "Organizational Memory Engine Phase 260, Organizational Insights & Executive Intelligence Engine Phase 223, Employee Knowledge Engine, External Intelligence Engine Phase 255, and Organizational Energy Engine Phase 269"],
    ["Never replace executive judgment or make decisions on behalf of executives", "Never replace leadership direction or make strategic decisions on behalf of leadership"],
    ["executive priorities", "intelligence priorities"],
    ["Executive priorities", "Intelligence priorities"],
    ["executive attention routing", "theme prioritization routing"],
    ["decides without executive judgment", "directs without leadership approval"],
    ["Unauthorized executive action without executive approval", "Unauthorized strategic action without leadership approval"],
    ["Modifying executive copilot audit trails", "Modifying collective intelligence audit trails"],
    ["Decide before executive review", "Act before leadership review"],
    ["user executive control", "user leadership control"],
    ["User executive control", "User leadership control"],
    ["briefing outcomes and executive preference policies", "contribution outcomes and privacy policies"],
    ["executive insight visibility", "participation insight visibility"],
    ["executive copilot", "collective intelligence"],
    ["enable executives to maintain awareness, prioritize effectively, identify emerging risks and opportunities, and support high-quality decision-making — maintaining executive copilot governance, executives decide with Aipify advisory support, full audit logging, role-based permissions, and leadership effectiveness that compounds over time", "enable organizations to identify, aggregate, and elevate collective knowledge, experiences, observations, and insights — maintaining collective intelligence governance, leadership determines direction with Aipify synthesis support, full audit logging, role-based permissions, and shared organizational advantage that compounds over time"],
    ["executive decision delays reduce, strategic focus improves, follow-through rates increase, executive engagement rises, emerging issues are identified faster, and executive effectiveness scores strengthen with Aipify advises — executives decide", "participation levels increase, cross-functional alignment improves, emerging themes are identified faster, action conversion rates rise, knowledge-sharing strengthens, and collective intelligence index performance improves with Aipify synthesizes — leadership determines direction"],
    ["Continues the era.", "Continues the era."],
    ["continues the era", "continues the era"],
    ["Opportunity Discovery Era continues", "Collective Intelligence Era continues"],
    ["Opportunity Discovery Era (264–268)", "Collective Intelligence Era (269–273)"],
    ["264–268", "269–273"],
    ["__CI_CENTER__", "Collective Intelligence Center"],
  ];
  let out = content;
  for (const [from, to] of pairs) out = out.split(from).join(to);
  return out;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 270 — Collective Intelligence Center. Collective Intelligence Companion supports enterprise collective intelligence — NOT replacing leadership direction, making strategic decisions for leadership, or omitting collective intelligence audit history. Helpers _${bp}_*.'; $$;
create or replace function public._${bp}_mission() returns text language sql immutable as $$ select 'Identify, aggregate, and elevate collective knowledge, experiences, observations, and insights — Collective Intelligence Companion synthesizes; leadership determines direction.'; $$;
create or replace function public._${bp}_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._${bp}_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Collective Intelligence Center within Collective Intelligence Era (269–273). Aipify synthesizes; leadership determines direction; intelligence-governed contributions; full audit logging; Collective Intelligence Companion informs and recommends. Continues the era.'; $$;
create or replace function public._${bp}_vision() returns text language sql immutable as $$ select 'Organizations increase participation levels, improve cross-functional alignment, identify emerging themes faster, raise action conversion rates, strengthen knowledge-sharing behaviors, and improve collective intelligence index performance with Aipify synthesizes — leadership determines direction.'; $$;
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Collective Intelligence Center programs', 'emoji', '✅', 'description', 'Ten collective intelligence modules'),
    jsonb_build_object('key', 'intelligence_contribution_engine', 'label', 'Intelligence contribution engine', 'emoji', '📋', 'description', 'Knowledge from all parts of the organization'),
    jsonb_build_object('key', 'collective_signal_detection', 'label', 'Collective signal detection', 'emoji', '🔍', 'description', 'Patterns across multiple sources'),
    jsonb_build_object('key', 'intelligence_clustering', 'label', 'Intelligence clustering', 'emoji', '📊', 'description', 'Related insights grouped into themes'),
    jsonb_build_object('key', 'companion', 'label', 'Collective Intelligence Companion', 'emoji', '✨', 'description', 'Synthesizes — leadership determines direction'),
    jsonb_build_object('key', 'organizational_consensus_mapping', 'label', 'Organizational consensus mapping', 'emoji', '🧪', 'description', 'Alignment and diverging perspectives'),
    jsonb_build_object('key', 'intelligence_prioritization', 'label', 'Intelligence prioritization', 'emoji', '🛡️', 'description', 'Focus on most valuable insights'),
    jsonb_build_object('key', 'intelligence_timeline', 'label', 'Intelligence timeline', 'emoji', '🔔', 'description', 'Track how ideas evolve over time')
  ); $$;
create or replace function public._${bp}_collective_intelligence_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Collective Intelligence Center — ten capabilities. Aipify synthesizes — leadership determines direction.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'intelligence_contribution_engine', 'label', 'Intelligence Contribution Engine'),
    jsonb_build_object('key', 'collective_signal_detection', 'label', 'Collective Signal Detection'),
    jsonb_build_object('key', 'intelligence_clustering', 'label', 'Intelligence Clustering'),
    jsonb_build_object('key', 'organizational_consensus_mapping', 'label', 'Organizational Consensus Mapping'),
    jsonb_build_object('key', 'intelligence_prioritization', 'label', 'Intelligence Prioritization'),
    jsonb_build_object('key', 'executive_collective_intelligence_dashboard', 'label', 'Executive Collective Intelligence Dashboard'),
    jsonb_build_object('key', 'collective_recommendations', 'label', 'Aipify Collective Recommendations'),
    jsonb_build_object('key', 'intelligence_timeline', 'label', 'Intelligence Timeline'),
    jsonb_build_object('key', 'participation_insights', 'label', 'Organizational Participation Insights'),
    jsonb_build_object('key', 'collective_intelligence_index', 'label', 'Collective Intelligence Index')
  )); $$;
create or replace function public._${bp}_intelligence_contribution_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Intelligence contribution engine — allow knowledge to emerge from all parts of the organization.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'employee_contributions', 'label', 'Are employee observations captured?'),
    jsonb_build_object('key', 'leader_insights', 'label', 'Are leader recommendations included?'),
    jsonb_build_object('key', 'operational_workflows', 'label', 'Do operational workflows contribute lessons learned?'),
    jsonb_build_object('key', 'contribution_types', 'label', 'Are observations, risks, and opportunities supported?'),
    jsonb_build_object('key', 'leadership_direction', 'label', 'How does contribution support leadership determines direction — not replace direction?')
  )); $$;
create or replace function public._${bp}_collective_signal_detection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Collective signal detection — identify patterns appearing across multiple sources.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'repeated_concerns', 'label', 'Repeated concerns detected'),
    jsonb_build_object('key', 'similar_recommendations', 'label', 'Similar recommendations grouped'),
    jsonb_build_object('key', 'weak', 'label', 'Weak signal strength'),
    jsonb_build_object('key', 'developing', 'label', 'Developing signal strength'),
    jsonb_build_object('key', 'significant', 'label', 'Significant signal strength'),
    jsonb_build_object('key', 'strong_consensus', 'label', 'Strong consensus signal strength')
  )); $$;
create or replace function public._${bp}_executive_collective_intelligence_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive collective intelligence dashboard — organizational awareness for leaders.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'emerging_themes', 'label', 'Top emerging themes widget'),
    jsonb_build_object('key', 'intelligence_trends', 'label', 'Intelligence trends overview'),
    jsonb_build_object('key', 'consensus_areas', 'label', 'Areas of strong consensus'),
    jsonb_build_object('key', 'leadership_attention', 'label', 'Areas requiring leadership attention'),
    jsonb_build_object('key', 'opportunity_clusters', 'label', 'Opportunity clusters')
  )); $$;
create or replace function public._${bp}_collective_intelligence_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Collective Intelligence Companion — synthesizes and recommends; never replaces leadership direction or makes strategic decisions for leadership.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'investigate_themes', 'label', 'Investigate emerging theme recommendations'),
    jsonb_build_object('key', 'pilot_initiatives', 'label', 'Launch pilot initiative suggestions'),
    jsonb_build_object('key', 'escalate_concerns', 'label', 'Escalate critical concern guidance'),
    jsonb_build_object('key', 'cross_functional_reviews', 'label', 'Facilitate cross-functional review suggestions'),
    jsonb_build_object('key', 'strategic_priorities', 'label', 'Update strategic priority recommendations'),
    jsonb_build_object('key', 'intelligence_guardrails', 'label', 'Collective intelligence governance — Trust Architecture enforced')
  )); $$;
create or replace function public._${bp}_intelligence_clustering() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Intelligence clustering — group related insights into actionable themes.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'customer_intelligence', 'label', 'Customer intelligence cluster'),
    jsonb_build_object('key', 'workforce_intelligence', 'label', 'Workforce intelligence cluster'),
    jsonb_build_object('key', 'operational_intelligence', 'label', 'Operational intelligence cluster'),
    jsonb_build_object('key', 'strategic_intelligence', 'label', 'Strategic intelligence cluster'),
    jsonb_build_object('key', 'theme_ownership', 'label', 'Theme ownership assignment')
  )); $$;
create or replace function public._${bp}_organizational_consensus_mapping() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Organizational consensus mapping — help leaders understand areas of alignment.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'broad_agreement', 'label', 'Broad agreement areas'),
    jsonb_build_object('key', 'diverging_perspectives', 'label', 'Diverging perspectives'),
    jsonb_build_object('key', 'fragmented', 'label', 'Fragmented consensus level'),
    jsonb_build_object('key', 'emerging_alignment', 'label', 'Emerging alignment consensus level'),
    jsonb_build_object('key', 'strong_alignment', 'label', 'Strong alignment consensus level')
  )); $$;
create or replace function public._${bp}_intelligence_prioritization() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Intelligence prioritization — focus attention on the most valuable insights.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'strategic_relevance', 'label', 'Strategic relevance scoring factor'),
    jsonb_build_object('key', 'cross_functional_impact', 'label', 'Cross-functional impact scoring factor'),
    jsonb_build_object('key', 'informational', 'label', 'Informational priority level'),
    jsonb_build_object('key', 'valuable', 'label', 'Valuable priority level'),
    jsonb_build_object('key', 'high_impact', 'label', 'High impact priority level')
  )); $$;
create or replace function public._${bp}_intelligence_timeline() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Intelligence timeline — track how ideas evolve over time.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'initial_signals', 'label', 'Initial signals captured'),
    jsonb_build_object('key', 'growth_in_support', 'label', 'Growth in support tracked'),
    jsonb_build_object('key', 'validation_milestones', 'label', 'Validation milestones recorded'),
    jsonb_build_object('key', 'actions_taken', 'label', 'Actions taken logged'),
    jsonb_build_object('key', 'leadership_direction', 'label', 'Aipify synthesizes — leadership determines direction'),
    jsonb_build_object('key', 'index_levels', 'label', 'Isolated, Developing, Connected, Collaborative, Collectively Intelligent')
  )); $$;
create or replace function public._${bp}_collective_intelligence_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Collective intelligence integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'organizational_memory', 'label', 'Organizational Memory Phase 260', 'cross_link', '/app/aipify-enterprise-organizational-memory-engine'),
    jsonb_build_object('key', 'executive_intelligence', 'label', 'Organizational Insights & Executive Intelligence Phase 223', 'cross_link', '/app/aipify-organizational-insights-executive-intelligence-engine'),
    jsonb_build_object('key', 'employee_knowledge', 'label', 'Employee Knowledge Engine', 'cross_link', '/app/settings/employee-knowledge'),
    jsonb_build_object('key', 'external_intelligence', 'label', 'External Intelligence Phase 255', 'cross_link', '/app/aipify-enterprise-external-intelligence-market-awareness-engine'),
    jsonb_build_object('key', 'organizational_energy', 'label', 'Organizational Energy Phase 269', 'cross_link', '/app/aipify-enterprise-organizational-energy-engine'),
    jsonb_build_object('key', 'leadership_gates', 'label', 'Leadership gates — Aipify synthesizes only')
  )); $$;
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Replacing leadership direction',
      'Making strategic decisions for leadership',
      'Hiding diverging perspectives',
      'Overwhelming with unfiltered signals',
      'Modifying collective intelligence audit trails',
      'Unlogged collective recommendations',
      'Bypassing privacy settings',
      'Override leadership direction'), 'principle', 'Collective Intelligence Companion synthesizes — leadership determines direction and intelligence history stays auditable.'); $$;
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm collective intelligence support without pressure.', 'values', jsonb_build_array('aipify_synthesizes','leadership_determines_direction','low_friction_contribution','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Collective intelligence audit logs via aipify_enterprise_collective_intelligence_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_collective_intelligence permissions — collective intelligence governance RBAC'),
    jsonb_build_object('key', 'leadership_gates', 'label', 'Leadership determines direction — Aipify synthesizes only'),
    jsonb_build_object('key', 'privacy_policies', 'label', 'Organization-defined privacy and contribution policies'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Collective intelligence metadata only — no raw operational records'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 269, 'key', 'enterprise_organizational_energy', 'label', 'Organizational Energy Phase 269', 'route', '/app/aipify-enterprise-organizational-energy-engine', 'description', 'Organizational vitality — cross-link only'),
    jsonb_build_object('phase', 270, 'key', 'enterprise_collective_intelligence', 'label', 'Collective Intelligence Phase 270', 'route', '/app/aipify-enterprise-collective-intelligence-engine', 'description', 'Enterprise collective intelligence — continues era'),
    jsonb_build_object('phase', 271, 'key', 'enterprise_future_readiness', 'label', 'Future Readiness Phase 271', 'route', '/app/aipify-enterprise-future-readiness-engine', 'description', 'Future readiness — cross-link only')
  ); $$;
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'executive_copilot', 'label', 'Executive Copilot Phase 267', 'route', '/app/aipify-enterprise-executive-copilot-engine', 'relationship', 'Executive awareness — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/executive', 'relationship', 'Executive landing — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Leadership determines direction — cross-link only')
  ); $$;
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as $$ select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); $$;
create or replace function public._${bp}_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Collective Intelligence Center internally with intelligence-governed contributions and full audit logging. Growth Partner terminology. Collective Intelligence Companion synthesizes — never replaces leadership direction or makes strategic decisions for leadership.'; $$;
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — leadership determines direction.', 'Collective Intelligence Companion synthesizes and recommends.', 'Aipify synthesizes — leadership determines direction.', 'Growth Partner — never Affiliate.', 'Collective Intelligence Era continues — 269–273.'); $$;
create or replace function public._${bp}_privacy_note() returns text language sql immutable as $$
  select 'Collective Intelligence Center metadata only — contribution summaries max ~500 chars. No raw operational records beyond RBAC or PII in audit logs. Respects organizational privacy settings.'; $$;
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

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_strategic_objective_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Intelligence contribution engine — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_intelligence_contribution_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_relationship_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Intelligence contribution engine — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_intelligence_contribution_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_critical_function_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Intelligence contribution engine — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_intelligence_contribution_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_memory_capture_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Intelligence contribution engine — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_intelligence_contribution_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_improvement_opportunity_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Intelligence contribution engine — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_intelligence_contribution_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_decision_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Intelligence contribution engine — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_intelligence_contribution_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_action_queue_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Intelligence contribution engine — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_intelligence_contribution_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_trend_monitoring_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Intelligence contribution engine — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_intelligence_contribution_engine()->'reflection_questions') = 5,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_strategic_execution_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Collective Intelligence Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_collective_intelligence_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_relationship_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Collective Intelligence Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_collective_intelligence_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_resilience_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Collective Intelligence Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_collective_intelligence_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_memory_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Collective Intelligence Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_collective_intelligence_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_improvement_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Collective Intelligence Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_collective_intelligence_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_decision_governance_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Collective Intelligence Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_collective_intelligence_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_orchestration_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Collective Intelligence Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_collective_intelligence_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_intelligence_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Collective Intelligence Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_collective_intelligence_dashboard()->'capabilities') = 10,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 3,`,
  );

  const replaceRpcRef = (sqlText, fn) => {
    if (fn === "collective_intelligence_dashboard") {
      return sqlText.replace(/public\._(\w+)_collective_intelligence_dashboard\(\)/g, (full, prefix) =>
        prefix.includes("executive") ? full : `public._${P.bp}_collective_intelligence_dashboard()`,
      );
    }
    return sqlText.replace(
      new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"),
      `public._${P.bp}_${fn}()`,
    );
  };

  for (const fn of [...SCAFFOLDS, "collective_intelligence_companion"].sort((a, b) => b.length - a.length)) {
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
    "RBAC-protected enterprise collective intelligence guidance within Collective Intelligence Era;",
    "RBAC-protected enterprise collective intelligence guidance within Collective Intelligence Era;",
  );
  sql = sql.replaceAll(
    "RBAC-protected enterprise collective intelligence guidance within Collective Intelligence Era;",
    "RBAC-protected enterprise collective intelligence guidance within Collective Intelligence Era;",
  );
  sql = sql.replaceAll(
    "RBAC-protected enterprise continuous improvement guidance within Continuous Optimization Era;",
    "RBAC-protected enterprise collective intelligence guidance within Collective Intelligence Era;",
  );
  sql = sql.replace(
    /Phase 270 Enterprise Collective Intelligence Engine —/,
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
  sql = sql.replace(
    /Phase 261 Enterprise Resilience & Business Continuity Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 259 Enterprise Continuous Improvement Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 258 Enterprise Decision Escalation & Governance Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 256 Enterprise Action Orchestration Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 255 Enterprise External Intelligence & Market Awareness Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );

  sql = sql.replaceAll("__TRANSLATE_CENTER__", P.centerTitle);

  sql = sql.replace(
    /'memory_memory_dashboard', public\._\w+_memory_memory_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_intelligence_timeline()`,
  );
  sql = sql.replace(
    /'improvement_improvement_dashboard', public\._\w+_improvement_improvement_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_intelligence_timeline()`,
  );
  sql = sql.replace(
    /'decision_decision_governance_dashboard', public\._\w+_decision_decision_governance_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_intelligence_timeline()`,
  );
  sql = sql.replace(
    /'orchestration_orchestration_dashboard', public\._\w+_orchestration_orchestration_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_intelligence_timeline()`,
  );
  sql = sql.replace(
    /'governance_rules_dashboard', public\._\w+_governance_rules_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_intelligence_timeline()`,
  );
  sql = sql.replace(
    /'improvement_controls_dashboard', public\._\w+_improvement_controls_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_intelligence_timeline()`,
  );
  sql = sql.replace(
    /'policy_controls_dashboard', public\._\w+_policy_controls_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_intelligence_timeline()`,
  );
  sql = sql.replace(
    /'intelligence_controls_dashboard', public\._\w+_intelligence_controls_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_intelligence_timeline()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_resilience_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_collective_intelligence_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_memory_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_collective_intelligence_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_improvement_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_collective_intelligence_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_decision_governance_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_collective_intelligence_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_orchestration_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_collective_intelligence_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_intelligence_controls_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_collective_intelligence_dashboard()`,
  );

  sql = sql.replace(
    /'memory_controls_dashboard', public\._\w+_memory_controls_dashboard\(\)/,
    `'executive_insight_timeline', public._${P.bp}_intelligence_timeline()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_memory_controls_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_collective_intelligence_dashboard()`,
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

${P.centerTitle} within ${P.era}. **Continues the era.** ${P.companion} supports intelligence contribution engine, collective signal detection, intelligence clustering, organizational consensus mapping, intelligence prioritization, executive collective intelligence dashboard, Aipify collective recommendations, intelligence timeline, organizational participation insights, and collective intelligence index — does NOT replace leadership direction, make strategic decisions for leadership, or omit collective intelligence audit history.

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

## What is the Enterprise Collective Intelligence Engine?

The Enterprise Collective Intelligence Engine helps organizations identify, aggregate, and elevate collective knowledge, experiences, observations, and insights at \`/app/${P.slug}\`.

## What collective intelligence features are included?

Intelligence contribution engine, collective signal detection, intelligence clustering, organizational consensus mapping, intelligence prioritization, executive collective intelligence dashboard, Aipify collective recommendations, intelligence timeline, organizational participation insights, and collective intelligence index.

## What signal strength levels apply?

Weak, developing, significant, and strong consensus — with cluster categories customer, workforce, operational, strategic, innovation, and governance intelligence.

## What consensus levels apply?

Fragmented, emerging alignment, strong alignment, and organization-wide consensus.

## What does the collective intelligence flow look like?

Insights generated → signals detected → themes clustered → consensus evaluated → priorities established → recommendations surfaced → leadership actions initiated → outcomes reviewed → collective intelligence strengthened.

## Who can access collective intelligence?

Super Admin (full access), Tenant Admin (privacy policies), Executives (executive collective intelligence dashboard), Theme owners (cluster refinement), Contributors (low-friction contribution) — enterprise RBAC.

## Is full audit logging enforced?

**Yes.** Every collective intelligence lifecycle event is logged. Contribution metadata and recommendation history are recorded.

## How does this integrate with other Aipify surfaces?

${P.crossLinkNote}

## Does the Collective Intelligence Companion replace leadership direction?

**No.** Aipify synthesizes — **leadership determines direction.** ${P.companion} does **NOT** replace leadership direction, make strategic decisions for leadership, or omit collective intelligence audit history.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Collective Intelligence: contribution engine, signal detection, clustering, consensus mapping, prioritization, executive dashboard, collective recommendations, intelligence timeline, participation insights, collective intelligence index.
Signal strength: weak, developing, significant, strong consensus.
Cluster categories: customer, workforce, operational, strategic, innovation, governance.
Consensus levels: fragmented, emerging alignment, strong alignment, organization-wide consensus.
Priority levels: informational, valuable, high impact, strategic importance.
Index levels: isolated, developing, connected, collaborative, collectively intelligent.
Flow: insights generated → signals detected → themes clustered → consensus evaluated → priorities established → recommendations surfaced → leadership actions → outcomes reviewed → intelligence strengthened.
Security: collective intelligence governance RBAC, leadership gates, audit logging, metadata only, privacy settings, enterprise permissions, 2FA.
Design principles: Aipify synthesizes — leadership determines direction, low-friction contribution, executive-grade pattern visualization.
Companion limitations: no replacing leadership direction, no strategic decisions for leadership, no hiding diverging perspectives, no overwhelming with unfiltered signals.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate. Era continues 269–273.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} synthesizes; never replaces leadership direction, makes strategic decisions for leadership, or omits collective intelligence audit history.";
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
      '| "aipifyEnterpriseOrganizationalEnergyEngine"',
      `| "aipifyEnterpriseOrganizationalEnergyEngine"\n  | "${id}"`,
    );
  }
  if (!c.includes(href)) {
    const anchor =
      /id: "aipifyEnterpriseOrganizationalEnergyEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyEnterpriseOrganizationalEnergyEngine",\n  },/;
    c = c.replace(
      anchor,
      (m) =>
        `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-enterprise-organizational-energy-engine")) {\n    return "aipifyEnterpriseOrganizationalEnergyEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-enterprise-organizational-energy-engine")) {\n    return "aipifyEnterpriseOrganizationalEnergyEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace(
        '"aipify_enterprise_organizational_energy.view",',
        `"aipify_enterprise_organizational_energy.view",\n    "${perm}",`,
      );
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-enterprise-future-readiness-engine";',
      `export * from "./aipify-enterprise-future-readiness-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era} continues. ${P.companion} supports intelligence contribution engine, collective signal detection, intelligence clustering, organizational consensus mapping, intelligence prioritization, and executive collective intelligence dashboard. Aipify synthesizes — leadership determines direction. Does NOT replace leadership direction or make strategic decisions for leadership. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Collective intelligence index",
    modeLabel: "Mode",
    readinessLabel: "Collective intelligence index level",
    executiveReviews: "Executive collective intelligence dashboard",
    activeReflections: "Active collective intelligence scaffolds",
    humanOversightRequired: `Leadership determines direction — users retain intelligence control; ${P.companion} synthesizes only`,
    eraOpenerSummary: `Collective Intelligence Era — Phases ${P.eraRange} (continues)`,
    eraOpenerNote:
      "Cross-link only — do not duplicate Organizational Memory Engine, Organizational Insights & Executive Intelligence Engine, Employee Knowledge Engine, External Intelligence Engine, or Organizational Energy Engine RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Intelligence contribution engine — contribution prompts",
    frameworkLabel: "Collective signal detection",
    reviewsLabel: "Executive collective intelligence dashboard",
    companionLabel: `${P.companion} — synthesizes intelligence, leadership determines direction`,
    subEngineLabel: "Intelligence clustering",
    reflections: "Collective intelligence scaffolds",
    executiveReviewEntries: "Intelligence timeline entries",
    scaffoldNotes: "Leadership-governed intelligence scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT replace leadership direction, make strategic decisions for leadership, or omit collective intelligence audit history`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports enterprise collective intelligence — leadership determines direction and intelligence history stays auditable.`,
      philosophy:
        "People First. Aipify synthesizes — leadership determines direction. Growth Partner terminology — never Affiliate.",
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
        ? "Kollektiv intelligens"
        : locale === "sv"
          ? "Kollektiv intelligens"
          : locale === "da"
            ? "Kollektiv intelligens"
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
      'export * from "./implementation-blueprint-phase271-vocabulary";',
      `export * from "./implementation-blueprint-phase271-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE271_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase271-aipify-enterprise-future-readiness.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE271_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase271-aipify-enterprise-future-readiness.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const entry = `\n**Enterprise Collective Intelligence Engine (Phase 270):** See [AIPIFY_ENTERPRISE_COLLECTIVE_INTELLIGENCE_PHASE270.md](./AIPIFY_ENTERPRISE_COLLECTIVE_INTELLIGENCE_PHASE270.md) — Intelligence contribution engine, collective signal detection, intelligence clustering, organizational consensus mapping, intelligence prioritization, executive collective intelligence dashboard, Aipify collective recommendations, intelligence timeline, organizational participation insights, and collective intelligence index. **Continues** Collective Intelligence Era (269–273). \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} synthesizes — **NOT** replacing leadership direction, making strategic decisions for leadership, or omitting collective intelligence audit history. Cross-links only: Organizational Memory Engine Phase 260, Organizational Insights & Executive Intelligence Engine Phase 223, Employee Knowledge Engine, External Intelligence Engine Phase 255, Organizational Energy Engine Phase 269. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 270")) {
    const anchor = "**Enterprise Future Readiness Engine (Phase 271):**";
    const idx = c.indexOf(anchor);
    c = idx === -1 ? `${c}\n${entry}\n` : `${c.slice(0, idx)}${entry}\n${c.slice(idx)}`;
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
