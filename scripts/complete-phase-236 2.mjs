#!/usr/bin/env node
/** ABOS Phase 236 — Desktop Companion & Creative Bridge Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "desktop_companion_dashboard",
  "application_detection_hub",
  "consent_session_engine",
  "guided_actions_engine",
  "creative_apps_bridge_engine",
  "business_apps_bridge_engine",
  "desktop_governance_dashboard",
  "session_audit_engine",
  "desktop_integration_center",
];

const P = {
  phase: 236,
  migration: "20261397000000_aipify_desktop_companion_creative_bridge_engine_phase236.sql",
  slug: "aipify-desktop-companion-creative-bridge-engine",
  base: "AipifyDesktopCompanionCreativeBridge",
  camel: "aipifyDesktopCompanionCreativeBridgeEngine",
  snake: "aipify_desktop_companion_creative_bridge",
  permPrefix: "aipify_desktop_companion_creative_bridge",
  helper: "adccbe",
  bp: "adccbebp236",
  decisionType: "aipify_desktop_companion_creative_bridge_engine",
  title: "Desktop Companion & Creative Bridge",
  centerTitle: "Desktop Companion",
  companion: "Bridge Companion",
  scoreKey: "aipify_desktop_companion_creative_bridge_score",
  modeKey: "desktop_companion_mode",
  levelKey: "desktop_companion_maturity_level",
  thirdEntity: "desktop_companion_creative_bridge_notes",
  era: "Universal Knowledge Era (234–238)",
  eraRange: "234–238",
  docSlug: "AIPIFY_DESKTOP_COMPANION_CREATIVE_BRIDGE_ENGINE",
  ilmFile: "implementation-blueprint-phase236-aipify-desktop-companion-creative-bridge.txt",
  navLabel: "Desktop",
  crossLinkNote:
    "Cross-links only: Aipify Studio Phase 229, Document Intelligence Phase 230, Executive Cockpit Phase 200, Knowledge Center, Enterprise Notification Engine Phase 233, and Trust Center — never access applications without permission, bypass session consent, or skip application session audit logging.",
  companionLimitations: [
    "accessing_applications_without_permission",
    "bypassing_session_consent",
    "bypassing_desktop_companion_rbac",
    "unlogged_application_sessions",
    "emergency_termination_bypass",
    "replacing_user_control_over_actions",
    "modifying_session_audit_trail",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom235(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyEnterpriseAnalyticsOperationalIntelligence", P.base],
    ["aipify-enterprise-analytics-operational-intelligence-engine", P.slug],
    ["aipify_enterprise_analytics_operational", P.snake],
    ["aipifyEnterpriseAnalyticsOperationalIntelligenceEngine", P.camel],
    ["aeaoiebp235", P.bp],
    ["_aeaoie_", `_${P.helper}_`],
    ["aipify_enterprise_analytics_operational_score", P.scoreKey],
    ["analytics_operational_mode", P.modeKey],
    ["analytics_maturity_level", P.levelKey],
    ["analytics_operational_notes", P.thirdEntity],
    ["AnalyticsOperationalNote", thirdPascal],
    ["analytics_operational_notes_count", `${P.thirdEntity}_count`],
    ["Analytics Phase 235", "__ANALYTICS_PHASE_235__"],
    ["Analytics Center", P.centerTitle],
    ["Analytics Companion", P.companion],
    ["__ANALYTICS_PHASE_235__", "Analytics Phase 235"],
    ["Enterprise Analytics & Operational Intelligence", P.title],
    ["Analytics", P.navLabel],
    ["Phase 235", `Phase ${P.phase}`],
    ["aipify_enterprise_analytics_operational.view", `${P.permPrefix}.view`],
    ["aipify_enterprise_analytics_operational.manage", `${P.permPrefix}.manage`],
    ["aipify_enterprise_analytics_operational.steward", `${P.permPrefix}.steward`],
    ["aipify_enterprise_analytics_operational_intelligence_engine", P.decisionType],
    ["20261396000000_aipify_enterprise_analytics_operational_intelligence_engine_phase235.sql", P.migration],
    ["Repo Phase 235", `Repo Phase ${P.phase}`],
    ["Phase 235 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE235_AIPIFY_ENTERPRISE_ANALYTICS_OPERATIONAL_INTELLIGENCE_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase235", `implementation-blueprint-phase${P.phase}`],
    ["analytics_dashboard", SCAFFOLDS[0]],
    ["executive_analytics_hub", SCAFFOLDS[1]],
    ["kpi_management_engine", SCAFFOLDS[2]],
    ["trend_analysis_engine", SCAFFOLDS[3]],
    ["comparative_reporting_engine", SCAFFOLDS[4]],
    ["scheduled_export_engine", SCAFFOLDS[5]],
    ["analytics_governance_dashboard", SCAFFOLDS[6]],
    ["operational_intelligence_engine", SCAFFOLDS[7]],
    ["analytics_integration_center", SCAFFOLDS[8]],
    ["analytics_companion", "bridge_companion"],
    ["_seed_analytics_operational_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["operational intelligence stewardship", "desktop companion stewardship"],
    ["analytics-informed decision support", "application-bridge decision support"],
    ["insight-first analytics culture", "consent-first desktop culture"],
    ["active custom dashboards", "active application sessions"],
    ["risks requiring attention", "sessions requiring attention"],
    ["Executive Analytics Dashboard", "Application Detection Hub"],
    ["KPI Management Engine", "Consent & Session Engine"],
    ["Trend Analysis Engine", "Guided Actions Engine"],
    ["Comparative Reporting Engine", "Creative Apps Bridge Engine"],
    ["Scheduled Export Engine", "Business Apps Bridge Engine"],
    ["Analytics Governance Dashboard", "Desktop Governance Dashboard"],
    ["operational performance indicators", "application bridge indicators"],
    ["analytics governance prompts", "desktop governance prompts"],
    ["operational intelligence prompts", "desktop companion prompts"],
    ["executive summary reports", "application session summaries"],
    ["anomaly detection signals", "session expiration signals"],
    ["RBAC-protected analytics metrics", "RBAC-protected application policies"],
    ["Insight before assumption", "Consent before access"],
    ["Clarity before complexity", "Transparency before automation"],
    ["Stewardship before speed", "Control before convenience"],
    ["no_bypassing_analytics_rbac", "no_bypassing_desktop_companion_rbac"],
    ["AIPIFY_ENTERPRISE_ANALYTICS_OPERATIONAL_INTELLIGENCE_ENGINE", P.docSlug],
    ["enterprise analytics and operational intelligence", "desktop companion and creative bridge"],
    ["Operational intelligence audit logs", "Desktop companion audit logs"],
    ["analytics visibility RBAC", "application access RBAC"],
    ["operational intelligence scaffolds", "desktop companion scaffolds"],
    ["role-aware analytics visibility", "organization application policies"],
    ["Operational intelligence score", "Desktop companion score"],
    ["Analytics maturity level", "Desktop companion maturity level"],
    ["Historical performance tracking entries", "Application session audit entries"],
    ["Operational intelligence", "Desktop companion"],
    ["operational intelligence", "desktop companion"],
    ["leadership decision stewardship", "user action control stewardship"],
    ["sensitive metrics beyond RBAC", "application access beyond consent"],
    ["cross-functional analytics", "cross-application guided actions"],
    ["executive analytics reviews", "session audit reviews"],
    [
      "Executive Cockpit Phase 200, Action Center, Customer Success Center, Workflow Automation Phase 231, Learning Center, Trust Center, Communication Center, Enterprise Search Engine Phase 234, and future Aipify modules",
      "Aipify Studio Phase 229, Document Intelligence Phase 230, Executive Cockpit Phase 200, Knowledge Center, Enterprise Notification Engine Phase 233, and Trust Center",
    ],
    [
      "Executive Cockpit, Action Center, Customer Success Center, Workflow Automation Phase 231, Learning Center, Trust Center, Communication Center, Enterprise Search Engine Phase 234, and future Aipify modules",
      "Aipify Studio, Document Intelligence, Executive Cockpit, Knowledge Center, Enterprise Notification Engine Phase 233, and Trust Center",
    ],
    [
      "Never bypass analytics RBAC or expose sensitive metrics without authorization",
      "Never access applications without permission or bypass session consent",
    ],
    ["analytics insights", "application sessions"],
    ["Analytics insights", "Application sessions"],
    ["confidential metrics routing", "confidential application session routing"],
    ["exposes sensitive metrics without RBAC", "accesses applications without user consent"],
    ["Unauthorized exposure of protected analytics metrics", "Unauthorized application access without explicit approval"],
    ["Modifying analytics audit trails", "Modifying session audit trails"],
    ["Assumption before insight", "Automation before transparency"],
    ["human leadership judgment", "user control over actions"],
    ["Human leadership judgment", "User control over actions"],
    ["leadership decisions and operational accountability", "application access decisions and user control accountability"],
    ["analytics visibility", "application session visibility"],
    ["analytics governance", "desktop companion governance"],
    [
      "provide organizations with actionable insights through unified analytics, enabling leaders to monitor performance, identify trends and make data-informed decisions — maintaining RBAC, sensitive metric protection, and full audit logging",
      "enable Aipify to securely collaborate with approved desktop applications already installed on the user's computer — maintaining explicit consent, session expiration, organization policies, and complete audit history",
    ],
    [
      "executive decision-making improves, analytics adoption increases, trends are identified faster, operational performance improves, and reporting effort decreases with insight before assumption",
      "time in professional software decreases, employee productivity increases, Aipify adoption grows, creative professionals benefit, and friction between Aipify and existing tools reduces with consent before access",
    ],
    ["Analytics Phase 236", "Analytics Phase 235"],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports desktop application collaboration — NOT accessing applications without permission, bypassing session consent, or skipping application session audit logging. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Enable Aipify to securely collaborate with approved desktop applications already installed on the user device, transforming Aipify into a true business companion — ${P.companion} prepares, humans decide.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Universal Knowledge Era (${P.eraRange}). Human-stewarded application access; RBAC-protected desktop companion scaffolds; application sessions logged; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations reduce time in professional software, increase productivity, grow Aipify adoption among creative professionals, and bridge Aipify with existing tools with consent before access.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Ten desktop companion modules with governance'),
    jsonb_build_object('key', 'application_detection_hub', 'label', 'Application detection hub', 'emoji', '🔍', 'description', 'Detect approved installed applications'),
    jsonb_build_object('key', 'consent_session_engine', 'label', 'Consent and session engine', 'emoji', '🔐', 'description', 'Allow Once, Always Allow, Decline flows'),
    jsonb_build_object('key', 'guided_actions_engine', 'label', 'Guided actions engine', 'emoji', '🎯', 'description', 'Perform guided actions through Aipify'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not replace user control over actions'),
    jsonb_build_object('key', 'creative_apps_bridge_engine', 'label', 'Creative apps bridge', 'emoji', '🎨', 'description', 'Adobe, Canva, Blender, Figma Desktop'),
    jsonb_build_object('key', 'desktop_governance_dashboard', 'label', 'Desktop governance dashboard', 'emoji', '🛡️', 'description', 'Organization application policies and audit'),
    jsonb_build_object('key', 'supported_applications', 'label', 'Supported applications catalog', 'emoji', '💻', 'description', 'Creative and business application bridges')
  ); ${D};
create or replace function public._${bp}_desktop_companion_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — ten capabilities. Consent before access.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'desktop_companion_dashboard', 'label', 'Desktop Companion Dashboard — active sessions and applications requiring attention'),
    jsonb_build_object('key', 'application_detection_hub', 'label', 'Detect Approved Installed Applications'),
    jsonb_build_object('key', 'user_consent', 'label', 'Request User Consent Before Access — Allow Once, Always Allow, Decline'),
    jsonb_build_object('key', 'launch_applications', 'label', 'Launch Supported Applications — governed by policy'),
    jsonb_build_object('key', 'in_app_assistance', 'label', 'Assist Users Within Approved Applications'),
    jsonb_build_object('key', 'guided_actions', 'label', 'Perform Guided Actions Through Aipify'),
    jsonb_build_object('key', 'session_permissions', 'label', 'Temporary Session & Persistent Access Controls'),
    jsonb_build_object('key', 'creative_bridge', 'label', 'Creative Application Bridge — Photoshop, Illustrator, Lightroom, and more'),
    jsonb_build_object('key', 'business_bridge', 'label', 'Business Application Bridge — Word, Excel, PowerPoint, Outlook, Teams'),
    jsonb_build_object('key', 'audit_governance', 'label', 'Complete Audit History & Organization Application Policies')
  )); ${D};
create or replace function public._${bp}_application_detection_hub() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Application detection — transparency before automation.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'approved_app', 'label', 'Is this an organization-approved application?'),
    jsonb_build_object('key', 'user_consent', 'label', 'Has the user granted explicit consent for this session?'),
    jsonb_build_object('key', 'session_scope', 'label', 'Is the access scope limited to the current task?'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Is this application session recorded in the audit trail?'),
    jsonb_build_object('key', 'governance', 'label', 'How does governance ensure users understand what Aipify is requesting?')
  )); ${D};
create or replace function public._${bp}_consent_session_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Consent and session — control before convenience.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'allow_once', 'label', 'Allow Once — session valid for current task only'),
    jsonb_build_object('key', 'always_allow', 'label', 'Always Allow — requires explicit user approval'),
    jsonb_build_object('key', 'decline', 'label', 'Decline — no application access'),
    jsonb_build_object('key', 'session_expiration', 'label', 'Session expiration enforced'),
    jsonb_build_object('key', 'emergency_termination', 'label', 'Emergency session termination available'),
    jsonb_build_object('key', 'organization_policy', 'label', 'Organization access controlled through enterprise policies'),
    jsonb_build_object('key', 'access_visible', 'label', 'Access requests visible to users'),
    jsonb_build_object('key', 'disable_integrations', 'label', 'Organizations may disable application integrations entirely'),
    jsonb_build_object('key', 'user_final_control', 'label', 'Users retain final control over all actions')
  )); ${D};
create or replace function public._${bp}_session_audit_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Session audit — complete history required.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'photoshop_granted', 'label', 'Photoshop access granted — audit event'),
    jsonb_build_object('key', 'lightroom_started', 'label', 'Lightroom session started — audit event'),
    jsonb_build_object('key', 'word_generated', 'label', 'Word document generated — audit event'),
    jsonb_build_object('key', 'illustrator_terminated', 'label', 'Illustrator session terminated — audit event'),
    jsonb_build_object('key', 'access_revoked', 'label', 'Desktop Companion access revoked — audit event'),
    jsonb_build_object('key', 'session_expired', 'label', 'Session expired — audit event')
  )); ${D};
create or replace function public._${bp}_bridge_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports in-application guidance and never accesses applications without permission.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'application_session_summaries', 'label', 'Application session summaries'),
    jsonb_build_object('key', 'detection_guidance', 'label', 'Approved application detection guidance'),
    jsonb_build_object('key', 'consent_guidance', 'label', 'Consent flow guidance — Allow Once, Always Allow, Decline'),
    jsonb_build_object('key', 'desktop_companion_prompts', 'label', 'Desktop companion prompts'),
    jsonb_build_object('key', 'guided_action_highlights', 'label', 'Guided action highlights within approved apps'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Application access RBAC — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_guided_actions_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Guided actions — user retains final control.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'launch_apps', 'label', 'Launch supported applications with consent'),
    jsonb_build_object('key', 'in_app_assist', 'label', 'Assist users within approved applications'),
    jsonb_build_object('key', 'guided_workflows', 'label', 'Perform guided actions through Aipify'),
    jsonb_build_object('key', 'temporary_sessions', 'label', 'Temporary session-based permissions'),
    jsonb_build_object('key', 'persistent_access', 'label', 'Persistent access requires explicit approval'),
    jsonb_build_object('key', 'approval_gates', 'label', 'Human approval gates for sensitive guided actions')
  )); ${D};
create or replace function public._${bp}_creative_apps_bridge_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Creative apps bridge — Adobe, Canva, Blender, Figma.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'photoshop', 'label', 'Photoshop — background removal, cleanup, layers, export'),
    jsonb_build_object('key', 'illustrator', 'label', 'Illustrator — icons, SVG, design assistance, export'),
    jsonb_build_object('key', 'lightroom', 'label', 'Lightroom — exposure, batch processing, enhancement, export'),
    jsonb_build_object('key', 'premiere_indesign', 'label', 'Premiere Pro and InDesign — governed assistance'),
    jsonb_build_object('key', 'canva_blender_figma', 'label', 'Canva Desktop, Blender, Figma Desktop'),
    jsonb_build_object('key', 'consent_required', 'label', 'Every session requires explicit approval')
  )); ${D};
create or replace function public._${bp}_business_apps_bridge_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Business apps bridge — Microsoft Office and Teams.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'word', 'label', 'Word — reports, formatting, executive summaries'),
    jsonb_build_object('key', 'excel', 'label', 'Excel — governed spreadsheet assistance'),
    jsonb_build_object('key', 'powerpoint', 'label', 'PowerPoint — presentations, slide refinement, visual consistency'),
    jsonb_build_object('key', 'outlook', 'label', 'Outlook — governed email assistance'),
    jsonb_build_object('key', 'teams', 'label', 'Teams — governed collaboration assistance'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Session audit visibility respects role permissions')
  )); ${D};
create or replace function public._${bp}_desktop_governance_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Desktop governance — organizations control approved applications.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'org_policies', 'label', 'Organization application policies'),
    jsonb_build_object('key', 'approved_apps', 'label', 'Control approved applications list'),
    jsonb_build_object('key', 'disable_integrations', 'label', 'Disable application integrations entirely'),
    jsonb_build_object('key', 'audit_history', 'label', 'Complete audit history — immutable log'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Manager, Employee tiers'),
    jsonb_build_object('key', 'emergency_termination', 'label', 'Emergency session termination capability')
  )); ${D};
create or replace function public._${bp}_desktop_integration_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Desktop integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'aipify_studio', 'label', 'Aipify Studio Phase 229', 'cross_link', '/app/aipify-studio-creative-intelligence-engine'),
    jsonb_build_object('key', 'document_intelligence', 'label', 'Document Intelligence Phase 230', 'cross_link', '/app/aipify-document-intelligence-enterprise-document-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'cross_link', '/app/knowledge-center'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'trust_center', 'label', 'Trust Center', 'cross_link', '/platform/trust'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for application policy changes')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Accessing applications without permission',
      'Bypassing session consent',
      'Bypassing desktop companion RBAC',
      'Unlogged application sessions',
      'Emergency termination bypass',
      'Replacing user control over actions',
      'Modifying session audit trails',
      'Override human judgment'), 'principle', '${P.companion} supports — users retain final control over all application access and actions.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm desktop support without tool pressure.', 'values', jsonb_build_array('consent_before_access','transparency_before_automation','control_before_convenience','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Desktop companion audit logs via aipify_desktop_companion_creative_bridge_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_desktop_companion_creative_bridge permissions — application access RBAC'),
    jsonb_build_object('key', 'session_recording', 'label', 'All application sessions must be recorded'),
    jsonb_build_object('key', 'access_visible', 'label', 'Access requests must be visible to users'),
    jsonb_build_object('key', 'session_expiration', 'label', 'Session expiration must be enforced'),
    jsonb_build_object('key', 'emergency_termination', 'label', 'Emergency session termination must be available'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 235, 'key', 'enterprise_analytics_operational_intelligence', 'label', 'Analytics Phase 235', 'route', '/app/aipify-enterprise-analytics-operational-intelligence-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 236, 'key', 'desktop_companion_creative_bridge', 'label', 'Desktop Phase 236', 'route', '/app/${P.slug}', 'description', 'Human-stewarded desktop companion and creative bridge')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'aipify_studio', 'label', 'Aipify Studio Phase 229', 'route', '/app/aipify-studio-creative-intelligence-engine', 'relationship', 'Aipify Studio integration — cross-link only'),
    jsonb_build_object('key', 'document_intelligence', 'label', 'Document Intelligence Phase 230', 'route', '/app/aipify-document-intelligence-enterprise-document-engine', 'relationship', 'Document Intelligence integration — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive Cockpit integration — cross-link only'),
    jsonb_build_object('key', 'trust_center', 'label', 'Trust Center', 'route', '/platform/trust', 'relationship', 'Trust Center integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Consent before access — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with RBAC-protected application policies and explicit session consent. Growth Partner terminology. ${P.companion} supports — never accesses applications without permission or bypasses session consent.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — users retain final control over all application access and actions.', '${P.companion} informs and supports.', 'Consent before access — control before convenience.', 'Growth Partner — never Affiliate.', 'Universal Knowledge Era — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — application session signals max ~500 chars. No application content beyond consent scope or PII in audit logs.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_enterprise_analytics_operational_intelligence_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._aeaoiebp235_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_application_detection_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Application detection hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_application_detection_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_executive_analytics_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Application detection hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_application_detection_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_desktop_companion_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Desktop Companion — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_desktop_companion_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_analytics_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Desktop Companion — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_desktop_companion_dashboard()->'capabilities') = 10,`,
  );

  for (const fn of [
    "desktop_companion_dashboard",
    "application_detection_hub",
    "consent_session_engine",
    "session_audit_engine",
    "bridge_companion",
    "guided_actions_engine",
    "creative_apps_bridge_engine",
    "business_apps_bridge_engine",
    "desktop_governance_dashboard",
    "desktop_integration_center",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${P.bp}_${fn}()`);
  }

  sql = sql.replace(
    /select 'aipify-enterprise-analytics-operational-intelligence-engine'[^;]+;/g,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected enterprise analytics and operational intelligence guidance within Universal Knowledge Era;",
    "RBAC-protected desktop companion and creative bridge guidance within Universal Knowledge Era;",
  );
  sql = sql.replace(
    /Phase 236 Enterprise Analytics[^']+Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /select 'aipify-desktop-companion-creative-bridge-engine', 'Desktop Companion & Creative Bridge Engine', 'Desktop Companion — Universal Knowledge Era \(234–238\)\. People First\.', 'authenticated', 235/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}`,
  );

  return sql;
}

function genMigration() {
  const src235 = path.join(ROOT, "supabase/migrations/20261396000000_aipify_enterprise_analytics_operational_intelligence_engine_phase235.sql");
  if (!fs.existsSync(src235)) throw new Error("Phase 235 migration required");
  let m = transformFrom235(fs.readFileSync(src235, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-enterprise-analytics-operational-intelligence-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(path.join(ROOT, `lib/core/${P.slug}.ts`), transformFrom235(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")));
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom235(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")));
  }
  const panel = path.join(ROOT, `components/app/${srcSlug}/AipifyEnterpriseAnalyticsOperationalIntelligenceEngineDashboardPanel.tsx`);
  write(
    path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`),
    transformFrom235(fs.readFileSync(panel, "utf8")),
  );
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`);
  write(path.join(ROOT, `app/app/${P.slug}/page.tsx`), transformFrom235(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")));
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom235(fs.readFileSync(path.join(ROOT, `app/api/aipify/${srcSlug}/${route}/route.ts`), "utf8")),
    );
  }
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports desktop application collaboration — does NOT access applications without permission, bypass session consent, or skip application session audit logging.

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

## What is the Desktop Companion & Creative Bridge Engine?

The Desktop Companion & Creative Bridge Engine enables Aipify to securely collaborate with approved desktop applications at \`/app/${P.slug}\`.

## What desktop companion features are included?

Detect approved installed applications, request user consent, launch supported applications, assist within approved apps, perform guided actions, temporary session permissions, complete audit history, and organization application policies.

## What creative applications are supported?

Adobe Photoshop, Illustrator, Lightroom, Premiere Pro, InDesign, Canva Desktop, Blender, and Figma Desktop — all require explicit consent.

## What business applications are supported?

Microsoft Word, Excel, PowerPoint, Outlook, and Teams — all governed by organization policies.

## How does the consent workflow work?

Aipify detects an approved application and requests consent with Allow Once (current task only), Always Allow (explicit approval), or Decline — users must understand exactly what is requested.

## What application capabilities are available?

Photoshop background removal and cleanup, Illustrator icon creation, Lightroom exposure adjustments, Word report generation, PowerPoint presentation generation, and more — users retain final control.

## Who can manage desktop companion policies?

Super Admin (full configuration), Tenant Admin (organization policies), Managers (department approvals), and Employees (request approved assistance) — all governed by enterprise RBAC.

## Are application sessions audited?

**Yes.** All application sessions must be recorded including access granted, sessions started, documents generated, sessions terminated, access revoked, and session expired events.

## How does this integrate with other Aipify surfaces?

Cross-link only: Aipify Studio Phase 229, Document Intelligence Phase 230, Executive Cockpit Phase 200, Knowledge Center, Enterprise Notification Engine Phase 233, Trust Center — never duplicate their RPCs.

## Does the Bridge Companion replace user control?

**No.** ${P.companion} prepares in-application guidance — it does **NOT** access applications without permission or bypass session consent.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Desktop Companion: application detection, consent flows, launch apps, in-app assistance, guided actions, creative bridge, business bridge, governance, session audit, integration center.
Creative: Photoshop, Illustrator, Lightroom, Premiere Pro, InDesign, Canva Desktop, Blender, Figma Desktop.
Business: Word, Excel, PowerPoint, Outlook, Teams.
Consent: Allow Once, Always Allow, Decline — session and persistent access controls.
Audit: access granted, session started, document generated, session terminated, access revoked, session expired.
Safety: never access without permission, session expiration, emergency termination, org may disable integrations.
Design principles: Consent before access, transparency before automation, control before convenience.
Companion limitations: no accessing apps without permission, no bypassing session consent, no unlogged sessions.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never accesses applications without permission, bypasses session consent, or skips application session audit logging.";
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
    c = c.replace('| "aipifyEnterpriseAnalyticsOperationalIntelligenceEngine"', `| "aipifyEnterpriseAnalyticsOperationalIntelligenceEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    const anchor = /id: "aipifyEnterpriseAnalyticsOperationalIntelligenceEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyEnterpriseAnalyticsOperationalIntelligenceEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-enterprise-analytics-operational-intelligence-engine")) {\n    return "aipifyEnterpriseAnalyticsOperationalIntelligenceEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-enterprise-analytics-operational-intelligence-engine")) {\n    return "aipifyEnterpriseAnalyticsOperationalIntelligenceEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_enterprise_analytics_operational.steward",', `"aipify_enterprise_analytics_operational.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-enterprise-analytics-operational-intelligence-engine";',
      `export * from "./aipify-enterprise-analytics-operational-intelligence-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports approved application detection, consent flows, creative and business app bridges, and governed guided actions. Supports users — does NOT access applications without permission. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Desktop companion score",
    modeLabel: "Mode",
    readinessLabel: "Desktop companion maturity level",
    executiveReviews: "Session audit reviews",
    activeReflections: "Active desktop companion scaffolds",
    humanOversightRequired: `Human oversight required — users retain final control over actions; ${P.companion} supports only`,
    eraOpenerSummary: `Universal Knowledge Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate Aipify Studio, Document Intelligence, Executive Cockpit, Knowledge Center, Enterprise Notification Engine, or Trust Center RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Application detection hub — governance prompts",
    frameworkLabel: "Consent and session engine",
    reviewsLabel: "Desktop governance dashboard",
    companionLabel: `${P.companion} — supports in-app guidance, never replaces user control`,
    subEngineLabel: "Guided actions engine",
    reflections: "Desktop companion scaffolds",
    executiveReviewEntries: "Application session audit entries",
    scaffoldNotes: "RBAC-protected desktop companion scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT access applications without permission, bypass session consent, or skip session audit logging`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports application session visibility — users retain final control over all actions.`,
      philosophy: "People First. RBAC-protected desktop companion scaffolds. Growth Partner terminology — never Affiliate.",
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
        ? "Skrivebord"
        : locale === "sv"
          ? "Skrivbord"
          : locale === "da"
            ? "Skrivebord"
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
      'export * from "./implementation-blueprint-phase235-vocabulary";',
      `export * from "./implementation-blueprint-phase235-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE235_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase235-aipify-enterprise-analytics-operational-intelligence.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE235_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase235-aipify-enterprise-analytics-operational-intelligence.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_enterprise_analytics_operational.view`, `aipify_enterprise_analytics_operational.manage`, `aipify_enterprise_analytics_operational.steward`.";
  const entry = `\n**Desktop Companion & Creative Bridge Engine (Phase 236):** See [AIPIFY_DESKTOP_COMPANION_CREATIVE_BRIDGE_ENGINE_PHASE236.md](./AIPIFY_DESKTOP_COMPANION_CREATIVE_BRIDGE_ENGINE_PHASE236.md) — Desktop Companion for application detection, consent flows, launch and in-app assistance, guided actions, creative and business app bridges, session permissions, audit history, organization policies, and integration center. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** accessing applications without permission, bypassing session consent, or skipping session audit logging. Cross-links only: Aipify Studio Phase 229, Document Intelligence Phase 230, Executive Cockpit Phase 200, Knowledge Center, Enterprise Notification Engine Phase 233, Trust Center. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 236")) {
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
