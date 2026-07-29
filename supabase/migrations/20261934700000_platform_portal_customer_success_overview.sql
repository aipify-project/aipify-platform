-- Platform Portal Customer Success Overview V1 (read-only).
-- One row per ordinary customer from authoritative portal relations.
-- No tables. No data writes. No health/churn/sentiment scores.

create or replace function public.get_platform_portal_customer_success_overview()
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
      nullif(btrim(cu.organization_number), '') as organization_number,
      nullif(upper(btrim(cu.country)), '') as country_code,
      nullif(btrim(cu.status), '') as lifecycle_status
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
      s.plan_key,
      s.plan_type,
      s.billing_cycle,
      s.license_service_status,
      s.trial_ends_at
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
  license_stats as (
    select
      sc.organization_id,
      count(ll.id)::integer as license_count,
      count(ll.id) filter (
        where lower(coalesce(ll.license_status, '')) = 'active'
      )::integer as active_license_count,
      (
        select ll2.license_status
        from public.aipify_billing_license_links ll2
        where ll2.organization_id = sc.organization_id
        order by
          case lower(coalesce(ll2.license_status, ''))
            when 'active' then 1
            when 'pending' then 2
            when 'suspended' then 3
            when 'revoked' then 4
            else 5
          end,
          ll2.created_at desc nulls last,
          ll2.id asc
        limit 1
      ) as primary_status,
      (
        select public._platform_portal_derive_license_provisioning_status(
          ll3.domain_reference,
          lcd.installation_id,
          lcd.installation_status
        )
        from public.aipify_billing_license_links ll3
        left join lateral (
          select
            cd.installation_id,
            i.status as installation_status
          from public.customer_domains cd
          left join public.installations i on i.id = cd.installation_id
          where cd.customer_id = sc.customer_id
            and nullif(btrim(ll3.domain_reference), '') is not null
            and lower(btrim(cd.domain)) = lower(btrim(ll3.domain_reference))
            and lower(coalesce(cd.status, '')) <> 'removed'
          order by cd.created_at desc nulls last, cd.id asc
          limit 1
        ) lcd on true
        where ll3.organization_id = sc.organization_id
        order by
          case lower(coalesce(ll3.license_status, ''))
            when 'active' then 1
            when 'pending' then 2
            else 3
          end,
          ll3.created_at desc nulls last,
          ll3.id asc
        limit 1
      ) as provisioning_status
    from scoped sc
    left join public.aipify_billing_license_links ll
      on ll.organization_id = sc.organization_id
    group by sc.organization_id, sc.customer_id
  ),
  domain_stats as (
    select
      sc.customer_id,
      count(cd.id)::integer as domain_count,
      count(cd.id) filter (
        where lower(coalesce(cd.verification_status, '')) = 'verified'
          or cd.verified_at is not null
      )::integer as verified_count,
      (
        select nullif(btrim(cd2.domain), '')
        from public.customer_domains cd2
        where cd2.customer_id = sc.customer_id
          and lower(coalesce(cd2.status, '')) <> 'removed'
        order by
          (cd2.verified_at is not null) desc,
          cd2.created_at desc nulls last,
          cd2.id asc
        limit 1
      ) as primary_domain
    from scoped sc
    left join public.customer_domains cd
      on cd.customer_id = sc.customer_id
     and lower(coalesce(cd.status, '')) <> 'removed'
    group by sc.customer_id
  ),
  install_stats as (
    select
      sc.customer_id,
      count(distinct i.id)::integer as installation_count,
      count(distinct i.id) filter (
        where i.revoked_at is null
          and lower(coalesce(i.status, '')) not in ('revoked', 'failed', 'disabled', 'removed')
      )::integer as active_count,
      count(distinct i.id) filter (
        where i.revoked_at is not null
          or lower(coalesce(i.status, '')) = 'revoked'
      )::integer as revoked_count,
      count(distinct i.id) filter (
        where i.revoked_at is null
          and lower(coalesce(i.status, '')) = 'failed'
      )::integer as failed_count
    from scoped sc
    left join public.installations i
      on i.customer_id = sc.customer_id
      or i.company_id = sc.company_id
    group by sc.customer_id
  ),
  service_stats as (
    select
      sc.customer_id,
      count(tm.id) filter (
        where coalesce(tm.enabled, false) = true
          and lower(coalesce(tm.status, '')) in ('enabled', 'active')
      )::integer as active_service_count,
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
        when coalesce(ls.provisioning_status, '') = 'ready_for_activation' then 'ready_for_activation'
        when coalesce(ls.provisioning_status, '') = 'active' then 'active'
        else 'not_ready'
      end as website_kompis_status
    from scoped sc
    left join public.tenant_modules tm
      on tm.tenant_id = sc.customer_id
    left join license_stats ls on ls.organization_id = sc.organization_id
    group by
      sc.customer_id,
      sc.company_id,
      ls.provisioning_status
  ),
  member_stats as (
    select
      sc.company_id,
      count(distinct u.id)::integer as registered_users,
      max(u.last_login_at) as last_relevant_activity_at
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
  enriched as (
    select
      sc.customer_id,
      sc.company_id,
      sc.customer_key,
      sc.company_name,
      sc.country_code,
      sc.lifecycle_status,
      sc.organization_number,
      ds.primary_domain,
      ps.status as agreement_status,
      case
        when ps.customer_id is null then null
        when lower(coalesce(ps.plan_key, '')) = 'lifetime'
          or lower(coalesce(ps.plan_type, '')) = 'lifetime'
          or lower(coalesce(ps.billing_cycle, '')) = 'lifetime'
        then 'lifetime'
        else nullif(btrim(coalesce(ps.billing_cycle, ps.plan_type)), '')
      end as agreement_duration,
      case
        when lower(coalesce(ps.status, '')) = 'trialing' then ps.trial_ends_at
        else null
      end as trial_ends_at,
      coalesce(ls.license_count, 0) as license_count,
      coalesce(ls.active_license_count, 0) as license_active_count,
      ls.primary_status as license_primary_status,
      ls.provisioning_status,
      coalesce(ds.domain_count, 0) as domain_count,
      coalesce(ds.verified_count, 0) as domain_verified_count,
      coalesce(ins.installation_count, 0) as installation_count,
      coalesce(ins.active_count, 0) as installation_active_count,
      coalesce(ins.revoked_count, 0) as installation_revoked_count,
      coalesce(ins.failed_count, 0) as installation_failed_count,
      coalesce(svc.active_service_count, 0) as active_service_count,
      svc.website_kompis_status,
      coalesce(ms.registered_users, 0) as registered_users,
      coalesce(ss.open_support_count, 0) as open_support_count,
      ms.last_relevant_activity_at,
      lower(coalesce(ps.status, '')) as agr_status_l,
      lower(coalesce(ps.license_service_status, '')) as agr_license_service_l,
      lower(coalesce(ls.primary_status, '')) as lic_status_l,
      lower(coalesce(ls.provisioning_status, '')) as prov_status_l,
      lower(coalesce(svc.website_kompis_status, '')) as wk_status_l
    from scoped sc
    left join primary_subscription ps on ps.customer_id = sc.customer_id
    left join license_stats ls on ls.organization_id = sc.organization_id
    left join domain_stats ds on ds.customer_id = sc.customer_id
    left join install_stats ins on ins.customer_id = sc.customer_id
    left join service_stats svc on svc.customer_id = sc.customer_id
    left join member_stats ms on ms.company_id = sc.company_id
    left join support_stats ss on ss.customer_id = sc.customer_id
  ),
  classified as (
    select
      e.*,
      (
        select coalesce(jsonb_agg(to_jsonb(code) order by ord), '[]'::jsonb)
        from (
          select code, ord
          from (
            select 'agreement_suspended' as code, 10 as ord
            where e.agr_status_l in ('suspended', 'paused')
               or e.agr_license_service_l = 'paused'
            union all
            select 'agreement_past_due', 20
            where e.agr_status_l in ('past_due', 'unpaid')
            union all
            select 'license_suspended', 30
            where e.lic_status_l in ('suspended', 'revoked')
            union all
            select 'installation_revoked', 40
            where e.installation_revoked_count > 0
            union all
            select 'setup_failed', 50
            where e.prov_status_l = 'failed'
               or e.installation_failed_count > 0
            union all
            select 'agreement_pending', 110
            where e.agr_status_l in ('pending', 'incomplete', 'incomplete_payment')
            union all
            select 'license_pending', 120
            where e.license_count > 0
              and e.license_active_count = 0
              and e.lic_status_l = 'pending'
            union all
            select 'domain_missing', 130
            where e.license_active_count > 0
              and e.domain_count = 0
            union all
            select 'domain_unverified', 140
            where e.domain_count > 0
              and e.domain_verified_count = 0
              and e.license_active_count > 0
            union all
            select 'installation_missing', 150
            where e.license_active_count > 0
              and e.domain_count > 0
              and e.installation_active_count = 0
              and e.installation_revoked_count = 0
            union all
            select 'service_ready_for_activation', 160
            where e.wk_status_l = 'ready_for_activation'
               or e.prov_status_l = 'ready_for_activation'
            union all
            select 'agreement_missing', 210
            where e.agreement_status is null
            union all
            select 'license_missing', 220
            where e.agreement_status is not null
              and e.license_count = 0
            union all
            select 'setup_incomplete', 230
            where e.agreement_status is not null
              and e.license_count = 0
            union all
            select 'agreement_active', 310
            where e.agr_status_l in ('active', 'trialing')
              and e.agr_license_service_l is distinct from 'paused'
            union all
            select 'license_active', 320
            where e.license_active_count > 0
            union all
            select 'service_active', 330
            where e.wk_status_l = 'active'
            union all
            select 'setup_complete', 340
            where e.agr_status_l in ('active', 'trialing')
              and e.agr_license_service_l is distinct from 'paused'
              and e.license_active_count > 0
              and e.domain_count > 0
              and e.installation_active_count > 0
              and e.installation_revoked_count = 0
              and e.prov_status_l is distinct from 'failed'
              and e.prov_status_l is distinct from 'ready_for_activation'
              and e.wk_status_l is distinct from 'ready_for_activation'
          ) reasons
        ) ordered
      ) as success_reason_codes
    from enriched e
  ),
  final_rows as (
    select
      c.*,
      case
        when exists (
          select 1
          from jsonb_array_elements_text(c.success_reason_codes) r(code)
          where r.code in (
            'agreement_suspended',
            'agreement_past_due',
            'license_suspended',
            'installation_revoked',
            'setup_failed'
          )
        ) then 'critical'
        when exists (
          select 1
          from jsonb_array_elements_text(c.success_reason_codes) r(code)
          where r.code in (
            'agreement_pending',
            'license_pending',
            'domain_missing',
            'domain_unverified',
            'installation_missing',
            'service_ready_for_activation'
          )
        ) then 'attention'
        when exists (
          select 1
          from jsonb_array_elements_text(c.success_reason_codes) r(code)
          where r.code in (
            'agreement_missing',
            'license_missing',
            'setup_incomplete'
          )
        ) then 'incomplete'
        when exists (
          select 1
          from jsonb_array_elements_text(c.success_reason_codes) r(code)
          where r.code = 'setup_complete'
        )
          and c.agr_status_l in ('active', 'trialing')
          and c.license_active_count > 0
          and c.domain_count > 0
          and c.installation_active_count > 0
        then 'healthy'
        else 'unknown'
      end as success_status
    from classified c
  ),
  customer_json as (
    select
      coalesce(
        jsonb_agg(
          jsonb_build_object(
            'customer_id', fr.customer_id,
            'company_id', fr.company_id,
            'customer_key', fr.customer_key,
            'company_name', fr.company_name,
            'organization_number', fr.organization_number,
            'country_code', fr.country_code,
            'lifecycle_status', fr.lifecycle_status,
            'success_status', fr.success_status,
            'success_reason_codes', fr.success_reason_codes,
            'agreement', jsonb_build_object(
              'status', fr.agreement_status,
              'duration', fr.agreement_duration,
              'trial_ends_at', fr.trial_ends_at
            ),
            'license', jsonb_build_object(
              'count', fr.license_count,
              'active_count', fr.license_active_count,
              'primary_status', fr.license_primary_status,
              'provisioning_status', fr.provisioning_status
            ),
            'domains', jsonb_build_object(
              'count', fr.domain_count,
              'verified_count', fr.domain_verified_count,
              'primary_domain', fr.primary_domain
            ),
            'installations', jsonb_build_object(
              'count', fr.installation_count,
              'active_count', fr.installation_active_count,
              'revoked_count', fr.installation_revoked_count
            ),
            'services', jsonb_build_object(
              'active_count', fr.active_service_count,
              'website_kompis_status', fr.website_kompis_status
            ),
            'registered_users', fr.registered_users,
            'support', jsonb_build_object(
              'open_count', fr.open_support_count
            ),
            'last_relevant_activity_at', fr.last_relevant_activity_at
          )
          order by lower(fr.company_name), fr.customer_id
        ),
        '[]'::jsonb
      ) as customers
    from final_rows fr
  ),
  metrics as (
    select jsonb_build_object(
      'total_customers', count(*)::integer,
      'healthy_customers', count(*) filter (where success_status = 'healthy')::integer,
      'attention_customers', count(*) filter (where success_status = 'attention')::integer,
      'critical_customers', count(*) filter (where success_status = 'critical')::integer,
      'incomplete_customers', count(*) filter (where success_status = 'incomplete')::integer,
      'unknown_customers', count(*) filter (where success_status = 'unknown')::integer
    ) as metrics
    from final_rows
  )
  select jsonb_build_object(
    'generated_at', now(),
    'metrics', m.metrics,
    'customers', cj.customers
  )
  into v_payload
  from metrics m
  cross join customer_json cj;

  return coalesce(v_payload, jsonb_build_object(
    'generated_at', now(),
    'metrics', jsonb_build_object(
      'total_customers', 0,
      'healthy_customers', 0,
      'attention_customers', 0,
      'critical_customers', 0,
      'incomplete_customers', 0,
      'unknown_customers', 0
    ),
    'customers', '[]'::jsonb
  ));
end;
$$;

revoke all on function public.get_platform_portal_customer_success_overview()
  from public, anon;
grant execute on function public.get_platform_portal_customer_success_overview()
  to authenticated;
