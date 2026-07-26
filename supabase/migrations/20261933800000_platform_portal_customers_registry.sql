-- Platform portal Customer Registry V1.
-- Authoritative customer orgs: organizations → customers → non-platform companies.
-- One row per organization; primary subscription from public.subscriptions only.

create or replace function public.get_platform_portal_customers()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_customers jsonb := '[]'::jsonb;
  v_total integer := 0;
  v_active integer := 0;
  v_new_30d integer := 0;
  v_requires_attention integer := 0;
begin
  perform public._ppsf258_require_platform_access();

  with scoped as (
    select
      o.id as organization_id,
      cu.id as customer_id,
      co.id as company_id,
      nullif(btrim(co.name), '') as company_name,
      nullif(btrim(cu.company_name), '') as customer_company_name,
      nullif(btrim(o.name), '') as organization_name,
      cu.organization_number,
      o.slug as organization_slug,
      cu.status as customer_status,
      cu.created_at,
      nullif(btrim(cu.full_name), '') as primary_contact_name,
      o.attributed_growth_partner_profile_id,
      nullif(btrim(o.attributed_growth_partner_public_id), '') as attributed_growth_partner_public_id
    from public.organizations o
    join public.customers cu on cu.id = o.id
    join public.companies co on co.id = cu.company_id
    where coalesce(co.is_platform, false) = false
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
      s.payment_overdue_since,
      s.created_at,
      s.updated_at
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
      count(distinct u.id)::integer as member_count,
      max(u.last_login_at) as last_activity_at
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
    where lower(coalesce(scase.status, '')) in ('open', 'in_progress', 'escalated')
    group by sc.customer_id
  ),
  rows as (
    select
      sc.organization_id,
      sc.customer_id,
      sc.company_id,
      coalesce(sc.company_name, sc.customer_company_name, sc.organization_name) as legal_name,
      sc.organization_number,
      sc.organization_slug,
      sc.customer_status,
      sc.created_at,
      ps.status as subscription_status,
      ps.plan_key as subscription_plan_key,
      ps.plan_type as subscription_plan_type,
      ps.plan_name as subscription_plan_name,
      ps.billing_cycle as subscription_billing_cycle,
      ps.created_at as subscription_created_at,
      ps.updated_at as subscription_updated_at,
      (
        lower(coalesce(ps.plan_key, '')) = 'lifetime'
        or lower(coalesce(ps.plan_type, '')) = 'lifetime'
        or lower(coalesce(ps.billing_cycle, '')) = 'lifetime'
      ) as is_lifetime,
      sc.primary_contact_name,
      coalesce(ms.member_count, 0) as member_count,
      ps.license_service_status,
      ps.payment_overdue_since,
      (
        sc.attributed_growth_partner_profile_id is not null
        or sc.attributed_growth_partner_public_id is not null
      ) as is_partner_attributed,
      sc.attributed_growth_partner_profile_id::text as growth_partner_profile_id,
      sc.attributed_growth_partner_public_id as growth_partner_public_id,
      coalesce(ss.open_support_count, 0) as open_support_count,
      ms.last_activity_at,
      (
        ps.customer_id is null
        or lower(coalesce(ps.status, '')) not in ('active', 'trialing')
        or lower(coalesce(ps.status, '')) in ('past_due', 'unpaid', 'paused')
        or lower(coalesce(ps.license_service_status, '')) = 'paused'
      ) as requires_attention
    from scoped sc
    left join primary_subscription ps on ps.customer_id = sc.customer_id
    left join member_stats ms on ms.company_id = sc.company_id
    left join support_stats ss on ss.customer_id = sc.customer_id
  )
  select
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'organization_id', r.organization_id,
          'customer_id', r.customer_id,
          'company_id', r.company_id,
          'legal_name', r.legal_name,
          'organization_number', r.organization_number,
          'organization_slug', r.organization_slug,
          'customer_status', r.customer_status,
          'created_at', r.created_at,
          'subscription_status', r.subscription_status,
          'subscription_plan_key', r.subscription_plan_key,
          'subscription_plan_type', r.subscription_plan_type,
          'subscription_plan_name', r.subscription_plan_name,
          'subscription_billing_cycle', r.subscription_billing_cycle,
          'subscription_created_at', r.subscription_created_at,
          'subscription_updated_at', r.subscription_updated_at,
          'is_lifetime', r.is_lifetime,
          'primary_contact_name', r.primary_contact_name,
          'member_count', r.member_count,
          'license_service_status', r.license_service_status,
          'payment_overdue_since', r.payment_overdue_since,
          'is_partner_attributed', r.is_partner_attributed,
          'growth_partner_profile_id', r.growth_partner_profile_id,
          'growth_partner_public_id', r.growth_partner_public_id,
          'open_support_count', r.open_support_count,
          'last_activity_at', r.last_activity_at,
          'requires_attention', r.requires_attention
        )
        order by
          r.requires_attention desc,
          r.legal_name asc nulls last,
          r.organization_id asc
      ),
      '[]'::jsonb
    ),
    count(*)::integer,
    count(*) filter (
      where lower(coalesce(r.subscription_status, '')) in ('active', 'trialing')
    )::integer,
    count(*) filter (
      where r.created_at >= now() - interval '30 days'
    )::integer,
    count(*) filter (
      where r.requires_attention
    )::integer
  into
    v_customers,
    v_total,
    v_active,
    v_new_30d,
    v_requires_attention
  from rows r;

  return jsonb_build_object(
    'summary', jsonb_build_object(
      'total', coalesce(v_total, 0),
      'active', coalesce(v_active, 0),
      'new_30d', coalesce(v_new_30d, 0),
      'requires_attention', coalesce(v_requires_attention, 0)
    ),
    'customers', coalesce(v_customers, '[]'::jsonb)
  );
end;
$$;

revoke all on function public.get_platform_portal_customers() from public, anon;
grant execute on function public.get_platform_portal_customers() to authenticated;
