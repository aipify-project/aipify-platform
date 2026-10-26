-- Website Kompis public site-index: body-window evidence for selective stem/body hits.
-- Source candidate (local proven): AIPIFY_KOMPIS_CORE_COMMISSION_SQL_BODY_EVIDENCE_V1_TERMINATOR_REPAIR_CANDIDATE_20261026.sql
-- Source SHA256: 7c55dd65500670a344ef0e84e24d965b59641ffac2fb98a7e2da92fddb85389d
-- Semantically identical CREATE OR REPLACE body; migration adds explicit REVOKE/GRANT for repo convention.
-- Does NOT change signature, tables, RLS, crawl, or the 8-row cap (least(p_limit, 8)).
-- NOT auto-applied to Staging/Production by this commit — owner SQL gate required.
-- Feature owner: INSTALL ENGINE / Kompis Core shared search RPC (APP+embed consumers).

CREATE OR REPLACE FUNCTION public.search_tenant_public_site_index(p_install_id uuid, p_domain text, p_locale text, p_query text, p_limit integer DEFAULT 5)
 RETURNS TABLE(document_id uuid, chunk_id uuid, title text, canonical_url text, pathname text, locale text, excerpt text, chunk_content text, score numeric, matched_reason text, crawled_at timestamp with time zone)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_tenant_id uuid;
  v_domain text;
  v_install_id uuid;
  v_locale text;
  v_query text;
  v_limit integer;
  v_tokens text[];
  v_price boolean;
begin
  v_query := trim(coalesce(p_query, ''));
  if length(v_query) < 2 then
    return;
  end if;

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

  if not public._wpsi_assert_tenant_host_install_readonly(v_tenant_id, v_install_id, v_domain) then
    return;
  end if;

  v_tokens := public._wpsi_query_tokens(v_query);
  v_tokens := array(
    select t
    from unnest(coalesce(v_tokens, array[]::text[])) as t
    where t ~ '^[0-9a-zåäöæøüß]+$'
  );
  if coalesce(array_length(v_tokens, 1), 0) = 0 then
    return;
  end if;

  v_price := exists (
    select 1
    from unnest(v_tokens) as tok
    where tok in ('koster', 'pris', 'price', 'cost', 'kost', 'kostnader', 'prices')
  );

  return query
  with docs as (
    select
      d.id,
      d.tenant_id,
      d.title,
      d.canonical_url,
      d.pathname,
      d.locale,
      d.excerpt,
      d.meta_description,
      d.body_text,
      d.crawled_at
    from public.tenant_public_site_index_documents d
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
  ),
  stats as (
    select
      tok,
      count(*)::int as docs,
      count(*) filter (where docs.title ~* ('\m' || tok))::int as title_hits,
      count(*) filter (
        where docs.pathname ~* ('(^|/)' || tok || '($|/|-)')
      )::int as path_hits,
      count(*) filter (
        where coalesce(docs.body_text, '') ~* ('\m' || tok || '\M')
      )::int as body_hits,
      count(*) filter (
        where length(tok) >= 8
          and coalesce(docs.body_text, '') ~* ('\m' || tok)
          and not coalesce(docs.body_text, '') ~* ('\m' || tok || '\M')
      )::int as stem_hits
    from docs
    cross join unnest(v_tokens) as tok
    group by tok
  ),
  usable as (
    select
      tok,
      not (title_hits >= 3 and title_hits::numeric / docs > 0.40) as title_ok,
      not (path_hits >= 3 and path_hits::numeric / docs > 0.40) as path_ok,
      not (body_hits >= 3 and body_hits::numeric / docs > 0.40) as body_ok,
      not (stem_hits >= 3 and stem_hits::numeric / docs > 0.40) as stem_ok
    from stats
    where docs > 0
  ),
  doc_scores as (
    select
      d.*,
      (
        select coalesce(sum(
          case
            when d.pathname ~* ('(^|/)' || u.tok || '($|/|-)') and u.path_ok then 28
            when d.title ~* ('\m' || u.tok) and u.title_ok then 24
            when coalesce(d.body_text, '') ~* ('\m' || u.tok || '\M') and u.body_ok then 8
            when length(u.tok) >= 8
              and u.stem_ok
              and coalesce(d.body_text, '') ~* ('\m' || u.tok)
              and not coalesce(d.body_text, '') ~* ('\m' || u.tok || '\M') then 8
            else 0
          end
        ), 0)
        from usable u
      )::numeric as field_sum
    from docs d
  ),
  body_windows as (
    select
      guarded.document_id,
      case
        when guarded.window_text is null then null
        when char_length(guarded.window_text) > 900 then null
        when not (
          guarded.window_text ~* ('\m' || guarded.tok || '\M')
          or (
            length(guarded.tok) >= 8
            and guarded.window_text ~* ('\m' || guarded.tok)
          )
        ) then null
        else guarded.window_text
      end as window_text
    from (
      select
        snapped.document_id,
        snapped.tok,
        btrim(substring(
          snapped.body_text
          from snapped.win_start
          for snapped.win_end - snapped.win_start + 1
        )) as window_text
      from (
        select
          loose.document_id,
          loose.tok,
          loose.body_text,
          case
            when loose.sentence_tail is not null
              then loose.start_pos - char_length(loose.sentence_tail)
            when loose.loose_start > 1
              and substring(loose.body_text from loose.loose_start - 1 for 1) ~ '[0-9A-Za-zÅÄÖÆØÜåäöæøüß]'
              then least(
                loose.start_pos,
                loose.loose_start + char_length(coalesce((
                  regexp_match(
                    substring(
                      loose.body_text
                      from loose.loose_start
                      for greatest(loose.start_pos - loose.loose_start, 0)
                    ),
                    '^[0-9A-Za-zÅÄÖÆØÜåäöæøüß]*'
                  )
                )[1], ''))
              )
            else loose.loose_start
          end as win_start,
          loose.word_end + char_length(
            case
              when loose.sentence_right is not null then loose.sentence_right
              else regexp_replace(
                loose.right_part,
                '[0-9A-Za-zÅÄÖÆØÜåäöæøüß]+$',
                ''
              )
            end
          ) as win_end
        from (
          select
            bounds.document_id,
            bounds.tok,
            bounds.body_text,
            bounds.start_pos,
            bounds.word_end,
            bounds.loose_start,
            (
              regexp_match(
                substring(
                  bounds.body_text
                  from bounds.loose_start
                  for greatest(bounds.start_pos - bounds.loose_start, 0)
                ),
                '(?s).*[.!?][[:space:]](.*)$'
              )
            )[1] as sentence_tail,
            substring(
              bounds.body_text
              from bounds.word_end + 1
              for greatest(bounds.loose_end - bounds.word_end, 0)
            ) as right_part,
            (
              regexp_match(
                substring(
                  bounds.body_text
                  from bounds.word_end + 1
                  for greatest(bounds.loose_end - bounds.word_end, 0)
                ),
                '(?s)^(.*?[.!?])'
              )
            )[1] as sentence_right
          from (
            select
              hit.document_id,
              hit.tok,
              hit.body_text,
              hit.start_pos,
              hit.start_pos + char_length(hit.tok) - 1 as word_end,
              hit.start_pos - least(200, hit.start_pos - 1) as loose_start,
              least(
                hit.body_len,
                hit.start_pos + char_length(hit.tok) - 1 + least(
                  900 - char_length(hit.tok) - least(200, hit.start_pos - 1),
                  hit.body_len - (hit.start_pos + char_length(hit.tok) - 1)
                )
              ) as loose_end
            from (
              select distinct on (d.id)
                d.id as document_id,
                d.body_text,
                u.tok,
                char_length(d.body_text) as body_len,
                coalesce(
                  case
                    when coalesce(d.body_text, '') ~* ('\m' || u.tok || '\M') then
                      char_length((
                        regexp_match(
                          d.body_text,
                          '(?s)^(.*?)\m' || u.tok || '\M',
                          'i'
                        )
                      )[1]) + 1
                  end,
                  case
                    when length(u.tok) >= 8 then
                      char_length((
                        regexp_match(
                          d.body_text,
                          '(?s)^(.*?)\m' || u.tok,
                          'i'
                        )
                      )[1]) + 1
                  end
                ) as start_pos
              from doc_scores d
              join usable u
                on char_length(coalesce(d.body_text, '')) >= 2
               and (
                 (
                   u.body_ok
                   and coalesce(d.body_text, '') ~* ('\m' || u.tok || '\M')
                 )
                 or (
                   length(u.tok) >= 8
                   and u.stem_ok
                   and coalesce(d.body_text, '') ~* ('\m' || u.tok)
                   and not coalesce(d.body_text, '') ~* ('\m' || u.tok || '\M')
                 )
               )
               and not exists (
                 select 1
                 from public.tenant_public_site_index_chunks ch
                 where ch.document_id = d.id
                   and ch.tenant_id = d.tenant_id
                   and (
                     (
                       u.body_ok
                       and coalesce(ch.content, '') ~* ('\m' || u.tok || '\M')
                     )
                     or (
                       length(u.tok) >= 8
                       and u.stem_ok
                       and coalesce(ch.content, '') ~* ('\m' || u.tok)
                     )
                   )
               )
              where d.field_sum > 0
              order by d.id, char_length(u.tok) desc, u.tok
            ) hit
            where hit.start_pos is not null
              and hit.start_pos >= 1
          ) bounds
        ) loose
      ) snapped
      where snapped.win_end >= snapped.win_start
    ) guarded
  ),
  picked_chunk as (
    select distinct on (d.id)
      d.id,
      d.tenant_id,
      d.title,
      d.canonical_url,
      d.pathname,
      d.locale,
      d.excerpt,
      d.meta_description,
      d.body_text,
      d.crawled_at,
      d.field_sum,
      ch.id as chunk_id,
      ch.content as stored_chunk,
      exists (
        select 1
        from usable u
        where (
            u.body_ok
            and coalesce(ch.content, '') ~* ('\m' || u.tok || '\M')
          )
          or (
            length(u.tok) >= 8
            and u.stem_ok
            and coalesce(ch.content, '') ~* ('\m' || u.tok)
          )
      ) as chunk_has_word
    from doc_scores d
    join public.tenant_public_site_index_chunks ch
      on ch.document_id = d.id
     and ch.tenant_id = d.tenant_id
    where d.field_sum > 0
    order by
      d.id,
      (
        exists (
          select 1
          from usable u
          where (
              u.body_ok
              and coalesce(ch.content, '') ~* ('\m' || u.tok || '\M')
            )
            or (
              length(u.tok) >= 8
              and u.stem_ok
              and coalesce(ch.content, '') ~* ('\m' || u.tok)
            )
        )
      ) desc,
      (
        exists (
          select 1
          from usable u
          where (d.pathname ~* ('(^|/)' || u.tok || '($|/|-)') and u.path_ok)
            or (d.title ~* ('\m' || u.tok) and u.title_ok)
            or (coalesce(ch.content, '') ~* ('\m' || u.tok || '\M') and u.body_ok)
            or (
              length(u.tok) >= 8
              and u.stem_ok
              and coalesce(ch.content, '') ~* ('\m' || u.tok)
              and not coalesce(ch.content, '') ~* ('\m' || u.tok || '\M')
            )
        )
      ) desc,
      ch.chunk_index,
      ch.id
  ),
  picked as (
    select
      pc.id as document_id,
      pc.chunk_id,
      pc.title,
      pc.canonical_url,
      pc.pathname,
      pc.locale,
      case
        when pc.chunk_has_word or bw.window_text is null then
          left(coalesce(nullif(pc.excerpt, ''), pc.meta_description, pc.stored_chunk), 420)
        else left(bw.window_text, 420)
      end as excerpt,
      case
        when pc.chunk_has_word or bw.window_text is null then pc.stored_chunk
        else bw.window_text
      end as chunk_content,
      (pc.field_sum + case when pc.locale = v_locale then 12 else 0 end)::numeric as score,
      case
        when not pc.chunk_has_word and bw.window_text is not null then 'public_site_index_body_window'
        else 'public_site_index'
      end as matched_reason,
      pc.crawled_at
    from picked_chunk pc
    left join body_windows bw
      on bw.document_id = pc.id
  ),
  strong as (
    select
      picked.document_id,
      picked.chunk_id,
      picked.title,
      picked.canonical_url,
      picked.pathname,
      picked.locale,
      picked.excerpt,
      picked.chunk_content,
      picked.score,
      picked.matched_reason,
      picked.crawled_at
    from picked
    where picked.score >= 16
  ),
  flags as (
    select
      exists (select 1 from strong) as has_strong,
      coalesce((
        select bool_and(
          stats.title_hits = 0
          and stats.path_hits = 0
          and stats.body_hits = 0
          and stats.stem_hits = 0
        )
        from stats
      ), true) as all_miss
  ),
  fallback as (
    select distinct on (d.id)
      d.id as document_id,
      ch.id as chunk_id,
      d.title,
      d.canonical_url,
      d.pathname,
      d.locale,
      left(coalesce(nullif(d.excerpt, ''), d.meta_description, ch.content), 420) as excerpt,
      ch.content as chunk_content,
      (
        case
          when d.pathname ~* '/how-it-works$' then 40
          when d.pathname ~* '/about$' then 32
          when d.pathname ~* '/om-oss$' then 28
          else 0
        end
        + case when d.locale = v_locale then 12 else 0 end
      )::numeric as score,
      'public_site_index'::text as matched_reason,
      d.crawled_at
    from docs d
    join public.tenant_public_site_index_chunks ch
      on ch.document_id = d.id
     and ch.tenant_id = d.tenant_id
    cross join flags f
    where f.has_strong = false
      and v_price = false
      and f.all_miss = false
      and d.pathname ~* '/(how-it-works|about|om-oss)$'
    order by d.id, ch.chunk_index, ch.id
  )
  select
    ranked.document_id,
    ranked.chunk_id,
    ranked.title,
    ranked.canonical_url,
    ranked.pathname,
    ranked.locale,
    ranked.excerpt,
    ranked.chunk_content,
    ranked.score,
    ranked.matched_reason,
    ranked.crawled_at
  from (
    select * from strong
    union all
    select * from fallback
  ) ranked
  order by ranked.score desc, ranked.crawled_at desc, ranked.pathname asc
  limit v_limit;
end;
$function$;

comment on function public.search_tenant_public_site_index(uuid, text, text, text, integer) is
  $comment$Public Website Kompis site-index search. Field-weighted recall: a title, path segment, or body word scores only when that field is selective. One row per document. Windows of any size keep a rare field. When no stored chunk contains the same selective body evidence, chunk_content is a same-document body window of at most 900 characters and matched_reason is public_site_index_body_window. Evidence is a closed word, or for a token of at least 8 characters the existing word-start stem. The window is not cut inside that word.$comment$;

-- Preserve EXECUTE contract (idempotent with existing Production/local grants).
revoke all on function public.search_tenant_public_site_index(uuid, text, text, text, integer)
  from public;
grant execute on function public.search_tenant_public_site_index(uuid, text, text, text, integer)
  to anon, authenticated, service_role;
