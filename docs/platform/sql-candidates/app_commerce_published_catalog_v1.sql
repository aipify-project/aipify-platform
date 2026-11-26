-- PREPARED_ONLY — do not apply until exact owner Staging/Production approval.
-- AIPIFY APP COMMERCE V1 — published catalog read contract
-- Provides get_app_commerce_published_catalog() for APP storefront / checkout binding.
-- Does NOT invent prices. Empty offers until Platform publishes rows.
-- Does NOT enable Production checkout. Does NOT create Stripe products/prices.
-- Compatible with Sellers Admin product editors (consume; do not compete).

create table if not exists public.app_commerce_published_offers (
  id uuid primary key default gen_random_uuid(),
  offer_id text not null unique,
  product_key text not null,
  category_id text not null default 'other',
  title text,
  description text,
  image_path text,
  features jsonb not null default '[]'::jsonb,
  amount numeric(12,2) not null check (amount >= 0),
  currency char(3) not null,
  billing_interval text not null check (billing_interval in ('month', 'year')),
  market_code text not null default 'DEFAULT',
  stripe_price_id text,
  trial_days integer not null default 0 check (trial_days >= 0),
  publication_status text not null default 'draft'
    check (publication_status in ('draft', 'published', 'unpublished')),
  purchasable boolean not null default false,
  locales jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_commerce_published_offers_product_idx
  on public.app_commerce_published_offers (product_key, publication_status);

revoke all on table public.app_commerce_published_offers from public, anon, authenticated;

create or replace function public.get_app_commerce_published_catalog()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant uuid;
begin
  v_tenant := public._presence_tenant_for_auth();
  if v_tenant is null then
    raise exception 'unauthorized';
  end if;

  return (
    select jsonb_build_object(
      'products',
      coalesce(
        jsonb_agg(
          jsonb_build_object(
            'id', x.product_key,
            'product_key', x.product_key,
            'category', x.category_id,
            'name', x.title,
            'description', x.description,
            'image_path', x.image_path,
            'features', x.features,
            'published', true,
            'publication_status', 'published',
            'purchasable', x.purchasable,
            'monthly', x.monthly,
            'annual', x.annual
          )
          order by x.product_key
        ),
        '[]'::jsonb
      )
    )
    from (
      select
        o.product_key,
        max(o.category_id) as category_id,
        max(o.title) as title,
        max(o.description) as description,
        max(o.image_path) as image_path,
        coalesce(
          (
            select f.features
            from public.app_commerce_published_offers f
            where f.product_key = o.product_key
              and f.publication_status = 'published'
            order by f.updated_at desc
            limit 1
          ),
          '[]'::jsonb
        ) as features,
        bool_or(o.purchasable) as purchasable,
        (
          select jsonb_build_object(
            'offer_id', m.offer_id,
            'amount', m.amount,
            'currency', m.currency,
            'interval', 'month',
            'market', m.market_code,
            'stripe_price_id', m.stripe_price_id,
            'trial_days', m.trial_days,
            'price_status', 'published'
          )
          from public.app_commerce_published_offers m
          where m.product_key = o.product_key
            and m.publication_status = 'published'
            and m.billing_interval = 'month'
          order by m.updated_at desc
          limit 1
        ) as monthly,
        (
          select jsonb_build_object(
            'offer_id', y.offer_id,
            'amount', y.amount,
            'currency', y.currency,
            'interval', 'year',
            'market', y.market_code,
            'stripe_price_id', y.stripe_price_id,
            'trial_days', y.trial_days,
            'price_status', 'published'
          )
          from public.app_commerce_published_offers y
          where y.product_key = o.product_key
            and y.publication_status = 'published'
            and y.billing_interval = 'year'
          order by y.updated_at desc
          limit 1
        ) as annual
      from public.app_commerce_published_offers o
      where o.publication_status = 'published'
      group by o.product_key
    ) x
  );
end;
$$;

revoke all on function public.get_app_commerce_published_catalog() from public, anon;
grant execute on function public.get_app_commerce_published_catalog() to authenticated, service_role;
