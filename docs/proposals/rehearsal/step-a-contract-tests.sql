-- Step A isolated contract tests. Expect RAISE on failure via DO blocks.

\set ON_ERROR_STOP on

-- Session as platform admin
select set_config('request.jwt.claim.sub', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', false);

-- 0) APPLY left zero bedrift grants before activate
do $$
declare c int;
begin
  select count(*) into c from public.tenant_modules where module_key = 'kompis_bedrift';
  if c <> 0 then raise exception 'FAIL apply_time_grants count=%', c; end if;
  raise notice 'PASS apply_time_zero_bedrift_rows';
end $$;

-- 1) Web-only: website_kompis true, bedrift false before activate
do $$
begin
  if not public.is_tenant_module_enabled('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'website_kompis') then
    raise exception 'FAIL web_only website_kompis disabled';
  end if;
  if public.is_tenant_module_enabled('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'kompis_bedrift') then
    raise exception 'FAIL web_only unexpectedly has bedrift';
  end if;
  raise notice 'PASS web_only_baseline';
end $$;

-- 2) status eligible for web-only (agreement active, not active bedrift)
do $$
declare s jsonb;
begin
  s := public.get_platform_portal_customer_kompis_bedrift_status('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1');
  if s is null then raise exception 'FAIL status null web'; end if;
  if coalesce((s->>'active')::boolean, true) then raise exception 'FAIL status active before grant'; end if;
  if not coalesce((s->>'eligible')::boolean, false) then raise exception 'FAIL status not eligible %', s; end if;
  if s->>'module_key' <> 'kompis_bedrift' then raise exception 'FAIL module_key'; end if;
  raise notice 'PASS status_eligible_web_only';
end $$;

-- 3) none-product not eligible (no subscription)
do $$
declare s jsonb;
begin
  s := public.get_platform_portal_customer_kompis_bedrift_status('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4');
  if coalesce((s->>'eligible')::boolean, true) then raise exception 'FAIL none eligible %', s; end if;
  raise notice 'PASS none_not_eligible';
end $$;

-- 4) unauthorized caller denied
do $$
begin
  perform set_config('request.jwt.claim.sub', 'dddddddd-dddd-dddd-dddd-ddddddddddd9', false);
  begin
    perform public.get_platform_portal_customer_kompis_bedrift_status('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1');
    raise exception 'FAIL unauthorized status allowed';
  exception when others then
    if SQLERRM not like '%Platform portal access denied%' then
      raise exception 'FAIL unexpected unauthorized error: %', SQLERRM;
    end if;
  end;
  perform set_config('request.jwt.claim.sub', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', false);
  raise notice 'PASS unauthorized_denied';
end $$;

-- 5) malformed activate inputs
do $$
begin
  begin
    perform public.activate_platform_portal_customer_kompis_bedrift(
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'ok reason', false, 'bpk-malformed1');
    raise exception 'FAIL confirmation bypass';
  exception when others then
    if SQLERRM not like '%CONFIRMATION_REQUIRED%' then raise exception 'FAIL conf err %', SQLERRM; end if;
  end;
  begin
    perform public.activate_platform_portal_customer_kompis_bedrift(
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'ok reason', true, 'bad-prefix');
    raise exception 'FAIL bad idempotency accepted';
  exception when others then
    if SQLERRM not like '%INVALID_IDEMPOTENCY_KEY%' then raise exception 'FAIL idem err %', SQLERRM; end if;
  end;
  raise notice 'PASS malformed_inputs';
end $$;

-- 6) activate bedrift-only tenant
do $$
declare r jsonb; c int;
begin
  r := public.activate_platform_portal_customer_kompis_bedrift(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
    'synthetic bedrift-only grant for rehearsal',
    true,
    'bpk-bedrift-only-001'
  );
  if coalesce((r->>'created')::boolean, false) is not true then raise exception 'FAIL activate created %', r; end if;
  if not public.is_tenant_module_enabled('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'kompis_bedrift') then
    raise exception 'FAIL bedrift not enabled after activate';
  end if;
  if public.is_tenant_module_enabled('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'website_kompis') then
    raise exception 'FAIL bedrift-only gained website_kompis';
  end if;
  select count(*) into c from public.tenant_modules where module_key='kompis_bedrift';
  if c <> 1 then raise exception 'FAIL unexpected bedrift row count %', c; end if;
  raise notice 'PASS activate_bedrift_only';
end $$;

-- 7) idempotent replay same key
do $$
declare r jsonb;
begin
  r := public.activate_platform_portal_customer_kompis_bedrift(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
    'synthetic bedrift-only grant for rehearsal',
    true,
    'bpk-bedrift-only-001'
  );
  if coalesce((r->>'idempotent_replay')::boolean, false) is not true then
    raise exception 'FAIL idempotent replay %', r;
  end if;
  raise notice 'PASS idempotent_replay';
end $$;

-- 8) both-products: keep website_kompis, add bedrift
do $$
declare r jsonb;
begin
  if not public.is_tenant_module_enabled('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'website_kompis') then
    raise exception 'FAIL both lost website before';
  end if;
  r := public.activate_platform_portal_customer_kompis_bedrift(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3',
    'synthetic both-products grant for rehearsal',
    true,
    'bpk-both-001'
  );
  if not public.is_tenant_module_enabled('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'website_kompis') then
    raise exception 'FAIL both lost website after';
  end if;
  if not public.is_tenant_module_enabled('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'kompis_bedrift') then
    raise exception 'FAIL both missing bedrift';
  end if;
  raise notice 'PASS both_products';
end $$;

-- 9) cross-tenant isolation: web-only still without bedrift
do $$
begin
  if public.is_tenant_module_enabled('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'kompis_bedrift') then
    raise exception 'FAIL cross tenant leak to web-only';
  end if;
  if not public.is_tenant_module_enabled('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'website_kompis') then
    raise exception 'FAIL web-only website mutated';
  end if;
  raise notice 'PASS cross_tenant_isolation';
end $$;

-- 10) deactivate bedrift-only
do $$
declare r jsonb;
begin
  r := public.deactivate_platform_portal_customer_kompis_bedrift(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
    'synthetic deactivate rehearsal',
    true,
    'bpk-bedrift-deact-001'
  );
  if public.is_tenant_module_enabled('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'kompis_bedrift') then
    raise exception 'FAIL still enabled after deactivate %', r;
  end if;
  raise notice 'PASS deactivate';
end $$;

-- 11) functions exist with expected identity args
do $$
begin
  if to_regprocedure('public.get_platform_portal_customer_kompis_bedrift_status(uuid)') is null then
    raise exception 'FAIL missing status fn';
  end if;
  if to_regprocedure('public.activate_platform_portal_customer_kompis_bedrift(uuid,text,boolean,text)') is null then
    raise exception 'FAIL missing activate fn';
  end if;
  if to_regprocedure('public.deactivate_platform_portal_customer_kompis_bedrift(uuid,text,boolean,text)') is null then
    raise exception 'FAIL missing deactivate fn';
  end if;
  raise notice 'PASS function_signatures';
end $$;

select 'ALL_CONTRACT_TESTS_PASSED' as result;
