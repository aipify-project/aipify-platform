#!/usr/bin/env node
/** ABOS Phase 201 — Aipify Global Command Center Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const P = {
  phase: 201,
  migration: "20261361000000_aipify_global_command_center_engine_phase201.sql",
  slug: "aipify-global-command-center-engine",
  base: "AipifyGlobalCommandCenter",
  camel: "aipifyGlobalCommandCenterEngine",
  snake: "aipify_global_command_center",
  permPrefix: "aipify_global_command_center",
  helper: "agcce",
  bp: "agccebp201",
  decisionType: "aipify_global_command_center_engine",
  prevDecision: "aipify_strategic_alignment_prioritization_engine",
  title: "Aipify Global Command Center",
  centerTitle: "Global Command Center",
  companion: "Command Center Companion",
  scoreKey: "aipify_global_command_center_score",
  modeKey: "global_command_mode",
  levelKey: "command_readiness_level",
  thirdEntity: "command_notes",
  era: "Global Command & Enterprise Operations Era (201–210)",
  eraRange: "201–210",
  docSlug: "AIPIFY_GLOBAL_COMMAND_CENTER_ENGINE",
  ilmFile: "implementation-blueprint-phase201-aipify-global-command-center.txt",
  navLabel: "Global Command Center",
  crossLinkNote:
    "Cross-links only: Phase 199 strategic alignment, Phase 198 organizational health, command_center, decision_support_engine — never duplicate RPCs or make leadership decisions.",
  ilmExtra: `
Global Command Center: global overview dashboard, department status center, leadership briefing panel, command center alerts, cross-organization insights, enterprise-scale indicators, executive-friendly language summaries, command center knowledge libraries.
Command Reflection Engine prompts: Enterprise visibility? Operational awareness? Information fragmentation? Leadership attention areas? Decision readiness?
Command Framework: enterprise visibility, operational awareness, cross-functional coordination, leadership briefings, alert prioritization, global coordination, enterprise scale.
Executive Command Reviews, Command Center Companion, Department Status Center, Command Center Alerts, Cross-Organization Insights.
Design principles: enterprise-grade, Microsoft-inspired productivity, Apple-inspired simplicity, clarity before complexity.
Companion limitations: no making leadership decisions, no exposing unauthorized global data, no overriding RBAC, no determining org strategy, no replacing executive judgment.`,
  faqBody: `## What is the Global Command Center?

The Global Command Center provides enterprise-wide operational visibility — org status, department summaries, leadership briefings, and critical alerts — at \`/app/aipify-global-command-center-engine\`.

## Can Aipify make leadership decisions?

**No.** The Command Center Companion summarizes and informs — it does not make leadership decisions, determine org strategy, or replace executive judgment.

## Why department status and cross-org insights?

Enterprise operations require visibility across functions. Department Status Center and Cross-Organization Insights surface patterns and collaboration opportunities — metadata only, RBAC-scoped.

## Global RBAC and sensitive data?

Global RBAC protects sensitive information. The companion never exposes unauthorized global data or overrides role-based access controls.

## Why human leadership?

Humans remain responsible for strategic and operational decisions. The Command Center Companion prepares briefings and alerts — leadership decides.`,
  companionLimitations: [
    "make_leadership_decisions",
    "expose_unauthorized_global_data",
    "override_rbac",
    "determine_org_strategy",
    "replace_executive_judgment",
    "auto_escalate_without_approval",
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
    ["organizational_health_dashboard", "global_command_center_dashboard"],
    ["health_reflection_engine", "command_reflection_engine"],
    ["health_framework", "command_framework"],
    ["executive_health_reviews", "executive_command_reviews"],
    ["health_companion", "command_center_companion"],
    ["early_warning_monitor", "department_status_center"],
    ["resolution_tracker_engine", "command_center_alerts"],
    ["Executive Health Reviews", "Executive Command Reviews"],
    ["organizational health within", "global command center within"],
    ["_seed_health_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["conduct employee surveillance", "make leadership decisions"],
    ["take punitive actions", "expose unauthorized global data"],
    ["Health Companion supports", "Command Center Companion supports"],
    ["never surveils employees or takes punitive actions", "never makes leadership decisions or exposes unauthorized data"],
    ["supports — does not surveil", "supports — does not decide"],
    ["supports early awareness, does not surveil or punish", "supports enterprise visibility, does not make leadership decisions"],
    ["Perpetual Stewardship & Constitutional Governance Era (191–200)", P.era],
    ["Perpetual Stewardship Era (191–200)", P.era],
    ["Perpetual Stewardship Era — Phases 191–200", `${P.era} — Phases ${P.eraRange}`],
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
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports enterprise visibility — NOT leadership decisions or RBAC overrides. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Provide enterprise-wide operational visibility — org status, department summaries, leadership briefings, critical alerts, and cross-organization insights — humans decide; companion informs.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within ${P.era}. Enterprise-grade clarity; ${P.companion} informs and supports — never decides.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where leaders see enterprise-wide status clearly, coordinate across departments, and act with informed confidence — clarity before complexity.'; ${D};
create or replace function public._${bp}_design_principles() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principles', jsonb_build_array(
    jsonb_build_object('key', 'enterprise_grade', 'label', 'Enterprise-grade operational visibility'),
    jsonb_build_object('key', 'microsoft_productivity', 'label', 'Microsoft-inspired productivity patterns'),
    jsonb_build_object('key', 'apple_simplicity', 'label', 'Apple-inspired simplicity'),
    jsonb_build_object('key', 'clarity_before_complexity', 'label', 'Clarity before complexity')
  )); ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '🌐', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'command_reflection_engine', 'label', 'Command reflection engine', 'emoji', '🪞', 'description', 'Enterprise visibility reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Command framework', 'emoji', '🛡️', 'description', 'Seven enterprise domains'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive command reviews', 'emoji', '👥', 'description', 'Leadership briefing reflection'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not decide'),
    jsonb_build_object('key', 'department_status_center', 'label', 'Department Status Center', 'emoji', '⚙️', 'description', 'Business function health scaffolds'),
    jsonb_build_object('key', 'command_center_alerts', 'label', 'Command Center Alerts', 'emoji', '🚨', 'description', 'Critical event and escalation scaffolds'),
    jsonb_build_object('key', 'knowledge_libraries', 'label', 'Command center knowledge libraries', 'emoji', '📖', 'description', 'Executive-friendly resources')
  ); ${D};
create or replace function public._${bp}_global_command_center_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'global_overview_dashboard', 'label', 'Global Overview Dashboard — org status, department summaries, emerging priorities, role-specific views'),
    jsonb_build_object('key', 'department_status_center', 'label', 'Department Status Center — business function health, operational summaries, bottlenecks'),
    jsonb_build_object('key', 'leadership_briefing_panel', 'label', 'Leadership Briefing Panel — concise executive summaries and review recommendations'),
    jsonb_build_object('key', 'command_center_alerts', 'label', 'Command Center Alerts — critical events, urgency prioritization, escalation workflows'),
    jsonb_build_object('key', 'cross_organization_insights', 'label', 'Cross-Organization Insights — relationships between areas, collaboration opportunities'),
    jsonb_build_object('key', 'enterprise_scale_indicators', 'label', 'Enterprise-scale indicators — metadata-only operational signals'),
    jsonb_build_object('key', 'executive_language_summaries', 'label', 'Executive-friendly language summaries — clear non-technical briefings'),
    jsonb_build_object('key', 'command_knowledge_libraries', 'label', 'Command center knowledge libraries — enterprise coordination resources')
  )); ${D};
create or replace function public._${bp}_command_reflection_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Command reflection prompts — humans decide actions.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'enterprise_visibility', 'label', 'What is our enterprise visibility across departments?'),
    jsonb_build_object('key', 'operational_awareness', 'label', 'Where is operational awareness strong or weak?'),
    jsonb_build_object('key', 'information_fragmentation', 'label', 'Where does information fragmentation block coordination?'),
    jsonb_build_object('key', 'leadership_attention', 'label', 'What leadership attention areas need review?'),
    jsonb_build_object('key', 'decision_readiness', 'label', 'How ready are we for upcoming decisions?')
  )); ${D};
create or replace function public._${bp}_command_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Command framework — periodic enterprise evaluation.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'enterprise_visibility', 'label', 'Enterprise visibility'),
    jsonb_build_object('key', 'operational_awareness', 'label', 'Operational awareness'),
    jsonb_build_object('key', 'cross_functional_coordination', 'label', 'Cross-functional coordination'),
    jsonb_build_object('key', 'leadership_briefings', 'label', 'Leadership briefings'),
    jsonb_build_object('key', 'alert_prioritization', 'label', 'Alert prioritization'),
    jsonb_build_object('key', 'global_coordination', 'label', 'Global coordination'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); ${D};
create or replace function public._${bp}_executive_command_reviews() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive command reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'global_status', 'label', 'Global status overview'),
    jsonb_build_object('key', 'department_health', 'label', 'Department health summaries'),
    jsonb_build_object('key', 'leadership_briefings', 'label', 'Leadership briefing reviews'),
    jsonb_build_object('key', 'critical_alerts', 'label', 'Critical alerts and escalations'),
    jsonb_build_object('key', 'cross_org_insights', 'label', 'Cross-organization insights')
  )); ${D};
create or replace function public._${bp}_command_center_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports visibility, does not make leadership decisions.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'global_summaries', 'label', 'Global summaries'),
    jsonb_build_object('key', 'briefing_panels', 'label', 'Briefing panels'),
    jsonb_build_object('key', 'alert_insights', 'label', 'Alert insights'),
    jsonb_build_object('key', 'department_status', 'label', 'Department status summaries'),
    jsonb_build_object('key', 'cross_org_recommendations', 'label', 'Cross-org recommendations'),
    jsonb_build_object('key', 'executive_language', 'label', 'Executive-friendly language summaries')
  )); ${D};
create or replace function public._${bp}_department_status_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Department Status Center — business function health, RBAC-scoped.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'function_health', 'label', 'Business function health indicators'),
    jsonb_build_object('key', 'operational_summaries', 'label', 'Operational summaries by department'),
    jsonb_build_object('key', 'bottleneck_detection', 'label', 'Bottleneck detection — aggregate metadata'),
    jsonb_build_object('key', 'role_specific_views', 'label', 'Role-specific views via global RBAC'),
    jsonb_build_object('key', 'department_coordination', 'label', 'Department coordination signals'),
    jsonb_build_object('key', 'no_unauthorized_data', 'label', 'Never expose unauthorized global data')
  )); ${D};
create or replace function public._${bp}_command_center_alerts() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Command Center Alerts — critical events with escalation workflows.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'critical_events', 'label', 'Critical event detection'),
    jsonb_build_object('key', 'urgency_prioritization', 'label', 'Urgency prioritization'),
    jsonb_build_object('key', 'escalation_workflows', 'label', 'Escalation workflow scaffolds'),
    jsonb_build_object('key', 'alert_audit', 'label', 'Alert audit trails'),
    jsonb_build_object('key', 'leadership_routing', 'label', 'Leadership routing recommendations'),
    jsonb_build_object('key', 'no_auto_decisions', 'label', 'Never auto-decide leadership actions'),
    jsonb_build_object('key', 'sensitive_protection', 'label', 'Sensitive information protected')
  )); ${D};
create or replace function public._${bp}_cross_organization_insights() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Cross-Organization Insights — enterprise-wide thinking, metadata only.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'area_relationships', 'label', 'Relationships between organizational areas'),
    jsonb_build_object('key', 'collaboration_opportunities', 'label', 'Collaboration opportunities'),
    jsonb_build_object('key', 'enterprise_patterns', 'label', 'Enterprise-wide pattern detection'),
    jsonb_build_object('key', 'coordination_gaps', 'label', 'Coordination gap identification'),
    jsonb_build_object('key', 'cross_function_links', 'label', 'Cross-functional link summaries'),
    jsonb_build_object('key', 'rbac_scoped', 'label', 'RBAC-scoped insights only'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Audit trails of insight reviews')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Making leadership decisions',
      'Exposing unauthorized global data',
      'Overriding RBAC',
      'Determining org strategy',
      'Replacing executive judgment',
      'Auto-escalating without approval'), 'principle', '${P.companion} supports — humans decide.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm leadership visibility, clarity, and service toward coordinated teams.', 'values', jsonb_build_array('clarity','humility','patience','service','recognition','confidence_without_control'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Command center audit logs via aipify_global_command_center_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Global RBAC via aipify_global_command_center permissions'),
    jsonb_build_object('key', 'sensitive_protection', 'label', 'Sensitive information protected — metadata only'),
    jsonb_build_object('key', 'documentation_controls', 'label', 'Command center documentation access controls'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 201, 'key', 'global_command_center', 'label', 'Global Command Center Phase 201', 'route', '/app/${P.slug}', 'description', 'Era opener — enterprise-wide command center'),
    jsonb_build_object('phase', 199, 'key', 'strategic_alignment', 'label', 'Strategic Alignment Phase 199', 'route', '/app/aipify-strategic-alignment-prioritization-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 198, 'key', 'organizational_health', 'label', 'Organizational Health Phase 198', 'route', '/app/aipify-organizational-health-early-warning-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 197, 'key', 'decision_transparency', 'label', 'Decision Transparency Phase 197', 'route', '/app/aipify-decision-transparency-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 196, 'key', 'principles_enforcement', 'label', 'Principles Enforcement Phase 196', 'route', '/app/aipify-principles-enforcement-engine', 'description', 'Cross-link only')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'command_center', 'label', 'Command Center', 'route', '/app/command-center', 'relationship', 'Notification and quick actions — cross-link only'),
    jsonb_build_object('key', 'decision_support', 'label', 'Decision Support Engine', 'route', '/app/assistant/decisions', 'relationship', 'Leadership guidance — cross-link only'),
    jsonb_build_object('key', 'attention_guardian', 'label', 'Attention Guardian', 'route', '/app/assistant/attention', 'relationship', 'Focus and attention — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Calm leadership — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with metadata-only enterprise indicators and command center scaffolds. Growth Partner terminology. ${P.companion} supports — never makes leadership decisions or overrides RBAC.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans decide.', '${P.companion} informs and supports.', 'Global RBAC — sensitive data protected.', 'Growth Partner — never Affiliate.', 'Clarity before complexity.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — aggregate trends, executive briefing summaries max ~500 chars. No PII, unauthorized global data, or RBAC overrides.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`) && sql.includes(`'${P.prevDecision}'`)) return sql;
  const additions = [];
  for (const entry of [
    "aipify_executive_operating_system_founders_cockpit_engine",
    P.prevDecision,
    P.decisionType,
  ]) {
    if (!sql.includes(`'${entry}'`)) additions.push(`'${entry}'`);
  }
  if (additions.length === 0) return sql;
  return sql.replace(
    "'aipify_strategic_alignment_prioritization_engine'",
    `'aipify_strategic_alignment_prioritization_engine',\n    ${additions.join(",\n    ")}`,
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
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_[a-z_]+\(\)->'capabilities'\) = 8,/,
    `jsonb_build_object('key', 'center', 'label', '${P.centerTitle} — eight capabilities', 'met', jsonb_array_length(public._${bp}_global_command_center_dashboard()->'capabilities') = 8,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_[a-z_]+\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Command reflection engine — five questions', 'met', jsonb_array_length(public._${bp}_command_reflection_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'companion', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_[a-z_]+\(\)->'capabilities'\) = 6,/,
    `jsonb_build_object('key', 'companion', 'label', '${P.companion} capabilities', 'met', jsonb_array_length(public._${bp}_command_center_companion()->'capabilities') = 6,`,
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
    "global_command_center_dashboard",
    "command_reflection_engine",
    "command_framework",
    "executive_command_reviews",
    "command_center_companion",
    "department_status_center",
    "command_center_alerts",
    "cross_organization_insights",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${bp}_${fn}()`);
  }

  if (!sql.includes("cross_organization_insights_meta")) {
    sql = sql.replace(
      `'command_center_alerts_meta', public._${bp}_command_center_alerts(),`,
      `'command_center_alerts_meta', public._${bp}_command_center_alerts(), 'cross_organization_insights_meta', public._${bp}_cross_organization_insights(),`,
    );
    sql = sql.replace(
      `'resolution_tracker_engine_meta', public._${bp}_command_center_alerts(),`,
      `'command_center_alerts_meta', public._${bp}_command_center_alerts(), 'cross_organization_insights_meta', public._${bp}_cross_organization_insights(),`,
    );
    sql = sql.replace(
      `'sub_engine_meta', public._${bp}_department_status_center(),`,
      `'sub_engine_meta', public._${bp}_department_status_center(), 'command_center_alerts_meta', public._${bp}_command_center_alerts(), 'cross_organization_insights_meta', public._${bp}_cross_organization_insights(),`,
    );
  }

  sql = sql.replace(
    /select 'aipify-organizational-health-early-warning-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', 201
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`Phase ${P.phase} Aipify[^']+`, "g"),
    `Phase ${P.phase} ${P.title} Engine — global command center within ${P.era}; cross-link only for related engines.`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  return sql;
}

function genMigration() {
  const src198 = path.join(ROOT, "supabase/migrations/20261358000000_aipify_organizational_health_early_warning_engine_phase198.sql");
  if (!fs.existsSync(src198)) {
    throw new Error("Phase 198 migration required — ensure migration exists");
  }
  let m = transformFrom198(fs.readFileSync(src198, "utf8"));
  m = m.replace(/_agcce_seed_command_notes/g, `_agcce_seed_${P.thirdEntity.replace("_notes", "")}_notes`);
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports enterprise visibility — does NOT make leadership decisions or override RBAC.

## Permissions

- \`${P.permPrefix}.view\` · \`${P.permPrefix}.manage\` · \`${P.permPrefix}.steward\`

## Helpers

- Engine: \`_${P.helper}_*\` · Blueprint: \`_${P.bp}_*\`

${P.crossLinkNote}
`,
  );
  write(
    path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
    `# Implementation Blueprint — Phase ${P.phase} ${P.title} Engine\n\nRoute: \`/app/${P.slug}\`\nEra: ${P.era}\nDesign: enterprise-grade, Microsoft-inspired productivity, Apple-inspired simplicity, clarity before complexity.\n${P.crossLinkNote}\n`,
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
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never decides.";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/${P.slug}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_COMPANION_LIMITATIONS = [\n${P.companionLimitations.map((l) => `  "${l}",`).join("\n")}\n] as const;\n`,
  );
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports global overview, department status, leadership briefings, and command center alerts. Supports humans — does NOT make leadership decisions or override RBAC. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Command readiness score",
    modeLabel: "Mode",
    readinessLabel: "Command readiness level",
    executiveReviews: "Executive command reviews",
    activeReflections: "Active reflections",
    humanOversightRequired: `Human oversight required — humans decide; ${P.companion} supports only`,
    eraOpenerSummary: `${P.era} — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate era engine RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Command reflection engine — reflection prompts",
    frameworkLabel: "Command framework",
    reviewsLabel: "Executive command reviews",
    companionLabel: `${P.companion} — supports, does not decide`,
    subEngineLabel: "Department Status Center",
    reflections: "Command reflection scaffolds",
    executiveReviewEntries: "Command review entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT make leadership decisions`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports enterprise visibility — humans retain leadership authority.`,
      philosophy: "People First. Clarity before complexity. Growth Partner terminology — never Affiliate.",
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
        ? "Global kommandosenter"
        : locale === "sv"
          ? "Globalt kommandocenter"
          : locale === "da"
            ? "Globalt kommandocenter"
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
      'export * from "./implementation-blueprint-phase199-vocabulary";',
      `export * from "./implementation-blueprint-phase199-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  const corpus = `aipify-core/knowledge/internal-language-model/${P.ilmFile}`;
  if (!c.includes(corpus)) {
    c = c.replace(
      '"aipify-core/knowledge/internal-language-model/implementation-blueprint-phase199-aipify-strategic-alignment-prioritization.txt";',
      `"aipify-core/knowledge/internal-language-model/implementation-blueprint-phase199-aipify-strategic-alignment-prioritization.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "${corpus}";`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/internal-language-model/index.ts"), c);
  console.log("patched ilm index");
}

function patchArchitecture() {
  let c = fs.readFileSync(path.join(ROOT, "ARCHITECTURE.md"), "utf8");
  const entry = `\n**Aipify Global Command Center Engine (Phase 201):** See [AIPIFY_GLOBAL_COMMAND_CENTER_ENGINE_PHASE201.md](./AIPIFY_GLOBAL_COMMAND_CENTER_ENGINE_PHASE201.md) — ${P.centerTitle} for global overview dashboard, department status center, leadership briefing panel, command center alerts, cross-organization insights, enterprise-scale indicators, and command center knowledge libraries. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** leadership decisions or RBAC overrides. Era: ${P.era}. Cross-links only: Phase 199 strategic alignment, command_center, decision_support_engine. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 201")) {
    const marker = c.includes("Phase 199")
      ? "Permissions `aipify_strategic_alignment_prioritization.steward`."
      : "Permissions `aipify_organizational_health_early_warning.steward`.";
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
