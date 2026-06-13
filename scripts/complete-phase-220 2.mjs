#!/usr/bin/env node
/** ABOS Phase 220 — Aipify Wellbeing & Sustainable Performance Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const D = "$$";

const SCAFFOLDS = [
  "wellbeing_dashboard",
  "sustainable_performance_monitor",
  "leadership_care_insights",
  "wellbeing_resource_center",
  "resilience_development_framework",
  "executive_wellbeing_overview",
  "capacity_health_integration",
  "wellbeing_knowledge_libraries",
];

const P = {
  phase: 220,
  migration: "20261380000000_aipify_wellbeing_sustainable_performance_engine_phase220.sql",
  slug: "aipify-wellbeing-sustainable-performance-engine",
  base: "AipifyWellbeingSustainablePerformance",
  camel: "aipifyWellbeingSustainablePerformanceEngine",
  snake: "aipify_wellbeing_sustainable_performance",
  permPrefix: "aipify_wellbeing_sustainable_performance",
  helper: "awspe",
  bp: "awspebp220",
  decisionType: "aipify_wellbeing_sustainable_performance_engine",
  prevDecision: "aipify_employee_growth_career_development_engine",
  title: "Aipify Wellbeing & Sustainable Performance",
  centerTitle: "Wellbeing Center",
  companion: "Wellbeing Companion",
  scoreKey: "aipify_wellbeing_sustainable_performance_score",
  modeKey: "wellbeing_mode",
  levelKey: "sustainable_performance_level",
  thirdEntity: "wellbeing_notes",
  era: "Innovation & Adaptive Excellence Era (211–220)",
  eraRange: "211–220",
  docSlug: "AIPIFY_WELLBEING_SUSTAINABLE_PERFORMANCE_ENGINE",
  ilmFile: "implementation-blueprint-phase220-aipify-wellbeing-sustainable-performance.txt",
  navLabel: "Wellbeing & Performance",
  crossLinkNote:
    "Cross-links only: Phase 209 resource capacity engine and Phase 198 organizational health engine — never collect or infer personal health information, enable surveillance, or bypass privacy-preserving aggregation controls.",
  companionLimitations: [
    "collecting_or_inferring_personal_health_information",
    "enabling_employee_surveillance_or_individual_tracking",
    "bypassing_privacy_preserving_aggregation_controls",
    "replacing_human_wellbeing_stewardship_judgment",
    "punitive_wellbeing_enforcement",
    "assuming_burnout_or_health_state_without_human_context",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom218(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyEmployeeRecognitionCelebration", P.base],
    ["aipify-employee-recognition-celebration-engine", P.slug],
    ["aipify_employee_recognition_celebration", P.snake],
    ["aipifyEmployeeRecognitionCelebration", P.camel.replace(/Engine$/, "")],
    ["aipifyEmployeeRecognitionCelebrationEngine", P.camel],
    ["aercebp218", P.bp],
    ["_aerce_", `_${P.helper}_`],
    ["aipify_employee_recognition_celebration_score", P.scoreKey],
    ["recognition_mode", P.modeKey],
    ["recognition_maturity_level", P.levelKey],
    ["recognition_notes", P.thirdEntity],
    ["RecognitionNote", thirdPascal],
    ["recognition_notes_count", `${P.thirdEntity}_count`],
    ["Recognition Center", P.centerTitle],
    ["Recognition Companion", P.companion],
    ["Aipify Employee Recognition & Celebration", P.title],
    ["Recognition & Celebration", P.navLabel],
    ["Phase 218", `Phase ${P.phase}`],
    ["aipify_employee_recognition_celebration.view", `${P.permPrefix}.view`],
    ["aipify_employee_recognition_celebration.manage", `${P.permPrefix}.manage`],
    ["aipify_employee_growth_career_development.steward", `${P.permPrefix}.steward`],
    ["20261378000000_aipify_employee_recognition_celebration_engine_phase218.sql", P.migration],
    ["Repo Phase 218", `Repo Phase ${P.phase}`],
    ["Phase 218 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE218_AIPIFY_EMPLOYEE_RECOGNITION_CELEBRATION_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase218", `implementation-blueprint-phase${P.phase}`],
    ["recognition_dashboard", SCAFFOLDS[0]],
    ["peer_recognition_framework", SCAFFOLDS[1]],
    ["leadership_appreciation_center", SCAFFOLDS[2]],
    ["milestone_celebration_engine", SCAFFOLDS[3]],
    ["values_recognition_program", SCAFFOLDS[4]],
    ["recognition_insights_dashboard", SCAFFOLDS[5]],
    ["unified_workspace_recognition_integration", SCAFFOLDS[6]],
    ["recognition_knowledge_libraries", SCAFFOLDS[7]],
    ["recognition_companion", "wellbeing_companion"],
    ["_seed_recognition_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["supports appreciation visibility and celebration guidance", "supports wellbeing stewardship and sustainable performance guidance"],
    ["human approval", "human stewardship"],
    ["recognition authority", "wellbeing stewardship authority"],
    ["recognition culture", "wellbeing-first culture"],
    ["recent recognition activity", "organizational wellbeing trends"],
    ["team highlights", "leadership attention opportunities"],
    ["Peer Recognition Framework", "Sustainable Performance Monitor"],
    ["Leadership Appreciation Center", "Leadership Care Insights"],
    ["Milestone Celebration Engine", "Wellbeing Resource Center"],
    ["Values Recognition Program", "Resilience Development Framework"],
    ["Recognition Insights Dashboard", "Executive Wellbeing Overview"],
    ["recognition trends", "organizational wellbeing trends"],
    ["low-activity visibility", "systemic wellbeing risk indicators"],
    ["recognition recommendations", "resilience opportunity recommendations"],
    ["recognition prompts", "wellbeing stewardship prompts"],
    ["recognition summaries", "wellbeing summaries"],
    ["recognition gaps", "sustainable performance risks"],
    ["public recognition", "personal health information"],
    ["protected employee recognition preferences", "personal health information"],
    ["Care before exhaustion", "Care before exhaustion"],
    ["appreciation before entitlement", "Sustainability before short-term gains"],
    ["belonging before bureaucracy", "Privacy before convenience"],
    ["no_auto_recognition", "no_surveillance_or_health_inference"],
    ["Recognition before assumption", "Care before exhaustion"],
    ["AIPIFY_EMPLOYEE_RECOGNITION_CELEBRATION_ENGINE", P.docSlug],
    ["Communication Era", "Wellbeing Era"],
    ["PHASE217", `PHASE${P.phase}`],
    ["executive_cockpit_integration", "capacity_health_integration"],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports wellbeing stewardship guidance — NOT inferring personal health information, enabling surveillance, or bypassing privacy-preserving aggregation controls. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Help organizations create environments where people can perform at a high level without sacrificing long-term wellbeing, resilience, or sustainable productivity — ${P.companion} prepares, humans steward wellbeing decisions.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Innovation Era (${P.eraRange}). Human-stewarded wellbeing and sustainable performance; aggregated privacy-preserving scaffolds; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where wellbeing trends are visible, preventable burnout risks are reduced, and sustainable performance improves through proactive leadership stewardship.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'sustainable_performance_monitor', 'label', 'Sustainable performance monitor', 'emoji', '🧭', 'description', 'Aggregated workload rhythm indicators and resilience prompts'),
    jsonb_build_object('key', 'leadership_care_insights', 'label', 'Leadership care insights', 'emoji', '🗺️', 'description', 'Team-level awareness and supportive leadership conversation prompts'),
    jsonb_build_object('key', 'executive_wellbeing_overview', 'label', 'Executive wellbeing overview', 'emoji', '📈', 'description', 'Systemic wellbeing indicators and strategic resilience signals'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not infer health states or surveil individuals'),
    jsonb_build_object('key', 'wellbeing_resource_center', 'label', 'Wellbeing resource center', 'emoji', '🎯', 'description', 'Support resources and healthy work practices'),
    jsonb_build_object('key', 'resilience_development_framework', 'label', 'Resilience development framework', 'emoji', '🧠', 'description', 'Reflection and resilience-building initiatives'),
    jsonb_build_object('key', 'wellbeing_knowledge_libraries', 'label', 'Wellbeing knowledge libraries', 'emoji', '📚', 'description', 'Approved wellbeing guidance resources')
  ); ${D};
create or replace function public._${bp}_wellbeing_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities. Care before exhaustion.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'wellbeing_dashboard', 'label', 'Wellbeing Dashboard — organizational wellbeing trends and leadership attention areas'),
    jsonb_build_object('key', 'sustainable_performance_monitor', 'label', 'Sustainable Performance Monitor — excessive workload patterns and healthy rhythm guidance'),
    jsonb_build_object('key', 'leadership_care_insights', 'label', 'Leadership Care Insights — team-level awareness for supportive conversations'),
    jsonb_build_object('key', 'wellbeing_resource_center', 'label', 'Wellbeing Resource Center — organizational support resources and healthy habits'),
    jsonb_build_object('key', 'resilience_development_framework', 'label', 'Resilience Development Framework — reflection and resilience initiatives'),
    jsonb_build_object('key', 'executive_wellbeing_overview', 'label', 'Executive Wellbeing Overview — systemic wellbeing risks and stewardship signals'),
    jsonb_build_object('key', 'capacity_health_integration', 'label', 'Resource capacity and organizational health integration — cross-links only'),
    jsonb_build_object('key', 'wellbeing_knowledge_libraries', 'label', 'Wellbeing knowledge libraries — approved resources')
  )); ${D};
create or replace function public._${bp}_sustainable_performance_monitor() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Sustainable performance monitor — sustainability before short-term gains.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'growth_before_stagnation', 'label', 'Where are sustainable workload patterns drifting toward exhaustion risk?'),
    jsonb_build_object('key', 'opportunity_before_limitation', 'label', 'Which healthy work rhythms should leadership reinforce this cycle?'),
    jsonb_build_object('key', 'stewardship_before_short_term', 'label', 'What proactive leadership care conversations should happen this cycle?'),
    jsonb_build_object('key', 'path_visibility', 'label', 'Where should resilience support resources be expanded?'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'How are wellbeing insights kept aggregated and privacy-preserving?')
  )); ${D};
create or replace function public._${bp}_leadership_care_insights() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Leadership care insights — care before exhaustion with human stewardship.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'leadership_tracks', 'label', 'Team-level awareness'),
    jsonb_build_object('key', 'specialist_tracks', 'label', 'Supportive conversations'),
    jsonb_build_object('key', 'cross_functional_tracks', 'label', 'People leadership stewardship'),
    jsonb_build_object('key', 'required_competencies', 'label', 'Team resilience strengthening'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'Privacy-preserving aggregation controls'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); ${D};
create or replace function public._${bp}_executive_wellbeing_overview() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive wellbeing overview — stewardship before short-term thinking.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'active_development_plans', 'label', 'Organizational wellbeing indicators'),
    jsonb_build_object('key', 'internal_mobility_trends', 'label', 'Preventable burnout risk patterns'),
    jsonb_build_object('key', 'succession_readiness', 'label', 'Systemic wellbeing risk indicators'),
    jsonb_build_object('key', 'critical_skill_gaps', 'label', 'Workforce resilience indicators'),
    jsonb_build_object('key', 'manager_stewardship_progress', 'label', 'Leadership stewardship progress')
  )); ${D};
create or replace function public._${bp}_wellbeing_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports wellbeing stewardship guidance and never infers personal health states or enables surveillance.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'wellbeing_summaries', 'label', 'Wellbeing summaries'),
    jsonb_build_object('key', 'resilience_insights', 'label', 'Resilience insights'),
    jsonb_build_object('key', 'sustainable_performance_recommendations', 'label', 'Sustainable performance recommendations'),
    jsonb_build_object('key', 'leadership_care_prompts', 'label', 'Leadership care prompts'),
    jsonb_build_object('key', 'readiness_highlights', 'label', 'Readiness highlights'),
    jsonb_build_object('key', 'privacy_guardrails', 'label', 'Privacy-preserving aggregation controls — RBAC enforced')
  )); ${D};
create or replace function public._${bp}_wellbeing_resource_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Wellbeing resource center — care before exhaustion.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'training_opportunities', 'label', 'Organizational support resources'),
    jsonb_build_object('key', 'internal_projects', 'label', 'Healthy work habits guidance'),
    jsonb_build_object('key', 'mentorship_programs', 'label', 'Continuous wellbeing initiatives'),
    jsonb_build_object('key', 'manager_alignment', 'label', 'Leadership alignment checkpoints'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no personal health information'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for wellbeing initiatives')
  )); ${D};
create or replace function public._${bp}_resilience_development_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Resilience development framework — sustainability before short-term gains.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'growth_before_stagnation', 'label', 'Care before exhaustion'),
    jsonb_build_object('key', 'opportunity_before_limitation', 'label', 'Sustainability before short-term gains'),
    jsonb_build_object('key', 'stewardship_before_short_term_thinking', 'label', 'Privacy before convenience'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Wellbeing audit trails'),
    jsonb_build_object('key', 'no_auto_decisions', 'label', 'Never use wellbeing insights for surveillance or individual tracking'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'Privacy-preserving aggregation controls')
  )); ${D};
create or replace function public._${bp}_capacity_health_integration() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Resource capacity and organizational health integration — cross-links only.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'resource_capacity_engine', 'label', 'Resource Capacity Engine Phase 209 cross-link', 'cross_link', '/app/aipify-resource-capacity-engine'),
    jsonb_build_object('key', 'organizational_health_engine', 'label', 'Organizational Health Engine Phase 198 cross-link', 'cross_link', '/app/aipify-organizational-health-engine'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds — RBAC protected'),
    jsonb_build_object('key', 'wellbeing_stewardship_loops', 'label', 'Wellbeing stewardship loops'),
    jsonb_build_object('key', 'no_auto_decisions', 'label', 'Never use wellbeing insights for surveillance or personal health inference')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Collecting or inferring personal health information',
      'Enabling employee surveillance or individual tracking',
      'Bypassing privacy-preserving aggregation controls',
      'Replacing human wellbeing stewardship judgment',
      'Punitive wellbeing enforcement',
      'Assuming burnout or health states without human context',
      'Override human judgment'), 'principle', '${P.companion} supports — humans steward wellbeing decisions and sustainable performance.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — care, patience, and service toward sustainable performance without pressure.', 'values', jsonb_build_array('care_before_exhaustion','sustainability_before_short_term_gains','privacy_before_convenience','patience','service','wellbeing'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Wellbeing audit logs via aipify_wellbeing_sustainable_performance_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_wellbeing_sustainable_performance permissions — wellbeing RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Aggregated privacy-preserving wellbeing scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'confidentiality', 'label', 'Privacy-preserving aggregation controls — RBAC enforced'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 218, 'key', 'employee_recognition_celebration', 'label', 'Growth & Career Development Phase 219', 'route', '/app/aipify-organizational-health-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 219, 'key', 'employee_growth_career_development', 'label', 'Wellbeing & Performance Phase 220', 'route', '/app/${P.slug}', 'description', 'Human-stewarded wellbeing and sustainable performance culture')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'resource_capacity_engine', 'label', 'Resource Capacity Engine Phase 209', 'route', '/app/aipify-resource-capacity-engine', 'relationship', 'Capacity integration — cross-link only'),
    jsonb_build_object('key', 'organizational_health_engine', 'label', 'Organizational Health Engine Phase 198', 'route', '/app/aipify-organizational-health-engine', 'relationship', 'Health integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Care and resilience — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with aggregated privacy-preserving wellbeing scaffolds and human stewardship gates. Growth Partner terminology. ${P.companion} supports — never infers health states or enables surveillance.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans steward wellbeing decisions and sustainable performance.', '${P.companion} informs and supports.', 'Care before exhaustion — sustainability before short-term gains.', 'Growth Partner — never Affiliate.', 'Innovation Era — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — wellbeing and sustainable performance signals max ~500 chars. No personal health information, PII, or surveillance payloads.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  const chain = [
    "aipify_organizational_rhythms_operating_cadence_engine",
    "aipify_continuous_improvement_optimization_engine",
    "aipify_innovation_opportunity_discovery_engine",
    "aipify_customer_success_value_realization_engine",
    "aipify_customer_journey_experience_orchestration_engine",
    "aipify_onboarding_adoption_acceleration_engine",
    "aipify_enterprise_training_certification_engine",
    "aipify_organizational_communication_announcements_engine",
    "aipify_employee_recognition_celebration_engine",
    "aipify_employee_growth_career_development_engine",
    P.decisionType,
  ];
  const additions = chain.filter((entry) => !sql.includes(`'${entry}'`));
  if (additions.length === 0) return sql;
  const anchor = sql.includes("'aipify_employee_recognition_celebration_engine'")
    ? "'aipify_employee_recognition_celebration_engine'"
    : "'aipify_organizational_communication_announcements_engine'";
  const anchorValue = anchor.replace(/'/g, "");
  const toAdd = additions.filter((e) => e !== anchorValue);
  if (toAdd.length === 0) return sql;
  return sql.replace(anchor, `${anchor},\n    ${toAdd.map((e) => `'${e}'`).join(",\n    ")}`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const start = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  if (start !== -1 && end !== -1) sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_sustainable_performance_monitor\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Sustainable performance monitor — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_sustainable_performance_monitor()->'reflection_questions') = 5,`,
  );
  sql = sql.replaceAll("executive_cockpit_integration", "capacity_health_integration");
  sql = sql.replaceAll('/app/aipify-employee-growth-career-development-engine', '/app/aipify-organizational-health-engine');
  sql = sql.replaceAll('employee recognition and celebration within Innovation Era; cross-link only for digital headquarters and unified workspace unified workspace recognition feed.', 'privacy-preserving aggregated wellbeing and sustainable performance guidance within Innovation Era; cross-link only for resource capacity and organizational health engines.');
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  for (const fn of [
    "wellbeing_dashboard",
    "sustainable_performance_monitor",
    "leadership_care_insights",
    "executive_wellbeing_overview",
    "wellbeing_companion",
    "wellbeing_resource_center",
    "resilience_development_framework",
    "capacity_health_integration",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${P.bp}_${fn}()`);
  }

  sql = sql.replace(
    /select 'aipify-organizational-rhythms-operating-cadence-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  return sql;
}

function genMigration() {
  const src218 = path.join(ROOT, "supabase/migrations/20261378000000_aipify_employee_recognition_celebration_engine_phase218.sql");
  if (!fs.existsSync(src218)) throw new Error("Phase 218 migration required");
  let m = transformFrom218(fs.readFileSync(src218, "utf8"));
  m = m.replace(/_aerce_seed_recognition_notes/g, `_${P.helper}_seed_${P.thirdEntity.replace("_notes", "")}_notes`);
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-employee-recognition-celebration-engine";
  const src = path.join(ROOT, `lib/aipify/${srcSlug}`);
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(path.join(ROOT, `lib/core/${P.slug}.ts`), transformFrom218(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")));
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom218(fs.readFileSync(path.join(src, f), "utf8")));
  }
  const panel = path.join(ROOT, `components/app/${srcSlug}/AipifyEmployeeRecognitionCelebrationEngineDashboardPanel.tsx`);
  write(path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`), transformFrom218(fs.readFileSync(panel, "utf8")));
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`);
  write(path.join(ROOT, `app/app/${P.slug}/page.tsx`), transformFrom218(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")));
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom218(fs.readFileSync(path.join(ROOT, `app/api/aipify/${srcSlug}/${route}/route.ts`), "utf8")),
    );
  }
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports wellbeing stewardship guidance — does NOT infer personal health information or enable surveillance.

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

## What is the Employee Wellbeing & Performance Engine?

Employee Wellbeing & Sustainable Performance provides aggregated wellbeing insights and sustainable performance scaffolds at \`/app/${P.slug}\`.

## Does the Wellbeing Companion infer health states or track individuals?

**No.** ${P.companion} prepares wellbeing guidance and resilience recommendations — it does **NOT** infer personal health states or enable surveillance.

## What does the Wellbeing Center include?

Wellbeing dashboard, sustainable performance monitor, leadership care insights, wellbeing resource center, resilience development framework, and executive wellbeing overview — aggregated metadata only.

## How does this relate to Resource Capacity and Organizational Health Engines?

Cross-link only: Phase 209 resource capacity engine (\`/app/aipify-resource-capacity-engine\`) and Phase 198 organizational health engine (\`/app/aipify-organizational-health-engine\`). Never duplicate their RPCs.

## Why are privacy-preserving controls required?

Humans retain wellbeing stewardship authority. Aipify advises and prepares — it does not infer personal health information or expose non-aggregated indicators.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Wellbeing Center: wellbeing dashboard, sustainable performance monitor, leadership care insights, wellbeing resource center, resilience development framework, executive wellbeing overview, capacity/health integration (cross-links), wellbeing knowledge libraries.
Sustainable Performance Monitor: aggregated workload rhythm indicators, resilience prompts, and stewardship questions.
Leadership Care Insights: team-level awareness and supportive leadership conversation prompts.
Wellbeing Resource Center: organizational support resources, healthy habits guidance, and wellbeing initiatives.
Resilience Development Framework: reflection, resilience-building initiatives, and preparedness support.
Executive Wellbeing Overview: systemic risk indicators and long-term workforce stewardship visibility.
Design principles: Care before exhaustion, sustainability before short-term gains, privacy before convenience.
Companion limitations: no health inference, no surveillance, no bypassing privacy-preserving aggregation controls.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never infers personal health states or enables surveillance.";
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
    c = c.replace('| "aipifyEmployeeGrowthCareerDevelopmentEngine"', `| "aipifyEmployeeGrowthCareerDevelopmentEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    const anchor = /id: "aipifyEmployeeGrowthCareerDevelopmentEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyEmployeeGrowthCareerDevelopmentEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-employee-growth-career-development-engine")) {\n    return "aipifyEmployeeGrowthCareerDevelopmentEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-employee-growth-career-development-engine")) {\n    return "aipifyEmployeeGrowthCareerDevelopmentEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_employee_growth_career_development.steward",', `"aipify_employee_growth_career_development.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-employee-growth-career-development-engine";',
      `export * from "./aipify-employee-growth-career-development-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports wellbeing stewardship, sustainable performance rhythms, and resilience opportunities. Supports humans — does NOT infer health states or enable surveillance. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Wellbeing resilience score",
    modeLabel: "Mode",
    readinessLabel: "Sustainable performance level",
    executiveReviews: "Executive wellbeing overview",
    activeReflections: "Active wellbeing scaffolds",
    humanOversightRequired: `Human oversight required — humans steward wellbeing decisions; ${P.companion} supports only`,
    eraOpenerSummary: `Innovation Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate resource capacity or organizational health RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Sustainable performance monitor — stewardship prompts",
    frameworkLabel: "Leadership care insights",
    reviewsLabel: "Executive wellbeing overview",
    companionLabel: `${P.companion} — supports, never infers health states or enables surveillance`,
    subEngineLabel: "Wellbeing resource center",
    reflections: "Wellbeing scaffolds",
    executiveReviewEntries: "Wellbeing insight entries",
    scaffoldNotes: "Aggregated wellbeing scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT infer health states, enable surveillance, or bypass privacy controls`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports wellbeing visibility — humans retain wellbeing stewardship authority.`,
      philosophy: "People First. Aggregated privacy-preserving wellbeing scaffolds. Growth Partner terminology — never Affiliate.",
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
        ? "Velvaere og baerekraftig ytelse"
        : locale === "sv"
          ? "Valbefinnande och hallbar prestation"
          : locale === "da"
            ? "Trivsel og baeredygtig performance"
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
      'export * from "./implementation-blueprint-phase218-vocabulary";',
      'export * from "./implementation-blueprint-phase218-vocabulary";\nexport * from "./implementation-blueprint-phase219-vocabulary";\nexport * from "./implementation-blueprint-phase220-vocabulary";',
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE219_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase219-aipify-employee-growth-career-development.txt";',
      'export const IMPLEMENTATION_BLUEPRINT_PHASE219_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase219-aipify-employee-growth-career-development.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE220_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase220-aipify-wellbeing-sustainable-performance.txt";',
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_employee_growth_career_development.view`, `aipify_employee_growth_career_development.manage`, `aipify_employee_growth_career_development.steward`.";
  const entry = `\n**Aipify Wellbeing & Sustainable Performance Engine (Phase 220):** See [${P.docSlug}_PHASE220.md](./${P.docSlug}_PHASE220.md) — Wellbeing Center for wellbeing dashboard, sustainable performance monitor, leadership care insights, wellbeing resource center, resilience development framework, executive wellbeing overview, and capacity/health integration. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** inferring personal health information or enabling surveillance. Cross-links only: Phase 209 resource capacity engine and Phase 198 organizational health engine. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 220")) {
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
