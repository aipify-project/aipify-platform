-- Phase 86 — Customer Lifecycle & Success Orchestration Engine
-- Core principle: Customer success comes before expansion.

-- Extend Trust Engine decision types
alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success'
  )
);

-- ---------------------------------------------------------------------------
-- 1. customer_profiles (tenant lifecycle profile)
-- ---------------------------------------------------------------------------
create table if not exists public.customer_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  lifecycle_stage text not null default 'onboarding' check (
    lifecycle_stage in (
      'discovery', 'onboarding', 'activation', 'adoption',
      'expansion', 'optimization', 'advocacy'
    )
  ),
  success_score numeric(5, 2) not null default 0 check (success_score between 0 and 100),
  health_band text not null default 'support_opportunity',
  onboarding_completion numeric(5, 2) not null default 0,
  adoption_strength numeric(5, 2) not null default 0,
  value_realization numeric(5, 2) not null default 0,
  learning_participation numeric(5, 2) not null default 0,
  expansion_readiness numeric(5, 2) not null default 0,
  retention_indicators numeric(5, 2) not null default 0,
  quick_wins_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.customer_profiles enable row level security;
revoke all on public.customer_profiles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. customer_milestones
-- ---------------------------------------------------------------------------
create table if not exists public.customer_milestones (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  milestone_type text not null check (
    milestone_type in (
      'first_faq', 'first_briefing', 'first_automation', 'first_value_outcome',
      'onboarding_complete', 'knowledge_gap_resolved', 'support_improvement',
      'learning_path_started', 'pack_adopted', 'expansion_ready', 'advocacy'
    )
  ),
  description text not null,
  is_quick_win boolean not null default false,
  achieved_at timestamptz not null default now()
);

create index if not exists customer_milestones_tenant_idx
  on public.customer_milestones (tenant_id, achieved_at desc);

alter table public.customer_milestones enable row level security;
revoke all on public.customer_milestones from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. customer_health_scores (history)
-- ---------------------------------------------------------------------------
create table if not exists public.customer_health_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  score numeric(5, 2) not null check (score between 0 and 100),
  health_band text not null,
  score_components jsonb not null default '{}'::jsonb,
  calculated_at timestamptz not null default now()
);

create index if not exists customer_health_scores_tenant_idx
  on public.customer_health_scores (tenant_id, calculated_at desc);

alter table public.customer_health_scores enable row level security;
revoke all on public.customer_health_scores from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. customer_recommendations
-- ---------------------------------------------------------------------------
create table if not exists public.customer_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation text not null,
  category text not null default 'general' check (
    category in (
      'quick_win', 'onboarding', 'learning', 'expansion', 'optimization',
      'retention', 'marketplace', 'general'
    )
  ),
  rationale text,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'pending' check (
    status in ('pending', 'accepted', 'dismissed', 'completed')
  ),
  created_at timestamptz not null default now()
);

create index if not exists customer_recommendations_tenant_idx
  on public.customer_recommendations (tenant_id, status, created_at desc);

alter table public.customer_recommendations enable row level security;
revoke all on public.customer_recommendations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. customer_playbooks
-- ---------------------------------------------------------------------------
create table if not exists public.customer_playbooks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  playbook_name text not null,
  audience text not null check (
    audience in (
      'support_team', 'executive_team', 'knowledge_team',
      'small_business', 'enterprise', 'general'
    )
  ),
  content jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (tenant_id, playbook_name)
);

alter table public.customer_playbooks enable row level security;
revoke all on public.customer_playbooks from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. customer_success_briefings
-- ---------------------------------------------------------------------------
create table if not exists public.customer_success_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  summary text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.customer_success_briefings enable row level security;
revoke all on public.customer_success_briefings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. customer_success_settings
-- ---------------------------------------------------------------------------
create table if not exists public.customer_success_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  orchestration_enabled boolean not null default true,
  quick_wins_enabled boolean not null default true,
  expansion_recommendations_enabled boolean not null default true,
  desktop_celebrations_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.customer_success_settings enable row level security;
revoke all on public.customer_success_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. customer_success_audit_log
-- ---------------------------------------------------------------------------
create table if not exists public.customer_success_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  actor_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.customer_success_audit_log enable row level security;
revoke all on public.customer_success_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. Helpers (_cso_)
-- ---------------------------------------------------------------------------
create or replace function public._cso_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._cso_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._cso_log_audit(
  p_tenant_id uuid, p_event_type text,
  p_summary text default null, p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.customer_success_audit_log (tenant_id, event_type, summary, metadata, actor_user_id)
  values (p_tenant_id, p_event_type, p_summary, coalesce(p_metadata, '{}'::jsonb), public._cso_auth_user_id())
  returning id into v_id;
  perform public._tacc_log_audit(p_tenant_id, 'user', 'customer_success_' || p_event_type, 'customer_success', 'logged', null, p_metadata);
  return v_id;
end; $$;

create or replace function public._cso_ensure_settings(p_tenant_id uuid)
returns public.customer_success_settings language plpgsql security definer set search_path = public as $$
declare v_row public.customer_success_settings;
begin
  insert into public.customer_success_settings (tenant_id) values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_row from public.customer_success_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._cso_ensure_profile(p_tenant_id uuid)
returns public.customer_profiles language plpgsql security definer set search_path = public as $$
declare v_row public.customer_profiles;
begin
  insert into public.customer_profiles (tenant_id) values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_row from public.customer_profiles where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._cso_health_band(p_score numeric)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'thriving'
    when p_score >= 75 then 'healthy'
    when p_score >= 60 then 'support_opportunity'
    when p_score >= 40 then 'at_risk'
    else 'critical'
  end;
$$;

create or replace function public._cso_health_band_label(p_band text)
returns text language sql immutable as $$
  select case p_band
    when 'thriving' then 'Thriving Customer'
    when 'healthy' then 'Healthy Customer'
    when 'support_opportunity' then 'Support Opportunity'
    when 'at_risk' then 'At-Risk Customer'
    when 'critical' then 'Critical Intervention Recommended'
    else p_band
  end;
$$;

create or replace function public._cso_stage_label(p_stage text)
returns text language sql immutable as $$
  select case p_stage
    when 'discovery' then 'Discovery'
    when 'onboarding' then 'Onboarding'
    when 'activation' then 'Activation'
    when 'adoption' then 'Adoption'
    when 'expansion' then 'Expansion'
    when 'optimization' then 'Optimization'
    when 'advocacy' then 'Advocacy'
    else p_stage
  end;
$$;

create or replace function public._cso_record_milestone(
  p_tenant_id uuid,
  p_milestone_type text,
  p_description text,
  p_is_quick_win boolean default false
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if exists (
    select 1 from public.customer_milestones
    where tenant_id = p_tenant_id and milestone_type = p_milestone_type
  ) then return null; end if;

  insert into public.customer_milestones (tenant_id, milestone_type, description, is_quick_win)
  values (p_tenant_id, p_milestone_type, p_description, p_is_quick_win)
  returning id into v_id;

  if p_is_quick_win then
    update public.customer_profiles
    set quick_wins_count = quick_wins_count + 1, updated_at = now()
    where tenant_id = p_tenant_id;
  end if;

  perform public._cso_log_audit(p_tenant_id, 'milestone_achieved', p_description,
    jsonb_build_object('milestone_type', p_milestone_type, 'milestone_id', v_id, 'quick_win', p_is_quick_win));
  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Seed playbooks
-- ---------------------------------------------------------------------------
create or replace function public._cso_seed_playbooks(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.customer_playbooks (tenant_id, playbook_name, audience, content)
  select p_tenant_id, v.name, v.audience, v.content
  from (values
    ('Support Team Playbook', 'support_team', '{"focus":"First FAQ, support drafts, knowledge gaps","steps":["Publish first FAQ","Review support drafts","Resolve top knowledge gap"]}'::jsonb),
    ('Executive Team Playbook', 'executive_team', '{"focus":"Briefings, strategy, ROI reviews","steps":["Generate first executive briefing","Review strategic scorecard","Validate outcomes quarterly"]}'::jsonb),
    ('Knowledge Team Playbook', 'knowledge_team', '{"focus":"Knowledge Center, gaps, documentation","steps":["Complete KC orientation","Close top 3 knowledge gaps","Assign article ownership"]}'::jsonb),
    ('Small Business Playbook', 'small_business', '{"focus":"Quick wins and essential capabilities","steps":["Complete onboarding","Achieve first quick win","Enable Desktop Companion"]}'::jsonb),
    ('Enterprise Playbook', 'enterprise', '{"focus":"Governance, adoption at scale, expansion","steps":["Configure governance policies","Roll out to departments","Review expansion readiness"]}'::jsonb)
  ) as v(name, audience, content)
  where not exists (
    select 1 from public.customer_playbooks cp
    where cp.tenant_id = p_tenant_id and cp.playbook_name = v.name
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Quick wins detection
-- ---------------------------------------------------------------------------
create or replace function public._cso_detect_quick_wins(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_settings public.customer_success_settings;
begin
  v_settings := public._cso_ensure_settings(p_tenant_id);
  if not v_settings.quick_wins_enabled then return; end if;

  if exists (
    select 1 from public.value_events
    where tenant_id = p_tenant_id and event_type in ('faq_deflected', 'faq_resolved')
    limit 1
  ) then
    perform public._cso_record_milestone(
      p_tenant_id, 'first_faq',
      'First FAQ contribution or deflection achieved — early knowledge win.',
      true
    );
  end if;

  if exists (
    select 1 from public.value_events
    where tenant_id = p_tenant_id and event_type = 'briefing_opened'
    limit 1
  ) then
    perform public._cso_record_milestone(
      p_tenant_id, 'first_briefing',
      'First executive briefing generated — early visibility win.',
      true
    );
  end if;

  if exists (
    select 1 from public.value_events
    where tenant_id = p_tenant_id and event_type = 'automation_executed'
    limit 1
  ) then
    perform public._cso_record_milestone(
      p_tenant_id, 'first_automation',
      'First automation executed — early efficiency win.',
      true
    );
  end if;

  if exists (
    select 1 from public.value_events
    where tenant_id = p_tenant_id and estimated_time_saved_minutes > 0
    limit 1
  ) then
    perform public._cso_record_milestone(
      p_tenant_id, 'first_value_outcome',
      'First measurable time-saving outcome recorded.',
      true
    );
  end if;

  if exists (
    select 1 from public.value_events
    where tenant_id = p_tenant_id and event_type = 'knowledge_gap_resolved'
    limit 1
  ) then
    perform public._cso_record_milestone(
      p_tenant_id, 'knowledge_gap_resolved',
      'First knowledge gap resolved — support improvement win.',
      true
    );
  end if;

  if exists (
    select 1 from public.hs_onboarding_progress
    where tenant_id = p_tenant_id and current_step >= 3
    limit 1
  ) then
    perform public._cso_record_milestone(
      p_tenant_id, 'onboarding_complete',
      'Onboarding milestones completed successfully.',
      false
    );
  end if;
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Calculate Customer Success Score
-- ---------------------------------------------------------------------------
create or replace function public._cso_calculate_success_score(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_onboarding numeric := 50;
  v_adoption numeric := 50;
  v_value numeric := 50;
  v_learning numeric := 50;
  v_expansion numeric := 30;
  v_retention numeric := 50;
  v_overall numeric;
  v_band text;
  v_stage text;
  v_quick_wins int;
  v_hs_adoption numeric;
  v_outcomes_score numeric;
  v_milestones int;
  v_health_id uuid;
begin
  perform public._cso_detect_quick_wins(p_tenant_id);

  select coalesce(avg(adoption_score), 50) into v_hs_adoption
  from public.user_adoption_scores where tenant_id = p_tenant_id
  and created_at > now() - interval '30 days';

  select coalesce(validated_success_score, 50) into v_outcomes_score
  from public.success_scorecards where tenant_id = p_tenant_id
  order by created_at desc limit 1;

  select count(*) into v_milestones from public.customer_milestones where tenant_id = p_tenant_id;
  select quick_wins_count into v_quick_wins from public.customer_profiles where tenant_id = p_tenant_id;

  select case when count(*) > 0
    then (count(*) filter (where current_step >= 2))::numeric / count(*) * 100
    else 40 end
  into v_onboarding
  from public.hs_onboarding_progress where tenant_id = p_tenant_id;

  v_adoption := coalesce(v_hs_adoption, 50);
  v_value := coalesce(v_outcomes_score, 50);
  v_learning := least(100, 40 + v_milestones * 8);

  if v_adoption >= 75 and v_value >= 60 then v_expansion := 70;
  elsif v_adoption >= 60 then v_expansion := 50;
  else v_expansion := 30; end if;

  v_retention := case
    when v_adoption >= 70 and v_value >= 55 then 80
    when v_adoption >= 50 then 60
    else 40
  end;

  v_overall := round((
    v_onboarding * 0.15 +
    v_adoption * 0.25 +
    v_value * 0.20 +
    v_learning * 0.15 +
    v_expansion * 0.10 +
    v_retention * 0.15
  )::numeric, 2);

  v_band := public._cso_health_band(v_overall);

  v_stage := case
    when v_milestones = 0 then 'discovery'
    when v_onboarding < 60 then 'onboarding'
    when v_quick_wins < 2 then 'activation'
    when v_adoption < 65 then 'adoption'
    when v_expansion >= 65 then 'expansion'
    when v_value >= 70 then 'optimization'
    when v_overall >= 85 then 'advocacy'
    else 'adoption'
  end;

  update public.customer_profiles set
    success_score = v_overall,
    health_band = v_band,
    lifecycle_stage = v_stage,
    onboarding_completion = v_onboarding,
    adoption_strength = v_adoption,
    value_realization = v_value,
    learning_participation = v_learning,
    expansion_readiness = v_expansion,
    retention_indicators = v_retention,
    updated_at = now()
  where tenant_id = p_tenant_id;

  insert into public.customer_health_scores (tenant_id, score, health_band, score_components)
  values (p_tenant_id, v_overall, v_band, jsonb_build_object(
    'onboarding_completion', v_onboarding,
    'adoption_strength', v_adoption,
    'value_realization', v_value,
    'learning_participation', v_learning,
    'expansion_readiness', v_expansion,
    'retention_indicators', v_retention
  )) returning id into v_health_id;

  perform public._cso_log_audit(p_tenant_id, 'score_recalculated',
    'Customer Success Score: ' || v_overall,
    jsonb_build_object('score', v_overall, 'band', v_band, 'stage', v_stage));

  return jsonb_build_object(
    'success_score', v_overall,
    'health_band', v_band,
    'health_band_label', public._cso_health_band_label(v_band),
    'lifecycle_stage', v_stage,
    'lifecycle_stage_label', public._cso_stage_label(v_stage),
    'components', jsonb_build_object(
      'onboarding_completion', v_onboarding,
      'adoption_strength', v_adoption,
      'value_realization', v_value,
      'learning_participation', v_learning,
      'expansion_readiness', v_expansion,
      'retention_indicators', v_retention
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 13. Generate recommendations
-- ---------------------------------------------------------------------------
create or replace function public._cso_seed_recommendations(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_profile public.customer_profiles;
  v_settings public.customer_success_settings;
begin
  v_settings := public._cso_ensure_settings(p_tenant_id);
  if not v_settings.orchestration_enabled then return; end if;
  select * into v_profile from public.customer_profiles where tenant_id = p_tenant_id;

  if v_profile.lifecycle_stage in ('discovery', 'onboarding') then
    insert into public.customer_recommendations (tenant_id, recommendation, category, rationale, priority)
    select p_tenant_id, 'Complete onboarding checklist for early confidence', 'onboarding',
      'Onboarding completion drives long-term success.', 'high'
    where not exists (
      select 1 from public.customer_recommendations
      where tenant_id = p_tenant_id and category = 'onboarding' and status = 'pending'
    );
  end if;

  if v_profile.quick_wins_count < 2 then
    insert into public.customer_recommendations (tenant_id, recommendation, category, rationale, priority)
    select p_tenant_id, 'Publish your first FAQ to achieve a quick win', 'quick_win',
      'Early wins build momentum and demonstrate value.', 'high'
    where not exists (
      select 1 from public.customer_recommendations
      where tenant_id = p_tenant_id and category = 'quick_win' and status = 'pending'
    );
  end if;

  if v_profile.adoption_strength < 60 then
    insert into public.customer_recommendations (tenant_id, recommendation, category, rationale, priority)
    select p_tenant_id, 'Explore Human Success journeys to strengthen adoption', 'learning',
      'Learning paths accelerate confidence and retention.', 'medium'
    where not exists (
      select 1 from public.customer_recommendations
      where tenant_id = p_tenant_id and category = 'learning' and status = 'pending'
    );
  end if;

  if v_settings.expansion_recommendations_enabled and v_profile.expansion_readiness >= 65 then
    insert into public.customer_recommendations (tenant_id, recommendation, category, rationale, priority)
    select p_tenant_id, 'Review Marketplace packs that complement your current setup', 'expansion',
      'Expansion follows value — recommended only when readiness is high.', 'low'
    where not exists (
      select 1 from public.customer_recommendations
      where tenant_id = p_tenant_id and category = 'expansion' and status = 'pending'
    );
  end if;

  if v_profile.health_band in ('at_risk', 'critical') then
    insert into public.customer_recommendations (tenant_id, recommendation, category, rationale, priority)
    select p_tenant_id, 'Schedule a success review to address adoption and value gaps', 'retention',
      'Proactive support prevents churn without pressure tactics.', 'high'
    where not exists (
      select 1 from public.customer_recommendations
      where tenant_id = p_tenant_id and category = 'retention' and status = 'pending'
    );
  end if;

  if v_profile.value_realization < 55 then
    insert into public.customer_recommendations (tenant_id, recommendation, category, rationale, priority)
    select p_tenant_id, 'Review Outcomes dashboard to validate initiative ROI', 'optimization',
      'Value realization should precede expansion conversations.', 'medium'
    where not exists (
      select 1 from public.customer_recommendations
      where tenant_id = p_tenant_id and category = 'optimization' and status = 'pending'
    );
  end if;
end; $$;

-- ---------------------------------------------------------------------------
-- 14. Trust explanation
-- ---------------------------------------------------------------------------
create or replace function public._cso_trust_explanation(p_tenant_id uuid, p_profile public.customer_profiles)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  return public.generate_decision_explanation(
    'cso-score-' || p_tenant_id::text,
    'customer_success',
    'customer_success',
    'Customer Success Score: ' || p_profile.success_score || '/100',
    'Health band: ' || public._cso_health_band_label(p_profile.health_band) ||
      '. Stage: ' || public._cso_stage_label(p_profile.lifecycle_stage) ||
      '. Score based on onboarding, adoption, value, learning, expansion readiness, and retention.',
    jsonb_build_array(
      jsonb_build_object('source', 'human_success', 'metric', 'adoption'),
      jsonb_build_object('source', 'outcomes', 'metric', 'value_realization'),
      jsonb_build_object('source', 'milestones', 'metric', 'quick_wins')
    ),
    jsonb_build_array('no_manipulation', 'expansion_follows_value', 'transparent_scoring'),
    'medium',
    '["focus_on_adoption","defer_expansion"]'::jsonb,
    jsonb_build_array('Review score components', 'Complete recommended quick wins'),
    jsonb_build_object(
      'simple', 'This score reflects how successfully your organization is using Aipify — not sales pressure.',
      'operational', 'Components: onboarding, adoption, value, learning, expansion readiness, retention.',
      'technical', 'Score recalculated from Human Success, Outcomes, Value Engine, and milestone data.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 15. Action RPCs
-- ---------------------------------------------------------------------------
create or replace function public.accept_customer_recommendation(p_recommendation_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._cso_require_tenant();
  update public.customer_recommendations set status = 'accepted'
  where id = p_recommendation_id and tenant_id = v_tenant_id;
  perform public._cso_log_audit(v_tenant_id, 'recommendation_accepted', 'Recommendation accepted',
    jsonb_build_object('recommendation_id', p_recommendation_id));
  return jsonb_build_object('status', 'accepted', 'no_pressure', true);
end; $$;

create or replace function public.dismiss_customer_recommendation(p_recommendation_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._cso_require_tenant();
  update public.customer_recommendations set status = 'dismissed'
  where id = p_recommendation_id and tenant_id = v_tenant_id;
  perform public._cso_log_audit(v_tenant_id, 'recommendation_dismissed', 'Recommendation dismissed',
    jsonb_build_object('recommendation_id', p_recommendation_id));
  return jsonb_build_object('status', 'dismissed');
end; $$;

create or replace function public.generate_customer_success_briefing()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_profile public.customer_profiles;
  v_id uuid;
  v_summary text;
  v_content jsonb;
  v_score jsonb;
begin
  v_tenant_id := public._cso_require_tenant();
  perform public._cso_ensure_profile(v_tenant_id);
  v_score := public._cso_calculate_success_score(v_tenant_id);
  select * into v_profile from public.customer_profiles where tenant_id = v_tenant_id;
  perform public._cso_seed_recommendations(v_tenant_id);

  v_summary := 'Customer Success Score ' || v_profile.success_score || '/100 — ' ||
    public._cso_health_band_label(v_profile.health_band) || ' at ' ||
    public._cso_stage_label(v_profile.lifecycle_stage) || ' stage.';

  v_content := jsonb_build_object(
    'success_score', v_profile.success_score,
    'health_band', v_profile.health_band,
    'health_band_label', public._cso_health_band_label(v_profile.health_band),
    'lifecycle_stage', v_profile.lifecycle_stage,
    'score_components', v_score->'components',
    'health_trends', coalesce((
      select jsonb_agg(jsonb_build_object('score', h.score, 'band', h.health_band, 'calculated_at', h.calculated_at)
        order by h.calculated_at desc)
      from public.customer_health_scores h where h.tenant_id = v_tenant_id limit 10
    ), '[]'::jsonb),
    'at_risk_signals', case when v_profile.health_band in ('at_risk', 'critical') then
      jsonb_build_array('Declining adoption or value realization detected')
    else '[]'::jsonb end,
    'expansion_readiness', v_profile.expansion_readiness,
    'success_stories', coalesce((
      select jsonb_agg(jsonb_build_object('description', m.description, 'achieved_at', m.achieved_at))
      from public.customer_milestones m
      where m.tenant_id = v_tenant_id and m.is_quick_win = true
      order by m.achieved_at desc limit 5
    ), '[]'::jsonb),
    'expansion_follows_value', true
  );

  insert into public.customer_success_briefings (tenant_id, summary, content)
  values (v_tenant_id, v_summary, v_content) returning id into v_id;

  perform public._cso_log_audit(v_tenant_id, 'briefing_generated', v_summary,
    jsonb_build_object('briefing_id', v_id));

  return jsonb_build_object('briefing_id', v_id, 'summary', v_summary, 'content', v_content);
end; $$;

create or replace function public.generate_lifecycle_desktop_message()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_profile public.customer_profiles;
  v_settings public.customer_success_settings;
  v_recent_milestone text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_message', false); end if;

  v_settings := public._cso_ensure_settings(v_tenant_id);
  if not v_settings.desktop_celebrations_enabled then
    return jsonb_build_object('has_message', false);
  end if;

  select * into v_profile from public.customer_profiles where tenant_id = v_tenant_id;
  if v_profile.id is null then return jsonb_build_object('has_message', false); end if;

  select description into v_recent_milestone
  from public.customer_milestones
  where tenant_id = v_tenant_id and achieved_at > now() - interval '7 days'
  order by achieved_at desc limit 1;

  if v_recent_milestone is not null then
    return jsonb_build_object(
      'has_message', true,
      'tone', 'celebratory',
      'message', 'Congratulations! ' || v_recent_milestone,
      'follow_up', 'Would you like to explore the next capability?',
      'no_pressure', true
    );
  end if;

  if v_profile.lifecycle_stage = 'activation' and v_profile.quick_wins_count < 2 then
    return jsonb_build_object(
      'has_message', true,
      'tone', 'supportive',
      'message', 'You are close to your first measurable improvement. A quick win builds momentum.',
      'follow_up', 'Try publishing a FAQ or generating your first briefing.',
      'no_pressure', true
    );
  end if;

  return jsonb_build_object('has_message', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 16. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_lifecycle_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_profile public.customer_profiles;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._cso_ensure_profile(v_tenant_id);
  select * into v_profile from public.customer_profiles where tenant_id = v_tenant_id;

  return jsonb_build_object(
    'has_customer', true,
    'success_score', coalesce(v_profile.success_score, 0),
    'health_band', v_profile.health_band,
    'health_band_label', public._cso_health_band_label(v_profile.health_band),
    'lifecycle_stage', v_profile.lifecycle_stage,
    'quick_wins_count', v_profile.quick_wins_count,
    'philosophy', 'Customer success comes before expansion.',
    'no_pressure', true
  );
end; $$;

create or replace function public.get_customer_lifecycle_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.customer_success_settings;
  v_profile public.customer_profiles;
  v_score jsonb;
  v_milestones jsonb;
  v_recommendations jsonb;
  v_playbooks jsonb;
  v_briefings jsonb;
  v_signals jsonb;
  v_stages jsonb;
begin
  v_tenant_id := public._cso_require_tenant();
  v_settings := public._cso_ensure_settings(v_tenant_id);
  perform public._cso_ensure_profile(v_tenant_id);
  perform public._cso_seed_playbooks(v_tenant_id);
  v_score := public._cso_calculate_success_score(v_tenant_id);
  perform public._cso_seed_recommendations(v_tenant_id);
  select * into v_profile from public.customer_profiles where tenant_id = v_tenant_id;
  perform public._cso_trust_explanation(v_tenant_id, v_profile);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'milestone_type', m.milestone_type, 'description', m.description,
    'is_quick_win', m.is_quick_win, 'achieved_at', m.achieved_at
  ) order by m.achieved_at desc), '[]'::jsonb) into v_milestones
  from public.customer_milestones m where m.tenant_id = v_tenant_id limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'recommendation', r.recommendation, 'category', r.category,
    'rationale', r.rationale, 'priority', r.priority, 'status', r.status, 'created_at', r.created_at
  ) order by case r.priority when 'high' then 1 when 'medium' then 2 else 3 end), '[]'::jsonb)
  into v_recommendations
  from public.customer_recommendations r
  where r.tenant_id = v_tenant_id and r.status in ('pending', 'accepted')
  limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'playbook_name', p.playbook_name, 'audience', p.audience,
    'content', p.content, 'active', p.active
  )), '[]'::jsonb) into v_playbooks
  from public.customer_playbooks p where p.tenant_id = v_tenant_id and p.active = true;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'summary', b.summary, 'created_at', b.created_at
  ) order by b.created_at desc), '[]'::jsonb) into v_briefings
  from public.customer_success_briefings b where b.tenant_id = v_tenant_id limit 5;

  v_signals := jsonb_build_object(
    'positive', case when v_profile.adoption_strength >= 70 then
      jsonb_build_array('Strong adoption', 'Healthy engagement patterns')
    else '[]'::jsonb end,
    'risk', case when v_profile.health_band in ('at_risk', 'critical') then
      jsonb_build_array('Declining engagement indicators', 'Limited value realization')
    when v_profile.onboarding_completion < 50 then
      jsonb_build_array('Incomplete onboarding')
    else '[]'::jsonb end
  );

  v_stages := jsonb_build_array(
    jsonb_build_object('key', 'discovery', 'label', 'Discovery', 'purpose', 'Understand Aipify value'),
    jsonb_build_object('key', 'onboarding', 'label', 'Onboarding', 'purpose', 'Successful setup'),
    jsonb_build_object('key', 'activation', 'label', 'Activation', 'purpose', 'Early wins'),
    jsonb_build_object('key', 'adoption', 'label', 'Adoption', 'purpose', 'Sustainable usage'),
    jsonb_build_object('key', 'expansion', 'label', 'Expansion', 'purpose', 'Extend value'),
    jsonb_build_object('key', 'optimization', 'label', 'Optimization', 'purpose', 'Maximize outcomes'),
    jsonb_build_object('key', 'advocacy', 'label', 'Advocacy', 'purpose', 'Celebrate success')
  );

  return jsonb_build_object(
    'has_customer', true,
    'no_pressure', true,
    'expansion_follows_value', true,
    'orchestration_enabled', v_settings.orchestration_enabled,
    'philosophy', 'Customer success comes before expansion.',
    'safety_note', 'No aggressive upselling, manipulative retention, or hidden scoring.',
    'success_score', v_profile.success_score,
    'health_band', v_profile.health_band,
    'health_band_label', public._cso_health_band_label(v_profile.health_band),
    'lifecycle_stage', v_profile.lifecycle_stage,
    'lifecycle_stage_label', public._cso_stage_label(v_profile.lifecycle_stage),
    'score_components', v_score->'components',
    'milestones', v_milestones,
    'quick_wins', coalesce((
      select jsonb_agg(jsonb_build_object('id', m.id, 'description', m.description, 'achieved_at', m.achieved_at))
      from public.customer_milestones m
      where m.tenant_id = v_tenant_id and m.is_quick_win = true
      order by m.achieved_at desc
    ), '[]'::jsonb),
    'recommendations', v_recommendations,
    'playbooks', v_playbooks,
    'briefings', v_briefings,
    'signals', v_signals,
    'lifecycle_stages', v_stages,
    'integrations', jsonb_build_object(
      'human_success', 'Adoption and confidence insights',
      'value_engine', 'Time savings and operational improvements',
      'outcomes', 'Validated value realization',
      'strategic_intelligence', 'Expansion and optimization opportunities',
      'learning_engine', 'Learning paths and best practices',
      'marketplace', 'Value-first pack recommendations',
      'desktop_companion', 'Milestone celebrations and supportive nudges',
      'executive_briefing', 'Customer success briefings'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 17. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'customer-success', 'Customer Success', 'Lifecycle orchestration, quick wins, playbooks, and expansion guides.', 'authenticated', 31
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'customer-success' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 18. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_customer_lifecycle_card() to authenticated;
grant execute on function public.get_customer_lifecycle_dashboard() to authenticated;
grant execute on function public.accept_customer_recommendation(uuid) to authenticated;
grant execute on function public.dismiss_customer_recommendation(uuid) to authenticated;
grant execute on function public.generate_customer_success_briefing() to authenticated;
grant execute on function public.generate_lifecycle_desktop_message() to authenticated;
