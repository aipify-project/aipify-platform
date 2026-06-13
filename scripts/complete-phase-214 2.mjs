#!/usr/bin/env node
/** ABOS Phase 214 — Aipify Customer Journey & Experience Orchestration Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const P = {
  phase: 214,
  migration: "20261374000000_aipify_customer_journey_experience_orchestration_engine_phase214.sql",
  slug: "aipify-customer-journey-experience-orchestration-engine",
  base: "AipifyCustomerJourneyExperienceOrchestration",
  camel: "aipifyCustomerJourneyExperienceOrchestrationEngine",
  snake: "aipify_customer_journey_experience_orchestration",
  permPrefix: "aipify_customer_journey_experience_orchestration",
  helper: "acjeoe",
  bp: "acjeoebp214",
  decisionType: "aipify_customer_journey_experience_orchestration_engine",
  prevDecision: "aipify_customer_success_value_realization_engine",
  title: "Aipify Customer Journey & Experience Orchestration",
  centerTitle: "Customer Journey Center",
  companion: "Journey Companion",
  scoreKey: "aipify_customer_journey_experience_orchestration_score",
  modeKey: "customer_journey_mode",
  levelKey: "journey_maturity_level",
  thirdEntity: "journey_notes",
  era: "Innovation & Adaptive Excellence Era (211–220)",
  eraRange: "211–220",
  docSlug: "AIPIFY_CUSTOMER_JOURNEY_EXPERIENCE_ORCHESTRATION_ENGINE",
  ilmFile: "implementation-blueprint-phase214-aipify-customer-journey-experience-orchestration.txt",
  navLabel: "Customer Journey",
  crossLinkNote:
    "Cross-links only: Phase 213 customer success center, Phase 205 action center — never expose sensitive customer PII, auto-modify journeys, or bypass human experience stewardship.",
  ilmExtra: `
Customer Journey Center: customer journey dashboard, experience friction monitor, journey optimization center, customer milestone framework, engagement opportunity engine, executive experience dashboard, customer success/action center integration (cross-links), journey knowledge libraries.
Experience Friction Monitor prompts: friction signals, journey stage gaps, empathy checkpoints, clarity barriers, relationship touchpoint health.
Journey Optimization Center: lifecycle stage mapping, optimization suggestions, human approval gates, metadata-only scaffolds, advisory only.
Customer Milestone Framework: milestone tracking, engagement checkpoints, relationships before transactions.
Engagement Opportunity Engine: engagement signals, opportunity scaffolds — humans decide.
Design principles: empathy before efficiency, relationships before transactions, clarity before complexity.
Companion limitations: no exposing sensitive customer PII, no auto-modifying journeys without approval, no replacing human experience stewardship, no efficiency over empathy, no bypassing RBAC audit.`,
  faqBody: `## What is Customer Journey & Experience Orchestration Engine?

Customer Journey & Experience Orchestration helps organizations understand, optimize, and continuously improve the end-to-end customer experience across every lifecycle stage — at \`/app/aipify-customer-journey-experience-orchestration-engine\`.

## Does the Journey Companion modify journeys automatically?

**No.** The Journey Companion surfaces journey insights, friction signals, and optimization suggestions — it does NOT auto-modify journeys without approval or expose sensitive customer PII.

## What does the Customer Journey Center show?

Journey stage visibility, experience friction monitors, optimization scaffolds, milestone frameworks, engagement opportunities, and executive experience summaries — metadata only.

## How does this relate to Customer Success and Action Center?

Cross-link only: Phase 213 customer success (\`/app/aipify-customer-success-value-realization-engine\`) and Phase 205 action center (\`/app/aipify-action-center-execution-engine\`). Never duplicate their RPCs.

## Why human experience stewardship?

Humans retain customer experience authority. Aipify advises and suggests — it does not auto-modify journeys or replace relationship stewardship.`,
  companionLimitations: [
    "exposing_sensitive_customer_pii",
    "auto_modifying_journeys_without_approval",
    "replacing_human_experience_stewardship",
    "efficiency_over_empathy",
    "bypassing_rbac_audit",
    "replace_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom210(content) {
  const thirdPascal = P.thirdEntity.split("_").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
  const pairs = [
    ["AipifyOrganizationalRhythmsOperatingCadence", P.base],
    ["aipify-organizational-rhythms-operating-cadence-engine", P.slug],
    ["aipify_organizational_rhythms_operating_cadence", P.snake],
    ["aipifyOrganizationalRhythmsOperatingCadence", P.camel.replace(/Engine$/, "")],
    ["aipifyOrganizationalRhythmsOperatingCadenceEngine", P.camel],
    ["aorocebp210", P.bp],
    ["_aoroce_", `_${P.helper}_`],
    ["aipify_organizational_rhythms_operating_cadence_score", P.scoreKey],
    ["operating_cadence_mode", P.modeKey],
    ["cadence_discipline_level", P.levelKey],
    ["cadence_notes", P.thirdEntity],
    ["CadenceNote", thirdPascal],
    ["cadence_notes_count", `${P.thirdEntity}_count`],
    ["Operating Cadence Center", P.centerTitle],
    ["Cadence Companion", P.companion],
    ["Aipify Organizational Rhythms & Operating Cadence", P.title],
    ["Operating Cadence", P.navLabel],
    ["Phase 210", `Phase ${P.phase}`],
    ["aipify_organizational_rhythms_operating_cadence.view", `${P.permPrefix}.view`],
    ["aipify_organizational_rhythms_operating_cadence.manage", `${P.permPrefix}.manage`],
    ["aipify_organizational_rhythms_operating_cadence.steward", `${P.permPrefix}.steward`],
    ["20261370000000_aipify_organizational_rhythms_operating_cadence_engine_phase210.sql", P.migration],
    ["Repo Phase 210", `Repo Phase ${P.phase}`],
    ["Phase 210 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE210_AIPIFY_ORGANIZATIONAL_RHYTHMS_OPERATING_CADENCE_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase210", `implementation-blueprint-phase${P.phase}`],
    ["organizational_rhythm_dashboard", "customer_journey_dashboard"],
    ["cadence_reflection_engine", "experience_friction_monitor"],
    ["cadence_framework", "journey_optimization_center"],
    ["executive_cadence_reviews", "executive_experience_dashboard"],
    ["cadence_companion", "journey_companion"],
    ["leadership_cadence_center", "customer_milestone_framework"],
    ["team_rhythm_framework", "engagement_opportunity_engine"],
    ["strategic_review_scheduler", "journey_optimization_scheduler"],
    ["follow_up_integrity_monitor", "friction_integrity_monitor"],
    ["organizational_pulse_calendar", "customer_success_action_center_integration"],
    ["action_decision_executive_cockpit_integration", "customer_success_action_center_integration"],
    ["cadence_knowledge_libraries", "journey_knowledge_libraries"],
    ["leadership_cadence_center_meta", "customer_milestone_framework_meta"],
    ["team_rhythm_framework_meta", "engagement_opportunity_engine_meta"],
    ["organizational_pulse_calendar_meta", "customer_success_action_center_integration_meta"],
    ["Executive Cadence Reviews", "Executive Experience Dashboard"],
    ["organizational rhythms operating cadence within", "customer journey experience orchestration within"],
    ["_seed_cadence_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["auto-schedule meetings without approval", "auto-modify journeys without approval"],
    ["override leadership cadence without approval", "bypass human experience stewardship without approval"],
    ["Cadence Companion supports", "Journey Companion supports"],
    ["never auto-schedules meetings or overrides leadership cadence", "never auto-modifies journeys or exposes sensitive customer PII"],
    ["supports — does not auto-schedule meetings or override leadership cadence", "supports — does not auto-modify journeys or expose sensitive customer PII"],
    [
      "supports rhythm visibility, does not auto-schedule meetings or override leadership cadence choices",
      "supports journey visibility, does not auto-modify journeys or bypass human experience stewardship",
    ],
    ["operating cadence tracking", "customer journey tracking"],
    ["Human-stewarded operating cadence", "Human-stewarded customer journey"],
    ["reflection_required", "stewardship_required"],
    ["Cadence score", "Journey score"],
    ["Cadence discipline level", "Journey maturity level"],
    ["Cadence reflection engine", "Experience friction monitor"],
    ["Cadence framework", "Journey optimization center"],
    ["Executive cadence reviews", "Executive experience dashboard"],
    ["Leadership Cadence Center", "Customer Milestone Framework"],
    ["Team Rhythm Framework", "Engagement Opportunity Engine"],
    ["Organizational Pulse Calendar", "Customer Success Action Center Integration"],
    ["Cadence reflection scaffolds", "Experience friction scaffolds"],
    ["Cadence review entries", "Executive experience entries"],
    ["humans steward leadership cadence and reflection", "humans steward customer journey and experience"],
    ["operating rhythms, strategic reviews, and follow-up integrity", "journey stages, friction signals, and optimization suggestions"],
    ["does NOT auto-schedule meetings or override leadership cadence", "does NOT auto-modify journeys or expose sensitive customer PII"],
    ["never auto-schedules meetings without approval", "never auto-modifies journeys without approval"],
    ["auto_scheduling_without_approval", "auto_modifying_journeys_without_approval"],
    ["overriding_leadership_cadence_choices", "replacing_human_experience_stewardship"],
    ["punitive_missed_review_enforcement", "efficiency_over_empathy"],
    ["exposing_sensitive_executive_schedules", "exposing_sensitive_customer_pii"],
    ["replacing_human_reflection", "bypassing_rbac_audit"],
    ["AIPIFY_ORGANIZATIONAL_RHYTHMS_OPERATING_CADENCE_ENGINE", P.docSlug],
    ["organizational_discipline", "friction_signals"],
    ["execution_consistency", "journey_stage_gaps"],
    ["sustainable_leadership", "empathy_checkpoints"],
    ["strategic_alignment", "clarity_barriers"],
    ["proactive_vs_reactive_management", "relationship_touchpoint_health"],
    ["daily_weekly_monthly_quarterly_annual_cycles", "lifecycle_stage_mapping"],
    ["leadership_cadence", "optimization_suggestions"],
    ["team_rhythms", "human_approval_gates"],
    ["strategic_reviews", "metadata_only_scaffolds"],
    ["follow_up_integrity", "advisory_only"],
    ["pulse_calendar", "milestone_tracking"],
    ["upcoming_cadences", "active_journey_programs"],
    ["missed_reviews", "friction_opportunities"],
    ["strategic_review_readiness", "journey_optimization_progress"],
    ["leadership_commitment_tracking", "engagement_checkpoints"],
    ["rhythm_summaries", "journey_summaries"],
    ["follow_up_insights", "friction_insights"],
    ["cadence_prompts", "journey_prompts"],
    ["cadence_insights", "experience_insights"],
    ["schedule_protection_reminders", "empathy_stewardship_reminders"],
    ["consistency_before_urgency", "empathy_before_efficiency"],
    ["discipline_before_chaos", "relationships_before_transactions"],
    ["stewardship_before_short_term_reactions", "clarity_before_complexity"],
    ["aipify_organizational_rhythms_operating_cadence_audit_logs", "aipify_customer_journey_experience_orchestration_audit_logs"],
    ["aipify_organizational_rhythms_operating_cadence permissions", "aipify_customer_journey_experience_orchestration permissions"],
    ["Metadata-only cadence scaffolds", "Metadata-only journey scaffolds"],
    ["Executive schedule protection", "Customer PII protection"],
    ["organizational rhythms operating cadence visibility", "customer journey experience orchestration visibility"],
    ["human reflection gates", "human experience stewardship gates"],
    ["consistent cadence without pressure", "empathetic journey guidance without pressure"],
    ["rhythm summaries and follow-up insights", "journey summaries and friction insights"],
    ["auto-schedule meetings", "auto-modify journeys"],
    ["override leadership cadence", "bypass human experience stewardship"],
    ["Era Capstone", "Customer Journey Era"],
    ["ERA CAPSTONE", "CUSTOMER JOURNEY ERA"],
    ["era capstone", "customer journey era"],
    ["Global Command & Enterprise Operations Era (201–210)", P.era],
    ["201–210", P.eraRange],
    ["210", "214"],
    ["decision center", "action center"],
    ["Decision Center Phase 207", "Action Center Phase 205"],
    ["/app/aipify-decision-center-governance-engine", "/app/aipify-action-center-execution-engine"],
    ["/app/aipify-executive-operating-system-founders-cockpit-engine", "/app/aipify-customer-success-value-realization-engine"],
    ["Executive Cockpit Phase 200", "Customer Success Phase 213"],
    ["executive_cockpit", "customer_success_center"],
    ["Executive Cockpit & Action Center", "Customer Success & Action Center"],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function genCore() {
  const engine = `${P.base}Engine`;
  write(
    path.join(ROOT, `lib/core/${P.slug}.ts`),
    `/**
 * ${P.title} Engine helpers (Phase ${P.phase}).
 * Authoritative enforcement lives in Supabase RPCs (_${P.helper}_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function get${engine}Dashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_${P.snake}_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function get${engine}Card(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_${P.snake}_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function create${engine}AuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
`,
  );
}

function genTsStack() {
  const engine = `${P.base}Engine`;
  const src = path.join(ROOT, "lib/aipify/aipify-organizational-rhythms-operating-cadence-engine");
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom210(fs.readFileSync(path.join(src, f), "utf8")));
  }
  const panel = path.join(
    ROOT,
    "components/app/aipify-organizational-rhythms-operating-cadence-engine/AipifyOrganizationalRhythmsOperatingCadenceEngineDashboardPanel.tsx",
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/${engine}DashboardPanel.tsx`),
    transformFrom210(fs.readFileSync(panel, "utf8")),
  );
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${engine}DashboardPanel } from "./${engine}DashboardPanel";\n`);
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom210(
      fs.readFileSync(path.join(ROOT, "app/app/aipify-organizational-rhythms-operating-cadence-engine/page.tsx"), "utf8"),
    ),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom210(
        fs.readFileSync(path.join(ROOT, `app/api/aipify/aipify-organizational-rhythms-operating-cadence-engine/${route}/route.ts`), "utf8"),
      ),
    );
  }
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports journey visibility — NOT auto-modifying journeys or exposing sensitive customer PII. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Help organizations understand, optimize, and continuously improve the end-to-end customer experience across every lifecycle stage with human experience stewardship — Journey Companion prepares, humans steward relationships and journey decisions.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Empathy before efficiency. Relationships before transactions. Clarity before complexity.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Innovation Era (${P.eraRange}). Human-stewarded customer journey; metadata-only scaffolds; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where customer journeys are understood empathetically, friction is surfaced honestly, optimization is suggested responsibly, and humans retain experience stewardship authority.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'experience_friction_monitor', 'label', 'Experience friction monitor', 'emoji', '🔍', 'description', 'Friction signals and journey gaps'),
    jsonb_build_object('key', 'optimization_center', 'label', 'Journey optimization center', 'emoji', '📊', 'description', 'Lifecycle mapping and optimization'),
    jsonb_build_object('key', 'executive_dashboard', 'label', 'Executive experience dashboard', 'emoji', '📈', 'description', 'Leadership visibility scaffolds'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not auto-modify'),
    jsonb_build_object('key', 'milestone_framework', 'label', 'Customer milestone framework', 'emoji', '🎯', 'description', 'Milestone and engagement checkpoints'),
    jsonb_build_object('key', 'engagement_engine', 'label', 'Engagement opportunity engine', 'emoji', '🤝', 'description', 'Engagement signals — humans decide'),
    jsonb_build_object('key', 'journey_libraries', 'label', 'Journey knowledge libraries', 'emoji', '🌱', 'description', 'Approved journey resources')
  ); ${D};
create or replace function public._${bp}_customer_journey_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities. Empathy before efficiency.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'customer_journey_dashboard', 'label', 'Customer Journey Dashboard — lifecycle visibility, active programs, executive overview'),
    jsonb_build_object('key', 'experience_friction_monitor', 'label', 'Experience Friction Monitor — friction signals, journey gaps, empathy checkpoints'),
    jsonb_build_object('key', 'journey_optimization_center', 'label', 'Journey Optimization Center — lifecycle mapping, optimization suggestions, advisory only'),
    jsonb_build_object('key', 'customer_milestone_framework', 'label', 'Customer Milestone Framework — milestone tracking, engagement checkpoints'),
    jsonb_build_object('key', 'engagement_opportunity_engine', 'label', 'Engagement Opportunity Engine — engagement signals, opportunity scaffolds'),
    jsonb_build_object('key', 'executive_experience_dashboard', 'label', 'Executive Experience Dashboard — leadership visibility, experience summaries'),
    jsonb_build_object('key', 'customer_success_action_center_integration', 'label', 'Customer Success & Action Center integration — cross-links only'),
    jsonb_build_object('key', 'journey_knowledge_libraries', 'label', 'Journey knowledge libraries — approved customer journey resources')
  )); ${D};
create or replace function public._${bp}_experience_friction_monitor() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Experience friction prompts — humans steward customer experience.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'friction_signals', 'label', 'What friction signals need attention?'),
    jsonb_build_object('key', 'journey_stage_gaps', 'label', 'Where are journey stage gaps emerging?'),
    jsonb_build_object('key', 'empathy_checkpoints', 'label', 'Where do empathy checkpoints need reinforcement?'),
    jsonb_build_object('key', 'clarity_barriers', 'label', 'What clarity barriers affect customer experience?'),
    jsonb_build_object('key', 'relationship_touchpoint_health', 'label', 'How healthy are key relationship touchpoints?')
  )); ${D};
create or replace function public._${bp}_journey_optimization_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Journey optimization center — clarity before complexity.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'lifecycle_stage_mapping', 'label', 'Lifecycle stage mapping'),
    jsonb_build_object('key', 'optimization_suggestions', 'label', 'Optimization suggestions — advisory only'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates'),
    jsonb_build_object('key', 'metadata_only_scaffolds', 'label', 'Metadata-only scaffolds'),
    jsonb_build_object('key', 'milestone_tracking', 'label', 'Milestone tracking'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale'),
    jsonb_build_object('key', 'empathy_before_efficiency', 'label', 'Empathy before efficiency')
  )); ${D};
create or replace function public._${bp}_executive_experience_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive experience dashboard — relationships before transactions.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'active_journey_programs', 'label', 'Active journey programs'),
    jsonb_build_object('key', 'friction_opportunities', 'label', 'Friction improvement opportunities'),
    jsonb_build_object('key', 'journey_optimization_progress', 'label', 'Journey optimization progress'),
    jsonb_build_object('key', 'engagement_checkpoints', 'label', 'Engagement checkpoints'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds')
  )); ${D};
create or replace function public._${bp}_journey_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports journey visibility, does not auto-modify journeys or expose sensitive customer PII.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'journey_summaries', 'label', 'Journey summaries'),
    jsonb_build_object('key', 'friction_insights', 'label', 'Friction insights'),
    jsonb_build_object('key', 'experience_insights', 'label', 'Experience insights'),
    jsonb_build_object('key', 'journey_prompts', 'label', 'Journey prompts'),
    jsonb_build_object('key', 'optimization_suggestions', 'label', 'Optimization suggestions — advisory only'),
    jsonb_build_object('key', 'empathy_stewardship_reminders', 'label', 'Empathy stewardship reminders — RBAC enforced')
  )); ${D};
create or replace function public._${bp}_customer_milestone_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Customer Milestone Framework — milestone and engagement scaffolds.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'milestone_tracking', 'label', 'Milestone tracking scaffolds'),
    jsonb_build_object('key', 'engagement_checkpoints', 'label', 'Engagement checkpoints — humans decide'),
    jsonb_build_object('key', 'lifecycle_stages', 'label', 'Lifecycle stage milestones'),
    jsonb_build_object('key', 'ownership_assignment', 'label', 'Experience stewardship assignment scaffolds'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no sensitive PII'),
    jsonb_build_object('key', 'human_stewardship_gates', 'label', 'Human experience stewardship gates')
  )); ${D};
create or replace function public._${bp}_engagement_opportunity_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Engagement Opportunity Engine — engagement signals, humans decide.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'engagement_signals', 'label', 'Engagement signal detection'),
    jsonb_build_object('key', 'opportunity_scaffolds', 'label', 'Opportunity scaffolds — advisory only'),
    jsonb_build_object('key', 'relationship_touchpoints', 'label', 'Relationship touchpoint prompts'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Customer journey audit trails'),
    jsonb_build_object('key', 'no_auto_modify', 'label', 'Never auto-modify journeys without approval'),
    jsonb_build_object('key', 'action_center_cross_link', 'label', 'Action Center Phase 205 cross-link', 'cross_link', '/app/aipify-action-center-execution-engine')
  )); ${D};
create or replace function public._${bp}_customer_success_action_center_integration() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Customer Success & Action Center — cross-links only.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'customer_success_center', 'label', 'Customer Success Phase 213 cross-link', 'cross_link', '/app/aipify-customer-success-value-realization-engine'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center Phase 205 cross-link', 'cross_link', '/app/aipify-action-center-execution-engine'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds — RBAC protected'),
    jsonb_build_object('key', 'stewardship_loops', 'label', 'Customer journey stewardship loops'),
    jsonb_build_object('key', 'no_auto_modify', 'label', 'Never auto-modify journeys without approval'),
    jsonb_build_object('key', 'no_sensitive_pii', 'label', 'Never expose sensitive customer PII')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Exposing sensitive customer PII to unauthorized roles',
      'Auto-modifying journeys without approval',
      'Replacing human experience stewardship decisions',
      'Prioritizing efficiency over empathy',
      'Bypassing RBAC audit requirements',
      'Override human judgment'), 'principle', '${P.companion} supports — humans steward customer journey and experience.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — patience, empathy, and dignity toward customer relationships without pressure.', 'values', jsonb_build_array('empathy_before_efficiency','relationships_before_transactions','clarity_before_complexity','patience','service','recognition'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Customer journey audit logs via aipify_customer_journey_experience_orchestration_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_customer_journey_experience_orchestration permissions'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only journey scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'pii_protection', 'label', 'Customer PII protection — RBAC enforced'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 213, 'key', 'customer_success_value_realization', 'label', 'Customer Success Phase 213', 'route', '/app/aipify-customer-success-value-realization-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 214, 'key', 'customer_journey_experience_orchestration', 'label', 'Customer Journey Phase 214', 'route', '/app/${P.slug}', 'description', 'Human-stewarded customer journey')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'customer_success_center', 'label', 'Customer Success Phase 213', 'route', '/app/aipify-customer-success-value-realization-engine', 'relationship', 'Success integration — cross-link only'),
    jsonb_build_object('key', 'action_center_execution', 'label', 'Action Center Phase 205', 'route', '/app/aipify-action-center-execution-engine', 'relationship', 'Journey actions — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Empathy and patience — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with metadata-only journey scaffolds and human experience stewardship gates. ${P.companion} supports — never auto-modifies journeys or exposes sensitive customer PII.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans steward customer journey and experience.', '${P.companion} informs and supports.', 'Empathy before efficiency — relationships before transactions.', 'Clarity before complexity.', 'Innovation Era — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — journey summaries and friction signals max ~500 chars. No sensitive customer PII or unauthorized journey content in audit payloads.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  const chain = [
    "aipify_organizational_rhythms_operating_cadence_engine",
    "aipify_continuous_improvement_optimization_engine",
    "aipify_innovation_opportunity_discovery_engine",
    P.prevDecision,
    P.decisionType,
  ];
  const additions = chain.filter((entry) => !sql.includes(`'${entry}'`));
  if (additions.length === 0) return sql;
  const anchor = sql.includes("'aipify_resource_capacity_workload_balance_engine'")
    ? "'aipify_resource_capacity_workload_balance_engine'"
    : "'aipify_operations_orchestration_engine'";
  return sql.replace(anchor, `${anchor},\n    ${additions.map((e) => `'${e}'`).join(",\n    ")}`);
}

function patchMigration(sql) {
  sql = sql.replace(
    /-- Phase \d+ —[^\n]+\n-- [^\n]+\n-- Helpers:[^\n]+/,
    `-- Phase ${P.phase} — ${P.title} Engine\n-- ${P.era}.\n-- Helpers: _${P.helper}_* (engine), _${P.bp}_* (blueprint)`,
  );
  sql = patchDecisionTypeChain(sql);
  const start = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const end = sql.indexOf(`create or replace function public._${P.helper}_refresh_metrics`);
  if (start !== -1 && end !== -1) sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);

  const bp = P.bp;
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_\w+\(\)->'capabilities'\) = 8,/,
    `jsonb_build_object('key', 'center', 'label', '${P.centerTitle} — eight capabilities', 'met', jsonb_array_length(public._${bp}_customer_journey_dashboard()->'capabilities') = 8,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_\w+\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Experience friction monitor — five questions', 'met', jsonb_array_length(public._${bp}_experience_friction_monitor()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'companion', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_\w+\(\)->'capabilities'\) = 6,/,
    `jsonb_build_object('key', 'companion', 'label', '${P.companion} capabilities', 'met', jsonb_array_length(public._${bp}_journey_companion()->'capabilities') = 6,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${bp}_era_opener_summary()) = 2,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'baseline', 'label', 'Repo Phase \d+ baseline tables'/,
    `jsonb_build_object('key', 'baseline', 'label', 'Repo Phase ${P.phase} baseline tables'`,
  );

  for (const fn of [
    "customer_journey_dashboard",
    "experience_friction_monitor",
    "journey_optimization_center",
    "executive_experience_dashboard",
    "journey_companion",
    "customer_milestone_framework",
    "engagement_opportunity_engine",
    "customer_success_action_center_integration",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${bp}_${fn}()`);
  }

  if (!sql.includes("customer_success_action_center_integration_meta")) {
    sql = sql.replace(
      `'sub_engine_meta', public._${bp}_customer_milestone_framework(),`,
      `'sub_engine_meta', public._${bp}_customer_milestone_framework(), 'engagement_opportunity_engine_meta', public._${bp}_engagement_opportunity_engine(), 'customer_success_action_center_integration_meta', public._${bp}_customer_success_action_center_integration(),`,
    );
  }

  sql = sql.replace(
    /select 'aipify-organizational-rhythms-operating-cadence-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`Phase ${P.phase} ${P.title} Engine —[^']+`, "g"),
    `Phase ${P.phase} ${P.title} Engine — customer journey experience orchestration within Innovation Era; cross-link only for customer success and action center.`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replace(/'title', 'Aipify Organizational Rhythms & Operating Cadence Engine'/g, `'title', '${P.title} Engine'`);

  return sql;
}

function genMigration() {
  const src210 = path.join(ROOT, "supabase/migrations/20261370000000_aipify_organizational_rhythms_operating_cadence_engine_phase210.sql");
  if (!fs.existsSync(src210)) throw new Error("Phase 210 migration required");
  let m = transformFrom210(fs.readFileSync(src210, "utf8"));
  m = m.replace(/_aoroce_seed_cadence_notes/g, `_${P.helper}_seed_${P.thirdEntity.replace("_notes", "")}_notes`);
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports journey visibility — does NOT auto-modify journeys or expose sensitive customer PII.

## Permissions

- \`${P.permPrefix}.view\` · \`${P.permPrefix}.manage\` · \`${P.permPrefix}.steward\`

## Helpers

- Engine: \`_${P.helper}_*\` · Blueprint: \`_${P.bp}_*\`

${P.crossLinkNote}
`,
  );
  write(
    path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
    `# Implementation Blueprint — Phase ${P.phase} ${P.title} Engine\n\nRoute: \`/app/${P.slug}\`\nEra: ${P.era}\n${P.crossLinkNote}\n`,
  );
  write(
    path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
    `# ${P.title} Engine — FAQ (Phase ${P.phase})\n\n${P.faqBody}\n`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}\nRoute: /app/${P.slug}\n${P.ilmExtra}\n${P.crossLinkNote}\nPeople First. Empathy before efficiency.\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never auto-modifies journeys.";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/${P.slug}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_COMPANION_LIMITATIONS = [\n${P.companionLimitations.map((l) => `  "${l}",`).join("\n")}\n] as const;\n`,
  );
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports journey summaries, friction insights, and optimization suggestions. Supports humans — does NOT auto-modify journeys or expose sensitive customer PII.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Journey score",
    modeLabel: "Mode",
    readinessLabel: "Journey maturity level",
    executiveReviews: "Executive experience dashboard",
    activeReflections: "Active experience friction scaffolds",
    humanOversightRequired: `Human oversight required — humans steward customer journey; ${P.companion} supports only`,
    eraOpenerSummary: `Innovation Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate customer success or action center RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Experience friction monitor — friction prompts",
    frameworkLabel: "Journey optimization center",
    reviewsLabel: "Executive experience dashboard",
    companionLabel: `${P.companion} — supports, does not auto-modify journeys`,
    subEngineLabel: "Customer Milestone Framework",
    reflections: "Experience friction scaffolds",
    executiveReviewEntries: "Executive experience entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT auto-modify journeys or expose sensitive customer PII`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports journey visibility — humans retain customer experience authority.`,
      philosophy: "People First. Metadata-only journey scaffolds. Empathy before efficiency.",
      empathyBeforeEfficiency: "Empathy before efficiency — relationships before transactions — clarity before complexity.",
      customerJourneyEra: `${P.era} — Phase ${P.phase}.`,
    },
  };
}

function patchNav() {
  let c = fs.readFileSync(path.join(ROOT, "lib/app/nav-config.ts"), "utf8");
  const id = P.camel;
  const href = `/app/${P.slug}`;
  if (!c.includes(`"${id}"`)) {
    c = c.replace('| "aipifyCustomerSuccessValueRealizationEngine"', `| "aipifyCustomerSuccessValueRealizationEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    const anchor = /id: "aipifyCustomerSuccessValueRealizationEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyCustomerSuccessValueRealizationEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-customer-success-value-realization-engine")) {\n    return "aipifyCustomerSuccessValueRealizationEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-customer-success-value-realization-engine")) {\n    return "aipifyCustomerSuccessValueRealizationEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
  console.log("patched nav-config");
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      const anchor = c.includes('"aipify_customer_success_value_realization.steward"')
        ? '"aipify_customer_success_value_realization.steward",'
        : '"aipify_continuous_improvement_optimization.steward",';
      c = c.replace(anchor, `${anchor}\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
  console.log("patched permissions");
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    const anchor = c.includes('export * from "./aipify-customer-success-value-realization-engine";')
      ? 'export * from "./aipify-customer-success-value-realization-engine";'
      : 'export * from "./aipify-continuous-improvement-optimization-engine";';
    c = c.replace(anchor, `${anchor}\nexport * from "./${P.slug}";`);
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  console.log("patched tenant");
}

function patchI18n() {
  const block = i18nBlock();
  for (const locale of ["en", "no", "sv", "da"]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.nav = data.nav ?? {};
    data.nav[P.camel] =
      locale === "no"
        ? "Kundereise"
        : locale === "sv"
          ? "Kundresa"
          : locale === "da"
            ? "Kunderejse"
            : P.navLabel;
    data[P.camel] = block;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchIlm() {
  let c = fs.readFileSync(path.join(ROOT, "lib/internal-language-model/index.ts"), "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    const ilmAnchor = c.includes('export * from "./implementation-blueprint-phase215-vocabulary";')
      ? 'export * from "./implementation-blueprint-phase215-vocabulary";'
      : c.includes('export * from "./implementation-blueprint-phase213-vocabulary";')
        ? 'export * from "./implementation-blueprint-phase213-vocabulary";'
        : 'export * from "./implementation-blueprint-phase210-vocabulary";';
    c = c.replace(ilmAnchor, `${ilmAnchor}\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`);
  }
  const corpus = `aipify-core/knowledge/internal-language-model/${P.ilmFile}`;
  if (!c.includes(corpus)) {
    const corpusAnchor = c.includes("IMPLEMENTATION_BLUEPRINT_PHASE215_CORPUS")
      ? /export const IMPLEMENTATION_BLUEPRINT_PHASE215_CORPUS =[\s\S]*?;/
      : c.includes("IMPLEMENTATION_BLUEPRINT_PHASE213_CORPUS")
        ? /export const IMPLEMENTATION_BLUEPRINT_PHASE213_CORPUS =[\s\S]*?;/
        : /export const IMPLEMENTATION_BLUEPRINT_PHASE210_CORPUS =[\s\S]*?;/;
    c = c.replace(corpusAnchor, (m) => `${m}\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "${corpus}";`);
  }
  fs.writeFileSync(path.join(ROOT, "lib/internal-language-model/index.ts"), c);
  console.log("patched ilm index");
}

function patchArchitecture() {
  let c = fs.readFileSync(path.join(ROOT, "ARCHITECTURE.md"), "utf8");
  const marker = `Phase ${P.phase})`;
  if (c.includes(marker)) {
    console.log(`ARCHITECTURE.md already has Phase ${P.phase}`);
    return;
  }
  const entry = `\n**${P.title} Engine (Phase ${P.phase}):** See [${P.docSlug}_PHASE${P.phase}.md](./${P.docSlug}_PHASE${P.phase}.md) — ${P.centerTitle} for customer journey dashboard, experience friction monitor, journey optimization center, customer milestone framework, engagement opportunity engine, executive experience dashboard, and customer success/action center integration. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** auto-modifying journeys or exposing sensitive customer PII. Cross-links only: Phase 213 customer success, Phase 205 action center. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  const insertAfter = c.includes("aipifyCustomerSuccessValueRealizationEngine")
    ? "Permissions `aipify_customer_success_value_realization.steward`."
    : "Permissions `aipify_continuous_improvement_optimization.steward`.";
  const idx = c.indexOf(insertAfter);
  if (idx !== -1) {
    c = c.slice(0, idx + insertAfter.length) + entry + c.slice(idx + insertAfter.length);
  } else {
    c += entry;
  }
  fs.writeFileSync(path.join(ROOT, "ARCHITECTURE.md"), c);
  console.log("patched ARCHITECTURE.md");
}

genCore();
genTsStack();
genMigration();
genDocs();
patchNav();
patchPermissions();
patchTenant();
patchI18n();
patchIlm();
patchArchitecture();
console.log(`Phase ${P.phase} complete`);
