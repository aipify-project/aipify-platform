-- DISPOSABLE Staging harness for CSP V5 closure. Create → run → drop.
-- Project: auedugihkduoaikfusqe only. Never Production.

create or replace function public._csp_v5_staging_verify()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_results jsonb := '[]'::jsonb;
  v_admin uuid := gen_random_uuid();
  v_a uuid := gen_random_uuid();
  v_b uuid := gen_random_uuid();
  v_s uuid := gen_random_uuid();
  v_org1 uuid := gen_random_uuid();
  v_org2 uuid := gen_random_uuid();
  v_pa uuid;
  v_pb uuid;
  v_ps uuid;
  v_link_a uuid;
  v_link_b uuid;
  v_code_a text := 'csp-v5a' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
  v_code_b text := 'csp-v5b' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
  v_prod uuid;
  v_mat jsonb;
  v_mat_id uuid;
  v_msg jsonb;
  v_msg_id uuid;
  v_thread uuid;
  v_list jsonb;
  v_r jsonb;
  v_click_before int;
  v_click_after int;
  v_sale jsonb;
  v_status text;
  v_ok boolean;
  v_pwd text := extensions.crypt('v5-fixture-x', extensions.gen_salt('bf'));
  v_inst uuid := '00000000-0000-0000-0000-000000000000';
begin
  select id into v_prod from public.csp_sales_products where product_key = 'kompis_web' limit 1;
  if v_prod is null then
    return jsonb_build_object('ok', false, 'error', 'kompis_web_missing');
  end if;

  insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
  values
    (v_inst, v_admin, 'authenticated', 'authenticated', 'csp-v5-admin-' || v_admin::text || '@example.com', v_pwd, now(), now(), now(), '{}'::jsonb, '{}'::jsonb),
    (v_inst, v_a, 'authenticated', 'authenticated', 'csp-v5-a-' || v_a::text || '@example.com', v_pwd, now(), now(), now(), '{}'::jsonb, '{}'::jsonb),
    (v_inst, v_b, 'authenticated', 'authenticated', 'csp-v5-b-' || v_b::text || '@example.com', v_pwd, now(), now(), now(), '{}'::jsonb, '{}'::jsonb),
    (v_inst, v_s, 'authenticated', 'authenticated', 'csp-v5-s-' || v_s::text || '@example.com', v_pwd, now(), now(), now(), '{}'::jsonb, '{}'::jsonb);

  insert into public.platform_admins (auth_user_id, role) values (v_admin, 'platform_support');

  insert into public.csp_partner_profiles (auth_user_id, display_name, country, status)
  values
    (v_a, 'V5 Fixture Seller A', 'NO', 'approved'),
    (v_b, 'V5 Fixture Seller B', 'SE', 'approved'),
    (v_s, 'V5 Fixture Suspended', 'NO', 'suspended');

  select id into v_pa from public.csp_partner_profiles where auth_user_id = v_a;
  select id into v_pb from public.csp_partner_profiles where auth_user_id = v_b;
  select id into v_ps from public.csp_partner_profiles where auth_user_id = v_s;

  insert into public.customers (id) values (v_org1), (v_org2);
  insert into public.organizations (id, name, slug)
  values
    (v_org1, 'CSP V5 Org 1', 'csp-v5-org1-' || substr(v_org1::text, 1, 8)),
    (v_org2, 'CSP V5 Org 2', 'csp-v5-org2-' || substr(v_org2::text, 1, 8));

  insert into public.csp_attribution_links (partner_id, code, channel_origin, active)
  values
    (v_pa, v_code_a, 'referral_link', true),
    (v_pb, v_code_b, 'referral_link', true);

  select id into v_link_a from public.csp_attribution_links where code = v_code_a;
  select id into v_link_b from public.csp_attribution_links where code = v_code_b;

  insert into public.csp_attribution_events (link_id, event_type)
  values (v_link_a, 'click');
  select count(*)::int into v_click_before from public.csp_attribution_events where link_id = v_link_a;

  -- helper: assert
  -- 1) unauthorized deactivate
  perform set_config('request.jwt.claim.sub', '', true);
  perform set_config('request.jwt.claims', '{}', true);
  v_r := public.csp_deactivate_attribution_link(v_code_a);
  v_ok := (v_r->>'error') = 'unauthorized';
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','deactivate_unauthorized','ok',v_ok,'r',v_r));

  -- 2) partner B cannot deactivate A's link
  perform set_config('request.jwt.claim.sub', v_b::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_b::text, 'role', 'authenticated')::text, true);
  v_r := public.csp_deactivate_attribution_link(v_code_a);
  v_ok := (v_r->>'error') = 'forbidden';
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','deactivate_cross_partner_forbidden','ok',v_ok,'r',v_r));

  -- 3) suspended cannot deactivate
  perform set_config('request.jwt.claim.sub', v_s::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_s::text, 'role', 'authenticated')::text, true);
  -- give suspended a link owned by them for status gate
  insert into public.csp_attribution_links (partner_id, code, channel_origin, active)
  values (v_ps, 'csp-v5s' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10), 'referral_link', true);
  v_r := public.csp_deactivate_attribution_link((select code from public.csp_attribution_links where partner_id = v_ps limit 1));
  v_ok := (v_r->>'error') = 'partner_not_active';
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','deactivate_suspended_blocked','ok',v_ok,'r',v_r));

  -- 4) A deactivates own link
  perform set_config('request.jwt.claim.sub', v_a::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_a::text, 'role', 'authenticated')::text, true);
  v_r := public.csp_deactivate_attribution_link(v_code_a);
  v_ok := (v_r->>'found')::boolean is true and (v_r->>'changed')::boolean is true and (v_r->>'active')::boolean is false;
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','deactivate_own_success','ok',v_ok,'r',v_r));

  -- 5) idempotent
  v_r := public.csp_deactivate_attribution_link(v_code_a);
  v_ok := (v_r->>'found')::boolean is true and (v_r->>'changed')::boolean is false;
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','deactivate_idempotent','ok',v_ok,'r',v_r));

  -- 6) click history retained
  select count(*)::int into v_click_after from public.csp_attribution_events where link_id = v_link_a;
  v_ok := v_click_after = v_click_before and v_click_before >= 1;
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','deactivate_history_retained','ok',v_ok,'before',v_click_before,'after',v_click_after));

  -- 7) audit event
  v_ok := exists (
    select 1 from public.csp_audit_events
    where action = 'attribution_link_deactivated' and subject_id = v_link_a and actor_auth_user_id = v_a
  );
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','deactivate_audit','ok',v_ok));

  -- 8) link remains inactive (no public capture RPC — assert DB gate for future capture)
  v_ok := exists (select 1 from public.csp_attribution_links where id = v_link_a and active = false);
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','deactivate_active_false','ok',v_ok));

  -- MESSAGES
  perform set_config('request.jwt.claim.sub', v_admin::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_admin::text, 'role', 'authenticated')::text, true);
  v_msg := public.csp_send_partner_message(v_pa, 'admin_to_partner', 'V5 staging hello A', 'V5 subject', null, 'v5-admin-a-1', null);
  v_ok := (v_msg->>'created')::boolean is true;
  v_msg_id := (v_msg->>'message_id')::uuid;
  v_thread := (v_msg->>'thread_id')::uuid;
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','msg_admin_send','ok',v_ok,'r',v_msg));

  -- suspended rejected for admin send (API also gates; Core allows admin send to any partner_id — verify API layer separately; Core may allow)
  -- Partner A lists
  perform set_config('request.jwt.claim.sub', v_a::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_a::text, 'role', 'authenticated')::text, true);
  v_list := public.csp_list_partner_messages(null, 50);
  v_ok := (v_list->>'found')::boolean is true
    and exists (
      select 1 from jsonb_array_elements(coalesce(v_list->'messages','[]'::jsonb)) m
      where (m->>'id') = v_msg_id::text
    );
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','msg_partner_receives','ok',v_ok));

  -- B cannot see A's message
  perform set_config('request.jwt.claim.sub', v_b::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_b::text, 'role', 'authenticated')::text, true);
  v_list := public.csp_list_partner_messages(null, 50);
  v_ok := (v_list->>'found')::boolean is true
    and not exists (
      select 1 from jsonb_array_elements(coalesce(v_list->'messages','[]'::jsonb)) m
      where (m->>'id') = v_msg_id::text
    );
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','msg_cross_partner_hidden','ok',v_ok));

  -- B spoof list of A
  v_list := public.csp_list_partner_messages(v_pa, 50);
  v_ok := (v_list->>'error') in ('forbidden', 'partner_not_found')
    or not exists (
      select 1 from jsonb_array_elements(coalesce(v_list->'messages','[]'::jsonb)) m
      where (m->>'id') = v_msg_id::text
    );
  -- partner list with foreign partner_id should be forbidden for non-admin
  v_ok := coalesce(v_list->>'error','') = 'forbidden' or coalesce((v_list->>'found'),'true') = 'false'
    or (
      (v_list->>'found')::boolean is true
      and not exists (
        select 1 from jsonb_array_elements(coalesce(v_list->'messages','[]'::jsonb)) m
        where (m->>'id') = v_msg_id::text
      )
    );
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','msg_spoof_list_blocked','ok',v_ok,'r',v_list));

  -- mark read + reply
  perform set_config('request.jwt.claim.sub', v_a::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_a::text, 'role', 'authenticated')::text, true);
  v_r := public.csp_mark_partner_message_read(v_msg_id);
  v_ok := (v_r->>'found')::boolean is true;
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','msg_mark_read','ok',v_ok,'r',v_r));

  v_msg := public.csp_send_partner_message(v_pa, 'partner_to_admin', 'V5 reply from A', null, v_thread, 'v5-partner-a-1', null);
  v_ok := (v_msg->>'created')::boolean is true;
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','msg_partner_reply','ok',v_ok,'r',v_msg));

  -- admin sees reply
  perform set_config('request.jwt.claim.sub', v_admin::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_admin::text, 'role', 'authenticated')::text, true);
  v_list := public.csp_list_partner_messages(v_pa, 50);
  v_ok := exists (
    select 1 from jsonb_array_elements(coalesce(v_list->'messages','[]'::jsonb)) m
    where (m->>'direction') = 'partner_to_admin' and (m->>'body') like 'V5 reply%'
  );
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','msg_admin_sees_reply','ok',v_ok));

  -- suspended partner cannot list
  perform set_config('request.jwt.claim.sub', v_s::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_s::text, 'role', 'authenticated')::text, true);
  v_list := public.csp_list_partner_messages(null, 50);
  v_ok := (v_list->>'error') = 'partner_not_active';
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','msg_suspended_blocked','ok',v_ok,'r',v_list));

  -- MATERIALS
  perform set_config('request.jwt.claim.sub', v_admin::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_admin::text, 'role', 'authenticated')::text, true);
  v_mat := public.csp_upsert_sales_material(
    'v5_fixture_sheet',
    'pdf_sheets',
    'V5 Fixture Sheet',
    '/staging-fixtures/v5-sheet.pdf',
    array['kompis_web'],
    array['en','no'],
    'Isolated staging fixture',
    'application/pdf',
    '1.0',
    'v5 staging'
  );
  v_ok := (v_mat->>'found')::boolean is true;
  v_mat_id := coalesce((v_mat->>'material_id')::uuid, (v_mat->>'id')::uuid);
  if v_mat_id is null and (v_mat ? 'material') then
    v_mat_id := (v_mat->'material'->>'id')::uuid;
  end if;
  if v_mat_id is null then
    select id into v_mat_id from public.csp_sales_materials where material_key = 'v5_fixture_sheet' limit 1;
  end if;
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','mat_upsert_draft','ok',v_ok and v_mat_id is not null,'r',v_mat));

  -- partner cannot see unpublished
  perform set_config('request.jwt.claim.sub', v_a::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_a::text, 'role', 'authenticated')::text, true);
  v_list := public.csp_list_sales_materials(false, 'kompis_web');
  v_ok := not exists (
    select 1 from jsonb_array_elements(coalesce(v_list->'materials','[]'::jsonb)) m
    where (m->>'material_key') = 'v5_fixture_sheet'
  );
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','mat_unpublished_hidden','ok',v_ok));

  -- publish
  perform set_config('request.jwt.claim.sub', v_admin::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_admin::text, 'role', 'authenticated')::text, true);
  v_r := public.csp_publish_sales_material(v_mat_id);
  v_ok := (v_r->>'found')::boolean is true or (v_r->>'published')::boolean is true or coalesce(v_r->>'error','') = '';
  -- accept found true
  v_ok := coalesce((v_r->>'found')::boolean, false) or coalesce((v_r->>'ok')::boolean, false)
    or exists (select 1 from public.csp_sales_materials where id = v_mat_id and published);
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','mat_publish','ok',v_ok,'r',v_r));

  perform set_config('request.jwt.claim.sub', v_a::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_a::text, 'role', 'authenticated')::text, true);
  v_list := public.csp_list_sales_materials(false, 'kompis_web');
  v_ok := exists (
    select 1 from jsonb_array_elements(coalesce(v_list->'materials','[]'::jsonb)) m
    where (m->>'material_key') = 'v5_fixture_sheet'
  );
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','mat_published_visible','ok',v_ok));

  -- wrong product filter
  v_list := public.csp_list_sales_materials(false, 'aipify_voice');
  v_ok := not exists (
    select 1 from jsonb_array_elements(coalesce(v_list->'materials','[]'::jsonb)) m
    where (m->>'material_key') = 'v5_fixture_sheet'
  );
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','mat_wrong_product_hidden','ok',v_ok));

  -- partner cannot upsert
  v_mat := public.csp_upsert_sales_material('v5_partner_attempt','pdf_sheets','Nope','/x.pdf',array['kompis_web'],array['en'],null,null,'1.0',null);
  v_ok := (v_mat->>'error') = 'forbidden';
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','mat_partner_upsert_forbidden','ok',v_ok,'r',v_mat));

  -- withdraw
  perform set_config('request.jwt.claim.sub', v_admin::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_admin::text, 'role', 'authenticated')::text, true);
  v_r := public.csp_withdraw_sales_material(v_mat_id);
  v_ok := exists (select 1 from public.csp_sales_materials where id = v_mat_id and published = false)
    or coalesce((v_r->>'found')::boolean, false);
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','mat_withdraw','ok',v_ok,'r',v_r));

  perform set_config('request.jwt.claim.sub', v_a::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_a::text, 'role', 'authenticated')::text, true);
  v_list := public.csp_list_sales_materials(false, 'kompis_web');
  v_ok := not exists (
    select 1 from jsonb_array_elements(coalesce(v_list->'materials','[]'::jsonb)) m
    where (m->>'material_key') = 'v5_fixture_sheet'
  );
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','mat_withdrawn_hidden','ok',v_ok));

  -- COMMISSION via service_role paid_period on attributed registration for ACTIVE link B
  insert into public.csp_attributed_registrations (link_id, partner_id, customer_org_id, attributed_at, registered_at, window_expires_at)
  values (v_link_b, v_pb, v_org1, now(), now(), now() + interval '90 days');

  perform set_config('request.jwt.claim.sub', '', true);
  perform set_config('request.jwt.claims', json_build_object('role', 'service_role')::text, true);

  v_sale := public.csp_apply_paid_period_event(jsonb_build_object(
    'eventId', 'v5-ev-period-1-' || v_org1::text,
    'eventType', 'paid_period',
    'customerOrgId', v_org1,
    'productKey', 'kompis_web',
    'periodOrdinal', 1
  ));
  select status into v_status from public.csp_qualified_sales where partner_id = v_pb and customer_org_id = v_org1 and product_id = v_prod;
  v_ok := v_status is not null and v_status <> 'earned';
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','sale_period1_not_earned','ok',v_ok,'status',v_status,'r',v_sale));

  v_sale := public.csp_apply_paid_period_event(jsonb_build_object(
    'eventId', 'v5-ev-period-2-' || v_org1::text,
    'eventType', 'paid_period',
    'customerOrgId', v_org1,
    'productKey', 'kompis_web',
    'periodOrdinal', 2
  ));
  select status into v_status from public.csp_qualified_sales where partner_id = v_pb and customer_org_id = v_org1 and product_id = v_prod;
  v_ok := v_status = 'earned';
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','sale_period2_earned','ok',v_ok,'status',v_status,'r',v_sale));

  -- webhook replay
  v_sale := public.csp_apply_paid_period_event(jsonb_build_object(
    'eventId', 'v5-ev-period-2-' || v_org1::text,
    'eventType', 'paid_period',
    'customerOrgId', v_org1,
    'productKey', 'kompis_web',
    'periodOrdinal', 2
  ));
  v_ok := coalesce((v_sale->>'replayed')::boolean, false)
    or coalesce(v_sale->>'error','') in ('duplicate_event','already_applied')
    or coalesce((v_sale->>'found')::boolean, true);
  -- ensure still single earned sale
  v_ok := (
    select count(*) = 1 from public.csp_qualified_sales
    where partner_id = v_pb and customer_org_id = v_org1 and product_id = v_prod and status = 'earned'
  );
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','sale_webhook_no_double','ok',v_ok,'r',v_sale));

  -- renewal period 3 should not create second earned
  v_sale := public.csp_apply_paid_period_event(jsonb_build_object(
    'eventId', 'v5-ev-period-3-' || v_org1::text,
    'eventType', 'paid_period',
    'customerOrgId', v_org1,
    'productKey', 'kompis_web',
    'periodOrdinal', 3
  ));
  v_ok := (
    select count(*) = 1 from public.csp_qualified_sales
    where partner_id = v_pb and customer_org_id = v_org1 and product_id = v_prod and status = 'earned'
  );
  v_results := v_results || jsonb_build_array(jsonb_build_object('t','sale_renewal_no_new_commission','ok',v_ok,'r',v_sale));

  -- CLEANUP (audit + commission_ledger append-only retained)
  perform set_config('request.jwt.claim.sub', '', true);
  perform set_config('request.jwt.claims', '{}', true);

  begin
    delete from public.csp_settlement_lines where qualified_sale_id in (
      select id from public.csp_qualified_sales where partner_id in (v_pa, v_pb, v_ps)
    );
    delete from public.csp_attribution_events where link_id in (
      select id from public.csp_attribution_links where partner_id in (v_pa, v_pb, v_ps)
    );
    delete from public.csp_partner_message_recipients where partner_id in (v_pa, v_pb, v_ps);
    delete from public.csp_partner_messages where partner_id in (v_pa, v_pb, v_ps);
    delete from public.csp_sales_material_versions where material_id in (
      select id from public.csp_sales_materials where material_key like 'v5_%'
    );
    delete from public.csp_sales_materials where material_key like 'v5_%';
    -- Ledger is append-only and references sales/partners — terminate fixtures instead of hard-delete.
    update public.csp_partner_profiles
    set status = 'terminated', display_name = left(display_name || ' [v5 cleaned]', 120)
    where id in (v_pa, v_pb, v_ps);
    delete from public.platform_admins where auth_user_id = v_admin;
    update public.organizations set name = 'CSP V5 cleaned', slug = slug || '-cleaned'
    where id in (v_org1, v_org2);
  exception when others then
    null;
  end;

  return jsonb_build_object(
    'ok', not exists (select 1 from jsonb_array_elements(v_results) x where (x->>'ok')::boolean is not true),
    'passed', (select count(*) from jsonb_array_elements(v_results) x where (x->>'ok')::boolean is true),
    'failed', (select count(*) from jsonb_array_elements(v_results) x where (x->>'ok')::boolean is not true),
    'results', v_results
  );
exception when others then
  -- best-effort cleanup
  begin
    delete from public.csp_settlement_lines where qualified_sale_id in (
      select id from public.csp_qualified_sales where partner_id in (
        select id from public.csp_partner_profiles where display_name like 'V5 Fixture%'
      )
    );
    delete from public.csp_partner_message_recipients where partner_id in (
      select id from public.csp_partner_profiles where display_name like 'V5 Fixture%'
    );
    delete from public.csp_partner_messages where partner_id in (
      select id from public.csp_partner_profiles where display_name like 'V5 Fixture%'
    );
    delete from public.csp_sales_material_versions where material_id in (
      select id from public.csp_sales_materials where material_key like 'v5_%'
    );
    delete from public.csp_sales_materials where material_key like 'v5_%';
    update public.csp_partner_profiles
    set status = 'terminated', display_name = left(display_name || ' [v5 cleaned]', 120)
    where display_name like 'V5 Fixture%';
    delete from public.platform_admins where auth_user_id in (
      select id from auth.users where email like 'csp-v5-%@example.com'
    );
  exception when others then
    null;
  end;
  return jsonb_build_object('ok', false, 'error', SQLERRM, 'results', v_results);
end;
$$;

revoke all on function public._csp_v5_staging_verify() from public, anon, authenticated;
