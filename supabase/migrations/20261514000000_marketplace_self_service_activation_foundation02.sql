-- Foundation 02 — Marketplace & Self-Service Activation
-- Feature owner: CUSTOMER APP. Helpers: _mssa_* (engine), _mssaf02_* (blueprint)

create table if not exists public.marketplace_self_service_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  trials_enabled boolean not null default true,
  default_section text not null default 'discover' check (
    default_section in ('installed', 'recommended', 'discover', 'trials', 'billing')
  ),
  metadata jsonb not null default '{"paid_access_now":true,"self_service":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.marketplace_self_service_settings enable row level security;
revoke all on public.marketplace_self_service_settings from authenticated, anon;

create table if not exists public.marketplace_self_service_activations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  pack_key text not null,
  activation_status text not null default 'active' check (
    activation_status in ('pending', 'active', 'trial', 'cancelled', 'expired')
  ),
  activated_by uuid references public.users (id) on delete set null,
  activated_at timestamptz,
  trial_ends_at timestamptz,
  cancelled_at timestamptz,
  upgrade_event_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, pack_key)
);
create index if not exists marketplace_self_service_activations_tenant_idx
  on public.marketplace_self_service_activations (tenant_id, activation_status);
alter table public.marketplace_self_service_activations enable row level security;
revoke all on public.marketplace_self_service_activations from authenticated, anon;

create table if not exists public.marketplace_self_service_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  pack_key text,
  title text not null,
  message text not null,
  action_type text not null default 'activate' check (
    action_type in ('activate', 'upgrade', 'addon', 'trial')
  ),
  action_target text,
  priority int not null default 50,
  dismissed boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, recommendation_key)
);
alter table public.marketplace_self_service_recommendations enable row level security;
revoke all on public.marketplace_self_service_recommendations from authenticated, anon;

create table if not exists public.marketplace_self_service_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action text not null check (
    action in (
      'activation_started', 'activation_completed', 'activation_failed',
      'upgrade_started', 'upgrade_completed', 'trial_started', 'trial_expired',
      'cancellation_recorded', 'feature_flag_updated', 'addon_purchased',
      'dashboard_view', 'billing_redirect'
    )
  ),
  summary text not null,
  pack_key text,
  actor_user_id uuid references public.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists marketplace_self_service_audit_tenant_idx
  on public.marketplace_self_service_audit_logs (tenant_id, created_at desc);
alter table public.marketplace_self_service_audit_logs enable row level security;
revoke all on public.marketplace_self_service_audit_logs from authenticated, anon;

create or replace function public._mssa_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._mssa_ensure_settings(p_tenant_id uuid)
returns public.marketplace_self_service_settings language plpgsql security definer set search_path = public as $$
declare v_row public.marketplace_self_service_settings;
begin
  insert into public.marketplace_self_service_settings (tenant_id, enabled, trials_enabled)
  values (p_tenant_id, true, true) on conflict (tenant_id) do nothing;
  select * into v_row from public.marketplace_self_service_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._mssa_log_audit(
  p_tenant_id uuid, p_action text, p_summary text,
  p_pack_key text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.marketplace_self_service_audit_logs (
    tenant_id, action, summary, pack_key, actor_user_id, context
  ) values (
    p_tenant_id, p_action, p_summary, p_pack_key, public._mta_app_user_id(), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end; $$;

create or replace function public._mssaf02_positioning() returns text language sql immutable as $$
  select 'Discover, purchase, and activate Aipify Business Packs when your business needs them — without contacting support.'; $$;

create or replace function public._mssaf02_sections() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'installed', 'label', 'Installed'),
    jsonb_build_object('key', 'recommended', 'label', 'Recommended'),
    jsonb_build_object('key', 'discover', 'label', 'Discover'),
    jsonb_build_object('key', 'trials', 'label', 'Trials'),
    jsonb_build_object('key', 'billing', 'label', 'Billing')
  ); $$;

create or replace function public._mssaf02_catalog() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'pack_key', 'aipify_hosts', 'name', 'Aipify Hosts',
      'description', 'Business Operating System for hospitality — properties, guests, operations, and revenue in one workspace.',
      'features', jsonb_build_array('Property operations', 'Guest communications', 'Check-in center', 'Revenue intelligence', 'Team coordination'),
      'pricing_label', 'From €149 / month', 'monthly_price', 149, 'trial_available', true,
      'min_subscription_tier', 'business', 'business_pack_key', 'hospitality',
      'workspace_route', '/app/aipify-hosts', 'module_key', 'hospitality'
    ),
    jsonb_build_object(
      'pack_key', 'aipify_commerce', 'name', 'Aipify Commerce',
      'description', 'Commerce operations, margin visibility, and customer support workflows for retail and online sellers.',
      'features', jsonb_build_array('Order support', 'Margin analytics', 'Inventory insights', 'Customer communications'),
      'pricing_label', 'From €99 / month', 'monthly_price', 99, 'trial_available', true,
      'min_subscription_tier', 'professional', 'business_pack_key', 'e_commerce',
      'workspace_route', '/app/commercial', 'module_key', 'commerce'
    ),
    jsonb_build_object(
      'pack_key', 'aipify_support', 'name', 'Aipify Support',
      'description', 'Support operations with knowledge-backed responses, triage, and quality governance.',
      'features', jsonb_build_array('Support inbox', 'Knowledge center', 'Quality reviews', 'Escalation workflows'),
      'pricing_label', 'From €79 / month', 'monthly_price', 79, 'trial_available', true,
      'min_subscription_tier', 'starter', 'business_pack_key', 'support_operations',
      'workspace_route', '/app/support-ai-engine', 'module_key', 'support'
    ),
    jsonb_build_object(
      'pack_key', 'aipify_executive', 'name', 'Aipify Executive',
      'description', 'Executive briefings, strategic insights, and leadership visibility across your organization.',
      'features', jsonb_build_array('Executive dashboard', 'Morning briefings', 'Strategic recommendations', 'Governance visibility'),
      'pricing_label', 'From €199 / month', 'monthly_price', 199, 'trial_available', false,
      'min_subscription_tier', 'business', 'business_pack_key', 'professional_services',
      'workspace_route', '/app/executive-intelligence', 'module_key', 'executive'
    ),
    jsonb_build_object(
      'pack_key', 'aipify_growth', 'name', 'Aipify Growth',
      'description', 'Growth intelligence, expansion opportunities, and evolution guidance as your business scales.',
      'features', jsonb_build_array('Growth insights', 'Expansion recommendations', 'Adoption analytics', 'Evolution roadmap'),
      'pricing_label', 'From €129 / month', 'monthly_price', 129, 'trial_available', true,
      'min_subscription_tier', 'professional', 'business_pack_key', 'general_business',
      'workspace_route', '/app/growth-evolution-engine', 'module_key', 'growth'
    )
  ); $$;

create or replace function public._mssa_tier_rank(p_tier text)
returns int language sql immutable as $$
  select case coalesce(p_tier, 'starter')
    when 'starter' then 1 when 'growth' then 1 when 'professional' then 2
    when 'business' then 3 when 'enterprise' then 4 when 'enterprise_plus' then 5
    else 1 end;
$$;

create or replace function public._mssa_current_tier(p_tenant_id uuid)
returns text language plpgsql stable security definer set search_path = public as $$
begin
  if exists (select 1 from pg_proc where proname = '_bpc_resolve_tier') then
    return public._bpc_resolve_tier(p_tenant_id);
  end if;
  if exists (select 1 from pg_proc where proname = '_cpa_resolve_package_key') then
    return public._cpa_resolve_package_key(p_tenant_id);
  end if;
  return coalesce((select plan_key from public.subscriptions where customer_id = p_tenant_id limit 1), 'starter');
end; $$;

create or replace function public._mssa_pack_installed(p_tenant_id uuid, p_pack_key text, p_business_pack_key text)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare v_activation public.marketplace_self_service_activations;
begin
  select * into v_activation from public.marketplace_self_service_activations
  where tenant_id = p_tenant_id and pack_key = p_pack_key
    and activation_status in ('active', 'trial');
  if v_activation.id is not null then return true; end if;

  if p_pack_key = 'aipify_hosts' then
    return exists (
      select 1 from public.aipify_hosts_settings s
      where s.tenant_id = p_tenant_id and s.enabled = true
    );
  end if;

  if p_business_pack_key is not null and p_business_pack_key <> '' then
    return exists (
      select 1 from public.organization_business_packs obp
      join public.business_packs bp on bp.id = obp.business_pack_id
      where obp.organization_id = p_tenant_id and bp.pack_key = p_business_pack_key
    );
  end if;

  return false;
end; $$;

create or replace function public._mssa_card_status(
  p_tenant_id uuid, p_pack jsonb, p_settings public.marketplace_self_service_settings
) returns text language plpgsql stable security definer set search_path = public as $$
declare
  v_pack_key text := p_pack->>'pack_key';
  v_business_pack_key text := p_pack->>'business_pack_key';
  v_min_tier text := coalesce(p_pack->>'min_subscription_tier', 'starter');
  v_current_tier text;
  v_activation public.marketplace_self_service_activations;
begin
  if public._mssa_pack_installed(p_tenant_id, v_pack_key, v_business_pack_key) then
    return 'installed';
  end if;

  select * into v_activation from public.marketplace_self_service_activations
  where tenant_id = p_tenant_id and pack_key = v_pack_key and activation_status = 'trial';
  if v_activation.id is not null then return 'installed'; end if;

  v_current_tier := public._mssa_current_tier(p_tenant_id);
  if public._mssa_tier_rank(v_current_tier) < public._mssa_tier_rank(v_min_tier) then
    return 'upgrade_required';
  end if;

  if coalesce((p_pack->>'trial_available')::boolean, false) and p_settings.trials_enabled then
    return 'trial_available';
  end if;

  return 'available';
end; $$;

create or replace function public._mssa_pack_card(p_tenant_id uuid, p_pack jsonb, p_settings public.marketplace_self_service_settings)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_status text;
begin
  v_status := public._mssa_card_status(p_tenant_id, p_pack, p_settings);
  return p_pack || jsonb_build_object('card_status', v_status);
end; $$;

create or replace function public._mssa_seed_recommendations(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_hosts_installed boolean;
  v_capacity jsonb;
  v_commerce_installed boolean;
  v_support_installed boolean;
begin
  v_hosts_installed := public._mssa_pack_installed(p_tenant_id, 'aipify_hosts', 'hospitality');
  v_commerce_installed := public._mssa_pack_installed(p_tenant_id, 'aipify_commerce', 'e_commerce');
  v_support_installed := public._mssa_pack_installed(p_tenant_id, 'aipify_support', 'support_operations');

  if v_hosts_installed then
    begin
      v_capacity := public.assert_aipify_hosts_property_capacity(p_tenant_id);
      if coalesce((v_capacity->>'at_capacity')::boolean, false) then
        insert into public.marketplace_self_service_recommendations (
          tenant_id, recommendation_key, pack_key, title, message, action_type, action_target, priority
        ) values (
          p_tenant_id, 'hosts_property_upgrade', 'aipify_hosts',
          'Need additional properties?',
          'You have reached your property limit. Upgrade to Hosts 5 or add a +1 Property License.',
          'upgrade', 'hosts_5', 90
        ) on conflict (tenant_id, recommendation_key) do update set
          message = excluded.message, dismissed = false;
      end if;
    exception when undefined_function or undefined_table then null;
    end;
  elsif not v_hosts_installed then
    insert into public.marketplace_self_service_recommendations (
      tenant_id, recommendation_key, pack_key, title, message, action_type, action_target, priority
    ) values (
      p_tenant_id, 'discover_hosts', 'aipify_hosts',
      'Operating hospitality properties?',
      'Aipify Hosts centralizes guest operations, team coordination, and property health in one workspace.',
      'activate', 'aipify_hosts', 70
    ) on conflict (tenant_id, recommendation_key) do nothing;
  end if;

  if v_commerce_installed then
    insert into public.marketplace_self_service_recommendations (
      tenant_id, recommendation_key, pack_key, title, message, action_type, action_target, priority
    ) values (
      p_tenant_id, 'commerce_margin_analytics', 'aipify_commerce',
      'Enable Margin Analytics',
      'Add margin visibility to understand profitability across products and channels.',
      'addon', 'advanced_analytics', 75
    ) on conflict (tenant_id, recommendation_key) do nothing;
  end if;

  if v_support_installed then
    insert into public.marketplace_self_service_recommendations (
      tenant_id, recommendation_key, pack_key, title, message, action_type, action_target, priority
    ) values (
      p_tenant_id, 'support_executive_briefings', 'aipify_support',
      'Enable Executive Briefings',
      'Give leadership visibility into support quality, volume trends, and operational health.',
      'addon', 'executive_insights', 65
    ) on conflict (tenant_id, recommendation_key) do nothing;
  end if;
end; $$;

create or replace function public._mssa_activate_business_pack(p_tenant_id uuid, p_pack_key text, p_business_pack_key text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_result jsonb;
begin
  if p_pack_key = 'aipify_hosts' then
    perform public._ahost_ensure_settings(p_tenant_id);
    update public.aipify_hosts_settings set enabled = true, updated_at = now() where tenant_id = p_tenant_id;
  elsif p_business_pack_key is not null and p_business_pack_key <> '' then
    if exists (select 1 from pg_proc where proname = 'activate_organization_business_pack') then
      begin
        v_result := public.activate_organization_business_pack(p_business_pack_key);
      exception when others then
        null;
      end;
    end if;
  end if;

  insert into public.marketplace_self_service_activations (
    tenant_id, pack_key, activation_status, activated_by, activated_at
  ) values (
    p_tenant_id, p_pack_key, 'active', public._mta_app_user_id(), now()
  ) on conflict (tenant_id, pack_key) do update set
    activation_status = 'active', activated_by = public._mta_app_user_id(),
    activated_at = now(), cancelled_at = null, updated_at = now();

  if exists (select 1 from pg_proc where proname = 'sync_tenant_modules_from_package') then
    perform public.sync_tenant_modules_from_package(p_tenant_id);
  end if;

  return coalesce(v_result, jsonb_build_object('status', 'activated', 'pack_key', p_pack_key));
end; $$;

create or replace function public.get_marketplace_self_service_dashboard(p_section text default 'discover')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.marketplace_self_service_settings;
  v_section text := coalesce(nullif(trim(p_section), ''), 'discover');
  v_tier text;
  v_catalog jsonb;
  v_cards jsonb := '[]'::jsonb;
  v_pack jsonb;
  v_filtered jsonb := '[]'::jsonb;
  v_card jsonb;
  v_sub record;
  v_billing record;
begin
  v_tenant_id := public._mssa_require_tenant();
  v_settings := public._mssa_ensure_settings(v_tenant_id);
  perform public._bpc_seed_catalog(v_tenant_id);
  perform public._mssa_seed_recommendations(v_tenant_id);
  v_tier := public._mssa_current_tier(v_tenant_id);
  v_catalog := public._mssaf02_catalog();

  for v_pack in select jsonb_array_elements(v_catalog)
  loop
    v_card := public._mssa_pack_card(v_tenant_id, v_pack, v_settings);
    v_cards := v_cards || jsonb_build_array(v_card);
  end loop;

  if v_section = 'installed' then
    select coalesce(jsonb_agg(c order by (c->>'name')), '[]'::jsonb) into v_filtered
    from jsonb_array_elements(v_cards) c where c->>'card_status' = 'installed';
  elsif v_section = 'recommended' then
    return jsonb_build_object(
      'has_customer', true, 'section', v_section,
      'philosophy', public._mssaf02_positioning(),
      'governance_note', 'Role-based permissions · Activations audited · Upgrades audited · Feature flag changes audited',
      'principle', 'Paid = Access Now. No logout required after successful payment.',
      'current_tier', v_tier,
      'sections', public._mssaf02_sections(),
      'recommendations', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', r.id, 'recommendation_key', r.recommendation_key, 'pack_key', r.pack_key,
          'title', r.title, 'message', r.message, 'action_type', r.action_type,
          'action_target', r.action_target, 'priority', r.priority
        ) order by r.priority desc)
        from public.marketplace_self_service_recommendations r
        where r.tenant_id = v_tenant_id and r.dismissed = false
      ), '[]'::jsonb),
      'cards', '[]'::jsonb,
      'billing_summary', jsonb_build_object('current_tier', v_tier)
    );
  elsif v_section = 'trials' then
    select coalesce(jsonb_agg(c order by (c->>'name')), '[]'::jsonb) into v_filtered
    from jsonb_array_elements(v_cards) c
    where c->>'card_status' in ('trial_available', 'available')
      and coalesce((c->>'trial_available')::boolean, false) = true;
  elsif v_section = 'billing' then
    select * into v_sub from public.subscriptions where customer_id = v_tenant_id limit 1;
    select * into v_billing from public.billing_profiles where customer_id = v_tenant_id limit 1;
    return jsonb_build_object(
      'has_customer', true, 'section', v_section,
      'philosophy', public._mssaf02_positioning(),
      'governance_note', 'Role-based permissions · Activations audited · Upgrades audited · Feature flag changes audited',
      'principle', 'Paid = Access Now. No logout required after successful payment.',
      'current_tier', v_tier,
      'sections', public._mssaf02_sections(),
      'billing_summary', jsonb_build_object(
        'current_tier', v_tier,
        'subscription_status', coalesce(v_sub.status, 'trialing'),
        'payment_method', coalesce(v_billing.payment_method, 'card'),
        'billing_route', '/app/settings/billing',
        'packages_route', '/app/settings/billing/packages'
      ),
      'addon_modules', coalesce((
        select jsonb_agg(jsonb_build_object(
          'addon_key', a.addon_key, 'title', a.title, 'description', a.description,
          'status', a.status, 'monthly_price', a.monthly_price
        ))
        from public.commercial_addon_entitlements a where a.tenant_id = v_tenant_id
      ), '[]'::jsonb),
      'cards', '[]'::jsonb
    );
  else
    v_filtered := v_cards;
  end if;

  perform public._mssa_log_audit(v_tenant_id, 'dashboard_view', 'Marketplace self-service dashboard viewed', null,
    jsonb_build_object('section', v_section));

  return jsonb_build_object(
    'has_customer', true,
    'section', v_section,
    'philosophy', public._mssaf02_positioning(),
    'governance_note', 'Role-based permissions · Activations audited · Upgrades audited · Feature flag changes audited',
    'principle', 'Paid = Access Now. No logout required after successful payment.',
    'current_tier', v_tier,
    'sections', public._mssaf02_sections(),
    'cards', coalesce(v_filtered, '[]'::jsonb),
    'activation_steps', jsonb_build_array(
      jsonb_build_object('step', 1, 'key', 'open', 'label', 'Open Business Pack'),
      jsonb_build_object('step', 2, 'key', 'review', 'label', 'Review package details'),
      jsonb_build_object('step', 3, 'key', 'activate', 'label', 'Activate')
    ),
    'billing_route', '/app/settings/billing',
    'packages_route', '/app/settings/billing/packages'
  );
end; $$;

create or replace function public.get_marketplace_self_service_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_installed int;
  v_available int;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select count(*)::int into v_installed
  from jsonb_array_elements(public._mssaf02_catalog()) c
  where public._mssa_pack_installed(v_tenant_id, c->>'pack_key', c->>'business_pack_key');

  v_available := jsonb_array_length(public._mssaf02_catalog()) - v_installed;

  return jsonb_build_object(
    'has_customer', true,
    'installed_count', v_installed,
    'available_count', greatest(v_available, 0),
    'philosophy', public._mssaf02_positioning()
  );
end; $$;

create or replace function public.perform_marketplace_self_service_action(
  p_action_type text,
  p_pack_key text default null,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.marketplace_self_service_settings;
  v_catalog jsonb;
  v_pack jsonb;
  v_status text;
  v_business_pack_key text;
  v_min_tier text;
  v_current_tier text;
  v_upgrade jsonb;
  v_activation jsonb;
  v_target text;
begin
  v_tenant_id := public._mssa_require_tenant();
  v_settings := public._mssa_ensure_settings(v_tenant_id);
  v_catalog := public._mssaf02_catalog();

  select c into v_pack from jsonb_array_elements(v_catalog) c where c->>'pack_key' = p_pack_key limit 1;

  if p_action_type in ('activate_pack', 'start_trial', 'start_upgrade', 'review_pack') and v_pack is null then
    raise exception 'Business pack not found';
  end if;

  if p_action_type = 'review_pack' then
    v_status := public._mssa_card_status(v_tenant_id, v_pack, v_settings);
    return jsonb_build_object(
      'action', p_action_type, 'status', 'ready', 'pack', v_pack || jsonb_build_object('card_status', v_status),
      'activation_steps', jsonb_build_array(
        jsonb_build_object('step', 1, 'key', 'open', 'label', 'Open Business Pack'),
        jsonb_build_object('step', 2, 'key', 'review', 'label', 'Review package details'),
        jsonb_build_object('step', 3, 'key', 'activate', 'label', 'Activate')
      )
    );
  end if;

  if p_action_type = 'start_trial' then
    if not v_settings.trials_enabled or not coalesce((v_pack->>'trial_available')::boolean, false) then
      raise exception 'Trial not available for this pack';
    end if;
    insert into public.marketplace_self_service_activations (
      tenant_id, pack_key, activation_status, activated_by, activated_at, trial_ends_at
    ) values (
      v_tenant_id, p_pack_key, 'trial', public._mta_app_user_id(), now(), now() + interval '14 days'
    ) on conflict (tenant_id, pack_key) do update set
      activation_status = 'trial', trial_ends_at = now() + interval '14 days', updated_at = now();
    perform public._mssa_activate_business_pack(v_tenant_id, p_pack_key, v_pack->>'business_pack_key');
    perform public._mssa_log_audit(v_tenant_id, 'trial_started', 'Trial started for ' || (v_pack->>'name'), p_pack_key, p_payload);
    return jsonb_build_object(
      'action', p_action_type, 'status', 'trial_active', 'pack_key', p_pack_key,
      'workspace_route', v_pack->>'workspace_route',
      'message', 'Trial activated. Your workspace has been refreshed — no logout required.'
    );
  end if;

  if p_action_type = 'start_upgrade' then
    v_target := coalesce(p_payload->>'target_package', v_pack->>'min_subscription_tier', 'business');
    if exists (select 1 from pg_proc where proname = 'start_package_upgrade') then
      v_upgrade := public.start_package_upgrade(v_target, v_tenant_id);
      perform public._mssa_log_audit(v_tenant_id, 'upgrade_started', 'Upgrade started for ' || (v_pack->>'name'), p_pack_key,
        v_upgrade || p_payload);
      return v_upgrade || jsonb_build_object(
        'action', p_action_type, 'pack_key', p_pack_key,
        'billing_route', '/app/settings/billing/packages',
        'requires_payment', true
      );
    end if;
    raise exception 'Upgrade flow unavailable';
  end if;

  if p_action_type = 'complete_activation' then
    if exists (select 1 from pg_proc where proname = 'complete_package_upgrade_instant') then
      perform public.complete_package_upgrade_instant(
        coalesce(p_payload, '{}'::jsonb) || jsonb_build_object('instant_activation', true)
      );
    end if;
    v_activation := public._mssa_activate_business_pack(v_tenant_id, p_pack_key, v_pack->>'business_pack_key');
    perform public._mssa_log_audit(v_tenant_id, 'upgrade_completed', 'Payment completed and pack activated', p_pack_key, p_payload);
    perform public._mssa_log_audit(v_tenant_id, 'activation_completed', 'Business pack activated after payment', p_pack_key, v_activation);
    perform public._mssa_log_audit(v_tenant_id, 'feature_flag_updated', 'Workspace modules refreshed', p_pack_key, '{}'::jsonb);
    return jsonb_build_object(
      'action', p_action_type, 'status', 'activated', 'pack_key', p_pack_key,
      'workspace_route', v_pack->>'workspace_route',
      'message', 'Payment successful. Your Business Pack is active — no logout required.'
    );
  end if;

  if p_action_type = 'activate_pack' then
    v_business_pack_key := v_pack->>'business_pack_key';
    v_min_tier := coalesce(v_pack->>'min_subscription_tier', 'starter');
    v_current_tier := public._mssa_current_tier(v_tenant_id);
    v_status := public._mssa_card_status(v_tenant_id, v_pack, v_settings);

    if v_status = 'installed' then raise exception 'Business pack already installed'; end if;

    perform public._mssa_log_audit(v_tenant_id, 'activation_started', 'Activation started for ' || (v_pack->>'name'), p_pack_key, p_payload);

    if v_status = 'upgrade_required' then
      perform public._mssa_log_audit(v_tenant_id, 'billing_redirect', 'Upgrade required before activation', p_pack_key,
        jsonb_build_object('current_tier', v_current_tier, 'required_tier', v_min_tier));
      return jsonb_build_object(
        'action', p_action_type, 'status', 'upgrade_required', 'pack_key', p_pack_key,
        'current_tier', v_current_tier, 'required_tier', v_min_tier,
        'billing_route', '/app/settings/billing/packages',
        'message', 'An upgrade is required before this Business Pack can be activated.'
      );
    end if;

    v_activation := public._mssa_activate_business_pack(v_tenant_id, p_pack_key, v_business_pack_key);
    perform public._mssa_log_audit(v_tenant_id, 'activation_completed', 'Business pack activated', p_pack_key, v_activation);
    perform public._mssa_log_audit(v_tenant_id, 'feature_flag_updated', 'Workspace modules refreshed', p_pack_key, '{}'::jsonb);

    return jsonb_build_object(
      'action', p_action_type, 'status', 'activated', 'pack_key', p_pack_key,
      'workspace_route', v_pack->>'workspace_route',
      'message', 'Business Pack activated. Your workspace has been refreshed — no logout required.'
    );
  end if;

  if p_action_type = 'purchase_property_license' then
    if exists (select 1 from pg_proc where proname = 'add_aipify_hosts_property_license') then
      v_activation := public.add_aipify_hosts_property_license(1, v_tenant_id);
      perform public._mssa_log_audit(v_tenant_id, 'addon_purchased', '+1 Property License purchased', 'aipify_hosts', v_activation);
      return jsonb_build_object(
        'action', p_action_type, 'status', 'completed',
        'message', 'Additional property license added. Capacity updated immediately.',
        'licensing', v_activation->'licensing'
      );
    end if;
    raise exception 'Property license purchase unavailable';
  end if;

  if p_action_type = 'cancel_activation' then
    update public.marketplace_self_service_activations
    set activation_status = 'cancelled', cancelled_at = now(), updated_at = now()
    where tenant_id = v_tenant_id and pack_key = p_pack_key;
    perform public._mssa_log_audit(v_tenant_id, 'cancellation_recorded', 'Activation cancelled', p_pack_key, p_payload);
    return jsonb_build_object('action', p_action_type, 'status', 'cancelled', 'pack_key', p_pack_key);
  end if;

  raise exception 'Unknown action type';
end; $$;

create or replace function public.seed_marketplace_self_service_knowledge()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = '_ahostkc_ensure_category') then return; end if;
  perform public._ahostkc_ensure_category(
    'marketplace-self-service', 'Marketplace & Self-Service',
    'Discover, purchase, and activate Aipify Business Packs from your workspace.', 400
  );
  perform public._ahostkc_seed_article('marketplace-self-service', 'package-explanations', 'Package explanations',
    'Aipify Business Packs are modular solutions — Aipify Hosts, Commerce, Support, Executive, and Growth. Each pack includes operational workspaces, governance, and Knowledge Center guidance. You purchase packs when your business needs them.');
  perform public._ahostkc_seed_article('marketplace-self-service', 'upgrade-guidance', 'Upgrade guidance',
    'When a pack requires a higher subscription tier, proceed to billing from the Marketplace. After successful payment, your subscription, feature flags, and workspace refresh automatically — no logout required.');
  perform public._ahostkc_seed_article('marketplace-self-service', 'billing-faqs', 'Billing FAQs',
    'Paid = Access Now. Self-service upgrades update your subscription immediately. Property-based upgrades such as Hosts 5 or +1 Property License are available from the Marketplace recommendations.');
  perform public._ahostkc_seed_article('marketplace-self-service', 'capability-overviews', 'Capability overviews',
    'Review included features, pricing, and trial availability on each Marketplace card before activation. Aipify recommends relevant opportunities based on your installed packs and operational capacity.');
end; $$;

select public.seed_marketplace_self_service_knowledge();

grant execute on function public.get_marketplace_self_service_dashboard(text) to authenticated;
grant execute on function public.get_marketplace_self_service_card() to authenticated;
grant execute on function public.perform_marketplace_self_service_action(text, text, jsonb) to authenticated;
