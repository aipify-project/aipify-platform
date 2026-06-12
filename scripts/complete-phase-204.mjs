#!/usr/bin/env node
/** ABOS Phase 204 — Aipify Knowledge Discovery & Intelligent Search Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const P = {
  phase: 204,
  migration: "20261364000000_aipify_knowledge_discovery_intelligent_search_engine_phase204.sql",
  slug: "aipify-knowledge-discovery-intelligent-search-engine",
  base: "AipifyKnowledgeDiscoveryIntelligentSearch",
  camel: "aipifyKnowledgeDiscoveryIntelligentSearchEngine",
  snake: "aipify_knowledge_discovery_intelligent_search",
  permPrefix: "aipify_knowledge_discovery_intelligent_search",
  helper: "akdise",
  bp: "akdisebp204",
  decisionType: "aipify_knowledge_discovery_intelligent_search_engine",
  prevDecision: "aipify_digital_headquarters_engine",
  title: "Aipify Knowledge Discovery & Intelligent Search",
  centerTitle: "Knowledge Result Center",
  companion: "Discovery Companion",
  scoreKey: "aipify_knowledge_discovery_intelligent_search_score",
  modeKey: "search_discovery_mode",
  levelKey: "search_relevance_level",
  thirdEntity: "feedback_notes",
  era: "Global Command & Enterprise Operations Era (201–210)",
  eraRange: "201–210",
  docSlug: "AIPIFY_KNOWLEDGE_DISCOVERY_INTELLIGENT_SEARCH_ENGINE",
  ilmFile: "implementation-blueprint-phase204-aipify-knowledge-discovery-intelligent-search.txt",
  navLabel: "Knowledge Discovery",
  crossLinkNote:
    "Cross-links only: Phase 203 digital headquarters, knowledge_center_engine, employee_knowledge_engine — never duplicate RPCs, bypass RBAC, or index raw sensitive content.",
  ilmExtra: `
Knowledge Result Center: global search bar, intelligent search engine, summarized answers with source links, permission-aware search, knowledge feedback system, knowledge gap detection, multi-language search scaffolds, search knowledge libraries.
Search Reflection Engine prompts: How much time is spent searching? Is knowledge accessible? Do permission boundaries build trust? Where are knowledge gaps? What institutional learning emerges?
Search Framework: search accessibility, natural language, permission awareness, result clarity, feedback loops, gap detection, enterprise scale.
Executive Search Reviews, Discovery Companion, Intelligent Search Engine, Permission-Aware Search, Knowledge Gap Detection tracks.
Companion limitations: no bypassing RBAC, no exposing unauthorized content, no auto-publishing knowledge, no replacing knowledge stewards, no storing raw sensitive content in search indexes.`,
  faqBody: `## What is Knowledge Discovery & Intelligent Search?

Knowledge Discovery helps organizations find approved knowledge quickly with permission-aware, metadata-only search — at \`/app/aipify-knowledge-discovery-intelligent-search-engine\`.

## Can Aipify expose content I am not allowed to see?

**No.** Permission-Aware Search respects RBAC and enterprise confidentiality. The Discovery Companion never bypasses permissions or exposes unauthorized content.

## What does the Knowledge Result Center show?

Summarized answers, source links, and related resources — metadata only, aligned with Trust Architecture. No raw sensitive content in search indexes.

## How does knowledge gap detection work?

Frequent searches lacking documentation surface as gap recommendations for knowledge stewards — Aipify does not auto-publish knowledge.

## Why human stewards?

Knowledge stewards approve and maintain content. The Discovery Companion guides feedback and gap insights — it does not replace stewards.`,
  companionLimitations: [
    "bypass_rbac",
    "expose_unauthorized_content",
    "auto_publish_knowledge",
    "replace_knowledge_stewards",
    "store_raw_sensitive_content_in_indexes",
    "replace_human_judgment",
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
    ["AlignmentNote", thirdPascal],
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
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE199_AIPIFY_STRATEGIC_ALIGNMENT_PRIORITIZATION_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase199", `implementation-blueprint-phase${P.phase}`],
    ["strategic_priorities_dashboard", "knowledge_result_center"],
    ["alignment_reflection_engine", "search_reflection_engine"],
    ["strategic_framework", "search_framework"],
    ["executive_strategic_reviews", "executive_search_reviews"],
    ["strategy_companion", "discovery_companion"],
    ["initiative_alignment_engine", "intelligent_search_engine"],
    ["resource_awareness_center", "permission_aware_search"],
    ["Executive Strategic Reviews", "Executive Search Reviews"],
    ["strategic alignment within", "knowledge discovery within"],
    ["_seed_alignment_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["define organizational strategy", "bypass RBAC permissions"],
    ["auto-prioritize without approval", "auto-publish knowledge without approval"],
    ["Strategy Companion supports", "Discovery Companion supports"],
    ["never defines strategy or auto-prioritizes", "never bypasses RBAC or exposes unauthorized content"],
    ["supports — does not define strategy", "supports — does not bypass permissions"],
    [
      "supports alignment reflection, does not define strategy or auto-prioritize",
      "supports search discovery, does not bypass RBAC or auto-publish knowledge",
    ],
    ["Perpetual Stewardship & Constitutional Governance Era (191–200)", P.era],
    ["Perpetual Stewardship Era — Phases 191–200", `Global Command Era — Phases ${P.eraRange}`],
    ["191–200", P.eraRange],
    ["adtebp197", P.bp],
    ["aipify_decision_transparency", P.snake.replace("_engine", "")],
    ["AipifyDecisionTransparency", P.base.replace("IntelligentSearch", "")],
    ["parseAipifyDecisionTransparencyEngineDashboard", `parse${P.base}EngineDashboard`],
    ["AipifyDecisionTransparencyEngineDashboard", `${P.base}EngineDashboard`],
    ["AipifyDecisionTransparencyEngineDashboardPanel", `${P.base}EngineDashboardPanel`],
    ["aipify-decision-transparency-engine", P.slug],
    ["aipify_decision_transparency_score", P.scoreKey],
    ["aipify_decision_transparency_mission", `${P.snake}_mission`],
    ["not_surveillance", "permission_aware"],
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
  const src = path.join(ROOT, "lib/aipify/aipify-strategic-alignment-prioritization-engine");
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom199(fs.readFileSync(path.join(src, f), "utf8")));
  }
  const panel = path.join(
    ROOT,
    "components/app/aipify-strategic-alignment-prioritization-engine/AipifyStrategicAlignmentPrioritizationEngineDashboardPanel.tsx",
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/${engine}DashboardPanel.tsx`),
    transformFrom199(fs.readFileSync(panel, "utf8")),
  );
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${engine}DashboardPanel } from "./${engine}DashboardPanel";\n`);
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom199(
      fs.readFileSync(path.join(ROOT, "app/app/aipify-strategic-alignment-prioritization-engine/page.tsx"), "utf8"),
    ),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom199(
        fs.readFileSync(path.join(ROOT, `app/api/aipify/aipify-strategic-alignment-prioritization-engine/${route}/route.ts`), "utf8"),
      ),
    );
  }
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports permission-aware search — NOT bypassing RBAC or exposing unauthorized content. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Help organizations discover approved knowledge quickly with intelligent, permission-aware, metadata-only search — humans and stewards retain authority.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Global Command Era (${P.eraRange}). Permission-aware discovery; metadata-only indexes; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where teams find trusted knowledge quickly, gaps are visible to stewards, and search respects enterprise confidentiality.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '🔍', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'search_reflection_engine', 'label', 'Search reflection engine', 'emoji', '🪞', 'description', 'Discovery reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Search framework', 'emoji', '🛡️', 'description', 'Seven search domains'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive search reviews', 'emoji', '👥', 'description', 'Search effectiveness reflection'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not bypass permissions'),
    jsonb_build_object('key', 'intelligent_search_engine', 'label', 'Intelligent Search Engine', 'emoji', '⚙️', 'description', 'Relevance and intent scaffolds'),
    jsonb_build_object('key', 'permission_aware_search', 'label', 'Permission-Aware Search', 'emoji', '📖', 'description', 'RBAC and confidentiality scaffolds'),
    jsonb_build_object('key', 'knowledge_libraries', 'label', 'Search knowledge libraries', 'emoji', '🌱', 'description', 'Approved search resources')
  ); ${D};
create or replace function public._${bp}_knowledge_result_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'global_search_bar', 'label', 'Global Search Bar — platform-wide, natural language, instant suggestions'),
    jsonb_build_object('key', 'intelligent_search_engine', 'label', 'Intelligent Search Engine — relevance, context/intent, approved usage patterns'),
    jsonb_build_object('key', 'knowledge_result_center', 'label', 'Knowledge Result Center — summarized answers, source links, related resources'),
    jsonb_build_object('key', 'permission_aware_search', 'label', 'Permission-Aware Search — RBAC, enterprise security, confidentiality'),
    jsonb_build_object('key', 'knowledge_feedback_system', 'label', 'Knowledge Feedback System — outdated info reports, continuous improvement'),
    jsonb_build_object('key', 'knowledge_gap_detection', 'label', 'Knowledge Gap Detection — frequent searches lacking docs, KC recommendations'),
    jsonb_build_object('key', 'multi_language_search', 'label', 'Multi-language search scaffolds'),
    jsonb_build_object('key', 'search_knowledge_libraries', 'label', 'Search knowledge libraries — approved discovery resources')
  )); ${D};
create or replace function public._${bp}_search_reflection_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Search reflection prompts — humans and stewards decide knowledge actions.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'time_spent_searching', 'label', 'How much time is spent searching?'),
    jsonb_build_object('key', 'knowledge_accessibility', 'label', 'Is knowledge accessible to those who need it?'),
    jsonb_build_object('key', 'permission_trust', 'label', 'Do permission boundaries build trust?'),
    jsonb_build_object('key', 'gap_detection', 'label', 'Where are knowledge gaps emerging?'),
    jsonb_build_object('key', 'institutional_learning', 'label', 'What institutional learning emerges from search patterns?')
  )); ${D};
create or replace function public._${bp}_search_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Search framework — periodic evaluation.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'search_accessibility', 'label', 'Search accessibility'),
    jsonb_build_object('key', 'natural_language', 'label', 'Natural language'),
    jsonb_build_object('key', 'permission_awareness', 'label', 'Permission awareness'),
    jsonb_build_object('key', 'result_clarity', 'label', 'Result clarity'),
    jsonb_build_object('key', 'feedback_loops', 'label', 'Feedback loops'),
    jsonb_build_object('key', 'gap_detection', 'label', 'Gap detection'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); ${D};
create or replace function public._${bp}_executive_search_reviews() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive search reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'search_effectiveness', 'label', 'Search effectiveness'),
    jsonb_build_object('key', 'kc_utilization', 'label', 'Knowledge Center utilization'),
    jsonb_build_object('key', 'permission_compliance', 'label', 'Permission compliance'),
    jsonb_build_object('key', 'gap_trends', 'label', 'Knowledge gap trends'),
    jsonb_build_object('key', 'productivity_impact', 'label', 'Productivity impact')
  )); ${D};
create or replace function public._${bp}_discovery_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports discovery, does not bypass permissions.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'search_summaries', 'label', 'Search summaries'),
    jsonb_build_object('key', 'result_highlights', 'label', 'Result highlights'),
    jsonb_build_object('key', 'gap_insights', 'label', 'Gap insights'),
    jsonb_build_object('key', 'feedback_guidance', 'label', 'Feedback guidance'),
    jsonb_build_object('key', 'permission_reminders', 'label', 'Permission reminders'),
    jsonb_build_object('key', 'stewardship_prompts', 'label', 'Stewardship prompts')
  )); ${D};
create or replace function public._${bp}_intelligent_search_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Intelligent Search Engine — metadata-only relevance scaffolds.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'relevance_ranking', 'label', 'Relevance ranking — approved patterns'),
    jsonb_build_object('key', 'context_intent', 'label', 'Context and intent detection'),
    jsonb_build_object('key', 'approved_usage_patterns', 'label', 'Approved usage patterns'),
    jsonb_build_object('key', 'instant_suggestions', 'label', 'Instant suggestions'),
    jsonb_build_object('key', 'metadata_only_indexes', 'label', 'Metadata-only indexes — no raw sensitive content'),
    jsonb_build_object('key', 'natural_language', 'label', 'Natural language queries')
  )); ${D};
create or replace function public._${bp}_permission_aware_search() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Permission-Aware Search — RBAC and confidentiality enforced.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'rbac_enforcement', 'label', 'RBAC enforcement'),
    jsonb_build_object('key', 'enterprise_security', 'label', 'Enterprise security boundaries'),
    jsonb_build_object('key', 'confidentiality_filters', 'label', 'Confidentiality filters'),
    jsonb_build_object('key', 'audience_scoping', 'label', 'Audience-scoped results'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Search audit trails'),
    jsonb_build_object('key', 'no_unauthorized_exposure', 'label', 'Never expose unauthorized content'),
    jsonb_build_object('key', 'two_factor_cross_link', 'label', 'Two-factor cross-link', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_knowledge_gap_detection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Knowledge Gap Detection — steward recommendations, not auto-publishing.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'frequent_unanswered_searches', 'label', 'Frequent searches lacking documentation'),
    jsonb_build_object('key', 'kc_content_recommendations', 'label', 'Knowledge Center content recommendations'),
    jsonb_build_object('key', 'steward_workflow', 'label', 'Steward review workflow'),
    jsonb_build_object('key', 'gap_trend_analytics', 'label', 'Gap trend analytics — aggregate metadata'),
    jsonb_build_object('key', 'continuous_improvement', 'label', 'Continuous improvement loops'),
    jsonb_build_object('key', 'feedback_integration', 'label', 'Feedback system integration'),
    jsonb_build_object('key', 'no_auto_publish', 'label', 'Never auto-publish knowledge')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypass RBAC',
      'Expose unauthorized content',
      'Auto-publish knowledge',
      'Replace knowledge stewards',
      'Store raw sensitive content in search indexes',
      'Override human judgment'), 'principle', '${P.companion} supports — humans and stewards decide knowledge actions.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — clarity, patience, and service toward accessible knowledge without frustration.', 'values', jsonb_build_array('clarity_before_complexity','speed_before_frustration','patience','service','recognition','confidence_without_overreach'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Search audit logs via aipify_knowledge_discovery_intelligent_search_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_knowledge_discovery_intelligent_search permissions'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only search indexes — Trust Architecture'),
    jsonb_build_object('key', 'audience_controls', 'label', 'No sensitive info outside authorized audiences'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 201, 'key', 'global_command', 'label', 'Global Command Phase 201', 'route', '/app/aipify-global-command-center-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 202, 'key', 'enterprise_operations', 'label', 'Enterprise Operations Phase 202', 'route', '/app/aipify-enterprise-operations-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 203, 'key', 'digital_headquarters', 'label', 'Digital Headquarters Phase 203', 'route', '/app/aipify-digital-headquarters-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 204, 'key', 'knowledge_discovery', 'label', 'Knowledge Discovery Phase 204', 'route', '/app/${P.slug}', 'description', 'Permission-aware intelligent search')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'digital_headquarters', 'label', 'Digital Headquarters Phase 203', 'route', '/app/aipify-digital-headquarters-engine', 'relationship', 'Prior phase — cross-link only'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center Engine', 'route', '/app/knowledge-center-engine', 'relationship', 'Approved knowledge sources — cross-link only'),
    jsonb_build_object('key', 'employee_knowledge', 'label', 'Employee Knowledge Engine', 'route', '/app/settings/employee-knowledge', 'relationship', 'Internal knowledge — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Clarity and patience — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with metadata-only search indexes and permission-aware discovery scaffolds. Growth Partner terminology. ${P.companion} supports — never bypasses RBAC or exposes unauthorized content.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — stewards decide knowledge actions.', '${P.companion} informs and supports.', 'Permission-aware — never unauthorized exposure.', 'Growth Partner — never Affiliate.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — search summaries and gap signals max ~500 chars. No raw sensitive content, PII, or unauthorized knowledge in indexes.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`) && sql.includes(`'${P.prevDecision}'`)) return sql;
  const additions = [];
  for (const entry of [
    "aipify_decision_transparency_engine",
    "aipify_organizational_health_early_warning_engine",
    "aipify_strategic_alignment_prioritization_engine",
    P.prevDecision,
    P.decisionType,
  ]) {
    if (!sql.includes(`'${entry}'`)) additions.push(`'${entry}'`);
  }
  if (additions.length === 0) return sql;
  return sql.replace(
    "'aipify_principles_enforcement_engine'",
    `'aipify_principles_enforcement_engine',\n    ${additions.join(",\n    ")}`,
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
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_knowledge_result_center\(\)->'capabilities'\) = 8,/,
    `jsonb_build_object('key', 'center', 'label', '${P.centerTitle} — eight capabilities', 'met', jsonb_array_length(public._${bp}_knowledge_result_center()->'capabilities') = 8,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_search_reflection_engine\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Search reflection engine — five questions', 'met', jsonb_array_length(public._${bp}_search_reflection_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'companion', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_discovery_companion\(\)->'capabilities'\) = 6,/,
    `jsonb_build_object('key', 'companion', 'label', '${P.companion} capabilities', 'met', jsonb_array_length(public._${bp}_discovery_companion()->'capabilities') = 6,`,
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
    "knowledge_result_center",
    "search_reflection_engine",
    "search_framework",
    "executive_search_reviews",
    "discovery_companion",
    "intelligent_search_engine",
    "permission_aware_search",
    "knowledge_gap_detection",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${bp}_${fn}()`);
  }

  if (!sql.includes("knowledge_gap_detection_meta")) {
    sql = sql.replace(
      `'sub_engine_meta', public._${bp}_intelligent_search_engine(),`,
      `'sub_engine_meta', public._${bp}_intelligent_search_engine(), 'permission_aware_search_meta', public._${bp}_permission_aware_search(), 'knowledge_gap_detection_meta', public._${bp}_knowledge_gap_detection(),`,
    );
  }

  sql = sql.replace(
    /select 'aipify-strategic-alignment-prioritization-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', 204
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`Phase ${P.phase} Aipify[^']+`, "g"),
    `Phase ${P.phase} ${P.title} Engine — knowledge discovery within Global Command era; cross-link only for related engines.`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replace(
    /'title', 'Aipify Strategic Alignment & Prioritization Engine'/g,
    `'title', '${P.title} Engine'`,
  );

  return sql;
}

function genMigration() {
  const src199 = path.join(ROOT, "supabase/migrations/20261359000000_aipify_strategic_alignment_prioritization_engine_phase199.sql");
  if (!fs.existsSync(src199)) {
    throw new Error("Phase 199 migration required — ensure migration exists");
  }
  let m = transformFrom199(fs.readFileSync(src199, "utf8"));
  m = m.replace(/_asape_seed_feedback_notes/g, `_akdise_seed_${P.thirdEntity.replace("_notes", "")}_notes`);
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports permission-aware discovery — does NOT bypass RBAC or expose unauthorized content.

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
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never bypasses RBAC.";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/${P.slug}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_COMPANION_LIMITATIONS = [\n${P.companionLimitations.map((l) => `  "${l}",`).join("\n")}\n] as const;\n`,
  );
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports permission-aware search, knowledge gap detection, and feedback guidance. Supports humans — does NOT bypass RBAC or expose unauthorized content. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Discovery score",
    modeLabel: "Mode",
    readinessLabel: "Search relevance level",
    executiveReviews: "Executive search reviews",
    activeReflections: "Active reflections",
    humanOversightRequired: `Human oversight required — stewards decide knowledge actions; ${P.companion} supports only`,
    eraOpenerSummary: `Global Command Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate era engine RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Search reflection engine — reflection prompts",
    frameworkLabel: "Search framework",
    reviewsLabel: "Executive search reviews",
    companionLabel: `${P.companion} — supports, does not bypass permissions`,
    subEngineLabel: "Intelligent Search Engine",
    reflections: "Search reflection scaffolds",
    executiveReviewEntries: "Search review entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT bypass RBAC or expose unauthorized content`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports permission-aware knowledge discovery — stewards retain publishing authority.`,
      philosophy: "People First. Metadata-only search. Growth Partner terminology — never Affiliate.",
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
        ? "Kunnskapsoppdagelse"
        : locale === "sv"
          ? "Kunskapsupptäckt"
          : locale === "da"
            ? "Videnssøgning"
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
  const entry = `\n**Aipify Knowledge Discovery & Intelligent Search Engine (Phase 204):** See [AIPIFY_KNOWLEDGE_DISCOVERY_INTELLIGENT_SEARCH_ENGINE_PHASE204.md](./AIPIFY_KNOWLEDGE_DISCOVERY_INTELLIGENT_SEARCH_ENGINE_PHASE204.md) — ${P.centerTitle} for global search bar, intelligent search engine, permission-aware search, knowledge feedback system, gap detection, multi-language scaffolds, and search knowledge libraries. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** bypassing RBAC or exposing unauthorized content. Cross-links only: Phase 203 digital headquarters, knowledge_center_engine, employee_knowledge_engine. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 204")) {
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
