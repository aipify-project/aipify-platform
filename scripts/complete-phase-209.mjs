#!/usr/bin/env node
/** ABOS Phase 209 — Aipify Resource Capacity & Workload Balance Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const P = {
  phase: 209,
  migration: "20261369000000_aipify_resource_capacity_workload_balance_engine_phase209.sql",
  slug: "aipify-resource-capacity-workload-balance-engine",
  base: "AipifyResourceCapacityWorkloadBalance",
  camel: "aipifyResourceCapacityWorkloadBalanceEngine",
  snake: "aipify_resource_capacity_workload_balance",
  permPrefix: "aipify_resource_capacity_workload_balance",
  helper: "arcwbe",
  bp: "arcwbebp209",
  decisionType: "aipify_resource_capacity_workload_balance_engine",
  prevDecision: "aipify_operations_orchestration_engine",
  title: "Aipify Resource Capacity & Workload Balance",
  centerTitle: "Resource Capacity Center",
  companion: "Capacity Companion",
  scoreKey: "aipify_resource_capacity_workload_balance_score",
  modeKey: "capacity_workload_mode",
  levelKey: "capacity_balance_level",
  thirdEntity: "planning_notes",
  era: "Global Command & Enterprise Operations Era (201–210)",
  eraRange: "201–210",
  docSlug: "AIPIFY_RESOURCE_CAPACITY_WORKLOAD_BALANCE_ENGINE",
  ilmFile: "implementation-blueprint-phase209-aipify-resource-capacity-workload-balance.txt",
  navLabel: "Resource Capacity",
  crossLinkNote:
    "Cross-links only: Phase 208 operations orchestration, Phase 205 action center, Phase 198 organizational health — never surveil individuals, auto-reassign resources, or override leadership allocation decisions.",
  ilmExtra: `
Resource Capacity Center: capacity dashboard, workload balance monitor, resource planning center, team capacity insights, strategic resource overview, capacity review scheduler, operations/action center integration, capacity knowledge libraries.
Capacity Reflection Engine prompts: Is overload prevented proactively? Is resource utilization sustainable? Is workload balance maintained? Does capacity planning support long-term execution? Where can stewardship improve outcomes?
Capacity Framework: capacity trends, workload balance, resource planning, team insights, strategic overview, review cadence, enterprise scale.
Executive Capacity Reviews, Capacity Companion, Workload Balance Monitor, Resource Planning Center, Capacity Review Scheduler tracks.
Design principles: sustainability before exhaustion, clarity before complexity, stewardship before short-term optimization.
Companion limitations: no employee surveillance, no individual performance ranking, no punitive workload enforcement, no exposing personal data, no overriding leadership allocation decisions, no auto-reassigning resources.
Privacy critical: aggregate team/unit trends only — never individual monitoring.`,
  faqBody: `## What is Resource Capacity & Workload Balance Engine?

Resource Capacity helps organizations understand capacity trends, workload balance, and planning readiness with human oversight — at \`/app/aipify-resource-capacity-workload-balance-engine\`.

## Does this surveil individual employees?

**No.** The Capacity Companion provides aggregate team/unit trend summaries only. No employee surveillance, individual performance ranking, or punitive workload enforcement.

## What does the Resource Capacity Center show?

Capacity trends, workload balance signals, planning readiness, team-level insights, strategic constraints, and review cadence — aggregate metadata only.

## How does this relate to Operations Orchestration and Action Center?

Cross-link only: Phase 208 operations orchestration (\`/app/aipify-operations-orchestration-engine\`), Phase 205 action center, and Phase 198 organizational health. Never duplicate their RPCs.

## Why human stewardship?

Humans make allocation decisions. Aipify provides planning insights and review reminders — it does not auto-reassign resources or override leadership allocation decisions.`,
  companionLimitations: [
    "employee_surveillance",
    "individual_performance_ranking",
    "punitive_workload_enforcement",
    "expose_personal_data",
    "override_leadership_allocation",
    "auto_reassign_resources",
    "replace_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom208(content) {
  const thirdPascal = P.thirdEntity.split("_").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
  const pairs = [
    ["AipifyOperationsOrchestration", P.base],
    ["aipify-operations-orchestration-engine", P.slug],
    ["aipify_operations_orchestration", P.snake],
    ["aipifyOperationsOrchestration", P.camel.replace(/Engine$/, "")],
    ["aipifyOperationsOrchestrationEngine", P.camel],
    ["aooebp208", P.bp],
    ["_aooe_", `_${P.helper}_`],
    ["aipify_operations_orchestration_score", P.scoreKey],
    ["operations_orchestration_mode", P.modeKey],
    ["operational_coordination_level", P.levelKey],
    ["coordination_notes", P.thirdEntity],
    ["CoordinationNote", thirdPascal],
    ["coordination_notes_count", `${P.thirdEntity}_count`],
    ["Operations Command Dashboard", P.centerTitle],
    ["Operations Companion", P.companion],
    ["Aipify Operations Orchestration", P.title],
    ["Operations Orchestration", P.navLabel],
    ["Phase 208", `Phase ${P.phase}`],
    ["aipify_operations_orchestration_engine", P.decisionType],
    ["aipify_operations_orchestration.view", `${P.permPrefix}.view`],
    ["aipify_operations_orchestration.manage", `${P.permPrefix}.manage`],
    ["aipify_operations_orchestration.steward", `${P.permPrefix}.steward`],
    ["20261368000000_aipify_operations_orchestration_engine_phase208.sql", P.migration],
    ["Repo Phase 208", `Repo Phase ${P.phase}`],
    ["Phase 208 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE208_AIPIFY_OPERATIONS_ORCHESTRATION_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase208", `implementation-blueprint-phase${P.phase}`],
    ["operations_command_dashboard", "capacity_dashboard"],
    ["operations_reflection_engine", "capacity_reflection_engine"],
    ["operations_framework", "capacity_framework"],
    ["executive_operations_reviews", "executive_capacity_reviews"],
    ["operations_companion", "capacity_companion"],
    ["workflow_visibility_center", "workload_balance_monitor"],
    ["dependency_management_engine", "resource_planning_center"],
    ["escalation_management_framework", "team_capacity_insights"],
    ["initiative_tracking_center", "strategic_resource_overview"],
    ["operational_health_monitor", "capacity_review_scheduler"],
    ["action_decision_center_integration", "operations_action_center_integration"],
    ["operations_knowledge_libraries", "capacity_knowledge_libraries"],
    ["workflow_visibility_center_meta", "workload_balance_monitor_meta"],
    ["dependency_management_engine_meta", "resource_planning_center_meta"],
    ["operational_health_monitor_meta", "capacity_review_scheduler_meta"],
    ["Executive Operations Reviews", "Executive Capacity Reviews"],
    ["operations orchestration within", "resource capacity workload balance within"],
    ["_seed_coordination_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["auto-execute operational workflows", "surveil individual employees"],
    ["override escalation governance without approval", "auto-reassign resources without approval"],
    ["Operations Companion supports", "Capacity Companion supports"],
    ["never auto-executes workflows or overrides escalation governance", "never surveils individuals or auto-reassigns resources"],
    ["supports — does not auto-execute operational changes", "supports — does not surveil individuals or auto-reassign resources"],
    [
      "supports operational visibility, does not auto-execute workflows or override escalation governance",
      "supports capacity planning insights, does not surveil individuals or auto-reassign resources",
    ],
    ["operational coordination tracking", "capacity workload balance tracking"],
    ["Human-coordinated operations", "Human-stewarded capacity planning"],
    ["coordination_required", "stewardship_required"],
    ["Operations score", "Capacity score"],
    ["Operational coordination level", "Capacity balance level"],
    ["Operations reflection engine", "Capacity reflection engine"],
    ["Operations framework", "Capacity framework"],
    ["Executive operations reviews", "Executive capacity reviews"],
    ["Workflow Visibility Center", "Workload Balance Monitor"],
    ["Dependency Management Engine", "Resource Planning Center"],
    ["Operational Health Monitor", "Capacity Review Scheduler"],
    ["Operations reflection scaffolds", "Capacity reflection scaffolds"],
    ["Operations review entries", "Capacity review entries"],
    ["humans coordinate operational decisions", "humans steward capacity allocation decisions"],
    ["workflow visibility, dependencies, and escalation governance", "capacity trends, workload balance, and planning stewardship"],
    ["does NOT auto-execute workflows or override escalation governance", "does NOT surveil individuals or auto-reassign resources"],
    ["never auto-executes operational workflows", "never surveils individual employees"],
    ["auto_execute_workflows", "employee_surveillance"],
    ["override_escalation_governance", "individual_performance_ranking"],
    ["expose_sensitive_operational_data", "punitive_workload_enforcement"],
    ["replace_human_coordination", "expose_personal_data"],
    ["bypass_rbac", "override_leadership_allocation"],
    ["duplicate_aef_rpcs", "auto_reassign_resources"],
    ["AIPIFY_OPERATIONS_ORCHESTRATION_ENGINE", P.docSlug],
    ["operational_coordination", "overload_prevention"],
    ["process_fragmentation", "resource_utilization"],
    ["execution_consistency", "workload_sustainability"],
    ["cross_functional_visibility", "capacity_planning"],
    ["proactive_leadership", "long_term_execution_quality"],
    ["workflow_visibility", "capacity_trends"],
    ["dependencies", "workload_balance"],
    ["escalations", "resource_planning"],
    ["initiative_tracking", "team_insights"],
    ["operational_health", "strategic_overview"],
    ["integration_actions_decisions", "review_cadence"],
    ["command_dashboard_health", "capacity_concerns"],
    ["workflow_stalls", "workload_balance"],
    ["dependency_risks", "planning_readiness"],
    ["escalation_effectiveness", "strategic_constraints"],
    ["initiative_delivery", "review_schedule_adherence"],
    ["workflow_summaries", "trend_summaries"],
    ["dependency_alerts", "planning_insights"],
    ["escalation_guidance", "review_reminders"],
    ["coordination_prompts", "stewardship_prompts"],
    ["operational_insights", "capacity_insights"],
    ["visibility_before_assumptions", "sustainability_before_exhaustion"],
    ["coordination_before_chaos", "clarity_before_complexity"],
    ["simplicity_before_complexity", "stewardship_before_short_term_optimization"],
    ["aipify_operations_orchestration_audit_logs", "aipify_resource_capacity_workload_balance_audit_logs"],
    ["aipify_operations_orchestration permissions", "aipify_resource_capacity_workload_balance permissions"],
    ["Metadata-only operations scaffolds", "Aggregate-only capacity scaffolds"],
    ["Sensitive workflow protection", "Individual privacy protection"],
    ["operations orchestration visibility", "resource capacity workload balance visibility"],
    ["human coordination gates", "human stewardship gates"],
    ["coordinated operations without pressure", "sustainable capacity without pressure"],
    ["visibility and guidance", "planning insights and review reminders"],
    ["replace human coordination", "auto-reassign resources"],
    ["bypass RBAC", "override leadership allocation"],
    ["208", "209"],
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
  const src = path.join(ROOT, "lib/aipify/aipify-operations-orchestration-engine");
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom208(fs.readFileSync(path.join(src, f), "utf8")));
  }
  const panel = path.join(
    ROOT,
    "components/app/aipify-operations-orchestration-engine/AipifyOperationsOrchestrationEngineDashboardPanel.tsx",
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/${engine}DashboardPanel.tsx`),
    transformFrom208(fs.readFileSync(panel, "utf8")),
  );
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${engine}DashboardPanel } from "./${engine}DashboardPanel";\n`);
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom208(
      fs.readFileSync(path.join(ROOT, "app/app/aipify-operations-orchestration-engine/page.tsx"), "utf8"),
    ),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom208(
        fs.readFileSync(path.join(ROOT, `app/api/aipify/aipify-operations-orchestration-engine/${route}/route.ts`), "utf8"),
      ),
    );
  }
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports capacity planning — NOT employee surveillance or auto-reassigning resources. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Help organizations understand capacity trends, workload balance, and planning readiness with human stewardship — Capacity Companion prepares, humans steward allocation decisions.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Global Command Era (${P.eraRange}). Human-stewarded capacity planning; aggregate-only scaffolds; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where capacity is sustainable, workload is balanced, planning is proactive, and humans retain allocation authority.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'capacity_reflection_engine', 'label', 'Capacity reflection engine', 'emoji', '🪞', 'description', 'Capacity reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Capacity framework', 'emoji', '🛡️', 'description', 'Seven capacity domains'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive capacity reviews', 'emoji', '👥', 'description', 'Capacity effectiveness reflection'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not surveil'),
    jsonb_build_object('key', 'workload_balance_monitor', 'label', 'Workload Balance Monitor', 'emoji', '⚙️', 'description', 'Aggregate workload balance scaffolds'),
    jsonb_build_object('key', 'resource_planning_center', 'label', 'Resource Planning Center', 'emoji', '📖', 'description', 'Future planning scaffolds'),
    jsonb_build_object('key', 'capacity_libraries', 'label', 'Capacity knowledge libraries', 'emoji', '🌱', 'description', 'Approved capacity resources')
  ); ${D};
create or replace function public._${bp}_capacity_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities. Sustainability before exhaustion.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'capacity_dashboard', 'label', 'Capacity Dashboard — resource capacity trends, areas of concern, proactive planning'),
    jsonb_build_object('key', 'workload_balance_monitor', 'label', 'Workload Balance Monitor — uneven distributions, burnout risk signals (aggregate only), rebalancing opportunities'),
    jsonb_build_object('key', 'resource_planning_center', 'label', 'Resource Planning Center — future planning, upcoming demands, responsible allocation'),
    jsonb_build_object('key', 'team_capacity_insights', 'label', 'Team Capacity Insights — manager operational awareness, team-level trends'),
    jsonb_build_object('key', 'strategic_resource_overview', 'label', 'Strategic Resource Overview — executive planning, org-wide constraints, strategic risks'),
    jsonb_build_object('key', 'capacity_review_scheduler', 'label', 'Capacity Review Scheduler — regular workload assessments, quarterly cycles'),
    jsonb_build_object('key', 'operations_action_center_integration', 'label', 'Operations Orchestration & Action Center integration — cross-links only'),
    jsonb_build_object('key', 'capacity_knowledge_libraries', 'label', 'Capacity knowledge libraries — approved capacity resources')
  )); ${D};
create or replace function public._${bp}_capacity_reflection_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Capacity reflection prompts — humans steward allocation decisions.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'overload_prevention', 'label', 'Is overload prevented proactively?'),
    jsonb_build_object('key', 'resource_utilization', 'label', 'Is resource utilization sustainable?'),
    jsonb_build_object('key', 'workload_sustainability', 'label', 'Is workload balance maintained?'),
    jsonb_build_object('key', 'capacity_planning', 'label', 'Does capacity planning support long-term execution?'),
    jsonb_build_object('key', 'long_term_execution_quality', 'label', 'Where can stewardship improve outcomes?')
  )); ${D};
create or replace function public._${bp}_capacity_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Capacity framework — clarity before complexity.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'capacity_trends', 'label', 'Capacity trends'),
    jsonb_build_object('key', 'workload_balance', 'label', 'Workload balance'),
    jsonb_build_object('key', 'resource_planning', 'label', 'Resource planning'),
    jsonb_build_object('key', 'team_insights', 'label', 'Team insights'),
    jsonb_build_object('key', 'strategic_overview', 'label', 'Strategic overview'),
    jsonb_build_object('key', 'review_cadence', 'label', 'Review cadence'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); ${D};
create or replace function public._${bp}_executive_capacity_reviews() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive capacity reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'capacity_concerns', 'label', 'Capacity concerns'),
    jsonb_build_object('key', 'workload_balance', 'label', 'Workload balance'),
    jsonb_build_object('key', 'planning_readiness', 'label', 'Planning readiness'),
    jsonb_build_object('key', 'strategic_constraints', 'label', 'Strategic constraints'),
    jsonb_build_object('key', 'review_schedule_adherence', 'label', 'Review schedule adherence')
  )); ${D};
create or replace function public._${bp}_capacity_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports planning, does not surveil individuals or auto-reassign resources.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'trend_summaries', 'label', 'Trend summaries'),
    jsonb_build_object('key', 'planning_insights', 'label', 'Planning insights'),
    jsonb_build_object('key', 'review_reminders', 'label', 'Review reminders'),
    jsonb_build_object('key', 'stewardship_prompts', 'label', 'Stewardship prompts'),
    jsonb_build_object('key', 'capacity_insights', 'label', 'Capacity insights'),
    jsonb_build_object('key', 'privacy_reminders', 'label', 'Privacy reminders — aggregate only')
  )); ${D};
create or replace function public._${bp}_workload_balance_monitor() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Workload Balance Monitor — aggregate team/unit trends only.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'uneven_distribution_signals', 'label', 'Uneven distribution signals — aggregate metadata'),
    jsonb_build_object('key', 'burnout_risk_signals', 'label', 'Burnout risk signals — aggregate only, never individual'),
    jsonb_build_object('key', 'rebalancing_opportunities', 'label', 'Rebalancing opportunities scaffolds'),
    jsonb_build_object('key', 'team_unit_trends', 'label', 'Team/unit trend summaries'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no personal data'),
    jsonb_build_object('key', 'human_stewardship_gates', 'label', 'Human stewardship gates for allocation changes')
  )); ${D};
create or replace function public._${bp}_resource_planning_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Resource Planning Center — responsible allocation stewardship enforced.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'future_planning', 'label', 'Future planning scaffolds'),
    jsonb_build_object('key', 'upcoming_demands', 'label', 'Upcoming demand signals — metadata only'),
    jsonb_build_object('key', 'responsible_allocation', 'label', 'Responsible allocation scaffolds'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Planning audit trails'),
    jsonb_build_object('key', 'no_auto_reassign', 'label', 'Never auto-reassign resources'),
    jsonb_build_object('key', 'organizational_health_cross_link', 'label', 'Organizational Health Phase 198 cross-link', 'cross_link', '/app/aipify-organizational-health-early-warning-engine')
  )); ${D};
create or replace function public._${bp}_capacity_review_scheduler() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Capacity Review Scheduler — aggregate metadata, not individual surveillance.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'quarterly_cycles', 'label', 'Quarterly review cycles'),
    jsonb_build_object('key', 'workload_assessments', 'label', 'Workload assessment scaffolds — aggregate'),
    jsonb_build_object('key', 'review_benchmarks', 'label', 'Review benchmarks — metadata only'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds'),
    jsonb_build_object('key', 'stewardship_loops', 'label', 'Stewardship improvement loops'),
    jsonb_build_object('key', 'no_individual_surveillance', 'label', 'Never surveil individual employees')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Employee surveillance',
      'Individual performance ranking',
      'Punitive workload enforcement',
      'Exposing personal data',
      'Overriding leadership allocation decisions',
      'Auto-reassigning resources',
      'Override human judgment'), 'principle', '${P.companion} supports — humans steward allocation decisions.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — clarity, patience, and service toward sustainable capacity without pressure.', 'values', jsonb_build_array('sustainability_before_exhaustion','clarity_before_complexity','stewardship_before_short_term_optimization','patience','service','recognition'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Capacity audit logs via aipify_resource_capacity_workload_balance_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_resource_capacity_workload_balance permissions'),
    jsonb_build_object('key', 'aggregate_only', 'label', 'Aggregate-only capacity scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'individual_privacy_protection', 'label', 'Individual privacy protection — RBAC enforced'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 205, 'key', 'action_center_execution', 'label', 'Action Center Phase 205', 'route', '/app/aipify-action-center-execution-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 208, 'key', 'operations_orchestration', 'label', 'Operations Orchestration Phase 208', 'route', '/app/aipify-operations-orchestration-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 198, 'key', 'organizational_health', 'label', 'Organizational Health Phase 198', 'route', '/app/aipify-organizational-health-early-warning-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 209, 'key', 'resource_capacity_workload_balance', 'label', 'Resource Capacity Phase 209', 'route', '/app/${P.slug}', 'description', 'Human-stewarded capacity planning')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'operations_orchestration', 'label', 'Operations Orchestration Phase 208', 'route', '/app/aipify-operations-orchestration-engine', 'relationship', 'Operations visibility — cross-link only'),
    jsonb_build_object('key', 'action_center_execution', 'label', 'Action Center Phase 205', 'route', '/app/aipify-action-center-execution-engine', 'relationship', 'Action tracking — cross-link only'),
    jsonb_build_object('key', 'organizational_health', 'label', 'Organizational Health Phase 198', 'route', '/app/aipify-organizational-health-early-warning-engine', 'relationship', 'Early warning signals — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Clarity and patience — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with aggregate-only capacity scaffolds and human stewardship gates. Growth Partner terminology. ${P.companion} supports — never surveils individuals or auto-reassigns resources.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans steward allocation decisions.', '${P.companion} informs and supports.', 'Sustainability before exhaustion — clarity before complexity.', 'Growth Partner — never Affiliate.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} aggregate metadata only — team/unit trend summaries max ~500 chars. No individual monitoring, personal data, PII, or unauthorized capacity content in audit payloads.'; ${D};
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
    "'aipify_operations_orchestration_engine'",
    `'aipify_operations_orchestration_engine',\n    ${additions.filter((e) => e !== "'aipify_operations_orchestration_engine'").join(",\n    ")}`,
  );
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
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_capacity_dashboard\(\)->'capabilities'\) = 8,/,
    `jsonb_build_object('key', 'center', 'label', '${P.centerTitle} — eight capabilities', 'met', jsonb_array_length(public._${bp}_capacity_dashboard()->'capabilities') = 8,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_capacity_reflection_engine\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Capacity reflection engine — five questions', 'met', jsonb_array_length(public._${bp}_capacity_reflection_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'companion', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_capacity_companion\(\)->'capabilities'\) = 6,/,
    `jsonb_build_object('key', 'companion', 'label', '${P.companion} capabilities', 'met', jsonb_array_length(public._${bp}_capacity_companion()->'capabilities') = 6,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases documented', 'met', jsonb_array_length(public._${bp}_era_opener_summary()) = 4,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'baseline', 'label', 'Repo Phase \d+ baseline tables'/,
    `jsonb_build_object('key', 'baseline', 'label', 'Repo Phase ${P.phase} baseline tables'`,
  );

  for (const fn of [
    "capacity_dashboard",
    "capacity_reflection_engine",
    "capacity_framework",
    "executive_capacity_reviews",
    "capacity_companion",
    "workload_balance_monitor",
    "resource_planning_center",
    "capacity_review_scheduler",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${bp}_${fn}()`);
  }

  if (!sql.includes("capacity_review_scheduler_meta")) {
    sql = sql.replace(
      `'sub_engine_meta', public._${bp}_workload_balance_monitor(),`,
      `'sub_engine_meta', public._${bp}_workload_balance_monitor(), 'resource_planning_center_meta', public._${bp}_resource_planning_center(), 'capacity_review_scheduler_meta', public._${bp}_capacity_review_scheduler(),`,
    );
  }

  sql = sql.replace(
    /select 'aipify-operations-orchestration-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', 209
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`Phase ${P.phase} Aipify[^']+`, "g"),
    `Phase ${P.phase} ${P.title} Engine — resource capacity workload balance within Global Command era; cross-link only for operations orchestration, action center, and organizational health.`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replace(
    /'title', 'Aipify Operations Orchestration Engine'/g,
    `'title', '${P.title} Engine'`,
  );

  if (!sql.includes(`'${P.prevDecision}'`)) {
    sql = sql.replace(
      `'aipify_decision_center_governance_engine',\n    '${P.decisionType}'`,
      `'aipify_decision_center_governance_engine',\n    '${P.prevDecision}',\n    '${P.decisionType}'`,
    );
  }

  sql = sql.replace(/haarbp176_integration_links/g, `${P.bp}_integration_links`);
  sql = sql.replace(/haarbp176_era_opener_summary/g, `${P.bp}_era_opener_summary`);
  sql = sql.replace(
    new RegExp(`'authenticated', 20[0-9]\\s*\\nwhere not exists \\(select 1 from public\\.aipify_knowledge_categories where slug = '${P.slug}'`),
    `'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}'`,
  );

  return sql;
}

function genMigration() {
  const src208 = path.join(ROOT, "supabase/migrations/20261368000000_aipify_operations_orchestration_engine_phase208.sql");
  if (!fs.existsSync(src208)) {
    throw new Error("Phase 208 migration required — ensure migration exists");
  }
  let m = transformFrom208(fs.readFileSync(src208, "utf8"));
  m = m.replace(/_aooe_seed_coordination_notes/g, `_${P.helper}_seed_${P.thirdEntity.replace("_notes", "")}_notes`);
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports capacity planning — does NOT surveil individuals or auto-reassign resources.

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
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never surveils individuals.";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/${P.slug}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_COMPANION_LIMITATIONS = [\n${P.companionLimitations.map((l) => `  "${l}",`).join("\n")}\n] as const;\n`,
  );
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports trend summaries, planning insights, and review reminders. Supports humans — does NOT surveil individuals or auto-reassign resources. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Capacity score",
    modeLabel: "Mode",
    readinessLabel: "Capacity balance level",
    executiveReviews: "Executive capacity reviews",
    activeReflections: "Active reflections",
    humanOversightRequired: `Human oversight required — humans steward allocation decisions; ${P.companion} supports only`,
    eraOpenerSummary: `Global Command Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate operations orchestration or action center RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Capacity reflection engine — reflection prompts",
    frameworkLabel: "Capacity framework",
    reviewsLabel: "Executive capacity reviews",
    companionLabel: `${P.companion} — supports, does not surveil`,
    subEngineLabel: "Workload Balance Monitor",
    reflections: "Capacity reflection scaffolds",
    executiveReviewEntries: "Capacity review entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT surveil individuals or auto-reassign resources`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports capacity planning — humans retain allocation authority for resource decisions.`,
      philosophy: "People First. Aggregate-only capacity scaffolds. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
    },
  };
}

function patchNav() {
  let c = fs.readFileSync(path.join(ROOT, "lib/app/nav-config.ts"), "utf8");
  const id = P.camel;
  const href = `/app/${P.slug}`;
  if (!c.includes(`"${id}"`)) {
    c = c.replace('| "aipifyOperationsOrchestrationEngine"', `| "aipifyOperationsOrchestrationEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    c = c.replace(
      /id: "aipifyOperationsOrchestrationEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyOperationsOrchestrationEngine",\n  },/,
      (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-operations-orchestration-engine")) {\n    return "aipifyOperationsOrchestrationEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-operations-orchestration-engine")) {\n    return "aipifyOperationsOrchestrationEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
  console.log("patched nav-config");
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_operations_orchestration.steward",', `"aipify_operations_orchestration.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
  console.log("patched permissions");
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-operations-orchestration-engine";',
      `export * from "./aipify-operations-orchestration-engine";\nexport * from "./${P.slug}";`,
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
        ? "Ressurskapasitet"
        : locale === "sv"
          ? "Resurskapacitet"
          : locale === "da"
            ? "Ressourcekapacitet"
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
      'export * from "./implementation-blueprint-phase208-vocabulary";',
      `export * from "./implementation-blueprint-phase208-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  const corpus = `aipify-core/knowledge/internal-language-model/${P.ilmFile}`;
  if (!c.includes(corpus)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE208_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase208-aipify-operations-orchestration.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE208_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase208-aipify-operations-orchestration.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "${corpus}";`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/internal-language-model/index.ts"), c);
  console.log("patched ilm index");
}

function patchArchitecture() {
  let c = fs.readFileSync(path.join(ROOT, "ARCHITECTURE.md"), "utf8");
  const entry = `\n**Aipify Resource Capacity & Workload Balance Engine (Phase 209):** See [AIPIFY_RESOURCE_CAPACITY_WORKLOAD_BALANCE_ENGINE_PHASE209.md](./AIPIFY_RESOURCE_CAPACITY_WORKLOAD_BALANCE_ENGINE_PHASE209.md) — ${P.centerTitle} for capacity dashboard, workload balance monitor, resource planning center, team capacity insights, strategic resource overview, capacity review scheduler, operations/action center integration, and capacity knowledge libraries. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** employee surveillance or auto-reassigning resources. Aggregate team/unit trends only. Cross-links only: Phase 208 operations orchestration, Phase 205 action center, Phase 198 organizational health. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 209")) {
    const marker = "Permissions `aipify_operations_orchestration.steward`.";
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
