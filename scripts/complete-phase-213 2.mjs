#!/usr/bin/env node
/** ABOS Phase 213 — Aipify Customer Success & Value Realization Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const P = {
  phase: 213,
  migration: "20261373000000_aipify_customer_success_value_realization_engine_phase213.sql",
  slug: "aipify-customer-success-value-realization-engine",
  base: "AipifyCustomerSuccessValueRealization",
  camel: "aipifyCustomerSuccessValueRealizationEngine",
  snake: "aipify_customer_success_value_realization",
  permPrefix: "aipify_customer_success_value_realization",
  helper: "acsvre",
  bp: "acsvrebp213",
  decisionType: "aipify_customer_success_value_realization_engine",
  prevDecision: "aipify_innovation_opportunity_discovery_engine",
  title: "Aipify Customer Success & Value Realization",
  centerTitle: "Customer Success Center",
  companion: "Success Companion",
  scoreKey: "aipify_customer_success_value_realization_score",
  modeKey: "customer_success_mode",
  levelKey: "success_maturity_level",
  thirdEntity: "success_notes",
  era: "Innovation & Adaptive Excellence Era (211–220)",
  eraRange: "211–220",
  docSlug: "AIPIFY_CUSTOMER_SUCCESS_VALUE_REALIZATION_ENGINE",
  ilmFile: "implementation-blueprint-phase213-aipify-customer-success-value-realization.txt",
  navLabel: "Customer Success",
  crossLinkNote:
    "Cross-links only: Phase 200 executive cockpit, Phase 205 action center — never expose sensitive customer business data, auto-execute outreach, or bypass human stewardship.",
  ilmExtra: `
Customer Success Center: customer success dashboard, customer health engine, value realization tracker, success opportunity center, Growth Partner collaboration hub, executive customer insights dashboard, executive/action cockpit integration (cross-links), success knowledge libraries.
Customer Health Engine prompts: adoption signals, engagement patterns, value realization gaps, proactive outreach opportunities, relationship health indicators.
Value Realization Tracker: measurable outcomes, adoption milestones, business impact signals, stewardship checkpoints, enterprise scale.
Executive Customer Insights Dashboard, Success Companion, Success Opportunity Center, Growth Partner Collaboration Hub tracks.
Design principles: value before vanity metrics, proactive before reactive, relationships before transactions.
Companion limitations: no exposing sensitive customer business data, no auto-executing outreach without approval, no replacing human stewardship, no vanity metrics over value, no bypassing RBAC audit.`,
  faqBody: `## What is Customer Success & Value Realization Engine?

Customer Success helps organizations maximize value from Aipify by monitoring adoption, identifying improvement opportunities, and ensuring measurable business outcomes — at \`/app/aipify-customer-success-value-realization-engine\`.

## Does the Success Companion execute outreach automatically?

**No.** The Success Companion surfaces adoption insights, value realization signals, and proactive outreach suggestions — it does NOT auto-execute outreach without approval or expose sensitive customer business data.

## What does the Customer Success Center show?

Adoption health, value realization progress, success opportunities, Growth Partner collaboration scaffolds, and executive customer insights — metadata only.

## How does this relate to Executive Cockpit and Action Center?

Cross-link only: Phase 200 executive cockpit (\`/app/aipify-executive-operating-system-founders-cockpit-engine\`) and Phase 205 action center (\`/app/aipify-action-center-execution-engine\`). Never duplicate their RPCs.

## Why human stewardship?

Humans retain customer success authority. Aipify advises and suggests — it does not auto-execute outreach or replace relationship stewardship.`,
  companionLimitations: [
    "exposing_sensitive_customer_business_data",
    "auto_executing_outreach_without_approval",
    "replacing_human_stewardship_decisions",
    "vanity_metrics_over_value",
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
    ["organizational_rhythm_dashboard", "customer_success_dashboard"],
    ["cadence_reflection_engine", "customer_health_engine"],
    ["cadence_framework", "value_realization_tracker"],
    ["executive_cadence_reviews", "executive_customer_insights_dashboard"],
    ["cadence_companion", "success_companion"],
    ["leadership_cadence_center", "success_opportunity_center"],
    ["team_rhythm_framework", "growth_partner_collaboration_hub"],
    ["strategic_review_scheduler", "value_realization_scheduler"],
    ["follow_up_integrity_monitor", "adoption_integrity_monitor"],
    ["organizational_pulse_calendar", "executive_action_cockpit_integration"],
    ["action_decision_executive_cockpit_integration", "executive_action_cockpit_integration"],
    ["cadence_knowledge_libraries", "success_knowledge_libraries"],
    ["leadership_cadence_center_meta", "success_opportunity_center_meta"],
    ["team_rhythm_framework_meta", "growth_partner_collaboration_hub_meta"],
    ["organizational_pulse_calendar_meta", "executive_action_cockpit_integration_meta"],
    ["Executive Cadence Reviews", "Executive Customer Insights Dashboard"],
    ["organizational rhythms operating cadence within", "customer success value realization within"],
    ["_seed_cadence_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["auto-schedule meetings without approval", "auto-execute outreach without approval"],
    ["override leadership cadence without approval", "bypass human stewardship without approval"],
    ["Cadence Companion supports", "Success Companion supports"],
    ["never auto-schedules meetings or overrides leadership cadence", "never auto-executes outreach or exposes sensitive customer business data"],
    ["supports — does not auto-schedule meetings or override leadership cadence", "supports — does not auto-execute outreach or expose sensitive customer business data"],
    [
      "supports rhythm visibility, does not auto-schedule meetings or override leadership cadence choices",
      "supports value realization visibility, does not auto-execute outreach or expose sensitive customer business data",
    ],
    ["operating cadence tracking", "customer success tracking"],
    ["Human-stewarded operating cadence", "Human-stewarded customer success"],
    ["reflection_required", "stewardship_required"],
    ["Cadence score", "Success score"],
    ["Cadence discipline level", "Success maturity level"],
    ["Cadence reflection engine", "Customer health engine"],
    ["Cadence framework", "Value realization tracker"],
    ["Executive cadence reviews", "Executive customer insights dashboard"],
    ["Leadership Cadence Center", "Success Opportunity Center"],
    ["Team Rhythm Framework", "Growth Partner Collaboration Hub"],
    ["Organizational Pulse Calendar", "Executive Action Cockpit Integration"],
    ["Cadence reflection scaffolds", "Customer health scaffolds"],
    ["Cadence review entries", "Executive customer insight entries"],
    ["humans steward leadership cadence and reflection", "humans steward customer success and value realization"],
    ["operating rhythms, strategic reviews, and follow-up integrity", "adoption health, value realization, and proactive outreach suggestions"],
    ["does NOT auto-schedule meetings or override leadership cadence", "does NOT auto-execute outreach or expose sensitive customer business data"],
    ["never auto-schedules meetings without approval", "never auto-executes outreach without approval"],
    ["auto_scheduling_without_approval", "auto_executing_outreach_without_approval"],
    ["overriding_leadership_cadence_choices", "replacing_human_stewardship_decisions"],
    ["punitive_missed_review_enforcement", "vanity_metrics_over_value"],
    ["exposing_sensitive_executive_schedules", "exposing_sensitive_customer_business_data"],
    ["replacing_human_reflection", "bypassing_rbac_audit"],
    ["AIPIFY_ORGANIZATIONAL_RHYTHMS_OPERATING_CADENCE_ENGINE", P.docSlug],
    ["organizational_discipline", "adoption_signals"],
    ["execution_consistency", "engagement_patterns"],
    ["sustainable_leadership", "value_realization_gaps"],
    ["strategic_alignment", "proactive_outreach_opportunities"],
    ["proactive_vs_reactive_management", "relationship_health_indicators"],
    ["daily_weekly_monthly_quarterly_annual_cycles", "measurable_outcomes"],
    ["leadership_cadence", "adoption_milestones"],
    ["team_rhythms", "business_impact_signals"],
    ["strategic_reviews", "stewardship_checkpoints"],
    ["follow_up_integrity", "enterprise_scale"],
    ["pulse_calendar", "impact_measurement"],
    ["upcoming_cadences", "active_success_programs"],
    ["missed_reviews", "improvement_opportunities"],
    ["strategic_review_readiness", "value_realization_progress"],
    ["leadership_commitment_tracking", "measurable_outcomes"],
    ["rhythm_summaries", "adoption_summaries"],
    ["follow_up_insights", "value_insights"],
    ["cadence_prompts", "success_prompts"],
    ["cadence_insights", "health_insights"],
    ["schedule_protection_reminders", "relationship_stewardship_reminders"],
    ["consistency_before_urgency", "value_before_vanity_metrics"],
    ["discipline_before_chaos", "proactive_before_reactive"],
    ["stewardship_before_short_term_reactions", "relationships_before_transactions"],
    ["aipify_organizational_rhythms_operating_cadence_audit_logs", "aipify_customer_success_value_realization_audit_logs"],
    ["aipify_organizational_rhythms_operating_cadence permissions", "aipify_customer_success_value_realization permissions"],
    ["Metadata-only cadence scaffolds", "Metadata-only success scaffolds"],
    ["Executive schedule protection", "Customer business data protection"],
    ["organizational rhythms operating cadence visibility", "customer success value realization visibility"],
    ["human reflection gates", "human stewardship gates"],
    ["consistent cadence without pressure", "proactive success without pressure"],
    ["rhythm summaries and follow-up insights", "adoption summaries and value insights"],
    ["auto-schedule meetings", "auto-execute outreach"],
    ["override leadership cadence", "bypass human stewardship"],
    ["Era Capstone", "Customer Success Era"],
    ["ERA CAPSTONE", "CUSTOMER SUCCESS ERA"],
    ["era capstone", "customer success era"],
    ["Global Command & Enterprise Operations Era (201–210)", P.era],
    ["201–210", P.eraRange],
    ["210", "213"],
    ["decision center", "action center"],
    ["Decision Center Phase 207", "Action Center Phase 205"],
    ["/app/aipify-decision-center-governance-engine", "/app/aipify-action-center-execution-engine"],
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
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports value realization — NOT auto-executing outreach or exposing sensitive customer business data. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Help organizations maximize value from Aipify by monitoring adoption, identifying improvement opportunities, and ensuring measurable business outcomes with human stewardship — Success Companion prepares, humans steward relationships and outreach.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Innovation Era (${P.eraRange}). Human-stewarded customer success; metadata-only scaffolds; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where adoption is monitored responsibly, value is measured honestly, success opportunities are surfaced proactively, and humans retain customer relationship authority.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'customer_health_engine', 'label', 'Customer health engine', 'emoji', '💚', 'description', 'Adoption and engagement signals'),
    jsonb_build_object('key', 'tracker', 'label', 'Value realization tracker', 'emoji', '📊', 'description', 'Measurable outcomes and milestones'),
    jsonb_build_object('key', 'insights_dashboard', 'label', 'Executive customer insights', 'emoji', '📈', 'description', 'Leadership visibility scaffolds'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not auto-execute'),
    jsonb_build_object('key', 'success_opportunity_center', 'label', 'Success Opportunity Center', 'emoji', '🎯', 'description', 'Improvement opportunity scaffolds'),
    jsonb_build_object('key', 'growth_partner_hub', 'label', 'Growth Partner Collaboration Hub', 'emoji', '🤝', 'description', 'Growth Partner — never Affiliate'),
    jsonb_build_object('key', 'success_libraries', 'label', 'Success knowledge libraries', 'emoji', '🌱', 'description', 'Approved success resources')
  ); ${D};
create or replace function public._${bp}_customer_success_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities. Value before vanity metrics.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'customer_success_dashboard', 'label', 'Customer Success Dashboard — adoption health, active programs, executive visibility'),
    jsonb_build_object('key', 'customer_health_engine', 'label', 'Customer Health Engine — adoption signals, engagement patterns, relationship health'),
    jsonb_build_object('key', 'value_realization_tracker', 'label', 'Value Realization Tracker — measurable outcomes, milestones, impact signals'),
    jsonb_build_object('key', 'success_opportunity_center', 'label', 'Success Opportunity Center — improvement opportunities, proactive suggestions'),
    jsonb_build_object('key', 'growth_partner_collaboration_hub', 'label', 'Growth Partner Collaboration Hub — Growth Partner stewardship, never Affiliate'),
    jsonb_build_object('key', 'executive_customer_insights_dashboard', 'label', 'Executive Customer Insights Dashboard — leadership visibility, value summaries'),
    jsonb_build_object('key', 'executive_action_cockpit_integration', 'label', 'Executive Cockpit & Action Center integration — cross-links only'),
    jsonb_build_object('key', 'success_knowledge_libraries', 'label', 'Success knowledge libraries — approved customer success resources')
  )); ${D};
create or replace function public._${bp}_customer_health_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Customer health prompts — humans steward success relationships.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'adoption_signals', 'label', 'What adoption signals need attention?'),
    jsonb_build_object('key', 'engagement_patterns', 'label', 'Where are engagement patterns shifting?'),
    jsonb_build_object('key', 'value_realization_gaps', 'label', 'Where are value realization gaps emerging?'),
    jsonb_build_object('key', 'proactive_outreach_opportunities', 'label', 'What proactive outreach opportunities exist?'),
    jsonb_build_object('key', 'relationship_health_indicators', 'label', 'How healthy are key customer relationships?')
  )); ${D};
create or replace function public._${bp}_value_realization_tracker() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Value realization tracker — proactive before reactive.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'measurable_outcomes', 'label', 'Measurable outcomes'),
    jsonb_build_object('key', 'adoption_milestones', 'label', 'Adoption milestones'),
    jsonb_build_object('key', 'business_impact_signals', 'label', 'Business impact signals'),
    jsonb_build_object('key', 'stewardship_checkpoints', 'label', 'Stewardship checkpoints'),
    jsonb_build_object('key', 'impact_measurement', 'label', 'Impact measurement'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale'),
    jsonb_build_object('key', 'value_before_vanity', 'label', 'Value before vanity metrics')
  )); ${D};
create or replace function public._${bp}_executive_customer_insights_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive customer insights — relationships before transactions.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'active_success_programs', 'label', 'Active success programs'),
    jsonb_build_object('key', 'improvement_opportunities', 'label', 'Improvement opportunities'),
    jsonb_build_object('key', 'value_realization_progress', 'label', 'Value realization progress'),
    jsonb_build_object('key', 'measurable_outcomes', 'label', 'Measurable outcomes'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds')
  )); ${D};
create or replace function public._${bp}_success_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports value realization, does not auto-execute outreach or expose sensitive customer business data.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'adoption_summaries', 'label', 'Adoption summaries'),
    jsonb_build_object('key', 'value_insights', 'label', 'Value insights'),
    jsonb_build_object('key', 'health_insights', 'label', 'Health insights'),
    jsonb_build_object('key', 'success_prompts', 'label', 'Success prompts'),
    jsonb_build_object('key', 'outreach_suggestions', 'label', 'Proactive outreach suggestions — advisory only'),
    jsonb_build_object('key', 'relationship_stewardship_reminders', 'label', 'Relationship stewardship reminders — RBAC enforced')
  )); ${D};
create or replace function public._${bp}_success_opportunity_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Success Opportunity Center — improvement opportunity scaffolds.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'improvement_opportunities', 'label', 'Improvement opportunity detection'),
    jsonb_build_object('key', 'proactive_suggestions', 'label', 'Proactive suggestions — humans decide'),
    jsonb_build_object('key', 'adoption_milestones', 'label', 'Adoption milestone tracking'),
    jsonb_build_object('key', 'ownership_assignment', 'label', 'Stewardship assignment scaffolds'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no sensitive business data'),
    jsonb_build_object('key', 'human_stewardship_gates', 'label', 'Human stewardship gates for outreach')
  )); ${D};
create or replace function public._${bp}_growth_partner_collaboration_hub() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Growth Partner Collaboration Hub — Growth Partner, never Affiliate.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'growth_partner_collaboration', 'label', 'Growth Partner collaboration scaffolds'),
    jsonb_build_object('key', 'relationship_stewardship', 'label', 'Relationship stewardship prompts'),
    jsonb_build_object('key', 'value_realization_support', 'label', 'Value realization support'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Customer success audit trails'),
    jsonb_build_object('key', 'no_auto_outreach', 'label', 'Never auto-execute outreach without approval'),
    jsonb_build_object('key', 'action_center_cross_link', 'label', 'Action Center Phase 205 cross-link', 'cross_link', '/app/aipify-action-center-execution-engine')
  )); ${D};
create or replace function public._${bp}_executive_action_cockpit_integration() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive Cockpit & Action Center — cross-links only.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200 cross-link', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center Phase 205 cross-link', 'cross_link', '/app/aipify-action-center-execution-engine'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds — RBAC protected'),
    jsonb_build_object('key', 'stewardship_loops', 'label', 'Customer success stewardship loops'),
    jsonb_build_object('key', 'no_auto_outreach', 'label', 'Never auto-execute outreach without approval'),
    jsonb_build_object('key', 'no_sensitive_data', 'label', 'Never expose sensitive customer business data')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Exposing sensitive customer business data to unauthorized roles',
      'Auto-executing outreach without approval',
      'Replacing human stewardship decisions',
      'Prioritizing vanity metrics over value',
      'Bypassing RBAC audit requirements',
      'Override human judgment'), 'principle', '${P.companion} supports — humans steward customer relationships and outreach.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — patience, service, and dignity toward customer relationships without pressure.', 'values', jsonb_build_array('value_before_vanity_metrics','proactive_before_reactive','relationships_before_transactions','patience','service','recognition'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Customer success audit logs via aipify_customer_success_value_realization_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_customer_success_value_realization permissions'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only success scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'customer_data_protection', 'label', 'Customer business data protection — RBAC enforced'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 212, 'key', 'innovation_opportunity_discovery', 'label', 'Innovation Discovery Phase 212', 'route', '/app/aipify-innovation-opportunity-discovery-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 213, 'key', 'customer_success_value_realization', 'label', 'Customer Success Phase 213', 'route', '/app/${P.slug}', 'description', 'Human-stewarded customer success')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive visibility — cross-link only'),
    jsonb_build_object('key', 'action_center_execution', 'label', 'Action Center Phase 205', 'route', '/app/aipify-action-center-execution-engine', 'relationship', 'Success actions — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Patience and service — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with metadata-only success scaffolds and human stewardship gates. Growth Partner terminology. ${P.companion} supports — never auto-executes outreach or exposes sensitive customer business data.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans steward customer relationships and outreach.', '${P.companion} informs and supports.', 'Value before vanity metrics — proactive before reactive.', 'Growth Partner — never Affiliate.', 'Innovation Era — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — adoption summaries and value signals max ~500 chars. No sensitive customer business data, PII, or unauthorized success content in audit payloads.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  const chain = [
    "aipify_organizational_rhythms_operating_cadence_engine",
    "aipify_continuous_improvement_optimization_engine",
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
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_customer_success_dashboard\(\)->'capabilities'\) = 8,/,
    `jsonb_build_object('key', 'center', 'label', '${P.centerTitle} — eight capabilities', 'met', jsonb_array_length(public._${bp}_customer_success_dashboard()->'capabilities') = 8,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_customer_health_engine\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Customer health engine — five questions', 'met', jsonb_array_length(public._${bp}_customer_health_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'companion', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_success_companion\(\)->'capabilities'\) = 6,/,
    `jsonb_build_object('key', 'companion', 'label', '${P.companion} capabilities', 'met', jsonb_array_length(public._${bp}_success_companion()->'capabilities') = 6,`,
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
    "customer_success_dashboard",
    "customer_health_engine",
    "value_realization_tracker",
    "executive_customer_insights_dashboard",
    "success_companion",
    "success_opportunity_center",
    "growth_partner_collaboration_hub",
    "executive_action_cockpit_integration",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${bp}_${fn}()`);
  }

  if (!sql.includes("executive_action_cockpit_integration_meta")) {
    sql = sql.replace(
      `'sub_engine_meta', public._${bp}_success_opportunity_center(),`,
      `'sub_engine_meta', public._${bp}_success_opportunity_center(), 'growth_partner_collaboration_hub_meta', public._${bp}_growth_partner_collaboration_hub(), 'executive_action_cockpit_integration_meta', public._${bp}_executive_action_cockpit_integration(),`,
    );
  }

  sql = sql.replace(
    /select 'aipify-organizational-rhythms-operating-cadence-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`Phase ${P.phase} ${P.title} Engine —[^']+`, "g"),
    `Phase ${P.phase} ${P.title} Engine — customer success value realization within Innovation Era; cross-link only for executive cockpit and action center.`,
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

${P.centerTitle} within ${P.era}. ${P.companion} supports value realization — does NOT auto-execute outreach or expose sensitive customer business data.

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
    `ABOS Phase ${P.phase} — ${P.title}\nRoute: /app/${P.slug}\n${P.ilmExtra}\n${P.crossLinkNote}\nPeople First. Growth Partner — never Affiliate.\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never auto-executes outreach.";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/${P.slug}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_COMPANION_LIMITATIONS = [\n${P.companionLimitations.map((l) => `  "${l}",`).join("\n")}\n] as const;\n`,
  );
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports adoption summaries, value insights, and proactive outreach suggestions. Supports humans — does NOT auto-execute outreach or expose sensitive customer business data. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Success score",
    modeLabel: "Mode",
    readinessLabel: "Success maturity level",
    executiveReviews: "Executive customer insights dashboard",
    activeReflections: "Active customer health scaffolds",
    humanOversightRequired: `Human oversight required — humans steward customer success; ${P.companion} supports only`,
    eraOpenerSummary: `Innovation Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate executive cockpit or action center RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Customer health engine — health prompts",
    frameworkLabel: "Value realization tracker",
    reviewsLabel: "Executive customer insights dashboard",
    companionLabel: `${P.companion} — supports, does not auto-execute outreach`,
    subEngineLabel: "Success Opportunity Center",
    reflections: "Customer health scaffolds",
    executiveReviewEntries: "Executive customer insight entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT auto-execute outreach or expose sensitive customer business data`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports value realization — humans retain customer success authority.`,
      philosophy: "People First. Metadata-only success scaffolds. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
      customerSuccessEra: `${P.era} — Phase ${P.phase}.`,
    },
  };
}

function patchNav() {
  let c = fs.readFileSync(path.join(ROOT, "lib/app/nav-config.ts"), "utf8");
  const id = P.camel;
  const href = `/app/${P.slug}`;
  if (!c.includes(`"${id}"`)) {
    c = c.replace('| "continuousImprovementOptimizationEngine"', `| "continuousImprovementOptimizationEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    const anchor = /id: "continuousImprovementOptimizationEngine",[\s\S]*?labelKey: "customerApp\.nav\.continuousImprovementOptimizationEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-continuous-improvement-optimization-engine")) {\n    return "continuousImprovementOptimizationEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-continuous-improvement-optimization-engine")) {\n    return "continuousImprovementOptimizationEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
  console.log("patched nav-config");
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      const anchor = c.includes('"aipify_continuous_improvement_optimization.steward"')
        ? '"aipify_continuous_improvement_optimization.steward",'
        : '"aipify_organizational_rhythms_operating_cadence.steward",';
      c = c.replace(anchor, `${anchor}\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
  console.log("patched permissions");
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    const anchor = c.includes('export * from "./aipify-continuous-improvement-optimization-engine";')
      ? 'export * from "./aipify-continuous-improvement-optimization-engine";'
      : 'export * from "./aipify-organizational-rhythms-operating-cadence-engine";';
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
        ? "Kundesuksess"
        : locale === "sv"
          ? "Kundframgång"
          : locale === "da"
            ? "Kundesucces"
            : P.navLabel;
    data[P.camel] = block;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchIlm() {
  let c = fs.readFileSync(path.join(ROOT, "lib/internal-language-model/index.ts"), "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    const ilmAnchor = c.includes('export * from "./implementation-blueprint-phase211-vocabulary";')
      ? 'export * from "./implementation-blueprint-phase211-vocabulary";'
      : 'export * from "./implementation-blueprint-phase210-vocabulary";';
    c = c.replace(ilmAnchor, `${ilmAnchor}\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`);
  }
  const corpus = `aipify-core/knowledge/internal-language-model/${P.ilmFile}`;
  if (!c.includes(corpus)) {
    const corpusAnchor = c.includes("IMPLEMENTATION_BLUEPRINT_PHASE211_CORPUS")
      ? /export const IMPLEMENTATION_BLUEPRINT_PHASE211_CORPUS =[\s\S]*?;/
      : /export const IMPLEMENTATION_BLUEPRINT_PHASE210_CORPUS =[\s\S]*?;/;
    c = c.replace(corpusAnchor, (m) => `${m}\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "${corpus}";`);
  }
  fs.writeFileSync(path.join(ROOT, "lib/internal-language-model/index.ts"), c);
  console.log("patched ilm index");
}

function patchArchitecture() {
  let c = fs.readFileSync(path.join(ROOT, "ARCHITECTURE.md"), "utf8");
  const marker = `Phase ${P.phase}`;
  if (c.includes(marker)) {
    console.log("ARCHITECTURE.md already has Phase 213");
    return;
  }
  const entry = `\n**${P.title} Engine (Phase ${P.phase}):** See [${P.docSlug}_PHASE${P.phase}.md](./${P.docSlug}_PHASE${P.phase}.md) — ${P.centerTitle} for customer success dashboard, customer health engine, value realization tracker, success opportunity center, Growth Partner collaboration hub, executive customer insights dashboard, and executive/action cockpit integration. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** auto-executing outreach or exposing sensitive customer business data. Cross-links only: Phase 200 executive cockpit, Phase 205 action center. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  const insertAfter = c.includes("continuousImprovementOptimizationEngine")
    ? "Permissions `aipify_continuous_improvement_optimization.steward`."
    : "Permissions `aipify_organizational_rhythms_operating_cadence.steward`.";
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
