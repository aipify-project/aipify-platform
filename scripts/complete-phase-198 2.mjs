#!/usr/bin/env node
/** ABOS Phase 198 — Aipify Organizational Health & Early Warning Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const P = {
  phase: 198,
  migration: "20261358000000_aipify_organizational_health_early_warning_engine_phase198.sql",
  slug: "aipify-organizational-health-early-warning-engine",
  base: "AipifyOrganizationalHealthEarlyWarning",
  camel: "aipifyOrganizationalHealthEarlyWarningEngine",
  snake: "aipify_organizational_health_early_warning",
  permPrefix: "aipify_organizational_health_early_warning",
  helper: "aohew",
  bp: "aohewbp198",
  decisionType: "aipify_organizational_health_early_warning_engine",
  prevDecision: "aipify_decision_transparency_engine",
  title: "Aipify Organizational Health & Early Warning",
  centerTitle: "Organizational Health Dashboard",
  companion: "Health Companion",
  scoreKey: "aipify_organizational_health_early_warning_score",
  modeKey: "organizational_health_mode",
  levelKey: "early_warning_sensitivity_level",
  thirdEntity: "health_notes",
  era: "Perpetual Stewardship & Constitutional Governance Era (191–200)",
  eraRange: "191–200",
  docSlug: "AIPIFY_ORGANIZATIONAL_HEALTH_EARLY_WARNING_ENGINE",
  ilmFile: "implementation-blueprint-phase198-aipify-organizational-health-early-warning.txt",
  navLabel: "Organizational Health",
  crossLinkNote:
    "Cross-links only: Phase 197 decision transparency, attention_guardian, decision_support_engine — never duplicate RPCs or enable employee surveillance.",
  ilmExtra: `
Organizational Health Dashboard: executive wellbeing overview, trend analytics, early warning monitor, leadership attention center, resolution tracker, configurable thresholds, privacy preservation, health knowledge libraries.
Health Reflection Engine prompts: What friction is emerging? Where are patterns shifting? What bottlenecks need attention? How do we respond supportively? How do we strengthen resilience?
Health Framework: organizational awareness, proactive leadership, emerging issues, team health, operational disruptions, long-term resilience, privacy standards.
Executive Health Reviews, Health Companion, Early Warning Monitor, Resolution Tracker Engine.
Companion limitations: no employee surveillance, no punitive actions, no personal data exposure, no overriding leadership, no determining priorities.`,
  faqBody: `## What is Organizational Health & Early Warning?

Organizational Health provides leadership with early indicators of friction, engagement shifts, bottlenecks, and emerging risks — at \`/app/aipify-organizational-health-early-warning-engine\`.

## Can Aipify surveil employees?

**No.** The system must never be used for employee surveillance. Aggregate trends and metadata only — personal privacy preserved at all times.

## Why early warning signals?

Healthy organizations address emerging issues before they become significant business problems. Supportive interventions — not punitive actions.

## Configurable thresholds?

Authorized leaders can configure alert sensitivity. Early Warning Monitor flags unusual operational patterns at aggregate level.

## Why human leadership?

Humans remain responsible for interventions. The Health Companion surfaces signals — it does not punish or replace leadership judgment.`,
  companionLimitations: [
    "employee_surveillance",
    "punitive_actions",
    "expose_personal_data",
    "override_leadership_judgment",
    "determine_organizational_priorities",
    "replace_human_relationships",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom197(content) {
  const thirdPascal = P.thirdEntity.split("_").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
  const pairs = [
    ["AipifyDecisionTransparency", P.base],
    ["aipify-decision-transparency-engine", P.slug],
    ["aipify_decision_transparency", P.snake],
    ["aipifyDecisionTransparency", P.camel.replace(/Engine$/, "")],
    ["aipifyDecisionTransparencyEngine", P.camel],
    ["adtebp197", P.bp],
    ["_adte_", `_${P.helper}_`],
    ["aipify_decision_transparency_score", P.scoreKey],
    ["decision_transparency_mode", P.modeKey],
    ["oversight_confidence_level", P.levelKey],
    ["transparency_notes", P.thirdEntity],
    ["TransparencyNote", thirdPascal.endsWith("Note") ? thirdPascal : thirdPascal],
    ["transparency_notes_count", `${P.thirdEntity}_count`],
    ["Decision Explanation Center", P.centerTitle],
    ["Transparency Companion", P.companion],
    ["Aipify Decision Transparency", P.title],
    ["Decision Transparency", "Organizational Health"],
    ["Decision Transparency", P.navLabel],
    ["Phase 197", `Phase ${P.phase}`],
    ["aipify_decision_transparency_engine", P.decisionType],
    ["aipify_decision_transparency.view", `${P.permPrefix}.view`],
    ["aipify_decision_transparency.manage", `${P.permPrefix}.manage`],
    ["aipify_decision_transparency.steward", `${P.permPrefix}.steward`],
    ["20261357000000_aipify_decision_transparency_engine_phase197.sql", P.migration],
    ["Repo Phase 197", `Repo Phase ${P.phase}`],
    ["Phase 197 —", `Phase ${P.phase} —`],
    ["IMPLEMENTATION_BLUEPRINT_PHASE197_AIPIFY_DECISION_TRANSPARENCY_ENGINE", `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`],
    ["implementation-blueprint-phase197", `implementation-blueprint-phase${P.phase}`],
    ["decision_explanation_center", "organizational_health_dashboard"],
    ["transparency_reflection_engine", "health_reflection_engine"],
    ["transparency_framework", "health_framework"],
    ["executive_transparency_reviews", "executive_health_reviews"],
    ["transparency_companion", "health_companion"],
    ["practices_engine", "early_warning_monitor"],
    ["governance_alignment_engine", "resolution_tracker_engine"],
    ["Executive Transparency Reviews", "Executive Health Reviews"],
    ["decision transparency within", "organizational health within"],
    ["_seed_transparency_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["make decisions", "conduct employee surveillance"],
    ["override approvals", "take punitive actions"],
    ["Transparency Companion supports", "Health Companion supports"],
    ["never makes decisions or overrides approvals", "never surveils employees or takes punitive actions"],
    ["explains — does not decide", "supports — does not surveil"],
    ["explains and summarizes, does not make decisions", "supports early awareness, does not surveil or punish"],
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
  const src = path.join(ROOT, "lib/aipify/aipify-decision-transparency-engine");
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom197(fs.readFileSync(path.join(src, f), "utf8")));
  }
  const panel = path.join(ROOT, "components/app/aipify-decision-transparency-engine/AipifyDecisionTransparencyEngineDashboardPanel.tsx");
  write(
    path.join(ROOT, `components/app/${P.slug}/${engine}DashboardPanel.tsx`),
    transformFrom197(fs.readFileSync(panel, "utf8")),
  );
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${engine}DashboardPanel } from "./${engine}DashboardPanel";\n`);
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom197(fs.readFileSync(path.join(ROOT, "app/app/aipify-decision-transparency-engine/page.tsx"), "utf8")),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom197(fs.readFileSync(path.join(ROOT, `app/api/aipify/aipify-decision-transparency-engine/${route}/route.ts`), "utf8")),
    );
  }
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports early awareness — NOT employee surveillance or punitive actions. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Provide leadership with early indicators of organizational friction, declining engagement, operational bottlenecks, and emerging risks — supportive interventions, never surveillance.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Perpetual Stewardship Era (${P.eraRange}). Early warning strengthens resilience; humans decide; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where leaders detect friction early, respond supportively, and preserve privacy while strengthening long-term resilience.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '🎯', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'health_reflection_engine', 'label', 'Health reflection engine', 'emoji', '🪞', 'description', 'Early warning reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Health framework', 'emoji', '🛡️', 'description', 'Seven health domains'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive health reviews', 'emoji', '👥', 'description', 'Leadership wellbeing reflection'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not surveil'),
    jsonb_build_object('key', 'early_warning_monitor', 'label', 'Early Warning Monitor', 'emoji', '⚙️', 'description', 'Aggregate pattern scaffolds'),
    jsonb_build_object('key', 'resolution_tracker_engine', 'label', 'Resolution Tracker', 'emoji', '📖', 'description', 'Intervention and outcome scaffolds'),
    jsonb_build_object('key', 'knowledge_libraries', 'label', 'Health knowledge libraries', 'emoji', '🌱', 'description', 'Non-technical health resources')
  ); ${D};
create or replace function public._${bp}_organizational_health_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'health_dashboard', 'label', 'Organizational Health Dashboard — executive wellbeing overview and trends'),
    jsonb_build_object('key', 'early_warning_monitor', 'label', 'Early Warning Monitor — unusual patterns and bottlenecks'),
    jsonb_build_object('key', 'leadership_attention_center', 'label', 'Leadership Attention Center — prioritized review areas'),
    jsonb_build_object('key', 'resolution_tracker', 'label', 'Resolution Tracker — interventions and outcome reviews'),
    jsonb_build_object('key', 'configurable_thresholds', 'label', 'Configurable thresholds — alert sensitivity'),
    jsonb_build_object('key', 'privacy_preservation', 'label', 'Privacy preservation — never employee surveillance'),
    jsonb_build_object('key', 'trend_analytics', 'label', 'Trend analytics — patterns not isolated events'),
    jsonb_build_object('key', 'health_knowledge_libraries', 'label', 'Health knowledge libraries — clear non-technical language')
  )); ${D};
create or replace function public._${bp}_health_reflection_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Health reflection prompts — humans decide interventions.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'emerging_friction', 'label', 'What organizational friction is emerging?'),
    jsonb_build_object('key', 'engagement_shifts', 'label', 'Where are engagement patterns shifting?'),
    jsonb_build_object('key', 'bottlenecks', 'label', 'What bottlenecks need leadership attention?'),
    jsonb_build_object('key', 'supportive_response', 'label', 'How do we respond supportively rather than punitively?'),
    jsonb_build_object('key', 'resilience', 'label', 'How do we strengthen long-term resilience?')
  )); ${D};
create or replace function public._${bp}_health_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Health framework — periodic evaluation.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'organizational_awareness', 'label', 'Organizational awareness'),
    jsonb_build_object('key', 'proactive_leadership', 'label', 'Proactive leadership'),
    jsonb_build_object('key', 'emerging_issues', 'label', 'Emerging issues detection'),
    jsonb_build_object('key', 'team_health', 'label', 'Team health'),
    jsonb_build_object('key', 'operational_disruptions', 'label', 'Operational disruptions'),
    jsonb_build_object('key', 'long_term_resilience', 'label', 'Long-term resilience'),
    jsonb_build_object('key', 'privacy_standards', 'label', 'Privacy standards')
  )); ${D};
create or replace function public._${bp}_executive_health_reviews() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive health reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'wellbeing_trends', 'label', 'Organizational wellbeing trends'),
    jsonb_build_object('key', 'pattern_changes', 'label', 'Unusual operational pattern changes — aggregate only'),
    jsonb_build_object('key', 'attention_priorities', 'label', 'Leadership attention priorities'),
    jsonb_build_object('key', 'intervention_effectiveness', 'label', 'Intervention effectiveness'),
    jsonb_build_object('key', 'trust_privacy', 'label', 'Trust and privacy preservation')
  )); ${D};
create or replace function public._${bp}_health_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports awareness, does not surveil or punish.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts'),
    jsonb_build_object('key', 'executive_briefings', 'label', 'Executive briefings'),
    jsonb_build_object('key', 'early_warning_summaries', 'label', 'Early warning summaries'),
    jsonb_build_object('key', 'attention_recommendations', 'label', 'Attention recommendations'),
    jsonb_build_object('key', 'resolution_insights', 'label', 'Resolution insights'),
    jsonb_build_object('key', 'health_trends', 'label', 'Health trend insights')
  )); ${D};
create or replace function public._${bp}_early_warning_monitor() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Early Warning Monitor — aggregate metadata only, never surveillance.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'pattern_detection', 'label', 'Operational pattern detection — aggregate'),
    jsonb_build_object('key', 'bottleneck_detection', 'label', 'Bottleneck detection'),
    jsonb_build_object('key', 'process_breakdown_flags', 'label', 'Recurring process breakdown flags'),
    jsonb_build_object('key', 'alert_sensitivity', 'label', 'Configurable alert sensitivity'),
    jsonb_build_object('key', 'trend_not_events', 'label', 'Trends rather than isolated events'),
    jsonb_build_object('key', 'no_surveillance', 'label', 'Never employee surveillance')
  )); ${D};
create or replace function public._${bp}_resolution_tracker_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Resolution Tracker — intervention metadata and continuous improvement.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'intervention_records', 'label', 'Intervention records'),
    jsonb_build_object('key', 'outcome_reviews', 'label', 'Outcome reviews'),
    jsonb_build_object('key', 'condition_improvement', 'label', 'Condition improvement tracking'),
    jsonb_build_object('key', 'delegation_followup', 'label', 'Delegation and follow-up'),
    jsonb_build_object('key', 'continuous_improvement', 'label', 'Continuous improvement'),
    jsonb_build_object('key', 'supportive_interventions', 'label', 'Supportive interventions only'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Audit trails of reviews')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Employee surveillance',
      'Punitive actions',
      'Expose personal data',
      'Override leadership judgment',
      'Determine organizational priorities',
      'Replace human relationships'), 'principle', '${P.companion} supports — humans decide interventions.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — supportive interventions, humility, patience, service toward healthier teams.', 'values', jsonb_build_array('supportive_interventions','humility','patience','service','recognition','confidence_without_surveillance'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Health audit logs via aipify_organizational_health_early_warning_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_organizational_health_early_warning permissions'),
    jsonb_build_object('key', 'privacy', 'label', 'Personal privacy preserved — never employee surveillance'),
    jsonb_build_object('key', 'documentation_controls', 'label', 'Health documentation access controls'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 192, 'key', 'ethical_evolution', 'label', 'Ethical Evolution Phase 192', 'route', '/app/aipify-ethical-evolution-responsible-innovation-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 195, 'key', 'values_transmission', 'label', 'Values Transmission Phase 195', 'route', '/app/aipify-values-transmission-cultural-continuity-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 196, 'key', 'principles_enforcement', 'label', 'Principles Enforcement Phase 196', 'route', '/app/aipify-principles-enforcement-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 197, 'key', 'decision_transparency', 'label', 'Decision Transparency Phase 197', 'route', '/app/aipify-decision-transparency-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 198, 'key', 'organizational_health', 'label', 'Organizational Health Phase 198', 'route', '/app/${P.slug}', 'description', 'Early warning and health dashboards')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'decision_transparency', 'label', 'Decision Transparency Phase 197', 'route', '/app/aipify-decision-transparency-engine', 'relationship', 'Prior phase — cross-link only'),
    jsonb_build_object('key', 'attention_guardian', 'label', 'Attention Guardian', 'route', '/app/assistant/attention', 'relationship', 'Focus and attention — cross-link only'),
    jsonb_build_object('key', 'decision_support', 'label', 'Decision Support Engine', 'route', '/app/assistant/decisions', 'relationship', 'Leadership guidance — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Supportive wellbeing — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with metadata-only health indicators and early warning scaffolds. Growth Partner terminology. ${P.companion} supports — never surveils employees or takes punitive actions.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans decide interventions.', '${P.companion} informs and supports.', 'Privacy preserved — never surveillance.', 'Growth Partner — never Affiliate.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — aggregate trends, executive review summaries max ~500 chars. No PII, employee surveillance, or personal monitoring.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`) && sql.includes(`'${P.prevDecision}'`)) return sql;
  const additions = [];
  for (const entry of [
    "aipify_guardianship_succession_engine",
    "aipify_legacy_preservation_knowledge_continuity_engine",
    "aipify_values_transmission_cultural_continuity_engine",
    "aipify_principles_enforcement_engine",
    P.prevDecision,
    P.decisionType,
  ]) {
    if (!sql.includes(`'${entry}'`)) additions.push(`'${entry}'`);
  }
  if (additions.length === 0) return sql;
  return sql.replace(
    "'aipify_ethical_evolution_responsible_innovation_engine'",
    `'aipify_ethical_evolution_responsible_innovation_engine',\n    ${additions.join(",\n    ")}`,
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
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_organizational_health_dashboard\(\)->'capabilities'\) = 8,/,
    `jsonb_build_object('key', 'center', 'label', '${P.centerTitle} — eight capabilities', 'met', jsonb_array_length(public._${bp}_organizational_health_dashboard()->'capabilities') = 8,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_health_reflection_engine\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Health reflection engine — five questions', 'met', jsonb_array_length(public._${bp}_health_reflection_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'companion', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_health_companion\(\)->'capabilities'\) = 6,/,
    `jsonb_build_object('key', 'companion', 'label', '${P.companion} capabilities', 'met', jsonb_array_length(public._${bp}_health_companion()->'capabilities') = 6,`,
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
    "organizational_health_dashboard",
    "health_reflection_engine",
    "health_framework",
    "executive_health_reviews",
    "health_companion",
    "early_warning_monitor",
    "resolution_tracker_engine",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${bp}_${fn}()`);
  }

  if (!sql.includes("resolution_tracker_engine_meta")) {
    sql = sql.replace(
      `'sub_engine_meta', public._${bp}_early_warning_monitor(),`,
      `'sub_engine_meta', public._${bp}_early_warning_monitor(), 'resolution_tracker_engine_meta', public._${bp}_resolution_tracker_engine(),`,
    );
  }

  sql = sql.replace(
    /select 'aipify-organizational-health-early-warning-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', 199
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`Phase ${P.phase} Aipify[^']+`, "g"),
    `Phase ${P.phase} ${P.title} Engine — organizational health within Perpetual Stewardship era; cross-link only for related engines.`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  return sql;
}

function genMigration() {
  const src197 = path.join(ROOT, "supabase/migrations/20261357000000_aipify_decision_transparency_engine_phase197.sql");
  if (!fs.existsSync(src197)) {
    throw new Error("Phase 197 migration required — run complete-phase-197.mjs first or ensure migration exists");
  }
  let m = transformFrom197(fs.readFileSync(src197, "utf8"));
  m = m.replace(/_aohew_seed_health_notes/g, `_aohew_seed_${P.thirdEntity.replace("_notes", "")}_notes`);
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports early awareness — does NOT surveil employees or take punitive actions.

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
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never surveils.";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/${P.slug}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_COMPANION_LIMITATIONS = [\n${P.companionLimitations.map((l) => `  "${l}",`).join("\n")}\n] as const;\n`,
  );
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports organizational health indicators, early warning signals, and resolution tracking. Supports humans — does NOT surveil employees or take punitive actions. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Engagement score",
    modeLabel: "Mode",
    readinessLabel: "Early warning sensitivity level",
    executiveReviews: "Executive health reviews",
    activeReflections: "Active reflections",
    humanOversightRequired: `Human oversight required — humans decide interventions; ${P.companion} supports only`,
    eraOpenerSummary: `Perpetual Stewardship Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate era engine RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Health reflection engine — reflection prompts",
    frameworkLabel: "Health framework",
    reviewsLabel: "Executive health reviews",
    companionLabel: `${P.companion} — supports, does not surveil`,
    subEngineLabel: "Early Warning Monitor",
    reflections: "Health reflection scaffolds",
    executiveReviewEntries: "Health review entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT surveil employees or take punitive actions`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports early organizational health awareness — humans retain intervention authority.`,
      philosophy: "People First. Supportive interventions only. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
    },
  };
}

function patchNav() {
  let c = fs.readFileSync(path.join(ROOT, "lib/app/nav-config.ts"), "utf8");
  const id = P.camel;
  const href = `/app/${P.slug}`;
  if (!c.includes(`"${id}"`)) {
    c = c.replace('| "aipifyDecisionTransparencyEngine"', `| "aipifyDecisionTransparencyEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    c = c.replace(
      /id: "aipifyDecisionTransparencyEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyDecisionTransparencyEngine",\n  },/,
      (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-decision-transparency-engine")) {\n    return "aipifyDecisionTransparencyEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-decision-transparency-engine")) {\n    return "aipifyDecisionTransparencyEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
  console.log("patched nav-config");
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_decision_transparency.steward",', `"aipify_decision_transparency.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
  console.log("patched permissions");
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-decision-transparency-engine";',
      `export * from "./aipify-decision-transparency-engine";\nexport * from "./${P.slug}";`,
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
        ? "Organisasjonshelse"
        : locale === "sv"
          ? "Organisationshälsa"
          : locale === "da"
            ? "Organisationshelbred"
            : P.navLabel;
    data[P.camel] = block;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchIlm() {
  let c = fs.readFileSync(path.join(ROOT, "lib/internal-language-model/index.ts"), "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    const anchor = c.includes("phase197-vocabulary")
      ? 'export * from "./implementation-blueprint-phase197-vocabulary";'
      : 'export * from "./implementation-blueprint-phase196-vocabulary";';
    c = c.replace(anchor, `${anchor}\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`);
  }
  const corpus = `aipify-core/knowledge/internal-language-model/${P.ilmFile}`;
  if (!c.includes(corpus)) {
    const corpusAnchor = c.includes("phase197")
      ? '"aipify-core/knowledge/internal-language-model/implementation-blueprint-phase197-aipify-decision-transparency.txt";'
      : '"aipify-core/knowledge/internal-language-model/implementation-blueprint-phase196-aipify-principles-enforcement.txt";';
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
  const entry = `\n**Aipify Organizational Health & Early Warning Engine (Phase 198):** See [AIPIFY_ORGANIZATIONAL_HEALTH_EARLY_WARNING_ENGINE_PHASE198.md](./AIPIFY_ORGANIZATIONAL_HEALTH_EARLY_WARNING_ENGINE_PHASE198.md) — ${P.centerTitle} for executive wellbeing overview, early warning monitor, leadership attention center, resolution tracker, configurable thresholds, and health knowledge libraries. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** employee surveillance or punitive actions. Cross-links only: Phase 197 decision transparency, attention_guardian, decision_support_engine. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 198")) {
    const marker = c.includes("Phase 197")
      ? "Permissions `aipify_decision_transparency.steward`."
      : "Permissions `aipify_principles_enforcement.steward`.";
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
console.log("Phase 198 complete");
