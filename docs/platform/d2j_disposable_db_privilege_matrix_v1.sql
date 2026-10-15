-- D2J disposable privilege matrix (LOCAL ONLY). Expects v1.1 SQL already applied.
create temporary table if not exists d2j_priv (test_id text primary key, result text, detail text);

do $$
declare
  v_sig text := 'public.create_platform_portal_customer(text,text,text,text,text,text)';
  v_ok boolean;
  v_n int;
  v_sqlstate text;
  v_msg text;
begin
  select count(*) into v_n
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = 'create_platform_portal_customer';
  if v_n = 1 then
    insert into d2j_priv values ('P01_single_6arg_overload', 'PASS', 'count=1');
  else
    insert into d2j_priv values ('P01_single_6arg_overload', 'FAIL', 'count=' || v_n);
  end if;

  v_ok := has_function_privilege('authenticated', v_sig, 'execute');
  insert into d2j_priv values (
    'P02_authenticated_execute',
    case when v_ok then 'PASS' else 'FAIL' end,
    'execute=' || v_ok::text
  );

  v_ok := has_function_privilege('service_role', v_sig, 'execute');
  insert into d2j_priv values (
    'P03_service_role_execute',
    case when v_ok then 'PASS' else 'FAIL' end,
    'execute=' || v_ok::text
  );

  v_ok := has_function_privilege('anon', v_sig, 'execute');
  insert into d2j_priv values (
    'P04_anon_no_execute',
    case when not v_ok then 'PASS' else 'FAIL' end,
    'execute=' || v_ok::text
  );

  v_ok := has_function_privilege('public', v_sig, 'execute');
  insert into d2j_priv values (
    'P05_public_no_execute',
    case when not v_ok then 'PASS' else 'FAIL' end,
    'execute=' || v_ok::text
  );

  -- Regression: support internal denied; helper false
  perform set_config('request.jwt.claim.sub', '22222222-2222-2222-2222-222222222222', true);
  begin
    perform public.create_platform_portal_customer(
      '333333333', 'X', 'X', 'd2j-support-internal', 'NO', 'internal'
    );
    insert into d2j_priv values ('P06_support_internal_denied', 'FAIL', 'succeeded');
  exception when others then
    get stacked diagnostics v_sqlstate = returned_sqlstate, v_msg = message_text;
    if v_msg = 'INTERNAL_ENVIRONMENT_SUPER_ADMIN_REQUIRED' then
      insert into d2j_priv values ('P06_support_internal_denied', 'PASS', v_sqlstate || ' ' || v_msg);
    else
      insert into d2j_priv values ('P06_support_internal_denied', 'FAIL', v_sqlstate || ' ' || v_msg);
    end if;
  end;

  perform set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', true);
  begin
    perform public.create_platform_portal_customer(
      '444444444', 'Y', 'Y', 'd2j-super-internal', 'NO', 'internal'
    );
    insert into d2j_priv values ('P07_super_helper_false', 'FAIL', 'succeeded');
  exception when others then
    get stacked diagnostics v_sqlstate = returned_sqlstate, v_msg = message_text;
    if v_msg = 'INTERNAL_ENVIRONMENT_NOT_AUTHORIZED' then
      insert into d2j_priv values ('P07_super_helper_false', 'PASS', v_sqlstate || ' ' || v_msg);
    else
      insert into d2j_priv values ('P07_super_helper_false', 'FAIL', v_sqlstate || ' ' || v_msg);
    end if;
  end;

  begin
    perform public.create_platform_portal_customer(
      '555555555', 'Z', 'Z', 'd2j-super-prod', 'NO', 'production'
    );
    insert into d2j_priv values ('P08_production_create_ok', 'PASS', 'ok');
  exception when others then
    get stacked diagnostics v_sqlstate = returned_sqlstate, v_msg = message_text;
    insert into d2j_priv values ('P08_production_create_ok', 'FAIL', v_sqlstate || ' ' || v_msg);
  end;
end;
$$;

select * from d2j_priv order by test_id;
