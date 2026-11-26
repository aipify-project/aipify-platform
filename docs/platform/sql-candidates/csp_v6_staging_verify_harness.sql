-- DISPOSABLE Staging harness for CSP V6 capture/attribution/commission.
-- Project: auedugihkduoaikfusqe only. Never Production.

create or replace function public._csp_v6_staging_verify()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_results jsonb := '[]'::jsonb;
  v_a uuid := gen_random_uuid();
  v_b uuid := gen_random_uuid();
  v_s uuid := gen_random_uuid();
  v_cust uuid := gen_random_uuid();
  v_org1 uuid := gen_random_uuid();
  v_org2 uuid := gen_random_uuid();
  v_pa uuid;
  v_pb uuid;
  v_ps uuid;
  v_code_a text := 'csp-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
  v_code_b text := 'csp-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
  v_code_s text := 'csp-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
  v_prod uuid;
  v_sess text := replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');
  v_sess2 text := replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');
  v_r jsonb;
  v_ok boolean;
  v_pwd text := extensions.crypt('v6-fixture-x', extensions.gen_salt('bf'));
  v_inst uuid := '00000000-0000-0000-0000-000000000000';
  v_events_before int;
  v_events_after int;
begin
  select id into v_prod from public.csp_sales_products where product_key = 'kompis_web' and published limit 1;
  if v_prod is null then
    return jsonb_build_object('ok', false, 'error', 'kompis_web_missing');
  end if;

  insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
  values
    (v_inst, v_a, 'authenticated', 'authenticated', 'csp-v6-a-' || v_a::text || '@example.com', v_pwd, now(), now(), now(), '{}'::jsonb, '{}'::jsonb),
    (v_inst, v_b, 'authenticated', 'authenticated', 'csp-v6-b-' || v_b::text || '@example.com', v_pwd, now(), now(), now(), '{}'::jsonb, '{}'::jsonb),
    (v_inst, v_s, 'authenticated', 'authenticated', 'csp-v6-s-' || v_s::text || '@example.com', v_pwd, now(), now(), now(), '{}'::jsonb, '{}'::jsonb),
    (v_inst, v_cust, 'authenticated', 'authenticated', 'csp-v6-c-' || v_cust::text || '@example.com', v_pwd, now(), now(), now(), '{}'::jsonb, '{}'::jsonb);

  insert into public.csp_partner_profiles (auth_user_id, display_name, country, status)
  values
    (v_a, 'V6 Fixture Seller A', 'NO', 'approved'),
    (v_b, 'V6 Fixture Seller B', 'SE', 'approved'),
    (v_s, 'V6 Fixture Suspended', 'NO', 'suspended');

  select id into v_pa from public.csp_partner_profiles where auth_user_id = v_a;
  select id into v_pb from public.csp_partner_profiles where auth_user_id = v_b;
  select id into v_ps from public.csp_partner_profiles where auth_user_id = v_s;

  insert into public.csp_product_certifications (partner_id, product_id, status, score, passed_at)
  values (v_pa, v_prod, 'passed', 100, now())
  on conflict (partner_id, product_id) do update set status = 'passed', score = 100, passed_at = now();

  insert into public.customers (id) values (v_org1), (v_org2);
  insert into public.organizations (id, name, slug)
  values
    (v_org1, 'CSP V6 Org 1', 'csp-v6-org1-' || substr(v_org1::text, 1, 8)),
    (v_org2, 'CSP V6 Org 2', 'csp-v6-org2-' || substr(v_org2::text, 1, 8));

  insert into public.csp_attribution_links (partner_id, code, channel_origin, active)
  values
    (v_pa, v_code_a, 'referral_link', true),
    (v_pb, v_code_b, 'referral_link', true),
    (v_ps, v_code_s, 'referral_link', true);

  -- invalid code
  v_r := public.csp_capture_public_attribution_click(jsonb_build_object(
    'code', 'bad', 'productKey', 'kompis_web', 'sessionHash', v_sess
  ));
  v_ok := (v_r->>'error') = 'invalid_link_code';
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','capture_invalid_code','ok',v_ok,'r',v_r));

  -- missing product
  v_r := public.csp_capture_public_attribution_click(jsonb_build_object(
    'code', v_code_a, 'productKey', '', 'sessionHash', v_sess
  ));
  v_ok := (v_r->>'error') = 'product_key_required';
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','capture_product_required','ok',v_ok,'r',v_r));

  -- active link success
  select count(*)::int into v_events_before from public.csp_attribution_events e
  join public.csp_attribution_links l on l.id = e.link_id where l.code = v_code_a;
  v_r := public.csp_capture_public_attribution_click(jsonb_build_object(
    'code', v_code_a, 'productKey', 'kompis_web', 'sessionHash', v_sess
  ));
  v_ok := (v_r->>'recorded')::boolean is true and (v_r->>'duplicate')::boolean is not true;
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','capture_active_ok','ok',v_ok,'r',v_r));

  -- duplicate session
  v_r := public.csp_capture_public_attribution_click(jsonb_build_object(
    'code', v_code_a, 'productKey', 'kompis_web', 'sessionHash', v_sess
  ));
  v_ok := (v_r->>'duplicate')::boolean is true and (v_r->>'recorded')::boolean is not true;
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','capture_duplicate','ok',v_ok,'r',v_r));

  select count(*)::int into v_events_after from public.csp_attribution_events e
  join public.csp_attribution_links l on l.id = e.link_id where l.code = v_code_a;
  v_ok := v_events_after = v_events_before + 1;
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','capture_events_plus_one','ok',v_ok,'before',v_events_before,'after',v_events_after));

  -- unpublished / wrong product
  v_r := public.csp_capture_public_attribution_click(jsonb_build_object(
    'code', v_code_a, 'productKey', 'aipify_voice', 'sessionHash', v_sess2
  ));
  v_ok := (v_r->>'error') in ('product_not_available', 'certification_required');
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','capture_unpublished_or_uncert','ok',v_ok,'r',v_r));

  -- partner B no cert on A product path: B link without cert
  v_r := public.csp_capture_public_attribution_click(jsonb_build_object(
    'code', v_code_b, 'productKey', 'kompis_web', 'sessionHash', replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '')
  ));
  v_ok := (v_r->>'error') = 'certification_required';
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','capture_uncertified_partner','ok',v_ok,'r',v_r));

  -- suspended partner
  v_r := public.csp_capture_public_attribution_click(jsonb_build_object(
    'code', v_code_s, 'productKey', 'kompis_web', 'sessionHash', replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '')
  ));
  v_ok := (v_r->>'error') = 'partner_not_active';
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','capture_suspended','ok',v_ok,'r',v_r));

  -- deactivate then capture blocked
  perform set_config('request.jwt.claim.sub', v_a::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_a::text, 'role', 'authenticated')::text, true);
  v_r := public.csp_deactivate_attribution_link(v_code_a);
  v_ok := (v_r->>'active')::boolean is not true;
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','deactivate_own','ok',v_ok,'r',v_r));

  v_r := public.csp_capture_public_attribution_click(jsonb_build_object(
    'code', v_code_a, 'productKey', 'kompis_web', 'sessionHash', replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '')
  ));
  v_ok := (v_r->>'error') = 'link_inactive';
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','capture_inactive_blocked','ok',v_ok,'r',v_r));

  -- recreate active link for attribution + commission (new code)
  v_code_a := 'csp-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
  insert into public.csp_attribution_links (partner_id, code, channel_origin, active)
  values (v_pa, v_code_a, 'referral_link', true);
  v_r := public.csp_capture_public_attribution_click(jsonb_build_object(
    'code', v_code_a, 'productKey', 'kompis_web', 'sessionHash', replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '')
  ));
  v_ok := (v_r->>'recorded')::boolean is true;
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','capture_new_active','ok',v_ok,'r',v_r));

  -- attribute registration (service-like via definer; set jwt)
  perform set_config('request.jwt.claim.sub', v_cust::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_cust::text, 'role', 'authenticated')::text, true);
  v_r := public.csp_attribute_customer_registration(jsonb_build_object(
    'code', v_code_a, 'customerOrgId', v_org1, 'customerAuthUserId', v_cust
  ));
  v_ok := (v_r->>'attributed')::boolean is true;
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','attribute_first_wins','ok',v_ok,'r',v_r));

  -- competing seller cannot steal org
  v_r := public.csp_attribute_customer_registration(jsonb_build_object(
    'code', v_code_b, 'customerOrgId', v_org1, 'customerAuthUserId', v_cust
  ));
  v_ok := (v_r->>'error') = 'already_attributed';
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','attribute_isolation','ok',v_ok,'r',v_r));

  -- self-referral
  v_r := public.csp_attribute_customer_registration(jsonb_build_object(
    'code', v_code_a, 'customerOrgId', v_org2, 'customerAuthUserId', v_a
  ));
  v_ok := (v_r->>'error') = 'self_referral';
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','attribute_self_referral','ok',v_ok,'r',v_r));

  -- inactive link attribution blocked
  update public.csp_attribution_links set active = false where code = v_code_b;
  v_r := public.csp_attribute_customer_registration(jsonb_build_object(
    'code', v_code_b, 'customerOrgId', v_org2, 'customerAuthUserId', v_cust
  ));
  v_ok := (v_r->>'error') = 'link_inactive';
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','attribute_inactive','ok',v_ok,'r',v_r));

  -- monthly period 1 awaiting
  perform set_config('request.jwt.claim.sub', '', true);
  perform set_config('request.jwt.claims', '{}', true);
  -- need service role path: set claim that _csp_is_service_role recognizes OR use platform admin
  -- Staging harness uses JWT role service_role if helper checks request.jwt.claim.role
  perform set_config('request.jwt.claim.role', 'service_role', true);
  perform set_config('request.jwt.claims', json_build_object('role', 'service_role')::text, true);

  v_r := public.csp_apply_paid_period_event(jsonb_build_object(
    'eventId', 'v6-m1-' || v_org1::text,
    'eventType', 'paid_period',
    'customerOrgId', v_org1,
    'productKey', 'kompis_web',
    'periodOrdinal', 1,
    'billingInterval', 'monthly'
  ));
  v_ok := (v_r->>'outcome') = 'awaiting_second_payment' or (v_r->>'status') = 'registered_awaiting_second_payment';
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','monthly_p1_awaiting','ok',v_ok,'r',v_r));

  v_r := public.csp_apply_paid_period_event(jsonb_build_object(
    'eventId', 'v6-m2-' || v_org1::text,
    'eventType', 'paid_period',
    'customerOrgId', v_org1,
    'productKey', 'kompis_web',
    'periodOrdinal', 2,
    'billingInterval', 'monthly'
  ));
  v_ok := (v_r->>'outcome') = 'earned';
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','monthly_p2_earned','ok',v_ok,'r',v_r));

  v_r := public.csp_apply_paid_period_event(jsonb_build_object(
    'eventId', 'v6-m2-dup-' || v_org1::text,
    'eventType', 'paid_period',
    'customerOrgId', v_org1,
    'productKey', 'kompis_web',
    'periodOrdinal', 2,
    'billingInterval', 'monthly'
  ));
  -- second event id with same period should be renewal_no_commission after already earned
  v_ok := (v_r->>'outcome') in ('renewal_no_commission', 'duplicate_event');
  if (v_r->>'outcome') = 'renewal_no_commission' then
    v_ok := true;
  elsif (select count(*) from public.csp_commission_ledger l
         join public.csp_qualified_sales s on s.id = l.qualified_sale_id
         where s.customer_org_id = v_org1 and l.entry_type = 'earned') = 1 then
    v_ok := true;
  end if;
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','monthly_no_double','ok',v_ok,'r',v_r));

  v_r := public.csp_apply_paid_period_event(jsonb_build_object(
    'eventId', 'v6-m3-' || v_org1::text,
    'eventType', 'paid_period',
    'customerOrgId', v_org1,
    'productKey', 'kompis_web',
    'periodOrdinal', 3,
    'billingInterval', 'monthly'
  ));
  v_ok := (v_r->>'outcome') = 'renewal_no_commission';
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','monthly_p3_no_new','ok',v_ok,'r',v_r));

  -- annual path on org2: need attribution via active certified link (reactivate B with cert)
  insert into public.csp_product_certifications (partner_id, product_id, status, score, passed_at)
  values (v_pb, v_prod, 'passed', 100, now())
  on conflict (partner_id, product_id) do update set status = 'passed', score = 100, passed_at = now();
  update public.csp_attribution_links set active = true where code = v_code_b;
  v_r := public.csp_capture_public_attribution_click(jsonb_build_object(
    'code', v_code_b, 'productKey', 'kompis_web', 'sessionHash', replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '')
  ));
  perform set_config('request.jwt.claim.sub', v_cust::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_cust::text, 'role', 'authenticated')::text, true);
  v_r := public.csp_attribute_customer_registration(jsonb_build_object(
    'code', v_code_b, 'customerOrgId', v_org2, 'customerAuthUserId', v_cust
  ));
  v_ok := (v_r->>'attributed')::boolean is true;
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','attribute_org2','ok',v_ok,'r',v_r));

  perform set_config('request.jwt.claim.role', 'service_role', true);
  perform set_config('request.jwt.claims', json_build_object('role', 'service_role')::text, true);
  v_r := public.csp_apply_paid_period_event(jsonb_build_object(
    'eventId', 'v6-a1-' || v_org2::text,
    'eventType', 'paid_period',
    'customerOrgId', v_org2,
    'productKey', 'kompis_web',
    'periodOrdinal', 1,
    'billingInterval', 'annual'
  ));
  v_ok := (v_r->>'outcome') = 'earned' and (v_r->>'billing_interval') = 'annual';
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','annual_p1_earned','ok',v_ok,'r',v_r));

  -- cleanup soft
  begin
    delete from public.csp_attribution_click_dedupe where link_id in (
      select id from public.csp_attribution_links where partner_id in (v_pa, v_pb, v_ps)
    );
    delete from public.csp_partner_message_recipients where partner_id in (v_pa, v_pb, v_ps);
    update public.csp_partner_profiles
    set status = 'terminated', display_name = left(display_name || ' [v6 cleaned]', 120)
    where id in (v_pa, v_pb, v_ps);
  exception when others then
    null;
  end;

  return jsonb_build_object(
    'ok', not exists (select 1 from jsonb_array_elements(v_results) x where (x->>'ok')::boolean is not true),
    'passed', (select count(*) from jsonb_array_elements(v_results) x where (x->>'ok')::boolean is true),
    'failed', (select count(*) from jsonb_array_elements(v_results) x where (x->>'ok')::boolean is not true),
    'results', v_results
  );
end;
$$;
