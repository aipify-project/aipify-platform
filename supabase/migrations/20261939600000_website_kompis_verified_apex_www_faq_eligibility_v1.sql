-- WEBSITE KOMPIS — verified apex/www FAQ domain eligibility v1
-- Exact task: AIPIFY_KOMPIS_CORE_VERIFIED_APEX_WWW_FAQ_ELIGIBILITY_REPAIR_V1
-- Feature owner: Aipify Core (SQL) · frozen Public Chain TypeScript unchanged
--
-- PREPARE / LOCAL ONLY until owner authorizes Staging/Production apply by
-- exact migration filename + SHA-256.
--
-- Changes (narrow):
-- 1) Helpers for exact one-label apex↔www pair + install-bound verified hosts
-- 2) search_tenant_public_visitor_knowledge domain eligibility keeps
--    NULL / exact host, and additionally allows FAQ domain when it is the
--    exact apex↔www pair of resolved_domain AND BOTH hostnames are
--    verified + active customer_domains bound to the SAME resolved installation
--
-- Not changed: RPC signature, result columns, ranking/scoring, locale/status/
-- public_safe/surface/install isolation filters, grants, search_path,
-- _wpkf_resolve_visitor_context, upsert, frozen ask/FAQ TypeScript.

-- ---------------------------------------------------------------------------
-- Helper: exact one-label apex ↔ www pair (mirrors isExactApexWwwPair TS)
-- ---------------------------------------------------------------------------
create or replace function public._wpkf_is_exact_apex_www_pair(
  p_left text,
  p_right text
)
returns boolean
language sql
immutable
set search_path = public
as $$
  with n as (
    select
      public.normalize_domain(p_left) as a,
      public.normalize_domain(p_right) as b
  ),
  cores as (
    select
      a,
      b,
      (a like 'www.%') as a_www,
      (b like 'www.%') as b_www,
      rtrim(
        case when a like 'www.%' then substring(a from 5) else a end,
        '.'
      ) as a_core,
      rtrim(
        case when b like 'www.%' then substring(b from 5) else b end,
        '.'
      ) as b_core
    from n
  )
  select
    a is not null
    and b is not null
    and a <> b
    and a_www <> b_www
    and a_core <> ''
    and position('.' in a_core) > 0
    and a_core not like 'www.%'
    and a_core = b_core
  from cores;
$$;

revoke all on function public._wpkf_is_exact_apex_www_pair(text, text)
  from public, anon, authenticated;

comment on function public._wpkf_is_exact_apex_www_pair(text, text) is
  'FROZEN contract helper: true only for an exact one-label www ↔ apex hostname pair after normalize_domain. Not a general www strip.';

-- ---------------------------------------------------------------------------
-- Helper: FAQ domain eligible for visitor resolved host
-- ---------------------------------------------------------------------------
create or replace function public._wpkf_faq_domain_eligible_for_resolved_visitor(
  p_faq_domain text,
  p_resolved_domain text,
  p_tenant_id uuid,
  p_resolved_install_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    case
      when p_faq_domain is null or p_resolved_domain is null then true
      when public.normalize_domain(p_faq_domain)
        = public.normalize_domain(p_resolved_domain) then true
      when not public._wpkf_is_exact_apex_www_pair(p_faq_domain, p_resolved_domain)
        then false
      when p_tenant_id is null or p_resolved_install_id is null then false
      else (
        select count(*) = 2
        from (
          select distinct public.normalize_domain(cd.domain) as d
          from public.customer_domains cd
          where cd.customer_id = p_tenant_id
            and public.normalize_domain(cd.domain) in (
              public.normalize_domain(p_faq_domain),
              public.normalize_domain(p_resolved_domain)
            )
            and cd.verification_status = 'verified'
            and lower(trim(cd.status)) = 'active'
            and cd.installation_id = p_resolved_install_id
        ) hosts
      )
    end;
$$;

revoke all on function public._wpkf_faq_domain_eligible_for_resolved_visitor(text, text, uuid, uuid)
  from public, anon, authenticated;

comment on function public._wpkf_faq_domain_eligible_for_resolved_visitor(text, text, uuid, uuid) is
  'FROZEN: FAQ visitor domain eligibility — NULL/exact host, or install-bound verified apex↔www pair only. Changing this predicate requires owner approval + updated contract tests.';

-- ---------------------------------------------------------------------------
-- Visitor search: domain eligibility only (rest identical to 202619382)
-- ---------------------------------------------------------------------------
create or replace function public.search_tenant_public_visitor_knowledge(
  p_install_id uuid default null,
  p_domain text default null,
  p_locale text default 'no',
  p_query text default null,
  p_pathname text default null,
  p_limit integer default 5
)
returns table (
  item_id uuid,
  title text,
  answer text,
  category text,
  content_type text,
  locale text,
  source_url text,
  score numeric,
  matched_reason text
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_query text;
  v_locale text;
  v_limit integer;
  v_pathname text;
  v_tokens text[];
begin
  v_query := lower(trim(coalesce(p_query, '')));
  v_locale := lower(trim(coalesce(nullif(p_locale, ''), 'no')));
  v_limit := least(greatest(coalesce(p_limit, 5), 1), 10);
  v_pathname := lower(trim(coalesce(p_pathname, '')));
  v_tokens := public._wpkf_faq_query_tokens(v_query);

  return query
  with ctx as (
    select c.tenant_id, c.resolved_install_id, c.resolved_domain
    from public._wpkf_resolve_visitor_context(p_install_id, p_domain) c
    where c.tenant_id is not null
      and c.resolved_install_id is not null
    limit 1
  ),
  install_stats as (
    select
      ctx.tenant_id,
      ctx.resolved_install_id,
      ctx.resolved_domain,
      public._wpkf_count_active_verified_installs(ctx.tenant_id) as active_verified_install_count
    from ctx
  ),
  filtered as (
    select
      f.id,
      f.title,
      f.answer,
      f.category,
      f.content_type,
      f.locale,
      f.source_url,
      f.priority,
      f.published_at,
      f.updated_at,
      (
        case when v_query = '' then 1 else 0 end
        + case when v_query <> '' and lower(f.title) like '%' || v_query || '%' then 40 else 0 end
        + case when v_query <> '' and lower(coalesce(f.question, '')) like '%' || v_query || '%' then 30 else 0 end
        + case when v_query <> '' and lower(f.answer) like '%' || v_query || '%' then 20 else 0 end
        + case when v_query <> '' and lower(coalesce(f.category, '')) like '%' || v_query || '%' then 15 else 0 end
        + case
            when v_query <> '' and exists (
              select 1
              from unnest(f.tags) tag
              where lower(tag) like '%' || v_query || '%'
            ) then 25
            else 0
          end
        + case
            when v_query <> '' and lower(f.content_type) like '%' || v_query || '%' then 10
            else 0
          end
        + case
            when v_pathname <> ''
              and f.content_type = 'link'
              and lower(coalesce(f.source_url, '')) like '%' || v_pathname || '%'
            then 10
            else 0
          end
        + coalesce((
            select sum(
              case when lower(f.title) like '%' || tok || '%' then 12 else 0 end
              + case when lower(coalesce(f.question, '')) like '%' || tok || '%' then 10 else 0 end
              + case when lower(f.answer) like '%' || tok || '%' then 8 else 0 end
              + case when lower(coalesce(f.category, '')) like '%' || tok || '%' then 5 else 0 end
              + case when lower(f.content_type) like '%' || tok || '%' then 4 else 0 end
              + case
                  when exists (
                    select 1
                    from unnest(f.tags) tag
                    where lower(tag) like '%' || tok || '%'
                  ) then 6
                  else 0
                end
            )
            from unnest(v_tokens) tok
          ), 0)
      )::numeric as score,
      case
        when v_query = '' then 'priority'
        when lower(f.title) like '%' || v_query || '%' then 'title_match'
        when lower(coalesce(f.question, '')) like '%' || v_query || '%' then 'question_match'
        when lower(f.answer) like '%' || v_query || '%' then 'answer_match'
        when lower(coalesce(f.category, '')) like '%' || v_query || '%' then 'category_match'
        when exists (
          select 1
          from unnest(f.tags) tag
          where lower(tag) like '%' || v_query || '%'
        ) then 'tag_match'
        when lower(f.content_type) like '%' || v_query || '%' then 'content_type_match'
        when v_pathname <> ''
          and f.content_type = 'link'
          and lower(coalesce(f.source_url, '')) like '%' || v_pathname || '%'
        then 'pathname_link_match'
        when exists (
          select 1
          from unnest(v_tokens) tok
          where lower(f.title) like '%' || tok || '%'
            or lower(coalesce(f.question, '')) like '%' || tok || '%'
            or lower(f.answer) like '%' || tok || '%'
            or lower(coalesce(f.category, '')) like '%' || tok || '%'
            or lower(f.content_type) like '%' || tok || '%'
            or exists (
              select 1
              from unnest(f.tags) tag
              where lower(tag) like '%' || tok || '%'
            )
        ) then 'token_match'
        else 'fallback'
      end as matched_reason
    from public.tenant_public_companion_faq_items f
    inner join install_stats s on s.tenant_id = f.tenant_id
    where f.status = 'published'
      and f.public_safe = true
      and f.surface = 'website_kompis'
      and f.locale in (v_locale, 'en')
      and (f.valid_from is null or f.valid_from <= now())
      and (f.valid_until is null or f.valid_until >= now())
      and (
        f.install_id = s.resolved_install_id
        or (
          f.install_id is null
          and s.active_verified_install_count = 1
        )
      )
      and public._wpkf_faq_domain_eligible_for_resolved_visitor(
        f.domain,
        s.resolved_domain,
        s.tenant_id,
        s.resolved_install_id
      )
      and (
        v_query = ''
        or lower(f.title) like '%' || v_query || '%'
        or lower(coalesce(f.question, '')) like '%' || v_query || '%'
        or lower(f.answer) like '%' || v_query || '%'
        or lower(coalesce(f.category, '')) like '%' || v_query || '%'
        or lower(f.content_type) like '%' || v_query || '%'
        or exists (
          select 1
          from unnest(f.tags) tag
          where lower(tag) like '%' || v_query || '%'
        )
        or exists (
          select 1
          from unnest(v_tokens) tok
          where lower(f.title) like '%' || tok || '%'
            or lower(coalesce(f.question, '')) like '%' || tok || '%'
            or lower(f.answer) like '%' || tok || '%'
            or lower(coalesce(f.category, '')) like '%' || tok || '%'
            or lower(f.content_type) like '%' || tok || '%'
            or exists (
              select 1
              from unnest(f.tags) tag
              where lower(tag) like '%' || tok || '%'
            )
        )
      )
  )
  select
    filtered.id as item_id,
    filtered.title,
    filtered.answer,
    filtered.category,
    filtered.content_type,
    filtered.locale,
    filtered.source_url,
    filtered.score,
    filtered.matched_reason
  from filtered
  order by
    case when filtered.locale = v_locale then 0 else 1 end,
    filtered.score desc,
    filtered.priority asc,
    filtered.published_at desc nulls last,
    filtered.updated_at desc
  limit v_limit;
end;
$$;

revoke all on function public.search_tenant_public_visitor_knowledge(uuid, text, text, text, text, integer) from public;
grant execute on function public.search_tenant_public_visitor_knowledge(uuid, text, text, text, text, integer) to anon;

comment on function public.search_tenant_public_visitor_knowledge(uuid, text, text, text, text, integer) is
  'Public visitor FAQ search. Domain eligibility: NULL/exact host, or FROZEN install-bound verified apex↔www pair via _wpkf_faq_domain_eligible_for_resolved_visitor.';
