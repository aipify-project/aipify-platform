#!/usr/bin/env node
/** ABOS Phase 234 — Enterprise Search & Universal Knowledge Access Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "search_dashboard",
  "global_search_hub",
  "natural_language_search_engine",
  "cross_module_search_engine",
  "semantic_filter_engine",
  "saved_search_analytics_engine",
  "search_governance_dashboard",
  "knowledge_gap_engine",
  "search_integration_center",
];

const P = {
  phase: 234,
  migration: "20261395000000_aipify_enterprise_search_universal_knowledge_access_engine_phase234.sql",
  slug: "aipify-enterprise-search-universal-knowledge-access-engine",
  base: "AipifyEnterpriseSearchUniversalKnowledgeAccess",
  camel: "aipifyEnterpriseSearchUniversalKnowledgeAccessEngine",
  snake: "aipify_enterprise_search_universal_knowledge",
  permPrefix: "aipify_enterprise_search_universal_knowledge",
  helper: "aesuka",
  bp: "aesukabp234",
  decisionType: "aipify_enterprise_search_universal_knowledge_access_engine",
  title: "Enterprise Search & Universal Knowledge Access",
  centerTitle: "Search Center",
  companion: "Search Companion",
  scoreKey: "aipify_enterprise_search_universal_knowledge_score",
  modeKey: "search_universal_knowledge_mode",
  levelKey: "search_maturity_level",
  thirdEntity: "search_universal_knowledge_notes",
  era: "Universal Knowledge Era (234–238)",
  eraRange: "234–238",
  docSlug: "AIPIFY_ENTERPRISE_SEARCH_UNIVERSAL_KNOWLEDGE_ACCESS_ENGINE",
  ilmFile: "implementation-blueprint-phase234-aipify-enterprise-search-universal-knowledge-access.txt",
  navLabel: "Search",
  crossLinkNote:
    "Cross-links only: Knowledge Center, Document Intelligence Phase 230, Action Center, Communication Center, Executive Cockpit Phase 200, Learning Center, Trust Center, Customer Success Center, and future Aipify modules — never bypass search RBAC, expose unauthorized content, or index content without privacy policy compliance.",
  companionLimitations: [
    "bypassing_search_rbac",
    "exposing_unauthorized_content",
    "indexing_content_without_policy",
    "unlogged_search_policy_changes",
    "replacing_human_knowledge_stewardship",
    "modifying_search_audit_trail",
    "search_results_without_rbac",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom233(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyEnterpriseNotificationAttentionManagement", P.base],
    ["aipify-enterprise-notification-attention-management-engine", P.slug],
    ["aipify_enterprise_notification_attention", P.snake],
    ["aipifyEnterpriseNotificationAttentionManagementEngine", P.camel],
    ["aenamebp233", P.bp],
    ["_aename_", `_${P.helper}_`],
    ["aipify_enterprise_notification_attention_score", P.scoreKey],
    ["notification_attention_mode", P.modeKey],
    ["notification_maturity_level", P.levelKey],
    ["notification_attention_notes", P.thirdEntity],
    ["NotificationAttentionNote", thirdPascal],
    ["notification_attention_notes_count", `${P.thirdEntity}_count`],
    ["Notifications Phase 233", "__NOTIFICATIONS_PHASE_233__"],
    ["Notification Center", P.centerTitle],
    ["Notification Companion", P.companion],
    ["__NOTIFICATIONS_PHASE_233__", "Notifications Phase 233"],
    ["Enterprise Notification & Attention Management", P.title],
    ["Notifications", P.navLabel],
    ["Phase 233", `Phase ${P.phase}`],
    ["aipify_enterprise_notification_attention.view", `${P.permPrefix}.view`],
    ["aipify_enterprise_notification_attention.manage", `${P.permPrefix}.manage`],
    ["aipify_enterprise_notification_attention.steward", `${P.permPrefix}.steward`],
    ["aipify_enterprise_notification_attention_management_engine", P.decisionType],
    ["20261394000000_aipify_enterprise_notification_attention_management_engine_phase233.sql", P.migration],
    ["Repo Phase 233", `Repo Phase ${P.phase}`],
    ["Phase 233 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE233_AIPIFY_ENTERPRISE_NOTIFICATION_ATTENTION_MANAGEMENT_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase233", `implementation-blueprint-phase${P.phase}`],
    ["notification_dashboard", SCAFFOLDS[0]],
    ["notification_center_hub", SCAFFOLDS[1]],
    ["priority_routing_engine", SCAFFOLDS[2]],
    ["grouping_digest_engine", SCAFFOLDS[3]],
    ["escalation_notification_engine", SCAFFOLDS[4]],
    ["channel_delivery_engine", SCAFFOLDS[5]],
    ["preference_management_engine", SCAFFOLDS[6]],
    ["notification_governance_dashboard", SCAFFOLDS[7]],
    ["notification_integration_center", SCAFFOLDS[8]],
    ["notification_companion", "search_companion"],
    ["_seed_notification_attention_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["notification attention stewardship", "universal knowledge stewardship"],
    ["attention-informed decision support", "search-informed decision support"],
    ["clarity-first notification culture", "permission-first search culture"],
    ["active notifications", "active saved searches"],
    ["notifications requiring attention", "knowledge gaps requiring attention"],
    ["Central Notification Center", "Global Search Bar"],
    ["Priority Routing Engine", "Natural Language Search Engine"],
    ["Grouping & Digest Engine", "Cross-Module Search Engine"],
    ["Escalation Notification Engine", "Semantic & Filter Search Engine"],
    ["Channel Delivery Engine", "Saved Search & Analytics Engine"],
    ["Preference Management Engine", "Search Governance Dashboard"],
    ["notification engagement indicators", "search utilization indicators"],
    ["notification governance prompts", "search governance prompts"],
    ["notification attention prompts", "universal knowledge access prompts"],
    ["notification delivery summaries", "search result summaries"],
    ["escalation notification signals", "missing knowledge detection signals"],
    ["protected notification policies", "RBAC-protected search indexes"],
    ["Clarity before noise", "Relevance before volume"],
    ["Relevance before volume", "Privacy before convenience"],
    ["Focus before interruption", "Access before assumption"],
    ["no_bypassing_notification_rbac", "no_bypassing_search_rbac"],
    ["AIPIFY_ENTERPRISE_NOTIFICATION_ATTENTION_MANAGEMENT_ENGINE", P.docSlug],
    ["enterprise notification and attention management", "enterprise search and universal knowledge access"],
    ["Notification attention audit logs", "Universal knowledge search audit logs"],
    ["notification delivery RBAC", "search result RBAC"],
    ["notification attention scaffolds", "universal knowledge search scaffolds"],
    ["role-based notification rules", "role-aware search policies"],
    ["Notification attention score", "Universal knowledge search score"],
    ["Notification maturity level", "Search maturity level"],
    ["Notification delivery history entries", "Recent search history entries"],
    ["Notification attention", "Universal knowledge search"],
    ["notification attention", "universal knowledge search"],
    ["notification preference stewardship", "knowledge access stewardship"],
    ["sensitive notifications beyond RBAC", "unauthorized content beyond RBAC"],
    ["cross-module notification delivery", "cross-module search indexing"],
    ["notification response reviews", "search analytics reviews"],
    [
      "Executive Cockpit Phase 200, Action Center, Workflow Automation Phase 231, Communication Center, Trust Center, Risk Center, Customer Success Center, and Meeting Intelligence Engine",
      "Knowledge Center, Document Intelligence Phase 230, Action Center, Communication Center, Executive Cockpit Phase 200, Learning Center, Trust Center, Customer Success Center, and future Aipify modules",
    ],
    [
      "Executive Cockpit, Action Center, Workflow Automation Phase 231, Communication Center, Trust Center, Risk Center, Customer Success Center, and Meeting Intelligence Engine",
      "Knowledge Center, Document Intelligence, Action Center, Communication Center, Executive Cockpit, Learning Center, Trust Center, Customer Success Center, and future Aipify modules",
    ],
    [
      "Never bypass notification RBAC or disable security notifications without authorization",
      "Never bypass search RBAC or expose content users are not authorized to access",
    ],
    ["notification deliveries", "search results"],
    ["Notification deliveries", "Search results"],
    ["confidential notification routing", "confidential content search routing"],
    ["suppresses critical alerts without authorization", "surfaces unauthorized content without RBAC"],
    ["Unauthorized suppression of critical security notifications", "Unauthorized exposure of restricted search results"],
    ["Modifying notification audit trails", "Modifying search audit trails"],
    ["Volume before relevance", "Convenience before privacy"],
    ["human attention stewardship", "human knowledge stewardship"],
    ["Human attention stewardship", "Human knowledge stewardship"],
    ["attention decisions and communication accountability", "knowledge access decisions and productivity accountability"],
    ["notification delivery visibility", "search result visibility"],
    ["notification governance", "search governance"],
    [
      "ensure the right people receive the right information at the right time without creating unnecessary noise or notification fatigue — maintaining RBAC, delivery history, and full audit logging",
      "enable employees to instantly find the information they need across the entire Aipify ecosystem through a unified, permission-aware search experience — maintaining RBAC, privacy policies, and full audit logging",
    ],
    [
      "notification fatigue decreases, response times improve, action completion rates increase, and organizations deliver alerts with clarity before noise",
      "time spent searching decreases, Knowledge Center utilization increases, organizational insights are accessed faster, and employees find information with relevance before volume",
    ],
    ["Notifications Phase 234", "Notifications Phase 233"],
    ["Creative Intelligence Era (229–233)", P.era],
    ["229–233", P.eraRange],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports universal knowledge search — NOT bypassing search RBAC, exposing unauthorized content, or indexing content without privacy policy compliance. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Enable employees to instantly find the information they need across the entire Aipify ecosystem through a unified, permission-aware search experience — ${P.companion} prepares, humans decide.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Universal Knowledge Era (${P.eraRange}). Human-stewarded search governance; RBAC-protected search scaffolds; search policy changes logged; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations reduce time spent searching, increase Knowledge Center utilization, access insights faster, and find information with relevance before volume.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Ten search modules with governance'),
    jsonb_build_object('key', 'global_search_hub', 'label', 'Global search bar', 'emoji', '🔍', 'description', 'Unified permission-aware search entry'),
    jsonb_build_object('key', 'natural_language_search_engine', 'label', 'Natural language search', 'emoji', '💬', 'description', 'Understand natural language questions'),
    jsonb_build_object('key', 'cross_module_search_engine', 'label', 'Cross-module search', 'emoji', '🔗', 'description', 'Search across Aipify modules'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not replace human knowledge stewardship'),
    jsonb_build_object('key', 'semantic_filter_engine', 'label', 'Semantic and filtered search', 'emoji', '🎯', 'description', 'Keyword, semantic, and role-aware filters'),
    jsonb_build_object('key', 'search_governance_dashboard', 'label', 'Search governance dashboard', 'emoji', '🛡️', 'description', 'Analytics, saved searches, and audit history'),
    jsonb_build_object('key', 'search_sources', 'label', 'Search sources catalog', 'emoji', '📚', 'description', 'Knowledge Center, documents, policies, and more')
  ); ${D};
create or replace function public._${bp}_search_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — ten capabilities. Relevance before volume.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'search_dashboard', 'label', 'Search Dashboard — active searches and knowledge gaps requiring attention'),
    jsonb_build_object('key', 'global_search_hub', 'label', 'Global Search Bar — unified permission-aware entry'),
    jsonb_build_object('key', 'natural_language_search', 'label', 'Natural Language Search — understand questions in plain language'),
    jsonb_build_object('key', 'cross_module_search', 'label', 'Cross-Module Search — Knowledge Center, documents, workflows, and more'),
    jsonb_build_object('key', 'knowledge_document_policy', 'label', 'Knowledge Center, Document & Policy Search'),
    jsonb_build_object('key', 'task_meeting_customer', 'label', 'Task, Meeting & Customer Search'),
    jsonb_build_object('key', 'workflow_search', 'label', 'Workflow Search — governed automation discovery'),
    jsonb_build_object('key', 'saved_searches', 'label', 'Saved Searches & Favorite Results'),
    jsonb_build_object('key', 'search_analytics', 'label', 'Search Analytics & Recent Search History'),
    jsonb_build_object('key', 'missing_knowledge', 'label', 'Missing Knowledge Detection & Gap Identification')
  )); ${D};
create or replace function public._${bp}_global_search_hub() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Global search bar — privacy before convenience.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'authorized_access', 'label', 'Does this search result respect role-based permissions?'),
    jsonb_build_object('key', 'relevant_result', 'label', 'Is the most relevant result surfaced first?'),
    jsonb_build_object('key', 'privacy_policy', 'label', 'Does search indexing respect organizational privacy policies?'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Are search queries logged in the audit trail?'),
    jsonb_build_object('key', 'governance', 'label', 'How does governance improve knowledge discovery without exposing unauthorized content?')
  )); ${D};
create or replace function public._${bp}_natural_language_search_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Natural language search — access before assumption.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'natural_language', 'label', 'Understand natural language questions'),
    jsonb_build_object('key', 'keyword_search', 'label', 'Keyword search'),
    jsonb_build_object('key', 'semantic_search', 'label', 'Semantic search'),
    jsonb_build_object('key', 'filtered_search', 'label', 'Filtered search with role-aware scoping'),
    jsonb_build_object('key', 'result_previews', 'label', 'Search result previews'),
    jsonb_build_object('key', 'recommended_results', 'label', 'Recommended results and related content'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center search'),
    jsonb_build_object('key', 'document_search', 'label', 'Document search — Document Intelligence cross-link'),
    jsonb_build_object('key', 'policy_search', 'label', 'Policy search — RBAC enforced')
  )); ${D};
create or replace function public._${bp}_semantic_filter_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Semantic and filter search — relevance before volume.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'role_aware', 'label', 'Role-aware search — users never discover unauthorized content'),
    jsonb_build_object('key', 'related_content', 'label', 'Related content suggestions'),
    jsonb_build_object('key', 'favorite_results', 'label', 'Favorite results'),
    jsonb_build_object('key', 'recent_history', 'label', 'Recent search history'),
    jsonb_build_object('key', 'frequent_topics', 'label', 'Highlight frequently searched topics'),
    jsonb_build_object('key', 'productivity', 'label', 'Reduced duplicate work tracking')
  )); ${D};
create or replace function public._${bp}_search_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports knowledge discovery and never bypasses search RBAC or exposes unauthorized content.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'search_result_summaries', 'label', 'Search result summaries'),
    jsonb_build_object('key', 'natural_language_guidance', 'label', 'Natural language search guidance'),
    jsonb_build_object('key', 'related_knowledge', 'label', 'Recommend related knowledge'),
    jsonb_build_object('key', 'universal_knowledge_access_prompts', 'label', 'Universal knowledge access prompts'),
    jsonb_build_object('key', 'gap_detection', 'label', 'Identify knowledge gaps and suggest Knowledge Center articles'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Search result RBAC — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_cross_module_search_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Cross-module search — unified discovery across Aipify.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center — cross-link only'),
    jsonb_build_object('key', 'documents', 'label', 'Documents — Document Intelligence Phase 230'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center tasks and approvals'),
    jsonb_build_object('key', 'executive_briefings', 'label', 'Executive briefings — Executive Cockpit'),
    jsonb_build_object('key', 'customer_success', 'label', 'Customer Success records'),
    jsonb_build_object('key', 'meeting_summaries', 'label', 'Meeting summaries — Meeting Intelligence')
  )); ${D};
create or replace function public._${bp}_saved_search_analytics_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Saved searches and analytics — stewardship through insight.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'saved_searches', 'label', 'Saved searches'),
    jsonb_build_object('key', 'search_analytics', 'label', 'Search analytics and utilization metrics'),
    jsonb_build_object('key', 'recent_history', 'label', 'Recent search history'),
    jsonb_build_object('key', 'favorite_results', 'label', 'Favorite results'),
    jsonb_build_object('key', 'user_satisfaction', 'label', 'User satisfaction signals'),
    jsonb_build_object('key', 'audit_retention', 'label', 'Search query audit retention')
  )); ${D};
create or replace function public._${bp}_search_governance_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Search governance — privacy before convenience.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'rbac_enforcement', 'label', 'Search results must follow RBAC policies'),
    jsonb_build_object('key', 'privacy_indexing', 'label', 'Search indexing respects organizational privacy policies'),
    jsonb_build_object('key', 'audit_logging', 'label', 'Search audit history — immutable log'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Manager, Employee tiers'),
    jsonb_build_object('key', 'unauthorized_blocked', 'label', 'Users must never discover unauthorized content'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Search audit visibility respects role permissions')
  )); ${D};
create or replace function public._${bp}_knowledge_gap_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Knowledge gap detection — identify and fill missing knowledge.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'missing_knowledge', 'label', 'Missing knowledge detection'),
    jsonb_build_object('key', 'knowledge_gaps', 'label', 'Identify knowledge gaps from search patterns'),
    jsonb_build_object('key', 'suggest_articles', 'label', 'Suggest new Knowledge Center articles'),
    jsonb_build_object('key', 'frequent_topics', 'label', 'Highlight frequently searched topics'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only gap analysis — no PII'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for gap remediation')
  )); ${D};
create or replace function public._${bp}_search_integration_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Search integration center — cross-links and indexed sources.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'training_content', 'label', 'Training content — Learning Center'),
    jsonb_build_object('key', 'communication_center', 'label', 'Communication Center announcements'),
    jsonb_build_object('key', 'trust_center', 'label', 'Trust Center policies'),
    jsonb_build_object('key', 'workflow_search', 'label', 'Workflow search'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'cross_link', '/app/knowledge-center'),
    jsonb_build_object('key', 'document_intelligence', 'label', 'Document Intelligence Phase 230', 'cross_link', '/app/aipify-document-intelligence-enterprise-document-engine'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center', 'cross_link', '/app/action-center'),
    jsonb_build_object('key', 'communication_center_link', 'label', 'Communication Center', 'cross_link', '/app/aipify-organizational-communication-announcements-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'learning_center', 'label', 'Learning Center', 'cross_link', '/app/learning'),
    jsonb_build_object('key', 'trust_center_link', 'label', 'Trust Center', 'cross_link', '/platform/trust'),
    jsonb_build_object('key', 'customer_success', 'label', 'Customer Success Center', 'cross_link', '/app/aipify-customer-success-value-realization-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for search policy changes')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing search RBAC',
      'Exposing unauthorized content in search results',
      'Indexing content without privacy policy compliance',
      'Replacing human knowledge stewardship',
      'Modifying search audit trails',
      'Unlogged search policy changes',
      'Search results without RBAC enforcement',
      'Override human judgment'), 'principle', '${P.companion} supports — humans steward knowledge access decisions and productivity accountability.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm search support without information pressure.', 'values', jsonb_build_array('relevance_before_volume','privacy_before_convenience','access_before_assumption','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Universal knowledge search audit logs via aipify_enterprise_search_universal_knowledge_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_search_universal_knowledge permissions — search result RBAC'),
    jsonb_build_object('key', 'unauthorized_blocked', 'label', 'Users must never discover content they are not authorized to access'),
    jsonb_build_object('key', 'privacy_indexing', 'label', 'Search indexing must respect organizational privacy policies'),
    jsonb_build_object('key', 'change_logging', 'label', 'Search policy changes must be logged'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 233, 'key', 'enterprise_notification_attention_management', 'label', 'Notifications Phase 233', 'route', '/app/aipify-enterprise-notification-attention-management-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 234, 'key', 'enterprise_search_universal_knowledge_access', 'label', 'Search Phase 234', 'route', '/app/${P.slug}', 'description', 'Human-stewarded universal knowledge search')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'route', '/app/knowledge-center', 'relationship', 'Knowledge Center integration — cross-link only'),
    jsonb_build_object('key', 'document_intelligence', 'label', 'Document Intelligence Phase 230', 'route', '/app/aipify-document-intelligence-enterprise-document-engine', 'relationship', 'Document Intelligence integration — cross-link only'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center', 'route', '/app/action-center', 'relationship', 'Action Center integration — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive Cockpit integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Relevance before volume — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with RBAC-protected search scaffolds and privacy-respecting indexing. Growth Partner terminology. ${P.companion} supports — never bypasses search RBAC or exposes unauthorized content.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans steward knowledge access decisions and productivity accountability.', '${P.companion} informs and supports.', 'Relevance before volume — privacy before convenience.', 'Growth Partner — never Affiliate.', 'Universal Knowledge Era — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — search query signals max ~500 chars. No unauthorized content beyond RBAC or PII in audit logs.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_enterprise_notification_attention_management_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._aenamebp233_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_global_search_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Global search bar — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_global_search_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_notification_center_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Global search bar — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_global_search_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_search_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Search Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_search_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_notification_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Search Center — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_search_dashboard()->'capabilities') = 10,`,
  );

  for (const fn of [
    "search_dashboard",
    "global_search_hub",
    "natural_language_search_engine",
    "semantic_filter_engine",
    "search_companion",
    "cross_module_search_engine",
    "saved_search_analytics_engine",
    "search_governance_dashboard",
    "knowledge_gap_engine",
    "search_integration_center",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${P.bp}_${fn}()`);
  }

  sql = sql.replace(
    /select 'aipify-enterprise-notification-attention-management-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected enterprise search and universal knowledge access guidance within Creative Intelligence Era;",
    "RBAC-protected enterprise search and universal knowledge access guidance within Universal Knowledge Era;",
  );
  sql = sql.replaceAll(
    "Phase 234 Enterprise Search Center Engine —",
    "Phase 234 Enterprise Search & Universal Knowledge Access Engine —",
  );

  return sql;
}

function genMigration() {
  const src233 = path.join(ROOT, "supabase/migrations/20261394000000_aipify_enterprise_notification_attention_management_engine_phase233.sql");
  if (!fs.existsSync(src233)) throw new Error("Phase 233 migration required");
  let m = transformFrom233(fs.readFileSync(src233, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-enterprise-notification-attention-management-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(path.join(ROOT, `lib/core/${P.slug}.ts`), transformFrom233(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")));
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom233(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")));
  }
  const panel = path.join(ROOT, `components/app/${srcSlug}/AipifyEnterpriseNotificationAttentionManagementEngineDashboardPanel.tsx`);
  write(
    path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`),
    transformFrom233(fs.readFileSync(panel, "utf8")),
  );
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`);
  write(path.join(ROOT, `app/app/${P.slug}/page.tsx`), transformFrom233(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")));
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom233(fs.readFileSync(path.join(ROOT, `app/api/aipify/${srcSlug}/${route}/route.ts`), "utf8")),
    );
  }
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports universal knowledge search — does NOT bypass search RBAC, expose unauthorized content, or index content without privacy policy compliance.

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

## What is the Enterprise Search & Universal Knowledge Access Engine?

The Enterprise Search & Universal Knowledge Access Engine enables employees to instantly find information across the entire Aipify ecosystem at \`/app/${P.slug}\`.

## What search features are included?

Global search bar, natural language search, cross-module search, Knowledge Center search, document search, policy search, task search, meeting search, customer search, workflow search, saved searches, and search analytics.

## What search sources are indexed?

Knowledge Center, documents, policies, Action Center, executive briefings, Customer Success records, meeting summaries, training content, Communication Center, Trust Center, and future Aipify modules — all governed by RBAC.

## What search capabilities are available?

Keyword search, semantic search, filtered search, role-aware search, recent search history, recommended results, related content suggestions, search result previews, favorite results, and missing knowledge detection.

## What intelligence features are included?

Understand natural language questions, surface the most relevant results first, recommend related knowledge, identify knowledge gaps, highlight frequently searched topics, and suggest new Knowledge Center articles.

## Who can use search?

Super Admin (full access), Tenant Admin (organization-wide visibility), Managers (department visibility), and Employees (authorized content only) — all governed by enterprise RBAC.

## Are search queries audited?

**Yes.** Search policy changes must be logged. Search results must follow RBAC policies and users must never discover unauthorized content.

## How does this integrate with other Aipify surfaces?

Cross-link only: Knowledge Center, Document Intelligence Phase 230, Action Center, Communication Center, Executive Cockpit Phase 200, Learning Center, Trust Center, Customer Success Center — never duplicate their RPCs.

## Does the Search Companion replace human oversight?

**No.** ${P.companion} prepares search guidance — it does **NOT** bypass search RBAC, expose unauthorized content, or index content without privacy policy compliance.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Search Center: search dashboard, global search bar, natural language search, cross-module search, semantic and filter search, saved searches and analytics, search governance, knowledge gap detection, search integration center.
Sources: Knowledge Center, documents, policies, Action Center, executive briefings, Customer Success, meetings, training, Communication Center, Trust Center.
Capabilities: keyword, semantic, filtered, role-aware, recent history, recommended results, previews, favorites, missing knowledge detection.
Intelligence: natural language questions, relevant results first, related knowledge, gap identification, frequent topics, Knowledge Center article suggestions.
Security: RBAC search results, privacy-respecting indexing, audit logging, unauthorized content blocked.
Design principles: Relevance before volume, privacy before convenience, access before assumption.
Companion limitations: no bypassing search RBAC, no exposing unauthorized content, no indexing without policy compliance.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never bypasses search RBAC, exposes unauthorized content, or indexes content without privacy policy compliance.";
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
    c = c.replace('| "aipifyEnterpriseNotificationAttentionManagementEngine"', `| "aipifyEnterpriseNotificationAttentionManagementEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    const anchor = /id: "aipifyEnterpriseNotificationAttentionManagementEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyEnterpriseNotificationAttentionManagementEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-enterprise-notification-attention-management-engine")) {\n    return "aipifyEnterpriseNotificationAttentionManagementEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-enterprise-notification-attention-management-engine")) {\n    return "aipifyEnterpriseNotificationAttentionManagementEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_enterprise_notification_attention.steward",', `"aipify_enterprise_notification_attention.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-enterprise-notification-attention-management-engine";',
      `export * from "./aipify-enterprise-notification-attention-management-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports global search, natural language queries, cross-module discovery, and permission-aware results. Supports employees — does NOT bypass search RBAC or expose unauthorized content. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Universal knowledge search score",
    modeLabel: "Mode",
    readinessLabel: "Search maturity level",
    executiveReviews: "Search analytics reviews",
    activeReflections: "Active universal knowledge search scaffolds",
    humanOversightRequired: `Human oversight required — humans steward knowledge access decisions; ${P.companion} supports only`,
    eraOpenerSummary: `Universal Knowledge Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate Knowledge Center, Document Intelligence, Action Center, Communication Center, Executive Cockpit, Learning Center, Trust Center, or Customer Success Center RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Global search bar — governance prompts",
    frameworkLabel: "Natural language search engine",
    reviewsLabel: "Search governance dashboard",
    companionLabel: `${P.companion} — supports discovery, never replaces human knowledge stewardship`,
    subEngineLabel: "Cross-module search engine",
    reflections: "Universal knowledge search scaffolds",
    executiveReviewEntries: "Recent search history entries",
    scaffoldNotes: "RBAC-protected universal knowledge search scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT bypass search RBAC, expose unauthorized content, or index content without privacy policy compliance`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports search result visibility — humans retain knowledge access stewardship authority.`,
      philosophy: "People First. RBAC-protected universal knowledge search scaffolds. Growth Partner terminology — never Affiliate.",
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
        ? "Søk"
        : locale === "sv"
          ? "Sök"
          : locale === "da"
            ? "Søg"
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
      'export * from "./implementation-blueprint-phase233-vocabulary";',
      `export * from "./implementation-blueprint-phase233-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE233_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase233-aipify-enterprise-notification-attention-management.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE233_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase233-aipify-enterprise-notification-attention-management.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_enterprise_notification_attention.view`, `aipify_enterprise_notification_attention.manage`, `aipify_enterprise_notification_attention.steward`.";
  const entry = `\n**Enterprise Search & Universal Knowledge Access Engine (Phase 234):** See [AIPIFY_ENTERPRISE_SEARCH_UNIVERSAL_KNOWLEDGE_ACCESS_ENGINE_PHASE234.md](./AIPIFY_ENTERPRISE_SEARCH_UNIVERSAL_KNOWLEDGE_ACCESS_ENGINE_PHASE234.md) — Search Center for global search bar, natural language search, cross-module search, Knowledge Center and document search, saved searches, search analytics, knowledge gap detection, and integration center. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** bypassing search RBAC, exposing unauthorized content, or indexing content without privacy policy compliance. Cross-links only: Knowledge Center, Document Intelligence Phase 230, Action Center, Communication Center, Executive Cockpit Phase 200, Learning Center, Trust Center, Customer Success Center. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 234")) {
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
