#!/usr/bin/env node
/** ABOS Phase 221 — Aipify Talent Acquisition & Workforce Planning Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "talent_dashboard",
  "workforce_planning_center",
  "recruitment_pipeline_overview",
  "capability_gap_monitor",
  "internal_mobility_opportunity_center",
  "executive_workforce_insights",
  "career_development_integration",
  "talent_knowledge_libraries",
];

const P = {
  phase: 221,
  migration: "20261382000000_aipify_talent_acquisition_workforce_planning_engine_phase221.sql",
  slug: "aipify-talent-acquisition-workforce-planning-engine",
  base: "AipifyTalentAcquisitionWorkforcePlanning",
  camel: "aipifyTalentAcquisitionWorkforcePlanningEngine",
  snake: "aipify_talent_acquisition_workforce_planning",
  permPrefix: "aipify_talent_acquisition_workforce_planning",
  helper: "atawpe",
  bp: "atawpebp221",
  decisionType: "aipify_talent_acquisition_workforce_planning_engine",
  prevDecision: "aipify_wellbeing_sustainable_performance_engine",
  title: "Aipify Talent Acquisition & Workforce Planning",
  centerTitle: "Talent Center",
  companion: "Talent Companion",
  scoreKey: "aipify_talent_acquisition_workforce_planning_score",
  modeKey: "talent_planning_mode",
  levelKey: "workforce_readiness_level",
  thirdEntity: "talent_planning_notes",
  era: "Talent & Workforce Planning Era (221–230)",
  eraRange: "221–230",
  docSlug: "AIPIFY_TALENT_ACQUISITION_WORKFORCE_PLANNING_ENGINE",
  ilmFile: "implementation-blueprint-phase221-aipify-talent-acquisition-workforce-planning.txt",
  navLabel: "Talent & Workforce Planning",
  crossLinkNote:
    "Cross-links only: Phase 219 career development engine and Phase 200 executive cockpit — never store unprotected candidate PII, bypass RBAC, or automate hiring decisions without human approval.",
  companionLimitations: [
    "storing_unprotected_candidate_pii",
    "bypassing_rbac_for_recruitment_data",
    "automated_hiring_decisions_without_human_approval",
    "replacing_human_talent_stewardship_judgment",
    "exposing_confidential_workforce_planning_beyond_rbac",
    "punitive_recruitment_enforcement",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom220(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyWellbeingSustainablePerformance", P.base],
    ["aipify-wellbeing-sustainable-performance-engine", P.slug],
    ["aipify_wellbeing_sustainable_performance", P.snake],
    ["aipifyWellbeingSustainablePerformance", P.camel.replace(/Engine$/, "")],
    ["aipifyWellbeingSustainablePerformanceEngine", P.camel],
    ["awspebp220", P.bp],
    ["_awspe_", `_${P.helper}_`],
    ["aipify_wellbeing_sustainable_performance_score", P.scoreKey],
    ["wellbeing_mode", P.modeKey],
    ["sustainable_performance_level", P.levelKey],
    ["wellbeing_notes", P.thirdEntity],
    ["WellbeingNote", thirdPascal],
    ["wellbeing_notes_count", `${P.thirdEntity}_count`],
    ["Wellbeing Center", P.centerTitle],
    ["Wellbeing Companion", P.companion],
    ["Aipify Wellbeing & Sustainable Performance", P.title],
    ["Wellbeing & Performance", P.navLabel],
    ["Phase 220", `Phase ${P.phase}`],
    ["aipify_wellbeing_sustainable_performance.view", `${P.permPrefix}.view`],
    ["aipify_wellbeing_sustainable_performance.manage", `${P.permPrefix}.manage`],
    ["aipify_wellbeing_sustainable_performance.steward", `${P.permPrefix}.steward`],
    ["20261380000000_aipify_wellbeing_sustainable_performance_engine_phase220.sql", P.migration],
    ["Repo Phase 220", `Repo Phase ${P.phase}`],
    ["Phase 220 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE220_AIPIFY_WELLBEING_SUSTAINABLE_PERFORMANCE_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase220", `implementation-blueprint-phase${P.phase}`],
    ["wellbeing_dashboard", SCAFFOLDS[0]],
    ["sustainable_performance_monitor", SCAFFOLDS[1]],
    ["leadership_care_insights", SCAFFOLDS[2]],
    ["wellbeing_resource_center", SCAFFOLDS[3]],
    ["resilience_development_framework", SCAFFOLDS[4]],
    ["executive_wellbeing_overview", SCAFFOLDS[5]],
    ["capacity_health_integration", SCAFFOLDS[6]],
    ["wellbeing_knowledge_libraries", SCAFFOLDS[7]],
    ["wellbeing_companion", "talent_companion"],
    ["_seed_wellbeing_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["wellbeing stewardship", "talent planning stewardship"],
    ["wellbeing decisions", "talent planning decisions"],
    ["wellbeing-first culture", "planning-first talent culture"],
    ["organizational wellbeing trends", "workforce planning indicators"],
    ["leadership attention opportunities", "critical hiring priorities"],
    ["Sustainable Performance Monitor", "Workforce Planning Center"],
    ["Leadership Care Insights", "Recruitment Pipeline Overview"],
    ["Wellbeing Resource Center", "Capability Gap Monitor"],
    ["Resilience Development Framework", "Internal Mobility Opportunity Center"],
    ["Executive Wellbeing Overview", "Executive Workforce Insights"],
    ["systemic wellbeing risk indicators", "workforce risk indicators"],
    ["resilience opportunity recommendations", "internal mobility recommendations"],
    ["wellbeing stewardship prompts", "talent planning prompts"],
    ["wellbeing summaries", "workforce planning summaries"],
    ["sustainable performance risks", "capability gap signals"],
    ["personal health information", "protected candidate information"],
    ["Care before exhaustion", "Potential before assumptions"],
    ["Sustainability before short-term gains", "Planning before reaction"],
    ["Privacy before convenience", "Stewardship before urgency"],
    ["no_surveillance_or_health_inference", "no_unprotected_candidate_pii"],
    ["AIPIFY_WELLBEING_SUSTAINABLE_PERFORMANCE_ENGINE", P.docSlug],
    ["Wellbeing Era", "Talent Era"],
    ["Innovation & Adaptive Excellence Era (211–220)", P.era],
    ["211–220", P.eraRange],
    ["Innovation Era", "Talent Era"],
    ["/app/aipify-resource-capacity-engine", "/app/aipify-employee-growth-career-development-engine"],
    ["/app/aipify-organizational-health-engine", "/app/aipify-executive-operating-system-founders-cockpit-engine"],
    ["Resource Capacity Engine Phase 209", "Career Development Engine Phase 219"],
    ["Organizational Health Engine Phase 198", "Executive Cockpit Phase 200"],
    ["resource_capacity_engine", "career_development_engine"],
    ["organizational_health_engine", "executive_cockpit"],
    ["capacity/health integration", "career development and executive cockpit integration"],
    ["capacity and organizational health", "career development and executive cockpit"],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports responsible talent planning guidance — NOT storing unprotected candidate PII, bypassing RBAC, or automating hiring decisions without human approval. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Help organizations attract, evaluate, and prepare for future workforce needs through structured talent planning and responsible recruitment practices — ${P.companion} prepares, humans steward talent decisions.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Talent Era (${P.eraRange}). Human-stewarded talent acquisition and workforce planning; RBAC-protected recruitment scaffolds; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where workforce preparedness improves, hiring quality strengthens, and critical talent gaps are reduced through proactive planning and responsible stewardship.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'workforce_planning_center', 'label', 'Workforce planning center', 'emoji', '🧭', 'description', 'Future staffing requirements and succession preparedness'),
    jsonb_build_object('key', 'recruitment_pipeline_overview', 'label', 'Recruitment pipeline overview', 'emoji', '🗺️', 'description', 'Open recruitment initiatives and leadership hiring visibility'),
    jsonb_build_object('key', 'executive_workforce_insights', 'label', 'Executive workforce insights', 'emoji', '📈', 'description', 'Talent trends, workforce risks, and long-term planning signals'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not automate hiring or expose protected candidate data'),
    jsonb_build_object('key', 'capability_gap_monitor', 'label', 'Capability gap monitor', 'emoji', '🎯', 'description', 'Organizational skill shortages and investment discussions'),
    jsonb_build_object('key', 'internal_mobility_opportunity_center', 'label', 'Internal mobility opportunity center', 'emoji', '🧠', 'description', 'Develop existing employees before external recruitment'),
    jsonb_build_object('key', 'talent_knowledge_libraries', 'label', 'Talent knowledge libraries', 'emoji', '📚', 'description', 'Approved talent planning guidance resources')
  ); ${D};
create or replace function public._${bp}_talent_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities. Potential before assumptions.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'talent_dashboard', 'label', 'Talent Dashboard — workforce planning indicators and critical hiring priorities'),
    jsonb_build_object('key', 'workforce_planning_center', 'label', 'Workforce Planning Center — future staffing requirements and succession preparedness'),
    jsonb_build_object('key', 'recruitment_pipeline_overview', 'label', 'Recruitment Pipeline Overview — open recruitment initiatives and leadership visibility'),
    jsonb_build_object('key', 'capability_gap_monitor', 'label', 'Capability Gap Monitor — organizational skill shortages and investment signals'),
    jsonb_build_object('key', 'internal_mobility_opportunity_center', 'label', 'Internal Mobility Opportunity Center — develop existing employees before external hiring'),
    jsonb_build_object('key', 'executive_workforce_insights', 'label', 'Executive Workforce Insights — talent trends and workforce risk indicators'),
    jsonb_build_object('key', 'career_development_integration', 'label', 'Career development and executive cockpit integration — cross-links only'),
    jsonb_build_object('key', 'talent_knowledge_libraries', 'label', 'Talent knowledge libraries — approved resources')
  )); ${D};
create or replace function public._${bp}_workforce_planning_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Workforce planning center — planning before reaction.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'future_capability', 'label', 'Which future capability requirements should leadership prioritize this cycle?'),
    jsonb_build_object('key', 'succession_readiness', 'label', 'Where is succession preparedness strongest and weakest?'),
    jsonb_build_object('key', 'staffing_requirements', 'label', 'What staffing requirements are emerging in the next planning horizon?'),
    jsonb_build_object('key', 'strategic_alignment', 'label', 'How does hiring align with current business objectives?'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'How is workforce planning information kept RBAC-protected and confidential?')
  )); ${D};
create or replace function public._${bp}_recruitment_pipeline_overview() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Recruitment pipeline overview — stewardship before urgency with human approval.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'open_initiatives', 'label', 'Open recruitment initiatives'),
    jsonb_build_object('key', 'hiring_priorities', 'label', 'Leadership hiring priorities'),
    jsonb_build_object('key', 'coordination', 'label', 'Recruitment coordination checkpoints'),
    jsonb_build_object('key', 'decision_timelines', 'label', 'Timely decision-making visibility'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'RBAC-protected recruitment metadata'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); ${D};
create or replace function public._${bp}_executive_workforce_insights() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive workforce insights — stewardship before urgency.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'talent_trends', 'label', 'Talent trend indicators'),
    jsonb_build_object('key', 'workforce_risks', 'label', 'Workforce risk indicators'),
    jsonb_build_object('key', 'succession_readiness', 'label', 'Succession readiness signals'),
    jsonb_build_object('key', 'critical_skill_gaps', 'label', 'Critical capability gaps'),
    jsonb_build_object('key', 'planning_progress', 'label', 'Workforce planning progress')
  )); ${D};
create or replace function public._${bp}_talent_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports talent planning guidance and never stores unprotected candidate PII or automates hiring decisions.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'workforce_planning_summaries', 'label', 'Workforce planning summaries'),
    jsonb_build_object('key', 'capability_gap_insights', 'label', 'Capability gap insights'),
    jsonb_build_object('key', 'recruitment_coordination_recommendations', 'label', 'Recruitment coordination recommendations'),
    jsonb_build_object('key', 'talent_planning_prompts', 'label', 'Talent planning prompts'),
    jsonb_build_object('key', 'readiness_highlights', 'label', 'Readiness highlights'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'RBAC-protected recruitment metadata — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_capability_gap_monitor() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Capability gap monitor — potential before assumptions.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'skill_shortages', 'label', 'Organizational skill shortages'),
    jsonb_build_object('key', 'investment_discussions', 'label', 'Workforce investment discussion prompts'),
    jsonb_build_object('key', 'development_initiatives', 'label', 'Strategic development initiatives'),
    jsonb_build_object('key', 'manager_alignment', 'label', 'Leadership alignment checkpoints'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no protected candidate PII'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for workforce planning actions')
  )); ${D};
create or replace function public._${bp}_internal_mobility_opportunity_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Internal mobility opportunity center — planning before reaction.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'internal_growth', 'label', 'Develop existing employees before external recruitment'),
    jsonb_build_object('key', 'retention_support', 'label', 'Retention through internal mobility'),
    jsonb_build_object('key', 'stewardship_before_urgency', 'label', 'Stewardship before urgency'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Talent planning audit trails'),
    jsonb_build_object('key', 'no_auto_decisions', 'label', 'Never automate hiring decisions without human approval'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'RBAC-protected workforce planning controls')
  )); ${D};
create or replace function public._${bp}_career_development_integration() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Career development and executive cockpit integration — cross-links only.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'career_development_engine', 'label', 'Career Development Engine Phase 219 cross-link', 'cross_link', '/app/aipify-employee-growth-career-development-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200 cross-link', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds — RBAC protected'),
    jsonb_build_object('key', 'talent_stewardship_loops', 'label', 'Talent planning stewardship loops'),
    jsonb_build_object('key', 'no_auto_decisions', 'label', 'Never store unprotected candidate PII or bypass RBAC')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Storing unprotected candidate PII',
      'Bypassing RBAC for recruitment data',
      'Automated hiring decisions without human approval',
      'Replacing human talent stewardship judgment',
      'Exposing confidential workforce planning beyond RBAC',
      'Punitive recruitment enforcement',
      'Override human judgment'), 'principle', '${P.companion} supports — humans steward talent planning and recruitment decisions.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — patience and service toward sustainable talent planning without pressure.', 'values', jsonb_build_array('potential_before_assumptions','planning_before_reaction','stewardship_before_urgency','patience','service','growth'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Talent planning audit logs via aipify_talent_acquisition_workforce_planning_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_talent_acquisition_workforce_planning permissions — recruitment RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'RBAC-protected workforce planning scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'confidentiality', 'label', 'Confidential workforce planning controls — RBAC enforced'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 219, 'key', 'employee_growth_career_development', 'label', 'Career Development Phase 219', 'route', '/app/aipify-employee-growth-career-development-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 220, 'key', 'wellbeing_sustainable_performance', 'label', 'Talent & Workforce Planning Phase 221', 'route', '/app/${P.slug}', 'description', 'Human-stewarded talent acquisition and workforce planning')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'career_development_engine', 'label', 'Career Development Engine Phase 219', 'route', '/app/aipify-employee-growth-career-development-engine', 'relationship', 'Career development integration — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive workforce visibility — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Patience and stewardship — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with RBAC-protected workforce planning scaffolds and human stewardship gates. Growth Partner terminology. ${P.companion} supports — never stores unprotected candidate PII or automates hiring.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans steward talent planning and recruitment decisions.', '${P.companion} informs and supports.', 'Potential before assumptions — planning before reaction.', 'Growth Partner — never Affiliate.', 'Talent Era — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — workforce planning signals max ~500 chars. No protected candidate PII, raw recruitment records, or confidential planning payloads beyond RBAC.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_wellbeing_sustainable_performance_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const start = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  if (start === -1) {
    const oldStart = sql.indexOf("create or replace function public._awspebp220_distinction_note()");
    const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
    const end = sql.indexOf(refreshAnchor);
    if (oldStart !== -1 && end !== -1) {
      sql = sql.slice(0, oldStart) + blueprintSql() + "\n\n" + sql.slice(end);
    }
  } else {
    const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
    const end = sql.indexOf(refreshAnchor);
    if (end !== -1) sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_workforce_planning_center\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Workforce planning center — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_workforce_planning_center()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  for (const fn of [
    "talent_dashboard",
    "workforce_planning_center",
    "recruitment_pipeline_overview",
    "executive_workforce_insights",
    "talent_companion",
    "capability_gap_monitor",
    "internal_mobility_opportunity_center",
    "career_development_integration",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${P.bp}_${fn}()`);
  }

  sql = sql.replace(
    /select 'aipify-wellbeing-sustainable-performance-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "privacy-preserving aggregated wellbeing and sustainable performance guidance within Innovation Era; cross-link only for resource capacity and organizational health engines.",
    "RBAC-protected talent acquisition and workforce planning guidance within Talent Era; cross-link only for career development and executive cockpit engines.",
  );

  return sql;
}

function genMigration() {
  const src220 = path.join(ROOT, "supabase/migrations/20261380000000_aipify_wellbeing_sustainable_performance_engine_phase220.sql");
  if (!fs.existsSync(src220)) throw new Error("Phase 220 migration required");
  let m = transformFrom220(fs.readFileSync(src220, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-wellbeing-sustainable-performance-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(path.join(ROOT, `lib/core/${P.slug}.ts`), transformFrom220(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")));
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom220(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")));
  }
  const panel = path.join(ROOT, `components/app/${srcSlug}/AipifyWellbeingSustainablePerformanceEngineDashboardPanel.tsx`);
  write(path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`), transformFrom220(fs.readFileSync(panel, "utf8")));
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`);
  write(path.join(ROOT, `app/app/${P.slug}/page.tsx`), transformFrom220(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")));
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom220(fs.readFileSync(path.join(ROOT, `app/api/aipify/${srcSlug}/${route}/route.ts`), "utf8")),
    );
  }
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports responsible talent planning — does NOT store unprotected candidate PII or automate hiring decisions.

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

## What is the Talent Acquisition & Workforce Planning Engine?

Talent Acquisition & Workforce Planning provides structured talent planning and responsible recruitment scaffolds at \`/app/${P.slug}\`.

## Does the Talent Companion automate hiring or store candidate PII?

**No.** ${P.companion} prepares workforce planning guidance and recruitment coordination recommendations — it does **NOT** store unprotected candidate PII or automate hiring decisions without human approval.

## What does the Talent Center include?

Talent dashboard, workforce planning center, recruitment pipeline overview, capability gap monitor, internal mobility opportunity center, and executive workforce insights — RBAC-protected metadata only.

## How does this relate to Career Development and Executive Cockpit?

Cross-link only: Phase 219 career development engine (\`/app/aipify-employee-growth-career-development-engine\`) and Phase 200 executive cockpit (\`/app/aipify-executive-operating-system-founders-cockpit-engine\`). Never duplicate their RPCs.

## Why are RBAC and confidentiality controls required?

Humans retain talent stewardship authority. Aipify advises and prepares — it does not expose confidential workforce planning beyond role-based access or protected candidate information.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Talent Center: talent dashboard, workforce planning center, recruitment pipeline overview, capability gap monitor, internal mobility opportunity center, executive workforce insights, career development/executive cockpit integration (cross-links), talent knowledge libraries.
Workforce Planning Center: future staffing requirements, succession preparedness, and strategic readiness questions.
Recruitment Pipeline Overview: open recruitment initiatives and leadership hiring visibility.
Capability Gap Monitor: organizational skill shortages and workforce investment discussion prompts.
Internal Mobility Opportunity Center: develop existing employees before external recruitment.
Executive Workforce Insights: talent trends, workforce risks, and long-term planning visibility.
Design principles: Potential before assumptions, planning before reaction, stewardship before urgency.
Companion limitations: no unprotected candidate PII, no RBAC bypass, no automated hiring without human approval.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never stores unprotected candidate PII or automates hiring.";
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
    c = c.replace('| "aipifyWellbeingSustainablePerformanceEngine"', `| "aipifyWellbeingSustainablePerformanceEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    const anchor = /id: "aipifyWellbeingSustainablePerformanceEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyWellbeingSustainablePerformanceEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-wellbeing-sustainable-performance-engine")) {\n    return "aipifyWellbeingSustainablePerformanceEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-wellbeing-sustainable-performance-engine")) {\n    return "aipifyWellbeingSustainablePerformanceEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_wellbeing_sustainable_performance.steward",', `"aipify_wellbeing_sustainable_performance.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-wellbeing-sustainable-performance-engine";',
      `export * from "./aipify-wellbeing-sustainable-performance-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports workforce planning, recruitment coordination, and capability gap visibility. Supports humans — does NOT store unprotected candidate PII or automate hiring. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Workforce readiness score",
    modeLabel: "Mode",
    readinessLabel: "Workforce readiness level",
    executiveReviews: "Executive workforce insights",
    activeReflections: "Active talent planning scaffolds",
    humanOversightRequired: `Human oversight required — humans steward talent decisions; ${P.companion} supports only`,
    eraOpenerSummary: `Talent Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate career development or executive cockpit RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Workforce planning center — planning prompts",
    frameworkLabel: "Recruitment pipeline overview",
    reviewsLabel: "Executive workforce insights",
    companionLabel: `${P.companion} — supports, never stores unprotected candidate PII or automates hiring`,
    subEngineLabel: "Capability gap monitor",
    reflections: "Talent planning scaffolds",
    executiveReviewEntries: "Workforce insight entries",
    scaffoldNotes: "RBAC-protected talent planning scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT store unprotected candidate PII, bypass RBAC, or automate hiring`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports workforce planning visibility — humans retain talent stewardship authority.`,
      philosophy: "People First. RBAC-protected workforce planning scaffolds. Growth Partner terminology — never Affiliate.",
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
        ? "Talent og workforce-planlegging"
        : locale === "sv"
          ? "Talang och workforce-planering"
          : locale === "da"
            ? "Talent og workforce-planlaegning"
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
      'export * from "./implementation-blueprint-phase220-vocabulary";',
      `export * from "./implementation-blueprint-phase220-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE220_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase220-aipify-wellbeing-sustainable-performance.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE220_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase220-aipify-wellbeing-sustainable-performance.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_wellbeing_sustainable_performance.view`, `aipify_wellbeing_sustainable_performance.manage`, `aipify_wellbeing_sustainable_performance.steward`.";
  const entry = `\n**Aipify Talent Acquisition & Workforce Planning Engine (Phase 221):** See [${P.docSlug}_PHASE221.md](./${P.docSlug}_PHASE221.md) — Talent Center for talent dashboard, workforce planning center, recruitment pipeline overview, capability gap monitor, internal mobility opportunity center, executive workforce insights, and career development/executive cockpit integration. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** storing unprotected candidate PII or automating hiring. Cross-links only: Phase 219 career development engine and Phase 200 executive cockpit. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 221")) {
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
