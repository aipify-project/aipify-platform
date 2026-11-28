-- PREPARED_ONLY — AUTHORING COMPLETE — DO NOT APPLY without exact owner YES
-- naming this file, its SHA256, and the target environment (Staging then Production).
--
-- Job: AIPIFY_PRODUCT_CENTER_CORE_CONTENT_MEDIA_FOUNDATION_V1
-- Authoritative register: public.csp_sales_products + public.csp_product_locale_copy
--
-- PREREQUISITES (already ALREADY_APPLIED_VERIFIED on Staging + Production channel schema):
--   csp_sales_products.logo_path, hero_path
--   public.csp_product_locale_copy (product_id, locale, title, tagline, description, approved)
--   is_platform_admin(), _csp_audit (when present)
--
-- EFFECTS (when applied)
--   + additive benefits jsonb on csp_product_locale_copy (fordeler / feature bullets)
--   + platform-admin locale upsert + list (draft vs approved; no auto-publish)
--   + channel-filtered approved content reads for APP and SALE (no commission)
--   + platform-admin media path setter (paths only — storage bucket is SEPARATE candidate)
--   + APP list enrichment: logo_path / hero_path on csp_list_app_store_products()
--     (preserves taxonomy fields when those columns exist)
--
-- NON-EFFECTS
--   No backfill of locale rows or media paths
--   No publish_app / publish_sale / master_active flips
--   No storage.buckets / storage.objects policy changes
--   No variant / commission / Stripe / checkout / entitlement writes
--   No anon table grants; no service_role execute grants on new RPCs
--
-- FALLBACK (application layer)
--   Missing approved locale → registry copy (Kompis Nordic / Buddy other) — never invent Core text
--   Missing media paths → registry brand marks — never invent URLs
--
-- APPLY ORDER
--   1) Staging auedugihkduoaikfusqe — owner YES on this SHA
--   2) Pre-check: csp_product_locale_copy exists; logo_path/hero_path exist; RLS on
--   3) Apply this file
--   4) Post-check: RPCs exist; grants authenticated EXECUTE only; revoke public/anon/service_role
--   5) Separate Production qbcqoixhrvhnuwphefvw owner YES + apply
--   6) Storage bucket/policies: NOT_APPLIED_csp_product_media_storage_v1.sql — SEPARATE YES
--
-- ROLLBACK (manual; prefer stop using RPCs before dropping)
--   drop function if exists public.csp_upsert_product_locale_copy(jsonb);
--   drop function if exists public.csp_list_product_locale_copy(text);
--   drop function if exists public.csp_get_approved_product_content(text, text, text);
--   drop function if exists public.csp_list_approved_product_content(text, text);
--   drop function if exists public.csp_set_product_media_paths(jsonb);
--   -- restore prior csp_list_app_store_products from dependency foundation or channel RPC candidate
--   alter table public.csp_product_locale_copy drop column if exists benefits;
--
-- Out of scope: Product Center full upload UI, Agent 1 variants/commission, Website Kompis Public Chain.

begin;

-- ---------------------------------------------------------------------------
-- Guards
-- ---------------------------------------------------------------------------
do $$
begin
  if to_regclass('public.csp_sales_products') is null then
    raise exception 'csp_product_locale_media_foundation_v1 requires public.csp_sales_products';
  end if;
  if to_regclass('public.csp_product_locale_copy') is null then
    raise exception 'csp_product_locale_media_foundation_v1 requires public.csp_product_locale_copy (channel schema)';
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'csp_sales_products' and column_name = 'logo_path'
  ) then
    raise exception 'csp_product_locale_media_foundation_v1 requires logo_path column';
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'csp_sales_products' and column_name = 'hero_path'
  ) then
    raise exception 'csp_product_locale_media_foundation_v1 requires hero_path column';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Additive: benefits (fordeler) as JSON array of short strings — empty = none
-- ---------------------------------------------------------------------------
alter table public.csp_product_locale_copy
  add column if not exists benefits jsonb not null default '[]'::jsonb;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'csp_product_locale_copy_benefits_is_array'
      and conrelid = 'public.csp_product_locale_copy'::regclass
  ) then
    alter table public.csp_product_locale_copy
      add constraint csp_product_locale_copy_benefits_is_array
      check (jsonb_typeof(benefits) = 'array');
  end if;
end $$;

comment on column public.csp_product_locale_copy.benefits is
  'Localized feature bullets (fordeler). JSON string array. Empty means none — never invent.';
comment on column public.csp_product_locale_copy.approved is
  'true = published content for channel reads. false = Platform draft. Never auto-set true.';

revoke all on table public.csp_product_locale_copy from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public._csp_normalize_locale(p_locale text)
returns text
language plpgsql
immutable
as $$
declare
  v text := lower(trim(coalesce(p_locale, '')));
begin
  if v in ('en', 'no', 'sv', 'da', 'pl', 'uk', 'es') then
    return v;
  end if;
  return null;
end;
$$;

create or replace function public._csp_normalize_benefits(p_benefits jsonb)
returns jsonb
language plpgsql
immutable
as $$
declare
  v_out jsonb := '[]'::jsonb;
  v_item text;
  v_elem jsonb;
  v_count int := 0;
begin
  if p_benefits is null or jsonb_typeof(p_benefits) <> 'array' then
    return '[]'::jsonb;
  end if;
  for v_elem in select * from jsonb_array_elements(p_benefits)
  loop
    if jsonb_typeof(v_elem) <> 'string' then
      continue;
    end if;
    v_item := trim(both from (v_elem #>> '{}'));
    if v_item = '' or char_length(v_item) > 240 then
      continue;
    end if;
    v_out := v_out || jsonb_build_array(v_item);
    v_count := v_count + 1;
    exit when v_count >= 12;
  end loop;
  return v_out;
end;
$$;

create or replace function public._csp_normalize_media_path(p_path text)
returns text
language plpgsql
immutable
as $$
declare
  v text := trim(coalesce(p_path, ''));
begin
  if v = '' then
    return null;
  end if;
  -- Paths only (storage object keys or approved public asset paths). No data: URLs.
  if v ~* '^https?://' then
    raise exception 'media_path_must_not_be_absolute_url';
  end if;
  -- length capped separately: POSIX RE_DUP_MAX rejects {1,512}
  if char_length(v) > 512 or v !~ '^[a-zA-Z0-9/_.-]+$' then
    raise exception 'media_path_invalid';
  end if;
  if position('..' in v) > 0 or v like '/%' then
    raise exception 'media_path_invalid';
  end if;
  return v;
end;
$$;

-- ---------------------------------------------------------------------------
-- Platform Admin: upsert locale copy (draft or explicitly approved)
-- ---------------------------------------------------------------------------
create or replace function public.csp_upsert_product_locale_copy(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_key text := lower(trim(coalesce(p_payload->>'product_key', '')));
  v_locale text := public._csp_normalize_locale(p_payload->>'locale');
  v_title text := trim(coalesce(p_payload->>'title', ''));
  v_tagline text := nullif(trim(coalesce(p_payload->>'tagline', '')), '');
  v_description text := trim(coalesce(p_payload->>'description', ''));
  v_benefits jsonb := public._csp_normalize_benefits(p_payload->'benefits');
  v_approved boolean := coalesce((p_payload->>'approved')::boolean, false);
  v_prod public.csp_sales_products%rowtype;
  v_row public.csp_product_locale_copy%rowtype;
begin
  if v_uid is null or not coalesce(public.is_platform_admin(), false) then
    return jsonb_build_object('found', false, 'error', 'forbidden');
  end if;
  if v_key = '' or v_key !~ '^[a-z0-9_-]{1,64}$' then
    return jsonb_build_object('found', false, 'error', 'product_key_invalid');
  end if;
  if v_locale is null then
    return jsonb_build_object('found', false, 'error', 'locale_invalid');
  end if;
  if v_title = '' or char_length(v_title) > 200 then
    return jsonb_build_object('found', false, 'error', 'title_invalid');
  end if;
  if v_description = '' or char_length(v_description) > 8000 then
    return jsonb_build_object('found', false, 'error', 'description_invalid');
  end if;

  select * into v_prod from public.csp_sales_products where product_key = v_key for update;
  if not found then
    return jsonb_build_object('found', false, 'error', 'not_found');
  end if;

  insert into public.csp_product_locale_copy as c (
    product_id, locale, title, tagline, description, benefits, approved, updated_at
  ) values (
    v_prod.id, v_locale, v_title, v_tagline, v_description, v_benefits, v_approved, now()
  )
  on conflict (product_id, locale) do update
  set
    title = excluded.title,
    tagline = excluded.tagline,
    description = excluded.description,
    benefits = excluded.benefits,
    approved = excluded.approved,
    updated_at = now()
  returning * into v_row;

  begin
    perform public._csp_audit(
      v_uid,
      'platform_admin',
      'product_locale_copy_upserted',
      jsonb_build_object(
        'product_key', v_key,
        'locale', v_locale,
        'approved', v_approved
      )
    );
  exception
    when undefined_function then
      null;
  end;

  return jsonb_build_object(
    'found', true,
    'locale_copy', jsonb_build_object(
      'product_key', v_key,
      'locale', v_row.locale,
      'title', v_row.title,
      'tagline', v_row.tagline,
      'description', v_row.description,
      'benefits', v_row.benefits,
      'approved', v_row.approved,
      'updated_at', v_row.updated_at
    )
  );
end;
$$;

revoke all on function public.csp_upsert_product_locale_copy(jsonb)
  from public, anon, authenticated, service_role;
grant execute on function public.csp_upsert_product_locale_copy(jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- Platform Admin: list all locale rows for a product (draft + approved)
-- ---------------------------------------------------------------------------
create or replace function public.csp_list_product_locale_copy(p_product_key text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_key text := lower(trim(coalesce(p_product_key, '')));
  v_prod_id uuid;
begin
  if auth.uid() is null or not coalesce(public.is_platform_admin(), false) then
    return jsonb_build_object('found', false, 'error', 'forbidden');
  end if;
  if v_key = '' then
    return jsonb_build_object('found', false, 'error', 'product_key_invalid');
  end if;

  select id into v_prod_id from public.csp_sales_products where product_key = v_key;
  if v_prod_id is null then
    return jsonb_build_object('found', false, 'error', 'not_found');
  end if;

  return jsonb_build_object(
    'found', true,
    'product_key', v_key,
    'locales', coalesce((
      select jsonb_agg(jsonb_build_object(
        'locale', c.locale,
        'title', c.title,
        'tagline', c.tagline,
        'description', c.description,
        'benefits', c.benefits,
        'approved', c.approved,
        'updated_at', c.updated_at
      ) order by c.locale)
      from public.csp_product_locale_copy c
      where c.product_id = v_prod_id
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.csp_list_product_locale_copy(text)
  from public, anon, authenticated, service_role;
grant execute on function public.csp_list_product_locale_copy(text) to authenticated;

-- ---------------------------------------------------------------------------
-- Channel-filtered approved content (APP or SALE) — single product
-- p_channel: 'app' | 'sale'
-- Never invents content; returns content_missing when no approved locale.
-- ---------------------------------------------------------------------------
create or replace function public.csp_get_approved_product_content(
  p_product_key text,
  p_locale text default 'en',
  p_channel text default 'app'
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_key text := lower(trim(coalesce(p_product_key, '')));
  v_locale text := coalesce(public._csp_normalize_locale(p_locale), 'en');
  v_channel text := lower(trim(coalesce(p_channel, 'app')));
  v_prod public.csp_sales_products%rowtype;
  v_copy public.csp_product_locale_copy%rowtype;
  v_fallback_locale text;
  v_has_copy boolean := false;
begin
  if auth.uid() is null then
    return jsonb_build_object('found', false, 'error', 'unauthorized');
  end if;
  if v_key = '' then
    return jsonb_build_object('found', false, 'error', 'product_key_invalid');
  end if;
  if v_channel not in ('app', 'sale') then
    return jsonb_build_object('found', false, 'error', 'channel_invalid');
  end if;

  select * into v_prod from public.csp_sales_products where product_key = v_key;
  if not found then
    return jsonb_build_object('found', false, 'error', 'not_found');
  end if;

  if v_channel = 'app' then
    if not (v_prod.publish_app is true and v_prod.master_active is true) then
      return jsonb_build_object('found', false, 'error', 'not_listed', 'channel', 'app');
    end if;
  else
    if not (v_prod.publish_sale is true) then
      return jsonb_build_object('found', false, 'error', 'not_listed', 'channel', 'sale');
    end if;
  end if;

  select * into v_copy
  from public.csp_product_locale_copy c
  where c.product_id = v_prod.id
    and c.locale = v_locale
    and c.approved = true;
  if found then
    v_has_copy := true;
  else
    -- Locale fallback chain: requested → en → no. Still approved-only. Never invent.
    foreach v_fallback_locale in array array['en', 'no'] loop
      if v_fallback_locale = v_locale then
        continue;
      end if;
      select * into v_copy
      from public.csp_product_locale_copy c
      where c.product_id = v_prod.id
        and c.locale = v_fallback_locale
        and c.approved = true;
      if found then
        v_has_copy := true;
        exit;
      end if;
    end loop;
  end if;

  if not v_has_copy then
    return jsonb_build_object(
      'found', true,
      'channel', v_channel,
      'product_key', v_key,
      'content_missing', true,
      'requested_locale', v_locale,
      'logo_path', v_prod.logo_path,
      'hero_path', v_prod.hero_path,
      'fallback', 'registry',
      'commission', null
    );
  end if;

  return jsonb_build_object(
    'found', true,
    'channel', v_channel,
    'product_key', v_key,
    'content_missing', false,
    'requested_locale', v_locale,
    'locale', v_copy.locale,
    'title', v_copy.title,
    'tagline', v_copy.tagline,
    'description', v_copy.description,
    'benefits', v_copy.benefits,
    'logo_path', v_prod.logo_path,
    'hero_path', v_prod.hero_path,
    'fallback', null,
    'commission', null
  );
end;
$$;

revoke all on function public.csp_get_approved_product_content(text, text, text)
  from public, anon, authenticated, service_role;
grant execute on function public.csp_get_approved_product_content(text, text, text)
  to authenticated;

-- ---------------------------------------------------------------------------
-- Channel-filtered approved content list (APP or SALE)
-- ---------------------------------------------------------------------------
create or replace function public.csp_list_approved_product_content(
  p_locale text default 'en',
  p_channel text default 'app'
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_locale text := coalesce(public._csp_normalize_locale(p_locale), 'en');
  v_channel text := lower(trim(coalesce(p_channel, 'app')));
begin
  if auth.uid() is null then
    return jsonb_build_object('found', false, 'error', 'unauthorized');
  end if;
  if v_channel not in ('app', 'sale') then
    return jsonb_build_object('found', false, 'error', 'channel_invalid');
  end if;

  return jsonb_build_object(
    'found', true,
    'channel', v_channel,
    'requested_locale', v_locale,
    'dependency_semantics', 'all',
    'products', coalesce((
      select jsonb_agg(x.content order by x.product_key)
      from (
        select
          p.product_key,
          public.csp_get_approved_product_content(p.product_key, v_locale, v_channel) as content
        from public.csp_sales_products p
        where case
          when v_channel = 'app' then p.publish_app is true and p.master_active is true
          else p.publish_sale is true
        end
      ) x
      where coalesce((x.content->>'found')::boolean, false)
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.csp_list_approved_product_content(text, text)
  from public, anon, authenticated, service_role;
grant execute on function public.csp_list_approved_product_content(text, text)
  to authenticated;

-- ---------------------------------------------------------------------------
-- Platform Admin: set media paths only (upload/storage is separate YES)
-- ---------------------------------------------------------------------------
create or replace function public.csp_set_product_media_paths(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_key text := lower(trim(coalesce(p_payload->>'product_key', '')));
  v_logo text;
  v_hero text;
  v_clear_logo boolean := coalesce((p_payload->>'clear_logo')::boolean, false);
  v_clear_hero boolean := coalesce((p_payload->>'clear_hero')::boolean, false);
  v_prod public.csp_sales_products%rowtype;
begin
  if v_uid is null or not coalesce(public.is_platform_admin(), false) then
    return jsonb_build_object('found', false, 'error', 'forbidden');
  end if;
  if v_key = '' or v_key !~ '^[a-z0-9_-]{1,64}$' then
    return jsonb_build_object('found', false, 'error', 'product_key_invalid');
  end if;

  begin
    v_logo := case
      when v_clear_logo then null
      when p_payload ? 'logo_path' then public._csp_normalize_media_path(p_payload->>'logo_path')
      else null
    end;
    v_hero := case
      when v_clear_hero then null
      when p_payload ? 'hero_path' then public._csp_normalize_media_path(p_payload->>'hero_path')
      else null
    end;
  exception
    when others then
      return jsonb_build_object('found', false, 'error', 'media_path_invalid', 'detail', SQLERRM);
  end;

  select * into v_prod from public.csp_sales_products where product_key = v_key for update;
  if not found then
    return jsonb_build_object('found', false, 'error', 'not_found');
  end if;

  update public.csp_sales_products
  set
    logo_path = case
      when v_clear_logo then null
      when p_payload ? 'logo_path' then v_logo
      else logo_path
    end,
    hero_path = case
      when v_clear_hero then null
      when p_payload ? 'hero_path' then v_hero
      else hero_path
    end,
    updated_at = now()
  where product_key = v_key
  returning * into v_prod;

  begin
    perform public._csp_audit(
      v_uid,
      'platform_admin',
      'product_media_paths_updated',
      jsonb_build_object(
        'product_key', v_key,
        'logo_set', v_prod.logo_path is not null,
        'hero_set', v_prod.hero_path is not null
      )
    );
  exception
    when undefined_function then
      null;
  end;

  return jsonb_build_object(
    'found', true,
    'product', jsonb_build_object(
      'product_key', v_prod.product_key,
      'logo_path', v_prod.logo_path,
      'hero_path', v_prod.hero_path
    )
  );
end;
$$;

revoke all on function public.csp_set_product_media_paths(jsonb)
  from public, anon, authenticated, service_role;
grant execute on function public.csp_set_product_media_paths(jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- Enrich APP list with media paths (no commission). Preserve taxonomy if present.
-- Signature unchanged: csp_list_app_store_products()
-- ---------------------------------------------------------------------------
create or replace function public.csp_list_app_store_products()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_has_taxonomy boolean := exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'csp_sales_products' and column_name = 'product_type'
  );
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

  if v_has_taxonomy then
    return jsonb_build_object(
      'found', true,
      'channel_schema', true,
      'dependency_semantics', 'all',
      'content_contract', 'media_paths_v1',
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
          'logo_path', p.logo_path,
          'hero_path', p.hero_path,
          'updated_at', p.updated_at
        ) order by p.product_key)
        from public.csp_sales_products p
        where p.publish_app is true
          and p.master_active is true
      ), '[]'::jsonb)
    );
  end if;

  return jsonb_build_object(
    'found', true,
    'channel_schema', true,
    'content_contract', 'media_paths_v1',
    'products', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id,
        'product_key', p.product_key,
        'sku', p.sku,
        'publish_app', p.publish_app,
        'master_active', p.master_active,
        'logo_path', p.logo_path,
        'hero_path', p.hero_path,
        'updated_at', p.updated_at
      ) order by p.product_key)
      from public.csp_sales_products p
      where p.publish_app is true
        and p.master_active is true
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.csp_list_app_store_products()
  from public, anon, authenticated, service_role;
grant execute on function public.csp_list_app_store_products() to authenticated;

commit;

select 'PREPARED_ONLY_csp_product_locale_media_foundation_v1' as candidate_status;
