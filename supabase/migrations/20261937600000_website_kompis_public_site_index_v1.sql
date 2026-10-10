-- AIPIFY.CORE.WEBSITE.KOMPIS.REAL.KNOWLEDGE.AND.MEMBER.RUNTIME.AIPIFY.ONLY.V2
-- Feature owner: PLATFORM (ingest) + INSTALL ENGINE / APP (public retrieval)
-- Scope: tenant-scoped PUBLIC website index for Website Kompis cross-page answers.
-- Does NOT seed customer content. Does NOT enable sources.publicSiteIndex by default.
-- Apply requires separate explicit owner approval (schema + later index data writes).

-- ---------------------------------------------------------------------------
-- 1. Documents (one row per canonical public URL)
-- ---------------------------------------------------------------------------
create table if not exists public.tenant_public_site_index_documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  install_id uuid null references public.installations (id) on delete set null,
  verified_host text not null,
  canonical_url text not null,
  pathname text not null,
  locale text not null default 'no',
  title text not null default '',
  meta_description text not null default '',
  excerpt text not null default '',
  body_text text not null default '',
  content_hash text not null,
  http_status integer not null default 200,
  robots_allowed boolean not null default true,
  status text not null default 'active'
    check (status in ('active', 'stale', 'rejected', 'archived')),
  crawled_at timestamptz not null default now(),
  stale_after timestamptz not null default (now() + interval '7 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tenant_public_site_index_documents_host_url_uid
    unique (tenant_id, verified_host, canonical_url)
);

create index if not exists idx_tpsid_tenant_status_locale
  on public.tenant_public_site_index_documents (tenant_id, status, locale);

create index if not exists idx_tpsid_tenant_host_pathname
  on public.tenant_public_site_index_documents (tenant_id, verified_host, pathname);

create index if not exists idx_tpsid_body_fts
  on public.tenant_public_site_index_documents
  using gin (
    to_tsvector(
      'simple',
      coalesce(title, '') || ' ' || coalesce(meta_description, '') || ' ' || coalesce(body_text, '')
    )
  );

revoke all on table public.tenant_public_site_index_documents from public, anon, authenticated;
grant select, insert, update, delete on table public.tenant_public_site_index_documents to service_role;

-- ---------------------------------------------------------------------------
-- 2. Chunks (bounded passages for ranking)
-- ---------------------------------------------------------------------------
create table if not exists public.tenant_public_site_index_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null
    references public.tenant_public_site_index_documents (id) on delete cascade,
  tenant_id uuid not null,
  chunk_index integer not null check (chunk_index >= 0),
  content text not null,
  locale text not null default 'no',
  created_at timestamptz not null default now(),
  constraint tenant_public_site_index_chunks_doc_idx_uid
    unique (document_id, chunk_index)
);

create index if not exists idx_tpsic_tenant_document
  on public.tenant_public_site_index_chunks (tenant_id, document_id);

create index if not exists idx_tpsic_content_fts
  on public.tenant_public_site_index_chunks
  using gin (to_tsvector('simple', coalesce(content, '')));

revoke all on table public.tenant_public_site_index_chunks from public, anon, authenticated;
grant select, insert, update, delete on table public.tenant_public_site_index_chunks to service_role;

-- ---------------------------------------------------------------------------
-- 3. Crawl run ledger (operator/service only)
-- ---------------------------------------------------------------------------
create table if not exists public.tenant_public_site_index_crawl_runs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  install_id uuid null,
  verified_host text not null,
  status text not null default 'pending'
    check (status in ('pending', 'running', 'succeeded', 'failed', 'cancelled')),
  pages_discovered integer not null default 0,
  pages_indexed integer not null default 0,
  pages_rejected integer not null default 0,
  error_code text null,
  metadata jsonb not null default '{}'::jsonb,
  started_at timestamptz null,
  finished_at timestamptz null,
  created_at timestamptz not null default now()
);

create index if not exists idx_tpsir_tenant_created
  on public.tenant_public_site_index_crawl_runs (tenant_id, created_at desc);

revoke all on table public.tenant_public_site_index_crawl_runs from public, anon, authenticated;
grant select, insert, update, delete on table public.tenant_public_site_index_crawl_runs to service_role;

-- ---------------------------------------------------------------------------
-- 4. Token helper (reuse FAQ tokenizer shape)
-- ---------------------------------------------------------------------------
create or replace function public._wpsi_query_tokens(p_query text)
returns text[]
language plpgsql
immutable
set search_path = public
as $$
declare
  v_raw text;
  v_parts text[];
begin
  v_raw := lower(trim(coalesce(p_query, '')));
  if length(v_raw) < 2 then
    return array[]::text[];
  end if;

  v_parts := regexp_split_to_array(v_raw, '[^[:alnum:]åäöæøüß]+');
  return array(
    select t
    from unnest(v_parts) as t
    where length(t) >= 2
      and t not in (
        'og', 'i', 'på', 'til', 'av', 'en', 'et', 'den', 'det', 'de', 'som',
        'er', 'for', 'med', 'fra', 'om', 'the', 'and', 'for', 'with', 'from',
        'how', 'what', 'hva', 'hvordan', 'hvor'
      )
    limit 24
  );
end;
$$;

revoke all on function public._wpsi_query_tokens(text) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 5. Public search (fail-closed; anon via install/domain visitor context)
-- ---------------------------------------------------------------------------
create or replace function public.search_tenant_public_site_index(
  p_install_id uuid,
  p_domain text,
  p_locale text,
  p_query text,
  p_limit integer default 5
)
returns table (
  document_id uuid,
  chunk_id uuid,
  title text,
  canonical_url text,
  pathname text,
  locale text,
  excerpt text,
  chunk_content text,
  score numeric,
  matched_reason text,
  crawled_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_domain text;
  v_locale text;
  v_query text;
  v_limit integer;
  v_tokens text[];
begin
  v_query := trim(coalesce(p_query, ''));
  if length(v_query) < 2 then
    return;
  end if;

  v_limit := greatest(1, least(coalesce(p_limit, 5), 8));
  v_locale := lower(trim(coalesce(nullif(p_locale, ''), 'no')));
  if length(v_locale) > 16 then
    v_locale := 'no';
  end if;

  select c.tenant_id, c.resolved_domain
  into v_tenant_id, v_domain
  from public._wpkf_resolve_visitor_context(p_install_id, p_domain) c
  limit 1;

  if v_tenant_id is null then
    return;
  end if;

  v_tokens := public._wpsi_query_tokens(v_query);
  if coalesce(array_length(v_tokens, 1), 0) = 0 then
    return;
  end if;

  return query
  with scored as (
    select
      d.id as document_id,
      ch.id as chunk_id,
      d.title,
      d.canonical_url,
      d.pathname,
      d.locale,
      left(coalesce(nullif(d.excerpt, ''), d.meta_description, ch.content), 420) as excerpt,
      ch.content as chunk_content,
      (
        (case when d.locale = v_locale then 12 else 0 end)
        + (case when d.title ilike '%' || v_tokens[1] || '%' then 18 else 0 end)
        + (
          select coalesce(sum(
            case
              when ch.content ilike '%' || tok || '%' then 10
              when d.body_text ilike '%' || tok || '%' then 6
              when d.title ilike '%' || tok || '%' then 8
              else 0
            end
          ), 0)
          from unnest(v_tokens) as tok
        )
        + (
          case
            when to_tsvector('simple', coalesce(ch.content, ''))
              @@ plainto_tsquery('simple', v_query)
            then 14
            else 0
          end
        )
      )::numeric as score,
      'public_site_index'::text as matched_reason,
      d.crawled_at
    from public.tenant_public_site_index_documents d
    join public.tenant_public_site_index_chunks ch
      on ch.document_id = d.id
     and ch.tenant_id = d.tenant_id
    where d.tenant_id = v_tenant_id
      and d.status = 'active'
      and d.robots_allowed = true
      and d.stale_after > now()
      and (v_domain is null or d.verified_host = v_domain)
      and (
        d.locale = v_locale
        or d.locale = 'en'
        or v_locale = 'en'
      )
  )
  select
    s.document_id,
    s.chunk_id,
    s.title,
    s.canonical_url,
    s.pathname,
    s.locale,
    s.excerpt,
    s.chunk_content,
    s.score,
    s.matched_reason,
    s.crawled_at
  from scored s
  where s.score >= 16
  order by s.score desc, s.crawled_at desc
  limit v_limit;
end;
$$;

revoke all on function public.search_tenant_public_site_index(uuid, text, text, text, integer)
  from public;
grant execute on function public.search_tenant_public_site_index(uuid, text, text, text, integer)
  to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- 6. Service-role document replace (ingest path; no anon/authenticated write)
-- ---------------------------------------------------------------------------
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
begin
  if auth.role() is distinct from 'service_role' then
    raise exception 'SERVICE_ROLE_REQUIRED';
  end if;

  if p_tenant_id is null then
    raise exception 'TENANT_REQUIRED';
  end if;

  v_host := lower(trim(coalesce(p_verified_host, '')));
  v_url := trim(coalesce(p_canonical_url, ''));
  v_path := trim(coalesce(p_pathname, ''));
  v_locale := lower(trim(coalesce(nullif(p_locale, ''), 'no')));

  if v_host = '' or v_url = '' or v_path = '' or left(v_path, 1) <> '/' then
    raise exception 'INVALID_DOCUMENT';
  end if;

  if length(coalesce(p_content_hash, '')) < 8 then
    raise exception 'INVALID_CONTENT_HASH';
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
    left(coalesce(p_body_text, ''), 24000),
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
    for v_i in 1 .. least(array_length(p_chunks, 1), 24) loop
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

-- ---------------------------------------------------------------------------
-- 7. Mark documents stale for a tenant host (service role)
-- ---------------------------------------------------------------------------
create or replace function public.mark_tenant_public_site_index_stale(
  p_tenant_id uuid,
  p_verified_host text,
  p_before timestamptz default now()
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception 'SERVICE_ROLE_REQUIRED';
  end if;

  update public.tenant_public_site_index_documents
  set status = 'stale',
      updated_at = now()
  where tenant_id = p_tenant_id
    and verified_host = lower(trim(p_verified_host))
    and crawled_at < coalesce(p_before, now())
    and status = 'active';

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke all on function public.mark_tenant_public_site_index_stale(uuid, text, timestamptz)
  from public, anon, authenticated;
grant execute on function public.mark_tenant_public_site_index_stale(uuid, text, timestamptz)
  to service_role;
