-- PREPARED_ONLY — do not apply until exact owner Staging approval AFTER variants billing SQL.
-- AIPIFY_VARIANT_COMMISSION_CORE_STAGING — versioned seller commission per variant × interval
--
-- DEPENDS ON (install order step 1)
--   docs/platform/sql-candidates/csp_product_variants_billing_v1.sql
--
-- STAGING PREFLIGHT (read-only verified 2026-11-28 · auedugihkduoaikfusqe)
--   products:
--     kompis_web      id=1c08f0c3-f553-48b0-934f-6f9c2b908ff4  fixed=500 NOK  published=true
--     kompis_bedrift  id=d1a6653a-e623-440f-825d-6498462241c6  fixed=800 NOK  published=true
--     aipify_voice    id=6858f620-021a-4b58-9f6f-9d67f0093fc3  fixed=0 NOK    published=false
--   csp_commission_rate_versions: 3 historical product-level rows (KEEP FOREVER)
--   csp_qualified_sales: 4 rows (kompis_web · snapshot 500 NOK · KEEP FOREVER)
--   csp_variant_commission_rate_versions: ABSENT (safe first apply)
--
-- PURPOSE
--   Versioned commission rules for (product_id, variant_key, billing_interval).
--   Shared Core truth for Opprett produkt and Provisjonspriser.
--   Supports fixed NOK (ex VAT) and percent of net_ex_vat_after_discount.
--
-- EFFECTS (when applied)
--   + public.csp_variant_commission_rate_versions
--   + list_csp_variant_commission_rates(p_product_id uuid default null)
--   + upsert_csp_variant_commission_rate(...)  -- insert-only versioning
--   + get_effective_csp_variant_commission(...)
--   + replaces get_csp_product_variants_bundle to include commission_rules[]
--
-- NON-EFFECTS / HARD GATES
--   Does NOT INSERT/UPDATE/DELETE csp_commission_rate_versions
--   Does NOT mutate csp_qualified_sales / csp_commission_ledger / snapshots
--   Does NOT copy 500/800/0 product rates onto variants (no backfill)
--   Does NOT activate settlement earn path / Stripe / payments
--   Does NOT change publish_app / publish_sale / master_active
--
-- OWNER GATES
--   APPLY_BLOCKED_UNTIL_OWNER_YES · NO_COMMISSION_ACTIVATION · NO_PRODUCTION_WRITE

create table if not exists public.csp_variant_commission_rate_versions (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null
    references public.csp_sales_products (id) on delete restrict,
  variant_key text not null check (length(btrim(variant_key)) > 0),
  billing_interval text not null
    check (billing_interval in ('month', 'year', 'one_time')),
  model text not null check (model in ('fixed', 'percent')),
  -- Fixed amount in major currency units, exclusive of VAT.
  amount numeric(12, 2),
  -- Percent of net sales amount ex VAT (0–100).
  rate_pct numeric(8, 4),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  percent_basis text,
  active boolean not null default true,
  effective_from timestamptz not null,
  created_at timestamptz not null default now(),
  created_by uuid null,
  supersedes_id uuid null
    references public.csp_variant_commission_rate_versions (id) on delete restrict,
  notes text null,
  constraint csp_variant_commission_model_shape check (
    (
      model = 'fixed'
      and amount is not null
      and amount >= 0
      and rate_pct is null
      and percent_basis is null
    )
    or (
      model = 'percent'
      and rate_pct is not null
      and rate_pct >= 0
      and rate_pct <= 100
      and amount is null
      and percent_basis = 'net_ex_vat_after_discount'
    )
  ),
  unique (product_id, variant_key, billing_interval, effective_from)
);

create index if not exists csp_variant_commission_pick_idx
  on public.csp_variant_commission_rate_versions (
    product_id, variant_key, billing_interval, effective_from desc
  );

revoke all on table public.csp_variant_commission_rate_versions
  from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- list — shared by Opprett produkt + Provisjonspriser
-- ---------------------------------------------------------------------------
create or replace function public.list_csp_variant_commission_rates(
  p_product_id uuid default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_admin boolean;
begin
  v_admin := coalesce(public.is_platform_admin(), false);
  if not v_admin then
    raise exception 'forbidden';
  end if;

  return coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'id', r.id,
          'product_id', r.product_id,
          'product_key', p.product_key,
          'variant_key', r.variant_key,
          'billing_interval', r.billing_interval,
          'model', r.model,
          'amount', r.amount,
          'rate_pct', r.rate_pct,
          'currency', r.currency,
          'percent_basis', r.percent_basis,
          'active', r.active,
          'effective_from', r.effective_from,
          'created_at', r.created_at,
          'created_by', r.created_by,
          'supersedes_id', r.supersedes_id,
          'notes', r.notes,
          'vat_label', 'exclusive'
        )
        order by p.product_key, r.variant_key, r.billing_interval, r.effective_from desc
      )
      from public.csp_variant_commission_rate_versions r
      join public.csp_sales_products p on p.id = r.product_id
      where p_product_id is null or r.product_id = p_product_id
    ),
    '[]'::jsonb
  );
end;
$$;

revoke all on function public.list_csp_variant_commission_rates(uuid) from public, anon;
grant execute on function public.list_csp_variant_commission_rates(uuid)
  to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- upsert — insert-only versioning (never mutates prior amount/rate rows)
-- Idempotent when the exact same natural key + payload is replayed.
-- ---------------------------------------------------------------------------
create or replace function public.upsert_csp_variant_commission_rate(
  p_product_id uuid,
  p_variant_key text,
  p_billing_interval text,
  p_model text,
  p_currency text,
  p_amount numeric default null,
  p_rate_pct numeric default null,
  p_active boolean default true,
  p_effective_from timestamptz default null,
  p_supersedes_id uuid default null,
  p_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_product public.csp_sales_products%rowtype;
  v_key text := btrim(coalesce(p_variant_key, ''));
  v_interval text := btrim(coalesce(p_billing_interval, ''));
  v_model text := lower(btrim(coalesce(p_model, '')));
  v_currency text := upper(btrim(coalesce(p_currency, '')));
  v_effective timestamptz := coalesce(p_effective_from, now());
  v_basis text := null;
  v_existing public.csp_variant_commission_rate_versions%rowtype;
  v_id uuid;
begin
  if v_uid is null or not coalesce(public.is_platform_admin(), false) then
    raise exception 'forbidden';
  end if;

  if p_product_id is null then
    raise exception 'product_id_required';
  end if;
  select * into v_product from public.csp_sales_products where id = p_product_id;
  if not found then
    raise exception 'unknown_product_id';
  end if;

  if v_key = '' then
    raise exception 'variant_key_required';
  end if;
  if v_interval not in ('month', 'year', 'one_time') then
    raise exception 'invalid_billing_interval';
  end if;
  if v_model not in ('fixed', 'percent') then
    raise exception 'invalid_commission_model';
  end if;
  if v_currency !~ '^[A-Z]{3}$' then
    raise exception 'invalid_currency';
  end if;

  if not exists (
    select 1
    from public.csp_product_variants v
    where v.product_key = v_product.product_key
      and v.variant_key = v_key
  ) then
    raise exception 'unknown_variant_key';
  end if;

  if v_model = 'fixed' then
    if p_amount is null or p_amount < 0 then
      raise exception 'fixed_amount_required';
    end if;
    if p_rate_pct is not null then
      raise exception 'fixed_rejects_rate_pct';
    end if;
  else
    if p_rate_pct is null or p_rate_pct < 0 or p_rate_pct > 100 then
      raise exception 'percent_rate_required';
    end if;
    if p_amount is not null then
      raise exception 'percent_rejects_amount';
    end if;
    v_basis := 'net_ex_vat_after_discount';
  end if;

  if p_supersedes_id is not null
     and not exists (
       select 1
       from public.csp_variant_commission_rate_versions s
       where s.id = p_supersedes_id
         and s.product_id = p_product_id
         and s.variant_key = v_key
         and s.billing_interval = v_interval
     ) then
    raise exception 'invalid_supersedes_id';
  end if;

  select * into v_existing
  from public.csp_variant_commission_rate_versions
  where product_id = p_product_id
    and variant_key = v_key
    and billing_interval = v_interval
    and effective_from = v_effective;

  if found then
    -- Idempotent replay of identical payload; reject silent mutation.
    if v_existing.model = v_model
       and v_existing.currency = v_currency
       and v_existing.active is not distinct from coalesce(p_active, true)
       and v_existing.amount is not distinct from (case when v_model = 'fixed' then p_amount else null end)
       and v_existing.rate_pct is not distinct from (case when v_model = 'percent' then p_rate_pct else null end)
       and v_existing.percent_basis is not distinct from v_basis
    then
      return jsonb_build_object(
        'ok', true,
        'idempotent', true,
        'id', v_existing.id,
        'product_id', p_product_id,
        'product_key', v_product.product_key,
        'variant_key', v_key,
        'billing_interval', v_interval,
        'effective_from', v_effective,
        'persisted', true,
        'settlement_activated', false
      );
    end if;
    raise exception 'rate_version_conflict_use_new_effective_from';
  end if;

  insert into public.csp_variant_commission_rate_versions (
    product_id, variant_key, billing_interval, model, amount, rate_pct, currency,
    percent_basis, active, effective_from, created_by, supersedes_id, notes
  ) values (
    p_product_id, v_key, v_interval, v_model,
    (case when v_model = 'fixed' then p_amount else null end),
    (case when v_model = 'percent' then p_rate_pct else null end),
    v_currency, v_basis, coalesce(p_active, true), v_effective, v_uid,
    p_supersedes_id, nullif(btrim(coalesce(p_notes, '')), '')
  )
  returning id into v_id;

  perform public._csp_audit(
    v_uid,
    'platform_admin',
    'variant_commission_rate_version_created',
    'csp_variant_commission_rate_versions',
    v_id,
    jsonb_build_object(
      'product_id', p_product_id,
      'product_key', v_product.product_key,
      'variant_key', v_key,
      'billing_interval', v_interval,
      'model', v_model,
      'amount', (case when v_model = 'fixed' then p_amount else null end),
      'rate_pct', (case when v_model = 'percent' then p_rate_pct else null end),
      'currency', v_currency,
      'effective_from', v_effective,
      'settlement_activated', false
    )
  );

  return jsonb_build_object(
    'ok', true,
    'idempotent', false,
    'id', v_id,
    'product_id', p_product_id,
    'product_key', v_product.product_key,
    'variant_key', v_key,
    'billing_interval', v_interval,
    'effective_from', v_effective,
    'persisted', true,
    'settlement_activated', false
  );
end;
$$;

revoke all on function public.upsert_csp_variant_commission_rate(
  uuid, text, text, text, text, numeric, numeric, boolean, timestamptz, uuid, text
) from public, anon;
grant execute on function public.upsert_csp_variant_commission_rate(
  uuid, text, text, text, text, numeric, numeric, boolean, timestamptz, uuid, text
) to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- get_effective — read helper for editor/settlement (settlement NOT activated)
-- ---------------------------------------------------------------------------
create or replace function public.get_effective_csp_variant_commission(
  p_product_id uuid,
  p_variant_key text,
  p_billing_interval text,
  p_at timestamptz default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_at timestamptz := coalesce(p_at, now());
  v_row public.csp_variant_commission_rate_versions%rowtype;
  v_admin boolean;
begin
  v_admin := coalesce(public.is_platform_admin(), false);
  if not v_admin then
    raise exception 'forbidden';
  end if;

  if p_product_id is null or btrim(coalesce(p_variant_key, '')) = '' then
    raise exception 'product_and_variant_required';
  end if;
  if p_billing_interval not in ('month', 'year', 'one_time') then
    raise exception 'invalid_billing_interval';
  end if;

  select *
  into v_row
  from public.csp_variant_commission_rate_versions r
  where r.product_id = p_product_id
    and r.variant_key = btrim(p_variant_key)
    and r.billing_interval = p_billing_interval
    and r.effective_from <= v_at
  order by r.effective_from desc
  limit 1;

  if not found then
    return jsonb_build_object(
      'found', false,
      'product_id', p_product_id,
      'variant_key', btrim(p_variant_key),
      'billing_interval', p_billing_interval,
      'at', v_at,
      'settlement_activated', false
    );
  end if;

  return jsonb_build_object(
    'found', true,
    'id', v_row.id,
    'product_id', v_row.product_id,
    'variant_key', v_row.variant_key,
    'billing_interval', v_row.billing_interval,
    'model', v_row.model,
    'amount', v_row.amount,
    'rate_pct', v_row.rate_pct,
    'currency', v_row.currency,
    'percent_basis', v_row.percent_basis,
    'active', v_row.active,
    'effective_from', v_row.effective_from,
    'vat_label', 'exclusive',
    'at', v_at,
    'settlement_activated', false
  );
end;
$$;

revoke all on function public.get_effective_csp_variant_commission(
  uuid, text, text, timestamptz
) from public, anon;
grant execute on function public.get_effective_csp_variant_commission(
  uuid, text, text, timestamptz
) to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Extend variants bundle so Opprett produkt reads the same Core commission data
-- ---------------------------------------------------------------------------
create or replace function public.get_csp_product_variants_bundle(p_product_key text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_admin boolean;
  v_product_id uuid;
begin
  v_admin := coalesce(public.is_platform_admin(), false);
  if not v_admin then
    null;
  end if;

  if p_product_key is null or length(trim(p_product_key)) = 0 then
    raise exception 'product_key_required';
  end if;

  select sp.id into v_product_id
  from public.csp_sales_products sp
  where sp.product_key = p_product_key;

  return jsonb_build_object(
    'product_key', p_product_key,
    'product_id', v_product_id,
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
            ),
            'commission_rules',
            coalesce(
              (
                select jsonb_agg(rule_row.rule order by rule_row.billing_interval)
                from (
                  select distinct on (c.billing_interval)
                    c.billing_interval,
                    jsonb_build_object(
                      'id', c.id,
                      'billing_interval', c.billing_interval,
                      'model', c.model,
                      'amount', c.amount,
                      'rate_pct', c.rate_pct,
                      'currency', c.currency,
                      'percent_basis', c.percent_basis,
                      'active', c.active,
                      'effective_from', c.effective_from,
                      'vat_label', 'exclusive'
                    ) as rule
                  from public.csp_variant_commission_rate_versions c
                  where v_product_id is not null
                    and c.product_id = v_product_id
                    and c.variant_key = v.variant_key
                    and c.effective_from <= now()
                  order by c.billing_interval, c.effective_from desc
                ) rule_row
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
    'checkout', 'not_enabled_by_this_rpc',
    'settlement_activated', false,
    'legacy_product_commission_untouched', true
  );
end;
$$;

revoke all on function public.get_csp_product_variants_bundle(text) from public, anon;
grant execute on function public.get_csp_product_variants_bundle(text)
  to authenticated, service_role;
