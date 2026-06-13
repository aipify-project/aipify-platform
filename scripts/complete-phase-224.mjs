#!/usr/bin/env node
/** ABOS Phase 224 — Aipify Customer Feedback & Voice of the Customer Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "voice_of_the_customer_dashboard",
  "feedback_intake_framework",
  "sentiment_theme_engine",
  "actionable_feedback_center",
  "customer_improvement_tracker",
  "executive_customer_insights_briefing",
  "success_innovation_action_integration",
  "voice_of_customer_knowledge_libraries",
];

const P = {
  phase: 224,
  migration: "20261385000000_aipify_customer_feedback_voice_of_the_customer_engine_phase224.sql",
  slug: "aipify-customer-feedback-voice-of-the-customer-engine",
  base: "AipifyCustomerFeedbackVoiceOfTheCustomer",
  camel: "aipifyCustomerFeedbackVoiceOfTheCustomerEngine",
  snake: "aipify_customer_feedback_voice_of_the_customer",
  permPrefix: "aipify_customer_feedback_voice_of_the_customer",
  helper: "acfvotce",
  bp: "acfvotcebp224",
  decisionType: "aipify_customer_feedback_voice_of_the_customer_engine",
  title: "Aipify Customer Feedback & Voice of the Customer",
  centerTitle: "Voice of the Customer Center",
  companion: "Voice of the Customer Companion",
  scoreKey: "aipify_customer_feedback_voice_of_the_customer_score",
  modeKey: "voice_of_customer_mode",
  levelKey: "feedback_maturity_level",
  thirdEntity: "voice_of_customer_notes",
  era: "Customer Voice Era (224–230)",
  eraRange: "224–230",
  docSlug: "AIPIFY_CUSTOMER_FEEDBACK_VOICE_OF_THE_CUSTOMER_ENGINE",
  ilmFile: "implementation-blueprint-phase224-aipify-customer-feedback-voice-of-the-customer.txt",
  navLabel: "Voice of the Customer",
  crossLinkNote:
    "Cross-links only: Customer Success Center Phase 213, Innovation Center Phase 212, and Action Center — never expose personal customer information beyond RBAC or replace human customer stewardship.",
  companionLimitations: [
    "exposing_personal_customer_information_beyond_rbac",
    "bypassing_privacy_regulations",
    "replacing_human_customer_stewardship",
    "automated_actions_without_human_approval",
    "storing_raw_customer_pii",
    "assumption_before_listening",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom223(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyOrganizationalInsightsExecutiveIntelligence", P.base],
    ["aipify-organizational-insights-executive-intelligence-engine", P.slug],
    ["aipify_organizational_insights_executive_intelligence", P.snake],
    ["aipifyOrganizationalInsightsExecutiveIntelligence", P.camel.replace(/Engine$/, "")],
    ["aipifyOrganizationalInsightsExecutiveIntelligenceEngine", P.camel],
    ["aoieiebp223", P.bp],
    ["_aoieie_", `_${P.helper}_`],
    ["aipify_organizational_insights_executive_intelligence_score", P.scoreKey],
    ["executive_intelligence_mode", P.modeKey],
    ["insight_maturity_level", P.levelKey],
    ["executive_intelligence_notes", P.thirdEntity],
    ["ExecutiveIntelligenceNote", thirdPascal],
    ["executive_intelligence_notes_count", `${P.thirdEntity}_count`],
    ["Executive Intelligence Center", P.centerTitle],
    ["Executive Intelligence Companion", P.companion],
    ["Aipify Organizational Insights & Executive Intelligence", P.title],
    ["Executive Intelligence", P.navLabel],
    ["Phase 223", `Phase ${P.phase}`],
    ["aipify_organizational_insights_executive_intelligence.view", `${P.permPrefix}.view`],
    ["aipify_organizational_insights_executive_intelligence.manage", `${P.permPrefix}.manage`],
    ["aipify_organizational_insights_executive_intelligence.steward", `${P.permPrefix}.steward`],
    ["20261384000000_aipify_organizational_insights_executive_intelligence_engine_phase223.sql", P.migration],
    ["Repo Phase 223", `Repo Phase ${P.phase}`],
    ["Phase 223 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE223_AIPIFY_ORGANIZATIONAL_INSIGHTS_EXECUTIVE_INTELLIGENCE_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase223", `implementation-blueprint-phase${P.phase}`],
    ["executive_intelligence_dashboard", SCAFFOLDS[0]],
    ["trend_analysis_engine", SCAFFOLDS[1]],
    ["opportunity_intelligence_center", SCAFFOLDS[2]],
    ["risk_intelligence_monitor", SCAFFOLDS[3]],
    ["cross_functional_insight_engine", SCAFFOLDS[4]],
    ["executive_briefing_generator", SCAFFOLDS[5]],
    ["cockpit_command_health_integration", SCAFFOLDS[6]],
    ["executive_intelligence_knowledge_libraries", SCAFFOLDS[7]],
    ["executive_intelligence_companion", "voice_of_customer_companion"],
    ["_seed_executive_intelligence_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["executive intelligence stewardship", "customer feedback stewardship"],
    ["executive decision support", "customer-centric decision support"],
    ["insight-first executive culture", "listening-first customer culture"],
    ["critical organizational insights", "overall customer sentiment trends"],
    ["trends requiring leadership attention", "important feedback themes"],
    ["Trend Analysis Engine", "Feedback Intake Framework"],
    ["Opportunity Intelligence Center", "Sentiment & Theme Engine"],
    ["Risk Intelligence Monitor", "Actionable Feedback Center"],
    ["Cross-Functional Insight Engine", "Customer Improvement Tracker"],
    ["Executive Briefing Generator", "Executive Customer Insights Briefing"],
    ["organizational risk indicators", "customer experience risk indicators"],
    ["executive briefing prompts", "customer insight briefing prompts"],
    ["leadership summary prompts", "customer experience summary prompts"],
    ["executive intelligence summaries", "voice of customer summaries"],
    ["emerging trend signals", "recurring theme signals"],
    ["sensitive intelligence information", "personal customer information"],
    ["Insight before assumption", "Listening before assumptions"],
    ["Clarity before complexity", "Action before complacency"],
    ["Wisdom before urgency", "Relationships before transactions"],
    ["no_sensitive_intelligence_beyond_rbac", "no_personal_customer_information_beyond_rbac"],
    ["AIPIFY_ORGANIZATIONAL_INSIGHTS_EXECUTIVE_INTELLIGENCE_ENGINE", P.docSlug],
    ["Executive Intelligence Era", "Customer Voice Era"],
    ["Executive Intelligence Era (221–230)", P.era],
    ["organizational insights and executive intelligence", "customer feedback and voice of the customer"],
    ["Executive intelligence audit logs", "Customer feedback audit logs"],
    ["executive intelligence RBAC", "customer feedback RBAC"],
    ["executive intelligence scaffolds", "voice of customer scaffolds"],
    ["executive confidentiality controls", "customer privacy controls"],
    ["Executive intelligence score", "Voice of customer score"],
    ["Insight maturity level", "Feedback maturity level"],
    ["Executive intelligence scaffolds", "Voice of customer scaffolds"],
    ["Executive briefing entries", "Customer feedback entries"],
    ["Executive intelligence", "Voice of the customer"],
    ["executive intelligence", "voice of the customer"],
    ["strategic insight delivery", "actionable feedback routing"],
    ["sensitive intelligence beyond RBAC", "personal customer information beyond RBAC"],
    ["strategic decisions", "customer follow-up actions"],
    ["executive stewardship", "customer feedback stewardship"],
    ["leadership briefings", "customer insights briefings"],
    ["/app/command-center", "/app/action-center"],
    ["Global Command Center", "Action Center"],
    ["command_center", "action_center"],
    ["Organizational Health Engine Phase 198", "Innovation Center Phase 212"],
    ["/app/aipify-organizational-health-engine", "/app/aipify-innovation-opportunity-discovery-engine"],
    ["organizational_health_engine", "innovation_center"],
    ["Organizational health integration", "Innovation center integration"],
    ["Executive Cockpit Phase 200", "Customer Success Center Phase 213"],
    ["/app/aipify-executive-operating-system-founders-cockpit-engine", "/app/aipify-customer-success-value-realization-engine"],
    ["executive_cockpit", "customer_success_center"],
    ["Executive cockpit integration", "Customer success center integration"],
    [
      "Executive Cockpit, Global Command Center, and Organizational Health Engine",
      "Customer Success Center, Innovation Center, and Action Center",
    ],
    [
      "Executive Cockpit Phase 200, Global Command Center, and Organizational Health Engine Phase 198",
      "Customer Success Center Phase 213, Innovation Center Phase 212, and Action Center",
    ],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports systematic customer feedback — NOT exposing personal customer information beyond RBAC, bypassing privacy regulations, or replacing human customer stewardship. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Enable organizations to systematically collect, understand and act upon customer feedback to strengthen products, services and long-term customer relationships — ${P.companion} prepares, humans decide.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Customer Voice Era (${P.eraRange}). Human-stewarded customer feedback; RBAC-protected voice of customer scaffolds; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where customer feedback transforms into measurable action, satisfaction strengthens, and leadership stays customer-centric without information overload.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'feedback_intake_framework', 'label', 'Feedback intake framework', 'emoji', '📥', 'description', 'Structured collection from multiple channels'),
    jsonb_build_object('key', 'sentiment_theme_engine', 'label', 'Sentiment & theme engine', 'emoji', '🧭', 'description', 'Recurring patterns and emerging concerns'),
    jsonb_build_object('key', 'actionable_feedback_center', 'label', 'Actionable feedback center', 'emoji', '🎯', 'description', 'Routing, ownership, and resolution tracking'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not replace human customer stewardship or expose PII'),
    jsonb_build_object('key', 'customer_improvement_tracker', 'label', 'Customer improvement tracker', 'emoji', '📈', 'description', 'Improvements resulting from customer feedback'),
    jsonb_build_object('key', 'executive_customer_insights_briefing', 'label', 'Executive customer insights briefing', 'emoji', '🗺️', 'description', 'Leadership customer experience intelligence'),
    jsonb_build_object('key', 'voice_of_customer_knowledge_libraries', 'label', 'Voice of customer knowledge libraries', 'emoji', '📚', 'description', 'Approved customer feedback guidance resources')
  ); ${D};
create or replace function public._${bp}_voice_of_the_customer_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities. Listening before assumptions.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'voice_of_the_customer_dashboard', 'label', 'Voice of the Customer Dashboard — sentiment trends and important feedback themes'),
    jsonb_build_object('key', 'feedback_intake_framework', 'label', 'Feedback Intake Framework — structured collection and consolidated perspectives'),
    jsonb_build_object('key', 'sentiment_theme_engine', 'label', 'Sentiment & Theme Engine — recurring patterns and emerging concerns'),
    jsonb_build_object('key', 'actionable_feedback_center', 'label', 'Actionable Feedback Center — routing, ownership, and resolution progress'),
    jsonb_build_object('key', 'customer_improvement_tracker', 'label', 'Customer Improvement Tracker — completed initiatives and organizational learning'),
    jsonb_build_object('key', 'executive_customer_insights_briefing', 'label', 'Executive Customer Insights Briefing — strategic risks and opportunities'),
    jsonb_build_object('key', 'success_innovation_action_integration', 'label', 'Customer Success, Innovation Center, and Action Center integration — cross-links only'),
    jsonb_build_object('key', 'voice_of_customer_knowledge_libraries', 'label', 'Voice of customer knowledge libraries — approved resources')
  )); ${D};
create or replace function public._${bp}_feedback_intake_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Feedback intake framework — action before complacency.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'multi_channel', 'label', 'Which feedback channels should consolidate this cycle?'),
    jsonb_build_object('key', 'structured_collection', 'label', 'Where does structured feedback reduce fragmentation?'),
    jsonb_build_object('key', 'manual_automated', 'label', 'How are manual and automated submissions balanced?'),
    jsonb_build_object('key', 'privacy_controls', 'label', 'How is personal customer information kept RBAC-protected?'),
    jsonb_build_object('key', 'accountability', 'label', 'Who owns follow-up for actionable feedback themes?')
  )); ${D};
create or replace function public._${bp}_sentiment_theme_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Sentiment & theme engine — listening before assumptions with human stewardship.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'recurring_themes', 'label', 'Recurring feedback themes'),
    jsonb_build_object('key', 'emerging_concerns', 'label', 'Emerging concern signals'),
    jsonb_build_object('key', 'improvement_opportunities', 'label', 'Improvement opportunity highlights'),
    jsonb_build_object('key', 'automatic_categorization', 'label', 'Automatic categorization scaffolds'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates'),
    jsonb_build_object('key', 'privacy_controls', 'label', 'RBAC-protected customer feedback metadata'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); ${D};
create or replace function public._${bp}_executive_customer_insights_briefing() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive customer insights briefing — relationships before transactions.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'customer_experience_intelligence', 'label', 'Customer experience intelligence summaries'),
    jsonb_build_object('key', 'strategic_risks', 'label', 'Strategic risk highlights from customer feedback'),
    jsonb_build_object('key', 'strategic_opportunities', 'label', 'Strategic opportunity highlights'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds'),
    jsonb_build_object('key', 'proactive_stewardship', 'label', 'Proactive stewardship prompts')
  )); ${D};
create or replace function public._${bp}_voice_of_customer_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports customer-centric intelligence and never exposes personal customer information beyond RBAC or automates follow-up without human approval.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'voice_of_customer_summaries', 'label', 'Voice of customer summaries'),
    jsonb_build_object('key', 'theme_insights', 'label', 'Theme and sentiment insights'),
    jsonb_build_object('key', 'routing_recommendations', 'label', 'Actionable routing recommendations'),
    jsonb_build_object('key', 'customer_experience_summary_prompts', 'label', 'Customer experience summary prompts'),
    jsonb_build_object('key', 'improvement_highlights', 'label', 'Improvement highlights'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'RBAC-protected customer feedback — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_actionable_feedback_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Actionable feedback center — action before complacency.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'follow_up_routing', 'label', 'Feedback requiring follow-up routing'),
    jsonb_build_object('key', 'ownership_assignment', 'label', 'Ownership assignment scaffolds'),
    jsonb_build_object('key', 'resolution_tracking', 'label', 'Resolution progress tracking'),
    jsonb_build_object('key', 'accountability', 'label', 'Accountability encouragement'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no raw customer PII'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for customer actions')
  )); ${D};
create or replace function public._${bp}_customer_improvement_tracker() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Customer improvement tracker — relationships before transactions.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'feedback_driven_improvements', 'label', 'Improvements resulting from customer feedback'),
    jsonb_build_object('key', 'completed_initiatives', 'label', 'Completed initiative highlights'),
    jsonb_build_object('key', 'organizational_learning', 'label', 'Organizational learning reinforcement'),
    jsonb_build_object('key', 'customer_trust', 'label', 'Customer trust strengthening'),
    jsonb_build_object('key', 'no_auto_actions', 'label', 'Never automate customer follow-up without human approval'),
    jsonb_build_object('key', 'privacy_controls', 'label', 'Customer privacy controls — RBAC enforced')
  )); ${D};
create or replace function public._${bp}_success_innovation_action_integration() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Customer Success, Innovation Center, and Action Center integration — cross-links only.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'customer_success_center', 'label', 'Customer Success Center Phase 213 cross-link', 'cross_link', '/app/aipify-customer-success-value-realization-engine'),
    jsonb_build_object('key', 'innovation_center', 'label', 'Innovation Center Phase 212 cross-link', 'cross_link', '/app/aipify-innovation-opportunity-discovery-engine'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center cross-link', 'cross_link', '/app/action-center'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility scaffolds — RBAC protected'),
    jsonb_build_object('key', 'no_pii_exposure', 'label', 'Never expose personal customer information beyond RBAC')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Exposing personal customer information beyond RBAC',
      'Bypassing applicable privacy regulations',
      'Replacing human customer stewardship',
      'Automated customer actions without human approval',
      'Storing raw customer PII in feedback scaffolds',
      'Assumption before listening',
      'Override human judgment'), 'principle', '${P.companion} supports — humans steward customer relationships and feedback actions.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm customer stewardship without urgency pressure or guilt-based motivation.', 'values', jsonb_build_array('listening_before_assumptions','action_before_complacency','relationships_before_transactions','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Customer feedback audit logs via aipify_customer_feedback_voice_of_the_customer_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_customer_feedback_voice_of_the_customer permissions — customer feedback RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'RBAC-protected voice of customer scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'privacy', 'label', 'Customer privacy controls — RBAC enforced; applicable privacy regulations'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 223, 'key', 'organizational_insights_executive_intelligence', 'label', 'Executive Intelligence Phase 223', 'route', '/app/aipify-organizational-insights-executive-intelligence-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 224, 'key', 'customer_feedback_voice_of_the_customer', 'label', 'Voice of the Customer Phase 224', 'route', '/app/${P.slug}', 'description', 'Human-stewarded customer feedback and voice of customer intelligence')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'customer_success_center', 'label', 'Customer Success Center Phase 213', 'route', '/app/aipify-customer-success-value-realization-engine', 'relationship', 'Customer success center integration — cross-link only'),
    jsonb_build_object('key', 'innovation_center', 'label', 'Innovation Center Phase 212', 'route', '/app/aipify-innovation-opportunity-discovery-engine', 'relationship', 'Innovation center integration — cross-link only'),
    jsonb_build_object('key', 'action_center', 'label', 'Action Center', 'route', '/app/action-center', 'relationship', 'Action center integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Relationships before transactions — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with RBAC-protected voice of customer scaffolds and human stewardship gates. Growth Partner terminology. ${P.companion} supports — never exposes personal customer information beyond RBAC or automates customer follow-up without approval.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans steward customer relationships and feedback actions.', '${P.companion} informs and supports.', 'Listening before assumptions — action before complacency.', 'Growth Partner — never Affiliate.', 'Customer Voice Era — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — customer feedback signals max ~500 chars. No raw customer PII, personal contact details, or confidential customer records beyond RBAC.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_organizational_insights_executive_intelligence_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._aoieiebp223_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_feedback_intake_framework\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Feedback intake framework — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_feedback_intake_framework()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  for (const fn of [
    "voice_of_the_customer_dashboard",
    "feedback_intake_framework",
    "sentiment_theme_engine",
    "executive_customer_insights_briefing",
    "voice_of_customer_companion",
    "actionable_feedback_center",
    "customer_improvement_tracker",
    "success_innovation_action_integration",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${P.bp}_${fn}()`);
  }

  sql = sql.replace(
    /select 'aipify-organizational-insights-executive-intelligence-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected organizational insights and executive intelligence guidance within Executive Intelligence Era; cross-link only for Executive Cockpit, Global Command Center, and Organizational Health Engine.",
    "RBAC-protected customer feedback and voice of customer guidance within Customer Voice Era; cross-link only for Customer Success Center, Innovation Center, and Action Center.",
  );

  return sql;
}

function genMigration() {
  const src223 = path.join(ROOT, "supabase/migrations/20261384000000_aipify_organizational_insights_executive_intelligence_engine_phase223.sql");
  if (!fs.existsSync(src223)) throw new Error("Phase 223 migration required");
  let m = transformFrom223(fs.readFileSync(src223, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-organizational-insights-executive-intelligence-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(path.join(ROOT, `lib/core/${P.slug}.ts`), transformFrom223(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")));
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom223(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")));
  }
  const panel = path.join(ROOT, `components/app/${srcSlug}/AipifyOrganizationalInsightsExecutiveIntelligenceEngineDashboardPanel.tsx`);
  write(path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`), transformFrom223(fs.readFileSync(panel, "utf8")));
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`);
  write(path.join(ROOT, `app/app/${P.slug}/page.tsx`), transformFrom223(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")));
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom223(fs.readFileSync(path.join(ROOT, `app/api/aipify/${srcSlug}/${route}/route.ts`), "utf8")),
    );
  }
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports systematic customer feedback — does NOT expose personal customer information beyond RBAC or replace human customer stewardship.

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

## What is the Customer Feedback & Voice of the Customer Engine?

Customer Feedback & Voice of the Customer provides systematic customer feedback collection, theme analysis, and actionable routing at \`/app/${P.slug}\`.

## Does the Voice of the Customer Companion replace human customer stewardship?

**No.** ${P.companion} prepares customer-centric summaries and theme insights — it does **NOT** expose personal customer information beyond RBAC or automate follow-up without human approval.

## What does the Voice of the Customer Center include?

Voice of the customer dashboard, feedback intake framework, sentiment & theme engine, actionable feedback center, customer improvement tracker, and executive customer insights briefing — RBAC-protected metadata only.

## How does this relate to Customer Success, Innovation Center, and Action Center?

Cross-link only: Customer Success Center Phase 213 (\`/app/aipify-customer-success-value-realization-engine\`), Innovation Center Phase 212 (\`/app/aipify-innovation-opportunity-discovery-engine\`), and Action Center (\`/app/action-center\`). Never duplicate their RPCs.

## Why are RBAC and privacy controls required?

Humans retain customer relationship authority. Aipify consolidates feedback themes — it does not expose personal customer information beyond role-based access or store raw customer PII.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Voice of the Customer Center: voice of the customer dashboard, feedback intake framework, sentiment & theme engine, actionable feedback center, customer improvement tracker, executive customer insights briefing, success/innovation/action integration (cross-links), voice of customer knowledge libraries.
Feedback Intake Framework: multi-channel collection, manual and automated submissions, consolidated customer perspectives.
Sentiment & Theme Engine: recurring patterns, emerging concerns, and improvement opportunities.
Actionable Feedback Center: follow-up routing, ownership assignment, and resolution tracking.
Customer Improvement Tracker: feedback-driven improvements and completed initiatives.
Executive Customer Insights Briefing: leadership customer experience intelligence and strategic risks/opportunities.
Design principles: Listening before assumptions, action before complacency, relationships before transactions.
Companion limitations: no personal customer information beyond RBAC, no automated customer actions without human approval.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never exposes personal customer information beyond RBAC or replaces human customer stewardship.";
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
    c = c.replace('| "aipifyOrganizationalInsightsExecutiveIntelligenceEngine"', `| "aipifyOrganizationalInsightsExecutiveIntelligenceEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    const anchor = /id: "aipifyOrganizationalInsightsExecutiveIntelligenceEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyOrganizationalInsightsExecutiveIntelligenceEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-organizational-insights-executive-intelligence-engine")) {\n    return "aipifyOrganizationalInsightsExecutiveIntelligenceEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-organizational-insights-executive-intelligence-engine")) {\n    return "aipifyOrganizationalInsightsExecutiveIntelligenceEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_organizational_insights_executive_intelligence.steward",', `"aipify_organizational_insights_executive_intelligence.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-organizational-insights-executive-intelligence-engine";',
      `export * from "./aipify-organizational-insights-executive-intelligence-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports customer feedback intake, sentiment themes, and actionable routing. Supports teams — does NOT expose personal customer information beyond RBAC. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Voice of customer score",
    modeLabel: "Mode",
    readinessLabel: "Feedback maturity level",
    executiveReviews: "Executive customer insights briefing",
    activeReflections: "Active voice of customer scaffolds",
    humanOversightRequired: `Human oversight required — humans steward customer relationships; ${P.companion} supports only`,
    eraOpenerSummary: `Customer Voice Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate Customer Success, Innovation Center, or Action Center RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Feedback intake framework — listening prompts",
    frameworkLabel: "Sentiment & theme engine",
    reviewsLabel: "Executive customer insights briefing",
    companionLabel: `${P.companion} — supports listening, never replaces human customer stewardship`,
    subEngineLabel: "Actionable feedback center",
    reflections: "Voice of customer scaffolds",
    executiveReviewEntries: "Customer feedback entries",
    scaffoldNotes: "RBAC-protected voice of customer scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT expose personal customer information beyond RBAC or automate customer follow-up`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports customer feedback visibility — humans retain customer relationship authority.`,
      philosophy: "People First. RBAC-protected voice of customer scaffolds. Growth Partner terminology — never Affiliate.",
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
        ? "Kundefeedback og kundestemme"
        : locale === "sv"
          ? "Kundfeedback och kundröst"
          : locale === "da"
            ? "Kundefeedback og kundestemme"
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
      'export * from "./implementation-blueprint-phase223-vocabulary";',
      `export * from "./implementation-blueprint-phase223-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE223_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase223-aipify-organizational-insights-executive-intelligence.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE223_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase223-aipify-organizational-insights-executive-intelligence.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_organizational_insights_executive_intelligence.view`, `aipify_organizational_insights_executive_intelligence.manage`, `aipify_organizational_insights_executive_intelligence.steward`.";
  const entry = `\n**Aipify Customer Feedback & Voice of the Customer Engine (Phase 224):** See [${P.docSlug}_PHASE224.md](./${P.docSlug}_PHASE224.md) — Voice of the Customer Center for voice of the customer dashboard, feedback intake framework, sentiment & theme engine, actionable feedback center, customer improvement tracker, executive customer insights briefing, and Customer Success/Innovation/Action Center integration. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** exposing personal customer information beyond RBAC. Cross-links only: Customer Success Center Phase 213, Innovation Center Phase 212, Action Center. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 224")) {
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
