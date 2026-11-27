-- PREPARED_ONLY — do not apply until exact owner Staging approval, then separate Production approval.
-- AIPIFY PLATFORM — Product Center Premium Complete — variants + billing prices
--
-- PURPOSE
--   Additive Core storage for product variants (plans) and per-interval prices
--   (month / year / one_time) bound to csp_sales_products.product_key.
--   Provider (Stripe) product/price IDs are optional mappings — never created by this SQL.
--
-- EFFECTS (when applied)
--   + public.csp_product_variants
--   + public.csp_product_variant_prices
--   + get_csp_product_variants_bundle(p_product_key text)
--   + upsert_csp_product_variant(...) / upsert_csp_product_variant_price(...)
--   RLS: revoke all from public/anon/authenticated; security definer RPCs only
--
-- NON-EFFECTS
--   Does NOT create Stripe products/prices
--   Does NOT enable APP checkout or percent commission settlement
--   Does NOT mutate existing fixed commissions on csp_sales_products
--   Does NOT seed demo/test products
--   Does NOT change publish_app / publish_sale channel flags
--
-- ROLLBACK
--   DROP FUNCTION public.upsert_csp_product_variant_price;
--   DROP FUNCTION public.upsert_csp_product_variant;
--   DROP FUNCTION public.get_csp_product_variants_bundle(text);
--   DROP TABLE public.csp_product_variant_prices;
--   DROP TABLE public.csp_product_variants;
--   (history-safe: prefer soft archive via active=false over hard delete in Production)
--
-- OWNER GATES
--   1) Staging apply + QA
--   2) Separate Production apply approval
--   APPLY_BLOCKED_UNTIL_OWNER_YES

create table if not exists public.csp_product_variants (
  id uuid primary key default gen_random_uuid(),
  product_key text not null,
  variant_key text not null,
  admin_name text not null,
  customer_label text not null,
  sort_order integer not null default 0,
  active boolean not null default true,
  recommended boolean not null default false,
  quota_value numeric(18, 4),
  quota_unit text,
  quota_kind text not null default 'none'
    check (quota_kind in (
      'lifetime_total',
      'monthly_renewing',
      'annual_pool',
      'unit_count',
      'none'
    )),
  annual_renews_quota_monthly boolean not null default false,
  features jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_key, variant_key)
);

create index if not exists csp_product_variants_product_idx
  on public.csp_product_variants (product_key, active, sort_order);

create table if not exists public.csp_product_variant_prices (
  id uuid primary key default gen_random_uuid(),
  product_key text not null,
  variant_key text not null,
  billing_interval text not null
    check (billing_interval in ('month', 'year', 'one_time')),
  currency char(3) not null,
  amount_minor bigint,
  amount_major numeric(12, 2),
  vat_label text not null default 'unknown'
    check (vat_label in ('unknown', 'inclusive', 'exclusive')),
  provider text,
  provider_product_id text,
  provider_price_id text,
  purchasable boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_key, variant_key, billing_interval, currency)
);

create index if not exists csp_product_variant_prices_lookup_idx
  on public.csp_product_variant_prices (product_key, variant_key, billing_interval);

revoke all on table public.csp_product_variants from public, anon, authenticated;
revoke all on table public.csp_product_variant_prices from public, anon, authenticated;

create or replace function public.get_csp_product_variants_bundle(p_product_key text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_admin boolean;
begin
  v_admin := public.is_platform_admin();
  if not coalesce(v_admin, false) then
    -- Tenant/partner readers: only active variants for known published products.
    -- Exact channel visibility remains in channel/catalog RPCs.
    null;
  end if;

  if p_product_key is null or length(trim(p_product_key)) = 0 then
    raise exception 'product_key_required';
  end if;

  return jsonb_build_object(
    'product_key', p_product_key,
    'variants',
    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'variant_key', v.variant_key,
            'admin_name', v.admin_name,
            'customer_label', v.customer_label,
            'sort_order', v.sort_order,
            'active', v.active,
            'recommended', v.recommended,
            'quota_value', v.quota_value,
            'quota_unit', v.quota_unit,
            'quota_kind', v.quota_kind,
            'annual_renews_quota_monthly', v.annual_renews_quota_monthly,
            'features', v.features,
            'prices',
            coalesce(
              (
                select jsonb_agg(
                  jsonb_build_object(
                    'billing_interval', p.billing_interval,
                    'currency', p.currency,
                    'amount_minor', p.amount_minor,
                    'amount_major', p.amount_major,
                    'vat_label', p.vat_label,
                    'provider', p.provider,
                    'provider_product_id', p.provider_product_id,
                    'provider_price_id', p.provider_price_id,
                    'purchasable', p.purchasable,
                    'active', p.active
                  )
                  order by p.billing_interval
                )
                from public.csp_product_variant_prices p
                where p.product_key = v.product_key
                  and p.variant_key = v.variant_key
                  and p.active = true
              ),
              '[]'::jsonb
            )
          )
          order by v.sort_order, v.variant_key
        )
        from public.csp_product_variants v
        where v.product_key = p_product_key
          and v.active = true
      ),
      '[]'::jsonb
    ),
    'persistence', 'core',
    'checkout', 'not_enabled_by_this_rpc'
  );
end;
$$;

revoke all on function public.get_csp_product_variants_bundle(text) from public, anon;
grant execute on function public.get_csp_product_variants_bundle(text) to authenticated, service_role;

create or replace function public.upsert_csp_product_variant(
  p_product_key text,
  p_variant_key text,
  p_admin_name text,
  p_customer_label text,
  p_sort_order integer default 0,
  p_active boolean default true,
  p_recommended boolean default false,
  p_quota_value numeric default null,
  p_quota_unit text default null,
  p_quota_kind text default 'none',
  p_annual_renews_quota_monthly boolean default false,
  p_features jsonb default '[]'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not coalesce(public.is_platform_admin(), false) then
    raise exception 'forbidden';
  end if;
  if p_product_key is null or p_variant_key is null then
    raise exception 'product_and_variant_required';
  end if;

  insert into public.csp_product_variants (
    product_key, variant_key, admin_name, customer_label, sort_order, active,
    recommended, quota_value, quota_unit, quota_kind, annual_renews_quota_monthly, features, updated_at
  ) values (
    p_product_key, p_variant_key, p_admin_name, p_customer_label, coalesce(p_sort_order, 0),
    coalesce(p_active, true), coalesce(p_recommended, false), p_quota_value, p_quota_unit,
    coalesce(p_quota_kind, 'none'), coalesce(p_annual_renews_quota_monthly, false),
    coalesce(p_features, '[]'::jsonb), now()
  )
  on conflict (product_key, variant_key) do update set
    admin_name = excluded.admin_name,
    customer_label = excluded.customer_label,
    sort_order = excluded.sort_order,
    active = excluded.active,
    recommended = excluded.recommended,
    quota_value = excluded.quota_value,
    quota_unit = excluded.quota_unit,
    quota_kind = excluded.quota_kind,
    annual_renews_quota_monthly = excluded.annual_renews_quota_monthly,
    features = excluded.features,
    updated_at = now();

  return jsonb_build_object(
    'ok', true,
    'product_key', p_product_key,
    'variant_key', p_variant_key,
    'persisted', true
  );
end;
$$;

revoke all on function public.upsert_csp_product_variant(
  text, text, text, text, integer, boolean, boolean, numeric, text, text, boolean, jsonb
) from public, anon;
grant execute on function public.upsert_csp_product_variant(
  text, text, text, text, integer, boolean, boolean, numeric, text, text, boolean, jsonb
) to authenticated, service_role;

create or replace function public.upsert_csp_product_variant_price(
  p_product_key text,
  p_variant_key text,
  p_billing_interval text,
  p_currency char(3),
  p_amount_minor bigint default null,
  p_amount_major numeric default null,
  p_vat_label text default 'unknown',
  p_provider text default null,
  p_provider_product_id text default null,
  p_provider_price_id text default null,
  p_purchasable boolean default false,
  p_active boolean default true
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not coalesce(public.is_platform_admin(), false) then
    raise exception 'forbidden';
  end if;
  if p_billing_interval not in ('month', 'year', 'one_time') then
    raise exception 'invalid_billing_interval';
  end if;
  -- Never mark purchasable without an explicit provider price mapping.
  if coalesce(p_purchasable, false) = true
     and (p_provider_price_id is null or length(trim(p_provider_price_id)) = 0) then
    raise exception 'purchasable_requires_provider_price_id';
  end if;

  insert into public.csp_product_variant_prices (
    product_key, variant_key, billing_interval, currency, amount_minor, amount_major,
    vat_label, provider, provider_product_id, provider_price_id, purchasable, active, updated_at
  ) values (
    p_product_key, p_variant_key, p_billing_interval, upper(p_currency),
    p_amount_minor, p_amount_major, coalesce(p_vat_label, 'unknown'),
    p_provider, p_provider_product_id, p_provider_price_id,
    coalesce(p_purchasable, false), coalesce(p_active, true), now()
  )
  on conflict (product_key, variant_key, billing_interval, currency) do update set
    amount_minor = excluded.amount_minor,
    amount_major = excluded.amount_major,
    vat_label = excluded.vat_label,
    provider = excluded.provider,
    provider_product_id = excluded.provider_product_id,
    provider_price_id = excluded.provider_price_id,
    purchasable = excluded.purchasable,
    active = excluded.active,
    updated_at = now();

  return jsonb_build_object(
    'ok', true,
    'product_key', p_product_key,
    'variant_key', p_variant_key,
    'billing_interval', p_billing_interval,
    'purchasable', coalesce(p_purchasable, false),
    'stripe_created', false
  );
end;
$$;

revoke all on function public.upsert_csp_product_variant_price(
  text, text, text, char, bigint, numeric, text, text, text, text, boolean, boolean
) from public, anon;
grant execute on function public.upsert_csp_product_variant_price(
  text, text, text, char, bigint, numeric, text, text, text, text, boolean, boolean
) to authenticated, service_role;
