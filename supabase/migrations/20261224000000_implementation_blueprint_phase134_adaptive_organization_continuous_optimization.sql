-- Implementation Blueprint Phase 134 — Adaptive Organization & Continuous Optimization Engine
-- Autonomous Organization Era (131–140). Extends Continuous Improvement Engine A.33 + A.49 + Blueprint Phase 90.
-- Helpers: _aoabp134_* (never collide with _cie_*, _cioebp90_*)

-- ---------------------------------------------------------------------------
-- 1. Optional scaffold tables (tenant-scoped, metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.adaptive_organization_experiments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  experiment_title text not null,
  pilot_scope text not null default 'bounded',
  success_criteria text,
  boundaries text,
  review_timeline text,
  governance_note text,
  escalation_path text,
  status text not null default 'proposed' check (
    status in ('proposed', 'approved', 'active', 'review', 'completed', 'deferred', 'cancelled')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists adaptive_organization_experiments_org_status_idx
  on public.adaptive_organization_experiments (organization_id, status, created_at desc);

alter table public.adaptive_organization_experiments enable row level security;
revoke all on public.adaptive_organization_experiments from authenticated, anon;

create table if not exists public.adaptive_organization_improvement_portfolio (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  improvement_title text not null,
  portfolio_status text not null default 'current' check (
    portfolio_status in ('current', 'completed', 'paused', 'archived')
  ),
  lessons_learned text,
  expected_outcome text,
  actual_outcome text,
  stakeholder_summary text,
  knowledge_asset_ref text,
  initiative_id uuid references public.improvement_initiatives (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists adaptive_organization_portfolio_org_status_idx
  on public.adaptive_organization_improvement_portfolio (organization_id, portfolio_status, created_at desc);

alter table public.adaptive_organization_improvement_portfolio enable row level security;
revoke all on public.adaptive_organization_improvement_portfolio from authenticated, anon;

create table if not exists public.adaptive_organization_fatigue_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  signal_key text not null,
  signal_label text not null,
  intensity text not null default 'moderate' check (
    intensity in ('low', 'moderate', 'elevated', 'high')
  ),
  aggregate_note text,
  measured_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists adaptive_organization_fatigue_signals_org_idx
  on public.adaptive_organization_fatigue_signals (organization_id, measured_at desc);

alter table public.adaptive_organization_fatigue_signals enable row level security;
revoke all on public.adaptive_organization_fatigue_signals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Seed helpers
-- ---------------------------------------------------------------------------
create or replace function public._aoabp134_seed_experiments(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.adaptive_organization_experiments (
    organization_id, experiment_title, pilot_scope, success_criteria, boundaries,
    review_timeline, governance_note, escalation_path, status
  )
  select p_organization_id, v.title, v.scope, v.criteria, v.boundaries,
         v.timeline, v.gov, v.escalation, v.status
  from (values
    (
      'Support response time pilot',
      'Support team — 2-week bounded pilot',
      'Reduce median first-response time without increasing escalation rate',
      'No workflow changes outside support triage; human approval before rollout',
      'Review at day 7 and day 14',
      'Governance-respecting — improvements.manage approval required',
      'Escalate to improvements.approve if scope expands',
      'proposed'
    ),
    (
      'Onboarding checklist refinement',
      'New customer cohort — 30-day pilot',
      'Improve module adoption scores in first 30 days',
      'Documentation and checklist changes only — no billing or permission changes',
      'Weekly learning review',
      'Cross-link Change Management A.47 for communication',
      'Defer if change fatigue signals elevated',
      'approved'
    )
  ) as v(title, scope, criteria, boundaries, timeline, gov, escalation, status)
  where not exists (
    select 1 from public.adaptive_organization_experiments
    where organization_id = p_organization_id limit 1
  );
end; $$;

create or replace function public._aoabp134_seed_portfolio(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.adaptive_organization_improvement_portfolio (
    organization_id, improvement_title, portfolio_status, lessons_learned,
    expected_outcome, actual_outcome, stakeholder_summary, knowledge_asset_ref
  )
  select p_organization_id, v.title, v.status, v.lessons, v.expected, v.actual, v.stakeholders, v.asset
  from (values
    (
      'Knowledge Center FAQ expansion',
      'completed',
      'Small documentation updates reduced repeat support topics — pace mattered more than volume',
      'Reduce recurring support topics by 15%',
      '12% reduction in 90 days — learning continues',
      'Support leads and KC owners',
      'KC improvement playbook metadata'
    ),
    (
      'Module adoption onboarding refinement',
      'current',
      'Pilot in progress — early signals positive, review scheduled',
      'Improve first-30-day adoption scores',
      'In measurement',
      'Customer success and onboarding teams',
      'Onboarding checklist scaffold'
    )
  ) as v(title, status, lessons, expected, actual, stakeholders, asset)
  where not exists (
    select 1 from public.adaptive_organization_improvement_portfolio
    where organization_id = p_organization_id limit 1
  );
end; $$;

create or replace function public._aoabp134_seed_fatigue_signals(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.adaptive_organization_fatigue_signals (
    organization_id, signal_key, signal_label, intensity, aggregate_note
  )
  select p_organization_id, v.key, v.label, v.intensity, v.note
  from (values
    ('initiative_volume', 'Active improvement initiative volume', 'moderate', 'Aggregate count within sustainable range — organizational capacity signal only'),
    ('learning_load', 'Learning program intensity', 'low', 'University and training load — not individual tracking'),
    ('companion_expansion', 'Companion deployment breadth', 'moderate', 'Companion utilization themes — aggregate adoption, not surveillance'),
    ('transformation_saturation', 'Transformation program density', 'low', 'Cross-link Change Management A.47 — metadata only')
  ) as v(key, label, intensity, note)
  where not exists (
    select 1 from public.adaptive_organization_fatigue_signals
    where organization_id = p_organization_id limit 1
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Distinction note and blueprint metadata
-- ---------------------------------------------------------------------------
create or replace function public._aoabp134_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Autonomous Organization Phase 134 — Adaptive Organization & Continuous Optimization Engine at /app/continuous-improvement-engine. **Extends** Continuous Improvement Engine A.33 + A.49 + Blueprint Phase 90 (_cioebp90_*) — same route, no duplicate improvement center. **Distinct from Phase 90 organizational evolution habits** — Phase 134 adds Autonomous Organization Era adaptive optimization depth: experimentation framework, adaptation insights, change fatigue protection, and improvement portfolio. **Distinct from Learning Engine** at /app/learning (Aipify learns with customer approval — NOT org improvement initiatives). **Distinct from Innovation Lab** at /app/innovation-lab (controlled experiment validation pipeline). **Distinct from Growth & Evolution A.81** at /app/growth-evolution-engine (long-term growth orchestration). **Cross-links Autonomous Organization Era 131–133:** Phase 131 Autonomy Governance & Human Oversight (interim Human Oversight A.40 /app/human-oversight-engine), Phase 132 Coordinated Companion Workforce /app/companion-workforce-engine, Phase 133 Organizational Autonomy Integration (era companion — cross-link Phase 132 workforce coordination). Helpers _aoabp134_* only. Wisdom before speed — optimization supports people, does not exhaust them.';
$$;

create or replace function public._aoabp134_mission()
returns text language sql immutable as $$
  select 'Help organizations adapt thoughtfully — identifying improvement opportunities, running bounded experiments, and learning together without mandating change or exhausting people.';
$$;

create or replace function public._aoabp134_philosophy()
returns text language sql immutable as $$
  select 'Wisdom before speed. People First. Optimization supports people — does not exhaust them. Aipify identifies opportunities; organizations decide change.';
$$;

create or replace function public._aoabp134_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Adaptive Organization continuous optimization informs, prepares, and connects improvement signals; humans retain authority over all change. No auto-optimization mandates.';
$$;

create or replace function public._aoabp134_vision()
returns text language sql immutable as $$
  select 'Organizations improve at a healthy pace — curious, reflective, and sustainable — because adaptation serves people and outcomes, not change for its own sake.';
$$;

create or replace function public._aoabp134_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'adaptive_organization_center', 'label', 'Adaptive organization center', 'description', 'Improvement opportunities, optimization reviews, companion recommendations, learning insights, workflow enhancement, knowledge gaps, transformation feedback, adaptation dashboards'),
    jsonb_build_object('key', 'continuous_optimization', 'label', 'Continuous optimization engine', 'description', 'Workflow, knowledge, support, companion effectiveness, executive efficiency, Growth Partner, community, and learning experience improvements'),
    jsonb_build_object('key', 'learning_loops', 'label', 'Learning loops', 'description', 'Observe → Reflect → Experiment → Evaluate → Learn → Adapt — sustainable adaptation cycles'),
    jsonb_build_object('key', 'experimentation_framework', 'label', 'Experimentation framework', 'description', 'Pilots with success criteria, boundaries, review timelines, governance, and escalation — human-approved'),
    jsonb_build_object('key', 'adaptation_insights', 'label', 'Adaptation insight engine', 'description', 'Aggregate bottlenecks, knowledge gaps, adoption trends, support challenges, companion utilization, leadership alignment, GP effectiveness, community health'),
    jsonb_build_object('key', 'change_fatigue_protection', 'label', 'Change fatigue protection', 'description', 'Organizational capacity signals — excessive initiatives, learning overload, companion overexpansion, communication fatigue, transformation saturation'),
    jsonb_build_object('key', 'improvement_portfolio', 'label', 'Improvement portfolio', 'description', 'Current and completed improvements with lessons learned, outcomes, stakeholders, and knowledge assets'),
    jsonb_build_object('key', 'cross_era_integration', 'label', 'Cross-era integration', 'description', 'Connect Phases 131–133, Phase 90 evolution, Executive Operations 130, and ecosystem era companions — metadata only')
  );
$$;

create or replace function public._aoabp134_adaptive_organization_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Adaptive Organization Center — improvement discovery and optimization reviews with human-paced adaptation.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'improvement_opportunities', 'label', 'Improvement opportunities', 'description', 'Surface opportunities from support, feedback, operations, and companion signals — metadata only'),
      jsonb_build_object('key', 'optimization_reviews', 'label', 'Optimization reviews', 'description', 'Structured review cycles with findings summaries — human-led, not automated mandates'),
      jsonb_build_object('key', 'companion_recommendations', 'label', 'Companion recommendations', 'description', 'Optimization Companion highlights opportunities — does not dictate change'),
      jsonb_build_object('key', 'learning_insights', 'label', 'Learning insights', 'description', 'Cross-link Learning Engine /app/learning and Aipify University 115 — distinct concerns'),
      jsonb_build_object('key', 'workflow_enhancement', 'label', 'Workflow enhancement', 'description', 'Workflow friction patterns — cross-link Workflow Orchestration A.42'),
      jsonb_build_object('key', 'knowledge_gaps', 'label', 'Knowledge gaps', 'description', 'Documentation and KC coverage gaps from support patterns — metadata counts'),
      jsonb_build_object('key', 'transformation_feedback', 'label', 'Transformation feedback', 'description', 'Change program signals — cross-link Transformation 127 /app/change-management-engine'),
      jsonb_build_object('key', 'adaptation_dashboards', 'label', 'Adaptation dashboards', 'description', 'Aggregate adaptation themes — organizational capacity, not individual surveillance')
    ),
    'boundary_note', 'Adaptive Organization Center prepares scaffolds — organizations decide whether and when to change.'
  );
$$;

create or replace function public._aoabp134_continuous_optimization_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Continuous optimization across operational dimensions — incremental, governed, and people-first.',
    'optimization_domains', jsonb_build_array(
      jsonb_build_object('key', 'workflow', 'label', 'Workflow optimization', 'route', '/app/workflow-orchestration-engine', 'description', 'Process friction and orchestration improvements'),
      jsonb_build_object('key', 'knowledge', 'label', 'Knowledge optimization', 'route', '/app/knowledge-center', 'description', 'KC coverage, EKE gaps, documentation improvements'),
      jsonb_build_object('key', 'support', 'label', 'Support optimization', 'route', '/app/support-ai-engine', 'description', 'Triage patterns, escalation reduction — metadata only'),
      jsonb_build_object('key', 'companion_effectiveness', 'label', 'Companion effectiveness', 'route', '/app/companion-marketplace', 'description', 'Aggregate companion utilization themes — cross-link Phase 132 workforce'),
      jsonb_build_object('key', 'executive_efficiency', 'label', 'Executive efficiency', 'route', '/app/operations-center-foundation-engine', 'description', 'Executive operations clarity — Phase 130 cross-link'),
      jsonb_build_object('key', 'growth_partner', 'label', 'Growth Partner effectiveness', 'route', '/app/growth-partner-operations', 'description', 'GP ecosystem health — never Affiliate terminology'),
      jsonb_build_object('key', 'community', 'label', 'Community health', 'route', '/app/community', 'description', 'Collective success patterns — Phase 117 cross-link'),
      jsonb_build_object('key', 'learning_experience', 'label', 'Learning experience', 'route', '/app/aipify-university', 'description', 'Education pathway improvements — distinct from Learning Engine')
    ),
    'human_decides_note', 'Aipify recommends optimization opportunities — humans approve all initiatives and experiments.'
  );
$$;

create or replace function public._aoabp134_learning_loops()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Adaptive learning loops — observe, reflect, experiment, evaluate, learn, adapt.',
    'steps', jsonb_build_array(
      jsonb_build_object('key', 'observe', 'label', 'Observe', 'description', 'Notice aggregate patterns from operations, support, feedback, and companion signals'),
      jsonb_build_object('key', 'reflect', 'label', 'Reflect', 'description', 'Human-guided review — what matters, what is noise, what deserves compassion'),
      jsonb_build_object('key', 'experiment', 'label', 'Experiment', 'description', 'Bounded pilots with success criteria — no silent auto-implementation'),
      jsonb_build_object('key', 'evaluate', 'label', 'Evaluate', 'description', 'Compare expected vs actual outcomes — metadata summaries only'),
      jsonb_build_object('key', 'learn', 'label', 'Learn', 'description', 'Capture lessons in improvement portfolio and Organizational Memory A.34 hooks'),
      jsonb_build_object('key', 'adapt', 'label', 'Adapt', 'description', 'Adjust based on validated outcomes — human-approved pacing')
    ),
    'cycle_phrase', 'Observe → Reflect → Experiment → Evaluate → Learn → Adapt',
    'extends_phase90', 'Builds on Phase 90 learning cycle with explicit evaluation step for adaptive optimization'
  );
$$;

create or replace function public._aoabp134_experimentation_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Safe experimentation — pilots with boundaries, governance, and review timelines.',
    'elements', jsonb_build_array(
      jsonb_build_object('key', 'pilots', 'label', 'Pilots', 'description', 'Bounded scope and time — test before scaling'),
      jsonb_build_object('key', 'success_criteria', 'label', 'Success criteria', 'description', 'Clear measurable outcomes — without excessive optimization pressure'),
      jsonb_build_object('key', 'boundaries', 'label', 'Boundaries', 'description', 'Explicit limits on scope — what the experiment will NOT change'),
      jsonb_build_object('key', 'review_timelines', 'label', 'Review timelines', 'description', 'Scheduled learning reviews — human-led'),
      jsonb_build_object('key', 'governance', 'label', 'Governance', 'description', 'improvements.manage and improvements.approve permissions — governance-respecting'),
      jsonb_build_object('key', 'escalation', 'label', 'Escalation', 'description', 'Clear escalation paths when scope expands or fatigue signals rise')
    ),
    'innovation_lab_route', '/app/innovation-lab',
    'boundary_note', 'CIE experiments feed operational improvement — Innovation Lab validates ideas in controlled lab conditions; cross-link, do not duplicate.'
  );
$$;

create or replace function public._aoabp134_adaptation_insight_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Adaptation insights — aggregate organizational patterns, not individual surveillance.',
    'insight_categories', jsonb_build_array(
      jsonb_build_object('key', 'bottlenecks', 'label', 'Operational bottlenecks', 'description', 'Workflow and process friction themes — metadata counts'),
      jsonb_build_object('key', 'knowledge_gaps', 'label', 'Knowledge gaps', 'description', 'Recurring support topics and documentation gaps'),
      jsonb_build_object('key', 'adoption_trends', 'label', 'Adoption trends', 'description', 'Module adoption patterns — cross-link Customer Success A.26'),
      jsonb_build_object('key', 'support_challenges', 'label', 'Support challenges', 'description', 'Escalation and triage patterns — metadata only'),
      jsonb_build_object('key', 'companion_utilization', 'label', 'Companion utilization', 'description', 'Aggregate companion engagement themes — cross-link Phase 132 workforce'),
      jsonb_build_object('key', 'leadership_alignment', 'label', 'Leadership alignment', 'description', 'Executive priority themes — cross-link Executive Intelligence 121'),
      jsonb_build_object('key', 'gp_effectiveness', 'label', 'Growth Partner effectiveness', 'description', 'GP ecosystem health signals — never Affiliate terminology'),
      jsonb_build_object('key', 'community_health', 'label', 'Community health', 'description', 'Collective success patterns — cross-link Community 117')
    ),
    'privacy_note', 'All insights are organizational aggregates — never individual employee surveillance or performance scoring.'
  );
$$;

create or replace function public._aoabp134_optimization_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'owl_highlight_opportunity',
      'scenario', 'Highlight opportunities — curiosity not criticism',
      'prompt', '🦉 Aipify noticed a pattern that might benefit from a gentle review — would exploring a small improvement experiment help, when your team has capacity?'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'rose_connect_knowledge',
      'scenario', 'Connect knowledge',
      'prompt', '🌹 A related lesson from a completed improvement might inform this opportunity — Aipify can prepare a summary for your review.'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'bell_suggest_experiment',
      'scenario', 'Suggest experiments',
      'prompt', '🔔 A bounded pilot with clear success criteria could test this idea safely — Aipify prepares scaffolds; you decide whether to proceed.'
    ),
    jsonb_build_object(
      'emoji', '❤️',
      'key', 'heart_track_outcomes',
      'scenario', 'Track outcomes',
      'prompt', '❤️ Your team completed an improvement cycle — the learning matters even when outcomes are still in progress. Would a reflection review help?'
    ),
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'owl_encourage_reflection',
      'scenario', 'Encourage reflection',
      'prompt', '🦉 Sustainable improvement includes rest and recovery — Aipify recommends pacing, not perpetual change.'
    )
  );
$$;

create or replace function public._aoabp134_change_fatigue_protection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Change fatigue protection — organizational capacity signals, NOT employee surveillance or punitive tracking.',
    'signals', jsonb_build_array(
      jsonb_build_object('key', 'excessive_initiatives', 'label', 'Excessive initiatives', 'description', 'Too many concurrent improvement programs — aggregate count signal'),
      jsonb_build_object('key', 'learning_overload', 'label', 'Learning overload', 'description', 'Training and university program intensity — organizational load, not individual'),
      jsonb_build_object('key', 'companion_overexpansion', 'label', 'Companion overexpansion', 'description', 'Companion deployment breadth exceeding governance capacity'),
      jsonb_build_object('key', 'communication_fatigue', 'label', 'Communication fatigue', 'description', 'Change communication density — cross-link Stakeholder Communication A.53'),
      jsonb_build_object('key', 'transformation_saturation', 'label', 'Transformation saturation', 'description', 'Multiple transformation programs — cross-link Change Management A.47'),
      jsonb_build_object('key', 'organizational_exhaustion', 'label', 'Organizational exhaustion', 'description', 'Aggregate capacity warning — recommend pacing, recovery, and reflection')
    ),
    'protection_actions', jsonb_build_array(
      'Recommend deferring non-critical initiatives when fatigue signals elevated',
      'Suggest recovery periods between transformation waves',
      'Encourage reflection and recognition — Self Love A.76 cross-link',
      'Never frame capacity signals as individual performance issues'
    ),
    'self_love_route', '/app/self-love-engine'
  );
$$;

create or replace function public._aoabp134_improvement_portfolio_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Improvement portfolio — current and completed improvements with lessons, outcomes, and knowledge assets.',
    'portfolio_elements', jsonb_build_array(
      jsonb_build_object('key', 'current_improvements', 'label', 'Current improvements', 'description', 'Active improvement initiatives and experiments in progress'),
      jsonb_build_object('key', 'completed_improvements', 'label', 'Completed improvements', 'description', 'Finished cycles with outcome summaries'),
      jsonb_build_object('key', 'lessons_learned', 'label', 'Lessons learned', 'description', 'Reflection summaries — metadata hooks to Organizational Memory A.34'),
      jsonb_build_object('key', 'expected_vs_actual', 'label', 'Expected vs actual outcomes', 'description', 'Outcome comparison without blame — learning focus'),
      jsonb_build_object('key', 'stakeholders', 'label', 'Stakeholders', 'description', 'Who was involved — role summaries, not individual surveillance'),
      jsonb_build_object('key', 'knowledge_assets', 'label', 'Knowledge assets', 'description', 'Playbooks, checklists, and KC references created from improvements')
    ),
    'extends_initiatives', 'Complements improvement_initiatives (A.49) with portfolio-level lessons and outcome tracking'
  );
$$;

create or replace function public._aoabp134_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Optimization Companion limitations — support adaptation, never mandate change.',
    'limitations', jsonb_build_array(
      jsonb_build_object('key', 'never_force_change', 'label', 'Never force change', 'description', 'All improvements require human approval — no auto-optimization mandates'),
      jsonb_build_object('key', 'never_override_governance', 'label', 'Never override governance', 'description', 'Respect improvements.approve, Trust Actions, and Human Oversight A.40 gates'),
      jsonb_build_object('key', 'never_ignore_capacity', 'label', 'Never ignore human capacity', 'description', 'Change fatigue protection must influence recommendations'),
      jsonb_build_object('key', 'never_suppress_dissent', 'label', 'Never suppress dissent', 'description', 'Healthy disagreement is valuable — companions inform, not silence'),
      jsonb_build_object('key', 'never_frame_mandates', 'label', 'Never frame as mandates', 'description', 'Suggestions and scaffolds only — organizations decide change')
    )
  );
$$;

create or replace function public._aoabp134_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love supports sustainable improvement — healthy pace, reflection, recovery, encouragement, and recognition.',
    'practices', jsonb_build_array(
      'Healthy pace — wisdom before speed; not every signal requires action',
      'Reflection — unsuccessful experiments still teach',
      'Recovery — recommend rest between transformation waves',
      'Encouragement — compassion toward imperfect improvement cycles',
      'Recognition — celebrate effort and learning, not only wins',
      'Sustainable improvement — progress not perfection'
    ),
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love is a principle — CIE stores improvement metadata, not wellbeing journal content.'
  );
$$;

create or replace function public._aoabp134_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Adaptive optimization requires audit transparency, governance reviews, and RBAC.',
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'audit_logs', 'label', 'Audit logs', 'description', 'Initiative, experiment, and portfolio changes logged via _cie_log — metadata only'),
      jsonb_build_object('key', 'governance_reviews', 'label', 'Governance reviews', 'description', 'improvements.review and improvements.approve permissions for status changes'),
      jsonb_build_object('key', 'recommendation_histories', 'label', 'Recommendation histories', 'description', 'Explainable suggestion scaffolds — what signals contributed'),
      jsonb_build_object('key', 'rbac', 'label', 'RBAC', 'description', 'improvements.view · manage · review · approve · dismiss — role-gated'),
      jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'route', '/app/settings/two-factor', 'description', 'Sensitive improvement approvals may require 2FA per tenant policy')
    ),
    'governance_route', '/app/governance-policy-engine'
  );
$$;

create or replace function public._aoabp134_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'phase90_evolution', 'label', 'Phase 90 Organizational Evolution', 'route', '/app/continuous-improvement-engine', 'note', 'Learning cycles and evolution modes — Phase 134 extends on same route'),
    jsonb_build_object('key', 'learning_engine', 'label', 'Learning Engine', 'route', '/app/learning', 'note', 'Aipify learns with customer approval — distinct from org improvement'),
    jsonb_build_object('key', 'innovation_lab', 'label', 'Innovation Lab (Phase 96)', 'route', '/app/innovation-lab', 'note', 'Controlled experiment validation — cross-link only'),
    jsonb_build_object('key', 'growth_evolution', 'label', 'Growth & Evolution (A.81)', 'route', '/app/growth-evolution-engine', 'note', 'Long-term growth orchestration — complementary'),
    jsonb_build_object('key', 'phase131_oversight', 'label', 'Phase 131 Autonomy Governance', 'route', '/app/human-oversight-engine', 'note', 'Human Oversight A.40 — oversight gates for adaptive optimization'),
    jsonb_build_object('key', 'phase132_workforce', 'label', 'Phase 132 Companion Workforce', 'route', '/app/companion-workforce-engine', 'note', 'Coordinated companion teams — cross-link companion effectiveness'),
    jsonb_build_object('key', 'phase133_autonomy', 'label', 'Phase 133 Organizational Autonomy', 'route', '/app/companion-workforce-engine', 'note', 'Organizational Autonomy Integration — era companion cross-link'),
    jsonb_build_object('key', 'phase130_executive_ops', 'label', 'Phase 130 Executive Operations', 'route', '/app/operations-center-foundation-engine', 'note', 'Enterprise Intelligence Era capstone — executive efficiency cross-link'),
    jsonb_build_object('key', 'organizational_memory', 'label', 'Organizational Memory (A.34)', 'route', '/app/organizational-memory-engine', 'note', 'Lesson capture — metadata hooks only'),
    jsonb_build_object('key', 'change_management', 'label', 'Transformation (Phase 127)', 'route', '/app/change-management-engine', 'note', 'Transformation feedback and fatigue cross-link'),
    jsonb_build_object('key', 'aipify_university', 'label', 'Aipify University (Phase 115)', 'route', '/app/aipify-university', 'note', 'Learning experience optimization — distinct from Learning Engine'),
    jsonb_build_object('key', 'growth_partner_ops', 'label', 'Growth Partner Operations (Phase 114)', 'route', '/app/growth-partner-operations', 'note', 'GP effectiveness — never Affiliate terminology'),
    jsonb_build_object('key', 'community', 'label', 'Community (Phase 117)', 'route', '/app/community', 'note', 'Community health signals — aggregate only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Sustainable pacing and recovery — principle only')
  );
$$;

create or replace function public._aoabp134_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates adaptive optimization patterns internally; Unonight is the first external pilot.',
    'focus_areas', jsonb_build_array(
      'ABOS capability improvement cycles with bounded experiments',
      'Support triage optimization and knowledge gap closure',
      'Companion effectiveness and workforce coordination patterns',
      'Growth Partner onboarding friction reduction — never Affiliate terminology',
      'Change fatigue protection during rapid era expansion'
    ),
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — adaptive optimization, experimentation, and portfolio learning',
      'focus', jsonb_build_array(
        'Product development improvement pilots with governance reviews',
        'Support and KC gap patterns as adaptation insight sources',
        'Companion workforce coordination optimization — Phase 132 cross-link',
        'Executive operations clarity improvements — Phase 130 cross-link'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce support, onboarding, and customer feedback optimization',
      'focus', jsonb_build_array(
        'Support escalation friction reduction experiments',
        'Onboarding adoption improvement pilots with fatigue monitoring',
        'Community and success signal integration for adaptation insights'
      )
    )
  );
$$;

create or replace function public._aoabp134_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Wisdom before speed — optimization supports people, does not exhaust them.',
    'Organizations improve at a healthy pace because adaptation serves people and outcomes.',
    'Aipify identifies opportunities; organizations decide change.',
    'Change fatigue protection is organizational capacity — not employee surveillance.',
    'Progress not perfection — curious, reflective, sustainable improvement together.'
  );
$$;

create or replace function public._aoabp134_privacy_note()
returns text language sql immutable as $$
  select 'Adaptive Organization continuous optimization stores metadata only — improvement counts, experiment scaffolds, aggregate fatigue signals, and portfolio summaries. No raw customer conversations, email content, chat, orders, individual employee surveillance, or PII in improvement payloads. Humans approve all changes.';
$$;

create or replace function public._aoabp134_engagement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'active_experiments', coalesce((
      select count(*) from public.adaptive_organization_experiments
      where organization_id = p_organization_id and status in ('proposed', 'approved', 'active', 'review')
    ), 0),
    'completed_experiments', coalesce((
      select count(*) from public.adaptive_organization_experiments
      where organization_id = p_organization_id and status = 'completed'
    ), 0),
    'portfolio_current', coalesce((
      select count(*) from public.adaptive_organization_improvement_portfolio
      where organization_id = p_organization_id and portfolio_status = 'current'
    ), 0),
    'portfolio_completed', coalesce((
      select count(*) from public.adaptive_organization_improvement_portfolio
      where organization_id = p_organization_id and portfolio_status = 'completed'
    ), 0),
    'elevated_fatigue_signals', coalesce((
      select count(*) from public.adaptive_organization_fatigue_signals
      where organization_id = p_organization_id and intensity in ('elevated', 'high')
    ), 0),
    'initiatives_active', coalesce((
      select count(*) from public.improvement_initiatives
      where organization_id = p_organization_id and status in ('proposed', 'approved', 'in_progress')
    ), 0),
    'initiatives_completed', coalesce((
      select count(*) from public.improvement_initiatives
      where organization_id = p_organization_id and status = 'completed'
    ), 0),
    'review_cycles_completed', coalesce((
      select count(*) from public.improvement_review_cycles
      where organization_id = p_organization_id and review_status = 'completed'
    ), 0),
    'summary_note', 'Adaptive optimization engagement — metadata counts only; humans approve all experiments and changes.',
    'privacy_note', public._aoabp134_privacy_note()
  );
end; $$;

create or replace function public._aoabp134_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
begin
  v_engagement := public._aoabp134_engagement_summary(p_organization_id);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'objectives',
      'label', 'Eight adaptive optimization objectives documented',
      'met', jsonb_array_length(public._aoabp134_objectives()) >= 8,
      'note', 'Adaptive center, continuous optimization, learning loops, experimentation, adaptation insights, fatigue protection, portfolio, cross-era integration.'
    ),
    jsonb_build_object(
      'key', 'adaptive_organization_center',
      'label', 'Adaptive organization center — 8 capabilities',
      'met', jsonb_array_length((public._aoabp134_adaptive_organization_center()->'capabilities')) >= 8,
      'note', null
    ),
    jsonb_build_object(
      'key', 'continuous_optimization',
      'label', 'Continuous optimization — 8 domains',
      'met', jsonb_array_length((public._aoabp134_continuous_optimization_engine()->'optimization_domains')) >= 8,
      'note', 'Workflow, knowledge, support, companion, executive, GP, community, learning.'
    ),
    jsonb_build_object(
      'key', 'learning_loops',
      'label', 'Learning loops — Observe → Reflect → Experiment → Evaluate → Learn → Adapt',
      'met', jsonb_array_length((public._aoabp134_learning_loops()->'steps')) = 6,
      'note', 'Extends Phase 90 cycle with explicit evaluation step.'
    ),
    jsonb_build_object(
      'key', 'experimentation_framework',
      'label', 'Experimentation framework — pilots, criteria, boundaries, governance, escalation',
      'met', jsonb_array_length((public._aoabp134_experimentation_framework()->'elements')) >= 6,
      'note', 'Distinct from Innovation Lab validation pipeline.'
    ),
    jsonb_build_object(
      'key', 'adaptation_insights',
      'label', 'Adaptation insight engine — 8 aggregate categories',
      'met', jsonb_array_length((public._aoabp134_adaptation_insight_engine()->'insight_categories')) >= 8,
      'note', 'Organizational aggregates only — not individual surveillance.'
    ),
    jsonb_build_object(
      'key', 'optimization_companion',
      'label', 'Optimization Companion — highlight, connect, suggest, track, reflect',
      'met', jsonb_array_length(public._aoabp134_optimization_companion()) >= 5,
      'note', 'Does not dictate change.'
    ),
    jsonb_build_object(
      'key', 'change_fatigue_protection',
      'label', 'Change fatigue protection — 6 organizational capacity signals',
      'met', jsonb_array_length((public._aoabp134_change_fatigue_protection()->'signals')) >= 6,
      'note', 'NOT employee surveillance or punitive tracking.'
    ),
    jsonb_build_object(
      'key', 'improvement_portfolio',
      'label', 'Improvement portfolio engine — lessons, outcomes, stakeholders, assets',
      'met', jsonb_array_length((public._aoabp134_improvement_portfolio_engine()->'portfolio_elements')) >= 6,
      'note', 'Complements A.49 improvement_initiatives.'
    ),
    jsonb_build_object(
      'key', 'companion_limitations',
      'label', 'Companion limitations — never force change or override governance',
      'met', jsonb_array_length((public._aoabp134_companion_limitations()->'limitations')) >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — healthy pace, reflection, recovery',
      'met', (public._aoabp134_self_love_connection()->'self_love_route') is not null,
      'note', 'Principle only — no wellbeing content in CIE tables.'
    ),
    jsonb_build_object(
      'key', 'security_requirements',
      'label', 'Security — audit logs, governance, RBAC, 2FA cross-link',
      'met', jsonb_array_length((public._aoabp134_security_requirements()->'requirements')) >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links Phase 90, Learning, Innovation Lab, Growth A.81, Era 131–133, Phase 130',
      'met', jsonb_array_length(public._aoabp134_integration_links()) >= 12,
      'note', 'Same route as Phase 90 — extends, does not duplicate.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Aipify Group internal; Unonight first external pilot',
      'met', (public._aoabp134_dogfooding()->'aipify_group') is not null,
      'note', null
    ),
    jsonb_build_object(
      'key', 'live_engagement',
      'label', 'Live adaptive optimization engagement summary',
      'met', v_engagement ? 'active_experiments',
      'note', format(
        '%s active experiments, %s portfolio items, %s elevated fatigue signals.',
        coalesce((v_engagement->>'active_experiments')::int, 0),
        coalesce((v_engagement->>'portfolio_current')::int, 0),
        coalesce((v_engagement->>'elevated_fatigue_signals')::int, 0)
      )
    ),
    jsonb_build_object(
      'key', 'vision',
      'label', 'Vision — healthy-paced adaptive improvement',
      'met', length(public._aoabp134_vision()) > 20,
      'note', public._aoabp134_vision()
    )
  );
end; $$;

create or replace function public._aoabp134_era_autonomous_organization_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('phase', '131', 'label', 'Autonomy Governance & Human Oversight', 'route', '/app/human-oversight-engine', 'status', 'interim A.40 cross-link'),
    jsonb_build_object('phase', '132', 'label', 'Coordinated Companion Workforce', 'route', '/app/companion-workforce-engine', 'status', 'implemented'),
    jsonb_build_object('phase', '133', 'label', 'Organizational Autonomy Integration', 'route', '/app/companion-workforce-engine', 'status', 'era companion cross-link'),
    jsonb_build_object('phase', '134', 'label', 'Adaptive Organization & Continuous Optimization', 'route', '/app/continuous-improvement-engine', 'status', 'this blueprint')
  );
$$;

create or replace function public._aoabp134_blueprint_block()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'phase', 134,
    'title', 'Adaptive Organization & Continuous Optimization Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE134_ADAPTIVE_ORGANIZATION_CONTINUOUS_OPTIMIZATION.md',
    'engine_phase', 'Phase A.33 + A.49 + Blueprint Phase 90 — Continuous Improvement Engine',
    'route', '/app/continuous-improvement-engine',
    'era', 'Autonomous Organization Era (131–140)',
    'mapping_note', 'Phase 134 extends A.33 + A.49 + Phase 90 on same route — adaptive optimization depth for Autonomous Organization Era.',
    'distinction_note', public._aoabp134_distinction_note(),
    'mission', public._aoabp134_mission(),
    'philosophy', public._aoabp134_philosophy(),
    'abos_principle', public._aoabp134_abos_principle(),
    'vision', public._aoabp134_vision(),
    'objectives', public._aoabp134_objectives(),
    'adaptive_organization_center', public._aoabp134_adaptive_organization_center(),
    'continuous_optimization_engine', public._aoabp134_continuous_optimization_engine(),
    'learning_loops', public._aoabp134_learning_loops(),
    'experimentation_framework', public._aoabp134_experimentation_framework(),
    'adaptation_insight_engine', public._aoabp134_adaptation_insight_engine(),
    'optimization_companion', public._aoabp134_optimization_companion(),
    'change_fatigue_protection', public._aoabp134_change_fatigue_protection(),
    'improvement_portfolio_engine', public._aoabp134_improvement_portfolio_engine(),
    'companion_limitations', public._aoabp134_companion_limitations(),
    'self_love_connection', public._aoabp134_self_love_connection(),
    'security_requirements', public._aoabp134_security_requirements(),
    'dogfooding', public._aoabp134_dogfooding(),
    'integration_links', public._aoabp134_integration_links(),
    'era_cross_links', public._aoabp134_era_autonomous_organization_cross_links(),
    'vision_phrases', public._aoabp134_vision_phrases(),
    'privacy_note', public._aoabp134_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Thin RPCs
-- ---------------------------------------------------------------------------
create or replace function public.record_adaptive_organization_experiment(
  p_experiment_title text,
  p_pilot_scope text default 'bounded',
  p_success_criteria text default null,
  p_boundaries text default null,
  p_review_timeline text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_id uuid;
begin
  perform public._irp_require_permission('improvements.manage');
  v_org_id := public._mta_require_organization();
  insert into public.adaptive_organization_experiments (
    organization_id, experiment_title, pilot_scope, success_criteria, boundaries, review_timeline
  )
  values (
    v_org_id,
    left(p_experiment_title, 200),
    left(coalesce(p_pilot_scope, 'bounded'), 200),
    left(coalesce(p_success_criteria, ''), 500),
    left(coalesce(p_boundaries, ''), 500),
    left(coalesce(p_review_timeline, ''), 200)
  )
  returning id into v_id;
  perform public._cie_log(v_org_id, 'adaptive_experiment_created', 'adaptive_organization_experiment', v_id,
    jsonb_build_object('title', p_experiment_title));
  return jsonb_build_object('id', v_id, 'status', 'proposed');
end; $$;

create or replace function public.list_improvement_portfolio(
  p_status text default null
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('improvements.view');
  v_org_id := public._mta_require_organization();
  perform public._aoabp134_seed_portfolio(v_org_id);
  return jsonb_build_object(
    'portfolio', coalesce((
      select jsonb_agg(row_to_json(p) order by
        case p.portfolio_status when 'current' then 0 when 'completed' then 1 else 2 end,
        p.updated_at desc
      )
      from public.adaptive_organization_improvement_portfolio p
      where p.organization_id = v_org_id
        and (p_status is null or p.portfolio_status = p_status)
    ), '[]'::jsonb)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Replace dashboard — preserve ALL A.33, A.49, Phase 90 fields; append Phase 134
-- ---------------------------------------------------------------------------
create or replace function public.get_continuous_improvement_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('improvements.view');
  v_org_id := public._mta_require_organization();
  perform public._cie_seed_items(v_org_id);
  perform public._cie_seed_initiatives(v_org_id);
  perform public._aoabp134_seed_experiments(v_org_id);
  perform public._aoabp134_seed_portfolio(v_org_id);
  perform public._aoabp134_seed_fatigue_signals(v_org_id);
  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Human-guided continuous improvement — feedback drives refinement without silent auto-changes.',
    'principles', jsonb_build_array('Human-guided improvement', 'Explainable optimization', 'Outcome validation', 'Feedback collection', 'Governance-respecting'),
    'summary', jsonb_build_object(
      'active', coalesce((select count(*) from public.improvement_items where organization_id = v_org_id and status in ('identified', 'under_review', 'approved')), 0),
      'implemented', coalesce((select count(*) from public.improvement_items where organization_id = v_org_id and status = 'implemented'), 0),
      'feedback_count', coalesce((select count(*) from public.improvement_feedback where organization_id = v_org_id), 0),
      'initiatives_active', coalesce((select count(*) from public.improvement_initiatives where organization_id = v_org_id and status in ('proposed', 'approved', 'in_progress')), 0),
      'initiatives_completed', coalesce((select count(*) from public.improvement_initiatives where organization_id = v_org_id and status = 'completed'), 0),
      'experiments_active', coalesce((select count(*) from public.adaptive_organization_experiments where organization_id = v_org_id and status in ('proposed', 'approved', 'active', 'review')), 0),
      'portfolio_current', coalesce((select count(*) from public.adaptive_organization_improvement_portfolio where organization_id = v_org_id and portfolio_status = 'current'), 0)
    ),
    'items', coalesce((
      select jsonb_agg(row_to_json(i) order by case i.priority when 'strategic' then 0 when 'high' then 1 else 2 end, i.created_at desc)
      from public.improvement_items i where i.organization_id = v_org_id and i.status != 'dismissed'
    ), '[]'::jsonb),
    'initiatives', coalesce((
      select jsonb_agg(row_to_json(n) order by case n.priority when 'strategic' then 0 when 'high' then 1 when 'medium' then 2 else 3 end, n.created_at desc)
      from public.improvement_initiatives n where n.organization_id = v_org_id and n.status not in ('rejected', 'deferred')
    ), '[]'::jsonb),
    'review_cycles', coalesce((
      select jsonb_agg(row_to_json(c) order by c.reviewed_at desc nulls last)
      from public.improvement_review_cycles c where c.organization_id = v_org_id limit 10
    ), '[]'::jsonb),
    'success_measurements', coalesce((
      select jsonb_agg(row_to_json(m) order by m.measured_at desc)
      from public.improvement_success_measurements m where m.organization_id = v_org_id limit 10
    ), '[]'::jsonb),
    'trends', jsonb_build_object(
      'feedback_30d', coalesce((select count(*) from public.improvement_feedback where organization_id = v_org_id and created_at > now() - interval '30 days'), 0),
      'initiatives_completed_90d', coalesce((select count(*) from public.improvement_initiatives where organization_id = v_org_id and status = 'completed' and updated_at > now() - interval '90 days'), 0),
      'avg_improvement_pct', coalesce((select round(avg(improvement_percentage), 1) from public.improvement_success_measurements where organization_id = v_org_id), 0)
    ),
    'memory_integration', public._cie_memory_summary(v_org_id),
    'recent_feedback', coalesce((
      select jsonb_agg(row_to_json(f) order by f.created_at desc)
      from public.improvement_feedback f where f.organization_id = v_org_id limit 10
    ), '[]'::jsonb),
    'outcomes', coalesce((
      select jsonb_agg(row_to_json(o) order by o.measured_at desc)
      from public.improvement_outcomes o where o.organization_id = v_org_id limit 10
    ), '[]'::jsonb),
    'experiments', coalesce((
      select jsonb_agg(row_to_json(e) order by case e.status when 'active' then 0 when 'approved' then 1 when 'proposed' then 2 else 3 end, e.created_at desc)
      from public.adaptive_organization_experiments e where e.organization_id = v_org_id and e.status not in ('cancelled', 'deferred') limit 10
    ), '[]'::jsonb),
    'improvement_portfolio', coalesce((
      select jsonb_agg(row_to_json(p) order by case p.portfolio_status when 'current' then 0 when 'completed' then 1 else 2 end, p.updated_at desc)
      from public.adaptive_organization_improvement_portfolio p where p.organization_id = v_org_id limit 10
    ), '[]'::jsonb),
    'fatigue_signals', coalesce((
      select jsonb_agg(row_to_json(s) order by s.measured_at desc)
      from public.adaptive_organization_fatigue_signals s where s.organization_id = v_org_id limit 10
    ), '[]'::jsonb),
    'continuous_improvement_organizational_evolution_blueprint', public._cioebp90_blueprint_block() || jsonb_build_object(
      'success_criteria', public._cioebp90_success_criteria(v_org_id),
      'engagement_summary', public._cioebp90_engagement_summary(v_org_id)
    ),
    'implementation_blueprint_phase134', public._aoabp134_blueprint_block() || jsonb_build_object(
      'success_criteria', public._aoabp134_success_criteria(v_org_id),
      'engagement_summary', public._aoabp134_engagement_summary(v_org_id)
    )
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Replace card — preserve ALL fields; append Phase 134
-- ---------------------------------------------------------------------------
create or replace function public.get_continuous_improvement_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  return jsonb_build_object(
    'has_organization', true,
    'active_improvements', coalesce((select count(*) from public.improvement_items where organization_id = v_org_id and status in ('identified', 'under_review', 'approved')), 0),
    'philosophy', 'Continuous refinement through feedback and outcomes.',
    'initiatives_active', coalesce((select count(*) from public.improvement_initiatives where organization_id = v_org_id and status in ('proposed', 'approved', 'in_progress')), 0),
    'experiments_active', coalesce((select count(*) from public.adaptive_organization_experiments where organization_id = v_org_id and status in ('proposed', 'approved', 'active', 'review')), 0),
    'continuous_improvement_organizational_evolution_blueprint', public._cioebp90_blueprint_block() || jsonb_build_object(
      'success_criteria', public._cioebp90_success_criteria(v_org_id),
      'engagement_summary', public._cioebp90_engagement_summary(v_org_id),
      'blueprint_note', 'Continuous Improvement & Organizational Evolution (ABOS Phase 90) — extends A.33 + A.49 with learning cycles, experimentation principles, and org evolution scaffolding.'
    ),
    'implementation_blueprint_phase134', public._aoabp134_blueprint_block() || jsonb_build_object(
      'success_criteria', public._aoabp134_success_criteria(v_org_id),
      'engagement_summary', public._aoabp134_engagement_summary(v_org_id),
      'blueprint_note', 'Adaptive Organization & Continuous Optimization (Phase 134) — Autonomous Organization Era adaptive optimization depth on CIE route.'
    )
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Grants
-- ---------------------------------------------------------------------------
grant execute on function public._aoabp134_distinction_note() to authenticated;
grant execute on function public._aoabp134_mission() to authenticated;
grant execute on function public._aoabp134_philosophy() to authenticated;
grant execute on function public._aoabp134_abos_principle() to authenticated;
grant execute on function public._aoabp134_vision() to authenticated;
grant execute on function public._aoabp134_objectives() to authenticated;
grant execute on function public._aoabp134_adaptive_organization_center() to authenticated;
grant execute on function public._aoabp134_continuous_optimization_engine() to authenticated;
grant execute on function public._aoabp134_learning_loops() to authenticated;
grant execute on function public._aoabp134_experimentation_framework() to authenticated;
grant execute on function public._aoabp134_adaptation_insight_engine() to authenticated;
grant execute on function public._aoabp134_optimization_companion() to authenticated;
grant execute on function public._aoabp134_change_fatigue_protection() to authenticated;
grant execute on function public._aoabp134_improvement_portfolio_engine() to authenticated;
grant execute on function public._aoabp134_companion_limitations() to authenticated;
grant execute on function public._aoabp134_self_love_connection() to authenticated;
grant execute on function public._aoabp134_security_requirements() to authenticated;
grant execute on function public._aoabp134_integration_links() to authenticated;
grant execute on function public._aoabp134_dogfooding() to authenticated;
grant execute on function public._aoabp134_vision_phrases() to authenticated;
grant execute on function public._aoabp134_privacy_note() to authenticated;
grant execute on function public._aoabp134_engagement_summary(uuid) to authenticated;
grant execute on function public._aoabp134_success_criteria(uuid) to authenticated;
grant execute on function public._aoabp134_era_autonomous_organization_cross_links() to authenticated;
grant execute on function public._aoabp134_blueprint_block() to authenticated;
grant execute on function public.record_adaptive_organization_experiment(text, text, text, text, text) to authenticated;
grant execute on function public.list_improvement_portfolio(text) to authenticated;
