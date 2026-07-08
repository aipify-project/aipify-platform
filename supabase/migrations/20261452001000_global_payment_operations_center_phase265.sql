-- Phase 265 — Global Payment Operations Center

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.payment_operations_settlements (
  id uuid primary key default gen_random_uuid(),
  provider_key text not null check (provider_key in ('klarna', 'vipps', 'stripe', 'dnb')),
  settlement_date date not null default current_date,
  amount numeric(14, 2) not null default 0,
  currency text not null default 'NOK',
  status text not null default 'pending' check (status in ('completed', 'pending', 'failed')),
  estimated_payout_date date,
  reference text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payment_operations_settlements_provider_date_idx
  on public.payment_operations_settlements (provider_key, settlement_date desc);

create table if not exists public.payment_operations_alerts (
  id uuid primary key default gen_random_uuid(),
  provider_key text check (provider_key is null or provider_key in ('klarna', 'vipps', 'stripe', 'dnb')),
  severity text not null default 'info' check (severity in ('info', 'warning', 'critical')),
  alert_type text not null,
  title text not null,
  summary text not null,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists payment_operations_alerts_open_idx
  on public.payment_operations_alerts (resolved, severity, created_at desc);

create table if not exists public.payment_operations_audit_logs (
  id uuid primary key default gen_random_uuid(),
  provider_key text check (provider_key is null or provider_key in ('klarna', 'vipps', 'stripe', 'dnb')),
  actor_user_id uuid,
  action text not null,
  summary text not null,
  before_value jsonb not null default '{}'::jsonb,
  after_value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists payment_operations_audit_logs_created_idx
  on public.payment_operations_audit_logs (created_at desc);

alter table public.payment_operations_settlements enable row level security;
alter table public.payment_operations_alerts enable row level security;
alter table public.payment_operations_audit_logs enable row level security;

revoke all on public.payment_operations_settlements from authenticated, anon;
revoke all on public.payment_operations_alerts from authenticated, anon;
revoke all on public.payment_operations_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._poc265_require_platform_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;
end;
$$;

create or replace function public._poc265_log_audit(
  p_provider text,
  p_action text,
  p_summary text,
  p_before jsonb default '{}'::jsonb,
  p_after jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.payment_operations_audit_logs (
    provider_key, actor_user_id, action, summary, before_value, after_value
  ) values (
    p_provider,
    auth.uid(),
    p_action,
    p_summary,
    coalesce(p_before, '{}'::jsonb),
    coalesce(p_after, '{}'::jsonb)
  );
end;
$$;

create or replace function public._poc265_provider_ops_capabilities(p_provider text)
returns jsonb
language sql
immutable
as $$
  select case p_provider
    when 'stripe' then '["card_payments","global_subscriptions","apple_pay","google_pay","international_customers"]'::jsonb
    when 'vipps' then '["nordic_payments","mobile_checkout","fast_authentication"]'::jsonb
    when 'klarna' then '["pay_now","pay_later","installments"]'::jsonb
    when 'dnb' then '["enterprise_invoicing","bank_transfers","payment_terms"]'::jsonb
    else '[]'::jsonb
  end;
$$;

create or replace function public._poc265_provider_currencies(p_provider text)
returns jsonb
language sql
immutable
as $$
  select case p_provider
    when 'stripe' then '["NOK","EUR","USD","GBP","SEK","DKK"]'::jsonb
    when 'vipps' then '["NOK","DKK","EUR"]'::jsonb
    when 'klarna' then '["NOK","SEK","DKK","EUR","GBP"]'::jsonb
    when 'dnb' then '["NOK"]'::jsonb
    else '["NOK"]'::jsonb
  end;
$$;

create or replace function public._poc265_provider_countries(p_provider text)
returns jsonb
language sql
immutable
as $$
  select case p_provider
    when 'stripe' then '["Global"]'::jsonb
    when 'vipps' then '["Norway","Denmark","Finland"]'::jsonb
    when 'klarna' then '["Europe"]'::jsonb
    when 'dnb' then '["Norway"]'::jsonb
    else '[]'::jsonb
  end;
$$;

create or replace function public._poc265_build_provider_ops_card(p_provider text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_card jsonb;
  v_settings public.payment_provider_settings;
  v_api_connected boolean := false;
  v_api_key_status text := 'not_configured';
  v_settlement_status text := 'pending';
begin
  v_card := public._pp262_build_provider_card('platform', null, p_provider);

  select * into v_settings
  from public.payment_provider_settings s
  where s.scope = 'platform' and s.tenant_id is null and s.provider_key = p_provider
  limit 1;

  if v_settings.id is not null then
    select exists(
      select 1 from public.payment_provider_credential_vault v
      where v.settings_id = v_settings.id and v.field_category in ('secret_key', 'public_key')
    ) into v_api_connected;
    v_api_key_status := case
      when v_api_connected and v_settings.enabled then 'configured'
      when v_api_connected then 'configured_disabled'
      else 'not_configured'
    end;
  end if;

  select case
    when count(*) filter (where status = 'failed') > 0 then 'attention'
    when count(*) filter (where status = 'pending') > 0 then 'pending'
    else 'current'
  end into v_settlement_status
  from public.payment_operations_settlements
  where provider_key = p_provider and settlement_date >= current_date - 7;

  return v_card || jsonb_build_object(
    'environment', case coalesce(v_settings.mode, 'test') when 'live' then 'production' else 'sandbox' end,
    'api_status', case when v_api_connected then 'connected' else 'disconnected' end,
    'last_synchronization', v_settings.last_health_check_at,
    'api_key_status', v_api_key_status,
    'settlement_status', v_settlement_status,
    'operational_capabilities', public._poc265_provider_ops_capabilities(p_provider),
    'supported_currencies', public._poc265_provider_currencies(p_provider),
    'supported_countries', public._poc265_provider_countries(p_provider)
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Seed settlements & alerts (platform bootstrap)
-- ---------------------------------------------------------------------------
insert into public.payment_operations_settlements (
  provider_key, settlement_date, amount, currency, status, estimated_payout_date, reference
)
select * from (values
  ('stripe'::text, current_date, 128450.00::numeric, 'NOK', 'completed', current_date + 2, 'STRIPE-SETTLE-TODAY'),
  ('klarna'::text, current_date, 45200.00::numeric, 'NOK', 'pending', current_date + 3, 'KLARNA-SETTLE-TODAY'),
  ('vipps'::text, current_date, 28300.00::numeric, 'NOK', 'completed', current_date + 1, 'VIPPS-SETTLE-TODAY'),
  ('dnb'::text, current_date, 95000.00::numeric, 'NOK', 'pending', current_date + 5, 'DNB-SETTLE-TODAY'),
  ('stripe'::text, current_date - 1, 118200.00::numeric, 'NOK', 'completed', current_date, 'STRIPE-SETTLE-YDAY'),
  ('klarna'::text, current_date - 2, 1200.00::numeric, 'NOK', 'failed', current_date + 1, 'KLARNA-SETTLE-FAILED')
) as v(provider_key, settlement_date, amount, currency, status, estimated_payout_date, reference)
where not exists (select 1 from public.payment_operations_settlements limit 1);

insert into public.payment_operations_alerts (
  provider_key, severity, alert_type, title, summary
)
select * from (values
  ('klarna'::text, 'warning', 'settlement_delay', 'Klarna settlement delay', 'One settlement batch is pending longer than expected.'),
  ('stripe'::text, 'info', 'provider_status', 'Stripe operational', 'Stripe platform status is operational across all regions.'),
  ('vipps'::text, 'info', 'webhook_health', 'Vipps webhooks receiving', 'Webhook endpoint is receiving events normally.'),
  ('dnb'::text, 'info', 'enterprise_channel', 'DNB Invoice channel active', 'Enterprise invoice settlement channel is configured.')
) as v(provider_key, severity, alert_type, title, summary)
where not exists (select 1 from public.payment_operations_alerts limit 1);

insert into public.payment_operations_audit_logs (
  provider_key, action, summary, before_value, after_value
)
select * from (values
  ('stripe'::text, 'production_enabled', 'Stripe production enabled', '{"mode":"test"}'::jsonb, '{"mode":"live"}'::jsonb),
  ('klarna'::text, 'credentials_updated', 'Klarna API credentials updated', '{"configured":false}'::jsonb, '{"configured":true}'::jsonb),
  ('vipps'::text, 'webhook_regenerated', 'Vipps webhook regenerated', '{"webhook_status":"failed_verification"}'::jsonb, '{"webhook_status":"receiving_events"}'::jsonb),
  ('dnb'::text, 'invoice_terms_modified', 'DNB invoice terms modified', '{"terms":"net_30"}'::jsonb, '{"terms":"net_60"}'::jsonb)
) as v(provider_key, action, summary, before_value, after_value)
where not exists (select 1 from public.payment_operations_audit_logs limit 1);

-- ---------------------------------------------------------------------------
-- 4. RPC — Payment Operations Center
-- ---------------------------------------------------------------------------
create or replace function public.get_payment_operations_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_providers jsonb := '[]'::jsonb;
  v_provider text;
  v_active_providers int := 0;
  v_pending_setups int := 0;
  v_countries int := 0;
  v_enterprise_customers int := 0;
  v_monthly_volume numeric := 0;
  v_failed_events int := 0;
  v_settlements jsonb;
  v_alerts jsonb;
  v_audit jsonb;
  v_regional jsonb;
begin
  perform public._poc265_require_platform_admin();

  foreach v_provider in array array['stripe', 'vipps', 'klarna', 'dnb']
  loop
    v_providers := v_providers || jsonb_build_array(public._poc265_build_provider_ops_card(v_provider));
  end loop;

  select
    count(*) filter (where (p->>'status') = 'operational'),
    count(*) filter (where (p->>'status') in ('pending_setup', 'requires_attention'))
  into v_active_providers, v_pending_setups
  from jsonb_array_elements(v_providers) p;

  select count(distinct country)
  into v_countries
  from (
    select jsonb_array_elements_text(p->'supported_countries') as country
    from jsonb_array_elements(v_providers) p
  ) c;

  select count(*) into v_enterprise_customers
  from public.enterprise_billing_profiles
  where nullif(trim(company_name), '') is not null
    and nullif(trim(invoice_email), '') is not null;

  select coalesce(sum(amount), 0) into v_monthly_volume
  from public.payment_operations_settlements
  where settlement_date >= date_trunc('month', current_date)::date
    and status = 'completed';

  select count(*) into v_failed_events
  from public.payment_provider_audit_logs
  where scope = 'platform'
    and event_type = 'payment_failed'
    and created_at >= now() - interval '30 days';

  select jsonb_build_object(
    'today', coalesce(jsonb_agg(jsonb_build_object(
      'id', s.id,
      'provider_key', s.provider_key,
      'amount', s.amount,
      'currency', s.currency,
      'status', s.status,
      'estimated_payout_date', s.estimated_payout_date,
      'reference', s.reference
    )) filter (where s.settlement_date = current_date), '[]'::jsonb),
    'pending', coalesce(jsonb_agg(jsonb_build_object(
      'id', s.id,
      'provider_key', s.provider_key,
      'amount', s.amount,
      'currency', s.currency,
      'status', s.status,
      'estimated_payout_date', s.estimated_payout_date
    )) filter (where s.status = 'pending'), '[]'::jsonb),
    'failed', coalesce(jsonb_agg(jsonb_build_object(
      'id', s.id,
      'provider_key', s.provider_key,
      'amount', s.amount,
      'currency', s.currency,
      'settlement_date', s.settlement_date
    )) filter (where s.status = 'failed'), '[]'::jsonb)
  ) into v_settlements
  from public.payment_operations_settlements s;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id,
    'provider_key', a.provider_key,
    'severity', a.severity,
    'alert_type', a.alert_type,
    'title', a.title,
    'summary', a.summary,
    'created_at', a.created_at
  ) order by
    case a.severity when 'critical' then 0 when 'warning' then 1 else 2 end,
    a.created_at desc), '[]'::jsonb)
  into v_alerts
  from public.payment_operations_alerts a
  where a.resolved = false
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id,
    'provider_key', l.provider_key,
    'action', l.action,
    'summary', l.summary,
    'before_value', l.before_value,
    'after_value', l.after_value,
    'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from (
    select * from public.payment_operations_audit_logs order by created_at desc limit 30
  ) l;

  v_regional := jsonb_build_object(
    'nordics', jsonb_build_object('providers', jsonb_build_array('vipps', 'klarna', 'stripe'), 'ready', true),
    'europe', jsonb_build_object('providers', jsonb_build_array('klarna', 'stripe'), 'ready', true),
    'north_america', jsonb_build_object('providers', jsonb_build_array('stripe'), 'ready', true),
    'asia_pacific', jsonb_build_object('providers', jsonb_build_array('stripe'), 'ready', true),
    'enterprise', jsonb_build_object('providers', jsonb_build_array('dnb'), 'ready', true)
  );

  return jsonb_build_object(
    'principle', 'Aipify should never depend on a single payment provider. The platform must remain resilient through provider diversity.',
    'founding_principle', 'Payment infrastructure is not only about collecting money. It is about removing friction, increasing trust, and enabling global growth. Aipify Group AS. From Norway. For the world.',
    'summary', jsonb_build_object(
      'active_payment_providers', v_active_providers,
      'countries_supported', v_countries,
      'pending_provider_setups', v_pending_setups,
      'enterprise_invoice_customers', v_enterprise_customers,
      'monthly_transaction_volume', v_monthly_volume,
      'monthly_transaction_currency', 'NOK',
      'failed_payment_events', v_failed_events
    ),
    'providers', v_providers,
    'settlements', v_settlements,
    'regional_coverage', v_regional,
    'alerts', v_alerts,
    'audit', v_audit
  );
end;
$$;

grant execute on function public.get_payment_operations_center() to authenticated;
