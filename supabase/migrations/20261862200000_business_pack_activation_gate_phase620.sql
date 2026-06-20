-- Phase 620 — Permanent Business Pack Activation Gate

-- Allow staged modules during activation gate validation
alter table public.organization_module_activations
  drop constraint if exists organization_module_activations_status_check;

alter table public.organization_module_activations
  add constraint organization_module_activations_status_check
  check (status in ('active', 'trial', 'hidden', 'suspended', 'removed', 'pending_activation'));

-- ---------------------------------------------------------------------------
-- 1. Activation gate state
-- ---------------------------------------------------------------------------
create table if not exists public.organization_business_pack_activation_gates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  activation_status text not null default 'pending_activation' check (
    activation_status in (
      'pending_activation', 'validating', 'active', 'activation_failed', 'suspended', 'removed'
    )
  ),
  current_step text,
  failed_step text,
  retry_count integer not null default 0,
  diagnostic_summary text,
  provisioning_version text,
  last_smoke_status text,
  last_smoke_at timestamptz,
  validated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, pack_key)
);

create index if not exists organization_business_pack_activation_gates_status_idx
  on public.organization_business_pack_activation_gates (activation_status, updated_at desc);

create table if not exists public.organization_business_pack_activation_step_logs (
  id uuid primary key default gen_random_uuid(),
  gate_id uuid not null references public.organization_business_pack_activation_gates (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  step_key text not null,
  step_status text not null check (step_status in ('passed', 'failed', 'skipped')),
  safe_message text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_business_pack_activation_step_logs_gate_idx
  on public.organization_business_pack_activation_step_logs (gate_id, created_at desc);

alter table public.organization_business_pack_activation_gates enable row level security;
alter table public.organization_business_pack_activation_step_logs enable row level security;
revoke all on public.organization_business_pack_activation_gates from authenticated, anon;
revoke all on public.organization_business_pack_activation_step_logs from authenticated, anon;

-- Optional pack-specific GET RPC requirements for readonly validation
create table if not exists public.business_pack_activation_requirements (
  pack_key text primary key,
  required_get_rpcs text[] not null default '{}'::text[],
  updated_at timestamptz not null default now()
);

alter table public.business_pack_activation_requirements enable row level security;
revoke all on public.business_pack_activation_requirements from authenticated, anon;

insert into public.business_pack_activation_requirements (pack_key, required_get_rpcs)
select v.pack_key, v.rpcs from (values
  ('support_pack', array['get_app_portal_success_center']::text[]),
  ('commerce_pack', array[]::text[]),
  ('warehouse_pack', array[]::text[]),
  ('hosts_pack', array[]::text[])
) as v(pack_key, rpcs)
on conflict (pack_key) do nothing;

-- ---------------------------------------------------------------------------
-- 2. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._bpag620_steps()
returns text[] language sql immutable as $$
  select array[
    'subscription_update',
    'license_validation',
    'business_pack_installation',
    'entitlement_creation',
    'database_schema',
    'rpc_availability',
    'role_permissions',
    'organization_module_status',
    'readonly_get_validation',
    'smoke_check',
    'menu_route_visibility'
  ];
$$;

create or replace function public._bpag620_log_step(
  p_gate_id uuid,
  p_org_id uuid,
  p_pack_key text,
  p_step text,
  p_status text,
  p_message text default null,
  p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_business_pack_activation_step_logs (
    gate_id, organization_id, pack_key, step_key, step_status, safe_message, payload
  ) values (
    p_gate_id, p_org_id, p_pack_key, p_step, p_status, left(coalesce(p_message, ''), 500), coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._bpag620_notify_platform_failure(
  p_org_id uuid,
  p_pack_key text,
  p_failed_step text,
  p_summary text
)
returns void language plpgsql security definer set search_path = public as $$
declare v_org_name text;
begin
  select o.name into v_org_name from public.organizations o where o.id = p_org_id;
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'platform_health_alerts') then
    insert into public.platform_health_alerts (title, category, severity, resolution_status, summary)
    values (
      'Business Pack activation failed',
      'business_pack_activation',
      'high',
      'open',
      left(format('Organization %s — pack %s failed at %s. %s',
        coalesce(v_org_name, p_org_id::text), p_pack_key, p_failed_step, coalesce(p_summary, '')), 500)
    );
  end if;
end; $$;

create or replace function public._bpag620_is_pack_activation_active(
  p_org_id uuid,
  p_pack_key text
)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare v_status text;
begin
  if p_pack_key is null then return true; end if;
  select g.activation_status into v_status
  from public.organization_business_pack_activation_gates g
  where g.organization_id = p_org_id and g.pack_key = p_pack_key;
  if v_status is null then
    -- Legacy installs without gate row: allow only when modules already active
    return exists (
      select 1 from public.organization_module_activations m
      where m.organization_id = p_org_id
        and m.business_pack_key = p_pack_key
        and m.status in ('active', 'trial')
        and m.menu_visible = true
    );
  end if;
  return v_status = 'active';
end; $$;

create or replace function public._bpag620_validate_step(
  p_org_id uuid,
  p_pack_key text,
  p_step text
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_customer_id uuid;
  v_license text;
  v_sub_status text;
  v_rpc text;
  v_def text;
  v_vol char;
  v_req record;
begin
  select c.id into v_customer_id
  from public.customers c
  where c.company_id = p_org_id or c.id = p_org_id
  limit 1;

  if p_step = 'subscription_update' then
    select s.status into v_sub_status
    from public.organization_subscriptions s
    where s.organization_id = p_org_id
    limit 1;
    if v_sub_status is null and v_customer_id is not null then
      select s.status into v_sub_status
      from public.subscriptions s
      where s.customer_id = v_customer_id
      order by s.created_at desc
      limit 1;
    end if;
    if coalesce(v_sub_status, 'active') in ('active', 'trial', 'internal', 'trialing') then
      return jsonb_build_object('ok', true);
    end if;
    return jsonb_build_object('ok', false, 'message', 'Subscription is not active');
  end if;

  if p_step = 'license_validation' then
    if exists (select 1 from pg_proc where proname = 'resolve_license_service_status') then
      v_license := public.resolve_license_service_status(coalesce(v_customer_id, p_org_id));
    else
      v_license := 'active';
    end if;
    if v_license in ('active', 'grace_period', 'trial') then
      return jsonb_build_object('ok', true);
    end if;
    return jsonb_build_object('ok', false, 'message', 'License is not active');
  end if;

  if p_step = 'business_pack_installation' then
    if exists (
      select 1 from public.organization_business_packs obp
      join public.business_packs bp on bp.id = obp.business_pack_id
      where obp.organization_id = p_org_id and bp.pack_key = p_pack_key
    ) or exists (
      select 1 from public.business_pack_license_tenant_state s
      where s.tenant_id = p_org_id and s.pack_key = p_pack_key
        and s.license_status in ('active', 'trial')
    ) or exists (
      select 1 from public.organization_module_activations m
      where m.organization_id = p_org_id and m.business_pack_key = p_pack_key
    ) then
      return jsonb_build_object('ok', true);
    end if;
    return jsonb_build_object('ok', false, 'message', 'Business Pack is not installed');
  end if;

  if p_step = 'entitlement_creation' then
    if exists (
      select 1 from public.business_pack_license_tenant_state s
      where s.tenant_id = p_org_id and s.pack_key = p_pack_key
        and s.license_status in ('active', 'trial')
    ) or exists (
      select 1 from public.marketplace_entitlements me
      join public.marketplace_items mi on mi.id = me.item_id
      where me.tenant_id = coalesce(v_customer_id, p_org_id)
        and me.entitlement_type in ('active', 'trial', 'enterprise')
        and (mi.slug = p_pack_key or mi.title ilike '%' || replace(p_pack_key, '_', ' ') || '%')
    ) or exists (
      select 1 from public.organization_module_activations m
      where m.organization_id = p_org_id and m.business_pack_key = p_pack_key
    ) then
      return jsonb_build_object('ok', true);
    end if;
    return jsonb_build_object('ok', false, 'message', 'Entitlement is not active');
  end if;

  if p_step = 'database_schema' then
    if to_regclass('public.organization_module_activations') is not null
       and to_regclass('public.aipify_module_registry') is not null
       and to_regclass('public.aipify_navigation_registry') is not null then
      return jsonb_build_object('ok', true);
    end if;
    return jsonb_build_object('ok', false, 'message', 'Required schema objects are missing');
  end if;

  if p_step = 'rpc_availability' then
    if not exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                   where n.nspname = 'public' and p.proname = 'get_dynamic_app_navigation') then
      return jsonb_build_object('ok', false, 'message', 'Navigation RPC is unavailable');
    end if;
    select * into v_req from public.business_pack_activation_requirements where pack_key = p_pack_key;
    if v_req.pack_key is not null then
      foreach v_rpc in array coalesce(v_req.required_get_rpcs, '{}'::text[])
      loop
        if not exists (
          select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
          where n.nspname = 'public' and p.proname = v_rpc
        ) then
          return jsonb_build_object('ok', false, 'message', format('Required RPC %s is unavailable', v_rpc));
        end if;
      end loop;
    end if;
    return jsonb_build_object('ok', true);
  end if;

  if p_step = 'role_permissions' then
    if exists (
      select 1 from public.aipify_module_registry r
      join public.aipify_module_permissions mp on mp.module_key = r.module_key
      where r.required_business_pack = p_pack_key
    ) and exists (
      select 1 from public.organization_role_permissions orp
      where orp.organization_id = p_org_id
    ) then
      return jsonb_build_object('ok', true);
    end if;
    if exists (
      select 1 from public.organization_module_role_grants g
      join public.aipify_module_registry r on r.module_key = g.module_key
      where g.organization_id = p_org_id and r.required_business_pack = p_pack_key
    ) then
      return jsonb_build_object('ok', true);
    end if;
    return jsonb_build_object('ok', false, 'message', 'Role permissions are not provisioned');
  end if;

  if p_step = 'organization_module_status' then
    if exists (
      select 1 from public.organization_module_activations m
      join public.aipify_module_registry r on r.module_key = m.module_key
      where m.organization_id = p_org_id
        and r.required_business_pack = p_pack_key
        and m.status in ('active', 'trial', 'pending_activation', 'hidden')
        and m.licensed = true
    ) then
      return jsonb_build_object('ok', true);
    end if;
    return jsonb_build_object('ok', false, 'message', 'Organization modules are not staged');
  end if;

  if p_step = 'readonly_get_validation' then
    select * into v_req from public.business_pack_activation_requirements where pack_key = p_pack_key;
    if v_req.pack_key is null then
      return jsonb_build_object('ok', true);
    end if;
    foreach v_rpc in array coalesce(v_req.required_get_rpcs, '{}'::text[])
    loop
      select p.provolatile, pg_get_functiondef(p.oid)
      into v_vol, v_def
      from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.proname = v_rpc
      limit 1;
      if v_vol = 'v' then
        continue;
      end if;
      if v_def ilike '% insert into %' or v_def ilike '% update %set%' or v_def ilike '% upsert%' then
        return jsonb_build_object('ok', false, 'message', format('Read RPC %s performs writes', v_rpc));
      end if;
    end loop;
    return jsonb_build_object('ok', true);
  end if;

  if p_step = 'smoke_check' then
    return public._bpag620_validate_step(p_org_id, p_pack_key, 'readonly_get_validation');
  end if;

  if p_step = 'menu_route_visibility' then
    if exists (
      select 1 from public.aipify_navigation_registry n
      join public.aipify_module_registry r on r.module_key = n.module_key
      where r.required_business_pack = p_pack_key and n.status = 'active'
    ) or not exists (
      select 1 from public.aipify_module_registry where required_business_pack = p_pack_key
    ) then
      return jsonb_build_object('ok', true);
    end if;
    return jsonb_build_object('ok', false, 'message', 'Menu routes are not registered');
  end if;

  return jsonb_build_object('ok', false, 'message', 'Unknown activation step');
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Orchestrator (VOLATILE)
-- ---------------------------------------------------------------------------
create or replace function public.run_business_pack_activation_gate(
  p_org_id uuid,
  p_pack_key text
)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare
  v_gate_id uuid;
  v_step text;
  v_result jsonb;
  v_steps text[] := public._bpag620_steps();
begin
  insert into public.organization_business_pack_activation_gates (
    organization_id, pack_key, activation_status, current_step, provisioning_version
  ) values (
    p_org_id, p_pack_key, 'validating', v_steps[1], '20261862200000'
  )
  on conflict (organization_id, pack_key) do update set
    activation_status = 'validating',
    current_step = excluded.current_step,
    failed_step = null,
    diagnostic_summary = null,
    updated_at = now()
  returning id into v_gate_id;

  foreach v_step in array v_steps
  loop
    update public.organization_business_pack_activation_gates
    set current_step = v_step, updated_at = now()
    where id = v_gate_id;

    v_result := public._bpag620_validate_step(p_org_id, p_pack_key, v_step);
    if coalesce(v_result->>'ok', 'false') <> 'true' then
      update public.organization_business_pack_activation_gates
      set activation_status = 'activation_failed',
          failed_step = v_step,
          diagnostic_summary = coalesce(v_result->>'message', 'Activation step failed'),
          updated_at = now()
      where id = v_gate_id;

      perform public._bpag620_log_step(
        v_gate_id, p_org_id, p_pack_key, v_step, 'failed', v_result->>'message', v_result
      );
      perform public._bpag620_notify_platform_failure(
        p_org_id, p_pack_key, v_step, v_result->>'message'
      );

      update public.organization_module_activations m
      set menu_visible = false, status = 'pending_activation', updated_at = now()
      from public.aipify_module_registry r
      where m.organization_id = p_org_id
        and m.module_key = r.module_key
        and r.required_business_pack = p_pack_key;

      return jsonb_build_object(
        'ok', false,
        'pack_key', p_pack_key,
        'activation_status', 'activation_failed',
        'failed_step', v_step,
        'message', v_result->>'message'
      );
    end if;

    perform public._bpag620_log_step(
      v_gate_id, p_org_id, p_pack_key, v_step, 'passed', null, v_result
    );
  end loop;

  update public.organization_module_activations m
  set menu_visible = true, status = 'active', activated_at = coalesce(m.activated_at, now()), updated_at = now()
  from public.aipify_module_registry r
  where m.organization_id = p_org_id
    and m.module_key = r.module_key
    and r.required_business_pack = p_pack_key;

  update public.organization_business_pack_activation_gates
  set activation_status = 'active',
      current_step = null,
      failed_step = null,
      diagnostic_summary = null,
      last_smoke_status = 'passed',
      last_smoke_at = now(),
      validated_at = now(),
      updated_at = now()
  where id = v_gate_id;

  return jsonb_build_object(
    'ok', true,
    'pack_key', p_pack_key,
    'activation_status', 'active'
  );
end; $$;

create or replace function public.retry_business_pack_activation_gate(
  p_org_id uuid,
  p_pack_key text
)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
begin
  update public.organization_business_pack_activation_gates
  set retry_count = retry_count + 1, updated_at = now()
  where organization_id = p_org_id and pack_key = p_pack_key;

  return public.run_business_pack_activation_gate(p_org_id, p_pack_key);
end; $$;

create or replace function public.get_organization_business_pack_activation_gates(
  p_pack_key text default null
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_items jsonb;
begin
  v_org_id := public._presence_tenant_for_auth();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'pack_key', g.pack_key,
    'activation_status', g.activation_status,
    'current_step', g.current_step,
    'failed_step', g.failed_step,
    'retry_count', g.retry_count,
    'validated_at', g.validated_at,
    'updated_at', g.updated_at
  ) order by g.updated_at desc), '[]'::jsonb)
  into v_items
  from public.organization_business_pack_activation_gates g
  where g.organization_id = v_org_id
    and (p_pack_key is null or g.pack_key = p_pack_key)
    and g.activation_status in ('pending_activation', 'validating', 'activation_failed');

  return jsonb_build_object('found', true, 'items', v_items);
end; $$;

create or replace function public.get_platform_business_pack_activation_overview()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_items jsonb;
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'organization_id', g.organization_id,
    'organization_name', o.name,
    'pack_key', g.pack_key,
    'activation_status', g.activation_status,
    'current_step', g.current_step,
    'failed_step', g.failed_step,
    'retry_count', g.retry_count,
    'diagnostic_summary', g.diagnostic_summary,
    'provisioning_version', g.provisioning_version,
    'last_smoke_status', g.last_smoke_status,
    'last_smoke_at', g.last_smoke_at,
    'updated_at', g.updated_at
  ) order by g.updated_at desc), '[]'::jsonb)
  into v_items
  from public.organization_business_pack_activation_gates g
  join public.organizations o on o.id = g.organization_id
  where g.activation_status in ('pending_activation', 'validating', 'activation_failed')
  limit 100;

  return jsonb_build_object(
    'found', true,
    'items', v_items,
    'privacy_note', 'Aggregates activation gate status only — no customer operational content.'
  );
end; $$;

create or replace function public.perform_business_pack_activation_gate_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_pack_key text;
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  v_org_id := (p_payload->>'organization_id')::uuid;
  v_pack_key := p_payload->>'pack_key';
  if v_org_id is null or v_pack_key is null then
    raise exception 'organization_id and pack_key required';
  end if;

  if p_action_type = 'retry_activation' then
    return public.retry_business_pack_activation_gate(v_org_id, v_pack_key);
  end if;

  if p_action_type = 'suspend_activation' then
    update public.organization_business_pack_activation_gates
    set activation_status = 'suspended', updated_at = now()
    where organization_id = v_org_id and pack_key = v_pack_key;
    return jsonb_build_object('ok', true, 'activation_status', 'suspended');
  end if;

  raise exception 'Unknown action: %', p_action_type;
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Integrate module visibility + pack activation staging
-- ---------------------------------------------------------------------------
create or replace function public.is_organization_module_active(
  p_organization_id uuid,
  p_module_key text
)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare
  v_reg public.aipify_module_registry;
  v_act public.organization_module_activations;
begin
  if not public._mre501_org_subscription_active(p_organization_id) then
    return false;
  end if;

  select * into v_reg from public.aipify_module_registry where module_key = p_module_key;
  if v_reg.id is null or v_reg.status <> 'active' then return false; end if;

  if v_reg.required_business_pack is not null
     and not public._bpag620_is_pack_activation_active(p_organization_id, v_reg.required_business_pack) then
    return false;
  end if;

  select * into v_act from public.organization_module_activations
  where organization_id = p_organization_id and module_key = p_module_key;

  if v_act.id is null then
    if v_reg.required_business_pack is null then return true; end if;
    return false;
  end if;

  return v_act.licensed and v_act.menu_visible and v_act.status in ('active', 'trial');
end; $$;

create or replace function public._dmn505_is_nav_visible(
  p_org_id uuid,
  p_user_id uuid,
  p_nav record,
  p_license_paused boolean,
  p_owner_hidden boolean
) returns boolean language plpgsql stable security definer set search_path = public as $$
begin
  if p_owner_hidden then return false; end if;
  if p_license_paused and not coalesce(p_nav.suspended_allowed, false) and not coalesce(p_nav.always_visible, false) then
    return false;
  end if;
  if p_nav.business_pack_key is not null
     and not public._bpag620_is_pack_activation_active(p_org_id, p_nav.business_pack_key) then
    return false;
  end if;
  if p_nav.module_key is null then return true; end if;
  if not public.is_organization_module_active(p_org_id, p_nav.module_key) then return false; end if;
  if p_nav.permission_key is not null then
    return public.user_has_permission(p_org_id, p_user_id, p_nav.permission_key);
  end if;
  return public.is_user_module_visible(p_org_id, p_user_id, p_nav.module_key);
end; $$;

create or replace function public.activate_business_pack_modules(
  p_organization_id uuid,
  p_pack_key text
)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare v_mod record;
  v_count int := 0;
  v_gate jsonb;
begin
  if not public.is_platform_admin() and not public._mre501_org_subscription_active(p_organization_id) then
    raise exception 'Platform admin or active organization required';
  end if;

  insert into public.organization_business_pack_activation_gates (
    organization_id, pack_key, activation_status, current_step, provisioning_version
  ) values (
    p_organization_id, p_pack_key, 'pending_activation', 'subscription_update', '20261862200000'
  )
  on conflict (organization_id, pack_key) do update set
    activation_status = case
      when organization_business_pack_activation_gates.activation_status = 'active'
        then organization_business_pack_activation_gates.activation_status
      else 'pending_activation'
    end,
    updated_at = now();

  for v_mod in
    select * from public.aipify_module_registry
    where required_business_pack = p_pack_key and status = 'active'
  loop
    insert into public.organization_module_activations (
      organization_id, module_key, activation_source, business_pack_key, menu_visible, licensed, status, activated_at
    ) values (
      p_organization_id, v_mod.module_key, 'business_pack', p_pack_key, false, true, 'pending_activation', null
    )
    on conflict (organization_id, module_key) do update set
      activation_source = 'business_pack',
      business_pack_key = p_pack_key,
      menu_visible = false,
      licensed = true,
      status = case
        when organization_module_activations.status = 'active'
          and exists (
            select 1 from public.organization_business_pack_activation_gates g
            where g.organization_id = p_organization_id
              and g.pack_key = p_pack_key
              and g.activation_status = 'active'
          )
          then organization_module_activations.status
        else 'pending_activation'
      end,
      updated_at = now();

    insert into public.tenant_modules (tenant_id, module_key, suite_key, licensed, enabled, status, activated_at)
    values (p_organization_id, v_mod.module_key, p_pack_key, true, false, 'pending', null)
    on conflict (tenant_id, module_key) do update set
      suite_key = p_pack_key, licensed = true, enabled = false, status = 'pending', updated_at = now();

    v_count := v_count + 1;
  end loop;

  perform public._mre501_log('platform', 'pack_activation_started', null, p_organization_id,
    'Business pack activation gate started: ' || p_pack_key,
    jsonb_build_object('pack_key', p_pack_key, 'module_count', v_count));

  v_gate := public.run_business_pack_activation_gate(p_organization_id, p_pack_key);

  if coalesce(v_gate->>'ok', 'false') = 'true' then
    update public.tenant_modules tm
    set enabled = true, status = 'enabled', activated_at = coalesce(tm.activated_at, now()), updated_at = now()
    from public.aipify_module_registry r
    where tm.tenant_id = p_organization_id
      and tm.module_key = r.module_key
      and r.required_business_pack = p_pack_key;
  end if;

  return v_gate || jsonb_build_object('modules_staged', v_count);
end; $$;

-- Backfill active gates for already-provisioned packs (preserve Unonight and pilots)
insert into public.organization_business_pack_activation_gates (
  organization_id, pack_key, activation_status, validated_at, provisioning_version, last_smoke_status, last_smoke_at
)
select distinct m.organization_id, m.business_pack_key, 'active', now(), '20261862200000', 'backfill', now()
from public.organization_module_activations m
where m.business_pack_key is not null
  and m.status in ('active', 'trial')
  and m.menu_visible = true
on conflict (organization_id, pack_key) do nothing;

grant execute on function public.get_organization_business_pack_activation_gates(text) to authenticated;
grant execute on function public.get_platform_business_pack_activation_overview() to authenticated;
grant execute on function public.perform_business_pack_activation_gate_action(text, jsonb) to authenticated;

notify pgrst, 'reload schema';
