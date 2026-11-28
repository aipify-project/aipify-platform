-- Disposable local harness for app_store_product_dependency_core_foundation_v1.sql
-- Not for Staging/Production. Minimal stub of channel-era csp_sales_products.

begin;

create schema if not exists public;
create schema if not exists auth;

-- Supabase roles required by revoke/grant lines in the candidate
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then
    create role service_role nologin bypassrls;
  end if;
end $$;

create or replace function auth.uid()
returns uuid
language sql
stable
as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
as $$ select coalesce(current_setting('app.is_platform_admin', true), 'false')::boolean $$;

create table if not exists public.csp_sales_products (
  id uuid primary key default gen_random_uuid(),
  product_key text not null unique check (length(btrim(product_key)) > 0),
  sku text,
  fixed_commission_amount numeric(12,2) not null default 0,
  currency text not null default 'NOK',
  published boolean not null default false,
  publish_app boolean not null default false,
  publish_sale boolean not null default false,
  master_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.csp_sales_products enable row level security;
alter table public.csp_sales_products force row level security;

insert into public.csp_sales_products (product_key, publish_app, master_active)
values
  ('kompis_web', true, true),
  ('kompis_bedrift', true, true),
  ('design_pack', true, true)
on conflict (product_key) do nothing;

-- Stub prior list RPC (Staging shape) so replace path is exercised
create or replace function public.csp_list_app_store_products()
returns jsonb
language sql
stable
as $$
  select jsonb_build_object('found', true, 'legacy', true, 'products', '[]'::jsonb);
$$;

commit;
