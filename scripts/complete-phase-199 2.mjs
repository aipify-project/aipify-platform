#!/usr/bin/env node
/** ABOS Phase 199 — Aipify Strategic Alignment & Prioritization Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const P = {
  phase: 199,
  migration: "20261359000000_aipify_strategic_alignment_prioritization_engine_phase199.sql",
  slug: "aipify-strategic-alignment-prioritization-engine",
  base: "AipifyStrategicAlignmentPrioritization",
  camel: "aipifyStrategicAlignmentPrioritizationEngine",
  snake: "aipify_strategic_alignment_prioritization",
  permPrefix: "aipify_strategic_alignment_prioritization",
  helper: "asape",
  bp: "asapebp199",
  decisionType: "aipify_strategic_alignment_prioritization_engine",
  prevDecision: "aipify_organizational_health_early_warning_engine",
  title: "Aipify Strategic Alignment & Prioritization",
  centerTitle: "Strategic Priorities Dashboard",
  companion: "Strategy Companion",
  scoreKey: "aipify_strategic_alignment_prioritization_score",
  modeKey: "strategic_alignment_mode",
  levelKey: "prioritization_clarity_level",
  thirdEntity: "alignment_notes",
  era: "Perpetual Stewardship & Constitutional Governance Era (191–200)",
  eraRange: "191–200",
  docSlug: "AIPIFY_STRATEGIC_ALIGNMENT_PRIORITIZATION_ENGINE",
  ilmFile: "implementation-blueprint-phase199-aipify-strategic-alignment-prioritization.txt",
  navLabel: "Strategic Alignment",
  crossLinkNote:
    "Cross-links only: Phase 198 organizational health, decision_support_engine, goals_dreams_engine — never duplicate RPCs or auto-prioritize without leadership approval.",
  ilmExtra: `
Strategic Priorities Dashboard: current priorities, active initiatives, goal alignment, executive reporting, initiative alignment engine, resource awareness center, strategic review scheduler, strategic knowledge libraries.
Alignment Reflection Engine prompts: Do initiatives align with goals? What competing priorities exist? Where are resource constraints? What deserves focus? How do we reduce initiative overload?
Strategic Framework: strategic execution, prioritization quality, initiative overload, leadership clarity, resource allocation, organizational focus, enterprise scale.
Executive Strategic Reviews, Strategy Companion, Initiative Alignment Engine, Resource Awareness Center.
Companion limitations: no defining strategy, no overriding leadership, no auto-prioritization, no exposing confidential planning, no determining resource allocation.`,
  faqBody: `## What is Strategic Alignment & Prioritization?

Strategic Alignment helps organizations ensure initiatives and decisions remain aligned with objectives, resources, and long-term priorities — at \`/app/aipify-strategic-alignment-prioritization-engine\`.

## Can Aipify set our strategy?

**No.** Leadership defines organizational objectives. The Strategy Companion supports alignment reflection — it does not define strategy or auto-prioritize.

## Why highlight competing priorities?

Initiative overload reduces execution quality. Surfacing conflicts encourages intentional prioritization.

## Resource constraints?

Resource Awareness Center displays high-level capacity indicators and bottlenecks — metadata only, supporting informed planning.

## Why human leadership?

Humans remain responsible for prioritization decisions. The Strategy Companion informs — it does not replace executive judgment.`,
  companionLimitations: [
    "define_organizational_strategy",
    "override_leadership_authority",
    "auto_prioritize_without_approval",
    "expose_confidential_planning",
    "determine_resource_allocation",
    "replace_executive_judgment",
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
    ["organizational_health_dashboard", "strategic_priorities_dashboard"],
    ["health_reflection_engine", "alignment_reflection_engine"],
    ["health_framework", "strategic_framework"],
    ["executive_health_reviews", "executive_strategic_reviews"],
    ["health_companion", "strategy_companion"],
    ["early_warning_monitor", "initiative_alignment_engine"],
    ["resolution_tracker_engine", "resource_awareness_center"],
    ["Executive Health Reviews", "Executive Strategic Reviews"],
    ["organizational health within", "strategic alignment within"],
    ["_seed_health_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["conduct employee surveillance", "define organizational strategy"],
    ["take punitive actions", "auto-prioritize without approval"],
    ["Health Companion supports", "Strategy Companion supports"],
    ["never surveils employees or takes punitive actions", "never defines strategy or auto-prioritizes"],
    ["supports — does not surveil", "supports — does not define strategy"],
    ["supports early awareness, does not surveil or punish", "supports alignment reflection, does not define strategy or auto-prioritize"],
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
  const srcSlug = "aipify-organizational-health-early-warning-engine";
  const src = path.join(ROOT, `lib/aipify/${srcSlug}`);
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom198(fs.readFileSync(path.join(src, f), "utf8")));
  }
  const panel = path.join(ROOT, `components/app/${srcSlug}/AipifyOrganizationalHealthEarlyWarningEngineDashboardPanel.tsx`);
  write(
    path.join(ROOT, `components/app/${P.slug}/${engine}DashboardPanel.tsx`),
    transformFrom198(fs.readFileSync(panel, "utf8")),
  );
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${engine}DashboardPanel } from "./${engine}DashboardPanel";\n`);
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom198(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom198(fs.readFileSync(path.join(ROOT, `app/api/aipify/${srcSlug}/${route}/route.ts`), "utf8")),
    );
  }
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports alignment reflection — NOT define strategy or auto-prioritize. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Ensure initiatives and decisions remain aligned with organizational objectives, available resources, and long-term priorities — leadership defines strategy.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Perpetual Stewardship Era (${P.eraRange}). Strategic alignment strengthens execution; humans decide; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where initiatives align with goals, competing priorities are surfaced, and leadership retains prioritization authority.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '🎯', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'alignment_reflection_engine', 'label', 'Alignment reflection engine', 'emoji', '🪞', 'description', 'Strategic alignment reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Strategic framework', 'emoji', '🛡️', 'description', 'Seven strategic domains'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive strategic reviews', 'emoji', '👥', 'description', 'Leadership alignment reflection'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not define strategy'),
    jsonb_build_object('key', 'initiative_alignment_engine', 'label', 'Initiative Alignment Engine', 'emoji', '⚙️', 'description', 'Initiative alignment scaffolds'),
    jsonb_build_object('key', 'resource_awareness_center', 'label', 'Resource Awareness Center', 'emoji', '📖', 'description', 'Capacity and bottleneck scaffolds'),
    jsonb_build_object('key', 'knowledge_libraries', 'label', 'Strategic knowledge libraries', 'emoji', '🌱', 'description', 'Non-technical strategic resources')
  ); ${D};
create or replace function public._${bp}_strategic_priorities_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'priorities_dashboard', 'label', 'Strategic Priorities Dashboard — current priorities and active initiatives'),
    jsonb_build_object('key', 'goal_alignment', 'label', 'Goal alignment — initiatives mapped to objectives'),
    jsonb_build_object('key', 'executive_reporting', 'label', 'Executive reporting — alignment summaries'),
    jsonb_build_object('key', 'initiative_alignment', 'label', 'Initiative Alignment Engine — competing priorities surfaced'),
    jsonb_build_object('key', 'resource_awareness', 'label', 'Resource Awareness Center — capacity indicators'),
    jsonb_build_object('key', 'strategic_review_scheduler', 'label', 'Strategic review scheduler'),
    jsonb_build_object('key', 'initiative_overload', 'label', 'Initiative overload awareness'),
    jsonb_build_object('key', 'strategic_knowledge_libraries', 'label', 'Strategic knowledge libraries — clear non-technical language')
  )); ${D};
create or replace function public._${bp}_alignment_reflection_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Alignment reflection prompts — humans decide prioritization.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'initiative_alignment', 'label', 'Do current initiatives align with organizational goals?'),
    jsonb_build_object('key', 'competing_priorities', 'label', 'What competing priorities exist?'),
    jsonb_build_object('key', 'resource_constraints', 'label', 'Where are resource constraints emerging?'),
    jsonb_build_object('key', 'focus_deserves', 'label', 'What deserves leadership focus?'),
    jsonb_build_object('key', 'reduce_overload', 'label', 'How do we reduce initiative overload?')
  )); ${D};
create or replace function public._${bp}_strategic_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Strategic framework — periodic evaluation.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'strategic_execution', 'label', 'Strategic execution'),
    jsonb_build_object('key', 'prioritization_quality', 'label', 'Prioritization quality'),
    jsonb_build_object('key', 'initiative_overload', 'label', 'Initiative overload'),
    jsonb_build_object('key', 'leadership_clarity', 'label', 'Leadership clarity'),
    jsonb_build_object('key', 'resource_allocation', 'label', 'Resource allocation awareness'),
    jsonb_build_object('key', 'organizational_focus', 'label', 'Organizational focus'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); ${D};
create or replace function public._${bp}_executive_strategic_reviews() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive strategic reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'priority_alignment', 'label', 'Priority alignment with objectives'),
    jsonb_build_object('key', 'competing_initiatives', 'label', 'Competing initiatives — aggregate only'),
    jsonb_build_object('key', 'resource_bottlenecks', 'label', 'Resource bottlenecks'),
    jsonb_build_object('key', 'execution_quality', 'label', 'Execution quality'),
    jsonb_build_object('key', 'strategic_focus', 'label', 'Strategic focus preservation')
  )); ${D};
create or replace function public._${bp}_strategy_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports alignment, does not define strategy.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts'),
    jsonb_build_object('key', 'executive_briefings', 'label', 'Executive briefings'),
    jsonb_build_object('key', 'alignment_summaries', 'label', 'Alignment summaries'),
    jsonb_build_object('key', 'priority_recommendations', 'label', 'Priority recommendations — human approval required'),
    jsonb_build_object('key', 'resource_insights', 'label', 'Resource insights'),
    jsonb_build_object('key', 'strategic_trends', 'label', 'Strategic trend insights')
  )); ${D};
create or replace function public._${bp}_initiative_alignment_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Initiative Alignment Engine — metadata only, never auto-prioritize.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'initiative_mapping', 'label', 'Initiative-to-goal mapping'),
    jsonb_build_object('key', 'conflict_detection', 'label', 'Competing priority detection'),
    jsonb_build_object('key', 'overload_flags', 'label', 'Initiative overload flags'),
    jsonb_build_object('key', 'alignment_scoring', 'label', 'Alignment scoring — advisory only'),
    jsonb_build_object('key', 'human_approval', 'label', 'Human approval required for changes'),
    jsonb_build_object('key', 'no_auto_prioritize', 'label', 'Never auto-prioritize without leadership approval')
  )); ${D};
create or replace function public._${bp}_resource_awareness_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Resource Awareness Center — high-level capacity metadata.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'capacity_indicators', 'label', 'Capacity indicators'),
    jsonb_build_object('key', 'bottleneck_awareness', 'label', 'Bottleneck awareness'),
    jsonb_build_object('key', 'resource_constraints', 'label', 'Resource constraint tracking'),
    jsonb_build_object('key', 'planning_support', 'label', 'Planning support — metadata only'),
    jsonb_build_object('key', 'no_allocation_decisions', 'label', 'Never determine resource allocation'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Audit trails of reviews')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Define organizational strategy',
      'Override leadership authority',
      'Auto-prioritize without approval',
      'Expose confidential planning',
      'Determine resource allocation',
      'Replace executive judgment'), 'principle', '${P.companion} supports — humans decide prioritization.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — clarity, humility, patience, service toward intentional focus.', 'values', jsonb_build_array('clarity','humility','patience','service','recognition','confidence_without_control'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Strategic audit logs via aipify_strategic_alignment_prioritization_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_strategic_alignment_prioritization permissions'),
    jsonb_build_object('key', 'confidentiality', 'label', 'Confidential planning access controls'),
    jsonb_build_object('key', 'documentation_controls', 'label', 'Strategic documentation access controls'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 192, 'key', 'ethical_evolution', 'label', 'Ethical Evolution Phase 192', 'route', '/app/aipify-ethical-evolution-responsible-innovation-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 195, 'key', 'values_transmission', 'label', 'Values Transmission Phase 195', 'route', '/app/aipify-values-transmission-cultural-continuity-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 196, 'key', 'principles_enforcement', 'label', 'Principles Enforcement Phase 196', 'route', '/app/aipify-principles-enforcement-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 197, 'key', 'decision_transparency', 'label', 'Decision Transparency Phase 197', 'route', '/app/aipify-decision-transparency-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 199, 'key', 'strategic_alignment', 'label', 'Strategic Alignment Phase 199', 'route', '/app/${P.slug}', 'description', 'Strategic priorities and alignment')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'organizational_health', 'label', 'Organizational Health Phase 198', 'route', '/app/aipify-organizational-health-early-warning-engine', 'relationship', 'Prior phase — cross-link only'),
    jsonb_build_object('key', 'decision_support', 'label', 'Decision Support Engine', 'route', '/app/assistant/decisions', 'relationship', 'Leadership guidance — cross-link only'),
    jsonb_build_object('key', 'goals_dreams', 'label', 'Goals & Dreams Engine', 'route', '/app/assistant/goals', 'relationship', 'Goal alignment — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Supportive focus — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with metadata-only alignment indicators. Growth Partner terminology. ${P.companion} supports — never defines strategy or auto-prioritizes.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans decide prioritization.', '${P.companion} informs and supports.', 'Alignment without auto-prioritization.', 'Growth Partner — never Affiliate.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — aggregate alignment trends, executive review summaries max ~500 chars. No confidential planning without RBAC.'; ${D};
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
    "aipify_decision_transparency_engine",
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
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_strategic_priorities_dashboard\(\)->'capabilities'\) = 8,/,
    `jsonb_build_object('key', 'center', 'label', '${P.centerTitle} — eight capabilities', 'met', jsonb_array_length(public._${bp}_strategic_priorities_dashboard()->'capabilities') = 8,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_alignment_reflection_engine\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Alignment reflection engine — five questions', 'met', jsonb_array_length(public._${bp}_alignment_reflection_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'companion', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_strategy_companion\(\)->'capabilities'\) = 6,/,
    `jsonb_build_object('key', 'companion', 'label', '${P.companion} capabilities', 'met', jsonb_array_length(public._${bp}_strategy_companion()->'capabilities') = 6,`,
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
    "strategic_priorities_dashboard",
    "alignment_reflection_engine",
    "strategic_framework",
    "executive_strategic_reviews",
    "strategy_companion",
    "initiative_alignment_engine",
    "resource_awareness_center",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${bp}_${fn}()`);
  }

  if (!sql.includes("resource_awareness_center_meta")) {
    sql = sql.replace(
      `'sub_engine_meta', public._${bp}_initiative_alignment_engine(),`,
      `'sub_engine_meta', public._${bp}_initiative_alignment_engine(), 'resource_awareness_center_meta', public._${bp}_resource_awareness_center(),`,
    );
  }

  sql = sql.replace(
    /select 'aipify-strategic-alignment-prioritization-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', 200
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`Phase ${P.phase} Aipify[^']+`, "g"),
    `Phase ${P.phase} ${P.title} Engine — strategic alignment within Perpetual Stewardship era; cross-link only for related engines.`,
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
  m = m.replace(/_asape_seed_alignment_notes/g, `_asape_seed_${P.thirdEntity.replace("_notes", "")}_notes`);
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports alignment reflection — does NOT define strategy or auto-prioritize.

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
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never defines strategy.";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/${P.slug}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_COMPANION_LIMITATIONS = [\n${P.companionLimitations.map((l) => `  "${l}",`).join("\n")}\n] as const;\n`,
  );
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports strategic alignment, initiative mapping, and resource awareness. Supports humans — does NOT define strategy or auto-prioritize. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Alignment score",
    modeLabel: "Mode",
    readinessLabel: "Prioritization clarity level",
    executiveReviews: "Executive strategic reviews",
    activeReflections: "Active reflections",
    humanOversightRequired: `Human oversight required — humans decide prioritization; ${P.companion} supports only`,
    eraOpenerSummary: `Perpetual Stewardship Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate era engine RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Alignment reflection engine — reflection prompts",
    frameworkLabel: "Strategic framework",
    reviewsLabel: "Executive strategic reviews",
    companionLabel: `${P.companion} — supports, does not define strategy`,
    subEngineLabel: "Initiative Alignment Engine",
    reflections: "Alignment reflection scaffolds",
    executiveReviewEntries: "Strategic review entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT define strategy or auto-prioritize`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports strategic alignment reflection — humans retain prioritization authority.`,
      philosophy: "People First. Intentional focus only. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
    },
  };
}

function patchNav() {
  let c = fs.readFileSync(path.join(ROOT, "lib/app/nav-config.ts"), "utf8");
  const id = P.camel;
  const href = `/app/${P.slug}`;
  if (!c.includes(`"${id}"`)) {
    c = c.replace('| "aipifyOrganizationalHealthEarlyWarningEngine"', `| "aipifyOrganizationalHealthEarlyWarningEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    c = c.replace(
      /id: "aipifyOrganizationalHealthEarlyWarningEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyOrganizationalHealthEarlyWarningEngine",\n  },/,
      (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-organizational-health-early-warning-engine")) {\n    return "aipifyOrganizationalHealthEarlyWarningEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-organizational-health-early-warning-engine")) {\n    return "aipifyOrganizationalHealthEarlyWarningEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
  console.log("patched nav-config");
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_organizational_health_early_warning.steward",', `"aipify_organizational_health_early_warning.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
  console.log("patched permissions");
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-organizational-health-early-warning-engine";',
      `export * from "./aipify-organizational-health-early-warning-engine";\nexport * from "./${P.slug}";`,
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
        ? "Strategisk alignment"
        : locale === "sv"
          ? "Strategisk alignment"
          : locale === "da"
            ? "Strategisk alignment"
            : P.navLabel;
    data[P.camel] = block;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchIlm() {
  let c = fs.readFileSync(path.join(ROOT, "lib/internal-language-model/index.ts"), "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    const anchor = c.includes("phase198-vocabulary")
      ? 'export * from "./implementation-blueprint-phase198-vocabulary";'
      : 'export * from "./implementation-blueprint-phase197-vocabulary";';
    c = c.replace(anchor, `${anchor}\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`);
  }
  const corpus = `aipify-core/knowledge/internal-language-model/${P.ilmFile}`;
  if (!c.includes(corpus)) {
    const corpusAnchor = c.includes("phase198")
      ? '"aipify-core/knowledge/internal-language-model/implementation-blueprint-phase198-aipify-organizational-health-early-warning.txt";'
      : '"aipify-core/knowledge/internal-language-model/implementation-blueprint-phase197-aipify-decision-transparency.txt";';
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
  const entry = `\n**Aipify Strategic Alignment & Prioritization Engine (Phase 199):** See [AIPIFY_STRATEGIC_ALIGNMENT_PRIORITIZATION_ENGINE_PHASE199.md](./AIPIFY_STRATEGIC_ALIGNMENT_PRIORITIZATION_ENGINE_PHASE199.md) — ${P.centerTitle} for current priorities, goal alignment, initiative alignment engine, resource awareness center, and strategic knowledge libraries. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** define strategy or auto-prioritize. Cross-links only: Phase 198 organizational health, decision_support_engine, goals_dreams_engine. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 199")) {
    const marker = c.includes("Phase 198")
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
console.log(`Phase ${P.phase} complete`);
