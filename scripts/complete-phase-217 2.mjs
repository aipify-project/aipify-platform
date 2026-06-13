#!/usr/bin/env node
/** ABOS Phase 217 — Aipify Organizational Communication & Announcements Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "communication_dashboard",
  "leadership_broadcast_center",
  "department_communication_hub",
  "announcement_scheduler",
  "read_acknowledgement_framework",
  "executive_communication_insights",
  "digital_headquarters_notification_integration",
  "communication_knowledge_libraries",
];

const P = {
  phase: 217,
  migration: "20261377000000_aipify_organizational_communication_announcements_engine_phase217.sql",
  slug: "aipify-organizational-communication-announcements-engine",
  base: "AipifyOrganizationalCommunicationAnnouncements",
  camel: "aipifyOrganizationalCommunicationAnnouncementsEngine",
  snake: "aipify_organizational_communication_announcements",
  permPrefix: "aipify_organizational_communication_announcements",
  helper: "aocae",
  bp: "aocaebp217",
  decisionType: "aipify_organizational_communication_announcements_engine",
  prevDecision: "aipify_enterprise_training_certification_engine",
  title: "Aipify Organizational Communication & Announcements",
  centerTitle: "Communication Center",
  companion: "Communication Companion",
  scoreKey: "aipify_organizational_communication_announcements_score",
  modeKey: "communication_mode",
  levelKey: "communication_maturity_level",
  thirdEntity: "communication_notes",
  era: "Innovation & Adaptive Excellence Era (211–220)",
  eraRange: "211–220",
  docSlug: "AIPIFY_ORGANIZATIONAL_COMMUNICATION_ANNOUNCEMENTS_ENGINE",
  ilmFile: "implementation-blueprint-phase217-aipify-organizational-communication-announcements.txt",
  navLabel: "Communication & Announcements",
  crossLinkNote:
    "Cross-links only: Phase 203 digital headquarters, Phase 202 unified workspace / notification hub — never auto-broadcast, bypass human approval, or expose protected sensitive communications.",
  ilmExtra: `
Communication Center: communication dashboard, leadership broadcast center, department communication hub, announcement scheduler, read & acknowledgement framework, executive communication insights, digital headquarters/notification hub integration (cross-links), communication knowledge libraries.
Leadership Broadcast Center: leadership messaging scaffolds, broadcast preparation, human approval gates, protected sensitive communications, metadata-only scaffolds.
Department Communication Hub: department channels, structured announcements, RBAC-scoped visibility, acknowledgement tracking for compliance — advisory only.
Announcement Scheduler: scheduled announcements — never auto-broadcast without approval.
Read & Acknowledgement Framework: read receipts and acknowledgement tracking — compliance advisory, humans retain broadcast authority.
Design principles: clarity before complexity, transparency before assumptions, communication before confusion.
Companion limitations: no auto-broadcasting without approval, no bypassing human approval, no exposing protected sensitive communications, no punitive communication enforcement, no assuming readership without evidence.`,
  faqBody: `## What is Organizational Communication & Announcements Engine?

Organizational Communication & Announcements provides a structured professional communication framework ensuring important information reaches the right people at the right time — at \`/app/aipify-organizational-communication-announcements-engine\`.

## Does the Communication Companion broadcast announcements automatically?

**No.** The Communication Companion prepares communication scaffolds and scheduling suggestions — it does NOT auto-broadcast without approval or expose protected sensitive communications.

## What does the Communication Center show?

Communication dashboard, leadership broadcast center, department communication hub, announcement scheduler, read & acknowledgement framework, and executive communication insights — metadata only.

## How does this relate to Digital Headquarters and Unified Workspace?

Cross-link only: Phase 203 digital headquarters (\`/app/aipify-digital-headquarters-engine\`), Phase 202 unified workspace (\`/app/aipify-unified-workspace-engine\`). Never duplicate their RPCs.

## Why human approval for broadcasts?

Humans retain communication authority. Aipify advises and prepares — it does not auto-broadcast or bypass approval for protected sensitive communications.`,
  companionLimitations: [
    "auto_broadcasting_without_approval",
    "bypassing_human_approval_for_communications",
    "exposing_protected_sensitive_communications",
    "replacing_human_communication_judgment",
    "punitive_communication_enforcement",
    "assuming_readership_without_evidence",
    "replace_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom215(content) {
  const thirdPascal = P.thirdEntity.split("_").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
  const pairs = [
    ["AipifyOnboardingAdoptionAcceleration", P.base],
    ["aipify-onboarding-adoption-acceleration-engine", P.slug],
    ["aipify_onboarding_adoption_acceleration", P.snake],
    ["aipifyOnboardingAdoptionAcceleration", P.camel.replace(/Engine$/, "")],
    ["AipifyOnboardingAdoptionAccelerationEngine", P.camel],
    ["aoaaebp215", P.bp],
    ["_aoaae_", `_${P.helper}_`],
    ["aipify_onboarding_adoption_acceleration_score", P.scoreKey],
    ["onboarding_acceleration_mode", P.modeKey],
    ["adoption_maturity_level", P.levelKey],
    ["onboarding_notes", P.thirdEntity],
    ["OnboardingNote", thirdPascal],
    ["onboarding_notes_count", `${P.thirdEntity}_count`],
    ["Onboarding Center", P.centerTitle],
    ["Onboarding Companion", P.companion],
    ["Aipify Onboarding & Adoption Acceleration", P.title],
    ["Onboarding & Adoption", P.navLabel],
    ["Phase 215", `Phase ${P.phase}`],
    ["aipify_onboarding_adoption_acceleration.view", `${P.permPrefix}.view`],
    ["aipify_onboarding_adoption_acceleration.manage", `${P.permPrefix}.manage`],
    ["aipify_onboarding_adoption_acceleration.steward", `${P.permPrefix}.steward`],
    ["20261375000000_aipify_onboarding_adoption_acceleration_engine_phase215.sql", P.migration],
    ["Repo Phase 215", `Repo Phase ${P.phase}`],
    ["Phase 215 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE215_AIPIFY_ONBOARDING_ADOPTION_ACCELERATION_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase215", `implementation-blueprint-phase${P.phase}`],
    ["onboarding_dashboard", SCAFFOLDS[0]],
    ["role_based_learning_paths", SCAFFOLDS[1]],
    ["setup_completion_center", SCAFFOLDS[2]],
    ["adoption_insights_dashboard", SCAFFOLDS[5]],
    ["onboarding_companion", "communication_companion"],
    ["guided_success_recommendations", SCAFFOLDS[3]],
    ["adoption_guidance_framework", SCAFFOLDS[4]],
    ["executive_readiness_briefing", SCAFFOLDS[6]],
    ["onboarding_knowledge_libraries", SCAFFOLDS[7]],
    ["guided_success_recommendations_meta", `${SCAFFOLDS[3]}_meta`],
    ["adoption_guidance_framework_meta", `${SCAFFOLDS[4]}_meta`],
    ["executive_readiness_briefing_meta", `${SCAFFOLDS[6]}_meta`],
    ["Adoption Insights Dashboard", "Executive Communication Insights"],
    ["onboarding adoption acceleration within", "organizational communication and announcements within"],
    ["_seed_onboarding_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["auto-configure setup without approval", "auto-broadcast without approval"],
    ["bypass human approval for setup without approval", "bypass human approval for communications without approval"],
    ["Onboarding Companion supports", "Communication Companion supports"],
    ["never auto-configures setup or bypasses human approval", "never auto-broadcasts or bypasses human approval"],
    ["supports — does not auto-configure setup or bypass human approval", "supports — does not auto-broadcast or bypass human approval"],
    [
      "supports adoption guidance, does not auto-configure setup or bypass human approval",
      "supports communication clarity, does not auto-broadcast or bypass human approval",
    ],
    ["onboarding adoption tracking", "organizational communication tracking"],
    ["Human-stewarded onboarding adoption", "Human-stewarded organizational communication"],
    ["Adoption score", "Communication score"],
    ["Adoption maturity level", "Communication maturity level"],
    ["Role-based learning paths", "Leadership broadcast center"],
    ["Setup completion center", "Department communication hub"],
    ["Adoption insights dashboard", "Executive communication insights"],
    ["Guided Success Recommendations", "Announcement Scheduler"],
    ["Adoption Guidance Framework", "Read & Acknowledgement Framework"],
    ["Executive Readiness Briefing", "Digital Headquarters Integration"],
    ["Role-based learning path scaffolds", "Leadership broadcast scaffolds"],
    ["Adoption insight entries", "Communication insight entries"],
    ["humans steward onboarding setup and adoption", "humans steward organizational communication and broadcasts"],
    ["onboarding milestones, role enablement, and adoption signals", "announcements, acknowledgements, and communication signals"],
    ["does NOT auto-configure setup or bypass human approval", "does NOT auto-broadcast or bypass human approval"],
    ["never auto-configures setup without approval", "never auto-broadcasts without approval"],
    ["auto_configuring_setup_without_approval", "auto_broadcasting_without_approval"],
    ["bypassing_human_approval_for_setup", "bypassing_human_approval_for_communications"],
    ["punitive_adoption_enforcement", "punitive_communication_enforcement"],
    ["exposing_sensitive_org_setup_info", "exposing_protected_sensitive_communications"],
    ["replacing_human_onboarding_judgment", "replacing_human_communication_judgment"],
    ["AIPIFY_ONBOARDING_ADOPTION_ACCELERATION_ENGINE", P.docSlug],
    ["confidence_building", "clarity_before_complexity"],
    ["guided_first_wins", "transparency_before_assumptions"],
    ["adoption_milestones", "communication_before_confusion"],
    ["value_realization_checkpoints", "audience_targeting_checkpoints"],
    ["role_specific_enablement", "department_scoped_visibility"],
    ["setup_milestones", "announcement_milestones"],
    ["completion_tracking", "broadcast_preparation"],
    ["sensitive_setup_protection", "protected_communication_safeguards"],
    ["adoption_signals", "acknowledgement_signals"],
    ["enablement_progress", "read_tracking_progress"],
    ["active_onboarding_journeys", "active_announcement_journeys"],
    ["adoption_gaps", "communication_gaps"],
    ["value_before_feature_metrics", "executive_communication_metrics"],
    ["executive_readiness_summaries", "leadership_broadcast_summaries"],
    ["adoption_summaries", "communication_summaries"],
    ["enablement_insights", "acknowledgement_insights"],
    ["onboarding_prompts", "communication_prompts"],
    ["success_recommendations", "broadcast_recommendations"],
    ["org_setup_info_protection", "protected_communication_reminders"],
    ["confidence_before_complexity", "clarity_before_complexity"],
    ["guidance_before_frustration", "transparency_before_assumptions"],
    ["value_before_feature_overload", "communication_before_confusion"],
    ["aipify_onboarding_adoption_acceleration_audit_logs", "aipify_organizational_communication_announcements_audit_logs"],
    ["aipify_onboarding_adoption_acceleration permissions", "aipify_organizational_communication_announcements permissions"],
    ["Metadata-only onboarding scaffolds", "Metadata-only communication scaffolds"],
    ["Sensitive org setup protection", "Protected sensitive communications"],
    ["onboarding adoption acceleration visibility", "organizational communication visibility"],
    ["guided adoption without pressure", "clear communication without pressure"],
    ["adoption summaries and enablement insights", "communication summaries and acknowledgement insights"],
    ["auto-configure setup", "auto-broadcast"],
    ["bypass human approval for setup", "bypass human approval for communications"],
    ["Onboarding Era", "Communication Era"],
    ["ONBOARDING ERA", "COMMUNICATION ERA"],
    ["onboarding era", "communication era"],
    ["215", "217"],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
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
  return transformFrom215(c);
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
  const srcSlug = "aipify-onboarding-adoption-acceleration-engine";
  const src = path.join(ROOT, `lib/aipify/${srcSlug}`);
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom215(fs.readFileSync(path.join(src, f), "utf8")));
  }
  const panel = path.join(ROOT, `components/app/${srcSlug}/AipifyOnboardingAdoptionAccelerationEngineDashboardPanel.tsx`);
  write(
    path.join(ROOT, `components/app/${P.slug}/${engine}DashboardPanel.tsx`),
    transformFrom215(fs.readFileSync(panel, "utf8")),
  );
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${engine}DashboardPanel } from "./${engine}DashboardPanel";\n`);
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom215(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom215(fs.readFileSync(path.join(ROOT, `app/api/aipify/${srcSlug}/${route}/route.ts`), "utf8")),
    );
  }
}

function blueprintSql() {
  const bp = P.bp;
  const raw = `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports communication clarity — NOT auto-broadcasting or bypassing human approval. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Help organizations deliver important information to the right people at the right time via structured communication, leadership broadcasts, and acknowledgement tracking — Communication Companion prepares, humans steward broadcasts.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Innovation Era (${P.eraRange}). Human-stewarded organizational communication; metadata-only scaffolds; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where communication builds clarity, announcements reach the right audiences, acknowledgement supports compliance, and humans retain broadcast authority.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'leadership_broadcast_center', 'label', 'Leadership broadcast center', 'emoji', '📢', 'description', 'Leadership messaging with human approval gates'),
    jsonb_build_object('key', 'department_communication_hub', 'label', 'Department communication hub', 'emoji', '🏢', 'description', 'Department-scoped communication channels'),
    jsonb_build_object('key', 'executive_communication_insights', 'label', 'Executive communication insights', 'emoji', '📈', 'description', 'Communication signals and acknowledgement progress'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not auto-broadcast'),
    jsonb_build_object('key', 'announcement_scheduler', 'label', 'Announcement scheduler', 'emoji', '📅', 'description', 'Scheduled announcements — approval required'),
    jsonb_build_object('key', 'read_acknowledgement', 'label', 'Read & acknowledgement framework', 'emoji', '✔️', 'description', 'Compliance advisory acknowledgement tracking'),
    jsonb_build_object('key', 'communication_libraries', 'label', 'Communication knowledge libraries', 'emoji', '📚', 'description', 'Approved communication resources')
  ); ${D};
create or replace function public._${bp}_communication_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities. Clarity before complexity.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'communication_dashboard', 'label', 'Communication Dashboard — active announcements, broadcast progress, executive visibility'),
    jsonb_build_object('key', 'leadership_broadcast_center', 'label', 'Leadership Broadcast Center — leadership messaging, broadcast preparation'),
    jsonb_build_object('key', 'department_communication_hub', 'label', 'Department Communication Hub — department channels, RBAC-scoped visibility'),
    jsonb_build_object('key', 'announcement_scheduler', 'label', 'Announcement Scheduler — scheduled announcements, human approval gates'),
    jsonb_build_object('key', 'read_acknowledgement_framework', 'label', 'Read & Acknowledgement Framework — acknowledgement tracking, compliance advisory'),
    jsonb_build_object('key', 'executive_communication_insights', 'label', 'Executive Communication Insights — communication signals, read tracking progress'),
    jsonb_build_object('key', 'digital_headquarters_notification_integration', 'label', 'Digital headquarters & notification hub integration — cross-links only'),
    jsonb_build_object('key', 'communication_knowledge_libraries', 'label', 'Communication knowledge libraries — approved communication resources')
  )); ${D};
create or replace function public._${bp}_leadership_broadcast_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Leadership broadcast center — humans steward organizational messaging.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'clarity_before_complexity', 'label', 'Where does clarity need strengthening before complexity?'),
    jsonb_build_object('key', 'transparency_before_assumptions', 'label', 'What transparency gaps should leadership address?'),
    jsonb_build_object('key', 'communication_before_confusion', 'label', 'Which announcements prevent confusion?'),
    jsonb_build_object('key', 'audience_targeting_checkpoints', 'label', 'Where are audience targeting checkpoints due?'),
    jsonb_build_object('key', 'department_scoped_visibility', 'label', 'What department-scoped visibility reduces miscommunication?')
  )); ${D};
create or replace function public._${bp}_department_communication_hub() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Department communication hub — transparency before assumptions.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'announcement_milestones', 'label', 'Announcement milestones'),
    jsonb_build_object('key', 'broadcast_preparation', 'label', 'Broadcast preparation'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates'),
    jsonb_build_object('key', 'protected_communication_safeguards', 'label', 'Protected sensitive communications'),
    jsonb_build_object('key', 'acknowledgement_signals', 'label', 'Acknowledgement signals'),
    jsonb_build_object('key', 'read_tracking_progress', 'label', 'Read tracking progress'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); ${D};
create or replace function public._${bp}_executive_communication_insights() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive communication insights — communication before confusion.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'active_announcement_journeys', 'label', 'Active announcement journeys'),
    jsonb_build_object('key', 'communication_gaps', 'label', 'Communication gaps'),
    jsonb_build_object('key', 'executive_communication_metrics', 'label', 'Executive communication metrics'),
    jsonb_build_object('key', 'acknowledgement_velocity', 'label', 'Acknowledgement velocity'),
    jsonb_build_object('key', 'leadership_broadcast_summaries', 'label', 'Leadership broadcast summaries')
  )); ${D};
create or replace function public._${bp}_communication_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports communication clarity, does not auto-broadcast or bypass human approval.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'communication_summaries', 'label', 'Communication summaries'),
    jsonb_build_object('key', 'acknowledgement_insights', 'label', 'Acknowledgement insights'),
    jsonb_build_object('key', 'broadcast_recommendations', 'label', 'Broadcast recommendations'),
    jsonb_build_object('key', 'communication_prompts', 'label', 'Communication prompts'),
    jsonb_build_object('key', 'readiness_highlights', 'label', 'Readiness highlights'),
    jsonb_build_object('key', 'protected_communication_reminders', 'label', 'Protected sensitive communications — RBAC enforced')
  )); ${D};
create or replace function public._${bp}_announcement_scheduler() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Announcement scheduler — suggest schedules only.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'schedule_suggestions', 'label', 'Schedule suggestions — never auto-broadcast'),
    jsonb_build_object('key', 'clarity_first_messaging', 'label', 'Clarity-first messaging before complexity'),
    jsonb_build_object('key', 'audience_aware_prompts', 'label', 'Audience-aware communication prompts'),
    jsonb_build_object('key', 'approval_checkpoint_reminders', 'label', 'Human approval checkpoint reminders'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no sensitive communication content'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for broadcasts')
  )); ${D};
create or replace function public._${bp}_read_acknowledgement_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Read & acknowledgement framework — transparency before assumptions.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'clarity_before_complexity', 'label', 'Clarity before complexity scaffolds'),
    jsonb_build_object('key', 'transparency_before_assumptions', 'label', 'Transparency before assumptions prompts'),
    jsonb_build_object('key', 'communication_before_confusion', 'label', 'Communication before confusion discipline'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Communication audit trails'),
    jsonb_build_object('key', 'no_auto_broadcast', 'label', 'Never auto-broadcast without approval'),
    jsonb_build_object('key', 'compliance_advisory', 'label', 'Acknowledgement tracking — compliance advisory only')
  )); ${D};
create or replace function public._${bp}_digital_headquarters_notification_integration() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Digital headquarters & notification hub — cross-links only.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'digital_headquarters', 'label', 'Digital Headquarters Phase 203 cross-link', 'cross_link', '/app/aipify-digital-headquarters-engine'),
    jsonb_build_object('key', 'unified_workspace', 'label', 'Unified Workspace Phase 202 cross-link', 'cross_link', '/app/aipify-unified-workspace-engine'),
    jsonb_build_object('key', 'notification_hub', 'label', 'Notification hub — Phase 202 cross-link', 'cross_link', '/app/aipify-unified-workspace-engine'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds — RBAC protected'),
    jsonb_build_object('key', 'communication_stewardship_loops', 'label', 'Communication stewardship loops'),
    jsonb_build_object('key', 'no_auto_broadcast', 'label', 'Never auto-broadcast without approval')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Auto-broadcasting without approval',
      'Bypassing human approval for sensitive communications',
      'Exposing protected sensitive communications to unauthorized roles',
      'Replacing human communication judgment',
      'Punitive communication enforcement',
      'Assuming readership without evidence',
      'Override human judgment'), 'principle', '${P.companion} supports — humans steward organizational communication and broadcasts.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — clarity, patience, and service toward clear communication without pressure.', 'values', jsonb_build_array('clarity_before_complexity','transparency_before_assumptions','communication_before_confusion','patience','service','recognition'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Communication audit logs via aipify_organizational_communication_announcements_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_organizational_communication_announcements permissions — communication RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only communication scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'protected_communications', 'label', 'Protected sensitive communications — RBAC enforced'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 216, 'key', 'enterprise_training_certification', 'label', 'Training & Certification Phase 216', 'route', '/app/aipify-enterprise-training-certification-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 217, 'key', 'organizational_communication_announcements', 'label', 'Communication & Announcements Phase 217', 'route', '/app/${P.slug}', 'description', 'Human-stewarded organizational communication')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'digital_headquarters', 'label', 'Digital Headquarters Phase 203', 'route', '/app/aipify-digital-headquarters-engine', 'relationship', 'Headquarters feed — cross-link only'),
    jsonb_build_object('key', 'unified_workspace', 'label', 'Unified Workspace Phase 202', 'route', '/app/aipify-unified-workspace-engine', 'relationship', 'Notification hub — cross-link only'),
    jsonb_build_object('key', 'enterprise_training', 'label', 'Training & Certification Phase 216', 'route', '/app/aipify-enterprise-training-certification-engine', 'relationship', 'Training communications — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Clarity and patience — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with metadata-only communication scaffolds and human approval gates. Growth Partner terminology. ${P.companion} supports — never auto-broadcasts or bypasses human approval.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans steward organizational communication and broadcasts.', '${P.companion} informs and supports.', 'Clarity before complexity — transparency before assumptions.', 'Growth Partner — never Affiliate.', 'Innovation Era — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — communication summaries and acknowledgement signals max ~500 chars. No protected sensitive communications, PII, or unauthorized broadcast content in audit payloads.'; ${D};
`.trim();
  return raw;
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
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_\w+\(\)->'capabilities'\) = 8,/,
    `jsonb_build_object('key', 'center', 'label', '${P.centerTitle} — eight capabilities', 'met', jsonb_array_length(public._${bp}_communication_dashboard()->'capabilities') = 8,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_\w+\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Leadership broadcast center — five questions', 'met', jsonb_array_length(public._${bp}_leadership_broadcast_center()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'companion', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_\w+\(\)->'capabilities'\) = 6,/,
    `jsonb_build_object('key', 'companion', 'label', '${P.companion} capabilities', 'met', jsonb_array_length(public._${bp}_communication_companion()->'capabilities') = 6,`,
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
    "communication_dashboard",
    "leadership_broadcast_center",
    "department_communication_hub",
    "executive_communication_insights",
    "communication_companion",
    "announcement_scheduler",
    "read_acknowledgement_framework",
    "digital_headquarters_notification_integration",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${bp}_${fn}()`);
  }

  if (!sql.includes("read_acknowledgement_framework_meta")) {
    sql = sql.replace(
      `'sub_engine_meta', public._${bp}_announcement_scheduler(),`,
      `'sub_engine_meta', public._${bp}_announcement_scheduler(), 'read_acknowledgement_framework_meta', public._${bp}_read_acknowledgement_framework(), 'digital_headquarters_notification_integration_meta', public._${bp}_digital_headquarters_notification_integration(),`,
    );
  }

  sql = sql.replace(
    /select 'aipify-organizational-rhythms-operating-cadence-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`Phase ${P.phase} ${P.title} Engine —[^']+`, "g"),
    `Phase ${P.phase} ${P.title} Engine — organizational communication and announcements within Innovation Era; cross-link only for digital headquarters and unified workspace notification hub.`,
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

${P.centerTitle} within ${P.era}. ${P.companion} supports communication clarity — does NOT auto-broadcast or bypass human approval.

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
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never auto-broadcasts.";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/${P.slug}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_COMPANION_LIMITATIONS = [\n${P.companionLimitations.map((l) => `  "${l}",`).join("\n")}\n] as const;\n`,
  );
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports communication summaries, acknowledgement insights, and broadcast recommendations. Supports humans — does NOT auto-broadcast or bypass human approval. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Communication score",
    modeLabel: "Mode",
    readinessLabel: "Communication maturity level",
    executiveReviews: "Executive communication insights",
    activeReflections: "Active leadership broadcast scaffolds",
    humanOversightRequired: `Human oversight required — humans steward organizational communication; ${P.companion} supports only`,
    eraOpenerSummary: `Innovation Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate digital headquarters or unified workspace notification hub RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Leadership broadcast center — communication prompts",
    frameworkLabel: "Department communication hub",
    reviewsLabel: "Executive communication insights",
    companionLabel: `${P.companion} — supports, does not auto-broadcast`,
    subEngineLabel: "Announcement Scheduler",
    reflections: "Leadership broadcast scaffolds",
    executiveReviewEntries: "Communication insight entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT auto-broadcast or bypass human approval`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports communication clarity — humans retain broadcast authority.`,
      philosophy: "People First. Metadata-only communication scaffolds. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
      communicationEra: `${P.era} — Phase ${P.phase}.`,
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
