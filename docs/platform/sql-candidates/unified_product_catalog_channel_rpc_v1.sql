-- UNIFIED PRODUCT CATALOG — channel RPC + publish_sale canonical writers V1
-- Status: CANDIDATE ONLY — DO NOT APPLY without exact owner approval naming this file.
-- Date: 2026-11-26
-- Depends on (already applied on Staging auedugihkduoaikfusqe):
--   docs/platform/sql-candidates/unified_product_catalog_channel_sql_v1.sql
--   SHA256 2ffaf5a43ec1d5a488b9bd2298abb96c2c25457f521f6afb34c3b2e49d77d970
--
-- Goals:
-- 1. publish_sale is SALE channel truth; legacy `published` stays mirrored.
-- 2. Bidirectional BEFORE trigger: legacy published-only writes sync publish_sale;
--    publish_sale writes sync published. Single trigger — no mutual recursion.
-- 3. Fix csp_upsert_sales_product to write publish_sale (accepts published OR publish_sale).
-- 4. Platform overview returns products[] with channel flags.
-- 5. Platform channel setter RPC (publish_app / publish_sale).
-- 6. APP store list RPC: publish_app + master_active only; never commission fields.
--
-- Out of scope: percent settlement, Stripe, entitlement grants, Production apply.

begin;

-- ---------------------------------------------------------------------------
-- Guard: channel columns must exist (schema candidate applied first).
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'csp_sales_products' and column_name = 'publish_sale'
  ) then
    raise exception 'unified_product_catalog_channel_rpc_v1 requires publish_sale column (apply channel schema candidate first)';
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'csp_sales_products' and column_name = 'publish_app'
  ) then
    raise exception 'unified_product_catalog_channel_rpc_v1 requires publish_app column (apply channel schema candidate first)';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Canonical sync trigger (replaces publish_sale-only sync).
-- Rule: publish_sale is SALE truth. Legacy clients that only set `published`
-- still work by copying published -> publish_sale when publish_sale is unchanged.
-- ---------------------------------------------------------------------------
create or replace function public._csp_sync_sale_publish_flags()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    -- Prefer explicit publish_sale; else inherit published; else false.
    if new.publish_sale is null then
      new.publish_sale := coalesce(new.published, false);
    end if;
    new.published := new.publish_sale;
    new.publish_app := coalesce(new.publish_app, false);
    new.updated_at := coalesce(new.updated_at, now());
    return new;
  end if;

  -- UPDATE: detect which side changed relative to OLD.
  if new.publish_sale is distinct from old.publish_sale then
    -- Canonical SALE writer path.
    new.published := new.publish_sale;
  elsif new.published is distinct from old.published then
    -- Legacy published-only writer path.
    new.publish_sale := new.published;
  else
    -- Keep pair aligned if somehow drifted.
    new.published := new.publish_sale;
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_csp_sales_products_sync_published on public.csp_sales_products;
drop trigger if exists trg_csp_sales_products_sync_sale_flags on public.csp_sales_products;
create trigger trg_csp_sales_products_sync_sale_flags
before insert or update of published, publish_sale, publish_app on public.csp_sales_products
for each row
execute function public._csp_sync_sale_publish_flags();

-- One-shot heal any existing drift (should already be 0 on Staging).
update public.csp_sales_products
set publish_sale = published
where publish_sale is distinct from published;

-- ---------------------------------------------------------------------------
-- Platform upsert: write publish_sale; accept legacy published.
-- ---------------------------------------------------------------------------
create or replace function public.csp_upsert_sales_product(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_key text;
  v_currency text;
  v_amount numeric(12,2);
  v_raw text;
  v_sale boolean;
  v_prod public.csp_sales_products%rowtype;
  v_created boolean := false;
  v_changed boolean := false;
  v_rate_id uuid;
begin
  if v_uid is null or not coalesce(public.is_platform_admin(), false) then
    return jsonb_build_object('found', false, 'error', 'forbidden');
  end if;
  if jsonb_typeof(p_payload) is distinct from 'object' then
    return jsonb_build_object('found', false, 'error', 'invalid_payload');
  end if;

  v_key := lower(btrim(coalesce(p_payload ->> 'productKey', p_payload ->> 'product_key', '')));
  if v_key !~ '^[a-z0-9][a-z0-9_-]{1,63}$' then
    return jsonb_build_object('found', false, 'error', 'product_key_invalid');
  end if;

  v_currency := upper(btrim(coalesce(p_payload ->> 'currency', '')));
  if v_currency !~ '^[A-Z]{3}$' then
    return jsonb_build_object('found', false, 'error', 'currency_invalid');
  end if;

  v_raw := coalesce(p_payload ->> 'fixedCommissionAmount', p_payload ->> 'fixed_commission_amount');
  if v_raw is null or v_raw !~ '^[0-9]{1,7}(\.[0-9]{1,2})?$' then
    return jsonb_build_object('found', false, 'error', 'amount_invalid');
  end if;
  v_amount := v_raw::numeric(12,2);

  -- SALE flag: prefer publish_sale; accept legacy published.
  if p_payload ? 'publish_sale' or p_payload ? 'publishSale' then
    if jsonb_typeof(coalesce(p_payload -> 'publish_sale', p_payload -> 'publishSale')) <> 'boolean' then
      return jsonb_build_object('found', false, 'error', 'publish_sale_invalid');
    end if;
    v_sale := coalesce((p_payload ->> 'publish_sale')::boolean, (p_payload ->> 'publishSale')::boolean);
  elsif p_payload ? 'published' then
    if jsonb_typeof(p_payload -> 'published') <> 'boolean' then
      return jsonb_build_object('found', false, 'error', 'published_invalid');
    end if;
    v_sale := (p_payload ->> 'published')::boolean;
  end if;

  select * into v_prod from public.csp_sales_products where product_key = v_key for update;

  if not found then
    insert into public.csp_sales_products (
      product_key, fixed_commission_amount, currency, publish_sale, published
    )
    values (v_key, v_amount, v_currency, coalesce(v_sale, false), coalesce(v_sale, false))
    returning * into v_prod;
    v_created := true;
    v_changed := true;
  else
    v_changed := v_prod.fixed_commission_amount is distinct from v_amount
              or v_prod.currency is distinct from v_currency;
    update public.csp_sales_products
    set fixed_commission_amount = v_amount,
        currency = v_currency,
        publish_sale = coalesce(v_sale, publish_sale),
        updated_at = now()
    where id = v_prod.id
    returning * into v_prod;
  end if;

  if v_changed then
    insert into public.csp_commission_rate_versions (product_id, amount, currency, effective_from)
    values (v_prod.id, v_amount, v_currency, clock_timestamp())
    returning id into v_rate_id;
  end if;

  perform public._csp_audit(v_uid, 'platform_admin',
    case when v_created then 'sales_product_created' else 'sales_product_updated' end,
    'csp_sales_products', v_prod.id,
    jsonb_build_object(
      'product_key', v_key,
      'amount', v_amount,
      'currency', v_currency,
      'publish_sale', v_prod.publish_sale,
      'published', v_prod.published,
      'publish_app', v_prod.publish_app,
      'rate_version_id', v_rate_id
    ));

  return jsonb_build_object(
    'found', true, 'created', v_created,
    'product', jsonb_build_object(
      'id', v_prod.id,
      'product_key', v_prod.product_key,
      'fixed_commission_amount', v_prod.fixed_commission_amount,
      'currency', v_prod.currency,
      'published', v_prod.published,
      'publish_sale', v_prod.publish_sale,
      'publish_app', v_prod.publish_app,
      'master_active', v_prod.master_active,
      'sku', v_prod.sku
    ),
    'rate_version_id', v_rate_id
  );
end;
$$;

revoke all on function public.csp_upsert_sales_product(jsonb) from public, anon, authenticated, service_role;
grant execute on function public.csp_upsert_sales_product(jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- Platform overview: include products[] with dual-channel flags.
-- ---------------------------------------------------------------------------
create or replace function public.csp_get_platform_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or not coalesce(public.is_platform_admin(), false) then
    return jsonb_build_object('found', false, 'error', 'forbidden');
  end if;

  return jsonb_build_object(
    'found', true,
    'channel_schema', true,
    'partners_by_status', coalesce((
      select jsonb_object_agg(s.status, s.n)
      from (select status, count(*) as n from public.csp_partner_profiles group by status) s
    ), '{}'::jsonb),
    'partners_total', (select count(*) from public.csp_partner_profiles),
    'products_total', (select count(*) from public.csp_sales_products),
    'products_published', (select count(*) from public.csp_sales_products where publish_sale),
    'products_app_published', (select count(*) from public.csp_sales_products where publish_app),
    'open_settlements', jsonb_build_object(
      'count', (select count(*) from public.csp_monthly_settlements where status = 'open'),
      'by_currency', coalesce((
        select jsonb_object_agg(s.currency, s.total)
        from (
          select currency, sum(total_amount) as total
          from public.csp_monthly_settlements
          where status = 'open'
          group by currency
        ) s
      ), '{}'::jsonb)
    ),
    'unpaid_settlements_count', (
      select count(*) from public.csp_monthly_settlements where status in ('open','approved','closed')
    ),
    'products', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id,
        'product_key', p.product_key,
        'sku', p.sku,
        'currency', p.currency,
        'fixed_commission_amount', p.fixed_commission_amount,
        'published', p.published,
        'publish_sale', p.publish_sale,
        'publish_app', p.publish_app,
        'master_active', p.master_active,
        'commission_model', p.commission_model,
        'updated_at', p.updated_at
      ) order by p.product_key)
      from public.csp_sales_products p
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.csp_get_platform_overview() from public, anon, authenticated, service_role;
grant execute on function public.csp_get_platform_overview() to authenticated;

-- ---------------------------------------------------------------------------
-- Platform: set independent channel flags (no commission mutation).
-- ---------------------------------------------------------------------------
create or replace function public.csp_set_product_channel_flags(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_id uuid;
  v_key text;
  v_prod public.csp_sales_products%rowtype;
  v_app boolean;
  v_sale boolean;
  v_master boolean;
begin
  if v_uid is null or not coalesce(public.is_platform_admin(), false) then
    return jsonb_build_object('found', false, 'error', 'forbidden');
  end if;
  if jsonb_typeof(p_payload) is distinct from 'object' then
    return jsonb_build_object('found', false, 'error', 'invalid_payload');
  end if;

  v_key := lower(btrim(coalesce(p_payload ->> 'product_key', p_payload ->> 'productKey', '')));
  begin
    v_id := nullif(btrim(coalesce(p_payload ->> 'product_id', p_payload ->> 'productId', '')), '')::uuid;
  exception when others then
    return jsonb_build_object('found', false, 'error', 'product_id_invalid');
  end;

  if v_id is not null then
    select * into v_prod from public.csp_sales_products where id = v_id for update;
  elsif v_key <> '' then
    select * into v_prod from public.csp_sales_products where product_key = v_key for update;
  else
    return jsonb_build_object('found', false, 'error', 'product_required');
  end if;

  if not found then
    return jsonb_build_object('found', false, 'error', 'product_not_found');
  end if;

  if p_payload ? 'publish_app' or p_payload ? 'publishApp' then
    if jsonb_typeof(coalesce(p_payload -> 'publish_app', p_payload -> 'publishApp')) <> 'boolean' then
      return jsonb_build_object('found', false, 'error', 'publish_app_invalid');
    end if;
    v_app := coalesce((p_payload ->> 'publish_app')::boolean, (p_payload ->> 'publishApp')::boolean);
  end if;

  if p_payload ? 'publish_sale' or p_payload ? 'publishSale' then
    if jsonb_typeof(coalesce(p_payload -> 'publish_sale', p_payload -> 'publishSale')) <> 'boolean' then
      return jsonb_build_object('found', false, 'error', 'publish_sale_invalid');
    end if;
    v_sale := coalesce((p_payload ->> 'publish_sale')::boolean, (p_payload ->> 'publishSale')::boolean);
  elsif p_payload ? 'published' then
    if jsonb_typeof(p_payload -> 'published') <> 'boolean' then
      return jsonb_build_object('found', false, 'error', 'published_invalid');
    end if;
    v_sale := (p_payload ->> 'published')::boolean;
  end if;

  if p_payload ? 'master_active' or p_payload ? 'masterActive' then
    if jsonb_typeof(coalesce(p_payload -> 'master_active', p_payload -> 'masterActive')) <> 'boolean' then
      return jsonb_build_object('found', false, 'error', 'master_active_invalid');
    end if;
    v_master := coalesce((p_payload ->> 'master_active')::boolean, (p_payload ->> 'masterActive')::boolean);
  end if;

  update public.csp_sales_products
  set publish_app = coalesce(v_app, publish_app),
      publish_sale = coalesce(v_sale, publish_sale),
      master_active = coalesce(v_master, master_active),
      updated_at = now()
  where id = v_prod.id
  returning * into v_prod;

  perform public._csp_audit(v_uid, 'platform_admin', 'product_channel_flags_updated',
    'csp_sales_products', v_prod.id,
    jsonb_build_object(
      'product_key', v_prod.product_key,
      'publish_app', v_prod.publish_app,
      'publish_sale', v_prod.publish_sale,
      'published', v_prod.published,
      'master_active', v_prod.master_active
    ));

  return jsonb_build_object(
    'found', true,
    'product', jsonb_build_object(
      'id', v_prod.id,
      'product_key', v_prod.product_key,
      'published', v_prod.published,
      'publish_sale', v_prod.publish_sale,
      'publish_app', v_prod.publish_app,
      'master_active', v_prod.master_active
    )
  );
end;
$$;

revoke all on function public.csp_set_product_channel_flags(jsonb) from public, anon, authenticated, service_role;
grant execute on function public.csp_set_product_channel_flags(jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- APP store: published APP products only. No commission / partner internals.
-- ---------------------------------------------------------------------------
create or replace function public.csp_list_app_store_products()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return jsonb_build_object('found', false, 'error', 'unauthorized');
  end if;

  -- Fail closed if channel schema missing (Production until schema applied).
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'csp_sales_products' and column_name = 'publish_app'
  ) then
    return jsonb_build_object('found', false, 'error', 'channel_schema_missing', 'channel_schema', false);
  end if;

  return jsonb_build_object(
    'found', true,
    'channel_schema', true,
    'products', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id,
        'product_key', p.product_key,
        'sku', p.sku,
        'publish_app', p.publish_app,
        'master_active', p.master_active,
        'updated_at', p.updated_at
      ) order by p.product_key)
      from public.csp_sales_products p
      where p.publish_app = true
        and p.master_active = true
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.csp_list_app_store_products() from public, anon, authenticated, service_role;
grant execute on function public.csp_list_app_store_products() to authenticated;

commit;

-- ROLLBACK PLAN (manual):
-- drop function if exists public.csp_list_app_store_products();
-- drop function if exists public.csp_set_product_channel_flags(jsonb);
-- restore prior csp_upsert_sales_product / csp_get_platform_overview from migration 20261941100000
-- restore trg_csp_sales_products_sync_published from channel schema candidate
-- drop function if exists public._csp_sync_sale_publish_flags();
