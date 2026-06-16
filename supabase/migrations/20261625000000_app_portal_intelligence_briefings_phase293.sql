-- Phase 293 (APP) — Organizational Intelligence Briefing Center

create table if not exists public.app_portal_briefings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  briefing_type text not null check (briefing_type in (
    'daily_briefing', 'weekly_briefing', 'monthly_briefing', 'executive_briefing',
    'operational_briefing', 'strategic_briefing', 'risk_briefing', 'custom_briefing'
  )),
  reporting_period_start date,
  reporting_period_end date,
  generated_at timestamptz not null default now(),
  audience text not null default 'leadership',
  priority_level text not null default 'informational' check (priority_level in (
    'informational', 'important', 'high_priority', 'critical_attention_required'
  )),
  org_status text not null default 'stable' check (org_status in (
    'stable', 'improving', 'requires_attention', 'elevated_risk'
  )),
  executive_summary text not null default '',
  key_insights jsonb not null default '[]'::jsonb,
  risks jsonb not null default '[]'::jsonb,
  opportunities jsonb not null default '[]'::jsonb,
  recommended_actions jsonb not null default '[]'::jsonb,
  related_initiative_ids jsonb not null default '[]'::jsonb,
  related_follow_up_ids jsonb not null default '[]'::jsonb,
  related_commitment_ids jsonb not null default '[]'::jsonb,
  related_decision_ids jsonb not null default '[]'::jsonb,
  notes text not null default '',
  generated_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_portal_briefings_company_idx
  on public.app_portal_briefings (company_id, briefing_type, priority_level, org_status, generated_at desc);

create table if not exists public.app_portal_briefing_audit_logs (
  id uuid primary key default gen_random_uuid(),
  briefing_id uuid references public.app_portal_briefings (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_briefing_audit_idx
  on public.app_portal_briefing_audit_logs (briefing_id, created_at desc);

alter table public.app_portal_briefings enable row level security;
alter table public.app_portal_briefing_audit_logs enable row level security;
revoke all on public.app_portal_briefings from authenticated, anon;
revoke all on public.app_portal_briefing_audit_logs from authenticated, anon;

create or replace function public._aoibc293_access_context()
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
  if v_role not in ('organization_owner', 'organization_admin', 'organization_manager') then
    raise exception 'Intelligence briefing access requires leadership authorization';
  end if;
  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'can_manage', v_role in ('organization_owner', 'organization_admin', 'organization_manager'),
    'is_executive', v_role in ('organization_owner', 'organization_admin', 'organization_manager')
  );
end;
$$;

create or replace function public._aoibc293_row(b public.app_portal_briefings)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', b.id,
    'title', b.title,
    'briefing_type', b.briefing_type,
    'reporting_period_start', b.reporting_period_start,
    'reporting_period_end', b.reporting_period_end,
    'generated_at', b.generated_at,
    'audience', b.audience,
    'priority_level', b.priority_level,
    'org_status', b.org_status,
    'executive_summary', left(b.executive_summary, 500),
    'key_insights', b.key_insights,
    'risks', b.risks,
    'opportunities', b.opportunities,
    'recommended_actions', b.recommended_actions,
    'related_initiative_ids', b.related_initiative_ids,
    'related_follow_up_ids', b.related_follow_up_ids,
    'related_commitment_ids', b.related_commitment_ids,
    'related_decision_ids', b.related_decision_ids,
    'notes', left(b.notes, 300),
    'created_at', b.created_at,
    'updated_at', b.updated_at
  );
$$;

create or replace function public._aoibc293_row_detail(b public.app_portal_briefings)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', b.id,
    'title', b.title,
    'briefing_type', b.briefing_type,
    'reporting_period_start', b.reporting_period_start,
    'reporting_period_end', b.reporting_period_end,
    'generated_at', b.generated_at,
    'audience', b.audience,
    'priority_level', b.priority_level,
    'org_status', b.org_status,
    'executive_summary', b.executive_summary,
    'key_insights', b.key_insights,
    'risks', b.risks,
    'opportunities', b.opportunities,
    'recommended_actions', b.recommended_actions,
    'related_initiative_ids', b.related_initiative_ids,
    'related_follow_up_ids', b.related_follow_up_ids,
    'related_commitment_ids', b.related_commitment_ids,
    'related_decision_ids', b.related_decision_ids,
    'notes', b.notes,
    'created_at', b.created_at,
    'updated_at', b.updated_at
  );
$$;

create or replace function public._aoibc293_build_recommendations(
  p_critical_risks integer,
  p_at_risk_commitments integer,
  p_delayed_initiatives integer,
  p_fulfilled_commitments integer,
  p_bottleneck_count integer
)
returns jsonb
language plpgsql
stable
as $$
declare
  v_recs jsonb := '[]'::jsonb;
begin
  if p_critical_risks > 0 then
    v_recs := v_recs || jsonb_build_object('id', 'strategic-risks', 'key', 'reviewStrategicRisks', 'priority', 'high');
  end if;
  if p_fulfilled_commitments > 0 then
    v_recs := v_recs || jsonb_build_object('id', 'celebrate', 'key', 'celebrateImprovements', 'priority', 'low');
  end if;
  if p_at_risk_commitments > 0 then
    v_recs := v_recs || jsonb_build_object('id', 'commitments', 'key', 'addressCommitments', 'priority', 'high');
  end if;
  if p_delayed_initiatives > 0 then
    v_recs := v_recs || jsonb_build_object('id', 'initiatives', 'key', 'scheduleInitiativeReviews', 'priority', 'medium');
  end if;
  if p_bottleneck_count > 0 then
    v_recs := v_recs || jsonb_build_object('id', 'bottlenecks', 'key', 'operationalBottlenecks', 'priority', 'medium');
  end if;
  if jsonb_array_length(v_recs) = 0 then
    v_recs := v_recs || jsonb_build_object('id', 'focus', 'key', 'reviewStrategicRisks', 'priority', 'low');
  end if;
  return v_recs;
end;
$$;

create or replace function public._aoibc293_period_for_type(p_type text)
returns jsonb
language plpgsql
immutable
as $$
declare
  v_end date := current_date;
  v_start date;
begin
  case p_type
    when 'daily_briefing' then v_start := v_end;
    when 'weekly_briefing' then v_start := v_end - 7;
    when 'monthly_briefing' then v_start := v_end - 30;
    else v_start := v_end - 14;
  end case;
  return jsonb_build_object('start', v_start, 'end', v_end);
end;
$$;

create or replace function public.generate_app_portal_briefing(
  p_briefing_type text default 'executive_briefing',
  p_audience text default 'leadership',
  p_period_start date default null,
  p_period_end date default null,
  p_notes text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_type text := coalesce(nullif(trim(p_briefing_type), ''), 'executive_briefing');
  v_period jsonb;
  v_start date;
  v_end date;
  v_at_risk_commitments integer := 0;
  v_overdue_commitments integer := 0;
  v_fulfilled_commitments integer := 0;
  v_critical_risks integer := 0;
  v_delayed_initiatives integer := 0;
  v_needs_attention_initiatives integer := 0;
  v_bottleneck_count integer := 0;
  v_insights jsonb := '[]'::jsonb;
  v_risks jsonb := '[]'::jsonb;
  v_opportunities jsonb := '[]'::jsonb;
  v_actions jsonb := '[]'::jsonb;
  v_initiative_ids jsonb := '[]'::jsonb;
  v_commitment_ids jsonb := '[]'::jsonb;
  v_decision_ids jsonb := '[]'::jsonb;
  v_follow_up_ids jsonb := '[]'::jsonb;
  v_summary text := '';
  v_org_status text := 'stable';
  v_priority text := 'informational';
  v_title text;
  v_briefing public.app_portal_briefings;
  v_rec record;
begin
  v_ctx := public._aoibc293_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  v_period := public._aoibc293_period_for_type(v_type);
  v_start := coalesce(p_period_start, (v_period->>'start')::date);
  v_end := coalesce(p_period_end, (v_period->>'end')::date);

  if to_regclass('public.app_portal_commitments') is not null then
    select count(*)::int into v_at_risk_commitments
    from public.app_portal_commitments c
    where c.company_id = v_company_id and c.status = 'at_risk';

    select count(*)::int into v_overdue_commitments
    from public.app_portal_commitments c
    where c.company_id = v_company_id
      and c.due_date is not null and c.due_date < current_date
      and c.status not in ('fulfilled', 'cancelled', 'archived');

    select count(*)::int into v_fulfilled_commitments
    from public.app_portal_commitments c
    where c.company_id = v_company_id
      and c.status = 'fulfilled'
      and c.updated_at >= v_start::timestamptz;

    select coalesce(jsonb_agg(c.id::text), '[]'::jsonb) into v_commitment_ids
    from (
      select id from public.app_portal_commitments
      where company_id = v_company_id and status in ('at_risk', 'in_progress')
      order by updated_at desc limit 5
    ) c;
  end if;

  if to_regclass('public.app_portal_risks') is not null then
    select count(*)::int into v_critical_risks
    from public.app_portal_risks r
    where r.company_id = v_company_id
      and r.status not in ('resolved', 'archived')
      and (r.impact = 'critical' or (r.likelihood = 'very_high' and r.impact in ('major', 'critical')));

    for v_rec in
      select r.id, r.title from public.app_portal_risks r
      where r.company_id = v_company_id
        and r.status not in ('resolved', 'archived')
        and (r.impact in ('major', 'critical') or r.likelihood in ('high', 'very_high'))
      order by r.updated_at desc limit 5
    loop
      v_risks := v_risks || jsonb_build_object('id', v_rec.id::text, 'text', v_rec.title);
    end loop;
  end if;

  if to_regclass('public.app_portal_strategy_initiatives') is not null then
    select count(*)::int into v_delayed_initiatives
    from public.app_portal_strategy_initiatives s
    where s.company_id = v_company_id and s.status = 'delayed';

    select count(*)::int into v_needs_attention_initiatives
    from public.app_portal_strategy_initiatives s
    where s.company_id = v_company_id and s.status = 'needs_attention';

    select coalesce(jsonb_agg(s.id::text), '[]'::jsonb) into v_initiative_ids
    from (
      select id from public.app_portal_strategy_initiatives
      where company_id = v_company_id and status in ('needs_attention', 'delayed', 'active')
      order by updated_at desc limit 5
    ) s;
  end if;

  if to_regclass('public.app_portal_prioritization_items') is not null then
    select count(*)::int into v_bottleneck_count
    from public.app_portal_prioritization_items p
    where p.company_id = v_company_id
      and p.priority_status in ('deferred', 'under_evaluation')
      and p.urgency_score >= 4;
  end if;

  if v_critical_risks > 0 or v_at_risk_commitments > 2 then
    v_org_status := 'elevated_risk';
    v_priority := 'critical_attention_required';
  elsif v_delayed_initiatives > 0 or v_needs_attention_initiatives > 0 or v_overdue_commitments > 0 then
    v_org_status := 'requires_attention';
    v_priority := 'high_priority';
  elsif v_fulfilled_commitments > 0 then
    v_org_status := 'improving';
    v_priority := 'important';
  else
    v_org_status := 'stable';
    v_priority := 'informational';
  end if;

  v_insights := v_insights || jsonb_build_object(
    'id', 'status-1',
    'text', case v_org_status
      when 'stable' then 'Organizational status remains stable.'
      when 'improving' then 'Recent organizational improvements have been observed.'
      when 'requires_attention' then 'Several areas require leadership attention.'
      else 'Elevated organizational risk indicators have been identified.'
    end
  );

  if v_needs_attention_initiatives + v_delayed_initiatives > 0 then
    v_insights := v_insights || jsonb_build_object(
      'id', 'initiatives-1',
      'text', (v_needs_attention_initiatives + v_delayed_initiatives)::text || ' strategic initiative(s) require attention.'
    );
  end if;

  if v_fulfilled_commitments > 0 then
    v_insights := v_insights || jsonb_build_object(
      'id', 'fulfilled-1',
      'text', 'Commitment follow-through has improved during this reporting period.'
    );
    v_opportunities := v_opportunities || jsonb_build_object(
      'id', 'celebrate-1',
      'text', 'Celebrate recent improvements in commitment fulfillment.'
    );
  end if;

  if v_critical_risks > 0 then
    v_insights := v_insights || jsonb_build_object(
      'id', 'risk-1',
      'text', v_critical_risks::text || ' critical risk(s) require executive review.'
    );
  end if;

  if v_bottleneck_count > 0 then
    v_insights := v_insights || jsonb_build_object(
      'id', 'bottleneck-1',
      'text', 'Operational bottlenecks have been identified in prioritization records.'
    );
    v_opportunities := v_opportunities || jsonb_build_object(
      'id', 'collab-1',
      'text', 'Cross-team collaboration may reduce operational bottlenecks.'
    );
  end if;

  if jsonb_array_length(v_insights) = 1 then
    v_insights := v_insights || jsonb_build_object('id', 'focus-1', 'text', 'Recommended focus areas have been identified.');
  end if;

  v_actions := public._aoibc293_build_recommendations(
    v_critical_risks, v_at_risk_commitments, v_delayed_initiatives,
    v_fulfilled_commitments, v_bottleneck_count
  );

  v_summary := (
    select string_agg(i->>'text', E'\n')
    from jsonb_array_elements(v_insights) i
    limit 5
  );

  v_title := initcap(replace(v_type, '_', ' ')) || ' — ' || to_char(current_date, 'Mon DD, YYYY');

  insert into public.app_portal_briefings (
    company_id, title, briefing_type, reporting_period_start, reporting_period_end,
    audience, priority_level, org_status, executive_summary,
    key_insights, risks, opportunities, recommended_actions,
    related_initiative_ids, related_commitment_ids, related_decision_ids,
    related_follow_up_ids, notes, generated_by
  ) values (
    v_company_id, v_title, v_type, v_start, v_end,
    coalesce(nullif(trim(p_audience), ''), 'leadership'),
    v_priority, v_org_status, coalesce(v_summary, 'Organizational briefing generated.'),
    v_insights, v_risks, v_opportunities, v_actions,
    v_initiative_ids, v_commitment_ids, v_decision_ids, v_follow_up_ids,
    left(coalesce(p_notes, ''), 2000), v_user_id
  ) returning * into v_briefing;

  insert into public.app_portal_briefing_audit_logs (briefing_id, company_id, event_type, description, performed_by, metadata)
  values (v_briefing.id, v_company_id, 'generated', 'Executive briefing generated', v_user_id,
    jsonb_build_object('briefing_type', v_type, 'org_status', v_org_status));

  return jsonb_build_object(
    'generated', true,
    'briefing', public._aoibc293_row_detail(v_briefing)
  );
end;
$$;

create or replace function public.list_app_portal_briefings(
  p_briefing_type text default null,
  p_priority_level text default null,
  p_period_from date default null,
  p_period_to date default null,
  p_audience text default null,
  p_org_status text default null,
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
  v_latest jsonb;
  v_previous jsonb := '[]'::jsonb;
  v_priority_items jsonb := '[]'::jsonb;
  v_opportunities jsonb := '[]'::jsonb;
  v_risks jsonb := '[]'::jsonb;
  v_actions jsonb := '[]'::jsonb;
  v_recs jsonb := '[]'::jsonb;
begin
  v_ctx := public._aoibc293_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(public._aoibc293_row(b) order by b.generated_at desc), '[]'::jsonb)
  into v_items
  from public.app_portal_briefings b
  where b.company_id = v_company_id
    and (p_briefing_type is null or b.briefing_type = p_briefing_type)
    and (p_priority_level is null or b.priority_level = p_priority_level)
    and (p_period_from is null or b.reporting_period_end >= p_period_from)
    and (p_period_to is null or b.reporting_period_start <= p_period_to)
    and (p_audience is null or trim(p_audience) = '' or b.audience ilike '%' || trim(p_audience) || '%')
    and (p_org_status is null or b.org_status = p_org_status)
    and (
      p_search is null or trim(p_search) = ''
      or b.title ilike '%' || trim(p_search) || '%'
      or b.executive_summary ilike '%' || trim(p_search) || '%'
      or b.notes ilike '%' || trim(p_search) || '%'
    );

  select public._aoibc293_row(b) into v_latest
  from public.app_portal_briefings b
  where b.company_id = v_company_id
  order by b.generated_at desc limit 1;

  select coalesce(jsonb_agg(public._aoibc293_row(b) order by b.generated_at desc), '[]'::jsonb)
  into v_previous
  from (
    select * from public.app_portal_briefings
    where company_id = v_company_id
    order by generated_at desc offset 1 limit 5
  ) b;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'title', b.title, 'priority_level', b.priority_level, 'org_status', b.org_status
  ) order by b.generated_at desc), '[]'::jsonb)
  into v_priority_items
  from public.app_portal_briefings b
  where b.company_id = v_company_id
    and b.priority_level in ('high_priority', 'critical_attention_required')
  limit 5;

  select coalesce(jsonb_agg(o), '[]'::jsonb) into v_opportunities
  from (
    select jsonb_array_elements(b.opportunities) as o
    from public.app_portal_briefings b
    where b.company_id = v_company_id
    order by b.generated_at desc limit 3
  ) sub;

  select coalesce(jsonb_agg(r), '[]'::jsonb) into v_risks
  from (
    select jsonb_array_elements(b.risks) as r
    from public.app_portal_briefings b
    where b.company_id = v_company_id
    order by b.generated_at desc limit 3
  ) sub;

  select coalesce(jsonb_agg(a), '[]'::jsonb) into v_actions
  from (
    select jsonb_array_elements(b.recommended_actions) as a
    from public.app_portal_briefings b
    where b.company_id = v_company_id
    order by b.generated_at desc limit 1
  ) sub;

  v_recs := public._aoibc293_build_recommendations(0, 0, 0, 0, 0);

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'items', v_items,
    'dashboard', jsonb_build_object(
      'latest_briefing', v_latest,
      'previous_briefings', v_previous,
      'priority_items', v_priority_items,
      'emerging_opportunities', v_opportunities,
      'emerging_risks', v_risks,
      'recommended_next_actions', v_actions
    ),
    'recommendations', v_recs,
    'principle', 'Executive briefings help leaders focus on what matters most — decision support, not autonomous decision-making.'
  );
end;
$$;

create or replace function public.get_app_portal_briefing(p_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_b public.app_portal_briefings;
  v_initiatives jsonb := '[]'::jsonb;
  v_commitments jsonb := '[]'::jsonb;
  v_decisions jsonb := '[]'::jsonb;
  v_follow_ups jsonb := '[]'::jsonb;
  v_timeline jsonb := '[]'::jsonb;
begin
  v_ctx := public._aoibc293_access_context();
  select * into v_b from public.app_portal_briefings where id = p_id;
  if v_b.id is null then return jsonb_build_object('found', false); end if;
  if v_b.company_id <> (v_ctx->>'company_id')::uuid then
    raise exception 'Briefing access denied';
  end if;

  if to_regclass('public.app_portal_strategy_initiatives') is not null
     and jsonb_array_length(coalesce(v_b.related_initiative_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', s.id, 'title', s.title, 'status', s.status)), '[]'::jsonb)
    into v_initiatives from public.app_portal_strategy_initiatives s
    where s.id in (select t.value::uuid from jsonb_array_elements_text(v_b.related_initiative_ids) as t(value));
  end if;

  if to_regclass('public.app_portal_commitments') is not null
     and jsonb_array_length(coalesce(v_b.related_commitment_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', c.id, 'title', c.title, 'status', c.status)), '[]'::jsonb)
    into v_commitments from public.app_portal_commitments c
    where c.id in (select t.value::uuid from jsonb_array_elements_text(v_b.related_commitment_ids) as t(value));
  end if;

  if to_regclass('public.app_portal_meeting_decisions') is not null
     and jsonb_array_length(coalesce(v_b.related_decision_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', d.id, 'title', d.title, 'status', 'recorded')), '[]'::jsonb)
    into v_decisions from public.app_portal_meeting_decisions d
    where d.id in (select t.value::uuid from jsonb_array_elements_text(v_b.related_decision_ids) as t(value));
  end if;

  if to_regclass('public.app_portal_follow_ups') is not null
     and jsonb_array_length(coalesce(v_b.related_follow_up_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', f.id, 'title', f.title, 'status', f.status)), '[]'::jsonb)
    into v_follow_ups from public.app_portal_follow_ups f
    where f.id in (select t.value::uuid from jsonb_array_elements_text(v_b.related_follow_up_ids) as t(value));
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'description', l.description, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_timeline
  from public.app_portal_briefing_audit_logs l where l.briefing_id = p_id;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'briefing', public._aoibc293_row_detail(v_b),
    'related_initiatives', v_initiatives,
    'related_commitments', v_commitments,
    'related_decisions', v_decisions,
    'related_follow_ups', v_follow_ups,
    'activity_timeline', v_timeline,
    'recommendations', v_b.recommended_actions,
    'principle', 'Aipify supports leaders through insights and recommendations — people remain responsible for decisions.'
  );
end;
$$;

grant execute on function public.list_app_portal_briefings(text, text, date, date, text, text, text) to authenticated;
grant execute on function public.get_app_portal_briefing(uuid) to authenticated;
grant execute on function public.generate_app_portal_briefing(text, text, date, date, text) to authenticated;
