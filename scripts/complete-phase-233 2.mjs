#!/usr/bin/env node
/** ABOS Phase 233 — Enterprise Notification & Attention Management Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "notification_dashboard",
  "notification_center_hub",
  "priority_routing_engine",
  "grouping_digest_engine",
  "escalation_notification_engine",
  "channel_delivery_engine",
  "preference_management_engine",
  "notification_governance_dashboard",
  "notification_integration_center",
];

const P = {
  phase: 233,
  migration: "20261394000000_aipify_enterprise_notification_attention_management_engine_phase233.sql",
  slug: "aipify-enterprise-notification-attention-management-engine",
  base: "AipifyEnterpriseNotificationAttentionManagement",
  camel: "aipifyEnterpriseNotificationAttentionManagementEngine",
  snake: "aipify_enterprise_notification_attention",
  permPrefix: "aipify_enterprise_notification_attention",
  helper: "aename",
  bp: "aenamebp233",
  decisionType: "aipify_enterprise_notification_attention_management_engine",
  title: "Enterprise Notification & Attention Management",
  centerTitle: "Notification Center",
  companion: "Notification Companion",
  scoreKey: "aipify_enterprise_notification_attention_score",
  modeKey: "notification_attention_mode",
  levelKey: "notification_maturity_level",
  thirdEntity: "notification_attention_notes",
  era: "Creative Intelligence Era (229–233)",
  eraRange: "229–233",
  docSlug: "AIPIFY_ENTERPRISE_NOTIFICATION_ATTENTION_MANAGEMENT_ENGINE",
  ilmFile: "implementation-blueprint-phase233-aipify-enterprise-notification-attention-management.txt",
  navLabel: "Notifications",
  crossLinkNote:
    "Cross-links only: Executive Cockpit Phase 200, Action Center, Workflow Automation Phase 231, Communication Center, Trust Center, Risk Center, Customer Success Center, and Meeting Intelligence Engine — never bypass notification RBAC, disable security notifications without authorization, or suppress critical alerts.",
  companionLimitations: [
    "bypassing_notification_rbac",
    "disabling_security_notifications_unauthorized",
    "suppressing_critical_alerts",
    "unlogged_notification_policy_changes",
    "replacing_human_attention_stewardship",
    "modifying_notification_audit_trail",
    "notification_spam_without_governance",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom232(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyEnterpriseIntegrationHub", P.base],
    ["aipify-enterprise-integration-hub-engine", P.slug],
    ["aipify_enterprise_integration_hub", P.snake],
    ["aipifyEnterpriseIntegrationHubEngine", P.camel],
    ["aeihebp232", P.bp],
    ["_aeihe_", `_${P.helper}_`],
    ["aipify_enterprise_integration_hub_score", P.scoreKey],
    ["integration_hub_mode", P.modeKey],
    ["integration_maturity_level", P.levelKey],
    ["integration_hub_notes", P.thirdEntity],
    ["IntegrationHubNote", thirdPascal],
    ["integration_hub_notes_count", `${P.thirdEntity}_count`],
    ["Integrations Phase 232", "__INTEGRATIONS_PHASE_232__"],
    ["Integration Hub", P.centerTitle],
    ["Integration Companion", P.companion],
    ["__INTEGRATIONS_PHASE_232__", "Integrations Phase 232"],
    ["Enterprise Integration Hub", P.title],
    ["Integrations", P.navLabel],
    ["Phase 232", `Phase ${P.phase}`],
    ["aipify_enterprise_integration_hub.view", `${P.permPrefix}.view`],
    ["aipify_enterprise_integration_hub.manage", `${P.permPrefix}.manage`],
    ["aipify_enterprise_integration_hub.steward", `${P.permPrefix}.steward`],
    ["aipify_enterprise_integration_hub_engine", P.decisionType],
    ["20261393000000_aipify_enterprise_integration_hub_engine_phase232.sql", P.migration],
    ["Repo Phase 232", `Repo Phase ${P.phase}`],
    ["Phase 232 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE232_AIPIFY_ENTERPRISE_INTEGRATION_HUB_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase232", `implementation-blueprint-phase${P.phase}`],
    ["integration_dashboard", SCAFFOLDS[0]],
    ["integration_marketplace_center", SCAFFOLDS[1]],
    ["connection_management_center", SCAFFOLDS[2]],
    ["webhook_management_engine", SCAFFOLDS[3]],
    ["health_monitoring_engine", SCAFFOLDS[4]],
    ["usage_analytics_engine", SCAFFOLDS[5]],
    ["integration_governance_dashboard", SCAFFOLDS[6]],
    ["integration_template_center", SCAFFOLDS[7]],
    ["integration_hub_center", SCAFFOLDS[8]],
    ["integration_companion", "notification_companion"],
    ["_seed_integration_hub_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["integration hub stewardship", "notification attention stewardship"],
    ["integration-informed decision support", "attention-informed decision support"],
    ["security-first integration culture", "clarity-first notification culture"],
    ["active integrations", "active notifications"],
    ["integrations requiring attention", "notifications requiring attention"],
    ["Integration Marketplace", "Central Notification Center"],
    ["Connection Management Center", "Priority Routing Engine"],
    ["Webhook Management Engine", "Grouping & Digest Engine"],
    ["Health Monitoring Engine", "Escalation Notification Engine"],
    ["Usage Analytics Engine", "Channel Delivery Engine"],
    ["Integration Governance Dashboard", "Preference Management Engine"],
    ["integration health indicators", "notification engagement indicators"],
    ["integration governance prompts", "notification governance prompts"],
    ["integration hub prompts", "notification attention prompts"],
    ["integration connection summaries", "notification delivery summaries"],
    ["failed synchronization alerts", "escalation notification signals"],
    ["encrypted integration credentials", "protected notification policies"],
    ["Security before convenience", "Clarity before noise"],
    ["Interoperability before isolation", "Relevance before volume"],
    ["Stewardship before speed", "Focus before interruption"],
    ["no_bypassing_integration_rbac", "no_bypassing_notification_rbac"],
    ["AIPIFY_ENTERPRISE_INTEGRATION_HUB_ENGINE", P.docSlug],
    ["enterprise integration hub", "enterprise notification and attention management"],
    ["Integration hub audit logs", "Notification attention audit logs"],
    ["integration access RBAC", "notification delivery RBAC"],
    ["integration hub scaffolds", "notification attention scaffolds"],
    ["configurable integration approval workflows", "role-based notification rules"],
    ["Integration hub score", "Notification attention score"],
    ["Integration maturity level", "Notification maturity level"],
    ["Integration audit history entries", "Notification delivery history entries"],
    ["Integration hub", "Notification attention"],
    ["integration hub", "notification attention"],
    ["integration approval stewardship", "notification preference stewardship"],
    ["integration credentials beyond RBAC", "sensitive notifications beyond RBAC"],
    ["cross-module integration actions", "cross-module notification delivery"],
    ["integration health reviews", "notification response reviews"],
    [
      "Action Center, Executive Cockpit Phase 200, Workflow Automation Phase 231, Trust Center, Customer Success Center, Document Intelligence Phase 230, and future Aipify modules",
      "Executive Cockpit Phase 200, Action Center, Workflow Automation Phase 231, Communication Center, Trust Center, Risk Center, Customer Success Center, and Meeting Intelligence Engine",
    ],
    [
      "Action Center, Executive Cockpit, Workflow Automation Phase 231, Trust Center, Customer Success Center, Document Intelligence Phase 230, and future Aipify modules",
      "Executive Cockpit, Action Center, Workflow Automation Phase 231, Communication Center, Trust Center, Risk Center, Customer Success Center, and Meeting Intelligence Engine",
    ],
    [
      "Never bypass integration RBAC or skip integration approval workflows",
      "Never bypass notification RBAC or disable security notifications without authorization",
    ],
    ["integration connections", "notification deliveries"],
    ["Integration connections", "Notification deliveries"],
    ["confidential integration approval", "confidential notification routing"],
    ["exposes credentials without encryption or approval", "suppresses critical alerts without authorization"],
    ["Unencrypted credential exposure without human approval", "Unauthorized suppression of critical security notifications"],
    ["Modifying integration audit trails", "Modifying notification audit trails"],
    ["Convenience before security", "Volume before relevance"],
    ["human integration stewardship", "human attention stewardship"],
    ["Human integration stewardship", "Human attention stewardship"],
    ["integration decisions and interoperability accountability", "attention decisions and communication accountability"],
    ["integration connection visibility", "notification delivery visibility"],
    ["integration governance", "notification governance"],
    [
      "securely connect Aipify with internal systems, third-party services and external business platforms through a centralized integration framework — maintaining encrypted credentials, RBAC, approval workflows, and full audit logging",
      "ensure the right people receive the right information at the right time without creating unnecessary noise or notification fatigue — maintaining RBAC, delivery history, and full audit logging",
    ],
    [
      "integration adoption increases, manual synchronization decreases, system interoperability improves, and organizations deploy integrations with security before convenience",
      "notification fatigue decreases, response times improve, action completion rates increase, and organizations deliver alerts with clarity before noise",
    ],
    ["Integrations Phase 233", "Integrations Phase 232"],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports notification delivery — NOT bypassing notification RBAC, disabling security notifications without authorization, or suppressing critical alerts. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Ensure the right people receive the right information at the right time without creating unnecessary noise or notification fatigue — ${P.companion} prepares, humans decide.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Creative Intelligence Era (${P.eraRange}). Human-stewarded notification governance; RBAC-protected notification scaffolds; notification policy changes logged; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations reduce notification fatigue, improve response times, increase action completion rates, and deliver alerts with clarity before noise.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Ten notification modules with governance'),
    jsonb_build_object('key', 'notification_center_hub', 'label', 'Central notification center', 'emoji', '🔔', 'description', 'Unified inbox with read/unread tracking'),
    jsonb_build_object('key', 'priority_routing_engine', 'label', 'Priority routing engine', 'emoji', '⚡', 'description', 'Priority-based and role-based notification rules'),
    jsonb_build_object('key', 'grouping_digest_engine', 'label', 'Grouping and digest engine', 'emoji', '📦', 'description', 'Smart grouping and daily/weekly digests'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not replace human attention stewardship'),
    jsonb_build_object('key', 'channel_delivery_engine', 'label', 'Channel delivery engine', 'emoji', '📡', 'description', 'In-app, desktop, email, and mobile channels'),
    jsonb_build_object('key', 'notification_governance_dashboard', 'label', 'Notification governance dashboard', 'emoji', '🛡️', 'description', 'Policies, analytics, and delivery history'),
    jsonb_build_object('key', 'notification_types', 'label', 'Notification types catalog', 'emoji', '📋', 'description', 'Critical alerts, approvals, briefings, and more')
  ); ${D};
create or replace function public._${bp}_notification_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — ten capabilities. Clarity before noise.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'notification_dashboard', 'label', 'Notification Dashboard — active notifications requiring attention'),
    jsonb_build_object('key', 'notification_center_hub', 'label', 'Central Notification Center — unified inbox'),
    jsonb_build_object('key', 'priority_notifications', 'label', 'Priority-Based Notifications — critical to routine tiers'),
    jsonb_build_object('key', 'smart_grouping', 'label', 'Smart Notification Grouping — combine related alerts'),
    jsonb_build_object('key', 'role_based_rules', 'label', 'Role-Based Notification Rules — RBAC enforced'),
    jsonb_build_object('key', 'escalation_notifications', 'label', 'Escalation Notifications — governed escalation paths'),
    jsonb_build_object('key', 'digest_notifications', 'label', 'Digest Notifications — daily and weekly summaries'),
    jsonb_build_object('key', 'realtime_scheduled', 'label', 'Real-Time & Scheduled Notifications'),
    jsonb_build_object('key', 'preferences_sync', 'label', 'Preferences Management & Cross-Device Synchronization'),
    jsonb_build_object('key', 'tracking_analytics', 'label', 'Read/Unread Tracking & Notification Analytics')
  )); ${D};
create or replace function public._${bp}_notification_center_hub() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Central notification center — clarity before noise.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'right_person', 'label', 'Is the right person receiving this notification?'),
    jsonb_build_object('key', 'right_information', 'label', 'Does the notification contain the right information?'),
    jsonb_build_object('key', 'right_time', 'label', 'Is this the right time to deliver this alert?'),
    jsonb_build_object('key', 'rbac_access', 'label', 'Does notification delivery follow role-based permissions?'),
    jsonb_build_object('key', 'governance', 'label', 'How does governance reduce notification fatigue?')
  )); ${D};
create or replace function public._${bp}_priority_routing_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Priority routing — relevance before volume.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'critical_alerts', 'label', 'Critical alerts — cannot be suppressed without authorization'),
    jsonb_build_object('key', 'executive_briefings', 'label', 'Executive briefings'),
    jsonb_build_object('key', 'approval_requests', 'label', 'Approval requests'),
    jsonb_build_object('key', 'workflow_updates', 'label', 'Workflow updates'),
    jsonb_build_object('key', 'security_events', 'label', 'Security events — RBAC protected'),
    jsonb_build_object('key', 'trust_center_alerts', 'label', 'Trust Center alerts'),
    jsonb_build_object('key', 'integration_failures', 'label', 'Integration failure alerts'),
    jsonb_build_object('key', 'organization_announcements', 'label', 'Organization announcements'),
    jsonb_build_object('key', 'custom_routing', 'label', 'Custom routing — RBAC and policy enforced')
  )); ${D};
create or replace function public._${bp}_escalation_notification_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Escalation notifications — focus before interruption.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'escalation_paths', 'label', 'Governed escalation notification paths'),
    jsonb_build_object('key', 'response_times', 'label', 'Improved response time tracking'),
    jsonb_build_object('key', 'action_completion', 'label', 'Action completion rate monitoring'),
    jsonb_build_object('key', 'critical_engagement', 'label', 'Critical alert engagement metrics'),
    jsonb_build_object('key', 'missed_communications', 'label', 'Reduced missed communications tracking'),
    jsonb_build_object('key', 'employee_satisfaction', 'label', 'Employee satisfaction signals')
  )); ${D};
create or replace function public._${bp}_notification_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports notification clarity and never bypasses notification RBAC or suppresses critical alerts.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'notification_delivery_summaries', 'label', 'Notification delivery summaries'),
    jsonb_build_object('key', 'overload_detection', 'label', 'Notification overload detection'),
    jsonb_build_object('key', 'grouping_guidance', 'label', 'Smart grouping and digest guidance'),
    jsonb_build_object('key', 'notification_attention_prompts', 'label', 'Notification attention prompts'),
    jsonb_build_object('key', 'optimization_recommendations', 'label', 'Notification optimization recommendations'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Notification delivery RBAC — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_grouping_digest_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Grouping and digest — reduce noise intelligently.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'smart_grouping', 'label', 'Combine related notifications'),
    jsonb_build_object('key', 'duplicate_suppression', 'label', 'Suppress duplicate notifications'),
    jsonb_build_object('key', 'daily_digests', 'label', 'Daily digest notifications'),
    jsonb_build_object('key', 'weekly_summaries', 'label', 'Weekly summary notifications'),
    jsonb_build_object('key', 'focus_periods', 'label', 'Support focus periods — quiet hours respected'),
    jsonb_build_object('key', 'approval_gates', 'label', 'Policy gates for digest configuration changes')
  )); ${D};
create or replace function public._${bp}_channel_delivery_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Channel delivery — multi-channel with governance.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'in_app', 'label', 'In-app notifications'),
    jsonb_build_object('key', 'desktop', 'label', 'Desktop notifications'),
    jsonb_build_object('key', 'email', 'label', 'Email notifications'),
    jsonb_build_object('key', 'mobile', 'label', 'Mobile notifications'),
    jsonb_build_object('key', 'cross_device_sync', 'label', 'Cross-device synchronization'),
    jsonb_build_object('key', 'delivery_history', 'label', 'Notification delivery history retained')
  )); ${D};
create or replace function public._${bp}_preference_management_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Preference management — personal control within policy.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'personal_preferences', 'label', 'Employee personal notification preferences'),
    jsonb_build_object('key', 'team_settings', 'label', 'Manager team notification settings'),
    jsonb_build_object('key', 'org_policies', 'label', 'Tenant Admin organization notification policies'),
    jsonb_build_object('key', 'security_locked', 'label', 'Security notifications cannot be disabled by unauthorized users'),
    jsonb_build_object('key', 'read_unread', 'label', 'Read/unread tracking across channels'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Notification audit visibility respects role permissions')
  )); ${D};
create or replace function public._${bp}_notification_governance_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Notification governance — stewardship through responsibility.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'notification_analytics', 'label', 'Notification analytics and engagement metrics'),
    jsonb_build_object('key', 'overload_detection', 'label', 'Detect notification overload patterns'),
    jsonb_build_object('key', 'high_impact_priority', 'label', 'Prioritize high-impact alerts'),
    jsonb_build_object('key', 'optimization_recommendations', 'label', 'Recommend notification optimizations'),
    jsonb_build_object('key', 'delivery_history', 'label', 'Notification delivery history — immutable retention'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for policy changes')
  )); ${D};
create or replace function public._${bp}_notification_integration_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Notification integration center — cross-links and delivery sources.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'critical_alerts', 'label', 'Critical alerts'),
    jsonb_build_object('key', 'customer_success', 'label', 'Customer success alerts'),
    jsonb_build_object('key', 'meeting_followups', 'label', 'Meeting follow-ups'),
    jsonb_build_object('key', 'task_reminders', 'label', 'Task reminders'),
    jsonb_build_object('key', 'learning_reminders', 'label', 'Learning reminders'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center', 'cross_link', '/app/action-center'),
    jsonb_build_object('key', 'workflow_automation', 'label', 'Workflow Automation Phase 231', 'cross_link', '/app/aipify-enterprise-workflow-automation-engine'),
    jsonb_build_object('key', 'communication_center', 'label', 'Communication Center', 'cross_link', '/app/aipify-organizational-communication-announcements-engine'),
    jsonb_build_object('key', 'trust_center', 'label', 'Trust Center', 'cross_link', '/platform/trust'),
    jsonb_build_object('key', 'risk_center', 'label', 'Risk Center', 'cross_link', '/app/aipify-enterprise-risk-resilience-engine'),
    jsonb_build_object('key', 'customer_success_center', 'label', 'Customer Success Center', 'cross_link', '/app/aipify-customer-success-value-realization-engine'),
    jsonb_build_object('key', 'meeting_intelligence', 'label', 'Meeting Intelligence Engine', 'cross_link', '/app/aipify-meeting-intelligence-follow-up-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for notification policy changes')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing notification RBAC',
      'Disabling security notifications without authorization',
      'Suppressing critical alerts',
      'Replacing human attention stewardship',
      'Modifying notification audit trails',
      'Unlogged notification policy changes',
      'Notification spam without governance',
      'Override human judgment'), 'principle', '${P.companion} supports — humans steward attention decisions and communication accountability.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm notification support without attention pressure.', 'values', jsonb_build_array('clarity_before_noise','relevance_before_volume','focus_before_interruption','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Notification attention audit logs via aipify_enterprise_notification_attention_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_notification_attention permissions — notification delivery RBAC'),
    jsonb_build_object('key', 'sensitive_notifications', 'label', 'Sensitive notifications must follow RBAC policies — Trust Architecture'),
    jsonb_build_object('key', 'security_locked', 'label', 'Security notifications cannot be disabled by unauthorized users'),
    jsonb_build_object('key', 'delivery_history', 'label', 'Notification delivery history must be retained'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 232, 'key', 'enterprise_integration_hub', 'label', 'Integrations Phase 232', 'route', '/app/aipify-enterprise-integration-hub-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 233, 'key', 'enterprise_notification_attention_management', 'label', 'Notifications Phase 233', 'route', '/app/${P.slug}', 'description', 'Human-stewarded notification and attention management')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive Cockpit integration — cross-link only'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center', 'route', '/app/action-center', 'relationship', 'Action Center integration — cross-link only'),
    jsonb_build_object('key', 'workflow_automation', 'label', 'Workflow Automation Phase 231', 'route', '/app/aipify-enterprise-workflow-automation-engine', 'relationship', 'Workflow Automation integration — cross-link only'),
    jsonb_build_object('key', 'trust_center', 'label', 'Trust Center', 'route', '/platform/trust', 'relationship', 'Trust Center integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Clarity before noise — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with RBAC-protected notification scaffolds and delivery history retention. Growth Partner terminology. ${P.companion} supports — never bypasses notification RBAC or suppresses critical alerts.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans steward attention decisions and communication accountability.', '${P.companion} informs and supports.', 'Clarity before noise — focus before interruption.', 'Growth Partner — never Affiliate.', 'Creative Intelligence Era — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — notification delivery signals max ~500 chars. No sensitive notification content beyond RBAC or PII in audit logs.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_enterprise_integration_hub_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._aeihebp232_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_notification_center_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Central notification center — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_notification_center_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_integration_marketplace_center\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Central notification center — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_notification_center_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_notification_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Notification Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_notification_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_integration_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Notification Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_notification_dashboard()->'capabilities') = 10,`,
  );

  for (const fn of [
    "notification_dashboard",
    "notification_center_hub",
    "priority_routing_engine",
    "escalation_notification_engine",
    "notification_companion",
    "grouping_digest_engine",
    "channel_delivery_engine",
    "preference_management_engine",
    "notification_governance_dashboard",
    "notification_integration_center",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${P.bp}_${fn}()`);
  }

  sql = sql.replace(
    /select 'aipify-enterprise-integration-hub-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected enterprise integration hub guidance within Creative Intelligence Era; cross-link only for Action Center, Executive Cockpit Phase 200, Workflow Automation Phase 231, Trust Center, Customer Success Center, Document Intelligence Phase 230, and future Aipify modules.",
    "RBAC-protected enterprise notification and attention management guidance within Creative Intelligence Era; cross-link only for Executive Cockpit Phase 200, Action Center, Workflow Automation Phase 231, Communication Center, Trust Center, Risk Center, Customer Success Center, and Meeting Intelligence Engine.",
  );

  return sql;
}

function genMigration() {
  const src232 = path.join(ROOT, "supabase/migrations/20261393000000_aipify_enterprise_integration_hub_engine_phase232.sql");
  if (!fs.existsSync(src232)) throw new Error("Phase 232 migration required");
  let m = transformFrom232(fs.readFileSync(src232, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-enterprise-integration-hub-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(path.join(ROOT, `lib/core/${P.slug}.ts`), transformFrom232(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")));
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom232(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")));
  }
  const panel = path.join(ROOT, `components/app/${srcSlug}/AipifyEnterpriseIntegrationHubEngineDashboardPanel.tsx`);
  write(
    path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`),
    transformFrom232(fs.readFileSync(panel, "utf8")),
  );
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`);
  write(path.join(ROOT, `app/app/${P.slug}/page.tsx`), transformFrom232(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")));
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom232(fs.readFileSync(path.join(ROOT, `app/api/aipify/${srcSlug}/${route}/route.ts`), "utf8")),
    );
  }
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports notification delivery — does NOT bypass notification RBAC, disable security notifications without authorization, or suppress critical alerts.

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

## What is the Enterprise Notification & Attention Management Engine?

The Enterprise Notification & Attention Management Engine ensures the right people receive the right information at the right time without notification fatigue at \`/app/${P.slug}\`.

## What notification features are included?

Central notification center, priority-based notifications, smart grouping, role-based rules, escalation notifications, digest notifications, real-time and scheduled notifications, preference management, cross-device sync, read/unread tracking, and notification analytics.

## What notification types are supported?

Critical alerts, executive briefings, approval requests, workflow updates, customer success alerts, security events, Trust Center alerts, meeting follow-ups, task reminders, learning reminders, integration failures, and organization announcements.

## What delivery channels are available?

In-app, desktop, email, mobile, daily digests, and weekly summaries — all governed by RBAC.

## What intelligence features are included?

Detect notification overload, combine related notifications, prioritize high-impact alerts, suppress duplicates, recommend optimizations, and support focus periods.

## Who can manage notifications?

Super Admin (full access), Tenant Admin (organization policies), Managers (team settings), and Employees (personal preferences) — all governed by enterprise RBAC.

## Are notification changes audited?

**Yes.** Notification policy changes must be logged. Security notifications cannot be disabled by unauthorized users and delivery history is retained.

## How does this integrate with other Aipify surfaces?

Cross-link only: Executive Cockpit Phase 200, Action Center, Workflow Automation Phase 231, Communication Center, Trust Center, Risk Center, Customer Success Center, and Meeting Intelligence Engine — never duplicate their RPCs.

## Does the Notification Companion replace human oversight?

**No.** ${P.companion} prepares notification clarity — it does **NOT** bypass notification RBAC, disable security notifications without authorization, or suppress critical alerts.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Notification Center: notification dashboard, central notification center, priority routing, grouping and digest engine, escalation notifications, channel delivery, preference management, notification governance, notification integration center.
Types: critical alerts, executive briefings, approvals, workflow updates, customer success, security events, Trust Center, meeting follow-ups, tasks, learning, integration failures, announcements.
Channels: in-app, desktop, email, mobile, daily digests, weekly summaries.
Intelligence: overload detection, smart grouping, high-impact priority, duplicate suppression, optimization recommendations, focus periods.
Security: RBAC, security notifications locked, delivery history retained, audit logging.
Design principles: Clarity before noise, relevance before volume, focus before interruption.
Companion limitations: no bypassing notification RBAC, no disabling security notifications unauthorized, no suppressing critical alerts.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never bypasses notification RBAC, disables security notifications without authorization, or suppresses critical alerts.";
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
    c = c.replace('| "aipifyEnterpriseIntegrationHubEngine"', `| "aipifyEnterpriseIntegrationHubEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    const anchor = /id: "aipifyEnterpriseIntegrationHubEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyEnterpriseIntegrationHubEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-enterprise-integration-hub-engine")) {\n    return "aipifyEnterpriseIntegrationHubEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-enterprise-integration-hub-engine")) {\n    return "aipifyEnterpriseIntegrationHubEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_enterprise_integration_hub.steward",', `"aipify_enterprise_integration_hub.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-enterprise-integration-hub-engine";',
      `export * from "./aipify-enterprise-integration-hub-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports central notifications, priority routing, grouping, digests, and governed delivery. Supports employees — does NOT bypass notification RBAC or suppress critical alerts. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Notification attention score",
    modeLabel: "Mode",
    readinessLabel: "Notification maturity level",
    executiveReviews: "Notification response reviews",
    activeReflections: "Active notification attention scaffolds",
    humanOversightRequired: `Human oversight required — humans steward attention decisions; ${P.companion} supports only`,
    eraOpenerSummary: `Creative Intelligence Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate Executive Cockpit, Action Center, Workflow Automation, Communication Center, Trust Center, Risk Center, Customer Success Center, or Meeting Intelligence RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Central notification center — governance prompts",
    frameworkLabel: "Priority routing engine",
    reviewsLabel: "Notification governance dashboard",
    companionLabel: `${P.companion} — supports clarity, never replaces human attention stewardship`,
    subEngineLabel: "Grouping and digest engine",
    reflections: "Notification attention scaffolds",
    executiveReviewEntries: "Notification delivery history entries",
    scaffoldNotes: "RBAC-protected notification attention scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT bypass notification RBAC, disable security notifications without authorization, or suppress critical alerts`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports notification delivery visibility — humans retain attention stewardship authority.`,
      philosophy: "People First. RBAC-protected notification attention scaffolds. Growth Partner terminology — never Affiliate.",
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
        ? "Varsler"
        : locale === "sv"
          ? "Aviseringar"
          : locale === "da"
            ? "Notifikationer"
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
      'export * from "./implementation-blueprint-phase232-vocabulary";',
      `export * from "./implementation-blueprint-phase232-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE232_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase232-aipify-enterprise-integration-hub.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE232_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase232-aipify-enterprise-integration-hub.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_enterprise_integration_hub.view`, `aipify_enterprise_integration_hub.manage`, `aipify_enterprise_integration_hub.steward`.";
  const entry = `\n**Enterprise Notification & Attention Management Engine (Phase 233):** See [AIPIFY_ENTERPRISE_NOTIFICATION_ATTENTION_MANAGEMENT_ENGINE_PHASE233.md](./AIPIFY_ENTERPRISE_NOTIFICATION_ATTENTION_MANAGEMENT_ENGINE_PHASE233.md) — Notification Center for central inbox, priority routing, smart grouping, role-based rules, escalation, digests, real-time and scheduled delivery, preferences, cross-device sync, read/unread tracking, analytics, and integration center. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** bypassing notification RBAC, disabling security notifications without authorization, or suppressing critical alerts. Cross-links only: Executive Cockpit Phase 200, Action Center, Workflow Automation Phase 231, Communication Center, Trust Center, Risk Center, Customer Success Center, Meeting Intelligence Engine. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 233")) {
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
