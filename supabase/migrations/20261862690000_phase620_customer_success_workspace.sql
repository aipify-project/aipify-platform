-- Phase 620 — APP Support Customer Success Workspace (read-only GET, extended payload)

create table if not exists public.app_portal_customer_success_plans (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  goal_summary text not null default '' check (char_length(goal_summary) <= 500),
  owner_id uuid references public.users (id) on delete set null,
  owner_label text not null default '',
  status text not null default 'draft' check (status in (
    'draft', 'active', 'in_progress', 'requires_attention', 'at_risk', 'blocked', 'completed', 'archived'
  )),
  category text not null default 'adoption' check (category in (
    'learning', 'security', 'adoption', 'integration', 'operations'
  )),
  priority text not null default 'recommended' check (priority in (
    'opportunity', 'recommended', 'important', 'high_impact'
  )),
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  start_date date,
  target_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_portal_customer_success_plans_company_idx
  on public.app_portal_customer_success_plans (company_id, status, target_date nulls last);

create table if not exists public.app_portal_customer_success_outcomes (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  target_value text not null default '',
  current_value text not null default '',
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  category text not null default 'adoption' check (category in (
    'learning', 'security', 'adoption', 'integration', 'operations'
  )),
  status text not null default 'active' check (status in (
    'draft', 'active', 'in_progress', 'requires_attention', 'at_risk', 'blocked', 'completed', 'archived'
  )),
  updated_at timestamptz not null default now()
);

create index if not exists app_portal_customer_success_outcomes_company_idx
  on public.app_portal_customer_success_outcomes (company_id, status, updated_at desc);

alter table public.app_portal_customer_success_plans enable row level security;
alter table public.app_portal_customer_success_outcomes enable row level security;
revoke all on public.app_portal_customer_success_plans from authenticated, anon;
revoke all on public.app_portal_customer_success_outcomes from authenticated, anon;

create or replace function public._acsc295_user_name(p_user_id uuid)
returns text
language sql
stable
as $$
  select coalesce((select u.full_name from public.users u where u.id = p_user_id), 'Unassigned');
$$;

drop function if exists public.list_app_portal_customer_success(text, text, text, text, date, text);

create or replace function public.list_app_portal_customer_success(
  p_department text default null,
  p_category text default null,
  p_priority text default null,
  p_success_status text default null,
  p_period_from date default null,
  p_search text default null,
  p_owner text default null,
  p_due_date date default null,
  p_sort_by text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_journey_started timestamptz;
  v_metrics jsonb;
  v_categories jsonb;
  v_adoption integer;
  v_utilization integer;
  v_engagement integer;
  v_health_score integer;
  v_health_state text;
  v_status text;
  v_maturity jsonb;
  v_milestones jsonb := '[]'::jsonb;
  v_recs jsonb := '[]'::jsonb;
  v_timeline jsonb := '[]'::jsonb;
  v_follow_ups jsonb := '[]'::jsonb;
  v_plans jsonb := '[]'::jsonb;
  v_outcomes jsonb := '[]'::jsonb;
  v_risks jsonb := '[]'::jsonb;
  v_adoption_signals jsonb := '[]'::jsonb;
  v_owners jsonb := '[]'::jsonb;
  v_next_action jsonb := null;
  v_personal jsonb := '{}'::jsonb;
  v_team_ratio integer := 0;
begin
  v_ctx := public._acsc295_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  select cs.journey_started_at into v_journey_started
  from public.app_portal_customer_success_state cs where cs.company_id = v_company_id;

  v_metrics := public._acsc295_org_metrics(v_company_id);
  v_categories := public._acsc295_category_scores(v_metrics, v_journey_started is not null);
  v_adoption := round((
    (v_categories->>'learning_completion')::numeric +
    (v_categories->>'feature_adoption')::numeric +
    (v_categories->>'user_engagement')::numeric +
    (v_categories->>'operational_maturity')::numeric +
    (v_categories->>'security_completion')::numeric +
    (v_categories->>'integration_usage')::numeric
  ) / 6)::int;
  v_utilization := round((
    (v_categories->>'feature_adoption')::numeric +
    (v_categories->>'operational_maturity')::numeric +
    (v_categories->>'integration_usage')::numeric
  ) / 3)::int;
  v_engagement := (v_categories->>'user_engagement')::int;
  v_status := public._acsc295_success_status(v_adoption);
  v_maturity := public._acsc295_maturity_stage(v_adoption);
  v_health_score := v_adoption;
  v_health_state := public._apsc273_health_state(v_health_score);

  if p_success_status is not null and v_status <> p_success_status then
    return jsonb_build_object('found', true, 'filtered_out', true, 'journey_started', v_journey_started is not null);
  end if;

  v_team_ratio := coalesce((v_metrics->>'two_fa_adoption_percent')::int, 0);

  v_adoption_signals := jsonb_build_array(
    jsonb_build_object('key', 'learning_completion', 'label_key', 'learningCompletion', 'value', (v_categories->>'learning_completion')::int, 'unit', 'score'),
    jsonb_build_object('key', 'feature_adoption', 'label_key', 'featureAdoption', 'value', (v_categories->>'feature_adoption')::int, 'unit', 'score'),
    jsonb_build_object('key', 'user_engagement', 'label_key', 'userEngagement', 'value', (v_categories->>'user_engagement')::int, 'unit', 'score'),
    jsonb_build_object('key', 'team_count', 'label_key', 'teamCount', 'value', (v_metrics->>'team_count')::int, 'unit', 'count'),
    jsonb_build_object('key', 'business_packs', 'label_key', 'businessPacks', 'value', coalesce((v_metrics->>'business_packs')::int, (v_metrics->>'packs')::int, 0), 'unit', 'count'),
    jsonb_build_object('key', 'integrations_connected', 'label_key', 'integrationsConnected', 'value', coalesce((v_metrics->>'integrations_connected')::int, (v_metrics->>'connected_integrations')::int, 0), 'unit', 'count'),
    jsonb_build_object('key', 'two_fa_adoption', 'label_key', 'twoFaAdoption', 'value', v_team_ratio, 'unit', 'percent')
  );

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id,
    'key', m.milestone_key,
    'title', cat->>'title',
    'achieved_at', m.achieved_at,
    'auto_detected', m.auto_detected,
    'item_type', 'milestone',
    'status', 'completed'
  ) order by m.achieved_at desc), '[]'::jsonb)
  into v_milestones
  from public.app_portal_customer_success_milestones m
  cross join lateral (
    select c as cat from jsonb_array_elements(public._acsc295_milestone_catalog()) c
    where c->>'key' = m.milestone_key limit 1
  ) cat
  where m.company_id = v_company_id
    and (p_period_from is null or m.achieved_at::date >= p_period_from);

  v_recs := public._acsc295_build_recommendations(v_metrics, v_company_id);

  if p_priority is not null or p_category is not null or (p_search is not null and trim(p_search) <> '') then
    select coalesce(jsonb_agg(r), '[]'::jsonb) into v_recs from (
      select r from jsonb_array_elements(v_recs) r
      where (p_priority is null or r->>'priority' = p_priority)
        and (p_category is null or r->>'category' = p_category)
        and (p_search is null or trim(p_search) = '' or r->>'key' ilike '%' || trim(p_search) || '%')
    ) sub;
  end if;

  if jsonb_array_length(v_recs) > 0 then
    v_next_action := jsonb_build_object(
      'key', (v_recs->0)->>'key',
      'priority', (v_recs->0)->>'priority',
      'category', (v_recs->0)->>'category'
    );
  end if;

  if to_regclass('public.app_portal_follow_ups') is not null then
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', f.id,
      'title', f.title,
      'summary', f.suggested_next_action,
      'category', f.category,
      'priority', f.priority,
      'status', f.status,
      'owner_id', f.assigned_owner_id,
      'owner_label', public._acsc295_user_name(f.assigned_owner_id),
      'due_at', f.due_at,
      'item_type', 'follow_up',
      'href', '/app/operations/follow-ups'
    ) order by f.due_at nulls last), '[]'::jsonb)
    into v_follow_ups
    from public.app_portal_follow_ups f
    where f.company_id = v_company_id
      and (p_period_from is null or f.created_at::date >= p_period_from)
      and (p_due_date is null or f.due_at::date = p_due_date)
      and (p_owner is null or trim(p_owner) = '' or public._acsc295_user_name(f.assigned_owner_id) ilike '%' || trim(p_owner) || '%')
      and (p_search is null or trim(p_search) = '' or f.title ilike '%' || trim(p_search) || '%');
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id,
    'title', p.title,
    'goal_summary', p.goal_summary,
    'owner_id', p.owner_id,
    'owner_label', coalesce(nullif(p.owner_label, ''), public._acsc295_user_name(p.owner_id)),
    'status', p.status,
    'category', p.category,
    'priority', p.priority,
    'progress_percent', p.progress_percent,
    'start_date', p.start_date,
    'target_date', p.target_date,
    'item_type', 'success_plan'
  ) order by p.target_date nulls last, p.updated_at desc), '[]'::jsonb)
  into v_plans
  from public.app_portal_customer_success_plans p
  where p.company_id = v_company_id
    and p.status not in ('archived')
    and (p_category is null or p.category = p_category)
    and (p_priority is null or p.priority = p_priority)
    and (p_due_date is null or p.target_date = p_due_date)
    and (p_owner is null or trim(p_owner) = '' or coalesce(nullif(p.owner_label, ''), public._acsc295_user_name(p.owner_id)) ilike '%' || trim(p_owner) || '%')
    and (p_search is null or trim(p_search) = '' or p.title ilike '%' || trim(p_search) || '%' or p.goal_summary ilike '%' || trim(p_search) || '%');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id,
    'title', o.title,
    'target_value', o.target_value,
    'current_value', o.current_value,
    'progress_percent', o.progress_percent,
    'category', o.category,
    'status', o.status,
    'item_type', 'outcome'
  ) order by o.progress_percent desc, o.title), '[]'::jsonb)
  into v_outcomes
  from public.app_portal_customer_success_outcomes o
  where o.company_id = v_company_id
    and o.status not in ('archived')
    and (p_category is null or o.category = p_category)
    and (p_search is null or trim(p_search) = '' or o.title ilike '%' || trim(p_search) || '%');

  if to_regclass('public.app_portal_risks') is not null then
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', r.id,
      'title', r.title,
      'description', r.description,
      'category', r.category,
      'status', r.status,
      'likelihood', r.likelihood,
      'impact', r.impact,
      'owner_id', r.owner_id,
      'owner_label', public._acsc295_user_name(r.owner_id),
      'item_type', 'risk',
      'href', '/app/operations/risks'
    ) order by r.updated_at desc), '[]'::jsonb)
    into v_risks
    from public.app_portal_risks r
    where r.company_id = v_company_id
      and r.status not in ('resolved', 'archived')
      and (p_search is null or trim(p_search) = '' or r.title ilike '%' || trim(p_search) || '%');
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id,
    'event_type', l.event_type,
    'title', l.event_type,
    'description', l.description,
    'created_at', l.created_at,
    'item_type', 'activity'
  ) order by l.created_at desc), '[]'::jsonb)
  into v_timeline
  from public.app_portal_customer_success_audit_logs l
  where l.company_id = v_company_id
    and (p_period_from is null or l.created_at::date >= p_period_from)
  limit 15;

  v_timeline := v_timeline || (
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', 'ms-' || m.milestone_key,
      'event_type', 'milestone',
      'title', cat->>'title',
      'description', cat->>'title',
      'created_at', m.achieved_at,
      'item_type', 'activity'
    ) order by m.achieved_at desc), '[]'::jsonb)
    from public.app_portal_customer_success_milestones m
    cross join lateral (
      select c as cat from jsonb_array_elements(public._acsc295_milestone_catalog()) c where c->>'key' = m.milestone_key limit 1
    ) cat
    where m.company_id = v_company_id
  );

  select coalesce(jsonb_agg(distinct owner_name), '[]'::jsonb)
  into v_owners
  from (
    select coalesce(nullif(p.owner_label, ''), public._acsc295_user_name(p.owner_id)) as owner_name
    from public.app_portal_customer_success_plans p where p.company_id = v_company_id
    union
    select public._acsc295_user_name(f.assigned_owner_id)
    from public.app_portal_follow_ups f where f.company_id = v_company_id
    union
    select public._acsc295_user_name(r.owner_id)
    from public.app_portal_risks r where r.company_id = v_company_id
  ) owners
  where owner_name is not null and owner_name <> 'Unassigned';

  if to_regclass('public.app_portal_academy_completions') is not null then
    select jsonb_build_object(
      'courses_completed', count(*)::int,
      'certifications', coalesce((
        select count(*)::int from public.app_portal_academy_certifications ce
        where ce.company_id = v_company_id and ce.user_id = v_user_id and ce.status = 'earned'
      ), 0)
    ) into v_personal
    from public.app_portal_academy_completions co
    where co.company_id = v_company_id and co.user_id = v_user_id;
  end if;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_admin', coalesce(v_ctx->>'can_admin', 'false') = 'true',
    'journey_started', v_journey_started is not null,
    'adoption_score', v_adoption,
    'utilization_score', v_utilization,
    'engagement_score', v_engagement,
    'health_score', v_health_score,
    'health_state', v_health_state,
    'success_status', v_status,
    'maturity', v_maturity,
    'category_scores', v_categories,
    'milestones_achieved', v_milestones,
    'recommendations', v_recs,
    'recommended_next_action', v_next_action,
    'follow_ups', v_follow_ups,
    'success_plans', v_plans,
    'outcomes', v_outcomes,
    'active_risks', v_risks,
    'adoption_signals', v_adoption_signals,
    'timeline', v_timeline,
    'owners', v_owners,
    'personal_progress', v_personal,
    'team_reporting', case when coalesce(v_ctx->>'can_manage', 'false') = 'true' then jsonb_build_object(
      'team_count', v_metrics->>'team_count',
      'two_fa_adoption_percent', v_team_ratio,
      'learning_completions', v_metrics->>'academy_completions'
    ) else null end,
    'last_updated_at', now()
  );
end;
$$;

grant execute on function public.list_app_portal_customer_success(
  text, text, text, text, date, text, text, date, text
) to authenticated;

create or replace function public.begin_app_portal_customer_success_journey()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_metrics jsonb;
begin
  v_ctx := public._acsc295_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  insert into public.app_portal_customer_success_state (company_id, journey_started_at, updated_by)
  values (v_company_id, now(), v_user_id)
  on conflict (company_id) do update set
    journey_started_at = coalesce(public.app_portal_customer_success_state.journey_started_at, now()),
    updated_by = v_user_id,
    updated_at = now();

  insert into public.app_portal_customer_success_audit_logs (company_id, event_type, description, performed_by)
  values (v_company_id, 'journey_started', 'Customer success journey began', v_user_id);

  v_metrics := public._acsc295_org_metrics(v_company_id);
  perform public._acsc295_sync_milestones(v_company_id, v_metrics, v_user_id);

  return public.list_app_portal_customer_success(null, null, null, null, null, null, null, null, null);
end;
$$;
