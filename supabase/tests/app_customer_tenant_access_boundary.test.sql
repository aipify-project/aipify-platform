-- APP customer tenant access boundary — targeted validation.
-- Usage: psql "$DATABASE_URL" -f supabase/tests/app_customer_tenant_access_boundary.test.sql
-- Requires migration 20261933500000_app_customer_tenant_access_boundary.sql applied.

-- ---------------------------------------------------------------------------
-- 1. Structure checks (new APP functions exist; generic MTA functions untouched)
-- ---------------------------------------------------------------------------
do $$
declare
  v_missing text[];
  v_body text;
begin
  v_missing := array[]::text[];

  if to_regprocedure('public._app_resolve_customer_tenant_for_auth()') is null then
    v_missing := array_append(v_missing, '_app_resolve_customer_tenant_for_auth()');
  end if;
  if to_regprocedure('public.get_app_eligible_organizations()') is null then
    v_missing := array_append(v_missing, 'get_app_eligible_organizations()');
  end if;
  if to_regprocedure('public.switch_app_organization(uuid)') is null then
    v_missing := array_append(v_missing, 'switch_app_organization(uuid)');
  end if;
  if to_regprocedure('public._app_active_organization_id_for_auth()') is null then
    v_missing := array_append(v_missing, '_app_active_organization_id_for_auth()');
  end if;
  if to_regprocedure('public._apsf260_require_app_access()') is null then
    v_missing := array_append(v_missing, '_apsf260_require_app_access()');
  end if;
  if to_regprocedure('public.get_app_organization_context()') is null then
    v_missing := array_append(v_missing, 'get_app_organization_context()');
  end if;

  -- Generic MTA functions must still exist (this migration must not replace them).
  if to_regprocedure('public._mta_require_organization(uuid)') is null
     and to_regprocedure('public._mta_require_organization()') is null then
    v_missing := array_append(v_missing, '_mta_require_organization()');
  end if;
  if to_regprocedure('public.get_user_organizations()') is null then
    v_missing := array_append(v_missing, 'get_user_organizations()');
  end if;
  if to_regprocedure('public.get_current_organization()') is null then
    v_missing := array_append(v_missing, 'get_current_organization()');
  end if;
  if to_regprocedure('public.switch_organization(uuid)') is null then
    v_missing := array_append(v_missing, 'switch_organization(uuid)');
  end if;
  if to_regprocedure('public._mta_membership_active(uuid,uuid)') is null
     and to_regprocedure('public._mta_membership_active(uuid)') is null then
    v_missing := array_append(v_missing, '_mta_membership_active()');
  end if;

  if coalesce(array_length(v_missing, 1), 0) > 0 then
    raise exception 'Missing required functions: %', array_to_string(v_missing, ', ');
  end if;

  select pg_get_functiondef(p.oid) into v_body
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = '_app_active_organization_id_for_auth'
  limit 1;
  if position('_app_resolve_customer_tenant_for_auth' in v_body) = 0 then
    raise exception '_app_active_organization_id_for_auth must delegate to _app_resolve_customer_tenant_for_auth()';
  end if;

  select pg_get_functiondef(p.oid) into v_body
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = '_apsf260_require_app_access'
  limit 1;
  if position('platform_admins' in v_body) > 0 then
    raise exception '_apsf260_require_app_access must not reference platform_admins';
  end if;
  if position('_app_resolve_customer_tenant_for_auth' in v_body) = 0 then
    raise exception '_apsf260_require_app_access must call _app_resolve_customer_tenant_for_auth()';
  end if;

  select pg_get_functiondef(p.oid) into v_body
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = '_mta_require_organization'
  limit 1;
  if position('organization_user_context' in v_body) = 0 then
    raise exception 'Generic _mta_require_organization() must remain unchanged (expected context upsert)';
  end if;

  raise notice 'APP tenant boundary structure: PASS';
end;
$$;

-- ---------------------------------------------------------------------------
-- 2. Behavior checks (transaction rolled back — isolated fixtures only)
-- ---------------------------------------------------------------------------
begin;

do $$
declare
  v_suffix text := replace(gen_random_uuid()::text, '-', '');

  -- Platform fixture
  v_platform_company_id uuid := gen_random_uuid();
  v_platform_customer_id uuid := gen_random_uuid();
  v_auth_super uuid := gen_random_uuid();
  v_super_user_id uuid;

  -- Customer org A / B
  v_company_a_id uuid := gen_random_uuid();
  v_company_b_id uuid := gen_random_uuid();
  v_customer_a_id uuid := gen_random_uuid();
  v_customer_b_id uuid := gen_random_uuid();

  -- Users
  v_auth_no_membership uuid := gen_random_uuid();
  v_no_membership_user_id uuid;
  v_auth_single uuid := gen_random_uuid();
  v_single_user_id uuid;
  v_auth_multi uuid := gen_random_uuid();
  v_multi_user_id uuid;
  v_auth_platform_member uuid := gen_random_uuid();
  v_platform_member_user_id uuid;
  v_auth_status uuid := gen_random_uuid();
  v_status_user_id uuid;
  v_auth_switch uuid := gen_random_uuid();
  v_switch_user_id uuid;
  v_auth_stale uuid := gen_random_uuid();
  v_stale_user_id uuid;

  v_res jsonb;
  v_ctx jsonb;
  v_state text;
  v_org_id uuid;
  v_count int;
  v_context_before uuid;
  v_context_after uuid;
  v_eligible jsonb;
  v_active uuid;
begin
  -- auth.users (isolated fixture identities)
  insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
  values
    ('00000000-0000-0000-0000-000000000000', v_auth_super, 'authenticated', 'authenticated',
     'actb-super-' || v_suffix || '@test.local', crypt('x', gen_salt('bf')), now(), now(), now()),
    ('00000000-0000-0000-0000-000000000000', v_auth_no_membership, 'authenticated', 'authenticated',
     'actb-nomem-' || v_suffix || '@test.local', crypt('x', gen_salt('bf')), now(), now(), now()),
    ('00000000-0000-0000-0000-000000000000', v_auth_single, 'authenticated', 'authenticated',
     'actb-single-' || v_suffix || '@test.local', crypt('x', gen_salt('bf')), now(), now(), now()),
    ('00000000-0000-0000-0000-000000000000', v_auth_multi, 'authenticated', 'authenticated',
     'actb-multi-' || v_suffix || '@test.local', crypt('x', gen_salt('bf')), now(), now(), now()),
    ('00000000-0000-0000-0000-000000000000', v_auth_platform_member, 'authenticated', 'authenticated',
     'actb-plmem-' || v_suffix || '@test.local', crypt('x', gen_salt('bf')), now(), now(), now()),
    ('00000000-0000-0000-0000-000000000000', v_auth_status, 'authenticated', 'authenticated',
     'actb-status-' || v_suffix || '@test.local', crypt('x', gen_salt('bf')), now(), now(), now()),
    ('00000000-0000-0000-0000-000000000000', v_auth_switch, 'authenticated', 'authenticated',
     'actb-switch-' || v_suffix || '@test.local', crypt('x', gen_salt('bf')), now(), now(), now()),
    ('00000000-0000-0000-0000-000000000000', v_auth_stale, 'authenticated', 'authenticated',
     'actb-stale-' || v_suffix || '@test.local', crypt('x', gen_salt('bf')), now(), now(), now());

  insert into public.companies (id, name, slug, is_platform)
  values
    (v_platform_company_id, 'ACTB Platform Co ' || v_suffix, 'actb-platform-' || v_suffix, true),
    (v_company_a_id, 'ACTB Customer A ' || v_suffix, 'actb-customer-a-' || v_suffix, false),
    (v_company_b_id, 'ACTB Customer B ' || v_suffix, 'actb-customer-b-' || v_suffix, false);

  insert into public.customers (id, customer_number, company_id, customer_type, company_name, email, status)
  values
    (v_platform_customer_id, 'ACTBP-' || v_suffix, v_platform_company_id, 'company', 'ACTB Platform Co',
     'actb-platform-' || v_suffix || '@test.local', 'active'),
    (v_customer_a_id, 'ACTBA-' || v_suffix, v_company_a_id, 'company', 'ACTB Customer A',
     'actb-a-' || v_suffix || '@test.local', 'active'),
    (v_customer_b_id, 'ACTBB-' || v_suffix, v_company_b_id, 'company', 'ACTB Customer B',
     'actb-b-' || v_suffix || '@test.local', 'active');

  insert into public.organizations (id, name, slug, status, subscription_plan)
  values
    (v_platform_customer_id, 'ACTB Platform Org', 'actb-platform-org-' || v_suffix, 'active', 'internal'),
    (v_customer_a_id, 'ACTB Customer Org A', 'actb-org-a-' || v_suffix, 'active', 'business'),
    (v_customer_b_id, 'ACTB Customer Org B', 'actb-org-b-' || v_suffix, 'active', 'business');

  -- Align public.users rows (trigger may have created them)
  update public.users
  set company_id = v_platform_company_id, full_name = 'ACTB Super Admin', role = 'owner'
  where auth_user_id = v_auth_super
  returning id into v_super_user_id;
  if v_super_user_id is null then
    insert into public.users (id, auth_user_id, company_id, full_name, role)
    values (gen_random_uuid(), v_auth_super, v_platform_company_id, 'ACTB Super Admin', 'owner')
    returning id into v_super_user_id;
  end if;

  update public.users
  set company_id = v_company_a_id, full_name = 'ACTB No Membership', role = 'owner'
  where auth_user_id = v_auth_no_membership
  returning id into v_no_membership_user_id;
  if v_no_membership_user_id is null then
    insert into public.users (id, auth_user_id, company_id, full_name, role)
    values (gen_random_uuid(), v_auth_no_membership, v_company_a_id, 'ACTB No Membership', 'owner')
    returning id into v_no_membership_user_id;
  end if;

  update public.users
  set company_id = v_company_a_id, full_name = 'ACTB Single Org User', role = 'owner'
  where auth_user_id = v_auth_single
  returning id into v_single_user_id;
  if v_single_user_id is null then
    insert into public.users (id, auth_user_id, company_id, full_name, role)
    values (gen_random_uuid(), v_auth_single, v_company_a_id, 'ACTB Single Org User', 'owner')
    returning id into v_single_user_id;
  end if;

  update public.users
  set company_id = v_company_a_id, full_name = 'ACTB Multi Org User', role = 'owner'
  where auth_user_id = v_auth_multi
  returning id into v_multi_user_id;
  if v_multi_user_id is null then
    insert into public.users (id, auth_user_id, company_id, full_name, role)
    values (gen_random_uuid(), v_auth_multi, v_company_a_id, 'ACTB Multi Org User', 'owner')
    returning id into v_multi_user_id;
  end if;

  update public.users
  set company_id = v_platform_company_id, full_name = 'ACTB Platform Member', role = 'staff'
  where auth_user_id = v_auth_platform_member
  returning id into v_platform_member_user_id;
  if v_platform_member_user_id is null then
    insert into public.users (id, auth_user_id, company_id, full_name, role)
    values (gen_random_uuid(), v_auth_platform_member, v_platform_company_id, 'ACTB Platform Member', 'staff')
    returning id into v_platform_member_user_id;
  end if;

  update public.users
  set company_id = v_company_a_id, full_name = 'ACTB Status User', role = 'staff'
  where auth_user_id = v_auth_status
  returning id into v_status_user_id;
  if v_status_user_id is null then
    insert into public.users (id, auth_user_id, company_id, full_name, role)
    values (gen_random_uuid(), v_auth_status, v_company_a_id, 'ACTB Status User', 'staff')
    returning id into v_status_user_id;
  end if;

  update public.users
  set company_id = v_company_a_id, full_name = 'ACTB Switch User', role = 'owner'
  where auth_user_id = v_auth_switch
  returning id into v_switch_user_id;
  if v_switch_user_id is null then
    insert into public.users (id, auth_user_id, company_id, full_name, role)
    values (gen_random_uuid(), v_auth_switch, v_company_a_id, 'ACTB Switch User', 'owner')
    returning id into v_switch_user_id;
  end if;

  update public.users
  set company_id = v_company_a_id, full_name = 'ACTB Stale Context User', role = 'owner'
  where auth_user_id = v_auth_stale
  returning id into v_stale_user_id;
  if v_stale_user_id is null then
    insert into public.users (id, auth_user_id, company_id, full_name, role)
    values (gen_random_uuid(), v_auth_stale, v_company_a_id, 'ACTB Stale Context User', 'owner')
    returning id into v_stale_user_id;
  end if;

  insert into public.platform_admins (auth_user_id, role, status)
  values (v_auth_super, 'super_admin', 'active');

  insert into public.organization_users (organization_id, user_id, role, status, joined_at)
  values
    (v_platform_customer_id, v_super_user_id, 'owner', 'active', now()),
    (v_customer_a_id, v_single_user_id, 'owner', 'active', now()),
    (v_customer_a_id, v_multi_user_id, 'owner', 'active', now()),
    (v_customer_b_id, v_multi_user_id, 'viewer', 'active', now() + interval '1 second'),
    (v_platform_customer_id, v_platform_member_user_id, 'viewer', 'active', now()),
    (v_customer_a_id, v_switch_user_id, 'owner', 'active', now()),
    (v_customer_b_id, v_switch_user_id, 'viewer', 'active', now()),
    (v_customer_a_id, v_stale_user_id, 'owner', 'active', now()),
    (v_customer_b_id, v_stale_user_id, 'viewer', 'active', now());

  insert into public.organization_users (organization_id, user_id, role, status)
  values
    (v_customer_a_id, v_status_user_id, 'viewer', 'invited'),
    (v_customer_b_id, v_status_user_id, 'viewer', 'suspended');

  update public.organization_users
  set status = 'removed', updated_at = now()
  where organization_id = v_customer_a_id
    and user_id = v_status_user_id;

  -- Case 1: Platform superadmin with only Platform-org membership
  perform set_config('request.jwt.claim.sub', v_auth_super::text, true);
  v_res := public._app_resolve_customer_tenant_for_auth();
  if coalesce((v_res->>'eligible_organization_count')::int, -1) <> 0 then
    raise exception 'Case 1: expected eligible count 0, got %', v_res->>'eligible_organization_count';
  end if;
  if v_res->>'resolution_state' <> 'membership_missing' then
    raise exception 'Case 1: expected membership_missing, got %', v_res->>'resolution_state';
  end if;
  if v_res->>'organization_id' is not null then
    raise exception 'Case 1: expected no APP tenant organization_id';
  end if;
  v_ctx := public.get_app_organization_context();
  if v_ctx->>'state' <> 'membership_missing' then
    raise exception 'Case 1: expected context state membership_missing, got %', v_ctx->>'state';
  end if;
  if public._app_active_organization_id_for_auth() is not null then
    raise exception 'Case 1: _app_active_organization_id_for_auth must be null';
  end if;
  begin
    perform public._apsf260_require_app_access();
    raise exception 'Case 1: _apsf260_require_app_access must reject platform-only superadmin';
  exception
    when others then
      if sqlerrm not ilike '%APP portal access denied%' then
        raise exception 'Case 1: unexpected error from _apsf260_require_app_access: %', sqlerrm;
      end if;
  end;

  -- Case 2: Regular user without membership
  perform set_config('request.jwt.claim.sub', v_auth_no_membership::text, true);
  v_ctx := public.get_app_organization_context();
  if v_ctx->>'state' <> 'membership_missing' then
    raise exception 'Case 2: expected membership_missing, got %', v_ctx->>'state';
  end if;

  -- Case 3: Active Platform-org membership filtered from listing and switch
  perform set_config('request.jwt.claim.sub', v_auth_platform_member::text, true);
  v_eligible := public.get_app_eligible_organizations();
  if coalesce(jsonb_array_length(v_eligible), 0) <> 0 then
    raise exception 'Case 3: platform member must have empty eligible list, got %', v_eligible;
  end if;
  begin
    perform public.switch_app_organization(v_platform_customer_id);
    raise exception 'Case 3: switch_app_organization must reject platform org';
  exception
    when others then
      if sqlerrm not ilike '%Access denied for organization%' then
        raise exception 'Case 3: unexpected switch error: %', sqlerrm;
      end if;
  end;

  -- Case 4: Single eligible customer org without saved context (read-path must not write)
  perform set_config('request.jwt.claim.sub', v_auth_single::text, true);
  if exists (select 1 from public.organization_user_context where user_id = v_single_user_id) then
    delete from public.organization_user_context where user_id = v_single_user_id;
  end if;

  v_res := public._app_resolve_customer_tenant_for_auth();
  if v_res->>'resolution_state' <> 'ready_candidate' then
    raise exception 'Case 4: expected ready_candidate, got %', v_res->>'resolution_state';
  end if;
  if v_res->>'selected_source' <> 'single_eligible' then
    raise exception 'Case 4: expected selected_source single_eligible, got %', v_res->>'selected_source';
  end if;
  if (v_res->>'organization_id')::uuid is distinct from v_customer_a_id then
    raise exception 'Case 4: wrong organization_id';
  end if;
  if (v_res->>'customer_id')::uuid is distinct from v_customer_a_id then
    raise exception 'Case 4: wrong customer_id';
  end if;
  if (v_res->>'company_id')::uuid is distinct from v_company_a_id then
    raise exception 'Case 4: wrong company_id';
  end if;
  if v_res->>'organization_role' <> 'organization_owner' then
    raise exception 'Case 4: expected organization_owner role, got %', v_res->>'organization_role';
  end if;

  perform public.get_app_organization_context();
  perform public._app_resolve_customer_tenant_for_auth();
  if exists (select 1 from public.organization_user_context where user_id = v_single_user_id) then
    raise exception 'Case 4: read-path must not write organization_user_context';
  end if;

  v_active := public._app_active_organization_id_for_auth();
  if v_active is distinct from v_customer_a_id then
    raise exception 'Case 4: _app_active_organization_id_for_auth must resolve single eligible org';
  end if;

  -- Case 5: Multiple eligible orgs without context → selection_required, no write
  perform set_config('request.jwt.claim.sub', v_auth_multi::text, true);
  delete from public.organization_user_context where user_id = v_multi_user_id;

  v_res := public._app_resolve_customer_tenant_for_auth();
  if v_res->>'resolution_state' <> 'selection_required' then
    raise exception 'Case 5: expected selection_required, got %', v_res->>'resolution_state';
  end if;
  if v_res->>'organization_id' is not null then
    raise exception 'Case 5: organization_id must be null under selection_required';
  end if;
  v_ctx := public.get_app_organization_context();
  if v_ctx->>'state' <> 'selection_required' then
    raise exception 'Case 5: expected context state selection_required, got %', v_ctx->>'state';
  end if;
  if exists (select 1 from public.organization_user_context where user_id = v_multi_user_id) then
    raise exception 'Case 5: read-path must not write organization_user_context';
  end if;
  if public._app_active_organization_id_for_auth() is not null then
    raise exception 'Case 5: _app_active_organization_id_for_auth must be null for selection_required';
  end if;

  -- Case 6: Valid saved context is used
  insert into public.organization_user_context (user_id, organization_id, updated_at)
  values (v_multi_user_id, v_customer_b_id, now())
  on conflict (user_id) do update
    set organization_id = excluded.organization_id, updated_at = now();

  v_res := public._app_resolve_customer_tenant_for_auth();
  if v_res->>'selected_source' <> 'saved_context' then
    raise exception 'Case 6: expected saved_context, got %', v_res->>'selected_source';
  end if;
  if (v_res->>'organization_id')::uuid is distinct from v_customer_b_id then
    raise exception 'Case 6: saved context org must be selected';
  end if;

  -- Case 7: Stale context ignored by read-path (row not deleted/updated)
  insert into public.organization_user_context (user_id, organization_id, updated_at)
  values (v_stale_user_id, v_platform_customer_id, now() - interval '1 day')
  on conflict (user_id) do update
    set organization_id = excluded.organization_id, updated_at = excluded.updated_at;

  perform set_config('request.jwt.claim.sub', v_auth_stale::text, true);
  select organization_id into v_context_before
  from public.organization_user_context
  where user_id = v_stale_user_id;

  v_res := public._app_resolve_customer_tenant_for_auth();
  if v_res->>'resolution_state' <> 'selection_required' then
    raise exception 'Case 7: stale context with two eligible orgs must yield selection_required, got %',
      v_res->>'resolution_state';
  end if;
  perform public.get_app_organization_context();

  select organization_id into v_context_after
  from public.organization_user_context
  where user_id = v_stale_user_id;
  if v_context_after is distinct from v_context_before then
    raise exception 'Case 7: read-path must not modify stale organization_user_context';
  end if;

  -- Case 8: invited, suspended, removed memberships are not eligible
  perform set_config('request.jwt.claim.sub', v_auth_status::text, true);
  v_res := public._app_resolve_customer_tenant_for_auth();
  if coalesce((v_res->>'eligible_organization_count')::int, -1) <> 0 then
    raise exception 'Case 8: non-active memberships must not be eligible, count=%',
      v_res->>'eligible_organization_count';
  end if;
  v_eligible := public.get_app_eligible_organizations();
  if coalesce(jsonb_array_length(v_eligible), 0) <> 0 then
    raise exception 'Case 8: eligible listing must exclude invited/suspended/removed memberships';
  end if;

  -- Case 9: switch_app_organization behavior
  perform set_config('request.jwt.claim.sub', v_auth_switch::text, true);
  delete from public.organization_user_context where user_id = v_switch_user_id;

  perform public.switch_app_organization(v_customer_b_id);
  select organization_id into v_context_after
  from public.organization_user_context
  where user_id = v_switch_user_id;
  if v_context_after is distinct from v_customer_b_id then
    raise exception 'Case 9: switch must persist eligible organization context';
  end if;

  begin
    perform public.switch_app_organization(v_platform_customer_id);
    raise exception 'Case 9: switch must reject platform org';
  exception
    when others then
      if sqlerrm not ilike '%Access denied for organization%' then
        raise exception 'Case 9: unexpected platform switch error: %', sqlerrm;
      end if;
  end;

  begin
    perform public.switch_app_organization(gen_random_uuid());
    raise exception 'Case 9: switch must reject org without membership';
  exception
    when others then
      if sqlerrm not ilike '%Access denied for organization%' then
        raise exception 'Case 9: unexpected non-member switch error: %', sqlerrm;
      end if;
  end;

  select organization_id into v_context_before
  from public.organization_user_context
  where user_id = v_switch_user_id;
  begin
    perform public.switch_app_organization(gen_random_uuid());
    raise exception 'Case 9: invalid switch must not succeed';
  exception
    when others then
      null;
  end;
  select organization_id into v_context_after
  from public.organization_user_context
  where user_id = v_switch_user_id;
  if v_context_after is distinct from v_context_before then
    raise exception 'Case 9: invalid switch must not alter existing context';
  end if;

  -- Case 10: _app_active_organization_id_for_auth matrix (membership_missing via no-membership user)
  perform set_config('request.jwt.claim.sub', v_auth_no_membership::text, true);
  if public._app_active_organization_id_for_auth() is not null then
    raise exception 'Case 10: membership_missing user must resolve null active org';
  end if;

  perform set_config('request.jwt.claim.sub', v_auth_single::text, true);
  if public._app_active_organization_id_for_auth() is distinct from v_customer_a_id then
    raise exception 'Case 10: single eligible tenant must resolve customer org';
  end if;

  perform set_config('request.jwt.claim.sub', v_auth_multi::text, true);
  delete from public.organization_user_context where user_id = v_multi_user_id;
  if public._app_active_organization_id_for_auth() is not null then
    raise exception 'Case 10: selection_required must resolve null active org';
  end if;

  -- Case 11: generic MTA functions remain callable (existence-only; behavior not asserted here)
  perform set_config('request.jwt.claim.sub', v_auth_single::text, true);
  if public.get_user_organizations() is null then
    raise exception 'Case 11: get_user_organizations() must remain available';
  end if;
  if public.get_current_organization() is null then
    raise exception 'Case 11: get_current_organization() must remain available';
  end if;
  if public._mta_membership_active(v_customer_a_id, v_single_user_id) is null then
    raise exception 'Case 11: _mta_membership_active() must remain available';
  end if;

  raise notice 'APP tenant boundary behavior: PASS';
exception
  when others then
    raise exception 'APP tenant boundary behavior: FAIL — %', sqlerrm;
end;
$$;

rollback;
