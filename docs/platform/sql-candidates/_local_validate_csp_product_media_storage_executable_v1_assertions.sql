-- Assertions after applying csp_product_media_storage_executable_v1.sql locally.
-- Tests policy helpers + RLS with simulated roles. No durable remote data.

do $$
declare
  v_bucket storage.buckets%rowtype;
  v_ok boolean;
  v_cnt int;
  v_uid uuid := '11111111-1111-4111-8111-111111111111';
begin
  select * into v_bucket from storage.buckets where id = 'csp-product-media';
  if not found then
    raise exception 'bucket missing';
  end if;
  if v_bucket.public is not false then
    raise exception 'bucket must be private';
  end if;
  if v_bucket.file_size_limit is distinct from 2097152 then
    raise exception 'file_size_limit expected 2097152: %', v_bucket.file_size_limit;
  end if;
  if not (v_bucket.allowed_mime_types @> array['image/png','image/jpeg','image/webp']
          and cardinality(v_bucket.allowed_mime_types) = 3) then
    raise exception 'MIME allowlist mismatch: %', v_bucket.allowed_mime_types;
  end if;
  if 'image/svg+xml' = any(v_bucket.allowed_mime_types) then
    raise exception 'SVG must not be allowed';
  end if;

  -- Path validation
  if not public._csp_product_media_path_ok('products/kompis_web/logo/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee.png') then
    raise exception 'valid path rejected';
  end if;
  if public._csp_product_media_path_ok('products/../etc/passwd') then
    raise exception 'traversal accepted';
  end if;
  if public._csp_product_media_path_ok('products/kompis_web/logo/x.svg') then
    raise exception 'svg extension accepted';
  end if;
  if public._csp_product_media_path_ok('/products/kompis_web/logo/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee.png') then
    raise exception 'leading slash accepted';
  end if;

  perform set_config('request.jwt.claim.sub', v_uid::text, true);

  -- Non-admin cannot read unregistered path
  perform set_config('app.is_platform_admin', 'false', true);
  if public._csp_product_media_object_readable('products/kompis_web/logo/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee.png') then
    raise exception 'unregistered path readable by non-admin';
  end if;

  -- Register path on sale-listed product → readable
  update public.csp_sales_products
  set logo_path = 'products/kompis_web/logo/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee.png'
  where product_key = 'kompis_web';
  if not public._csp_product_media_object_readable('products/kompis_web/logo/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee.png') then
    raise exception 'registered sale path should be readable';
  end if;

  -- Unpublished product registered path → not readable to non-admin
  update public.csp_sales_products
  set logo_path = 'products/aipify_voice/logo/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee.png'
  where product_key = 'aipify_voice';
  if public._csp_product_media_object_readable('products/aipify_voice/logo/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee.png') then
    raise exception 'unpublished registered path leaked';
  end if;

  -- Admin can read valid path shape even if unpublished
  perform set_config('app.is_platform_admin', 'true', true);
  if not public._csp_product_media_object_readable('products/aipify_voice/logo/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee.png') then
    raise exception 'admin should read valid path';
  end if;

  -- RLS insert: admin + known product (FORCE RLS + SET ROLE authenticated)
  delete from storage.objects where bucket_id = 'csp-product-media'; -- as table owner / bypass before force tests
  perform set_config('app.is_platform_admin', 'true', true);
  execute 'set local role authenticated';
  begin
    insert into storage.objects (bucket_id, name, owner, metadata)
    values (
      'csp-product-media',
      'products/kompis_web/logo/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee.png',
      v_uid,
      jsonb_build_object('mimetype', 'image/png')
    );
  exception when others then
    execute 'reset role';
    raise exception 'admin insert failed: %', SQLERRM;
  end;

  -- Cross-product / unknown product_key write rejected
  begin
    insert into storage.objects (bucket_id, name, owner, metadata)
    values (
      'csp-product-media',
      'products/unknown_product/logo/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee.png',
      v_uid,
      jsonb_build_object('mimetype', 'image/png')
    );
    execute 'reset role';
    raise exception 'unknown product insert should fail';
  exception
    when insufficient_privilege then null;
    when others then
      if SQLERRM like '%unknown product insert should fail%' then
        execute 'reset role';
        raise;
      end if;
      null;
  end;

  -- Non-admin insert rejected
  perform set_config('app.is_platform_admin', 'false', true);
  begin
    insert into storage.objects (bucket_id, name, owner, metadata)
    values (
      'csp-product-media',
      'products/kompis_web/hero/bbbbbbbb-bbbb-cccc-dddd-eeeeeeeeeeee.webp',
      v_uid,
      jsonb_build_object('mimetype', 'image/webp')
    );
    execute 'reset role';
    raise exception 'non-admin insert should fail';
  exception
    when insufficient_privilege then null;
    when others then
      if SQLERRM like '%non-admin insert should fail%' then
        execute 'reset role';
        raise;
      end if;
      null;
  end;

  execute 'reset role';

  -- Anon has no readable path (auth.uid null)
  perform set_config('request.jwt.claim.sub', '', true);
  perform set_config('app.is_platform_admin', 'false', true);
  if public._csp_product_media_object_readable('products/kompis_web/logo/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee.png') then
    raise exception 'anon/unauth readable';
  end if;

  -- Bad MIME metadata rejected for admin insert
  perform set_config('request.jwt.claim.sub', v_uid::text, true);
  perform set_config('app.is_platform_admin', 'true', true);
  execute 'set local role authenticated';
  begin
    insert into storage.objects (bucket_id, name, owner, metadata)
    values (
      'csp-product-media',
      'products/kompis_web/logo/cccccccc-bbbb-cccc-dddd-eeeeeeeeeeee.png',
      v_uid,
      jsonb_build_object('mimetype', 'image/svg+xml')
    );
    execute 'reset role';
    raise exception 'svg mime insert should fail';
  exception
    when insufficient_privilege then null;
    when others then
      if SQLERRM like '%svg mime insert should fail%' then
        execute 'reset role';
        raise;
      end if;
      null;
  end;

  execute 'reset role';

  select count(*) into v_cnt from storage.objects where bucket_id = 'csp-product-media';
  if v_cnt <> 1 then
    raise exception 'expected exactly one stored object after tests, got %', v_cnt;
  end if;

  -- No DELETE policy: as authenticated admin, DELETE affects 0 rows under FORCE RLS
  perform set_config('app.is_platform_admin', 'true', true);
  execute 'set local role authenticated';
  delete from storage.objects where bucket_id = 'csp-product-media';
  get diagnostics v_cnt = row_count;
  execute 'reset role';
  if v_cnt <> 0 then
    raise exception 'DELETE unexpectedly removed % rows — candidate must not allow client delete', v_cnt;
  end if;
  select count(*) into v_cnt from storage.objects where bucket_id = 'csp-product-media';
  if v_cnt <> 1 then
    raise exception 'object missing after delete attempt';
  end if;

  raise notice 'csp_product_media_storage_executable_v1 local assertions: PASS';
end $$;
