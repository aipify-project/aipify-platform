-- PREPARED_ONLY — AUTHORING COMPLETE — DO NOT APPLY without exact owner YES
-- naming this file, its SHA256, and the target environment (Staging then Production).
--
-- Job: AIPIFY_PRODUCT_MEDIA_STORAGE_EXECUTABLE_FOUNDATION_V1
-- Replaces the documentation-only stub NOT_APPLIED_csp_product_media_storage_v1.sql
-- (SHA ebbaa026… — do not modify or re-apply that stub).
--
-- Depends on (already applied Core foundation):
--   public.is_platform_admin()
--   public.csp_sales_products (product_key, logo_path, hero_path, publish_app, publish_sale, master_active)
--   public.csp_set_product_media_paths(jsonb) — path registration after upload (RPC foundation)
--
-- EFFECTS
--   + private storage.buckets row: csp-product-media
--   + file_size_limit 2 MiB (2097152)
--   + allowed_mime_types raster only: image/png, image/jpeg, image/webp (no SVG)
--   + RLS policies: admin write/update/select; channel-gated select for registered paths
--   + helpers for path validation + readability
--
-- NON-EFFECTS
--   No anon write/select; no authenticated insert; no client DELETE policy
--   No automatic object deletion / lifecycle purge
--   No publish_app / publish_sale / media path backfill
--   No service_role client exposure; no secrets
--   Does not activate Product Center upload UI or Production upload routes
--
-- SQL vs UPLOAD API (API required for)
--   - Multipart upload / signed upload URL issuance
--   - Magic-byte / content sniffing beyond MIME header
--   - Idempotent replace orchestration (new object key → csp_set_product_media_paths)
--   - Consumer signed download URLs after channel authorization
--   - Audit of upload actor beyond storage.objects.owner
--
-- Path layout (product-bound)
--   products/{product_key}/{logo|hero}/{object_id}.{png|jpg|jpeg|webp}
--   product_key must exist on csp_sales_products
--
-- Read model
--   Platform admin: all objects in bucket
--   Other authenticated: only when object name equals registered logo_path or hero_path
--     AND product is listed on APP (publish_app + master_active) OR SALE (publish_sale)
--   anon: none
--
-- ROLLBACK (manual; separate YES)
--   drop policy if exists csp_product_media_select_admin on storage.objects;
--   drop policy if exists csp_product_media_select_channel_registered on storage.objects;
--   drop policy if exists csp_product_media_insert_admin on storage.objects;
--   drop policy if exists csp_product_media_update_admin on storage.objects;
--   drop function if exists public._csp_product_media_path_ok(text);
--   drop function if exists public._csp_product_media_object_readable(text);
--   -- bucket row: leave in place unless owner requests delete from storage.buckets

begin;

-- ---------------------------------------------------------------------------
-- Guards
-- ---------------------------------------------------------------------------
do $$
begin
  if to_regclass('storage.buckets') is null or to_regclass('storage.objects') is null then
    raise exception 'csp_product_media_storage_executable_v1 requires storage.buckets and storage.objects';
  end if;
  if to_regclass('public.csp_sales_products') is null then
    raise exception 'csp_product_media_storage_executable_v1 requires public.csp_sales_products';
  end if;
  if to_regprocedure('public.is_platform_admin()') is null then
    raise exception 'csp_product_media_storage_executable_v1 requires public.is_platform_admin()';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public._csp_product_media_path_ok(p_name text)
returns boolean
language plpgsql
immutable
as $$
declare
  v text := trim(coalesce(p_name, ''));
begin
  -- Exact product-bound layout; no leading slash; no traversal.
  if v = '' or position('..' in v) > 0 or v like '/%' then
    return false;
  end if;
  if char_length(v) > 512 then
    return false;
  end if;
  return v ~ '^products/[a-z0-9_-]{1,64}/(logo|hero)/[a-z0-9-]{8,64}\.(png|jpg|jpeg|webp)$';
end;
$$;

comment on function public._csp_product_media_path_ok(text) is
  'Validates csp-product-media object keys: products/{product_key}/{logo|hero}/{id}.{raster_ext}';

create or replace function public._csp_product_media_object_readable(p_name text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_key text;
  v_prod public.csp_sales_products%rowtype;
begin
  if auth.uid() is null then
    return false;
  end if;
  if coalesce(public.is_platform_admin(), false) then
    return public._csp_product_media_path_ok(p_name);
  end if;
  if not public._csp_product_media_path_ok(p_name) then
    return false;
  end if;

  v_key := split_part(p_name, '/', 2);
  select * into v_prod from public.csp_sales_products where product_key = v_key;
  if not found then
    return false;
  end if;

  -- Only currently registered paths (draft uploads stay invisible until path RPC).
  if p_name is distinct from v_prod.logo_path and p_name is distinct from v_prod.hero_path then
    return false;
  end if;

  -- Channel gate: APP or SALE listing (or both). Unpublished → not readable.
  if (v_prod.publish_app is true and v_prod.master_active is true)
     or (v_prod.publish_sale is true) then
    return true;
  end if;
  return false;
end;
$$;

comment on function public._csp_product_media_object_readable(text) is
  'True when caller may read a csp-product-media object: admin, or registered path on a channel-listed product.';

revoke all on function public._csp_product_media_path_ok(text)
  from public, anon, authenticated, service_role;
revoke all on function public._csp_product_media_object_readable(text)
  from public, anon, authenticated, service_role;
-- Invoked from RLS; keep execute for authenticated (policy evaluation) only.
grant execute on function public._csp_product_media_path_ok(text) to authenticated;
grant execute on function public._csp_product_media_object_readable(text) to authenticated;

-- ---------------------------------------------------------------------------
-- Bucket (private, raster MIME allowlist, 2 MiB)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'csp-product-media',
  'csp-product-media',
  false,
  2097152,
  array['image/png', 'image/jpeg', 'image/webp']::text[]
)
on conflict (id) do update
set
  name = excluded.name,
  public = false,
  file_size_limit = 2097152,
  allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp']::text[];

-- ---------------------------------------------------------------------------
-- Policies (least privilege)
-- ---------------------------------------------------------------------------
drop policy if exists csp_product_media_select_admin on storage.objects;
drop policy if exists csp_product_media_select_channel_registered on storage.objects;
drop policy if exists csp_product_media_insert_admin on storage.objects;
drop policy if exists csp_product_media_update_admin on storage.objects;
-- Intentionally no DELETE policy for anon/authenticated (no auto-delete; supersede by new key).

create policy csp_product_media_select_admin
on storage.objects
for select
to authenticated
using (
  bucket_id = 'csp-product-media'
  and coalesce(public.is_platform_admin(), false)
  and public._csp_product_media_path_ok(name)
);

create policy csp_product_media_select_channel_registered
on storage.objects
for select
to authenticated
using (
  bucket_id = 'csp-product-media'
  and public._csp_product_media_object_readable(name)
);

create policy csp_product_media_insert_admin
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'csp-product-media'
  and coalesce(public.is_platform_admin(), false)
  and public._csp_product_media_path_ok(name)
  and exists (
    select 1
    from public.csp_sales_products p
    where p.product_key = split_part(name, '/', 2)
  )
  and (
    metadata is null
    or coalesce(metadata->>'mimetype', metadata->>'mimeType', '') = ''
    or coalesce(metadata->>'mimetype', metadata->>'mimeType', '')
      in ('image/png', 'image/jpeg', 'image/webp')
  )
);

create policy csp_product_media_update_admin
on storage.objects
for update
to authenticated
using (
  bucket_id = 'csp-product-media'
  and coalesce(public.is_platform_admin(), false)
  and public._csp_product_media_path_ok(name)
)
with check (
  bucket_id = 'csp-product-media'
  and coalesce(public.is_platform_admin(), false)
  and public._csp_product_media_path_ok(name)
  and exists (
    select 1
    from public.csp_sales_products p
    where p.product_key = split_part(name, '/', 2)
  )
);

commit;

select 'PREPARED_ONLY_csp_product_media_storage_executable_v1' as candidate_status;
