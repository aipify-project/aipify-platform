-- Platform global control-plane overview (read-only aggregate).
-- Reuses existing authoritative sources. No parallel models. No payments/payouts/invoice creation.
-- Fail-closed: unknown metrics return null (never fake zero health/MRR).

create or replace function public.get_platform_control_plane_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_orgs_total integer := 0;
  v_orgs_attention integer := 0;
  v_active_subscriptions integer := 0;
  v_support_open integer := 0;
  v_payment_active integer := 0;
  v_payment_past_due integer := 0;
  v_payment_trialing integer := 0;
  v_active_partners integer := null;
  v_pending_partner_invoices integer := null;
  v_open_incidents integer := null;
  v_pending_approvals integer := null;
begin
  perform public._ppsf258_require_platform_access();

  select count(*)::int
  into v_orgs_total
  from public.organizations o
  join public.customers cu on cu.id = o.id
  join public.companies co on co.id = cu.company_id
  where coalesce(co.is_platform, false) = false;

  select count(*)::int
  into v_active_subscriptions
  from public.subscriptions s
  join public.customers cu on cu.id = s.customer_id
  join public.companies co on co.id = cu.company_id
  where coalesce(co.is_platform, false) = false
    and s.status in ('active', 'trialing');

  select count(*)::int
  into v_orgs_attention
  from public.organizations o
  join public.customers cu on cu.id = o.id
  join public.companies co on co.id = cu.company_id
  where coalesce(co.is_platform, false) = false
    and (
      not exists (
        select 1
        from public.subscriptions s
        where s.customer_id = cu.id
          and s.status in ('active', 'trialing')
      )
      or exists (
        select 1
        from public.subscriptions s
        where s.customer_id = cu.id
          and s.status in ('past_due', 'unpaid', 'paused')
      )
    );

  if to_regclass('public.support_cases') is not null then
    select count(*)::int
    into v_support_open
    from public.support_cases sc
    where sc.status in ('open', 'in_progress', 'escalated');
  end if;

  select count(*)::int into v_payment_active
  from public.subscriptions s where s.status = 'active';

  select count(*)::int into v_payment_past_due
  from public.subscriptions s where s.status = 'past_due';

  select count(*)::int into v_payment_trialing
  from public.subscriptions s where s.status = 'trialing';

  if to_regclass('public.growth_partner_app_profiles') is not null then
    execute $q$
      select count(*)::int
      from public.growth_partner_app_profiles
    $q$
    into v_active_partners;
  end if;

  if to_regclass('public.growth_partner_portal_settlement_invoices') is not null
     and exists (
       select 1
       from information_schema.columns
       where table_schema = 'public'
         and table_name = 'growth_partner_portal_settlement_invoices'
         and column_name = 'status'
     )
  then
    execute $q$
      select count(*)::int
      from public.growth_partner_portal_settlement_invoices
      where status in ('pending', 'submitted', 'received', 'mismatch', 'under_review')
    $q$
    into v_pending_partner_invoices;
  end if;

  if to_regclass('public.platform_incidents') is not null
     and exists (
       select 1
       from information_schema.columns
       where table_schema = 'public'
         and table_name = 'platform_incidents'
         and column_name = 'status'
     )
  then
    execute $q$
      select count(*)::int
      from public.platform_incidents
      where status in ('detected', 'investigating', 'identified', 'monitoring', 'open')
    $q$
    into v_open_incidents;
  end if;

  -- Approvals remain on existing action engines; do not invent a count without a known column.
  v_pending_approvals := null;

  return jsonb_build_object(
    'generated_at', now(),
    'source', 'get_platform_control_plane_overview',
    'customers', jsonb_build_object(
      'organizations_total', v_orgs_total,
      'active_subscriptions', v_active_subscriptions,
      'requiring_attention', v_orgs_attention,
      'open_support', v_support_open
    ),
    'finance', jsonb_build_object(
      'payment_active', v_payment_active,
      'payment_past_due', v_payment_past_due,
      'payment_trialing', v_payment_trialing,
      'outstanding_invoices', null,
      'failed_payments', null,
      'monthly_recurring_revenue', null,
      'source_note', 'subscription_status_only'
    ),
    'partners', jsonb_build_object(
      'active_partners', v_active_partners,
      'earned_commission', null,
      'pending_partner_invoices', v_pending_partner_invoices,
      'source_note', 'partial_partner_sources'
    ),
    'operations', jsonb_build_object(
      'system_health', null,
      'open_incidents', v_open_incidents,
      'pending_approvals', v_pending_approvals,
      'source_note', 'no_fake_health'
    )
  );
end;
$$;

revoke all on function public.get_platform_control_plane_overview() from public, anon, authenticated;
grant execute on function public.get_platform_control_plane_overview() to authenticated;
grant execute on function public.get_platform_control_plane_overview() to service_role;

comment on function public.get_platform_control_plane_overview() is
  'Platform control-plane overview. Partial authoritative aggregates only; null means no connected source.';
