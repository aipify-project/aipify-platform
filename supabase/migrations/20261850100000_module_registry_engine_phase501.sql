-- Phase 501 — Module Registry Engine
-- Central catalog: PLATFORM sells · APP buys · APP grants · EMPLOYEES use

-- ---------------------------------------------------------------------------
-- 1. Module registry (global catalog — Super Admin governed)
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_module_registry (
  id uuid primary key default gen_random_uuid(),
  module_key text not null unique,
  module_name text not null,
  module_slug text not null unique,
  module_category text not null check (
    module_category in (
      'core', 'operations', 'knowledge', 'companion', 'governance', 'finance',
      'support', 'commerce', 'hosts', 'warehouse', 'growth_partner',
      'customer_success', 'revenue', 'reports', 'settings'
    )
  ),
  description text not null default '',
  required_plan text,
  required_business_pack text,
  navigation_location text not null default 'main',
  route_href text,
  default_visibility text not null default 'licensed' check (
    default_visibility in ('always', 'licensed', 'owner_only', 'hidden')
  ),
  default_permissions jsonb not null default '["view"]'::jsonb,
  supported_roles jsonb not null default '["owner","administrator","staff","read_only"]'::jsonb,
  dependencies jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (
    status in ('active', 'beta', 'deprecated', 'disabled')
  ),
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aipify_module_registry_category_idx
  on public.aipify_module_registry (module_category, status, sort_order);

alter table public.aipify_module_registry enable row level security;
revoke all on public.aipify_module_registry from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permission definitions (auto-generated keys)
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_module_permissions (
  id uuid primary key default gen_random_uuid(),
  module_key text not null references public.aipify_module_registry (module_key) on delete cascade,
  permission_key text not null unique,
  permission_kind text not null check (
    permission_kind in ('view', 'create', 'edit', 'delete', 'manage', 'report', 'approve', 'custom')
  ),
  description text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists aipify_module_permissions_module_idx
  on public.aipify_module_permissions (module_key);

alter table public.aipify_module_permissions enable row level security;
revoke all on public.aipify_module_permissions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Organization module activation (APP-owned state)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_module_activations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  module_key text not null references public.aipify_module_registry (module_key) on delete cascade,
  activation_source text not null default 'core' check (
    activation_source in ('core', 'business_pack', 'platform', 'trial')
  ),
  business_pack_key text,
  menu_visible boolean not null default true,
  licensed boolean not null default true,
  status text not null default 'active' check (
    status in ('active', 'trial', 'hidden', 'suspended', 'removed')
  ),
  activated_at timestamptz not null default now(),
  deactivated_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, module_key)
);

create index if not exists organization_module_activations_org_idx
  on public.organization_module_activations (organization_id, status, menu_visible);

alter table public.organization_module_activations enable row level security;
revoke all on public.organization_module_activations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. APP owner role grants (employee access)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_module_role_grants (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  module_key text not null references public.aipify_module_registry (module_key) on delete cascade,
  role_key text not null,
  can_view boolean not null default false,
  can_use boolean not null default false,
  can_manage boolean not null default false,
  granted_by_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, module_key, role_key)
);

create index if not exists organization_module_role_grants_org_idx
  on public.organization_module_role_grants (organization_id, module_key);

alter table public.organization_module_role_grants enable row level security;
revoke all on public.organization_module_role_grants from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Audit log
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_module_registry_audit (
  id uuid primary key default gen_random_uuid(),
  actor_auth_id uuid,
  actor_layer text not null check (
    actor_layer in ('super_admin', 'platform', 'app')
  ),
  action_type text not null,
  module_key text,
  organization_id uuid references public.organizations (id) on delete set null,
  summary text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.aipify_module_registry_audit enable row level security;
revoke all on public.aipify_module_registry_audit from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public._mre501_require_super_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (
    select 1 from public.platform_admins pa
    where pa.auth_user_id = auth.uid()
      and pa.role = 'super_admin'
      and coalesce(pa.status, 'active') = 'active'
  ) then
    raise exception 'Super Admin access required';
  end if;
end; $$;

create or replace function public._mre501_log(
  p_layer text, p_action text, p_module_key text, p_org_id uuid, p_summary text, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_module_registry_audit (
    actor_auth_id, actor_layer, action_type, module_key, organization_id, summary, payload
  ) values (auth.uid(), p_layer, p_action, p_module_key, p_org_id, p_summary, coalesce(p_payload, '{}'::jsonb));
end; $$;

create or replace function public._mre501_upsert_permissions(p_module_key text)
returns void language plpgsql security definer set search_path = public as $$
declare v_kind text;
begin
  foreach v_kind in array array['view','create','edit','delete','manage','report','approve']
  loop
    insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
    values (
      p_module_key,
      p_module_key || '.' || v_kind,
      v_kind,
      initcap(replace(p_module_key, '_', ' ')) || ' — ' || v_kind
    )
    on conflict (permission_key) do nothing;
  end loop;
end; $$;

create or replace function public._mre501_org_subscription_active(p_org_id uuid)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare v_status text;
begin
  select s.status into v_status
  from public.organization_subscriptions s
  where s.organization_id = p_org_id
  limit 1;
  if v_status is null then return true; end if;
  return v_status in ('active', 'trial', 'internal');
end; $$;

create or replace function public._mre501_seed_module(
  p_key text, p_name text, p_slug text, p_category text, p_desc text,
  p_plan text, p_pack text, p_nav text, p_href text, p_vis text, p_sort int
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_module_registry (
    module_key, module_name, module_slug, module_category, description,
    required_plan, required_business_pack, navigation_location, route_href,
    default_visibility, sort_order
  ) values (
    p_key, p_name, p_slug, p_category, p_desc,
    p_plan, p_pack, p_nav, p_href, p_vis, p_sort
  )
  on conflict (module_key) do update set
    module_name = excluded.module_name,
    module_slug = excluded.module_slug,
    module_category = excluded.module_category,
    description = excluded.description,
    required_plan = excluded.required_plan,
    required_business_pack = excluded.required_business_pack,
    navigation_location = excluded.navigation_location,
    route_href = excluded.route_href,
    default_visibility = excluded.default_visibility,
    sort_order = excluded.sort_order,
    updated_at = now();
  perform public._mre501_upsert_permissions(p_key);
end; $$;

-- Seed registry
do $$ begin
  -- Core modules (every APP)
  perform public._mre501_seed_module('dashboard', 'Dashboard', 'dashboard', 'core', 'Organization overview and daily workspace.', 'starter', null, 'main', '/app', 'always', 1);
  perform public._mre501_seed_module('companion', 'Companion', 'companion', 'companion', 'Aipify Companion guidance and assistant.', 'starter', null, 'main', '/app/assistant', 'always', 2);
  perform public._mre501_seed_module('tasks', 'Tasks', 'tasks', 'operations', 'Tasks and follow-ups.', 'starter', null, 'operations', '/app/assistant/life', 'licensed', 3);
  perform public._mre501_seed_module('calendar', 'Calendar', 'calendar', 'operations', 'Universal calendar layer.', 'starter', null, 'operations', '/app/assistant/calendars', 'licensed', 4);
  perform public._mre501_seed_module('notifications', 'Notifications', 'notifications', 'operations', 'Command Center and notifications.', 'starter', null, 'operations', '/app/command-center', 'licensed', 5);
  perform public._mre501_seed_module('documents', 'Documents', 'documents', 'knowledge', 'Document workspace.', 'starter', null, 'knowledge', '/app/settings', 'licensed', 6);
  perform public._mre501_seed_module('knowledge_center', 'Knowledge Center', 'knowledge-center', 'knowledge', 'Organizational knowledge.', 'starter', null, 'knowledge', '/app/learning', 'licensed', 7);
  perform public._mre501_seed_module('users', 'Users', 'users', 'settings', 'Employee directory.', 'starter', null, 'settings', '/app/team', 'owner_only', 8);
  perform public._mre501_seed_module('roles', 'Roles', 'roles', 'settings', 'Role definitions.', 'starter', null, 'settings', '/app/team', 'owner_only', 9);
  perform public._mre501_seed_module('permissions', 'Permissions', 'permissions', 'settings', 'Module access control.', 'starter', null, 'settings', '/app/settings/module-access', 'owner_only', 10);
  perform public._mre501_seed_module('settings', 'Settings', 'settings', 'settings', 'Organization settings.', 'starter', null, 'settings', '/app/settings', 'always', 11);
  perform public._mre501_seed_module('billing', 'Billing', 'billing', 'finance', 'Subscription and billing.', 'starter', null, 'settings', '/app/settings/billing', 'owner_only', 12);
  perform public._mre501_seed_module('invoices', 'Invoices', 'invoices', 'finance', 'Invoice management.', 'starter', null, 'finance', '/app/settings/billing/invoice-details', 'owner_only', 13);
  perform public._mre501_seed_module('licenses', 'Licenses', 'licenses', 'governance', 'Trust and license center.', 'starter', null, 'settings', '/app/license', 'owner_only', 14);
  perform public._mre501_seed_module('support', 'Support', 'support', 'support', 'Customer support workspace.', 'starter', null, 'support', '/app/support', 'licensed', 15);

  -- Support Pack
  perform public._mre501_seed_module('support_center', 'Support Center', 'support-center', 'support', 'Support operations hub.', 'professional', 'support_pack', 'support', '/app/support', 'licensed', 20);
  perform public._mre501_seed_module('tickets', 'Tickets', 'tickets', 'support', 'Support ticket management.', 'professional', 'support_pack', 'support', '/app/support', 'licensed', 21);
  perform public._mre501_seed_module('escalations', 'Escalations', 'escalations', 'support', 'Escalation workflows.', 'professional', 'support_pack', 'support', '/app/settings/support-operations', 'licensed', 22);
  perform public._mre501_seed_module('support_analytics', 'Support Analytics', 'support-analytics', 'reports', 'Support performance analytics.', 'professional', 'support_pack', 'reports', '/app/analytics', 'licensed', 23);

  -- Commerce Pack
  perform public._mre501_seed_module('products', 'Products', 'products', 'commerce', 'Product catalog.', 'business', 'commerce_pack', 'commerce', '/app/commerce', 'licensed', 30);
  perform public._mre501_seed_module('margin_analysis', 'Margin Analysis', 'margin-analysis', 'commerce', 'Margin and profitability insights.', 'business', 'commerce_pack', 'commerce', '/app/commerce', 'licensed', 31);
  perform public._mre501_seed_module('supplier_insights', 'Supplier Insights', 'supplier-insights', 'commerce', 'Supplier intelligence.', 'business', 'commerce_pack', 'commerce', '/app/commerce', 'licensed', 32);
  perform public._mre501_seed_module('seo_tools', 'SEO Tools', 'seo-tools', 'commerce', 'Commerce SEO tools.', 'business', 'commerce_pack', 'commerce', '/app/commerce', 'licensed', 33);
  perform public._mre501_seed_module('commerce_reports', 'Commerce Reports', 'commerce-reports', 'reports', 'Commerce reporting.', 'business', 'commerce_pack', 'reports', '/app/commerce', 'licensed', 34);

  -- Warehouse Pack
  perform public._mre501_seed_module('warehouse', 'Warehouse', 'warehouse', 'warehouse', 'Warehouse operations hub.', 'business', 'warehouse_pack', 'warehouse', '/app/warehouse', 'licensed', 40);
  perform public._mre501_seed_module('inventory', 'Inventory', 'inventory', 'warehouse', 'Inventory management.', 'business', 'warehouse_pack', 'warehouse', '/app/warehouse', 'licensed', 41);
  perform public._mre501_seed_module('assets', 'Assets', 'assets', 'warehouse', 'Asset tracking.', 'business', 'warehouse_pack', 'warehouse', '/app/warehouse', 'licensed', 42);
  perform public._mre501_seed_module('warehouse_tasks', 'Warehouse Tasks', 'warehouse-tasks', 'warehouse', 'Warehouse task workflows.', 'business', 'warehouse_pack', 'warehouse', '/app/warehouse', 'licensed', 43);
  perform public._mre501_seed_module('warehouse_reports', 'Warehouse Reports', 'warehouse-reports', 'reports', 'Warehouse reporting.', 'business', 'warehouse_pack', 'reports', '/app/warehouse', 'licensed', 44);

  -- Hosts Pack
  perform public._mre501_seed_module('properties', 'Properties', 'properties', 'hosts', 'Property portfolio.', 'business', 'hosts_pack', 'hosts', '/app/aipify-hosts', 'licensed', 50);
  perform public._mre501_seed_module('guests', 'Guests', 'guests', 'hosts', 'Guest intelligence.', 'business', 'hosts_pack', 'hosts', '/app/aipify-hosts', 'licensed', 51);
  perform public._mre501_seed_module('bookings', 'Bookings', 'bookings', 'hosts', 'Booking operations.', 'business', 'hosts_pack', 'hosts', '/app/aipify-hosts', 'licensed', 52);
  perform public._mre501_seed_module('cleaning', 'Cleaning', 'cleaning', 'hosts', 'Cleaning workflows.', 'business', 'hosts_pack', 'hosts', '/app/aipify-hosts', 'licensed', 53);
  perform public._mre501_seed_module('hosts_revenue', 'Revenue', 'hosts-revenue', 'revenue', 'Hospitality revenue.', 'business', 'hosts_pack', 'hosts', '/app/aipify-hosts', 'licensed', 54);
  perform public._mre501_seed_module('forecasts', 'Forecasts', 'forecasts', 'reports', 'Hospitality forecasts.', 'business', 'hosts_pack', 'reports', '/app/aipify-hosts', 'licensed', 55);

  -- Support Pack custom permission
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values ('support_center', 'support.reply', 'custom', 'Reply to support tickets')
  on conflict (permission_key) do nothing;
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values ('billing', 'finance.approve', 'approve', 'Approve finance actions')
  on conflict (permission_key) do nothing;
end $$;

-- Sync core modules for organization
create or replace function public._mre501_sync_core_modules(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_mod record;
begin
  for v_mod in
    select * from public.aipify_module_registry
    where required_business_pack is null and status = 'active'
  loop
    insert into public.organization_module_activations (
      organization_id, module_key, activation_source, menu_visible, licensed, status
    ) values (
      p_org_id, v_mod.module_key, 'core', true, true, 'active'
    )
    on conflict (organization_id, module_key) do update set
      licensed = true,
      status = case
        when organization_module_activations.status = 'removed' then organization_module_activations.status
        else 'active'
      end,
      updated_at = now();

    insert into public.tenant_modules (tenant_id, module_key, licensed, enabled, status, activated_at)
    values (p_org_id, v_mod.module_key, true, true, 'enabled', now())
    on conflict (tenant_id, module_key) do update set
      licensed = true, enabled = true, status = 'enabled', updated_at = now();
  end loop;

  -- Default owner/admin grants for core visible modules
  insert into public.organization_module_role_grants (organization_id, module_key, role_key, can_view, can_use, can_manage)
  select p_org_id, m.module_key, r.role_key,
    true, true, r.role_key in ('owner', 'administrator')
  from public.aipify_module_registry m
  cross join (values ('owner'), ('administrator'), ('staff'), ('read_only')) as r(role_key)
  where m.required_business_pack is null and m.status = 'active'
  on conflict (organization_id, module_key, role_key) do nothing;
end; $$;

-- Activate business pack modules
create or replace function public.activate_business_pack_modules(
  p_organization_id uuid,
  p_pack_key text
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_mod record;
  v_count int := 0;
begin
  if not public.is_platform_admin() and not public._mre501_org_subscription_active(p_organization_id) then
    raise exception 'Platform admin or active organization required';
  end if;

  for v_mod in
    select * from public.aipify_module_registry
    where required_business_pack = p_pack_key and status = 'active'
  loop
    insert into public.organization_module_activations (
      organization_id, module_key, activation_source, business_pack_key, menu_visible, licensed, status, activated_at
    ) values (
      p_organization_id, v_mod.module_key, 'business_pack', p_pack_key, true, true, 'active', now()
    )
    on conflict (organization_id, module_key) do update set
      activation_source = 'business_pack',
      business_pack_key = p_pack_key,
      menu_visible = true,
      licensed = true,
      status = 'active',
      activated_at = coalesce(organization_module_activations.activated_at, now()),
      deactivated_at = null,
      updated_at = now();

    insert into public.tenant_modules (tenant_id, module_key, suite_key, licensed, enabled, status, activated_at)
    values (p_organization_id, v_mod.module_key, p_pack_key, true, true, 'enabled', now())
    on conflict (tenant_id, module_key) do update set
      suite_key = p_pack_key, licensed = true, enabled = true, status = 'enabled', updated_at = now();

    v_count := v_count + 1;
  end loop;

  perform public._mre501_log('platform', 'pack_activated', null, p_organization_id,
    'Business pack modules activated: ' || p_pack_key,
    jsonb_build_object('pack_key', p_pack_key, 'module_count', v_count));

  return jsonb_build_object('ok', true, 'pack_key', p_pack_key, 'modules_activated', v_count);
end; $$;

-- Remove business pack modules
create or replace function public.deactivate_business_pack_modules(
  p_organization_id uuid,
  p_pack_key text
)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then raise exception 'Platform admin required'; end if;

  update public.organization_module_activations
  set status = 'removed', menu_visible = false, licensed = false, deactivated_at = now(), updated_at = now()
  where organization_id = p_organization_id and business_pack_key = p_pack_key;

  update public.tenant_modules tm
  set enabled = false, licensed = false, status = 'disabled', updated_at = now()
  from public.aipify_module_registry r
  where tm.tenant_id = p_organization_id
    and tm.module_key = r.module_key
    and r.required_business_pack = p_pack_key;

  perform public._mre501_log('platform', 'pack_removed', null, p_organization_id,
    'Business pack modules hidden: ' || p_pack_key, jsonb_build_object('pack_key', p_pack_key));

  return jsonb_build_object('ok', true, 'pack_key', p_pack_key);
end; $$;

-- Visibility for organization (license + pack)
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

  select * into v_act from public.organization_module_activations
  where organization_id = p_organization_id and module_key = p_module_key;

  if v_act.id is null then
    if v_reg.required_business_pack is null then return true; end if;
    return false;
  end if;

  return v_act.licensed and v_act.menu_visible and v_act.status in ('active', 'trial');
end; $$;

-- Visibility for user (inherits APP license + role grants)
create or replace function public.is_user_module_visible(
  p_organization_id uuid,
  p_user_id uuid,
  p_module_key text
)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare
  v_role text;
  v_reg public.aipify_module_registry;
  v_grant public.organization_module_role_grants;
begin
  if not public.is_organization_module_active(p_organization_id, p_module_key) then
    return false;
  end if;

  select * into v_reg from public.aipify_module_registry where module_key = p_module_key;

  select ou.role into v_role
  from public.organization_users ou
  where ou.organization_id = p_organization_id and ou.user_id = p_user_id and ou.status = 'active'
  limit 1;

  if v_role in ('owner', 'administrator') then return true; end if;
  if v_reg.default_visibility = 'owner_only' then return false; end if;
  if v_reg.default_visibility = 'always' then return true; end if;

  select * into v_grant from public.organization_module_role_grants
  where organization_id = p_organization_id and module_key = p_module_key and role_key = v_role;

  return coalesce(v_grant.can_view, false) or coalesce(v_grant.can_use, false);
end; $$;

-- Super Admin center
create or replace function public.get_super_admin_module_registry_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_modules jsonb;
  v_audit jsonb;
begin
  perform public._mre501_require_super_admin();

  select coalesce(jsonb_agg(jsonb_build_object(
    'module_id', r.id, 'module_key', r.module_key, 'module_name', r.module_name,
    'module_slug', r.module_slug, 'module_category', r.module_category,
    'description', r.description, 'required_plan', r.required_plan,
    'required_business_pack', r.required_business_pack, 'navigation_location', r.navigation_location,
    'route_href', r.route_href, 'default_visibility', r.default_visibility,
    'default_permissions', r.default_permissions, 'supported_roles', r.supported_roles,
    'dependencies', r.dependencies, 'status', r.status, 'sort_order', r.sort_order,
    'permission_count', (select count(*) from public.aipify_module_permissions p where p.module_key = r.module_key)
  ) order by r.sort_order), '[]'::jsonb)
  into v_modules from public.aipify_module_registry r;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'action_type', a.action_type, 'module_key', a.module_key,
    'organization_id', a.organization_id, 'summary', a.summary, 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_audit
  from (
    select * from public.aipify_module_registry_audit
    order by created_at desc
    limit 50
  ) a;

  return jsonb_build_object(
    'found', true,
    'principle', 'PLATFORM sells modules · APP buys modules · APP grants access · EMPLOYEES use modules',
    'privacy_note', 'Super Admin governs global module catalog — not customer operational data.',
    'modules', v_modules,
    'categories', jsonb_build_array(
      'core','operations','knowledge','companion','governance','finance','support',
      'commerce','hosts','warehouse','growth_partner','customer_success','revenue','reports','settings'
    ),
    'business_packs', jsonb_build_array('support_pack','commerce_pack','warehouse_pack','hosts_pack'),
    'recent_audit', v_audit,
    'stats', jsonb_build_object(
      'total_modules', (select count(*) from public.aipify_module_registry),
      'active_modules', (select count(*) from public.aipify_module_registry where status = 'active'),
      'core_modules', (select count(*) from public.aipify_module_registry where required_business_pack is null),
      'pack_modules', (select count(*) from public.aipify_module_registry where required_business_pack is not null)
    )
  );
end; $$;

create or replace function public.perform_super_admin_module_registry_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_key text;
begin
  perform public._mre501_require_super_admin();
  v_key := coalesce(p_payload->>'module_key', p_payload->>'module_id');

  case p_action_type
    when 'disable_module' then
      update public.aipify_module_registry set status = 'disabled', updated_at = now()
      where module_key = v_key;
      perform public._mre501_log('super_admin', p_action_type, v_key, null, 'Module disabled globally', p_payload);
    when 'enable_module' then
      update public.aipify_module_registry set status = 'active', updated_at = now()
      where module_key = v_key;
      perform public._mre501_log('super_admin', p_action_type, v_key, null, 'Module enabled globally', p_payload);
    when 'assign_business_pack' then
      update public.aipify_module_registry
      set required_business_pack = p_payload->>'business_pack_key', updated_at = now()
      where module_key = v_key;
      perform public._mre501_log('super_admin', p_action_type, v_key, null, 'Module assigned to business pack', p_payload);
    else
      raise exception 'Unknown action: %', p_action_type;
  end case;

  return jsonb_build_object('ok', true, 'action', p_action_type);
end; $$;

-- Platform overview (aggregates)
create or replace function public.get_platform_module_registry_overview()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then raise exception 'Platform admin required'; end if;

  return jsonb_build_object(
    'found', true,
    'privacy_note', 'Aggregates only — no customer operational content.',
    'catalog', jsonb_build_object(
      'total', (select count(*) from public.aipify_module_registry),
      'by_category', (
        select coalesce(jsonb_object_agg(module_category, cnt), '{}'::jsonb)
        from (select module_category, count(*) cnt from public.aipify_module_registry group by module_category) s
      )
    ),
    'adoption', jsonb_build_object(
      'organizations_with_modules', (select count(distinct organization_id) from public.organization_module_activations),
      'active_activations', (select count(*) from public.organization_module_activations where status = 'active'),
      'business_pack_activations', (select count(*) from public.organization_module_activations where activation_source = 'business_pack' and status = 'active')
    ),
    'business_packs', jsonb_build_array(
      jsonb_build_object('pack_key', 'support_pack', 'modules', (select count(*) from public.aipify_module_registry where required_business_pack = 'support_pack')),
      jsonb_build_object('pack_key', 'commerce_pack', 'modules', (select count(*) from public.aipify_module_registry where required_business_pack = 'commerce_pack')),
      jsonb_build_object('pack_key', 'warehouse_pack', 'modules', (select count(*) from public.aipify_module_registry where required_business_pack = 'warehouse_pack')),
      jsonb_build_object('pack_key', 'hosts_pack', 'modules', (select count(*) from public.aipify_module_registry where required_business_pack = 'hosts_pack'))
    )
  );
end; $$;

create or replace function public.perform_platform_module_registry_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org uuid := (p_payload->>'organization_id')::uuid;
  v_pack text := p_payload->>'pack_key';
begin
  if not public.is_platform_admin() then raise exception 'Platform admin required'; end if;

  case p_action_type
    when 'activate_business_pack' then
      return public.activate_business_pack_modules(v_org, v_pack);
    when 'deactivate_business_pack' then
      return public.deactivate_business_pack_modules(v_org, v_pack);
    when 'sync_core_modules' then
      perform public._mre501_sync_core_modules(v_org);
      perform public._mre501_log('platform', p_action_type, null, v_org, 'Core modules synced', p_payload);
      return jsonb_build_object('ok', true);
    else
      raise exception 'Unknown action: %', p_action_type;
  end case;
end; $$;

-- Customer APP — module registry center (owner)
create or replace function public.get_customer_module_registry_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_role text;
  v_menu jsonb;
  v_grants jsonb;
  v_sub_active boolean;
begin
  perform public._bde_require_admin();
  v_org_id := public._presence_tenant_for_auth();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization required'); end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  select ou.role into v_role from public.organization_users ou
  where ou.organization_id = v_org_id and ou.user_id = v_user_id limit 1;

  perform public._mre501_sync_core_modules(v_org_id);
  v_sub_active := public._mre501_org_subscription_active(v_org_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'module_key', r.module_key, 'module_name', r.module_name, 'module_category', r.module_category,
    'navigation_location', r.navigation_location, 'route_href', r.route_href,
    'required_business_pack', r.required_business_pack, 'status', a.status,
    'menu_visible', a.menu_visible and v_sub_active,
    'licensed', a.licensed and v_sub_active,
    'activation_source', a.activation_source
  ) order by r.sort_order), '[]'::jsonb)
  into v_menu
  from public.aipify_module_registry r
  left join public.organization_module_activations a
    on a.organization_id = v_org_id and a.module_key = r.module_key
  where r.status = 'active';

  select coalesce(jsonb_agg(jsonb_build_object(
    'module_key', g.module_key, 'role_key', g.role_key,
    'can_view', g.can_view, 'can_use', g.can_use, 'can_manage', g.can_manage
  )), '[]'::jsonb)
  into v_grants from public.organization_module_role_grants g where g.organization_id = v_org_id;

  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'app_license_active', v_sub_active,
    'principle', 'One APP. Many modules. Clear rights. No separate module portals.',
    'privacy_note', 'APP owner controls employee module access — employees inherit APP license.',
    'navigation_modules', v_menu,
    'role_grants', v_grants,
    'supported_roles', jsonb_build_array('owner', 'administrator', 'staff', 'read_only', 'support'),
    'permission_types', jsonb_build_array('view', 'create', 'edit', 'delete', 'manage', 'report', 'approve')
  );
end; $$;

create or replace function public.perform_customer_module_access_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._bde_require_admin();
  v_org_id := public._presence_tenant_for_auth();

  case p_action_type
    when 'update_role_grant' then
      insert into public.organization_module_role_grants (
        organization_id, module_key, role_key, can_view, can_use, can_manage, granted_by_user_id
      ) values (
        v_org_id,
        p_payload->>'module_key',
        p_payload->>'role_key',
        coalesce((p_payload->>'can_view')::boolean, false),
        coalesce((p_payload->>'can_use')::boolean, false),
        coalesce((p_payload->>'can_manage')::boolean, false),
        (select id from public.users where auth_user_id = auth.uid() limit 1)
      )
      on conflict (organization_id, module_key, role_key) do update set
        can_view = excluded.can_view,
        can_use = excluded.can_use,
        can_manage = excluded.can_manage,
        granted_by_user_id = excluded.granted_by_user_id,
        updated_at = now();
      perform public._mre501_log('app', p_action_type, p_payload->>'module_key', v_org_id, 'Role grant updated', p_payload);
    when 'toggle_menu_visibility' then
      update public.organization_module_activations
      set menu_visible = coalesce((p_payload->>'menu_visible')::boolean, menu_visible), updated_at = now()
      where organization_id = v_org_id and module_key = p_payload->>'module_key';
      perform public._mre501_log('app', p_action_type, p_payload->>'module_key', v_org_id, 'Menu visibility updated', p_payload);
    else
      raise exception 'Unknown action: %', p_action_type;
  end case;

  return jsonb_build_object('ok', true);
end; $$;

-- Resolved navigation for current user
create or replace function public.get_customer_app_navigation_modules()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_items jsonb;
begin
  v_org_id := public._presence_tenant_for_auth();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  perform public._mre501_sync_core_modules(v_org_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'module_key', r.module_key, 'module_name', r.module_name,
    'module_slug', r.module_slug, 'navigation_location', r.navigation_location,
    'route_href', r.route_href, 'module_category', r.module_category
  ) order by r.sort_order), '[]'::jsonb)
  into v_items
  from public.aipify_module_registry r
  where r.status = 'active'
    and public.is_user_module_visible(v_org_id, v_user_id, r.module_key);

  return jsonb_build_object('found', true, 'modules', v_items, 'single_app', true);
end; $$;

grant execute on function public.get_super_admin_module_registry_center() to authenticated;
grant execute on function public.perform_super_admin_module_registry_action(text, jsonb) to authenticated;
grant execute on function public.get_platform_module_registry_overview() to authenticated;
grant execute on function public.perform_platform_module_registry_action(text, jsonb) to authenticated;
grant execute on function public.get_customer_module_registry_center() to authenticated;
grant execute on function public.perform_customer_module_access_action(text, jsonb) to authenticated;
grant execute on function public.get_customer_app_navigation_modules() to authenticated;
grant execute on function public.activate_business_pack_modules(uuid, text) to authenticated;
grant execute on function public.deactivate_business_pack_modules(uuid, text) to authenticated;
grant execute on function public.is_organization_module_active(uuid, text) to authenticated;
grant execute on function public.is_user_module_visible(uuid, uuid, text) to authenticated;
