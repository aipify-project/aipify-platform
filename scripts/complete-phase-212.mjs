#!/usr/bin/env node
/** ABOS Phase 212 — Aipify Innovation & Opportunity Discovery Engine */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const D = "$$";

const P = {
  phase: 212,
  migration: "20261372000000_aipify_innovation_opportunity_discovery_engine_phase212.sql",
  slug: "aipify-innovation-opportunity-discovery-engine",
  base: "AipifyInnovationOpportunityDiscovery",
  camel: "aipifyInnovationOpportunityDiscoveryEngine",
  snake: "aipify_innovation_opportunity_discovery",
  permPrefix: "aipify_innovation_opportunity_discovery",
  helper: "aiode",
  bp: "aiodebp212",
  decisionType: "aipify_innovation_opportunity_discovery_engine",
  prevDecision: "aipify_continuous_improvement_optimization_engine",
  title: "Aipify Innovation & Opportunity Discovery",
  centerTitle: "Innovation Discovery Center",
  companion: "Discovery Companion",
  scoreKey: "aipify_innovation_opportunity_discovery_score",
  modeKey: "innovation_discovery_mode",
  levelKey: "innovation_maturity_level",
  thirdEntity: "discovery_notes",
  era: "Innovation & Adaptive Excellence Era (211–220)",
  eraRange: "211–220",
  docSlug: "AIPIFY_INNOVATION_OPPORTUNITY_DISCOVERY_ENGINE",
  ilmFile: "implementation-blueprint-phase212-aipify-innovation-opportunity-discovery.txt",
  navLabel: "Innovation Discovery",
  crossLinkNote:
    "Cross-links only: Phase 211 continuous improvement, Phase 96 innovation lab, Phase A.87 curiosity discovery, Phase 200 executive cockpit — never auto-prioritize innovation bets, launch experiments without approval, or expose sensitive business strategy.",
  ilmExtra: `
Innovation Discovery Center: innovation dashboard, opportunity scanning engine, innovation opportunity center, idea exploration framework, curiosity experimentation hub, executive innovation insights dashboard, continuous improvement/innovation lab integration (cross-links), discovery knowledge libraries.
Opportunity Scanning Engine prompts: emerging signals, market shifts, workflow innovation gaps, curiosity cues, sustainable opportunity patterns.
Innovation Opportunity Center: opportunity scaffolds, exploration suggestions, human approval gates, metadata-only tracking, advisory only.
Idea Exploration Framework: idea scaffolds, exploration checkpoints, curiosity before certainty.
Curiosity Experimentation Hub: experimentation cross-links, innovation lab integration — humans decide.
Design principles: curiosity before certainty, exploration before commitment, humans before automation.
Companion limitations: no auto-prioritizing innovation bets, no launching experiments without approval, no replacing human innovation stewardship, no exposing sensitive business strategy, no bypassing RBAC audit.
Opens Innovation & Adaptive Excellence Era (211–220).`,
  faqBody: `## What is Innovation & Opportunity Discovery Engine?

Innovation & Opportunity Discovery helps organizations systematically surface innovation signals, explore opportunities, and prepare human-stewarded discovery — at \`/app/aipify-innovation-opportunity-discovery-engine\`.

## Does the Discovery Companion prioritize innovation bets automatically?

**No.** The Discovery Companion surfaces opportunity signals and exploration insights — it does NOT auto-prioritize innovation bets or launch experiments without human approval.

## What does the Innovation Discovery Center show?

Innovation signals, opportunity scaffolds, idea exploration frameworks, curiosity cues, and executive innovation summaries — metadata only.

## How does this relate to Continuous Improvement, Innovation Lab, and Curiosity Discovery?

Cross-link only: Phase 211 continuous improvement (\`/app/aipify-continuous-improvement-optimization-engine\`), Phase 96 innovation lab (\`/app/innovation-lab\`), Phase A.87 curiosity discovery (\`/app/curiosity-discovery-engine\`), Phase 200 executive cockpit (\`/app/aipify-executive-operating-system-founders-cockpit-engine\`). Never duplicate their RPCs.

## Why human innovation stewardship?

Humans retain innovation authority. Aipify advises and suggests — it does not auto-prioritize bets or launch experiments without explicit approval.`,
  companionLimitations: [
    "auto_prioritizing_innovation_bets",
    "launching_experiments_without_approval",
    "replacing_human_innovation_stewardship",
    "exposing_sensitive_business_strategy",
    "bypassing_rbac_audit",
    "override_human_approval",
  ],
};

const SRC_SLUG = "aipify-continuous-improvement-optimization-engine";

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("wrote", path.relative(ROOT, file));
}

function transformFrom211(content) {
  const thirdPascal = P.thirdEntity.split("_").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
  const pairs = [
    ["AipifyContinuousImprovementOptimization", P.base],
    [SRC_SLUG, P.slug],
    ["aipify_continuous_improvement_optimization", P.snake],
    ["continuousImprovementOptimizationEngine", P.camel],
    ["aipifyContinuousImprovementOptimization", P.camel.replace(/Engine$/, "")],
    ["acioebp211", P.bp],
    ["_acioe_", `_${P.helper}_`],
    ["aipify_continuous_improvement_optimization_score", P.scoreKey],
    ["improvement_optimization_mode", P.modeKey],
    ["improvement_maturity_level", P.levelKey],
    ["improvement_notes", P.thirdEntity],
    ["ImprovementNote", thirdPascal.replace("Notes", "Note")],
    ["improvement_notes_count", `${P.thirdEntity}_count`],
    ["Improvement Center", P.centerTitle],
    ["Improvement Companion", P.companion],
    ["Aipify Continuous Improvement & Optimization", P.title],
    ["Continuous Improvement & Optimization", "Innovation & Opportunity Discovery"],
    ["Continuous Improvement", P.navLabel],
    ["Phase 211", `Phase ${P.phase}`],
    ["aipify_continuous_improvement_optimization_engine", P.decisionType],
    ["aipify_continuous_improvement_optimization.view", `${P.permPrefix}.view`],
    ["aipify_continuous_improvement_optimization.manage", `${P.permPrefix}.manage`],
    ["aipify_continuous_improvement_optimization.steward", `${P.permPrefix}.steward`],
    ["20261371000000_aipify_continuous_improvement_optimization_engine_phase211.sql", P.migration],
    ["Repo Phase 211", `Repo Phase ${P.phase}`],
    ["Phase 211 —", `Phase ${P.phase} —`],
    [
      "IMPLEMENTATION_BLUEPRINT_PHASE211_AIPIFY_CONTINUOUS_IMPROVEMENT_OPTIMIZATION_ENGINE",
      `IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}`,
    ],
    ["implementation-blueprint-phase211", `implementation-blueprint-phase${P.phase}`],
    ["improvement_dashboard", "innovation_dashboard"],
    ["opportunity_detection_engine", "opportunity_scanning_engine"],
    ["improvement_initiative_center", "innovation_opportunity_center"],
    ["continuous_improvement_reviews", "executive_innovation_insights_dashboard"],
    ["improvement_companion", "discovery_companion"],
    ["lessons_learned_repository", "idea_exploration_framework"],
    ["optimization_impact_dashboard", "curiosity_experimentation_hub"],
    ["operations_action_executive_integration", "continuous_improvement_innovation_lab_integration"],
    ["improvement_knowledge_libraries", "discovery_knowledge_libraries"],
    ["lessons_learned_repository_meta", "idea_exploration_framework_meta"],
    ["optimization_impact_dashboard_meta", "curiosity_experimentation_hub_meta"],
    ["operations_action_executive_integration_meta", "continuous_improvement_innovation_lab_integration_meta"],
    ["Continuous Improvement Reviews", "Executive Innovation Insights Dashboard"],
    ["continuous improvement optimization within", "innovation opportunity discovery within"],
    ["_seed_improvement_notes", `_seed_${P.thirdEntity.replace("_notes", "")}_notes`],
    ["auto-prioritize initiatives without approval", "auto-prioritize innovation bets without approval"],
    ["launch initiatives without approval", "launch experiments without approval"],
    ["Improvement Companion supports", "Discovery Companion supports"],
    [
      "never auto-prioritizes initiatives or launches improvements without approval",
      "never auto-prioritizes innovation bets or launches experiments without approval",
    ],
    [
      "supports — does not auto-prioritize initiatives or launch improvements without approval",
      "supports — does not auto-prioritize innovation bets or launch experiments without approval",
    ],
    [
      "supports improvement visibility, does not auto-prioritize initiatives or launch improvements without approval",
      "supports discovery visibility, does not auto-prioritize innovation bets or launch experiments without approval",
    ],
    ["continuous improvement tracking", "innovation discovery tracking"],
    ["Human-stewarded continuous improvement", "Human-stewarded innovation discovery"],
    ["approval_required", "exploration_approval_required"],
    ["Improvement score", "Discovery score"],
    ["Improvement maturity level", "Innovation maturity level"],
    ["Opportunity detection engine", "Opportunity scanning engine"],
    ["Improvement initiative center", "Innovation opportunity center"],
    ["Lessons Learned Repository", "Idea Exploration Framework"],
    ["Optimization Impact Dashboard", "Curiosity Experimentation Hub"],
    ["Operations Action Executive Integration", "Continuous Improvement Innovation Lab Integration"],
    ["Opportunity detection scaffolds", "Opportunity scanning scaffolds"],
    ["Improvement review entries", "Executive innovation insight entries"],
    ["humans steward improvement initiatives and approval", "humans steward innovation exploration and approval"],
    [
      "improvement opportunities, initiative stewardship, and optimization impact",
      "innovation signals, opportunity exploration, and curiosity cues",
    ],
    [
      "does NOT auto-prioritize initiatives or launch improvements without approval",
      "does NOT auto-prioritize innovation bets or launch experiments without approval",
    ],
    [
      "never auto-prioritizes initiatives without approval",
      "never auto-prioritizes innovation bets without approval",
    ],
    ["auto_prioritization", "auto_prioritizing_innovation_bets"],
    ["launching_initiatives_without_approval", "launching_experiments_without_approval"],
    ["punitive_optimization_enforcement", "exposing_sensitive_business_strategy"],
    ["raw_operational_pii_in_scaffolds", "bypassing_rbac_audit"],
    ["replacing_human_judgment", "replacing_human_innovation_stewardship"],
    ["AIPIFY_CONTINUOUS_IMPROVEMENT_OPTIMIZATION_ENGINE", P.docSlug],
    ["workflow_efficiency", "emerging_signals"],
    ["process_refinement", "market_shifts"],
    ["operational_excellence", "workflow_innovation_gaps"],
    ["lessons_integration", "curiosity_cues"],
    ["sustainable_optimization", "sustainable_opportunity_patterns"],
    ["initiative_stewardship", "opportunity_scaffolds"],
    ["opportunity_signals", "exploration_suggestions"],
    ["lessons_learned", "idea_scaffolds"],
    ["impact_measurement", "exploration_checkpoints"],
    ["review_cadence", "curiosity_before_certainty"],
    ["active_opportunities", "active_innovation_signals"],
    ["pending_initiatives", "pending_explorations"],
    ["optimization_readiness", "innovation_readiness"],
    ["initiative_approval_tracking", "exploration_approval_tracking"],
    ["opportunity_summaries", "opportunity_insights"],
    ["optimization_insights", "curiosity_insights"],
    ["improvement_prompts", "discovery_prompts"],
    ["impact_insights", "signal_insights"],
    ["approval_gate_reminders", "exploration_approval_reminders"],
    ["reflection_before_reaction", "curiosity_before_certainty"],
    ["stewardship_before_speed", "exploration_before_commitment"],
    ["human_approval_before_initiative_launch", "humans_before_automation"],
    ["aipify_continuous_improvement_optimization_audit_logs", "aipify_innovation_opportunity_discovery_audit_logs"],
    ["aipify_continuous_improvement_optimization permissions", "aipify_innovation_opportunity_discovery permissions"],
    ["Metadata-only improvement scaffolds", "Metadata-only discovery scaffolds"],
    ["Operational PII protection", "Business strategy protection"],
    ["continuous improvement optimization visibility", "innovation opportunity discovery visibility"],
    ["human approval gates", "human exploration gates"],
    ["systematic improvement without pressure", "systematic discovery without pressure"],
    ["opportunity summaries and optimization insights", "opportunity insights and curiosity cues"],
    ["auto-prioritize initiatives", "auto-prioritize innovation bets"],
    ["launch improvements", "launch experiments"],
    ["Operational Excellence & Continuous Improvement Era (211+)", P.era],
    ["Operational Excellence Era — Phase 211+", `Innovation Era — Phases ${P.eraRange}`],
    ["Operational Excellence Opener", "Innovation Era Opener"],
    ["OPERATIONAL EXCELLENCE OPENER", "INNOVATION ERA OPENER"],
    ["Operational excellence opener", "Innovation era opener"],
    ["operational excellence opener", "innovation era opener"],
    ["211+", P.eraRange],
    ["211", "212"],
    ["operations orchestration", "continuous improvement"],
    ["Operations Orchestration Phase 208", "Continuous Improvement Phase 211"],
    ["/app/aipify-operations-orchestration-engine", "/app/aipify-continuous-improvement-optimization-engine"],
    ["action_center_execution", "innovation_lab"],
    ["Action Center Phase 205", "Innovation Lab Phase 96"],
    ["/app/aipify-action-center-execution-engine", "/app/innovation-lab"],
    ["executive_cockpit", "curiosity_discovery"],
    ["Executive Cockpit Phase 200", "Curiosity Discovery Phase A.87"],
    ["/app/aipify-executive-operating-system-founders-cockpit-engine", "/app/curiosity-discovery-engine"],
    ["operating_cadence", "executive_cockpit"],
    ["Operating Cadence Phase 210", "Executive Cockpit Phase 200"],
    ["/app/aipify-organizational-rhythms-operating-cadence-engine", "/app/aipify-executive-operating-system-founders-cockpit-engine"],
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
  const src = path.join(ROOT, `lib/aipify/${SRC_SLUG}`);
  const dst = path.join(ROOT, `lib/aipify/${P.slug}`);
  for (const f of ["types.ts", "parse.ts", "index.ts"]) {
    write(path.join(dst, f), transformFrom211(fs.readFileSync(path.join(src, f), "utf8")));
  }
  const panel = path.join(
    ROOT,
    `components/app/${SRC_SLUG}/AipifyContinuousImprovementOptimizationEngineDashboardPanel.tsx`,
  );
  write(
    path.join(ROOT, `components/app/${P.slug}/${engine}DashboardPanel.tsx`),
    transformFrom211(fs.readFileSync(panel, "utf8")),
  );
  write(path.join(ROOT, `components/app/${P.slug}/index.ts`), `export { ${engine}DashboardPanel } from "./${engine}DashboardPanel";\n`);
  write(
    path.join(ROOT, `app/app/${P.slug}/page.tsx`),
    transformFrom211(fs.readFileSync(path.join(ROOT, `app/app/${SRC_SLUG}/page.tsx`), "utf8")),
  );
  for (const route of ["dashboard", "card"]) {
    write(
      path.join(ROOT, `app/api/aipify/${P.slug}/${route}/route.ts`),
      transformFrom211(fs.readFileSync(path.join(ROOT, `app/api/aipify/${SRC_SLUG}/${route}/route.ts`), "utf8")),
    );
  }
}

function blueprintSql() {
  const bp = P.bp;
  return `
create or replace function public._${bp}_distinction_note() returns text language sql immutable as ${D} select 'ABOS Phase ${P.phase} — ${P.centerTitle}. ${P.companion} supports discovery visibility — NOT auto-prioritizing innovation bets or launching experiments without approval. Helpers _${bp}_*.'; ${D};
create or replace function public._${bp}_mission() returns text language sql immutable as ${D} select 'Help organizations systematically surface innovation signals, explore opportunities, and prepare human-stewarded discovery — ${P.companion} prepares, humans steward exploration and approval.'; ${D};
create or replace function public._${bp}_philosophy() returns text language sql immutable as ${D} select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Growth Partner — never Affiliate.'; ${D};
create or replace function public._${bp}_abos_principle() returns text language sql immutable as ${D}
  select 'Aipify Business Operating System (ABOS) — ${P.centerTitle} within Innovation Era (${P.eraRange}) — OPENER. Human-stewarded innovation discovery; metadata-only scaffolds; ${P.companion} informs and suggests.'; ${D};
create or replace function public._${bp}_vision() returns text language sql immutable as ${D} select 'Organizations where innovation signals are surfaced responsibly, exploration requires human approval, curiosity is encouraged, and humans retain innovation authority.'; ${D};
create or replace function public._${bp}_objectives() returns jsonb language sql immutable as ${D}
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', '${P.centerTitle} programs', 'emoji', '✅', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'opportunity_scanning_engine', 'label', 'Opportunity scanning engine', 'emoji', '🔍', 'description', 'Innovation signal prompts'),
    jsonb_build_object('key', 'opportunity_center', 'label', 'Innovation opportunity center', 'emoji', '🛡️', 'description', 'Opportunity exploration domains'),
    jsonb_build_object('key', 'innovation_insights', 'label', 'Executive innovation insights', 'emoji', '👥', 'description', 'Leadership discovery reflection'),
    jsonb_build_object('key', 'companion', 'label', '${P.companion}', 'emoji', '✨', 'description', 'Supports — does not auto-prioritize'),
    jsonb_build_object('key', 'idea_exploration_framework', 'label', 'Idea Exploration Framework', 'emoji', '📖', 'description', 'Approved idea scaffolds'),
    jsonb_build_object('key', 'curiosity_experimentation_hub', 'label', 'Curiosity Experimentation Hub', 'emoji', '📊', 'description', 'Experimentation cross-links'),
    jsonb_build_object('key', 'discovery_libraries', 'label', 'Discovery knowledge libraries', 'emoji', '🌱', 'description', 'Approved discovery resources')
  ); ${D};
create or replace function public._${bp}_innovation_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.centerTitle} — eight capabilities. Curiosity before certainty.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'innovation_dashboard', 'label', 'Innovation Dashboard — active signals, exploration status, discovery visibility'),
    jsonb_build_object('key', 'opportunity_scanning_engine', 'label', 'Opportunity Scanning Engine — emerging signals, market shifts, innovation gaps'),
    jsonb_build_object('key', 'innovation_opportunity_center', 'label', 'Innovation Opportunity Center — human-approved explorations, stewardship tracking, approval gates'),
    jsonb_build_object('key', 'idea_exploration_framework', 'label', 'Idea Exploration Framework — approved idea scaffolds, exploration checkpoints, curiosity cues'),
    jsonb_build_object('key', 'curiosity_experimentation_hub', 'label', 'Curiosity Experimentation Hub — experimentation cross-links, innovation lab integration'),
    jsonb_build_object('key', 'executive_innovation_insights_dashboard', 'label', 'Executive Innovation Insights Dashboard — leadership visibility, discovery summaries'),
    jsonb_build_object('key', 'continuous_improvement_innovation_lab_integration', 'label', 'Continuous Improvement, Innovation Lab & Curiosity Discovery integration — cross-links only'),
    jsonb_build_object('key', 'discovery_knowledge_libraries', 'label', 'Discovery knowledge libraries — approved innovation resources')
  )); ${D};
create or replace function public._${bp}_opportunity_scanning_engine() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Opportunity scanning prompts — humans steward innovation exploration and approval.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'emerging_signals', 'label', 'What emerging signals deserve exploration without pressure?'),
    jsonb_build_object('key', 'market_shifts', 'label', 'Which market shifts need human-stewarded discovery?'),
    jsonb_build_object('key', 'workflow_innovation_gaps', 'label', 'Where do workflow innovation gaps appear sustainably?'),
    jsonb_build_object('key', 'curiosity_cues', 'label', 'What curiosity cues invite exploration with approval?'),
    jsonb_build_object('key', 'sustainable_opportunity_patterns', 'label', 'Where do opportunity patterns remain sustainable and human-approved?')
  )); ${D};
create or replace function public._${bp}_innovation_opportunity_center() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Innovation opportunity center — human approval before experiment launch.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'opportunity_scaffolds', 'label', 'Opportunity scaffolds'),
    jsonb_build_object('key', 'exploration_suggestions', 'label', 'Exploration suggestions'),
    jsonb_build_object('key', 'idea_scaffolds', 'label', 'Idea scaffolds'),
    jsonb_build_object('key', 'exploration_checkpoints', 'label', 'Exploration checkpoints'),
    jsonb_build_object('key', 'curiosity_before_certainty', 'label', 'Curiosity before certainty'),
    jsonb_build_object('key', 'enterprise_scale', 'label', 'Enterprise scale'),
    jsonb_build_object('key', 'human_exploration_gates', 'label', 'Human exploration gates')
  )); ${D};
create or replace function public._${bp}_executive_innovation_insights_dashboard() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Executive innovation insights — exploration before commitment.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'active_innovation_signals', 'label', 'Active innovation signals'),
    jsonb_build_object('key', 'pending_explorations', 'label', 'Pending explorations'),
    jsonb_build_object('key', 'curiosity_cues', 'label', 'Curiosity cues'),
    jsonb_build_object('key', 'innovation_readiness', 'label', 'Innovation readiness'),
    jsonb_build_object('key', 'exploration_approval_tracking', 'label', 'Exploration approval tracking')
  )); ${D};
create or replace function public._${bp}_discovery_companion() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', '${P.companion} — supports discovery visibility, does not auto-prioritize innovation bets or launch experiments without approval.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'opportunity_insights', 'label', 'Opportunity insights'),
    jsonb_build_object('key', 'exploration_reminders', 'label', 'Exploration reminders'),
    jsonb_build_object('key', 'curiosity_insights', 'label', 'Curiosity insights'),
    jsonb_build_object('key', 'discovery_prompts', 'label', 'Discovery prompts'),
    jsonb_build_object('key', 'signal_insights', 'label', 'Signal insights'),
    jsonb_build_object('key', 'exploration_approval_reminders', 'label', 'Exploration approval reminders — RBAC enforced')
  )); ${D};
create or replace function public._${bp}_idea_exploration_framework() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Idea Exploration Framework — approved idea scaffolds.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'approved_ideas', 'label', 'Approved ideas — metadata only'),
    jsonb_build_object('key', 'exploration_summaries', 'label', 'Exploration summary scaffolds'),
    jsonb_build_object('key', 'curiosity_reuse', 'label', 'Curiosity reuse prompts'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Discovery audit trails'),
    jsonb_build_object('key', 'metadata_only_tracking', 'label', 'Metadata-only tracking — no sensitive business strategy'),
    jsonb_build_object('key', 'human_exploration_gates', 'label', 'Human exploration gates for experiment launch')
  )); ${D};
create or replace function public._${bp}_curiosity_experimentation_hub() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Curiosity Experimentation Hub — cross-links, not auto-prioritization.', 'practices', jsonb_build_array(
    jsonb_build_object('key', 'experimentation_cross_links', 'label', 'Experimentation cross-links — aggregate only'),
    jsonb_build_object('key', 'innovation_lab_integration', 'label', 'Innovation Lab Phase 96 cross-link', 'cross_link', '/app/innovation-lab'),
    jsonb_build_object('key', 'curiosity_discovery_integration', 'label', 'Curiosity Discovery Phase A.87 cross-link', 'cross_link', '/app/curiosity-discovery-engine'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Discovery audit trails'),
    jsonb_build_object('key', 'no_auto_prioritization', 'label', 'Never auto-prioritize innovation bets'),
    jsonb_build_object('key', 'continuous_improvement_cross_link', 'label', 'Continuous Improvement Phase 211 cross-link', 'cross_link', '/app/aipify-continuous-improvement-optimization-engine')
  )); ${D};
create or replace function public._${bp}_continuous_improvement_innovation_lab_integration() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Continuous Improvement, Innovation Lab & Executive integration — cross-links only, not duplicated RPCs.', 'tracks', jsonb_build_array(
    jsonb_build_object('key', 'continuous_improvement', 'label', 'Continuous Improvement Phase 211', 'cross_link', '/app/aipify-continuous-improvement-optimization-engine'),
    jsonb_build_object('key', 'innovation_lab', 'label', 'Innovation Lab Phase 96', 'cross_link', '/app/innovation-lab'),
    jsonb_build_object('key', 'curiosity_discovery', 'label', 'Curiosity Discovery Phase A.87', 'cross_link', '/app/curiosity-discovery-engine'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'cross_link', '/app/aipify-executive-operating-system-founders-cockpit-engine'),
    jsonb_build_object('key', 'cross_link_only', 'label', 'Cross-link only — never duplicate engine RPCs'),
    jsonb_build_object('key', 'stewardship_loops', 'label', 'Innovation discovery stewardship loops'),
    jsonb_build_object('key', 'no_auto_launch', 'label', 'Never launch experiments without approval')
  )); ${D};
create or replace function public._${bp}_companion_limitations() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('must_avoid', jsonb_build_array('Auto-prioritizing innovation bets',
      'Launching experiments without human approval',
      'Replacing human innovation stewardship',
      'Exposing sensitive business strategy',
      'Bypassing RBAC audit requirements',
      'Override human approval'), 'principle', '${P.companion} advises — humans steward exploration and approval.'); ${D};
create or replace function public._${bp}_self_love_connection() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('principle', 'Self Love — curiosity, patience, and service toward innovation discovery without pressure.', 'values', jsonb_build_array('curiosity_before_certainty','exploration_before_commitment','humans_before_automation','patience','service','recognition'), 'cross_link', '/app/self-love-engine'); ${D};
create or replace function public._${bp}_security_requirements() returns jsonb language sql immutable as ${D}
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Discovery audit logs via aipify_innovation_opportunity_discovery_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via aipify_innovation_opportunity_discovery permissions — exploration approval RBAC'),
    jsonb_build_object('key', 'metadata_only', 'label', 'Metadata-only discovery scaffolds — Trust Architecture'),
    jsonb_build_object('key', 'strategy_protection', 'label', 'Business strategy protection — no sensitive records in scaffolds'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); ${D};
create or replace function public._${bp}_era_opener_summary() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('phase', 211, 'key', 'continuous_improvement_optimization', 'label', 'Continuous Improvement Phase 211', 'route', '/app/aipify-continuous-improvement-optimization-engine', 'description', 'Cross-link only'),
    jsonb_build_object('phase', 212, 'key', 'innovation_opportunity_discovery', 'label', 'Innovation Discovery Phase 212 — ERA OPENER', 'route', '/app/${P.slug}', 'description', 'Human-stewarded innovation discovery — innovation era opener')
  ); ${D};
create or replace function public._${bp}_extended_cross_links() returns jsonb language sql immutable as ${D} select jsonb_build_array(
    jsonb_build_object('key', 'continuous_improvement', 'label', 'Continuous Improvement Phase 211', 'route', '/app/aipify-continuous-improvement-optimization-engine', 'relationship', 'Improvement visibility — cross-link only'),
    jsonb_build_object('key', 'innovation_lab', 'label', 'Innovation Lab Phase 96', 'route', '/app/innovation-lab', 'relationship', 'Experimentation — cross-link only'),
    jsonb_build_object('key', 'curiosity_discovery', 'label', 'Curiosity Discovery Phase A.87', 'route', '/app/curiosity-discovery-engine', 'relationship', 'Curiosity prompts — cross-link only'),
    jsonb_build_object('key', 'executive_cockpit', 'label', 'Executive Cockpit Phase 200', 'route', '/app/aipify-executive-operating-system-founders-cockpit-engine', 'relationship', 'Executive briefing — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love Engine', 'route', '/app/self-love-engine', 'relationship', 'Curiosity and patience — cross-link only')
  ); ${D};
create or replace function public._${bp}_integration_links() returns jsonb language sql stable as ${D} select public._${bp}_era_opener_summary() || public._${bp}_extended_cross_links(); ${D};
create or replace function public._${bp}_dogfooding() returns text language sql immutable as ${D}
  select 'Aipify uses ${P.centerTitle} internally with metadata-only discovery scaffolds and human exploration gates. Growth Partner terminology. ${P.companion} advises — never auto-prioritizes innovation bets or launches experiments without approval.'; ${D};
create or replace function public._${bp}_vision_phrases() returns jsonb language sql immutable as ${D}
  select jsonb_build_array('People First — humans steward exploration and approval.', '${P.companion} informs and suggests.', 'Curiosity before certainty — exploration before commitment.', 'Growth Partner — never Affiliate.', 'Innovation Era opener — Phase 212.'); ${D};
create or replace function public._${bp}_privacy_note() returns text language sql immutable as ${D}
  select '${P.centerTitle} metadata only — opportunity insights and signal summaries max ~500 chars. No sensitive business strategy, unauthorized records, or unapproved exploration content in audit payloads.'; ${D};
`.trim();
}

function patchDecisionTypeChain(sql) {
  if (sql.includes(`'${P.decisionType}'`)) return sql;
  const additions = [P.decisionType].filter((entry) => !sql.includes(`'${entry}'`));
  if (additions.length === 0) return sql;
  const anchor = sql.includes(`'${P.prevDecision}'`)
    ? `'${P.prevDecision}'`
    : "'aipify_organizational_rhythms_operating_cadence_engine'";
  return sql.replace(anchor, `${anchor},\n    ${additions.map((e) => `'${e}'`).join(",\n    ")}`);
}

function patchMigration(sql) {
  sql = sql.replace(
    /-- Phase \d+ —[^\n]+\n-- [^\n]+\n-- Helpers:[^\n]+/,
    `-- Phase ${P.phase} — ${P.title} Engine\n-- ${P.era} — OPENER.\n-- Helpers: _${P.helper}_* (engine), _${P.bp}_* (blueprint)`,
  );
  sql = patchDecisionTypeChain(sql);
  const start = sql.indexOf(`create or replace function public._${P.bp}_distinction_note()`);
  const end = sql.indexOf(`create or replace function public._${P.helper}_refresh_metrics`);
  if (start !== -1 && end !== -1) sql = sql.slice(0, start) + blueprintSql() + "\n\n" + sql.slice(end);

  const bp = P.bp;
  sql = sql.replace(
    /jsonb_build_object\('key', 'center', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_innovation_dashboard\(\)->'capabilities'\) = 8,/,
    `jsonb_build_object('key', 'center', 'label', '${P.centerTitle} — eight capabilities', 'met', jsonb_array_length(public._${bp}_innovation_dashboard()->'capabilities') = 8,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'engine', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_opportunity_scanning_engine\(\)->'reflection_questions'\) = 5,/,
    `jsonb_build_object('key', 'engine', 'label', 'Opportunity scanning engine — five questions', 'met', jsonb_array_length(public._${bp}_opportunity_scanning_engine()->'reflection_questions') = 5,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'companion', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_discovery_companion\(\)->'capabilities'\) = 6,/,
    `jsonb_build_object('key', 'companion', 'label', '${P.companion} capabilities', 'met', jsonb_array_length(public._${bp}_discovery_companion()->'capabilities') = 6,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'era', 'label', '[^']+', 'met', jsonb_array_length\(public\._\w+_era_opener_summary\(\)\) = \d+,/,
    `jsonb_build_object('key', 'era', 'label', 'Innovation Era phases ${P.eraRange} documented', 'met', jsonb_array_length(public._${bp}_era_opener_summary()) = 2,`,
  );
  sql = sql.replace(
    /jsonb_build_object\('key', 'baseline', 'label', 'Repo Phase \d+ baseline tables'/,
    `jsonb_build_object('key', 'baseline', 'label', 'Repo Phase ${P.phase} baseline tables'`,
  );

  for (const fn of [
    "innovation_dashboard",
    "opportunity_scanning_engine",
    "innovation_opportunity_center",
    "executive_innovation_insights_dashboard",
    "discovery_companion",
    "idea_exploration_framework",
    "curiosity_experimentation_hub",
    "continuous_improvement_innovation_lab_integration",
  ]) {
    sql = sql.replace(new RegExp(`public\\._\\w+_${fn}\\(\\)`, "g"), `public._${bp}_${fn}()`);
  }

  if (!sql.includes("continuous_improvement_innovation_lab_integration_meta")) {
    sql = sql.replace(
      `'sub_engine_meta', public._${bp}_idea_exploration_framework(),`,
      `'sub_engine_meta', public._${bp}_idea_exploration_framework(), 'curiosity_experimentation_hub_meta', public._${bp}_curiosity_experimentation_hub(), 'continuous_improvement_innovation_lab_integration_meta', public._${bp}_continuous_improvement_innovation_lab_integration(),`,
    );
  }

  sql = sql.replace(
    /select 'aipify-continuous-improvement-optimization-engine'[^;]+;/,
    `select '${P.slug}', '${P.title} Engine', '${P.centerTitle} — ${P.era}. People First.', 'authenticated', ${P.phase}
where not exists (select 1 from public.aipify_knowledge_categories where slug = '${P.slug}' and tenant_id is null);`,
  );

  sql = sql.replace(
    new RegExp(`Phase ${P.phase} ${P.title} Engine —[^']+`, "g"),
    `Phase ${P.phase} ${P.title} Engine — innovation opportunity discovery within Innovation Era; cross-link only for continuous improvement, innovation lab, curiosity discovery, and executive cockpit.`,
  );

  sql = sql.replace(
    new RegExp(`'phase', 'Phase ${P.phase} —[^']+', 'doc', '[^']+', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '[^']+'`, "g"),
    `'phase', 'Phase ${P.phase} — ${P.title} Engine (Innovation Era Opener)', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_${P.docSlug}.md', 'engine_phase', 'Repo Phase ${P.phase}', 'route', '/app/${P.slug}'`,
  );

  sql = sql.replace(/'title', 'Aipify Continuous Improvement & Optimization Engine'/g, `'title', '${P.title} Engine'`);

  return sql;
}

function genMigration() {
  const src211 = path.join(ROOT, "supabase/migrations/20261371000000_aipify_continuous_improvement_optimization_engine_phase211.sql");
  if (!fs.existsSync(src211)) throw new Error("Phase 211 migration required");
  let m = transformFrom211(fs.readFileSync(src211, "utf8"));
  m = m.replace(/_acioe_seed_improvement_notes/g, `_${P.helper}_seed_${P.thirdEntity.replace("_notes", "")}_notes`);
  write(path.join(ROOT, `supabase/migrations/${P.migration}`), patchMigration(m));
}

function genDocs() {
  write(
    path.join(ROOT, `${P.docSlug}_PHASE${P.phase}.md`),
    `# ${P.title} Engine — Phase ${P.phase}

## Vision

${P.centerTitle} within ${P.era}. ${P.companion} advises and suggests — does NOT auto-prioritize innovation bets or launch experiments without human approval.

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
    `export const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_MISSION = "${P.centerTitle} — ${P.companion} advises; never auto-prioritizes innovation bets.";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_ROUTE = "/app/${P.slug}";\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_COMPANION_LIMITATIONS = [\n${P.companionLimitations.map((l) => `  "${l}",`).join("\n")}\n] as const;\n`,
  );
}

function i18nBlock() {
  return {
    title: P.centerTitle,
    subtitle: `${P.era}. ${P.companion} surfaces opportunity signals and exploration insights. Advises humans — does NOT auto-prioritize innovation bets or launch experiments without approval. Growth Partner — never Affiliate.`,
    loading: `Loading ${P.title} dashboard…`,
    engineTitle: `${P.title} Engine (Phase ${P.phase})`,
    scoreLabel: "Discovery score",
    modeLabel: "Mode",
    readinessLabel: "Innovation maturity level",
    executiveReviews: "Executive innovation insights dashboard",
    activeReflections: "Active opportunity scanning scaffolds",
    humanOversightRequired: `Human oversight required — humans steward exploration and approval; ${P.companion} advises only`,
    eraOpenerSummary: `Innovation Era — Phases ${P.eraRange}`,
    eraOpenerNote: "Cross-link only — do not duplicate continuous improvement, innovation lab, curiosity discovery, or executive cockpit RPCs.",
    centerLabel: `${P.centerTitle} capabilities`,
    engineLabel: "Opportunity scanning engine — scanning prompts",
    frameworkLabel: "Innovation opportunity center",
    reviewsLabel: "Executive innovation insights dashboard",
    companionLabel: `${P.companion} — advises, does not auto-prioritize`,
    subEngineLabel: "Idea Exploration Framework",
    reflections: "Opportunity scanning scaffolds",
    executiveReviewEntries: "Executive innovation insight entries",
    scaffoldNotes: "Metadata scaffolds",
    crossLinks: "Related surfaces — cross-link only, do not duplicate",
    blueprintObjectives: `Blueprint objectives (Phase ${P.phase})`,
    companionLimitations: `${P.companion} limitations — does NOT auto-prioritize innovation bets or launch experiments without approval`,
    successCriteria: "Blueprint success criteria",
    criterionMet: "Met",
    criterionPending: "In progress",
    [`phase${P.phase}`]: {
      mission: `${P.companion} supports discovery visibility — humans retain exploration approval authority.`,
      philosophy: "People First. Metadata-only discovery scaffolds. Growth Partner terminology — never Affiliate.",
      growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate.",
      innovationEraOpener: `${P.era} — Phase ${P.phase} innovation era opener.`,
    },
  };
}

function patchNav() {
  let c = fs.readFileSync(path.join(ROOT, "lib/app/nav-config.ts"), "utf8");
  const id = P.camel;
  const href = `/app/${P.slug}`;
  if (!c.includes(`"${id}"`)) {
    c = c.replace('| "continuousImprovementOptimizationEngine"', `| "continuousImprovementOptimizationEngine"\n  | "${id}"`);
  }
  if (!c.includes(href)) {
    const anchor = /id: "continuousImprovementOptimizationEngine",[\s\S]*?labelKey: "customerApp\.nav\.continuousImprovementOptimizationEngine",\n  },/;
    c = c.replace(anchor, (m) => `${m}\n  {\n    id: "${id}",\n    href: "${href}",\n    labelKey: "customerApp.nav.${id}",\n  },`);
  }
  if (!c.includes(`pathname.startsWith("${href}")`)) {
    c = c.replace(
      'if (pathname.startsWith("/app/aipify-continuous-improvement-optimization-engine")) {\n    return "continuousImprovementOptimizationEngine";\n  }',
      `if (pathname.startsWith("/app/aipify-continuous-improvement-optimization-engine")) {\n    return "continuousImprovementOptimizationEngine";\n  }\n  if (pathname.startsWith("${href}")) {\n    return "${id}";\n  }`,
    );
  }
  fs.writeFileSync(path.join(ROOT, "lib/app/nav-config.ts"), c);
  console.log("patched nav-config");
}

function patchPermissions() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/permissions.ts"), "utf8");
  for (const perm of [`${P.permPrefix}.view`, `${P.permPrefix}.manage`, `${P.permPrefix}.steward`]) {
    if (!c.includes(`"${perm}"`)) {
      const anchor = c.includes('"aipify_continuous_improvement_optimization.steward"')
        ? '"aipify_continuous_improvement_optimization.steward",'
        : '"aipify_organizational_rhythms_operating_cadence.steward",';
      c = c.replace(anchor, `${anchor}\n    "${perm}",`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "lib/core/permissions.ts"), c);
  console.log("patched permissions");
}

function patchTenant() {
  let c = fs.readFileSync(path.join(ROOT, "lib/core/tenant.ts"), "utf8");
  if (!c.includes(`./${P.slug}`)) {
    const anchor = c.includes('export * from "./aipify-continuous-improvement-optimization-engine";')
      ? 'export * from "./aipify-continuous-improvement-optimization-engine";'
      : 'export * from "./aipify-organizational-rhythms-operating-cadence-engine";';
    c = c.replace(anchor, `${anchor}\nexport * from "./${P.slug}";`);
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
        ? "Innovasjonsoppdagelse"
        : locale === "sv"
          ? "Innovationsupptäckt"
          : locale === "da"
            ? "Innovationsopdagelse"
            : P.navLabel;
    data[P.camel] = block;
    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log("patched i18n", locale);
  }
}

function patchIlm() {
  let c = fs.readFileSync(path.join(ROOT, "lib/internal-language-model/index.ts"), "utf8");
  if (!c.includes(`phase${P.phase}-vocabulary`)) {
    const ilmAnchor = c.includes('export * from "./implementation-blueprint-phase211-vocabulary";')
      ? 'export * from "./implementation-blueprint-phase211-vocabulary";'
      : 'export * from "./implementation-blueprint-phase210-vocabulary";';
    c = c.replace(ilmAnchor, `${ilmAnchor}\nexport * from "./implementation-blueprint-phase${P.phase}-vocabulary";`);
  }
  const corpus = `aipify-core/knowledge/internal-language-model/${P.ilmFile}`;
  if (!c.includes(corpus)) {
    const corpusAnchor = c.includes("IMPLEMENTATION_BLUEPRINT_PHASE211_CORPUS")
      ? /export const IMPLEMENTATION_BLUEPRINT_PHASE211_CORPUS =[\s\S]*?;/
      : /export const IMPLEMENTATION_BLUEPRINT_PHASE210_CORPUS =[\s\S]*?;/;
    c = c.replace(corpusAnchor, (m) => `${m}\nexport const IMPLEMENTATION_BLUEPRINT_PHASE${P.phase}_CORPUS =\n  "${corpus}";`);
  }
  fs.writeFileSync(path.join(ROOT, "lib/internal-language-model/index.ts"), c);
  console.log("patched ilm index");
}

function patchArchitecture() {
  let c = fs.readFileSync(path.join(ROOT, "ARCHITECTURE.md"), "utf8");
  const marker = `Phase ${P.phase})`;
  if (c.includes(marker)) {
    console.log("ARCHITECTURE.md already has Phase 212");
    return;
  }
  const entry = `\n**${P.title} Engine (Phase ${P.phase}):** See [${P.docSlug}_PHASE${P.phase}.md](./${P.docSlug}_PHASE${P.phase}.md) — ${P.centerTitle} for innovation dashboard, opportunity scanning engine, innovation opportunity center, idea exploration framework, curiosity experimentation hub, executive innovation insights dashboard, and continuous improvement/innovation lab integration. \`/app/${P.slug}\`, nav id \`${P.camel}\`, migration \`${P.migration}\`. Helpers \`_${P.helper}_*\`, \`_${P.bp}_*\`. ${P.companion} advises — **NOT** auto-prioritizing innovation bets or launching experiments without approval. **Innovation Era opener** (${P.eraRange}). Cross-links only: Phase 211 continuous improvement, Phase 96 innovation lab, Phase A.87 curiosity discovery, Phase 200 executive cockpit. Permissions \`${P.permPrefix}.view\`, \`${P.permPrefix}.manage\`, \`${P.permPrefix}.steward\`.`;
  const insertAfter = "Permissions `aipify_continuous_improvement_optimization.steward`.";
  const idx = c.indexOf(insertAfter);
  if (idx !== -1) {
    c = c.slice(0, idx + insertAfter.length) + entry + c.slice(idx + insertAfter.length);
  } else {
    c += entry;
  }
  fs.writeFileSync(path.join(ROOT, "ARCHITECTURE.md"), c);
  console.log("patched ARCHITECTURE.md");
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
