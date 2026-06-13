#!/usr/bin/env node
/** ABOS Phase 255 — Enterprise External Intelligence & Market Awareness Engine (Era Continues 254–258) */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "intelligence_dashboard",
  "trend_monitoring_hub",
  "intelligence_categories_engine",
  "watchlist_engine",
  "regulatory_monitoring_engine",
  "intelligence_analytics_engine",
  "intelligence_controls_dashboard",
  "event_monitoring_engine",
  "intelligence_integration_center",
];

const P = {
  phase: 255,
  migration:
    "20261417000000_aipify_enterprise_external_intelligence_market_awareness_engine_phase255.sql",
  slug: "aipify-enterprise-external-intelligence-market-awareness-engine",
  base: "AipifyEnterpriseExternalIntelligenceMarketAwareness",
  camel: "aipifyEnterpriseExternalIntelligenceMarketAwarenessEngine",
  snake: "aipify_enterprise_external_intelligence_market_awareness",
  permPrefix: "aipify_enterprise_external_intelligence_market_awareness",
  helper: "aeeimae",
  bp: "aeeimaebp255",
  decisionType: "aipify_enterprise_external_intelligence_market_awareness_engine",
  title: "Enterprise External Intelligence & Market Awareness",
  centerTitle: "External Intelligence & Market Awareness",
  companion: "Intelligence Companion",
  scoreKey: "aipify_enterprise_external_intelligence_market_awareness_score",
  modeKey: "enterprise_external_intelligence_market_awareness_mode",
  levelKey: "enterprise_external_intelligence_market_awareness_maturity_level",
  thirdEntity: "enterprise_external_intelligence_market_awareness_notes",
  era: "Knowledge Quality Era (254–258)",
  eraRange: "254–258",
  docSlug: "AIPIFY_ENTERPRISE_EXTERNAL_INTELLIGENCE_MARKET_AWARENESS_ENGINE",
  ilmFile:
    "implementation-blueprint-phase255-aipify-enterprise-external-intelligence-market-awareness.txt",
  navLabel: "External Intelligence",
  crossLinkNote:
    "Cross-links only: Executive Cockpit Phase 200, Enterprise Analytics Engine Phase 235, Decision Intelligence & Recommendation Engine Phase 251, Enterprise Notification Engine Phase 233, Organizational Goals & Alignment Engine Phase 248, Innovation & Idea Management Engine Phase 247, Enterprise Search Engine Phase 234, and Aipify Translate Phase 238 — never bypass intelligence RBAC, expose strategic intelligence without authorization, or violate information-sharing policies.",
  companionLimitations: [
    "bypassing_intelligence_rbac",
    "exposing_strategic_intelligence_without_rbac",
    "violating_information_sharing_policies",
    "unlogged_intelligence_access_changes",
    "replacing_human_leadership_judgment",
    "modifying_intelligence_audit_trail",
    "ignoring_sharing_policies",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom254(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyEnterpriseKnowledgeValidationQualityAssurance", P.base],
    ["aipify-enterprise-knowledge-validation-quality-assurance-engine", P.slug],
    ["aipify_enterprise_knowledge_validation_quality_assurance", P.snake],
    ["aipifyEnterpriseKnowledgeValidationQualityAssuranceEngine", P.camel],
    ["aekvqaebp254", P.bp],
    ["_aekvqae_", `_${P.helper}_`],
    ["aipify_enterprise_knowledge_validation_quality_assurance_score", P.scoreKey],
    ["enterprise_knowledge_validation_quality_assurance_mode", P.modeKey],
    ["enterprise_knowledge_validation_quality_assurance_maturity_level", P.levelKey],
    ["enterprise_knowledge_validation_quality_assurance_notes", P.thirdEntity],
    ["EnterpriseKnowledgeValidationQualityAssuranceNote", thirdPascal],
    ["enterprise_knowledge_validation_quality_assurance_notes_count", `${P.thirdEntity}_count`],
    ["Knowledge Validation & Quality Phase 254", "__QUALITY_PHASE_254__"],
    ["Quality Companion", "__INTELLIGENCE_COMPANION__"],
    ["Enterprise Knowledge Validation & Quality Assurance", P.title],
    ["__INTELLIGENCE_COMPANION__", P.companion],
    ["Knowledge Validation & Quality", "__INTELLIGENCE_CENTER__"],
    ["__QUALITY_PHASE_254__", "Knowledge Validation & Quality Phase 254"],
    ["Phase 254", `Phase ${P.phase}`],
    ["aipify_enterprise_knowledge_validation_quality_assurance.view", `${P.permPrefix}.view`],
    ["aipify_enterprise_knowledge_validation_quality_assurance.manage", `${P.permPrefix}.manage`],
    ["aipify_enterprise_knowledge_validation_quality_assurance.steward", `${P.permPrefix}.steward`],
    ["aipify_enterprise_knowledge_validation_quality_assurance_engine", P.decisionType],
    [
      "20261416000000_aipify_enterprise_knowledge_validation_quality_assurance_engine_phase254.sql",
      P.migration,
    ],
    ["Repo Phase 254", `Repo Phase ${P.phase}`],
    ["Phase 254 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE254_AIPIFY_ENTERPRISE_KNOWLEDGE_VALIDATION_QUALITY_ASSURANCE_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase254", `implementation-blueprint-phase${P.phase}`],
    ["quality_controls_dashboard", SCAFFOLDS[6]],
    ["quality_dashboard", SCAFFOLDS[0]],
    ["knowledge_review_hub", SCAFFOLDS[1]],
    ["knowledge_types_engine", SCAFFOLDS[2]],
    ["approval_processes_engine", SCAFFOLDS[3]],
    ["expiration_monitoring_engine", SCAFFOLDS[4]],
    ["usage_analytics_engine", SCAFFOLDS[5]],
    ["feedback_collection_engine", SCAFFOLDS[7]],
    ["quality_integration_center", SCAFFOLDS[8]],
    ["quality_companion", "intelligence_companion"],
    [
      "_seed_enterprise_knowledge_validation_quality_assurance_notes",
      `_seed_${P.thirdEntity.replace("_notes", "")}_notes`,
    ],
    ["knowledge quality assurance stewardship", "external intelligence stewardship"],
    ["validation-informed quality support", "awareness-informed intelligence support"],
    ["stewardship-first knowledge culture", "awareness-first intelligence culture"],
    ["active quality programs", "active intelligence programs"],
    ["knowledge requiring executive attention", "intelligence requiring executive attention"],
    ["Knowledge Review Hub", "Trend Monitoring Hub"],
    ["Knowledge Types Engine", "Intelligence Categories Engine"],
    ["Approval Processes Engine", "Watchlist Engine"],
    ["Expiration Monitoring Engine", "Regulatory Monitoring Engine"],
    ["Usage Analytics Engine", "Intelligence Analytics Engine"],
    ["Quality Controls Dashboard", "Intelligence Controls Dashboard"],
    ["review completion indicators", "briefing completion indicators"],
    ["knowledge quality prompts", "market awareness prompts"],
    ["quality assistant prompts", "intelligence assistant prompts"],
    ["knowledge feedback collection", "external event monitoring"],
    ["expiration monitoring signals", "intelligence alert signals"],
    ["RBAC-protected knowledge policies", "RBAC-protected intelligence policies"],
    ["Accuracy before volume", "Awareness before reaction"],
    ["Stewardship before neglect", "Preparation before surprise"],
    ["Trust before assumption", "Signal before noise"],
    ["no_bypassing_knowledge_rbac", "no_bypassing_intelligence_rbac"],
    ["AIPIFY_ENTERPRISE_KNOWLEDGE_VALIDATION_QUALITY_ASSURANCE_ENGINE", P.docSlug],
    ["enterprise knowledge validation and quality assurance", "enterprise external intelligence and market awareness"],
    ["Knowledge quality assurance audit logs", "External intelligence audit logs"],
    ["knowledge RBAC", "intelligence RBAC"],
    ["knowledge quality assurance scaffolds", "external intelligence scaffolds"],
    ["organization retention policies", "organization information-sharing policies"],
    ["Knowledge quality score", "Market awareness score"],
    ["Knowledge quality maturity level", "Market awareness maturity level"],
    ["Knowledge review entries", "Intelligence briefing entries"],
    ["enterprise knowledge validation quality assurance", "enterprise external intelligence market awareness"],
    ["retention policy stewardship", "sharing policy stewardship"],
    ["knowledge records beyond RBAC", "intelligence records beyond RBAC"],
    ["feedback collection assistance", "event monitoring assistance"],
    ["manager department knowledge oversight", "manager department intelligence visibility"],
    [
      "Knowledge Center, Learning Center, Document Intelligence Engine Phase 230, Enterprise Analytics Engine Phase 235, Enterprise Search Engine, Enterprise Notification Engine Phase 233, Trust Center, Executive Cockpit Phase 200, and Aipify Translate Phase 238",
      "Executive Cockpit Phase 200, Enterprise Analytics Engine Phase 235, Decision Intelligence & Recommendation Engine Phase 251, Enterprise Notification Engine Phase 233, Organizational Goals & Alignment Engine Phase 248, Innovation & Idea Management Engine Phase 247, Enterprise Search Engine Phase 234, and Aipify Translate Phase 238",
    ],
    [
      "Never bypass knowledge RBAC or expose sensitive knowledge records without authorization",
      "Never bypass intelligence RBAC or expose strategic intelligence without authorization",
    ],
    ["quality programs", "intelligence programs"],
    ["Quality programs", "Intelligence programs"],
    ["sensitive knowledge record routing", "strategic intelligence routing"],
    ["exposes knowledge records without RBAC approval", "exposes intelligence records without RBAC approval"],
    [
      "Unauthorized knowledge access without RBAC approval",
      "Unauthorized intelligence access without RBAC approval",
    ],
    ["Modifying quality audit trails", "Modifying intelligence audit trails"],
    ["Volume before accuracy", "Noise before signal"],
    ["user stewardship judgment control", "user leadership judgment control"],
    ["User stewardship judgment control", "User leadership judgment control"],
    ["quality decisions and retention policies", "intelligence decisions and sharing policies"],
    ["knowledge visibility", "intelligence visibility"],
    ["knowledge validation", "market awareness"],
    [
      "enable organizations to ensure that knowledge, documentation and guidance remain accurate, relevant and trustworthy — maintaining knowledge RBAC, immutable version history, organization-controlled retention policies, and complete audit history",
      "enable organizations to monitor external developments, emerging trends and relevant market signals — maintaining intelligence RBAC, strategic intelligence protection, organization-controlled information-sharing policies, and complete audit history",
    ],
    [
      "knowledge accuracy increases, outdated content reduces, employee trust in knowledge resources improves, review completion rates accelerate, Knowledge Center utilization increases, and organizational learning strengthens with accuracy before volume",
      "strategic awareness increases, opportunity identification accelerates, executive preparedness improves, external risks are detected earlier, proactive decision-making increases, and organizational adaptability improves with awareness before reaction",
    ],
    ["Era opener.", "Continues the era."],
    ["opens the era", "continues the era"],
    ["Knowledge Quality Era opener", "Knowledge Quality Era continues"],
    ["__INTELLIGENCE_CENTER__", P.centerTitle],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports enterprise external intelligence and market awareness — NOT bypassing intelligence RBAC, exposing strategic intelligence without authorization, or violating information-sharing policies. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Enable organizations to monitor external developments, emerging trends and relevant market signals to support proactive decision-making and strategic awareness — ${P.companion} informs, humans decide.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Knowledge Quality Era (${P.eraRange}). Human-stewarded external intelligence; RBAC-protected intelligence scaffolds; intelligence access logged; ${P.companion} informs and supports. Continues the era.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations increase strategic awareness, accelerate opportunity identification, improve executive preparedness, detect external risks earlier, increase proactive decision-making, and improve organizational adaptability with awareness before reaction.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Ten intelligence modules with market awareness'),
    jsonb_build_object('key', 'trend_monitoring_hub', 'label', 'Trend monitoring hub', 'emoji', '📋', 'description', 'Industry trends, watchlists, briefings'),
    jsonb_build_object('key', 'intelligence_categories_engine', 'label', 'Intelligence categories engine', 'emoji', '🏆', 'description', 'Trends, regulatory, competitor, custom'),
    jsonb_build_object('key', 'watchlist_engine', 'label', 'Watchlist engine', 'emoji', '🔗', 'description', 'Watchlists, subscriptions, archives'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not replace human leadership judgment'),
    jsonb_build_object('key', 'intelligence_analytics_engine', 'label', 'Intelligence analytics engine', 'emoji', '📊', 'description', 'Analytics, alerts, opportunity tracking'),
    jsonb_build_object('key', 'intelligence_controls_dashboard', 'label', 'Intelligence controls dashboard', 'emoji', '🛡️', 'description', 'RBAC and sharing controls'),
    jsonb_build_object('key', 'regulatory_monitoring_engine', 'label', 'Regulatory monitoring engine', 'emoji', '🔔', 'description', 'Regulatory updates, events, escalations')
  ); ${D};
create or replace function public._${bp}_intelligence_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — ten capabilities. Awareness before reaction.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'intelligence_dashboard', 'label', 'External Intelligence Dashboards'),
    jsonb_build_object('key', 'trend_monitoring', 'label', 'Industry Trend Monitoring'),
    jsonb_build_object('key', 'competitor_awareness', 'label', 'Competitor Awareness Tracking'),
    jsonb_build_object('key', 'regulatory_monitoring', 'label', 'Regulatory Update Monitoring'),
    jsonb_build_object('key', 'market_opportunities', 'label', 'Market Opportunity Tracking'),
    jsonb_build_object('key', 'strategic_watchlists', 'label', 'Strategic Watchlists'),
    jsonb_build_object('key', 'executive_briefings', 'label', 'Executive Intelligence Briefings'),
    jsonb_build_object('key', 'event_monitoring', 'label', 'External Event Monitoring'),
    jsonb_build_object('key', 'intelligence_alerts', 'label', 'Intelligence Alerts & Analytics'),
    jsonb_build_object('key', 'topic_subscriptions', 'label', 'Topic Subscriptions & Intelligence Archive')
  )); ${D};
create or replace function public._${bp}_trend_monitoring_hub() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Trend monitoring — preparation before surprise.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'intelligence_rbac', 'label', 'Does intelligence access follow RBAC policies?'),
    jsonb_build_object('key', 'strategic_protection', 'label', 'Is strategic intelligence data protected?'),
    jsonb_build_object('key', 'sharing_policies', 'label', 'Do organizations control information-sharing policies?'),
    jsonb_build_object('key', 'awareness', 'label', 'Is external intelligence transparent to authorized users?'),
    jsonb_build_object('key', 'signal', 'label', 'How does monitoring support signal before noise?')
  )); ${D};
create or replace function public._${bp}_intelligence_categories_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Intelligence categories — signal before noise.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'industry_trends', 'label', 'Industry trends'),
    jsonb_build_object('key', 'technology_developments', 'label', 'Technology developments'),
    jsonb_build_object('key', 'regulatory_changes', 'label', 'Regulatory changes'),
    jsonb_build_object('key', 'competitor_activities', 'label', 'Competitor activities'),
    jsonb_build_object('key', 'market_opportunities', 'label', 'Market opportunities'),
    jsonb_build_object('key', 'economic_indicators', 'label', 'Economic indicators'),
    jsonb_build_object('key', 'customer_behavior', 'label', 'Customer behavior trends'),
    jsonb_build_object('key', 'sustainability', 'label', 'Sustainability developments'),
    jsonb_build_object('key', 'workforce_trends', 'label', 'Workforce trends'),
    jsonb_build_object('key', 'custom', 'label', 'Custom intelligence categories')
  )); ${D};
create or replace function public._${bp}_event_monitoring_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Event monitoring — leadership awareness.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'observed', 'label', 'Observed'),
    jsonb_build_object('key', 'categorized', 'label', 'Categorized'),
    jsonb_build_object('key', 'significant', 'label', 'Significant development'),
    jsonb_build_object('key', 'watchlist', 'label', 'On watchlist'),
    jsonb_build_object('key', 'alert_pending', 'label', 'Alert pending'),
    jsonb_build_object('key', 'escalated', 'label', 'Escalated'),
    jsonb_build_object('key', 'archived', 'label', 'Archived')
  )); ${D};
create or replace function public._${bp}_intelligence_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports strategic awareness and never bypasses intelligence RBAC or violates information-sharing policies.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'emerging_trends', 'label', 'Detect emerging trends'),
    jsonb_build_object('key', 'unusual_activity', 'label', 'Surface unusual market activity'),
    jsonb_build_object('key', 'strategic_opportunities', 'label', 'Highlight strategic opportunities'),
    jsonb_build_object('key', 'executive_attention', 'label', 'Recommend areas for executive attention'),
    jsonb_build_object('key', 'business_risks', 'label', 'Identify potential business risks'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'Intelligence RBAC — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_watchlist_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Watchlists — proactive strategic planning.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'strategic_watchlists', 'label', 'Strategic watchlists'),
    jsonb_build_object('key', 'topic_subscriptions', 'label', 'Topic subscriptions'),
    jsonb_build_object('key', 'competitor_tracking', 'label', 'Competitor awareness tracking'),
    jsonb_build_object('key', 'intelligence_archive', 'label', 'Intelligence archive'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Intelligence audit trails'),
    jsonb_build_object('key', 'executive_briefings', 'label', 'Executive intelligence briefings')
  )); ${D};
create or replace function public._${bp}_regulatory_monitoring_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Regulatory monitoring — proactive compliance awareness.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'regulatory_updates', 'label', 'Regulatory update monitoring'),
    jsonb_build_object('key', 'aggregate_signals', 'label', 'Aggregate relevant information'),
    jsonb_build_object('key', 'categorize_signals', 'label', 'Categorize intelligence signals'),
    jsonb_build_object('key', 'highlight_developments', 'label', 'Highlight significant developments'),
    jsonb_build_object('key', 'escalate_critical', 'label', 'Escalate critical updates'),
    jsonb_build_object('key', 'preserve_history', 'label', 'Preserve intelligence history')
  )); ${D};
create or replace function public._${bp}_intelligence_analytics_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Intelligence analytics — adaptability visibility.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'strategic_awareness', 'label', 'Strategic awareness signals'),
    jsonb_build_object('key', 'opportunity_identification', 'label', 'Opportunity identification speed'),
    jsonb_build_object('key', 'executive_preparedness', 'label', 'Executive preparedness indicators'),
    jsonb_build_object('key', 'risk_detection', 'label', 'External risk detection timing'),
    jsonb_build_object('key', 'proactive_decisions', 'label', 'Proactive decision-making rates'),
    jsonb_build_object('key', 'audit_visibility', 'label', 'Intelligence audit visibility respects role permissions')
  )); ${D};
create or replace function public._${bp}_intelligence_controls_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Intelligence controls — organizations control information-sharing policies.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'intelligence_rbac', 'label', 'Intelligence access follows RBAC policies'),
    jsonb_build_object('key', 'strategic_protection', 'label', 'Strategic intelligence data remains protected'),
    jsonb_build_object('key', 'sharing_policies', 'label', 'Organizations control information-sharing policies'),
    jsonb_build_object('key', 'executive_oversight', 'label', 'Executive strategic intelligence oversight'),
    jsonb_build_object('key', 'role_permissions', 'label', 'Super Admin, Tenant Admin, Executive, Manager, Employee tiers'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for intelligence sharing changes')
  )); ${D};
create or replace function public._${bp}_intelligence_integration_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Intelligence integration center — cross-links to Aipify modules.', 'integrations', jsonb_build_array(
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-cockpit-engine'),
    jsonb_build_object('key', 'enterprise_analytics', 'label', 'Enterprise Analytics Engine Phase 235', 'cross_link', '/app/aipify-enterprise-analytics-operational-intelligence-engine'),
    jsonb_build_object('key', 'decision_intelligence', 'label', 'Decision Intelligence Engine Phase 251', 'cross_link', '/app/aipify-decision-intelligence-recommendation-engine'),
    jsonb_build_object('key', 'notification_engine', 'label', 'Enterprise Notification Engine Phase 233', 'cross_link', '/app/aipify-enterprise-notification-attention-management-engine'),
    jsonb_build_object('key', 'organizational_goals', 'label', 'Organizational Goals Engine Phase 248', 'cross_link', '/app/aipify-organizational-goals-alignment-engine'),
    jsonb_build_object('key', 'innovation_engine', 'label', 'Innovation & Idea Management Engine Phase 247', 'cross_link', '/app/aipify-innovation-idea-management-engine'),
    jsonb_build_object('key', 'enterprise_search', 'label', 'Enterprise Search Engine Phase 234', 'cross_link', '/app/aipify-enterprise-search-universal-knowledge-access-engine'),
    jsonb_build_object('key', 'aipify_translate', 'label', 'Aipify Translate Phase 238', 'cross_link', '/app/aipify-translate-engine'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for intelligence integration actions')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Bypassing intelligence RBAC',
      'Exposing strategic intelligence without authorization',
      'Violating information-sharing policies',
      'Replacing human leadership judgment',
      'Modifying intelligence audit trails',
      'Unlogged intelligence access changes',
      'Ignoring sharing policies',
      'Override human judgment'), 'principle', '${P.companion} supports — users retain leadership judgment control and strategic intelligence stays protected.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm intelligence support without alarmism.', 'values', jsonb_build_array('awareness_before_reaction','preparation_before_surprise','signal_before_noise','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'External intelligence audit logs via aipify_enterprise_external_intelligence_market_awareness_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_enterprise_external_intelligence_market_awareness permissions — intelligence RBAC'),
    jsonb_build_object('key', 'intelligence_rbac', 'label', 'Intelligence access follows RBAC policies'),
    jsonb_build_object('key', 'strategic_protection', 'label', 'Strategic intelligence data remains protected'),
    jsonb_build_object('key', 'sharing_policies', 'label', 'Organizations control information-sharing policies'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 254, 'key', 'enterprise_knowledge_validation_quality_assurance', 'label', 'Knowledge Validation & Quality Phase 254', 'route', '/app/aipify-enterprise-knowledge-validation-quality-assurance-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 255, 'key', 'enterprise_external_intelligence_market_awareness', 'label', 'External Intelligence & Market Awareness Phase 255', 'route', '/app/${P.slug}', 'description', 'Human-stewarded external intelligence — continues era')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-cockpit-engine', 'relationship', 'Executive Cockpit integration — cross-link only'),
    jsonb_build_object('key', 'decision_intelligence', 'label', 'Decision Intelligence Engine Phase 251', 'route', '/app/aipify-decision-intelligence-recommendation-engine', 'relationship', 'Decision intelligence integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Preparation before surprise — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with RBAC-protected intelligence scaffolds and strategic intelligence protections. Growth Partner terminology. ${P.companion} supports — never bypasses intelligence RBAC or violates information-sharing policies.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — users retain leadership judgment control.', '${P.companion} informs and supports.', 'Awareness before reaction — preparation before surprise.', 'Growth Partner — never Affiliate.', 'Knowledge Quality Era continues — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — intelligence signals max ~500 chars. No strategic intelligence content beyond RBAC or PII in audit logs.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_enterprise_knowledge_validation_quality_assurance_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._aekvqaebp254_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_trend_monitoring_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Trend monitoring hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_trend_monitoring_hub()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_knowledge_review_hub\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Trend monitoring hub — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_trend_monitoring_hub()->'reflection_questions') = 5,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_intelligence_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'External Intelligence & Market Awareness — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_intelligence_dashboard()->'capabilities') = 10,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_quality_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'External Intelligence & Market Awareness — ten capabilities', 'met', jsonb_array_length(public._${P.bp}_intelligence_dashboard()->'capabilities') = 10,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  const replaceRpcRef = (sqlText, fn) => {
    if (fn === "intelligence_dashboard") {
      return sqlText.replace(/public\._(\w+)_intelligence_dashboard\(\)/g, (full, prefix) =>
        prefix.endsWith("intelligence") ? full : `public._${P.bp}_intelligence_dashboard()`,
      );
    }
    return sqlText.replace(
      new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"),
      `public._${P.bp}_${fn}()`,
    );
  };

  for (const fn of [...SCAFFOLDS, "intelligence_companion"].sort((a, b) => b.length - a.length)) {
    sql = replaceRpcRef(sql, fn);
  }

  sql = sql.replace(
    new RegExp(`select '${P.slug}'[^;]+;`, "g"),
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    /select 'aipify-enterprise-knowledge-validation-quality-assurance-engine'[^;]+;/g,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected enterprise knowledge validation and quality assurance guidance within Knowledge Quality Era;",
    "RBAC-protected enterprise external intelligence and market awareness guidance within Knowledge Quality Era;",
  );
  sql = sql.replace(
    /Phase 255 Enterprise External Intelligence & Market Awareness Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );
  sql = sql.replace(
    /Phase 254 Enterprise Knowledge Validation & Quality Assurance Engine —/,
    `Phase ${P.phase} ${P.title} Engine —`,
  );

  sql = sql.replace(
    /'authenticated', 254\nwhere not exists \(select 1 from public\.aipify_knowledge_categories where slug = 'aipify-enterprise-knowledge-validation-quality-assurance-engine'/,
    `'authenticated', ${P.phase}\nwhere not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-enterprise-knowledge-validation-quality-assurance-engine'`,
  );

  sql = sql.replaceAll("__TRANSLATE_CENTER__", P.centerTitle);

  sql = sql.replace(
    /'intelligence_intelligence_dashboard', public\._\w+_intelligence_intelligence_dashboard\(\)/,
    `'intelligence_controls_dashboard', public._${P.bp}_intelligence_controls_dashboard()`,
  );
  sql = sql.replace(
    /'quality_intelligence_dashboard', public\._\w+_intelligence_dashboard\(\)/,
    `'intelligence_controls_dashboard', public._${P.bp}_intelligence_controls_dashboard()`,
  );
  sql = sql.replace(
    /'executive_reviews_meta', public\._\w+_intelligence_dashboard\(\)/,
    `'executive_reviews_meta', public._${P.bp}_intelligence_controls_dashboard()`,
  );

  return sql;
}

function genMigration() {
  const src254 = path.join(
    ROOT,
    "supabase/migrations/20261416000000_aipify_enterprise_knowledge_validation_quality_assurance_engine_phase254.sql",
  );
  if (!fs.existsSync(src254)) throw new Error("Phase 254 migration required");
  let m = transformFrom254(fs.readFileSync(src254, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-enterprise-knowledge-validation-quality-assurance-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(
    path.join(ROOT, `lib/core/${P.slug}.ts`),
    transformFrom254(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")),
  );
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(
      path.join(dst, f),
      transformFrom254(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")),
    );
  }
  const panel = path.join(
    ROOT,
    `components/app/${srcSlug}/AipifyEnterpriseKnowledgeValidationQualityAssuranceEngineDashboardPanel.tsx`,
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`),
    transformFrom254(fs.readFileSync(panel, "utf8")),
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/index.ts`),
    `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`,
  );
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom254(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom254(
        fs.readFileSync(path.join(ROOT, `app/api/aipify/${srcSlug}/${route}/route.ts`), "utf8"),
      ),
    );
  }
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. **Continues the era.** ${P.companion} supports external intelligence dashboards, industry trend monitoring, competitor awareness, regulatory updates, market opportunities, strategic watchlists, executive briefings, event monitoring, intelligence alerts, analytics, topic subscriptions, and intelligence archive — does NOT bypass intelligence RBAC, expose strategic intelligence without authorization, or violate information-sharing policies.

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
Era: ${P.era} (continues)
${P.crossLinkNote}
`,
  );
  write(
    path.join(ROOT, `content/knowledge/aipify/${P.slug}/faq/implementation-blueprint-phase${P.phase}-faq.md`),
    `# ${P.title} Engine — FAQ (Phase ${P.phase})

## What is the Enterprise External Intelligence & Market Awareness Engine?

The Enterprise External Intelligence & Market Awareness Engine helps organizations monitor external developments, emerging trends and relevant market signals at \`/app/${P.slug}\`.

## What intelligence features are included?

External intelligence dashboards, industry trend monitoring, competitor awareness tracking, regulatory update monitoring, market opportunity tracking, strategic watchlists, executive intelligence briefings, external event monitoring, intelligence alerts, analytics, topic subscriptions, and intelligence archive.

## What intelligence categories are supported?

Industry trends, technology developments, regulatory changes, competitor activities, market opportunities, economic indicators, customer behavior trends, sustainability developments, workforce trends, and custom intelligence categories.

## What intelligence capabilities are included?

Aggregate relevant information, categorize intelligence signals, highlight significant developments, support strategic planning, track evolving trends, preserve intelligence history, escalate critical updates, and enable leadership awareness.

## What intelligence detection features are included?

Detect emerging trends, surface unusual market activity, highlight strategic opportunities, recommend areas for executive attention, identify potential business risks, and encourage proactive leadership actions.

## Who can access external intelligence?

Super Admin (full access), Tenant Admin (organization intelligence settings), Executives (strategic intelligence oversight), Managers (department intelligence visibility), Employees (approved intelligence subscriptions) — enterprise RBAC.

## Is strategic intelligence protected?

**Yes.** Intelligence access follows RBAC policies. Strategic intelligence data remains protected. Organizations control information-sharing policies.

## How does this integrate with other Aipify surfaces?

${P.crossLinkNote}

## Does the Intelligence Companion replace human judgment?

**No.** ${P.companion} supports strategic awareness — it does **NOT** bypass intelligence RBAC, expose strategic intelligence without authorization, or violate information-sharing policies.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Intelligence: dashboards, trend monitoring, competitor awareness, regulatory updates, market opportunities, watchlists, executive briefings, events, alerts, analytics, subscriptions, archive.
Categories: industry trends, technology, regulatory, competitor, market opportunities, economic, customer behavior, sustainability, workforce, custom.
Capabilities: aggregate information, categorize signals, highlight developments, strategic planning, track trends, preserve history, escalate critical updates, leadership awareness.
Detection: emerging trends, unusual market activity, strategic opportunities, executive attention areas, business risks, proactive leadership.
Security: intelligence RBAC, strategic intelligence protection, sharing policies, audit logging, enterprise permissions, 2FA.
Design principles: Awareness before reaction, preparation before surprise, signal before noise.
Companion limitations: no bypassing intelligence RBAC, no exposing strategic intelligence, no violating sharing policies.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate. Era continues 254–258.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never bypasses intelligence RBAC, exposes strategic intelligence without authorization, or violates information-sharing policies.";
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
    c = c.replace(
      '| "aipifyEnterpriseKnowledgeValidationQualityAssuranceEngine"',
      `| "aipifyEnterpriseKnowledgeValidationQualityAssuranceEngine"\n  | "${id}"`,
    );
  }
  if (!c.includes(href)) {
    const anchor =
      /id: "aipifyEnterpriseKnowledgeValidationQualityAssuranceEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyEnterpriseKnowledgeValidationQualityAssuranceEngine",\n  },/;
    c = c.replace(
      anchor,
      (m) =>
        `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`,
    );
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-enterprise-knowledge-validation-quality-assurance-engine")) {\n    return "aipifyEnterpriseKnowledgeValidationQualityAssuranceEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-enterprise-knowledge-validation-quality-assurance-engine")) {\n    return "aipifyEnterpriseKnowledgeValidationQualityAssuranceEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace(
        '"aipify_enterprise_knowledge_validation_quality_assurance.steward",',
        `"aipify_enterprise_knowledge_validation_quality_assurance.steward",\n    "${perm}",`,
      );
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-enterprise-knowledge-validation-quality-assurance-engine";',
      `export * from "./aipify-enterprise-knowledge-validation-quality-assurance-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era} continues. ${P.companion} supports external intelligence dashboards, trend monitoring, competitor awareness, regulatory updates, market opportunities, watchlists, executive briefings, event monitoring, intelligence alerts, and analytics. Supports strategic awareness — does NOT bypass intelligence RBAC or violate information-sharing policies. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Market awareness score",
    modeLabel: "Mode",
    readinessLabel: "Market awareness maturity level",
    executiveReviews: "Executive intelligence briefings",
    activeReflections: "Active external intelligence scaffolds",
    humanOversightRequired: `Human oversight required — users retain leadership judgment control; ${P.companion} supports only`,
    eraOpenerSummary: `Knowledge Quality Era — Phases ${P.eraRange} (continues)`,
    eraOpenerNote:
      "Cross-link only — do not duplicate Executive Cockpit, Analytics Engine, Decision Intelligence Engine, Notification Engine, Organizational Goals Engine, Innovation Engine, Enterprise Search, or Aipify Translate RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Trend monitoring hub — intelligence prompts",
    frameworkLabel: "Intelligence categories engine",
    reviewsLabel: "Intelligence controls dashboard",
    companionLabel: `${P.companion} — supports strategic awareness, never replaces human leadership judgment`,
    subEngineLabel: "Watchlist engine",
    reflections: "External intelligence scaffolds",
    executiveReviewEntries: "Intelligence briefing entries",
    scaffoldNotes: "RBAC-protected external intelligence scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT bypass intelligence RBAC, expose strategic intelligence without authorization, or violate information-sharing policies`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports enterprise external intelligence and market awareness — users retain leadership judgment control and strategic intelligence stays protected.`,
      philosophy:
        "People First. RBAC-protected intelligence scaffolds. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
      growthEra: `${P.era} — Phase ${P.phase} continues the era.`,
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
        ? "Ekstern intelligens"
        : locale === "sv"
          ? "Extern intelligens"
          : locale === "da"
            ? "Ekstern intelligens"
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
      'export * from "./implementation-blueprint-phase254-vocabulary";',
      `export * from "./implementation-blueprint-phase254-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE254_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase254-aipify-enterprise-knowledge-validation-quality-assurance.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE254_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase254-aipify-enterprise-knowledge-validation-quality-assurance.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_enterprise_knowledge_validation_quality_assurance.view`, `aipify_enterprise_knowledge_validation_quality_assurance.manage`, `aipify_enterprise_knowledge_validation_quality_assurance.steward`.";
  const entry = `\n**Enterprise External Intelligence & Market Awareness Engine (Phase 255):** See [AIPIFY_ENTERPRISE_EXTERNAL_INTELLIGENCE_MARKET_AWARENESS_ENGINE_PHASE255.md](./AIPIFY_ENTERPRISE_EXTERNAL_INTELLIGENCE_MARKET_AWARENESS_ENGINE_PHASE255.md) — External intelligence dashboards, industry trend monitoring, competitor awareness tracking, regulatory update monitoring, market opportunity tracking, strategic watchlists, executive intelligence briefings, external event monitoring, intelligence alerts, analytics, topic subscriptions, and intelligence archive. **Continues** Knowledge Quality Era (254–258). \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** bypassing intelligence RBAC, exposing strategic intelligence without authorization, or violating information-sharing policies. Cross-links only: Executive Cockpit Phase 200, Enterprise Analytics Engine Phase 235, Decision Intelligence & Recommendation Engine Phase 251, Enterprise Notification Engine Phase 233, Organizational Goals & Alignment Engine Phase 248, Innovation & Idea Management Engine Phase 247, Enterprise Search Engine Phase 234, Aipify Translate Phase 238. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 255")) {
    const idx = c.indexOf(marker);
    c = idx === -1 ? `${c}\n${entry}\n` : `${c.slice(0, idx + marker.length)}${entry}${c.slice(idx + marker.length)}`;
    fs.writeFileSync(file, c);
  }
}

genDocs();
try {
  genMigration();
  genStack();
  patchNav();
  patchPermissions();
  patchTenant();
  patchI18n();
  patchIlmIndex();
  patchArchitecture();
  console.log(`Phase ${P.phase} complete`);
} catch (err) {
  console.error(`Phase ${P.phase} docs generated; stack requires Phase 254 artifacts: ${err.message}`);
  process.exitCode = 1;
}
