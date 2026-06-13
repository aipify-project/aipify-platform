#!/usr/bin/env node
/** ABOS Phase 264 — Enterprise Opportunity Discovery Engine (Opportunity Discovery Era 264–268) */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "opportunity_discovery_dashboard",
  "opportunity_registry_hub",
  "opportunity_detection_engine",
  "opportunity_scoring_engine",
  "opportunity_pipeline_engine",
  "opportunity_validation_workspace",
  "executive_opportunity_dashboard",
  "value_realization_tracking_engine",
  "opportunity_integration_center",
];

const P = {
  phase: 264,
  migration: "20261419100000_aipify_enterprise_opportunity_discovery_engine_phase264.sql",
  slug: "aipify-enterprise-opportunity-discovery-engine",
  base: "AipifyEnterpriseOpportunityDiscovery",
  camel: "aipifyEnterpriseOpportunityDiscoveryEngine",
  snake: "aipify_enterprise_opportunity_discovery",
  permPrefix: "aipify_enterprise_opportunity_discovery",
  helper: "aeode",
  bp: "aeodebp264",
  decisionType: "aipify_enterprise_opportunity_discovery_engine",
  title: "Enterprise Opportunity Discovery",
  centerTitle: "Opportunity Center",
  companion: "Opportunity Discovery Companion",
  scoreKey: "aipify_enterprise_opportunity_discovery_score",
  modeKey: "enterprise_opportunity_discovery_mode",
  levelKey: "enterprise_opportunity_discovery_maturity_level",
  thirdEntity: "enterprise_opportunity_discovery_notes",
  era: "Opportunity Discovery Era (264–268)",
  eraRange: "264–268",
  docSlug: "AIPIFY_ENTERPRISE_OPPORTUNITY_DISCOVERY",
  ilmFile: "implementation-blueprint-phase264-aipify-enterprise-opportunity-discovery.txt",
  navLabel: "Opportunity Discovery",
  crossLinkNote: "Cross-links only: Strategic Execution Engine Phase 263, External Intelligence & Market Awareness Engine Phase 255, Relationship Intelligence Engine Phase 262, Enterprise Analytics Engine Phase 235, and Aipify Innovation & Opportunity Discovery Engine Phase 212 — never pursue opportunities without human approval, bypass opportunity owner judgment, or omit opportunity audit history.",
  companionLimitations: [
    "pursuing_without_human_approval",
    "bypassing_opportunity_owner_judgment",
    "hiding_opportunity_risks",
    "unlogged_opportunity_decisions",
    "replacing_leadership_decisions",
    "modifying_opportunity_audit_trail",
    "auto_launching_pilots",
    "override_human_judgment"
  ]
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom263(content) {
  const pairs = [
    ["AipifyEnterpriseStrategicExecution", "AipifyEnterpriseOpportunityDiscovery"],
    ["aipify-enterprise-strategic-execution-engine", "aipify-enterprise-opportunity-discovery-engine"],
    ["aipify_enterprise_strategic_execution", "aipify_enterprise_opportunity_discovery"],
    ["aipifyEnterpriseStrategicExecutionEngine", "aipifyEnterpriseOpportunityDiscoveryEngine"],
    ["aeseebp263", "aeodebp264"],
    ["_aesee_", "_aeode_"],
    ["aipify_enterprise_strategic_execution_score", "aipify_enterprise_opportunity_discovery_score"],
    ["enterprise_strategic_execution_mode", "enterprise_opportunity_discovery_mode"],
    ["enterprise_strategic_execution_maturity_level", "enterprise_opportunity_discovery_maturity_level"],
    ["enterprise_strategic_execution_notes", "enterprise_opportunity_discovery_notes"],
    ["EnterpriseStrategicExecutionNotes", "EnterpriseOpportunityDiscoveryNotes"],
    ["enterprise_strategic_execution_notes_count", "enterprise_opportunity_discovery_notes_count"],
    ["Strategic Execution Phase 263", "__OD_PHASE_263__"],
    ["Strategic Execution Companion", "__OD_COMPANION__"],
    ["Enterprise Strategic Execution", "Enterprise Opportunity Discovery"],
    ["__OD_COMPANION__", "Opportunity Discovery Companion"],
    ["Strategic Execution Center", "__OD_CENTER__"],
    ["__OD_PHASE_263__", "Strategic Execution Phase 263"],
    ["Phase 263", "Phase 264"],
    ["aipify_enterprise_strategic_execution.view", "aipify_enterprise_opportunity_discovery.view"],
    ["aipify_enterprise_strategic_execution.manage", "aipify_enterprise_opportunity_discovery.manage"],
    ["aipify_enterprise_strategic_execution.steward", "aipify_enterprise_opportunity_discovery.steward"],
    ["aipify_enterprise_strategic_execution_engine", "aipify_enterprise_opportunity_discovery_engine"],
    [
      "20261419000000_aipify_enterprise_strategic_execution_engine_phase263.sql",
      "20261419100000_aipify_enterprise_opportunity_discovery_engine_phase264.sql",
    ],
    ["Repo Phase 263", "Repo Phase 264"],
    ["Phase 263 —", "Phase 264 —"],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE263_AIPIFY_ENTERPRISE_STRATEGIC_EXECUTION_ENGINE",
      "IMPLEMENTATION_BLUEPRINT_PHASE264_AIPIFY_ENTERPRISE_OPPORTUNITY_DISCOVERY",
    ],
    ["implementation-blueprint-phase263", "implementation-blueprint-phase264"],
    ["strategic_execution_controls_dashboard", "executive_opportunity_dashboard"],
    ["strategic_execution_dashboard", "opportunity_discovery_dashboard"],
    ["strategic_objective_registry_hub", "opportunity_registry_hub"],
    ["strategic_initiatives_engine", "opportunity_detection_engine"],
    ["objective_alignment_engine", "opportunity_scoring_engine"],
    ["execution_scorecards_engine", "opportunity_pipeline_engine"],
    ["milestone_management_engine", "opportunity_validation_workspace"],
    ["strategic_risk_engine", "value_realization_tracking_engine"],
    ["strategic_execution_integration_center", "opportunity_integration_center"],
    ["strategic_execution_companion", "opportunity_discovery_companion"],
    ["_seed_enterprise_strategic_execution_notes", "_seed_enterprise_opportunity_discovery_notes"],
    ["strategic execution stewardship", "opportunity discovery stewardship"],
    ["outcome-informed execution support", "signal-informed opportunity support"],
    ["alignment-first execution culture", "discovery-first opportunity culture"],
    ["active execution programs", "active opportunity programs"],
    ["initiatives requiring executive attention", "opportunities requiring executive attention"],
    ["Strategic Objective Registry", "Opportunity Registry"],
    ["Strategic Initiatives", "Opportunity Detection Engine"],
    ["Objective Alignment Engine", "Opportunity Scoring"],
    ["Execution Scorecards", "Opportunity Pipeline"],
    ["Milestone Management", "Opportunity Validation Workspace"],
    ["Strategic Execution Controls Dashboard", "Executive Opportunity Dashboard"],
    ["execution progress indicators", "opportunity pipeline indicators"],
    ["strategic objective registry prompts", "opportunity registry prompts"],
    ["strategic execution prompts", "opportunity discovery prompts"],
    ["strategic risk identification", "value realization tracking"],
    ["execution risk alerts", "opportunity risk alerts"],
    ["RBAC-protected strategic execution governance", "RBAC-protected opportunity discovery governance"],
    ["Define before drifting", "Discover before reacting"],
    ["Leadership executes", "Humans decide"],
    ["Review before abandoning objectives", "Validate before pursuing"],
    ["no_bypassing_execution_governance", "no_bypassing_opportunity_governance"],
    ["AIPIFY_ENTERPRISE_STRATEGIC_EXECUTION_ENGINE", "AIPIFY_ENTERPRISE_OPPORTUNITY_DISCOVERY"],
    ["enterprise strategic execution", "enterprise opportunity discovery"],
    ["Strategic execution audit logs", "Opportunity discovery audit logs"],
    ["strategic execution governance RBAC", "opportunity discovery governance RBAC"],
    ["strategic execution scaffolds", "opportunity discovery scaffolds"],
    ["organization execution policies", "organization opportunity policies"],
    ["Strategic execution index", "Opportunity maturity index"],
    ["Execution maturity level", "Opportunity maturity level"],
    ["Milestone entries", "Validation entries"],
    ["executive sponsor stewardship", "opportunity owner stewardship"],
    ["execution records beyond RBAC", "opportunity records beyond RBAC"],
    ["execution recommendation assistance", "opportunity recommendation assistance"],
    ["manager department execution visibility", "manager department opportunity visibility"],
    [
      "Trust & Relationship Intelligence Engine Phase 262, Resilience & Business Continuity Engine Phase 261, Organizational Memory Engine Phase 260, Executive Cockpit Phase 200, Enterprise Analytics Engine Phase 235, and Aipify Translate Phase 238",
      "Strategic Execution Engine Phase 263, External Intelligence & Market Awareness Engine Phase 255, Relationship Intelligence Engine Phase 262, Enterprise Analytics Engine Phase 235, and Aipify Innovation & Opportunity Discovery Engine Phase 212",
    ],
    [
      "Never execute strategic changes without leadership approval or bypass executive sponsor judgment",
      "Never pursue opportunities without human approval or bypass opportunity owner judgment",
    ],
    ["execution programs", "opportunity programs"],
    ["Execution programs", "Opportunity programs"],
    ["high-risk initiative routing", "high-potential opportunity routing"],
    ["executes changes without leadership approval", "pursues opportunities without human approval"],
    ["Unauthorized strategic execution without leadership approval", "Unauthorized opportunity pursuit without human approval"],
    ["Modifying execution audit trails", "Modifying opportunity audit trails"],
    ["Abandon before executive review", "Pursue before validation review"],
    ["user leadership execution control", "user opportunity owner control"],
    ["User leadership execution control", "User opportunity owner control"],
    ["execution outcomes and alignment policies", "opportunity outcomes and validation policies"],
    ["initiative progress visibility", "pipeline progression visibility"],
    ["strategic execution", "opportunity discovery"],
    [
      "enable organizations to transform strategic objectives into measurable execution — maintaining execution governance, leadership executes with Aipify guidance, full audit logging, role-based permissions, and alignment that compounds over time",
      "enable organizations to continuously identify emerging opportunities across the organization, market, customers, products, operations, and partnerships — maintaining discovery governance, humans decide with Aipify guidance, full audit logging, role-based permissions, and proactive growth that compounds over time",
    ],
    [
      "objective completion rates increase, milestone adherence improves, blocker resolution accelerates, strategic alignment rises, execution delays decrease, and execution index scores improve with define before drifting",
      "opportunities identified increase, opportunities realized grow, estimated vs realized value improves, validation success rates rise, strategic alignment scores strengthen, and opportunity maturity progresses with discover before reacting",
    ],
    ["Completes the era.", "Starts the era."],
    ["completes the era", "starts the era"],
    ["Continuous Optimization Era completes", "Opportunity Discovery Era starts"],
    ["Continuous Optimization Era (259–263)", P.era],
    ["259–263", P.eraRange],
    ["__OD_CENTER__", "Opportunity Center"],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 264 — Opportunity Center. Opportunity Discovery Companion supports enterprise opportunity discovery — NOT pursuing opportunities without human approval, bypassing opportunity owner judgment, or omitting opportunity audit history. Helpers _${bp}_*.'; $$;
create or replace function public._${bp}_mission() returns text language sql immutable as $$ select 'Continuously identify emerging opportunities across the organization, market, customers, products, operations, and partnerships — Opportunity Discovery Companion highlights, humans decide.'; $$;
create or replace function public._${bp}_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._${bp}_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Opportunity Center within Opportunity Discovery Era (264–268). Aipify highlights; humans decide; discovery-governed lifecycle; full audit logging; Opportunity Discovery Companion informs and recommends. Starts the era.'; $$;
create or replace function public._${bp}_vision() returns text language sql immutable as $$ select 'Organizations increase opportunities identified, improve opportunities realized, strengthen estimated vs realized value, raise validation success rates, improve strategic alignment scores, and progress opportunity maturity with discover before reacting.'; $$;
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Opportunity Center programs', 'emoji', '✅', 'description', 'Ten opportunity discovery modules'),
    jsonb_build_object('key', 'opportunity_registry_hub', 'label', 'Opportunity registry', 'emoji', '📋', 'description', 'Centralized opportunity portfolio'),
    jsonb_build_object('key', 'opportunity_detection_engine', 'label', 'Opportunity detection engine', 'emoji', '🔍', 'description', 'Continuous signal detection'),
    jsonb_build_object('key', 'opportunity_scoring_engine', 'label', 'Opportunity scoring', 'emoji', '📊', 'description', 'Prioritize highest potential value'),
    jsonb_build_object('key', 'companion', 'label', 'Opportunity Discovery Companion', 'emoji', '✨', 'description', 'Highlights — humans decide'),
    jsonb_build_object('key', 'opportunity_validation_workspace', 'label', 'Opportunity validation workspace', 'emoji', '🧪', 'description', 'Evidence-based evaluation'),
    jsonb_build_object('key', 'executive_opportunity_dashboard', 'label', 'Executive opportunity dashboard', 'emoji', '🛡️', 'description', 'Forward-looking leadership insights'),
    jsonb_build_object('key', 'opportunity_pipeline_engine', 'label', 'Opportunity pipeline', 'emoji', '🔔', 'description', 'Lifecycle tracking and conversion')
  ); $$;
create or replace function public._${bp}_opportunity_discovery_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Opportunity Center — ten capabilities. Discover before reacting.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'opportunity_registry', 'label', 'Opportunity Registry'),
    jsonb_build_object('key', 'opportunity_detection', 'label', 'Opportunity Detection Engine'),
    jsonb_build_object('key', 'opportunity_scoring', 'label', 'Opportunity Scoring'),
    jsonb_build_object('key', 'opportunity_pipeline', 'label', 'Opportunity Pipeline'),
    jsonb_build_object('key', 'opportunity_validation', 'label', 'Opportunity Validation Workspace'),
    jsonb_build_object('key', 'executive_opportunity_dashboard', 'label', 'Executive Opportunity Dashboard'),
    jsonb_build_object('key', 'opportunity_recommendations', 'label', 'Aipify Opportunity Recommendations'),
    jsonb_build_object('key', 'opportunity_collaboration', 'label', 'Opportunity Collaboration'),
    jsonb_build_object('key', 'value_realization_tracking', 'label', 'Value Realization Tracking'),
    jsonb_build_object('key', 'opportunity_maturity_index', 'label', 'Opportunity Maturity Index')
  )); $$;
create or replace function public._${bp}_opportunity_registry_hub() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Opportunity registry — centralized portfolio of identified opportunities.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'opportunity_owners', 'label', 'Are opportunity owners assigned for each entry?'),
    jsonb_build_object('key', 'categories', 'label', 'Are revenue growth, cost optimization, customer experience, and innovation categorized?'),
    jsonb_build_object('key', 'impact_effort', 'label', 'Are estimated impact and effort documented?'),
    jsonb_build_object('key', 'confidence', 'label', 'Is confidence score recorded with discovery source?'),
    jsonb_build_object('key', 'human_decision', 'label', 'How does registry support human pursuit decisions with Aipify guidance?')
  )); $$;
create or replace function public._${bp}_opportunity_detection_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Opportunity detection — continuously identify potential improvements and growth areas.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'operational_analytics', 'label', 'Operational analytics source'),
    jsonb_build_object('key', 'customer_trends', 'label', 'Customer trends source'),
    jsonb_build_object('key', 'relationship_intelligence', 'label', 'Relationship intelligence source'),
    jsonb_build_object('key', 'strategic_execution_gaps', 'label', 'Strategic execution gaps source'),
    jsonb_build_object('key', 'reactive', 'label', 'Reactive detection type'),
    jsonb_build_object('key', 'predictive', 'label', 'Predictive detection type'),
    jsonb_build_object('key', 'strategic', 'label', 'Strategic detection type')
  )); $$;
create or replace function public._${bp}_value_realization_tracking_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Value realization tracking — measure actual outcomes vs estimates.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'revenue_generated', 'label', 'Revenue generated'),
    jsonb_build_object('key', 'costs_avoided', 'label', 'Costs avoided'),
    jsonb_build_object('key', 'time_saved', 'label', 'Time saved'),
    jsonb_build_object('key', 'customer_improvements', 'label', 'Customer improvements'),
    jsonb_build_object('key', 'strategic_impact', 'label', 'Strategic impact'),
    jsonb_build_object('key', 'lessons_learned', 'label', 'Lessons learned')
  )); $$;
create or replace function public._${bp}_opportunity_discovery_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Opportunity Discovery Companion — highlights opportunities and never pursues without human approval or bypasses opportunity owner judgment.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'explore_further', 'label', 'Explore further recommendations'),
    jsonb_build_object('key', 'launch_pilot', 'label', 'Launch pilot initiative suggestions'),
    jsonb_build_object('key', 'allocate_resources', 'label', 'Allocate resource guidance'),
    jsonb_build_object('key', 'escalate_review', 'label', 'Escalate for executive review'),
    jsonb_build_object('key', 'delay_conditions', 'label', 'Delay until conditions improve'),
    jsonb_build_object('key', 'discovery_guardrails', 'label', 'Discovery governance — Trust Architecture enforced')
  )); $$;
create or replace function public._${bp}_opportunity_scoring_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Opportunity scoring — prioritize initiatives with highest potential value.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'strategic_alignment', 'label', 'Strategic alignment factor'),
    jsonb_build_object('key', 'revenue_potential', 'label', 'Revenue potential factor'),
    jsonb_build_object('key', 'time_to_value', 'label', 'Time to value factor'),
    jsonb_build_object('key', 'exploratory', 'label', 'Exploratory priority level'),
    jsonb_build_object('key', 'promising', 'label', 'Promising priority level'),
    jsonb_build_object('key', 'strategic_priority', 'label', 'Strategic Priority level')
  )); $$;
create or replace function public._${bp}_opportunity_pipeline_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Opportunity pipeline — track lifecycle from identified to realized.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'identified', 'label', 'Identified stage'),
    jsonb_build_object('key', 'validating', 'label', 'Validating stage'),
    jsonb_build_object('key', 'planning', 'label', 'Planning stage'),
    jsonb_build_object('key', 'approved', 'label', 'Approved stage'),
    jsonb_build_object('key', 'executing', 'label', 'Executing stage'),
    jsonb_build_object('key', 'realized', 'label', 'Realized stage')
  )); $$;
create or replace function public._${bp}_opportunity_validation_workspace() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Opportunity validation — evidence-based evaluation workspace.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'assumptions', 'label', 'Document assumptions'),
    jsonb_build_object('key', 'evidence', 'label', 'Supporting evidence'),
    jsonb_build_object('key', 'proceed', 'label', 'Proceed validation result'),
    jsonb_build_object('key', 'refine', 'label', 'Refine validation result'),
    jsonb_build_object('key', 'reject', 'label', 'Reject validation result'),
    jsonb_build_object('key', 'monitor', 'label', 'Monitor validation result')
  )); $$;
create or replace function public._${bp}_executive_opportunity_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive opportunity dashboard — forward-looking leadership insights.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'new_opportunities', 'label', 'New opportunities identified widget'),
    jsonb_build_object('key', 'high_potential', 'label', 'High-potential opportunities widget'),
    jsonb_build_object('key', 'pipeline_progression', 'label', 'Pipeline progression widget'),
    jsonb_build_object('key', 'value_trends', 'label', 'Value realization trends widget'),
    jsonb_build_object('key', 'humans_decide', 'label', 'Aipify highlights — humans decide'),
    jsonb_build_object('key', 'index_levels', 'label', 'Emerging, Opportunistic, Structured, Proactive, Opportunity-Driven')
  )); $$;
create or replace function public._${bp}_opportunity_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Opportunity integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'strategic_execution', 'label', 'Strategic Execution Phase 263', 'cross_link', '/app/aipify-enterprise-strategic-execution-engine'),
    jsonb_build_object('key', 'market_awareness', 'label', 'External Intelligence Phase 255', 'cross_link', '/app/aipify-enterprise-external-intelligence-market-awareness-engine'),
    jsonb_build_object('key', 'relationship_intelligence', 'label', 'Relationship Intelligence Phase 262', 'cross_link', '/app/aipify-enterprise-trust-relationship-intelligence-engine'),
    jsonb_build_object('key', 'enterprise_analytics', 'label', 'Enterprise Analytics Phase 235', 'cross_link', '/app/aipify-enterprise-analytics-operational-intelligence-engine'),
    jsonb_build_object('key', 'innovation_discovery', 'label', 'Innovation & Opportunity Discovery Phase 212', 'cross_link', '/app/aipify-innovation-opportunity-discovery-engine'),
    jsonb_build_object('key', 'human_decision_gates', 'label', 'Human decision gates — Aipify highlights only')
  )); $$;
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Pursuing without human approval',
      'Bypassing opportunity owner judgment',
      'Hiding opportunity risks',
      'Replacing leadership decisions',
      'Modifying opportunity audit trails',
      'Unlogged opportunity decisions',
      'Auto-launching pilots',
      'Override human judgment'), 'principle', 'Opportunity Discovery Companion highlights — humans decide and discovery history stays auditable.'); $$;
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm discovery support without pressure.', 'values', jsonb_build_array('discover_before_reacting','humans_decide','validate_before_pursuing','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Opportunity discovery audit logs via aipify_enterprise_opportunity_discovery_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_opportunity_discovery permissions — discovery governance RBAC'),
    jsonb_build_object('key', 'human_gates', 'label', 'Humans decide — Aipify highlights only'),
    jsonb_build_object('key', 'opportunity_policies', 'label', 'Organization-defined opportunity and validation policies'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Opportunity metadata only — no raw operational records'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 264, 'key', 'enterprise_opportunity_discovery', 'label', 'Opportunity Discovery Phase 264', 'route', '/app/aipify-enterprise-opportunity-discovery-engine', 'description', 'Proactive growth discovery — starts era')
  ); $$;
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'strategic_execution', 'label', 'Strategic Execution Phase 263', 'route', '/app/aipify-enterprise-strategic-execution-engine', 'relationship', 'Execution gaps — cross-link only'),
    jsonb_build_object('key', 'market_awareness', 'label', 'External Intelligence Phase 255', 'route', '/app/aipify-enterprise-external-intelligence-market-awareness-engine', 'relationship', 'Market signals — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Humans decide — cross-link only')
  ); $$;
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as $$ select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); $$;
create or replace function public._${bp}_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Opportunity Center internally with discovery-governed validation and full audit logging. Growth Partner terminology. Opportunity Discovery Companion highlights — never pursues without human approval or bypasses opportunity owner judgment.'; $$;
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans decide.', 'Opportunity Discovery Companion highlights and recommends.', 'Discover before reacting — validate before pursuing.', 'Growth Partner — never Affiliate.', 'Opportunity Discovery Era starts — 264–268.'); $$;
create or replace function public._${bp}_privacy_note() returns text language sql immutable as $$
  select 'Opportunity Center metadata only — opportunity summaries max ~500 chars. No raw operational records beyond RBAC or PII in audit logs.'; $$;
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_enterprise_strategic_execution_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._aeseebp263_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_strategic_objective_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Opportunity registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_opportunity_registry_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_relationship_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Opportunity registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_opportunity_registry_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_critical_function_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Opportunity registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_opportunity_registry_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_memory_capture_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Opportunity registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_opportunity_registry_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_improvement_opportunity_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Opportunity registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_opportunity_registry_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_decision_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Opportunity registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_opportunity_registry_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_action_queue_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Opportunity registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_opportunity_registry_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_trend_monitoring_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Opportunity registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_opportunity_registry_hub()->'reflection_questions') = 5,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_strategic_execution_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Opportunity Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_opportunity_discovery_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_relationship_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Opportunity Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_opportunity_discovery_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_resilience_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Opportunity Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_opportunity_discovery_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_memory_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Opportunity Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_opportunity_discovery_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_improvement_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Opportunity Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_opportunity_discovery_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_decision_governance_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Opportunity Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_opportunity_discovery_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_orchestration_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Opportunity Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_opportunity_discovery_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_intelligence_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Opportunity Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_opportunity_discovery_dashboard()->'capabilities') = 10,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 1,`,
  );

  const replaceRpcRef = (sqlText, fn) => {
    if (fn === "opportunity_discovery_dashboard") {
      return sqlText.replace(/public\._(\w+)_opportunity_discovery_dashboard\(\)/g, (full, prefix) =>
        prefix.endsWith("discovery") ? full : `public._${P.bp}_opportunity_discovery_dashboard()`,
      );
    }
    return sqlText.replace(
      new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"),
      `public._${P.bp}_${fn}()`,
    );
  };

  for (const fn of [...SCAFFOLDS, "opportunity_discovery_companion"].sort((a, b) => b.length - a.length)) {
    sql = replaceRpcRef(sql, fn);
  }

  sql = sql.replace(
    new RegExp(`select '${P.slug}'[^;]+;`, "g"),
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    /select 'aipify-enterprise-strategic-execution-engine'[^;]+;/g,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected enterprise opportunity discovery guidance within Opportunity Discovery Era;",
    "RBAC-protected enterprise opportunity discovery guidance within Opportunity Discovery Era;",
  );
  sql = sql.replaceAll(
    "RBAC-protected enterprise opportunity discovery guidance within Opportunity Discovery Era;",
    "RBAC-protected enterprise opportunity discovery guidance within Opportunity Discovery Era;",
  );
  sql = sql.replaceAll(
    "RBAC-protected enterprise continuous improvement guidance within Continuous Optimization Era;",
    "RBAC-protected enterprise opportunity discovery guidance within Opportunity Discovery Era;",
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
    `'executive_opportunity_dashboard', public._${P.bp}_executive_opportunity_dashboard()`,
  );
  sql = sql.replace(
    /'improvement_improvement_dashboard', public\._\w+_improvement_improvement_dashboard\(\)/,
    `'executive_opportunity_dashboard', public._${P.bp}_executive_opportunity_dashboard()`,
  );
  sql = sql.replace(
    /'decision_decision_governance_dashboard', public\._\w+_decision_decision_governance_dashboard\(\)/,
    `'executive_opportunity_dashboard', public._${P.bp}_executive_opportunity_dashboard()`,
  );
  sql = sql.replace(
    /'orchestration_orchestration_dashboard', public\._\w+_orchestration_orchestration_dashboard\(\)/,
    `'executive_opportunity_dashboard', public._${P.bp}_executive_opportunity_dashboard()`,
  );
  sql = sql.replace(
    /'governance_rules_dashboard', public\._\w+_governance_rules_dashboard\(\)/,
    `'executive_opportunity_dashboard', public._${P.bp}_executive_opportunity_dashboard()`,
  );
  sql = sql.replace(
    /'improvement_controls_dashboard', public\._\w+_improvement_controls_dashboard\(\)/,
    `'executive_opportunity_dashboard', public._${P.bp}_executive_opportunity_dashboard()`,
  );
  sql = sql.replace(
    /'policy_controls_dashboard', public\._\w+_policy_controls_dashboard\(\)/,
    `'executive_opportunity_dashboard', public._${P.bp}_executive_opportunity_dashboard()`,
  );
  sql = sql.replace(
    /'intelligence_controls_dashboard', public\._\w+_intelligence_controls_dashboard\(\)/,
    `'executive_opportunity_dashboard', public._${P.bp}_executive_opportunity_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_resilience_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_opportunity_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_memory_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_opportunity_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_improvement_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_opportunity_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_decision_governance_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_opportunity_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_orchestration_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_opportunity_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_intelligence_controls_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_opportunity_dashboard()`,
  );

  sql = sql.replace(
    /'memory_controls_dashboard', public\._\w+_memory_controls_dashboard\(\)/,
    `'executive_opportunity_dashboard', public._${P.bp}_executive_opportunity_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_memory_controls_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_opportunity_dashboard()`,
  );

  return sql;
}

function genMigration() {
  const src263 = path.join(
    ROOT,
    "supabase/migrations/20261419000000_aipify_enterprise_strategic_execution_engine_phase263.sql",
  );
  if (!fs.existsSync(src263)) throw new Error("Phase 263 migration required");
  let m = transformFrom263(fs.readFileSync(src263, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-enterprise-strategic-execution-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(
    path.join(ROOT, `lib/core/${P.slug}.ts`),
    transformFrom263(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")),
  );
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(
      path.join(dst, f),
      transformFrom263(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")),
    );
  }
  const panel = path.join(
    ROOT,
    `components/app/${srcSlug}/AipifyEnterpriseStrategicExecutionEngineDashboardPanel.tsx`,
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`),
    transformFrom263(fs.readFileSync(panel, "utf8")),
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/index.ts`),
    `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`,
  );
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom263(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom263(
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

${P.centerTitle} within ${P.era}. **Starts the era.** ${P.companion} supports opportunity registry, opportunity detection engine, opportunity scoring, opportunity pipeline, opportunity validation workspace, executive opportunity dashboard, Aipify opportunity recommendations, opportunity collaboration, value realization tracking, and opportunity maturity index — does NOT pursue opportunities without human approval, bypass opportunity owner judgment, or omit opportunity audit history.

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
Era: ${P.era} (starts)
${P.crossLinkNote}
`,
  );
  write(
    path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
    `# ${P.title} Engine — FAQ (Phase ${P.phase})

## What is the Enterprise Opportunity Discovery Engine?

The Enterprise Opportunity Discovery Engine helps organizations continuously identify emerging opportunities at \`/app/${P.slug}\`.

## What opportunity discovery features are included?

Opportunity registry, opportunity detection engine, opportunity scoring, opportunity pipeline, opportunity validation workspace, executive opportunity dashboard, Aipify opportunity recommendations, opportunity collaboration, value realization tracking, and opportunity maturity index.

## What opportunity categories are supported?

Revenue growth, cost optimization, customer experience, product expansion, partnership development, workforce enablement, automation, market expansion, and innovation.

## What pipeline stages apply?

Identified, validating, planning, approved, executing, realized, and archived — with validation results proceed, refine, reject, and monitor.

## What does the opportunity discovery flow look like?

Signals detected → opportunities identified → scoring completed → validation initiated → pipeline progression managed → executive visibility provided → actions approved → value realized → organizational opportunity maturity strengthened.

## Who can access opportunity discovery?

Super Admin (full access), Tenant Admin (discovery policies), Executives (executive opportunity dashboard), Opportunity owners (opportunity stewardship), Validation leads (validation stewardship) — enterprise RBAC.

## Is full audit logging enforced?

**Yes.** Every opportunity lifecycle event is logged. Discovery metadata and validation history are recorded.

## How does this integrate with other Aipify surfaces?

${P.crossLinkNote}

## Does the Opportunity Discovery Companion replace leadership?

**No.** Aipify highlights — **humans decide.** ${P.companion} does **NOT** pursue opportunities without human approval, bypass opportunity owner judgment, or omit opportunity audit history.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Discovery: opportunity registry, detection, scoring, pipeline, validation, executive dashboard, recommendations, collaboration, value realization, maturity index.
Categories: revenue growth, cost optimization, customer experience, product expansion, partnership, workforce enablement, automation, market expansion, innovation.
Pipeline stages: identified, validating, planning, approved, executing, realized, archived.
Validation results: proceed, refine, reject, monitor.
Index levels: emerging, opportunistic, structured, proactive, opportunity-driven.
Flow: detect → identify → score → validate → pipeline → visibility → approve → realize → strengthen maturity.
Security: discovery governance RBAC, human decision gates, audit logging, metadata only, enterprise permissions, 2FA.
Design principles: Discover before reacting, humans decide, validate before pursuing.
Companion limitations: no pursuing without approval, no bypassing owner judgment, no hiding opportunity risks.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate. Era starts 264–268.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} highlights; never pursues without human approval, bypasses opportunity owner judgment, or omits opportunity audit history.";
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
      '| "aipifyEnterpriseStrategicExecutionEngine"',
      `| "aipifyEnterpriseStrategicExecutionEngine"\n  | "${id}"`,
    );
  }
  if (!c.includes(href)) {
    const anchor =
      /id: "aipifyEnterpriseStrategicExecutionEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyEnterpriseStrategicExecutionEngine",\n  },/;
    c = c.replace(
      anchor,
      (m) =>
        `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-enterprise-strategic-execution-engine")) {\n    return "aipifyEnterpriseStrategicExecutionEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-enterprise-strategic-execution-engine")) {\n    return "aipifyEnterpriseStrategicExecutionEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace(
        '"aipify_enterprise_strategic_execution.steward",',
        `"aipify_enterprise_strategic_execution.steward",\n    "${perm}",`,
      );
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-enterprise-strategic-execution-engine";',
      `export * from "./aipify-enterprise-strategic-execution-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era} starts. ${P.companion} supports opportunity registry, opportunity detection, opportunity scoring, opportunity pipeline, opportunity validation, executive opportunity dashboard, opportunity recommendations, opportunity collaboration, and value realization tracking. Aipify highlights — humans decide. Does NOT pursue opportunities without human approval or bypass opportunity owner judgment. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Opportunity maturity index",
    modeLabel: "Mode",
    readinessLabel: "Opportunity maturity level",
    executiveReviews: "Executive opportunity dashboard",
    activeReflections: "Active opportunity discovery scaffolds",
    humanOversightRequired: `Humans decide — users retain pursuit control; ${P.companion} highlights only`,
    eraOpenerSummary: `Opportunity Discovery Era — Phases ${P.eraRange} (starts)`,
    eraOpenerNote:
      "Cross-link only — do not duplicate Strategic Execution Engine, External Intelligence Engine, Relationship Intelligence Engine, Enterprise Analytics, or Innovation Discovery RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Opportunity registry — registry prompts",
    frameworkLabel: "Opportunity detection engine",
    reviewsLabel: "Executive opportunity dashboard",
    companionLabel: `${P.companion} — highlights opportunities, humans decide`,
    subEngineLabel: "Opportunity scoring engine",
    reflections: "Opportunity discovery scaffolds",
    executiveReviewEntries: "Validation entries",
    scaffoldNotes: "Discovery-governed opportunity scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT pursue opportunities without human approval, bypass opportunity owner judgment, or omit opportunity audit history`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports enterprise opportunity discovery — humans decide and discovery history stays auditable.`,
      philosophy:
        "People First. Aipify highlights — humans decide. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
      growthEra: `${P.era} — Phase ${P.phase} starts the era.`,
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
        ? "Mulighetsoppdagelse"
        : locale === "sv"
          ? "Möjlighetsupptäckt"
          : locale === "da"
            ? "Mulighedsopdagelse"
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
      'export * from "./implementation-blueprint-phase263-vocabulary";',
      `export * from "./implementation-blueprint-phase263-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE263_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase263-aipify-enterprise-strategic-execution.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE263_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase263-aipify-enterprise-strategic-execution.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_enterprise_strategic_execution.view`, `aipify_enterprise_strategic_execution.manage`, `aipify_enterprise_strategic_execution.steward`.";
  const entry = `\n**Enterprise Opportunity Discovery Engine (Phase 264):** See [AIPIFY_ENTERPRISE_OPPORTUNITY_DISCOVERY_PHASE264.md](./AIPIFY_ENTERPRISE_OPPORTUNITY_DISCOVERY_PHASE264.md) — Opportunity registry, opportunity detection engine, opportunity scoring, opportunity pipeline, opportunity validation workspace, executive opportunity dashboard, Aipify opportunity recommendations, opportunity collaboration, value realization tracking, and opportunity maturity index. **Starts** Opportunity Discovery Era (264–268). \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} highlights — **NOT** pursuing opportunities without human approval, bypassing opportunity owner judgment, or omitting opportunity audit history. Cross-links only: Strategic Execution Engine Phase 263, External Intelligence & Market Awareness Engine Phase 255, Relationship Intelligence Engine Phase 262, Enterprise Analytics Engine Phase 235, Innovation & Opportunity Discovery Engine Phase 212. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 264")) {
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
  console.error(`Phase ${P.phase} docs generated; stack requires Phase 263 artifacts: ${err.message}`);
  process.exitCode = 1;
}
