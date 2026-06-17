-- Phase 314 (APP Intelligence) — Executive Foresight Center

create table if not exists public.app_portal_executive_foresight_state (
  company_id uuid primary key references public.companies (id) on delete cascade,
  manager_access_enabled boolean not null default false,
  admin_access_enabled boolean not null default false,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.users (id) on delete set null
);

create table if not exists public.app_portal_executive_foresight_observations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  observation_key text not null default '',
  title text not null default '',
  category text not null check (category in (
    'organizational_growth', 'workforce_development', 'customer_evolution',
    'technology_trends', 'market_dynamics', 'governance_evolution',
    'competitive_awareness', 'operational_resilience', 'strategic_innovation',
    'leadership_development'
  )),
  insight_type text not null default 'momentum' check (insight_type in (
    'momentum_gain', 'momentum_loss', 'dependency', 'opportunity',
    'blind_spot', 'leadership_observation'
  )),
  summary text not null default '',
  strategic_priority text not null default 'moderate' check (strategic_priority in (
    'low', 'moderate', 'high', 'strategic'
  )),
  time_horizon text not null default '12_months' check (time_horizon in (
    '30_days', '90_days', '6_months', '12_months', '24_months', '36_months'
  )),
  organizational_area text not null default 'executive',
  executive_owner text not null default '',
  review_status text not null default 'pending' check (review_status in (
    'pending', 'in_review', 'reviewed', 'needs_follow_up'
  )),
  momentum_direction text not null default 'stable' check (momentum_direction in (
    'gaining', 'stable', 'losing'
  )),
  metadata jsonb not null default '{}'::jsonb,
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, observation_key)
);

create index if not exists app_portal_executive_foresight_observations_idx
  on public.app_portal_executive_foresight_observations (
    company_id, category, time_horizon, strategic_priority, review_status, insight_type
  );

create table if not exists public.app_portal_executive_foresight_reviews (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  observation_id uuid references public.app_portal_executive_foresight_observations (id) on delete set null,
  review_type text not null default 'strategic' check (review_type in (
    'strategic', 'foresight', 'leadership', 'preparatory'
  )),
  review_notes text not null default '',
  reviewed_by uuid references public.users (id) on delete set null,
  reviewed_at timestamptz not null default now()
);

create index if not exists app_portal_executive_foresight_reviews_idx
  on public.app_portal_executive_foresight_reviews (company_id, reviewed_at desc);

create table if not exists public.app_portal_executive_foresight_notes (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  observation_id uuid references public.app_portal_executive_foresight_observations (id) on delete set null,
  note_text text not null default '',
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.app_portal_executive_foresight_timeline (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  observation_id uuid references public.app_portal_executive_foresight_observations (id) on delete set null,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_executive_foresight_timeline_idx
  on public.app_portal_executive_foresight_timeline (company_id, created_at desc);

create table if not exists public.app_portal_executive_foresight_audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  observation_id uuid,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_executive_foresight_audit_idx
  on public.app_portal_executive_foresight_audit_logs (company_id, created_at desc);

alter table public.app_portal_executive_foresight_state enable row level security;
alter table public.app_portal_executive_foresight_observations enable row level security;
alter table public.app_portal_executive_foresight_reviews enable row level security;
alter table public.app_portal_executive_foresight_notes enable row level security;
alter table public.app_portal_executive_foresight_timeline enable row level security;
alter table public.app_portal_executive_foresight_audit_logs enable row level security;
revoke all on public.app_portal_executive_foresight_state from authenticated, anon;
revoke all on public.app_portal_executive_foresight_observations from authenticated, anon;
revoke all on public.app_portal_executive_foresight_reviews from authenticated, anon;
revoke all on public.app_portal_executive_foresight_notes from authenticated, anon;
revoke all on public.app_portal_executive_foresight_timeline from authenticated, anon;
revoke all on public.app_portal_executive_foresight_audit_logs from authenticated, anon;

create or replace function public._aefc314_access_context()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_user public.users;
  v_role text;
  v_manager_enabled boolean := false;
  v_admin_enabled boolean := false;
begin
  v_access := public._apsf260_require_app_access();
  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_role := v_access->>'organization_role';

  select coalesce(fs.manager_access_enabled, false), coalesce(fs.admin_access_enabled, false)
  into v_manager_enabled, v_admin_enabled
  from public.app_portal_executive_foresight_state fs
  where fs.company_id = (v_access->>'company_id')::uuid;

  if v_role = 'organization_owner' then
    return v_access || jsonb_build_object(
      'user_id', v_user.id, 'can_full', true, 'can_manage', true, 'can_view', true,
      'can_review', true, 'can_note', true
    );
  elsif v_role = 'organization_admin' and v_admin_enabled then
    return v_access || jsonb_build_object(
      'user_id', v_user.id, 'can_full', true, 'can_manage', true, 'can_view', true,
      'can_review', true, 'can_note', true
    );
  elsif v_role = 'organization_manager' and v_manager_enabled then
    return v_access || jsonb_build_object(
      'user_id', v_user.id, 'can_full', false, 'can_manage', false, 'can_view', true,
      'can_review', false, 'can_note', false
    );
  end if;

  raise exception 'Executive Foresight access requires owner authorization or explicit grant';
end;
$$;

create or replace function public._aefc314_executive_questions()
returns jsonb
language sql
immutable
as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'prepare_12_months', 'question', 'What should we prepare for over the next 12 months?'),
    jsonb_build_object('key', 'capability_investment', 'question', 'Which capabilities may require investment?'),
    jsonb_build_object('key', 'dependency_risk', 'question', 'What dependencies create future risk?'),
    jsonb_build_object('key', 'leadership_growth', 'question', 'Are leadership structures prepared for growth?'),
    jsonb_build_object('key', 'explore_opportunities', 'question', 'Which opportunities deserve exploration?'),
    jsonb_build_object('key', 'conversations_now', 'question', 'What conversations should happen now?')
  );
$$;

create or replace function public._aefc314_observation_catalog()
returns jsonb
language sql
immutable
as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'growth_momentum', 'title', 'Organizational growth momentum', 'category', 'organizational_growth', 'type', 'momentum_gain', 'priority', 'high', 'horizon', '12_months', 'area', 'executive', 'owner', 'CEO', 'momentum', 'gaining', 'summary', 'Growth indicators suggest expanding capacity may become a strategic consideration.'),
    jsonb_build_object('key', 'workforce_capability', 'title', 'Workforce capability development', 'category', 'workforce_development', 'type', 'opportunity', 'priority', 'strategic', 'horizon', '24_months', 'area', 'learning', 'owner', 'CHRO', 'momentum', 'gaining', 'summary', 'Skill development investments may strengthen long-term organizational readiness.'),
    jsonb_build_object('key', 'customer_evolution', 'title', 'Customer expectations evolving', 'category', 'customer_evolution', 'type', 'dependency', 'priority', 'high', 'horizon', '12_months', 'area', 'customer', 'owner', 'CCO', 'momentum', 'stable', 'summary', 'Customer engagement patterns may shift — early awareness supports preparedness.'),
    jsonb_build_object('key', 'technology_adoption', 'title', 'Technology adoption trends', 'category', 'technology_trends', 'type', 'opportunity', 'priority', 'moderate', 'horizon', '24_months', 'area', 'automation', 'owner', 'CTO', 'momentum', 'gaining', 'summary', 'Emerging technology patterns may create efficiency opportunities worth exploring.'),
    jsonb_build_object('key', 'market_dynamics', 'title', 'Market dynamics shifting', 'category', 'market_dynamics', 'type', 'leadership_observation', 'priority', 'high', 'horizon', '6_months', 'area', 'strategy', 'owner', 'CEO', 'momentum', 'stable', 'summary', 'Market conditions may create future opportunities — structured review supports thoughtful response.'),
    jsonb_build_object('key', 'governance_evolution', 'title', 'Governance framework evolution', 'category', 'governance_evolution', 'type', 'dependency', 'priority', 'moderate', 'horizon', '12_months', 'area', 'governance', 'owner', 'General Counsel', 'momentum', 'stable', 'summary', 'Governance practices may benefit from proactive review as the organization scales.'),
    jsonb_build_object('key', 'competitive_landscape', 'title', 'Competitive landscape awareness', 'category', 'competitive_awareness', 'type', 'blind_spot', 'priority', 'moderate', 'horizon', '12_months', 'area', 'strategy', 'owner', 'CEO', 'momentum', 'losing', 'summary', 'Competitive awareness may warrant renewed executive attention.'),
    jsonb_build_object('key', 'operational_resilience', 'title', 'Operational resilience preparedness', 'category', 'operational_resilience', 'type', 'dependency', 'priority', 'high', 'horizon', '90_days', 'area', 'operations', 'owner', 'COO', 'momentum', 'gaining', 'summary', 'Resilience indicators suggest proactive continuity planning remains valuable.'),
    jsonb_build_object('key', 'strategic_innovation', 'title', 'Strategic innovation opportunities', 'category', 'strategic_innovation', 'type', 'opportunity', 'priority', 'strategic', 'horizon', '36_months', 'area', 'strategy', 'owner', 'CEO', 'momentum', 'gaining', 'summary', 'Innovation signals may warrant executive exploration sessions.'),
    jsonb_build_object('key', 'leadership_succession', 'title', 'Leadership development and succession', 'category', 'leadership_development', 'type', 'leadership_observation', 'priority', 'strategic', 'horizon', '24_months', 'area', 'executive', 'owner', 'CHRO', 'momentum', 'stable', 'summary', 'Leadership capacity planning should be reviewed as organizational complexity grows.')
  );
$$;

create or replace function public._aefc314_sync_observations(p_company_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_item jsonb;
begin
  insert into public.app_portal_executive_foresight_state (company_id, updated_by)
  values (p_company_id, p_user_id)
  on conflict (company_id) do update set updated_at = now(), updated_by = p_user_id;

  for v_item in select jsonb_array_elements(public._aefc314_observation_catalog())
  loop
    insert into public.app_portal_executive_foresight_observations (
      company_id, observation_key, title, category, insight_type, summary,
      strategic_priority, time_horizon, organizational_area, executive_owner, momentum_direction
    ) values (
      p_company_id,
      v_item->>'key',
      v_item->>'title',
      v_item->>'category',
      v_item->>'type',
      v_item->>'summary',
      v_item->>'priority',
      v_item->>'horizon',
      v_item->>'area',
      v_item->>'owner',
      v_item->>'momentum'
    )
    on conflict (company_id, observation_key) do update set
      title = excluded.title,
      summary = excluded.summary,
      updated_at = now();
  end loop;

  if not exists (
    select 1 from public.app_portal_executive_foresight_timeline t
    where t.company_id = p_company_id and t.event_type = 'foresight_initialized'
  ) then
    insert into public.app_portal_executive_foresight_timeline (
      company_id, event_type, description, performed_by
    ) values (
      p_company_id, 'foresight_initialized', 'Executive foresight workspace initialized', p_user_id
    );
  end if;
end;
$$;

create or replace function public._aefc314_observation_card(p_row public.app_portal_executive_foresight_observations)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', p_row.id,
    'observation_key', p_row.observation_key,
    'title', p_row.title,
    'category', p_row.category,
    'insight_type', p_row.insight_type,
    'summary', p_row.summary,
    'strategic_priority', p_row.strategic_priority,
    'time_horizon', p_row.time_horizon,
    'organizational_area', p_row.organizational_area,
    'executive_owner', p_row.executive_owner,
    'review_status', p_row.review_status,
    'momentum_direction', p_row.momentum_direction,
    'last_reviewed_at', p_row.last_reviewed_at,
    'updated_at', p_row.updated_at
  );
$$;

create or replace function public._aefc314_outlook_score(p_company_id uuid)
returns integer
language plpgsql
stable
as $$
declare
  v_gaining integer := 0;
  v_losing integer := 0;
  v_strategic integer := 0;
begin
  select count(*) filter (where momentum_direction = 'gaining'),
         count(*) filter (where momentum_direction = 'losing'),
         count(*) filter (where strategic_priority in ('high', 'strategic'))
  into v_gaining, v_losing, v_strategic
  from public.app_portal_executive_foresight_observations
  where company_id = p_company_id;

  return least(100, greatest(40, 55 + v_gaining * 5 - v_losing * 4 + least(v_strategic, 4) * 2));
end;
$$;

create or replace function public._aefc314_build_recommendations(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare v_recs jsonb := '[]'::jsonb;
begin
  v_recs := v_recs || jsonb_build_object('id', 'rev-' || p_company_id, 'key', 'scheduleStrategicReviews');
  v_recs := v_recs || jsonb_build_object('id', 'conv-' || p_company_id, 'key', 'expandLeadershipConversations');
  if exists (select 1 from public.app_portal_executive_foresight_observations o where o.company_id = p_company_id and o.category = 'leadership_development') then
    v_recs := v_recs || jsonb_build_object('id', 'succ-' || p_company_id, 'key', 'strengthenSuccessionPlanning');
  end if;
  if exists (select 1 from public.app_portal_executive_foresight_observations o where o.company_id = p_company_id and o.insight_type = 'opportunity') then
    v_recs := v_recs || jsonb_build_object('id', 'opp-' || p_company_id, 'key', 'reviewEmergingOpportunities');
  end if;
  v_recs := v_recs || jsonb_build_object('id', 'res-' || p_company_id, 'key', 'improveOrganizationalResilience');
  v_recs := v_recs || jsonb_build_object('id', 'mon-' || p_company_id, 'key', 'monitorEvolvingTrends');
  return v_recs;
end;
$$;

create or replace function public._aefc314_recommended_conversations(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare v_convs jsonb := '[]'::jsonb;
begin
  if exists (select 1 from public.app_portal_executive_foresight_observations o where o.company_id = p_company_id and o.category = 'leadership_development') then
    v_convs := v_convs || jsonb_build_object('id', 'lc-' || p_company_id, 'topic', 'Leadership capacity and succession readiness');
  end if;
  if exists (select 1 from public.app_portal_executive_foresight_observations o where o.company_id = p_company_id and o.category = 'strategic_innovation') then
    v_convs := v_convs || jsonb_build_object('id', 'in-' || p_company_id, 'topic', 'Strategic innovation exploration');
  end if;
  v_convs := v_convs || jsonb_build_object('id', 'gr-' || p_company_id, 'topic', 'Long-term growth priorities');
  v_convs := v_convs || jsonb_build_object('id', 'rs-' || p_company_id, 'topic', 'Operational resilience preparedness');
  return v_convs;
end;
$$;

create or replace function public._aefc314_manager_categories()
returns text[]
language sql
immutable
as $$
  select array['operational_resilience', 'workforce_development']::text[];
$$;

create or replace function public.list_app_portal_executive_foresight(
  p_category text default null,
  p_time_horizon text default null,
  p_strategic_priority text default null,
  p_organizational_area text default null,
  p_executive_owner text default null,
  p_review_status text default null,
  p_period_from date default null,
  p_search text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid;
  v_obs jsonb := '[]'::jsonb; v_row record; v_total integer := 0;
  v_opportunities jsonb := '[]'::jsonb; v_risks jsonb := '[]'::jsonb;
  v_attention jsonb := '[]'::jsonb; v_focus jsonb := '[]'::jsonb;
  v_gaining jsonb := '[]'::jsonb; v_losing jsonb := '[]'::jsonb;
  v_can_full boolean; v_manager_cats text[];
  v_score integer;
begin
  v_ctx := public._aefc314_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_can_full := coalesce(v_ctx->>'can_full', 'false') = 'true';
  v_manager_cats := public._aefc314_manager_categories();
  perform public._aefc314_sync_observations(v_company_id, v_user_id);
  v_score := public._aefc314_outlook_score(v_company_id);

  for v_row in
    select o.* from public.app_portal_executive_foresight_observations o
    where o.company_id = v_company_id
      and (v_can_full or o.category = any(v_manager_cats))
      and (p_category is null or o.category = p_category)
      and (p_time_horizon is null or o.time_horizon = p_time_horizon)
      and (p_strategic_priority is null or o.strategic_priority = p_strategic_priority)
      and (p_organizational_area is null or o.organizational_area = p_organizational_area)
      and (p_executive_owner is null or o.executive_owner ilike '%' || trim(p_executive_owner) || '%')
      and (p_review_status is null or o.review_status = p_review_status)
      and (p_period_from is null or o.updated_at::date >= p_period_from)
      and (p_search is null or trim(p_search) = '' or o.title ilike '%' || trim(p_search) || '%' or o.summary ilike '%' || trim(p_search) || '%')
    order by case o.strategic_priority when 'strategic' then 1 when 'high' then 2 when 'moderate' then 3 else 4 end, o.updated_at desc
  loop
    v_obs := v_obs || public._aefc314_observation_card(v_row);
    v_total := v_total + 1;
    if v_row.insight_type in ('opportunity', 'momentum_gain') then
      v_opportunities := v_opportunities || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    end if;
    if v_row.insight_type in ('blind_spot', 'dependency') or v_row.momentum_direction = 'losing' then
      v_risks := v_risks || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    end if;
    if v_row.review_status in ('pending', 'needs_follow_up') and v_row.strategic_priority in ('high', 'strategic') then
      v_attention := v_attention || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    end if;
    if v_row.strategic_priority = 'strategic' then
      v_focus := v_focus || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    end if;
    if v_row.momentum_direction = 'gaining' then
      v_gaining := v_gaining || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    elsif v_row.momentum_direction = 'losing' then
      v_losing := v_losing || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    end if;
  end loop;

  return jsonb_build_object(
    'found', true,
    'can_full', v_can_full,
    'can_view', coalesce(v_ctx->>'can_view', 'false') = 'true',
    'can_review', coalesce(v_ctx->>'can_review', 'false') = 'true',
    'can_note', coalesce(v_ctx->>'can_note', 'false') = 'true',
    'has_foresight_data', v_total > 0,
    'executive_outlook_score', v_score,
    'executive_summary', case
      when v_total = 0 then 'No executive foresight insights are available yet.'
      when v_score >= 70 and jsonb_array_length(v_opportunities) >= 2 then 'Several strategic opportunities may warrant exploration.'
      when v_score >= 65 then 'Current indicators suggest strong organizational stability.'
      when exists (select 1 from public.app_portal_executive_foresight_observations o where o.company_id = v_company_id and o.category = 'leadership_development') then
        'Leadership capacity planning should be reviewed.'
      when jsonb_array_length(v_opportunities) > 0 then 'Market conditions may create future opportunities.'
      else 'Current indicators suggest balanced long-term preparedness.'
    end,
    'emerging_opportunities', v_opportunities,
    'emerging_risks', v_risks,
    'strategic_topics_requiring_attention', v_attention,
    'long_term_focus_areas', v_focus,
    'areas_gaining_momentum', v_gaining,
    'areas_losing_momentum', v_losing,
    'recommended_conversations', public._aefc314_recommended_conversations(v_company_id),
    'executive_questions', public._aefc314_executive_questions(),
    'foresight_advisory_note', 'All foresight insights are advisory — Aipify never claims certainty regarding future outcomes.',
    'observations', v_obs,
    'recommendations', public._aefc314_build_recommendations(v_company_id),
    'principle', 'Executive foresight encourages long-term thinking — final strategic decisions remain with leadership.'
  );
end;
$$;

create or replace function public.get_app_portal_executive_foresight_observation(p_observation_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb; v_company_id uuid; v_row record;
  v_reviews jsonb; v_notes jsonb;
  v_can_full boolean; v_manager_cats text[];
begin
  v_ctx := public._aefc314_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_can_full := coalesce(v_ctx->>'can_full', 'false') = 'true';
  v_manager_cats := public._aefc314_manager_categories();
  perform public._aefc314_sync_observations(v_company_id, (v_ctx->>'user_id')::uuid);

  select o.* into v_row from public.app_portal_executive_foresight_observations o
  where o.company_id = v_company_id and o.id = p_observation_id;
  if not found then return jsonb_build_object('found', false); end if;
  if not v_can_full and not (v_row.category = any(v_manager_cats)) then
    raise exception 'This foresight observation is outside your authorized scope';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'review_type', r.review_type, 'review_notes', r.review_notes, 'reviewed_at', r.reviewed_at
  ) order by r.reviewed_at desc), '[]'::jsonb)
  into v_reviews
  from public.app_portal_executive_foresight_reviews r
  where r.company_id = v_company_id and r.observation_id = p_observation_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', n.id, 'note_text', n.note_text, 'created_at', n.created_at
  ) order by n.created_at desc), '[]'::jsonb)
  into v_notes
  from public.app_portal_executive_foresight_notes n
  where n.company_id = v_company_id and n.observation_id = p_observation_id;

  return public._aefc314_observation_card(v_row) || jsonb_build_object(
    'found', true,
    'can_review', coalesce(v_ctx->>'can_review', 'false') = 'true',
    'can_note', coalesce(v_ctx->>'can_note', 'false') = 'true',
    'reviews', v_reviews,
    'notes', v_notes,
    'advisory_note', 'Foresight insights support preparedness — not certainty about future outcomes.'
  );
end;
$$;

create or replace function public.get_app_portal_executive_foresight_recommendations()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_ctx jsonb; v_company_id uuid;
begin
  v_ctx := public._aefc314_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  perform public._aefc314_sync_observations(v_company_id, (v_ctx->>'user_id')::uuid);
  return jsonb_build_object('found', true, 'recommendations', public._aefc314_build_recommendations(v_company_id));
end;
$$;

create or replace function public.get_app_portal_executive_foresight_timeline(
  p_observation_id uuid default null,
  p_period_from date default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_ctx jsonb; v_company_id uuid; v_events jsonb;
begin
  v_ctx := public._aefc314_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  perform public._aefc314_sync_observations(v_company_id, (v_ctx->>'user_id')::uuid);

  select coalesce(jsonb_agg(row order by row->>'created_at' desc), '[]'::jsonb) into v_events
  from (
    select jsonb_build_object(
      'id', t.id, 'observation_id', t.observation_id, 'event_type', t.event_type,
      'description', t.description, 'created_at', t.created_at
    ) as row
    from public.app_portal_executive_foresight_timeline t
    where t.company_id = v_company_id
      and (p_observation_id is null or t.observation_id = p_observation_id)
      and (p_period_from is null or t.created_at::date >= p_period_from)
    order by t.created_at desc limit 25
  ) sub;

  return jsonb_build_object('found', true, 'events', v_events);
end;
$$;

create or replace function public.review_app_portal_executive_foresight(
  p_observation_id uuid default null,
  p_action text default null,
  p_review_notes text default null,
  p_note_text text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid; v_review_id uuid; v_note_id uuid;
begin
  v_ctx := public._aefc314_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if coalesce(p_action, '') = 'begin_review' then
    if coalesce(v_ctx->>'can_review', 'false') <> 'true' then
      raise exception 'Beginning strategic review requires owner authorization or higher';
    end if;
    perform public._aefc314_sync_observations(v_company_id, v_user_id);
    insert into public.app_portal_executive_foresight_timeline (
      company_id, event_type, description, performed_by
    ) values (v_company_id, 'strategic_review_begun', 'Strategic foresight review initiated', v_user_id);
    insert into public.app_portal_executive_foresight_audit_logs (
      company_id, event_type, description, performed_by
    ) values (v_company_id, 'strategic_review_begun', 'Executive strategic review begun', v_user_id);
    return jsonb_build_object('found', true, 'message', 'Strategic foresight review initiated — insights remain advisory.');
  end if;

  if coalesce(p_action, '') = 'complete_review' then
    if coalesce(v_ctx->>'can_review', 'false') <> 'true' then
      raise exception 'Completing review requires owner authorization or higher';
    end if;
    insert into public.app_portal_executive_foresight_reviews (
      company_id, observation_id, review_type, review_notes, reviewed_by
    ) values (
      v_company_id, p_observation_id, 'foresight', coalesce(p_review_notes, 'Foresight review completed'), v_user_id
    ) returning id into v_review_id;

    if p_observation_id is not null then
      update public.app_portal_executive_foresight_observations set
        review_status = 'reviewed', last_reviewed_at = now(), updated_at = now()
      where company_id = v_company_id and id = p_observation_id;
    end if;

    insert into public.app_portal_executive_foresight_timeline (
      company_id, observation_id, event_type, description, performed_by
    ) values (
      v_company_id, p_observation_id, 'foresight_review_completed', 'Foresight review completed', v_user_id
    );

    return jsonb_build_object('found', true, 'review_id', v_review_id, 'message', 'Foresight review recorded successfully.');
  end if;

  if coalesce(p_action, '') = 'add_note' then
    if coalesce(v_ctx->>'can_note', 'false') <> 'true' then
      raise exception 'Adding executive notes requires owner authorization or higher';
    end if;
    if p_observation_id is null then raise exception 'Observation id required'; end if;
    insert into public.app_portal_executive_foresight_notes (
      company_id, observation_id, note_text, created_by
    ) values (v_company_id, p_observation_id, coalesce(p_note_text, ''), v_user_id)
    returning id into v_note_id;

    insert into public.app_portal_executive_foresight_timeline (
      company_id, observation_id, event_type, description, performed_by
    ) values (
      v_company_id, p_observation_id, 'executive_note_added', 'Executive note recorded', v_user_id
    );

    return jsonb_build_object('found', true, 'note_id', v_note_id, 'message', 'Executive note recorded.');
  end if;

  raise exception 'Unknown action';
end;
$$;

grant execute on function public._aefc314_access_context() to authenticated;
grant execute on function public.list_app_portal_executive_foresight(text, text, text, text, text, text, date, text) to authenticated;
grant execute on function public.get_app_portal_executive_foresight_observation(uuid) to authenticated;
grant execute on function public.get_app_portal_executive_foresight_recommendations() to authenticated;
grant execute on function public.get_app_portal_executive_foresight_timeline(uuid, date) to authenticated;
grant execute on function public.review_app_portal_executive_foresight(uuid, text, text, text) to authenticated;
