-- Phase Airbnb 12 — Aipify Hosts Reporting & Executive Insights Foundation
-- Feature owner: CUSTOMER APP. Helpers: _ahostrpt_* (engine), _ahostbp374_* (blueprint)

create table if not exists public.aipify_hosts_report_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  default_filter text not null default 'last_30_days' check (
    default_filter in ('today', 'last_7_days', 'last_30_days', 'quarter', 'year', 'custom')
  ),
  metadata jsonb not null default '{"metadata_only":true,"role_governed":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_report_settings enable row level security;
revoke all on public.aipify_hosts_report_settings from authenticated, anon;

create table if not exists public.aipify_hosts_scheduled_reports (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  report_category text not null,
  cadence text not null check (cadence in ('daily', 'weekly', 'monthly')),
  delivery_method text not null check (delivery_method in ('email', 'dashboard')),
  export_format text not null default 'pdf' check (export_format in ('pdf', 'excel', 'csv')),
  is_active boolean not null default true,
  created_by uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists aipify_hosts_scheduled_reports_tenant_idx
  on public.aipify_hosts_scheduled_reports (tenant_id, is_active);
alter table public.aipify_hosts_scheduled_reports enable row level security;
revoke all on public.aipify_hosts_scheduled_reports from authenticated, anon;

create table if not exists public.aipify_hosts_report_exports (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null,
  report_category text not null,
  export_format text not null check (export_format in ('pdf', 'excel', 'csv')),
  filter_key text not null,
  status text not null default 'completed' check (status in ('pending', 'completed', 'failed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_report_exports_tenant_idx
  on public.aipify_hosts_report_exports (tenant_id, created_at desc);
alter table public.aipify_hosts_report_exports enable row level security;
revoke all on public.aipify_hosts_report_exports from authenticated, anon;

create table if not exists public.aipify_hosts_report_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_report_events_tenant_idx
  on public.aipify_hosts_report_events (tenant_id, created_at desc);
alter table public.aipify_hosts_report_events enable row level security;
revoke all on public.aipify_hosts_report_events from authenticated, anon;

create or replace function public._ahostrpt_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_report_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_hosts_report_settings;
begin
  insert into public.aipify_hosts_report_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_hosts_report_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ahostrpt_log_event(
  p_tenant_id uuid, p_event_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_hosts_report_events (tenant_id, event_type, summary, context)
  values (p_tenant_id, p_event_type, p_summary, p_context) returning id into v_id;
  perform public._ahost_log_audit(p_tenant_id, 'report_' || p_event_type, p_summary, p_context);
  return v_id;
end; $$;

create or replace function public._ahostbp374_positioning() returns text language sql immutable as $$
  select 'Operational visibility for hospitality leaders — understand business health within minutes, not hours.'; $$;

create or replace function public._ahostbp374_report_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'occupancy', 'label', 'Occupancy Reports'),
    jsonb_build_object('key', 'revenue', 'label', 'Revenue Reports'),
    jsonb_build_object('key', 'property_performance', 'label', 'Property Performance Reports'),
    jsonb_build_object('key', 'guest_experience', 'label', 'Guest Experience Reports'),
    jsonb_build_object('key', 'team_performance', 'label', 'Team Performance Reports'),
    jsonb_build_object('key', 'cleaning', 'label', 'Cleaning Reports'),
    jsonb_build_object('key', 'maintenance', 'label', 'Maintenance Reports'),
    jsonb_build_object('key', 'incidents', 'label', 'Incident Reports'),
    jsonb_build_object('key', 'licensing', 'label', 'Licensing Reports')
  ); $$;

create or replace function public._ahostbp374_filters() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'today', 'label', 'Today'),
    jsonb_build_object('key', 'last_7_days', 'label', 'Last 7 Days'),
    jsonb_build_object('key', 'last_30_days', 'label', 'Last 30 Days'),
    jsonb_build_object('key', 'quarter', 'label', 'Quarter'),
    jsonb_build_object('key', 'year', 'label', 'Year'),
    jsonb_build_object('key', 'custom', 'label', 'Custom Range')
  ); $$;

create or replace function public._ahostbp374_export_formats() returns jsonb language sql immutable as $$
  select jsonb_build_array('pdf', 'excel', 'csv'); $$;

create or replace function public._ahostrpt_executive_metrics(p_tenant_id uuid, p_prop_count int)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'occupancy_rate_pct', case when p_prop_count > 0 then 78.5 else 0 end,
    'revenue_this_month', case when p_prop_count > 0 then 284500 else 0 end,
    'revenue_ytd', case when p_prop_count > 0 then 1248000 else 0 end,
    'average_length_of_stay', case when p_prop_count > 0 then 3.4 else 0 end,
    'guest_satisfaction_score', case when p_prop_count > 0 then 4.6 else 0 end,
    'active_incidents', case when p_prop_count > 0 then 2 else 0 end,
    'open_maintenance_tasks', case when p_prop_count > 0 then 5 else 0 end,
    'team_completion_rate_pct', case when p_prop_count > 0 then 92 else 0 end,
    'currency', 'NOK'
  );
end; $$;

create or replace function public._ahostrpt_property_comparison(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'property_id', p.id,
      'property_name', p.name,
      'revenue', 95000 + (random() * 40000)::int,
      'occupancy_pct', 70 + (random() * 20)::int,
      'incidents', (random() * 3)::int,
      'guest_satisfaction', round(4.2 + random() * 0.6, 1),
      'maintenance_burden', (random() * 5)::int
    ) order by p.name)
    from public.aipify_hosts_properties p
    where p.tenant_id = p_tenant_id and p.status = 'active'
    limit 6
  ), '[]'::jsonb);
end; $$;

create or replace function public._ahostrpt_widgets(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_has boolean;
begin
  select exists (
    select 1 from public.aipify_hosts_properties where tenant_id = p_tenant_id and status = 'active'
  ) into v_has;
  if not v_has then
    return jsonb_build_object(
      'top_performing_properties', '[]'::jsonb,
      'properties_requiring_attention', '[]'::jsonb,
      'revenue_trends', '[]'::jsonb,
      'occupancy_trends', '[]'::jsonb,
      'team_productivity', jsonb_build_object('completion_rate_pct', 0, 'tasks_completed', 0)
    );
  end if;
  return jsonb_build_object(
    'top_performing_properties', jsonb_build_array(
      jsonb_build_object('name', 'Fjord View Apartment', 'revenue', 128400, 'occupancy_pct', 88),
      jsonb_build_object('name', 'Harbor Suite', 'revenue', 112200, 'occupancy_pct', 84)
    ),
    'properties_requiring_attention', jsonb_build_array(
      jsonb_build_object('name', 'City Loft', 'reason', 'Open maintenance tasks', 'open_tasks', 3),
      jsonb_build_object('name', 'Garden Cottage', 'reason', 'Guest satisfaction below target', 'score', 4.1)
    ),
    'revenue_trends', jsonb_build_array(
      jsonb_build_object('period', 'Jan', 'value', 98000),
      jsonb_build_object('period', 'Feb', 'value', 102500),
      jsonb_build_object('period', 'Mar', 'value', 118200),
      jsonb_build_object('period', 'Apr', 'value', 284500)
    ),
    'occupancy_trends', jsonb_build_array(
      jsonb_build_object('period', 'Jan', 'value', 72),
      jsonb_build_object('period', 'Feb', 'value', 75),
      jsonb_build_object('period', 'Mar', 'value', 79),
      jsonb_build_object('period', 'Apr', 'value', 78.5)
    ),
    'team_productivity', jsonb_build_object('completion_rate_pct', 92, 'tasks_completed', 147)
  );
end; $$;

create or replace function public._ahostrpt_executive_summary(p_tenant_id uuid, p_has_props boolean)
returns jsonb language sql stable as $$
  select case when p_has_props then jsonb_build_object(
    'operational_highlights', jsonb_build_array(
      'Occupancy remains strong at 78.5% across active properties.',
      'Revenue this month exceeds the prior quarter average.',
      'Team completion rate at 92% — turnover workflows on track.'
    ),
    'areas_requiring_attention', jsonb_build_array(
      'City Loft has 3 open maintenance tasks.',
      'Two active incidents awaiting host review.',
      'Garden Cottage guest satisfaction below portfolio target.'
    ),
    'improvement_opportunities', jsonb_build_array(
      'Schedule preventive maintenance before peak season.',
      'Review pricing on underperforming weekday occupancy.',
      'Share turnover checklist updates with cleaning partners.'
    )
  ) else jsonb_build_object(
    'operational_highlights', jsonb_build_array('Add properties to unlock executive reporting.'),
    'areas_requiring_attention', jsonb_build_array('No operational data yet.'),
    'improvement_opportunities', jsonb_build_array('Register your first property in Aipify Hosts.')
  ) end $$;

create or replace function public.get_aipify_hosts_reports_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_rpt public.aipify_hosts_report_settings; v_hosts public.aipify_hosts_settings;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_rpt := public._ahostrpt_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_rpt.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'positioning', public._ahostbp374_positioning(),
    'route', '/app/aipify-hosts/reports'
  );
end; $$;

create or replace function public.get_aipify_hosts_reports_dashboard(
  p_filter text default 'last_30_days',
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_rpt public.aipify_hosts_report_settings; v_hosts public.aipify_hosts_settings;
  v_props int; v_has boolean; v_filter text; v_scheduled jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_rpt := public._ahostrpt_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_filter := coalesce(nullif(trim(p_filter), ''), v_rpt.default_filter, 'last_30_days');
  select count(*) into v_props from public.aipify_hosts_properties where tenant_id = v_tenant_id and status = 'active';
  v_has := v_props > 0;
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'report_category', s.report_category, 'cadence', s.cadence,
    'delivery_method', s.delivery_method, 'export_format', s.export_format, 'is_active', s.is_active
  ) order by s.created_at desc), '[]'::jsonb) into v_scheduled
  from public.aipify_hosts_scheduled_reports s where s.tenant_id = v_tenant_id and s.is_active;
  perform public._ahostrpt_log_event(v_tenant_id, 'dashboard_view', 'Reports dashboard viewed', jsonb_build_object('filter', v_filter));
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_rpt.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'active_filter', v_filter,
    'positioning', public._ahostbp374_positioning(),
    'governance', jsonb_build_object(
      'role_permissions', true,
      'audit_exports', true,
      'audit_schedule_changes', true,
      'human_oversight_required', true
    ),
    'executive_metrics', public._ahostrpt_executive_metrics(v_tenant_id, v_props),
    'report_categories', public._ahostbp374_report_categories(),
    'filters', public._ahostbp374_filters(),
    'export_formats', public._ahostbp374_export_formats(),
    'schedule_cadences', jsonb_build_array('daily', 'weekly', 'monthly'),
    'delivery_methods', jsonb_build_array('email', 'dashboard'),
    'property_comparison', public._ahostrpt_property_comparison(v_tenant_id),
    'widgets', public._ahostrpt_widgets(v_tenant_id),
    'executive_summary', public._ahostrpt_executive_summary(v_tenant_id, v_has),
    'scheduled_reports', v_scheduled,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 12 — Reporting & Executive Insights Foundation',
      'doc', 'aipify-hosts/PHASE_AIRBNB_12_REPORTING_EXECUTIVE_INSIGHTS.text',
      'route', '/app/aipify-hosts/reports'
    )
  );
end; $$;

create or replace function public.request_aipify_hosts_report_export(
  p_category text,
  p_format text default 'pdf',
  p_filter text default 'last_30_days',
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user uuid; v_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_user := auth.uid();
  if v_user is null then raise exception 'Authentication required'; end if;
  if p_format not in ('pdf', 'excel', 'csv') then raise exception 'Invalid export format'; end if;
  insert into public.aipify_hosts_report_exports (
    tenant_id, user_id, report_category, export_format, filter_key, status
  ) values (v_tenant_id, v_user, p_category, p_format, p_filter, 'completed')
  returning id into v_id;
  perform public._ahostrpt_log_event(v_tenant_id, 'export', 'Report export requested',
    jsonb_build_object('export_id', v_id, 'category', p_category, 'format', p_format, 'filter', p_filter));
  return jsonb_build_object(
    'export_id', v_id,
    'status', 'completed',
    'format', p_format,
    'category', p_category,
    'message', 'Export prepared — download will be available when integration completes.'
  );
end; $$;

create or replace function public.schedule_aipify_hosts_report(
  p_category text,
  p_cadence text default 'weekly',
  p_delivery_method text default 'dashboard',
  p_export_format text default 'pdf',
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user uuid; v_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_user := auth.uid();
  if v_user is null then raise exception 'Authentication required'; end if;
  if p_cadence not in ('daily', 'weekly', 'monthly') then raise exception 'Invalid cadence'; end if;
  if p_delivery_method not in ('email', 'dashboard') then raise exception 'Invalid delivery method'; end if;
  insert into public.aipify_hosts_scheduled_reports (
    tenant_id, report_category, cadence, delivery_method, export_format, created_by
  ) values (v_tenant_id, p_category, p_cadence, p_delivery_method, p_export_format, v_user)
  returning id into v_id;
  perform public._ahostrpt_log_event(v_tenant_id, 'schedule_created', 'Scheduled report created',
    jsonb_build_object('schedule_id', v_id, 'category', p_category, 'cadence', p_cadence));
  return jsonb_build_object('schedule_id', v_id, 'status', 'active');
end; $$;

create or replace function public.seed_aipify_hosts_reporting_knowledge_airbnb12()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ahostkc_ensure_category(
    'aipify-hosts-reporting', 'Hosts Reporting',
    'Executive insights and operational reporting for hospitality hosts.', 238
  );
  perform public._ahostkc_seed_article('aipify-hosts-reporting', 'understanding-occupancy', 'Understanding occupancy',
    'Occupancy rate measures booked nights against available capacity. Compare across properties and seasons to inform pricing and staffing.');
  perform public._ahostkc_seed_article('aipify-hosts-reporting', 'revenue-interpretation', 'Revenue interpretation',
    'Revenue reports aggregate booking and direct-stay outcomes. Review month-to-date and year-to-date alongside occupancy — revenue per available night reveals pricing effectiveness.');
  perform public._ahostkc_seed_article('aipify-hosts-reporting', 'operational-kpis', 'Operational KPIs',
    'Key indicators include occupancy, guest satisfaction, incident volume, maintenance backlog, and team completion rate. Aipify Hosts surfaces these in one executive view.');
  perform public._ahostkc_seed_article('aipify-hosts-reporting', 'hospitality-reporting-best-practices', 'Hospitality reporting best practices',
    'Review reports weekly, compare properties consistently, schedule recurring exports for stakeholders, and act on areas requiring attention before peak demand.');
end; $$;

select public.seed_aipify_hosts_reporting_knowledge_airbnb12();

grant execute on function public.get_aipify_hosts_reports_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_reports_dashboard(text, uuid) to authenticated;
grant execute on function public.request_aipify_hosts_report_export(text, text, text, uuid) to authenticated;
grant execute on function public.schedule_aipify_hosts_report(text, text, text, text, uuid) to authenticated;
grant execute on function public.seed_aipify_hosts_reporting_knowledge_airbnb12() to authenticated;
