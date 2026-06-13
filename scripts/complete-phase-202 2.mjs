#!/usr/bin/env node
/** ABOS Phase 202 — Aipify Unified Workspace Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const P = {
  phase: 202,
  migration: "20261362000000_aipify_unified_workspace_engine_phase202.sql",
  slug: "aipify-unified-workspace-engine",
  base: "AipifyUnifiedWorkspace",
  camel: "aipifyUnifiedWorkspaceEngine",
  snake: "aipify_unified_workspace",
  permPrefix: "aipify_unified_workspace",
  helper: "auwe",
  bp: "auwebp202",
  decisionType: "aipify_unified_workspace_engine",
  prevDecision: "aipify_global_command_center_engine",
  title: "Aipify Unified Workspace",
  centerTitle: "My Workspace Dashboard",
  companion: "Workspace Companion",
  scoreKey: "aipify_unified_workspace_score",
  modeKey: "workspace_productivity_mode",
  levelKey: "workspace_focus_level",
  thirdEntity: "workspace_notes",
  era: "Global Command & Enterprise Operations Era (201–210)",
  eraRange: "201–210",
  docSlug: "AIPIFY_UNIFIED_WORKSPACE_ENGINE",
  ilmFile: "implementation-blueprint-phase202-aipify-unified-workspace.txt",
  navLabel: "Unified Workspace",
  crossLinkNote:
    "Cross-links only: Phase 201 global command center, command_center, attention_guardian, personal_productivity — never duplicate RPCs or override workspace RBAC.",
  ilmExtra: `
My Workspace Dashboard: important info, daily priorities, quick tool access, clean executive design.
Smart Priority Center, Notification Hub, Quick Actions Panel, Workspace Personalization Center, role-specific layouts, Growth Partner workspace views, workspace knowledge libraries.
Workspace Reflection Engine prompts: How do we reduce context switching? What are today's priorities? What is role-relevant now? Focus vs overload? Workspace ownership within governance?
Workspace Framework: productivity, focus, role-based experiences, notification consolidation, quick actions, personalization governance, enterprise scale.
Executive/user reviews: workspace clarity, priority alignment, notification effectiveness, quick action usage, personalization compliance.
Workspace Companion: priority summaries, notification digests, quick action suggestions, personalization guidance.
Sub-engines: Smart Priority Center practices, Notification Hub practices, Personalization Center tracks.
Design principles: enterprise-grade, Microsoft productivity, Apple simplicity, clarity before complexity, focus before feature overload.
Companion limitations: no overriding RBAC, no bypassing governance, no unauthorized data, no determining priorities without context, no replacing human judgment.`,
  faqBody: `## What is the Unified Workspace Engine?

The Unified Workspace Engine provides a personalized, role-aware workspace at \`/app/aipify-unified-workspace-engine\` — consolidating priorities, notifications, quick actions, and approved personalization in one executive-grade dashboard.

## Can Aipify override my workspace permissions?

**No.** Workspace RBAC and governance policies remain authoritative. The Workspace Companion supports — it does not override roles or expose unauthorized data.

## What is the Smart Priority Center?

It surfaces tasks requiring attention with urgency and relevance prioritization — helping focused work without replacing human judgment about what matters most.

## How does personalization work?

The Workspace Personalization Center supports approved layout customization and accessibility preferences within enterprise consistency and personalization governance.

## Why human judgment?

Humans decide priorities and actions. The Workspace Companion offers summaries, digests, and suggestions — never determining priorities without context or replacing judgment.`,
  companionLimitations: [
    "override_rbac",
    "bypass_governance_policies",
    "expose_unauthorized_workspace_data",
    "determine_priorities_without_context",
    "replace_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom198(content) {
  const thirdPascal = P.thirdEntity.split("_").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
  const pairs = [
    ["AipifyOrganizationalHealthEarlyWarning", P.base],
    ["aipify-organizational-health-early-warning-engine", P.slug],
    ["aipify_organizational_health_early_warning", P.snake],
    ["aipifyOrganizationalHealthEarlyWarning", P.camel.replace(/Engine$/, "")],
    ["aipifyOrganizationalHealthEarlyWarningEngine", P.camel],
    ["aohewbp198", P.bp],
    ["_aohew_", `_${P.helper}_`],
    ["aipify_organizational_health_early_warning_score", P.scoreKey],
    ["organizational_health_mode", P.modeKey],
    ["early_warning_sensitivity_level", P.levelKey],
    ["health_notes", P.thirdEntity],
    ["HealthNote", thirdPascal.endsWith("Note") ? thirdPascal : thirdPascal],
    ["health_notes_count", `${P.thirdEntity}_count`],
    ["Organizational Health Dashboard", P.centerTitle],
    ["Health Companion", P.companion],
    ["Aipify Organizational Health & Early Warning", P.title],
    ["Organizational Health", P.navLabel],
    ["Phase 198", `Phase ${P.phase}`],
    ["aipify_organizational_health_early_warning_engine", P.decisionType],
    ["aipify_organizational_health_early_warning.view", `${P.permPrefix}.view`],
    ["aipify_organizational_health_early_warning.manage", `${P.permPrefix}.manage`],
    ["aipify_organizational_health_early_warning.steward", `${P.permPrefix}.steward`],
    ["20261358000000_aipify_organizational_health_early_warning_engine_phase198.sql", P.migration],
    ["Repo Phase 198", `Repo Phase ${P.phase}`],
    ["Phase 198 —", `Phase ${P.phase} —`],
    ["IMPLEMENTATION_BLUEPRINT_PHASE198_AIPIFY_ORGANIZATIONAL_HEALTH_EARLY_WARNING_ENGINE", `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`],
    ["implementation-blueprint-phase198", `implementation-blueprint-phase${P.phase}`],
    ["organizational_health_dashboard", "workspace_dashboard"],
    ["health_reflection_engine", "workspace_reflection_engine"],
    ["health_framework", "workspace_framework"],
    ["executive_health_reviews", "executive_workspace_reviews"],
    ["health_companion", "workspace_companion"],
    ["early_warning_monitor", "smart_priority_center"],
    ["resolution_tracker_engine", "personalization_center"],
    ["Executive Health Reviews", "Executive & User Workspace Reviews"],
    ["organizational health within", "unified workspace within"],
    ["_seed_health_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["conduct employee surveillance", "override workspace RBAC"],
    ["take punitive actions", "bypass governance policies"],
    ["Health Companion supports", "Workspace Companion supports"],
    ["never surveils employees or takes punitive actions", "never overrides RBAC or exposes unauthorized data"],
    ["supports — does not surveil", "supports — does not override governance"],
    ["supports early awareness, does not surveil or punish", "supports productivity and focus, does not override RBAC or determine priorities without context"],
    ["not_surveillance", "rbac_respected"],
    ["Perpetual Stewardship & Constitutional Governance Era (191–200)", P.era],
    ["Perpetual Stewardship Era (191–200)", P.era],
    ["191–200", P.eraRange],
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
  const src = path.join(ROOT, "lib/aipify/aipify-organizational-health-early-warning-engine");
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom198(fs.readFileSync(path.join(src, f), "utf8")));
  }
  const panel = path.join(ROOT, "components/app/aipify-organizational-health-early-warning-engine/AipifyOrganizationalHealthEarlyWarningEngineDashboardPanel.tsx");
  write(
    path.join(ROOT, `components/app/${P.slug}/${engine}DashboardPanel.tsx`),
    transformFrom198(fs.readFileSync(panel, "utf8")),
  );
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${engine}DashboardPanel } from "./${engine}DashboardPanel";\n`);
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom198(fs.readFileSync(path.join(ROOT, "app/app/aipify-organizational-health-early-warning-engine/page.tsx"), "utf8")),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom198(fs.readFileSync(path.join(ROOT, `app/api/aipify/aipify-organizational-health-early-warning-engine/${route}/route.ts`), "utf8")),
    );
  }
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports productivity and focus — NOT override RBAC or expose unauthorized data. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Provide a unified, role-aware workspace — important information, daily priorities, consolidated notifications, quick actions, and governed personalization in one executive-grade dashboard.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Global Command & Enterprise Operations Era (${P.eraRange}). Clarity before complexity; focus before feature overload; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where every user has a calm, role-relevant workspace — priorities clear, notifications consolidated, actions within reach, and personalization governed at enterprise scale.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '🎯', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'workspace_reflection_engine', 'label', 'Workspace reflection engine', 'emoji', '🪞', 'description', 'Focus and context reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Workspace framework', 'emoji', '🛡️', 'description', 'Seven workspace domains'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive and user workspace reviews', 'emoji', '👥', 'description', 'Workspace clarity and alignment reflection'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not override governance'),
    jsonb_build_object('key', 'smart_priority_center', 'label', 'Smart Priority Center', 'emoji', '⚙️', 'description', 'Urgency and relevance prioritization'),
    jsonb_build_object('key', 'personalization_center', 'label', 'Personalization Center', 'emoji', '📖', 'description', 'Governed layout and accessibility tracks'),
    jsonb_build_object('key', 'knowledge_libraries', 'label', 'Workspace knowledge libraries', 'emoji', '🌱', 'description', 'Non-technical workspace resources')
  ); ${D};
create or replace function public._${bp}_workspace_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'workspace_dashboard', 'label', 'My Workspace Dashboard — important info, daily priorities, quick tool access, clean executive design'),
    jsonb_build_object('key', 'smart_priority_center', 'label', 'Smart Priority Center — tasks requiring attention with urgency and relevance'),
    jsonb_build_object('key', 'notification_hub', 'label', 'Notification Hub — consolidated alerts, reminders, configurable preferences'),
    jsonb_build_object('key', 'quick_actions_panel', 'label', 'Quick Actions Panel — workflow shortcuts and role-specific functionality'),
    jsonb_build_object('key', 'personalization_center', 'label', 'Workspace Personalization Center — approved layout customization and accessibility'),
    jsonb_build_object('key', 'role_specific_layouts', 'label', 'Role-specific layouts — experiences tailored to workspace role'),
    jsonb_build_object('key', 'growth_partner_views', 'label', 'Growth Partner workspace views — partner-scoped workspace surfaces'),
    jsonb_build_object('key', 'workspace_knowledge_libraries', 'label', 'Workspace knowledge libraries — clear non-technical guidance')
  )); ${D};
create or replace function public._${bp}_workspace_reflection_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Workspace reflection prompts — humans decide priorities.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'context_switching', 'label', 'How do we reduce context switching?'),
    jsonb_build_object('key', 'daily_priorities', 'label', 'What are today''s priorities?'),
    jsonb_build_object('key', 'role_relevance', 'label', 'What is role-relevant right now?'),
    jsonb_build_object('key', 'focus_vs_overload', 'label', 'Are we focused or overloaded?'),
    jsonb_build_object('key', 'workspace_ownership', 'label', 'How is workspace ownership exercised within governance?')
  )); ${D};
create or replace function public._${bp}_workspace_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Workspace framework — periodic evaluation.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'productivity', 'label', 'Productivity'),
    jsonb_build_object('key', 'focus', 'label', 'Focus'),
    jsonb_build_object('key', 'role_based_experiences', 'label', 'Role-based experiences'),
    jsonb_build_object('key', 'notification_consolidation', 'label', 'Notification consolidation'),
    jsonb_build_object('key', 'quick_actions', 'label', 'Quick actions'),
    jsonb_build_object('key', 'personalization_governance', 'label', 'Personalization governance'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); ${D};
create or replace function public._${bp}_executive_workspace_reviews() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive and user workspace reviews — clarity and alignment reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'workspace_clarity', 'label', 'Workspace clarity'),
    jsonb_build_object('key', 'priority_alignment', 'label', 'Priority alignment'),
    jsonb_build_object('key', 'notification_effectiveness', 'label', 'Notification effectiveness'),
    jsonb_build_object('key', 'quick_action_usage', 'label', 'Quick action usage'),
    jsonb_build_object('key', 'personalization_compliance', 'label', 'Personalization compliance')
  )); ${D};
create or replace function public._${bp}_workspace_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports productivity, does not override governance.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'priority_summaries', 'label', 'Priority summaries'),
    jsonb_build_object('key', 'notification_digests', 'label', 'Notification digests'),
    jsonb_build_object('key', 'quick_action_suggestions', 'label', 'Quick action suggestions'),
    jsonb_build_object('key', 'personalization_guidance', 'label', 'Personalization guidance'),
    jsonb_build_object('key', 'focus_insights', 'label', 'Focus insights'),
    jsonb_build_object('key', 'workspace_trends', 'label', 'Workspace trend insights')
  )); ${D};
create or replace function public._${bp}_smart_priority_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Smart Priority Center — urgency and relevance, never replacing judgment.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'attention_tasks', 'label', 'Tasks requiring attention'),
    jsonb_build_object('key', 'urgency_ranking', 'label', 'Urgency prioritization'),
    jsonb_build_object('key', 'relevance_ranking', 'label', 'Role relevance ranking'),
    jsonb_build_object('key', 'focused_work', 'label', 'Focused work surfaces'),
    jsonb_build_object('key', 'context_awareness', 'label', 'Context-aware priority hints'),
    jsonb_build_object('key', 'human_judgment', 'label', 'Human judgment retained')
  )); ${D};
create or replace function public._${bp}_personalization_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Personalization Center — governed customization and accessibility tracks.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'layout_customization', 'label', 'Approved layout customization'),
    jsonb_build_object('key', 'accessibility_preferences', 'label', 'Accessibility preferences'),
    jsonb_build_object('key', 'enterprise_consistency', 'label', 'Enterprise consistency standards'),
    jsonb_build_object('key', 'notification_hub_practices', 'label', 'Notification Hub practices'),
    jsonb_build_object('key', 'governance_compliance', 'label', 'Personalization governance compliance'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Audit trails of personalization changes')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Override RBAC',
      'Bypass governance policies',
      'Expose unauthorized workspace data',
      'Determine user priorities without context',
      'Replace human judgment',
      'Hide audit trails'), 'principle', '${P.companion} supports — humans decide priorities and actions.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm workspace, clarity over complexity, patience with overload, service through focus.', 'values', jsonb_build_array('clarity_over_complexity','focus_before_overload','patience','service','recognition','confidence_without_pressure'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Workspace audit logs via aipify_unified_workspace_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Workspace RBAC via aipify_unified_workspace permissions'),
    jsonb_build_object('key', 'personalization_governance', 'label', 'Personalization governance — approved changes only'),
    jsonb_build_object('key', 'documentation_controls', 'label', 'Workspace documentation access controls'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 198, 'key', 'organizational_health', 'label', 'Organizational Health Phase 198', 'route', '/app/aipify-organizational-health-early-warning-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 199, 'key', 'strategic_alignment', 'label', 'Strategic Alignment Phase 199', 'route', '/app/aipify-strategic-alignment-prioritization-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 201, 'key', 'global_command_center', 'label', 'Global Command Center Phase 201', 'route', '/app/aipify-global-command-center-engine', 'description', 'Prior era engine — cross-link only'),
    jsonb_build_object('phase', 202, 'key', 'unified_workspace', 'label', 'Unified Workspace Phase 202', 'route', '/app/${P.slug}', 'description', 'My Workspace Dashboard and workspace surfaces'),
    jsonb_build_object('phase', 203, 'key', 'era_continuity', 'label', 'Global Command Era continuity', 'route', '/app/command-center', 'description', 'Command center cross-link — not duplicate RPCs')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'global_command_center', 'label', 'Global Command Center Phase 201', 'route', '/app/aipify-global-command-center-engine', 'relationship', 'Prior phase — cross-link only'),
    jsonb_build_object('key', 'command_center', 'label', 'Command Center', 'route', '/app/command-center', 'relationship', 'Notification and executive feed — cross-link only'),
    jsonb_build_object('key', 'attention_guardian', 'label', 'Attention Guardian', 'route', '/app/assistant/attention', 'relationship', 'Focus and attention — cross-link only'),
    jsonb_build_object('key', 'personal_productivity', 'label', 'Personal Productivity', 'route', '/app/personal-productivity', 'relationship', 'Individual productivity — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with metadata-only workspace indicators and priority scaffolds. Growth Partner terminology. ${P.companion} supports — never overrides RBAC or exposes unauthorized data.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans decide priorities.', '${P.companion} informs and supports.', 'Clarity before complexity — focus before feature overload.', 'Growth Partner — never Affiliate.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — workspace review summaries max ~500 chars. No PII, unauthorized data exposure, or RBAC bypass.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.prevDecision}'`)) return sql;
  return sql.replace(
    `'${P.decisionType}'`,
    `'aipify_organizational_health_early_warning_engine',\n    'aipify_strategic_alignment_prioritization_engine',\n    '${P.prevDecision}',\n    '${P.decisionType}'`,
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
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_workspace_dashboard\(\)->'capabilities'\) = 8,/,
    `jsonb_build_object('key', 'center', 'label', '${P.centerTitle} — eight capabilities', 'met', jsonb_array_length(public._${bp}_workspace_dashboard()->'capabilities') = 8,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_workspace_reflection_engine\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Workspace reflection engine — five questions', 'met', jsonb_array_length(public._${bp}_workspace_reflection_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'companion', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_workspace_companion\(\)->'capabilities'\) = 6,/,
    `jsonb_build_object('key', 'companion', 'label', '${P.companion} capabilities', 'met', jsonb_array_length(public._${bp}_workspace_companion()->'capabilities') = 6,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases documented', 'met', jsonb_array_length(public._${bp}_era_opener_summary()) = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'baseline', 'label', 'Repo Phase \d+ baseline tables'/,
    `jsonb_build_object('key', 'baseline', 'label', 'Repo Phase ${P.phase} baseline tables'`,
  );

  for (const fn of [
    "workspace_dashboard",
    "workspace_reflection_engine",
    "workspace_framework",
    "executive_workspace_reviews",
    "workspace_companion",
    "smart_priority_center",
    "personalization_center",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${bp}_${fn}()`);
  }

  if (!sql.includes("personalization_center_meta")) {
    sql = sql.replace(
      `'sub_engine_meta', public._${bp}_smart_priority_center(),`,
      `'sub_engine_meta', public._${bp}_smart_priority_center(), 'personalization_center_meta', public._${bp}_personalization_center(),`,
    );
  }

  sql = sql.replace(
    /select 'aipify-organizational-health-early-warning-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', 202
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`Phase ${P.phase} Aipify[^']+`, "g"),
    `Phase ${P.phase} ${P.title} Engine — unified workspace within Global Command era; cross-link only for related engines.`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replace(
    /'title', 'Aipify Unified Workspace Engine'/g,
    `'title', '${P.title} Engine'`,
  );

  return sql;
}

function genMigration() {
  const src198 = path.join(ROOT, "supabase/migrations/20261358000000_aipify_organizational_health_early_warning_engine_phase198.sql");
  if (!fs.existsSync(src198)) {
    throw new Error("Phase 198 migration required — ensure migration exists");
  }
  let m = transformFrom198(fs.readFileSync(src198, "utf8"));
  m = m.replace(/_aohew_seed_health_notes/g, `_auwe_seed_${P.thirdEntity.replace("_notes", "")}_notes`);
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports productivity and focus — does NOT override RBAC or expose unauthorized data.

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
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never overrides RBAC.";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/${P.slug}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_COMPANION_LIMITATIONS = [\n${P.companionLimitations.map((l) => `  "${l}",`).join("\n")}\n] as const;\n`,
  );
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports priorities, notifications, quick actions, and governed personalization. Supports humans — does NOT override RBAC or expose unauthorized data. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Workspace score",
    modeLabel: "Productivity mode",
    readinessLabel: "Focus level",
    executiveReviews: "Executive and user workspace reviews",
    activeReflections: "Active reflections",
    humanOversightRequired: `Human oversight required — humans decide priorities; ${P.companion} supports only`,
    eraOpenerSummary: `Global Command & Enterprise Operations Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate era engine RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Workspace reflection engine — reflection prompts",
    frameworkLabel: "Workspace framework",
    reviewsLabel: "Executive and user workspace reviews",
    companionLabel: `${P.companion} — supports, does not override governance`,
    subEngineLabel: "Smart Priority Center",
    reflections: "Workspace reflection scaffolds",
    executiveReviewEntries: "Workspace review entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT override RBAC or bypass governance`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports calm, role-relevant workspaces — humans retain priority authority.`,
      philosophy: "People First. Clarity before complexity. Focus before feature overload. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
    },
  };
}

function patchNav() {
  let c = fs.readFileSync(path.join(ROOT, "lib/app/nav-config.ts"), "utf8");
  const id = P.camel;
  const href = `/app/${P.slug}`;
  if (!c.includes(`"${id}"`)) {
    c = c.replace('| "aipifyStrategicAlignmentPrioritizationEngine"', `| "aipifyStrategicAlignmentPrioritizationEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    c = c.replace(
      /id: "aipifyStrategicAlignmentPrioritizationEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyStrategicAlignmentPrioritizationEngine",\n  },/,
      (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-strategic-alignment-prioritization-engine")) {\n    return "aipifyStrategicAlignmentPrioritizationEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-strategic-alignment-prioritization-engine")) {\n    return "aipifyStrategicAlignmentPrioritizationEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
  console.log("patched nav-config");
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_strategic_alignment_prioritization.steward",', `"aipify_strategic_alignment_prioritization.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
  console.log("patched permissions");
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-strategic-alignment-prioritization-engine";',
      `export * from "./aipify-strategic-alignment-prioritization-engine";\nexport * from "./${P.slug}";`,
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
        ? "Enhetlig arbeidsområde"
        : locale === "sv"
          ? "Enhetlig arbetsyta"
          : locale === "da"
            ? "Samlet arbejdsområde"
            : P.navLabel;
    data[P.camel] = block;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchIlm() {
  let c = fs.readFileSync(path.join(ROOT, "lib/internal-language-model/index.ts"), "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    const anchor = c.includes("phase199-vocabulary")
      ? 'export * from "./implementation-blueprint-phase199-vocabulary";'
      : 'export * from "./implementation-blueprint-phase198-vocabulary";';
    c = c.replace(anchor, `${anchor}\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`);
  }
  const corpus = `aipify-core/knowledge/internal-language-model/${P.ilmFile}`;
  if (!c.includes(corpus)) {
    const corpusAnchor = c.includes("phase199")
      ? '"aipify-core/knowledge/internal-language-model/implementation-blueprint-phase199-aipify-strategic-alignment-prioritization.txt";'
      : '"aipify-core/knowledge/internal-language-model/implementation-blueprint-phase198-aipify-organizational-health-early-warning.txt";';
    c = c.replace(
      corpusAnchor,
      `${corpusAnchor}\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "${corpus}";`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/internal-language-model/index.ts"), c);
  console.log("patched ilm index");
}

function patchArchitecture() {
  let c = fs.readFileSync(path.join(ROOT, "ARCHITECTURE.md"), "utf8");
  const entry = `\n**Aipify Unified Workspace Engine (Phase 202):** See [AIPIFY_UNIFIED_WORKSPACE_ENGINE_PHASE202.md](./AIPIFY_UNIFIED_WORKSPACE_ENGINE_PHASE202.md) — ${P.centerTitle} for Smart Priority Center, Notification Hub, Quick Actions Panel, Workspace Personalization Center, role-specific layouts, Growth Partner workspace views, and workspace knowledge libraries. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** RBAC override or unauthorized data exposure. Cross-links only: Phase 201 global command center, command_center, attention_guardian. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 202")) {
    const marker = c.includes("Phase 199")
      ? "Permissions `aipify_strategic_alignment_prioritization.steward`."
      : c.includes("Phase 198")
        ? "Permissions `aipify_organizational_health_early_warning.steward`."
        : "Permissions `aipify_decision_transparency.steward`.";
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
console.log("Phase 202 complete");
