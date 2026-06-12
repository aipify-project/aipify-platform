#!/usr/bin/env node
/** ABOS Phase 208 — Aipify Operations Orchestration Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const P = {
  phase: 208,
  migration: "20261368000000_aipify_operations_orchestration_engine_phase208.sql",
  slug: "aipify-operations-orchestration-engine",
  base: "AipifyOperationsOrchestration",
  camel: "aipifyOperationsOrchestrationEngine",
  snake: "aipify_operations_orchestration",
  permPrefix: "aipify_operations_orchestration",
  helper: "aooe",
  bp: "aooebp208",
  decisionType: "aipify_operations_orchestration_engine",
  prevDecision: "aipify_decision_center_governance_engine",
  title: "Aipify Operations Orchestration",
  centerTitle: "Operations Command Dashboard",
  companion: "Operations Companion",
  scoreKey: "aipify_operations_orchestration_score",
  modeKey: "operations_orchestration_mode",
  levelKey: "operational_coordination_level",
  thirdEntity: "coordination_notes",
  era: "Global Command & Enterprise Operations Era (201–210)",
  eraRange: "201–210",
  docSlug: "AIPIFY_OPERATIONS_ORCHESTRATION_ENGINE",
  ilmFile: "implementation-blueprint-phase208-aipify-operations-orchestration.txt",
  navLabel: "Operations Orchestration",
  crossLinkNote:
    "Cross-links only: Phase 205 action center, Phase 207 decision center, Phase 198 organizational health — never auto-execute workflows, override escalation governance, or bypass RBAC.",
  ilmExtra: `
Operations Command Dashboard: critical activity health, workflow visibility center, dependency management engine, escalation management framework, initiative tracking center, operational health monitor, action/decision center integration, operations knowledge libraries.
Operations Reflection Engine prompts: Is operational coordination clear? Where does process fragmentation emerge? Is execution consistency maintained? Does cross-functional visibility support leadership? Where can proactive leadership improve outcomes?
Operations Framework: workflow visibility, dependencies, escalations, initiative tracking, operational health, enterprise scale, integration with actions/decisions.
Executive Operations Reviews, Operations Companion, Workflow Visibility Center, Dependency Management Engine, Operational Health Monitor tracks.
Design principles: visibility before assumptions, coordination before chaos, simplicity before complexity.
Companion limitations: no auto-executing workflows, no overriding escalation governance, no exposing sensitive operational data, no replacing human coordination, no bypassing RBAC.`,
  faqBody: `## What is Operations Orchestration Engine?

Operations Orchestration helps organizations coordinate workflows, dependencies, and escalations with human oversight — at \`/app/aipify-operations-orchestration-engine\`.

## Does this auto-execute operational workflows?

**No.** The Operations Companion prepares summaries and alerts — humans approve operational changes. No auto-executing workflows or bypassing escalation governance.

## What does the Operations Command Dashboard show?

Critical activity health, attention areas, workflow visibility, dependency risks, escalation paths, initiative status, and operational health — metadata only.

## How does this relate to Action Center and Decision Center?

Cross-link only: Phase 205 action center (\`/app/aipify-action-center-execution-engine\`), Phase 207 decision center, and Phase 198 organizational health. Never duplicate their RPCs.

## Why human coordination?

Humans coordinate operational decisions. Aipify provides visibility and guidance — it does not replace human coordination or bypass RBAC.`,
  companionLimitations: [
    "auto_execute_workflows",
    "override_escalation_governance",
    "expose_sensitive_operational_data",
    "replace_human_coordination",
    "bypass_rbac",
    "replace_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom205(content) {
  const thirdPascal = P.thirdEntity.split("_").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
  const pairs = [
    ["AipifyActionCenterExecution", P.base],
    ["aipify-action-center-execution-engine", P.slug],
    ["aipify_action_center_execution", P.snake],
    ["aipifyActionCenterExecution", P.camel.replace(/Engine$/, "")],
    ["aipifyActionCenterExecutionEngine", P.camel],
    ["aaceebp205", P.bp],
    ["_aacee_", `_${P.helper}_`],
    ["aipify_action_center_execution_score", P.scoreKey],
    ["action_execution_mode", P.modeKey],
    ["execution_readiness_level", P.levelKey],
    ["follow_up_notes", P.thirdEntity],
    ["FollowUpNote", thirdPascal],
    ["follow_up_notes_count", `${P.thirdEntity}_count`],
    ["Action Center (My Actions Dashboard)", P.centerTitle],
    ["Execution Companion", P.companion],
    ["Aipify Action Center & Execution", P.title],
    ["Action Center", P.navLabel],
    ["Phase 205", `Phase ${P.phase}`],
    ["aipify_action_center_execution_engine", P.decisionType],
    ["aipify_action_center_execution.view", `${P.permPrefix}.view`],
    ["aipify_action_center_execution.manage", `${P.permPrefix}.manage`],
    ["aipify_action_center_execution.steward", `${P.permPrefix}.steward`],
    ["20261365000000_aipify_action_center_execution_engine_phase205.sql", P.migration],
    ["Repo Phase 205", `Repo Phase ${P.phase}`],
    ["Phase 205 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE205_AIPIFY_ACTION_CENTER_EXECUTION_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase205", `implementation-blueprint-phase${P.phase}`],
    ["my_actions_dashboard", "operations_command_dashboard"],
    ["execution_reflection_engine", "operations_reflection_engine"],
    ["execution_framework", "operations_framework"],
    ["executive_action_reviews", "executive_operations_reviews"],
    ["execution_companion", "operations_companion"],
    ["smart_follow_up_engine", "workflow_visibility_center"],
    ["delegation_framework", "dependency_management_engine"],
    ["completion_analytics_dashboard", "operational_health_monitor"],
    ["ecosystem_action_consolidation", "action_decision_center_integration"],
    ["action_knowledge_libraries", "operations_knowledge_libraries"],
    ["team_action_center", "workflow_visibility_center_meta"],
    ["executive_action_board", "dependency_management_engine_meta"],
    ["Executive Action Reviews", "Executive Operations Reviews"],
    ["action center execution within", "operations orchestration within"],
    ["_seed_follow_up_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["auto-execute Level 3+ actions", "auto-execute operational workflows"],
    ["bypass trust_action_engine without approval", "override escalation governance without approval"],
    ["Execution Companion supports", "Operations Companion supports"],
    ["never auto-executes Level 3+ or bypasses trust_action_engine", "never auto-executes workflows or overrides escalation governance"],
    ["supports — does not auto-execute sensitive actions", "supports — does not auto-execute operational changes"],
    [
      "supports action tracking, does not auto-execute Level 3+ or bypass delegation governance",
      "supports operational visibility, does not auto-execute workflows or override escalation governance",
    ],
    ["action execution tracking", "operational coordination tracking"],
    ["Human-approved execution", "Human-coordinated operations"],
    ["approval_required", "coordination_required"],
    ["Execution score", "Operations score"],
    ["Execution readiness level", "Operational coordination level"],
    ["Execution reflection engine", "Operations reflection engine"],
    ["Execution framework", "Operations framework"],
    ["Executive action reviews", "Executive operations reviews"],
    ["Smart Follow-Up Engine", "Workflow Visibility Center"],
    ["Delegation Framework", "Dependency Management Engine"],
    ["Completion Analytics Dashboard", "Operational Health Monitor"],
    ["Execution reflection scaffolds", "Operations reflection scaffolds"],
    ["Action review entries", "Operations review entries"],
    ["humans decide sensitive actions", "humans coordinate operational decisions"],
    ["action tracking, follow-up, and delegation governance", "workflow visibility, dependencies, and escalation governance"],
    ["does NOT auto-execute Level 3+ or bypass trust_action_engine", "does NOT auto-execute workflows or override escalation governance"],
    ["never auto-executes Level 3+ actions", "never auto-executes operational workflows"],
    ["auto_execute_level_3_plus", "auto_execute_workflows"],
    ["bypass_trust_action_engine", "override_escalation_governance"],
    ["override_delegation_governance", "expose_sensitive_operational_data"],
    ["duplicate_aef_rpcs", "replace_human_coordination"],
    ["replace_human_approval", "bypass_rbac"],
    ["AIPIFY_ACTION_CENTER_EXECUTION_ENGINE", P.docSlug],
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
  const src = path.join(ROOT, "lib/aipify/aipify-action-center-execution-engine");
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom205(fs.readFileSync(path.join(src, f), "utf8")));
  }
  const panel = path.join(
    ROOT,
    "components/app/aipify-action-center-execution-engine/AipifyActionCenterExecutionEngineDashboardPanel.tsx",
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/${engine}DashboardPanel.tsx`),
    transformFrom205(fs.readFileSync(panel, "utf8")),
  );
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${engine}DashboardPanel } from "./${engine}DashboardPanel";\n`);
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom205(
      fs.readFileSync(path.join(ROOT, "app/app/aipify-action-center-execution-engine/page.tsx"), "utf8"),
    ),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom205(
        fs.readFileSync(path.join(ROOT, `app/api/aipify/aipify-action-center-execution-engine/${route}/route.ts`), "utf8"),
      ),
    );
  }
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports operational visibility — NOT auto-executing workflows or overriding escalation governance. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Help organizations coordinate workflows, dependencies, and escalations with human oversight — Operations Companion prepares, humans coordinate operational decisions.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Global Command Era (${P.eraRange}). Human-coordinated operations; metadata-only scaffolds; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where operational coordination is visible, dependencies are managed, escalations are structured, and humans retain coordination authority.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'operations_reflection_engine', 'label', 'Operations reflection engine', 'emoji', '🪞', 'description', 'Operations reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Operations framework', 'emoji', '🛡️', 'description', 'Seven operations domains'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive operations reviews', 'emoji', '👥', 'description', 'Operations effectiveness reflection'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not auto-execute'),
    jsonb_build_object('key', 'workflow_visibility_center', 'label', 'Workflow Visibility Center', 'emoji', '⚙️', 'description', 'Process visualization scaffolds'),
    jsonb_build_object('key', 'dependency_management_engine', 'label', 'Dependency Management Engine', 'emoji', '📖', 'description', 'Cross-functional dependency scaffolds'),
    jsonb_build_object('key', 'operations_libraries', 'label', 'Operations knowledge libraries', 'emoji', '🌱', 'description', 'Approved operations resources')
  ); ${D};
create or replace function public._${bp}_operations_command_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities. Visibility before assumptions.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'operations_command_dashboard', 'label', 'Operations Command Dashboard — critical activity health, attention areas, leadership'),
    jsonb_build_object('key', 'workflow_visibility_center', 'label', 'Workflow Visibility Center — process visualization, progress, stalled activities'),
    jsonb_build_object('key', 'dependency_management_engine', 'label', 'Dependency Management Engine — cross-functional dependencies, delays, collaboration'),
    jsonb_build_object('key', 'escalation_management_framework', 'label', 'Escalation Management Framework — structured escalation paths, ownership during disruptions'),
    jsonb_build_object('key', 'initiative_tracking_center', 'label', 'Initiative Tracking Center — major initiatives, status, milestones, leadership oversight'),
    jsonb_build_object('key', 'operational_health_monitor', 'label', 'Operational Health Monitor — recurring challenges, bottlenecks, continuous improvement'),
    jsonb_build_object('key', 'action_decision_center_integration', 'label', 'Action Center & Decision Center integration — cross-links only'),
    jsonb_build_object('key', 'operations_knowledge_libraries', 'label', 'Operations knowledge libraries — approved operations resources')
  )); ${D};
create or replace function public._${bp}_operations_reflection_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Operations reflection prompts — humans coordinate operational decisions.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'operational_coordination', 'label', 'Is operational coordination clear?'),
    jsonb_build_object('key', 'process_fragmentation', 'label', 'Where does process fragmentation emerge?'),
    jsonb_build_object('key', 'execution_consistency', 'label', 'Is execution consistency maintained?'),
    jsonb_build_object('key', 'cross_functional_visibility', 'label', 'Does cross-functional visibility support leadership?'),
    jsonb_build_object('key', 'proactive_leadership', 'label', 'Where can proactive leadership improve outcomes?')
  )); ${D};
create or replace function public._${bp}_operations_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Operations framework — coordination before chaos.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'workflow_visibility', 'label', 'Workflow visibility'),
    jsonb_build_object('key', 'dependencies', 'label', 'Dependencies'),
    jsonb_build_object('key', 'escalations', 'label', 'Escalations'),
    jsonb_build_object('key', 'initiative_tracking', 'label', 'Initiative tracking'),
    jsonb_build_object('key', 'operational_health', 'label', 'Operational health'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale'),
    jsonb_build_object('key', 'integration_actions_decisions', 'label', 'Integration with actions/decisions')
  )); ${D};
create or replace function public._${bp}_executive_operations_reviews() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive operations reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'command_dashboard_health', 'label', 'Command dashboard health'),
    jsonb_build_object('key', 'workflow_stalls', 'label', 'Workflow stalls'),
    jsonb_build_object('key', 'dependency_risks', 'label', 'Dependency risks'),
    jsonb_build_object('key', 'escalation_effectiveness', 'label', 'Escalation effectiveness'),
    jsonb_build_object('key', 'initiative_delivery', 'label', 'Initiative delivery')
  )); ${D};
create or replace function public._${bp}_operations_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports visibility, does not auto-execute operational changes.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'workflow_summaries', 'label', 'Workflow summaries'),
    jsonb_build_object('key', 'dependency_alerts', 'label', 'Dependency alerts'),
    jsonb_build_object('key', 'escalation_guidance', 'label', 'Escalation guidance'),
    jsonb_build_object('key', 'coordination_prompts', 'label', 'Coordination prompts'),
    jsonb_build_object('key', 'operational_insights', 'label', 'Operational insights'),
    jsonb_build_object('key', 'rbac_reminders', 'label', 'RBAC reminders')
  )); ${D};
create or replace function public._${bp}_workflow_visibility_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Workflow Visibility Center — metadata-only process scaffolds.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'process_visualization', 'label', 'Process visualization — approved patterns'),
    jsonb_build_object('key', 'progress_tracking', 'label', 'Progress tracking scaffolds'),
    jsonb_build_object('key', 'stalled_activity_detection', 'label', 'Stalled activity detection — aggregate metadata'),
    jsonb_build_object('key', 'visibility_templates', 'label', 'Visibility templates'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no raw content'),
    jsonb_build_object('key', 'human_coordination_gates', 'label', 'Human coordination gates for operational changes')
  )); ${D};
create or replace function public._${bp}_dependency_management_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Dependency Management Engine — cross-functional visibility enforced.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'cross_functional_dependencies', 'label', 'Cross-functional dependency mapping'),
    jsonb_build_object('key', 'delay_risk_signals', 'label', 'Delay risk signals — metadata only'),
    jsonb_build_object('key', 'collaboration_scaffolds', 'label', 'Collaboration scaffolds'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Dependency audit trails'),
    jsonb_build_object('key', 'no_override_governance', 'label', 'Never override escalation governance'),
    jsonb_build_object('key', 'organizational_health_cross_link', 'label', 'Organizational Health Phase 198 cross-link', 'cross_link', '/app/aipify-organizational-health-early-warning-engine')
  )); ${D};
create or replace function public._${bp}_operational_health_monitor() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Operational Health Monitor — aggregate metadata, not auto-execution.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'recurring_challenges', 'label', 'Recurring challenges — aggregate'),
    jsonb_build_object('key', 'emerging_bottlenecks', 'label', 'Emerging bottleneck signals'),
    jsonb_build_object('key', 'health_benchmarks', 'label', 'Health benchmarks — metadata only'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds'),
    jsonb_build_object('key', 'continuous_improvement', 'label', 'Continuous improvement loops'),
    jsonb_build_object('key', 'no_auto_execute', 'label', 'Never auto-execute operational workflows')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Auto-execute operational workflows',
      'Override escalation governance',
      'Expose sensitive operational data',
      'Replace human coordination',
      'Bypass RBAC',
      'Override human judgment'), 'principle', '${P.companion} supports — humans coordinate operational decisions.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — clarity, patience, and service toward coordinated operations without pressure.', 'values', jsonb_build_array('visibility_before_assumptions','coordination_before_chaos','simplicity_before_complexity','patience','service','recognition'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Operations audit logs via aipify_operations_orchestration_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_operations_orchestration permissions'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only operations scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'sensitive_workflow_protection', 'label', 'Sensitive workflow protection — RBAC enforced'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 205, 'key', 'action_center_execution', 'label', 'Action Center Phase 205', 'route', '/app/aipify-action-center-execution-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 207, 'key', 'decision_center_governance', 'label', 'Decision Center Phase 207', 'route', '/app/aipify-decision-center-governance-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 198, 'key', 'organizational_health', 'label', 'Organizational Health Phase 198', 'route', '/app/aipify-organizational-health-early-warning-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 208, 'key', 'operations_orchestration', 'label', 'Operations Orchestration Phase 208', 'route', '/app/${P.slug}', 'description', 'Human-coordinated operations visibility')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'action_center_execution', 'label', 'Action Center Phase 205', 'route', '/app/aipify-action-center-execution-engine', 'relationship', 'Action tracking — cross-link only'),
    jsonb_build_object('key', 'decision_center_governance', 'label', 'Decision Center Phase 207', 'route', '/app/aipify-decision-center-governance-engine', 'relationship', 'Decision governance — cross-link only'),
    jsonb_build_object('key', 'organizational_health', 'label', 'Organizational Health Phase 198', 'route', '/app/aipify-organizational-health-early-warning-engine', 'relationship', 'Early warning signals — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Clarity and patience — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with metadata-only operations scaffolds and human coordination gates. Growth Partner terminology. ${P.companion} supports — never auto-executes workflows or overrides escalation governance.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans coordinate operational decisions.', '${P.companion} informs and supports.', 'Visibility before assumptions — coordination before chaos.', 'Growth Partner — never Affiliate.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — workflow summaries and coordination signals max ~500 chars. No raw sensitive operational data, PII, or unauthorized workflow content in audit payloads.'; ${D};
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
    "'aipify_action_center_execution_engine'",
    `'aipify_action_center_execution_engine',\n    ${additions.join(",\n    ")}`,
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
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_operations_command_dashboard\(\)->'capabilities'\) = 8,/,
    `jsonb_build_object('key', 'center', 'label', '${P.centerTitle} — eight capabilities', 'met', jsonb_array_length(public._${bp}_operations_command_dashboard()->'capabilities') = 8,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_operations_reflection_engine\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Operations reflection engine — five questions', 'met', jsonb_array_length(public._${bp}_operations_reflection_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'companion', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_operations_companion\(\)->'capabilities'\) = 6,/,
    `jsonb_build_object('key', 'companion', 'label', '${P.companion} capabilities', 'met', jsonb_array_length(public._${bp}_operations_companion()->'capabilities') = 6,`,
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
    "operations_command_dashboard",
    "operations_reflection_engine",
    "operations_framework",
    "executive_operations_reviews",
    "operations_companion",
    "workflow_visibility_center",
    "dependency_management_engine",
    "operational_health_monitor",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${bp}_${fn}()`);
  }

  if (!sql.includes("operational_health_monitor_meta")) {
    sql = sql.replace(
      `'sub_engine_meta', public._${bp}_workflow_visibility_center(),`,
      `'sub_engine_meta', public._${bp}_workflow_visibility_center(), 'dependency_management_engine_meta', public._${bp}_dependency_management_engine(), 'operational_health_monitor_meta', public._${bp}_operational_health_monitor(),`,
    );
  }

  sql = sql.replace(
    /select 'aipify-action-center-execution-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', 208
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`Phase ${P.phase} Aipify[^']+`, "g"),
    `Phase ${P.phase} ${P.title} Engine — operations orchestration within Global Command era; cross-link only for action center, decision center, and organizational health.`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replace(
    /'title', 'Aipify Action Center & Execution Engine'/g,
    `'title', '${P.title} Engine'`,
  );

  return sql;
}

function genMigration() {
  const src205 = path.join(ROOT, "supabase/migrations/20261365000000_aipify_action_center_execution_engine_phase205.sql");
  if (!fs.existsSync(src205)) {
    throw new Error("Phase 205 migration required — ensure migration exists");
  }
  let m = transformFrom205(fs.readFileSync(src205, "utf8"));
  m = m.replace(/_aacee_seed_follow_up_notes/g, `_${P.helper}_seed_${P.thirdEntity.replace("_notes", "")}_notes`);
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports operational visibility — does NOT auto-execute workflows or override escalation governance.

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
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never auto-executes workflows.";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/${P.slug}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_COMPANION_LIMITATIONS = [\n${P.companionLimitations.map((l) => `  "${l}",`).join("\n")}\n] as const;\n`,
  );
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports workflow visibility, dependency alerts, and escalation guidance. Supports humans — does NOT auto-execute workflows or override escalation governance. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Operations score",
    modeLabel: "Mode",
    readinessLabel: "Operational coordination level",
    executiveReviews: "Executive operations reviews",
    activeReflections: "Active reflections",
    humanOversightRequired: `Human oversight required — humans coordinate operational decisions; ${P.companion} supports only`,
    eraOpenerSummary: `Global Command Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate action center or decision center RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Operations reflection engine — reflection prompts",
    frameworkLabel: "Operations framework",
    reviewsLabel: "Executive operations reviews",
    companionLabel: `${P.companion} — supports, does not auto-execute`,
    subEngineLabel: "Workflow Visibility Center",
    reflections: "Operations reflection scaffolds",
    executiveReviewEntries: "Operations review entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT auto-execute workflows or override escalation governance`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports operational visibility — humans retain coordination authority for operational changes.`,
      philosophy: "People First. Metadata-only operations scaffolds. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
    },
  };
}

function patchNav() {
  let c = fs.readFileSync(path.join(ROOT, "lib/app/nav-config.ts"), "utf8");
  const id = P.camel;
  const href = `/app/${P.slug}`;
  if (!c.includes(`"${id}"`)) {
    c = c.replace('| "aipifyActionCenterExecutionEngine"', `| "aipifyActionCenterExecutionEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    c = c.replace(
      /id: "aipifyActionCenterExecutionEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyActionCenterExecutionEngine",\n  },/,
      (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-action-center-execution-engine")) {\n    return "aipifyActionCenterExecutionEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-action-center-execution-engine")) {\n    return "aipifyActionCenterExecutionEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
  console.log("patched nav-config");
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_action_center_execution.steward",', `"aipify_action_center_execution.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
  console.log("patched permissions");
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-action-center-execution-engine";',
      `export * from "./aipify-action-center-execution-engine";\nexport * from "./${P.slug}";`,
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
        ? "Operasjonsorkestrering"
        : locale === "sv"
          ? "Operationsorkestrering"
          : locale === "da"
            ? "Driftsorkestrering"
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
      'export * from "./implementation-blueprint-phase205-vocabulary";',
      `export * from "./implementation-blueprint-phase205-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  const corpus = `aipify-core/knowledge/internal-language-model/${P.ilmFile}`;
  if (!c.includes(corpus)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE205_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase205-aipify-action-center-execution.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE205_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase205-aipify-action-center-execution.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "${corpus}";`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/internal-language-model/index.ts"), c);
  console.log("patched ilm index");
}

function patchArchitecture() {
  let c = fs.readFileSync(path.join(ROOT, "ARCHITECTURE.md"), "utf8");
  const entry = `\n**Aipify Operations Orchestration Engine (Phase 208):** See [AIPIFY_OPERATIONS_ORCHESTRATION_ENGINE_PHASE208.md](./AIPIFY_OPERATIONS_ORCHESTRATION_ENGINE_PHASE208.md) — ${P.centerTitle} for operations command dashboard, workflow visibility center, dependency management engine, escalation management framework, initiative tracking center, operational health monitor, action/decision center integration, and operations knowledge libraries. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** auto-executing workflows or overriding escalation governance. Cross-links only: Phase 205 action center, Phase 207 decision center, Phase 198 organizational health. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 208")) {
    const marker = "Permissions `aipify_action_center_execution.steward`.";
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
