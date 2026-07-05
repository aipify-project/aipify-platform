-- WEBSITE.KOMPIS.FAQ.RETRIEVAL.WIDTH — token-aware public FAQ search
-- Widens search_tenant_public_visitor_knowledge to match answer/category tokens,
-- not only full-query title/category phrasing.

create or replace function public._wpkf_faq_query_tokens(p_query text)
returns text[]
language sql
immutable
as $$
  select coalesce(array_agg(distinct token order by token), '{}'::text[])
  from (
    select trim(token) as token
    from unnest(
      regexp_split_to_array(
        lower(trim(coalesce(p_query, ''))),
        '[^[:alnum:][:space:]æøå]+'
      )
    ) as token
    where length(trim(token)) >= 2
      and trim(token) not in (
        'har','det','den','der','som','kan','jeg','vi','er','når','hva','hvor',
        'du','dere','deg','din','mitt','vår','for','med','til','fra','om','ikke',
        'eller','en','et','i','på','av','the','and','you','your','our','are','can',
        'how','what','when','where','who','why','is','it','be','to','of','in','on',
        'at','by','an','as','we','me','my','do','does','did'
      )
  ) t
  where token <> '';
$$;

revoke all on function public._wpkf_faq_query_tokens(text) from public, anon;

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
    limit 1
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
    inner join ctx on ctx.tenant_id = f.tenant_id
    where f.status = 'published'
      and f.public_safe = true
      and f.surface = 'website_kompis'
      and f.locale in (v_locale, 'en')
      and (f.valid_from is null or f.valid_from <= now())
      and (f.valid_until is null or f.valid_until >= now())
      and (f.install_id is null or f.install_id = ctx.resolved_install_id)
      and (
        f.domain is null
        or ctx.resolved_domain is null
        or f.domain = ctx.resolved_domain
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
