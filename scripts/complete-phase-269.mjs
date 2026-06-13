#!/usr/bin/env node
/** ABOS Phase 269 — Enterprise Organizational Energy Engine (Organizational Vitality Era 269–273) */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "organizational_energy_dashboard",
  "energy_signal_engine",
  "team_energy_monitoring",
  "executive_energy_insights",
  "momentum_detection",
  "organizational_friction_identification",
  "energy_recovery_recommendations",
  "executive_energy_dashboard",
  "organizational_energy_integration_center",
];

const P = {
  phase: 269,
  migration: "20261419700000_aipify_enterprise_organizational_energy_engine_phase269.sql",
  slug: "aipify-enterprise-organizational-energy-engine",
  base: "AipifyEnterpriseOrganizationalEnergy",
  camel: "aipifyEnterpriseOrganizationalEnergyEngine",
  snake: "aipify_enterprise_organizational_energy",
  permPrefix: "aipify_enterprise_organizational_energy",
  helper: "aeooe",
  bp: "aeooebp269",
  decisionType: "aipify_enterprise_organizational_energy_engine",
  title: "Enterprise Organizational Energy",
  centerTitle: "Organizational Energy Center",
  companion: "Organizational Energy Companion",
  scoreKey: "aipify_enterprise_organizational_energy_score",
  modeKey: "enterprise_organizational_energy_mode",
  levelKey: "enterprise_organizational_energy_index_level",
  thirdEntity: "enterprise_organizational_energy_notes",
  era: "Organizational Vitality Era (269–273)",
  eraRange: "269–273",
  docSlug: "AIPIFY_ENTERPRISE_ORGANIZATIONAL_ENERGY",
  ilmFile: "implementation-blueprint-phase269-aipify-enterprise-organizational-energy.txt",
  navLabel: "Organizational Energy",
  crossLinkNote: "Cross-links only: Wellbeing & Sustainable Performance Engine Phase 220, Executive Copilot Engine Phase 267, Time & Attention Guardian, Workforce Planning Engine, and Operating Rhythm Engine — Aipify recommends sustainable performance; leadership determines action; never omit organizational energy audit history.",
  companionLimitations: [
    "replacing_leadership_action",
    "pressuring_teams_without_consent",
    "hiding_fatigue_indicators",
    "creating_burnout_pressure",
    "bypassing_workforce_governance",
    "modifying_organizational_energy_audit_trail",
    "unlogged_energy_recommendations",
    "override_leadership_action"
  ]
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom267(content) {
  const pairs = [
    ["AipifyEnterpriseExecutiveCopilot", "AipifyEnterpriseOrganizationalEnergy"],
    ["aipify-enterprise-executive-copilot-engine", "aipify-enterprise-organizational-energy-engine"],
    ["aipify_enterprise_executive_copilot", "aipify_enterprise_organizational_energy"],
    ["aipifyEnterpriseExecutiveCopilotEngine", "aipifyEnterpriseOrganizationalEnergyEngine"],
    ["aeecpebp267", "aeooebp269"],
    ["_aeecpe_", "_aeooe_"],
    ["aipify_enterprise_executive_copilot_score", "aipify_enterprise_organizational_energy_score"],
    ["enterprise_executive_copilot_mode", "enterprise_organizational_energy_mode"],
    ["enterprise_executive_copilot_effectiveness_level", "enterprise_organizational_energy_index_level"],
    ["enterprise_executive_copilot_notes", "enterprise_organizational_energy_notes"],
    ["EnterpriseExecutiveCopilotNotes", "EnterpriseOrganizationalEnergyNotes"],
    ["enterprise_executive_copilot_notes_count", "enterprise_organizational_energy_notes_count"],
    ["Executive Copilot Phase 267", "__ENERGY_PHASE_267__"],
    ["Executive Copilot Companion", "__ENERGY_COMPANION__"],
    ["Enterprise Executive Copilot", "Enterprise Organizational Energy"],
    ["__ENERGY_COMPANION__", "Organizational Energy Companion"],
    ["Executive Copilot Center", "__ENERGY_CENTER__"],
    ["__ENERGY_PHASE_267__", "Executive Copilot Phase 267"],
    ["Phase 267", "Phase 269"],
    ["aipify_enterprise_executive_copilot.view", "aipify_enterprise_organizational_energy.view"],
    ["aipify_enterprise_executive_copilot.manage", "aipify_enterprise_organizational_energy.manage"],
    ["aipify_enterprise_executive_copilot.steward", "aipify_enterprise_organizational_energy.steward"],
    ["aipify_enterprise_executive_copilot_engine", "aipify_enterprise_organizational_energy_engine"],
    ["20261419500000_aipify_enterprise_executive_copilot_engine_phase267.sql", "20261419700000_aipify_enterprise_organizational_energy_engine_phase269.sql"],
    ["Repo Phase 267", "Repo Phase 269"],
    ["Phase 267 —", "Phase 269 —"],
    ["IMPLEMENTATION_BLUEPRINT_PHASE267_AIPIFY_ENTERPRISE_EXECUTIVE_COPILOT", "IMPLEMENTATION_BLUEPRINT_PHASE269_AIPIFY_ENTERPRISE_ORGANIZATIONAL_ENERGY"],
    ["implementation-blueprint-phase267", "implementation-blueprint-phase269"],
    ["executive_insight_timeline", "energy_recovery_recommendations"],
    ["executive_copilot_dashboard", "organizational_energy_dashboard"],
    ["executive_briefing_engine", "energy_signal_engine"],
    ["priority_intelligence_engine", "team_energy_monitoring"],
    ["executive_attention_management_engine", "executive_energy_insights"],
    ["decision_support_workspace", "momentum_detection"],
    ["executive_follow_through_tracking", "organizational_friction_identification"],
    ["cross_functional_executive_view", "executive_energy_dashboard"],
    ["executive_copilot_integration_center", "organizational_energy_integration_center"],
    ["executive_copilot_companion", "organizational_energy_companion"],
    ["_seed_enterprise_executive_copilot_notes", "_seed_enterprise_organizational_energy_notes"],
    ["executive briefing stewardship", "energy signal stewardship"],
    ["priority-informed executive support", "team sustainability support"],
    ["executive-focus leadership culture", "sustainable performance culture"],
    ["active executive priorities", "active energy signals"],
    ["decisions requiring executive attention", "teams requiring leadership attention"],
    ["Executive Briefing Engine", "Energy Signal Engine"],
    ["Priority Intelligence", "Team Energy Monitoring"],
    ["Executive Attention Management", "Executive Energy Insights"],
    ["Decision Support Workspace", "Momentum Detection"],
    ["Executive Follow-Through Tracking", "Organizational Friction Identification"],
    ["Executive Insight Timeline", "Energy Recovery Recommendations"],
    ["executive insight timeline indicators", "energy trend indicators"],
    ["executive briefing prompts", "energy signal prompts"],
    ["executive copilot prompts", "organizational energy prompts"],
    ["cross-functional executive view", "executive energy dashboard"],
    ["executive attention triggers", "energy strain triggers"],
    ["RBAC-protected executive copilot governance", "RBAC-protected organizational energy governance"],
    ["Aipify advises — executives decide", "Aipify recommends — leadership determines action"],
    ["Executives decide", "Leadership determines action"],
    ["Support decisions without replacing judgment", "Support sustainability without replacing leadership action"],
    ["no_bypassing_executive_copilot_governance", "no_bypassing_organizational_energy_governance"],
    ["AIPIFY_ENTERPRISE_EXECUTIVE_COPILOT", "AIPIFY_ENTERPRISE_ORGANIZATIONAL_ENERGY"],
    ["enterprise executive copilot", "enterprise organizational energy"],
    ["Executive copilot audit logs", "Organizational energy audit logs"],
    ["executive copilot governance RBAC", "organizational energy governance RBAC"],
    ["executive copilot scaffolds", "organizational energy scaffolds"],
    ["organization executive briefing policies", "organization workforce energy policies"],
    ["Executive effectiveness index", "Organizational energy index"],
    ["Executive effectiveness level", "Organizational energy index level"],
    ["Insight timeline entries", "Energy history entries"],
    ["executive commitment stewardship", "energy recovery stewardship"],
    ["executive copilot records beyond RBAC", "organizational energy records beyond RBAC"],
    ["executive recommendation assistance", "energy recommendation assistance"],
    ["executive cross-functional visibility", "workforce energy visibility"],
    ["Autonomous Coordination Engine Phase 266, Organizational Insights & Executive Intelligence Engine Phase 223, Strategic Execution Engine Phase 263, Decision Support Engine, and Executive Cockpit Phase 200", "Wellbeing & Sustainable Performance Engine Phase 220, Executive Copilot Engine Phase 267, Time & Attention Guardian, Workforce Planning Engine, and Operating Rhythm Engine"],
    ["Never replace executive judgment or make decisions on behalf of executives", "Never replace leadership action or pressure teams without consent"],
    ["executive priorities", "energy priorities"],
    ["Executive priorities", "Energy priorities"],
    ["executive attention routing", "fatigue risk routing"],
    ["decides without executive judgment", "acts without leadership approval"],
    ["Unauthorized executive action without executive approval", "Unauthorized workforce action without leadership approval"],
    ["Modifying executive copilot audit trails", "Modifying organizational energy audit trails"],
    ["Decide before executive review", "Act before leadership review"],
    ["user executive control", "user leadership control"],
    ["User executive control", "User leadership control"],
    ["briefing outcomes and executive preference policies", "energy outcomes and workforce sustainability policies"],
    ["executive insight visibility", "energy trend visibility"],
    ["executive copilot", "organizational energy"],
    ["enable executives to maintain awareness, prioritize effectively, identify emerging risks and opportunities, and support high-quality decision-making — maintaining executive copilot governance, executives decide with Aipify advisory support, full audit logging, role-based permissions, and leadership effectiveness that compounds over time", "enable organizations to understand and monitor organizational momentum and strain — maintaining organizational energy governance, leadership determines action with Aipify recommendation support, full audit logging, role-based permissions, and sustainable performance that compounds over time"],
    ["executive decision delays reduce, strategic focus improves, follow-through rates increase, executive engagement rises, emerging issues are identified faster, and executive effectiveness scores strengthen with Aipify advises — executives decide", "fatigue indicators reduce, workload balance improves, momentum sustainability increases, escalation-related strain lowers, organizational energy scores improve, and healthier execution patterns strengthen with Aipify recommends — leadership determines action"],
    ["Continues the era.", "Continues the era."],
    ["continues the era", "continues the era"],
    ["Opportunity Discovery Era continues", "Organizational Vitality Era continues"],
    ["Opportunity Discovery Era (264–268)", "Organizational Vitality Era (269–273)"],
    ["264–268", "269–273"],
    ["__ENERGY_CENTER__", "Organizational Energy Center"],
  ];
  let out = content;
  for (const [from, to] of pairs) out = out.split(from).join(to);
  return out;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as $ select 'ABOS Phase 269 — Organizational Energy Center. Organizational Energy Companion supports enterprise organizational energy — NOT replacing leadership action, pressuring teams without consent, or omitting organizational energy audit history. Helpers _${bp}_*.'; $;
create or replace function public._${bp}_mission() returns text language sql immutable as $ select 'Understand and monitor organizational momentum and strain for sustainable performance — Organizational Energy Companion recommends; leadership determines action.'; $;
create or replace function public._${bp}_philosophy() returns text language sql immutable as $ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $;
create or replace function public._${bp}_abos_principle() returns text language sql immutable as $
  select 'Aipify Business Operating System (ABOS) — Organizational Energy Center within Organizational Vitality Era (269–273). Aipify recommends; leadership determines action; workforce-governed energy signals; full audit logging; Organizational Energy Companion informs and recommends. Continues the era.'; $;
create or replace function public._${bp}_vision() returns text language sql immutable as $ select 'Organizations reduce fatigue indicators, improve workload balance, increase momentum sustainability, lower escalation-related strain, improve organizational energy scores, and strengthen healthier execution patterns with Aipify recommends — leadership determines action.'; $;
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as $
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Organizational Energy Center programs', 'emoji', '✅', 'description', 'Ten organizational energy modules'),
    jsonb_build_object('key', 'energy_signal_engine', 'label', 'Energy signal engine', 'emoji', '📋', 'description', 'Momentum and strain indicators'),
    jsonb_build_object('key', 'team_energy_monitoring', 'label', 'Team energy monitoring', 'emoji', '🔍', 'description', 'Team sustainability awareness'),
    jsonb_build_object('key', 'executive_energy_insights', 'label', 'Executive energy insights', 'emoji', '📊', 'description', 'Healthy leadership patterns'),
    jsonb_build_object('key', 'companion', 'label', 'Organizational Energy Companion', 'emoji', '✨', 'description', 'Recommends — leadership determines action'),
    jsonb_build_object('key', 'momentum_detection', 'label', 'Momentum detection', 'emoji', '🧪', 'description', 'Strong execution recognition'),
    jsonb_build_object('key', 'organizational_friction_identification', 'label', 'Organizational friction identification', 'emoji', '🛡️', 'description', 'Hidden inefficiency detection'),
    jsonb_build_object('key', 'energy_recovery_recommendations', 'label', 'Energy recovery recommendations', 'emoji', '🔔', 'description', 'Sustainable performance encouragement')
  ); $;
create or replace function public._${bp}_organizational_energy_dashboard() returns jsonb language sql immutable as $
  select jsonb_build_object('principle', 'Organizational Energy Center — ten capabilities. Aipify recommends — leadership determines action.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'energy_signal_engine', 'label', 'Energy Signal Engine'),
    jsonb_build_object('key', 'team_energy_monitoring', 'label', 'Team Energy Monitoring'),
    jsonb_build_object('key', 'executive_energy_insights', 'label', 'Executive Energy Insights'),
    jsonb_build_object('key', 'momentum_detection', 'label', 'Momentum Detection'),
    jsonb_build_object('key', 'organizational_friction_identification', 'label', 'Organizational Friction Identification'),
    jsonb_build_object('key', 'energy_recovery_recommendations', 'label', 'Energy Recovery Recommendations'),
    jsonb_build_object('key', 'executive_energy_dashboard', 'label', 'Executive Energy Dashboard'),
    jsonb_build_object('key', 'energy_history_trends', 'label', 'Energy History & Trends'),
    jsonb_build_object('key', 'organizational_energy_index', 'label', 'Organizational Energy Index'),
    jsonb_build_object('key', 'aipify_energy_principles', 'label', 'Aipify Energy Principles')
  )); $;
create or replace function public._${bp}_energy_signal_engine() returns jsonb language sql immutable as $
  select jsonb_build_object('principle', 'Energy signal engine — identify organizational momentum and strain.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'workload_trends', 'label', 'Are workload trends monitored?'),
    jsonb_build_object('key', 'escalation_frequency', 'label', 'Is escalation frequency tracked?'),
    jsonb_build_object('key', 'meeting_density', 'label', 'Is meeting density captured?'),
    jsonb_build_object('key', 'signal_states', 'label', 'Are positive, neutral, concerning, and critical states applied?'),
    jsonb_build_object('key', 'leadership_action', 'label', 'How do signals support leadership determines action — not replace action?')
  )); $;
create or replace function public._${bp}_team_energy_monitoring() returns jsonb language sql immutable as $
  select jsonb_build_object('principle', 'Team energy monitoring — team sustainability awareness.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'capacity_utilization', 'label', 'Capacity utilization monitored'),
    jsonb_build_object('key', 'work_distribution', 'label', 'Work distribution patterns tracked'),
    jsonb_build_object('key', 'energized', 'label', 'Energized energy state'),
    jsonb_build_object('key', 'stretched', 'label', 'Stretched energy state'),
    jsonb_build_object('key', 'depleted', 'label', 'Depleted energy state')
  )); $;
create or replace function public._${bp}_executive_energy_dashboard() returns jsonb language sql immutable as $
  select jsonb_build_object('principle', 'Executive energy dashboard — sustainability perspective for leaders.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'organizational_energy_state', 'label', 'Organizational energy state widget'),
    jsonb_build_object('key', 'teams_at_risk', 'label', 'Teams at risk of fatigue'),
    jsonb_build_object('key', 'momentum_indicators', 'label', 'Momentum indicators'),
    jsonb_build_object('key', 'friction_hotspots', 'label', 'Friction hotspots'),
    jsonb_build_object('key', 'energy_trend_analysis', 'label', 'Energy trend analysis')
  )); $;
create or replace function public._${bp}_organizational_energy_companion() returns jsonb language sql immutable as $
  select jsonb_build_object('principle', 'Organizational Energy Companion — recommends sustainable performance; never replaces leadership action or pressures teams without consent.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'rebalance_workloads', 'label', 'Rebalance workload recommendations'),
    jsonb_build_object('key', 'adjust_rhythms', 'label', 'Adjust operating rhythm suggestions'),
    jsonb_build_object('key', 'delay_initiatives', 'label', 'Delay non-critical initiative guidance'),
    jsonb_build_object('key', 'automation_support', 'label', 'Increase automation participation suggestions'),
    jsonb_build_object('key', 'protect_recovery', 'label', 'Protect recovery period recommendations'),
    jsonb_build_object('key', 'energy_guardrails', 'label', 'Organizational energy governance — Trust Architecture enforced')
  )); $;
create or replace function public._${bp}_executive_energy_insights() returns jsonb language sql immutable as $
  select jsonb_build_object('principle', 'Executive energy insights — healthy leadership operating patterns.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'decision_load', 'label', 'Decision load tracked'),
    jsonb_build_object('key', 'review_load', 'label', 'Review load tracked'),
    jsonb_build_object('key', 'delegate_decisions', 'label', 'Delegate decisions recommendation'),
    jsonb_build_object('key', 'protect_focus', 'label', 'Protect focus time recommendation'),
    jsonb_build_object('key', 'reduce_meetings', 'label', 'Reduce meeting load recommendation')
  )); $;
create or replace function public._${bp}_momentum_detection() returns jsonb language sql immutable as $
  select jsonb_build_object('principle', 'Momentum detection — recognize strong organizational execution.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'completion_rates', 'label', 'High completion rate indicator'),
    jsonb_build_object('key', 'collaboration', 'label', 'Strong collaboration indicator'),
    jsonb_build_object('key', 'building', 'label', 'Building momentum state'),
    jsonb_build_object('key', 'sustained', 'label', 'Sustained momentum state'),
    jsonb_build_object('key', 'stalled', 'label', 'Stalled momentum state')
  )); $;
create or replace function public._${bp}_organizational_friction_identification() returns jsonb language sql immutable as $
  select jsonb_build_object('principle', 'Organizational friction identification — detect hidden inefficiencies draining energy.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'repeated_escalations', 'label', 'Repeated escalations source'),
    jsonb_build_object('key', 'duplicate_work', 'label', 'Duplicate work source'),
    jsonb_build_object('key', 'delayed_approvals', 'label', 'Delayed approvals source'),
    jsonb_build_object('key', 'simplify_workflows', 'label', 'Simplify workflow recommendation'),
    jsonb_build_object('key', 'clarity_ownership', 'label', 'Improve ownership clarity recommendation')
  )); $;
create or replace function public._${bp}_energy_recovery_recommendations() returns jsonb language sql immutable as $
  select jsonb_build_object('principle', 'Energy recovery recommendations — encourage sustainable performance.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'seasonal_fluctuations', 'label', 'Seasonal fluctuation analysis'),
    jsonb_build_object('key', 'initiative_strain', 'label', 'Initiative-related strain analysis'),
    jsonb_build_object('key', 'recovery_effectiveness', 'label', 'Recovery effectiveness measured'),
    jsonb_build_object('key', 'momentum_cycles', 'label', 'Momentum cycles tracked'),
    jsonb_build_object('key', 'leadership_action', 'label', 'Aipify recommends — leadership determines action'),
    jsonb_build_object('key', 'index_levels', 'label', 'Exhausted, Strained, Stable, Energized, Thriving')
  )); $;
create or replace function public._${bp}_organizational_energy_integration_center() returns jsonb language sql immutable as $
  select jsonb_build_object('principle', 'Organizational energy integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'wellbeing', 'label', 'Wellbeing & Sustainable Performance Phase 220', 'cross_link', '/app/aipify-wellbeing-sustainable-performance-engine'),
    jsonb_build_object('key', 'executive_copilot', 'label', 'Executive Copilot Phase 267', 'cross_link', '/app/aipify-enterprise-executive-copilot-engine'),
    jsonb_build_object('key', 'attention_guardian', 'label', 'Time & Attention Guardian', 'cross_link', '/app/assistant/attention'),
    jsonb_build_object('key', 'workforce_planning', 'label', 'Talent Acquisition & Workforce Planning', 'cross_link', '/app/aipify-talent-acquisition-workforce-planning-engine'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'cross_link', '/app/self-love-engine'),
    jsonb_build_object('key', 'leadership_gates', 'label', 'Leadership gates — Aipify recommends only')
  )); $;
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as $
  select jsonb_build_object('must_avoid', jsonb_build_array('Replacing leadership action',
      'Pressuring teams without consent',
      'Hiding fatigue indicators',
      'Creating burnout pressure',
      'Modifying organizational energy audit trails',
      'Unlogged energy recommendations',
      'Bypassing workforce governance',
      'Override leadership action'), 'principle', 'Organizational Energy Companion recommends — leadership determines action and energy history stays auditable.'); $;
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as $
  select jsonb_build_object('principle', 'Self Love — calm workforce energy support without pressure.', 'values', jsonb_build_array('aipify_recommends','leadership_determines_action','human_centered','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $;
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as $
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Organizational energy audit logs via aipify_enterprise_organizational_energy_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_organizational_energy permissions — organizational energy governance RBAC'),
    jsonb_build_object('key', 'leadership_gates', 'label', 'Leadership determines action — Aipify recommends only'),
    jsonb_build_object('key', 'energy_policies', 'label', 'Organization-defined workforce energy and sustainability policies'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Organizational energy metadata only — no raw operational records'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $;
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as $ select jsonb_build_array(
    jsonb_build_object('phase', 269, 'key', 'enterprise_organizational_energy', 'label', 'Organizational Energy Phase 269', 'route', '/app/aipify-enterprise-organizational-energy-engine', 'description', 'Workforce sustainability — continues era'),
    jsonb_build_object('phase', 271, 'key', 'enterprise_future_readiness', 'label', 'Future Readiness Phase 271', 'route', '/app/aipify-enterprise-future-readiness-engine', 'description', 'Future preparedness — cross-link only')
  ); $;
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as $ select jsonb_build_array(
    jsonb_build_object('key', 'wellbeing', 'label', 'Wellbeing Phase 220', 'route', '/app/aipify-wellbeing-sustainable-performance-engine', 'relationship', 'Sustainable performance — cross-link only'),
    jsonb_build_object('key', 'executive_copilot', 'label', 'Executive Copilot Phase 267', 'route', '/app/aipify-enterprise-executive-copilot-engine', 'relationship', 'Executive load — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Human-centered — cross-link only')
  ); $;
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as $ select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); $;
create or replace function public._${bp}_dogfooding() returns text language sql immutable as $
  select 'Aipify uses Organizational Energy Center internally with workforce-governed energy signals and full audit logging. Growth Partner terminology. Organizational Energy Companion recommends — never replaces leadership action or pressures teams without consent.'; $;
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as $
  select jsonb_build_array('People First — leadership determines action.', 'Organizational Energy Companion recommends sustainable performance.', 'Aipify recommends — leadership determines action.', 'Growth Partner — never Affiliate.', 'Organizational Vitality Era continues — 269–273.'); $;
create or replace function public._${bp}_privacy_note() returns text language sql immutable as $
  select 'Organizational Energy Center metadata only — energy summaries max ~500 chars. No raw operational records beyond RBAC or PII in audit logs.'; $;
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
    `jsonb_build_object('key', 'engine', 'label', 'Energy signal engine — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_energy_signal_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_relationship_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Energy signal engine — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_energy_signal_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_critical_function_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Energy signal engine — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_energy_signal_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_memory_capture_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Energy signal engine — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_energy_signal_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_improvement_opportunity_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Energy signal engine — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_energy_signal_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_decision_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Energy signal engine — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_energy_signal_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_action_queue_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Energy signal engine — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_energy_signal_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_trend_monitoring_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Energy signal engine — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_energy_signal_engine()->'reflection_questions') = 5,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_strategic_execution_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Organizational Energy Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_organizational_energy_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_relationship_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Organizational Energy Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_organizational_energy_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_resilience_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Organizational Energy Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_organizational_energy_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_memory_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Organizational Energy Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_organizational_energy_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_improvement_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Organizational Energy Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_organizational_energy_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_decision_governance_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Organizational Energy Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_organizational_energy_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_orchestration_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Organizational Energy Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_organizational_energy_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_intelligence_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Organizational Energy Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_organizational_energy_dashboard()->'capabilities') = 10,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  const replaceRpcRef = (sqlText, fn) => {
    if (fn === "organizational_energy_dashboard") {
      return sqlText.replace(/public\._(\w+)_organizational_energy_dashboard\(\)/g, (full, prefix) =>
        prefix.includes("executive") ? full : `public._${P.bp}_organizational_energy_dashboard()`,
      );
    }
    return sqlText.replace(
      new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"),
      `public._${P.bp}_${fn}()`,
    );
  };

  for (const fn of [...SCAFFOLDS, "organizational_energy_companion"].sort((a, b) => b.length - a.length)) {
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
    "RBAC-protected enterprise organizational energy guidance within Organizational Vitality Era;",
    "RBAC-protected enterprise organizational energy guidance within Organizational Vitality Era;",
  );
  sql = sql.replaceAll(
    "RBAC-protected enterprise organizational energy guidance within Organizational Vitality Era;",
    "RBAC-protected enterprise organizational energy guidance within Organizational Vitality Era;",
  );
  sql = sql.replaceAll(
    "RBAC-protected enterprise continuous improvement guidance within Continuous Optimization Era;",
    "RBAC-protected enterprise organizational energy guidance within Organizational Vitality Era;",
  );
  sql = sql.replace(
    /Phase 269 Enterprise Organizational Energy Engine —/,
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
    `'energy_recovery_recommendations', public._${P.bp}_energy_recovery_recommendations()`,
  );
  sql = sql.replace(
    /'improvement_improvement_dashboard', public\._\w+_improvement_improvement_dashboard\(\)/,
    `'energy_recovery_recommendations', public._${P.bp}_energy_recovery_recommendations()`,
  );
  sql = sql.replace(
    /'decision_decision_governance_dashboard', public\._\w+_decision_decision_governance_dashboard\(\)/,
    `'energy_recovery_recommendations', public._${P.bp}_energy_recovery_recommendations()`,
  );
  sql = sql.replace(
    /'orchestration_orchestration_dashboard', public\._\w+_orchestration_orchestration_dashboard\(\)/,
    `'energy_recovery_recommendations', public._${P.bp}_energy_recovery_recommendations()`,
  );
  sql = sql.replace(
    /'governance_rules_dashboard', public\._\w+_governance_rules_dashboard\(\)/,
    `'energy_recovery_recommendations', public._${P.bp}_energy_recovery_recommendations()`,
  );
  sql = sql.replace(
    /'improvement_controls_dashboard', public\._\w+_improvement_controls_dashboard\(\)/,
    `'energy_recovery_recommendations', public._${P.bp}_energy_recovery_recommendations()`,
  );
  sql = sql.replace(
    /'policy_controls_dashboard', public\._\w+_policy_controls_dashboard\(\)/,
    `'energy_recovery_recommendations', public._${P.bp}_energy_recovery_recommendations()`,
  );
  sql = sql.replace(
    /'intelligence_controls_dashboard', public\._\w+_intelligence_controls_dashboard\(\)/,
    `'energy_recovery_recommendations', public._${P.bp}_energy_recovery_recommendations()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_resilience_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_energy_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_memory_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_energy_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_improvement_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_energy_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_decision_governance_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_energy_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_orchestration_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_energy_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_intelligence_controls_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_energy_dashboard()`,
  );

  sql = sql.replace(
    /'memory_controls_dashboard', public\._\w+_memory_controls_dashboard\(\)/,
    `'energy_recovery_recommendations', public._${P.bp}_energy_recovery_recommendations()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_memory_controls_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_energy_dashboard()`,
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

${P.centerTitle} within ${P.era}. **Opens the era.** ${P.companion} supports energy signal engine, team energy monitoring, executive energy insights, momentum detection, organizational friction identification, energy recovery recommendations, executive energy dashboard, energy history and trends, organizational energy index, and Aipify energy principles — does NOT replace leadership action, pressure teams without consent, or omit organizational energy audit history.

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

## What is the Enterprise Organizational Energy Engine?

The Enterprise Organizational Energy Engine helps leaders monitor organizational momentum and strain for sustainable performance at \`/app/${P.slug}\`.

## What organizational energy features are included?

Energy signal engine, team energy monitoring, executive energy insights, momentum detection, organizational friction identification, energy recovery recommendations, executive energy dashboard, energy history and trends, organizational energy index, and Aipify energy principles.

## What signal states apply?

Positive, neutral, concerning, and critical — with team energy states energized, stable, stretched, fatigued, and depleted.

## What momentum states apply?

Building, sustained, declining, and stalled — with organizational energy index levels exhausted, strained, stable, energized, and thriving.

## What does the organizational energy flow look like?

Signals collected → energy trends analyzed → momentum assessed → friction identified → recommendations generated → leadership informed → adjustments implemented → recovery supported → sustainable performance strengthened.

## Who can access organizational energy?

Super Admin (full access), Tenant Admin (energy policies), Workforce leaders (team monitoring), Executives (executive energy dashboard), HR and operations (capacity patterns) — enterprise RBAC via Workforce Center.

## Is full audit logging enforced?

**Yes.** Every organizational energy lifecycle event is logged. Energy metadata and recommendation history are recorded.

## How does this integrate with other Aipify surfaces?

${P.crossLinkNote}

## Does the Organizational Energy Companion replace leadership action?

**No.** Aipify recommends — **leadership determines action.** ${P.companion} does **NOT** replace leadership action, pressure teams without consent, or omit organizational energy audit history.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Organizational Energy: energy signal engine, team energy monitoring, executive energy insights, momentum detection, friction identification, recovery recommendations, executive energy dashboard, energy history, organizational energy index, Aipify energy principles.
Signal states: positive, neutral, concerning, critical.
Team energy states: energized, stable, stretched, fatigued, depleted.
Momentum states: building, sustained, declining, stalled.
Index levels: exhausted, strained, stable, energized, thriving.
Flow: signals → trends → momentum → friction → recommendations → leadership → adjustments → recovery → sustainable performance.
Security: organizational energy governance RBAC, leadership gates, audit logging, metadata only, enterprise permissions, 2FA.
Design principles: Aipify recommends — leadership determines action, human-centered presentation, executive-grade simplicity.
Companion limitations: no replacing leadership action, no pressuring teams without consent, no hiding fatigue indicators, no creating burnout pressure.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate. Organizational Vitality Era opens 269–273.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} recommends; never replaces leadership action, pressures teams without consent, or omits organizational energy audit history.";
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
    if (c.includes('| "aipifyEnterpriseFutureReadinessEngine"')) {
      c = c.replace(
        '| "aipifyEnterpriseExecutiveCopilotEngine"\n  | "aipifyEnterpriseFutureReadinessEngine"',
        `| "aipifyEnterpriseExecutiveCopilotEngine"\n  | "${id}"\n  | "aipifyEnterpriseFutureReadinessEngine"`,
      );
    } else {
      c = c.replace(
        '| "aipifyEnterpriseExecutiveCopilotEngine"',
        `| "aipifyEnterpriseExecutiveCopilotEngine"\n  | "${id}"`,
      );
    }
  }
  if (!c.includes(href)) {
    const futureAnchor =
      /id: "aipifyEnterpriseFutureReadinessEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyEnterpriseFutureReadinessEngine",\n  },/;
    if (futureAnchor.test(c)) {
      c = c.replace(
        futureAnchor,
        (m) =>
          `{\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },\n  {\n    ${m.trim()}`,
      );
    } else {
      const copilotAnchor =
        /id: "aipifyEnterpriseExecutiveCopilotEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyEnterpriseExecutiveCopilotEngine",\n  },/;
      c = c.replace(
        copilotAnchor,
        (m) =>
          `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
      );
    }
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-enterprise-future-readiness-engine")) {\n    return "aipifyEnterpriseFutureReadinessEngine";\n  }',
      `if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }\n  if (pathname.startsWith("/app/aipify-enterprise-future-readiness-engine")) {\n    return "aipifyEnterpriseFutureReadinessEngine";\n  }`,
    );
    if (!c.includes(`pathname.startsWith("${href}")`)) {
      c = c.replace(
        'if (pathname.startsWith("/app/aipify-enterprise-executive-copilot-engine")) {\n    return "aipifyEnterpriseExecutiveCopilotEngine";\n  }',
        `if (pathname.startsWith("/app/aipify-enterprise-executive-copilot-engine")) {\n    return "aipifyEnterpriseExecutiveCopilotEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
      );
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace(
        '"aipify_enterprise_executive_copilot.steward",',
        `"aipify_enterprise_executive_copilot.steward",\n    "${perm}",`,
      );
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    if (c.includes('export * from "./aipify-enterprise-future-readiness-engine";')) {
      c = c.replace(
        'export * from "./aipify-enterprise-future-readiness-engine";',
        `export * from "./${P.slug}";\nexport * from "./aipify-enterprise-future-readiness-engine";`,
      );
    } else {
      c = c.replace(
        'export * from "./aipify-enterprise-executive-copilot-engine";',
        `export * from "./aipify-enterprise-executive-copilot-engine";\nexport * from "./${P.slug}";`,
      );
    }
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era} opens. ${P.companion} supports energy signal engine, team energy monitoring, executive energy insights, momentum detection, organizational friction identification, and executive energy dashboard. Aipify recommends — leadership determines action. Does NOT replace leadership action or pressure teams without consent. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Organizational energy index",
    modeLabel: "Mode",
    readinessLabel: "Organizational energy index level",
    executiveReviews: "Executive energy dashboard",
    activeReflections: "Active organizational energy scaffolds",
    humanOversightRequired: `Leadership determines action — users retain workforce control; ${P.companion} recommends only`,
    eraOpenerSummary: `Organizational Vitality Era — Phases ${P.eraRange} (opens)`,
    eraOpenerNote:
      "Cross-link only — do not duplicate Wellbeing & Sustainable Performance Engine, Executive Copilot Engine, Time & Attention Guardian, or Workforce Planning Engine RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Energy signal engine — signal prompts",
    frameworkLabel: "Team energy monitoring",
    reviewsLabel: "Executive energy dashboard",
    companionLabel: `${P.companion} — recommends sustainable performance, leadership determines action`,
    subEngineLabel: "Momentum detection",
    reflections: "Organizational energy scaffolds",
    executiveReviewEntries: "Energy history entries",
    scaffoldNotes: "Leadership-governed energy scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT replace leadership action, pressure teams without consent, or omit organizational energy audit history`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports enterprise organizational energy — leadership determines action and energy history stays auditable.`,
      philosophy:
        "People First. Aipify recommends — leadership determines action. Growth Partner terminology — never Affiliate.",
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
        ? "Organisasjonsenergi"
        : locale === "sv"
          ? "Organisationsenergi"
          : locale === "da"
            ? "Organisationsenergi"
            : P.navLabel;
    data[P.camel] = i18nBlock();
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  }
}

function patchIlmIndex() {
  const file = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes(`implementation-blueprint-phase${P.phase}-vocabulary`)) {
    const vocabAnchor = c.includes('export * from "./implementation-blueprint-phase271-vocabulary";')
      ? 'export * from "./implementation-blueprint-phase271-vocabulary";'
      : 'export * from "./implementation-blueprint-phase267-vocabulary";';
    c = c.replace(
      vocabAnchor,
      `${vocabAnchor}\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    const corpusAnchor = c.includes("IMPLEMENTATION_BLUEPRINT_PHASE271_CORPUS")
      ? 'export const IMPLEMENTATION_BLUEPRINT_PHASE271_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase271-aipify-enterprise-future-readiness.txt";'
      : 'export const IMPLEMENTATION_BLUEPRINT_PHASE267_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase267-aipify-enterprise-executive-copilot.txt";';
    c = c.replace(
      corpusAnchor,
      `${corpusAnchor}\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  if (c.includes("Phase 269")) return;
  const entry = `\n**Enterprise Organizational Energy Engine (Phase 269):** See [AIPIFY_ENTERPRISE_ORGANIZATIONAL_ENERGY_PHASE269.md](./AIPIFY_ENTERPRISE_ORGANIZATIONAL_ENERGY_PHASE269.md) — Energy signal engine, team energy monitoring, executive energy insights, momentum detection, organizational friction identification, energy recovery recommendations, executive energy dashboard, energy history and trends, organizational energy index, and Aipify energy principles. **Opens** Organizational Vitality Era (269–273). \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} recommends — **NOT** replacing leadership action, pressuring teams without consent, or omitting organizational energy audit history. Cross-links only: Wellbeing & Sustainable Performance Engine Phase 220, Executive Copilot Engine Phase 267, Time & Attention Guardian, Workforce Planning Engine. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  const futureMarker = "**Enterprise Future Readiness Engine (Phase 271):**";
  const futureIdx = c.indexOf(futureMarker);
  if (futureIdx !== -1) {
    c = `${c.slice(0, futureIdx)}${entry}\n${c.slice(futureIdx)}`;
  } else {
    const copilotMarker =
      "Permissions `aipify_enterprise_executive_copilot.view`, `aipify_enterprise_executive_copilot.manage`, `aipify_enterprise_executive_copilot.steward`.";
    const idx = c.indexOf(copilotMarker);
    c = idx === -1 ? `${c}\n${entry}\n` : `${c.slice(0, idx + copilotMarker.length)}${entry}${c.slice(idx + copilotMarker.length)}`;
  }
  fs.writeFileSync(file, c);
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
