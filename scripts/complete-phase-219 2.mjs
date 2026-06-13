#!/usr/bin/env node
/** ABOS Phase 219 — Aipify Employee Growth & Career Development Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const D = "$$";

const SCAFFOLDS = [
  "career_dashboard",
  "individual_development_plans",
  "career_path_explorer",
  "growth_opportunity_center",
  "manager_development_hub",
  "organizational_talent_dashboard",
  "learning_recognition_integration",
  "career_development_knowledge_libraries",
];

const P = {
  phase: 219,
  migration: "20261379000000_aipify_employee_growth_career_development_engine_phase219.sql",
  slug: "aipify-employee-growth-career-development-engine",
  base: "AipifyEmployeeGrowthCareerDevelopment",
  camel: "aipifyEmployeeGrowthCareerDevelopmentEngine",
  snake: "aipify_employee_growth_career_development",
  permPrefix: "aipify_employee_growth_career_development",
  helper: "aegcde",
  bp: "aegcdebp219",
  decisionType: "aipify_employee_growth_career_development_engine",
  prevDecision: "aipify_employee_recognition_celebration_engine",
  title: "Aipify Employee Growth & Career Development",
  centerTitle: "Career Development Center",
  companion: "Growth Companion",
  scoreKey: "aipify_employee_growth_career_development_score",
  modeKey: "career_development_mode",
  levelKey: "growth_readiness_level",
  thirdEntity: "career_development_notes",
  era: "Innovation & Adaptive Excellence Era (211–220)",
  eraRange: "211–220",
  docSlug: "AIPIFY_EMPLOYEE_GROWTH_CAREER_DEVELOPMENT_ENGINE",
  ilmFile: "implementation-blueprint-phase219-aipify-employee-growth-career-development.txt",
  navLabel: "Growth & Career Development",
  crossLinkNote:
    "Cross-links only: Phase 216 learning center and Phase 218 recognition engine — never auto-decide career progression, bypass confidentiality controls, or expose personal career information.",
  companionLimitations: [
    "auto_deciding_career_progression_without_approval",
    "bypassing_confidentiality_controls_for_personal_career_information",
    "exposing_personal_career_information_to_unauthorized_roles",
    "replacing_human_growth_stewardship_judgment",
    "punitive_career_development_enforcement",
    "assuming_career_intent_without_confirmation",
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
    ["aipify_employee_recognition_celebration.steward", `${P.permPrefix}.steward`],
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
    ["recognition_companion", "growth_companion"],
    ["_seed_recognition_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["supports appreciation visibility and celebration guidance", "supports career growth guidance and advancement visibility"],
    ["human approval", "human stewardship"],
    ["recognition authority", "career progression authority"],
    ["recognition culture", "career growth culture"],
    ["recent recognition activity", "current development progress"],
    ["team highlights", "recommended growth opportunities"],
    ["Peer Recognition Framework", "Individual Development Plans (IDP)"],
    ["Leadership Appreciation Center", "Career Path Explorer"],
    ["Milestone Celebration Engine", "Growth Opportunity Center"],
    ["Values Recognition Program", "Manager Development Hub"],
    ["Recognition Insights Dashboard", "Organizational Talent Dashboard"],
    ["recognition trends", "workforce development trends"],
    ["low-activity visibility", "succession readiness indicators"],
    ["recognition recommendations", "growth opportunity recommendations"],
    ["recognition prompts", "career development prompts"],
    ["recognition summaries", "career development summaries"],
    ["recognition gaps", "critical skill gaps"],
    ["public recognition", "personal career information"],
    ["protected employee recognition preferences", "personal career information"],
    ["Growth before stagnation", "Growth before stagnation"],
    ["appreciation before entitlement", "Opportunity before limitation"],
    ["belonging before bureaucracy", "Stewardship before short-term thinking"],
    ["no_auto_recognition", "no_auto_career_decisions"],
    ["Recognition before assumption", "Growth before stagnation"],
    ["AIPIFY_EMPLOYEE_RECOGNITION_CELEBRATION_ENGINE", P.docSlug],
    ["Communication Era", "Career Development Era"],
    ["PHASE217", `PHASE${P.phase}`],
    ["executive_cockpit_integration", "learning_recognition_integration"],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports career growth guidance — NOT auto-deciding career progression or bypassing confidentiality controls. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Enable organizations to support long-term employee growth through structured development planning, career progression frameworks, and advancement opportunities — ${P.companion} prepares, humans steward progression decisions.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Innovation Era (${P.eraRange}). Human-stewarded career progression; metadata-only scaffolds; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where development plans are active, career paths are transparent, and succession readiness improves through supported long-term growth.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'individual_development_plans', 'label', 'Individual development plans', 'emoji', '🧭', 'description', 'Short-term and long-term growth plans'),
    jsonb_build_object('key', 'career_path_explorer', 'label', 'Career path explorer', 'emoji', '🗺️', 'description', 'Leadership, specialist, and cross-functional pathways'),
    jsonb_build_object('key', 'organizational_talent_dashboard', 'label', 'Organizational talent dashboard', 'emoji', '📈', 'description', 'Workforce development trends and readiness signals'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not auto-decide progression'),
    jsonb_build_object('key', 'growth_opportunity_center', 'label', 'Growth opportunity center', 'emoji', '🎯', 'description', 'Training, projects, and mentorship opportunities'),
    jsonb_build_object('key', 'manager_development_hub', 'label', 'Manager development hub', 'emoji', '🧠', 'description', 'Team development insights and stewardship support'),
    jsonb_build_object('key', 'career_development_knowledge_libraries', 'label', 'Career development knowledge libraries', 'emoji', '📚', 'description', 'Approved development guidance resources')
  ); ${D};
create or replace function public._${bp}_career_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities. Growth before stagnation.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'career_dashboard', 'label', 'Career Dashboard — current development progress and growth opportunities'),
    jsonb_build_object('key', 'individual_development_plans', 'label', 'Individual Development Plans (IDP) — goals and milestone tracking'),
    jsonb_build_object('key', 'career_path_explorer', 'label', 'Career Path Explorer — role tracks and competency visibility'),
    jsonb_build_object('key', 'growth_opportunity_center', 'label', 'Growth Opportunity Center — training, projects, and mentorship'),
    jsonb_build_object('key', 'manager_development_hub', 'label', 'Manager Development Hub — team development insights'),
    jsonb_build_object('key', 'organizational_talent_dashboard', 'label', 'Organizational Talent Dashboard — succession readiness and skill gaps'),
    jsonb_build_object('key', 'learning_recognition_integration', 'label', 'Learning center and recognition engine integration — cross-links only'),
    jsonb_build_object('key', 'career_development_knowledge_libraries', 'label', 'Career development knowledge libraries — approved resources')
  )); ${D};
create or replace function public._${bp}_individual_development_plans() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Individual development plans — opportunity before limitation.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'growth_before_stagnation', 'label', 'Where should growth plans be strengthened this quarter?'),
    jsonb_build_object('key', 'opportunity_before_limitation', 'label', 'Which opportunities can unblock career progression?'),
    jsonb_build_object('key', 'stewardship_before_short_term', 'label', 'How do managers support long-term development over short-term pressure?'),
    jsonb_build_object('key', 'path_visibility', 'label', 'Which career paths need clearer visibility?'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'Where should personal career information controls be reinforced?')
  )); ${D};
create or replace function public._${bp}_career_path_explorer() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Career path explorer — transparent pathways with human stewardship.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'leadership_tracks', 'label', 'Leadership tracks'),
    jsonb_build_object('key', 'specialist_tracks', 'label', 'Specialist tracks'),
    jsonb_build_object('key', 'cross_functional_tracks', 'label', 'Cross-functional pathways'),
    jsonb_build_object('key', 'required_competencies', 'label', 'Required competencies'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'Personal career information confidentiality controls'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); ${D};
create or replace function public._${bp}_organizational_talent_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Organizational talent dashboard — stewardship before short-term thinking.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'active_development_plans', 'label', 'Active development plans'),
    jsonb_build_object('key', 'internal_mobility_trends', 'label', 'Internal mobility trends'),
    jsonb_build_object('key', 'succession_readiness', 'label', 'Succession readiness indicators'),
    jsonb_build_object('key', 'critical_skill_gaps', 'label', 'Critical skill gaps'),
    jsonb_build_object('key', 'manager_stewardship_progress', 'label', 'Manager stewardship progress')
  )); ${D};
create or replace function public._${bp}_growth_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports development guidance, does not auto-decide progression or bypass confidentiality controls.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'career_development_summaries', 'label', 'Career development summaries'),
    jsonb_build_object('key', 'development_insights', 'label', 'Development insights'),
    jsonb_build_object('key', 'growth_recommendations', 'label', 'Growth recommendations'),
    jsonb_build_object('key', 'career_prompts', 'label', 'Career development prompts'),
    jsonb_build_object('key', 'readiness_highlights', 'label', 'Readiness highlights'),
    jsonb_build_object('key', 'confidentiality_reminders', 'label', 'Personal career information confidentiality controls — RBAC enforced')
  )); ${D};
create or replace function public._${bp}_growth_opportunity_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Growth opportunity center — opportunity before limitation.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'training_opportunities', 'label', 'Relevant training opportunities'),
    jsonb_build_object('key', 'internal_projects', 'label', 'Internal project opportunities'),
    jsonb_build_object('key', 'mentorship_programs', 'label', 'Mentorship programs'),
    jsonb_build_object('key', 'manager_alignment', 'label', 'Manager alignment checkpoints'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no personal career records'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for progression decisions')
  )); ${D};
create or replace function public._${bp}_manager_development_hub() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Manager development hub — stewardship before short-term thinking.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'growth_before_stagnation', 'label', 'Growth before stagnation'),
    jsonb_build_object('key', 'opportunity_before_limitation', 'label', 'Opportunity before limitation'),
    jsonb_build_object('key', 'stewardship_before_short_term_thinking', 'label', 'Stewardship before short-term thinking'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Career development audit trails'),
    jsonb_build_object('key', 'no_auto_decisions', 'label', 'Never auto-decide career progression without explicit human approval'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'Personal career information confidentiality controls')
  )); ${D};
create or replace function public._${bp}_learning_recognition_integration() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Learning center and recognition engine — cross-links only.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'learning_center', 'label', 'Learning Center Phase 216 cross-link', 'cross_link', '/app/aipify-enterprise-training-certification-engine'),
    jsonb_build_object('key', 'recognition_engine', 'label', 'Recognition Engine Phase 218 cross-link', 'cross_link', '/app/aipify-employee-recognition-celebration-engine'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds — RBAC protected'),
    jsonb_build_object('key', 'development_stewardship_loops', 'label', 'Development stewardship loops'),
    jsonb_build_object('key', 'no_auto_decisions', 'label', 'Never auto-decide progression without explicit human approval')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Auto-deciding career progression without approval',
      'Bypassing confidentiality controls for personal career information',
      'Exposing personal career information to unauthorized roles',
      'Replacing human growth stewardship judgment',
      'Punitive career development enforcement',
      'Assuming career intent without confirmation',
      'Override human judgment'), 'principle', '${P.companion} supports — humans steward progression decisions and talent stewardship.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — growth, patience, and service toward career development without pressure.', 'values', jsonb_build_array('growth_before_stagnation','opportunity_before_limitation','stewardship_before_short_term_thinking','patience','service','career_growth'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Career development audit logs via aipify_employee_growth_career_development_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_employee_growth_career_development permissions — career development RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only career development scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'confidentiality', 'label', 'Personal career information confidentiality controls — RBAC enforced'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 218, 'key', 'employee_recognition_celebration', 'label', 'Recognition & Celebration Phase 218', 'route', '/app/aipify-employee-recognition-celebration-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 219, 'key', 'employee_growth_career_development', 'label', 'Growth & Career Development Phase 219', 'route', '/app/${P.slug}', 'description', 'Human-stewarded career development culture')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'learning_center', 'label', 'Learning Center Phase 216', 'route', '/app/aipify-enterprise-training-certification-engine', 'relationship', 'Learning integration — cross-link only'),
    jsonb_build_object('key', 'recognition_engine', 'label', 'Recognition Engine Phase 218', 'route', '/app/aipify-employee-recognition-celebration-engine', 'relationship', 'Recognition integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Growth and patience — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with metadata-only development scaffolds and human approval gates. Growth Partner terminology. ${P.companion} supports — never auto-decides progression or bypasses confidentiality controls.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans steward progression decisions and talent stewardship.', '${P.companion} informs and supports.', 'Growth before stagnation — opportunity before limitation.', 'Growth Partner — never Affiliate.', 'Innovation Era — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — career development summaries and progression signals max ~500 chars. No personal career information, PII, or unauthorized progression payloads.'; ${D};
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
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_individual_development_plans\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Individual development plans — five questions', 'met', jsonb_array_length(public._${P.bp}_individual_development_plans()->'reflection_questions') = 5,`,
  );
  sql = sql.replaceAll("executive_cockpit_integration", "learning_recognition_integration");
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  for (const fn of [
    "career_dashboard",
    "individual_development_plans",
    "career_path_explorer",
    "organizational_talent_dashboard",
    "growth_companion",
    "growth_opportunity_center",
    "manager_development_hub",
    "learning_recognition_integration",
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

${P.centerTitle} within ${P.era}. ${P.companion} supports development planning and progression guidance — does NOT auto-decide career progression or bypass confidentiality controls.

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

## What is the Employee Growth & Career Development Engine?

Employee Growth & Career Development provides a structured development framework for long-term growth planning, career progression, and advancement opportunities at \`/app/${P.slug}\`.

## Does the Growth Companion auto-decide career progression?

**No.** ${P.companion} prepares development guidance and opportunity recommendations — it does **NOT** auto-decide progression or bypass confidentiality controls.

## What does the Career Development Center include?

Career dashboard, individual development plans (IDP), career path explorer, growth opportunity center, manager development hub, and organizational talent dashboard — metadata only.

## How does this relate to Learning Center and Recognition Engine?

Cross-link only: Phase 216 learning center (\`/app/aipify-enterprise-training-certification-engine\`) and Phase 218 recognition engine (\`/app/aipify-employee-recognition-celebration-engine\`). Never duplicate their RPCs.

## Why are confidentiality controls required?

Humans retain career progression authority. Aipify advises and prepares — it does not auto-decide progression or expose personal career information beyond approved roles.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Career Development Center: career dashboard, individual development plans, career path explorer, growth opportunity center, manager development hub, organizational talent dashboard, learning/recognition integration (cross-links), career development knowledge libraries.
Individual Development Plans: employee + manager growth planning, milestones, short-term and long-term goals, metadata-only scaffolds.
Career Path Explorer: leadership, specialist, and cross-functional paths with competency transparency.
Growth Opportunity Center: training, internal projects, and mentorship recommendations.
Manager Development Hub: team development insights and stewardship prompts.
Organizational Talent Dashboard: succession readiness indicators and critical skill gap visibility.
Design principles: Growth before stagnation, opportunity before limitation, stewardship before short-term thinking.
Companion limitations: no auto-deciding progression, no bypassing confidentiality controls, no exposing personal career information.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never auto-decides career progression.";
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
    c = c.replace('| "aipifyEmployeeRecognitionCelebrationEngine"', `| "aipifyEmployeeRecognitionCelebrationEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    const anchor = /id: "aipifyEmployeeRecognitionCelebrationEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyEmployeeRecognitionCelebrationEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-employee-recognition-celebration-engine")) {\n    return "aipifyEmployeeRecognitionCelebrationEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-employee-recognition-celebration-engine")) {\n    return "aipifyEmployeeRecognitionCelebrationEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_employee_recognition_celebration.steward",', `"aipify_employee_recognition_celebration.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-employee-recognition-celebration-engine";',
      `export * from "./aipify-employee-recognition-celebration-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports development planning, career path visibility, and growth opportunities. Supports humans — does NOT auto-decide progression or bypass confidentiality controls. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Career development score",
    modeLabel: "Mode",
    readinessLabel: "Growth readiness level",
    executiveReviews: "Organizational talent dashboard",
    activeReflections: "Active development scaffolds",
    humanOversightRequired: `Human oversight required — humans steward progression decisions; ${P.companion} supports only`,
    eraOpenerSummary: `Innovation Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate learning center or recognition engine RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Individual development plans — career prompts",
    frameworkLabel: "Career path explorer",
    reviewsLabel: "Organizational talent dashboard",
    companionLabel: `${P.companion} — supports, does not auto-decide progression`,
    subEngineLabel: "Growth opportunity center",
    reflections: "Development scaffolds",
    executiveReviewEntries: "Talent insight entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT auto-decide progression or bypass confidentiality controls`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports career development visibility — humans retain progression authority.`,
      philosophy: "People First. Metadata-only career development scaffolds. Growth Partner terminology — never Affiliate.",
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
        ? "Vekst og karriereutvikling"
        : locale === "sv"
          ? "Tillvaxt och karriarutveckling"
          : locale === "da"
            ? "Vækst og karriereudvikling"
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
      'export * from "./implementation-blueprint-phase218-vocabulary";\nexport * from "./implementation-blueprint-phase219-vocabulary";',
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE218_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase218-aipify-employee-recognition-celebration.txt";',
      'export const IMPLEMENTATION_BLUEPRINT_PHASE218_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase218-aipify-employee-recognition-celebration.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE219_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase219-aipify-employee-growth-career-development.txt";',
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_employee_recognition_celebration.view`, `aipify_employee_recognition_celebration.manage`, `aipify_employee_recognition_celebration.steward`.";
  const entry = `\n**Aipify Employee Growth & Career Development Engine (Phase 219):** See [${P.docSlug}_PHASE219.md](./${P.docSlug}_PHASE219.md) — Career Development Center for career dashboard, individual development plans, career path explorer, growth opportunity center, manager development hub, organizational talent dashboard, and learning/recognition integration. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** auto-deciding progression or bypassing confidentiality controls. Cross-links only: Phase 216 learning center and Phase 218 recognition engine. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 219")) {
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
