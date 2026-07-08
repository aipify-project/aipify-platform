-- Phase Airbnb 37 — Aipify Hosts Review & Reputation Center Foundation
-- Feature owner: CUSTOMER APP. Helpers: _ahostrep_* (engine), _ahostbp399_* (blueprint)

alter table public.aipify_hosts_notifications drop constraint if exists aipify_hosts_notifications_category_check;
alter table public.aipify_hosts_notifications add constraint aipify_hosts_notifications_category_check check (
  category in (
    'guest_requests', 'arrivals', 'departures', 'cleaning_updates', 'maintenance_updates',
    'incidents', 'approvals', 'financial_events', 'team_events', 'booking_updates', 'reputation_updates'
  )
);

create table if not exists public.aipify_hosts_reputation_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  default_section text not null default 'review_overview' check (
    default_section in (
      'review_overview', 'property_reviews', 'review_trends',
      'improvement_opportunities', 'recovery_actions'
    )
  ),
  metadata jsonb not null default '{"metadata_only":true,"role_governed":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_reputation_center_settings enable row level security;
revoke all on public.aipify_hosts_reputation_center_settings from authenticated, anon;

create table if not exists public.aipify_hosts_property_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  review_key text not null,
  guest_name text,
  stay_start date not null,
  stay_end date not null,
  overall_rating numeric(3, 2) not null check (overall_rating >= 1 and overall_rating <= 5),
  review_date date not null default current_date,
  review_status text not null default 'new' check (
    review_status in ('new', 'reviewed', 'action_required', 'closed')
  ),
  guest_summary text,
  category_scores jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);
create index if not exists aipify_hosts_property_reviews_tenant_idx
  on public.aipify_hosts_property_reviews (tenant_id, review_status, review_date desc);
alter table public.aipify_hosts_property_reviews enable row level security;
revoke all on public.aipify_hosts_property_reviews from authenticated, anon;

create table if not exists public.aipify_hosts_reputation_recovery_cases (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  case_key text not null,
  review_id uuid references public.aipify_hosts_property_reviews (id) on delete set null,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  action_type text not null check (
    action_type in (
      'create_task', 'assign_owner', 'schedule_inspection', 'open_incident', 'document_resolution'
    )
  ),
  assigned_owner text,
  due_date date,
  case_status text not null default 'open' check (
    case_status in ('open', 'in_progress', 'resolved', 'overdue')
  ),
  resolution_notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, case_key)
);
create index if not exists aipify_hosts_reputation_recovery_cases_tenant_idx
  on public.aipify_hosts_reputation_recovery_cases (tenant_id, case_status, due_date);
alter table public.aipify_hosts_reputation_recovery_cases enable row level security;
revoke all on public.aipify_hosts_reputation_recovery_cases from authenticated, anon;

create table if not exists public.aipify_hosts_reputation_center_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_reputation_center_events_tenant_idx
  on public.aipify_hosts_reputation_center_events (tenant_id, created_at desc);
alter table public.aipify_hosts_reputation_center_events enable row level security;
revoke all on public.aipify_hosts_reputation_center_events from authenticated, anon;

create or replace function public._ahostrep_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_reputation_center_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_hosts_reputation_center_settings;
begin
  insert into public.aipify_hosts_reputation_center_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_hosts_reputation_center_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ahostrep_log_event(
  p_tenant_id uuid, p_event_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_hosts_reputation_center_events (tenant_id, event_type, summary, context)
  values (p_tenant_id, p_event_type, p_summary, p_context) returning id into v_id;
  perform public._ahost_log_audit(p_tenant_id, 'reputation_' || p_event_type, p_summary, p_context);
  return v_id;
end; $$;

create or replace function public._ahostrep_push_notification(
  p_tenant_id uuid, p_key text, p_priority text, p_title text, p_message text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_hosts_notifications (
    tenant_id, notification_key, category, priority, notification_status, title, message, requires_attention
  ) values (
    p_tenant_id, p_key, 'reputation_updates', p_priority, 'unread', p_title, p_message,
    p_priority in ('high', 'critical')
  ) on conflict (tenant_id, notification_key) do update set
    priority = excluded.priority, title = excluded.title, message = excluded.message,
    requires_attention = excluded.requires_attention, notification_status = 'unread', updated_at = now();
exception when undefined_table then null;
end; $$;

create or replace function public._ahostbp399_positioning() returns text language sql immutable as $$
  select 'Monitor and improve hospitality reputation — review overview, trends, improvement opportunities, and recovery actions across all properties.'; $$;

create or replace function public._ahostbp399_sections() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'review_overview', 'label', 'Review Overview'),
    jsonb_build_object('key', 'property_reviews', 'label', 'Property Reviews'),
    jsonb_build_object('key', 'review_trends', 'label', 'Review Trends'),
    jsonb_build_object('key', 'improvement_opportunities', 'label', 'Improvement Opportunities'),
    jsonb_build_object('key', 'recovery_actions', 'label', 'Recovery Actions')
  ); $$;

create or replace function public._ahostbp399_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'cleanliness', 'communication', 'check_in_experience', 'accuracy',
    'value', 'location', 'guest_experience'
  ); $$;

create or replace function public._ahostrep_property_reputation_status(p_avg numeric)
returns text language sql immutable as $$
  select case
    when p_avg is null or p_avg = 0 then 'unknown'
    when p_avg < 3.5 then 'critical'
    when p_avg < 4.0 then 'attention'
    when p_avg < 4.5 then 'good'
    else 'excellent'
  end; $$;

create or replace function public._ahostrep_review_row(
  p_r public.aipify_hosts_property_reviews, p_property text
) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_r.id,
    'review_key', p_r.review_key,
    'property_id', p_r.property_id,
    'property', coalesce(p_property, '—'),
    'guest_name', coalesce(p_r.guest_name, ''),
    'stay_period', p_r.stay_start::text || ' — ' || p_r.stay_end::text,
    'stay_start', p_r.stay_start::text,
    'stay_end', p_r.stay_end::text,
    'overall_rating', p_r.overall_rating,
    'review_date', p_r.review_date::text,
    'review_status', p_r.review_status,
    'guest_summary', coalesce(p_r.guest_summary, ''),
    'category_scores', p_r.category_scores
  ); $$;

create or replace function public._ahostrep_recovery_row(
  p_c public.aipify_hosts_reputation_recovery_cases, p_property text
) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_c.id,
    'case_key', p_c.case_key,
    'review_id', p_c.review_id,
    'property_id', p_c.property_id,
    'property', coalesce(p_property, '—'),
    'action_type', p_c.action_type,
    'assigned_owner', coalesce(p_c.assigned_owner, ''),
    'due_date', coalesce(p_c.due_date::text, ''),
    'case_status', p_c.case_status,
    'resolution_notes', coalesce(p_c.resolution_notes, ''),
    'is_overdue', p_c.due_date is not null and p_c.due_date < current_date
      and p_c.case_status not in ('resolved')
  ); $$;

create or replace function public._ahostrep_dashboard_stats(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_avg numeric;
  v_attention int;
  v_top jsonb;
  v_open_cases int;
begin
  select round(avg(overall_rating)::numeric, 2) into v_avg
  from public.aipify_hosts_property_reviews where tenant_id = p_tenant_id;

  select count(distinct property_id)::int into v_attention
  from public.aipify_hosts_property_reviews r
  where r.tenant_id = p_tenant_id and r.property_id is not null
    and public._ahostrep_property_reputation_status((
      select avg(overall_rating) from public.aipify_hosts_property_reviews r2
      where r2.tenant_id = p_tenant_id and r2.property_id = r.property_id
    )) in ('critical', 'attention');

  select coalesce(jsonb_agg(jsonb_build_object(
    'property_id', p.id, 'property', p.display_name,
    'avg_rating', round(sub.avg_rating::numeric, 2),
    'review_count', sub.cnt
  ) order by sub.avg_rating desc), '[]'::jsonb) into v_top
  from (
    select property_id, avg(overall_rating) avg_rating, count(*)::int cnt
    from public.aipify_hosts_property_reviews
    where tenant_id = p_tenant_id and property_id is not null
    group by property_id
    order by avg(overall_rating) desc
    limit 5
  ) sub
  join public.aipify_hosts_properties p on p.id = sub.property_id;

  select count(*)::int into v_open_cases
  from public.aipify_hosts_reputation_recovery_cases
  where tenant_id = p_tenant_id and case_status not in ('resolved');

  return jsonb_build_object(
    'average_rating', coalesce(v_avg, 0),
    'properties_requiring_attention', coalesce(v_attention, 0),
    'top_performing_properties', coalesce(v_top, '[]'::jsonb),
    'open_recovery_cases', coalesce(v_open_cases, 0),
    'new_reviews', (
      select count(*)::int from public.aipify_hosts_property_reviews
      where tenant_id = p_tenant_id and review_status = 'new'
    ),
    'action_required_reviews', (
      select count(*)::int from public.aipify_hosts_property_reviews
      where tenant_id = p_tenant_id and review_status = 'action_required'
    )
  );
end; $$;

create or replace function public._ahostrep_rating_trends(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with months as (
    select generate_series(
      date_trunc('month', current_date - interval '5 months'),
      date_trunc('month', current_date),
      interval '1 month'
    ) as m
  ),
  monthly as (
    select
      m.m,
      round(coalesce(avg(r.overall_rating), 0)::numeric, 2) as avg_rating,
      count(r.id)::int as review_count
    from months m
    left join public.aipify_hosts_property_reviews r
      on r.tenant_id = p_tenant_id
      and date_trunc('month', r.review_date) = m.m
    group by m.m
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'month', to_char(m, 'YYYY-MM'),
    'avg_rating', avg_rating,
    'review_count', review_count
  ) order by m), '[]'::jsonb)
  from monthly; $$;

create or replace function public._ahostrep_category_trends(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_result jsonb := '{}'::jsonb;
  v_cat text;
  v_cats text[] := array[
    'cleanliness', 'communication', 'check_in_experience', 'accuracy',
    'value', 'location', 'guest_experience'
  ];
begin
  foreach v_cat in array v_cats loop
    v_result := v_result || jsonb_build_object(v_cat, coalesce((
      with months as (
        select generate_series(
          date_trunc('month', current_date - interval '5 months'),
          date_trunc('month', current_date),
          interval '1 month'
        ) as m
      ),
      monthly as (
        select
          m.m,
          round(coalesce(avg((r.category_scores->>v_cat)::numeric), 0)::numeric, 2) as avg_rating
        from months m
        left join public.aipify_hosts_property_reviews r
          on r.tenant_id = p_tenant_id
          and date_trunc('month', r.review_date) = m.m
          and r.category_scores ? v_cat
        group by m.m
      )
      select jsonb_agg(jsonb_build_object(
        'month', to_char(m, 'YYYY-MM'),
        'avg_rating', avg_rating
      ) order by m)
      from monthly
    ), '[]'::jsonb));
  end loop;
  return v_result;
end; $$;

create or replace function public._ahostrep_property_comparisons(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'property_id', property_id,
    'property', display_name,
    'avg_rating', avg_rating,
    'review_count', review_count,
    'reputation_status', public._ahostrep_property_reputation_status(avg_rating_raw)
  ) order by avg_rating_raw desc), '[]'::jsonb)
  from (
    select
      p.id as property_id,
      p.display_name as display_name,
      round(avg(r.overall_rating)::numeric, 2) as avg_rating,
      avg(r.overall_rating) as avg_rating_raw,
      count(r.id)::int as review_count
    from public.aipify_hosts_property_reviews r
    join public.aipify_hosts_properties p on p.id = r.property_id
    where r.tenant_id = p_tenant_id and r.property_id is not null
    group by p.id, p.display_name
  ) sub; $$;

create or replace function public._ahostrep_improvement_opportunities(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_items jsonb := '[]'::jsonb;
  v_cat text;
  v_cats text[] := array[
    'cleanliness', 'communication', 'check_in_experience', 'accuracy',
    'value', 'location', 'guest_experience'
  ];
begin
  foreach v_cat in array v_cats loop
    if exists (
      select 1 from public.aipify_hosts_property_reviews r
      where r.tenant_id = p_tenant_id
        and r.review_date >= current_date - 90
        and (r.category_scores->>v_cat)::numeric < 3.5
      group by r.property_id having count(*) >= 2
    ) then
      v_items := v_items || jsonb_build_array(jsonb_build_object(
        'type', 'repeated_complaints',
        'category', v_cat,
        'label', 'Repeated complaints — ' || replace(v_cat, '_', ' '),
        'severity', 'high'
      ));
    end if;

    if (
      select coalesce(avg((category_scores->>v_cat)::numeric), 5)
      from public.aipify_hosts_property_reviews
      where tenant_id = p_tenant_id and review_date >= date_trunc('month', current_date)
        and category_scores ? v_cat
    ) < (
      select coalesce(avg((category_scores->>v_cat)::numeric), 5)
      from public.aipify_hosts_property_reviews
      where tenant_id = p_tenant_id
        and review_date >= date_trunc('month', current_date - interval '1 month')
        and review_date < date_trunc('month', current_date)
        and category_scores ? v_cat
    ) - 0.3 then
      v_items := v_items || jsonb_build_array(jsonb_build_object(
        'type', 'declining_category',
        'category', v_cat,
        'label', 'Declining category — ' || replace(v_cat, '_', ' '),
        'severity', 'medium'
      ));
    end if;
  end loop;

  v_items := v_items || coalesce((
    select jsonb_agg(jsonb_build_object(
      'type', 'operational_weakness',
      'category', cat,
      'label', 'Operational weakness — ' || replace(cat, '_', ' '),
      'severity', 'medium',
      'avg_rating', round(avg_val::numeric, 2)
    ))
    from (
      select key cat, avg((category_scores->>key)::numeric) avg_val
      from public.aipify_hosts_property_reviews r,
        lateral jsonb_object_keys(r.category_scores) key
      where r.tenant_id = p_tenant_id
      group by key having avg((category_scores->>key)::numeric) < 4.0
    ) w
  ), '[]'::jsonb);

  v_items := v_items || coalesce((
    select jsonb_agg(jsonb_build_object(
      'type', 'property_trend',
      'property_id', sub.property_id,
      'property', p.display_name,
      'label', 'Property trend declining — ' || p.display_name,
      'severity', 'high',
      'current_avg', round(sub.recent_avg::numeric, 2),
      'prior_avg', round(sub.prior_avg::numeric, 2)
    ))
    from (
      select property_id,
        avg(case when review_date >= current_date - 30 then overall_rating end) recent_avg,
        avg(case when review_date >= current_date - 60 and review_date < current_date - 30 then overall_rating end) prior_avg
      from public.aipify_hosts_property_reviews
      where tenant_id = p_tenant_id and property_id is not null
      group by property_id
      having avg(case when review_date >= current_date - 30 then overall_rating end)
        < avg(case when review_date >= current_date - 60 and review_date < current_date - 30 then overall_rating end) - 0.3
    ) sub
    join public.aipify_hosts_properties p on p.id = sub.property_id
  ), '[]'::jsonb);

  return v_items;
end; $$;

create or replace function public._ahostrep_check_notifications(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_prop record;
  v_cat text;
  v_case record;
begin
  for v_prop in
    select p.id, p.display_name, avg(r.overall_rating) avg_rating
    from public.aipify_hosts_properties p
    join public.aipify_hosts_property_reviews r on r.property_id = p.id and r.tenant_id = p_tenant_id
    where p.tenant_id = p_tenant_id
    group by p.id, p.display_name
    having avg(case when r.review_date >= current_date - 30 then r.overall_rating end)
      < avg(case when r.review_date >= current_date - 60 and r.review_date < current_date - 30 then r.overall_rating end) - 0.5
  loop
    perform public._ahostrep_push_notification(
      p_tenant_id, 'rep_decline_' || v_prop.id, 'high',
      'Significant rating decline',
      v_prop.display_name || ' — average rating declined over the last 30 days.'
    );
  end loop;

  for v_cat in
    select key from (
      select key, count(*) cnt
      from public.aipify_hosts_property_reviews r,
        lateral jsonb_object_keys(r.category_scores) key
      where r.tenant_id = p_tenant_id and r.review_date >= current_date - 30
        and (r.category_scores->>key)::numeric < 3.5
      group by key having count(*) >= 3
    ) c
  loop
    perform public._ahostrep_push_notification(
      p_tenant_id, 'rep_complaints_' || v_cat, 'high',
      'Multiple complaints in same category',
      replace(v_cat, '_', ' ') || ' — multiple low ratings in the last 30 days.'
    );
  end loop;

  for v_case in
    select c.id, c.case_key from public.aipify_hosts_reputation_recovery_cases c
    where c.tenant_id = p_tenant_id and c.due_date < current_date and c.case_status not in ('resolved')
  loop
    perform public._ahostrep_push_notification(
      p_tenant_id, 'rep_overdue_' || v_case.id, 'high',
      'Recovery case overdue', v_case.case_key || ' — recovery action is overdue.'
    );
  end loop;

  for v_prop in
    select p.id, p.display_name, avg(r.overall_rating) avg_rating
    from public.aipify_hosts_properties p
    join public.aipify_hosts_property_reviews r on r.property_id = p.id
    where p.tenant_id = p_tenant_id
    group by p.id, p.display_name
    having public._ahostrep_property_reputation_status(avg(r.overall_rating)) = 'critical'
  loop
    perform public._ahostrep_push_notification(
      p_tenant_id, 'rep_critical_' || v_prop.id, 'critical',
      'Critical reputation status',
      v_prop.display_name || ' has entered critical reputation status.'
    );
  end loop;
end; $$;

create or replace function public._ahostrep_seed_demo(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_prop uuid;
begin
  if exists (select 1 from public.aipify_hosts_property_reviews where tenant_id = p_tenant_id limit 1) then return; end if;

  select id into v_prop from public.aipify_hosts_properties
  where tenant_id = p_tenant_id and status = 'active' order by created_at limit 1;

  insert into public.aipify_hosts_property_reviews (
    tenant_id, property_id, review_key, guest_name, stay_start, stay_end,
    overall_rating, review_date, review_status, guest_summary, category_scores
  ) values
    (p_tenant_id, v_prop, 'REV-2026-001', 'Anna Lindstrom',
      current_date - 10, current_date - 7, 4.8, current_date - 6, 'reviewed',
      'Wonderful stay — spotless and welcoming.',
      '{"cleanliness":5,"communication":5,"check_in_experience":4.5,"accuracy":5,"value":4.5,"location":5,"guest_experience":5}'::jsonb),
    (p_tenant_id, v_prop, 'REV-2026-002', 'James O''Connor',
      current_date - 20, current_date - 15, 3.2, current_date - 14, 'action_required',
      'Check-in instructions were unclear. Cleanliness below expectations.',
      '{"cleanliness":2.5,"communication":3,"check_in_experience":2,"accuracy":4,"value":3.5,"location":4.5,"guest_experience":3}'::jsonb),
    (p_tenant_id, v_prop, 'REV-2026-003', 'Sofia Hansen',
      current_date - 45, current_date - 40, 4.5, current_date - 38, 'closed',
      'Great location and value. Minor communication delay.',
      '{"cleanliness":4.5,"communication":4,"check_in_experience":4.5,"accuracy":5,"value":4.5,"location":5,"guest_experience":4.5}'::jsonb),
    (p_tenant_id, v_prop, 'REV-2026-004', 'Erik Berg',
      current_date - 5, current_date - 2, 4.0, current_date - 1, 'new',
      'Solid stay — would return with minor improvements to check-in.',
      '{"cleanliness":4,"communication":3.5,"check_in_experience":3.5,"accuracy":4.5,"value":4,"location":4.5,"guest_experience":4}'::jsonb)
  on conflict (tenant_id, review_key) do nothing;

  insert into public.aipify_hosts_reputation_recovery_cases (
    tenant_id, case_key, review_id, property_id, action_type,
    assigned_owner, due_date, case_status, resolution_notes
  )
  select
    p_tenant_id, 'REC-2026-001', r.id, r.property_id, 'schedule_inspection',
    'Property Manager', current_date + 3, 'in_progress', null
  from public.aipify_hosts_property_reviews r
  where r.tenant_id = p_tenant_id and r.review_key = 'REV-2026-002'
  on conflict (tenant_id, case_key) do nothing;

  insert into public.aipify_hosts_reputation_recovery_cases (
    tenant_id, case_key, review_id, property_id, action_type,
    assigned_owner, due_date, case_status, resolution_notes
  )
  select
    p_tenant_id, 'REC-2026-002', r.id, r.property_id, 'create_task',
    'Operations Lead', current_date - 2, 'open', null
  from public.aipify_hosts_property_reviews r
  where r.tenant_id = p_tenant_id and r.review_key = 'REV-2026-002'
  on conflict (tenant_id, case_key) do nothing;
end; $$;

create or replace function public.get_aipify_hosts_reputation_center_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_hosts public.aipify_hosts_settings; v_stats jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  perform public._ahostrep_ensure_settings(v_tenant_id);
  v_stats := public._ahostrep_dashboard_stats(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true, 'enabled', v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'average_rating', v_stats->'average_rating',
    'properties_requiring_attention', v_stats->'properties_requiring_attention',
    'open_recovery_cases', v_stats->'open_recovery_cases',
    'philosophy', public._ahostbp399_positioning()
  );
end; $$;

create or replace function public.get_aipify_hosts_reputation_center_dashboard(
  p_section text default 'review_overview',
  p_property_id uuid default null,
  p_category text default null,
  p_status text default null,
  p_date_from date default null,
  p_date_to date default null,
  p_org_id uuid default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_rc public.aipify_hosts_reputation_center_settings;
  v_hosts public.aipify_hosts_settings;
  v_section text := coalesce(nullif(trim(p_section), ''), 'review_overview');
  v_reviews jsonb := '[]'::jsonb;
  v_recovery jsonb := '[]'::jsonb;
  v_trends jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_rc := public._ahostrep_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  perform public._ahostrep_seed_demo(v_tenant_id);
  perform public._ahostrep_check_notifications(v_tenant_id);

  select coalesce(jsonb_agg(
    public._ahostrep_review_row(r, p.display_name) order by r.review_date desc
  ), '[]'::jsonb) into v_reviews
  from public.aipify_hosts_property_reviews r
  left join public.aipify_hosts_properties p on p.id = r.property_id
  where r.tenant_id = v_tenant_id
    and (p_property_id is null or r.property_id = p_property_id)
    and (p_status is null or r.review_status = p_status)
    and (p_date_from is null or r.review_date >= p_date_from)
    and (p_date_to is null or r.review_date <= p_date_to)
    and (p_category is null or r.category_scores ? p_category);

  select coalesce(jsonb_agg(
    public._ahostrep_recovery_row(c, p.display_name) order by c.created_at desc
  ), '[]'::jsonb) into v_recovery
  from public.aipify_hosts_reputation_recovery_cases c
  left join public.aipify_hosts_properties p on p.id = c.property_id
  where c.tenant_id = v_tenant_id
    and (p_property_id is null or c.property_id = p_property_id);

  v_trends := jsonb_build_object(
    'rating_trends', public._ahostrep_rating_trends(v_tenant_id),
    'category_trends', public._ahostrep_category_trends(v_tenant_id),
    'property_comparisons', public._ahostrep_property_comparisons(v_tenant_id),
    'monthly_performance', public._ahostrep_rating_trends(v_tenant_id)
  );

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_rc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'active_section', v_section,
    'positioning', public._ahostbp399_positioning(),
    'governance', jsonb_build_object(
      'role_permissions', true,
      'audit_recovery_actions', true,
      'audit_review_status_changes', true,
      'audit_resolution_records', true
    ),
    'sections', public._ahostbp399_sections(),
    'review_statuses', jsonb_build_array('new', 'reviewed', 'action_required', 'closed'),
    'review_categories', public._ahostbp399_categories(),
    'stats', public._ahostrep_dashboard_stats(v_tenant_id),
    'properties', (
      select coalesce(jsonb_agg(jsonb_build_object('id', p.id, 'display_name', p.display_name) order by p.display_name), '[]'::jsonb)
      from public.aipify_hosts_properties p
      where p.tenant_id = v_tenant_id and p.status <> 'archived'
    ),
    'reviews', case when v_section in ('review_overview', 'property_reviews') then v_reviews else '[]'::jsonb end,
    'trends', case when v_section in ('review_overview', 'review_trends') then v_trends else null end,
    'improvement_opportunities', case when v_section in ('review_overview', 'improvement_opportunities')
      then public._ahostrep_improvement_opportunities(v_tenant_id) else '[]'::jsonb end,
    'recovery_cases', case when v_section in ('review_overview', 'recovery_actions') then v_recovery else '[]'::jsonb end,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 37 — Review & Reputation Center Foundation',
      'doc', 'aipify-hosts/PHASE_AIRBNB_37_REPUTATION_CENTER.text',
      'route', '/app/aipify-hosts/reputation'
    )
  );
end; $$;

create or replace function public.perform_aipify_hosts_reputation_action(
  p_action_type text,
  p_review_id uuid default null,
  p_recovery_id uuid default null,
  p_status text default null,
  p_owner text default null,
  p_notes text default null,
  p_due_date date default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_review public.aipify_hosts_property_reviews;
  v_recovery public.aipify_hosts_reputation_recovery_cases;
  v_old_status text;
  v_summary text;
  v_case_key text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;

  if p_review_id is not null then
    select * into v_review from public.aipify_hosts_property_reviews
    where id = p_review_id and tenant_id = v_tenant_id;
    if v_review.id is null then raise exception 'Review not found'; end if;
    v_old_status := v_review.review_status;
  end if;

  if p_recovery_id is not null then
    select * into v_recovery from public.aipify_hosts_reputation_recovery_cases
    where id = p_recovery_id and tenant_id = v_tenant_id;
    if v_recovery.id is null then raise exception 'Recovery case not found'; end if;
  end if;

  if p_action_type = 'update_review_status' and p_review_id is not null then
    update public.aipify_hosts_property_reviews set
      review_status = coalesce(p_status, review_status), updated_at = now()
    where id = p_review_id and tenant_id = v_tenant_id;
    perform public._ahostrep_log_event(v_tenant_id, 'review_status_changed', 'Review status updated',
      jsonb_build_object('review_id', p_review_id, 'from', v_old_status, 'to', p_status));
    v_summary := 'Review status updated';

  elsif p_action_type in ('create_task', 'assign_owner', 'schedule_inspection', 'open_incident', 'document_resolution')
    and p_review_id is not null then
    v_case_key := 'REC-' || to_char(now(), 'YYYYMMDD') || '-' || substr(gen_random_uuid()::text, 1, 8);
    insert into public.aipify_hosts_reputation_recovery_cases (
      tenant_id, case_key, review_id, property_id, action_type,
      assigned_owner, due_date, case_status, resolution_notes
    ) values (
      v_tenant_id, v_case_key, p_review_id, v_review.property_id, p_action_type,
      p_owner, coalesce(p_due_date, current_date + 7),
      case when p_action_type = 'document_resolution' then 'resolved' else 'open' end,
      p_notes
    );
    if p_action_type <> 'document_resolution' then
      update public.aipify_hosts_property_reviews set review_status = 'action_required', updated_at = now()
      where id = p_review_id and tenant_id = v_tenant_id;
    end if;
    perform public._ahostrep_log_event(v_tenant_id, 'recovery_action_created', 'Recovery action created',
      jsonb_build_object('review_id', p_review_id, 'action_type', p_action_type, 'case_key', v_case_key));
    v_summary := 'Recovery action created';

  elsif p_action_type = 'assign_recovery_owner' and p_recovery_id is not null then
    update public.aipify_hosts_reputation_recovery_cases set
      assigned_owner = coalesce(p_owner, assigned_owner),
      case_status = case when case_status = 'open' then 'in_progress' else case_status end,
      updated_at = now()
    where id = p_recovery_id and tenant_id = v_tenant_id;
    perform public._ahostrep_log_event(v_tenant_id, 'recovery_owner_assigned', 'Recovery owner assigned',
      jsonb_build_object('recovery_id', p_recovery_id, 'owner', p_owner));
    v_summary := 'Recovery owner assigned';

  elsif p_action_type = 'document_resolution' and p_recovery_id is not null then
    update public.aipify_hosts_reputation_recovery_cases set
      resolution_notes = coalesce(p_notes, resolution_notes),
      case_status = 'resolved', updated_at = now()
    where id = p_recovery_id and tenant_id = v_tenant_id;
    if v_recovery.review_id is not null then
      update public.aipify_hosts_property_reviews set review_status = 'closed', updated_at = now()
      where id = v_recovery.review_id and tenant_id = v_tenant_id;
    end if;
    perform public._ahostrep_log_event(v_tenant_id, 'resolution_documented', 'Resolution documented',
      jsonb_build_object('recovery_id', p_recovery_id, 'notes', p_notes));
    v_summary := 'Resolution documented';

  elsif p_action_type = 'close_recovery_case' and p_recovery_id is not null then
    update public.aipify_hosts_reputation_recovery_cases set
      case_status = 'resolved', updated_at = now()
    where id = p_recovery_id and tenant_id = v_tenant_id;
    perform public._ahostrep_log_event(v_tenant_id, 'recovery_case_closed', 'Recovery case closed',
      jsonb_build_object('recovery_id', p_recovery_id));
    v_summary := 'Recovery case closed';

  else
    raise exception 'Invalid action type';
  end if;

  perform public._ahostrep_log_event(v_tenant_id, 'action', v_summary,
    jsonb_build_object('action_type', p_action_type, 'review_id', p_review_id, 'recovery_id', p_recovery_id));
  return jsonb_build_object('success', true, 'action_type', p_action_type, 'summary', v_summary);
end; $$;

create or replace function public.seed_aipify_hosts_reputation_center_knowledge_airbnb37()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ahostkc_ensure_category(
    'aipify-hosts-reputation', 'Hosts Reputation Center',
    'Hospitality reputation management, guest experience improvement, and service recovery standards.', 340
  );
  perform public._ahostkc_seed_article('aipify-hosts-reputation', 'hospitality-reputation-management', 'Hospitality reputation management',
    'Monitor review trends, category scores, and property comparisons. Address reputation risks before they affect bookings.');
  perform public._ahostkc_seed_article('aipify-hosts-reputation', 'improving-guest-experiences', 'Improving guest experiences',
    'Use review feedback to strengthen cleanliness, communication, check-in, and overall guest experience across properties.');
  perform public._ahostkc_seed_article('aipify-hosts-reputation', 'service-recovery-standards', 'Service recovery standards',
    'Create recovery actions, assign owners, schedule inspections, and document resolutions with full audit visibility.');
  perform public._ahostkc_seed_article('aipify-hosts-reputation', 'managing-operational-feedback', 'Managing operational feedback',
    'Track repeated complaints, declining categories, and property-specific trends. Close the loop with documented recovery.');
end; $$;

select public.seed_aipify_hosts_reputation_center_knowledge_airbnb37();

grant execute on function public.get_aipify_hosts_reputation_center_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_reputation_center_dashboard(text, uuid, text, text, date, date, uuid) to authenticated;
grant execute on function public.perform_aipify_hosts_reputation_action(text, uuid, uuid, text, text, text, date, uuid) to authenticated;
