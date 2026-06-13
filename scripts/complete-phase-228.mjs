#!/usr/bin/env node
/** ABOS Phase 228 — Aipify Vendor & Third-Party Relationship Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const SCAFFOLDS = [
  "vendor_dashboard",
  "vendor_registry",
  "contract_lifecycle_center",
  "vendor_risk_monitor",
  "performance_review_framework",
  "strategic_partnership_hub",
  "executive_vendor_briefings",
  "risk_trust_cockpit_integration",
  "vendor_knowledge_libraries",
];

const P = {
  phase: 228,
  migration: "20261389000000_aipify_vendor_third_party_relationship_engine_phase228.sql",
  slug: "aipify-vendor-third-party-relationship-engine",
  base: "AipifyVendorThirdPartyRelationship",
  camel: "aipifyVendorThirdPartyRelationshipEngine",
  snake: "aipify_vendor_third_party_relationship",
  permPrefix: "aipify_vendor_third_party_relationship",
  helper: "avtpre",
  bp: "avtprebp228",
  decisionType: "aipify_vendor_third_party_relationship_engine",
  title: "Aipify Vendor & Third-Party Relationship",
  centerTitle: "Vendor Center",
  companion: "Vendor Companion",
  scoreKey: "aipify_vendor_third_party_relationship_score",
  modeKey: "vendor_relationship_mode",
  levelKey: "vendor_governance_level",
  thirdEntity: "vendor_relationship_notes",
  era: "Enterprise Resilience Era (226–230)",
  eraRange: "226–230",
  docSlug: "AIPIFY_VENDOR_THIRD_PARTY_RELATIONSHIP_ENGINE",
  ilmFile: "implementation-blueprint-phase228-aipify-vendor-third-party-relationship.txt",
  navLabel: "Vendors & Partners",
  crossLinkNote:
    "Cross-links only: Risk Center Phase 226, Trust Center, and Executive Cockpit Phase 200 — never expose vendor information beyond RBAC, protected contract documentation, or confidential partnership information beyond role-based access.",
  companionLimitations: [
    "exposing_vendor_information_beyond_rbac",
    "exposing_protected_contract_documentation",
    "exposing_confidential_partnership_information_beyond_rbac",
    "replacing_human_vendor_stewardship",
    "automated_contract_actions_without_human_approval",
    "modifying_vendor_audit_trail",
    "convenience_before_stewardship",
    "override_human_judgment",
  ],
};

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom227(content) {
  const thirdPascal = P.thirdEntity
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const pairs = [
    ["AipifyBusinessContinuityCrisisManagement", P.base],
    ["aipify-business-continuity-crisis-management-engine", P.slug],
    ["aipify_business_continuity_crisis_management", P.snake],
    ["aipifyBusinessContinuityCrisisManagement", P.camel.replace(/Engine$/, "")],
    ["aipifyBusinessContinuityCrisisManagementEngine", P.camel],
    ["abccebp227", P.bp],
    ["_abcce_", `_${P.helper}_`],
    ["aipify_business_continuity_crisis_management_score", P.scoreKey],
    ["crisis_management_mode", P.modeKey],
    ["continuity_preparedness_level", P.levelKey],
    ["crisis_management_notes", P.thirdEntity],
    ["CrisisManagementNote", thirdPascal],
    ["crisis_management_notes_count", `${P.thirdEntity}_count`],
    ["Continuity & Crisis Phase 227", "__CONTINUITY_CRISIS_PHASE_227__"],
    ["Risk Center Phase 226", "__RISK_CENTER_PHASE_226__"],
    ["Crisis Center", P.centerTitle],
    ["Crisis Companion", P.companion],
    ["__CONTINUITY_CRISIS_PHASE_227__", "Continuity & Crisis Phase 227"],
    ["__RISK_CENTER_PHASE_226__", "Risk Center Phase 226"],
    ["Aipify Business Continuity & Crisis Management", P.title],
    ["Continuity & Crisis", P.navLabel],
    ["Phase 227", `Phase ${P.phase}`],
    ["aipify_business_continuity_crisis_management.view", `${P.permPrefix}.view`],
    ["aipify_business_continuity_crisis_management.manage", `${P.permPrefix}.manage`],
    ["aipify_business_continuity_crisis_management.steward", `${P.permPrefix}.steward`],
    ["aipify_business_continuity_crisis_management_engine", P.decisionType],
    ["20261388000000_aipify_business_continuity_crisis_management_engine_phase227.sql", P.migration],
    ["Repo Phase 227", `Repo Phase ${P.phase}`],
    ["Phase 227 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE227_AIPIFY_BUSINESS_CONTINUITY_CRISIS_MANAGEMENT_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase227", `implementation-blueprint-phase${P.phase}`],
    ["crisis_command_dashboard", SCAFFOLDS[0]],
    ["incident_response_center", SCAFFOLDS[1]],
    ["business_continuity_planner", SCAFFOLDS[2]],
    ["emergency_communication_framework", SCAFFOLDS[3]],
    ["recovery_coordination_center", SCAFFOLDS[4]],
    ["post_incident_review_hub", SCAFFOLDS[5]],
    ["executive_crisis_briefings", SCAFFOLDS[6]],
    ["risk_operations_cockpit_integration", SCAFFOLDS[7]],
    ["crisis_knowledge_libraries", SCAFFOLDS[8]],
    ["crisis_companion", "vendor_companion"],
    ["_seed_crisis_management_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["crisis response stewardship", "vendor relationship stewardship"],
    ["crisis-informed decision support", "vendor-informed decision support"],
    ["preparedness-first crisis culture", "visibility-first vendor culture"],
    ["active incidents", "active vendors and strategic partners"],
    ["critical response priorities", "vendors requiring attention"],
    ["Incident Response Center", "Vendor Registry"],
    ["Business Continuity Planner", "Contract Lifecycle Center"],
    ["Emergency Communication Framework", "Vendor Risk Monitor"],
    ["Recovery Coordination Center", "Performance Review Framework"],
    ["Post-Incident Review Hub", "Strategic Partnership Hub"],
    ["Executive Crisis Briefings", "Executive Vendor Briefings"],
    ["continuity readiness indicators", "vendor oversight indicators"],
    ["executive crisis briefing prompts", "executive vendor briefing prompts"],
    ["crisis update prompts", "vendor summary prompts"],
    ["crisis coordination summaries", "vendor relationship summaries"],
    ["emerging concern signals", "vendor-related risk signals"],
    ["protected crisis information", "protected vendor information"],
    ["Preparedness before improvisation", "Visibility before assumptions"],
    ["Clarity before confusion", "Relationships before transactions"],
    ["Leadership before panic", "Stewardship before convenience"],
    ["no_crisis_information_beyond_rbac", "no_vendor_information_beyond_rbac"],
    ["AIPIFY_BUSINESS_CONTINUITY_CRISIS_MANAGEMENT_ENGINE", P.docSlug],
    ["business continuity and crisis management", "vendor and third-party relationship management"],
    ["Crisis management audit logs", "Vendor relationship audit logs"],
    ["crisis information RBAC", "vendor information RBAC"],
    ["crisis management scaffolds", "vendor relationship scaffolds"],
    ["emergency authentication safeguards", "protected contract documentation controls"],
    ["Continuity preparedness score", "Vendor governance score"],
    ["Continuity preparedness level", "Vendor governance level"],
    ["Crisis management scaffolds", "Vendor relationship scaffolds"],
    ["Recovery coordination entries", "Contract milestone entries"],
    ["Crisis management", "Vendor relationship"],
    ["crisis management", "vendor relationship"],
    ["recovery coordination stewardship", "contract lifecycle stewardship"],
    ["crisis information beyond RBAC", "vendor information beyond RBAC"],
    ["emergency actions", "contract actions"],
    ["executive crisis briefings", "executive vendor briefings"],
    ["Risk Center Phase 226, Operations Center, and Executive Cockpit Phase 200", "Risk Center Phase 226, Trust Center, and Executive Cockpit Phase 200"],
    ["Risk Center, Operations Center, and Executive Cockpit", "Risk Center, Trust Center, and Executive Cockpit"],
    ["/app/operations-center-foundation-engine", "/platform/trust"],
    ["operations_center", "trust_center"],
    ["Operations Center", "Trust Center"],
    ["Operations center integration", "Trust center integration"],
    ["Never expose crisis information beyond RBAC", "Never expose vendor information beyond RBAC"],
    ["crisis information", "vendor information"],
    ["Crisis information", "Vendor information"],
    ["confidential crisis briefing", "confidential partnership briefing"],
    ["automates emergency actions without human approval", "automates contract actions without human approval"],
    ["Automated emergency actions without human approval", "Automated contract actions without human approval"],
    ["Modifying crisis audit trails", "Modifying vendor audit trails"],
    ["Improvisation before preparedness", "Convenience before stewardship"],
    ["human crisis stewardship", "human vendor stewardship"],
    ["Human crisis stewardship", "Human vendor stewardship"],
    ["crisis decisions and recovery accountability", "vendor decisions and partnership accountability"],
    ["crisis coordination visibility", "vendor oversight visibility"],
    ["crisis governance", "vendor governance"],
    ["prepare for, coordinate and recover from unexpected disruptions through structured crisis management, continuity planning and enterprise response frameworks", "manage vendors, suppliers, technology partners and strategic third parties through a structured framework that strengthens visibility, accountability and enterprise resilience"],
    ["preparedness strengthens, crisis response improves, and leadership coordinates calmly before confusion escalates", "vendor oversight improves, third-party governance strengthens, and leadership manages relationships with visibility before assumptions"],
    ["Continuity & Crisis Phase 228", "Continuity & Crisis Phase 227"],
    ["Risk Center Phase 228", "Risk Center Phase 226"],
  ];
  let c = content;
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return c;
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports vendor and third-party relationship management — NOT exposing vendor information beyond RBAC, protected contract documentation, or confidential partnership information beyond role-based access. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Enable organizations to manage vendors, suppliers, technology partners and strategic third parties through a structured framework that strengthens visibility, accountability and enterprise resilience — ${P.companion} prepares, humans decide.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Enterprise Resilience Era (${P.eraRange}). Human-stewarded vendor governance; RBAC-protected vendor relationship scaffolds; ${P.companion} informs and supports.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where vendor oversight improves, third-party governance strengthens, and leadership manages relationships with visibility before assumptions.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Nine capability scaffolds'),
    jsonb_build_object('key', 'vendor_registry', 'label', 'Vendor registry', 'emoji', '📋', 'description', 'Approved vendor records with categorization and ownership'),
    jsonb_build_object('key', 'contract_lifecycle_center', 'label', 'Contract lifecycle center', 'emoji', '📅', 'description', 'Contract milestones, renewals, and review dates'),
    jsonb_build_object('key', 'vendor_risk_monitor', 'label', 'Vendor risk monitor', 'emoji', '🧭', 'description', 'Third-party dependencies and vendor-related risks'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not replace human vendor stewardship or automate contract actions'),
    jsonb_build_object('key', 'performance_review_framework', 'label', 'Performance review framework', 'emoji', '⭐', 'description', 'Periodic vendor evaluations and accountability'),
    jsonb_build_object('key', 'strategic_partnership_hub', 'label', 'Strategic partnership hub', 'emoji', '🤝', 'description', 'Key partnerships and executive relationship oversight'),
    jsonb_build_object('key', 'executive_vendor_briefings', 'label', 'Executive vendor briefings', 'emoji', '📈', 'description', 'Concise leadership summaries and emerging concerns')
  ); ${D};
create or replace function public._${bp}_vendor_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — nine capabilities. Visibility before assumptions.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'vendor_dashboard', 'label', 'Vendor Dashboard — active vendors and vendors requiring attention'),
    jsonb_build_object('key', 'vendor_registry', 'label', 'Vendor Registry — approved records, categorization, and ownership'),
    jsonb_build_object('key', 'contract_lifecycle_center', 'label', 'Contract Lifecycle Center — milestones, renewals, and review dates'),
    jsonb_build_object('key', 'vendor_risk_monitor', 'label', 'Vendor Risk Monitor — third-party dependencies and vendor-related risks'),
    jsonb_build_object('key', 'performance_review_framework', 'label', 'Performance Review Framework — service quality and reliability evaluations'),
    jsonb_build_object('key', 'strategic_partnership_hub', 'label', 'Strategic Partnership Hub — key partnerships and long-term collaboration'),
    jsonb_build_object('key', 'executive_vendor_briefings', 'label', 'Executive Vendor Briefings — concise leadership summaries'),
    jsonb_build_object('key', 'risk_trust_cockpit_integration', 'label', 'Risk Center, Trust Center, and Executive Cockpit integration — cross-links only'),
    jsonb_build_object('key', 'vendor_knowledge_libraries', 'label', 'Vendor knowledge libraries — approved resources')
  )); ${D};
create or replace function public._${bp}_vendor_registry() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Vendor registry — relationships before transactions.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'active_vendors', 'label', 'Which active vendors require executive visibility?'),
    jsonb_build_object('key', 'categorization', 'label', 'How does vendor categorization strengthen governance?'),
    jsonb_build_object('key', 'ownership', 'label', 'Who owns each approved vendor relationship?'),
    jsonb_build_object('key', 'rbac_controls', 'label', 'How is vendor information kept RBAC-protected?'),
    jsonb_build_object('key', 'emerging_risks', 'label', 'Which vendor-related risks should leadership review now?')
  )); ${D};
create or replace function public._${bp}_contract_lifecycle_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Contract lifecycle center — stewardship before convenience with human stewardship.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'contract_milestones', 'label', 'Important contract milestone tracking'),
    jsonb_build_object('key', 'upcoming_renewals', 'label', 'Upcoming renewal surfacing'),
    jsonb_build_object('key', 'review_dates', 'label', 'Agreement review date highlights'),
    jsonb_build_object('key', 'preparedness', 'label', 'Contract preparedness improvement'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates'),
    jsonb_build_object('key', 'contract_protection', 'label', 'Protected contract documentation — RBAC enforced'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale')
  )); ${D};
create or replace function public._${bp}_executive_vendor_briefings() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive vendor briefings — stewardship before convenience.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'leadership_summaries', 'label', 'Concise leadership summaries'),
    jsonb_build_object('key', 'emerging_concerns', 'label', 'Emerging concern highlights'),
    jsonb_build_object('key', 'informed_decisions', 'label', 'Informed decision-making support'),
    jsonb_build_object('key', 'confidentiality', 'label', 'Confidential partnership information controls'),
    jsonb_build_object('key', 'stewardship', 'label', 'Stewardship reinforcement prompts')
  )); ${D};
create or replace function public._${bp}_vendor_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports vendor oversight visibility and never exposes vendor information beyond RBAC or automates contract actions without human approval.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'vendor_relationship_summaries', 'label', 'Vendor relationship summaries'),
    jsonb_build_object('key', 'contract_insights', 'label', 'Contract lifecycle insights'),
    jsonb_build_object('key', 'risk_recommendations', 'label', 'Vendor risk recommendations'),
    jsonb_build_object('key', 'vendor_summary_prompts', 'label', 'Vendor summary prompts'),
    jsonb_build_object('key', 'partnership_highlights', 'label', 'Strategic partnership highlights'),
    jsonb_build_object('key', 'rbac_guardrails', 'label', 'RBAC-protected vendor relationship — Trust Architecture enforced')
  )); ${D};
create or replace function public._${bp}_vendor_risk_monitor() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Vendor risk monitor — visibility before assumptions.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'third_party_dependencies', 'label', 'Third-party dependency identification'),
    jsonb_build_object('key', 'vendor_related_risks', 'label', 'Vendor-related risk surfacing'),
    jsonb_build_object('key', 'mitigation_planning', 'label', 'Mitigation planning support'),
    jsonb_build_object('key', 'resilience_strengthening', 'label', 'Operational resilience strengthening'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no raw operational PII'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for risk actions')
  )); ${D};
create or replace function public._${bp}_performance_review_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Performance review framework — relationships before transactions.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'periodic_evaluations', 'label', 'Periodic vendor evaluations'),
    jsonb_build_object('key', 'service_quality', 'label', 'Service quality tracking'),
    jsonb_build_object('key', 'reliability', 'label', 'Reliability monitoring'),
    jsonb_build_object('key', 'accountability', 'label', 'Accountability encouragement'),
    jsonb_build_object('key', 'contract_protection', 'label', 'Protected contract documentation controls'),
    jsonb_build_object('key', 'human_approval_gates', 'label', 'Human approval gates for review actions')
  )); ${D};
create or replace function public._${bp}_strategic_partnership_hub() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Strategic partnership hub — stewardship through long-term collaboration.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'key_partnerships', 'label', 'Key partnership highlights'),
    jsonb_build_object('key', 'executive_oversight', 'label', 'Executive relationship oversight'),
    jsonb_build_object('key', 'long_term_collaboration', 'label', 'Long-term collaboration encouragement'),
    jsonb_build_object('key', 'ecosystem_strengthening', 'label', 'Organizational ecosystem strengthening'),
    jsonb_build_object('key', 'no_auto_contract', 'label', 'Never automate contract actions without human approval'),
    jsonb_build_object('key', 'confidentiality_controls', 'label', 'Confidential partnership information — RBAC enforced')
  )); ${D};
create or replace function public._${bp}_risk_trust_cockpit_integration() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Risk Center, Trust Center, and Executive Cockpit integration — cross-links only.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'risk_center', 'label', 'Risk Center Phase 226 cross-link', 'cross_link', '/app/aipify-enterprise-risk-resilience-engine'),
    jsonb_build_object('key', 'trust_center', 'label', 'Trust Center cross-link', 'cross_link', '/platform/trust'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200 cross-link', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive vendor visibility — RBAC protected'),
    jsonb_build_object('key', 'no_vendor_exposure', 'label', 'Never expose vendor information beyond RBAC')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Exposing vendor information beyond RBAC',
      'Exposing protected contract documentation',
      'Exposing confidential partnership information beyond RBAC',
      'Replacing human vendor stewardship',
      'Automated contract actions without human approval',
      'Modifying vendor audit trails',
      'Convenience before stewardship',
      'Override human judgment'), 'principle', '${P.companion} supports — humans steward vendor decisions and partnership accountability.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — calm vendor stewardship without pressure or transactional urgency.', 'values', jsonb_build_array('visibility_before_assumptions','relationships_before_transactions','stewardship_before_convenience','patience','service','stewardship'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Vendor relationship audit logs via aipify_vendor_third_party_relationship_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_vendor_third_party_relationship permissions — vendor information RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'RBAC-protected vendor relationship scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'vendor_information', 'label', 'Vendor information — strict RBAC enforced'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 227, 'key', 'business_continuity_crisis_management', 'label', 'Continuity & Crisis Phase 227', 'route', '/app/aipify-business-continuity-crisis-management-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 228, 'key', 'vendor_third_party_relationship', 'label', 'Vendors & Partners Phase 228', 'route', '/app/${P.slug}', 'description', 'Human-stewarded vendor and third-party relationship management')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'risk_center', 'label', 'Risk Center Phase 226', 'route', '/app/aipify-enterprise-risk-resilience-engine', 'relationship', 'Risk center integration — cross-link only'),
    jsonb_build_object('key', 'trust_center', 'label', 'Trust Center', 'route', '/platform/trust', 'relationship', 'Trust center integration — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive cockpit integration — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Visibility before assumptions — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with RBAC-protected vendor relationship scaffolds and human stewardship gates. Growth Partner terminology. ${P.companion} supports — never exposes vendor information beyond RBAC or automates contract actions without approval.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans steward vendor decisions and partnership accountability.', '${P.companion} informs and supports.', 'Visibility before assumptions — relationships before transactions.', 'Growth Partner — never Affiliate.', 'Enterprise Resilience Era — ${P.eraRange}.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — vendor oversight signals max ~500 chars. No raw operational PII, confidential partnership content, or protected contract documentation beyond RBAC.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const anchor = "'aipify_business_continuity_crisis_management_engine'";
  if (!sql.includes(anchor)) return sql;
  return sql.replace(anchor, `${anchor},\n    '${P.decisionType}'`);
}

function patchMigration(sql) {
  sql = patchDecisionTypeChain(sql);
  const oldBpStart = sql.indexOf("create or replace function public._abccebp227_distinction_note()");
  const newBpStart = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const refreshAnchor = `create or replace function public._${P.helper}_refresh_metrics`;
  const end = sql.indexOf(refreshAnchor);
  const start = newBpStart !== -1 ? newBpStart : oldBpStart;
  if (start !== -1 && end !== -1) {
    sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);
  }

  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_vendor_registry\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Vendor registry — five reflection questions', 'met', jsonb_array_length(public._${P.bp}_vendor_registry()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${P.bp}_era_opener_summary()) = 2,`,
  );

  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_vendor_dashboard\(\)->'capabilities'\) = \d+,/,
    `jsonb_build_object('key', 'center', 'label', 'Vendor Center — nine capabilities', 'met', jsonb_array_length(public._${P.bp}_vendor_dashboard()->'capabilities') = 9,`,
  );

  for (const fn of [
    "vendor_dashboard",
    "vendor_registry",
    "contract_lifecycle_center",
    "executive_vendor_briefings",
    "vendor_companion",
    "vendor_risk_monitor",
    "performance_review_framework",
    "strategic_partnership_hub",
    "risk_trust_cockpit_integration",
    "vendor_knowledge_libraries",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${P.bp}_${fn}()`);
  }

  sql = sql.replace(
    /select 'aipify-business-continuity-crisis-management-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replaceAll(
    "RBAC-protected business continuity and crisis management guidance within Enterprise Resilience Era; cross-link only for Risk Center Phase 226, Operations Center, and Executive Cockpit Phase 200.",
    "RBAC-protected vendor and third-party relationship guidance within Enterprise Resilience Era; cross-link only for Risk Center Phase 226, Trust Center, and Executive Cockpit Phase 200.",
  );

  return sql;
}

function genMigration() {
  const src227 = path.join(ROOT, "supabase/migrations/20261388000000_aipify_business_continuity_crisis_management_engine_phase227.sql");
  if (!fs.existsSync(src227)) throw new Error("Phase 227 migration required");
  let m = transformFrom227(fs.readFileSync(src227, "utf8"));
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genStack() {
  const srcSlug = "aipify-business-continuity-crisis-management-engine";
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);

  write(path.join(ROOT, `lib/core/${P.slug}.ts`), transformFrom227(fs.readFileSync(path.join(ROOT, `lib/core/${srcSlug}.ts`), "utf8")));
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom227(fs.readFileSync(path.join(ROOT, `lib/aipify/${srcSlug}/${f}`), "utf8")));
  }
  const panel = path.join(ROOT, `components/app/${srcSlug}/AipifyBusinessContinuityCrisisManagementEngineDashboardPanel.tsx`);
  write(path.join(ROOT, `components/app/${P.slug}/${P.base}EngineDashboardPanel.tsx`), transformFrom227(fs.readFileSync(panel, "utf8")));
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${P.base}EngineDashboardPanel } from "./${P.base}EngineDashboardPanel";\n`);
  write(path.join(ROOT, `app/app/${P.slug}/page.tsx`), transformFrom227(fs.readFileSync(path.join(ROOT, `app/app/${srcSlug}/page.tsx`), "utf8")));
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom227(fs.readFileSync(path.join(ROOT, `app/api/aipify/${srcSlug}/${route}/route.ts`), "utf8")),
    );
  }
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} supports vendor and third-party relationship management — does NOT expose vendor information beyond RBAC, protected contract documentation, or confidential partnership information beyond role-based access.

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

## What is the Vendor & Third-Party Relationship Engine?

Vendor & Third-Party Relationship Management provides centralized vendor oversight, contract lifecycle tracking, and strategic partnership governance at \`/app/${P.slug}\`.

## Does the Vendor Companion replace human vendor stewardship?

**No.** ${P.companion} prepares vendor visibility and relationship summaries — it does **NOT** expose vendor information beyond RBAC, protected contract documentation, or confidential partnership information beyond role-based access, or automate contract actions without human approval.

## What does the Vendor Center include?

Vendor dashboard, vendor registry, contract lifecycle center, vendor risk monitor, performance review framework, strategic partnership hub, executive vendor briefings, and Risk Center/Trust Center/Executive Cockpit integration — RBAC-protected metadata only.

## How does this relate to Risk Center, Trust Center, and Executive Cockpit?

Cross-link only: Risk Center Phase 226 (\`/app/aipify-enterprise-risk-resilience-engine\`), Trust Center (\`/platform/trust\`), and Executive Cockpit Phase 200 (\`/app/aipify-executive-operating-system-founders-cockpit-engine\`). Never duplicate their RPCs.

## Why are RBAC and contract documentation protections required?

Humans retain vendor stewardship authority. Aipify tracks vendor and contract metadata — it does not expose vendor information beyond role-based access or protected contract documentation beyond approved controls.
`,
  );
  write(
    path.join(ROOT, `aipify-core/knowledge/internal-language-model/${P.ilmFile}`),
    `ABOS Phase ${P.phase} — ${P.title}
Route: /app/${P.slug}

Vendor Center: vendor dashboard, vendor registry, contract lifecycle center, vendor risk monitor, performance review framework, strategic partnership hub, executive vendor briefings, risk/trust/cockpit integration (cross-links), vendor knowledge libraries.
Vendor Registry: approved vendor records, categorization by type and criticality, and organizational ownership.
Contract Lifecycle Center: contract milestones, upcoming renewals, and agreements requiring review.
Vendor Risk Monitor: third-party dependencies, vendor-related risks, and mitigation planning.
Performance Review Framework: periodic evaluations, service quality, and reliability tracking.
Strategic Partnership Hub: key partnerships, executive oversight, and long-term collaboration.
Executive Vendor Briefings: concise leadership summaries and emerging concern highlights.
Design principles: Visibility before assumptions, relationships before transactions, stewardship before convenience.
Companion limitations: no vendor information beyond RBAC, no exposing protected contract documentation or confidential partnership information.
${P.crossLinkNote}
People First. Growth Partner — never Affiliate.
`,
  );
  write(
    path.join(ROOT, `lib/internal-language-model/implementation-blueprint-phase${P.phase}-vocabulary.ts`),
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} supports; never exposes vendor information beyond RBAC, protected contract documentation, or confidential partnership information beyond role-based access.";
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
    c = c.replace('| "aipifyBusinessContinuityCrisisManagementEngine"', `| "aipifyBusinessContinuityCrisisManagementEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    const anchor = /id: "aipifyBusinessContinuityCrisisManagementEngine",[\s\S]*?labelKey: "customerApp\.nav\.aipifyBusinessContinuityCrisisManagementEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-business-continuity-crisis-management-engine")) {\n    return "aipifyBusinessContinuityCrisisManagementEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-business-continuity-crisis-management-engine")) {\n    return "aipifyBusinessContinuityCrisisManagementEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      c = c.replace('"aipify_business_continuity_crisis_management.steward",', `"aipify_business_continuity_crisis_management.steward",\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    c = c.replace(
      'export * from "./aipify-business-continuity-crisis-management-engine";',
      `export * from "./aipify-business-continuity-crisis-management-engine";\nexport * from "./${P.slug}";`,
    );
    fs.writeFileSync(path.join(ROOT, "lib/core/tenant.ts"), c);
  }
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} supports vendor oversight, contract lifecycle tracking, and strategic partnership governance. Supports administrators — does NOT expose vendor information beyond RBAC. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Vendor governance score",
    modeLabel: "Mode",
    readinessLabel: "Vendor governance level",
    executiveReviews: "Executive vendor briefings",
    activeReflections: "Active vendor relationship scaffolds",
    humanOversightRequired: `Human oversight required — humans steward vendor decisions; ${P.companion} supports only`,
    eraOpenerSummary: `Enterprise Resilience Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate Risk Center, Trust Center, or Executive Cockpit RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Vendor registry — governance prompts",
    frameworkLabel: "Contract lifecycle center",
    reviewsLabel: "Executive vendor briefings",
    companionLabel: `${P.companion} — supports visibility, never replaces human vendor stewardship`,
    subEngineLabel: "Vendor risk monitor",
    reflections: "Vendor relationship scaffolds",
    executiveReviewEntries: "Contract milestone entries",
    scaffoldNotes: "RBAC-protected vendor relationship scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT expose vendor information beyond RBAC, protected contract documentation, or confidential partnership information`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports vendor oversight visibility — humans retain vendor stewardship authority.`,
      philosophy: "People First. RBAC-protected vendor relationship scaffolds. Growth Partner terminology — never Affiliate.",
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
        ? "Leverandører og partnere"
        : locale === "sv"
          ? "Leverantörer och partners"
          : locale === "da"
            ? "Leverandører og partnere"
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
      'export * from "./implementation-blueprint-phase227-vocabulary";',
      `export * from "./implementation-blueprint-phase227-vocabulary";\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`,
    );
  }
  if (!c.includes(`IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS`)) {
    c = c.replace(
      'export const IMPLEMENTATION_BLUEPRINT_PHASE227_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase227-aipify-business-continuity-crisis-management.txt";',
      `export const IMPLEMENTATION_BLUEPRINT_PHASE227_CORPUS =\n  "aipify-core/knowledge/internal-language-model/implementation-blueprint-phase227-aipify-business-continuity-crisis-management.txt";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "aipify-core/knowledge/internal-language-model/${P.ilmFile}";`,
    );
  }
  fs.writeFileSync(file, c);
}

function patchArchitecture() {
  const file = path.join(ROOT, "ARCHITECTURE.md");
  let c = fs.readFileSync(file, "utf8");
  const marker =
    "Permissions `aipify_business_continuity_crisis_management.view`, `aipify_business_continuity_crisis_management.manage`, `aipify_business_continuity_crisis_management.steward`.";
  const entry = `\n**Aipify Vendor & Third-Party Relationship Engine (Phase 228):** See [AIPIFY_VENDOR_THIRD_PARTY_RELATIONSHIP_ENGINE_PHASE228.md](./AIPIFY_VENDOR_THIRD_PARTY_RELATIONSHIP_ENGINE_PHASE228.md) — Vendor Center for vendor dashboard, vendor registry, contract lifecycle center, vendor risk monitor, performance review framework, strategic partnership hub, executive vendor briefings, and Risk Center/Trust Center/Executive Cockpit integration. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} supports — **NOT** exposing vendor information beyond RBAC, protected contract documentation, or confidential partnership information beyond role-based access. Cross-links only: Risk Center Phase 226, Trust Center, Executive Cockpit Phase 200. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  if (!c.includes("Phase 228")) {
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
