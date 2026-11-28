-- =============================================================================
-- NOT_APPLIED — STAGING-ONLY Unified Seller Bridge E2E harness + cleanup
-- Target: auedugihkduoaikfusqe ONLY. Never Production.
-- Creates disposable synthetic CSP seller, bridges once, asserts matrix, cleans up.
-- Prerequisite: bridge SQL APPLIED + deps shim APPLIED on Staging.
-- =============================================================================
-- Job: AIPIFY_UNIFIED_SELLER_BRIDGE_STAGING_E2E_PREFLIGHT / HARNESS
-- Marker email domain: @example.com (reserved). Fixture display_name prefix: USB-E2E
-- =============================================================================

create or replace function public._usb_staging_e2e_cleanup(p_marker text default 'USB-E2E')
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_partner_ids uuid[];
  v_auth_ids uuid[];
  v_profile_ids uuid[];
  v_org_ids uuid[];
  v_company_ids uuid[];
  v_n int := 0;
begin
  select coalesce(array_agg(id), '{}'::uuid[]) into v_partner_ids
  from public.csp_partner_profiles
  where display_name like p_marker || '%';

  select coalesce(array_agg(auth_user_id), '{}'::uuid[]) into v_auth_ids
  from public.csp_partner_profiles
  where id = any(v_partner_ids);

  select coalesce(array_agg(id), '{}'::uuid[]) into v_profile_ids
  from public.growth_partner_app_profiles
  where auth_user_id = any(v_auth_ids)
     or coalesce(profile_metadata->>'e2e_marker','') = p_marker;

  select coalesce(array_agg(organization_id), '{}'::uuid[]) into v_org_ids
  from public.growth_partner_app_profiles
  where id = any(v_profile_ids);

  delete from public.growth_partner_ops_leads where profile_id = any(v_profile_ids);
  get diagnostics v_n = row_count;
  delete from public.growth_partner_link_audit where profile_id = any(v_profile_ids);
  delete from public.growth_partner_app_audit where profile_id = any(v_profile_ids);
  delete from public.growth_partner_tracking_links where profile_id = any(v_profile_ids);
  delete from public.growth_partner_app_profiles where id = any(v_profile_ids);

  delete from public.organization_users where organization_id = any(v_org_ids);
  delete from public.organizations where id = any(v_org_ids);
  delete from public.customers where id = any(v_org_ids);

  select coalesce(array_agg(distinct company_id), '{}'::uuid[]) into v_company_ids
  from public.users
  where auth_user_id = any(v_auth_ids)
    and company_id is not null
    and exists (
      select 1 from public.companies c
      where c.id = users.company_id and c.slug like '%-gp%'
    );

  -- Only delete users created for this harness (email @example.com + marker partners).
  delete from public.users where auth_user_id = any(v_auth_ids);
  delete from public.companies where id = any(v_company_ids) and slug like '%-gp%';

  delete from public.csp_attribution_events
  where link_id in (select id from public.csp_attribution_links where partner_id = any(v_partner_ids));
  delete from public.csp_attribution_links where partner_id = any(v_partner_ids);
  delete from public.csp_product_certifications where partner_id = any(v_partner_ids);
  delete from public.csp_partner_profiles where id = any(v_partner_ids);

  delete from public.platform_admins
  where auth_user_id in (
    select id from auth.users where email like 'usb-e2e-admin-%@example.com'
  );
  delete from auth.users
  where email like 'usb-e2e-%@example.com';

  return jsonb_build_object(
    'ok', true,
    'cleaned_partners', coalesce(array_length(v_partner_ids, 1), 0),
    'cleaned_profiles', coalesce(array_length(v_profile_ids, 1), 0),
    'leads_deleted', v_n
  );
end;
$$;

revoke all on function public._usb_staging_e2e_cleanup(text) from public, anon, authenticated;
-- Callable by postgres / service during approved Staging ops only.

create or replace function public._usb_staging_e2e_verify()
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_results jsonb := '[]'::jsonb;
  v_marker text := 'USB-E2E';
  v_admin uuid := gen_random_uuid();
  v_seller uuid := gen_random_uuid();
  v_pwd text := extensions.crypt('usb-e2e-fixture-x', extensions.gen_salt('bf'));
  v_inst uuid := '00000000-0000-0000-0000-000000000000';
  v_partner_id uuid;
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
  v_sync jsonb;
  v_links jsonb;
  v_resolve jsonb;
  v_slug text;
  v_link_status text;
  v_partner_status text;
  v_ok boolean;
  v_profile_id uuid;
  v_org_count_before int;
  v_org_count_after int;
  v_cleanup jsonb;
begin
  -- Preconditions
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

  -- Baseline fingerprints BEFORE fixture rows exist (non-fixture universe).
  select md5(coalesce(string_agg(id::text || ':' || code || ':' || active::text, '|' order by id::text), ''))
    into v_attr_before from public.csp_attribution_links;
  select md5(coalesce(string_agg(id::text, '|' order by id::text), ''))
    into v_comm_before from public.csp_commission_ledger;
  select count(*)::int into v_qs_before from public.csp_qualified_sales;
  select count(*)::int into v_org_count_before from public.organizations;

  -- Disposable identities
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
    v_marker || ' Seller',
    'NO',
    'approved',
    v_marker || ' AS',
    '999999999',
    'Testveien 1',
    '+47 90000000'
  ) returning id into v_partner_id;

  insert into public.csp_product_certifications (partner_id, product_id, status, score, passed_at)
  values (v_partner_id, v_prod, 'passed', 100, now())
  on conflict (partner_id, product_id) do update
    set status = 'passed', score = 100, passed_at = now();

  insert into public.csp_attribution_links (partner_id, code, channel_origin, active)
  values (v_partner_id, v_code, 'referral_link', true);

  -- Act as platform admin
  perform set_config('request.jwt.claim.sub', v_admin::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_admin::text, 'role', 'authenticated')::text, true);

  v_ensure1 := public.ensure_growth_partner_app_profile_for_csp_partner(v_partner_id);
  v_ok := coalesce((v_ensure1->>'ok')::boolean, false)
      and coalesce((v_ensure1->>'created')::boolean, false)
      and coalesce(v_ensure1->>'partner_status', '') = 'certified'
      and coalesce((v_ensure1->>'link_active')::boolean, false) = true;
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','ensure_create_certified','ok',v_ok,'r',v_ensure1));
  v_profile_id := nullif(v_ensure1->>'profile_id', '')::uuid;
  v_slug := v_ensure1->>'primary_link_slug';

  -- Tag metadata for cleanup safety
  update public.growth_partner_app_profiles
  set profile_metadata = coalesce(profile_metadata, '{}'::jsonb) || jsonb_build_object('e2e_marker', v_marker)
  where id = v_profile_id;

  -- Idempotence
  v_ensure2 := public.ensure_growth_partner_app_profile_for_csp_partner(v_partner_id);
  v_ok := coalesce((v_ensure2->>'ok')::boolean, false)
      and coalesce((v_ensure2->>'created')::boolean, true) = false
      and coalesce(v_ensure2->>'profile_id','') = coalesce(v_ensure1->>'profile_id','');
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','ensure_idempotent','ok',v_ok,'r',v_ensure2));

  -- 1:1 auth
  v_ok := (
    select count(*) = 1 from public.growth_partner_app_profiles where auth_user_id = v_seller
  );
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','one_to_one_auth','ok',v_ok));

  -- Public resolve / personal slug
  v_resolve := public.resolve_growth_partner_public_link(v_slug);
  v_ok := coalesce((v_resolve->>'found')::boolean, false) = true;
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','public_slug_published','ok',v_ok,'slug',v_slug,'r',v_resolve));

  -- Own links as seller
  perform set_config('request.jwt.claim.sub', v_seller::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_seller::text, 'role', 'authenticated')::text, true);
  v_links := public.get_own_unified_seller_sales_links();
  v_ok := coalesce((v_links->>'ok')::boolean, false)
      and coalesce(v_links->>'personal_sales_path','') = '/s/' || v_slug
      and jsonb_typeof(v_links->'csp_attribution_links') = 'array';
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','own_links_crm_ready','ok',v_ok,'r',v_links));

  -- CRM list access (certified profile)
  begin
    perform public.list_own_personal_sales_page_interests();
    v_ok := true;
  exception when others then
    v_ok := false;
  end;
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','list_own_interests_callable','ok',v_ok));

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

  -- History preserved (profile + link rows still exist)
  v_ok := exists (select 1 from public.growth_partner_app_profiles where id = v_profile_id)
      and exists (select 1 from public.growth_partner_tracking_links where profile_id = v_profile_id);
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','history_preserved_after_suspend','ok',v_ok));

  -- Public page closed after suspend
  v_resolve := public.resolve_growth_partner_public_link(v_slug);
  v_ok := coalesce((v_resolve->>'found')::boolean, true) = false;
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','public_slug_closed_after_suspend','ok',v_ok,'r',v_resolve));

  -- Non-fixture CSP attribution unchanged (exclude fixture partner rows).
  select md5(coalesce(string_agg(id::text || ':' || code || ':' || active::text, '|' order by id::text), ''))
    into v_attr_after
  from public.csp_attribution_links
  where partner_id is distinct from v_partner_id;

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

  -- Org growth is only the dedicated fixture org (+0 or +1 net after cleanup). During run, org count may increase by 1.
  v_ok := v_org_count_after = v_org_count_before + 1;
  v_results := v_results || jsonb_build_array(jsonb_build_object(
    't','only_dedicated_org_added','ok',v_ok,
    'orgs_before', v_org_count_before, 'orgs_after', v_org_count_after
  ));

  -- Cleanup
  v_cleanup := public._usb_staging_e2e_cleanup(v_marker);
  select count(*)::int into v_org_count_after from public.organizations;
  v_ok := coalesce((v_cleanup->>'ok')::boolean, false)
      and v_org_count_after = v_org_count_before
      and not exists (select 1 from public.csp_partner_profiles where display_name like v_marker || '%')
      and not exists (select 1 from public.growth_partner_app_profiles where coalesce(profile_metadata->>'e2e_marker','') = v_marker);
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','cleanup_complete','ok',v_ok,'r',v_cleanup));

  return jsonb_build_object(
    'ok', not exists (select 1 from jsonb_array_elements(v_results) e where coalesce((e->>'ok')::boolean, false) = false),
    'marker', v_marker,
    'results', v_results
  );
exception when others then
  begin
    perform public._usb_staging_e2e_cleanup('USB-E2E');
  exception when others then
    null;
  end;
  return jsonb_build_object('ok', false, 'error', sqlerrm, 'results', v_results);
end;
$$;

revoke all on function public._usb_staging_e2e_verify() from public, anon, authenticated;

comment on function public._usb_staging_e2e_verify() is
  'STAGING-ONLY disposable Unified Seller Bridge E2E. Create → assert → cleanup. Never Production.';
comment on function public._usb_staging_e2e_cleanup(text) is
  'STAGING-ONLY cleanup for USB-E2E synthetic sellers/profiles.';
