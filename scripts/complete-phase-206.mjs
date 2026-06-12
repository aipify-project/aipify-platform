#!/usr/bin/env node
/** ABOS Phase 206 — Aipify Meeting Intelligence & Follow-Up Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const P = {
  phase: 206,
  migration: "20261366000000_aipify_meeting_intelligence_follow_up_engine_phase206.sql",
  slug: "aipify-meeting-intelligence-follow-up-engine",
  base: "AipifyMeetingIntelligenceFollowUp",
  camel: "aipifyMeetingIntelligenceFollowUpEngine",
  snake: "aipify_meeting_intelligence_follow_up",
  permPrefix: "aipify_meeting_intelligence_follow_up",
  helper: "amifue",
  bp: "amifuebp206",
  decisionType: "aipify_meeting_intelligence_follow_up_engine",
  prevDecision: "aipify_action_center_execution_engine",
  title: "Aipify Meeting Intelligence & Follow-Up",
  centerTitle: "Meeting Follow-Up Dashboard",
  companion: "Meeting Companion",
  scoreKey: "aipify_meeting_intelligence_follow_up_score",
  modeKey: "meeting_follow_up_mode",
  levelKey: "follow_up_readiness_level",
  thirdEntity: "meeting_notes",
  era: "Global Command & Enterprise Operations Era (201–210)",
  eraRange: "201–210",
  docSlug: "AIPIFY_MEETING_INTELLIGENCE_FOLLOW_UP_ENGINE",
  ilmFile: "implementation-blueprint-phase206-aipify-meeting-intelligence-follow-up.txt",
  navLabel: "Meeting Follow-Up",
  crossLinkNote:
    "Cross-links only: Phase 205 action center execution, /app/action-center (AEF), trust_action_engine — metadata/summaries only; no raw transcript storage without policy; no PII in audit payloads.",
  ilmExtra: `
Meeting Follow-Up Dashboard: meeting summary generator, decision capture center, action item extractor, meeting follow-up dashboard, leadership briefing reports, privacy & consent controls, Action Center integration (cross-link), meeting knowledge libraries.
Meeting Reflection Engine prompts: Are meeting outcomes captured? Are action items clear? Is consent respected? Where does follow-up stall? What leadership insights emerge?
Follow-Up Framework: summary clarity, decision capture, action extraction, consent controls, privacy boundaries, leadership visibility, enterprise scale.
Leadership Briefing Reviews, Meeting Companion, Action Item Extractor, Privacy & Consent Controls, Decision Capture Center tracks.
Companion limitations: no raw transcript storage without policy, no PII in audit payloads, metadata/summaries only, no bypassing consent controls.`,
  faqBody: `## What is Meeting Intelligence & Follow-Up Engine?

Meeting Intelligence helps organizations capture meeting outcomes, decisions, and action items with privacy controls — at \`/app/aipify-meeting-intelligence-follow-up-engine\`.

## Does the Meeting Companion store raw transcripts?

**No.** Metadata and summaries only. Raw transcript storage requires explicit policy and consent controls.

## How does Action Center integration work?

Cross-link only to Phase 205 Action Center and \`/app/action-center\` (AEF) — never duplicate RPCs.

## What privacy controls exist?

Consent controls, note-only modes, and no PII in audit payloads — aligned with Trust Architecture.

## Why human approval?

Humans decide what to capture and share. The Meeting Companion prepares summaries — it does not bypass consent.`,
  companionLimitations: [
    "store_raw_transcripts_without_policy",
    "pii_in_audit_payloads",
    "bypass_consent_controls",
    "duplicate_action_center_rpcs",
    "replace_human_judgment",
    "expose_unauthorized_meeting_content",
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
    ["my_actions_dashboard", "meeting_follow_up_dashboard"],
    ["execution_reflection_engine", "meeting_reflection_engine"],
    ["execution_framework", "follow_up_framework"],
    ["executive_action_reviews", "leadership_briefing_reviews"],
    ["execution_companion", "meeting_companion"],
    ["smart_follow_up_engine", "action_item_extractor"],
    ["delegation_framework", "privacy_consent_controls"],
    ["completion_analytics_dashboard", "decision_capture_center"],
    ["Executive Action Reviews", "Leadership Briefing Reviews"],
    ["action center execution within", "meeting intelligence follow-up within"],
    ["_seed_follow_up_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["auto-execute Level 3+ actions", "store raw transcripts without policy"],
    ["bypass trust_action_engine without approval", "include PII in audit payloads without approval"],
    ["Execution Companion supports", "Meeting Companion supports"],
    ["never auto-executes Level 3+ or bypasses trust_action_engine", "never stores raw transcripts without policy or includes PII in audit payloads"],
    ["supports — does not auto-execute sensitive actions", "supports — does not bypass consent controls"],
    [
      "supports action tracking, does not auto-execute Level 3+ or bypass delegation governance",
      "supports meeting follow-up, does not store raw transcripts without policy or bypass consent",
    ],
    ["action execution tracking", "meeting follow-up tracking"],
    ["Human-approved execution", "Consent-aware meeting intelligence"],
    ["approval_required", "consent_required"],
    ["Execution score", "Follow-up score"],
    ["Execution readiness level", "Follow-up readiness level"],
    ["Execution reflection engine", "Meeting reflection engine"],
    ["Execution framework", "Follow-up framework"],
    ["Executive action reviews", "Leadership briefing reviews"],
    ["Smart Follow-Up Engine", "Action Item Extractor"],
    ["Delegation Framework", "Privacy & Consent Controls"],
    ["Completion Analytics Dashboard", "Decision Capture Center"],
    ["Execution reflection scaffolds", "Meeting reflection scaffolds"],
    ["Action review entries", "Briefing review entries"],
    ["humans decide sensitive actions", "humans decide what to capture and share"],
    ["action tracking, follow-up, and delegation governance", "meeting summaries, action extraction, and consent controls"],
    ["does NOT auto-execute Level 3+ or bypass trust_action_engine", "does NOT store raw transcripts without policy or include PII in audit payloads"],
    ["never auto-executes Level 3+ actions", "never stores raw transcripts without policy"],
    ["auto_execute_level_3_plus", "store_raw_transcripts_without_policy"],
    ["bypass_trust_action_engine", "pii_in_audit_payloads"],
    ["override_delegation_governance", "bypass_consent_controls"],
    ["duplicate_aef_rpcs", "duplicate_action_center_rpcs"],
    ["replace_human_approval", "expose_unauthorized_meeting_content"],
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
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports meeting follow-up — NOT storing raw transcripts without policy or PII in audit payloads. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Help organizations capture meeting outcomes, decisions, and action items with consent controls — Meeting Companion prepares summaries, humans decide what to capture.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Global Command Era (${P.eraRange}). Consent-aware meeting intelligence; metadata/summaries only; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where meeting outcomes are captured clearly, action items flow to Action Center, and privacy consent is respected.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '📋', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'meeting_reflection_engine', 'label', 'Meeting reflection engine', 'emoji', '🪞', 'description', 'Follow-up reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Follow-up framework', 'emoji', '🛡️', 'description', 'Seven follow-up domains'),
    jsonb_build_object('key', 'leadership_reviews', 'label', 'Leadership briefing reviews', 'emoji', '👥', 'description', 'Leadership reflection'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not bypass consent'),
    jsonb_build_object('key', 'action_item_extractor', 'label', 'Action Item Extractor', 'emoji', '⚙️', 'description', 'Action item scaffolds'),
    jsonb_build_object('key', 'privacy_consent_controls', 'label', 'Privacy & Consent Controls', 'emoji', '🔒', 'description', 'Consent and note-only modes'),
    jsonb_build_object('key', 'meeting_libraries', 'label', 'Meeting knowledge libraries', 'emoji', '🌱', 'description', 'Approved meeting resources')
  ); ${D};
create or replace function public._${bp}_meeting_follow_up_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'meeting_summary_generator', 'label', 'Meeting Summary Generator — metadata summaries, no raw transcripts without policy'),
    jsonb_build_object('key', 'decision_capture_center', 'label', 'Decision Capture Center — decisions and rationale scaffolds'),
    jsonb_build_object('key', 'action_item_extractor', 'label', 'Action Item Extractor — action items for Action Center cross-link'),
    jsonb_build_object('key', 'meeting_follow_up_dashboard', 'label', 'Meeting Follow-Up Dashboard — follow-up status and reminders'),
    jsonb_build_object('key', 'leadership_briefing_reports', 'label', 'Leadership Briefing Reports — executive meeting summaries'),
    jsonb_build_object('key', 'privacy_consent_controls', 'label', 'Privacy & Consent Controls — consent, note-only modes'),
    jsonb_build_object('key', 'action_center_integration', 'label', 'Action Center integration — cross-link Phase 205 and AEF'),
    jsonb_build_object('key', 'meeting_knowledge_libraries', 'label', 'Meeting knowledge libraries — approved meeting resources')
  )); ${D};
create or replace function public._${bp}_meeting_reflection_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Meeting reflection prompts — humans decide what to capture.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'outcomes_captured', 'label', 'Are meeting outcomes captured?'),
    jsonb_build_object('key', 'action_items_clear', 'label', 'Are action items clear?'),
    jsonb_build_object('key', 'consent_respected', 'label', 'Is consent respected?'),
    jsonb_build_object('key', 'follow_up_stalls', 'label', 'Where does follow-up stall?'),
    jsonb_build_object('key', 'leadership_insights', 'label', 'What leadership insights emerge?')
  )); ${D};
create or replace function public._${bp}_follow_up_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Follow-up framework — periodic evaluation.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'summary_clarity', 'label', 'Summary clarity'),
    jsonb_build_object('key', 'decision_capture', 'label', 'Decision capture'),
    jsonb_build_object('key', 'action_extraction', 'label', 'Action extraction'),
    jsonb_build_object('key', 'consent_controls', 'label', 'Consent controls'),
    jsonb_build_object('key', 'privacy_boundaries', 'label', 'Privacy boundaries'),
    jsonb_build_object('key', 'leadership_visibility', 'label', 'Leadership visibility'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); ${D};
create or replace function public._${bp}_leadership_briefing_reviews() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Leadership briefing reviews — executive reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'meeting_effectiveness', 'label', 'Meeting effectiveness'),
    jsonb_build_object('key', 'decision_clarity', 'label', 'Decision clarity'),
    jsonb_build_object('key', 'action_follow_through', 'label', 'Action follow-through'),
    jsonb_build_object('key', 'consent_compliance', 'label', 'Consent compliance'),
    jsonb_build_object('key', 'leadership_insights', 'label', 'Leadership insights')
  )); ${D};
create or replace function public._${bp}_meeting_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports summaries, does not store raw transcripts without policy.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'meeting_summaries', 'label', 'Meeting summaries — metadata only'),
    jsonb_build_object('key', 'decision_highlights', 'label', 'Decision highlights'),
    jsonb_build_object('key', 'action_item_suggestions', 'label', 'Action item suggestions'),
    jsonb_build_object('key', 'consent_reminders', 'label', 'Consent reminders'),
    jsonb_build_object('key', 'follow_up_nudges', 'label', 'Follow-up nudges'),
    jsonb_build_object('key', 'privacy_prompts', 'label', 'Privacy prompts')
  )); ${D};
create or replace function public._${bp}_action_item_extractor() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Action Item Extractor — metadata scaffolds for Action Center cross-link.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'action_detection', 'label', 'Action detection — approved patterns'),
    jsonb_build_object('key', 'owner_assignment', 'label', 'Owner assignment scaffolds'),
    jsonb_build_object('key', 'due_date_suggestions', 'label', 'Due date suggestions'),
    jsonb_build_object('key', 'action_center_cross_link', 'label', 'Action Center cross-link', 'cross_link', '/app/aipify-action-center-execution-engine'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only extraction — no raw transcript content'),
    jsonb_build_object('key', 'human_confirmation', 'label', 'Human confirmation before action creation')
  )); ${D};
create or replace function public._${bp}_privacy_consent_controls() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Privacy & Consent Controls — consent enforced.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'consent_gates', 'label', 'Consent gates before capture'),
    jsonb_build_object('key', 'note_only_modes', 'label', 'Note-only modes'),
    jsonb_build_object('key', 'no_pii_audit', 'label', 'No PII in audit payloads'),
    jsonb_build_object('key', 'transcript_policy', 'label', 'Raw transcript storage requires explicit policy'),
    jsonb_build_object('key', 'audience_scoping', 'label', 'Audience-scoped summaries'),
    jsonb_build_object('key', 'trust_cross_link', 'label', 'Trust Architecture cross-link', 'cross_link', '/app/settings/security')
  )); ${D};
create or replace function public._${bp}_decision_capture_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Decision Capture Center — metadata summaries, human confirmation.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'decision_records', 'label', 'Decision records — metadata'),
    jsonb_build_object('key', 'rationale_scaffolds', 'label', 'Rationale scaffolds'),
    jsonb_build_object('key', 'stakeholder_visibility', 'label', 'Stakeholder visibility controls'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Decision audit trails — no PII'),
    jsonb_build_object('key', 'continuous_improvement', 'label', 'Continuous improvement loops'),
    jsonb_build_object('key', 'no_raw_transcripts', 'label', 'Never store raw transcripts without policy')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Store raw transcripts without policy',
      'Include PII in audit payloads',
      'Bypass consent controls',
      'Duplicate Action Center RPCs',
      'Replace human judgment',
      'Expose unauthorized meeting content'), 'principle', '${P.companion} supports — humans decide what to capture and share.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — clarity, patience, and service toward meaningful meeting follow-up without pressure.', 'values', jsonb_build_array('clarity_before_complexity','speed_before_frustration','patience','service','recognition','confidence_without_overreach'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Meeting audit logs via aipify_meeting_intelligence_follow_up_audit_logs — no PII'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_meeting_intelligence_follow_up permissions'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata/summaries only — Trust Architecture'),
    jsonb_build_object('key', 'consent_controls', 'label', 'Consent controls before capture'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 204, 'key', 'knowledge_discovery', 'label', 'Knowledge Discovery Phase 204', 'route', '/app/aipify-knowledge-discovery-intelligent-search-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 205, 'key', 'action_center_execution', 'label', 'Action Center Phase 205', 'route', '/app/aipify-action-center-execution-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 206, 'key', 'meeting_intelligence', 'label', 'Meeting Intelligence Phase 206', 'route', '/app/${P.slug}', 'description', 'Consent-aware meeting follow-up'),
    jsonb_build_object('key', 'aef_action_center', 'label', 'AEF Action Center', 'route', '/app/action-center', 'description', 'Cross-link only — do not duplicate RPCs')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'action_center_execution', 'label', 'Action Center Phase 205', 'route', '/app/aipify-action-center-execution-engine', 'relationship', 'Action items flow — cross-link only'),
    jsonb_build_object('key', 'aef_action_center', 'label', 'AEF Action Center', 'route', '/app/action-center', 'relationship', 'Autonomous Execution Framework — cross-link only'),
    jsonb_build_object('key', 'trust_actions', 'label', 'Trust & Action Engine', 'route', '/app/approvals', 'relationship', 'Approval gates — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Clarity and patience — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with metadata-only meeting summaries and consent controls. Growth Partner terminology. ${P.companion} supports — never stores raw transcripts without policy or includes PII in audit payloads.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans decide what to capture.', '${P.companion} informs and supports.', 'Consent-aware — metadata/summaries only.', 'Growth Partner — never Affiliate.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — meeting summaries and action signals max ~500 chars. No raw transcripts without policy, PII, or unauthorized content in audit payloads.'; ${D};
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
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_meeting_follow_up_dashboard\(\)->'capabilities'\) = 8,/,
    `jsonb_build_object('key', 'center', 'label', '${P.centerTitle} — eight capabilities', 'met', jsonb_array_length(public._${bp}_meeting_follow_up_dashboard()->'capabilities') = 8,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_meeting_reflection_engine\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Meeting reflection engine — five questions', 'met', jsonb_array_length(public._${bp}_meeting_reflection_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'companion', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_meeting_companion\(\)->'capabilities'\) = 6,/,
    `jsonb_build_object('key', 'companion', 'label', '${P.companion} capabilities', 'met', jsonb_array_length(public._${bp}_meeting_companion()->'capabilities') = 6,`,
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
    "meeting_follow_up_dashboard",
    "meeting_reflection_engine",
    "follow_up_framework",
    "leadership_briefing_reviews",
    "meeting_companion",
    "action_item_extractor",
    "privacy_consent_controls",
    "decision_capture_center",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${bp}_${fn}()`);
  }

  if (!sql.includes("decision_capture_center_meta")) {
    sql = sql.replace(
      `'sub_engine_meta', public._${bp}_action_item_extractor(),`,
      `'sub_engine_meta', public._${bp}_action_item_extractor(), 'privacy_consent_controls_meta', public._${bp}_privacy_consent_controls(), 'decision_capture_center_meta', public._${bp}_decision_capture_center(),`,
    );
  }

  sql = sql.replace(
    /select 'aipify-action-center-execution-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', 206
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`Phase ${P.phase} Aipify[^']+`, "g"),
    `Phase ${P.phase} ${P.title} Engine — meeting intelligence follow-up within Global Command era; cross-link only for Action Center and AEF.`,
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

${P.centerTitle} within ${P.era}. ${P.companion} supports meeting follow-up — does NOT store raw transcripts without policy or include PII in audit payloads.

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
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; metadata/summaries only.";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/${P.slug}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_COMPANION_LIMITATIONS = [\n${P.companionLimitations.map((l) => `  "${l}",`).join("\n")}\n] as const;\n`,
  );
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports meeting summaries, action extraction, and consent controls. Metadata/summaries only — does NOT store raw transcripts without policy or include PII in audit payloads. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Follow-up score",
    modeLabel: "Mode",
    readinessLabel: "Follow-up readiness level",
    executiveReviews: "Leadership briefing reviews",
    activeReflections: "Active reflections",
    humanOversightRequired: `Human oversight required — humans decide what to capture; ${P.companion} supports only`,
    eraOpenerSummary: `Global Command Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate Action Center RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Meeting reflection engine — reflection prompts",
    frameworkLabel: "Follow-up framework",
    reviewsLabel: "Leadership briefing reviews",
    companionLabel: `${P.companion} — supports, does not bypass consent`,
    subEngineLabel: "Action Item Extractor",
    reflections: "Meeting reflection scaffolds",
    executiveReviewEntries: "Briefing review entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT store raw transcripts without policy or include PII in audit payloads`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports meeting follow-up — humans retain capture and sharing authority.`,
      philosophy: "People First. Metadata/summaries only. Growth Partner terminology — never Affiliate.",
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
        ? "Møteoppfølging"
        : locale === "sv"
          ? "Mötesuppföljning"
          : locale === "da"
            ? "Mødeopfølgning"
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
  const entry = `\n**Aipify Meeting Intelligence & Follow-Up Engine (Phase 206):** See [AIPIFY_MEETING_INTELLIGENCE_FOLLOW_UP_ENGINE_PHASE206.md](./AIPIFY_MEETING_INTELLIGENCE_FOLLOW_UP_ENGINE_PHASE206.md) — ${P.centerTitle} for meeting summary generator, decision capture center, action item extractor, leadership briefing reports, privacy & consent controls, Action Center integration, and meeting knowledge libraries. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** storing raw transcripts without policy or PII in audit payloads. Cross-links only: Phase 205 action center, \`/app/action-center\` (AEF). Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 206")) {
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
