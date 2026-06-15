-- Phase Airbnb 30 — Aipify Hosts Guest Experience Center Foundation
-- Feature owner: CUSTOMER APP. Helpers: _ahostgxe_* (engine), _ahostbp392_* (blueprint)

create table if not exists public.aipify_hosts_guest_experience_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  default_section text not null default 'experience_overview' check (
    default_section in (
      'experience_overview', 'guest_feedback', 'service_recovery',
      'improvement_opportunities', 'experience_trends'
    )
  ),
  metadata jsonb not null default '{"metadata_only":true,"role_governed":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_guest_experience_settings enable row level security;
revoke all on public.aipify_hosts_guest_experience_settings from authenticated, anon;

create table if not exists public.aipify_hosts_guest_experience_metrics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  metrics_key text not null,
  overall_satisfaction numeric(5,2) not null default 0,
  check_in_experience numeric(5,2) not null default 0,
  property_cleanliness numeric(5,2) not null default 0,
  communication_quality numeric(5,2) not null default 0,
  property_accuracy numeric(5,2) not null default 0,
  issue_resolution numeric(5,2) not null default 0,
  likelihood_to_return numeric(5,2) not null default 0,
  experience_status text not null default 'good' check (
    experience_status in ('excellent', 'good', 'needs_improvement', 'critical')
  ),
  satisfaction_trend numeric(5,2) not null default 0,
  returning_guest_satisfaction numeric(5,2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  computed_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, metrics_key)
);
create index if not exists aipify_hosts_guest_experience_metrics_tenant_idx
  on public.aipify_hosts_guest_experience_metrics (tenant_id, experience_status);
alter table public.aipify_hosts_guest_experience_metrics enable row level security;
revoke all on public.aipify_hosts_guest_experience_metrics from authenticated, anon;

create table if not exists public.aipify_hosts_guest_feedback_records (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  feedback_key text not null,
  stay_period_start date,
  stay_period_end date,
  feedback_category text not null check (
    feedback_category in (
      'overall_satisfaction', 'check_in_experience', 'property_cleanliness',
      'communication_quality', 'property_accuracy', 'issue_resolution', 'likelihood_to_return'
    )
  ),
  rating numeric(3,1) not null check (rating >= 1 and rating <= 5),
  comments text,
  submitted_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, feedback_key)
);
create index if not exists aipify_hosts_guest_feedback_records_tenant_idx
  on public.aipify_hosts_guest_feedback_records (tenant_id, feedback_category, submitted_at desc);
alter table public.aipify_hosts_guest_feedback_records enable row level security;
revoke all on public.aipify_hosts_guest_feedback_records from authenticated, anon;

create table if not exists public.aipify_hosts_guest_improvement_opportunities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  opportunity_key text not null,
  opportunity_type text not null check (
    opportunity_type in (
      'repeated_complaints', 'declining_satisfaction', 'operational_failure', 'property_weakness'
    )
  ),
  category text not null,
  summary text not null,
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high', 'critical')),
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, opportunity_key)
);
create index if not exists aipify_hosts_guest_improvement_opportunities_tenant_idx
  on public.aipify_hosts_guest_improvement_opportunities (tenant_id, is_active, severity);
alter table public.aipify_hosts_guest_improvement_opportunities enable row level security;
revoke all on public.aipify_hosts_guest_improvement_opportunities from authenticated, anon;

create table if not exists public.aipify_hosts_guest_recovery_cases (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  feedback_id uuid references public.aipify_hosts_guest_feedback_records (id) on delete set null,
  recovery_key text not null,
  case_status text not null default 'open' check (
    case_status in ('open', 'in_progress', 'resolved', 'closed')
  ),
  assigned_owner text,
  resolution_notes text,
  due_date date,
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, recovery_key)
);
create index if not exists aipify_hosts_guest_recovery_cases_tenant_idx
  on public.aipify_hosts_guest_recovery_cases (tenant_id, case_status, due_date);
alter table public.aipify_hosts_guest_recovery_cases enable row level security;
revoke all on public.aipify_hosts_guest_recovery_cases from authenticated, anon;

create table if not exists public.aipify_hosts_guest_experience_trends (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  trend_month date not null,
  overall_satisfaction numeric(5,2) not null,
  category_scores jsonb not null default '{}'::jsonb,
  returning_guest_satisfaction numeric(5,2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_guest_experience_trends_tenant_idx
  on public.aipify_hosts_guest_experience_trends (tenant_id, trend_month desc);
alter table public.aipify_hosts_guest_experience_trends enable row level security;
revoke all on public.aipify_hosts_guest_experience_trends from authenticated, anon;

create table if not exists public.aipify_hosts_guest_experience_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_guest_experience_events_tenant_idx
  on public.aipify_hosts_guest_experience_events (tenant_id, created_at desc);
alter table public.aipify_hosts_guest_experience_events enable row level security;
revoke all on public.aipify_hosts_guest_experience_events from authenticated, anon;

create or replace function public._ahostgxe_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_guest_experience_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_hosts_guest_experience_settings;
begin
  insert into public.aipify_hosts_guest_experience_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_hosts_guest_experience_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ahostgxe_log_event(
  p_tenant_id uuid, p_event_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_hosts_guest_experience_events (tenant_id, event_type, summary, context)
  values (p_tenant_id, p_event_type, p_summary, p_context) returning id into v_id;
  perform public._ahost_log_audit(p_tenant_id, 'guest_experience_' || p_event_type, p_summary, p_context);
  return v_id;
end; $$;

create or replace function public._ahostgxe_push_notification(
  p_tenant_id uuid, p_key text, p_priority text, p_title text, p_message text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_hosts_notifications (
    tenant_id, notification_key, category, priority, notification_status, title, message, requires_attention
  ) values (
    p_tenant_id, p_key, 'team_events', p_priority, 'unread', p_title, p_message, p_priority in ('high', 'critical')
  ) on conflict (tenant_id, notification_key) do update set
    priority = excluded.priority, title = excluded.title, message = excluded.message,
    requires_attention = excluded.requires_attention, notification_status = 'unread', updated_at = now();
exception when undefined_table then null;
end; $$;

create or replace function public._ahostgxe_experience_status(p_score numeric)
returns text language sql immutable as $$
  select case
    when p_score >= 4.5 then 'excellent'
    when p_score >= 3.8 then 'good'
    when p_score >= 3.0 then 'needs_improvement'
    else 'critical'
  end; $$;

create or replace function public._ahostbp392_positioning() returns text language sql immutable as $$
  select 'Monitor and improve guest satisfaction — feedback, service recovery, improvement opportunities, and experience trends in one Guest Experience Center.'; $$;

create or replace function public._ahostbp392_sections() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'experience_overview', 'label', 'Experience Overview'),
    jsonb_build_object('key', 'guest_feedback', 'label', 'Guest Feedback'),
    jsonb_build_object('key', 'service_recovery', 'label', 'Service Recovery'),
    jsonb_build_object('key', 'improvement_opportunities', 'label', 'Improvement Opportunities'),
    jsonb_build_object('key', 'experience_trends', 'label', 'Experience Trends')
  ); $$;

create or replace function public._ahostgxe_metrics_row(p_m public.aipify_hosts_guest_experience_metrics, p_property text)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_m.id, 'metrics_key', p_m.metrics_key, 'property_id', p_m.property_id,
    'property', coalesce(p_property, 'Portfolio'),
    'overall_satisfaction', p_m.overall_satisfaction,
    'check_in_experience', p_m.check_in_experience,
    'property_cleanliness', p_m.property_cleanliness,
    'communication_quality', p_m.communication_quality,
    'property_accuracy', p_m.property_accuracy,
    'issue_resolution', p_m.issue_resolution,
    'likelihood_to_return', p_m.likelihood_to_return,
    'experience_status', p_m.experience_status,
    'satisfaction_trend', p_m.satisfaction_trend,
    'returning_guest_satisfaction', p_m.returning_guest_satisfaction
  ); $$;

create or replace function public._ahostgxe_feedback_row(p_f public.aipify_hosts_guest_feedback_records, p_property text)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_f.id, 'feedback_key', p_f.feedback_key, 'property_id', p_f.property_id,
    'property', coalesce(p_property, '—'),
    'stay_period_start', coalesce(p_f.stay_period_start::text, ''),
    'stay_period_end', coalesce(p_f.stay_period_end::text, ''),
    'feedback_category', p_f.feedback_category,
    'rating', p_f.rating, 'comments', coalesce(p_f.comments, ''),
    'submitted_at', p_f.submitted_at::text
  ); $$;

create or replace function public._ahostgxe_opportunity_row(p_o public.aipify_hosts_guest_improvement_opportunities, p_property text)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_o.id, 'opportunity_key', p_o.opportunity_key, 'property_id', p_o.property_id,
    'property', coalesce(p_property, 'Portfolio'),
    'opportunity_type', p_o.opportunity_type, 'category', p_o.category,
    'summary', p_o.summary, 'severity', p_o.severity, 'is_active', p_o.is_active
  ); $$;

create or replace function public._ahostgxe_recovery_row(p_r public.aipify_hosts_guest_recovery_cases, p_property text)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_r.id, 'recovery_key', p_r.recovery_key, 'property_id', p_r.property_id,
    'property', coalesce(p_property, '—'),
    'case_status', p_r.case_status, 'assigned_owner', coalesce(p_r.assigned_owner, '—'),
    'resolution_notes', coalesce(p_r.resolution_notes, ''),
    'due_date', coalesce(p_r.due_date::text, ''),
    'opened_at', p_r.opened_at::text,
    'is_overdue', (p_r.case_status in ('open', 'in_progress') and p_r.due_date is not null and p_r.due_date < current_date)
  ); $$;

create or replace function public._ahostgxe_seed_experience(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_prop1 uuid; v_prop2 uuid; v_fb1 uuid; v_fb2 uuid;
begin
  if exists (select 1 from public.aipify_hosts_guest_experience_metrics where tenant_id = p_tenant_id limit 1) then return; end if;
  select id into v_prop1 from public.aipify_hosts_properties where tenant_id = p_tenant_id and status <> 'archived' order by display_name limit 1;
  select id into v_prop2 from public.aipify_hosts_properties where tenant_id = p_tenant_id and status <> 'archived' order by display_name offset 1 limit 1;
  if v_prop1 is null then return; end if;
  if v_prop2 is null then v_prop2 := v_prop1; end if;

  insert into public.aipify_hosts_guest_experience_metrics (
    tenant_id, property_id, metrics_key, overall_satisfaction, check_in_experience,
    property_cleanliness, communication_quality, property_accuracy, issue_resolution,
    likelihood_to_return, experience_status, satisfaction_trend, returning_guest_satisfaction
  ) values
    (v_tenant_id, null, 'gxe_portfolio', 4.2, 4.3, 4.1, 4.4, 4.0, 3.9, 4.2, 'good', -0.2, 4.5),
    (v_tenant_id, v_prop1, 'gxe_prop_001', 4.7, 4.8, 4.6, 4.7, 4.5, 4.6, 4.8, 'excellent', 0.3, 4.9),
    (v_tenant_id, v_prop2, 'gxe_prop_002', 2.8, 3.0, 2.5, 3.2, 2.9, 2.4, 2.6, 'critical', -0.8, 3.1);

  insert into public.aipify_hosts_guest_feedback_records (
    tenant_id, property_id, feedback_key, stay_period_start, stay_period_end,
    feedback_category, rating, comments, submitted_at
  ) values
    (v_tenant_id, v_prop1, 'gxe_fb_001', current_date - 10, current_date - 7,
      'overall_satisfaction', 5.0, 'Wonderful stay — seamless check-in and spotless property.', now() - interval '5 days'),
    (v_tenant_id, v_prop2, 'gxe_fb_002', current_date - 8, current_date - 5,
      'property_cleanliness', 2.0, 'Bathroom not cleaned thoroughly on arrival.', now() - interval '3 days'),
    (v_tenant_id, v_prop2, 'gxe_fb_003', current_date - 8, current_date - 5,
      'communication_quality', 2.5, 'Slow response to maintenance request.', now() - interval '2 days'),
    (v_tenant_id, v_prop2, 'gxe_fb_004', current_date - 20, current_date - 17,
      'property_cleanliness', 2.5, 'Same cleanliness issue as previous stay.', now() - interval '15 days');

  select id into v_fb2 from public.aipify_hosts_guest_feedback_records where tenant_id = p_tenant_id and feedback_key = 'gxe_fb_002';

  insert into public.aipify_hosts_guest_improvement_opportunities (
    tenant_id, property_id, opportunity_key, opportunity_type, category, summary, severity
  ) values
    (v_tenant_id, v_prop2, 'gxe_opp_001', 'repeated_complaints', 'property_cleanliness',
      'Repeated cleanliness complaints across multiple stays', 'high'),
    (v_tenant_id, v_prop2, 'gxe_opp_002', 'declining_satisfaction', 'overall_satisfaction',
      'Satisfaction declining month over month at property', 'critical'),
    (v_tenant_id, v_prop2, 'gxe_opp_003', 'operational_failure', 'issue_resolution',
      'Maintenance response times below hospitality standard', 'high'),
    (v_tenant_id, v_prop1, 'gxe_opp_004', 'property_weakness', 'check_in_experience',
      'Minor check-in instruction clarity feedback', 'low');

  insert into public.aipify_hosts_guest_recovery_cases (
    tenant_id, property_id, feedback_id, recovery_key, case_status, assigned_owner,
    resolution_notes, due_date
  ) values
    (v_tenant_id, v_prop2, v_fb2, 'gxe_rec_001', 'in_progress', 'Guest Services Lead',
      'Deep clean scheduled and guest contacted', current_date - 1),
    (v_tenant_id, v_prop2, null, 'gxe_rec_002', 'open', null,
      null, current_date + 2);

  insert into public.aipify_hosts_guest_experience_trends (
    tenant_id, property_id, trend_month, overall_satisfaction, category_scores, returning_guest_satisfaction
  ) values
    (v_tenant_id, null, date_trunc('month', current_date - interval '2 months')::date, 4.4,
      '{"property_cleanliness":4.3,"communication_quality":4.5}'::jsonb, 4.6),
    (v_tenant_id, null, date_trunc('month', current_date - interval '1 month')::date, 4.3,
      '{"property_cleanliness":4.1,"communication_quality":4.4}'::jsonb, 4.5),
    (v_tenant_id, null, date_trunc('month', current_date)::date, 4.2,
      '{"property_cleanliness":4.0,"communication_quality":4.3}'::jsonb, 4.5),
    (v_tenant_id, v_prop1, date_trunc('month', current_date)::date, 4.7,
      '{"property_cleanliness":4.6,"communication_quality":4.7}'::jsonb, 4.9),
    (v_tenant_id, v_prop2, date_trunc('month', current_date)::date, 2.8,
      '{"property_cleanliness":2.5,"communication_quality":3.2}'::jsonb, 3.1);
end; $$;

create or replace function public._ahostgxe_dashboard_stats(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'guest_satisfaction_score', coalesce((
      select overall_satisfaction from public.aipify_hosts_guest_experience_metrics
      where tenant_id = p_tenant_id and property_id is null limit 1
    ), 0),
    'portfolio_status', coalesce((
      select experience_status from public.aipify_hosts_guest_experience_metrics
      where tenant_id = p_tenant_id and property_id is null limit 1
    ), 'good'),
    'open_recovery_cases', (select count(*)::int from public.aipify_hosts_guest_recovery_cases
      where tenant_id = p_tenant_id and case_status in ('open', 'in_progress')),
    'overdue_recovery_cases', (select count(*)::int from public.aipify_hosts_guest_recovery_cases
      where tenant_id = p_tenant_id and case_status in ('open', 'in_progress')
        and due_date is not null and due_date < current_date),
    'active_improvement_areas', (select count(*)::int from public.aipify_hosts_guest_improvement_opportunities
      where tenant_id = p_tenant_id and is_active),
    'critical_properties', (select count(*)::int from public.aipify_hosts_guest_experience_metrics
      where tenant_id = p_tenant_id and property_id is not null and experience_status = 'critical'),
    'excellent_properties', (select count(*)::int from public.aipify_hosts_guest_experience_metrics
      where tenant_id = p_tenant_id and property_id is not null and experience_status = 'excellent'),
    'feedback_count_30d', (select count(*)::int from public.aipify_hosts_guest_feedback_records
      where tenant_id = p_tenant_id and submitted_at >= now() - interval '30 days')
  ); $$;

create or replace function public._ahostgxe_top_improvement_areas(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'category', category, 'count', cnt, 'severity', max_sev
  ) order by cnt desc), '[]'::jsonb)
  from (
    select category, count(*)::int as cnt, max(severity) as max_sev
    from public.aipify_hosts_guest_improvement_opportunities
    where tenant_id = p_tenant_id and is_active
    group by category
    limit 5
  ) x; $$;

create or replace function public._ahostgxe_strongest_properties(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select coalesce(jsonb_agg(
    public._ahostgxe_metrics_row(m, p.display_name) order by m.overall_satisfaction desc
  ), '[]'::jsonb)
  from public.aipify_hosts_guest_experience_metrics m
  join public.aipify_hosts_properties p on p.id = m.property_id
  where m.tenant_id = p_tenant_id and m.property_id is not null
    and m.experience_status in ('excellent', 'good')
  limit 3; $$;

create or replace function public._ahostgxe_monthly_trends(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select coalesce(jsonb_agg(
    jsonb_build_object(
      'month', t.trend_month::text,
      'overall_satisfaction', t.overall_satisfaction,
      'returning_guest_satisfaction', t.returning_guest_satisfaction,
      'category_scores', t.category_scores,
      'property', coalesce(p.display_name, 'Portfolio')
    ) order by t.trend_month
  ), '[]'::jsonb)
  from public.aipify_hosts_guest_experience_trends t
  left join public.aipify_hosts_properties p on p.id = t.property_id
  where t.tenant_id = p_tenant_id; $$;

create or replace function public._ahostgxe_category_performance(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'overall_satisfaction', coalesce(round(avg(overall_satisfaction), 1), 0),
    'check_in_experience', coalesce(round(avg(check_in_experience), 1), 0),
    'property_cleanliness', coalesce(round(avg(property_cleanliness), 1), 0),
    'communication_quality', coalesce(round(avg(communication_quality), 1), 0),
    'property_accuracy', coalesce(round(avg(property_accuracy), 1), 0),
    'issue_resolution', coalesce(round(avg(issue_resolution), 1), 0),
    'likelihood_to_return', coalesce(round(avg(likelihood_to_return), 1), 0)
  )
  from public.aipify_hosts_guest_experience_metrics
  where tenant_id = p_tenant_id and property_id is not null; $$;

create or replace function public._ahostgxe_check_notifications(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare r record;
begin
  for r in
    select m.id, p.display_name, m.satisfaction_trend from public.aipify_hosts_guest_experience_metrics m
    join public.aipify_hosts_properties p on p.id = m.property_id
    where m.tenant_id = p_tenant_id and m.property_id is not null and m.satisfaction_trend <= -0.5
  loop
    perform public._ahostgxe_push_notification(p_tenant_id, 'gxe_decl_' || r.id::text, 'high',
      'Satisfaction Score Decline', r.display_name || ' satisfaction declining (' || r.satisfaction_trend || ')');
  end loop;

  for r in
    select f.feedback_category, p.display_name, count(*) as cnt
    from public.aipify_hosts_guest_feedback_records f
    join public.aipify_hosts_properties p on p.id = f.property_id
    where f.tenant_id = p_tenant_id and f.submitted_at >= now() - interval '14 days' and f.rating <= 3
    group by f.feedback_category, p.display_name, p.id
    having count(*) >= 2
  loop
    perform public._ahostgxe_push_notification(p_tenant_id, 'gxe_mult_' || md5(r.display_name || r.feedback_category), 'high',
      'Multiple Complaints', r.cnt || ' complaints in ' || replace(r.feedback_category, '_', ' ') || ' at ' || r.display_name);
  end loop;

  for r in
    select rc.id, p.display_name from public.aipify_hosts_guest_recovery_cases rc
    join public.aipify_hosts_properties p on p.id = rc.property_id
    where rc.tenant_id = p_tenant_id and rc.case_status in ('open', 'in_progress')
      and rc.due_date is not null and rc.due_date < current_date
  loop
    perform public._ahostgxe_push_notification(p_tenant_id, 'gxe_odue_' || r.id::text, 'high',
      'Recovery Case Overdue', 'Service recovery overdue at ' || r.display_name);
  end loop;

  for r in
    select m.id, p.display_name from public.aipify_hosts_guest_experience_metrics m
    join public.aipify_hosts_properties p on p.id = m.property_id
    where m.tenant_id = p_tenant_id and m.experience_status = 'critical'
  loop
    perform public._ahostgxe_push_notification(p_tenant_id, 'gxe_crit_' || r.id::text, 'critical',
      'Property Critical', r.display_name || ' guest experience is critical');
  end loop;
end; $$;

create or replace function public.get_aipify_hosts_guest_experience_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_ge public.aipify_hosts_guest_experience_settings; v_hosts public.aipify_hosts_settings;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_ge := public._ahostgxe_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_ge.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'positioning', public._ahostbp392_positioning(),
    'route', '/app/aipify-hosts/guest-experience',
    'stats', public._ahostgxe_dashboard_stats(v_tenant_id)
  );
end; $$;

create or replace function public.get_aipify_hosts_guest_experience_dashboard(
  p_section text default 'experience_overview',
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_ge public.aipify_hosts_guest_experience_settings; v_hosts public.aipify_hosts_settings;
  v_section text; v_metrics jsonb; v_feedback jsonb; v_recovery jsonb; v_opportunities jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_ge := public._ahostgxe_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_section := coalesce(nullif(trim(p_section), ''), v_ge.default_section, 'experience_overview');
  perform public._ahostgxe_seed_experience(v_tenant_id);
  perform public._ahostgxe_check_notifications(v_tenant_id);
  perform public._ahostgxe_log_event(v_tenant_id, 'dashboard_view', 'Guest Experience Center viewed',
    jsonb_build_object('section', v_section));

  select coalesce(jsonb_agg(
    public._ahostgxe_metrics_row(m, coalesce(p.display_name, 'Portfolio')) order by m.overall_satisfaction desc
  ), '[]'::jsonb) into v_metrics
  from public.aipify_hosts_guest_experience_metrics m
  left join public.aipify_hosts_properties p on p.id = m.property_id
  where m.tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(
    public._ahostgxe_feedback_row(f, p.display_name) order by f.submitted_at desc
  ), '[]'::jsonb) into v_feedback
  from public.aipify_hosts_guest_feedback_records f
  left join public.aipify_hosts_properties p on p.id = f.property_id
  where f.tenant_id = v_tenant_id
    and (v_section = 'guest_feedback' or v_section = 'experience_overview');

  select coalesce(jsonb_agg(
    public._ahostgxe_recovery_row(r, p.display_name) order by r.opened_at desc
  ), '[]'::jsonb) into v_recovery
  from public.aipify_hosts_guest_recovery_cases r
  left join public.aipify_hosts_properties p on p.id = r.property_id
  where r.tenant_id = v_tenant_id
    and (v_section = 'service_recovery' or v_section = 'experience_overview' or r.case_status in ('open', 'in_progress'));

  select coalesce(jsonb_agg(
    public._ahostgxe_opportunity_row(o, coalesce(p.display_name, 'Portfolio')) order by o.severity desc
  ), '[]'::jsonb) into v_opportunities
  from public.aipify_hosts_guest_improvement_opportunities o
  left join public.aipify_hosts_properties p on p.id = o.property_id
  where o.tenant_id = v_tenant_id and o.is_active
    and (v_section = 'improvement_opportunities' or v_section = 'experience_overview');

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_ge.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'active_section', v_section,
    'positioning', public._ahostbp392_positioning(),
    'governance', jsonb_build_object(
      'role_permissions', true,
      'audit_recovery_actions', true,
      'audit_feedback_changes', true,
      'audit_closure_decisions', true
    ),
    'sections', public._ahostbp392_sections(),
    'experience_metrics', jsonb_build_array(
      'overall_satisfaction', 'check_in_experience', 'property_cleanliness',
      'communication_quality', 'property_accuracy', 'issue_resolution', 'likelihood_to_return'
    ),
    'experience_statuses', jsonb_build_array('excellent', 'good', 'needs_improvement', 'critical'),
    'stats', public._ahostgxe_dashboard_stats(v_tenant_id),
    'category_performance', public._ahostgxe_category_performance(v_tenant_id),
    'top_improvement_areas', public._ahostgxe_top_improvement_areas(v_tenant_id),
    'strongest_properties', public._ahostgxe_strongest_properties(v_tenant_id),
    'monthly_trends', public._ahostgxe_monthly_trends(v_tenant_id),
    'property_metrics', v_metrics,
    'guest_feedback', case when v_section in ('guest_feedback', 'experience_overview') then v_feedback else '[]'::jsonb end,
    'recovery_cases', case when v_section in ('service_recovery', 'experience_overview') then v_recovery else '[]'::jsonb end,
    'improvement_opportunities', case when v_section in ('improvement_opportunities', 'experience_overview') then v_opportunities else '[]'::jsonb end,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 30 — Guest Experience Foundation',
      'doc', 'aipify-hosts/PHASE_AIRBNB_30_GUEST_EXPERIENCE.text',
      'route', '/app/aipify-hosts/guest-experience'
    )
  );
end; $$;

create or replace function public.perform_aipify_hosts_guest_experience_action(
  p_action_type text,
  p_recovery_id uuid default null,
  p_property_id uuid default null,
  p_assigned_owner text default null,
  p_notes text default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_rec public.aipify_hosts_guest_recovery_cases;
  v_task_key text; v_summary text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;

  if p_action_type = 'create_follow_up_task' then
    v_task_key := 'task_gxe_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
    insert into public.aipify_hosts_tasks (
      tenant_id, property_id, task_key, title, description, category, priority
    ) values (
      v_tenant_id, p_property_id, v_task_key, 'Guest experience follow-up',
      coalesce(p_notes, 'Follow-up task from Guest Experience Center'), 'guest_preparation', 'high'
    );
    if p_recovery_id is not null then
      update public.aipify_hosts_guest_recovery_cases set
        case_status = 'in_progress', updated_at = now()
      where id = p_recovery_id and tenant_id = v_tenant_id;
    end if;
    perform public._ahostgxe_log_event(v_tenant_id, 'recovery_task_created', 'Follow-up task created',
      jsonb_build_object('recovery_id', p_recovery_id, 'property_id', p_property_id));
    v_summary := 'Follow-up task created';

  elsif p_action_type = 'assign_owner' then
    select * into v_rec from public.aipify_hosts_guest_recovery_cases where id = p_recovery_id and tenant_id = v_tenant_id;
    if v_rec.id is null then raise exception 'Recovery case not found'; end if;
    update public.aipify_hosts_guest_recovery_cases set
      assigned_owner = coalesce(p_assigned_owner, assigned_owner),
      case_status = case when case_status = 'open' then 'in_progress' else case_status end,
      updated_at = now()
    where id = p_recovery_id;
    perform public._ahostgxe_log_event(v_tenant_id, 'recovery_assigned', 'Recovery case assigned',
      jsonb_build_object('recovery_id', p_recovery_id, 'assigned_owner', p_assigned_owner));
    v_summary := 'Owner assigned';

  elsif p_action_type = 'document_resolution' then
    select * into v_rec from public.aipify_hosts_guest_recovery_cases where id = p_recovery_id and tenant_id = v_tenant_id;
    if v_rec.id is null then raise exception 'Recovery case not found'; end if;
    update public.aipify_hosts_guest_recovery_cases set
      resolution_notes = coalesce(p_notes, resolution_notes),
      case_status = 'resolved', updated_at = now()
    where id = p_recovery_id;
    perform public._ahostgxe_log_event(v_tenant_id, 'recovery_documented', 'Resolution documented',
      jsonb_build_object('recovery_id', p_recovery_id));
    v_summary := 'Resolution documented';

  elsif p_action_type = 'close_recovery_case' then
    select * into v_rec from public.aipify_hosts_guest_recovery_cases where id = p_recovery_id and tenant_id = v_tenant_id;
    if v_rec.id is null then raise exception 'Recovery case not found'; end if;
    update public.aipify_hosts_guest_recovery_cases set
      case_status = 'closed', closed_at = now(), updated_at = now(),
      resolution_notes = coalesce(p_notes, resolution_notes)
    where id = p_recovery_id;
    perform public._ahostgxe_log_event(v_tenant_id, 'recovery_closed', 'Recovery case closed',
      jsonb_build_object('recovery_id', p_recovery_id));
    v_summary := 'Recovery case closed';

  else
    raise exception 'Invalid action type';
  end if;

  perform public._ahostgxe_log_event(v_tenant_id, 'action', v_summary,
    jsonb_build_object('action_type', p_action_type, 'recovery_id', p_recovery_id));
  return jsonb_build_object('success', true, 'action_type', p_action_type, 'summary', v_summary);
end; $$;

create or replace function public.seed_aipify_hosts_guest_experience_knowledge_airbnb30()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ahostkc_ensure_category(
    'aipify-hosts-guest-experience', 'Hosts Guest Experience Center',
    'Guest satisfaction, feedback, service recovery, and hospitality quality standards.', 326
  );
  perform public._ahostkc_seed_article('aipify-hosts-guest-experience', 'delivering-exceptional-guest-experiences', 'Delivering exceptional guest experiences',
    'Monitor satisfaction across check-in, cleanliness, communication, accuracy, resolution, and return intent.');
  perform public._ahostkc_seed_article('aipify-hosts-guest-experience', 'hospitality-communication-standards', 'Hospitality communication standards',
    'Respond promptly, set clear expectations, and document every guest interaction professionally.');
  perform public._ahostkc_seed_article('aipify-hosts-guest-experience', 'service-recovery-best-practices', 'Service recovery best practices',
    'Assign owners, document resolution actions, and close recovery cases only when guests are satisfied.');
  perform public._ahostkc_seed_article('aipify-hosts-guest-experience', 'building-repeat-guest-loyalty', 'Building repeat guest loyalty',
    'Track returning guest satisfaction and address recurring complaints before they affect loyalty.');
end; $$;

select public.seed_aipify_hosts_guest_experience_knowledge_airbnb30();

grant execute on function public.get_aipify_hosts_guest_experience_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_guest_experience_dashboard(text, uuid) to authenticated;
grant execute on function public.perform_aipify_hosts_guest_experience_action(text, uuid, uuid, text, text, uuid) to authenticated;
grant execute on function public.seed_aipify_hosts_guest_experience_knowledge_airbnb30() to authenticated;
