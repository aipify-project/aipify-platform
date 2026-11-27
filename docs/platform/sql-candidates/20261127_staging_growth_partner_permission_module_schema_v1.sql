-- =============================================================================
-- PREPARED_ONLY — Growth Partner Staging permission and module schema (MINIMAL)
-- Target intended: aipify-core-staging (auedugihkduoaikfusqe) only.
-- DO NOT APPLY without a separate named owner APPLY YES citing this path + SHA-256.
-- Production qbcqoixhrvhnuwphefvw must not be targeted.
--
-- Creates five empty tables so later Growth Partner migrations can be considered.
-- No rows. No permission assignments. No module catalog seed. No role changes.
-- No functions. _irp_has_permission is a later, separate candidate.
--
-- Production DDL parity (read-only catalog, 2026-11-27):
--   marketplace_modules, aipify_permissions, organization_role_permissions,
--   organization_user_permissions, organization_modules
--   RLS enabled, not forced, zero policies, zero triggers.
--   Privileges: owner + service_role. No public, anon, or authenticated.
--
-- Direct prerequisites that must already exist: public.organizations(id uuid),
-- public.users(id uuid), roles anon, authenticated, service_role.
-- marketplace_modules is included because organization_modules.module_key
-- references it ON DELETE RESTRICT. The catalog stays empty.
--
-- Manual rollback, only before any later migration writes rows, and only when
-- all five tables are still empty. Do not put that SQL in an apply:
--   drop table if exists public.organization_user_permissions;
--   drop table if exists public.organization_role_permissions;
--   drop table if exists public.organization_modules;
--   drop table if exists public.aipify_permissions;
--   drop table if exists public.marketplace_modules;
-- =============================================================================

do $$
begin
  if to_regclass('public.organizations') is null
     or to_regclass('public.users') is null then
    raise exception 'prerequisite missing: public.organizations and public.users';
  end if;
  if (
    select count(*)
    from pg_roles
    where rolname in ('anon', 'authenticated', 'service_role')
  ) <> 3 then
    raise exception 'prerequisite missing: roles anon, authenticated, service_role';
  end if;
end
$$;

create table if not exists public.marketplace_modules (
  id uuid constraint marketplace_modules_pkey primary key default gen_random_uuid(),
  module_key text not null,
  module_name text not null,
  description text,
  category text not null default 'operational',
  status text not null default 'active',
  is_core boolean not null default false,
  is_future boolean not null default false,
  plan_minimum text default 'starter',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint marketplace_modules_module_key_key unique (module_key),
  constraint marketplace_modules_status_check check (
    status = any (array['active'::text, 'inactive'::text, 'beta'::text, 'deprecated'::text, 'archived'::text])
  )
);

create table if not exists public.aipify_permissions (
  id uuid constraint aipify_permissions_pkey primary key default gen_random_uuid(),
  permission_key text not null,
  permission_name text not null,
  module_key text,
  description text,
  created_at timestamptz not null default now(),
  constraint aipify_permissions_permission_key_key unique (permission_key)
);

create table if not exists public.organization_role_permissions (
  id uuid constraint organization_role_permissions_pkey primary key default gen_random_uuid(),
  organization_id uuid not null,
  role text not null,
  permission_key text not null,
  created_at timestamptz not null default now(),
  constraint organization_role_permissions_organization_id_fkey
    foreign key (organization_id) references public.organizations (id) on delete cascade,
  constraint organization_role_permissions_permission_key_fkey
    foreign key (permission_key) references public.aipify_permissions (permission_key) on delete cascade,
  constraint organization_role_permissions_organization_id_role_permissi_key
    unique (organization_id, role, permission_key),
  constraint organization_role_permissions_role_check check (
    role = any (array[
      'owner'::text, 'administrator'::text, 'manager'::text, 'support_agent'::text, 'viewer'::text,
      'employee'::text, 'moderator'::text, 'staff'::text, 'read_only'::text, 'growth_partner'::text
    ])
  )
);

create index if not exists organization_role_permissions_org_idx
  on public.organization_role_permissions (organization_id, role);

create table if not exists public.organization_user_permissions (
  id uuid constraint organization_user_permissions_pkey primary key default gen_random_uuid(),
  organization_id uuid not null,
  user_id uuid not null,
  permission_key text not null,
  granted boolean not null default true,
  created_at timestamptz not null default now(),
  constraint organization_user_permissions_organization_id_fkey
    foreign key (organization_id) references public.organizations (id) on delete cascade,
  constraint organization_user_permissions_user_id_fkey
    foreign key (user_id) references public.users (id) on delete cascade,
  constraint organization_user_permissions_permission_key_fkey
    foreign key (permission_key) references public.aipify_permissions (permission_key) on delete cascade,
  constraint organization_user_permissions_organization_id_user_id_permi_key
    unique (organization_id, user_id, permission_key)
);

create table if not exists public.organization_modules (
  id uuid constraint organization_modules_pkey1 primary key default gen_random_uuid(),
  organization_id uuid not null,
  module_key text not null,
  status text not null default 'inactive',
  activated_at timestamptz,
  configured_at timestamptz,
  deactivated_at timestamptz,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organization_modules_organization_id_fkey1
    foreign key (organization_id) references public.organizations (id) on delete cascade,
  constraint organization_modules_module_key_fkey
    foreign key (module_key) references public.marketplace_modules (module_key) on delete restrict,
  constraint organization_modules_organization_id_module_key_key1
    unique (organization_id, module_key),
  constraint organization_modules_status_check check (
    status = any (array['active'::text, 'inactive'::text, 'beta'::text, 'deprecated'::text, 'archived'::text])
  )
);

do $$
declare
  t text;
begin
  foreach t in array array[
    'marketplace_modules',
    'aipify_permissions',
    'organization_role_permissions',
    'organization_user_permissions',
    'organization_modules'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on table public.%I from public, anon, authenticated', t);
    execute format('grant all on table public.%I to service_role', t);
  end loop;
end
$$;

do $$
declare
  v_missing text;
begin
  with expected(table_name, column_name, data_type, not_null, default_expr) as (
    values
      ('marketplace_modules', 'id', 'uuid', true, 'gen_random_uuid()'),
      ('marketplace_modules', 'module_key', 'text', true, null),
      ('marketplace_modules', 'module_name', 'text', true, null),
      ('marketplace_modules', 'description', 'text', false, null),
      ('marketplace_modules', 'category', 'text', true, '''operational''::text'),
      ('marketplace_modules', 'status', 'text', true, '''active''::text'),
      ('marketplace_modules', 'is_core', 'boolean', true, 'false'),
      ('marketplace_modules', 'is_future', 'boolean', true, 'false'),
      ('marketplace_modules', 'plan_minimum', 'text', false, '''starter''::text'),
      ('marketplace_modules', 'metadata', 'jsonb', true, '''{}''::jsonb'),
      ('marketplace_modules', 'created_at', 'timestamp with time zone', true, 'now()'),
      ('marketplace_modules', 'updated_at', 'timestamp with time zone', true, 'now()'),
      ('aipify_permissions', 'id', 'uuid', true, 'gen_random_uuid()'),
      ('aipify_permissions', 'permission_key', 'text', true, null),
      ('aipify_permissions', 'permission_name', 'text', true, null),
      ('aipify_permissions', 'module_key', 'text', false, null),
      ('aipify_permissions', 'description', 'text', false, null),
      ('aipify_permissions', 'created_at', 'timestamp with time zone', true, 'now()'),
      ('organization_role_permissions', 'id', 'uuid', true, 'gen_random_uuid()'),
      ('organization_role_permissions', 'organization_id', 'uuid', true, null),
      ('organization_role_permissions', 'role', 'text', true, null),
      ('organization_role_permissions', 'permission_key', 'text', true, null),
      ('organization_role_permissions', 'created_at', 'timestamp with time zone', true, 'now()'),
      ('organization_user_permissions', 'id', 'uuid', true, 'gen_random_uuid()'),
      ('organization_user_permissions', 'organization_id', 'uuid', true, null),
      ('organization_user_permissions', 'user_id', 'uuid', true, null),
      ('organization_user_permissions', 'permission_key', 'text', true, null),
      ('organization_user_permissions', 'granted', 'boolean', true, 'true'),
      ('organization_user_permissions', 'created_at', 'timestamp with time zone', true, 'now()'),
      ('organization_modules', 'id', 'uuid', true, 'gen_random_uuid()'),
      ('organization_modules', 'organization_id', 'uuid', true, null),
      ('organization_modules', 'module_key', 'text', true, null),
      ('organization_modules', 'status', 'text', true, '''inactive''::text'),
      ('organization_modules', 'activated_at', 'timestamp with time zone', false, null),
      ('organization_modules', 'configured_at', 'timestamp with time zone', false, null),
      ('organization_modules', 'deactivated_at', 'timestamp with time zone', false, null),
      ('organization_modules', 'settings', 'jsonb', true, '''{}''::jsonb'),
      ('organization_modules', 'created_at', 'timestamp with time zone', true, 'now()'),
      ('organization_modules', 'updated_at', 'timestamp with time zone', true, 'now()')
  ),
  actual as (
    select c.relname as table_name,
           a.attname as column_name,
           format_type(a.atttypid, a.atttypmod) as data_type,
           a.attnotnull as not_null,
           pg_get_expr(ad.adbin, ad.adrelid) as default_expr
    from pg_attribute a
    join pg_class c on c.oid = a.attrelid
    join pg_namespace n on n.oid = c.relnamespace
    left join pg_attrdef ad on ad.adrelid = a.attrelid and ad.adnum = a.attnum
    where n.nspname = 'public'
      and c.relname in (
        'marketplace_modules', 'aipify_permissions', 'organization_role_permissions',
        'organization_user_permissions', 'organization_modules'
      )
      and a.attnum > 0
      and not a.attisdropped
  )
  select string_agg(format('%s.%s', e.table_name, e.column_name), ', ')
  into v_missing
  from expected e
  left join actual a
    on a.table_name = e.table_name
   and a.column_name = e.column_name
   and a.data_type = e.data_type
   and a.not_null = e.not_null
   and a.default_expr is not distinct from e.default_expr
  where a.column_name is null;

  if v_missing is not null then
    raise exception 'schema parity failed for columns: %', v_missing;
  end if;

  if (
    select count(*)
    from pg_attribute a
    join pg_class c on c.oid = a.attrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname in (
        'marketplace_modules', 'aipify_permissions', 'organization_role_permissions',
        'organization_user_permissions', 'organization_modules'
      )
      and a.attnum > 0
      and not a.attisdropped
  ) <> 39 then
    raise exception 'schema parity failed: column count must stay 39';
  end if;

  if exists (
    select 1
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname in (
        'marketplace_modules', 'aipify_permissions', 'organization_role_permissions',
        'organization_user_permissions', 'organization_modules'
      )
      and (c.relrowsecurity is not true or c.relforcerowsecurity is true)
  ) then
    raise exception 'schema parity failed: RLS must be enabled and not forced';
  end if;

  if exists (
    select 1
    from pg_policy p
    join pg_class c on c.oid = p.polrelid
    where c.relname in (
      'marketplace_modules', 'aipify_permissions', 'organization_role_permissions',
      'organization_user_permissions', 'organization_modules'
    )
  ) or exists (
    select 1
    from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    where not t.tgisinternal
      and c.relname in (
        'marketplace_modules', 'aipify_permissions', 'organization_role_permissions',
        'organization_user_permissions', 'organization_modules'
      )
  ) then
    raise exception 'schema parity failed: policies and triggers must stay absent';
  end if;

  if exists (
    select 1
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    cross join lateral aclexplode(c.relacl) x
    left join pg_roles r on r.oid = x.grantee
    where n.nspname = 'public'
      and c.relname in (
        'marketplace_modules', 'aipify_permissions', 'organization_role_permissions',
        'organization_user_permissions', 'organization_modules'
      )
      and (x.grantee = 0 or r.rolname in ('anon', 'authenticated'))
  ) then
    raise exception 'schema parity failed: public, anon, or authenticated still has a grant';
  end if;

  if exists (
    select 1
    from (
      values
        ('marketplace_modules'),
        ('aipify_permissions'),
        ('organization_role_permissions'),
        ('organization_user_permissions'),
        ('organization_modules')
    ) as t(relname)
    where not has_table_privilege('service_role', format('public.%I', t.relname)::regclass, 'SELECT')
  ) then
    raise exception 'schema parity failed: service_role lacks SELECT';
  end if;
end
$$;
