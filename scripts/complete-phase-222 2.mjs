#!/usr/bin/env node
/** ABOS Phase 222 — Aipify Performance & Goal Alignment Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "goals_dashboard",
  "organizational_objectives_framework",
  "team_goal_center",
  "individual_goal_workspace",
  "performance_conversation_hub",
  "executive_alignment_dashboard",
  "action_career_executive_integration",
  "performance_knowledge_libraries",
];

const P = {
  phase: 222,
  migration: "20261383000000_aipify_performance_goal_alignment_engine_phase222.sql",
  slug: "aipify-performance-goal-alignment-engine",
  base: "AipifyPerformanceGoalAlignment",
  camel: "aipifyPerformanceGoalAlignmentEngine",
  snake: "aipify_performance_goal_alignment",
  permPrefix: "aipify_performance_goal_alignment",
  helper: "apgae",
  bp: "apgaebp222",
  decisionType: "aipify_performance_goal_alignment_engine",
  title: "Aipify Performance & Goal Alignment",
  centerTitle: "Performance Center",
  companion: "Performance Companion",
  scoreKey: "aipify_performance_goal_alignment_score",
  modeKey: "goal_alignment_mode",
  levelKey: "alignment_maturity_level",
  thirdEntity: "goal_alignment_notes",
  era: "Performance & Goal Alignment Era (221–230)",
  eraRange: "221–230",
  docSlug: "AIPIFY_PERFORMANCE_GOAL_ALIGNMENT_ENGINE",
  ilmFile: "implementation-blueprint-phase222-aipify-performance-goal-alignment.txt",
  navLabel: "Performance & Goal Alignment",
  crossLinkNote:
    "Cross-links only: Action Center, Phase 219 career development engine, and Phase 200 executive cockpit — never punitive surveillance, bypass RBAC, or expose confidential development information beyond role-based access.",
  companionLimitations: [
    "punitive_surveillance_or_performance_punishment",
    "bypassing_rbac_for_performance_data",
    "exposing_confidential_development_information_beyond_rbac",
    "replacing_human_leadership_judgment_on_performance",
    "automated_performance_decisions_without_human_approval",
    "judgment_before_growth",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom221(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyTalentAcquisitionWorkforcePlanning", P.base],
    ["aipify-talent-acquisition-workforce-planning-engine", P.slug],
    ["aipify_talent_acquisition_workforce_planning", P.snake],
    ["aipifyTalentAcquisitionWorkforcePlanning", P.camel.replace(/Engine$/, "")],
    ["aipifyTalentAcquisitionWorkforcePlanningEngine", P.camel],
    ["atawpebp221", P.bp],
    ["_atawpe_", `_${P.helper}_`],
    ["aipify_talent_acquisition_workforce_planning_score", P.scoreKey],
    ["talent_planning_mode", P.modeKey],
    ["workforce_readiness_level", P.levelKey],
    ["talent_planning_notes", P.thirdEntity],
    ["TalentPlanningNote", thirdPascal],
    ["talent_planning_notes_count", `${P.thirdEntity}_count`],
    ["Talent Center", P.centerTitle],
    ["Talent Companion", P.companion],
    ["Aipify Talent Acquisition & Workforce Planning", P.title],
    ["Talent & Workforce Planning", P.navLabel],
    ["Phase 221", `Phase ${P.phase}`],
    ["aipify_talent_acquisition_workforce_planning.view", `${P.permPrefix}.view`],
    ["aipify_talent_acquisition_workforce_planning.manage", `${P.permPrefix}.manage`],
    ["aipify_talent_acquisition_workforce_planning.steward", `${P.permPrefix}.steward`],
    ["20261382000000_aipify_talent_acquisition_workforce_planning_engine_phase221.sql", P.migration],
    ["Repo Phase 221", `Repo Phase ${P.phase}`],
    ["Phase 221 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE221_AIPIFY_TALENT_ACQUISITION_WORKFORCE_PLANNING_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase221", `implementation-blueprint-phase${P.phase}`],
    ["talent_dashboard", SCAFFOLDS[0]],
    ["workforce_planning_center", SCAFFOLDS[1]],
    ["recruitment_pipeline_overview", SCAFFOLDS[2]],
    ["capability_gap_monitor", SCAFFOLDS[3]],
    ["internal_mobility_opportunity_center", SCAFFOLDS[4]],
    ["executive_workforce_insights", SCAFFOLDS[5]],
    ["career_development_integration", SCAFFOLDS[6]],
    ["talent_knowledge_libraries", SCAFFOLDS[7]],
    ["talent_companion", "performance_companion"],
    ["_seed_talent_planning_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["talent planning stewardship", "goal alignment stewardship"],
    ["talent planning decisions", "performance enablement decisions"],
    ["planning-first talent culture", "alignment-first performance culture"],
    ["workforce planning indicators", "active goals and progress trends"],
    ["critical hiring priorities", "strategic priority highlights"],
    ["Workforce Planning Center", "Organizational Objectives Framework"],
    ["Recruitment Pipeline Overview", "Team Goal Center"],
    ["Capability Gap Monitor", "Individual Goal Workspace"],
    ["Internal Mobility Opportunity Center", "Performance Conversation Hub"],
    ["Executive Workforce Insights", "Executive Alignment Dashboard"],
    ["workforce risk indicators", "execution risk indicators"],
    ["internal mobility recommendations", "development conversation prompts"],
    ["talent planning prompts", "performance conversation prompts"],
    ["workforce planning summaries", "goal alignment summaries"],
    ["capability gap signals", "alignment gap signals"],
    ["protected candidate information", "confidential development information"],
    ["Potential before assumptions", "Growth before judgment"],
    ["Planning before reaction", "Alignment before assumptions"],
    ["Stewardship before urgency", "Stewardship before control"],
    ["no_unprotected_candidate_pii", "no_punitive_surveillance"],
    ["AIPIFY_TALENT_ACQUISITION_WORKFORCE_PLANNING_ENGINE", P.docSlug],
    ["Talent Era", "Performance Era"],
    ["Talent & Workforce Planning Era (221–230)", P.era],
    ["talent acquisition and workforce planning", "performance and goal alignment"],
    ["Talent planning audit logs", "Performance alignment audit logs"],
    ["recruitment RBAC", "performance RBAC"],
    ["workforce planning scaffolds", "goal alignment scaffolds"],
    ["workforce planning controls", "performance alignment controls"],
    ["Workforce readiness score", "Goal alignment score"],
    ["Workforce readiness level", "Alignment maturity level"],
    ["Talent planning scaffolds", "Goal alignment scaffolds"],
    ["Workforce insight entries", "Alignment insight entries"],
    ["Talent planning", "Goal alignment"],
    ["workforce planning", "goal alignment"],
    ["recruitment coordination", "performance enablement"],
    ["automates hiring", "uses punitive surveillance"],
    ["unprotected candidate PII", "punitive surveillance"],
    ["automate hiring", "punitive surveillance"],
    ["hiring decisions", "performance judgments"],
    ["talent stewardship", "performance stewardship"],
    ["Talent planning", "Goal alignment"],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports growth-focused goal alignment guidance — NOT punitive surveillance, bypassing RBAC, or exposing confidential development information beyond role-based access. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Help organizations align individual contributions, team objectives, and strategic priorities through transparent goal-setting and performance enablement practices — ${P.companion} prepares, humans steward performance conversations.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Performance Era (${P.eraRange}). Human-stewarded goal alignment and performance enablement; RBAC-protected development scaffolds; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where strategic alignment strengthens, goal clarity improves, and execution of priorities accelerates through transparent accountability and development-focused leadership.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'organizational_objectives_framework', 'label', 'Organizational objectives framework', 'emoji', '🧭', 'description', 'Company-wide strategic objectives and departmental alignment'),
    jsonb_build_object('key', 'team_goal_center', 'label', 'Team goal center', 'emoji', '🗺️', 'description', 'Team objectives, shared progress, and collaboration'),
    jsonb_build_object('key', 'executive_alignment_dashboard', 'label', 'Executive alignment dashboard', 'emoji', '📈', 'description', 'Organizational alignment visibility and execution risk signals'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports growth — does not punish or surveil performance'),
    jsonb_build_object('key', 'individual_goal_workspace', 'label', 'Individual goal workspace', 'emoji', '🎯', 'description', 'Personal objectives, milestones, and ownership'),
    jsonb_build_object('key', 'performance_conversation_hub', 'label', 'Performance conversation hub', 'emoji', '🧠', 'description', 'Regular check-ins and development-focused discussions'),
    jsonb_build_object('key', 'performance_knowledge_libraries', 'label', 'Performance knowledge libraries', 'emoji', '📚', 'description', 'Approved goal alignment guidance resources')
  ); ${D};
create or replace function public._${bp}_goals_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities. Growth before judgment.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'goals_dashboard', 'label', 'Goals Dashboard — active goals, progress trends, and strategic priority highlights'),
    jsonb_build_object('key', 'organizational_objectives_framework', 'label', 'Organizational Objectives Framework — company-wide strategic objectives and execution consistency'),
    jsonb_build_object('key', 'team_goal_center', 'label', 'Team Goal Center — team objectives, shared progress, and accountability'),
    jsonb_build_object('key', 'individual_goal_workspace', 'label', 'Individual Goal Workspace — personal objectives, milestones, and ownership'),
    jsonb_build_object('key', 'performance_conversation_hub', 'label', 'Performance Conversation Hub — regular check-ins and development discussions'),
    jsonb_build_object('key', 'executive_alignment_dashboard', 'label', 'Executive Alignment Dashboard — alignment visibility and execution risk indicators'),
    jsonb_build_object('key', 'action_career_executive_integration', 'label', 'Action Center, career development, and executive cockpit integration — cross-links only'),
    jsonb_build_object('key', 'performance_knowledge_libraries', 'label', 'Performance knowledge libraries — approved resources')
  )); ${D};
create or replace function public._${bp}_organizational_objectives_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Organizational objectives framework — alignment before assumptions.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'strategic_objectives', 'label', 'Which company-wide strategic objectives need clearer departmental alignment?'),
    jsonb_build_object('key', 'execution_consistency', 'label', 'Where is execution consistency strongest and where does it need support?'),
    jsonb_build_object('key', 'alignment_gaps', 'label', 'What alignment gaps should leadership address this cycle?'),
    jsonb_build_object('key', 'priority_clarity', 'label', 'How can goal clarity improve accountability across teams?'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'How is performance information kept RBAC-protected and confidential?')
  )); ${D};
create or replace function public._${bp}_team_goal_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Team goal center — stewardship before control with human leadership.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'team_objectives', 'label', 'Team objectives and shared priorities'),
    jsonb_build_object('key', 'progress_tracking', 'label', 'Shared progress tracking'),
    jsonb_build_object('key', 'collaboration', 'label', 'Collaboration checkpoints'),
    jsonb_build_object('key', 'accountability', 'label', 'Accountability without punishment'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'RBAC-protected performance metadata'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); ${D};
create or replace function public._${bp}_executive_alignment_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive alignment dashboard — stewardship before control.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'alignment_visibility', 'label', 'Organizational alignment indicators'),
    jsonb_build_object('key', 'execution_risks', 'label', 'Execution risk indicators'),
    jsonb_build_object('key', 'department_support', 'label', 'Departments requiring support'),
    jsonb_build_object('key', 'goal_completion', 'label', 'Goal completion trends'),
    jsonb_build_object('key', 'leadership_effectiveness', 'label', 'Leadership effectiveness signals')
  )); ${D};
create or replace function public._${bp}_performance_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports goal alignment guidance and never uses punitive surveillance or automated performance judgments.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'goal_alignment_summaries', 'label', 'Goal alignment summaries'),
    jsonb_build_object('key', 'alignment_gap_insights', 'label', 'Alignment gap insights'),
    jsonb_build_object('key', 'development_conversation_recommendations', 'label', 'Development conversation recommendations'),
    jsonb_build_object('key', 'performance_conversation_prompts', 'label', 'Performance conversation prompts'),
    jsonb_build_object('key', 'progress_highlights', 'label', 'Progress highlights'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'RBAC-protected performance metadata — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_individual_goal_workspace() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Individual goal workspace — growth before judgment.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'personal_objectives', 'label', 'Personal objectives and ownership'),
    jsonb_build_object('key', 'milestones', 'label', 'Upcoming milestones and motivation support'),
    jsonb_build_object('key', 'development_focus', 'label', 'Development-focused progress tracking'),
    jsonb_build_object('key', 'manager_alignment', 'label', 'Manager alignment checkpoints'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no punitive surveillance'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for performance actions')
  )); ${D};
create or replace function public._${bp}_performance_conversation_hub() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Performance conversation hub — growth through support.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'regular_check_ins', 'label', 'Regular check-ins between employees and leaders'),
    jsonb_build_object('key', 'development_discussions', 'label', 'Development-focused discussions'),
    jsonb_build_object('key', 'relationship_strengthening', 'label', 'Relationship strengthening through conversation'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Performance alignment audit trails'),
    jsonb_build_object('key', 'no_auto_decisions', 'label', 'Never use performance insights for punitive surveillance'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'Confidential development information controls — RBAC enforced')
  )); ${D};
create or replace function public._${bp}_action_career_executive_integration() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Action Center, career development, and executive cockpit integration — cross-links only.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'action_center', 'label', 'Action Center cross-link', 'cross_link', '/app/action-center'),
    jsonb_build_object('key', 'career_development_engine', 'label', 'Career Development Engine Phase 219 cross-link', 'cross_link', '/app/aipify-employee-growth-career-development-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200 cross-link', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds — RBAC protected'),
    jsonb_build_object('key', 'no_auto_decisions', 'label', 'Never bypass RBAC or use punitive surveillance')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Punitive surveillance or performance punishment',
      'Bypassing RBAC for performance data',
      'Exposing confidential development information beyond RBAC',
      'Replacing human leadership judgment on performance',
      'Automated performance decisions without human approval',
      'Judgment before growth',
      'Override human judgment'), 'principle', '${P.companion} supports — humans steward performance conversations and goal alignment.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — patience and encouragement toward growth without judgment.', 'values', jsonb_build_array('growth_before_judgment','alignment_before_assumptions','stewardship_before_control','patience','service','development'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Performance alignment audit logs via aipify_performance_goal_alignment_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_performance_goal_alignment permissions — performance RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'RBAC-protected goal alignment scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'confidentiality', 'label', 'Confidential development information controls — RBAC enforced'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 221, 'key', 'talent_acquisition_workforce_planning', 'label', 'Talent & Workforce Planning Phase 221', 'route', '/app/aipify-talent-acquisition-workforce-planning-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 222, 'key', 'performance_goal_alignment', 'label', 'Performance & Goal Alignment Phase 222', 'route', '/app/${P.slug}', 'description', 'Human-stewarded goal alignment and performance enablement')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'action_center', 'label', 'Action Center', 'route', '/app/action-center', 'relationship', 'Action integration — cross-link only'),
    jsonb_build_object('key', 'career_development_engine', 'label', 'Career Development Engine Phase 219', 'route', '/app/aipify-employee-growth-career-development-engine', 'relationship', 'Career development integration — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive alignment visibility — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Growth before judgment — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with RBAC-protected goal alignment scaffolds and human stewardship gates. Growth Partner terminology. ${P.companion} supports — never punitive surveillance or automated performance judgments.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans steward performance conversations and goal alignment.', '${P.companion} informs and supports.', 'Growth before judgment — alignment before assumptions.', 'Growth Partner — never Affiliate.', 'Performance Era — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — goal alignment signals max ~500 chars. No punitive surveillance payloads, raw performance records, or confidential development information beyond RBAC.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_talent_acquisition_workforce_planning_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._atawpebp221_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_organizational_objectives_framework\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Organizational objectives framework — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_organizational_objectives_framework()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  for (const fn of [
    "goals_dashboard",
    "organizational_objectives_framework",
    "team_goal_center",
    "executive_alignment_dashboard",
    "performance_companion",
    "individual_goal_workspace",
    "performance_conversation_hub",
    "action_career_executive_integration",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${P.bp}_${fn}()`);
  }

  sql = sql.replace(
    /select 'aipify-talent-acquisition-workforce-planning-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected talent acquisition and workforce planning guidance within Talent Era; cross-link only for career development and executive cockpit engines.",
    "RBAC-protected performance and goal alignment guidance within Performance Era; cross-link only for Action Center, career development, and executive cockpit.",
  );

  return sql;
}

function genMigration() {
  const src221 = path.join(ROOT, "supabase/migrations/20261382000000_aipify_talent_acquisition_workforce_planning_engine_phase221.sql");
  if (!fs.existsSync(src221)) throw new Error("Phase 221 migration required");
  let m = transformFrom221(fs.readFileSync(src221, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-talent-acquisition-workforce-planning-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(path.join(ROOT, `lib/core/${P.slug}.ts`), transformFrom221(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")));
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom221(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")));
  }
  const panel = path.join(ROOT, `components/app/${srcSlug}/AipifyTalentAcquisitionWorkforcePlanningEngineDashboardPanel.tsx`);
  write(path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`), transformFrom221(fs.readFileSync(panel, "utf8")));
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`);
  write(path.join(ROOT, `app/app/${P.slug}/page.tsx`), transformFrom221(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")));
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom221(fs.readFileSync(path.join(ROOT, `app/api/aipify/${srcSlug}/${route}/route.ts`), "utf8")),
    );
  }
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports growth-focused goal alignment — does NOT use punitive surveillance or expose confidential development information beyond RBAC.

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

## What is the Performance & Goal Alignment Engine?

Performance & Goal Alignment provides transparent goal-setting and performance enablement scaffolds at \`/app/${P.slug}\`.

## Does the Performance Companion use punitive surveillance?

**No.** ${P.companion} prepares goal alignment guidance and development conversation recommendations — it does **NOT** use punitive surveillance or automated performance judgments without human leadership.

## What does the Performance Center include?

Goals dashboard, organizational objectives framework, team goal center, individual goal workspace, performance conversation hub, and executive alignment dashboard — RBAC-protected metadata only.

## How does this relate to Action Center, Career Development, and Executive Cockpit?

Cross-link only: Action Center (\`/app/action-center\`), Phase 219 career development engine (\`/app/aipify-employee-growth-career-development-engine\`), and Phase 200 executive cockpit (\`/app/aipify-executive-operating-system-founders-cockpit-engine\`). Never duplicate their RPCs.

## Why are RBAC and confidentiality controls required?

Humans retain performance stewardship authority. Aipify supports growth and alignment — it does not expose confidential development information beyond role-based access or use punitive surveillance.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Performance Center: goals dashboard, organizational objectives framework, team goal center, individual goal workspace, performance conversation hub, executive alignment dashboard, action/career/executive integration (cross-links), performance knowledge libraries.
Organizational Objectives Framework: company-wide strategic objectives, departmental alignment, and execution consistency.
Team Goal Center: team objectives, shared progress tracking, and collaboration.
Individual Goal Workspace: personal objectives, milestones, and development ownership.
Performance Conversation Hub: regular check-ins and development-focused discussions.
Executive Alignment Dashboard: organizational alignment visibility and execution risk indicators.
Design principles: Growth before judgment, alignment before assumptions, stewardship before control.
Companion limitations: no punitive surveillance, no RBAC bypass, no automated performance judgments without human approval.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never punitive surveillance or automated performance judgments.";
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
    c = c.replace('| "aipifyTalentAcquisitionWorkforcePlanningEngine"', `| "aipifyTalentAcquisitionWorkforcePlanningEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    const anchor = /id: "aipifyTalentAcquisitionWorkforcePlanningEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyTalentAcquisitionWorkforcePlanningEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-talent-acquisition-workforce-planning-engine")) {\n    return "aipifyTalentAcquisitionWorkforcePlanningEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-talent-acquisition-workforce-planning-engine")) {\n    return "aipifyTalentAcquisitionWorkforcePlanningEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_talent_acquisition_workforce_planning.steward",', `"aipify_talent_acquisition_workforce_planning.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-talent-acquisition-workforce-planning-engine";',
      `export * from "./aipify-talent-acquisition-workforce-planning-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports goal alignment, progress tracking, and development conversations. Supports growth — does NOT use punitive surveillance. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Goal alignment score",
    modeLabel: "Mode",
    readinessLabel: "Alignment maturity level",
    executiveReviews: "Executive alignment dashboard",
    activeReflections: "Active goal alignment scaffolds",
    humanOversightRequired: `Human oversight required — humans steward performance conversations; ${P.companion} supports only`,
    eraOpenerSummary: `Performance Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate Action Center, career development, or executive cockpit RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Organizational objectives framework — alignment prompts",
    frameworkLabel: "Team goal center",
    reviewsLabel: "Executive alignment dashboard",
    companionLabel: `${P.companion} — supports growth, never punitive surveillance`,
    subEngineLabel: "Individual goal workspace",
    reflections: "Goal alignment scaffolds",
    executiveReviewEntries: "Alignment insight entries",
    scaffoldNotes: "RBAC-protected goal alignment scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT use punitive surveillance, bypass RBAC, or automate performance judgments`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports goal alignment visibility — humans retain performance stewardship authority.`,
      philosophy: "People First. RBAC-protected goal alignment scaffolds. Growth Partner terminology — never Affiliate.",
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
        ? "Ytelse og maljustering"
        : locale === "sv"
          ? "Prestation och maljustering"
          : locale === "da"
            ? "Performance og maljustering"
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
      'export * from "./implementation-blueprint-phase221-vocabulary";',
      `export * from "./implementation-blueprint-phase221-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE221_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase221-aipify-talent-acquisition-workforce-planning.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE221_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase221-aipify-talent-acquisition-workforce-planning.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_talent_acquisition_workforce_planning.view`, `aipify_talent_acquisition_workforce_planning.manage`, `aipify_talent_acquisition_workforce_planning.steward`.";
  const entry = `\n**Aipify Performance & Goal Alignment Engine (Phase 222):** See [${P.docSlug}_PHASE222.md](./${P.docSlug}_PHASE222.md) — Performance Center for goals dashboard, organizational objectives framework, team goal center, individual goal workspace, performance conversation hub, executive alignment dashboard, and Action Center/career development/executive cockpit integration. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** punitive surveillance. Cross-links only: Action Center, Phase 219 career development engine, Phase 200 executive cockpit. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 222")) {
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
