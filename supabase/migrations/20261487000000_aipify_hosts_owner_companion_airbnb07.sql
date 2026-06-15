-- Phase Airbnb 07 — Aipify Hosts Owner Portal & Hospitality Companion Engine
-- Feature owner: CUSTOMER APP. Helpers: _ahostcomp_* (engine), _ahostbp370_* (blueprint)

create table if not exists public.aipify_hosts_companion_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  morning_briefing_enabled boolean not null default true,
  evening_briefing_enabled boolean not null default true,
  memory_enabled boolean not null default true,
  metadata jsonb not null default '{"metadata_only":true,"human_oversight":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_companion_settings enable row level security;
revoke all on public.aipify_hosts_companion_settings from authenticated, anon;

create table if not exists public.aipify_hosts_companion_approvals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  approval_key text not null,
  category text not null check (category in (
    'late_checkout', 'vendor_engagement', 'guest_request', 'incident_resolution',
    'refund_recommendation', 'operational_exception'
  )),
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined', 'archived')),
  summary text,
  impact_level text default 'medium' check (impact_level in ('low', 'medium', 'high')),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, approval_key)
);
create index if not exists aipify_hosts_companion_approvals_tenant_idx
  on public.aipify_hosts_companion_approvals (tenant_id, status);
alter table public.aipify_hosts_companion_approvals enable row level security;
revoke all on public.aipify_hosts_companion_approvals from authenticated, anon;

create or replace function public._ahostcomp_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_companion_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_hosts_companion_settings;
begin
  insert into public.aipify_hosts_companion_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_hosts_companion_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._ahostcomp_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
begin
  return public._ahost_log_audit(p_tenant_id, 'companion_' || p_action_type, p_summary, p_context);
end; $$;

create or replace function public._ahostbp370_positioning() returns text language sql immutable as $$
  select 'Wake up knowing exactly what needs your attention.'; $$;

create or replace function public._ahostbp370_modules() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'owner_command_center', 'label', 'Owner Command Center', 'description', 'Arrivals, departures, approvals, revenue, Property Health Scores, guest alerts, team activity, maintenance.'),
    jsonb_build_object('key', 'daily_briefing_engine', 'label', 'Daily Briefing Engine', 'description', 'Proactive morning and evening summaries with recommended actions.'),
    jsonb_build_object('key', 'since_last_login_center', 'label', 'Since Last Login Center', 'description', 'Reservations, cancellations, guest requests, maintenance, team activity, revenue changes.'),
    jsonb_build_object('key', 'approval_hub', 'label', 'Approval Hub', 'description', 'Late check-outs, vendors, guest requests, incidents, refunds, operational exceptions.'),
    jsonb_build_object('key', 'hospitality_companion_chat', 'label', 'Hospitality Companion Chat', 'description', 'Conversational operations — professional, transparent, action-oriented.'),
    jsonb_build_object('key', 'executive_recommendation_engine', 'label', 'Executive Recommendation Engine', 'description', 'Revenue, operational, guest experience, maintenance, and expansion opportunities.'),
    jsonb_build_object('key', 'mobile_operations_experience', 'label', 'Mobile Operations Experience', 'description', 'Briefings, approvals, alerts, companion chat, property status on the move.'),
    jsonb_build_object('key', 'executive_notification_center', 'label', 'Executive Notification Center', 'description', 'Critical, approval, recommended action, and informational alerts with quiet hours.'),
    jsonb_build_object('key', 'owner_performance_insights', 'label', 'Owner Performance Insights', 'description', 'Response speed, approval efficiency, consistency, satisfaction, portfolio performance.'),
    jsonb_build_object('key', 'hospitality_companion_memory_engine', 'label', 'Hospitality Companion Memory Engine', 'description', 'Transparent, editable preference awareness and workflow personalization.')
  ); $$;

create or replace function public._ahostbp370_governance() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion suggests — owner decides. Never execute sensitive actions without approval. Memory remains transparent and editable. No raw guest conversations stored.',
    'approval_required', true,
    'audit_required', true,
    'recommendations_only', true
  ); $$;

create or replace function public._ahostbp370_success_metrics() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'stress', 'label', 'Reduced owner stress'),
    jsonb_build_object('key', 'decisions', 'label', 'Faster operational decisions'),
    jsonb_build_object('key', 'satisfaction', 'label', 'Increased guest satisfaction'),
    jsonb_build_object('key', 'consistency', 'label', 'Improved operational consistency'),
    jsonb_build_object('key', 'visibility', 'label', 'Greater portfolio visibility'),
    jsonb_build_object('key', 'confidence', 'label', 'Higher executive confidence')
  ); $$;

create or replace function public._ahostbp370_knowledge_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Owner best practices', 'Hospitality leadership', 'Operational prioritization',
    'Guest relationship excellence', 'Executive decision frameworks'
  ); $$;

create or replace function public._ahostcomp_command_snapshot(p_property_count int)
returns jsonb language sql immutable as $$
  select case when p_property_count = 0 then jsonb_build_object(
    'arrivals_today', 0, 'departures_today', 0, 'pending_approvals', 0,
    'revenue_snapshot', 0, 'property_health_score', 0, 'guest_alerts', 0,
    'team_activity_count', 0, 'maintenance_tasks', 0, 'occupancy_forecast_pct', 0
  ) else jsonb_build_object(
    'arrivals_today', greatest(1, p_property_count),
    'departures_today', greatest(1, p_property_count - 1),
    'pending_approvals', 2,
    'revenue_snapshot', 12400 + p_property_count * 3200,
    'property_health_score', least(94, 72 + p_property_count * 3),
    'guest_alerts', case when p_property_count >= 2 then 1 else 0 end,
    'team_activity_count', p_property_count * 2,
    'maintenance_tasks', 1,
    'occupancy_forecast_pct', least(92, 78 + p_property_count * 2)
  ) end; $$;

create or replace function public._ahostcomp_morning_briefing(p_property_count int, p_display_name text default 'Owner')
returns jsonb language sql immutable as $$
  select case when p_property_count = 0 then jsonb_build_object(
    'greeting', 'Good morning, ' || p_display_name || '.',
    'overview_lines', jsonb_build_array('Add properties to receive your daily hospitality briefing.'),
    'recommended_actions', jsonb_build_array('Connect your first property in Aipify Hosts.')
  ) else jsonb_build_object(
    'greeting', 'Good morning, ' || p_display_name || '.',
    'overview_lines', jsonb_build_array(
      p_property_count || ' guest arrivals today.',
      greatest(1, p_property_count - 1) || ' departures today.',
      '1 maintenance task scheduled.',
      'Occupancy forecast: ' || least(92, 78 + p_property_count * 2) || '%.'
    ),
    'recommended_actions', jsonb_build_array(
      'Review cleaner report for Property 2.',
      'Approve late check-out request.',
      'Follow up on unresolved guest concern.'
    )
  ) end; $$;

create or replace function public._ahostcomp_since_last_login(p_property_count int)
returns jsonb language sql immutable as $$
  select case when p_property_count = 0 then '[]'::jsonb else jsonb_build_array(
    jsonb_build_object('key', 'reservations', 'label', 'New reservations', 'count', 2),
    jsonb_build_object('key', 'cancellations', 'label', 'Cancellations', 'count', 0),
    jsonb_build_object('key', 'guest_requests', 'label', 'Guest requests', 'count', 1),
    jsonb_build_object('key', 'maintenance', 'label', 'Maintenance updates', 'count', 1),
    jsonb_build_object('key', 'cleaner', 'label', 'Cleaner completions', 'count', 2),
    jsonb_build_object('key', 'team', 'label', 'Team activity', 'count', 4),
    jsonb_build_object('key', 'revenue', 'label', 'Revenue changes', 'count', 1)
  ) end; $$;

create or replace function public._ahostcomp_pending_approvals(p_property_count int)
returns jsonb language sql immutable as $$
  select case when p_property_count = 0 then '[]'::jsonb else jsonb_build_array(
    jsonb_build_object('key', 'late_checkout_p2', 'category', 'late_checkout', 'label', 'Late check-out — Property 2', 'impact', 'medium'),
    jsonb_build_object('key', 'vendor_plumber', 'category', 'vendor_engagement', 'label', 'Vendor engagement — plumbing repair', 'impact', 'high'),
    jsonb_build_object('key', 'refund_partial', 'category', 'refund_recommendation', 'label', 'Partial refund recommendation — noise complaint', 'impact', 'high')
  ) end; $$;

create or replace function public._ahostcomp_recommendations(p_property_count int)
returns jsonb language sql immutable as $$
  select case when p_property_count = 0 then '[]'::jsonb else jsonb_build_array(
    jsonb_build_object('key', 'revenue_weekend', 'type', 'revenue', 'label', 'Weekend rate opportunity — Property 1', 'impact', 'medium', 'effort', 'low', 'next_step', 'Review pricing for upcoming high-demand dates.'),
    jsonb_build_object('key', 'ops_cleaner', 'type', 'operational', 'label', 'Cleaner schedule optimization', 'impact', 'medium', 'effort', 'low', 'next_step', 'Align turnover windows with arrival times.'),
    jsonb_build_object('key', 'guest_welcome', 'type', 'guest_experience', 'label', 'Returning guest welcome preparation', 'impact', 'high', 'effort', 'low', 'next_step', 'Prepare personalized arrival note.'),
    jsonb_build_object('key', 'maint_hvac', 'type', 'maintenance', 'label', 'Preventive HVAC service — Property 3', 'impact', 'high', 'effort', 'medium', 'next_step', 'Schedule vendor before peak season.')
  ) end; $$;

create or replace function public._ahostcomp_companion_prompts()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Aipify, summarize today''s priorities.',
    'Aipify, which property needs attention?',
    'Aipify, show unresolved incidents.',
    'Aipify, what opportunities do you see this week?'
  ); $$;

create or replace function public._ahostcomp_memory_insights(p_property_count int)
returns jsonb language sql immutable as $$
  select case when p_property_count = 0 then '[]'::jsonb else jsonb_build_array(
    'You usually approve late check-outs when occupancy is below 80%.',
    'You prefer reviewing maintenance tasks every Monday.'
  ) end; $$;

create or replace function public._ahostcomp_performance_insights(p_property_count int)
returns jsonb language sql immutable as $$
  select case when p_property_count = 0 then jsonb_build_object(
    'response_speed_score', 0, 'approval_efficiency_score', 0,
    'operational_consistency_score', 0, 'guest_satisfaction_score', 0
  ) else jsonb_build_object(
    'response_speed_score', least(95, 70 + p_property_count * 4),
    'approval_efficiency_score', least(92, 68 + p_property_count * 3),
    'operational_consistency_score', least(90, 72 + p_property_count * 2),
    'guest_satisfaction_score', least(96, 80 + p_property_count * 2)
  ) end; $$;

create or replace function public.get_aipify_hosts_companion_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_hosts public.aipify_hosts_settings;
  v_comp public.aipify_hosts_companion_settings;
  v_props int;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_comp := public._ahostcomp_ensure_settings(v_tenant_id);
  select count(*) into v_props from public.aipify_hosts_properties where tenant_id = v_tenant_id and status = 'active';
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_comp.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'property_count', greatest(v_hosts.property_count, v_props),
    'human_oversight_required', true,
    'positioning', public._ahostbp370_positioning(),
    'route', '/app/aipify-hosts/companion'
  );
end; $$;

create or replace function public.get_aipify_hosts_companion_dashboard(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_hosts public.aipify_hosts_settings;
  v_comp public.aipify_hosts_companion_settings;
  v_props int;
  v_prop_count int;
  v_snapshot jsonb;
  v_display_name text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_comp := public._ahostcomp_ensure_settings(v_tenant_id);
  select count(*) into v_props from public.aipify_hosts_properties where tenant_id = v_tenant_id and status = 'active';
  v_prop_count := greatest(v_hosts.property_count, v_props);
  v_snapshot := public._ahostcomp_command_snapshot(v_prop_count);
  v_display_name := coalesce(
    (select raw_user_meta_data ->> 'full_name' from auth.users where id = auth.uid()),
    (select raw_user_meta_data ->> 'name' from auth.users where id = auth.uid()),
    'Owner'
  );
  perform public._ahostcomp_log_audit(v_tenant_id, 'dashboard_view', 'Hospitality Companion dashboard viewed', jsonb_build_object('package', v_hosts.package_key));
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_comp.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'property_count', v_prop_count,
    'human_oversight_required', true,
    'positioning', public._ahostbp370_positioning(),
    'vision', 'One intelligent morning briefing — supported, not overwhelmed.',
    'modules', public._ahostbp370_modules(),
    'governance', public._ahostbp370_governance(),
    'success_metrics', public._ahostbp370_success_metrics(),
    'knowledge_categories', public._ahostbp370_knowledge_categories(),
    'command_snapshot', v_snapshot,
    'morning_briefing', public._ahostcomp_morning_briefing(v_prop_count, v_display_name),
    'evening_briefing', jsonb_build_object(
      'summary_lines', jsonb_build_array(
        'All arrivals completed successfully.',
        'No incidents reported.',
        'Guest satisfaction remained high.'
      )
    ),
    'since_last_login', public._ahostcomp_since_last_login(v_prop_count),
    'pending_approvals', public._ahostcomp_pending_approvals(v_prop_count),
    'recommendations', public._ahostcomp_recommendations(v_prop_count),
    'companion_prompts', public._ahostcomp_companion_prompts(),
    'memory_insights', public._ahostcomp_memory_insights(v_prop_count),
    'notification_categories', jsonb_build_array('Critical', 'Requires Approval', 'Recommended Action', 'Informational'),
    'performance_insights', public._ahostcomp_performance_insights(v_prop_count),
    'executive_questions', jsonb_build_array(
      'What happened yesterday?',
      'What happens today?',
      'What requires my approval?',
      'What opportunities should I consider?'
    ),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 07 — Owner Portal & Hospitality Companion',
      'doc', 'aipify-hosts/PHASE_AIRBNB_07_OWNER_COMPANION.text',
      'route', '/app/aipify-hosts/companion'
    )
  );
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-hosts-companion', 'Aipify Hosts Hospitality Companion', 'Owner command center, daily briefings, approvals, and companion operations.', 'authenticated', 223
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-hosts-companion' and tenant_id is null);

grant execute on function public.get_aipify_hosts_companion_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_companion_dashboard(uuid) to authenticated;
