-- =============================================================================
-- D2H disposable-DB security test matrix (LOCAL ONLY)
-- Expects D2G NOT_APPLIED SQL already applied on fixture baseline.
-- Emits one row per test: test_id | result | detail
-- =============================================================================

create temporary table if not exists d2h_results (
  test_id text primary key,
  result text not null,
  detail text not null default ''
);

create or replace function pg_temp.d2h_set_actor(p_uid uuid)
returns void
language plpgsql
as $$
begin
  perform set_config('request.jwt.claim.sub', coalesce(p_uid::text, ''), true);
end;
$$;

create or replace function pg_temp.d2h_record(p_id text, p_result text, p_detail text)
returns void
language plpgsql
as $$
begin
  insert into d2h_results(test_id, result, detail)
  values (p_id, p_result, coalesce(p_detail, ''))
  on conflict (test_id) do update
    set result = excluded.result,
        detail = excluded.detail;
end;
$$;

do $$
declare
  v_json jsonb;
  v_id uuid;
  v_env text;
  v_sqlstate text;
  v_msg text;
  v_count int;
  v_audit jsonb;
  v_before_env text;
  v_after_env text;
  v_arity int;
begin
  -- T01: function arity = 6-arg only
  begin
    select count(*) into v_arity
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'create_platform_portal_customer';
    if v_arity = 1
       and exists (
         select 1 from pg_proc p
         join pg_namespace n on n.oid = p.pronamespace
         where n.nspname = 'public'
           and p.proname = 'create_platform_portal_customer'
           and p.pronargs = 6
           and pg_get_function_identity_arguments(p.oid)
             like '%p_environment_type text'
       )
    then
      perform pg_temp.d2h_record(
        'T01_rpc_arity_6',
        'PASS',
        'single overload pronargs=6 with p_environment_type'
      );
    else
      perform pg_temp.d2h_record('T01_rpc_arity_6', 'FAIL', 'arity_count=' || v_arity::text);
    end if;
  exception when others then
    get stacked diagnostics v_sqlstate = returned_sqlstate, v_msg = message_text;
    perform pg_temp.d2h_record('T01_rpc_arity_6', 'FAIL', v_sqlstate || ' ' || v_msg);
  end;

  -- T02: helper fail-closed false
  begin
    if public._platform_portal_internal_customer_create_authorized() is false then
      perform pg_temp.d2h_record('T02_helper_fail_closed', 'PASS', 'select false');
    else
      perform pg_temp.d2h_record('T02_helper_fail_closed', 'FAIL', 'helper returned true');
    end if;
  exception when others then
    get stacked diagnostics v_sqlstate = returned_sqlstate, v_msg = message_text;
    perform pg_temp.d2h_record('T02_helper_fail_closed', 'FAIL', v_sqlstate || ' ' || v_msg);
  end;

  -- T03: anonymous denied
  begin
    perform pg_temp.d2h_set_actor(null);
    begin
      perform public.create_platform_portal_customer(
        '111111111', 'Anon Co', 'Anon Co', 'anon-co-d2h', 'NO', 'production'
      );
      perform pg_temp.d2h_record('T03_anon_denied', 'FAIL', 'create succeeded');
    exception when others then
      get stacked diagnostics v_sqlstate = returned_sqlstate, v_msg = message_text;
      if v_msg ilike '%Platform portal access denied%' then
        perform pg_temp.d2h_record('T03_anon_denied', 'PASS', v_sqlstate || ' ' || v_msg);
      else
        perform pg_temp.d2h_record('T03_anon_denied', 'FAIL', v_sqlstate || ' ' || v_msg);
      end if;
    end;
  end;

  -- T04: production create by platform_support (compatibility)
  begin
    perform pg_temp.d2h_set_actor('22222222-2222-2222-2222-222222222222'::uuid);
    v_json := public.create_platform_portal_customer(
      '222222222', 'Support Prod Co', 'Support Prod Co', 'support-prod-d2h', 'NO'
    );
    v_id := (v_json->'customer'->>'id')::uuid;
    select environment_type into v_env from public.customers where id = v_id;
    if v_env = 'production'
       and coalesce(v_json->'customer'->>'environment_type', 'production') = 'production'
       and (v_json->'created'->>'payment_profile')::boolean is false
       and (v_json->'created'->>'license')::boolean is false
    then
      perform pg_temp.d2h_record('T04_production_default_support', 'PASS', 'customer=' || v_id::text);
    else
      perform pg_temp.d2h_record('T04_production_default_support', 'FAIL', v_json::text);
    end if;
  exception when others then
    get stacked diagnostics v_sqlstate = returned_sqlstate, v_msg = message_text;
    perform pg_temp.d2h_record('T04_production_default_support', 'FAIL', v_sqlstate || ' ' || v_msg);
  end;

  -- T05: platform_support cannot create internal
  begin
    perform pg_temp.d2h_set_actor('22222222-2222-2222-2222-222222222222'::uuid);
    begin
      perform public.create_platform_portal_customer(
        '333333333', 'Support Internal', 'Support Internal', 'support-internal-d2h', 'NO', 'internal'
      );
      perform pg_temp.d2h_record('T05_support_internal_denied', 'FAIL', 'create succeeded');
    exception when others then
      get stacked diagnostics v_sqlstate = returned_sqlstate, v_msg = message_text;
      if v_msg = 'INTERNAL_ENVIRONMENT_SUPER_ADMIN_REQUIRED' then
        perform pg_temp.d2h_record('T05_support_internal_denied', 'PASS', v_sqlstate || ' ' || v_msg);
      else
        perform pg_temp.d2h_record('T05_support_internal_denied', 'FAIL', v_sqlstate || ' ' || v_msg);
      end if;
    end;
  end;

  -- T06: super_admin + helper false cannot create internal
  begin
    perform pg_temp.d2h_set_actor('11111111-1111-1111-1111-111111111111'::uuid);
    begin
      perform public.create_platform_portal_customer(
        '444444444', 'Super Internal', 'Super Internal', 'super-internal-d2h', 'NO', 'internal'
      );
      perform pg_temp.d2h_record('T06_super_helper_false_denied', 'FAIL', 'create succeeded');
    exception when others then
      get stacked diagnostics v_sqlstate = returned_sqlstate, v_msg = message_text;
      if v_msg = 'INTERNAL_ENVIRONMENT_NOT_AUTHORIZED' then
        perform pg_temp.d2h_record('T06_super_helper_false_denied', 'PASS', v_sqlstate || ' ' || v_msg);
      else
        perform pg_temp.d2h_record('T06_super_helper_false_denied', 'FAIL', v_sqlstate || ' ' || v_msg);
      end if;
    end;
  end;

  -- T07: invalid environment_type rejected
  begin
    perform pg_temp.d2h_set_actor('11111111-1111-1111-1111-111111111111'::uuid);
    begin
      perform public.create_platform_portal_customer(
        '555555555', 'Bad Env', 'Bad Env', 'bad-env-d2h', 'NO', 'staging'
      );
      perform pg_temp.d2h_record('T07_invalid_env_rejected', 'FAIL', 'create succeeded');
    exception when others then
      get stacked diagnostics v_sqlstate = returned_sqlstate, v_msg = message_text;
      if v_msg = 'INVALID_ENVIRONMENT_TYPE' then
        perform pg_temp.d2h_record('T07_invalid_env_rejected', 'PASS', v_sqlstate || ' ' || v_msg);
      else
        perform pg_temp.d2h_record('T07_invalid_env_rejected', 'FAIL', v_sqlstate || ' ' || v_msg);
      end if;
    end;
  end;

  -- T08: duplicate slug denied
  begin
    perform pg_temp.d2h_set_actor('11111111-1111-1111-1111-111111111111'::uuid);
    begin
      perform public.create_platform_portal_customer(
        '666666666', 'Dup Slug', 'Dup Slug', 'existing-prod-co', 'NO', 'production'
      );
      perform pg_temp.d2h_record('T08_duplicate_slug', 'FAIL', 'create succeeded');
    exception when others then
      get stacked diagnostics v_sqlstate = returned_sqlstate, v_msg = message_text;
      if v_msg = 'DUPLICATE_SLUG' then
        perform pg_temp.d2h_record('T08_duplicate_slug', 'PASS', v_sqlstate || ' ' || v_msg);
      else
        perform pg_temp.d2h_record('T08_duplicate_slug', 'FAIL', v_sqlstate || ' ' || v_msg);
      end if;
    end;
  end;

  -- T09: existing tenant environment_type unchanged after apply/tests so far
  begin
    select environment_type into v_before_env
    from public.customers
    where id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid;
    if v_before_env = 'production' then
      perform pg_temp.d2h_record('T09_existing_tenant_unchanged', 'PASS', 'environment_type=production');
    else
      perform pg_temp.d2h_record('T09_existing_tenant_unchanged', 'FAIL', coalesce(v_before_env, '<null>'));
    end if;
  exception when others then
    get stacked diagnostics v_sqlstate = returned_sqlstate, v_msg = message_text;
    perform pg_temp.d2h_record('T09_existing_tenant_unchanged', 'FAIL', v_sqlstate || ' ' || v_msg);
  end;

  -- T10: environment_type immutable on update
  begin
    begin
      update public.customers
      set environment_type = 'internal'
      where id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid;
      perform pg_temp.d2h_record('T10_env_immutable', 'FAIL', 'update succeeded');
    exception when others then
      get stacked diagnostics v_sqlstate = returned_sqlstate, v_msg = message_text;
      if v_msg = 'ENVIRONMENT_TYPE_IMMUTABLE' then
        perform pg_temp.d2h_record('T10_env_immutable', 'PASS', v_sqlstate || ' ' || v_msg);
      else
        perform pg_temp.d2h_record('T10_env_immutable', 'FAIL', v_sqlstate || ' ' || v_msg);
      end if;
    end;
    select environment_type into v_after_env
    from public.customers
    where id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid;
    if v_after_env is distinct from 'production' then
      perform pg_temp.d2h_record('T10_env_immutable', 'FAIL', 'row changed to ' || coalesce(v_after_env,'null'));
    end if;
  end;

  -- T11: temporary local positive path — flip helper ONLY in disposable DB, prove persist + audit, then restore false
  begin
    perform pg_temp.d2h_set_actor('11111111-1111-1111-1111-111111111111'::uuid);
    execute $q$
      create or replace function public._platform_portal_internal_customer_create_authorized()
      returns boolean language sql stable security definer set search_path = public
      as $f$ select true; $f$;
    $q$;
    begin
      v_json := public.create_platform_portal_customer(
        '777777777', 'Local Internal Fixture', 'Local Internal Fixture',
        'local-internal-d2h', 'NO', 'internal'
      );
      v_id := (v_json->'customer'->>'id')::uuid;
      select environment_type into v_env from public.customers where id = v_id;
      select metadata into v_audit
      from public.platform_admin_audit_logs
      where action_type = 'platform_customer_created'
        and target_id = v_id::text
      order by created_at desc
      limit 1;
      if v_env = 'internal'
         and v_json->'customer'->>'environment_type' = 'internal'
         and v_audit->>'environment_type' = 'internal'
      then
        perform pg_temp.d2h_record(
          'T11_local_positive_internal_persist',
          'PASS',
          'LOCAL FIXTURE ONLY — helper temporarily true; not live authorize. id=' || v_id::text
        );
      else
        perform pg_temp.d2h_record(
          'T11_local_positive_internal_persist',
          'FAIL',
          'env=' || coalesce(v_env,'?') || ' audit=' || coalesce(v_audit::text,'null')
        );
      end if;
    exception when others then
      get stacked diagnostics v_sqlstate = returned_sqlstate, v_msg = message_text;
      perform pg_temp.d2h_record('T11_local_positive_internal_persist', 'FAIL', v_sqlstate || ' ' || v_msg);
    end;
    -- restore fail-closed
    execute $q$
      create or replace function public._platform_portal_internal_customer_create_authorized()
      returns boolean language sql stable security definer set search_path = public
      as $f$ select false; $f$;
    $q$;
    if public._platform_portal_internal_customer_create_authorized() is not false then
      perform pg_temp.d2h_record('T11b_helper_restored_false', 'FAIL', 'helper not restored');
    else
      perform pg_temp.d2h_record('T11b_helper_restored_false', 'PASS', 'helper false again');
    end if;
  end;

  -- T12-T16: exposure triggers against the local internal fixture customer
  begin
    select id into v_id from public.customers where slug = 'local-internal-d2h' limit 1;
    if v_id is null then
      perform pg_temp.d2h_record('T12_block_subscription', 'BLOCKED', 'no internal fixture customer');
      perform pg_temp.d2h_record('T13_block_license', 'BLOCKED', 'no internal fixture customer');
      perform pg_temp.d2h_record('T14_block_org_domain', 'BLOCKED', 'no internal fixture customer');
      perform pg_temp.d2h_record('T15_block_customer_domain', 'BLOCKED', 'no internal fixture customer');
      perform pg_temp.d2h_record('T16_block_installation', 'BLOCKED', 'no internal fixture customer');
    else
      begin
        insert into public.subscriptions (customer_id, status) values (v_id, 'active');
        perform pg_temp.d2h_record('T12_block_subscription', 'FAIL', 'insert succeeded');
      exception when others then
        get stacked diagnostics v_sqlstate = returned_sqlstate, v_msg = message_text;
        if v_msg = 'INTERNAL_CUSTOMER_EXTERNAL_EXPOSURE_FORBIDDEN' then
          perform pg_temp.d2h_record('T12_block_subscription', 'PASS', v_sqlstate || ' ' || v_msg);
        else
          perform pg_temp.d2h_record('T12_block_subscription', 'FAIL', v_sqlstate || ' ' || v_msg);
        end if;
      end;

      begin
        insert into public.aipify_billing_license_links (organization_id, license_type, license_status)
        values (v_id, 'app_subscription', 'pending');
        perform pg_temp.d2h_record('T13_block_license', 'FAIL', 'insert succeeded');
      exception when others then
        get stacked diagnostics v_sqlstate = returned_sqlstate, v_msg = message_text;
        if v_msg = 'INTERNAL_CUSTOMER_EXTERNAL_EXPOSURE_FORBIDDEN' then
          perform pg_temp.d2h_record('T13_block_license', 'PASS', v_sqlstate || ' ' || v_msg);
        else
          perform pg_temp.d2h_record('T13_block_license', 'FAIL', v_sqlstate || ' ' || v_msg);
        end if;
      end;

      begin
        insert into public.organization_domains (organization_id, domain)
        values (v_id, 'internal.example');
        perform pg_temp.d2h_record('T14_block_org_domain', 'FAIL', 'insert succeeded');
      exception when others then
        get stacked diagnostics v_sqlstate = returned_sqlstate, v_msg = message_text;
        if v_msg = 'INTERNAL_CUSTOMER_EXTERNAL_EXPOSURE_FORBIDDEN' then
          perform pg_temp.d2h_record('T14_block_org_domain', 'PASS', v_sqlstate || ' ' || v_msg);
        else
          perform pg_temp.d2h_record('T14_block_org_domain', 'FAIL', v_sqlstate || ' ' || v_msg);
        end if;
      end;

      begin
        insert into public.customer_domains (customer_id, hostname)
        values (v_id, 'internal.example');
        perform pg_temp.d2h_record('T15_block_customer_domain', 'FAIL', 'insert succeeded');
      exception when others then
        get stacked diagnostics v_sqlstate = returned_sqlstate, v_msg = message_text;
        if v_msg = 'INTERNAL_CUSTOMER_EXTERNAL_EXPOSURE_FORBIDDEN' then
          perform pg_temp.d2h_record('T15_block_customer_domain', 'PASS', v_sqlstate || ' ' || v_msg);
        else
          perform pg_temp.d2h_record('T15_block_customer_domain', 'FAIL', v_sqlstate || ' ' || v_msg);
        end if;
      end;

      begin
        insert into public.installations (customer_id, status) values (v_id, 'pending');
        perform pg_temp.d2h_record('T16_block_installation', 'FAIL', 'insert succeeded');
      exception when others then
        get stacked diagnostics v_sqlstate = returned_sqlstate, v_msg = message_text;
        if v_msg = 'INTERNAL_CUSTOMER_EXTERNAL_EXPOSURE_FORBIDDEN' then
          perform pg_temp.d2h_record('T16_block_installation', 'PASS', v_sqlstate || ' ' || v_msg);
        else
          perform pg_temp.d2h_record('T16_block_installation', 'FAIL', v_sqlstate || ' ' || v_msg);
        end if;
      end;
    end if;
  end;

  -- T17: production customer can still receive subscription (trigger only blocks internal)
  begin
    insert into public.subscriptions (customer_id, status)
    values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'active');
    select count(*) into v_count from public.subscriptions
    where customer_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid;
    if v_count >= 1 then
      perform pg_temp.d2h_record('T17_production_subscription_allowed', 'PASS', 'count=' || v_count::text);
    else
      perform pg_temp.d2h_record('T17_production_subscription_allowed', 'FAIL', 'no row');
    end if;
  exception when others then
    get stacked diagnostics v_sqlstate = returned_sqlstate, v_msg = message_text;
    perform pg_temp.d2h_record('T17_production_subscription_allowed', 'FAIL', v_sqlstate || ' ' || v_msg);
  end;

  -- T18: grants — anon/public lack execute; authenticated has execute (role may be absent locally)
  begin
    if not has_function_privilege('public', 'public.create_platform_portal_customer(text,text,text,text,text,text)', 'execute')
    then
      perform pg_temp.d2h_record('T18_revoke_public', 'PASS', 'public cannot execute');
    else
      perform pg_temp.d2h_record('T18_revoke_public', 'FAIL', 'public can execute');
    end if;
  exception when others then
    get stacked diagnostics v_sqlstate = returned_sqlstate, v_msg = message_text;
    perform pg_temp.d2h_record('T18_revoke_public', 'FAIL', v_sqlstate || ' ' || v_msg);
  end;

  -- T19: SECURITY DEFINER + search_path on create RPC
  begin
    if exists (
      select 1
      from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public'
        and p.proname = 'create_platform_portal_customer'
        and p.prosecdef
        and coalesce(p.proconfig, array[]::text[])::text ilike '%search_path=public%'
    ) then
      perform pg_temp.d2h_record('T19_security_definer_search_path', 'PASS', 'prosecdef + search_path=public');
    else
      perform pg_temp.d2h_record('T19_security_definer_search_path', 'FAIL', 'missing definer/search_path');
    end if;
  exception when others then
    get stacked diagnostics v_sqlstate = returned_sqlstate, v_msg = message_text;
    perform pg_temp.d2h_record('T19_security_definer_search_path', 'FAIL', v_sqlstate || ' ' || v_msg);
  end;

  -- T20: regression — super_admin production create still works after helper restore
  begin
    perform pg_temp.d2h_set_actor('11111111-1111-1111-1111-111111111111'::uuid);
    v_json := public.create_platform_portal_customer(
      '888888888', 'Super Prod Co', 'Super Prod Co', 'super-prod-d2h', 'NO', 'production'
    );
    if v_json->'customer'->>'environment_type' = 'production' then
      perform pg_temp.d2h_record('T20_super_production_ok', 'PASS', v_json->'customer'->>'id');
    else
      perform pg_temp.d2h_record('T20_super_production_ok', 'FAIL', v_json::text);
    end if;
  exception when others then
    get stacked diagnostics v_sqlstate = returned_sqlstate, v_msg = message_text;
    perform pg_temp.d2h_record('T20_super_production_ok', 'FAIL', v_sqlstate || ' ' || v_msg);
  end;
end;
$$;

select test_id, result, detail from d2h_results order by test_id;
