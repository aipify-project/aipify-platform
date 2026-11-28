-- PREPARED_ONLY — AUTHORING COMPLETE — DO NOT APPLY without exact owner YES
-- naming this file, its SHA256, and the target environment (Staging then Production).
--
-- Job: AIPIFY_APP_PRODUCT_DEPENDENCY_CORE_FOUNDATION_V1
-- Supersedes sketch (keep file): app_store_product_category_type_dependency_v1.sql
--   prior SHA256: dfe390bf5a07f0e33e9f2360043f6ee04fe3e7a7ca9bab5ef4f62885cbe5c83c
--
-- Authoritative register: public.csp_sales_products ONLY.
-- Depends on (already present Staging + Production per preflight):
--   publish_app, publish_sale, master_active, product_key on csp_sales_products
--   RLS enabled+forced; no anon/authenticated table grants
--
-- EFFECTS (when applied)
--   + columns: product_type, depends_on_product_keys, category_id
--   + validate trigger (keys exist, no self-ref, no cycles)
--   + replace/create csp_list_app_store_products() emitting taxonomy fields
--   + platform-admin setter csp_set_app_store_product_taxonomy(...)
--
-- NON-EFFECTS
--   No product/price/commission backfill or auto publish_app flips
--   No Stripe / checkout / entitlement table writes
--   No Agent 1 variant/commission object changes
--   No anon/authenticated table grants
--
-- CATEGORY SOURCE
--   No Core category table exists. APP taxonomy uses open text ids
--   (kompis, sales_growth, voice, addons, other, …) via resolveStoreCategoryId.
--   category_id is therefore text (validated format), nullable, NO FK.
--
-- DEPENDENCY SEMANTICS = ALL
--   Every key in depends_on_product_keys must be actively entitled in the same
--   authorized workspace before an addon may be purchased. Documented for the
--   later checkout gate; this SQL stores and validates graph shape only.
--
-- APPLY ORDER
--   1) Staging auedugihkduoaikfusqe — owner YES on this SHA
--   2) Pre-check: columns absent; publish_app present; RLS on
--   3) Apply this file
--   4) Post-check: columns present; list RPC returns new keys; grants authenticated EXECUTE only
--   5) Separate Production qbcqoixhrvhnuwphefvw owner YES + apply (RPC currently missing there)
--
-- ROLLBACK (manual, history-safe preference = stop using columns / restore prior RPC)
--   drop trigger if exists trg_csp_sales_products_dependency_validate on public.csp_sales_products;
--   drop function if exists public._csp_validate_product_dependencies();
--   drop function if exists public._csp_product_dependency_has_cycle(text, text[]);
--   drop function if exists public.csp_set_app_store_product_taxonomy(text, text, text, text[]);
--   -- restore prior csp_list_app_store_products body from unified_product_catalog_channel_rpc_v1
--   --   or drop on Production if it did not exist before
--   alter table public.csp_sales_products
--     drop column if exists product_type,
--     drop column if exists depends_on_product_keys,
--     drop column if exists category_id;
--
-- Out of scope: Stripe, live checkout path, Product Center UI, Sales Partner migration.

begin;

-- ---------------------------------------------------------------------------
-- Guard: channel columns must exist
-- ---------------------------------------------------------------------------
do $$
begin
  if to_regclass('public.csp_sales_products') is null then
    raise exception 'app_store_product_dependency_core_foundation_v1 requires public.csp_sales_products';
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'csp_sales_products' and column_name = 'publish_app'
  ) then
    raise exception 'app_store_product_dependency_core_foundation_v1 requires publish_app column';
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'csp_sales_products' and column_name = 'master_active'
  ) then
    raise exception 'app_store_product_dependency_core_foundation_v1 requires master_active column';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Additive taxonomy / dependency columns (compatible null/empty defaults)
-- ---------------------------------------------------------------------------
alter table public.csp_sales_products
  add column if not exists product_type text,
  add column if not exists depends_on_product_keys text[] not null default '{}'::text[],
  add column if not exists category_id text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'csp_sales_products_product_type_check'
      and conrelid = 'public.csp_sales_products'::regclass
  ) then
    alter table public.csp_sales_products
      add constraint csp_sales_products_product_type_check
      check (
        product_type is null
        or product_type in ('primary', 'addon', 'voice', 'sales_growth', 'other')
      );
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'csp_sales_products_category_id_check'
      and conrelid = 'public.csp_sales_products'::regclass
  ) then
    alter table public.csp_sales_products
      add constraint csp_sales_products_category_id_check
      check (
        category_id is null
        or category_id ~ '^[a-z0-9_]{1,40}$'
      );
  end if;
end $$;

comment on column public.csp_sales_products.product_type is
  'APP store product class: primary | addon | voice | sales_growth | other. Null = unset (fail-closed for addon purchase gates).';
comment on column public.csp_sales_products.depends_on_product_keys is
  'ALL-semantics dependency list of product_key values on csp_sales_products. Empty = no declared deps.';
comment on column public.csp_sales_products.category_id is
  'Open APP store category id (text). No Core category table / FK — display via i18n.';

-- ---------------------------------------------------------------------------
-- Dependency graph helpers
-- ---------------------------------------------------------------------------
create or replace function public._csp_normalize_product_dependency_keys(p_keys text[])
returns text[]
language sql
immutable
as $$
  select coalesce(
    (
      select array_agg(k order by k)
      from (
        select distinct lower(trim(x)) as k
        from unnest(coalesce(p_keys, '{}'::text[])) as u(x)
        where trim(coalesce(x, '')) <> ''
      ) d
      where k ~ '^[a-z0-9_-]{1,64}$'
    ),
    '{}'::text[]
  );
$$;

create or replace function public._csp_product_dependency_has_cycle(
  p_product_key text,
  p_depends_on text[]
)
returns boolean
language plpgsql
stable
set search_path = public
as $$
declare
  v_key text := lower(trim(coalesce(p_product_key, '')));
  v_stack text[] := array[v_key];
  v_seen text[] := array[v_key];
  v_current text;
  v_next text;
  v_deps text[];
begin
  if v_key = '' then
    return false;
  end if;

  while cardinality(v_stack) > 0 loop
    v_current := v_stack[cardinality(v_stack)];
    v_stack := v_stack[1:cardinality(v_stack) - 1];

    if v_current = v_key then
      v_deps := public._csp_normalize_product_dependency_keys(p_depends_on);
    else
      select public._csp_normalize_product_dependency_keys(s.depends_on_product_keys)
        into v_deps
      from public.csp_sales_products s
      where s.product_key = v_current;
      v_deps := coalesce(v_deps, '{}'::text[]);
    end if;

    foreach v_next in array v_deps loop
      if v_next = v_key then
        return true;
      end if;
      if not (v_next = any (v_seen)) then
        v_seen := v_seen || v_next;
        v_stack := v_stack || v_next;
      end if;
    end loop;
  end loop;

  return false;
end;
$$;

create or replace function public._csp_validate_product_dependencies()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_keys text[];
  v_key text;
  v_missing text;
begin
  new.product_key := lower(trim(new.product_key));
  if new.category_id is not null then
    new.category_id := lower(trim(new.category_id));
  end if;
  if new.product_type is not null then
    new.product_type := lower(trim(new.product_type));
  end if;

  new.depends_on_product_keys :=
    public._csp_normalize_product_dependency_keys(new.depends_on_product_keys);
  v_keys := new.depends_on_product_keys;

  if new.product_key = any (v_keys) then
    raise exception 'csp_sales_products depends_on cannot include self (%)', new.product_key;
  end if;

  foreach v_key in array v_keys loop
    -- Dependency targets must already exist in the authoritative register.
    -- (Self is already rejected above; INSERT row is not a valid dependency target.)
    if not exists (
      select 1 from public.csp_sales_products s where s.product_key = v_key
    ) then
      v_missing := v_key;
      raise exception 'csp_sales_products depends_on unknown product_key: %', v_missing;
    end if;
  end loop;

  if public._csp_product_dependency_has_cycle(new.product_key, v_keys) then
    raise exception 'csp_sales_products depends_on cycle detected for %', new.product_key;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_csp_sales_products_dependency_validate on public.csp_sales_products;
create trigger trg_csp_sales_products_dependency_validate
before insert or update of product_key, product_type, category_id, depends_on_product_keys
on public.csp_sales_products
for each row
execute function public._csp_validate_product_dependencies();

-- ---------------------------------------------------------------------------
-- APP store list RPC — create or replace (Production currently missing)
-- Auth: authenticated session only. Payload: no commission / no prices.
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

  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'csp_sales_products' and column_name = 'publish_app'
  ) then
    return jsonb_build_object('found', false, 'error', 'channel_schema_missing', 'channel_schema', false);
  end if;

  return jsonb_build_object(
    'found', true,
    'channel_schema', true,
    'dependency_semantics', 'all',
    'products', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id,
        'product_key', p.product_key,
        'sku', p.sku,
        'publish_app', p.publish_app,
        'master_active', p.master_active,
        'product_type', p.product_type,
        'category_id', p.category_id,
        'category', p.category_id,
        'depends_on_product_keys', p.depends_on_product_keys,
        'depends_on', p.depends_on_product_keys,
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

-- ---------------------------------------------------------------------------
-- Platform-admin taxonomy setter (Product Center will call later — not APP)
-- ---------------------------------------------------------------------------
create or replace function public.csp_set_app_store_product_taxonomy(
  p_product_key text,
  p_product_type text default null,
  p_category_id text default null,
  p_depends_on_product_keys text[] default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_key text := lower(trim(coalesce(p_product_key, '')));
  v_prod public.csp_sales_products%rowtype;
begin
  if v_uid is null or not coalesce(public.is_platform_admin(), false) then
    return jsonb_build_object('found', false, 'error', 'forbidden');
  end if;
  if v_key = '' or v_key !~ '^[a-z0-9_-]{1,64}$' then
    return jsonb_build_object('found', false, 'error', 'product_key_invalid');
  end if;

  select * into v_prod from public.csp_sales_products where product_key = v_key for update;
  if not found then
    return jsonb_build_object('found', false, 'error', 'not_found');
  end if;

  update public.csp_sales_products
  set
    product_type = case
      when p_product_type is null then product_type
      when trim(p_product_type) = '' then null
      else lower(trim(p_product_type))
    end,
    category_id = case
      when p_category_id is null then category_id
      when trim(p_category_id) = '' then null
      else lower(trim(p_category_id))
    end,
    depends_on_product_keys = case
      when p_depends_on_product_keys is null then depends_on_product_keys
      else public._csp_normalize_product_dependency_keys(p_depends_on_product_keys)
    end,
    updated_at = now()
  where product_key = v_key
  returning * into v_prod;

  return jsonb_build_object(
    'found', true,
    'product', jsonb_build_object(
      'id', v_prod.id,
      'product_key', v_prod.product_key,
      'product_type', v_prod.product_type,
      'category_id', v_prod.category_id,
      'depends_on_product_keys', v_prod.depends_on_product_keys,
      'publish_app', v_prod.publish_app,
      'master_active', v_prod.master_active
    )
  );
end;
$$;

revoke all on function public.csp_set_app_store_product_taxonomy(text, text, text, text[])
  from public, anon, authenticated, service_role;
grant execute on function public.csp_set_app_store_product_taxonomy(text, text, text, text[])
  to authenticated;

commit;

select 'PREPARED_ONLY_app_store_product_dependency_core_foundation_v1' as candidate_status;
