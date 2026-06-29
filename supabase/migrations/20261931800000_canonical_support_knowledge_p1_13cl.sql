-- P1.13CL — Canonical support knowledge context (durable metadata-only sources)

-- ---------------------------------------------------------------------------
-- 1. organization_support_case_knowledge_contexts
-- ---------------------------------------------------------------------------
create table if not exists public.organization_support_case_knowledge_contexts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  case_id uuid not null,
  sources jsonb not null default '[]'::jsonb,
  status text not null,
  understanding_message_set_hash text not null,
  knowledge_catalog_hash text not null,
  engine_key text not null,
  engine_version text not null,
  retrieved_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organization_support_case_knowledge_contexts_case_org_fkey
    foreign key (case_id, organization_id)
    references public.organization_support_cases (id, organization_id)
    on delete cascade,
  constraint organization_support_case_knowledge_contexts_org_case_key
    unique (organization_id, case_id),
  constraint organization_support_case_knowledge_contexts_sources_array check (
    jsonb_typeof(sources) = 'array'
  ),
  constraint organization_support_case_knowledge_contexts_status_check check (
    status in ('complete', 'needs_human_knowledge_review')
  )
);

create index if not exists organization_support_case_knowledge_contexts_org_case_idx
  on public.organization_support_case_knowledge_contexts (organization_id, case_id);

alter table public.organization_support_case_knowledge_contexts enable row level security;
revoke all on public.organization_support_case_knowledge_contexts from public, authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Internal helpers (RPC-only)
-- ---------------------------------------------------------------------------
create or replace function public._sai_knowledge_retrieve_lock_key(
  p_organization_id uuid,
  p_case_id uuid
)
returns bigint
language sql
immutable
set search_path = public
as $$
  select hashtextextended(
    'support_knowledge_retrieve:' || coalesce(p_organization_id::text, '') || ':' || coalesce(p_case_id::text, ''),
    0
  );
$$;

create or replace function public._sai_knowledge_is_known_locale(p_language text)
returns boolean
language sql
immutable
set search_path = public
as $$
  select coalesce(lower(btrim(p_language)), '') in ('en', 'no', 'sv', 'da', 'pl', 'uk');
$$;

create or replace function public._sai_knowledge_sanitize_locale(p_language text)
returns text
language sql
immutable
set search_path = public
as $$
  select case
    when public._sai_knowledge_is_known_locale(p_language) then lower(btrim(p_language))
    else null
  end;
$$;

create or replace function public._sai_knowledge_resolve_search_languages(
  p_organization_id uuid,
  p_understanding_language text
)
returns table (
  primary_language text,
  fallback_language text
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_understanding_lang text := public._sai_knowledge_sanitize_locale(p_understanding_language);
  v_org_default text;
  v_org_fallback text;
  v_primary text;
  v_fallback text;
begin
  select o.default_language, o.fallback_language
  into v_org_default, v_org_fallback
  from public.organizations o
  where o.id = p_organization_id;

  v_org_default := public._sai_knowledge_sanitize_locale(v_org_default);
  v_org_fallback := public._sai_knowledge_sanitize_locale(v_org_fallback);

  if v_understanding_lang is not null
    and lower(btrim(coalesce(p_understanding_language, ''))) <> 'unknown' then
    v_primary := v_understanding_lang;
  elsif v_org_default is not null then
    v_primary := v_org_default;
  else
    v_primary := 'en';
  end if;

  if v_org_fallback is not null and v_org_fallback <> v_primary then
    v_fallback := v_org_fallback;
  elsif v_primary <> 'en' then
    v_fallback := 'en';
  else
    v_fallback := v_primary;
  end if;

  return query select v_primary, v_fallback;
end;
$$;

create or replace function public._sai_knowledge_build_retrieval_query(
  p_subject text,
  p_summary text,
  p_intent text,
  p_category text
)
returns text
language sql
immutable
set search_path = public
as $$
  select btrim(
    coalesce(nullif(btrim(p_subject), ''), '') || ' ' ||
    coalesce(nullif(btrim(p_summary), ''), '') || ' ' ||
    coalesce(nullif(btrim(p_intent), ''), '') || ' ' ||
    coalesce(nullif(btrim(p_category), ''), '')
  );
$$;

create or replace function public._sai_knowledge_catalog_hash(
  p_organization_id uuid,
  p_primary_language text,
  p_fallback_language text
)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_payload text;
begin
  select string_agg(row_line, E'\n' order by source_type, source_id)
  into v_payload
  from (
    select
      'article' as source_type,
      a.id::text as source_id,
      'article' || '|' || a.id::text || '|' || a.version::text || '|' || a.status || '|' || a.visibility || '|' || a.language || '|'
        || coalesce(a.updated_at, a.published_at, a.created_at)::text as row_line
    from public.knowledge_articles a
    where a.organization_id = p_organization_id
      and a.status = 'published'
      and a.visibility in ('customer', 'public')
      and a.language in (p_primary_language, p_fallback_language)

    union all

    select
      'faq' as source_type,
      f.id::text as source_id,
      'faq' || '|' || f.id::text || '|1|' || f.status || '|' || f.visibility || '|' || f.language || '|'
        || coalesce(f.updated_at, f.created_at)::text as row_line
    from public.knowledge_faq_items f
    where f.organization_id = p_organization_id
      and f.status = 'published'
      and f.visibility in ('customer', 'public')
      and f.language in (p_primary_language, p_fallback_language)
  ) candidates;

  if v_payload is null or v_payload = '' then
    return encode(extensions.digest('empty', 'sha256'), 'hex');
  end if;

  return encode(extensions.digest(v_payload, 'sha256'), 'hex');
end;
$$;

create or replace function public._sai_knowledge_rank_sources(
  p_organization_id uuid,
  p_query text,
  p_category text,
  p_primary_language text,
  p_fallback_language text
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_query text := btrim(coalesce(p_query, ''));
  v_category text := lower(btrim(coalesce(p_category, '')));
  v_tsquery tsquery;
  v_min_score numeric := 0.20;
  v_max_sources int := 5;
begin
  if length(v_query) > 0 then
    v_tsquery := plainto_tsquery('simple', v_query);
  end if;

  return coalesce((
    with candidates as (
      select
        a.id as source_id,
        'article'::text as source_type,
        a.title,
        a.slug,
        a.language,
        a.version,
        coalesce(a.updated_at, a.published_at, a.created_at) as updated_at,
        case
          when a.language = p_primary_language then false
          when a.language = p_fallback_language then true
          else true
        end as is_language_fallback,
        least(
          1.0,
          greatest(
            0.0,
            coalesce(
              case when v_tsquery is not null then ts_rank(a.search_vector, v_tsquery) * 2.0 else 0.0 end,
              0.0
            )
            + case when v_category <> '' and c.slug = v_category then 0.25 else 0.0 end
          )
        ) as relevance_score,
        case
          when v_category <> '' and c.slug = v_category then 'category_match'
          when v_tsquery is not null and a.search_vector @@ v_tsquery then 'text_match'
          when a.language = p_fallback_language and a.language <> p_primary_language then 'language_fallback'
          else 'text_match'
        end as relevance_reason_code
      from public.knowledge_articles a
      left join public.knowledge_categories c on c.id = a.category_id
      where a.organization_id = p_organization_id
        and a.status = 'published'
        and a.visibility in ('customer', 'public')
        and a.language in (p_primary_language, p_fallback_language)
        and (
          v_tsquery is null
          or a.search_vector @@ v_tsquery
          or (v_category <> '' and c.slug = v_category)
        )

      union all

      select
        f.id as source_id,
        'faq'::text as source_type,
        f.question as title,
        f.slug,
        f.language,
        1 as version,
        coalesce(f.updated_at, f.created_at) as updated_at,
        case
          when f.language = p_primary_language then false
          when f.language = p_fallback_language then true
          else true
        end as is_language_fallback,
        least(
          1.0,
          greatest(
            0.0,
            case
              when v_query <> '' and f.question ilike '%' || v_query || '%' then 0.55
              when v_query <> '' and f.answer ilike '%' || v_query || '%' then 0.35
              else 0.10
            end
            + case when v_category <> '' and c.slug = v_category then 0.25 else 0.0 end
          )
        ) as relevance_score,
        case
          when v_category <> '' and c.slug = v_category then 'category_match'
          when v_query <> '' and (f.question ilike '%' || v_query || '%' or f.answer ilike '%' || v_query || '%') then 'text_match'
          when f.language = p_fallback_language and f.language <> p_primary_language then 'language_fallback'
          else 'text_match'
        end as relevance_reason_code
      from public.knowledge_faq_items f
      left join public.knowledge_categories c on c.id = f.category_id
      where f.organization_id = p_organization_id
        and f.status = 'published'
        and f.visibility in ('customer', 'public')
        and f.language in (p_primary_language, p_fallback_language)
        and (
          v_query = ''
          or f.question ilike '%' || v_query || '%'
          or f.answer ilike '%' || v_query || '%'
          or (v_category <> '' and c.slug = v_category)
        )
    ),
    ranked as (
      select distinct on (source_id)
        source_id,
        source_type,
        title,
        slug,
        language,
        version,
        updated_at,
        relevance_score,
        case
          when is_language_fallback and relevance_reason_code <> 'category_match' then 'language_fallback'
          else relevance_reason_code
        end as relevance_reason_code
      from candidates
      where relevance_score >= v_min_score
      order by source_id, relevance_score desc, version desc, updated_at desc
    ),
    ordered as (
      select *
      from ranked
      order by relevance_score desc, version desc, updated_at desc, source_id asc
      limit v_max_sources
    )
    select jsonb_agg(
      jsonb_build_object(
        'source_id', source_id,
        'source_type', source_type,
        'title', title,
        'slug', slug,
        'language', language,
        'version', version,
        'relevance_score', relevance_score,
        'relevance_reason_code', relevance_reason_code,
        'updated_at', updated_at
      )
      order by relevance_score desc, version desc, updated_at desc, source_id asc
    )
    from ordered
  ), '[]'::jsonb);
end;
$$;

create or replace function public._sai_knowledge_sources_equal(
  p_left jsonb,
  p_right jsonb
)
returns boolean
language sql
immutable
set search_path = public
as $$
  select coalesce(p_left, '[]'::jsonb) = coalesce(p_right, '[]'::jsonb);
$$;

create or replace function public._sai_knowledge_result_status(p_sources jsonb)
returns text
language sql
immutable
set search_path = public
as $$
  select case
    when jsonb_array_length(coalesce(p_sources, '[]'::jsonb)) > 0 then 'complete'
    else 'needs_human_knowledge_review'
  end;
$$;

revoke all on function public._sai_knowledge_retrieve_lock_key(uuid, uuid) from public, anon, authenticated, service_role;
revoke all on function public._sai_knowledge_is_known_locale(text) from public, anon, authenticated, service_role;
revoke all on function public._sai_knowledge_sanitize_locale(text) from public, anon, authenticated, service_role;
revoke all on function public._sai_knowledge_resolve_search_languages(uuid, text) from public, anon, authenticated, service_role;
revoke all on function public._sai_knowledge_build_retrieval_query(text, text, text, text) from public, anon, authenticated, service_role;
revoke all on function public._sai_knowledge_catalog_hash(uuid, text, text) from public, anon, authenticated, service_role;
revoke all on function public._sai_knowledge_rank_sources(uuid, text, text, text, text) from public, anon, authenticated, service_role;
revoke all on function public._sai_knowledge_sources_equal(jsonb, jsonb) from public, anon, authenticated, service_role;
revoke all on function public._sai_knowledge_result_status(jsonb) from public, anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- 3. retrieve_organization_support_case_knowledge
-- ---------------------------------------------------------------------------
create or replace function public.retrieve_organization_support_case_knowledge(p_case_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_case public.organization_support_cases;
  v_understanding public.organization_support_case_understandings;
  v_existing public.organization_support_case_knowledge_contexts;
  v_context jsonb;
  v_current_hash text;
  v_primary_language text;
  v_fallback_language text;
  v_query text;
  v_catalog_hash text;
  v_sources jsonb;
  v_status text;
  v_now timestamptz := now();
  v_engine_key text := 'canonical_support_knowledge_rules';
  v_engine_version text := 'rules-v1';
  v_created boolean := false;
  v_source_count integer;
begin
  perform public._irp_require_permission('support.view');
  v_org_id := public._mta_require_organization();

  perform pg_advisory_xact_lock(public._sai_knowledge_retrieve_lock_key(v_org_id, p_case_id));

  select * into v_case
  from public.organization_support_cases c
  where c.id = p_case_id
    and c.organization_id = v_org_id;

  if v_case.id is null then
    raise exception 'Case not found';
  end if;

  select * into v_understanding
  from public.organization_support_case_understandings u
  where u.organization_id = v_org_id
    and u.case_id = p_case_id;

  if v_understanding.id is null then
    raise exception 'support_knowledge_understanding_required';
  end if;

  v_context := public._sai_inbound_message_set_context(v_org_id, p_case_id);
  v_current_hash := v_context ->> 'message_set_hash';

  if v_understanding.message_set_hash is distinct from v_current_hash then
    raise exception 'support_knowledge_understanding_stale';
  end if;

  select l.primary_language, l.fallback_language
  into v_primary_language, v_fallback_language
  from public._sai_knowledge_resolve_search_languages(v_org_id, v_understanding.language) l;

  v_query := public._sai_knowledge_build_retrieval_query(
    v_case.subject,
    v_understanding.summary,
    v_understanding.intent,
    v_understanding.category
  );

  v_catalog_hash := public._sai_knowledge_catalog_hash(v_org_id, v_primary_language, v_fallback_language);

  select * into v_existing
  from public.organization_support_case_knowledge_contexts k
  where k.organization_id = v_org_id
    and k.case_id = p_case_id;

  if found
    and v_existing.understanding_message_set_hash = v_current_hash
    and v_existing.knowledge_catalog_hash = v_catalog_hash
    and v_existing.engine_key = v_engine_key
    and v_existing.engine_version = v_engine_version then
    return jsonb_build_object(
      'case_id', p_case_id,
      'created', false,
      'status', v_existing.status,
      'sources', coalesce(v_existing.sources, '[]'::jsonb),
      'source_count', jsonb_array_length(coalesce(v_existing.sources, '[]'::jsonb)),
      'engine_key', v_existing.engine_key,
      'engine_version', v_existing.engine_version,
      'retrieved_at', v_existing.retrieved_at
    );
  end if;

  v_sources := public._sai_knowledge_rank_sources(
    v_org_id,
    v_query,
    v_understanding.category,
    v_primary_language,
    v_fallback_language
  );
  v_status := public._sai_knowledge_result_status(v_sources);
  v_source_count := jsonb_array_length(coalesce(v_sources, '[]'::jsonb));

  if found
    and v_existing.understanding_message_set_hash = v_current_hash
    and v_existing.engine_key = v_engine_key
    and v_existing.engine_version = v_engine_version
    and v_existing.knowledge_catalog_hash is distinct from v_catalog_hash
    and v_existing.status = v_status
    and public._sai_knowledge_sources_equal(v_existing.sources, v_sources) then
    update public.organization_support_case_knowledge_contexts
    set
      knowledge_catalog_hash = v_catalog_hash,
      updated_at = v_now
    where organization_id = v_org_id
      and case_id = p_case_id;

    return jsonb_build_object(
      'case_id', p_case_id,
      'created', false,
      'status', v_existing.status,
      'sources', coalesce(v_existing.sources, '[]'::jsonb),
      'source_count', jsonb_array_length(coalesce(v_existing.sources, '[]'::jsonb)),
      'engine_key', v_existing.engine_key,
      'engine_version', v_existing.engine_version,
      'retrieved_at', v_existing.retrieved_at
    );
  end if;

  v_created := not found
    or v_existing.understanding_message_set_hash is distinct from v_current_hash
    or v_existing.knowledge_catalog_hash is distinct from v_catalog_hash
    or v_existing.engine_key is distinct from v_engine_key
    or v_existing.engine_version is distinct from v_engine_version
    or v_existing.status is distinct from v_status
    or not public._sai_knowledge_sources_equal(v_existing.sources, v_sources);

  insert into public.organization_support_case_knowledge_contexts (
    organization_id,
    case_id,
    sources,
    status,
    understanding_message_set_hash,
    knowledge_catalog_hash,
    engine_key,
    engine_version,
    retrieved_at,
    updated_at
  ) values (
    v_org_id,
    p_case_id,
    coalesce(v_sources, '[]'::jsonb),
    v_status,
    v_current_hash,
    v_catalog_hash,
    v_engine_key,
    v_engine_version,
    v_now,
    v_now
  )
  on conflict (organization_id, case_id) do update set
    sources = excluded.sources,
    status = excluded.status,
    understanding_message_set_hash = excluded.understanding_message_set_hash,
    knowledge_catalog_hash = excluded.knowledge_catalog_hash,
    engine_key = excluded.engine_key,
    engine_version = excluded.engine_version,
    retrieved_at = case when v_created then excluded.retrieved_at else organization_support_case_knowledge_contexts.retrieved_at end,
    updated_at = excluded.updated_at;

  if v_created then
    perform public._sai_log(
      v_org_id,
      'support_case_knowledge_retrieved',
      'support_case',
      p_case_id,
      jsonb_build_object(
        'source_count', v_source_count,
        'source_types', (
          select coalesce(jsonb_agg(distinct elem->>'source_type'), '[]'::jsonb)
          from jsonb_array_elements(coalesce(v_sources, '[]'::jsonb)) elem
        ),
        'relevance_reason_codes', (
          select coalesce(jsonb_agg(distinct elem->>'relevance_reason_code'), '[]'::jsonb)
          from jsonb_array_elements(coalesce(v_sources, '[]'::jsonb)) elem
        ),
        'status', v_status,
        'engine_key', v_engine_key,
        'engine_version', v_engine_version
      ),
      true
    );
  end if;

  return jsonb_build_object(
    'case_id', p_case_id,
    'created', v_created,
    'status', v_status,
    'sources', coalesce(v_sources, '[]'::jsonb),
    'source_count', v_source_count,
    'engine_key', v_engine_key,
    'engine_version', v_engine_version,
    'retrieved_at', case
      when v_created then v_now
      else coalesce(v_existing.retrieved_at, v_now)
    end
  );
end;
$$;

revoke all on function public.retrieve_organization_support_case_knowledge(uuid) from public, anon;
grant execute on function public.retrieve_organization_support_case_knowledge(uuid) to authenticated;
