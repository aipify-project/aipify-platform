-- Platform portal Domain & Installation V1.
-- Authoritative UI domain table: public.organization_domains
-- Authoritative runtime domain table: public.customer_domains
-- Authoritative installation table: public.installations (installId = installations.id)
-- License link: public.aipify_billing_license_links.domain_reference (text, no FK)
-- Hostname: public.normalize_domain(); install token: generate_installation_token + hash
-- Does not verify DNS, activate Website Kompis, create licenses/subscriptions, or call Stripe/Fiken.

-- ---------------------------------------------------------------------------
-- Hostname validation (extends normalize_domain; rejects IP/localhost/ports)
-- ---------------------------------------------------------------------------
create or replace function public._platform_portal_normalize_hostname(p_input text)
returns text
language plpgsql
immutable
set search_path = public
as $$
declare
  v_raw text := coalesce(p_input, '');
  v_host text;
begin
  v_raw := btrim(v_raw);
  if v_raw = '' then
    return null;
  end if;

  -- Reject credentials / userinfo before normalization.
  if position('@' in v_raw) > 0 then
    raise exception 'INVALID_HOSTNAME' using errcode = 'P0001';
  end if;

  -- Reject query/fragment before strip.
  if position('?' in v_raw) > 0 or position('#' in v_raw) > 0 then
    raise exception 'INVALID_HOSTNAME' using errcode = 'P0001';
  end if;

  -- Reject path segments (normalize_domain may strip trailing slash only).
  if position('/' in regexp_replace(v_raw, '^https?://', '', 'i')) > 0
     and regexp_replace(v_raw, '^https?://', '', 'i') !~ '^[^/]+/$' then
    raise exception 'INVALID_HOSTNAME' using errcode = 'P0001';
  end if;

  v_host := public.normalize_domain(v_raw);
  if v_host is null then
    raise exception 'INVALID_HOSTNAME' using errcode = 'P0001';
  end if;

  -- Strip trailing dots left after normalize.
  v_host := regexp_replace(v_host, '\.+$', '');
  if v_host = '' then
    raise exception 'INVALID_HOSTNAME' using errcode = 'P0001';
  end if;

  -- Reject port (normalize_domain does not strip :port).
  if v_host ~ ':[0-9]+$' or position(':' in v_host) > 0 then
    raise exception 'INVALID_HOSTNAME' using errcode = 'P0001';
  end if;

  -- Reject IPv4 / IPv6-ish and localhost.
  if v_host ~ '^[0-9]+(\.[0-9]+){3}$'
     or v_host ~ '^[0-9a-f:]+$'
     or v_host in ('localhost', 'localhost.localdomain')
     or v_host like '%.localhost'
     or v_host like '%.local' then
    raise exception 'INVALID_HOSTNAME' using errcode = 'P0001';
  end if;

  -- Require at least one dot and DNS label shape.
  if position('.' in v_host) = 0
     or v_host !~ '^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$'
     or char_length(v_host) > 253 then
    raise exception 'INVALID_HOSTNAME' using errcode = 'P0001';
  end if;

  return v_host;
end;
$$;

revoke all on function public._platform_portal_normalize_hostname(text)
  from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Domains listing (+ eligible licenses for domain/installation create)
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_portal_customer_domains(p_customer_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_domains jsonb := '[]'::jsonb;
  v_eligible jsonb := '[]'::jsonb;
begin
  perform public._ppsf258_require_platform_access();

  if p_customer_id is null then
    return null;
  end if;

  select cu.id
  into v_org_id
  from public.customers cu
  join public.companies co on co.id = cu.company_id
  join public.organizations o on o.id = cu.id
  where cu.id = p_customer_id
    and coalesce(co.is_platform, false) = false
    and co.id <> '2697c432-d03d-44f6-839c-66200fd20b55'::uuid
    and cu.id <> '97a4bbcd-a223-47bd-9a3e-eadab02aaf1c'::uuid
    and co.id <> '9a2a6eab-e47d-4473-9fd5-baee226d4db7'::uuid
    and lower(coalesce(o.slug, '')) <> 'my-company-1'
    and lower(coalesce(co.slug, '')) <> 'my-company-1';

  if v_org_id is null then
    return null;
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', od.id,
        'hostname', od.domain,
        'status', coalesce(
          nullif(btrim(od.domain_status), ''),
          nullif(btrim(od.verification_status), ''),
          'unknown'
        ),
        'verification_status', od.verification_status,
        'install_id', cd.installation_id,
        'created_at', od.created_at,
        'verified_at', od.verified_at
      )
      order by
        coalesce(od.is_primary, false) desc,
        od.domain asc nulls last,
        od.id asc
    ),
    '[]'::jsonb
  )
  into v_domains
  from public.organization_domains od
  left join lateral (
    select cd.installation_id
    from public.customer_domains cd
    where cd.customer_id = v_org_id
      and lower(btrim(cd.domain)) = lower(btrim(od.domain))
      and lower(coalesce(cd.status, '')) <> 'removed'
    order by cd.verified_at desc nulls last, cd.created_at desc nulls last, cd.id asc
    limit 1
  ) cd on true
  where od.organization_id = v_org_id
    and lower(coalesce(od.domain_status, '')) <> 'removed';

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', ll.id,
        'product_code', ll.license_type,
        'product_name', coalesce(
          nullif(btrim(ll.metadata->>'plan_key'), ''),
          nullif(btrim(ll.license_type), '')
        ),
        'status', ll.license_status,
        'domain', nullif(btrim(ll.domain_reference), ''),
        'install_id', cd.installation_id,
        'provisioning_status', case
          when nullif(btrim(ll.domain_reference), '') is null then 'requires_domain'
          else 'domain_linked'
        end,
        'eligible', (
          lower(coalesce(ll.license_type, '')) = 'app_subscription'
          and lower(coalesce(ll.license_status, '')) in ('pending', 'active')
          and nullif(btrim(ll.domain_reference), '') is null
          and exists (
            select 1
            from public.subscriptions s
            where s.customer_id = v_org_id
              and lower(coalesce(s.status, '')) in ('active', 'trialing')
          )
        )
      )
      order by ll.created_at desc nulls last, ll.id asc
    ),
    '[]'::jsonb
  )
  into v_eligible
  from public.aipify_billing_license_links ll
  left join lateral (
    select cd.installation_id
    from public.customer_domains cd
    where cd.customer_id = v_org_id
      and lower(btrim(cd.domain)) = lower(btrim(ll.domain_reference))
      and lower(coalesce(cd.status, '')) <> 'removed'
    order by cd.created_at desc nulls last, cd.id asc
    limit 1
  ) cd on true
  where ll.organization_id = v_org_id
    and lower(coalesce(ll.license_type, '')) = 'app_subscription'
    and lower(coalesce(ll.license_status, '')) in ('pending', 'active');

  return jsonb_build_object(
    'customer_id', v_org_id,
    'domains', coalesce(v_domains, '[]'::jsonb),
    'eligible_licenses', coalesce(v_eligible, '[]'::jsonb),
    'generated_at', now()
  );
end;
$$;

revoke all on function public.get_platform_portal_customer_domains(uuid)
  from public, anon;
grant execute on function public.get_platform_portal_customer_domains(uuid)
  to authenticated;

-- ---------------------------------------------------------------------------
-- Installations listing
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_portal_customer_installations(p_customer_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_company_id uuid;
  v_installations jsonb := '[]'::jsonb;
begin
  perform public._ppsf258_require_platform_access();

  if p_customer_id is null then
    return null;
  end if;

  select cu.id, cu.company_id
  into v_org_id, v_company_id
  from public.customers cu
  join public.companies co on co.id = cu.company_id
  join public.organizations o on o.id = cu.id
  where cu.id = p_customer_id
    and coalesce(co.is_platform, false) = false
    and co.id <> '2697c432-d03d-44f6-839c-66200fd20b55'::uuid
    and cu.id <> '97a4bbcd-a223-47bd-9a3e-eadab02aaf1c'::uuid
    and co.id <> '9a2a6eab-e47d-4473-9fd5-baee226d4db7'::uuid
    and lower(coalesce(o.slug, '')) <> 'my-company-1'
    and lower(coalesce(co.slug, '')) <> 'my-company-1';

  if v_org_id is null then
    return null;
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', i.id,
        'install_id', i.id,
        'status', i.status,
        'system_type', i.system_type,
        'name', nullif(btrim(i.name), ''),
        'site_url', nullif(btrim(i.site_url), ''),
        'domain_id', i.domain_id,
        'created_at', i.created_at,
        'activated_at', i.activated_at
      )
      order by
        case lower(coalesce(i.status, ''))
          when 'active' then 1
          when 'ready' then 2
          when 'draft' then 3
          when 'pending_verification' then 4
          else 5
        end,
        i.created_at desc nulls last,
        i.id asc
    ),
    '[]'::jsonb
  )
  into v_installations
  from public.installations i
  where i.customer_id = v_org_id
     or i.company_id = v_company_id;

  return jsonb_build_object(
    'customer_id', v_org_id,
    'installations', coalesce(v_installations, '[]'::jsonb),
    'generated_at', now()
  );
end;
$$;

revoke all on function public.get_platform_portal_customer_installations(uuid)
  from public, anon;
grant execute on function public.get_platform_portal_customer_installations(uuid)
  to authenticated;

-- ---------------------------------------------------------------------------
-- Atomic create domain + installation + license domain_reference
-- ---------------------------------------------------------------------------
create or replace function public.create_platform_portal_customer_domain_installation(
  p_customer_id uuid,
  p_license_id uuid,
  p_hostname text,
  p_internal_reason text,
  p_idempotency_key text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reason text;
  v_key text;
  v_payload_hash text;
  v_hostname text;
  v_company_id uuid;
  v_sub public.subscriptions%rowtype;
  v_license public.aipify_billing_license_links%rowtype;
  v_org_domain public.organization_domains%rowtype;
  v_customer_domain public.customer_domains%rowtype;
  v_installation public.installations%rowtype;
  v_token text;
  v_token_hash text;
  v_created_domain boolean := false;
  v_created_installation boolean := false;
  v_prior jsonb;
  v_audit jsonb;
  v_result jsonb;
  v_existing_org public.organization_domains%rowtype;
  v_existing_cd public.customer_domains%rowtype;
begin
  perform public._ppsf258_require_platform_access();

  if p_customer_id is null then
    raise exception 'INVALID_CUSTOMER' using errcode = 'P0001';
  end if;
  if p_license_id is null then
    raise exception 'INVALID_LICENSE' using errcode = 'P0001';
  end if;

  v_reason := nullif(btrim(coalesce(p_internal_reason, '')), '');
  if v_reason is null or char_length(v_reason) < 3 or char_length(v_reason) > 500 then
    raise exception 'INVALID_INTERNAL_REASON' using errcode = 'P0001';
  end if;

  v_key := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  if v_key is null or char_length(v_key) < 8 or char_length(v_key) > 128 then
    raise exception 'INVALID_IDEMPOTENCY_KEY' using errcode = 'P0001';
  end if;

  v_hostname := public._platform_portal_normalize_hostname(p_hostname);

  v_payload_hash := md5(
    p_customer_id::text || '|' ||
    p_license_id::text || '|' ||
    v_hostname || '|' ||
    v_reason
  );

  select metadata
  into v_prior
  from public.platform_admin_audit_logs
  where action_type = 'platform_customer_domain_installation_create'
    and metadata->>'idempotency_key' = v_key
  order by created_at desc
  limit 1;

  if v_prior is not null then
    if coalesce(v_prior->>'payload_hash', '') <> v_payload_hash then
      raise exception 'IDEMPOTENCY_CONFLICT' using errcode = 'P0001';
    end if;

    select * into v_license
    from public.aipify_billing_license_links
    where id = nullif(v_prior->>'license_id', '')::uuid;

    select * into v_org_domain
    from public.organization_domains
    where id = nullif(v_prior->>'domain_id', '')::uuid;

    select * into v_installation
    from public.installations
    where id = nullif(v_prior->>'installation_id', '')::uuid;

    if v_license.id is null or v_org_domain.id is null or v_installation.id is null then
      raise exception 'IDEMPOTENCY_REPLAY_MISSING' using errcode = 'P0001';
    end if;

    return jsonb_build_object(
      'customer_id', p_customer_id,
      'license_id', v_license.id,
      'domain', jsonb_build_object(
        'id', v_org_domain.id,
        'hostname', v_org_domain.domain,
        'status', coalesce(v_org_domain.domain_status, v_org_domain.verification_status),
        'verified_at', v_org_domain.verified_at,
        'created_at', v_org_domain.created_at
      ),
      'installation', jsonb_build_object(
        'id', v_installation.id,
        'install_id', v_installation.id,
        'status', v_installation.status,
        'created_at', v_installation.created_at,
        'activated_at', v_installation.activated_at
      ),
      'license', jsonb_build_object(
        'id', v_license.id,
        'status', v_license.license_status,
        'provisioning_status', case
          when nullif(btrim(v_license.domain_reference), '') is null then 'requires_domain'
          else 'domain_linked'
        end,
        'domain_id', v_org_domain.id,
        'installation_id', v_installation.id,
        'install_id', v_installation.id
      ),
      'created', jsonb_build_object(
        'domain', false,
        'installation', false
      ),
      'idempotent_replay', true
    );
  end if;

  select cu.company_id
  into v_company_id
  from public.customers cu
  join public.companies co on co.id = cu.company_id
  join public.organizations o on o.id = cu.id
  where cu.id = p_customer_id
    and coalesce(co.is_platform, false) = false
    and co.id <> '2697c432-d03d-44f6-839c-66200fd20b55'::uuid
    and cu.id <> '97a4bbcd-a223-47bd-9a3e-eadab02aaf1c'::uuid
    and co.id <> '9a2a6eab-e47d-4473-9fd5-baee226d4db7'::uuid
    and lower(coalesce(o.slug, '')) <> 'my-company-1'
    and lower(coalesce(co.slug, '')) <> 'my-company-1';

  if v_company_id is null then
    raise exception 'CUSTOMER_NOT_FOUND' using errcode = 'P0001';
  end if;

  select *
  into v_sub
  from public.subscriptions s
  where s.customer_id = p_customer_id
  for update;

  if v_sub.id is null
     or lower(coalesce(v_sub.status, '')) not in ('active', 'trialing') then
    raise exception 'COMMERCIAL_PLAN_REQUIRED' using errcode = 'P0001';
  end if;

  select *
  into v_license
  from public.aipify_billing_license_links ll
  where ll.id = p_license_id
  for update;

  if v_license.id is null then
    raise exception 'LICENSE_NOT_FOUND' using errcode = 'P0001';
  end if;

  if v_license.organization_id <> p_customer_id then
    raise exception 'LICENSE_CUSTOMER_MISMATCH' using errcode = 'P0001';
  end if;

  if lower(coalesce(v_license.license_type, '')) <> 'app_subscription' then
    raise exception 'LICENSE_NOT_ELIGIBLE' using errcode = 'P0001';
  end if;

  if lower(coalesce(v_license.license_status, '')) not in ('pending', 'active') then
    raise exception 'LICENSE_NOT_ELIGIBLE' using errcode = 'P0001';
  end if;

  if nullif(btrim(v_license.domain_reference), '') is not null then
    if lower(btrim(v_license.domain_reference)) = v_hostname then
      raise exception 'LICENSE_DOMAIN_CONFLICT' using errcode = 'P0001';
    end if;
    raise exception 'LICENSE_DOMAIN_CONFLICT' using errcode = 'P0001';
  end if;

  select *
  into v_existing_org
  from public.organization_domains od
  where od.organization_id = p_customer_id
    and lower(btrim(od.domain)) = v_hostname
    and lower(coalesce(od.domain_status, '')) <> 'removed'
  limit 1;

  if v_existing_org.id is not null then
    raise exception 'DOMAIN_ALREADY_EXISTS' using errcode = 'P0001';
  end if;

  select *
  into v_existing_cd
  from public.customer_domains cd
  where cd.customer_id = p_customer_id
    and lower(btrim(cd.domain)) = v_hostname
    and lower(coalesce(cd.status, '')) <> 'removed'
  limit 1;

  if v_existing_cd.id is not null then
    raise exception 'DOMAIN_ALREADY_EXISTS' using errcode = 'P0001';
  end if;

  v_token := public.generate_installation_token();
  v_token_hash := public.hash_installation_token(v_token);

  insert into public.installations (
    company_id,
    customer_id,
    system_type,
    status,
    installation_token_hash,
    name,
    site_url,
    wizard_step,
    token_expires_at,
    environment_type,
    provisioning_status
  )
  values (
    v_company_id,
    p_customer_id,
    'custom',
    'draft',
    v_token_hash,
    v_hostname,
    'https://' || v_hostname,
    2,
    now() + interval '90 days',
    'customer',
    'manual'
  )
  returning * into v_installation;

  v_created_installation := true;

  insert into public.organization_domains (
    organization_id,
    domain,
    display_name,
    domain_status,
    connected_platform,
    verification_status,
    verification_method,
    license_status,
    is_primary,
    metadata
  )
  values (
    p_customer_id,
    v_hostname,
    v_hostname,
    'pending',
    'custom_website',
    'pending',
    'manual',
    'included',
    false,
    jsonb_build_object(
      'issued_by', 'create_platform_portal_customer_domain_installation',
      'license_id', v_license.id
    )
  )
  returning * into v_org_domain;

  v_created_domain := true;

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
    v_installation.id,
    v_hostname,
    'pending',
    'pending',
    'manual'
  )
  returning * into v_customer_domain;

  update public.installations
  set
    domain_id = v_customer_domain.id,
    updated_at = now()
  where id = v_installation.id
  returning * into v_installation;

  update public.aipify_billing_license_links
  set
    domain_reference = v_hostname,
    metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
      'domain_id', v_org_domain.id,
      'customer_domain_id', v_customer_domain.id,
      'installation_id', v_installation.id,
      'domain_bound_by', 'create_platform_portal_customer_domain_installation'
    ),
    updated_at = now()
  where id = v_license.id
  returning * into v_license;

  v_result := jsonb_build_object(
    'customer_id', p_customer_id,
    'license_id', v_license.id,
    'domain', jsonb_build_object(
      'id', v_org_domain.id,
      'hostname', v_org_domain.domain,
      'status', v_org_domain.domain_status,
      'verified_at', v_org_domain.verified_at,
      'created_at', v_org_domain.created_at
    ),
    'installation', jsonb_build_object(
      'id', v_installation.id,
      'install_id', v_installation.id,
      'status', v_installation.status,
      'created_at', v_installation.created_at,
      'activated_at', v_installation.activated_at
    ),
    'license', jsonb_build_object(
      'id', v_license.id,
      'status', v_license.license_status,
      'provisioning_status', 'domain_linked',
      'domain_id', v_org_domain.id,
      'installation_id', v_installation.id,
      'install_id', v_installation.id
    ),
    'created', jsonb_build_object(
      'domain', v_created_domain,
      'installation', v_created_installation
    ),
    'idempotent_replay', false
  );

  begin
    v_audit := jsonb_build_object(
      'idempotency_key', v_key,
      'payload_hash', v_payload_hash,
      'customer_id', p_customer_id,
      'company_id', v_company_id,
      'license_id', v_license.id,
      'domain_id', v_org_domain.id,
      'hostname', v_hostname,
      'installation_id', v_installation.id,
      'install_id', v_installation.id,
      'internal_reason', v_reason,
      'domain_created', v_created_domain,
      'installation_created', v_created_installation,
      'provisioning_status', 'domain_linked',
      'result', v_result
    );
    perform public.record_platform_admin_audit_event(
      'platform_customer_domain_installation_create',
      'domain_installation',
      v_org_domain.id::text,
      v_audit
    );
  exception
    when others then
      null;
  end;

  return v_result;
end;
$$;

revoke all on function public.create_platform_portal_customer_domain_installation(
  uuid, uuid, text, text, text
) from public, anon;
grant execute on function public.create_platform_portal_customer_domain_installation(
  uuid, uuid, text, text, text
) to authenticated;

-- ---------------------------------------------------------------------------
-- Detail RPC: wire license install_id from domain_reference match (compat)
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_portal_customer_detail(p_customer_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_payload jsonb;
begin
  perform public._ppsf258_require_platform_access();

  if p_customer_id is null then
    return null;
  end if;

  with scoped as (
    select
      o.id as organization_id,
      cu.id as customer_id,
      co.id as company_id,
      nullif(btrim(co.name), '') as company_name,
      nullif(btrim(cu.company_name), '') as customer_company_name,
      nullif(btrim(o.name), '') as organization_name,
      nullif(btrim(cu.organization_number), '') as organization_number,
      nullif(btrim(o.slug), '') as organization_slug,
      cu.status as customer_status,
      cu.created_at,
      cu.updated_at,
      o.attributed_growth_partner_profile_id,
      nullif(btrim(o.attributed_growth_partner_public_id), '') as attributed_growth_partner_public_id
    from public.organizations o
    join public.customers cu on cu.id = o.id
    join public.companies co on co.id = cu.company_id
    where o.id = p_customer_id
      and coalesce(co.is_platform, false) = false
      and co.id <> '2697c432-d03d-44f6-839c-66200fd20b55'::uuid
      and o.id <> '97a4bbcd-a223-47bd-9a3e-eadab02aaf1c'::uuid
      and co.id <> '9a2a6eab-e47d-4473-9fd5-baee226d4db7'::uuid
      and lower(coalesce(o.slug, '')) <> 'my-company-1'
      and lower(coalesce(co.slug, '')) <> 'my-company-1'
  ),
  primary_subscription as (
    select distinct on (s.customer_id)
      s.customer_id,
      s.status,
      s.plan_key,
      s.plan_type,
      s.plan_name,
      s.billing_cycle,
      s.license_service_status,
      s.trial_starts_at,
      s.trial_ends_at,
      s.current_period_start,
      s.current_period_end
    from public.subscriptions s
    join scoped sc on sc.customer_id = s.customer_id
    order by
      s.customer_id,
      case lower(coalesce(s.status, ''))
        when 'active' then 1
        when 'trialing' then 2
        when 'past_due' then 3
        when 'unpaid' then 4
        when 'paused' then 5
        else 6
      end,
      s.updated_at desc nulls last,
      s.created_at desc nulls last,
      s.id asc
  ),
  member_stats as (
    select
      sc.company_id,
      count(distinct u.id)::integer as member_count
    from scoped sc
    left join public.users u on u.company_id = sc.company_id
    group by sc.company_id
  ),
  support_stats as (
    select
      sc.customer_id,
      count(*)::integer as open_support_count
    from scoped sc
    join public.support_cases scase on scase.tenant_id = sc.customer_id
    where lower(coalesce(scase.status, '')) in (
      'open',
      'in_progress',
      'escalated',
      'received',
      'triaged',
      'draft',
      'pending_approval',
      'auto_replied'
    )
    group by sc.customer_id
  ),
  partner_info as (
    select
      sc.organization_id,
      nullif(btrim(gp.company_name), '') as partner_name
    from scoped sc
    left join public.growth_partner_app_profiles gp
      on gp.id = sc.attributed_growth_partner_profile_id
  ),
  license_rows as (
    select
      sc.organization_id,
      jsonb_agg(
        jsonb_build_object(
          'id', ll.id,
          'status', ll.license_status,
          'product_code', ll.license_type,
          'product_name', coalesce(
            nullif(btrim(ll.metadata->>'plan_key'), ''),
            nullif(btrim(ll.license_type), '')
          ),
          'domain', nullif(btrim(ll.domain_reference), ''),
          'install_id', lcd.installation_id,
          'masked_license_code', public._ube586_mask_license_key(ll.license_key),
          'provisioning_status', case
            when nullif(btrim(ll.domain_reference), '') is null then 'requires_domain'
            else 'domain_linked'
          end,
          'created_at', ll.created_at,
          'activated_at', ll.created_at,
          'expires_at', null
        )
        order by
          case lower(coalesce(ll.license_status, ''))
            when 'active' then 1
            when 'pending' then 2
            when 'suspended' then 3
            when 'expired' then 4
            else 5
          end,
          ll.created_at desc nulls last,
          ll.id asc
      ) filter (where ll.id is not null) as licenses,
      count(ll.id)::integer as total_license_count,
      count(ll.id) filter (
        where lower(coalesce(ll.license_status, '')) = 'active'
      )::integer as active_license_count
    from scoped sc
    left join public.aipify_billing_license_links ll
      on ll.organization_id = sc.organization_id
    left join lateral (
      select cd.installation_id
      from public.customer_domains cd
      where cd.customer_id = sc.customer_id
        and nullif(btrim(ll.domain_reference), '') is not null
        and lower(btrim(cd.domain)) = lower(btrim(ll.domain_reference))
        and lower(coalesce(cd.status, '')) <> 'removed'
      order by cd.created_at desc nulls last, cd.id asc
      limit 1
    ) lcd on true
    group by sc.organization_id
  ),
  domain_rows as (
    select
      sc.organization_id,
      jsonb_agg(
        jsonb_build_object(
          'id', od.id,
          'hostname', od.domain,
          'status', coalesce(
            nullif(btrim(od.domain_status), ''),
            nullif(btrim(od.verification_status), ''),
            'unknown'
          ),
          'install_id', cd.installation_id,
          'created_at', od.created_at,
          'verified_at', od.verified_at
        )
        order by
          coalesce(od.is_primary, false) desc,
          od.domain asc nulls last,
          od.id asc
      ) filter (where od.id is not null) as domains,
      count(od.id)::integer as domain_count
    from scoped sc
    left join public.organization_domains od
      on od.organization_id = sc.organization_id
     and lower(coalesce(od.domain_status, '')) <> 'removed'
    left join lateral (
      select cd.installation_id
      from public.customer_domains cd
      where cd.customer_id = sc.customer_id
        and lower(btrim(cd.domain)) = lower(btrim(od.domain))
        and lower(coalesce(cd.status, '')) <> 'removed'
      order by cd.verified_at desc nulls last, cd.created_at desc nulls last, cd.id asc
      limit 1
    ) cd on true
    group by sc.organization_id
  ),
  install_stats as (
    select
      sc.organization_id,
      count(distinct i.id)::integer as installation_count
    from scoped sc
    left join public.installations i
      on i.customer_id = sc.customer_id
      or i.company_id = sc.company_id
    group by sc.organization_id
  ),
  entitlement_rows as (
    select
      sc.organization_id,
      jsonb_agg(
        jsonb_build_object(
          'id', oma.id,
          'code', oma.module_key,
          'name', coalesce(
            nullif(btrim(oma.business_pack_key), ''),
            nullif(btrim(oma.module_key), '')
          ),
          'status', oma.status,
          'granted_at', oma.activated_at,
          'expires_at', oma.deactivated_at
        )
        order by
          case lower(coalesce(oma.status, ''))
            when 'active' then 1
            when 'licensed' then 2
            else 3
          end,
          oma.activated_at desc nulls last,
          oma.module_key asc,
          oma.id asc
      ) filter (where oma.id is not null) as entitlements
    from scoped sc
    left join public.organization_module_activations oma
      on oma.organization_id = sc.organization_id
     and lower(coalesce(oma.status, '')) <> 'removed'
    group by sc.organization_id
  )
  select jsonb_build_object(
    'customer', jsonb_build_object(
      'id', sc.organization_id,
      'company_id', sc.company_id,
      'name', coalesce(sc.company_name, sc.customer_company_name, sc.organization_name, sc.organization_slug),
      'legal_name', coalesce(sc.customer_company_name, sc.organization_name, sc.company_name),
      'slug', sc.organization_slug,
      'organization_number', sc.organization_number,
      'status', sc.customer_status,
      'created_at', sc.created_at,
      'updated_at', sc.updated_at,
      'requires_attention', (
        ps.customer_id is null
        or lower(coalesce(ps.status, '')) not in ('active', 'trialing')
        or lower(coalesce(ps.status, '')) in ('past_due', 'unpaid', 'paused')
        or lower(coalesce(ps.license_service_status, '')) = 'paused'
      )
    ),
    'commercial', jsonb_build_object(
      'lifetime', (
        lower(coalesce(ps.plan_key, '')) = 'lifetime'
        or lower(coalesce(ps.plan_type, '')) = 'lifetime'
        or lower(coalesce(ps.billing_cycle, '')) = 'lifetime'
      ),
      'subscription_status', ps.status,
      'plan_name', coalesce(
        nullif(btrim(ps.plan_name), ''),
        nullif(btrim(ps.plan_key), '')
      ),
      'trial_starts_at', ps.trial_starts_at,
      'trial_ends_at', ps.trial_ends_at,
      'current_period_starts_at', ps.current_period_start,
      'current_period_ends_at', ps.current_period_end,
      'partner_attributed', (
        sc.attributed_growth_partner_profile_id is not null
        or sc.attributed_growth_partner_public_id is not null
      ),
      'partner_name', pi.partner_name
    ),
    'usage', jsonb_build_object(
      'member_count', coalesce(ms.member_count, 0),
      'active_license_count', coalesce(lr.active_license_count, 0),
      'total_license_count', coalesce(lr.total_license_count, 0),
      'domain_count', coalesce(dr.domain_count, 0),
      'installation_count', coalesce(ins.installation_count, 0),
      'open_support_count', coalesce(ss.open_support_count, 0)
    ),
    'licenses', coalesce(lr.licenses, '[]'::jsonb),
    'domains', coalesce(dr.domains, '[]'::jsonb),
    'entitlements', coalesce(er.entitlements, '[]'::jsonb),
    'metadata', jsonb_build_object(
      'generated_at', now()
    )
  )
  into v_payload
  from scoped sc
  left join primary_subscription ps on ps.customer_id = sc.customer_id
  left join member_stats ms on ms.company_id = sc.company_id
  left join support_stats ss on ss.customer_id = sc.customer_id
  left join partner_info pi on pi.organization_id = sc.organization_id
  left join license_rows lr on lr.organization_id = sc.organization_id
  left join domain_rows dr on dr.organization_id = sc.organization_id
  left join install_stats ins on ins.organization_id = sc.organization_id
  left join entitlement_rows er on er.organization_id = sc.organization_id;

  return v_payload;
end;
$$;

revoke all on function public.get_platform_portal_customer_detail(uuid)
  from public, anon;
grant execute on function public.get_platform_portal_customer_detail(uuid)
  to authenticated;
