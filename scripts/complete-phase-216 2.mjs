#!/usr/bin/env node
/** ABOS Phase 216 — Aipify Enterprise Training & Certification Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const P = {
  phase: 216,
  migration: "20261376000000_aipify_enterprise_training_certification_engine_phase216.sql",
  slug: "aipify-enterprise-training-certification-engine",
  base: "AipifyEnterpriseTrainingCertification",
  camel: "aipifyEnterpriseTrainingCertificationEngine",
  snake: "aipify_enterprise_training_certification",
  permPrefix: "aipify_enterprise_training_certification",
  helper: "aetce",
  bp: "aetcebp216",
  decisionType: "aipify_enterprise_training_certification_engine",
  prevDecision: "aipify_onboarding_adoption_acceleration_engine",
  title: "Aipify Enterprise Training & Certification",
  centerTitle: "Learning Center",
  companion: "Learning Companion",
  scoreKey: "aipify_enterprise_training_certification_score",
  modeKey: "training_certification_mode",
  levelKey: "competency_maturity_level",
  thirdEntity: "learning_notes",
  docSlug: "AIPIFY_ENTERPRISE_TRAINING_CERTIFICATION_ENGINE",
  ilmFile: "implementation-blueprint-phase216-aipify-enterprise-training-certification.txt",
  navLabel: "Training & Certification",
  era: "Innovation & Adaptive Excellence Era (211–220)",
  eraRange: "211–220",
  crossLinkNote: "Cross-links only: Phase 202 unified workspace, Phase 215 onboarding center — never auto-certify, bypass human approval, or expose protected certification data.",
  ilmExtra: "\nLearning Center: learning dashboard, certification center, role-based training programs, competency tracking engine, leadership development hub, executive readiness dashboard, unified workspace/onboarding integration (cross-links), learning knowledge libraries.\nCertification Center prompts: internal certifications, competency validation, human approval gates, protected certification data, metadata-only scaffolds.\nRole-Based Training Programs: role-specific learning paths, structured programs, competency development, enterprise scale.\nCompetency Tracking Engine: competency signals, development progress, growth-before-stagnation metrics, leadership readiness summaries.\nLeadership Development Hub: leadership learning tracks — advisory only, never auto-certify.\nDesign principles: learning before assumptions, growth before stagnation, clarity before complexity.\nCompanion limitations: no auto-certifying without approval, no bypassing human approval, no exposing protected certification data, no punitive training enforcement, no assuming competency without evidence.",
  faqBody: "## What is Enterprise Training & Certification Engine?\n\nEnterprise Training & Certification helps organizations continuously develop employee capabilities through structured learning programs, internal certifications, and role-specific competency development — at \\`/app/aipify-enterprise-training-certification-engine\\`.\n\n## Does the Learning Companion certify employees automatically?\n\n**No.** The Learning Companion suggests learning paths and competency scaffolds — it does NOT auto-certify without approval or expose protected certification data.\n\n## What does the Learning Center show?\n\nLearning progress, certification center scaffolds, role-based training programs, competency tracking, leadership development hubs, and executive readiness dashboards — metadata only.\n\n## How does this relate to Unified Workspace and Onboarding Center?\n\nCross-link only: Phase 202 unified workspace (\\`/app/aipify-unified-workspace-engine\\`), Phase 215 onboarding center (\\`/app/aipify-onboarding-adoption-acceleration-engine\\`). Never duplicate their RPCs.\n\n## Why human approval for certification?\n\nHumans retain certification authority. Aipify advises and prepares — it does not auto-certify or bypass approval for protected certification data.",
  companionLimitations: [
    "auto_certifying_without_approval",
    "bypassing_human_approval_for_certification",
    "exposing_protected_certification_data",
    "replacing_human_learning_judgment",
    "punitive_training_enforcement",
    "assuming_competency_without_evidence",
    "replace_human_judgment"
  ]
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom210(content) {
  const thirdPascal = P.thirdEntity.split("_").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
  const pairs = [
    ["AipifyOrganizationalRhythmsOperatingCadence", P.base],
    ["aipify-organizational-rhythms-operating-cadence-engine", P.slug],
    ["aipify_organizational_rhythms_operating_cadence", P.snake],
    ["aipifyOrganizationalRhythmsOperatingCadence", P.camel.replace(/Engine$/, "")],
    ["aipifyOrganizationalRhythmsOperatingCadenceEngine", P.camel],
    ["aorocebp210", P.bp],
    ["_aoroce_", `_${P.helper}_`],
    ["aipify_organizational_rhythms_operating_cadence_score", P.scoreKey],
    ["operating_cadence_mode", P.modeKey],
    ["cadence_discipline_level", P.levelKey],
    ["cadence_notes", P.thirdEntity],
    ["CadenceNote", thirdPascal],
    ["cadence_notes_count", `${P.thirdEntity}_count`],
    ["Operating Cadence Center", P.centerTitle],
    ["Cadence Companion", P.companion],
    ["Aipify Organizational Rhythms & Operating Cadence", P.title],
    ["Operating Cadence", P.navLabel],
    ["Phase 210", `Phase ${P.phase}`],
    ["aipify_organizational_rhythms_operating_cadence.view", `${P.permPrefix}.view`],
    ["aipify_organizational_rhythms_operating_cadence.manage", `${P.permPrefix}.manage`],
    ["aipify_organizational_rhythms_operating_cadence.steward", `${P.permPrefix}.steward`],
    ["20261370000000_aipify_organizational_rhythms_operating_cadence_engine_phase210.sql", P.migration],
    ["Repo Phase 210", `Repo Phase ${P.phase}`],
    ["Phase 210 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE210_AIPIFY_ORGANIZATIONAL_RHYTHMS_OPERATING_CADENCE_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase210", `implementation-blueprint-phase${P.phase}`],
    ["organizational_rhythm_dashboard", "learning_dashboard"],
    ["cadence_reflection_engine", "certification_center"],
    ["cadence_framework", "role_based_training_programs"],
    ["executive_cadence_reviews", "competency_tracking_engine"],
    ["cadence_companion", "learning_companion"],
    ["leadership_cadence_center", "leadership_development_hub"],
    ["team_rhythm_framework", "role_based_training_programs"],
    ["strategic_review_scheduler", "executive_readiness_dashboard"],
    ["follow_up_integrity_monitor", "unified_workspace_onboarding_integration"],
    ["organizational_pulse_calendar", "unified_workspace_onboarding_integration"],
    ["action_decision_executive_cockpit_integration", "unified_workspace_onboarding_integration"],
    ["cadence_knowledge_libraries", "learning_knowledge_libraries"],
    ["leadership_cadence_center_meta", "leadership_development_hub_meta"],
    ["team_rhythm_framework_meta", "competency_tracking_engine_meta"],
    ["organizational_pulse_calendar_meta", "unified_workspace_onboarding_integration_meta"],
    ["Executive Cadence Reviews", "Competency Tracking Engine"],
    ["organizational rhythms operating cadence within", "enterprise training certification within"],
    ["_seed_cadence_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["auto-schedule meetings without approval", "auto-certify without approval"],
    ["override leadership cadence without approval", "bypass human approval for certification without approval"],
    ["Cadence Companion supports", "Learning Companion supports"],
    ["never auto-schedules meetings or overrides leadership cadence", "never auto-certifies or bypasses human approval"],
    ["supports — does not auto-schedule meetings or override leadership cadence", "supports — does not auto-certify or bypass human approval"],
    [
      "supports rhythm visibility, does not auto-schedule meetings or override leadership cadence choices",
      "supports learning guidance, does not auto-certify or bypass human approval for certification",
    ],
    ["operating cadence tracking", "training certification tracking"],
    ["Human-stewarded operating cadence", "Human-stewarded training certification"],
    ["reflection_required", "approval_required"],
    ["Cadence score", "Competency score"],
    ["Cadence discipline level", "Competency maturity level"],
    ["Cadence reflection engine", "Certification center"],
    ["Cadence framework", "Role-based training programs"],
    ["Executive cadence reviews", "Competency tracking engine"],
    ["Leadership Cadence Center", "Leadership Development Hub"],
    ["Team Rhythm Framework", "Competency Tracking Framework"],
    ["Organizational Pulse Calendar", "Unified Workspace Onboarding Integration"],
    ["Cadence reflection scaffolds", "Certification center scaffolds"],
    ["Cadence review entries", "Competency tracking entries"],
    ["humans steward leadership cadence and reflection", "humans steward learning programs and certification"],
    ["operating rhythms, strategic reviews, and follow-up integrity", "learning programs, certifications, and competency development"],
    ["does NOT auto-schedule meetings or override leadership cadence", "does NOT auto-certify or bypass human approval"],
    ["never auto-schedules meetings without approval", "never auto-certifies without approval"],
    ["auto_scheduling_without_approval", "auto_certifying_without_approval"],
    ["overriding_leadership_cadence_choices", "bypassing_human_approval_for_certification"],
    ["punitive_missed_review_enforcement", "punitive_training_enforcement"],
    ["exposing_sensitive_executive_schedules", "exposing_protected_certification_data"],
    ["replacing_human_reflection", "replacing_human_learning_judgment"],
    ["AIPIFY_ORGANIZATIONAL_RHYTHMS_OPERATING_CADENCE_ENGINE", P.docSlug],
    ["organizational_discipline", "learning_before_assumptions"],
    ["execution_consistency", "growth_before_stagnation"],
    ["sustainable_leadership", "clarity_before_complexity"],
    ["strategic_alignment", "role_specific_competency"],
    ["proactive_vs_reactive_management", "structured_learning_programs"],
    ["daily_weekly_monthly_quarterly_annual_cycles", "certification_milestones"],
    ["leadership_cadence", "competency_validation"],
    ["team_rhythms", "human_approval_gates"],
    ["strategic_reviews", "protected_certification_data"],
    ["follow_up_integrity", "competency_signals"],
    ["pulse_calendar", "development_progress"],
    ["upcoming_cadences", "active_learning_programs"],
    ["missed_reviews", "competency_gaps"],
    ["strategic_review_readiness", "growth_before_stagnation_metrics"],
    ["leadership_commitment_tracking", "executive_readiness_summaries"],
    ["rhythm_summaries", "learning_summaries"],
    ["follow_up_insights", "competency_insights"],
    ["cadence_prompts", "learning_prompts"],
    ["cadence_insights", "certification_recommendations"],
    ["schedule_protection_reminders", "certification_data_protection"],
    ["consistency_before_urgency", "learning_before_assumptions"],
    ["discipline_before_chaos", "growth_before_stagnation"],
    ["stewardship_before_short_term_reactions", "clarity_before_complexity"],
    ["aipify_organizational_rhythms_operating_cadence_audit_logs", "aipify_enterprise_training_certification_audit_logs"],
    ["aipify_organizational_rhythms_operating_cadence permissions", "aipify_enterprise_training_certification permissions"],
    ["Metadata-only cadence scaffolds", "Metadata-only learning scaffolds"],
    ["Executive schedule protection", "Protected certification data"],
    ["organizational rhythms operating cadence visibility", "enterprise training certification visibility"],
    ["human reflection gates", "human approval gates"],
    ["consistent cadence without pressure", "guided learning without pressure"],
    ["rhythm summaries and follow-up insights", "learning summaries and competency insights"],
    ["auto-schedule meetings", "auto-certify"],
    ["override leadership cadence", "bypass human approval for certification"],
    ["Era Capstone", "Learning Era"],
    ["ERA CAPSTONE", "LEARNING ERA"],
    ["era capstone", "learning era"],
    ["Global Command & Enterprise Operations Era (201–210)", P.era],
    ["201–210", P.eraRange],
    ["210", "216"],
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
  const src = path.join(ROOT, "lib/aipify/aipify-organizational-rhythms-operating-cadence-engine");
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom210(fs.readFileSync(path.join(src, f), "utf8")));
  }
  const panel = path.join(
    ROOT,
    "components/app/aipify-organizational-rhythms-operating-cadence-engine/AipifyOrganizationalRhythmsOperatingCadenceEngineDashboardPanel.tsx",
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/${engine}DashboardPanel.tsx`),
    transformFrom210(fs.readFileSync(panel, "utf8")),
  );
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${engine}DashboardPanel } from "./${engine}DashboardPanel";\n`);
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom210(
      fs.readFileSync(path.join(ROOT, "app/app/aipify-organizational-rhythms-operating-cadence-engine/page.tsx"), "utf8"),
    ),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom210(
        fs.readFileSync(path.join(ROOT, `app/api/aipify/aipify-organizational-rhythms-operating-cadence-engine/${route}/route.ts`), "utf8"),
      ),
    );
  }
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports capability development and certification guidance — NOT auto-certifying or bypassing human approval. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Enable organizations to continuously develop employee capabilities through structured learning programs, internal certifications, and role-specific competency development — Learning Companion prepares, humans steward certification authority.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Innovation Era (${P.eraRange}). Human-stewarded training and certification; metadata-only scaffolds; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where learning accelerates capability development, certifications reinforce standards, leadership preparedness improves, and humans retain certification authority.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'certification_center', 'label', 'Certification center', 'emoji', '🎓', 'description', 'Internal certification pathways and tracking'),
    jsonb_build_object('key', 'role_based_training_programs', 'label', 'Role-based training programs', 'emoji', '🧭', 'description', 'Tailored learning for executives, managers, and employees'),
    jsonb_build_object('key', 'competency_tracking_engine', 'label', 'Competency tracking engine', 'emoji', '📈', 'description', 'Capability signals and gap visibility'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not auto-certify'),
    jsonb_build_object('key', 'leadership_development_hub', 'label', 'Leadership development hub', 'emoji', '🧠', 'description', 'Responsible leadership development pathways'),
    jsonb_build_object('key', 'executive_readiness_dashboard', 'label', 'Executive readiness dashboard', 'emoji', '📋', 'description', 'Preparedness and investment visibility'),
    jsonb_build_object('key', 'learning_knowledge_libraries', 'label', 'Learning knowledge libraries', 'emoji', '📚', 'description', 'Approved training and certification resources')
  ); ${D};
create or replace function public._${bp}_learning_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities. Learning before assumptions.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'learning_dashboard', 'label', 'Learning Dashboard — assigned activities, recommended training, progress visibility'),
    jsonb_build_object('key', 'certification_center', 'label', 'Certification Center — internal certifications and completion tracking'),
    jsonb_build_object('key', 'role_based_training_programs', 'label', 'Role-Based Training Programs — tailored development journeys'),
    jsonb_build_object('key', 'competency_tracking_engine', 'label', 'Competency Tracking Engine — capability gaps and preparedness signals'),
    jsonb_build_object('key', 'leadership_development_hub', 'label', 'Leadership Development Hub — management and stewardship training'),
    jsonb_build_object('key', 'executive_readiness_dashboard', 'label', 'Executive Readiness Dashboard — strategic readiness visibility'),
    jsonb_build_object('key', 'unified_workspace_onboarding_integration', 'label', 'Unified Workspace + Onboarding integration — cross-links only'),
    jsonb_build_object('key', 'learning_knowledge_libraries', 'label', 'Learning knowledge libraries — approved training resources')
  )); ${D};
create or replace function public._${bp}_certification_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Certification center — humans retain certification authority.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'learning_before_assumptions', 'label', 'Which role needs clearer baseline learning before assumptions are made?'),
    jsonb_build_object('key', 'growth_before_stagnation', 'label', 'Where can internal certifications unblock capability stagnation?'),
    jsonb_build_object('key', 'clarity_before_complexity', 'label', 'What certification criteria need clearer, simpler expectations?'),
    jsonb_build_object('key', 'role_specific_competency', 'label', 'Which competencies should be validated per role?'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Where should human certification approval gates be reinforced?')
  )); ${D};
create or replace function public._${bp}_role_based_training_programs() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Role-based training programs — practical capability development.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'executive_tracks', 'label', 'Executive learning tracks'),
    jsonb_build_object('key', 'manager_tracks', 'label', 'Manager development tracks'),
    jsonb_build_object('key', 'employee_tracks', 'label', 'Employee enablement tracks'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates'),
    jsonb_build_object('key', 'protected_certification_data', 'label', 'Protected certification data'),
    jsonb_build_object('key', 'progress_tracking', 'label', 'Training progress tracking'),
    jsonb_build_object('key', 'capability_development', 'label', 'Capability development velocity'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); ${D};
create or replace function public._${bp}_competency_tracking_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Competency tracking engine — growth before stagnation.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'active_learning_programs', 'label', 'Active learning programs'),
    jsonb_build_object('key', 'competency_gaps', 'label', 'Competency gaps'),
    jsonb_build_object('key', 'certification_completion_rates', 'label', 'Certification completion rates'),
    jsonb_build_object('key', 'role_readiness_signals', 'label', 'Role readiness signals'),
    jsonb_build_object('key', 'executive_readiness_summaries', 'label', 'Executive readiness summaries')
  )); ${D};
create or replace function public._${bp}_learning_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports learning guidance, does not auto-certify or bypass human approval.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'learning_summaries', 'label', 'Learning summaries'),
    jsonb_build_object('key', 'competency_insights', 'label', 'Competency insights'),
    jsonb_build_object('key', 'certification_recommendations', 'label', 'Certification recommendations'),
    jsonb_build_object('key', 'learning_prompts', 'label', 'Learning prompts'),
    jsonb_build_object('key', 'readiness_highlights', 'label', 'Readiness highlights'),
    jsonb_build_object('key', 'certification_data_protection', 'label', 'Protected certification data — RBAC enforced')
  )); ${D};
create or replace function public._${bp}_leadership_development_hub() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Leadership development hub — stewardship before disruption.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'leadership_training_paths', 'label', 'Leadership training paths'),
    jsonb_build_object('key', 'responsible_leadership', 'label', 'Responsible leadership reinforcement'),
    jsonb_build_object('key', 'decision_readiness_prompts', 'label', 'Decision readiness prompts'),
    jsonb_build_object('key', 'approval_checkpoint_reminders', 'label', 'Human approval checkpoint reminders'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no protected certification content'),
    jsonb_build_object('key', 'no_auto_certify', 'label', 'Never auto-certify without approval')
  )); ${D};
create or replace function public._${bp}_executive_readiness_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive readiness dashboard — strategic workforce visibility.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200 cross-link', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'unified_workspace', 'label', 'Unified Workspace Phase 202 cross-link', 'cross_link', '/app/aipify-unified-workspace-engine'),
    jsonb_build_object('key', 'onboarding_center', 'label', 'Onboarding Center Phase 215 cross-link', 'cross_link', '/app/aipify-onboarding-adoption-acceleration-engine'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds — RBAC protected'),
    jsonb_build_object('key', 'readiness_stewardship_loops', 'label', 'Training stewardship loops'),
    jsonb_build_object('key', 'no_auto_certify', 'label', 'Never auto-certify without approval')
  )); ${D};
create or replace function public._${bp}_unified_workspace_onboarding_integration() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Unified workspace and onboarding cross-links only.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'unified_workspace', 'label', 'Unified Workspace Phase 202 cross-link', 'cross_link', '/app/aipify-unified-workspace-engine'),
    jsonb_build_object('key', 'onboarding_center', 'label', 'Onboarding Center Phase 215 cross-link', 'cross_link', '/app/aipify-onboarding-adoption-acceleration-engine'),
    jsonb_build_object('key', 'training_readiness', 'label', 'Training readiness orchestration'),
    jsonb_build_object('key', 'certification_visibility', 'label', 'Certification readiness visibility'),
    jsonb_build_object('key', 'cross_link_only', 'label', 'Cross-link only — do not duplicate RPCs'),
    jsonb_build_object('key', 'no_auto_certify', 'label', 'Never auto-certify without approval')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Auto-certifying without approval',
      'Bypassing human approval for certifications',
      'Exposing protected certification data to unauthorized roles',
      'Replacing human learning judgment',
      'Punitive training enforcement',
      'Assuming competency without evidence',
      'Override human judgment'), 'principle', '${P.companion} supports — humans steward learning and certification authority.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — learning with patience and confidence, without pressure.', 'values', jsonb_build_array('learning_before_assumptions','growth_before_stagnation','clarity_before_complexity','patience','service','recognition'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Training audit logs via aipify_enterprise_training_certification_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_training_certification permissions — learning RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only learning scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'certification_data_protection', 'label', 'Certification data protection — RBAC enforced'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 215, 'key', 'onboarding_adoption_acceleration', 'label', 'Onboarding & Adoption Phase 215', 'route', '/app/aipify-onboarding-adoption-acceleration-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 216, 'key', 'enterprise_training_certification', 'label', 'Enterprise Training & Certification Phase 216', 'route', '/app/${P.slug}', 'description', 'Human-stewarded learning and certification')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'onboarding_center', 'label', 'Onboarding Center Phase 215', 'route', '/app/aipify-onboarding-adoption-acceleration-engine', 'relationship', 'Onboarding progression — cross-link only'),
    jsonb_build_object('key', 'unified_workspace', 'label', 'Unified Workspace Phase 202', 'route', '/app/aipify-unified-workspace-engine', 'relationship', 'Workspace enablement — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive readiness — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Confidence and patience — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with metadata-only learning scaffolds and human approval gates. Growth Partner terminology. ${P.companion} supports — never auto-certifies or bypasses human approval.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans steward learning and certification authority.', '${P.companion} informs and supports.', 'Learning before assumptions — growth before stagnation.', 'Growth Partner — never Affiliate.', 'Innovation Era — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — learning summaries and competency signals max ~500 chars. No protected certification data, PII, or unauthorized training content in audit payloads.'; ${D};
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
    P.prevDecision,
    P.decisionType,
  ];
  sql = sql.replace(/,\n    'aipify_enterprise_adoption_enablement_engine'/g, "");
  const additions = chain.filter((entry) => !sql.includes(`'${entry}'`));
  if (additions.length === 0) return sql;
  const anchor = sql.includes("'aipify_onboarding_adoption_acceleration_engine'")
    ? "'aipify_onboarding_adoption_acceleration_engine'"
    : sql.includes("'aipify_customer_journey_experience_orchestration_engine'")
      ? "'aipify_customer_journey_experience_orchestration_engine'"
      : "'aipify_customer_success_value_realization_engine'";
  const anchorValue = anchor.replace(/'/g, "");
  const toAdd = additions.filter((e) => e !== anchorValue);
  if (toAdd.length === 0) return sql;
  return sql.replace(anchor, `${anchor},\n    ${toAdd.map((e) => `'${e}'`).join(",\n    ")}`);
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
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_learning_dashboard\(\)->'capabilities'\) = 8,/,
    `jsonb_build_object('key', 'center', 'label', '${P.centerTitle} — eight capabilities', 'met', jsonb_array_length(public._${bp}_learning_dashboard()->'capabilities') = 8,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_certification_center\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Certification center — five questions', 'met', jsonb_array_length(public._${bp}_certification_center()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'companion', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_learning_companion\(\)->'capabilities'\) = 6,/,
    `jsonb_build_object('key', 'companion', 'label', '${P.companion} capabilities', 'met', jsonb_array_length(public._${bp}_learning_companion()->'capabilities') = 6,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${bp}_era_opener_summary()) = 2,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'baseline', 'label', 'Repo Phase \d+ baseline tables'/,
    `jsonb_build_object('key', 'baseline', 'label', 'Repo Phase ${P.phase} baseline tables'`,
  );

  for (const fn of [
    "learning_dashboard",
    "certification_center",
    "role_based_training_programs",
    "competency_tracking_engine",
    "learning_companion",
    "leadership_development_hub",
    "executive_readiness_dashboard",
    "unified_workspace_onboarding_integration",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${bp}_${fn}()`);
  }

  sql = sql.replace(
    /select 'aipify-organizational-rhythms-operating-cadence-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`Phase ${P.phase} ${P.title} Engine —[^']+`, "g"),
    `Phase ${P.phase} ${P.title} Engine — enterprise training and certification within Innovation Era; cross-link only for unified workspace and onboarding center.`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replace(/'title', 'Aipify Organizational Rhythms & Operating Cadence Engine'/g, `'title', '${P.title} Engine'`);

  return sql;
}

function genMigration() {
  const src210 = path.join(ROOT, "supabase/migrations/20261370000000_aipify_organizational_rhythms_operating_cadence_engine_phase210.sql");
  if (!fs.existsSync(src210)) {
    throw new Error("Phase 210 migration required — ensure migration exists");
  }
  let m = transformFrom210(fs.readFileSync(src210, "utf8"));
  m = m.replace(/_aoroce_seed_cadence_notes/g, `_${P.helper}_seed_${P.thirdEntity.replace("_notes", "")}_notes`);
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports learning guidance — does NOT auto-certify or bypass human approval.

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
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never auto-certifies.";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/${P.slug}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_COMPANION_LIMITATIONS = [\n${P.companionLimitations.map((l) => `  "${l}",`).join("\n")}\n] as const;\n`,
  );
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports learning summaries, competency insights, and certification recommendations. Supports humans — does NOT auto-certify or bypass human approval. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Competency score",
    modeLabel: "Mode",
    readinessLabel: "Competency maturity level",
    executiveReviews: "Executive readiness dashboard",
    activeReflections: "Active certification scaffolds",
    humanOversightRequired: `Human oversight required — humans steward learning programs and certification; ${P.companion} supports only`,
    eraOpenerSummary: `Innovation Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate unified workspace or onboarding center RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Certification center — competency prompts",
    frameworkLabel: "Role-based training programs",
    reviewsLabel: "Executive readiness dashboard",
    companionLabel: `${P.companion} — supports, does not auto-certify`,
    subEngineLabel: "Leadership Development Hub",
    reflections: "Certification center scaffolds",
    executiveReviewEntries: "Executive readiness entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT auto-certify or bypass human approval`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports learning guidance — humans retain certification authority.`,
      philosophy: "People First. Metadata-only learning scaffolds. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
      learningEra: `${P.era} — Phase ${P.phase}.`,
    },
  };
}

function patchNav() {
  let c = fs.readFileSync(path.join(ROOT, "lib/app/nav-config.ts"), "utf8");
  const id = P.camel;
  const href = `/app/${P.slug}`;
  if (!c.includes(`"${id}"`)) {
    c = c.replace('| "aipifyCustomerSuccessValueRealizationEngine"', `| "aipifyCustomerSuccessValueRealizationEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    const anchor = /id: "aipifyOnboardingAdoptionAccelerationEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyOnboardingAdoptionAccelerationEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-onboarding-adoption-acceleration-engine")) {\n    return "aipifyOnboardingAdoptionAccelerationEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-onboarding-adoption-acceleration-engine")) {\n    return "aipifyOnboardingAdoptionAccelerationEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
  console.log("patched nav-config");
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_onboarding_adoption_acceleration.steward",', `"aipify_onboarding_adoption_acceleration.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
  console.log("patched permissions");
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-onboarding-adoption-acceleration-engine";',
      `export * from "./aipify-onboarding-adoption-acceleration-engine";\nexport * from "./${P.slug}";`,
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
        ? "Opplæring og sertifisering"
        : locale === "sv"
          ? "Utbildning och certifiering"
          : locale === "da"
            ? "Træning og certificering"
            : P.navLabel;
    data[P.camel] = block;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchArchitecture() {
  let c = fs.readFileSync(path.join(ROOT, "ARCHITECTURE.md"), "utf8");
  const entry = `\n**Aipify Enterprise Training & Certification Engine (Phase ${P.phase}):** See [${P.docSlug}_PHASE${P.phase}.md](./${P.docSlug}_PHASE${P.phase}.md) — ${P.centerTitle} for learning dashboard, certification center, role-based training programs, competency tracking engine, leadership development hub, executive readiness dashboard, and learning knowledge libraries. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** auto-certifying or bypassing human approval. Cross-links only: Phase 215 onboarding center, Phase 202 unified workspace, Phase 200 executive cockpit. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes(`Phase ${P.phase}`)) {
    const marker = "Permissions `aipify_onboarding_adoption_acceleration.steward`.";
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

function patchIlm() {
  let c = fs.readFileSync(path.join(ROOT, "lib/internal-language-model/index.ts"), "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    c = c.replace(
      'export * from "./implementation-blueprint-phase215-vocabulary";',
      `export * from "./implementation-blueprint-phase215-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  const corpus = `aipify-core/knowledge/internal-language-model/${P.ilmFile}`;
  if (!c.includes(corpus)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE215_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase215-aipify-onboarding-adoption-acceleration.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE215_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase215-aipify-onboarding-adoption-acceleration.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "${corpus}";`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/internal-language-model/index.ts"), c);
  console.log("patched ilm index");
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
