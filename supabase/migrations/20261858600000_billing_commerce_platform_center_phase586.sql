-- Phase 586 — Billing & Commerce Platform Center
-- Feature owner: PLATFORM ADMIN
-- Route: /platform/billing/*
-- Helpers: _bcc586_*

create or replace function public._bcc586_count(p_sql text)
returns bigint
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_count bigint := 0;
begin
  execute format('select count(*)::bigint from (%s) q', p_sql) into v_count;
  return coalesce(v_count, 0);
exception
  when undefined_table then
    return 0;
  when others then
    return 0;
end;
$$;

create or replace function public.get_platform_billing_commerce_center(p_section text default 'overview')
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_rows jsonb := '[]'::jsonb;
  v_stats jsonb := '{}'::jsonb;
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true,
      'section', v_section,
      'principle', 'Every sale must be traceable from identity to invoice, tax, and accounting.',
      'privacy_note', 'Platform aggregates only — no customer operational content beyond billing metadata.',
      'modules', jsonb_build_array(
        jsonb_build_object('id', 'customer_identity', 'stat', public._bcc586_count('select id from public.customers')),
        jsonb_build_object('id', 'billing_profiles', 'stat', public._bcc586_count('select id from public.payment_profiles')),
        jsonb_build_object('id', 'subscriptions', 'stat', public._bcc586_count('select id from public.subscriptions')),
        jsonb_build_object('id', 'invoices', 'stat', public._bcc586_count('select id from public.invoices')),
        jsonb_build_object('id', 'vat_engine', 'stat', public._bcc586_count('select id from public.checkout_vat_sessions')),
        jsonb_build_object('id', 'payment_providers', 'stat', public._bcc586_count('select id from public.payment_profiles where provider is not null')),
        jsonb_build_object('id', 'tax_rules', 'stat', public._bcc586_count('select company_id from public.checkout_vat_settings')),
        jsonb_build_object('id', 'business_packs', 'stat', public._bcc586_count('select id from public.platform_business_pack_blueprints')),
        jsonb_build_object('id', 'license_purchases', 'stat', public._bcc586_count('select id from public.organization_domains where license_purchased_at is not null')),
        jsonb_build_object('id', 'domain_licenses', 'stat', public._bcc586_count('select organization_id from public.organization_domain_license_pool')),
        jsonb_build_object('id', 'growth_partner_attribution', 'stat', public._bcc586_count('select id from public.growth_partner_attributed_customers')),
        jsonb_build_object('id', 'accounting_integration', 'stat', public._bcc586_count('select id from public.tenant_integrations where integration_key in (''fiken'', ''stripe_fiken'', ''accounting'')'))
      ),
      'stats', jsonb_build_object(
        'active_customers', public._bcc586_count('select id from public.customers where status in (''active'', ''trial'')'),
        'overdue_customers', public._bcc586_count('select id from public.customers where status = ''overdue'''),
        'open_invoices', public._bcc586_count('select id from public.invoices where status in (''draft'', ''sent'', ''overdue'')'),
        'checkout_sessions', public._bcc586_count('select id from public.checkout_vat_sessions where session_status = ''draft''')
      )
    );
  end if;

  if v_section = 'customer_identity' then
    select coalesce(jsonb_agg(jsonb_build_object(
      'customer_number', c.customer_number,
      'customer_type', c.customer_type,
      'display_name', coalesce(c.company_name, c.full_name, c.email),
      'email', c.email,
      'organization_number', coalesce(c.organization_number, ''),
      'country', c.country,
      'status', c.status,
      'company_id', c.company_id
    ) order by c.created_at desc), '[]'::jsonb)
    into v_rows
    from (select * from public.customers order by created_at desc limit 100) c;

    v_stats := jsonb_build_object(
      'total', public._bcc586_count('select id from public.customers'),
      'business', public._bcc586_count('select id from public.customers where customer_type = ''company'''),
      'private', public._bcc586_count('select id from public.customers where customer_type = ''private''')
    );
  elsif v_section = 'billing_profiles' then
    select coalesce(jsonb_agg(jsonb_build_object(
      'customer_number', pp.customer_number,
      'display_name', pp.display_name,
      'billing_email', pp.billing_email,
      'provider', pp.provider,
      'payment_status', pp.payment_status,
      'country', pp.country
    ) order by pp.display_name), '[]'::jsonb)
    into v_rows
    from (select * from public.payment_profiles order by display_name limit 100) pp;

    v_stats := jsonb_build_object(
      'total', public._bcc586_count('select id from public.payment_profiles'),
      'stripe', public._bcc586_count('select id from public.payment_profiles where provider = ''stripe'''),
      'dnb', public._bcc586_count('select id from public.payment_profiles where provider = ''dnb''')
    );
  elsif v_section = 'subscriptions' then
    select coalesce(jsonb_agg(jsonb_build_object(
      'customer_number', s.customer_number,
      'display_name', s.display_name,
      'plan_name', s.plan_name,
      'status', s.status,
      'billing_cycle', s.billing_cycle,
      'next_billing_date', s.next_billing_date,
      'provider', s.provider
    ) order by s.next_billing_date nulls last), '[]'::jsonb)
    into v_rows
    from (select * from public.list_platform_subscriptions() limit 100) s;

    v_stats := jsonb_build_object(
      'total', public._bcc586_count('select id from public.subscriptions'),
      'active', public._bcc586_count('select id from public.subscriptions where status = ''active'''),
      'trial', public._bcc586_count('select id from public.subscriptions where status = ''trial''')
    );
  elsif v_section = 'invoices' then
    select coalesce(jsonb_agg(jsonb_build_object(
      'invoice_number', i.invoice_number,
      'customer_number', i.customer_number,
      'display_name', i.display_name,
      'amount', i.amount,
      'currency', i.currency,
      'status', i.status,
      'due_date', i.due_date
    ) order by i.due_date desc nulls last), '[]'::jsonb)
    into v_rows
    from (
      select inv.invoice_number, c.customer_number, coalesce(c.company_name, c.full_name, c.email) as display_name,
             inv.amount, inv.currency, inv.status, inv.due_date
      from public.invoices inv
      join public.customers c on c.id = inv.customer_id
      order by inv.created_at desc
      limit 100
    ) i;

    v_stats := jsonb_build_object(
      'total', public._bcc586_count('select id from public.invoices'),
      'overdue', public._bcc586_count('select id from public.invoices where status = ''overdue'''),
      'paid', public._bcc586_count('select id from public.invoices where status = ''paid''')
    );
  elsif v_section = 'vat_engine' then
    select coalesce(jsonb_agg(jsonb_build_object(
      'session_key', s.session_key,
      'customer_type', s.customer_type,
      'company_name', s.company_name,
      'vat_number', s.vat_number,
      'validation_status', s.validation_status,
      'vat_rate', s.vat_rate,
      'reverse_charge', s.reverse_charge,
      'session_status', s.session_status,
      'product_type', s.product_type
    ) order by s.id desc), '[]'::jsonb)
    into v_rows
    from (select * from public.checkout_vat_sessions order by id desc limit 100) s;

    v_stats := jsonb_build_object(
      'total_sessions', public._bcc586_count('select id from public.checkout_vat_sessions'),
      'reverse_charge', public._bcc586_count('select id from public.checkout_vat_sessions where reverse_charge'),
      'legal_review_required', true
    );
  elsif v_section = 'payment_providers' then
    select coalesce(jsonb_agg(jsonb_build_object(
      'provider', pp.provider,
      'count', cnt
    ) order by cnt desc), '[]'::jsonb)
    into v_rows
    from (
      select provider, count(*)::bigint as cnt
      from public.payment_profiles
      group by provider
    ) pp;

    v_stats := jsonb_build_object(
      'providers_in_use', coalesce(jsonb_array_length(v_rows), 0),
      'stripe_profiles', public._bcc586_count('select id from public.payment_profiles where provider = ''stripe''')
    );
  elsif v_section = 'tax_rules' then
    select coalesce(jsonb_agg(jsonb_build_object(
      'rule_key', r.rule_key,
      'label', r.label,
      'rate', r.rate,
      'scope', r.scope,
      'active', r.active
    ) order by r.rule_key), '[]'::jsonb)
    into v_rows
    from (
      select 'no_private_business' as rule_key, 'Norway private/business standard VAT' as label, 25::numeric as rate, 'NO' as scope, true as active
      union all
      select 'eu_b2b_reverse_charge', 'EU B2B valid VIES reverse charge', 0::numeric, 'EU', true
      union all
      select 'invalid_business_standard', 'Invalid business/VAT — standard rate', 25::numeric, 'GLOBAL', true
      union all
      select 'service_unavailable_standard', 'Registry unavailable — standard rate', 25::numeric, 'GLOBAL', true
    ) r;

    v_stats := jsonb_build_object(
      'tenant_overrides', public._bcc586_count('select company_id from public.checkout_vat_settings'),
      'legal_review_required', true
    );
  elsif v_section = 'business_packs' then
    if to_regclass('public.platform_business_pack_blueprints') is not null then
      execute $sql$
        select coalesce(jsonb_agg(jsonb_build_object(
          'pack_key', pack_key,
          'title', pack_name,
          'status', blueprint_status,
          'category', industry_key
        ) order by pack_name), '[]'::jsonb)
        from (
          select pack_key, pack_name, blueprint_status, industry_key
          from public.platform_business_pack_blueprints
          order by pack_name
          limit 100
        ) q
      $sql$ into v_rows;
    end if;

    v_stats := jsonb_build_object(
      'catalog_items', coalesce(jsonb_array_length(v_rows), 0),
      'installed', public._bcc586_count('select id from public.domain_business_pack_installations')
    );
  elsif v_section = 'license_purchases' then
    select coalesce(jsonb_agg(jsonb_build_object(
      'domain', d.domain,
      'license_status', d.license_status,
      'license_purchased_at', d.license_purchased_at,
      'organization_id', d.organization_id
    ) order by d.license_purchased_at desc nulls last), '[]'::jsonb)
    into v_rows
    from (
      select domain, license_status, license_purchased_at, organization_id
      from public.organization_domains
      where license_purchased_at is not null
      order by license_purchased_at desc
      limit 100
    ) d;

    v_stats := jsonb_build_object(
      'purchased_domains', coalesce(jsonb_array_length(v_rows), 0),
      'pools', public._bcc586_count('select organization_id from public.organization_domain_license_pool where purchased_licenses > 0')
    );
  elsif v_section = 'domain_licenses' then
    select coalesce(jsonb_agg(jsonb_build_object(
      'organization_id', p.organization_id,
      'included_licenses', p.included_licenses,
      'purchased_licenses', p.purchased_licenses,
      'total_licenses', p.included_licenses + p.purchased_licenses
    ) order by p.updated_at desc), '[]'::jsonb)
    into v_rows
    from (
      select * from public.organization_domain_license_pool
      order by updated_at desc
      limit 100
    ) p;

    v_stats := jsonb_build_object(
      'pools', coalesce(jsonb_array_length(v_rows), 0),
      'active_domains', public._bcc586_count('select id from public.organization_domains where domain_status = ''active''')
    );
  elsif v_section = 'growth_partner_attribution' then
    if to_regclass('public.growth_partner_attributed_customers') is not null then
      execute $sql$
        select coalesce(jsonb_agg(jsonb_build_object(
          'profile_id', profile_id,
          'partner_public_id', partner_public_id,
          'organization_id', organization_id,
          'attribution_status', attribution_status,
          'first_touch_at', first_touch_at
        ) order by first_touch_at desc nulls last), '[]'::jsonb)
        from (
          select profile_id, partner_public_id, organization_id, attribution_status, first_touch_at
          from public.growth_partner_attributed_customers
          order by first_touch_at desc nulls last
          limit 100
        ) q
      $sql$ into v_rows;
    end if;

    v_stats := jsonb_build_object(
      'attributed_customers', coalesce(jsonb_array_length(v_rows), 0),
      'touch_events', public._bcc586_count('select id from public.growth_partner_attribution_touches')
    );
  elsif v_section = 'accounting_integration' then
    if to_regclass('public.tenant_integrations') is not null then
      execute $sql$
        select coalesce(jsonb_agg(jsonb_build_object(
          'integration_key', integration_key,
          'status', status,
          'tenant_id', tenant_id,
          'updated_at', updated_at
        ) order by updated_at desc), '[]'::jsonb)
        from (
          select integration_key, status, tenant_id, updated_at
          from public.tenant_integrations
          where integration_key in ('fiken', 'stripe_fiken', 'accounting', 'stripe')
          order by updated_at desc
          limit 100
        ) q
      $sql$ into v_rows;
    end if;

    v_stats := jsonb_build_object(
      'connected', coalesce(jsonb_array_length(v_rows), 0),
      'phase_note', 'Financial Operations & Accounting Integration (ABOS Phase 27)'
    );
  else
    raise exception 'Unknown billing commerce section: %', v_section;
  end if;

  return jsonb_build_object(
    'found', true,
    'section', v_section,
    'principle', 'Every sale must be traceable from identity to invoice, tax, and accounting.',
    'privacy_note', 'Platform aggregates only — no customer operational content beyond billing metadata.',
    'rows', coalesce(v_rows, '[]'::jsonb),
    'stats', coalesce(v_stats, '{}'::jsonb)
  );
end;
$$;

grant execute on function public.get_platform_billing_commerce_center(text) to authenticated;
