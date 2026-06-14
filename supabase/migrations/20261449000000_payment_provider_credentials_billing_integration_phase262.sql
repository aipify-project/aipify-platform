-- Phase 262 — Payment Provider Credentials & Billing Integration Foundation

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.payment_provider_settings (
  id uuid primary key default gen_random_uuid(),
  scope text not null check (scope in ('platform', 'tenant')),
  tenant_id uuid references public.companies (id) on delete cascade,
  provider_key text not null check (provider_key in ('klarna', 'vipps', 'stripe', 'dnb')),
  status text not null default 'pending_setup' check (
    status in ('operational', 'pending_setup', 'requires_attention', 'disabled')
  ),
  mode text not null default 'test' check (mode in ('test', 'live')),
  enabled boolean not null default false,
  webhook_status text not null default 'not_configured' check (
    webhook_status in ('receiving_events', 'not_configured', 'failed_verification')
  ),
  last_health_check_at timestamptz,
  last_webhook_at timestamptz,
  setup_completed boolean not null default false,
  public_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint payment_provider_settings_scope_tenant check (
    (scope = 'platform' and tenant_id is null) or (scope = 'tenant' and tenant_id is not null)
  ),
  unique (scope, tenant_id, provider_key)
);

create index if not exists payment_provider_settings_scope_idx
  on public.payment_provider_settings (scope, provider_key);

create index if not exists payment_provider_settings_tenant_idx
  on public.payment_provider_settings (tenant_id, provider_key)
  where tenant_id is not null;

create table if not exists public.payment_provider_credential_vault (
  id uuid primary key default gen_random_uuid(),
  settings_id uuid not null references public.payment_provider_settings (id) on delete cascade,
  field_key text not null,
  field_category text not null default 'secret_key' check (
    field_category in ('public_key', 'secret_key', 'webhook_secret', 'url', 'metadata')
  ),
  masked_value text not null default '',
  encrypted_payload text not null,
  key_version int not null default 1,
  updated_at timestamptz not null default now(),
  unique (settings_id, field_key)
);

create index if not exists payment_provider_credential_vault_settings_idx
  on public.payment_provider_credential_vault (settings_id);

create table if not exists public.payment_provider_audit_logs (
  id uuid primary key default gen_random_uuid(),
  scope text not null check (scope in ('platform', 'tenant')),
  tenant_id uuid references public.companies (id) on delete set null,
  provider_key text not null,
  event_type text not null check (
    event_type in (
      'provider_enabled', 'provider_disabled', 'credentials_updated',
      'webhook_secret_updated', 'test_connection_performed',
      'payment_failed', 'payment_succeeded', 'plan_upgraded', 'plan_downgraded'
    )
  ),
  summary text not null,
  actor_user_id uuid,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists payment_provider_audit_logs_scope_idx
  on public.payment_provider_audit_logs (scope, created_at desc);

create index if not exists payment_provider_audit_logs_tenant_idx
  on public.payment_provider_audit_logs (tenant_id, created_at desc)
  where tenant_id is not null;

alter table public.payment_provider_settings enable row level security;
alter table public.payment_provider_credential_vault enable row level security;
alter table public.payment_provider_audit_logs enable row level security;

revoke all on public.payment_provider_settings from authenticated, anon;
revoke all on public.payment_provider_credential_vault from authenticated, anon;
revoke all on public.payment_provider_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._pp262_mask_secret(p_value text)
returns text
language plpgsql
immutable
as $$
declare
  v_len integer;
  v_prefix text;
  v_suffix text;
begin
  if p_value is null or length(trim(p_value)) = 0 then
    return '';
  end if;
  v_len := length(p_value);
  if v_len <= 8 then
    return repeat('•', v_len);
  end if;
  v_prefix := left(p_value, case when p_value like 'sk_%' or p_value like 'pk_%' then 7 else 4 end);
  v_suffix := right(p_value, 4);
  return v_prefix || repeat('•', greatest(8, v_len - length(v_prefix) - 4)) || v_suffix;
end;
$$;

create or replace function public._pp262_webhook_url(p_provider text)
returns text
language sql
immutable
as $$
  select case p_provider
    when 'stripe' then 'https://api.aipify.ai/webhooks/stripe'
    when 'klarna' then 'https://api.aipify.ai/webhooks/klarna'
    when 'vipps' then 'https://api.aipify.ai/webhooks/vipps'
    when 'dnb' then 'https://api.aipify.ai/webhooks/dnb'
    else 'https://api.aipify.ai/webhooks/' || p_provider
  end;
$$;

create or replace function public._pp262_provider_meta(p_provider text)
returns jsonb
language sql
immutable
as $$
  select case p_provider
    when 'klarna' then jsonb_build_object(
      'name', 'Klarna',
      'regions', jsonb_build_array('NO', 'SE', 'DK', 'FI', 'DE', 'NL', 'EU'),
      'capabilities', jsonb_build_array('subscriptions', 'one_time', 'refunds', 'invoices', 'webhooks', 'upgrades', 'downgrades')
    )
    when 'vipps' then jsonb_build_object(
      'name', 'Vipps MobilePay',
      'regions', jsonb_build_array('NO', 'DK', 'FI', 'Nordics'),
      'capabilities', jsonb_build_array('subscriptions', 'one_time', 'refunds', 'webhooks', 'upgrades')
    )
    when 'stripe' then jsonb_build_object(
      'name', 'Stripe',
      'regions', jsonb_build_array('Global', 'EU', 'US', 'Nordics'),
      'capabilities', jsonb_build_array('subscriptions', 'one_time', 'refunds', 'invoices', 'webhooks', 'upgrades', 'downgrades')
    )
    when 'dnb' then jsonb_build_object(
      'name', 'DNB Payment Services',
      'regions', jsonb_build_array('NO', 'Nordics'),
      'capabilities', jsonb_build_array('subscriptions', 'one_time', 'refunds', 'invoices', 'webhooks', 'upgrades')
    )
    else jsonb_build_object('name', p_provider, 'regions', '[]'::jsonb, 'capabilities', '[]'::jsonb)
  end;
$$;

create or replace function public._pp262_required_fields(p_provider text)
returns jsonb
language sql
immutable
as $$
  select case p_provider
    when 'klarna' then '[
      {"key":"KLARNA_API_USERNAME","category":"secret_key"},
      {"key":"KLARNA_API_PASSWORD","category":"secret_key"},
      {"key":"KLARNA_API_KEY","category":"secret_key"},
      {"key":"KLARNA_CLIENT_ID","category":"public_key"},
      {"key":"KLARNA_ENVIRONMENT","category":"metadata"},
      {"key":"KLARNA_REGION","category":"metadata"},
      {"key":"KLARNA_MERCHANT_ID","category":"metadata"},
      {"key":"KLARNA_WEBHOOK_SIGNING_KEY","category":"webhook_secret"},
      {"key":"KLARNA_RETURN_URL","category":"url"},
      {"key":"KLARNA_CANCEL_URL","category":"url"},
      {"key":"KLARNA_CONFIRMATION_URL","category":"url"},
      {"key":"KLARNA_PUSH_URL","category":"url"}
    ]'::jsonb
    when 'stripe' then '[
      {"key":"STRIPE_PUBLISHABLE_KEY","category":"public_key"},
      {"key":"STRIPE_SECRET_KEY","category":"secret_key"},
      {"key":"STRIPE_RESTRICTED_KEY","category":"secret_key"},
      {"key":"STRIPE_WEBHOOK_SECRET","category":"webhook_secret"},
      {"key":"STRIPE_ACCOUNT_ID","category":"metadata"},
      {"key":"STRIPE_ENVIRONMENT","category":"metadata"},
      {"key":"STRIPE_SUCCESS_URL","category":"url"},
      {"key":"STRIPE_CANCEL_URL","category":"url"},
      {"key":"STRIPE_CUSTOMER_PORTAL_RETURN_URL","category":"url"}
    ]'::jsonb
    when 'vipps' then '[
      {"key":"VIPPS_CLIENT_ID","category":"public_key"},
      {"key":"VIPPS_CLIENT_SECRET","category":"secret_key"},
      {"key":"VIPPS_SUBSCRIPTION_KEY","category":"secret_key"},
      {"key":"VIPPS_MERCHANT_SERIAL_NUMBER","category":"metadata"},
      {"key":"VIPPS_ENVIRONMENT","category":"metadata"},
      {"key":"VIPPS_SYSTEM_NAME","category":"metadata"},
      {"key":"VIPPS_SYSTEM_VERSION","category":"metadata"},
      {"key":"VIPPS_PLUGIN_NAME","category":"metadata"},
      {"key":"VIPPS_PLUGIN_VERSION","category":"metadata"},
      {"key":"VIPPS_CALLBACK_URL","category":"url"},
      {"key":"VIPPS_RETURN_URL","category":"url"},
      {"key":"VIPPS_WEBHOOK_SECRET","category":"webhook_secret"}
    ]'::jsonb
    when 'dnb' then '[
      {"key":"DNB_MERCHANT_ID","category":"metadata"},
      {"key":"DNB_API_KEY","category":"secret_key"},
      {"key":"DNB_API_SECRET","category":"secret_key"},
      {"key":"DNB_ENVIRONMENT","category":"metadata"},
      {"key":"DNB_CALLBACK_URL","category":"url"},
      {"key":"DNB_RETURN_URL","category":"url"},
      {"key":"DNB_WEBHOOK_SECRET","category":"webhook_secret"}
    ]'::jsonb
    else '[]'::jsonb
  end;
$$;

create or replace function public._pp262_require_credentials_access(p_scope text, p_tenant_id uuid default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  if p_scope = 'platform' then
    if not public.is_platform_admin() then
      raise exception 'Not authorized to manage platform payment providers';
    end if;
    return null;
  end if;

  v_tenant_id := coalesce(p_tenant_id, public._presence_tenant_for_auth());
  if v_tenant_id is null then
    raise exception 'Tenant required';
  end if;

  begin
    perform public._irp_require_permission('subscription.manage', v_tenant_id);
  exception when others then
    raise exception 'Not authorized to manage payment provider credentials';
  end;

  return v_tenant_id;
end;
$$;

create or replace function public._pp262_ensure_settings(
  p_scope text,
  p_tenant_id uuid,
  p_provider text
)
returns public.payment_provider_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.payment_provider_settings;
begin
  select * into v_row
  from public.payment_provider_settings
  where scope = p_scope
    and provider_key = p_provider
    and (
      (p_scope = 'platform' and tenant_id is null)
      or (p_scope = 'tenant' and tenant_id = p_tenant_id)
    );

  if v_row.id is null then
    insert into public.payment_provider_settings (scope, tenant_id, provider_key)
    values (p_scope, case when p_scope = 'platform' then null else p_tenant_id end, p_provider)
    returning * into v_row;
  end if;

  return v_row;
end;
$$;

create or replace function public._pp262_log_audit(
  p_scope text,
  p_tenant_id uuid,
  p_provider text,
  p_event_type text,
  p_summary text,
  p_context jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.payment_provider_audit_logs (
    scope, tenant_id, provider_key, event_type, summary, actor_user_id, context
  ) values (
    p_scope, p_tenant_id, p_provider, p_event_type, p_summary,
    auth.uid(), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._pp262_build_provider_card(
  p_scope text,
  p_tenant_id uuid,
  p_provider text
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_settings public.payment_provider_settings;
  v_meta jsonb;
  v_fields jsonb;
  v_credentials jsonb := '[]'::jsonb;
  v_field jsonb;
  v_vault public.payment_provider_credential_vault;
  v_required integer := 0;
  v_configured integer := 0;
begin
  v_meta := public._pp262_provider_meta(p_provider);
  v_fields := public._pp262_required_fields(p_provider);

  select * into v_settings
  from public.payment_provider_settings
  where scope = p_scope
    and provider_key = p_provider
    and (
      (p_scope = 'platform' and tenant_id is null)
      or (p_scope = 'tenant' and tenant_id = p_tenant_id)
    );

  for v_field in select * from jsonb_array_elements(v_fields)
  loop
    v_required := v_required + 1;
    select * into v_vault
    from public.payment_provider_credential_vault v
    join public.payment_provider_settings s on s.id = v.settings_id
    where s.scope = p_scope
      and s.provider_key = p_provider
      and (
        (p_scope = 'platform' and s.tenant_id is null)
        or (p_scope = 'tenant' and s.tenant_id = p_tenant_id)
      )
      and v.field_key = v_field->>'key';

    if v_vault.id is not null and length(coalesce(v_vault.encrypted_payload, '')) > 0 then
      v_configured := v_configured + 1;
    end if;

    v_credentials := v_credentials || jsonb_build_array(jsonb_build_object(
      'key', v_field->>'key',
      'category', v_field->>'category',
      'masked_value', coalesce(v_vault.masked_value, ''),
      'configured', v_vault.id is not null and length(coalesce(v_vault.encrypted_payload, '')) > 0
    ));
  end loop;

  return jsonb_build_object(
    'provider_key', p_provider,
    'name', v_meta->>'name',
    'status', coalesce(v_settings.status, 'pending_setup'),
    'mode', coalesce(v_settings.mode, 'test'),
    'enabled', coalesce(v_settings.enabled, false),
    'regions', v_meta->'regions',
    'capabilities', v_meta->'capabilities',
    'last_health_check_at', v_settings.last_health_check_at,
    'setup_completed', coalesce(v_settings.setup_completed, false),
    'setup_progress', jsonb_build_object(
      'required_fields', v_required,
      'configured_fields', v_configured
    ),
    'webhook_url', public._pp262_webhook_url(p_provider),
    'webhook_status', coalesce(v_settings.webhook_status, 'not_configured'),
    'last_webhook_at', v_settings.last_webhook_at,
    'public_config', coalesce(v_settings.public_config, '{}'::jsonb),
    'credentials', v_credentials
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. RPC — Payment Providers Center
-- ---------------------------------------------------------------------------
create or replace function public.get_payment_providers_center(
  p_scope text default 'tenant',
  p_tenant_id uuid default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_can_edit boolean := false;
  v_providers jsonb := '[]'::jsonb;
  v_provider text;
  v_audit jsonb := '[]'::jsonb;
begin
  if p_scope not in ('platform', 'tenant') then
    raise exception 'Invalid scope';
  end if;

  if p_scope = 'platform' then
    if not public.is_platform_admin() then
      raise exception 'Not authorized';
    end if;
    v_can_edit := true;
    v_tenant_id := null;
  else
    v_tenant_id := coalesce(p_tenant_id, public._presence_tenant_for_auth());
    if v_tenant_id is null then
      raise exception 'Tenant required';
    end if;
    begin
      perform public._irp_require_permission('subscription.manage', v_tenant_id);
      v_can_edit := true;
    exception when others then
      begin
        perform public._irp_require_permission('subscription.view', v_tenant_id);
        v_can_edit := false;
      exception when others then
        raise exception 'Not authorized';
      end;
    end;
  end if;

  foreach v_provider in array array['klarna', 'vipps', 'stripe', 'dnb']
  loop
    v_providers := v_providers || jsonb_build_array(
      public._pp262_build_provider_card(p_scope, v_tenant_id, v_provider)
    );
  end loop;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id,
    'provider_key', a.provider_key,
    'event_type', a.event_type,
    'summary', a.summary,
    'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_audit
  from (
    select * from public.payment_provider_audit_logs
    where scope = p_scope
      and (
        (p_scope = 'platform' and tenant_id is null)
        or (p_scope = 'tenant' and tenant_id = v_tenant_id)
      )
    order by created_at desc
    limit 15
  ) a;

  return jsonb_build_object(
    'scope', p_scope,
    'tenant_id', v_tenant_id,
    'can_edit', v_can_edit,
    'principle', 'Aipify owns the billing experience. Customers choose the payment provider.',
    'paid_access_now', true,
    'providers', v_providers,
    'recent_audit', v_audit,
    'regional_strategy', jsonb_build_object(
      'norway', jsonb_build_array('vipps', 'dnb', 'klarna', 'stripe'),
      'nordics', jsonb_build_array('vipps', 'klarna', 'stripe'),
      'europe', jsonb_build_array('klarna', 'stripe'),
      'global', jsonb_build_array('stripe')
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. RPC — Upsert credentials (encrypted payloads from application layer)
-- ---------------------------------------------------------------------------
create or replace function public.upsert_payment_provider_config(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_scope text;
  v_tenant_id uuid;
  v_provider text;
  v_settings public.payment_provider_settings;
  v_field jsonb;
  v_plain text;
  v_encrypted text;
  v_masked text;
  v_category text;
begin
  v_scope := coalesce(p_payload->>'scope', 'tenant');
  v_provider := p_payload->>'provider_key';
  v_tenant_id := public._pp262_require_credentials_access(v_scope, nullif(p_payload->>'tenant_id', '')::uuid);

  if v_provider not in ('klarna', 'vipps', 'stripe', 'dnb') then
    raise exception 'Invalid provider';
  end if;

  v_settings := public._pp262_ensure_settings(v_scope, v_tenant_id, v_provider);

  update public.payment_provider_settings set
    mode = coalesce(nullif(p_payload->>'mode', ''), mode),
    enabled = coalesce((p_payload->>'enabled')::boolean, enabled),
    status = coalesce(nullif(p_payload->>'status', ''), status),
    public_config = coalesce(public_config, '{}'::jsonb) || coalesce(p_payload->'public_config', '{}'::jsonb),
    updated_at = now()
  where id = v_settings.id
  returning * into v_settings;

  for v_field in select * from jsonb_array_elements(coalesce(p_payload->'credentials', '[]'::jsonb))
  loop
    v_plain := nullif(v_field->>'value', '');
    if v_plain is null then
      continue;
    end if;

    v_encrypted := coalesce(nullif(v_field->>'encrypted_payload', ''), v_plain);
    v_masked := public._pp262_mask_secret(v_plain);
    v_category := coalesce(nullif(v_field->>'category', ''), 'secret_key');

    insert into public.payment_provider_credential_vault (
      settings_id, field_key, field_category, masked_value, encrypted_payload
    ) values (
      v_settings.id, v_field->>'key', v_category, v_masked, v_encrypted
    )
    on conflict (settings_id, field_key) do update set
      field_category = excluded.field_category,
      masked_value = excluded.masked_value,
      encrypted_payload = excluded.encrypted_payload,
      updated_at = now();
  end loop;

  perform public._pp262_log_audit(
    v_scope, v_tenant_id, v_provider, 'credentials_updated',
    format('Payment provider credentials updated for %s', v_provider),
    jsonb_build_object('mode', v_settings.mode)
  );

  return public._pp262_build_provider_card(v_scope, v_tenant_id, v_provider);
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. RPC — Encrypted credentials for server-side test (permission gated)
-- ---------------------------------------------------------------------------
create or replace function public.get_payment_provider_encrypted_credentials(
  p_scope text,
  p_provider text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_settings_id uuid;
  v_result jsonb := '{}'::jsonb;
begin
  v_tenant_id := public._pp262_require_credentials_access(p_scope, null);

  select s.id into v_settings_id
  from public.payment_provider_settings s
  where s.scope = p_scope
    and s.provider_key = p_provider
    and (
      (p_scope = 'platform' and s.tenant_id is null)
      or (p_scope = 'tenant' and s.tenant_id = v_tenant_id)
    );

  if v_settings_id is null then
    return jsonb_build_object('found', false);
  end if;

  select coalesce(jsonb_object_agg(v.field_key, v.encrypted_payload), '{}'::jsonb)
  into v_result
  from public.payment_provider_credential_vault v
  where v.settings_id = v_settings_id;

  return jsonb_build_object(
    'found', true,
    'provider_key', p_provider,
    'scope', p_scope,
    'mode', (select mode from public.payment_provider_settings where id = v_settings_id),
    'encrypted_credentials', v_result
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 6. RPC — Record test connection result
-- ---------------------------------------------------------------------------
create or replace function public.record_payment_provider_test_result(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_scope text;
  v_tenant_id uuid;
  v_provider text;
  v_success boolean;
  v_message text;
  v_settings public.payment_provider_settings;
begin
  v_scope := coalesce(p_payload->>'scope', 'tenant');
  v_provider := p_payload->>'provider_key';
  v_success := coalesce((p_payload->>'success')::boolean, false);
  v_message := coalesce(p_payload->>'message', '');
  v_tenant_id := public._pp262_require_credentials_access(v_scope, null);

  v_settings := public._pp262_ensure_settings(v_scope, v_tenant_id, v_provider);

  update public.payment_provider_settings set
    last_health_check_at = now(),
    status = case
      when v_success then 'operational'
      else 'requires_attention'
    end,
    setup_completed = case when v_success then true else setup_completed end,
    updated_at = now()
  where id = v_settings.id;

  perform public._pp262_log_audit(
    v_scope, v_tenant_id, v_provider, 'test_connection_performed',
    v_message,
    jsonb_build_object('success', v_success)
  );

  return public._pp262_build_provider_card(v_scope, v_tenant_id, v_provider);
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. RPC — Package upgrade preview with provider selection
-- ---------------------------------------------------------------------------
create or replace function public._pp262_package_monthly_price(p_package text)
returns numeric
language sql
immutable
as $$
  select case p_package
    when 'starter' then 49
    when 'professional' then 149
    when 'business' then 299
    when 'enterprise' then 799
    else 0
  end;
$$;

create or replace function public.get_package_upgrade_checkout(
  p_target_package text,
  p_payment_provider text default 'stripe'
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_current_package text;
  v_current_price numeric;
  v_new_price numeric;
  v_provider_card jsonb;
  v_provider_status text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Tenant required';
  end if;

  perform public._irp_require_permission('package_access.upgrade', v_tenant_id);

  if p_target_package not in ('starter', 'professional', 'business', 'enterprise') then
    raise exception 'Invalid target package';
  end if;

  if p_payment_provider not in ('klarna', 'vipps', 'stripe', 'dnb') then
    raise exception 'Invalid payment provider';
  end if;

  v_current_package := public._cpa_resolve_package_key(v_tenant_id);
  v_current_price := public._pp262_package_monthly_price(v_current_package);
  v_new_price := public._pp262_package_monthly_price(p_target_package);

  v_provider_card := public._pp262_build_provider_card('tenant', v_tenant_id, p_payment_provider);
  v_provider_status := v_provider_card->>'status';

  return jsonb_build_object(
    'current_plan', v_current_package,
    'new_plan', p_target_package,
    'current_price_monthly', v_current_price,
    'new_price_monthly', v_new_price,
    'price_difference_monthly', greatest(0, v_new_price - v_current_price),
    'currency', 'USD',
    'payment_provider', p_payment_provider,
    'provider_name', v_provider_card->>'name',
    'provider_operational', v_provider_status = 'operational' or v_provider_status = 'pending_setup',
    'instant_access', true,
    'instant_access_message', 'Activated immediately after payment confirmation — no logout required.',
    'available_providers', (
      select coalesce(jsonb_agg(public._pp262_build_provider_card('tenant', v_tenant_id, pk)), '[]'::jsonb)
      from unnest(array['klarna', 'vipps', 'stripe', 'dnb']) as pk
      where (public._pp262_build_provider_card('tenant', v_tenant_id, pk)->>'enabled')::boolean
         or public._pp262_build_provider_card('tenant', v_tenant_id, pk)->>'status' in ('operational', 'pending_setup')
    )
  );
end;
$$;

create or replace function public.complete_package_upgrade_with_provider(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_result jsonb;
  v_provider text;
  v_tenant_id uuid;
begin
  v_provider := coalesce(p_payload->>'payment_provider', 'stripe');
  v_tenant_id := public._presence_tenant_for_auth();

  v_result := public.complete_package_upgrade_instant(
    p_payload || jsonb_build_object(
      'payment_reference',
      coalesce(
        p_payload->>'payment_reference',
        format('%s_%s_%s', v_provider, p_payload->>'target_package', extract(epoch from now())::bigint)
      )
    )
  );

  perform public._pp262_log_audit(
    'tenant', v_tenant_id, v_provider, 'plan_upgraded',
    format('Plan upgraded via %s with instant access', v_provider),
    jsonb_build_object(
      'to_package', p_payload->>'target_package',
      'payment_reference', p_payload->>'payment_reference',
      'instant_activation', true
    )
  );

  return v_result || jsonb_build_object('payment_provider', v_provider);
end;
$$;

-- ---------------------------------------------------------------------------
-- 8. Seed platform provider rows
-- ---------------------------------------------------------------------------
insert into public.payment_provider_settings (scope, tenant_id, provider_key, status, mode, enabled)
select 'platform', null, v.provider_key, 'pending_setup', 'test', false
from (values ('klarna'), ('vipps'), ('stripe'), ('dnb')) as v(provider_key)
where not exists (
  select 1 from public.payment_provider_settings s
  where s.scope = 'platform' and s.tenant_id is null and s.provider_key = v.provider_key
);

-- ---------------------------------------------------------------------------
-- 9. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_payment_providers_center(text, uuid) to authenticated;
grant execute on function public.upsert_payment_provider_config(jsonb) to authenticated;
grant execute on function public.get_payment_provider_encrypted_credentials(text, text) to authenticated;
grant execute on function public.record_payment_provider_test_result(jsonb) to authenticated;
grant execute on function public.get_package_upgrade_checkout(text, text) to authenticated;
grant execute on function public.complete_package_upgrade_with_provider(jsonb) to authenticated;
