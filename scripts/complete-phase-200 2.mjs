#!/usr/bin/env node
/** ABOS Phase 200 — Aipify Executive Operating System & Founder's Cockpit Engine (Era Capstone 191–200) */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const P = {
  phase: 200,
  migration: "20261360000000_aipify_executive_operating_system_founders_cockpit_engine_phase200.sql",
  slug: "aipify-executive-operating-system-founders-cockpit-engine",
  base: "AipifyExecutiveOperatingSystemFoundersCockpit",
  camel: "aipifyExecutiveOperatingSystemFoundersCockpitEngine",
  snake: "aipify_executive_operating_system_founders_cockpit",
  permPrefix: "aipify_executive_operating_system_founders_cockpit",
  helper: "aeosfce",
  bp: "aeosfcebp200",
  decisionType: "aipify_executive_operating_system_founders_cockpit_engine",
  prevDecision: "aipify_strategic_alignment_prioritization_engine",
  title: "Aipify Executive Operating System & Founder's Cockpit",
  centerTitle: "Executive Cockpit Dashboard",
  companion: "Executive Companion",
  scoreKey: "aipify_executive_operating_system_founders_cockpit_score",
  modeKey: "executive_cockpit_mode",
  levelKey: "founder_visibility_level",
  thirdEntity: "cockpit_notes",
  era: "Perpetual Stewardship & Constitutional Governance Era (191–200)",
  eraRange: "191–200",
  docSlug: "AIPIFY_EXECUTIVE_OPERATING_SYSTEM_FOUNDERS_COCKPIT_ENGINE",
  ilmFile: "implementation-blueprint-phase200-aipify-executive-operating-system-founders-cockpit.txt",
  navLabel: "Executive Cockpit",
  crossLinkNote:
    "Cross-links only: Phase 199 strategic alignment, command_center, decision_support_engine — never duplicate RPCs or make executive decisions.",
  ilmExtra: `
Executive Cockpit Dashboard: critical org info, clarity over complexity, role-specific views, Since Last Login Center, Executive Attention Queue, Opportunity & Risk Monitor, Founder Mode, executive decision summaries, personalized dashboards, cockpit knowledge libraries.
Executive Reflection Engine prompts: Is executive visibility sufficient? Are we decision-ready? Where is information fragmented? What risks or opportunities are emerging? How do we steward proactively?
Executive Framework: executive visibility, decision readiness, information clarity, organizational awareness, strategic leadership, proactive stewardship, enterprise scale.
Executive Cockpit Reviews, Executive Companion, Since Last Login Center, Attention Queue Engine, Opportunity & Risk Monitor.
Companion limitations: no executive decisions, no overriding leadership, no unauthorized executive data, no replacing human judgment, no determining strategy, no enforcing founder actions without auth.`,
  faqBody: `## What is the Executive Operating System & Founder's Cockpit?

The Executive Cockpit provides leadership with a unified command view — critical indicators, since-last-login updates, attention queues, and founder stewardship insights — at \`/app/aipify-executive-operating-system-founders-cockpit-engine\`.

## Can Aipify make executive decisions?

**No.** The Executive Companion briefs and summarizes — it does **not** make executive decisions, override leadership, or determine organizational strategy.

## What is Founder Mode?

Founder Mode offers owner-perspective views: long-term trends, stewardship indicators, and strategic continuity — always with human accountability.

## Executive RBAC and confidentiality?

Executive data requires role-based access. Founder-level safeguards, audit logs, and two-factor authentication cross-links protect confidential executive information.

## Why human leadership?

Humans remain responsible for all executive decisions. The Executive Companion informs and prepares — it never replaces judgment or enforces actions without authorization.`,
  companionLimitations: [
    "make_executive_decisions",
    "override_leadership_authority",
    "expose_unauthorized_executive_data",
    "replace_human_judgment",
    "determine_organizational_strategy",
    "enforce_founder_actions_without_auth",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom199(content) {
  const thirdPascal = P.thirdEntity.split("_").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
  const pairs = [
    ["AipifyStrategicAlignmentPrioritization", P.base],
    ["aipify-strategic-alignment-prioritization-engine", P.slug],
    ["aipify_strategic_alignment_prioritization", P.snake],
    ["aipifyStrategicAlignmentPrioritization", P.camel.replace(/Engine$/, "")],
    ["aipifyStrategicAlignmentPrioritizationEngine", P.camel],
    ["asapebp199", P.bp],
    ["_asape_", `_${P.helper}_`],
    ["aipify_strategic_alignment_prioritization_score", P.scoreKey],
    ["strategic_alignment_mode", P.modeKey],
    ["prioritization_clarity_level", P.levelKey],
    ["alignment_notes", P.thirdEntity],
    ["AlignmentNote", thirdPascal.endsWith("Note") ? thirdPascal : thirdPascal],
    ["alignment_notes_count", `${P.thirdEntity}_count`],
    ["Strategic Priorities Dashboard", P.centerTitle],
    ["Strategy Companion", P.companion],
    ["Aipify Strategic Alignment & Prioritization", P.title],
    ["Strategic Alignment", P.navLabel],
    ["Phase 199", `Phase ${P.phase}`],
    ["aipify_strategic_alignment_prioritization_engine", P.decisionType],
    ["aipify_strategic_alignment_prioritization.view", `${P.permPrefix}.view`],
    ["aipify_strategic_alignment_prioritization.manage", `${P.permPrefix}.manage`],
    ["aipify_strategic_alignment_prioritization.steward", `${P.permPrefix}.steward`],
    ["20261359000000_aipify_strategic_alignment_prioritization_engine_phase199.sql", P.migration],
    ["Repo Phase 199", `Repo Phase ${P.phase}`],
    ["Phase 199 —", `Phase ${P.phase} —`],
    ["IMPLEMENTATION_BLUEPRINT_PHASE199_AIPIFY_STRATEGIC_ALIGNMENT_PRIORITIZATION_ENGINE", `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`],
    ["implementation-blueprint-phase199", `implementation-blueprint-phase${P.phase}`],
    ["strategic_priorities_dashboard", "executive_cockpit_dashboard"],
    ["alignment_reflection_engine", "executive_reflection_engine"],
    ["strategic_framework", "executive_framework"],
    ["executive_strategic_reviews", "executive_cockpit_reviews"],
    ["strategy_companion", "executive_companion"],
    ["initiative_alignment_engine", "since_last_login_center"],
    ["resource_awareness_center", "attention_queue_engine"],
    ["Executive Strategic Reviews", "Executive Cockpit Reviews"],
    ["strategic alignment within", "executive cockpit within"],
    ["_seed_alignment_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["define organizational strategy", "make executive decisions"],
    ["auto-prioritize without approval", "enforce founder actions without auth"],
    ["Strategy Companion supports", "Executive Companion supports"],
    ["never defines strategy or auto-prioritizes", "never makes executive decisions or overrides leadership"],
    ["supports — does not define strategy", "supports — does not decide"],
    ["supports alignment reflection, does not define strategy or auto-prioritize", "supports executive visibility, does not make decisions or override leadership"],
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
  const srcSlug = "aipify-strategic-alignment-prioritization-engine";
  const src = path.join(ROOT, `lib/aipify/${srcSlug}`);
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom199(fs.readFileSync(path.join(src, f), "utf8")));
  }
  const panel = path.join(ROOT, `components/app/${srcSlug}/AipifyStrategicAlignmentPrioritizationEngineDashboardPanel.tsx`);
  write(
    path.join(ROOT, `components/app/${P.slug}/${engine}DashboardPanel.tsx`),
    transformFrom199(fs.readFileSync(panel, "utf8")),
  );
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${engine}DashboardPanel } from "./${engine}DashboardPanel";\n`);
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom199(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom199(fs.readFileSync(path.join(ROOT, `app/api/aipify/${srcSlug}/${route}/route.ts`), "utf8")),
    );
  }
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports executive visibility — NOT make decisions or override leadership. Era capstone ${P.eraRange}. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Provide executives and founders with a unified cockpit — critical org info, since-last-login updates, attention queues, opportunities and risks, and founder stewardship — clarity without overload.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Perpetual Stewardship Era (${P.eraRange}) capstone. Executive visibility strengthens stewardship; humans decide; ${P.companion} informs and prepares.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where leaders see clearly, decide confidently, and steward proactively — without information overload or unauthorized exposure.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '🎯', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'executive_reflection_engine', 'label', 'Executive reflection engine', 'emoji', '🪞', 'description', 'Executive visibility reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Executive framework', 'emoji', '🛡️', 'description', 'Seven executive domains'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive cockpit reviews', 'emoji', '👥', 'description', 'Leadership cockpit reflection'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Briefs — does not decide'),
    jsonb_build_object('key', 'since_last_login_center', 'label', 'Since Last Login Center', 'emoji', '⚙️', 'description', 'Developments since last login'),
    jsonb_build_object('key', 'attention_queue_engine', 'label', 'Attention Queue Engine', 'emoji', '📖', 'description', 'Leadership awareness queue'),
    jsonb_build_object('key', 'knowledge_libraries', 'label', 'Cockpit knowledge libraries', 'emoji', '🌱', 'description', 'Executive reference resources')
  ); ${D};
create or replace function public._${bp}_executive_cockpit_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'cockpit_dashboard', 'label', 'Executive Cockpit Dashboard — critical org info, clarity over complexity, role-specific views'),
    jsonb_build_object('key', 'since_last_login', 'label', 'Since Last Login Center — developments, milestones, emerging concerns, follow-up actions'),
    jsonb_build_object('key', 'attention_queue', 'label', 'Executive Attention Queue — leadership awareness items, urgency/impact, delegation'),
    jsonb_build_object('key', 'opportunity_risk_monitor', 'label', 'Opportunity & Risk Monitor — opportunities, threats, proactive responses'),
    jsonb_build_object('key', 'founder_mode', 'label', 'Founder Mode — owner perspective, long-term trends, stewardship indicators'),
    jsonb_build_object('key', 'decision_summaries', 'label', 'Executive decision summaries — pending decisions, concise summaries'),
    jsonb_build_object('key', 'personalized_dashboards', 'label', 'Personalized executive dashboards'),
    jsonb_build_object('key', 'cockpit_knowledge_libraries', 'label', 'Cockpit knowledge libraries — executive reference resources')
  )); ${D};
create or replace function public._${bp}_executive_reflection_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive reflection prompts — humans decide.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'executive_visibility', 'label', 'Is executive visibility sufficient across the organization?'),
    jsonb_build_object('key', 'decision_readiness', 'label', 'Are we decision-ready with the information we have?'),
    jsonb_build_object('key', 'information_fragmentation', 'label', 'Where is information fragmented or siloed?'),
    jsonb_build_object('key', 'emerging_risks_opportunities', 'label', 'What emerging risks or opportunities need attention?'),
    jsonb_build_object('key', 'proactive_stewardship', 'label', 'How do we steward proactively without overload?')
  )); ${D};
create or replace function public._${bp}_executive_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive framework — periodic evaluation.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility'),
    jsonb_build_object('key', 'decision_readiness', 'label', 'Decision readiness'),
    jsonb_build_object('key', 'information_clarity', 'label', 'Information clarity'),
    jsonb_build_object('key', 'organizational_awareness', 'label', 'Organizational awareness'),
    jsonb_build_object('key', 'strategic_leadership', 'label', 'Strategic leadership'),
    jsonb_build_object('key', 'proactive_stewardship', 'label', 'Proactive stewardship'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); ${D};
create or replace function public._${bp}_executive_cockpit_reviews() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive cockpit reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'critical_indicators', 'label', 'Critical indicators'),
    jsonb_build_object('key', 'since_last_login_priorities', 'label', 'Since-last-login priorities'),
    jsonb_build_object('key', 'attention_queue', 'label', 'Attention queue'),
    jsonb_build_object('key', 'opportunities_risks', 'label', 'Opportunities and risks'),
    jsonb_build_object('key', 'founder_stewardship', 'label', 'Founder stewardship')
  )); ${D};
create or replace function public._${bp}_executive_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — briefs and summarizes, does not decide.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'executive_briefings', 'label', 'Executive briefings'),
    jsonb_build_object('key', 'decision_summaries', 'label', 'Decision summaries'),
    jsonb_build_object('key', 'attention_insights', 'label', 'Attention insights'),
    jsonb_build_object('key', 'risk_opportunity_highlights', 'label', 'Risk and opportunity highlights'),
    jsonb_build_object('key', 'founder_mode_insights', 'label', 'Founder mode insights'),
    jsonb_build_object('key', 'since_last_login_digest', 'label', 'Since-last-login digest')
  )); ${D};
create or replace function public._${bp}_since_last_login_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Since Last Login Center — developments since last executive login.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'developments', 'label', 'Key developments since last login'),
    jsonb_build_object('key', 'milestones', 'label', 'Milestone updates'),
    jsonb_build_object('key', 'emerging_concerns', 'label', 'Emerging concerns'),
    jsonb_build_object('key', 'follow_up_actions', 'label', 'Follow-up actions'),
    jsonb_build_object('key', 'role_specific_views', 'label', 'Role-specific views'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata only — no unauthorized data')
  )); ${D};
create or replace function public._${bp}_attention_queue_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Attention Queue — leadership awareness with urgency and impact.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'awareness_items', 'label', 'Leadership awareness items'),
    jsonb_build_object('key', 'urgency_impact', 'label', 'Urgency and impact scoring'),
    jsonb_build_object('key', 'delegation', 'label', 'Delegation suggestions — human approval required'),
    jsonb_build_object('key', 'queue_prioritization', 'label', 'Queue prioritization'),
    jsonb_build_object('key', 'follow_through', 'label', 'Follow-through tracking'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Audit trails of queue reviews')
  )); ${D};
create or replace function public._${bp}_opportunity_risk_monitor() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Opportunity & Risk Monitor — proactive stewardship awareness.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'opportunities', 'label', 'Emerging opportunities'),
    jsonb_build_object('key', 'threats', 'label', 'Threats and risks'),
    jsonb_build_object('key', 'proactive_responses', 'label', 'Proactive response scaffolds'),
    jsonb_build_object('key', 'trend_monitoring', 'label', 'Trend monitoring'),
    jsonb_build_object('key', 'founder_visibility', 'label', 'Founder visibility indicators'),
    jsonb_build_object('key', 'human_decides', 'label', 'Humans decide responses')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Make executive decisions',
      'Override leadership authority',
      'Expose unauthorized executive data',
      'Replace human judgment',
      'Determine organizational strategy',
      'Enforce founder actions without authorization'), 'principle', '${P.companion} briefs — humans decide.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — clarity without overload, humility in uncertainty, service through stewardship.', 'values', jsonb_build_array('clarity_without_overload','humility_in_uncertainty','service_through_stewardship','recognition','confidence_without_control'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Executive audit logs via aipify_executive_operating_system_founders_cockpit_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Executive RBAC via aipify_executive_operating_system_founders_cockpit permissions'),
    jsonb_build_object('key', 'founder_auth', 'label', 'Founder-level enhanced auth safeguards'),
    jsonb_build_object('key', 'confidentiality', 'label', 'Confidential executive information controls'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 195, 'key', 'values_transmission', 'label', 'Values Transmission Phase 195', 'route', '/app/aipify-values-transmission-cultural-continuity-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 197, 'key', 'decision_transparency', 'label', 'Decision Transparency Phase 197', 'route', '/app/aipify-decision-transparency-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 198, 'key', 'organizational_health', 'label', 'Organizational Health Phase 198', 'route', '/app/aipify-organizational-health-early-warning-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 199, 'key', 'strategic_alignment', 'label', 'Strategic Alignment Phase 199', 'route', '/app/aipify-strategic-alignment-prioritization-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 200, 'key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/${P.slug}', 'description', 'Era capstone — executive operating system')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'strategic_alignment', 'label', 'Strategic Alignment Phase 199', 'route', '/app/aipify-strategic-alignment-prioritization-engine', 'relationship', 'Prior phase — cross-link only'),
    jsonb_build_object('key', 'command_center', 'label', 'Command Center', 'route', '/app/command-center', 'relationship', 'Executive presence — cross-link only'),
    jsonb_build_object('key', 'decision_support', 'label', 'Decision Support Engine', 'route', '/app/assistant/decisions', 'relationship', 'Decision guidance — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Stewardship wellbeing — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally as era capstone (${P.eraRange}). Growth Partner terminology. ${P.companion} briefs — never makes executive decisions or overrides leadership.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans decide.', '${P.companion} informs and prepares.', 'Clarity without overload.', 'Growth Partner — never Affiliate.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — executive summaries max ~500 chars. No unauthorized executive data, PII, or confidential records without RBAC.'; ${D};
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
    `-- Phase ${P.phase} — ${P.title} Engine\n-- ${P.era} — Era Capstone.\n-- Helpers: _${P.helper}_* (engine), _${P.bp}_* (blueprint)`,
  );
  sql = patchDecisionTypeChain(sql);
  const start = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const end = sql.indexOf(`create or replace function public._${P.helper}_refresh_metrics`);
  if (start !== -1 && end !== -1) sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);

  const bp = P.bp;
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_executive_cockpit_dashboard\(\)->'capabilities'\) = 8,/,
    `jsonb_build_object('key', 'center', 'label', '${P.centerTitle} — eight capabilities', 'met', jsonb_array_length(public._${bp}_executive_cockpit_dashboard()->'capabilities') = 8,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_executive_reflection_engine\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Executive reflection engine — five questions', 'met', jsonb_array_length(public._${bp}_executive_reflection_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'companion', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_executive_companion\(\)->'capabilities'\) = 6,/,
    `jsonb_build_object('key', 'companion', 'label', '${P.companion} capabilities', 'met', jsonb_array_length(public._${bp}_executive_companion()->'capabilities') = 6,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era capstone phases documented', 'met', jsonb_array_length(public._${bp}_era_opener_summary()) = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'baseline', 'label', 'Repo Phase \d+ baseline tables'/,
    `jsonb_build_object('key', 'baseline', 'label', 'Repo Phase ${P.phase} baseline tables'`,
  );

  for (const fn of [
    "executive_cockpit_dashboard",
    "executive_reflection_engine",
    "executive_framework",
    "executive_cockpit_reviews",
    "executive_companion",
    "since_last_login_center",
    "attention_queue_engine",
    "opportunity_risk_monitor",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${bp}_${fn}()`);
  }

  if (!sql.includes("opportunity_risk_monitor_meta")) {
    sql = sql.replace(
      `'sub_engine_meta', public._${bp}_since_last_login_center(),`,
      `'sub_engine_meta', public._${bp}_since_last_login_center(), 'attention_queue_engine_meta', public._${bp}_attention_queue_engine(), 'opportunity_risk_monitor_meta', public._${bp}_opportunity_risk_monitor(),`,
    );
  }

  sql = sql.replace(
    /select 'aipify-strategic-alignment-prioritization-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era} capstone. People First.', 'authenticated', 200
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`Phase ${P.phase} Aipify[^']+`, "g"),
    `Phase ${P.phase} ${P.title} Engine — executive cockpit era capstone; cross-link only for related engines.`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  return sql;
}

function genMigration() {
  const src199 = path.join(ROOT, "supabase/migrations/20261359000000_aipify_strategic_alignment_prioritization_engine_phase199.sql");
  if (!fs.existsSync(src199)) {
    throw new Error("Phase 199 migration required — run complete-phase-199.mjs first");
  }
  let m = transformFrom199(fs.readFileSync(src199, "utf8"));
  m = m.replace(/_asape_seed_alignment_notes/g, `_${P.helper}_seed_${P.thirdEntity.replace("_notes", "")}_notes`);
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} — era capstone (${P.era}). ${P.companion} briefs and summarizes — does **NOT** make executive decisions or override leadership.

## Permissions

- \`${P.permPrefix}.view\` · \`${P.permPrefix}.manage\` · \`${P.permPrefix}.steward\`

## Helpers

- Engine: \`_${P.helper}_*\` · Blueprint: \`_${P.bp}_*\`

${P.crossLinkNote}
`,
  );
  write(
    path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
    `# Implementation Blueprint — Phase ${P.phase} ${P.title} Engine\n\nRoute: \`/app/${P.slug}\`\nEra: ${P.era} — **Capstone**\n${P.crossLinkNote}\n`,
  );
  write(
    path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
    `# ${P.title} Engine — FAQ (Phase ${P.phase})\n\n${P.faqBody}\n`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title} — Era Capstone ${P.eraRange}\nRoute: /app/${P.slug}\n${P.ilmExtra}\n${P.crossLinkNote}\nPeople First. Growth Partner — never Affiliate.\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} briefs; never decides.";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/${P.slug}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_COMPANION_LIMITATIONS = [\n${P.companionLimitations.map((l) => `  "${l}",`).join("\n")}\n] as const;\n`,
  );
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era} capstone. ${P.companion} supports executive visibility, since-last-login updates, attention queues, and founder stewardship. Briefs humans — does NOT make executive decisions. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Executive readiness score",
    modeLabel: "Cockpit mode",
    readinessLabel: "Founder visibility level",
    executiveReviews: "Executive cockpit reviews",
    activeReflections: "Active reflections",
    humanOversightRequired: `Human oversight required — humans decide; ${P.companion} briefs only`,
    eraOpenerSummary: `Perpetual Stewardship Era Capstone — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate era engine RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Executive reflection engine — reflection prompts",
    frameworkLabel: "Executive framework",
    reviewsLabel: "Executive cockpit reviews",
    companionLabel: `${P.companion} — briefs, does not decide`,
    subEngineLabel: "Since Last Login Center",
    reflections: "Executive reflection scaffolds",
    executiveReviewEntries: "Cockpit review entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT make executive decisions or override leadership`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports executive visibility — humans retain all decision authority.`,
      philosophy: "People First. Clarity without overload. Growth Partner terminology — never Affiliate.",
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
        ? "Executive cockpit"
        : locale === "sv"
          ? "Executive cockpit"
          : locale === "da"
            ? "Executive cockpit"
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
      'export * from "./implementation-blueprint-phase199-vocabulary";\nexport * from "./implementation-blueprint-phase200-vocabulary";',
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
  const entry = `\n**Aipify Executive Operating System & Founder's Cockpit Engine (Phase 200 — Era Capstone):** See [AIPIFY_EXECUTIVE_OPERATING_SYSTEM_FOUNDERS_COCKPIT_ENGINE_PHASE200.md](./AIPIFY_EXECUTIVE_OPERATING_SYSTEM_FOUNDERS_COCKPIT_ENGINE_PHASE200.md) — ${P.centerTitle} for executive cockpit, since-last-login center, attention queue, opportunity & risk monitor, founder mode, decision summaries, and cockpit knowledge libraries. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} briefs — **NOT** executive decisions. Cross-links only: Phase 199 strategic alignment, command_center, decision_support_engine. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 200")) {
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
console.log("Phase 200 complete");
