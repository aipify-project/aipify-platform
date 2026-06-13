#!/usr/bin/env node
/** ABOS Phase 223 — Aipify Organizational Insights & Executive Intelligence Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "executive_intelligence_dashboard",
  "trend_analysis_engine",
  "opportunity_intelligence_center",
  "risk_intelligence_monitor",
  "cross_functional_insight_engine",
  "executive_briefing_generator",
  "cockpit_command_health_integration",
  "executive_intelligence_knowledge_libraries",
];

const P = {
  phase: 223,
  migration: "20261384000000_aipify_organizational_insights_executive_intelligence_engine_phase223.sql",
  slug: "aipify-organizational-insights-executive-intelligence-engine",
  base: "AipifyOrganizationalInsightsExecutiveIntelligence",
  camel: "aipifyOrganizationalInsightsExecutiveIntelligenceEngine",
  snake: "aipify_organizational_insights_executive_intelligence",
  permPrefix: "aipify_organizational_insights_executive_intelligence",
  helper: "aoieie",
  bp: "aoieiebp223",
  decisionType: "aipify_organizational_insights_executive_intelligence_engine",
  title: "Aipify Organizational Insights & Executive Intelligence",
  centerTitle: "Executive Intelligence Center",
  companion: "Executive Intelligence Companion",
  scoreKey: "aipify_organizational_insights_executive_intelligence_score",
  modeKey: "executive_intelligence_mode",
  levelKey: "insight_maturity_level",
  thirdEntity: "executive_intelligence_notes",
  era: "Executive Intelligence Era (221–230)",
  eraRange: "221–230",
  docSlug: "AIPIFY_ORGANIZATIONAL_INSIGHTS_EXECUTIVE_INTELLIGENCE_ENGINE",
  ilmFile: "implementation-blueprint-phase223-aipify-organizational-insights-executive-intelligence.txt",
  navLabel: "Executive Intelligence",
  crossLinkNote:
    "Cross-links only: Executive Cockpit Phase 200, Global Command Center, and Organizational Health Engine Phase 198 — never expose sensitive intelligence beyond RBAC or replace human executive judgment.",
  companionLimitations: [
    "exposing_sensitive_intelligence_beyond_rbac",
    "bypassing_executive_confidentiality_controls",
    "replacing_human_executive_judgment",
    "automated_strategic_decisions_without_human_approval",
    "information_overload_without_summarization",
    "assumption_before_insight",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom222(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyPerformanceGoalAlignment", P.base],
    ["aipify-performance-goal-alignment-engine", P.slug],
    ["aipify_performance_goal_alignment", P.snake],
    ["aipifyPerformanceGoalAlignment", P.camel.replace(/Engine$/, "")],
    ["aipifyPerformanceGoalAlignmentEngine", P.camel],
    ["apgaebp222", P.bp],
    ["_apgae_", `_${P.helper}_`],
    ["aipify_performance_goal_alignment_score", P.scoreKey],
    ["goal_alignment_mode", P.modeKey],
    ["alignment_maturity_level", P.levelKey],
    ["goal_alignment_notes", P.thirdEntity],
    ["GoalAlignmentNote", thirdPascal],
    ["goal_alignment_notes_count", `${P.thirdEntity}_count`],
    ["Performance Center", P.centerTitle],
    ["Performance Companion", P.companion],
    ["Aipify Performance & Goal Alignment", P.title],
    ["Performance & Goal Alignment", P.navLabel],
    ["Phase 222", `Phase ${P.phase}`],
    ["aipify_performance_goal_alignment.view", `${P.permPrefix}.view`],
    ["aipify_performance_goal_alignment.manage", `${P.permPrefix}.manage`],
    ["aipify_performance_goal_alignment.steward", `${P.permPrefix}.steward`],
    ["20261383000000_aipify_performance_goal_alignment_engine_phase222.sql", P.migration],
    ["Repo Phase 222", `Repo Phase ${P.phase}`],
    ["Phase 222 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE222_AIPIFY_PERFORMANCE_GOAL_ALIGNMENT_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase222", `implementation-blueprint-phase${P.phase}`],
    ["goals_dashboard", SCAFFOLDS[0]],
    ["organizational_objectives_framework", SCAFFOLDS[1]],
    ["team_goal_center", SCAFFOLDS[2]],
    ["individual_goal_workspace", SCAFFOLDS[3]],
    ["performance_conversation_hub", SCAFFOLDS[4]],
    ["executive_alignment_dashboard", SCAFFOLDS[5]],
    ["action_career_executive_integration", SCAFFOLDS[6]],
    ["performance_knowledge_libraries", SCAFFOLDS[7]],
    ["performance_companion", "executive_intelligence_companion"],
    ["_seed_goal_alignment_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["goal alignment stewardship", "executive intelligence stewardship"],
    ["performance enablement decisions", "executive decision support"],
    ["alignment-first performance culture", "insight-first executive culture"],
    ["active goals and progress trends", "critical organizational insights"],
    ["strategic priority highlights", "trends requiring leadership attention"],
    ["Organizational Objectives Framework", "Trend Analysis Engine"],
    ["Team Goal Center", "Opportunity Intelligence Center"],
    ["Individual Goal Workspace", "Risk Intelligence Monitor"],
    ["Performance Conversation Hub", "Cross-Functional Insight Engine"],
    ["Executive Alignment Dashboard", "Executive Briefing Generator"],
    ["execution risk indicators", "organizational risk indicators"],
    ["development conversation prompts", "executive briefing prompts"],
    ["performance conversation prompts", "leadership summary prompts"],
    ["goal alignment summaries", "executive intelligence summaries"],
    ["alignment gap signals", "emerging trend signals"],
    ["confidential development information", "sensitive intelligence information"],
    ["Growth before judgment", "Insight before assumption"],
    ["Alignment before assumptions", "Clarity before complexity"],
    ["Stewardship before control", "Wisdom before urgency"],
    ["no_punitive_surveillance", "no_sensitive_intelligence_beyond_rbac"],
    ["AIPIFY_PERFORMANCE_GOAL_ALIGNMENT_ENGINE", P.docSlug],
    ["Performance Era", "Executive Intelligence Era"],
    ["Performance & Goal Alignment Era (221–230)", P.era],
    ["performance and goal alignment", "organizational insights and executive intelligence"],
    ["Performance alignment audit logs", "Executive intelligence audit logs"],
    ["performance RBAC", "executive intelligence RBAC"],
    ["goal alignment scaffolds", "executive intelligence scaffolds"],
    ["performance alignment controls", "executive confidentiality controls"],
    ["Goal alignment score", "Executive intelligence score"],
    ["Alignment maturity level", "Insight maturity level"],
    ["Goal alignment scaffolds", "Executive intelligence scaffolds"],
    ["Alignment insight entries", "Executive briefing entries"],
    ["Goal alignment", "Executive intelligence"],
    ["goal alignment", "executive intelligence"],
    ["performance enablement", "strategic insight delivery"],
    ["punitive surveillance", "sensitive intelligence beyond RBAC"],
    ["performance judgments", "strategic decisions"],
    ["performance stewardship", "executive stewardship"],
    ["performance conversations", "leadership briefings"],
    ["/app/action-center", "/app/command-center"],
    ["Action Center", "Global Command Center"],
    ["action_center", "command_center"],
    ["Career Development Engine Phase 219", "Organizational Health Engine Phase 198"],
    ["/app/aipify-employee-growth-career-development-engine", "/app/aipify-organizational-health-engine"],
    ["career_development_engine", "organizational_health_engine"],
    ["Career development integration", "Organizational health integration"],
    ["Action Center, career development, and executive cockpit", "Executive Cockpit, Global Command Center, and Organizational Health Engine"],
    ["Action Center, career development, and executive cockpit engines", "Executive Cockpit, Global Command Center, and Organizational Health Engine"],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports actionable executive intelligence — NOT exposing sensitive intelligence beyond RBAC, bypassing confidentiality controls, or replacing human executive judgment. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Provide executives and leadership teams with actionable organizational intelligence by transforming operational data into strategic insights that support better decision-making — ${P.companion} prepares, humans decide.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Executive Intelligence Era (${P.eraRange}). Human-stewarded organizational insights; RBAC-protected executive intelligence scaffolds; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where executives gain strategic awareness early, decision confidence strengthens, and leadership routines stay concise without information overload.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'trend_analysis_engine', 'label', 'Trend analysis engine', 'emoji', '🧭', 'description', 'Meaningful changes over time and emerging patterns'),
    jsonb_build_object('key', 'opportunity_intelligence_center', 'label', 'Opportunity intelligence center', 'emoji', '🗺️', 'description', 'Untapped potential and strategic discussion prompts'),
    jsonb_build_object('key', 'executive_briefing_generator', 'label', 'Executive briefing generator', 'emoji', '📈', 'description', 'Concise leadership summaries and review recommendations'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not replace executive judgment or overload leaders'),
    jsonb_build_object('key', 'risk_intelligence_monitor', 'label', 'Risk intelligence monitor', 'emoji', '🎯', 'description', 'Organizational vulnerabilities and developing concerns'),
    jsonb_build_object('key', 'cross_functional_insight_engine', 'label', 'Cross-functional insight engine', 'emoji', '🧠', 'description', 'Department connections and systemic relationships'),
    jsonb_build_object('key', 'executive_intelligence_knowledge_libraries', 'label', 'Executive intelligence knowledge libraries', 'emoji', '📚', 'description', 'Approved executive intelligence guidance resources')
  ); ${D};
create or replace function public._${bp}_executive_intelligence_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities. Insight before assumption.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'executive_intelligence_dashboard', 'label', 'Executive Intelligence Dashboard — critical insights and trends requiring leadership attention'),
    jsonb_build_object('key', 'trend_analysis_engine', 'label', 'Trend Analysis Engine — meaningful changes over time and emerging patterns'),
    jsonb_build_object('key', 'opportunity_intelligence_center', 'label', 'Opportunity Intelligence Center — untapped potential and strategic discussions'),
    jsonb_build_object('key', 'risk_intelligence_monitor', 'label', 'Risk Intelligence Monitor — organizational vulnerabilities and developing concerns'),
    jsonb_build_object('key', 'cross_functional_insight_engine', 'label', 'Cross-Functional Insight Engine — systemic relationships across departments'),
    jsonb_build_object('key', 'executive_briefing_generator', 'label', 'Executive Briefing Generator — concise leadership summaries'),
    jsonb_build_object('key', 'cockpit_command_health_integration', 'label', 'Executive Cockpit, Command Center, and organizational health integration — cross-links only'),
    jsonb_build_object('key', 'executive_intelligence_knowledge_libraries', 'label', 'Executive intelligence knowledge libraries — approved resources')
  )); ${D};
create or replace function public._${bp}_trend_analysis_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Trend analysis engine — clarity before complexity.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'emerging_trends', 'label', 'Which emerging trends require executive attention this cycle?'),
    jsonb_build_object('key', 'meaningful_changes', 'label', 'What meaningful organizational changes are developing over time?'),
    jsonb_build_object('key', 'preparedness', 'label', 'Where should leadership prepare proactive responses?'),
    jsonb_build_object('key', 'cross_functional', 'label', 'Which cross-functional patterns reduce organizational blind spots?'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'How is executive intelligence kept RBAC-protected and confidential?')
  )); ${D};
create or replace function public._${bp}_opportunity_intelligence_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Opportunity intelligence center — insight before assumption with human stewardship.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'untapped_potential', 'label', 'Areas of untapped potential'),
    jsonb_build_object('key', 'strategic_discussions', 'label', 'Strategic discussion prompts'),
    jsonb_build_object('key', 'innovation_signals', 'label', 'Innovation opportunity signals'),
    jsonb_build_object('key', 'competitive_positioning', 'label', 'Competitive positioning insights'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'RBAC-protected executive intelligence metadata'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); ${D};
create or replace function public._${bp}_executive_briefing_generator() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive briefing generator — wisdom before urgency.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'leadership_summaries', 'label', 'Concise leadership summaries'),
    jsonb_build_object('key', 'review_recommendations', 'label', 'Recommended areas for review'),
    jsonb_build_object('key', 'information_overload_reduction', 'label', 'Information overload reduction'),
    jsonb_build_object('key', 'decision_confidence', 'label', 'Decision confidence indicators'),
    jsonb_build_object('key', 'strategic_preparedness', 'label', 'Strategic preparedness signals')
  )); ${D};
create or replace function public._${bp}_executive_intelligence_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports executive-friendly intelligence and never exposes sensitive information beyond RBAC or automates strategic decisions.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'executive_intelligence_summaries', 'label', 'Executive intelligence summaries'),
    jsonb_build_object('key', 'trend_insights', 'label', 'Trend insights'),
    jsonb_build_object('key', 'briefing_recommendations', 'label', 'Briefing recommendations'),
    jsonb_build_object('key', 'leadership_summary_prompts', 'label', 'Leadership summary prompts'),
    jsonb_build_object('key', 'readiness_highlights', 'label', 'Readiness highlights'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'RBAC-protected executive intelligence — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_risk_intelligence_monitor() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Risk intelligence monitor — insight before assumption.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'organizational_vulnerabilities', 'label', 'Organizational vulnerabilities'),
    jsonb_build_object('key', 'developing_concerns', 'label', 'Developing concern signals'),
    jsonb_build_object('key', 'mitigation_planning', 'label', 'Mitigation planning prompts'),
    jsonb_build_object('key', 'resilience_support', 'label', 'Resilience improvement support'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no sensitive operational records'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for intelligence actions')
  )); ${D};
create or replace function public._${bp}_cross_functional_insight_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Cross-functional insight engine — clarity before complexity.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'department_connections', 'label', 'Information connections across departments'),
    jsonb_build_object('key', 'systemic_relationships', 'label', 'Systemic relationship identification'),
    jsonb_build_object('key', 'blind_spot_reduction', 'label', 'Organizational blind spot reduction'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Executive intelligence audit trails'),
    jsonb_build_object('key', 'no_auto_decisions', 'label', 'Never automate strategic decisions without human approval'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'Executive confidentiality controls — RBAC enforced')
  )); ${D};
create or replace function public._${bp}_cockpit_command_health_integration() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive Cockpit, Command Center, and organizational health integration — cross-links only.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200 cross-link', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'command_center', 'label', 'Global Command Center cross-link', 'cross_link', '/app/command-center'),
    jsonb_build_object('key', 'organizational_health_engine', 'label', 'Organizational Health Engine Phase 198 cross-link', 'cross_link', '/app/aipify-organizational-health-engine'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds — RBAC protected'),
    jsonb_build_object('key', 'no_auto_decisions', 'label', 'Never expose sensitive intelligence beyond RBAC')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Exposing sensitive intelligence beyond RBAC',
      'Bypassing executive confidentiality controls',
      'Replacing human executive judgment',
      'Automated strategic decisions without human approval',
      'Information overload without summarization',
      'Assumption before insight',
      'Override human judgment'), 'principle', '${P.companion} supports — humans steward executive decisions and strategic intelligence.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm leadership routines without information overload or urgency pressure.', 'values', jsonb_build_array('insight_before_assumption','clarity_before_complexity','wisdom_before_urgency','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Executive intelligence audit logs via aipify_organizational_insights_executive_intelligence_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_organizational_insights_executive_intelligence permissions — executive intelligence RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'RBAC-protected executive intelligence scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'confidentiality', 'label', 'Executive confidentiality controls — RBAC enforced'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 222, 'key', 'performance_goal_alignment', 'label', 'Performance & Goal Alignment Phase 222', 'route', '/app/aipify-performance-goal-alignment-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 223, 'key', 'organizational_insights_executive_intelligence', 'label', 'Executive Intelligence Phase 223', 'route', '/app/${P.slug}', 'description', 'Human-stewarded organizational insights and executive intelligence')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive cockpit integration — cross-link only'),
    jsonb_build_object('key', 'command_center', 'label', 'Global Command Center', 'route', '/app/command-center', 'relationship', 'Command center integration — cross-link only'),
    jsonb_build_object('key', 'organizational_health_engine', 'label', 'Organizational Health Engine Phase 198', 'route', '/app/aipify-organizational-health-engine', 'relationship', 'Organizational health integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Wisdom before urgency — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with RBAC-protected executive intelligence scaffolds and human stewardship gates. Growth Partner terminology. ${P.companion} supports — never exposes sensitive intelligence beyond RBAC or automates strategic decisions.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans steward executive decisions and strategic intelligence.', '${P.companion} informs and supports.', 'Insight before assumption — clarity before complexity.', 'Growth Partner — never Affiliate.', 'Executive Intelligence Era — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — executive intelligence signals max ~500 chars. No sensitive operational records, raw intelligence payloads, or confidential briefing content beyond RBAC.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_performance_goal_alignment_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._apgaebp222_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_trend_analysis_engine\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Trend analysis engine — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_trend_analysis_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  for (const fn of [
    "executive_intelligence_dashboard",
    "trend_analysis_engine",
    "opportunity_intelligence_center",
    "executive_briefing_generator",
    "executive_intelligence_companion",
    "risk_intelligence_monitor",
    "cross_functional_insight_engine",
    "cockpit_command_health_integration",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${P.bp}_${fn}()`);
  }

  sql = sql.replace(
    /select 'aipify-performance-goal-alignment-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected performance and goal alignment guidance within Performance Era; cross-link only for Action Center, career development, and executive cockpit.",
    "RBAC-protected organizational insights and executive intelligence guidance within Executive Intelligence Era; cross-link only for Executive Cockpit, Global Command Center, and Organizational Health Engine.",
  );

  return sql;
}

function genMigration() {
  const src222 = path.join(ROOT, "supabase/migrations/20261383000000_aipify_performance_goal_alignment_engine_phase222.sql");
  if (!fs.existsSync(src222)) throw new Error("Phase 222 migration required");
  let m = transformFrom222(fs.readFileSync(src222, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-performance-goal-alignment-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(path.join(ROOT, `lib/core/${P.slug}.ts`), transformFrom222(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")));
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom222(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")));
  }
  const panel = path.join(ROOT, `components/app/${srcSlug}/AipifyPerformanceGoalAlignmentEngineDashboardPanel.tsx`);
  write(path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`), transformFrom222(fs.readFileSync(panel, "utf8")));
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`);
  write(path.join(ROOT, `app/app/${P.slug}/page.tsx`), transformFrom222(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")));
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom222(fs.readFileSync(path.join(ROOT, `app/api/aipify/${srcSlug}/${route}/route.ts`), "utf8")),
    );
  }
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports actionable executive intelligence — does NOT expose sensitive intelligence beyond RBAC or replace human executive judgment.

## Permissions

- \`${P.permPrefix}.view\` · \`${P.permPrefix}.manage\` · \`${P.permPrefix}.steward\`

## Helpers

- Engine: \`_${P.helper}_*\` · Blueprint: \`_${P.bp}_*\`

${P.crossLinkNote}
`,
  );
  write(
    path.join(ROOT, `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md`),
    `# Implementation Blueprint — Phase ${P.phase} ${P.title} Engine

Route: \`/app/${P.slug}\`
Era: ${P.era}
${P.crossLinkNote}
`,
  );
  write(
    path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
    `# ${P.title} Engine — FAQ (Phase ${P.phase})

## What is the Organizational Insights & Executive Intelligence Engine?

Organizational Insights & Executive Intelligence provides actionable organizational intelligence and concise leadership briefings at \`/app/${P.slug}\`.

## Does the Executive Intelligence Companion replace executive judgment?

**No.** ${P.companion} prepares executive-friendly summaries and trend insights — it does **NOT** expose sensitive intelligence beyond RBAC or automate strategic decisions without human approval.

## What does the Executive Intelligence Center include?

Executive intelligence dashboard, trend analysis engine, opportunity intelligence center, risk intelligence monitor, cross-functional insight engine, and executive briefing generator — RBAC-protected metadata only.

## How does this relate to Executive Cockpit, Command Center, and Organizational Health?

Cross-link only: Executive Cockpit Phase 200 (\`/app/aipify-executive-operating-system-founders-cockpit-engine\`), Global Command Center (\`/app/command-center\`), and Organizational Health Engine Phase 198 (\`/app/aipify-organizational-health-engine\`). Never duplicate their RPCs.

## Why are RBAC and confidentiality controls required?

Humans retain executive decision authority. Aipify delivers concise insights — it does not expose sensitive intelligence beyond role-based access or overwhelm leaders with excessive detail.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Executive Intelligence Center: executive intelligence dashboard, trend analysis engine, opportunity intelligence center, risk intelligence monitor, cross-functional insight engine, executive briefing generator, cockpit/command/health integration (cross-links), executive intelligence knowledge libraries.
Trend Analysis Engine: meaningful changes over time, emerging patterns, and proactive preparedness prompts.
Opportunity Intelligence Center: untapped potential, strategic discussions, and innovation signals.
Risk Intelligence Monitor: organizational vulnerabilities, developing concerns, and mitigation planning.
Cross-Functional Insight Engine: department connections and systemic relationship visibility.
Executive Briefing Generator: concise leadership summaries and recommended review areas.
Design principles: Insight before assumption, clarity before complexity, wisdom before urgency.
Companion limitations: no sensitive intelligence beyond RBAC, no automated strategic decisions without human approval.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never exposes sensitive intelligence beyond RBAC or replaces executive judgment.";
export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/${P.slug}";
export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_COMPANION_LIMITATIONS = [
${P.companionLimitations.map((l) => `  "${l}",`).join("\n")}
] as const;
`,
  );
}

function patchNav() {
  let c = fs.readFileSync(path.join(ROOT, "lib/app/nav-config.ts"), "utf8");
  const id = P.camel;
  const href = `/app/${P.slug}`;
  if (!c.includes(`"${id}"`)) {
    c = c.replace('| "aipifyPerformanceGoalAlignmentEngine"', `| "aipifyPerformanceGoalAlignmentEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    const anchor = /id: "aipifyPerformanceGoalAlignmentEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyPerformanceGoalAlignmentEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-performance-goal-alignment-engine")) {\n    return "aipifyPerformanceGoalAlignmentEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-performance-goal-alignment-engine")) {\n    return "aipifyPerformanceGoalAlignmentEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_performance_goal_alignment.steward",', `"aipify_performance_goal_alignment.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-performance-goal-alignment-engine";',
      `export * from "./aipify-performance-goal-alignment-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports organizational insights, trend analysis, and concise executive briefings. Supports leaders — does NOT expose sensitive intelligence beyond RBAC. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Executive intelligence score",
    modeLabel: "Mode",
    readinessLabel: "Insight maturity level",
    executiveReviews: "Executive briefing generator",
    activeReflections: "Active executive intelligence scaffolds",
    humanOversightRequired: `Human oversight required — humans steward executive decisions; ${P.companion} supports only`,
    eraOpenerSummary: `Executive Intelligence Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate Executive Cockpit, Command Center, or Organizational Health RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Trend analysis engine — insight prompts",
    frameworkLabel: "Opportunity intelligence center",
    reviewsLabel: "Executive briefing generator",
    companionLabel: `${P.companion} — supports insight, never replaces executive judgment`,
    subEngineLabel: "Risk intelligence monitor",
    reflections: "Executive intelligence scaffolds",
    executiveReviewEntries: "Executive briefing entries",
    scaffoldNotes: "RBAC-protected executive intelligence scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT expose sensitive intelligence beyond RBAC or automate strategic decisions`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports executive intelligence visibility — humans retain executive decision authority.`,
      philosophy: "People First. RBAC-protected executive intelligence scaffolds. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
      growthEra: `${P.era} — Phase ${P.phase}.`,
    },
  };
}

function patchI18n() {
  for (const locale of ["en", "no", "sv", "da"]) {
    const file = path.join(ROOT, `locales/${locale}/customerApp.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.nav = data.nav ?? {};
    data.nav[P.camel] =
      locale === "no"
        ? "Organisasjonsinnsikt og ledelsesintelligens"
        : locale === "sv"
          ? "Organisationsinsikter och ledningsintelligens"
          : locale === "da"
            ? "Organisationsindsigt og ledelsesintelligens"
            : P.navLabel;
    data[P.camel] = i18nBlock();
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  }
}

function patchIlmIndex() {
  const file = path.join(ROOT, "lib/internal-language-model/index.ts");
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes(`implementation-blueprint-phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase222-vocabulary";',
      `export * from "./implementation-blueprint-phase222-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE222_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase222-aipify-performance-goal-alignment.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE222_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase222-aipify-performance-goal-alignment.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_performance_goal_alignment.view`, `aipify_performance_goal_alignment.manage`, `aipify_performance_goal_alignment.steward`.";
  const entry = `\n**Aipify Organizational Insights & Executive Intelligence Engine (Phase 223):** See [${P.docSlug}_PHASE223.md](./${P.docSlug}_PHASE223.md) — Executive Intelligence Center for executive intelligence dashboard, trend analysis engine, opportunity intelligence center, risk intelligence monitor, cross-functional insight engine, executive briefing generator, and Executive Cockpit/Command Center/organizational health integration. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** exposing sensitive intelligence beyond RBAC. Cross-links only: Executive Cockpit Phase 200, Global Command Center, Organizational Health Engine Phase 198. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 223")) {
    const idx = c.indexOf(marker);
    c = idx === -1 ? `${c}\n${entry}\n` : `${c.slice(0, idx + marker.length)}${entry}${c.slice(idx + marker.length)}`;
    fs.writeFileSync(file, c);
  }
}

genStack();
genMigration();
genDocs();
patchNav();
patchPermissions();
patchTenant();
patchI18n();
patchIlmIndex();
patchArchitecture();
console.log(`Phase ${P.phase} complete`);
