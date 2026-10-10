-- AIPIFY.KOMPIS.PUBLIC.INDEX.READONLY.SEARCH.REPAIR.09
-- Feature owner: PLATFORM (public retrieval) + Core (tenant module gates)
-- Purpose: stop anonymous PostgREST public-site-index search from calling
--          is_tenant_module_enabled → ensure_tenant_commercial_setup → INSERT
--          (Postgres 25006 in read-only STABLE transactions).
-- Does NOT enable sources.publicSiteIndex. Does NOT ingest/crawl.
-- Does NOT change is_tenant_module_enabled used by operator/admin write paths.
-- Apply requires separate explicit owner approval (not this file alone).

-- ---------------------------------------------------------------------------
-- 1. Read-only module gate (materialized tenant_modules only — fail closed)
-- ---------------------------------------------------------------------------
-- Legitimate module sync/revoke continues via sync_tenant_modules_from_package /
-- ensure_tenant_commercial_setup on operator, billing, and authenticated package
-- flows — never inside the anonymous public search path.

create or replace function public._wpsi_is_tenant_module_enabled_readonly(
  p_tenant_id uuid,
  p_module_key text
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_row public.tenant_modules;
begin
  if p_tenant_id is null or coalesce(nullif(trim(p_module_key), ''), '') = '' then
    return false;
  end if;

  select *
  into v_row
  from public.tenant_modules
  where tenant_id = p_tenant_id
    and module_key = p_module_key
  limit 1;

  -- Fail closed: missing / unlicensed / disabled / revoked-status rows deny.
  if v_row.id is null then
    return false;
  end if;

  return v_row.licensed
    and v_row.enabled
    and v_row.status in ('enabled', 'trial', 'beta');
end;
$$;

revoke all on function public._wpsi_is_tenant_module_enabled_readonly(uuid, text)
  from public, anon, authenticated;
grant execute on function public._wpsi_is_tenant_module_enabled_readonly(uuid, text)
  to service_role;

comment on function public._wpsi_is_tenant_module_enabled_readonly(uuid, text) is
  'Read-only Website Kompis public-index module gate. SELECT tenant_modules only; never sync/insert.';

-- ---------------------------------------------------------------------------
-- 2. Read-only install/host assert for public search
-- ---------------------------------------------------------------------------
create or replace function public._wpsi_assert_tenant_host_install_readonly(
  p_tenant_id uuid,
  p_install_id uuid,
  p_verified_host text
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_host text;
  v_install public.installations;
begin
  v_host := lower(trim(coalesce(p_verified_host, '')));
  if p_tenant_id is null or v_host = '' then
    return false;
  end if;

  if not exists (
    select 1
    from public.customer_domains cd
    where cd.customer_id = p_tenant_id
      and cd.domain = v_host
      and cd.verification_status = 'verified'
      and cd.status = 'active'
  ) then
    return false;
  end if;

  if not coalesce(
    public._wpsi_is_tenant_module_enabled_readonly(p_tenant_id, 'website_kompis'),
    false
  ) then
    return false;
  end if;

  if p_install_id is not null then
    select *
    into v_install
    from public.installations i
    where i.id = p_install_id
      and i.revoked_at is null
      and i.status in ('ready', 'installing', 'active', 'warning')
    limit 1;

    if v_install.id is null then
      return false;
    end if;

    if coalesce(
      v_install.customer_id,
      (
        select c.id
        from public.customers c
        where c.company_id = v_install.company_id
        limit 1
      )
    ) is distinct from p_tenant_id then
      return false;
    end if;
  end if;

  return true;
end;
$$;

revoke all on function public._wpsi_assert_tenant_host_install_readonly(uuid, uuid, text)
  from public, anon, authenticated;
grant execute on function public._wpsi_assert_tenant_host_install_readonly(uuid, uuid, text)
  to service_role;

comment on function public._wpsi_assert_tenant_host_install_readonly(uuid, uuid, text) is
  'Read-only host/install/module assert for search_tenant_public_site_index. No commercial sync.';

-- ---------------------------------------------------------------------------
-- 3. Point public search at the read-only assert (body otherwise unchanged)
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
  v_install_id uuid;
  v_locale text;
  v_query text;
  v_limit integer;
  v_tokens text[];
begin
  v_query := trim(coalesce(p_query, ''));
  if length(v_query) < 2 then
    return;
  end if;

  -- Require install id for public site index (stricter than FAQ-only domain fallback).
  if p_install_id is null then
    return;
  end if;

  v_limit := greatest(1, least(coalesce(p_limit, 5), 8));
  v_locale := lower(trim(coalesce(nullif(p_locale, ''), 'no')));
  if length(v_locale) > 16 then
    v_locale := 'no';
  end if;

  select c.tenant_id, c.resolved_domain, c.resolved_install_id
  into v_tenant_id, v_domain, v_install_id
  from public._wpkf_resolve_visitor_context(p_install_id, p_domain) c
  limit 1;

  if v_tenant_id is null or v_domain is null or v_install_id is null then
    return;
  end if;

  -- REPAIR.09: read-only assert (no is_tenant_module_enabled / commercial sync).
  if not public._wpsi_assert_tenant_host_install_readonly(v_tenant_id, v_install_id, v_domain) then
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
      and d.verified_host = v_domain
      and d.status = 'active'
      and d.robots_allowed = true
      and d.stale_after > now()
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

comment on function public.search_tenant_public_site_index(uuid, text, text, text, integer) is
  'Public Website Kompis site-index search. STABLE read path; uses read-only host/module assert.';
