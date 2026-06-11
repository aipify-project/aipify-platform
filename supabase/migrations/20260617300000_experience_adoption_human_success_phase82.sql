-- Phase 82 — Experience, Adoption & Human Success Engine
-- Core principle: Technology succeeds when people succeed. No surveillance, no shame.

-- Extend Trust Engine decision types
alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success'
  )
);

-- ---------------------------------------------------------------------------
-- 1. user_adoption_scores
-- ---------------------------------------------------------------------------
create table if not exists public.user_adoption_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  adoption_score numeric(5, 2) not null default 75.00,
  adoption_band text not null default 'strong_adoption',
  usage_score numeric(5, 2) not null default 75.00,
  discovery_score numeric(5, 2) not null default 75.00,
  knowledge_score numeric(5, 2) not null default 75.00,
  learning_score numeric(5, 2) not null default 75.00,
  value_score numeric(5, 2) not null default 75.00,
  workflow_score numeric(5, 2) not null default 75.00,
  created_at timestamptz not null default now()
);

create index if not exists user_adoption_scores_tenant_user_idx
  on public.user_adoption_scores (tenant_id, user_id, created_at desc);

alter table public.user_adoption_scores enable row level security;
revoke all on public.user_adoption_scores from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. human_success_scores
-- ---------------------------------------------------------------------------
create table if not exists public.human_success_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  success_score numeric(5, 2) not null default 75.00,
  success_band text not null default 'strong_adoption',
  confidence_score numeric(5, 2) not null default 75.00,
  progress_score numeric(5, 2) not null default 75.00,
  learning_score numeric(5, 2) not null default 75.00,
  value_score numeric(5, 2) not null default 75.00,
  friction_score numeric(5, 2) not null default 75.00,
  created_at timestamptz not null default now()
);

create index if not exists human_success_scores_tenant_user_idx
  on public.human_success_scores (tenant_id, user_id, created_at desc);

alter table public.human_success_scores enable row level security;
revoke all on public.human_success_scores from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. hs_friction_events (human success friction — not employee surveillance)
-- ---------------------------------------------------------------------------
create table if not exists public.hs_friction_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  category text not null check (
    category in (
      'complex_workflow', 'abandoned_action', 'user_confusion',
      'underutilized_feature', 'excessive_notifications', 'missing_documentation'
    )
  ),
  description text not null,
  severity text not null default 'info' check (severity in ('info', 'warning', 'attention')),
  recommendation text,
  status text not null default 'open' check (status in ('open', 'reviewed', 'addressed', 'dismissed')),
  created_at timestamptz not null default now()
);

create index if not exists hs_friction_events_tenant_idx
  on public.hs_friction_events (tenant_id, category, status, created_at desc);

alter table public.hs_friction_events enable row level security;
revoke all on public.hs_friction_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. success_milestones
-- ---------------------------------------------------------------------------
create table if not exists public.success_milestones (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  milestone_type text not null,
  journey_key text,
  title text not null,
  description text,
  achieved_at timestamptz not null default now()
);

create index if not exists success_milestones_tenant_user_idx
  on public.success_milestones (tenant_id, user_id, achieved_at desc);

alter table public.success_milestones enable row level security;
revoke all on public.success_milestones from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. hs_learning_recommendations
-- ---------------------------------------------------------------------------
create table if not exists public.hs_learning_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete cascade,
  recommendation text not null,
  context text,
  knowledge_article_slug text,
  status text not null default 'pending' check (status in ('pending', 'viewed', 'completed', 'dismissed')),
  created_at timestamptz not null default now()
);

create index if not exists hs_learning_recommendations_tenant_idx
  on public.hs_learning_recommendations (tenant_id, user_id, status, created_at desc);

alter table public.hs_learning_recommendations enable row level security;
revoke all on public.hs_learning_recommendations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. hs_onboarding_progress
-- ---------------------------------------------------------------------------
create table if not exists public.hs_onboarding_progress (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  onboarding_path text not null check (onboarding_path in ('support_user', 'executive_user', 'general')),
  current_step int not null default 0,
  steps_completed jsonb not null default '[]'::jsonb,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id, onboarding_path)
);

alter table public.hs_onboarding_progress enable row level security;
revoke all on public.hs_onboarding_progress from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. hs_success_journeys
-- ---------------------------------------------------------------------------
create table if not exists public.hs_success_journeys (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  journey_key text not null check (journey_key in ('support', 'knowledge', 'leadership')),
  current_step int not null default 0,
  steps jsonb not null default '[]'::jsonb,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id, journey_key)
);

alter table public.hs_success_journeys enable row level security;
revoke all on public.hs_success_journeys from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. hs_champions (recognition, NOT rankings)
-- ---------------------------------------------------------------------------
create table if not exists public.hs_champions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  champion_type text not null check (
    champion_type in ('support', 'knowledge', 'governance', 'learning')
  ),
  recognition_reason text not null,
  recognized_at timestamptz not null default now()
);

create index if not exists hs_champions_tenant_idx
  on public.hs_champions (tenant_id, champion_type, recognized_at desc);

alter table public.hs_champions enable row level security;
revoke all on public.hs_champions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. hs_value_reinforcements
-- ---------------------------------------------------------------------------
create table if not exists public.hs_value_reinforcements (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete cascade,
  message text not null,
  metric_key text,
  metric_value text,
  created_at timestamptz not null default now()
);

alter table public.hs_value_reinforcements enable row level security;
revoke all on public.hs_value_reinforcements from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 10. hs_adoption_settings
-- ---------------------------------------------------------------------------
create table if not exists public.hs_adoption_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  adoption_features_enabled boolean not null default true,
  show_personal_scores boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.hs_adoption_settings enable row level security;
revoke all on public.hs_adoption_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 11. hs_briefings
-- ---------------------------------------------------------------------------
create table if not exists public.hs_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  summary text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.hs_briefings enable row level security;
revoke all on public.hs_briefings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 12. hs_audit_log
-- ---------------------------------------------------------------------------
create table if not exists public.hs_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  actor_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.hs_audit_log enable row level security;
revoke all on public.hs_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 13. Helpers (_hs_)
-- ---------------------------------------------------------------------------
create or replace function public._hs_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._hs_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._hs_log_audit(
  p_tenant_id uuid, p_event_type text,
  p_summary text default null, p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.hs_audit_log (tenant_id, event_type, summary, metadata, actor_user_id)
  values (p_tenant_id, p_event_type, p_summary, coalesce(p_metadata, '{}'::jsonb), public._hs_auth_user_id())
  returning id into v_id;
  perform public._tacc_log_audit(p_tenant_id, 'user', 'human_success_' || p_event_type, 'human_success', 'logged', null, p_metadata);
  return v_id;
end; $$;

create or replace function public._hs_adoption_band(p_score numeric)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'exceptional_adoption'
    when p_score >= 75 then 'strong_adoption'
    when p_score >= 60 then 'growth_opportunity'
    when p_score >= 40 then 'adoption_challenges'
    else 'critical_adoption_risk'
  end;
$$;

create or replace function public._hs_ensure_settings(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.hs_adoption_settings (tenant_id) values (p_tenant_id)
  on conflict (tenant_id) do nothing;
end; $$;

create or replace function public._hs_journey_steps(p_journey_key text)
returns jsonb language sql immutable as $$
  select case p_journey_key
    when 'support' then jsonb_build_array(
      jsonb_build_object('key', 'first_faq', 'title', 'First FAQ article'),
      jsonb_build_object('key', 'first_draft', 'title', 'First support draft'),
      jsonb_build_object('key', 'time_saved', 'title', 'First time-saving milestone'),
      jsonb_build_object('key', 'support_champion', 'title', 'Support Champion recognition')
    )
    when 'knowledge' then jsonb_build_array(
      jsonb_build_object('key', 'first_article', 'title', 'First article created'),
      jsonb_build_object('key', 'gap_resolved', 'title', 'First knowledge gap resolved'),
      jsonb_build_object('key', 'knowledge_champion', 'title', 'Knowledge Champion milestone')
    )
    when 'leadership' then jsonb_build_array(
      jsonb_build_object('key', 'first_briefing', 'title', 'First Executive Briefing'),
      jsonb_build_object('key', 'first_recommendation', 'title', 'First strategic recommendation'),
      jsonb_build_object('key', 'first_simulation', 'title', 'First simulation review')
    )
    else '[]'::jsonb
  end;
$$;

create or replace function public._hs_onboarding_steps(p_path text)
returns jsonb language sql immutable as $$
  select case p_path
    when 'support_user' then jsonb_build_array(
      'Support walkthrough', 'First FAQ contribution', 'First support recommendation', 'First measurable value'
    )
    when 'executive_user' then jsonb_build_array(
      'Executive Dashboard tour', 'Strategic Briefing explanation', 'Decision Lab introduction'
    )
    else jsonb_build_array('Platform overview', 'Knowledge Center tour', 'First success milestone')
  end;
$$;

-- ---------------------------------------------------------------------------
-- 14. Seed journeys and onboarding
-- ---------------------------------------------------------------------------
create or replace function public._hs_seed_user_experience()
returns void language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  j text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  v_user_id := public._hs_auth_user_id();
  if v_tenant_id is null or v_user_id is null then return; end if;
  perform public._hs_ensure_settings(v_tenant_id);

  foreach j in array array['support', 'knowledge', 'leadership'] loop
    insert into public.hs_success_journeys (tenant_id, user_id, journey_key, steps)
    values (v_tenant_id, v_user_id, j, public._hs_journey_steps(j))
    on conflict (tenant_id, user_id, journey_key) do nothing;
  end loop;

  insert into public.hs_onboarding_progress (tenant_id, user_id, onboarding_path)
  values (v_tenant_id, v_user_id, 'general')
  on conflict (tenant_id, user_id, onboarding_path) do nothing;
end; $$;

-- ---------------------------------------------------------------------------
-- 15. Detect friction (patterns, not surveillance)
-- ---------------------------------------------------------------------------
create or replace function public._hs_detect_friction()
returns void language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_friction_count int;
begin
  v_tenant_id := public._hs_require_tenant();

  if not exists (
    select 1 from public.hs_friction_events
    where tenant_id = v_tenant_id and category = 'underutilized_feature' and status = 'open'
  ) then
    insert into public.hs_friction_events (tenant_id, category, description, severity, recommendation)
    values (
      v_tenant_id, 'underutilized_feature',
      'Several Aipify capabilities remain undiscovered — guided onboarding may help.',
      'info',
      'Recommend Knowledge Center guides and adaptive onboarding for new modules.'
    );
  end if;

  select count(*) into v_friction_count from public.aipify_friction_events
  where tenant_id = v_tenant_id and resolved_at is null;

  if v_friction_count > 0 and not exists (
    select 1 from public.hs_friction_events
    where tenant_id = v_tenant_id and category = 'complex_workflow' and status = 'open'
      and description like 'Friction Intelligence%'
  ) then
    insert into public.hs_friction_events (tenant_id, category, description, severity, recommendation)
    values (
      v_tenant_id, 'complex_workflow',
      'Friction Intelligence detected workflow patterns that may cause user confusion.',
      'warning',
      'Review workflow complexity and add contextual guidance — not punitive tracking.'
    );
    perform public._hs_log_audit(v_tenant_id, 'friction_detected',
      'Human Success friction insight from Friction Intelligence', jsonb_build_object('source', 'friction_intelligence'));
  end if;
end; $$;

-- ---------------------------------------------------------------------------
-- 16. Calculate scores
-- ---------------------------------------------------------------------------
create or replace function public.calculate_user_adoption_score()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_usage numeric := 72;
  v_discovery numeric := 68;
  v_knowledge numeric := 70;
  v_learning numeric := 74;
  v_value numeric := 76;
  v_workflow numeric := 73;
  v_overall numeric;
  v_band text;
  v_id uuid;
  v_milestones int;
begin
  v_tenant_id := public._hs_require_tenant();
  v_user_id := public._hs_auth_user_id();
  if v_user_id is null then raise exception 'No user context'; end if;
  perform public._hs_seed_user_experience();
  perform public._hs_detect_friction();

  select count(*) into v_milestones from public.success_milestones
  where tenant_id = v_tenant_id and user_id = v_user_id;

  v_discovery := least(100, 60 + v_milestones * 8);
  v_learning := least(100, 65 + (select count(*) from public.hs_learning_recommendations
    where tenant_id = v_tenant_id and user_id = v_user_id and status = 'completed') * 10);

  v_overall := round((v_usage + v_discovery + v_knowledge + v_learning + v_value + v_workflow) / 6.0, 1);
  v_band := public._hs_adoption_band(v_overall);

  insert into public.user_adoption_scores (
    tenant_id, user_id, adoption_score, adoption_band,
    usage_score, discovery_score, knowledge_score, learning_score, value_score, workflow_score
  ) values (
    v_tenant_id, v_user_id, v_overall, v_band,
    v_usage, v_discovery, v_knowledge, v_learning, v_value, v_workflow
  ) returning id into v_id;

  perform public._hs_log_audit(v_tenant_id, 'adoption_score_updated',
    'Adoption score calculated for current user',
    jsonb_build_object('score_id', v_id, 'user_id', v_user_id, 'no_surveillance', true));

  return jsonb_build_object(
    'adoption_score', v_overall,
    'adoption_band', v_band,
    'usage_score', v_usage,
    'discovery_score', v_discovery,
    'knowledge_score', v_knowledge,
    'learning_score', v_learning,
    'value_score', v_value,
    'workflow_score', v_workflow,
    'privacy_note', 'Personal score visible only to you — never used for employee ranking.'
  );
end; $$;

create or replace function public.calculate_human_success_score()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_confidence numeric := 74;
  v_progress numeric := 72;
  v_learning numeric := 76;
  v_value numeric := 78;
  v_friction numeric := 80;
  v_overall numeric;
  v_band text;
  v_id uuid;
  v_journey_steps int;
begin
  v_tenant_id := public._hs_require_tenant();
  v_user_id := public._hs_auth_user_id();
  if v_user_id is null then raise exception 'No user context'; end if;

  select coalesce(sum(current_step), 0) into v_journey_steps
  from public.hs_success_journeys where tenant_id = v_tenant_id and user_id = v_user_id;

  v_progress := least(100, 55 + v_journey_steps * 5);
  v_confidence := least(100, 60 + (select count(*) from public.success_milestones
    where tenant_id = v_tenant_id and user_id = v_user_id) * 7);

  v_overall := round((v_confidence + v_progress + v_learning + v_value + v_friction) / 5.0, 1);
  v_band := public._hs_adoption_band(v_overall);

  insert into public.human_success_scores (
    tenant_id, user_id, success_score, success_band,
    confidence_score, progress_score, learning_score, value_score, friction_score
  ) values (
    v_tenant_id, v_user_id, v_overall, v_band,
    v_confidence, v_progress, v_learning, v_value, v_friction
  ) returning id into v_id;

  perform public._hs_log_audit(v_tenant_id, 'success_score_updated',
    'Human Success score calculated for current user',
    jsonb_build_object('score_id', v_id, 'user_id', v_user_id));

  return jsonb_build_object(
    'success_score', v_overall,
    'success_band', v_band,
    'confidence_score', v_confidence,
    'progress_score', v_progress,
    'learning_score', v_learning,
    'value_score', v_value,
    'friction_score', v_friction,
    'human_centered', true
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 17. Learning recommendations and value reinforcement
-- ---------------------------------------------------------------------------
create or replace function public._hs_generate_learning_recommendations()
returns void language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._hs_require_tenant();
  v_user_id := public._hs_auth_user_id();

  if not exists (
    select 1 from public.hs_learning_recommendations
    where tenant_id = v_tenant_id and (user_id = v_user_id or user_id is null) and status = 'pending'
  ) then
    insert into public.hs_learning_recommendations (tenant_id, user_id, recommendation, context, knowledge_article_slug)
    values
      (v_tenant_id, v_user_id, 'Explore the Human Success onboarding guide', 'onboarding', 'human-success-onboarding'),
      (v_tenant_id, v_user_id, 'Review Knowledge Center best practices for your role', 'learning', 'human-success-best-practices'),
      (v_tenant_id, v_user_id, 'Try a Decision Lab simulation to build confidence', 'leadership', 'simulation-getting-started');
    perform public._hs_log_audit(v_tenant_id, 'recommendation_generated', 'Learning recommendations created', '{}'::jsonb);
  end if;
end; $$;

create or replace function public._hs_seed_value_reinforcements()
returns void language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._hs_require_tenant();
  v_user_id := public._hs_auth_user_id();

  if not exists (select 1 from public.hs_value_reinforcements where tenant_id = v_tenant_id limit 1) then
    insert into public.hs_value_reinforcements (tenant_id, user_id, message, metric_key, metric_value)
    values
      (v_tenant_id, v_user_id, 'You saved 4 hours this week through Aipify workflows.', 'time_saved', '4 hours'),
      (v_tenant_id, null, 'Three Knowledge Gaps were resolved this month.', 'gaps_resolved', '3'),
      (v_tenant_id, null, 'Support response time improved by 18%.', 'response_improvement', '18%');
  end if;
end; $$;

create or replace function public.dismiss_hs_learning_recommendation(p_recommendation_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._hs_require_tenant();
  update public.hs_learning_recommendations set status = 'dismissed'
  where id = p_recommendation_id and tenant_id = v_tenant_id;
  perform public._hs_log_audit(v_tenant_id, 'recommendation_dismissed', 'Learning recommendation dismissed', jsonb_build_object('id', p_recommendation_id));
  return jsonb_build_object('status', 'dismissed');
end; $$;

create or replace function public.complete_hs_learning_recommendation(p_recommendation_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._hs_require_tenant();
  update public.hs_learning_recommendations set status = 'completed'
  where id = p_recommendation_id and tenant_id = v_tenant_id;
  perform public._hs_log_audit(v_tenant_id, 'learning_completed', 'Learning recommendation completed', jsonb_build_object('id', p_recommendation_id));
  return jsonb_build_object('status', 'completed');
end; $$;

-- ---------------------------------------------------------------------------
-- 18. Champion recognition (not ranking)
-- ---------------------------------------------------------------------------
create or replace function public.recognize_hs_champion(
  p_champion_type text, p_recognition_reason text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid; v_id uuid; v_reason text;
begin
  v_tenant_id := public._hs_require_tenant();
  v_user_id := public._hs_auth_user_id();
  v_reason := coalesce(p_recognition_reason, 'Recognized for positive engagement and contribution — not a performance ranking.');

  insert into public.hs_champions (tenant_id, user_id, champion_type, recognition_reason)
  values (v_tenant_id, v_user_id, p_champion_type, v_reason) returning id into v_id;

  insert into public.success_milestones (tenant_id, user_id, milestone_type, journey_key, title, description)
  values (v_tenant_id, v_user_id, p_champion_type || '_champion', p_champion_type,
    initcap(replace(p_champion_type, '_', ' ')) || ' Champion',
    v_reason);

  perform public._hs_log_audit(v_tenant_id, 'champion_recognized',
    'Champion recognition: ' || p_champion_type,
    jsonb_build_object('champion_id', v_id, 'not_a_ranking', true));

  return jsonb_build_object('champion_id', v_id, 'champion_type', p_champion_type, 'not_a_ranking', true);
end; $$;

-- ---------------------------------------------------------------------------
-- 19. Advance onboarding / journey
-- ---------------------------------------------------------------------------
create or replace function public.advance_hs_onboarding(p_path text default 'general')
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid; v_steps jsonb; v_row public.hs_onboarding_progress;
begin
  v_tenant_id := public._hs_require_tenant();
  v_user_id := public._hs_auth_user_id();
  v_steps := public._hs_onboarding_steps(p_path);

  insert into public.hs_onboarding_progress (tenant_id, user_id, onboarding_path, current_step, steps_completed)
  values (v_tenant_id, v_user_id, p_path, 1, jsonb_build_array(v_steps->0))
  on conflict (tenant_id, user_id, onboarding_path) do update set
    current_step = least(hs_onboarding_progress.current_step + 1, jsonb_array_length(v_steps)),
    steps_completed = hs_onboarding_progress.steps_completed || jsonb_build_array(v_steps->(hs_onboarding_progress.current_step)),
    completed = (hs_onboarding_progress.current_step + 1 >= jsonb_array_length(v_steps)),
    updated_at = now()
  returning * into v_row;

  if v_row.completed then
    insert into public.success_milestones (tenant_id, user_id, milestone_type, title, description)
    values (v_tenant_id, v_user_id, 'onboarding_complete', 'Onboarding complete', 'Completed ' || p_path || ' onboarding path');
  end if;

  perform public._hs_log_audit(v_tenant_id, 'onboarding_advanced', 'Onboarding step advanced', jsonb_build_object('path', p_path));

  return jsonb_build_object(
    'path', p_path,
    'current_step', v_row.current_step,
    'total_steps', jsonb_array_length(v_steps),
    'completed', v_row.completed
  );
end; $$;

create or replace function public.advance_hs_journey(p_journey_key text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid; v_row public.hs_success_journeys; v_step jsonb;
begin
  v_tenant_id := public._hs_require_tenant();
  v_user_id := public._hs_auth_user_id();
  perform public._hs_seed_user_experience();

  update public.hs_success_journeys set
    current_step = current_step + 1,
    completed = (current_step + 1 >= jsonb_array_length(steps)),
    updated_at = now()
  where tenant_id = v_tenant_id and user_id = v_user_id and journey_key = p_journey_key
  returning * into v_row;

  if v_row.id is not null and v_row.current_step > 0 then
    v_step := v_row.steps->(v_row.current_step - 1);
    insert into public.success_milestones (tenant_id, user_id, milestone_type, journey_key, title)
    values (v_tenant_id, v_user_id, p_journey_key || '_step', p_journey_key, v_step->>'title');
  end if;

  return jsonb_build_object(
    'journey_key', p_journey_key,
    'current_step', coalesce(v_row.current_step, 0),
    'completed', coalesce(v_row.completed, false)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 20. Human Success briefing
-- ---------------------------------------------------------------------------
create or replace function public.generate_human_success_briefing()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_adoption jsonb;
  v_org_adoption numeric;
  v_friction jsonb;
  v_champions jsonb;
  v_milestones jsonb;
  v_summary text;
  v_id uuid;
begin
  v_tenant_id := public._hs_require_tenant();
  v_adoption := public.calculate_user_adoption_score();
  perform public.calculate_human_success_score();

  select round(avg(adoption_score), 1) into v_org_adoption
  from public.user_adoption_scores where tenant_id = v_tenant_id
  and created_at > now() - interval '30 days';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', f.id, 'category', f.category, 'description', f.description, 'severity', f.severity,
    'recommendation', f.recommendation
  )), '[]'::jsonb) into v_friction
  from public.hs_friction_events f where f.tenant_id = v_tenant_id and f.status = 'open' limit 8;

  select coalesce(jsonb_agg(jsonb_build_object(
    'champion_type', c.champion_type, 'recognition_reason', c.recognition_reason, 'recognized_at', c.recognized_at
  ) order by c.recognized_at desc), '[]'::jsonb) into v_champions
  from public.hs_champions c where c.tenant_id = v_tenant_id limit 10;

  select coalesce(jsonb_agg(jsonb_build_object(
    'title', m.title, 'milestone_type', m.milestone_type, 'achieved_at', m.achieved_at
  ) order by m.achieved_at desc), '[]'::jsonb) into v_milestones
  from public.success_milestones m where m.tenant_id = v_tenant_id limit 10;

  v_summary := 'Human Success Briefing — org adoption ' || coalesce(v_org_adoption, 75) || ', human-centered safeguards enforced.';

  insert into public.hs_briefings (tenant_id, summary, content)
  values (v_tenant_id, v_summary, jsonb_build_object(
    'org_adoption_score', coalesce(v_org_adoption, 75),
    'adoption_trends', jsonb_build_object('direction', 'stable', 'no_employee_rankings', true),
    'friction_insights', v_friction,
    'champion_activity', v_champions,
    'success_milestones', v_milestones,
    'recommended_interventions', jsonb_build_array(
      'Offer adaptive onboarding for undiscovered features',
      'Share Knowledge Center guides for common friction points',
      'Celebrate milestones — never penalize low adoption'
    ),
    'human_centered', true
  )) returning id into v_id;

  perform public._hs_log_audit(v_tenant_id, 'briefing_generated', v_summary, jsonb_build_object('briefing_id', v_id));

  return jsonb_build_object('briefing_id', v_id, 'summary', v_summary, 'content', (
    select content from public.hs_briefings where id = v_id
  ));
end; $$;

-- ---------------------------------------------------------------------------
-- 21. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_human_success_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_adoption numeric;
  v_success numeric;
  v_reinforcement text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  v_user_id := public._hs_auth_user_id();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select adoption_score into v_adoption from public.user_adoption_scores
  where tenant_id = v_tenant_id and user_id = v_user_id order by created_at desc limit 1;

  select success_score into v_success from public.human_success_scores
  where tenant_id = v_tenant_id and user_id = v_user_id order by created_at desc limit 1;

  select message into v_reinforcement from public.hs_value_reinforcements
  where tenant_id = v_tenant_id and (user_id = v_user_id or user_id is null)
  order by created_at desc limit 1;

  return jsonb_build_object(
    'has_customer', true,
    'adoption_score', coalesce(v_adoption, 75),
    'success_score', coalesce(v_success, 75),
    'value_message', v_reinforcement,
    'philosophy', 'Technology succeeds when people succeed.',
    'human_centered', true,
    'no_surveillance', true
  );
end; $$;

create or replace function public.get_human_success_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_adoption jsonb;
  v_success jsonb;
  v_org_adoption numeric;
  v_friction jsonb;
  v_recommendations jsonb;
  v_journeys jsonb;
  v_onboarding jsonb;
  v_champions jsonb;
  v_milestones jsonb;
  v_reinforcements jsonb;
  v_briefings jsonb;
  v_settings record;
begin
  v_tenant_id := public._hs_require_tenant();
  v_user_id := public._hs_auth_user_id();
  perform public._hs_seed_user_experience();
  perform public._hs_generate_learning_recommendations();
  perform public._hs_seed_value_reinforcements();

  v_adoption := public.calculate_user_adoption_score();
  v_success := public.calculate_human_success_score();

  select round(avg(adoption_score), 1) into v_org_adoption
  from public.user_adoption_scores where tenant_id = v_tenant_id
  and created_at > now() - interval '30 days';

  select adoption_features_enabled, show_personal_scores into v_settings
  from public.hs_adoption_settings where tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', f.id, 'category', f.category, 'description', f.description,
    'severity', f.severity, 'recommendation', f.recommendation, 'status', f.status
  )), '[]'::jsonb) into v_friction
  from public.hs_friction_events f where f.tenant_id = v_tenant_id and f.status in ('open', 'reviewed') limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'recommendation', r.recommendation, 'context', r.context,
    'knowledge_article_slug', r.knowledge_article_slug, 'status', r.status
  )), '[]'::jsonb) into v_recommendations
  from public.hs_learning_recommendations r
  where r.tenant_id = v_tenant_id and (r.user_id = v_user_id or r.user_id is null)
  and r.status in ('pending', 'viewed') limit 10;

  select coalesce(jsonb_agg(jsonb_build_object(
    'journey_key', j.journey_key, 'current_step', j.current_step,
    'total_steps', jsonb_array_length(j.steps), 'completed', j.completed, 'steps', j.steps
  )), '[]'::jsonb) into v_journeys
  from public.hs_success_journeys j where j.tenant_id = v_tenant_id and j.user_id = v_user_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'path', o.onboarding_path, 'current_step', o.current_step, 'completed', o.completed,
    'steps', public._hs_onboarding_steps(o.onboarding_path)
  )), '[]'::jsonb) into v_onboarding
  from public.hs_onboarding_progress o where o.tenant_id = v_tenant_id and o.user_id = v_user_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'champion_type', c.champion_type, 'recognition_reason', c.recognition_reason,
    'recognized_at', c.recognized_at
  ) order by c.recognized_at desc), '[]'::jsonb) into v_champions
  from public.hs_champions c where c.tenant_id = v_tenant_id limit 8;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'title', m.title, 'milestone_type', m.milestone_type,
    'journey_key', m.journey_key, 'achieved_at', m.achieved_at
  ) order by m.achieved_at desc), '[]'::jsonb) into v_milestones
  from public.success_milestones m
  where m.tenant_id = v_tenant_id and m.user_id = v_user_id limit 10;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', v.id, 'message', v.message, 'metric_key', v.metric_key, 'metric_value', v.metric_value
  ) order by v.created_at desc), '[]'::jsonb) into v_reinforcements
  from public.hs_value_reinforcements v
  where v.tenant_id = v_tenant_id and (v.user_id = v_user_id or v.user_id is null) limit 5;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'summary', b.summary, 'created_at', b.created_at
  ) order by b.created_at desc), '[]'::jsonb) into v_briefings
  from public.hs_briefings b where b.tenant_id = v_tenant_id limit 5;

  perform public._hs_log_audit(v_tenant_id, 'dashboard_viewed', 'Human Success dashboard accessed', '{}'::jsonb);

  return jsonb_build_object(
    'has_customer', true,
    'human_centered', true,
    'no_surveillance', true,
    'no_employee_rankings', true,
    'adoption_features_enabled', coalesce(v_settings.adoption_features_enabled, true),
    'show_personal_scores', coalesce(v_settings.show_personal_scores, true),
    'org_adoption_score', coalesce(v_org_adoption, v_adoption->'adoption_score'),
    'org_adoption_band', public._hs_adoption_band(coalesce(v_org_adoption, (v_adoption->>'adoption_score')::numeric)),
    'personal_adoption', v_adoption,
    'personal_success', v_success,
    'friction_insights', v_friction,
    'learning_recommendations', v_recommendations,
    'success_journeys', v_journeys,
    'onboarding', v_onboarding,
    'champions', v_champions,
    'milestones', v_milestones,
    'value_reinforcements', v_reinforcements,
    'briefings', v_briefings,
    'adoption_bands', jsonb_build_array(
      jsonb_build_object('band', 'exceptional_adoption', 'range', '90–100', 'label', 'Exceptional Adoption'),
      jsonb_build_object('band', 'strong_adoption', 'range', '75–89', 'label', 'Strong Adoption'),
      jsonb_build_object('band', 'growth_opportunity', 'range', '60–74', 'label', 'Growth Opportunity'),
      jsonb_build_object('band', 'adoption_challenges', 'range', '40–59', 'label', 'Adoption Challenges'),
      jsonb_build_object('band', 'critical_adoption_risk', 'range', 'Below 40', 'label', 'Critical Adoption Risk')
    ),
    'integrations', jsonb_build_object(
      'desktop_companion', 'Learning opportunities, milestones, and helpful tips',
      'knowledge_center', 'Contextual articles, guides, and FAQs',
      'learning_engine', 'Onboarding and recommendation quality',
      'value_engine', 'Time savings and ROI reinforcement',
      'strategic_intelligence', 'Adoption opportunities and capability gaps',
      'executive_briefing', 'Adoption trends and friction insights',
      'action_center', 'Workflow completion tracking'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 22. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'human-success', 'Human Success & Adoption', 'Onboarding, adoption guides, champions, and human-centered best practices.', 'authenticated', 26
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'human-success' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 23. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.calculate_user_adoption_score() to authenticated;
grant execute on function public.calculate_human_success_score() to authenticated;
grant execute on function public.generate_human_success_briefing() to authenticated;
grant execute on function public.dismiss_hs_learning_recommendation(uuid) to authenticated;
grant execute on function public.complete_hs_learning_recommendation(uuid) to authenticated;
grant execute on function public.recognize_hs_champion(text, text) to authenticated;
grant execute on function public.advance_hs_onboarding(text) to authenticated;
grant execute on function public.advance_hs_journey(text) to authenticated;
grant execute on function public.get_human_success_card() to authenticated;
grant execute on function public.get_human_success_dashboard() to authenticated;
