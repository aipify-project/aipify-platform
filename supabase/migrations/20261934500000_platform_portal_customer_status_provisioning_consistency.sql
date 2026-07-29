-- Platform portal customer status & provisioning consistency V1.
-- Read-RPC repair only. No customer data writes. No Website Kompis activation.

create or replace function public._platform_portal_derive_license_provisioning_status(
  p_domain_reference text,
  p_installation_id uuid,
  p_installation_status text
)
returns text
language sql
immutable
set search_path = public
as $$
  select case
    when nullif(btrim(coalesce(p_domain_reference, '')), '') is null then 'requires_domain'
    when p_installation_id is null then 'requires_installation'
    when lower(coalesce(p_installation_status, '')) = 'failed' then 'failed'
    when lower(coalesce(p_installation_status, '')) = 'active' then 'ready_for_activation'
    else 'ready_for_activation'
  end;
$$;

revoke all on function public._platform_portal_derive_license_provisioning_status(text, uuid, text)
  from public, anon, authenticated;


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
        'provisioning_status', public._platform_portal_derive_license_provisioning_status(
          ll.domain_reference,
          lcd.installation_id,
          lcd.installation_status
        ),
        'installation_id', lcd.installation_id,
        'install_id', lcd.installation_id,
        'provisioning_required', (
          public._platform_portal_derive_license_provisioning_status(
            ll.domain_reference,
            lcd.installation_id,
            lcd.installation_status
          ) in ('requires_domain', 'requires_installation')
        ),
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
  left join lateral (
    select
      cd.installation_id,
      i.status as installation_status
    from public.customer_domains cd
    left join public.installations i on i.id = cd.installation_id
    where cd.customer_id = v_org_id
      and nullif(btrim(ll.domain_reference), '') is not null
      and lower(btrim(cd.domain)) = lower(btrim(ll.domain_reference))
      and lower(coalesce(cd.status, '')) <> 'removed'
    order by cd.created_at desc nulls last, cd.id asc
    limit 1
  ) lcd on true
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
        'is_primary', coalesce(od.is_primary, false),
        'role', case
          when lower(coalesce(od.domain_status, '')) in ('removed', 'disabled') then 'historical'
          when exists (
            select 1
            from public.aipify_billing_license_links llx
            where llx.organization_id = v_org_id
              and nullif(btrim(llx.domain_reference), '') is not null
              and lower(btrim(llx.domain_reference)) = lower(btrim(od.domain))
          ) then 'license'
          when cd.installation_id is not null then 'runtime'
          when coalesce(od.is_primary, false) then 'customer'
          else null
        end,
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
        'provisioning_status', public._platform_portal_derive_license_provisioning_status(
          ll.domain_reference,
          cd.installation_id,
          cd.installation_status
        ),
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
    select
      cd.installation_id,
      i.status as installation_status
    from public.customer_domains cd
    left join public.installations i on i.id = cd.installation_id
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
          'provisioning_status', public._platform_portal_derive_license_provisioning_status(
            ll.domain_reference,
            lcd.installation_id,
            lcd.installation_status
          ),
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
      select
        cd.installation_id,
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
          'is_primary', coalesce(od.is_primary, false),
          'role', case
            when lower(coalesce(od.domain_status, '')) in ('removed', 'disabled') then 'historical'
            when exists (
              select 1
              from public.aipify_billing_license_links llx
              where llx.organization_id = sc.organization_id
                and nullif(btrim(llx.domain_reference), '') is not null
                and lower(btrim(llx.domain_reference)) = lower(btrim(od.domain))
            ) then 'license'
            when cd.installation_id is not null then 'runtime'
            when coalesce(od.is_primary, false) then 'customer'
            else null
          end,
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
