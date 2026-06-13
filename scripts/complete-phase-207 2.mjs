#!/usr/bin/env node
/** ABOS Phase 207 — Aipify Decision Center & Governance Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const P = {
  phase: 207,
  migration: "20261367000000_aipify_decision_center_governance_engine_phase207.sql",
  slug: "aipify-decision-center-governance-engine",
  base: "AipifyDecisionCenterGovernance",
  camel: "aipifyDecisionCenterGovernanceEngine",
  snake: "aipify_decision_center_governance",
  permPrefix: "aipify_decision_center_governance",
  helper: "adcge",
  bp: "adcgebp207",
  decisionType: "aipify_decision_center_governance_engine",
  prevDecision: "aipify_meeting_intelligence_follow_up_engine",
  title: "Aipify Decision Center & Governance",
  centerTitle: "Decision Center",
  companion: "Governance Companion",
  scoreKey: "aipify_decision_center_governance_score",
  modeKey: "decision_governance_mode",
  levelKey: "governance_maturity_level",
  thirdEntity: "governance_notes",
  era: "Global Command & Enterprise Operations Era (201–210)",
  eraRange: "201–210",
  docSlug: "AIPIFY_DECISION_CENTER_GOVERNANCE_ENGINE",
  ilmFile: "implementation-blueprint-phase207-aipify-decision-center-governance.txt",
  navLabel: "Decision Center",
  crossLinkNote:
    "Cross-links only: Phase 206 meeting intelligence, Phase 205 action center, /app/approvals, /app/assistant/decisions (DSE) — never duplicate DSE RPCs, bypass approval chains, or override trust_action_engine.",
  ilmExtra: `
Decision Center: decision dashboard, decision registry, governance workflow engine, decision ownership framework, decision review center, executive decision briefings, meeting intelligence & action center integration (cross-links), decision governance knowledge libraries.
Decision Reflection Engine prompts: decision quality, governance maturity, repeated discussions, decision context preservation, leadership continuity.
Governance Framework: decision traceability, governance workflows, ownership, review cycles, executive briefings, integration with meetings/actions, enterprise scale.
Executive Decision Reviews, Governance Companion, Governance Workflow Engine, Decision Ownership Framework, Decision Review Center tracks.
Design principles: governance before confusion, clarity before complexity, accountability before ambiguity.
Companion limitations: no making organizational decisions, no bypassing approval chains, no exposing sensitive governance data, no overriding trust_action_engine, no replacing executive judgment.`,
  faqBody: `## What is Decision Center & Governance Engine?

Decision Center & Governance helps organizations track decisions, governance workflows, and leadership accountability — at \`/app/aipify-decision-center-governance-engine\`.

## Is this the same as /app/assistant/decisions (DSE)?

**No.** This is ABOS Phase 207 metadata scaffold. Cross-link only to Decision Support Engine — never duplicate DSE RPCs.

## Can the Governance Companion make organizational decisions?

**No.** The Governance Companion provides decision summaries, registry insights, and review reminders — it does NOT make decisions or override approval workflows.

## What does the Decision Registry show?

Historical decision records, context, reasoning, and organizational memory — metadata only, aligned with Trust Architecture.

## Why human executive judgment?

Humans remain responsible for organizational decisions and approvals. Aipify prepares governance scaffolds — it does not bypass approval chains or override trust_action_engine.`,
  companionLimitations: [
    "make_organizational_decisions",
    "bypass_approval_chains",
    "expose_sensitive_governance_data",
    "override_trust_action_engine",
    "replace_executive_judgment",
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
    ["my_actions_dashboard", "decision_center"],
    ["execution_reflection_engine", "decision_reflection_engine"],
    ["execution_framework", "governance_framework"],
    ["executive_action_reviews", "executive_decision_reviews"],
    ["execution_companion", "governance_companion"],
    ["smart_follow_up_engine", "governance_workflow_engine"],
    ["delegation_framework", "decision_ownership_framework"],
    ["completion_analytics_dashboard", "decision_review_center"],
    ["Executive Action Reviews", "Executive Decision Reviews"],
    ["action center execution within", "decision center governance within"],
    ["_seed_follow_up_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["auto-execute Level 3+ actions", "make organizational decisions"],
    ["bypass trust_action_engine without approval", "bypass approval chains without governance"],
    ["Execution Companion supports", "Governance Companion supports"],
    ["never auto-executes Level 3+ or bypasses trust_action_engine", "never makes organizational decisions or bypasses approval chains"],
    ["supports — does not auto-execute sensitive actions", "supports — does not make organizational decisions"],
    [
      "supports action tracking, does not auto-execute Level 3+ or bypass delegation governance",
      "supports decision governance, does not make organizational decisions or bypass approval chains",
    ],
    ["action execution tracking", "decision governance tracking"],
    ["Human-approved execution", "Governance-first decision tracking"],
    ["approval_required", "governance_required"],
    ["Execution score", "Governance score"],
    ["Execution readiness level", "Governance maturity level"],
    ["Execution reflection engine", "Decision reflection engine"],
    ["Execution framework", "Governance framework"],
    ["Executive action reviews", "Executive decision reviews"],
    ["Smart Follow-Up Engine", "Governance Workflow Engine"],
    ["Delegation Framework", "Decision Ownership Framework"],
    ["Completion Analytics Dashboard", "Decision Review Center"],
    ["Execution reflection scaffolds", "Decision reflection scaffolds"],
    ["Action review entries", "Decision review entries"],
    ["humans decide sensitive actions", "humans decide organizational decisions"],
    ["action tracking, follow-up, and delegation governance", "decision governance, registry insights, and review reminders"],
    ["does NOT auto-execute Level 3+ or bypass trust_action_engine", "does NOT make organizational decisions or bypass approval chains"],
    ["never auto-executes Level 3+ actions", "never makes organizational decisions"],
    ["auto_execute_level_3_plus", "make_organizational_decisions"],
    ["bypass_trust_action_engine", "bypass_approval_chains"],
    ["override_delegation_governance", "expose_sensitive_governance_data"],
    ["duplicate_aef_rpcs", "override_trust_action_engine"],
    ["replace_human_approval", "replace_executive_judgment"],
    ["action_libraries", "governance_libraries"],
    ["Action knowledge libraries", "Decision governance knowledge libraries"],
    ["action_knowledge_libraries", "decision_governance_libraries"],
    ["completion_analytics_dashboard_meta", "decision_review_center_meta"],
    ["delegation_framework_meta", "decision_ownership_framework_meta"],
    ["aipify_action_center_execution_audit_logs", "aipify_decision_center_governance_audit_logs"],
    ["aipify_action_center_execution permissions", "aipify_decision_center_governance permissions"],
    ["action_center_execution", "decision_center_governance"],
    ["Action Center Phase 205", "Decision Center Phase 207"],
    ["Human-approved action tracking", "Governance-first decision tracking"],
    ["cross-link only for AEF and trust_action_engine", "cross-link only for DSE, meeting intelligence, and trust_action_engine"],
    ["never auto-executes Level 3+", "never makes organizational decisions"],
    ["auto-executing Level 3+ actions or bypassing trust_action_engine", "making organizational decisions or bypassing approval chains"],
    ["action tracking — NOT auto-executing", "decision governance — NOT making organizational decisions"],
    ["action tracking, does not auto-execute", "decision governance, does not make organizational decisions"],
    ["metadata-only action scaffolds", "metadata-only decision governance scaffolds"],
    ["actions are clear, follow-up is timely", "decisions are traceable, governance is mature"],
    ["Action effectiveness", "Pending approvals"],
    ["Delegation health", "Registry completeness"],
    ["Follow-up compliance", "Governance maturity"],
    ["Completion trends", "Review cadence"],
    ["Trust alignment", "Briefing effectiveness"],
    ["Action summaries", "Decision summaries"],
    ["Follow-up reminders", "Registry insights"],
    ["Delegation guidance", "Review reminders"],
    ["Approval prompts", "Governance prompts"],
    ["Completion insights", "Approval guidance"],
    ["Trust reminders", "Leadership continuity prompts"],
    ["Level 3+ actions require human approval", "Executive approvals require enhanced auth"],
    ["action scaffolds and human approval gates", "decision governance scaffolds and approval chain integrity"],
    ["never auto-executes Level 3+ or bypasses trust_action_engine", "never makes organizational decisions or bypasses approval chains"],
    ["action summaries and completion signals", "decision summaries and governance signals"],
    ["unauthorized action data", "sensitive governance data"],
    ["AEF Action Center", "Meeting Intelligence Phase 206"],
    ["/app/action-center", "/app/aipify-meeting-intelligence-follow-up-engine"],
    ["Autonomous Execution Framework — cross-link only, never duplicate RPCs", "Meeting Intelligence — cross-link only, never duplicate RPCs"],
    ["aef_action_center", "meeting_intelligence"],
    ["Knowledge Discovery Phase 204", "Action Center Phase 205"],
    ["/app/aipify-knowledge-discovery-intelligent-search-engine", "/app/aipify-action-center-execution-engine"],
    ["Prior phase — cross-link only", "Prior phase — cross-link only"],
    ["trust_actions", "dse_decisions"],
    ["Trust & Action Engine", "Decision Support Engine (DSE)"],
    ["/app/approvals", "/app/assistant/decisions"],
    ["Approval gates — cross-link only", "DSE guidance — cross-link only, never duplicate RPCs"],
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
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports decision governance — NOT making organizational decisions or bypassing approval chains. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Help organizations govern decisions with traceability, ownership clarity, and review cycles — Governance Companion summarizes, humans decide.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Global Command Era (${P.eraRange}). Governance before confusion; metadata-only decision scaffolds; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where decisions are traceable, governance is mature, ownership is clear, and leadership continuity is preserved through accountable review cycles.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '⚖️', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'decision_reflection_engine', 'label', 'Decision reflection engine', 'emoji', '🪞', 'description', 'Governance reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Governance framework', 'emoji', '🛡️', 'description', 'Seven governance domains'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive decision reviews', 'emoji', '👥', 'description', 'Governance effectiveness reflection'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not make decisions'),
    jsonb_build_object('key', 'governance_workflow_engine', 'label', 'Governance Workflow Engine', 'emoji', '⚙️', 'description', 'Review and approval chain scaffolds'),
    jsonb_build_object('key', 'decision_ownership_framework', 'label', 'Decision Ownership Framework', 'emoji', '📖', 'description', 'Ownership and accountability scaffolds'),
    jsonb_build_object('key', 'governance_libraries', 'label', 'Decision governance knowledge libraries', 'emoji', '🌱', 'description', 'Approved governance resources')
  ); ${D};
create or replace function public._${bp}_decision_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'decision_dashboard', 'label', 'Decision Dashboard — active/completed decisions, pending approvals, leadership summaries'),
    jsonb_build_object('key', 'decision_registry', 'label', 'Decision Registry — historical records, context, reasoning, organizational memory'),
    jsonb_build_object('key', 'governance_workflow_engine', 'label', 'Governance Workflow Engine — review processes, approval chains, oversight'),
    jsonb_build_object('key', 'decision_ownership_framework', 'label', 'Decision Ownership Framework — responsibility, ownership clarity, status tracking'),
    jsonb_build_object('key', 'decision_review_center', 'label', 'Decision Review Center — periodic reassessment, learning from outcomes'),
    jsonb_build_object('key', 'executive_decision_briefings', 'label', 'Executive Decision Briefings — concise leader summaries'),
    jsonb_build_object('key', 'meeting_action_integration', 'label', 'Meeting Intelligence & Action Center integration — cross-links only'),
    jsonb_build_object('key', 'decision_governance_libraries', 'label', 'Decision governance knowledge libraries — approved governance resources')
  )); ${D};
create or replace function public._${bp}_decision_reflection_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Decision reflection prompts — humans decide organizational outcomes.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'decision_quality', 'label', 'How is decision quality evolving?'),
    jsonb_build_object('key', 'governance_maturity', 'label', 'Is governance maturity improving?'),
    jsonb_build_object('key', 'repeated_discussions', 'label', 'Are repeated discussions surfacing unresolved decisions?'),
    jsonb_build_object('key', 'decision_context_preservation', 'label', 'Is decision context preserved for continuity?'),
    jsonb_build_object('key', 'leadership_continuity', 'label', 'Does leadership continuity remain accountable?')
  )); ${D};
create or replace function public._${bp}_governance_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Governance framework — periodic evaluation.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'decision_traceability', 'label', 'Decision traceability'),
    jsonb_build_object('key', 'governance_workflows', 'label', 'Governance workflows'),
    jsonb_build_object('key', 'ownership', 'label', 'Ownership'),
    jsonb_build_object('key', 'review_cycles', 'label', 'Review cycles'),
    jsonb_build_object('key', 'executive_briefings', 'label', 'Executive briefings'),
    jsonb_build_object('key', 'integration_meetings_actions', 'label', 'Integration with meetings/actions'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); ${D};
create or replace function public._${bp}_executive_decision_reviews() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive decision reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'pending_approvals', 'label', 'Pending approvals'),
    jsonb_build_object('key', 'registry_completeness', 'label', 'Registry completeness'),
    jsonb_build_object('key', 'governance_maturity', 'label', 'Governance maturity'),
    jsonb_build_object('key', 'review_cadence', 'label', 'Review cadence'),
    jsonb_build_object('key', 'briefing_effectiveness', 'label', 'Briefing effectiveness')
  )); ${D};
create or replace function public._${bp}_governance_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports governance, does not make organizational decisions.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'decision_summaries', 'label', 'Decision summaries'),
    jsonb_build_object('key', 'registry_insights', 'label', 'Registry insights'),
    jsonb_build_object('key', 'review_reminders', 'label', 'Review reminders'),
    jsonb_build_object('key', 'governance_prompts', 'label', 'Governance prompts'),
    jsonb_build_object('key', 'approval_guidance', 'label', 'Approval guidance'),
    jsonb_build_object('key', 'leadership_continuity_prompts', 'label', 'Leadership continuity prompts')
  )); ${D};
create or replace function public._${bp}_governance_workflow_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Governance Workflow Engine — metadata-only review and approval scaffolds.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'review_processes', 'label', 'Review processes — approved patterns'),
    jsonb_build_object('key', 'approval_chains', 'label', 'Approval chains'),
    jsonb_build_object('key', 'oversight_scaffolds', 'label', 'Oversight scaffolds'),
    jsonb_build_object('key', 'workflow_audit_trails', 'label', 'Workflow audit trails'),
    jsonb_build_object('key', 'metadata_only_records', 'label', 'Metadata-only records — no raw meeting/email content'),
    jsonb_build_object('key', 'no_bypass_approval', 'label', 'Never bypass approval chains')
  )); ${D};
create or replace function public._${bp}_decision_ownership_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Decision Ownership Framework — accountability enforced.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'responsibility_clarity', 'label', 'Responsibility clarity'),
    jsonb_build_object('key', 'ownership_tracking', 'label', 'Ownership tracking'),
    jsonb_build_object('key', 'status_visibility', 'label', 'Status visibility'),
    jsonb_build_object('key', 'accountability_audit', 'label', 'Accountability audit trails'),
    jsonb_build_object('key', 'no_override_governance', 'label', 'Never override governance ownership'),
    jsonb_build_object('key', 'trust_action_cross_link', 'label', 'Trust Action Engine cross-link', 'cross_link', '/app/approvals')
  )); ${D};
create or replace function public._${bp}_decision_review_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Decision Review Center — periodic reassessment, not auto-deciding.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'periodic_reassessment', 'label', 'Periodic reassessment cycles'),
    jsonb_build_object('key', 'outcome_learning', 'label', 'Learning from outcomes — aggregate metadata'),
    jsonb_build_object('key', 'review_cadence_analytics', 'label', 'Review cadence analytics'),
    jsonb_build_object('key', 'leadership_summaries', 'label', 'Leadership summary scaffolds'),
    jsonb_build_object('key', 'continuous_improvement', 'label', 'Continuous improvement loops'),
    jsonb_build_object('key', 'no_auto_decide', 'label', 'Never make organizational decisions')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Make organizational decisions',
      'Bypass approval chains',
      'Expose sensitive governance data',
      'Override trust_action_engine',
      'Replace executive judgment',
      'Override human judgment'), 'principle', '${P.companion} supports — humans decide organizational outcomes.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — clarity, patience, and service toward accountable governance without confusion.', 'values', jsonb_build_array('governance_before_confusion','clarity_before_complexity','accountability_before_ambiguity','patience','service','confidence_without_overreach'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Governance audit logs via aipify_decision_center_governance_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_decision_center_governance permissions'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only decision records — Trust Architecture'),
    jsonb_build_object('key', 'executive_auth', 'label', 'Enhanced auth for executive approvals'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 205, 'key', 'action_center_execution', 'label', 'Action Center Phase 205', 'route', '/app/aipify-action-center-execution-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 206, 'key', 'meeting_intelligence', 'label', 'Meeting Intelligence Phase 206', 'route', '/app/aipify-meeting-intelligence-follow-up-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 207, 'key', 'decision_center_governance', 'label', 'Decision Center Phase 207', 'route', '/app/${P.slug}', 'description', 'Governance-first decision tracking'),
    jsonb_build_object('key', 'trust_approvals', 'label', 'Trust Approvals', 'route', '/app/approvals', 'description', 'Cross-link only — do not override trust_action_engine')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'action_center_execution', 'label', 'Action Center Phase 205', 'route', '/app/aipify-action-center-execution-engine', 'relationship', 'Prior phase — cross-link only'),
    jsonb_build_object('key', 'meeting_intelligence', 'label', 'Meeting Intelligence Phase 206', 'route', '/app/aipify-meeting-intelligence-follow-up-engine', 'relationship', 'Meeting follow-up — cross-link only'),
    jsonb_build_object('key', 'trust_actions', 'label', 'Trust & Action Engine', 'route', '/app/approvals', 'relationship', 'Approval gates — cross-link only'),
    jsonb_build_object('key', 'dse_decisions', 'label', 'Decision Support Engine (DSE)', 'route', '/app/assistant/decisions', 'relationship', 'DSE guidance — cross-link only, never duplicate RPCs'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Clarity and patience — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with metadata-only decision governance scaffolds and approval chain integrity. Growth Partner terminology. ${P.companion} supports — never makes organizational decisions or bypasses approval chains.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans decide organizational outcomes.', '${P.companion} informs and supports.', 'Governance before confusion — never bypass approval chains.', 'Growth Partner — never Affiliate.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — decision summaries and governance signals max ~500 chars. No raw meeting/email content, PII, or sensitive governance data in audit payloads.'; ${D};
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
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_decision_center\(\)->'capabilities'\) = 8,/,
    `jsonb_build_object('key', 'center', 'label', '${P.centerTitle} — eight capabilities', 'met', jsonb_array_length(public._${bp}_decision_center()->'capabilities') = 8,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_decision_reflection_engine\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Decision reflection engine — five questions', 'met', jsonb_array_length(public._${bp}_decision_reflection_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'companion', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_governance_companion\(\)->'capabilities'\) = 6,/,
    `jsonb_build_object('key', 'companion', 'label', '${P.companion} capabilities', 'met', jsonb_array_length(public._${bp}_governance_companion()->'capabilities') = 6,`,
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
    "decision_center",
    "decision_reflection_engine",
    "governance_framework",
    "executive_decision_reviews",
    "governance_companion",
    "governance_workflow_engine",
    "decision_ownership_framework",
    "decision_review_center",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${bp}_${fn}()`);
  }

  if (!sql.includes("decision_review_center_meta")) {
    sql = sql.replace(
      `'sub_engine_meta', public._${bp}_governance_workflow_engine(),`,
      `'sub_engine_meta', public._${bp}_governance_workflow_engine(), 'decision_ownership_framework_meta', public._${bp}_decision_ownership_framework(), 'decision_review_center_meta', public._${bp}_decision_review_center(),`,
    );
  }

  sql = sql.replace(
    /select 'aipify-action-center-execution-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', 207
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`Phase ${P.phase} Aipify[^']+`, "g"),
    `Phase ${P.phase} ${P.title} Engine — decision center governance within Global Command era; cross-link only for DSE, meeting intelligence, and trust_action_engine.`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replace(
    /'title', 'Aipify Action Center & Execution Engine'/g,
    `'title', 'Aipify Decision Center & Governance Engine'`,
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

${P.centerTitle} within ${P.era}. ${P.companion} supports decision governance — does NOT make organizational decisions or bypass approval chains.

## Permissions

- \`${P.permPrefix}.view\` · \`${P.permPrefix}.manage\` · \`${P.permPrefix}.steward\`

## Helpers

- Engine: \`_${P.helper}_*\` · Blueprint: \`_${P.bp}_*\`

${P.crossLinkNote}
`,
  );
  write(
    path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
    `# Implementation Blueprint — Phase ${P.phase} Aipify Decision Center & Governance Engine\n\nRoute: \`/app/${P.slug}\`\nEra: ${P.era}\n${P.crossLinkNote}\n`,
  );
  write(
    path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
    `# Aipify Decision Center & Governance Engine — FAQ (Phase ${P.phase})\n\n${P.faqBody}\n`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — Aipify Decision Center & Governance Engine\nRoute: /app/${P.slug}\n${P.ilmExtra}\n${P.crossLinkNote}\nPeople First. Growth Partner — never Affiliate.\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never makes organizational decisions.";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/${P.slug}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_COMPANION_LIMITATIONS = [\n${P.companionLimitations.map((l) => `  "${l}",`).join("\n")}\n] as const;\n`,
  );
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports decision governance, registry insights, and review reminders. Supports humans — does NOT make organizational decisions or bypass approval chains. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Governance score",
    modeLabel: "Mode",
    readinessLabel: "Governance maturity level",
    executiveReviews: "Executive decision reviews",
    activeReflections: "Active reflections",
    humanOversightRequired: `Human oversight required — humans decide organizational decisions; ${P.companion} supports only`,
    eraOpenerSummary: `Global Command Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate DSE RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Decision reflection engine — reflection prompts",
    frameworkLabel: "Governance framework",
    reviewsLabel: "Executive decision reviews",
    companionLabel: `${P.companion} — supports, does not make decisions`,
    subEngineLabel: "Governance Workflow Engine",
    reflections: "Decision reflection scaffolds",
    executiveReviewEntries: "Decision review entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT make organizational decisions or bypass approval chains`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports decision governance — humans retain decision authority.`,
      philosophy: "People First. Governance before confusion. Growth Partner terminology — never Affiliate.",
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
        ? "Beslutningssenter"
        : locale === "sv"
          ? "Beslutningscenter"
          : locale === "da"
            ? "Beslutningscenter"
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
  const entry = `\n**Aipify Decision Center & Governance Engine (Phase 207):** See [AIPIFY_DECISION_CENTER_GOVERNANCE_ENGINE_PHASE207.md](./AIPIFY_DECISION_CENTER_GOVERNANCE_ENGINE_PHASE207.md) — ${P.centerTitle} for decision dashboard, decision registry, governance workflow engine, decision ownership framework, decision review center, executive decision briefings, meeting/action integration cross-links, and decision governance knowledge libraries. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** making organizational decisions or bypassing approval chains. Cross-links only: Phase 206 meeting intelligence, Phase 205 action center, \`/app/approvals\`, \`/app/assistant/decisions\` (DSE). Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 207")) {
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
