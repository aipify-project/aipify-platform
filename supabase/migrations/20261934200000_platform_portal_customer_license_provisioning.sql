-- Platform portal License & Provisioning V1.
-- Authoritative license table: public.aipify_billing_license_links
-- Authoritative product catalog: license_type CHECK on that table
--   (V1 Platform-assignable product: app_subscription)
-- Commercial prerequisite: public.subscriptions (Platform Commercial Plan V1)
-- License code: reuses _ube586_generate_license_key / _ube586_mask_license_key
-- Does not create domains, installations, installIds, entitlements, Website Kompis
-- activation, Stripe/Fiken, invoices, or emails. Does not create parallel models.

-- ---------------------------------------------------------------------------
-- 1. License product listing (schema CHECK catalog — no new product table)
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_portal_license_products()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_products jsonb := '[]'::jsonb;
begin
  perform public._ppsf258_require_platform_access();

  -- Derived from aipify_billing_license_links.license_type CHECK.
  -- Only Platform-assignable products are returned in V1.
  select coalesce(
    jsonb_agg(product order by product->>'code'),
    '[]'::jsonb
  )
  into v_products
  from (
    select jsonb_build_object(
      'id', 'app_subscription',
      'code', 'app_subscription',
      'name', 'APP subscription license',
      'description', 'Organization APP subscription license code bound to the commercial plan.',
      'active', true,
      'assignable_by_platform', true,
      'requires_commercial_plan', true,
      'requires_entitlement', false,
      'requires_domain', false,
      'requires_installation', false,
      'license_mode', 'app_subscription',
      'default_status', 'active'
    ) as product
  ) catalog
  where (product->>'assignable_by_platform')::boolean = true
    and (product->>'active')::boolean = true;

  return jsonb_build_object(
    'products', v_products,
    'generated_at', now()
  );
end;
$$;

revoke all on function public.get_platform_portal_license_products()
  from public, anon;
grant execute on function public.get_platform_portal_license_products()
  to authenticated;

-- ---------------------------------------------------------------------------
-- 2. Customer license listing (masked codes only)
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_portal_customer_licenses(p_customer_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_licenses jsonb := '[]'::jsonb;
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
        'id', ll.id,
        'product_id', ll.license_type,
        'product_code', ll.license_type,
        'product_name', coalesce(
          nullif(btrim(ll.metadata->>'plan_key'), ''),
          nullif(btrim(ll.license_type), '')
        ),
        'status', ll.license_status,
        'masked_license_code', public._ube586_mask_license_key(ll.license_key),
        'entitlement_id', null,
        'domain_id', null,
        'domain', nullif(btrim(ll.domain_reference), ''),
        'installation_id', null,
        'install_id', null,
        'provisioning_status', case
          when nullif(btrim(ll.domain_reference), '') is null then 'requires_domain'
          else 'domain_linked'
        end,
        'provisioning_required', (nullif(btrim(ll.domain_reference), '') is null),
        'created_at', ll.created_at,
        'activated_at', case
          when lower(coalesce(ll.license_status, '')) = 'active' then ll.created_at
          else null
        end,
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
    ),
    '[]'::jsonb
  )
  into v_licenses
  from public.aipify_billing_license_links ll
  where ll.organization_id = v_org_id;

  return jsonb_build_object(
    'customer_id', v_org_id,
    'licenses', coalesce(v_licenses, '[]'::jsonb),
    'generated_at', now()
  );
end;
$$;

revoke all on function public.get_platform_portal_customer_licenses(uuid)
  from public, anon;
grant execute on function public.get_platform_portal_customer_licenses(uuid)
  to authenticated;

-- ---------------------------------------------------------------------------
-- 3. Atomic create license (app_subscription)
-- ---------------------------------------------------------------------------
create or replace function public.create_platform_portal_customer_license(
  p_customer_id uuid,
  p_product_code text,
  p_internal_reason text,
  p_idempotency_key text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_product_code text;
  v_reason text;
  v_key text;
  v_payload_hash text;
  v_company_id uuid;
  v_sub public.subscriptions%rowtype;
  v_existing public.aipify_billing_license_links%rowtype;
  v_license public.aipify_billing_license_links%rowtype;
  v_created boolean := false;
  v_license_status text;
  v_new_key text;
  v_prior jsonb;
  v_audit jsonb;
  v_result jsonb;
  v_domain text;
  v_provisioning_required boolean;
  v_provisioning_status text;
begin
  perform public._ppsf258_require_platform_access();

  if p_customer_id is null then
    raise exception 'INVALID_CUSTOMER' using errcode = 'P0001';
  end if;

  v_product_code := lower(nullif(btrim(coalesce(p_product_code, '')), ''));
  if v_product_code is null then
    raise exception 'INVALID_PRODUCT' using errcode = 'P0001';
  end if;

  -- V1 Platform-assignable catalog = app_subscription only (CHECK-backed).
  if v_product_code <> 'app_subscription' then
    raise exception 'PRODUCT_NOT_ASSIGNABLE' using errcode = 'P0001';
  end if;

  v_reason := nullif(btrim(coalesce(p_internal_reason, '')), '');
  if v_reason is null or char_length(v_reason) < 3 or char_length(v_reason) > 500 then
    raise exception 'INVALID_INTERNAL_REASON' using errcode = 'P0001';
  end if;

  v_key := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  if v_key is null or char_length(v_key) < 8 or char_length(v_key) > 128 then
    raise exception 'INVALID_IDEMPOTENCY_KEY' using errcode = 'P0001';
  end if;

  v_payload_hash := md5(
    p_customer_id::text || '|' ||
    v_product_code || '|' ||
    v_reason
  );

  select metadata
  into v_prior
  from public.platform_admin_audit_logs
  where action_type = 'platform_customer_license_create'
    and metadata->>'idempotency_key' = v_key
  order by created_at desc
  limit 1;

  if v_prior is not null then
    if coalesce(v_prior->>'payload_hash', '') <> v_payload_hash then
      raise exception 'IDEMPOTENCY_CONFLICT' using errcode = 'P0001';
    end if;

    select *
    into v_license
    from public.aipify_billing_license_links l
    where l.id = nullif(v_prior->>'license_id', '')::uuid;

    if v_license.id is null then
      raise exception 'IDEMPOTENCY_REPLAY_MISSING' using errcode = 'P0001';
    end if;

    v_domain := nullif(btrim(v_license.domain_reference), '');
    v_provisioning_required := v_domain is null;
    v_provisioning_status := case
      when v_domain is null then 'requires_domain'
      else 'domain_linked'
    end;

    return jsonb_build_object(
      'customer_id', p_customer_id,
      'license', jsonb_build_object(
        'id', v_license.id,
        'product_id', v_license.license_type,
        'product_code', v_license.license_type,
        'product_name', coalesce(
          nullif(btrim(v_license.metadata->>'plan_key'), ''),
          nullif(btrim(v_license.license_type), '')
        ),
        'status', v_license.license_status,
        'masked_license_code', public._ube586_mask_license_key(v_license.license_key),
        'entitlement_id', null,
        'domain_id', null,
        'installation_id', null,
        'install_id', null,
        'provisioning_status', v_provisioning_status,
        'created_at', v_license.created_at,
        'activated_at', case
          when lower(coalesce(v_license.license_status, '')) = 'active' then v_license.created_at
          else null
        end,
        'expires_at', null
      ),
      'created', false,
      'entitlement_created', false,
      'provisioning_required', v_provisioning_required,
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
  into v_existing
  from public.aipify_billing_license_links l
  where l.organization_id = p_customer_id
    and l.license_type = 'app_subscription'
    and l.license_status in ('pending', 'active')
  order by l.created_at asc, l.id asc
  limit 1
  for update;

  if v_existing.id is not null then
    raise exception 'ACTIVE_LICENSE_CONFLICT' using errcode = 'P0001';
  end if;

  -- Existing engine status contract for commercially eligible orgs.
  v_license_status := case
    when lower(coalesce(v_sub.status, '')) in ('active', 'trialing') then 'active'
    else 'pending'
  end;

  v_new_key := public._ube586_generate_license_key();

  insert into public.aipify_billing_license_links (
    organization_id,
    license_key,
    license_type,
    license_status,
    domain_reference,
    purchased_capacity,
    used_capacity,
    metadata
  )
  values (
    p_customer_id,
    v_new_key,
    'app_subscription',
    v_license_status,
    '',
    1,
    0,
    jsonb_build_object(
      'plan_key', coalesce(v_sub.plan_key, 'unknown'),
      'subscription_status', coalesce(v_sub.status, 'unknown'),
      'engine', 'aipify_billing_license_links',
      'license_scope', 'app_subscription',
      'issued_by', 'create_platform_portal_customer_license'
    )
  )
  returning * into v_license;

  v_created := true;
  v_domain := nullif(btrim(v_license.domain_reference), '');
  v_provisioning_required := v_domain is null;
  v_provisioning_status := case
    when v_domain is null then 'requires_domain'
    else 'domain_linked'
  end;

  v_result := jsonb_build_object(
    'customer_id', p_customer_id,
    'license', jsonb_build_object(
      'id', v_license.id,
      'product_id', v_license.license_type,
      'product_code', v_license.license_type,
      'product_name', coalesce(
        nullif(btrim(v_license.metadata->>'plan_key'), ''),
        nullif(btrim(v_license.license_type), '')
      ),
      'status', v_license.license_status,
      'masked_license_code', public._ube586_mask_license_key(v_license.license_key),
      'entitlement_id', null,
      'domain_id', null,
      'installation_id', null,
      'install_id', null,
      'provisioning_status', v_provisioning_status,
      'created_at', v_license.created_at,
      'activated_at', case
        when lower(coalesce(v_license.license_status, '')) = 'active' then v_license.created_at
        else null
      end,
      'expires_at', null
    ),
    'created', v_created,
    'entitlement_created', false,
    'provisioning_required', v_provisioning_required,
    'idempotent_replay', false
  );

  begin
    v_audit := jsonb_build_object(
      'idempotency_key', v_key,
      'payload_hash', v_payload_hash,
      'customer_id', p_customer_id,
      'company_id', v_company_id,
      'license_id', v_license.id,
      'product_code', v_product_code,
      'internal_reason', v_reason,
      'created', v_created,
      'entitlement_created', false,
      'provisioning_required', v_provisioning_required,
      'license_status', v_license.license_status,
      'result', v_result
    );
    perform public.record_platform_admin_audit_event(
      'platform_customer_license_create',
      'license',
      v_license.id::text,
      v_audit
    );
  exception
    when others then
      null;
  end;

  -- Soft billing event without license key material.
  begin
    perform public._ube586_record_event(
      p_customer_id,
      'license_activated',
      'Platform portal APP subscription license created',
      jsonb_build_object(
        'license_type', 'app_subscription',
        'license_link_id', v_license.id,
        'created', true,
        'issued_by', 'create_platform_portal_customer_license'
      )
    );
  exception
    when others then
      null;
  end;

  return v_result;
end;
$$;

revoke all on function public.create_platform_portal_customer_license(
  uuid, text, text, text
) from public, anon;
grant execute on function public.create_platform_portal_customer_license(
  uuid, text, text, text
) to authenticated;

-- ---------------------------------------------------------------------------
-- 4. Customer Detail — add masked code + provisioning fields (compat)
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
          'install_id', null,
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
