-- Foundation 3.1 — smoke assertions for canonical tenant scope (run locally after migration apply).
-- Usage: psql "$DATABASE_URL" -f supabase/tests/app_foundation_canonical_tenant_scope.sql

do $$
declare
  v_missing text[];
begin
  v_missing := array[]::text[];

  if to_regprocedure('public._app_active_organization_id_for_auth()') is null then
    v_missing := array_append(v_missing, '_app_active_organization_id_for_auth()');
  end if;

  if to_regprocedure('public._app_has_canonical_admin_capability()') is null then
    v_missing := array_append(v_missing, '_app_has_canonical_admin_capability()');
  end if;

  if to_regprocedure('public._presence_tenant_for_auth()') is null then
    v_missing := array_append(v_missing, '_presence_tenant_for_auth()');
  end if;

  if to_regprocedure('public._bde_require_admin()') is null then
    v_missing := array_append(v_missing, '_bde_require_admin()');
  end if;

  if to_regprocedure('public.has_organization_permission(text)') is null then
    v_missing := array_append(v_missing, 'has_organization_permission(text)');
  end if;

  if to_regprocedure('public.get_domain_license_center()') is null then
    v_missing := array_append(v_missing, 'get_domain_license_center()');
  end if;

  if coalesce(array_length(v_missing, 1), 0) > 0 then
    raise exception 'Missing required functions: %', array_to_string(v_missing, ', ');
  end if;

  raise notice 'Foundation 3.1: required functions present.';
end;
$$;

-- Definition checks — ensure has_organization_permission body references canonical resolver.
do $$
declare
  v_body text;
begin
  select pg_get_functiondef(p.oid)
  into v_body
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname = 'has_organization_permission'
  limit 1;

  if v_body is null or position('_app_active_organization_id_for_auth' in v_body) = 0 then
    raise exception 'has_organization_permission must call _app_active_organization_id_for_auth()';
  end if;

  select pg_get_functiondef(p.oid)
  into v_body
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname = '_bde_require_admin'
  limit 1;

  if v_body is null or position('_app_has_canonical_admin_capability' in v_body) = 0 then
    raise exception '_bde_require_admin must call _app_has_canonical_admin_capability()';
  end if;

  select pg_get_functiondef(p.oid)
  into v_body
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname = '_presence_tenant_for_auth'
  limit 1;

  if v_body is null or position('_app_active_organization_id_for_auth' in v_body) = 0 then
    raise exception '_presence_tenant_for_auth must delegate to _app_active_organization_id_for_auth()';
  end if;

  raise notice 'Foundation 3.1: function bodies reference canonical helpers.';
end;
$$;

-- Role matrix documentation (requires seeded auth users to execute interactively):
-- | Actor              | _app_has_canonical_admin_capability | get_domain_license_center |
-- |--------------------|-------------------------------------|---------------------------|
-- | APP owner          | true                                | allowed                   |
-- | APP admin          | true                                | allowed                   |
-- | staff/read_only    | false                               | denied                    |
-- | platform super_admin | true                              | allowed (canonical path)  |
-- | platform_support   | false                               | denied                    |
-- Switched org: set organization_user_context.organization_id — _app_active_organization_id_for_auth
-- must return switched org when active membership exists; customer fallback must not override it.
