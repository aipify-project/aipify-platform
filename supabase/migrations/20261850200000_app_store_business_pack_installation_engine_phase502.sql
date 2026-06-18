-- Phase 502 — App Store & Business Pack Installation Engine
-- PLATFORM sells · APP buys · EMPLOYEES inherit access
-- Integrates: Module Registry (501), Business Pack Marketplace (Foundation 08), License Engine

-- ---------------------------------------------------------------------------
-- 1. App Store audit (commercial events)
-- ---------------------------------------------------------------------------
create table if not exists public.app_store_commercial_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  pack_key text not null,
  event_type text not null check (
    event_type in (
      'install_started', 'install_completed', 'upgrade_completed', 'pack_removed',
      'seat_purchase', 'renewal', 'payment_confirmed', 'store_view', 'detail_view'
    )
  ),
  seat_tier text,
  seat_count integer,
  monthly_cost numeric(12, 2),
  summary text not null,
  actor_user_id uuid references public.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_store_commercial_events_tenant_idx
  on public.app_store_commercial_events (tenant_id, created_at desc);

create index if not exists app_store_commercial_events_pack_idx
  on public.app_store_commercial_events (pack_key, event_type, created_at desc);

alter table public.app_store_commercial_events enable row level security;
revoke all on public.app_store_commercial_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._as502_principle()
returns text language sql immutable as $$
  select 'APP discovers. APP buys. APP activates. Aipify delivers instantly.';
$$;

create or replace function public._as502_seat_tiers()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('tier_key', '1', 'seat_count', 1, 'label', '1 User'),
    jsonb_build_object('tier_key', '5', 'seat_count', 5, 'label', '5 Users'),
    jsonb_build_object('tier_key', '10', 'seat_count', 10, 'label', '10 Users'),
    jsonb_build_object('tier_key', '25', 'seat_count', 25, 'label', '25 Users'),
    jsonb_build_object('tier_key', '50', 'seat_count', 50, 'label', '50 Users'),
    jsonb_build_object('tier_key', '100', 'seat_count', 100, 'label', '100 Users'),
    jsonb_build_object('tier_key', '250', 'seat_count', 250, 'label', '250 Users'),
    jsonb_build_object('tier_key', '500', 'seat_count', 500, 'label', '500 Users'),
    jsonb_build_object('tier_key', 'enterprise', 'seat_count', null, 'label', 'Enterprise')
  );
$$;

create or replace function public._as502_categories()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'operations', 'finance', 'support', 'commerce', 'warehouse', 'hosts',
    'growth', 'knowledge', 'governance', 'analytics', 'customer_success',
    'marketing', 'companion'
  );
$$;

create or replace function public._as502_install_flow()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'select_license_quantity', 'review_cost', 'payment', 'activation',
    'modules_registered', 'menu_updated', 'access_available'
  );
$$;

create or replace function public._as502_log(
  p_tenant_id uuid,
  p_pack_key text,
  p_event_type text,
  p_summary text,
  p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.app_store_commercial_events (
    tenant_id, pack_key, event_type, seat_tier, seat_count, monthly_cost, summary, actor_user_id, context
  ) values (
    p_tenant_id,
    p_pack_key,
    p_event_type,
    p_context->>'seat_tier',
    nullif(p_context->>'seat_count', '')::integer,
    nullif(p_context->>'monthly_cost', '')::numeric,
    p_summary,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    coalesce(p_context, '{}'::jsonb)
  )
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._as502_seat_count(p_tier_key text)
returns integer language plpgsql stable as $$
begin
  if p_tier_key = 'enterprise' then return null; end if;
  return greatest(1, coalesce(nullif(p_tier_key, '')::integer, 1));
end; $$;

create or replace function public._as502_estimate_cost(
  p_base_monthly numeric,
  p_tier_key text
) returns numeric language plpgsql stable as $$
declare v_seats integer;
begin
  if p_tier_key = 'enterprise' then return null; end if;
  v_seats := public._as502_seat_count(p_tier_key);
  return round(coalesce(p_base_monthly, 0) * sqrt(v_seats::numeric), 2);
end; $$;

create or replace function public._as502_pack_card(p_tenant_id uuid, p_pack_key text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_base jsonb;
  v_modules jsonb := '[]'::jsonb;
  v_license_req text := 'Business plan or higher';
begin
  if exists (select 1 from pg_proc where proname = '_bpmke_listing_card') then
    v_base := public._bpmke_listing_card(p_tenant_id, p_pack_key);
  end if;
  if v_base is null then return null; end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'module_key', r.module_key, 'module_name', r.module_name, 'route_href', r.route_href
  ) order by r.sort_order), '[]'::jsonb)
  into v_modules
  from public.aipify_module_registry r
  where r.required_business_pack = p_pack_key and r.status = 'active';

  return v_base || jsonb_build_object(
    'included_modules', v_modules,
    'license_requirements', v_license_req,
    'detail_route', '/app/store/' || p_pack_key,
    'install_route', '/app/store/' || p_pack_key || '?install=1',
    'landing_route', '/app/store/' || p_pack_key,
    'store_route', '/app/store'
  );
end; $$;

create or replace function public._as502_recommendations(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_recs jsonb := '[]'::jsonb;
  v_employee_count integer := 0;
begin
  select count(*) into v_employee_count
  from public.organization_users ou
  where ou.organization_id = p_tenant_id and ou.status = 'active';

  if exists (select 1 from pg_proc where proname = '_bpmke_is_installed') then
    if public._bpmke_is_installed(p_tenant_id, 'aipify_commerce', 'e_commerce')
      or public._bpmke_is_installed(p_tenant_id, 'commerce_pack', 'commerce') then
      v_recs := v_recs || jsonb_build_array('warehouse_pack', 'customer_success_pack', 'marketing_pack');
    elsif public._bpmke_is_installed(p_tenant_id, 'aipify_hosts', 'hospitality')
      or public._bpmke_is_installed(p_tenant_id, 'hosts_pack', 'hosts') then
      v_recs := v_recs || jsonb_build_array('finance_pack', 'support_pack', 'revenue_pack');
    else
      v_recs := v_recs || jsonb_build_array('support_pack', 'commerce_pack', 'hosts_pack');
    end if;
  else
    v_recs := '["support_pack","commerce_pack","hosts_pack"]'::jsonb;
  end if;

  if v_employee_count >= 50 then
    v_recs := v_recs || jsonb_build_array('analytics_pack', 'governance_pack');
  end if;

  return v_recs;
end; $$;

create or replace function public._as502_apply_pack_license(
  p_tenant_id uuid,
  p_pack_key text,
  p_tier_key text,
  p_monthly_cost numeric
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.business_pack_license_tenant_state (
    tenant_id, pack_key, tier_key, capacity_limit, billing_frequency, license_status, renewal_date, metadata
  ) values (
    p_tenant_id,
    p_pack_key,
    p_tier_key,
    public._as502_seat_count(p_tier_key),
    case when p_tier_key = 'enterprise' then 'enterprise_invoice' else 'monthly' end,
    'active',
    (current_date + interval '1 month')::date,
    jsonb_build_object('monthly_cost', p_monthly_cost, 'source', 'app_store')
  )
  on conflict (tenant_id, pack_key) do update set
    tier_key = excluded.tier_key,
    capacity_limit = excluded.capacity_limit,
    billing_frequency = excluded.billing_frequency,
    license_status = 'active',
    renewal_date = excluded.renewal_date,
    metadata = business_pack_license_tenant_state.metadata || excluded.metadata,
    updated_at = now();
end; $$;

create or replace function public.customer_remove_business_pack(
  p_organization_id uuid,
  p_pack_key text
)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  perform public._bde_require_admin();
  if public._presence_tenant_for_auth() is distinct from p_organization_id then
    raise exception 'Organization mismatch';
  end if;

  update public.organization_module_activations
  set status = 'removed', menu_visible = false, licensed = false, deactivated_at = now(), updated_at = now()
  where organization_id = p_organization_id and business_pack_key = p_pack_key;

  update public.tenant_modules tm
  set enabled = false, licensed = false, status = 'disabled', updated_at = now()
  from public.aipify_module_registry r
  where tm.tenant_id = p_organization_id
    and tm.module_key = r.module_key
    and r.required_business_pack = p_pack_key;

  update public.business_pack_license_tenant_state
  set license_status = 'cancelled', updated_at = now()
  where tenant_id = p_organization_id and pack_key = p_pack_key;

  update public.business_pack_marketplace_install_progress
  set workflow_step = 'pack_details', updated_at = now()
  where tenant_id = p_organization_id and pack_key = p_pack_key;

  perform public._mre501_log('app', 'pack_removed', null, p_organization_id,
    'Business pack removed via App Store: ' || p_pack_key, jsonb_build_object('pack_key', p_pack_key));

  perform public._as502_log(p_organization_id, p_pack_key, 'pack_removed',
    'Pack removed — modules unavailable; historical data retained per retention policy.',
    jsonb_build_object('pack_key', p_pack_key));

  return jsonb_build_object(
    'ok', true,
    'pack_key', p_pack_key,
    'message', 'This pack and its modules are now unavailable. Historical data is retained according to Aipify retention policies.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. App Store home
-- ---------------------------------------------------------------------------
create or replace function public.get_app_store_home(p_locale text default 'en')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_all_cards jsonb := '[]'::jsonb;
  v_pack record;
  v_card jsonb;
  v_recommended jsonb := '[]'::jsonb;
  v_installed jsonb := '[]'::jsonb;
  v_popular jsonb := '[]'::jsonb;
  v_recent jsonb := '[]'::jsonb;
  v_marketplace jsonb := '[]'::jsonb;
  v_my_licenses jsonb := '[]'::jsonb;
  v_rec_key text;
  v_category text;
begin
  perform public._bpmke_require_view();
  v_tenant_id := public._bpmke_require_tenant();
  perform public._bpmke_seed_listings();

  for v_pack in
    select l.pack_key from public.business_pack_marketplace_listings l
    join public.business_pack_identity i on i.pack_key = l.pack_key
    where l.marketplace_visibility = 'published'
    order by l.popular_rank, i.pack_name
  loop
    v_card := public._as502_pack_card(v_tenant_id, v_pack.pack_key);
    if v_card is not null then v_all_cards := v_all_cards || jsonb_build_array(v_card); end if;
  end loop;

  for v_rec_key in select jsonb_array_elements_text(public._as502_recommendations(v_tenant_id))
  loop
    v_card := public._as502_pack_card(v_tenant_id, v_rec_key);
    if v_card is not null and coalesce((v_card->>'installed')::boolean, false) = false then
      v_recommended := v_recommended || jsonb_build_array(v_card);
    end if;
  end loop;

  select coalesce(jsonb_agg(c), '[]'::jsonb) into v_installed
  from jsonb_array_elements(v_all_cards) c where (c->>'installed')::boolean = true;

  select coalesce(jsonb_agg(card order by rank), '[]'::jsonb) into v_popular
  from (
    select public._as502_pack_card(v_tenant_id, l.pack_key) as card, l.popular_rank as rank
    from public.business_pack_marketplace_listings l
    where l.marketplace_visibility = 'published'
    order by l.popular_rank
    limit 8
  ) t where card is not null;

  select coalesce(jsonb_agg(public._as502_pack_card(v_tenant_id, l.pack_key) order by l.recently_added_at desc), '[]'::jsonb)
  into v_recent
  from public.business_pack_marketplace_listings l
  where l.marketplace_visibility = 'published'
  limit 8;

  v_marketplace := v_all_cards;

  select coalesce(jsonb_agg(jsonb_build_object(
    'pack_key', s.pack_key,
    'tier_key', s.tier_key,
    'capacity_limit', s.capacity_limit,
    'license_status', s.license_status,
    'renewal_date', s.renewal_date,
    'usage_count', s.usage_count,
    'card', public._as502_pack_card(v_tenant_id, s.pack_key)
  )), '[]'::jsonb)
  into v_my_licenses
  from public.business_pack_license_tenant_state s
  where s.tenant_id = v_tenant_id and s.license_status in ('active', 'trial', 'grace_period');

  perform public._as502_log(v_tenant_id, 'store', 'store_view', 'App Store home viewed', jsonb_build_object('locale', p_locale));

  return jsonb_build_object(
    'found', true,
    'principle', public._as502_principle(),
    'locale', coalesce(nullif(p_locale, ''), 'en'),
    'categories', public._as502_categories(),
    'seat_tiers', public._as502_seat_tiers(),
    'installation_flow', public._as502_install_flow(),
    'sections', jsonb_build_object(
      'installed', coalesce(v_installed, '[]'::jsonb),
      'marketplace', coalesce(v_marketplace, '[]'::jsonb),
      'recommended', coalesce(v_recommended, '[]'::jsonb),
      'popular', coalesce(v_popular, '[]'::jsonb),
      'recently_added', coalesce(v_recent, '[]'::jsonb),
      'my_licenses', coalesce(v_my_licenses, '[]'::jsonb)
    ),
    'governance_note', 'APP owner controls employee module visibility after install — employees inherit APP license only when granted.',
    'module_access_route', '/app/settings/module-access',
    'licenses_route', '/app/licenses',
    'future_proof_rule', 'Every future Business Pack must be installable through the App Store via Module Registry and License Engine.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Pack detail
-- ---------------------------------------------------------------------------
create or replace function public.get_app_store_pack_detail(p_pack_key text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_card jsonb;
  v_modules jsonb;
  v_permissions jsonb;
  v_pack_name text;
  v_long_description text;
  v_pack_category text;
  v_version text;
  v_status text;
  v_intended_audience text;
  v_metadata jsonb;
  v_key_benefits jsonb;
  v_updated_at timestamptz;
  v_starting_price numeric;
  v_pricing_label text;
  v_current_tier text;
  v_current_seats integer;
begin
  perform public._bpmke_require_view();
  v_tenant_id := public._bpmke_require_tenant();
  perform public._bpmke_seed_listings();

  select i.pack_name, i.long_description, i.pack_category, i.version, i.status,
    i.intended_audience, i.metadata, i.key_benefits, i.updated_at
  into v_pack_name, v_long_description, v_pack_category, v_version, v_status,
    v_intended_audience, v_metadata, v_key_benefits, v_updated_at
  from public.business_pack_identity i where i.pack_key = p_pack_key;

  if v_pack_name is null then return jsonb_build_object('found', false, 'pack_key', p_pack_key); end if;

  select l.starting_price_monthly, l.pricing_label
  into v_starting_price, v_pricing_label
  from public.business_pack_marketplace_listings l where l.pack_key = p_pack_key;

  select s.tier_key, s.capacity_limit into v_current_tier, v_current_seats
  from public.business_pack_license_tenant_state s
  where s.tenant_id = v_tenant_id and s.pack_key = p_pack_key;

  v_card := public._as502_pack_card(v_tenant_id, p_pack_key);

  select coalesce(jsonb_agg(jsonb_build_object(
    'module_key', r.module_key, 'module_name', r.module_name, 'description', r.description, 'route_href', r.route_href
  ) order by r.sort_order), '[]'::jsonb)
  into v_modules from public.aipify_module_registry r
  where r.required_business_pack = p_pack_key and r.status = 'active';

  select coalesce(jsonb_agg(jsonb_build_object(
    'permission_key', p.permission_key, 'permission_name', p.permission_name, 'module_key', p.module_key
  )), '[]'::jsonb)
  into v_permissions
  from public.aipify_module_permissions p
  join public.aipify_module_registry r on r.module_key = p.module_key
  where r.required_business_pack = p_pack_key;

  perform public._as502_log(v_tenant_id, p_pack_key, 'detail_view', 'App Store pack detail viewed', '{}'::jsonb);

  return jsonb_build_object(
    'found', true,
    'principle', public._as502_principle(),
    'pack_key', p_pack_key,
    'listing', v_card,
    'overview', jsonb_build_object(
      'pack_name', v_pack_name,
      'long_description', v_long_description,
      'category', v_pack_category,
      'version', v_version,
      'status', v_status
    ),
    'modules_included', v_modules,
    'license_requirements', 'Active Aipify APP subscription. Seat tier selects licensed user capacity.',
    'screenshots', coalesce(v_metadata->'screenshots', '[]'::jsonb),
    'benefits', coalesce(v_key_benefits, '[]'::jsonb),
    'who_is_it_for', v_intended_audience,
    'permissions_added', v_permissions,
    'pricing', jsonb_build_object(
      'starting_price_monthly', v_starting_price,
      'pricing_label', coalesce(v_pricing_label, 'Contact sales'),
      'seat_tiers', public._as502_seat_tiers(),
      'current_tier', v_current_tier,
      'current_seats', v_current_seats
    ),
    'faq', coalesce(v_metadata->'faq', jsonb_build_array(
      jsonb_build_object('question', 'How fast is activation?', 'answer', 'Purchase to active in seconds — no support ticket or manual activation.'),
      jsonb_build_object('question', 'Do employees get access automatically?', 'answer', 'No. APP owner controls who sees and uses pack modules in Module Access settings.'),
      jsonb_build_object('question', 'What happens on removal?', 'answer', 'Modules become unavailable. Historical data is retained per Aipify retention policies.')
    )),
    'version_history', coalesce(v_metadata->'version_history', jsonb_build_array(
      jsonb_build_object('version', v_version, 'released_at', v_updated_at, 'notes', 'Current release')
    )),
    'supported_actions', case
      when coalesce((v_card->>'installed')::boolean, false) then jsonb_build_array('view_details', 'upgrade', 'remove', 'manage_access')
      when v_starting_price is null then jsonb_build_array('view_details', 'contact_sales')
      else jsonb_build_array('view_details', 'install', 'contact_sales')
    end,
    'installation_flow', public._as502_install_flow(),
    'module_access_route', '/app/settings/module-access'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. License dashboard
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_license_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_sub jsonb := '{}'::jsonb;
  v_packs jsonb;
  v_seats jsonb;
begin
  perform public._bde_require_admin();
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('found', false); end if;

  if exists (select 1 from pg_proc where proname = 'get_customer_license_center') then
    v_sub := coalesce(public.get_customer_license_center()->'subscription', '{}'::jsonb);
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'pack_key', s.pack_key,
    'tier_key', s.tier_key,
    'capacity_limit', s.capacity_limit,
    'usage_count', s.usage_count,
    'license_status', s.license_status,
    'renewal_date', s.renewal_date,
    'monthly_cost', s.metadata->>'monthly_cost',
    'card', public._as502_pack_card(v_tenant_id, s.pack_key)
  )), '[]'::jsonb)
  into v_packs
  from public.business_pack_license_tenant_state s
  where s.tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'tier_key', t->>'tier_key',
    'seat_count', t->>'seat_count',
    'label', t->>'label'
  )), '[]'::jsonb)
  into v_seats
  from jsonb_array_elements(public._as502_seat_tiers()) t;

  return jsonb_build_object(
    'found', true,
    'principle', 'APP owns licenses. Employees inherit access when APP owner grants module visibility.',
    'current_plan', jsonb_build_object(
      'plan_key', coalesce(v_sub->>'plan_key', 'business'),
      'status', coalesce(v_sub->>'status', 'active'),
      'renewal_date', v_sub->>'current_period_end'
    ),
    'business_packs', v_packs,
    'user_licenses', v_seats,
    'consumption', jsonb_build_object(
      'active_pack_licenses', (select count(*) from public.business_pack_license_tenant_state where tenant_id = v_tenant_id and license_status = 'active'),
      'total_seats', (select coalesce(sum(capacity_limit), 0) from public.business_pack_license_tenant_state where tenant_id = v_tenant_id and license_status = 'active'),
      'employees', (select count(*) from public.organization_users where organization_id = v_tenant_id and status = 'active')
    ),
    'supported_actions', jsonb_build_array('upgrade', 'downgrade', 'renew', 'cancel', 'purchase_more_seats'),
    'app_store_route', '/app/store',
    'module_access_route', '/app/settings/module-access'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. App Store actions (install · upgrade · remove)
-- ---------------------------------------------------------------------------
create or replace function public.perform_app_store_action(
  p_action_type text,
  p_pack_key text default null,
  p_payload jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_tier text := coalesce(p_payload->>'seat_tier', '5');
  v_base numeric;
  v_cost numeric;
  v_activation jsonb;
  v_confirmed boolean := coalesce((p_payload->>'payment_confirmed')::boolean, true);
  v_remove_confirmed boolean := coalesce((p_payload->>'confirmed')::boolean, false);
begin
  v_tenant_id := public._bpmke_require_tenant();

  if p_action_type = 'review_install' then
    perform public._bpmke_require_install();
    select starting_price_monthly into v_base from public.business_pack_marketplace_listings where pack_key = p_pack_key;
    v_cost := public._as502_estimate_cost(v_base, v_tier);
    return jsonb_build_object(
      'action', p_action_type,
      'pack_key', p_pack_key,
      'seat_tier', v_tier,
      'seat_count', public._as502_seat_count(v_tier),
      'monthly_cost', v_cost,
      'pricing_label', case when v_tier = 'enterprise' then 'Contact sales' else coalesce(v_cost::text || ' / month', 'Contact sales') end,
      'installation_flow', public._as502_install_flow(),
      'next_step', 'payment'
    );
  end if;

  if p_action_type = 'complete_install' then
    perform public._bpmke_require_install();
    if not v_confirmed then raise exception 'Payment confirmation required'; end if;

    select starting_price_monthly into v_base from public.business_pack_marketplace_listings where pack_key = p_pack_key;
    v_cost := public._as502_estimate_cost(v_base, v_tier);

    perform public._as502_apply_pack_license(v_tenant_id, p_pack_key, v_tier, v_cost);
    v_activation := public.activate_business_pack_modules(v_tenant_id, p_pack_key);

    if exists (select 1 from pg_proc where proname = 'perform_marketplace_self_service_action') then
      perform public.perform_marketplace_self_service_action('activate', p_pack_key, p_payload);
    end if;

    insert into public.business_pack_marketplace_install_progress (tenant_id, pack_key, workflow_step, steps_completed)
    values (v_tenant_id, p_pack_key, 'ready', '["activation","modules_registered","menu_updated"]'::jsonb)
    on conflict (tenant_id, pack_key) do update set workflow_step = 'ready', updated_at = now();

    update public.business_pack_marketplace_listings set install_count = install_count + 1 where pack_key = p_pack_key;

    perform public._as502_log(v_tenant_id, p_pack_key, 'install_completed',
      'Business pack installed and activated instantly',
      jsonb_build_object('seat_tier', v_tier, 'seat_count', public._as502_seat_count(v_tier), 'monthly_cost', v_cost));

    return jsonb_build_object(
      'action', p_action_type,
      'status', 'activated',
      'message', 'Purchase complete — pack active in seconds. Configure employee access in Module Access.',
      'modules', v_activation,
      'module_access_route', '/app/settings/module-access',
      'workspace_route', (select workspace_route from public.business_pack_identity where pack_key = p_pack_key limit 1)
    );
  end if;

  if p_action_type = 'upgrade_pack' then
    perform public._bpmke_require_install();
    v_tier := coalesce(p_payload->>'seat_tier', p_payload->>'target_tier', v_tier);
    select starting_price_monthly into v_base from public.business_pack_marketplace_listings where pack_key = p_pack_key;
    v_cost := public._as502_estimate_cost(v_base, v_tier);
    perform public._as502_apply_pack_license(v_tenant_id, p_pack_key, v_tier, v_cost);

    perform public._as502_log(v_tenant_id, p_pack_key, 'upgrade_completed',
      'Business pack upgraded — data, permissions, and configuration preserved',
      jsonb_build_object('seat_tier', v_tier, 'monthly_cost', v_cost));

    return jsonb_build_object(
      'action', p_action_type,
      'status', 'upgraded',
      'message', 'Upgrade applied. Existing data, permissions, employees, and configuration are preserved.',
      'seat_tier', v_tier,
      'monthly_cost', v_cost
    );
  end if;

  if p_action_type = 'remove_pack' then
    perform public._bpmke_require_install();
    if not v_remove_confirmed then
      return jsonb_build_object(
        'action', p_action_type,
        'status', 'confirmation_required',
        'warning', 'This pack and its modules will become unavailable. Historical data will be retained according to Aipify retention policies.',
        'requires_confirmation', true
      );
    end if;
    return public.customer_remove_business_pack(v_tenant_id, p_pack_key);
  end if;

  if p_action_type = 'contact_sales' then
    return jsonb_build_object(
      'action', p_action_type,
      'status', 'redirect',
      'message', 'Enterprise and custom licensing — contact Aipify sales.',
      'contact_route', '/app/support'
    );
  end if;

  raise exception 'Unknown action type: %', p_action_type;
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Platform revenue dashboard
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_app_store_revenue_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_top_packs jsonb;
  v_revenue jsonb;
begin
  if not public.is_platform_admin() then raise exception 'Platform admin required'; end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'pack_key', l.pack_key,
    'install_count', l.install_count,
    'trial_activation_count', l.trial_activation_count,
    'upgrade_conversion_count', l.upgrade_conversion_count,
    'view_count', l.view_count,
    'starting_price_monthly', l.starting_price_monthly
  ) order by l.install_count desc), '[]'::jsonb)
  into v_top_packs
  from public.business_pack_marketplace_listings l
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'pack_key', s.pack_key,
    'active_licenses', cnt,
    'total_seats', seats
  ) order by cnt desc), '[]'::jsonb)
  into v_revenue
  from (
    select pack_key, count(*) cnt, coalesce(sum(capacity_limit), 0) seats
    from public.business_pack_license_tenant_state
    where license_status = 'active'
    group by pack_key
  ) s;

  return jsonb_build_object(
    'found', true,
    'privacy_note', 'Aggregates only — no customer operational content.',
    'principle', 'The App Store is the commercial heart of Aipify.',
    'summary', jsonb_build_object(
      'published_packs', (select count(*) from public.business_pack_marketplace_listings where marketplace_visibility = 'published'),
      'total_installs', (select coalesce(sum(install_count), 0) from public.business_pack_marketplace_listings),
      'active_licenses', (select count(*) from public.business_pack_license_tenant_state where license_status = 'active'),
      'cancelled_licenses', (select count(*) from public.business_pack_license_tenant_state where license_status = 'cancelled'),
      'renewals_due_30d', (
        select count(*) from public.business_pack_license_tenant_state
        where license_status = 'active' and renewal_date between current_date and current_date + 30
      )
    ),
    'most_installed_packs', v_top_packs,
    'revenue_per_pack', v_revenue,
    'growth', jsonb_build_object(
      'installs_30d', (select count(*) from public.app_store_commercial_events where event_type = 'install_completed' and created_at > now() - interval '30 days'),
      'removals_30d', (select count(*) from public.app_store_commercial_events where event_type = 'pack_removed' and created_at > now() - interval '30 days')
    ),
    'future_proof_rule', 'Every future Business Pack must be installable through App Store — Module Registry, License Engine, no hardcoded installs.'
  );
end; $$;

grant execute on function public.get_app_store_home(text) to authenticated;
grant execute on function public.get_app_store_pack_detail(text) to authenticated;
grant execute on function public.get_customer_license_dashboard() to authenticated;
grant execute on function public.perform_app_store_action(text, text, jsonb) to authenticated;
grant execute on function public.get_platform_app_store_revenue_dashboard() to authenticated;
grant execute on function public.customer_remove_business_pack(uuid, text) to authenticated;
