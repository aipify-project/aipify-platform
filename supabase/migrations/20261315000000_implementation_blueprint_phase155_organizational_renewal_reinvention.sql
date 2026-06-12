-- Implementation Blueprint Phase 155 — Organizational Renewal & Reinvention Engine
-- Legacy & Future Stewardship Era (151–160). Extends Change Management Engine A.47 + Blueprint Phases 62 & 127.
-- Helpers: _orrebp155_* (never collide with _cme_*, _cmbp_*, _tcobp127_*).
-- Cross-links Resilience 154, Decision Heritage 153, Org Legacy 152, Future Leaders 151, Purpose 138, Growth A.81, CI 134, Foresight 122 — do NOT duplicate.

-- ---------------------------------------------------------------------------
-- 1. Optional tables (tenant-scoped, metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.organizational_renewal_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  plan_key text not null,
  plan_title text not null,
  plan_type text not null default 'renewal' check (
    plan_type in ('renewal', 'reinvention', 'identity_preservation', 'opportunity_mapping', 'readiness')
  ),
  status text not null default 'draft' check (
    status in ('draft', 'review', 'approved', 'active', 'archived')
  ),
  summary_metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  review_cycle text default 'quarterly',
  recorded_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, plan_key)
);

create index if not exists organizational_renewal_plans_org_idx
  on public.organizational_renewal_plans (organization_id, status, created_at desc);

alter table public.organizational_renewal_plans enable row level security;
revoke all on public.organizational_renewal_plans from authenticated, anon;

create table if not exists public.organizational_renewal_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  review_key text not null,
  review_type text not null check (
    review_type in (
      'executive_renewal', 'readiness_assessment', 'identity_preservation',
      'assumption_challenge', 'complacency_awareness', 'opportunity_mapping'
    )
  ),
  review_title text not null,
  status text not null default 'draft' check (
    status in ('draft', 'review', 'completed', 'archived')
  ),
  reflection_summary text check (reflection_summary is null or char_length(reflection_summary) <= 500),
  summary_metadata jsonb not null default '{"metadata_only":true,"not_strategy_determination":true}'::jsonb,
  recorded_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, review_key)
);

create index if not exists organizational_renewal_reviews_org_idx
  on public.organizational_renewal_reviews (organization_id, review_type, status, created_at desc);

alter table public.organizational_renewal_reviews enable row level security;
revoke all on public.organizational_renewal_reviews from authenticated, anon;

create table if not exists public.organizational_renewal_memory (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  memory_key text not null,
  memory_type text not null check (
    memory_type in (
      'transformation_history', 'innovation_story', 'leadership_reflection',
      'future_planning_exercise', 'governance_lesson', 'renewal_outcome'
    )
  ),
  memory_title text not null,
  summary_metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  status text not null default 'draft' check (
    status in ('draft', 'review', 'approved', 'archived')
  ),
  recorded_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, memory_key)
);

create index if not exists organizational_renewal_memory_org_idx
  on public.organizational_renewal_memory (organization_id, memory_type, status);

alter table public.organizational_renewal_memory enable row level security;
revoke all on public.organizational_renewal_memory from authenticated, anon;

create table if not exists public.organizational_renewal_scenarios (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  scenario_key text not null,
  scenario_type text not null check (
    scenario_type in (
      'market_evolution', 'capability_gap', 'emerging_opportunity',
      'innovation_readiness', 'identity_evolution', 'sustainability_balance'
    )
  ),
  scenario_title text not null,
  exploration_level text not null default 'exploring' check (
    exploration_level in ('exploring', 'developing', 'reviewed', 'archived')
  ),
  summary_metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  recorded_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, scenario_key)
);

create index if not exists organizational_renewal_scenarios_org_idx
  on public.organizational_renewal_scenarios (organization_id, scenario_type, exploration_level);

alter table public.organizational_renewal_scenarios enable row level security;
revoke all on public.organizational_renewal_scenarios from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Seed helper
-- ---------------------------------------------------------------------------
create or replace function public._orrebp155_seed(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.organizational_renewal_plans where organization_id = p_organization_id limit 1
  ) then
    return;
  end if;

  insert into public.organizational_renewal_plans (
    organization_id, plan_key, plan_title, plan_type, status, summary_metadata
  ) values
    (p_organization_id, 'core_renewal_framework', 'Core organizational renewal framework', 'renewal', 'active',
     '{"requires_executive_review":true,"identity_preservation":true}'::jsonb),
    (p_organization_id, 'identity_preservation_plan', 'Identity preservation and evolution plan', 'identity_preservation', 'review',
     '{"cross_link":"purpose_values_138"}'::jsonb);

  insert into public.organizational_renewal_scenarios (
    organization_id, scenario_key, scenario_type, scenario_title, exploration_level, summary_metadata
  ) values
    (p_organization_id, 'market_evolution_awareness', 'market_evolution', 'Market evolution awareness scenario', 'developing',
     '{"cross_link":"strategic_foresight_122","not_fear_framing":true}'::jsonb),
    (p_organization_id, 'innovation_readiness', 'innovation_readiness', 'Innovation readiness exploration scaffold', 'exploring',
     '{"cross_link":"innovation_lab","not_reckless_transformation":true}'::jsonb),
    (p_organization_id, 'capability_gap_visibility', 'capability_gap', 'Capability gap visibility scenario', 'developing',
     '{"cross_link":"growth_evolution_a81"}'::jsonb);

  insert into public.organizational_renewal_reviews (
    organization_id, review_key, review_type, review_title, status,
    reflection_summary, summary_metadata
  ) values
    (p_organization_id, 'quarterly_renewal_review', 'executive_renewal', 'Quarterly executive renewal review', 'review',
     'Prepared for future while preserving purpose — assumptions challenged with compassion, not urgency.',
     '{"metadata_only":true,"executive_approval_required":true}'::jsonb);

  insert into public.organizational_renewal_memory (
    organization_id, memory_key, memory_type, memory_title, status, summary_metadata
  ) values
    (p_organization_id, 'transformation_retrospective_q1', 'transformation_history', 'Transformation retrospective — lessons for renewal', 'review',
     '{"cross_link":"change_management_127","theme":"intentional_reinvention"}'::jsonb),
    (p_organization_id, 'innovation_story_heritage', 'innovation_story', 'Innovation story — organizational heritage', 'draft',
     '{"cross_link":"org_legacy_152"}'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Blueprint helpers
-- ---------------------------------------------------------------------------
create or replace function public._orrebp155_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 155 — Organizational Renewal & Reinvention Engine at /app/change-management-engine. Legacy & Future Stewardship Era (151–160). Layers on Change Management Engine Phase A.47 (20260823000000_change_management_engine_phase_a47.sql), ABOS Implementation Blueprint Phase 62 (_cmbp_* — 20261012000000_implementation_blueprint_phase62_change_management.sql), and Phase 127 (_tcobp127_* — 20261217000000_implementation_blueprint_phase127_transformation_orchestration_change_companion.sql). Phase 155 deepens intentional reinvention rooted in wisdom — NOT reckless transformation, NOT abandoning identity. Distinct from Phase 127 transformation orchestration (execution pacing) and Growth & Evolution A.81 (sustainable growth cycles). Renewal strengthens identity — does not erase it. Helpers _orrebp155_* only — never _cme_*, _cmbp_*, or _tcobp127_*. All A.47, Phase 62, and Phase 127 dashboard fields preserved.';
$$;

create or replace function public._orrebp155_mission()
returns text language sql immutable as $$
  select 'Support intentional organizational renewal and reinvention rooted in wisdom — preserve identity while evolving with courage, curiosity, and executive accountability.';
$$;

create or replace function public._orrebp155_philosophy()
returns text language sql immutable as $$
  select 'Intentional reinvention rooted in wisdom — not reckless transformation or abandoning identity. Growth Partner not Affiliate. People First. Wisdom before speed.';
$$;

create or replace function public._orrebp155_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Organizational Renewal & Reinvention supports perspective and preparation. Renewal Companion informs — does NOT determine strategy, force transformation, or replace executive leadership. Metadata only.';
$$;

create or replace function public._orrebp155_vision()
returns text language sql immutable as $$
  select 'Organizations renew with clarity — honoring what endures, evolving what must change, and preparing leaders for futures they choose with wisdom and compassion.';
$$;

create or replace function public._orrebp155_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'renewal_readiness', 'emoji', '🌱', 'label', 'Renewal readiness', 'description', 'Transformation readiness reviews and renewal planning frameworks — humans define pace'),
    jsonb_build_object('key', 'identity_preservation', 'emoji', '🏛️', 'label', 'Identity preservation', 'description', 'Values, traditions, and strengths that endure — cross-link Purpose 138'),
    jsonb_build_object('key', 'reinvention_intelligence', 'emoji', '🔭', 'label', 'Reinvention intelligence', 'description', 'Market evolution awareness, capability gaps, emerging opportunities — metadata scaffolds'),
    jsonb_build_object('key', 'executive_renewal', 'emoji', '🦉', 'label', 'Executive renewal reviews', 'description', 'Prepared for future, assumptions challenged, complacency awareness — leadership decides'),
    jsonb_build_object('key', 'innovation_balance', 'emoji', '⚖️', 'label', 'Innovation balance', 'description', 'Innovation vs stability, speed vs reflection, technology vs humanity'),
    jsonb_build_object('key', 'organizational_learning', 'emoji', '📚', 'label', 'Organizational learning', 'description', 'Transformation retrospectives, lessons learned, knowledge sharing — cross-link 141'),
    jsonb_build_object('key', 'renewal_memory', 'emoji', '✨', 'label', 'Renewal memory', 'description', 'Transformation histories, innovation stories, governance lessons — cross-link 152/153'),
    jsonb_build_object('key', 'companion_perspective', 'emoji', '🌹', 'label', 'Companion perspective', 'description', 'Renewal Companion supports reflection — never dictates strategy or forces transformation')
  );
$$;

create or replace function public._orrebp155_organizational_renewal_center()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'readiness_reviews', 'label', 'Transformation readiness reviews', 'description', 'Executive renewal readiness scaffolds — informed leaders, not surveillance'),
    jsonb_build_object('key', 'renewal_planning', 'label', 'Renewal planning frameworks', 'description', 'Structured renewal plans — metadata only, human-approved pacing'),
    jsonb_build_object('key', 'leadership_reflection', 'label', 'Leadership reflection sessions', 'description', 'Executive reflection prompts — wisdom before speed'),
    jsonb_build_object('key', 'identity_preservation_tools', 'label', 'Identity preservation tools', 'description', 'Values, traditions, strengths that endure — cross-link Purpose 138'),
    jsonb_build_object('key', 'opportunity_mapping', 'label', 'Future opportunity mapping', 'description', 'Emerging opportunity scaffolds — cross-link Strategic Foresight 122'),
    jsonb_build_object('key', 'companion_insights', 'label', 'Companion-led insights', 'description', 'Renewal Companion summaries — perspective only, not strategy'),
    jsonb_build_object('key', 'renewal_dashboards', 'label', 'Renewal dashboards', 'description', 'Aggregate renewal readiness and planning visibility — metadata only'),
    jsonb_build_object('key', 'knowledge_continuity', 'label', 'Knowledge continuity programs', 'description', 'Transformation memory and knowledge sharing — cross-link Org Legacy 152 and Knowledge Exchange 141')
  );
$$;

create or replace function public._orrebp155_reinvention_intelligence_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'market_evolution', 'label', 'Market evolution awareness', 'description', 'External change signals — cross-link Strategic Foresight 122'),
    jsonb_build_object('key', 'capability_gaps', 'label', 'Capability gap visibility', 'description', 'Organizational capability scaffolds — cross-link Growth & Evolution A.81'),
    jsonb_build_object('key', 'emerging_opportunities', 'label', 'Emerging opportunity identification', 'description', 'Future opportunity metadata — humans prioritize'),
    jsonb_build_object('key', 'transformation_planning', 'label', 'Transformation planning', 'description', 'Cross-link Phase 127 transformation orchestration — do not duplicate RPCs'),
    jsonb_build_object('key', 'innovation_readiness', 'label', 'Innovation readiness reviews', 'description', 'Innovation balance scaffolds — cross-link Innovation Lab and Innovation Impact'),
    jsonb_build_object('key', 'scenario_exploration', 'label', 'Future scenario exploration', 'description', 'Renewal scenario scaffolds — cross-link Strategic Foresight 122')
  );
$$;

create or replace function public._orrebp155_identity_preservation_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Renewal strengthens identity — does not erase it. Preserve purpose and values while evolving operations and capabilities.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'values_definition', 'label', 'Values definition', 'description', 'Core values that guide renewal decisions — cross-link Purpose 138'),
      jsonb_build_object('key', 'strengths_endure', 'label', 'Strengths that endure', 'description', 'Organizational strengths to protect during reinvention'),
      jsonb_build_object('key', 'meaningful_traditions', 'label', 'Meaningful traditions', 'description', 'Traditions worth preserving — cultural continuity'),
      jsonb_build_object('key', 'what_must_evolve', 'label', 'What must evolve', 'description', 'Honest assessment of what requires change — not abandonment'),
      jsonb_build_object('key', 'responsibilities_growth', 'label', 'Responsibilities of growth', 'description', 'Stewardship obligations as organizations evolve — cross-link Purpose 138')
    ),
    'purpose_values_route', '/app/purpose-values-engine',
    'boundary_note', 'Purpose & Values Phase 138 owns purpose alignment — Phase 155 links identity preservation; do not duplicate PVE RPCs.'
  );
$$;

create or replace function public._orrebp155_executive_renewal_reviews()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive renewal reviews prepare leaders for thoughtful reinvention — humans decide; Aipify informs and prepares.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'prepared_for_future', 'label', 'Prepared for future', 'description', 'Future readiness reflection — not fear framing'),
      jsonb_build_object('key', 'assumptions_challenge', 'label', 'Assumptions to challenge', 'description', 'Constructive assumption review — curiosity not blame'),
      jsonb_build_object('key', 'complacency_awareness', 'label', 'Complacency awareness', 'description', 'Gentle awareness of stagnation signals — no guilt'),
      jsonb_build_object('key', 'emerging_opportunities', 'label', 'Emerging opportunities', 'description', 'Opportunity identification scaffolds — leadership prioritizes'),
      jsonb_build_object('key', 'preserve_purpose', 'label', 'Preserve purpose while evolving', 'description', 'Identity preservation during change — cross-link Purpose 138')
    ),
    'boundary_note', 'Renewal Companion does NOT determine strategy or replace executive judgment.'
  );
$$;

create or replace function public._orrebp155_renewal_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'opportunity_summaries', 'label', 'Future opportunity summaries', 'description', 'Aggregate opportunity metadata — perspective not prescription'),
    jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts', 'description', 'Gentle leadership reflection — never guilt or pressure'),
    jsonb_build_object('key', 'transformation_preparation', 'label', 'Transformation preparation', 'description', 'Preparation scaffolds — cross-link Phase 127 orchestration'),
    jsonb_build_object('key', 'knowledge_discovery', 'label', 'Knowledge discovery', 'description', 'Relevant renewal knowledge references — approved sources only'),
    jsonb_build_object('key', 'executive_briefings', 'label', 'Executive briefings', 'description', 'Renewal readiness briefing metadata — humans deliver'),
    jsonb_build_object('key', 'readiness_insights', 'label', 'Renewal readiness insights', 'description', 'Readiness indicators — does NOT dictate strategy')
  );
$$;

create or replace function public._orrebp155_innovation_balance_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Balance innovation with stability — experimentation with governance, speed with reflection, growth with sustainability, technology with humanity.',
    'balances', jsonb_build_array(
      jsonb_build_object('key', 'innovation_stability', 'label', 'Innovation vs stability', 'description', 'Thoughtful experimentation without reckless disruption'),
      jsonb_build_object('key', 'experimentation_governance', 'label', 'Experimentation vs governance', 'description', 'Governed innovation — cross-link Innovation Lab'),
      jsonb_build_object('key', 'speed_reflection', 'label', 'Speed vs reflection', 'description', 'Wisdom before speed — healthy pacing over urgency traps'),
      jsonb_build_object('key', 'growth_sustainability', 'label', 'Growth vs sustainability', 'description', 'Sustainable reinvention — cross-link Growth A.81 and Continuous Improvement 134'),
      jsonb_build_object('key', 'technology_humanity', 'label', 'Technology vs humanity', 'description', 'People First — technology serves organizational wisdom')
    ),
    'innovation_lab_route', '/app/innovation-lab',
    'innovation_impact_route', '/app/innovation-impact-engine',
    'boundary_note', 'Innovation Lab and Innovation Impact cross-link only — Phase 155 does not duplicate innovation RPCs.'
  );
$$;

create or replace function public._orrebp155_organizational_learning_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizational learning from renewal — transformation retrospectives, lessons learned, and knowledge sharing strengthen future reinvention.',
    'learning_types', jsonb_build_array(
      jsonb_build_object('key', 'transformation_retrospectives', 'label', 'Transformation retrospectives', 'description', 'Post-initiative learning — cross-link Phase 127 memory'),
      jsonb_build_object('key', 'lessons_learned', 'label', 'Lessons learned', 'description', 'Metadata summaries — learning not blame'),
      jsonb_build_object('key', 'knowledge_sharing', 'label', 'Knowledge sharing', 'description', 'Approved knowledge distribution — cross-link Knowledge Exchange 141'),
      jsonb_build_object('key', 'gp_experiences', 'label', 'Growth Partner experiences', 'description', 'GP ecosystem learning patterns — Growth Partner not Affiliate'),
      jsonb_build_object('key', 'leadership_narratives', 'label', 'Leadership narratives', 'description', 'Executive reflection metadata — cross-link Future Leaders 151'),
      jsonb_build_object('key', 'community_contributions', 'label', 'Community contributions', 'description', 'Community learning patterns — metadata only')
    ),
    'knowledge_exchange_route', '/app/global-knowledge-exchange-engine',
    'boundary_note', 'Global Knowledge Exchange Phase 141 owns interorganizational learning — cross-link only.'
  );
$$;

create or replace function public._orrebp155_renewal_memory_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Renewal memory captures how reinvention unfolded — transformation histories, innovation stories, and governance lessons for future leaders.',
    'captures', jsonb_build_array(
      jsonb_build_object('key', 'transformation_histories', 'label', 'Transformation histories', 'description', 'How change unfolded — metadata summaries'),
      jsonb_build_object('key', 'innovation_stories', 'label', 'Innovation stories', 'description', 'Innovation heritage narratives — cross-link Org Legacy 152'),
      jsonb_build_object('key', 'leadership_reflections', 'label', 'Leadership reflections', 'description', 'Executive renewal reflections — cross-link Future Leaders 151'),
      jsonb_build_object('key', 'future_planning', 'label', 'Future planning exercises', 'description', 'Scenario and planning metadata — cross-link Foresight 122'),
      jsonb_build_object('key', 'governance_lessons', 'label', 'Governance lessons', 'description', 'Governance adjustments during renewal — cross-link Decision Heritage 153'),
      jsonb_build_object('key', 'renewal_outcomes', 'label', 'Renewal outcomes', 'description', 'Outcome reviews — learning not blame')
    ),
    'org_legacy_route', '/app/organizational-memory-engine',
    'decision_heritage_route', '/app/decision-intelligence-engine',
    'boundary_note', 'Org Legacy Phase 152 and Decision Heritage Phase 153 own institutional memory — Phase 155 links renewal-specific captures.'
  );
$$;

create or replace function public._orrebp155_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'no_determine_strategy', 'label', 'Never determine strategy'),
    jsonb_build_object('key', 'no_force_transformation', 'label', 'Never force transformation'),
    jsonb_build_object('key', 'no_replace_leadership', 'label', 'Never replace executive leadership'),
    jsonb_build_object('key', 'no_suppress_viewpoints', 'label', 'Never suppress alternative viewpoints'),
    jsonb_build_object('key', 'no_override_governance', 'label', 'Never override governance')
  );
$$;

create or replace function public._orrebp155_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love during renewal — curiosity, courage, patience, self-awareness, recognition of progress, and compassion during uncertainty.',
    'patterns', jsonb_build_array(
      jsonb_build_object('key', 'curiosity', 'label', 'Curiosity'),
      jsonb_build_object('key', 'courage', 'label', 'Courage'),
      jsonb_build_object('key', 'patience', 'label', 'Patience'),
      jsonb_build_object('key', 'self_awareness', 'label', 'Self-awareness'),
      jsonb_build_object('key', 'recognition', 'label', 'Recognition of progress'),
      jsonb_build_object('key', 'compassion', 'label', 'Compassion during uncertainty')
    ),
    'renewal_phrase', 'Renewal requires courage and patience — wisdom before speed.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love is a principle — Change Management stores renewal metadata, not wellbeing content.'
  );
$$;

create or replace function public._orrebp155_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'transformation_audit_logs', 'label', 'Transformation audit logs', 'description', 'Renewal planning and review events auditable'),
    jsonb_build_object('key', 'executive_review_histories', 'label', 'Executive review histories', 'description', 'Renewal review metadata retained with RBAC'),
    jsonb_build_object('key', 'rbac', 'label', 'RBAC', 'description', 'changes.view · changes.manage · changes.review permissions'),
    jsonb_build_object('key', 'future_planning_controls', 'label', 'Future planning documentation controls', 'description', 'Scenario and plan metadata scoped by organization'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'description', 'Executive renewal actions respect tenant 2FA policies')
  );
$$;

create or replace function public._orrebp155_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'change_management', 'label', 'Change Management A.47 + Phases 62 & 127', 'route', '/app/change-management-engine', 'note', 'Primary engine — Phase 155 extends on same route'),
    jsonb_build_object('key', 'future_leaders', 'label', 'Future Leaders Phase 151', 'route', '/app/future-leaders-engine', 'note', 'Leadership development cross-link'),
    jsonb_build_object('key', 'org_legacy', 'label', 'Organizational Legacy Phase 152', 'route', '/app/organizational-memory-engine', 'note', 'Institutional memory cross-link — do not duplicate'),
    jsonb_build_object('key', 'decision_heritage', 'label', 'Decision Heritage Phase 153', 'route', '/app/decision-intelligence-engine', 'note', 'Governance lessons cross-link'),
    jsonb_build_object('key', 'resilience', 'label', 'Organizational Resilience Phase 154', 'route', '/app/organizational-resilience-engine', 'note', 'Adaptive continuity cross-link'),
    jsonb_build_object('key', 'transformation_127', 'label', 'Transformation Orchestration Phase 127', 'route', '/app/change-management-engine', 'note', 'Execution orchestration layer — preserved'),
    jsonb_build_object('key', 'purpose_values', 'label', 'Purpose & Values Phase 138', 'route', '/app/purpose-values-engine', 'note', 'Identity preservation cross-link'),
    jsonb_build_object('key', 'growth_evolution', 'label', 'Growth & Evolution A.81', 'route', '/app/growth-evolution-engine', 'note', 'Sustainable growth cycles — distinct from renewal'),
    jsonb_build_object('key', 'continuous_improvement', 'label', 'Continuous Improvement Phase 134', 'route', '/app/continuous-improvement-engine', 'note', 'Optimization loops cross-link'),
    jsonb_build_object('key', 'strategic_foresight', 'label', 'Strategic Foresight Phase 122', 'route', '/app/strategic-foresight-engine', 'note', 'Future scenario exploration cross-link'),
    jsonb_build_object('key', 'innovation_lab', 'label', 'Innovation Lab', 'route', '/app/innovation-lab', 'note', 'Innovation experimentation cross-link only'),
    jsonb_build_object('key', 'innovation_impact', 'label', 'Innovation Impact', 'route', '/app/innovation-impact-engine', 'note', 'Innovation outcomes cross-link only'),
    jsonb_build_object('key', 'knowledge_exchange', 'label', 'Knowledge Exchange Phase 141', 'route', '/app/global-knowledge-exchange-engine', 'note', 'Interorganizational learning cross-link'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Curiosity, courage, patience during renewal')
  );
$$;

create or replace function public._orrebp155_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group practices intentional renewal — dogfooding renewal frameworks before customer rollout.',
    'aipify_group', jsonb_build_object(
      'renewal_planning', 'Quarterly renewal readiness reviews for ABOS evolution',
      'identity_preservation', 'Core values and mission preserved during platform growth',
      'executive_reflection', 'Leadership reflection sessions on assumptions and opportunities'
    ),
    'unonight', jsonb_build_object(
      'pilot_renewal', 'Pilot renewal planning scaffolds with Unonight leadership review',
      'transformation_memory', 'Capture transformation lessons for future initiatives',
      'companion_perspective', 'Renewal Companion perspective — never dictates strategy'
    )
  );
$$;

create or replace function public._orrebp155_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Intentional reinvention rooted in wisdom',
    'Renewal strengthens identity — does not erase it',
    'Wisdom before speed — courage with patience',
    'Humans lead; Aipify informs and prepares',
    'Growth Partner not Affiliate — stewardship through responsibility'
  );
$$;

create or replace function public._orrebp155_privacy_note()
returns text language sql immutable as $$
  select 'Metadata only — renewal planning, executive reviews, and scenario exploration are organization-scoped and auditable. No PII, no employee surveillance, no strategy determination by Companion.';
$$;

create or replace function public._orrebp155_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_base jsonb;
  v_plans int := 0;
  v_reviews int := 0;
  v_memory int := 0;
  v_scenarios int := 0;
begin
  perform public._orrebp155_seed(p_org_id);
  v_base := public._tcobp127_engagement_summary(p_org_id);

  select count(*) into v_plans from public.organizational_renewal_plans where organization_id = p_org_id;
  select count(*) into v_reviews from public.organizational_renewal_reviews where organization_id = p_org_id;
  select count(*) into v_memory from public.organizational_renewal_memory where organization_id = p_org_id;
  select count(*) into v_scenarios from public.organizational_renewal_scenarios where organization_id = p_org_id;

  return v_base || jsonb_build_object(
    'objectives_count', jsonb_array_length(public._orrebp155_objectives()),
    'renewal_center_capabilities', jsonb_array_length(public._orrebp155_organizational_renewal_center()),
    'reinvention_intelligence_count', jsonb_array_length(public._orrebp155_reinvention_intelligence_engine()),
    'identity_preservation_dimensions', jsonb_array_length(public._orrebp155_identity_preservation_framework()->'dimensions'),
    'executive_renewal_dimensions', jsonb_array_length(public._orrebp155_executive_renewal_reviews()->'dimensions'),
    'renewal_companion_supports', jsonb_array_length(public._orrebp155_renewal_companion()),
    'innovation_balance_count', jsonb_array_length(public._orrebp155_innovation_balance_engine()->'balances'),
    'organizational_learning_types', jsonb_array_length(public._orrebp155_organizational_learning_engine()->'learning_types'),
    'renewal_memory_captures', jsonb_array_length(public._orrebp155_renewal_memory_engine()->'captures'),
    'companion_limitations_count', jsonb_array_length(public._orrebp155_companion_limitations()),
    'integration_links_count', jsonb_array_length(public._orrebp155_integration_links()),
    'phase155_renewal_plans', v_plans,
    'phase155_renewal_reviews', v_reviews,
    'phase155_renewal_memory_entries', v_memory,
    'phase155_renewal_scenarios', v_scenarios,
    'privacy_note', public._orrebp155_privacy_note()
  );
end; $$;

create or replace function public._orrebp155_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
begin
  v_engagement := public._orrebp155_engagement_summary(p_organization_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'objectives', 'label', 'Eight renewal objectives documented', 'met', jsonb_array_length(public._orrebp155_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'renewal_center', 'label', 'Organizational Renewal Center — eight capabilities', 'met', jsonb_array_length(public._orrebp155_organizational_renewal_center()) = 8, 'note', null),
    jsonb_build_object('key', 'reinvention_intelligence', 'label', 'Reinvention intelligence engine — six capabilities', 'met', jsonb_array_length(public._orrebp155_reinvention_intelligence_engine()) = 6, 'note', 'Cross-link Phase 127 and Foresight 122.'),
    jsonb_build_object('key', 'identity_preservation', 'label', 'Identity preservation framework — five dimensions', 'met', jsonb_array_length(public._orrebp155_identity_preservation_framework()->'dimensions') = 5, 'note', 'Cross-link Purpose 138.'),
    jsonb_build_object('key', 'executive_renewal', 'label', 'Executive renewal reviews — five dimensions', 'met', jsonb_array_length(public._orrebp155_executive_renewal_reviews()->'dimensions') = 5, 'note', 'Does NOT determine strategy.'),
    jsonb_build_object('key', 'renewal_companion', 'label', 'Renewal Companion — six supports', 'met', jsonb_array_length(public._orrebp155_renewal_companion()) = 6, 'note', 'Perspective only — never dictates strategy.'),
    jsonb_build_object('key', 'innovation_balance', 'label', 'Innovation balance engine — five balances', 'met', jsonb_array_length(public._orrebp155_innovation_balance_engine()->'balances') = 5, 'note', 'Wisdom before speed.'),
    jsonb_build_object('key', 'organizational_learning', 'label', 'Organizational learning engine — six types', 'met', jsonb_array_length(public._orrebp155_organizational_learning_engine()->'learning_types') = 6, 'note', 'Cross-link Knowledge Exchange 141.'),
    jsonb_build_object('key', 'renewal_memory', 'label', 'Renewal memory engine — six captures', 'met', jsonb_array_length(public._orrebp155_renewal_memory_engine()->'captures') = 6, 'note', 'Cross-link Org Legacy 152 and Decision Heritage 153.'),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations — five never rules', 'met', jsonb_array_length(public._orrebp155_companion_limitations()) = 5, 'note', 'No forcing transformation or overriding governance.'),
    jsonb_build_object('key', 'integration_links', 'label', 'Mandatory cross-links documented', 'met', jsonb_array_length(public._orrebp155_integration_links()) >= 12, 'note', null),
    jsonb_build_object('key', 'security_requirements', 'label', 'Security requirements documented', 'met', jsonb_array_length(public._orrebp155_security_requirements()) = 5, 'note', 'Audit logs, RBAC, 2FA awareness.'),
    jsonb_build_object('key', 'phase127_preserved', 'label', 'Phase 127 _tcobp127_* fields preserved', 'met', jsonb_array_length(public._tcobp127_objectives()) = 8, 'note', 'Phase 155 layers on Phase 127 — does not replace.'),
    jsonb_build_object('key', 'phase62_preserved', 'label', 'Phase 62 _cmbp_* scaffolds preserved', 'met', jsonb_array_length(public._cmbp_objectives()) >= 6, 'note', null),
    jsonb_build_object('key', 'live_renewal_data', 'label', 'Live renewal planning scaffolds', 'met', coalesce((v_engagement->>'phase155_renewal_plans')::int, 0) > 0, 'note', case when coalesce((v_engagement->>'phase155_renewal_plans')::int, 0) = 0 then 'Seed renewal plans to begin.' else format('%s plan(s), %s review(s).', v_engagement->>'phase155_renewal_plans', v_engagement->>'phase155_renewal_reviews') end),
    jsonb_build_object('key', 'distinction', 'label', 'Phase 155 vs Phase 127 distinction documented', 'met', position('Phase 127' in public._orrebp155_distinction_note()) > 0, 'note', public._orrebp155_distinction_note())
  );
end; $$;

create or replace function public._orrebp155_blueprint_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._orrebp155_seed(p_organization_id);
  return jsonb_build_object(
    'phase', '155',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE155_ORGANIZATIONAL_RENEWAL_REINVENTION.md',
    'spec_doc', 'ORGANIZATIONAL_RENEWAL_REINVENTION_ENGINE_PHASE155.md',
    'engine_phase', 'Phase A.47 Change Management Engine',
    'era', 'Legacy & Future Stewardship Era (151–160)',
    'route', '/app/change-management-engine',
    'distinction_note', public._orrebp155_distinction_note(),
    'mission', public._orrebp155_mission(),
    'philosophy', public._orrebp155_philosophy(),
    'abos_principle', public._orrebp155_abos_principle(),
    'vision', public._orrebp155_vision(),
    'objectives', public._orrebp155_objectives(),
    'organizational_renewal_center', public._orrebp155_organizational_renewal_center(),
    'reinvention_intelligence_engine', public._orrebp155_reinvention_intelligence_engine(),
    'identity_preservation_framework', public._orrebp155_identity_preservation_framework(),
    'executive_renewal_reviews', public._orrebp155_executive_renewal_reviews(),
    'renewal_companion', public._orrebp155_renewal_companion(),
    'innovation_balance_engine', public._orrebp155_innovation_balance_engine(),
    'organizational_learning_engine', public._orrebp155_organizational_learning_engine(),
    'renewal_memory_engine', public._orrebp155_renewal_memory_engine(),
    'companion_limitations', public._orrebp155_companion_limitations(),
    'self_love_connection', public._orrebp155_self_love_connection(),
    'security_requirements', public._orrebp155_security_requirements(),
    'integration_links', public._orrebp155_integration_links(),
    'dogfooding', public._orrebp155_dogfooding(),
    'success_criteria', public._orrebp155_success_criteria(p_organization_id),
    'engagement_summary', public._orrebp155_engagement_summary(p_organization_id),
    'vision_phrases', public._orrebp155_vision_phrases(),
    'privacy_note', public._orrebp155_privacy_note()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Thin RPCs (metadata scaffolds)
-- ---------------------------------------------------------------------------
create or replace function public.record_executive_renewal_review(
  p_review_type text,
  p_title text,
  p_reflection_summary text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_key text;
  v_id uuid;
begin
  perform public._irp_require_permission('changes.review');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if p_review_type is null or p_review_type not in (
    'executive_renewal', 'readiness_assessment', 'identity_preservation',
    'assumption_challenge', 'complacency_awareness', 'opportunity_mapping'
  ) then
    raise exception 'invalid_review_type';
  end if;

  if p_title is null or trim(p_title) = '' then
    raise exception 'title_required';
  end if;

  v_key := 'renewal_review_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);

  insert into public.organizational_renewal_reviews (
    organization_id, review_key, review_type, review_title, status,
    reflection_summary, summary_metadata, recorded_by
  )
  values (
    v_org_id, v_key, p_review_type, trim(p_title), 'draft',
    case when p_reflection_summary is not null then left(p_reflection_summary, 500) else null end,
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('metadata_only', true, 'not_strategy_determination', true),
    v_user_id
  )
  returning id into v_id;

  return jsonb_build_object(
    'success', true,
    'review_id', v_id,
    'review_key', v_key,
    'status', 'draft',
    'companion_limitation', 'Renewal Companion does NOT determine strategy or replace executive leadership.',
    'privacy_note', public._orrebp155_privacy_note()
  );
end; $$;

create or replace function public.register_renewal_memory_entry(
  p_memory_type text,
  p_title text,
  p_summary text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_key text;
  v_id uuid;
begin
  perform public._irp_require_permission('changes.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if p_memory_type is null or p_memory_type not in (
    'transformation_history', 'innovation_story', 'leadership_reflection',
    'future_planning_exercise', 'governance_lesson', 'renewal_outcome'
  ) then
    raise exception 'invalid_memory_type';
  end if;

  if p_title is null or trim(p_title) = '' then
    raise exception 'title_required';
  end if;

  v_key := 'renewal_memory_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);

  insert into public.organizational_renewal_memory (
    organization_id, memory_key, memory_type, memory_title, status,
    summary_metadata, recorded_by
  )
  values (
    v_org_id, v_key, p_memory_type, trim(p_title), 'draft',
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object(
      'metadata_only', true,
      'summary', case when p_summary is not null then left(p_summary, 500) else null end
    ),
    v_user_id
  )
  returning id into v_id;

  return jsonb_build_object(
    'success', true,
    'memory_id', v_id,
    'memory_key', v_key,
    'status', 'draft',
    'boundary_note', 'Cross-link Org Legacy 152 and Decision Heritage 153 — do not duplicate institutional memory RPCs.',
    'privacy_note', public._orrebp155_privacy_note()
  );
end; $$;

create or replace function public.create_renewal_scenario(
  p_scenario_type text,
  p_title text,
  p_summary text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_key text;
  v_id uuid;
begin
  perform public._irp_require_permission('changes.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if p_scenario_type is null or p_scenario_type not in (
    'market_evolution', 'capability_gap', 'emerging_opportunity',
    'innovation_readiness', 'identity_evolution', 'sustainability_balance'
  ) then
    raise exception 'invalid_scenario_type';
  end if;

  if p_title is null or trim(p_title) = '' then
    raise exception 'title_required';
  end if;

  v_key := 'renewal_scenario_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);

  insert into public.organizational_renewal_scenarios (
    organization_id, scenario_key, scenario_type, scenario_title, exploration_level,
    summary_metadata, recorded_by
  )
  values (
    v_org_id, v_key, p_scenario_type, trim(p_title), 'exploring',
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object(
      'metadata_only', true,
      'summary', case when p_summary is not null then left(p_summary, 500) else null end,
      'cross_link', 'strategic_foresight_122'
    ),
    v_user_id
  )
  returning id into v_id;

  return jsonb_build_object(
    'success', true,
    'scenario_id', v_id,
    'scenario_key', v_key,
    'exploration_level', 'exploring',
    'companion_limitation', 'Renewal Companion supports exploration — does NOT force transformation.',
    'privacy_note', public._orrebp155_privacy_note()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Dashboard RPC — preserve ALL A.47 + Phase 62 + Phase 127; append Phase 155
-- ---------------------------------------------------------------------------
create or replace function public.get_change_management_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('changes.view');
  v_org_id := public._mta_require_organization();
  perform public._cme_seed_initiatives(v_org_id);
  perform public._orrebp155_seed(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Human-centered adoption — transparent communication, structured implementation, measurable outcomes.',
    'principles', jsonb_build_array(
      'Human-centered adoption',
      'Transparent communication',
      'Structured implementation',
      'Measurable outcomes',
      'Audit-supported accountability'
    ),
    'summary', jsonb_build_object(
      'total_initiatives', coalesce((
        select count(*) from public.change_initiatives where organization_id = v_org_id
      ), 0),
      'active', coalesce((
        select count(*) from public.change_initiatives
        where organization_id = v_org_id and status in ('planning', 'in_progress')
      ), 0),
      'completed', coalesce((
        select count(*) from public.change_initiatives
        where organization_id = v_org_id and status = 'completed'
      ), 0),
      'pending_communications', coalesce((
        select count(*) from public.change_communication_plans
        where organization_id = v_org_id and status in ('draft', 'scheduled')
      ), 0),
      'pending_milestones', coalesce((
        select count(*) from public.change_milestones
        where organization_id = v_org_id and status = 'pending'
      ), 0)
    ),
    'initiatives', coalesce((
      select jsonb_agg(row_to_json(ci) order by ci.created_at desc)
      from public.change_initiatives ci where ci.organization_id = v_org_id
    ), '[]'::jsonb),
    'impact_assessments', coalesce((
      select jsonb_agg(row_to_json(ia) order by ia.created_at desc)
      from public.change_impact_assessments ia where ia.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'communication_plans', coalesce((
      select jsonb_agg(row_to_json(cp) order by cp.created_at desc)
      from public.change_communication_plans cp where cp.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'adoption_metrics', coalesce((
      select jsonb_agg(row_to_json(am) order by am.recorded_at desc)
      from public.change_adoption_metrics am where am.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'milestones', coalesce((
      select jsonb_agg(row_to_json(m) order by m.initiative_id, m.milestone_order)
      from public.change_milestones m where m.organization_id = v_org_id
    ), '[]'::jsonb),
    'integration_notes', jsonb_build_object(
      'deployment_environment', 'Extends Deployment & Environment Management (A.20)',
      'customer_success', 'Aligns adoption metrics with Customer Success (A.26)',
      'learning_training', 'Training assignments hook to Learning & Training (A.36) — metadata only',
      'human_oversight', 'High-impact changes respect Human Oversight (A.40) approval patterns'
    ),
    'integration_summaries', jsonb_build_object(
      'learning', public._cme_learning_summary(v_org_id),
      'deployment', public._cme_deployment_summary(v_org_id),
      'customer_success', public._cme_customer_success_summary(v_org_id)
    ),
    'implementation_blueprint_phase62', jsonb_build_object(
      'phase', 'Phase 62 — Change Management Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE62_CHANGE_MANAGEMENT.md',
      'engine_phase', 'Phase A.47 Change Management Engine',
      'route', '/app/change-management-engine',
      'mapping_note', 'ABOS Blueprint Phase 62 extends A.47 with human-centered change framing — communication, adoption support, resistance awareness, and leadership insights.'
    ),
    'change_management_note', 'Change Management Engine (ABOS Phase 62) — extends Phase A.47 with people-centered change adoption, readiness assessment, companion guidance, and live engagement summary.',
    'blueprint_distinction_note', public._cmbp_distinction_note(),
    'blueprint_mission', public._cmbp_mission(),
    'blueprint_philosophy', public._cmbp_philosophy(),
    'blueprint_abos_principle', public._cmbp_abos_principle(),
    'vision', 'Transformation without losing people — leaders supported, employees included; this change was handled thoughtfully.',
    'blueprint_objectives', public._cmbp_objectives(),
    'blueprint_change_types', public._cmbp_change_types(),
    'readiness_assessment', public._cmbp_readiness_assessment(),
    'companion_guidance', public._cmbp_companion_guidance(),
    'communication_support', public._cmbp_communication_support(),
    'adoption_support', public._cmbp_adoption_support(),
    'resistance_awareness', public._cmbp_resistance_awareness(),
    'self_love_connection', public._cmbp_self_love_connection(),
    'leadership_insights', public._cmbp_leadership_insights(),
    'trust_connection', public._cmbp_trust_connection(),
    'dogfooding', public._cmbp_dogfooding(),
    'blueprint_integration_links', public._cmbp_integration_links(),
    'engagement_summary', public._cmbp_engagement_summary(v_org_id),
    'success_criteria', public._cmbp_success_criteria(v_org_id),
    'vision_phrases', public._cmbp_vision_phrases(),
    'privacy_note', 'Change management data is organization-scoped, explainable, and auditable. Metadata only — no PII.',
    'implementation_blueprint_phase127', public._tcobp127_blueprint_block(v_org_id),
    'transformation_orchestration_phase127_note', 'Enterprise Intelligence Phase 127 — Transformation Orchestration & Change Companion deepens orchestration, adoption intelligence, and transformation memory on Phase 62 scaffolds. Change with people not to people — humans lead; Aipify prepares and informs.',
    'implementation_blueprint_phase155', public._orrebp155_blueprint_block(v_org_id),
    'organizational_renewal_phase155_note', 'Legacy & Future Stewardship Phase 155 — Organizational Renewal & Reinvention deepens intentional reinvention rooted in wisdom on Phase 127 scaffolds. Renewal strengthens identity — does not erase it. Renewal Companion supports perspective — humans lead; Aipify informs and prepares.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Card RPC — preserve A.47 + Phase 62 + Phase 127; append Phase 155
-- ---------------------------------------------------------------------------
create or replace function public.get_change_management_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_engagement jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._cme_seed_initiatives(v_org_id);
  perform public._orrebp155_seed(v_org_id);
  v_engagement := public._cmbp_engagement_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Structured change adoption with transparent communication and measurable outcomes.',
    'active_initiatives', coalesce((
      select count(*) from public.change_initiatives
      where organization_id = v_org_id and status in ('planning', 'in_progress')
    ), 0),
    'pending_milestones', coalesce((
      select count(*) from public.change_milestones
      where organization_id = v_org_id and status = 'pending'
    ), 0),
    'implementation_blueprint_phase62', jsonb_build_object(
      'phase', 'Phase 62 — Change Management Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE62_CHANGE_MANAGEMENT.md',
      'engine_phase', 'Phase A.47 Change Management Engine',
      'route', '/app/change-management-engine'
    ),
    'mission', public._cmbp_mission(),
    'abos_principle', public._cmbp_abos_principle(),
    'engagement_summary', v_engagement,
    'blueprint_note', 'Change Management Engine (ABOS Phase 62) — extends Phase A.47 with people-centered adoption, communication support, and live success criteria.',
    'change_note', 'Help people move confidently from one reality to another — humans lead; Aipify prepares and informs.',
    'implementation_blueprint_phase127', jsonb_build_object(
      'phase', 'Phase 127 — Transformation Orchestration & Change Companion',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE127_TRANSFORMATION_ORCHESTRATION_CHANGE_COMPANION.md',
      'spec_doc', 'TRANSFORMATION_ORCHESTRATION_CHANGE_COMPANION_ENGINE_PHASE127.md',
      'engine_phase', 'Phase A.47 Change Management Engine',
      'era', 'Enterprise Intelligence Era (121–130)',
      'route', '/app/change-management-engine'
    ),
    'phase127_mission', public._tcobp127_mission(),
    'phase127_abos_principle', public._tcobp127_abos_principle(),
    'phase127_engagement_summary', public._tcobp127_engagement_summary(v_org_id),
    'phase127_note', 'Enterprise Intelligence Phase 127 orchestrates transformation with clarity and empathy — metadata only, no employee surveillance.',
    'implementation_blueprint_phase155', jsonb_build_object(
      'phase', 'Phase 155 — Organizational Renewal & Reinvention',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE155_ORGANIZATIONAL_RENEWAL_REINVENTION.md',
      'spec_doc', 'ORGANIZATIONAL_RENEWAL_REINVENTION_ENGINE_PHASE155.md',
      'engine_phase', 'Phase A.47 Change Management Engine',
      'era', 'Legacy & Future Stewardship Era (151–160)',
      'route', '/app/change-management-engine'
    ),
    'phase155_mission', public._orrebp155_mission(),
    'phase155_abos_principle', public._orrebp155_abos_principle(),
    'phase155_engagement_summary', public._orrebp155_engagement_summary(v_org_id),
    'phase155_note', 'Legacy & Future Stewardship Phase 155 — intentional reinvention rooted in wisdom. Renewal Companion supports perspective — does NOT determine strategy.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._orrebp155_seed(uuid) to authenticated;
grant execute on function public._orrebp155_distinction_note() to authenticated;
grant execute on function public._orrebp155_mission() to authenticated;
grant execute on function public._orrebp155_philosophy() to authenticated;
grant execute on function public._orrebp155_abos_principle() to authenticated;
grant execute on function public._orrebp155_vision() to authenticated;
grant execute on function public._orrebp155_objectives() to authenticated;
grant execute on function public._orrebp155_organizational_renewal_center() to authenticated;
grant execute on function public._orrebp155_reinvention_intelligence_engine() to authenticated;
grant execute on function public._orrebp155_identity_preservation_framework() to authenticated;
grant execute on function public._orrebp155_executive_renewal_reviews() to authenticated;
grant execute on function public._orrebp155_renewal_companion() to authenticated;
grant execute on function public._orrebp155_innovation_balance_engine() to authenticated;
grant execute on function public._orrebp155_organizational_learning_engine() to authenticated;
grant execute on function public._orrebp155_renewal_memory_engine() to authenticated;
grant execute on function public._orrebp155_companion_limitations() to authenticated;
grant execute on function public._orrebp155_self_love_connection() to authenticated;
grant execute on function public._orrebp155_security_requirements() to authenticated;
grant execute on function public._orrebp155_integration_links() to authenticated;
grant execute on function public._orrebp155_dogfooding() to authenticated;
grant execute on function public._orrebp155_vision_phrases() to authenticated;
grant execute on function public._orrebp155_privacy_note() to authenticated;
grant execute on function public._orrebp155_engagement_summary(uuid) to authenticated;
grant execute on function public._orrebp155_success_criteria(uuid) to authenticated;
grant execute on function public._orrebp155_blueprint_block(uuid) to authenticated;
grant execute on function public.record_executive_renewal_review(text, text, text, jsonb) to authenticated;
grant execute on function public.register_renewal_memory_entry(text, text, text, jsonb) to authenticated;
grant execute on function public.create_renewal_scenario(text, text, text, jsonb) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'organizational-renewal-reinvention-phase155', 'Organizational Renewal & Reinvention (Legacy Phase 155)',
  'Legacy & Future Stewardship Phase 155 — Organizational Renewal & Reinvention extends A.47 + Blueprint Phases 62 & 127 with renewal center, reinvention intelligence, identity preservation, and renewal companion at /app/change-management-engine.',
  'authenticated', 155
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'organizational-renewal-reinvention-phase155' and tenant_id is null
);
