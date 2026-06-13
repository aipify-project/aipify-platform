#!/usr/bin/env node
/** ABOS Phase 210 — Aipify Organizational Rhythms & Operating Cadence Engine (Era Capstone) */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const P = {
  phase: 210,
  migration: "20261370000000_aipify_organizational_rhythms_operating_cadence_engine_phase210.sql",
  slug: "aipify-organizational-rhythms-operating-cadence-engine",
  base: "AipifyOrganizationalRhythmsOperatingCadence",
  camel: "aipifyOrganizationalRhythmsOperatingCadenceEngine",
  snake: "aipify_organizational_rhythms_operating_cadence",
  permPrefix: "aipify_organizational_rhythms_operating_cadence",
  helper: "aoroce",
  bp: "aorocebp210",
  decisionType: "aipify_organizational_rhythms_operating_cadence_engine",
  prevDecision: "aipify_resource_capacity_workload_balance_engine",
  title: "Aipify Organizational Rhythms & Operating Cadence",
  centerTitle: "Operating Cadence Center",
  companion: "Cadence Companion",
  scoreKey: "aipify_organizational_rhythms_operating_cadence_score",
  modeKey: "operating_cadence_mode",
  levelKey: "cadence_discipline_level",
  thirdEntity: "cadence_notes",
  era: "Global Command & Enterprise Operations Era (201–210)",
  eraRange: "201–210",
  docSlug: "AIPIFY_ORGANIZATIONAL_RHYTHMS_OPERATING_CADENCE_ENGINE",
  ilmFile: "implementation-blueprint-phase210-aipify-organizational-rhythms-operating-cadence.txt",
  navLabel: "Operating Cadence",
  crossLinkNote:
    "Cross-links only: Phase 205 action center, Phase 207 decision center, Phase 200 executive cockpit, Phase 208 operations orchestration — never auto-schedule meetings, override leadership cadence, or expose sensitive executive schedules.",
  ilmExtra: `
Operating Cadence Center: organizational rhythm dashboard, leadership cadence center, team rhythm framework, strategic review scheduler, follow-up integrity monitor, organizational pulse calendar, action/decision/executive cockpit integration (cross-links), cadence knowledge libraries.
Cadence Reflection Engine prompts: organizational discipline, execution consistency, sustainable leadership, strategic alignment, reactive vs proactive management.
Cadence Framework: daily/weekly/monthly/quarterly/annual cycles, leadership cadence, team rhythms, strategic reviews, follow-up integrity, pulse calendar, enterprise scale.
Executive Cadence Reviews, Cadence Companion, Leadership Cadence Center, Strategic Review Scheduler, Follow-Up Integrity Monitor tracks.
Design principles: consistency before urgency, discipline before chaos, stewardship before short-term reactions.
Companion limitations: no auto-scheduling without approval, no overriding leadership cadence choices, no exposing sensitive executive schedules, no replacing human reflection, no punitive missed-review enforcement.
Era capstone: Global Command & Enterprise Operations Era (201–210) — Phase 210 closes the era with operating cadence stewardship.`,
  faqBody: `## What is Organizational Rhythms & Operating Cadence Engine?

Operating Cadence helps organizations maintain leadership rhythms, strategic reviews, and follow-up integrity with human stewardship — at \`/app/aipify-organizational-rhythms-operating-cadence-engine\`.

## Does the Cadence Companion schedule meetings automatically?

**No.** The Cadence Companion provides rhythm summaries, review reminders, and follow-up insights — it does NOT auto-schedule meetings without approval or override leadership cadence choices.

## What does the Operating Cadence Center show?

Upcoming reviews, completed cadences, leadership visibility, team rhythm frameworks, strategic review schedules, follow-up integrity signals, and pulse calendar overviews — metadata only.

## How does this relate to Action Center, Decision Center, and Executive Cockpit?

Cross-link only: Phase 205 action center (\`/app/aipify-action-center-execution-engine\`), Phase 207 decision center (\`/app/aipify-decision-center-governance-engine\`), Phase 200 executive cockpit (\`/app/aipify-executive-operating-system-founders-cockpit-engine\`), and Phase 208 operations orchestration. Never duplicate their RPCs.

## Why human reflection?

Humans retain leadership cadence authority. Aipify supports rhythm visibility and follow-up integrity — it does not replace human reflection or enforce punitive missed-review policies.`,
  companionLimitations: [
    "auto_scheduling_without_approval",
    "overriding_leadership_cadence_choices",
    "exposing_sensitive_executive_schedules",
    "replacing_human_reflection",
    "punitive_missed_review_enforcement",
    "replace_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom209(content) {
  const thirdPascal = P.thirdEntity.split("_").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
  const pairs = [
    ["AipifyResourceCapacityWorkloadBalance", P.base],
    ["aipify-resource-capacity-workload-balance-engine", P.slug],
    ["aipify_resource_capacity_workload_balance", P.snake],
    ["aipifyResourceCapacityWorkloadBalance", P.camel.replace(/Engine$/, "")],
    ["aipifyResourceCapacityWorkloadBalanceEngine", P.camel],
    ["arcwbebp209", P.bp],
    ["_arcwbe_", `_${P.helper}_`],
    ["aipify_resource_capacity_workload_balance_score", P.scoreKey],
    ["capacity_workload_mode", P.modeKey],
    ["capacity_balance_level", P.levelKey],
    ["planning_notes", P.thirdEntity],
    ["PlanningNote", thirdPascal],
    ["planning_notes_count", `${P.thirdEntity}_count`],
    ["Resource Capacity Center", P.centerTitle],
    ["Capacity Companion", P.companion],
    ["Aipify Resource Capacity & Workload Balance", P.title],
    ["Resource Capacity", P.navLabel],
    ["Phase 209", `Phase ${P.phase}`],
    ["aipify_resource_capacity_workload_balance_engine", P.decisionType],
    ["aipify_resource_capacity_workload_balance.view", `${P.permPrefix}.view`],
    ["aipify_resource_capacity_workload_balance.manage", `${P.permPrefix}.manage`],
    ["aipify_resource_capacity_workload_balance.steward", `${P.permPrefix}.steward`],
    ["20261369000000_aipify_resource_capacity_workload_balance_engine_phase209.sql", P.migration],
    ["Repo Phase 209", `Repo Phase ${P.phase}`],
    ["Phase 209 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE209_AIPIFY_RESOURCE_CAPACITY_WORKLOAD_BALANCE_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase209", `implementation-blueprint-phase${P.phase}`],
    ["capacity_dashboard", "organizational_rhythm_dashboard"],
    ["capacity_reflection_engine", "cadence_reflection_engine"],
    ["capacity_framework", "cadence_framework"],
    ["executive_capacity_reviews", "executive_cadence_reviews"],
    ["capacity_companion", "cadence_companion"],
    ["workload_balance_monitor", "leadership_cadence_center"],
    ["resource_planning_center", "team_rhythm_framework"],
    ["team_capacity_insights", "strategic_review_scheduler"],
    ["strategic_resource_overview", "follow_up_integrity_monitor"],
    ["capacity_review_scheduler", "organizational_pulse_calendar"],
    ["operations_action_center_integration", "action_decision_executive_cockpit_integration"],
    ["capacity_knowledge_libraries", "cadence_knowledge_libraries"],
    ["workload_balance_monitor_meta", "leadership_cadence_center_meta"],
    ["resource_planning_center_meta", "team_rhythm_framework_meta"],
    ["capacity_review_scheduler_meta", "organizational_pulse_calendar_meta"],
    ["Executive Capacity Reviews", "Executive Cadence Reviews"],
    ["resource capacity workload balance within", "organizational rhythms operating cadence within"],
    ["_seed_planning_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["surveil individual employees", "auto-schedule meetings without approval"],
    ["auto-reassign resources without approval", "override leadership cadence without approval"],
    ["Capacity Companion supports", "Cadence Companion supports"],
    ["never surveils individuals or auto-reassigns resources", "never auto-schedules meetings or overrides leadership cadence"],
    ["supports — does not surveil individuals or auto-reassign resources", "supports — does not auto-schedule meetings or override leadership cadence"],
    [
      "supports capacity planning insights, does not surveil individuals or auto-reassign resources",
      "supports rhythm visibility, does not auto-schedule meetings or override leadership cadence choices",
    ],
    ["capacity workload balance tracking", "operating cadence tracking"],
    ["Human-stewarded capacity planning", "Human-stewarded operating cadence"],
    ["stewardship_required", "reflection_required"],
    ["Capacity score", "Cadence score"],
    ["Capacity balance level", "Cadence discipline level"],
    ["Capacity reflection engine", "Cadence reflection engine"],
    ["Capacity framework", "Cadence framework"],
    ["Executive capacity reviews", "Executive cadence reviews"],
    ["Workload Balance Monitor", "Leadership Cadence Center"],
    ["Resource Planning Center", "Team Rhythm Framework"],
    ["Capacity Review Scheduler", "Organizational Pulse Calendar"],
    ["Capacity reflection scaffolds", "Cadence reflection scaffolds"],
    ["Capacity review entries", "Cadence review entries"],
    ["humans steward allocation decisions", "humans steward leadership cadence and reflection"],
    ["capacity trends, workload balance, and planning stewardship", "operating rhythms, strategic reviews, and follow-up integrity"],
    ["does NOT surveil individuals or auto-reassign resources", "does NOT auto-schedule meetings or override leadership cadence"],
    ["never surveils individual employees", "never auto-schedules meetings without approval"],
    ["employee_surveillance", "auto_scheduling_without_approval"],
    ["individual_performance_ranking", "overriding_leadership_cadence_choices"],
    ["punitive_workload_enforcement", "punitive_missed_review_enforcement"],
    ["expose_personal_data", "exposing_sensitive_executive_schedules"],
    ["override_leadership_allocation", "replacing_human_reflection"],
    ["auto_reassign_resources", "punitive_missed_review_enforcement"],
    ["AIPIFY_RESOURCE_CAPACITY_WORKLOAD_BALANCE_ENGINE", P.docSlug],
    ["overload_prevention", "organizational_discipline"],
    ["resource_utilization", "execution_consistency"],
    ["workload_sustainability", "sustainable_leadership"],
    ["capacity_planning", "strategic_alignment"],
    ["long_term_execution_quality", "proactive_vs_reactive_management"],
    ["capacity_trends", "daily_weekly_monthly_quarterly_annual_cycles"],
    ["workload_balance", "leadership_cadence"],
    ["resource_planning", "team_rhythms"],
    ["team_insights", "strategic_reviews"],
    ["strategic_overview", "follow_up_integrity"],
    ["review_cadence", "pulse_calendar"],
    ["capacity_concerns", "upcoming_cadences"],
    ["planning_readiness", "missed_reviews"],
    ["strategic_constraints", "follow_up_integrity"],
    ["review_schedule_adherence", "strategic_review_readiness"],
    ["trend_summaries", "rhythm_summaries"],
    ["planning_insights", "follow_up_insights"],
    ["review_reminders", "review_reminders"],
    ["stewardship_prompts", "cadence_prompts"],
    ["capacity_insights", "cadence_insights"],
    ["privacy_reminders", "schedule_protection_reminders"],
    ["sustainability_before_exhaustion", "consistency_before_urgency"],
    ["clarity_before_complexity", "discipline_before_chaos"],
    ["stewardship_before_short_term_optimization", "stewardship_before_short_term_reactions"],
    ["aipify_resource_capacity_workload_balance_audit_logs", "aipify_organizational_rhythms_operating_cadence_audit_logs"],
    ["aipify_resource_capacity_workload_balance permissions", "aipify_organizational_rhythms_operating_cadence permissions"],
    ["Aggregate-only capacity scaffolds", "Metadata-only cadence scaffolds"],
    ["Individual privacy protection", "Executive schedule protection"],
    ["resource capacity workload balance visibility", "organizational rhythms operating cadence visibility"],
    ["human stewardship gates", "human reflection gates"],
    ["sustainable capacity without pressure", "consistent cadence without pressure"],
    ["planning insights and review reminders", "rhythm summaries and follow-up insights"],
    ["auto-reassign resources", "auto-schedule meetings"],
    ["override leadership allocation", "override leadership cadence"],
    ["209", "210"],
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
  const src = path.join(ROOT, "lib/aipify/aipify-resource-capacity-workload-balance-engine");
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom209(fs.readFileSync(path.join(src, f), "utf8")));
  }
  const panel = path.join(
    ROOT,
    "components/app/aipify-resource-capacity-workload-balance-engine/AipifyResourceCapacityWorkloadBalanceEngineDashboardPanel.tsx",
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/${engine}DashboardPanel.tsx`),
    transformFrom209(fs.readFileSync(panel, "utf8")),
  );
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${engine}DashboardPanel } from "./${engine}DashboardPanel";\n`);
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom209(
      fs.readFileSync(path.join(ROOT, "app/app/aipify-resource-capacity-workload-balance-engine/page.tsx"), "utf8"),
    ),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom209(
        fs.readFileSync(path.join(ROOT, `app/api/aipify/aipify-resource-capacity-workload-balance-engine/${route}/route.ts`), "utf8"),
      ),
    );
  }
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle} (Era Capstone). ${P.companion} supports rhythm visibility — NOT auto-scheduling meetings or overriding leadership cadence. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Help organizations maintain leadership rhythms, strategic reviews, and follow-up integrity with human stewardship — Cadence Companion prepares, humans steward cadence and reflection.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Global Command Era (${P.eraRange}) — ERA CAPSTONE. Human-stewarded operating cadence; metadata-only scaffolds; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where operating rhythms are consistent, strategic reviews are honored, follow-up integrity is maintained, and humans retain cadence authority.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'cadence_reflection_engine', 'label', 'Cadence reflection engine', 'emoji', '🪞', 'description', 'Cadence reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Cadence framework', 'emoji', '🛡️', 'description', 'Seven cadence domains'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive cadence reviews', 'emoji', '👥', 'description', 'Cadence effectiveness reflection'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not auto-schedule'),
    jsonb_build_object('key', 'leadership_cadence_center', 'label', 'Leadership Cadence Center', 'emoji', '⚙️', 'description', 'Executive operating routine scaffolds'),
    jsonb_build_object('key', 'strategic_review_scheduler', 'label', 'Strategic Review Scheduler', 'emoji', '📖', 'description', 'Quarterly and annual review scaffolds'),
    jsonb_build_object('key', 'cadence_libraries', 'label', 'Cadence knowledge libraries', 'emoji', '🌱', 'description', 'Approved cadence resources')
  ); ${D};
create or replace function public._${bp}_organizational_rhythm_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities. Consistency before urgency.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'organizational_rhythm_dashboard', 'label', 'Organizational Rhythm Dashboard — upcoming reviews, completed cadences, leadership visibility'),
    jsonb_build_object('key', 'leadership_cadence_center', 'label', 'Leadership Cadence Center — executive operating routines, leadership commitments, proactive stewardship'),
    jsonb_build_object('key', 'team_rhythm_framework', 'label', 'Team Rhythm Framework — department operating schedules, planning/review rituals, flexibility'),
    jsonb_build_object('key', 'strategic_review_scheduler', 'label', 'Strategic Review Scheduler — quarterly business reviews, annual reflection, overdue strategic discussions'),
    jsonb_build_object('key', 'follow_up_integrity_monitor', 'label', 'Follow-Up Integrity Monitor — commitments from prior reviews, recurring gaps, execution discipline'),
    jsonb_build_object('key', 'organizational_pulse_calendar', 'label', 'Organizational Pulse Calendar — visual rhythm overview, scheduling conflicts, enterprise planning'),
    jsonb_build_object('key', 'action_decision_executive_cockpit_integration', 'label', 'Action Center, Decision Center & Executive Cockpit integration — cross-links only'),
    jsonb_build_object('key', 'cadence_knowledge_libraries', 'label', 'Cadence knowledge libraries — approved cadence resources')
  )); ${D};
create or replace function public._${bp}_cadence_reflection_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Cadence reflection prompts — humans steward leadership cadence and reflection.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'organizational_discipline', 'label', 'Is organizational discipline maintained across rhythms?'),
    jsonb_build_object('key', 'execution_consistency', 'label', 'Is execution consistency sustained across cadences?'),
    jsonb_build_object('key', 'sustainable_leadership', 'label', 'Is leadership sustainable across operating cycles?'),
    jsonb_build_object('key', 'strategic_alignment', 'label', 'Does strategic alignment hold across review cycles?'),
    jsonb_build_object('key', 'proactive_vs_reactive_management', 'label', 'Where does reactive management replace proactive stewardship?')
  )); ${D};
create or replace function public._${bp}_cadence_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Cadence framework — discipline before chaos.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'daily_weekly_monthly_quarterly_annual_cycles', 'label', 'Daily/weekly/monthly/quarterly/annual cycles'),
    jsonb_build_object('key', 'leadership_cadence', 'label', 'Leadership cadence'),
    jsonb_build_object('key', 'team_rhythms', 'label', 'Team rhythms'),
    jsonb_build_object('key', 'strategic_reviews', 'label', 'Strategic reviews'),
    jsonb_build_object('key', 'follow_up_integrity', 'label', 'Follow-up integrity'),
    jsonb_build_object('key', 'pulse_calendar', 'label', 'Pulse calendar'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); ${D};
create or replace function public._${bp}_executive_cadence_reviews() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive cadence reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'upcoming_cadences', 'label', 'Upcoming cadences'),
    jsonb_build_object('key', 'missed_reviews', 'label', 'Missed reviews'),
    jsonb_build_object('key', 'follow_up_integrity', 'label', 'Follow-up integrity'),
    jsonb_build_object('key', 'strategic_review_readiness', 'label', 'Strategic review readiness'),
    jsonb_build_object('key', 'leadership_commitment_tracking', 'label', 'Leadership commitment tracking')
  )); ${D};
create or replace function public._${bp}_cadence_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports rhythm visibility, does not auto-schedule meetings or override leadership cadence.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'rhythm_summaries', 'label', 'Rhythm summaries'),
    jsonb_build_object('key', 'review_reminders', 'label', 'Review reminders'),
    jsonb_build_object('key', 'follow_up_insights', 'label', 'Follow-up insights'),
    jsonb_build_object('key', 'cadence_prompts', 'label', 'Cadence prompts'),
    jsonb_build_object('key', 'cadence_insights', 'label', 'Cadence insights'),
    jsonb_build_object('key', 'schedule_protection_reminders', 'label', 'Schedule protection reminders — RBAC enforced')
  )); ${D};
create or replace function public._${bp}_leadership_cadence_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Leadership Cadence Center — executive operating routine scaffolds.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'executive_operating_routines', 'label', 'Executive operating routines — approved patterns'),
    jsonb_build_object('key', 'leadership_commitments', 'label', 'Leadership commitment scaffolds'),
    jsonb_build_object('key', 'proactive_stewardship', 'label', 'Proactive stewardship prompts'),
    jsonb_build_object('key', 'cadence_templates', 'label', 'Cadence templates'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no raw executive schedules'),
    jsonb_build_object('key', 'human_reflection_gates', 'label', 'Human reflection gates for cadence changes')
  )); ${D};
create or replace function public._${bp}_team_rhythm_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Team Rhythm Framework — department operating schedules with flexibility.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'department_schedules', 'label', 'Department operating schedules'),
    jsonb_build_object('key', 'planning_review_rituals', 'label', 'Planning and review rituals'),
    jsonb_build_object('key', 'flexibility_scaffolds', 'label', 'Flexibility scaffolds'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Cadence audit trails'),
    jsonb_build_object('key', 'no_override_leadership', 'label', 'Never override leadership cadence choices'),
    jsonb_build_object('key', 'operations_orchestration_cross_link', 'label', 'Operations Orchestration Phase 208 cross-link', 'cross_link', '/app/aipify-operations-orchestration-engine')
  )); ${D};
create or replace function public._${bp}_organizational_pulse_calendar() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Organizational Pulse Calendar — visual rhythm overview, not auto-scheduling.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'visual_rhythm_overview', 'label', 'Visual rhythm overview'),
    jsonb_build_object('key', 'scheduling_conflicts', 'label', 'Scheduling conflict signals — metadata only'),
    jsonb_build_object('key', 'enterprise_planning', 'label', 'Enterprise planning scaffolds'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds — RBAC protected'),
    jsonb_build_object('key', 'stewardship_loops', 'label', 'Stewardship improvement loops'),
    jsonb_build_object('key', 'no_auto_scheduling', 'label', 'Never auto-schedule meetings without approval')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Auto-scheduling without approval',
      'Overriding leadership cadence choices',
      'Exposing sensitive executive schedules to unauthorized roles',
      'Replacing human reflection',
      'Punitive missed-review enforcement',
      'Override human judgment'), 'principle', '${P.companion} supports — humans steward cadence and reflection.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — clarity, patience, and service toward consistent cadence without pressure.', 'values', jsonb_build_array('consistency_before_urgency','discipline_before_chaos','stewardship_before_short_term_reactions','patience','service','recognition'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Cadence audit logs via aipify_organizational_rhythms_operating_cadence_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_organizational_rhythms_operating_cadence permissions — review participation RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only cadence scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'executive_schedule_protection', 'label', 'Executive schedule protection — RBAC enforced'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 201, 'key', 'global_command_center', 'label', 'Global Command Center Phase 201', 'route', '/app/aipify-global-command-center-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 202, 'key', 'unified_workspace', 'label', 'Unified Workspace Phase 202', 'route', '/app/aipify-unified-workspace-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 203, 'key', 'digital_headquarters', 'label', 'Digital Headquarters Phase 203', 'route', '/app/aipify-digital-headquarters-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 204, 'key', 'knowledge_discovery', 'label', 'Knowledge Discovery Phase 204', 'route', '/app/aipify-knowledge-discovery-intelligent-search-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 205, 'key', 'action_center_execution', 'label', 'Action Center Phase 205', 'route', '/app/aipify-action-center-execution-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 206, 'key', 'meeting_intelligence', 'label', 'Meeting Intelligence Phase 206', 'route', '/app/aipify-meeting-intelligence-follow-up-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 207, 'key', 'decision_center_governance', 'label', 'Decision Center Phase 207', 'route', '/app/aipify-decision-center-governance-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 208, 'key', 'operations_orchestration', 'label', 'Operations Orchestration Phase 208', 'route', '/app/aipify-operations-orchestration-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 209, 'key', 'resource_capacity_workload_balance', 'label', 'Resource Capacity Phase 209', 'route', '/app/aipify-resource-capacity-workload-balance-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 210, 'key', 'organizational_rhythms_operating_cadence', 'label', 'Operating Cadence Phase 210 — ERA CAPSTONE', 'route', '/app/${P.slug}', 'description', 'Human-stewarded operating cadence — era capstone')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'action_center_execution', 'label', 'Action Center Phase 205', 'route', '/app/aipify-action-center-execution-engine', 'relationship', 'Action tracking — cross-link only'),
    jsonb_build_object('key', 'decision_center_governance', 'label', 'Decision Center Phase 207', 'route', '/app/aipify-decision-center-governance-engine', 'relationship', 'Decision governance — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive briefing — cross-link only'),
    jsonb_build_object('key', 'operations_orchestration', 'label', 'Operations Orchestration Phase 208', 'route', '/app/aipify-operations-orchestration-engine', 'relationship', 'Operations visibility — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Clarity and patience — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with metadata-only cadence scaffolds and human reflection gates. Growth Partner terminology. ${P.companion} supports — never auto-schedules meetings or overrides leadership cadence.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans steward cadence and reflection.', '${P.companion} informs and supports.', 'Consistency before urgency — discipline before chaos.', 'Growth Partner — never Affiliate.', 'Era capstone — Global Command & Enterprise Operations Era (201–210).'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — rhythm summaries and follow-up signals max ~500 chars. No sensitive executive schedules, PII, or unauthorized cadence content in audit payloads.'; ${D};
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
    "'aipify_resource_capacity_workload_balance_engine'",
    `'aipify_resource_capacity_workload_balance_engine',\n    ${additions.filter((e) => e !== "'aipify_resource_capacity_workload_balance_engine'").join(",\n    ")}`,
  );
}

function patchMigration(sql) {
  sql = sql.replace(
    /-- Phase \d+ —[^\n]+\n-- [^\n]+\n-- Helpers:[^\n]+/,
    `-- Phase ${P.phase} — ${P.title} Engine\n-- ${P.era} — ERA CAPSTONE.\n-- Helpers: _${P.helper}_* (engine), _${P.bp}_* (blueprint)`,
  );
  sql = patchDecisionTypeChain(sql);
  const start = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const end = sql.indexOf(`create or replace function public._${P.helper}_refresh_metrics`);
  if (start !== -1 && end !== -1) sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);

  const bp = P.bp;
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_organizational_rhythm_dashboard\(\)->'capabilities'\) = 8,/,
    `jsonb_build_object('key', 'center', 'label', '${P.centerTitle} — eight capabilities', 'met', jsonb_array_length(public._${bp}_organizational_rhythm_dashboard()->'capabilities') = 8,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_cadence_reflection_engine\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Cadence reflection engine — five questions', 'met', jsonb_array_length(public._${bp}_cadence_reflection_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'companion', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_cadence_companion\(\)->'capabilities'\) = 6,/,
    `jsonb_build_object('key', 'companion', 'label', '${P.companion} capabilities', 'met', jsonb_array_length(public._${bp}_cadence_companion()->'capabilities') = 6,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases 201–210 documented — capstone', 'met', jsonb_array_length(public._${bp}_era_opener_summary()) = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'baseline', 'label', 'Repo Phase \d+ baseline tables'/,
    `jsonb_build_object('key', 'baseline', 'label', 'Repo Phase ${P.phase} baseline tables'`,
  );

  for (const fn of [
    "organizational_rhythm_dashboard",
    "cadence_reflection_engine",
    "cadence_framework",
    "executive_cadence_reviews",
    "cadence_companion",
    "leadership_cadence_center",
    "team_rhythm_framework",
    "organizational_pulse_calendar",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${bp}_${fn}()`);
  }

  if (!sql.includes("organizational_pulse_calendar_meta")) {
    sql = sql.replace(
      `'sub_engine_meta', public._${bp}_leadership_cadence_center(),`,
      `'sub_engine_meta', public._${bp}_leadership_cadence_center(), 'team_rhythm_framework_meta', public._${bp}_team_rhythm_framework(), 'organizational_pulse_calendar_meta', public._${bp}_organizational_pulse_calendar(),`,
    );
  }

  sql = sql.replace(
    /select 'aipify-resource-capacity-workload-balance-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era} — ERA CAPSTONE. People First.', 'authenticated', 210
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`Phase ${P.phase} Aipify[^']+`, "g"),
    `Phase ${P.phase} ${P.title} Engine — organizational rhythms operating cadence within Global Command era capstone; cross-link only for action center, decision center, executive cockpit, and operations orchestration.`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine (Era Capstone)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replace(
    /'title', 'Aipify Resource Capacity & Workload Balance Engine'/g,
    `'title', '${P.title} Engine'`,
  );

  return sql;
}

function genMigration() {
  const src209 = path.join(ROOT, "supabase/migrations/20261369000000_aipify_resource_capacity_workload_balance_engine_phase209.sql");
  if (!fs.existsSync(src209)) {
    throw new Error("Phase 209 migration required — ensure migration exists");
  }
  let m = transformFrom209(fs.readFileSync(src209, "utf8"));
  m = m.replace(/_arcwbe_seed_planning_notes/g, `_${P.helper}_seed_${P.thirdEntity.replace("_notes", "")}_notes`);
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase} (Era Capstone)

## Vision

${P.centerTitle} within ${P.era} — **era capstone**. ${P.companion} supports rhythm visibility — does NOT auto-schedule meetings or override leadership cadence.

## Permissions

- \`${P.permPrefix}.view\` · \`${P.permPrefix}.manage\` · \`${P.permPrefix}.steward\`

## Helpers

- Engine: \`_${P.helper}_*\` · Blueprint: \`_${P.bp}_*\`

${P.crossLinkNote}
`,
  );
  write(
    path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
    `# Implementation Blueprint — Phase ${P.phase} ${P.title} Engine (Era Capstone)\n\nRoute: \`/app/${P.slug}\`\nEra: ${P.era} — **ERA CAPSTONE**\n${P.crossLinkNote}\n`,
  );
  write(
    path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
    `# ${P.title} Engine — FAQ (Phase ${P.phase})\n\n${P.faqBody}\n`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title} (Era Capstone)\nRoute: /app/${P.slug}\n${P.ilmExtra}\n${P.crossLinkNote}\nPeople First. Growth Partner — never Affiliate.\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never auto-schedules meetings.";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/${P.slug}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_COMPANION_LIMITATIONS = [\n${P.companionLimitations.map((l) => `  "${l}",`).join("\n")}\n] as const;\n`,
  );
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era} — Era Capstone. ${P.companion} supports rhythm summaries, review reminders, and follow-up insights. Supports humans — does NOT auto-schedule meetings or override leadership cadence. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase} — Era Capstone)`,
    scoreLabel: "Cadence score",
    modeLabel: "Mode",
    readinessLabel: "Cadence discipline level",
    executiveReviews: "Executive cadence reviews",
    activeReflections: "Active reflections",
    humanOversightRequired: `Human oversight required — humans steward cadence and reflection; ${P.companion} supports only`,
    eraOpenerSummary: `Global Command Era — Phases ${P.eraRange} (Era Capstone)`,
    eraOpenerNote: "Cross-link only — do not duplicate action center, decision center, or executive cockpit RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Cadence reflection engine — reflection prompts",
    frameworkLabel: "Cadence framework",
    reviewsLabel: "Executive cadence reviews",
    companionLabel: `${P.companion} — supports, does not auto-schedule`,
    subEngineLabel: "Leadership Cadence Center",
    reflections: "Cadence reflection scaffolds",
    executiveReviewEntries: "Cadence review entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase} — Era Capstone)`,
    companionLimitations: `${P.companion} limitations — does NOT auto-schedule meetings or override leadership cadence`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports rhythm visibility — humans retain cadence authority for leadership rhythms.`,
      philosophy: "People First. Metadata-only cadence scaffolds. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
      eraCapstone: "Global Command & Enterprise Operations Era (201–210) — Phase 210 era capstone.",
    },
  };
}

function patchNav() {
  let c = fs.readFileSync(path.join(ROOT, "lib/app/nav-config.ts"), "utf8");
  const id = P.camel;
  const href = `/app/${P.slug}`;
  if (!c.includes(`"${id}"`)) {
    c = c.replace('| "aipifyResourceCapacityWorkloadBalanceEngine"', `| "aipifyResourceCapacityWorkloadBalanceEngine"\n  | "${id}"`);
    if (!c.includes(`"${id}"`)) {
      c = c.replace('| "aipifyDecisionCenterGovernanceEngine"', `| "aipifyDecisionCenterGovernanceEngine"\n  | "${id}"`);
    }
  }
  if (!c.includes(href)) {
    const anchor = c.includes('id: "aipifyResourceCapacityWorkloadBalanceEngine"')
      ? /id: "aipifyResourceCapacityWorkloadBalanceEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyResourceCapacityWorkloadBalanceEngine",\n  },/
      : /id: "aipifyDecisionCenterGovernanceEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyDecisionCenterGovernanceEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    const anchorPath = c.includes('pathname.startsWith("/app/aipify-resource-capacity-workload-balance-engine")')
      ? 'if (pathname.startsWith("/app/aipify-resource-capacity-workload-balance-engine")) {\n    return "aipifyResourceCapacityWorkloadBalanceEngine";\n  }'
      : 'if (pathname.startsWith("/app/aipify-decision-center-governance-engine")) {\n    return "aipifyDecisionCenterGovernanceEngine";\n  }';
    c = c.replace(
      anchorPath,
      `${anchorPath}\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
  console.log("patched nav-config");
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      const anchor = c.includes('"aipify_resource_capacity_workload_balance.steward"')
        ? '"aipify_resource_capacity_workload_balance.steward",'
        : '"aipify_operations_orchestration.steward",';
      c = c.replace(anchor, `${anchor}\n    "${perm}",`);
    }
  }
  if (!c.includes('"aipify_resource_capacity_workload_balance.view"')) {
    for (const perm of [
      "aipify_resource_capacity_workload_balance.view",
      "aipify_resource_capacity_workload_balance.manage",
      "aipify_resource_capacity_workload_balance.steward",
    ]) {
      if (!c.includes(`"${perm}"`)) {
        c = c.replace('"aipify_operations_orchestration.steward",', `"aipify_operations_orchestration.steward",\n    "${perm}",`);
      }
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
  console.log("patched permissions");
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  for (const slug of ["aipify-resource-capacity-workload-balance-engine", P.slug]) {
    if (!c.includes(`./${slug}`)) {
      const anchor = c.includes('export * from "./aipify-resource-capacity-workload-balance-engine";')
        ? 'export * from "./aipify-resource-capacity-workload-balance-engine";'
        : 'export * from "./aipify-operations-orchestration-engine";';
      if (!c.includes(`./${slug}`)) {
        c = c.replace(anchor, `${anchor}\nexport * from "./${slug}";`);
      }
    }
  }
  if (!c.includes("./aipify-resource-capacity-workload-balance-engine")) {
    c = c.replace(
      'export * from "./aipify-operations-orchestration-engine";',
      'export * from "./aipify-operations-orchestration-engine";\nexport * from "./aipify-resource-capacity-workload-balance-engine";',
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
        ? "Operasjonskadens"
        : locale === "sv"
          ? "Operativ kadens"
          : locale === "da"
            ? "Driftstakt"
            : P.navLabel;
    data[P.camel] = block;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchIlm() {
  let c = fs.readFileSync(path.join(ROOT, "lib/internal-language-model/index.ts"), "utf8");
  if (!c.includes("phase207-vocabulary")) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase206-vocabulary";',
      'export * from "./implementation-blueprint-phase206-vocabulary";\nexport * from "./implementation-blueprint-phase207-vocabulary";',
    );
  }
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase209-vocabulary";',
      `export * from "./implementation-blueprint-phase209-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  const corpus207 =
    "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase207-aipify-decision-center-governance.txt";
  if (!c.includes(corpus207)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE206_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase206-aipify-meeting-intelligence-follow-up.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE206_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase206-aipify-meeting-intelligence-follow-up.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE207_CORPUS =\n  "${corpus207}";`,
    );
  }
  const corpus = `aipify-core/knowledge/internal-language-model/${P.ilmFile}`;
  if (!c.includes(corpus)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE209_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase209-aipify-resource-capacity-workload-balance.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE209_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase209-aipify-resource-capacity-workload-balance.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "${corpus}";`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/internal-language-model/index.ts"), c);
  console.log("patched ilm index");
}

function patchArchitecture() {
  let c = fs.readFileSync(path.join(ROOT, "ARCHITECTURE.md"), "utf8");
  const entry = `\n**Aipify Organizational Rhythms & Operating Cadence Engine (Phase 210 — Era Capstone):** See [AIPIFY_ORGANIZATIONAL_RHYTHMS_OPERATING_CADENCE_ENGINE_PHASE210.md](./AIPIFY_ORGANIZATIONAL_RHYTHMS_OPERATING_CADENCE_ENGINE_PHASE210.md) — ${P.centerTitle} for organizational rhythm dashboard, leadership cadence center, team rhythm framework, strategic review scheduler, follow-up integrity monitor, organizational pulse calendar, action/decision/executive cockpit integration, and cadence knowledge libraries. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** auto-scheduling meetings or overriding leadership cadence. **Era capstone** for Global Command & Enterprise Operations Era (201–210). Cross-links only: Phase 205 action center, Phase 207 decision center, Phase 200 executive cockpit, Phase 208 operations orchestration. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 210")) {
    const marker = c.includes("Permissions `aipify_resource_capacity_workload_balance.steward`.")
      ? "Permissions `aipify_resource_capacity_workload_balance.steward`."
      : "Permissions `aipify_operations_orchestration.steward`.";
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

function patch209Nav() {
  let c = fs.readFileSync(path.join(ROOT, "lib/app/nav-config.ts"), "utf8");
  const id = "aipifyResourceCapacityWorkloadBalanceEngine";
  const href = "/app/aipify-resource-capacity-workload-balance-engine";
  if (!c.includes(`"${id}"`)) {
    c = c.replace('| "aipifyDecisionCenterGovernanceEngine"', `| "aipifyDecisionCenterGovernanceEngine"\n  | "${id}"`);
  }
  if (!c.includes(`id: "${id}"`)) {
    c = c.replace(
      /id: "aipifyDecisionCenterGovernanceEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyDecisionCenterGovernanceEngine",\n  },/,
      (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-decision-center-governance-engine")) {\n    return "aipifyDecisionCenterGovernanceEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-decision-center-governance-engine")) {\n    return "aipifyDecisionCenterGovernanceEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
  console.log("patched phase 209 nav");
}

patch209Nav();
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
