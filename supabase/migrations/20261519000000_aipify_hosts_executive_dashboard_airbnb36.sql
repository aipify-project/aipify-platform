-- Phase Airbnb 36 — Aipify Hosts Executive Dashboard Foundation
-- Feature owner: CUSTOMER APP. Helpers: _ahostexec_* (engine), _ahostbp398_* (blueprint)

create table if not exists public.aipify_hosts_executive_dashboard_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  widget_preferences jsonb not null default '{
    "widget_order": [
      "executive_summary", "requires_attention", "notifications", "todays_operations",
      "property_health", "financial_snapshot", "upcoming_events", "quick_actions"
    ],
    "collapsed": {}
  }'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"role_governed":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_executive_dashboard_settings enable row level security;
revoke all on public.aipify_hosts_executive_dashboard_settings from authenticated, anon;

create table if not exists public.aipify_hosts_executive_upcoming_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  event_key text not null,
  event_type text not null check (
    event_type in (
      'owner_stay', 'seasonal_closure', 'scheduled_inspection',
      'preventive_maintenance', 'document_renewal'
    )
  ),
  title text not null,
  event_date date not null,
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, event_key)
);
create index if not exists aipify_hosts_executive_upcoming_events_tenant_idx
  on public.aipify_hosts_executive_upcoming_events (tenant_id, event_date);
alter table public.aipify_hosts_executive_upcoming_events enable row level security;
revoke all on public.aipify_hosts_executive_upcoming_events from authenticated, anon;

create table if not exists public.aipify_hosts_executive_dashboard_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_executive_dashboard_events_tenant_idx
  on public.aipify_hosts_executive_dashboard_events (tenant_id, created_at desc);
alter table public.aipify_hosts_executive_dashboard_events enable row level security;
revoke all on public.aipify_hosts_executive_dashboard_events from authenticated, anon;

create or replace function public._ahostexec_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_executive_dashboard_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_hosts_executive_dashboard_settings;
begin
  insert into public.aipify_hosts_executive_dashboard_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_hosts_executive_dashboard_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ahostexec_log_event(
  p_tenant_id uuid, p_event_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_hosts_executive_dashboard_events (tenant_id, event_type, summary, context)
  values (p_tenant_id, p_event_type, p_summary, p_context) returning id into v_id;
  perform public._ahost_log_audit(p_tenant_id, 'executive_' || p_event_type, p_summary, p_context);
  return v_id;
end; $$;

create or replace function public._ahostbp398_positioning() returns text language sql immutable as $$
  select 'Complete operational overview within 60 seconds — executive summary, attention items, today''s operations, property health, finance, and upcoming events.'; $$;

create or replace function public._ahostbp398_default_widgets() returns jsonb language sql immutable as $$
  select '["executive_summary","requires_attention","notifications","todays_operations","property_health","financial_snapshot","upcoming_events","quick_actions"]'::jsonb; $$;

create or replace function public._ahostexec_executive_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_active_props int;
  v_occupied int;
  v_occupancy numeric;
  v_revenue numeric;
  v_incidents int;
  v_satisfaction numeric;
  v_approvals int;
begin
  select count(*)::int into v_active_props from public.aipify_hosts_properties
  where tenant_id = p_tenant_id and status = 'active';

  select count(distinct property_id)::int into v_occupied
  from public.aipify_hosts_booking_reservations
  where tenant_id = p_tenant_id and property_id is not null
    and booking_status in ('checked_in', 'confirmed')
    and check_in_date <= current_date and check_out_date > current_date;

  v_occupancy := case when v_active_props > 0 then round((v_occupied::numeric / v_active_props) * 100, 1) else 0 end;

  select coalesce(sum(amount), 0) into v_revenue from public.aipify_hosts_revenue_entries
  where tenant_id = p_tenant_id and revenue_status in ('confirmed', 'paid')
    and check_in_date >= date_trunc('month', current_date)::date;

  select count(*)::int into v_incidents from public.aipify_hosts_incidents
  where tenant_id = p_tenant_id and incident_status not in ('resolved', 'closed');

  select coalesce(avg(overall_satisfaction), 0) into v_satisfaction
  from public.aipify_hosts_guest_experience_metrics where tenant_id = p_tenant_id;

  if v_satisfaction = 0 then
    select coalesce(avg(guest_experience_score), 0) into v_satisfaction
    from public.aipify_hosts_property_health_scores where tenant_id = p_tenant_id;
  end if;

  select count(*)::int into v_approvals from public.aipify_hosts_companion_approvals
  where tenant_id = p_tenant_id and status = 'pending';

  return jsonb_build_object(
    'active_properties', v_active_props,
    'occupancy_rate', v_occupancy,
    'revenue_this_month', v_revenue,
    'open_incidents', v_incidents,
    'guest_satisfaction_score', round(v_satisfaction, 1),
    'open_approvals', v_approvals
  );
exception when undefined_table then
  return jsonb_build_object(
    'active_properties', coalesce(v_active_props, 0),
    'occupancy_rate', 0, 'revenue_this_month', 0,
    'open_incidents', 0, 'guest_satisfaction_score', 0, 'open_approvals', 0
  );
end; $$;

create or replace function public._ahostexec_requires_attention(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_items jsonb := '[]'::jsonb;
begin
  v_items := v_items || coalesce((
    select jsonb_agg(jsonb_build_object(
      'type', 'critical_incident', 'label', description, 'property_id', property_id,
      'severity', 'critical', 'link', '/app/aipify-hosts/incidents'
    ))
    from public.aipify_hosts_incidents
    where tenant_id = p_tenant_id and severity = 'critical' and incident_status not in ('resolved', 'closed')
    limit 5
  ), '[]'::jsonb);

  v_items := v_items || coalesce((
    select jsonb_agg(jsonb_build_object(
      'type', 'overdue_cleaning', 'label', 'Overdue cleaning — ' || coalesce(p.display_name, 'property'),
      'property_id', t.property_id, 'severity', 'high', 'link', '/app/aipify-hosts/cleaning'
    ))
    from public.aipify_hosts_cleaning_tasks t
    left join public.aipify_hosts_properties p on p.id = t.property_id
    where t.tenant_id = p_tenant_id and t.due_time < now()
      and t.cleaning_status not in ('completed', 'awaiting_review')
    limit 5
  ), '[]'::jsonb);

  v_items := v_items || coalesce((
    select jsonb_agg(jsonb_build_object(
      'type', 'overdue_maintenance', 'label', description,
      'property_id', w.property_id, 'severity', 'high', 'link', '/app/aipify-hosts/maintenance'
    ))
    from public.aipify_hosts_work_orders w
    where w.tenant_id = p_tenant_id and w.due_date < current_date
      and w.wo_status not in ('completed', 'cancelled')
    limit 5
  ), '[]'::jsonb);

  v_items := v_items || coalesce((
    select jsonb_agg(jsonb_build_object(
      'type', 'failed_inspection', 'label', 'Inspection requires action — ' || coalesce(p.display_name, 'property'),
      'property_id', i.property_id, 'severity', 'high', 'link', '/app/aipify-hosts/quality'
    ))
    from public.aipify_hosts_inspections i
    left join public.aipify_hosts_properties p on p.id = i.property_id
    where i.tenant_id = p_tenant_id
      and (i.inspection_outcome = 'failed' or i.inspection_status = 'requires_action')
    limit 5
  ), '[]'::jsonb);

  v_items := v_items || coalesce((
    select jsonb_agg(jsonb_build_object(
      'type', 'expiring_document', 'label', title || ' expiring',
      'property_id', d.property_id, 'severity', 'medium', 'link', '/app/aipify-hosts/documents'
    ))
    from public.aipify_hosts_documents d
    where d.tenant_id = p_tenant_id and d.is_archived = false
      and d.expiration_date is not null
      and d.expiration_date <= current_date + 30
    limit 5
  ), '[]'::jsonb);

  v_items := v_items || coalesce((
    select jsonb_agg(jsonb_build_object(
      'type', 'critical_health', 'label', 'Critical health — ' || coalesce(p.display_name, 'property'),
      'property_id', s.property_id, 'severity', 'critical', 'link', '/app/aipify-hosts/property-health'
    ))
    from public.aipify_hosts_property_health_scores s
    left join public.aipify_hosts_properties p on p.id = s.property_id
    where s.tenant_id = p_tenant_id and s.score_level = 'critical'
    limit 5
  ), '[]'::jsonb);

  return coalesce(v_items, '[]'::jsonb);
exception when undefined_table then
  return '[]'::jsonb;
end; $$;

create or replace function public._ahostexec_todays_operations(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'arrivals_today', coalesce((
      select count(*)::int from public.aipify_hosts_booking_reservations
      where tenant_id = p_tenant_id and check_in_date = current_date
        and booking_status in ('confirmed', 'pending', 'checked_in')
    ), 0),
    'departures_today', coalesce((
      select count(*)::int from public.aipify_hosts_booking_reservations
      where tenant_id = p_tenant_id and check_out_date = current_date
        and booking_status in ('checked_in', 'confirmed')
    ), 0),
    'cleaning_tasks_today', coalesce((
      select count(*)::int from public.aipify_hosts_cleaning_tasks
      where tenant_id = p_tenant_id and scheduled_date = current_date
        and cleaning_status not in ('completed')
    ), 0),
    'maintenance_tasks_today', coalesce((
      select count(*)::int from public.aipify_hosts_work_orders
      where tenant_id = p_tenant_id and due_date = current_date
        and wo_status not in ('completed', 'cancelled')
    ), 0),
    'pending_guest_requests', coalesce((
      select count(*)::int from public.aipify_hosts_guest_communications
      where tenant_id = p_tenant_id and comm_status in ('draft', 'scheduled', 'failed')
    ), 0)
  );
exception when undefined_table then
  return jsonb_build_object(
    'arrivals_today', 0, 'departures_today', 0,
    'cleaning_tasks_today', 0, 'maintenance_tasks_today', 0, 'pending_guest_requests', 0
  );
end; $$;

create or replace function public._ahostexec_property_health(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_properties jsonb;
begin
  select coalesce(jsonb_agg(jsonb_build_object(
    'property_id', s.property_id,
    'property', coalesce(p.display_name, '—'),
    'overall_score', s.overall_score,
    'score_level', s.score_level
  ) order by case s.score_level
    when 'critical' then 1 when 'attention_required' then 2 when 'good' then 3 else 4 end), '[]'::jsonb)
  into v_properties
  from public.aipify_hosts_property_health_scores s
  left join public.aipify_hosts_properties p on p.id = s.property_id
  where s.tenant_id = p_tenant_id;

  return jsonb_build_object(
    'excellent', coalesce((select count(*)::int from public.aipify_hosts_property_health_scores where tenant_id = p_tenant_id and score_level = 'excellent'), 0),
    'good', coalesce((select count(*)::int from public.aipify_hosts_property_health_scores where tenant_id = p_tenant_id and score_level = 'good'), 0),
    'attention_required', coalesce((select count(*)::int from public.aipify_hosts_property_health_scores where tenant_id = p_tenant_id and score_level = 'attention_required'), 0),
    'critical', coalesce((select count(*)::int from public.aipify_hosts_property_health_scores where tenant_id = p_tenant_id and score_level = 'critical'), 0),
    'properties', coalesce(v_properties, '[]'::jsonb)
  );
exception when undefined_table then
  return jsonb_build_object('excellent', 0, 'good', 0, 'attention_required', 0, 'critical', 0, 'properties', '[]'::jsonb);
end; $$;

create or replace function public._ahostexec_financial_snapshot(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_overview jsonb;
begin
  v_overview := public._ahostfin_overview(p_tenant_id);
  return jsonb_build_object(
    'revenue_this_month', v_overview->'revenue_this_month',
    'upcoming_payouts', v_overview->'upcoming_payouts',
    'outstanding_expenses', v_overview->'outstanding_expenses',
    'estimated_net_position', v_overview->'net_performance'
  );
exception when undefined_function or undefined_table then
  return jsonb_build_object(
    'revenue_this_month', 0, 'upcoming_payouts', 0,
    'outstanding_expenses', 0, 'estimated_net_position', 0
  );
end; $$;

create or replace function public._ahostexec_upcoming_events(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'event_key', e.event_key, 'event_type', e.event_type,
    'title', e.title, 'event_date', e.event_date::text,
    'property_id', e.property_id, 'property', coalesce(p.display_name, '—'),
    'summary', coalesce(e.summary, '')
  ) order by e.event_date), '[]'::jsonb)
  from public.aipify_hosts_executive_upcoming_events e
  left join public.aipify_hosts_properties p on p.id = e.property_id
  where e.tenant_id = p_tenant_id and e.event_date >= current_date
  limit 20; $$;

create or replace function public._ahostexec_notifications(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_items jsonb := '[]'::jsonb;
begin
  v_items := v_items || coalesce((
    select jsonb_agg(jsonb_build_object(
      'type', 'critical_alert', 'title', title, 'message', message, 'priority', priority
    ))
    from public.aipify_hosts_notifications
    where tenant_id = p_tenant_id and priority in ('critical', 'high') and notification_status = 'unread'
    limit 5
  ), '[]'::jsonb);

  v_items := v_items || coalesce((
    select jsonb_agg(jsonb_build_object(
      'type', 'pending_approval', 'title', summary, 'message', category, 'priority', impact_level
    ))
    from public.aipify_hosts_companion_approvals
    where tenant_id = p_tenant_id and status = 'pending'
    limit 5
  ), '[]'::jsonb);

  return coalesce(v_items, '[]'::jsonb);
exception when undefined_table then
  return '[]'::jsonb;
end; $$;

create or replace function public._ahostexec_seed_demo(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_prop uuid;
begin
  if exists (select 1 from public.aipify_hosts_executive_upcoming_events where tenant_id = p_tenant_id limit 1) then return; end if;
  select id into v_prop from public.aipify_hosts_properties
  where tenant_id = p_tenant_id and status = 'active' order by created_at limit 1;

  insert into public.aipify_hosts_executive_upcoming_events (
    tenant_id, property_id, event_key, event_type, title, event_date, summary
  ) values
    (p_tenant_id, v_prop, 'evt_owner_001', 'owner_stay', 'Owner personal stay', current_date + 45, 'Blocked dates for owner visit.'),
    (p_tenant_id, v_prop, 'evt_season_001', 'seasonal_closure', 'Winter seasonal closure', current_date + 90, 'Reduced operations period.'),
    (p_tenant_id, v_prop, 'evt_insp_001', 'scheduled_inspection', 'Quarterly quality inspection', current_date + 14, 'Property readiness review.'),
    (p_tenant_id, v_prop, 'evt_pm_001', 'preventive_maintenance', 'HVAC semi-annual service', current_date + 30, 'Scheduled preventive maintenance.'),
    (p_tenant_id, v_prop, 'evt_doc_001', 'document_renewal', 'Insurance certificate renewal', current_date + 21, 'Renew before expiration.')
  on conflict (tenant_id, event_key) do nothing;
end; $$;

create or replace function public.get_aipify_hosts_executive_dashboard_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_hosts public.aipify_hosts_settings; v_summary jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  perform public._ahostexec_ensure_settings(v_tenant_id);
  v_summary := public._ahostexec_executive_summary(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true, 'enabled', v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'active_properties', v_summary->'active_properties',
    'occupancy_rate', v_summary->'occupancy_rate',
    'philosophy', public._ahostbp398_positioning()
  );
end; $$;

create or replace function public.get_aipify_hosts_executive_dashboard(
  p_org_id uuid default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_ed public.aipify_hosts_executive_dashboard_settings;
  v_hosts public.aipify_hosts_settings;
  v_attention jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_ed := public._ahostexec_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  perform public._ahostexec_seed_demo(v_tenant_id);

  v_attention := public._ahostexec_requires_attention(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_ed.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'positioning', public._ahostbp398_positioning(),
    'governance', jsonb_build_object(
      'role_permissions', true,
      'audit_preference_changes', true,
      'business_pack_access', true
    ),
    'widget_preferences', v_ed.widget_preferences,
    'default_widgets', public._ahostbp398_default_widgets(),
    'executive_summary', public._ahostexec_executive_summary(v_tenant_id),
    'requires_attention', v_attention,
    'requires_attention_count', jsonb_array_length(v_attention),
    'todays_operations', public._ahostexec_todays_operations(v_tenant_id),
    'property_health', public._ahostexec_property_health(v_tenant_id),
    'financial_snapshot', public._ahostexec_financial_snapshot(v_tenant_id),
    'upcoming_events', public._ahostexec_upcoming_events(v_tenant_id),
    'notifications', public._ahostexec_notifications(v_tenant_id),
    'quick_actions', jsonb_build_array(
      jsonb_build_object('key', 'add_property', 'route', '/app/aipify-hosts/properties'),
      jsonb_build_object('key', 'create_work_order', 'route', '/app/aipify-hosts/maintenance'),
      jsonb_build_object('key', 'schedule_inspection', 'route', '/app/aipify-hosts/quality'),
      jsonb_build_object('key', 'open_operations', 'route', '/app/aipify-hosts/operations'),
      jsonb_build_object('key', 'view_marketplace', 'route', '/app/aipify-hosts/marketplace')
    ),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 36 — Executive Dashboard Foundation',
      'doc', 'aipify-hosts/PHASE_AIRBNB_36_EXECUTIVE_DASHBOARD.text',
      'route', '/app/aipify-hosts/executive'
    )
  );
end; $$;

create or replace function public.perform_aipify_hosts_executive_action(
  p_action_type text,
  p_preferences jsonb default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;

  if p_action_type = 'save_widget_preferences' then
    update public.aipify_hosts_executive_dashboard_settings set
      widget_preferences = coalesce(p_preferences, widget_preferences),
      updated_at = now()
    where tenant_id = v_tenant_id;
    perform public._ahostexec_log_event(v_tenant_id, 'preference_changed', 'Widget preferences saved', p_preferences);
    return jsonb_build_object('success', true, 'summary', 'Preferences saved');
  end if;

  raise exception 'Invalid action type';
end; $$;

create or replace function public.seed_aipify_hosts_executive_dashboard_knowledge_airbnb36()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ahostkc_ensure_category(
    'aipify-hosts-executive', 'Hosts Executive Dashboard',
    'Executive overview, operational prioritization, business performance, and risk management.', 331
  );
  perform public._ahostkc_seed_article('aipify-hosts-executive', 'understanding-executive-dashboards', 'Understanding Executive Dashboards',
    'The Executive Dashboard surfaces summary metrics, attention items, and today''s operations in one view — designed for a 60-second business health check.');
  perform public._ahostkc_seed_article('aipify-hosts-executive', 'prioritizing-hospitality-operations', 'Prioritizing hospitality operations',
    'Review Requires Attention first — critical incidents, overdue tasks, failed inspections, and expiring documents before they impact guests.');
  perform public._ahostkc_seed_article('aipify-hosts-executive', 'reviewing-business-performance', 'Reviewing business performance',
    'Use occupancy, revenue, and financial snapshot widgets to understand monthly performance and estimated net position.');
  perform public._ahostkc_seed_article('aipify-hosts-executive', 'managing-operational-risk', 'Managing operational risk',
    'Monitor property health levels, operational notifications, and upcoming events to reduce surprises across your portfolio.');
end; $$;

select public.seed_aipify_hosts_executive_dashboard_knowledge_airbnb36();

grant execute on function public.get_aipify_hosts_executive_dashboard_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_executive_dashboard(uuid) to authenticated;
grant execute on function public.perform_aipify_hosts_executive_action(text, jsonb, uuid) to authenticated;
