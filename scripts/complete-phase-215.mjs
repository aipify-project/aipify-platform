#!/usr/bin/env node
/** ABOS Phase 215 — Aipify Onboarding & Adoption Acceleration Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const P = {
  phase: 215,
  migration: "20261375000000_aipify_onboarding_adoption_acceleration_engine_phase215.sql",
  slug: "aipify-onboarding-adoption-acceleration-engine",
  base: "AipifyOnboardingAdoptionAcceleration",
  camel: "aipifyOnboardingAdoptionAccelerationEngine",
  snake: "aipify_onboarding_adoption_acceleration",
  permPrefix: "aipify_onboarding_adoption_acceleration",
  helper: "aoaae",
  bp: "aoaaebp215",
  decisionType: "aipify_onboarding_adoption_acceleration_engine",
  prevDecision: "aipify_customer_journey_experience_orchestration_engine",
  title: "Aipify Onboarding & Adoption Acceleration",
  centerTitle: "Onboarding Center",
  companion: "Onboarding Companion",
  scoreKey: "aipify_onboarding_adoption_acceleration_score",
  modeKey: "onboarding_acceleration_mode",
  levelKey: "adoption_maturity_level",
  thirdEntity: "onboarding_notes",
  era: "Innovation & Adaptive Excellence Era (211–220)",
  eraRange: "211–220",
  docSlug: "AIPIFY_ONBOARDING_ADOPTION_ACCELERATION_ENGINE",
  ilmFile: "implementation-blueprint-phase215-aipify-onboarding-adoption-acceleration.txt",
  navLabel: "Onboarding & Adoption",
  crossLinkNote:
    "Cross-links only: Phase 213 customer success center, Phase 202 unified workspace, Phase 200 executive cockpit — never auto-configure setup, bypass human approval, or expose sensitive org setup info.",
  ilmExtra: `
Onboarding Center: onboarding dashboard, role-based learning paths, setup completion center, adoption insights dashboard, guided success recommendations, executive readiness briefing, customer success/unified workspace/executive integration (cross-links), onboarding knowledge libraries.
Role-Based Learning Paths prompts: role-specific enablement, confidence building, guided first wins, adoption milestones, value realization checkpoints.
Setup Completion Center: setup milestones, completion tracking, human approval gates, sensitive org setup protection, metadata-only scaffolds.
Adoption Insights Dashboard: adoption signals, enablement progress, value-before-feature metrics, executive readiness summaries.
Guided Success Recommendations: next-step suggestions — never auto-configure or bypass approval.
Design principles: confidence before complexity, guidance before frustration, value before feature overload.
Companion limitations: no auto-configuring setup, no bypassing human approval, no exposing sensitive org setup info, no punitive adoption enforcement, no feature overload pressure.`,
  faqBody: `## What is Onboarding & Adoption Acceleration Engine?

Onboarding & Adoption Acceleration helps organizations realize value from Aipify faster via structured onboarding, adoption guidance, and role-specific enablement journeys — at \`/app/aipify-onboarding-adoption-acceleration-engine\`.

## Does the Onboarding Companion configure setup automatically?

**No.** The Onboarding Companion suggests next steps and guided success recommendations — it does NOT auto-configure setup or bypass human approval for sensitive org configuration.

## What does the Onboarding Center show?

Onboarding progress, role-based learning paths, setup completion milestones, adoption insights, and executive readiness briefings — metadata only.

## How does this relate to Customer Success, Unified Workspace, and Executive Cockpit?

Cross-link only: Phase 213 customer success (\`/app/aipify-customer-success-value-realization-engine\`), Phase 202 unified workspace (\`/app/aipify-unified-workspace-engine\`), Phase 200 executive cockpit (\`/app/aipify-executive-operating-system-founders-cockpit-engine\`). Never duplicate their RPCs.

## Why human approval for setup?

Humans retain setup authority. Aipify guides and suggests — it does not auto-configure or bypass approval for sensitive org setup.`,
  companionLimitations: [
    "auto_configuring_setup_without_approval",
    "bypassing_human_approval_for_setup",
    "exposing_sensitive_org_setup_info",
    "replacing_human_onboarding_judgment",
    "punitive_adoption_enforcement",
    "feature_overload_pressure",
    "replace_human_judgment",
  ],
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
    ["organizational_rhythm_dashboard", "onboarding_dashboard"],
    ["cadence_reflection_engine", "role_based_learning_paths"],
    ["cadence_framework", "setup_completion_center"],
    ["executive_cadence_reviews", "adoption_insights_dashboard"],
    ["cadence_companion", "onboarding_companion"],
    ["leadership_cadence_center", "guided_success_recommendations"],
    ["team_rhythm_framework", "adoption_guidance_framework"],
    ["strategic_review_scheduler", "executive_readiness_briefing"],
    ["follow_up_integrity_monitor", "customer_success_workspace_integration"],
    ["organizational_pulse_calendar", "executive_cockpit_integration"],
    ["action_decision_executive_cockpit_integration", "executive_cockpit_integration"],
    ["cadence_knowledge_libraries", "onboarding_knowledge_libraries"],
    ["leadership_cadence_center_meta", "guided_success_recommendations_meta"],
    ["team_rhythm_framework_meta", "adoption_guidance_framework_meta"],
    ["organizational_pulse_calendar_meta", "executive_cockpit_integration_meta"],
    ["Executive Cadence Reviews", "Adoption Insights Dashboard"],
    ["organizational rhythms operating cadence within", "onboarding adoption acceleration within"],
    ["_seed_cadence_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["auto-schedule meetings without approval", "auto-configure setup without approval"],
    ["override leadership cadence without approval", "bypass human approval for setup without approval"],
    ["Cadence Companion supports", "Onboarding Companion supports"],
    ["never auto-schedules meetings or overrides leadership cadence", "never auto-configures setup or bypasses human approval"],
    ["supports — does not auto-schedule meetings or override leadership cadence", "supports — does not auto-configure setup or bypass human approval"],
    [
      "supports rhythm visibility, does not auto-schedule meetings or override leadership cadence choices",
      "supports adoption guidance, does not auto-configure setup or bypass human approval",
    ],
    ["operating cadence tracking", "onboarding adoption tracking"],
    ["Human-stewarded operating cadence", "Human-stewarded onboarding adoption"],
    ["reflection_required", "approval_required"],
    ["Cadence score", "Adoption score"],
    ["Cadence discipline level", "Adoption maturity level"],
    ["Cadence reflection engine", "Role-based learning paths"],
    ["Cadence framework", "Setup completion center"],
    ["Executive cadence reviews", "Adoption insights dashboard"],
    ["Leadership Cadence Center", "Guided Success Recommendations"],
    ["Team Rhythm Framework", "Adoption Guidance Framework"],
    ["Organizational Pulse Calendar", "Executive Cockpit Integration"],
    ["Cadence reflection scaffolds", "Role-based learning path scaffolds"],
    ["Cadence review entries", "Adoption insight entries"],
    ["humans steward leadership cadence and reflection", "humans steward onboarding setup and adoption"],
    ["operating rhythms, strategic reviews, and follow-up integrity", "onboarding milestones, role enablement, and adoption signals"],
    ["does NOT auto-schedule meetings or override leadership cadence", "does NOT auto-configure setup or bypass human approval"],
    ["never auto-schedules meetings without approval", "never auto-configures setup without approval"],
    ["auto_scheduling_without_approval", "auto_configuring_setup_without_approval"],
    ["overriding_leadership_cadence_choices", "bypassing_human_approval_for_setup"],
    ["punitive_missed_review_enforcement", "punitive_adoption_enforcement"],
    ["exposing_sensitive_executive_schedules", "exposing_sensitive_org_setup_info"],
    ["replacing_human_reflection", "replacing_human_onboarding_judgment"],
    ["AIPIFY_ORGANIZATIONAL_RHYTHMS_OPERATING_CADENCE_ENGINE", P.docSlug],
    ["organizational_discipline", "confidence_building"],
    ["execution_consistency", "guided_first_wins"],
    ["sustainable_leadership", "adoption_milestones"],
    ["strategic_alignment", "value_realization_checkpoints"],
    ["proactive_vs_reactive_management", "role_specific_enablement"],
    ["daily_weekly_monthly_quarterly_annual_cycles", "setup_milestones"],
    ["leadership_cadence", "completion_tracking"],
    ["team_rhythms", "human_approval_gates"],
    ["strategic_reviews", "sensitive_setup_protection"],
    ["follow_up_integrity", "adoption_signals"],
    ["pulse_calendar", "enablement_progress"],
    ["upcoming_cadences", "active_onboarding_journeys"],
    ["missed_reviews", "adoption_gaps"],
    ["strategic_review_readiness", "value_before_feature_metrics"],
    ["leadership_commitment_tracking", "executive_readiness_summaries"],
    ["rhythm_summaries", "adoption_summaries"],
    ["follow_up_insights", "enablement_insights"],
    ["cadence_prompts", "onboarding_prompts"],
    ["cadence_insights", "success_recommendations"],
    ["schedule_protection_reminders", "org_setup_info_protection"],
    ["consistency_before_urgency", "confidence_before_complexity"],
    ["discipline_before_chaos", "guidance_before_frustration"],
    ["stewardship_before_short_term_reactions", "value_before_feature_overload"],
    ["aipify_organizational_rhythms_operating_cadence_audit_logs", "aipify_onboarding_adoption_acceleration_audit_logs"],
    ["aipify_organizational_rhythms_operating_cadence permissions", "aipify_onboarding_adoption_acceleration permissions"],
    ["Metadata-only cadence scaffolds", "Metadata-only onboarding scaffolds"],
    ["Executive schedule protection", "Sensitive org setup protection"],
    ["organizational rhythms operating cadence visibility", "onboarding adoption acceleration visibility"],
    ["human reflection gates", "human approval gates"],
    ["consistent cadence without pressure", "guided adoption without pressure"],
    ["rhythm summaries and follow-up insights", "adoption summaries and enablement insights"],
    ["auto-schedule meetings", "auto-configure setup"],
    ["override leadership cadence", "bypass human approval for setup"],
    ["Era Capstone", "Onboarding Era"],
    ["ERA CAPSTONE", "ONBOARDING ERA"],
    ["era capstone", "onboarding era"],
    ["Global Command & Enterprise Operations Era (201–210)", P.era],
    ["201–210", P.eraRange],
    ["210", "215"],
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
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports adoption guidance — NOT auto-configuring setup or bypassing human approval. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Help organizations realize value from Aipify faster via structured onboarding, adoption guidance, and role-specific enablement journeys — Onboarding Companion prepares, humans steward setup and adoption.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Innovation Era (${P.eraRange}). Human-stewarded onboarding adoption; metadata-only scaffolds; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where onboarding builds confidence, adoption follows guided value realization, role-specific enablement accelerates success, and humans retain setup authority.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'role_based_learning_paths', 'label', 'Role-based learning paths', 'emoji', '🎓', 'description', 'Role-specific enablement journeys'),
    jsonb_build_object('key', 'setup_completion', 'label', 'Setup completion center', 'emoji', '🛡️', 'description', 'Milestones with human approval gates'),
    jsonb_build_object('key', 'adoption_insights', 'label', 'Adoption insights dashboard', 'emoji', '📈', 'description', 'Adoption signals and enablement progress'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not auto-configure'),
    jsonb_build_object('key', 'guided_success', 'label', 'Guided success recommendations', 'emoji', '💡', 'description', 'Next-step suggestions only'),
    jsonb_build_object('key', 'executive_readiness', 'label', 'Executive readiness briefing', 'emoji', '📋', 'description', 'Leadership adoption readiness scaffolds'),
    jsonb_build_object('key', 'onboarding_libraries', 'label', 'Onboarding knowledge libraries', 'emoji', '🌱', 'description', 'Approved onboarding resources')
  ); ${D};
create or replace function public._${bp}_onboarding_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities. Confidence before complexity.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'onboarding_dashboard', 'label', 'Onboarding Dashboard — active journeys, setup progress, executive visibility'),
    jsonb_build_object('key', 'role_based_learning_paths', 'label', 'Role-Based Learning Paths — role-specific enablement, confidence building'),
    jsonb_build_object('key', 'setup_completion_center', 'label', 'Setup Completion Center — milestones, completion tracking, human approval gates'),
    jsonb_build_object('key', 'adoption_guidance_framework', 'label', 'Adoption Guidance Framework — value before feature overload'),
    jsonb_build_object('key', 'adoption_insights_dashboard', 'label', 'Adoption Insights Dashboard — adoption signals, enablement progress'),
    jsonb_build_object('key', 'guided_success_recommendations', 'label', 'Guided Success Recommendations — next steps, never auto-configure'),
    jsonb_build_object('key', 'executive_readiness_briefing', 'label', 'Executive Readiness Briefing — leadership adoption readiness'),
    jsonb_build_object('key', 'onboarding_knowledge_libraries', 'label', 'Onboarding knowledge libraries — approved onboarding resources')
  )); ${D};
create or replace function public._${bp}_role_based_learning_paths() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Role-based learning paths — humans steward enablement journeys.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'confidence_building', 'label', 'Where does confidence need building before complexity?'),
    jsonb_build_object('key', 'guided_first_wins', 'label', 'What guided first wins accelerate adoption?'),
    jsonb_build_object('key', 'adoption_milestones', 'label', 'Which adoption milestones matter for this role?'),
    jsonb_build_object('key', 'value_realization_checkpoints', 'label', 'Where are value realization checkpoints due?'),
    jsonb_build_object('key', 'role_specific_enablement', 'label', 'What role-specific enablement reduces frustration?')
  )); ${D};
create or replace function public._${bp}_setup_completion_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Setup completion center — guidance before frustration.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'setup_milestones', 'label', 'Setup milestones'),
    jsonb_build_object('key', 'completion_tracking', 'label', 'Completion tracking'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates'),
    jsonb_build_object('key', 'sensitive_setup_protection', 'label', 'Sensitive org setup protection'),
    jsonb_build_object('key', 'adoption_signals', 'label', 'Adoption signals'),
    jsonb_build_object('key', 'enablement_progress', 'label', 'Enablement progress'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); ${D};
create or replace function public._${bp}_adoption_insights_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Adoption insights dashboard — value before feature overload.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'active_onboarding_journeys', 'label', 'Active onboarding journeys'),
    jsonb_build_object('key', 'adoption_gaps', 'label', 'Adoption gaps'),
    jsonb_build_object('key', 'value_before_feature_metrics', 'label', 'Value-before-feature metrics'),
    jsonb_build_object('key', 'enablement_velocity', 'label', 'Enablement velocity'),
    jsonb_build_object('key', 'executive_readiness_summaries', 'label', 'Executive readiness summaries')
  )); ${D};
create or replace function public._${bp}_onboarding_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports adoption guidance, does not auto-configure setup or bypass human approval.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'adoption_summaries', 'label', 'Adoption summaries'),
    jsonb_build_object('key', 'enablement_insights', 'label', 'Enablement insights'),
    jsonb_build_object('key', 'success_recommendations', 'label', 'Success recommendations'),
    jsonb_build_object('key', 'onboarding_prompts', 'label', 'Onboarding prompts'),
    jsonb_build_object('key', 'readiness_highlights', 'label', 'Readiness highlights'),
    jsonb_build_object('key', 'org_setup_info_protection', 'label', 'Sensitive org setup protection — RBAC enforced')
  )); ${D};
create or replace function public._${bp}_guided_success_recommendations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Guided success recommendations — suggest next steps only.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'next_step_suggestions', 'label', 'Next-step suggestions — never auto-configure'),
    jsonb_build_object('key', 'value_first_guidance', 'label', 'Value-first guidance before feature overload'),
    jsonb_build_object('key', 'role_aware_prompts', 'label', 'Role-aware enablement prompts'),
    jsonb_build_object('key', 'approval_checkpoint_reminders', 'label', 'Human approval checkpoint reminders'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no sensitive org setup content'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for setup changes')
  )); ${D};
create or replace function public._${bp}_adoption_guidance_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Adoption guidance framework — confidence before complexity.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'confidence_before_complexity', 'label', 'Confidence before complexity scaffolds'),
    jsonb_build_object('key', 'guidance_before_frustration', 'label', 'Guidance before frustration prompts'),
    jsonb_build_object('key', 'value_before_feature_overload', 'label', 'Value before feature overload discipline'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Onboarding audit trails'),
    jsonb_build_object('key', 'no_auto_configure', 'label', 'Never auto-configure setup without approval'),
    jsonb_build_object('key', 'customer_success_cross_link', 'label', 'Customer Success Phase 213 cross-link', 'cross_link', '/app/aipify-customer-success-value-realization-engine')
  )); ${D};
create or replace function public._${bp}_executive_readiness_briefing() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive readiness briefing — cross-links only.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200 cross-link', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'customer_success', 'label', 'Customer Success Phase 213 cross-link', 'cross_link', '/app/aipify-customer-success-value-realization-engine'),
    jsonb_build_object('key', 'unified_workspace', 'label', 'Unified Workspace Phase 202 cross-link', 'cross_link', '/app/aipify-unified-workspace-engine'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds — RBAC protected'),
    jsonb_build_object('key', 'adoption_stewardship_loops', 'label', 'Adoption stewardship loops'),
    jsonb_build_object('key', 'no_auto_configure', 'label', 'Never auto-configure setup without approval')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Auto-configuring setup without approval',
      'Bypassing human approval for sensitive org setup',
      'Exposing sensitive org setup info to unauthorized roles',
      'Replacing human onboarding judgment',
      'Punitive adoption enforcement',
      'Feature overload pressure',
      'Override human judgment'), 'principle', '${P.companion} supports — humans steward onboarding setup and adoption.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — confidence, patience, and service toward guided adoption without pressure.', 'values', jsonb_build_array('confidence_before_complexity','guidance_before_frustration','value_before_feature_overload','patience','service','recognition'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Onboarding audit logs via aipify_onboarding_adoption_acceleration_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_onboarding_adoption_acceleration permissions — onboarding RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only onboarding scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'org_setup_info_protection', 'label', 'Sensitive org setup protection — RBAC enforced'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 213, 'key', 'customer_success_value_realization', 'label', 'Customer Success Phase 213', 'route', '/app/aipify-customer-success-value-realization-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 215, 'key', 'onboarding_adoption_acceleration', 'label', 'Onboarding & Adoption Phase 215', 'route', '/app/${P.slug}', 'description', 'Human-stewarded onboarding adoption')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'customer_success', 'label', 'Customer Success Phase 213', 'route', '/app/aipify-customer-success-value-realization-engine', 'relationship', 'Value realization — cross-link only'),
    jsonb_build_object('key', 'unified_workspace', 'label', 'Unified Workspace Phase 202', 'route', '/app/aipify-unified-workspace-engine', 'relationship', 'Workspace enablement — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive readiness — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Confidence and patience — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with metadata-only onboarding scaffolds and human approval gates. Growth Partner terminology. ${P.companion} supports — never auto-configures setup or bypasses human approval.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans steward onboarding setup and adoption.', '${P.companion} informs and supports.', 'Confidence before complexity — guidance before frustration.', 'Growth Partner — never Affiliate.', 'Innovation Era — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — adoption summaries and enablement signals max ~500 chars. No sensitive org setup info, PII, or unauthorized onboarding content in audit payloads.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  const chain = [
    "aipify_organizational_rhythms_operating_cadence_engine",
    "aipify_continuous_improvement_optimization_engine",
    "aipify_innovation_opportunity_discovery_engine",
    "aipify_customer_success_value_realization_engine",
    P.prevDecision,
    P.decisionType,
  ];
  sql = sql.replace(/,\n    'aipify_enterprise_adoption_enablement_engine'/g, "");
  const additions = chain.filter((entry) => !sql.includes(`'${entry}'`));
  if (additions.length === 0) return sql;
  const anchor = sql.includes("'aipify_innovation_opportunity_discovery_engine'")
    ? "'aipify_innovation_opportunity_discovery_engine'"
    : "'aipify_customer_success_value_realization_engine'";
  return sql.replace(anchor, `${anchor},\n    ${additions.map((e) => `'${e}'`).join(",\n    ")}`);
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
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_onboarding_dashboard\(\)->'capabilities'\) = 8,/,
    `jsonb_build_object('key', 'center', 'label', '${P.centerTitle} — eight capabilities', 'met', jsonb_array_length(public._${bp}_onboarding_dashboard()->'capabilities') = 8,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_role_based_learning_paths\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Role-based learning paths — five questions', 'met', jsonb_array_length(public._${bp}_role_based_learning_paths()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'companion', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_onboarding_companion\(\)->'capabilities'\) = 6,/,
    `jsonb_build_object('key', 'companion', 'label', '${P.companion} capabilities', 'met', jsonb_array_length(public._${bp}_onboarding_companion()->'capabilities') = 6,`,
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
    "onboarding_dashboard",
    "role_based_learning_paths",
    "setup_completion_center",
    "adoption_insights_dashboard",
    "onboarding_companion",
    "guided_success_recommendations",
    "adoption_guidance_framework",
    "executive_readiness_briefing",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${bp}_${fn}()`);
  }
  sql = sql.replace(/executive_cockpit_integration/g, "executive_readiness_briefing");
  sql = sql.replace(/_aoaaebp215_executive_cockpit_integration/g, "_aoaaebp215_executive_readiness_briefing");

  if (!sql.includes("executive_readiness_briefing_meta")) {
    sql = sql.replace(
      `'sub_engine_meta', public._${bp}_guided_success_recommendations(),`,
      `'sub_engine_meta', public._${bp}_guided_success_recommendations(), 'adoption_guidance_framework_meta', public._${bp}_adoption_guidance_framework(), 'executive_readiness_briefing_meta', public._${bp}_executive_readiness_briefing(),`,
    );
  }

  sql = sql.replace(
    /select 'aipify-organizational-rhythms-operating-cadence-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`Phase ${P.phase} ${P.title} Engine —[^']+`, "g"),
    `Phase ${P.phase} ${P.title} Engine — onboarding adoption acceleration within Innovation Era; cross-link only for customer success, unified workspace, and executive cockpit.`,
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

${P.centerTitle} within ${P.era}. ${P.companion} supports adoption guidance — does NOT auto-configure setup or bypass human approval.

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
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never auto-configures setup.";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/${P.slug}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_COMPANION_LIMITATIONS = [\n${P.companionLimitations.map((l) => `  "${l}",`).join("\n")}\n] as const;\n`,
  );
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports adoption summaries, enablement insights, and guided success recommendations. Supports humans — does NOT auto-configure setup or bypass human approval. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Adoption score",
    modeLabel: "Mode",
    readinessLabel: "Adoption maturity level",
    executiveReviews: "Adoption insights dashboard",
    activeReflections: "Active learning path scaffolds",
    humanOversightRequired: `Human oversight required — humans steward onboarding setup; ${P.companion} supports only`,
    eraOpenerSummary: `Innovation Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate customer success, unified workspace, or executive cockpit RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Role-based learning paths — enablement prompts",
    frameworkLabel: "Setup completion center",
    reviewsLabel: "Adoption insights dashboard",
    companionLabel: `${P.companion} — supports, does not auto-configure`,
    subEngineLabel: "Guided Success Recommendations",
    reflections: "Role-based learning path scaffolds",
    executiveReviewEntries: "Adoption insight entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT auto-configure setup or bypass human approval`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports adoption guidance — humans retain setup authority.`,
      philosophy: "People First. Metadata-only onboarding scaffolds. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
      onboardingEra: `${P.era} — Phase ${P.phase}.`,
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
    const anchor = /id: "aipifyCustomerJourneyExperienceOrchestrationEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyCustomerJourneyExperienceOrchestrationEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-customer-journey-experience-orchestration-engine")) {\n    return "aipifyCustomerJourneyExperienceOrchestrationEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-customer-journey-experience-orchestration-engine")) {\n    return "aipifyCustomerJourneyExperienceOrchestrationEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
  console.log("patched nav-config");
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_continuous_improvement_optimization.steward",', `"aipify_continuous_improvement_optimization.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
  console.log("patched permissions");
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-customer-success-value-realization-engine";',
      `export * from "./aipify-customer-success-value-realization-engine";\nexport * from "./${P.slug}";`,
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
        ? "Onboarding og adopsjon"
        : locale === "sv"
          ? "Onboarding och adoption"
          : locale === "da"
            ? "Onboarding og adoption"
            : P.navLabel;
    data[P.camel] = block;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchArchitecture() {
  let c = fs.readFileSync(path.join(ROOT, "ARCHITECTURE.md"), "utf8");
  const entry = `\n**Aipify Onboarding & Adoption Acceleration Engine (Phase ${P.phase}):** See [${P.docSlug}_PHASE${P.phase}.md](./${P.docSlug}_PHASE${P.phase}.md) — ${P.centerTitle} for onboarding dashboard, role-based learning paths, setup completion center, adoption insights dashboard, guided success recommendations, executive readiness briefing, and onboarding knowledge libraries. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** auto-configuring setup or bypassing human approval. Cross-links only: Phase 213 customer success, Phase 202 unified workspace, Phase 200 executive cockpit. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes(`Phase ${P.phase}`)) {
    const marker = "Permissions `aipify_customer_success_value_realization.steward`.";
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
      'export * from "./implementation-blueprint-phase213-vocabulary";',
      `export * from "./implementation-blueprint-phase213-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  const corpus = `aipify-core/knowledge/internal-language-model/${P.ilmFile}`;
  if (!c.includes(corpus)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE213_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase213-aipify-customer-success-value-realization.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE213_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase213-aipify-customer-success-value-realization.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "${corpus}";`,
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
