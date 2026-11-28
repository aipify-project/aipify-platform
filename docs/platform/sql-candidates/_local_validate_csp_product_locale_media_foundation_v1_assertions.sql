-- Assertions after applying csp_product_locale_media_foundation_v1.sql on local harness.

do $$
declare
  v_admin uuid := '11111111-1111-1111-1111-111111111111';
  v_user uuid := '22222222-2222-2222-2222-222222222222';
  v_upsert jsonb;
  v_list jsonb;
  v_app jsonb;
  v_sale jsonb;
  v_media jsonb;
  v_store jsonb;
begin
  -- Unauthorized upsert
  perform set_config('request.jwt.claim.sub', v_user::text, true);
  perform set_config('app.is_platform_admin', 'false', true);
  v_upsert := public.csp_upsert_product_locale_copy(jsonb_build_object(
    'product_key', 'kompis_web',
    'locale', 'en',
    'title', 'Buddy Web',
    'description', 'Visitor answers on the website.',
    'benefits', '["FAQ","Knowledge"]'::jsonb,
    'approved', true
  ));
  if coalesce(v_upsert->>'error', '') <> 'forbidden' then
    raise exception 'expected forbidden for non-admin upsert, got %', v_upsert;
  end if;

  -- Admin draft then approve
  perform set_config('request.jwt.claim.sub', v_admin::text, true);
  perform set_config('app.is_platform_admin', 'true', true);
  v_upsert := public.csp_upsert_product_locale_copy(jsonb_build_object(
    'product_key', 'kompis_web',
    'locale', 'en',
    'title', 'Buddy Web',
    'tagline', 'Clear answers',
    'description', 'Visitor answers on the website.',
    'benefits', '["FAQ","Knowledge", 12, ""]'::jsonb,
    'approved', false
  ));
  if coalesce((v_upsert->'locale_copy'->>'approved')::boolean, true) <> false then
    raise exception 'draft must not auto-approve: %', v_upsert;
  end if;

  -- Draft must not surface on APP channel
  perform set_config('app.is_platform_admin', 'false', true);
  v_app := public.csp_get_approved_product_content('kompis_web', 'en', 'app');
  if coalesce((v_app->>'content_missing')::boolean, false) <> true then
    raise exception 'draft must be content_missing for APP: %', v_app;
  end if;

  -- Approve
  perform set_config('app.is_platform_admin', 'true', true);
  v_upsert := public.csp_upsert_product_locale_copy(jsonb_build_object(
    'product_key', 'kompis_web',
    'locale', 'en',
    'title', 'Buddy Web',
    'tagline', 'Clear answers',
    'description', 'Visitor answers on the website.',
    'benefits', '["FAQ","Knowledge"]'::jsonb,
    'approved', true
  ));
  if coalesce((v_upsert->'locale_copy'->>'approved')::boolean, false) <> true then
    raise exception 'approved upsert failed: %', v_upsert;
  end if;
  if jsonb_array_length(v_upsert->'locale_copy'->'benefits') <> 2 then
    raise exception 'benefits normalize failed: %', v_upsert;
  end if;

  -- Media paths
  v_media := public.csp_set_product_media_paths(jsonb_build_object(
    'product_key', 'kompis_web',
    'logo_path', 'products/kompis_web/logo/mark.png',
    'hero_path', 'products/kompis_web/hero/hero.webp'
  ));
  if v_media->'product'->>'logo_path' is null then
    raise exception 'media path set failed: %', v_media;
  end if;

  -- Reject absolute URL
  begin
    v_media := public.csp_set_product_media_paths(jsonb_build_object(
      'product_key', 'kompis_web',
      'logo_path', 'https://evil.example/x.png'
    ));
    if coalesce(v_media->>'error', '') <> 'media_path_invalid' then
      raise exception 'expected media_path_invalid for URL, got %', v_media;
    end if;
  end;

  -- APP approved content (no commission key with value)
  perform set_config('app.is_platform_admin', 'false', true);
  v_app := public.csp_get_approved_product_content('kompis_web', 'en', 'app');
  if coalesce(v_app->>'title', '') <> 'Buddy Web' then
    raise exception 'APP content missing title: %', v_app;
  end if;
  if v_app->'commission' is not null and jsonb_typeof(v_app->'commission') <> 'null' then
    raise exception 'APP content must not leak commission: %', v_app;
  end if;

  -- SALE-only product not listed on APP
  v_app := public.csp_get_approved_product_content('aipify_voice', 'en', 'app');
  if coalesce(v_app->>'error', '') <> 'not_listed' then
    raise exception 'SALE-only must not list on APP: %', v_app;
  end if;

  -- SALE channel ok without approved copy → content_missing
  v_sale := public.csp_get_approved_product_content('aipify_voice', 'en', 'sale');
  if coalesce((v_sale->>'content_missing')::boolean, false) <> true then
    raise exception 'missing SALE content should be content_missing: %', v_sale;
  end if;

  -- List APP store includes media paths
  v_store := public.csp_list_app_store_products();
  if coalesce(v_store->>'content_contract', '') <> 'media_paths_v1' then
    raise exception 'list RPC missing content_contract: %', v_store;
  end if;
  if not exists (
    select 1
    from jsonb_array_elements(v_store->'products') p
    where p->>'product_key' = 'kompis_web'
      and p->>'logo_path' is not null
  ) then
    raise exception 'list RPC missing logo_path for kompis_web: %', v_store;
  end if;
  if exists (
    select 1
    from jsonb_array_elements(v_store->'products') p
    where p ? 'fixed_commission_amount' or p ? 'currency'
  ) then
    raise exception 'list RPC leaked commission fields: %', v_store;
  end if;

  -- Platform locale list
  perform set_config('app.is_platform_admin', 'true', true);
  v_list := public.csp_list_product_locale_copy('kompis_web');
  if jsonb_array_length(v_list->'locales') < 1 then
    raise exception 'admin locale list empty: %', v_list;
  end if;

  raise notice 'csp_product_locale_media_foundation_v1 local assertions: PASS';
end $$;
