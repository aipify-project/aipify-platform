-- Platform Portal Licenses Overview V1 (read-only).
-- One row per authoritative aipify_billing_license_links for ordinary customers.
-- No tables. No data writes. Masked license keys only.

create or replace function public.get_platform_portal_licenses_overview()
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

  with scoped as (
    select
      o.id as organization_id,
      cu.id as customer_id,
      co.id as company_id,
      coalesce(
        nullif(btrim(co.name), ''),
        nullif(btrim(cu.company_name), ''),
        nullif(btrim(o.name), ''),
        nullif(btrim(o.slug), ''),
        'Customer'
      ) as company_name,
      nullif(btrim(o.slug), '') as customer_key,
      nullif(btrim(cu.organization_number), '') as registration_number,
      nullif(upper(btrim(cu.country)), '') as country_code
    from public.organizations o
    join public.customers cu on cu.id = o.id
    join public.companies co on co.id = cu.company_id
    where coalesce(co.is_platform, false) = false
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
      s.plan_name,
      s.plan_key,
      s.plan_type,
      s.billing_cycle
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
        when 'suspended' then 6
        else 7
      end,
      s.updated_at desc nulls last,
      s.created_at desc nulls last,
      s.id asc
  ),
  license_rows as (
    select
      ll.id as license_id,
      sc.customer_id,
      sc.company_id,
      sc.customer_key,
      sc.company_name,
      sc.registration_number,
      sc.country_code,
      nullif(btrim(ll.license_type), '') as license_product_code,
      nullif(btrim(ll.license_status), '') as license_status,
      public._ube586_mask_license_key(ll.license_key) as masked_license_key,
      nullif(btrim(ps.status), '') as agreement_status,
      case
        when ps.customer_id is null then null
        when lower(coalesce(ps.plan_key, '')) = 'lifetime'
          or lower(coalesce(ps.plan_type, '')) = 'lifetime'
          or lower(coalesce(ps.billing_cycle, '')) = 'lifetime'
        then 'lifetime'
        when lower(coalesce(ps.billing_cycle, '')) in ('yearly', 'annual') then 'yearly'
        when lower(coalesce(ps.billing_cycle, '')) = 'monthly' then 'monthly'
        else nullif(btrim(ps.billing_cycle), '')
      end as agreement_duration,
      nullif(btrim(ps.plan_name), '') as agreement_name,
      nullif(btrim(ll.domain_reference), '') as domain_hostname,
      lcd.domain_status,
      lcd.domain_verified,
      lcd.installation_id,
      lcd.install_id,
      lcd.installation_status,
      public._platform_portal_derive_license_provisioning_status(
        ll.domain_reference,
        lcd.installation_id,
        lcd.installation_status
      ) as provisioning_status,
      coalesce(svc.active_service_count, 0) as active_service_count,
      svc.website_kompis_status,
      ll.created_at,
      lower(coalesce(ll.license_status, '')) as status_l
    from public.aipify_billing_license_links ll
    join scoped sc on sc.organization_id = ll.organization_id
    left join primary_subscription ps on ps.customer_id = sc.customer_id
    left join lateral (
      select
        nullif(btrim(cd.status), '') as domain_status,
        (
          lower(coalesce(cd.verification_status, '')) = 'verified'
          or cd.verified_at is not null
        ) as domain_verified,
        cd.installation_id,
        cd.installation_id as install_id,
        i.status as installation_status
      from public.customer_domains cd
      left join public.installations i on i.id = cd.installation_id
      where cd.customer_id = sc.customer_id
        and nullif(btrim(ll.domain_reference), '') is not null
        and lower(btrim(cd.domain)) = lower(btrim(ll.domain_reference))
        and lower(coalesce(cd.status, '')) <> 'removed'
      order by cd.created_at desc nulls last, cd.id asc
      limit 1
    ) lcd on true
    left join lateral (
      select
        (
          select count(tm.id)::integer
          from public.tenant_modules tm
          where tm.tenant_id = sc.customer_id
            and coalesce(tm.enabled, false) = true
            and lower(coalesce(tm.status, '')) in ('enabled', 'active')
        ) as active_service_count,
        case
          when exists (
            select 1
            from public.tenant_modules tm2
            join public.tenant_public_companion_install_config cfg
              on cfg.tenant_id = tm2.tenant_id
            join public.installations inst
              on inst.id = cfg.install_id
             and (inst.customer_id = sc.customer_id or inst.company_id = sc.company_id)
            where tm2.tenant_id = sc.customer_id
              and tm2.module_key = 'website_kompis'
              and coalesce(tm2.licensed, false) = true
              and coalesce(tm2.enabled, false) = true
              and lower(coalesce(tm2.status, '')) = 'enabled'
              and coalesce((cfg.config ->> 'enabled')::boolean, false) = true
          ) then 'active'
          when exists (
            select 1
            from public.tenant_modules tm3
            where tm3.tenant_id = sc.customer_id
              and tm3.module_key = 'website_kompis'
              and lower(coalesce(tm3.status, '')) in ('suspended', 'revoked', 'disabled')
          ) then 'suspended'
          else 'not_ready'
        end as website_kompis_status
    ) svc on true
  ),
  classified as (
    select
      lr.*,
      lower(coalesce(lr.provisioning_status, '')) as prov_l,
      (
        lr.status_l in ('suspended', 'revoked', 'expired')
        or lower(coalesce(lr.provisioning_status, '')) in (
          'failed',
          'requires_domain',
          'requires_installation'
        )
      ) as needs_attention,
      (lower(coalesce(lr.provisioning_status, '')) = 'ready_for_activation') as is_ready,
      (lower(coalesce(lr.provisioning_status, '')) in ('active', 'provisioned')) as is_active_setup
    from license_rows lr
  ),
  license_json as (
    select
      coalesce(
        jsonb_agg(
          jsonb_build_object(
            'license_id', c.license_id,
            'customer_id', c.customer_id,
            'company_id', c.company_id,
            'customer_key', c.customer_key,
            'company_name', c.company_name,
            'registration_number', c.registration_number,
            'country_code', c.country_code,
            'license_product_code', c.license_product_code,
            'license_status', c.license_status,
            'provisioning_status', c.provisioning_status,
            'masked_license_key', c.masked_license_key,
            'agreement', jsonb_build_object(
              'status', c.agreement_status,
              'duration', c.agreement_duration,
              'name', c.agreement_name
            ),
            'domain', jsonb_build_object(
              'hostname', c.domain_hostname,
              'status', c.domain_status,
              'verified', c.domain_verified
            ),
            'installation', jsonb_build_object(
              'id', c.installation_id,
              'install_id', c.install_id,
              'status', c.installation_status
            ),
            'services', jsonb_build_object(
              'active_count', c.active_service_count,
              'website_kompis_status', c.website_kompis_status
            ),
            'created_at', c.created_at,
            'activated_at', null,
            'expires_at', null
          )
          order by lower(c.company_name), c.license_id
        ),
        '[]'::jsonb
      ) as licenses
    from classified c
  ),
  metrics as (
    select jsonb_build_object(
      'total_licenses', count(*)::integer,
      'active_licenses', count(*) filter (where status_l = 'active')::integer,
      'pending_licenses', count(*) filter (where status_l = 'pending')::integer,
      'attention_licenses', count(*) filter (where needs_attention)::integer,
      'ready_for_activation_licenses', count(*) filter (where is_ready)::integer,
      'active_setup_licenses', count(*) filter (where is_active_setup)::integer
    ) as metrics
    from classified
  )
  select jsonb_build_object(
    'generated_at', now(),
    'metrics', m.metrics,
    'licenses', lj.licenses
  )
  into v_payload
  from metrics m
  cross join license_json lj;

  return coalesce(v_payload, jsonb_build_object(
    'generated_at', now(),
    'metrics', jsonb_build_object(
      'total_licenses', 0,
      'active_licenses', 0,
      'pending_licenses', 0,
      'attention_licenses', 0,
      'ready_for_activation_licenses', 0,
      'active_setup_licenses', 0
    ),
    'licenses', '[]'::jsonb
  ));
end;
$$;

revoke all on function public.get_platform_portal_licenses_overview()
  from public, anon;
grant execute on function public.get_platform_portal_licenses_overview()
  to authenticated;
