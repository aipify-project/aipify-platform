-- CORE.SECONDARY.HOST.DNS.VERIFY.EXISTING.INSTALL.V1
-- Additive contract: register a secondary hostname as pending, prove ownership via
-- DNS TXT (token presented from DNS), then bind to an EXISTING installation.
-- Does NOT create installations, mutate license.domain_reference, or set verified
-- without a matching challenge token hash.
-- Feature owner: PLATFORM (operator) · Runtime trust remains customer_domains.
-- SECURITY REPAIR: verify/bind is service_role-only; DNS proof stays in trusted server runtime.
-- Migration version 20261937500000 avoids Production ledger collision on 20261937300000.

-- ---------------------------------------------------------------------------
-- 1. Challenge table (token stored as SHA-256 hex only)
-- ---------------------------------------------------------------------------
create table if not exists public.customer_domain_dns_challenges (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  installation_id uuid not null references public.installations (id) on delete cascade,
  domain_id uuid not null references public.customer_domains (id) on delete cascade,
  hostname text not null,
  challenge_token_hash text not null,
  dns_record_name text not null,
  status text not null default 'pending'
    check (status in ('pending', 'verified', 'expired', 'revoked', 'failed')),
  expires_at timestamptz not null,
  verified_at timestamptz,
  revoked_at timestamptz,
  created_by_auth_user_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customer_domain_dns_challenges_hostname_shape
    check (hostname ~ '^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$'),
  constraint customer_domain_dns_challenges_hash_shape
    check (challenge_token_hash ~ '^[a-f0-9]{64}$')
);

create unique index if not exists customer_domain_dns_challenges_pending_host_uidx
  on public.customer_domain_dns_challenges (customer_id, hostname)
  where status = 'pending';

create index if not exists customer_domain_dns_challenges_domain_id_idx
  on public.customer_domain_dns_challenges (domain_id);

create index if not exists customer_domain_dns_challenges_install_id_idx
  on public.customer_domain_dns_challenges (installation_id);

alter table public.customer_domain_dns_challenges enable row level security;
alter table public.customer_domain_dns_challenges force row level security;

revoke all on table public.customer_domain_dns_challenges from public, anon, authenticated;
-- No direct table grants. Mutations only via security definer RPCs.

-- ---------------------------------------------------------------------------
-- 2. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._secondary_domain_dns_challenge_hash(p_token text)
returns text
language sql
immutable
set search_path = public
as $$
  select encode(extensions.digest(convert_to(p_token, 'UTF8'), 'sha256'), 'hex');
$$;

revoke all on function public._secondary_domain_dns_challenge_hash(text)
  from public, anon, authenticated;

create or replace function public._secondary_domain_dns_record_name(p_hostname text)
returns text
language sql
immutable
set search_path = public
as $$
  select '_aipify-domain-challenge.' || p_hostname;
$$;

revoke all on function public._secondary_domain_dns_record_name(text)
  from public, anon, authenticated;

create or replace function public._secondary_domain_assert_install_for_customer(
  p_customer_id uuid,
  p_installation_id uuid
)
returns public.installations
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_install public.installations;
begin
  select cu.company_id
  into v_company_id
  from public.customers cu
  join public.companies co on co.id = cu.company_id
  where cu.id = p_customer_id
    and coalesce(co.is_platform, false) = false;

  if v_company_id is null then
    raise exception 'CUSTOMER_NOT_FOUND' using errcode = 'P0001';
  end if;

  -- Exact customer ownership only — no company_id OR fallback (prevents cross-tenant bind).
  select *
  into v_install
  from public.installations i
  where i.id = p_installation_id
    and i.customer_id = p_customer_id
    and i.company_id = v_company_id
    and i.revoked_at is null
    and lower(coalesce(i.status, '')) in ('active', 'ready', 'installing', 'warning')
  limit 1;

  if v_install.id is null then
    raise exception 'INSTALLATION_NOT_ELIGIBLE' using errcode = 'P0001';
  end if;

  return v_install;
end;
$$;

revoke all on function public._secondary_domain_assert_install_for_customer(uuid, uuid)
  from public, anon, authenticated;

-- Service-role gate for bind: authenticated JWT cannot invoke verify/bind.
create or replace function public._secondary_domain_require_service_role()
returns void
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if coalesce(auth.jwt() ->> 'role', '') is distinct from 'service_role' then
    raise exception 'SERVICE_ROLE_REQUIRED' using errcode = 'P0001';
  end if;
end;
$$;

revoke all on function public._secondary_domain_require_service_role()
  from public, anon, authenticated;

-- Actor must be a real platform admin; client cannot spoof without service_role.
create or replace function public._secondary_domain_assert_platform_actor(p_actor_auth_user_id uuid)
returns void
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if p_actor_auth_user_id is null then
    raise exception 'BIND_ACTOR_REQUIRED' using errcode = 'P0001';
  end if;

  if not exists (
    select 1
    from public.platform_admins pa
    where pa.auth_user_id = p_actor_auth_user_id
      and pa.role in ('super_admin', 'platform_support')
      and coalesce(pa.status, 'active') = 'active'
  ) then
    raise exception 'BIND_ACTOR_NOT_PLATFORM_ADMIN' using errcode = 'P0001';
  end if;
end;
$$;

revoke all on function public._secondary_domain_assert_platform_actor(uuid)
  from public, anon, authenticated;

-- Audit write that preserves actor identity under service_role (auth.uid() is null).
create or replace function public._secondary_domain_record_bind_audit(
  p_actor_auth_user_id uuid,
  p_action_type text,
  p_target_type text,
  p_target_id text,
  p_metadata jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_meta jsonb;
begin
  perform public._secondary_domain_require_service_role();
  perform public._secondary_domain_assert_platform_actor(p_actor_auth_user_id);

  v_meta := coalesce(p_metadata, '{}'::jsonb);
  -- never include token or token hash
  if v_meta ? 'presented_token'
     or v_meta ? 'challenge_token'
     or v_meta ? 'challenge_token_hash'
     or v_meta ? 'dns_txt_value' then
    raise exception 'TOKEN_MATERIAL_IN_AUDIT_FORBIDDEN' using errcode = 'P0001';
  end if;

  insert into public.platform_admin_audit_logs (
    admin_auth_user_id,
    action_type,
    target_type,
    target_id,
    metadata
  )
  values (
    p_actor_auth_user_id,
    p_action_type,
    p_target_type,
    p_target_id,
    v_meta
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public._secondary_domain_record_bind_audit(uuid, text, text, text, jsonb)
  from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. Issue challenge (pending domain + hashed token; plaintext returned once)
-- ---------------------------------------------------------------------------
create or replace function public.issue_platform_portal_secondary_domain_dns_challenge(
  p_customer_id uuid,
  p_installation_id uuid,
  p_hostname text,
  p_internal_reason text,
  p_idempotency_key text,
  p_ttl_hours integer default 24
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reason text;
  v_key text;
  v_hostname text;
  v_payload_hash text;
  v_prior jsonb;
  v_install public.installations;
  v_domain public.customer_domains;
  v_challenge public.customer_domain_dns_challenges;
  v_token text;
  v_token_hash text;
  v_record_name text;
  v_ttl integer;
  v_license_before text;
  v_install_count_before integer;
  v_existing_verified public.customer_domains;
begin
  perform public._ppsf258_require_platform_access();

  if p_customer_id is null then
    raise exception 'INVALID_CUSTOMER' using errcode = 'P0001';
  end if;
  if p_installation_id is null then
    raise exception 'INVALID_INSTALLATION' using errcode = 'P0001';
  end if;

  v_reason := nullif(btrim(coalesce(p_internal_reason, '')), '');
  if v_reason is null or char_length(v_reason) < 3 or char_length(v_reason) > 500 then
    raise exception 'INVALID_INTERNAL_REASON' using errcode = 'P0001';
  end if;

  v_key := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  if v_key is null or char_length(v_key) < 8 or char_length(v_key) > 128 then
    raise exception 'INVALID_IDEMPOTENCY_KEY' using errcode = 'P0001';
  end if;

  v_ttl := coalesce(p_ttl_hours, 24);
  if v_ttl < 1 or v_ttl > 168 then
    raise exception 'INVALID_TTL' using errcode = 'P0001';
  end if;

  begin
    v_hostname := public._platform_portal_normalize_hostname(p_hostname);
  exception
    when others then
      raise exception 'INVALID_HOSTNAME' using errcode = 'P0001';
  end;

  if v_hostname is null then
    raise exception 'INVALID_HOSTNAME' using errcode = 'P0001';
  end if;

  v_payload_hash := md5(
    p_customer_id::text || '|' ||
    p_installation_id::text || '|' ||
    v_hostname || '|' ||
    v_reason || '|' ||
    v_ttl::text
  );

  select metadata
  into v_prior
  from public.platform_admin_audit_logs
  where action_type = 'platform_secondary_domain_dns_challenge_issue'
    and metadata->>'idempotency_key' = v_key
  order by created_at desc
  limit 1;

  if v_prior is not null then
    if coalesce(v_prior->>'payload_hash', '') <> v_payload_hash then
      raise exception 'IDEMPOTENCY_CONFLICT' using errcode = 'P0001';
    end if;

    select *
    into v_challenge
    from public.customer_domain_dns_challenges
    where id = nullif(v_prior->>'challenge_id', '')::uuid;

    select *
    into v_domain
    from public.customer_domains
    where id = coalesce(v_challenge.domain_id, nullif(v_prior->>'domain_id', '')::uuid);

    if v_challenge.id is null or v_domain.id is null then
      raise exception 'IDEMPOTENCY_REPLAY_MISSING' using errcode = 'P0001';
    end if;

    -- Replay never re-returns plaintext token.
    return jsonb_build_object(
      'ok', true,
      'idempotent_replay', true,
      'customer_id', p_customer_id,
      'installation_id', p_installation_id,
      'domain', jsonb_build_object(
        'id', v_domain.id,
        'hostname', v_domain.domain,
        'status', v_domain.status,
        'verification_status', v_domain.verification_status,
        'installation_id', v_domain.installation_id
      ),
      'challenge', jsonb_build_object(
        'id', v_challenge.id,
        'status', v_challenge.status,
        'dns_record_name', v_challenge.dns_record_name,
        'expires_at', v_challenge.expires_at,
        'token_returned', false
      ),
      'license_domain_reference_unchanged', true,
      'installation_created', false
    );
  end if;

  -- Snapshot invariants (must remain unchanged by this RPC).
  select nullif(btrim(ll.domain_reference), '')
  into v_license_before
  from public.aipify_billing_license_links ll
  where ll.organization_id = p_customer_id
    and lower(coalesce(ll.license_type, '')) = 'app_subscription'
  order by (lower(coalesce(ll.license_status, '')) = 'active') desc, ll.created_at desc nulls last
  limit 1;

  select count(*)::integer
  into v_install_count_before
  from public.installations i
  where i.customer_id = p_customer_id
     or i.company_id = (
       select company_id from public.customers where id = p_customer_id
     );

  v_install := public._secondary_domain_assert_install_for_customer(
    p_customer_id,
    p_installation_id
  );

  -- Reject if website_kompis not entitled (informational gate for operator intent).
  if not coalesce(public.is_tenant_module_enabled(p_customer_id, 'website_kompis'), false) then
    raise exception 'WEBSITE_KOMPIS_NOT_ENTITLED' using errcode = 'P0001';
  end if;

  -- Cross-tenant / already-verified conflict on exact hostname.
  select *
  into v_existing_verified
  from public.customer_domains cd
  where lower(btrim(cd.domain)) = v_hostname
    and lower(coalesce(cd.verification_status, '')) = 'verified'
    and lower(coalesce(cd.status, '')) in ('active', 'pending')
  limit 1;

  if v_existing_verified.id is not null then
    if v_existing_verified.customer_id <> p_customer_id then
      raise exception 'HOSTNAME_OWNED_BY_OTHER_TENANT' using errcode = 'P0001';
    end if;
    raise exception 'HOSTNAME_ALREADY_VERIFIED' using errcode = 'P0001';
  end if;

  -- Upsert pending customer_domains row WITHOUT verified/active trust.
  select *
  into v_domain
  from public.customer_domains cd
  where cd.customer_id = p_customer_id
    and lower(btrim(cd.domain)) = v_hostname
  limit 1;

  if v_domain.id is null then
    insert into public.customer_domains (
      customer_id,
      installation_id,
      domain,
      status,
      verification_status,
      verification_method
    )
    values (
      p_customer_id,
      null, -- bind only after DNS proof
      v_hostname,
      'pending',
      'pending',
      'dns_txt'
    )
    returning * into v_domain;
  else
    if lower(coalesce(v_domain.verification_status, '')) = 'verified'
       and lower(coalesce(v_domain.status, '')) = 'active' then
      raise exception 'HOSTNAME_ALREADY_VERIFIED' using errcode = 'P0001';
    end if;

    update public.customer_domains
    set
      status = 'pending',
      verification_status = 'pending',
      verification_method = 'dns_txt',
      installation_id = null,
      verified_at = null,
      updated_at = now()
    where id = v_domain.id
    returning * into v_domain;
  end if;

  -- Revoke any prior pending challenge for this host.
  update public.customer_domain_dns_challenges
  set
    status = 'revoked',
    revoked_at = now(),
    updated_at = now()
  where customer_id = p_customer_id
    and hostname = v_hostname
    and status = 'pending';

  v_token := encode(extensions.gen_random_bytes(32), 'hex');
  v_token_hash := public._secondary_domain_dns_challenge_hash(v_token);
  v_record_name := public._secondary_domain_dns_record_name(v_hostname);

  insert into public.customer_domain_dns_challenges (
    customer_id,
    installation_id,
    domain_id,
    hostname,
    challenge_token_hash,
    dns_record_name,
    status,
    expires_at,
    created_by_auth_user_id
  )
  values (
    p_customer_id,
    v_install.id,
    v_domain.id,
    v_hostname,
    v_token_hash,
    v_record_name,
    'pending',
    now() + make_interval(hours => v_ttl),
    auth.uid()
  )
  returning * into v_challenge;

  -- Invariant: license domain_reference unchanged; no new installation.
  if exists (
    select 1
    from public.aipify_billing_license_links ll
    where ll.organization_id = p_customer_id
      and lower(coalesce(ll.license_type, '')) = 'app_subscription'
      and nullif(btrim(ll.domain_reference), '') is distinct from v_license_before
  ) then
    raise exception 'LICENSE_DOMAIN_REFERENCE_MUTATION_FORBIDDEN' using errcode = 'P0001';
  end if;

  if (
    select count(*)::integer
    from public.installations i
    where i.customer_id = p_customer_id
       or i.company_id = (
         select company_id from public.customers where id = p_customer_id
       )
  ) <> v_install_count_before then
    raise exception 'INSTALLATION_CREATED_FORBIDDEN' using errcode = 'P0001';
  end if;

  perform public.record_platform_admin_audit_event(
    'platform_secondary_domain_dns_challenge_issue',
    'customer_domain',
    v_domain.id::text,
    jsonb_build_object(
      'idempotency_key', v_key,
      'payload_hash', v_payload_hash,
      'customer_id', p_customer_id,
      'installation_id', v_install.id,
      'domain_id', v_domain.id,
      'challenge_id', v_challenge.id,
      'hostname', v_hostname,
      'dns_record_name', v_record_name,
      'expires_at', v_challenge.expires_at,
      'internal_reason', v_reason,
      'license_domain_reference_unchanged', true,
      'installation_created', false
      -- never include token or token hash
    )
  );

  return jsonb_build_object(
    'ok', true,
    'idempotent_replay', false,
    'customer_id', p_customer_id,
    'installation_id', v_install.id,
    'domain', jsonb_build_object(
      'id', v_domain.id,
      'hostname', v_domain.domain,
      'status', v_domain.status,
      'verification_status', v_domain.verification_status,
      'installation_id', v_domain.installation_id
    ),
    'challenge', jsonb_build_object(
      'id', v_challenge.id,
      'status', v_challenge.status,
      'dns_record_name', v_challenge.dns_record_name,
      'dns_txt_value', v_token,
      'expires_at', v_challenge.expires_at,
      'token_returned', true
    ),
    'instructions', jsonb_build_object(
      'record_type', 'TXT',
      'record_name', v_record_name,
      'record_value', v_token,
      'note', 'Publish the TXT record, wait for DNS propagation, then call verify. Do not mark verified manually.'
    ),
    'license_domain_reference_unchanged', true,
    'installation_created', false
  );
end;
$$;

revoke all on function public.issue_platform_portal_secondary_domain_dns_challenge(
  uuid, uuid, text, text, text, integer
) from public, anon;
grant execute on function public.issue_platform_portal_secondary_domain_dns_challenge(
  uuid, uuid, text, text, text, integer
) to authenticated;

-- ---------------------------------------------------------------------------
-- 4. Status (no secrets)
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_portal_secondary_domain_dns_challenge_status(
  p_customer_id uuid,
  p_challenge_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_challenge public.customer_domain_dns_challenges;
  v_domain public.customer_domains;
  v_effective_status text;
begin
  perform public._ppsf258_require_platform_access();

  if p_customer_id is null or p_challenge_id is null then
    return null;
  end if;

  select *
  into v_challenge
  from public.customer_domain_dns_challenges
  where id = p_challenge_id
    and customer_id = p_customer_id;

  if v_challenge.id is null then
    return null;
  end if;

  select *
  into v_domain
  from public.customer_domains
  where id = v_challenge.domain_id;

  v_effective_status := v_challenge.status;
  if v_challenge.status = 'pending' and v_challenge.expires_at <= now() then
    v_effective_status := 'expired';
  end if;

  return jsonb_build_object(
    'customer_id', p_customer_id,
    'challenge', jsonb_build_object(
      'id', v_challenge.id,
      'status', v_effective_status,
      'hostname', v_challenge.hostname,
      'dns_record_name', v_challenge.dns_record_name,
      'installation_id', v_challenge.installation_id,
      'expires_at', v_challenge.expires_at,
      'verified_at', v_challenge.verified_at
    ),
    'domain', case
      when v_domain.id is null then null
      else jsonb_build_object(
        'id', v_domain.id,
        'hostname', v_domain.domain,
        'status', v_domain.status,
        'verification_status', v_domain.verification_status,
        'installation_id', v_domain.installation_id,
        'verified_at', v_domain.verified_at
      )
    end,
    'generated_at', now()
  );
end;
$$;

revoke all on function public.get_platform_portal_secondary_domain_dns_challenge_status(uuid, uuid)
  from public, anon;
grant execute on function public.get_platform_portal_secondary_domain_dns_challenge_status(uuid, uuid)
  to authenticated;

-- ---------------------------------------------------------------------------
-- 5. Verify + bind (server-only: service_role + DNS-presented token + platform actor)
-- ---------------------------------------------------------------------------
drop function if exists public.verify_and_bind_platform_portal_secondary_domain_dns_challenge(
  uuid, uuid, text, text, text
);

create or replace function public.verify_and_bind_platform_portal_secondary_domain_dns_challenge(
  p_customer_id uuid,
  p_challenge_id uuid,
  p_presented_token text,
  p_internal_reason text,
  p_idempotency_key text,
  p_actor_auth_user_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reason text;
  v_key text;
  v_token text;
  v_token_hash text;
  v_prior jsonb;
  v_payload_hash text;
  v_challenge public.customer_domain_dns_challenges;
  v_domain public.customer_domains;
  v_install public.installations;
  v_license_before text;
  v_conflict public.customer_domains;
  v_domain_before jsonb;
begin
  -- Hard boundary: authenticated operators cannot call this RPC directly.
  perform public._secondary_domain_require_service_role();
  perform public._secondary_domain_assert_platform_actor(p_actor_auth_user_id);

  if p_customer_id is null or p_challenge_id is null then
    raise exception 'INVALID_CHALLENGE' using errcode = 'P0001';
  end if;

  v_reason := nullif(btrim(coalesce(p_internal_reason, '')), '');
  if v_reason is null or char_length(v_reason) < 3 or char_length(v_reason) > 500 then
    raise exception 'INVALID_INTERNAL_REASON' using errcode = 'P0001';
  end if;

  v_key := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  if v_key is null or char_length(v_key) < 8 or char_length(v_key) > 128 then
    raise exception 'INVALID_IDEMPOTENCY_KEY' using errcode = 'P0001';
  end if;

  v_token := nullif(btrim(coalesce(p_presented_token, '')), '');
  if v_token is null or char_length(v_token) < 32 or char_length(v_token) > 128 then
    raise exception 'INVALID_PRESENTED_TOKEN' using errcode = 'P0001';
  end if;
  if v_token !~ '^[a-f0-9]+$' then
    raise exception 'INVALID_PRESENTED_TOKEN' using errcode = 'P0001';
  end if;

  v_payload_hash := md5(
    p_customer_id::text || '|' ||
    p_challenge_id::text || '|' ||
    v_reason || '|' ||
    p_actor_auth_user_id::text
  );

  select metadata
  into v_prior
  from public.platform_admin_audit_logs
  where action_type = 'platform_secondary_domain_dns_challenge_verify_bind'
    and metadata->>'idempotency_key' = v_key
    and metadata->>'customer_id' = p_customer_id::text
  order by created_at desc
  limit 1;

  if v_prior is not null then
    if coalesce(v_prior->>'payload_hash', '') <> v_payload_hash then
      raise exception 'IDEMPOTENCY_CONFLICT' using errcode = 'P0001';
    end if;
    if coalesce(v_prior->>'actor_auth_user_id', '') <> p_actor_auth_user_id::text then
      raise exception 'IDEMPOTENCY_CONFLICT' using errcode = 'P0001';
    end if;

    select *
    into v_domain
    from public.customer_domains
    where id = nullif(v_prior->>'domain_id', '')::uuid
      and customer_id = p_customer_id;

    if v_domain.id is null then
      raise exception 'IDEMPOTENCY_REPLAY_MISSING' using errcode = 'P0001';
    end if;

    select *
    into v_challenge
    from public.customer_domain_dns_challenges
    where id = p_challenge_id
      and customer_id = p_customer_id;

    return jsonb_build_object(
      'ok', true,
      'idempotent_replay', true,
      'customer_id', p_customer_id,
      'domain', jsonb_build_object(
        'id', v_domain.id,
        'hostname', v_domain.domain,
        'status', v_domain.status,
        'verification_status', v_domain.verification_status,
        'installation_id', v_domain.installation_id,
        'verified_at', v_domain.verified_at
      ),
      'challenge', jsonb_build_object(
        'id', v_challenge.id,
        'status', v_challenge.status,
        'verified_at', v_challenge.verified_at
      ),
      'license_domain_reference_unchanged', true,
      'installation_created', false
    );
  end if;

  select *
  into v_challenge
  from public.customer_domain_dns_challenges
  where id = p_challenge_id
    and customer_id = p_customer_id
  for update;

  if v_challenge.id is null then
    raise exception 'CHALLENGE_NOT_FOUND' using errcode = 'P0001';
  end if;

  -- Serialize concurrent verify/bind for the same hostname across tenants.
  perform pg_advisory_xact_lock(88117733, hashtext(v_challenge.hostname));

  if v_challenge.status = 'verified' then
    raise exception 'CHALLENGE_ALREADY_VERIFIED' using errcode = 'P0001';
  end if;

  if v_challenge.status in ('revoked', 'failed') then
    raise exception 'CHALLENGE_NOT_PENDING' using errcode = 'P0001';
  end if;

  if v_challenge.status = 'expired' or v_challenge.expires_at <= now() then
    update public.customer_domain_dns_challenges
    set status = 'expired', updated_at = now()
    where id = v_challenge.id;
    raise exception 'CHALLENGE_EXPIRED' using errcode = 'P0001';
  end if;

  if v_challenge.status <> 'pending' then
    raise exception 'CHALLENGE_NOT_PENDING' using errcode = 'P0001';
  end if;

  v_token_hash := public._secondary_domain_dns_challenge_hash(v_token);
  if v_token_hash is distinct from v_challenge.challenge_token_hash then
    update public.customer_domain_dns_challenges
    set status = 'failed', updated_at = now()
    where id = v_challenge.id
      and status = 'pending';
    raise exception 'DNS_PROOF_MISMATCH' using errcode = 'P0001';
  end if;

  -- Re-check install eligibility at bind time (exact customer ownership).
  v_install := public._secondary_domain_assert_install_for_customer(
    p_customer_id,
    v_challenge.installation_id
  );

  if not coalesce(public.is_tenant_module_enabled(p_customer_id, 'website_kompis'), false) then
    raise exception 'WEBSITE_KOMPIS_NOT_ENTITLED' using errcode = 'P0001';
  end if;

  select nullif(btrim(ll.domain_reference), '')
  into v_license_before
  from public.aipify_billing_license_links ll
  where ll.organization_id = p_customer_id
    and lower(coalesce(ll.license_type, '')) = 'app_subscription'
  order by (lower(coalesce(ll.license_status, '')) = 'active') desc, ll.created_at desc nulls last
  limit 1;

  -- Global conflict: another verified active host (re-check under advisory lock).
  select *
  into v_conflict
  from public.customer_domains cd
  where lower(btrim(cd.domain)) = v_challenge.hostname
    and cd.id <> v_challenge.domain_id
    and lower(coalesce(cd.verification_status, '')) = 'verified'
    and lower(coalesce(cd.status, '')) = 'active'
  limit 1;

  if v_conflict.id is not null then
    raise exception 'HOSTNAME_OWNED_BY_OTHER_TENANT' using errcode = 'P0001';
  end if;

  select *
  into v_domain
  from public.customer_domains
  where id = v_challenge.domain_id
    and customer_id = p_customer_id
  for update;

  if v_domain.id is null then
    raise exception 'DOMAIN_NOT_FOUND' using errcode = 'P0001';
  end if;

  -- Exact hostname bind only — never rewrite domain to a different host.
  if lower(btrim(v_domain.domain)) is distinct from v_challenge.hostname then
    raise exception 'HOSTNAME_MISMATCH' using errcode = 'P0001';
  end if;

  v_domain_before := jsonb_build_object(
    'status', v_domain.status,
    'verification_status', v_domain.verification_status,
    'installation_id', v_domain.installation_id
  );

  update public.customer_domains
  set
    status = 'active',
    verification_status = 'verified',
    verification_method = 'dns_txt',
    verified_at = now(),
    installation_id = v_install.id,
    verification_code = null,
    updated_at = now()
  where id = v_domain.id
  returning * into v_domain;

  update public.customer_domain_dns_challenges
  set
    status = 'verified',
    verified_at = now(),
    challenge_token_hash = repeat('0', 64), -- wipe usable hash
    updated_at = now()
  where id = v_challenge.id
  returning * into v_challenge;

  -- Hard invariants
  if exists (
    select 1
    from public.aipify_billing_license_links ll
    where ll.organization_id = p_customer_id
      and lower(coalesce(ll.license_type, '')) = 'app_subscription'
      and nullif(btrim(ll.domain_reference), '') is distinct from v_license_before
  ) then
    raise exception 'LICENSE_DOMAIN_REFERENCE_MUTATION_FORBIDDEN' using errcode = 'P0001';
  end if;

  perform public._secondary_domain_record_bind_audit(
    p_actor_auth_user_id,
    'platform_secondary_domain_dns_challenge_verify_bind',
    'customer_domain',
    v_domain.id::text,
    jsonb_build_object(
      'idempotency_key', v_key,
      'payload_hash', v_payload_hash,
      'customer_id', p_customer_id,
      'challenge_id', v_challenge.id,
      'domain_id', v_domain.id,
      'hostname', v_domain.domain,
      'installation_id', v_install.id,
      'actor_auth_user_id', p_actor_auth_user_id,
      'before', v_domain_before,
      'after', jsonb_build_object(
        'status', v_domain.status,
        'verification_status', v_domain.verification_status,
        'installation_id', v_domain.installation_id
      ),
      'internal_reason', v_reason,
      'license_domain_reference_unchanged', true,
      'installation_created', false
    )
  );

  return jsonb_build_object(
    'ok', true,
    'idempotent_replay', false,
    'customer_id', p_customer_id,
    'domain', jsonb_build_object(
      'id', v_domain.id,
      'hostname', v_domain.domain,
      'status', v_domain.status,
      'verification_status', v_domain.verification_status,
      'installation_id', v_domain.installation_id,
      'verified_at', v_domain.verified_at
    ),
    'challenge', jsonb_build_object(
      'id', v_challenge.id,
      'status', v_challenge.status,
      'verified_at', v_challenge.verified_at
    ),
    'license_domain_reference_unchanged', true,
    'installation_created', false
  );
end;
$$;

revoke all on function public.verify_and_bind_platform_portal_secondary_domain_dns_challenge(
  uuid, uuid, text, text, text, uuid
) from public, anon, authenticated;
grant execute on function public.verify_and_bind_platform_portal_secondary_domain_dns_challenge(
  uuid, uuid, text, text, text, uuid
) to service_role;

-- ---------------------------------------------------------------------------
-- 6. Revoke pending challenge (safe rollback without deleting domain history)
-- ---------------------------------------------------------------------------
create or replace function public.revoke_platform_portal_secondary_domain_dns_challenge(
  p_customer_id uuid,
  p_challenge_id uuid,
  p_internal_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reason text;
  v_challenge public.customer_domain_dns_challenges;
  v_domain public.customer_domains;
begin
  perform public._ppsf258_require_platform_access();

  v_reason := nullif(btrim(coalesce(p_internal_reason, '')), '');
  if v_reason is null or char_length(v_reason) < 3 then
    raise exception 'INVALID_INTERNAL_REASON' using errcode = 'P0001';
  end if;

  select *
  into v_challenge
  from public.customer_domain_dns_challenges
  where id = p_challenge_id
    and customer_id = p_customer_id
  for update;

  if v_challenge.id is null then
    raise exception 'CHALLENGE_NOT_FOUND' using errcode = 'P0001';
  end if;

  if v_challenge.status = 'verified' then
    raise exception 'CHALLENGE_ALREADY_VERIFIED' using errcode = 'P0001';
  end if;

  update public.customer_domain_dns_challenges
  set
    status = 'revoked',
    revoked_at = now(),
    challenge_token_hash = repeat('0', 64),
    updated_at = now()
  where id = v_challenge.id
  returning * into v_challenge;

  select *
  into v_domain
  from public.customer_domains
  where id = v_challenge.domain_id;

  -- Keep history. Never regress a verified/active domain from an old challenge revoke.
  if v_domain.id is not null
     and lower(coalesce(v_domain.verification_status, '')) <> 'verified'
     and lower(coalesce(v_domain.status, '')) <> 'active' then
    update public.customer_domains
    set
      status = 'pending',
      verification_status = 'failed',
      updated_at = now()
    where id = v_domain.id
      and lower(coalesce(verification_status, '')) <> 'verified'
      and lower(coalesce(status, '')) <> 'active'
    returning * into v_domain;
  end if;

  perform public.record_platform_admin_audit_event(
    'platform_secondary_domain_dns_challenge_revoke',
    'customer_domain',
    coalesce(v_domain.id::text, p_challenge_id::text),
    jsonb_build_object(
      'customer_id', p_customer_id,
      'challenge_id', v_challenge.id,
      'hostname', v_challenge.hostname,
      'internal_reason', v_reason
    )
  );

  return jsonb_build_object(
    'ok', true,
    'challenge', jsonb_build_object(
      'id', v_challenge.id,
      'status', v_challenge.status,
      'revoked_at', v_challenge.revoked_at
    ),
    'domain', case
      when v_domain.id is null then null
      else jsonb_build_object(
        'id', v_domain.id,
        'hostname', v_domain.domain,
        'status', v_domain.status,
        'verification_status', v_domain.verification_status
      )
    end
  );
end;
$$;

revoke all on function public.revoke_platform_portal_secondary_domain_dns_challenge(uuid, uuid, text)
  from public, anon;
grant execute on function public.revoke_platform_portal_secondary_domain_dns_challenge(uuid, uuid, text)
  to authenticated;
