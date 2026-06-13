#!/usr/bin/env node
/** ABOS Phase 260 — Enterprise Organizational Memory Engine (Continuous Optimization Era 259–263) */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "memory_dashboard",
  "memory_capture_hub",
  "memory_records_engine",
  "lessons_learned_engine",
  "smart_memory_search_engine",
  "contextual_memory_engine",
  "memory_controls_dashboard",
  "expertise_discovery_engine",
  "memory_integration_center",
];

const P = {
  phase: 260,
  migration: "20261418700000_aipify_enterprise_organizational_memory_engine_phase260.sql",
  slug: "aipify-enterprise-organizational-memory-engine",
  base: "AipifyEnterpriseOrganizationalMemory",
  camel: "aipifyEnterpriseOrganizationalMemoryEngine",
  snake: "aipify_enterprise_organizational_memory",
  permPrefix: "aipify_enterprise_organizational_memory",
  helper: "aeome",
  bp: "aeomebp260",
  decisionType: "aipify_enterprise_organizational_memory_engine",
  title: "Enterprise Organizational Memory",
  centerTitle: "Organizational Memory Center",
  companion: "Memory Companion",
  scoreKey: "aipify_enterprise_organizational_memory_score",
  modeKey: "enterprise_organizational_memory_mode",
  levelKey: "enterprise_organizational_memory_maturity_level",
  thirdEntity: "enterprise_organizational_memory_notes",
  era: "Continuous Optimization Era (259–263)",
  eraRange: "259–263",
  docSlug: "AIPIFY_ENTERPRISE_ORGANIZATIONAL_MEMORY_ENGINE",
  ilmFile: "implementation-blueprint-phase260-aipify-enterprise-organizational-memory.txt",
  navLabel: "Organizational Memory",
  crossLinkNote:
    "Cross-links only: Continuous Improvement Engine Phase 259, Decision Escalation & Governance Engine Phase 258, Employee Knowledge Engine, Business DNA Engine, Enterprise Search Engine Phase 234, Executive Cockpit Phase 200, Enterprise Analytics Engine Phase 235, and Aipify Translate Phase 238 — never bypass memory governance, expose restricted memory beyond RBAC, or store raw operational records without approval.",
  companionLimitations: [
    "exposing_restricted_memory_beyond_rbac",
    "bypassing_memory_governance",
    "hiding_memory_provenance",
    "unlogged_memory_changes",
    "replacing_memory_owner_judgment",
    "modifying_memory_audit_trail",
    "ignoring_knowledge_decay_reviews",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom259(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyEnterpriseContinuousImprovement", P.base],
    ["aipify-enterprise-continuous-improvement-engine", P.slug],
    ["aipify_enterprise_continuous_improvement", P.snake],
    ["aipifyEnterpriseContinuousImprovementEngine", P.camel],
    ["aeciebp259", P.bp],
    ["_aecie_", `_${P.helper}_`],
    ["aipify_enterprise_continuous_improvement_score", P.scoreKey],
    ["enterprise_continuous_improvement_mode", P.modeKey],
    ["enterprise_continuous_improvement_maturity_level", P.levelKey],
    ["enterprise_continuous_improvement_notes", P.thirdEntity],
    ["EnterpriseContinuousImprovementNote", thirdPascal],
    ["enterprise_continuous_improvement_notes_count", `${P.thirdEntity}_count`],
    ["Continuous Improvement Phase 259", "__OM_PHASE_259__"],
    ["Improvement Companion", "__OM_COMPANION__"],
    ["Enterprise Continuous Improvement", P.title],
    ["__OM_COMPANION__", P.companion],
    ["Continuous Improvement", "__OM_CENTER__"],
    ["__OM_PHASE_259__", "Continuous Improvement Phase 259"],
    ["Phase 259", `Phase ${P.phase}`],
    ["aipify_enterprise_continuous_improvement.view", `${P.permPrefix}.view`],
    ["aipify_enterprise_continuous_improvement.manage", `${P.permPrefix}.manage`],
    ["aipify_enterprise_continuous_improvement.steward", `${P.permPrefix}.steward`],
    ["aipify_enterprise_continuous_improvement_engine", P.decisionType],
    [
      "20261418600000_aipify_enterprise_continuous_improvement_engine_phase259.sql",
      P.migration,
    ],
    ["Repo Phase 259", `Repo Phase ${P.phase}`],
    ["Phase 259 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE259_AIPIFY_ENTERPRISE_CONTINUOUS_IMPROVEMENT_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase259", `implementation-blueprint-phase${P.phase}`],
    ["improvement_controls_dashboard", SCAFFOLDS[6]],
    ["improvement_dashboard", SCAFFOLDS[0]],
    ["improvement_opportunity_hub", SCAFFOLDS[1]],
    ["improvement_backlog_engine", SCAFFOLDS[2]],
    ["impact_estimation_engine", SCAFFOLDS[3]],
    ["implementation_tracking_engine", SCAFFOLDS[4]],
    ["before_after_analysis_engine", SCAFFOLDS[5]],
    ["employee_submissions_engine", SCAFFOLDS[7]],
    ["improvement_integration_center", SCAFFOLDS[8]],
    ["improvement_companion", "memory_companion"],
    [
      "_seed_enterprise_continuous_improvement_notes",
      `_seed_${P.thirdEntity.replace("_notes", "")}_notes`,
    ],
    ["continuous improvement stewardship", "organizational memory stewardship"],
    ["data-informed improvement support", "context-informed memory support"],
    ["evidence-first improvement culture", "stewardship-first memory culture"],
    ["active improvement programs", "active memory programs"],
    ["improvements requiring executive attention", "memories requiring executive attention"],
    ["Improvement Opportunity Detection", "Memory Capture Engine"],
    ["Improvement Backlog Engine", "Memory Records Engine"],
    ["Impact Estimation Engine", "Lessons Learned Framework"],
    ["Implementation Tracking Engine", "Smart Memory Search"],
    ["Before vs After Analysis Engine", "Contextual Memory Recommendations"],
    ["Improvement Controls Dashboard", "Memory Governance Dashboard"],
    ["improvement completion indicators", "memory capture indicators"],
    ["improvement opportunity prompts", "memory capture prompts"],
    ["improvement assistant prompts", "memory assistant prompts"],
    ["employee improvement submissions", "expertise discovery"],
    ["improvement alert signals", "memory recommendation signals"],
    ["RBAC-protected improvement policies", "RBAC-protected memory governance"],
    ["Detect before optimizing", "Capture before forgetting"],
    ["Human approval before implementation", "Human stewardship before archival"],
    ["Measure before claiming success", "Review before deprecating"],
    ["no_bypassing_improvement_approval", "no_bypassing_memory_governance"],
    ["AIPIFY_ENTERPRISE_CONTINUOUS_IMPROVEMENT_ENGINE", P.docSlug],
    ["enterprise continuous improvement", "enterprise organizational memory"],
    ["Continuous improvement audit logs", "Organizational memory audit logs"],
    ["improvement policy RBAC", "memory governance RBAC"],
    ["continuous improvement scaffolds", "organizational memory scaffolds"],
    ["organization improvement policies", "organization memory policies"],
    ["Continuous improvement score", "Organizational memory health score"],
    ["Improvement maturity level", "Memory maturity level"],
    ["Improvement backlog entries", "Memory record entries"],
    ["improvement initiative stewardship", "memory owner stewardship"],
    ["improvement records beyond RBAC", "memory records beyond RBAC"],
    ["implementation tracking assistance", "knowledge decay review assistance"],
    ["manager department improvement visibility", "manager department memory visibility"],
    [
      "Decision Escalation & Governance Engine Phase 258, Action Orchestration Engine Phase 256, Enterprise Analytics Engine Phase 235, Enterprise Notification Engine Phase 233, Employee Knowledge Engine, Executive Cockpit Phase 200, Resource Capacity Engine Phase 209, and Aipify Translate Phase 238",
      "Continuous Improvement Engine Phase 259, Decision Escalation & Governance Engine Phase 258, Employee Knowledge Engine, Business DNA Engine, Enterprise Search Engine Phase 234, Executive Cockpit Phase 200, Enterprise Analytics Engine Phase 235, and Aipify Translate Phase 238",
    ],
    [
      "Never bypass improvement approval workflows or implement changes without human approval",
      "Never bypass memory governance or expose restricted memory beyond RBAC",
    ],
    ["improvement programs", "memory programs"],
    ["Improvement programs", "Memory programs"],
    ["high-impact improvement routing", "high-importance memory routing"],
    ["implements changes without improvement approval", "exposes memory without governance approval"],
    ["Unauthorized improvement implementation without approval", "Unauthorized memory access without governance approval"],
    ["Modifying improvement audit trails", "Modifying memory audit trails"],
    ["Claims before measurement", "Archive before review"],
    ["user improvement judgment control", "user memory stewardship control"],
    ["User improvement judgment control", "User memory stewardship control"],
    ["improvement outcomes and prioritization policies", "memory outcomes and retention policies"],
    ["improvement backlog visibility", "memory records visibility"],
    ["continuous improvement", "organizational memory"],
    [
      "enable organizations to continuously identify inefficiencies, monitor improvement opportunities, track implemented changes, and evolve through measurable optimization — maintaining improvement approval workflows, human approval for implementation, full audit logging, role-based permissions, and institutional knowledge retention",
      "enable organizations to preserve critical knowledge, decisions, experiences, and lessons learned — maintaining memory governance, human stewardship for capture and archival, full audit logging, role-based permissions, and institutional knowledge that compounds over time",
    ],
    [
      "completed improvements increase, value generated grows, participation rates rise, recurring inefficiencies decrease, automation utilization increases, and improvement maturity progresses with detect before optimizing",
      "repeated mistakes decrease, knowledge reuse increases, onboarding efficiency improves, problem resolution accelerates, documentation coverage grows, and memory health scores improve with capture before forgetting",
    ],
    ["Starts the era.", "Continues the era."],
    ["starts the era", "continues the era"],
    ["Continuous Optimization Era starts", "Continuous Optimization Era continues"],
    ["__OM_CENTER__", P.centerTitle],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._aeomebp260_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 260 — Organizational Memory Center. Memory Companion supports enterprise organizational memory — NOT exposing restricted memory beyond RBAC, bypassing memory governance, or omitting memory audit history. Helpers _aeomebp260_*.'; $$;
create or replace function public._aeomebp260_mission() returns text language sql immutable as $$ select 'Preserve critical organizational knowledge, decisions, experiences, and lessons learned so companies become smarter over time — Memory Companion captures and surfaces, humans steward and decide.'; $$;
create or replace function public._aeomebp260_philosophy() returns text language sql immutable as $$ select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; $$;
create or replace function public._aeomebp260_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Organizational Memory Center within Continuous Optimization Era (259–263). Human stewardship for capture and archival; memory-governed lifecycle; full audit logging; Memory Companion informs and prepares. Continues the era.'; $$;
create or replace function public._aeomebp260_vision() returns text language sql immutable as $$ select 'Organizations reduce repeated mistakes, increase knowledge reuse, improve onboarding efficiency, accelerate problem resolution, grow documentation coverage, and strengthen memory health scores with capture before forgetting.'; $$;
create or replace function public._aeomebp260_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Organizational Memory Center programs', 'emoji', '✅', 'description', 'Ten organizational memory modules'),
    jsonb_build_object('key', 'memory_capture_hub', 'label', 'Memory capture engine', 'emoji', '📋', 'description', 'Automatic and manual knowledge capture'),
    jsonb_build_object('key', 'memory_records_engine', 'label', 'Memory records', 'emoji', '🏆', 'description', 'Structured searchable memory entries'),
    jsonb_build_object('key', 'lessons_learned_engine', 'label', 'Lessons learned framework', 'emoji', '🔗', 'description', 'Situation, root causes, outcomes, recommendations'),
    jsonb_build_object('key', 'companion', 'label', 'Memory Companion', 'emoji', '✨', 'description', 'Supports — does not replace human memory stewardship'),
    jsonb_build_object('key', 'contextual_memory_engine', 'label', 'Contextual memory recommendations', 'emoji', '📊', 'description', 'Right knowledge at the right time'),
    jsonb_build_object('key', 'memory_controls_dashboard', 'label', 'Memory governance dashboard', 'emoji', '🛡️', 'description', 'Ownership, retention, and access policies'),
    jsonb_build_object('key', 'smart_memory_search_engine', 'label', 'Smart memory search', 'emoji', '🔔', 'description', 'Keyword, natural language, and filter search')
  ); $$;
create or replace function public._aeomebp260_memory_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Organizational Memory Center — ten capabilities. Capture before forgetting.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'memory_dashboard', 'label', 'Executive Memory Dashboard'),
    jsonb_build_object('key', 'memory_capture', 'label', 'Memory Capture Engine'),
    jsonb_build_object('key', 'memory_records', 'label', 'Memory Records'),
    jsonb_build_object('key', 'lessons_learned', 'label', 'Lessons Learned Framework'),
    jsonb_build_object('key', 'smart_search', 'label', 'Smart Memory Search'),
    jsonb_build_object('key', 'contextual_recommendations', 'label', 'Contextual Memory Recommendations'),
    jsonb_build_object('key', 'expertise_discovery', 'label', 'Expertise Discovery'),
    jsonb_build_object('key', 'knowledge_decay', 'label', 'Knowledge Decay Management'),
    jsonb_build_object('key', 'memory_governance', 'label', 'Memory Governance'),
    jsonb_build_object('key', 'memory_health_score', 'label', 'Organizational Memory Health Score')
  )); $$;
create or replace function public._aeomebp260_memory_capture_hub() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Memory capture — collect valuable organizational knowledge.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'capture_sources', 'label', 'Are approved decisions and completed projects being captured?'),
    jsonb_build_object('key', 'memory_types', 'label', 'Are operational, strategic, and technical memories categorized?'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Is every memory change fully audited?'),
    jsonb_build_object('key', 'importance_levels', 'label', 'Are importance levels assigned appropriately?'),
    jsonb_build_object('key', 'human_stewardship', 'label', 'How does capture support human stewardship before archival?')
  )); $$;
create or replace function public._aeomebp260_memory_records_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Memory records — structured searchable entries.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'operational', 'label', 'Operational memory'),
    jsonb_build_object('key', 'strategic', 'label', 'Strategic memory'),
    jsonb_build_object('key', 'technical', 'label', 'Technical memory'),
    jsonb_build_object('key', 'customer', 'label', 'Customer memory'),
    jsonb_build_object('key', 'compliance', 'label', 'Compliance memory'),
    jsonb_build_object('key', 'cultural', 'label', 'Cultural memory'),
    jsonb_build_object('key', 'informational', 'label', 'Informational importance'),
    jsonb_build_object('key', 'important', 'label', 'Important importance'),
    jsonb_build_object('key', 'critical', 'label', 'Critical importance'),
    jsonb_build_object('key', 'institutional', 'label', 'Institutional importance')
  )); $$;
create or replace function public._aeomebp260_expertise_discovery_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Expertise discovery — identify internal knowledge holders.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'subject_areas', 'label', 'Subject matter areas'),
    jsonb_build_object('key', 'experience_history', 'label', 'Experience history'),
    jsonb_build_object('key', 'contributions', 'label', 'Relevant contributions'),
    jsonb_build_object('key', 'initiatives', 'label', 'Participation in initiatives'),
    jsonb_build_object('key', 'privacy', 'label', 'Organizational visibility settings respected'),
    jsonb_build_object('key', 'knowledge_holders', 'label', 'Internal knowledge holder discovery')
  )); $$;
create or replace function public._aeomebp260_memory_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Memory Companion — supports memory capture and never exposes restricted memory beyond RBAC or bypasses memory governance.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'capture_suggestions', 'label', 'Suggest memory capture from approved sources'),
    jsonb_build_object('key', 'contextual_surface', 'label', 'Surface relevant historical context'),
    jsonb_build_object('key', 'decay_alerts', 'label', 'Alert when memories need review'),
    jsonb_build_object('key', 'expertise_routing', 'label', 'Suggest knowledge holders'),
    jsonb_build_object('key', 'recommendation_labels', 'label', 'Previously Successful, Use With Caution, Review Required'),
    jsonb_build_object('key', 'memory_guardrails', 'label', 'Memory governance — Trust Architecture enforced')
  )); $$;
create or replace function public._aeomebp260_lessons_learned_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Lessons learned — prevent repeated mistakes.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'situation', 'label', 'Situation'),
    jsonb_build_object('key', 'what_happened', 'label', 'What happened'),
    jsonb_build_object('key', 'root_causes', 'label', 'Root causes'),
    jsonb_build_object('key', 'actions_taken', 'label', 'Actions taken'),
    jsonb_build_object('key', 'outcomes', 'label', 'Outcomes achieved'),
    jsonb_build_object('key', 'recommendations', 'label', 'Recommendations for the future')
  )); $$;
create or replace function public._aeomebp260_smart_memory_search_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Smart memory search — surface relevant historical context.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'keyword', 'label', 'Keyword search'),
    jsonb_build_object('key', 'natural_language', 'label', 'Natural language queries'),
    jsonb_build_object('key', 'category_filters', 'label', 'Category filters'),
    jsonb_build_object('key', 'department_filters', 'label', 'Department filters'),
    jsonb_build_object('key', 'similar_cases', 'label', 'Similar cases'),
    jsonb_build_object('key', 'proven_approaches', 'label', 'Proven approaches')
  )); $$;
create or replace function public._aeomebp260_contextual_memory_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Contextual recommendations — right knowledge at the right time.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'support_cases', 'label', 'Similar support cases'),
    jsonb_build_object('key', 'projects', 'label', 'Comparable projects'),
    jsonb_build_object('key', 'governance_decisions', 'label', 'Related governance decisions'),
    jsonb_build_object('key', 'improvements', 'label', 'Matching improvement initiatives'),
    jsonb_build_object('key', 'previously_successful', 'label', 'Previously Successful label'),
    jsonb_build_object('key', 'use_with_caution', 'label', 'Use With Caution label'),
    jsonb_build_object('key', 'review_required', 'label', 'Review Required label')
  )); $$;
create or replace function public._aeomebp260_memory_controls_dashboard() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Memory governance — ownership and lifecycle management.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'memory_owners', 'label', 'Assign memory owners'),
    jsonb_build_object('key', 'retention_policies', 'label', 'Define retention policies'),
    jsonb_build_object('key', 'role_access', 'label', 'Restrict access by role'),
    jsonb_build_object('key', 'archive_outdated', 'label', 'Archive outdated content'),
    jsonb_build_object('key', 'review_schedules', 'label', 'Track review schedules'),
    jsonb_build_object('key', 'decay_states', 'label', 'Current, Needs Review, Archived, Deprecated')
  )); $$;
create or replace function public._aeomebp260_memory_integration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Memory integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'continuous_improvement', 'label', 'Continuous Improvement Phase 259', 'cross_link', '/app/aipify-enterprise-continuous-improvement-engine'),
    jsonb_build_object('key', 'decision_escalation', 'label', 'Decision Escalation Phase 258', 'cross_link', '/app/aipify-enterprise-decision-escalation-governance-engine'),
    jsonb_build_object('key', 'employee_knowledge', 'label', 'Employee Knowledge Engine', 'cross_link', '/app/settings/employee-knowledge'),
    jsonb_build_object('key', 'business_dna', 'label', 'Business DNA Engine', 'cross_link', '/app/settings/business-dna'),
    jsonb_build_object('key', 'enterprise_search', 'label', 'Enterprise Search Engine Phase 234', 'cross_link', '/app/aipify-enterprise-search-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-cockpit-engine'),
    jsonb_build_object('key', 'enterprise_analytics', 'label', 'Enterprise Analytics Engine Phase 235', 'cross_link', '/app/aipify-enterprise-analytics-operational-intelligence-engine'),
    jsonb_build_object('key', 'memory_stewardship_gates', 'label', 'Human stewardship gates for memory capture and archival')
  )); $$;
create or replace function public._aeomebp260_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Exposing restricted memory beyond RBAC',
      'Bypassing memory governance',
      'Hiding memory provenance',
      'Replacing memory owner judgment',
      'Modifying memory audit trails',
      'Unlogged memory changes',
      'Ignoring knowledge decay reviews',
      'Override human judgment'), 'principle', 'Memory Companion supports — users retain memory stewardship control and memory history stays auditable.'); $$;
create or replace function public._aeomebp260_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — calm memory support without pressure.', 'values', jsonb_build_array('capture_before_forgetting','human_stewardship_before_archival','review_before_deprecating','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._aeomebp260_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Organizational memory audit logs via aipify_enterprise_organizational_memory_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_organizational_memory permissions — memory governance RBAC'),
    jsonb_build_object('key', 'stewardship_gates', 'label', 'Human stewardship for capture and archival'),
    jsonb_build_object('key', 'memory_policies', 'label', 'Organization-defined retention and access policies'),
    jsonb_build_object('key', 'knowledge_retention', 'label', 'Lessons learned and outcomes logged — metadata only'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._aeomebp260_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 259, 'key', 'enterprise_continuous_improvement', 'label', 'Continuous Improvement Phase 259', 'route', '/app/aipify-enterprise-continuous-improvement-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 260, 'key', 'enterprise_organizational_memory', 'label', 'Organizational Memory Phase 260', 'route', '/app/aipify-enterprise-organizational-memory-engine', 'description', 'Institutional knowledge preservation — continues era')
  ); $$;
create or replace function public._aeomebp260_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'continuous_improvement', 'label', 'Continuous Improvement Phase 259', 'route', '/app/aipify-enterprise-continuous-improvement-engine', 'relationship', 'Improvement integration — cross-link only'),
    jsonb_build_object('key', 'employee_knowledge', 'label', 'Employee Knowledge Engine', 'route', '/app/settings/employee-knowledge', 'relationship', 'Knowledge integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Human stewardship before archival — cross-link only')
  ); $$;
create or replace function public._aeomebp260_integration_links() returns jsonb language sql stable as $$ select public._aeomebp260_era_opener_summary() || public._aeomebp260_extended_cross_links(); $$;
create or replace function public._aeomebp260_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Organizational Memory Center internally with memory-governed capture and full audit logging. Growth Partner terminology. Memory Companion supports — never exposes restricted memory beyond RBAC or bypasses memory governance.'; $$;
create or replace function public._aeomebp260_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — users retain memory stewardship control.', 'Memory Companion informs and prepares.', 'Capture before forgetting — human stewardship before archival.', 'Growth Partner — never Affiliate.', 'Continuous Optimization Era continues — 259–263.'); $$;
create or replace function public._aeomebp260_privacy_note() returns text language sql immutable as $$
  select 'Organizational Memory Center metadata only — memory summaries max ~500 chars. No raw operational records beyond RBAC or PII in audit logs.'; $$;
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_enterprise_continuous_improvement_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._aeciebp259_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_memory_capture_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Memory capture — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_memory_capture_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_improvement_opportunity_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Memory capture — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_memory_capture_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_decision_registry_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Memory capture — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_memory_capture_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_action_queue_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Memory capture — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_memory_capture_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_trend_monitoring_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Memory capture — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_memory_capture_hub()->'reflection_questions') = 5,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_memory_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Organizational Memory Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_memory_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_improvement_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Organizational Memory Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_memory_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_decision_governance_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Organizational Memory Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_memory_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_orchestration_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Organizational Memory Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_memory_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_intelligence_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Organizational Memory Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_memory_dashboard()->'capabilities') = 10,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  const replaceRpcRef = (sqlText, fn) => {
    if (fn === "memory_dashboard") {
      return sqlText.replace(/public\._(\w+)_memory_dashboard\(\)/g, (full, prefix) =>
        prefix.endsWith("memory") ? full : `public._${P.bp}_memory_dashboard()`,
      );
    }
    return sqlText.replace(
      new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"),
      `public._${P.bp}_${fn}()`,
    );
  };

  for (const fn of [...SCAFFOLDS, "memory_companion"].sort((a, b) => b.length - a.length)) {
    sql = replaceRpcRef(sql, fn);
  }

  sql = sql.replace(
    new RegExp(`select '${P.slug}'[^;]+;`, "g"),
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    /select 'aipify-enterprise-continuous-improvement-engine'[^;]+;/g,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected enterprise continuous improvement guidance within Continuous Optimization Era;",
    "RBAC-protected enterprise organizational memory guidance within Continuous Optimization Era;",
  );
  sql = sql.replaceAll(
    "RBAC-protected enterprise decision escalation and governance guidance within Knowledge Quality Era;",
    "RBAC-protected enterprise organizational memory guidance within Continuous Optimization Era;",
  );
  sql = sql.replace(
    /Phase 260 Enterprise Organizational Memory Engine —/,
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
    `'memory_controls_dashboard', public._${P.bp}_memory_controls_dashboard()`,
  );
  sql = sql.replace(
    /'improvement_improvement_dashboard', public\._\w+_improvement_improvement_dashboard\(\)/,
    `'memory_controls_dashboard', public._${P.bp}_memory_controls_dashboard()`,
  );
  sql = sql.replace(
    /'decision_decision_governance_dashboard', public\._\w+_decision_decision_governance_dashboard\(\)/,
    `'memory_controls_dashboard', public._${P.bp}_memory_controls_dashboard()`,
  );
  sql = sql.replace(
    /'orchestration_orchestration_dashboard', public\._\w+_orchestration_orchestration_dashboard\(\)/,
    `'memory_controls_dashboard', public._${P.bp}_memory_controls_dashboard()`,
  );
  sql = sql.replace(
    /'governance_rules_dashboard', public\._\w+_governance_rules_dashboard\(\)/,
    `'memory_controls_dashboard', public._${P.bp}_memory_controls_dashboard()`,
  );
  sql = sql.replace(
    /'improvement_controls_dashboard', public\._\w+_improvement_controls_dashboard\(\)/,
    `'memory_controls_dashboard', public._${P.bp}_memory_controls_dashboard()`,
  );
  sql = sql.replace(
    /'policy_controls_dashboard', public\._\w+_policy_controls_dashboard\(\)/,
    `'memory_controls_dashboard', public._${P.bp}_memory_controls_dashboard()`,
  );
  sql = sql.replace(
    /'intelligence_controls_dashboard', public\._\w+_intelligence_controls_dashboard\(\)/,
    `'memory_controls_dashboard', public._${P.bp}_memory_controls_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_memory_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_memory_controls_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_improvement_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_memory_controls_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_decision_governance_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_memory_controls_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_orchestration_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_memory_controls_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_intelligence_controls_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_memory_controls_dashboard()`,
  );

  return sql;
}

function genMigration() {
  const src259 = path.join(
    ROOT,
    "supabase/migrations/20261418600000_aipify_enterprise_continuous_improvement_engine_phase259.sql",
  );
  if (!fs.existsSync(src259)) throw new Error("Phase 259 migration required");
  let m = transformFrom259(fs.readFileSync(src259, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-enterprise-continuous-improvement-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(
    path.join(ROOT, `lib/core/${P.slug}.ts`),
    transformFrom259(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")),
  );
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(
      path.join(dst, f),
      transformFrom259(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")),
    );
  }
  const panel = path.join(
    ROOT,
    `components/app/${srcSlug}/AipifyEnterpriseContinuousImprovementEngineDashboardPanel.tsx`,
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`),
    transformFrom259(fs.readFileSync(panel, "utf8")),
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/index.ts`),
    `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`,
  );
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom259(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom259(
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

${P.centerTitle} within ${P.era}. **Continues the era.** ${P.companion} supports memory capture, memory records, lessons learned framework, smart memory search, contextual memory recommendations, expertise discovery, knowledge decay management, memory governance, organizational memory health score, and executive memory dashboard — does NOT expose restricted memory beyond RBAC, bypass memory governance, or omit memory audit history.

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

## What is the Enterprise Organizational Memory Engine?

The Enterprise Organizational Memory Engine helps organizations preserve critical knowledge, decisions, experiences, and lessons learned at \`/app/${P.slug}\`.

## What organizational memory features are included?

Memory capture engine, memory records, lessons learned framework, smart memory search, contextual memory recommendations, expertise discovery, knowledge decay management, memory governance, organizational memory health score, and executive memory dashboard.

## What memory types are supported?

Operational, strategic, technical, customer, compliance, and cultural — with importance levels informational, important, critical, and institutional.

## What review states apply for knowledge decay?

Current, needs review, archived, and deprecated — triggered by time-based reviews, policy changes, process updates, or manual requests.

## What does the organizational memory flow look like?

Knowledge generated → memory capture initiated → information structured → ownership assigned → memory indexed → recommendations enabled → periodic reviews performed → institutional knowledge strengthened.

## Who can access organizational memory?

Super Admin (full access), Tenant Admin (memory policies), Executives (oversight dashboard), Memory owners (lifecycle stewardship), Staff (submissions within visibility rules) — enterprise RBAC.

## Is full audit logging enforced?

**Yes.** Every memory lifecycle event is logged. Capture provenance and review history are recorded.

## How does this integrate with other Aipify surfaces?

${P.crossLinkNote}

## Does the Memory Companion replace human judgment?

**No.** ${P.companion} captures and surfaces — it does **NOT** expose restricted memory beyond RBAC, bypass memory governance, or omit memory audit history.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Memory: capture engine, records, lessons learned, smart search, contextual recommendations, expertise discovery, knowledge decay, governance, health score, executive dashboard.
Types: operational, strategic, technical, customer, compliance, cultural.
Importance: informational, important, critical, institutional.
Review states: current, needs review, archived, deprecated.
Recommendation labels: Previously Successful, Use With Caution, Review Required.
Score levels: limited, developing, established, strong, exceptional.
Flow: generate → capture → structure → assign → index → recommend → review → strengthen.
Security: memory governance RBAC, stewardship gates, audit logging, retention policies, enterprise permissions, 2FA.
Design principles: Capture before forgetting, human stewardship before archival, review before deprecating.
Companion limitations: no exposing restricted memory, no bypassing governance, no hiding provenance.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate. Era continues 259–263.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never exposes restricted memory beyond RBAC, bypasses memory governance, or omits memory audit history.";
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
      '| "aipifyEnterpriseContinuousImprovementEngine"',
      `| "aipifyEnterpriseContinuousImprovementEngine"\n  | "${id}"`,
    );
  }
  if (!c.includes(href)) {
    const anchor =
      /id: "aipifyEnterpriseContinuousImprovementEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyEnterpriseContinuousImprovementEngine",\n  },/;
    c = c.replace(
      anchor,
      (m) =>
        `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-enterprise-continuous-improvement-engine")) {\n    return "aipifyEnterpriseContinuousImprovementEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-enterprise-continuous-improvement-engine")) {\n    return "aipifyEnterpriseContinuousImprovementEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace(
        '"aipify_enterprise_continuous_improvement.steward",',
        `"aipify_enterprise_continuous_improvement.steward",\n    "${perm}",`,
      );
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-enterprise-continuous-improvement-engine";',
      `export * from "./aipify-enterprise-continuous-improvement-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era} continues. ${P.companion} supports memory capture, memory records, lessons learned framework, smart memory search, contextual memory recommendations, expertise discovery, knowledge decay management, and memory governance. Capture before forgetting — does NOT expose restricted memory beyond RBAC or bypass memory governance. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Organizational memory health score",
    modeLabel: "Mode",
    readinessLabel: "Memory maturity level",
    executiveReviews: "Executive memory dashboard",
    activeReflections: "Active organizational memory scaffolds",
    humanOversightRequired: `Human stewardship required — users retain memory judgment control; ${P.companion} supports only`,
    eraOpenerSummary: `Continuous Optimization Era — Phases ${P.eraRange} (continues)`,
    eraOpenerNote:
      "Cross-link only — do not duplicate Continuous Improvement Engine, Decision Escalation Engine, Employee Knowledge Engine, Business DNA Engine, Enterprise Search, Executive Cockpit, or Enterprise Analytics RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Memory capture — capture prompts",
    frameworkLabel: "Memory records engine",
    reviewsLabel: "Memory governance dashboard",
    companionLabel: `${P.companion} — supports memory preparation, never replaces human memory stewardship`,
    subEngineLabel: "Lessons learned framework",
    reflections: "Organizational memory scaffolds",
    executiveReviewEntries: "Memory record entries",
    scaffoldNotes: "Memory-governed institutional scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT expose restricted memory beyond RBAC, bypass memory governance, or omit memory audit history`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports enterprise organizational memory — users retain memory stewardship control and memory history stays auditable.`,
      philosophy:
        "People First. Memory-governed lifecycle. Growth Partner terminology — never Affiliate.",
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
        ? "Organisasjonsminne"
        : locale === "sv"
          ? "Organisationsminne"
          : locale === "da"
            ? "Organisationshukommelse"
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
      'export * from "./implementation-blueprint-phase259-vocabulary";',
      `export * from "./implementation-blueprint-phase259-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE259_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase259-aipify-enterprise-continuous-improvement.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE259_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase259-aipify-enterprise-continuous-improvement.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_enterprise_continuous_improvement.view`, `aipify_enterprise_continuous_improvement.manage`, `aipify_enterprise_continuous_improvement.steward`.";
  const entry = `\n**Enterprise Organizational Memory Engine (Phase 260):** See [AIPIFY_ENTERPRISE_ORGANIZATIONAL_MEMORY_ENGINE_PHASE260.md](./AIPIFY_ENTERPRISE_ORGANIZATIONAL_MEMORY_ENGINE_PHASE260.md) — Memory capture engine, memory records, lessons learned framework, smart memory search, contextual memory recommendations, expertise discovery, knowledge decay management, memory governance, organizational memory health score, and executive memory dashboard. **Continues** Continuous Optimization Era (259–263). \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** exposing restricted memory beyond RBAC, bypassing memory governance, or omitting memory audit history. Cross-links only: Continuous Improvement Engine Phase 259, Decision Escalation & Governance Engine Phase 258, Employee Knowledge Engine, Business DNA Engine, Enterprise Search Engine Phase 234, Executive Cockpit Phase 200, Enterprise Analytics Engine Phase 235, Aipify Translate Phase 238. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 260")) {
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
  console.error(`Phase ${P.phase} docs generated; stack requires Phase 259 artifacts: ${err.message}`);
  process.exitCode = 1;
}
