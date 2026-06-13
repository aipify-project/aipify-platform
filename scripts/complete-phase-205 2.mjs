#!/usr/bin/env node
/** ABOS Phase 205 — Aipify Action Center & Execution Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const P = {
  phase: 205,
  migration: "20261365000000_aipify_action_center_execution_engine_phase205.sql",
  slug: "aipify-action-center-execution-engine",
  base: "AipifyActionCenterExecution",
  camel: "aipifyActionCenterExecutionEngine",
  snake: "aipify_action_center_execution",
  permPrefix: "aipify_action_center_execution",
  helper: "aacee",
  bp: "aaceebp205",
  decisionType: "aipify_action_center_execution_engine",
  prevDecision: "aipify_knowledge_discovery_intelligent_search_engine",
  title: "Aipify Action Center & Execution",
  centerTitle: "Action Center (My Actions Dashboard)",
  companion: "Execution Companion",
  scoreKey: "aipify_action_center_execution_score",
  modeKey: "action_execution_mode",
  levelKey: "execution_readiness_level",
  thirdEntity: "follow_up_notes",
  era: "Global Command & Enterprise Operations Era (201–210)",
  eraRange: "201–210",
  docSlug: "AIPIFY_ACTION_CENTER_EXECUTION_ENGINE",
  ilmFile: "implementation-blueprint-phase205-aipify-action-center-execution.txt",
  navLabel: "Action Center",
  crossLinkNote:
    "Cross-links only: Phase 204 knowledge discovery, /app/action-center (AEF), trust_action_engine — never duplicate AEF RPCs, auto-execute Level 3+ actions, or bypass delegation governance.",
  ilmExtra: `
Action Center (My Actions Dashboard): my actions dashboard, team action center, executive action board, smart follow-up engine, delegation framework, completion analytics dashboard, ecosystem action consolidation, action knowledge libraries.
Execution Reflection Engine prompts: Are actions clear and owned? Is follow-up timely? Does delegation respect governance? Where do actions stall? What completion patterns emerge?
Execution Framework: action clarity, delegation governance, follow-up discipline, completion tracking, trust alignment, executive visibility, enterprise scale.
Executive Action Reviews, Execution Companion, Smart Follow-Up Engine, Delegation Framework, Completion Analytics tracks.
Companion limitations: no auto-executing Level 3+ actions, no bypassing trust_action_engine, no overriding delegation governance, no replacing human approval for sensitive actions.`,
  faqBody: `## What is Action Center & Execution Engine?

Action Center & Execution helps organizations track, delegate, and complete actions with human approval — at \`/app/aipify-action-center-execution-engine\`.

## Does this replace /app/action-center (AEF)?

**No.** This is ABOS Phase 205 metadata scaffold. Cross-link only to AEF — never duplicate AEF RPCs.

## Can the Execution Companion auto-execute sensitive actions?

**No.** Level 3+ actions require explicit human approval. The Execution Companion does NOT bypass trust_action_engine or delegation governance.

## What does My Actions Dashboard show?

Personal and team action scaffolds, follow-up reminders, delegation status, and completion analytics — metadata only.

## Why human approval?

Humans decide sensitive actions. Aipify prepares and tracks — it does not auto-execute without approval.`,
  companionLimitations: [
    "auto_execute_level_3_plus",
    "bypass_trust_action_engine",
    "override_delegation_governance",
    "duplicate_aef_rpcs",
    "replace_human_approval",
    "replace_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom204(content) {
  const thirdPascal = P.thirdEntity.split("_").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
  const pairs = [
    ["AipifyKnowledgeDiscoveryIntelligentSearch", P.base],
    ["aipify-knowledge-discovery-intelligent-search-engine", P.slug],
    ["aipify_knowledge_discovery_intelligent_search", P.snake],
    ["aipifyKnowledgeDiscoveryIntelligentSearch", P.camel.replace(/Engine$/, "")],
    ["aipifyKnowledgeDiscoveryIntelligentSearchEngine", P.camel],
    ["akdisebp204", P.bp],
    ["_akdise_", `_${P.helper}_`],
    ["aipify_knowledge_discovery_intelligent_search_score", P.scoreKey],
    ["search_discovery_mode", P.modeKey],
    ["search_relevance_level", P.levelKey],
    ["feedback_notes", P.thirdEntity],
    ["FeedbackNote", thirdPascal],
    ["feedback_notes_count", `${P.thirdEntity}_count`],
    ["Knowledge Result Center", P.centerTitle],
    ["Discovery Companion", P.companion],
    ["Aipify Knowledge Discovery & Intelligent Search", P.title],
    ["Knowledge Discovery", P.navLabel],
    ["Phase 204", `Phase ${P.phase}`],
    ["aipify_knowledge_discovery_intelligent_search_engine", P.decisionType],
    ["aipify_knowledge_discovery_intelligent_search.view", `${P.permPrefix}.view`],
    ["aipify_knowledge_discovery_intelligent_search.manage", `${P.permPrefix}.manage`],
    ["aipify_knowledge_discovery_intelligent_search.steward", `${P.permPrefix}.steward`],
    ["20261364000000_aipify_knowledge_discovery_intelligent_search_engine_phase204.sql", P.migration],
    ["Repo Phase 204", `Repo Phase ${P.phase}`],
    ["Phase 204 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE204_AIPIFY_KNOWLEDGE_DISCOVERY_INTELLIGENT_SEARCH_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase204", `implementation-blueprint-phase${P.phase}`],
    ["knowledge_result_center", "my_actions_dashboard"],
    ["search_reflection_engine", "execution_reflection_engine"],
    ["search_framework", "execution_framework"],
    ["executive_search_reviews", "executive_action_reviews"],
    ["discovery_companion", "execution_companion"],
    ["intelligent_search_engine", "smart_follow_up_engine"],
    ["permission_aware_search", "delegation_framework"],
    ["knowledge_gap_detection", "completion_analytics_dashboard"],
    ["Executive Search Reviews", "Executive Action Reviews"],
    ["knowledge discovery within", "action center execution within"],
    ["_seed_feedback_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["bypass RBAC permissions", "auto-execute Level 3+ actions"],
    ["auto-publish knowledge without approval", "bypass trust_action_engine without approval"],
    ["Discovery Companion supports", "Execution Companion supports"],
    ["never bypasses RBAC or exposes unauthorized content", "never auto-executes Level 3+ or bypasses trust_action_engine"],
    ["supports — does not bypass permissions", "supports — does not auto-execute sensitive actions"],
    [
      "supports search discovery, does not bypass RBAC or auto-publish knowledge",
      "supports action tracking, does not auto-execute Level 3+ or bypass delegation governance",
    ],
    ["permission-aware search", "action execution tracking"],
    ["Permission-aware discovery", "Human-approved execution"],
    ["permission_aware", "approval_required"],
    ["Discovery score", "Execution score"],
    ["Search relevance level", "Execution readiness level"],
    ["Search reflection engine", "Execution reflection engine"],
    ["Search framework", "Execution framework"],
    ["Executive search reviews", "Executive action reviews"],
    ["Intelligent Search Engine", "Smart Follow-Up Engine"],
    ["Permission-Aware Search", "Delegation Framework"],
    ["Knowledge Gap Detection", "Completion Analytics Dashboard"],
    ["Search reflection scaffolds", "Execution reflection scaffolds"],
    ["Search review entries", "Action review entries"],
    ["stewards decide knowledge actions", "humans decide sensitive actions"],
    ["permission-aware search, knowledge gap detection", "action tracking, follow-up, and delegation governance"],
    ["does NOT bypass RBAC or expose unauthorized content", "does NOT auto-execute Level 3+ or bypass trust_action_engine"],
    ["never bypasses RBAC", "never auto-executes Level 3+ actions"],
    ["bypass_rbac", "auto_execute_level_3_plus"],
    ["expose_unauthorized_content", "bypass_trust_action_engine"],
    ["auto_publish_knowledge", "override_delegation_governance"],
    ["replace_knowledge_stewards", "duplicate_aef_rpcs"],
    ["store_raw_sensitive_content_in_indexes", "replace_human_approval"],
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
  const src = path.join(ROOT, "lib/aipify/aipify-knowledge-discovery-intelligent-search-engine");
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom204(fs.readFileSync(path.join(src, f), "utf8")));
  }
  const panel = path.join(
    ROOT,
    "components/app/aipify-knowledge-discovery-intelligent-search-engine/AipifyKnowledgeDiscoveryIntelligentSearchEngineDashboardPanel.tsx",
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/${engine}DashboardPanel.tsx`),
    transformFrom204(fs.readFileSync(panel, "utf8")),
  );
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${engine}DashboardPanel } from "./${engine}DashboardPanel";\n`);
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom204(
      fs.readFileSync(path.join(ROOT, "app/app/aipify-knowledge-discovery-intelligent-search-engine/page.tsx"), "utf8"),
    ),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom204(
        fs.readFileSync(path.join(ROOT, `app/api/aipify/aipify-knowledge-discovery-intelligent-search-engine/${route}/route.ts`), "utf8"),
      ),
    );
  }
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports action tracking — NOT auto-executing Level 3+ actions or bypassing trust_action_engine. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Help organizations track, delegate, and complete actions with human approval — Execution Companion prepares, humans decide sensitive actions.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Global Command Era (${P.eraRange}). Human-approved execution; metadata-only action scaffolds; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where actions are clear, follow-up is timely, delegation respects governance, and sensitive actions require human approval.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'execution_reflection_engine', 'label', 'Execution reflection engine', 'emoji', '🪞', 'description', 'Action reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Execution framework', 'emoji', '🛡️', 'description', 'Seven execution domains'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive action reviews', 'emoji', '👥', 'description', 'Action effectiveness reflection'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not auto-execute'),
    jsonb_build_object('key', 'smart_follow_up_engine', 'label', 'Smart Follow-Up Engine', 'emoji', '⚙️', 'description', 'Follow-up and reminder scaffolds'),
    jsonb_build_object('key', 'delegation_framework', 'label', 'Delegation Framework', 'emoji', '📖', 'description', 'Delegation governance scaffolds'),
    jsonb_build_object('key', 'action_libraries', 'label', 'Action knowledge libraries', 'emoji', '🌱', 'description', 'Approved action resources')
  ); ${D};
create or replace function public._${bp}_my_actions_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'my_actions_dashboard', 'label', 'My Actions Dashboard — personal action queue, priorities, status'),
    jsonb_build_object('key', 'team_action_center', 'label', 'Team Action Center — shared team actions, ownership, visibility'),
    jsonb_build_object('key', 'executive_action_board', 'label', 'Executive Action Board — leadership action overview'),
    jsonb_build_object('key', 'smart_follow_up_engine', 'label', 'Smart Follow-Up Engine — reminders, nudges, escalation scaffolds'),
    jsonb_build_object('key', 'delegation_framework', 'label', 'Delegation Framework — assign, approve, track delegation'),
    jsonb_build_object('key', 'completion_analytics_dashboard', 'label', 'Completion Analytics Dashboard — completion rates, stall patterns'),
    jsonb_build_object('key', 'ecosystem_action_consolidation', 'label', 'Ecosystem action consolidation — cross-surface action metadata'),
    jsonb_build_object('key', 'action_knowledge_libraries', 'label', 'Action knowledge libraries — approved execution resources')
  )); ${D};
create or replace function public._${bp}_execution_reflection_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Execution reflection prompts — humans decide sensitive actions.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'action_clarity', 'label', 'Are actions clear and owned?'),
    jsonb_build_object('key', 'follow_up_timeliness', 'label', 'Is follow-up timely?'),
    jsonb_build_object('key', 'delegation_governance', 'label', 'Does delegation respect governance?'),
    jsonb_build_object('key', 'stall_patterns', 'label', 'Where do actions stall?'),
    jsonb_build_object('key', 'completion_patterns', 'label', 'What completion patterns emerge?')
  )); ${D};
create or replace function public._${bp}_execution_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Execution framework — periodic evaluation.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'action_clarity', 'label', 'Action clarity'),
    jsonb_build_object('key', 'delegation_governance', 'label', 'Delegation governance'),
    jsonb_build_object('key', 'follow_up_discipline', 'label', 'Follow-up discipline'),
    jsonb_build_object('key', 'completion_tracking', 'label', 'Completion tracking'),
    jsonb_build_object('key', 'trust_alignment', 'label', 'Trust alignment'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); ${D};
create or replace function public._${bp}_executive_action_reviews() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive action reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'action_effectiveness', 'label', 'Action effectiveness'),
    jsonb_build_object('key', 'delegation_health', 'label', 'Delegation health'),
    jsonb_build_object('key', 'follow_up_compliance', 'label', 'Follow-up compliance'),
    jsonb_build_object('key', 'completion_trends', 'label', 'Completion trends'),
    jsonb_build_object('key', 'trust_alignment', 'label', 'Trust alignment')
  )); ${D};
create or replace function public._${bp}_execution_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports tracking, does not auto-execute sensitive actions.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'action_summaries', 'label', 'Action summaries'),
    jsonb_build_object('key', 'follow_up_reminders', 'label', 'Follow-up reminders'),
    jsonb_build_object('key', 'delegation_guidance', 'label', 'Delegation guidance'),
    jsonb_build_object('key', 'approval_prompts', 'label', 'Approval prompts'),
    jsonb_build_object('key', 'completion_insights', 'label', 'Completion insights'),
    jsonb_build_object('key', 'trust_reminders', 'label', 'Trust reminders')
  )); ${D};
create or replace function public._${bp}_smart_follow_up_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Smart Follow-Up Engine — metadata-only follow-up scaffolds.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'reminder_scheduling', 'label', 'Reminder scheduling — approved patterns'),
    jsonb_build_object('key', 'escalation_scaffolds', 'label', 'Escalation scaffolds'),
    jsonb_build_object('key', 'stall_detection', 'label', 'Stall detection — aggregate metadata'),
    jsonb_build_object('key', 'nudge_templates', 'label', 'Nudge templates'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no raw content'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for sensitive follow-ups')
  )); ${D};
create or replace function public._${bp}_delegation_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Delegation Framework — governance enforced.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'assign_approve_track', 'label', 'Assign, approve, track delegation'),
    jsonb_build_object('key', 'ownership_clarity', 'label', 'Ownership clarity'),
    jsonb_build_object('key', 'governance_boundaries', 'label', 'Governance boundaries'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Delegation audit trails'),
    jsonb_build_object('key', 'no_override_governance', 'label', 'Never override delegation governance'),
    jsonb_build_object('key', 'trust_action_cross_link', 'label', 'Trust Action Engine cross-link', 'cross_link', '/app/approvals')
  )); ${D};
create or replace function public._${bp}_completion_analytics_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Completion Analytics Dashboard — aggregate metadata, not auto-execution.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'completion_rates', 'label', 'Completion rates — aggregate'),
    jsonb_build_object('key', 'stall_patterns', 'label', 'Stall pattern analytics'),
    jsonb_build_object('key', 'team_benchmarks', 'label', 'Team benchmarks — metadata only'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds'),
    jsonb_build_object('key', 'continuous_improvement', 'label', 'Continuous improvement loops'),
    jsonb_build_object('key', 'no_auto_execute', 'label', 'Never auto-execute actions')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Auto-execute Level 3+ actions',
      'Bypass trust_action_engine',
      'Override delegation governance',
      'Duplicate AEF RPCs',
      'Replace human approval',
      'Override human judgment'), 'principle', '${P.companion} supports — humans decide sensitive actions.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — clarity, patience, and service toward completed actions without pressure.', 'values', jsonb_build_array('clarity_before_complexity','speed_before_frustration','patience','service','recognition','confidence_without_overreach'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Action audit logs via aipify_action_center_execution_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_action_center_execution permissions'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only action scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'approval_gates', 'label', 'Level 3+ actions require human approval'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 201, 'key', 'global_command', 'label', 'Global Command Phase 201', 'route', '/app/aipify-global-command-center-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 204, 'key', 'knowledge_discovery', 'label', 'Knowledge Discovery Phase 204', 'route', '/app/aipify-knowledge-discovery-intelligent-search-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 205, 'key', 'action_center_execution', 'label', 'Action Center Phase 205', 'route', '/app/${P.slug}', 'description', 'Human-approved action tracking'),
    jsonb_build_object('key', 'aef_action_center', 'label', 'AEF Action Center', 'route', '/app/action-center', 'description', 'Cross-link only — do not duplicate AEF RPCs')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'knowledge_discovery', 'label', 'Knowledge Discovery Phase 204', 'route', '/app/aipify-knowledge-discovery-intelligent-search-engine', 'relationship', 'Prior phase — cross-link only'),
    jsonb_build_object('key', 'aef_action_center', 'label', 'AEF Action Center', 'route', '/app/action-center', 'relationship', 'Autonomous Execution Framework — cross-link only, never duplicate RPCs'),
    jsonb_build_object('key', 'trust_actions', 'label', 'Trust & Action Engine', 'route', '/app/approvals', 'relationship', 'Approval gates — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Clarity and patience — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with metadata-only action scaffolds and human approval gates. Growth Partner terminology. ${P.companion} supports — never auto-executes Level 3+ or bypasses trust_action_engine.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans decide sensitive actions.', '${P.companion} informs and supports.', 'Human-approved — never auto-execute Level 3+.', 'Growth Partner — never Affiliate.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — action summaries and completion signals max ~500 chars. No raw sensitive content, PII, or unauthorized action data in audit payloads.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.prevDecision}'`) && sql.includes(`'${P.decisionType}'`)) return sql;
  if (sql.includes(`'${P.decisionType}'`) && !sql.includes(`'${P.prevDecision}'`)) {
    return sql.replace(
      `'${P.decisionType}'`,
      `'${P.prevDecision}',\n    '${P.decisionType}'`,
    );
  }
  const additions = [];
  for (const entry of [P.prevDecision, P.decisionType]) {
    if (!sql.includes(`'${entry}'`)) additions.push(`'${entry}'`);
  }
  if (additions.length === 0) return sql;
  return sql.replace(
    "'aipify_digital_headquarters_engine'",
    `'aipify_digital_headquarters_engine',\n    ${additions.join(",\n    ")}`,
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
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_my_actions_dashboard\(\)->'capabilities'\) = 8,/,
    `jsonb_build_object('key', 'center', 'label', '${P.centerTitle} — eight capabilities', 'met', jsonb_array_length(public._${bp}_my_actions_dashboard()->'capabilities') = 8,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_execution_reflection_engine\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Execution reflection engine — five questions', 'met', jsonb_array_length(public._${bp}_execution_reflection_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'companion', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_execution_companion\(\)->'capabilities'\) = 6,/,
    `jsonb_build_object('key', 'companion', 'label', '${P.companion} capabilities', 'met', jsonb_array_length(public._${bp}_execution_companion()->'capabilities') = 6,`,
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
    "my_actions_dashboard",
    "execution_reflection_engine",
    "execution_framework",
    "executive_action_reviews",
    "execution_companion",
    "smart_follow_up_engine",
    "delegation_framework",
    "completion_analytics_dashboard",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${bp}_${fn}()`);
  }

  if (!sql.includes("completion_analytics_dashboard_meta")) {
    sql = sql.replace(
      `'sub_engine_meta', public._${bp}_smart_follow_up_engine(),`,
      `'sub_engine_meta', public._${bp}_smart_follow_up_engine(), 'delegation_framework_meta', public._${bp}_delegation_framework(), 'completion_analytics_dashboard_meta', public._${bp}_completion_analytics_dashboard(),`,
    );
  }

  sql = sql.replace(
    /select 'aipify-knowledge-discovery-intelligent-search-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', 205
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`Phase ${P.phase} Aipify[^']+`, "g"),
    `Phase ${P.phase} ${P.title} Engine — action center execution within Global Command era; cross-link only for AEF and trust_action_engine.`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replace(
    /'title', 'Aipify Knowledge Discovery & Intelligent Search Engine'/g,
    `'title', '${P.title} Engine'`,
  );

  return sql;
}

function genMigration() {
  const src204 = path.join(ROOT, "supabase/migrations/20261364000000_aipify_knowledge_discovery_intelligent_search_engine_phase204.sql");
  if (!fs.existsSync(src204)) {
    throw new Error("Phase 204 migration required — ensure migration exists");
  }
  let m = transformFrom204(fs.readFileSync(src204, "utf8"));
  m = m.replace(/_akdise_seed_feedback_notes/g, `_${P.helper}_seed_${P.thirdEntity.replace("_notes", "")}_notes`);
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports action tracking — does NOT auto-execute Level 3+ actions or bypass trust_action_engine.

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
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never auto-executes Level 3+.";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/${P.slug}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_COMPANION_LIMITATIONS = [\n${P.companionLimitations.map((l) => `  "${l}",`).join("\n")}\n] as const;\n`,
  );
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports action tracking, follow-up, and delegation governance. Supports humans — does NOT auto-execute Level 3+ or bypass trust_action_engine. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Execution score",
    modeLabel: "Mode",
    readinessLabel: "Execution readiness level",
    executiveReviews: "Executive action reviews",
    activeReflections: "Active reflections",
    humanOversightRequired: `Human oversight required — humans decide sensitive actions; ${P.companion} supports only`,
    eraOpenerSummary: `Global Command Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate AEF RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Execution reflection engine — reflection prompts",
    frameworkLabel: "Execution framework",
    reviewsLabel: "Executive action reviews",
    companionLabel: `${P.companion} — supports, does not auto-execute`,
    subEngineLabel: "Smart Follow-Up Engine",
    reflections: "Execution reflection scaffolds",
    executiveReviewEntries: "Action review entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT auto-execute Level 3+ or bypass trust_action_engine`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports action tracking — humans retain approval authority for sensitive actions.`,
      philosophy: "People First. Metadata-only action scaffolds. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
    },
  };
}

function patchNav() {
  let c = fs.readFileSync(path.join(ROOT, "lib/app/nav-config.ts"), "utf8");
  const id = P.camel;
  const href = `/app/${P.slug}`;
  if (!c.includes(`"${id}"`)) {
    c = c.replace('| "aipifyKnowledgeDiscoveryIntelligentSearchEngine"', `| "aipifyKnowledgeDiscoveryIntelligentSearchEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    c = c.replace(
      /id: "aipifyKnowledgeDiscoveryIntelligentSearchEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyKnowledgeDiscoveryIntelligentSearchEngine",\n  },/,
      (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-knowledge-discovery-intelligent-search-engine")) {\n    return "aipifyKnowledgeDiscoveryIntelligentSearchEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-knowledge-discovery-intelligent-search-engine")) {\n    return "aipifyKnowledgeDiscoveryIntelligentSearchEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
  console.log("patched nav-config");
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_knowledge_discovery_intelligent_search.steward",', `"aipify_knowledge_discovery_intelligent_search.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
  console.log("patched permissions");
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-knowledge-discovery-intelligent-search-engine";',
      `export * from "./aipify-knowledge-discovery-intelligent-search-engine";\nexport * from "./${P.slug}";`,
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
        ? "Handlingssenter"
        : locale === "sv"
          ? "Action Center"
          : locale === "da"
            ? "Handlingcenter"
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
      'export * from "./implementation-blueprint-phase204-vocabulary";',
      `export * from "./implementation-blueprint-phase204-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  const corpus = `aipify-core/knowledge/internal-language-model/${P.ilmFile}`;
  if (!c.includes(corpus)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE204_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase204-aipify-knowledge-discovery-intelligent-search.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE204_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase204-aipify-knowledge-discovery-intelligent-search.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "${corpus}";`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/internal-language-model/index.ts"), c);
  console.log("patched ilm index");
}

function patchArchitecture() {
  let c = fs.readFileSync(path.join(ROOT, "ARCHITECTURE.md"), "utf8");
  const entry = `\n**Aipify Action Center & Execution Engine (Phase 205):** See [AIPIFY_ACTION_CENTER_EXECUTION_ENGINE_PHASE205.md](./AIPIFY_ACTION_CENTER_EXECUTION_ENGINE_PHASE205.md) — ${P.centerTitle} for my actions dashboard, team action center, executive action board, smart follow-up engine, delegation framework, completion analytics, ecosystem consolidation, and action knowledge libraries. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** auto-executing Level 3+ or bypassing trust_action_engine. Cross-links only: Phase 204 knowledge discovery, \`/app/action-center\` (AEF). Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 205")) {
    const marker = "Permissions `aipify_knowledge_discovery_intelligent_search.steward`.";
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
