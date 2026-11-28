-- =============================================================================
-- NOT_APPLIED — STAGING-ONLY Unified Seller Bridge E2E harness + ID-scoped cleanup
-- Target: auedugihkduoaikfusqe ONLY. Never Production.
-- Creates one disposable CSP seller, bridges once, asserts matrix, cleans exact IDs.
-- Prerequisite: bridge SQL APPLIED + deps shim APPLIED on Staging.
-- =============================================================================
-- Job: AIPIFY_UNIFIED_SELLER_BRIDGE_STAGING_E2E_SAFETY_PATCH / HARNESS
-- Cleanup rule: delete ONLY exact UUIDs created by the current verify() run.
-- No DELETE by display_name, email prefix, or slug pattern.
-- =============================================================================

-- Drop previous marker-based cleanup overload if present (unsafe pattern removed).
drop function if exists public._usb_staging_e2e_cleanup(text);

create or replace function public._usb_staging_e2e_cleanup(
  p_partner_id uuid,
  p_admin_auth_id uuid,
  p_seller_auth_id uuid,
  p_profile_id uuid default null,
  p_org_id uuid default null,
  p_company_id uuid default null,
  p_user_id uuid default null,
  p_attr_link_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_deleted jsonb := '{}'::jsonb;
  v_n int;
begin
  -- Hard guard: refuse empty partner/auth IDs (would otherwise no-op silently).
  if p_partner_id is null or p_admin_auth_id is null or p_seller_auth_id is null then
    return jsonb_build_object('ok', false, 'error', 'exact_ids_required');
  end if;

  -- GP child rows by exact profile_id only
  if p_profile_id is not null then
    delete from public.growth_partner_ops_leads where profile_id = p_profile_id;
    get diagnostics v_n = row_count;
    v_deleted := v_deleted || jsonb_build_object('ops_leads', v_n);

    delete from public.growth_partner_link_audit where profile_id = p_profile_id;
    delete from public.growth_partner_app_audit where profile_id = p_profile_id;
    delete from public.growth_partner_tracking_links where profile_id = p_profile_id;
    delete from public.growth_partner_app_profiles where id = p_profile_id;
  end if;

  -- Dedicated org / customer / company / users by exact IDs only
  if p_org_id is not null then
    delete from public.organization_users where organization_id = p_org_id;
    if p_user_id is not null then
      delete from public.organization_users where user_id = p_user_id;
    end if;
    delete from public.organizations where id = p_org_id;
    delete from public.customers where id = p_org_id;
  end if;

  if p_user_id is not null then
    delete from public.users where id = p_user_id and auth_user_id = p_seller_auth_id;
  end if;

  if p_company_id is not null then
    -- Only if no remaining users point at this company (fixture company).
    if not exists (select 1 from public.users u where u.company_id = p_company_id) then
      delete from public.companies where id = p_company_id;
    end if;
  end if;

  -- CSP fixture rows by exact partner / link IDs
  if p_attr_link_id is not null then
    delete from public.csp_attribution_events where link_id = p_attr_link_id;
    delete from public.csp_attribution_links where id = p_attr_link_id and partner_id = p_partner_id;
  else
    delete from public.csp_attribution_events
    where link_id in (
      select id from public.csp_attribution_links where partner_id = p_partner_id
    );
    delete from public.csp_attribution_links where partner_id = p_partner_id;
  end if;

  delete from public.csp_product_certifications where partner_id = p_partner_id;
  delete from public.csp_partner_profiles where id = p_partner_id;

  -- Auth + platform admin by exact auth UUIDs only
  delete from public.platform_admins where auth_user_id = p_admin_auth_id;
  delete from auth.users where id = p_admin_auth_id;
  delete from auth.users where id = p_seller_auth_id;

  return jsonb_build_object(
    'ok', true,
    'partner_id', p_partner_id,
    'profile_id', p_profile_id,
    'org_id', p_org_id,
    'company_id', p_company_id,
    'deleted', v_deleted
  );
end;
$$;

revoke all on function public._usb_staging_e2e_cleanup(
  uuid, uuid, uuid, uuid, uuid, uuid, uuid, uuid
) from public, anon, authenticated;

create or replace function public._usb_staging_e2e_verify()
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_results jsonb := '[]'::jsonb;
  v_admin uuid := gen_random_uuid();
  v_seller uuid := gen_random_uuid();
  v_pwd text := extensions.crypt('usb-e2e-fixture-x', extensions.gen_salt('bf'));
  v_inst uuid := '00000000-0000-0000-0000-000000000000';
  v_partner_id uuid;
  v_attr_link_id uuid;
  v_prod uuid;
  v_code text := 'csp-usb' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 9);
  v_attr_before text;
  v_attr_after text;
  v_comm_before text;
  v_comm_after text;
  v_qs_before int;
  v_qs_after int;
  v_ensure1 jsonb;
  v_ensure2 jsonb;
  v_links jsonb;
  v_crm jsonb;
  v_resolve jsonb;
  v_slug text;
  v_link_status text;
  v_partner_status text;
  v_ok boolean;
  v_profile_id uuid;
  v_org_id uuid;
  v_company_id uuid;
  v_user_id uuid;
  v_org_count_before int;
  v_org_count_after int;
  v_cleanup jsonb;
  v_pass boolean;
begin
  if to_regprocedure('public.ensure_growth_partner_app_profile_for_csp_partner(uuid)') is null then
    return jsonb_build_object('ok', false, 'error', 'bridge_rpc_missing');
  end if;
  if to_regprocedure('public.provision_growth_partner_tracking_link(uuid)') is null then
    return jsonb_build_object('ok', false, 'error', 'deps_shim_missing');
  end if;

  select id into v_prod from public.csp_sales_products where product_key = 'kompis_web' limit 1;
  if v_prod is null then
    return jsonb_build_object('ok', false, 'error', 'kompis_web_missing');
  end if;

  -- Baseline BEFORE any fixture rows
  select md5(coalesce(string_agg(id::text || ':' || code || ':' || active::text, '|' order by id::text), ''))
    into v_attr_before from public.csp_attribution_links;
  select md5(coalesce(string_agg(id::text, '|' order by id::text), ''))
    into v_comm_before from public.csp_commission_ledger;
  select count(*)::int into v_qs_before from public.csp_qualified_sales;
  select count(*)::int into v_org_count_before from public.organizations;

  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_app_meta_data, raw_user_meta_data
  ) values
    (v_inst, v_admin, 'authenticated', 'authenticated',
     'usb-e2e-admin-' || v_admin::text || '@example.com', v_pwd, now(), now(), now(), '{}'::jsonb, '{}'::jsonb),
    (v_inst, v_seller, 'authenticated', 'authenticated',
     'usb-e2e-seller-' || v_seller::text || '@example.com', v_pwd, now(), now(), now(), '{}'::jsonb, '{}'::jsonb);

  insert into public.platform_admins (auth_user_id, role, status)
  values (v_admin, 'platform_support', 'active')
  on conflict (auth_user_id) do nothing;

  insert into public.csp_partner_profiles (
    auth_user_id, display_name, country, status, legal_business_name, business_registration_number, business_address, phone
  ) values (
    v_seller,
    'USB-E2E Seller',
    'NO',
    'approved',
    'USB-E2E AS',
    '999999999',
    'Testveien 1',
    '+47 90000000'
  ) returning id into v_partner_id;

  insert into public.csp_product_certifications (partner_id, product_id, status, score, passed_at)
  values (v_partner_id, v_prod, 'passed', 100, now())
  on conflict (partner_id, product_id) do update
    set status = 'passed', score = 100, passed_at = now();

  insert into public.csp_attribution_links (partner_id, code, channel_origin, active)
  values (v_partner_id, v_code, 'referral_link', true)
  returning id into v_attr_link_id;

  perform set_config('request.jwt.claim.sub', v_admin::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_admin::text, 'role', 'authenticated')::text, true);

  v_ensure1 := public.ensure_growth_partner_app_profile_for_csp_partner(v_partner_id);
  v_ok := coalesce((v_ensure1->>'ok')::boolean, false)
      and coalesce((v_ensure1->>'created')::boolean, false)
      and coalesce(v_ensure1->>'partner_status', '') = 'certified'
      and coalesce((v_ensure1->>'link_active')::boolean, false) = true;
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','ensure_create_certified','ok',v_ok,'r',v_ensure1));

  v_profile_id := nullif(v_ensure1->>'profile_id', '')::uuid;
  v_org_id := nullif(v_ensure1->>'organization_id', '')::uuid;
  v_slug := v_ensure1->>'primary_link_slug';

  if v_profile_id is not null then
    select user_id, organization_id into v_user_id, v_org_id
    from public.growth_partner_app_profiles
    where id = v_profile_id;
  end if;
  if v_user_id is not null then
    select company_id into v_company_id from public.users where id = v_user_id;
  end if;
  if v_org_id is not null and v_company_id is null then
    select company_id into v_company_id from public.customers where id = v_org_id;
  end if;

  -- Idempotence
  v_ensure2 := public.ensure_growth_partner_app_profile_for_csp_partner(v_partner_id);
  v_ok := coalesce((v_ensure2->>'ok')::boolean, false)
      and coalesce((v_ensure2->>'created')::boolean, true) = false
      and coalesce(v_ensure2->>'profile_id','') = coalesce(v_ensure1->>'profile_id','');
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','ensure_idempotent','ok',v_ok,'r',v_ensure2));

  -- 1:1 auth
  v_ok := (
    select count(*) = 1 from public.growth_partner_app_profiles where auth_user_id = v_seller
  ) and v_profile_id is not null;
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','one_to_one_auth','ok',v_ok));

  -- Public resolve / personal slug
  v_resolve := public.resolve_growth_partner_public_link(v_slug);
  v_ok := coalesce((v_resolve->>'found')::boolean, false) = true
      and coalesce(v_resolve->>'profile_id','') = coalesce(v_profile_id::text,'');
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','public_slug_published','ok',v_ok,'slug',v_slug,'r',v_resolve));

  -- Own links as seller
  perform set_config('request.jwt.claim.sub', v_seller::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_seller::text, 'role', 'authenticated')::text, true);
  v_links := public.get_own_unified_seller_sales_links();
  v_ok := coalesce((v_links->>'ok')::boolean, false)
      and coalesce(v_links->>'personal_sales_path','') = '/s/' || v_slug
      and coalesce(v_links->>'growth_partner_profile_id','') = coalesce(v_profile_id::text,'')
      and jsonb_typeof(v_links->'csp_attribution_links') = 'array';
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','own_links_crm_ready','ok',v_ok,'r',v_links));

  -- CRM list: must return ok=true for this certified seller (not merely "callable")
  v_crm := public.list_own_personal_sales_page_interests();
  v_ok := coalesce((v_crm->>'ok')::boolean, false) = true
      and jsonb_typeof(v_crm->'interests') = 'array'
      and exists (
        select 1 from public.growth_partner_app_profiles gp
        where gp.id = v_profile_id
          and gp.auth_user_id = v_seller
          and gp.partner_status = 'certified'
      );
  v_results := v_results || jsonb_build_array(jsonb_build_object(
    't','list_own_interests_ok_for_seller','ok',v_ok,'r',v_crm
  ));

  -- Suspend via platform admin
  perform set_config('request.jwt.claim.sub', v_admin::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_admin::text, 'role', 'authenticated')::text, true);
  perform public.csp_set_partner_status(v_partner_id, 'suspended', 'USB-E2E suspend check');

  select partner_status into v_partner_status from public.growth_partner_app_profiles where id = v_profile_id;
  select link_status into v_link_status
  from public.growth_partner_tracking_links where profile_id = v_profile_id and is_primary = true;

  v_ok := v_partner_status = 'suspended' and v_link_status = 'disabled';
  v_results := v_results || jsonb_build_array(jsonb_build_object(
    't','suspend_disables_personal_links','ok',v_ok,
    'partner_status', v_partner_status, 'link_status', v_link_status
  ));

  v_ok := exists (select 1 from public.growth_partner_app_profiles where id = v_profile_id)
      and exists (select 1 from public.growth_partner_tracking_links where profile_id = v_profile_id);
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','history_preserved_after_suspend','ok',v_ok));

  v_resolve := public.resolve_growth_partner_public_link(v_slug);
  v_ok := coalesce((v_resolve->>'found')::boolean, true) = false;
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','public_slug_closed_after_suspend','ok',v_ok,'r',v_resolve));

  -- Non-fixture CSP attribution unchanged during run
  select md5(coalesce(string_agg(id::text || ':' || code || ':' || active::text, '|' order by id::text), ''))
    into v_attr_after
  from public.csp_attribution_links
  where id is distinct from v_attr_link_id;

  select md5(coalesce(string_agg(id::text, '|' order by id::text), ''))
    into v_comm_after from public.csp_commission_ledger;
  select count(*)::int into v_qs_after from public.csp_qualified_sales;
  select count(*)::int into v_org_count_after from public.organizations;

  v_ok := v_attr_before = v_attr_after;
  v_results := v_results || jsonb_build_array(jsonb_build_object(
    't','non_fixture_csp_attribution_unchanged','ok',v_ok,
    'before', v_attr_before, 'after', v_attr_after
  ));

  v_ok := v_comm_before = v_comm_after and v_qs_before = v_qs_after;
  v_results := v_results || jsonb_build_array(jsonb_build_object(
    't','commission_and_qualified_sales_unchanged','ok',v_ok,
    'commission_before', v_comm_before, 'commission_after', v_comm_after,
    'qs_before', v_qs_before, 'qs_after', v_qs_after
  ));

  v_ok := v_org_count_after = v_org_count_before + 1;
  v_results := v_results || jsonb_build_array(jsonb_build_object(
    't','only_dedicated_org_added','ok',v_ok,
    'orgs_before', v_org_count_before, 'orgs_after', v_org_count_after
  ));

  -- Exact-ID cleanup (PASS path)
  v_cleanup := public._usb_staging_e2e_cleanup(
    v_partner_id, v_admin, v_seller, v_profile_id, v_org_id, v_company_id, v_user_id, v_attr_link_id
  );

  select count(*)::int into v_org_count_after from public.organizations;
  select md5(coalesce(string_agg(id::text || ':' || code || ':' || active::text, '|' order by id::text), ''))
    into v_attr_after from public.csp_attribution_links;
  select md5(coalesce(string_agg(id::text, '|' order by id::text), ''))
    into v_comm_after from public.csp_commission_ledger;
  select count(*)::int into v_qs_after from public.csp_qualified_sales;

  v_ok := coalesce((v_cleanup->>'ok')::boolean, false)
      and v_org_count_after = v_org_count_before
      and v_attr_after = v_attr_before
      and v_comm_after = v_comm_before
      and v_qs_after = v_qs_before
      and not exists (select 1 from public.csp_partner_profiles where id = v_partner_id)
      and (v_profile_id is null or not exists (select 1 from public.growth_partner_app_profiles where id = v_profile_id))
      and (v_org_id is null or not exists (select 1 from public.organizations where id = v_org_id))
      and (v_company_id is null or not exists (select 1 from public.companies where id = v_company_id))
      and (v_user_id is null or not exists (select 1 from public.users where id = v_user_id))
      and not exists (select 1 from auth.users where id = v_admin)
      and not exists (select 1 from auth.users where id = v_seller)
      and not exists (select 1 from public.platform_admins where auth_user_id = v_admin);
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','cleanup_exact_ids_complete','ok',v_ok,'r',v_cleanup));

  v_pass := not exists (
    select 1 from jsonb_array_elements(v_results) e where coalesce((e->>'ok')::boolean, false) = false
  );

  return jsonb_build_object(
    'ok', v_pass,
    'fixture_ids', jsonb_build_object(
      'partner_id', v_partner_id,
      'admin_auth_id', v_admin,
      'seller_auth_id', v_seller,
      'profile_id', v_profile_id,
      'org_id', v_org_id,
      'company_id', v_company_id,
      'user_id', v_user_id,
      'attr_link_id', v_attr_link_id
    ),
    'results', v_results
  );
exception when others then
  -- Failure path: remove exact IDs from this run; never leave partial fixture accounts.
  begin
    if v_partner_id is not null then
      perform public._usb_staging_e2e_cleanup(
        v_partner_id, v_admin, v_seller, v_profile_id, v_org_id, v_company_id, v_user_id, v_attr_link_id
      );
    else
      -- Pre-partner failure: still delete this run's exact auth/admin rows only.
      delete from public.platform_admins where auth_user_id = v_admin;
      delete from auth.users where id = v_admin;
      delete from auth.users where id = v_seller;
    end if;
  exception when others then
    null;
  end;
  return jsonb_build_object(
    'ok', false,
    'error', sqlerrm,
    'fixture_ids', jsonb_build_object(
      'partner_id', v_partner_id,
      'admin_auth_id', v_admin,
      'seller_auth_id', v_seller,
      'profile_id', v_profile_id,
      'org_id', v_org_id,
      'company_id', v_company_id,
      'user_id', v_user_id,
      'attr_link_id', v_attr_link_id
    ),
    'results', v_results
  );
end;
$$;

revoke all on function public._usb_staging_e2e_verify() from public, anon, authenticated;

comment on function public._usb_staging_e2e_verify() is
  'STAGING-ONLY disposable Unified Seller Bridge E2E. Create → assert → exact-ID cleanup. Never Production.';
comment on function public._usb_staging_e2e_cleanup(uuid, uuid, uuid, uuid, uuid, uuid, uuid, uuid) is
  'STAGING-ONLY exact-ID cleanup for one USB-E2E verify() run. No name/email/slug deletes.';
