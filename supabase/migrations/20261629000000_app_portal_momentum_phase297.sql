-- Phase 297 (APP) — Organizational Momentum & Execution Engine

create table if not exists public.app_portal_momentum_state (
  company_id uuid primary key references public.companies (id) on delete cascade,
  review_started_at timestamptz,
  last_momentum_score integer,
  last_snapshot_at timestamptz,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.users (id) on delete set null
);

create table if not exists public.app_portal_momentum_audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_momentum_audit_idx
  on public.app_portal_momentum_audit_logs (company_id, created_at desc);

alter table public.app_portal_momentum_state enable row level security;
alter table public.app_portal_momentum_audit_logs enable row level security;
revoke all on public.app_portal_momentum_state from authenticated, anon;
revoke all on public.app_portal_momentum_audit_logs from authenticated, anon;

create or replace function public._aome297_access_context()
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
begin
  v_access := public._apsf260_require_app_access();
  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_role := v_access->>'organization_role';
  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'can_manage', v_role in ('organization_owner', 'organization_admin', 'organization_manager'),
    'can_admin', v_role in ('organization_owner', 'organization_admin'),
    'is_member', v_role in ('organization_owner', 'organization_admin', 'organization_manager', 'organization_member')
  );
end;
$$;

create or replace function public._aome297_exec_metrics(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_goals_active integer := 0;
  v_goals_at_risk integer := 0;
  v_goals_avg_progress integer := 0;
  v_follow_open integer := 0;
  v_follow_completed integer := 0;
  v_commit_active integer := 0;
  v_commit_at_risk integer := 0;
  v_commit_avg_progress integer := 0;
  v_decisions_pending integer := 0;
  v_decisions_implemented integer := 0;
  v_strategy_active integer := 0;
  v_strategy_delayed integer := 0;
  v_strategy_avg_progress integer := 0;
  v_meeting_actions_open integer := 0;
  v_meeting_actions_done integer := 0;
  v_learning_items integer := 0;
  v_success_active integer := 0;
begin
  if to_regclass('public.app_portal_goals') is not null then
    select count(*) filter (where g.status in ('active', 'on_track', 'at_risk'))::int,
           count(*) filter (where g.status = 'at_risk')::int,
           coalesce(round(avg(g.progress_percent) filter (where g.status in ('active', 'on_track', 'at_risk')))::int, 0)
    into v_goals_active, v_goals_at_risk, v_goals_avg_progress
    from public.app_portal_goals g where g.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_follow_ups') is not null then
    select count(*) filter (where f.status in ('open', 'in_progress', 'waiting', 'escalated'))::int,
           count(*) filter (where f.status = 'completed')::int
    into v_follow_open, v_follow_completed
    from public.app_portal_follow_ups f where f.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_commitments') is not null then
    select count(*) filter (where c.status in ('accepted', 'in_progress', 'at_risk'))::int,
           count(*) filter (where c.status = 'at_risk')::int,
           coalesce(round(avg(c.progress_percent) filter (where c.status in ('accepted', 'in_progress', 'at_risk')))::int, 0)
    into v_commit_active, v_commit_at_risk, v_commit_avg_progress
    from public.app_portal_commitments c where c.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_decisions') is not null then
    select count(*) filter (where d.status in ('proposed', 'under_review', 'approved'))::int,
           count(*) filter (where d.status in ('implemented', 'evaluated'))::int
    into v_decisions_pending, v_decisions_implemented
    from public.app_portal_decisions d where d.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_strategy_initiatives') is not null then
    select count(*) filter (where s.status in ('active', 'on_track', 'needs_attention'))::int,
           count(*) filter (where s.status = 'delayed')::int,
           coalesce(round(avg(s.progress_percent) filter (where s.status in ('active', 'on_track', 'needs_attention', 'delayed')))::int, 0)
    into v_strategy_active, v_strategy_delayed, v_strategy_avg_progress
    from public.app_portal_strategy_initiatives s where s.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_meeting_action_items') is not null then
    select count(*) filter (where a.status in ('open', 'in_progress'))::int,
           count(*) filter (where a.status = 'completed')::int
    into v_meeting_actions_open, v_meeting_actions_done
    from public.app_portal_meeting_action_items a
    join public.app_portal_meetings m on m.id = a.meeting_id
    where m.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_learning_improvements') is not null then
    select count(*)::int into v_learning_items
    from public.app_portal_learning_improvements li where li.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_success_value_initiatives') is not null then
    select count(*) filter (where sv.status in ('active', 'in_progress'))::int into v_success_active
    from public.app_portal_success_value_initiatives sv where sv.company_id = p_company_id;
  end if;

  return jsonb_build_object(
    'goals_active', v_goals_active,
    'goals_at_risk', v_goals_at_risk,
    'goals_avg_progress', v_goals_avg_progress,
    'follow_open', v_follow_open,
    'follow_completed', v_follow_completed,
    'commit_active', v_commit_active,
    'commit_at_risk', v_commit_at_risk,
    'commit_avg_progress', v_commit_avg_progress,
    'decisions_pending', v_decisions_pending,
    'decisions_implemented', v_decisions_implemented,
    'strategy_active', v_strategy_active,
    'strategy_delayed', v_strategy_delayed,
    'strategy_avg_progress', v_strategy_avg_progress,
    'meeting_actions_open', v_meeting_actions_open,
    'meeting_actions_done', v_meeting_actions_done,
    'learning_items', v_learning_items,
    'success_active', v_success_active
  );
end;
$$;

create or replace function public._aome297_item_status(
  p_progress integer,
  p_status text,
  p_days_since_update integer
)
returns text
language plpgsql
immutable
as $$
begin
  if p_status in ('delayed', 'at_risk', 'escalated', 'needs_attention') or p_days_since_update > 30 then
    return 'stalled';
  end if;
  if p_progress >= 75 and p_days_since_update <= 14 then return 'accelerating'; end if;
  if p_progress >= 50 and p_days_since_update <= 21 then return 'healthy'; end if;
  if p_progress >= 25 or p_days_since_update <= 14 then return 'stable'; end if;
  if p_days_since_update > 14 then return 'slowing'; end if;
  return 'stable';
end;
$$;

create or replace function public._aome297_item_trend(p_progress integer, p_recent_activity integer)
returns text
language plpgsql
immutable
as $$
begin
  if p_recent_activity >= 3 or p_progress >= 60 then return 'improving'; end if;
  if p_recent_activity = 0 and p_progress < 30 then return 'declining'; end if;
  return 'stable';
end;
$$;

create or replace function public._aome297_build_initiatives(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_items jsonb := '[]'::jsonb;
begin
  if to_regclass('public.app_portal_goals') is not null then
    v_items := v_items || coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', 'goal-' || g.id,
        'title', g.title,
        'initiative_owner', coalesce((select u.full_name from public.users u where u.id = g.owner_id), 'Unassigned'),
        'owner_id', g.owner_id,
        'source_type', 'goal',
        'momentum_status', public._aome297_item_status(g.progress_percent, g.status, extract(day from now() - g.updated_at)::int),
        'trend_direction', public._aome297_item_trend(g.progress_percent, (
          select count(*)::int from public.app_portal_goal_progress_updates pu where pu.goal_id = g.id and pu.created_at > now() - interval '30 days'
        )),
        'progress_percent', g.progress_percent,
        'recent_activity_count', (
          select count(*)::int from public.app_portal_goal_progress_updates pu where pu.goal_id = g.id and pu.created_at > now() - interval '30 days'
        ),
        'blockers_identified', case when g.status = 'at_risk' then jsonb_build_array('Goal marked at risk') else '[]'::jsonb end,
        'next_milestone', coalesce(g.target_date::text, ''),
        'related_goals', jsonb_build_array(g.id::text),
        'related_follow_ups', g.related_follow_up_ids,
        'related_decisions', '[]'::jsonb,
        'notes', left(g.description, 200),
        'team', 'Operations'
      ))
      from public.app_portal_goals g
      where g.company_id = p_company_id and g.status in ('active', 'on_track', 'at_risk')
    ), '[]'::jsonb);
  end if;

  if to_regclass('public.app_portal_commitments') is not null then
    v_items := v_items || coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', 'commit-' || c.id,
        'title', c.title,
        'initiative_owner', coalesce((select u.full_name from public.users u where u.id = c.owner_id), 'Unassigned'),
        'owner_id', c.owner_id,
        'source_type', 'commitment',
        'momentum_status', public._aome297_item_status(c.progress_percent, c.status, extract(day from now() - c.updated_at)::int),
        'trend_direction', public._aome297_item_trend(c.progress_percent, (
          select count(*)::int from public.app_portal_commitment_progress cp where cp.commitment_id = c.id and cp.created_at > now() - interval '30 days'
        )),
        'progress_percent', c.progress_percent,
        'recent_activity_count', (
          select count(*)::int from public.app_portal_commitment_progress cp where cp.commitment_id = c.id and cp.created_at > now() - interval '30 days'
        ),
        'blockers_identified', case when c.obstacles_identified <> '' then jsonb_build_array(left(c.obstacles_identified, 120)) else '[]'::jsonb end,
        'next_milestone', coalesce(c.due_date::text, ''),
        'related_goals', c.related_goal_ids,
        'related_follow_ups', c.related_follow_up_ids,
        'related_decisions', c.related_decision_ids,
        'notes', left(c.notes, 200),
        'team', 'Commitments'
      ))
      from public.app_portal_commitments c
      where c.company_id = p_company_id and c.status in ('accepted', 'in_progress', 'at_risk')
    ), '[]'::jsonb);
  end if;

  if to_regclass('public.app_portal_strategy_initiatives') is not null then
    v_items := v_items || coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', 'strategy-' || s.id,
        'title', s.title,
        'initiative_owner', coalesce((select u.full_name from public.users u where u.id = s.initiative_owner_id), 'Unassigned'),
        'owner_id', s.initiative_owner_id,
        'source_type', 'strategy',
        'momentum_status', public._aome297_item_status(s.progress_percent, s.status, extract(day from now() - s.updated_at)::int),
        'trend_direction', public._aome297_item_trend(s.progress_percent, 1),
        'progress_percent', s.progress_percent,
        'recent_activity_count', 1,
        'blockers_identified', case when s.status in ('delayed', 'needs_attention') then jsonb_build_array('Strategic initiative requires attention') else '[]'::jsonb end,
        'next_milestone', coalesce(s.target_date::text, ''),
        'related_goals', s.related_goal_ids,
        'related_follow_ups', s.related_follow_up_ids,
        'related_decisions', s.related_decision_ids,
        'notes', left(s.notes, 200),
        'team', 'Strategy'
      ))
      from public.app_portal_strategy_initiatives s
      where s.company_id = p_company_id and s.status in ('active', 'on_track', 'needs_attention', 'delayed')
    ), '[]'::jsonb);
  end if;

  if to_regclass('public.app_portal_follow_ups') is not null then
    v_items := v_items || coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', 'follow-' || f.id,
        'title', f.title,
        'initiative_owner', coalesce((select u.full_name from public.users u where u.id = f.assigned_owner_id), 'Unassigned'),
        'owner_id', f.assigned_owner_id,
        'source_type', 'follow_up',
        'momentum_status', case when f.status = 'escalated' then 'stalled' when f.status = 'waiting' then 'slowing' else 'stable' end,
        'trend_direction', case when f.status = 'completed' then 'improving' when f.status = 'escalated' then 'declining' else 'stable' end,
        'progress_percent', case f.status when 'completed' then 100 when 'in_progress' then 50 else 25 end,
        'recent_activity_count', case when f.updated_at > now() - interval '14 days' then 1 else 0 end,
        'blockers_identified', case when f.status = 'waiting' then jsonb_build_array('Waiting on external response') else '[]'::jsonb end,
        'next_milestone', coalesce(f.due_at::text, ''),
        'related_goals', '[]'::jsonb,
        'related_follow_ups', jsonb_build_array(f.id::text),
        'related_decisions', '[]'::jsonb,
        'notes', left(f.notes, 200),
        'team', 'Follow-ups'
      ))
      from public.app_portal_follow_ups f
      where f.company_id = p_company_id and f.status in ('open', 'in_progress', 'waiting', 'escalated')
      limit 20
    ), '[]'::jsonb);
  end if;

  return coalesce(v_items, '[]'::jsonb);
end;
$$;

create or replace function public._aome297_compute_score(p_metrics jsonb, p_initiatives jsonb, p_review_started boolean)
returns jsonb
language plpgsql
immutable
as $$
declare
  v_score integer := 0;
  v_total integer := 0;
  v_accel integer := 0;
  v_stalled integer := 0;
  v_item jsonb;
  v_status text;
begin
  if not p_review_started then
    return jsonb_build_object('momentum_score', 0, 'execution_trend', 'stable');
  end if;

  for v_item in select * from jsonb_array_elements(p_initiatives) loop
    v_total := v_total + 1;
    v_status := v_item->>'momentum_status';
    if v_status = 'accelerating' then v_accel := v_accel + 1; v_score := v_score + 100;
    elsif v_status = 'healthy' then v_score := v_score + 85;
    elsif v_status = 'stable' then v_score := v_score + 65;
    elsif v_status = 'slowing' then v_score := v_score + 40;
    else v_stalled := v_stalled + 1; v_score := v_score + 15;
    end if;
  end loop;

  if v_total = 0 then
    v_score := least(100, 30
      + (p_metrics->>'goals_avg_progress')::int / 5
      + (p_metrics->>'commit_avg_progress')::int / 5
      + least(20, (p_metrics->>'follow_completed')::int * 2));
  else
    v_score := round(v_score::numeric / v_total)::int;
  end if;

  return jsonb_build_object(
    'momentum_score', least(100, greatest(0, v_score)),
    'execution_trend', case
      when v_accel > v_stalled then 'improving'
      when v_stalled > v_accel then 'declining'
      else 'stable'
    end,
    'high_momentum_count', v_accel,
    'stalled_count', v_stalled
  );
end;
$$;

create or replace function public._aome297_build_bottlenecks(p_metrics jsonb, p_initiatives jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  v_items jsonb := '[]'::jsonb;
  v_stalled integer := 0;
  v_no_owner integer := 0;
begin
  select count(*)::int into v_stalled
  from jsonb_array_elements(p_initiatives) i
  where i->>'momentum_status' in ('stalled', 'slowing');

  select count(*)::int into v_no_owner
  from jsonb_array_elements(p_initiatives) i
  where i->>'initiative_owner' = 'Unassigned';

  if (p_metrics->>'decisions_pending')::int > 3 then
    v_items := v_items || jsonb_build_object('id', 'approval-delays', 'key', 'approvalDelays', 'severity', 'important');
  end if;
  if (p_metrics->>'commit_at_risk')::int + (p_metrics->>'goals_at_risk')::int > 0 then
    v_items := v_items || jsonb_build_object('id', 'resource-constraints', 'key', 'resourceConstraints', 'severity', 'important');
  end if;
  if v_no_owner > 0 then
    v_items := v_items || jsonb_build_object('id', 'missing-ownership', 'key', 'missingOwnership', 'severity', 'immediate_attention');
  end if;
  if (p_metrics->>'follow_open')::int > (p_metrics->>'follow_completed')::int then
    v_items := v_items || jsonb_build_object('id', 'follow-up-gap', 'key', 'lackOfFollowUp', 'severity', 'recommended');
  end if;
  if (p_metrics->>'strategy_delayed')::int > 0 then
    v_items := v_items || jsonb_build_object('id', 'dependencies', 'key', 'dependenciesUnresolved', 'severity', 'important');
  end if;
  if v_stalled >= 2 then
    v_items := v_items || jsonb_build_object('id', 'conflicting-priorities', 'key', 'conflictingPriorities', 'severity', 'recommended');
  end if;

  return v_items;
end;
$$;

create or replace function public._aome297_build_recommendations(p_metrics jsonb, p_initiatives jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  v_recs jsonb := '[]'::jsonb;
  v_stalled integer := 0;
  v_accel integer := 0;
begin
  select count(*) filter (where i->>'momentum_status' = 'stalled')::int,
         count(*) filter (where i->>'momentum_status' = 'accelerating')::int
  into v_stalled, v_accel
  from jsonb_array_elements(p_initiatives) i;

  if v_stalled > 0 then
    v_recs := v_recs || jsonb_build_object('id', 'review-stalled', 'key', 'reviewStalledInitiatives', 'priority', 'immediate_attention');
  end if;
  if (p_metrics->>'commit_at_risk')::int + (p_metrics->>'goals_at_risk')::int > 0 then
    v_recs := v_recs || jsonb_build_object('id', 'escalate-blockers', 'key', 'escalateUnresolvedBlockers', 'priority', 'important');
  end if;
  if v_accel > 0 then
    v_recs := v_recs || jsonb_build_object('id', 'celebrate-teams', 'key', 'celebrateHighPerformingTeams', 'priority', 'opportunity');
  end if;
  if exists (select 1 from jsonb_array_elements(p_initiatives) i where i->>'initiative_owner' = 'Unassigned') then
    v_recs := v_recs || jsonb_build_object('id', 'clarify-ownership', 'key', 'clarifyOwnership', 'priority', 'important');
  end if;
  if v_stalled >= 2 then
    v_recs := v_recs || jsonb_build_object('id', 'reduce-priorities', 'key', 'reduceCompetingPriorities', 'priority', 'recommended');
  end if;
  if (p_metrics->>'strategy_delayed')::int > 0 or (p_metrics->>'commit_at_risk')::int > 0 then
    v_recs := v_recs || jsonb_build_object('id', 'review-capacity', 'key', 'reviewCapacityAssumptions', 'priority', 'recommended');
  end if;

  return v_recs;
end;
$$;

create or replace function public.begin_app_portal_momentum_review()
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
  v_initiatives jsonb;
  v_scores jsonb;
begin
  v_ctx := public._aome297_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_metrics := public._aome297_exec_metrics(v_company_id);
  v_initiatives := public._aome297_build_initiatives(v_company_id);
  v_scores := public._aome297_compute_score(v_metrics, v_initiatives, true);

  insert into public.app_portal_momentum_state (
    company_id, review_started_at, last_momentum_score, last_snapshot_at, updated_by
  ) values (
    v_company_id, now(), (v_scores->>'momentum_score')::int, now(), v_user_id
  )
  on conflict (company_id) do update set
    review_started_at = coalesce(public.app_portal_momentum_state.review_started_at, now()),
    last_momentum_score = (v_scores->>'momentum_score')::int,
    last_snapshot_at = now(),
    updated_by = v_user_id,
    updated_at = now();

  insert into public.app_portal_momentum_audit_logs (company_id, event_type, description, performed_by)
  values (v_company_id, 'review_started', 'Execution momentum review initiated', v_user_id);

  return public.list_app_portal_momentum(null, null, null, null, null, null, null);
end;
$$;

create or replace function public.list_app_portal_momentum(
  p_momentum_status text default null,
  p_team text default null,
  p_owner text default null,
  p_trend text default null,
  p_priority text default null,
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
  v_user_id uuid;
  v_started timestamptz;
  v_prior_score integer;
  v_metrics jsonb;
  v_initiatives jsonb;
  v_filtered jsonb;
  v_scores jsonb;
  v_recs jsonb;
  v_bottlenecks jsonb;
  v_high jsonb := '[]'::jsonb;
  v_slowing jsonb := '[]'::jsonb;
  v_stalled jsonb := '[]'::jsonb;
  v_teams jsonb := '[]'::jsonb;
  v_positive jsonb := '[]'::jsonb;
  v_personal jsonb := '[]'::jsonb;
  v_org_status text;
begin
  v_ctx := public._aome297_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  select ms.review_started_at, ms.last_momentum_score
  into v_started, v_prior_score
  from public.app_portal_momentum_state ms where ms.company_id = v_company_id;

  v_metrics := public._aome297_exec_metrics(v_company_id);
  v_initiatives := public._aome297_build_initiatives(v_company_id);
  v_scores := public._aome297_compute_score(v_metrics, v_initiatives, v_started is not null);
  v_recs := public._aome297_build_recommendations(v_metrics, v_initiatives);
  v_bottlenecks := public._aome297_build_bottlenecks(v_metrics, v_initiatives);

  select coalesce(jsonb_agg(i order by (i->>'progress_percent')::int desc), '[]'::jsonb) into v_high
  from jsonb_array_elements(v_initiatives) i where i->>'momentum_status' in ('accelerating', 'healthy');

  select coalesce(jsonb_agg(i), '[]'::jsonb) into v_slowing
  from jsonb_array_elements(v_initiatives) i where i->>'momentum_status' = 'slowing';

  select coalesce(jsonb_agg(i), '[]'::jsonb) into v_stalled
  from jsonb_array_elements(v_initiatives) i where i->>'momentum_status' = 'stalled';

  select coalesce(jsonb_agg(distinct i->>'team'), '[]'::jsonb) into v_teams
  from jsonb_array_elements(v_initiatives) i where i->>'momentum_status' in ('stalled', 'slowing');

  select coalesce(jsonb_agg(i->>'title'), '[]'::jsonb) into v_positive
  from jsonb_array_elements(v_initiatives) i where i->>'momentum_status' = 'accelerating' limit 5;

  v_filtered := v_initiatives;
  if p_momentum_status is not null or p_team is not null or p_owner is not null or p_trend is not null
     or (p_search is not null and trim(p_search) <> '') then
    select coalesce(jsonb_agg(i), '[]'::jsonb) into v_filtered from (
      select i from jsonb_array_elements(v_initiatives) i
      where (p_momentum_status is null or i->>'momentum_status' = p_momentum_status)
        and (p_team is null or i->>'team' ilike '%' || p_team || '%')
        and (p_owner is null or i->>'initiative_owner' ilike '%' || p_owner || '%')
        and (p_trend is null or i->>'trend_direction' = p_trend)
        and (p_search is null or trim(p_search) = ''
          or i->>'title' ilike '%' || trim(p_search) || '%'
          or i->>'notes' ilike '%' || trim(p_search) || '%')
    ) sub;
  end if;

  if p_priority is not null then
    select coalesce(jsonb_agg(r), '[]'::jsonb) into v_recs from (
      select r from jsonb_array_elements(v_recs) r where r->>'priority' = p_priority
    ) sub;
  end if;

  v_org_status := case
    when (v_scores->>'momentum_score')::int >= 80 then 'accelerating'
    when (v_scores->>'momentum_score')::int >= 65 then 'healthy'
    when (v_scores->>'momentum_score')::int >= 45 then 'stable'
    when (v_scores->>'momentum_score')::int >= 25 then 'slowing'
    else 'stalled'
  end;

  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    select coalesce(jsonb_agg(i), '[]'::jsonb) into v_personal
    from jsonb_array_elements(v_initiatives) i
    where (i->>'owner_id')::uuid = v_user_id;
    v_filtered := v_personal;
    v_high := '[]'::jsonb;
    v_slowing := '[]'::jsonb;
    v_stalled := '[]'::jsonb;
    v_teams := '[]'::jsonb;
  end if;

  if v_started is not null then
    update public.app_portal_momentum_state set
      last_momentum_score = (v_scores->>'momentum_score')::int,
      last_snapshot_at = now()
    where company_id = v_company_id;
  end if;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_admin', coalesce(v_ctx->>'can_admin', 'false') = 'true',
    'review_started', v_started is not null,
    'organizational_momentum_score', (v_scores->>'momentum_score')::int,
    'execution_trend', v_scores->>'execution_trend',
    'organizational_momentum_status', v_org_status,
    'high_momentum_initiatives', v_high,
    'slowing_initiatives', v_slowing,
    'stalled_initiatives', v_stalled,
    'teams_requiring_attention', v_teams,
    'positive_momentum_signals', v_positive,
    'initiatives', v_filtered,
    'recommendations', v_recs,
    'bottlenecks', v_bottlenecks,
    'personal_initiatives', v_personal,
    'execution_signals', jsonb_build_object(
      'goal_progress', (v_metrics->>'goals_avg_progress')::int,
      'follow_up_completion', case when ((v_metrics->>'follow_open')::int + (v_metrics->>'follow_completed')::int) > 0
        then round((v_metrics->>'follow_completed')::numeric / ((v_metrics->>'follow_open')::int + (v_metrics->>'follow_completed')::int) * 100)::int else 0 end,
      'commitment_fulfillment', (v_metrics->>'commit_avg_progress')::int,
      'decision_implementation', (v_metrics->>'decisions_implemented')::int,
      'strategic_movement', (v_metrics->>'strategy_avg_progress')::int,
      'learning_implementation', (v_metrics->>'learning_items')::int,
      'meeting_action_completion', case when ((v_metrics->>'meeting_actions_open')::int + (v_metrics->>'meeting_actions_done')::int) > 0
        then round((v_metrics->>'meeting_actions_done')::numeric / ((v_metrics->>'meeting_actions_open')::int + (v_metrics->>'meeting_actions_done')::int) * 100)::int else 0 end,
      'success_initiative_progress', (v_metrics->>'success_active')::int
    ),
    'principle', 'Momentum indicators remain informational. Aipify provides insights — leaders and teams remain responsible for execution.'
  );
end;
$$;

create or replace function public.list_app_portal_momentum_timeline(
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
  v_ctx := public._aome297_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'description', l.description, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_items
  from public.app_portal_momentum_audit_logs l
  where l.company_id = v_company_id
    and (p_period_from is null or l.created_at::date >= p_period_from);

  if to_regclass('public.app_portal_goal_progress_updates') is not null then
    v_items := v_items || coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', 'gpu-' || pu.id, 'event_type', 'progress_change', 'description', coalesce(pu.milestone_title, 'Goal progress update'), 'created_at', pu.created_at
      ) order by pu.created_at desc)
      from public.app_portal_goal_progress_updates pu
      where pu.company_id = v_company_id
        and (p_period_from is null or pu.created_at::date >= p_period_from)
      limit 15
    ), '[]'::jsonb);
  end if;

  if to_regclass('public.app_portal_commitment_progress') is not null then
    v_items := v_items || coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', 'cp-' || cp.id, 'event_type', 'momentum_shift', 'description', left(cp.progress_update, 120), 'created_at', cp.created_at
      ) order by cp.created_at desc)
      from public.app_portal_commitment_progress cp
      where cp.company_id = v_company_id
        and (p_period_from is null or cp.created_at::date >= p_period_from)
      limit 15
    ), '[]'::jsonb);
  end if;

  if to_regclass('public.app_portal_strategy_milestones') is not null then
    v_items := v_items || coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', 'sm-' || sm.id, 'event_type', 'milestone_completed', 'description', sm.title, 'created_at', sm.updated_at
      ) order by sm.updated_at desc)
      from public.app_portal_strategy_milestones sm
      where sm.company_id = v_company_id and sm.status = 'completed'
        and (p_period_from is null or sm.updated_at::date >= p_period_from)
      limit 10
    ), '[]'::jsonb);
  end if;

  return jsonb_build_object('found', true, 'timeline', v_items);
end;
$$;

create or replace function public.list_app_portal_momentum_recommendations(
  p_priority text default null,
  p_momentum_status text default null,
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
  v_metrics jsonb;
  v_initiatives jsonb;
  v_recs jsonb;
begin
  v_ctx := public._aome297_access_context();
  v_metrics := public._aome297_exec_metrics((v_ctx->>'company_id')::uuid);
  v_initiatives := public._aome297_build_initiatives((v_ctx->>'company_id')::uuid);
  v_recs := public._aome297_build_recommendations(v_metrics, v_initiatives);

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

create or replace function public.get_app_portal_momentum_bottlenecks(
  p_team text default null,
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
  v_metrics jsonb;
  v_initiatives jsonb;
  v_bottlenecks jsonb;
begin
  v_ctx := public._aome297_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_metrics := public._aome297_exec_metrics(v_company_id);
  v_initiatives := public._aome297_build_initiatives(v_company_id);
  v_bottlenecks := public._aome297_build_bottlenecks(v_metrics, v_initiatives);

  if p_search is not null and trim(p_search) <> '' then
    select coalesce(jsonb_agg(b), '[]'::jsonb) into v_bottlenecks from (
      select b from jsonb_array_elements(v_bottlenecks) b
      where b->>'key' ilike '%' || trim(p_search) || '%'
    ) sub;
  end if;

  return jsonb_build_object('found', true, 'bottlenecks', v_bottlenecks, 'metrics', v_metrics);
end;
$$;

grant execute on function public.list_app_portal_momentum(text, text, text, text, text, date, text) to authenticated;
grant execute on function public.list_app_portal_momentum_timeline(date, text) to authenticated;
grant execute on function public.list_app_portal_momentum_recommendations(text, text, text) to authenticated;
grant execute on function public.get_app_portal_momentum_bottlenecks(text, text) to authenticated;
grant execute on function public.begin_app_portal_momentum_review() to authenticated;
