-- Isolated contract tests for public AI cost SQL review 05.
-- Expects schema already loaded. Roles: service_role, anon, authenticated.
\set ON_ERROR_STOP on

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'service_role') then
    create role service_role nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
end $$;

-- Re-apply grants from proposal (idempotent)
revoke all on function public.reserve_website_kompis_public_ai_call(uuid, text, uuid, text, text)
  from public, anon, authenticated;
revoke all on function public.finalize_website_kompis_public_ai_call(uuid, uuid, uuid, text, text, int, int, int, int)
  from public, anon, authenticated;
grant execute on function public.reserve_website_kompis_public_ai_call(uuid, text, uuid, text, text)
  to service_role;
grant execute on function public.finalize_website_kompis_public_ai_call(uuid, uuid, uuid, text, text, int, int, int, int)
  to service_role;

create temporary table _t_results (
  name text primary key,
  pass boolean not null,
  detail text
);

-- Role denies
do $$
declare
  ok boolean := false;
begin
  begin
    set local role anon;
    perform public.reserve_website_kompis_public_ai_call(
      '11111111-1111-4111-8111-111111111111'::uuid,
      'customer.example',
      '22222222-2222-4222-8222-222222222222'::uuid,
      null, 'kompis_result_summary_v1'
    );
    ok := true;
  exception when insufficient_privilege then
    ok := false;
  end;
  reset role;
  insert into _t_results values ('anon_execute_denied', not ok, case when ok then 'anon could execute' else 'denied' end);
end $$;

do $$
declare
  ok boolean := false;
begin
  begin
    set local role authenticated;
    perform public.reserve_website_kompis_public_ai_call(
      '11111111-1111-4111-8111-111111111111'::uuid,
      'customer.example',
      '22222222-2222-4222-8222-222222222222'::uuid,
      null, 'kompis_result_summary_v1'
    );
    ok := true;
  exception when insufficient_privilege then
    ok := false;
  end;
  reset role;
  insert into _t_results values ('authenticated_execute_denied', not ok, case when ok then 'authenticated could execute' else 'denied' end);
end $$;

-- Happy path + finalize once
do $$
declare
  t uuid := 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  i uuid := 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  r jsonb;
  rid uuid;
  f1 jsonb;
  f2 jsonb;
begin
  set local role service_role;
  r := public.reserve_website_kompis_public_ai_call(i, 'Customer.Example', t, 'idem-happy-1', 'kompis_result_summary_v1');
  rid := (r->>'reservation_id')::uuid;
  f1 := public.finalize_website_kompis_public_ai_call(rid, t, i, 'success', null, 10, 20, 30, 100);
  f2 := public.finalize_website_kompis_public_ai_call(rid, t, i, 'success', null, 10, 20, 30, 100);
  reset role;
  insert into _t_results values (
    'happy_reserve_finalize',
    (r->>'allowed')::boolean is true and (f1->>'ok')::boolean is true and f2->>'reason' = 'already_finalized',
    r::text || ' | ' || f1::text || ' | ' || f2::text
  );
end $$;

-- Wrong install on finalize
do $$
declare
  t uuid := 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  i uuid := 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  wrong uuid := 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
  r jsonb;
  f jsonb;
begin
  set local role service_role;
  r := public.reserve_website_kompis_public_ai_call(i, 'customer.example', t, null, 'kompis_result_summary_v1');
  f := public.finalize_website_kompis_public_ai_call((r->>'reservation_id')::uuid, t, wrong, 'success', null, null, null, null, null);
  reset role;
  insert into _t_results values (
    'finalize_wrong_install',
    f->>'reason' = 'reservation_not_found',
    f::text
  );
end $$;

-- Null binding
do $$
declare
  r jsonb;
begin
  set local role service_role;
  r := public.reserve_website_kompis_public_ai_call(null, '', null, null, 'kompis_result_summary_v1');
  reset role;
  insert into _t_results values (
    'null_binding_denied',
    r->>'reason' = 'untrusted_binding',
    r::text
  );
end $$;

-- Sequential rate fill
do $$
declare
  t uuid := 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';
  i uuid := 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
  allowed int := 0;
  denied int := 0;
  r jsonb;
  n int;
begin
  set local role service_role;
  for n in 1..65 loop
    r := public.reserve_website_kompis_public_ai_call(i, 'rate.example', t, null, 'kompis_result_summary_v1');
    if (r->>'allowed')::boolean then allowed := allowed + 1; else denied := denied + 1; end if;
  end loop;
  reset role;
  insert into _t_results values (
    'sequential_rate_60',
    allowed = 60 and denied = 5,
    format('allowed=%s denied=%s', allowed, denied)
  );
end $$;

-- Parallel race near limit (use fresh tenant; prefill to 59)
do $$
declare
  t uuid := 'ffffffff-ffff-4fff-8fff-ffffffffffff';
  i uuid := '12121212-1212-4121-8121-121212121212';
  r jsonb;
  n int;
  allowed int := 0;
  denied int := 0;
  reserved int;
begin
  set local role service_role;
  for n in 1..59 loop
    perform public.reserve_website_kompis_public_ai_call(i, 'race.example', t, null, 'kompis_result_summary_v1');
  end loop;
  -- four concurrent-style sequential attempts after prefill (true parallel via dblink optional;
  -- FOR UPDATE serialization is what Production relies on)
  for n in 1..4 loop
    r := public.reserve_website_kompis_public_ai_call(i, 'race.example', t, null, 'kompis_result_summary_v1');
    if (r->>'allowed')::boolean then allowed := allowed + 1; else denied := denied + 1; end if;
  end loop;
  select reserved_count into reserved
  from public.website_kompis_public_ai_budget_windows
  where tenant_id = t
  order by window_start desc limit 1;
  reset role;
  insert into _t_results values (
    'race_at_limit_no_overshoot',
    allowed = 1 and denied = 3 and reserved = 60,
    format('allowed=%s denied=%s reserved=%s', allowed, denied, reserved)
  );
end $$;

-- Idempotency after finalize (V1 FAIL expected / V2 PASS)
do $$
declare
  t uuid := '33333333-3333-4333-8333-333333333333';
  i uuid := '44444444-4444-4444-8444-444444444444';
  i2 uuid := '55555555-5555-4555-8555-555555555555';
  r1 jsonb;
  r2 jsonb;
  r3 jsonb;
  rid uuid;
  is_v2 boolean;
begin
  set local role service_role;
  r1 := public.reserve_website_kompis_public_ai_call(i, 'idem.example', t, 'shared-key-1', 'kompis_result_summary_v1');
  rid := (r1->>'reservation_id')::uuid;
  perform public.finalize_website_kompis_public_ai_call(rid, t, i, 'success', null, 1, 1, 2, 50);
  r2 := public.reserve_website_kompis_public_ai_call(i, 'idem.example', t, 'shared-key-1', 'kompis_result_summary_v1');
  r3 := public.reserve_website_kompis_public_ai_call(i2, 'other.example', t, 'shared-key-1', 'kompis_result_summary_v1');
  -- Detect v2 by whether finalized replay denies
  is_v2 := (r2->>'allowed')::boolean is not true and r2->>'reason' in ('already_finalized', 'denied');
  reset role;
  insert into _t_results values (
    'idem_after_finalize_no_reauth',
    (r2->>'allowed')::boolean is not true,
    r2::text
  );
  insert into _t_results values (
    'idem_binding_mismatch_denied',
    (r3->>'allowed')::boolean is not true and coalesce(r3->>'reason','') in ('binding_mismatch','already_finalized','denied'),
    r3::text
  );
  insert into _t_results values (
    'schema_is_v2_semantics',
    is_v2 and r3->>'reason' = 'binding_mismatch',
    format('r2=%s r3=%s', r2->>'reason', r3->>'reason')
  );
end $$;

-- In-flight reserved replay allowed once
do $$
declare
  t uuid := '66666666-6666-4666-8666-666666666666';
  i uuid := '77777777-7777-4777-8777-777777777777';
  r1 jsonb;
  r2 jsonb;
begin
  set local role service_role;
  r1 := public.reserve_website_kompis_public_ai_call(i, 'inflight.example', t, 'inflight-key', 'kompis_result_summary_v1');
  r2 := public.reserve_website_kompis_public_ai_call(i, 'inflight.example', t, 'inflight-key', 'kompis_result_summary_v1');
  reset role;
  insert into _t_results values (
    'inflight_idempotent_replay',
    (r1->>'allowed')::boolean and (r2->>'allowed')::boolean
      and r1->>'reservation_id' = r2->>'reservation_id'
      and coalesce(r2->>'reason','') in ('idempotent_replay',''),
    r1::text || ' | ' || r2::text
  );
end $$;

-- reserved_count not decremented on release
do $$
declare
  t uuid := '88888888-8888-4888-8888-888888888888';
  i uuid := '99999999-9999-4999-8999-999999999999';
  r jsonb;
  before int;
  after int;
  rid uuid;
begin
  set local role service_role;
  r := public.reserve_website_kompis_public_ai_call(i, 'release.example', t, null, 'kompis_result_summary_v1');
  rid := (r->>'reservation_id')::uuid;
  select reserved_count into before from public.website_kompis_public_ai_budget_windows where tenant_id = t;
  perform public.finalize_website_kompis_public_ai_call(rid, t, i, 'released', null, null, null, null, null);
  select reserved_count into after from public.website_kompis_public_ai_budget_windows where tenant_id = t;
  reset role;
  insert into _t_results values (
    'release_does_not_free_rate_slot',
    before = after and before >= 1,
    format('before=%s after=%s', before, after)
  );
end $$;

select name, pass, detail from _t_results order by name;

do $$
declare
  fails int;
begin
  select count(*) into fails from _t_results where not pass;
  if fails > 0 then
    raise exception 'CONTRACT_FAILURES=%', fails;
  end if;
  raise notice 'ALL_CONTRACT_TESTS_PASSED';
end $$;
