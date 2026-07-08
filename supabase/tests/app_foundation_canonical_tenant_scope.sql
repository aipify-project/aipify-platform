-- Foundation 3.1 — canonical tenant scope validation (structure + behavior).
-- Usage: psql "$DATABASE_URL" -f supabase/tests/app_foundation_canonical_tenant_scope.sql
-- Requires migration 20261933200000_app_foundation_canonical_tenant_scope.sql applied.

-- ---------------------------------------------------------------------------
-- 1. Structure checks
-- ---------------------------------------------------------------------------
do $$
declare
  v_missing text[];
  v_body text;
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

  select pg_get_functiondef(p.oid) into v_body
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = 'has_organization_permission' limit 1;
  if position('_app_active_organization_id_for_auth' in v_body) = 0 then
    raise exception 'has_organization_permission must call _app_active_organization_id_for_auth()';
  end if;

  select pg_get_functiondef(p.oid) into v_body
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = '_bde_require_admin' limit 1;
  if position('_app_has_canonical_admin_capability' in v_body) = 0 then
    raise exception '_bde_require_admin must call _app_has_canonical_admin_capability()';
  end if;

  select pg_get_functiondef(p.oid) into v_body
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = '_presence_tenant_for_auth' limit 1;
  if position('_app_active_organization_id_for_auth' in v_body) = 0 then
    raise exception '_presence_tenant_for_auth must delegate to _app_active_organization_id_for_auth()';
  end if;

  raise notice 'Foundation 3.1 structure: PASS';
end;
$$;

-- ---------------------------------------------------------------------------
-- 2. Behavior checks (transaction rolled back — no persistent fixture data)
-- ---------------------------------------------------------------------------
begin;

do $$
declare
  v_suffix text := replace(gen_random_uuid()::text, '-', '');
  v_home_company_id uuid := gen_random_uuid();
  v_other_company_id uuid := gen_random_uuid();
  v_home_customer_id uuid := gen_random_uuid();
  v_other_org_id uuid := gen_random_uuid();
  v_user_id uuid := gen_random_uuid();
  v_auth_owner uuid := gen_random_uuid();
  v_auth_admin uuid := gen_random_uuid();
  v_auth_staff uuid := gen_random_uuid();
  v_auth_support uuid := gen_random_uuid();
  v_auth_readonly uuid := gen_random_uuid();
  v_auth_super uuid := gen_random_uuid();
  v_auth_platform_support uuid := gen_random_uuid();
  v_perm_key text := 'foundation31.notifications.view.' || v_suffix;
  v_resolved uuid;
  v_allowed boolean;
  v_admin_ok boolean;
begin
  -- Minimal auth.users rows (required FK for users / platform_admins).
  insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
  values
    ('00000000-0000-0000-0000-000000000000', v_auth_owner, 'authenticated', 'authenticated',
     'f31-owner-' || v_suffix || '@test.local', crypt('x', gen_salt('bf')), now(), now(), now()),
    ('00000000-0000-0000-0000-000000000000', v_auth_admin, 'authenticated', 'authenticated',
     'f31-admin-' || v_suffix || '@test.local', crypt('x', gen_salt('bf')), now(), now(), now()),
    ('00000000-0000-0000-0000-000000000000', v_auth_staff, 'authenticated', 'authenticated',
     'f31-staff-' || v_suffix || '@test.local', crypt('x', gen_salt('bf')), now(), now(), now()),
    ('00000000-0000-0000-0000-000000000000', v_auth_support, 'authenticated', 'authenticated',
     'f31-support-' || v_suffix || '@test.local', crypt('x', gen_salt('bf')), now(), now(), now()),
    ('00000000-0000-0000-0000-000000000000', v_auth_readonly, 'authenticated', 'authenticated',
     'f31-readonly-' || v_suffix || '@test.local', crypt('x', gen_salt('bf')), now(), now(), now()),
    ('00000000-0000-0000-0000-000000000000', v_auth_super, 'authenticated', 'authenticated',
     'f31-super-' || v_suffix || '@test.local', crypt('x', gen_salt('bf')), now(), now(), now()),
    ('00000000-0000-0000-0000-000000000000', v_auth_platform_support, 'authenticated', 'authenticated',
     'f31-psupport-' || v_suffix || '@test.local', crypt('x', gen_salt('bf')), now(), now(), now());

  insert into public.companies (id, name, slug, is_platform)
  values
    (v_home_company_id, 'F31 Home Co ' || v_suffix, 'f31-home-' || v_suffix, false),
    (v_other_company_id, 'F31 Other Co ' || v_suffix, 'f31-other-' || v_suffix, false);

  insert into public.customers (id, customer_number, company_id, customer_type, company_name, email, status)
  values
    (v_home_customer_id, 'F31H-' || v_suffix, v_home_company_id, 'company', 'F31 Home Co', 'home-' || v_suffix || '@test.local', 'active'),
    (v_other_org_id, 'F31O-' || v_suffix, v_other_company_id, 'company', 'F31 Other Co', 'other-' || v_suffix || '@test.local', 'active');

  insert into public.organizations (id, name, slug, status, subscription_plan)
  values
    (v_home_customer_id, 'F31 Home Org', 'f31-home-org-' || v_suffix, 'active', 'business'),
    (v_other_org_id, 'F31 Other Org', 'f31-other-org-' || v_suffix, 'active', 'business');

  -- handle_new_auth_user() creates public.users on auth insert; align fixture rows instead of re-inserting.
  update public.users
  set company_id = v_home_company_id, full_name = 'F31 Owner User', role = 'owner'
  where auth_user_id = v_auth_owner
  returning id into v_user_id;

  if v_user_id is null then
    insert into public.users (id, auth_user_id, company_id, full_name, role)
    values (gen_random_uuid(), v_auth_owner, v_home_company_id, 'F31 Owner User', 'owner')
    returning id into v_user_id;
  end if;

  update public.users
  set company_id = v_home_company_id, full_name = 'F31 Admin User', role = 'admin'
  where auth_user_id = v_auth_admin;

  update public.users
  set company_id = v_home_company_id, full_name = 'F31 Staff User', role = 'staff'
  where auth_user_id = v_auth_staff;

  update public.users
  set company_id = v_home_company_id, full_name = 'F31 Support User', role = 'support'
  where auth_user_id = v_auth_support;

  update public.users
  set company_id = v_home_company_id, full_name = 'F31 ReadOnly User', role = 'read_only'
  where auth_user_id = v_auth_readonly;

  update public.users
  set company_id = v_home_company_id, full_name = 'F31 Super Admin', role = 'owner'
  where auth_user_id = v_auth_super;

  update public.users
  set company_id = v_home_company_id, full_name = 'F31 Platform Support', role = 'staff'
  where auth_user_id = v_auth_platform_support;

  insert into public.organization_users (organization_id, user_id, role, status, joined_at)
  values
    (v_home_customer_id, v_user_id, 'owner', 'active', now()),
    (v_other_org_id, v_user_id, 'viewer', 'active', now());

  insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
  values (v_perm_key, 'Foundation 3.1 test', null, 'Foundation 3.1 test permission');

  insert into public.organization_role_permissions (organization_id, role, permission_key)
  values (v_other_org_id, 'viewer', v_perm_key);

  -- Admin capability matrix (owner user auth for role-specific users below).
  perform set_config('request.jwt.claim.sub', v_auth_owner::text, true);
  if not public._app_has_canonical_admin_capability() then
    raise exception 'APP owner must pass _app_has_canonical_admin_capability';
  end if;
  begin
    perform public._bde_require_admin();
  exception when others then
    raise exception 'APP owner must pass _bde_require_admin: %', sqlerrm;
  end;

  perform set_config('request.jwt.claim.sub', v_auth_admin::text, true);
  if not public._app_has_canonical_admin_capability() then
    raise exception 'APP admin must pass _app_has_canonical_admin_capability';
  end if;

  perform set_config('request.jwt.claim.sub', v_auth_staff::text, true);
  if public._app_has_canonical_admin_capability() then
    raise exception 'staff must not pass _app_has_canonical_admin_capability';
  end if;

  perform set_config('request.jwt.claim.sub', v_auth_support::text, true);
  if public._app_has_canonical_admin_capability() then
    raise exception 'support must not pass _app_has_canonical_admin_capability';
  end if;

  perform set_config('request.jwt.claim.sub', v_auth_readonly::text, true);
  if public._app_has_canonical_admin_capability() then
    raise exception 'read_only must not pass _app_has_canonical_admin_capability';
  end if;

  insert into public.platform_admins (auth_user_id, role)
  values (v_auth_super, 'super_admin');
  perform set_config('request.jwt.claim.sub', v_auth_super::text, true);
  if not public._app_has_canonical_admin_capability() then
    raise exception 'platform super_admin must pass _app_has_canonical_admin_capability';
  end if;

  insert into public.platform_admins (auth_user_id, role)
  values (v_auth_platform_support, 'platform_support');
  perform set_config('request.jwt.claim.sub', v_auth_platform_support::text, true);
  if public._app_has_canonical_admin_capability() then
    raise exception 'platform_support must not pass _app_has_canonical_admin_capability';
  end if;

  -- Active org: home fallback when no context row.
  perform set_config('request.jwt.claim.sub', v_auth_owner::text, true);
  v_resolved := public._app_active_organization_id_for_auth();
  if v_resolved is distinct from v_home_customer_id then
    raise exception 'Expected home customer org fallback, got %', v_resolved;
  end if;
  if public._presence_tenant_for_auth() is distinct from v_home_customer_id then
    raise exception '_presence_tenant_for_auth must match canonical home org';
  end if;

  -- Switched org beats home fallback.
  insert into public.organization_user_context (user_id, organization_id, updated_at)
  values (v_user_id, v_other_org_id, now())
  on conflict (user_id) do update set organization_id = excluded.organization_id, updated_at = now();

  v_resolved := public._app_active_organization_id_for_auth();
  if v_resolved is distinct from v_other_org_id then
    raise exception 'Switched org must win over home customer fallback (expected %, got %)', v_other_org_id, v_resolved;
  end if;

  v_allowed := public.has_organization_permission(v_perm_key);
  if v_allowed is not true then
    raise exception 'has_organization_permission must honor switched org role grants';
  end if;

  -- Invalid switched org (no active membership) must not override home fallback.
  delete from public.organization_users
  where organization_id = v_other_org_id and user_id = v_user_id;

  v_resolved := public._app_active_organization_id_for_auth();
  if v_resolved is distinct from v_home_customer_id then
    raise exception 'Invalid switched org must fall back to home customer org';
  end if;

  v_allowed := public.has_organization_permission(v_perm_key);
  if v_allowed is true then
    raise exception 'Permission for other org must not apply after invalid switch / no membership';
  end if;

  -- No auth user row for random JWT sub → fail closed.
  perform set_config('request.jwt.claim.sub', gen_random_uuid()::text, true);
  if public._app_active_organization_id_for_auth() is not null then
    raise exception 'Unauthenticated caller must not resolve an organization';
  end if;

  raise notice 'Foundation 3.1 behavior: PASS';
exception
  when others then
    raise exception 'Foundation 3.1 behavior: FAIL — %', sqlerrm;
end;
$$;

rollback;
