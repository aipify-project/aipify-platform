-- AIPIFY KOMPIS CORE — FAQ STORAGE CONTRACT REPAIR.39
-- Feature owner: INSTALL ENGINE / public Website Kompis Core
-- Align replace_tenant_public_site_index_document persist caps with FAQ extract
-- (240 pairs / 48 chunks / 48k body). Ordinary non-FAQ pages still extract ≤16
-- chunks / ≤24k visible body; this only raises the server-side persist ceiling.
--
-- Does NOT: seed/backfill/reindex Production rows, enable write gates, alter RLS,
-- grants, search_path, SECURITY DEFINER trust asserts, or visitor ask limits.
-- Apply to Production requires separate explicit owner approval (job 39 stops
-- before merge/apply when runtime depends on this schema).

create or replace function public.replace_tenant_public_site_index_document(
  p_tenant_id uuid,
  p_install_id uuid,
  p_verified_host text,
  p_canonical_url text,
  p_pathname text,
  p_locale text,
  p_title text,
  p_meta_description text,
  p_excerpt text,
  p_body_text text,
  p_content_hash text,
  p_chunks text[],
  p_http_status integer default 200,
  p_stale_after timestamptz default (now() + interval '7 days')
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_doc_id uuid;
  v_host text;
  v_url text;
  v_path text;
  v_locale text;
  v_i integer;
  -- Keep in lockstep with extract.ts:
  -- WEBSITE_KOMPIS_PUBLIC_FAQ_BODY_MAX / WEBSITE_KOMPIS_PUBLIC_FAQ_CHUNK_MAX
  -- and WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_PERSIST_* in TypeScript.
  v_body_max integer := 48000;
  v_chunk_max integer := 48;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception 'SERVICE_ROLE_REQUIRED';
  end if;

  v_host := lower(trim(coalesce(p_verified_host, '')));
  v_url := trim(coalesce(p_canonical_url, ''));
  v_path := trim(coalesce(p_pathname, ''));
  v_locale := lower(trim(coalesce(nullif(p_locale, ''), 'no')));

  if not public._wpsi_assert_tenant_host_install(p_tenant_id, p_install_id, v_host) then
    raise exception 'TRUST_CONTEXT_REJECTED';
  end if;

  if v_url !~ '^https://' or v_path = '' or left(v_path, 1) <> '/' then
    raise exception 'INVALID_DOCUMENT';
  end if;

  if length(coalesce(p_content_hash, '')) < 8 then
    raise exception 'INVALID_CONTENT_HASH';
  end if;

  -- Canonical URL host must match verified host exactly.
  if lower(split_part(regexp_replace(v_url, '^https://', ''), '/', 1)) is distinct from v_host then
    raise exception 'HOST_MISMATCH';
  end if;

  insert into public.tenant_public_site_index_documents (
    tenant_id,
    install_id,
    verified_host,
    canonical_url,
    pathname,
    locale,
    title,
    meta_description,
    excerpt,
    body_text,
    content_hash,
    http_status,
    robots_allowed,
    status,
    crawled_at,
    stale_after,
    updated_at
  )
  values (
    p_tenant_id,
    p_install_id,
    v_host,
    v_url,
    v_path,
    left(v_locale, 16),
    left(coalesce(p_title, ''), 300),
    left(coalesce(p_meta_description, ''), 600),
    left(coalesce(p_excerpt, ''), 800),
    left(coalesce(p_body_text, ''), v_body_max),
    left(p_content_hash, 128),
    coalesce(p_http_status, 200),
    true,
    'active',
    now(),
    coalesce(p_stale_after, now() + interval '7 days'),
    now()
  )
  on conflict (tenant_id, verified_host, canonical_url)
  do update set
    install_id = excluded.install_id,
    pathname = excluded.pathname,
    locale = excluded.locale,
    title = excluded.title,
    meta_description = excluded.meta_description,
    excerpt = excluded.excerpt,
    body_text = excluded.body_text,
    content_hash = excluded.content_hash,
    http_status = excluded.http_status,
    status = 'active',
    robots_allowed = true,
    crawled_at = now(),
    stale_after = excluded.stale_after,
    updated_at = now()
  returning id into v_doc_id;

  delete from public.tenant_public_site_index_chunks
  where document_id = v_doc_id;

  if p_chunks is not null then
    for v_i in 1 .. least(coalesce(array_length(p_chunks, 1), 0), v_chunk_max) loop
      if length(trim(p_chunks[v_i])) >= 24 then
        insert into public.tenant_public_site_index_chunks (
          document_id,
          tenant_id,
          chunk_index,
          content,
          locale
        )
        values (
          v_doc_id,
          p_tenant_id,
          v_i - 1,
          left(trim(p_chunks[v_i]), 1800),
          left(v_locale, 16)
        );
      end if;
    end loop;
  end if;

  return v_doc_id;
end;
$$;

revoke all on function public.replace_tenant_public_site_index_document(
  uuid, uuid, text, text, text, text, text, text, text, text, text, text[], integer, timestamptz
) from public, anon, authenticated;
grant execute on function public.replace_tenant_public_site_index_document(
  uuid, uuid, text, text, text, text, text, text, text, text, text, text[], integer, timestamptz
) to service_role;

comment on function public.replace_tenant_public_site_index_document(
  uuid, uuid, text, text, text, text, text, text, text, text, text, text[], integer, timestamptz
) is
  'Upsert one public site index document + replace chunks. Persist ceiling: body 48000 chars, 48 chunks (FAQ extract contract). service_role only. No crawl/backfill.';
