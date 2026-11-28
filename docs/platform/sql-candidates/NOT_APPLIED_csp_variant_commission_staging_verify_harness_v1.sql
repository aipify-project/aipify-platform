-- NOT_APPLIED verify harness — run ONLY after owner YES Staging apply of:
--   1) csp_product_variants_billing_v1.sql
--   2) csp_variant_commission_rate_versions_v1.sql
-- Staging project: auedugihkduoaikfusqe only. Never Production.
-- Creates disposable auth/platform_admin + verify variant; cleans up after.
-- Does NOT mutate historical csp_commission_rate_versions or csp_qualified_sales.
-- Does NOT activate settlement.
--
-- APPLY_BLOCKED_UNTIL_OWNER_YES (and only after DDL candidates are applied)

create or replace function public._csp_variant_commission_staging_verify()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin uuid := gen_random_uuid();
  v_stranger uuid := gen_random_uuid();
  v_inst uuid := '00000000-0000-0000-0000-000000000000';
  v_pwd text := extensions.crypt('vc-fixture-x', extensions.gen_salt('bf'));
  v_product_id uuid;
  v_product_key text := 'kompis_web';
  v_variant_key text := '__staging_verify_variant__';
  v_eff timestamptz := timestamptz '2099-01-01 00:00:00+00';
  v_res jsonb;
  v_id uuid;
  v_legacy_rates int;
  v_legacy_sales int;
  v_legacy_rates_after int;
  v_legacy_sales_after int;
  v_forbidden_ok boolean := false;
begin
  if to_regclass('public.csp_product_variants') is null
     or to_regclass('public.csp_variant_commission_rate_versions') is null then
    return jsonb_build_object('ok', false, 'error', 'verify_blocked_missing_tables');
  end if;

  select count(*) into v_legacy_rates from public.csp_commission_rate_versions;
  select count(*) into v_legacy_sales from public.csp_qualified_sales;

  select id into v_product_id
  from public.csp_sales_products
  where product_key = v_product_key;
  if v_product_id is null then
    return jsonb_build_object('ok', false, 'error', 'verify_blocked_missing_product');
  end if;

  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data
  ) values
    (
      v_inst, v_admin, 'authenticated', 'authenticated',
      'vc-admin-' || v_admin::text || '@example.com', v_pwd,
      now(), now(), now(), '{}'::jsonb, '{}'::jsonb
    ),
    (
      v_inst, v_stranger, 'authenticated', 'authenticated',
      'vc-stranger-' || v_stranger::text || '@example.com', v_pwd,
      now(), now(), now(), '{}'::jsonb, '{}'::jsonb
    );

  insert into public.platform_admins (auth_user_id, role)
  values (v_admin, 'platform_support');

  -- Non-admin forbidden
  perform set_config('request.jwt.claim.sub', v_stranger::text, true);
  perform set_config(
    'request.jwt.claims',
    json_build_object('sub', v_stranger::text, 'role', 'authenticated')::text,
    true
  );
  begin
    perform public.upsert_csp_variant_commission_rate(
      v_product_id, v_variant_key, 'month', 'fixed', 'NOK',
      1, null, true, v_eff, null, 'forbidden'
    );
  exception
    when others then
      if sqlerrm like '%forbidden%' then
        v_forbidden_ok := true;
      else
        raise;
      end if;
  end;
  if not v_forbidden_ok then
    return jsonb_build_object('ok', false, 'error', 'verify_access_control_failed');
  end if;

  -- Platform admin JWT
  perform set_config('request.jwt.claim.sub', v_admin::text, true);
  perform set_config(
    'request.jwt.claims',
    json_build_object('sub', v_admin::text, 'role', 'authenticated')::text,
    true
  );

  v_res := public.upsert_csp_product_variant(
    v_product_key, v_variant_key, 'Staging verify', 'Staging verify',
    9999, false, false, null, null, 'none', false, '[]'::jsonb
  );
  if coalesce((v_res->>'ok')::boolean, false) is not true then
    return jsonb_build_object('ok', false, 'error', 'verify_variant_upsert_failed', 'detail', v_res);
  end if;

  v_res := public.upsert_csp_product_variant_price(
    v_product_key, v_variant_key, 'month', 'NOK',
    59900, 599.00, 'exclusive', null, null, null, false, true
  );
  if coalesce((v_res->>'ok')::boolean, false) is not true then
    return jsonb_build_object('ok', false, 'error', 'verify_price_upsert_failed', 'detail', v_res);
  end if;

  v_res := public.upsert_csp_variant_commission_rate(
    v_product_id, v_variant_key, 'month', 'fixed', 'NOK',
    42.00, null, true, v_eff, null, 'staging verify fixed'
  );
  if coalesce((v_res->>'ok')::boolean, false) is not true then
    return jsonb_build_object('ok', false, 'error', 'verify_upsert_fixed_failed', 'detail', v_res);
  end if;
  v_id := (v_res->>'id')::uuid;

  v_res := public.upsert_csp_variant_commission_rate(
    v_product_id, v_variant_key, 'month', 'fixed', 'NOK',
    42.00, null, true, v_eff, null, 'staging verify fixed'
  );
  if coalesce((v_res->>'idempotent')::boolean, false) is not true then
    return jsonb_build_object('ok', false, 'error', 'verify_idempotency_failed', 'detail', v_res);
  end if;
  if (v_res->>'id')::uuid is distinct from v_id then
    return jsonb_build_object('ok', false, 'error', 'verify_idempotency_id_changed');
  end if;

  begin
    perform public.upsert_csp_variant_commission_rate(
      v_product_id, v_variant_key, 'month', 'fixed', 'NOK',
      43.00, null, true, v_eff, null, 'should conflict'
    );
    return jsonb_build_object('ok', false, 'error', 'verify_conflict_not_raised');
  exception
    when others then
      if sqlerrm not like '%rate_version_conflict_use_new_effective_from%' then
        raise;
      end if;
  end;

  -- New effective_from creates version history (prior row unchanged)
  v_res := public.upsert_csp_variant_commission_rate(
    v_product_id, v_variant_key, 'month', 'fixed', 'NOK',
    43.00, null, true, v_eff + interval '1 second', v_id, 'staging verify v2'
  );
  if coalesce((v_res->>'ok')::boolean, false) is not true then
    return jsonb_build_object('ok', false, 'error', 'verify_version_history_failed', 'detail', v_res);
  end if;
  if not exists (
    select 1
    from public.csp_variant_commission_rate_versions
    where id = v_id and amount = 42.00
  ) then
    return jsonb_build_object('ok', false, 'error', 'verify_prior_version_mutated');
  end if;

  v_res := public.upsert_csp_variant_commission_rate(
    v_product_id, v_variant_key, 'year', 'percent', 'NOK',
    null, 10.00, true, v_eff, null, 'staging verify percent'
  );
  if coalesce((v_res->>'ok')::boolean, false) is not true then
    return jsonb_build_object('ok', false, 'error', 'verify_upsert_percent_failed', 'detail', v_res);
  end if;

  v_res := public.get_effective_csp_variant_commission(
    v_product_id, v_variant_key, 'month', v_eff + interval '1 second'
  );
  if coalesce((v_res->>'found')::boolean, false) is not true
     or (v_res->>'amount')::numeric is distinct from 43.00 then
    return jsonb_build_object('ok', false, 'error', 'verify_get_effective_failed', 'detail', v_res);
  end if;

  v_res := public.list_csp_variant_commission_rates(v_product_id);
  if jsonb_typeof(v_res) is distinct from 'array' then
    return jsonb_build_object('ok', false, 'error', 'verify_list_failed');
  end if;

  v_res := public.get_csp_product_variants_bundle(v_product_key);
  if coalesce(v_res->>'legacy_product_commission_untouched', 'false') is distinct from 'true' then
    return jsonb_build_object('ok', false, 'error', 'verify_bundle_legacy_flag_missing');
  end if;

  select count(*) into v_legacy_rates_after from public.csp_commission_rate_versions;
  select count(*) into v_legacy_sales_after from public.csp_qualified_sales;
  if v_legacy_rates_after is distinct from v_legacy_rates
     or v_legacy_sales_after is distinct from v_legacy_sales then
    return jsonb_build_object('ok', false, 'error', 'verify_legacy_history_mutated');
  end if;

  -- Cleanup disposable rows
  delete from public.csp_variant_commission_rate_versions
  where product_id = v_product_id and variant_key = v_variant_key;
  delete from public.csp_product_variant_prices
  where product_key = v_product_key and variant_key = v_variant_key;
  delete from public.csp_product_variants
  where product_key = v_product_key and variant_key = v_variant_key;
  delete from public.platform_admins where auth_user_id in (v_admin, v_stranger);
  delete from auth.users where id in (v_admin, v_stranger);

  perform set_config('request.jwt.claim.sub', '', true);
  perform set_config('request.jwt.claims', '{}', true);

  return jsonb_build_object(
    'ok', true,
    'status', 'AIPIFY_VARIANT_COMMISSION_STAGING_VERIFY_PASS',
    'legacy_rates', v_legacy_rates,
    'legacy_sales', v_legacy_sales,
    'settlement_activated', false
  );
end;
$$;

revoke all on function public._csp_variant_commission_staging_verify() from public, anon, authenticated;
grant execute on function public._csp_variant_commission_staging_verify() to service_role;

-- Operator entrypoint after DDL apply:
--   select public._csp_variant_commission_staging_verify();
-- Then:
--   drop function public._csp_variant_commission_staging_verify();
