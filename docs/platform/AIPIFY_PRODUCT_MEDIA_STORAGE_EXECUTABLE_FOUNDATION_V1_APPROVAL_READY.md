# AIPIFY_PRODUCT_MEDIA_STORAGE_EXECUTABLE_FOUNDATION_V1 — APPROVAL_READY

**Status:** `APPROVAL_READY` — AUTHORING ONLY  
**Date:** 2026-11-28  
**Agent:** Agent 2  
**Do not apply** without exact owner YES naming this document, the SQL path, its SHA256, and Staging (then later Production).

## Why a new file

| Item | Value |
|---|---|
| Prior stub | `NOT_APPLIED_csp_product_media_storage_v1.sql` |
| Stub SHA-256 | `ebbaa026094dfe8f3e48ede50df8a00afc1d6ddbce18944184a8134969eb673a` |
| Stub status | Documentation only — **do not modify or apply** |
| This candidate | Executable bucket + RLS policies |

## Authoritative SQL candidate

| Field | Value |
|---|---|
| **Path** | `docs/platform/sql-candidates/csp_product_media_storage_executable_v1.sql` |
| **SHA256** | `dc98319411c23760f5e4d382957490c59a5a5d4b29f708586ab7623751412a07` |
| **Pin** | `docs/platform/sql-candidates/csp_product_media_storage_executable_v1.sql.sha256` |
| **Local validate** | disposable Postgres 16 + Storage schema harness → assertions **PASS** (policy evaluation; not live Storage upload runtime) |

## Security model

| Control | Behavior |
|---|---|
| Bucket | `csp-product-media`, **private** |
| Size | 2 MiB (`2097152`) |
| MIME | `image/png`, `image/jpeg`, `image/webp` only (**no SVG**) |
| Path | `products/{product_key}/{logo\|hero}/{id}.{ext}` — product must exist |
| Write | Platform Admin (`is_platform_admin()`) insert/update only |
| Delete | **No** authenticated/anon DELETE policy (no auto-delete; supersede by new key + path RPC) |
| Read | Admin: valid paths. Others: only **registered** `logo_path`/`hero_path` on APP- or SALE-listed products |
| anon | No write/select policies |
| Listing | No open bucket list — SELECT constrained by path readability |

## SQL vs upload API

**SQL alone:** bucket, MIME/size, RLS path/admin/channel gates.  
**Requires upload API (not activated here):** signed upload/download URLs, magic-byte sniff, commit → `csp_set_product_media_paths`, actor audit. Contract: `lib/product-catalog/product-media-storage-contract.ts`.

## Staging pre / post plan (after separate YES)

**Project:** `auedugihkduoaikfusqe` (`aipify-core-staging`)

| Check | Expected BEFORE | Expected AFTER |
|---|---|---|
| Bucket `csp-product-media` | absent (Staging bucket_count was 0) | present, private, 2MiB, raster MIME |
| Related policies | none | 4 policies (2 select, insert, update); no delete |
| Products / commissions / publish flags | unchanged | unchanged |
| logo_path / hero_path | unchanged | unchanged |
| Locale/media RPCs | already APPLIED_VERIFIED | untouched |

## Production

Requires a **separate** exact YES after Staging verification. Not authorized by this document.

## Rollback (do not run without YES)

```sql
drop policy if exists csp_product_media_select_admin on storage.objects;
drop policy if exists csp_product_media_select_channel_registered on storage.objects;
drop policy if exists csp_product_media_insert_admin on storage.objects;
drop policy if exists csp_product_media_update_admin on storage.objects;
drop function if exists public._csp_product_media_object_readable(text);
drop function if exists public._csp_product_media_path_ok(text);
-- optional: delete from storage.buckets where id = 'csp-product-media';
```

## Exact Staging approval sentence (copy/paste)

I approve a single Staging-only apply of exactly  
`docs/platform/sql-candidates/csp_product_media_storage_executable_v1.sql`  
SHA256 `dc98319411c23760f5e4d382957490c59a5a5d4b29f708586ab7623751412a07`  
to Supabase project aipify-core-staging (`auedugihkduoaikfusqe`).  
No Production apply. No upload API activation. No product/publish/media path data changes. No Stripe. No secrets. One controlled apply after preflight; stop on any mismatch.

## Tested vs blocked

| Test | Result |
|---|---|
| Local path validation / admin vs non-admin / anon / bad path / SVG MIME / unknown product / no client delete | **PASS** (Postgres + RLS harness) |
| Unit + SQL contract (`product-media-storage-contract.test.ts`) | **PASS** |
| Live Supabase Storage upload/signed-URL runtime | **BLOCKED** (not claimed PASS) |
| Authorized Platform Admin upload/readback session | **BLOCKED** (no credentials) |

## STOP

No Staging/Production apply in this authoring task. No merge/deploy of upload activation. Agent 1 variant/commission untouched. APP width 1560 unchanged.
