#!/usr/bin/env node
/** ABOS Phase 203 — Aipify Digital Headquarters Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const P = {
  phase: 203,
  migration: "20261363000000_aipify_digital_headquarters_engine_phase203.sql",
  slug: "aipify-digital-headquarters-engine",
  base: "AipifyDigitalHeadquarters",
  camel: "aipifyDigitalHeadquartersEngine",
  snake: "aipify_digital_headquarters",
  permPrefix: "aipify_digital_headquarters",
  helper: "adhe",
  bp: "adhebp203",
  decisionType: "aipify_digital_headquarters_engine",
  prevDecision: "aipify_unified_workspace_engine",
  title: "Aipify Digital Headquarters Engine",
  centerTitle: "Digital Headquarters",
  companion: "Headquarters Companion",
  scoreKey: "aipify_digital_headquarters_score",
  modeKey: "digital_headquarters_mode",
  levelKey: "headquarters_clarity_level",
  thirdEntity: "notes",
  era: "Global Command & Enterprise Operations Era (201–210)",
  eraRange: "201–210",
  docSlug: "AIPIFY_DIGITAL_HEADQUARTERS_ENGINE",
  ilmFile: "implementation-blueprint-phase203-aipify-digital-headquarters.txt",
  navLabel: "Digital Headquarters",
  crossLinkNote:
    "Cross-links only: Phase 202 unified workspace, employee_knowledge_engine, notification_communication_engine — never duplicate RPCs or publish org communications without leadership approval.",
  ilmExtra: `
Digital Headquarters: company feed, executive updates center, events and milestones dashboard, resource library, department spaces, welcome center, multi-language support scaffolds, headquarters knowledge libraries.
Alignment Reflection Engine prompts: organizational alignment, internal communication, information silos, employee engagement, belonging for distributed teams.
Headquarters Framework: alignment, communication, engagement, events/milestones, resources, department spaces, onboarding.
Executive Headquarters Reviews, Headquarters Companion, Executive Updates Center practices, Events & Milestones practices, Resource Library tracks.
Design principles: enterprise-grade, Microsoft productivity, Apple simplicity, professional communication, clarity before complexity, belonging before bureaucracy.
Companion limitations: no publishing org communications, no overriding leadership messages, no exposing sensitive internal info, no replacing HR/comms teams, no determining org priorities.`,
  faqBody: `## What is the Digital Headquarters Engine?

Digital Headquarters provides a unified internal communication and resource hub — company feed, executive updates, events, resources, department spaces, and welcome center — at \`/app/aipify-digital-headquarters-engine\`.

## Can Aipify publish company communications?

**No.** Leadership and HR/comms teams publish organizational communications. The Headquarters Companion summarizes and recommends — it does not publish or override leadership messaging.

## Why department spaces and company feed?

Distributed teams need shared awareness without bureaucracy. Department spaces and the company feed strengthen belonging and cross-functional visibility.

## Resource library and welcome center?

The Resource Library centralizes handbooks, policies, and documents with version awareness. The Welcome Center supports onboarding and values introduction for new employees.

## Why human leadership?

Humans remain responsible for internal communications and organizational priorities. The Headquarters Companion informs — it does not replace HR/comms teams or determine org priorities.`,
  companionLimitations: [
    "publish_org_communications",
    "override_leadership_messages",
    "expose_sensitive_internal_info",
    "replace_hr_comms_teams",
    "determine_org_priorities",
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
    ["Aipify Organizational Health & Early Warning", P.title.replace(" Engine", "")],
    ["Aipify Organizational Health & Early Warning Engine", P.title],
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
    ["organizational_health_dashboard", "digital_headquarters_dashboard"],
    ["health_reflection_engine", "alignment_reflection_engine"],
    ["health_framework", "headquarters_framework"],
    ["executive_health_reviews", "executive_headquarters_reviews"],
    ["health_companion", "headquarters_companion"],
    ["early_warning_monitor", "executive_updates_center"],
    ["resolution_tracker_engine", "events_milestones_practices"],
    ["Executive Health Reviews", "Executive Headquarters Reviews"],
    ["organizational health within", "digital headquarters within"],
    ["_seed_health_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["conduct employee surveillance", "publish org communications"],
    ["take punitive actions", "override leadership messages"],
    ["Health Companion supports", "Headquarters Companion supports"],
    ["never surveils employees or takes punitive actions", "never publishes communications or overrides leadership"],
    ["supports — does not surveil", "supports — does not publish communications"],
    ["supports early awareness, does not surveil or punish", "supports internal awareness, does not publish or override leadership"],
    ["not_surveillance", "not_publishing"],
    ["Perpetual Stewardship & Constitutional Governance Era (191–200)", P.era],
    ["Perpetual Stewardship Era (191–200)", P.era],
    ["Perpetual Stewardship Era — Phases 191–200", `Global Command Era — Phases ${P.eraRange}`],
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
 * ${P.title} helpers (Phase ${P.phase}).
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
  const panel = path.join(
    ROOT,
    "components/app/aipify-organizational-health-early-warning-engine/AipifyOrganizationalHealthEarlyWarningEngineDashboardPanel.tsx",
  );
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
      transformFrom198(
        fs.readFileSync(path.join(ROOT, `app/api/aipify/aipify-organizational-health-early-warning-engine/${route}/route.ts`), "utf8"),
      ),
    );
  }
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports internal awareness — NOT publishing org communications or overriding leadership messaging. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Provide a unified digital headquarters for internal communication, executive updates, events, resources, department spaces, and welcome experiences — clarity before complexity, belonging before bureaucracy.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Global Command Era (${P.eraRange}). Professional communication strengthens belonging; humans decide; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where distributed teams share clarity, access resources easily, and feel belonging through a calm digital headquarters — without bureaucracy.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '🏢', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'alignment_reflection_engine', 'label', 'Alignment reflection engine', 'emoji', '🪞', 'description', 'Organizational alignment reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Headquarters framework', 'emoji', '🛡️', 'description', 'Seven headquarters domains'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive headquarters reviews', 'emoji', '👥', 'description', 'Leadership communication reflection'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not publish'),
    jsonb_build_object('key', 'executive_updates_center', 'label', 'Executive Updates Center', 'emoji', '⚙️', 'description', 'Strategic message practices'),
    jsonb_build_object('key', 'events_milestones_practices', 'label', 'Events & Milestones', 'emoji', '📖', 'description', 'Company events and achievements'),
    jsonb_build_object('key', 'resource_library_tracks', 'label', 'Resource Library tracks', 'emoji', '🌱', 'description', 'Documents, handbooks, policies')
  ); ${D};
create or replace function public._${bp}_digital_headquarters_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'company_feed', 'label', 'Company Feed — org updates, leadership communications, department announcements'),
    jsonb_build_object('key', 'executive_updates_center', 'label', 'Executive Updates Center — strategic messages, video/text/document formats'),
    jsonb_build_object('key', 'events_milestones_dashboard', 'label', 'Events & Milestones Dashboard — company events, achievements, milestones'),
    jsonb_build_object('key', 'resource_library', 'label', 'Resource Library — documents, handbooks, policies, version control'),
    jsonb_build_object('key', 'department_spaces', 'label', 'Department Spaces — department updates, cross-functional awareness'),
    jsonb_build_object('key', 'welcome_center', 'label', 'Welcome Center — onboarding, values intro, new employee resources'),
    jsonb_build_object('key', 'multi_language_support', 'label', 'Multi-language support scaffolds — en/no/sv/da readiness'),
    jsonb_build_object('key', 'headquarters_knowledge_libraries', 'label', 'Headquarters knowledge libraries — clear non-technical language')
  )); ${D};
create or replace function public._${bp}_alignment_reflection_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Alignment reflection prompts — humans decide communications.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'organizational_alignment', 'label', 'How aligned is internal communication with organizational goals?'),
    jsonb_build_object('key', 'internal_communication', 'label', 'Where does internal communication need clarity?'),
    jsonb_build_object('key', 'information_silos', 'label', 'What information silos limit cross-functional awareness?'),
    jsonb_build_object('key', 'employee_engagement', 'label', 'How can we strengthen employee engagement through the headquarters?'),
    jsonb_build_object('key', 'distributed_belonging', 'label', 'How do distributed teams experience belonging?')
  )); ${D};
create or replace function public._${bp}_headquarters_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Headquarters framework — periodic evaluation.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'alignment', 'label', 'Alignment'),
    jsonb_build_object('key', 'communication', 'label', 'Communication'),
    jsonb_build_object('key', 'engagement', 'label', 'Engagement'),
    jsonb_build_object('key', 'events_milestones', 'label', 'Events and milestones'),
    jsonb_build_object('key', 'resources', 'label', 'Resources'),
    jsonb_build_object('key', 'department_spaces', 'label', 'Department spaces'),
    jsonb_build_object('key', 'onboarding', 'label', 'Onboarding')
  )); ${D};
create or replace function public._${bp}_executive_headquarters_reviews() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive headquarters reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'company_feed_effectiveness', 'label', 'Company feed effectiveness'),
    jsonb_build_object('key', 'executive_updates_clarity', 'label', 'Executive updates clarity'),
    jsonb_build_object('key', 'events_visibility', 'label', 'Events visibility'),
    jsonb_build_object('key', 'resource_accessibility', 'label', 'Resource accessibility'),
    jsonb_build_object('key', 'welcome_onboarding_quality', 'label', 'Welcome and onboarding quality')
  )); ${D};
create or replace function public._${bp}_headquarters_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports awareness, does not publish or override leadership.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'feed_summaries', 'label', 'Feed summaries'),
    jsonb_build_object('key', 'update_briefings', 'label', 'Update briefings'),
    jsonb_build_object('key', 'event_highlights', 'label', 'Event highlights'),
    jsonb_build_object('key', 'resource_recommendations', 'label', 'Resource recommendations'),
    jsonb_build_object('key', 'department_awareness', 'label', 'Department awareness insights'),
    jsonb_build_object('key', 'welcome_guidance', 'label', 'Welcome and onboarding guidance')
  )); ${D};
create or replace function public._${bp}_executive_updates_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive Updates Center — leadership messaging practices, never auto-publish.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'strategic_messages', 'label', 'Strategic message scaffolds'),
    jsonb_build_object('key', 'format_support', 'label', 'Video, text, and document format awareness'),
    jsonb_build_object('key', 'leadership_approval', 'label', 'Leadership approval required before publish'),
    jsonb_build_object('key', 'clarity_review', 'label', 'Clarity review checkpoints'),
    jsonb_build_object('key', 'no_override', 'label', 'Never override leadership messaging'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Audit trails of reviews')
  )); ${D};
create or replace function public._${bp}_events_milestones_practices() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Events & Milestones — visibility and celebration metadata.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'company_events', 'label', 'Company event visibility'),
    jsonb_build_object('key', 'achievements', 'label', 'Achievement highlights'),
    jsonb_build_object('key', 'milestones', 'label', 'Milestone tracking scaffolds'),
    jsonb_build_object('key', 'cross_team_visibility', 'label', 'Cross-team visibility'),
    jsonb_build_object('key', 'calendar_awareness', 'label', 'Calendar awareness cross-links'),
    jsonb_build_object('key', 'celebration_tone', 'label', 'Professional celebration tone')
  )); ${D};
create or replace function public._${bp}_resource_library_tracks() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Resource Library — document metadata and version awareness.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'handbooks', 'label', 'Handbooks and guides'),
    jsonb_build_object('key', 'policies', 'label', 'Policy documents'),
    jsonb_build_object('key', 'version_control', 'label', 'Version control scaffolds'),
    jsonb_build_object('key', 'access_controls', 'label', 'RBAC on internal resources'),
    jsonb_build_object('key', 'search_discovery', 'label', 'Search and discovery'),
    jsonb_build_object('key', 'sensitive_protection', 'label', 'Sensitive information protected'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Audit trails of access reviews')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Publishing org communications',
      'Overriding leadership messages',
      'Expose sensitive internal info',
      'Replace HR/comms teams',
      'Determine organizational priorities',
      'Replace human relationships'), 'principle', '${P.companion} supports — humans decide communications.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — belonging, clarity, patience, service toward healthier teams.', 'values', jsonb_build_array('belonging','clarity','patience','service','recognition','confidence_without_bureaucracy'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Headquarters audit logs via aipify_digital_headquarters_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_digital_headquarters permissions'),
    jsonb_build_object('key', 'sensitive_info', 'label', 'Sensitive internal information protected — metadata only'),
    jsonb_build_object('key', 'documentation_controls', 'label', 'Internal documentation access controls'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 199, 'key', 'strategic_alignment', 'label', 'Strategic Alignment Phase 199', 'route', '/app/aipify-strategic-alignment-prioritization-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 200, 'key', 'global_command', 'label', 'Global Command Phase 200', 'route', '/app/aipify-global-command-center-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 201, 'key', 'enterprise_operations', 'label', 'Enterprise Operations Phase 201', 'route', '/app/aipify-enterprise-operations-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 202, 'key', 'unified_workspace', 'label', 'Unified Workspace Phase 202', 'route', '/app/aipify-unified-workspace-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 203, 'key', 'digital_headquarters', 'label', 'Digital Headquarters Phase 203', 'route', '/app/${P.slug}', 'description', 'Internal communication and resource hub')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'unified_workspace', 'label', 'Unified Workspace Phase 202', 'route', '/app/aipify-unified-workspace-engine', 'relationship', 'Prior phase — cross-link only'),
    jsonb_build_object('key', 'employee_knowledge', 'label', 'Employee Knowledge Engine', 'route', '/app/settings/employee-knowledge', 'relationship', 'Internal knowledge — cross-link only'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Notification Communication Engine', 'route', '/app/command-center', 'relationship', 'Delivery awareness — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Belonging support — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with metadata-only internal communication scaffolds. Growth Partner terminology. ${P.companion} supports — never publishes org communications or overrides leadership messaging.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans decide communications.', '${P.companion} informs and supports.', 'Clarity before complexity — belonging before bureaucracy.', 'Growth Partner — never Affiliate.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — aggregate trends, executive review summaries max ~500 chars. No PII, sensitive internal records, or unpublished leadership content.'; ${D};
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
    "aipify_organizational_health_early_warning_engine",
    "aipify_strategic_alignment_prioritization_engine",
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
    `-- Phase ${P.phase} — ${P.title}\n-- ${P.era}.\n-- Helpers: _${P.helper}_* (engine), _${P.bp}_* (blueprint)`,
  );
  sql = patchDecisionTypeChain(sql);
  const start = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const end = sql.indexOf(`create or replace function public._${P.helper}_refresh_metrics`);
  if (start !== -1 && end !== -1) sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);

  const bp = P.bp;
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_digital_headquarters_dashboard\(\)->'capabilities'\) = 8,/,
    `jsonb_build_object('key', 'center', 'label', '${P.centerTitle} — eight capabilities', 'met', jsonb_array_length(public._${bp}_digital_headquarters_dashboard()->'capabilities') = 8,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_alignment_reflection_engine\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Alignment reflection engine — five questions', 'met', jsonb_array_length(public._${bp}_alignment_reflection_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'companion', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_headquarters_companion\(\)->'capabilities'\) = 6,/,
    `jsonb_build_object('key', 'companion', 'label', '${P.companion} capabilities', 'met', jsonb_array_length(public._${bp}_headquarters_companion()->'capabilities') = 6,`,
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
    "digital_headquarters_dashboard",
    "alignment_reflection_engine",
    "headquarters_framework",
    "executive_headquarters_reviews",
    "headquarters_companion",
    "executive_updates_center",
    "events_milestones_practices",
    "resource_library_tracks",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${bp}_${fn}()`);
  }

  if (!sql.includes("resource_library_tracks_meta")) {
    sql = sql.replace(
      `'sub_engine_meta', public._${bp}_executive_updates_center(),`,
      `'sub_engine_meta', public._${bp}_executive_updates_center(), 'events_milestones_practices_meta', public._${bp}_events_milestones_practices(), 'resource_library_tracks_meta', public._${bp}_resource_library_tracks(),`,
    );
  }

  sql = sql.replace(
    /select 'aipify-organizational-health-early-warning-engine'[^;]+;/,
    `select '${P.slug}', '${P.title}', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', 203
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`Phase ${P.phase} Aipify[^']+`, "g"),
    `Phase ${P.phase} ${P.title} — digital headquarters within Global Command era; cross-link only for related engines.`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title}', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replace(
    /'title', 'Aipify Organizational Health & Early Warning Engine'/g,
    `'title', '${P.title}'`,
  );

  sql = sql.replace(
    /'organizational_health_dashboard', public\._\w+_digital_headquarters_dashboard\(\)/g,
    `'digital_headquarters_dashboard', public._${bp}_digital_headquarters_dashboard()`,
  );
  sql = sql.replace(
    /'health_reflection_engine', public\._\w+_alignment_reflection_engine\(\)/g,
    `'alignment_reflection_engine', public._${bp}_alignment_reflection_engine()`,
  );
  sql = sql.replace(
    /'health_framework', public\._\w+_headquarters_framework\(\)/g,
    `'headquarters_framework', public._${bp}_headquarters_framework()`,
  );
  sql = sql.replace(
    /'executive_health_reviews', public\._\w+_executive_headquarters_reviews\(\)/g,
    `'executive_headquarters_reviews', public._${bp}_executive_headquarters_reviews()`,
  );
  sql = sql.replace(
    /'health_companion', public\._\w+_headquarters_companion\(\)/g,
    `'headquarters_companion', public._${bp}_headquarters_companion()`,
  );
  sql = sql.replace(
    /'early_warning_monitor', public\._\w+_executive_updates_center\(\)/g,
    `'executive_updates_center', public._${bp}_executive_updates_center()`,
  );
  sql = sql.replace(
    /'resolution_tracker_engine', public\._\w+_events_milestones_practices\(\)/g,
    `'events_milestones_practices', public._${bp}_events_milestones_practices()`,
  );

  return sql;
}

function genMigration() {
  const src198 = path.join(ROOT, "supabase/migrations/20261358000000_aipify_organizational_health_early_warning_engine_phase198.sql");
  if (!fs.existsSync(src198)) {
    throw new Error("Phase 198 migration required — ensure migration exists");
  }
  let m = transformFrom198(fs.readFileSync(src198, "utf8"));
  m = m.replace(/_adhe_seed_headquarters_notes/g, `_adhe_seed_${P.thirdEntity.replace("_notes", "")}_notes`);
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports internal awareness — does NOT publish org communications or override leadership messaging.

## Permissions

- \`${P.permPrefix}.view\` · \`${P.permPrefix}.manage\` · \`${P.permPrefix}.steward\`

## Helpers

- Engine: \`_${P.helper}_*\` · Blueprint: \`_${P.bp}_*\`

${P.crossLinkNote}
`,
  );
  write(
    path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
    `# Implementation Blueprint — Phase ${P.phase} ${P.title}\n\nRoute: \`/app/${P.slug}\`\nEra: ${P.era}\n${P.crossLinkNote}\n`,
  );
  write(
    path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
    `# ${P.title} — FAQ (Phase ${P.phase})\n\n${P.faqBody}\n`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}\nRoute: /app/${P.slug}\n${P.ilmExtra}\n${P.crossLinkNote}\nPeople First. Growth Partner — never Affiliate.\n`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never publishes communications.";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/${P.slug}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_COMPANION_LIMITATIONS = [\n${P.companionLimitations.map((l) => `  "${l}",`).join("\n")}\n] as const;\n`,
  );
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports company feed, executive updates, events, resources, department spaces, and welcome center. Supports humans — does NOT publish org communications or override leadership messaging. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} (Phase ${P.phase})`,
    scoreLabel: "Engagement score",
    modeLabel: "Mode",
    readinessLabel: "Headquarters clarity level",
    executiveReviews: "Executive headquarters reviews",
    activeReflections: "Active reflections",
    humanOversightRequired: `Human oversight required — humans decide communications; ${P.companion} supports only`,
    eraOpenerSummary: `Global Command Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate era engine RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Alignment reflection engine — reflection prompts",
    frameworkLabel: "Headquarters framework",
    reviewsLabel: "Executive headquarters reviews",
    companionLabel: `${P.companion} — supports, does not publish`,
    subEngineLabel: "Executive Updates Center",
    reflections: "Alignment reflection scaffolds",
    executiveReviewEntries: "Headquarters review entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT publish org communications or override leadership`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports digital headquarters awareness — humans retain communication authority.`,
      philosophy: "People First. Clarity before complexity. Belonging before bureaucracy. Growth Partner terminology — never Affiliate.",
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
    if (!c.includes(`./${P.slug}`)) {
      c = c.replace(
        'export * from "./aipify-organizational-health-early-warning-engine";',
        `export * from "./aipify-organizational-health-early-warning-engine";\nexport * from "./${P.slug}";`,
      );
    }
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
        ? "Digitalt hovedkontor"
        : locale === "sv"
          ? "Digitalt huvudkontor"
          : locale === "da"
            ? "Digitalt hovedkvarter"
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
      : c.includes("phase198-vocabulary")
        ? 'export * from "./implementation-blueprint-phase198-vocabulary";'
        : 'export * from "./implementation-blueprint-phase197-vocabulary";';
    c = c.replace(anchor, `${anchor}\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`);
  }
  const corpus = `aipify-core/knowledge/internal-language-model/${P.ilmFile}`;
  if (!c.includes(corpus)) {
    const corpusAnchor = c.includes("phase199")
      ? '"aipify-core/knowledge/internal-language-model/implementation-blueprint-phase199-aipify-strategic-alignment-prioritization.txt";'
      : c.includes("phase198")
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
  const entry = `\n**Aipify Digital Headquarters Engine (Phase 203):** See [AIPIFY_DIGITAL_HEADQUARTERS_ENGINE_PHASE203.md](./AIPIFY_DIGITAL_HEADQUARTERS_ENGINE_PHASE203.md) — ${P.centerTitle} for company feed, executive updates, events and milestones, resource library, department spaces, welcome center, multi-language scaffolds, and headquarters knowledge libraries. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** publishing org communications or overriding leadership messaging. Cross-links only: Phase 202 unified workspace, employee_knowledge_engine, notification_communication_engine. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 203")) {
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
console.log(`Phase ${P.phase} complete`);
