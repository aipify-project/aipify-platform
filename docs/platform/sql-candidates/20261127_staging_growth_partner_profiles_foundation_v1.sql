-- =============================================================================
-- PREPARED_ONLY — Growth Partner Staging profiles foundation (MINIMAL)
-- Target intended: aipify-core-staging (auedugihkduoaikfusqe) only.
-- DO NOT APPLY without a separate named owner APPLY YES citing this path + SHA-256.
-- Production qbcqoixhrvhnuwphefvw must not be targeted.
--
-- Creates only:
--   public.growth_partner_app_profiles  (live Production columns, empty)
--   public.growth_partner_app_audit     (live Production columns, empty)
--   public._gp455_app_user_id()
--   public._gp455_profile_for_auth()
--   public._gp455_log(uuid, uuid, text, text, jsonb)
--
-- Does not import training modules, does not create training tables, does not
-- insert permission keys, does not seed role permissions, does not create
-- sellers, and does not install or grant public signup.
-- partner_public_id and primary_link_slug are nullable profile columns only.
-- They do not create tracking links.
--
-- Table ACL matches Production: owner + service_role, RLS on, not forced,
-- no policies. Function execute is narrower than Production: public, anon, and
-- authenticated are revoked. service_role may execute. The owner can still
-- execute, so a later security-definer function owned by the same role can call
-- these helpers without opening them to authenticated.
--
-- Historical migration 20261845500000 is not applied.
-- Next public-link step still needs its own candidate. Do not run
-- 20261845510000 directly: it replaces signup, grants anon/authenticated,
-- and seeds marketing templates.
--
-- Manual rollback, only while both new tables are empty and nothing else
-- references them:
--   drop function if exists public._gp455_log(uuid, uuid, text, text, jsonb);
--   drop function if exists public._gp455_profile_for_auth();
--   drop function if exists public._gp455_app_user_id();
--   drop table if exists public.growth_partner_app_audit;
--   drop table if exists public.growth_partner_app_profiles;
-- =============================================================================

do $$
begin
  if to_regclass('public.organizations') is null
     or to_regclass('public.users') is null
     or to_regclass('public.aipify_permissions') is null
     or to_regclass('public.organization_role_permissions') is null
     or to_regclass('public.organization_user_permissions') is null
     or to_regclass('public.organization_modules') is null
     or to_regclass('public.marketplace_modules') is null
     or to_regprocedure('auth.uid()') is null then
    raise exception 'prerequisite missing for growth partner profiles';
  end if;
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'users'
      and column_name = 'auth_user_id'
  ) then
    raise exception 'prerequisite missing: users.auth_user_id';
  end if;
  if (
    select count(*) from pg_roles
    where rolname in ('anon', 'authenticated', 'service_role')
  ) <> 3 then
    raise exception 'prerequisite missing: roles anon, authenticated, service_role';
  end if;
end
$$;

drop table if exists pg_temp.gp_foundation_guard;
create temporary table gp_foundation_guard as
select
  (select count(*) from public.aipify_permissions) as perms,
  (select count(*) from public.organization_role_permissions) as role_perms,
  (select count(*) from public.organization_user_permissions) as user_perms,
  (select count(*) from public.organization_modules) as modules,
  (select count(*) from public.marketplace_modules) as catalog,
  (select count(*) from public.organizations) as orgs,
  (select count(*) from public.users) as users;

create table if not exists public.growth_partner_app_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  full_name text not null,
  company_name text not null,
  business_registration_number text not null,
  country text not null,
  address text not null,
  phone_country_code text not null default '+47',
  phone_number text not null,
  email text not null,
  partner_status text not null default 'certification_required' check (
    partner_status in ('certification_required', 'certified', 'suspended', 'inactive')
  ),
  certification_status text not null default 'pending' check (
    certification_status in ('pending', 'in_progress', 'passed', 'failed')
  ),
  training_progress_pct int not null default 0 check (training_progress_pct between 0 and 100),
  profile_metadata jsonb not null default '{}'::jsonb,
  signup_source text not null default 'public_growth_partners',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  partner_public_id text unique,
  primary_link_slug text
);

alter table public.growth_partner_app_profiles
  add column if not exists partner_public_id text,
  add column if not exists primary_link_slug text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'growth_partner_app_profiles_partner_public_id_key'
      and conrelid = 'public.growth_partner_app_profiles'::regclass
  ) then
    alter table public.growth_partner_app_profiles
      add constraint growth_partner_app_profiles_partner_public_id_key unique (partner_public_id);
  end if;
end
$$;

create index if not exists growth_partner_app_profiles_org_idx
  on public.growth_partner_app_profiles (organization_id);

create unique index if not exists growth_partner_app_profiles_primary_slug_idx
  on public.growth_partner_app_profiles (primary_link_slug)
  where primary_link_slug is not null;

create table if not exists public.growth_partner_app_audit (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.growth_partner_app_profiles (id) on delete set null,
  organization_id uuid references public.organizations (id) on delete set null,
  auth_user_id uuid,
  event_type text not null,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists growth_partner_app_audit_profile_idx
  on public.growth_partner_app_audit (profile_id, created_at desc);

alter table public.growth_partner_app_profiles enable row level security;
alter table public.growth_partner_app_audit enable row level security;

revoke all on table public.growth_partner_app_profiles from public, anon, authenticated;
revoke all on table public.growth_partner_app_audit from public, anon, authenticated;
grant all on table public.growth_partner_app_profiles to service_role;
grant all on table public.growth_partner_app_audit to service_role;

create or replace function public._gp455_app_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select u.id from public.users u where u.auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._gp455_profile_for_auth()
returns public.growth_partner_app_profiles language plpgsql stable security definer set search_path = public as $$
declare v_row public.growth_partner_app_profiles;
begin
  select * into v_row from public.growth_partner_app_profiles p where p.auth_user_id = auth.uid() limit 1;
  return v_row;
end; $$;

create or replace function public._gp455_log(
  p_profile_id uuid, p_org_id uuid, p_event_type text, p_summary text, p_metadata jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_app_audit (profile_id, organization_id, auth_user_id, event_type, summary, metadata)
  values (p_profile_id, p_org_id, auth.uid(), p_event_type, p_summary, coalesce(p_metadata, '{}'::jsonb));
end; $$;

revoke all on function public._gp455_app_user_id() from public, anon, authenticated;
revoke all on function public._gp455_profile_for_auth() from public, anon, authenticated;
revoke all on function public._gp455_log(uuid, uuid, text, text, jsonb) from public, anon, authenticated;
grant execute on function public._gp455_app_user_id() to service_role;
grant execute on function public._gp455_profile_for_auth() to service_role;
grant execute on function public._gp455_log(uuid, uuid, text, text, jsonb) to service_role;

do $$
declare
  v_app text;
  v_profile text;
  v_log text;
  v_guard gp_foundation_guard%rowtype;
begin
  if (
    select count(*)
    from pg_attribute a
    where a.attrelid = 'public.growth_partner_app_profiles'::regclass
      and a.attnum > 0
      and not a.attisdropped
  ) <> 21 then
    raise exception 'growth_partner_app_profiles column count does not match Production';
  end if;

  if exists (
    select 1
    from (values
      ('id', 'uuid', true, 'gen_random_uuid()'),
      ('auth_user_id', 'uuid', true, null),
      ('organization_id', 'uuid', true, null),
      ('user_id', 'uuid', false, null),
      ('full_name', 'text', true, null),
      ('company_name', 'text', true, null),
      ('business_registration_number', 'text', true, null),
      ('country', 'text', true, null),
      ('address', 'text', true, null),
      ('phone_country_code', 'text', true, '''+47''::text'),
      ('phone_number', 'text', true, null),
      ('email', 'text', true, null),
      ('partner_status', 'text', true, '''certification_required''::text'),
      ('certification_status', 'text', true, '''pending''::text'),
      ('training_progress_pct', 'integer', true, '0'),
      ('profile_metadata', 'jsonb', true, '''{}''::jsonb'),
      ('signup_source', 'text', true, '''public_growth_partners''::text'),
      ('created_at', 'timestamp with time zone', true, 'now()'),
      ('updated_at', 'timestamp with time zone', true, 'now()'),
      ('partner_public_id', 'text', false, null),
      ('primary_link_slug', 'text', false, null)
    ) as expected(name, type_name, not_null, default_expr)
    full join (
      select a.attname as name,
             format_type(a.atttypid, a.atttypmod) as type_name,
             a.attnotnull,
             pg_get_expr(d.adbin, d.adrelid) as default_expr
      from pg_attribute a
      left join pg_attrdef d on d.adrelid = a.attrelid and d.adnum = a.attnum
      where a.attrelid = 'public.growth_partner_app_profiles'::regclass
        and a.attnum > 0
        and not a.attisdropped
    ) as actual using (name)
    where expected.name is null
       or actual.name is null
       or expected.type_name is distinct from actual.type_name
       or expected.not_null is distinct from actual.attnotnull
       or expected.default_expr is distinct from actual.default_expr
  ) then
    raise exception 'growth_partner_app_profiles columns do not match Production';
  end if;

  if (
    select count(*) from pg_constraint
    where conrelid = 'public.growth_partner_app_profiles'::regclass
      and pg_get_constraintdef(oid) in (
        'PRIMARY KEY (id)',
        'UNIQUE (auth_user_id)',
        'FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE',
        'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL',
        'CHECK ((partner_status = ANY (ARRAY[''certification_required''::text, ''certified''::text, ''suspended''::text, ''inactive''::text])))',
        'CHECK ((certification_status = ANY (ARRAY[''pending''::text, ''in_progress''::text, ''passed''::text, ''failed''::text])))',
        'CHECK (((training_progress_pct >= 0) AND (training_progress_pct <= 100)))',
        'UNIQUE (partner_public_id)'
      )
  ) <> 8 then
    raise exception 'growth_partner_app_profiles constraints do not match Production';
  end if;

  if not exists (
    select 1 from pg_indexes
    where schemaname = 'public'
      and indexname = 'growth_partner_app_profiles_org_idx'
      and indexdef = 'CREATE INDEX growth_partner_app_profiles_org_idx ON public.growth_partner_app_profiles USING btree (organization_id)'
  ) or not exists (
    select 1 from pg_indexes
    where schemaname = 'public'
      and indexname = 'growth_partner_app_profiles_primary_slug_idx'
      and indexdef = 'CREATE UNIQUE INDEX growth_partner_app_profiles_primary_slug_idx ON public.growth_partner_app_profiles USING btree (primary_link_slug) WHERE (primary_link_slug IS NOT NULL)'
  ) then
    raise exception 'growth_partner_app_profiles indexes do not match Production';
  end if;

  if (
    select count(*)
    from pg_attribute a
    where a.attrelid = 'public.growth_partner_app_audit'::regclass
      and a.attnum > 0
      and not a.attisdropped
  ) <> 8 then
    raise exception 'growth_partner_app_audit column count does not match Production';
  end if;

  if exists (
    select 1
    from (values
      ('id', 'uuid', true, 'gen_random_uuid()'),
      ('profile_id', 'uuid', false, null),
      ('organization_id', 'uuid', false, null),
      ('auth_user_id', 'uuid', false, null),
      ('event_type', 'text', true, null),
      ('summary', 'text', true, '''''::text'),
      ('metadata', 'jsonb', true, '''{}''::jsonb'),
      ('created_at', 'timestamp with time zone', true, 'now()')
    ) as expected(name, type_name, not_null, default_expr)
    full join (
      select a.attname as name,
             format_type(a.atttypid, a.atttypmod) as type_name,
             a.attnotnull,
             pg_get_expr(d.adbin, d.adrelid) as default_expr
      from pg_attribute a
      left join pg_attrdef d on d.adrelid = a.attrelid and d.adnum = a.attnum
      where a.attrelid = 'public.growth_partner_app_audit'::regclass
        and a.attnum > 0
        and not a.attisdropped
    ) as actual using (name)
    where expected.name is null
       or actual.name is null
       or expected.type_name is distinct from actual.type_name
       or expected.not_null is distinct from actual.attnotnull
       or expected.default_expr is distinct from actual.default_expr
  ) then
    raise exception 'growth_partner_app_audit columns do not match Production';
  end if;

  if (
    select count(*) from pg_constraint
    where conrelid = 'public.growth_partner_app_audit'::regclass
      and pg_get_constraintdef(oid) in (
        'PRIMARY KEY (id)',
        'FOREIGN KEY (profile_id) REFERENCES growth_partner_app_profiles(id) ON DELETE SET NULL',
        'FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL'
      )
  ) <> 3 then
    raise exception 'growth_partner_app_audit constraints do not match Production';
  end if;

  if not exists (
    select 1
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname in ('growth_partner_app_profiles', 'growth_partner_app_audit')
      and c.relrowsecurity
      and not c.relforcerowsecurity
      and (select count(*) from pg_policy p where p.polrelid = c.oid) = 0
      and (select count(*) from pg_trigger t where t.tgrelid = c.oid and not t.tgisinternal) = 0
    having count(*) = 2
  ) then
    raise exception 'profile RLS does not match Production';
  end if;

  if has_table_privilege('anon', 'public.growth_partner_app_profiles', 'select')
     or has_table_privilege('authenticated', 'public.growth_partner_app_profiles', 'select')
     or has_table_privilege('anon', 'public.growth_partner_app_audit', 'select')
     or has_table_privilege('authenticated', 'public.growth_partner_app_audit', 'select')
     or not has_table_privilege('service_role', 'public.growth_partner_app_profiles', 'select')
     or not has_table_privilege('service_role', 'public.growth_partner_app_audit', 'select')
     or exists (
       select 1
       from pg_class c
       join pg_namespace n on n.oid = c.relnamespace
       where n.nspname = 'public'
         and c.relname in ('growth_partner_app_profiles', 'growth_partner_app_audit')
         and (
           c.relacl::text like '%anon=%'
           or c.relacl::text like '%authenticated=%'
           or c.relacl::text ~ '(^|\{|,)='
         )
     ) then
    raise exception 'profile table privileges are wider than Production';
  end if;

  select md5(p.prosrc) into v_app
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = '_gp455_app_user_id'
    and pg_get_function_identity_arguments(p.oid) = '';
  select md5(p.prosrc) into v_profile
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = '_gp455_profile_for_auth'
    and pg_get_function_identity_arguments(p.oid) = '';
  select md5(p.prosrc) into v_log
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = '_gp455_log'
    and pg_get_function_identity_arguments(p.oid) = 'p_profile_id uuid, p_org_id uuid, p_event_type text, p_summary text, p_metadata jsonb';

  if v_app is distinct from 'dc282899b7b278b510bdceed21aadfda'
     or v_profile is distinct from '11a4ba9b95ce0be2870d90c71a40b1e2'
     or v_log is distinct from '69b095a09d7c3bb4ae648e2e373a05b6' then
    raise exception 'helper body does not match Production';
  end if;

  if has_function_privilege('anon', 'public._gp455_app_user_id()', 'execute')
     or has_function_privilege('authenticated', 'public._gp455_app_user_id()', 'execute')
     or has_function_privilege('anon', 'public._gp455_profile_for_auth()', 'execute')
     or has_function_privilege('authenticated', 'public._gp455_profile_for_auth()', 'execute')
     or has_function_privilege('anon', 'public._gp455_log(uuid,uuid,text,text,jsonb)', 'execute')
     or has_function_privilege('authenticated', 'public._gp455_log(uuid,uuid,text,text,jsonb)', 'execute')
     or not has_function_privilege('service_role', 'public._gp455_app_user_id()', 'execute')
     or not has_function_privilege('service_role', 'public._gp455_profile_for_auth()', 'execute')
     or not has_function_privilege('service_role', 'public._gp455_log(uuid,uuid,text,text,jsonb)', 'execute') then
    raise exception 'helper privileges are wider than this candidate allows';
  end if;

  if to_regprocedure('public.complete_growth_partner_public_signup(jsonb)') is not null
     or to_regprocedure('public._gp455_seed_role_permissions(uuid)') is not null
     or to_regprocedure('public._gp455_seed_training(uuid)') is not null
     or to_regclass('public.growth_partner_training_modules') is not null
     or to_regclass('public.growth_partner_training_progress') is not null
     or to_regclass('public.growth_partner_tracking_links') is not null then
    raise exception 'candidate created or found a signup, seed, training, or tracking object';
  end if;

  select * into v_guard from gp_foundation_guard;
  if v_guard.perms is distinct from (select count(*) from public.aipify_permissions)
     or v_guard.role_perms is distinct from (select count(*) from public.organization_role_permissions)
     or v_guard.user_perms is distinct from (select count(*) from public.organization_user_permissions)
     or v_guard.modules is distinct from (select count(*) from public.organization_modules)
     or v_guard.catalog is distinct from (select count(*) from public.marketplace_modules)
     or v_guard.orgs is distinct from (select count(*) from public.organizations)
     or v_guard.users is distinct from (select count(*) from public.users) then
    raise exception 'candidate changed permissions, modules, organizations, or users';
  end if;
end
$$;

drop table if exists pg_temp.gp_foundation_guard;
