#!/usr/bin/env node
/** ABOS Phase 265 — Enterprise Organizational Adaptability Engine (Opportunity Discovery Era 264–268) */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "adaptability_dashboard",
  "change_registry_hub",
  "change_impact_assessment_engine",
  "readiness_assessment_engine",
  "adaptation_roadmaps_engine",
  "resistance_identification_engine",
  "executive_adaptability_dashboard",
  "training_enablement_tracking_engine",
  "adaptability_integration_center",
];

const P = {
  phase: 265,
  migration: "20261419200000_aipify_enterprise_organizational_adaptability_engine_phase265.sql",
  slug: "aipify-enterprise-organizational-adaptability-engine",
  base: "AipifyEnterpriseOrganizationalAdaptability",
  camel: "aipifyEnterpriseOrganizationalAdaptabilityEngine",
  snake: "aipify_enterprise_organizational_adaptability",
  permPrefix: "aipify_enterprise_organizational_adaptability",
  helper: "aeoae",
  bp: "aeoaebp265",
  decisionType: "aipify_enterprise_organizational_adaptability_engine",
  title: "Enterprise Organizational Adaptability",
  centerTitle: "Adaptability Center",
  companion: "Adaptability Companion",
  scoreKey: "aipify_enterprise_organizational_adaptability_score",
  modeKey: "enterprise_organizational_adaptability_mode",
  levelKey: "enterprise_organizational_adaptability_maturity_level",
  thirdEntity: "enterprise_organizational_adaptability_notes",
  era: "Opportunity Discovery Era (264–268)",
  eraRange: "264–268",
  docSlug: "AIPIFY_ENTERPRISE_ORGANIZATIONAL_ADAPTABILITY",
  ilmFile: "implementation-blueprint-phase265-aipify-enterprise-organizational-adaptability.txt",
  navLabel: "Organizational Adaptability",
  crossLinkNote: "Cross-links only: Opportunity Discovery Engine Phase 264, Strategic Execution Engine Phase 263, Resilience & Business Continuity Engine Phase 261, Organizational Memory Engine Phase 260, and Enterprise Analytics Engine Phase 235 — never drive transformation without leader approval, bypass change owner judgment, or omit adaptability audit history.",
  companionLimitations: [
    "driving_transformation_without_leader_approval",
    "bypassing_change_owner_judgment",
    "hiding_resistance_signals",
    "unlogged_change_decisions",
    "replacing_leader_guidance",
    "modifying_adaptability_audit_trail",
    "forcing_implementation_timelines",
    "override_human_judgment"
  ]
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom264(content) {
  const pairs = [
    ["AipifyEnterpriseOpportunityDiscovery", "AipifyEnterpriseOrganizationalAdaptability"],
    ["aipify-enterprise-opportunity-discovery-engine", "aipify-enterprise-organizational-adaptability-engine"],
    ["aipify_enterprise_opportunity_discovery", "aipify_enterprise_organizational_adaptability"],
    ["aipifyEnterpriseOpportunityDiscoveryEngine", "aipifyEnterpriseOrganizationalAdaptabilityEngine"],
    ["aeodebp264", "aeoaebp265"],
    ["_aeode_", "_aeoae_"],
    ["aipify_enterprise_opportunity_discovery_score", "aipify_enterprise_organizational_adaptability_score"],
    ["enterprise_opportunity_discovery_mode", "enterprise_organizational_adaptability_mode"],
    ["enterprise_opportunity_discovery_maturity_level", "enterprise_organizational_adaptability_maturity_level"],
    ["enterprise_opportunity_discovery_notes", "enterprise_organizational_adaptability_notes"],
    ["EnterpriseOpportunityDiscoveryNotes", "EnterpriseOrganizationalAdaptabilityNotes"],
    ["enterprise_opportunity_discovery_notes_count", "enterprise_organizational_adaptability_notes_count"],
    ["Opportunity Discovery Phase 264", "__AD_PHASE_264__"],
    ["Opportunity Discovery Companion", "__AD_COMPANION__"],
    ["Enterprise Opportunity Discovery", "Enterprise Organizational Adaptability"],
    ["__AD_COMPANION__", "Adaptability Companion"],
    ["Opportunity Center", "__AD_CENTER__"],
    ["__AD_PHASE_264__", "Opportunity Discovery Phase 264"],
    ["Phase 264", "Phase 265"],
    ["aipify_enterprise_opportunity_discovery.view", "aipify_enterprise_organizational_adaptability.view"],
    ["aipify_enterprise_opportunity_discovery.manage", "aipify_enterprise_organizational_adaptability.manage"],
    ["aipify_enterprise_opportunity_discovery.steward", "aipify_enterprise_organizational_adaptability.steward"],
    ["aipify_enterprise_opportunity_discovery_engine", "aipify_enterprise_organizational_adaptability_engine"],
    ["20261419100000_aipify_enterprise_opportunity_discovery_engine_phase264.sql", "20261419200000_aipify_enterprise_organizational_adaptability_engine_phase265.sql"],
    ["Repo Phase 264", "Repo Phase 265"],
    ["Phase 264 —", "Phase 265 —"],
    ["IMPLEMENTATION_BLUEPRINT_PHASE264_AIPIFY_ENTERPRISE_OPPORTUNITY_DISCOVERY", "IMPLEMENTATION_BLUEPRINT_PHASE265_AIPIFY_ENTERPRISE_ORGANIZATIONAL_ADAPTABILITY"],
    ["implementation-blueprint-phase264", "implementation-blueprint-phase265"],
    ["executive_opportunity_dashboard", "executive_adaptability_dashboard"],
    ["opportunity_discovery_dashboard", "adaptability_dashboard"],
    ["opportunity_registry_hub", "change_registry_hub"],
    ["opportunity_detection_engine", "change_impact_assessment_engine"],
    ["opportunity_scoring_engine", "readiness_assessment_engine"],
    ["opportunity_pipeline_engine", "adaptation_roadmaps_engine"],
    ["opportunity_validation_workspace", "resistance_identification_engine"],
    ["value_realization_tracking_engine", "training_enablement_tracking_engine"],
    ["opportunity_integration_center", "adaptability_integration_center"],
    ["opportunity_discovery_companion", "adaptability_companion"],
    ["_seed_enterprise_opportunity_discovery_notes", "_seed_enterprise_organizational_adaptability_notes"],
    ["opportunity discovery stewardship", "organizational adaptability stewardship"],
    ["signal-informed opportunity support", "change-informed adaptability support"],
    ["discovery-first opportunity culture", "adaptation-first change culture"],
    ["active opportunity programs", "active change programs"],
    ["opportunities requiring executive attention", "changes requiring executive attention"],
    ["Opportunity Registry", "Change Registry"],
    ["Opportunity Detection Engine", "Change Impact Assessment"],
    ["Opportunity Scoring", "Readiness Assessment Engine"],
    ["Opportunity Pipeline", "Adaptation Roadmaps"],
    ["Opportunity Validation Workspace", "Resistance Identification"],
    ["Executive Opportunity Dashboard", "Executive Adaptability Dashboard"],
    ["opportunity pipeline indicators", "adaptation progress indicators"],
    ["opportunity registry prompts", "change registry prompts"],
    ["opportunity discovery prompts", "organizational adaptability prompts"],
    ["value realization tracking", "training enablement tracking"],
    ["opportunity risk alerts", "resistance signal alerts"],
    ["RBAC-protected opportunity discovery governance", "RBAC-protected organizational adaptability governance"],
    ["Discover before reacting", "Assess before transforming"],
    ["Humans decide", "Leaders guide"],
    ["Validate before pursuing", "Prepare before implementing"],
    ["no_bypassing_opportunity_governance", "no_bypassing_adaptability_governance"],
    ["AIPIFY_ENTERPRISE_OPPORTUNITY_DISCOVERY", "AIPIFY_ENTERPRISE_ORGANIZATIONAL_ADAPTABILITY"],
    ["enterprise opportunity discovery", "enterprise organizational adaptability"],
    ["Opportunity discovery audit logs", "Organizational adaptability audit logs"],
    ["opportunity discovery governance RBAC", "organizational adaptability governance RBAC"],
    ["opportunity discovery scaffolds", "organizational adaptability scaffolds"],
    ["organization opportunity policies", "organization change policies"],
    ["Opportunity maturity index", "Organizational adaptability index"],
    ["Opportunity maturity level", "Adaptability maturity level"],
    ["Validation entries", "Training entries"],
    ["opportunity owner stewardship", "change owner stewardship"],
    ["opportunity records beyond RBAC", "change records beyond RBAC"],
    ["opportunity recommendation assistance", "adaptability recommendation assistance"],
    ["manager department opportunity visibility", "manager department change visibility"],
    ["Strategic Execution Engine Phase 263, External Intelligence & Market Awareness Engine Phase 255, Relationship Intelligence Engine Phase 262, Enterprise Analytics Engine Phase 235, and Aipify Innovation & Opportunity Discovery Engine Phase 212", "Opportunity Discovery Engine Phase 264, Strategic Execution Engine Phase 263, Resilience & Business Continuity Engine Phase 261, Organizational Memory Engine Phase 260, and Enterprise Analytics Engine Phase 235"],
    ["Never pursue opportunities without human approval or bypass opportunity owner judgment", "Never drive transformation without leader approval or bypass change owner judgment"],
    ["opportunity programs", "change programs"],
    ["Opportunity programs", "Change programs"],
    ["high-potential opportunity routing", "high-impact change routing"],
    ["pursues opportunities without human approval", "drives transformation without leader approval"],
    ["Unauthorized opportunity pursuit without human approval", "Unauthorized change implementation without leader approval"],
    ["Modifying opportunity audit trails", "Modifying adaptability audit trails"],
    ["Pursue before validation review", "Implement before readiness review"],
    ["user opportunity owner control", "user change owner control"],
    ["User opportunity owner control", "User change owner control"],
    ["opportunity outcomes and validation policies", "change outcomes and readiness policies"],
    ["pipeline progression visibility", "adaptation progress visibility"],
    ["opportunity discovery", "organizational adaptability"],
    ["enable organizations to continuously identify emerging opportunities across the organization, market, customers, products, operations, and partnerships — maintaining discovery governance, humans decide with Aipify guidance, full audit logging, role-based permissions, and proactive growth that compounds over time", "enable organizations to detect change, assess readiness, coordinate adaptation efforts, and strengthen their ability to evolve — maintaining adaptability governance, leaders guide transformation with Aipify facilitation, full audit logging, role-based permissions, and resilient evolution that compounds over time"],
    ["opportunities identified increase, opportunities realized grow, estimated vs realized value improves, validation success rates rise, strategic alignment scores strengthen, and opportunity maturity progresses with discover before reacting", "adoption rates increase, resistance levels decrease, readiness scores improve, transformation cycles accelerate, training completion rates rise, and adaptability index scores strengthen with assess before transforming"],
    ["Starts the era.", "Continues the era."],
    ["starts the era", "continues the era"],
    ["Opportunity Discovery Era starts", "Opportunity Discovery Era continues"],
    ["__AD_CENTER__", "Adaptability Center"],
  ];
  let out = content;
  for (const [from, to] of pairs) out = out.split(from).join(to);
  return out;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 265 — Adaptability Center. Adaptability Companion supports enterprise organizational adaptability — NOT driving transformation without leader approval, bypassing change owner judgment, or omitting adaptability audit history. Helpers _${bp}_*.'; $$;
create or replace function public._${bp}_mission() returns text language sql immutable as $$ select 'Help organizations detect change, assess readiness, coordinate adaptation efforts, and strengthen their ability to evolve — Adaptability Companion facilitates, leaders guide transformation.'; $$;
create or replace function public._${bp}_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._${bp}_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Adaptability Center within Opportunity Discovery Era (264–268). Aipify facilitates; leaders guide; adaptability-governed lifecycle; full audit logging; Adaptability Companion informs and recommends. Continues the era.'; $$;
create or replace function public._${bp}_vision() returns text language sql immutable as $$ select 'Organizations increase adoption rates, reduce resistance levels, improve readiness scores, accelerate transformation cycles, raise training completion rates, and strengthen adaptability index scores with assess before transforming.'; $$;
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Adaptability Center programs', 'emoji', '✅', 'description', 'Ten organizational adaptability modules'),
    jsonb_build_object('key', 'change_registry_hub', 'label', 'Change registry', 'emoji', '📋', 'description', 'Centralized change overview'),
    jsonb_build_object('key', 'change_impact_assessment_engine', 'label', 'Change impact assessment', 'emoji', '🔍', 'description', 'Evaluate effects of proposed changes'),
    jsonb_build_object('key', 'readiness_assessment_engine', 'label', 'Readiness assessment engine', 'emoji', '📊', 'description', 'Determine organizational preparedness'),
    jsonb_build_object('key', 'companion', 'label', 'Adaptability Companion', 'emoji', '✨', 'description', 'Facilitates — leaders guide'),
    jsonb_build_object('key', 'resistance_identification_engine', 'label', 'Resistance identification', 'emoji', '🧪', 'description', 'Recognize barriers to change'),
    jsonb_build_object('key', 'executive_adaptability_dashboard', 'label', 'Executive adaptability dashboard', 'emoji', '🛡️', 'description', 'Leadership change visibility'),
    jsonb_build_object('key', 'adaptation_roadmaps_engine', 'label', 'Adaptation roadmaps', 'emoji', '🔔', 'description', 'Structured implementation pathways')
  ); $$;
create or replace function public._${bp}_adaptability_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Adaptability Center — ten capabilities. Assess before transforming.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'change_registry', 'label', 'Change Registry'),
    jsonb_build_object('key', 'change_impact_assessment', 'label', 'Change Impact Assessment'),
    jsonb_build_object('key', 'readiness_assessment', 'label', 'Readiness Assessment Engine'),
    jsonb_build_object('key', 'adaptation_roadmaps', 'label', 'Adaptation Roadmaps'),
    jsonb_build_object('key', 'resistance_identification', 'label', 'Resistance Identification'),
    jsonb_build_object('key', 'executive_adaptability_dashboard', 'label', 'Executive Adaptability Dashboard'),
    jsonb_build_object('key', 'communication_coordination', 'label', 'Communication Coordination'),
    jsonb_build_object('key', 'training_enablement', 'label', 'Training & Enablement Tracking'),
    jsonb_build_object('key', 'adaptability_recommendations', 'label', 'Aipify Adaptability Recommendations'),
    jsonb_build_object('key', 'organizational_adaptability_index', 'label', 'Organizational Adaptability Index')
  )); $$;
create or replace function public._${bp}_change_registry_hub() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Change registry — centralized overview of significant organizational changes.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'change_owners', 'label', 'Are executive sponsors and change owners assigned?'),
    jsonb_build_object('key', 'categories', 'label', 'Are organizational, technology, operational, and strategic changes categorized?'),
    jsonb_build_object('key', 'scope', 'label', 'Is scope affected documented for each change?'),
    jsonb_build_object('key', 'timeline', 'label', 'Are start and expected completion dates recorded?'),
    jsonb_build_object('key', 'leader_guidance', 'label', 'How does registry support leader-guided transformation with Aipify facilitation?')
  )); $$;
create or replace function public._${bp}_change_impact_assessment_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Change impact assessment — evaluate effects of proposed changes.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'teams_affected', 'label', 'Teams affected'),
    jsonb_build_object('key', 'processes_affected', 'label', 'Processes affected'),
    jsonb_build_object('key', 'systems_affected', 'label', 'Systems affected'),
    jsonb_build_object('key', 'limited', 'label', 'Limited impact level'),
    jsonb_build_object('key', 'moderate', 'label', 'Moderate impact level'),
    jsonb_build_object('key', 'significant', 'label', 'Significant impact level'),
    jsonb_build_object('key', 'transformational', 'label', 'Transformational impact level')
  )); $$;
create or replace function public._${bp}_training_enablement_tracking_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Training and enablement tracking — ensure people are equipped for change.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'required_activities', 'label', 'Required learning activities'),
    jsonb_build_object('key', 'participation_rates', 'label', 'Participation rates'),
    jsonb_build_object('key', 'completion_rates', 'label', 'Completion rates'),
    jsonb_build_object('key', 'not_started', 'label', 'Not Started state'),
    jsonb_build_object('key', 'in_progress', 'label', 'In Progress state'),
    jsonb_build_object('key', 'overdue', 'label', 'Overdue state')
  )); $$;
create or replace function public._${bp}_adaptability_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Adaptability Companion — facilitates adaptation and never drives transformation without leader approval or bypasses change owner judgment.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'delay_implementation', 'label', 'Delay implementation recommendations'),
    jsonb_build_object('key', 'increase_communication', 'label', 'Increase communication effort suggestions'),
    jsonb_build_object('key', 'expand_training', 'label', 'Expand training support guidance'),
    jsonb_build_object('key', 'reassess_timelines', 'label', 'Reassess timeline suggestions'),
    jsonb_build_object('key', 'escalate_blockers', 'label', 'Escalate unresolved blocker recommendations'),
    jsonb_build_object('key', 'adaptability_guardrails', 'label', 'Adaptability governance — Trust Architecture enforced')
  )); $$;
create or replace function public._${bp}_readiness_assessment_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Readiness assessment — determine whether the organization is prepared.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'leadership_alignment', 'label', 'Leadership alignment evaluation'),
    jsonb_build_object('key', 'workforce_readiness', 'label', 'Workforce readiness evaluation'),
    jsonb_build_object('key', 'ready', 'label', 'Ready readiness state'),
    jsonb_build_object('key', 'partially_ready', 'label', 'Partially Ready state'),
    jsonb_build_object('key', 'needs_preparation', 'label', 'Needs Preparation state'),
    jsonb_build_object('key', 'not_ready', 'label', 'Not Ready state')
  )); $$;
create or replace function public._${bp}_adaptation_roadmaps_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Adaptation roadmaps — structured implementation pathways.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'milestones', 'label', 'Roadmap milestones'),
    jsonb_build_object('key', 'dependencies', 'label', 'Roadmap dependencies'),
    jsonb_build_object('key', 'planned', 'label', 'Planned roadmap status'),
    jsonb_build_object('key', 'active', 'label', 'Active roadmap status'),
    jsonb_build_object('key', 'delayed', 'label', 'Delayed roadmap status'),
    jsonb_build_object('key', 'completed', 'label', 'Completed roadmap status')
  )); $$;
create or replace function public._${bp}_resistance_identification_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Resistance identification — recognize barriers to successful change.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'delayed_adoption', 'label', 'Delayed adoption indicator'),
    jsonb_build_object('key', 'low_engagement', 'label', 'Low engagement indicator'),
    jsonb_build_object('key', 'training_gaps', 'label', 'Training gap indicator'),
    jsonb_build_object('key', 'additional_communication', 'label', 'Additional communication recommendation'),
    jsonb_build_object('key', 'leadership_engagement', 'label', 'Leadership engagement recommendation')
  )); $$;
create or replace function public._${bp}_executive_adaptability_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive adaptability dashboard — leadership change visibility.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'active_changes', 'label', 'Active changes widget'),
    jsonb_build_object('key', 'readiness_trends', 'label', 'Readiness trends widget'),
    jsonb_build_object('key', 'resistance_areas', 'label', 'Areas of resistance widget'),
    jsonb_build_object('key', 'communication_schedules', 'label', 'Communication coordination schedules'),
    jsonb_build_object('key', 'leaders_guide', 'label', 'Aipify facilitates — leaders guide'),
    jsonb_build_object('key', 'index_levels', 'label', 'Rigid, Emerging, Adaptive, Agile, Continuously Evolving')
  )); $$;
create or replace function public._${bp}_adaptability_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Adaptability integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'opportunity_discovery', 'label', 'Opportunity Discovery Phase 264', 'cross_link', '/app/aipify-enterprise-opportunity-discovery-engine'),
    jsonb_build_object('key', 'strategic_execution', 'label', 'Strategic Execution Phase 263', 'cross_link', '/app/aipify-enterprise-strategic-execution-engine'),
    jsonb_build_object('key', 'resilience_continuity', 'label', 'Resilience & Continuity Phase 261', 'cross_link', '/app/aipify-enterprise-resilience-business-continuity-engine'),
    jsonb_build_object('key', 'organizational_memory', 'label', 'Organizational Memory Phase 260', 'cross_link', '/app/aipify-enterprise-organizational-memory-engine'),
    jsonb_build_object('key', 'enterprise_analytics', 'label', 'Enterprise Analytics Phase 235', 'cross_link', '/app/aipify-enterprise-analytics-operational-intelligence-engine'),
    jsonb_build_object('key', 'leader_guidance_gates', 'label', 'Leader guidance gates — Aipify facilitates only')
  )); $$;
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Driving transformation without leader approval',
      'Bypassing change owner judgment',
      'Hiding resistance signals',
      'Replacing leader guidance',
      'Modifying adaptability audit trails',
      'Unlogged change decisions',
      'Forcing implementation timelines',
      'Override human judgment'), 'principle', 'Adaptability Companion facilitates — leaders guide and change history stays auditable.'); $$;
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm adaptability support without pressure.', 'values', jsonb_build_array('assess_before_transforming','leaders_guide','prepare_before_implementing','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Organizational adaptability audit logs via aipify_enterprise_organizational_adaptability_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_organizational_adaptability permissions — adaptability governance RBAC'),
    jsonb_build_object('key', 'leader_gates', 'label', 'Leaders guide — Aipify facilitates only'),
    jsonb_build_object('key', 'change_policies', 'label', 'Organization-defined change and readiness policies'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Change metadata only — no raw operational records'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 264, 'key', 'enterprise_opportunity_discovery', 'label', 'Opportunity Discovery Phase 264', 'route', '/app/aipify-enterprise-opportunity-discovery-engine', 'description', 'Proactive growth discovery — cross-link only'),
    jsonb_build_object('phase', 265, 'key', 'enterprise_organizational_adaptability', 'label', 'Organizational Adaptability Phase 265', 'route', '/app/aipify-enterprise-organizational-adaptability-engine', 'description', 'Change readiness and adaptation — continues era')
  ); $$;
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'opportunity_discovery', 'label', 'Opportunity Discovery Phase 264', 'route', '/app/aipify-enterprise-opportunity-discovery-engine', 'relationship', 'Change signals — cross-link only'),
    jsonb_build_object('key', 'resilience_continuity', 'label', 'Resilience & Continuity Phase 261', 'route', '/app/aipify-enterprise-resilience-business-continuity-engine', 'relationship', 'Continuity planning — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Leaders guide — cross-link only')
  ); $$;
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as $$ select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); $$;
create or replace function public._${bp}_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Adaptability Center internally with adaptability-governed change coordination and full audit logging. Growth Partner terminology. Adaptability Companion facilitates — never drives transformation without leader approval or bypasses change owner judgment.'; $$;
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — leaders guide.', 'Adaptability Companion facilitates and recommends.', 'Assess before transforming — prepare before implementing.', 'Growth Partner — never Affiliate.', 'Opportunity Discovery Era continues — 264–268.'); $$;
create or replace function public._${bp}_privacy_note() returns text language sql immutable as $$
  select 'Adaptability Center metadata only — change summaries max ~500 chars. No raw operational records beyond RBAC or PII in audit logs.'; $$;
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_enterprise_opportunity_discovery_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._aeodebp264_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_strategic_objective_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Change registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_change_registry_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_relationship_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Change registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_change_registry_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_critical_function_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Change registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_change_registry_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_memory_capture_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Change registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_change_registry_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_improvement_opportunity_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Change registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_change_registry_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_decision_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Change registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_change_registry_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_action_queue_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Change registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_change_registry_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_trend_monitoring_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Change registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_change_registry_hub()->'reflection_questions') = 5,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_strategic_execution_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Adaptability Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_adaptability_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_relationship_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Adaptability Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_adaptability_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_resilience_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Adaptability Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_adaptability_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_memory_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Adaptability Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_adaptability_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_improvement_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Adaptability Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_adaptability_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_decision_governance_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Adaptability Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_adaptability_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_orchestration_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Adaptability Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_adaptability_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_intelligence_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Adaptability Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_adaptability_dashboard()->'capabilities') = 10,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  const replaceRpcRef = (sqlText, fn) => {
    if (fn === "adaptability_dashboard") {
      return sqlText.replace(/public\._(\w+)_adaptability_dashboard\(\)/g, (full, prefix) =>
        prefix.includes("executive") ? full : `public._${P.bp}_adaptability_dashboard()`,
      );
    }
    return sqlText.replace(
      new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"),
      `public._${P.bp}_${fn}()`,
    );
  };

  for (const fn of [...SCAFFOLDS, "adaptability_companion"].sort((a, b) => b.length - a.length)) {
    sql = replaceRpcRef(sql, fn);
  }

  sql = sql.replace(
    new RegExp(`select '${P.slug}'[^;]+;`, "g"),
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    /select 'aipify-enterprise-opportunity-discovery-engine'[^;]+;/g,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected enterprise organizational adaptability guidance within Opportunity Discovery Era;",
    "RBAC-protected enterprise organizational adaptability guidance within Opportunity Discovery Era;",
  );
  sql = sql.replaceAll(
    "RBAC-protected enterprise organizational adaptability guidance within Opportunity Discovery Era;",
    "RBAC-protected enterprise organizational adaptability guidance within Opportunity Discovery Era;",
  );
  sql = sql.replaceAll(
    "RBAC-protected enterprise continuous improvement guidance within Continuous Optimization Era;",
    "RBAC-protected enterprise organizational adaptability guidance within Opportunity Discovery Era;",
  );
  sql = sql.replace(
    /Phase 265 Enterprise Organizational Adaptability Engine —/,
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
    `'executive_adaptability_dashboard', public._${P.bp}_executive_adaptability_dashboard()`,
  );
  sql = sql.replace(
    /'improvement_improvement_dashboard', public\._\w+_improvement_improvement_dashboard\(\)/,
    `'executive_adaptability_dashboard', public._${P.bp}_executive_adaptability_dashboard()`,
  );
  sql = sql.replace(
    /'decision_decision_governance_dashboard', public\._\w+_decision_decision_governance_dashboard\(\)/,
    `'executive_adaptability_dashboard', public._${P.bp}_executive_adaptability_dashboard()`,
  );
  sql = sql.replace(
    /'orchestration_orchestration_dashboard', public\._\w+_orchestration_orchestration_dashboard\(\)/,
    `'executive_adaptability_dashboard', public._${P.bp}_executive_adaptability_dashboard()`,
  );
  sql = sql.replace(
    /'governance_rules_dashboard', public\._\w+_governance_rules_dashboard\(\)/,
    `'executive_adaptability_dashboard', public._${P.bp}_executive_adaptability_dashboard()`,
  );
  sql = sql.replace(
    /'improvement_controls_dashboard', public\._\w+_improvement_controls_dashboard\(\)/,
    `'executive_adaptability_dashboard', public._${P.bp}_executive_adaptability_dashboard()`,
  );
  sql = sql.replace(
    /'policy_controls_dashboard', public\._\w+_policy_controls_dashboard\(\)/,
    `'executive_adaptability_dashboard', public._${P.bp}_executive_adaptability_dashboard()`,
  );
  sql = sql.replace(
    /'intelligence_controls_dashboard', public\._\w+_intelligence_controls_dashboard\(\)/,
    `'executive_adaptability_dashboard', public._${P.bp}_executive_adaptability_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_resilience_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_adaptability_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_memory_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_adaptability_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_improvement_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_adaptability_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_decision_governance_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_adaptability_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_orchestration_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_adaptability_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_intelligence_controls_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_adaptability_dashboard()`,
  );

  sql = sql.replace(
    /'memory_controls_dashboard', public\._\w+_memory_controls_dashboard\(\)/,
    `'executive_adaptability_dashboard', public._${P.bp}_executive_adaptability_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_memory_controls_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_executive_adaptability_dashboard()`,
  );

  return sql;
}

function genMigration() {
  const src264 = path.join(
    ROOT,
    "supabase/migrations/20261419100000_aipify_enterprise_opportunity_discovery_engine_phase264.sql",
  );
  if (!fs.existsSync(src264)) throw new Error("Phase 264 migration required");
  let m = transformFrom264(fs.readFileSync(src264, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-enterprise-opportunity-discovery-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(
    path.join(ROOT, `lib/core/${P.slug}.ts`),
    transformFrom264(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")),
  );
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(
      path.join(dst, f),
      transformFrom264(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")),
    );
  }
  const panel = path.join(
    ROOT,
    `components/app/${srcSlug}/AipifyEnterpriseOpportunityDiscoveryEngineDashboardPanel.tsx`,
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`),
    transformFrom264(fs.readFileSync(panel, "utf8")),
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/index.ts`),
    `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`,
  );
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom264(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom264(
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

${P.centerTitle} within ${P.era}. **Continues the era.** ${P.companion} supports change registry, change impact assessment, readiness assessment engine, adaptation roadmaps, resistance identification, executive adaptability dashboard, communication coordination, training and enablement tracking, Aipify adaptability recommendations, and organizational adaptability index — does NOT drive transformation without leader approval, bypass change owner judgment, or omit adaptability audit history.

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

## What is the Enterprise Organizational Adaptability Engine?

The Enterprise Organizational Adaptability Engine helps organizations detect change, assess readiness, and coordinate adaptation at \`/app/${P.slug}\`.

## What organizational adaptability features are included?

Change registry, change impact assessment, readiness assessment engine, adaptation roadmaps, resistance identification, executive adaptability dashboard, communication coordination, training and enablement tracking, Aipify adaptability recommendations, and organizational adaptability index.

## What change categories are supported?

Organizational, technology, operational, strategic, regulatory, customer experience, workforce, and market response.

## What readiness states apply?

Ready, partially ready, needs preparation, and not ready — with impact levels limited, moderate, significant, and transformational.

## What does the adaptability flow look like?

Need for change identified → impact assessed → readiness evaluated → adaptation roadmap created → communication initiated → training delivered → resistance monitored → progress reviewed → adaptability strengthened.

## Who can access organizational adaptability?

Super Admin (full access), Tenant Admin (change policies), Executives (executive adaptability dashboard), Change owners (change stewardship), Readiness leads (readiness stewardship) — enterprise RBAC.

## Is full audit logging enforced?

**Yes.** Every adaptability lifecycle event is logged. Change metadata and readiness history are recorded.

## How does this integrate with other Aipify surfaces?

${P.crossLinkNote}

## Does the Adaptability Companion replace leadership?

**No.** Aipify facilitates — **leaders guide transformation.** ${P.companion} does **NOT** drive transformation without leader approval, bypass change owner judgment, or omit adaptability audit history.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Adaptability: change registry, impact assessment, readiness, roadmaps, resistance identification, executive dashboard, communication, training, recommendations, adaptability index.
Categories: organizational, technology, operational, strategic, regulatory, customer experience, workforce, market response.
Readiness states: ready, partially ready, needs preparation, not ready.
Impact levels: limited, moderate, significant, transformational.
Index levels: rigid, emerging, adaptive, agile, continuously evolving.
Flow: identify → assess → evaluate → roadmap → communicate → train → monitor → review → strengthen.
Security: adaptability governance RBAC, leader gates, audit logging, metadata only, enterprise permissions, 2FA.
Design principles: Assess before transforming, leaders guide, prepare before implementing.
Companion limitations: no driving transformation without approval, no bypassing owner judgment, no hiding resistance signals.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate. Era continues 264–268.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} facilitates; never drives transformation without leader approval, bypasses change owner judgment, or omits adaptability audit history.";
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
      '| "aipifyEnterpriseOpportunityDiscoveryEngine"',
      `| "aipifyEnterpriseOpportunityDiscoveryEngine"\n  | "${id}"`,
    );
  }
  if (!c.includes(href)) {
    const anchor =
      /id: "aipifyEnterpriseOpportunityDiscoveryEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyEnterpriseOpportunityDiscoveryEngine",\n  },/;
    c = c.replace(
      anchor,
      (m) =>
        `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-enterprise-opportunity-discovery-engine")) {\n    return "aipifyEnterpriseOpportunityDiscoveryEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-enterprise-opportunity-discovery-engine")) {\n    return "aipifyEnterpriseOpportunityDiscoveryEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace(
        '"aipify_enterprise_opportunity_discovery.steward",',
        `"aipify_enterprise_opportunity_discovery.steward",\n    "${perm}",`,
      );
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-enterprise-opportunity-discovery-engine";',
      `export * from "./aipify-enterprise-opportunity-discovery-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era} continues. ${P.companion} supports change registry, change impact assessment, readiness assessment, adaptation roadmaps, resistance identification, executive adaptability dashboard, communication coordination, and training enablement tracking. Aipify facilitates — leaders guide transformation. Does NOT drive transformation without leader approval or bypass change owner judgment. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Organizational adaptability index",
    modeLabel: "Mode",
    readinessLabel: "Adaptability maturity level",
    executiveReviews: "Executive adaptability dashboard",
    activeReflections: "Active organizational adaptability scaffolds",
    humanOversightRequired: `Leaders guide — users retain transformation control; ${P.companion} facilitates only`,
    eraOpenerSummary: `Opportunity Discovery Era — Phases ${P.eraRange} (continues)`,
    eraOpenerNote:
      "Cross-link only — do not duplicate Opportunity Discovery Engine, Strategic Execution Engine, Resilience Engine, Organizational Memory Engine, or Enterprise Analytics RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Change registry — registry prompts",
    frameworkLabel: "Change impact assessment engine",
    reviewsLabel: "Executive adaptability dashboard",
    companionLabel: `${P.companion} — facilitates adaptation, leaders guide`,
    subEngineLabel: "Readiness assessment engine",
    reflections: "Organizational adaptability scaffolds",
    executiveReviewEntries: "Training entries",
    scaffoldNotes: "Adaptability-governed change scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT drive transformation without leader approval, bypass change owner judgment, or omit adaptability audit history`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports enterprise organizational adaptability — leaders guide and change history stays auditable.`,
      philosophy:
        "People First. Aipify facilitates — leaders guide. Growth Partner terminology — never Affiliate.",
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
        ? "Organisasjonstilpasning"
        : locale === "sv"
          ? "Organisationell anpassningsförmåga"
          : locale === "da"
            ? "Organisatorisk tilpasningsevne"
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
      'export * from "./implementation-blueprint-phase264-vocabulary";',
      `export * from "./implementation-blueprint-phase264-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE264_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase264-aipify-enterprise-opportunity-discovery.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE264_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase264-aipify-enterprise-opportunity-discovery.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_enterprise_opportunity_discovery.view`, `aipify_enterprise_opportunity_discovery.manage`, `aipify_enterprise_opportunity_discovery.steward`.";
  const entry = `\n**Enterprise Organizational Adaptability Engine (Phase 265):** See [AIPIFY_ENTERPRISE_ORGANIZATIONAL_ADAPTABILITY_PHASE265.md](./AIPIFY_ENTERPRISE_ORGANIZATIONAL_ADAPTABILITY_PHASE265.md) — Change registry, change impact assessment, readiness assessment engine, adaptation roadmaps, resistance identification, executive adaptability dashboard, communication coordination, training and enablement tracking, Aipify adaptability recommendations, and organizational adaptability index. **Continues** Opportunity Discovery Era (264–268). \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} facilitates — **NOT** driving transformation without leader approval, bypassing change owner judgment, or omitting adaptability audit history. Cross-links only: Opportunity Discovery Engine Phase 264, Strategic Execution Engine Phase 263, Resilience & Business Continuity Engine Phase 261, Organizational Memory Engine Phase 260, Enterprise Analytics Engine Phase 235. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 265")) {
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
  console.error(`Phase ${P.phase} docs generated; stack requires Phase 264 artifacts: ${err.message}`);
  process.exitCode = 1;
}
