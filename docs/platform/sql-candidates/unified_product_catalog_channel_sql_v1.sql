-- UNIFIED PRODUCT CATALOG — APP/SALE channel persistence + percent commission scaffold
-- Status: CANDIDATE ONLY — DO NOT APPLY without exact owner approval naming this file.
-- Date: 2026-11-26
-- Related: docs/platform/UNIFIED_PRODUCT_CATALOG_CHANNEL_SQL_V1_CANDIDATE.md
--
-- Goals (minimal additive):
-- 1. Persist independent APP and SALE publish flags on csp_sales_products.
-- 2. Optional SKU / media paths for Platform register (no entitlement auto-grant).
-- 3. Scaffold percent commission columns WITHOUT activating settlement math.
-- 4. Locale-approved copy table for publication readiness.
--
-- Safety:
-- - Does not rewrite historical commission lines or settlements.
-- - Does not enable percent in RPCs until a separate owner-approved settlement contract.
-- - Backfill: publish_sale = published; publish_app = false (admin must opt in).
-- - Keep published as deprecated SALE alias during transition (sync trigger optional below).

begin;

alter table public.csp_sales_products
  add column if not exists sku text,
  add column if not exists master_active boolean not null default true,
  add column if not exists publish_app boolean not null default false,
  add column if not exists publish_sale boolean not null default false,
  add column if not exists commission_model text not null default 'fixed'
    check (commission_model in ('fixed', 'percent')),
  add column if not exists percent_rate numeric(5, 2)
    check (percent_rate is null or (percent_rate >= 0 and percent_rate <= 100)),
  add column if not exists percent_basis text
    check (
      percent_basis is null
      or percent_basis in (
        'net_ex_vat_after_discount',
        'gross_incl_vat_after_discount',
        'paid_amount_captured'
      )
    ),
  add column if not exists logo_path text,
  add column if not exists hero_path text;

-- Transition: mirror legacy SALE flag into publish_sale once; do not flip publish_app.
update public.csp_sales_products
set publish_sale = published
where publish_sale is distinct from published;

comment on column public.csp_sales_products.publish_app is
  'APP Store visibility. Independent of SALE. Default false until Platform opts in.';
comment on column public.csp_sales_products.publish_sale is
  'Sales Partner catalog visibility. Independent of APP. Backfilled from published.';
comment on column public.csp_sales_products.commission_model is
  'fixed is production. percent must remain unused until settlement contract is owner-approved.';
comment on column public.csp_sales_products.percent_basis is
  'Required when commission_model=percent. Defines money basis before rate is applied.';

create table if not exists public.csp_product_locale_copy (
  product_id uuid not null references public.csp_sales_products (id) on delete cascade,
  locale text not null check (locale in ('en', 'no', 'sv', 'da', 'pl', 'uk', 'es')),
  title text not null check (length(btrim(title)) > 0),
  tagline text,
  description text not null check (length(btrim(description)) > 0),
  approved boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (product_id, locale)
);

alter table public.csp_product_locale_copy enable row level security;

-- No direct grants: Platform/partner/APP access only via security definer RPCs (to be added in same approved migration batch).
revoke all on table public.csp_product_locale_copy from public, anon, authenticated;

-- Optional sync: keep legacy published aligned with publish_sale during transition.
create or replace function public._csp_sync_published_from_publish_sale()
returns trigger
language plpgsql
as $$
begin
  new.published := new.publish_sale;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_csp_sales_products_sync_published on public.csp_sales_products;
create trigger trg_csp_sales_products_sync_published
before insert or update of publish_sale on public.csp_sales_products
for each row
execute function public._csp_sync_published_from_publish_sale();

commit;

-- ROLLBACK PLAN (manual, after confirming no Production writes to new columns/tables):
-- drop trigger if exists trg_csp_sales_products_sync_published on public.csp_sales_products;
-- drop function if exists public._csp_sync_published_from_publish_sale();
-- drop table if exists public.csp_product_locale_copy;
-- alter table public.csp_sales_products drop column if exists sku, drop column if exists master_active,
--   drop column if exists publish_app, drop column if exists publish_sale, drop column if exists commission_model,
--   drop column if exists percent_rate, drop column if exists percent_basis, drop column if exists logo_path,
--   drop column if exists hero_path;
