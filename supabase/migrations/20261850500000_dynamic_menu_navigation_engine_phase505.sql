-- Phase 505 — Dynamic Menu & Navigation Engine
-- License → Business Packs → Role → Permissions → Menu Generated

-- ---------------------------------------------------------------------------
-- 1. Navigation categories (canonical menu groups)
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_navigation_categories (
  category_key text primary key,
  label_key text not null,
  sort_order integer not null default 0,
  icon text not null default 'folder',
  collapsible boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.aipify_navigation_categories (category_key, label_key, sort_order, icon, collapsible) values
  ('dashboard', 'customerApp.dynamicNavigation.categories.dashboard', 1, 'layout-dashboard', false),
  ('operations', 'customerApp.dynamicNavigation.categories.operations', 2, 'briefcase', true),
  ('knowledge', 'customerApp.dynamicNavigation.categories.knowledge', 3, 'book-open', true),
  ('customers', 'customerApp.dynamicNavigation.categories.customers', 4, 'users', true),
  ('finance', 'customerApp.dynamicNavigation.categories.finance', 5, 'wallet', true),
  ('support', 'customerApp.dynamicNavigation.categories.support', 6, 'life-buoy', true),
  ('commerce', 'customerApp.dynamicNavigation.categories.commerce', 7, 'shopping-cart', true),
  ('warehouse', 'customerApp.dynamicNavigation.categories.warehouse', 8, 'warehouse', true),
  ('properties', 'customerApp.dynamicNavigation.categories.properties', 9, 'building', true),
  ('growth', 'customerApp.dynamicNavigation.categories.growth', 10, 'trending-up', true),
  ('reports', 'customerApp.dynamicNavigation.categories.reports', 11, 'bar-chart', true),
  ('governance', 'customerApp.dynamicNavigation.categories.governance', 12, 'shield', true),
  ('settings', 'customerApp.dynamicNavigation.categories.settings', 13, 'settings', true),
  ('platform', 'platform.dynamicNavigation.categories.platform', 1, 'layers', true),
  ('super_admin', 'superAdmin.dynamicNavigation.categories.superAdmin', 1, 'crown', true)
on conflict (category_key) do update set
  label_key = excluded.label_key,
  sort_order = excluded.sort_order,
  icon = excluded.icon,
  collapsible = excluded.collapsible;

alter table public.aipify_navigation_categories enable row level security;
revoke all on public.aipify_navigation_categories from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Navigation registry (module-driven + platform/super entries)
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_navigation_registry (
  id uuid primary key default gen_random_uuid(),
  nav_key text not null unique,
  menu_name text not null,
  menu_category text not null references public.aipify_navigation_categories (category_key),
  icon text not null default 'circle',
  route_href text not null,
  module_key text references public.aipify_module_registry (module_key) on delete cascade,
  permission_key text,
  business_pack_key text,
  license_required boolean not null default true,
  portal_layer text not null default 'app' check (
    portal_layer in ('app', 'platform', 'super_admin')
  ),
  parent_nav_key text,
  sort_order integer not null default 0,
  status text not null default 'active' check (status in ('active', 'beta', 'disabled')),
  always_visible boolean not null default false,
  suspended_allowed boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aipify_navigation_registry_layer_idx
  on public.aipify_navigation_registry (portal_layer, menu_category, status, sort_order);

create index if not exists aipify_navigation_registry_module_idx
  on public.aipify_navigation_registry (module_key);

alter table public.aipify_navigation_registry enable row level security;
revoke all on public.aipify_navigation_registry from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. APP owner navigation preferences
-- ---------------------------------------------------------------------------
create table if not exists public.organization_navigation_preferences (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  nav_key text not null,
  pinned boolean not null default false,
  hidden boolean not null default false,
  sort_override integer,
  is_default_landing boolean not null default false,
  department_id uuid references public.organization_departments (id) on delete set null,
  shortcut_label text,
  updated_by_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, nav_key)
);

create index if not exists organization_navigation_preferences_org_idx
  on public.organization_navigation_preferences (organization_id, hidden, pinned);

alter table public.organization_navigation_preferences enable row level security;
revoke all on public.organization_navigation_preferences from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Employee navigation personalization
-- ---------------------------------------------------------------------------
create table if not exists public.user_navigation_personalization (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  nav_key text not null,
  pinned boolean not null default false,
  favorite boolean not null default false,
  last_used_at timestamptz,
  use_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id, nav_key)
);

create index if not exists user_navigation_personalization_user_idx
  on public.user_navigation_personalization (organization_id, user_id, last_used_at desc);

alter table public.user_navigation_personalization enable row level security;
revoke all on public.user_navigation_personalization from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Audit log
-- ---------------------------------------------------------------------------
create table if not exists public.navigation_engine_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id) on delete set null,
  actor_user_id uuid references public.users (id) on delete set null,
  portal_layer text not null default 'app',
  action text not null,
  nav_key text,
  summary text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists navigation_engine_audit_logs_org_idx
  on public.navigation_engine_audit_logs (organization_id, created_at desc);

alter table public.navigation_engine_audit_logs enable row level security;
revoke all on public.navigation_engine_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public._dmn505_map_menu_category(p_module_category text)
returns text language sql immutable as $$
  select case p_module_category
    when 'core' then 'dashboard'
    when 'companion' then 'dashboard'
    when 'hosts' then 'properties'
    when 'customer_success' then 'customers'
    when 'revenue' then 'finance'
    else coalesce(nullif(p_module_category, ''), 'operations')
  end;
$$;

create or replace function public._dmn505_log(
  p_org_id uuid, p_user_id uuid, p_layer text, p_action text, p_nav_key text, p_summary text, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.navigation_engine_audit_logs (
    organization_id, actor_user_id, portal_layer, action, nav_key, summary, payload
  ) values (p_org_id, p_user_id, p_layer, p_action, p_nav_key, p_summary, coalesce(p_payload, '{}'::jsonb));
end; $$;

create or replace function public._dmn505_upsert_nav(
  p_nav_key text, p_name text, p_category text, p_icon text, p_href text,
  p_module_key text, p_permission text, p_pack text, p_layer text,
  p_sort int, p_always boolean default false, p_suspended boolean default false
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_navigation_registry (
    nav_key, menu_name, menu_category, icon, route_href, module_key,
    permission_key, business_pack_key, portal_layer, sort_order,
    always_visible, suspended_allowed, status
  ) values (
    p_nav_key, p_name, p_category, p_icon, p_href, p_module_key,
    p_permission, p_pack, p_layer, p_sort, p_always, p_suspended, 'active'
  )
  on conflict (nav_key) do update set
    menu_name = excluded.menu_name,
    menu_category = excluded.menu_category,
    icon = excluded.icon,
    route_href = excluded.route_href,
    module_key = excluded.module_key,
    permission_key = excluded.permission_key,
    business_pack_key = excluded.business_pack_key,
    portal_layer = excluded.portal_layer,
    sort_order = excluded.sort_order,
    always_visible = excluded.always_visible,
    suspended_allowed = excluded.suspended_allowed,
    updated_at = now();
end; $$;

create or replace function public._dmn505_sync_registry_from_modules()
returns void language plpgsql security definer set search_path = public as $$
declare v_mod record;
begin
  for v_mod in
    select * from public.aipify_module_registry where status = 'active'
  loop
    perform public._dmn505_upsert_nav(
      v_mod.module_key,
      v_mod.module_name,
      public._dmn505_map_menu_category(v_mod.module_category),
      coalesce(v_mod.metadata->>'icon', 'module'),
      coalesce(v_mod.route_href, '/app'),
      v_mod.module_key,
      v_mod.module_key || '.view',
      v_mod.required_business_pack,
      'app',
      v_mod.sort_order,
      v_mod.default_visibility = 'always',
      v_mod.module_key in ('billing', 'invoices', 'licenses', 'support', 'settings')
    );
  end loop;
end; $$;

-- Seed platform + super admin registry entries
do $$ begin
  perform public._dmn505_sync_registry_from_modules();

  -- Platform navigation (Phase 505 §12)
  perform public._dmn505_upsert_nav('platform_customers', 'Customers', 'platform', 'users', '/platform/customers', null, null, null, 'platform', 10, true, false);
  perform public._dmn505_upsert_nav('platform_growth_partners', 'Growth Partners', 'platform', 'handshake', '/platform/growth-partners', null, null, null, 'platform', 20, true, false);
  perform public._dmn505_upsert_nav('platform_subscriptions', 'Subscriptions', 'platform', 'credit-card', '/platform/subscriptions', null, null, null, 'platform', 30, true, false);
  perform public._dmn505_upsert_nav('platform_billing', 'Billing', 'platform', 'wallet', '/platform/billing', null, null, null, 'platform', 40, true, false);
  perform public._dmn505_upsert_nav('platform_business_packs', 'Business Packs', 'platform', 'package', '/platform/business-packs', null, null, null, 'platform', 50, true, false);
  perform public._dmn505_upsert_nav('platform_marketplace', 'Marketplace', 'platform', 'store', '/platform/marketplace', null, null, null, 'platform', 60, true, false);
  perform public._dmn505_upsert_nav('platform_support', 'Support', 'platform', 'life-buoy', '/platform/support', null, null, null, 'platform', 70, true, false);
  perform public._dmn505_upsert_nav('platform_payouts', 'Payouts', 'platform', 'banknote', '/platform/payments', null, null, null, 'platform', 80, true, false);
  perform public._dmn505_upsert_nav('platform_analytics', 'Analytics', 'platform', 'bar-chart', '/platform/metrics', null, null, null, 'platform', 90, true, false);
  perform public._dmn505_upsert_nav('platform_governance', 'Governance', 'platform', 'shield', '/platform/trust', null, null, null, 'platform', 100, true, false);

  -- Super Admin navigation (Phase 505 §13)
  perform public._dmn505_upsert_nav('super_system_health', 'System Health', 'super_admin', 'activity', '/super/platform-health', null, null, null, 'super_admin', 10, true, false);
  perform public._dmn505_upsert_nav('super_tenant_management', 'Tenant Management', 'super_admin', 'building', '/super/group-overview', null, null, null, 'super_admin', 20, true, false);
  perform public._dmn505_upsert_nav('super_license_engine', 'License Engine', 'super_admin', 'key', '/super', null, null, null, 'super_admin', 30, true, false);
  perform public._dmn505_upsert_nav('super_module_registry', 'Module Registry', 'super_admin', 'grid', '/super/module-registry', null, null, null, 'super_admin', 40, true, false);
  perform public._dmn505_upsert_nav('super_feature_flags', 'Feature Flags', 'super_admin', 'flag', '/super/feature-flags', null, null, null, 'super_admin', 50, true, false);
  perform public._dmn505_upsert_nav('super_platform_governance', 'Platform Governance', 'super_admin', 'shield', '/super/global-audit', null, null, null, 'super_admin', 60, true, false);
  perform public._dmn505_upsert_nav('super_emergency_controls', 'Emergency Controls', 'super_admin', 'alert-triangle', '/super', null, null, null, 'super_admin', 70, true, false);
  perform public._dmn505_upsert_nav('super_audit_center', 'Audit Center', 'super_admin', 'file-text', '/super/global-audit', null, null, null, 'super_admin', 80, true, false);
  perform public._dmn505_upsert_nav('super_infrastructure', 'Infrastructure', 'super_admin', 'server', '/super/platform-health', null, null, null, 'super_admin', 90, true, false);
  perform public._dmn505_upsert_nav('super_role_matrix', 'Role & Permission Matrix', 'super_admin', 'lock', '/super/role-permission-matrix', null, null, null, 'super_admin', 45, true, false);
end $$;

-- Sync registry when business pack modules activate/deactivate
create or replace function public._dmn505_after_pack_modules_changed()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform public._dmn505_sync_registry_from_modules();
  return coalesce(new, old);
end; $$;

drop trigger if exists dmn505_sync_nav_on_module_registry on public.aipify_module_registry;
create trigger dmn505_sync_nav_on_module_registry
  after insert or update on public.aipify_module_registry
  for each row execute function public._dmn505_after_pack_modules_changed();

-- ---------------------------------------------------------------------------
-- Visibility check for APP navigation item
-- ---------------------------------------------------------------------------
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
  if p_nav.module_key is null then return true; end if;
  if not public.is_organization_module_active(p_org_id, p_nav.module_key) then return false; end if;
  if p_nav.permission_key is not null then
    return public.user_has_permission(p_org_id, p_user_id, p_nav.permission_key);
  end if;
  return public.is_user_module_visible(p_org_id, p_user_id, p_nav.module_key);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Dynamic APP navigation
-- ---------------------------------------------------------------------------
create or replace function public.get_dynamic_app_navigation()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_license text;
  v_paused boolean;
  v_visible_count int;
  v_layout text;
  v_landing text;
  v_categories jsonb;
  v_personal jsonb;
  v_mobile jsonb;
  v_visible_keys text[];
begin
  v_org_id := public._presence_tenant_for_auth();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  perform public._mre501_sync_core_modules(v_org_id);

  v_license := public.resolve_license_service_status(v_org_id);
  v_paused := v_license = 'paused';

  select coalesce(p.route_href, '/app') into v_landing
  from public.organization_navigation_preferences p
  join public.aipify_navigation_registry n on n.nav_key = p.nav_key
  where p.organization_id = v_org_id and p.is_default_landing = true
  limit 1;

  create temp table if not exists _dmn505_visible_nav (
    nav_key text primary key,
    menu_name text,
    menu_category text,
    icon text,
    route_href text,
    module_key text,
    permission_key text,
    business_pack_key text,
    pinned boolean,
    favorite boolean,
    last_used_at timestamptz,
    use_count int,
    effective_sort int
  ) on commit drop;

  truncate _dmn505_visible_nav;

  insert into _dmn505_visible_nav
  select
    n.nav_key,
    n.menu_name,
    n.menu_category,
    n.icon,
    n.route_href,
    n.module_key,
    n.permission_key,
    n.business_pack_key,
    coalesce(op.pinned, up.pinned, false),
    coalesce(up.favorite, false),
    up.last_used_at,
    coalesce(up.use_count, 0),
    coalesce(op.sort_override, n.sort_order)
  from public.aipify_navigation_registry n
  left join public.organization_navigation_preferences op
    on op.organization_id = v_org_id and op.nav_key = n.nav_key
  left join public.user_navigation_personalization up
    on up.organization_id = v_org_id and up.user_id = v_user_id and up.nav_key = n.nav_key
  where n.portal_layer = 'app'
    and n.status = 'active'
    and coalesce(op.hidden, false) = false
    and public._dmn505_is_nav_visible(
      v_org_id, v_user_id, n, v_paused, coalesce(op.hidden, false)
    );

  select count(*)::int, array_agg(nav_key)
  into v_visible_count, v_visible_keys
  from _dmn505_visible_nav;

  select coalesce(jsonb_agg(jsonb_build_object(
    'category_key', g.category_key,
    'label_key', g.label_key,
    'icon', g.category_icon,
    'collapsible', g.collapsible,
    'items', g.items
  ) order by g.category_sort), '[]'::jsonb)
  into v_categories
  from (
    select
      c.category_key,
      c.label_key,
      c.sort_order as category_sort,
      c.icon as category_icon,
      c.collapsible,
      jsonb_agg(jsonb_build_object(
        'nav_key', v.nav_key,
        'label', v.menu_name,
        'href', v.route_href,
        'icon', v.icon,
        'module_key', v.module_key,
        'permission_key', v.permission_key,
        'business_pack_key', v.business_pack_key,
        'pinned', v.pinned,
        'favorite', v.favorite,
        'last_used_at', v.last_used_at,
        'use_count', v.use_count
      ) order by v.pinned desc, v.effective_sort, v.menu_name) as items
    from _dmn505_visible_nav v
    join public.aipify_navigation_categories c on c.category_key = v.menu_category
    group by c.category_key, c.label_key, c.sort_order, c.icon, c.collapsible
  ) g;

  v_layout := case when coalesce(v_visible_count, 0) <= 5 then 'flat' else 'grouped' end;

  select jsonb_build_object(
    'recent', coalesce((
      select jsonb_agg(jsonb_build_object('nav_key', r.nav_key, 'label', r.menu_name, 'href', r.route_href)
        order by r.last_used_at desc nulls last)
      from (
        select v.nav_key, v.menu_name, v.route_href, v.last_used_at
        from _dmn505_visible_nav v
        where v.last_used_at is not null
        order by v.last_used_at desc limit 5
      ) r
    ), '[]'::jsonb),
    'pinned', coalesce((
      select jsonb_agg(jsonb_build_object('nav_key', p.nav_key, 'label', p.menu_name, 'href', p.route_href))
      from (
        select distinct on (nav_key) nav_key, menu_name, route_href
        from (
          select op.nav_key, n.menu_name, n.route_href
          from public.organization_navigation_preferences op
          join public.aipify_navigation_registry n on n.nav_key = op.nav_key
          where op.organization_id = v_org_id and op.pinned = true
          union all
          select up.nav_key, n.menu_name, n.route_href
          from public.user_navigation_personalization up
          join public.aipify_navigation_registry n on n.nav_key = up.nav_key
          where up.organization_id = v_org_id and up.user_id = v_user_id and up.pinned = true
        ) x
      ) p
    ), '[]'::jsonb),
    'favorites', coalesce((
      select jsonb_agg(jsonb_build_object('nav_key', v.nav_key, 'label', v.menu_name, 'href', v.route_href))
      from _dmn505_visible_nav v
      where v.favorite = true
    ), '[]'::jsonb),
    'quick_actions', coalesce((
      select jsonb_agg(jsonb_build_object('nav_key', q.nav_key, 'label', q.menu_name, 'href', q.route_href))
      from (
        select nav_key, menu_name, route_href
        from _dmn505_visible_nav
        where pinned or favorite
        order by pinned desc, use_count desc
        limit 6
      ) q
    ), '[]'::jsonb)
  ) into v_personal;

  select coalesce(jsonb_agg(nav_key order by effective_sort), '[]'::jsonb)
  into v_mobile
  from (
    select nav_key, effective_sort from _dmn505_visible_nav
    order by pinned desc, effective_sort
    limit 5
  ) m;

  return jsonb_build_object(
    'found', true,
    'license_status', v_license,
    'suspended', v_paused,
    'suspended_notice', case when v_paused then 'Subscription Required — renew to restore full access.' else null end,
    'principle', 'License → Business Packs → Role → Permissions → Menu',
    'visibility_rule', 'Visible when installed + permission granted. Hidden when not installed or no permission.',
    'layout_mode', v_layout,
    'default_landing_href', coalesce(v_landing, '/app'),
    'categories', v_categories,
    'personalization', v_personal,
    'mobile_nav_keys', v_mobile,
    'settings_route', '/app/settings/navigation',
    'preferences_route', '/app/settings/navigation'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Platform + Super Admin navigation
-- ---------------------------------------------------------------------------
create or replace function public.get_dynamic_platform_navigation()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_items jsonb;
begin
  if not public.is_platform_admin() then
    return jsonb_build_object('found', false, 'error', 'Platform Admin access required');
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'category_key', c.category_key,
    'label_key', c.label_key,
    'icon', c.icon,
    'items', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'nav_key', n.nav_key, 'label', n.menu_name, 'href', n.route_href, 'icon', n.icon
      ) order by n.sort_order), '[]'::jsonb)
      from public.aipify_navigation_registry n
      where n.portal_layer = 'platform' and n.menu_category = c.category_key and n.status = 'active'
    )
  ) order by c.sort_order), '[]'::jsonb)
  into v_items
  from public.aipify_navigation_categories c
  where exists (
    select 1 from public.aipify_navigation_registry n
    where n.portal_layer = 'platform' and n.menu_category = c.category_key and n.status = 'active'
  );

  return jsonb_build_object(
    'found', true,
    'principle', 'Platform navigation generated from registry — not hardcoded.',
    'categories', v_items
  );
end; $$;

create or replace function public.get_dynamic_super_admin_navigation()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_items jsonb;
begin
  if not exists (
    select 1 from public.platform_admins pa
    where pa.auth_user_id = auth.uid() and pa.role = 'super_admin' and coalesce(pa.status, 'active') = 'active'
  ) then
    return jsonb_build_object('found', false, 'error', 'Super Admin access required');
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'category_key', c.category_key,
    'label_key', c.label_key,
    'icon', c.icon,
    'items', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'nav_key', n.nav_key, 'label', n.menu_name, 'href', n.route_href, 'icon', n.icon
      ) order by n.sort_order), '[]'::jsonb)
      from public.aipify_navigation_registry n
      where n.portal_layer = 'super_admin' and n.menu_category = c.category_key and n.status = 'active'
    )
  ) order by c.sort_order), '[]'::jsonb)
  into v_items
  from public.aipify_navigation_categories c
  where exists (
    select 1 from public.aipify_navigation_registry n
    where n.portal_layer = 'super_admin' and n.menu_category = c.category_key and n.status = 'active'
  );

  return jsonb_build_object(
    'found', true,
    'principle', 'Super Admin navigation generated from registry — governance visibility only.',
    'categories', v_items
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Companion + Search integration
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_navigation_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_nav jsonb; v_modules jsonb;
begin
  v_nav := public.get_dynamic_app_navigation();
  if coalesce((v_nav->>'found')::boolean, false) = false then
    return jsonb_build_object('found', false);
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'module_key', item->>'module_key',
    'label', item->>'label',
    'href', item->>'href',
    'permission_key', item->>'permission_key',
    'business_pack_key', item->>'business_pack_key'
  )), '[]'::jsonb)
  into v_modules
  from jsonb_array_elements(v_nav->'categories') cat,
       jsonb_array_elements(cat->'items') item
  where item->>'module_key' is not null;

  return jsonb_build_object(
    'found', true,
    'license_status', v_nav->>'license_status',
    'suspended', v_nav->'suspended',
    'visible_modules', v_modules,
    'principle', 'Companion understands visible modules, role, permissions, and installed Business Packs.'
  );
end; $$;

create or replace function public.get_visible_navigation_search(p_query text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_nav jsonb; v_items jsonb; v_q text;
begin
  v_nav := public.get_dynamic_app_navigation();
  if coalesce((v_nav->>'found')::boolean, false) = false then
    return jsonb_build_object('found', false, 'items', '[]'::jsonb);
  end if;

  v_q := lower(trim(coalesce(p_query, '')));

  select coalesce(jsonb_agg(jsonb_build_object(
    'nav_key', item->>'nav_key',
    'label', item->>'label',
    'href', item->>'href',
    'module_key', item->>'module_key',
    'category_key', cat->>'category_key'
  )), '[]'::jsonb)
  into v_items
  from jsonb_array_elements(v_nav->'categories') cat,
       jsonb_array_elements(cat->'items') item
  where v_q = ''
     or lower(item->>'label') like '%' || v_q || '%'
     or lower(coalesce(item->>'module_key', '')) like '%' || v_q || '%'
     or lower(coalesce(item->>'nav_key', '')) like '%' || v_q || '%';

  return jsonb_build_object(
    'found', true,
    'query', p_query,
    'items', v_items,
    'privacy_note', 'Search returns visible modules only — never items the employee cannot access.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Navigation preferences + personalization actions
-- ---------------------------------------------------------------------------
create or replace function public.get_navigation_preferences_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_nav jsonb;
begin
  perform public._bde_require_admin();
  v_org_id := public._presence_tenant_for_auth();
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_nav := public.get_dynamic_app_navigation();

  return jsonb_build_object(
    'found', true,
    'principle', 'APP Owner controls pins, hidden modules, landing page, and department shortcuts.',
    'navigation', v_nav,
    'owner_preferences', coalesce((
      select jsonb_agg(jsonb_build_object(
        'nav_key', p.nav_key, 'pinned', p.pinned, 'hidden', p.hidden,
        'sort_override', p.sort_override, 'is_default_landing', p.is_default_landing,
        'department_id', p.department_id, 'shortcut_label', p.shortcut_label
      ) order by p.sort_override nulls last)
      from public.organization_navigation_preferences p
      where p.organization_id = v_org_id
    ), '[]'::jsonb),
    'departments', coalesce((
      select jsonb_agg(jsonb_build_object('id', d.id, 'name', d.name, 'department_key', d.department_key))
      from public.organization_departments d
      where d.organization_id = v_org_id and d.is_active = true
      order by d.sort_order
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.perform_navigation_preference_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_nav_key text;
begin
  v_org_id := public._presence_tenant_for_auth();
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_nav_key := coalesce(p_payload->>'nav_key', p_payload->>'module_key');

  if p_action_type = 'record_module_use' then
    insert into public.user_navigation_personalization (
      organization_id, user_id, nav_key, last_used_at, use_count
    ) values (v_org_id, v_user_id, v_nav_key, now(), 1)
    on conflict (organization_id, user_id, nav_key) do update set
      last_used_at = now(),
      use_count = user_navigation_personalization.use_count + 1,
      updated_at = now();
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type in ('pin_module', 'unpin_module', 'hide_module', 'show_module', 'set_default_landing', 'set_sort_order', 'create_department_shortcut') then
    perform public._bde_require_admin();
  end if;

  if p_action_type = 'pin_module' then
    insert into public.organization_navigation_preferences (organization_id, nav_key, pinned, updated_by_user_id)
    values (v_org_id, v_nav_key, true, v_user_id)
    on conflict (organization_id, nav_key) do update set pinned = true, updated_at = now(), updated_by_user_id = v_user_id;
    perform public._dmn505_log(v_org_id, v_user_id, 'app', 'module_pinned', v_nav_key, 'Module pinned in navigation', p_payload);
    return jsonb_build_object('ok', true, 'message', 'Module pinned');

  elsif p_action_type = 'unpin_module' then
    update public.organization_navigation_preferences set pinned = false, updated_at = now()
    where organization_id = v_org_id and nav_key = v_nav_key;
    perform public._dmn505_log(v_org_id, v_user_id, 'app', 'module_unpinned', v_nav_key, 'Module unpinned', p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'hide_module' then
    insert into public.organization_navigation_preferences (organization_id, nav_key, hidden, updated_by_user_id)
    values (v_org_id, v_nav_key, true, v_user_id)
    on conflict (organization_id, nav_key) do update set hidden = true, updated_at = now(), updated_by_user_id = v_user_id;
    perform public._dmn505_log(v_org_id, v_user_id, 'app', 'module_hidden', v_nav_key, 'Module hidden from navigation', p_payload);
    return jsonb_build_object('ok', true, 'message', 'Module hidden');

  elsif p_action_type = 'show_module' then
    update public.organization_navigation_preferences set hidden = false, updated_at = now()
    where organization_id = v_org_id and nav_key = v_nav_key;
    perform public._dmn505_log(v_org_id, v_user_id, 'app', 'module_shown', v_nav_key, 'Module restored in navigation', p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'set_default_landing' then
    update public.organization_navigation_preferences set is_default_landing = false where organization_id = v_org_id;
    insert into public.organization_navigation_preferences (organization_id, nav_key, is_default_landing, updated_by_user_id)
    values (v_org_id, v_nav_key, true, v_user_id)
    on conflict (organization_id, nav_key) do update set is_default_landing = true, updated_at = now();
    perform public._dmn505_log(v_org_id, v_user_id, 'app', 'default_landing_set', v_nav_key, 'Default landing page updated', p_payload);
    return jsonb_build_object('ok', true, 'message', 'Default landing page updated');

  elsif p_action_type = 'set_sort_order' then
    insert into public.organization_navigation_preferences (organization_id, nav_key, sort_override, updated_by_user_id)
    values (v_org_id, v_nav_key, (p_payload->>'sort_order')::int, v_user_id)
    on conflict (organization_id, nav_key) do update set sort_override = (p_payload->>'sort_order')::int, updated_at = now();
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'favorite_module' then
    insert into public.user_navigation_personalization (organization_id, user_id, nav_key, favorite)
    values (v_org_id, v_user_id, v_nav_key, coalesce((p_payload->>'favorite')::boolean, true))
    on conflict (organization_id, user_id, nav_key) do update set
      favorite = coalesce((p_payload->>'favorite')::boolean, true),
      updated_at = now();
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'pin_user_module' then
    insert into public.user_navigation_personalization (organization_id, user_id, nav_key, pinned)
    values (v_org_id, v_user_id, v_nav_key, true)
    on conflict (organization_id, user_id, nav_key) do update set pinned = true, updated_at = now();
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_department_shortcut' then
    insert into public.organization_navigation_preferences (
      organization_id, nav_key, department_id, shortcut_label, updated_by_user_id
    ) values (
      v_org_id, v_nav_key, (p_payload->>'department_id')::uuid, p_payload->>'shortcut_label', v_user_id
    )
    on conflict (organization_id, nav_key) do update set
      department_id = (p_payload->>'department_id')::uuid,
      shortcut_label = p_payload->>'shortcut_label',
      updated_at = now();
    perform public._dmn505_log(v_org_id, v_user_id, 'app', 'department_shortcut', v_nav_key, 'Department shortcut created', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  return jsonb_build_object('ok', false, 'error', 'Unknown action');
end; $$;

-- Re-sync navigation registry when business packs activate
create or replace function public.activate_business_pack_modules(
  p_organization_id uuid,
  p_pack_key text
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_mod record;
  v_count int := 0;
  v_module_key text;
begin
  if not public.is_platform_admin() and not public._mre501_org_subscription_active(p_organization_id) then
    raise exception 'Platform admin or active organization required';
  end if;

  for v_mod in
    select module_key from public.aipify_module_registry
    where required_business_pack = p_pack_key and status = 'active'
  loop
    v_module_key := v_mod.module_key;
    insert into public.organization_module_activations (
      organization_id, module_key, activation_source, business_pack_key, menu_visible, licensed, status, activated_at
    ) values (
      p_organization_id, v_module_key, 'business_pack', p_pack_key, true, true, 'active', now()
    )
    on conflict (organization_id, module_key) do update set
      activation_source = 'business_pack',
      business_pack_key = p_pack_key,
      menu_visible = true,
      licensed = true,
      status = 'active',
      deactivated_at = null,
      updated_at = now();

    insert into public.tenant_modules (tenant_id, module_key, suite_key, licensed, enabled, status, activated_at)
    values (p_organization_id, v_module_key, p_pack_key, true, true, 'enabled', now())
    on conflict (tenant_id, module_key) do update set
      licensed = true, enabled = true, status = 'enabled', suite_key = p_pack_key, updated_at = now();

    v_count := v_count + 1;
  end loop;

  perform public._dmn505_sync_registry_from_modules();

  -- Register pack permissions for roles (Phase 504 integration)
  if exists (select 1 from pg_proc where proname = '_rpm504_register_pack_permissions') then
    perform public._rpm504_register_pack_permissions(p_organization_id, p_pack_key);
  end if;

  perform public._mre501_log('app', 'pack_activated', p_pack_key, p_organization_id,
    'Business pack modules activated — navigation registry synced', jsonb_build_object('count', v_count));

  return jsonb_build_object('ok', true, 'modules_activated', v_count, 'pack_key', p_pack_key);
end; $$;

-- Grants
grant execute on function public.get_dynamic_app_navigation() to authenticated;
grant execute on function public.get_dynamic_platform_navigation() to authenticated;
grant execute on function public.get_dynamic_super_admin_navigation() to authenticated;
grant execute on function public.get_companion_navigation_context() to authenticated;
grant execute on function public.get_visible_navigation_search(text) to authenticated;
grant execute on function public.get_navigation_preferences_center() to authenticated;
grant execute on function public.perform_navigation_preference_action(text, jsonb) to authenticated;
