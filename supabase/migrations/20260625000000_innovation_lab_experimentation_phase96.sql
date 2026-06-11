-- Phase 96 — Innovation Lab & Experimentation Engine
-- Principle: Innovation without chaos.

alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success', 'platform_integrity', 'ecosystem', 'community',
    'marketplace_governance', 'partner_certification', 'enterprise_deployment',
    'billing_commercial', 'academy_learning', 'global_localization',
    'innovation_experimentation'
  )
);

-- ---------------------------------------------------------------------------
-- 1. innovation_lab_settings
-- ---------------------------------------------------------------------------
create table if not exists public.innovation_lab_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  lab_enabled boolean not null default true,
  sandbox_enabled boolean not null default true,
  customer_cocreation_enabled boolean not null default true,
  feature_flags_enabled boolean not null default true,
  executive_approval_required boolean not null default true,
  failure_learning_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.innovation_lab_settings enable row level security;
revoke all on public.innovation_lab_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. innovation_ideas + reviews
-- ---------------------------------------------------------------------------
create table if not exists public.innovation_ideas (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  idea_key text not null,
  title text not null,
  problem_statement text not null,
  proposed_solution text not null,
  expected_outcomes text not null,
  target_audience text not null default 'customers',
  source text not null default 'internal' check (
    source in ('internal', 'customer', 'partner', 'community', 'leadership', 'support', 'analytics')
  ),
  status text not null default 'submitted' check (
    status in ('submitted', 'under_review', 'approved', 'in_experiment', 'implemented', 'archived', 'declined')
  ),
  customer_value_score numeric(5, 2) not null default 0,
  strategic_alignment_score numeric(5, 2) not null default 0,
  feasibility_score numeric(5, 2) not null default 0,
  risk_level text not null default 'medium' check (risk_level in ('low', 'medium', 'high')),
  estimated_effort text not null default 'medium' check (estimated_effort in ('low', 'medium', 'high')),
  unique (tenant_id, idea_key)
);

alter table public.innovation_ideas enable row level security;
revoke all on public.innovation_ideas from authenticated, anon;

create table if not exists public.innovation_idea_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  idea_id uuid not null references public.innovation_ideas (id) on delete cascade,
  review_status text not null default 'pending' check (
    review_status in ('pending', 'approved', 'needs_revision', 'declined')
  ),
  reviewer_notes text,
  reviewed_at timestamptz
);

alter table public.innovation_idea_reviews enable row level security;
revoke all on public.innovation_idea_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. experiments + hypotheses
-- ---------------------------------------------------------------------------
create table if not exists public.innovation_experiments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  idea_id uuid references public.innovation_ideas (id) on delete set null,
  experiment_key text not null,
  title text not null,
  description text not null,
  experiment_type text not null default 'feature_pilot' check (
    experiment_type in (
      'feature_pilot', 'workflow', 'ux_testing', 'messaging',
      'process_improvement', 'ai_capability', 'governance_enhancement'
    )
  ),
  status text not null default 'design' check (
    status in ('design', 'active', 'analysis', 'completed', 'cancelled')
  ),
  stage text not null default 'hypothesis' check (
    stage in ('hypothesis', 'design', 'execution', 'analysis', 'recommendation')
  ),
  progress_pct numeric(5, 2) not null default 0 check (progress_pct between 0 and 100),
  participant_count int not null default 0,
  unique (tenant_id, experiment_key)
);

alter table public.innovation_experiments enable row level security;
revoke all on public.innovation_experiments from authenticated, anon;

create table if not exists public.innovation_experiment_hypotheses (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  experiment_id uuid not null references public.innovation_experiments (id) on delete cascade,
  hypothesis text not null,
  success_criteria text not null,
  measurement_plan text not null,
  status text not null default 'active' check (status in ('active', 'validated', 'invalidated'))
);

alter table public.innovation_experiment_hypotheses enable row level security;
revoke all on public.innovation_experiment_hypotheses from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. pilot programs + feedback
-- ---------------------------------------------------------------------------
create table if not exists public.innovation_pilot_programs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  experiment_id uuid references public.innovation_experiments (id) on delete set null,
  program_key text not null,
  title text not null,
  description text not null,
  status text not null default 'recruiting' check (
    status in ('recruiting', 'active', 'completed', 'cancelled')
  ),
  max_participants int not null default 10,
  current_participants int not null default 0,
  success_criteria text not null,
  unique (tenant_id, program_key)
);

alter table public.innovation_pilot_programs enable row level security;
revoke all on public.innovation_pilot_programs from authenticated, anon;

create table if not exists public.innovation_pilot_feedback (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  pilot_id uuid not null references public.innovation_pilot_programs (id) on delete cascade,
  feedback_summary text not null,
  satisfaction_score numeric(5, 2),
  adoption_potential numeric(5, 2),
  created_at timestamptz not null default now()
);

alter table public.innovation_pilot_feedback enable row level security;
revoke all on public.innovation_pilot_feedback from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. feature flags, scorecards, lessons, briefings
-- ---------------------------------------------------------------------------
create table if not exists public.innovation_feature_flags (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  flag_key text not null,
  title text not null,
  description text not null,
  status text not null default 'draft' check (
    status in ('draft', 'sandbox', 'pilot', 'rollout', 'disabled')
  ),
  target_segment text not null default 'pilot_participants',
  exposure_pct numeric(5, 2) not null default 0 check (exposure_pct between 0 and 100),
  unique (tenant_id, flag_key)
);

alter table public.innovation_feature_flags enable row level security;
revoke all on public.innovation_feature_flags from authenticated, anon;

create table if not exists public.innovation_scorecards (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  period_label text not null,
  experiment_completion_pct numeric(5, 2) not null default 0,
  customer_satisfaction_impact numeric(5, 2) not null default 0,
  adoption_potential_pct numeric(5, 2) not null default 0,
  business_value_score numeric(5, 2) not null default 0,
  return_on_innovation numeric(5, 2) not null default 0,
  calculated_at timestamptz not null default now()
);

alter table public.innovation_scorecards enable row level security;
revoke all on public.innovation_scorecards from authenticated, anon;

create table if not exists public.innovation_lessons_learned (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  experiment_id uuid references public.innovation_experiments (id) on delete set null,
  title text not null,
  summary text not null,
  outcome_type text not null default 'learning' check (
    outcome_type in ('success', 'failure', 'learning', 'pivot')
  ),
  created_at timestamptz not null default now()
);

alter table public.innovation_lessons_learned enable row level security;
revoke all on public.innovation_lessons_learned from authenticated, anon;

create table if not exists public.innovation_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  summary text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.innovation_briefings enable row level security;
revoke all on public.innovation_briefings from authenticated, anon;

create table if not exists public.innovation_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  trigger_source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.innovation_audit_log enable row level security;
revoke all on public.innovation_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Helpers (_ile_)
-- ---------------------------------------------------------------------------
create or replace function public._ile_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._ile_log_audit(
  p_tenant_id uuid, p_event_type text, p_summary text default null,
  p_trigger_source text default null, p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.innovation_audit_log (tenant_id, event_type, summary, trigger_source, metadata)
  values (p_tenant_id, p_event_type, p_summary, p_trigger_source, p_metadata)
  returning id into v_id;
  perform public._tacc_log_audit(p_tenant_id, 'user', 'innovation_experimentation_' || p_event_type, 'innovation_experimentation', 'logged', null, p_metadata);
  return v_id;
end; $$;

create or replace function public._ile_ensure_settings(p_tenant_id uuid)
returns public.innovation_lab_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.innovation_lab_settings;
begin
  insert into public.innovation_lab_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.innovation_lab_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._ile_seed_ideas(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.innovation_ideas (
    tenant_id, idea_key, title, problem_statement, proposed_solution, expected_outcomes,
    target_audience, source, status, customer_value_score, strategic_alignment_score,
    feasibility_score, risk_level, estimated_effort
  )
  select p_tenant_id, v.key, v.title, v.problem, v.solution, v.outcomes, v.audience, v.source,
    v.status, v.cv, v.sa, v.feas, v.risk, v.effort
  from (values
    ('adaptive_briefing', 'Adaptive Briefing Personalization', 'Briefings feel generic for some roles.',
      'Role-aware briefing sections with configurable depth.', 'Higher engagement and faster decision-making.',
      'executives', 'analytics', 'approved', 85.0, 90.0, 75.0, 'low', 'medium'),
    ('workflow_suggestions', 'Proactive Workflow Suggestions', 'Users miss automation opportunities.',
      'Surface workflow experiments based on usage patterns.', 'Increased automation adoption.',
      'operations_teams', 'support', 'under_review', 78.0, 82.0, 70.0, 'medium', 'medium'),
    ('partner_innovation', 'Partner Innovation Workshops', 'Partners need structured co-creation channels.',
      'Quarterly innovation workshops with certified partners.', 'Accelerated ecosystem innovation.',
      'partners', 'partner', 'submitted', 72.0, 88.0, 80.0, 'low', 'low'),
    ('ai_governance_pilot', 'AI Governance Enhancement Pilot', 'Governance controls need usability testing.',
      'Sandbox pilot for simplified governance workflows.', 'Reduced friction without compromising oversight.',
      'governance_officers', 'leadership', 'in_experiment', 80.0, 95.0, 65.0, 'medium', 'high')
  ) as v(key, title, problem, solution, outcomes, audience, source, status, cv, sa, feas, risk, effort)
  where not exists (select 1 from public.innovation_ideas i where i.tenant_id = p_tenant_id and i.idea_key = v.key);
end; $$;

create or replace function public._ile_seed_experiments(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.innovation_experiments (
    tenant_id, idea_id, experiment_key, title, description, experiment_type, status, stage, progress_pct, participant_count
  )
  select p_tenant_id, i.id, v.key, v.title, v.desc, v.type, v.status, v.stage, v.prog, v.participants
  from public.innovation_ideas i
  cross join lateral (values
    ('gov_pilot_exp', 'Governance Workflow Simplification', 'Controlled pilot of streamlined governance UX.', 'governance_enhancement', 'active', 'execution', 55.0, 8)
  ) as v(key, title, desc, type, status, stage, prog, participants)
  where i.tenant_id = p_tenant_id and i.idea_key = 'ai_governance_pilot'
  on conflict (tenant_id, experiment_key) do nothing;

  insert into public.innovation_experiments (
    tenant_id, experiment_key, title, description, experiment_type, status, stage, progress_pct, participant_count
  )
  select p_tenant_id, v.key, v.title, v.desc, v.type, v.status, v.stage, v.prog, v.participants
  from (values
    ('ux_messaging', 'Assistant Messaging Tone Test', 'A/B test of communication styles in Assistant.', 'messaging', 'analysis', 'analysis', 90.0, 25),
    ('feature_flags_v2', 'Feature Flag Rollout Framework', 'Evaluate controlled rollout capabilities.', 'feature_pilot', 'design', 'design', 15.0, 0),
    ('workflow_auto', 'Adaptive Automation Discovery', 'Experiment with proactive automation suggestions.', 'workflow', 'completed', 'recommendation', 100.0, 12)
  ) as v(key, title, desc, type, status, stage, prog, participants)
  where not exists (select 1 from public.innovation_experiments e where e.tenant_id = p_tenant_id and e.experiment_key = v.key);
end; $$;

create or replace function public._ile_seed_pilots(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.innovation_pilot_programs (
    tenant_id, experiment_id, program_key, title, description, status, max_participants, current_participants, success_criteria
  )
  select p_tenant_id, e.id, 'gov_pilot_beta', 'Governance Beta Program', 'Limited customer beta for governance UX improvements.',
    'active', 10, 8, '80% satisfaction and zero compliance incidents.'
  from public.innovation_experiments e
  where e.tenant_id = p_tenant_id and e.experiment_key = 'gov_pilot_exp'
  on conflict (tenant_id, program_key) do nothing;

  insert into public.innovation_pilot_programs (
    tenant_id, program_key, title, description, status, max_participants, current_participants, success_criteria
  )
  select p_tenant_id, v.key, v.title, v.desc, v.status, v.max, v.current, v.criteria
  from (values
    ('advisory_board', 'Customer Advisory Board', 'Structured feedback from selected enterprise customers.', 'active', 15, 12, 'Quarterly innovation input with measurable themes.'),
    ('partner_pilot', 'Partner Pilot Facilitation', 'Certified partners facilitate market feedback pilots.', 'recruiting', 5, 2, 'Two completed partner-led pilots per quarter.')
  ) as v(key, title, desc, status, max, current, criteria)
  where not exists (select 1 from public.innovation_pilot_programs p where p.tenant_id = p_tenant_id and p.program_key = v.key);
end; $$;

create or replace function public._ile_seed_feature_flags(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.innovation_feature_flags (tenant_id, flag_key, title, description, status, target_segment, exposure_pct)
  select p_tenant_id, v.key, v.title, v.desc, v.status, v.segment, v.exposure
  from (values
    ('adaptive_briefing_v1', 'Adaptive Briefing v1', 'Role-aware briefing sections.', 'pilot', 'pilot_participants', 10.0),
    ('gov_workflow_v2', 'Governance Workflow v2', 'Simplified governance UX in sandbox.', 'sandbox', 'sandbox_users', 5.0),
    ('proactive_automation', 'Proactive Automation Suggestions', 'Surface automation opportunities.', 'rollout', 'early_adopters', 25.0)
  ) as v(key, title, desc, status, segment, exposure)
  where not exists (select 1 from public.innovation_feature_flags f where f.tenant_id = p_tenant_id and f.flag_key = v.key);
end; $$;

create or replace function public._ile_seed_lessons(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.innovation_lessons_learned (tenant_id, experiment_id, title, summary, outcome_type)
  select p_tenant_id, e.id, 'Automation discovery requires consent', 'Users prefer opt-in suggestions over automatic changes.', 'learning'
  from public.innovation_experiments e
  where e.tenant_id = p_tenant_id and e.experiment_key = 'workflow_auto'
    and not exists (select 1 from public.innovation_lessons_learned l where l.tenant_id = p_tenant_id limit 1);
end; $$;

create or replace function public._ile_refresh_scorecard(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_total int; v_completed int; v_active int; v_ideas int;
  v_innovation_score numeric;
begin
  select count(*), count(*) filter (where status = 'completed'), count(*) filter (where status = 'active')
  into v_total, v_completed, v_active from public.innovation_experiments where tenant_id = p_tenant_id;

  select count(*) into v_ideas from public.innovation_ideas where tenant_id = p_tenant_id;

  v_innovation_score := least(100, round(
    coalesce(100.0 * v_completed / nullif(v_total, 0), 0) * 0.4 +
    v_ideas * 5 +
    v_active * 8, 1
  ));

  delete from public.innovation_scorecards where tenant_id = p_tenant_id;
  insert into public.innovation_scorecards (
    tenant_id, period_label, experiment_completion_pct, customer_satisfaction_impact,
    adoption_potential_pct, business_value_score, return_on_innovation
  )
  values (
    p_tenant_id, 'Current Quarter',
    case when v_total = 0 then 0 else round(100.0 * v_completed / v_total, 1) end,
    82.0, 74.0, v_innovation_score, round(v_innovation_score * 0.85, 1)
  );

  return jsonb_build_object(
    'innovation_score', v_innovation_score,
    'experiment_completion_pct', case when v_total = 0 then 0 else round(100.0 * v_completed / v_total, 1) end,
    'active_experiments', v_active,
    'ideas_in_pipeline', v_ideas,
    'return_on_innovation', round(v_innovation_score * 0.85, 1)
  );
end; $$;

create or replace function public._ile_trust_explanation(p_tenant_id uuid, p_score numeric)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public.generate_decision_explanation(
    'ile-score-' || p_tenant_id::text,
    'innovation_experimentation',
    'innovation_experimentation',
    'Innovation Lab score: ' || p_score || '/100',
    'Progress requires experimentation. Experimentation requires structure.',
    jsonb_build_array(
      jsonb_build_object('source', 'experiment_outcomes'),
      jsonb_build_object('source', 'pilot_feedback'),
      jsonb_build_object('source', 'innovation_scorecard')
    ),
    jsonb_build_array('sandbox_isolation', 'governance_controls', 'audit_logged'),
    'medium', '[]'::jsonb, '[]'::jsonb
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Action RPCs
-- ---------------------------------------------------------------------------
create or replace function public.advance_innovation_experiment(p_experiment_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_new_stage text; v_new_status text; v_new_prog numeric; v_current_status text;
begin
  v_tenant_id := public._ile_require_tenant();
  select case stage
    when 'hypothesis' then 'design'
    when 'design' then 'execution'
    when 'execution' then 'analysis'
    when 'analysis' then 'recommendation'
    else stage
  end, status, least(100, progress_pct + 20)
  into v_new_stage, v_current_status, v_new_prog
  from public.innovation_experiments where id = p_experiment_id and tenant_id = v_tenant_id;

  if v_new_stage is null then return jsonb_build_object('error', 'Experiment not found'); end if;

  v_new_status := case v_new_stage
    when 'recommendation' then 'completed'
    when 'execution' then 'active'
    else v_current_status
  end;

  update public.innovation_experiments
  set stage = v_new_stage, status = v_new_status, progress_pct = v_new_prog
  where id = p_experiment_id and tenant_id = v_tenant_id;

  perform public._ile_log_audit(v_tenant_id, 'experiment_advanced', 'Experiment advanced to ' || v_new_stage, 'experimentation',
    jsonb_build_object('experiment_id', p_experiment_id, 'stage', v_new_stage));
  return jsonb_build_object('status', v_new_stage);
end; $$;

create or replace function public.approve_innovation_idea(p_idea_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._ile_require_tenant();
  update public.innovation_ideas set status = 'approved'
  where id = p_idea_id and tenant_id = v_tenant_id and status in ('submitted', 'under_review');
  insert into public.innovation_idea_reviews (tenant_id, idea_id, review_status, reviewer_notes, reviewed_at)
  values (v_tenant_id, p_idea_id, 'approved', 'Approved for experimentation pipeline.', now());
  perform public._ile_log_audit(v_tenant_id, 'idea_approved', 'Innovation idea approved', 'idea_management',
    jsonb_build_object('idea_id', p_idea_id));
  return jsonb_build_object('status', 'approved');
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.generate_innovation_lab_briefing()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_metrics jsonb;
  v_id uuid;
  v_summary text;
begin
  v_tenant_id := public._ile_require_tenant();
  perform public._ile_ensure_settings(v_tenant_id);
  perform public._ile_seed_ideas(v_tenant_id);
  perform public._ile_seed_experiments(v_tenant_id);
  v_metrics := public._ile_refresh_scorecard(v_tenant_id);

  v_summary := 'Innovation Lab briefing: score ' || (v_metrics->>'innovation_score') || '/100, '
    || (v_metrics->>'active_experiments') || ' active experiments, '
    || (v_metrics->>'ideas_in_pipeline') || ' ideas in pipeline.';

  insert into public.innovation_briefings (tenant_id, summary, content)
  values (v_tenant_id, v_summary, v_metrics)
  returning id into v_id;

  perform public._ile_log_audit(v_tenant_id, 'briefing_generated', v_summary, 'executive_dashboard', v_metrics);
  return jsonb_build_object('briefing_id', v_id, 'summary', v_summary);
end; $$;

create or replace function public.get_innovation_lab_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._ile_ensure_settings(v_tenant_id);
  perform public._ile_seed_ideas(v_tenant_id);
  v_metrics := public._ile_refresh_scorecard(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'innovation_score', v_metrics->'innovation_score',
    'active_experiments', v_metrics->'active_experiments',
    'philosophy', 'Innovation without chaos.',
    'human_oversight_required', true
  );
end; $$;

create or replace function public.get_innovation_lab_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.innovation_lab_settings;
  v_metrics jsonb;
begin
  v_tenant_id := public._ile_require_tenant();
  v_settings := public._ile_ensure_settings(v_tenant_id);
  perform public._ile_seed_ideas(v_tenant_id);
  perform public._ile_seed_experiments(v_tenant_id);
  perform public._ile_seed_pilots(v_tenant_id);
  perform public._ile_seed_feature_flags(v_tenant_id);
  perform public._ile_seed_lessons(v_tenant_id);
  v_metrics := public._ile_refresh_scorecard(v_tenant_id);
  perform public._ile_trust_explanation(v_tenant_id, (v_metrics->>'innovation_score')::numeric);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'philosophy', 'Innovation without chaos.',
    'safety_note', 'Responsible innovation balances creativity with accountability and operational discipline.',
    'lab_enabled', v_settings.lab_enabled,
    'sandbox_enabled', v_settings.sandbox_enabled,
    'customer_cocreation_enabled', v_settings.customer_cocreation_enabled,
    'feature_flags_enabled', v_settings.feature_flags_enabled,
    'executive_approval_required', v_settings.executive_approval_required,
    'failure_learning_enabled', v_settings.failure_learning_enabled,
    'innovation_score', v_metrics->'innovation_score',
    'experiment_completion_pct', v_metrics->'experiment_completion_pct',
    'active_experiments', v_metrics->'active_experiments',
    'ideas_in_pipeline', v_metrics->'ideas_in_pipeline',
    'return_on_innovation', v_metrics->'return_on_innovation',
    'lab_structure', jsonb_build_array(
      jsonb_build_object('area', 'idea_management', 'label', 'Idea Management'),
      jsonb_build_object('area', 'experimentation', 'label', 'Experimentation Management'),
      jsonb_build_object('area', 'pilots', 'label', 'Pilot Programs'),
      jsonb_build_object('area', 'validation', 'label', 'Validation Frameworks'),
      jsonb_build_object('area', 'governance', 'label', 'Innovation Governance')
    ),
    'experiment_stages', jsonb_build_array(
      'Hypothesis creation', 'Experiment design', 'Participant selection',
      'Measurement planning', 'Controlled execution', 'Result analysis', 'Recommendation generation'
    ),
    'sandbox_capabilities', jsonb_build_array(
      'Isolated testing', 'Controlled access', 'Feature toggles', 'Data separation', 'Rollback capabilities'
    ),
    'ideas', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'idea_key', i.idea_key, 'title', i.title,
        'problem_statement', i.problem_statement, 'proposed_solution', i.proposed_solution,
        'expected_outcomes', i.expected_outcomes, 'target_audience', i.target_audience,
        'source', i.source, 'status', i.status,
        'customer_value_score', i.customer_value_score,
        'strategic_alignment_score', i.strategic_alignment_score,
        'feasibility_score', i.feasibility_score,
        'risk_level', i.risk_level, 'estimated_effort', i.estimated_effort
      ) order by i.customer_value_score desc)
      from public.innovation_ideas i where i.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'experiments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id, 'experiment_key', e.experiment_key, 'title', e.title,
        'description', e.description, 'experiment_type', e.experiment_type,
        'status', e.status, 'stage', e.stage, 'progress_pct', e.progress_pct,
        'participant_count', e.participant_count
      ) order by e.progress_pct desc)
      from public.innovation_experiments e where e.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'pilot_programs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'program_key', p.program_key, 'title', p.title,
        'description', p.description, 'status', p.status,
        'max_participants', p.max_participants, 'current_participants', p.current_participants,
        'success_criteria', p.success_criteria
      ))
      from public.innovation_pilot_programs p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'feature_flags', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', f.id, 'flag_key', f.flag_key, 'title', f.title,
        'description', f.description, 'status', f.status,
        'target_segment', f.target_segment, 'exposure_pct', f.exposure_pct
      ))
      from public.innovation_feature_flags f where f.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'scorecard', coalesce((
      select jsonb_build_object(
        'period_label', s.period_label,
        'experiment_completion_pct', s.experiment_completion_pct,
        'customer_satisfaction_impact', s.customer_satisfaction_impact,
        'adoption_potential_pct', s.adoption_potential_pct,
        'business_value_score', s.business_value_score,
        'return_on_innovation', s.return_on_innovation
      )
      from public.innovation_scorecards s where s.tenant_id = v_tenant_id limit 1
    ), '{}'::jsonb),
    'lessons_learned', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'title', l.title, 'summary', l.summary, 'outcome_type', l.outcome_type
      ))
      from public.innovation_lessons_learned l where l.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'governance_controls', jsonb_build_array(
      'Executive approvals', 'Risk assessments', 'Documentation standards',
      'Compliance reviews', 'Ethical evaluations'
    ),
    'briefings', coalesce((
      select jsonb_agg(jsonb_build_object('id', b.id, 'summary', b.summary, 'created_at', b.created_at)
        order by b.created_at desc)
      from public.innovation_briefings b where b.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integrations', jsonb_build_object(
      'governance', 'Approval workflows and risk assessments',
      'marketplace_governance', 'Quality gates for marketplace innovations',
      'academy', 'Innovation methodology training',
      'partners', 'Partner innovation workshops and pilots',
      'simulation_lab', 'Distinct from Decision Lab at /app/simulations'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'innovation-experimentation', 'Innovation & Experimentation', 'Test and validate new ideas responsibly before broad release.', 'authenticated', 40
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'innovation-experimentation' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 10. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_innovation_lab_card() to authenticated;
grant execute on function public.get_innovation_lab_dashboard() to authenticated;
grant execute on function public.generate_innovation_lab_briefing() to authenticated;
grant execute on function public.advance_innovation_experiment(uuid) to authenticated;
grant execute on function public.approve_innovation_idea(uuid) to authenticated;
