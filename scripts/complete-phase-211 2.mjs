#!/usr/bin/env node
/** ABOS Phase 211 — Aipify Continuous Improvement & Optimization Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const P = {
  phase: 211,
  migration: "20261371000000_aipify_continuous_improvement_optimization_engine_phase211.sql",
  slug: "aipify-continuous-improvement-optimization-engine",
  base: "AipifyContinuousImprovementOptimization",
  camel: "continuousImprovementOptimizationEngine",
  snake: "aipify_continuous_improvement_optimization",
  permPrefix: "aipify_continuous_improvement_optimization",
  helper: "acioe",
  bp: "acioebp211",
  decisionType: "aipify_continuous_improvement_optimization_engine",
  prevDecision: "aipify_organizational_rhythms_operating_cadence_engine",
  title: "Aipify Continuous Improvement & Optimization",
  centerTitle: "Improvement Center",
  companion: "Improvement Companion",
  scoreKey: "aipify_continuous_improvement_optimization_score",
  modeKey: "improvement_optimization_mode",
  levelKey: "improvement_maturity_level",
  thirdEntity: "improvement_notes",
  era: "Operational Excellence & Continuous Improvement Era (211+)",
  eraRange: "211+",
  docSlug: "AIPIFY_CONTINUOUS_IMPROVEMENT_OPTIMIZATION_ENGINE",
  ilmFile: "implementation-blueprint-phase211-aipify-continuous-improvement-optimization.txt",
  navLabel: "Continuous Improvement",
  crossLinkNote:
    "Cross-links only: Phase 208 operations orchestration, Phase 205 action center, Phase 200 executive cockpit — never auto-prioritize initiatives, override human approval, or store raw operational PII.",
  ilmExtra: `
Improvement Center: improvement dashboard, opportunity detection engine, improvement initiative center, lessons learned repository, optimization impact dashboard, continuous improvement reviews, operations/action/executive integration (cross-links), improvement knowledge libraries.
Opportunity Detection Engine prompts: workflow efficiency, process refinement, operational excellence, lessons integration, sustainable optimization.
Improvement Framework: initiative stewardship, opportunity signals, lessons learned, impact measurement, review cadence, enterprise scale.
Continuous Improvement Reviews, Improvement Companion, Lessons Learned Repository, Optimization Impact Dashboard tracks.
Design principles: reflection before reaction, stewardship before speed, human approval before initiative launch.
Companion limitations: no auto-prioritization, no launching initiatives without approval, no replacing human judgment, no punitive optimization enforcement, no raw operational PII in scaffolds.
Opens Operational Excellence & Continuous Improvement Era (211+).`,
  faqBody: `## What is Continuous Improvement & Optimization Engine?

Continuous Improvement helps organizations systematically identify improvement opportunities, optimize workflows, and strengthen operational excellence — at \`/app/aipify-continuous-improvement-optimization-engine\`.

## Does the Improvement Companion prioritize initiatives automatically?

**No.** The Improvement Companion surfaces opportunity signals and optimization insights — it does NOT auto-prioritize initiatives or launch improvements without human approval.

## What does the Improvement Center show?

Improvement opportunities, active initiatives, lessons learned summaries, optimization impact signals, and review scaffolds — metadata only.

## How does this relate to Operations Center, Action Center, and Executive Cockpit?

Cross-link only: Phase 208 operations orchestration (\`/app/aipify-operations-orchestration-engine\`), Phase 205 action center (\`/app/aipify-action-center-execution-engine\`), Phase 200 executive cockpit (\`/app/aipify-executive-operating-system-founders-cockpit-engine\`). Never duplicate their RPCs.

## Why human approval for initiatives?

Humans retain improvement authority. Aipify advises and suggests — it does not auto-prioritize or launch initiatives without explicit approval.`,
  companionLimitations: [
    "auto_prioritization",
    "launching_initiatives_without_approval",
    "replacing_human_judgment",
    "punitive_optimization_enforcement",
    "raw_operational_pii_in_scaffolds",
    "override_human_approval",
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
    ["aipifyOrganizationalRhythmsOperatingCadenceEngine", P.camel],
    ["aipifyOrganizationalRhythmsOperatingCadence", P.camel.replace(/Engine$/, "")],
    ["aorocebp210", P.bp],
    ["_aoroce_", `_${P.helper}_`],
    ["aipify_organizational_rhythms_operating_cadence_score", P.scoreKey],
    ["operating_cadence_mode", P.modeKey],
    ["cadence_discipline_level", P.levelKey],
    ["cadence_notes", P.thirdEntity],
    ["CadenceNote", thirdPascal.replace("Notes", "Note")],
    ["cadence_notes_count", `${P.thirdEntity}_count`],
    ["Operating Cadence Center", P.centerTitle],
    ["Cadence Companion", P.companion],
    ["Aipify Organizational Rhythms & Operating Cadence", P.title],
    ["Organizational Rhythms & Operating Cadence", "Continuous Improvement & Optimization"],
    ["Operating Cadence", P.navLabel],
    ["Phase 210", `Phase ${P.phase}`],
    ["aipify_organizational_rhythms_operating_cadence_engine", P.decisionType],
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
    ["organizational_rhythm_dashboard", "improvement_dashboard"],
    ["cadence_reflection_engine", "opportunity_detection_engine"],
    ["cadence_framework", "improvement_initiative_center"],
    ["executive_cadence_reviews", "continuous_improvement_reviews"],
    ["cadence_companion", "improvement_companion"],
    ["leadership_cadence_center", "lessons_learned_repository"],
    ["team_rhythm_framework", "optimization_impact_dashboard"],
    ["strategic_review_scheduler", "improvement_initiative_tracker"],
    ["follow_up_integrity_monitor", "opportunity_signal_monitor"],
    ["organizational_pulse_calendar", "operations_action_executive_integration"],
    ["action_decision_executive_cockpit_integration", "operations_action_executive_integration"],
    ["cadence_knowledge_libraries", "improvement_knowledge_libraries"],
    ["leadership_cadence_center_meta", "lessons_learned_repository_meta"],
    ["team_rhythm_framework_meta", "optimization_impact_dashboard_meta"],
    ["organizational_pulse_calendar_meta", "operations_action_executive_integration_meta"],
    ["Executive Cadence Reviews", "Continuous Improvement Reviews"],
    ["organizational rhythms operating cadence within", "continuous improvement optimization within"],
    ["_seed_cadence_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["auto-schedule meetings without approval", "auto-prioritize initiatives without approval"],
    ["override leadership cadence without approval", "launch initiatives without approval"],
    ["Cadence Companion supports", "Improvement Companion supports"],
    ["never auto-schedules meetings or overrides leadership cadence", "never auto-prioritizes initiatives or launches improvements without approval"],
    ["supports — does not auto-schedule meetings or override leadership cadence", "supports — does not auto-prioritize initiatives or launch improvements without approval"],
    [
      "supports rhythm visibility, does not auto-schedule meetings or override leadership cadence choices",
      "supports improvement visibility, does not auto-prioritize initiatives or launch improvements without approval",
    ],
    ["operating cadence tracking", "continuous improvement tracking"],
    ["Human-stewarded operating cadence", "Human-stewarded continuous improvement"],
    ["reflection_required", "approval_required"],
    ["Cadence score", "Improvement score"],
    ["Cadence discipline level", "Improvement maturity level"],
    ["Cadence reflection engine", "Opportunity detection engine"],
    ["Cadence framework", "Improvement initiative center"],
    ["Executive cadence reviews", "Continuous improvement reviews"],
    ["Leadership Cadence Center", "Lessons Learned Repository"],
    ["Team Rhythm Framework", "Optimization Impact Dashboard"],
    ["Organizational Pulse Calendar", "Operations Action Executive Integration"],
    ["Cadence reflection scaffolds", "Opportunity detection scaffolds"],
    ["Cadence review entries", "Improvement review entries"],
    ["humans steward leadership cadence and reflection", "humans steward improvement initiatives and approval"],
    ["operating rhythms, strategic reviews, and follow-up integrity", "improvement opportunities, initiative stewardship, and optimization impact"],
    ["does NOT auto-schedule meetings or override leadership cadence", "does NOT auto-prioritize initiatives or launch improvements without approval"],
    ["never auto-schedules meetings without approval", "never auto-prioritizes initiatives without approval"],
    ["auto_scheduling_without_approval", "auto_prioritization"],
    ["overriding_leadership_cadence_choices", "launching_initiatives_without_approval"],
    ["punitive_missed_review_enforcement", "punitive_optimization_enforcement"],
    ["exposing_sensitive_executive_schedules", "raw_operational_pii_in_scaffolds"],
    ["replacing_human_reflection", "replacing_human_judgment"],
    ["AIPIFY_ORGANIZATIONAL_RHYTHMS_OPERATING_CADENCE_ENGINE", P.docSlug],
    ["organizational_discipline", "workflow_efficiency"],
    ["execution_consistency", "process_refinement"],
    ["sustainable_leadership", "operational_excellence"],
    ["strategic_alignment", "lessons_integration"],
    ["proactive_vs_reactive_management", "sustainable_optimization"],
    ["daily_weekly_monthly_quarterly_annual_cycles", "initiative_stewardship"],
    ["leadership_cadence", "opportunity_signals"],
    ["team_rhythms", "lessons_learned"],
    ["strategic_reviews", "impact_measurement"],
    ["follow_up_integrity", "review_cadence"],
    ["pulse_calendar", "enterprise_scale"],
    ["upcoming_cadences", "active_opportunities"],
    ["missed_reviews", "pending_initiatives"],
    ["strategic_review_readiness", "optimization_readiness"],
    ["leadership_commitment_tracking", "initiative_approval_tracking"],
    ["rhythm_summaries", "opportunity_summaries"],
    ["follow_up_insights", "optimization_insights"],
    ["cadence_prompts", "improvement_prompts"],
    ["cadence_insights", "impact_insights"],
    ["schedule_protection_reminders", "approval_gate_reminders"],
    ["consistency_before_urgency", "reflection_before_reaction"],
    ["discipline_before_chaos", "stewardship_before_speed"],
    ["stewardship_before_short_term_reactions", "human_approval_before_initiative_launch"],
    ["aipify_organizational_rhythms_operating_cadence_audit_logs", "aipify_continuous_improvement_optimization_audit_logs"],
    ["aipify_organizational_rhythms_operating_cadence permissions", "aipify_continuous_improvement_optimization permissions"],
    ["Metadata-only cadence scaffolds", "Metadata-only improvement scaffolds"],
    ["Executive schedule protection", "Operational PII protection"],
    ["organizational rhythms operating cadence visibility", "continuous improvement optimization visibility"],
    ["human reflection gates", "human approval gates"],
    ["consistent cadence without pressure", "systematic improvement without pressure"],
    ["rhythm summaries and follow-up insights", "opportunity summaries and optimization insights"],
    ["auto-schedule meetings", "auto-prioritize initiatives"],
    ["override leadership cadence", "override human approval"],
    ["Global Command & Enterprise Operations Era (201–210)", P.era],
    ["Global Command Era — Phases 201–210 (Era Capstone)", `Operational Excellence Era — Phase ${P.phase}+`],
    ["Era Capstone", "Operational Excellence Opener"],
    ["ERA CAPSTONE", "OPERATIONAL EXCELLENCE OPENER"],
    ["Era capstone", "Operational excellence opener"],
    ["era capstone", "operational excellence opener"],
    ["201–210", P.eraRange],
    ["210", "211"],
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
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports improvement visibility — NOT auto-prioritizing initiatives or launching improvements without approval. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Help organizations systematically identify improvement opportunities, optimize workflows, and strengthen operational excellence — ${P.companion} prepares, humans steward initiatives and approval.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Operational Excellence Era (${P.eraRange}) — OPENER. Human-stewarded continuous improvement; metadata-only scaffolds; ${P.companion} informs and suggests.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where improvement is systematic, initiatives require human approval, lessons are captured, and optimization strengthens operational excellence.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'opportunity_detection_engine', 'label', 'Opportunity detection engine', 'emoji', '🔍', 'description', 'Opportunity detection prompts'),
    jsonb_build_object('key', 'initiative_center', 'label', 'Improvement initiative center', 'emoji', '🛡️', 'description', 'Initiative stewardship domains'),
    jsonb_build_object('key', 'improvement_reviews', 'label', 'Continuous improvement reviews', 'emoji', '👥', 'description', 'Improvement effectiveness reflection'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Advises — does not auto-prioritize'),
    jsonb_build_object('key', 'lessons_learned_repository', 'label', 'Lessons Learned Repository', 'emoji', '📖', 'description', 'Approved lessons scaffolds'),
    jsonb_build_object('key', 'optimization_impact_dashboard', 'label', 'Optimization Impact Dashboard', 'emoji', '📊', 'description', 'Impact measurement scaffolds'),
    jsonb_build_object('key', 'improvement_libraries', 'label', 'Improvement knowledge libraries', 'emoji', '🌱', 'description', 'Approved improvement resources')
  ); ${D};
create or replace function public._${bp}_improvement_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities. Reflection before reaction.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'improvement_dashboard', 'label', 'Improvement Dashboard — active opportunities, initiative status, improvement visibility'),
    jsonb_build_object('key', 'opportunity_detection_engine', 'label', 'Opportunity Detection Engine — workflow signals, process gaps, optimization candidates'),
    jsonb_build_object('key', 'improvement_initiative_center', 'label', 'Improvement Initiative Center — human-approved initiatives, stewardship tracking, launch gates'),
    jsonb_build_object('key', 'lessons_learned_repository', 'label', 'Lessons Learned Repository — approved lessons, retrospective summaries, knowledge reuse'),
    jsonb_build_object('key', 'optimization_impact_dashboard', 'label', 'Optimization Impact Dashboard — impact signals, outcome trends, metadata-only measurement'),
    jsonb_build_object('key', 'continuous_improvement_reviews', 'label', 'Continuous Improvement Reviews — periodic reflection, initiative effectiveness, stewardship loops'),
    jsonb_build_object('key', 'operations_action_executive_integration', 'label', 'Operations Center, Action Center & Executive Cockpit integration — cross-links only'),
    jsonb_build_object('key', 'improvement_knowledge_libraries', 'label', 'Improvement knowledge libraries — approved improvement resources')
  )); ${D};
create or replace function public._${bp}_opportunity_detection_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Opportunity detection prompts — humans steward improvement initiatives and approval.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'workflow_efficiency', 'label', 'Where can workflow efficiency improve without pressure?'),
    jsonb_build_object('key', 'process_refinement', 'label', 'Which processes need refinement with human stewardship?'),
    jsonb_build_object('key', 'operational_excellence', 'label', 'How is operational excellence strengthened sustainably?'),
    jsonb_build_object('key', 'lessons_integration', 'label', 'Are lessons learned integrated into future initiatives?'),
    jsonb_build_object('key', 'sustainable_optimization', 'label', 'Where does optimization remain sustainable and human-approved?')
  )); ${D};
create or replace function public._${bp}_improvement_initiative_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Improvement initiative center — human approval before launch.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'initiative_stewardship', 'label', 'Initiative stewardship'),
    jsonb_build_object('key', 'opportunity_signals', 'label', 'Opportunity signals'),
    jsonb_build_object('key', 'lessons_learned', 'label', 'Lessons learned'),
    jsonb_build_object('key', 'impact_measurement', 'label', 'Impact measurement'),
    jsonb_build_object('key', 'review_cadence', 'label', 'Review cadence'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates')
  )); ${D};
create or replace function public._${bp}_continuous_improvement_reviews() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Continuous improvement reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'active_opportunities', 'label', 'Active opportunities'),
    jsonb_build_object('key', 'pending_initiatives', 'label', 'Pending initiatives'),
    jsonb_build_object('key', 'lessons_integration', 'label', 'Lessons integration'),
    jsonb_build_object('key', 'optimization_readiness', 'label', 'Optimization readiness'),
    jsonb_build_object('key', 'initiative_approval_tracking', 'label', 'Initiative approval tracking')
  )); ${D};
create or replace function public._${bp}_improvement_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports improvement visibility, does not auto-prioritize initiatives or launch improvements without approval.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'opportunity_summaries', 'label', 'Opportunity summaries'),
    jsonb_build_object('key', 'review_reminders', 'label', 'Review reminders'),
    jsonb_build_object('key', 'optimization_insights', 'label', 'Optimization insights'),
    jsonb_build_object('key', 'improvement_prompts', 'label', 'Improvement prompts'),
    jsonb_build_object('key', 'impact_insights', 'label', 'Impact insights'),
    jsonb_build_object('key', 'approval_gate_reminders', 'label', 'Approval gate reminders — RBAC enforced')
  )); ${D};
create or replace function public._${bp}_lessons_learned_repository() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Lessons Learned Repository — approved retrospective scaffolds.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'approved_lessons', 'label', 'Approved lessons — metadata only'),
    jsonb_build_object('key', 'retrospective_summaries', 'label', 'Retrospective summary scaffolds'),
    jsonb_build_object('key', 'knowledge_reuse', 'label', 'Knowledge reuse prompts'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Improvement audit trails'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no raw operational PII'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for initiative launch')
  )); ${D};
create or replace function public._${bp}_optimization_impact_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Optimization Impact Dashboard — outcome trends, not auto-prioritization.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'impact_signals', 'label', 'Impact signals — aggregate only'),
    jsonb_build_object('key', 'outcome_trends', 'label', 'Outcome trend scaffolds'),
    jsonb_build_object('key', 'measurement_frameworks', 'label', 'Measurement frameworks'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Optimization audit trails'),
    jsonb_build_object('key', 'no_auto_prioritization', 'label', 'Never auto-prioritize initiatives'),
    jsonb_build_object('key', 'operations_orchestration_cross_link', 'label', 'Operations Orchestration Phase 208 cross-link', 'cross_link', '/app/aipify-operations-orchestration-engine')
  )); ${D};
create or replace function public._${bp}_operations_action_executive_integration() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Operations, Action & Executive integration — cross-links only, not duplicated RPCs.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'operations_orchestration', 'label', 'Operations Orchestration Phase 208', 'cross_link', '/app/aipify-operations-orchestration-engine'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center Phase 205', 'cross_link', '/app/aipify-action-center-execution-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'cross_link_only', 'label', 'Cross-link only — never duplicate engine RPCs'),
    jsonb_build_object('key', 'stewardship_loops', 'label', 'Stewardship improvement loops'),
    jsonb_build_object('key', 'no_auto_launch', 'label', 'Never launch initiatives without approval')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Auto-prioritization of initiatives',
      'Launching improvements without human approval',
      'Replacing human judgment',
      'Punitive optimization enforcement',
      'Raw operational PII in scaffolds',
      'Override human approval'), 'principle', '${P.companion} advises — humans steward initiatives and approval.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — clarity, patience, and service toward systematic improvement without pressure.', 'values', jsonb_build_array('reflection_before_reaction','stewardship_before_speed','human_approval_before_initiative_launch','patience','service','recognition'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Improvement audit logs via aipify_continuous_improvement_optimization_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_continuous_improvement_optimization permissions — initiative approval RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only improvement scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'operational_pii_protection', 'label', 'Operational PII protection — no raw records in scaffolds'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 211, 'key', 'continuous_improvement_optimization', 'label', 'Continuous Improvement Phase 211 — ERA OPENER', 'route', '/app/${P.slug}', 'description', 'Human-stewarded continuous improvement — operational excellence era opener')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'operations_orchestration', 'label', 'Operations Orchestration Phase 208', 'route', '/app/aipify-operations-orchestration-engine', 'relationship', 'Operations visibility — cross-link only'),
    jsonb_build_object('key', 'action_center_execution', 'label', 'Action Center Phase 205', 'route', '/app/aipify-action-center-execution-engine', 'relationship', 'Action tracking — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive briefing — cross-link only'),
    jsonb_build_object('key', 'operating_cadence', 'label', 'Operating Cadence Phase 210', 'route', '/app/aipify-organizational-rhythms-operating-cadence-engine', 'relationship', 'Prior era capstone — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Clarity and patience — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with metadata-only improvement scaffolds and human approval gates. Growth Partner terminology. ${P.companion} advises — never auto-prioritizes initiatives or launches improvements without approval.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans steward initiatives and approval.', '${P.companion} informs and suggests.', 'Reflection before reaction — stewardship before speed.', 'Growth Partner — never Affiliate.', 'Operational Excellence Era opener — Phase 211.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — opportunity summaries and impact signals max ~500 chars. No raw operational PII, unauthorized records, or unapproved initiative content in audit payloads.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`) && sql.includes(`'${P.prevDecision}'`)) return sql;
  const additions = [];
  for (const entry of [P.prevDecision, P.decisionType]) {
    if (!sql.includes(`'${entry}'`)) additions.push(`'${entry}'`);
  }
  if (additions.length === 0) return sql;
  return sql.replace(
    "'aipify_organizational_rhythms_operating_cadence_engine'",
    `'aipify_organizational_rhythms_operating_cadence_engine',\n    ${additions.filter((e) => e !== "'aipify_organizational_rhythms_operating_cadence_engine'").join(",\n    ")}`,
  );
}

function patchMigration(sql) {
  sql = sql.replace(
    /-- Phase \d+ —[^\n]+\n-- [^\n]+\n-- Helpers:[^\n]+/,
    `-- Phase ${P.phase} — ${P.title} Engine\n-- ${P.era} — OPENER.\n-- Helpers: _${P.helper}_* (engine), _${P.bp}_* (blueprint)`,
  );
  sql = patchDecisionTypeChain(sql);
  const start = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const end = sql.indexOf(`create or replace function public._${P.helper}_refresh_metrics`);
  if (start !== -1 && end !== -1) sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);

  const bp = P.bp;
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_improvement_dashboard\(\)->'capabilities'\) = 8,/,
    `jsonb_build_object('key', 'center', 'label', '${P.centerTitle} — eight capabilities', 'met', jsonb_array_length(public._${bp}_improvement_dashboard()->'capabilities') = 8,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_opportunity_detection_engine\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Opportunity detection engine — five questions', 'met', jsonb_array_length(public._${bp}_opportunity_detection_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'companion', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_improvement_companion\(\)->'capabilities'\) = 6,/,
    `jsonb_build_object('key', 'companion', 'label', '${P.companion} capabilities', 'met', jsonb_array_length(public._${bp}_improvement_companion()->'capabilities') = 6,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Operational Excellence Era Phase ${P.phase} documented — opener', 'met', jsonb_array_length(public._${bp}_era_opener_summary()) = 1,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'baseline', 'label', 'Repo Phase \d+ baseline tables'/,
    `jsonb_build_object('key', 'baseline', 'label', 'Repo Phase ${P.phase} baseline tables'`,
  );

  for (const fn of [
    "improvement_dashboard",
    "opportunity_detection_engine",
    "improvement_initiative_center",
    "continuous_improvement_reviews",
    "improvement_companion",
    "lessons_learned_repository",
    "optimization_impact_dashboard",
    "operations_action_executive_integration",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${bp}_${fn}()`);
  }

  if (!sql.includes("operations_action_executive_integration_meta")) {
    sql = sql.replace(
      `'sub_engine_meta', public._${bp}_lessons_learned_repository(),`,
      `'sub_engine_meta', public._${bp}_lessons_learned_repository(), 'optimization_impact_dashboard_meta', public._${bp}_optimization_impact_dashboard(), 'operations_action_executive_integration_meta', public._${bp}_operations_action_executive_integration(),`,
    );
  }

  sql = sql.replace(
    /select 'aipify-organizational-rhythms-operating-cadence-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', 211
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`Phase ${P.phase} Aipify[^']+`, "g"),
    `Phase ${P.phase} ${P.title} Engine — continuous improvement optimization within Operational Excellence era; cross-link only for operations center, action center, and executive cockpit.`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine (Operational Excellence Opener)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replace(
    /'title', 'Aipify Organizational Rhythms & Operating Cadence Engine'/g,
    `'title', '${P.title} Engine'`,
  );

  return sql;
}

function genMigration() {
  const src210 = path.join(ROOT, "supabase/migrations/20261370000000_aipify_organizational_rhythms_operating_cadence_engine_phase210.sql");
  if (!fs.existsSync(src210)) {
    throw new Error("Phase 210 migration required — ensure migration exists");
  }
  let m = transformFrom210(fs.readFileSync(src210, "utf8"));
  m = m.replace(/_aoroce_seed_cadence_notes/g, `_${P.helper}_seed_${P.thirdEntity.replace("_notes", "")}_notes`);
  m = m.replace(/_acioe_seed_cadence_notes/g, `_${P.helper}_seed_improvement_notes`);
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} advises and suggests — does NOT auto-prioritize initiatives or launch improvements without human approval.

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
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} advises; never auto-prioritizes initiatives.";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/${P.slug}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_COMPANION_LIMITATIONS = [\n${P.companionLimitations.map((l) => `  "${l}",`).join("\n")}\n] as const;\n`,
  );
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} surfaces opportunity signals and optimization insights. Advises humans — does NOT auto-prioritize initiatives or launch improvements without approval. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Improvement score",
    modeLabel: "Mode",
    readinessLabel: "Improvement maturity level",
    executiveReviews: "Continuous improvement reviews",
    activeReflections: "Active opportunity scaffolds",
    humanOversightRequired: `Human oversight required — humans steward initiatives and approval; ${P.companion} advises only`,
    eraOpenerSummary: `Operational Excellence Era — Phase ${P.phase}+`,
    eraOpenerNote: "Cross-link only — do not duplicate operations center, action center, or executive cockpit RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Opportunity detection engine — detection prompts",
    frameworkLabel: "Improvement initiative center",
    reviewsLabel: "Continuous improvement reviews",
    companionLabel: `${P.companion} — advises, does not auto-prioritize`,
    subEngineLabel: "Lessons Learned Repository",
    reflections: "Opportunity detection scaffolds",
    executiveReviewEntries: "Improvement review entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT auto-prioritize initiatives or launch improvements without approval`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports improvement visibility — humans retain initiative approval authority.`,
      philosophy: "People First. Metadata-only improvement scaffolds. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
      eraOpener: "Operational Excellence & Continuous Improvement Era (211+) — Phase 211 era opener.",
    },
  };
}

function patchNav() {
  let c = fs.readFileSync(path.join(ROOT, "lib/app/nav-config.ts"), "utf8");
  const id = P.camel;
  const href = `/app/${P.slug}`;
  if (!c.includes(`"${id}"`)) {
    c = c.replace('| "aipifyOrganizationalRhythmsOperatingCadenceEngine"', `| "aipifyOrganizationalRhythmsOperatingCadenceEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    c = c.replace(
      /id: "aipifyOrganizationalRhythmsOperatingCadenceEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyOrganizationalRhythmsOperatingCadenceEngine",\n  },/,
      (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-organizational-rhythms-operating-cadence-engine")) {\n    return "aipifyOrganizationalRhythmsOperatingCadenceEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-organizational-rhythms-operating-cadence-engine")) {\n    return "aipifyOrganizationalRhythmsOperatingCadenceEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
  console.log("patched nav-config");
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace(
        '"aipify_organizational_rhythms_operating_cadence.steward",',
        `"aipify_organizational_rhythms_operating_cadence.steward",\n    "${perm}",`,
      );
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
  console.log("patched permissions");
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-organizational-rhythms-operating-cadence-engine";',
      `export * from "./aipify-organizational-rhythms-operating-cadence-engine";\nexport * from "./${P.slug}";`,
    );
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
        ? "Kontinuerlig forbedring"
        : locale === "sv"
          ? "Kontinuerlig förbättring"
          : locale === "da"
            ? "Kontinuerlig forbedring"
            : P.navLabel;
    data[P.camel] = block;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchIlm() {
  let c = fs.readFileSync(path.join(ROOT, "lib/internal-language-model/index.ts"), "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase210-vocabulary";',
      `export * from "./implementation-blueprint-phase210-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  const corpus = `aipify-core/knowledge/internal-language-model/${P.ilmFile}`;
  if (!c.includes(corpus)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE210_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase210-aipify-organizational-rhythms-operating-cadence.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE210_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase210-aipify-organizational-rhythms-operating-cadence.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "${corpus}";`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/internal-language-model/index.ts"), c);
  console.log("patched ilm index");
}

function patchArchitecture() {
  let c = fs.readFileSync(path.join(ROOT, "ARCHITECTURE.md"), "utf8");
  const entry = `\n**Aipify Continuous Improvement & Optimization Engine (Phase 211):** See [AIPIFY_CONTINUOUS_IMPROVEMENT_OPTIMIZATION_ENGINE_PHASE211.md](./AIPIFY_CONTINUOUS_IMPROVEMENT_OPTIMIZATION_ENGINE_PHASE211.md) — ${P.centerTitle} for improvement dashboard, opportunity detection engine, improvement initiative center, lessons learned repository, optimization impact dashboard, continuous improvement reviews, and operations/action/executive integration. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} advises — **NOT** auto-prioritizing initiatives or launching improvements without approval. **Operational Excellence Era opener** (211+). Cross-links only: Phase 208 operations orchestration, Phase 205 action center, Phase 200 executive cockpit. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 211")) {
    const marker = "Permissions `aipify_organizational_rhythms_operating_cadence.steward`.";
    const idx = c.indexOf(marker);
    if (idx !== -1) {
      c = c.slice(0, idx + marker.length) + entry + c.slice(idx + marker.length);
    } else {
      c += entry;
    }
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
