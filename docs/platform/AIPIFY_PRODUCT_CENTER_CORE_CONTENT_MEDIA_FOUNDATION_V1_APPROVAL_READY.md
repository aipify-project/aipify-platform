# AIPIFY_PRODUCT_CENTER_CORE_CONTENT_MEDIA_FOUNDATION_V1 — APPROVAL_READY

**Status:** `APPROVAL_READY` — AUTHORING ONLY  
**Date:** 2026-11-28  
**Agent:** Agent 2  
**Do not apply** without exact owner YES naming this document, the SQL path, its SHA256, and the target environment (Staging then Production).

## Authoritative SQL candidate (locale + media RPCs)

| Field | Value |
|---|---|
| **Path** | `docs/platform/sql-candidates/csp_product_locale_media_foundation_v1.sql` |
| **SHA256** | `e71b53efd593a047db9ac842997314071cf75a5d1d10ce196aafe78f9bf0b1a8` *(recompute before apply — pin file must match)* |
| **Local validate** | disposable Postgres 16: harness → candidate → assertions = **PASS** |
| **Pin file** | `docs/platform/sql-candidates/csp_product_locale_media_foundation_v1.sql.sha256` |

### Prerequisites (ALREADY_APPLIED_VERIFIED — do not re-apply)

| Object | Staging `auedugihkduoaikfusqe` | Production `qbcqoixhrvhnuwphefvw` |
|---|---|---|
| `csp_sales_products.logo_path` / `hero_path` | present | present |
| `public.csp_product_locale_copy` | present | present |
| Locale / media writer-reader RPCs (this candidate) | **absent** | **absent** |
| Product-media storage bucket | **absent** | **absent** |

### Effects when applied

| Object | Action |
|---|---|
| `csp_product_locale_copy.benefits` | ADD COLUMN IF NOT EXISTS (jsonb array) |
| `csp_upsert_product_locale_copy(jsonb)` | CREATE — Platform Admin draft/approved upsert (default draft) |
| `csp_list_product_locale_copy(text)` | CREATE — Platform Admin list all locales for a product |
| `csp_get_approved_product_content(text, text, text)` | CREATE — channel-filtered approved read (`app` \| `sale`) |
| `csp_list_approved_product_content(text, text)` | CREATE — channel-filtered approved list |
| `csp_set_product_media_paths(jsonb)` | CREATE — Platform Admin path setter (no upload) |
| `csp_list_app_store_products()` | REPLACE — enrich `logo_path` / `hero_path`; preserve taxonomy when columns exist |

### Non-effects

- No backfill of locale rows or media paths  
- No `publish_app` / `publish_sale` / `master_active` flips  
- No storage bucket or storage.objects policies (separate candidate)  
- No variant / commission / Stripe / checkout / entitlement writes  
- No anon table grants; no `service_role` execute on new RPCs  

### Grants / RLS

- Table `csp_product_locale_copy`: `REVOKE ALL` from `public, anon, authenticated`  
- New/replaced functions: `REVOKE ALL` from `public, anon, authenticated, service_role` then `GRANT EXECUTE` to `authenticated` only  
- Writers require `is_platform_admin()`; channel reads require session + channel listing flags  

### Fallback (application layer — never invent Core text)

1. Requested locale approved copy  
2. `en` then `no` approved copy  
3. Registry presentation (Kompis Nordic / Buddy other) via existing APP/Partner VMs  
4. Missing media paths → registry brand marks  

### Install order

1. Owner YES on this SHA → Staging `auedugihkduoaikfusqe`  
2. Pre-check: locale table + logo/hero columns; RPCs absent  
3. Apply this file; post-check RPCs + grants  
4. Separate owner YES → Production `qbcqoixhrvhnuwphefvw`  
5. Storage: separate YES on `NOT_APPLIED_csp_product_media_storage_v1.sql` (below)  

### Rollback (manual)

```sql
drop function if exists public.csp_upsert_product_locale_copy(jsonb);
drop function if exists public.csp_list_product_locale_copy(text);
drop function if exists public.csp_get_approved_product_content(text, text, text);
drop function if exists public.csp_list_approved_product_content(text, text);
drop function if exists public.csp_set_product_media_paths(jsonb);
-- restore prior csp_list_app_store_products from dependency foundation / channel RPC
alter table public.csp_product_locale_copy drop column if exists benefits;
```

### Exact Staging approval sentence (copy/paste)

I approve a single Staging-only apply of exactly  
`docs/platform/sql-candidates/csp_product_locale_media_foundation_v1.sql`  
SHA256 `<paste current pin from .sha256>`  
to Supabase project aipify-core-staging (`auedugihkduoaikfusqe`).  
No Production apply. No storage policies. No publish flips. No Stripe. No secrets. One controlled apply after preflight; stop on any mismatch.

### Exact Production approval sentence (after Staging verified)

I approve a single Production apply of exactly  
`docs/platform/sql-candidates/csp_product_locale_media_foundation_v1.sql`  
SHA256 `<same pin verified on Staging>`  
to Supabase project aipify-core (`qbcqoixhrvhnuwphefvw`).  
No storage policies in this apply. No publish flips. No Stripe. No secrets.

---

## SEPARATE storage candidate (NOT_APPLIED)

| Field | Value |
|---|---|
| **Path** | `docs/platform/sql-candidates/NOT_APPLIED_csp_product_media_storage_v1.sql` |
| **SHA256** | `ebbaa026094dfe8f3e48ede50df8a00afc1d6ddbce18944184a8134969eb673a` |
| **Bucket** | `csp-product-media` |
| **Status** | **NOT_APPLIED** — requires **separate** storage-policy YES |

Reuse existing storage where possible was evaluated: no product-media bucket exists on Staging/Production. This candidate documents public-read / Platform-Admin-write policies, MIME/size limits, and lifecycle. No public write. No secrets. No service-role client exposure.

---

## Application contract (repo — no merge/deploy required for SQL approval)

| Path | Role |
|---|---|
| `lib/product-catalog/locale-media-core.ts` | Shared locale/media RPC names, parsers, APP/Partner presentation overlay |
| `lib/product-catalog/locale-media-core.test.ts` | Unit tests |
| `lib/product-catalog/locale-media-sql-contract.test.ts` | SQL candidate contract + SHA report |
| `lib/product-catalog/index.ts` | Exports |
| `lib/product-catalog/field-ownership.ts` | Notes: locale/media RPCs APPROVAL_READY; storage separate |

APP: no commission fields; checkout remain fail-closed. Partner: Info/Del reuse via existing PremiumProductCatalogCard modes. Width 1560 unchanged. Agent 1 variant/commission surfaces untouched.

## Auth E2E

**BLOCKED** without authorized Platform Admin session (`APP_LIVE_E2E` / Production test account). Unauth taxonomy/content APIs remain 401.

## STOP

No Staging/Production SQL apply in this authoring task. No storage apply. No uploads. No data writes. No secrets. No publish flips. No Stripe. No feature gates. No merge/deploy required to mark APPROVAL_READY — push/PR for review only.
