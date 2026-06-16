-- Phase Airbnb 32 — Aipify Hosts Upgrade Signals & Recommendations
-- Depends: Foundation 02 Marketplace Self-Service · Hosts Property Licensing
-- Helpers: _ahostus_* (engine), _ahostbp394_* (blueprint)

create table if not exists public.aipify_hosts_upgrade_signals_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  show_recommendations boolean not null default true,
  metadata jsonb not null default '{"recommend_only":true,"no_pressure":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_upgrade_signals_settings enable row level security;
revoke all on public.aipify_hosts_upgrade_signals_settings from authenticated, anon;

create table if not exists public.aipify_hosts_upgrade_signal_dismissals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_key text not null,
  dismissed_at timestamptz not null default now(),
  unique (tenant_id, signal_key)
);
alter table public.aipify_hosts_upgrade_signal_dismissals enable row level security;
revoke all on public.aipify_hosts_upgrade_signal_dismissals from authenticated, anon;

create table if not exists public.aipify_hosts_upgrade_signal_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action text not null check (
    action in (
      'recommendation_shown', 'upgrade_click', 'payment_completed',
      'license_changed', 'signal_dismissed', 'business_pack_suggested'
    )
  ),
  summary text not null,
  signal_key text,
  recommendation_key text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_upgrade_signal_audit_tenant_idx
  on public.aipify_hosts_upgrade_signal_audit_logs (tenant_id, created_at desc);
alter table public.aipify_hosts_upgrade_signal_audit_logs enable row level security;
revoke all on public.aipify_hosts_upgrade_signal_audit_logs from authenticated, anon;

create or replace function public._ahostus_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_upgrade_signals_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_hosts_upgrade_signals_settings;
begin
  insert into public.aipify_hosts_upgrade_signals_settings (tenant_id, enabled, show_recommendations)
  values (p_tenant_id, true, true) on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_hosts_upgrade_signals_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ahostus_log_audit(
  p_tenant_id uuid, p_action text, p_summary text,
  p_signal_key text default null, p_recommendation_key text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_hosts_upgrade_signal_audit_logs (
    tenant_id, action, summary, signal_key, recommendation_key, context
  ) values (
    p_tenant_id, p_action, p_summary, p_signal_key, p_recommendation_key, coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  perform public._ahost_log_audit(p_tenant_id, 'upgrade_signal_' || p_action, p_summary, p_context);
  return v_id;
end; $$;

create or replace function public._ahostbp394_positioning() returns text language sql immutable as $$
  select 'Aipify recommends upgrades when your hospitality business grows — calmly, without pressure or blocking existing operations.'; $$;

create or replace function public._ahostbp394_signal_types() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'property_limit_reached', 'label', 'Property limit reached'),
    jsonb_build_object('key', 'property_limit_nearly_reached', 'label', 'Property limit nearly reached'),
    jsonb_build_object('key', 'multiple_properties_added', 'label', 'Multiple properties added'),
    jsonb_build_object('key', 'high_operational_workload', 'label', 'High operational workload'),
    jsonb_build_object('key', 'repeated_manual_tasks', 'label', 'Repeated manual tasks'),
    jsonb_build_object('key', 'team_members_increased', 'label', 'More team members invited'),
    jsonb_build_object('key', 'increased_guest_activity', 'label', 'Increased guest activity'),
    jsonb_build_object('key', 'incidents_maintenance_volume', 'label', 'More incidents or maintenance volume')
  ); $$;

create or replace function public._ahostus_next_plan(p_current text)
returns text language sql immutable as $$
  select case public._ahostlic_normalize_plan(p_current)
    when 'hosts_solo' then 'hosts_5'
    when 'hosts_5' then 'hosts_10'
    when 'hosts_10' then 'hosts_20'
    when 'hosts_20' then 'hosts_enterprise'
    else null
  end;
$$;

create or replace function public._ahostus_compute_signals(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_licensing jsonb;
  v_active int;
  v_limit int;
  v_remaining int;
  v_plan text;
  v_signals jsonb := '[]'::jsonb;
  v_tasks_open int := 0;
  v_tasks_manual int := 0;
  v_team_recent int := 0;
  v_guest_msgs int := 0;
  v_incidents_30d int := 0;
  v_props_30d int := 0;
  v_dismissed text[];
begin
  v_licensing := public.assert_aipify_hosts_property_capacity(p_tenant_id);
  v_active := coalesce((v_licensing->>'active_property_count')::int, 0);
  v_limit := coalesce((v_licensing->>'property_limit')::int, 1);
  v_remaining := coalesce((v_licensing->>'remaining_capacity')::int, 0);
  v_plan := coalesce(v_licensing->>'plan_type', 'hosts_solo');

  select coalesce(array_agg(signal_key), array[]::text[]) into v_dismissed
  from public.aipify_hosts_upgrade_signal_dismissals where tenant_id = p_tenant_id;

  if coalesce((v_licensing->>'at_capacity')::boolean, false) then
    v_signals := v_signals || jsonb_build_array(jsonb_build_object(
      'signal_key', 'property_limit_reached', 'severity', 'high', 'priority', 100,
      'title', 'Property limit reached',
      'message', 'You have reached your property limit. Existing properties remain fully operational.',
      'context', jsonb_build_object('active_property_count', v_active, 'property_limit', v_limit, 'plan_type', v_plan)
    ));
  elsif v_limit > 0 and v_remaining <= 1 then
    v_signals := v_signals || jsonb_build_array(jsonb_build_object(
      'signal_key', 'property_limit_nearly_reached', 'severity', 'moderate', 'priority', 85,
      'title', 'Property limit nearly reached',
      'message', format('You are using %s of %s property licenses.', v_active, v_limit),
      'context', jsonb_build_object('active_property_count', v_active, 'property_limit', v_limit, 'remaining_capacity', v_remaining)
    ));
  end if;

  select count(*)::int into v_props_30d from public.aipify_hosts_properties
  where tenant_id = p_tenant_id and created_at >= now() - interval '30 days' and status = 'active';
  if v_props_30d >= 2 then
    v_signals := v_signals || jsonb_build_array(jsonb_build_object(
      'signal_key', 'multiple_properties_added', 'severity', 'moderate', 'priority', 70,
      'title', 'Portfolio growth detected',
      'message', format('%s properties were added in the last 30 days.', v_props_30d),
      'context', jsonb_build_object('properties_added_30d', v_props_30d)
    ));
  end if;

  begin
    select count(*)::int into v_tasks_open from public.aipify_hosts_tasks
    where tenant_id = p_tenant_id and task_status in ('open', 'in_progress', 'pending');
    if v_tasks_open >= 15 then
      v_signals := v_signals || jsonb_build_array(jsonb_build_object(
        'signal_key', 'high_operational_workload', 'severity', 'moderate', 'priority', 65,
        'title', 'High operational workload',
        'message', format('%s open operational tasks across your portfolio.', v_tasks_open),
        'context', jsonb_build_object('open_tasks', v_tasks_open)
      ));
    end if;
    select count(*)::int into v_tasks_manual from public.aipify_hosts_tasks
    where tenant_id = p_tenant_id and created_at >= now() - interval '14 days'
      and coalesce(metadata->>'manual_repeat', 'false') = 'true';
    if v_tasks_manual >= 5 or v_tasks_open >= 20 then
      v_signals := v_signals || jsonb_build_array(jsonb_build_object(
        'signal_key', 'repeated_manual_tasks', 'severity', 'low', 'priority', 55,
        'title', 'Repeated manual tasks',
        'message', 'Operational volume suggests additional capacity or automation may help.',
        'context', jsonb_build_object('open_tasks', v_tasks_open)
      ));
    end if;
  exception when undefined_table then null;
  end;

  begin
    select count(*)::int into v_team_recent from public.aipify_hosts_team_members
    where tenant_id = p_tenant_id and created_at >= now() - interval '30 days';
    if v_team_recent >= 2 then
      v_signals := v_signals || jsonb_build_array(jsonb_build_object(
        'signal_key', 'team_members_increased', 'severity', 'moderate', 'priority', 60,
        'title', 'Team is growing',
        'message', format('%s team members joined in the last 30 days.', v_team_recent),
        'context', jsonb_build_object('team_members_30d', v_team_recent)
      ));
    end if;
  exception when undefined_table then null;
  end;

  begin
    select count(*)::int into v_guest_msgs from public.aipify_hosts_guest_communications
    where tenant_id = p_tenant_id and created_at >= now() - interval '30 days';
    if v_guest_msgs >= 20 then
      v_signals := v_signals || jsonb_build_array(jsonb_build_object(
        'signal_key', 'increased_guest_activity', 'severity', 'moderate', 'priority', 58,
        'title', 'Increased guest activity',
        'message', 'Guest communication volume has increased — additional capacity may support smoother operations.',
        'context', jsonb_build_object('guest_messages_30d', v_guest_msgs)
      ));
    end if;
  exception when undefined_table then null;
  end;

  begin
    select count(*)::int into v_incidents_30d from public.aipify_hosts_incidents
    where tenant_id = p_tenant_id and created_at >= now() - interval '30 days';
    if v_incidents_30d >= 3 then
      v_signals := v_signals || jsonb_build_array(jsonb_build_object(
        'signal_key', 'incidents_maintenance_volume', 'severity', 'moderate', 'priority', 62,
        'title', 'Higher incident and maintenance volume',
        'message', format('%s incidents recorded in the last 30 days.', v_incidents_30d),
        'context', jsonb_build_object('incidents_30d', v_incidents_30d)
      ));
    end if;
  exception when undefined_table then null;
  end;

  return coalesce((
    select jsonb_agg(s order by (s->>'priority')::int desc)
    from jsonb_array_elements(v_signals) s
    where not ((s->>'signal_key') = any (v_dismissed))
  ), '[]'::jsonb);
end; $$;

create or replace function public._ahostus_recommendations(p_tenant_id uuid, p_signals jsonb)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_licensing jsonb;
  v_plan text;
  v_next_plan text;
  v_recs jsonb := '[]'::jsonb;
  v_has_limit_signal boolean := false;
  v_signal jsonb;
begin
  v_licensing := public.assert_aipify_hosts_property_capacity(p_tenant_id);
  v_plan := coalesce(v_licensing->>'plan_type', 'hosts_solo');
  v_next_plan := public._ahostus_next_plan(v_plan);

  for v_signal in select jsonb_array_elements(coalesce(p_signals, '[]'::jsonb))
  loop
    if v_signal->>'signal_key' in ('property_limit_reached', 'property_limit_nearly_reached', 'multiple_properties_added') then
      v_has_limit_signal := true;
    end if;
  end loop;

  if coalesce((v_licensing->>'at_capacity')::boolean, false) and v_next_plan is not null then
    v_recs := v_recs || jsonb_build_array(jsonb_build_object(
      'recommendation_key', 'upgrade_' || v_next_plan,
      'recommendation_type', 'plan_upgrade',
      'title', 'Upgrade to ' || initcap(replace(v_next_plan, '_', ' ')),
      'message', 'You have reached your property limit. Upgrade to ' || initcap(replace(v_next_plan, '_', ' ')) || ' or add a +1 Property License.',
      'action_type', 'upgrade',
      'action_target', v_next_plan,
      'priority', 100,
      'routes', jsonb_build_object(
        'upgrade', '/app/settings/billing/packages',
        'marketplace', '/app/marketplace/activation',
        'add_license', '/app/aipify-hosts/upgrade-signals'
      )
    ));
    v_recs := v_recs || jsonb_build_array(jsonb_build_object(
      'recommendation_key', 'add_property_license',
      'recommendation_type', 'property_license',
      'title', 'Add +1 Property License',
      'message', 'Add one property license without changing your full plan.',
      'action_type', 'add_license',
      'action_target', '+1',
      'priority', 95,
      'routes', jsonb_build_object('marketplace', '/app/marketplace/activation')
    ));
  elsif v_has_limit_signal and v_next_plan is not null then
    v_recs := v_recs || jsonb_build_array(jsonb_build_object(
      'recommendation_key', 'upgrade_' || v_next_plan,
      'recommendation_type', 'plan_upgrade',
      'title', 'Upgrade to ' || initcap(replace(v_next_plan, '_', ' ')),
      'message', 'Your portfolio is growing. Consider upgrading before you reach your property limit.',
      'action_type', 'upgrade',
      'action_target', v_next_plan,
      'priority', 80,
      'routes', jsonb_build_object('upgrade', '/app/settings/billing/packages', 'marketplace', '/app/marketplace/activation')
    ));
  end if;

  if jsonb_array_length(coalesce(p_signals, '[]'::jsonb)) > 0 then
    v_recs := v_recs || jsonb_build_array(jsonb_build_object(
      'recommendation_key', 'activate_communication_center',
      'recommendation_type', 'business_pack',
      'title', 'Activate Communication Center',
      'message', 'Centralize guest and team communications as activity increases.',
      'action_type', 'activate_pack',
      'action_target', 'aipify_hosts',
      'priority', 40,
      'routes', jsonb_build_object('marketplace', '/app/marketplace/activation', 'workspace', '/app/aipify-hosts/communications')
    ));
  end if;

  return coalesce((
    select jsonb_agg(r order by (r->>'priority')::int desc)
    from jsonb_array_elements(v_recs) r
  ), '[]'::jsonb);
end; $$;

create or replace function public.get_aipify_hosts_upgrade_signals_dashboard(
  p_surface text default 'upgrade_signals'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_hosts_upgrade_signals_settings;
  v_hosts public.aipify_hosts_settings;
  v_signals jsonb;
  v_recs jsonb;
  v_licensing jsonb;
begin
  v_tenant_id := public._ahost_require_tenant();
  v_settings := public._ahostus_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_licensing := public.assert_aipify_hosts_property_capacity(v_tenant_id);
  v_signals := public._ahostus_compute_signals(v_tenant_id);
  v_recs := public._ahostus_recommendations(v_tenant_id, v_signals);

  perform public._ahostus_log_audit(
    v_tenant_id, 'recommendation_shown',
    'Upgrade signals dashboard viewed',
    null, null,
    jsonb_build_object('surface', p_surface, 'signal_count', jsonb_array_length(v_signals), 'recommendation_count', jsonb_array_length(v_recs))
  );

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'surface', p_surface,
    'positioning', public._ahostbp394_positioning(),
    'principle', 'Recommend. Do not pressure. Do not block existing operations.',
    'governance_note', 'Recommendations shown audited · Upgrade clicks audited · Payments audited · License changes audited',
    'licensing', v_licensing,
    'signal_types', public._ahostbp394_signal_types(),
    'signals', v_signals,
    'recommendations', v_recs,
    'display_surfaces', jsonb_build_array(
      jsonb_build_object('key', 'hosts_dashboard', 'route', '/app/aipify-hosts'),
      jsonb_build_object('key', 'marketplace', 'route', '/app/marketplace/activation'),
      jsonb_build_object('key', 'billing', 'route', '/app/settings/billing/packages'),
      jsonb_build_object('key', 'property_center', 'route', '/app/aipify-hosts/properties'),
      jsonb_build_object('key', 'operations_center', 'route', '/app/aipify-hosts/operations')
    ),
    'routes', jsonb_build_object(
      'upgrade', '/app/settings/billing/packages',
      'marketplace', '/app/marketplace/activation',
      'upgrade_signals', '/app/aipify-hosts/upgrade-signals'
    )
  );
end; $$;

create or replace function public.get_aipify_hosts_upgrade_signals_card(
  p_surface text default 'embed'
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_hosts_upgrade_signals_settings;
  v_hosts public.aipify_hosts_settings;
  v_signals jsonb;
  v_recs jsonb;
  v_primary jsonb;
begin
  v_tenant_id := public._ahost_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._ahostus_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  if not v_settings.enabled or not v_settings.show_recommendations or not v_hosts.enabled then
    return jsonb_build_object('has_customer', true, 'show_banner', false);
  end if;

  v_signals := public._ahostus_compute_signals(v_tenant_id);
  v_recs := public._ahostus_recommendations(v_tenant_id, v_signals);
  v_primary := v_recs->0;

  if v_primary is null then
    return jsonb_build_object(
      'has_customer', true, 'show_banner', false,
      'signal_count', jsonb_array_length(v_signals)
    );
  end if;

  return jsonb_build_object(
    'has_customer', true,
    'show_banner', true,
    'surface', p_surface,
    'signal_count', jsonb_array_length(v_signals),
    'recommendation_count', jsonb_array_length(v_recs),
    'primary_recommendation', v_primary,
    'licensing', public.assert_aipify_hosts_property_capacity(v_tenant_id),
    'principle', 'Recommend only — existing operations are never blocked except new property creation at limit.'
  );
end; $$;

create or replace function public.perform_aipify_hosts_upgrade_signal_action(
  p_action_type text,
  p_recommendation_key text default null,
  p_signal_key text default null,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_target text;
  v_result jsonb;
begin
  v_tenant_id := public._ahost_require_tenant();
  v_target := coalesce(p_payload->>'action_target', p_payload->>'target_plan');

  if p_action_type = 'record_upgrade_click' then
    perform public._ahostus_log_audit(
      v_tenant_id, 'upgrade_click', 'Upgrade recommendation selected',
      p_signal_key, p_recommendation_key, p_payload
    );
    return jsonb_build_object('status', 'recorded', 'billing_route', '/app/settings/billing/packages');
  end if;

  if p_action_type = 'start_upgrade' then
    perform public._ahostus_log_audit(
      v_tenant_id, 'upgrade_click', 'Plan upgrade initiated',
      p_signal_key, p_recommendation_key, p_payload
    );
    if exists (select 1 from pg_proc where proname = 'set_aipify_hosts_plan') and v_target like 'hosts_%' then
      v_result := public.set_aipify_hosts_plan(v_target, null, v_tenant_id);
      perform public._ahostus_log_audit(
        v_tenant_id, 'license_changed', 'Hosts plan updated via upgrade signal',
        p_signal_key, p_recommendation_key, v_result
      );
      return v_result || jsonb_build_object(
        'status', 'activated',
        'message', 'Plan updated. Your workspace has been refreshed — no logout required.',
        'workspace_route', '/app/aipify-hosts'
      );
    end if;
    if exists (select 1 from pg_proc where proname = 'start_package_upgrade') then
      v_result := public.start_package_upgrade(coalesce(v_target, 'business'), v_tenant_id);
      return v_result || jsonb_build_object('billing_route', '/app/settings/billing/packages', 'requires_payment', true);
    end if;
    raise exception 'Upgrade flow unavailable';
  end if;

  if p_action_type = 'add_property_license' then
    perform public._ahostus_log_audit(
      v_tenant_id, 'upgrade_click', '+1 Property License selected',
      p_signal_key, p_recommendation_key, p_payload
    );
    v_result := public.add_aipify_hosts_property_license(coalesce((p_payload->>'count')::int, 1), v_tenant_id);
    perform public._ahostus_log_audit(
      v_tenant_id, 'license_changed', 'Additional property license added',
      p_signal_key, 'add_property_license', v_result
    );
    perform public._ahostus_log_audit(
      v_tenant_id, 'payment_completed', 'Property license purchase completed (instant activation)',
      p_signal_key, 'add_property_license', v_result
    );
    return v_result || jsonb_build_object(
      'status', 'activated',
      'message', 'Property license added. Capacity updated immediately — no logout required.'
    );
  end if;

  if p_action_type = 'complete_upgrade_payment' then
    if exists (select 1 from pg_proc where proname = 'complete_package_upgrade_instant') then
      perform public.complete_package_upgrade_instant(coalesce(p_payload, '{}'::jsonb) || jsonb_build_object('instant_activation', true));
    end if;
    if v_target like 'hosts_%' then
      perform public.set_aipify_hosts_plan(v_target, null, v_tenant_id);
    end if;
    perform public._ahostus_log_audit(
      v_tenant_id, 'payment_completed', 'Upgrade payment completed',
      p_signal_key, p_recommendation_key, p_payload
    );
    perform public._ahostus_log_audit(
      v_tenant_id, 'license_changed', 'License limit updated after payment',
      p_signal_key, p_recommendation_key, p_payload
    );
    return jsonb_build_object(
      'status', 'activated',
      'message', 'Payment successful. License updated and workspace refreshed — no logout required.',
      'workspace_route', '/app/aipify-hosts'
    );
  end if;

  if p_action_type = 'dismiss_signal' and p_signal_key is not null then
    insert into public.aipify_hosts_upgrade_signal_dismissals (tenant_id, signal_key)
    values (v_tenant_id, p_signal_key) on conflict (tenant_id, signal_key) do nothing;
    perform public._ahostus_log_audit(
      v_tenant_id, 'signal_dismissed', 'Signal dismissed by user',
      p_signal_key, p_recommendation_key, p_payload
    );
    return jsonb_build_object('status', 'dismissed', 'signal_key', p_signal_key);
  end if;

  if p_action_type = 'suggest_business_pack' then
    perform public._ahostus_log_audit(
      v_tenant_id, 'business_pack_suggested', 'Related Business Pack suggested',
      p_signal_key, p_recommendation_key, p_payload
    );
    return jsonb_build_object('status', 'suggested', 'marketplace_route', '/app/marketplace/activation');
  end if;

  raise exception 'Unknown action type';
end; $$;

create or replace function public.seed_aipify_hosts_upgrade_signals_knowledge()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = '_ahostkc_ensure_category') then return; end if;
  perform public._ahostkc_ensure_category(
    'aipify-hosts-upgrade-signals', 'Hosts Upgrade & Licensing',
    'When and how to upgrade Aipify Hosts as your portfolio grows.', 395
  );
  perform public._ahostkc_seed_article('aipify-hosts-upgrade-signals', 'when-to-upgrade-aipify-hosts', 'When to upgrade Aipify Hosts',
    'Upgrade when your property count, team size, or operational volume approaches your license limit. Aipify recommends — never pressures.');
  perform public._ahostkc_seed_article('aipify-hosts-upgrade-signals', 'understanding-property-limits-upgrade', 'Understanding property limits',
    'Property limits define operational capacity only. All Hosts features remain the same across plans — only the number of active properties changes.');
  perform public._ahostkc_seed_article('aipify-hosts-upgrade-signals', 'additional-property-licenses-upgrade', 'Additional property licenses',
    'Purchase +1 Property License to add capacity without a full plan upgrade. Paid = Access Now — capacity updates immediately.');
  perform public._ahostkc_seed_article('aipify-hosts-upgrade-signals', 'marketplace-activation-hosts', 'Marketplace activation',
    'Discover, purchase, and activate Business Packs from the Marketplace. Upgrades and property licenses are available without contacting support.');
end; $$;

select public.seed_aipify_hosts_upgrade_signals_knowledge();

grant execute on function public.get_aipify_hosts_upgrade_signals_dashboard(text) to authenticated;
grant execute on function public.get_aipify_hosts_upgrade_signals_card(text) to authenticated;
grant execute on function public.perform_aipify_hosts_upgrade_signal_action(text, text, text, jsonb) to authenticated;
