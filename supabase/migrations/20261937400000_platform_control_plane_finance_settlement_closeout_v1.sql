-- Platform control-plane closeout: authoritative finance KPIs + partner settlement ops read model.
-- Reuses existing invoices / subscriptions / growth_partner_portal_* tables.
-- Read-only. No payouts, invoice creation, accounting mutation, or fake health.

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
  v_outstanding numeric := null;
  v_outstanding_currency text := null;
  v_outstanding_currencies integer := null;
  v_mrr numeric := null;
  v_failed_payments integer := null;
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

  -- Authoritative finance: same formulas as get_platform_metrics() (invoices / subscriptions).
  if to_regclass('public.invoices') is not null then
    select coalesce(sum(inv.amount), 0), count(distinct inv.currency)::int
    into v_outstanding, v_outstanding_currencies
    from public.invoices inv
    where inv.status in ('sent', 'overdue');

    if v_outstanding_currencies = 1 then
      select inv.currency into v_outstanding_currency
      from public.invoices inv
      where inv.status in ('sent', 'overdue')
      limit 1;
    elsif v_outstanding_currencies > 1 then
      v_outstanding_currency := 'MIXED';
    else
      v_outstanding_currency := null;
      v_outstanding := 0;
    end if;
  end if;

  if to_regclass('public.subscriptions') is not null then
    select coalesce(sum(
      case
        when s.billing_cycle = 'yearly' then s.price_amount / 12
        else s.price_amount
      end
    ), 0)
    into v_mrr
    from public.subscriptions s
    where s.status in ('active', 'trialing');
  end if;

  -- Failed payments remain null until an authoritative failed-status domain is certified.
  -- Do not treat absence of rows as zero failures.
  v_failed_payments := null;

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
         and column_name = 'invoice_status'
     )
  then
    execute $q$
      select count(*)::int
      from public.growth_partner_portal_settlement_invoices
      where invoice_status in ('draft', 'finalized', 'sent_to_accounting')
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
      'outstanding_invoices', v_outstanding,
      'outstanding_invoice_currency', v_outstanding_currency,
      'failed_payments', v_failed_payments,
      'monthly_recurring_revenue', v_mrr,
      'mrr_currency', 'NOK',
      'source_note', 'subscriptions_and_invoices_aligned_with_get_platform_metrics',
      'drill_down', jsonb_build_object(
        'outstanding_invoices', '/platform/billing/invoices',
        'monthly_recurring_revenue', '/platform/billing',
        'payment_past_due', '/platform/billing/payment-operations'
      )
    ),
    'partners', jsonb_build_object(
      'active_partners', v_active_partners,
      'earned_commission', null,
      'pending_partner_invoices', v_pending_partner_invoices,
      'source_note', 'partial_partner_sources',
      'drill_down', jsonb_build_object(
        'pending_partner_invoices', '/platform/partners/settlement',
        'active_partners', '/platform/partners'
      )
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
  'Platform control-plane overview. Outstanding invoices + MRR from authoritative invoices/subscriptions; health remains null without a connected source.';

-- Read-only operational settlement/invoice truth for Platform (no writes).
create or replace function public.get_platform_partner_settlement_operations()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_rows jsonb := '[]'::jsonb;
  v_discrepancies jsonb := '[]'::jsonb;
begin
  perform public._ppsf258_require_platform_access();

  if to_regclass('public.growth_partner_portal_settlements') is null then
    return jsonb_build_object(
      'generated_at', now(),
      'source', 'get_platform_partner_settlement_operations',
      'availability', 'unavailable',
      'settlements', '[]'::jsonb,
      'discrepancies', '[]'::jsonb,
      'source_note', 'settlement_tables_missing'
    );
  end if;

  select coalesce(jsonb_agg(row_payload order by updated_at desc), '[]'::jsonb)
  into v_rows
  from (
    select
      s.updated_at,
      jsonb_build_object(
        'id', s.id,
        'partner_org_id', s.partner_org_id,
        'partner_name', coalesce(o.org_name, o.org_key, 'Partner'),
        'settlement_period', s.settlement_period,
        'period_from', s.period_from::text,
        'period_to', s.period_to::text,
        'commission_basis', s.commission_total,
        'qualified_amount', s.commission_total,
        'earned_amount', s.commission_total,
        'approved_amount', case
          when s.settlement_status in ('approved', 'invoice_generated', 'sent_to_accounting', 'paid')
            then s.total_payable
          else null
        end,
        'total_payable', s.total_payable,
        'vat_amount', s.vat_amount,
        'currency', 'NOK',
        'settlement_status', s.settlement_status,
        'invoice_id', i.id,
        'invoice_number', i.invoice_number,
        'invoice_status', i.invoice_status,
        'invoice_total', i.total_payable,
        'matching_status', case
          when i.id is null then 'missing_invoice'
          when i.total_payable is distinct from s.total_payable then 'amount_mismatch'
          when i.settlement_period is distinct from s.settlement_period then 'period_mismatch'
          when s.settlement_status = 'paid' and coalesce(i.invoice_status, '') <> 'paid' then 'payout_mismatch'
          when i.invoice_status = 'sent_to_accounting' then 'accounting_sync_pending'
          else 'matched'
        end,
        'due_date', coalesce(s.due_date::text, i.due_date::text),
        'owner', 'platform_finance',
        'last_updated', s.updated_at,
        'next_action', case
          when s.settlement_status = 'awaiting_partner_approval' then 'await_partner_approval'
          when s.settlement_status = 'draft' then 'review_settlement_basis'
          when i.id is null and s.settlement_status = 'approved' then 'await_invoice_generation'
          when i.total_payable is distinct from s.total_payable then 'investigate_amount_discrepancy'
          when s.settlement_status = 'paid' and coalesce(i.invoice_status, '') <> 'paid' then 'investigate_payout_mismatch'
          else 'monitor'
        end,
        'read_only', true
      ) as row_payload
    from public.growth_partner_portal_settlements s
    join public.growth_partner_portal_organizations o on o.id = s.partner_org_id
    left join public.growth_partner_portal_settlement_invoices i on i.settlement_id = s.id
    order by s.updated_at desc
    limit 200
  ) q;

  select coalesce(jsonb_agg(d order by severity desc, partner_name), '[]'::jsonb)
  into v_discrepancies
  from (
    select
      jsonb_build_object(
        'id', s.id::text || ':' || case
          when i.id is null and s.settlement_status in ('approved', 'invoice_generated') then 'missing_invoice'
          when i.total_payable is distinct from s.total_payable then 'amount_mismatch'
          when i.settlement_period is distinct from s.settlement_period then 'period_mismatch'
          when s.settlement_status = 'paid' and coalesce(i.invoice_status, '') <> 'paid' then 'payout_mismatch'
          when not exists (
            select 1 from public.growth_partner_portal_settlement_items si where si.settlement_id = s.id
          ) and s.commission_total > 0 then 'missing_commission_basis'
          else 'none'
        end,
        'severity', case
          when i.total_payable is distinct from s.total_payable then 'critical'
          when s.settlement_status = 'paid' and coalesce(i.invoice_status, '') <> 'paid' then 'critical'
          when i.id is null and s.settlement_status in ('approved', 'invoice_generated') then 'attention'
          when i.settlement_period is distinct from s.settlement_period then 'attention'
          else 'info'
        end,
        'partner_name', coalesce(o.org_name, o.org_key),
        'partner_org_id', s.partner_org_id,
        'invoice_number', coalesce(i.invoice_number, ''),
        'settlement_id', s.id,
        'expected', s.total_payable,
        'actual', i.total_payable,
        'difference', case
          when i.total_payable is null then s.total_payable
          else s.total_payable - i.total_payable
        end,
        'reason', case
          when i.id is null and s.settlement_status in ('approved', 'invoice_generated') then 'missing_invoice'
          when i.total_payable is distinct from s.total_payable then 'amount_mismatch'
          when i.settlement_period is distinct from s.settlement_period then 'period_mismatch'
          when s.settlement_status = 'paid' and coalesce(i.invoice_status, '') <> 'paid' then 'payout_mismatch'
          when not exists (
            select 1 from public.growth_partner_portal_settlement_items si where si.settlement_id = s.id
          ) and s.commission_total > 0 then 'missing_commission_basis'
          else 'none'
        end,
        'owner', 'platform_finance',
        'due_date', coalesce(s.due_date::text, i.due_date::text),
        'status', s.settlement_status,
        'next_action', 'review_partner_settlement',
        'audit_href', '/platform/partners/settlement'
      ) as d,
      coalesce(o.org_name, o.org_key) as partner_name,
      case
        when i.total_payable is distinct from s.total_payable then 3
        when s.settlement_status = 'paid' and coalesce(i.invoice_status, '') <> 'paid' then 3
        else 2
      end as severity
    from public.growth_partner_portal_settlements s
    join public.growth_partner_portal_organizations o on o.id = s.partner_org_id
    left join public.growth_partner_portal_settlement_invoices i on i.settlement_id = s.id
    where
      (i.id is null and s.settlement_status in ('approved', 'invoice_generated'))
      or (i.id is not null and i.total_payable is distinct from s.total_payable)
      or (i.id is not null and i.settlement_period is distinct from s.settlement_period)
      or (s.settlement_status = 'paid' and coalesce(i.invoice_status, '') <> 'paid')
      or (
        s.commission_total > 0
        and not exists (
          select 1 from public.growth_partner_portal_settlement_items si where si.settlement_id = s.id
        )
      )
    limit 100
  ) disc;

  return jsonb_build_object(
    'generated_at', now(),
    'source', 'get_platform_partner_settlement_operations',
    'availability', 'partial',
    'settlements', v_rows,
    'discrepancies', v_discrepancies,
    'source_note', 'read_only_over_growth_partner_portal_settlement_engine',
    'mutations_allowed', false
  );
end;
$$;

revoke all on function public.get_platform_partner_settlement_operations() from public, anon, authenticated;
grant execute on function public.get_platform_partner_settlement_operations() to authenticated;
grant execute on function public.get_platform_partner_settlement_operations() to service_role;

comment on function public.get_platform_partner_settlement_operations() is
  'Platform read-only partner settlement/invoice operations and discrepancy queue. No payout or invoice mutation.';
