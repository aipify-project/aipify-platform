-- Platform portal dashboard RPC repair
-- Fixes subscription→customer→company join; removes unused payload fields.

create or replace function public._ppsf258_require_platform_access()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.platform_admins pa
    where pa.auth_user_id = auth.uid()
      and pa.role in ('super_admin', 'platform_support')
      and coalesce(pa.status, 'active') = 'active'
  ) then
    raise exception 'Platform portal access denied';
  end if;
end;
$$;

revoke all on function public._ppsf258_require_platform_access() from public, anon;
grant execute on function public._ppsf258_require_platform_access() to authenticated;

create or replace function public.get_platform_portal_dashboard()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_orgs_attention integer := 0;
  v_active_subscriptions integer := 0;
  v_support_open integer := 0;
  v_payment_summary jsonb := '{}'::jsonb;
  v_customer_success jsonb := '{}'::jsonb;
  v_marketplace jsonb := '{}'::jsonb;
  v_product_updates jsonb := '{}'::jsonb;
  v_orgs_total integer := 0;
begin
  perform public._ppsf258_require_platform_access();

  select count(*)::int
  into v_orgs_total
  from public.companies c
  where coalesce(c.is_platform, false) = false;

  select count(*)::int
  into v_active_subscriptions
  from public.subscriptions s
  where s.status in ('active', 'trialing');

  if to_regclass('public.subscriptions') is not null then
    select count(*)::int
    into v_orgs_attention
    from public.subscriptions s
    join public.customers cust on cust.id = s.customer_id
    join public.companies c on c.id = cust.company_id
    where coalesce(c.is_platform, false) = false
      and s.status in ('past_due', 'unpaid', 'paused');
  end if;

  if v_orgs_attention = 0 then
    v_orgs_attention := greatest(0, v_orgs_total - v_active_subscriptions);
  end if;

  if to_regclass('public.support_cases') is not null then
    select count(*)::int
    into v_support_open
    from public.support_cases sc
    where sc.status in ('open', 'in_progress', 'escalated');
  end if;

  v_payment_summary := jsonb_build_object(
    'active', v_active_subscriptions,
    'past_due', (
      select count(*)::int
      from public.subscriptions s
      where s.status = 'past_due'
    ),
    'trialing', (
      select count(*)::int
      from public.subscriptions s
      where s.status = 'trialing'
    )
  );

  v_customer_success := jsonb_build_object(
    'organizations_total', v_orgs_total,
    'organizations_requiring_attention', v_orgs_attention,
    'healthy_ratio_pct', case
      when v_orgs_total = 0 then 100
      else round(100.0 * (v_orgs_total - v_orgs_attention) / v_orgs_total, 1)
    end
  );

  if to_regclass('public.skills') is not null then
    select jsonb_build_object(
      'pending_review', count(*) filter (where s.status in ('planned', 'beta')),
      'published', count(*) filter (where s.status = 'active')
    )
    into v_marketplace
    from public.skills s;
  else
    v_marketplace := jsonb_build_object('pending_review', 0, 'published', 0);
  end if;

  if to_regclass('public.platform_updates') is not null then
    select coalesce(jsonb_agg(
      jsonb_build_object(
        'id', u.id,
        'title', u.title,
        'version', u.version,
        'classification', u.update_type,
        'scheduled_at', u.scheduled_at
      )
      order by u.scheduled_at desc nulls last
    ), '[]'::jsonb)
    into v_product_updates
    from (
      select *
      from public.platform_updates
      order by created_at desc
      limit 5
    ) u;
  else
    v_product_updates := '[]'::jsonb;
  end if;

  return jsonb_build_object(
    'organizations_requiring_attention', v_orgs_attention,
    'active_subscriptions', v_active_subscriptions,
    'open_support_workload', v_support_open,
    'payment_status_summary', v_payment_summary,
    'customer_success_indicators', v_customer_success,
    'marketplace_moderation', v_marketplace,
    'product_deployment_updates', v_product_updates
  );
end;
$$;

revoke all on function public.get_platform_portal_dashboard() from public, anon;
grant execute on function public.get_platform_portal_dashboard() to authenticated;
