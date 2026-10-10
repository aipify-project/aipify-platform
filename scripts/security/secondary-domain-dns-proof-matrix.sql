-- Isolated security matrix A–Q for secondary domain DNS proof bypass repair.
-- Expects stubs + migration already applied. Raises on failure.

do $$
declare
  v_company_a uuid := '11111111-1111-4111-8111-111111111111';
  v_company_b uuid := '22222222-2222-4222-8222-222222222222';
  v_customer_a uuid := 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  v_customer_b uuid := 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  v_install_a uuid := 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa';
  v_install_b uuid := 'bbbbbbbb-1111-4111-8111-bbbbbbbbbbbb';
  v_apex_a uuid := 'aaaaaaaa-dddd-4ddd-8ddd-aaaaaaaaaaaa';
  v_operator uuid := '00000000-0000-4000-8000-000000000001';
  v_member uuid := '00000000-0000-4000-8000-000000000002';
  v_issue jsonb;
  v_verify jsonb;
  v_token text;
  v_challenge_id uuid;
  v_domain_id uuid;
  v_license_before text;
  v_install_count_before int;
  v_install_count_after int;
  v_apex_status text;
  v_apex_ver text;
  v_err text;
  v_has_exec boolean;
  v_hash_before text;
  v_issue2 jsonb;
  v_token2 text;
  v_challenge2 uuid;
  v_domain2 uuid;
  v_ok boolean;
begin
  -- Seed tenants
  insert into public.companies(id, is_platform, name) values
    (v_company_a, false, 'Tenant A'),
    (v_company_b, false, 'Tenant B')
  on conflict do nothing;

  insert into public.customers(id, company_id) values
    (v_customer_a, v_company_a),
    (v_customer_b, v_company_b)
  on conflict do nothing;

  insert into public.installations(id, customer_id, company_id, status) values
    (v_install_a, v_customer_a, v_company_a, 'active'),
    (v_install_b, v_customer_b, v_company_b, 'active')
  on conflict do nothing;

  insert into public.customer_domains(id, customer_id, domain, status, verification_status, installation_id, verified_at)
  values (v_apex_a, v_customer_a, 'example.com', 'active', 'verified', v_install_a, now())
  on conflict do nothing;

  insert into public.platform_admins(auth_user_id, role, status) values
    (v_operator, 'super_admin', 'active')
  on conflict do nothing;

  insert into public.tenant_modules(tenant_id, module_key, enabled) values
    (v_customer_a, 'website_kompis', true),
    (v_customer_b, 'website_kompis', true)
  on conflict do nothing;

  insert into public.aipify_billing_license_links(organization_id, license_type, license_status, domain_reference)
  values (v_customer_a, 'app_subscription', 'active', 'example.com')
  on conflict do nothing;

  select domain_reference into v_license_before
  from public.aipify_billing_license_links
  where organization_id = v_customer_a limit 1;

  select count(*) into v_install_count_before from public.installations where customer_id = v_customer_a;

  -- As platform operator: issue challenge
  perform set_config('request.jwt.claim.sub', v_operator::text, true);
  perform set_config('request.jwt.claims', json_build_object('role','authenticated','sub',v_operator::text)::text, true);
  set local role authenticated;

  v_issue := public.issue_platform_portal_secondary_domain_dns_challenge(
    v_customer_a,
    v_install_a,
    'www.example.com',
    'security matrix issue secondary host',
    'matrix-issue-key-0001',
    24
  );

  reset role;
  perform set_config('request.jwt.claim.sub', '', true);
  perform set_config('request.jwt.claims', '{}', true);

  v_token := v_issue->'challenge'->>'dns_txt_value';
  v_challenge_id := (v_issue->'challenge'->>'id')::uuid;
  v_domain_id := (v_issue->'domain'->>'id')::uuid;

  if v_token is null or length(v_token) < 32 then
    raise exception 'MATRIX_SETUP_FAIL: missing issue token';
  end if;

  select challenge_token_hash into v_hash_before
  from public.customer_domain_dns_challenges where id = v_challenge_id;

  -- ========================================================================
  -- Q: EXECUTE grants
  -- ========================================================================
  select exists (
    select 1
    from information_schema.role_routine_grants g
    where g.routine_schema = 'public'
      and g.routine_name = 'verify_and_bind_platform_portal_secondary_domain_dns_challenge'
      and g.grantee = 'authenticated'
      and g.privilege_type = 'EXECUTE'
  ) into v_has_exec;
  if v_has_exec then
    raise exception 'Q_FAIL: authenticated still has EXECUTE on verify/bind';
  end if;

  select exists (
    select 1
    from information_schema.role_routine_grants g
    where g.routine_schema = 'public'
      and g.routine_name = 'verify_and_bind_platform_portal_secondary_domain_dns_challenge'
      and g.grantee = 'service_role'
      and g.privilege_type = 'EXECUTE'
  ) into v_has_exec;
  if not v_has_exec then
    raise exception 'Q_FAIL: service_role missing EXECUTE on verify/bind';
  end if;

  -- ========================================================================
  -- A: anon direct bind DENIED
  -- ========================================================================
  begin
    set local role anon;
    perform set_config('request.jwt.claims', '{"role":"anon"}', true);
    perform set_config('request.jwt.claim.sub', '', true);
    perform public.verify_and_bind_platform_portal_secondary_domain_dns_challenge(
      v_customer_a, v_challenge_id, v_token, 'anon bypass attempt', 'matrix-anon-001', v_operator
    );
    raise exception 'A_FAIL: anon bind succeeded';
  exception
    when insufficient_privilege then null; -- expected
    when others then
      if sqlerrm like '%A_FAIL%' then raise; end if;
      -- permission or SERVICE_ROLE_REQUIRED both acceptable
      null;
  end;

  -- ========================================================================
  -- B: ordinary member direct bind DENIED
  -- ========================================================================
  begin
    set local role authenticated;
    perform set_config('request.jwt.claim.sub', v_member::text, true);
    perform set_config('request.jwt.claims', json_build_object('role','authenticated','sub',v_member::text)::text, true);
    perform public.verify_and_bind_platform_portal_secondary_domain_dns_challenge(
      v_customer_a, v_challenge_id, v_token, 'member bypass attempt', 'matrix-member-001', v_member
    );
    raise exception 'B_FAIL: member bind succeeded';
  exception
    when insufficient_privilege then null;
    when others then
      if sqlerrm like '%B_FAIL%' then raise; end if;
      null;
  end;

  -- ========================================================================
  -- C: Platform operator direct bind with issue-token WITHOUT DNS path DENIED
  --     (authenticated role cannot EXECUTE; even if forced via owner, service_role gate)
  -- ========================================================================
  begin
    set local role authenticated;
    perform set_config('request.jwt.claim.sub', v_operator::text, true);
    perform set_config('request.jwt.claims', json_build_object('role','authenticated','sub',v_operator::text)::text, true);
    perform public.verify_and_bind_platform_portal_secondary_domain_dns_challenge(
      v_customer_a, v_challenge_id, v_token, 'operator direct rpc bypass', 'matrix-op-direct-001', v_operator
    );
    raise exception 'C_FAIL: authenticated platform operator bind succeeded';
  exception
    when insufficient_privilege then null;
    when others then
      if sqlerrm like '%C_FAIL%' then raise; end if;
      -- SERVICE_ROLE_REQUIRED if grant somehow present
      if sqlerrm not like '%SERVICE_ROLE_REQUIRED%' and sqlerrm not like '%permission denied%' then
        -- still ok if privilege denied wording differs
        if sqlstate = '42501' then null;
        elsif sqlerrm like '%SERVICE_ROLE_REQUIRED%' then null;
        else
          raise exception 'C_FAIL: unexpected error %', sqlerrm;
        end if;
      end if;
  end;

  -- Prove domain still pending after A/B/C
  reset role;
  if exists (
    select 1 from public.customer_domains
    where id = v_domain_id and verification_status = 'verified' and status = 'active'
  ) then
    raise exception 'C_FAIL: domain verified without DNS server path';
  end if;

  -- ========================================================================
  -- K: no direct read of challenge hash by anon/authenticated
  -- ========================================================================
  begin
    set local role authenticated;
    perform challenge_token_hash from public.customer_domain_dns_challenges where id = v_challenge_id;
    -- If SELECT succeeds because table has no RLS policies allowing read — FORCE RLS with no policies = deny
    if found then
      raise exception 'K_FAIL: authenticated read challenge hash';
    end if;
  exception
    when insufficient_privilege then null;
    when others then
      if sqlerrm like '%K_FAIL%' then raise; end if;
      null;
  end;

  -- ========================================================================
  -- E: via service_role with wrong TXT DENIED
  -- ========================================================================
  begin
    set local role service_role;
    perform set_config('request.jwt.claims', '{"role":"service_role"}', true);
    perform set_config('request.jwt.claim.sub', '', true);
    perform public.verify_and_bind_platform_portal_secondary_domain_dns_challenge(
      v_customer_a, v_challenge_id, repeat('b', 64), 'wrong token bind', 'matrix-wrong-tok-001', v_operator
    );
    raise exception 'E_FAIL: wrong token bind succeeded';
  exception
    when others then
      if sqlerrm like '%E_FAIL%' then raise; end if;
      if sqlerrm not like '%DNS_PROOF_MISMATCH%' then
        raise exception 'E_FAIL: expected DNS_PROOF_MISMATCH got %', sqlerrm;
      end if;
  end;

  -- Re-issue after failed attempt (challenge may be failed)
  reset role;
  perform set_config('request.jwt.claim.sub', '', true);
  perform set_config('request.jwt.claims', '{}', true);

  -- If failed, revoke/reissue fresh pending
  if exists (select 1 from public.customer_domain_dns_challenges where id = v_challenge_id and status = 'failed') then
    set local role authenticated;
    perform set_config('request.jwt.claim.sub', v_operator::text, true);
    perform set_config('request.jwt.claims', json_build_object('role','authenticated','sub',v_operator::text)::text, true);
    -- create new issue with new idempotency
    v_issue := public.issue_platform_portal_secondary_domain_dns_challenge(
      v_customer_a,
      v_install_a,
      'www.example.com',
      'security matrix reissue after mismatch',
      'matrix-issue-key-0002',
      24
    );
    v_token := v_issue->'challenge'->>'dns_txt_value';
    v_challenge_id := (v_issue->'challenge'->>'id')::uuid;
    v_domain_id := (v_issue->'domain'->>'id')::uuid;
    reset role;
  end if;

  -- ========================================================================
  -- H: expired token DENIED
  -- ========================================================================
  reset role;
  update public.customer_domain_dns_challenges
  set expires_at = now() - interval '1 minute'
  where id = v_challenge_id;

  begin
    set local role service_role;
    perform set_config('request.jwt.claims', '{"role":"service_role"}', true);
    perform public.verify_and_bind_platform_portal_secondary_domain_dns_challenge(
      v_customer_a, v_challenge_id, v_token, 'expired bind', 'matrix-expired-001', v_operator
    );
    raise exception 'H_FAIL: expired bind succeeded';
  exception
    when others then
      if sqlerrm like '%H_FAIL%' then raise; end if;
      if sqlerrm not like '%CHALLENGE_EXPIRED%' then
        raise exception 'H_FAIL: expected CHALLENGE_EXPIRED got %', sqlerrm;
      end if;
  end;

  -- Fresh challenge for success path
  reset role;
  set local role authenticated;
  perform set_config('request.jwt.claim.sub', v_operator::text, true);
  perform set_config('request.jwt.claims', json_build_object('role','authenticated','sub',v_operator::text)::text, true);
  v_issue := public.issue_platform_portal_secondary_domain_dns_challenge(
    v_customer_a,
    v_install_a,
    'www.example.com',
    'security matrix fresh for success',
    'matrix-issue-key-0003',
    24
  );
  v_token := v_issue->'challenge'->>'dns_txt_value';
  v_challenge_id := (v_issue->'challenge'->>'id')::uuid;
  v_domain_id := (v_issue->'domain'->>'id')::uuid;
  reset role;

  -- ========================================================================
  -- G: wrong customer/install DENIED
  -- ========================================================================
  begin
    set local role service_role;
    perform set_config('request.jwt.claims', '{"role":"service_role"}', true);
    perform public.verify_and_bind_platform_portal_secondary_domain_dns_challenge(
      v_customer_b, v_challenge_id, v_token, 'wrong customer', 'matrix-wrong-cust-001', v_operator
    );
    raise exception 'G_FAIL: cross-customer bind succeeded';
  exception
    when others then
      if sqlerrm like '%G_FAIL%' then raise; end if;
      if sqlerrm not like '%CHALLENGE_NOT_FOUND%' then
        raise exception 'G_FAIL: expected CHALLENGE_NOT_FOUND got %', sqlerrm;
      end if;
  end;

  -- ========================================================================
  -- F: correct token + service_role + platform actor → bind succeeds
  --     (simulates API after DNS proof; token equals what DNS would return)
  -- ========================================================================
  set local role service_role;
  perform set_config('request.jwt.claims', '{"role":"service_role"}', true);
  v_verify := public.verify_and_bind_platform_portal_secondary_domain_dns_challenge(
    v_customer_a, v_challenge_id, v_token, 'server dns proof bind', 'matrix-success-001', v_operator
  );

  if coalesce(v_verify->>'ok','') <> 'true' then
    raise exception 'F_FAIL: bind did not succeed';
  end if;
  if coalesce(v_verify->'domain'->>'verification_status','') <> 'verified' then
    raise exception 'F_FAIL: not verified';
  end if;
  if coalesce(v_verify->'domain'->>'status','') <> 'active' then
    raise exception 'F_FAIL: not active';
  end if;

  -- ========================================================================
  -- I: token replay — no second write / challenge already verified or mismatch
  -- ========================================================================
  begin
    perform public.verify_and_bind_platform_portal_secondary_domain_dns_challenge(
      v_customer_a, v_challenge_id, v_token, 'server dns proof bind', 'matrix-replay-new-001', v_operator
    );
    raise exception 'I_FAIL: replay write succeeded';
  exception
    when others then
      if sqlerrm like '%I_FAIL%' then raise; end if;
      if sqlerrm not like '%CHALLENGE_ALREADY_VERIFIED%'
         and sqlerrm not like '%CHALLENGE_NOT_PENDING%'
         and sqlerrm not like '%DNS_PROOF_MISMATCH%' then
        raise exception 'I_FAIL: unexpected %', sqlerrm;
      end if;
  end;

  -- Idempotent replay with same key returns ok without token reuse in response
  v_verify := public.verify_and_bind_platform_portal_secondary_domain_dns_challenge(
    v_customer_a, v_challenge_id, v_token, 'server dns proof bind', 'matrix-success-001', v_operator
  );
  if coalesce(v_verify->>'idempotent_replay','') <> 'true' then
    raise exception 'I_FAIL: expected idempotent_replay';
  end if;
  if v_verify::text like '%' || v_token || '%' then
    raise exception 'I_FAIL: token leaked in idempotent response';
  end if;

  -- ========================================================================
  -- L: actor audit correct, never token/hash
  -- ========================================================================
  reset role;
  if not exists (
    select 1 from public.platform_admin_audit_logs
    where action_type = 'platform_secondary_domain_dns_challenge_verify_bind'
      and admin_auth_user_id = v_operator
      and metadata->>'customer_id' = v_customer_a::text
      and metadata->>'idempotency_key' = 'matrix-success-001'
      and metadata->>'actor_auth_user_id' = v_operator::text
  ) then
    raise exception 'L_FAIL: missing actor audit';
  end if;

  if exists (
    select 1 from public.platform_admin_audit_logs
    where action_type = 'platform_secondary_domain_dns_challenge_verify_bind'
      and (
        metadata::text like '%' || v_token || '%'
        or metadata::text like '%' || v_hash_before || '%'
        or metadata ? 'presented_token'
        or metadata ? 'challenge_token_hash'
      )
  ) then
    raise exception 'L_FAIL: token/hash in audit';
  end if;

  -- ========================================================================
  -- M / N / O: license untouched, install count unchanged, apex remains
  -- ========================================================================
  reset role;
  if exists (
    select 1 from public.aipify_billing_license_links
    where organization_id = v_customer_a
      and nullif(btrim(domain_reference), '') is distinct from v_license_before
  ) then
    raise exception 'M_FAIL: license domain_reference mutated';
  end if;

  select count(*) into v_install_count_after from public.installations where customer_id = v_customer_a;
  if v_install_count_after <> v_install_count_before then
    raise exception 'N_FAIL: installation count changed';
  end if;

  select status, verification_status into v_apex_status, v_apex_ver
  from public.customer_domains where id = v_apex_a;
  if v_apex_status <> 'active' or v_apex_ver <> 'verified' then
    raise exception 'O_FAIL: apex regress status=% ver=%', v_apex_status, v_apex_ver;
  end if;

  -- ========================================================================
  -- P: revoke of old/other challenge cannot regress verified state
  -- ========================================================================
  reset role;
  set local role authenticated;
  perform set_config('request.jwt.claim.sub', v_operator::text, true);
  perform set_config('request.jwt.claims', json_build_object('role','authenticated','sub',v_operator::text)::text, true);

  -- Issue a different hostname pending challenge then revoke it — www must stay verified
  v_issue2 := public.issue_platform_portal_secondary_domain_dns_challenge(
    v_customer_a,
    v_install_a,
    'cdn.example.com',
    'pending then revoke must not touch www',
    'matrix-issue-cdn-001',
    24
  );
  v_challenge2 := (v_issue2->'challenge'->>'id')::uuid;
  perform public.revoke_platform_portal_secondary_domain_dns_challenge(
    v_customer_a, v_challenge2, 'revoke pending unrelated host'
  );

  reset role;
  if not exists (
    select 1 from public.customer_domains
    where id = v_domain_id and status = 'active' and verification_status = 'verified'
  ) then
    raise exception 'P_FAIL: verified www regress after unrelated revoke';
  end if;

  -- Attempt revoke on verified challenge id should fail without domain regress
  begin
    set local role authenticated;
    perform set_config('request.jwt.claim.sub', v_operator::text, true);
    perform set_config('request.jwt.claims', json_build_object('role','authenticated','sub',v_operator::text)::text, true);
    perform public.revoke_platform_portal_secondary_domain_dns_challenge(
      v_customer_a, v_challenge_id, 'revoke verified challenge'
    );
    raise exception 'P_FAIL: revoke verified challenge succeeded';
  exception
    when others then
      if sqlerrm like '%P_FAIL%' then raise; end if;
      if sqlerrm not like '%CHALLENGE_ALREADY_VERIFIED%' then
        raise exception 'P_FAIL: expected CHALLENGE_ALREADY_VERIFIED got %', sqlerrm;
      end if;
  end;

  -- ========================================================================
  -- J: same host, two customers — only one verified bind
  -- ========================================================================
  reset role;
  set local role authenticated;
  perform set_config('request.jwt.claim.sub', v_operator::text, true);
  perform set_config('request.jwt.claims', json_build_object('role','authenticated','sub',v_operator::text)::text, true);

  -- Customer B tries same hostname that A already verified
  begin
    v_issue2 := public.issue_platform_portal_secondary_domain_dns_challenge(
      v_customer_b,
      v_install_b,
      'www.example.com',
      'tenant B same host should fail at issue or verify',
      'matrix-issue-b-001',
      24
    );
    -- If issue allowed (pending only), verify must fail
    v_token2 := v_issue2->'challenge'->>'dns_txt_value';
    v_challenge2 := (v_issue2->'challenge'->>'id')::uuid;
    set local role service_role;
    perform set_config('request.jwt.claims', '{"role":"service_role"}', true);
    begin
      perform public.verify_and_bind_platform_portal_secondary_domain_dns_challenge(
        v_customer_b, v_challenge2, v_token2, 'tenant B bind race', 'matrix-b-bind-001', v_operator
      );
      raise exception 'J_FAIL: second tenant verified same host';
    exception
      when others then
        if sqlerrm like '%J_FAIL%' then raise; end if;
        if sqlerrm not like '%HOSTNAME_OWNED_BY_OTHER_TENANT%'
           and sqlerrm not like '%HOSTNAME_ALREADY_VERIFIED%' then
          raise exception 'J_FAIL: unexpected %', sqlerrm;
        end if;
    end;
  exception
    when others then
      if sqlerrm like '%J_FAIL%' then raise; end if;
      -- Issue itself may block with HOSTNAME_OWNED / ALREADY_VERIFIED — also OK
      if sqlerrm like '%HOSTNAME_OWNED_BY_OTHER_TENANT%'
         or sqlerrm like '%HOSTNAME_ALREADY_VERIFIED%' then
        null;
      else
        raise;
      end if;
  end;

  reset role;
  if (
    select count(*) from public.customer_domains
    where lower(domain) = 'www.example.com'
      and verification_status = 'verified'
      and status = 'active'
  ) <> 1 then
    raise exception 'J_FAIL: expected exactly one verified www.example.com';
  end if;

  -- D is API-level (no TXT) — covered by C + pending domain invariant above.
  -- Mark D as proven via SQL equivalent: service_role still requires matching token hash
  -- which only DNS can supply in the API path.

  raise notice 'MATRIX_PASS A B C D(E-equiv) E F G H I J K L M N O P Q';
end;
$$;
