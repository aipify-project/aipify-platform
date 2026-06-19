-- Phase 505A — Domain License & Domain Pack Installation Engine
-- APP owns subscription · APP owns Domain Licenses · Business Packs installed per domain

-- ---------------------------------------------------------------------------
-- 1. Extend organization_domains
-- ---------------------------------------------------------------------------
alter table public.organization_domains
  add column if not exists domain_status text not null default 'pending',
  add column if not exists connected_platform text not null default 'custom_website',
  add column if not exists license_status text not null default 'included',
  add column if not exists is_primary boolean not null default false,
  add column if not exists display_name text,
  add column if not exists license_purchased_at timestamptz,
  add column if not exists metadata jsonb not null default '{}'::jsonb;

do $$ begin
  alter table public.organization_domains
    add constraint organization_domains_domain_status_check
    check (domain_status in ('pending', 'active', 'suspended', 'removed'));
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.organization_domains
    add constraint organization_domains_connected_platform_check
    check (connected_platform in (
      'wordpress', 'shopify', 'woocommerce', 'custom_website', 'enterprise_integration', 'future_platform'
    ));
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.organization_domains
    add constraint organization_domains_license_status_check
    check (license_status in ('included', 'licensed', 'expired', 'suspended'));
exception when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- 2. Domain license pool (1 included + purchased additional)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_domain_license_pool (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  included_licenses integer not null default 1,
  purchased_licenses integer not null default 0,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.organization_domain_license_pool enable row level security;
revoke all on public.organization_domain_license_pool from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Per-domain Business Pack installations
-- ---------------------------------------------------------------------------
create table if not exists public.domain_business_pack_installations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  domain_id uuid not null references public.organization_domains (id) on delete cascade,
  pack_key text not null,
  license_status text not null default 'active' check (
    license_status in ('active', 'trial', 'suspended', 'removed')
  ),
  seat_tier text,
  installed_by_user_id uuid references public.users (id) on delete set null,
  installed_at timestamptz not null default now(),
  removed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, domain_id, pack_key)
);

create index if not exists domain_business_pack_installations_org_idx
  on public.domain_business_pack_installations (organization_id, domain_id, license_status);

alter table public.domain_business_pack_installations enable row level security;
revoke all on public.domain_business_pack_installations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Domain user assignments (managers + assigned employees)
-- ---------------------------------------------------------------------------
create table if not exists public.domain_user_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  domain_id uuid not null references public.organization_domains (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  assignment_role text not null default 'member' check (
    assignment_role in ('manager', 'member')
  ),
  created_at timestamptz not null default now(),
  unique (organization_id, domain_id, user_id)
);

create index if not exists domain_user_assignments_domain_idx
  on public.domain_user_assignments (organization_id, domain_id);

alter table public.domain_user_assignments enable row level security;
revoke all on public.domain_user_assignments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Audit log
-- ---------------------------------------------------------------------------
create table if not exists public.domain_license_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  domain_id uuid references public.organization_domains (id) on delete set null,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  pack_key text,
  summary text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists domain_license_audit_logs_org_idx
  on public.domain_license_audit_logs (organization_id, created_at desc);

alter table public.domain_license_audit_logs enable row level security;
revoke all on public.domain_license_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public._dl505_log(
  p_org_id uuid, p_domain_id uuid, p_action text, p_pack_key text, p_summary text, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.domain_license_audit_logs (
    organization_id, domain_id, actor_user_id, action, pack_key, summary, payload
  ) values (
    p_org_id, p_domain_id, (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_pack_key, p_summary, coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._dl505_ensure_license_pool(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_domain_license_pool (organization_id)
  values (p_org_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._dl505_license_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_included int;
  v_purchased int;
  v_used int;
begin
  perform public._dl505_ensure_license_pool(p_org_id);
  select included_licenses, purchased_licenses
  into v_included, v_purchased
  from public.organization_domain_license_pool where organization_id = p_org_id;

  select count(*)::int into v_used
  from public.organization_domains
  where organization_id = p_org_id and domain_status in ('pending', 'active');

  return jsonb_build_object(
    'purchased', coalesce(v_included, 1) + coalesce(v_purchased, 0),
    'used', v_used,
    'available', greatest(0, coalesce(v_included, 1) + coalesce(v_purchased, 0) - v_used),
    'included', coalesce(v_included, 1),
    'purchased_additional', coalesce(v_purchased, 0)
  );
end; $$;

create or replace function public._dl505_ensure_primary_domain(p_org_id uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_domain_id uuid; v_slug text; v_name text;
begin
  select id into v_domain_id
  from public.organization_domains
  where organization_id = p_org_id and is_primary = true
  limit 1;

  if v_domain_id is not null then return v_domain_id; end if;

  select id into v_domain_id
  from public.organization_domains
  where organization_id = p_org_id and domain_status in ('pending', 'active')
  order by created_at asc limit 1;

  if v_domain_id is not null then
    update public.organization_domains set is_primary = true, license_status = 'included' where id = v_domain_id;
    return v_domain_id;
  end if;

  select o.slug, o.name into v_slug, v_name from public.organizations o where o.id = p_org_id;

  insert into public.organization_domains (
    organization_id, domain, display_name, domain_status, connected_platform,
    verification_status, license_status, is_primary, verified_at
  ) values (
    p_org_id,
    coalesce(v_slug, 'app') || '.aipify.app',
    coalesce(v_name, 'Primary Domain'),
    'active',
    'custom_website',
    'verified',
    'included',
    true,
    now()
  )
  on conflict (organization_id, domain) do update set
    is_primary = true,
    license_status = 'included',
    domain_status = 'active',
    updated_at = now()
  returning id into v_domain_id;

  perform public._dl505_log(p_org_id, v_domain_id, 'domain_created', null,
    'Primary domain included with APP', jsonb_build_object('is_primary', true));

  return v_domain_id;
end; $$;

create or replace function public._dl505_available_domains(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._dl505_ensure_primary_domain(p_org_id);
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'domain_id', d.id,
      'domain', d.domain,
      'display_name', coalesce(d.display_name, d.domain),
      'domain_status', d.domain_status,
      'connected_platform', d.connected_platform,
      'is_primary', d.is_primary,
      'license_status', d.license_status
    ) order by d.is_primary desc, d.domain)
    from public.organization_domains d
    where d.organization_id = p_org_id and d.domain_status in ('pending', 'active')
  ), '[]'::jsonb);
end; $$;

create or replace function public._dl505_domain_installed_packs(p_org_id uuid, p_domain_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'pack_key', i.pack_key,
      'license_status', i.license_status,
      'installed_at', i.installed_at
    ) order by i.installed_at desc)
    from public.domain_business_pack_installations i
    where i.organization_id = p_org_id and i.domain_id = p_domain_id and i.license_status = 'active'
  ), '[]'::jsonb);
end; $$;

-- Domain-scoped pack activation
create or replace function public.activate_business_pack_modules_for_domain(
  p_organization_id uuid,
  p_domain_id uuid,
  p_pack_key text,
  p_seat_tier text default '5'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_domain record; v_activation jsonb;
begin
  select * into v_domain from public.organization_domains
  where id = p_domain_id and organization_id = p_organization_id;

  if v_domain.id is null then raise exception 'Domain not found'; end if;
  if v_domain.domain_status not in ('pending', 'active') then raise exception 'Domain is not active'; end if;

  insert into public.domain_business_pack_installations (
    organization_id, domain_id, pack_key, license_status, seat_tier,
    installed_by_user_id, installed_at
  ) values (
    p_organization_id, p_domain_id, p_pack_key, 'active', p_seat_tier,
    (select id from public.users where auth_user_id = auth.uid() limit 1), now()
  )
  on conflict (organization_id, domain_id, pack_key) do update set
    license_status = 'active',
    seat_tier = excluded.seat_tier,
    removed_at = null,
    updated_at = now();

  v_activation := public.activate_business_pack_modules(p_organization_id, p_pack_key);

  perform public._dl505_log(p_organization_id, p_domain_id, 'pack_installed', p_pack_key,
    'Business Pack installed on domain ' || v_domain.domain,
    jsonb_build_object('pack_key', p_pack_key, 'domain', v_domain.domain));

  return jsonb_build_object(
    'ok', true,
    'domain_id', p_domain_id,
    'domain', v_domain.domain,
    'pack_key', p_pack_key,
    'modules', v_activation
  );
end; $$;

create or replace function public.remove_business_pack_from_domain(
  p_organization_id uuid,
  p_domain_id uuid,
  p_pack_key text
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_domain record; v_remaining int;
begin
  perform public._bde_require_admin();

  select * into v_domain from public.organization_domains
  where id = p_domain_id and organization_id = p_organization_id;
  if v_domain.id is null then raise exception 'Domain not found'; end if;

  update public.domain_business_pack_installations
  set license_status = 'removed', removed_at = now(), updated_at = now()
  where organization_id = p_organization_id and domain_id = p_domain_id and pack_key = p_pack_key;

  select count(*)::int into v_remaining
  from public.domain_business_pack_installations
  where organization_id = p_organization_id and pack_key = p_pack_key and license_status = 'active';

  if v_remaining = 0 then
    perform public.customer_remove_business_pack(p_organization_id, p_pack_key);
  end if;

  perform public._dl505_log(p_organization_id, p_domain_id, 'pack_removed', p_pack_key,
    'Business Pack removed from domain ' || v_domain.domain, jsonb_build_object('remaining_domains', v_remaining));

  return jsonb_build_object(
    'ok', true,
    'message', case when v_remaining = 0
      then 'Pack removed from domain — no other domains use this pack; modules deactivated.'
      else 'Pack removed from this domain — still active on other domains.'
    end
  );
end; $$;

-- ---------------------------------------------------------------------------
-- Domain License Center
-- ---------------------------------------------------------------------------
create or replace function public.get_domain_license_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_primary uuid;
  v_domains jsonb;
  v_pending jsonb;
  v_packs jsonb;
begin
  perform public._bde_require_admin();
  v_org_id := public._presence_tenant_for_auth();
  v_primary := public._dl505_ensure_primary_domain(v_org_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id,
    'domain', d.domain,
    'display_name', coalesce(d.display_name, d.domain),
    'domain_status', d.domain_status,
    'connected_platform', d.connected_platform,
    'license_status', d.license_status,
    'is_primary', d.is_primary,
    'verification_status', d.verification_status,
    'installed_packs', public._dl505_domain_installed_packs(v_org_id, d.id),
    'assigned_users', (
      select count(*) from public.domain_user_assignments a
      where a.domain_id = d.id and a.organization_id = v_org_id
    ),
    'created_at', d.created_at
  ) order by d.is_primary desc, d.domain), '[]'::jsonb)
  into v_domains
  from public.organization_domains d
  where d.organization_id = v_org_id and d.domain_status = 'active';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'domain', d.domain, 'domain_status', d.domain_status,
    'connected_platform', d.connected_platform, 'verification_status', d.verification_status
  ) order by d.created_at desc), '[]'::jsonb)
  into v_pending
  from public.organization_domains d
  where d.organization_id = v_org_id and d.domain_status = 'pending';

  select coalesce(jsonb_agg(jsonb_build_object(
    'domain_id', d.id, 'domain', d.domain, 'pack_key', i.pack_key,
    'license_status', i.license_status, 'installed_at', i.installed_at
  ) order by i.installed_at desc), '[]'::jsonb)
  into v_packs
  from public.domain_business_pack_installations i
  join public.organization_domains d on d.id = i.domain_id
  where i.organization_id = v_org_id and i.license_status = 'active';

  return jsonb_build_object(
    'found', true,
    'principle', 'APP owns domains. Domains own Business Pack installations. Employees receive access through APP permissions.',
    'structure', 'PLATFORM → APP → DOMAIN LICENSES → BUSINESS PACKS → EMPLOYEES',
    'primary_domain_id', v_primary,
    'license_summary', public._dl505_license_summary(v_org_id),
    'active_domains', v_domains,
    'pending_domains', v_pending,
    'installed_packs', v_packs,
    'supported_platforms', jsonb_build_array(
      'wordpress', 'shopify', 'woocommerce', 'custom_website', 'enterprise_integration', 'future_platform'
    ),
    'store_route', '/app/store',
    'domain_license_product_route', '/app/store/additional_domain_license'
  );
end; $$;

create or replace function public.perform_domain_license_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_domain_id uuid;
  v_summary jsonb;
  v_domain text;
  v_platform text;
begin
  perform public._bde_require_admin();
  v_org_id := public._presence_tenant_for_auth();
  perform public._dl505_ensure_license_pool(v_org_id);
  v_summary := public._dl505_license_summary(v_org_id);

  if p_action_type = 'create_domain' then
    if (v_summary->>'available')::int <= 0 then
      raise exception 'No available Domain License — purchase Additional Domain License in Marketplace';
    end if;

    v_domain := lower(trim(coalesce(p_payload->>'domain', '')));
    if v_domain = '' then raise exception 'Domain name required'; end if;
    v_platform := coalesce(p_payload->>'connected_platform', 'custom_website');

    insert into public.organization_domains (
      organization_id, domain, display_name, domain_status, connected_platform,
      verification_status, license_status, is_primary
    ) values (
      v_org_id, v_domain, coalesce(p_payload->>'display_name', v_domain), 'pending', v_platform,
      'pending',
      case when (v_summary->>'used')::int = 0 then 'included' else 'licensed' end,
      false
    )
    returning id into v_domain_id;

    perform public._dl505_log(v_org_id, v_domain_id, 'domain_created', null, 'Domain added — pending verification', p_payload);
    return jsonb_build_object('ok', true, 'domain_id', v_domain_id, 'message', 'Domain added');

  elsif p_action_type = 'activate_domain' then
    v_domain_id := (p_payload->>'domain_id')::uuid;
    update public.organization_domains
    set domain_status = 'active', verification_status = 'verified', verified_at = coalesce(verified_at, now()), updated_at = now()
    where id = v_domain_id and organization_id = v_org_id;
    perform public._dl505_log(v_org_id, v_domain_id, 'domain_activated', null, 'Domain activated', p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'remove_domain' then
    v_domain_id := (p_payload->>'domain_id')::uuid;
    if exists (select 1 from public.organization_domains where id = v_domain_id and organization_id = v_org_id and is_primary) then
      raise exception 'Primary domain cannot be removed';
    end if;
    update public.organization_domains set domain_status = 'removed', updated_at = now()
    where id = v_domain_id and organization_id = v_org_id;
    perform public._dl505_log(v_org_id, v_domain_id, 'domain_removed', null, 'Domain removed', p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'purchase_domain_license' then
    update public.organization_domain_license_pool
    set purchased_licenses = purchased_licenses + coalesce((p_payload->>'quantity')::int, 1), updated_at = now()
    where organization_id = v_org_id;
    perform public._dl505_log(v_org_id, null, 'domain_license_purchased', null,
      'Additional Domain License purchased', p_payload);
    return jsonb_build_object('ok', true, 'license_summary', public._dl505_license_summary(v_org_id));

  elsif p_action_type = 'assign_user' then
    v_domain_id := (p_payload->>'domain_id')::uuid;
    insert into public.domain_user_assignments (organization_id, domain_id, user_id, assignment_role)
    values (v_org_id, v_domain_id, (p_payload->>'user_id')::uuid, coalesce(p_payload->>'assignment_role', 'member'))
    on conflict (organization_id, domain_id, user_id) do update set assignment_role = excluded.assignment_role;
    perform public._dl505_log(v_org_id, v_domain_id, 'user_assigned', null, 'User assigned to domain', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  return jsonb_build_object('ok', false, 'error', 'Unknown action');
end; $$;

-- Companion domain context
create or replace function public.get_companion_domain_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_domains jsonb;
begin
  v_org_id := public._presence_tenant_for_auth();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  v_domains := public._dl505_available_domains(v_org_id);

  return jsonb_build_object(
    'found', true,
    'principle', 'Companion understands domain context for pack installation.',
    'domains', v_domains,
    'store_route', '/app/store',
    'example_flow', jsonb_build_array('marketplace', 'select_pack', 'select_domain', 'install')
  );
end; $$;

-- Register domain permissions
do $$ declare v_kind text; begin
  perform public._mre501_seed_module(
    'domains', 'Domains', 'domains', 'governance', 'Domain License and domain-scoped Business Pack management.',
    'starter', null, 'settings', '/app/domains', 'owner_only', 7
  );
  foreach v_kind in array array['create','delete','assign','configure']
  loop
    insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
    values ('domains', 'domains.' || v_kind, v_kind, 'Domains — ' || v_kind)
    on conflict (permission_key) do nothing;
  end loop;
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values ('domains', 'domains.install_pack', 'custom', 'Install Business Pack on domain')
  on conflict (permission_key) do nothing;
end $$;

-- Update install flow
create or replace function public._as502_install_flow()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'select_domain', 'select_license_quantity', 'review_cost', 'payment', 'activation',
    'modules_registered', 'domain_updated', 'menu_updated', 'access_available'
  );
$$;

-- Update App Store actions — domain required for install
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
  v_domain_id uuid := nullif(p_payload->>'domain_id', '')::uuid;
  v_domain_name text;
begin
  v_tenant_id := public._bpmke_require_tenant();

  if p_action_type = 'review_install' then
    perform public._bpmke_require_install();
    if v_domain_id is null then
      return jsonb_build_object(
        'action', p_action_type,
        'error', 'domain_required',
        'message', 'Select a domain before installing this Business Pack.',
        'available_domains', public._dl505_available_domains(v_tenant_id),
        'domain_required', true
      );
    end if;
    if not exists (
      select 1 from public.organization_domains
      where id = v_domain_id and organization_id = v_tenant_id and domain_status in ('pending', 'active')
    ) then
      raise exception 'Invalid domain selection';
    end if;
    select domain into v_domain_name from public.organization_domains where id = v_domain_id;

    select starting_price_monthly into v_base from public.business_pack_marketplace_listings where pack_key = p_pack_key;
    v_cost := public._as502_estimate_cost(v_base, v_tier);
    return jsonb_build_object(
      'action', p_action_type,
      'pack_key', p_pack_key,
      'domain_id', v_domain_id,
      'domain', v_domain_name,
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
    if v_domain_id is null then raise exception 'Domain selection required — Business Packs install per domain'; end if;

    select domain into v_domain_name from public.organization_domains where id = v_domain_id;

    select starting_price_monthly into v_base from public.business_pack_marketplace_listings where pack_key = p_pack_key;
    v_cost := public._as502_estimate_cost(v_base, v_tier);

    perform public._as502_apply_pack_license(v_tenant_id, p_pack_key, v_tier, v_cost);
    v_activation := public.activate_business_pack_modules_for_domain(v_tenant_id, v_domain_id, p_pack_key, v_tier);

    if exists (select 1 from pg_proc where proname = 'perform_marketplace_self_service_action') then
      perform public.perform_marketplace_self_service_action('activate', p_pack_key, p_payload);
    end if;

    insert into public.business_pack_marketplace_install_progress (tenant_id, pack_key, workflow_step, steps_completed)
    values (v_tenant_id, p_pack_key, 'ready', '["domain_selected","activation","modules_registered","menu_updated"]'::jsonb)
    on conflict (tenant_id, pack_key) do update set workflow_step = 'ready', updated_at = now();

    update public.business_pack_marketplace_listings set install_count = install_count + 1 where pack_key = p_pack_key;

    perform public._as502_log(v_tenant_id, p_pack_key, 'install_completed',
      'Business pack installed on domain',
      jsonb_build_object('seat_tier', v_tier, 'domain_id', v_domain_id, 'monthly_cost', v_cost));

    perform public._dl505_log(v_tenant_id, v_domain_id, 'pack_installed', p_pack_key,
      'Business Pack installed via App Store', jsonb_build_object('pack_key', p_pack_key));

    return jsonb_build_object(
      'action', p_action_type,
      'status', 'activated',
      'message', 'Purchase complete — pack active on selected domain. Configure employee access in Module Access.',
      'domain_id', v_domain_id,
      'domain', v_domain_name,
      'modules', v_activation,
      'module_access_route', '/app/settings/module-access',
      'domains_route', '/app/domains',
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
        'warning', 'This pack will be removed from the selected domain or organization.',
        'requires_confirmation', true
      );
    end if;
    if v_domain_id is not null then
      return public.remove_business_pack_from_domain(v_tenant_id, v_domain_id, p_pack_key);
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

-- Extend pack detail with available domains
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
    'permission_key', p.permission_key, 'permission_name', p.description, 'module_key', p.module_key
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
    'license_requirements', 'Active Aipify APP subscription. Business Packs install per domain — select domain before purchase.',
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
      jsonb_build_object('question', 'Which domain does this install on?', 'answer', 'You must select a domain — packs do not auto-install on all domains.'),
      jsonb_build_object('question', 'How fast is activation?', 'answer', 'Purchase to active in seconds after domain selection.'),
      jsonb_build_object('question', 'Do employees get access automatically?', 'answer', 'No. APP owner controls module access in Module Access settings.')
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
    'available_domains', public._dl505_available_domains(v_tenant_id),
    'domain_required', true,
    'module_access_route', '/app/settings/module-access',
    'domains_route', '/app/domains'
  );
end; $$;

-- Additional Domain License marketplace listing (when App Store tables exist)
do $$ begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'business_pack_marketplace_listings'
  ) then
    insert into public.business_pack_marketplace_listings (
      pack_key, marketplace_visibility, marketplace_category, starting_price_monthly,
      pricing_label, trial_available, install_available, metadata
    ) values (
      'additional_domain_license',
      'published',
      'governance',
      29.00,
      '29 / month per domain',
      false,
      true,
      jsonb_build_object(
        'product_type', 'domain_license',
        'description', 'Add another website, store, or business domain to your Aipify organization.'
      )
    ) on conflict (pack_key) do update set
      marketplace_visibility = 'published',
      pricing_label = excluded.pricing_label,
      metadata = excluded.metadata,
      updated_at = now();
  end if;
end $$;

-- Grants
grant execute on function public.get_domain_license_center() to authenticated;
grant execute on function public.perform_domain_license_action(text, jsonb) to authenticated;
grant execute on function public.activate_business_pack_modules_for_domain(uuid, uuid, text, text) to authenticated;
grant execute on function public.remove_business_pack_from_domain(uuid, uuid, text) to authenticated;
grant execute on function public.get_companion_domain_context() to authenticated;
grant execute on function public._dl505_available_domains(uuid) to authenticated;
