# UNIFIED PRODUCT CATALOG — dual channel + percent commission (SQL candidate)

**Status:** `PREPARED_OWNER_SECURITY_APPROVAL_REQUIRED`  
**Date:** 2026-11-26  
**Do not apply** without exact owner approval naming this document.

## Why

Today:
- `csp_sales_products` stores `product_key`, fixed commission, currency, `published` (SALE-ish only).
- Title/i18n/media/APP publish flags are **not** persisted (title accepted and ignored by Core).
- Percent commission is **not** in Core; historical settlements assume fixed NOK.

## Minimal additive schema (proposal)

```sql
-- CANDIDATE ONLY — not applied
alter table public.csp_sales_products
  add column if not exists sku text,
  add column if not exists master_active boolean not null default true,
  add column if not exists publish_app boolean not null default false,
  add column if not exists publish_sale boolean not null default false,
  add column if not exists commission_model text not null default 'fixed'
    check (commission_model in ('fixed', 'percent')),
  add column if not exists percent_rate numeric(5,2),
  add column if not exists percent_basis text,
  add column if not exists logo_path text,
  add column if not exists hero_path text;

-- Localised copy (approved per locale; missing = not publication-ready)
create table if not exists public.csp_product_locale_copy (
  product_id uuid not null references public.csp_sales_products(id),
  locale text not null check (locale in ('en','no','sv','da','pl','uk','es')),
  title text not null,
  tagline text,
  description text not null,
  approved boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (product_id, locale)
);
```

Backfill: `publish_sale = published`; `publish_app = false` until admin opts in.  
Keep `published` as deprecated alias of `publish_sale` during transition.

## RLS / security

- Platform admin RPCs only for write.
- Partners read SALE-published + approved locale only.
- APP customers read APP-published only via tenant-scoped RPC — never CSP admin tables.
- Never auto-grant entitlement on publish.

## Percent commission

Only activate `commission_model = 'percent'` after:
1. Explicit basis (ex VAT / incl VAT / after discount) documented.
2. Settlement engine accepts percent without rewriting historical fixed lines.
3. Owner approval of rate changes + audit.

Until then UI must show **Prosent – krever backend-godkjenning**.

## Rollback

Drop new columns/tables only after confirming no Production writes; prefer feature-flag RPCs first.

## Hash placeholder

Generate SHA-256 of the final `.sql` file when owner authorises drafting the migration under `docs/platform/sql-candidates/`.
