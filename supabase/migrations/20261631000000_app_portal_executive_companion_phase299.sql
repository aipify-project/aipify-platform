-- Phase 299 (APP) — Executive Companion Center

create table if not exists public.app_portal_executive_companion_state (
  company_id uuid primary key references public.companies (id) on delete cascade,
  briefing_started_at timestamptz,
  manager_access_enabled boolean not null default false,
  last_briefing_at timestamptz,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.users (id) on delete set null
);

create table if not exists public.app_portal_executive_companion_grants (
  company_id uuid not null references public.companies (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  granted_by uuid references public.users (id) on delete set null,
  granted_at timestamptz not null default now(),
  primary key (company_id, user_id)
);

create table if not exists public.app_portal_executive_companion_audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_executive_companion_audit_idx
  on public.app_portal_executive_companion_audit_logs (company_id, created_at desc);

alter table public.app_portal_executive_companion_state enable row level security;
alter table public.app_portal_executive_companion_grants enable row level security;
alter table public.app_portal_executive_companion_audit_logs enable row level security;
revoke all on public.app_portal_executive_companion_state from authenticated, anon;
revoke all on public.app_portal_executive_companion_grants from authenticated, anon;
revoke all on public.app_portal_executive_companion_audit_logs from authenticated, anon;

create or replace function public._aecc299_access_context()
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
  v_company_id uuid;
  v_manager_enabled boolean := false;
  v_has_grant boolean := false;
  v_can_full boolean := false;
  v_can_limited boolean := false;
begin
  v_access := public._apsf260_require_app_access();
  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_role := v_access->>'organization_role';
  v_company_id := (v_access->>'company_id')::uuid;

  if v_role = 'organization_member' then
    raise exception 'Executive Companion access requires leadership authorization';
  end if;

  select coalesce(es.manager_access_enabled, false) into v_manager_enabled
  from public.app_portal_executive_companion_state es where es.company_id = v_company_id;

  select exists(
    select 1 from public.app_portal_executive_companion_grants g
    where g.company_id = v_company_id and g.user_id = v_user.id
  ) into v_has_grant;

  if v_role in ('organization_owner', 'organization_admin') then
    v_can_full := true;
    v_can_limited := true;
  elsif v_role = 'organization_manager' and (v_manager_enabled or v_has_grant) then
    v_can_limited := true;
  elsif v_role = 'organization_manager' then
    raise exception 'Executive Companion manager access requires explicit authorization';
  else
    raise exception 'Executive Companion access requires leadership authorization';
  end if;

  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'can_full', v_can_full,
    'can_limited', v_can_limited,
    'can_manage', v_can_full,
    'is_executive', v_can_full or v_can_limited
  );
end;
$$;

create or replace function public._aecc299_exec_metrics(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_commit_due integer := 0;
  v_commit_critical integer := 0;
  v_strategy_delayed integer := 0;
  v_strategy_active integer := 0;
  v_risks_high integer := 0;
  v_decisions_pending integer := 0;
  v_meetings_upcoming integer := 0;
  v_follow_open integer := 0;
  v_momentum_score integer := 0;
  v_resilience_score integer := 0;
  v_success_milestones integer := 0;
  v_capacity_overloaded integer := 0;
begin
  if to_regclass('public.app_portal_commitments') is not null then
    select count(*) filter (where c.due_date is not null and c.due_date <= current_date + 7
      and c.status in ('accepted', 'in_progress', 'at_risk'))::int,
           count(*) filter (where c.priority = 'critical' and c.status in ('accepted', 'in_progress', 'at_risk'))::int
    into v_commit_due, v_commit_critical
    from public.app_portal_commitments c where c.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_strategy_initiatives') is not null then
    select count(*) filter (where s.status = 'delayed')::int,
           count(*) filter (where s.status in ('active', 'on_track', 'needs_attention'))::int
    into v_strategy_delayed, v_strategy_active
    from public.app_portal_strategy_initiatives s where s.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_risks') is not null then
    select count(*) filter (where r.impact in ('major', 'critical') and r.status not in ('resolved', 'archived'))::int
    into v_risks_high
    from public.app_portal_risks r where r.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_decisions') is not null then
    select count(*) filter (where d.status in ('proposed', 'under_review', 'approved'))::int
    into v_decisions_pending
    from public.app_portal_decisions d where d.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_meetings') is not null then
    select count(*)::int into v_meetings_upcoming
    from public.app_portal_meetings m
    where m.company_id = p_company_id
      and m.meeting_at >= now()
      and m.meeting_at <= now() + interval '14 days'
      and m.status in ('scheduled', 'in_progress');
  end if;

  if to_regclass('public.app_portal_follow_ups') is not null then
    select count(*) filter (where f.status in ('open', 'in_progress', 'escalated'))::int
    into v_follow_open
    from public.app_portal_follow_ups f where f.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_momentum_state') is not null
     and to_regprocedure('public._aome297_exec_metrics(uuid)') is not null then
    v_momentum_score := coalesce((
      public._aome297_compute_score(
        public._aome297_exec_metrics(p_company_id),
        public._aome297_build_initiatives(p_company_id),
        true
      )->>'momentum_score'
    )::int, 0);
  end if;

  if to_regprocedure('public._aore298_resilience_metrics(uuid)') is not null then
    v_resilience_score := coalesce((
      public._aore298_compute_scores(
        public._aore298_resilience_metrics(p_company_id),
        public._aore298_build_areas(p_company_id, public._aore298_resilience_metrics(p_company_id)),
        exists(select 1 from public.app_portal_resilience_state rs where rs.company_id = p_company_id and rs.review_started_at is not null)
      )->>'resilience_score'
    )::int, 0);
  end if;

  if to_regclass('public.app_portal_customer_success_milestones') is not null then
    select count(*)::int into v_success_milestones
    from public.app_portal_customer_success_milestones m where m.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_capacity_records') is not null then
    select count(*) filter (where cr.status in ('overloaded', 'requires_review'))::int
    into v_capacity_overloaded
    from public.app_portal_capacity_records cr where cr.company_id = p_company_id;
  end if;

  return jsonb_build_object(
    'commitments_due', v_commit_due,
    'commitments_critical', v_commit_critical,
    'strategy_delayed', v_strategy_delayed,
    'strategy_active', v_strategy_active,
    'risks_high', v_risks_high,
    'decisions_pending', v_decisions_pending,
    'meetings_upcoming', v_meetings_upcoming,
    'follow_ups_open', v_follow_open,
    'momentum_score', v_momentum_score,
    'resilience_score', v_resilience_score,
    'success_milestones', v_success_milestones,
    'capacity_overloaded', v_capacity_overloaded
  );
end;
$$;

create or replace function public._aecc299_build_briefing(p_metrics jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  v_lines jsonb := '[]'::jsonb;
  v_momentum_key text := 'momentumStable';
begin
  if (p_metrics->>'strategy_active')::int > 0 then
    v_lines := v_lines || jsonb_build_object('key', 'strategicInitiativesAttention', 'count', (p_metrics->>'strategy_active')::int);
  end if;
  if (p_metrics->>'commitments_due')::int > 0 then
    v_lines := v_lines || jsonb_build_object('key', 'commitmentsApproaching', 'count', (p_metrics->>'commitments_due')::int);
  end if;
  if (p_metrics->>'risks_high')::int > 0 then
    v_lines := v_lines || jsonb_build_object('key', 'riskShouldReview', 'count', (p_metrics->>'risks_high')::int);
  end if;

  v_momentum_key := case
    when (p_metrics->>'momentum_score')::int >= 65 then 'momentumHealthy'
    when (p_metrics->>'momentum_score')::int >= 40 then 'momentumStable'
    else 'momentumNeedsAttention'
  end;

  return jsonb_build_object(
    'greeting_key', 'goodMorning',
    'lines', v_lines,
    'momentum_summary_key', v_momentum_key,
    'momentum_score', (p_metrics->>'momentum_score')::int
  );
end;
$$;

create or replace function public._aecc299_build_priorities(p_company_id uuid, p_metrics jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  v_items jsonb := '[]'::jsonb;
begin
  if to_regclass('public.app_portal_commitments') is not null then
    v_items := v_items || coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', 'commit-' || c.id, 'title', c.title, 'category', 'critical_commitment',
        'priority', case c.priority when 'critical' then 'immediate_attention' when 'high' then 'important' else 'recommended' end,
        'due_date', c.due_date
      ) order by c.due_date nulls last)
      from public.app_portal_commitments c
      where c.company_id = p_company_id and c.status in ('accepted', 'in_progress', 'at_risk')
      limit 8
    ), '[]'::jsonb);
  end if;

  if to_regclass('public.app_portal_strategy_initiatives') is not null then
    v_items := v_items || coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', 'strategy-' || s.id, 'title', s.title, 'category', 'delayed_initiative',
        'priority', 'important', 'due_date', s.target_date
      ))
      from public.app_portal_strategy_initiatives s
      where s.company_id = p_company_id and s.status in ('delayed', 'needs_attention')
      limit 5
    ), '[]'::jsonb);
  end if;

  if to_regclass('public.app_portal_decisions') is not null then
    v_items := v_items || coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', 'decision-' || d.id, 'title', d.title, 'category', 'high_priority_decision',
        'priority', case d.impact_level when 'critical' then 'immediate_attention' else 'important' end,
        'due_date', null
      ))
      from public.app_portal_decisions d
      where d.company_id = p_company_id and d.status in ('proposed', 'under_review')
      limit 5
    ), '[]'::jsonb);
  end if;

  if to_regclass('public.app_portal_risks') is not null then
    v_items := v_items || coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', 'risk-' || r.id, 'title', r.title, 'category', 'emerging_risk',
        'priority', 'important', 'due_date', r.next_review_date
      ))
      from public.app_portal_risks r
      where r.company_id = p_company_id and r.status in ('identified', 'under_review', 'monitoring')
        and r.impact in ('major', 'critical')
      limit 5
    ), '[]'::jsonb);
  end if;

  return coalesce(v_items, '[]'::jsonb);
end;
$$;

create or replace function public._aecc299_build_meeting_prep(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_meetings jsonb := '[]'::jsonb;
begin
  if to_regclass('public.app_portal_meetings') is not null then
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', m.id,
      'title', m.title,
      'scheduled_at', m.meeting_at,
      'related_commitments', '[]'::jsonb,
      'related_decisions', '[]'::jsonb,
      'related_follow_ups', m.related_follow_up_ids,
      'previous_summary', left(m.notes, 200),
      'preparation_topics', jsonb_build_array('Review open commitments', 'Confirm decision outcomes', 'Address follow-up items')
    ) order by m.meeting_at), '[]'::jsonb)
    into v_meetings
    from public.app_portal_meetings m
    where m.company_id = p_company_id
      and m.meeting_at >= now()
      and m.status in ('scheduled', 'in_progress')
    limit 6;
  end if;
  return v_meetings;
end;
$$;

create or replace function public._aecc299_build_health_snapshot(p_metrics jsonb)
returns jsonb
language plpgsql
stable
as $$
begin
  return jsonb_build_object(
    'strategy_status', case when (p_metrics->>'strategy_delayed')::int > 0 then 'requires_attention' else 'on_track' end,
    'momentum_status', case
      when (p_metrics->>'momentum_score')::int >= 65 then 'healthy'
      when (p_metrics->>'momentum_score')::int >= 40 then 'stable'
      else 'slowing'
    end,
    'resilience_status', case
      when (p_metrics->>'resilience_score')::int >= 65 then 'resilient'
      when (p_metrics->>'resilience_score')::int >= 40 then 'stable'
      else 'vulnerable'
    end,
    'capacity_indicator', case when (p_metrics->>'capacity_overloaded')::int > 0 then 'elevated' else 'balanced' end,
    'risk_indicator', case when (p_metrics->>'risks_high')::int > 0 then 'elevated' else 'moderate' end,
    'success_indicator', case when (p_metrics->>'success_milestones')::int > 0 then 'positive' else 'developing' end,
    'momentum_score', (p_metrics->>'momentum_score')::int,
    'resilience_score', (p_metrics->>'resilience_score')::int
  );
end;
$$;

create or replace function public._aecc299_build_memory(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_memory jsonb := '[]'::jsonb;
begin
  if to_regclass('public.app_portal_decisions') is not null then
    v_memory := v_memory || coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', 'dec-' || d.id, 'type', 'decision', 'title', d.title, 'recorded_at', d.decision_date
      ) order by d.decision_date desc)
      from public.app_portal_decisions d
      where d.company_id = p_company_id and d.status in ('approved', 'implemented', 'evaluated')
      limit 6
    ), '[]'::jsonb);
  end if;

  if to_regclass('public.app_portal_commitments') is not null then
    v_memory := v_memory || coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', 'com-' || c.id, 'type', 'commitment', 'title', c.title, 'recorded_at', c.updated_at
      ) order by c.updated_at desc)
      from public.app_portal_commitments c
      where c.company_id = p_company_id and c.status in ('in_progress', 'fulfilled')
      limit 6
    ), '[]'::jsonb);
  end if;

  return coalesce(v_memory, '[]'::jsonb);
end;
$$;

create or replace function public._aecc299_build_recommendations(p_metrics jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  v_recs jsonb := '[]'::jsonb;
begin
  if (p_metrics->>'strategy_delayed')::int > 0 then
    v_recs := v_recs || jsonb_build_object('id', 'delayed-strategy', 'key', 'reviewDelayedInitiatives', 'priority', 'important');
  end if;
  if (p_metrics->>'follow_ups_open')::int > 0 then
    v_recs := v_recs || jsonb_build_object('id', 'follow-ups', 'key', 'scheduleExecutiveFollowUps', 'priority', 'recommended');
  end if;
  if (p_metrics->>'momentum_score')::int >= 70 then
    v_recs := v_recs || jsonb_build_object('id', 'recognize', 'key', 'recognizeSuccessfulTeams', 'priority', 'informational');
  end if;
  if (p_metrics->>'risks_high')::int > 0 then
    v_recs := v_recs || jsonb_build_object('id', 'risks', 'key', 'revisitUnresolvedRisks', 'priority', 'immediate_attention');
  end if;
  if (p_metrics->>'commitments_due')::int > 0 then
    v_recs := v_recs || jsonb_build_object('id', 'commitments', 'key', 'prepareUpcomingCommitments', 'priority', 'important');
  end if;
  if (p_metrics->>'decisions_pending')::int > 0 then
    v_recs := v_recs || jsonb_build_object('id', 'decisions', 'key', 'reviewDecisionsNearDeadline', 'priority', 'recommended');
  end if;
  return v_recs;
end;
$$;

create or replace function public.begin_app_portal_executive_companion_briefing()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
begin
  v_ctx := public._aecc299_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  insert into public.app_portal_executive_companion_state (
    company_id, briefing_started_at, last_briefing_at, updated_by
  ) values (v_company_id, now(), now(), v_user_id)
  on conflict (company_id) do update set
    briefing_started_at = coalesce(public.app_portal_executive_companion_state.briefing_started_at, now()),
    last_briefing_at = now(),
    updated_by = v_user_id,
    updated_at = now();

  insert into public.app_portal_executive_companion_audit_logs (company_id, event_type, description, performed_by)
  values (v_company_id, 'briefing_generated', 'Executive briefing generated', v_user_id);

  return public.list_app_portal_executive_companion(null, null, null, null, null, null);
end;
$$;

create or replace function public.list_app_portal_executive_companion(
  p_period_from date default null,
  p_priority text default null,
  p_strategic_area text default null,
  p_organizational_area text default null,
  p_focus_category text default null,
  p_search text default null
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
  v_started timestamptz;
  v_can_full boolean;
  v_metrics jsonb;
  v_briefing jsonb;
  v_priorities jsonb;
  v_filtered_priorities jsonb;
  v_recs jsonb;
  v_attention jsonb := '[]'::jsonb;
  v_upcoming jsonb := '[]'::jsonb;
begin
  v_ctx := public._aecc299_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_can_full := coalesce(v_ctx->>'can_full', 'false') = 'true';

  select es.briefing_started_at into v_started
  from public.app_portal_executive_companion_state es where es.company_id = v_company_id;

  v_metrics := public._aecc299_exec_metrics(v_company_id);
  v_briefing := public._aecc299_build_briefing(v_metrics);
  v_priorities := public._aecc299_build_priorities(v_company_id, v_metrics);
  v_recs := public._aecc299_build_recommendations(v_metrics);

  select coalesce(jsonb_agg(p), '[]'::jsonb) into v_attention
  from jsonb_array_elements(v_priorities) p
  where p->>'priority' in ('important', 'immediate_attention');

  select coalesce(jsonb_agg(p), '[]'::jsonb) into v_upcoming
  from jsonb_array_elements(v_priorities) p
  where p->>'due_date' is not null;

  v_filtered_priorities := v_priorities;
  if p_priority is not null or p_focus_category is not null or p_strategic_area is not null
     or (p_search is not null and trim(p_search) <> '') then
    select coalesce(jsonb_agg(p), '[]'::jsonb) into v_filtered_priorities from (
      select p from jsonb_array_elements(v_priorities) p
      where (p_priority is null or p->>'priority' = p_priority)
        and (p_focus_category is null or p->>'category' = p_focus_category)
        and (p_strategic_area is null or p->>'category' ilike '%' || p_strategic_area || '%')
        and (p_search is null or trim(p_search) = '' or p->>'title' ilike '%' || trim(p_search) || '%')
    ) sub;
  end if;

  if p_priority is not null then
    select coalesce(jsonb_agg(r), '[]'::jsonb) into v_recs from (
      select r from jsonb_array_elements(v_recs) r where r->>'priority' = p_priority
    ) sub;
  end if;

  return jsonb_build_object(
    'found', true,
    'can_full', v_can_full,
    'can_limited', coalesce(v_ctx->>'can_limited', 'false') = 'true',
    'briefing_started', v_started is not null,
    'daily_briefing', v_briefing,
    'todays_priorities', v_filtered_priorities,
    'items_requiring_attention', v_attention,
    'upcoming_responsibilities', v_upcoming,
    'strategic_progress', jsonb_build_object(
      'active_initiatives', (v_metrics->>'strategy_active')::int,
      'delayed_initiatives', (v_metrics->>'strategy_delayed')::int
    ),
    'organizational_health', public._aecc299_build_health_snapshot(v_metrics),
    'meeting_preparation', case when v_can_full then public._aecc299_build_meeting_prep(v_company_id) else '[]'::jsonb end,
    'executive_memory', case when v_can_full then public._aecc299_build_memory(v_company_id) else '[]'::jsonb end,
    'recommendations', v_recs,
    'positive_indicators', case when (v_metrics->>'momentum_score')::int >= 65
      then jsonb_build_array('Organizational momentum remains healthy')
      else '[]'::jsonb end,
    'principle', 'Aipify supports leaders through information and recommendations — executives remain responsible for all decisions.'
  );
end;
$$;

create or replace function public.get_app_portal_executive_companion_briefing()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_metrics jsonb;
begin
  v_ctx := public._aecc299_access_context();
  v_metrics := public._aecc299_exec_metrics((v_ctx->>'company_id')::uuid);
  return jsonb_build_object(
    'found', true,
    'briefing', public._aecc299_build_briefing(v_metrics),
    'metrics', v_metrics
  );
end;
$$;

create or replace function public.list_app_portal_executive_companion_recommendations(
  p_priority text default null,
  p_strategic_area text default null,
  p_search text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_recs jsonb;
begin
  v_ctx := public._aecc299_access_context();
  v_recs := public._aecc299_build_recommendations(public._aecc299_exec_metrics((v_ctx->>'company_id')::uuid));

  if p_priority is not null or (p_search is not null and trim(p_search) <> '') then
    select coalesce(jsonb_agg(r), '[]'::jsonb) into v_recs from (
      select r from jsonb_array_elements(v_recs) r
      where (p_priority is null or r->>'priority' = p_priority)
        and (p_search is null or trim(p_search) = '' or r->>'key' ilike '%' || trim(p_search) || '%')
    ) sub;
  end if;

  return jsonb_build_object('found', true, 'recommendations', v_recs);
end;
$$;

create or replace function public.list_app_portal_executive_companion_timeline(
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
  v_ctx jsonb;
  v_company_id uuid;
  v_items jsonb := '[]'::jsonb;
begin
  v_ctx := public._aecc299_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'description', l.description, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_items
  from public.app_portal_executive_companion_audit_logs l
  where l.company_id = v_company_id
    and (p_period_from is null or l.created_at::date >= p_period_from);

  if to_regclass('public.app_portal_meetings') is not null then
    v_items := v_items || coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', 'mtg-' || m.id, 'event_type', 'meeting_completed', 'description', m.title, 'created_at', m.updated_at
      ) order by m.meeting_at desc)
      from public.app_portal_meetings m
      where m.company_id = v_company_id and m.status = 'completed'
        and (p_period_from is null or m.updated_at::date >= p_period_from)
      limit 10
    ), '[]'::jsonb);
  end if;

  if to_regclass('public.app_portal_decisions') is not null then
    v_items := v_items || coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', 'dec-' || d.id, 'event_type', 'decision_recorded', 'description', d.title, 'created_at', d.decision_date
      ) order by d.decision_date desc)
      from public.app_portal_decisions d
      where d.company_id = v_company_id and d.status in ('approved', 'implemented')
        and (p_period_from is null or d.decision_date::date >= p_period_from)
      limit 10
    ), '[]'::jsonb);
  end if;

  if to_regclass('public.app_portal_commitments') is not null then
    v_items := v_items || coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', 'ful-' || c.id, 'event_type', 'commitment_fulfilled', 'description', c.title, 'created_at', c.updated_at
      ) order by c.updated_at desc)
      from public.app_portal_commitments c
      where c.company_id = v_company_id and c.status = 'fulfilled'
        and (p_period_from is null or c.updated_at::date >= p_period_from)
      limit 10
    ), '[]'::jsonb);
  end if;

  return jsonb_build_object('found', true, 'timeline', v_items);
end;
$$;

grant execute on function public.list_app_portal_executive_companion(date, text, text, text, text, text) to authenticated;
grant execute on function public.get_app_portal_executive_companion_briefing() to authenticated;
grant execute on function public.list_app_portal_executive_companion_recommendations(text, text, text) to authenticated;
grant execute on function public.list_app_portal_executive_companion_timeline(date, text) to authenticated;
grant execute on function public.begin_app_portal_executive_companion_briefing() to authenticated;
